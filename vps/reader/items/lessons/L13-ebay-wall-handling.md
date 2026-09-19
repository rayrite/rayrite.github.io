# Lesson 13 · When the wall hits — the eBay-day toolkit

> **Time budget:** ad-hoc · **Audience:** anyone who maintains or demos ScamShield Concierge past Buildathon day-1.

---

## Why this lesson exists

The single biggest *runtime* risk on this app isn't a bug in your code — it's **eBay changing behavior faster than you can ship**. The 2026-07-22 sign-in wall proves it: a Monday announcement, every logged-out hit re-routed, every prior pipeline silently degraded.

You didn't fix that problem by improving the pipeline. You fixed it by **deciding what counts as success when the upstream answer is "no"**. This lesson is the toolkit you reach for on the day reality doesn't match your test data.

---

## The 4 wall-states and what each means in practice

The capture state machine (L5 + va06) names 7 facet statuses. Three of them are "wall-shaped" — the user-facing experience is *not a happy-path report*:

| Status | What it means | User-facing language |
|---|---|---|
| `sign_in_required` | final URL host == `signin.ebay.com` (the 2026-07 wall or its variants) | "eBay requires sign-in for sold/completed data (policy change July 2026)" |
| `blocked` | "Pardon our interruption" / PerimeterX markers / small-body 403 | "eBay blocked the automated search" + **Retry** |
| `layout_drift` | `li.s-item` dominant (legacy markup, 2024-era) | "eBay served an older layout; the parser doesn't recognize it yet" |
| `no_results` | "No exact matches" | "No exact matches on eBay for …" |

The first two are *the* walls you're most likely to hit day-of. Let's talk about each.

---

## State 1 — `sign_in_required` (the *architecturally-defined* wall)

This is **not a bug**. It's the design doc's first-class outcome (design.md §3.2). On the day you hit it, the right behavior is:

1. **Show it.** Render the typed card on the home page with the explanation.
2. **Continue.** The other facets (`current`, then `completed`, then `sold`) still execute. `current` is *never* behind the wall (per vendor documentation 2026-08).
3. **Render a degraded report.** The dashboard already supports `current-only` mode via `META.counts.{sold,ended_unsold}` being 0 and `META.facets[].status` carrying `sign_in_required`. You didn't ship a degraded path; you shipped *the* path.
4. **Optionally enable auth** if you've completed L14. That's how you get full 3-facet reports reliably.

If you see `sign_in_required` and are surprised, that's a *demo bug* (you demoed an older behavior expectation), not a code bug.

### Diagnostic one-liner

```bash
# on the VPS, after a job finishes
ssh scamshield@<VPS_IP> "cat /opt/scamshield/data/jobs/<jobId>/job.json | jq '.facets'"
# → shows status per facet
```

If `current.status == "sign_in_required"` (improbable but seen in geo-edge cases), the wall moved. Verify by curling eBay directly:

```bash
curl -I -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' "https://www.ebay.com/sch/i.html?_nkw=rtx+3090"
# → check for signin.ebay.com redirects
```

---

## State 2 — `blocked` (the *negotiation* wall)

This one *is* a runtime probe — eBay doesn't want you hitting it from this IP at this cadence. The honest playbook:

### Pause strategy

| Consecutive `blocked` jobs | What to do |
|---|---|
| 1 | Wait 10 min. Retry. |
| 2 | Wait 30 min. Stop testing from this IP for the rest of the demo. |
| 3+ | Switch to **offline replay**: serve the pre-captured demo report from `Recent reports` (L11). |

> The "circuit breaker" the design doc mentions — at ~5 consecutive blocked jobs, the app parks further attempts for a cooldown window — is the *automated* version of this discipline. If you want this behavior without manual waiting, the next paragraph shows it.

### Adding the circuit breaker to `lib/orchestrator.js`

```js
// in lib/orchestrator.js — append after the 'busy' check
const BLOCK_COOLDOWN_MS = 5 * 60_000;       // 5 minutes
const BLOCKED_THRESHOLD = 5;                // # consecutive 'blocked' facets

async function submit(query) {
  const recent = await listRecentJobs(config.dataDir, { limit: 10 });
  const recentBlocked = recent.slice(0, BLOCKED_THRESHOLD)
    .every((j) => j.state?.startsWith("error:blocked"));
  if (recentBlocked && Date.now() - lastBlockedAt < BLOCK_COOLDOWN_MS) {
    return { error: "circuit_open", remainingMs: BLOCK_COOLDOWN_MS - (Date.now() - lastBlockedAt) };
  }
  // … rest of submit()
}
let lastBlockedAt = 0;
// and when a 'blocked' result lands, set lastBlockedAt = Date.now()
```

### Communicating this to the demo audience (what to *say*)

When a judge is watching and the page produces `blocked`:

