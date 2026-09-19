# Lesson 15 · Replay as debugging — fix parsers without ever touching eBay again

> **Time budget:** ad-hoc · **Audience:** anyone touching `lib/extract.js`, `lib/relevance.js`, or `lib/analyze.js`.

---

## The single best property of this codebase

> *Every job keeps `captures/*.mhtml` on disk. Deleting everything else and re-running `cli.js replay --dir <job>` regenerates `dataset.json → relevance.json → analysis.json → report/` with **zero browser** and **zero eBay contact**.*

This is not a feature I added. It's the structural property of the design (design.md §7.3, va-12). It's how you debug this app, full stop. There are no other tools worth knowing first.

This lesson walks through the three uses of replay — *parse-drift recovery*, *regression debugging*, and *new-product bootstrap* — and shows how each one stays eBay-free.

---

## Use 1 — `parse_drift` (the schema tripwire fired)

The tripwire (lib/extract.js) noticed an invariant violation in a real job's output. The job ended honestly with the typed error. Now you want to fix the parser.

### Procedure

```bash
# 1) Find the most recent job with parse_drift
ssh scamshield@<VPS_IP> "ls -t /opt/scamshield/data/jobs/ | head -5"

ssh scamshield@<VPS_IP> "jq '.facets, .events[-10:]' \
  /opt/scamshield/data/jobs/<jobId>/job.json"

# expected: at least one facet shows status=parse_drift and an event references which invariant failed
```

```bash
# 2) cd into the job on the VPS, replay from disk
ssh scamshield@<VPS_IP> "cd /opt/scamshield/app && \
  node cli.js replay --dir=/opt/scamshield/data/jobs/<jobId> --query='<original query>'"

# → runs decode → extract → relevance → analyze → report (NO BROWSER)
# → outputs what's wrong *now*, with the same evidence the live job used
```

```bash
# 3) Edit lib/extract.js (or wherever the offending constant lives).
#    Re-run replay from the SAME directory:
ssh scamshield@<VPS_IP> "cd /opt/scamshield/app && \
  node cli.js replay --dir=/opt/scamshield/data/jobs/<jobId> --query='<original query>'"

# 4) Loop until green.
```

> The key invariant: this loop **never** hits eBay. You're iterating on a deterministic input (the saved MHTML). What works locally will work in production.

---

## Use 2 — Regression debugging ("this used to work")

A new commit to `lib/relevance.js` changed which listings get filtered. Yesterday's job included item X in `kept[]`. Today's job excludes it. Did the new logic do that, or is it older data?

### Procedure

```bash
# 1) Find the captured MHTML of an older job
git checkout v0.4-report -- mvp/app/test/fixtures/some-mhtml

# Or: keep golden captures in /opt/scamshield/golden/test01/
ssh scamshield@<VPS_IP> "ls /opt/scamshield/golden/test01/captures/"

# 2) Replay against the *current* code
ssh scamshield@<VPS_IP> "cd /opt/scamshield/app && \
  node cli.js replay --dir=/opt/scamshield/golden/test01 --query='mac studio' \
  > /tmp/replay.out 2>&1"

# 3) Diff against the field-masked golden
ssh scamshield@<VPS_IP> "diff <(jq -S '.rows | map(maskForGolden)' \
  /opt/scamshield/data/jobs/<id>/dataset.json) \
  /opt/scamshield/golden/test01/dataset.json"

# 4) If diff is non-empty AND the change came from a code change in lib/*, that change IS the regression.
```

For L4's golden gate, this is automated via `test/golden.test.js` — but the *manual* version is useful for ad-hoc production debugging.

---

## Use 3 — `genericProfile` and new-product bootstrap

You build a profile for a product you haven't captured before. The `mac-studio-m3-ultra` profile works because someone hand-curated it. To bootstrap a profile for a new product (say, "sony α7r v"), you need captures for verification.

### Procedure

```bash
# 1) Live capture the new product
node cli.js live --query="sony α7r v" --target=80
# → writes captures/*.mhtml for 3 facets (if no wall)

# 2) Replay with the *draft* profile loaded (lib/profile.matchProfile picks it up)
node cli.js replay --dir=data/jobs/<newId> --query="sony α7r v"

# 3) Iterate the profile JSON, replay after each change.  No browser needed.
#    Output:
#      - relevance.json :: kept[N] / excluded[M] / byReason object
#      - analysis.json  :: IQR bands + risk flags
#      - report/        :: dashboard-ready

# 4) When relevance and bands look sensible, freeze the profile into profiles/sony-a7r-v.json.
```

> Once the JSON is committed, **the new product is supported forever**, regardless of what eBay's markup does tomorrow — because replay is deterministic against the saved MHTML.

---

## Use 4 — Pre-capture offline (the demo-day fallback)

L11 sets this up as the "Recent reports" pre-captured URL. The mechanism:

```bash
# On the VPS or laptop:
node cli.js replay --dir=/opt/scamshield/golden/test01 --query='<demo query>'

# → produces /opt/scamshield/data/jobs/<newId>/report/{index.html, common.css, common.js, data.js}
# → the home page's "Recent reports" lists this immediately
# → /report/<newId>/ is reachable even if eBay is rate-limiting the IP
```

This is replay-as-*resilience*. The whole design says *"no report must depend on eBay after capture."*

---

## The debugging harness (one file you keep adding to)

When you find yourself solving the same class of bug twice, drop a script:

