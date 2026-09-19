# Lesson 5 · Capture module (Playwright) + `blocked.test.js` + first live capture

> **Visual aid:** `visual-aids/va06_facet_state_machine.html`.
> **Time budget:** ~4 hrs · **MVP gate contribution:** `v0.2-capture` tag — capture against a local fixture server green, first live facet captured, blocked taxonomy verified.

---

## What this lesson produces

Three concrete artifacts:

1. **`lib/capture.js`** — the *only* browser-touching module, exporting `runCapture({query, profile, onProgress}) → JobArtifacts`.
2. **`test/blocked.test.js`** — runs a tiny HTTP fixture server (signin-redirect, no-results, block-markers, s-item layout) and asserts the typed outcomes.
3. **One job on disk** — the first real eBay capture (at least the `current` facet) saved under `mvp/app/data/jobs/<id>/captures/current.{mhtml,png,html}`.

If you have the `current` facet captured with ≥150 cards and a clean PNG, **the riskiest lesson is done** — every other lesson is wiring around it.

---

## What we're *not* doing in this lesson

- ✋ No orchestrator. (L6.) This lesson calls `runCapture()` directly from `cli.js`.
- ✋ No server. (L6.)
- ✋ No VPS. (L8.)
- ✋ No authenticated capture. (Post-MVP, only if time permits; see design.md / auth-plan.md in `mvp/docs/`.)

---

## Step 5.1 — The capture contract

`lib/capture.js` exports one function:

```ts
// pseudocode
runCapture({
  query:    string,
  profile:  Profile,
  outDir:   string,        // .../data/jobs/<id>/captures
  log:      (event) => void, // orchestrator's event sink (L6 wires this to SSE)
  signal?:  AbortSignal,
}) → Promise<{
  facets: {
    current:   FacetResult,
    completed: FacetResult,
    sold:      FacetResult
  },
  provenance: ProvenanceRecord  // SHA-256s, URLs, console sidecar
}>
```

Where `FacetResult = { status: FacetStatus, cards?: number, scrollCount?: number, error?: string, durationMs?: number }` and `FacetStatus` is exactly the design-doc taxonomy:

```
ok · partial · blocked · no_results · sign_in_required · layout_drift · parse_empty
retryable := { blocked, partial }
```

Anything else is a bug — reject in code review.

---

## Step 5.2 — `lib/capture.js` (the only browser code in the project)

I won't paste the entire 400-line module here — but here's the structural blueprint, which is the bit the design doc cares about (the actual code is in `mvp/app/lib/capture.js` once you write it):

```
runCapture({query, profile, outDir, log, signal})
  └─ for facet in [current, completed, sold]
        ├─ waitForPreviousFacetMemoryReleased()  // simple guard
        ├─ build facet URL  (the design-doc exact URL strings)
        ├─ launch = chromium.launch({ headless: true })
        ├─ context = launch.newContext({ viewport: 1366×900,
        │                                locale: 'en-US',
        │                                timezoneId: 'America/New_York',
        │                                colorScheme: 'light',
        │                                /* NO UA hand-rolling, NO stealth args */ })
        ├─ page = context.newPage()
        │
        ├─ goto(url, { waitUntil: 'domcontentloaded', timeout: 45_000 })
        ├─ finalUrl = page.url()
        ├─ if (new URL(finalUrl).host === 'signin.ebay.com')
        │       record facet.status = 'sign_in_required'  ; break
        │
        ├─ body = await page.locator('body').innerText({ timeout: 5_000 }).catch(()=>'')
        ├─ if (matchesBlockMarkers(body))
        │       record facet.status = 'blocked'           ; break (1 retry later)
        │
        ├─ if (body.includes('No exact matches'))
        │       record facet.status = 'no_results'        ; break
        │
        ├─ await page.waitForSelector('li.s-card[data-listingid]', { timeout: 15_000 })
        │     .catch(() => { record facet.status = 'parse_empty'; break })
        │
        ├─ cards = await scrollLoop(page, log, facet)            // see §5.3
        │   if (cards < 10 && facet !== 'sold')  // sold wall tolerated
        │        warn, but continue
        │
        ├─ await settle(page)                                    // see §5.4
        │
        ├─ await captureSnapshot(page, facet, outDir)             // see §5.5
        │   .catch((e) => {                                     // screenshot never fails a facet
        │     log({ kind: 'warn', facet, msg: 'snapshot-failed', err: e.message });
        │   })
        │
        ├─ await page.close(); await context.close();
        │
        ├─ record facet.status =
        │     (cards >= target)         ? 'ok'
        │     : (cards >= 40)           ? 'partial'
        │     : (cards > 0)             ? 'partial'    // <40 but >0 → honest partial
        │     :                            'parse_empty'
        └─ log({ kind: 'facet', facet, status, cards })
   finally
     await launch.close()       // recycle Chromium per job
```

