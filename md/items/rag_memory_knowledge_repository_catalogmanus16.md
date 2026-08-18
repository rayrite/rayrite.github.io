# RAG, Context Memory & Knowledge Systems Repository Catalog

> **Scope.** This catalog is curated exclusively from the supplied `repo_showcase_merged.json` repository dataset. It covers document parsing and conversion, retrieval-augmented generation, GraphRAG and knowledge graphs, vector databases, LLM/agent context and memory, token optimization, knowledge bases, and related evaluation/observability tools. Repository metadata and star counts are source snapshots rather than live assessments. [1]

## How This Catalog Was Curated

The source dataset contains **6,327 unique repositories**. A high-recall metadata pass identified 562 potential matches, followed by semantic review and a final relevance audit. The catalog retains **316 Core repositories** with a direct role in the knowledge-retrieval lifecycle and **96 Adjacent repositories** that support it, for **412 entries** after applying final scope and privacy exclusions. [1]

| Tier | Definition | Repositories |
| --- | --- | ---: |
| **Core** | Direct capability for ingesting, converting, indexing, retrieving, graphing, remembering, optimizing context, managing knowledge, or evaluating RAG systems. | 316 |
| **Adjacent** | A clear supporting role in the RAG and knowledge-management lifecycle without being a dedicated retrieval technology. | 96 |

## Retrieval Lifecycle Coverage

| Category | Core | Adjacent | Total | Primary value |
| --- | ---: | ---: | ---: | --- |
| Document parsing, OCR & content extraction | 61 | 5 | 66 | Tools for extracting text, layout, tables, images, and structured content from PDFs, office files, scans, webpages, and multimodal documents. |
| Data conversion, ETL & normalization | 7 | 7 | 14 | Converters and ingestion pipelines that normalize files, web content, and raw data into retrieval-ready formats such as Markdown, JSON, and structured records. |
| RAG frameworks, retrieval pipelines & search | 84 | 57 | 141 | RAG engines, document-Q&A systems, semantic/hybrid search, retrieval orchestration, and end-user knowledge-retrieval platforms. |
| GraphRAG, knowledge graphs & graph databases | 29 | 5 | 34 | Graph-native systems for entity relationships, graph databases, knowledge-graph construction, and graph-assisted retrieval. |
| Vector databases, embedding stores & indexing | 12 | 0 | 12 | Production vector stores, embedding indexes, ANN implementations, vector-search extensions, and hybrid retrieval infrastructure. |
| Context, memory & session management | 56 | 10 | 66 | Systems that capture, compress, retrieve, persist, and inject contextual information or long-term memory for LLMs and agents. |
| Tokenization, context compression & token optimization | 10 | 2 | 12 | Tokenizer libraries, token-cost/budget tools, chunking evaluation, prompt/context compression, cache strategies, and context engineering. |
| Knowledge bases, documentation & research systems | 51 | 8 | 59 | Knowledge management, team documentation, personal knowledge bases, research workspaces, codebase wikis, and searchable source repositories. |
| RAG evaluation, observability & agent data workflows | 6 | 2 | 8 | RAG test/evaluation systems, LLM/RAG tracing, prompt management, cost analysis, benchmarks, and quality observability. |

## Featured Starting Points

This table provides a practical entry point rather than a ranking. The full categorized inventory below remains the authoritative catalog. [1]

