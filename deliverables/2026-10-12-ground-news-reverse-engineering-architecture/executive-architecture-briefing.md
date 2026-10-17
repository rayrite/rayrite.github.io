# Executive Architecture Briefing: Ground News Reverse-Engineering & SaaS System Design

> **Document Type:** Executive Briefing & Strategic Technical Architecture Summary  
> **Target Subject:** [Ground News (ground.news)](https://ground.news/) / Snapwise Inc.  
> **Key Corporate Entities:** Snapwise Inc. (Android: `com.checkitt`, iOS: `id1324203419`)  
> **Leadership:** Harleen Kaur (CEO, ex-NASA New Horizons), Sukh Singh (CTO)  
> **Delivery Date:** 2026-10-12  
> **Companion Master Document:** `ground-news-architecture-reverse-engineering-teardown.md`  

---

## 1. Executive Overview & Strategic Genesis

**Ground News** is not a conventional news portal or subjective fact-checking site; it is a high-throughput **media intelligence and telemetry platform** designed to provide visual, objective visibility into the global information ecosystem.

The platform was conceptualized by Harleen Kaur, whose background in aerospace engineering (NASA's New Horizons spacecraft and commercial satellite constellations) provided a unique data-fusion perspective:
- In satellite remote sensing, no individual optical or radar sensor sees the complete picture; atmospheric noise and sensor angles distort raw data. Only by **fusing multiple disparate sensor passes** can an accurate, calibrated model of ground reality be achieved.
- Ground News treats over **50,000 independent global news outlets** as disparate human sensors. Individual articles contain inherent bias and editorial framing, but by clustering them around a single real-world event, readers can triangulate truth and expose political blindspots.

```
+--------------------------------------------------------------------------------------------------+
|                            THE 4 ARCHITECTURAL PILLARS OF GROUND NEWS                            |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   1. Event Clustering Engine          2. Triple-Watchdog Consensus    3. Blindspot Skew Math     |
|   - Sentence-BERT Vectors (384-dim)   - AllSides + Ad Fontes + MBFC   - Partisan Coverage Ratio  |
|   - Incremental HNSW Similarity       - 7-Point Political Axis        - Dedicated Left & Right   |
|   - Real-Time Centroid Merging        - Normalized Distribution Bar     Underreported Feeds      |
|                                                                                                  |
|                               4. Media-opoly Ownership Graph                                     |
|                               - 2,276+ Hand-Coded Corporate Parentage Records                    |
|                               - Conglomerates, Billionaires, Independent, State-Funded           |
+--------------------------------------------------------------------------------------------------+
```

---

## 2. Core Architectural Pillars & Reverse-Engineered Findings

### Pillar 1: Incremental Multi-Source Event Clustering
- Ingests millions of daily articles across 50,000+ sources.
- Employs dual vector representation (384-dimensional dense semantic embeddings + sparse named-entity vectors) to detect identical real-world stories across disparate headlines in $< 50	ext{ms}$.
- Clusters are updated in real time via HNSW vector search with rolling 48-hour temporal decay penalties.

### Pillar 2: Consensus-Driven Media Bias Distribution
- Avoids proprietary subjective bias accusations by synthesizing three independent watchdogs: **AllSides, Ad Fontes Media, and Media Bias Fact Check (MBFC)**.
- Normalizes ratings onto a continuous spectrum $[-3.0, +3.0]$ mapped across seven buckets: Far Left, Left, Lean Left, Center, Lean Right, Right, and Far Right.
- Renders an interactive 3-segment visual meter (Left, Center, Right) across every story cluster.

### Pillar 3: Algorithmic Blindspot Detection
- Flags news stories where $>65\%$ of coverage originates from one political wing while $<15\%$ comes from the other (with $N_{total} \ge 8$ sources).
- Distributes clusters into dedicated **"For the Left"** and **"For the Right"** Blindspot Feeds, highlighting topics ignored by partisan echo chambers.

### Pillar 4: Corporate Ownership Transparency
- Integrates a relational graph of corporate parent companies, categorizing news outlets into Media Conglomerates, Billionaire Owners, Independent Publishers, and State-Funded Broadcasters.

---

## 3. Technology Stack Comparison & Production Baseline

The table below contrasts Ground News's current reverse-engineered commercial infrastructure with the recommended open SaaS stack designed for high-performance self-hosted deployment:

| Architectural Layer | Ground News Commercial Production | Recommended Production SaaS Spine | Strategic Architectural Rationale |
| :--- | :--- | :--- | :--- |
| **Web Frontend** | Next.js (Turbopack) + Tailwind CSS | SvelteKit 2 + Tailwind CSS | Sub-second LCP, smaller JS bundle, zero-hydration overhead |
| **Mobile Clients** | Native Android (Kotlin) & iOS (Swift) | Dart / Flutter + Native Platform Bridges | Codebase parity across iOS & Android with native biometric RASP |
| **Desktop Shell** | None (Web Only) | Tauri v2 + Rust | Desktop native client with $< 15	ext{MB}$ RAM overhead |
| **Backend API** | Node.js / Python Microservices | Node.js (v22/v24 LTS) + Fastify | High-throughput asynchronous routing with Schema validation |
| **Primary Database** | Relational DB + Vector DB Cluster | PostgreSQL 16 + pgvector + RLS | Unified relational, vector, and trigram data in one ACID engine |
| **Realtime Engine** | WebSockets & SSE Internal Gateway | Supabase Realtime + SSE | Native PostgreSQL logical replication listener for live bias bars |
| **Cache & Task Queue** | Redis Cluster | Redis 7 + BullMQ | Multi-tier priority queue topology (sub-second wire alerts to batch crons) |
| **Analytics Engine** | Sentry, Custom Event Collectors | ClickHouse / DuckDB | Columnar data aggregation for instant "My Bias" reading history |
| **CDN & Storage** | BunnyCDN (groundnews.b-cdn.net) | Cloudflare R2 + Edge CDN | Zero-egress fee object storage for crawled publisher thumbnails |

---

## 4. Crawling & Anti-Bot Infrastructure Summary

Operating an aggregation pipeline across 50,000 publishers without being blocked requires sophisticated, ethical ingestion mechanisms:
1. **Hierarchical Proxy Routing:** Direct egress for whitelisted wire feeds (AP, Reuters), datacenter proxies for open RSS endpoints, and rotating residential IP backconnect pools for WAF-protected portals.
2. **TLS / JA3 Fingerprint Spoofing:** Modified HTTP client stacks (`curl-impersonate`) mimicking Chrome/Safari TLS Client Hello headers and HTTP/2 settings, preventing passive WAF blocks.
3. **Paywall Metadata Detection:** Reads Schema.org `isAccessibleForFree: false` JSON-LD tags and CSS subscription barriers during ingest to attach paywall icons without performing unauthorized bypasses.

---

## 5. Enterprise B2B, Monetization & Web3 Roadmap

```
+--------------------------------------------------------------------------------------------------+
|                              MULTI-TIER MONETIZATION & B2B TOPOLOGY                              |
+--------------------------------------------------------------------------------------------------+
|                                                                                                  |
|   [Consumer Subscriptions]         [Enterprise B2B Workspaces]     [Web3 Decentralized Provenance|
|   - Free Basic                     - Multi-Tenant Org Domains      - Merkle Root Story Hashing   |
|   - Pro ($1-$3/mo)                 - SCIM 2.0 User Provisioning    - Immutable L2 Polygon Minting|
|   - Vantage ($5/mo or $30-$40/yr)  - SAML 2.0 Single Sign-On       - NFT Lifetime Patron Passes  |
|   - Stripe / StoreKit 2 / Google   - Team Bias Diet Analytics      - Sign-In with Ethereum (SIWE)|
+--------------------------------------------------------------------------------------------------+
```

### Key Highlights
- **Triple Consumer Payment Processing:** Synchronized server-side validation across Stripe Webhooks, Apple StoreKit 2 Server API v2, and Google Play Developer API v3.
- **Enterprise Workplace Media Diversity:** B2B dashboards offering corporate research teams and educational organizations an aggregated, anonymized view of their organization's media exposure.
- **Web3 Provenance & Anti-Deepfake Verification:** Automated cryptographic timestamping of news cluster Merkle roots on Polygon Layer 2, providing unforgeable historical verification of breaking news reporting.

---

## 6. Deliverable Index & Directory Reference

The complete architectural teardown, complete with executable Fastify code, dual-track PostgreSQL DDL schemas, decompiled Kotlin/Swift domain models, and detailed mathematical formulas, is located in the companion deliverable:

- **Master Architectural Report:**  
  [ground-news-architecture-reverse-engineering-teardown.md](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_gemini/deliverables/2026-10-12-ground-news-reverse-engineering-architecture/ground-news-architecture-reverse-engineering-teardown.md)
