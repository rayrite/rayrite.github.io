# Lesson 4 · Port the proven pipeline (no browser) + golden test goes green

> **Visual aids:** `visual-aids/va02_component_architecture.html`, `va03_data_flow.html`, `va07_pipeline_replay.html`, `va12_job_directory_layout.html`.
> **Time budget:** ~3 hrs · **MVP gate contribution:** `v0.1-scaffold-golden` tag — golden replay reproduces the design's deliverable byte-for-byte, locally.

---

## What this lesson produces, end-to-end

By the end of this lesson, with **zero browser involved**, running

```powershell
node cli.js replay --dir ..\..\eBay\test01
```

prints:

```
== read 1 .mhtml ==============
…(decode summary)
== extract ======================
cards: 198  (facet=current)
cards: 201  (facet=completed)
cards: 184  (facet=sold)
== merge ========================
unique listings: N (sources distribution: {current: …, completed: …, sold: …, multi: …})
== relevance =====================
kept: N · excluded: M · byReason: {off-topic: …, accessory-part: …}
== analyze ======================
variants: … · IQR bands: {p25: …, p75: …} · risk: {…}
== report =======================
wrote ..\..\mvp\app\data\jobs\20260918-141053-a1b2c3\report\{index.html, common.css, common.js, data.js}
```

…and `data.js` is byte-identical against the deliverable's `data.js` (golden test's deep-equal on the masked 22 fields).

That's the whole promise of "evidence before analysis" working in anger: we changed a parser, no eBay hit, no browser launched, no test flake.

---

## What we're porting and from where

| Target | Source | What changes |
|---|---|---|
| `lib/mhtml.js` | `scratch/mhtml2html.js` | drop argv/IO; export `decodeMhtml(buf)` |
| `lib/extract.js` | `scratch/extract.js` | core port + 3 additive fields (`endedDate`, `pickupNote`, `topRated`/`authorizedSeller`) + field-masked comparison helper |
| `lib/relevance.js` | **NEW** (was hand-curated exclusions for RTX) | profile-driven; first-match-wins rules |
| `lib/profile.js` + `profiles/*.json` | **NEW** +2 authored profiles | parameterized version of `scratch/analyze2.js` constants |
| `lib/analyze.js` | `scratch/analyze2.js` | all hardcoded product constants → profile or opts |
| `lib/report.js` | **NEW** (was `build-spa.js` for RTX) | 22-field adapter + dashboard asset copy |
| `cli.js` | **NEW** | `replay --dir <job-dir-or-test01>` is the test entrypoint |
| `test/golden.test.js` | **NEW** | non-negotiable gate |

The porting rule across every file: **never carry a hardcoded string product name forward**. If it's product-specific, it lives in `profiles/*.json`. If it's a number (p25/p75 quantile, network thresholds, MSRP floors), it lives in `profile.msrp.*` or `opts.{minBandN, msrpFloorRatio, …}` with current defaults intact.

---

## Step 4.1 — `lib/mhtml.js` (write it first; everything downstream depends on it)

Take `scratch/mhtml2html.js`. Read it. **Understand its QP-decode loop before you touch it.** The single-byte error condition that breaks the decoder:

- QP-encoded bytes look like `=XX` where `XX` is two hex digits.
- Soft line breaks are `=\r\n` (must decode to nothing, not to a `\n`).
- Inside an MHTML body, `Content-Transfer-Encoding: quoted-printable` is the common case; some `text/html` parts are 8-bit.

The port looks like:

```js
// mvp/app/lib/mhtml.js
"use strict";

// decodeMhtml(buf) -> string  (the decoded HTML body of the page)
// `buf` is a Node Buffer (MHTML byte stream).
export function decodeMhtml(buf) {
  const text = buf.toString("latin1");                   // MHTML headers are ASCII; bodies honor their CTE
  const boundary = findBoundary(text);
  if (!boundary) throw new MhtmlError("no boundary in Content-Type header");

  const parts = splitOnBoundary(text, boundary);
  const htmlPart = parts.find((p) => /^text\/html\b/.test(p.headers["content-type"] || ""));
  if (!htmlPart) throw new MhtmlError("no text/html part found");

  return decodeTransfer(htmlPart.body, htmlPart.headers["content-transfer-encoding"]);
}

// public, regex-friendly error
export class MhtmlError extends Error {
  constructor(msg) { super("MHTML: " + msg); this.name = "MhtmlError"; }
}

// --- internal helpers, exported only for tests
export function findBoundary(ct) { /* … */ }
export function splitOnBoundary(text, boundary) { /* returns [{headers, body}] */ }
export function decodeTransfer(body, cteRaw) { /* … 7bit/8bit/quoted-printable/base64 … */ }
```

