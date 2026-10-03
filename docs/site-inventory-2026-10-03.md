# rayrite.github.io — Site Inventory & Executive Summary

Compiled 2026-10-03. Scope: entire repo (excluding `.git/`). ~1,900 files across 23 top-level
sections. Four Explore agents deep-read every content section; findings condensed here.

> Note: this file lives in `docs/` which is meta-documentation, not published site content.

---

## Site-level executive summary

The repository is the published GitHub Pages site of rayrite ("Cooly", Batonic Labs, Detroit) and
functions as a **personal lab bench and publishing hub**. Content falls into four families:

1. **AI/LLM research & writing corpora** — `cvx/`, `bcf/`, `bsh/docs/`, `md/`, `scam/`, `md-dxc/`
   Multi-model research roundups, competition whitepapers, project plans, venture documentation,
   and internal work docs — browsed through a "Markdown Viewer" app that has been copy-pasted
   (near-byte-identical) into at least 4 folders.
2. **Interactive study tools** — `aws/`, `aws2/`, `exam/`
   Three generations of AWS certification engines: ~5,300 practice questions across 11 datasets,
   a 979-entry multi-exam glossary, 82 comparison tables, 122 annotated figures, a domain-weighted
   exam simulator.
3. **Data-visualization / dataset apps** — `ph/`, `devh/`, `dukr/opensource/`, `ur/`, `fs/`, `money/`, `da/`
   Self-contained viewers over scraped datasets: 11,872 Product Hunt launches, 13,983 Bluesky
   reviews, 818 DevHunt products, 8,805 GitHub repos, 50,848 media-archive entries, 254 watchlist
   tickers, 19 competition winners.
4. **Creative & WebGL work** — `demo/`, `img/`, `bleum/`, `bsh/` (game), `dukr/` (marketing)
   The "CVX Splash" animated-background demo library (4 families × 6–7 studies), Three.js fog
   experiments, a Beyoncé zoomable career timeline, an Art-of-Balance-style physics puzzle game,
   and DUKR product marketing pages.

**Structural problems this inventory surfaced:**
- The root `index.html` is a throwaway "Responsive Image Gallery" (11 hardcoded JPGs + pricing
  link). There is **no front door** and no navigation between the 23 sections.
- The **same markdown reader** exists as 4 copies (`md/`, `md-dxc/`, `scam/`, `dukr/opensource/1/`)
  plus one divergent variant (`mdh/`), none with search, prev/next navigation, or preference
  persistence. Helper scripts (`create_manifest.py`, `combine_md.py`) are likewise duplicated ×6.
- **Design is inconsistent**: each app has its own palette, typography, and interaction model
  (purple-gradient, indigo-dashboard, navy-academic, dark-terminal, pastel-consulting…).
- `md-dxc/` holds real internal work documents (payroll/HR incident and patch-plan docs) in the
  public tree — worth flagging for any curation decision.
- Roughly 30MB of the repo is raw extraction output not wired into any UI
  (`aws/quest/aws_e2_images/` — 1,292 JPGs; `aws1600t.html` — 1,725 tables).

---

## Section-by-section inventory

