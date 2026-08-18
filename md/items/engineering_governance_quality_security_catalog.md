# Engineering Governance, Quality, Security & Specification Repository Catalog

> **Scope.** This catalog is curated exclusively from the supplied `repo_showcase_merged.json` dataset. It covers code review, quality assurance, project management, agent orchestration and observability, analytics, security hardening, defensive OSINT, clean-code/SOLID practices, specification-driven design, and adjacent engineering operations. Repository metadata and star counts are source snapshots rather than live assessments. [1]

## Safety Boundary for Security and OSINT

> The OSINT and security sections are restricted to **passive/public-information intelligence, defensive reconnaissance, threat intelligence, exposure awareness, hardening, vulnerability analysis, detection, and governance**. Repositories associated with exploitation, evasion, credential theft, phishing, malware building, or offensive intrusion were excluded. [1]

## Curation Summary

The source dataset contains **6,327 unique repositories**. A high-recall metadata pass surfaced 605 candidates. The catalog retains **92 Core repositories** with two or more high-specificity workflow signals and **360 Adjacent repositories** with one direct workflow signal, for **452 entries**. The Adjacent tier expands discovery coverage and should receive an extra documentation check before adoption. [1]

| Tier | Meaning | Repositories |
| --- | --- | ---: |
| **Core** | Two or more high-specificity signals matched the repository’s engineering workflow role. | 92 |
| **Adjacent** | One direct high-specificity signal matched; included for adjacent-workflow coverage. | 360 |

## Coverage at a Glance

| Category | Core | Adjacent | Total | Primary value |
| --- | ---: | ---: | ---: | --- |
| Code review, static analysis & clean-code practices | 5 | 26 | 31 | PR review, static analysis, linting, refactoring, maintainability, technical-debt, clean-code, and SOLID-related workflows. |
| Quality assurance, testing & verification | 1 | 23 | 24 | Test automation, unit/integration/E2E testing, coverage, regression testing, contract testing, and quality gates. |
| Project management, planning & delivery coordination | 12 | 42 | 54 | Projects, issues, tasks, roadmaps, sprint planning, work management, and delivery coordination. |
| Agent orchestration, workflow control & coordination | 48 | 151 | 199 | Reusable multi-agent coordination, planning, task delegation, graph/workflow execution, and control systems. |
| Agent observability, evaluation, safety & governance | 3 | 5 | 8 | Agent/LLM tracing, metrics, evaluations, prompt-injection defenses, guardrails, safety, and governance. |
| Analytics, product intelligence & engineering metrics | 8 | 21 | 29 | Product, web, developer, telemetry, business, and engineering-metrics analytics platforms. |
| Security hardening, application security & DevSecOps | 3 | 16 | 19 | Defensive AppSec, DevSecOps, vulnerability and secret scanning, supply-chain security, hardening, and policy tooling. |
| OSINT, threat intelligence & defensive reconnaissance | 1 | 13 | 14 | Passive/public-source intelligence, threat intelligence, exposure awareness, security research, and defensive reconnaissance. |
| Specification-driven design, requirements & API contracts | 4 | 35 | 39 | Spec-driven development, requirements engineering, API contracts, OpenAPI/AsyncAPI, BDD/TDD, and contract testing. |
| CI/CD, developer productivity & engineering operations | 7 | 28 | 35 | CI/CD, build and release automation, developer portals, developer experience, and engineering operations. |

## Complete Categorized Catalog

Within each category, **Core** repositories appear first, followed by **Adjacent** repositories. Entries are ordered by signal confidence and then by the source star snapshot. [1]

### Code review, static analysis & clean-code practices

PR review, static analysis, linting, refactoring, maintainability, technical-debt, clean-code, and SOLID-related workflows.

