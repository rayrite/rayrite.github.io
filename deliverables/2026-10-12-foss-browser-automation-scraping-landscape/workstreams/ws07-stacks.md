# Workstream 07: Ecosystem Stacks and Layered Dependencies
**Research Date:** 2026-10-12 · **Status:** Complete · **Author:** Stack Architect Sub-Agent

## 1. Scope & Objective
Modern web harvesting systems rarely operate in isolation. Production architectures compose multi-tiered toolchains that link HTTP engines, headless browsers, proxy orchestrators, and parser pipelines. This workstream documents five canonical architectural stacks covering common deployment scenarios in 2026.

---

## 2. Canonical Stack Architectures

### Stack A: Ultra-Fast Lightweight Python Scraping (No Browser Overhead)
- **Primary Use Case:** High-volume structured scraping of static or server-rendered sites (e.g., e-commerce, directory aggregators) at 1,000+ pages/minute.
- **Components:** `curl-cffi` / `httpx` (HTTP/2 + TLS Impersonation) + `selectolax` (High-speed C parser) + `Pydantic` (Schema validation).

```mermaid
graph LR
    A[Target Web Server] -->|TLS Impersonated HTTP/2| B[curl-cffi / httpx Client]
    B -->|Raw HTML Stream| C[Selectolax Modest Engine]
    C -->|Extracted Key-Value Nodes| D[Pydantic Data Models]
    D -->|Validated Records| E[(PostgreSQL / ClickHouse)]
```

### Stack B: Resilient Headless Python Automation with Stealth
- **Primary Use Case:** Scraping dynamic Single-Page Applications protected by modern Cloudflare Turnstile or DataDome challenges.
- **Components:** `scrapy` + `scrapy-playwright` + `CloakBrowser` / `Camofox` + `Scrapoxy` (Rotating proxy mesh).

```mermaid
graph TD
    A[Scrapy Engine] -->|Spider URL Dispatch| B[Scrapoxy Proxy Orchestrator]
    B -->|Residential Cloud IP| C[scrapy-playwright Downloader]
    C -->|CDP Session Pipes| D[CloakBrowser Stealth Chromium]
    D -->|Executes JS & Resolves Turnstile| E[Rendered HTML Snapshot]
    E -->|Scrapy Item Pipelines| F[Export JSONL / S3]
```

### Stack C: Modern TypeScript / Node.js Crawling Suite
- **Primary Use Case:** Enterprise Node.js crawling workflows with built-in auto-retry queues and proxy switching.
- **Components:** `apify/crawlee` + `microsoft/playwright` + `Chrome for Testing (headless-shell)` + `cheerio`.

```mermaid
graph LR
    A[Crawlee RequestQueue] -->|Adaptive Routing| B{Page Type?}
    B -->|Static HTML| C[CheerioCrawler - 20ms]
    B -->|Dynamic SPA| D[PlaywrightCrawler - 400ms]
    D -->|CDP Socket| E[headless-shell Worker]
    C --> F[Crawlee Dataset Storage]
    E --> F
```

### Stack D: Web-to-LLM Autonomous Knowledge Harvesting
- **Primary Use Case:** Ingesting full corporate documentation sites or news properties into clean Markdown for RAG embedding.
- **Components:** `firecrawl/firecrawl` (or `unclecode/crawl4ai`) + `adbar/trafilatura` (Boilerplate removal) + `Ollama` / `vLLM` (Semantic enrichment).

```mermaid
graph TD
    A[Target Domain Root] -->|Sitemap & Link Traversal| B[Firecrawl Distributed Cluster]
    B -->|Playwright Dynamic Evaluation| C[Trafilatura Content Filter]
    C -->|Boilerplate-Free Clean Markdown| D[Semantic Chunker & Embedder]
    D -->|Dense Vectors & Text Chunks| E[(Qdrant / Milvus Vector DB)]
```

### Stack E: High-Throughput Compiled Distributed Go Spider
- **Primary Use Case:** High-speed security reconnaissance, domain topology mapping, and asset discovery.
- **Components:** `projectdiscovery/katana` + `chromedp/chromedp` + `jhao104/proxy_pool`.

```mermaid
graph LR
    A[Seed Target URL] --> B[Katana Go Concurrency Core]
    B -->|HTTP Fast Pass| C[Go net/http Parser]
    B -->|JavaScript Heavy Pass| D[chromedp WebSocket CDP]
    C --> E[Endpoint & Form Extraction]
    D --> E
    E --> F[Standard JSONL Stream]
```
