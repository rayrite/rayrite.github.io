# Browser Automation, Web Scraping & Data-Extraction Repository Catalog

> **Scope.** This catalog is curated exclusively from the supplied `repo_showcase_merged.json` repository dataset. It covers browser control, headless browsing, web scraping and crawling, structured-data extraction, mobile/emulator automation, browser test automation, and related agentic/RPA workflows. Repository metadata and star counts are dataset snapshots, not live assessments. [1]

## Catalog Scope and Safety Boundary

The supplied dataset contains **6,327 unique repositories**. A high-recall metadata pass surfaced 340 candidates; semantic review and final relevance auditing retained **170 Core repositories** and **64 Adjacent repositories**, for **234 catalog entries**. [1]

> **Anti-bot boundary.** The catalog includes defensive bot detection, response analysis, honeypots, and challenge-testing tools. It intentionally excludes CAPTCHA solving, bot-detection evasion, stealth/undetected drivers, browser-fingerprint spoofing, proxy/IP rotation, Cloudflare bypasses, and other access-control-evasion tooling. Use web automation and data collection only where you have authorization and where applicable terms, robots directives, privacy obligations, and laws are respected.

| Tier | Definition | Repositories |
| --- | --- | ---: |
| **Core** | Direct browser, crawling, extraction, mobile automation, testing, defensive anti-bot, or browser-RPA capability. | 170 |
| **Adjacent** | Clearly supports one of the above workflows but is not primarily focused on it. | 64 |

## Coverage at a Glance

| Category | Core | Adjacent | Total | Primary value |
| --- | ---: | ---: | ---: | --- |
| Browser control & cross-browser automation | 41 | 6 | 47 | Libraries and control layers for programmatic browser interactions across Chromium, Firefox, WebKit, and browser sessions. |
| Headless browsing, browser infrastructure & rendering | 8 | 3 | 11 | Headless browsers, deployable browser workloads, CDP surfaces, and rendering infrastructure for automation at scale. |
| Web scraping, crawling & website extraction | 22 | 9 | 31 | Crawlers and extractors for collecting public web content, site discovery, and web-data preparation. |
| Bot defense, challenges & compliant browser identity | 6 | 0 | 6 | Defensive anti-bot detection, challenge testing, honeypots, and identity/response observability. Bypass- and evasion-oriented repositories are deliberately excluded. |
| Structured data extraction, document parsing & transformation | 60 | 15 | 75 | Document, PDF, webpage, OCR, and data-conversion tools that normalize raw inputs into structured, machine-usable outputs. |
| Android, mobile UI & emulator automation | 4 | 0 | 4 | Android/iOS device, simulator, emulator, and mobile-interface automation frameworks. |
| Browser testing, visual QA & observability | 4 | 3 | 7 | End-to-end test frameworks, visual-diff utilities, live-browser QA, and browser automation observability. |
| Agentic web workflows, RPA & no-code automation | 25 | 28 | 53 | Agentic browser/computer-use systems, visual web automation, RPA, and no-code automation workflows with direct browser capability. |

## Featured Starting Points

This compact guide is an entry point rather than a quality ranking. The complete, category-by-category tables below are the authoritative list. [1]

