# Backend, Database & Server-Side Scaffolding Repository Catalog

> **Scope.** This catalog is curated exclusively from the supplied `repo_showcase_merged.json` dataset. It covers backend design and maintenance, database design and maintenance, backend scaffolding, and adjacent server-side infrastructure. Repository metadata and star counts are source snapshots rather than live assessments. [1]

## How to Read This Catalog

The source dataset contains **6,327 unique repositories**. A high-recall metadata pass identified 963 potential candidates. The catalog retains **467 repositories** across the server-side lifecycle: **262 semantic-reviewed selections** and **205 additional high-specificity metadata matches** from the remaining candidate pool. The latter are included for coverage, but should receive an extra documentation check before adoption. [1]

| Selection tier | Meaning | Repositories |
| --- | --- | ---: |
| **Semantic-reviewed** | Selected through structured metadata review for a direct backend or database role. | 262 |
| **High-specificity extension** | Selected by targeted technology/role signals after the semantic review checkpoint; useful for breadth, but validate fit against current docs. | 205 |

## Coverage at a Glance

| Category | Semantic-reviewed | High-specificity extension | Total | Primary value |
| --- | ---: | ---: | ---: | --- |
| Backend frameworks, APIs & service architecture | 40 | 42 | 82 | Server frameworks, API stacks, microservice foundations, and reusable service architecture patterns. |
| Backend scaffolding, starter kits & code generation | 21 | 0 | 21 | Backend starters, boilerplates, CRUD/API generators, and project scaffolds that speed server-side implementation. |
| Databases, query engines & storage systems | 71 | 55 | 126 | Relational, NoSQL, distributed, analytical, embedded, cache, and other persistent query/storage engines. |
| Schema design, migrations, ORMs & data access | 14 | 5 | 19 | Schema management, migrations, object-relational mapping, query construction, and database access layers. |
| Database administration, maintenance, backup & observability | 20 | 2 | 22 | Database clients, administrative UIs, backup/restore, monitoring, tuning, replication, and operational maintenance. |
| Authentication, authorization & API security | 12 | 29 | 41 | Identity, access control, auth protocols, API credentials, and server-side security foundations. |
| Backend operations, reliability & API lifecycle | 27 | 11 | 38 | API gateways, observability, service management, health, reliability patterns, and lifecycle operations. |
| Caching, queues, events & background processing | 20 | 16 | 36 | Caching, job queues, message brokers, event streaming, schedulers, and durable background-work infrastructure. |
| Deployment, serverless & developer platform tooling | 37 | 45 | 82 | Serverless platforms, cloud-native deployment, infrastructure-as-code, self-hosting, and backend developer platforms. |

## Complete Categorized Catalog

Projects are grouped by server-side function. Within each group, semantic-reviewed entries appear first; high-specificity extensions follow. Entries are ordered by review confidence and then by the source star snapshot. [1]

### Backend frameworks, APIs & service architecture

Server frameworks, API stacks, microservice foundations, and reusable service architecture patterns.