Run the unit test next lesson will write; for now:

```powershell
cd mvp\app
node -e "
  const fs=require('node:fs');
  const {decodeMhtml}=require('./lib/mhtml.js');
  const buf=fs.readFileSync('../../eBay/test01/captures/current.mhtml');
  const html=decodeMhtml(buf);
  console.log('decoded bytes:', html.length);
  console.log('has <li s-card>:', /li[^>]+s-card/.test(html));
"
# expect: a number in millions, plus true.
```

> ⚠️ **If you get a `Buffer is not defined` or similar** — the source used `require('fs')` and CommonJS, but our `package.json` will be ESM (we set `"type":"module"`). Convert as you port; the structure above is ESM-native. If you'd rather stay CommonJS for the lesson, set `"type":"commonjs"` and use `require`. I'll write the lessons in ESM because that's the project direction the design doc implies.

---

## Step 4.2 — `lib/extract.js` (the s-card parser)

The "core port" preserves the existing parser untouched and adds three additive fields. **Field-masked comparison** is how the golden test stays green even with added fields.

```js
// mvp/app/lib/extract.js
"use strict";

// Constants table is *no longer* hardcoded strings — they're now in profile.
// Except PROMO_ID (site-wide across all queries).
export const PROMO_ID = "170031494099"; // example; copy from your current extract.js

// extractCardsFromHtml(html, opts) -> cards[]
//   opts.profile is required so brand fallback table + variant dims flow in.
export function extractCardsFromHtml(html, opts) {
  const probe = layoutProbe(html);                  // "s-card" | "s-item" | null
  if (probe === "s-item") {
    const e = new Error("layout_drift: legacy s-item layout (v2 parser not implemented yet)");
    e.code = "layout_drift";
    throw e;
  }
  if (probe === null) {
    const e = new Error("parse_empty: no recognized listing markup");
    e.code = "parse_empty";
    throw e;
  }

  const cards = [];
  const re = /<li[^>]+class="[^"]*\bs-card\b[^"]*"[^>]+data-listingid="(?<id>[^"]+)"[\s\S]*?<\/li>/g;
  let m;
  while ((m = re.exec(html))) {
    const block = m[0];
    const id = m.groups.id;
    if (id === PROMO_ID) continue;                  // drop promo card

    const price = grabPrice(block);
    const shipping = grabShipping(block);
    const condition = grabCondition(block);
    const seller = grabSeller(block, opts.profile);
    const status = grabStatus(block);
    const format = grabFormat(block);
    const title  = grabTitle(block);
    const brand  = seller.brand;                     // already extracted into seller
    // Additive fields (new):
    const endedDate = grabEndedDate(block, status);
    const pickupNote = grabPickupNote(block);
    const topRated = /<span[^>]+toprated[^>]+>/i.test(block);
    const authorizedSeller = /authorized seller/i.test(block);

    cards.push({
      id, title, price, shipping, condition, brand, format, status,
      endedDate, pickupNote, topRated, authorizedSeller,
      seller,                                          // always an object
    });
  }
  // dedupe by id (rare; defensive)
  const seen = new Set();
  return cards.filter((c) => (seen.has(c.id) ? false : (seen.add(c.id), true)));
}

// layoutProbe(html) -> "s-card" | "s-item" | null
export function layoutProbe(html) {
  const sc = (html.match(/<li[^>]+class="[^"]*\bs-card\b/gi) || []).length;
  const si = (html.match(/<li[^>]+class="[^"]*\bs-item\b/gi) || []).length;
  if (sc === 0 && si === 0) return null;
  return sc >= si ? "s-card" : "s-item";
}

// mergeCaptures(captures, opts) -> {rows, sources}
//   captures = { current: [...], completed: [...], sold: [...] }
//   sources tracks which facets had this id.
export function mergeCaptures(captures, opts) {
  const byId = new Map();
  for (const facet of ["current","completed","sold"]) {
    for (const c of captures[facet] || []) {
      const e = byId.get(c.id) || { ...c, sources: new Set() };
      e.sources.add(facet);
      // CRITICAL: take the *latest* fields from this facet if duplicate (deterministic order current→completed→sold)
      Object.assign(e, c, { sources: e.sources });
      byId.set(c.id, e);
    }
  }
  const rows = [...byId.values()].map(({ sources, ...rest }) => ({ ...rest, sources: [...sources] }));
  return { rows, sources: countSources(rows) };
}

// --- field-masked comparator — what the golden test uses
const MASK = new Set([
  "capturedAt", "capturedFrom",
  // additive fields added in this port are also masked (golden is byte-locked on older shape)
  "endedDate", "pickupNote", "topRated", "authorizedSeller"
]);
export function maskForGolden(row) {
  const out = {};
  for (const [k, v] of Object.entries(row)) {
    if (!MASK.has(k)) out[k] = v;
  }
  return out;
}

// --- internal grabbers (implementation lifted from scratch/extract.js verbatim,
//     with constants moved to opts/ profile — not duplicated here for brevity).
function grabPrice(block) { /* … */ }
function grabShipping(block) { /* … */ }
// …
```

