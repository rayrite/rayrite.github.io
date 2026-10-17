# Workstream 01: Category Taxonomy and Scope Tightening
**Research Date:** 2026-10-12 · **Status:** Complete · **Author:** Taxonomy Lead Sub-Agent

## 1. Executive Summary & Objective
This workstream establishes an unambiguous classification rubric for Free and Open Source Software (FOSS) tools across four core functional domains and one specialized cross-cutting domain:
1. **Headless Browser Runtimes & Low-Level Engines**
2. **Browser Automation Frameworks & Libraries**
3. **Web Scraping Libraries & Parsing Frameworks**
4. **Data Harvesting & Web-Scale Crawling Systems**
5. **Specialized Subdomains (Anti-Detection, Captcha, Proxy, Monitoring)**

Because modern web automation tooling frequently exhibits dual or hybrid behaviors (e.g., a scraping framework bundling a headless browser adapter or an AI agent wrapping an automation driver), this rubric establishes a **Primary Category Assignment Rule** with secondary role tags to eliminate ambiguity and prevent double-counting.

---

## 2. Category Definitions

| Category ID | Category Name | Canonical One-Sentence Definition | Primary Abstraction Boundary |
|---|---|---|---|
| **CAT-01** | **Headless Browser Runtimes & Low-Level Engines** | Standalone browser binaries, rendering engines, and daemon runtimes executing layout, networking, and JavaScript without a physical graphical display. | Binary & Process Level (OS execution, rendering engine, CDP server). |
| **CAT-02** | **Browser Automation Frameworks & Libraries** | Language-level SDKs and programmatic APIs designed to control browser instances, navigate pages, simulate user interactions, and manage tabs. | API & Protocol Client Level (Command dispatching, DOM interaction, event listeners). |
| **CAT-03** | **Web Scraping Libraries & Parsing Frameworks** | Targeted data extraction libraries and parser pipelines focused on issuing HTTP requests, traversing HTML/XML DOM structures, and extracting structured records. | Document & Extraction Level (HTTP client, CSS/XPath selector engine, item pipelines). |
| **CAT-04** | **Data Harvesting & Web-Scale Crawling Systems** | High-throughput, distributed, or web-scale crawling architectures designed for mass dataset acquisition, URL frontier traversal, and storage formatting (e.g., WARC, Markdown). | System & Scale Level (Frontier scheduling, politeness queues, storage pipelines). |
| **CAT-05** | **Specialized Subdomains** | Auxiliary utilities designed specifically for anti-bot fingerprint evasion, TLS/JA4 impersonation, CAPTCHA integration, proxy rotation, and crawl monitoring. | Evasion & Infrastructure Level (Network layer spoofing, proxy orchestration, management dashboards). |

---

## 3. Assignment Rubric & Decision Tree

To classify any given candidate tool:
1. **Does the tool provide its own rendering engine binary or headless browser process (separate from language bindings)?**
   - *YES:* Assign to **CAT-01: Headless Browser Runtimes** (e.g., `lightpanda-io/browser`, `LadybirdBrowser/ladybird`, `servo/servo`, `browserless/browserless`).
   - *NO:* Proceed to step 2.
2. **Is the tool's primary purpose to control browser lifecycles, drive clicks/keystrokes, or act as an autonomous browser agent?**
   - *YES:* Assign to **CAT-02: Browser Automation Frameworks** (e.g., `microsoft/playwright`, `puppeteer/puppeteer`, `SeleniumHQ/selenium`, `browser-use/browser-use`, `browserbase/stagehand`).
   - *NO:* Proceed to step 3.
3. **Is the tool primarily focused on mass URL traversal, web archiving (WARC), full-site recursive extraction, or LLM-ready markdown pipelines?**
   - *YES:* Assign to **CAT-04: Data Harvesting & Crawling** (e.g., `firecrawl/firecrawl`, `unclecode/crawl4ai`, `internetarchive/heritrix3`, `apache/nutch`, `ArchiveBox/ArchiveBox`).
   - *NO:* Proceed to step 4.
4. **Is the tool focused on anti-bot evasion (binary patching, TLS spoofing), proxy pool management, or spider monitoring dashboards?**
   - *YES:* Assign to **CAT-05: Specialized Subdomains** (e.g., `ultrafunkamsterdam/undetected-chromedriver`, `lwthiker/curl-impersonate`, `scrapoxy/scrapoxy`, `jhao104/proxy_pool`).
   - *NO:* Assign to **CAT-03: Web Scraping Libraries** (e.g., `scrapy/scrapy`, `wention/BeautifulSoup4`, `cheeriojs/cheerio`, `D4Vinci/Scrapling`).

---

## 4. Worked Boundary Cases & Tiebreakers

### Case 1: Playwright (`microsoft/playwright`)
- **Ambiguity:** Bundles browser binaries (Chromium, Firefox, WebKit) and provides high-level automation APIs.
- **Tiebreaker:** Classified primarily as **CAT-02: Browser Automation Framework**, with a secondary cross-listing under **CAT-01: Headless Browser Runtimes** for its distributed headless-shell and patched WebKit/Firefox binaries.

### Case 2: Crawlee (`apify/crawlee`)
- **Ambiguity:** Can run Cheerio (HTTP scraping) or Playwright/Puppeteer (browser automation) and crawls queues.
- **Tiebreaker:** Its core interface is an extraction crawler with request queues and item handlers. Classified primarily as **CAT-03: Web Scraping Libraries**, secondary as **CAT-04**.

### Case 3: Firecrawl (`firecrawl/firecrawl`)
- **Ambiguity:** Uses headless browsers under the hood, but is marketed as a web crawler to LLM-ready markdown.
- **Tiebreaker:** Primary capability is multi-page recursive crawling and automated markdown conversion at scale. Classified as **CAT-04: Data Harvesting & Web-Scale Crawling**.

### Case 4: Undetected-Chromedriver & nodriver (`ultrafunkamsterdam/nodriver`)
- **Ambiguity:** Controls Chrome via CDP, but its sole reason for existence is bypassing anti-bot systems.
- **Tiebreaker:** Purpose-built evasion tool. Classified as **CAT-05: Specialized Subdomains**.

---

## 5. Summary Matrix of Working Set

| Category | Candidate Count Profiled | Incumbent Anchor | Leading Rising Tool | Primary Protocol |
|---|---|---|---|---|
| **CAT-01: Headless Runtimes** | 9 | `puppeteer` (Chrome for Testing) | `lightpanda-io/browser` | CDP, Native V8, WebKit IPC |
| **CAT-02: Automation Frameworks** | 11 | `microsoft/playwright` | `browser-use/browser-use` | CDP, WebDriver BiDi, MCP |
| **CAT-03: Scraping Libraries** | 9 | `scrapy/scrapy` | `D4Vinci/Scrapling` | HTTP, lxml, Twisted, curl-cffi |
| **CAT-04: Data Harvesting** | 12 | `internetarchive/heritrix3` | `firecrawl/firecrawl` | HTTP/WARC, Redis, LLM Markdown |
| **CAT-05: Specialized Subdomains** | 10 | `berstend/puppeteer-extra` | `ultrafunkamsterdam/nodriver` | Binary patch, BoringSSL TLS, Proxy REST |