#### Core (5)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [archlint](https://github.com/archlinter/archlint) | Archlint is a fast, Rust-based static analysis tool designed to detect and prevent architectural smells in TypeScript and JavaScript codebases. It add | Rust | 38 |
| [XCodeReviewer](https://github.com/lintsinghua/XCodeReviewer) | XCodeReviewer is an intelligent, LLM-driven platform designed for comprehensive and deep code quality auditing. It moves beyond traditional static ana | — | 0 |
| [skills](https://github.com/BuilderIO/skills) | Skills for coding agents is an open-source collection of reusable skills, packaged in the standardized Skill format, that extend the capabilities of A | JavaScript | 3,878 |
| [Mago](https://github.com/carthage-software/mago) | Mago is a comprehensive toolchain for PHP, engineered in Rust to provide developers with a superior coding experience. It functions as an extremely fa | Rust | 3,015 |
| [CodeVibes](https://github.com/danish296/codevibes) | CodeVibes is an intelligent, AI-powered tool designed to enhance the quality and security of GitHub repositories. It scans codebases to identify secur | TypeScript | 61 |

#### Adjacent (26)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [code-review-graph](https://github.com/tirth8205/code-review-graph) | code-review-graph is a local knowledge graph designed to optimize how AI coding assistants interact with large codebases. It addresses the token probl | Python | 27,912 |
| [OpenCodeReview](https://github.com/alibaba/open-code-review) | OpenCodeReview is an AI-powered command-line code review tool developed by Alibaba that processes Git diffs via a configurable LLM agent to produce pr | Go | 17,074 |
| [Pyrefly](https://github.com/facebook/pyrefly) | PyreFly. Static analysis and type checking tool for Python | Rust | 6,715 |
| [OpenAgentsControl](https://github.com/darrenhinde/OpenAgentsControl) | AI agent framework for plan-first development workflows with approval-based execution. Multi-language support (TypeScript, Python, Go, Rust) with auto | TypeScript | 4,736 |
| [pi-subagents](https://github.com/nicobailon/pi-subagents) | pi-subagents is a Pi extension that enables asynchronous delegation to focused child agents (scout, researcher, planner, worker, reviewer, oracle, etc | TypeScript | 2,815 |
| [rendergit](https://github.com/karpathy/rendergit) | Rendergit is a Python utility designed to flatten complex GitHub repositories into a single, static HTML page for easy viewing and analysis. It simpli | Python | 2,215 |
| [OpenReview](https://github.com/vercel-labs/openreview) | OpenReview is an open-source, self-hosted AI code review bot designed to automate the process of reviewing GitHub Pull Requests. Deployed via Vercel, | TypeScript | 1,345 |
| [critique](https://github.com/remorses/critique) | Critique is a TypeScript-based Terminal User Interface (TUI) designed for reviewing complex Git changes efficiently. It provides a visually enhanced d | TypeScript | 1,148 |
| [JS Analyzer](https://github.com/jenish-sojitra/JSAnalyzer) | JS Analyzer is a powerful Burp Suite extension designed for static analysis of JavaScript code to uncover sensitive information. It automatically extr | Python | 1,140 |
| [Gentleman Guardian Angel](https://github.com/Gentleman-Programming/gentleman-guardian-angel) | Gentleman Guardian Angel (GGA) is a provider-agnostic tool designed for AI-powered code review, helping developers enforce coding standards across the | Shell | 961 |
| [fabro](https://github.com/fabro-sh/fabro) | Fabro is an open-source dark software factory written in Rust, designed to provide expert engineers with controlled management of unpredictable AI cod | Rust | 681 |
| [multiclaude](https://github.com/dlorenc/multiclaude) | multiclaude is a Go-based orchestration tool that spawns multiple autonomous Claude Code AI agents to work on a codebase concurrently, inspired by the | Go | 562 |
| [diffity](https://github.com/kamranahmedse/diffity) | Diffity is an agent-agnostic tool designed for reviewing code changes in a GitHub-style format. It functions as a powerful diff viewer, allowing users | TypeScript | 557 |
| [tuicr](https://github.com/agavra/tuicr) | tuicr is a Rust-based terminal user interface designed to facilitate code review, particularly for AI-generated diffs. It functions as a GitHub-style | Rust | 527 |
| [ChernyCode](https://github.com/meleantonio/ChernyCode) | provides a template for implementing Boris Cherny's productivity strategies for AI-assisted coding using Claude Code and Cursor. It synthesizes his re | — | 486 |
| [Lightron](https://github.com/lwj2015/lightron) | Lightron is a lightweight, modern distributed training framework designed for research and study of Large Language Models (LLMs). It aims to bridge th | Python | 464 |
| [git-memento](https://github.com/mandel-macaque/memento) | `git-memento` is a Git extension designed to record and attach the AI coding session transcripts used to create a specific commit. It addresses the ch | F# | 440 |
| [Tylax](https://github.com/scipenai/tylax) | Tylax is a high-performance, bi-directional converter written in Rust that facilitates seamless conversion between LaTeX and Typst formats. It special | Rust | 342 |
| [adamsreview](https://github.com/adamjgmiller/adamsreview) | Multi-lens code review pipeline for Claude Code: deep review (Claude or Codex), auto-fix loop, interactive walkthrough, external-finding injection. | Shell | 237 |
| [Codra](https://github.com/devarshishimpi/codra) | Self-hosted AI code review for GitHub pull requests, built on Cloudflare Workers. | TypeScript | 45 |
| [TideScope](https://github.com/unitagain/TideScope) | TideScope is an AI-powered open-source collaboration tool designed to simplify open-source contributions and technical debt management. It utilizes an | Python | 25 |
| [malhaus](https://github.com/toorandom/malhaus) | Malhaus is a self-hosted platform designed for static triage and analysis of suspicious files and URLs using Large Language Models (LLMs). It operates | Python | 18 |
| [Zen MCP](https://github.com/BeehiveInnovations/zen-mcp-server) | Zen MCP implements the PAL MCP, a Model Context Protocol server designed to abstract AI providers and connect various models to developer tools. It su | — | 0 |
| [Using GitHub Copilot code review](https://github.com/en/copilot) | GitHub Docs | — | 0 |
| [spec-gen](https://github.com/clay-good/spec-gen) | Automate the reverse-engineering of your codebase into structured OpenSpec specifications using static analysis and LLM-powered generation to extract | — | 0 |
| [Embabel Agent Framework](https://github.com/embabel/embabel-agent) | Embabel Agent Framework is a JVM-based framework for building agentic flows that seamlessly blend LLM-prompted interactions with conventional code and | — | 0 |

### Quality assurance, testing & verification

Test automation, unit/integration/E2E testing, coverage, regression testing, contract testing, and quality gates.

#### Core (1)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [testsprite-cli](https://github.com/TestSprite/testsprite-cli) | TestSprite CLI is an AI-powered automated testing tool that brings end-to-end verification directly into the terminal and coding agent workflows. It s | TypeScript | 2,731 |

#### Adjacent (23)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [gstack](https://github.com/garrytan/gstack) | gstack is a comprehensive set of 23 TypeScript tools designed to function as a virtual engineering team, enabling a single developer to ship products | TypeScript | 125,764 |
| [Cypress](https://github.com/cypress-io/cypress) | teams build reliable end-to-end testing pipelines, and Strands Shell brings AI agent capabilities directly into terminal environments | TypeScript | 50,978 |
| [Nanobrowser](https://github.com/nanobrowser/nanobrowser) | Open-Source Chrome extension for AI-powered web automation. Run multi-agent workflows using your own LLM API key. Alternative to OpenAI Operator. | TypeScript | 13,567 |
| [playwright-cli](https://github.com/microsoft/playwright-cli) | CLI for common Playwright actions. Record and generate Playwright code, inspect selectors and take screenshots. | JavaScript | 12,593 |
| [Expect](https://github.com/millionco/expect) | Expect is a skill designed to perform automated testing of agent code within a real browser environment. It hooks into existing AI agents (like Claude | TypeScript | 3,372 |
| [loopy](https://github.com/Forward-Future/loopy) | Loopy is a companion skill and public catalog for building repeatable AI-agent workflows called "loops"—structured playbooks that pair an action with | JavaScript | 2,940 |
| [HeadlessX](https://github.com/saifyxpro/HeadlessX) | The undetected self-hosted browser automation platform. Powered by Camoufox (Firefox) for 0% detection rates. Built for speed, privacy, and scalabilit | TypeScript | 2,240 |
| [yoyo](https://github.com/yologdev/yoyo-evolve) | Yoyo is a self-evolving AI coding agent written in Rust that autonomously writes, refactors, and improves its own source code. It operates as a coding | Rust | 1,615 |
| [claude-code-sub-agent-collective](https://github.com/vanzan01/claude-code-sub-agent-collective) | 🧠 Context Engineering Research - Not just another agent collection, but using research and context engineering to function as a collective. Hub-and-sp | JavaScript | 523 |
| [LeronX Engine](https://github.com/Leron-X/leronx) | LeronX Engine is an open-source Python framework that automates the end-to-end conversion of text prompts into rendered videos, eliminating the need f | Python | 518 |
| [token-diet](https://github.com/Kulaxyz/token-diet) | token-diet is an always-on prompt-engineering skill that reduces token usage for AI coding agents — Claude Code, Codex, Cursor, Windsurf, and Cline — | Shell | 514 |
| [Pheromind](https://github.com/ChrisRoyse/Pheromind) | Pheromind is a framework for autonomous software development that uses swarm intelligence—inspired by ant colony stigmergy—to coordinate specialized A | JavaScript | 379 |
| [context-ontology-accelerator](https://github.com/aws/context-ontology-accelerator) | Context Ontology Accelerator is an open-source semantic context layer for AWS that combines knowledge graphs, formal ontologies, and rule-based system | Python | 318 |
| [kaizen](https://github.com/Cloud-Code-AI/kaizen) | AI powered tool to help software teams with Quality Assurance | Python | 304 |
| [SmallClaw](https://github.com/XposeMarket/SmallClaw) | SmallClaw is a local-first AI agent framework designed to run powerful AI agents on local hardware, supporting both local-only and hybrid cloud setups | TypeScript | 234 |
| [Certificate Inspector](https://github.com/shanselman/cert-inspector) | Certificate Inspector is a web-based tool designed to perform deep inspection of SSL certificates and DNS records for every domain loaded by a webpage | JavaScript | 213 |
| [marketing-studio](https://github.com/ucsandman/marketing-studio) | Marketing Studio is an agent-driven Claude Code skill that turns a single `/marketing` command into a full marketing asset suite for any product. Solv | JavaScript | 202 |
| [extract-design-system](https://github.com/arvindrk/extract-design-system) | Extract design tokens (colors, typography, spacing, border radius, shadows) from any public website. Generates JSON and CSS custom properties for loca | TypeScript | 182 |
| [AutoPage](https://github.com/AutoLab-SAI-SJTU/AutoPage) | AutoPage is a human-agent collaborative system designed for transforming academic papers into polished, published-ready project webpages. It addresses | HTML | 165 |
| [Next-Elite](https://github.com/salmanshahriar/Next-Elite) | An open source production-ready Next.js starter kit: frontend-first + api-driven, next.js 16 + react 19, better-auth, rbac, i18n, shadcn, tailwind v4, | TypeScript | 106 |
| [QApilot's CoWork](https://github.com/qapilot.io/qapilot-s-cowork) | QApilot Cowork is a collaborative AI workspace for software quality assurance that helps teams manage testing workflows and quality activities togethe | — | 0 |
| [MiniStack](https://github.com/Nahuel990/ministack) | MiniStack is a free, open-source local AWS emulator designed for local development and CI/CD pipelines. It simulates over 40 AWS services on a single | — | 0 |
| [jungle-trail](https://github.com/StarKnightt/jungle-trail) | Jungle Trail is a first-person Three.js walk down a 423.8 m jungle path ending at overgrown stone ruins and a waterfall, built entirely from procedura | — | 0 |

### Project management, planning & delivery coordination

Projects, issues, tasks, roadmaps, sprint planning, work management, and delivery coordination.

#### Core (12)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [OpenProject](https://github.com/opf/openproject) | OpenProject is a leading open-source, web-based project management software designed to empower teams in managing projects, tasks, and goals. Built pr | Ruby | 14,856 |
| [Leantime](https://github.com/Leantime/leantime) | Leantime is an open-source, goals-focused project management system designed specifically for non-project managers. It combines strategy, planning, an | PHP | 9,517 |
| [4gaBoards](https://github.com/RARgames/4gaBoards) | 4ga Boards is a real-time Kanban-style project management application designed to streamline task tracking and team collaboration through an intuitive | JavaScript | 685 |
| [Taskosaur](https://github.com/Taskosaur/Taskosaur) | Taskosaur is an open-source project management platform that integrates Conversational AI for streamlined task execution. It allows teams to manage pr | TypeScript | 459 |
| [Kaneo](https://github.com/usekaneo/kaneo) | Kaneo is an open-source, self-hosted project management platform built on the philosophy that "less is more," providing essential tools without the bl | TypeScript | 5,728 |
| [beads_viewer](https://github.com/Dicklesworthstone/beads_viewer) | Beads Viewer (bv) is a Go-based, graph-aware Terminal User Interface (TUI) designed to provide deep insights into the Beads issue tracker. It transfor | Go | 1,467 |
| [ClawPort](https://github.com/JohnRiceML/clawport-ui) | ClawPort is an open-source, TypeScript-based command center designed for managing and monitoring AI agent teams built on the OpenClaw framework. It se | TypeScript | 842 |
| [Veritas Kanban](https://github.com/BradGroux/veritas-kanban) | Veritas Kanban is a local-first orchestration platform designed for developers operating in the agentic AI era. It provides a visual Kanban board that | TypeScript | 641 |
| [Kandev](https://github.com/kdlbs/kandev) | Kandev is a self-hostable AI kanban and development environment that lets power users orchestrate multiple AI coding agents in parallel, review their | Go | 522 |
| [scrumboy](https://github.com/markrai/scrumboy) | Self-hosted kanban & project management with shareable boards, voice commands, sticky-notes, multi-language and MCP support | TypeScript | 351 |
| [asana-clone](https://github.com/iggy-tech/asana-clone) | A clone of the Asana project management application, built with Next.js to replicate core task and team workflow functionality. It enables users to or | TypeScript | 25 |
| [Doppelganger](https://github.com/mnemosyne-artificial-intelligence/doppelganger) | Figranium is a self-hosted, block-first automation control plane designed for predictable and auditable browser workflows. It allows teams to build co | — | 0 |

#### Adjacent (42)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [kestra](https://github.com/kestra-io/kestra) | Orchestrate everything - from scripts to data, infra, AI, and business - as code, with UI and AI Copilot. Simple. Fast. Scalable. | Java | 27,841 |
| [vibe-Kanban](https://github.com/BloopAI/vibe-kanban) | Kanban board to manage your AI coding agents | Rust | 27,831 |
| [platform](https://github.com/hcengineering/platform) | Huly — All-in-One Project Management Platform (alternative to Linear, Jira, Slack, Notion, Motion) | TypeScript | 27,369 |
| [opcode](https://github.com/winfunc/opcode) | Opcode is a powerful desktop application and toolkit designed to enhance the interaction with Claude Code through a visual interface. Built with Tauri | TypeScript | 21,566 |
| [Ubicloud](https://github.com/ubicloud/ubicloud) | Ubicloud is an open-source alternative to proprietary cloud providers, offering Infrastructure-as-a-Service (IaaS) features on bare-metal hardware. It | Ruby | 12,011 |
| [Meshery](https://github.com/meshery/meshery) | Meshery platform for cloud and Kubernetes management. Meshery is an open-source cloud-native management platform that helps teams operate Kubernetes, | TypeScript | 11,494 |
| [komodo](https://github.com/moghtech/komodo) | Komodo is a self-hosted control plane for all of it. Connect your machines, manage Docker stacks and containers, trigger builds, and watch everything | Rust | 11,483 |
| [openship](https://github.com/oblien/openship) | Openship is an open-source, self-hostable deployment platform that streamlines the process of building, shipping, routing, and serving applications wi | TypeScript | 10,039 |
| [Omnigent](https://github.com/omnigent-ai/omnigent) | Omnigent is an open-source meta harness that controls and combines tools like Claude Code and Codex in one place. Users can set strict budget caps, ru | Python | 7,992 |
| [Vikunja](https://github.com/go-vikunja/vikunja) | The to-do app to organize your life. | Go | 5,080 |
| [LoopX](https://github.com/huangruiteng/loopx) | LoopX is an open, provider-neutral control plane designed to make long-running AI agent work reviewable, restartable, and governable across multiple t | Python | 4,859 |
| [Automaker](https://github.com/AutoMaker-Org/automaker) | Automaker is an autonomous AI development studio that lets users build entire features by describing them on a Kanban board while AI agents handle the | TypeScript | 3,213 |
| [ReUI](https://github.com/keenthemes/reui) | ReUI is a free, open-source component library and design platform that extends the shadcn/ui ecosystem with 1,000+ production-ready patterns displayed | TypeScript | 3,196 |
| [Observal](https://github.com/Observal/Observal) | Observal is a self-hosted control plane and system of record for internal AI components, addressing the discoverability and feedback gaps that cause o | Python | 2,251 |
| [App Store Screenshot Generator](https://github.com/YUZU-Hub/appscreen) | The App Store Screenshot Generator is a free, open-source JavaScript tool designed to create professional and customizable screenshots for the iOS App | JavaScript | 1,601 |
| [OpenSquirrel](https://github.com/Infatoshi/OpenSquirrel) | For people who get distracted by agents. A native Rust/GPUI control plane for running Claude Code, Codex, Cursor, and OpenCode side by side — because | Rust | 1,364 |
| [OpenOPC](https://github.com/HKUDS/OpenOPC) | OpenOPC is a Python-based framework that enables users to build and operate a personal AI-native company through three core mechanisms: Self-Built aut | Python | 1,032 |
| [project-dashboard](https://github.com/Jason-uxui/project-dashboard) | is a modern, opinionated project management dashboard UI built using Next.js, TypeScript, and Tailwind CSS. It serves as a real-world template designe | TypeScript | 990 |
| [Flawless](https://github.com/William-Lu-stack/Flawless) | Flawless is an AI-native SRE control plane that transforms Kubernetes and cloud infrastructure management by connecting alerts, evidence collection, t | Python | 859 |
| [ticket](https://github.com/wedow/ticket) | `ticket` is a fast, powerful, git-native issue tracker implemented as a single bash script, designed for managing complex task dependencies. It is roo | Shell | 730 |
| [GodotHub](https://github.com/RykoTheDev/GodotHub) | GodotHub is an all-in-one project management application for the Godot Engine that combines project organization, version control, and engine manageme | TypeScript | 684 |
| [Claude Task Viewer](https://github.com/L1AD/claude-task-viewer) | The Claude Task Viewer is a real-time, web-based Kanban board designed for observing and managing tasks generated by Claude Code. It provides a visual | HTML | 563 |
| [Cordum](https://github.com/cordum-io/cordum) | Cordum is an open-source Agent Control Plane designed to provide deterministic governance, safety, and trust for autonomous AI agents. It addresses th | Go | 465 |
| [Re-Start](https://github.com/refact0r/re-start) | Re-Start is a lightweight, tui-style browser startpage built using Svelte, designed to enhance the user's immediate browsing experience. It serves as | Svelte | 402 |
| [sencho](https://github.com/Studio-Saelix/sencho) | Sencho is a self-hosted control plane that manages an entire Docker fleet from a single dashboard. Unlike many tools, it does not capture compose file | TypeScript | 373 |
| [polaris](https://github.com/code-with-antonio/polaris) | Polaris is an open-source, browser-based cloud IDE designed as a Cursor AI alternative, addressing the need for an AI-powered coding environment witho | TypeScript | 361 |
| [Autonomous-Forge](https://github.com/OmarH-creator/Autonomous-Forge) | Autonomous-Forge is a local-first Python command-line tool that guides a maintainer or AI-assisted workflow through a controlled, reviewable maintenan | Python | 251 |
| [Lazy_Bird](https://github.com/yusufkaraaslan/lazy-bird) | Lazy_Bird is a progressive automation system designed to accelerate development workflows by enabling autonomous project management. It functions as a | Python | 224 |
| [OpticalModeler](https://github.com/k-telux/OpticalModeler) | OpticalModeler is an evidence-gated Agent Skill that converts 2D photonics schematics into physically auditable 3D optical tables inside Blender. It t | Python | 211 |
| [Agent-Execution-Partnership](https://github.com/eli-labz/Agent-Execution-Partnership) | Agent Execution Partnership (AEE) is an open-source control plane that sits between AI reasoning models and real-world execution, ensuring every agent | Python | 205 |
| [Claude Code Voice](https://github.com/abracadabra50/claude-code-voice-skill) | Claude Code Voice is a Python-based skill that enables developers to have real-time voice conversations with Claude Opus about their code projects. It | Python | 161 |
| [vibephp](https://github.com/mnapoli/vibephp) | VibePHP is a satirical PHP runtime that replaces traditional interpretation and compilation with an LLM-based agent that "reads" PHP source code, simu | PHP | 154 |
| [contextvc](https://github.com/HaochengLu/contextvc) | ContextVC (`ctx`) is a Git-native context control plane that turns agent memory into versioned, reviewable repository infrastructure rather than scatt | Rust | 145 |
| [AgentOS](https://github.com/SapienXai/AgentOS) | Run agents like a company. AgentOS is the native control plane for OpenClaw — manage agents, tasks, models, context, approvals, and runtime visibility | TypeScript | 89 |
| [claude-code-web](https://github.com/sunpix/claude-code-web) | A web-based interface for Claude Code CLI built with Nuxt 4, featuring real-time chat, project management, and comprehensive tool integration with mob | — | 75 |
| [AutoSteer](https://github.com/notch-ai/autosteer) | AutoSteer is a desktop application built with Electron designed to enhance the Claude Code experience through advanced multi-workspace management. It | TypeScript | 66 |
| [nextjs-trello-clone](https://github.com/code-with-antonio/nextjs-trello-clone) | A fullstack Trello clone built with Next.js 14 that replicates the core project management experience, including workspaces, boards, lists, and cards | TypeScript | 13 |
| [zsvirt](https://github.com/ZSvirt/zsvirt) | ZSvirt is an open-source virtualization platform that brings the enterprise-proven ZSphere engine from ZStack into the community, offering a lightweig | — | 0 |
| [Troopr AI Scrum Master](https://github.com/troopr.ai/troopr-ai-scrum-master) | Troopr AI Scrum Master is a Slack-native assistant that automates the day-to-day ceremonies of an Agile team without leaving the chat workspace. It ca | — | 0 |
| [Bevel](https://github.com/bevel.software/bevel) | Bevel is the company behind the Git Control Plane, an open-source agent runtime designed to bring deterministic, observable, and sandboxed AI agents i | — | 0 |
| [AionUi](https://github.com/office-sec/AionUi) | Free, local, open-source GUI app for Gemini CLI — Enhance Chat Experience, Multi-tasking, Code Diff View, File & Project Management, and more \| 🌟 Star | — | 0 |
| [Agent Commands](https://github.com/mitsuhiko/agent-commands) | provides a collection of skills and custom extensions designed for an AI agent workflow. It includes diverse skills enabling interaction with external | — | 0 |

### Agent orchestration, workflow control & coordination

Reusable multi-agent coordination, planning, task delegation, graph/workflow execution, and control systems.

#### Core (48)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [500+ AI Agent Projects](https://github.com/ashishpatel26/500-AI-Agents-Projects) | is a curated collection of over 500 practical use cases for developing AI agents across various industries. It showcases how AI agents are transformin | — | 28,593 |
| [Praison AI](https://github.com/MervinPraison/PraisonAI) | PraisonAI application combines AutoGen and CrewAI or similar frameworks into a low-code solution for building and managing multi-agent LLM systems, fo | Python | 8,908 |
| [skills](https://github.com/davidondrej/skills) | A curated collection of reusable Agent Skills designed to extend AI coding, research, and workflow agents with focused, task-specific instructions. Ea | Shell | 2,728 |
| [Octopoda-OS](https://github.com/RyjoxTechnologies/Octopoda-OS) | The open-source memory operating system for AI agents. Persistent memory, semantic search, loop detection, agent messaging, crash recovery, and real-t | Python | 347 |
| [freecodecamp-multi-agent-ai-system](https://github.com/sandeepmb/freecodecamp-multi-agent-ai-system) | A production-grade, fully local multi-agent AI system that demonstrates how to orchestrate specialized agents for personalized learning without relyin | Python | 112 |
| [DeerFlow - 2.0](https://github.com/bytedance/deer-flow) | An open-source long-horizon SuperAgent harness that researches, codes, and creates. With the help of sandboxes, memories, tools, skill, subagents and | Python | 80,171 |
| [oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode) | oh-my-claudecode is a TypeScript-based framework designed for multi-agent orchestration specifically tailored for Claude Code. It simplifies complex c | TypeScript | 29,716 |
| [Symphony](https://github.com/openai/symphony) | Symphony, multi-agent orchestration framework for AI systems. Symphony is an open-source framework that coordinates multiple AI agents working togethe | Elixir | 26,717 |
| [haystack](https://github.com/deepset-ai/haystack) | :mag: LLM orchestration framework to build customizable, production-ready LLM applications. Connect components (models, vector DBs, file converters) t | Python | 26,234 |
| [AgentScope](https://github.com/agentscope-ai/agentscope) | AgentScope is a production-ready framework designed to build, run, and manage agents that are visible, understandable, and trustworthy. It provides es | Python | 23,965 |
| [swarm](https://github.com/openai/swarm) | Educational framework exploring ergonomic, lightweight multi-agent orchestration. Managed by OpenAI Solution team. | Python | 21,909 |
| [LangChain.js](https://github.com/langchain-ai/langchainjs) | LangChain.js is a framework designed for building sophisticated, LLM-powered applications by providing a standard interface for chaining together inte | TypeScript | 17,516 |
| [Agent Lightning](https://github.com/microsoft/agent-lightning) | Agent Lightning is a framework designed to optimize and train AI agents, serving as the absolute trainer for agentic AI systems. It enables users to o | Python | 16,937 |
| [OpenMAIC](https://github.com/THU-MAIC/OpenMAIC) | OpenMAIC is an open-source AI platform designed to create immersive, multi-agent interactive classroom experiences. It transforms any topic or documen | TypeScript | 15,887 |
| [Microsoft Agent Framework](https://github.com/microsoft/agent-framework) | A framework for building, orchestrating and deploying AI agents and multi-agent workflows with support for Python and .NET. | Python | 12,857 |
| [Eino](https://github.com/cloudwego/eino) | Eino is a comprehensive LLM and AI application development framework built in Go, designed to simplify the creation of sophisticated AI systems. It dr | Go | 10,710 |
| [Spring AI Alibaba](https://github.com/alibaba/spring-ai-alibaba) | Spring AI Alibaba is a production-ready framework designed for Java developers to build sophisticated Agentic, Workflow, and Multi-agent applications. | Java | 9,297 |
| [agentops](https://github.com/AgentOps-AI/agentops) | Python SDK for agent monitoring, LLM cost tracking, benchmarking, and more. Integrates with most LLMs and agent frameworks like CrewAI, Langchain, and | Python | 5,779 |
| [BeeAI Framework](https://github.com/i-am-bee/beeai-framework) | The BeeAI Framework is a comprehensive framework designed for building production-ready multi-agent systems using Large Language Models (LLMs). It pro | Python | 3,220 |
| [tutti](https://github.com/tutti-os/tutti) | Tutti is an open-source, real-time shared workspace that lets people and AI agents collaborate on multi-step workflows without manual context handoffs | TypeScript | 3,202 |
| [mobile-use](https://github.com/minitap-ai/mobile-use) | Mobile-use is an open-source AI agent framework designed to enable AI agents to control Android and iOS devices using natural language commands. It fa | Python | 2,447 |
| [AI SDK Tools](https://github.com/midday-ai/ai-sdk-tools) | The AI SDK Tools repository provides essential, production-ready utilities for building sophisticated AI applications using the Vercel AI SDK. It offe | TypeScript | 2,048 |
| [ClaudeKit Skills](https://github.com/mrgoonie/claudekit-skills) | ClaudeKit Skills provides a comprehensive set of specialized workflows, or Agent Skills, designed to empower Claude to execute complex, multi-step tas | Python | 1,995 |
| [langgraph-swarm-py](https://github.com/langchain-ai/langgraph-swarm-py) | For your multi-agent needs | Python | 1,554 |
| [AutoGroq](https://github.com/jgravelle/AutoGroq) | AutoGroq is a groundbreaking tool that revolutionizes the way users interact with Autogen™ and other AI assistants. By dynamically generating tailored | Python | 1,503 |
| [zeroshot CLI](https://github.com/covibes/zeroshot) | Zeroshot is an open-source AI coding agent orchestration CLI designed to automate complex software engineering tasks. It runs multi-agent workflows, i | JavaScript | 1,412 |
| [Agentic Coding Flywheel Setup (ACFS)](https://github.com/Dicklesworthstone/agentic_coding_flywheel_setup) | The Agentic Coding Flywheel Setup (ACFS) is a complete system designed to bootstrap a fresh Ubuntu VPS into a professional, multi-agent AI development | TypeScript | 1,393 |
| [sol-advisor](https://github.com/DannyMac180/sol-advisor) | Sol Advisor is a Codex-native architect workflow that keeps a primary Sol / High session focused on requirements, architecture, specs, and verificatio | Shell | 1,375 |
| [ClawTeam-OpenClaw](https://github.com/win4r/ClawTeam-OpenClaw) | ClawTeam-OpenClaw is a framework designed for multi-agent swarm coordination, enabling AI agents to autonomously manage complex tasks. It facilitates | Python | 1,283 |
| [Overstory](https://github.com/jayminwest/overstory) | Overstory is a TypeScript-based framework designed for multi-agent orchestration of AI coding agents. It transforms a single coding session into a coo | TypeScript | 1,222 |
| [tribe](https://github.com/StreetLamb/tribe) | Low code tool to rapidly build and coordinate multi-agent teams | TypeScript | 1,081 |
| [n-skills](https://github.com/numman-ali/n-skills) | n-skills is a curated plugin marketplace designed to provide universal skills for diverse AI coding agents. It operates on the philosophy of "Write on | TypeScript | 974 |
| [voicetree](https://github.com/voicetreelab/voicetree) | The spatial IDE for recursive multi-agent orchestration. | TypeScript | 912 |
| [agent-development-kit-crash-course](https://github.com/bhancockio/agent-development-kit-crash-course) | A hands-on crash course for Google's Agent Development Kit (ADK), designed to help developers build LLM-powered agents through progressive, example-dr | Python | 894 |
| [homerail](https://github.com/xiaotianfotos/homerail) | HomeRail is a TypeScript runtime that turns one-off agent conversations into auditable, reusable workflows on personal homelab hardware. It addresses | TypeScript | 792 |
| [agent-swarm](https://github.com/desplega-ai/agent-swarm) | Your Company Agentic Operating System | TypeScript | 704 |
| [agent-relay](https://github.com/AgentWorkforce/relay) | AgentRelay is a framework designed for real-time communication and collaboration between AI agents. It provides an SDK in TypeScript and Python, allow | TypeScript | 615 |
| [Agentic Data Scientist](https://github.com/K-Dense-AI/agentic-data-scientist) | Agentic Data Scientist is an open-source, end-to-end framework designed to tackle complex data science tasks using a sophisticated multi-agent workflo | Python | 607 |
| [pilotfish](https://github.com/Nanako0129/pilotfish) | Pilotfish is a multi-model orchestration layer for Claude Code that routes high-volume, mechanical work (searches, edits, tests, doc updates) to cheap | Python | 561 |
| [Citadel](https://github.com/SethGammon/Citadel) | Citadel is an agent orchestration harness designed to manage and scale complex AI engineering tasks using models like Claude Code and OpenAI Codex. It | JavaScript | 504 |
| [openpoke](https://github.com/shlokkhemani/openpoke) | OpenPoke is an open-source project that provides a simplified, local implementation of an assistant inspired by Poke, designed to demonstrate multi-ag | Python | 469 |
| [Roam](https://github.com/Cranot/roam-code) | Roam is an architectural intelligence layer designed to provide structural understanding for AI coding agents by pre-indexing codebases into a semanti | Python | 450 |
| [readwren](https://github.com/muratcankoylan/readwren) | WREN is an adaptive multi-agent system designed to extract a user's literary DNA through conversational interviews. It solves the challenge of articul | Python | 197 |
| [collective-intelligence](https://github.com/ailinone/collective-intelligence) | Ailin¹ Collective Intelligence is an open-source engine that coordinates 76,636 AI models through 32 coordination strategies, applying structured dive | TypeScript | 170 |
| [agentic-os](https://github.com/modimihir07/agentic-os) | Agentic OS: Multi-agent orchestration platform for opencode, Hermes & Gemini CLI. Skills hub, scheduler, cost analytics, memory & backup. | JavaScript | 144 |
| [gallama](https://github.com/remichu-ai/gallama) | gallama is an opinionated Python library that provides an LLM inference API service backend optimized for local agentic tasks, focusing on model servi | Python | 137 |
| [Open Computer Use](https://github.com/LLmHub-dev/open-computer-use) | Open Computer Use is an open-source platform enabling AI agents to autonomously control computer systems. It provides agents with the capability to pe | — | 0 |
| [Agently](https://github.com/agently.dev/agently) | Agently is an AI-driven company brain designed to sit across a team's existing tools and run the operational stack that holds a business together. It | — | 0 |

#### Adjacent (151)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [langflow](https://github.com/langflow-ai/langflow) | Langflow is a powerful tool for building and deploying AI-powered agents and workflows. | Python | 153,367 |
| [Awesome LLM Apps](https://github.com/Shubhamsaboo/awesome-llm-apps) | Awesome LLM Apps is a comprehensive repository offering over 100 ready-to-run templates for building AI applications. It serves as a cookbook of self- | Python | 129,615 |
| [TradingAgents](https://github.com/TauricResearch/TradingAgents) | TradingAgents: Multi-Agents LLM Financial Trading Framework | Python | 89,122 |
| [LobeHub](https://github.com/lobehub/lobehub) | LobeHub is a framework designed to facilitate the creation, collaboration, and evolution of agent teammates, establishing a space for human-agent co-e | TypeScript | 81,013 |
| [MiroFish](https://github.com/666ghj/MiroFish) | MiroFish is a next-generation AI prediction engine built upon a universal swarm intelligence framework. It utilizes multi-agent technology to extract | Python | 71,120 |
| [ruflo](https://github.com/ruvnet/ruflo) | 🌊 The leading agent meta-harness for Claude. Deploy intelligent multi-agent swarms, coordinate autonomous workflows, and build conversational AI syste | TypeScript | 61,721 |
| [AI Hedge Fund](https://github.com/virattt/ai-hedge-fund) | AI hedge fund, multi-agent trading research simulator. AI hedge fund is an open source multi-agent research project that simulates an AI-powered hedge | Python | 60,558 |
| [autogen](https://github.com/microsoft/autogen) | A programming framework for agentic AI | Python | 60,473 |
| [CrewAI](https://github.com/crewAIInc/crewAI) | Framework for orchestrating role-playing, autonomous AI agents. By fostering collaborative intelligence, CrewAI empowers agents to work together seaml | Python | 57,216 |
| [Flowise](https://github.com/FlowiseAI/Flowise) | Drag & drop UI to build your customized LLM flow | TypeScript | 55,380 |
| [nanobot](https://github.com/HKUDS/nanobot) | "🐈 nanobot: The Ultra-Lightweight Clawdbot" | Python | 47,103 |
| [BettaFish](https://github.com/666ghj/BettaFish) | 微舆：人人可用的多Agent舆情分析助手，打破信息茧房，还原舆情原貌，预测未来走向，辅助决策！从0实现，不依赖任何框架。 | Python | 42,012 |
| [Agents](https://github.com/wshobson/agents) | Multi-harness agentic plugin marketplace for Claude Code, Codex CLI, Cursor, OpenCode, GitHub Copilot, and Gemini CLI | Python | 38,871 |
| [ChatDev 2.0](https://github.com/OpenBMB/ChatDev) | Create Customized Software using Natural Language Idea (through LLM-powered Multi-Agent Collaboration) | Python | 34,013 |
| [DeepTutor](https://github.com/HKUDS/DeepTutor) | DeepTutor is an agent-native personalized learning assistant designed to facilitate interactive and deep educational experiences. Built primarily in P | Python | 31,648 |
| [ai-agent-book](https://github.com/bojieli/ai-agent-book) | "AI Agents in Depth: Design Principles and Engineering Practice" by 李博杰 (Li Bojie) is a comprehensive open-source book that addresses the gap between | Python | 29,267 |
| [Vibe-Trading](https://github.com/HKUDS/Vibe-Trading) | Vibe-Trading is a personal trading agent designed to help users automate and improve trading workflows. It combines AI with market analysis to provide | Python | 29,020 |
| [Serena](https://github.com/oraios/serena) | a powerful coding agent toolkit providing semantic retrieval and editing capabilities (MCP server & Agno integration) | Python | 28,141 |
| [TradingAgents CN](https://github.com/hsliuping/TradingAgents-CN) | TradingAgents-CN is a multi-agent LLM framework designed for systematic learning and research in Chinese financial analysis. It serves as a platform t | Python | 24,237 |
| [dockge](https://github.com/louislam/dockge) | Dockge is a self-hosted, stack-oriented manager for Docker Compose that simplifies deploying and managing `compose.yaml` files through a reactive web | TypeScript | 23,939 |
| [Dolt](https://github.com/dolthub/dolt) | Dolt is a novel system that merges Git version control with a SQL database, positioning itself as "Git for Data." It allows users to manage data schem | Go | 22,216 |
| [adk-python](https://github.com/google/adk-python) | An open-source, code-first Python toolkit for building, evaluating, and deploying sophisticated AI agents with flexibility and control. | Python | 21,165 |
| [OWL](https://github.com/camel-ai/owl) | 🦉 OWL: Optimized Workforce Learning for General Multi-Agent Assistance in Real-World Task Automation | Python | 20,080 |
| [camel](https://github.com/camel-ai/camel) | 🐫 CAMEL: Finding the Scaling Law of Agents. The first and the best multi-agent framework. https://www.camel-ai.org | Python | 17,598 |
| [rowboat](https://github.com/rowboatlabs/rowboat) | Rowboat is an open-source, local-first AI coworker designed to transform work into an actionable knowledge graph. It connects to personal data, such a | TypeScript | 16,911 |
| [Agent-Skills-for-Context-Engineering](https://github.com/muratcankoylan/Agent-Skills-for-Context-Engineering) | provides a comprehensive collection of Agent Skills focused on context engineering for building production-grade AI agent systems. It addresses the di | Python | 15,147 |
| [Eigent](https://github.com/eigent-ai/eigent) | Eigent is an open-source desktop application designed to unlock exceptional productivity by allowing users to build and manage custom AI workforces. I | TypeScript | 13,639 |
| [AutoResearchClaw](https://github.com/aiming-lab/AutoResearchClaw) | Fully autonomous & self-evolving research from idea to paper. Chat an Idea. Get a Paper. 🦞 | Python | 13,615 |
| [shive](https://github.com/aden-hive/hive) | Hive is a multi-agent execution harness designed to move AI agents from prototypes to production-level business workflows. It provides a zero-setup, m | Python | 10,079 |
| [Astron Agent](https://github.com/iflytek/astron-agent) | Astron Agent is an enterprise-grade, commercial-friendly platform designed for building next-generation SuperAgents and complex AI workflows. Built pr | Java | 9,438 |
| [holaOS](https://github.com/holaboss-ai/holaOS) | Open-source All in One AI agent workspace. Run any agent — Claude Code, Codex — across your tools (100+ integrations + MCP), apps, browser, and files, | TypeScript | 9,205 |
| [Agent Development Kit](https://github.com/google/adk-go) | The Agent Development Kit (ADK) is an open-source, code-first Go toolkit designed for building, evaluating, and deploying sophisticated AI agents. It | Go | 7,593 |
| [TinyTroupe](https://github.com/microsoft/TinyTroupe) | LLM-powered multiagent persona simulation for imagination enhancement and business insights. | Jupyter Notebook | 7,548 |
| [Craft Agents](https://github.com/craft-ai-agents/craft-agents-oss) | Craft Agents is an open-source desktop application that provides a document-centric, agent-native alternative to CLI-based AI workflows, enabling user | TypeScript | 6,985 |
| [MindSearch](https://github.com/InternLM/MindSearch) | 🔍 An LLM-based Multi-agent Framework of Web Search Engine (like Perplexity.ai Pro and SearchGPT) | JavaScript | 6,912 |
| [Pixel Agents](https://github.com/pablodelucca/pixel-agents) | Pixel Agents is a project that transforms multi-agent AI systems into a visual, manageable interface. It allows users to see and interact with AI agen | TypeScript | 6,797 |
| [ROMA](https://github.com/sentient-agi/ROMA) | Recursive-Open-Meta-Agent v0.1 (Beta). A meta-agent framework to build high-performance multi-agent systems. | Python | 5,159 |
| [agency-swarm](https://github.com/VRSEN/agency-swarm) | An opensource agent orchestration framework built on top of the latest OpenAI Assistants API. | Python | 4,529 |
| [Craft Agents](https://github.com/lukilabs/craft-agents-oss) | Craft Agents, framework for structured multi-agent workflows. Craft Agents is an open source framework for building structured AI agent systems that c | TypeScript | 4,354 |
| [langroid](https://github.com/langroid/langroid) | Harness LLMs with Multi-Agent Programming | Python | 4,099 |
| [Koog](https://github.com/JetBrains/koog) | Koog is a Kotlin-based framework designed for building predictable, fault-tolerant, and enterprise-ready AI agents across multiple platforms, includin | Kotlin | 4,084 |
| [Claude Code Hooks Mastery](https://github.com/disler/claude-code-hooks-mastery) | provides a framework for mastering Claude Code hooks, enabling deterministic control over Claude's behavior through agent orchestration. It demonstrat | Python | 3,529 |
| [DeepResearchAgent](https://github.com/SkyworkAI/DeepResearchAgent) | DeepResearchAgent is a hierarchical multi-agent system designed not only for deep research tasks but also for general-purpose task solving. The framew | Python | 3,518 |
| [Dimos](https://github.com/dimensionalOS/dimos) | Dimos is an agentic operating system designed for generalist robotics, serving as the next-generation SDK standard for physical space. It enables the | Python | 2,979 |
| [brigade](https://github.com/spinabot/brigade) | Brigade — Your personal intelligence, built enterprise-grade | TypeScript | 2,812 |
| [ScreenCoder](https://github.com/leigest519/ScreenCoder) | ScreenCoder is an intelligent system designed to transform any UI screenshot or design mockup into clean, editable HTML and CSS code. It utilizes a mo | Python | 2,639 |
| [firstmate](https://github.com/kunchenguid/firstmate) | firstmate is an agent distribution for running a crew of AI coding agents through a single liaison interface. It addresses the tab-juggling problem de | Shell | 2,555 |
| [ouroboros](https://github.com/Q00/ouroboros) | Ouroboros is a specification-first workflow engine designed to guide AI coding agents from vague ideas to verified, working codebases. It addresses th | Python | 2,417 |
| [LLMStack](https://github.com/trypromptly/LLMStack) | No-code multi-agent framework to build LLM Agents, workflows and applications with your data | Python | 2,309 |
| [AgentsMesh](https://github.com/AgentsMesh/AgentsMesh) | The AI Agent Workforce Platform. Run a hundred AI coding agents across your own machines — schedule, isolate, and steer them all from one console. | Go | 2,242 |
| [Paper2Agent](https://github.com/jmiao24/Paper2Agent) | Paper2Agent is a multi-agent AI system designed to automatically transform research papers into interactive AI agents with minimal human intervention. | Jupyter Notebook | 2,170 |
| [harmonist](https://github.com/GammaLabTechnologies/harmonist) | Harmonist is a portable orchestration engine with zero runtime dependencies. Ships with 186 specialized agents | Python | 2,023 |
| [AgentFlow](https://github.com/lupantech/AgentFlow) | AgentFlow: In-the-Flow Agentic System Optimization for Effective Planning and Tool Use | Python | 2,005 |
| [Memoh](https://github.com/memohai/Memoh) | ✨ The open-source multi-agent platform. Every agent gets its own computer, desktop, network, and long-term memory. You can bring your own key, or host | Go | 1,973 |
| [MiroFish-Offline](https://github.com/nikmcfly/MiroFish-Offline) | MiroFish-Offline is a fully local, multi-agent simulation engine designed to model public opinion, market sentiment, and social dynamics. It functions | Python | 1,955 |
| [OneCLI](https://github.com/onecli/onecli) | OneCLI is an open-source credential vault designed to provide secure access to services for AI agents. It acts as a gateway, storing sensitive API key | TypeScript | 1,802 |
| [Coding Agent Template](https://github.com/vercel-labs/coding-agent-template) | Multi-agent AI coding platform powered by Vercel Sandbox and AI Gateway | TypeScript | 1,764 |
| [Code2Video](https://github.com/showlab/Code2Video) | Code2Video is a Python-based framework that establishes a code-centric paradigm for educational video generation. It leverages computational methods t | Python | 1,643 |
| [uAgents at aiagentslive.com](https://github.com/fetchai/uAgents) | A fast and lightweight framework for creating decentralized agents with ease. | Python | 1,636 |
| [claude-code-hooks-multi-agent-observability](https://github.com/disler/claude-code-hooks-multi-agent-observability) | Real-time monitoring for Claude Code agents through simple hook event tracking. | Python | 1,516 |
| [lingbot-world-v2](https://github.com/Robbyant/lingbot-world-v2) | LingBot-World 2.0 (LingBot-World-Infinity) is an interactive world modeling system by the Robbyant Team that generates infinite, real-time video strea | Python | 1,445 |
| [Orchestrator](https://github.com/Danau5tin/multi-agent-coding-system) | Orchestrator is a multi-agent AI coding system designed to perform complex tasks by coordinating specialized explorer and coder agents. It functions a | Python | 1,368 |
| [CrewAI-Studio](https://github.com/strnad/CrewAI-Studio) | A user-friendly, multi-platform GUI for managing and running CrewAI agents and tasks. Supports Conda and virtual environments, no coding needed. | Python | 1,343 |
| [paperbanana](https://github.com/llmsresearch/paperbanana) | PaperBanana is an open-source, agentic framework designed for automating the creation of publication-quality academic figures, diagrams, and statistic | Python | 1,331 |
| [TAKT](https://github.com/nrslib/takt) | TAKT Agent Koordination Topology - Define how AI agents coordinate, where humans intervene, and what gets recorded — in YAML | TypeScript | 1,288 |
| [FAROS](https://github.com/OpenNSWM-Lab/FAROS) | A blueprint-driven AutoResearch runtime for orchestrating AI research workflows from idea generation and experiments to paper writing and peer review. | Python | 1,240 |
| [multi-agent-shogun](https://github.com/yohey-w/multi-agent-shogun) | multi-agent-shogun is a shell-based system designed to orchestrate multiple AI coding agents in parallel, inspired by a feudal samurai hierarchy. It a | Shell | 1,219 |
| [enterprise-deep-research](https://github.com/SalesforceAIResearch/enterprise-deep-research) | Salesforce Enterprise Deep Research | Python | 1,199 |
| [OpenMausBot](https://github.com/milind-soni/OpenMausBot) | Open Source Alternative to Grok Bot with a virtual machine that bots can use | TypeScript | 1,181 |
| [ai](https://github.com/tylerprogramming/ai) | This repository will have different projects using AutoGen and Tutorials | Python | 1,140 |
| [experts](https://github.com/metaskills/experts) | Experts.js is the easiest way to create and deploy OpenAI's Assistants and link them together as Tools to create advanced Multi AI Agent Systems with | JavaScript | 1,066 |
| [Mysti](https://github.com/DeepMyst/Mysti) | Mysti is an agentic AI coding team designed to enhance development workflows within Visual Studio Code. It facilitates collaborative coding by leverag | TypeScript | 1,037 |
| [mem9](https://github.com/mem9-ai/mem9) | mem9 provides persistent, shared memory for AI agents, solving the problem of agent amnesia and data silos across sessions and machines. It enables mu | TypeScript | 978 |
| [fugu](https://github.com/SakanaAI/fugu) | Sakana Fugu is a multi-agent AI system developed by Sakana AI that dynamically orchestrates a diverse pool of frontier language models to handle compl | Shell | 939 |
| [AgentSpace](https://github.com/HKUDS/AgentSpace) | AgentSpace is an agent-native collaborative workspace that integrates human teams with AI agents—referred to as "digital employees"—into a single shar | TypeScript | 904 |
| [claude-code-by-agents](https://github.com/baryhuang/claude-code-by-agents) | Desktop app for multi-agent Claude Code orchestration - coordinate local and remote agents through @mentions and intelligent workflow automation. | Swift | 889 |
| [LatentMAS](https://github.com/Gen-Verse/LatentMAS) | LatentMAS is a multi-agent reasoning framework designed to enhance collaboration within large language models by shifting communication from token spa | Python | 879 |
| [AI Researcher](https://github.com/mshumer/autonomous-researcher) | Autonomous AI researcher that takes a research objective, decomposes it into experiments, and dispatches specialist agents to execute them on isolated | Python | 811 |
| [waggle](https://github.com/modiqo/waggle) | Waggle is a reference layer for agent-to-agent handoffs that replaces the costly practice of pasting full artifacts into every subagent prompt with a | Rust | 795 |
| [OpenTag](https://github.com/CopilotKit/OpenTag) | OpenTag is an open-source on-call triage assistant that operates natively within Slack and Microsoft Teams, helping support and engineering teams rapi | TypeScript | 723 |
| [MiroShark](https://github.com/aaronjmars/MiroShark) | MiroShark is a Universal Swarm Intelligence Engine designed for multi-agent simulation and public reaction modeling. It allows users to upload any doc | Python | 716 |
| [shuo](https://github.com/NickTikhonov/shuo) | Shuo is a Python-based voice agent framework designed for sub-500ms latency phone agent orchestration. It provides a complete pipeline for real-time v | Python | 636 |
| [agency-swarm-lab](https://github.com/VRSEN/agency-swarm-lab) | Agency Swarm Lab is a collaborative showcase of custom AI agent teams built with the Agency Swarm framework, designed to demonstrate how coordinated m | Python | 628 |
| [PaperOrchestra](https://github.com/Ar9av/PaperOrchestra) | An automated AI research-paper writer based off Google's PaperOrchestra paper's implementation through a skills - benchmark + autoraters using any cod | Python | 597 |
| [munder-difflin](https://github.com/chaitanyagiri/munder-difflin) | local multi-agent harness | TypeScript | 595 |
| [graphbit](https://github.com/InfinitiBit/graphbit) | GraphBit is the world’s first enterprise-grade Agentic AI framework, built on a Rust core with a Python wrapper for unmatched speed, security, and sca | Rust | 577 |
| [giselle](https://github.com/giselles-ai/giselle) | Giselle: AI App Builder. Open Source. | TypeScript | 554 |
| [open-multi-agent-canvas](https://github.com/CopilotKit/open-multi-agent-canvas) | The open-source multi-agent chat interface that lets you manage multiple agents in one dynamic conversation and add MCP servers for deep research | TypeScript | 520 |
| [freephdlabor](https://github.com/ltjed/freephdlabor) | freephdlabor is an open-source multiagent framework designed to automate the entire scientific research lifecycle, from hypothesis generation to publi | Python | 501 |
| [mira](https://github.com/mira-wm/mira) | MIRA is a real-time world model of Rocket League, implemented as a 5-billion-parameter latent diffusion model that generates video frame-by-frame from | Python | 473 |
| [graph_websearch_agent](https://github.com/john-adeojo/graph_websearch_agent) | Websearch agent built on the LangGraph framework | Python | 403 |
| [lemma-platform](https://github.com/lemma-work/lemma-platform) | Lemma Platform is an open-source workspace that unifies humans and AI agents as a single team, solving the gap between coding agents that generate cod | Python | 354 |
| [Agent View](https://github.com/Frayo44/agent-view) | Agent View is a lightweight, terminal-based orchestrator designed for managing multiple AI coding assistants in parallel. It serves as a unified dashb | TypeScript | 349 |
| [PrimoAgent](https://github.com/ivebotunac/PrimoAgent) | PrimoAgent: Multi-Agent Stock Analysis | Python | 339 |
| [Laddr](https://github.com/AgnetLabs/Laddr) | Laddr is a Python framework designed for building scalable, multi-agent systems, functioning as a microservices architecture for AI agents. It enables | Python | 337 |
| [agent-harness-generator](https://github.com/ruvnet/agent-harness-generator) | 🛠️ The meta-harness for AI agents — scaffold your own focused, branded agent harness with its own npx CLI, MCP server, memory, learning loop, and witn | TypeScript | 331 |
| [agents-council](https://github.com/0xwilliamortiz/agents-council) | Agent Council is a multi-agent collaboration plugin for Claude Code that orchestrates multiple AI CLIs (Codex, Gemini, and others) to deliver diverse | JavaScript | 293 |
| [superhq](https://github.com/superhq-ai/superhq) | Sandboxed AI agent orchestration platform | Rust | 276 |
| [Puzld](https://github.com/MedChaouch/Puzld.ai) | Puzld.ai is a comprehensive, terminal-native framework for orchestrating multiple Large Language Models (LLMs) and AI agents. It enables complex workf | TypeScript | 260 |
| [LLM-TradeBot](https://github.com/EthanAlgoX/LLM-TradeBot) | LLM-TradeBot is a multi-agent AI trading system designed to optimize futures trading strategies using Large Language Models and the Adversarial Decisi | Python | 219 |
| [MoChat](https://github.com/HKUDS/MoChat) | MoChat is a platform designed to turn AI agents into personal social connectors, bridging the gap between AI and human networking. It enables agents t | TypeScript | 217 |
| [Gru](https://github.com/zscole/gru) | Gru is a self-hosted AI agent orchestration service designed to manage complex tasks autonomously. It allows users to spin up specialized agents that | Python | 216 |
| [Interview Tool](https://github.com/nicobailon/pi-interview-tool) | The Interview Tool is an interactive form designed for `pi-agent` to efficiently gather detailed user responses through a guided interface. It support | TypeScript | 212 |
| [BossConsole](https://github.com/risa-labs-inc/BossConsole) | BOSS Console is an open-source, Apache-2.0 desktop harness for AI coding agents such as Claude Code, Codex, Gemini, and OpenCode, built with Kotlin Mu | Kotlin | 210 |
| [Zen7 Payment Agent](https://github.com/Zen7-Labs/Zen7-Payment-Agent) | The Zen7 Payment Agent is the initial practical implementation of the Decentralized Payment Agent (DePA) protocol, pioneering next-generation intellig | Python | 178 |
| [ARCgentica](https://github.com/symbolica-ai/arcgentica) | ARCgentica is an agentic AI system designed to solve complex challenges in the ARC-AGI benchmark using Large Language Models (LLMs). It leverages the | Python | 175 |
| [Building-Business-Ready-Generative-AI-Systems](https://github.com/Denis2054/Building-Business-Ready-Generative-AI-Systems) | This GitHub repository contains the complete code for building Business-Ready Generative AI Systems (GenAISys) from scratch. It guides you through arc | Jupyter Notebook | 167 |
| [agentic-os](https://github.com/KbWen/agentic-os) | Governance framework for AI coding agents. It runs them through a five-step workflow (plan, build, review, test, ship) where no step counts as done wi | Python | 133 |
| [CodeJury](https://github.com/krishagarwal314/CodeJury) | CodeJury is a terminal-first, knowledge-grounded multi-agent pipeline that takes a bug report or feature request from scope to gated pull request enti | Python | 129 |
| [Orloj](https://github.com/OrlojHQ/orloj) | An orchestration runtime for multi-agent AI systems. Declare agents, tools, and policies as YAML; Orloj schedules, executes, routes, and governs them | Go | 106 |
| [gw](https://github.com/golbin/gw) | gw is a cross-platform command-line interface written in Rust designed for managing multi-agent and parallel work using Git worktrees. It provides a s | Rust | 100 |
| [edict-agent](https://github.com/vannyben7/edict-agent) | Edict Agent is a Codex skill that governs how the main AI agent plans, delegates, reviews, and integrates work performed by subagents on complex, ambi | — | 95 |
| [Multi-Agents-System-from-Scratch](https://github.com/AIAnytime/Multi-Agents-System-from-Scratch) | Multi AI Agents System from Scratch in pure python without any frameworks. | Python | 71 |
| [chatting-agent](https://github.com/iKemo-io/chatting-agent) | presents a Streamlit application designed to enable real-time conversations between two local Ollama models. It functions as a multi-agent chat interf | Python | 55 |
| [Fractera](https://github.com/Fractera/Agent-Engineering-Infrastructure) | Fractera is an open-source agent engineering infrastructure that automates full-stack deployment on a user's own VPS, provisioning Nginx routing, SSL | TypeScript | 54 |
| [cast](https://github.com/yaodub/cast) | Cast fixes this by acting as a self-hosted multi-user harness for your AI agents. It lets you run cloud-based agents locally and securely share them w | TypeScript | 38 |
| [AIAgentsBootcamp](https://github.com/pragatidev/AIAgentsBootcamp) | Build and deploy powerful AI agents using LangChain, Langflow, and GPT-4 – from beginner to advanced. | Jupyter Notebook | 33 |
| [hive](https://github.com/ivankuznetsov/hive) | An open-source agent workflow engine & meta-harness: orchestrates Claude, Codex, and Pi to run multi-step work as a folder-as-agent pipeline. Its flag | Ruby | 27 |
| [DeepVerify](https://github.com/xiongsiheng/DeepVerify) | DeepVerify is an agentic system designed for evidence-based, expert-level scientific claim verification. It equips state-of-the-art language models wi | Python | 26 |
| [AI-Team-Orchestrator](https://github.com/khaoss85/AI-Team-Orchestrator) | Next-generation multi-agent AI platform with autonomous quality gates, real-time thinking processes, and cost-optimized orchestration. Built with Open | Python | 20 |
| [Altiverse](https://github.com/LeoTheAIDev/Altiverse) | Altiverse turns one decision into two to four living simulations with up to around 1,000 agents moving through alternate realities. It runs local firs | TypeScript | 19 |
| [MCP-SIM](https://github.com/KAIST-M4/MCP-SIM) | MCP-SIM (Memory-Coordinated Physics-Aware Simulation) addresses the challenge of building physics-based simulations, which traditionally demands exper | Python | 16 |
| [Agent-Handoff](https://github.com/dabit3/agent-handoff) | Agent-Handoff is a TypeScript-based context transfer protocol designed to facilitate clean and reliable handoffs between multi-agent systems. It addre | TypeScript | 13 |
| [Agent-Router](https://github.com/dabit3/agent-router) | Agent-Router is a TypeScript-based framework designed for intelligent task routing within complex multi-agent systems. It solves the challenge of opti | TypeScript | 6 |
| [Agent-Manifest](https://github.com/dabit3/agent-manifest) | Agent-Manifest is a framework providing a standard JSON schema and Command Line Interface (CLI) for declaring the capabilities, inputs, outputs, and b | TypeScript | 4 |
| [Waku](https://github.com/egoist/waku) | Waku is a native desktop workspace that puts multiple local coding agents behind one interface. It detects installed CLIs, including Claude Code, Code | — | 0 |
| [Volcano SDK](https://github.com/Kong/volcano-sdk) | The Volcano Agent SDK is a TypeScript-first framework designed for building complex, multi-provider AI agents. It enables developers to chain LLM reas | — | 0 |
| [tinyclaw](https://github.com/TinyAGI/tinyclaw) | TinyAGI is a framework designed to run multi-agent, multi-team AI assistants that collaborate simultaneously within isolated workspaces. It enables co | — | 0 |
| [TinyClaw](https://github.com/jlia0/tinyclaw) | TinyClaw is a multi-agent, multi-team AI assistant designed for collaborative, 24/7 operation. It allows users to run multiple isolated AI agents that | — | 0 |
| [TencentDB-Agent-Memory](https://github.com/TencentCloud/TencentDB-Agent-Memory) | TencentDB Agent Memory is an open-source framework that helps AI agents retain, organize, and reuse experience across sessions and projects, reducing | — | 0 |
| [sympozium](https://github.com/AlexsJones/sympozium) | Sympozium is a Kubernetes-native platform designed to orchestrate fleets of multi-agent AI systems. It enables users to deploy and manage agents that | — | 0 |
| [swarm-forge](https://github.com/unclebob/swarm-forge) | SwarmForge orchestrates swarms of AI coding agents in tmux sessions, each working in its own git worktree, so multiple agents can collaborate on the s | — | 0 |
| [open-multi-agent](https://github.com/JackChen-me/open-multi-agent) | No description available. | — | 0 |
| [Octop](https://github.com/TencentCloud/Octop) | Octop, self-hosted multi-user, multi-agent AI assistant. Octop is a self-hosted AI assistant platform that runs a single local process serving a web d | — | 0 |
| [Murmell](https://github.com/murmell.com/murmell) | Murmell is a shared online workspace where multiple AI coding agents collaborate on a single project at the same time, live in the browser. Each agent | — | 0 |
| [multi-agent-discuss](https://github.com/sjc88661/multi-agent-discuss) | Multi-Agent Workbench is a local-first control room that orchestrates multiple coding agents—Claude Code, Codex CLI, or any PTY-based CLI—as a discipl | — | 0 |
| [mpai](https://github.com/godfaddaai.github.io/mpai) | Multiplayer AI (mpai) is a community-driven showcase and playground for experimenting with multiple AI agents and models in a single multiplayer-style | — | 0 |
| [Memori](https://github.com/GibsonAI/Memori) | Open-Source Memory Engine for LLMs, AI Agents & Multi-Agent Systems | — | 0 |
| [HiClaw](https://github.com/alibaba/hiclaw) | HiClaw. This is one of the most interesting multi-agent projects in the list because it is designed around a very clear idea, an AI team in a chat roo | — | 0 |
| [HarnessRouter](https://github.com/harnessrouter.ai/harnessrouter) | HarnessRouter is an AI agent orchestration layer that sits between agents and the underlying model harnesses to route work to the most appropriate run | — | 0 |
| [GHOSTCREW](https://github.com/GH05TCREW/ghostcrew) | PentestAgent is an AI-powered framework designed for automated penetration testing using Large Language Models. It integrates with providers like Open | — | 0 |
| [gauntlet-loop](https://github.com/robonuggets/gauntlet-loop) | Gauntlet Loop is a reusable skill that converts any goal into a single, paste-ready prompt enforcing an iterative quality workflow for AI agents. Inst | — | 0 |
| [Gas Town](https://github.com/steveyegge/gastown) | Gas Town - multi-agent workspace manager | — | 0 |
| [diri](https://github.com/cristicretu/diri) | Diri is a native macOS orchestrator for coding agents, letting developers run Claude Code, Codex, Cursor, Gemini, and plain shells in parallel across | — | 0 |
| [DeepAgent Food Tours](https://github.com/muratcankoylan/Butterpath) | Butterpath is an AI-powered food tour planner built using LangChain DeepAgents to generate personalized culinary experiences. It leverages Google Maps | — | 0 |
| [CoPaw](https://github.com/agentscope-ai/CoPaw) | QwenPaw is a personal AI assistant designed for flexible deployment, offering users complete control over their memory and data whether running locall | — | 0 |
| [Continuous Claude](https://github.com/parcadei/Continuous-Claude-v2) | Continuous Claude is a persistent, multi-agent development environment designed to transform Claude Code into a continuously learning system that main | — | 0 |
| [claude-code-controller](https://github.com/The-Vibe-Company/claude-code-controller) | The Claude Code Controller, known as The Companion, is a web-based interface designed to manage and control multi-agent sessions using Claude Code and | — | 0 |
| [AI-Conversation-Hub](https://github.com/xEscapeVelocity/AI-Conversation-Hub) | Open-source, serverless, multi-LLM group chat application | TypeScript | 0 |
| [agentscope](https://github.com/modelscope/agentscope) | Start building LLM-empowered multi-agent applications in an easier way. | — | 0 |
| [AgentConnect](https://github.com/agentconnect.md/agentconnect) | AgentConnect is a developer-focused connectivity layer for AI agents that aims to make it trivial to expose, discover, and chain MCP-compatible tools | — | 0 |

### Agent observability, evaluation, safety & governance

Agent/LLM tracing, metrics, evaluations, prompt-injection defenses, guardrails, safety, and governance.

#### Core (3)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [langfuse](https://github.com/langfuse/langfuse) | Langfuse is an open-source observability and analytics platform built for developers shipping LLM applications. It provides tracing, evaluation, promp | TypeScript | 32,262 |
| [helicone](https://github.com/Helicone/helicone) | 🧊 Open source LLM observability platform. One line of code to monitor, evaluate, and experiment. YC W23 🍓 | TypeScript | 6,077 |
| [tokencost](https://github.com/AgentOps-AI/tokencost) | Easy token price estimates for 400+ LLMs | Python | 2,003 |

#### Adjacent (5)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [fable-method](https://github.com/Sahir619/fable-method) | The Fable Method distills the problem-solving behavior of Claude Fable 5 into four transferable skills (fable-method, fable-loop, fable-judge, fable-d | Python | 2,011 |
| [intellagent](https://github.com/plurai-ai/intellagent) | A framework for comprehensive diagnosis and optimization of agents using simulated, realistic synthetic interactions | Python | 1,254 |
| [forsy-trace-skill](https://github.com/Forsy-AI/forsy-trace-skill) | Forsy Trace Skill turns black-box agent workflows into clean, structured trajectory data. By dropping the instruction file into an agent environment, | Python | 90 |
| [agent-watch](https://github.com/AIAnytime/agent-watch) | Agent Watch is an AgentOps monitoring library designed for Crew AI applications. | Jupyter Notebook | 22 |
| [Argos](https://github.com/tryargos.cc/argos) | Argos is an agent observability and evaluation platform that gives AI builders visibility into how their agents actually behave in production. It capt | — | 0 |

### Analytics, product intelligence & engineering metrics

Product, web, developer, telemetry, business, and engineering-metrics analytics platforms.

#### Core (8)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Plausible Analytics](https://github.com/plausible/analytics) | Plausible Analytics, privacy-focused web analytics platform. Plausible Analytics is an open-source web analytics platform that provides website insigh | Elixir | 28,632 |
| [Matomo](https://github.com/matomo-org/matomo) | Matomo is a leading open-source, self-hosted analytics platform designed as a privacy-focused alternative to Google Analytics. Built on PHP and MySQL, | PHP | 21,436 |
| [metabase](https://github.com/metabase/metabase) | The simplest, fastest way to get business intelligence and analytics to everyone in your company :yum: | Clojure | 48,807 |
| [PostHog](https://github.com/PostHog/posthog) | 🦔 PostHog provides open-source product analytics, session recording, feature flagging and A/B testing that you can self-host. | Python | 37,722 |
| [Openpanel](https://github.com/Openpanel-dev/openpanel) | OpenPanel is an open-source web and product analytics platform designed as a privacy-focused alternative to tools like Mixpanel. It combines advanced | TypeScript | 5,646 |
| [GoatCounter](https://github.com/arp242/goatcounter) | GoatCounter is an open-source, privacy-aware web analytics platform designed as a lightweight alternative to services like Google Analytics. It focuse | Go | 5,633 |
| [Talivia](https://github.com/talivia-group/talivia) | Talivia is an open-source, self-hosted analytics platform built for founders who need to connect website traffic directly to revenue, positioning itse | TypeScript | 541 |
| [openanalytics](https://github.com/OpenLabs-so/openanalytics) | OpenAnalytics is a privacy-first, open-source web analytics platform that serves as a self-hostable alternative to services like Google Analytics, off | — | 0 |

#### Adjacent (21)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [grafana](https://github.com/grafana/grafana) | The open and composable observability and data visualization platform. Visualize metrics, logs, and traces from multiple sources like Prometheus, Loki | TypeScript | 76,253 |
| [openobserve](https://github.com/openobserve/openobserve) | OpenObserve is a cloud-native observability platform that unifies logs, metrics, traces, frontend (RUM) monitoring, pipelines, and LLM observability i | TypeScript | 20,493 |
| [Rybbit](https://github.com/rybbit-io/rybbit) | Rybbit is an open-source, privacy-friendly alternative to Google Analytics designed to provide highly intuitive web and product analytics. Built with | TypeScript | 11,989 |
| [OpenSRE v0.1](https://github.com/Tracer-Cloud/opensre) | OpenSRE, open platform for site reliability engineering workflows. OpenSRE is an open-source platform focused on automating site reliability engineeri | Python | 7,625 |
| [PeaNUT](https://github.com/Brandawg93/PeaNUT) | PeaNUT is a lightweight, web-based dashboard for monitoring Uninterruptible Power Supplies (UPS) through Network UPS Tools (NUT), providing real-time | TypeScript | 1,607 |
| [evlog](https://github.com/HugoRCD/evlog) | Digging through logs is not observability. It's hope — wide events, structured errors, TypeScript-first, every runtime. | TypeScript | 1,515 |
| [swetrix](https://github.com/Swetrix/swetrix) | Swetrix is open-source web analytics that's completely cookieless, so no annoying consent banner and nothing tracking your visitors across the web, pl | TypeScript | 1,124 |
| [Universal Reddit Scraper Suite](https://github.com/ksanjeev284/reddit-universal-scraper) | The Universal Reddit Scraper Suite is a full-featured Python application designed for comprehensive data extraction from any subreddit or user, elimin | Python | 473 |
| [moneat](https://github.com/moneat-io/moneat) | Moneat is an open-source, self-hostable observability platform that unifies error tracking, session replay, performance monitoring, continuous profili | Kotlin | 371 |
| [Sprout Track](https://github.com/Oak-and-Sprout/sprout-track) | Sprout Track is a self-hosted Next.js application designed for comprehensive tracking of baby activities, milestones, and development. It provides a d | TypeScript | 290 |
| [rejourney](https://github.com/rejourneyco/rejourney) | Rejourney is an open-source, self-hostable or hosted observability tool for web and mobile apps, focused on being lightweight and performant. It provi | TypeScript | 272 |
| [fable-harness](https://github.com/Miguok/fable-harness) | Fable Harness is a drop-in behavioral protocol for Claude Code that enforces disciplined engineering practices across every session by injecting hooks | Python | 198 |
| [rocketplaneIO](https://github.com/olemeyer/rocketplaneIO) | rocketplaneIO is a self-hosted, AI-driven Site Reliability Engineering platform for Kubernetes that delivers zero-instrumentation observability paired | Go | 174 |
| [ai-sdk](https://github.com/grafana/ai-sdk) | Grafana's ai-sdk is a Go SDK that lets backend services call language models, stream responses, execute tools, and serve AI-powered endpoints using a | Go | 163 |
| [opentax-engine](https://github.com/Invaro/opentax-engine) | opentax-engine is a deterministic, open-source US tax calculation engine that produces exact, verifiable answers through cryptographic proof trees. It | JavaScript | 133 |
| [Eneru](https://github.com/m4r1k/Eneru) | ⚡ UPS monitoring and shutdown orchestration for NUT: multi-UPS policy, VM/container/remote shutdown, TUI, API, Prometheus, MQTT, Grafana, and persiste | Python | 130 |
| [dns-honeypot](https://github.com/tg12/dns-honeypot) | details an experiment setting up a DNS honeypot to observe global internet traffic patterns. It deploys Unbound as a DNS resolver, allowing external q | — | 98 |
| [grafana-tui](https://github.com/lovromazgon/grafana-tui) | Grafana dashboards in your terminal | Go | 83 |
| [skew_news](https://github.com/adrianhajdin/skew_news) | Skew is a full-stack AI news platform. It scrapes real news hourly via Oxylabs, scores each for sentiment and political framing with GPT-4o, and conne | TypeScript | 32 |
| [Buselligence](https://github.com/Salestrics/Buselligence) | Business Intelligence AI Tool | TypeScript | 2 |
| [ContextOS](https://github.com/joshimohanlalit1303-ctrl/ContextOS) | Memory-as-a-Service for AI Agents & LLMs. Add persistent memory, pgvector-based semantic search, and automatic semantic deduplication with 3 simple RE | TypeScript | 0 |

### Security hardening, application security & DevSecOps

Defensive AppSec, DevSecOps, vulnerability and secret scanning, supply-chain security, hardening, and policy tooling.

#### Core (3)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [trivy](https://github.com/aquasecurity/trivy) | identify vulnerabilities and misconfigurations across software environments, and Temporal enables durable workflow orchestration for distributed syste | Go | 36,627 |
| [Semgrep](https://github.com/semgrep/semgrep) | Semgrep is a fast, open-source static analysis tool designed to search code, identify bugs, and enforce coding standards across numerous languages. It | OCaml | 14,840 |
| [nullsec-s1](https://github.com/trynullsec/nullsec-s1) | Security-native LLM system for AI-generated application security. | Python | 269 |

#### Adjacent (16)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [trufflehog](https://github.com/trufflesecurity/trufflehog) | Find and verify secrets | Go | 27,499 |
| [Promptfoo](https://github.com/promptfoo/promptfoo) | Test your prompts, agents, and RAGs. Red teaming/pentesting/vulnerability scanning for AI. Compare performance of GPT, Claude, Gemini, DeepSeek, and m | TypeScript | 22,650 |
| [Anthropic Cybersecurity Skills](https://github.com/mukul975/Anthropic-Cybersecurity-Skills) | Anthropic cybersecurity skills, security skill library for AI agents. Anthropic cybersecurity skills is an open-source collection of reusable cybersec | Python | 22,075 |
| [bunkerweb](https://github.com/bunkerity/bunkerweb) | 🛡️ Make your web services secure by default ! | Python | 10,821 |
| [WebGoat](https://github.com/WebGoat/WebGoat) | WebGoat is a deliberately insecure web application maintained by OWASP, designed specifically for educational purposes in web application security. It | JavaScript | 9,083 |
| [Claude-Skills](https://github.com/jeffallan/claude-skills) | Claude-Skills is a Python-based repository designed to transform Claude into an expert pair programmer for full-stack developers. It provides 66 speci | Python | 8,323 |
| [Codex Security](https://github.com/openai/codex-security) | Codex Security is OpenAI's CLI and TypeScript SDK for automating the detection, validation, and remediation of security vulnerabilities in source code | TypeScript | 7,847 |
| [crust](https://github.com/BakeLens/crust) | Crust is an open-source AI agent security infrastructure designed to intercept and block dangerous behaviors before they execute. It acts as a transpa | Go | 425 |
| [depsguard](https://github.com/arnica/depsguard) | Harden your package manager configs against supply chain attacks. | Rust | 374 |
| [RepoMind](https://github.com/403errors/repomind) | RepoMind is an open-source, AI-powered platform designed for deep understanding of public GitHub repositories and developer profiles. It utilizes Agen | TypeScript | 240 |
| [The Reclaim Stack](https://github.com/reclaim-the-stack/get-started) | Reclaim the Stack is a ready-to-deploy Kubernetes platform stack that lets users spin up a complete, production-style environment in about 15 minutes. | Shell | 178 |
| [cynative](https://github.com/cynative/cynative) | Cynative is a CLI tool that performs deep, read-only research across an organization's entire infrastructure stack by reasoning through code, cloud, a | Go | 171 |
| [postlab](https://github.com/rifkyputra/postlab) | Postlab is an interactive terminal UI for managing bare-metal and homelab servers, consolidating package management, Docker/Podman containers, firewal | Rust | 60 |
| [compose-lint](https://github.com/tmatens/compose-lint) | compose-lint is a security-focused static-analysis linter for Docker Compose files that detects dangerous misconfigurations before they reach producti | Python | 44 |
| [layerleak](https://github.com/Brumbelow/layerleak) | LayerLeak tears apart Docker Hub image histories and metadata hunting for accidentally baked-in API keys and secrets. Completely agentless, no infrast | Go | 41 |
| [rep+](https://github.com/bscript/rep) | rep+ is a lightweight Chrome DevTools extension designed to streamline web application security testing by integrating AI into the workflow. Inspired | — | 0 |

### OSINT, threat intelligence & defensive reconnaissance

Passive/public-source intelligence, threat intelligence, exposure awareness, security research, and defensive reconnaissance.

#### Core (1)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [opencti](https://github.com/OpenCTI-Platform/opencti) | Open Cyber Threat Intelligence Platform | TypeScript | 9,820 |

#### Adjacent (13)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [sherlock](https://github.com/sherlock-project/sherlock) | Hunt down social media accounts by username across social networks | Python | 89,705 |
| [World Monitor](https://github.com/koala73/worldmonitor) | World Monitor is a real-time, AI-powered global intelligence dashboard designed for unified situational awareness. It aggregates and synthesizes over | TypeScript | 77,501 |
| [Maigret](https://github.com/soxoj/maigret) | 🕵️‍♂️ Collect a dossier on a person by username from 3000+ sites | Python | 33,821 |
| [Social Analyzer](https://github.com/qeeqbox/social-analyzer) | The Social Analyzer is a comprehensive OSINT tool offering an API, CLI, and Web App designed for analyzing and locating personal profiles across over | JavaScript | 22,622 |
| [GhostTrack](https://github.com/HunxByts/GhostTrack) | GhostTrack is a Python-based tool designed for information gathering and OSINT activities, focusing on tracking location and mobile numbers. It serves | Python | 8,395 |
| [URS](https://github.com/JosephLai241/URS) | Universal Reddit Scraper - A comprehensive Reddit scraping/archival command-line tool. | Python | 1,022 |
| [ClawSec](https://github.com/prompt-security/clawsec) | ClawSec is a comprehensive security skill suite designed to protect AI agent platforms, including OpenClaw and NanoClaw. It provides a unified system | JavaScript | 905 |
| [GeoSentinel](https://github.com/h9zdev/GeoSentinel) | GeoSentinel is a comprehensive geospatial monitoring platform designed to track global movement in real time. It aggregates diverse data streams, incl | HTML | 829 |
| [KATAKATE](https://github.com/Katakate/k7) | Katakate (k7) provides a self-hosted infrastructure for creating and managing lightweight VM sandboxes designed to safely execute untrusted code at sc | Python | 776 |
| [OpenThreat](https://github.com/hoodinformatik/OpenThreat) | OpenThreat is a free, open-source platform designed to democratize threat intelligence by aggregating and tracking critical vulnerability data. It pro | Python | 282 |
| [Kosty](https://github.com/kosty-cloud/kosty) | Kosty is a Python-based Command Line Interface (CLI) tool designed to identify AWS cost waste and security vulnerabilities across a wide range of serv | Python | 267 |
| [Wayback URL Finder](https://github.com/coffinxp/wayback-url-finder) | The Wayback URL Finder is a Chrome extension designed to help security researchers and OSINT enthusiasts quickly discover archived URLs from the Wayba | HTML | 241 |
| [Spyder](https://github.com/gumot0/spyder-osint) |  | — | 0 |

### Specification-driven design, requirements & API contracts

Spec-driven development, requirements engineering, API contracts, OpenAPI/AsyncAPI, BDD/TDD, and contract testing.

#### Core (4)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Catch2](https://github.com/catchorg/Catch2) | Catch2 is a modern, C++-native test framework designed primarily for unit testing, while also supporting micro-benchmarking and behavior-driven develo | C++ | 21,398 |
| [Redoc](https://github.com/Redocly/redoc) | Redoc is an open-source tool designed to generate beautiful, interactive API reference documentation directly from OpenAPI and Swagger definitions. It | TypeScript | 25,642 |
| [sample-specship](https://github.com/aws-samples/sample-specship) | SpecShip is a Kiro Power that turns AI coding agents from shallow code generators into disciplined engineers by orchestrating them through a five-phas | Shell | 213 |
| [aurl](https://github.com/ShawnPana/aurl) | aurl is a command-line tool written in Go designed to transform any API specification into a usable CLI interface. It supports various standards, incl | Go | 159 |

#### Adjacent (35)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [open-webui](https://github.com/open-webui/open-webui) | User-friendly WebUI for LLMs (Formerly Ollama WebUI) | Python | 149,050 |
| [Spec Kit](https://github.com/github/spec-kit) | 💫 Toolkit to help you get started with Spec-Driven Development | Python | 129,831 |
| [OpenSpec](https://github.com/Fission-AI/OpenSpec) | Spec-driven development for AI coding assistants. | TypeScript | 65,216 |
| [nocodb](https://github.com/nocodb/nocodb) | 🔥 🔥 🔥 Open Source Airtable Alternative | TypeScript | 64,569 |
| [GET SHIT DONE](https://github.com/gsd-build/get-shit-done) | GET SHIT DONE is a powerful, lightweight system designed for context engineering and spec-driven development, specifically tailored for AI coding assi | JavaScript | 54,541 |
| [bruno](https://github.com/usebruno/bruno) | Opensource IDE For Exploring and Testing Api's (lightweight alternative to postman/insomnia) | JavaScript | 46,384 |
| [Claude Code PM](https://github.com/automazeio/ccpm) | CCPM is a project management system designed for AI agents, focusing on structured, spec-driven development. It utilizes GitHub Issues and Git worktre | Shell | 7,990 |
| [GSD 2](https://github.com/gsd-build/gsd-2) | GSD 2 is a sophisticated development system designed for autonomous agents, focusing on meta-prompting, context engineering, and spec-driven developme | TypeScript | 6,076 |
| [mcpo](https://github.com/open-webui/mcpo) | A simple, secure MCP-to-OpenAPI proxy server | Python | 4,344 |
| [Spec Workflow MCP](https://github.com/Pimzino/spec-workflow-mcp) | The Spec Workflow MCP is a Model Context Protocol (MCP) server designed to facilitate structured, spec-driven development workflows for AI-assisted so | TypeScript | 4,131 |
| [open-connector](https://github.com/oomol-lab/open-connector) | OpenConnector is an open-source authentication gateway that lets AI agents and applications securely access over 1,000 SaaS providers through a unifie | TypeScript | 3,959 |
| [conductor](https://github.com/gemini-cli-extensions/conductor) | Conductor is a Gemini CLI extension that allows you to specify, plan, and implement software features. | Python | 3,703 |
| [mcp2cli](https://github.com/knowsuchagency/mcp2cli) | mcp2cli is a Python-based command-line interface designed to transform any MCP, OpenAPI, or GraphQL server into an accessible CLI at runtime, eliminat | Python | 1,986 |
| [voiden](https://github.com/VoidenHQ/voiden) | Design, Test and Document APIs in plain Markdown. Compose Requests with API blocks. Reuse, Replace & Version everything just like code. Offline, Truly | TypeScript | 1,486 |
| [paca](https://github.com/Paca-AI/paca) | AI-native, free, open-source alternative to Jira, Trello, ClickUp & Monday. Built for Scrum teams where humans and AI agents collaborate as equals — o | Go | 1,340 |
| [blume](https://github.com/haydenbleasel/blume) | Blume is a zero-config documentation generator that transforms a folder of Markdown or MDX files into a production-grade documentation site with a sin | TypeScript | 1,030 |
| [vibecode-pro-max-kit](https://github.com/withkynam/vibecode-pro-max-kit) | Your AI forgets. This remembers. Spec-driven coding harness for vibecoders, product owners, CEOs and real builders — self-improving context memory, 15 | JavaScript | 998 |
| [gsd-pi](https://github.com/open-gsd/gsd-pi) | A powerful meta-prompting, context engineering and spec-driven development system that enables agents to work for long periods of time autonomously wi | TypeScript | 766 |
| [shotgun](https://github.com/shotgun-sh/shotgun) | The Shotgun CLI | Python | 684 |
| [repo-task-proof-loop](https://github.com/DenisSergeevitch/repo-task-proof-loop) | Repo Task Proof Loop is a Python-based skill designed to manage complex coding tasks using a spec-driven, agentic workflow. It applies principles from | Python | 666 |
| [Convex-Helpers](https://github.com/get-convex/convex-helpers) | Convex-Helpers is a comprehensive collection of TypeScript utilities designed to extend and complement the official Convex packages. This repository p | TypeScript | 456 |
| [mcp-server-spec-driven-development](https://github.com/formulahendry/mcp-server-spec-driven-development) | Spec-Driven Development MCP Server, no just Vibe Coding | TypeScript | 436 |
| [foreman](https://github.com/VisionForge-OU/foreman) | Foreman is a terminal-based orchestrator that supervises headless Claude Code agents through a gated software-delivery pipeline (`plan → ADR/PRD → iss | Python | 381 |
| [Tome](https://github.com/tomehq/tome) | Tome is an open-source documentation platform designed to help developers create beautiful, feature-rich documentation efficiently. It allows users to | TypeScript | 359 |
| [ProductSpec](https://github.com/gokulrajaram/ProductSpec) | ProductSpec is an open standard for defining product intent in software projects, providing a portable "Product Harness" that defines what to build, w | TypeScript | 217 |
| [CheapSecurity](https://github.com/gmrandazzo/CheapSecurity) | CheapSecurity is a self-hosted, lightweight CCTV solution that turns a Linux single-board computer (such as a Raspberry Pi or Odroid) and a standard U | Python | 191 |
| [Aural](https://github.com/1146345502/aural-oss) | Aural is an open-source AI interview platform that autonomously conducts structured interviews across voice, chat, and video channels. It solves the c | TypeScript | 184 |
| [specli](https://github.com/vercel-labs/specli) | specli is a tool designed to transform any OpenAPI specification into an Agent-optimized, executable command-line interface. It provides two primary f | TypeScript | 118 |
| [Spec-Driven-Development](https://github.com/FredAntB/Spec-Driven-Development) | A Claude skill that keeps your AI coding tools from contradicting each other. Generates requirements.md, design.md, and tasks.md before any code is wr | Python | 98 |
| [ServiceGraph](https://github.com/nostrband/ServiceGraph) | AI Agent skills to access structured datasets for startup founders | Shell | 69 |
| [llm-gateway](https://github.com/openziti/llm-gateway) | Zero trust LLM gateway. OpenAI-compatible proxy with semantic routing and load balancing across OpenAI, Anthropic, Ollama, vLLM, and any compatible ba | Go | 69 |
| [solarch](https://github.com/solarch-dev/solarch) | Diagram→code through a deterministic rules gate: the AI proposes, 50 rules verify, only valid architecture lands. Try it: app.solarch.dev | TypeScript | 47 |
| [watermarks-remover](https://github.com/guillaumemeyer/watermarks-remover) | Watermarks-remover addresses the need to strip AI provenance marks and hidden metadata from text and files that users own, covering invisible Unicode | — | 0 |
| [Get Shit Done](https://github.com/glittercowboy/get-shit-done) | Get Shit Done (GSD) is a meta-prompting and context engineering system designed to enhance the reliability of AI-assisted software development. It add | — | 0 |
| [book-to-skill](https://github.com/Leutenegger/book-to-skill) | **book-to-skill** is a CLI tool that converts technical books, documentation folders, or any structured prose into a standardized agent skill consumab | — | 0 |

### CI/CD, developer productivity & engineering operations

CI/CD, build and release automation, developer portals, developer experience, and engineering operations.

#### Core (7)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Checkout v7](https://github.com/actions/checkout) | The `actions/checkout@v7` action enables GitHub Actions workflows to clone and access a repository's source code within the runner environment, making | TypeScript | 8,576 |
| [Apache Maven](https://github.com/apache/maven) | Apache Maven is a widely-used software project management and comprehension tool that simplifies the build process for Java-based projects. It address | Java | 5,292 |
| [Pipedash](https://github.com/hcavarsan/pipedash) | Pipedash is a unified platform designed to manage and monitor CI/CD pipelines from multiple providers, including GitHub Actions, GitLab CI, Jenkins, a | Rust | 1,009 |
| [actrun](https://github.com/mizchi/actrun) | actrun is a local GitHub Actions runner built using the MoonBit language, designed to facilitate running and debugging workflows locally. It provides | MoonBit | 627 |
| [news-dashboard](https://github.com/lihor-hub/news-dashboard) | News Dashboard is a self-hosted, technical-focused RSS reader and news triage platform that consolidates curated feeds from Python, AI/LLM, agents, cl | Python | 22 |
| [nextjs-finance-saas](https://github.com/code-with-antonio/nextjs-finance-saas) | Nextjs-finance-saas is a Software-as-a-Service application built with Next.js for managing personal or business finance, providing users with tools to | TypeScript | 19 |
| [devops-interviews](https://github.com/devops-interviews/devops-interviews) | compiles 115 real, hands-on interview questions and solutions designed to prepare candidates for DevOps and SRE roles. The questions are sourced from | — | 0 |

#### Adjacent (28)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [free-for-dev](https://github.com/ripienaar/free-for-dev) | A curated, community-maintained directory of SaaS, PaaS, and IaaS offerings that provide free tiers specifically useful for infrastructure developers, | HTML | 130,947 |
| [Agent Starter Pack](https://github.com/GoogleCloudPlatform/agent-starter-pack) | The Agent Starter Pack is a Python package designed to accelerate the deployment of production-ready Generative AI agents on Google Cloud. It provides | Python | 6,275 |
| [claude-code-showcase](https://github.com/ChrisWiles/claude-code-showcase) | Comprehensive Claude Code project configuration example with hooks, skills, agents, commands, and GitHub Actions workflows | JavaScript | 6,026 |
| [Grok CLI](https://github.com/superagent-ai/grok-cli) | Grok CLI is an open-source, terminal-native autonomous agent powered by the Grok AI model, designed for advanced coding and workflow automation. Built | TypeScript | 2,934 |
| [aur-malware-check](https://github.com/lenucksi/aur-malware-check) | The June 2026 "atomic-lockfile" attack compromised over 1,600 Arch User Repository packages by injecting malicious `npm install atomic-lockfile`, `bun | Python | 2,067 |
| [Skill Scanner](https://github.com/cisco-ai-defense/skill-scanner) | Skill Scanner is a security tool designed to detect threats within AI Agent Skills, focusing on prompt injection, data exfiltration, and malicious cod | Python | 1,784 |
| [Perseus](https://github.com/Khan/perseus) | Perseus is Khan Academy's exercise system, serving as an editor and renderer for educational problems. This repository contains the code necessary to | TypeScript | 1,557 |
| [Continuous Claude](https://github.com/AnandChowdhary/continuous-claude) | Continuous Claude is an automated workflow designed to run Claude Code in a continuous loop for large, multi-step software projects. It leverages shel | Shell | 1,306 |
| [Full-Stack Next.js + Cloudflare](https://github.com/ifindev/fullstack-next-cloudflare) | provides a production-ready template for building full-stack applications using Next.js 15 and Cloudflare's powerful edge infrastructure. It leverages | TypeScript | 1,253 |
| [Better Hub](https://github.com/better-auth/better-hub) | Better Hub is a project focused on re-imagining code collaboration for both human developers and AI agents on GitHub. It aims to significantly improve | TypeScript | 1,187 |
| [MMDR](https://github.com/1jehuang/mermaid-rs-renderer) | MMDR is a high-performance, native Rust library designed to render Mermaid diagrams directly to SVG without requiring any browser dependencies. It eli | Rust | 1,156 |
| [Taskmaster](https://github.com/blader/taskmaster) | Taskmaster is a shell-based completion guard designed for coding agents like Claude and Codex, addressing the failure mode where agents stop premature | Shell | 494 |
| [ten-proofs](https://github.com/openai/ten-proofs) | This repository provides Lean 4 formalizations of ten open mathematical problems spanning combinatorics, coding theory, group theory, quantum computin | Lean | 477 |
| [galaxy-profile](https://github.com/vinimlo/galaxy-profile) | Galaxy Profile is a Python-based project that transforms a standard GitHub profile into a dynamic, animated space-themed visualization. It automatical | Python | 462 |
| [CloudMeet](https://github.com/dennisklappe/CloudMeet) | CloudMeet is an open-source, free meeting scheduler designed as an alternative to Calendly, hosted entirely on Cloudflare's free tier. Built with Type | TypeScript | 418 |
| [Stormkit](https://github.com/stormkit-io/stormkit-io) | Stormkit is a self-hostable platform designed as an alternative to services like Vercel and Netlify for deploying modern web applications. It provides | Go | 221 |
| [Ziit](https://github.com/0PandaDEV/Ziit) | Ziit is an open-source, self-hostable solution designed as the Swiss army knife for code time tracking. It serves as a private alternative to tools li | TypeScript | 219 |
| [cryload](https://github.com/sdogruyol/cryload) | Cryload is a powerful and fast HTTP benchmarking tool designed for stress testing APIs and web services. Built using the Crystal programming language, | Crystal | 180 |
| [GitDeepSearch](https://github.com/simonmakzon/GitDeepSearch) | GitDeepSearch is a React-based web application that lets users find GitHub repositories and developers using plain natural language instead of GitHub' | JavaScript | 165 |
| [pikoci](https://github.com/pikoci/pikoci) | The CI/CD that grows with you. One binary, any database, runs anywhere. | Go | 147 |
| [lora-speedrun](https://github.com/Saivineeth147/lora-speedrun) | LoRA Speedrun is an open benchmarking arena that challenges practitioners to fine-tune models as fast as possible under strict, frozen conditions: fix | Python | 144 |
| [Acquisitions](https://github.com/adrianhajdin/acquisitions) | showcases the development of a secure, scalable API built using modern DevOps practices. The project utilizes a robust backend stack featuring Node.js | HTML | 119 |
| [Ceviz](https://github.com/productdevbook/ceviz) | Ceviz is a lightning-fast performance analyzer designed to automatically detect performance issues within TypeScript codebases. It scans the codebase | TypeScript | 92 |
| [Deploy-Center-Server](https://github.com/FutureSolutionDev/Deploy-Center-Server) | Self-hosted CI/CD deployment platform with persistent queue (BullMQ + Redis), encrypted env vars, multi-channel notifications (Discord/Slack/Email), r | TypeScript | 25 |
| [Collo.dev](https://github.com/plusai-solutions/ai-scrum-master-template) | An open-source template that turns your repo into an autonomous development team. Uses GitHub Actions and Claude to orchestrate AI agents under the sc | — | 22 |
| [Shipit](https://github.com/dabit3/shipit) | Shipit is a production-readiness validator designed to catch common deployment mistakes before an application is shipped. Inspired by the "guard befor | JavaScript | 9 |
| [Primer](https://github.com/pierceboggan/primer) | AgentRC is a framework designed for context engineering in AI coding agents, ensuring they have the necessary knowledge of a codebase's architecture, | — | 0 |
| [App-Store-Connect-CLI](https://github.com/rudrankriyam/App-Store-Connect-CLI) | App-Store-Connect-CLI (asc) is a fast, lightweight, and scriptable command-line interface designed to interact with the App Store Connect API. It prov | — | 0 |

## Use Notes

This catalog is for discovery and should not be treated as a security assessment, authorization to collect information, endorsement, license evaluation, or production-readiness decision. Before adoption, review each project’s current documentation, data sources, operational model, privacy implications, permissions, security posture, maintenance activity, dependencies, and license. Ensure any OSINT or security activity is authorized, passive where appropriate, and compliant with applicable law and platform terms. [1]

*Stars are the counts recorded in the attached dataset, not live GitHub values.*

## References

[1]: repo_showcase_merged.json (user-supplied repository dataset, analyzed August 18, 2026)
