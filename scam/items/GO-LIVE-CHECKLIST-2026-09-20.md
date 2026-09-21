# Go-Live Checklist — remaining tasks before the Venture313 showcase

Status at creation (2026-09-20 night): the app is **deployed and serving** at
`https://cvx-001-scamshield-mvp-production.up.railway.app` running the latest
commit, in **demo mode** (no key set) with **no volume** (ephemeral data).
Everything below is what stands between that and demo-ready.

Deadlines: **Mon Sep 21, 8 AM** submission · **Tue Sep 22** showcase.

---

## A. Railway configuration (≈10 min) — the three knobs

- [ ] **A1. Variables** — service → Variables → Raw Editor, paste:

  ```
  ZAI_API_KEY=<your 49-char z.ai key>
  DATA_DIR=/data
  ZAI_RESEARCH_TIMEOUT=240
  ```

  Then click **Deploy** to apply the staged changes (Railway redeploys itself).

- [ ] **A2. Seal the key** (optional but recommended) — Variables → `ZAI_API_KEY`
      ⋮ menu → **Seal**. Write-only from then on; store the key somewhere safe
      first (it is in your local `app/.env`). Sealing is permanent.
- [ ] **A3. Volume** — Volumes tab → New Volume → mount path **`/data`**.
      Without it every redeploy wipes jobs, chats, and waitlist signups.
- [ ] **A4. Healthcheck** — Settings → Healthcheck Path → **`/api/health`**
      so traffic only cuts over once a deployment actually answers.
- [ ] **A5. (Optional) concurrency display** — if you want the header pill to
      show `n / limit` instead of a bare number, add
      `ZAI_CONCURRENCY_LIMIT=<the per-key number from your z.ai console
      rate-limits page>`.
- [ ] **A6. Do NOT set `AGENT_TOKEN`** for the public demo — it would require
      an auth header on every chat/check action from the browser. Only for a
      private long-lived deployment.
- [ ] **A7. Re-verify after A1–A3** (2 min):

  ```bash
  curl https://cvx-001-scamshield-mvp-production.up.railway.app/api/health
  # expect: "ok":true, "key_configured":true, "demo_mode":false, "data_dir":"/data"
  ```

  Then open the site, click the header pill — beacon should read **GO** with a
  real z.ai ping time (~1–2 s), and the mode chip should read **live · z.ai**.

## B. Content gaps (≈15 min, choose per item)

- [ ] **B1. Video samples** — `/video` currently has no MP4s (the data volume
      ships empty). Either upload clips:
      `railway volume files upload <local>.mp4 /data/videos/` (CLI only), or
      hide the surface: set `"video": false` in `app/features.json`, commit,
      push — nav updates everywhere automatically.
- [ ] **B2. Waitlist sanity** — after A3, submit one test email on the landing
      page; expect the counter to increment; `already: true` on a repeat.
      (Remove the test line from `/data/waitlist.txt` via CLI if you care.)
- [ ] **B3. One full live check** — run the USPS-style example end-to-end with
      a real screenshot: expect vision transcript → snap verdict at the first
      gate → **document** → **stop** → final report. Confirms key, balance,
      pipeline, and persistence in one pass (~$0.05).

## C. Submission + showcase prep (Mon–Tue)

- [ ] **C1. Mon 8 AM submission** — include the live URL
      `cvx-001-scamshield-mvp-production.up.railway.app` wherever the
      submission wants a link; it reads clean on a slide.
- [ ] **C2. z.ai balance** — check the console the morning of: you want headroom
      for a day of demos ($5–10 is plenty at ~$0.02–0.10 per staged check;
      balance was $20 on 2026-09-20). If it ever runs dry mid-demo the app now
      shows the friendly "out of credit — live results resume once it's
      recharged" line instead of crashing.
- [ ] **C3. Demo script** (suggested 3-beat flow):
      1. `/` landing → the pitch, waitlist
      2. `/check` → live staged check, gates as buttons, header number ticking
         **1** while a model call is in flight — point at it
      3. `/models` → swap a model live, save, no restart — the pull-down's
         `intake: … · research: …` line follows within 3 s
- [ ] **C4. Fallback plan** — if z.ai or Railway misbehaves on stage: the app
      falls back to honest demo mode the moment the key is absent/invalid
      (beacon shows OFF with the exact reason). Removing the `ZAI_API_KEY`
      variable + redeploying is the 2-minute emergency lever; canned demo
      responses still walk the whole flow.
- [ ] **C5. Device check** — open the URL once on the actual laptop/phone you
      will present from, on venue Wi-Fi or a hotspot, before the showcase.

## D. Post-showcase (nice-to-haves, not blocking)

- [ ] Custom domain (CNAME + TXT) instead of `*.up.railway.app`
- [ ] `AGENT_TOKEN` if the deployment stays public long-term
- [ ] Key rotation + reseal after the event
- [ ] Trial plan → upgrade decision before the trial lapses (trial volumes are
      deleted 30 days after credit expiry — export `/data` if you keep anything)

---

**Regression rule:** every `git push` auto-redeploys. After any push, spend
60 seconds: `/api/health` JSON looks right, beacon GO, one demo-mode chat turn.
Full matrix: see `TEST-PLAN-2026-09-20.md` (next file).
