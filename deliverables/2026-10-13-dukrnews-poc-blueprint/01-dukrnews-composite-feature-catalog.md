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
