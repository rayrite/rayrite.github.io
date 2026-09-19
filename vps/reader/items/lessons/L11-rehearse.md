# Lesson 11 · Demo-day rehearsal + runbook + pre-capture fallback

> **Visual aid:** `visual-aids/va10_user_journeys.html`.
> **Time budget:** ~4 hrs · **v1 gate contribution:** `v1.0-rehearsal` — at least 2 dry runs through the 7 user journeys, runbook complete, pre-captured demo report in `Recent reports`.

---

## What this lesson produces

The *demo-day* posture, which is a different posture from "deploy works":

1. **2 rehearsed run-throughs** of the 7 user journeys (in `va10_user_journeys.html`).
2. **A pre-captured "demo day fallback" report** already in `Recent reports`. The judge hits a wall? You hand them the link, the demo continues.
3. **A runbook** that lets a sleep-deprived you, at 7am on demo day, hit one command and see the app working in <30s.
4. **A pre-arranged flight path** for the 4 most-likely failure modes (wall, blocked, OOM-killed, Apache-502).

By the end of this lesson you're not "hoping" the demo works — you're *rehearsed*.

---

## Step 11.1 — The runbook (one file, terminal-friendly)

Write or update `mvp/docs/RUNBOOK-DEMO.md` — **this is the document you have open the morning of**. Not clever, not elegant, just *terse and correct*.

```markdown
# Demo Day Runbook — ScamShield Concierge

## 0) Pre-flight (90 min before)
- [ ] `curl -fs https://<sub.domain>/healthz`            → 200, ok:true, busy:false
- [ ] `https://<sub.domain>/`                           → home loads in browser
- [ ] Open one "demo day fallback" report from Recent reports  → report loads
- [ ] SSH tunnel to VPS open in side terminal, /healthz 200
- [ ] GitHub Actions: no in-progress deploys; main is green

## 1) Demo day prompt — first one (live run)
   Open: https://<sub.domain>/
   Click into Recent reports → open the pre-captured fallback
   Type any of: "rtx 3090", "mac studio", "playstation 5"
   For each:
     - Note live SSE timeline stages
     - Click "Open report" → filter facets, open drawer
     - Show sold/ended breakdown (or honest 1-facet banner)

## 2) If "blocked" (interstitial)
   - Show the typed card
   - Click "Retry"  (the same re-POST)
   - If still blocked → click the "Recent reports" fallback pre-captured entry

## 3) If "sign_in_required" on sold/completed only
   - This is the EXPECTED honest outcome (post-July-2026 eBay)
   - The current-facet report + provenance banner is the answer
   - Optional: "Want to see a full 3-facet capture?" → click the pre-captured fallback

## 4) If the whole app is down (Apache 502 or 504)
   - Run `rehearsal \ tail -f journalctl` in the SSH tunnel tab
   - `ssh ... sudo systemctl status scamshield`   ; `systemctl restart scamshield`
   - If restart fails, fall back to v0.6-mlp-public tag:
       `git push --tags` then re-tag v1.0-demo; auto-deploys.
   - If still broken → switch screen-share to "Recent reports → pre-captured"

## 5) After the demo (don't forget)
   - `journalctl -u scamshield --since "30 minutes ago"`   save it
   - `du -sh /opt/scamshield/data/jobs/`                   note disk usage
   - `mvp/docs/DEMO-NOTES.md`  write what surprised you

## 6) Sleep
   - The judge will like it.
```

Commit. Print. Pin to your wall.

---

## Step 11.2 — Rehearsal #1: cold-start

> The "cold start" is the moment you find out whether all your service dependencies are actually correct. **Run this at least 4 hours before the demo.**

- Reboot the VPS. (`sudo reboot`.)
- Wait for `systemctl status scamshield` to report `active`.
- `curl http://127.0.0.1:8787/healthz` → 200.
- Visit `https://concierge.<your-domain>/` — HTTPS works.
- Submit "rtx 3090". Watch SSE. Click through to the report.

If any step fails, the playbook is:
1. `journalctl -u scamshield --no-pager -n 200`  ← read this first
2. `systemctl restart scamshield`                ← if it's a one-off
3. Re-deploy previous tag (L10 roll-back step)   ← if it's a code change