The grabbers — `grabPrice`, `grabShipping`, `grabCondition`, `grabSeller`, `grabStatus`, `grabFormat`, `grabTitle`, `grabEndedDate`, `grabPickupNote` — are *direct lifts* from `scratch/extract.js`. They use string/regex. Don't rewrite them; *parameterize* them.

When something throws, throw with a `code` matching the typed taxonomy:
```
parse_drift · parse_empty · layout_drift
```

> 📌 **Note on `seller` as an object.** The dashboard's `riskScore()` does `seller.topRated`, `seller.authorizedSeller` — *unconditionally*. The extraction must *always* return `seller` as `{topRated: boolean, authorizedSeller: boolean}`. Bare `null` is a parse_drift.

---

## Step 4.3 — `profiles/*.json` (the right place for product knowledge)

`profiles/mac-studio-m3-ultra.json`:

```json
{
  "id": "mac-studio-m3-ultra",
  "label": "Apple Mac Studio (M3 Ultra)",
  "family": "mac-studio",
  "match": {
    "queryPatterns": ["mac\\s*studio", "m3\\s*ultra"]
  },
  "variants": {
    "dims": [
      { "regex": "m3\\s*ultra", "label": "M3 Ultra" },
      { "regex": "m3\\s*max",   "label": "M3 Max" },
      { "regex": "m2\\s*ultra", "label": "M2 Ultra" }
    ],
    "extraRegexes": ["soldered", "unified memory", "ssd"],
    "keyTemplate": "{variant}-{mem}tb",
    "labelTemplate": "Mac Studio ({variant}, {mem}TB)"
  },
  "msrp": {
    "table": [
      { "label": "M3 Ultra", "msrp": 3999, "msrpFloor": 3400 },
      { "label": "M3 Max",   "msrp": 1999, "msrpFloor": 1700 },
      { "label": "M2 Ultra", "msrp": 2999, "msrpFloor": 2500 }
    ],
    "floorByDim": { "tb": 320 }
  },
  "specFloors": {
    "minSsdGb": 512
  },
  "facts": {
    "ramNotes": "Unified memory; not user-upgradeable.",
    "ssdNotes": "Apple-soldered SSD on all current SKUs."
  },
  "brands": {
    "^apple$|^apple\\s*inc$": "Apple"
  },
  "attributes": {
    "vramGb": null
  },
  "relevance": {
    "requireTokens": ["mac", "studio"],
    "exclude": [
      { "reason": "wrong-model",   "regex": "(m1\\s*(max|ultra)|m2\\s*max)\\b" },
      { "reason": "case-only",     "regex": "\\b(case|sleeve|skin|stand|shell)\\b" },
      { "reason": "accessory",     "regex": "\\b(dock|adapter|cable|charger)\\b" }
    ]
  },
  "msrpNote": "MSRP per current Apple Store pricing."
}
```

`profiles/rtx-3090.json`:

