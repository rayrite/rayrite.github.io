# Go-Live Checklist — remaining tasks before the Venture313 showcase

Status at creation (2026-09-20 night): the app is **deployed and serving** at
`https://cvx-001-scamshield-mvp-production.up.railway.app` running the latest
commit, in **demo mode** (no key set) with **no volume** (ephemeral data).
Everything below is what stands between that and demo-ready.

Deadlines: **Mon Sep 21, 8 AM** submission · **Tue Sep 22** showcase.

> Updated 2026-09-21: (1) section A navigation rewritten with exact click
> paths re-verified against the official docs — the old "Volumes tab → New
> Volume" instruction was the pre-2026 Railway UI (see the note under
> section A); (2) section C refreshed for surfaces that shipped after this
> checklist was written: the `/map` Threat Radar (real recall/outbreak data),
> the `/price` Price Spectrum (real RTX 3090 capture), and the responsive
> mobile layout — all live on production as of commit `d18fa81`.

---

## A. Railway configuration (≈10 min) — the three knobs

> **Navigation re-verified against docs.railway.com on 2026-09-21.** The old
> "Volumes tab → New Volume" wording was the pre-2026 UI — that button no
> longer exists where it used to, which is why it couldn't be found. All
> paths below start the same way: **railway.com → click your project → click
> the `scamshield` service tile** (the box on the project canvas) to open the
> service page with its tabs (Deployments · Metrics · Variables · Settings · …).