### 5.2.1 — Why this is the ONLY browser module

If it helps your future self: **no other file in the project imports `playwright`**. The router doesn't. The orchestrator doesn't. Tests that go through the HTTP layer go through the orchestrator, which delegates here. If you ever find a `import { chromium } from 'playwright'` in any file other than `lib/capture.js` or `lib/auth.js` (optional, post-MVP), that file is wrong.

This single discipline is what keeps the codebase maintainable. It also makes the pipeline browser-free in 8 lines of grep:

```bash
grep -l "playwright" mvp/app/lib/*.js | wc -l
# → 1  (and only 1, ever)
```

---

## Step 5.3 — Scroll loop (evidence-gated, jittered)

```js
// pseudocode — implementation in mvp/app/lib/capture.js
async function scrollLoop(page, log, facet, opts) {
  const target = opts.target || 150;            // MVP-grade target; design doc suggests 200 for full throttle
  const clamp  = [40, Math.max(opts.target || 200, 240)];     // partial boundary 40
  const stagnant = { count: 0 };
  let lastCount = 0, scrolls = 0;

  while (true) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * (0.9 + Math.random() * 0.3)));
    await sleep(600 + Math.random() * 600);

    const c = await page.locator('li.s-card[data-listingid]').count();
    scrolls++;
    log({ kind: 'progress', facet, cards: c, scrolls });

    if (c >= target) return c;
    if (c === lastCount) stagnant.count++; else stagnant.count = 0;
    if (stagnant.count >= 2) return c;       // early stop
    if (scrolls > 80) return c;              // safety
  }
}
```

> Note: the design doc sets `target=200 clamp 150–240` in the full-data regime, but on a **2 GB VPS with running Chromium**, you want `target=150` and `MemoryMax=2G`. The lesson's default is 150; bump to 200 only after the L7 + L8 VPS smoke test passes with margin.

---

## Step 5.4 — Settle (asserted, not timed)

The naive `networkidle` is a footgun on eBay — their telemetry stream keeps the network busy literally forever. The design-doc trick is *time-bounded best-effort*:

```js
async function settle(page) {
  // 1) every image of every card is complete + naturalWidth > 0
  await page.evaluate(() => Promise.all(
    [...document.querySelectorAll('img')].map((img) =>
      img.complete && img.naturalWidth > 0
        ? null
        : new Promise((r) => {
            img.addEventListener('load', r, { once: true });
            img.addEventListener('error', r, { once: true });
            setTimeout(r, 8000);                           // cap
          })
    )
  ));

  // 2) fonts ready
  await page.evaluate(() => document.fonts.ready);

  // 3) one best-effort networkidle — never blocking on it
  await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {});
}
```

> The whole settle costs ≤ ~9s in the worst case. The empirical "good page" settles in ~3s. This is what makes the MHTML capture byte-faithful to Chrome's own Save-As serializer.

---

## Step 5.5 — Capture & memory protocol

```js
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

async function captureSnapshot(page, facet, outDir) {
  // 1) MHTML
  const client = await page.context().newCDPSession(page);
  const { data: mhtml } = await client.send('Page.captureSnapshot', { format: 'mhtml' });
  await client.detach();
  const mhtmlPath = path.join(outDir, `${facet}.mhtml`);
  await fs.writeFile(mhtmlPath, mhtml);
  // CRITICAL: drop the string from memory before the next step.
  // There is no streaming variant; this is correct.

  // 2) PNG (best-effort)
  try {
    const png = await page.screenshot({ fullPage: true, type: 'png' });
    await fs.writeFile(path.join(outDir, `${facet}.png`), png);
  } catch (e) {
    console.warn(`screenshot ${facet} failed:`, e.message);   // never fails the facet
  }

  // 3) Decoded HTML (so extract.js doesn't have to re-decode MHTML)
  const html = decodeMhtml(await fs.readFile(mhtmlPath));
  await fs.writeFile(path.join(outDir, `${facet}.html`), html);

  // 4) SHA-256 per artifact + provenance
  const sha = async (p) => crypto.createHash('sha256').update(await fs.readFile(p)).digest('hex');
  return {
    mhtml: { path: mhtmlPath, sha256: await sha(mhtmlPath), bytes: (await fs.stat(mhtmlPath)).size },
    // png + html provenance identical
  };
}
```

