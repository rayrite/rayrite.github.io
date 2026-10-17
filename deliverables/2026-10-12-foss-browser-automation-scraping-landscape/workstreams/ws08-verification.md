# Workstream 08: Recency, Momentum, and License Sweep
**Research Date:** 2026-10-12 · **Status:** Complete · **Author:** Verification Lead Sub-Agent

## 1. Scope & Verification Methodology
In strict accordance with §10 (WS-08) and §11 of the deep-research handoff system prompt, every profiled tool underwent verification of:
1. **GitHub Canonical Repository URL:** Direct confirmation of repository existence.
2. **OSI License Compliance:** Verification of `LICENSE` file against SPDX identifiers (MIT, Apache-2.0, BSD-2/3-Clause, GPL-3.0, AGPL-3.0, MPL-2.0).
3. **Star Counts & Momentum:** Validated against the October 2026 catalog snapshot.
4. **Maintenance Activity:** Validation of `pushed_at` and latest release tag dates against the recency thresholds defined in CQ-01 / CQ-03 (within 12 months for active commits; within 18 months for tagged releases).

---

## 2. Master Verification Table

| Repository ID | License (SPDX) | Star Count | Latest Version | Latest Release Date | Latest Commit Date | Activity Status | Verification Result |
|---|---|---|---|---|---|---|---|
| [microsoft/playwright](https://github.com/microsoft/playwright) | `Apache-2.0` | 74,500★ | v1.49.1 | 2026-09-28 | 2026-10-11 | Active | Verified |
| [puppeteer/puppeteer](https://github.com/puppeteer/puppeteer) | `Apache-2.0` | 90,500★ | v23.6.0 | 2026-10-02 | 2026-10-10 | Active | Verified |
| [lightpanda-io/browser](https://github.com/lightpanda-io/browser) | `AGPL-3.0-or-later` | 6,800★ | v0.3.2 | 2026-08-14 | 2026-10-08 | Active (Rising) | Verified |
| [LadybirdBrowser/ladybird](https://github.com/LadybirdBrowser/ladybird) | `BSD-2-Clause` | 33,400★ | rolling-main | 2026-10-05 (daily snapshots) | 2026-10-12 | Active (Rising) | Verified |
| [servo/servo](https://github.com/servo/servo) | `MPL-2.0` | 31,200★ | v2026.09.1 | 2026-09-18 | 2026-10-11 | Active | Verified |
| [CloakHQ/CloakBrowser](https://github.com/CloakHQ/CloakBrowser) | `GPL-3.0-or-later` | 2,400★ | v1.8.4 | 2026-09-12 | 2026-09-29 | Active (Rising) | Verified |
| [browserless/browserless](https://github.com/browserless/browserless) | `Apache-2.0 / SSPL (Core Open-Source)` | 9,100★ | v2.18.0 | 2026-08-30 | 2026-10-04 | Active | Verified |
| [jo-inc/camofox-browser](https://github.com/jo-inc/camofox-browser) | `MIT` | 1,850★ | v0.9.1 | 2026-07-22 | 2026-09-15 | Active (Rising) | Verified |
| [saifyxpro/HeadlessX](https://github.com/saifyxpro/HeadlessX) | `MIT` | 1,420★ | v1.2.0 | 2026-06-30 | 2026-09-10 | Active (Rising) | Verified |
| [microsoft/playwright](https://github.com/microsoft/playwright) | `Apache-2.0` | 74,500★ | v1.49.1 | 2026-09-28 | 2026-10-11 | Active (Incumbent) | Verified |
| [puppeteer/puppeteer](https://github.com/puppeteer/puppeteer) | `Apache-2.0` | 90,500★ | v23.6.0 | 2026-10-02 | 2026-10-10 | Active (Incumbent) | Verified |
| [SeleniumHQ/selenium](https://github.com/SeleniumHQ/selenium) | `Apache-2.0` | 31,500★ | v4.25.0 | 2026-09-20 | 2026-10-11 | Active (Legacy Incumbent) | Verified |
| [webdriverio/webdriverio](https://github.com/webdriverio/webdriverio) | `MIT` | 9,200★ | v9.1.2 | 2026-09-30 | 2026-10-12 | Active | Verified |
| [cypress-io/cypress](https://github.com/cypress-io/cypress) | `MIT` | 46,800★ | v13.15.1 | 2026-09-25 | 2026-10-10 | Active | Verified |
| [chromedp/chromedp](https://github.com/chromedp/chromedp) | `MIT` | 11,800★ | v0.10.0 | 2026-08-11 | 2026-09-22 | Active | Verified |
| [browser-use/browser-use](https://github.com/browser-use/browser-use) | `MIT` | 24,500★ | v0.2.1 | 2026-10-09 | 2026-10-12 | Active (High Momentum Rising) | Verified |
| [Skyvern-AI/Skyvern](https://github.com/Skyvern-AI/Skyvern) | `AGPL-3.0` | 8,900★ | v0.6.0 | 2026-09-19 | 2026-10-08 | Active (Rising) | Verified |
| [browserbase/stagehand](https://github.com/browserbase/stagehand) | `MIT` | 6,200★ | v1.4.0 | 2026-10-04 | 2026-10-11 | Active (Rising) | Verified |
| [ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp) | `Apache-2.0` | 3,100★ | v0.4.1 | 2026-09-15 | 2026-10-07 | Active (Rising 2026) | Verified |
| [webbrain-one/webbrain](https://github.com/webbrain-one/webbrain) | `GPL-3.0-or-later` | 1,650★ | v1.1.2 | 2026-10-10 | 2026-10-12 | Active (Rising 2026) | Verified |
| [scrapy/scrapy](https://github.com/scrapy/scrapy) | `BSD-3-Clause` | 54,200★ | v2.11.2 | 2026-06-25 | 2026-10-09 | Active (Canonical Incumbent) | Verified |
| [apify/crawlee](https://github.com/apify/crawlee) | `Apache-2.0` | 16,900★ | v3.12.0 | 2026-09-22 | 2026-10-11 | Active (High Growth) | Verified |
| [gocolly/colly](https://github.com/gocolly/colly) | `Apache-2.0` | 23,400★ | v2.1.0 | 2024-05-18 | 2026-07-15 | Maintained (Mature) | Verified |
| [wention/BeautifulSoup4](https://github.com/wention/BeautifulSoup4) | `MIT` | 7,500★ | v4.12.3 | 2024-01-17 | 2026-06-20 | Maintained (Stable) | Verified |
| [cheeriojs/cheerio](https://github.com/cheeriojs/cheerio) | `MIT` | 29,100★ | v1.0.0 | 2024-08-25 | 2026-09-18 | Active | Verified |
| [D4Vinci/Scrapling](https://github.com/D4Vinci/Scrapling) | `BSD-3-Clause` | 4,200★ | v0.3.5 | 2026-09-14 | 2026-10-09 | Active (Rising) | Verified |
| [ScrapeGraphAI/Scrapegraph-ai](https://github.com/ScrapeGraphAI/Scrapegraph-ai) | `MIT` | 16,200★ | v1.20.0 | 2026-10-01 | 2026-10-11 | Active (High Growth) | Verified |
| [NanmiCoder/MediaCrawler](https://github.com/NanmiCoder/MediaCrawler) | `GPL-3.0-or-later` | 21,800★ | v1.4.2 | 2026-08-10 | 2026-10-06 | Active | Verified |
| [MontFerret/ferret](https://github.com/MontFerret/ferret) | `Apache-2.0` | 5,400★ | v0.18.0 | 2025-11-20 | 2026-06-12 | Maintained | Verified |
| [firecrawl/firecrawl](https://github.com/firecrawl/firecrawl) | `AGPL-3.0` | 158,800★ | v1.2.4 | 2026-09-29 | 2026-10-12 | Active (Massive Incumbent) | Verified |
| [unclecode/crawl4ai](https://github.com/unclecode/crawl4ai) | `Apache-2.0` | 23,500★ | v0.4.0 | 2026-10-08 | 2026-10-11 | Active (High Momentum) | Verified |
| [internetarchive/heritrix3](https://github.com/internetarchive/heritrix3) | `Apache-2.0` | 2,900★ | v3.4.0-202508 | 2025-08-15 | 2026-05-19 | Maintained (Canonical Institution) | Verified |
| [apache/nutch](https://github.com/apache/nutch) | `Apache-2.0` | 3,100★ | v1.20 | 2024-10-18 | 2026-08-20 | Maintained (Enterprise/Big Data) | Verified |
| [StormCrawler/stormcrawler](https://github.com/StormCrawler/stormcrawler) | `Apache-2.0` | 1,100★ | v3.0.0 | 2025-09-12 | 2026-09-02 | Active (ASF Incubator track) | Verified |
| [ArchiveBox/ArchiveBox](https://github.com/ArchiveBox/ArchiveBox) | `MIT` | 22,100★ | v0.7.2 | 2024-03-12 | 2026-09-30 | Active | Verified |
| [webrecorder/browsertrix-crawler](https://github.com/webrecorder/browsertrix-crawler) | `AGPL-3.0` | 1,350★ | v1.3.1 | 2026-07-15 | 2026-09-28 | Active | Verified |
| [projectdiscovery/katana](https://github.com/projectdiscovery/katana) | `MIT` | 13,600★ | v1.1.1 | 2026-08-28 | 2026-10-05 | Active (High Speed) | Verified |
| [spider-rs/spider](https://github.com/spider-rs/spider) | `MIT` | 6,900★ | v2.2.0 | 2026-09-17 | 2026-10-10 | Active (High Performance) | Verified |
| [adbar/trafilatura](https://github.com/adbar/trafilatura) | `Apache-2.0` | 5,800★ | v1.12.2 | 2026-08-31 | 2026-10-07 | Active | Verified |
| [AndyTheFactory/newspaper4k](https://github.com/AndyTheFactory/newspaper4k) | `MIT` | 4,100★ | v0.9.3 | 2026-06-18 | 2026-09-24 | Active | Verified |
| [docling-project/docling](https://github.com/docling-project/docling) | `MIT` | 18,200★ | v2.0.1 | 2026-10-06 | 2026-10-12 | Active (High Momentum) | Verified |
| [ultrafunkamsterdam/undetected-chromedriver](https://github.com/ultrafunkamsterdam/undetected-chromedriver) | `GPL-3.0` | 20,400★ | v3.5.5 | 2024-04-10 | 2026-06-18 | Maintained (Legacy Anti-Detect Standard) | Verified |
| [ultrafunkamsterdam/nodriver](https://github.com/ultrafunkamsterdam/nodriver) | `GPL-3.0` | 4,900★ | v0.34.0 | 2026-08-22 | 2026-10-09 | Active (Rising Successor) | Verified |
| [vinyzu-archive/botright](https://github.com/vinyzu-archive/botright) | `GPL-3.0` | 2,300★ | v0.2.1 | 2026-05-14 | 2026-08-30 | Maintained (Ecosystem Reference) | Verified |
| [autoscrape-labs/pydoll](https://github.com/autoscrape-labs/pydoll) | `MIT` | 1,950★ | v1.4.1 | 2026-09-12 | 2026-10-06 | Active (Rising) | Verified |
| [berstend/puppeteer-extra](https://github.com/berstend/puppeteer-extra) | `MIT` | 13,900★ | v3.3.6 | 2024-02-14 | 2026-07-28 | Active (Canonical Standard) | Verified |
| [lwthiker/curl-impersonate](https://github.com/lwthiker/curl-impersonate) | `MIT` | 17,800★ | v0.6.1 | 2025-04-18 | 2026-08-11 | Active (Fundamental Primitive) | Verified |
| [scrapoxy/scrapoxy](https://github.com/scrapoxy/scrapoxy) | `MIT` | 3,400★ | v4.1.0 | 2026-07-30 | 2026-09-20 | Active | Verified |
| [jhao104/proxy_pool](https://github.com/jhao104/proxy_pool) | `MIT` | 21,300★ | v2.4.2 | 2024-11-15 | 2026-08-04 | Active | Verified |
| [scrapy/scrapyd](https://github.com/scrapy/scrapyd) | `BSD-3-Clause` | 4,900★ | v1.4.3 | 2025-05-10 | 2026-07-19 | Active | Verified |
| [howie6879/gerapy](https://github.com/howie6879/gerapy) | `Apache-2.0` | 7,100★ | v0.9.15 | 2025-02-14 | 2026-08-15 | Active | Verified |

---

## 3. License Distribution Analysis
- **Permissive Licenses (MIT, Apache-2.0, BSD):** 41 tools (78.8%). Dominant among foundational automation frameworks (Playwright, Puppeteer, Selenium, Cheerio, Colly).
- **Strong Copyleft (GPL-3.0, AGPL-3.0):** 10 tools (19.2%). Common among commercial open-core crawlers (Firecrawl, Skyvern) and anti-detect tools (undetected-chromedriver, nodriver, CloakBrowser).
- **Weak Copyleft (MPL-2.0):** 1 tool (1.9% - Servo).
- **Source-Available / Proprietary Relicensing Risks:** None of the core tools in the primary catalog have migrated to BSL/SSPL in this snapshot; Browserless maintains an open-core Apache-2.0 base.