- [ ] **A1. Variables** — on the service page, click the **Variables** tab.
      Either click **New Variable** for each line, or click **Raw Editor**
      and paste all three at once:

  ```
  ZAI_API_KEY=<your 49-char z.ai key>
  DATA_DIR=/data
  ZAI_RESEARCH_TIMEOUT=240
  ```

  Variable edits are **staged, not applied** — the top bar shows a staged-
  changes prompt. Review it and click **Deploy**; Railway redeploys the
  service with the new environment (official docs: adding/updating/removing
  variables "results in a set of staged changes that you must review and
  deploy, in order to apply them").

- [ ] **A2. Seal the key** (optional but recommended) — **Variables** tab →
      find `ZAI_API_KEY` in the list → click the **⋮ three-dot menu on the
      right edge of that row** → **Seal**. The value becomes write-only: it
      can be overwritten later but never read back (not even via the Raw
      Editor). Store the key somewhere safe first — it is in your local
      `app/.env`. Sealing is permanent ("sealed variables cannot be
      unsealed" — official docs).
- [ ] **A3. Volume** — without it every redeploy wipes jobs, chats, and
      waitlist signups. In the current UI there is no "New Volume" button
      on the service page header; create it either way:

  - **Command palette (fastest):** click anywhere on the project canvas,
    or press **Ctrl+K** (⌘K on Mac) → type `volume` → pick the
    **New Volume** action.
  - **Right-click the service:** right-click the `scamshield` service box
    on the project canvas → the context menu includes a **Volume** entry.

  You are then prompted to **select the service** to attach to →
  `scamshield` → set the **mount path** to **`/data`** (the absolute folder
  inside the container; everything the app writes there survives
  redeploys). Attach triggers a redeploy — mounts happen at container
  start, not mid-run.

  Once it exists, the volume is visible on the **service page → Volumes
  tab** ("all the volume-centric settings", incl. the mount path) and on
  the canvas attached to the service. Railway automatically sets
  `RAILWAY_VOLUME_NAME` and `RAILWAY_VOLUME_MOUNT_PATH` env vars.

  Limits/behavior (official docs): one volume per service; keep **replicas
  at 1** (volumes + replicas don't mix); redeploys of a volume-attached
  service stop it for seconds-to-a-minute (the old deployment must release
  the volume); trial plan allows 3 volumes/project at 0.5 GB each.
- [ ] **A4. Healthcheck** — service page → **Settings** tab → find the
      healthcheck section and set the endpoint path to **`/api/health`**
      (official docs: "under your service settings, input your health
      endpoint"). Railway then waits for a 2xx from that path before
      switching traffic to a new deployment; default timeout 300 s
      (`RAILWAY_HEALTHCHECK_TIMEOUT_SEC` to change). A deploy that never
      answers 2xx is marked **failed** instead of going live half-broken.
      Note the probe comes from `healthcheck.railway.app` — the app's
      `/api/health` is public and returns 2xx, so this just works.
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
  # expect: "ok":true, "key_configured":true, "demo_mode":false,
  #         "data_dir":"/data", plus "intake_model"/"research_model"
  #         (glm-5.3-flash / glm-5.3 unless you changed them on /models)
  ```

  Then open the site, click the header pill — beacon should read **GO** with a
  real z.ai ping time (~1–2 s), and the mode chip should read **live · z.ai**.

## B. Content gaps (≈15 min, choose per item)

- [ ] **B1. Video samples** — `/video` currently has no MP4s (the data volume
      ships empty). Either upload clips (volume file management is **CLI-
      only** — no dashboard file browser; full procedure in
      [VIDEO-HOSTING-RAILWAY.md](VIDEO-HOSTING-RAILWAY.md) §"upload"):

  ```bash
  railway login
  railway link          # pick workspace → project → environment → scamshield
  railway volume files upload ./demo.mp4 /videos/demo.mp4 --overwrite
  railway volume files list /videos     # confirm it landed
  ```

  (Note the path semantics: `volume files` paths are inside the volume, so
  `/videos/…` there = `/data/videos/…` in the container.) Or simply hide the
  surface: set `"video": false` in `app/features.json`, commit, push — nav
  updates everywhere automatically.
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
- [ ] **C3. Demo script** (suggested 5-beat flow — beats 4–5 shipped after
      this checklist was first written and are strong closers, especially
      for a Detroit room):
      1. `/` landing → the pitch, waitlist
      2. `/check` → live staged check, gates as buttons, header number ticking
         **1** while a model call is in flight — point at it
      3. `/models` → swap a model live, save, no restart — the pull-down's
         `intake: … · research: …` line follows within 3 s
      4. `/map` → Threat Radar, scenario tabs, all real data: the Ram 1500
         rearview-camera recall (**NHTSA 26V-560000**, 239,131 units, whole
         supply chain plotted in Metro Detroit — Harman Novi, Sterling
         Heights Assembly, FCA Auburn Hills) is the local hook; the CDC
         COVID-wastewater tab shows MI at 1.41 with Washtenaw 6.86 detail
      5. `/price` → Price Spectrum, real RTX 3090 eBay capture: 343 of 509
         analyzed live listings ask above the $1,612 fence while 1,084 of
         2,132 actual sales closed inside the street band — the "sellers
         anchor high, buyers pay street" one-liner
- [ ] **C4. Fallback plan** — if z.ai or Railway misbehaves on stage: the app
      falls back to honest demo mode the moment the key is absent/invalid
      (beacon shows OFF with the exact reason). Removing the `ZAI_API_KEY`
      variable + redeploying is the 2-minute emergency lever; canned demo
      responses still walk the whole flow.
- [ ] **C5. Device check** — open the URL once on the actual laptop/phone you
      will present from, on venue Wi-Fi or a hotspot, before the showcase.
      The whole UI is responsive as of 2026-09-21 (commit `d18fa81`), so the
      phone view is presentable, not broken. One gotcha: on any device that
      visited the site **before** that fix, hard-refresh (or clear the site's
      cache) — the app sends no cache headers on static files, so browsers
      happily serve the old unresponsive CSS.

## D. Post-showcase (nice-to-haves, not blocking)

- [ ] Custom domain instead of `*.up.railway.app` — service → **Settings**
      tab → public-networking section → add the domain; Railway then shows
      you the exact **CNAME + TXT** DNS records to create at your registrar —
      **both are required** (if the TXT record is missing, requests to the
      custom domain return 404).
- [ ] `AGENT_TOKEN` if the deployment stays public long-term
- [ ] Key rotation + reseal after the event
- [ ] Trial plan → upgrade decision before the trial lapses (trial volumes are
      deleted 30 days after credit expiry — export `/data` if you keep anything)

---

**Regression rule:** every `git push` auto-redeploys. After any push, spend
60 seconds: `/api/health` JSON looks right, beacon GO, one demo-mode chat turn.
Full matrix: see `TEST-PLAN-2026-09-20.md` (next file).

**Doc sources for the navigation above** (checked 2026-09-21):
docs.railway.com — `/volumes` (creation via ⌘K palette or canvas right-click;
one volume per service; replicas incompatible), homepage Basics (service
Volumes tab = volume-centric settings incl. mount path), `/guides/variables`
(Raw Editor; staged changes must be reviewed + deployed; 3-dot menu → Seal,
not un-sealable), `/guides/healthchecks` ("under your service settings,
input your health endpoint"; 300 s default timeout), `/guides/public-
networking` (custom domain CNAME + TXT, both required).