> ⚠️ **16 384-px wall on `fullPage: true`.** If `page.evaluate(() => document.documentElement.scrollHeight) > 16384`, Chromium's compositor can return a blank or tiled PNG. Defense: read height first, slice into viewport chunks if needed, and stitch (`sharp` would be a new dependency — instead, store the slices + a best-effort single fullPage). For MVP `target=150`, this is unlikely to trip. For full-data `target=400` on the original RTX capture it does. Document the slug in the wiki.

---

## Step 5.6 — `test/blocked.test.js` (the local-only fixture server)

The fixture server is *intentionally* tiny — 200 lines of Node, 4 routes, no dependencies. Run it once via `node --test`.

```js
// mvp/app/test/blocked.test.js
import { test } from "node:test";
import assert from "node:assert/strict";
import { once } from "node:events";
import http from "node:http";

// Embedded fixture server. Routes:
//   /fixture/wall             → 302 → signin.ebay.com equivalent
//   /fixture/block            → body markers of PerimeterX-class block
//   /fixture/no-results       → "No exact matches"
//   /fixture/scard            → normal page, 200 <li class="s-card" data-listingid="..."> rows
//   /fixture/sitem            → page with only <li class="s-item"> rows (legacy layout)
async function startFixture() {
  const srv = http.createServer((req, res) => {
    const url = new URL(req.url, "http://x");
    res.setHeader("content-type", "text/html");
    if (url.pathname === "/fixture/wall")         return res.end("<meta http-equiv=refresh content='0;url=https://signin.ebay.com/'>");
    if (url.pathname === "/fixture/block")        return res.end("Pardon our interruption — perimeterx.js blocked");
    if (url.pathname === "/fixture/no-results")   return res.end("No exact matches");
    if (url.pathname === "/fixture/scard")        return res.end(`
      <html><body>
        ${Array.from({length:5},(_,i)=>`<li class="s-card" data-listingid="L${i}"><div class="s-card__title">item ${i}</div><div class="s-card__price">$10</div></li>`).join("")}
      </body></html>`);
    if (url.pathname === "/fixture/sitem")        return res.end(`
      <html><body>
        ${Array.from({length:5},(_,i)=>`<li class="s-item" data-listingid="L${i}"><div class="s-item__title">item ${i}</div></li>`).join("")}
      </body></html>`);
    res.end("404");
  });
  srv.listen(0);
  await once(srv, "listening");
  return { srv, port: srv.address().port };
}

test("blocked: sign-in-redirect yields facet.status=sign_in_required (no throw)", async () => {
  const { srv, port } = await startFixture();
  try {
    const result = await runCapture({
      query: "rtx 3090",
      profile: { id: "rtx-3090", label: "RTX 3090", relevance: { exclude: [] } },
      outDir: await tmp(),
      log: () => {},
      baseUrl: `http://127.0.0.1:${port}`        // ← dev opt (design.md §5)
    });
    assert.equal(result.facets.current.status, "sign_in_required");
  } finally { srv.close(); }
});

test("blocked: block markers → blocked (no retry assert at this layer)", async () => {
  const { srv, port } = await startFixture();
  try {
    const result = await runCapture({ /* ... */, baseUrl: `http://127.0.0.1:${port}/fixture/block` });
    assert.equal(result.facets.current.status, "blocked");
  } finally { srv.close(); }
});

// + 2 more: no_results, layout_drift (s-item)
```

> The `baseUrl` option is the design-doc's "fake eBay" debug switch (`SSC_CAPTURE_BASE_URL`). Putting it through the function signature keeps tests deterministic; no flaky eBay from CI.

Run:

```powershell
cd mvp\app
node --test test/blocked.test.js
# 4 tests, 0 failures
```

> ⚠️ **Time budget on this lesson:** if `blocked.test.js` is taking more than 20 minutes to green, *stop and ping me*. The whole point is it's fast and local; if it's not, something's structurally wrong with `lib/capture.js`. Resist the urge to mock-layers.

---

## Step 5.7 — First LIVE capture (this is the moment the rubber meets the road)

The MVP gate *requires* a real capture, not a fixture. After `blocked.test.js` is green:

```powershell
cd mvp\app