> "That's the honest-typed-error path. The app noticed the page markers eBay serves when it suspects automation — pauses for a moment, and the request is replayable either by clicking **Retry** or by browsing the **Recent reports** list for a pre-captured answer we already trust. The captures are forensically hashed on disk either way, so the operator can later investigate what eBay saw at that moment."

That's the *demo gold*. You're showing competence, transparency, and a real product, not a "it worked on my machine" apology.

---

## State 3 — `layout_drift` (the *slowly-evolving* wall)

This means eBay started serving `li.s-item` (the 2024-era markup) instead of `li.s-card` (the current one). It happens; sometimes it's geo-A/B. The app is honest about not knowing how to parse it.

### The fix path (no re-capture)

1. Save the MHTML of the affected facet. It's already on disk at `data/jobs/<id>/captures/<facet>.mhtml`.
2. On your laptop (or the VPS), run `node cli.js replay --dir data/jobs/<id>`. The pipeline *re-runs from the MHTML*, no browser.
3. Edit `lib/extract.js`'s s-item branch (the layout probe detects s-item; you just need to teach it what fields map to which).
4. Re-run replay. Loop until green.
5. **For production data, the captured MHTML is the only re-fresh needed** — no eBay hit. If the live job is just one facet, even that single facet's MHTML is in `captures/<facet>.mhtml`.

> The capture canary (design.md §7.4) is the *CICD* version of this: it diffs CDP-captured vs manual-saved HTML on a synthetic page to catch silent Chromium serializer drift across Playwright major bumps.

### Communicate to demo audience

> "We treat the two eBay layouts as a known A/B. The app surfaces which one it got; if it's the legacy layout, we already have the MHTML — and we can iterate the parser offline without bothering eBay again."

That's a *visible* signal that you understand the constraint and the design choice, not a bug.

---

## State 4 — `no_results` (the *not-a-bug* wall)

Sometimes the search genuinely returns nothing — narrow queries on long-tail products, misspellings that eBay has filtered out. The honest card:

```
"No exact matches on eBay for 'rtx 3090 ti super fe'"
```

The correct product response is **a UX one**: a small "Did you mean …" suggestion box, derived from common misspellings or related saved queries. **v2 feature**, not a Buildathon one — but keep it on the post-Buildathon list.

The *only* trap here: don't auto-retry. `no_results` is **terminal** (unlike `blocked` which is retryable). A retry does the same thing and counts against your IP's "polite client" budget.

---

## The 30-second health check at any moment

```bash
# on the VPS
bash /opt/scamshield/scripts/status.sh
```

That's your one-pager. If 7 lines are green, the demo is intact; if `WARN` appears, this lesson's diagnostics are the next step.

---

## The on-the-day operator's checklist (1 page)

Print and pin:

```
Wall-day checklist
────────────────────────────────────────
1. /healthz 200? → systemctl status
   ↳ if down:   systemctl restart scamshield
   ↳ if loop:   ssh-tunnel fallback

2. Walls in job? → cat job.json | jq .facets
   ↳ sign_in_required (sold/completed): EXPECTED. Demo it.
   ↳ blocked (all 3):  switch to "Recent reports" pre-captured fallback.
   ↳ layout_drift:     offline replay from saved MHTML (no browser).
   ↳ no_results:       ask the operator to type a different query.

3. Apache 502?       → /scripts/restartsrv_httpd
4. /healthz unstable memory? → drop SSC_TARGET_CARDS to 80, restart.
5. Stuck job?        → see "abort a job" below.
```

### Abort a stuck job

```bash
# on the VPS
sudo systemctl restart scamshield
# post-restart: previous job gets marked error:interrupted (good)
# the next POST starts a new job; old one's captures stay on disk
```

The system is single-flight; restarting the unit doesn't corrupt anything, and the event log (`job.json`) has the partial state.

---

## Anti-patterns to avoid

- ⛔ **Don't lie about the wall.** "All facets succeeded" when in fact 2 were `sign_in_required` is a trust crash on demo day. The honest card is the demo.
- ⛔ **Don't retry `no_results` 5 times.** It's terminal.
- ⛔ **Don't go nuclear on `blocked`.** A 10-minute wait is the difference between IP rate-limit cleared and angry bot-detection. The design doc's `circuit_open` idea is the *right* answer; aggressive automation breaks more than it fixes.
- ⛔ **Don't conflate `wall hit` with `app broken`.** They're different events. The wall hits are *features* in the design; debugging them differently from "the app is broken" is the discipline that keeps the runtime model clean.

---

## What "done" means for Lesson 13

You can answer yes to all five:

1. I can hit `bash /opt/scamshield/scripts/status.sh` and read the 7 lines quickly.
2. I can `jq .facets` on a recent job and name the wall-state.
3. I can say the 30-second operator phrase for each wall.
4. I know the offline-replay path (no eBay contact) for fixing parsers.
5. I've pinned the operator's checklist within arm's reach.

The walls will come. The lesson is: they don't have to come for your day.
