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
