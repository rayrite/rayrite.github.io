# Lesson 19 · When things break — incident-response patterns for solo operators

> **Time budget:** ad-hoc (the lesson is read *before* the incident, ideally).
> **Audience:** anyone who wakes up to /healthz=502, ssh hangs, or "the demo broke and I can't tell why."

---

## The asymmetry of being solo

When an entire ops team exists, an outage is "wake someone up, follow the runbook, write the post-mortem tomorrow." When *you* are the team, the runbook is in your head and panic is a free side-effect.

This lesson codifies what to do *before* and *during* an incident, so the day something breaks, your prep pays off.

---

## Step 19.1 — The "at 2am" decision tree

When you're called (by yourself, by Slack, by a teammate), run the *exact* same sequence every time:

```
1. State the problem in one sentence.
2. Look at status.sh (L12).
3. Look at the most recent journalctl output for the unit.
4. Look at the most recent commit + the most recent tag.
5. Make ONE change, then wait & observe.
6. If two changes are made without observing, you don't know which helped.
```

> **The discipline is "ONE change per observation."** Most escalations happen because someone "tries a few things" and we can't tell which one fixed it. Don't.

---

## Step 19.2 — Incident categories and their canonical response

| Category | Symptom | First action | Reasoning |
|---|---|---|---|
| App down (502/504 from Apache) | curl https://<sub.domain> → 502 | `journalctl -u scamshield --no-pager -n 50` | Apache says "the backend is bad." Find out what the backend said last. |
| App hangs (curl times out) | curl http://127.0.0.1:8787 → hangs | `systemctl status scamshield` | Service exists; maybe OOM-killed mid-restart. |
| App crashes repeatedly | every 5–10s new instance dies | `journalctl` for the last 5 crash memos | Identify the *trigger pattern*: most crashes aren't random. |
| Disk full | `df -h` 100% | `du -sh /opt/scamshield/data/jobs/* \| sort -h \| tail -10` | Targeted `rm -rf` of the *oldest* job dir, then re-prune. |
| Memory pressure | swap use > 0; `free -m` low | `systemctl show scamshield --property=MemoryCurrent` | If it's near the cgroup MemoryHigh, force `target` lower temporarily. |
| eBay wall (legit) | all jobs `sign_in_required` or `blocked` | do nothing for 10–30 min | The wall exists. Pretending you can fight it breaks your IP reputation. |
| cert renew failed | `https://<sub.domain>` cert expired | `whmapi1 ssl-status`; check logs | AutoSSL's renewal failed; re-run it once offline (see L9). |
| SSH tunnel blocked | ssh -L hangs | `ssh -i <key> scamshield@<VPS_IP> "whoami"` (direct) | Some networks proxy HTTP too aggressively. Direct SSH avoids them. |
| Disk I/O ceiling | `iostat` shows 100% util during capture | reduce `target` to 120 | Capture writes N MB across writes; lower N to lower I/O. |

---

## Step 19.3 — The "stop and write things down" rule

Before changing anything, write down:

```
Time: 04:17Z
Symptom: /healthz = 502; journalctl shows "code=killed, signal=KILL"
Last change: deployed v1.0-demo at 23:42Z yesterday
Last successful job: 23:39Z (state=done)
Memory at last check (show status.sh): 384M current, 1500M high
What I will try: bump SSC_TARGET_CARDS=200 → 130, restart.  Reason: capture peak RAM is ~780M; sustained RAM 384M is normal; last change after 23:39Z suggests an OOM during a peak.
```

A 30-second note now is a 30-minute saved later. Write it.

---

## Step 19.4 — The "rollback to last known-good tag" pattern

> *This is the single most valuable command you'll ever learn.*

```bash
ssh scamshield@<VPS_IP> "cd /opt/scamshield/app && git tag --sort=-creatordate | head -5"
# → v1.0-demo · v1.0-rehearsal · v1.0-hardened · v0.6-mlp-public · v0.5-vps-tunnel
```

Pick the *second-to-last* as the rollback target (the last is your suspect). On your laptop:

```powershell
git tag -a v1.0-rollback-YYYY-MM-DD -m "incident — rolling back to v0.6-mlp-public"
git push --tags
```

Deploy workflow runs. Gate passes. Unit restarts. /healthz green.

> Rollback doesn't *fix* the bug. It *reverts to a state where the bug doesn't exist*. That's the next hour's job. But the demo / the customer / the SLA is back up.

---

## Step 19.5 — A "blast radius" decision (don't broadcast changes)

When fixing something live, classify the change:

| Type | Examples | Action |
|---|---|---|
| **Read-only** (logs, queries, status) | `journalctl`, `df`, `du`, `bash status.sh` | safe; do anytime |
| **Restart the unit** | `systemctl restart scamshield` | interrupts in-flight job; brief 1-2s downtime; OK except during demo |
| **Hot config (env)** | `systemctl edit scamshield.service; Environment=...; sudo systemctl restart` | short downtime; the change is preserved across restarts |
| **Code change** | `rsync` a new `lib/foo.js`, restart | tests may not have passed; weigh risk |
| **Tag rollback** | re-deploy previous tag | full ~2-min deploy; reverts ALL recent changes |
| **Manual edit on VPS** | `vim /opt/scamshield/app/lib/foo.js` | bypasses CI / tests; dangerous — only if you know why |

For Buildathon: prefer **tag rollback** to "code change + restart." Rollback is one tested path; manual edits aren't.

---

## Step 19.6 — Capture the post-incident (15 minutes, max)

After the fire's out, fill this in *while it's fresh*:

```markdown
# Incident — YYYY-MM-DD HH:MMZ

## What happened (one paragraph)
[user-facing impact; what was down; for how long]

## What fixed it
[the ONE change that resolved it; tested how]

## Timeline
- HH:MMZ — symptom first observed
- HH:MMZ — first hypothesis
- HH:MMZ — first action taken
- HH:MMZ — escalation point
- HH:MMZ — resolved

## What we should have done faster
[the thing we noticed but didn't act on; the runbook step we missed]

## What we'll change
[observation → concrete action with owner and date]

## Lesson for the next person
[one sentence]
```

The post-incident doc lives at `mvp/docs/incidents/YYYY-MM-DD.md`. After a handful, you'll have a *manual* your future self can cite when something similar happens.

---

## Step 19.7 — The "thawing" pattern (after a long downtime)

Cold-start issues compound:

```bash
# Rehearsal checklist (L11 covers this; reuse it):
sudo systemctl restart scamshield
sleep 2
bash /opt/scamshield/scripts/status.sh
# 7 lines: expect all OK
curl -sk https://<sub.domain>/healthz
# expect 200
# Submit a small job; expect full SSE timeline + reportUrl
```

If *any* step fails, the longer-down environment has probably drifted (disk full, cert expired, package-lock drift). The pattern is to fix *one* of those, then re-run the rehearsal.

---

## Step 19.8 — Specific ScamShield-Concierge footguns

These three take out 80% of "what broke?" tickets in this codebase:

### A — Chromium sandbox + EL9 kernel updates

```bash
# After a kernel update + reboot:
journalctl -u scamshield --no-pager -n 50 | grep -i sandbox
# If "Failed to move into new namespace" → unprivileged user namespaces disabled.
# Verify:
cat /proc/sys/kernel/unprivileged_userns_clone
# if 0:
echo "kernel.unprivileged_userns_clone=1" > /etc/sysctl.d/99-scamshield.conf
sysctl --system
```

### B — Disk filled by captures

```bash
# Symptom: jobs fail with "ENOSPC" in journalctl
du -sh /opt/scamshield/data/jobs/* | sort -h | tail -5
# pick the oldest; rm -rf one or two large ones
sudo systemctl start scamshield
# Optional: lower prune keep to 10:
# (in /etc/systemd/system/scamshield.service override): Environment=SSC_PRUNE_KEEP=10
```

### C — Cron silently stopped (a midnight cron doesn't tell you it didn't run)

```bash
# Verification crons live here:
crontab -l
# Run them by hand once
bash /opt/scamshield/scripts/backup.sh
bash /opt/scamshield/scripts/security_smoke.sh
```

---

## Step 19.9 — The "abandon ship" pattern (data-tier only)

> *When the metadata-tier is unreachable (NFS died, rsync partner is gone), the read-only / report path keeps serving the last-known reports. The home page can show:*

```
[warn] data tier unreachable; serving from local cache.
```

That's a real lesson. The `/api/jobs` *list* is the only thing that fails; `/report/<id>/` still works if the files are local. To enable this:

```js
// in lib/jobs.js
export async function readJobOrCached(dataDir, id) {
  try {
    return await readJob(dataDir, id);
  } catch {
    // fallback: read job.json from a local cache dir
    const cached = path.join("/opt/scamshield/cache/jobs", id, "job.json");
    try { return JSON.parse(await fs.readFile(cached, "utf8")); }
    catch { throw new Error("not found"); }
  }
}
```

Add the cache write to the orchestrator's success path:

```js
// after buildReport:
await fs.mkdir(`/opt/scamshield/cache/jobs/${id}`, { recursive: true });
await fs.copyFile(path.join(jobDir, "job.json"), `/opt/scamshield/cache/jobs/${id}/job.json`);
```

> This is *graceful degradation*, not full offline mode. But it's the difference between "we can't serve the home page" and "the home page lists the last 5 reports we have cached."

---

## Step 19.10 — The "go ahead and ship" pattern (the most counter-intuitive lesson of the lot)

> When you're panicking at 2am, the worst thing you can do is ship a "fix" you didn't have time to think about.

It's almost always better to:

- **Rollback to the last working tag** (L10 sets up this one-liner).
- **Document the incident** (`mvp/docs/incidents/<date>.md`) with a placeholder for the fix.
- **Sleep on it. Fix it tomorrow.**

The instinct to fix-it-now is responsible for many of the worst outages that *started small*. A rollback is fully recoverable; a rushed fix is not.

---

## Anti-patterns to avoid

- ⛔ **Don't SSH into the VPS and `vim` production files live.** That change bypasses the entire CI/CD chain. Tag, push, deploy.
- ⛔ **Don't run `rm -rf /` to "free up disk."** Even when desperate. Target the largest `data/jobs/<oldest>` directories explicitly.
- ⛔ **Don't follow the "first guess" on failure.** Read the actual journalctl first. Most "the app is broken" tickets are misreading logs.
- ⛔ **Don't write a fix and deploy without running tests.** The CI gate is one push away.
- ⛔ **Don't skip the post-incident doc.** Tomorrow-you will think "oh I'll remember what happened." You won't.

---

## What "done" means for Lesson 19

1. You have `mvp/docs/incidents/.gitkeep` and the README instructs the next operator to write there.
2. You have a `RUNBOOK-DEMO.md` *and* an `RUNBOOK-INCIDENT.md` (the latter being simpler; L12 adds the former).
3. You have rehearsed the rollback ladder ONCE (roll forward, roll back, roll forward) without incident.
4. You have a personal rule: "**one change per observation**" — broken in spirit every time you skip it.
5. You write down *what you'll do differently next time* in the post-incident doc.

> After about 3 incidents, your runbook becomes a *real* runbook, not a hopeful one. Most apps in this space don't have 3 incidents a year — that's the upside of small surface, file-based state, and zero dependencies.

*Next: L20 — onboarding the next person to take this over (operator handoff).*
