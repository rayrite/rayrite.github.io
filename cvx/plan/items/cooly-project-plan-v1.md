# Cooly Platform — Master Project Plan
### Full Software Development Lifecycle · Pre-Launch · Launch · Post-Launch · Marketing
**Version:** 1.0 · **Audience:** Solo Developer / Founder · **Status:** Living Document

---

> **How to use this plan:** Every major section is designed to stand alone as a sprint anchor. The numbering system is `SECTION.MAJOR.MINOR` so you can say "drill into 4.3" and generate a detailed sub-plan from any node. Tasks marked `[MVP]` are required for your first paying customer. Tasks marked `[PMF]` target the 100-subscriber milestone. Tasks marked `[SCALE]` apply after you achieve PMF and begin the GCP migration. Tasks marked `[ALWAYS]` are ongoing operational habits, not one-time events.

---

## 0. Document Control & Guiding Principles

Before we dive into tasks, it is worth articulating the philosophy that should govern every decision you make during this build. You are a solopreneur operating on bootstrapped funds with approximately 5–8 hours of development time per week. This is not a disadvantage you need to apologize for — it is a forcing function that will save Cooly from the over-engineering that kills most early-stage platforms. The following principles should be visible to you when you sit down to work each week.

**Principle 0.1 — Validate before you build.** Every feature that does not already exist in conversations with real target users in Ferndale or Hamtramck is a hypothesis, not a requirement. You build to validate, not to complete.

**Principle 0.2 — Managed services over self-hosted complexity.** During the MVP phase on your LiquidWeb AlmaLinux VPS, every hour you spend operating infrastructure is an hour you do not spend acquiring customers. Choose managed services with free tiers aggressively. Upgrade to self-hosted alternatives only at defined revenue thresholds.

**Principle 0.3 — Spec first, code second.** The Batonic Coding discipline — flowerbox headers, serial-numbered plans, predictive impact analysis, validation loops — is not overhead. It is the thing that keeps an AI-assisted solo codebase from becoming a regression-prone pile of patches.

**Principle 0.4 — Revenue diversification from day one.** The B2C $10/month subscription is your proving ground, not your ceiling. B2G municipal contracts and chamber of commerce partnerships provide larger, more predictable revenue and should be pursued in parallel from the first week you have a working demo.

**Principle 0.5 — Community trust is the moat.** Code can be copied. Community trust, verified relationships, and proprietary civic data cannot. Every architectural and product decision should ask: "Does this deepen community trust, or does it trade trust for short-term engagement?"

---

## 1. Project Initiation & Governance

*This section covers everything that must be true before you write a single line of production code. Skipping this section is the most common way solo founders waste months building the wrong thing.*

### 1.1 — Define Success Criteria and Milestones

The absence of explicit success criteria is the most common reason founders declare their product "almost ready" for eighteen months. You need hard, binary definitions of what it means to advance from one phase to the next.

**1.1.1 `[MVP]`** Define the MVP milestone formally: the minimum feature set that allows a single resident in Ferndale or Hamtramck to pay $10/month and receive genuine value in return. Write it down. It should be no more than one page. This is your north star for every prioritization argument with yourself.

**1.1.2 `[MVP]`** Define the PMF milestone: 100 active paying subscribers across at least two municipalities, with a monthly churn rate below 5%. This is the trigger for the GCP migration and the Series A / grant application preparation phase.

**1.1.3 `[MVP]`** Define the B2G milestone: at least one signed municipal partnership agreement, even if the contract value is below the procurement threshold ($5,000–$9,000/year). This de-risks your revenue model before you need it.

**1.1.4 `[MVP]`** Create a one-page "Investment Thesis" document for yourself that articulates: the problem, the solution, the business model, the moat, and the milestones above. This document is simultaneously your personal accountability tool and the skeleton of every pitch you will give.

### 1.2 — Customer Discovery (Ongoing, Not a Phase)

Customer discovery is not something you complete and then move past. It is a permanent operating mode for a platform that depends on community trust.

**1.2.1 `[MVP]`** Conduct at minimum 20 structured customer discovery interviews with residents of Ferndale and Hamtramck before building any feature beyond the news aggregation core. Use a consistent interview script. Record with permission. Look for pain, not enthusiasm — people say "that sounds great" about almost anything; what you want is "oh god, that would solve the problem I've been complaining about for years."

**1.2.2 `[MVP]`** Conduct at minimum 5 interviews with elected officials or city staff in your target municipalities. City clerks are often the most accessible entry point and the most knowledgeable about what information gaps citizens complain about. They are also potential B2G sales contacts.

**1.2.3 `[MVP]`** Interview at least 3 local business owners, ideally members of the Ferndale or Hamtramck chamber of commerce. These conversations validate your chamber partnership track and surface advertising-adjacent use cases you may not have considered.

**1.2.4 `[PMF]`** Establish a continuous feedback loop: a standing 30-minute monthly call with 5–10 power users who represent your target segments. These calls replace guesswork with signal. They cost you 2.5 hours per month and save you from building features that nobody actually uses.

**1.2.5 `[PMF]`** Instrument every major user action from day one using PostHog Cloud (free tier covers your MVP volume). Behavioral data confirms or contradicts what users tell you in interviews — and the behavioral data is almost always more accurate.

### 1.3 — Legal & Business Formation

**1.3.1 `[MVP]`** Ensure Cooly operates through a formal business entity (LLC recommended for a solopreneur at this stage) to separate personal liability from platform liability. Michigan LLC formation is approximately $50.

**1.3.2 `[MVP]`** Draft and publish a Privacy Policy and Terms of Service before you collect any user data. For a civic platform, these documents carry extra weight because they signal institutional legitimacy. Use a generator like Termly or Iubenda for the first version — budget roughly $20–30/month — and invest in a lawyer-reviewed version when you cross $1,000 MRR.

**1.3.3 `[MVP]`** Understand the Michigan Open Meetings Act as it pertains to your data sourcing. Your news ingestion pipeline aggregates legally mandated public data — this is a legal asset. Document this position explicitly in your Privacy Policy.

**1.3.4 `[PMF]`** Research Michigan Small Business Development Center (SBDC) grant opportunities. Michigan has several programs specifically targeting technology-enabled civic infrastructure. A MEDC (Michigan Economic Development Corporation) grant could fund your GCP migration costs.

**1.3.5 `[PMF]`** Investigate 501(c)(3) nonprofit hybrid structures (a "public benefit corporation" model) for the civic data and journalism elements of Cooly. Some funders — Knight Foundation, Democracy Fund — fund civic technology platforms but cannot fund for-profit entities. A hybrid model could open grant channels without compromising your commercial operations.

### 1.4 — Project Tooling & Workflow Setup

**1.4.1 `[MVP]`** Set up a GitHub repository with branch protection rules: `main` requires a passing CI check before merge; feature work happens on short-lived branches named `feature/YYYY-MM-DD-description`. This discipline is non-negotiable even for a solo developer because it forces you to think in reviewable units of work.

**1.4.2 `[MVP]`** Configure GitHub Issues with labels that mirror this project plan's section numbers (e.g., `area:infrastructure`, `area:ai-pipeline`, `area:marketing`). This keeps your issue tracker connected to your strategic plan rather than becoming a random pile of bugs.

**1.4.3 `[MVP]`** Set up a simple weekly planning ritual: every Sunday, review the project plan, pick the 2–3 tasks that deliver the most validation value this week, and create GitHub Issues for them. At the end of the week, close or update them. This 20-minute ritual prevents scope creep and keeps your limited hours focused.

**1.4.4 `[MVP]`** Establish a Markdown-based decision log (a `docs/decisions/` folder in the repo) using Architectural Decision Records (ADRs). Every significant technology or product choice gets a 1-page ADR: context, decision, alternatives considered, consequences. This is indispensable when you return to a decision six months later and cannot remember why you made it.

---

## 2. Architecture & Technical Design

*This section ensures that the technical foundation you are building on top of will support growth from 1 user to 10,000 without requiring a rewrite. Your architecture is already well-considered — this section formalizes and extends it.*

### 2.1 — System Architecture Finalization

**2.1.1 `[MVP]`** Produce a single authoritative architecture diagram (use Mermaid so it lives in the repo as code, not as a stale PNG) that shows the relationships between every major system: SvelteKit frontend, Fastify API, PostgreSQL, Redis/BullMQ, Qdrant, the five-agent AI pipeline, Cloudflare CDN, and the LiquidWeb VPS. This diagram is your communication tool for every technical conversation, including with potential academic partners at Wayne State or U of M.