```json
{
  "id": "rtx-3090",
  "label": "NVIDIA GeForce RTX 3090",
  "family": "rtx-3090",
  "match": { "queryPatterns": ["rtx\\s*3090(?![-\\s]*ti|\\s*super)"] },
  "variants": {
    "dims": [
      { "regex": "founders\\s*edition", "label": "Founders Edition" },
      { "regex": "ftw3|asus\\s*rog",    "label": "ASUS ROG" },
      { "regex": "strix",               "label": "ASUS ROG Strix" },
      { "regex": "suprim",              "label": "MSI Suprim" },
      { "regex": "ventus",              "label": "MSI Ventus" },
      { "regex": "gaming\\s*x\\s*triple|tuf", "label": "ASUS TUF" },
      { "regex": "evga\\s*ftw3|evga\\s*xc3", "label": "EVGA FTW3" }
    ],
    "extraRegexes": ["gddr6x", "24gb", "oc"],
    "keyTemplate": "{brand}-{vram}gb",
    "labelTemplate": "{brand} RTX 3090 {variant}"
  },
  "msrp": {
    "table": [ { "label": "RTX 3090", "msrp": 1499, "msrpFloor": 900 } ],
    "floorByDim": { "msrpFloorRatio": 0.6 }
  },
  "specFloors": { "minVramGb": 24 },
  "facts": { "vramNotes": "24 GB GDDR6X is the canonical spec — flags anything below." },
  "brands": {
    "asus": "ASUS", "msi": "MSI", "evga": "EVGA", "nvidia": "NVIDIA",
    "gigabyte": "Gigabyte", "zotac": "Zotac", "pny": "PNY"
  },
  "attributes": {
    "vramGb": { "regex": "(\\d{1,2})\\s*gb", "group": 1, "match": 24 }
  },
  "relevance": {
    "exclude": [
      { "reason": "model-variant", "regex": "3090\\s*ti\\b|3090\\s*super\\b" },
      { "reason": "accessory",     "regex": "(backplate|bracket|cooler|fan\\s*only)" },
      { "reason": "lot-or-bundle", "regex": "\\b(lot\\s*of|2x|3x|4x|pair|bulk)\\b" }
    ]
  },
  "msrpNote": "NVIDIA's launch MSRP for FE; AIB partners may differ."
}
```

The `genericProfile(query)` returns:

```json
{
  "id": "generic",
  "label": "<query>",
  "family": "generic",
  "match": { "queryPatterns": [".*"] },
  "variants": { "dims": [], "extraRegexes": [], "keyTemplate": "v0", "labelTemplate": "<query>" },
  "msrp": { "table": [], "floorByDim": {} },
  "specFloors": {},
  "facts": {},
  "brands": {},
  "attributes": {},
  "relevance": {
    "exclude": [
      { "reason": "lot-or-bundle", "regex": "\\b(lot\\s*of|2x|3x|4x|pair|bulk)\\b" }
    ]
  },
  "msrpNote": ""
}
```

So **arbitrary queries work** — bands aren't strictly comparable to a vendor's MSRP, but the dashboard still produces a useful distribution + risk score and the "scam-zone cutoff" is computed from the data itself.

---

## Step 4.4 — `lib/profile.js` (the loader)

```js
// mvp/app/lib/profile.js
import fs from "node:fs/promises";
import path from "node:path";

export async function loadProfile(id) {
  const p = path.resolve("profiles", `${id}.json`);
  return JSON.parse(await fs.readFile(p, "utf8"));
}

export async function matchProfile(query) {
  const dir = path.resolve("profiles");
  const files = (await fs.readdir(dir)).filter((f) => f.endsWith(".json"));
  for (const f of files) {
    const p = JSON.parse(await fs.readFile(path.join(dir, f), "utf8"));
    if (p.id === "generic") continue;
    if ((p.match?.queryPatterns || []).some((rx) => new RegExp(rx, "i").test(query))) {
      return p;
    }
  }
  return null;
}

export function genericProfile(query) {
  return {
    id: "generic",
    label: query,
    family: "generic",
    match: { queryPatterns: [".*"] },
    variants: { dims: [], extraRegexes: [], keyTemplate: "v0", labelTemplate: query },
    msrp:     { table: [], floorByDim: {} },
    specFloors: {},
    facts: {}, brands: {}, attributes: {},
    relevance: { exclude: [
      { reason: "lot-or-bundle", regex: "\\b(lot\\s*of|2x|3x|4x|pair|bulk)\\b" }
    ]},
    msrpNote: ""
  };
}
```

---

