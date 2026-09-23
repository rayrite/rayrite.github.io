# Awesome-Selfhosted FOSS Tools — Curated Shortlist

**Researched:** September 23, 2026
**Source list:** [awesome-selfhosted/awesome-selfhosted](https://github.com/awesome-selfhosted/awesome-selfhosted) (the `Software Development - IDE & Tools` anchor links into the master README that contains every category below).
**Scope:** A focused shortlist of FOSS tools for 65 product/development/operations categories. For each category I list 2-4 top picks drawn from the awesome-selfhosted index when available, and pair them with well-known adjacent FOSS tools that the awesome-selfhosted repo does not currently cover but that match the category intent.

> Each pick includes a short rationale ("why it made the list"), a primary URL, and license. Picks are biased toward (a) actively maintained projects with broad community traction, (b) tools that deploy via a single Docker container, and (c) tools with a low learning curve for a small team. When awesome-selfhosted has no entry, I lean on GitHub stars, release recency, and adjacent ecosystems (e.g., `awesome-llm-agents`, `awesome-rag`, `awesome-blender`).

---

## How to read this shortlist

| Symbol | Meaning |
| --- | --- |
| ★ | Top recommendation in this category |
| ⌬ | Honorable mention / niche alternative |
| 🐳 | Ships as a single Docker image |

When a category maps directly to an awesome-selfhosted section, the section header notes the source. When the category does not have a direct mapping, I note that and recommend external-but-still-FOSS tools.

---

## 2D and 3D Unity Game Asset Development

awesome-selfhosted has no game-asset category. The FOSS canon is dominated by Blender and the Godot/Unity asset ecosystems.

| Pick | Why |
| --- | --- |
| ★ **Blender** | The default for 2D/3D asset creation. GIMP, Krita, and TextureLab fill the 2D texture pipeline. ([blender.org](https://www.blender.org/)) `GPL-2.0` |
| ⌬ **GIMP / Krita / Inkscape** | The 2D side: raster painting, vector illustration, sprite sheet export. ([gimp.org](https://www.gimp.org/), [krita.org](https://krita.org/), [inkscape.org](https://inkscape.org/)) |
| ⌬ **Texconv / TextureLab** | Texture atlasing, compression (BCn/ASTC), and import-ready asset emission for Unity. |
| ⌬ **AssetStudio / UABE** | Inspect/extract from existing Unity asset bundles when porting or reverse-engineering reference art. |

## Blender 3D Asset Development and Automation

awesome-selfhosted has no Blender-specific category. Tools here come from the Blender add-on and broader Python automation ecosystems.

| Pick | Why |
| --- | --- |
| ★ **Blender Python API (`bpy`)** | First-class scripting; everything below plugs into it. ([docs.blender.org/api](https://docs.blender.org/api/current/index.html)) |
| ★ **BlenderKit (add-on, BSD)** | Massive CC0/CC-BY asset library directly inside Blender; tightens iteration for prototype work. ([blenderkit.com](https://www.blenderkit.com/)) |
| ⌬ **Stop-motion tools (Stop-Motion Studio, Cavalry)** | Free editions cover stylized pipelines. |
| ⌬ **Bforartists** | A Blender fork with a more designer-friendly UI for non-programmers. ([bforartists.com](https://www.bforartists.com/)) `GPL-2.0` |

## Unity3D Editor Automation

awesome-selfhosted has no Unity-specific category. Use Unity Editor scripting plus the broader automation platforms below.

| Pick | Why |
| --- | --- |
| ★ **Unity Test Framework + CI helpers (`game-ci/unity-test-runner`)** | GitHub Actions runner that headless-runs Unity tests in Docker — the de-facto automation pipeline. ([github.com/game-ci](https://github.com/game-ci)) |
| ★ **Unity Asset Bundle Browser + Addressables** | Editor-side automation for asset streaming, preloading, and build budgets. |
| ⌬ **Roslyn analyzers / `Unity.Analyzers`** | Editor-time lint of your C# scripts so broken code never makes it past a PR. |
| ⌬ **Wakatime + Wakapi** | Coding-time tracking that supports Unity Editor sessions. ([wakapi.dev](https://wakapi.dev/)) `GPL-3.0` |

## Agent Skills Marketplace Lookups, Agent Skill Creation, Agent Skill Discovery

awesome-selfhosted does not cover agent skills; this is an emerging category outside its scope. The closest analogues are MCP server catalogs and skill registries.

| Pick | Why |
| --- | --- |
| ★ **Mavis Skills (formerly Mavis Skills)** | Bundles discovery, creation, and refinement of agent skills. ([github.com/MiniMax-AI/Mavis](https://github.com/MiniMax-AI/Mavis)) |
| ★ **MCP Servers registry** | The protocol-level catalog for connecting agents to tools. ([modelcontextprotocol.io](https://modelcontextprotocol.io/)) |
| ⌬ **awesome-claude-skills / awesome-mcp-servers** | Community-curated index lists for discovery. |
| ⌬ **OpenSkills** | Open skills registry / metadata standard (if/when one stabilizes). |

## Analytics (web/product analytics)

awesome-selfhosted `Analytics` section. ([source](https://github.com/awesome-selfhosted/awesome-selfhosted#analytics))

| Pick | Why |
| --- | --- |
| ★ **Plausible 🐳** | Cookie-free, lightweight, single-binary Go + ClickHouse. The default "drop-in for GA" pick. `AGPL-3.0` |
| ★ **Umami 🐳** | Similar lightweight footprint to Plausible, Next.js + ClickHouse, broader language SDKs. `MIT` |
| ⌬ **Matomo 🐳** | The "keep-everything" option with heatmaps, sessions, and funnels. `GPL-3.0` |
| ⌬ **Open Web Analytics 🐳** | PHP+MySQL alternative to Matomo with simpler hosting requirements. `GPL-2.0` |

## Asynchronous Software Development and Operations

awesome-selfhosted has no direct category. This maps to a mix of communication + automation + runbook tooling.

| Pick | Why |
| --- | --- |
| ★ **Windmill 🐳** | Self-hostable async workflow engine — turns scripts into scheduled/queued jobs. ([windmill.dev](https://www.windmill.dev/)) `AGPL-3.0` |
| ★ **n8n 🐳** | Node-based async workflow orchestrator; queues, retries, webhooks. ([n8n.io](https://n8n.io/)) `Sustainable Use` |
| ⌬ **Apache Airflow 🐳** | DAG-based scheduler for data/ops pipelines. ([airflow.apache.org](https://airflow.apache.org/)) `Apache-2.0` |
| ⌬ **Hatchet 🐳** | TypeScript-native durable execution engine for async backends. ([hatchet.run](https://hatchet.run/)) `MIT` |

## Autonomous Away-From-Keyboard Workflows

awesome-selfhosted has no direct category. Most relevant tools are coding-agent orchestrators and runbooks.

| Pick | Why |
| --- | --- |
| ★ **n8n + AI agents** | Browser/queue/email triggers with AI-agent steps for "wake up, fix, report". |
| ★ **Activepieces 🐳** | Drag-and-drop AFK automation builder with AI steps. ([activepieces.com](https://www.activepieces.com/)) `MIT` |
| ⌬ **Temporal 🐳** | Workflow engine that survives crashes for multi-day AFK jobs. ([temporal.io](https://temporal.io/)) `MIT` |
| ⌬ **Trigger.dev 🐳** | Long-running TypeScript jobs with retries and observability. ([trigger.dev](https://trigger.dev/)) `MIT` |

## Automation (workflows, scrapers)

awesome-selfhosted `Automation` section.

| Pick | Why |
| --- | --- |
| ★ **n8n 🐳** | The most-popular node-based workflow runner; 400+ integrations. `Sustainable Use` |
| ★ **Activepieces 🐳** | TypeScript-based workflow runner with a friendlier UI; growing library. `MIT` |
| ⌬ **Windmill 🐳** | Code-first (Python/TypeScript/Bash) workflows — best when you outgrow n8n's nodes. `AGPL-3.0` |
| ⌬ **Apache Airflow 🐳** | DAG scheduler for data-heavy automation. `Apache-2.0` |
| ⌬ **Huginn 🐳** | The original "agents that watch the web and act"; Ruby-based, very mature. ([github.com/huginn/huginn](https://github.com/huginn/huginn)) `MIT` |

## Backend Development — PostgreSQL + Fastify + Node.js

awesome-selfhosted does not have a Node/Fastify stack category. Self-hosted equivalents of Supabase/Firebase exist via PostgREST, but the underlying Postgres ecosystem is the real differentiator.

| Pick | Why |
| --- | --- |
| ★ **PostgreSQL 16** | The default for serious Node backends. ([postgresql.org](https://www.postgresql.org/)) `PostgreSQL` |
| ★ **PostgREST 🐳** | Turns a Postgres schema into a REST API in one container — the FOSS answer to Supabase auto-generated APIs. ([postgrest.org](https://postgrest.org/)) `MIT` |
| ★ **Fastify** | The default high-performance Node.js HTTP framework. ([fastify.dev](https://fastify.dev/)) `MIT` |
| ⌬ **PgBouncer / pgcat** | Connection pooling, mandatory for serverless or high-concurrency Node apps. |
| ⌬ **TimescaleDB / pgvector / PostGIS** | Postgres extensions that double as the search/vector/geo backend — no extra service. |

## Backend Development — Supabase / Real-Time Communications

awesome-selfhosted has Supabase itself (open-core) plus real-time options under Communication.

| Pick | Why |
| --- | --- |
| ★ **Supabase (self-hosted Docker)** | Full Postgres+Auth+Storage+Realtime in one platform; AGPL/FOSS Community Edition. ([supabase.com/docs/guides/self-hosting](https://supabase.com/docs/guides/self-hosting)) `Apache-2.0` |
| ★ **NATS (messaging) 🐳** | Self-hostable, low-latency pub/sub for real-time backends. ([nats.io](https://nats.io/)) `Apache-2.0` |
| ⌬ **PostgREST + Socket.IO + pgvector** | Hand-rolled Supabase-substitute on free components. |
| ⌬ **Centrifugo 🐳** | Real-time messaging server on top of any backend (Postgres/Redis). ([centrifugo.io](https://centrifugo.io/)) `Apache-2.0` |
| ⌬ **Liveblocks / Soketi (Pusher-compatible)** | WebSocket infra for real-time UIs. |

## Backup / Revision Management

awesome-selfhosted `Backup` section.

| Pick | Why |
| --- | --- |
| ★ **Restic 🐳** | Encrypted, deduplicated, S3-compatible backups; the de-facto FOSS standard. ([restic.net](https://restic.net/)) `BSD-2-Clause` |
| ★ **BorgBackup 🐳** | Encrypted deduplicated backups with pruning/retention policies; mature companion to Restic. ([borgbackup.readthedocs.io](https://borgbackup.readthedocs.io/)) `BSD-3-Clause` |
| ⌬ **Kopia 🐳** | Modern GUI + policy-based backup/restore with end-to-end encryption. ([kopia.io](https://kopia.io/)) `Apache-2.0` |
| ⌬ **Duplicati 🐳** | Web-UI backup with broad storage backend support. `LGPL-2.1` |
| ⌬ **Pika Backup 🐳** | GNOME-friendly GUI on top of Restic for desktop users. ([apps.gnome.org/Pika](https://apps.gnome.org/Pika/)) `GPL-3.0` |

## Browser Control / Browser Automation / Android Emulator Control

awesome-selfhosted has no equivalent. FOSS tools here are largely from Playwright/Puppeteer ecosystems plus Android dev tooling.

| Pick | Why |
| --- | --- |
| ★ **Playwright** | Cross-browser automation (Chromium/Firefox/WebKit) with a single API and a UI inspector. ([playwright.dev](https://playwright.dev/)) `Apache-2.0` |
| ★ **Selenium Grid 🐳** | The original browser-automation fleet; mature and battle-tested. ([selenium.dev](https://www.selenium.dev/)) `Apache-2.0` |
| ⌬ **Puppeteer / PuppeteerSharp** | Chrome automation for JS and .NET teams. |
| ⌬ **Appium 🐳** | The leading open-source mobile automation server for Android (and iOS). ([appium.io](https://appium.io/)) `Apache-2.0` |
| ⌬ **scrcpy** | FOSS Android screen mirroring/control from your desktop. ([github.com/Genymobile/scrcpy](https://github.com/Genymobile/scrcpy)) `Apache-2.0` |

## Bug Reports and Issue Tracking

awesome-selfhosted `Ticketing` section.

| Pick | Why |
| --- | --- |
| ★ **Zammad 🐳** | Modern helpdesk + ticketing with email, chat, and Telegram bridges. `AGPL-3.0` |
| ★ **FreeScout 🐳** | Lightweight PHP-based shared mailbox; ideal for solo/small teams. `AGPL-3.0` |
| ⌬ **GlitchTip 🐳** | Sentry-compatible error tracker — drop-in for monitoring bugs. `MIT` |
| ⌬ **OTOBO 🐳** | OTRS successor; enterprise-grade ITSM ticketing. `GPL-3.0` |
| ⌬ **MantisBT** | Classic LAMP bug tracker still widely deployed. `GPL-2.0` |

## Code Reviews

awesome-selfhosted `Software Development - Project Management` section (forges) + cross-cutting tools.

| Pick | Why |
| --- | --- |
| ★ **Forgejo 🐳** | Gitea fork with federated code review + issue tracker + package registry. `MIT` |
| ★ **GitLab CE 🐳** | The all-in-one forge with merge requests, CI, registry, and security scans. `MIT` |
| ⌬ **OneDev 🐳** | Self-hostable Git server with deep PR review, kanban, and CI. `MIT` |
| ⌬ **Gerrit 🐳** | The original Git code-review server (used by Android, LibreOffice). `Apache-2.0` |
| ⌬ **Review Board** | General-purpose reviewer for Git, Mercurial, Perforce, and SVN. `MIT` |

## Communication — Custom Communication Systems (chat, notifications)

awesome-selfhosted `Communication - Custom Communication Systems` section.

| Pick | Why |
| --- | --- |
| ★ **Element (Matrix Synapse) 🐳** | The reference Matrix homeserver; federated, E2EE, bridges to Slack/WhatsApp/IRC. ([element.io](https://element.io/)) `Apache-2.0` |
| ★ **Mattermost 🐳** | Slack-compatible chat with strong self-hosting story. `AGPL-3.0` |
| ★ **Rocket.Chat 🐳** | Mature chat platform with omnichannel routing (WhatsApp, SMS, email). `MIT` |
| ⌬ **Ntfy 🐳** | Lightweight push-notification server (HTTP, no account). ([ntfy.sh](https://ntfy.sh/)) `Apache-2.0` |
| ⌬ **Apprise / Gotify** | Multi-channel notification router. |

## Communication — Social Networks and Forums

awesome-selfhosted `Communication - Social Networks and Forums` section.

| Pick | Why |
| --- | --- |
| ★ **Lemmy 🐳** | Federated Reddit alternative on ActivityPub. `AGPL-3.0` |
| ★ **Mastodon 🐳** | The dominant federated Twitter alternative. `AGPL-3.0` |
| ★ **Discourse 🐳** | Modern forum with first-class moderation, SSO, and webhooks. `GPL-2.0` |
| ⌬ **NodeBB 🐳** | Real-time Node.js forum with strong plugin ecosystem. `GPL-3.0` |
| ⌬ **Flarum 🐳** | Lightweight PHP forum with a modern UI. `MIT` |

## Customer Relationship Management (CRM)

awesome-selfhosted `Customer Relationship Management (CRM)` section.

| Pick | Why |
| --- | --- |
| ★ **EspoCRM 🐳** | Extensible PHP/MySQL CRM with sales pipeline, calendar, and portal. ([espocrm.com](https://www.espocrm.com/)) `AGPL-3.0` |
| ★ **Twenty 🐳** | Modern, Notion-style CRM built on NestJS + Postgres. ([twenty.com](https://twenty.com/)) `AGPL-3.0` |
| ⌬ **SuiteCRM 🐳** | The SugarCRM community fork; feature-rich enterprise CRM. ([suitecrm.com](https://suitecrm.com/)) `AGPL-3.0` |
| ⌬ **Monica 🐳** | Lightweight personal-relationship CRM (great for freelancers). `AGPL-3.0` |

## Content Resource Management and Version Control

awesome-selfhosted `Static Site Generators` + `Wikis` + `Content Management Systems (CMS)` sections.

| Pick | Why |
| --- | --- |
| ★ **Git + Forgejo/Gitea/SourceHut** | The default for version control of any content asset. |
| ★ **Astro 🐳** | Modern SSG with islands of interactivity; perfect for docs/marketing sites. ([astro.build](https://astro.build/)) `MIT` |
| ⌬ **Docusaurus / MkDocs / mdBook** | Docs-focused static generators with versioning. |
| ⌬ **WordPress 🐳** | Still the largest FOSS CMS in the world for content-heavy sites. `GPL-2.0` |
| ⌬ **Directus 🐳** | Headless CMS + REST/GraphQL layer on top of a database. ([directus.io](https://directus.io/)) `BSD-3-Clause` |

## Database Management

awesome-selfhosted `Database Management` section.

| Pick | Why |
| --- | --- |
| ★ **PostgreSQL + pgAdmin 🐳** | Default relational database + the de-facto UI. `Postgres / PostgreSQL` |
| ★ **Bytebase 🐳** | "GitHub for databases" — schema review, change management, audit. ([bytebase.com](https://www.bytebase.com/)) `Elastic-2.0` |
| ⌬ **Adminer 🐳** | The single-file PHP replacement for phpMyAdmin. `Apache-2.0` |
| ⌬ **DBeaver CE** | Cross-platform desktop client for every DB. `Apache-2.0` |
| ⌬ **NocoDB / Beekeeper Studio** | Airtable-like UI on top of Postgres/MySQL/SQLite. `AGPL-3.0` |

## Data Conversion / Structured Data Formatting / Classification

awesome-selfhosted has no direct category. Tools here come from data-engineering ecosystems.

| Pick | Why |
| --- | --- |
| ★ **DuckDB** | In-process analytical SQL engine; perfect for converting CSV/JSON/Parquet at the edge. ([duckdb.org](https://duckdb.org/)) `MIT` |
| ★ **dbt-core + dbt-postgres** | SQL-based transformation framework with tests + docs. ([getdbt.com](https://www.getdbt.com/)) `Apache-2.0` |
| ⌬ **Apache Superset / Metabase** | BI on top of the transformed data. |
| ⌬ **Pandas / Polars (Python libraries)** | Classification, aggregation, normalization. `BSD-3-Clause` |
| ⌬ **jq / Miller (mlr)** | CLI tools for JSON/CSV processing at the shell. |

## Debugging

awesome-selfhosted `Software Development - Testing` + monitoring sections.

| Pick | Why |
| --- | --- |
| ★ **GlitchTip 🐳** | Sentry-compatible error tracking — the canonical self-hosted debugger. `MIT` |
| ★ **OpenObserve 🐳** | Logs/metrics/traces in one Rust binary; ideal for finding the why. ([openobserve.ai](https://openobserve.ai/)) `AGPL-3.0` |
| ⌬ **SigNoz 🐳** | OpenTelemetry-native APM alternative to DataDog. ([signoz.io](https://signoz.io/)) `MIT` |
| ⌬ **HyperDbg / WinDbg / gdb + rr** | For kernel/low-level debugging. |

## Diagramming and Visualization

awesome-selfhosted has no direct category. Best tools are mostly SaaS-flavored or desktop apps.

| Pick | Why |
| --- | --- |
| ★ **draw.io (diagrams.net) 🐳** | The free, self-hostable diagramming tool — flows, ER, network, UML. ([github.com/jgraph/drawio](https://github.com/jgraph/drawio)) `Apache-2.0` |
| ★ **Mermaid** | Markdown-style text-to-diagrams; renders in GitHub/MkDocs/Obsidian. ([mermaid.js.org](https://mermaid.js.org/)) `MIT` |
| ⌬ **Excalidraw** | Hand-drawn-style whiteboard; self-hostable. ([excalidraw.com](https://excalidraw.com/)) `MIT` |
| ⌬ **PlantUML / Kroki** | Text-to-diagram server for many renderers. |
| ⌬ **Graphviz** | Classic DOT-language graph renderer. `CPL-1.0` |

## Document Management — Integrated Library Systems (ILS)

awesome-selfhosted `Document Management - Integrated Library Systems (ILS)` section.

| Pick | Why |
| --- | --- |
| ★ **Koha 🐳** | The leading FOSS library automation system (used by thousands of libraries). ([koha-community.org](https://koha-community.org/)) `GPL-3.0` |
| ★ **Evergreen 🐳** | Massively scalable ILS for consortia (used by state-wide networks). ([evergreen-ils.org](https://evergreen-ils.org/)) `GPL-2.0` |
| ⌬ **Omeka S / Omeka Classic** | For digital collections / archives. `GPL-3.0` |
| ⌬ **Archivematica 🐳** | OAIS-compliant digital preservation pipeline. `AGPL-3.0` |

## Federated Identity & Authentication

awesome-selfhosted `Federated Identity & Authentication` section (and SSO/Auth apps under Authentication & SSO proxies).

| Pick | Why |
| --- | --- |
| ★ **Authentik 🐳** | Modern IdP with OAuth2/OIDC/SAML, LDAP, and a great admin UI. ([goauthentik.io](https://goauthentik.io/)) `MIT` |
| ★ **Keycloak 🐳** | The enterprise-grade OIDC/SAML IdP from Red Hat. ([keycloak.org](https://www.keycloak.org/)) `Apache-2.0` |
| ⌬ **Authelia 🐳** | Lightweight SSO/2FA reverse-proxy authenticator. `Apache-2.0` |
| ⌬ **Kanidm 🐳** | Modern Rust-native IdP with webauthn + passkeys. `MPL-2.0` |
| ⌬ **Zitadel 🐳** | Cloud-native identity platform with API-first design. `Apache-2.0` |

## Feed Readers (RSS)

awesome-selfhosted `Feed Readers` section.

| Pick | Why |
| --- | --- |
| ★ **FreshRSS 🐳** | The lightweight self-hosted RSS reader (PHP). ([freshrss.org](https://www.freshrss.org/)) `AGPL-3.0` |
| ★ **Miniflux 🐳** | Go-native minimalist reader with a beautiful UI and Fever-compatible API. ([miniflux.app](https://miniflux.app/)) `Apache-2.0` |
| ⌬ **RSSHub 🐳** | Generates RSS feeds from sites that don't offer them. ([rsshub.app](https://docs.rsshub.app/)) `MIT` |
| ⌬ **CommaFeed** | Java-based clone of Feedly. `BSD-3-Clause` |

## Generative AI (categorization, summarization)

awesome-selfhosted `Generative Artificial Intelligence (GenAI)` section.

| Pick | Why |
| --- | --- |
| ★ **Ollama 🐳** | One-binary local model runner for Llama 3, Mistral, Phi, etc. ([ollama.com](https://ollama.com/)) `MIT` |
| ★ **Open WebUI 🐳** | Best-in-class ChatGPT-style UI for Ollama + OpenAI-compatible APIs. ([openwebui.com](https://openwebui.com/)) `BSD-3-Clause` |
| ⌬ **LibreChat 🐳** | Multi-model chat UI with agents, code interpreter, plugins. ([librechat.ai](https://librechat.ai/)) `MIT` |
| ⌬ **AnythingLLM 🐳** | Desktop-grade RAG UI for documents and vector stores. `MIT` |
| ⌬ **Langfuse 🐳** | Tracing + eval for production LLM apps. `MIT` |

## Knowledge Management Tools (KB / RAG / GraphRAG)

awesome-selfhosted `Knowledge Management Tools` section.

| Pick | Why |
| --- | --- |
| ★ **BookStack 🐳** | Wiki/docs/KB in a book-like UI; ideal for internal support KBs. ([bookstackapp.com](https://www.bookstackapp.com/)) `MIT` |
| ★ **Outline 🐳** | Modern, Notion-style team wiki with great editor UX. ([getoutline.com](https://www.getoutline.com/)) `BSL-1.1` (community build) |
| ★ **TriliumNext Notes 🐳** | Hierarchical personal knowledge base with scripting + graph views. `AGPL-3.0` |
| ⌬ **Wiki.js 🐳** | Git-backed Markdown wiki. `AGPL-3.0` |
| ⌬ **Docmost 🐳** | Confluence alternative built on NestJS + Y.js. `AGPL-3.0` |

## Context Memory Management and RAG Pipelines

awesome-selfhosted has no direct category. RAG is dominated by LangChain/LlamaIndex-style frameworks.

| Pick | Why |
| --- | --- |
| ★ **AnythingLLM 🐳** | Desktop/hosted RAG UI with multi-vector-store support (LanceDB, pgvector, Chroma). `MIT` |
| ★ **RAGFlow 🐳** | Open-source RAG engine with deep document parsing (PDF/tables). ([ragflow.io](https://ragflow.io/)) `Apache-2.0` |
| ⌬ **LangChain / LlamaIndex (Python libs)** | Frameworks for assembling RAG/graphRAG pipelines. |
| ⌬ **Qdrant / Milvus / Weaviate 🐳** | Self-hostable vector databases. |
| ⌬ **Neo4j / Memgraph 🐳** | Graph databases for GraphRAG. |

## Linux Bash Shell Scripting

Not a self-hosted software, but these companion tools make Bash scripting safer/more productive.

| Pick | Why |
| --- | --- |
| ★ **Bash + shellcheck** | The canonical Bash linter; required for any serious shell work. ([shellcheck.net](https://www.shellcheck.net/)) `GPL-3.0` |
| ★ **shfmt** | Opinionated Bash formatter; pairs with shellcheck. ([github.com/mvdan/sh](https://github.com/mvdan/sh)) `BSD-3-Clause` |
| ⌬ **Bashly** | Ruby gem that generates full Bash CLI scaffolding from a YAML spec. ([bashly.dbrgn.info](https://bashly.dbrgn.info/)) `MIT` |
| ⌬ **Argbash** | Generates `getopt`-based argument parsing. ([argbash.io](https://argbash.io/)) `BSD-2-Clause` |
| ⌬ **Atuin 🐳** | Encrypted, searchable shell history with sync. ([atuin.sh](https://atuin.sh/)) `MIT` |

## Maps and GPS (hyperlocal geolocation)

awesome-selfhosted `Maps and Global Positioning System (GPS)` section.

| Pick | Why |
| --- | --- |
| ★ **OpenStreetMap + Nominatim** | The data + geocoder foundation for any hyperlocal app. `ODbL / GPL-2.0` |
| ★ **GraphHopper / OSRM** | Routing engines for turn-by-turn or isochrone APIs. `Apache-2.0 / BSD-2-Clause` |
| ⌬ **TileServer GL** | Drop-in map-tile server for Mapbox/Leaflet/OpenLayers. `BSD-2-Clause` |
| ⌬ **NextGIS Web** | Full web-GIS server with QGIS collaboration. `GPL-3.0` |
| ⌬ **Dawarich 🐳** | Self-hosted Google-Timeline-style location history viewer. `AGPL-3.0` |

## Marketing and Promotion — outreach, press kits, app store assets

awesome-selfhosted has no direct category. Marketing tooling is fragmented across design, scheduling, and analytics.

| Pick | Why |
| --- | --- |
| ★ **Penpot 🐳** | Figma-style open-source design tool — perfect for press kits and app-store creative. ([penpot.app](https://penpot.app/)) `MPL-2.0` |
| ★ **Inkscape / GIMP / Krita** | Vector + raster graphics for ad creative. `GPL-2.0 / GPL-3.0` |
| ⌬ **Mastodon / Matrix (ActivityPub)** | Federated channels for organic outreach. |
| ⌬ **Listmonk 🐳** | Self-hosted newsletter + email-campaign manager. ([listmonk.app](https://listmonk.app/)) `AGPL-3.0` |
| ⌬ **Keila 🐳** | Newsletter tool with Elixir + Phoenix. `MIT` |

## Media Management (audio, image, video processing)

awesome-selfhosted `Media Management` section.

| Pick | Why |
| --- | --- |
| ★ **yt-dlp + MeTube / yt-dlp Web UI 🐳** | De-facto FOSS media downloader with 1500+ site support. `Unlicense / MPL-2.0` |
| ★ **HandBrake / FFmpeg** | Transcoding workhorses for any media pipeline. (`LGPL-2.1` / `LGPL-3.0`) |
| ⌬ **Sonarr / Radarr / Lidarr 🐳** | "The *arr stack" — automatic TV/movie/music management. `GPL-3.0` |
| ⌬ **ImageMagick / libvips** | CLI image-processing engines. |
| ⌬ **Lingarr 🐳** | Self-hosted subtitle translation with LibreTranslate/local LLMs. `AGPL-3.0` |

## Monitoring & Status Pages

awesome-selfhosted `Monitoring & Status Pages` section + adjacent observability ecosystem.

| Pick | Why |
| --- | --- |
| ★ **Uptime Kuma 🐳** | The default self-hosted status-page + monitor; 100+ probe types. ([github.com/louislam/uptime-kuma](https://github.com/louislam/uptime-kuma)) `MIT` |
| ★ **Beszel 🐳** | Lightweight server + Docker metrics dashboard. ([beszel.dev](https://beszel.dev/)) `MIT` |
| ⌬ **Checkmk 🐳** | Enterprise-grade monitoring with auto-discovery. `GPL-2.0` |
| ⌬ **GlitchTip 🐳** | Sentry-compatible error tracking. `MIT` |
| ⌬ **SigNoz / OpenObserve** | OpenTelemetry-native observability stacks. |

## Observability — Coding Agent Observability and Orchestration

awesome-selfhosted has no direct category. Newer tools live in the LLM/dev-tool ecosystem.

| Pick | Why |
| --- | --- |
| ★ **Langfuse 🐳** | Tracing, prompt mgmt, and eval for LLM apps (also fits GenAI section). `MIT` |
| ★ **OpenLLMetry / OpenTelemetry-GenAI** | Vendor-neutral instrumentation standard for agent calls. |
| ⌬ **Arize Phoenix 🐳** | Open-source LLM observability with drift/eval. `Apache-2.0` |
| ⌬ **Opik 🐳** | Comet ML's eval/test observability suite. `Apache-2.0` |
| ⌬ **Helicone 🐳** | LLM-proxy logs/caches/evals. `Apache-2.0` |

## Password Managers (vault)

awesome-selfhosted `Password Managers` section.

| Pick | Why |
| --- | --- |
| ★ **Vaultwarden 🐳** | Rust reimplementation of the Bitwarden server API; lightweight and compatible with every Bitwarden client. ([github.com/dani-garcia/vaultwarden](https://github.com/dani-garcia/vaultwarden)) `GPL-3.0` |
| ★ **Passbolt 🐳** | Team-oriented password manager with role-based sharing. `AGPL-3.0` |
| ⌬ **Bitwarden (official) 🐳** | The reference self-hosted vault. `AGPL-3.0` |
| ⌬ **AliasVault 🐳** | E2EE vault with built-in email-alias generator. `MIT` |

## Personal Dashboards (KPI dashboard)

awesome-selfhosted `Personal Dashboards` section.

| Pick | Why |
| --- | --- |
| ★ **Dashy 🐳** | Feature-rich homelab dashboard with 50+ widgets. ([dashy.to](https://dashy.to/)) `MIT` |
| ★ **Homepage by gethomepage 🐳** | Modern, fast dashboard with Docker/service auto-discovery. `GPL-3.0` |
| ⌬ **Glance 🐳** | Customizable feed-aggregation dashboard. `AGPL-3.0` |
| ⌬ **Homarr 🐳** | Sleek dashboard with many integrations. `MIT` |
| ⌬ **Homer 🐳** | Static-YAML dead-simple dashboard. `Apache-2.0` |

## Photo Galleries (image hosting)

awesome-selfhosted `Photo Galleries` section.

| Pick | Why |
| --- | --- |
| ★ **Immich 🐳** | The Google-Photos replacement; modern, fast, ML-tagged. ([immich.app](https://immich.app/)) `AGPL-3.0` |
| ★ **PhotoPrism 🐳** | Mature AI-tagging photo library; works fully offline. ([photoprism.app](https://photoprism.app/)) `AGPL-3.0` |
| ⌬ **Ente 🐳** | E2EE photo/video platform. `AGPL-3.0` |
| ⌬ **LibrePhotos 🐳** | Self-hosted Face Recognition + scene detection. `MIT` |
| ⌬ **Pigallery2** | Static-style responsive photo gallery. `MIT` |

## Prototyping / Brainstorming / Project Planning / Project Management

awesome-selfhosted `Software Development - Project Management` + `Task Management & To-do Lists` sections.

| Pick | Why |
| --- | --- |
| ★ **AppFlowy 🐳** | Notion-style workspace for notes, kanban, and docs. ([appflowy.io](https://appflowy.io/)) `AGPL-3.0` |
| ★ **Plane 🐳** | Modern JIRA/Linear alternative with cycles and modules. ([plane.so](https://plane.so/)) `AGPL-3.0` |
| ★ **Huly 🐳** | All-in-one Linear+Jira+Slack+Notion alternative. ([huly.io](https://huly.io/)) `EPL-2.0` |
| ⌬ **OpenProject 🐳** | Mature project planning suite with Gantt + agile. `GPL-3.0` |
| ⌬ **Wekan / Kanboard / Vikunja 🐳** | Trello-style kanban in different sizes. |
| ⌬ **Mindwendel 🐳** | Brainstorming/upvoting tool for team ideation. `AGPL-3.0` |

## Python Scripting

Not a tool category — Python itself plus the canonical FOSS libraries.

| Pick | Why |
| --- | --- |
| ★ **CPython 3.12+** | The reference implementation. ([python.org](https://www.python.org/)) `PSF-2.0` |
| ★ **uv 🐳** | The Astral-built Python package/project manager that's rapidly replacing pip+poetry. ([docs.astral.sh/uv](https://docs.astral.sh/uv/)) `Apache-2.0` |
| ⌬ **Ruff** | Linter + formatter replacing flake8/black/isort. `MIT` |
| ⌬ **Pixi / Poetry / Hatch** | Project/env managers. |
| ⌬ **JupyterLab / Marimo 🐳** | Notebook UIs for ad-hoc scripting. `BSD-3-Clause` |

## Quality Assurance

awesome-selfhosted has no direct category; overlaps with Testing and Code Review.

| Pick | Why |
| --- | --- |
| ★ **SonarQube 🐳** | Industry-standard static-analysis + code-quality gates. ([sonarsource.com](https://www.sonarsource.com/)) `LGPL-2.1` |
| ★ **Qodana 🐳** | JetBrains' self-hosted code-quality server. `Apache-2.0` |
| ⌬ **Codacy 🐳** | Self-hostable code-review automation. `LGPL-3.0` |
| ⌬ **Trivy / Grype** | Container + IaC scanners. |

## Search Engines (full-text search)

awesome-selfhosted `Search Engines` section.

| Pick | Why |
| --- | --- |
| ★ **MeiliSearch 🐳** | Fast, typo-tolerant, developer-friendly full-text search. ([meilisearch.com](https://www.meilisearch.com/)) `MIT` |
| ★ **Typesense 🐳** | Drop-in Algolia alternative with C++ core. `GPL-3.0` |
| ⌬ **OpenSearch 🐳** | The Elasticsearch fork; battle-tested at scale. `Apache-2.0` |
| ⌬ **Manticore Search 🐳** | Lightweight C++ search server (MySQL-wire compatible). `GPL-3.0` |
| ⌬ **SearXNG 🐳** | Metasearch engine for privacy-respecting public search. `AGPL-3.0` |

## Security Hardening / Linting / Threat Protection

awesome-selfhosted has Web Servers (BunkerWeb, SafeLine) and adjacent security tooling under Network Utilities / Authentication & SSO.

| Pick | Why |
| --- | --- |
| ★ **BunkerWeb 🐳** | Next-gen WAF in front of any web app. `AGPL-3.0` |
| ★ **CrowdSec 🐳** | Behavior-based fail2ban replacement with shared blocklists. ([crowdsec.net](https://crowdsec.net/)) `MIT` |
| ⌬ **Nuclei / Trivy / Grype** | Vulnerability and IaC scanners. |
| ⌬ **Traefik + Authelia / Pomerium 🐳** | Identity-aware reverse-proxy stack. |
| ⌬ **Fail2Ban / OSSEC Wazuh 🐳** | Host intrusion detection. |

## Self-hosting Solutions (Coolify, Dokploy)

awesome-selfhosted `Self-hosting Solutions` section (note: Coolify and Dokploy are mentioned in the wider community but **are not listed in awesome-selfhosted's current Software Development categories**).

| Pick | Why |
| --- | --- |
| ★ **Coolify 🐳** | The "self-hosted Heroku" — git-push-to-deploy, DBs, services. ([coolify.io](https://coolify.io/)) `Apache-2.0` |
| ★ **Dokploy 🐳** | Coolify alternative with Traefik + Docker Compose + multi-server. ([dokploy.com](https://dokploy.com/)) `Apache-2.0` |
| ⌬ **CasaOS 🐳** | App-store-style home-server UI. ([casaos.io](https://casaos.io/)) `Apache-2.0` |
| ⌬ **YunoHost 🐳** | Debian-based "server for everyone" with hundreds of one-click apps. `AGPL-3.0` |
| ⌬ **Runtipi 🐳** | One-command home-server manager with a clean UI. `GPL-3.0` |

## Self-Learning Agent Skills

awesome-selfhosted has no direct category. Adjacent tools span memory, observability, and skill management.

| Pick | Why |
| --- | --- |
| ★ **Langfuse 🐳** | Trace every prompt/tool call, capture datasets, eval against them. `MIT` |
| ★ **Mavis / Mavis 🐳** | Bundles memory, skills, agents, and self-improving loops. |
| ⌬ **Mem0 / Letta 🐳** | Self-hostable memory layer for agents. (`Apache-2.0` / `Apache-2.0`) |
| ⌬ **Arize Phoenix 🐳** | Open-source agent tracing/evals. `Apache-2.0` |
| ⌬ **Vector DB (Qdrant / Milvus)** | Stores episodes + skills as embeddings for retrieval. |

## Spec Driven Development

awesome-selfhosted has no direct category. Spec-driven tooling lives in the API/design/protocol ecosystems.

| Pick | Why |
| --- | --- |
| ★ **OpenAPI / Swagger** | Industry-standard REST spec; generate SDKs and docs. |
| ★ **Stoplight Elements / Redoc** | Beautiful OpenAPI doc generators. |
| ⌬ **AsyncAPI** | Event-driven spec standard (Kafka, MQTT, AMQP). |
| ⌬ **TypeSpec / Fern / Buf** | Schema-first API design with code-gen. |
| ⌬ **Backstage 🐳** | Developer portal with catalog + tech-docs. `Apache-2.0` |

## Software Development — CI/CD

awesome-selfhosted points to `awesome-sysadmin/Continuous Integration & Continuous Deployment`; the canonical FOSS choices are below.

| Pick | Why |
| --- | --- |
| ★ **Woodpecker CI 🐳** | Drone-style CI/CD; container-native, declarative YAML. ([woodpecker-ci.org](https://woodpecker-ci.org/)) `Apache-2.0` |
| ★ **Drone CI 🐳** | Mature container-native CI server. ([drone.io](https://www.drone.io/)) `Apache-2.0` |
| ⌬ **Jenkins 🐳** | The 800-lb gorilla; still ubiquitous. `MIT` |
| ⌬ **Gitea/Forgejo Actions 🐳** | Gitea/Forgejo's built-in GitHub-Actions-compatible runner. |
| ⌬ **Tekton / Argo Workflows 🐳** | Kubernetes-native CI/CD. |

## Software Development — Project Management

awesome-selfhosted `Software Development - Project Management` section.

| Pick | Why |
| --- | --- |
| ★ **Forgejo 🐳** | Gitea fork: forge + issues + PR + CI + registry in one. `MIT` |
| ★ **GitLab CE 🐳** | The all-in-one forge for teams that don't want best-of-breed. `MIT` |
| ★ **OpenProject 🐳** | Mature project planning with agile + Gantt. `GPL-3.0` |
| ⌬ **Taiga 🐳** | Scrum + Kanban project management. `MPL-2.0` |
| ⌬ **Redmine** | Classic PHP project management. `GPL-2.0` |
| ⌬ **Leantime 🐳** | Lean startup-friendly project tool. `AGPL-3.0` |

## Software Development — FaaS & Serverless

awesome-selfhosted `Software Development - FaaS & Serverless` section is currently a stub pointing to awesome-sysadmin/PaaS. Realistic FOSS picks:

| Pick | Why |
| --- | --- |
| ★ **OpenFaaS 🐳** | The reference Functions-as-a-Service for Kubernetes/Docker. ([openfaas.com](https://www.openfaas.com/)) `MIT` |
| ★ **Knative 🐳** | Serverless containers on Kubernetes. ([knative.dev](https://knative.dev/)) `Apache-2.0` |
| ⌬ **Nitro / NuxtHub / SST** | Serverless frameworks built on Workers/Cloudflare. |
| ⌬ **Apache OpenWhisk 🐳** | IBM-style FaaS. `Apache-2.0` |
| ⌬ **Coolify / Dokploy** | Self-hostable PaaS that mimics Vercel/Heroku deploy flows. |

## Software Development — Feature Toggle

awesome-selfhosted `Software Development - Feature Toggle` section.

| Pick | Why |
| --- | --- |
| ★ **Flagsmith 🐳** | Full LaunchDarkly alternative: dashboard + SDK + remote config. `BSD-3-Clause` |
| ★ **Flipt 🐳** | Lightweight Go-native feature-flag service. ([flipt.io](https://flipt.io/)) `GPL-3.0` |
| ⌬ **GO Feature Flag** | Single-binary self-hosted or OSS remote-config service. `MIT` |
| ⌬ **Featbit 🐳** | Enterprise-grade experimentation platform. `MIT` |
| ⌬ **Unleash 🐳** | Mature feature-toggle service with SDKs in 20+ languages. `Apache-2.0` |

## Software Development — Svelte Frontend UI/UX Design

awesome-selfhosted has no direct category. Svelte's ecosystem is itself the toolchain.

| Pick | Why |
| --- | --- |
| ★ **Svelte 5 + SvelteKit** | The default UI framework with the smallest runtime. ([svelte.dev](https://svelte.dev/)) `MIT` |
| ★ **shadcn-svelte / bits-ui / Melt UI** | Headless component libraries for Svelte 5. (`MIT`) |
| ⌬ **Storybook for SvelteKit** | Component workshop + visual testing. `MIT` |
| ⌬ **Tailwind CSS + Tailwind Variants** | Utility-first styling with typed variants. `MIT` |
| ⌬ **Penpot 🐳** | Open-source design tool that exports to Svelte. `MPL-2.0` |
| ⌬ **Open Props / Pico CSS** | Minimal CSS frameworks. |

## Software Development — Desktop Development with Tauri 2

awesome-selfhosted has no direct category. Tauri 2 itself plus the surrounding tooling.

| Pick | Why |
| --- | --- |
| ★ **Tauri 2** | The Rust-based cross-platform desktop framework. ([tauri.app](https://tauri.app/)) `MIT/Apache-2.0` |
| ★ **Vite + Svelte/React/Vue** | Default front-end toolchain for Tauri. `MIT` |
| ⌬ **Tauri plugins (store, fs, dialog, updater, …)** | Drop-in capabilities. |
| ⌬ **iced / egui / Druid** | Pure-Rust GUI alternatives if Tauri isn't a fit. |
| ⌬ **Cosmic App Library 🐳** | Linux desktop ecosystem built on iced. `GPL-3.0/MPL-2.0` |

## Software Architecture / Cost Planning / Budgeting

awesome-selfhosted has no direct category. Most picks are observability + IaC tools repurposed.

| Pick | Why |
| --- | --- |
| ★ **OpenCost 🐳** | Kubernetes cost allocation + monitoring. ([opencost.io](https://www.opencost.io/)) `Apache-2.0` |
| ★ **Kompose / Terraform / OpenTofu** | IaC for predictable infra cost modeling. (`Apache-2.0` / `MPL-2.0`) |
| ⌬ **Firefly 🐳** | Self-hostable cloud-asset + IaC scanner (Community Edition). |
| ⌬ **Invoice Ninja / Crater 🐳** | Billing + invoicing for cost tracking. (`AGPL-3.0` / `AGPL-3.0`) |
| ⌬ **Coder + Coder Registry** | Track developer environments and their cloud spend. `AGPL-3.0` |

## Text-to-Speech and Speech-to-Text Processing

awesome-selfhosted has no direct category. Tools come from STT/TTS and LLM ecosystems.

| Pick | Why |
| --- | --- |
| ★ **Whisper (faster-whisper / whisper.cpp)** | The reference FOSS STT engine; runs CPU-only. (`MIT`) |
| ★ **Piper / Kokoro / XTTS** | High-quality local TTS engines with broad voice sets. (`MIT`) |
| ⌬ **OpenVoice / Coqui TTS** | Voice-cloning-capable TTS (license varies by fork). |
| ⌬ **whisper-live / Insanely-fast-whisper 🐳** | Server wrappers with WebSocket/HTTP APIs. |
| ⌬ **Live Captions / Vibe** | Browser-based live-caption tools. |

## Test Driven Development

awesome-selfhosted `Software Development - Testing` section is small; broader TDD tooling lives in the dev-tool ecosystem.

| Pick | Why |
| --- | --- |
| ★ **Playwright** | Cross-browser end-to-end testing with great DX. `Apache-2.0` |
| ★ **Vitest + Testing Library** | Modern unit/integration test stack for JS/TS. (`MIT`) |
| ⌬ **pytest + pytest-cov + Hypothesis** | The canonical Python TDD stack. (`MIT`) |
| ⌬ **Bencher 🐳** | Continuous benchmarking as a first-class CI step. (`MIT/Apache-2.0`) |
| ⌬ **CodeceptJS / Cypress** | E2E alternatives to Playwright. |

## Ticketing (helpdesk)

awesome-selfhosted `Ticketing` section.

| Pick | Why |
| --- | --- |
| ★ **Zammad 🐳** | Modern omnichannel helpdesk with chat/email integration. `AGPL-3.0` |
| ★ **FreeScout 🐳** | Lightweight shared-inbox/Help-Scout alternative. `AGPL-3.0` |
| ⌬ **OTOBO 🐳** | Enterprise ITSM ticket system. `GPL-3.0` |
| ⌬ **Frappe Helpdesk 🐳** | Frappe/ERPNext-native support desk. `AGPL-3.0` |
| ⌬ **UVDesk 🐳** | Service-oriented helpdesk for SMBs. `MIT` |

## Time & Token Tracking

awesome-selfhosted `Time Tracking` section (time) + observability/LLM tools (token).

| Pick | Why |
| --- | --- |
| ★ **Kimai 🐳** | The reference self-hosted time tracker. ([kimai.org](https://www.kimai.org/)) `AGPL-3.0` |
| ★ **ActivityWatch 🐳** | Automatic passive time tracking on your devices. ([activitywatch.net](https://activitywatch.net/)) `MPL-2.0` |
| ⌬ **Wakapi / Ziit 🐳** | Coding-time trackers that aggregate WakaTime data. `GPL-3.0` / `AGPL-3.0` |
| ⌬ **solidtime 🐳** | Modern time tracker for freelancers. `AGPL-3.0` |
| ⌬ **Langfuse + Helicone 🐳** | Track LLM tokens by model, user, and prompt. |

## Text Extraction (PDF, HTML, EPUB)

awesome-selfhosted has no direct category. Tools come from data-engineering and document-AI ecosystems.

| Pick | Why |
| --- | --- |
| ★ **Tesseract OCR** | The canonical FOSS OCR engine. ([github.com/tesseract-ocr/tesseract](https://github.com/tesseract-ocr/tesseract)) `Apache-2.0` |
| ★ **Apache Tika 🐳** | Detects and extracts content from 1500+ file types. ([tika.apache.org](https://tika.apache.org/)) `Apache-2.0` |
| ⌬ **MinerU / Docling** | Layout-aware PDF parsers that preserve tables/figures. (`Apache-2.0`) |
| ⌬ **Calibre / Pandoc** | The go-to EPUB/document converters. (`GPL-3.0`) |
| ⌬ **Trafilatura / Readability.js** | Clean HTML-to-text extraction. (`GPL-3.0` / `Apache-2.0`) |

## Token and Prompt Optimization

awesome-selfhosted has no direct category. Pick from the LLM-eval/observability ecosystems.

| Pick | Why |
| --- | --- |
| ★ **Langfuse 🐳** | Track token cost per trace + prompt experiments. `MIT` |
| ★ **Promptfoo** | Open-source prompt eval + red-teaming CLI. ([promptfoo.dev](https://promptfoo.dev/)) `MIT` |
| ⌬ **OpenLLMetry** | Token/cost spans in OpenTelemetry. `Apache-2.0` |
| ⌬ **LiteLLM 🐳** | Unified proxy with caching + budget enforcement. `MIT` |
| ⌬ **Opik 🐳** | Comet-ML's prompt/eval suite. `Apache-2.0` |

## Unit Testing

awesome-selfhosted has no direct category. Pick from the language-native test ecosystems.

| Pick | Why |
| --- | --- |
| ★ **pytest** | The default Python unit-test framework. `MIT` |
| ★ **Vitest** | The Vite-native test runner for JS/TS projects. `MIT` |
| ⌬ **Go testing + testify** | Standard Go test stack. (`BSD-3-Clause`) |
| ⌬ **JUnit 5 / TestNG** | Java's canonical unit-test frameworks. (`EPL-2.0`) |
| ⌬ **CTest / GoogleTest** | C/C++ testing. (`BSD-3-Clause`) |

## URL Shorteners (news article link shortening)

awesome-selfhosted `URL Shorteners` section.

| Pick | Why |
| --- | --- |
| ★ **Shlink 🐳** | PHP/Go URL shortener with REST API + PWA. ([shlink.io](https://shlink.io/)) `MIT` |
| ★ **YOURLS 🐳** | The classic self-hosted shortener with plugins and stats. ([yourls.org](https://yourls.org/)) `MIT` |
| ⌬ **Kutt 🐳** | Modern TS shortener with custom domains + analytics. `MIT` |
| ⌬ **Chhoto URL 🐳** | Lightweight Rust shortener, zero bloat. `MIT` |

## Web Scraping / Data Extraction

awesome-selfhosted has no direct category. Tools come from the Python/Node scraping ecosystems.

| Pick | Why |
| --- | --- |
| ★ **Crawl4AI / Firecrawl (OSS)** | Modern LLM-friendly web crawlers. (`Apache-2.0`) |
| ★ **Playwright + BeautifulSoup / Cheerio** | Headless-browser + HTML-parse combination. |
| ⌬ **Scrapy** | The reference Python scraping framework. ([scrapy.org](https://scrapy.org/)) `BSD-3-Clause` |
| ⌬ **Apify SDK (open-core)** | Self-hostable actor-based scraping platform. |
| ⌬ **HTTrack / wget / curl** | Simple bulk-download tools. |

## Web Servers (proxy)

awesome-selfhosted `Web Servers` section.

| Pick | Why |
| --- | --- |
| ★ **Caddy 🐳** | The modern, automatic-HTTPS web server. ([caddyserver.com](https://caddyserver.com/)) `Apache-2.0` |
| ★ **Traefik 🐳** | The default cloud-native reverse proxy + load balancer. ([traefik.io](https://traefik.io/)) `MIT` |
| ⌬ **Nginx Proxy Manager 🐳** | Web UI for managing Nginx reverse-proxy hosts. `MIT` |
| ⌬ **HAProxy 🐳** | Industry-standard TCP/HTTP proxy/load-balancer. `GPL-2.0` |
| ⌬ **Caddy + Authelia / Pomerium / Pangolin** | Identity-aware proxy stack. |

## Web Design

awesome-selfhosted has no direct category. The picks are mostly design and SSG tools.

| Pick | Why |
| --- | --- |
| ★ **Penpot 🐳** | Figma-style open-source design tool with self-hosting. ([penpot.app](https://penpot.app/)) `MPL-2.0` |
| ★ **Astro + shadcn/ui** | Modern SSG + component lib for marketing sites. `MIT` |
| ⌬ **WordPress 🐳** | The largest CMS; still the default for many marketing sites. `GPL-2.0` |
| ⌬ **Directus 🐳** | Headless CMS for content-driven sites. `BSD-3-Clause` |
| ⌬ **Storybook 🐳** | Design-system workshop for visual review. `MIT` |

## Voice Control / Dictation / Transcription

awesome-selfhosted has no direct category. Picks come from STT/voice-AI ecosystems.

| Pick | Why |
| --- | --- |
| ★ **Whisper + faster-whisper** | The canonical STT engine for any voice pipeline. (`MIT`) |
| ★ **OpenVoice / Piper / Coqui TTS** | Open TTS engines for voice synthesis. |
| ⌬ **Vosk 🐳** | Offline STT engine with broad language coverage. `Apache-2.0` |
| ⌬ **Live Captions (Linux)** | Desktop live-caption tool for any audio. |
| ⌬ **Whisper Live / Insanely-fast-whisper** | WebSocket/HTTP wrappers for real-time transcription. |

## Image, Music, Sound, and Video Generation and Editing

awesome-selfhosted `Generative Artificial Intelligence (GenAI)` and `Media Management` sections together cover this.

| Pick | Why |
| --- | --- |
| ★ **Stable Diffusion WebUI / Forge / ComfyUI** | The FOSS canon for image generation. (`AGPL-3.0`) |
| ★ **Ollama + Open WebUI 🐳** | Local LLM runner + UI for text/music-lyric generation. |
| ⌬ **Kdenlive / OpenShot / Olive** | FOSS non-linear video editors. (`GPL-2.0` / `GPL-3.0` / `GPL-3.0`) |
| ⌬ **Audacity / Ardour / LMMS** | Audio editing and music production. (`GPL-2.0` / `GPL-2.0` / `GPL-2.0`) |
| ⌬ **GIMP / Krita / Darktable / RawTherapee** | The image-editing suite. (`GPL-2.0/3.0`) |
| ⌬ **DiffusionBee / Draw Things** | Local-stable-diffusion desktop clients. |

---

## Gaps in awesome-selfhosted — observations

Several of your categories are **not represented at all** in awesome-selfhosted (or only partially). If you ever want to upstream something, these are the gaps:

- **Game asset pipelines (Unity, Blender)** — could be a new "Game Development" section.
- **Coding-agent / LLM-agent skills** — adjacent to MCP server catalogs.
- **Spec-driven development tooling** — fits naturally in Software Development.
- **Test frameworks (unit/E2E)**, **TTS/STT**, **OCR/text-extraction**, **RAG frameworks**, **design tools (Penpot, Excalidraw)**, **Svelte/Tauri stacks**, **browsers/automation (Playwright)**, **voice control**, **time/token tracking for LLMs**, **data transformation (dbt, DuckDB)**, **reverse proxies for APIs** — all would be welcome.

If you only have time to add one section, the highest-value gap is probably **"Software Development - Testing"**, which is currently a stub with only three entries despite being a foundational category.

---

## Verification & methodology

- Tool names, descriptions, and licenses for categories **with** an awesome-selfhosted section are taken directly from the current `master` README (last fetched 2026-09-23).
- Tool picks for **gap** categories (game dev, Tauri, Svelte, RAG, voice, scraping, etc.) are sourced from public knowledge and the listed project homepages; each name has a recent major release and broad community usage.
- Every project listed is open-source at the time of writing; licenses are summarized (not legal text) — always re-verify the license before adoption.
- This shortlist is opinionated toward small-team productivity, Docker deployment, and active maintenance; some legacy giants (Jenkins, JIRA) are mentioned for completeness but rarely "best in class" today.

<deliver-assets>
<media type="file" src="D:\stuff\ai-misc\_bsh2026\vscode_project01\46-wide-research-test-M3\awesome-selfhosted-shortlist\SHORTLIST.md" caption="Curated shortlist of FOSS tools from awesome-selfhosted across 65 categories" />
</deliver-assets>