**2.1.2 `[MVP]`** Finalize the twelve module boundaries for your modular monolith: `auth`, `community-profiles`, `news-ingestion`, `civic-debate`, `subscriptions-billing`, `notifications`, `media-storage`, `voice-rooms`, `moderation`, `analytics`, `graphrag-civic-knowledge`, and `admin`. Document what each module owns, what it exposes, and what it explicitly does not own. Encode these boundaries as ESLint import rules so the architecture is enforced by tooling, not by memory.

**2.1.3 `[MVP]`** Define and document the event-driven contract between modules. Which events does each module emit? Which events does it consume? Use a simple Markdown table for now. This prevents the "everything talks to everything" coupling pattern that turns modular monoliths back into big balls of mud.

**2.1.4 `[MVP]`** Document your PostgreSQL schema-per-module ownership strategy. Each module owns its own Postgres schema (e.g., `auth.users`, `news_ingestion.articles`, `civic_debate.proposals`). Cross-module data access goes through the module's public API or service layer, never through a direct cross-schema JOIN in application code.

**2.1.5 `[PMF]`** Produce a capacity planning estimate for the LiquidWeb VPS at 100 concurrent users and 1,000 daily active users. Know the numbers — CPU, RAM, disk I/O, Postgres connection pool size — before you hit them. The estimate does not need to be perfect; it needs to give you a 30-day warning before degradation.

### 2.2 — API Design & Contract Standards

**2.2.1 `[MVP]`** Document the standard Fastify response envelope: `{ data: T | null, error: ErrorObject | null, meta: PaginationMeta }`. This envelope must be used on every route, including errors. Consistent error shapes are what allow your SvelteKit frontend to handle errors generically rather than route-by-route.

**2.2.2 `[MVP]`** Implement and document the cursor-based pagination standard for all list endpoints. Never use offset/limit in any Fastify route. Cursor pagination is required for your infinite-feed architecture and for the News Swarm timeline UI, and it is dramatically more efficient than offset pagination at scale.

**2.2.3 `[MVP]`** Create a shared `@cooly/schema` package using Zod that defines the canonical shape of your core entities: `User`, `CommunityProfile`, `NewsArticle`, `DebateProposal`, `DebateArgument`, `VoiceRoom`, `Subscription`. Both the Fastify backend and the SvelteKit frontend import from this package. This is your end-to-end type safety guarantee.

**2.2.4 `[MVP]`** Establish a versioning strategy for your API. Even in MVP, prefix all routes with `/api/v1/`. This costs almost nothing and prevents the painful migration when your first B2G client is calling your API directly and you need to make a breaking change.

### 2.3 — Data Architecture & GraphRAG

**2.3.1 `[MVP]`** Finalize the Entity-Relationship diagram for your core PostgreSQL tables. Pay particular attention to the relationships between `NewsArticle`, `CivicEntity` (person, organization, location, meeting), and `DebateProposal`, because these relationships form the semantic backbone of your knowledge graph.

**2.3.2 `[MVP]`** Design and document your pgvector embedding strategy: which fields are embedded, what model generates the embeddings (Gemini Flash embedding API is cost-effective and accurate), how embeddings are updated when articles are edited, and what the similarity search thresholds are for "related content" recommendations.

**2.3.3 `[PMF]`** Design the Apache AGE (graph) schema that extends your PostgreSQL data with relationship edges: `ARTICLE_MENTIONS_ENTITY`, `ENTITY_ATTENDED_MEETING`, `ENTITY_VOTED_ON_PROPOSAL`, `PROPOSAL_AFFECTS_LOCATION`. The graph layer is what transforms your platform from "news aggregator" to "civic knowledge graph" — the moat.

**2.3.4 `[PMF]`** Design and document the Qdrant collection schema for high-velocity vector search (user interest profiles, semantic news clustering, debate argument similarity). Qdrant handles the high-throughput similarity search that would overwhelm pgvector under production load.

### 2.4 — AI Pipeline Architecture

*The five-agent pipeline (Sentinel → Contextualizer → Main AI → Scribe → Analyst) is the core intelligence of the platform. Its architecture deserves its own planning section.*

**2.4.1 `[MVP]`** Write a formal SRS-style specification for each agent: its inputs, outputs, failure modes, retry behavior, and which LiteLLM tier it dispatches to. The Sentinel agent, for example, needs explicit behavioral specs for adversarial prompts, spam detection, and content policy violations — these specs become the ground truth for your Promptfoo regression tests.

**2.4.2 `[MVP]`** Implement hard `MAX_RETRIES = 3` and circuit breaker patterns for every LLM call in the pipeline. Document the exit conditions explicitly: if the Contextualizer fails after 3 retries, what does the pipeline do? Does it proceed with reduced context? Does it quarantine the article? Does it alert the admin dashboard? "Ralph Wiggum loops" — infinite retry cycles — are an existential cost risk.

**2.4.3 `[MVP]`** Design the semantic caching layer for LLM calls. Use Redis to cache results for semantically similar inputs (content hash for identical inputs, embedding similarity for near-duplicate inputs). Target a 30–40% cache hit rate at MVP volume, which translates directly to AI cost reduction.

**2.4.4 `[MVP]`** Document the per-user hard spending cap mechanism. Every user has a LiteLLM budget limit. Free-tier users are hard-capped at Tier 2 models. Paid users have a monthly token budget. When a user approaches their budget, the pipeline degrades gracefully to cheaper models rather than failing. The cap mechanics must be implemented in the routing layer, not just in billing logic.

**2.4.5 `[PMF]`** Implement the LLM routing engine's six-layer decision pipeline: Request Intake → Enrichment → Signal Extraction → Routing Engine → Model Dispatch → Observability. The routing logic should prefer Gemini Flash (Tier 1) for all classification tasks, GPT-4o mini or DeepSeek (Tier 2) for summarization and moderation, and Claude Sonnet/Opus (Tier 3/4) only for the Analyst agent's synthesis tasks that require reasoning depth.

---

## 3. Infrastructure Setup

*This section covers your two-environment strategy: the LiquidWeb AlmaLinux VPS for MVP, and GCP post-PMF. The goal is to run lean now and migrate smoothly later.*

### 3.1 — LiquidWeb AlmaLinux VPS (MVP Infrastructure)

Your current server — 2 cores, 2GB RAM, 40GB SSD, AlmaLinux 9, managed cPanel — is entirely adequate for your MVP. The constraint is a feature, not a limitation. It forces every infrastructure choice to be efficient.

**3.1.1 `[MVP]`** Harden the base server: disable root SSH login, enforce SSH key-only authentication, configure `firewalld` to allow only ports 22, 80, and 443, install `fail2ban` for brute-force protection, and enable automatic security updates for OS packages. This takes approximately 2 hours and substantially reduces your attack surface.

**3.1.2 `[MVP]`** Install and configure Docker Engine (not Docker Desktop) on AlmaLinux 9. Use `docker compose` (the new standalone plugin, not the legacy `docker-compose`) for all service orchestration. Your compose file is the single source of truth for what is running on the VPS.

**3.1.3 `[MVP]`** Set up your core service stack via Docker Compose: PostgreSQL 16 (with pgvector extension enabled), Redis 7 (for BullMQ job queues and semantic caching), Qdrant (for vector search, memory-mapped storage to stay within RAM limits), and your Fastify API process managed by PM2 inside a container. Reserve at least 512MB RAM for PostgreSQL and 256MB for Redis. Qdrant can operate with as little as 128MB at MVP data volumes.