| # | Path | Family | What it is | Scale | Main entry |
|---|------|--------|-----------|-------|------------|
| 1 | `aws/` | Study | Gen-1 AWS study tools: MCQ practice + glossary | 1,310 files, ~11MB JSON | `aws/quest/index.html`, `aws/gloss/index.html` |
| 2 | `aws2/` | Study | Gen-2 "AWS Study Kit": CLF-C02 + AIF-C01 + SAA-C03 | 190 files, 177 imgs | `aws2/index.html` |
| 3 | `exam/` | Study | CLF-C02 exam simulator (65q/90min, domain-weighted) | 13 files, ~10.6MB data | `exam/index.html` |
| 4 | `bcf/` | Research | Gemma-4 competition whitepaper, 2 drafts | 2 files, ~95KB | `bcf/index.html` |
| 5 | `bleum/` | Creative | ChronoSync zoomable timelines (Beyoncé) | 1.15MB current + 4 old | `bleum/1/index.html` |
| 6 | `bsh/` | Creative+Docs | Physics puzzle game + 27-doc AI-model corpus | 586KB game, ~4.4MB docs | `bsh/index.html`, `bsh/docs/index.html` |
| 7 | `cvx/` | Research | 4 sub-hubs with Markdown Viewer template | 68 files, ~8.9MB | per-subfolder `index.html` |
| 8 | `da/` | Data viz | DeepAgent competition winners showcase (19) | 1 file, 196KB | `da/index.html` |
| 9 | `demo/` | Creative | "CVX Splash" background-demo library | 48 files, ~828KB | `demo/2/index.html` |
| 10 | `devh/` | Data viz | DevHunt product viewers (818 + 206 products) | 4 files, ~504KB | `devh/index.html` |
| 11 | `dukr/` | Mixed | DUKR marketing + repo explorers + reader prototype | ~22MB total | `dukr/dukr01.html`, `dukr/opensource/index.html` |
| 12 | `exam` | — | (see #3) | | |
| 13 | `files/` | — | Empty placeholder folder | 0 files | — |
| 14 | `fonts/` | Legacy | Three.js typeface glyph JSON (`vr.json`) | 1 file, 502KB | — |
| 15 | `fs/` | Data viz | Media-archive showcase apps (3,130 + 50,848 records) | ~57MB | `fs/index.html`, `fs/1/index.html` |
| 16 | `gjl/` | Business | GJL Consulting LLC real business website | 19 files, ~396KB | `gjl/index.html` |
| 17 | `img/` | Creative | Three.js cloud/fog animation experiments | 10 files, ~2.1MB | `img/index.html` |
| 18 | `md/` | Reader | Markdown Viewer (production) + 10 repo catalogs | 14 files | `md/index.html` |
| 19 | `md-dxc/` | Reader | Same reader + internal payroll/HR work docs | ~20 files | `md-dxc/index.html` |
| 20 | `mdh/` | Reader | Divergent "Document Browser" for pre-rendered HTML | 12 files | `mdh/index.html` |
| 21 | `money/` | Data viz | Investor watchlist dashboards (DRAM, IoT/sensors) | 2 files, ~240KB | `money/1/index.html` |
| 22 | `ph/` | Data viz | Product Hunt viewers (11,872 + 8,449 + 1,337 FOSS) | ~11.8MB | `ph/index.html` |
| 23 | `scam/` | Research/Reader | ScamShield venture docs in same reader | ~31 files | `scam/index.html` |
| 24 | `ur/` | Data viz | Bluesky Google-Play reviews browser (13,983) | 4 files, ~7MB | `ur/index.html` |

Root-level files: old landing `index.html` + 6 index variants + `pricing.html`, `dukr.png` logo,
11 gallery JPGs, `aws2-…zip` (720KB), `create_manifest.py`/`combine_md.py` + `.bat` copies,
`LAUNCH_WEB_SERVER.bat`, `.github/workflows/generate-manifest.yml`.

---

## Per-section detail

### aws/ — Gen-1 AWS study tools
- `quest/index.html` "AWS MCQ Practice — Comprehensive Edition": MCQApp with Question Browser
  (search/domain/category filters) + Quiz Mode (time limits, dataset multi-select). 11 JSON
  datasets, ~5,317 questions total (1,679-question original bank + 10 exam rips E2–E9).
  Question schema: `{id, question, options[], correct_answers[], explanation, numchoices, domain, category}`.
- `gloss/index.html` "AWS Services Glossary": category dropdown, live search, expandable
  comparison tables, type-in quiz mode with fuzzy matching. Tailwind CDN, indigo.
- Raw artifacts not wired into any UI: `aws_e2_images/` (1,292 JPGs), `aws1600t.html`
  (1,725 extracted tables).
- Design: purple-gradient body, frosted white container (quest); Tailwind slate/indigo (gloss).

### aws2/ — Gen-2 "AWS Study Kit"
- `index.html` "Combined Browser": tabs Tables/Glossary/Images over embedded TABLES (82),
  GLOSSARY (979), IMAGES (122); search with `/` focus, dark mode, font-size slider, localStorage
  bookmarks, lightbox modal. Inter font, CSS variables, per-exam colors
  (CLF #3b82f6 / AIF #8b5cf6 / SAA #14b8a6).
- `1/` "AWS Study KB Viewer" (static KB export, 153 tables); `2/`+`2b/` "SAA-C03 Visual Study
  Guide" (domain tabs, 24 flash cards, tracker; dark navy + AWS orange, Sora/Space Mono);
  `exam/` "AWS Practice" (745 SAA questions: browser/custom quiz/mock exam with timer + flags).
- `unified/`: stdlib-only Python `extract_images.py` + `build_image_browser.py` → image browser.

### exam/ — CLF-C02 Exam Simulator
- `index.html` + `js/app.js` (60KB ExamSimulator class): Exam vs Study mode, 90-min global +
  1:30 per-question timers, question legend, review tab with time statistics + export,
  hamburger mobile nav. Domain-weighted selection (26/25/33/16%), ≥34% multi-response.
- Data: byte-identical copies of aws/quest datasets (minus e7) = 5,252 questions.

### bcf/ — BCF competition whitepapers
- Draft 01 `bcf/index.html`: "BCF: A Specification-Driven Methodology for Autonomous Software
  Engineering Agents" — graph-first localization, budget-aware sequencing, spec-before-execution
  on gemma-4-31b / RTX 5090; claims measured turn reductions (24→9, 30→10).
- Draft 02 `bcf/2/…20260928.html`: honesty-revised retarget to Nov 12 2026 deadline; adds
  BCF-SWE-Python Taxonomy (129 human-verified labeled tasks, 12 bug categories, complexity
  tiers); reframes results as illustrative/estimated; 8-week experimental protocol.
- Academic-journal aesthetic: navy header band, Spectral serif body, IBM Plex Sans/Mono,
  hand-built CSS figures, numbered references.

### bleum/ — ChronoSync zoomable timelines
- `1/index.html` (1.15MB): PixiJS/WebGL zoomable Beyoncé career timeline, 8 tracks, guided-tour
  "wings" with visited-state tracking, perf HUD. Dark cinematic slate/navy + gold/pink.
- `old/`: Zoomable Timeline, ChronoView/ChronoSync multi-subject comparisons (Jobs, Zuckerberg,
  Musk, Gates) + events.json. `2/` empty placeholder.

### bsh/ — physics game + model-comparison corpus
- `index.html` "BSH Game v20" (586KB, 12.5k lines): Canvas2D Art-of-Balance-style stacker;
  materials/friction/restitution, rotation zones, special blocks, level editor, levelData.json
  (format 2.2). Fredoka font, themed gradient backgrounds.
- `docs/index/`: **27 markdown files (~4.4MB)** — the same "clone Art of Balance in Unity 6.x"
  brief answered by ~27 AI model/front-end combinations (Claude Code, Abacus, Genspark, Grok,
  web UIs…), e.g. a 150,140-word SRS/master task list. Plus `selfhost_shortlist.md` (65-category
  FOSS tool shortlist). Viewed via the Markdown Viewer clone (`bsh/docs/index.html`).

### cvx/ — research-document hub (4 sub-hubs, shared Markdown Viewer)
- `advertising/`: 3,727-line "Comprehensive Resource Guide — Intelligent Discussion & Debate"
  (7 topic tabs) + `2/` viewer with 5 model-variant DUKR audience-research docs.
- `companal/`: viewer + combined industry deep-dives (news apps, link-in-bio SaaS, dating apps,
  social networking — some as GLM vs MiniMax model pairs).
- `kaggle/`: **36-item research corpus** for the Gemma-4 competition: multi-model roundups,
  BCF whitepaper v3 drafts, roadmaps, metadata wishlists, SWE-bench research, leaderboard
  analysis. `kaggle/2/`: httpx_3672 slide decks (v1–v3, dark scroll-snap).
- `plan/`: "Cooly Platform — Master Project Plan" v1/v2 (full-SDLC living doc, MVP/PMF/SCALE tags).

### da/ — DeepAgent winners showcase
- Single 2,202-line page: 19 competition winners with screenshot carousels, back-to-top.
  Purple-gradient + white cards.

### demo/ — "CVX Splash" demo library
- `1/`: Babylon.js 3D falling-glyphs experiments (floor*.html ×5).
- `2/`: menu ("The whole shelf") + preview gallery + references ("Nebula Drift" pixijs.com
  recreation, "Clouds Moving Toward Camera" — the brief) + 8 particle studies + 4 variation
  families (constellation, ocean, abyss, clouds; 6–7 studies each). Canvas 2D / WebGL / PixiJS.

### devh/ — DevHunt viewers
- `index.html` "DevHunt Full — Product Viewer" (818 products from merged JSON);
  `index2.html` (206 products with live previews). Light card grid, search/filter/sort.

### dukr/ — DUKR product + repo explorers + reader prototype
- Marketing: `dukr01/01b/02/02b/02c/02d.html` ("a dynamic social expression platform dedicated
  to debates"), text/image carousels, promo pricing tab01.
- `homecat/`: "AtariVault 2600 — WebGL2 Data Grid" (4,000 games / 80,000 cells).
- `kevin/`: "The Roast of Kevin Hart — News Tracker" (508KB inline).
- `opensource/`: 5 self-contained GitHub-repo explorers (8,805 repos; 821-entry FOSS deep
  research; 5,123-mention taxonomy; 4,351-tool index; 2,146 bookmarks); `1/` also holds the
  original `index_markdown_reader.html` prototype + items/.

### fs/ — media-archive showcases (heaviest folder, ~57MB)
- `index.html` "ARCHIVE — coderprog media showcase": 3,130 scraped posts embedded inline.
- `1/index.html` (~47MB): gzip+base64 blob of 50,848 prizrak.ws entries, virtualized table,
  click-to-copy IDs. Dark terminal aesthetic (#08080E), 13px UI. Cover images reference an
  external path not in repo.

### gjl/ — GJL Consulting LLC website
- Real business site: hero, 5 services (root-cause analysis, business affairs, health plans,
  credit, homebuying), testimonials, discovery-call booking, payment methods (PayPal/Venmo/
  Cash App/Zelle), newsletter, cookie banner. Inter + Playfair Display. The only conventional
  multi-page site.

### img/ — Three.js experiments
- Clouds animation ×2 variants, endless white-fog walk ×3 (one with 3D letters).
  Sprite clouds over ice/sunrise textures.

### md/, md-dxc/, scam/, dukr/opensource/1/ — the Markdown Viewer (4 copies)
- One ~25KB self-contained app, near-identical across folders: `items/manifest.json`
  (`{files:[{filename, originalPath}]}`) → GitHub Contents API fallback; marked.js + DOMPurify
  + Prism pipeline; grouped file dropdown; pill-nav ≤5 headings else sidebar TOC with
  IntersectionObserver scroll-spy; A−/A+ font controls 12–24px; light + Navy/Maize dark mode;
  print mode; Ctrl+P / Ctrl+Shift+P / Alt+R shortcuts. **No search, no prev/next, no
  preference persistence.**
- Payloads: `md/` = 10 repository catalogs; `md-dxc/` = internal payroll/HR incident & patch
  docs (real work documents); `scam/` = ScamShield venture docs (~29 files: prompts, deploy
  guides, go-live checklists, pitch prep).

### mdh/ — divergent "Document Browser"
- No manifest; hard-coded GitHub Contents API listing; pre-rendered `.html` AWS study pages in
  full-screen iframes; naive regex markdown renderer (no tables/sanitize); persistent sidebar.
  11 AWS/AI-security study items.

### money/ — investor watchlists
- `1/` "2026 DRAM Shortage Watchlist" (132 tickers); `2/` "IoT, Sensors & Physical AI" (122).
  4 tabs (watchlist/links/supply chain/glossary), filters, export, dark theme with gradient
  headings (#6c8cff→#a78bfa).

### ph/ — Product Hunt viewers
- `index.html` (5.1MB): 11,872 products Jun–Sep 2026. `1/` (642KB): FOSS-only roundup, 1,337
  items Jan–Sep 2026 (**has the current uncommitted modification** — a routine monthly data
  refresh, 5+/5− lines, no structural change). `2/` (3.65MB): 8,449 items Jan–May. `old-1/`:
  archived snapshots.
- Shared UI: debounced search, month-colored filter chips, tag grid, favorites (localStorage),
  card/table views with virtualized scrolling, JSON export, dark mode. Inter + Font Awesome,
  indigo #6366f1 accent — **the most polished design system in the repo.**

### ur/ — Bluesky reviews browser
- `index.html` + `script.js`/`styles.css` over `bluesky_reviews_raw.json` (6.9MB, 13,983
  reviews). Search, star filters, 5 sorts, date ranges, pagination, dev responses.
  Purple-gradient frosted-glass cards.

### Root files
- `index.html` — "Responsive Image Gallery" (11 JPGs, modal viewer, pricing link). Variants:
  `index_01/02/03/basic/test/old.html`, `updated-index-html.html`, `pricing.html` (DUKR-style
  pricing tiers). `dukr.png` logo. 11 gallery JPGs. `aws2-…zip` archive.
- `LAUNCH_WEB_SERVER.bat` → `python -m http.server 8000`.
- `.github/workflows/generate-manifest.yml` — auto-regenerates `cvx/advertising/2/items/
  manifest.json` on push (plain-array format, jq-built, committed by github-actions bot).

---

## Recurring infrastructure (what a refresh script must respect)

1. **Manifest contract**: `{ "files": [ { "filename": "...", "originalPath": "..." } ] }`
   produced by `create_manifest.py` (which also *sanitizes/renames* md filenames in place).
   One workflow emits a plain string array instead (tolerated by the reader).
2. **combine_md.py/.bat**: concatenates `*.md` → `_COMBINED.md` with FILE demarcation.
3. **GitHub-API fallback**: readers fall back to the Contents API when a manifest is missing —
   the site works even with stale manifests, but correctness depends on the repo being public.
4. **Local serving**: several apps require HTTP (fetch of JSON) — `LAUNCH_WEB_SERVER.bat`.