#### Semantic-reviewed (40)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [servers](https://github.com/modelcontextprotocol/servers) | Reference implementations of Model Context Protocol servers demonstrating secure tool/data access. | TypeScript | 89,128 |
| [laravel](https://github.com/laravel/laravel) | PHP web application framework providing an expressive foundation for backend apps. | Blade | 84,812 |
| [vLLM](https://github.com/vllm-project/vllm) | High-throughput, memory-efficient LLM serving library with OpenAI-compatible API server. | Python | 77,202 |
| [PocketBase](https://github.com/pocketbase/pocketbase) | Single-file realtime backend with built-in database and auth for self-hosted apps. | Go | 60,707 |
| [Hyperswitch](https://github.com/juspay/hyperswitch) | High-performance open-source payments switch in Rust with routing, vault, and reconciliation features. | Rust | 42,473 |
| [Directus](https://github.com/directus/directus) | Flexible backend platform exposing REST/GraphQL APIs over SQL databases. | TypeScript | 34,834 |
| [semantic-kernel](https://github.com/microsoft/semantic-kernel) | SDK/framework to integrate and orchestrate LLMs within applications. | C# | 28,459 |
| [TradingAgents CN](https://github.com/hsliuping/TradingAgents-CN) | Multi-agent LLM framework for Chinese financial analysis with FastAPI backend, MongoDB/Redis, and Docker deployment. | Python | 24,237 |
| [lago](https://github.com/getlago/lago) | Open source metering and usage-based billing API with subscription and analytics features. | Go | 10,344 |
| [EverShop](https://github.com/evershopcommerce/evershop) | Modular TypeScript-first e-commerce backend with GraphQL and extensibility. | TypeScript | 10,017 |
| [Kreuzberg](https://github.com/kreuzberg-dev/kreuzberg) | Lightweight Rust framework to simplify building back-end APIs and services. | Rust | 7,582 |
| [Ackee](https://github.com/electerious/Ackee) | Self-hosted Node.js analytics backend with MongoDB and a GraphQL API. | JavaScript | 4,643 |
| [Lavandula](https://github.com/ashtonjamesd/lavandula) | Lightweight high-performance web framework in C with routing, middleware, SQLite integration and CLI scaffolding. | C | 982 |
| [papermerge-core](https://github.com/papermerge/papermerge-core) | Core backend and REST API server for the Papermerge document management system. | Python | 505 |
| [sandstorm](https://github.com/tomascupr/sandstorm) | Agent SDK to run self-hosted LLM agents via CLI, HTTP API and Python clients with tracing. | Python | 431 |
| [Call](https://github.com/joincalldotco/Call) | Open-source AI-native video infrastructure with Hono backend and PostgreSQL. | TypeScript | 420 |
| [qwen2.5-VL-inference-openai](https://github.com/phildougherty/qwen2.5-VL-inference-openai) | Inference service wrapping the Qwen2.5-VL-7b model for serving model predictions. | Python | 208 |
| [cata-centavo](https://github.com/MarcusXavierr/cata-centavo) | MCP server exposing Brazilian Open Finance data via natural-language AI agent, persisting mappings in SQLite. | TypeScript | 166 |
| [SuperMCP](https://github.com/dhanababum/supermcp) | Platform to create multiple isolated Model Context Protocol (MCP) servers from a single connector. | Python | 56 |
| [voltage](https://github.com/radaario/voltage) | FFmpeg-based scalable video encoding API with parallel instances and resource management. | TypeScript | 14 |
| [ContextOS](https://github.com/joshimohanlalit1303-ctrl/ContextOS) | Memory-as-a-Service for AI agents: REST API with pgvector-based semantic search and embedding cache. | TypeScript | 0 |
| [cal.diy](https://github.com/calcom/cal.diy) | Open scheduling infrastructure (self-hostable) for calendar and booking services. | TypeScript | 47,761 |
| [apitable](https://github.com/apitable/apitable) | API-oriented low-code platform (Airtable alternative) for building collaborative apps with automatic APIs. | TypeScript | 15,489 |
| [unstract](https://github.com/Zipstack/unstract) | No-code LLM platform to launch APIs and ETL pipelines for extracting and structuring documents. | Python | 7,144 |
| [Open Agents](https://github.com/vercel-labs/open-agents) | Open framework for building agent-driven workflows and AI applications. | TypeScript | 5,778 |
| [trailbase](https://github.com/trailbaseio/trailbase) | Single-executable Rust backend offering type-safe APIs, realtime subscriptions, auth and admin UI on SQLite. | Rust | 5,357 |
| [OpenCloud](https://github.com/opencloud-eu/opencloud) | Go-based backend platform for file management, sharing and collaboration with OIDC authentication. | Go | 5,226 |
| [Magic](https://github.com/dtyq/magic) | AI agent platform combining generalist agents, workflow engine, and enterprise controls. | TypeScript | 4,763 |
| [Antfarm](https://github.com/snarktank/antfarm) | TypeScript framework to build and orchestrate specialized AI agent teams with YAML/SQLite state. | TypeScript | 2,407 |
| [LLMStack](https://github.com/trypromptly/LLMStack) | No-code multi-agent framework for building LLM agents, workflows and applications with your data. | Python | 2,309 |
| [superglue](https://github.com/superglue-ai/superglue) | Open-source data connector that transforms and orchestrates API data into consistent formats. | TypeScript | 2,044 |
| [Overstory](https://github.com/jayminwest/overstory) | TypeScript framework for multi-agent orchestration using git worktrees and a SQLite mail system. | TypeScript | 1,222 |
| [rag_api](https://github.com/danny-avila/rag_api) | FastAPI RAG example integrating LangChain with PostgreSQL/pgvector for vector search-backed APIs. | Python | 885 |
| [restai](https://github.com/apocas/restai) | AI-as-a-Service platform exposing REST APIs over LlamaIndex/LangChain and local LLMs. | Python | 512 |
| [nokode](https://github.com/samrolken/nokode) | JavaScript web server that runs application logic via an LLM, handling SQL, web responses and persistence. | JavaScript | 416 |
| [autospace-workshop](https://github.com/karthickthankyou/autospace-workshop) | Monorepo demo of a parking management system with backend API, Docker, and Prisma. | TypeScript | 235 |
| [vibephp](https://github.com/mnapoli/vibephp) | Experimental LLM-based PHP runtime that simulates PHP execution using Laravel and AI agents. | PHP | 154 |
| [Acquisitions](https://github.com/adrianhajdin/acquisitions) | Example secure, scalable Node/Express API with Drizzle ORM, containerization and Kubernetes deployment. | HTML | 119 |
| [LLM-RAG-Architecture](https://github.com/matt-bentley/LLM-RAG-Architecture) | Production-grade Retrieval-Augmented Generation (RAG) architecture using open-source components. | C# | 73 |
| [Context Mode](https://github.com/mksglu/claude-context-mode) | Server for saving session context and indexed retrieval to keep LLM context windows small. | — | 0 |

#### High-specificity extension (42)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Voicebox](https://github.com/jamiepine/voicebox) | Voicebox is an open-source, local-first voice synthesis studio designed for cloning voices and generating high-quality speech directly on the user's m | TypeScript | 47,724 |
| [paperless-ngx](https://github.com/paperless-ngx/paperless-ngx) | Paperless-ngx is a community-supported document management system that transforms physical documents into searchable online archives. It provides a co | Python | 43,796 |
| [HivisionIDPhotos](https://github.com/Zeyi-Lin/HivisionIDPhotos) | ⚡️HivisionIDPhotos: a lightweight and efficient AI ID photos tools. 一个轻量级的AI证件照制作算法。 | Python | 21,383 |
| [typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk) | The MCP TypeScript SDK is the official implementation of the Model Context Protocol, providing a standardized way for applications to supply context t | TypeScript | 13,039 |
| [FastAPI-MCP](https://github.com/tadata-org/fastapi_mcp) | FastAPI-MCP is a framework designed to expose FastAPI endpoints as Model Context Protocol (MCP) tools, enabling seamless integration with LLMs and ext | Python | 11,813 |
| [romm](https://github.com/rommapp/romm) | RomM is a beautiful, powerful, and self-hosted ROM manager and player written in Python. It provides a centralized platform for scanning, enriching, b | Python | 11,796 |
| [polar](https://github.com/polarsource/polar) | An Open Source Lemon Squeezy alternative with better pricing! Get paid coding on your passion. | Python | 10,196 |
| [WAHA](https://github.com/devlikeapro/waha) | WAHA is a comprehensive WhatsApp HTTP API designed to enable easy and rapid WhatsApp automation. It provides a single REST API that can be deployed on | TypeScript | 6,408 |
| [Kokoro-FastAPI](https://github.com/remsky/Kokoro-FastAPI) | Dockerized FastAPI wrapper for Kokoro-82M text-to-speech model w/multiplatform CPU, AMD, NVIDIA GPU PyTorch support, handling, and auto-stitching | Python | 5,341 |
| [grok2api](https://github.com/chenyme/grok2api) | Grok2API is a Python-based Grok gateway built on FastAPI, designed to translate Grok web capabilities into OpenAI-compatible APIs. It provides compreh | Python | 4,319 |
| [farfalle](https://github.com/rashadphz/farfalle) | 🔍 AI search engine - self-host with local or cloud LLMs | TypeScript | 3,540 |
| [Open Wearables](https://github.com/the-momentum/open-wearables) | Self-hosted platform to unify wearable health data through one AI-ready API. | Python | 2,355 |
| [Open Terminal](https://github.com/open-webui/open-terminal) | Open Terminal is a lightweight, self-hosted terminal designed to provide AI agents and automation tools with a dedicated environment for executing com | Python | 2,323 |
| [BrightBean Studio](https://github.com/brightbeanxyz/brightbean-studio) | Brightbean Studio, creative studio for AI content workflows. Brightbean Studio is an open-source project focused on creating and managing AI-driven cr | Python | 1,872 |
| [PeaNUT](https://github.com/Brandawg93/PeaNUT) | PeaNUT is a lightweight, web-based dashboard for monitoring Uninterruptible Power Supplies (UPS) through Network UPS Tools (NUT), providing real-time | TypeScript | 1,607 |
| [arguman.org](https://github.com/arguman/arguman.org) | Argument mapping and analysis platform | Python | 1,419 |
| [short-video-maker](https://github.com/gyoridavid/short-video-maker) | Creates short videos for TikTok, Instagram Reels, and YouTube Shorts using the Model Context Protocol (MCP) and a REST API. | TypeScript | 1,293 |
| [AIPEXBASE](https://github.com/kuafuai/aipexbase) | AIPEXBASE is an AI-native Backend-as-a-Service (BaaS) platform designed to simplify AI application development. It enables developers to focus solely | Java | 1,262 |
| [Foxel](https://github.com/DrizzleTime/Foxel) | Foxel is an extensible private cloud storage solution designed for individuals and teams, offering unified management across diverse file storage back | Python | 1,016 |
| [PigeonPod](https://github.com/aizhimou/pigeon-pod) | PigeonPod is a self-hosted application designed to allow users to listen to and manage content from YouTube and Bilibili anywhere. Built with Java and | Java | 975 |
| [WYGIWYH](https://github.com/eitchtee/WYGIWYH) | WYGIWYH is a powerful, self-hosted finance tracker built using Python and Django, designed for users who prefer a no-budget, principles-first approach | Python | 836 |
| [Traefik Manager](https://github.com/chr0nzz/traefik-manager) | Traefik Manager is a self-hosted web UI to manage your entire reverse proxy without touching YAML. Visually add HTTP, TCP, or UDP routes, configure mi | HTML | 825 |
| [Stacks](https://github.com/zelestcarlyone/stacks) | Stacks is a lightweight, containerized download manager specifically designed for Anna's Archive. It provides a secure web interface for queue managem | SCSS | 676 |
| [ROCK](https://github.com/alibaba/ROCK) | ROCK (Reinforcement Open Construction Kit) is a scalable, client-server framework designed for managing and scheduling agentic reinforcement learning | Python | 417 |
| [Drive](https://github.com/suitenumerique/drive) | Drive is a scalable, collaborative file sharing and document management platform designed for team teamwork. Built using the Django framework for the | JavaScript | 403 |
| [BrainRotGuard](https://github.com/GHJJ123/brainrotguard) | YouTube approval system for kids — parent approves via Telegram, kid watches via web UI | Python | 332 |
| [facebook-events-by-location](https://github.com/tobilg/facebook-events-by-location) | A Express.js-based webservice to get public Facebook events by location | JavaScript | 331 |
| [Openinary](https://github.com/openinary/openinary) | Openinary is an open-source, self-hosted media processing platform designed as a powerful alternative to Cloudinary. It provides on-the-fly transforma | TypeScript | 281 |
| [Skyll](https://github.com/assafelovic/skyll) | Skyll is a REST API and MCP server designed to enable autonomous AI agents to discover and learn skills at runtime. It aggregates skills from multiple | Python | 224 |
| [proto-language](https://github.com/evo-design/proto-language) | Proto Language is an open-source Python framework for designing biological sequences—DNA, RNA, and proteins—through constraint-based generative optimi | Python | 172 |
| [Foliox](https://github.com/KartikLabhshetwar/foliox) | Foliox is an AI-powered platform designed to automatically generate professional developer portfolios directly from GitHub profiles. It integrates wit | TypeScript | 140 |
| [Coolpack](https://github.com/coollabsio/coolpack) | Coolpack is a general-purpose build pack written in Go designed to automate the process of containerizing applications with zero configuration. It aut | Go | 134 |
| [simplerelay](https://github.com/toinbox/simplerelay) | SimpleRelay - Self-hosted SMTP relay with web dashboard, DNS validation, and per-sender access control (FastAPI/Postfix/Docker) | Python | 133 |
| [ZeroPulse](https://github.com/jxroot/ZeroPulse) | ZeroPulse is a modern Command & Control (C2) platform designed for secure remote management and monitoring, integrating Cloudflare Tunnel technology f | JavaScript | 131 |
| [TuneLog](https://github.com/adiiverma40/tunelog) | TuneLog is a self-hosted music recommendation system designed to learn user taste by analyzing actual music interactions, such as skips, finishes, and | TypeScript | 104 |
| [FLAMEHAVEN FileSearch](https://github.com/flamehaven01/Flamehaven-Filesearch) | Flamehaven-Filesearch is an open-source, self-hosted Retrieval-Augmented Generation (RAG) engine designed for semantic document search. It provides en | Python | 95 |
| [MuckScraper](https://github.com/grregis/MuckScraper) | Self-hosted news aggregator with LLM bias scoring and summarization. | Python | 81 |
| [railscale](https://github.com/mushrowan/railscale) | Railscale is a self-hosted control server for Tailscale, implemented in Rust, designed to manage a zero-trust mesh VPN. It provides comprehensive feat | Rust | 34 |
| [renfield](https://github.com/ebongard/renfield) | Renfield is a self-hosted, fully offline AI assistant designed for users who want a privacy-respecting alternative to cloud-based smart assistants. It | Python | 30 |
| [Octop](https://github.com/TencentCloud/Octop) | Octop, self-hosted multi-user, multi-agent AI assistant. Octop is a self-hosted AI assistant platform that runs a single local process serving a web d | — | 0 |
| [Horilla](https://github.com/horilla-opensource/horilla-crm) | Horilla CRM is a comprehensive, enterprise-level Customer Relationship Management system designed for advanced sales tracking and business process aut | — | 0 |
| [Doppelganger](https://github.com/mnemosyne-artificial-intelligence/doppelganger) | Figranium is a self-hosted, block-first automation control plane designed for predictable and auditable browser workflows. It allows teams to build co | — | 0 |

### Backend scaffolding, starter kits & code generation

Backend starters, boilerplates, CRUD/API generators, and project scaffolds that speed server-side implementation.

#### Semantic-reviewed (21)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [ToolJet](https://github.com/ToolJet/ToolJet) | Low-code platform to build business apps; connects to databases, APIs and supports self-hosting. | JavaScript | 40,389 |
| [NocoBase](https://github.com/nocobase/nocobase) | Open-source no-code/low-code backend platform for building CRUD business applications. | TypeScript | 23,681 |
| [amplication](https://github.com/amplication/amplication) | AI-powered backend code generator / low-code platform producing production-ready backends. | TypeScript | 16,011 |
| [Next.js SaaS Starter](https://github.com/nextjs/saas-starter) | Starter template for SaaS with Next.js, PostgreSQL, Drizzle ORM, and Stripe integration. | TypeScript | 15,697 |
| [dotnet-starter-kit](https://github.com/fullstackhero/dotnet-starter-kit) | Production-ready .NET 8 starter kit with Web API, Blazor client, multitenancy and cloud deployment presets. | C# | 6,725 |
| [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack) | CLI scaffolder for end-to-end type-safe TypeScript projects with customizable configs and best practices. | TypeScript | 5,634 |
| [NextFaster](https://github.com/ethanniser/NextFaster) | High-performance Next.js e-commerce template using Drizzle ORM and Neon Postgres. | TypeScript | 4,835 |
| [Chef](https://github.com/get-convex/chef) | AI-powered app builder that scaffolds full-stack apps with built-in DB, auth, realtime, and workflows. | TypeScript | 4,541 |
| [nextjs-starter-kit](https://github.com/michaelshimeles/nextjs-starter-kit) | Next.js SaaS starter kit with integrated auth, database schema (Prisma) and production tooling. | TypeScript | 3,051 |
| [anatomy](https://github.com/thebuggeddev/anatomy) | Full‑stack starter template for Cloudflare vinext/Workers with optional D1/Drizzle ORM and migration tooling. | TypeScript | 1,375 |
| [ChadNext](https://github.com/moinulmoin/chadnext) | Comprehensive Next.js starter template integrating auth (Lucia), Prisma, Stripe, shadcn UI and scaffolding. | TypeScript | 1,320 |
| [Full-Stack Next.js + Cloudflare](https://github.com/ifindev/fullstack-next-cloudflare) | Production-ready Next.js + Cloudflare template with DB, auth and deployment integrations. | TypeScript | 1,253 |
| [webprodigies-cypress](https://github.com/webprodigies/webprodigies-cypress) | SaaS application template demonstrating real-time collaboration and full‑stack features. | TypeScript | 629 |
| [react-nestjs-full-web-app](https://github.com/ipenywis/react-nestjs-full-web-app) | Full React + NestJS web application scaffold with Docker and docker-compose deployment examples. | TypeScript | 409 |
| [best-saas-kit](https://github.com/zainulabedeen123/best-saas-kit) | Production‑ready Next.js SaaS starter with Supabase auth/DB, Stripe billing and Prisma schema management. | TypeScript | 268 |
| [Next-Elite](https://github.com/salmanshahriar/Next-Elite) | Production-ready Next.js starter kit with API-driven features, auth, RBAC, i18n and developer tooling. | TypeScript | 106 |
| [Create-Epoch-APP](https://github.com/RhysSullivan/create-epoch-app) | Opinionated full-stack monorepo starter using Effect, Convex and Next.js with observability tooling. | TypeScript | 95 |
| [next15-multitenant-ecommerce](https://github.com/code-with-antonio/next15-multitenant-ecommerce) | Multi-tenant e-commerce starter with Next.js, Payload CMS, MongoDB and Stripe Connect. | TypeScript | 34 |
| [agent-service-toolkit](https://github.com/JoshuaC215/agent-service-toolkit) | Toolkit for running AI agent services built with LangGraph, FastAPI and Streamlit. | Python | 4,424 |
| [Marshal-Saas](https://github.com/ski043/Marshal-Saas) | SaaS starter template using Next.js, Stripe, Kinde, Prisma, Supabase and Tailwind. | TypeScript | 131 |
| [jstack](https://github.com/upstash/jstack) | Toolkit to help ship high-performance, low-cost Next.js applications. | TypeScript | 3,748 |

### Databases, query engines & storage systems

Relational, NoSQL, distributed, analytical, embedded, cache, and other persistent query/storage engines.

#### Semantic-reviewed (71)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Supabase](https://github.com/supabase/supabase) | Open-source Postgres platform offering DB hosting, auth, APIs, storage and realtime. | TypeScript | 107,342 |
| [claude-mem](https://github.com/thedotmack/claude-mem) | Persistent memory engine for agents that captures, compresses, and restores session context. | JavaScript | 91,015 |
| [Elasticsearch](https://github.com/elastic/elasticsearch) | Distributed search and analytics engine (vector/full-text) built on Lucene for scalable storage and retrieval. | Java | 77,630 |
| [nocodb](https://github.com/nocodb/nocodb) | Open‑source Airtable alternative that exposes databases as a no‑code platform with REST APIs. | TypeScript | 64,569 |
| [duckdb](https://github.com/duckdb/duckdb) | Analytical in-process SQL OLAP database engine for efficient analytical queries. | C++ | 40,321 |
| [qdrant](https://github.com/qdrant/qdrant) | High-performance vector database and similarity search engine for AI applications. | Rust | 34,029 |
| [surrealdb](https://github.com/surrealdb/surrealdb) | Scalable, distributed document‑graph database built for realtime web and collaborative apps. | Rust | 32,899 |
| [Cognee](https://github.com/topoteretes/cognee) | Open-source knowledge engine combining vector search and graph stores for agent memory and retrieval. | Python | 29,642 |
| [OpenViking](https://github.com/volcengine/OpenViking) | Context database for AI agents managing memory, resources and skills via a filesystem paradigm. | Python | 28,891 |
| [Plausible Analytics](https://github.com/plausible/analytics) | Privacy-focused, self-hosted web analytics platform using Elixir and ClickHouse/Postgres. | Elixir | 28,632 |
| [SpacetimeDB](https://github.com/clockworklabs/SpacetimeDB) | Relational database that embeds application logic and runs compiled app code inside the DB server. | Rust | 24,529 |
| [Dolt](https://github.com/dolthub/dolt) | Version-controlled SQL database combining Git-style operations with SQL queries. | Go | 22,216 |
| [Vitess](https://github.com/vitessio/vitess) | Cloud-native, horizontally scalable distributed database built around MySQL with automated sharding. | Go | 20,920 |
| [pgvector](https://github.com/pgvector/pgvector) | PostgreSQL extension that adds vector storage and similarity search capabilities. | C | 20,856 |
| [cube](https://github.com/cube-js/cube) | Open-source semantic layer and analytics engine for BI and embedded analytics. | Rust | 20,653 |
| [Turso Database](https://github.com/tursodatabase/turso) | In-process Rust SQL database compatible with SQLite, offering CDC and multi-language bindings. | Rust | 18,278 |
| [tigerbeetle](https://github.com/tigerbeetle/tigerbeetle) | High-performance transactional database designed for mission-critical financial workloads. | Zig | 16,821 |
| [convex-backend](https://github.com/get-convex/convex-backend) | Convex: an open-source reactive database designed for app developers. | TypeScript | 12,390 |
| [lancedb](https://github.com/lancedb/lancedb) | Serverless vector database for AI applications with ANN search and persistence. | Rust | 11,170 |
| [instant](https://github.com/instantdb/instant) | A realtime client-side database for local application storage and sync. | TypeScript | 10,391 |
| [Electric](https://github.com/electric-sql/electric) | Elixir read-path sync engine for Postgres enabling partial replication and scalable delivery. | Elixir | 10,092 |
| [seatunnel](https://github.com/apache/seatunnel) | Distributed, high-performance data integration and ETL/CDC platform for large-scale pipelines. | Java | 9,560 |
| [sqlite-vec](https://github.com/asg017/sqlite-vec) | SQLite extension that provides vector search capabilities and runs anywhere. | C | 8,023 |
| [helix-db](https://github.com/HelixDB/helix-db) | HelixDB: OLTP graph-vector database implemented in Rust. | Rust | 5,752 |
| [Openpanel](https://github.com/Openpanel-dev/openpanel) | OpenPanel: self-hosted product/web analytics using ClickHouse for real-time analytics. | TypeScript | 5,646 |
| [pgdog](https://github.com/pgdogdev/pgdog) | PostgreSQL connection pooler, load balancer and database sharder. | Rust | 5,418 |
| [OpenMemory](https://github.com/CaviraOSS/OpenMemory) | Self-hosted cognitive memory store for LLMs using SQLite or Postgres backends. | TypeScript | 3,970 |
| [pg_textsearch](https://github.com/timescale/pg_textsearch) | PostgreSQL extension implementing BM25 relevance-ranked full-text search. | C | 3,827 |
| [Gravitino](https://github.com/apache/gravitino) | Geo-distributed federated metadata lake and catalog with unified API and governance. | Java | 2,923 |
| [pg_lake](https://github.com/Snowflake-Labs/pg_lake) | Postgres extension that integrates Iceberg and DuckDB to turn Postgres into a transactional data lakehouse. | C | 1,497 |
| [pgGraph](https://github.com/Evokoa/pgGraph) | Provides graph-database capabilities and traversal functionality as extensions for Postgres. | Rust | 1,000 |
| [mem9](https://github.com/mem9-ai/mem9) | Persistent, shared memory service for AI agents with a server and TiDB-backed storage. | TypeScript | 978 |
| [safebucket](https://github.com/safebucket/safebucket) | On-prem file sharing system providing fast, secure local storage and sharing. | Go | 695 |
| [Create Context Graph](https://github.com/neo4j-labs/create-context-graph) | Neo4j Labs tool that transforms documents and data into Neo4j graph structures for AI workflows. | Python | 667 |
| [pgmcp](https://github.com/subnetmarco/pgmcp) | MCP server that enables natural-language querying of Postgres databases. | Go | 540 |
| [clickhouse-etl](https://github.com/glassflow/clickhouse-etl) | Open-source ingestion and transformation pipelines for ClickHouse data workflows. | TypeScript | 493 |
| [greplica](https://github.com/Autoloops/greplica) | Persistent, searchable engineering memory for AI coding agents. | TypeScript | 428 |
| [RX Data Store](https://github.com/creationix/rx) | Embedded RX data store format for efficient, queryable JSON-shaped data. | TypeScript | 380 |
| [TinyETL](https://github.com/alrpal/TinyETL) | Single‑binary Rust ETL tool for fast, zero‑config data movement and transformation across formats and DBs. | Rust | 294 |
| [pmb](https://github.com/oleksiijko/pmb) | Local-first persistent memory store for AI agents that saves decisions and facts in a single SQLite file. | Python | 290 |
| [Multigres Operator](https://github.com/multigres/multigres-operator) | Kubernetes operator for deploying and managing PostgreSQL clusters on Kubernetes. | Go | 265 |
| [streambed](https://github.com/viggy28/streambed) | Streams Postgres to Apache Iceberg on S3 via logical replication and exposes a Postgres wire protocol. | Go | 258 |
| [minisqlite](https://github.com/cursor/minisqlite) | Rust reimplementation of SQLite: SQL engine, planner, transactions and storage. | Rust | 247 |
| [Lux](https://github.com/lux-db/lux) | High-performance, Redis-compatible Rust key-value store with vector and time-series features. | Rust | 239 |
| [LocalRAG](https://github.com/2dogsandanerd/Knowledge-Base-Self-Hosting-Kit) | Self-hosted RAG memory layer with ChromaDB and FastAPI CRUD and search APIs. | Python | 239 |
| [pgContext](https://github.com/Evokoa/pgContext) | Postgres extension adding vector/ANN and hybrid dense+FT search inside PostgreSQL. | Rust | 179 |
| [jasonisnthappy](https://github.com/sohzm/jasonisnthappy) | Lightweight embedded Rust document database with ACID, MVCC, B-tree storage and REST API. | Rust | 166 |
| [yantrikdb-server](https://github.com/yantrikos/yantrikdb-server) | Cognitive memory database for AI agents with deduplication, contradiction detection and decay. | Rust | 163 |
| [syncular](https://github.com/syncular/syncular) | Offline-first data synchronization framework with local SQLite and server commit log. | TypeScript | 161 |
| [Infera](https://github.com/CogitatorTech/infera) | DuckDB extension enabling in-database ML inference using Tract and ONNX models. | Rust | 132 |
| [pgsemantic](https://github.com/varmabudharaju/pgsemantic) | Zero-config semantic search integration for any PostgreSQL database. | Python | 51 |
| [OpenWit](https://github.com/openwit-oss/openwit) | Distributed observability platform for ingesting, storing and querying metrics, logs and traces. | Rust | 49 |
| [KalamDB](https://github.com/kalamdb/KalamDB) | Realtime, storage-efficient SQL database with HTTP API, live subscriptions and hybrid RocksDB/Parquet storage. | Rust | 47 |
| [sketchlog](https://github.com/SBALAVIGNESH123/sketchlog) | Streaming metrics compression engine that massively reduces event size. | Python | 6 |
| [openanalytics](https://github.com/OpenLabs-so/openanalytics) | Privacy-first, self-hosted web analytics backend using Postgres and ClickHouse. | — | 0 |
| [mcp-memory](https://github.com/fellowgeek/mcp-memory) | MCP server that provides persistent LLM agent memory with file-backed records and SQLite FTS search. | — | 0 |
| [Limbo](https://github.com/tursodatabase/limbo) | In-process Rust SQL database compatible with SQLite, offering CDC, async I/O and multi-language bindings. | — | 0 |
| [Fluree AI](https://github.com/flur.ee/fluree-ai) | FlureeDB knowledge-graph database with RDF triples, temporal history and access control. | — | 0 |
| [documentdb](https://github.com/microsoft/documentdb) | Open-source DocumentDB engine implementing a MongoDB-compatible document database. | — | 0 |
| [Graphiti](https://github.com/getzep/graphiti) | Framework to build real-time knowledge graphs tailored for AI agents. | Python | 30,018 |
| [gbrain](https://github.com/garrytan/gbrain) | Long-term memory back-end for autonomous agents, storing world knowledge as markdown files. | TypeScript | 28,616 |
| [vanna](https://github.com/vanna-ai/vanna) | LLM-powered tool for chatting with SQL databases, producing text-to-SQL via RAG for accurate queries. | Python | 23,826 |
| [WrenAI](https://github.com/Canner/WrenAI) | Platform to make databases RAG-ready and improve Text-to-SQL accuracy and security. | TypeScript | 17,293 |
| [llm-graph-builder](https://github.com/neo4j-labs/llm-graph-builder) | Tools to construct Neo4j knowledge graphs from unstructured data using LLMs. | Jupyter Notebook | 5,173 |
| [Code-Graph-RAG](https://github.com/vitali87/code-graph-rag) | Parses codebases into a property graph (Memgraph) with RAG interface and Cypher querying. | Python | 4,528 |
| [memobase](https://github.com/memodb-io/memobase) | Profile-based long-term memory system for AI applications to persist and retrieve user memory. | Python | 2,845 |
| [pg-aiguide](https://github.com/timescale/pg-aiguide) | Framework providing PostgreSQL expertise and version-aware docs for AI coding assistants. | Python | 1,690 |
| [memory-os](https://github.com/ClaudioDrews/memory-os) | Persistent memory OS for agents: layered memory system using Qdrant and structured recall. | Python | 1,203 |
| [helicalinsight](https://github.com/helicalinsight/helicalinsight) | Open-source embedded BI platform for analytics, reporting and dashboards with many data connectors. | JavaScript | 386 |
| [WebBaseIII](https://github.com/DDecoene/WebBaseIII) | Browser-based dBASE III emulator with Node.js backend, multi-user sessions and SQLite persistence. | TypeScript | 51 |
| [AgentFS](https://github.com/penberg/agentfs) | Filesystem for AI agents that records operations in SQLite and supports FUSE/NFS and SDKs. | — | 0 |

#### High-specificity extension (55)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [ChatbotX](https://github.com/ChatbotXIO/ChatbotX) | ChatbotX is an open-source, agentic chat marketing platform that serves as a self-hostable alternative to proprietary tools like ManyChat, Chatfuel, a | TypeScript | 562 |
| [Stormkit](https://github.com/stormkit-io/stormkit-io) | Stormkit is a self-hostable platform designed as an alternative to services like Vercel and Netlify for deploying modern web applications. It provides | Go | 221 |
| [FreeFrame](https://github.com/Techiebutler/freeframe) | FreeFrame is a self-hosted, open-source media review platform designed as a privacy-conscious alternative to Frame.io for production houses and creati | TypeScript | 151 |
| [EmojiDB](https://github.com/ikwerre-dev/EmojiDB) | EmojiDB is a high-performance, embedded database engine written in Go that provides military-grade data security. It uniquely encrypts all data, heade | Go | 130 |
| [The Data Engineering Handbook](https://github.com/DataExpert-io/data-engineer-handbook) | A comprehensive curated resource hub designed to help aspiring and practicing data engineers build skills, find community, and discover the tools of t | — | 0 |
| [loomfeed](https://github.com/surya-koritala/loomfeed) | loomfeed is an open-source, Reddit-style discussion platform designed as a first-class environment for both humans and AI agents, addressing the gap l | — | 0 |
| [discourse](https://github.com/discourse/discourse) | A platform for community discussion. Free, open, simple. | Ruby | 47,668 |
| [codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp) | codebase-memory-mcp is a high-performance code-intelligence MCP server that indexes codebases into a persistent knowledge graph in milliseconds. It su | C | 36,876 |
| [qm](https://github.com/yc-software/qm) | QM is an open-source multiplayer agent harness designed for startups that need to deploy AI agents across an organization rather than as personal assi | TypeScript | 11,438 |
| [Claude Relay Service](https://github.com/Wei-Shaw/claude-relay-service) | The Claude Relay Service (CRS) is an open-source JavaScript service designed to provide a unified, cost-effective access layer for various AI models, | JavaScript | 11,138 |
| [GitFut](https://github.com/Younesfdj/gitfut) | GitFut transforms any GitHub profile into a FIFA-style player card scored out of 99, addressing the lack of a fun, visual way to showcase developer ac | TypeScript | 2,396 |
| [Grapefruit](https://github.com/ChiChou/grapefruit) | Grapefruit is an open-source mobile security testing suite designed for comprehensive analysis of iOS and Android applications. It functions as a runt | TypeScript | 1,282 |
| [Chief](https://github.com/SmileLikeYe/agent-chief) | Chief is a local-first attention layer that sits between you and every notification source — agents, alerts, CI, RSS, and watchers — deciding whether | Python | 1,016 |
| [waggle](https://github.com/modiqo/waggle) | Waggle is a reference layer for agent-to-agent handoffs that replaces the costly practice of pasting full artifacts into every subagent prompt with a | Rust | 795 |
| [Coding Flashcards](https://github.com/ad-si/Coding-Flashcards) | coding workflows to distributed systems and developer utilities, these projects are gaining attention in the open-source community. Without wasting ti | Rust | 741 |
| [waku-agent](https://github.com/ShenSeanChen/waku-agent) | Waku-agent is a local-first personal AI assistant that exposes the four core pillars of any serious agent—harness, loop, memory, and eval/LLM-ops—as r | Python | 678 |
| [turbolite](https://github.com/russellromney/turbolite) | Turbolite is a SQLite virtual file system written in Rust that serves queries directly from S3 buckets. ZSTD page-level compression and intelligent B- | Rust | 465 |
| [paxm](https://github.com/pax-beehive/paxm) | PAXM is a persistent, provider-neutral memory layer that carries decisions, conventions, and working context across coding-agent sessions, eliminating | Go | 435 |
| [Workbench](https://github.com/pontusab/workbench) | Workbench. Local environment for AI experimentation | TypeScript | 410 |
| [GroupMQ](https://github.com/Openpanel-dev/groupmq) | GroupMQ is a high-performance, Redis-backed FIFO queue designed for Node.js and TypeScript applications. It provides reliable job management with a un | TypeScript | 366 |
| [Switchboard](https://github.com/doctly/switchboard) | Switchboard is the missing layer. It's a desktop app built with Electron and SQLite that organizes all your CLI coding sessions by project, gives you | JavaScript | 315 |
| [Spool](https://github.com/spool-lab/spool) | Spool is a local-first search engine designed to index and instantly search personal AI data and bookmarks. It aggregates information from various sou | TypeScript | 288 |
| [codex-hygiene](https://github.com/sunflower-of-parchman/codex-hygiene) | Codex Hygiene is a read-only Codex Desktop skill that audits context and tool usage to identify sources of unnecessary token consumption. It provides | Python | 250 |
| [deltax](https://github.com/xataio/deltax) | Fast time-series extension for PostgreSQL | Rust | 246 |
| [ClawMem](https://github.com/yoloshii/ClawMem) | ClawMem fixes that. It's a local memory context engine for Claude code and open claw that runs hybrid rag retrieval on your GPU | TypeScript | 188 |
| [spaceprojectsim](https://github.com/Kalcode/spaceprojectsim) | The Space Project is a self-running space-economy simulator built in Rust with the Bevy game engine, where hundreds of autonomous agents—ships, facili | Rust | 179 |
| [riptide](https://github.com/Foxemsx/riptide) | Riptide is a terminal-based internet speed test and live bandwidth monitor written in Go that combines one-shot speed measurements with continuous tra | Go | 167 |
| [OpenSlides](https://github.com/codewiththiha/OpenSlides) | OpenSlides is a free, open-source desktop application that transforms source code into polished, presentation-ready slide decks with smooth Magic Move | TypeScript | 160 |
| [app-monitor](https://github.com/jcranokc/app-monitor) | App Monitor is a native, local-first macOS utility that consolidates application usage tracking, storage analysis, cleanup review, update checking, an | Swift | 157 |
| [shumai](https://github.com/shumaiOne/shumai) | Shumai is an open-source, AI-native creative collaboration platform designed as an alternative to Frame.io for media review and production workflows. | TypeScript | 156 |
| [Gazetteer](https://github.com/SOORAJTS2001/gazetteer) | Gazetteer is a fast, offline, and boundary-aware reverse geocoding library written in Python. It provides highly accurate location data by utilizing a | Python | 156 |
| [ctx](https://github.com/dchu917/ctx) | CTX introduces isolated workstreams with exact transcript binding. Branch your AI's memory safely without it jumping to the newest chat on disk | Python | 128 |
| [reame](https://github.com/swellweb/reame) | Reame is a lean, CPU-first LLM inference server built on llama.cpp, designed to run useful models on cheap or free-tier hardware such as shared vCPUs | C++ | 102 |
| [adam](https://github.com/sqliteai/adam) | Adam is an AI agent library written in C, and the pitch is basically SQLite but for agents. One header file, one static library | C | 96 |
| [gitgres](https://github.com/calebwin/gitgres) | Gitgres asks a fun question. What if they lived inside Postgres instead | Rust | 93 |
| [ezra](https://github.com/entGriff/ezra) | Ezra offers a lightweight persistent alternative. It is backed by SQLite and powered by Erlang, running as a single binary with zero dependencies | Elixir | 85 |
| [hiraeth](https://github.com/SethPyle376/hiraeth) | Local AWS emulator focused on fast integration testing, with SQS support, SQLite-backed state, and a debug-friendly web UI. | Rust | 73 |
| [earth-game](https://github.com/skorotkiewicz/earth-game) | Earth Game is an offline, privacy-focused CLI tool that reframes personal life goals as manageable quests, helping users break down ambitions into con | Python | 69 |
| [jarvis](https://github.com/alexberardi/jarvis) | A self-hosted, privacy-first voice assistant that runs entirely on local hardware, eliminating reliance on cloud services for speech recognition, lang | Shell | 61 |
| [lumio](https://github.com/markusthiel/lumio) | Self-hosted client galleries for photographers — proofing, image selection, print shop, AI tagging. GDPR-native, your data stays with you. A source-av | TypeScript | 49 |
| [Expense Budget Tracker](https://github.com/kirill-markin/expense-budget-tracker) | Expense Budget Tracker is a self-hosted, open-source personal finance application that helps users record transactions, track account balances, transf | TypeScript | 24 |
| [Multithreaded PostgreSQL](https://github.com/samwillis/multithreaded-postgres) | Multithreaded PostgreSQL implementation. Multithreaded PostgreSQL is an open-source project that explores a multithreaded execution model for PostgreS | C | 23 |
| [FlowState](https://github.com/dialectforge/FlowStateV1.1) | Development memory that flows between sessions. An MCP server that gives Claude persistent memory about your projects. | TypeScript | 18 |
| [cubby-clipboard](https://github.com/tsouth89/cubby-clipboard) | A native-feeling Windows 11 clipboard history replacement: persistent, searchable, private, and reliable. Local OCR so screenshots are searchable. | Rust | 8 |
| [LightCrawl](https://github.com/yosuke1024/LightCrawl) | LightCrawl is a self-hosted, single-container web scraping API and Model Context Protocol (MCP) server that converts web pages into clean Markdown for | HTML | 3 |
| [VoCat](https://github.com/MengMengCode/VoCat) | Vocat is a web control panel for Quectel EC20 and EC25 cellular modems. One go binary with the React front end embedded and SQLite inside | — | 0 |
| [River](https://github.com/bmdavis419/river) | River is a framework designed to simplify the complex task of managing AI agent streams, offering full-stack type safety for stream chunks. It provide | — | 0 |
| [outreachr](https://github.com/lalalune/outreachr) | Outreachr is a free, open-source fundraising operating system designed for founders running pre-seed, seed, or Series A rounds, consolidating investor | — | 0 |
| [Neura Hustle Tracker](https://github.com/adolfousier/neura-hustle-tracker) | Neura Hustle Tracker is a command-line application designed to monitor and track the time spent across various applications during work sessions. Buil | — | 0 |
| [multi-agent-discuss](https://github.com/sjc88661/multi-agent-discuss) | Multi-Agent Workbench is a local-first control room that orchestrates multiple coding agents—Claude Code, Codex CLI, or any PTY-based CLI—as a discipl | — | 0 |
| [lazypg](https://github.com/rebelice/lazypg) | lazypg is a simple, terminal-based user interface for PostgreSQL, designed to eliminate the need for context-switching between the terminal and heavy | — | 0 |
| [kucoin-klines](https://github.com/gudlc/kucoin-klines) | Collect and save Kucoin's Candlestick data to MongoDB | — | 0 |
| [KADATH](https://github.com/i3T4AN/KADATH) | KADATH is an open-source framework that applies Darwinian evolution to AI agent development, automatically generating and progressively improving agen | — | 0 |
| [Cloudflare Computer](https://github.com/cloudflare/computer) | Cloudflare Computer is a virtual filesystem and pluggable execution environment built on Cloudflare's Durable Objects, providing a single workspace ab | — | 0 |
| [canivibecodeit](https://github.com/canivibecodeit/canivibecodeit) | Can I Vibecode It is a community-driven directory that rates popular SaaS subscriptions by whether an AI coding agent (like Claude Code, Codex, or Cur | — | 0 |

### Schema design, migrations, ORMs & data access

Schema management, migrations, object-relational mapping, query construction, and database access layers.

#### Semantic-reviewed (14)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Prisma](https://github.com/prisma/prisma) | Next-generation ORM for Node.js/TypeScript with Prisma Client, Migrate and Studio for many databases. | TypeScript | 45,775 |
| [drawdb](https://github.com/drawdb-io/drawdb) | Online database design tool and ERD editor that generates SQL schemas. | JavaScript | 39,125 |
| [typeorm](https://github.com/typeorm/typeorm) | ORM for TypeScript/JavaScript supporting MySQL, PostgreSQL, MariaDB, SQLite, SQL Server and more. | TypeScript | 36,631 |
| [chartdb](https://github.com/chartdb/chartdb) | Open-source database diagram editor to visualize and design schemas from SQL queries. | TypeScript | 22,739 |
| [efcore](https://github.com/dotnet/efcore) | EF Core: object-relational mapper for .NET with LINQ, change tracking and migrations. | C# | 14,628 |
| [postgres](https://github.com/porsager/postgres) | Postgres.js – a fast, full-featured PostgreSQL client for Node.js and Deno. | JavaScript | 8,702 |
| [Oxyde](https://github.com/mr-fatalyst/oxyde) | Async, type-safe Python ORM with a high-performance Rust core, migrations and Django-like API. | Python | 696 |
| [sqltoerdiagram](https://github.com/royalbhati/sqltoerdiagram) | Client-side ER diagram generator: paste CREATE TABLE statements to get an interactive ERD. | HTML | 529 |
| [Onlymaps](https://github.com/manoss96/onlymaps) | Lightweight Python micro‑ORM that maps plain SQL results to Python objects with sync/async support. | Python | 326 |
| [better-drizzle](https://github.com/almeidazs/better-drizzle) | Repository layer wrapping Drizzle ORM to reduce query boilerplate with typed APIs and plugins. | TypeScript | 294 |
| [bun-sqlgen](https://github.com/ilbertt/bun-sqlgen) | Codegen tool that infers TypeScript types from SQL using migrations as the schema source. | TypeScript | 100 |
| [vibecode-db](https://github.com/GeekyAnts/vibecode-db) | Unified front-end database API with pluggable adapters for multiple backends. | TypeScript | 23 |
| [Prisma Client Python](https://github.com/majdyz/prisma-client-py) | Type-safe Prisma client implementation for Python to access databases. | Python | 5 |
| [TailwindSQL](https://github.com/mmarinovic/tailwindsql) | Framework translating Tailwind-like class names into SQL for React Server Components using SQLite. | TypeScript | 1,293 |

#### High-specificity extension (5)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Huobao Drama - AI Short Drama Generation Platform](https://github.com/chatfire-AI/huobao-drama) | Huobao Drama is an end-to-end, AI-powered platform designed for the fully automated generation of short dramas, transforming a single script into a co | TypeScript | 10,139 |
| [Zen7 Payment Agent](https://github.com/Zen7-Labs/Zen7-Payment-Agent) | The Zen7 Payment Agent is the initial practical implementation of the Decentralized Payment Agent (DePA) protocol, pioneering next-generation intellig | Python | 178 |
| [Copilot Workshops](https://github.com/github-samples/copilot-workshops) | Copilot Workshops provides guided, hands-on content for learning GitHub Copilot's agentic capabilities—including the Copilot CLI, VS Code agent mode, | JavaScript | 67 |
| [klee-service](https://github.com/signerlabs/klee-service) | Klee-service is a Python backend service that powers the Klee application, a desktop tool developed by signerlabs. It serves as the server-side compon | Python | 33 |
| [Routario](https://github.com/bkbilly/Routario) | Routario is a self-hosted, open-source GPS fleet tracking platform that connects directly to hardware via TCP/UDP, eliminating subscription fees and k | Python | 31 |

### Database administration, maintenance, backup & observability

Database clients, administrative UIs, backup/restore, monitoring, tuning, replication, and operational maintenance.

#### Semantic-reviewed (20)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [grafana](https://github.com/grafana/grafana) | Open composable observability platform for visualizing metrics, logs, and traces from many sources. | TypeScript | 76,253 |
| [DBeaver](https://github.com/dbeaver/dbeaver) | Universal multi-platform database client and administration tool supporting many drivers. | Java | 49,642 |
| [DBX](https://github.com/t8y2/dbx) | Cross-platform developer DB tool/CLI for connecting, querying, migrating and managing multiple databases. | Rust | 12,862 |
| [databasus](https://github.com/databasus/databasus) | PostgreSQL backup tool offering point-in-time recovery and restore verification. | Go | 7,535 |
| [sqlit](https://github.com/Maxteabag/sqlit) | TUI SQL client for multiple databases with SSH tunneling and connection management. | Python | 4,051 |
| [GoBackup](https://github.com/gobackup/gobackup) | CLI tool for scheduled backups of databases and files to various cloud storage providers. | Go | 2,674 |
| [data-peek](https://github.com/Rohithgilla12/data-peek) | Desktop advanced SQL client with AI assistant, schema exploration, and query telemetry. | TypeScript | 1,578 |
| [sql-tap](https://github.com/mickamy/sql-tap) | Real-time SQL traffic proxy and viewer for inspecting queries and transactions. | Go | 1,464 |
| [portabase](https://github.com/Portabase/portabase) | Unified backup and restore tool supporting Postgres, MySQL, MariaDB, MongoDB, Redis and more. | TypeScript | 1,073 |
| [gridex](https://github.com/gridex/gridex) | Native database IDE for macOS/Windows connecting to Postgres, MySQL, SQLite, and Redis. | C++ | 579 |
| [tsql](https://github.com/fcoury/tsql) | Keyboard-first TUI CLI for managing PostgreSQL and MongoDB with query execution and schema-aware autocomplete. | Rust | 404 |
| [BackVault](https://github.com/mvfc/backvault) | Dockerized backup service for Bitwarden/Vaultwarden that exports encrypted vaults and manages retention. | Python | 277 |
| [DB Studio](https://github.com/husamql3/db-studio) | Universal database management studio with React frontend and Hono/Node backend for DB administration. | TypeScript | 209 |
| [sqview](https://github.com/mendrik-private/sqv) | SQLite viewer (TUI) for inspecting and browsing sqlite3 databases. | Rust | 164 |
| [MyWebSQL](https://github.com/Samnan/MyWebSQL) | Web-based database administration tool for MySQL, Postgres, SQLite, etc. | PHP | 130 |
| [backdoor](https://github.com/tanin47/backdoor) | Self‑hostable tool for querying and editing PostgreSQL, SQLite and ClickHouse with security features. | Java | 43 |
| [pgbot](https://github.com/pgrundev/pgbot) | Agentless PostgreSQL diagnostic tool producing deterministic health findings and baselines. | — | 0 |
| [pam](https://github.com/eduardofuncao/pam) | Minimal TUI CLI for managing, stashing and executing SQL across Postgres, MySQL, SQLite, SQL Server and DuckDB. | — | 0 |
| [Chat2DB](https://github.com/CodePhiliaX/Chat2DB) | AI-driven GUI SQL client supporting many databases for querying and DB management. | — | 0 |
| [PGSimCity](https://github.com/NikolayS/PGSimCity) | Interactive 3D visualization that models PostgreSQL internals to teach DB mechanics and failure modes. | TypeScript | 462 |

#### High-specificity extension (2)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [zsvirt](https://github.com/ZSvirt/zsvirt) | ZSvirt is an open-source virtualization platform that brings the enterprise-proven ZSphere engine from ZStack into the community, offering a lightweig | — | 0 |
| [Elato Local](https://github.com/akdeb/Elato-Local) | Local database performance, cloud storage scale. The gap between the two just got a lot smaller | — | 0 |

### Authentication, authorization & API security

Identity, access control, auth protocols, API credentials, and server-side security foundations.

#### Semantic-reviewed (12)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [infisical](https://github.com/Infisical/infisical) | Open-source secret management platform for syncing secrets, preventing leaks and managing internal PKI. | TypeScript | 28,813 |
| [authentic](https://github.com/goauthentik/authentik) | Open-source Identity Provider supporting SAML, OAuth2/OIDC, LDAP and RADIUS for self-hosted SSO. | Python | 24,905 |
| [supertokens-core](https://github.com/supertokens/supertokens-core) | Open‑source alternative to Auth0/Firebase Auth/Cognito providing session and auth services. | Java | 15,258 |
| [Logto](https://github.com/logto-io/logto) | Open-source identity provider supporting OIDC/OAuth2/SAML, SSO, RBAC and multi-tenancy. | TypeScript | 14,263 |
| [Tinyauth](https://github.com/steveiliop56/tinyauth) | Minimal Go authentication/authorization server supporting OAuth, LDAP, SSO and reverse proxies. | Go | 7,235 |
| [open-connector](https://github.com/oomol-lab/open-connector) | OpenConnector: authentication gateway centralizing OAuth, token management and connector catalog. | TypeScript | 3,959 |
| [VoidAuth](https://github.com/voidauth/voidauth) | Self‑hosted SSO provider implementing OIDC, ForwardAuth, MFA and user/group management. | TypeScript | 1,946 |
| [OneCLI](https://github.com/onecli/onecli) | Open credential vault and Rust gateway that injects secrets for AI agents with encrypted store. | TypeScript | 1,802 |
| [NodeWarden](https://github.com/shuaiplus/NodeWarden) | Self-hosted, Bitwarden-compatible password manager built on Cloudflare Workers (serverless). | TypeScript | 1,682 |
| [keypal](https://github.com/izadoesdev/keypal) | TypeScript library for secure API key management with pluggable storage, hashing, scopes and caching. | TypeScript | 199 |
| [Better Auth Localization](https://github.com/marcellosso/better-auth-localization) | TypeScript plugin to provide automatic localization of Better Auth error messages. | TypeScript | 176 |
| [PulseWeaver](https://github.com/DiegoGuidaF/PulseWeaver) | Self-hosted forward-auth sidecar for reverse proxies enforcing device- and host-based access. | TypeScript | 45 |

#### High-specificity extension (29)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Better Auth](https://github.com/better-auth/better-auth) | Better Auth is a comprehensive, framework-agnostic authentication and authorization library built for TypeScript applications. It provides a complete | TypeScript | 27,871 |
| [NetBird](https://github.com/netbirdio/netbird) | NetBird is a platform designed to create secure, private overlay networks for organizations and homes using a WireGuard-based mesh architecture. It fa | Go | 24,528 |
| [Wizarr](https://github.com/wizarrrr/wizarr) | Wizarr is an advanced Python-based system designed for automatic user invitation and management across various self-hosted media servers. It simplifie | Python | 2,795 |
| [mcp2cli](https://github.com/knowsuchagency/mcp2cli) | mcp2cli is a Python-based command-line interface designed to transform any MCP, OpenAPI, or GraphQL server into an accessible CLI at runtime, eliminat | Python | 1,986 |
| [NodeCast TV](https://github.com/technomancer702/nodecast-tv) | NodeCast TV is a high-performance, self-hosted web application designed for streaming Live TV, Movies, and Series directly from Xtream Codes or M3U pr | JavaScript | 1,154 |
| [server](https://github.com/Sync-in/server) | The Sync-in server is a secure, open-source platform designed for self-hosted file storage, sharing, and collaboration. Built on TypeScript and Node.j | TypeScript | 1,024 |
| [FileRise](https://github.com/error311/FileRise) | FileRise is a lightweight, self-hosted file manager and storage hub designed for secure, centralized file management. It provides robust features incl | JavaScript | 942 |
| [dashwise](https://github.com/andreasmolnardev/dashwise) | Dashwise is a self-hosted homelab dashboard built to consolidate links, widgets, glanceable information, and service integrations into a single config | TypeScript | 437 |
| [polaris](https://github.com/code-with-antonio/polaris) | Polaris is an open-source, browser-based cloud IDE designed as a Cursor AI alternative, addressing the need for an AI-powered coding environment witho | TypeScript | 361 |
| [Rootprint](https://github.com/rootprint/rootprint) | Rootprint is an open-source, self-hosted log management platform that gives engineering teams full-text log search without relying on hosted SaaS prov | TypeScript | 78 |
| [dashwise](https://github.com/andreasmolnardev/dashwise-next) | Dashwise is a self-hosted dashboard designed to centralize and manage a homelab environment. It provides a unified interface for organizing links, man | — | 0 |
| [reverse-skill](https://github.com/zhaoxuya520/reverse-skill) | reverse-skill is a cybersecurity skills router that guides AI coding agents (Claude Code, Codex, Cursor, OpenCode) through reverse engineering, CTF, a | PowerShell | 26,003 |
| [pocket-id](https://github.com/pocket-id/pocket-id) | A simple and easy-to-use OIDC provider that allows users to authenticate with their passkeys to your services. | Go | 8,206 |
| [fleet](https://github.com/fleetdm/fleet) | Open-source platform for IT, security, and infrastructure teams. (Linux, macOS, Chrome, Windows, cloud, data center) | Go | 6,730 |
| [ezBookkeeping](https://github.com/mayswind/ezbookkeeping) | ezBookkeeping is a lightweight, self-hosted personal finance application designed for comprehensive expense tracking and financial management. Built p | Go | 4,654 |
| [slskd](https://github.com/slskd/slskd) | slskd is a modern, headless client-server application for the Soulseek peer-to-peer file-sharing network, designed to run as a daemon or Docker contai | C# | 3,661 |
| [MediaManager](https://github.com/maxdorninger/MediaManager) | MediaManager is a modern, selfhosted media management system built in Python designed to organize and automate personal media libraries. It serves as | Python | 3,180 |
| [Alexandrie](https://github.com/Smaug6739/Alexandrie) | Alexandrie is a self-hosted, open-source knowledge base designed to provide a fast and feature-rich note-taking experience built around extended Markd | Vue | 2,265 |
| [Poznote](https://github.com/timothepoznanski/poznote) | Poznote is a personal note-taking and documentation platform designed for writing, organizing, and synchronizing technical and personal notes. Built p | JavaScript | 567 |
| [Elements](https://github.com/crafter-station/elements) | Elements is a comprehensive collection of full-stack shadcn/ui blocks designed to accelerate development in the agentic era. Built with TypeScript and | TypeScript | 487 |
| [folderhost](https://github.com/MertJSX/folderhost) | FolderHost is a self-hosted cloud platform packaged as a single executable, enabling users to store, share, and collaborate on files without the compl | TypeScript | 311 |
| [openfit](https://github.com/FlavioAdamo/openfit) | OpenFit is a privacy-focused, desktop-first Electron dashboard that surfaces Fitbit Air and other Fitbit device data through Google's Health API v4, r | TypeScript | 264 |
| [aurl](https://github.com/ShawnPana/aurl) | aurl is a command-line tool written in Go designed to transform any API specification into a usable CLI interface. It supports various standards, incl | Go | 159 |
| [Traefikr](https://github.com/allfro/traefikr) | Traefikr is a web user interface designed to simplify the management of Traefik configurations. It addresses the complexity of traditional YAML config | TypeScript | 101 |
| [obsidian-headless-sync-docker](https://github.com/Belphemur/obsidian-headless-sync-docker) | provides a Dockerized solution for continuously syncing an Obsidian vault using the official `obsidian-headless` client. It is designed to be a minima | Dockerfile | 82 |
| [ComPDF Self-Hosted](https://github.com/ComPDF/compdf-self-hosted) | **Note:** This repository has been moved to [ComPDFKit/compdf-self-hosted](https://github.com/ComPDFKit/compdf-self-hosted) and is no longer maintaine | TypeScript | 80 |
| [producthunt-mcp-server](https://github.com/jaipandya/producthunt-mcp-server) | Product Hunt MCP Server bridges Product Hunt's API with any LLM or agent that speaks the Model Context Protocol, enabling AI assistants and chatbots t | Python | 53 |
| [Toolport](https://github.com/toolport.app/toolport) | Toolport is a free, open-source local MCP gateway that consolidates many Model Context Protocol servers behind a single local endpoint. Users configur | — | 0 |
| [Santa](https://github.com/northpolesec/santa) | Santa is a binary authorization system for macOS that monitors and controls process execution and file access to protect users from unauthorized or ma | — | 0 |

### Backend operations, reliability & API lifecycle

API gateways, observability, service management, health, reliability patterns, and lifecycle operations.

#### Semantic-reviewed (27)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Netdata](https://github.com/netdata/netdata) | Real-time infrastructure monitoring and observability platform with per-second metrics and anomaly detection. | C | 78,503 |
| [PostHog](https://github.com/PostHog/posthog) | Open-source self-hosted product analytics platform with session recording, feature flags and A/B testing. | Python | 37,722 |
| [mlflow](https://github.com/mlflow/mlflow) | Open-source ML lifecycle platform for tracking, deployment, and model observability. | Python | 27,550 |
| [Beszel](https://github.com/henrygd/beszel) | Lightweight server monitoring hub capturing historical metrics, docker stats, and alerts. | Go | 24,341 |
| [helicone](https://github.com/Helicone/helicone) | Open-source LLM observability platform to monitor, evaluate, and experiment with large models and agents. | TypeScript | 6,077 |
| [flipt](https://github.com/flipt-io/flipt) | Enterprise-ready, Git-native feature flag management service with APIs and observability. | Go | 4,871 |
| [MCP Gateway](https://github.com/IBM/mcp-context-forge) | AI Gateway/registry that federates APIs, provides governance, observability, rate limiting and auth for AI infra. | Python | 3,589 |
| [Observal](https://github.com/Observal/Observal) | Self-hosted control plane and registry for internal AI components with API, UI, telemetry, and storage. | Python | 2,251 |
| [Portracker](https://github.com/mostafa-wahied/portracker) | Self-hosted port monitoring and service discovery tool with network scanning and visual dashboard. | JavaScript | 2,094 |
| [Resterm](https://github.com/unkn0wn-root/resterm) | Terminal-based API client supporting HTTP, GraphQL, gRPC, WebSockets, OAuth and advanced workflow automation. | Go | 1,600 |
| [pandaprobe](https://github.com/chirpz-ai/pandaprobe) | Agent-engineering platform for traces, evals, and metrics to debug and improve AI agents. | Python | 754 |
| [Convex-Helpers](https://github.com/get-convex/convex-helpers) | TypeScript utilities extending Convex with helpers for APIs, caching, RLS, CRUD and OpenAPI. | TypeScript | 456 |
| [moneat](https://github.com/moneat-io/moneat) | Self-hosted observability platform unifying APM, logging, metrics, tracing and incidents. | Kotlin | 371 |
| [mails](https://github.com/chekusu/mails) | Email infrastructure for AI agents: send/receive, parsing, verification and multiple storage backends with self-host options. | TypeScript | 292 |
| [netmon](https://github.com/Role1776/netmon) | Self-hosted network monitoring bot that logs speedtests and LAN scans to SQLite and posts reports to Telegram/Discord. | Python | 266 |
| [Rudel](https://github.com/obsessiondb/rudel) | Analytics pipeline collecting coding session transcripts and metadata into ClickHouse to produce dashboards and metrics. | TypeScript | 256 |
| [OVPN Manager](https://github.com/eylandoo/openvpn_webpanel_manager) | Flask-based web panel for centralized management of OpenVPN, WireGuard and other VPN servers. | Shell | 203 |
| [rocketplaneIO](https://github.com/olemeyer/rocketplaneIO) | AI-driven SRE platform for Kubernetes providing zero-instrumentation observability, remediation, and ClickHouse backend. | Go | 174 |
| [uptimekit](https://github.com/uptimekit/uptimekit) | Distributed uptime monitoring and status-page system with workers, Redis/Postgres, and optional analytics. | TypeScript | 95 |
| [Social Flood](https://github.com/rainmanjam/social-flood) | Python API aggregating Google services with Redis caching, rate limiting, Prometheus metrics. | Python | 64 |
| [cronpulse-community](https://github.com/techfort/cronpulse-community) | Lightweight self-hosted monitoring service for scheduled jobs with API, alerts, Docker and SQLite. | Python | 18 |
| [Clopus Watcher](https://github.com/kubeden/clopus-watcher) | Kubernetes operations and reliability agent that inspects pods/logs and reports issues. | — | 0 |
| [Remotely](https://github.com/immense/Remotely) | Remote control and remote scripting platform for managing machines using .NET and SignalR. | C# | 5,073 |
| [agentsview](https://github.com/kenn-io/agentsview) | Local-first session search and analytics for coding agents with sqlite-backed dashboards. | Go | 4,655 |
| [agentgateway](https://github.com/agentgateway/agentgateway) | Agentic proxy/gateway for AI agents and MCP servers offering reverse-proxy/service-mesh capabilities. | Rust | 4,396 |
| [foglamp](https://github.com/foglamp-labs/foglamp) | Observability layer for the Vercel AI SDK to monitor AI SDK operations. | TypeScript | 302 |
| [agentic-os](https://github.com/modimihir07/agentic-os) | Multi-agent orchestration platform with scheduler, skills hub, memory and backup features. | JavaScript | 144 |

#### High-specificity extension (11)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [OmniRoute](https://github.com/diegosouzapw/OmniRoute) | OmniRoute is a free, MIT-licensed AI gateway that unifies 290+ providers (90+ offering free tiers) and 500+ models—including Claude, GPT, Gemini, GLM, | TypeScript | 36,262 |
| [Dagger](https://github.com/dagger/dagger) | Dagger is an automation engine designed to build, test, and ship any codebase reliably and at scale. It provides a platform that makes software delive | Go | 15,679 |
| [OpenWA](https://github.com/rmyndharis/OpenWA) | programmable WhatsApp automation, and OpenSwarm coordinates collaborative AI agents through swarm-style execution | TypeScript | 10,191 |
| [NetGoat](https://github.com/netgoat-xyz/netgoat) | NetGoat is a blazing-fast, self-hostable reverse proxy and traffic manager designed to provide Cloudflare-like features for free. It functions as a po | Go | 732 |
| [DockTail](https://github.com/marvinvr/docktail) | DockTail is a Go-based tool designed to automatically expose Docker containers as secure Tailscale Services, creating a zero-configuration service mes | Go | 685 |
| [nanocodex](https://github.com/gakonst/nanocodex) | Nanocodex is a Rust framework that provides composable, library-first building blocks for building frontier OpenAI coding agents, mirroring Codex-leve | Rust | 335 |
| [SpamEater](https://github.com/rufftruffles/spameater) | SpamEater is a self-hosted, open-source disposable email service designed to enhance privacy and security for testing and sign-up purposes. It provide | JavaScript | 188 |
| [Stonks Dashboard](https://github.com/pierridotite/stonks-dashboard) | The Stonks Dashboard is a real-time financial monitoring tool designed for the command-line interface (CLI). It provides a cyberpunk-style visualizati | JavaScript | 169 |
| [Schengen Visa](https://github.com/ibidi/schengen-visa) | The Schengen Visa library is a modern TypeScript tool designed for checking appointment availability across 17+ Schengen countries. It provides a robu | TypeScript | 95 |
| [Go Invoice Ninja](https://github.com/AshkanYarmoradi/go-invoice-ninja) | The Go Invoice Ninja SDK is a professional and idiomatic Go library designed to provide a clean interface for interacting with the Invoice Ninja API. | Go | 49 |
| [chatbot-template](https://github.com/shadcn-ui/chatbot-template) | A minimal starter template for building AI-powered chatbots with Next.js, the Vercel AI SDK, and shadcn/ui components. It demonstrates streaming chat | — | 0 |

### Caching, queues, events & background processing

Caching, job queues, message brokers, event streaming, schedulers, and durable background-work infrastructure.

#### Semantic-reviewed (20)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [huginn](https://github.com/huginn/huginn) | Self-hosted automation platform that runs agents to monitor, notify and act on events. | Ruby | 49,809 |
| [go-redis](https://github.com/redis/go-redis) | High-performance Go client library for Redis supporting cluster, pub/sub, pipelines and transactions. | Go | 22,048 |
| [automq](https://github.com/AutoMQ/automq) | Cloud-first message queue alternative to Kafka that decouples durability to S3/EBS for cost-effective autoscaling. | Java | 10,509 |
| [connect](https://github.com/redpanda-data/connect) | Operational stream-processing/connectors for Kafka, NATS, RabbitMQ and related messaging systems. | Go | 8,732 |
| [nifi](https://github.com/apache/nifi) | Apache NiFi: dataflow automation system for routing, transforming and processing data streams. | Java | 6,198 |
| [inngest](https://github.com/inngest/inngest) | Workflow orchestration platform for stateful step functions and AI workflows across serverless, servers, and the edge. | Go | 5,735 |
| [pgque](https://github.com/NikolayS/pgque) | Zero-bloat Postgres message queue implemented entirely in PL/pgSQL. | PLpgSQL | 1,713 |
| [Absurd](https://github.com/earendil-works/absurd) | Durable execution workflow system using PostgreSQL for exactly-once, crash-safe tasks. | Python | 1,637 |
| [sockudo](https://github.com/sockudo/sockudo) | High-performance self-hosted realtime server (Pusher-compatible) with durable history and adapters. | Rust | 793 |
| [rill-flow](https://github.com/weibocom/rill-flow) | High-performance workflow orchestration engine for distributed workloads and LLMs. | Java | 411 |
| [dbosify-py](https://github.com/dbos-inc/dbosify-py) | Postgres-backed durable workflow runtime for Python, intended as a Temporal replacement. | Python | 202 |
| [Petit](https://github.com/PedramNavid/petit) | Minimal Rust task orchestrator with DAG scheduling, cron-like jobs and optional HTTP API. | Rust | 129 |
| [safepilot](https://github.com/3DCF-Labs/safepilot) | Self-hosted Rust AI assistant that turns commands into DAG-based task runs with queuing and SQLite-backed context. | Rust | 120 |
| [kestra](https://github.com/joshpocock/kestra) | Workflow orchestration and scheduling platform with plugins; alternative to Airflow and Camunda. | Java | 30 |
| [QuickHub](https://github.com/RhysSullivan/quickhub) | GitHub mirror that ingests webhooks into Convex, processes event pipelines and maintains real-time caches. | — | 0 |
| [crawl4ai](https://github.com/unclecode/crawl4ai) | Open-source LLM-friendly web crawler and scraper for automated data ingestion. | Python | 78,513 |
| [MemU](https://github.com/NevaMind-AI/memU) | Memory framework that caches and structures agent insights into a hierarchical, searchable memory graph. | Python | 13,379 |
| [mcp-crawl4ai-rag](https://github.com/coleam00/mcp-crawl4ai-rag) | Web crawling and RAG ingestion capabilities for AI agents and coding assistants. | Python | 2,239 |
| [MCP Agent Mail](https://github.com/Dicklesworthstone/mcp_agent_mail) | Asynchronous mail-like coordination layer for multi-agent communication with SQLite-backed queues. | Python | 1,884 |
| [token-optimizer-mcp](https://github.com/ooples/token-optimizer-mcp) | Caching and compression middleware to drastically reduce tokens for Claude Code. | JavaScript | 487 |

#### High-specificity extension (16)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [ntfy.sh](https://github.com/binwiederhier/ntfy) | ntfy.sh (pronounced notify) is a simple HTTP-based pub-sub service for sending push notifications to phones, desktops, and servers without signing up | Go | 33,047 |
| [temporal](https://github.com/temporalio/temporal) | Temporal is a durable workflow orchestration platform for distributed systems, designed to make long-running, fault-tolerant business logic reliable a | Go | 22,018 |
| [Telegraf](https://github.com/influxdata/telegraf) | Agent for collecting, processing, aggregating, and writing metrics, logs, and other arbitrary data. | Go | 17,756 |
| [lavinmq](https://github.com/cloudamqp/lavinmq) | LavinMQ is an ultra-quick message queue server built from scratch in Crystal. Uses the same AMQP 0.9.1 protocol, so it's a drop-in replacement | Crystal | 971 |
| [sdk-typescript](https://github.com/temporalio/sdk-typescript) | Temporal TypeScript SDK is the official TypeScript framework for building durable, fault-tolerant workflows on the Temporal platform. It provides lang | TypeScript | 888 |
| [8mb.local](https://github.com/JMS1717/8mb.local) | 8mb.local is a free, self-hosted web interface designed for high-performance, local video compression. It allows users to easily compress video files | Python | 838 |
| [Temporal UI](https://github.com/temporalio/ui) | Temporal UI is the official open-source web interface for observing and managing workflows running on Temporal. It provides a visual interface for ins | TypeScript | 424 |
| [Temporal Java SDK](https://github.com/temporalio/sdk-java) | Temporal Java SDK is the official Java framework for building durable, fault-tolerant workflow applications on top of the Temporal platform. It provid | Java | 424 |
| [Sessy](https://github.com/marckohlbrugge/sessy) | Sessy is an open-source project providing email observability for Amazon SES. It addresses the difficulty of tracking email performance by offering a | HTML | 356 |
| [brainapi2.git](https://github.com/Lumen-Labs/brainapi2) | BrainAPI is a knowledge graph–powered AI memory layer that transforms unstructured text into a structured, queryable graph through a swarm of speciali | Python | 296 |
| [agents-council](https://github.com/0xwilliamortiz/agents-council) | Agent Council is a multi-agent collaboration plugin for Claude Code that orchestrates multiple AI CLIs (Codex, Gemini, and others) to deliver diverse | JavaScript | 293 |
| [sdk-ruby](https://github.com/temporalio/sdk-ruby) | Temporal Ruby SDK is a Ruby SDK that allows developers to build durable, fault-tolerant workflows with long-running execution. It is aimed at Ruby dev | Ruby | 202 |
| [my-temporal-dockercompose](https://github.com/tsurdilo/my-temporal-dockercompose) | Temporal Server setup for Docker | Go | 91 |
| [Real-Time Payment Architecture & Orchestration](https://github.com/RahulAutade2288/real-time-payment-architecture-orchestration) | provides a reference implementation for a modern, standards-aligned Real-Time Payment (RTP) architecture and orchestration framework. It demonstrates | Java | 63 |
| [features](https://github.com/temporalio/features) | Features, feature showcase repository for temporal workflows. Features is an open-source repository from Temporal that demonstrates platform capabilit | Go | 29 |
| [Ocrbase](https://github.com/ocrbase-hq/ocrbase) | Ocrbase is a lightweight, model-agnostic API designed to standardize document parsing from PDFs and images into structured formats like Markdown or JS | TypeScript | 7 |

### Deployment, serverless & developer platform tooling

Serverless platforms, cloud-native deployment, infrastructure-as-code, self-hosting, and backend developer platforms.

#### Semantic-reviewed (37)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [LocalStack](https://github.com/localstack/localstack) | Local AWS cloud emulator for running Lambda, S3, DynamoDB and other services locally or in CI. | Python | 64,866 |
| [Coolify](https://github.com/coollabsio/coolify) | Open-source self‑hostable PaaS to deploy and manage sites, databases, and apps. | PHP | 59,934 |
| [dokploy](https://github.com/Dokploy/dokploy) | Open-source alternative to Vercel/Netlify/Heroku for deploying apps to servers. | TypeScript | 36,663 |
| [floci](https://github.com/floci-io/floci) | Local AWS emulator alternative for testing services like S3, SQS, EC2, and more. | Java | 20,320 |
| [windmill](https://github.com/windmill-labs/windmill) | Open-source developer platform and workflow engine to run scripts as webhooks, workflows and UIs. | Rust | 17,566 |
| [Ubicloud](https://github.com/ubicloud/ubicloud) | Open-source IaaS platform offering compute, block storage, managed DBs, k8s and IAM. | Ruby | 12,011 |
| [OpenSandbox](https://github.com/alibaba/OpenSandbox) | Secure, extensible sandbox runtime and control plane for executing AI workloads. | Python | 10,081 |
| [openship](https://github.com/oblien/openship) | Self-hostable deployment platform with built-in CI/CD, routing, automatic TLS and multiple interfaces. | TypeScript | 10,039 |
| [Webiny](https://github.com/webiny/webiny-js) | Serverless CMS and application platform for building content-driven apps on AWS Lambda. | TypeScript | 8,021 |
| [sandbox-runtime](https://github.com/anthropic-experimental/sandbox-runtime) | Sandbox Runtime: OS-level tool enforcing filesystem and network restrictions for processes. | TypeScript | 3,817 |
| [KATAKATE](https://github.com/Katakate/k7) | Self-hosted infrastructure to create and manage lightweight VM sandboxes using Kata/Firecracker on Kubernetes. | Python | 776 |
| [runagent](https://github.com/runagent-dev/runagent) | CLI and SDK to simplify serverless deployment and invocation of AI agents. | Python | 481 |
| [CattoPic](https://github.com/Yuri-NagaSaki/CattoPic) | Serverless image-hosting backend using Cloudflare Workers, R2 for assets and D1 for metadata. | TypeScript | 336 |
| [camelAI](https://github.com/qaml-ai/camelAI) | AI coding-assistant platform built on Cloudflare Workers/Durable Objects with persistent workspaces and SQLite/R2. | TypeScript | 316 |
| [jabali-panel](https://github.com/shukiv/jabali-panel) | Open-source web hosting control panel automating hosting, DNS, backups and multi-tenant isolation. | Go | 92 |
| [linkedrecords](https://github.com/wolfoo2931/linkedrecords) | Backend-as-a-Service inspired by triplestores with real-time collaboration and serverless authorization. | TypeScript | 69 |
| [Fractera](https://github.com/Fractera/Agent-Engineering-Infrastructure) | Self-hosted agent engineering infrastructure that automates provisioning of web services on VPS. | TypeScript | 54 |
| [Isola](https://github.com/isola-run/isola) | Kubernetes-native secure sandbox platform for executing untrusted code using gVisor, with REST API and Helm deployment. | Go | 49 |
| [Deploy-Center-Server](https://github.com/FutureSolutionDev/Deploy-Center-Server) | Self-hosted CI/CD/deployment platform with persistent queues, rollback UI, and encrypted envs. | TypeScript | 25 |
| [celld](https://github.com/denoland/celld) | Self-hosted distributed runtime for Cloudflare Workers/Durable Objects with per-cell SQLite and S3 replication. | — | 0 |
| [CapRover](https://github.com/caprover/caprover) | App and database deployment platform (PaaS) using Docker Swarm, nginx, and web GUI/CLI. | — | 0 |
| [butterbase](https://github.com/butterbase-ai/butterbase) | Open-source Backend-as-a-Service: Postgres, auth, storage, edge functions, and AI gateway. | — | 0 |
| [Budibase](https://github.com/Budibase/budibase) | Low-code operations platform to build, self-host and automate backend workflows and apps. | TypeScript | 27,830 |
| [bolt.diy](https://github.com/stackblitz-labs/bolt.diy) | Platform to prompt, run, edit, and deploy full-stack web apps using any LLM. | TypeScript | 19,756 |
| [Self-hosted AI starter kit](https://github.com/n8n-io/self-hosted-ai-starter-kit) | Starter kit to quickly set up a local, self-hosted AI workflow environment. | — | 15,180 |
| [InsForge](https://github.com/InsForge/InsForge) | All-in-one backend platform providing DB, auth, storage, compute, hosting, and AI gateway. | TypeScript | 12,730 |
| [genai-stack](https://github.com/docker/genai-stack) | Docker-based GenAI stack combining LangChain, Neo4j and Ollama for local deployment. | Python | 5,390 |
| [Cloudflare Vibe SDK](https://github.com/cloudflare/vibesdk) | SDK for building apps on Cloudflare Workers and Durable Objects. | TypeScript | 5,323 |
| [Chaterm at devhunt](https://github.com/chaterm/Chaterm) | AI-powered terminal for cloud and infrastructure management with deploy/troubleshoot features. | TypeScript | 3,016 |
| [Pipedash](https://github.com/hcavarsan/pipedash) | Desktop and Docker-deployable platform aggregating and managing CI/CD pipelines across providers. | Rust | 1,009 |
| [Hypermind](https://github.com/lklynet/hypermind) | Decentralized P2P platform using Hyperswarm DHT to track container peers and resource usage. | JavaScript | 799 |
| [Agent Sandbox Skill](https://github.com/disler/agent-sandbox-skill) | Skill to manage isolated execution environments for AI agents, enabling safe code execution and persistent context. | Python | 362 |
| [tinbase](https://github.com/tinbase/tinbase) | Supabase-compatible local backend bundling Postgres, auth, storage and realtime into a single binary. | TypeScript | 310 |
| [cairn](https://github.com/MorganKryze/cairn) | Lightweight self-hosted directory server for homelabs, single static Go binary. | Go | 42 |
| [livedemo-deploy](https://github.com/exploitx3/livedemo-deploy) | Scripts to deploy and run live demo applications locally. | — | 27 |
| [rakazo](https://github.com/elie222/rakazo) | Self-hosted personal agent platform providing isolated runtimes and scheduled routines per bot. | — | 0 |
| [FullstackAgent](https://github.com/FullstackAgent/FullstackAgent) | AI-powered platform that automates full-stack development with sandboxed envs and one-click deployments. | — | 0 |

#### High-specificity extension (45)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Dokku](https://github.com/dokku/dokku) | Dokku is a Docker-powered PaaS that helps you build and manage the lifecycle of applications. It provides a Heroku-like experience on your own infrast | Shell | 32,075 |
| [Dozzle](https://github.com/amir20/dozzle) | Dozzle is a lightweight, web-based application designed for real-time monitoring and viewing of Docker container logs. It operates purely for live log | Go | 12,409 |
| [Christian's Boilerplates](https://github.com/ChristianLempa/boilerplates) | Christian's Boilerplates is a personal collection of production-ready templates designed to accelerate homelab and infrastructure projects. It provide | Python | 7,551 |
| [Uncloud](https://github.com/psviderski/uncloud) | Uncloud is a lightweight, decentralized container orchestration tool designed to deploy and manage applications across a network of cloud VMs and bare | Go | 5,050 |
| [homelab](https://github.com/mortennordbye/homelab) | GitOps-managed homelab using Kubernetes (Talos), ArgoCD, and Terraform for infrastructure as code. | TypeScript | 178 |
| [Haloy](https://github.com/haloydev/haloy) | Haloy is a platform designed to quickly turn any Virtual Private Server (VPS) into a production-ready application deployment environment. Built in Go, | Go | 155 |
| [Gitvex](https://github.com/mdhruvil/gitvex) | Gitvex is a self-hosted, serverless alternative to GitHub built entirely on the Cloudflare Developer Platform. It leverages Cloudflare Workers and Dur | — | 0 |
| [Traefik](https://github.com/traefik/traefik) | Traefik is a modern HTTP reverse proxy and load balancer designed to simplify deploying microservices in cloud-native environments. It automatically i | Go | 62,760 |
| [trivy](https://github.com/aquasecurity/trivy) | identify vulnerabilities and misconfigurations across software environments, and Temporal enables durable workflow orchestration for distributed syste | Go | 36,627 |
| [Pangolin](https://github.com/fosrl/pangolin) | Pangolin is an open-source, identity-based remote access platform that combines VPN and reverse proxy capabilities built on WireGuard. It provides sec | TypeScript | 20,313 |
| [Memvid](https://github.com/memvid/memvid) | Memvid is a portable, serverless memory layer designed for AI agents, offering instant retrieval and long-term memory without relying on complex RAG p | Rust | 15,011 |
| [Meshery](https://github.com/meshery/meshery) | Meshery platform for cloud and Kubernetes management. Meshery is an open-source cloud-native management platform that helps teams operate Kubernetes, | TypeScript | 11,494 |
| [Agent Reinforcement Trainer](https://github.com/OpenPipe/ART) | ART (Agent Reinforcement Trainer) is an open-source reinforcement learning framework designed to train multi-step agents for complex, real-world tasks | Python | 9,178 |
| [permify](https://github.com/Permify/permify) | An open-source authorization as a service inspired by Google Zanzibar, designed to build and manage fine-grained and scalable authorization systems fo | Go | 5,935 |
| [semantic-router](https://github.com/vllm-project/semantic-router) | Intelligent Mixture-of-Models Router for Efficient LLM Inference | Go | 5,172 |
| [Octelium](https://github.com/octelium/octelium) | Octelium is a next-generation, self-hosted, unified Zero Trust secure access platform built in Go. It provides a scalable Zero Trust Architecture (ZTA | Go | 3,738 |
| [AgentENV](https://github.com/kvcache-ai/AgentENV) | AgentENV (AENV) is a distributed platform for running agent environments at scale, designed to power agentic reinforcement learning training for Moons | Rust | 2,696 |
| [SkillHub](https://github.com/iflytek/skillhub) | SkillHub is an enterprise-grade, self-hosted, and open-source platform designed for registering, publishing, and managing reusable agent skill package | Java | 2,633 |
| [Gonzo - The Go based TUI for log analysis](https://github.com/control-theory/gonzo) | Gonzo is a powerful, Go-based Terminal User Interface (TUI) designed for real-time log analysis, inspired by tools like k9s. It provides a centralized | Go | 2,583 |
| [Optio](https://github.com/jonwiggins/optio) | options using defined criteria and trade-offs. It lets users input choices, evaluation factors, and priorities, then generates structured comparisons | TypeScript | 1,034 |
| [Databuddy](https://github.com/databuddy-analytics/Databuddy) | Databuddy is a privacy-first analytics platform focused on real-time user tracking and data management. It is built on a foundation of privacy, ensuri | TypeScript | 992 |
| [xata](https://github.com/xataio/xata) | Xata just open-sourced the platform powering their cloud service. The standout feature is copy-on-write branching at the storage level | Go | 910 |
| [ECLAIRE](https://github.com/eclaire-labs/eclaire) | ECLAIRE is a local-first, open-source AI assistant designed to unify and manage personal data across tasks, notes, documents, photos, and bookmarks. I | TypeScript | 842 |
| [Uptimer](https://github.com/VrianCao/Uptimer) | Uptimer gives you the whole thing on Cloudflare's free tier. Serverless monitoring on Cloudflare workers | TypeScript | 471 |
| [Temporal Core SDK](https://github.com/temporalio/sdk-core) | Temporal Core SDK, core engine for building durable workflows. Temporal Core SDK is an open-source core library that powers durable workflow execution | Rust | 451 |
| [AWS Blocks](https://github.com/aws-devtools-labs/aws-blocks) | AWS Blocks. Building blocks for AWS application development | TypeScript | 307 |
| [letsseal](https://github.com/letsseal/letsseal) | Lets Seal (SEAL) is an open standard and reference implementation for cryptographically proving that any digital file is authentic, unaltered, sealed | JavaScript | 287 |
| [Xmas.JS](https://github.com/LemonHX/Xmas.JS) | Xmas.JS is a lightweight, high-performance JavaScript/TypeScript runtime built primarily in Rust, designed specifically for system scripting and autom | Rust | 258 |
| [Claude Code Monitor](https://github.com/onikan27/claude-code-monitor) | The Claude Code Monitor is a macOS application providing a real-time dashboard for managing multiple Claude Code sessions. It offers dual access metho | TypeScript | 226 |
| [openGym](https://github.com/DuarteSantos8/openGym) | openGym is a self-hosted gym and body-weight tracker that runs entirely on the user's own server via Docker Compose, keeping all training data private | JavaScript | 217 |
| [The Reclaim Stack](https://github.com/reclaim-the-stack/get-started) | Reclaim the Stack is a ready-to-deploy Kubernetes platform stack that lets users spin up a complete, production-style environment in about 15 minutes. | Shell | 178 |
| [DVinyl](https://github.com/Kyonew/DVinyl) | DVinyl is a modern, self-hostable collection manager designed for physical media enthusiasts, allowing users to catalog, value, and organize their ent | EJS | 169 |
| [neiro](https://github.com/tigerabrodi/neiro) | Neiro is a TypeScript library providing a chainable, immutable API for performing advanced audio processing on the server. It offers a unified set of | TypeScript | 150 |
| [Pairlane](https://github.com/kiyo-e/pairlane) | Pairlane is a P2P file sharing tool that enables direct file transfers between browsers using WebRTC, eliminating the need for a central server. It le | TypeScript | 149 |
| [VoidLLM](https://github.com/voidmind-io/voidllm) | Privacy-first LLM proxy and AI gateway — load balancing, multi-provider routing, API key management, usage tracking, rate limiting. Self-hosted. Zero | Go | 114 |
| [Roomify](https://github.com/adrianhajdin/roomify) | Roomify is an AI-powered architectural visualization platform that transforms 2D floor plans into photorealistic 3D renders. Built with a modern stack | TypeScript | 107 |
| [yuv-ai-trends](https://github.com/hoodini/yuv-ai-trends) | YUV.AI Developers AI Trends is a privacy-focused news aggregator designed to deliver the latest AI and Machine Learning trends from GitHub and Hugging | Python | 101 |
| [Codra](https://github.com/devarshishimpi/codra) | Self-hosted AI code review for GitHub pull requests, built on Cloudflare Workers. | TypeScript | 45 |
| [SWAR templates](https://github.com/netlify/swar-templates) | SWAR templates is a collection of project templates designed to help developers build SWAR applications using Netlefi tooling. It solves setup complex | TypeScript | 2 |
| [shelfhost](https://github.com/dshaw0004/shelfhost) | Shelfhost is a self-hosted PDF library, reader, and highlighting tool that offers a warm, distraction-free reading experience for personal document co | JavaScript | 1 |
| [Serverless Stack](https://github.com/sst/sst) | SST (Serverless Stack) is an infrastructure-as-code framework designed to help developers build full-stack applications on their own infrastructure. I | — | 0 |
| [Inbix](https://github.com/inbix.xyz/inbix) | Inbix is an open-source email API platform built natively on Cloudflare Workers and the surrounding developer ecosystem. It exposes simple endpoints f | — | 0 |
| [hink](https://github.com/ccbikai/hink) | Hink is a link shortening service designed for hackers, utilizing Git commit hashes as unique identifiers for short links. The system stores the origi | — | 0 |
| [AI-Conversation-Hub](https://github.com/xEscapeVelocity/AI-Conversation-Hub) | Open-source, serverless, multi-LLM group chat application | TypeScript | 0 |
| [AgentSky](https://github.com/agentsky.dev/agentsky) | AgentSky is a developer platform for building, deploying, and observing AI agents in production. It provides tooling to compose agents from reusable b | — | 0 |

## Use Notes

This is a discovery catalog, not a security, privacy, reliability, license, performance, or production-readiness assessment. Before adopting a project, review its current documentation, supported language and runtime ecosystem, data model and migration path, backup/restore guarantees, security and authorization model, observability needs, operating cost, maintenance status, and license compatibility. [1]

*Stars are the counts recorded in the attached dataset, not live GitHub values.*

## References

[1]: repo_showcase_merged.json (user-supplied repository dataset, analyzed August 18, 2026)