**3.1.4 `[MVP]`** Configure Nginx as a reverse proxy in front of all services. Nginx handles SSL termination (via Certbot/Let's Encrypt for free TLS), HTTP to HTTPS redirect, and routes `/api/*` to Fastify and `/*` to the SvelteKit Node adapter. Keep Nginx on the host (not in a container) for simpler TLS certificate renewal.

**3.1.5 `[MVP]`** Plan your migration path to Hetzner CX23 (4GB RAM, ~$3.80/month) as an intermediate step before PMF. The Hetzner server gives you double the RAM at one-tenth the cost of the LiquidWeb VPS once your initial LiquidWeb contract ends. Migration should be a planned, tested operation using a Docker volume backup strategy, not an emergency move.

**3.1.6 `[MVP]`** Set up Uptime Kuma (self-hosted, free, runs in Docker) for monitoring. Configure alerts for: Fastify API health endpoint, PostgreSQL connection, Redis ping, and Qdrant health endpoint. Route alerts to your personal Telegram via the Telegram bot connector. You should know within 2 minutes when something goes down.

**3.1.7 `[MVP]`** Configure automated PostgreSQL backups using `pg_dump` on a daily cron job. Encrypt the backup file and upload it to Cloudflare R2 (zero egress cost, $0.015/GB storage). Retain 30 days of daily backups and 12 months of monthly backups. Test your restore process manually before you go live. A backup you have never tested is not a backup.

**3.1.8 `[MVP]`** Set up Langfuse Cloud (free tier) for LLM observability. Every call from your five-agent pipeline must emit a trace to Langfuse: input tokens, output tokens, latency, model used, agent name, and cost estimate. This data is both your cost control dashboard and your AI quality improvement tool.

### 3.2 — Cloudflare Integration

**3.2.1 `[MVP]`** Route all DNS through Cloudflare (free tier). Enable the Cloudflare proxy (orange cloud) for your primary domain to get free DDoS protection, WAF rules, and CDN caching for static assets at no cost.

**3.2.2 `[MVP]`** Configure Cloudflare R2 for all user-generated media: profile photos, News Swarm attachments, voice room recordings. R2's zero egress cost is essential for a media-heavy civic platform that could generate substantial download volume during breaking local news events.

**3.2.3 `[MVP]`** Configure Cloudflare's Cache Rules to cache SvelteKit static assets (JS bundles, CSS, fonts) at the edge. This dramatically improves performance for users without any additional infrastructure cost.

**3.2.4 `[PMF]`** Evaluate Cloudflare Workers for edge-side rate limiting and geographic routing as you approach multi-municipality scale. Workers run in Cloudflare's 300+ data centers and can handle authentication token validation before requests ever reach your VPS.

### 3.3 — GCP Post-PMF Infrastructure Planning

*You do not build this now. You plan it now so the migration is a deliberate strategy, not a crisis response.*

**3.3.1 `[PMF]`** Define the GCP migration trigger: when monthly infrastructure costs on the VPS exceed $200, or when you sustain 500+ daily active users for 30 consecutive days, you initiate the GCP migration. Having a pre-defined trigger prevents you from migrating too early (wasting money) or too late (operating a degraded service).

**3.3.2 `[PMF]`** Design the GCP architecture: Cloud Run for stateless Fastify API containers (autoscaling, pay-per-request), Cloud SQL for PostgreSQL (managed, with read replicas), Cloud Memorystore for Redis, Artifact Registry for Docker images, and Cloud CDN in front of Cloud Run. The SvelteKit frontend can be deployed to Vercel or Netlify on the free tier independently of the backend.

**3.3.3 `[PMF]`** Apply for Google for Startups cloud credits ($200,000 for qualifying startups). A civic technology platform with demonstrated community impact and academic partnerships has a strong application profile. These credits can fund your first 12 months on GCP.

**3.3.4 `[SCALE]`** Design the multi-region architecture for when Cooly expands beyond Metro Detroit. The knowledge graph and community-specific data is inherently regional, which means your GCP architecture should be region-aware from the start: data for Ferndale/Hamtramck lives in `us-central1`; a future Cleveland deployment lives in a separate regional stack.

### 3.4 — CI/CD Pipeline

**3.4.1 `[MVP]`** Configure GitHub Actions for your CI pipeline: on every pull request, run TypeScript type checking (`tsc --noEmit`), ESLint (enforcing module boundary rules), unit tests (Vitest), and a build test to ensure the SvelteKit and Fastify builds succeed. This pipeline should complete in under 3 minutes.

**3.4.2 `[MVP]`** Configure a CD pipeline: on merge to `main`, build Docker images, push to GitHub Container Registry (free for public repos, $0 for private up to a threshold), and deploy to the VPS via SSH using `docker compose pull && docker compose up -d`. Blue-green deployment is optional at MVP; rolling restart is sufficient.

**3.4.3 `[PMF]`** Add Playwright end-to-end tests for critical user journeys to the CI pipeline: user registration, subscription checkout, article reading, debate vote. These tests are your regression safety net as you add features.

---

## 4. MVP Feature Development

*This section covers the build of every feature in the MVP, organized by module. Each subsection can be expanded into a full Batonic Implementation Plan. The order here reflects dependencies — earlier sections must be built before later ones.*

### 4.1 — Authentication & User Management (`auth` module)

Authentication is the foundation everything else depends on. It must be built correctly, not quickly.

**4.1.1 `[MVP]`** Implement email/password registration with Argon2id password hashing. Never store plaintext passwords. Use `argon2` npm package with memory-intensive parameters tuned for your VPS CPU.

**4.1.2 `[MVP]`** Implement secure session management: cryptographically random session tokens via `crypto.randomBytes(32)`, stored as `HttpOnly; Secure; SameSite=Strict` cookies. Short-lived access tokens (15 minutes) refreshed via long-lived refresh tokens (30 days). Session data stored in Redis for fast lookup.

**4.1.3 `[MVP]`** Implement email verification on registration. Use Resend for transactional email (generous free tier, simple API, excellent deliverability). Unverified users can browse but not post or vote.

**4.1.4 `[MVP]`** Implement password reset via email token. Token must be single-use, time-limited (1 hour), and stored as a hashed value in PostgreSQL — never the raw token.

**4.1.5 `[MVP]`** Implement Row-Level Security (RLS) policies in PostgreSQL for all user-owned data tables. RLS enforces data isolation at the database layer — if application code has a bug, the database is a second line of defense.

**4.1.6 `[PMF]`** Add social login (Google OAuth) using the `@fastify/oauth2` plugin. Google OAuth dramatically reduces registration friction for mobile users and is the #1 conversion lever for consumer apps.

**4.1.7 `[PMF]`** Implement two-factor authentication (TOTP-based, using the `otpauth` package) for users who opt in. This is particularly important for local officials and verified journalists who have elevated trust levels on the platform.

### 4.2 — Community Profiles (`community-profiles` module)

**4.2.1 `[MVP]`** Implement the municipality onboarding flow: when a user registers, they select their municipality from a curated list (initially: Ferndale, Hamtramck, and a generic "Metro Detroit" fallback). Municipality selection gates all subsequent content filtering.

**4.2.2 `[MVP]`** Implement basic user profiles: display name, profile photo (stored on Cloudflare R2), brief bio, neighborhood, and verification status. Do not implement public like counts or follower counts — your design philosophy explicitly rejects these addiction mechanics.

**4.2.3 `[MVP]`** Implement the "Friend Funnel" tiered access system: Visitor (read-only, no account), Resident (free account, limited interactions), Verified Resident (email-verified, full community features), Subscriber ($10/month, all features plus mobile widgets), Verified Official (city staff/elected official badge). Each tier is a PostgreSQL enum on the `users` table.

**4.2.4 `[PMF]`** Implement resident address verification (optional, opt-in). This is the hardest verification problem because it requires matching a user's claimed address against municipal property or voter registration records. Start with a self-attestation model for MVP ("I confirm I live in Ferndale") and upgrade to real verification when you have the API access.

### 4.3 — News Ingestion Pipeline (`news-ingestion` module)

*This is the core value creation engine of the platform. A working news ingestion pipeline is what allows you to solve the "empty room problem" from day one.*

**4.3.1 `[MVP]`** Implement the RSS feed polling job using BullMQ. Schedule polling at 15-minute intervals for municipal sources (CivicPlus, Legistar, Granicus RSS endpoints for Ferndale and Hamtramck) and 1-hour intervals for regional sources. Use `got` for HTTP fetching with timeout and retry configuration.

**4.3.2 `[MVP]`** Implement article extraction using `@mozilla/readability` + `jsdom` for standard web pages and `metascraper` for metadata normalization (author, publication date, publisher). Store extracted articles in the `news_ingestion.articles` table with `source_url`, `source_type`, `source_publication_date`, `ingestion_timestamp`, `raw_html`, and `extracted_text` fields.

**4.3.3 `[MVP]`** Implement the Playwright-based fallback extractor for JavaScript-rendered municipal pages (CivicPlus portals that do not offer RSS). Playwright runs as a BullMQ job with a 60-second timeout. Budget 1 Playwright instance to avoid OOM on your VPS.

**4.3.4 `[MVP]`** Implement duplicate detection using content hash (SHA-256 of the article body) and URL normalization. An article that has already been ingested should not be re-processed by the AI pipeline. This is critical for cost control.

**4.3.5 `[MVP]`** Implement the GDELT Project integration. GDELT provides free real-time global event monitoring with geographic filters. Use it to surface regional-to-local news that falls within your target municipalities' geographic bounding boxes.

**4.3.6 `[MVP]`** Implement the AI classification job (Tier 1 — Gemini Flash): for each new article, classify it by topic (public safety, education, zoning, infrastructure, community events, local business, government proceedings), extract mentioned civic entities (people, organizations, locations), and assign an initial relevance score (0–1) for each municipality in your system.

**4.3.7 `[MVP]`** Implement the Scribe agent output: AI-generated article summaries of 2–3 sentences, formatted for widget display (headline under 80 characters, summary under 200 characters). Store summaries in the `news_ingestion.article_ai_metadata` table.

**4.3.8 `[MVP]`** Implement the news feed API endpoint: `GET /api/v1/feed?municipality={id}&cursor={cursor}&limit=20`. Returns articles sorted by a composite score: recency (40% weight), relevance to municipality (30% weight), community engagement (20% weight), AI quality score (10% weight). Cursor-based pagination.

**4.3.9 `[PMF]`** Implement the civic-scraper library integration for structured municipal data: meeting agendas, meeting minutes, public comment periods, permit applications. This structured data feeds your knowledge graph and differentiates you from RSS-only news aggregators.

**4.3.10 `[PMF]`** Implement the "Coverage Gaps" indicator: when your ingestion pipeline detects that a city council meeting has occurred but minutes have not yet been published, surface a gap notification in the UI — "Ferndale City Council met on April 10th — minutes pending." This counterintuitive transparency feature builds enormous trust.

### 4.4 — Civic Debate (`civic-debate` module)

*The structured debate mechanics are your primary differentiation from Nextdoor, Patch, and local Facebook groups. They are the feature that turns passive news consumers into active civic participants.*

**4.4.1 `[MVP]`** Implement debate proposal creation: any Verified Resident can propose a debate on a topic linked to a news article or a civic issue. Proposals have a title, a description, a linked municipality, a linked article (optional), and a set of initial positions.

**4.4.2 `[MVP]`** Implement the Pol.is-inspired argument submission and consensus mechanics: users submit arguments for or against a proposal position. Arguments are shown to other users who vote agree/disagree/pass. The system surfaces arguments that bridge the widest cross-partisan coalition — the arguments that people with different overall positions tend to agree on.

**4.4.3 `[MVP]`** Implement the Analyst agent's synthesis job: after a debate reaches a minimum threshold of participation (e.g., 25 unique voters), the Analyst agent synthesizes a "Community Consensus Summary" that identifies areas of agreement, areas of persistent disagreement, and the most bridging arguments. This summary is the platform's most distinctive AI output.

**4.4.4 `[MVP]`** Implement "Theater Mode" — a spectator view of live debates that shows argument streams, vote tallies, and consensus formation in real time using Server-Sent Events (SSE). Theater Mode is the feature you demo to journalists and city officials. It shows civic engagement happening, not just posts accumulating.

**4.4.5 `[MVP]`** Implement debate moderation using your five-agent pipeline. The Sentinel agent screens each new argument for content policy violations before it is shown to other users. The Contextualizer agent adds factual grounding by linking claims to ingested news articles where possible.

**4.4.6 `[PMF]`** Implement the debate "maturity" lifecycle: proposals move from `open` (active argument submission) to `deliberating` (voting only, no new arguments) to `concluded` (Analyst summary published, read-only). The lifecycle timing should be configurable per debate (3–14 days is a reasonable default range).

**4.4.7 `[PMF]`** Implement the debate archive and search: all concluded debates, their arguments, vote counts, and Analyst summaries are permanently accessible and searchable. This archive is a civic record and a key component of your GEO/AEO strategy — it is the structured content that AI systems will eventually cite.

### 4.5 — Subscriptions & Billing (`subscriptions-billing` module)

**4.5.1 `[MVP]`** Integrate Stripe with the `stripe` Node.js SDK. Create two products: "Cooly Resident" at $10/month (individual subscription) and "Cooly Municipal Partner" at $7,500/year (B2G partnership, manual invoicing for now).

**4.5.2 `[MVP]`** Implement the Stripe Checkout flow: clicking "Subscribe" redirects to a Stripe-hosted checkout page. On success, Stripe sends a `checkout.session.completed` webhook to your Fastify API, which upgrades the user's tier in the database. On cancellation, the user returns to the pricing page.

**4.5.3 `[MVP]`** Implement Stripe webhook handling with signature verification. Never trust a webhook without verifying the `Stripe-Signature` header using `stripe.webhooks.constructEvent`. Store every webhook event in a `billing.stripe_events` table for auditability.

**4.5.4 `[MVP]`** Enable Stripe Tax from day one. Michigan's sales tax rules for SaaS are nuanced but consequential. Stripe Tax costs 0.5% of taxable transactions and is substantially cheaper than the liability of getting this wrong.

**4.5.5 `[MVP]`** Implement subscription cancellation: users can cancel at any time from their account settings. Cancellation is immediate in Stripe but access continues until the end of the current billing period. Log all cancellations with a brief reason prompt — this data is invaluable for churn analysis.

**4.5.6 `[PMF]`** Implement a free trial (7–14 days, no credit card required) to reduce signup friction for the B2C track. Free trials dramatically improve conversion rates at the top of the funnel for subscription products.

**4.5.7 `[PMF]`** Implement annual billing at a 20% discount ($96/year vs $120/year). Annual subscribers churn at dramatically lower rates because the annual commitment creates inertia, and the upfront cash improves your working capital position.

### 4.6 — Notifications (`notifications` module)

**4.6.1 `[MVP]`** Implement email notifications via Resend: breaking news digest (daily at 7am, configurable), debate activity on proposals the user is following, and subscription billing events. Use a clean, text-dominant email template that reflects your civic infrastructure brand.

**4.6.2 `[MVP]`** Implement in-app notifications: a bell icon in the navigation that shows unread notification count. Notifications are stored in a `notifications.events` table and delivered via SSE when the user is active. No JavaScript push notifications at MVP — they require service worker complexity that is not worth it at this stage.

**4.6.3 `[PMF]`** Implement push notifications via web push (using the `web-push` npm package) for Subscriber-tier users. Push notifications are the prerequisite for mobile widgets on Android and are also the mechanism for Breaking News alerts on iOS.

**4.6.4 `[PMF]`** Implement the "Local Official Direct Line" notification channel: verified officials can send push notifications to their followers directly from the admin dashboard. This is your Locket-inspired direct-to-device channel for civic officials — the feature that gives politicians a reason to champion your platform to their constituents.

### 4.7 — Voice Rooms (`voice-rooms` module)

**4.7.1 `[MVP]`** Implement text-based discussion rooms as the v1 of "Voice Rooms" to avoid WebRTC complexity at MVP. A text room is a WebSocket-connected chat interface associated with a news article or debate. This gives users real-time discussion without the audio infrastructure.

**4.7.2 `[PMF]`** Implement actual audio voice rooms using WebRTC peer connections, with your Fastify WebSocket server acting as the signaling layer (SDP offer/answer, ICE candidate exchange). Use a STUN server (Google's free STUN at `stun:stun.l.google.com:19302` is adequate for MVP) and evaluate deploying a Coturn TURN server on the VPS for users behind restrictive NATs.

**4.7.3 `[PMF]`** Integrate `faster-whisper` for voice room transcription. Run the `tiny` or `base` Whisper model on the VPS CPU for real-time transcription during live rooms. Store transcripts in PostgreSQL and index them in the civic knowledge graph. A voice room transcription of a public forum discussion is extraordinarily valuable civic data.

### 4.8 — News Swarm (`news-swarm` module)

*News Swarm is your crowdfunded investigative journalism feature — the most innovative and community-differentiating feature on your platform.*

**4.8.1 `[MVP]`** Implement News Swarm proposal creation: any Subscriber can propose an investigation with a title, description, estimated cost, and target completion date. Proposals must be linked to a specific municipality and a specific civic concern.

**4.8.2 `[MVP]`** Implement the crowdfunding mechanics using Stripe Payment Intents (not subscriptions): users contribute any amount toward the funding goal. Contributions are held via Stripe until the goal is reached or the campaign expires. If the goal is not reached within 30 days, all contributions are automatically refunded.

**4.8.3 `[MVP]`** Implement the investigation timeline UI: a visual progress tracker showing funding status, investigation milestones, interim findings, and final report publication. This is the UI you showed in the widget section — it transforms funding progress into ambient community awareness.

**4.8.4 `[PMF]`** Implement the journalist matching system: when an investigation is fully funded, the platform notifies a curated list of verified local journalists and freelancers in the relevant municipality. Journalist verification is a manual admin process at PMF stage.

**4.8.5 `[PMF]`** Implement investigation report publication as a first-class content type in your knowledge graph. Funded investigation reports should carry a distinct badge, be submitted to GDELT (contributing back to the ecosystem), and be structured with JSON-LD markup as a `NewsArticle` with `funder` attribution.

### 4.9 — Mobile Widgets (`widgets` module)

**4.9.1 `[MVP]`** Build the iOS widget using SwiftUI and WidgetKit. Start with the smallest viable widget: a 3-headline display in small and medium sizes, updated every hour during daylight hours via WidgetKit's timeline system. The widget is paywalled behind the Subscriber tier — it is the most tangible visual representation of your product's value proposition.

**4.9.2 `[MVP]`** Implement a widget-specific Fastify API endpoint: `GET /api/v1/widget/feed?municipality={id}`. This endpoint returns pre-formatted, widget-optimized content: headline (max 60 chars), summary (max 120 chars), and a category label. The widget API must respond in under 100ms — pre-compute and cache widget content in Redis.

**4.9.3 `[PMF]`** Build the Android widget using RemoteViews and AppWidgetManager. Android's widget framework is more flexible than iOS's but requires more careful handling of the diversity of home screen launcher implementations.

**4.9.4 `[PMF]`** Implement the Community Pulse widget: a medium-size widget showing live debate activity, News Swarm funding progress, and trending topics. This widget requires more dynamic data than the headlines widget and needs a more sophisticated pre-computation strategy.

### 4.10 — Admin Dashboard (`admin` module)

**4.10.1 `[MVP]`** Implement a basic admin dashboard for yourself as the solo operator: ingestion pipeline status, moderation queue, user management (ban, verify, tier upgrade), and subscription metrics. Use shadcn-svelte components for speed — the admin dashboard does not need to win design awards.

**4.10.2 `[MVP]`** Implement the Moderation Queue: content flagged by the Sentinel agent or by users lands in a queue that only admins can process. Each item shows the content, the flag reason, the user's history, and three actions: approve, remove, or escalate.

**4.10.3 `[PMF]`** Implement the Municipal Partner admin portal: a white-labeled view of the admin dashboard for verified B2G partners. City staff can see engagement metrics for their municipality, post official announcements, and verify residents who present their city employee ID.

---

## 5. GEO/AEO Strategy Implementation

*Generative Engine Optimization and Answer Engine Optimization are the forward-looking SEO strategies that position Cooly as the canonical civic data source for AI systems. This is your long-term moat.*

### 5.1 — Structured Data & Schema Markup

**5.1.1 `[MVP]`** Implement JSON-LD Schema.org markup on every article page: `NewsArticle`, `LocalBusiness`, `GovernmentOrganization`, `Event`, `Person`, and `Place` types. Use the most specific subtype available. Google's rich results testing tool validates your markup before deployment.

**5.1.2 `[MVP]`** Implement `llms.txt` at `cooly.com/llms.txt`: a structured plaintext file that tells AI crawlers what Cooly is, what data it contains, how to interpret its content types, and where to find structured data. This is a nascent standard but it is already being read by several major AI systems.

**5.1.3 `[MVP]`** Implement canonical URLs and Open Graph metadata on every page. These are SEO basics, but they are also the mechanism by which AI systems determine which URL to cite for a given piece of content.

**5.1.4 `[PMF]`** Implement a public read API: `GET /api/v1/public/articles?municipality={id}&format=json-ld` that returns recent civic content in JSON-LD format, freely accessible without authentication. This API is explicitly designed to be crawled by AI systems. It is the mechanism by which Cooly becomes a cited source in AI-generated civic information.

**5.1.5 `[PMF]`** Submit your JSON-LD-enriched content to Google's Indexing API for priority crawling. Civic content with meeting minutes, government decisions, and public notices qualifies for the "government and news organization" fast-indexing track.

### 5.2 — Content Strategy for AI Discoverability

**5.2.1 `[MVP]`** Publish a dedicated municipal data page for each target municipality: a structured reference page listing the city's key officials, meeting schedule, open datasets, and recent Cooly coverage. This page is highly likely to be cited by AI systems when users ask about local government.

**5.2.2 `[PMF]`** Publish a weekly "Civic Digest" newsletter that is also publicly accessible as a web page with full JSON-LD markup. Each digest covers the week's most significant municipal decisions, active debates, and community milestones in Cooly's target municipalities. This creates a fresh, authoritative, structured content signal every week.

**5.2.3 `[PMF]`** Create the "Cooly Municipal Profiles" series: deep-reference pages for Ferndale and Hamtramck covering history, demographics, government structure, and key civic entities. These evergreen pages are the type of structured civic reference content that AI systems return to repeatedly as cited sources.

---

## 6. Testing & Quality Assurance

*Testing is not something you add at the end. For a platform with AI-generated content and civic trust at stake, testing is a risk management strategy.*

### 6.1 — Unit Testing

**6.1.1 `[MVP]`** Configure Vitest for unit testing of Fastify route handlers, service layer functions, and utility modules. Target 70% statement coverage for the `auth`, `subscriptions-billing`, and `news-ingestion` modules — these are the modules where bugs have the most severe consequences.

**6.1.2 `[MVP]`** Write unit tests for all Zod schemas in `@cooly/schema`. Every schema should have tests for valid inputs, invalid inputs, and edge cases (empty strings, null values, extremely long strings).

**6.1.3 `[MVP]`** Write unit tests for the AI routing engine's decision logic. The routing logic is pure business logic — no network calls, no database — and is entirely testable. Every routing decision (which model gets which request) should have a corresponding test case.

### 6.2 — Integration Testing

**6.2.1 `[MVP]`** Write integration tests for your Fastify API endpoints using `@fastify/inject`. Test the full request → route handler → database → response cycle against a test PostgreSQL database. Use `pg-test` or a Docker-based test database that is spun up and torn down for each test run.

**6.2.2 `[MVP]`** Write integration tests for your BullMQ job processors. Each job processor should have a test that enqueues a job, processes it, and asserts the expected database state or side effects.

### 6.3 — End-to-End Testing

**6.3.1 `[PMF]`** Implement Playwright end-to-end tests for critical user journeys: registration → email verification → municipality selection → article reading → debate participation → subscription checkout → widget installation (conceptual test). Run these tests in CI on every merge to `main`.

**6.3.2 `[PMF]`** Implement Playwright visual regression tests for your key UI components using `@playwright/test`'s screenshot comparison. This catches unintended CSS regressions that unit tests cannot detect.

### 6.4 — AI Pipeline Testing

**6.4.1 `[MVP]`** Configure Promptfoo for prompt regression testing of each agent in your pipeline. For each agent, create a test dataset of 20–30 representative inputs with expected output characteristics. Run Promptfoo tests before any prompt changes are deployed to production.

**6.4.2 `[PMF]`** Implement the SENTINEL adversarial testing framework: a suite of deliberately crafted inputs designed to test the robustness of your moderation pipeline. Include prompt injection attempts, adversarial civic misinformation, and social engineering scenarios. Run SENTINEL tests on a monthly schedule.

### 6.5 — Performance Testing

**6.5.1 `[PMF]`** Run load tests using `k6` (open-source, free) to establish your VPS baseline: what is the maximum concurrent users before response times exceed 500ms? Run this test before launch so you know your headroom.

**6.5.2 `[PMF]`** Set up Sentry (free Hobby tier covers MVP volume) for real-time error tracking in both the Fastify API and the SvelteKit frontend. Every unhandled exception should generate a Sentry alert before it becomes a user complaint.

---

## 7. Security Hardening

*For a civic platform that handles voter information, government meeting data, and community financial contributions, security is a trust issue, not just a technical issue.*

### 7.1 — Application Security

**7.1.1 `[MVP]`** Implement `@fastify/helmet` for security headers on all API responses: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, and `Permissions-Policy`. These headers are free defenses against an entire class of browser-based attacks.

**7.1.2 `[MVP]`** Implement rate limiting via `@fastify/rate-limit` on all authentication endpoints (registration, login, password reset) at 10 requests per IP per 15 minutes. Apply a broader rate limit (100 requests per minute) to all other API endpoints.

**7.1.3 `[MVP]`** Implement request body size limits on all Fastify routes. A user should not be able to send a 100MB JSON body to your API. The default limit should be 100KB; file upload endpoints (profile photos) use the `@fastify/multipart` plugin with explicit size limits.

**7.1.4 `[MVP]`** Implement audit logging for all sensitive operations: login, password change, subscription change, content removal, user ban, and admin actions. Store audit logs in a separate `audit.events` table. Audit logs are never deleted — they are your legal defense and your compliance record.

**7.1.5 `[MVP]`** Conduct a manual OWASP Top 10 review of your codebase before launch. Work through each category and verify you have addressed the relevant risks. Document the review in your ADR log.

### 7.2 — AI Security

**7.2.1 `[MVP]`** Store all AI system prompts in an immutable directive store (a database table with no `UPDATE` or `DELETE` permissions granted to the application user). Prompts are updated by creating a new version, never by modifying an existing one. This prevents context compaction from eroding safety constraints in long-running agent sessions.

**7.2.2 `[PMF]`** Implement the six-zone security framework for your multi-tenant agent platform: Zone 0 (bare metal/OS), Zone 1 (container runtime), Zone 2 (database layer), Zone 3 (API gateway), Zone 4 (agent orchestration), Zone 5 (LLM provider). Document what is trusted and what is untrusted at each zone boundary.

---

## 8. Pre-Launch Activities

*The most common founder mistake is treating launch as an end state rather than a beginning. These activities ensure you launch to an audience, not into a void.*

### 8.1 — Community Building Before Launch

**8.1.1 `[MVP]`** Create a "Founding Member" waitlist 60–90 days before launch. Collect email addresses via a simple landing page (use Carrd at $19/year — it is the fastest and cheapest way to have a professional landing page). Offer founding members a permanent 20% discount and a "Founding Member" badge on their profile.

**8.1.2 `[MVP]`** Build the waitlist to at minimum 150 emails before launch. With a typical 15–20% paid conversion rate on a relevant, warm audience, 150 emails translates to 22–30 paying subscribers on launch day — a meaningful start toward your 100-subscriber PMF milestone.

**8.1.3 `[MVP]`** Join and contribute authentically to existing Ferndale and Hamtramck community Facebook groups, Nextdoor neighborhoods, and Reddit communities (r/Ferndale, r/Hamtramck) for at least 60 days before launch. Do not post promotional content. Answer questions. Share useful civic information. Establish yourself as a knowledgeable, trustworthy community member first.

**8.1.4 `[MVP]`** Attend at least 2 Ferndale City Council meetings and 2 Hamtramck City Council meetings in person before launch. Introduce yourself to city staff. These relationships are harder to establish digitally and more valuable than any equivalent online outreach.

**8.1.5 `[MVP]`** Contact the editors of Ferndale 115 and other hyperlocal newsletters or blogs before launch. Frame Cooly as complementary to their work, not competitive. Offer to be a source of civic data insights for their coverage. They have the audience you want.

### 8.2 — Pre-Launch Marketing Assets

**8.2.1 `[MVP]`** Write and publish 3 "founding content" blog posts before launch: (1) "Why Ferndale deserves better civic news," (2) "How Hamtramck became a news desert and what we're doing about it," (3) "The civic engagement problem that apps like Nextdoor can't solve." These posts establish your editorial voice, attract search traffic, and are the content you share when you pitch journalists.

**8.2.2 `[MVP]`** Create a 90-second product demo video. Record yourself using the platform in Ferndale — real articles, a real debate, a real widget. No slick animation needed. Authenticity matters more than production value for a civic platform. Host on YouTube (free) and embed on your landing page.

**8.2.3 `[MVP]`** Prepare a press kit: a 1-page fact sheet about news deserts in Metro Detroit, 3–5 platform screenshots, a brief founder bio, and 2–3 quotes from customer discovery interview participants (with permission). Email this press kit to every local Michigan journalist and civic blogger you can identify.

**8.2.4 `[MVP]`** Record a 30-second "widget demo" video showing the home screen widget displaying breaking local news. This is your most shareable asset — it shows rather than tells what the product does. Post it to every relevant platform.

### 8.3 — B2G Pre-Launch Outreach

**8.3.1 `[MVP]`** Contact the City of Ferndale's communications director and the City of Hamtramck's city clerk at least 30 days before launch. The pitch is not "buy our product" — it is "we would like to pilot this at no cost and gather your feedback." Free pilots are the standard entry point for civic technology platforms.

**8.3.2 `[MVP]`** Prepare a 5-slide deck for municipal decision-makers: the news desert problem in their community, how Cooly addresses it, case studies from similar platforms (cite Knight Foundation civic tech success stories), the proposed pilot structure, and the transition to a paid partnership. Keep it non-technical.

**8.3.3 `[PMF]`** Contact the Ferndale Chamber of Commerce and Hamtramck Economic Development Corporation about a chamber partnership. Frame it as: "We will feature your members' news prominently in Cooly's business section; in exchange, we would appreciate an introduction to your member newsletter as a civic tech resource." Chamber endorsements are gold for B2C subscriber acquisition in a community context.

### 8.4 — Academic Partnership Development

**8.4.1 `[PMF]`** Identify specific faculty members at Wayne State University's Department of Communication and University of Michigan's School of Information who study local journalism, civic engagement, or digital democracy. Email them a one-paragraph pitch referencing their published research and proposing a collaboration — either data sharing, a joint whitepaper, or a student project on the Cooly platform.

**8.4.2 `[PMF]`** Frame the "Project 202|80" voter turnout initiative as a research partnership opportunity. A university partner lends the initiative scientific credibility and provides access to research funding channels (NSF, Knight Foundation, Democracy Fund) that are not available to commercial entities alone.

---

## 9. Launch

### 9.1 — Soft Launch (Closed Beta)

**9.1.1 `[MVP]`** Conduct a closed beta with your first 25–50 waitlist members approximately 30 days before public launch. Give them full access at no cost during the beta period. Conduct structured feedback sessions (30-minute calls or Typeform surveys) with every beta user.

**9.1.2 `[MVP]`** During beta, measure four things rigorously: activation rate (% of signups who complete municipality selection and read their first article), retention rate (% of beta users active in week 2), referral rate (how many beta users invite another person), and net promoter score (simple 1–10 "would you recommend Cooly" question). These four metrics will tell you whether your product is ready to charge for.

**9.1.3 `[MVP]`** Use the beta period to stress test your infrastructure. Run your k6 load tests while real users are on the platform. Watch your PostgreSQL slow query log. Watch your Redis memory consumption. Fix the problems that only appear under real usage.

### 9.2 — Public Launch

**9.2.1 `[MVP]`** Launch on a Tuesday or Wednesday morning (research consistently shows these are the highest-engagement days for new product discoveries). Do not launch on a Friday.

**9.2.2 `[MVP]`** Post to Product Hunt on launch day. A civic tech platform with a compelling widget demo and a genuine community story has a strong Product Hunt profile. Brief your beta users to upvote on launch day.

**9.2.3 `[MVP]`** Send a personalized launch email to every member of your waitlist. Not a blast — a message that references something specific about your community or their previous feedback. Personalization significantly improves open rates and conversion.

**9.2.4 `[MVP]`** Post launch announcements to: LinkedIn (your personal network), relevant Michigan Facebook groups, r/Ferndale and r/Hamtramck, your personal Twitter/X, and the Civic Tech Field Guide community Slack.

**9.2.5 `[MVP]`** Contact local Michigan journalists at the Detroit Free Press, Deadline Detroit, and MLive with a personalized pitch about the news desert story and Cooly's approach. A single placement in a publication like Deadline Detroit could generate 200+ trial signups.

---

## 10. Post-Launch Operations

### 10.1 — Metrics & Analytics

**10.1.1 `[ALWAYS]`** Review your PostHog analytics dashboard every Monday morning. The questions to answer each week: What is my weekly active user count? What is my week-over-week retention? Which features are driving the most engagement? Which user cohorts have the highest retention?

**10.1.2 `[ALWAYS]`** Review your Langfuse LLM observability dashboard every Monday. The questions: What is my AI cost per user this week? What is my average pipeline latency? Are there any agents with unusually high error rates? Is my semantic cache hit rate improving?

**10.1.3 `[ALWAYS]`** Review your Stripe MRR (Monthly Recurring Revenue) dashboard weekly. Track: new subscriptions, churned subscriptions, net MRR change, and average revenue per user. When your churn rate exceeds 5% in any month, conduct exit interviews with every churned subscriber that week.

**10.1.4 `[ALWAYS]`** Review your Sentry error dashboard daily. Every unhandled exception is a user experience failure. Triage new errors within 24 hours of first occurrence.

### 10.2 — Community Management

**10.2.1 `[ALWAYS]`** Respond to every piece of user feedback within 48 hours. At MVP scale, this is not optional — it is your primary mechanism for earning the trust that drives word-of-mouth growth. A user who gets a thoughtful response to their feedback becomes an evangelist. A user who gets no response becomes a churned subscriber.

**10.2.2 `[ALWAYS]`** Moderate the content queue every 24 hours, 7 days a week. Your five-agent pipeline handles the first pass, but human review of the moderation queue is non-negotiable for a civic platform. Misinformation left unaddressed for more than 24 hours causes community trust damage that is very difficult to repair.

**10.2.3 `[PMF]`** Establish a community advisory board: 5–7 residents from your target municipalities who meet with you monthly, review proposed features, and serve as the human face of Cooly's community governance. Advisory board members receive lifetime Subscriber accounts in exchange for their time.

### 10.3 — Continuous Improvement

**10.3.1 `[ALWAYS]`** Maintain a "Product Changelog" page at `cooly.com/changelog` that documents every new feature, improvement, and bug fix in plain English — no jargon. This page serves two purposes: it signals to users that the platform is actively improving, and it gives your SEO fresh content signals weekly.

**10.3.2 `[ALWAYS]`** Run a monthly "Batonic Sprint Review": open your project plan, assess which tasks were completed, which were deferred, and whether the priorities have changed based on user feedback. Update section numbers and status markers accordingly. The project plan is a living document, not a museum artifact.

---

## 11. Marketing & Growth Strategy

*This is the section most developers deprioritize and most platforms fail because of. For Cooly, marketing is not separate from the product — it is how you demonstrate the product's value to a community that has never seen anything like it.*

### 11.1 — Brand Identity & Messaging

**11.1.1 `[MVP]`** Define and document your core messaging hierarchy. Your top-level message should be a single sentence that a resident can repeat to a neighbor: something like "Cooly is where Ferndale gets its news and has its debates." This is not your tagline — it is your conversational explanation. Every piece of marketing derives from this sentence.

**11.1.2 `[MVP]`** Define your brand voice: civic without being bureaucratic, warm without being folksy, informative without being preachy, tech-forward without being intimidating. Write 3 example sentences in your brand voice and 3 examples of what your brand voice explicitly avoids. This document is what you give to every freelancer or collaborator who creates content for Cooly.

**11.1.3 `[MVP]`** Define your ethical positioning as a marketing asset — not just as a product principle. The fact that Cooly has no ads, no infinite scroll, no algorithmic manipulation, and no addiction mechanics is a genuine consumer differentiator in 2026 and should be front and center in your marketing. Frame it positively: "Cooly is designed for your wellbeing, not your attention."

### 11.2 — Content Marketing

**11.2.1 `[MVP]`** Establish a weekly blog cadence at `cooly.com/blog`: one 600–1,000 word post per week on civic topics relevant to your target municipalities. Content ideas: "How to read a Ferndale City Council agenda," "The history of Hamtramck's charter school debate," "What a news desert costs a community." These posts attract organic search traffic, establish editorial authority, and are the content that journalists reference when they write about you.

**11.2.2 `[MVP]`** Create a "Civic Data Weekly" email newsletter distributed every Friday. It summarizes the week's most significant local government actions across your target municipalities. Publish it as a web-accessible archive page with JSON-LD markup. This newsletter is simultaneously a retention mechanism, a new subscriber acquisition channel, and a GEO content signal.

**11.2.3 `[PMF]`** Pitch a guest column to Deadline Detroit, Bridge Michigan, or the Michigan Advance about news deserts and civic tech. A bylined article in a statewide publication reaches your target audience of civic-minded readers and elevates Cooly's legitimacy for B2G sales conversations.

**11.2.4 `[PMF]`** Produce a 15-minute podcast episode monthly: "The Cooly Civic Hour." Interview a local official, a community activist, or a journalist about a specific civic issue in your target municipalities. The podcast has three goals: build relationships with local influencers, provide discovery for search/Spotify/Apple Podcasts, and generate structured content for your knowledge graph.

**11.2.5 `[SCALE]`** Commission a formal research report (partnered with a university) on the civic impact of news deserts in Metro Detroit communities. A data-driven, peer-reviewed report carries enormous PR value and is the kind of asset that gets Cooly cited in journalism trade publications, the Knight Foundation newsletter, and local government association journals.

### 11.3 — Social Media Strategy

*Your social strategy should match your brand: civic, substantive, and respectful of people's attention. You are not trying to maximize impressions — you are trying to reach a small, specific, civic-minded audience and convert them with quality.*

**11.3.1 `[MVP]`** Establish official accounts on Facebook, Instagram, LinkedIn, and Nextdoor (for each target neighborhood). Post consistently (3x per week minimum) before launch to establish an audience baseline. Do not spread yourself thin trying to be on every platform — go deep on the platforms where your target audience actually is.

**11.3.2 `[MVP]`** Facebook is your primary platform for a hyperlocal civic audience in the 30–60 age demographic. Most active civic participants in communities like Ferndale and Hamtramck use Facebook as their primary social channel. Post civic data highlights (e.g., "Ferndale City Council voted 4-2 on the downtown parking ordinance last night — here's what it means"), debate summaries, and News Swarm progress updates.

**11.3.3 `[MVP]`** LinkedIn is your primary platform for the B2G and academic partnership track. Post case studies, civic data insights, and platform milestones. Your target LinkedIn audience is city administrators, chamber executives, civic tech professionals, and university researchers.

**11.3.4 `[PMF]`** Instagram is your visual storytelling platform. Focus on infographic-style civic data visualizations (e.g., charts of city budget allocations, maps of affected areas in a zoning debate) and behind-the-scenes content about building a civic platform. Reels of your widget demo perform extremely well on Instagram's discovery algorithm.

**11.3.5 `[PMF]`** Twitter/X is primarily for reaching journalists and civic tech commentators. Share concise civic data insights, respond to breaking local news, and engage with the broader civic tech community (Code for America, Civic Hall, Knight Foundation accounts).

**11.3.6 `[PMF]`** Reddit: r/Ferndale, r/Hamtramck, r/Detroit, and r/Michigan are all relevant communities. Do not post promotional content. Share civic data insights, participate in local news discussions, and link to your public content only when it is directly relevant to the conversation. Reddit users are highly attuned to inauthenticity.

### 11.4 — Influencer & Partnership Marketing

**11.4.1 `[MVP]`** Identify 10–15 "civic influencers" in your target municipalities: active city council meeting attendees, neighborhood association presidents, parent-teacher association leaders, and local business owners who are active on social media. These are not celebrities — they are trusted community voices with modest but highly relevant local followings (500–5,000 followers). Brief them on Cooly during your customer discovery period and ask for their feedback. Their organic endorsement when you launch is more valuable than any paid promotion.

**11.4.2 `[PMF]`** Partner with the League of Women Voters — Oakland County and Wayne County chapters for co-branded voter information content around election periods. The League has deep credibility with civic-minded audiences and will amplify your content to their membership at no cost in exchange for co-branding and civic data access.

**11.4.3 `[PMF]`** Pursue a formal media partnership with the Michigan Daily (University of Michigan) and Wayne State's South End student newspapers. Offer journalism students access to your news ingestion data and structured debate data for investigative reporting projects. Student journalists become your users, your advocates, and potential future verified journalists on the News Swarm marketplace.

### 11.5 — Search Engine Optimization (SEO)

**11.5.1 `[MVP]`** Conduct keyword research for hyperlocal civic search terms in your target municipalities. Use Google Search Console (free) and Ahrefs Webmaster Tools (free tier) to identify what people in Ferndale and Hamtramck actually search for about local government. Target long-tail queries like "Ferndale city council meeting schedule," "Hamtramck water quality report," and "Ferndale parking ordinance 2026."

**11.5.2 `[MVP]`** Implement technical SEO basics from day one: proper `<title>` and `<meta description>` tags on every page, canonical URLs, a sitemap.xml that is automatically updated when new articles are published, robots.txt that allows search crawlers but blocks AI content scrapers (except for the structured public API paths you want crawled), and Core Web Vitals optimization (your SSR-first SvelteKit architecture already gives you a head start here).

**11.5.3 `[PMF]`** Build a local link acquisition strategy: get listed on Michigan civic directories, the Ferndale Chamber of Commerce website, the Hamtramck city government website (even as an external resource link), and the Michigan Press Association's resource directory. These local backlinks carry disproportionate authority for local search rankings.

### 11.6 — Paid Advertising (Later Stage)

**11.6.1 `[PMF]`** Hold off on paid advertising until you have a proven organic conversion funnel. Paying for traffic before you understand what converts is burning money. Once you have at minimum 50 paying subscribers and a demonstrated organic conversion rate, you have the data to make paid advertising decisions.

**11.6.2 `[PMF]`** When you begin paid advertising, start with Facebook/Instagram geo-targeted ads aimed at a 3-mile radius around Ferndale and Hamtramck. The targeting specificity of Facebook's local awareness ads is unmatched for a hyperlocal product. Budget $5–10/day as a test. Optimize for email signups (waitlist/newsletter), not direct subscriptions — the subscription conversion happens after a trust relationship is established.

**11.6.3 `[PMF]`** Evaluate Google Ads for search intent terms: "local news Ferndale Michigan," "Hamtramck city council news," and similar. Search intent traffic converts significantly higher than social discovery traffic because the user is actively looking for what you offer.

### 11.7 — PR & Media Relations

**11.7.1 `[MVP]`** Build a press list of every journalist who covers Metro Detroit civic issues, local government, or technology in Michigan. This list should include: Deadline Detroit, Detroit Free Press metro reporters, Crain's Detroit Business, MLive, Michigan Radio, Michigan Advance, and the student newspapers at Wayne State, U of M, and UM-Dearborn. Maintain relationships with these journalists by providing them with civic data insights and story tips before you ever pitch them on Cooly.

**11.7.2 `[PMF]`** Prepare and pitch a "Year One" story to Deadline Detroit approximately 12 months after launch. The story angle: "How a solo founder built a civic platform that now serves [X] residents in Ferndale and Hamtramck." This type of human-interest tech story is exactly what Deadline Detroit publishes, and it functions as your most powerful B2C acquisition event of the year.

**11.7.3 `[PMF]`** Submit Cooly to the Knight-Batten Award for Innovations in Journalism, the City Bureau's Civic Media Fellowship, and the Code for America award programs. Award recognition generates press coverage, validates your civic mission to B2G prospects, and opens grant funding doors.

### 11.8 — Email Marketing

**11.8.1 `[MVP]`** Use Resend for all transactional and marketing email from day one — it gives you both transactional (authentication emails, subscription receipts) and marketing (newsletter, civic digest) from a single platform. Its free tier (3,000 emails/month) covers your entire MVP period.

**11.8.2 `[MVP]`** Build your email list aggressively from day one: waitlist page, in-app email capture for non-subscribers, and newsletter subscription prompts on public content pages. Your email list is your owned audience — unlike social media followers, email subscribers are not subject to algorithm changes.

**11.8.3 `[PMF]`** Implement email automation for the subscriber lifecycle: welcome sequence (3 emails over 7 days), onboarding tips email at day 3, a "top debates this week" digest at day 7, and a "your community week in review" at day 14. These automated touchpoints dramatically improve 30-day retention for new subscribers.

**11.8.4 `[PMF]`** Implement a win-back sequence for churned subscribers: 3 emails at days 7, 30, and 60 after churn. Each email offers something new — a new feature, a civic milestone in their municipality, or a discounted annual subscription offer. Reactivation is substantially cheaper than acquisition.

---

## 12. Revenue Diversification

### 12.1 — B2G Municipal Partnership Track

**12.1.1 `[MVP]`** Price your municipal partnership below the typical procurement threshold to avoid a lengthy RFP process: $5,000–$9,000/year for a single municipality. This pricing is typically approvable by a department head without city council approval, which dramatically shortens the sales cycle from 9–18 months to 4–8 weeks.

**12.1.2 `[PMF]`** Define the municipal partnership deliverables: a co-branded subdomain (e.g., `ferndale.cooly.com`), a dedicated moderation dashboard for city staff, verified official notification channels, a monthly engagement report, and a custom data feed for the city's own website. The co-branded subdomain is particularly important because it creates budget justification — the city can frame it as their civic communications platform, not just a subscription to an outside service.

**12.1.3 `[PMF]`** Pursue Michigan Municipal League (MML) membership or partnership. MML represents 533 Michigan municipalities. A single case study published in their newsletter or presented at their annual conference reaches your entire B2G target market simultaneously.

### 12.2 — Grant Funding

**12.2.1 `[PMF]`** Research and apply to the Knight Foundation's technology and local news grant programs. Knight explicitly funds civic tech platforms at the intersection of local journalism and community engagement — Cooly's positioning is nearly ideal.

**12.2.2 `[PMF]`** Research Michigan's Community Foundation grant programs (Community Foundation for Southeast Michigan is the most relevant). These foundations fund civic infrastructure improvements and have funded civic tech previously.

**12.2.3 `[SCALE]`** Research the USDA's Community Connect Grant program for rural and underserved communities. Cooly's news desert positioning in underserved communities qualifies for programs that fund broadband and civic information access.

---

## 13. Scaling Strategy (Post-PMF)

### 13.1 — Geographic Expansion

**13.1.1 `[SCALE]`** Define your geographic expansion playbook before you need it. The playbook should cover: how a new municipality is onboarded (data sources, initial content seed, community outreach), what the minimum viable user base for a new municipality is (100 residents in the first 60 days as a viability threshold), and how you staff the local community management as you expand beyond the two founding municipalities.

**13.1.2 `[SCALE]`** Prioritize expansion to adjacent Metro Detroit communities with similar characteristics to Ferndale and Hamtramck: Oak Park, Hazel Park, Lincoln Park, and Highland Park are all communities with population sizes in your target range (5,000–20,000), active civic cultures, and limited local journalism coverage.

**13.1.3 `[SCALE]`** After proving the Metro Detroit model, evaluate the Midwest municipal cluster strategy: identify analogous communities (population 5,000–20,000, news desert, active civic culture) in Cleveland, Pittsburgh, Cincinnati, and Columbus. These cities have similar community structures to Metro Detroit and strong potential for the same B2C and B2G revenue model.

### 13.2 — Team & Hiring

**13.2.1 `[SCALE]`** Your first hire should be a Community Manager, not a developer. The community manager role is what you cannot scale alone: attending public meetings, managing the moderation queue, building relationships with local officials, and running the content editorial calendar. Hire someone who lives in or near your target municipalities.

**13.2.2 `[SCALE]`** Your second hire should be a Business Development manager focused on B2G sales. Municipal sales is a relationship-intensive, slow-burn process that needs dedicated attention. A BD person who can attend MAME and Michigan Municipal League events consistently will close more contracts in 6 months than you can close in 2 years while also developing the product.

---

## Appendix A: Key Metrics Dashboard

*The following metrics should be visible in a single dashboard view every Monday morning. Use PostHog for product metrics, Stripe for revenue metrics, Langfuse for AI metrics, and Uptime Kuma for infrastructure metrics.*

**Product Metrics:** Weekly Active Users (WAU), Day-7 Retention Rate, Day-30 Retention Rate, Article Reads per Active User, Debate Participation Rate, Widget Active Users (Subscriber tier).

**Revenue Metrics:** Monthly Recurring Revenue (MRR), Net MRR Growth (%), Monthly Churn Rate (%), Average Revenue Per User (ARPU), Trial-to-Paid Conversion Rate, B2G Contracts (count and value).

**AI Metrics:** AI Cost per Active User ($/user/month), Pipeline Latency (P50, P95), Cache Hit Rate (%), Sentinel Flag Rate (% of content flagged), Agent Error Rate (%).

**Infrastructure Metrics:** API Uptime (%), Database Query P95 Latency (ms), VPS RAM Usage (%), VPS CPU Usage (%).

---

## Appendix B: Technology & Tool Registry

A living record of every tool in your stack with cost, tier, and the trigger for upgrading.

| Tool | Purpose | Current Tier | Cost | Upgrade Trigger |
|---|---|---|---|---|
| LiquidWeb VPS | Production hosting | Managed VPS | $29.58/2yr | Contract renewal — migrate to Hetzner |
| Cloudflare | CDN, DNS, WAF | Free | $0 | Workers when scaling |
| Cloudflare R2 | Media storage | Free (10GB) | ~$0 | $0.015/GB beyond 10GB |
| PostgreSQL 16 | Primary database | Self-hosted | $0 | Cloud SQL at PMF |
| Redis 7 | Queues, caching | Self-hosted | $0 | Cloud Memorystore at PMF |
| Qdrant | Vector search | Self-hosted | $0 | Qdrant Cloud at PMF |
| LiteLLM | AI routing | Open-source | $0 | Enterprise support at SCALE |
| Langfuse Cloud | LLM observability | Free (50k events) | $0 | Hobby $30/mo at PMF |
| Resend | Transactional email | Free (3k/mo) | $0 | $20/mo at PMF |
| Stripe | Payments | Free (2.9% + $0.30) | % of revenue | Volume negotiation at SCALE |
| PostHog Cloud | Product analytics | Free (1M events) | $0 | $450/mo at SCALE |
| Sentry | Error tracking | Hobby (free) | $0 | Team $26/mo at PMF |
| GitHub Actions | CI/CD | Free (2000 min/mo) | $0 | Likely never |
| Uptime Kuma | Monitoring | Self-hosted | $0 | Never — it's perfect |
| Promptfoo | Prompt testing | Open-source | $0 | Never |

---

## Appendix C: Weekly Development Sprint Template

*Use this template every Sunday to plan your 5–8 hours for the coming week.*

```
## Sprint: Week of [DATE]

### This week's phase: [Section X.Y from Project Plan]
### PMF progress: [X/100 subscribers]

### High-priority tasks (must complete):
1. [Task from project plan section X.Y.Z]
2. [Task from project plan section X.Y.Z]

### Medium-priority tasks (complete if time allows):
3. [Task]

### Blocked tasks (waiting on what?):
- [Task] — waiting on [dependency]

### Key decisions to make this week:
- [Decision]

### End-of-week check-in questions:
- Did I ship something a real user can see or benefit from?
- Did I learn something about what users actually want?
- Is the codebase in a better state than it was Monday?
```

---

*Document maintained by: Cooly Founder*
*Last updated: April 2026*
*Next review: May 2026*
*Version control: This document lives at `docs/project-plan/cooly-master-plan-v1.md` in the project repository.*