```js
// scripts/debug_extraction_drift.js
import fs from "node:fs/promises";
import path from "node:path";
import { decodeMhtml } from "../lib/mhtml.js";
import { extractCardsFromHtml, layoutProbe } from "../lib/extract.js";

const [, , jobId, facet="current"] = process.argv;
const root = path.resolve(`data/jobs/${jobId}/captures/${facet}.mhtml`);
const html = decodeMhtml(await fs.readFile(root));
console.log("layout:", layoutProbe(html));
const cards = extractCardsFromHtml(html, { profile: { relevance: { exclude: [] }, brands: {} } });
console.log("count:", cards.length);
console.log("first card sample:", JSON.stringify(cards[0], null, 2));
console.log("unique listingids:", new Set(cards.map(c => c.id)).size, "/", cards.length);

// Look for the regex that fired (or didn't)
for (const c of cards.slice(0, 5)) {
  const matches = c.title.match(/<your regex>/);
  console.log(c.title, "→", matches);
}
```

> Every complex bug eventually needs a one-off script. Naming them `scripts/debug_*.js` and committing them makes the next debugging session faster.

---

## When *not* to use replay (the gotchas)

### Captures are stored uncompressed

`captures/<facet>.mhtml` files are 6–126 MB each, *ungzipped*. They eat disk fast. **Always prune**: `lib/jobs.js` runs `pruneJobs(20)` already; for debugging bursts you may temporarily bump to keep=50.

```bash
# In .env on the VPS, or in the systemd unit override:
Environment=SSC_PRUNE_KEEP=50
sudo systemctl daemon-reload
sudo systemctl restart scamshield
```

### Captures outlive Chromium

The MHTML was written by *this version of Chromium*. If Chromium's serializer changes shape (Playwright major bump), old MHTMLs may decode in older-parser-compatible ways. The **capture canary** catches this by diffing saved-HTML vs CDP-HTML — write the canary in this script:

```js
// scripts/capture_canary.js
import { chromium } from "playwright";
import fs from "node:fs/promises";
import http from "node:http";

const fixture = await (async () => {              // tiny synthetic page with s-card markup
  const srv = http.createServer((req, res) => {
    res.setHeader("content-type", "text/html");
    res.end(`
      <html><body>
        ${Array.from({length:10}, (_,i)=>`<li class="s-card" data-listingid="X${i}">
          <div class="s-card__title">item ${i}</div>
          <div class="s-card__price">$${(i+1)*10}</div>
        </li>`).join("")}
      </body></html>`);
  });
  srv.listen(0); await once(srv, "listening");
  return { srv, port: srv.address().port };
})();

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport:{width:1366,height:900}, locale:"en-US", timezoneId:"America/New_York", colorScheme:"light" });
const page = await ctx.newPage();
await page.goto(`http://127.0.0.1:${fixture.port}/`, { waitUntil:"networkidle" });
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
const client = await page.context().newCDPSession(page);
const { data: mhtml } = await client.send("Page.captureSnapshot", { format: "mhtml" });
await fs.writeFile(".canary/cdp.mhtml", mhtml);
const buf = await fs.readFile(".canary/manual.mhtml");   // manual Save-As, committed
// diff with: node scripts/diff_canary.mjs
console.log("byte diff:", buf.length - mhtml.length, "bytes; see diff_canary.mjs");
await browser.close(); fixture.srv.close();
```

Run it in CI on every Playwright bump. If the diff gets noisy, you found a *Chromium serializer change* before production did.

### A capture from a wall-hit facet is *useless*

If `current` facet returns `sign_in_required`, the MHTML is a signin page. Replay against that MHTML parses zero listings. That's not a parse_drift; that's a wall. Identify via `jq .facets` on the job before replay.

---

## The 60-second mental model

```
Did the parser disagree with reality?
  → Replay from the saved MHTML.
  → No browser.  No eBay.  No flaky test.

Did you add a new product type?
  → Capture once; iterate profiles/*.json offline.
  → Commit the profile; the product is supported.

Is the demo at risk?
  → Replay the saved golden; serve the report from data/jobs/<id>/report/.
  → Demo continues even if eBay is rate-limiting the IP.
```

That's the whole local-loop mental model. The thing you want to remember as "first instinct" on every bug: **can replay fix this without a browser?** If yes, replay is the answer.

---

## Anti-patterns to avoid

- ⛔ **Don't re-run the live job to debug a parser.** Replay exists; "live run" is for *production data*, not for *parser development*.
- ⛔ **Don't `rm -rf data/` to "clean up".** The captures ARE the evidence (and the regression buffer). Use `pruneJobs(20)`.
- ⛔ **Don't keep captures beyond 50.** 6 MB × 50 jobs × 3 facets ≈ 1 GB. Bump the limit briefly; reset it after.
- ⛔ **Don't skip the canary on Playwright major bumps.** A silent serializer change ruins a release.

---

## What "done" means for Lesson 15

You can answer:

1. **Replay regenerates `dataset.json` → `analysis.json` → `report/`** from `captures/*.mhtml` with zero browser.
2. **`pruneJobs(N)` is configured** and you know the size math.
3. **A `scripts/debug_*.js` exists** for the type of bug you most often debug (probably layout-related).
4. **The capture canary is in CI** as a Playwright-major-bump gate.

Replay is the largest *latent* property of this codebase. The lesson is: treat it as a first-class tool, not a fallback.