Save the output of every step you run, even when it works — your L12 baseline is "what green looks like".

---

## Step 11.3 — The pre-captured demo fallback

> *This is the demo's safety net.* Even if eBay is rate-limiting your IP *at that very moment*, you have one saved report that is known-good and reachable via the `Recent reports` list on the home page.

Trigger a high-quality capture *hours* before the demo:

```powershell
$base = "https://concierge.<your-domain>"
# 1) Force a healthy live capture (current facet, full ~150-card depth)
$r = Invoke-WebRequest "$base/api/jobs" -Method POST -Headers @{"content-type"="application/json"} `
   -Body '{"query":"rtx 3090"}' -SkipCertificateCheck
$jobId = ($r.Content | ConvertFrom-Json).jobId
echo "demo-day-fallback jobId = $jobId"

# 2) Wait until done
while ($true) {
  $s = (Invoke-WebRequest "$base/api/jobs/$jobId/status" -SkipCertificateCheck).Content | ConvertFrom-Json
  if ($s.state -eq "done") { break }
  Start-Sleep -Seconds 5
}

# 3) Confirm via:
(Invoke-WebRequest "$base/report/$jobId/" -SkipCertificateCheck).StatusCode   # 200
```

> If eBay is rate-limiting, the pre-capture is **replayed offline** from the captured MHTML files:

```bash
# On the VPS, offline (zero browser, zero eBay):
ssh scamshield@<VPS_IP> "node /opt/scamshield/app/cli.js replay --dir=/opt/scamshield/golden/test01 --query='rtx 3090'"
# This will append a new entry to /opt/scamshield/data/jobs/, and the report is reachable at /report/<new id>/.
```

Either way, save the resulting `reportUrl` into the demo-day printed runbook. The judge's first slide shows that URL.

---

## Step 11.4 — Rehearsal #2: timed dry-run

Time-box this. **Five minutes**, start to finish.

- T-0: open `https://concierge.<your-domain>/`
- T+30s: submit a query (use the pre-captured one if you want to skip waiting for SSE)
- T+45s: in "demo mode", narrate the SSE timeline as if a judge is watching
- T+2:00: click "Open report"
- T+2:30: filter a facet, open a listing drawer, point at the price band
- T+3:30: open the "Recent reports" fallback. Open a second report. Click between the two.
- T+4:30: intentionally trigger the "blocked" path. Click Retry. (Or skip this if the rate-limiter won't allow a forced block.)
- T+5:00: stop.

> The point of the timed dry-run is to find *friction*, not to impress. Anything that takes more than a few seconds more than you expected is friction. Note it; fix it; redo the run.

Common friction points (from past demos):

- The home page form is *too* minimal and the judge doesn't see how to submit. → add a placeholder example, a small "Try: 'rtx 3090'" line.
- The summary band text is too small on a projected screen. → bump `font-size` to `clamp(15px, 1.4vw, 18px)` on the summary band.
- The "View report →" link isn't prominent. → make it a button.

Fix the friction; commit; tag `v1.0-rehearsal`.

---

## Step 11.5 — The 4 most-likely failure modes (and the playbook)

| Failure | Detection | Recovery path |
|---|---|---|
| **Wall** ("blocked" / "sign_in_required") | typed card on home page | click Retry; if 3 in a row, switch to fallback pre-capture |
| **OOM-killed** (Node service crashed) | `/healthz` returns 502; journalctl shows `oom-kill` | `sudo systemctl restart scamshield`; if it crashes again within 5s, `SSC_TARGET_CARDS=80` env override then restart (smaller MHTML peak) |
| **Apache 502** | `/` returns 502 from Apache; `/healthz` directly on VPS is 200 | check Apache config: `sudo /scripts/rebuildhttpdconf && sudo /scripts/restartsrv_httpd`; if still 502, revert to v0.6-mlp-public tag (forces Apache reload via deploy) |
| **App boots but `eBay` first capture hits "blocked" for 5 minutes straight** | 5 consecutive blocked facet results | use the fallback pre-capture; the demo flow is unbroken |

> Each of these is a *known* failure. None of them is "the demo is over." That's the principle. Rehearse each one *on purpose at least once* before the demo.

---

## Step 11.6 — The "DEMO-NOTES.md" template (write this DURING the demo)

Right after the demo, you'll be too tired to remember what surprised you. The discipline is to jot notes *while it happens*.

`mvp/docs/DEMO-NOTES.md` skeleton:

```markdown
# Demo notes — YYYY-MM-DD

## Setup summary
- audience: [how many, what background]
- network: [wifi vs ethernet; what was the actual latency]
- time of day: [helps correlate with eBay's traffic patterns]

## What worked
- …
- …

## What surprised me
- (e.g. "the SSE buffered for 8s on first call, then steady")
- (e.g. "one facet hit 'sign_in_required' even on `current` once — never seen that before; check logs")

## Judge questions
- Q: <one>
- A: <what I said>
- A: <what I should have said next time>

## Action items (for the next iteration)
- [ ] add a 'copy report URL to clipboard' button
- [ ] pre-fetch the SSE endpoint to warm up TLS session
- [ ] …

## Logs
- paste journalctl -u scamshield --since "demo time"  →  mvp/docs/logs/demo-yyyy-mm-dd.log
```

> The first iteration is rough. The second is better. By the third demo you give, the demo is calm.

---

## Step 11.7 — Tag the rehearsal checkpoint

```powershell
git add -A
git commit -m "demo: runbook + demo-notes template + rehearsal report captured; v1.0-rehearsal"

# tag the rehearsal commit; do NOT overwrite v1.0-demo (the deployed production one)
git tag -a v1.0-rehearsal -m "Runbook complete; 2 cold/warm dry runs logged; fallback report ready"
git push --tags
```

---

## Step 11.8 — Optional: the "tell your story" microcard

In 30 seconds, every judge should walk away knowing:

> "ScamShield is an eBay-listing lie detector. You type what you're looking for, the app drives a real browser through eBay's three search facets (current, completed, sold), captures all of it as forensic evidence (SHA-256 hashed, timestamped), parses it offline, computes an honest price band and a scam-risk flag, and serves an interactive report. The single runtime dependency is Playwright. Everything between query and report is streamed live over SSE — every failure is reported honestly as a typed state. The dashboard computes bands client-side from `data.js`, so any report renders from any `data.js` with zero server work."

Write that paragraph into `mvp/docs/README.md` (or the team-facing part of your repo). It's what you say while the page loads. Doesn't matter if the judge reads the README later; what matters is you said it cleanly when it mattered.

---

## Step 11.9 — Tagging the v1 demo checkpoint

```powershell
git tag -a v1.0-demo -m "Demo-ready: backed by tag-based rollback; cold/warm runs logged; runbook + DEMO-NOTES.md in place"
git push --tags
```

---

## Anti-patterns to avoid

- ⛔ **Don't rehearse in the same shell as the demo.** Use a fresh SSH session and a fresh browser profile.
- ⛔ **Don't pretend the wall is a bug.** Demonstrate it; explain it (auth boundary, not bot block); show the typed card; click Retry. This is *the* moment that separates you from a fly-by-night scraper.
- ⛔ **Don't promise more than your code can do.** The honest current-only report is fine; saying "we have sold data" when you have the wall note is a credibility sink.
- ⛔ **Don't forget to write DEMO-NOTES.md during the demo.** A 30-second note is worth an hour of memory the next morning.

---

## What "done" means for Lesson 11

```powershell
# 1) Runbook complete (mvp/docs/RUNBOOK-DEMO.md) and committed
# 2) Demo fallback report URL pasted in the runbook
# 3) Two dry runs logged (cold-start + timed) in mvp/docs/rehearsal-notes.md
# 4) Tag v1.0-rehearsal exists
```

Once those four are true, you're ready for **demo day**. (Optional: print `RUNBOOK-DEMO.md` and pin it over your monitor; old-school works.)

L12 is the *morning after* lesson — backups, observability, and the small hardening wins that buy sleep.