## Step 4.5 — `lib/relevance.js` (the *new* filter module)

```js
// mvp/app/lib/relevance.js
"use strict";

// filterRelevant(listings, query, profile) -> {kept, excluded, byReason}
export function filterRelevant(listings, query, profile) {
  const kept = [];
  const excluded = [];
  const byReason = Object.create(null);

  // Significant query tokens: include-biased heuristic.
  //   tokens < 2 chars are skipped; > 2 chars must appear somewhere in title.
  const tokens = query
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length >= 2);

  for (const l of listings) {
    const title = (l.title || "").toLowerCase();

    // profile rule  -- first match wins
    let dropped = false;
    for (const rule of profile.relevance?.exclude || []) {
      if (new RegExp(rule.regex, "i").test(`${title} ${l.condition||""}`)) {
        exclude(l, rule.reason);
        dropped = true;
        break;
      }
    }
    if (dropped) continue;

    // requireTokens (if profile specifies them) — hard require
    const require = profile.relevance?.requireTokens || [];
    if (require.length && !require.every((t) => title.includes(t))) {
      exclude(l, "off-topic");
      continue;
    }

    // significant-token heuristic — at least one significant query token must appear in title
    if (tokens.length && !tokens.some((t) => title.includes(t))) {
      exclude(l, "no-query-tokens");
      continue;
    }

    kept.push(l);
  }

  function exclude(l, reason) {
    excluded.push({ ...l, _excludeReason: reason });
    byReason[reason] = (byReason[reason] || 0) + 1;
  }

  return { kept, excluded, byReason };
}
```

> **Heads-up on the heuristic:** this is *inclusion-biased*. That is on purpose — the design doc is explicit: a missed exclusion beats a missed inclusion for the *closed-beta* demo audience. We'll tighten in v1.

---

## Step 4.6 — `lib/analyze.js` (parameterize, don't rewrite)

Lifting `scratch/analyze2.js` mechanically, but with every hardcoded constant replaced:

| Old constant | New home |
|---|---|
| `APPLE_REF` regex | `profile.attributes.vramGb.regex` or `profile.brands` |
| `SSD_FLOOR` | `profile.specFloors.minSsdGb` |
| Network thresholds (IQR ratio, minBandN, msrpFloorRatio) | `opts` with current defaults |
| `homeCountry` | `opts` |
| `variants.dims` | `profile.variants.dims` |
| Risk flags/score/verdicts | **unchanged** (these are product-agnostic — they answer "is this suspicious?") |

Skeleton:

```js
// mvp/app/lib/analyze.js
export function analyze(dataset, profile, opts = {}) {
  const o = {
    minBandN: 8,
    msrpFloorRatio: 0.6,
    homeCountry: "US",
    scamZoneQuantile: 0.05,   // 5th percentile used as scam-zone cutoff below this is suspicious
    ...opts,
  };

  // … exact port of analyze2.js, replacing constants with profile.* / opts.* …

  return analysisJson;
}
```

The full body is a direct port; the constant map is the entire change. Any skill-call someone else might want is in `o`, not in the function body.

---

## Step 4.7 — `lib/report.js` (the 22-field adapter)

```js
// mvp/app/lib/report.js
import fs from "node:fs/promises";
import path from "node:path";

export async function buildReport(jobDir, { rows, byReason, profile, analysis }) {
  const records = rows.map((r) => recordForAnalysis(r, profile));

  const meta = {
    query: records[0]?.capturedFrom?.query || "",
    productLabel: profile.label,
    capturedAt: new Date().toISOString(),
    counts: countByStatus(records),
    excludedByReason: byReason,
    excludedTotal: Object.values(byReason || {}).reduce((a, b) => a + b, 0),
    facets: [                                       // populated by orchestrator in L6
      { key: "current",   status: "ok", cards: 0, note: "" },
      { key: "completed", status: "ok", cards: 0, note: "" },
      { key: "sold",      status: "ok", cards: 0, note: "" }
    ],
    profileId: profile.id
  };

  const dataJs =
    "window.SCAMSHIELD_META = " + JSON.stringify(meta, null, 2) + ";\n" +
    "window.SCAMSHIELD_DATA = " + JSON.stringify(records, null, 2) + ";\n";

  const reportDir = path.join(jobDir, "report");
  await fs.mkdir(reportDir, { recursive: true });

  const tmplDir = path.resolve("views/dashboard");
  await fs.copyFile(path.join(tmplDir, "index.html"), path.join(reportDir, "index.html"));
  await fs.copyFile(path.join(tmplDir, "common.css"), path.join(reportDir, "common.css"));
  await fs.copyFile(path.join(tmplDir, "common.js"),  path.join(reportDir, "common.js"));
  await fs.writeFile(path.join(reportDir, "data.js"), dataJs, "utf8");
}

// recordForAnalysis(l, profile) — 22-field contract; references omitted for brevity
function recordForAnalysis(l, profile) { /* … the design-doc mapping table … */ }
function countByStatus(records) { /* … */ }
```