| Workflow | Recommended starting points | Representative role |
| --- | --- | --- |
| **Document parsing, OCR & content extraction** | [docling](https://github.com/docling-project/docling); [MinerU](https://github.com/opendatalab/MinerU); [marker](https://github.com/datalab-to/marker); [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR); [OpenDataLoader PDF](https://github.com/opendataloader-project/opendataloader-pdf); [paperless-ngx](https://github.com/paperless-ngx/paperless-ngx) | Document parser and converter to prepare documents for generative AI.; Open-source tool for high-quality data extraction from PDFs, webpages, and ebooks. |
| **Data conversion, ETL & normalization** | [markitdown](https://github.com/microsoft/markitdown); [anydoc](https://github.com/firecrawl/anydoc); [Skill Seeker](https://github.com/yusufkaraaslan/Skill_Seekers); [unstract](https://github.com/Zipstack/unstract); [crawl4ai](https://github.com/unclecode/crawl4ai); [Lightfeed Extractor](https://github.com/lightfeed/extractor) | Python tool to convert Office files and other documents into Markdown.; Rust library to convert many office formats into consistent GitHub-Flavored Markdown for LLM ingestion. |
| **RAG frameworks, retrieval pipelines & search** | [ragflow](https://github.com/infiniflow/ragflow); [dify](https://github.com/langgenius/dify); [private-gpt](https://github.com/zylon-ai/private-gpt); [quivr](https://github.com/QuivrHQ/quivr); [LightRAG](https://github.com/HKUDS/LightRAG); [Onyx](https://github.com/onyx-dot-app/onyx); [typesense](https://github.com/typesense/typesense) | Open-source RAG engine focused on deep document understanding for retrieval-augmented generation.; Open-source LLM app platform combining RAG pipelines, agent workflows, model management, and observability. |
| **GraphRAG, knowledge graphs & graph databases** | [graphrag](https://github.com/microsoft/graphrag); [Graphiti](https://github.com/getzep/graphiti); [GitNexus](https://github.com/abhigyanpatwari/GitNexus); [graphify](https://github.com/Graphify-Labs/graphify); [codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp); [rowboat](https://github.com/rowboatlabs/rowboat) | Modular graph-based Retrieval-Augmented Generation (GraphRAG) system.; Build real-time knowledge graphs for AI agents. |
| **Vector databases, embedding stores & indexing** | [Milvus](https://github.com/milvus-io/milvus); [qdrant](https://github.com/qdrant/qdrant); [pgvector](https://github.com/pgvector/pgvector); [lancedb](https://github.com/lancedb/lancedb); [sqlite-vec](https://github.com/asg017/sqlite-vec); [Elasticsearch](https://github.com/elastic/elasticsearch) | High-performance, cloud-native vector database for scalable ANN search (Milvus).; High-performance, large-scale vector database and search engine (Qdrant). |
| **Context, memory & session management** | [mem0](https://github.com/mem0ai/mem0); [Cognee](https://github.com/topoteretes/cognee); [OpenViking](https://github.com/volcengine/OpenViking); [Memvid](https://github.com/memvid/memvid); [Mastra](https://github.com/mastra-ai/mastra); [claude-mem](https://github.com/thedotmack/claude-mem) | Memory layer for personalized AI handling long-term memory and state management.; Knowledge engine combining vector search and graph DBs to build personalized, dynamic agent memory. |
| **Tokenization, context compression & token optimization** | [Gigatoken](https://github.com/marcelroed/gigatoken); [tokencost](https://github.com/AgentOps-AI/tokencost); [token-optimizer-mcp](https://github.com/ooples/token-optimizer-mcp); [rag-chunk](https://github.com/messkan/rag-chunk); [Entroly](https://github.com/juyterman1000/entroly); [headroom](https://github.com/chopratejas/headroom) | High-performance Rust tokenizer offering massive throughput and compatibility with common tokenizers.; Provides token price/cost estimates across 400+ LLMs. |
| **Knowledge bases, documentation & research systems** | [khoj](https://github.com/khoj-ai/khoj); [Open Notebook](https://github.com/lfnovo/open-notebook); [outline](https://github.com/outline/outline); [AFFiNE](https://github.com/toeverything/AFFiNE); [DeepWiki-Open](https://github.com/AsyncFuncAI/deepwiki-open); [OpenWiki](https://github.com/langchain-ai/openwiki) | Self-hosted AI second brain providing answers from notes and external sources.; AI-native workspace for notes and knowledge with multimodal sources and private vector search. |
| **RAG evaluation, observability & agent data workflows** | [langfuse](https://github.com/langfuse/langfuse); [Promptfoo](https://github.com/promptfoo/promptfoo); [helicone](https://github.com/Helicone/helicone); [agentops](https://github.com/AgentOps-AI/agentops); [Primitive Bench](https://github.com/primitive-bench/primitive-bench); [frugon](https://github.com/Rodiun/frugon) | Observability and analytics platform for LLM apps providing tracing, evaluation, prompt management, and datasets.; Tool to test and evaluate prompts, agents, and RAG systems with CI integration. |

## Complete Categorized Catalog

Within every category, **Core** repositories are shown before **Adjacent** repositories. Entries are ordered by review confidence and then by the source star snapshot. [1]

### Document parsing, OCR & content extraction

Tools for extracting text, layout, tables, images, and structured content from PDFs, office files, scans, webpages, and multimodal documents.

#### Core (61)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Stirling PDF](https://github.com/Stirling-Tools/Stirling-PDF) | Locally hosted web app for PDF operations: convert, edit, merge, and OCR. | Java | 89,705 |
| [PaddleOCR](https://github.com/PaddlePaddle/PaddleOCR) | Multilingual OCR toolkit (PaddleOCR) with PDF extraction and structure support. | Python | 87,808 |
| [MinerU](https://github.com/opendatalab/MinerU) | Open-source tool for high-quality data extraction from PDFs, webpages, and ebooks. | Python | 77,834 |
| [docling](https://github.com/docling-project/docling) | Document parser and converter to prepare documents for generative AI. | Python | 64,950 |
| [paperless-ngx](https://github.com/paperless-ngx/paperless-ngx) | Document management system that converts scanned documents into searchable OCR archives. | Python | 43,796 |
| [marker](https://github.com/datalab-to/marker) | Fast converter that transforms PDFs into Markdown and JSON. | Python | 38,811 |
| [OpenDataLoader PDF](https://github.com/opendataloader-project/opendataloader-pdf) | PDF parser focused on producing AI-ready, accessible outputs (OCR, extraction, tagged PDF support). | Java | 26,044 |
| [Karakeep](https://github.com/karakeep-app/karakeep) | Self-hosted bookmark and content manager with OCR, full-text search, tagging, summarization. | TypeScript | 24,723 |
| [DeepSeek-OCR](https://github.com/deepseek-ai/DeepSeek-OCR) | Research toolkit for visual-text compression and OCR-style processing of images/PDFs. | Python | 22,847 |
| [Unlimited-OCR](https://github.com/baidu/Unlimited-OCR) | Baidu open-source OCR for one-shot, long-horizon OCR on images and multi-page PDFs. | Python | 21,130 |
| [Qwen3-VL](https://github.com/QwenLM/Qwen3-VL) | Vision-language model with extended context and multi-language OCR support. | Jupyter Notebook | 18,990 |
| [pdf-inspector](https://github.com/firecrawl/pdf-inspector) | Fast Rust PDF classifier and position-aware text extractor with Markdown output. | Rust | 15,976 |
| [unstructured](https://github.com/Unstructured-IO/unstructured) | Libraries/APIs to build custom preprocessing and document parsing pipelines. | HTML | 15,319 |
| [BentoPDF](https://github.com/alam00000/bentopdf) | Client-side, privacy-first PDF toolkit with editing, conversion, OCR, and form support. | JavaScript | 12,759 |
| [LiteParse](https://github.com/run-llama/liteparse) | Fast open-source document parser for PDFs and OCR (LiteParse). | Rust | 12,112 |
| [reader](https://github.com/jina-ai/reader) | Converts URLs to LLM-friendly inputs via a simple r.jina.ai proxy | TypeScript | 11,876 |
| [PDF-Extract-Kit](https://github.com/opendatalab/PDF-Extract-Kit) | Toolkit for high-quality PDF content extraction. | Python | 9,964 |
| [Chandra](https://github.com/datalab-to/chandra) | State-of-the-art OCR converting images/PDFs into structured HTML/Markdown/JSON with layout preservation. | Python | 9,117 |
| [Dolphin](https://github.com/bytedance/Dolphin) | Universal document parsing model for images and digital docs with layout analysis. | Python | 8,899 |
| [omniparse](https://github.com/adithya-s-k/omniparse) | Ingests and parses documents and multimedia for GenAI compatibility. | Python | 7,811 |
| [GLM-OCR](https://github.com/zai-org/GLM-OCR) | Multimodal OCR with layout analysis for tables, formulas, and complex documents. | Python | 5,983 |
| [deepseek-ocr.rs](https://github.com/TimmyOVO/deepseek-ocr.rs) | Rust multi-backend OCR and VLM engine with CLI and OpenAI-compatible HTTP server. | Rust | 2,161 |
| [semtools](https://github.com/run-llama/semtools) | CLI tools for semantic search and document parsing, including embedding support. | Rust | 1,846 |
| [deepseek_ocr_app](https://github.com/rdumasia303/deepseek_ocr_app) | Web app for OCR and PDF processing; preserves layout, formulas; exports Markdown/HTML/DOCX/JSON. | JavaScript | 1,735 |
| [HunyuanOCR](https://github.com/Tencent-Hunyuan/HunyuanOCR) | End-to-end OCR vision-language model for multilingual document parsing and IE. | Python | 1,603 |
| [Better Shot](https://github.com/KartikLabhshetwar/better-shot) | macOS screenshot manager with built-in OCR using Vision framework to extract text locally. | TypeScript | 1,586 |
| [vmodal_sdk_flutter](https://github.com/v-modal/vmodal_sdk_flutter) | Flutter SDK offering multimodal video search using ASR, OCR and visual similarity. | Dart | 1,283 |
| [DeekSeek-OCR---Dockerized-API](https://github.com/Bogdanovich77/DeekSeek-OCR---Dockerized-API) | Dockerized OCR API to convert PDFs into structured Markdown with batch and REST API options. | Python | 1,089 |
| [filewizard](https://github.com/LoredCast/filewizard) | Web UI for file conversion, OCR, transcription and TTS. | Python | 978 |
| [lift](https://github.com/datalab-to/lift) | Vision model that extracts schema-constrained JSON from PDFs/images for structured document data. | Python | 882 |
| [mdream](https://github.com/harlan-zw/mdream) | High-speed HTML→Markdown converter optimized for LLMs, offering streaming and token-efficient output. | TypeScript | 867 |
| [Prismer.AI](https://github.com/Prismer-AI/Prismer) | Research platform with AI-native PDF reading, document parsing and citation graphs. | TypeScript | 851 |
| [textra](https://github.com/freedmand/textra) | CLI to convert images, PDFs and audio to text using Apple's APIs. | Swift | 755 |
| [DeepSeek-OCR Studio](https://github.com/fufankeji/DeepSeek-OCR-Web) | Multimodal OCR studio with layout analysis, table parsing, multilingual OCR, and structured Markdown output. | TypeScript | 548 |
| [papermerge-core](https://github.com/papermerge/papermerge-core) | Papermerge DMS core backend with OCR support for scanned documents and PDFs. | Python | 505 |
| [mac-ocr](https://github.com/privatenumber/mac-ocr) | macOS CLI using Apple's Vision framework to OCR and create searchable PDFs. | Swift | 438 |
| [SmartResume](https://github.com/alibaba/SmartResume) | Layout-aware resume parser combining OCR, layout detection, and LLM extraction to structured fields. | Python | 354 |
| [Parsel](https://github.com/shipfastlabs/parsel) | Fast, open-source PHP document parser for PDF/OCR/text extraction. | PHP | 326 |
| [SmolDocling-OCR-App](https://github.com/AIAnytime/SmolDocling-OCR-App) | OCR application built on the SmolDocling model for document image text extraction. | Python | 261 |
| [Watch Skill](https://github.com/oxbshw/watch-skill) | Local-first video intelligence: timestamped transcription, on-screen OCR, scene-aware frame extraction, and searchable evidence for agents. | Python | 247 |
| [MinerU-HTML](https://github.com/opendatalab/MinerU-HTML) | HTML-to-text extraction pipeline using small LMs to isolate main content and output formats. | Python | 235 |
| [Clipboard to Markdown](https://github.com/AnswerDotAI/clipmd) | Chrome extension that converts selected web HTML elements to Markdown and can capture PNG screenshots. | JavaScript | 220 |
| [mdflux](https://github.com/ibrahimqureshae/mdflux) | Local-first desktop app converting many document formats into structured Markdown with built-in OCR and token-efficient output. | Svelte | 190 |
| [FinePDFs](https://github.com/huggingface/finepdfs) | End-to-end pipelines to process the FinePDFs dataset: OCR, layout extraction, dedupe, and classification. | Python | 181 |
| [textsnap](https://github.com/kouhxp/textsnap) | Screenshot/image-to-plaintext OCR tool that runs locally without cloud/GPU. | Python | 159 |
| [grimoire](https://github.com/hunter-read/grimoire) | Self‑hosted app organizing TTRPG PDFs with full‑text search and optional Tesseract OCR. | JavaScript | 138 |
| [Mistral-OCR-App](https://github.com/AIAnytime/Mistral-OCR-App) | Streamlit app using Mistral OCR API to perform optical character recognition. | Python | 94 |
| [parsevision](https://github.com/orasik/parsevision) | Tool to visualize and debug OCR parsing results inside PDF documents. | Python | 84 |
| [ComPDF Self-Hosted](https://github.com/ComPDF/compdf-self-hosted) | Docker-based self-hosted PDF/document conversion and editing center with OCR and multi-format conversions. | TypeScript | 80 |
| [YOLOv8-License-Plate-Insights](https://github.com/yihong1120/YOLOv8-License-Plate-Insights) | YOLOv8-based license plate recognition with OCR and Vision AI integration. | Jupyter Notebook | 14 |
| [cubby-clipboard](https://github.com/tsouth89/cubby-clipboard) | Windows clipboard manager with local OCR so screenshots become searchable. | Rust | 8 |
| [Ocrbase](https://github.com/ocrbase-hq/ocrbase) | Model-agnostic API to parse PDFs and images into structured JSON/Markdown using OCR and vision language models. | TypeScript | 7 |
| [LightCrawl](https://github.com/yosuke1024/LightCrawl) | Self-hosted web scraper and MCP server converting pages to clean Markdown for LLM pipelines. | HTML | 3 |
| [Crawl4AI](https://github.com/InsightEdge01/Crawl4AI) | Web crawler focused on extracting clean, structured content for LLMs and RAG ingestion. | Python | 2 |
| [surya](https://github.com/VikParuchuri/surya) | OCR toolkit offering layout analysis, reading order and line detection across 90+ languages. | — | 0 |
| [marker](https://github.com/VikParuchuri/marker) | Tool to convert PDFs into Markdown quickly and with high accuracy. | — | 0 |
| [doc7](https://github.com/magicrew/doc7) | CLI tool that converts PDFs, Office files and scans into AI-ready Markdown via multimodal models. | — | 0 |
| [DeepOCR](https://github.com/pkulium/DeepOCR) | Reimplementation of Deepseek-OCR with a DeepEncoder for vision-text compression and a full OCR training pipeline. | — | 0 |
| [book-to-skill](https://github.com/Leutenegger/book-to-skill) | CLI that converts books and docs (PDF/EPUB/DOCX) into structured, token-efficient agent skills. | — | 0 |
| [DeepSeek-OCR-2](https://github.com/deepseek-ai/DeepSeek-OCR-2) | OCR / document-processing project (DeepSeek-OCR related) indicated by keywords for document processing. | Python | 3,333 |
| [mach](https://github.com/octalide/mach) | Tools for extracting clean markdown and tables from complex PDFs for RAG use. | Shell | 120 |

#### Adjacent (5)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [crawlee-python](https://github.com/apify/crawlee-python) | Python web scraping and browser automation to extract HTML, PDFs, and images | Python | 9,438 |
| [Paper2Slides](https://github.com/HKUDS/Paper2Slides) | Agentic tool converting research papers and documents into presentation slides using RAG for source-linked extraction. | Python | 3,313 |
| [Nano PDF Editor](https://github.com/gavrielc/Nano-PDF) | CLI for natural-language PDF editing that uses OCR re-hydration to preserve searchable text layers. | Python | 1,248 |
| [liteparse_samples](https://github.com/jerryjliu/liteparse_samples) | Interactive samples/demos for LiteParse, a fast local, model-free document parser. | HTML | 519 |
| [Podcast](https://github.com/artnoage/Podcast) | Converts academic PDFs via OCR, summarizes and generates scripted audio podcasts. | Python | 260 |

### Data conversion, ETL & normalization

Converters and ingestion pipelines that normalize files, web content, and raw data into retrieval-ready formats such as Markdown, JSON, and structured records.

#### Core (7)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [markitdown](https://github.com/microsoft/markitdown) | Python tool to convert Office files and other documents into Markdown. | Python | 159,935 |
| [crawl4ai](https://github.com/unclecode/crawl4ai) | Open-source, LLM-friendly web crawler and scraper for extracting web content for AI use. | Python | 78,513 |
| [anydoc](https://github.com/firecrawl/anydoc) | Rust library to convert many office formats into consistent GitHub-Flavored Markdown for LLM ingestion. | Rust | 16,697 |
| [Skill Seeker](https://github.com/yusufkaraaslan/Skill_Seekers) | Transforms docs (websites, GitHub, PDFs) into structured knowledge assets for AI and RAG. | Python | 12,885 |
| [MD-This-Page](https://github.com/Ademking/MD-This-Page) | Browser extension to convert any web page to clean, readable Markdown with one click. | TypeScript | 1,382 |
| [Lightfeed Extractor](https://github.com/lightfeed/extractor) | Playwright-based extractor with schema validation and recovery logic for resilient web-to-structured ETL. | TypeScript | 318 |
| [unstract](https://github.com/Zipstack/unstract) | No-code LLM platform to launch APIs and ETL pipelines that structure unstructured documents. | Python | 7,144 |

#### Adjacent (7)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [crawlee](https://github.com/apify/crawlee) | Web scraping and browser automation library to extract HTML, files, and data for downstream AI/RAG pipelines. | TypeScript | 25,419 |
| [seatunnel](https://github.com/apache/seatunnel) | High-performance distributed data integration (ETL/ELT) tool for large-scale pipelines. | Java | 9,560 |
| [ferret](https://github.com/MontFerret/ferret) | Declarative web scraping library for extracting and structuring web data. | Go | 6,008 |
| [TinyETL](https://github.com/alrpal/TinyETL) | Zero-configuration Rust ETL tool for transforming and moving diverse data formats and databases. | Rust | 294 |
| [EasySpider](https://github.com/NaiboWang/EasySpider) | Visual no-code web crawler for automated web data collection and extraction. | JavaScript | 44,365 |
| [Edit Banana](https://github.com/BIT-DataLab/Edit-Banana) | Framework for converting statistical formats into editable, structured formats. | Python | 5,460 |
| [Open Agent Builder](https://github.com/firecrawl/open-agent-builder) | Visual workflow builder for AI agents, enabling drag-and-drop web scraping pipelines. | TypeScript | 2,605 |

### RAG frameworks, retrieval pipelines & search

RAG engines, document-Q&A systems, semantic/hybrid search, retrieval orchestration, and end-user knowledge-retrieval platforms.

#### Core (84)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [dify](https://github.com/langgenius/dify) | Open-source LLM app platform combining RAG pipelines, agent workflows, model management, and observability. | TypeScript | 152,721 |
| [ragflow](https://github.com/infiniflow/ragflow) | Open-source RAG engine focused on deep document understanding for retrieval-augmented generation. | Go | 88,680 |
| [private-gpt](https://github.com/zylon-ai/private-gpt) | Private on‑prem tool to interact with documents using GPT-style document Q&A. | Python | 57,446 |
| [quivr](https://github.com/QuivrHQ/quivr) | Opinionated RAG framework to integrate GenAI into apps supporting any LLM and any vector store (PGVector, Faiss). | Python | 39,402 |
| [LightRAG](https://github.com/HKUDS/LightRAG) | Lightweight, simple and fast Retrieval-Augmented Generation implementation. | Python | 38,932 |
| [PageIndex](https://github.com/VectifyAI/PageIndex) | Document index for vectorless, reasoning-based RAG (PageIndex). | Python | 35,222 |
| [storm](https://github.com/stanford-oval/storm) | LLM-powered knowledge curation system that researches and generates reports with citations. | Python | 31,043 |
| [Onyx](https://github.com/onyx-dot-app/onyx) | Self-hosted AI workspace to search, chat, and organize internal knowledge with vector search. | Python | 30,576 |
| [typesense](https://github.com/typesense/typesense) | Fast open-source typo-tolerant search engine with full-text and vector search for semantic retrieval. | C++ | 26,442 |
| [haystack](https://github.com/deepset-ai/haystack) | LLM orchestration framework to build production-ready RAG, QA and semantic search apps. | Python | 26,234 |
| [kotaemon](https://github.com/Cinnamon/kotaemon) | Open-source RAG-based tool for conversational chat over your documents. | Python | 25,699 |
| [vanna](https://github.com/vanna-ai/vanna) | Chat with SQL DBs using LLMs and RAG for accurate text-to-SQL generation. | Python | 23,826 |
| [pandas-ai](https://github.com/Sinaptik-AI/pandas-ai) | Conversational data analysis across SQL, CSV, pandas, MongoDB using LLMs and RAG. | Python | 23,747 |
| [RAG-Anything](https://github.com/HKUDS/RAG-Anything) | All-in-one multi-modal RAG framework for retrieval-augmented generation. | Python | 22,954 |
| [localGPT](https://github.com/PromtEngineer/localGPT) | Local document chat enabling private RAG-style interactions with on-device models and docs. | Python | 22,207 |
| [Tolaria](https://github.com/refactoringhq/tolaria) | Platform providing primitives to organize documents, index content, and orchestrate retrieval-augmented agents. | TypeScript | 19,205 |
| [WrenAI](https://github.com/Canner/WrenAI) | Tools to make databases RAG-ready and implement more accurate Text-to-SQL. | TypeScript | 17,293 |
| [WeKnora](https://github.com/Tencent/WeKnora) | Go framework for document understanding, semantic retrieval and RAG-based QA. | Go | 13,914 |
| [Open Deep Research](https://github.com/langchain-ai/open_deep_research) | Open research agent orchestrating web search, summarization, and report synthesis using RAG. | Python | 12,631 |
| [NoteGen](https://github.com/codexu/note-gen) | Cross-platform Markdown note app using RAG and LLMs to automatically structure fragmented knowledge. | TypeScript | 11,274 |
| [CocoIndex](https://github.com/cocoindex-io/cocoindex) | Incremental indexing engine for long-horizon agents and semantic search | Rust | 10,517 |
| [blinko](https://github.com/blinkospace/blinko) | Self-hosted personal AI note app using RAG and vector search for private natural-language retrieval. | TypeScript | 10,085 |
| [Local Deep Researcher](https://github.com/langchain-ai/local-deep-researcher) | Local web research and report-writing assistant for offline research workflows. | Python | 9,303 |
| [Local Deep Research](https://github.com/LearningCircuit/local-deep-research) | Local research RAG pipeline searching arXiv, PubMed, web and private docs with local/cloud LLM support. | Python | 8,934 |
| [Verba](https://github.com/weaviate/verba) | Retrieval-augmented chatbot implementation powered by Weaviate vector search. | Python | 7,711 |
| [Call Center AI](https://github.com/microsoft/call-center-ai) | Azure-based call center solution that uses RAG for customer-specific data | Python | 6,441 |
| [Airweave](https://github.com/airweave-ai/airweave) | Context retrieval layer that syncs, indexes, and exposes data for RAG systems | Python | 6,244 |
| [UltraRAG](https://github.com/OpenBMB/UltraRAG) | Low-code RAG framework using MCP architecture for retrievers and generators | Python | 5,501 |
| [llm-answer-engine](https://github.com/developersdigest/llm-answer-engine) | Perplexity-inspired answer engine using LLMs, LangChain and search stacks. | TypeScript | 5,038 |
| [ragapp](https://github.com/ragapp/ragapp) | Enterprise-focused Agentic RAG tooling to enable retrieval-augmented workflows. | TypeScript | 4,443 |
| [sentrysearch](https://github.com/ssrajadh/sentrysearch) | Semantic search over videos using Gemini Embedding 2 for embedding-based retrieval. | Python | 4,423 |
| [cognita](https://github.com/truefoundry/cognita) | Modular open-source RAG framework for building production applications. | Python | 4,415 |
| [OpenRAG](https://github.com/langflow-ai/openrag) | Single-package RAG platform for document ingestion, semantic search, and LLM-backed chat workflows. | Python | 3,877 |
| [cohere-toolkit](https://github.com/cohere-ai/cohere-toolkit) | Collection of prebuilt components to quickly build and deploy RAG applications. | TypeScript | 3,178 |
| [openrecall](https://github.com/openrecall/openrecall) | Open-source, privacy-first system for accessing and semantically searching digital history. | Python | 2,928 |
| [PIKE-RAG](https://github.com/microsoft/PIKE-RAG) | Microsoft project for specialized knowledge and rationale-augmented generation (PIKE-RAG). | Python | 2,480 |
| [mcp-crawl4ai-rag](https://github.com/coleam00/mcp-crawl4ai-rag) | Web crawling plus RAG capabilities for AI agents and coding assistants. | Python | 2,239 |
| [Grepai](https://github.com/yoanbernabeu/grepai) | Local semantic search and call-graph tool for AI agents using embeddings and vector search. | C | 1,816 |
| [Context+](https://github.com/ForLoopCodes/contextplus) | MCP server that converts large codebases into searchable semantic feature graphs for deep code navigation. | TypeScript | 1,769 |
| [sitefetch](https://github.com/egoist/sitefetch) | Crawls an entire site and saves it as text for use with AI models. | TypeScript | 1,736 |
| [pg-aiguide](https://github.com/timescale/pg-aiguide) | PostgreSQL-focused semantic knowledge provider and MCP server for AI coding assistants. | Python | 1,690 |
| [dsRAG](https://github.com/D-Star-AI/dsRAG) | High-performance retrieval engine for unstructured data. | Python | 1,589 |
| [easy-local-rag](https://github.com/AllAboutAI-YT/easy-local-rag) | Very simple local RAG setup using Ollama for fully local retrieval augmentation. | Python | 1,220 |
| [osgrep](https://github.com/Ryandonofrio3/osgrep) | Local semantic search for codebases using embeddings, call-graph tracing, and plugin integrations. | TypeScript | 1,130 |
| [Foxel](https://github.com/DrizzleTime/Foxel) | Private cloud storage with AI-powered semantic search and pluggable adapters for multiple backends. | Python | 1,016 |
| [rag_api](https://github.com/danny-avila/rag_api) | FastAPI-based RAG integration example using LangChain and PostgreSQL/pgvector. | Python | 885 |
| [agentic-file-search](https://github.com/PromtEngineer/agentic-file-search) | Agentic file search that dynamically scans and extracts documents instead of precomputed embeddings. | Python | 728 |
| [langchain-ask-pdf](https://github.com/alejandro-ao/langchain-ask-pdf) | PDF Q&A app: upload a PDF and ask questions using LLMs. | Python | 635 |
| [restai](https://github.com/apocas/restai) | AIaaS platform built on LlamaIndex/LangChain for RAG retrieval and embeddings. | Python | 512 |
| [Antfly](https://github.com/antflydb/antfly) | Distributed multimodal search engine combining BM25, vector similarity, graph traversal, and built-in RAG agents. | Go | 334 |
| [DataChad](https://github.com/gustavz/datachad) | LangChain-based toolkit to ask questions across arbitrary data sources. | Python | 321 |
| [LangChain](https://github.com/langchain-ai/langchain-aws) | AWS integrations for LangChain/LangGraph enabling RAG pipelines, vector stores, graphs, and memory services. | Python | 317 |
| [NanoSage](https://github.com/masterFoad/NanoSage) | Local LLM-powered recursive search and knowledge explorer for smart search workflows. | Python | 266 |
| [youtu-rag](https://github.com/TencentCloudADP/youtu-rag) | Agentic RAG system for local knowledge management with adaptive retrieval and memory. | Python | 255 |
| [LocalRAG](https://github.com/2dogsandanerd/Knowledge-Base-Self-Hosting-Kit) | Self-hosted RAG memory kit with ChromaDB/Docling, hybrid chunking, FastAPI CRUD and agent-ready semantic search. | Python | 239 |
| [ClawMem](https://github.com/yoloshii/ClawMem) | Local memory context engine for Claude Code/OpenClaw that runs hybrid RAG retrieval, including GPU support. | TypeScript | 188 |
| [Amber](https://github.com/offchainthoughts/Amber) | Self-certifying portable embedding archive (.amber) with Merkle proofs and auditability for offline RAG pipelines. | Python | 185 |
| [code-chunk](https://github.com/supermemoryai/code-chunk) | AST-aware code chunking library using tree-sitter to produce semantically coherent chunks optimized for embeddings and RAG. | TypeScript | 178 |
| [Tenk](https://github.com/ralliesai/tenk) | RAG-based tool for querying and citing SEC filings using locally indexed EDGAR data. | Python | 129 |
| [SmartRAG](https://github.com/itanishqshelar/SmartRAG) | Privacy‑first multimodal local RAG stack using Llama, Whisper, BLIP, ChromaDB, and local embeddings. | Python | 109 |
| [FLAMEHAVEN FileSearch](https://github.com/flamehaven01/Flamehaven-Filesearch) | Self‑hosted semantic document search RAG engine built with Python and FastAPI. | Python | 95 |
| [llm-rag-with-reranker-demo](https://github.com/yankeexe/llm-rag-with-reranker-demo) | Demo RAG app with cross-encoder re-ranking for YouTube video retrieval and LLM integration. | Python | 83 |
| [aimengpt](https://github.com/aietal/aimengpt) | Self-hosted chatbot with document uploads using Llama2, ChromaDB and LangChain. | TypeScript | 83 |
| [LLM-RAG-Architecture](https://github.com/matt-bentley/LLM-RAG-Architecture) | Production-grade Retrieval-Augmented Generation architecture using open-source components. | C# | 73 |
| [pgsemantic](https://github.com/varmabudharaju/pgsemantic) | Zero-config semantic search for any PostgreSQL database. | Python | 51 |
| [n8n-and-code-rag](https://github.com/Getting-Automated/n8n-and-code-rag) | Production-ready RAG pipeline: ingest, OCR, table extraction, embeddings stored in Supabase (pgvector). | Python | 48 |
| [sense](https://github.com/luuuc/sense) | MCP server providing symbol graphs, code understanding and semantic search for agents. | Go | 31 |
| [Crate-Indexer](https://github.com/philsippl/crate-indexer) | Rust CLI that fetches, indexes crates and provides semantic search and MCP server. | Rust | 11 |
| [supavec](https://github.com/taishikato/supavec) | Open-source platform to build RAG applications with any data source at any scale. | — | 0 |
| [NyRAG](https://github.com/abhishekkrthakur/NyRAG) | Tool for building RAG apps: crawling, processing, hybrid search, embeddings and Vespa integration. | — | 0 |
| [mole](https://github.com/lajosdeme/mole) | Local deep-research agent that searches sources, verifies quotes, checks contradictions, and returns citations. | — | 0 |
| [Firecrawl](https://github.com/firecrawl.dev/firecrawl) | Web data API that crawls, renders JS, extracts main content and returns structured Markdown/JSON for LLMs. | — | 0 |
| [FastGPT](https://github.com/labring/FastGPT) | Knowledge-based LLM platform offering data processing, RAG retrieval and visual workflows. | TypeScript | 29,376 |
| [PixelRAG](https://github.com/StarTrail-org/PixelRAG) | Pixel-native scalable search for web content — a vision-driven retrieval approach. | Python | 9,571 |
| [deep-searcher](https://github.com/zilliztech/deep-searcher) | Python-based deep research/search system for private data, referencing vector DB integrations. | Python | 8,060 |
| [MemoRAG](https://github.com/qhjqhj00/MemoRAG) | Memory-based data interface designed to enhance RAG workflows across applications. | Python | 2,266 |
| [Dot](https://github.com/alexpinel/Dot) | Local app combining text-to-speech, LLMs, and RAG with local vector search. | JavaScript | 1,911 |
| [reag](https://github.com/superagent-ai/reag) | Project for Reasoning Augmented Generation (RAG) functionality. | Python | 904 |
| [IncarnaMind](https://github.com/junruxiong/IncarnaMind) | Document chat tool to connect and query multiple PDFs/TXTs via several LLMs. | Python | 800 |
| [NodeRAG](https://github.com/Terry-Xu-666/NodeRAG) | Official repository for NodeRAG, indicating a RAG framework/retrieval project. | Python | 417 |
| [Fyin](https://github.com/shadowfax92/Fyin) | Open-source, local-capable search/QA alternative to Perplexity AI for retrieval-augmented answers. | Rust | 233 |
| [Proxy-Pointer-RAG](https://github.com/Proxy-Pointer/Proxy-Pointer-RAG) | Proxy-Pointer RAG for structure-aware reasoning and scalable retrieval-augmented workflows. | Python | 103 |
| [akita-ai](https://github.com/gauthierpiarrette/akita-ai) | CLI context-aware chatbot for instant codebase insights. | Python | 16 |
| [LlamaIndex](https://github.com/github.com/llamaindex) | LlamaParse (metadata only) — no detailed description provided. | — | 0 |

#### Adjacent (57)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Awesome LLM Apps](https://github.com/Shubhamsaboo/awesome-llm-apps) | Cookbook of ready-to-run LLM app templates including RAG pipelines and agent examples. | Python | 129,615 |
| [Flowise](https://github.com/FlowiseAI/Flowise) | Drag-and-drop UI for building customized LLM flows and pipelines, enabling low-code RAG/workflow assembly. | TypeScript | 55,380 |
| [sim](https://github.com/simstudioai/sim) | Visual platform to build AI workflows and agent orchestration (Hermes Agent). | TypeScript | 29,424 |
| [Coze Studio](https://github.com/coze-dev/coze-studio) | Agent platform/studio for building multimodel agents and RAG-enabled workflows. | TypeScript | 21,459 |
| [LangChain.js](https://github.com/langchain-ai/langchainjs) | JavaScript framework for building LLM apps, integrating data sources and RAG. | TypeScript | 17,516 |
| [Easy Dataset](https://github.com/ConardLi/easy-dataset) | JS tool to create datasets with intelligent doc ingestion, splitting, and evaluation for LLMs/RAG. | JavaScript | 13,981 |
| [mcp-chrome](https://github.com/hangwin/mcp-chrome) | MCP server exposing browser for AI assistants, enabling content analysis and semantic search. | TypeScript | 11,253 |
| [Agent Starter Pack](https://github.com/GoogleCloudPlatform/agent-starter-pack) | Starter templates and infra to deploy generative AI agents with RAG and observability on GCP. | Python | 6,275 |
| [agentql](https://github.com/tinyfish-io/agentql) | Query language and Playwright integrations to extract web data for AI workflows; SDKs and REST API. | Python | 1,451 |
| [tavily-python](https://github.com/tavily-ai/tavily-python) | Python wrapper for the Tavily search API to enable programmatic search and extraction. | Python | 1,363 |
| [Open Scouts](https://github.com/firecrawl/open-scouts) | AI web-monitoring platform using scheduled scouts, semantic search and pgvector indexing. | TypeScript | 1,272 |
| [Databricks AI Dev Kit](https://github.com/databricks-solutions/ai-dev-kit) | Databricks toolkit enabling AI agents and Knowledge Assistants, including RAG integrations on Databricks. | Python | 1,257 |
| [HelixML](https://github.com/helixml/helix) | Enterprise GenAI platform: agent fleets, multi-provider LLMs, RAG backends, ingestion and observability. | Go | 757 |
| [Puzld](https://github.com/MedChaouch/Puzld.ai) | Terminal-native multi-LLM/agent orchestration with memory/RAG and agent pipelines. | TypeScript | 260 |
| [Jarvis AI Agent](https://github.com/Xthebuilder/JRVS) | Local-first AI agent framework with a RAG core, FAISS/BGE retrieval, and MCP/UTCP protocols. | Python | 236 |
| [Building-Business-Ready-Generative-AI-Systems](https://github.com/Denis2054/Building-Business-Ready-Generative-AI-Systems) | Notebook codebase demonstrating how to architect and implement enterprise RAG frameworks and generative AI systems. | Jupyter Notebook | 167 |
| [notebooks-vol1](https://github.com/doc-intel/notebooks-vol1) | Executable notebooks demonstrating end-to-end document-intelligence workflows: OCR, reranking, retrieval, and mini-RAG pipelines. | Python | 38 |
| [news-dashboard](https://github.com/lihor-hub/news-dashboard) | Self-hosted news triage and RSS reader with full-text/semantic search, embeddings support, and Ask-AI features using pgvector. | Python | 22 |
| [BrightDataMCPServerAgent](https://github.com/techwithtim/BrightDataMCPServerAgent) | Integrates Bright Data MCP server with agents to enable live web data access for model inference. | Python | 18 |
| [Project-WebSage](https://github.com/AIAnytime/Project-WebSage) | AI engine that extracts webpage content, summarizes it, and enables conversational interaction over the extracted content. | Python | 15 |
| [Beginners](https://github.com/microsoft/generative-ai-for-beginners) | Educational course covering generative AI topics, including semantic search and prompt engineering. | Jupyter Notebook | 117,949 |
| [ruflo](https://github.com/ruvnet/ruflo) | Agent meta-harness with RAG integration, adaptive memory, and multi-agent coordination. | TypeScript | 61,721 |
| [LibreChat](https://github.com/danny-avila/LibreChat) | Open-source chat platform with model switching, message search and langchain support. | TypeScript | 42,153 |
| [AI Engineering Hub](https://github.com/patchy631/ai-engineering-hub) | Collection of tutorials and projects teaching LLMs, RAG, and agent workflows. | Jupyter Notebook | 33,681 |
| [Scrapegraph-ai](https://github.com/ScrapeGraphAI/Scrapegraph-ai) | AI-powered web scraper/crawler for extracting web data to support ingestion. | Python | 29,666 |
| [semantic-kernel](https://github.com/microsoft/semantic-kernel) | SDK to integrate LLM capabilities into applications, listed as useful for retrieval and embedding workflows. | C# | 28,459 |
| [DB-GPT](https://github.com/eosphoros-ai/DB-GPT) | AI-native data app framework with agentic workflow language and agents. | Python | 19,738 |
| [eliza](https://github.com/elizaos/eliza) | Open-source agentic operating system for building autonomous agents and plugins. | TypeScript | 19,080 |
| [Gemini API Cookbook](https://github.com/google-gemini/cookbook) | Cookbook with examples for using the Gemini API, including RAG grounding patterns. | Jupyter Notebook | 17,034 |
| [Foundations-of-LLMs](https://github.com/ZJU-LLMs/Foundations-of-LLMs) | Book-style repository covering foundations of LLMs, including RAG and prompt engineering. | — | 16,059 |
| [PocketFlow](https://github.com/The-Pocket/PocketFlow) | Compact agentic LLM framework for building agent workflows and RAG-style agent orchestration. | Python | 11,108 |
| [Eino](https://github.com/cloudwego/eino) | Go framework for LLM apps providing ChatModels, Retrievers, and an Agent Development Kit. | Go | 10,710 |
| [Praison AI](https://github.com/MervinPraison/PraisonAI) | Low-code multi-agent LLM platform for building and managing agent systems over codebases. | Python | 8,908 |
| [notebooklm-skill](https://github.com/PleasePrompto/notebooklm-skill) | Python skill to query Google NotebookLM notebooks for source-grounded answers. | Python | 5,918 |
| [Everywhere](https://github.com/DearVa/Everywhere) | Desktop context-aware AI assistant using RAG and multiple LLMs for on-screen content understanding. | C# | 5,831 |
| [TaskingAI](https://github.com/TaskingAI/TaskingAI) | Open-source platform for building AI-native applications with RAG and vector features. | Python | 5,398 |
| [eko](https://github.com/FellouAI/eko) | Agentic workflow framework to build production-ready natural-language agents (mentions RAG/workflow). | TypeScript | 4,951 |
| [gptme](https://github.com/gptme/gptme) | Terminal-based agent combining local tools, web browsing, vision and RAG capabilities. | Python | 4,390 |
| [GenerativeAIExamples](https://github.com/NVIDIA/GenerativeAIExamples) | NVIDIA reference workflows for generative AI and RAG optimized for accelerated infra. | Jupyter Notebook | 4,150 |
| [mirage](https://github.com/strukto-ai/mirage) | Virtual file system designed for AI agents to unify access to agent tools and files. | TypeScript | 3,250 |
| [mobile-use](https://github.com/minitap-ai/mobile-use) | Agent framework to control mobile devices and scrape UI into structured formats for agents. | Python | 2,447 |
| [LLMStack](https://github.com/trypromptly/LLMStack) | No-code multi-agent framework to build LLM agents, workflows and apps with your data. | Python | 2,309 |
| [dash](https://github.com/agno-agi/dash) | Self-learning data agent grounding answers in multiple context layers for data-backed responses. | Python | 2,249 |
| [Prepare unstructured data for AI Agents](https://github.com/Ontos-AI/knowhere) | Framework to prepare unstructured data for AI agents for RAG and agent workflows. | Python | 1,804 |
| [langgraph-swarm-py](https://github.com/langchain-ai/langgraph-swarm-py) | Python library for multi-agent systems (LangGraph) supporting multi-agent workflows. | Python | 1,554 |
| [Glass Keep](https://github.com/nikunjsingh93/react-glass-keep) | Self-hosted notes app with a local AI assistant using RAG to answer from the user's notes. | JavaScript | 565 |
| [giselle](https://github.com/giselles-ai/giselle) | Open-source AI app builder for agentic apps (topics include rag and agent-builder tooling). | TypeScript | 554 |
| [Cordum](https://github.com/cordum-io/cordum) | Agent control plane providing governance, policy checks, and audit trails for agent execution. | Go | 465 |
| [Beever Atlas](https://github.com/Beever-AI/beever-atlas) | Platform (Atlas) for managing AI workflows and data, with knowledge-base and RAG integrations. | Python | 386 |
| [penguin-harness](https://github.com/Prism-Shadow/penguin-harness) | Automated desktop/server agent builder that generates and evolves RAG apps, skills, and traceable observability. | TypeScript | 236 |
| [shumai](https://github.com/shumaiOne/shumai) | Self-hostable media review platform with integrated AI agents and pgvector-backed semantic search. | TypeScript | 156 |
| [CodeJury](https://github.com/krishagarwal314/CodeJury) | Terminal-first multi-agent, knowledge-grounded pipeline for implementing code changes with a persistent code graph and semantic search. | Python | 129 |
| [Fractera](https://github.com/Fractera/Agent-Engineering-Infrastructure) | Agent engineering infra for self‑hosted deployment, orchestration, and local RAG with token optimizer. | TypeScript | 54 |
| [klee-service](https://github.com/signerlabs/klee-service) | Python backend for Klee app using FastAPI, LlamaIndex, and Ollama for AI/RAG integrations. | Python | 33 |
| [renfield](https://github.com/ebongard/renfield) | Self-hosted offline assistant with hybrid RAG knowledge base, pgvector search, and knowledge graph. | Python | 30 |
| [Sim](https://github.com/sim.ai/sim) | Platform for building and orchestrating AI agents and agentic workflows with RAG integrations. | — | 0 |
| [Cambium](https://github.com/KimGLee/Cambium) | Governance standard and reference toolset for managing knowledge corpora and agent interactions with auditable evidence. | — | 0 |

### GraphRAG, knowledge graphs & graph databases

Graph-native systems for entity relationships, graph databases, knowledge-graph construction, and graph-assisted retrieval.

#### Core (29)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [graphify](https://github.com/Graphify-Labs/graphify) | Transforms codebases and docs into a queryable knowledge graph with provenance and NL subgraph queries. | Python | 99,823 |
| [Understand-Anything](https://github.com/Egonex-AI/Understand-Anything) | Turns code into interactive knowledge graphs for search and Q&A. | TypeScript | 79,617 |
| [CodeGraph](https://github.com/colbymchenry/codegraph) | Pre-indexed code knowledge graph that supplies focused context to coding agents. | C | 63,894 |
| [codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp) | High-performance MCP server that indexes codebases into a persistent knowledge graph. | C | 36,876 |
| [graphrag](https://github.com/microsoft/graphrag) | Modular graph-based Retrieval-Augmented Generation (GraphRAG) system. | Python | 35,543 |
| [Graphiti](https://github.com/getzep/graphiti) | Build real-time knowledge graphs for AI agents. | Python | 30,018 |
| [code-review-graph](https://github.com/tirth8205/code-review-graph) | Local knowledge graph of code parsed by Tree-sitter to deliver precise context to AI tools and reduce token usage. | Python | 27,912 |
| [rowboat](https://github.com/rowboatlabs/rowboat) | Local-first AI coworker that builds an actionable knowledge graph from personal data and notes. | TypeScript | 16,911 |
| [KAG](https://github.com/OpenSPG/KAG) | Logical form-guided reasoning and retrieval framework for factual Q&A and domain KBs. | Python | 8,981 |
| [semantica](https://github.com/semantica-agi/semantica) | Graph-native context and knowledge infrastructure with reasoning, provenance, and RDF/LPG backend support. | Python | 8,539 |
| [llm-graph-builder](https://github.com/neo4j-labs/llm-graph-builder) | Constructs Neo4j knowledge graphs from unstructured data using LLMs. | Jupyter Notebook | 5,173 |
| [Code-Graph-RAG](https://github.com/vitali87/code-graph-rag) | Parses code with Tree-sitter to build a Memgraph knowledge graph with RAG interface. | Python | 4,528 |
| [nano-graphrag](https://github.com/gusye1234/nano-graphrag) | Small, easy-to-modify GraphRAG implementation for experiment and learning. | Python | 3,967 |
| [graphrag-accelerator](https://github.com/Azure-Samples/graphrag-accelerator) | One-click Azure deployable Knowledge Graph powered RAG accelerator. | Python | 2,409 |
| [EdgeQuake](https://github.com/raphaelmansuy/edgequake) | Rust GraphRAG framework converting documents into knowledge graphs for retrieval. | Rust | 1,889 |
| [pgGraph](https://github.com/Evokoa/pgGraph) | Graph database capabilities for Postgres to add relationship graph/traversal features. | Rust | 1,000 |
| [Create Context Graph](https://github.com/neo4j-labs/create-context-graph) | Neo4j Labs tool to transform documents and data into graphs used for AI knowledge context. | Python | 667 |
| [Axon](https://github.com/harshkedia177/axon) | Graph-powered code intelligence engine indexing codebases into structural knowledge graphs. | Python | 665 |
| [Graph-R1](https://github.com/LHRLAB/Graph-R1) | Research project on an agentic GraphRAG framework using end-to-end RL. | Python | 590 |
| [context-ontology-accelerator](https://github.com/aws/context-ontology-accelerator) | Semantic context layer combining knowledge graphs, ontologies, VKG/SPARQL and ingestion for agent context. | Python | 318 |
| [brainapi2.git](https://github.com/Lumen-Labs/brainapi2) | Knowledge-graph memory layer turning text into event-centric graphs for queryable agent memory. | Python | 296 |
| [GraphRAG-with-Llama-3.1](https://github.com/Coding-Crashkurse/GraphRAG-with-Llama-3.1) | Streamlined GraphRAG implementation combining knowledge graphs with Llama 3.1. | Jupyter Notebook | 239 |
| [mnemo](https://github.com/zaydmulani09/mnemo) | Local-first AI memory layer offering a persistent knowledge graph, entity extraction, and semantic retrieval. | Rust | 226 |
| [LeanKG](https://github.com/FreePeak/LeanKG) | Local-first knowledge graph for codebases using tree-sitter to map code relations. | Rust | 200 |
| [Fluree AI](https://github.com/flur.ee/fluree-ai) | FlureeDB-based verifiable knowledge graph service storing RDF triples with temporal history and queryable graph semantics. | — | 0 |
| [br-acc](https://github.com/World-Open-Graph/br-acc) | Graph ETL infrastructure normalizing Brazilian public datasets into a Neo4j knowledge graph. | — | 0 |
| [Beads](https://github.com/steveyegge/beads) | Distributed graph issue tracker providing structured, versioned memory and knowledge graph links for agents. | — | 0 |
| [graphify](https://github.com/safishamsi/graphify) | AI coding assistant that converts code, schemas and docs into a unified queryable knowledge graph. | Python | 72,910 |
| [GitNexus](https://github.com/abhigyanpatwari/GitNexus) | Client-side knowledge graph creator that builds interactive Graph RAG agents from repos or ZIPs in the browser. | TypeScript | 45,480 |

#### Adjacent (5)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [MiroFish-Offline](https://github.com/nikmcfly/MiroFish-Offline) | Local multi-agent simulation engine that uses Neo4j knowledge graph memory. | Python | 1,955 |
| [PentAGI](https://github.com/vxcontrol/pentagi) | Autonomous pentesting agents using a knowledge graph for semantic relationships and memory. | Go | 15,154 |
| [genai-stack](https://github.com/docker/genai-stack) | Starter stack combining LangChain, Neo4j, Ollama for graph-enabled RAG deployments. | Python | 5,390 |
| [MiroShark](https://github.com/aaronjmars/MiroShark) | Builds knowledge graphs from uploaded documents and runs multi-agent public-discourse simulations with sliding-window memory. | Python | 716 |
| [Klaat Code](https://github.com/KlaatAI/klaatcode) | Terminal AI coding agent with a code knowledge graph and semantic search. | TypeScript | 353 |

### Vector databases, embedding stores & indexing

Production vector stores, embedding indexes, ANN implementations, vector-search extensions, and hybrid retrieval infrastructure.

#### Core (12)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Elasticsearch](https://github.com/elastic/elasticsearch) | Distributed search and analytics engine with full-text and vector search for production RAG use cases. | Java | 77,630 |
| [Milvus](https://github.com/milvus-io/milvus) | High-performance, cloud-native vector database for scalable ANN search (Milvus). | Go | 43,850 |
| [qdrant](https://github.com/qdrant/qdrant) | High-performance, large-scale vector database and search engine (Qdrant). | Rust | 34,029 |
| [pgvector](https://github.com/pgvector/pgvector) | PostgreSQL extension enabling efficient vector similarity search inside Postgres. | C | 20,856 |
| [turbovec](https://github.com/RyanCodrai/turbovec) | High-performance vector processing library for fast similarity search and ANN. | Python | 14,820 |
| [lancedb](https://github.com/lancedb/lancedb) | Developer-friendly, serverless vector database for AI applications and long-term LLM memory. | Rust | 11,170 |
| [Zvec](https://github.com/alibaba/zvec) | In-process, high-performance vector database (Zvec) with dense/sparse support and hybrid search. | C++ | 9,435 |
| [sqlite-vec](https://github.com/asg017/sqlite-vec) | SQLite extension adding vector search capabilities to run vector queries anywhere. | C | 8,023 |
| [helix-db](https://github.com/HelixDB/helix-db) | OLTP graph-vector database implemented in Rust. | Rust | 5,752 |
| [RuVector](https://github.com/ruvnet/ruvector) | High-performance Rust vector DB with GNNs, hybrid search and GraphRAG capabilities. | Rust | 3,798 |
| [pgContext](https://github.com/Evokoa/pgContext) | Postgres extension adding durable HNSW vector search, hybrid and filter-aware retrieval. | Rust | 179 |
| [h2ogpt](https://github.com/h2oai/h2ogpt) | Private local Q&A and summarization of documents/images with local LLM support and vectorstore integration. | Python | 11,972 |

### Context, memory & session management

Systems that capture, compress, retrieve, persist, and inject contextual information or long-term memory for LLMs and agents.

#### Core (56)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [claude-mem](https://github.com/thedotmack/claude-mem) | Persistent agent memory: captures session activity, compresses it with AI, and injects relevant context into future sessions. | JavaScript | 91,015 |
| [mem0](https://github.com/mem0ai/mem0) | Memory layer for personalized AI handling long-term memory and state management. | Python | 63,466 |
| [OpenViking](https://github.com/volcengine/OpenViking) | Open-source context database unifying agent memory, resources and skills. | Python | 28,891 |
| [Mastra](https://github.com/mastra-ai/mastra) | TypeScript framework for production AI apps with context management and agent memory. | TypeScript | 23,116 |
| [Memvid](https://github.com/memvid/memvid) | Serverless, portable memory layer for agents using append-only Smart Frames for efficient retrieval, compression, and versioning. | Rust | 15,011 |
| [MemU](https://github.com/NevaMind-AI/memU) | Memory framework for continuous agents with hierarchical, cacheable memories and knowledge graph. | Python | 13,379 |
| [Claude Context](https://github.com/zilliztech/claude-context) | Context and memory management layer for Claude-based workflows. | TypeScript | 12,408 |
| [opensquilla](https://github.com/opensquilla/opensquilla) | Agent framework focused on token-efficient context management and leaner prompts. | Python | 4,866 |
| [lossless-claw](https://github.com/martian-engineering/lossless-claw) | Lossless context management plugin preserving full conversation history via DAG summarization. | TypeScript | 4,348 |
| [MemMachine](https://github.com/MemMachine/MemMachine) | Universal memory layer managing episodic, profile, and working memory for AI agents and LLM apps. | Python | 4,129 |
| [Koog](https://github.com/JetBrains/koog) | Kotlin framework for building fault-tolerant AI agents with memory, history compression, RAG and observability. | Kotlin | 4,084 |
| [SimpleMem](https://github.com/aiming-lab/SimpleMem) | Efficient lifelong memory system providing persistent retrieval for LLM agents | Python | 3,704 |
| [Recursive Language Models](https://github.com/alexzhang13/rlm) | Inference engine for Recursive Language Models enabling programmatic recursive context handling. | Python | 3,346 |
| [memobase](https://github.com/memodb-io/memobase) | Profile-based long-term memory system designed for AI applications. | Python | 2,845 |
| [Claude Subconscious](https://github.com/letta-ai/claude-subconscious) | Background agent that builds persistent memory from codebase transcripts to inform prompts. | TypeScript | 2,652 |
| [Letta Code](https://github.com/letta-ai/letta-code) | Memory-first coding harness for persistent agents that accumulate knowledge over time. | TypeScript | 2,320 |
| [Open Brain](https://github.com/NateBJones-Projects/OB1) | Open protocol shared memory system with vector search for persistent, modular knowledge. | TypeScript | 1,565 |
| [memsearch](https://github.com/zilliztech/memsearch) | Markdown-first semantic memory with hybrid dense+sparse retrieval and real-time indexing for AI agents. | Python | 1,250 |
| [memory-os](https://github.com/ClaudioDrews/memory-os) | Seven-layer persistent memory OS for agents with Qdrant integration and context recall. | Python | 1,203 |
| [minutes](https://github.com/silverstein/minutes) | Privacy-first conversation memory layer converting audio to searchable knowledge. | Rust | 1,087 |
| [ralph-loop-agent](https://github.com/vercel-labs/ralph-loop-agent) | Agent loop framework enabling continuous autonomy with context management and token-aware controls. | TypeScript | 762 |
| [second-brain-cloudflare](https://github.com/rahilp/second-brain-cloudflare) | Self-hosted memory layer on Cloudflare Workers to store and recall data across AI tools. | TypeScript | 718 |
| [Bu-Agent-SDK](https://github.com/browser-use/agent-sdk) | Minimal Python SDK for LLM agents with ephemeral messages and automatic context compaction. | Python | 685 |
| [cavemem](https://github.com/JuliusBrussee/cavemem) | Cross-agent persistent memory store for coding assistants; compressed and local by default. | TypeScript | 566 |
| [smfs](https://github.com/supermemoryai/smfs) | Filesystem abstraction providing persistent memory storage for AI systems. | Rust | 460 |
| [paxm](https://github.com/pax-beehive/paxm) | Persistent, provider-neutral agent memory layer with local SQLite and migration to remote providers. | Go | 435 |
| [Agent Sandbox Skill](https://github.com/disler/agent-sandbox-skill) | Skill to manage isolated execution sandboxes and persistent context for AI agents. | Python | 362 |
| [Octopoda-OS](https://github.com/RyjoxTechnologies/Octopoda-OS) | Persistent memory OS for AI agents with semantic search, loop detection, messaging, crash recovery, and observability. | Python | 347 |
| [pmb](https://github.com/oleksiijko/pmb) | Local-first persistent memory for AI coding agents storing decisions and facts in a SQLite file with semantic/vector search. | Python | 290 |
| [MineEcho](https://github.com/Health-Yang/MineEcho) | Local-first Memory OS with multi-level memory and TokenLess context compression for personal AI. | TypeScript | 261 |
| [YourMemory](https://github.com/sachitrafa/YourMemory) | Agent memory system with Ebbinghaus forgetting curve decay and pgvector integration. | Python | 247 |
| [understory](https://github.com/thecodacus/understory) | Markdown-first persistent memory layer producing an interconnected knowledge graph for agents. | TypeScript | 233 |
| [dex](https://github.com/dcramer/dex) | Task-tracking system providing persistent, structured memory for coordinating multi-session AI agent work. | TypeScript | 228 |
| [Accordion](https://github.com/a-Fig/Accordion) | Visual block-based context manager for long agent sessions with foldable summaries and relevance-based conductor. | TypeScript | 218 |
| [Memoria](https://github.com/matrixorigin/Memoria) | Persistent, versioned memory layer for AI agents with 'Git for Memory' semantics and hybrid search. | Rust | 200 |
| [context-engine](https://github.com/Emmimal/context-engine) | Pure-Python context management layer for LLMs: retrieval, re-ranking, memory decay, and token-budget enforcement. | Python | 195 |
| [Total Recall](https://github.com/davegoldblatt/total-recall) | Persistent, tiered memory plugin for Claude Code with write gates, registers, and searchable archives. | Shell | 194 |
| [contextvc](https://github.com/HaochengLu/contextvc) | Git-native versioned context/memory control plane for agent memory and configs. | Rust | 145 |
| [getprofile](https://github.com/getprofile/getprofile) | Drop-in LLM proxy providing persistent user profiles and structured long-term memory. | TypeScript | 39 |
| [DecisionNode](https://github.com/decisionnode/DecisionNode) | Shared structured, semantically queryable memory store for MCP clients. | TypeScript | 39 |
| [mnesis](https://github.com/Lucenor/mnesis) | Deterministic memory engine that offloads memory management to prevent context-window degradation for long-running agents. | Python | 18 |
| [smriti](https://github.com/himanshudongre/smriti) | Agent memory model that uses Git-like checkpoints to manage memory state. | Python | 16 |
| [MEMORY.md](https://github.com/upstash/agent-memory) | Redis-backed agent memory with live observability tooling. | TypeScript | 6 |
| [TencentDB-Agent-Memory](https://github.com/TencentCloud/TencentDB-Agent-Memory) | Layered agent memory framework with Wiki, CodeGraph, and a shared Memory Hub for teams. | — | 0 |
| [Primer](https://github.com/pierceboggan/primer) | AgentRC framework for context engineering: measures repo AI readiness and generates instructions. | — | 0 |
| [ContextOS](https://github.com/joshimohanlalit1303-ctrl/ContextOS) | Memory-as-a-Service: persistent memory with pgvector semantic search and deduplication. | TypeScript | 0 |
| [Cognee](https://github.com/topoteretes/cognee) | Knowledge engine combining vector search and graph DBs to build personalized, dynamic agent memory. | Python | 29,642 |
| [gbrain](https://github.com/garrytan/gbrain) | Long-term memory backend organizing world knowledge as Markdown for agents. | TypeScript | 28,616 |
| [hindsight](https://github.com/vectorize-io/hindsight) | Builds retrieval datasets from application logs and user interactions for retrieval systems. | Python | 17,669 |
| [mem-agent-mcp](https://github.com/firstbatchxyz/mem-agent-mcp) | Server component for a mem-agent (MCP) implementation to support agent memory/context. | Python | 627 |
| [kimi-writer](https://github.com/Doriandarko/kimi-writer) | Autonomous writing agent with smart context management, automatic context compression, token budgeting, and recovery for long-form work. | Python | 564 |
| [finding-unknowns-skills](https://github.com/Neeeophytee/finding-unknowns-skills) | Collection of installable agent skills to surface unknowns, audit context, and improve prompting/context management. | — | 291 |
| [Gemini Writing Agent](https://github.com/Doriandarko/gemini-writer) | Autonomous Gemini-based writing agent with real-time streaming, context compression, and recovery for long-form content. | Python | 273 |
| [rememberall](https://github.com/wrannaman/rememberall) | Tooling aimed at long-term memory storage solutions for LLMs. | JavaScript | 124 |
| [opendream](https://github.com/pylit-ai/opendream) | Local‑first memory and dreaming automation system for agents. | Python | 7 |
| [memvid](https://github.com/Olow304/memvid) | Single-file agent memory system using append-only compressed 'Smart Frames' for fast local recall. | — | 0 |

#### Adjacent (10)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [12-Factor Agent](https://github.com/humanlayer/12-factor-agents) | Principles guide for building production-grade LLM-powered agents focusing on memory. | TypeScript | 19,359 |
| [beginners](https://github.com/microsoft/mcp-for-beginners) | Curriculum and examples for the Model Context Protocol (MCP) across languages. | Jupyter Notebook | 15,892 |
| [Context Engineering](https://github.com/davidkimai/Context-Engineering) | Handbook and frameworks for designing LLM context, covering memory, retrieval, tools, and state orchestration. | Python | 8,739 |
| [klavis](https://github.com/Klavis-AI/klavis) | Integration platform providing connectors and protocols for agents to use external tools and manage context. | Python | 5,712 |
| [AnyTool](https://github.com/HKUDS/AnyTool) | Universal tool orchestration layer for agents with smart context management and fast tool retrieval. | Python | 641 |
| [kwami](https://github.com/alexcolls/kwami) | 3D AI companion library with STT/LLM/TTS pipeline and persistent memory via Zep integration. | — | 0 |
| [OpenHuman](https://github.com/tinyhumansai/openhuman) | Multimodal framework combining vision-language understanding with memory and interaction systems for digital human experiences. | Rust | 36,330 |
| [AIPEXBASE](https://github.com/kuafuai/aipexbase) | AI-native backend (BaaS) offering data storage, authentication and context management for AI apps. | Java | 1,262 |
| [experts](https://github.com/metaskills/experts) | Framework to create/deploy OpenAI Assistants and link them as tools for multi-agent systems with expanded memory. | JavaScript | 1,066 |
| [getting-started-ai-agents-in-csharp](https://github.com/Dometrain/getting-started-ai-agents-in-csharp) | C# sample projects teaching AI agents, including memory and context management examples. | C# | 7 |

### Tokenization, context compression & token optimization

Tokenizer libraries, token-cost/budget tools, chunking evaluation, prompt/context compression, cache strategies, and context engineering.

#### Core (10)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Gigatoken](https://github.com/marcelroed/gigatoken) | High-performance Rust tokenizer offering massive throughput and compatibility with common tokenizers. | Rust | 3,846 |
| [tokencost](https://github.com/AgentOps-AI/tokencost) | Provides token price/cost estimates across 400+ LLMs. | Python | 2,003 |
| [token-optimizer-mcp](https://github.com/ooples/token-optimizer-mcp) | Token optimization for Claude Code using caching, compression, and smart tooling to cut token usage. | JavaScript | 487 |
| [Rustbpe](https://github.com/karpathy/rustbpe) | Rust library to train GPT-style BPE tokenizers with tiktoken export and Python bindings. | Rust | 433 |
| [Entroly](https://github.com/juyterman1000/entroly) | Local proxy that compresses context, caches providers, and verifies LLM outputs to reduce costs. | Python | 417 |
| [ratel](https://github.com/ratel-ai/ratel) | Context engineering layer that indexes tools/skills and reduces token use with retrieval. | Rust | 391 |
| [rag-chunk](https://github.com/messkan/rag-chunk) | CLI tool to test and benchmark chunking strategies for RAG, includes token-accurate and semantic chunking. | Python | 108 |
| [Tokenizer Visualizer](https://github.com/rom1504/tokenizer-ui) | Web-based visualizer showing how tokenizers split text and multimodal inputs. | HTML | 49 |
| [Token-Saver](https://github.com/Marktechpost/Token-Saver) | Claude Desktop extension that locally indexes PDFs and forwards only relevant passages, saving 92–98% tokens. | — | 0 |
| [headroom](https://github.com/chopratejas/headroom) | Library/proxy/MCP server that compresses tool outputs, logs and RAG chunks to reduce token usage. | — | 0 |

#### Adjacent (2)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Prompt Engineering Guide](https://github.com/dair-ai/Prompt-Engineering-Guide) | Comprehensive guide and resources for prompt and context engineering, RAG, and agents. | MDX | 77,529 |
| [langalpha](https://github.com/ginlix-ai/langalpha) | Agent approach that executes sandboxed code to fetch and compute data, returning compact results. | Python | 1,424 |

### Knowledge bases, documentation & research systems

Knowledge management, team documentation, personal knowledge bases, research workspaces, codebase wikis, and searchable source repositories.

#### Core (51)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [AFFiNE](https://github.com/toeverything/AFFiNE) | Privacy-first open-source knowledge base for planning, notes, and collaborative workspaces. | TypeScript | 71,620 |
| [Memos](https://github.com/usememos/memos) | Self-hosted, Markdown-native note-taking app for quick capture and data ownership. | Go | 58,967 |
| [logseq](https://github.com/logseq/logseq) | Privacy-first, local-first knowledge management platform with graph features. | Clojure | 44,492 |
| [outline](https://github.com/outline/outline) | Collaborative, real-time team knowledge base and documentation platform. | TypeScript | 38,166 |
| [Open Notebook](https://github.com/lfnovo/open-notebook) | AI-native workspace for notes and knowledge with multimodal sources and private vector search. | TypeScript | 36,225 |
| [DeepWiki-Open](https://github.com/AsyncFuncAI/deepwiki-open) | AI tool that auto-generates interactive wikis and documentation for code repositories. | Python | 15,716 |
| [SurfSense](https://github.com/MODSetter/SurfSense) | Privacy-focused, team research knowledge system integrating many LLMs and data sources. | Python | 13,857 |
| [OpenWiki](https://github.com/langchain-ai/openwiki) | CLI that generates and maintains a linked Markdown wiki and knowledge base. | TypeScript | 13,780 |
| [llm_wiki](https://github.com/nashsu/llm_wiki) | Cross-platform app that incrementally builds and maintains a persistent wiki from your documents using LLMs. | TypeScript | 12,982 |
| [chat-langchain](https://github.com/langchain-ai/chat-langchain) | Production-ready docs assistant for LangChain with managed retrieval and guardrails. | TypeScript | 6,436 |
| [Ars Contexta](https://github.com/agenticnotetaking/arscontexta) | Claude plugin that generates a personalized second-brain as owned Markdown knowledge files. | Shell | 3,423 |
| [open-knowledge](https://github.com/inkeep/open-knowledge) | AI-native Markdown editor and LLM wiki with semantic search, linking, and QA. | TypeScript | 3,239 |
| [OpenKB](https://github.com/VectifyAI/OpenKB) | Open LLM knowledge base for retrieval and knowledge management. | Python | 2,723 |
| [NoteDiscovery](https://github.com/gamosoft/NoteDiscovery) | Self-hosted Markdown note-taking app with a knowledge graph and MCP server for AI integration. | JavaScript | 2,441 |
| [Siftly](https://github.com/viperrcrypto/Siftly) | Local-first app that processes Twitter bookmarks into a searchable AI knowledge base. | TypeScript | 2,407 |
| [OpenOats](https://github.com/yazinsai/OpenOats) | Offline meeting note-taker with live transcription, KB retrieval and LLM integration for contextual suggestions. | Swift | 2,300 |
| [Alexandrie](https://github.com/Smaug6739/Alexandrie) | Self-hosted knowledge base with extended Markdown, Kanban, search, offline PWA and SSO support. | Vue | 2,265 |
| [Edit Mind](https://github.com/IliasHad/edit-mind) | Local-first video indexer producing metadata and vector embeddings for semantic video search. | TypeScript | 1,291 |
| [llmwiki](https://github.com/lucasastorian/llmwiki) | Open-source implementation of Karpathy's LLM Wiki to build a personal wiki from documents. | Python | 1,216 |
| [Atomic](https://github.com/kenforthewin/atomic) | Self-hosted semantic knowledge base turning markdown notes into a knowledge graph. | Rust | 1,045 |
| [KnowNote](https://github.com/MrSibe/KnowNote) | Local-first desktop app converting documents into a private conversational knowledge base. | TypeScript | 983 |
| [Effect Patterns Hub](https://github.com/PaulJPhilp/EffectPatterns) | Community-driven knowledge base of Effect-TS patterns with CLI search and guided learning. | TypeScript | 736 |
| [Clearly Markdown](https://github.com/Shpigford/clearly) | Native macOS Markdown editor and knowledge base with wiki features and MCP AI integration. | Swift | 595 |
| [sage-wiki](https://github.com/xoai/sage-wiki) | LLM-compiled personal knowledge base that extracts concepts, cross-references, and provides search. | Go | 544 |
| [framedex](https://github.com/Simbastack-hq/framedex) | Queryable knowledge base designed for indexing and searching video archives. | Python | 355 |
| [Spool](https://github.com/spool-lab/spool) | Local-first search engine indexing personal AI data and bookmarks with SQLite FTS5. | TypeScript | 288 |
| [Lore](https://github.com/ErezShahaf/Lore) | Local LLM agent that restructures user knowledge into a private vectorized DB. | TypeScript | 229 |
| [PDF-Brain](https://github.com/joelhooks/pdf-brain) | Local agent-first knowledge base indexing PDFs/Markdown with embeddings and hybrid search. | TypeScript | 223 |
| [inkstone](https://github.com/shuaiplus/inkstone) | Self‑hosted Markdown notebook with full-text search, backlinks, relationship graph and sync features. | TypeScript | 192 |
| [Jargon](https://github.com/jargon-io/jargon) | AI-managed research library extracting and linking insights from PDFs, articles, and transcripts with semantic search. | Ruby | 185 |
| [graybox](https://github.com/Aaryanverma/graybox) | Local-first knowledge base that organizes notes into a cross-linked, queryable Markdown wiki. | Python | 155 |
| [Willow Voice](https://github.com/willowvoice.com/willow-voice) | Voice-first note capture that organizes spoken content into a personal knowledge base. | — | 0 |
| [trilium](https://github.com/zadam/trilium) | Trilium Notes: build and manage a personal knowledge base. | — | 0 |
| [Jargon](https://github.com/schoblaska/jargon) | AI zettelkasten converting raw sources into interconnected insight cards with embeddings and semantic search. | — | 0 |
| [khoj](https://github.com/khoj-ai/khoj) | Self-hosted AI second brain providing answers from notes and external sources. | Python | 36,531 |
| [Supermemory](https://github.com/supermemoryai/supermemory) | Personal 'second brain' for bookmarks and saved content with AI-powered search and import tools. | TypeScript | 28,937 |
| [reor](https://github.com/reorproject/reor) | Private local AI personal knowledge management app using vector DBs and RAG. | JavaScript | 8,571 |
| [claude-obsidian](https://github.com/AgriciDaniel/claude-obsidian) | Obsidian plugin that builds a self-organizing knowledge graph of Markdown using Claude Code. | Python | 8,027 |
| [open-deep-research](https://github.com/nickscamara/open-deep-research) | Open-source deep research assistant that reasons over web data extracted with Firecrawl. | TypeScript | 6,277 |
| [deep-research](https://github.com/u14app/deep-research) | Deep research tooling to use various LLMs via APIs for research workflows and SSE. | JavaScript | 4,681 |
| [open-deep-research](https://github.com/btahir/open-deep-research) | Open-source alternative for generating AI research reports from search results. | TypeScript | 2,140 |
| [Work-Review](https://github.com/wm94i/Work-Review) | Local-first desktop app capturing work activity into a searchable timeline and KB. | Rust | 1,659 |
| [claude-memory-compiler](https://github.com/coleam00/claude-memory-compiler) | Tool to capture Claude sessions and compile evolving structured knowledge articles from codebase interactions. | Python | 1,277 |
| [enterprise-deep-research](https://github.com/SalesforceAIResearch/enterprise-deep-research) | Enterprise deep-research system from Salesforce for research workflows and agent-driven exploration. | Python | 1,199 |
| [ECLAIRE](https://github.com/eclaire-labs/eclaire) | Local-first AI assistant unifying personal data with search, OCR, classification, and automation. | TypeScript | 842 |
| [UI Design Brain](https://github.com/carmahhawwari/ui-design-brain) | Curated knowledge base skill for UI component design to improve agent-generated interfaces. | — | 759 |
| [Stik](https://github.com/0xMassi/stik_app) | Local-first macOS note app with on-device semantic search and embeddings for private knowledge management. | TypeScript | 170 |
| [keb](https://github.com/auto-medica-labs/keb) | Chrome extension converting browser content into a personal knowledge base. | TypeScript | 6 |
| [paperus](https://github.com/Naridon-Inc/paperus) | Local-first, E2EE, P2P Notion alternative using CRDTs for personal knowledge. | JavaScript | 5 |
| [Tome](https://github.com/Gremble-io/Tome) | On-device meeting and voice capture pipeline that transcribes to structured Markdown for vaults. | — | 0 |
| [research-rabbit](https://github.com/langchain-ai/research-rabbit) | Fully local web research and report-writing assistant for research workflows. | — | 0 |

#### Adjacent (8)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Copilot for Obsidian](https://github.com/logancyang/obsidian-copilot) | Obsidian plugin integrating AI assistant features to work with notes | TypeScript | 7,297 |
| [LobeHub](https://github.com/lobehub/lobehub) | Agent collaboration framework that includes knowledge-base support and plugin integrations. | TypeScript | 81,013 |
| [DeepTutor](https://github.com/HKUDS/DeepTutor) | Agent-native personalized tutor using RAG and embedding providers to enable interactive, research-driven learning. | Python | 31,648 |
| [katana](https://github.com/projectdiscovery/katana) | Next-generation web crawling and spidering framework for content ingestion. | Go | 17,330 |
| [5ire](https://github.com/nanbingxyz/5ire) | Cross-platform MCP client AI assistant supporting local knowledge bases and tools. | TypeScript | 5,335 |
| [Third Brain V5 Skills](https://github.com/Mark393295827/third-brain-v5-skills) | Skill pack for knowledge management workflows (ThirdBrain V5 skills). | HTML | 118 |
| [persona](https://github.com/runtypelabs/persona) | Persona/brain map skill aiming to tackle personal knowledge base challenges. | TypeScript | 100 |
| [MCP-Obsidian](https://github.com/bitbonsai/mcp-obsidian) | MCPVault connector to expose Obsidian vaults to MCP‑compatible AI assistants safely. | — | 0 |

### RAG evaluation, observability & agent data workflows

RAG test/evaluation systems, LLM/RAG tracing, prompt management, cost analysis, benchmarks, and quality observability.

#### Core (6)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [langfuse](https://github.com/langfuse/langfuse) | Observability and analytics platform for LLM apps providing tracing, evaluation, prompt management, and datasets. | TypeScript | 32,262 |
| [Promptfoo](https://github.com/promptfoo/promptfoo) | Tool to test and evaluate prompts, agents, and RAG systems with CI integration. | TypeScript | 22,650 |
| [helicone](https://github.com/Helicone/helicone) | Open-source LLM observability platform for monitoring, evaluation, and experimentation. | TypeScript | 6,077 |
| [agentops](https://github.com/AgentOps-AI/agentops) | Python SDK for agent monitoring, LLM cost tracking, benchmarking and evaluation. | Python | 5,779 |
| [frugon](https://github.com/Rodiun/frugon) | Local CLI that analyzes LLM call logs to identify cost-saving model routing and estimate quality impact. | Python | 201 |
| [Primitive Bench](https://github.com/primitive-bench/primitive-bench) | Vendor-neutral benchmark for AI infra primitives: search, extraction, vector DBs. | Python | 127 |

#### Adjacent (2)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Agent Commands](https://github.com/mitsuhiko/agent-commands) | Collection of agent skills and extensions for workflows, session control and tooling. | — | 0 |
| [argilla](https://github.com/argilla-io/argilla) | Collaboration platform for data labeling, annotation and human-in-the-loop workflows. | Python | 5,081 |

## Use Notes

This document is a discovery catalog, not a security, privacy, license, operational-readiness, or evaluation recommendation. Before adoption, review current documentation, supported deployment topology, data residency and privacy protections, license compatibility, ingestion accuracy, retrieval quality, evaluation methodology, maintenance activity, and cost implications. [1]

*Stars are the counts recorded in the attached dataset, not live GitHub values.*

## References

[1]: repo_showcase_merged.json (user-supplied repository dataset, analyzed August 18, 2026)
