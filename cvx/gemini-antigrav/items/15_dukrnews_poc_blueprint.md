# Dukrnews Poc Blueprint

**Classification**: CVX Unified Research Collection  
**Source Deliverable**: `2026-10-13-dukrnews-poc-blueprint`  
**Constituent Files**: 3 documents  
**Generated**: 2026-10-14 01:10:55  

---

## Master Table of Contents

1. [DUKRNews — Composite Feature Catalog (Brainstorm & Compilation)](#doc-1-01-dukrnews-composite-feature-catalog) (`01-dukrnews-composite-feature-catalog.md`)
2. [DUKRNews — Proof-of-Concept Architecture Blueprint (Micro-Library Compositing)](#doc-2-02-dukrnews-poc-architecture-blueprint) (`02-dukrnews-poc-architecture-blueprint.md`)
3. [Software Research: FOSS Micro-Library Stack for DUKRNews](#doc-3-03-software-research-dukrnews-foss-stack) (`03-software-research-dukrnews-foss-stack.md`)


---

<a id="doc-1-01-dukrnews-composite-feature-catalog"></a>
<!-- ====================================================================== -->
<!-- FILE: 01-dukrnews-composite-feature-catalog.md (Sequence: 01 of 03) -->
<!-- ====================================================================== -->

# DUKRNews — Composite Feature Catalog (Brainstorm & Compilation)

`Research date: 2026-10-12 · Current as of: 2026-10-13`
**Input:** [news-aggregators-competitive-analysis-2026-10-12.md](../2026-10-12-news-aggregators-competitive-analysis/news-aggregators-competitive-analysis-2026-10-12.md) (12 platforms, 42 sub-features, 4 watchlist platforms)
**Companion files:** [02 Architecture Blueprint](02-dukrnews-poc-architecture-blueprint.md) · [03 FOSS Stack Research](03-software-research-dukrnews-foss-stack.md) · [04 QA Report](04-quality-assurance-report.md)

---

## 1. What this document does

This catalog takes the best feature from each of the 12 competitor apps and folds them into one product called **DUKRNews**. Every row says which competitor the feature comes from, what DUKRNews changes or improves, and a build priority:

* **P0 — PoC core loop:** needed to prove the composite concept end to end (ingest → cluster → synthesize → verify → read → act).
* **P1 — Parity release:** needed for feature parity with all 12 competitors.
* **P2 — Beyond parity:** white-space features from Section 7 of the source report, or improvements no competitor ships.

Source-report caveat: the competitor analysis is the baseline for "what competitors do." Its competitor-side claims were not all re-checked here. This document's own research (see [03](03-software-research-dukrnews-foss-stack.md)) focused on the **FOSS building blocks**. Re-check competitor claims marked with dates in 2026 (e.g. Inoreader BYOAI, daily.dev Public API, Particle Radar) before using them in public positioning.

### 1.1 Product thesis in one paragraph

DUKRNews is an **open-source, self-hostable, protocol-native news platform**. It merges the *signal discipline* of Hacker News and Lobste.rs, the *programmability* of Inoreader, NewsBlur and daily.dev, the *media-literacy layer* of Ground News, the *AI synthesis* of Particle, the *clustering breadth* of Google News, the *reading polish* of Apple News, SmartNews and Flipboard, and the *federation* of Flipboard. Its single design rule: **every algorithmic or AI decision must be explainable, overridable, and exportable.** The developer-segment definition of "signal" (deterministic control) and the consumer definition (cognitive compression) become two modes of one product, not two products.

### 1.2 Feature-origin heat map (where the best ideas come from)

| Competitor | Signature features adopted by DUKRNews | Count |
| :--- | :--- | :---: |
| daily.dev | New-tab extension, Squads, PAT REST API, IDE hooks, README widget, TL;DR cards | 6 |
| Hacker News | Gravity ranking, Ask/Show/Tell posts, vouch/flag, zero-JS fast path, open read API | 5 |
| Lobste.rs | Invitation tree, public moderation log, strict tag taxonomy, anti-promo rules | 4 |
| Feedly | Concept dedup, CTI entity extraction (CVE/actors), SIEM/MISP export, team boards, multi-layout reader | 5 |
| Inoreader | Rules engine, outgoing webhooks, BYOAI keys, XPath/web-page monitoring, Vim keys, custom CSS | 6 |
| NewsBlur | Intelligence trainer, original-site view, River of News, Blurblog sharing, MCP server, CLI, self-host | 7 |
| Ground News | Bias distribution bar, Blindspot feed, factuality, ownership, My News Bias, browser overlay, side-by-side headlines | 7 |
| Google News | Full Coverage dossier, spam/quality demotion, Preferred Sources, local section, daily audio briefing | 5 |
| Apple News | Rich typographic layout format, human editorial picks, narrated audio, puzzles, recipes | 5 |
| Flipboard | Followable Magazines over ActivityPub, bidirectional replies, flip gesture, image-forward cards | 4 |
| SmartNews | SmartView offline pre-render, hyperlocal + weather, on-demand translation, partner feed format, rewards | 5 |
| Particle | Multi-source consensus summary, Opposite Sides, story Q&A, Reality Check, AI narration, podcast search | 6 |

---

## 2. Composite Feature Catalog

### 2.1 Ingestion & Source Coverage

| ID | Feature | Borrowed from | DUKRNews twist | Priority |
| :--- | :--- | :--- | :--- | :---: |
| ING-01 | RSS / Atom / RDF / JSON Feed ingestion | Feedly, Inoreader, NewsBlur | One tolerant parser for all formats plus podcast/media namespaces; conditional GET (ETag/Last-Modified) | P0 |
| ING-02 | Real-time push via WebSub (PubSubHubbub) | NewsBlur | Subscribe to hubs; fall back to adaptive polling based on each feed's posting rate | P1 |
| ING-03 | OPML import / export | Feedly, Inoreader, NewsBlur | Two-way, plus export of rules, filters and trainer weights as JSON ("take your brain with you") | P0 |
| ING-04 | Feed autodiscovery from any URL | Feedly, Inoreader | Paste a homepage → discover `<link rel=alternate>`; otherwise offer feed generation (ING-05) | P0 |
| ING-05 | RSS-less site monitoring (XPath / CSS / diff) | Inoreader, Feedly | Built-in RSSHub/RSS-Bridge routes plus changedetection-style visual diff watcher | P1 |
| ING-06 | Community link submissions (link / Ask / Show / Tell) | Hacker News, Lobste.rs, daily.dev | Submissions enter the same clustering pipeline, so a submitted link joins its story cluster | P0 |
| ING-07 | Newsletter inbox (email → feed) | Feedly, Inoreader, NewsBlur | Per-user `@in.dukr` address; tracker pixels stripped on ingest | P1 |
| ING-08 | Social & Fediverse sources (Mastodon, Bluesky, Reddit, YouTube, Telegram) | Feedly, Inoreader, Flipboard | Treat each as a "source adapter" with one normalized item schema | P1 |
| ING-09 | Large-scale web crawl of news sitemaps | Google News, Particle, SmartNews | Opt-in crawler for Google-News-style sitemaps; obeys robots.txt and a publisher opt-out registry | P1 |
| ING-10 | Publisher partner format | Apple News (ANF), SmartNews (SmartFormat) | **DUKR Partner Feed**: JSON Feed 1.1 + Schema.org `NewsArticle` + rich layout blocks; open spec, not proprietary | P2 |
| ING-11 | Podcast catalog ingestion | Particle (Radar), Flipboard | Podcast Index + RSS enclosures → transcription queue (AI-07) | P1 |
| ING-12 | Developer-specific sources (GitHub releases, engineering blogs, HN/Lobsters front pages) | daily.dev | Curated "dev pack" source bundles | P0 |
| ING-13 | Municipal agendas / civic sources | Source report white-space #1 | City-Scrapers-style adapters for council and school-board meetings | P2 |
| ING-14 | Vulnerability feeds (NVD, OSV, CISA KEV, vendor advisories) | Feedly Threat Intel | First-class "intel" source type with structured fields | P1 |

### 2.2 AI & Algorithmic Processing

| ID | Feature | Borrowed from | DUKRNews twist | Priority |
| :--- | :--- | :--- | :--- | :---: |
| AI-01 | Full-text extraction / reader view | All readers, SmartNews SmartView | Extract once at ingest; store clean HTML + Markdown; respect paywalls (no bypass) | P0 |
| AI-02 | Near-duplicate detection | Feedly AI, Google News | Two stages: MinHash/SimHash for syndicated copies, then embedding cosine for rewrites | P0 |
| AI-03 | Multi-source story clustering | Google News, Ground News, Particle | Online incremental clustering over a 72-hour window; a cluster becomes a "Story" once ≥2 independent outlets report it (Particle rule) | P0 |
| AI-04 | Per-article TL;DR summary | daily.dev, Feedly, Inoreader | Cached per article; model chosen by policy (local default, BYOAI optional) | P0 |
| AI-05 | Cross-document consensus synthesis | Particle | Bullets cite source IDs; "agreed by N outlets" counter; disputed facts shown separately | P0 |
| AI-06 | Reality Check (grounding verification) | Particle | Each generated bullet is scored by an NLI/grounding model against the cited source spans; failures are dropped or flagged | P0 |
| AI-07 | Story Q&A chat (RAG over the cluster) | Particle, Feedly Ask AI, NewsBlur Ask AI | Answers cite sources only from the cluster (closed-book); "I don't know" when unsupported | P1 |
| AI-08 | Entity & topic extraction | Feedly Leo | Zero-shot NER (people, orgs, places) plus regex extractors (CVE, CWE, tickers, versions) | P1 |
| AI-09 | Threat-intel models (CVE, malware family, actor) | Feedly Threat Intel | Enrich CVEs with OSV/KEV status; export STIX 2.1 bundles | P2 |
| AI-10 | Spam / scaled-AI-content demotion | Google News SpamBrain | Source reputation score + content-quality classifier + duplicate-farm detection | P1 |
| AI-11 | On-demand translation | SmartNews | Self-hosted MT for many language pairs; summaries can be produced in the reader's language | P1 |
| AI-12 | Political-lean classification (fallback) | Ground News, Particle | Used only when no outlet-level rating exists; always labelled "model estimate" | P1 |
| AI-13 | Interactive intelligence trainer | NewsBlur | Thumbs up/down on author, tag, title phrase, source → transparent per-user weights | P0 |
| AI-14 | Natural-language feed controls | Google Discover (2025–26) | "Show me less crypto, more Rust compilers" → compiled into explicit rules the user can inspect | P2 |

### 2.3 Media Literacy & Trust Layer

| ID | Feature | Borrowed from | DUKRNews twist | Priority |
| :--- | :--- | :--- | :--- | :---: |
| ML-01 | Bias distribution bar per story | Ground News | Left / Center / Right share of cluster coverage; shows data provenance per outlet rating | P1 |
| ML-02 | Blindspot feed | Ground News, Particle | Stories where one side's share ≥ 80% and the cluster has ≥ 6 outlets (configurable thresholds) | P1 |
| ML-03 | Opposite Sides headline comparison | Particle, Ground News | Side-by-side headlines + "framing diff" (loaded words, omitted entities) | P1 |
| ML-04 | Outlet factuality / reliability | Ground News | Built from openly licensed sources (Section 4 of [03](03-software-research-dukrnews-foss-stack.md)); pluggable licensed providers | P1 |
| ML-05 | Ownership & funding transparency | Ground News | Wikidata `owned by` / `parent organization` graph (CC0), shown as an ownership chain | P1 |
| ML-06 | My News Bias dashboard | Ground News Vantage | Computed **on-device by default**; shows lean, outlet concentration, topic diversity | P1 |
| ML-07 | Browser overlay of outlet ratings on social sites | Ground News extension | Extension content script marks links on X, Reddit, Mastodon, Bluesky, search results | P2 |
| ML-08 | Full Coverage dossier | Google News | Non-personalized story page: timeline, all outlets, fact-checks (ClaimReview), video, Q&A | P0 |
| ML-09 | Fact-check attachment | Google News Full Coverage | Pull matching ClaimReview items into the dossier | P2 |
| ML-10 | AI-transparency labels | Particle "Citation Compact" | Every AI sentence links to sources; model name and version are disclosed on hover | P0 |

### 2.4 Personalization, Ranking & Filtering

| ID | Feature | Borrowed from | DUKRNews twist | Priority |
| :--- | :--- | :--- | :--- | :---: |
| PER-01 | Objective "Front Page" (non-personalized) | Hacker News, Lobste.rs, Google Full Coverage | Gravity ranking `(P−1)/(T+2)^G` over votes **plus** outlet-count weighting for clustered stories | P0 |
| PER-02 | "For You" engagement feed | Google News, Apple News, SmartNews, Flipboard | Off by default; a "why am I seeing this" panel lists the contributing signals | P1 |
| PER-03 | Following / chronological river | NewsBlur River of News, Feedly | Pure reverse-chronological over subscriptions; no ranking | P0 |
| PER-04 | Explicit tag / tech-stack filters | daily.dev, Lobste.rs | Hierarchical tags (e.g. `lang/rust`, `infra/k8s`) | P0 |
| PER-05 | Regex & keyword muting | Inoreader, Feedly | Safe regex engine (linear-time) so user rules cannot freeze the server (no ReDoS) | P0 |
| PER-06 | Preferred / blocked sources | Google News | Boost or hide sources per user, globally or per topic | P0 |
| PER-07 | Local news & weather | SmartNews, Google News | Coarse location (city-level), never precise GPS; weather and alerts module | P1 |
| PER-08 | Saved searches as feeds | Feedly Pro, Inoreader | Any search query becomes a feed, a webhook trigger, or an MCP resource | P1 |

### 2.5 Developer Experience & Automation

| ID | Feature | Borrowed from | DUKRNews twist | Priority |
| :--- | :--- | :--- | :--- | :---: |
| DEV-01 | Public REST API with Personal Access Tokens | daily.dev, Inoreader, NewsBlur | OpenAPI 3.1 spec, scoped PATs, per-token rate limits; free self-host has no quota | P0 |
| DEV-02 | Client-sync compatibility (Google Reader API, Fever API) | FreshRSS / Miniflux convention | Existing apps (Reeder, NetNewsWire, ReadYou, FeedMe) work on day one | P1 |
| DEV-03 | Rules engine (if-this-then-that on items) | Inoreader, Feedly | Rules written in CEL; actions: tag, star, mute, notify, webhook, summarize, route-to-squad | P0 |
| DEV-04 | Outgoing signed webhooks | Inoreader | Standard Webhooks signatures, retries with backoff, replay UI, per-endpoint logs | P0 |
| DEV-05 | Bring-Your-Own-AI keys | Inoreader | Per-user/per-org keys stored encrypted; local Ollama default; spend caps | P0 |
| DEV-06 | MCP server | NewsBlur | Tools: `search_stories`, `get_story_dossier`, `list_feed`, `train`, `create_rule`, `ask_story` | P0 |
| DEV-07 | IDE & agent integrations | daily.dev (Cursor/Claude Code) | Ships as an MCP server + VS Code extension side panel | P1 |
| DEV-08 | CLI / TUI client | NewsBlur CLI, HN TUIs | `dukr` CLI with JSON output for scripting | P1 |
| DEV-09 | Low-code automation connectors | Feedly/Inoreader via Zapier, n8n, IFTTT | Activepieces "piece" + Node-RED node + generic webhooks | P1 |
| DEV-10 | SIEM / CTI export | Feedly Enterprise | STIX 2.1 / MISP event export; Splunk HEC and Sentinel via webhook templates | P2 |
| DEV-11 | README / profile widget | daily.dev | SVG badge of "my reading streak / top tags" | P2 |
| DEV-12 | Real-time stream API | HN Firebase API | Server-Sent Events + WebSocket stream of new stories per topic | P1 |
| DEV-13 | Historical full-text search API | HN Algolia API | Hybrid BM25 + vector search over the full archive | P1 |
| DEV-14 | CVE-to-PR pipeline | Source report white-space #3 | Rule action "open GitHub/GitLab issue when a CVE matches my SBOM" | P2 |

### 2.6 Community, Social & Governance

| ID | Feature | Borrowed from | DUKRNews twist | Priority |
| :--- | :--- | :--- | :--- | :---: |
| COM-01 | Threaded discussions on stories | HN, Lobste.rs, daily.dev | One thread per *Story cluster* (not per URL), so discussion isn't split across duplicates | P1 |
| COM-02 | Voting, karma, flag, vouch | HN, Lobste.rs | Downvote unlocked by karma; flags are visible in the moderation log | P1 |
| COM-03 | Squads (topic micro-communities) | daily.dev | Each Squad is also an ActivityPub Group (FED-02) | P1 |
| COM-04 | Magazines (curated collections) | Flipboard | Each Magazine is also an ActivityPub actor and an RSS feed | P1 |
| COM-05 | Personal share-blog with commentary | NewsBlur Blurblog | "Shared" stream exported as RSS + AP outbox | P1 |
| COM-06 | Invitation tree (optional instance mode) | Lobste.rs | Admin toggle: open signup, invite-only, or approval queue | P1 |
| COM-07 | Public moderation log | Lobste.rs | Append-only, hash-chained log; exportable | P1 |
| COM-08 | Team boards, highlights & annotations | Feedly Teams | W3C Web Annotation model; shared highlights per org | P2 |
| COM-09 | Curated newsletters from boards | Feedly Teams | Scheduled digest email built from a board or Magazine | P2 |
| COM-10 | Human editorial picks | Apple News | "Editors' Desk" role per instance or per Squad; picks are labelled | P1 |
| COM-11 | Anti-promotion & self-promo rules | Lobste.rs | Per-domain submission ratio limits and disclosure flags | P1 |

### 2.7 Federation & Open Protocols

| ID | Feature | Borrowed from | DUKRNews twist | Priority |
| :--- | :--- | :--- | :--- | :---: |
| FED-01 | Followable Magazines via ActivityPub | Flipboard | `@magazine@dukr.example` followable from Mastodon, Threads, Pixelfed | P1 |
| FED-02 | Squads as federated Groups (FEP-1b12) | Lemmy/Mbin convention | Lemmy/PieFed/Mbin users can post and comment into Squads | P2 |
| FED-03 | Bidirectional replies & likes | Flipboard | Remote replies show up in COM-01 threads | P1 |
| FED-04 | Bluesky / AT Protocol bridge | (none of the 12) | Publish Magazines as Bluesky feeds; ingest Bluesky lists as sources | P2 |
| FED-05 | Everything-is-a-feed outputs | NewsBlur, Lobste.rs JSON | Every list (search, tag, Squad, Magazine, user share) has RSS, Atom and JSON Feed endpoints | P0 |

### 2.8 Reading Experience, Media & Platforms

| ID | Feature | Borrowed from | DUKRNews twist | Priority |
| :--- | :--- | :--- | :--- | :---: |
| RX-01 | Layout modes: Title-only, Compact, Cards, Magazine, Full | Feedly, Inoreader | Per-feed layout memory | P0 |
| RX-02 | Original-site view in the reading pane | NewsBlur | Sandboxed iframe with a fallback to reader view when framing is blocked | P1 |
| RX-03 | Zero-JS minimalist mode | HN, Lobste.rs | Server-rendered HTML that works on any connection and in text browsers | P0 |
| RX-04 | Flip / swipe magazine navigation | Flipboard | Swipe deck on mobile, keyboard paging on desktop | P1 |
| RX-05 | Vim-style keyboard shortcuts | Inoreader | `j/k/o/s/m/v/?` with a remappable keymap | P0 |
| RX-06 | Custom CSS & themes | Inoreader | User stylesheet, dark/light/sepia, dyslexia-friendly font option | P1 |
| RX-07 | Offline pre-rendered reading | SmartNews SmartView, Inoreader | PWA caches the next N stories (text + compressed images) on Wi-Fi | P1 |
| RX-08 | Narrated audio for stories & briefings | Apple News, Particle, Google News | Local neural TTS by default; BYOAI premium voices optional | P1 |
| RX-09 | Daily audio briefing ("DUKR Daily") | Google News (Android), Particle | Generated playlist of top consensus stories, with chapter markers | P1 |
| RX-10 | Podcast transcript search ("Radar") | Particle | Transcribe subscribed podcasts; search by phrase, jump to timestamp | P2 |
| RX-11 | Daily puzzles & games | Apple News+, Particle+ | Crossword (ipuz), sudoku, news-quiz generated from yesterday's stories | P2 |
| RX-12 | Recipes section | Apple News (iOS 18) | Schema.org `Recipe` extraction from food feeds | P2 |
| RX-13 | Browser extension + New Tab page | daily.dev, Ground News | New-tab feed, one-click subscribe, outlet overlay (ML-07) | P1 |
| RX-14 | Installable PWA + iOS/Android apps | All | One SvelteKit codebase → PWA → Capacitor native shells | P1 |
| RX-15 | Desktop apps (macOS/Windows/Linux) | Feedly | Tauri wrapper of the same web app | P2 |
| RX-16 | Accessibility (screen readers, reduced motion, captions) | Apple News polish | WCAG 2.2 AA as a release gate | P0 |

### 2.9 Notifications & Briefings

| ID | Feature | Borrowed from | DUKRNews twist | Priority |
| :--- | :--- | :--- | :--- | :---: |
| NTF-01 | Web push & mobile push | All consumer apps | Only for rule matches or breaking clusters ≥ X outlets; never "engagement bait" | P1 |
| NTF-02 | Chat broadcast (Slack, Teams, Discord, Matrix, ntfy) | Feedly Teams, Inoreader | Apprise-style URL targets as rule actions | P1 |
| NTF-03 | Email digests | Feedly newsletters | MJML-templated daily/weekly digest | P1 |
| NTF-04 | Calm cadence mode | Kagi News (watchlist) | Optional "3 updates per day" mode that batches everything | P2 |

### 2.10 Business Model & Ecosystem

| ID | Feature | Borrowed from | DUKRNews twist | Priority |
| :--- | :--- | :--- | :--- | :---: |
| BIZ-01 | Free self-host with no artificial limits | NewsBlur, Lobste.rs | AGPL-3.0 core; every feature available when self-hosted | P0 |
| BIZ-02 | Hosted tiers (Free / Plus / Pro / Team) | Feedly, Inoreader, NewsBlur, Ground News, Particle | Paid tiers sell *compute & convenience* (hosted AI, audio minutes, retention), not features | P1 |
| BIZ-03 | Ethical sponsored cards | daily.dev | Contextual, no tracking, clearly labelled, off for paid users | P2 |
| BIZ-04 | Publisher revenue-share pool | Apple News+, SmartNews | % of hosted revenue split by verified outbound clicks + read-time on partner content | P2 |
| BIZ-05 | Reading rewards / streaks | SmartNews Rewards | Non-monetary streaks and badges by default | P2 |
| BIZ-06 | Enterprise intelligence tier | Feedly Threat Intel | SSO, CTI models, SIEM export, audit logs | P2 |

---

## 3. Parity crosswalk against the source report's 42 sub-features

Legend: **✅** covered by catalog row(s) · **➕** covered and extended beyond the best competitor · **⛔** intentionally excluded or substituted (see Section 4).

| # | Source-report sub-feature | Best competitor(s) | DUKRNews row(s) | Status |
| :---: | :--- | :--- | :--- | :---: |
| 1 | Standard RSS / Atom feed support | Feedly, Inoreader, NewsBlur | ING-01, ING-02, ING-03, FED-05 | ➕ |
| 2 | Community user link submissions | HN, Lobste.rs, daily.dev | ING-06 | ➕ |
| 3 | Automated web crawling & indexing | Google News | ING-05, ING-09 | ✅ |
| 4 | Proprietary publisher ingest (ANF / SmartFormat) | Apple News, SmartNews | ING-10 (open spec) | ⛔ |
| 5 | Social media / Fediverse ingestion | Flipboard | ING-08, FED-03, FED-04 | ➕ |
| 6 | Inbound email newsletter ingestion | Feedly, Inoreader | ING-07 | ✅ |
| 7 | Multi-source story clustering & dedup | Google News, Particle | AI-02, AI-03 | ✅ |
| 8 | Cross-document AI consensus synthesis | Particle | AI-05, AI-06 | ✅ |
| 9 | In-situ AI article summarization | daily.dev, Feedly, Particle | AI-04 | ✅ |
| 10 | Political bias rating integration | Ground News, Particle | ML-01, AI-12 | ✅ |
| 11 | Outlet factuality & accuracy scoring | Ground News | ML-04, ML-09 | ✅ |
| 12 | Corporate / state ownership transparency | Ground News | ML-05 | ✅ |
| 13 | In-article conversational AI Q&A | Particle | AI-07 | ✅ |
| 14 | High-fidelity audio / spoken narration | Apple News, Particle | RX-08, RX-09 | ✅ |
| 15 | Public developer REST API | daily.dev, Inoreader, NewsBlur | DEV-01, DEV-02, DEV-12, DEV-13 | ➕ |
| 16 | Outgoing HTTP webhooks | Inoreader | DEV-04 | ✅ |
| 17 | Deterministic rules & filter automation | Inoreader, Feedly | DEV-03, PER-05 | ✅ |
| 18 | Bring-Your-Own-AI keys | Inoreader | DEV-05 | ➕ |
| 19 | Direct IDE integrations | daily.dev | DEV-06, DEV-07 | ✅ |
| 20 | Model Context Protocol server | NewsBlur | DEV-06 | ✅ |
| 21 | Open-source codebase | Lobste.rs, NewsBlur | BIZ-01 | ✅ |
| 22 | Self-hostable deployment | Lobste.rs, NewsBlur | BIZ-01 | ✅ |
| 23 | Tech-stack / explicit tag filtering | daily.dev, Lobste.rs | PER-04 | ✅ |
| 24 | Algorithmic engagement feed ("For You") | Google, Apple, SmartNews | PER-02 | ✅ |
| 25 | Objective non-personalized consensus feed | HN, Ground News, Google | PER-01, ML-08 | ➕ |
| 26 | Blindspot ideological divergence feeds | Ground News, Particle | ML-02 | ✅ |
| 27 | Custom regex / advanced keyword muting | Inoreader, Feedly | PER-05 | ✅ |
| 28 | Reader personal bias history auditing | Ground News | ML-06 | ➕ |
| 29 | Threaded user discussion forums | HN, Lobste.rs | COM-01 | ➕ |
| 30 | Karma / upvoting & downvoting | HN, Lobste.rs | COM-02 | ✅ |
| 31 | Micro-communities / Squads / Magazines | daily.dev, Flipboard | COM-03, COM-04 | ✅ |
| 32 | ActivityPub / Fediverse federation | Flipboard | FED-01, FED-02, FED-03 | ➕ |
| 33 | Public transparent moderation log | Lobste.rs | COM-07 | ➕ |
| 34 | Public auditable invitation lineage | Lobste.rs | COM-06 | ✅ |
| 35 | Distraction-free clean reader mode | Feedly, Inoreader, Apple | AI-01, RX-01, RX-03 | ✅ |
| 36 | Cross-platform mobile apps | Most | RX-14 | ✅ |
| 37 | Browser extension / New Tab | daily.dev | RX-13, ML-07 | ➕ |
| 38 | Zero-latency offline article caching | SmartNews, Inoreader | RX-07 | ✅ |
| 39 | Integrated games & daily puzzles | Apple News+ | RX-11 | ✅ |
| 40 | Free core tier available | All | BIZ-01, BIZ-02 | ✅ |
| 41 | Consumer paid subscription tier | Inoreader, NewsBlur, Ground, Particle | BIZ-02 | ✅ |
| 42 | Enterprise / CTI tier | Feedly | BIZ-06, AI-09, DEV-10 | ✅ |

**Tally:** 42 of 42 sub-features mapped. 30 ✅ parity, 11 ➕ beyond parity, 1 ⛔ substituted with an open equivalent. Programmatic ads (#43 in the source matrix's business section) and direct publisher revenue-share (#44) are covered by BIZ-03 and BIZ-04.

---

## 4. Deliberate exclusions, substitutions & guardrails

| Competitor feature | Decision | Reason |
| :--- | :--- | :--- |
| Apple News Format / SmartFormat proprietary ingest | **Substitute** with open DUKR Partner Feed (ING-10) | Proprietary formats can't be reimplemented as FOSS; an open JSON Feed extension serves the same purpose |
| Apple News+ paywalled magazine bundle | **Substitute** with BIZ-04 revenue-share and linking out to publisher subscriptions | A bundle needs publisher licensing deals; the software can support it, but no library supplies it |
| Proprietary bias ratings (AllSides, Ad Fontes, MBFC) | **Pluggable licensed provider**; ship with open data only | AllSides and MBFC treat their ratings as proprietary and license them commercially; unofficial GitHub scrapes are risky |
| Paywall bypass routing (seen in OpenWire, a prior teardown in this workspace) | **Excluded** | Legal and publisher-relations risk; conflicts with the "Citation Compact" positioning |
| daily.dev Recruiter | **Excluded** | Not a news-aggregation feature |
| Engagement-maximizing ranking by default | **Off by default** (PER-02 opt-in) | Matches the developer-segment definition of signal; consumer users can opt in |
| Precise GPS for local news | **Replaced** with coarse city-level location | Privacy; city-level location is enough for local news and weather |
| AI summaries that substitute for the article | **Constrained**: bullets ≤ 60 words each, mandatory source links, "Read at source" call to action | 2025–26 publisher litigation focuses on market substitution and stripped attribution (see [03 §7](03-software-research-dukrnews-foss-stack.md)) |

---

## 5. PoC scope (what the first build demonstrates)

The proof of concept exercises a thin vertical slice through every layer, so each architectural risk gets tested early:

1. **Ingest** 300 feeds (a mix of dev, general, and local news) plus HN/Lobsters front pages (ING-01, ING-06, ING-12).
2. **Extract + dedup + cluster** into Stories over a 72-hour window (AI-01 to AI-03).
3. **Synthesize** consensus bullets with **Reality Check** grounding, using a local model by default with BYOAI override (AI-05, AI-06, DEV-05).
4. **Media-literacy panel** on each Story: bias bar from open outlet data, ownership chain from Wikidata (ML-01, ML-05, ML-08).
5. **Three feeds:** Front Page (gravity), River (chronological), Blindspot (PER-01, PER-03, ML-02).
6. **Developer surface:** REST + PATs, one CEL rule, one signed webhook, and an MCP server with 4 tools (DEV-01, DEV-03, DEV-04, DEV-06).
7. **Reader:** zero-JS view + SvelteKit PWA with Vim keys and offline cache of 20 stories (RX-03, RX-05, RX-07).
8. **Audio:** one narrated "DUKR Daily" briefing generated by local TTS (RX-09).

PoC exit criteria are defined in [02 §10](02-dukrnews-poc-architecture-blueprint.md).


---

<a id="doc-2-02-dukrnews-poc-architecture-blueprint"></a>
<!-- ====================================================================== -->
<!-- FILE: 02-dukrnews-poc-architecture-blueprint.md (Sequence: 02 of 03) -->
<!-- ====================================================================== -->

# DUKRNews — Proof-of-Concept Architecture Blueprint (Micro-Library Compositing)

`Research date: 2026-10-12 · Current as of: 2026-10-13`
**Companion files:** [01 Feature Catalog](01-dukrnews-composite-feature-catalog.md) · [03 FOSS Stack Research](03-software-research-dukrnews-foss-stack.md) · [04 QA Report](04-quality-assurance-report.md)

---

## TL;DR

* **Approach:** Don't fork one big aggregator. Build a thin **TypeScript core** (SvelteKit + Fastify + PostgreSQL) and compose **~45 small, actively maintained FOSS libraries** around it, plus a **Python ML sidecar** for the models that only exist in Python (embeddings, NLI grounding, NER, ASR, TTS, translation).
* **Postgres is the center of gravity.** `pgvector` handles embeddings and clustering lookups, `ltree` handles comment trees and invitation lineage, and job queues run on Valkey (BullMQ), with `pg-boss` as a fallback for small installs. One database to back up.
* **AI is a policy layer, not a dependency.** A local model (Ollama) is the default. BYOAI keys route through a LiteLLM proxy. Every generated sentence must pass a **Reality Check** grounding model before display.
* **Protocols over platforms.** RSS/Atom/JSON Feed out of every list, ActivityPub via **Fedify**, WebSub in, Google Reader/Fever APIs for existing clients, **MCP** for agents and IDEs.
* **License strategy:** AGPL-3.0 core (same as daily.dev's apps, FreshRSS, Folo, Lemmy). Avoid source-available dependencies (SSPL, Elastic-2.0, Sustainable Use). Run GPL-3.0 components (e.g. Piper TTS) as **separate processes**, not linked libraries.

> [!NOTE]
> Code in this document is an **illustrative skeleton** written to show how the libraries compose. Library APIs change between versions; check each snippet against the versions pinned in [03 §3](03-software-research-dukrnews-foss-stack.md) before you build on it.

---

## 1. Design principles

| # | Principle | What it means in practice | Competitor lesson |
| :---: | :--- | :--- | :--- |
| 1 | Explainable by default | Every ranking, filter and AI output has a "why" panel and a provenance link | Google News opacity is its top criticism in the source report |
| 2 | Overridable | Users can turn off any algorithm; the chronological River is always available | HN/Lobsters users treat personalization as a defect |
| 3 | Exportable | OPML + JSON export of feeds, rules, trainer weights, annotations, shares | Feedly/Inoreader lock-in vs. NewsBlur portability |
| 4 | Local-first AI | Local models default; cloud AI is opt-in BYOAI | Inoreader BYOAI; privacy-sensitive users |
| 5 | Protocol-native | Every list is a feed and every collection is an ActivityPub actor | Flipboard federation; Lobsters JSON feeds |
| 6 | Small, swappable parts | Each capability sits behind an interface with ≥2 candidate libraries | MinIO archival (2026) and Piper relicensing (2025) show why |
| 7 | Cheap to self-host | Minimal profile targets **≤ 2 GB RAM** without GPU | NewsBlur needs 2–4 GB (Celery + Mongo + Postgres + Redis) |
| 8 | Publisher-respectful | No paywall bypass; outbound links prominent; AI bullets are hooks, not substitutes | Particle's "Citation Compact" |

---

## 2. System context

```mermaid
flowchart LR
  subgraph Sources
    RSS["RSS / Atom / JSON Feed"]
    WS["WebSub hubs"]
    MAIL["Newsletter email"]
    SOC["Mastodon / Bluesky / YouTube / Reddit"]
    WEB["Sites without feeds"]
    POD["Podcasts"]
    INTEL["NVD / OSV / CISA KEV"]
    USERS["User submissions"]
  end

  subgraph DUKR["DUKRNews core"]
    API["Fastify API + OpenAPI"]
    WEBAPP["SvelteKit web / PWA"]
    WORK["Pipeline workers (BullMQ)"]
    ML["dukr-ml sidecar (Python)"]
    FED["Fedify federation service"]
    MCP["MCP server"]
    PG[("PostgreSQL + pgvector")]
    VK[("Valkey")]
    S3[("S3 storage: SeaweedFS or Garage")]
    SRCH[("Meilisearch (optional)")]
    LLM["LiteLLM proxy"]
    OLL["Ollama (local LLM)"]
    HOOK["Svix webhook server"]
  end

  subgraph Consumers
    BROWSER["Browsers + extension"]
    MOBILE["Capacitor iOS / Android"]
    CLIENTS["Reeder / NetNewsWire via GReader API"]
    FEDI["Mastodon / Threads / Lemmy"]
    AGENTS["Claude Code / Cursor / agents"]
    AUTOM["Webhooks / Slack / SIEM"]
  end

  Sources --> WORK
  WORK <--> PG
  WORK <--> VK
  WORK <--> ML
  WORK --> LLM
  LLM --> OLL
  WORK --> S3
  WORK --> SRCH
  WORK --> HOOK
  API <--> PG
  API <--> SRCH
  WEBAPP --> API
  FED <--> PG
  MCP --> API
  BROWSER --> WEBAPP
  MOBILE --> API
  CLIENTS --> API
  FEDI <--> FED
  AGENTS --> MCP
  HOOK --> AUTOM
```

---

## 3. Service decomposition

| Service | Responsibility | Runtime | Key composed libraries | Scales by |
| :--- | :--- | :--- | :--- | :--- |
| `dukr-web` | SSR pages, zero-JS mode, PWA shell, Full Coverage pages | Node (SvelteKit 3) | SvelteKit, vite-plugin-pwa, Workbox, Dexie.js, tinykeys, Swiper, DOMPurify | Stateless replicas |
| `dukr-api` | REST, GReader/Fever compat, SSE stream, auth, PATs | Node (Fastify 5) | Fastify, @fastify/swagger, @fastify/rate-limit, Better Auth, Drizzle ORM | Stateless replicas |
| `dukr-ingest` | Fetch feeds, WebSub callbacks, newsletter SMTP, social adapters | Node workers | feedsmith, undici, smtp-server, mailparser, masto.js, @atproto/api | Queue concurrency |
| `dukr-extract` | Full text, sanitization, Markdown, images, recipes | Node workers | defuddle, @mozilla/readability, DOMPurify + jsdom, turndown | Queue concurrency |
| `dukr-cluster` | Dedup, embed, assign to Story, periodic re-cluster | Node + `dukr-ml` | pgvector, datasketch (MinHash), sentence-transformers or fastembed, HDBSCAN | Single leader + workers |
| `dukr-ml` | Embeddings, NLI grounding, NER, lean classifier, ASR, TTS, MT | Python (FastAPI) | sentence-transformers, LettuceDetect / HHEM, GLiNER, faster-whisper, Kokoro, Argos Translate | CPU or GPU pool |
| `dukr-synth` | TL;DR, consensus bullets, Q&A, briefings | Node workers | Vercel AI SDK → LiteLLM proxy → Ollama / BYOAI providers | Token budget |
| `dukr-rules` | Evaluate CEL rules, dispatch actions | Node workers | @marcbachmann/cel-js, re2 (node-re2), Apprise API, Svix | Queue concurrency |
| `dukr-fed` | ActivityPub actors, inbox/outbox, WebFinger | Node (Fedify) | Fedify, Fedify Postgres KV/MQ adapters | Queue concurrency |
| `dukr-mcp` | MCP tools/resources for agents and IDEs | Node | @modelcontextprotocol/sdk | Stateless |
| `dukr-media` | Audio briefings, podcast transcripts, image thumbnails | Python + Node | Kokoro-FastAPI, faster-whisper, sharp | GPU optional |

---

## 4. The news pipeline

### 4.1 Flow

```mermaid
flowchart TD
  A["fetch: feed / WebSub / email / social / submission"] --> B["normalize to DukrItem"]
  B --> C{"seen URL or GUID?"}
  C -- yes --> Z["update metadata only"]
  C -- no --> D["extract full text: defuddle, fallback readability"]
  D --> E["MinHash near-dup check"]
  E -- syndicated copy --> F["attach to existing item as mirror"]
  E -- new --> G["embed title + lede: dukr-ml"]
  G --> H["pgvector ANN against active Story centroids, 72h window"]
  H -- "cosine >= tau" --> I["join Story, update centroid"]
  H -- "cosine < tau" --> J["create candidate Story"]
  I --> K{"outlets >= 2?"}
  J --> K
  K -- no --> L["hold as candidate"]
  K -- yes --> M["enrich: entities, CVEs, lean, ownership, reputation"]
  M --> N["synthesize consensus bullets"]
  N --> O["Reality Check grounding per bullet"]
  O --> P["rank: gravity, blindspot, trainer, For You"]
  P --> Q["fan-out: rules, webhooks, push, AP outbox, SSE, search index"]
```

### 4.2 Stage contract

| Stage | Queue | Primary library | Fallback library | Target latency (p95) |
| :--- | :--- | :--- | :--- | :--- |
| Fetch | `ingest:fetch` | undici + feedsmith | rss-parser, @extractus/feed-extractor | 2 s per feed |
| Extract | `ingest:extract` | defuddle | @mozilla/readability; trafilatura via dukr-ml | 1.5 s |
| Near-dup | inline | MinHash (datasketch in dukr-ml) | SimHash in TS | 20 ms |
| Embed | `ml:embed` | sentence-transformers (multilingual small model) | fastembed (ONNX, CPU) | 60 ms CPU |
| Assign | inline SQL | pgvector HNSW | sqlite-vec (single-user mode) | 30 ms |
| Re-cluster | `cluster:batch` (every 15 min) | HDBSCAN | BERTopic for topic labels | 2 min batch |
| Enrich | `ml:enrich` | GLiNER + regex extractors | spaCy | 200 ms |
| Synthesize | `ai:synth` | Vercel AI SDK → LiteLLM | direct provider SDK | 8 s |
| Reality Check | `ml:verify` | LettuceDetect | HHEM-2.1-open; MiniCheck (stale) | 400 ms per bullet |
| Fan-out | `rules:eval`, `hooks:send` | cel-js + Svix | Apprise for chat targets | 1 s |

### 4.3 Normalized item schema (TypeScript)

```ts
// packages/core/src/item.ts
export interface DukrItem {
  id: string;                 // ULID
  sourceId: string;           // feed, adapter, or "submission"
  outletId: string | null;    // resolved publisher (domain → outlet registry)
  canonicalUrl: string;
  guid?: string;
  title: string;
  author?: string;
  publishedAt: Date;
  lang?: string;
  summaryHtml?: string;       // from feed
  contentHtml?: string;       // sanitized full text
  contentMd?: string;         // for LLM + MCP
  enclosures?: { url: string; type: string; length?: number }[];
  tags: string[];             // feed categories + inferred tags
  kind: "article" | "link" | "ask" | "show" | "tell" | "podcast" | "video" | "intel" | "newsletter";
}
```

### 4.4 Ingest + extract worker (skeleton)

```ts
// services/ingest/src/fetchFeed.ts
import { Worker, Queue } from "bullmq";
import { parseFeed } from "feedsmith";
import { request } from "undici";
import { db, feeds, items } from "@dukr/db";
import { eq } from "drizzle-orm";

const extractQ = new Queue("ingest:extract", { connection: { host: "valkey" } });

new Worker("ingest:fetch", async (job) => {
  const feed = await db.query.feeds.findFirst({ where: eq(feeds.id, job.data.feedId) });
  if (!feed) return;

  const res = await request(feed.url, {
    headers: {
      "user-agent": "DUKRNews/0.1 (+https://dukr.example/bot)",
      ...(feed.etag ? { "if-none-match": feed.etag } : {}),
      ...(feed.lastModified ? { "if-modified-since": feed.lastModified } : {}),
    },
  });
  if (res.statusCode === 304) return { notModified: true };

  const { format, feed: parsed } = parseFeed(await res.body.text());
  for (const entry of parsed.items ?? parsed.entries ?? []) {
    const inserted = await db.insert(items).values(toDukrItem(feed, format, entry))
      .onConflictDoNothing({ target: [items.sourceId, items.guidHash] })
      .returning({ id: items.id });
    if (inserted[0]) await extractQ.add("extract", { itemId: inserted[0].id });
  }
  await db.update(feeds).set({
    etag: res.headers.etag as string | undefined,
    lastModified: res.headers["last-modified"] as string | undefined,
    nextFetchAt: adaptiveNextFetch(feed),        // posting-rate-aware polling
  }).where(eq(feeds.id, feed.id));
}, { connection: { host: "valkey" }, concurrency: 32 });
```

```ts
// services/extract/src/extract.ts
import { JSDOM } from "jsdom";
import { Defuddle } from "defuddle/node";
import { Readability } from "@mozilla/readability";
import createDOMPurify from "dompurify";
import TurndownService from "turndown";

export async function extractArticle(html: string, url: string) {
  const dom = new JSDOM(html, { url });
  let result = await Defuddle(dom, url, { markdown: false }).catch(() => null);
  if (!result?.content || result.wordCount < 80) {
    const r = new Readability(dom.window.document).parse();   // battle-tested fallback
    result = r ? { content: r.content, title: r.title, wordCount: r.length / 5 } as any : null;
  }
  if (!result) return null;
  const purify = createDOMPurify(new JSDOM("").window as any);
  const clean = purify.sanitize(result.content, { USE_PROFILES: { html: true } });
  return { contentHtml: clean, contentMd: new TurndownService().turndown(clean) };
}
```

---

## 5. Data model (PostgreSQL 17 + pgvector + ltree)

```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS ltree;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Publishers and the media-literacy layer
CREATE TABLE outlets (
  id            text PRIMARY KEY,               -- e.g. "apnews.com"
  name          text NOT NULL,
  wikidata_qid  text,                           -- ownership graph anchor
  country       text,
  reputation    real DEFAULT 0.5,               -- spam/quality prior (AI-10)
  created_at    timestamptz DEFAULT now()
);
CREATE TABLE outlet_ratings (
  outlet_id   text REFERENCES outlets(id),
  provider    text NOT NULL,                    -- 'wikidata_p1387', 'community', 'model', 'licensed:<name>'
  lean        smallint,                         -- -2..+2 (L, LC, C, RC, R)
  reliability real,                             -- 0..1
  license     text NOT NULL,                    -- provenance shown in UI
  observed_at date NOT NULL,
  PRIMARY KEY (outlet_id, provider)
);
CREATE TABLE ownership_edges (
  child_qid  text, parent_qid text, relation text,  -- P127 owned by, P749 parent org
  source     text DEFAULT 'wikidata', fetched_at timestamptz,
  PRIMARY KEY (child_qid, parent_qid, relation)
);

-- Sources and items
CREATE TABLE feeds (
  id text PRIMARY KEY, url text UNIQUE NOT NULL, kind text NOT NULL,
  outlet_id text REFERENCES outlets(id), etag text, last_modified text,
  websub_hub text, next_fetch_at timestamptz, error_count int DEFAULT 0
);
CREATE TABLE items (
  id text PRIMARY KEY, source_id text NOT NULL, outlet_id text REFERENCES outlets(id),
  guid_hash bytea NOT NULL, canonical_url text NOT NULL, title text NOT NULL,
  author text, published_at timestamptz NOT NULL, lang text, kind text NOT NULL,
  content_html text, content_md text, minhash bytea, mirror_of text REFERENCES items(id),
  UNIQUE (source_id, guid_hash)
);
CREATE TABLE item_embeddings (
  item_id text PRIMARY KEY REFERENCES items(id) ON DELETE CASCADE,
  model text NOT NULL, embedding vector(384) NOT NULL
);
CREATE INDEX ON item_embeddings USING hnsw (embedding vector_cosine_ops);

-- Stories (clusters)
CREATE TABLE stories (
  id text PRIMARY KEY, centroid vector(384) NOT NULL, first_seen timestamptz NOT NULL,
  last_seen timestamptz NOT NULL, outlet_count int DEFAULT 1, status text DEFAULT 'candidate',
  lean_left real, lean_center real, lean_right real, blindspot text, score real DEFAULT 0
);
CREATE INDEX ON stories USING hnsw (centroid vector_cosine_ops);
CREATE TABLE story_items (story_id text REFERENCES stories(id), item_id text REFERENCES items(id),
  similarity real, PRIMARY KEY (story_id, item_id));
CREATE TABLE story_bullets (
  id bigserial PRIMARY KEY, story_id text REFERENCES stories(id), ord int, text text NOT NULL,
  cited_item_ids text[] NOT NULL, grounding_score real NOT NULL, verdict text NOT NULL,  -- pass, flag, drop
  model text NOT NULL, created_at timestamptz DEFAULT now()
);

-- Users, personalization, automation
CREATE TABLE subscriptions (user_id text, feed_id text, folder text, PRIMARY KEY (user_id, feed_id));
CREATE TABLE trainer_weights (user_id text, facet text, value text, weight smallint,  -- facet: author, tag, title_phrase, outlet
  PRIMARY KEY (user_id, facet, value));
CREATE TABLE rules (id text PRIMARY KEY, owner_id text, name text, cel text NOT NULL,
  actions jsonb NOT NULL, enabled bool DEFAULT true);
CREATE TABLE ai_keys (owner_id text, provider text, ciphertext bytea NOT NULL, nonce bytea NOT NULL,
  monthly_cap_usd numeric, PRIMARY KEY (owner_id, provider));
CREATE TABLE reading_events (user_id text, item_id text, story_id text, dwell_ms int, at timestamptz DEFAULT now());

-- Community and governance
CREATE TABLE comments (id text PRIMARY KEY, story_id text REFERENCES stories(id), author_id text,
  path ltree NOT NULL, body_md text, score int DEFAULT 1, ap_id text, created_at timestamptz DEFAULT now());
CREATE INDEX ON comments USING gist (path);
CREATE TABLE invitations (user_id text PRIMARY KEY, inviter_id text, lineage ltree NOT NULL);
CREATE TABLE moderation_log (
  seq bigserial PRIMARY KEY, moderator_id text, action text, target text, reason text,
  at timestamptz DEFAULT now(), prev_hash bytea, hash bytea NOT NULL      -- hash chain for tamper evidence
);
CREATE TABLE collections (id text PRIMARY KEY, kind text CHECK (kind IN ('squad','magazine','shared')),
  slug text UNIQUE, owner_id text, ap_actor_uri text, title text, description text);
```

---

## 6. Core algorithms

### 6.1 Online Story assignment (pgvector)

```sql
-- $1 = new item embedding, $2 = similarity threshold tau (start at 0.80, tune on a labelled sample)
SELECT id, 1 - (centroid <=> $1) AS sim
FROM stories
WHERE last_seen > now() - interval '72 hours'
ORDER BY centroid <=> $1
LIMIT 5;
-- If best sim >= tau AND the outlet differs from existing members, join; else create a candidate.
-- Centroid update: centroid = normalize(centroid * n/(n+1) + e/(n+1)).
-- A 15-minute HDBSCAN batch re-clusters the window, merging and splitting drifted Stories.
```

### 6.2 Ranking formulas

| Feed | Formula | Notes |
| :--- | :--- | :--- |
| Front Page (community items) | `score = (votes - 1) / (age_hours + 2)^1.8` | Hacker News gravity, as given in the source report |
| Front Page (clustered Stories) | `score = log2(1 + outlets) * reputation_avg / (age_hours + 2)^1.5` | More independent outlets means more consensus; decays more slowly than votes |
| River | `ORDER BY published_at DESC` | No ranking, by design |
| Blindspot | `max(left_share, right_share) >= 0.80 AND outlets >= 6` | Thresholds are configurable and published on the methodology page |
| Trainer boost | `final = base * (1 + 0.25 * sum(weights matched))`, items with any −1 hidden | NewsBlur-style green/red; weights shown on hover |
| For You (opt-in) | Gorse recommendations re-ranked by trainer weights | Off by default; "why" panel lists signals |

### 6.3 Bias distribution bar

```ts
// Bias bar for one Story; ratings resolved by provider precedence the user can see and change.
const PRECEDENCE = ["licensed", "community", "wikidata_p1387", "model"] as const;

export function biasBar(outlets: { id: string; ratings: Rating[] }[]) {
  const buckets = { left: 0, center: 0, right: 0, unrated: 0 };
  for (const o of outlets) {
    const r = PRECEDENCE.map((p) => o.ratings.find((x) => x.provider.startsWith(p))).find(Boolean);
    if (!r || r.lean == null) buckets.unrated++;
    else if (r.lean < 0) buckets.left++;
    else if (r.lean > 0) buckets.right++;
    else buckets.center++;
  }
  const rated = outlets.length - buckets.unrated;
  return { ...buckets, rated, shares: rated ? {
    left: buckets.left / rated, center: buckets.center / rated, right: buckets.right / rated } : null };
}
```

### 6.4 Consensus synthesis + Reality Check

```ts
// services/synth/src/consensus.ts
import { generateObject } from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { z } from "zod";

const litellm = createOpenAICompatible({ name: "litellm", baseURL: process.env.LITELLM_URL! });

const Bullets = z.object({
  bullets: z.array(z.object({ text: z.string().max(400), cites: z.array(z.string()).min(1) })).max(7),
  disputed: z.array(z.object({ claim: z.string(), sides: z.array(z.string()) })).optional(),
});

export async function synthesize(story: StoryWithItems, modelAlias: string) {
  const sources = story.items.map((i) => `[${i.id}] ${i.outletName}: ${i.title}\n${i.lede}`).join("\n\n");
  const { object } = await generateObject({
    model: litellm(modelAlias),                 // "local-default" maps to Ollama; BYOAI aliases map to user keys
    schema: Bullets,
    system: "Write neutral bullets. Every bullet must cite source IDs that directly state it. " +
            "Do not add facts. Put contested facts in 'disputed'.",
    prompt: sources,
  });
  // Reality Check: ground each bullet against the text of the sources it cites.
  const checked = await fetch(`${process.env.ML_URL}/verify`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ bullets: object.bullets, sources: story.items.map((i) => ({ id: i.id, text: i.contentMd })) }),
  }).then((r) => r.json());
  return checked.filter((b: any) => b.verdict !== "drop");
}
```

```python
# dukr-ml/app/verify.py  (FastAPI route; LettuceDetect primary, HHEM-2.1-open fallback)
from fastapi import APIRouter
from lettucedetect.models.inference import HallucinationDetector

router = APIRouter()
detector = HallucinationDetector(method="transformer",
                                 model_path="KRLabsOrg/lettucedect-base-modernbert-en-v1")

@router.post("/verify")
def verify(req: dict):
    by_id = {s["id"]: s["text"] for s in req["sources"]}
    out = []
    for b in req["bullets"]:
        context = [by_id[c] for c in b["cites"] if c in by_id]
        spans = detector.predict(context=context, question="Summarize the story.",
                                 answer=b["text"], output_format="spans")
        unsupported = sum(s["end"] - s["start"] for s in spans) / max(len(b["text"]), 1)
        verdict = "pass" if unsupported < 0.05 else ("flag" if unsupported < 0.25 else "drop")
        out.append({**b, "grounding_score": 1 - unsupported, "verdict": verdict})
    return out
```

### 6.5 Rules engine (CEL) and signed webhooks

```ts
// services/rules/src/evaluate.ts
import { evaluate } from "@marcbachmann/cel-js";
import RE2 from "re2";
import { Svix } from "svix";

const svix = new Svix(process.env.SVIX_TOKEN!, { serverUrl: process.env.SVIX_URL });

// Example rule (stored in rules.cel):
//   item.kind == "intel" && item.cves.exists(c, c in user.sbom_cves) && story.outlets >= 2
export async function runRules(ctx: RuleContext, rules: Rule[]) {
  for (const rule of rules.filter((r) => r.enabled)) {
    const matched = evaluate(rule.cel, {
      ...ctx,
      // safe, linear-time regex exposed to CEL as matchesRe(field, pattern)
      matchesRe: (s: string, p: string) => new RE2(p, "i").test(s),
    });
    if (!matched) continue;
    for (const action of rule.actions) {
      if (action.type === "webhook") {
        await svix.message.create(ctx.user.svixAppId, {
          eventType: "story.matched",
          payload: { rule: rule.id, story: ctx.story.id, item: ctx.item.id, url: ctx.item.canonicalUrl },
        });                                     // Standard Webhooks signing, retries, replay handled by Svix
      }
      // other actions: tag, star, mute, notify (Apprise URL), summarize, route-to-squad, open-issue
    }
  }
}
```

---

## 7. API surface

### 7.1 REST (OpenAPI 3.1, PAT or session auth)

| Method & path | Purpose | Competitor parity |
| :--- | :--- | :--- |
| `GET /v1/stories?feed=front` | Front Page, River, Blindspot, For You, tag, Squad, Magazine | HN, daily.dev, Ground News |
| `GET /v1/stories/{id}` | Full Coverage dossier: bullets, outlets, bias bar, ownership, timeline | Google News, Ground News, Particle |
| `POST /v1/stories/{id}/ask` | Closed-book Q&A over the cluster | Particle, Feedly Ask AI |
| `GET /v1/items/{id}` | Article with clean HTML/Markdown and provenance | All readers |
| `POST /v1/submissions` | Link / Ask / Show / Tell | HN, Lobste.rs |
| `POST /v1/trainer` | Thumbs up/down on facet | NewsBlur |
| `GET/POST /v1/rules` | CRUD CEL rules + dry-run against last 7 days | Inoreader |
| `GET/POST /v1/webhooks` | Endpoint management (proxied to Svix) | Inoreader |
| `GET /v1/search?q=` | Hybrid search (BM25 + vector) | HN Algolia, Feedly Pro |
| `GET /v1/stream` | Server-Sent Events of new Stories per topic | HN Firebase |
| `GET /v1/export` | OPML + JSON bundle (feeds, rules, weights, annotations) | NewsBlur |
| `/reader/api/0/*` | Google Reader API compatibility | FreshRSS/Miniflux convention |
| `/fever/` | Fever API compatibility | FreshRSS/Miniflux convention |
| `/{list}.rss` · `.atom` · `.json` | Feed output for every list | Lobste.rs, NewsBlur |

### 7.2 MCP server tools

| Tool | Input | Returns | Typical agent use |
| :--- | :--- | :--- | :--- |
| `search_stories` | query, since, tags, feed | Story list with outlet counts | "What happened with the Rust 2027 edition this week?" |
| `get_story_dossier` | story_id | Bullets with citations, bias bar, ownership, links | Grounded briefing inside an IDE |
| `list_feed` | feed name, limit | Ranked items | Morning digest in Claude Code |
| `ask_story` | story_id, question | Cited answer or "not in sources" | Follow-up research |
| `train` | facet, value, weight | Updated weights | "Show me less about crypto" |
| `create_rule` | natural-language or CEL | Compiled CEL + dry-run matches | Agent-authored automations |
| `cve_watch` | SBOM or package list | Matching intel Stories | DevSecOps triage |

```ts
// services/mcp/src/server.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { DukrClient } from "@dukr/sdk";

const dukr = new DukrClient({ baseUrl: process.env.DUKR_URL!, token: process.env.DUKR_PAT! });
const server = new McpServer({ name: "dukrnews", version: "0.1.0" });

server.registerTool("search_stories", {
  description: "Search clustered news Stories. Returns outlet counts and story IDs.",
  inputSchema: { query: z.string(), since: z.string().optional(), tags: z.array(z.string()).optional() },
}, async ({ query, since, tags }) => {
  const res = await dukr.search({ q: query, since, tags });
  return { content: [{ type: "text", text: JSON.stringify(res.stories, null, 2) }] };
});

server.registerTool("get_story_dossier", {
  description: "Full Coverage dossier with cited consensus bullets, bias bar, and ownership chain.",
  inputSchema: { story_id: z.string() },
}, async ({ story_id }) => ({
  content: [{ type: "text", text: JSON.stringify(await dukr.story(story_id), null, 2) }],
}));

await server.connect(new StdioServerTransport());   // also expose Streamable HTTP for remote agents
```

### 7.3 Webhook payload (Standard Webhooks envelope)

```json
{
  "type": "story.matched",
  "timestamp": "2026-10-13T04:42:03Z",
  "data": {
    "rule_id": "rul_01JAXK",
    "story": { "id": "sty_01JAX9", "title": "OpenSSL patches high-severity flaw", "outlets": 14,
               "bias": { "left": 0.31, "center": 0.46, "right": 0.23 }, "cves": ["CVE-2026-12345"] },
    "item": { "id": "itm_01JAX7", "url": "https://example.org/openssl-advisory", "outlet": "example.org" }
  }
}
```

---

## 8. AI policy layer (BYOAI done safely)

| Concern | Mechanism | Library |
| :--- | :--- | :--- |
| Model routing | Aliases (`local-default`, `byo:<provider>`, `hosted-plus`) resolved per user/org | LiteLLM proxy (router + budgets) |
| Local default | Small instruction model served on CPU or GPU | Ollama (or llama.cpp server; vLLM for GPU scale) |
| Key storage | Keys encrypted with libsodium sealed boxes; KEK held in env/KMS; never logged | libsodium (sodium-native) |
| Spend caps | Monthly USD cap per key; hard stop and notify | LiteLLM budgets |
| Caching | Summaries keyed by `(item_id, prompt_version, model)`; shared across users only for local and hosted models, never for BYOAI | Postgres table + Valkey |
| Provenance | Model, prompt version and grounding score stored per bullet; shown on hover | `story_bullets` table |
| Prompt-injection hygiene | Article text passed as data in delimited blocks; tools disabled during synthesis; output schema enforced | Vercel AI SDK `generateObject` + Zod |
| Evaluation | Nightly faithfulness eval on a labelled sample | ragas or deepeval (both optional) |

---

## 9. Federation design

| Actor / protocol | DUKRNews object | Behaviour | Library |
| :--- | :--- | :--- | :--- |
| ActivityPub `Service` or `Group` actor | Magazine | Followable as `@slug@instance`; each curated item is an `Announce` or `Create(Note)` with link card | Fedify |
| ActivityPub `Group` (FEP-1b12) | Squad | Remote Lemmy/Mbin/PieFed users can post and comment; Squad re-announces to followers | Fedify |
| ActivityPub `Person` | User share-blog | Shares with commentary federate as Notes | Fedify |
| Inbound replies & likes | Comment threads | `Create(Note)` with `inReplyTo` maps into the `comments` ltree | Fedify inbox listeners |
| WebSub subscriber | Feeds with hubs | Push updates replace polling | Custom (small) or hub service |
| WebSub publisher | Every DUKR list feed | Ping a hub on update so other readers get push | Custom |
| AT Protocol | Bluesky bridge | Ingest lists as sources; optionally publish Magazines as feeds | @atproto/api |

```ts
// services/fed/src/magazine.ts (Fedify skeleton)
import { createFederation, Group, Endpoints } from "@fedify/fedify";
import { PostgresKvStore, PostgresMessageQueue } from "@fedify/postgres";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);
export const federation = createFederation<void>({
  kv: new PostgresKvStore(sql), queue: new PostgresMessageQueue(sql),
});

federation.setActorDispatcher("/ap/c/{identifier}", async (ctx, identifier) => {
  const c = await getCollection(identifier);              // squad or magazine
  if (!c) return null;
  return new Group({
    id: ctx.getActorUri(identifier),
    preferredUsername: identifier,
    name: c.title,
    summary: c.description,
    inbox: ctx.getInboxUri(identifier),
    outbox: ctx.getOutboxUri(identifier),
    endpoints: new Endpoints({ sharedInbox: ctx.getInboxUri() }),
  });
});
```

---

## 10. Clients

| Client | Build | Composed libraries | Parity notes |
| :--- | :--- | :--- | :--- |
| Web (full) | SvelteKit SSR + hydration | Swiper (flip/swipe deck), tinykeys (Vim keys), DOMPurify | Feedly layouts, Inoreader keys, Flipboard flip |
| Web (zero-JS) | Same routes, `?lite=1` server-only render | none (plain HTML/CSS) | HN/Lobste.rs speed |
| PWA offline | Service worker + IndexedDB | vite-plugin-pwa, Workbox, Dexie.js | SmartView-style pre-render of next N stories |
| iOS / Android | Capacitor shell around the PWA build | Capacitor (push, background fetch, share sheet, media session) | Apple/SmartNews app parity |
| Desktop | Tauri 2 shell | Tauri | Feedly desktop parity |
| Browser extension | New Tab + outlet overlay + 1-click subscribe | WXT | daily.dev New Tab, Ground News overlay |
| CLI / TUI | `dukr` | oclif | NewsBlur CLI |
| VS Code side panel | Webview + MCP | VS Code API + MCP SDK | daily.dev IDE presence |
| Audio | Briefing player with chapters | howler.js + Media Session API | Apple/Particle narration |
| Puzzles | Daily crossword + sudoku + news quiz | Exolve (ipuz player), sudoku.js; quiz generated from Stories | Apple News+ puzzles |

---

## 11. Deployment profiles

| Profile | Target | Services | RAM | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `solo` | Single user on a Raspberry Pi 5 or small VPS | api+web+workers in one Node process, Postgres, fastembed CPU, no LLM (extractive TL;DR) | ≤ 2 GB | pg-boss instead of Valkey; sqlite-vec optional |
| `standard` | Family / team / small community | All Node services, Postgres, Valkey, dukr-ml CPU, Ollama 3–4B model, SeaweedFS | 8–16 GB | Default docker-compose |
| `gpu` | Public instance | standard + vLLM, faster-whisper GPU, Kokoro GPU, Meilisearch | 32 GB + 1 GPU | Horizontal API and worker replicas |

```yaml
# docker-compose.yml (standard profile, abbreviated)
services:
  postgres:
    image: pgvector/pgvector:pg17
    environment: { POSTGRES_PASSWORD: "${PG_PASSWORD}" }
    volumes: ["pg:/var/lib/postgresql/data"]
  valkey:
    image: valkey/valkey:9
  api:
    image: ghcr.io/dukr/api:0.1
    depends_on: [postgres, valkey]
    environment: { DATABASE_URL: "postgres://postgres:${PG_PASSWORD}@postgres/dukr", LITELLM_URL: "http://litellm:4000" }
  web:
    image: ghcr.io/dukr/web:0.1
    depends_on: [api]
  workers:
    image: ghcr.io/dukr/workers:0.1
    deploy: { replicas: 2 }
  ml:
    image: ghcr.io/dukr/ml:0.1          # FastAPI: embed, verify, ner, lean, asr, tts, mt
  litellm:
    image: ghcr.io/berriai/litellm:main-stable
    volumes: ["./litellm.yaml:/app/config.yaml"]
  ollama:
    image: ollama/ollama
    volumes: ["ollama:/root/.ollama"]
  svix:
    image: svix/svix-server
    depends_on: [postgres, valkey]
  fed:
    image: ghcr.io/dukr/fed:0.1
  seaweedfs:
    image: chrislusf/seaweedfs
    command: "server -s3"
volumes: { pg: {}, ollama: {} }
```

---

## 12. Security, privacy and trust & safety

| Area | Control | Library / mechanism |
| :--- | :--- | :--- |
| Auth | Email + passkeys + OAuth; orgs and roles; scoped PATs | Better Auth (passkey, api-key, organization plugins) |
| Untrusted HTML | Sanitize at ingest **and** render; CSP with no inline scripts | DOMPurify |
| User regex | Linear-time engine only | node-re2 |
| SSRF on fetch | Block private IP ranges; DNS pinning; size and time limits | undici dispatcher + IP allow/deny list |
| Rate limits | Per IP, per PAT, per route | @fastify/rate-limit (Valkey store) |
| Federation abuse | Domain blocks, signature verification, inbox rate limits | Fedify built-ins + moderation log |
| Toxic comments | Pre-moderation score; human review queue | Detoxify (dukr-ml) |
| Privacy | Reading history and My News Bias computed on-device by default; server copy opt-in | Dexie.js local store |
| Observability | Traces across queue hops | OpenTelemetry JS |
| Analytics | Cookie-less, self-hosted | Umami (optional) |

---

## 13. Licensing strategy

| Decision | Rationale |
| :--- | :--- |
| Core repository under **AGPL-3.0-or-later** | Matches peer projects (daily.dev apps, FreshRSS, Folo, Lemmy, Mbin). Prevents closed SaaS forks while allowing commercial self-hosting |
| Permissive libraries (MIT, Apache-2.0, BSD, ISC, PostgreSQL, Unlicense, CC0) linked freely | All are compatible with AGPL-3.0 distribution |
| MPL-2.0 (web-push, Bergamot) | File-level copyleft; fine to link unmodified |
| GPL-3.0 (Piper TTS, Typesense) | Run as **separate network services**, never linked, to keep the boundary clean; Kokoro (Apache-2.0) is the default TTS anyway |
| AGPL-3.0 services (Garage, Open-Meteo, LibreTranslate, Lago, RSSHub, ParadeDB) | Compatible with an AGPL core; if the core is ever relicensed permissively, swap to SeaweedFS / Argos / Kill Bill equivalents |
| **Excluded:** SSPL (Hook0), Elastic-2.0 (Convoy), Sustainable Use (n8n), BUSL (Meilisearch Enterprise) | Not OSI open source; conflicts with "fully FOSS" positioning. Meilisearch **Community** (MIT) is fine |
| Data licenses tracked per row | `outlet_ratings.license` and `ownership_edges.source` are rendered in the UI next to every rating |

---

## 14. Delivery roadmap

| Phase | Weeks | Scope (catalog IDs) | Exit gate |
| :--- | :---: | :--- | :--- |
| 0. Skeleton | 1–2 | Monorepo, DB schema, auth, docker-compose, CI | `docker compose up` gives a working login |
| 1. Reader core | 3–6 | ING-01/03/04/06/12, AI-01, PER-01/03/04/05/06, RX-01/03/05, FED-05, DEV-01 | 300 feeds ingest; River and Front Page work |
| 2. Story engine | 7–10 | AI-02/03/04/05/06/13, ML-08/10 | Clustering F1 ≥ 0.80 on a labelled set; ≥ 95% of displayed bullets grounded |
| 3. Media literacy | 11–13 | ML-01/02/03/04/05/06, AI-12 | Bias bar on ≥ 70% of US-outlet Stories using open data |
| 4. Automation | 14–16 | DEV-02/03/04/05/06/08/12/13, NTF-01/02/03 | Reeder syncs; MCP works in Claude Code; webhooks replayable |
| 5. Social & federation | 17–21 | COM-01..07, COM-10/11, FED-01/03 | Mastodon user follows a Magazine and replies round-trip |
| 6. Media & platforms | 22–26 | RX-02/04/06/07/08/09/13/14, AI-11, PER-07, ING-02/05/07/08 | PWA offline, Capacitor builds, DUKR Daily audio |
| 7. Beyond parity | 27+ | All P2 rows | Per-feature |

---

## 15. PoC exit criteria (measurable)

| Metric | Target | How measured |
| :--- | :--- | :--- |
| Clustering quality | Pairwise F1 ≥ 0.80 | 500 hand-labelled article pairs from the 72-hour window |
| Grounded bullets | ≥ 95% of displayed bullets rated supported by a human reviewer | 200-bullet audit sample |
| Hallucination escape rate | ≤ 2% | Bullets marked "pass" by Reality Check that a human rejects |
| Ingest freshness | p95 ≤ 10 min from publish (polling); ≤ 1 min (WebSub) | Timestamp delta logging |
| Front-page TTFB (zero-JS) | ≤ 150 ms p95 on the standard profile | k6 load test |
| Solo profile footprint | ≤ 2 GB RSS total at 300 feeds | `docker stats` over 24 h |
| Third-party client sync | Reeder + NetNewsWire read/star sync | Manual test |
| Agent integration | 4 MCP tools callable from Claude Code and Cursor | Manual test |
| Accessibility | WCAG 2.2 AA automated checks pass | axe-core in CI |

---

## 16. Risk register

| Risk | Likelihood | Impact | Mitigation |
| :--- | :---: | :---: | :--- |
| Open bias data is thin outside the US | High | Medium | Show "unrated" honestly; community ratings with provenance; pluggable licensed providers |
| AI summaries trigger publisher complaints | Medium | High | Short cited bullets, prominent outbound links, publisher opt-out registry, no paywalled text in prompts |
| Reality Check model is English-centric | High | Medium | Translate-then-verify for other languages; flag unverifiable bullets rather than showing them |
| Dependency churn (archived or relicensed libraries) | Medium | Medium | Interface per capability with ≥2 candidates (see [03 §5](03-software-research-dukrnews-foss-stack.md)); quarterly maintenance re-check |
| Federation spam and moderation load | Medium | High | Invite-only default for new instances; moderation log; domain blocklists |
| Crawl load or robots violations | Low | High | Polite crawler, robots.txt, per-domain rate limits, opt-out registry |
| GPU cost for audio and podcast features | Medium | Low | CPU-friendly Kokoro and whisper.cpp; hosted tiers meter minutes |
| Scope creep (78 catalog rows) | High | High | Phase gates above; P2 rows stay out of the PoC |


---

<a id="doc-3-03-software-research-dukrnews-foss-stack"></a>
<!-- ====================================================================== -->
<!-- FILE: 03-software-research-dukrnews-foss-stack.md (Sequence: 03 of 03) -->
<!-- ====================================================================== -->

# Software Research: FOSS Micro-Library Stack for DUKRNews

`Research date: 2026-10-12 · Current as of: 2026-10-13 (maintenance signals captured 2026-10-12 via deps.dev, GitHub Atom feeds, GitHub REST, npm and PyPI registries)`
**Companion files:** [01 Feature Catalog](01-dukrnews-composite-feature-catalog.md) · [02 Architecture Blueprint](02-dukrnews-poc-architecture-blueprint.md) · [04 QA Report](04-quality-assurance-report.md)

---

## TL;DR

* **No single FOSS app reaches parity with all 12 competitors, but composition does.** The closest full apps each cover one segment: **NewsBlur** (MIT, trainer + MCP + self-host), **FreshRSS / Miniflux** (reader + GReader/Fever APIs), **Folo** (AGPL-3.0, AI reader, 39k★), **Lemmy / Lobsters** (community), **RSSHub** (feed generation, 46k★). DUKRNews takes a different route: a thin TypeScript core plus **~45 micro-libraries**, all checked for maintenance on 2026-10-12.
* **Top picks per layer:** `feedsmith` + `defuddle` (ingest/extract) · `pgvector` + `sentence-transformers`/`fastembed` + `hdbscan` (clustering) · `LiteLLM` + Vercel `ai` SDK + `Ollama` (BYOAI) · **`LettuceDetect`** / HHEM-2.1-open (Reality Check) · `GLiNER` (entities/CVEs) · **`Fedify`** (ActivityPub) · **`Svix`** + `cel-js` + `node-re2` (webhooks and rules) · MCP TS SDK · **Kokoro** (TTS) + `faster-whisper`/`whisper.cpp` (podcasts) · Argos/LibreTranslate (translation).
* **Hardest gap is data, not code.** Ground News-style bias and factuality ratings are **proprietary** (AllSides, MBFC, NewsGuard). The FOSS path is Wikidata (CC0) for ownership and political-alignment statements, the Lin et al. 2023 aggregate reliability ratings, community ratings with provenance, and clearly labelled model estimates.
* **Maintenance landmines found:** MinIO **archived** (GitHub API `archived: true`), `rhasspy/piper` **archived** (active fork is GPL-3.0 `OHF-Voice/piper1-gpl`), `sanitize-html` repo **archived**, `json-logic-js`, `activitypub-express`, `StPageFlip`, `react-crossword` **dormant**; MiniCheck, Meridian, Plasmo **stale**. Each has an active replacement in the tables below.
* **License red flags to avoid for a "fully FOSS" claim:** Convoy (Elastic-2.0 style), Hook0 (SSPL-1.0), n8n (Sustainable Use License), Meilisearch Enterprise (BUSL-1.1). Meilisearch Community (MIT), Activepieces core (MIT) and LiteLLM outside `enterprise/` (MIT) are fine.

---

## 1. Research axes & scope

### 1.1 Scope statement

Find actively maintained FOSS components that, composed together, give DUKRNews parity with the 42 sub-features benchmarked in the source competitive analysis. Then name the micro-libraries per gap with integration effort. "Done" means every catalog row in [01](01-dukrnews-composite-feature-catalog.md) maps to at least one verified, maintained FOSS option, or is explicitly flagged as a data or licensing gap.

### 1.2 Axes

| Axis | Definition used |
| :--- | :--- |
| Core capability | Aggregate, cluster, synthesize, verify and distribute news, with developer and consumer modes |
| Target users | Developers and power users (API, rules, MCP) plus general readers (summaries, bias, audio) |
| Parity anchors | Particle consensus + Reality Check, Ground News bias/Blindspot/ownership, Inoreader rules/webhooks/BYOAI, NewsBlur trainer/MCP, Flipboard ActivityPub magazines, HN/Lobsters governance |
| Platform constraints | Windows 11 + Linux servers (default); web, PWA, iOS/Android, browser extension, CLI |
| License intent | OSI-approved only; AGPL-3.0-compatible; separate-process boundary for GPL-3.0 services |
| Commercial scope | Open-source only (commercial referenced in one paragraph, Section 8) |

### 1.3 Adjacent problem spaces (named, not the focus)

Read-later and web archiving · personal knowledge management and web clippers · civic/local-government data · cyber threat-intelligence platforms · podcast players and indexes · metasearch engines · newsletter publishing.

### 1.4 Source list used

| Source | What it indexes | Why it mattered here |
| :--- | :--- | :--- |
| GitHub (repos, `commits.atom`, `releases.atom`, REST API) | Code, commit and release history, license, archived flag | Primary maintenance evidence for 193 repo probes |
| deps.dev v3 API (OpenSSF Scorecard) | Stars, license, Scorecard "Maintained" check | Second, independent maintenance and license signal |
| npm registry | Package license and latest version | Resolved NOASSERTION licenses for JS libraries |
| PyPI JSON API | Package license and latest version | Resolved Python library licenses |
| Hugging Face model cards (via search) | Model licenses (HHEM, LettuceDetect, lean classifiers, Kokoro) | AI-layer candidates |
| Hacker News "Show HN" (via search) | Fresh launches | Keep-an-eye-on candidates |
| fediverse.party, joinfediverse.wiki, FEP repository (via search) | Fediverse software and specs | Lemmy/Mbin/PieFed status, FEP-1b12 |
| Fedify docs and FOSDEM 2026 schedule (via search) | ActivityPub framework status | Federation layer choice |
| W3C (ActivityPub, WebSub) and websub.rocks | Standards | Protocol layer |
| Wikidata Query Service | CC0 ownership and alignment statements | Open media-literacy data |
| PNAS Nexus / domain-quality.info | Aggregated news-domain reliability ratings | Open factuality signal |
| AllSides and MBFC licensing pages (via search) | Rating licensing terms | Confirmed ratings are proprietary |
| Vendor docs: Svix, Better Auth, Meilisearch, Open-Meteo, Apprise | Licensing and feature claims | Cross-check of search summaries |
| Linux news (linuxiac, ppc.land) and Reddit (via search) | Project shutdowns and forks | TT-RSS shutdown and community fork |
| Prior workspace deliverables | Competitive analysis, OpenWire teardown | Baseline features and an exclusion (paywall bypass) |

**Search-pass count:** 49 web-search queries across the 15 source categories above, plus programmatic verification: **193 repository probes** (deps.dev + GitHub Atom), **46 GitHub REST calls** (exact SPDX + archived flag), **23 npm** and **10 PyPI** registry lookups, and **17 raw LICENSE fetches**. Full query log in Section 10.

> [!NOTE]
> Method caveat: web searches returned synthesized summaries with citations. Wherever a claim drives a recommendation (license, archived status, last release), it was re-verified programmatically against GitHub, deps.dev, npm or PyPI. Claims that rest only on a search summary are listed in Section 9.

### 1.5 Maintenance classification (from the skill's rubric)

**Active** = commit in the last 90 days (on or after 2026-07-14) · **Maintained-slow** = last commit 3–12 months ago, or recent commits but no release in more than 12 months (conservative) · **Stale** = 12–24 months · **Archived/Dormant** = repo archived or last commit more than 24 months ago.

---

## 2. Open-source products

Stars are GitHub stars on 2026-10-12. "Last release" is the latest GitHub release or tag (registry version where noted).

### 2.1 Reference platforms (full applications)

| Product | URL | License | Languages | Self-host | Maintenance | Last release | Stars / signals | UVP | Key features |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| NewsBlur | [samuelclay/NewsBlur](https://github.com/samuelclay/NewsBlur) | MIT | Python, JS | Docker (`make nb`) | Active | iOS_15.1 · 2026-10-09 | 7.6k★ · Scorecard 10 | Open-source reader with ML trainer and MCP | Intelligence trainer, Blurblog, original-site view, MCP, API |
| FreshRSS | [FreshRSS/FreshRSS](https://github.com/FreshRSS/FreshRSS) | AGPL-3.0 | PHP | Docker, shared hosting | Active | 1.30.1 · 2026-10-05 | 16.2k★ · Scorecard 10 | Feature-rich multi-user reader | Extensions, XPath scraping, GReader + Fever APIs |
| Miniflux | [miniflux/v2](https://github.com/miniflux/v2) | Apache-2.0 | Go | Single binary, Docker | Active | 2.3.3 · 2026-07-24 | 9.8k★ · fuzzed | Minimalist, fast reader | Keyboard-driven, GReader + Fever APIs, integrations |
| Folo (ex-Follow) | [RSSNext/Folo](https://github.com/RSSNext/Folo) | AGPL-3.0 | TypeScript | Primarily hosted | Active | Mobile v0.5.11 · 2026-10-02 | 39.1k★ | AI-native RSS reader | AI summaries, translation, digests, cross-platform apps |
| CommaFeed | [Athou/commafeed](https://github.com/Athou/commafeed) | Apache-2.0 | Java | Docker, native image | Active | 7.3.2 · 2026-08-22 | 3.6k★ | Google-Reader-style reader | Fever API, low memory native build |
| yarr | [nkanaev/yarr](https://github.com/nkanaev/yarr) | MIT | Go | Single binary | Active | v2.9 · 2026-09-07 | 4.1k★ | Dead-simple single-user reader | SQLite, Fever API |
| Tiny Tiny RSS (community) | [tt-rss/tt-rss](https://github.com/tt-rss/tt-rss) | GPL-3.0 | PHP | Docker | Active (community fork) | no releases | 855★ | Continuation after 2025-11-01 upstream shutdown | Plugins, filters, API |
| RSSHub | [DIYgod/RSSHub](https://github.com/DIYgod/RSSHub) | AGPL-3.0 | TypeScript | Docker | Active | v2026.10.12 · 2026-10-12 | 46.4k★ · Scorecard 10 | "Everything is RSSible" | Thousands of routes for feedless sites |
| RSS-Bridge | [RSS-Bridge/rss-bridge](https://github.com/RSS-Bridge/rss-bridge) | Unlicense | PHP | Docker | Active | 2026-09-30 tag | 9.3k★ | Public-domain feed generator | Bridges for social and feedless sites |
| changedetection.io | [dgtlmoon/changedetection.io](https://github.com/dgtlmoon/changedetection.io) | Apache-2.0 | Python | Docker | Active | 0.60.8 · 2026-09-28 | 34.8k★ | Web-page change monitoring | Visual diff, XPath/CSS filters, notifications |
| Kill the Newsletter | [leafac/kill-the-newsletter](https://github.com/leafac/kill-the-newsletter) | MIT | TypeScript | Docker | Active | v2.1.3 · 2026-10-03 | 3.1k★ | Email newsletters to Atom feeds | Per-feed inbox addresses |
| Wallabag | [wallabag/wallabag](https://github.com/wallabag/wallabag) | MIT | PHP | Docker | Active (commits) | 2.6.14 · 2025-10-07 | 13.0k★ | Read-later and archiving | Full-text save, annotations, apps |
| Glance | [glanceapp/glance](https://github.com/glanceapp/glance) | AGPL-3.0 | Go | Single binary | Active | v0.8.6 · 2026-09-03 | 37.4k★ | Self-hosted dashboard of feeds | RSS, HN, Reddit, weather widgets |
| Lemmy | [LemmyNet/lemmy](https://github.com/LemmyNet/lemmy) | AGPL-3.0 | Rust | Docker | Active | 0.19.21-beta.1 · 2026-10-08 | 14.6k★ | Federated link aggregator | Communities as AP Groups, voting, moderation |
| Mbin | [MbinOrg/mbin](https://github.com/MbinOrg/mbin) | AGPL-3.0 | PHP | Docker | Active | v1.11.0 · 2026-10-09 | 431★ | Kbin fork; threads + microblog | Magazines, ActivityPub |
| PieFed | codeberg.org/rimu/pyfedi | AGPL-3.0 | Python | Docker | unknown (Codeberg not probed) | unknown | Community reports fast growth | Threadiverse platform with modern UX | Communities, federation |
| Lobsters | [lobsters/lobsters](https://github.com/lobsters/lobsters) | BSD-3-Clause | Ruby | Rails app | Active | no releases | 4.9k★ · Scorecard 10 | Invite-tree computing community | Moderation log, tags, invitation tree |
| daily.dev apps | [dailydotdev/apps](https://github.com/dailydotdev/apps) | AGPL-3.0 | TypeScript | Partial (frontend) | Active | v3.47.6 · 2026-10-02 | 1.0k★ | Developer news frontend and extension | New-tab extension, Squads UI |
| Kagi News data | [kagisearch/kite-public](https://github.com/kagisearch/kite-public) | MIT | JSON, JS | n/a (data) | Active | no releases | 1.1k★ | Community-curated source lists for Kagi News | Open source registry by category |
| Meridian | [iliane5/meridian](https://github.com/iliane5/meridian) | MIT | TypeScript | Cloudflare | **Stale** (2025-05-30) | none | 2.4k★ | AI daily intelligence briefing | Embeddings + UMAP + HDBSCAN, LLM briefs |
| OpenWire | [AnsonLai/OpenWire](https://github.com/AnsonLai/OpenWire) | AGPL-3.0 | JavaScript | Static PWA | Active | none | 3★ | Static PWA aggregator (prior workspace teardown) | Feed weaving; **paywall-bypass routing (excluded)** |

### 2.2 Ingestion, extraction & sanitization

| Product | URL | License | Languages | Self-host | Maintenance | Last release | Stars / signals | UVP | Key features |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| feedsmith | [macieklamberski/feedsmith](https://github.com/macieklamberski/feedsmith) | MIT | TypeScript | npm | Active | v3.0.1 · 2026-09-25 | 630★ | One fast parser/generator for RSS, Atom, RDF, JSON Feed, OPML | Namespaces (podcast, media, DC), tolerant parsing |
| rss-parser | [rbren/rss-parser](https://github.com/rbren/rss-parser) | MIT | JavaScript | npm | Maintained-slow (no release since 2023) | v3.13.0 · 2023-04-11 | 1.5k★ | Simple RSS/Atom to JSON | Custom fields |
| @extractus/feed-extractor | [extractus/feed-extractor](https://github.com/extractus/feed-extractor) | MIT | TypeScript | npm, JSR | Active | v8.0.3 · 2026-08-07 | 191★ | Normalized feed extraction | Deno/JSR first |
| @extractus/article-extractor | [extractus/article-extractor](https://github.com/extractus/article-extractor) | MIT | TypeScript | npm | Active | v9.0.1 · 2026-08-20 | 1.9k★ | Article extraction | Metadata + content |
| feed (generator) | [jpmonette/feed](https://github.com/jpmonette/feed) | MIT | TypeScript | npm | Active | 6.0.0 · 2026-07-05 | 1.4k★ | RSS/Atom/JSON Feed output | Feed generation for every list |
| gofeed | [mmcdole/gofeed](https://github.com/mmcdole/gofeed) | MIT | Go | Go module | Active | v1.5.0 · 2026-09-25 | 2.9k★ | Go universal feed parser | Option for a Go ingest worker |
| feedparser | [kurtmckee/feedparser](https://github.com/kurtmckee/feedparser) | BSD-2-Clause | Python | PyPI | Active | 6.0.14 · 2026-07-30 | 2.4k★ | Canonical Python feed parser | Used in dukr-ml jobs |
| defuddle | [kepano/defuddle](https://github.com/kepano/defuddle) | MIT | TypeScript | npm | Active | 0.19.5 · 2026-10-10 | 9.6k★ | AI-era content extraction | Extractor registry, Markdown, code/math preservation |
| @mozilla/readability | [mozilla/readability](https://github.com/mozilla/readability) | Apache-2.0 | JavaScript | npm | Maintained-slow (stable) | 0.6.0 · 2025-03-03 | 11.5k★ | Firefox Reader View engine | Battle-tested fallback |
| trafilatura | [adbar/trafilatura](https://github.com/adbar/trafilatura) | Apache-2.0 | Python | PyPI | Active | 2.3.1 · 2026-10-06 | 6.9k★ · Scorecard 10 | Best-in-class text mining extraction | Dates, comments, language, TEI/Markdown |
| newspaper4k | [AndyTheFactory/newspaper4k](https://github.com/AndyTheFactory/newspaper4k) | MIT | Python | PyPI | Active | 0.9.6 · 2026-07-19 | 1.2k★ | News-article extraction + NLP | Authors, dates, keywords |
| Crawlee | [apify/crawlee](https://github.com/apify/crawlee) | Apache-2.0 | TypeScript, Python | npm, PyPI | Active | v4.0.0-rc.1 · 2026-10-06 | 26.1k★ | Polite, scalable crawling | Queues, sessions, Playwright integration |
| Playwright | [microsoft/playwright](https://github.com/microsoft/playwright) | Apache-2.0 | TypeScript | npm | Active | v1.64.0 · 2026-10-07 | 97.3k★ | Headless browser automation | JS-rendered sources |
| smtp-server | [nodemailer/smtp-server](https://github.com/nodemailer/smtp-server) | MIT-0 | JavaScript | npm | Active | 3.19.21 · 2026-10-10 | 915★ | Embeddable SMTP server | Newsletter inbox (ING-07) |
| mailparser | [nodemailer/mailparser](https://github.com/nodemailer/mailparser) | MIT | JavaScript | npm | Active | 3.9.38 · 2026-10-10 | 1.7k★ | MIME parsing | HTML/text bodies, attachments |
| masto.js | [neet/masto.js](https://github.com/neet/masto.js) | MIT | TypeScript | npm | Active | v8.0.0 · 2026-07-30 | 784★ | Mastodon API client | Timelines, lists, streaming |
| @atproto/api | [bluesky-social/atproto](https://github.com/bluesky-social/atproto) | MIT OR Apache-2.0 | TypeScript | npm | Active | 0.25.0 (npm) | 9.7k★ | Official Bluesky SDK | Lists, feeds, Jetstream firehose |
| monolith | [Y2Z/monolith](https://github.com/Y2Z/monolith) | CC0-1.0 | Rust | Binary | Active | v2.11.3 · 2026-10-10 | 15.5k★ | Save page as one HTML file | Offline snapshots |
| SingleFile | [gildas-lormeau/SingleFile](https://github.com/gildas-lormeau/SingleFile) | AGPL-3.0 | JavaScript | CLI, extension | Active | v1.29.0 · 2026-10-10 | 22.5k★ | Faithful page archiving | Extension + CLI |
| DOMPurify | [cure53/DOMPurify](https://github.com/cure53/DOMPurify) | MPL-2.0 OR Apache-2.0 | JavaScript | npm | Active | 3.4.16 · 2026-09-23 | 17.4k★ · Scorecard 10 | XSS sanitizer | Ingest and render sanitization |
| sanitize-html | [apostrophecms/sanitize-html](https://github.com/apostrophecms/sanitize-html) | MIT | JavaScript | npm | **Archived repo** (2026) | 2025-05-14 | 4.1k★ | Allow-list sanitizer | Use DOMPurify instead |
| turndown | [mixmark-io/turndown](https://github.com/mixmark-io/turndown) | MIT | JavaScript | npm | Active | v7.2.4 · 2026-04-03 | 11.5k★ | HTML to Markdown | LLM- and MCP-ready text |

### 2.3 AI, ML & ranking

| Product | URL | License | Languages | Self-host | Maintenance | Last release | Stars / signals | UVP | Key features |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| pgvector | [pgvector/pgvector](https://github.com/pgvector/pgvector) | PostgreSQL | C | Postgres extension | Active | v0.8.7 · 2026-10-01 | 23.3k★ · Scorecard 10 | Vectors inside Postgres | HNSW/IVFFlat, cosine, quantization |
| sqlite-vec | [asg017/sqlite-vec](https://github.com/asg017/sqlite-vec) | Apache-2.0 | C | SQLite extension | Maintained-slow | v0.1.10-alpha.4 · 2026-05-18 | 8.2k★ | Vectors in SQLite | `solo` profile option |
| sentence-transformers | [UKPLab/sentence-transformers](https://github.com/UKPLab/sentence-transformers) | Apache-2.0 | Python | PyPI | Active | v6.1.0 · 2026-09-18 | 19.2k★ · Scorecard 10 | Standard embedding library | Multilingual models, rerankers |
| fastembed | [qdrant/fastembed](https://github.com/qdrant/fastembed) | Apache-2.0 | Python | PyPI | Active | v0.9.0 · 2026-10-07 | 3.2k★ | ONNX CPU embeddings | Low-RAM embedding |
| transformers.js | [huggingface/transformers.js](https://github.com/huggingface/transformers.js) | Apache-2.0 | JavaScript | npm | Active | 4.3.1 · 2026-10-07 | 16.3k★ | Models in Node and the browser | On-device embeddings, kokoro-js runtime |
| hdbscan | [scikit-learn-contrib/hdbscan](https://github.com/scikit-learn-contrib/hdbscan) | BSD-3-Clause | Python | PyPI | Active | 0.8.44 · 2026-06-01 | 3.2k★ | Density clustering | Batch re-clustering |
| BERTopic | [MaartenGr/BERTopic](https://github.com/MaartenGr/BERTopic) | MIT | Python | PyPI | Active (commits) | v0.17.4 · 2025-12-03 | 7.9k★ | Topic modeling | Topic labels, online `partial_fit` |
| datasketch | [ekzhu/datasketch](https://github.com/ekzhu/datasketch) | MIT | Python | PyPI | Active | v2.0.0 · 2026-07-05 | 3.0k★ | MinHash / LSH | Syndication dedup |
| LiteLLM | [BerriAI/litellm](https://github.com/BerriAI/litellm) | MIT (excl. `enterprise/`) | Python | Docker proxy | Active | v1.106.0-rc.1 · 2026-10-11 | 60.2k★ | One API for 100+ LLM providers | BYOAI routing, budgets, fallbacks |
| Vercel AI SDK | [vercel/ai](https://github.com/vercel/ai) | Apache-2.0 | TypeScript | npm | Active | ai 7.0.138 (npm) | 27.2k★ | Typed LLM calls in TS | `generateObject` + Zod, streaming |
| Ollama | [ollama/ollama](https://github.com/ollama/ollama) | MIT | Go | Binary, Docker | Active | v0.40.3 · 2026-10-11 | 182.4k★ | Easiest local LLM server | OpenAI-compatible API |
| llama.cpp | [ggml-org/llama.cpp](https://github.com/ggml-org/llama.cpp) | MIT | C++ | Binary | Active | b11563 · 2026-10-12 | 130.4k★ | Fast local inference | `llama-server`, GGUF |
| vLLM | [vllm-project/vllm](https://github.com/vllm-project/vllm) | Apache-2.0 | Python | Docker | Active | 2026-10-09 | 93.2k★ | High-throughput GPU serving | `gpu` profile |
| LettuceDetect | [KRLabsOrg/LettuceDetect](https://github.com/KRLabsOrg/LettuceDetect) | MIT | Python | PyPI | Active | v0.2.3 · 2026-08-13 | 614★ | Token-level hallucination detection | ModernBERT, long context, span output |
| HHEM-2.1-open | huggingface.co/vectara/hallucination_evaluation_model | Apache-2.0 (per search) | Python | HF model | not probed (model card) | n/a | Widely used baseline | Factual-consistency score 0–1 | CPU-friendly first pass |
| MiniCheck | [Liyan06/MiniCheck](https://github.com/Liyan06/MiniCheck) | Apache-2.0 | Python | PyPI | **Stale** (2025-08-27) | none | 228★ | Cheap grounded fact-checking | Use as benchmark reference only |
| ragas | [explodinggradients/ragas](https://github.com/explodinggradients/ragas) | Apache-2.0 | Python | PyPI | Maintained-slow | v0.4.3 · 2026-01-13 | 15.9k★ | RAG evaluation metrics | Nightly faithfulness evals |
| GLiNER | [urchade/GLiNER](https://github.com/urchade/GLiNER) | Apache-2.0 | Python | PyPI | Active | v0.2.29 · 2026-09-08 | 4.1k★ | Zero-shot NER on CPU | Custom labels (CVE, actor, product) |
| spaCy | [explosion/spaCy](https://github.com/explosion/spaCy) | MIT | Python, Cython | PyPI | Active | v3.8.16 · 2026-08-24 | 33.9k★ · Scorecard 10 | Industrial NLP | Sentence split, NER fallback |
| LlamaIndex | [run-llama/llama_index](https://github.com/run-llama/llama_index) | MIT | Python | PyPI | Active | v0.14.25 · 2026-09-21 | 52.4k★ | RAG framework | Optional for story Q&A |
| Detoxify | [unitaryai/detoxify](https://github.com/unitaryai/detoxify) | Apache-2.0 | Python | PyPI | Maintained-slow | v0.5.3 · 2026-03-26 | 1.3k★ | Toxicity scoring | Comment pre-moderation |
| Gorse | [gorse-io/gorse](https://github.com/gorse-io/gorse) | Apache-2.0 | Go | Docker | Active | v0.5.11 · 2026-07-14 | 9.9k★ | Recommender engine | Opt-in "For You" feed |
| implicit | [benfred/implicit](https://github.com/benfred/implicit) | MIT | Python, C++ | PyPI | Maintained-slow | v0.7.3 · 2026-05-08 | 3.8k★ | Implicit-feedback CF | Lightweight alternative to Gorse |

### 2.4 Audio, podcasts & translation

| Product | URL | License | Languages | Self-host | Maintenance | Last release | Stars / signals | UVP | Key features |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Kokoro-82M (model + reference lib) | [hexgrad/kokoro](https://github.com/hexgrad/kokoro) | Apache-2.0 | Python | PyPI | Stale repo (2025-08-06); weights stable | none | 9.2k★ | High-quality CPU-friendly TTS | Many preset voices, no cloning |
| Kokoro-FastAPI | [remsky/Kokoro-FastAPI](https://github.com/remsky/Kokoro-FastAPI) | Apache-2.0 | Python | Docker | Active | v0.9.0 · 2026-09-10 | 5.5k★ | OpenAI-compatible Kokoro server | Timestamps, streaming, CPU/GPU images |
| kokoro-onnx | [thewh1teagle/kokoro-onnx](https://github.com/thewh1teagle/kokoro-onnx) | MIT | Python | PyPI | Active | model-files-v1.1 · 2026-08-18 | 2.8k★ | Kokoro on ONNX Runtime | Lightweight embedding in dukr-ml |
| kokoro-js | npmjs.com/package/kokoro-js | Apache-2.0 | JavaScript | npm | Active (npm 1.2.1) | 1.2.1 (npm) | transformers.js-based | Kokoro in the browser | On-device narration in the PWA |
| Piper (active fork) | [OHF-Voice/piper1-gpl](https://github.com/OHF-Voice/piper1-gpl) | GPL-3.0 | C++, Python | Binary | Active | v1.8.0 · 2026-09-04 | 5.8k★ | Fast embedded TTS | Run as separate service only |
| Piper (original) | [rhasspy/piper](https://github.com/rhasspy/piper) | MIT | C++ | Binary | **Archived** | 2023.11.14-2 | 11.3k★ | Historical reference | Superseded by piper1-gpl |
| Chatterbox | [resemble-ai/chatterbox](https://github.com/resemble-ai/chatterbox) | MIT | Python | PyPI | Active (commits) | v0.1.2 · 2025-06-13 | 26.8k★ | Expressive TTS with cloning | Premium voices on GPU |
| sherpa-onnx | [k2-fsa/sherpa-onnx](https://github.com/k2-fsa/sherpa-onnx) | Apache-2.0 | C++ (+ many bindings) | Library | Active | v1.13.8 · 2026-09-18 | 15.2k★ | One on-device runtime for TTS + ASR | Kokoro/Piper models, mobile bindings |
| whisper.cpp | [ggml-org/whisper.cpp](https://github.com/ggml-org/whisper.cpp) | MIT | C/C++ | Binary | Active | v1.9.5 · 2026-10-07 | 54.2k★ | CPU/Apple-silicon ASR | `solo`/`standard` podcast transcripts |
| faster-whisper | [SYSTRAN/faster-whisper](https://github.com/SYSTRAN/faster-whisper) | MIT | Python | PyPI | Active (commits) | 1.2.1 · 2025-10-31 | 25.8k★ | Fast GPU ASR | Batch transcription |
| WhisperX | [m-bain/whisperX](https://github.com/m-bain/whisperX) | BSD-2-Clause | Python | PyPI | Active | 3.8.7rc1 · 2026-06-26 | 24.4k★ | Word timestamps + diarization | Speaker-labelled podcast search |
| LibreTranslate | [LibreTranslate/LibreTranslate](https://github.com/LibreTranslate/LibreTranslate) | AGPL-3.0 | Python | Docker | Active | 1.9.6 · 2026-05-26 | 17.0k★ | Self-hosted translation API | Many language pairs |
| Argos Translate | [argosopentech/argos-translate](https://github.com/argosopentech/argos-translate) | MIT | Python | PyPI | Active | v1.11.0 · 2026-02-02 | 6.6k★ | Offline NMT library | Pivot translation |
| Firefox Translations (Bergamot) | [mozilla/translations](https://github.com/mozilla/translations) | MPL-2.0 | Python, C++ | Training pipeline + WASM | Active | fxtranslate-v0.1.0 · 2026-07-05 | 359★ | Client-side private MT | In-browser translation in the PWA |
| howler.js | [goldfire/howler.js](https://github.com/goldfire/howler.js) | MIT | JavaScript | npm | Maintained-slow (stable) | v2.2.4 · 2023-09-19 | 25.4k★ | Web audio playback | Briefing player |

### 2.5 Developer surface, automation & notifications

| Product | URL | License | Languages | Self-host | Maintenance | Last release | Stars / signals | UVP | Key features |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Fastify | [fastify/fastify](https://github.com/fastify/fastify) | MIT | JavaScript | npm | Active | v6.0.0-alpha.4 · 2026-09-17 | 37.2k★ · Scorecard 10 | Fast Node web framework | Schemas, plugins |
| @fastify/swagger | [fastify/fastify-swagger](https://github.com/fastify/fastify-swagger) | MIT | JavaScript | npm | Active | v9.9.2 · 2026-10-09 | 1.1k★ | OpenAPI from routes | Public API docs |
| @fastify/rate-limit | [fastify/fastify-rate-limit](https://github.com/fastify/fastify-rate-limit) | MIT | JavaScript | npm | Active | v11.2.1 · 2026-10-08 | 604★ | Rate limiting | Per-PAT quotas |
| Svix (server + SDKs) | [svix/svix-webhooks](https://github.com/svix/svix-webhooks) | MIT | Rust, many SDKs | Docker | Active | SDKs v2.8.0 · 2026-10-08 | 3.4k★ · Scorecard 10 | Webhooks as a service, self-hostable | Signing, retries, replay, logs |
| Standard Webhooks | [standard-webhooks/standard-webhooks](https://github.com/standard-webhooks/standard-webhooks) | Apache-2.0 | Spec + libs | Library | Active | libraries v0.0.1 · 2026-05-12 | 1.8k★ | Common webhook signing spec | Interop for receivers |
| Convoy | [frain-dev/convoy](https://github.com/frain-dev/convoy) | Source-available (Elastic-2.0-style agreement) | Go | Docker | Active | v26.8.0 · 2026-09-28 | 2.9k★ | Webhook gateway | **Excluded on license** |
| cel-js (@marcbachmann) | [marcbachmann/cel-js](https://github.com/marcbachmann/cel-js) | MIT | TypeScript | npm | Maintained-slow (default-branch commit 2026-07-07) | v8.0.0 · 2026-07-07 | 203★ | Fast zero-dependency CEL | Safe, sandboxed rule expressions |
| json-rules-engine | [CacheControl/json-rules-engine](https://github.com/CacheControl/json-rules-engine) | ISC | JavaScript | npm | Maintained-slow | npm 7.3.1 | 3.1k★ | JSON rule definitions | UI-friendly rule builder backend |
| json-logic-engine | [json-logic/json-logic-engine](https://github.com/json-logic/json-logic-engine) | MIT | JavaScript | npm | Maintained-slow | v5.0.0 · 2025-05-26 | 110★ | Fast JsonLogic | Replacement for dormant json-logic-js |
| json-logic-js | [jwadhams/json-logic-js](https://github.com/jwadhams/json-logic-js) | MIT | JavaScript | npm | **Dormant** (2024-07-09) | 2.0.5 · 2024-07-09 | 1.5k★ | Original JsonLogic | Avoid for new code |
| node-re2 | [uhop/node-re2](https://github.com/uhop/node-re2) | BSD-3-Clause | C++, JS | npm | Active | 1.27.0 · 2026-09-26 | 562★ · Scorecard 10 | Linear-time regex | ReDoS-safe user filters |
| MCP TypeScript SDK | [modelcontextprotocol/typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk) | MIT (transitioning to Apache-2.0) | TypeScript | npm | Active | 1.32.1 · 2026-10-05 | 13.5k★ | Official MCP SDK | Tools, resources, stdio + HTTP |
| MCP Python SDK | [modelcontextprotocol/python-sdk](https://github.com/modelcontextprotocol/python-sdk) | MIT | Python | PyPI | Active | v2.3.0 · 2026-10-02 | 24.5k★ | Official MCP SDK | Alternative for dukr-ml tools |
| oclif | [oclif/oclif](https://github.com/oclif/oclif) | MIT | TypeScript | npm | Active | 6.0.8 · 2026-10-11 | 9.6k★ | CLI framework | `dukr` CLI |
| Activepieces | [activepieces/activepieces](https://github.com/activepieces/activepieces) | MIT (core; `ee/` commercial) | TypeScript | Docker | Active | 0.92.2 · 2026-10-07 | 25.0k★ | Zapier-like automation | DUKR "piece" connector |
| Node-RED | [node-red/node-red](https://github.com/node-red/node-red) | Apache-2.0 | JavaScript | Docker | Active | 5.0.8 · 2026-10-08 | 23.7k★ | Flow-based automation | DUKR node |
| Huginn | [huginn/huginn](https://github.com/huginn/huginn) | MIT | Ruby | Docker | Active | v2026.10.04 | 50.0k★ | Self-hosted agents (IFTTT-like) | Webhook agent integration |
| n8n | [n8n-io/n8n](https://github.com/n8n-io/n8n) | Sustainable Use License | TypeScript | Docker | Active | stable · 2026-10-09 | 207.0k★ | Popular workflow tool | **Not OSI; integrate via webhooks only** |
| Apprise | [caronc/apprise](https://github.com/caronc/apprise) | BSD-2-Clause | Python | Docker API, PyPI | Active | v2.0.1 · 2026-10-03 | 17.5k★ · Scorecard 10 | One URL syntax for 150+ notifiers | Slack, Teams, Discord, ntfy, email |
| ntfy | [binwiederhier/ntfy](https://github.com/binwiederhier/ntfy) | Apache-2.0 OR GPL-2.0-only | Go | Binary, Docker | Active | v2.29.0 · 2026-10-07 | 34.6k★ | Self-hosted push | Mobile push without Google/Apple accounts |
| web-push | [web-push-libs/web-push](https://github.com/web-push-libs/web-push) | MPL-2.0 | JavaScript | npm | Maintained-slow (no release since 2024) | v3.6.7 · 2024-01-16 | 3.6k★ | VAPID Web Push | PWA notifications |
| MJML | [mjmlio/mjml](https://github.com/mjmlio/mjml) | MIT | JavaScript | npm | Active | v6.0.0-alpha.1 · 2026-10-09 | 18.3k★ | Responsive email markup | Digest emails |
| listmonk | [knadh/listmonk](https://github.com/knadh/listmonk) | AGPL-3.0 | Go | Binary | Active | nightly · 2026-10-12 | 23.8k★ | Newsletter manager | Team newsletters (COM-09) |

### 2.6 Social, federation & annotation

| Product | URL | License | Languages | Self-host | Maintenance | Last release | Stars / signals | UVP | Key features |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Fedify | [fedify-dev/fedify](https://github.com/fedify-dev/fedify) | MIT | TypeScript | npm | Active | Fedify 2.4.3 · 2026-10-11 | 1.0k★ · powers Ghost's AP service | ActivityPub without the pain | Actors, inbox/outbox, signatures, Postgres KV/MQ |
| activitypub-express | [immers-space/activitypub-express](https://github.com/immers-space/activitypub-express) | MIT | JavaScript | npm | **Dormant** (2024-02-12) | v4.4.2 · 2024-02-12 | 300★ | Express AP middleware | Use Fedify instead |
| Remark42 | [umputun/remark42](https://github.com/umputun/remark42) | MIT | Go | Binary, Docker | Active | 1.18.0 · 2026-10-11 | 5.6k★ · Scorecard 10 | Privacy-first comments | Option if comments are embedded, not native |
| Artalk | [ArtalkJS/Artalk](https://github.com/ArtalkJS/Artalk) | MIT | Go | Docker | Active | nightly · 2026-10-11 | 2.3k★ | Lightweight comments | Alternative to Remark42 |
| giscus | [giscus/giscus](https://github.com/giscus/giscus) | MIT | TypeScript | Hosted or self-host | Maintained-slow | none | 12.1k★ | GitHub-Discussions comments | Developer-Squad option |
| Hypothesis client | [hypothesis/client](https://github.com/hypothesis/client) | BSD-2-Clause | TypeScript | Embeddable | Active | v1.1766.0 · 2026-07-01 | 735★ | Web annotation client | W3C annotations for team boards |
| Recogito Text Annotator | [recogito/text-annotator-js](https://github.com/recogito/text-annotator-js) | BSD-3-Clause | TypeScript | npm | Active | 3.4.0 · 2026-04-30 | 104★ | Embeddable text highlighting | Lighter alternative to Hypothesis |
| Tiptap | [ueberdosis/tiptap](https://github.com/ueberdosis/tiptap) | MIT | TypeScript | npm | Active | v3.31.4 · 2026-09-30 | 38.7k★ | Headless rich-text editor | Magazine notes, comments, editor's desk |

### 2.7 Clients & reading experience

| Product | URL | License | Languages | Self-host | Maintenance | Last release | Stars / signals | UVP | Key features |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| SvelteKit | [sveltejs/kit](https://github.com/sveltejs/kit) | MIT | TypeScript | npm | Active | @sveltejs/kit 3.0.1 · 2026-10-06 | 20.8k★ | Full-stack Svelte framework | SSR, zero-JS pages, adapters |
| vite-plugin-pwa | [vite-pwa/vite-plugin-pwa](https://github.com/vite-pwa/vite-plugin-pwa) | MIT | TypeScript | npm | Active | v2.0.0 · 2026-10-03 | 4.3k★ | PWA tooling | Manifest + Workbox integration |
| Workbox | [GoogleChrome/workbox](https://github.com/GoogleChrome/workbox) | MIT | JavaScript | npm | Active | v7.4.1 · 2026-05-05 | 13.0k★ | Service-worker toolkit | Offline caching strategies |
| Dexie.js | [dexie/Dexie.js](https://github.com/dexie/Dexie.js) | Apache-2.0 | TypeScript | npm | Active | v4.4.6 · 2026-09-10 | 14.6k★ | IndexedDB wrapper | Offline store, on-device bias history |
| Capacitor | [ionic-team/capacitor](https://github.com/ionic-team/capacitor) | MIT | TypeScript, Swift, Kotlin | npm | Active | 9.0.0-alpha.8 · 2026-10-07 | 16.8k★ · Scorecard 10 | Web to native iOS/Android | Push, share, background fetch |
| Tauri | [tauri-apps/tauri](https://github.com/tauri-apps/tauri) | Apache-2.0 OR MIT | Rust | Binary | Active | tauri v2.12.3 · 2026-10-10 | 111.7k★ · Scorecard 10 | Tiny desktop/mobile shells | Desktop apps (RX-15) |
| WXT | [wxt-dev/wxt](https://github.com/wxt-dev/wxt) | MIT | TypeScript | npm | Active | 0.21.4 (npm) | 10.6k★ | Modern MV3 extension framework | New Tab, content-script overlay |
| Plasmo | [PlasmoHQ/plasmo](https://github.com/PlasmoHQ/plasmo) | MIT | TypeScript | npm | **Stale** (default branch 2025-05-17) | v0.90.5 · 2025-05-18 | 13.2k★ | React-first extension framework | Avoid for new work |
| Swiper | [nolimits4web/swiper](https://github.com/nolimits4web/swiper) | MIT | JavaScript | npm | Active | v14.3.0 · 2026-09-28 | 41.9k★ · Scorecard 10 | Touch slider | Flip/cards effects for magazine mode |
| StPageFlip | [Nodlik/StPageFlip](https://github.com/Nodlik/StPageFlip) | MIT | TypeScript | npm | **Dormant** (2021-04-18) | v2.0.7 · 2021-04-18 | 882★ | Page-curl effect | Use Swiper flip effect instead |
| tinykeys | [jamiebuilds/tinykeys](https://github.com/jamiebuilds/tinykeys) | MIT | TypeScript | npm | Active | v4.0.1 · 2026-09-25 | 4.1k★ | Tiny keybinding library | Vim-style shortcuts |
| Exolve | [viresh-ratnakar/exolve](https://github.com/viresh-ratnakar/exolve) | MIT | JavaScript | Static files | Active (commits) | v1.60 · 2025-02-18 | 95★ | Crossword player and constructor | ipuz/puz support |
| sudoku.js | [robatron/sudoku.js](https://github.com/robatron/sudoku.js) | MIT | JavaScript | Vendored file | Maintained-slow | none | 496★ | Sudoku generator/solver | Daily seeded puzzles |
| Crossword-Layout-Generator | [MichaelWehar/Crossword-Layout-Generator](https://github.com/MichaelWehar/Crossword-Layout-Generator) | MIT | JavaScript | npm | **Stale** (2025-04-21) | none | 86★ | Grid layout from word lists | News-term mini crosswords (vendor it) |
| react-crossword | [JaredReisinger/react-crossword](https://github.com/JaredReisinger/react-crossword) | MIT | TypeScript | npm | **Dormant** (2022-12-16 release) | v5.2.0 · 2022-12-16 | 225★ | React crossword component | Not needed with Exolve |
| recipe-scrapers | [hhursev/recipe-scrapers](https://github.com/hhursev/recipe-scrapers) | MIT | Python | PyPI | Active | 15.12.0 · 2026-08-08 | 2.2k★ · Scorecard 10 | Recipe extraction from 500+ sites | Recipes section (RX-12) |
| Mealie | [mealie-recipes/mealie](https://github.com/mealie-recipes/mealie) | AGPL-3.0 | Python, Vue | Docker | Active | v3.28.0 · 2026-09-24 | 13.5k★ | Recipe manager | Reference UI for recipes |

### 2.8 Infrastructure

| Product | URL | License | Languages | Self-host | Maintenance | Last release | Stars / signals | UVP | Key features |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Valkey | [valkey-io/valkey](https://github.com/valkey-io/valkey) | BSD-3-Clause | C | Docker | Active | 9.2.0-rc1 · 2026-09-16 | 27.4k★ | Linux Foundation Redis fork | Queues, cache, rate-limit store |
| BullMQ | [taskforcesh/bullmq](https://github.com/taskforcesh/bullmq) | MIT | TypeScript | npm | Active | npm 6.3.13 | 9.5k★ · Scorecard 10 | Redis/Valkey job queues | Flows, retries, rate limits |
| pg-boss | [timgit/pg-boss](https://github.com/timgit/pg-boss) | MIT | JavaScript | npm | Active | npm 12.37.1 | 4.0k★ · Scorecard 10 | Postgres job queue | `solo` profile without Valkey |
| Graphile Worker | [graphile/worker](https://github.com/graphile/worker) | MIT | TypeScript | npm | Active | v0.18.0 · 2026-09-08 | 2.4k★ · Scorecard 10 | LISTEN/NOTIFY job queue | Low-latency Postgres alternative |
| Drizzle ORM | [drizzle-team/drizzle-orm](https://github.com/drizzle-team/drizzle-orm) | Apache-2.0 | TypeScript | npm | Active | 0.45.4 · 2026-10-08 | 36.0k★ | Type-safe SQL ORM | pgvector column support |
| Meilisearch | [meilisearch/meilisearch](https://github.com/meilisearch/meilisearch) | MIT (CE) · BUSL-1.1 (EE parts) | Rust | Binary, Docker | Active | v1.53.x · 2026-10-07 | 59.5k★ · Scorecard 10 | Typo-tolerant hybrid search | Use Community Edition only |
| Typesense | [typesense/typesense](https://github.com/typesense/typesense) | GPL-3.0 | C++ | Binary, Docker | Active | v30.2 · 2026-04-19 | 26.8k★ | In-memory search with Raft HA | Separate service if chosen |
| ParadeDB | [paradedb/paradedb](https://github.com/paradedb/paradedb) | AGPL-3.0 | Rust | Postgres extension | Active | v0.26.1 · 2026-10-08 | 9.4k★ | BM25 inside Postgres | One-database hybrid search |
| Better Auth | [better-auth/better-auth](https://github.com/better-auth/better-auth) | MIT | TypeScript | npm | Active | v1.7.7 · 2026-09-30 | 30.2k★ | TS-first auth library | Passkeys, API keys, orgs plugins |
| Ory Kratos | [ory/kratos](https://github.com/ory/kratos) | Apache-2.0 | Go | Docker | Active | v26.2.0 · 2026-03-20 | 13.9k★ · Scorecard 10 | Identity server | Alternative for large instances |
| SimpleWebAuthn | [MasterKale/SimpleWebAuthn](https://github.com/MasterKale/SimpleWebAuthn) | MIT | TypeScript | npm | Active | v14.0.3 · 2026-09-25 | 2.4k★ · Scorecard 10 | WebAuthn helpers | Passkeys |
| Supabase Realtime | [supabase/realtime](https://github.com/supabase/realtime) | Apache-2.0 | Elixir | Docker | Active | v2.143.3 · 2026-10-09 | 7.6k★ · Scorecard 10 | Postgres change broadcast | Live Story updates |
| Centrifugo | [centrifugal/centrifugo](https://github.com/centrifugal/centrifugo) | Apache-2.0 | Go | Binary | Active | v6.9.7 · 2026-09-29 | 10.8k★ · Scorecard 10 | Scalable real-time messaging | Alternative to SSE at scale |
| SeaweedFS | [seaweedfs/seaweedfs](https://github.com/seaweedfs/seaweedfs) | Apache-2.0 | Go | Binary, Docker | Active | 4.48 · 2026-09-29 | 35.3k★ | S3-compatible storage | Audio, images, snapshots |
| Garage | [deuxfleurs-org/garage](https://github.com/deuxfleurs-org/garage) | AGPL-3.0 | Rust | Binary | Active | v2.4.1 · 2026-09-08 | 4.6k★ | Lightweight geo-distributed S3 | Low-RAM self-host |
| RustFS | [rustfs/rustfs](https://github.com/rustfs/rustfs) | Apache-2.0 | Rust | Binary | Active | RustFS 1.0.1 · 2026-10-03 | 34.4k★ | MinIO-compatible S3 | Watch: just reached 1.0 |
| MinIO | [minio/minio](https://github.com/minio/minio) | AGPL-3.0 | Go | Binary | **Archived** (pushed 2026-04-24) | 2025-10-15 security release | 61.3k★ | Former default S3 | Do not adopt |
| OpenTelemetry JS | [open-telemetry/opentelemetry-js](https://github.com/open-telemetry/opentelemetry-js) | Apache-2.0 | TypeScript | npm | Active | v2.12.0 · 2026-10-06 | 3.5k★ · Scorecard 10 | Vendor-neutral tracing | Queue-hop traces |
| Umami | [umami-software/umami](https://github.com/umami-software/umami) | MIT | TypeScript | Docker | Active | v3.4.0 · 2026-09-17 | 39.3k★ | Cookie-less analytics | Privacy-respecting metrics |
| Lago | [getlago/lago](https://github.com/getlago/lago) | AGPL-3.0 | Ruby, Go | Docker | Active | v1.55.0 · 2026-10-07 | 10.7k★ | Usage-based billing | Metered AI/audio minutes |
| Kill Bill | [killbill/killbill](https://github.com/killbill/killbill) | Apache-2.0 | Java | Docker | Active | 0.24.22 · 2026-09-29 | 5.8k★ · Scorecard 10 | Subscription billing | Permissive alternative to Lago |
| Ethical Ad Server | [readthedocs/ethical-ad-server](https://github.com/readthedocs/ethical-ad-server) | AGPL-3.0 | Python | Docker | Active | v6.1.2 · 2026-10-02 | 272★ | Privacy-first contextual ads | Sponsored cards (BIZ-03) |
| Revive Adserver | [revive-adserver/revive-adserver](https://github.com/revive-adserver/revive-adserver) | GPL-2.0 | PHP | Docker | Active | v6.0.8 · 2026-06-25 | 1.5k★ · Scorecard 10 | Classic ad server | Heavier alternative |

### 2.9 Domain data, civic & threat-intel components

| Product | URL | License | Languages | Self-host | Maintenance | Last release | Stars / signals | UVP | Key features |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| Open-Meteo | [open-meteo/open-meteo](https://github.com/open-meteo/open-meteo) | AGPL-3.0 (code) · CC-BY-4.0 (data) | Swift | Docker | Active | v1.6.0 · 2026-09-10 | 6.3k★ | Self-hostable weather API | Forecasts for PER-07 |
| Photon | [komoot/photon](https://github.com/komoot/photon) | Apache-2.0 | Java | Docker | Active | 1.3.0 · 2026-08-07 | 3.1k★ · Scorecard 10 | OSM geocoder | City-level location for local news |
| City Scrapers | [City-Bureau/city-scrapers](https://github.com/City-Bureau/city-scrapers) | MIT | Python | Scrapy | Active | none | 380★ | Municipal meeting scrapers | ING-13 civic sources |
| OSV.dev | [google/osv.dev](https://github.com/google/osv.dev) | Apache-2.0 | Go, Python | API + self-host | Active | v2026.10.07 | 3.0k★ · Scorecard 10 | Open vulnerability database | CVE enrichment, SBOM matching |
| OpenCTI | [OpenCTI-Platform/opencti](https://github.com/OpenCTI-Platform/opencti) | Apache-2.0 (CE) · EE separate | TypeScript, Python | Docker | Active | 7.261008.0 · 2026-10-09 | 10.1k★ · Scorecard 10 | CTI knowledge platform | STIX export target |
| MISP | [MISP/MISP](https://github.com/MISP/MISP) | AGPL-3.0 | PHP | Docker | Active | 2.5.50 · 2026-10-10 | 6.6k★ · Scorecard 10 | Threat-sharing platform | Event export target |
| stix2 (Python) | [oasis-open/cti-python-stix2](https://github.com/oasis-open/cti-python-stix2) | BSD-3-Clause | Python | PyPI | Maintained-slow | v3.0.2 · 2026-02-12 | 438★ | STIX 2.1 objects | Build STIX bundles |
| Domain quality ratings | [hauselin/domain-quality-ratings](https://github.com/hauselin/domain-quality-ratings) | No license file (README invites reuse; paper CC-BY-4.0) | CSV | n/a (data) | **Stale** repo (2023-09-14) | none | 31★ · peer-reviewed | Aggregate of multiple reliability rating sets | Open factuality prior (ML-04) |

### 2.10 Per-product notes (top 12)

**NewsBlur.** The closest single FOSS match to the developer half of the matrix: trainer, MCP server, CLI, REST API, and MIT license. It is a poor base for DUKRNews mainly for architectural reasons: Django + Celery + Mongo + Postgres + Redis + Elasticsearch drives the 2–4 GB self-host floor the source report cites. DUKRNews copies the **trainer UX** and **MCP tool shapes** instead of the stack.

**FreshRSS and Miniflux.** Both prove the value of the **Google Reader and Fever compatibility APIs**: they make every mature third-party client work on day one. DUKRNews should implement these APIs early (DEV-02). Miniflux's fuzzed Go parser (OpenSSF Scorecard reports Go fuzzers on its feed parser) is a good robustness bar for DUKR's parser tests.

**Folo.** The most-starred AI reader (39.1k★, AGPL-3.0). It validates demand for AI summaries, translation and digests inside RSS. It is not designed as a self-host-first product, which leaves DUKRNews's local-first, self-hostable AI stance differentiated.

**RSSHub and RSS-Bridge.** Rather than building adapters for feedless sites, run one of these as a sidecar. RSS-Bridge's **Unlicense** is the most permissive option. RSSHub has far more routes (46.4k★) but is AGPL-3.0, which is fine with DUKR's AGPL core.

**defuddle vs. readability vs. trafilatura.** Defuddle (9.6k★, released 2026-10-10) is the AI-era choice: it outputs Markdown and preserves code and math, which matters for daily.dev-style developer content. Readability is the stable fallback. Trafilatura (Python) is the strongest for date and metadata extraction and runs inside dukr-ml.

**pgvector.** pgvector is licensed under the PostgreSQL License (verified from the LICENSE text) and was released 2026-10-01. It lets clustering, search and relational joins live in one transactional store. That is why the blueprint avoids a separate vector database.

**LettuceDetect vs. HHEM vs. MiniCheck.** Particle's "Reality Check" can be reproduced with encoder-based grounding models. LettuceDetect (MIT, active) returns **unsupported spans**, which the UI can highlight. HHEM-2.1-open returns a single consistency score and makes a good cheap first pass. MiniCheck is now stale (last commit 2025-08-27); keep it only as an evaluation baseline.

**LiteLLM + Vercel AI SDK.** LiteLLM handles BYOAI routing, budgets and fallbacks as a proxy (MIT outside `enterprise/`). The AI SDK (Apache-2.0) gives typed `generateObject` calls in TypeScript. The two layers keep provider churn out of application code.

**Fedify.** Fedify 2.4.x (MIT, release 2026-10-11) is the only actively maintained TypeScript ActivityPub framework found. Ghost's ActivityPub service is built on it, and it was presented at FOSDEM 2026. `activitypub-express` is dormant (2024-02).

**Svix.** Svix is the only actively maintained, OSI-licensed (MIT) self-hostable webhook server among the three common options. Convoy's LICENSE is a proprietary agreement text (search summaries describe it as Elastic-2.0) and Hook0 is SSPL-1.0, so both are excluded.

**Kokoro family.** The Kokoro-82M weights (Apache-2.0) are the default TTS. The original repo is quiet (2025-08), but the runtime ecosystem is active: Kokoro-FastAPI (v0.9.0, 2026-09-10), kokoro-onnx, kokoro-js and sherpa-onnx. Piper's relicensing to GPL-3.0 under the Open Home Foundation makes it a separate-process-only option.

**Wikidata + Lin et al. ratings.** These are the open backbone of the media-literacy layer; see Section 4.

---

## 3. Version pins for the PoC (as observed 2026-10-12)

| Layer | Package | Version to pin | Note |
| :--- | :--- | :--- | :--- |
| Web | `@sveltejs/kit` | 3.0.x | Major version released 2026-10-06; check adapter compatibility |
| API | `fastify` | 5.x stable | 6.0 is alpha (v6.0.0-alpha.4) |
| Feeds | `feedsmith` | 3.0.1 | |
| Extraction | `defuddle` | 0.19.5 | Pre-1.0: pin exactly |
| Extraction fallback | `@mozilla/readability` | 0.6.0 | |
| Queue | `bullmq` | 6.3.x | Valkey 8/9 compatible |
| Auth | `better-auth` | 1.7.x | |
| AI | `ai` | 7.0.x | |
| MCP | `@modelcontextprotocol/sdk` | 1.32.x | |
| Federation | `@fedify/fedify` | 2.4.x | |
| Webhooks | `svix` | 2.8.x | |
| Rules | `@marcbachmann/cel-js` | 8.0.x | |
| Regex | `re2` | 1.27.x | |
| Vector | pgvector | 0.8.7 | `pgvector/pgvector:pg17` image |
| Grounding | `lettucedetect` | 0.2.3 | Pre-1.0: pin exactly |
| NER | `gliner` | 0.2.29 | |

---

## 4. Open media-literacy data (deep-dive thread)

The source report's Ground News features depend on ratings data. Research confirmed the leading rating providers are **not open**:

| Data need | Candidate | License / access | Coverage note | DUKR usage |
| :--- | :--- | :--- | :--- | :--- |
| Political lean (outlet) | AllSides ratings | Proprietary; licensed dataset/API | US-centric, widely cited | Optional licensed provider only |
| Political lean (outlet) | Media Bias/Fact Check | Proprietary; commercial API (RapidAPI noted) | Broad | Optional licensed provider only |
| Political lean (outlet) | Wikidata P1387 "political alignment" | CC0 | Sparse and uneven; many mainstream outlets lack statements | Default open signal, labelled with provenance |
| Reliability (outlet) | Lin et al. 2023 aggregate ratings (PNAS Nexus, doi 10.1093/pnasnexus/pgad286) | Paper CC-BY-4.0; repo has no license file but invites reuse; NewsGuard excluded | Thousands of domains, mostly English | Reliability prior; confirm terms with authors before commercial hosting |
| Ownership chain | Wikidata P127 "owned by", P749 "parent organization" | CC0 | Good for major outlets; weaker for local | ML-05 ownership chain |
| Fact-checks | ClaimReview via Google Fact Check Tools API; DataCommons | Free API (not FOSS); ClaimReview markup is an open schema | Depends on fact-checker participation | ML-09 dossier attachments |
| Story-level lean (text) | HF classifiers, e.g. `matous-volf/political-leaning-politics`, `bucketresearch/politicalBiasBERT` | Check each model card (not verified here) | Known out-of-distribution weakness | AI-12 fallback, labelled "model estimate" |
| Source registry | Kagi `kite-public` | MIT | Community-curated categories | Seed list for the 300-feed PoC |
| Coverage analytics | GDELT, Media Cloud | Open data / open source with metadata-only access | Global | Optional research integrations |

Recommendation: ship DUKRNews with **open data plus explicit provenance** and an "unrated" bucket shown honestly. Let instances plug in licensed providers. This is more transparent than Ground News's aggregation, though less complete out of the box.

---

## 5. Competing & complementary technologies

| # | Approach | Named players | Pros | Cons | DUKR stance |
| :---: | :--- | :--- | :--- | :--- | :--- |
| 1 | Fork one monolithic reader | NewsBlur, FreshRSS, Miniflux, Folo | Fastest to a working reader | Inherits stack limits; consensus/bias/federation are bolt-ons | Rejected; borrow UX and APIs |
| 2 | Micro-library composition on a Postgres core | This blueprint | Each capability swappable; one database | More integration work up front | **Chosen** |
| 3 | Static or serverless PWA aggregator | OpenWire, Meridian (Cloudflare) | Near-zero hosting cost | No server state, fragile CORS proxies, no community or federation | Rejected for core; good for a `lite` demo |
| 4 | JS-only ML (transformers.js, kokoro-js) | transformers.js, kokoro-js, Bergamot WASM | No Python; on-device privacy | Slower; fewer models (no LettuceDetect equivalent) | Use client-side for privacy features |
| 5 | Python ML sidecar | sentence-transformers, GLiNER, LettuceDetect, faster-whisper | Best model availability | Second runtime to operate | **Chosen** for server ML |
| 6 | Local LLM vs. BYOAI gateway vs. hosted API | Ollama, llama.cpp, vLLM / LiteLLM / provider SDKs | Local = private and free per token; BYOAI = quality on demand | Local quality ceiling; BYOAI cost risk | Local default + LiteLLM BYOAI |
| 7 | Encoder grounding vs. LLM-as-judge | LettuceDetect, HHEM / ragas, deepeval | Encoders are cheap and deterministic | Encoders are mostly English | Encoder at runtime; LLM-judge in nightly eval |
| 8 | Federation protocol | ActivityPub (Fedify), AT Protocol (@atproto), RSS/WebSub | AP reaches Mastodon/Threads/Lemmy; AT reaches Bluesky; RSS reaches readers | Three moderation models | AP first, RSS always, AT bridge P2 |
| 9 | Vector store | pgvector / sqlite-vec / dedicated vector DB | pgvector keeps joins and ACID | Dedicated DBs scale further | pgvector; revisit above ~50M items |

---

## 6. Parity gap & micro-library compositing

Integration effort tags: **drop-in** (configure and call), **thin wrapper** (adapter of under ~300 lines), **build-on-top** (meaningful product logic on top of the library).

| Gap (catalog IDs) | Open-source coverage today | Suggested micro-libraries (alternatives) | Integration effort |
| :--- | :--- | :--- | :--- |
| Feed parsing + OPML (ING-01, ING-03) | Complete | feedsmith · rss-parser · @extractus/feed-extractor · feed (output) | drop-in |
| WebSub push (ING-02) | Partial; no maintained Node library found | Custom subscriber/publisher endpoints validated with websub.rocks | thin wrapper |
| Feedless sites (ING-05) | Complete via sidecars | RSSHub · RSS-Bridge · changedetection.io · Crawlee + Playwright | drop-in (sidecar) |
| Newsletter inbox (ING-07) | Complete | smtp-server + mailparser · Kill the Newsletter (sidecar) | thin wrapper |
| Social/Fediverse sources (ING-08) | Complete | masto.js · @atproto/api · RSSHub social routes | thin wrapper |
| Publisher partner format (ING-10) | Gap: no FOSS ANF/SmartFormat | JSON Feed 1.1 extension + Schema.org `NewsArticle`; feedsmith for parsing | build-on-top |
| Podcasts (ING-11, RX-10) | Complete | Podcast Index API + feedsmith podcast namespace · faster-whisper · whisper.cpp · WhisperX | thin wrapper |
| Full-text extraction (AI-01) | Complete | defuddle · @mozilla/readability · trafilatura · newspaper4k | drop-in |
| Sanitization (AI-01, security) | Complete | DOMPurify (sanitize-html repo archived) | drop-in |
| Near-dup detection (AI-02) | Complete | datasketch MinHash · pgvector cosine | thin wrapper |
| Story clustering (AI-03) | Libraries complete; product logic missing | pgvector HNSW · hdbscan · BERTopic (labels) · fastembed or sentence-transformers | build-on-top |
| TL;DR + consensus synthesis (AI-04, AI-05) | Libraries complete | Vercel AI SDK · LiteLLM · Ollama · llama.cpp · vLLM | build-on-top |
| Reality Check grounding (AI-06) | Mostly complete (English) | LettuceDetect · HHEM-2.1-open · MiniCheck (baseline only) · ragas (eval) | thin wrapper |
| Story Q&A (AI-07) | Complete | pgvector retrieval + AI SDK · LlamaIndex (optional) | thin wrapper |
| Entities & CVEs (AI-08, AI-09) | Complete | GLiNER · spaCy · regex · OSV.dev API · stix2 · MISP/OpenCTI as targets | thin wrapper |
| Spam/quality demotion (AI-10) | Partial | Source-reputation table + datasketch duplicate-farm detection + Detoxify; no open SpamBrain equivalent | build-on-top |
| Translation (AI-11) | Complete | Argos Translate · LibreTranslate · Firefox Translations (client-side) | drop-in |
| Lean classifier (AI-12) | Partial (licenses vary) | HF lean classifiers (check cards) · Wikidata P1387 first | thin wrapper |
| Intelligence trainer (AI-13) | Gap as a library; pattern exists in NewsBlur | Custom weights table + scoring function (see [02 §6.2](02-dukrnews-poc-architecture-blueprint.md)) | build-on-top |
| Natural-language feed controls (AI-14) | Libraries complete | AI SDK `generateObject` → CEL rule; cel-js validates | build-on-top |
| Bias bar + Blindspot (ML-01, ML-02) | Data gap (Section 4) | Wikidata SPARQL · Lin et al. ratings · licensed-provider plugin interface | build-on-top |
| Opposite Sides (ML-03) | Libraries complete | Bias data + AI SDK framing diff + spaCy entity diff | build-on-top |
| Ownership (ML-05) | Complete (data CC0) | Wikidata Query Service (P127, P749) | thin wrapper |
| My News Bias on-device (ML-06) | Complete | Dexie.js · Svelte charts | thin wrapper |
| Browser overlay (ML-07) | Complete | WXT content scripts (Plasmo stale) | thin wrapper |
| Fact-check attachments (ML-09) | Partial (free API, not FOSS) | Google Fact Check Tools API · DataCommons ClaimReview | thin wrapper |
| Ranking feeds (PER-01 to PER-03) | Complete | SQL formulas; Gorse or implicit for opt-in For You | thin wrapper |
| Regex/keyword muting (PER-05) | Complete | node-re2 | drop-in |
| Local news & weather (PER-07) | Complete | Photon geocoder · Open-Meteo · City Scrapers | thin wrapper |
| REST API + docs (DEV-01) | Complete | Fastify · @fastify/swagger · @fastify/rate-limit · Better Auth api-key plugin | drop-in |
| GReader/Fever compat (DEV-02) | Pattern only (FreshRSS, Miniflux implement it) | Port endpoint shapes from Miniflux (Apache-2.0) | build-on-top |
| Rules engine (DEV-03) | Complete | @marcbachmann/cel-js · json-rules-engine · json-logic-engine | thin wrapper |
| Signed webhooks (DEV-04) | Complete | Svix server + SDK · Standard Webhooks libs | drop-in |
| BYOAI (DEV-05) | Complete | LiteLLM proxy budgets · sodium-native for key encryption | thin wrapper |
| MCP + IDE (DEV-06, DEV-07) | Complete | MCP TS SDK · MCP Python SDK | thin wrapper |
| CLI (DEV-08) | Complete | oclif | thin wrapper |
| Automation connectors (DEV-09) | Complete | Activepieces piece · Node-RED node · Huginn webhook agent (n8n via webhooks only) | thin wrapper |
| Real-time stream (DEV-12) | Complete | Fastify SSE · Supabase Realtime · Centrifugo | drop-in |
| Historical search (DEV-13) | Complete | Postgres FTS + pgvector · ParadeDB · Meilisearch CE · Typesense | drop-in |
| Threaded comments (COM-01) | Complete | Postgres `ltree` (native) · Remark42/Artalk if embedding | build-on-top |
| Voting, karma, invitations, mod log (COM-02, COM-06, COM-07) | Gap as libraries; patterns in Lobsters (BSD-3-Clause) | Port Lobsters logic; hash-chained log table | build-on-top |
| Annotations & team boards (COM-08) | Complete | Hypothesis client · Recogito text annotator | thin wrapper |
| Team newsletters (COM-09) | Complete | MJML · listmonk | drop-in |
| ActivityPub Magazines/Squads (FED-01 to FED-03) | Complete | Fedify (+ Postgres KV/MQ) | thin wrapper |
| Bluesky bridge (FED-04) | Complete | @atproto/api | thin wrapper |
| Feed outputs everywhere (FED-05) | Complete | feed · feedsmith | drop-in |
| Offline reading (RX-07) | Complete | vite-plugin-pwa · Workbox · Dexie.js · monolith (snapshots) | thin wrapper |
| Flip/magazine navigation (RX-04) | Complete | Swiper flip/cards effect (StPageFlip dormant) | drop-in |
| Keyboard shortcuts (RX-05) | Complete | tinykeys | drop-in |
| Narration & briefings (RX-08, RX-09) | Complete | Kokoro-FastAPI · kokoro-onnx · kokoro-js · sherpa-onnx · Piper (separate service) · Chatterbox (GPU) · howler.js | thin wrapper |
| Puzzles (RX-11) | Complete for players; generation partial | Exolve · sudoku.js · Crossword-Layout-Generator (vendor) | thin wrapper |
| Recipes (RX-12) | Complete | recipe-scrapers | drop-in |
| Extension + New Tab (RX-13) | Complete | WXT | thin wrapper |
| Mobile + desktop (RX-14, RX-15) | Complete | Capacitor · Tauri 2 | thin wrapper |
| Push, chat and email (NTF-01 to NTF-03) | Complete | web-push · ntfy · Apprise · MJML | drop-in |
| Billing, ads, revenue share (BIZ-02 to BIZ-04) | Partial (revenue-share logic custom) | Lago or Kill Bill · Ethical Ad Server · custom click/read-time ledger | build-on-top |
| Object storage | Complete (MinIO archived) | SeaweedFS · Garage · RustFS (1.0, young) | drop-in |
| Auth & passkeys | Complete | Better Auth · SimpleWebAuthn · Ory Kratos | drop-in |

**Remaining genuine gaps:** (1) open, comprehensive outlet bias/factuality data; (2) a FOSS SpamBrain-class quality model; (3) a maintained Node WebSub library; (4) non-English grounding models. None blocks the PoC; all are flagged in the [02 risk register](02-dukrnews-poc-architecture-blueprint.md).

---

## 7. Risks surfaced by research (counter-evidence angle)

* **Legal climate for AI summaries is tightening.** Search results report an appellate affirmance in *Thomson Reuters v. ROSS* (2026) that rejected fair use for a competing AI product, and a USA TODAY + 18-paper suit against OpenAI filed 2026-10-08 alleging market substitution and stripped attribution. These are single-source search summaries (see Section 9), but the direction supports DUKR's guardrails: short cited bullets, prominent links, publisher opt-out, no paywalled text in prompts.
* **Bias classifiers generalize poorly.** 2025–26 research summarized in search results notes out-of-distribution failures and LLM evaluators' own political lean. DUKR therefore ranks open outlet-level data above model estimates and labels the latter.
* **Dependency churn is real.** In the last 12 months: MinIO archived, Piper archived and relicensed, sanitize-html repo archived, Convoy's company reportedly wound down, TT-RSS upstream shut down (2025-11-01). The blueprint's "≥2 candidates per capability" rule addresses this.

---

## 8. Keep an eye on

| Name | URL | Why noteworthy | Signal / date observed |
| :--- | :--- | :--- | :--- |
| Folo | github.com/RSSNext/Folo | Leading AI-native FOSS reader; a benchmark for DUKR's AI UX | 39.1k★; Mobile v0.5.11 on 2026-10-02 · observed 2026-10-12 |
| RustFS | github.com/rustfs/rustfs | Apache-2.0 MinIO replacement just reached 1.0 | 1.0.1 on 2026-10-03; 34.4k★ · observed 2026-10-12 (search summary still called it alpha: conflict) |
| Fedify | fedify.dev | De facto TS ActivityPub framework; Ghost dependency | 2.4.3 on 2026-10-11; FOSDEM 2026 talk · observed 2026-10-12 |
| defuddle | github.com/kepano/defuddle | Extraction tuned for LLM pipelines | 0.19.5 on 2026-10-10; 9.6k★ · observed 2026-10-12 |
| LettuceDetect | github.com/KRLabsOrg/LettuceDetect | Open span-level hallucination detection | v0.2.3 on 2026-08-13; commits 2026-10-09 · observed 2026-10-12 |
| GLiNER | github.com/urchade/GLiNER | Zero-shot CPU NER for CTI and entities | v0.2.29 on 2026-09-08; "GLiNER2.5" reported Aug 2026 (single source) · observed 2026-10-12 |
| feedsmith | github.com/macieklamberski/feedsmith | Modern all-format feed parser | v3.0.1 on 2026-09-25 · observed 2026-10-12 |
| Kagi kite-public | github.com/kagisearch/kite-public | Open, community-curated news source registry | commits 2026-09-23; 1.1k★ · observed 2026-10-12 |
| PieFed | codeberg.org/rimu/pyfedi | Fast-growing threadiverse platform; FEP-1b12 interop target | Community reports of rapid growth · observed 2026-10-12 |
| Meridiano | github.com/lfzawacki/meridiano | Active fork of stale Meridian AI briefing engine | Fork activity reported in search · observed 2026-10-12 (not probed) |
| Better Auth | github.com/better-auth/better-auth | Core auth dependency; governance change reported | Reported Vercel acquisition July 2026 (single source); v1.7.7 on 2026-09-30 · observed 2026-10-12 |
| MCP licensing | github.com/modelcontextprotocol/typescript-sdk | SDK moving from MIT to Apache-2.0 | LICENSE text observed 2026-10-12 |
| SvelteKit 3 | github.com/sveltejs/kit | Major version affecting the web layer | 3.0.1 on 2026-10-06 · observed 2026-10-12 |
| Fastify 6 | github.com/fastify/fastify | Upcoming major for the API layer | v6.0.0-alpha.4 on 2026-09-17 · observed 2026-10-12 |
| Capacitor 9 | github.com/ionic-team/capacitor | Upcoming major for mobile shells | 9.0.0-alpha.8 on 2026-10-07 · observed 2026-10-12 |
| Crawlee v4 | github.com/apify/crawlee | Crawler major release candidate | v4.0.0-rc.1 on 2026-10-06 · observed 2026-10-12 |
| @atproto/lex | github.com/bluesky-social/atproto | New preferred type-safe AT Protocol client | Reported in search as preferred over @atproto/api · observed 2026-10-12 |
| sherpa-onnx | github.com/k2-fsa/sherpa-onnx | One on-device runtime for TTS + ASR across mobile | v1.13.8 on 2026-09-18; 15.2k★ · observed 2026-10-12 |
| Show HN AI readers (Glean, Feed2040, Ember, WyrmRSS) | news.ycombinator.com (Show HN) | New self-hosted AI RSS readers in 2026 | Show HN mentions via search; not probed · observed 2026-10-12 |

---

## 9. Single-source or unverified claims

| Claim | Where it appears | Status |
| :--- | :--- | :--- |
| Better Auth acquired by Vercel (July 2026) | Section 8 | Search summary only; repo still MIT |
| GLiNER2.5 release (Aug 2026) | Section 8 | Search summary only; GitHub shows v0.2.29 |
| Convoy's company wound down | Section 7 | Search summary only; repo shows releases through 2026-09-28 |
| RustFS "alpha" status | Section 8 | Contradicted by GitHub release RustFS 1.0.1 (2026-10-03) |
| *Thomson Reuters v. ROSS* appellate ruling and USA TODAY v. OpenAI suit | Section 7 | Search summary only; verify before external use |
| HHEM-2.1-open Apache-2.0 license | Section 2.3 | Search summary; confirm on model card |
| Lean-classifier model licenses | Section 4 | Not verified; check each model card |
| PieFed growth and license | Section 2.1 | Search summary; Codeberg not probed |
| Competitor features dated 2026 (Inoreader BYOAI, daily.dev API, Particle Radar) | [01](01-dukrnews-composite-feature-catalog.md) | Taken from the source report; not re-verified here |

---

## 10. Adjacent spaces worth a follow-up report

1. **Read-later & web archiving** (Wallabag, Readeck, Karakeep, SingleFile, monolith): could become DUKR's "save" backend.
2. **Civic and local-government data** (City Scrapers, Open Civic Data, Councilmatic): powers white-space #1, the local Fediverse news bridge.
3. **Threat-intelligence pipelines** (OpenCTI, MISP, OSV, CISA KEV): powers white-space #3, CVE-to-PR.
4. **Podcast indexes & players** (Podcast Index, AntennaPod, Podverse): needed for a full "Radar" equivalent.
5. **Metasearch & web search** (SearXNG, Marginalia): a search-as-source adapter.
6. **Newsletter publishing** (listmonk, Ghost): DUKR as a curation-to-newsletter tool.

---

## 11. Commercial reference (one paragraph, not requested)

Commercial pricing for the 12 competitors is already in the source report. The only commercial dependencies DUKRNews might *optionally* plug in are licensed bias and reliability data (AllSides dataset/API, MBFC API, NewsGuard), premium cloud voices for narration, hosted LLM providers through BYOAI keys, and the free Google Fact Check Tools API. None is required: every PoC capability runs on the FOSS stack above. Pricing for these optional providers was **not fetched** in this run and must be checked at integration time.

---

## 12. Sources

### 12.1 Verification endpoints (programmatic)

* deps.dev project API: `https://api.deps.dev/v3/projects/github.com%2F{owner}%2F{repo}`
* GitHub Atom feeds: `https://github.com/{owner}/{repo}/commits.atom`, `/releases.atom`, `/tags.atom`
* GitHub REST: `https://api.github.com/repos/{owner}/{repo}`
* npm registry: `https://registry.npmjs.org/{package}/latest`
* PyPI JSON: `https://pypi.org/pypi/{package}/json`
* Raw license files: `https://raw.githubusercontent.com/{owner}/{repo}/{branch}/LICENSE`
* Scratch artifacts: `scratch/dukrnews/repo_signals.json`, `repo_signals_pass2.json`, `gh_license.json`, `license_pass3.json`

### 12.2 Standards, data & reference URLs

* W3C ActivityPub: https://www.w3.org/TR/activitypub/
* W3C WebSub: https://www.w3.org/TR/websub/ · validator: https://websub.rocks
* FEP-1b12 Group federation: https://codeberg.org/fediverse/fep
* Standard Webhooks: https://www.standardwebhooks.com
* JSON Feed 1.1: https://www.jsonfeed.org/version/1.1/
* Schema.org NewsArticle and ClaimReview: https://schema.org/NewsArticle · https://schema.org/ClaimReview
* Wikidata Query Service: https://query.wikidata.org (P127, P749, P1387)
* Lin et al. 2023, PNAS Nexus: https://doi.org/10.1093/pnasnexus/pgad286 · https://www.domain-quality.info
* Google Fact Check Tools API: https://developers.google.com/fact-check/tools/api
* Podcast Index: https://podcastindex.org
* GDELT: https://www.gdeltproject.org · Media Cloud: https://www.mediacloud.org
* Fedify: https://fedify.dev
* Open-Meteo: https://open-meteo.com
* Hugging Face models: https://huggingface.co/vectara/hallucination_evaluation_model · https://huggingface.co/hexgrad/Kokoro-82M · https://huggingface.co/matous-volf/political-leaning-politics · https://huggingface.co/bucketresearch/politicalBiasBERT
* AllSides licensing: https://www.allsides.com · MBFC: https://mediabiasfactcheck.com
* Product URLs: see the URL column of every table in Section 2.

### 12.3 Search-query log (49 queries, run 2026-10-12)

1. best open source self-hosted RSS reader 2026 Miniflux FreshRSS Folo comparison
2. open source AI news aggregator multi-source summary clustering github 2026 (Kagi Kite OR Meridian OR "news briefing")
3. Tiny Tiny RSS shutdown 2025 fork status
4. open source link aggregator software Lemmy Lobsters Tildes Mbin Piefed 2026 self-hosted Hacker News clone
5. Fedify ActivityPub TypeScript framework 2026 release Ghost
6. open source webhook delivery service Svix Convoy Hook0 license self-hosted 2026
7. open source text-to-speech 2026 Kokoro Piper license GPL change Chatterbox MIT comparison
8. open media bias ratings dataset license AllSides CC BY-NC Media Bias Fact Check data github
9. Wikidata SPARQL media ownership newspaper "owned by" P127 news outlet dataset
10. LiteLLM vs Vercel AI SDK BYOK bring your own key multi-provider LLM gateway open source 2026
11. MiniCheck fact-checking grounding documents LLM hallucination detection open source model license
12. LibreTranslate Argos Translate Bergamot translations open source machine translation self-hosted 2026
13. Kagi News Kite open source github kite-public data repository
14. trafilatura vs mozilla readability vs defuddle article extraction 2026 benchmark open source
15. npm RSS Atom JSON Feed parser library 2026 feedsmith @rowanmanning/feed-parser rss-parser maintained
16. Gorse open source recommender system engine Go 2026 release
17. MinIO community edition maintenance mode 2025 alternative Garage SeaweedFS RustFS
18. WXT browser extension framework new tab MV3 2026 vs Plasmo maintained
19. Kill the Newsletter email to RSS open source self-hosted alternatives 2026
20. Hugging Face political bias classifier news article left center right model open license 2025 2026
21. Podcast Index API open podcast search transcription whisper.cpp faster-whisper 2026 self-hosted podcast transcript search
22. open source crossword sudoku word puzzle game JavaScript library daily puzzle generator MIT
23. Google Reader API Fever API compatibility self-hosted RSS server third-party clients Reeder NetNewsWire FreshRSS Miniflux
24. n8n Sustainable Use License vs Activepieces MIT Node-RED Huginn open source automation 2026
25. Redis 8 AGPL license Valkey 2026 adoption BullMQ Valkey compatible pg-boss Graphile Worker
26. Meilisearch vs Typesense vs ParadeDB pg_search license 2026 self-hosted full text search hybrid vector
27. Better Auth TypeScript authentication library 2026 passkeys API keys organizations plugin
28. Apprise notification library Slack Teams Discord 100 services ntfy self-hosted push 2026
29. open source billing subscription metering Lago Kill Bill 2026 license; EthicalAds open source ad server Revive Adserver
30. City Bureau city-scrapers open source municipal meeting agendas scraper; Open-Meteo self-hosted weather API license
31. GLiNER zero-shot named entity recognition 2026 Apache; CVE extraction threat intelligence open source news feed MISP OpenCTI connector RSS
32. self-hosted comment system open source 2026 Remark42 Isso Comentario threaded comments embed
33. Google Fact Check Tools API ClaimReview open data; Media Cloud open source news source collections; GDELT free news event data
34. Capacitor vs Tauri 2 mobile iOS Android SvelteKit 2026 production PWA offline Workbox
35. BERTopic online topic modeling news clustering HDBSCAN embeddings 2026; sqlite-vec pgvector HNSW news deduplication
36. RSSHub license AGPL 2026 routes; RSS-Bridge; changedetection.io license; Bluesky AT Protocol @atproto/api feed ingestion
37. Lin et al 2023 PNAS Nexus news domain quality ratings aggregate dataset github license
38. Wikidata "political alignment" P1387 newspapers news websites coverage query
39. dailydotdev apps daily-api github license AGPL open source
40. FEP-1b12 group federation ActivityPub Lemmy community actor Fedify Group actor followable magazine
41. feedsmith npm github repository author RSS Atom JSON Feed parser generator
42. LettuceDetect hallucination detection RAG MIT; Vectara HHEM-2.1-open Apache license hallucination evaluation model
43. kokoro-onnx thewh1teagle github; Kokoro-FastAPI remsky; kokoro-js npm 2026
44. cel-js Common Expression Language JavaScript TypeScript library 2026 maintained; json-logic-engine TotalTechGeek
45. open source crossword player JavaScript exolve guardian react-crossword csnx MIT license ipuz
46. WebSub hub open source self-hosted 2026 publisher subscriber node library websub.rocks
47. Show HN 2026 open source RSS reader OR news aggregator self-hosted AI
48. AI news summarization copyright lawsuit publishers 2025 2026 aggregator fair use ruling attribution
49. PieFed codeberg license AGPL 2026 release; Meridiano news briefing fork github

### 12.4 Inaccessible or not probed

* ecosyste.ms repository API returned HTTP 402 (Payment Required); replaced by deps.dev + GitHub Atom.
* Codeberg-hosted projects (PieFed) and Hugging Face model cards were not probed programmatically.
* `dailydotdev/daily-api` returned 404 on GitHub REST (repo may be private or renamed); deps.dev reported AGPL-3.0 and 466★.
* No Tavily tools, keys or credits were used.

