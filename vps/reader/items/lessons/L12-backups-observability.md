# Lesson 12 · Backups + observability + final hardening (the morning-after layer)

> **Visual aid:** `visual-aids/va11_security_threat_model.html`.
> **Time budget:** ~4 hrs · **v1 gate contribution:** `v1.0-hardened` — JetBackup runs nightly, journalctl dashboard scripted, restore-from-backup test successful.

---

## What this lesson produces

The *sleep better at night* pieces:

1. **JetBackup nightly** of `/opt/scamshield/data/` (jobs + auth + golden) to cPanel home, retained 14 days.
2. **A dashboard shell script** (`status.sh`) that prints 7 green/red lines — `/healthz`, disk, memory, last-job outcome, last-deploy tag, cert expiry, AutoSSL renewal.
3. **A baseline journalctl capture**, so "what green looks like" is forever a one-file diff.
4. **Restore-from-backup dry-run**, written once and tested.

This is the last lesson of the v1 milestone. By the end, demo day and *demo-day+1* (and every day after) are both routine.

---

## Step 12.1 — JetBackup (the cPanel-native answer)

LiquidWeb / cPanel ships **JetBackup** as a paid add-on. Even on a basic Admin tier you typically have access to *some* backup feature. Three options, in order of preference:

| Option | Where | Cost | Works |
|---|---|---|---|
| JetBackup 5 (full) | WHM → JetBackup | licensed | entire data/, with 14-day restore points |
| cPanel Backup (built-in) | WHM → Backup Configuration | free | weekly+monthly; coarser retention |
| Manual nightly tar | a cron under `scamshield`'s home | free | whatever you script, often as good |

If you have **JetBackup 5**:

1. WHM → *Backup Configuration* → enable **Backup Archives**.
2. WHM → *Backup Destinations* → add a destination (Local, FTP, S3 — LiquidWeb's default Local is fine for the first pass).
3. WHM → *Backup User Selection* → include your `scamshield` cPanel account.
4. *Backup Schedule*: daily at 04:00 (off-peak), retained 14 days.
5. *Add backup directive*: include `/opt/scamshield/data/` (which is outside the cPanel account by default — see step 12.2).

> JetBackup's strength is *point-in-time granularity*. The 04:00 nightly is the routine; the "restore this single job from yesterday" feature is what saves you on demo-+1.

If you don't have JetBackup or the cPanel account is restrictive:

```bash
# as scamshield, nightly cron
cat > /opt/scamshield/scripts/backup.sh << 'EOF'
#!/usr/bin/env bash
set -euo pipefail
TS=$(date -u +%Y%m%d)
DEST=/home/scamshield/backups/data-$TS.tgz

# Big enough to include captures (the evidence store)
tar -czf "$DEST" -C /opt/scamshield data

# Prune old backups (keep 14 days)
find /home/scamshield/backups -type f -name "data-*.tgz" -mtime +14 -delete
EOF
chmod +x /opt/scamshield/scripts/backup.sh

# cron entry
(crontab -l 2>/dev/null; echo "0 4 * * * /opt/scamshield/scripts/backup.sh >> /home/scamshield/backups/backup.log 2>&1") | crontab -
```

Add `/home/scamshield/backups` to your JetBackup **destination** so the backup-of-backups rule applies. Two layers of redundancy is *cheap*.

---

## Step 12.2 — Add `/opt/scamshield/data/` to JetBackup explicitly

> /opt/scamshield/data/ lives *outside* the cPanel account root. Some cPanel configurations back up *only* account roots. Verify the include in WHM → Backup → *User Files*:

- **Files to backup** → add `/opt/scamshield/data/` to the *additional paths*.
- Run a *manual backup now* to confirm the path is picked up; verify the resulting archive contains `jobs/<id>/captures/current.mhtml`.

This is the part most operators forget — the data ends up on `/dev/null` because nobody added it. Easy fix; takes 1 minute; do it now.

---

## Step 12.3 — `status.sh` (the one-line health snapshot)

This script lives under `/opt/scamshield/scripts/`, is callable from the SSH tunnel, and outputs 7 lines that any teammate can read. It's the "is everything okay?" answer.

`/opt/scamshield/scripts/status.sh`:

```bash
#!/usr/bin/env bash
set +e                       # status script: we WANT to see all 7 lines even if one is red

c_green=$(printf '\033[0;32m'); c_red=$(printf '\033[0;31m'); c_gray=$(printf '\033[0;90m'); c_reset=$(printf '\033[0m')

status() { printf "  [%b] %-22s %s\n" "$1" "$2" "$3"; }

ok()   { status "${c_green}OK${c_reset}" "$1" "$2"; }
warn() { status "${c_red}WARN${c_reset}" "$1" "$2"; }
gray() { status "${c_gray}--${c_reset}"  "$1" "$2"; }

echo "== ScamShield status ($(date -u +%FT%TZ)) ="

# 1) /healthz
HZ=$(curl -fs --max-time 4 http://127.0.0.1:8787/healthz 2>/dev/null)
if [ -n "$HZ" ] && echo "$HZ" | grep -q '"ok":true'; then
  ok "/healthz" "$HZ"
else
  warn "/healthz" "no response from 127.0.0.1:8787"
fi

# 2) systemctl
if systemctl is-active --quiet scamshield; then
  ok "systemd" "$(systemctl is-active scamshield)"
else
  warn "systemd" "$(systemctl is-active scamshield) — try restart"
fi

# 3) disk usage of /opt/scamshield/data
USED=$(du -sh /opt/scamshield/data 2>/dev/null | awk '{print $1}')
DISK_FREE=$(df -h /opt 2>/dev/null | awk 'NR==2 {print $4 " free (" $5 " used)"}')
ok "disk data=${USED:-?}" "$DISK_FREE"

# 4) memory + cgroup
MEM=$(systemctl show scamshield --property=MemoryCurrent 2>/dev/null | cut -d= -f2)
MEM_HI=$(systemctl show scamshield --property=MemoryHigh 2>/dev/null | cut -d= -f2)
ok "memory cgroup" "current=${MEM:-?} high=${MEM_HI:-?}"

# 5) last job outcome
LAST=$(ls -1t /opt/scamshield/data/jobs 2>/dev/null | head -1)
if [ -n "$LAST" ]; then
  ST=$(jq -r .state /opt/scamshield/data/jobs/"$LAST"/job.json 2>/dev/null)
  ok "last job" "$LAST — $ST"
else
  gray "last job" "(none yet)"
fi

# 6) deployed tag (from a sentinel file we write on each deploy)
if [ -f /opt/scamshield/app/.deployed-tag ]; then
  ok "deployed tag" "$(cat /opt/scamshield/app/.deployed-tag)"
else
  gray "deployed tag" "no sentinel yet"
fi

# 7) cert expiry (openssl)
DOMAIN="${SSC_DOMAIN:-concierge.<your-domain>}"
EXP=$(echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN":443 2>/dev/null | openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)
if [ -n "$EXP" ]; then
  DAYS=$(( ( $(date -d "$EXP" +%s) - $(date +%s) ) / 86400 ))
  if [ "$DAYS" -gt 14 ]; then ok "cert TLS" "${DAYS}d remaining"
  elif [ "$DAYS" -gt 0 ]; then warn "cert TLS" "${DAYS}d remaining — RENEW SOON"; fi
else
  warn "cert TLS" "could not parse cert"
fi

# 8) AutoSSL last run
AUTO=$(whmapi1 -a ssl-status host="$DOMAIN" 2>/dev/null | tr -d '"' | awk '/owner/ {print; exit}')
ok "AutoSSL" "${AUTO:-disabled or not queryable via whmapi1}"

echo "== done =="
```

After every successful CI deploy, write the sentinel so this report is honest:

```yaml
# append to .github/workflows/deploy.yml
- name: Write deployed tag
  run: |
    ssh ${{ secrets.VPS_USER }}@${{ secrets.VPS_HOST }} \
      "echo '${{ github.ref_name }}' | sudo tee /opt/scamshield/app/.deployed-tag"
```

Mark executable, run it on the VPS:

```bash
chmod +x /opt/scamshield/scripts/status.sh
bash /opt/scamshield/scripts/status.sh
```

Expected:

```
== ScamShield status (2026-09-20T16:34:12Z) =
  [OK] /healthz              {"ok":true,"busy":false,"env":"prod"}
  [OK] systemd               active
  [OK] disk data=120M        48G free (3% used)
  [OK] memory cgroup         current=384M high=1.5G
  [OK] last job              20260918-141053-a1b2c3 — done
  [OK] deployed tag          v1.0-demo
  [OK] cert TLS              89d remaining
  [OK] AutoSSL               ...
```

> Pin a copy of *this output* in `mvp/docs/baselines/<date>.status` — that's your "what green looks like forever" reference.

---

## Step 12.4 — A baseline journal capture

On a freshly-good morning:

```bash
ssh scamshield@<VPS_IP> "sudo journalctl -u scamshield --since '24 hours ago'" \
  | tee mvp/docs/baselines/$(date -u +%Y-%m-%d).journal.log
```

The next time someone says "is it normal that...", the answer is a `diff` against this file.

---

## Step 12.5 — Restore-from-backup dry-run (do this once, write it down)

> *The test of a backup is the restore.* A demo-day-1 backup that you can't restore is the same as no backup.

Pick the most recent `data-YYYYMMDD.tgz` from JetBackup (or `/home/scamshield/backups/`). In a *spare* test directory:

```bash
mkdir -p /tmp/restore-test
cd /tmp/restore-test
tar -xzf /home/scamshield/backups/data-YYYYMMDD.tgz

# peek at the data
ls data/jobs/ | head       # should be the usual yyyymmdd-hhmmss-XXXXXX
ls data/jobs/<one>/captures/   # should contain current.{mhtml,png,html}

# verify MHTML is intact
node -e "
  const fs = require('node:fs');
  const {decodeMhtml} = require('/opt/scamshield/app/lib/mhtml.js');
  const buf = fs.readFileSync('data/jobs/<one>/captures/current.mhtml');
  const html = decodeMhtml(buf);
  console.log('mhtml decoded OK; html bytes =', html.length);
"
# expect: a number; no error
```

> **Document this test in `RUNBOOK-DEMO.md`** as "Step 7: backup integrity":
> ```
> # Restore-from-backup drill (monthly)
> bash /opt/scamshield/scripts/restore_dryrun.sh
> ```
> and put the script in `mvp/docs/scripts/restore_dryrun.sh` and commit it.

---

## Step 12.6 — Hardening, the cherry on top

These are nice-to-haves that cost ~10 minutes each:

### 12.6.1 — `fail2ban` (banner-level, not a banner-defeater)

```bash
sudo dnf install -y epel-release fail2ban
sudo systemctl enable --now fail2ban
# LiquidWeb often has fail2ban pre-configured; if /etc/fail2ban/jail.d/sshd.conf exists, leave it.
```

### 12.6.2 — Disable cPanel's built-in ModSecurity for `/api/jobs/*` (only if it interferes)

> ModSecurity's defaults may block JS-heavy POST bodies from the home page. Symptom: 403 on `POST /api/jobs` from the vhost.

Check:

```bash
sudo tail -n 50 /var/log/apache2/modsec_audit.log 2>/dev/null | head -30
```

If you see a rule ID rejecting the POST, exclude `/api/jobs/` from ModSecurity *for this vhost only*:

```apache
# in your include file
<IfModule security2_module>
  SecRule REQUEST_URI "@streq /api/jobs/" "id:1001, phase:1, t:none, pass, nolog, setvar:tx.cpanel_ignore_jail=1"
  SecRule REQUEST_URI "@beginswith /api/jobs/" "id:1002, phase:1, t:none, pass, nolog, setvar:tx.cpanel_ignore_jail=1"
</IfModule>
```

### 12.6.3 — `node_modules/` cleanup (never auto-bump the major)

In `package.json`, **pin** Playwright:

```json
{
  "dependencies": {
    "playwright": "1.63.0"        # exact, not ^
  }
}
```

A `^` lets minor and patch drift across CI and the VPS. The design doc is explicit: any Chromium *major* bump is gated on the capture canary. Pin the major, and bump deliberately with `npm install playwright@1.64.0` after you've re-run `test/render.test.js`.

### 12.6.4 — A maintenance cron (cheap insurance)

```cron
# Sundays 03:00 — prune the job store (L6 already does this on app restart; this is belt-and-braces)
0 3 * * 0  curl -fs -X POST http://127.0.0.1:8787/_admin/prune -d "{\"keep\":20}" || true

# Mondays 04:00 — exercise the offline replay path (silent canary)
0 4 * * 1  bash /opt/scamshield/scripts/canary_offline_replay.sh >> /home/scamshield/backups/canary.log 2>&1
```

The canary script re-runs the offline replay against a saved golden and writes the result to `canary.log`. If it ever errors, you find out on Monday morning — not on demo day.

```bash
# /opt/scamshield/scripts/canary_offline_replay.sh
#!/usr/bin/env bash
set -euo pipefail
cd /opt/scamshield/app
node cli.js replay --dir=/opt/scamshield/golden/test01 --query='canary' \
  > /tmp/canary.out 2>&1
```

---

## Step 12.7 — The morning-after checklist

After demo day, *before* you collapse:

```powershell
ssh -i $env:USERPROFILE\.ssh\shamshield_deploy scamshield@<VPS_IP> "bash /opt/scamshield/scripts/status.sh"
```

One line at a time:

- ✅ `[OK] /healthz` — sanity.
- ✅ `[OK] systemd` — service survived the demo.
- ✅ `[OK] disk` — captures didn't eat everything.
- ✅ `[OK] memory` — cgroup did its job.
- ✅ `[OK] last job` — most recent run completed (`done`) or typed-error (`error:sign_in_required`) — both are fine.
- ✅ `[OK] deployed tag` — `v1.0-demo` or whatever's current.
- ✅ `[OK] cert TLS` — still 14+ days out.
- ✅ `[OK] AutoSSL` — recent.

> If any line is `[WARN]`, that's the only moment in the day you can fix it calmly. **Pause and fix. Don't "let it slide."**

---

## Step 12.8 — Tag the final checkpoint

```powershell
git add -A
git commit -m "v1: backups (JetBackup + nightly tar), status.sh, restore drill, hardening"
git tag -a v1.0-hardened -m "v1 closed: backup + observability + hardening"
git push --tags
```

---

## Anti-patterns to avoid

- ⛔ **Don't back up to a directory that itself isn't backed up.** `data/` backed up to `backups/` that's only on the VPS → one root disk failure wipes both. Layer.
- ⛔ **Don't skip the restore drill.** A backup you haven't restored is a faith position.
- ⛔ **Don't add nodes to "monitor" before you have a baseline.** `status.sh` is your baseline; add Prometheus / Grafana when v1+ is busy enough that 7 lines aren't enough.
- ⛔ **Don't auto-restart on every error.** `Restart=on-failure` is correct; `Restart=always` will mask real bugs.
- ⛔ **Don't disable SELinux.** It's rarely the bug; if a profile blocks Chromium, write a focused policy.

---

## What "done" means for Lesson 12

```powershell
ssh scamshield@<VPS_IP> "bash /opt/scamshield/scripts/status.sh"
# all 7 lines are [OK]
git tag --list v1.0-*
# v1.0-demo · v1.0-rehearsal · v1.0-hardened

# Restore-from-backup drill success:
node -e "process.exit(0)"   # ^ see Step 12.5
```

---

# 🎉 v1 closed.

You have:

- A deployed app at `https://concierge.<your-domain>` that survives the day.
- A tag-based rollback ladder (v0.0-meta → v1.0-hardened) for any contingency.
- A runbook the morning-of-you can read without thinking.
- A demo-day rehearsal that exposed (and fixed) the friction.
- Backups + observability + hardening that *let you sleep*.

# What's next (post-Buildathon, future lessons)

I'll keep this brief because each is a "v2 spec, write when you're ready":

| Lesson | Topic | When |
|---|---|---|
| L13 | Optional authenticated capture (auth-plan Phase A) — headed login + persistent profile + reuse on every job | when you want 3-facet reports reliable |
| L14 | Optional auth-plan Phase B (TOTP automation, daily caps, re-login) | after L13 has been in production a week |
| L15 | Latency + throughput scaling — splitting capture + analysis onto separate VMs | when DAU > 1k sustained |
| L16 | Multi-region, blue-green deploys, IaC with Terraform | when a single region isn't enough |
| L17 | Observability stack upgrade — Prometheus + Loki + Grafana | when 7 lines aren't enough |
| L18 | RBAC + multi-tenant — `scamshield` becomes `scamshield-{tenant}` | when there are multiple Investigators |
| L19 | Compliance review (SOC 2 / GDPR via the data layer that already exists) | when an enterprise customer asks |

For each of these, the design doc already has the substrate laid out. You mostly grow into them — they don't need pre-emptive work.

# One final thing — *thank you*.

I hope this series was more than a curriculum. The goal was that you finish the Buildathon with:

- A working app on a real server at a real URL
- An understanding of *why each piece exists* (not just *how to type it*)
- The judgment to know which of the v2 lessons matter for *your* version of success
- A baseline you can hand to the next person who joins the project — and they read 5 files, run `npm install`, and they're productive

You already had the hard part: the design decisions. The MVP is proven; what's left is *caring for it* over time, and you've got every tool you need.

Demo day. Go. 🚀