| Workflow | Recommended starting points | Representative role |
| --- | --- | --- |
| **Browser control & cross-browser automation** | [Playwright](https://github.com/microsoft/playwright); [Puppeteer](https://github.com/puppeteer/puppeteer); [Browser Use](https://github.com/browser-use/browser-use); [Chrome DevTools for agents](https://github.com/ChromeDevTools/chrome-devtools-mcp); [playwright-python](https://github.com/microsoft/playwright-python) | Unified framework to automate Chromium, Firefox, and WebKit for testing, scraping, automation and agent workflows.; High-level Node library for controlling Chromium and Firefox programmatically for automation, testing and scraping. |
| **Headless browsing, browser infrastructure & rendering** | [browserless](https://github.com/browserless/browserless); [Lightpanda Browser](https://github.com/lightpanda-io/browser); [BrowserOS](https://github.com/browseros-ai/BrowserOS); [moli](https://github.com/lexmount/moli) | Deployable headless browser platform (Docker/cloud) for running Puppeteer/Playwright and browser workloads at scale.; Lightweight open-source headless browser (Zig) designed for web automation and AI agent workflows. |
| **Web scraping, crawling & website extraction** | [Firecrawl](https://github.com/firecrawl/firecrawl); [crawl4ai](https://github.com/unclecode/crawl4ai); [crawlee](https://github.com/apify/crawlee); [crawlee-python](https://github.com/apify/crawlee-python); [Scrapegraph-ai](https://github.com/ScrapeGraphAI/Scrapegraph-ai) | API for large-scale searching, scraping and interacting with JavaScript-heavy sites.; LLM-friendly open-source web crawler and scraper designed for collecting and preparing web data for AI. |
| **Bot defense, challenges & compliant browser identity** | [bunkerweb](https://github.com/bunkerity/bunkerweb); [Krawl](https://github.com/BlessedRebuS/Krawl); [FCaptcha](https://github.com/WebDecoy/FCaptcha); [is-antibot](https://github.com/microlinkhq/is-antibot) | Security-focused web hosting/hardening stack providing WAF/antibot and best-practice defaults.; Cloud-native web deception/honeypot server to detect and analyze crawlers and attackers. |
| **Structured data extraction, document parsing & transformation** | [docling](https://github.com/docling-project/docling); [MinerU](https://github.com/opendatalab/MinerU); [marker](https://github.com/datalab-to/marker); [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR); [maxun](https://github.com/getmaxun/maxun); [anydoc](https://github.com/firecrawl/anydoc) | Document parsing and conversion toolkit to prepare documents for generative AI.; All-in-one open-source data extraction tool for PDFs, webpages, and e-books. |
| **Android, mobile UI & emulator automation** | [agent-device](https://github.com/callstackincubator/agent-device); [Phone Driver](https://github.com/OminousIndustries/PhoneDriver); [sim-use](https://github.com/lycorp-jp/sim-use); [phone-harness](https://github.com/ShawnPana/phone-harness) | CLI to control iOS and Android devices, enabling AI agents to interact with mobile UIs and automate device actions.; Vision-guided mobile automation agent controlling Android via ADB and VLM. |
| **Browser testing, visual QA & observability** | [Cypress](https://github.com/cypress-io/cypress); [Expect](https://github.com/millionco/expect); [testsprite-cli](https://github.com/TestSprite/testsprite-cli); [blazediff](https://github.com/teimurjan/blazediff) | End-to-end web testing framework for building reliable browser test pipelines (Cypress).; Automated testing skill that runs agent-driven tests in real browsers using Playwright. |
| **Agentic web workflows, RPA & no-code automation** | [Stagehand](https://github.com/browserbase/stagehand); [Skyvern](https://github.com/Skyvern-AI/skyvern); [agent-browser](https://github.com/vercel-labs/agent-browser); [EasySpider](https://github.com/NaiboWang/EasySpider); [mcp](https://github.com/browsermcp/mcp) | AI web browsing framework emphasizing simplicity and extensibility for agent-driven browsing and automation.; AI-driven platform to automate browser workflows and RPA with Playwright/Puppeteer/Selenium integrations. |

## Complete Categorized Catalog

Entries in each section are grouped into **Core** and **Adjacent** resources and ordered by review confidence followed by the source star snapshot. [1]

### Browser control & cross-browser automation

Libraries and control layers for programmatic browser interactions across Chromium, Firefox, WebKit, and browser sessions.

#### Core (41)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Puppeteer](https://github.com/puppeteer/puppeteer) | High-level Node library for controlling Chromium and Firefox programmatically for automation, testing and scraping. | TypeScript | 95,255 |
| [Playwright](https://github.com/microsoft/playwright) | Unified framework to automate Chromium, Firefox, and WebKit for testing, scraping, automation and agent workflows. | TypeScript | 93,777 |
| [Chrome DevTools for agents](https://github.com/ChromeDevTools/chrome-devtools-mcp) | MCP server bridging agents to Chrome DevTools via Puppeteer for browser control. | TypeScript | 48,289 |
| [Helium](https://github.com/imputnet/helium) | Lightweight open-source browser automation and scraping tool for interaction and extraction workflows. | C++ | 17,798 |
| [browser-harness](https://github.com/browser-use/browser-harness) | Self-healing browser harness providing persistent browsers for LLM-driven automation tasks. | Python | 16,745 |
| [opencli](https://github.com/jackwener/opencli) | CLI hub that exposes websites, browser sessions and local apps as scriptable interfaces. | JavaScript | 16,287 |
| [playwright-python](https://github.com/microsoft/playwright-python) | Official Python bindings for Playwright, a cross-browser automation library. | Python | 14,918 |
| [Nanobrowser](https://github.com/nanobrowser/nanobrowser) | Chrome extension for AI-powered web automation and multi-agent workflows. | TypeScript | 13,567 |
| [playwright-cli](https://github.com/microsoft/playwright-cli) | CLI tooling for Playwright: record sessions, generate code, inspect selectors, and take screenshots. | JavaScript | 12,593 |
| [mcp-chrome](https://github.com/hangwin/mcp-chrome) | Chrome extension-based MCP server exposing full browser functionality to AI assistants. | TypeScript | 11,253 |
| [ego-lite](https://github.com/citrolabs/ego-lite) | Lightweight tool for sharing logged-in browser state with AI agents to run fast browser automation without disturbing the user. | JavaScript | 7,088 |
| [mcp-playwright](https://github.com/executeautomation/mcp-playwright) | Playwright Model Context Protocol to automate browsers and APIs. | TypeScript | 5,632 |
| [Browserbase Skills](https://github.com/browserbase/skills) | Reusable browser automation skills for AI agents. | JavaScript | 3,610 |
| [chrome-cdp](https://github.com/pasky/chrome-cdp-skill) | Connects agents to an existing Chrome session via the Chrome DevTools Protocol for live tab control and inspection. | JavaScript | 2,913 |
| [Vibium](https://github.com/VibiumDev/vibium) | Go-based AI-native browser automation framework with CLI, MCP server, and client libraries. | Go | 2,776 |
| [playwright-skill](https://github.com/lackeyjb/playwright-skill) | Claude Code Playwright skill allowing model-invoked execution of custom Playwright scripts with visibility and cleanup. | JavaScript | 2,454 |
| [Rodney](https://github.com/simonw/rodney) | CLI tool to script a persistent headless Chrome instance using the rod library. | Go | 664 |
| [MolmoWeb](https://github.com/allenai/molmoweb) | Multimodal web agent that autonomously controls a browser to perform web tasks. | Python | 526 |
| [Webctl](https://github.com/cosinusalpha/webctl) | CLI tool for browser automation with structured extraction and Unix-style piping. | Python | 411 |
| [bux](https://github.com/browser-use/bux) | Persistent Claude Code agent delivering Playwright-style browser automation with cloud/Telegram integration. | Python | 395 |
| [Lightfeed Extractor](https://github.com/lightfeed/extractor) | Playwright-based extractor combining browser automation with schema validation. | TypeScript | 318 |
| [on-device-browser-agent](https://github.com/RunanywhereAI/on-device-browser-agent) | On-device AI browser automation using WebLLM for fully local, private control without cloud/API keys. | TypeScript | 298 |
| [Login Machine](https://github.com/RichardHruby/login-machine) | LLM-driven Playwright agent that automates complex website login flows while protecting credentials. | TypeScript | 289 |
| [bowser](https://github.com/disler/bowser) | Agentic browser automation and UI testing system built from composable skills and repeatable playbooks. | Just | 258 |
| [openbrowser-ai](https://github.com/billy-enrizky/openbrowser-ai) | Framework for LLM-driven browser automation combining CDP with a CodeAgent executing Python. | Python | 239 |
| [Certificate Inspector](https://github.com/shanselman/cert-inspector) | Web auditing tool using headless Playwright to capture network requests and inspect SSL/TLS and DNS for loaded domains. | JavaScript | 213 |
| [OpenUtter](https://github.com/sumansid/openutter) | Headless Playwright/Chromium bot to join Google Meet, capture captions, screenshots, and transcripts. | TypeScript | 181 |
| [AutoPage](https://github.com/AutoLab-SAI-SJTU/AutoPage) | Human–agent collaborative system that transforms academic papers into polished webpages using Playwright. | HTML | 165 |
| [browser-debugger-cli](https://github.com/szymdzum/browser-debugger-cli) | CLI exposing raw Chrome DevTools Protocol methods for direct, scriptable browser control and agent use. | TypeScript | 124 |
| [pilo](https://github.com/mozilla/pilo) | AI-powered web automation tool to get answers and take actions directly inside the browser. | TypeScript | 92 |
| [Playwright for Swift](https://github.com/m1guelpf/swift-playwright) | Swift bindings for Playwright enabling cross-browser automation (Chromium, Firefox, WebKit) via a dedicated Node.js Playwright server. | Swift | 85 |
| [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) | Node.js library using Puppeteer to control WhatsApp Web for messaging automation. | — | 0 |
| [Doppelganger](https://github.com/mnemosyne-artificial-intelligence/doppelganger) | Self-hosted, block-first automation control plane for auditable browser workflows (Playwright backend). | — | 0 |
| [Browser Use](https://github.com/browser-use/browser-use) | Library to make websites accessible to AI agents, integrating Playwright and agent tooling for browser use. | Python | 109,524 |
| [LaVague](https://github.com/lavague-ai/LaVague) | Framework for developing AI web agents (Large Action Model framework). | Python | 6,386 |
| [Webwright](https://github.com/microsoft/Webwright) | Browser agent framework designed for long-horizon web tasks and automated browsing workflows. | Python | 5,922 |
| [notebooklm-skill](https://github.com/PleasePrompto/notebooklm-skill) | Python skill to automate interaction with Google NotebookLM notebooks for source-grounded queries. | Python | 5,918 |
| [playwriter](https://github.com/remorses/playwriter) | Chrome extension + CLI to let agents control a live browser via the Playwright API. | HTML | 3,385 |
| [Code-Mode Library](https://github.com/universal-tool-calling-protocol/code-mode) | Library integrating Code-Mode tooling for browser automation on Chrome and Firefox (Puppeteer-based). | TypeScript | 1,502 |
| [webllama](https://github.com/McGill-NLP/webllama) | Llama-3 based agents that can browse the web and follow instructions via conversational interaction. | Python | 1,402 |
| [Agent-E](https://github.com/EmergenceAI/Agent-E) | Agent-driven automation focused on web/browser automation. | Python | 1,249 |

#### Adjacent (6)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [skills](https://github.com/davidondrej/skills) | Curated library of reusable agent skills including web research and browser automation building blocks. | Shell | 2,728 |
| [Excalidraw Diagram Skill](https://github.com/coleam00/excalidraw-diagram-skill) | Python skill for generating Excalidraw diagrams from natural language with Playwright-based visual validation. | Python | 2,451 |
| [ZAPI](https://github.com/adoptai/zapi) | Library that captures API calls from web apps using Playwright to aid tool discovery and HAR export. | Python | 471 |
| [Journey Forge Local](https://github.com/Einsia/Browser-BC) | Local recorder that converts user browser traces into reusable per-site automation skills. | TypeScript | 451 |
| [web-ui](https://github.com/browser-use/web-ui) | Browser-based UI to run AI agents and interact with cloud/local browser automation stacks. | Python | 16,283 |
| [selector-forge](https://github.com/Intuned/selector-forge) | Browser extension that uses AI to generate reliable CSS and XPath selectors for automation/testing. | TypeScript | 66 |

### Headless browsing, browser infrastructure & rendering

Headless browsers, deployable browser workloads, CDP surfaces, and rendering infrastructure for automation at scale.

#### Core (8)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Lightpanda Browser](https://github.com/lightpanda-io/browser) | Lightweight open-source headless browser (Zig) designed for web automation and AI agent workflows. | Zig | 34,010 |
| [browserless](https://github.com/browserless/browserless) | Deployable headless browser platform (Docker/cloud) for running Puppeteer/Playwright and browser workloads at scale. | TypeScript | 13,600 |
| [BrowserOS](https://github.com/browseros-ai/BrowserOS) | Open-source agentic browser designed to run and expose a browser surface for AI agents. | TypeScript | 13,231 |
| [boneyard](https://github.com/0xGF/boneyard) | CLI that runs a headless browser to record precise on-screen element bounding boxes to JSON. | TypeScript | 6,969 |
| [moli](https://github.com/lexmount/moli) | Rust-based browser optimized for AI agents and web automation, aiming to be lightweight and embeddable. | Rust | 469 |
| [herdr-browser](https://github.com/ogulcancelik/herdr-browser) | Embeds an interactive Chromium view in a terminal pane and exposes CDP. | TypeScript | 220 |
| [hwatu](https://github.com/hongnoul/hwatu) | Lightweight daemon verification browser (WebKitGTK) for fast agent-driven UI checks and measurements. | Rust | 69 |
| [BrowserOS neo](https://github.com/browseros.com/browseros-neo) | Chromium-based browser built to run AI agents and expose visible tabs for agent control. | — | 0 |

#### Adjacent (3)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [KeyLeak Detector](https://github.com/Amal-David/keyleak-detector) | Web scanner that uses headless browser automation and network interception to detect exposed API keys and secrets. | Python | 255 |
| [hyperframes](https://github.com/heygen-com/hyperframes) | Programmatic HTML-to-video workflow engine using Puppeteer and FFmpeg (HyperFrames). | TypeScript | 38,996 |
| [HolyClaude](https://github.com/CoderLuii/HolyClaude) | Dockerized AI coding workstation bundling Claude Code, devtools, a headless browser and Playwright. | Dockerfile | 2,506 |

### Web scraping, crawling & website extraction

Crawlers and extractors for collecting public web content, site discovery, and web-data preparation.

#### Core (22)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Firecrawl](https://github.com/firecrawl/firecrawl) | API for large-scale searching, scraping and interacting with JavaScript-heavy sites. | TypeScript | 158,765 |
| [crawl4ai](https://github.com/unclecode/crawl4ai) | LLM-friendly open-source web crawler and scraper designed for collecting and preparing web data for AI. | Python | 78,513 |
| [MediaCrawler](https://github.com/NanmiCoder/MediaCrawler) | Crawlers targeting social platforms for comments and post scraping. | Python | 62,638 |
| [Scrapegraph-ai](https://github.com/ScrapeGraphAI/Scrapegraph-ai) | Python web scraper leveraging AI techniques for crawling and extraction. | Python | 29,666 |
| [crawlee](https://github.com/apify/crawlee) | Node.js library for building reliable web crawlers; supports Puppeteer, Playwright, Cheerio, raw HTTP and proxies. | TypeScript | 25,419 |
| [katana](https://github.com/projectdiscovery/katana) | Next-generation crawling and spidering framework for large-scale web scraping and site discovery. | Go | 17,330 |
| [crawlee-python](https://github.com/apify/crawlee-python) | Python version of Crawlee: web scraping and browser automation toolkit using Playwright, BeautifulSoup, and HTTP. | Python | 9,438 |
| [ferret](https://github.com/MontFerret/ferret) | Declarative web-scraping runtime/library in Go. | Go | 6,008 |
| [Trend Finder 🔦](https://github.com/ericciarla/trendFinder) | AI system that crawls social media and websites to detect, analyze and notify trending topics in real time. | TypeScript | 4,003 |
| [fredy](https://github.com/orangecoding/fredy) | Puppeteer-based scraper that continuously monitors German real-estate sites and sends alerts. | JavaScript | 1,221 |
| [got-scraping](https://github.com/apify/got-scraping) | HTTP client built for web scraping, based on got. | TypeScript | 768 |
| [ax](https://github.com/yusukebe/ax) | CLI tool to fetch web pages and extract structured data, with parsing and schema features. | TypeScript | 635 |
| [Universal Reddit Scraper Suite](https://github.com/ksanjeev284/reddit-universal-scraper) | Full-featured Reddit scraping suite: posts, comments, media, dashboard and exports. | Python | 473 |
| [superspider](https://github.com/Lyx3314844-03/superspider) | Multi-language, enterprise-grade web scraping framework supporting Java/Go/Rust/Python. | — | 218 |
| [groqcrawl](https://github.com/jgravelle/groqcrawl) | Streamlit-based web crawler/scraper that extracts LLM-friendly content, supports single-page scraping, multi-page crawling, and site mapping. | Python | 112 |
| [Project-WebSage](https://github.com/AIAnytime/Project-WebSage) | AI engine that extracts content from URLs, summarizes, and enables conversational interaction over web content. | Python | 15 |
| [Crawl4AI](https://github.com/InsightEdge01/Crawl4AI) | Open-source crawler optimized for extracting clean content for LLMs and RAG. | Python | 2 |
| [firecrawl-mcp-server](https://github.com/mendableai/firecrawl-mcp-server) | MCP server adding web scraping capabilities to LLM clients like Cursor and Claude. | — | 0 |
| [Firecrawl](https://github.com/firecrawl.dev/firecrawl) | Web data API that crawls, renders JS, and returns cleaned Markdown or structured JSON for any public site. | — | 0 |
| [gpt-researcher](https://github.com/assafelovic/gpt-researcher) | Autonomous GPT-based agent that conducts online research by fetching and aggregating information from the web. | Python | 29,016 |
| [tradingview-scraper](https://github.com/mnwato/tradingview-scraper) | Python scraper targeting TradingView to extract site content programmatically. | Python | 415 |
| [firecrawl](https://github.com/mendableai/firecrawl) | Repository named 'firecrawl' with no description; heuristically categorized as a web crawler/scraper. | — | 0 |

#### Adjacent (9)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [mcp-crawl4ai-rag](https://github.com/coleam00/mcp-crawl4ai-rag) | Web crawling and RAG tooling to support AI agents and coding assistants. | Python | 2,239 |
| [deep-research-web-ui](https://github.com/AnotiaWang/deep-research-web-ui) | AI-powered research assistant that combines search engines, web scraping, and LLMs for deep research. | TypeScript | 2,206 |
| [Open Scouts](https://github.com/firecrawl/open-scouts) | AI web monitoring platform that runs scheduled 'scouts' to scrape and notify on web updates. | TypeScript | 1,272 |
| [notion-workers](https://github.com/colebemis/notion-workers) | Collection of TypeScript Notion Workers that fetch and sync web content into Notion databases. | TypeScript | 122 |
| [BrightDataMCPServerAgent](https://github.com/techwithtim/BrightDataMCPServerAgent) | Reference integration connecting Bright Data MCP server to agents for realtime scraping and structured retrieval. | Python | 18 |
| [Got](https://github.com/sindresorhus/got) | Human-friendly, powerful HTTP request client for Node.js used broadly for web requests and scraping workflows. | TypeScript | 14,930 |
| [deep-searcher](https://github.com/zilliztech/deep-searcher) | Open-source research/search tool that indexes and reasons over private data and web sources. | Python | 8,060 |
| [open-deep-research](https://github.com/nickscamara/open-deep-research) | Open-source research assistant that reasons over large web data sets extracted with Firecrawl. | TypeScript | 6,277 |
| [open-deep-research](https://github.com/fdarkaou/open-deep-research) | Open-source deep research tool aimed at replicating iterative web research workflows. | TypeScript | 880 |

### Bot defense, challenges & compliant browser identity

Defensive anti-bot detection, challenge testing, honeypots, and identity/response observability. Bypass- and evasion-oriented repositories are deliberately excluded.

#### Core (6)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Krawl](https://github.com/BlessedRebuS/Krawl) | Cloud-native web deception/honeypot server to detect and analyze crawlers and attackers. | Python | 518 |
| [FCaptcha](https://github.com/WebDecoy/FCaptcha) | Self-hosted bot detection and challenge system (FCaptcha) to detect automation. | JavaScript | 118 |
| [is-antibot](https://github.com/microlinkhq/is-antibot) | JavaScript library that detects which anti-bot protections (Cloudflare, Akamai, reCAPTCHA, hCaptcha, Turnstile, etc.) blocked requests by analyzing responses. | JavaScript | 24 |
| [bunkerweb](https://github.com/bunkerity/bunkerweb) | Security-focused web hosting/hardening stack providing WAF/antibot and best-practice defaults. | Python | 10,821 |
| [Agent Captcha](https://github.com/Dhravya/agent-captcha) | Cryptographic, byte-level challenge that proves a solver is an AI agent via SHA-256 proofs. | TypeScript | 72 |
| [agent-browser-shield](https://github.com/pixiebrix/agent-browser-shield) | Browser extension providing rules to keep AI agents safe while browsing. | TypeScript | 33 |

### Structured data extraction, document parsing & transformation

Document, PDF, webpage, OCR, and data-conversion tools that normalize raw inputs into structured, machine-usable outputs.

#### Core (60)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Stirling PDF](https://github.com/Stirling-Tools/Stirling-PDF) | Self-hosted web application providing various PDF operations (merge, edit, convert, OCR) and local PDF tooling. | Java | 89,705 |
| [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR) | Multilingual OCR toolkit based on PaddlePaddle supporting 80+ languages, training, data tools, and deployment across server, mobile, and embedded targets. | Python | 87,808 |
| [MinerU](https://github.com/opendatalab/MinerU) | All-in-one open-source data extraction tool for PDFs, webpages, and e-books. | Python | 77,834 |
| [docling](https://github.com/docling-project/docling) | Document parsing and conversion toolkit to prepare documents for generative AI. | Python | 64,950 |
| [marker](https://github.com/datalab-to/marker) | Fast converter to turn PDFs into Markdown and JSON with high accuracy. | Python | 38,811 |
| [Playwright MCP](https://github.com/microsoft/playwright-mcp) | Playwright MCP implementation using structured page data for LLM interactions. | TypeScript | 31,057 |
| [OpenDataLoader PDF](https://github.com/opendataloader-project/opendataloader-pdf) | PDF parser producing AI-ready structured data to automate PDF accessibility and extraction. | Java | 26,044 |
| [Unlimited-OCR](https://github.com/baidu/Unlimited-OCR) | Baidu's Unlimited-OCR: one-shot, long-horizon OCR and multi-page PDF parsing. | Python | 21,130 |
| [maxun](https://github.com/getmaxun/maxun) | No-code platform to scrape, crawl and convert websites into structured APIs for search and AI data extraction. | TypeScript | 17,171 |
| [anydoc](https://github.com/firecrawl/anydoc) | Rust library converting Word, PowerPoint, Excel, PDF, and other docs to clean GitHub-Flavored Markdown with WASM/Node/Python bindings and a CLI. | Rust | 16,697 |
| [LaTeX OCR](https://github.com/lukas-blecher/LaTeX-OCR) | pix2tex-based OCR to convert images of mathematical formulas into LaTeX code. | Python | 16,328 |
| [pdf-inspector](https://github.com/firecrawl/pdf-inspector) | Rust library for fast PDF classification and position-aware text extraction with Markdown output and WASM/Python/Node bindings. | Rust | 15,976 |
| [unstructured](https://github.com/Unstructured-IO/unstructured) | Libraries and APIs for building document preprocessing pipelines and extracting structured data from files and images. | HTML | 15,319 |
| [Skill Seeker](https://github.com/yusufkaraaslan/Skill_Seekers) | Framework that converts raw documentation and repos into structured knowledge assets. | Python | 12,885 |
| [BentoPDF](https://github.com/alam00000/bentopdf) | Client-side, privacy-first PDF toolkit for editing, OCR, merging and conversion in-browser. | JavaScript | 12,759 |
| [LiteParse](https://github.com/run-llama/liteparse) | Fast open-source document parser for OCR, PDF and text extraction tasks. | Rust | 12,112 |
| [reader](https://github.com/jina-ai/reader) | Service that converts any URL into an LLM-friendly input via a simple URL prefix. | TypeScript | 11,876 |
| [PDF-Extract-Kit](https://github.com/opendatalab/PDF-Extract-Kit) | Comprehensive toolkit for extracting high-quality content from PDFs. | Python | 9,964 |
| [Presidio](https://github.com/microsoft/presidio) | Toolkit to detect, redact and protect sensitive PII/PHI across text and structured data. | Python | 9,724 |
| [Chandra](https://github.com/datalab-to/chandra) | Advanced OCR/document intelligence model that converts pages to structured HTML/JSON/MD. | Python | 9,117 |
| [Dolphin](https://github.com/bytedance/Dolphin) | Universal document parsing model handling digital and photographed documents with layout analysis. | Python | 8,899 |
| [omniparse](https://github.com/adithya-s-k/omniparse) | Ingest and parse many data formats (documents, multimedia) for GenAI pipelines. | Python | 7,811 |
| [unstract](https://github.com/Zipstack/unstract) | No-code LLM platform for launching APIs and ETL pipelines to structure documents. | Python | 7,144 |
| [GLM-OCR](https://github.com/zai-org/GLM-OCR) | Multimodal OCR model (0.9B) for robust layout, table, formula and complex document recognition. | Python | 5,983 |
| [openrecall](https://github.com/openrecall/openrecall) | Privacy-first open-source system to index and recall your digital history and documents for searchable recall. | Python | 2,928 |
| [semtools](https://github.com/run-llama/semtools) | CLI tools for semantic search, document parsing and building static embeddings for search workflows. | Rust | 1,846 |
| [ContextGem](https://github.com/shcherbak-ai/contextgem) | Python framework for extracting structured data and insights from documents using LLMs. | Python | 1,823 |
| [deepseek_ocr_app](https://github.com/rdumasia303/deepseek_ocr_app) | Web app using DeepSeek-OCR for OCR + PDF processing, exporting extracted content to Markdown/HTML/DOCX/JSON. | JavaScript | 1,735 |
| [HunyuanOCR](https://github.com/Tencent-Hunyuan/HunyuanOCR) | Lightweight 1B-parameter vision-language OCR model for multilingual document parsing and info extraction. | Python | 1,603 |
| [Nano PDF Editor](https://github.com/gavrielc/Nano-PDF) | CLI tool for natural-language editing of PDFs using OCR re-hydration. | Python | 1,248 |
| [DeekSeek-OCR---Dockerized-API](https://github.com/Bogdanovich77/DeekSeek-OCR---Dockerized-API) | Dockerized OCR+PDF pipeline converting PDFs to structured Markdown via API. | Python | 1,089 |
| [lift](https://github.com/datalab-to/lift) | Vision model that extracts schema-constrained JSON from PDFs and images. | Python | 882 |
| [mdream](https://github.com/harlan-zw/mdream) | High-performance HTML-to-Markdown converter with streaming and a site crawler. | TypeScript | 867 |
| [textra](https://github.com/freedmand/textra) | macOS CLI converting images, PDFs, and audio to text via Apple APIs. | Swift | 755 |
| [DeepSeek-OCR Client](https://github.com/ihatecsv/deepseek-ocr-client) | Electron desktop client for running DeepSeek-OCR with drag-and-drop UI. | JavaScript | 751 |
| [Create Context Graph](https://github.com/neo4j-labs/create-context-graph) | Transforms documents and data into Neo4j graph structures to build context graphs for AI workflows. | Python | 667 |
| [unredact](https://github.com/leedrake5/unredact) | Utility to recover and display underlying text from poorly redacted PDFs by parsing PDF content streams and reconstructing layout (no OCR). | Python | 543 |
| [papermerge-core](https://github.com/papermerge/papermerge-core) | Core backend for Papermerge DMS providing OCR, scanned-document processing, REST API server, and frontend UI. | Python | 505 |
| [dom-docx](https://github.com/floodtide/dom-docx) | TypeScript library converting semantic HTML fragments into native, editable .docx (OOXML) with Node/browser/CLI support. | TypeScript | 471 |
| [mac-ocr](https://github.com/privatenumber/mac-ocr) | macOS CLI using Apple's Vision framework to perform OCR and generate searchable PDFs from images and documents. | Swift | 438 |
| [SmartResume](https://github.com/alibaba/SmartResume) | Layout-aware resume parser combining OCR, layout detection, and LLMs to extract structured resume fields from PDFs, images, and Office docs. | Python | 354 |
| [Parsel](https://github.com/shipfastlabs/parsel) | Fast open-source document parser for PHP to extract text and structured data from documents. | PHP | 326 |
| [SmolDocling-OCR-App](https://github.com/AIAnytime/SmolDocling-OCR-App) | Streamlit app using SmolDocling OCR model for document OCR and extraction. | Python | 261 |
| [Watch Skill](https://github.com/oxbshw/watch-skill) | Video intelligence layer that extracts searchable, timestamped evidence via OCR and transcription for agents. | Python | 247 |
| [mdflux](https://github.com/ibrahimqureshae/mdflux) | Local-first desktop app converting PDFs and other documents into clean, structured Markdown with OCR. | Svelte | 190 |
| [extract-design-system](https://github.com/arvindrk/extract-design-system) | CLI/agent skill that extracts design tokens (colors, typography, spacing) from any website. | TypeScript | 182 |
| [FinePDFs](https://github.com/huggingface/finepdfs) | End-to-end code and pipelines for filtering, OCR, layout extraction and processing of large PDF datasets. | Python | 181 |
| [textsnap](https://github.com/kouhxp/textsnap) | Command-line tool to extract plaintext from images, screenshots, or webpages offline (no GPU/cloud required). | Python | 159 |
| [Mistral-OCR-App](https://github.com/AIAnytime/Mistral-OCR-App) | Streamlit-based OCR app using the Mistral OCR API to extract text from images and documents. | Python | 94 |
| [ComPDF Self-Hosted](https://github.com/ComPDF/compdf-self-hosted) | Docker-based self-hosted PDF and document processing center with conversion and editing tools. | TypeScript | 80 |
| [n8n-and-code-rag](https://github.com/Getting-Automated/n8n-and-code-rag) | Production-ready RAG pipeline ingesting documents with OCR, PDF table extraction, embeddings, and intelligent versioning into Supabase/pgvector. | Python | 48 |
| [notebooks-vol1](https://github.com/doc-intel/notebooks-vol1) | Runnable notebooks that demonstrate end-to-end document-intelligence pipelines using OCR and RAG. | Python | 38 |
| [YOLOv8-License-Plate-Insights](https://github.com/yihong1120/YOLOv8-License-Plate-Insights) | YOLOv8-based license plate recognition pipeline integrating OCR and Vision AI for vehicle ID. | Jupyter Notebook | 14 |
| [Ocrbase](https://github.com/ocrbase-hq/ocrbase) | Model-agnostic API to parse PDFs/images into structured outputs (JSON/Markdown). | TypeScript | 7 |
| [surya](https://github.com/VikParuchuri/surya) | OCR and layout analysis toolkit handling reading order and line detection in 90+ languages. | — | 0 |
| [PDF to Markdown](https://github.com/M1ck4/pdf_to_md) | Privacy-focused local PDF-to-Markdown converter with OCR, table detection, and math-aware extraction. | — | 0 |
| [doc7](https://github.com/magicrew/doc7) | CLI that converts PDFs and images into AI-ready Markdown via a multimodal visual-understanding pipeline. | — | 0 |
| [DeepOCR](https://github.com/pkulium/DeepOCR) | DeepOCR reproduction with efficient visual-text compression and a training/evaluation pipeline. | — | 0 |
| [Edit Banana](https://github.com/BIT-DataLab/Edit-Banana) | Framework to convert statistical data formats into editable, more usable representations. | Python | 5,460 |
| [filewizard](https://github.com/LoredCast/filewizard) | Web UI for file conversion, OCR, transcription and TTS. | Python | 978 |

#### Adjacent (15)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [pydantic-ai](https://github.com/pydantic/pydantic-ai) | Pydantic-based shim to enforce structured LLM outputs and schema-validated generation. | Python | 19,354 |
| [outlines](https://github.com/dottxt-ai/outlines) | Library to enforce predictable, type-safe structured outputs from LLMs using Python types. | Python | 13,677 |
| [BAML](https://github.com/BoundaryML/baml) | Domain-specific language to obtain structured data from LLMs with strong developer DX. | Rust | 9,026 |
| [Unredact](https://github.com/Alex-Gilbert/unredact) | Client-side browser tool that combines OCR, font-aware constraint solving, and LLM ranking to generate plausible guesses for redacted PDF text. | Python | 310 |
| [Podcast](https://github.com/artnoage/Podcast) | Automated pipeline that converts academic PDFs into engaging audio podcasts using OCR and LLM agents. | Python | 260 |
| [parsevision](https://github.com/orasik/parsevision) | Visualizes what OCR parsed in PDFs to help find missed or mis-extracted data. | Python | 84 |
| [WrenAI](https://github.com/Canner/WrenAI) | Tool to make databases RAG-ready and improve Text-to-SQL for secure, accurate queries. | TypeScript | 17,293 |
| [guardrails](https://github.com/guardrails-ai/guardrails) | Framework for adding guardrails and constraints to LLM outputs and behavior. | Python | 7,295 |
| [Daft](https://github.com/Eventual-Inc/Daft) | High-performance data engine for multimodal AI workloads, processing images, audio, video, and structured data at scale with built-in AI ops. | Rust | 5,424 |
| [Better Shot](https://github.com/KartikLabhshetwar/better-shot) | macOS screenshot manager with capture, editing, annotation and local OCR using the Vision framework. | TypeScript | 1,586 |
| [vmodal_sdk_flutter](https://github.com/v-modal/vmodal_sdk_flutter) | Flutter SDK adding multimodal video search (ASR, OCR, visual) and uploads. | Dart | 1,283 |
| [Prismer.AI](https://github.com/Prismer-AI/Prismer) | Research platform with AI-native PDF reading, document parsing and citation tools. | TypeScript | 851 |
| [ECLAIRE](https://github.com/eclaire-labs/eclaire) | Local-first AI assistant with OCR, search, classification and automation features. | TypeScript | 842 |
| [taste-skill](https://github.com/senlindesign/taste-skill) | Claude skill that extracts website design tokens and explains opinionated trade-offs (WHY, not just WHAT). | JavaScript | 302 |
| [Primitive Bench](https://github.com/primitive-bench/primitive-bench) | Vendor-neutral benchmark for AI infrastructure primitives including web search, extraction, crawling and OCR. | Python | 127 |

### Android, mobile UI & emulator automation

Android/iOS device, simulator, emulator, and mobile-interface automation frameworks.

#### Core (4)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [agent-device](https://github.com/callstackincubator/agent-device) | CLI to control iOS and Android devices, enabling AI agents to interact with mobile UIs and automate device actions. | TypeScript | 1,797 |
| [Phone Driver](https://github.com/OminousIndustries/PhoneDriver) | Vision-guided mobile automation agent controlling Android via ADB and VLM. | Python | 1,482 |
| [sim-use](https://github.com/lycorp-jp/sim-use) | CLI enabling agents to observe and interact with iOS Simulator and Android emulators. | Swift | 1,133 |
| [phone-harness](https://github.com/ShawnPana/phone-harness) | Bridge allowing an LLM agent to drive a real iPhone via macOS mirroring using OCR and HID events. | — | 0 |

### Browser testing, visual QA & observability

End-to-end test frameworks, visual-diff utilities, live-browser QA, and browser automation observability.

#### Core (4)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Cypress](https://github.com/cypress-io/cypress) | End-to-end web testing framework for building reliable browser test pipelines (Cypress). | TypeScript | 50,978 |
| [Expect](https://github.com/millionco/expect) | Automated testing skill that runs agent-driven tests in real browsers using Playwright. | TypeScript | 3,372 |
| [testsprite-cli](https://github.com/TestSprite/testsprite-cli) | AI-powered CLI for end-to-end testing of live apps, integrates with Playwright and agents. | TypeScript | 2,731 |
| [blazediff](https://github.com/teimurjan/blazediff) | High-performance image and structural diffing library for visual regression testing across runtimes. | — | 0 |

#### Adjacent (3)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Sunpeak](https://github.com/Sunpeak-AI/sunpeak) | Framework for developing/testing MCP apps with Playwright-based E2E tests, visual regression, and simulators. | TypeScript | 208 |
| [UI-Testing-with-Puppeteer](https://github.com/PacktPublishing/UI-Testing-with-Puppeteer) | Packt repo for UI testing examples using Puppeteer. | HTML | 41 |
| [tokenscout](https://github.com/Atroci/tokenscout) | Tool to audit live websites and extract design tokens and evidence-backed baselines for redesign. | TypeScript | 5 |

### Agentic web workflows, RPA & no-code automation

Agentic browser/computer-use systems, visual web automation, RPA, and no-code automation workflows with direct browser capability.

#### Core (25)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [EasySpider](https://github.com/NaiboWang/EasySpider) | Visual no-code web crawler and browser automation GUI for designing and executing scraping tasks without code. | JavaScript | 44,365 |
| [agent-browser](https://github.com/vercel-labs/agent-browser) | CLI for browser automation tailored to AI agents. | Rust | 40,805 |
| [Skyvern](https://github.com/Skyvern-AI/skyvern) | AI-driven platform to automate browser workflows and RPA with Playwright/Puppeteer/Selenium integrations. | Python | 22,772 |
| [Agent S](https://github.com/simular-ai/Agent-S) | Open agentic framework designed to operate computers like a human for automation. | Python | 12,164 |
| [Bytebot](https://github.com/bytebot-ai/bytebot) | Self-hosted AI desktop agent that automates computer tasks in a containerized Linux desktop. | TypeScript | 11,088 |
| [mcp](https://github.com/browsermcp/mcp) | Model Context Provider server that lets AI applications control browsers. | TypeScript | 6,979 |
| [autoMate](https://github.com/yuruotong1/autoMate) | AI-driven local computer-using agent that automates tasks via natural language. | Python | 3,943 |
| [Open Agent Builder](https://github.com/firecrawl/open-agent-builder) | Visual drag-and-drop workflow builder for AI agents and web scraping pipelines. | TypeScript | 2,605 |
| [agentql](https://github.com/tinyfish-io/agentql) | Tools and a query language to connect AI agents to the web, with Playwright integrations and SDKs. | Python | 1,451 |
| [pywinassistant](https://github.com/a-real-ai/pywinassistant) | LLM-driven agent that controls desktop UIs via natural-language actions. | Python | 1,343 |
| [Surf](https://github.com/e2b-dev/surf) | AI agent that interacts with a virtual desktop via natural-language instructions. | TypeScript | 845 |
| [libretto](https://github.com/saffron-health/libretto) | Browser CLI for coding agents that captures network traffic and reverse-engineers hidden APIs to convert UI click flows into direct API integrations. | TypeScript | 749 |
| [Open ChatGPT Atlas](https://github.com/ComposioHQ/open-chatgpt-atlas) | Browser extension/Electron app that enables AI agents to perform visual browser automation and tool integrations (clicking, typing, Gmail/Slack/GitHub). | TypeScript | 431 |
| [TheAgenticBrowser](https://github.com/TheAgenticAI/TheAgenticBrowser) | Open-source AI agent for web automation and scraping, designed to drive browser-based workflows. | Python | 425 |
| [peerd](https://github.com/NotASithLord/peerd) | In-browser AI agent extension that runs locally, drives tabs, spins up sandboxed compute, and shares artifacts peer-to-peer without a backend. | JavaScript | 371 |
| [Rebrowse](https://github.com/zk1tty/rebrowse-app) | Records user interactions to synthesize deterministic, fast Playwright-executable browser workflows and plans. | TypeScript | 126 |
| [browser-automation-app](https://github.com/code-with-antonio/browser-automation-app) | Next.js SaaS visual platform to design, execute, and debug browser automations with drag-and-drop nodes, replay, and real-time collaboration. | TypeScript | 67 |
| [Rindler](https://github.com/rindler.ai/rindler) | Web automation agent that logs into SaaS sites, fills forms, extracts data, and completes multi-step browser workflows. | — | 0 |
| [Open Computer Use](https://github.com/LLmHub-dev/open-computer-use) | Platform enabling AI agents to autonomously control computers (browser, terminal, desktop) via orchestrated VMs. | — | 0 |
| [Stagehand](https://github.com/browserbase/stagehand) | AI web browsing framework emphasizing simplicity and extensibility for agent-driven browsing and automation. | TypeScript | 23,966 |
| [UI-TARS](https://github.com/bytedance/UI-TARS) | Automated GUI interaction system leveraging native agents to drive application UIs and automated interactions. | Python | 11,348 |
| [self-operating-computer](https://github.com/OthersideAI/self-operating-computer) | Framework enabling multimodal models to operate a computer and perform tasks automatically. | Python | 10,285 |
| [Magentic-UI](https://github.com/microsoft/magentic-ui) | Experimental agent that operates across the browser and the local file system. | Python | 10,064 |
| [Auto-Commenter](https://github.com/rokpiy/auto-commenter) | Marketing automation framework using Claude and Playwright to generate personalized comments and automate batch posting across platforms. | — | 555 |
| [Agent Mode by Receiptor AI](https://github.com/receiptor.ai/agent-mode-by-receiptor-ai) | Autonomous agent mode that converts receipts/invoices into structured data and runs finance workflows. | — | 0 |

#### Adjacent (28)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [servers](https://github.com/modelcontextprotocol/servers) | Reference MCP server implementations enabling agents to access tools (fetch, filesystem, browser). | TypeScript | 89,128 |
| [OmniParser](https://github.com/microsoft/OmniParser) | Screen-parsing tool aimed at vision-based GUI agents (OmniParser). | Jupyter Notebook | 25,273 |
| [OWL](https://github.com/camel-ai/owl) | Multi-agent system for automating real-world tasks and web interactions (OWL). | Python | 20,080 |
| [Astron Agent](https://github.com/iflytek/astron-agent) | Enterprise platform for building SuperAgents and RPA-enabled AI workflows at scale. | Java | 9,438 |
| [dev-browser](https://github.com/SawyerHood/dev-browser) | A Claude Skill to enable an agent to use a web browser. | TypeScript | 6,550 |
| [sandbox](https://github.com/agent-infra/sandbox) | All-in-one Docker sandbox bundling browser, shell, MCP, and VSCode for AI agents. | Python | 5,734 |
| [eko](https://github.com/FellouAI/eko) | Framework for building production-ready agentic workflows with natural language. | TypeScript | 4,951 |
| [Fara-7B](https://github.com/microsoft/fara) | Compact 7B agentic model trained to operate computer UIs and perform multi-step web automation via screen actions. | Python | 4,935 |
| [skales](https://github.com/skalesapp/skales) | Local AI desktop agent to automate email, calendar, browser and other tasks across Windows/macOS/Linux. | TypeScript | 1,668 |
| [The TinyFish Cookbook](https://github.com/tinyfish-io/tinyfish-cookbook) | Collection of TinyFish recipes demonstrating web agents that automate tasks and extract data from sites. | TypeScript | 1,628 |
| [ScaleCUA](https://github.com/OpenGVLab/ScaleCUA) | Dataset and models to scale computer-use agents for GUI-centric automation. | Python | 1,104 |
| [Taskosaur](https://github.com/Taskosaur/Taskosaur) | Project management platform with conversational AI that can perform in-app browser automation to execute complex tasks. | TypeScript | 459 |
| [marketing-studio](https://github.com/ucsandman/marketing-studio) | Agent-driven pipeline that automates marketing asset production using Playwright, headless Blender, and render tooling. | JavaScript | 202 |
| [deep-research](https://github.com/dzhng/deep-research) | Open-source implementation of a 'Deep Research' autonomous agent framework. | TypeScript | 19,563 |
| [OpenSandbox](https://github.com/alibaba/OpenSandbox) | Secure, extensible sandbox platform for running AI agents and complex workloads with isolated runtimes (Docker, gVisor, Firecracker). | Python | 10,081 |
| [gptme](https://github.com/gptme/gptme) | Terminal-based autonomous agent with local tools: code writing, terminal control, web browsing and vision. | Python | 4,390 |
| [OSWorld](https://github.com/xlang-ai/OSWorld) | Benchmarking suite for multimodal agents executing open-ended tasks in real computer environments. | Python | 3,090 |
| [n-skills](https://github.com/numman-ali/n-skills) | Plugin marketplace of reusable skills for AI coding agents, including browser skills. | TypeScript | 974 |
| [claude-code-sub-agent-collective](https://github.com/vanzan01/claude-code-sub-agent-collective) | Research-oriented multi-agent framework coordinating Claude Code sub-agents with Playwright integration for coordinated web tasks. | JavaScript | 523 |
| [posterskill](https://github.com/ethanweber/posterskill) | Interactive HTML editor that extracts Overleaf content and uses Playwright and Claude to auto-layout posters and produce high-resolution PDFs. | HTML | 478 |
| [Agent Sandbox Skill](https://github.com/disler/agent-sandbox-skill) | Skill for isolated agent execution environments with built-in Playwright browser automation and persistent agent context. | Python | 362 |
| [Jarvis AI Agent](https://github.com/Xthebuilder/JRVS) | Local-first AI agent framework with RAG, web scraping, and tool-calling for autonomous workflows. | Python | 236 |
| [SmallClaw](https://github.com/XposeMarket/SmallClaw) | Local-first AI agent framework with tools including Playwright browser automation and file/terminal access. | TypeScript | 234 |
| [dex](https://github.com/dcramer/dex) | Persistent memory and task-tracking system to coordinate multi-session AI agent workflows. | TypeScript | 228 |
| [OpenGuider](https://github.com/mo-tunn/OpenGuider) | Desktop AI companion that observes the screen and listens to voice to guide user steps with actionable instructions. | JavaScript | 160 |
| [GeminiCLI_ComputerUse_Extension](https://github.com/automateyournetwork/GeminiCLI_ComputerUse_Extension) | Gemini-CLI extension to enable Gemini 'Computer Use' from the command line. | Python | 89 |
| [Omniwork](https://github.com/omniwork.ai/omniwork) | Agent operating system coordinating autonomous desktop agents and tool integrations for creative work. | — | 0 |
| [browser-use-webui](https://github.com/warmshao/browser-use-webui) | Web UI to run AI agents inside the browser for interactive agent workflows. | — | 0 |

## Use Notes

This is a discovery and categorization resource, not a security, legal, policy, maintenance, or compatibility assessment. Before adopting any project, review its current documentation, supported browsers or devices, release activity, license, privacy/data-handling practices, and operating constraints. In particular, data extraction should be scoped to authorized data sources and operations. [1]

*Stars are the counts recorded in the attached dataset, not live GitHub values.*

## References

[1]: repo_showcase_merged.json (user-supplied repository dataset, analyzed August 18, 2026)