# warm-up: 1 query against live eBay, one facet only, low target, 30s budget.
# If this fires 'blocked', you're probably on a bad block cycle — try again in 10 min.
node cli.js live --query="rtx 3090" --target=40 --timeout=45
```

Expected (within ±20s):

```
== facet current =========
captured 91 cards · 14 scrolls · 5.4 MB mhtml
== facet completed =======
status: sign_in_required (facet parked; next facet)
== facet sold ============
status: sign_in_required (facet parked; next facet)
== report ================
wrote .../data/jobs/20260919-184044-3a91bf/report/
```

> **Your run output:** paste the entire console block into `notes/L5-first-live-capture.txt`. If anything looks different from the above, paste the diff into the next message and I'll diagnose.

### A. The first failure modes you'll see (and what they mean)

| Symptom | Likely cause | Cheap next step |
|---|---|---|
| `blocked` on every facet | your IP has had a bad day; or you ran the script many times | wait 10–30 min, retry |
| `parse_empty` on `current` only | eBay shipped a layout you don't recognize | check `data/jobs/<id>/captures/current.html` against the selector in §5.3 |
| Chromium hangs on `chromium.launch` | missing system DLL | `npx playwright install chromium --with-deps` if on Mac/Linux; on Win install VCRedist |
| `sign_in_required` on `current` (the current facet is *never* behind the wall) | Cookie residue from a prior browser session; or a stale `Local State` | delete `~/.cache/ms-playwright/` profile dirs; restart |

### B. Decide whether to redo the lesson

The lesson is "done" when:
- `node --test test/blocked.test.js` is green on the laptop.
- A live `cli.js live --query="…" --target=40` produces a `current` capture with ≥40 cards on disk.
- The captures live in `mvp/app/data/jobs/<id>/captures/current.mhtml|png|html`, where `<id>` is one of `YYYYMMDD-HHMMSS-XXXXXX` patterns.

If the live capture hits a wall (`blocked` or `parse_empty`), you can still tag a sub-version: `v0.2-capture-blocked-fallback` to record the partial progress. The golden path is unblocked by writing `blocked.test.js` and capturing once locally; the live capture is an *evidence-rich* bonus, not a strict prerequisite.

---

## Step 5.8 — The dev-flag toolbox (no production code uses them)

Set these in the same shell as `cli.js live`:

| Flag | What it does | When you'd use it |
|---|---|---|
| `SSC_HEADED=1` | launch Playwright with `headless:false` | debugging a facet in real time |
| `PWDEBUG=1` | open Playwright Inspector (step-through) | "which selector is misfiring?" |
| `SSC_CAPTURE_BASE_URL=http://localhost:9999` | point capture at the fixture server | CI + local deterministic tests |
| `SSC_E2E=1` | opt in to `e2e-live.test.js` (real eBay) | dev box, manual, never CI |

> It is by **omission** that production never carries these. No code reads them. They're pure environment.

---

## Step 5.9 — Tagging the checkpoint

```powershell
git status                       # lib/capture.js new; test/blocked.test.js new; (optional) data/jobs/<id>
git add -A
git commit -m "capture: lib/capture.js + blocked.test.js + first live facet captured"

# we explicitly DO NOT add data/  (it's gitignored).  The capture IS the evidence,
# but it ships outside git.  Local-only.
git tag -a v0.2-capture -m "lib/capture.js against fixture; live capture saved locally"
git push --tags
```

---

## Anti-patterns to avoid (carry these into every future lesson)

- ⛔ **Don't import playwright outside `lib/capture.js` or `lib/auth.js`** (auth is post-MVP). One and only one.
- ⛔ **Don't `await page.waitForLoadState('networkidle')` without a timeout.** It will starve on eBay.
- ⛔ **Don't hold the MHTML string in a variable after writeFileSync.** It's 6–126 MB; held three times it can OOM your 2 GB VPS. The function-local-after-write pattern is mandatory.
- ⛔ **Don't skip the screenshot when it fails.** Screenshot never fails a facet; the MHTML is what we serve evidence claims from.
- ⛔ **Don't add retry logic that's "smarter" than the design doc.** One jittered retry on `blocked`, then honest stop. The simple version wins the debate every time.

---

## What "done" means for Lesson 5

In one shell:

```powershell
cd D:\stuff\ai-misc\_bsh2026\vscode_project01\70\mvp\app
node --test test/blocked.test.js          # 4 tests, 0 failures
node cli.js live --query="rtx 3090" --target=40 --timeout=45   # ≥40 cards on current
```

When both run green AND a tag exists on GitHub (`v0.2-capture`), Lesson 5 is complete.

In Lesson 6 we glue this together with the orchestrator, the router, and SSE — and the moment you can submit a query from a browser and watch the SSE timeline fill in card-by-card is the moment the rest of the build becomes mostly wiring. Pick me up when you're ready.