The 22-field mapping is documented verbatim in design.md §6.2. The shape is:

```
id · title · price · shipping · condition · brand · status · format · statusDate ·
capturedFrom · landedPrice · topRated · authorizedSeller · pickupNote · endedDate ·
vramGb · seller · sources · landedPriceFallback · … (see design.md §6.2)
```

`landedPrice` is **always** a number; if shipping missing or unparseable, it falls back to `price`. The dashboard's log axis demands it.

---

## Step 4.8 — `cli.js` (replay command — your daily driver)

```js
#!/usr/bin/env node
// mvp/app/cli.js
"use strict";

import path from "node:path";
import fs from "node:fs/promises";
import { decodeMhtml } from "./lib/mhtml.js";
import { extractCardsFromHtml, mergeCaptures, maskForGolden } from "./lib/extract.js";
import { filterRelevant } from "./lib/relevance.js";
import { analyze } from "./lib/analyze.js";
import { buildReport } from "./lib/report.js";
import { loadProfile, matchProfile, genericProfile } from "./lib/profile.js";

const [, , cmd, ...rest] = process.argv;
const args = Object.fromEntries(rest.flatMap((a) => {
  const [k, ...v] = a.replace(/^--/, "").split("=");
  return v.length ? [[k, v.join("=")]] : [];
}));

(async () => {
  if (cmd === "replay") {
    const jobDir = path.resolve(args.dir || "../../eBay/test01");
    const captures = { current: null, completed: null, sold: null };

    for (const f of ["current", "completed", "sold"]) {
      const m = path.join(jobDir, "captures", `${f}.mhtml`);
      if (!await exists(m)) { captures[f] = []; continue; }
      const html = decodeMhtml(await fs.readFile(m));
      try {
        captures[f] = extractCardsFromHtml(html, { profile: { relevance: { exclude: [] }, brands: {} } });
      } catch (e) {
        captures[f] = [];
        console.warn(`facet ${f}: ${e.code || "error"}`);
      }
      console.log(`facet ${f}: ${captures[f].length} cards`);
    }

    const merged = mergeCaptures(captures, {});
    console.log("merged:", merged.rows.length, "rows");

    const profile = (await matchProfile(args.query || "mac studio")) || genericProfile("test query");
    const { kept, excluded, byReason } = filterRelevant(merged.rows, args.query || "mac studio", profile);
    console.log("relevance: kept", kept.length, "excluded", excluded.length, "byReason", byReason);

    const analysis = analyze({ records: kept }, profile, {});
    await buildReport(jobDir, { rows: kept, byReason, profile, analysis });
    console.log("report →", path.join(jobDir, "report"));
  }
  /* 'live' command lives in L5 once we have capture.js. */
})().catch((e) => { console.error(e); process.exit(2); });

async function exists(p) { try { await fs.access(p); return true; } catch { return false; } }
```

Run it:

```powershell
cd mvp\app
node cli.js replay --dir=..\..\eBay\test01 --query="mac studio"
# expect: facet counts > 0, merged > 0, kept + excluded printed, report/ written.
```

---

## Step 4.9 — `test/golden.test.js` (the non-negotiable gate)

The test is strict **but field-masked**, so additive fields don't break it:

```js
// mvp/app/test/golden.test.js
import { test } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import fs from "node:fs/promises";
import { decodeMhtml } from "../lib/mhtml.js";
import { extractCardsFromHtml, mergeCaptures, maskForGolden } from "../lib/extract.js";

const TEST01 = path.resolve("../../eBay/test01");
const GOLDEN = path.resolve("../../deliverable/data/dataset.json");

test("golden: replaying test01 reproduces the deliverable's dataset (field-masked)", async () => {
  const captures = {};
  for (const f of ["current","completed","sold"]) {
    const m = path.join(TEST01, "captures", `${f}.mhtml`);
    if (!await exists(m)) { captures[f] = []; continue; }
    const html = decodeMhtml(await fs.readFile(m));
    captures[f] = extractCardsFromHtml(html, { profile: { relevance: { exclude: [] }, brands: {} } });
  }

  const merged = mergeCaptures(captures, {});

  const golden = JSON.parse(await fs.readFile(GOLDEN, "utf8"));

  // Field-masked comparison: only the original 22-field shape matters.
  // We expect: same set of listing ids, with the masked fields equal.
  const goldenById = new Map(golden.map((r) => [r.id, r]));
  let mismatches = 0;
  for (const row of merged.rows) {
    const g = goldenById.get(row.id);
    if (!g) continue;
    const mRow = maskForGolden(row);
    const mGold = maskForGolden(g);
    const a = JSON.stringify(mRow, Object.keys(mRow).sort());
    const b = JSON.stringify(mGold, Object.keys(mGold).sort());
    if (a !== b) {
      if (mismatches === 0) {
        console.log("first divergence:", row.id, "\n  row:", a, "\n  gold:", b);
      }
      mismatches++;
    }
  }

  // Per design doc: golden must reproduce "field-masked deep compare".
  // A small mismatch budget is allowed (e.g. eBay's noise strings evolve); we
  // assert strict-zero here and let the test scream loudly when it doesn't.
  assert.equal(mismatches, 0, `golden test produced ${mismatches} diffs; see first divergence above`);
});

async function exists(p) { try { await fs.access(p); return true; } catch { return false; } }
```

Run it:

```powershell
cd mvp\app
node --test test/golden.test.js
# → expect: 1 test, 0 failures; and the console.log should NOT print if zero.
```

> The first time this test *passes without printing "first divergence"* is the moment the design doc says you're golden. **Tag it immediately.**

```powershell
git tag -a v0.1-scaffold-golden -m "Golden replay reproduces design.md golden dataset field-masked"
git push --tags
```

---

## Step 4.10 — What's deliberately NOT in this lesson

- ✋ No browser. No Playwright launch. No `lib/capture.js`. (L5.)
- ✋ No orchestrator, no SSE, no home page. (L6.)
- ✋ No dashboard port yet. (L7 — but the byte-identical asset copy works because `lib/report.js` already references `views/dashboard/`.)
- ✋ No live-server smoke. (L8/VPS onward.)

If you find yourself about to write any of these in L4, you're *out of order*. Stop, tag what you have, and continue in the next lesson.

---

## Anti-patterns to avoid

- ⛔ **Don't re-write the parsers.** The instruction is "port, then *parameterize*, never rewrite". If you find yourself improving regex output mid-port, split the change into two commits.
- ⛔ **Don't hardcode product knowledge into `lib/`**. If a constant changes with the product family, it goes in `profiles/*.json`. The litmus test: rename `mac-studio` to `mac-pro` and the test should still need zero code changes, only the profile.
- ⛔ **Don't run the golden test against `deliverable-rtx3090/data.js`.** That's a different shape — the schema tripwire catches it; we run `replay-rtx.test.js` instead (separate file, separate assertion set).
- ⛔ **Don't disable the test on failure.** If it fails, *read the first divergence line*. Add a console.log of the failing path; don't blanket-skip.

---

## What "done" means for Lesson 4

In one PowerShell tab, with zero warnings:

```powershell
cd D:\stuff\ai-misc\_bsh2026\vscode_project01\70\mvp\app
node --test test/golden.test.js
# 1 test passed
# (no "first divergence" should print)

git status                # dirty: lib/, test/, profiles/, cli.js, package.json (updated)
git add -A
git commit -m "port: lib/* + profiles/* + cli.js replay + golden.test.js green"
git tag -a v0.1-scaffold-golden -m "Golden replay reproduces golden dataset field-masked"
git push --tags
```

When the tag is live and `git tag | findstr scaffold-golden` shows it on your local clone, Lesson 4 is complete. The next lesson adds the only piece that touches a real browser — and because the pipeline is parameter-driven now, the capture module becomes a thin orchestrator around Playwright with almost no business logic.

Lesson 5 incoming when you're ready.
