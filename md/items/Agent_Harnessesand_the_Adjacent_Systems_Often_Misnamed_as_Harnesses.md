# Agent Harnesses—and the Adjacent Systems Often Misnamed as Harnesses

> **Scope.** This catalog is curated solely from the supplied `repo_showcase_merged.json` dataset. It distinguishes true agent harnesses from the adjacent categories that are frequently called harnesses in casual usage: orchestrators, gateways, clients, runtimes, protocol layers, memory systems, and control planes. Repository metadata and star counts are source snapshots, not live assessments. [1]

## Taxonomy: What Each Category Actually Is

The word **harness** is useful only when it refers to an execution-control layer that runs, constrains, provisions, supervises, or tests agents. The repository inventory below deliberately separates that function from the neighboring systems that often coexist with it. [1]

| Catalog category | Accurate label | Why it differs from a harness |
| --- | --- | --- |
| Agent harnesses, test harnesses & execution control | **Harness** | A harness runs, constrains, provisions, supervises, or evaluates agents in an execution loop; it is the closest match to the term in this catalog. |
| Agent orchestration, multi-agent workflows & planning | **Orchestrator** | An orchestrator coordinates tasks, plans, agents, state transitions, and workflows. It is often called a harness, but its main function is coordination. |
| LLM, agent & MCP gateways / proxies | **Gateway / proxy** | A gateway routes, normalizes, secures, observes, or governs traffic between models, agents, providers, and tools; it does not itself harness agents. |
| Agent clients, chat interfaces & operator consoles | **Client / operator console** | A client gives people a user-facing interface for operating agents or models. It may control a harness, but is not inherently one. |
| Agent runtimes, sandboxes & computer-use environments | **Runtime / environment** | A runtime or sandbox supplies the execution environment—compute, isolation, browsers, desktops, or tool access—rather than the agent-control policy. |
| MCP, agent protocols & tool interoperability | **Protocol / interoperability layer** | Protocol hosts, registries, and reusable bridges make tools interoperable with agents. Individual one-off adapters were intentionally filtered out. |
| Agent memory, context & state coordination | **Memory / state layer** | Memory systems persist, retrieve, and synchronize context and state. They are infrastructure used by harnesses and orchestrators. |
| Agent evaluation, observability, safety & governance | **Control plane** | Evaluation, tracing, guardrails, and governance monitor or constrain agent behavior. They complement a harness rather than necessarily executing one. |

## Curation Summary

The source dataset contains **6,327 unique repositories**. A high-recall pass surfaced 711 candidates; semantic review and a strict reuse-oriented audit retained **362 Core repositories** and **55 Adjacent repositories**, for **417 catalog entries**. Individual, one-off MCP adapters and generic agent applications were excluded unless their metadata demonstrated reusable infrastructure value. [1]

| Category | Core | Adjacent | Total |
| --- | ---: | ---: | ---: |
| Agent harnesses, test harnesses & execution control | 67 | 6 | 73 |
| Agent orchestration, multi-agent workflows & planning | 104 | 30 | 134 |
| LLM, agent & MCP gateways / proxies | 27 | 2 | 29 |
| Agent clients, chat interfaces & operator consoles | 25 | 1 | 26 |
| Agent runtimes, sandboxes & computer-use environments | 31 | 2 | 33 |
| MCP, agent protocols & tool interoperability | 57 | 10 | 67 |
| Agent memory, context & state coordination | 32 | 3 | 35 |
| Agent evaluation, observability, safety & governance | 19 | 1 | 20 |

## Complete Categorized Catalog

**Core** entries are reusable platforms directly fitting the category. **Adjacent** entries provide clear supporting functionality but are not primarily that category. Entries within each group are ordered by review confidence followed by the source star snapshot. [1]

### Agent harnesses, test harnesses & execution control

> **Classification:** **Harness**. A harness runs, constrains, provisions, supervises, or evaluates agents in an execution loop; it is the closest match to the term in this catalog.

#### Core (67)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) | Plugin-based open-source agent harness from Deep Seek. | TypeScript | 149,495 |
| [Pi Agent Harness](https://github.com/earendil-works/pi) | Modular TypeScript toolkit and runtime for building, sandboxing, and running coding agents with multi-provider LLM support. | TypeScript | 81,580 |
| [DeerFlow - 2.0](https://github.com/bytedance/deer-flow) | Long-horizon SuperAgent harness with sandboxes, memories, tools, subagents and a message gateway. | Python | 80,171 |
| [autogen](https://github.com/microsoft/autogen) | Programming framework for building and running agentic AI. | Python | 60,473 |
| [CodeWhale](https://github.com/Hmbown/CodeWhale) | Community-driven open-source agent harness. | Rust | 39,094 |
| [Pi Monorepo](https://github.com/badlogic/pi-mono) | TypeScript monorepo with agent runtime, multi-provider LLM API, tool calling, and deployment/UI tooling for agents. | TypeScript | 36,938 |
| [AstrBot](https://github.com/AstrBotDevs/AstrBot) | All-in-one agent chatbot platform with plugin ecosystem and an Agent Sandbox for safe code execution. | Python | 30,179 |
| [Deepagents](https://github.com/langchain-ai/deepagents) | Batteries-included agent harness from LangChain providing an execution harness for agents. | Python | 27,862 |
| [Agent Lightning](https://github.com/microsoft/agent-lightning) | Framework for optimizing and training agentic AIs (RL, automatic prompt optimization) across frameworks. | Python | 16,937 |
| [prime-agent](https://github.com/PrimeIntellect-ai/prime-agent) | Coding and research agent with a Continual Harness, persistent control env, and daemon sessions. | TypeScript | 16,898 |
| [jcode](https://github.com/1jehuang/jcode) | Focused coding-agent harness providing a structured runtime and primitives for reliable agent execution. | Rust | 14,682 |
| [OpenHarness](https://github.com/HKUDS/OpenHarness) | Open agent harness project with a built-in personal agent. | Python | 14,227 |
| [superset](https://github.com/superset-sh/superset) | IDE/workspace to run many coding agents locally, manage sessions and run agent workloads on your machine. | TypeScript | 12,998 |
| [qm](https://github.com/yc-software/qm) | Multiplayer, org-focused agent harness providing isolated per-user workspaces, sandboxes, and admin controls. | TypeScript | 11,438 |
| [shive](https://github.com/aden-hive/hive) | Multi-agent execution harness for moving agents from prototype to production workflows. | Python | 10,079 |
| [holaOS](https://github.com/holaboss-ai/holaOS) | All-in-one AI agent workspace to run agents across apps, files, browsers with shared memory. | TypeScript | 9,205 |
| [Omnigent](https://github.com/omnigent-ai/omnigent) | Meta harness/control plane for coding agents with governance, budget caps, secure cloud sandboxes and live collaborative sessions. | Python | 7,992 |
| [LoopX](https://github.com/huangruiteng/loopx) | Provider-neutral control plane for long-running, multi-agent work with a compact state kernel and human-gated actions. | Python | 4,859 |
| [OpenAgentsControl](https://github.com/darrenhinde/OpenAgentsControl) | Plan-first AI agent framework with approval-based execution and validation. | TypeScript | 4,736 |
| [Desloppify](https://github.com/peteromallet/desloppify) | Agent harness to iteratively detect and fix code quality issues with persistent state and prioritized loops. | Python | 2,747 |
| [LazyCodex](https://github.com/code-yeongyu/lazycodex) | Agent harness for complex codebases: project memory, planning, execution, and verified completion inside Codex. | TypeScript | 2,057 |
| [DataClaw](https://github.com/peteromallet/dataclaw) | Agent harness to convert agent session logs into redacted, structured datasets for publishing. | Python | 2,052 |
| [thepopebot](https://github.com/stephengpope/thepopebot) | Autonomous agent framework with event handlers, Docker-based agents and CI integration. | JavaScript | 1,700 |
| [LLM Space 4](https://github.com/deer-flow/llm-space) | Desktop app for prototyping, debugging, tracing and evaluating LLM agents. | TypeScript | 1,437 |
| [Synara](https://github.com/Emanuele-web04/synara) | Local-first desktop app unifying multiple AI coding agents, acting as an MCP-native agent harness and workspace. | TypeScript | 1,409 |
| [ORG2](https://github.com/yorgai/ORG2) | Cursor-style agent IDE with a built-in Rust harness, diff review, command inspection and policy enforcement for operator control. | TypeScript | 1,292 |
| [thClaws](https://github.com/thClaws/thClaws) | Rust-based open-source agent harness (GUI/CLI/headless) with MCP and plugins. | Rust | 1,131 |
| [Mini-Coding-Agent](https://github.com/rasbt/mini-coding-agent) | Minimal, readable Python coding agent harness demonstrating core harness components. | Python | 959 |
| [Clodex](https://github.com/mereyabdenbekuly-ctrl/clodex-ide) | Local-first agentic IDE that preserves workspace state, mediates agent actions, and exposes MCP tools. | TypeScript | 861 |
| [Blades](https://github.com/go-kratos/blades) | Go-based multimodal agent framework with pluggable model providers, chains, prompts and middleware. | Go | 758 |
| [shuo](https://github.com/NickTikhonov/shuo) | Real-time phone voice-agent framework with streaming, interruption handling, and orchestration. | Python | 636 |
| [labs-OO-Agents](https://github.com/NVIDIA-NeMo/labs-OO-Agents) | Python object-oriented agent framework that runs agents as Python classes with a REPL-style runtime and tooling. | Python | 618 |
| [munder-difflin](https://github.com/chaitanyagiri/munder-difflin) | Local multi-agent harness for running and managing agent execution. | TypeScript | 595 |
| [cliare](https://github.com/modiqo/cliare) | CLI Agent Readiness Evaluation (CLIARE) audits CLI binaries for agent-driven usage and produces evidence-backed artifacts. | Rust | 593 |
| [Cordum](https://github.com/cordum-io/cordum) | Agent Control Plane offering governance, pre-exec checks, approval gates, and audit trails for autonomous agents. | Go | 465 |
| [lfg](https://github.com/BennyKok/lfg) | Self-hosted control plane that runs AI coding agents in long-lived sessions and exposes an MCP server for integration. | TypeScript | 358 |
| [lemma-platform](https://github.com/lemma-work/lemma-platform) | Workspace platform unifying humans and agents with pods, runtimes, ACLs, and agent hosts. | Python | 354 |
| [agent-harness-generator](https://github.com/ruvnet/agent-harness-generator) | Meta-harness scaffolding to generate agent harnesses with MCP server, memory, sandboxing and CLI. | TypeScript | 331 |
| [inferoa](https://github.com/agentic-in/inferoa) | Tokenmaxxing, inference-native agent harness for loop engineering and inference optimization. | TypeScript | 295 |
| [Jarvis AI Agent](https://github.com/Xthebuilder/JRVS) | Local-first AI agent framework with RAG, MCP/UTCP tool protocols, and support for local LLM backends and memory stores. | Python | 236 |
| [SmallClaw](https://github.com/XposeMarket/SmallClaw) | Local-first AI agent framework providing tools (files, web, browser, terminal) and a skills system for agent execution. | TypeScript | 234 |
| [BossConsole](https://github.com/risa-labs-inc/BossConsole) | Cross-platform desktop harness for AI coding agents exposing 100+ MCP tools, plugins, governance, and multithreading. | Kotlin | 210 |
| [fak](https://github.com/anthony-chaudhary/fak) | Go-based fused agent kernel managing context, tool-call policy, caching, and crash-resume. | Go | 26 |
| [agentic-operator-core](https://github.com/Clawdlinux/agentic-operator-core) | Kubernetes operator providing in-cluster governance, isolation, auditing and runtime adapters for agents. | Go | 22 |
| [oh-my-opencode](https://github.com/code-yeongyu/oh-my-opencode) | Batteries-included agent harness for coding agents (Sisyphus). | — | 0 |
| [infiAgent](https://github.com/ChenglinPoly/infiAgent) | Agent framework offering unlimited runtime, resume, execution modes and persistent task history. | — | 0 |
| [Embabel Agent Framework](https://github.com/embabel/embabel-agent) | JVM/Kotlin framework modeling agentic flows, GOAP planning, actions and execution control. | — | 0 |
| [Bevel](https://github.com/bevel.software/bevel) | Git Control Plane runtime for deterministic, auditable, sandboxed agent workflows. | — | 0 |
| [LobeHub](https://github.com/lobehub/lobehub) | Framework for creating, collaborating, and managing agent teammates and dynamic teams. | TypeScript | 81,013 |
| [Paperclip](https://github.com/paperclipai/paperclip) | Open-source orchestration platform aiming to run autonomous "zero-human" companies. | TypeScript | 78,704 |
| [zeroclaw](https://github.com/zeroclaw-labs/zeroclaw) | Lightweight infrastructure to deploy fully autonomous AI assistant stacks. | Rust | 32,608 |
| [pydantic-ai](https://github.com/pydantic/pydantic-ai) | Pydantic-based agent framework/shim to integrate Pydantic models with LLMs for harnessing agent inputs/outputs. | Python | 19,354 |
| [agent-zero](https://github.com/agent0ai/agent-zero) | Agent Zero AI framework for building and running agents. | Python | 18,898 |
| [Trellis](https://github.com/mindfold-ai/Trellis) | Framework for building structured AI reasoning systems and harnessed workflows. | TypeScript | 11,252 |
| [AutoAgent](https://github.com/HKUDS/AutoAgent) | Zero-code, fully automated LLM agent framework for deploying and running agents. | Python | 9,735 |
| [Webwright](https://github.com/microsoft/Webwright) | Browser-agent framework for long-horizon web tasks and control. | Python | 5,922 |
| [1Code](https://github.com/21st-dev/1code) | UI for running code agents in parallel (ClaudeCode, OpenCode, Codex). | TypeScript | 5,611 |
| [MetaClaw](https://github.com/aiming-lab/MetaClaw) | Agent framework for continual/meta-learning with persistent cross-session memory and training support. | Python | 3,433 |
| [deepclaude](https://github.com/aattaran/deepclaude) | Adapter to run Claude Code-style autonomous agent loops on alternative backends. | JavaScript | 2,249 |
| [Agentic Coding Flywheel Setup (ACFS)](https://github.com/Dicklesworthstone/agentic_coding_flywheel_setup) | Bootstrap setup to provision a VPS into a multi-agent AI development environment quickly. | TypeScript | 1,393 |
| [FleetCode](https://github.com/built-by-as/FleetCode) | Desktop terminal that runs multiple isolated CLI coding agent sessions with persistent worktrees and MCP config. | TypeScript | 411 |
| [ProductSpec](https://github.com/gokulrajaram/ProductSpec) | Open standard 'Product Harness' plus MCP server and agent skills for validating product intent and execution. | TypeScript | 217 |
| [gbase](https://github.com/garyqlin/gbase) | Recursive self-improvement agent framework with memory, quality gates, identity, and tools. | Python | 168 |
| [cast](https://github.com/yaodub/cast) | Self-hosted multi-user harness to run and share AI agents locally. | TypeScript | 38 |
| [MetaChain](https://github.com/HKUDS/MetaChain) | Zero-code, fully automated LLM agent framework positioning itself as an agent runtime. | — | 0 |
| [KADATH](https://github.com/i3T4AN/KADATH) | Evolutionary framework that spawns, grades, isolates and schedules populations of agents. | — | 0 |
| [Agent-E](https://github.com/EmergenceAI/Agent-E) | Agent-driven automation framework focused on web automation and agent workflows. | Python | 1,249 |

#### Adjacent (6)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [eve-software-factory-template](https://github.com/vercel-labs/eve-software-factory-template) | Software factory template that orchestrates agents in sandboxed stages with persistent factory memory. | — | 0 |
| [semantic-kernel](https://github.com/microsoft/semantic-kernel) | SDK to integrate LLMs and build agent-like apps, including orchestration and skill features. | C# | 28,459 |
| [Gitagent](https://github.com/open-gitagent/gitagent) | Git-native, framework-agnostic standard for defining AI agents. | TypeScript | 2,697 |
| [enterprise-deep-research](https://github.com/SalesforceAIResearch/enterprise-deep-research) | Salesforce platform for enterprise deep-research agents, with tooling for multi-agent experiments. | Python | 1,199 |
| [the-library](https://github.com/disler/the-library) | Meta-skill for private-first distribution of skills, agents, and prompts across agents, devices, and teams. | Just | 407 |
| [motia](https://github.com/MotiaDev/motia) | AI agent framework aimed at software engineers for building agent applications. | — | 0 |

### Agent orchestration, multi-agent workflows & planning

> **Classification:** **Orchestrator**. An orchestrator coordinates tasks, plans, agents, state transitions, and workflows. It is often called a harness, but its main function is coordination.

#### Core (104)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [langflow](https://github.com/langflow-ai/langflow) | Visual/flow-based builder for AI agents and workflows. | Python | 153,367 |
| [ruflo](https://github.com/ruvnet/ruflo) | Meta-harness for deploying and coordinating multi-agent swarms (Claude-focused). | TypeScript | 61,721 |
| [CrewAI](https://github.com/crewAIInc/crewAI) | Framework to orchestrate collaborative, role-playing autonomous AI agents. | Python | 57,216 |
| [oh-my-claudecode](https://github.com/Yeachan-Heo/oh-my-claudecode) | TypeScript multi-agent orchestration framework tailored for Claude Code with CLI and skills. | TypeScript | 29,716 |
| [NanoClaw](https://github.com/qwibitai/nanoclaw) | Lightweight containerized agent platform connecting messaging apps with scheduled jobs and memory. | TypeScript | 27,468 |
| [Symphony](https://github.com/openai/symphony) | Open-source framework that coordinates multiple AI agents on structured tasks. | Elixir | 26,717 |
| [AgentScope](https://github.com/agentscope-ai/agentscope) | Framework to build, run, manage and orchestrate agents with message hubs, A2A protocols and deployment options. | Python | 23,965 |
| [swarm](https://github.com/openai/swarm) | Educational framework for lightweight multi-agent orchestration by OpenAI. | Python | 21,909 |
| [camel](https://github.com/camel-ai/camel) | Multi-agent framework for building and scaling agent interactions and societies. | Python | 17,598 |
| [Eigent](https://github.com/eigent-ai/eigent) | Desktop app to build and manage custom AI workforces and multi-agent workflows locally. | TypeScript | 13,639 |
| [Nanobrowser](https://github.com/nanobrowser/nanobrowser) | Chrome extension for AI-powered web automation that runs multi-agent workflows via user LLM keys. | TypeScript | 13,567 |
| [Microsoft Agent Framework](https://github.com/microsoft/agent-framework) | Framework for building, orchestrating and deploying AI agents and multi-agent workflows (Python/.NET). | Python | 12,857 |
| [PocketFlow](https://github.com/The-Pocket/PocketFlow) | Compact LLM framework enabling agents to build and coordinate other agents and workflows. | Python | 11,108 |
| [Eino](https://github.com/cloudwego/eino) | Go-based AI framework/ADK with agent primitives, workflow composition and DeepAgent delegation. | Go | 10,710 |
| [Astron Agent](https://github.com/iflytek/astron-agent) | Enterprise platform for building SuperAgents, orchestration, model management and RPA. | Java | 9,438 |
| [Spring AI Alibaba](https://github.com/alibaba/spring-ai-alibaba) | Java framework for building agentic, workflow and multi-agent applications with orchestration and A2A communication. | Java | 9,297 |
| [Agent Development Kit](https://github.com/google/adk-go) | Go toolkit for building, orchestrating, evaluating and deploying modular multi-agent systems in cloud-native settings. | Go | 7,593 |
| [Agent Starter Pack](https://github.com/GoogleCloudPlatform/agent-starter-pack) | GCP-focused starter pack with templates and infra to deploy, monitor and operate production-ready AI agents. | Python | 6,275 |
| [ROMA](https://github.com/sentient-agi/ROMA) | Meta-agent framework for building recursive, high-performance multi-agent systems. | Python | 5,159 |
| [eko](https://github.com/FellouAI/eko) | Production-ready agentic workflow framework for building natural-language-driven multi-agent workflows. | TypeScript | 4,951 |
| [agency-swarm](https://github.com/VRSEN/agency-swarm) | Open-source agent orchestration framework built on top of the OpenAI Assistants API. | Python | 4,529 |
| [Craft Agents](https://github.com/lukilabs/craft-agents-oss) | Framework for structured multi-agent workflows coordinating tasks through defined workflows. | TypeScript | 4,354 |
| [langroid](https://github.com/langroid/langroid) | Library for harnessing LLMs with multi-agent programming and coordination patterns. | Python | 4,099 |
| [Koog](https://github.com/JetBrains/koog) | Kotlin framework for enterprise-ready AI agents with persistence, memory, and observability. | Kotlin | 4,084 |
| [DeepResearchAgent](https://github.com/SkyworkAI/DeepResearchAgent) | Hierarchical multi-agent system with top-level planning and specialized workers. | Python | 3,518 |
| [BeeAI Framework](https://github.com/i-am-bee/beeai-framework) | Framework for building production-ready multi-agent systems with LLMs in Python and TypeScript. | Python | 3,220 |
| [tutti](https://github.com/tutti-os/tutti) | Shared workspace enabling humans and AI agents to collaborate with unified context and monitoring. | TypeScript | 3,202 |
| [Dimos](https://github.com/dimensionalOS/dimos) | Agentic operating system for robotics enabling multi-agent interaction with sensors and actuators. | Python | 2,979 |
| [firstmate](https://github.com/kunchenguid/firstmate) | Agent distribution to run and supervise multiple coding crewmates with isolated sessions and worktrees. | Shell | 2,555 |
| [ouroboros](https://github.com/Q00/ouroboros) | Specification-first workflow engine guiding AI coding agents from idea to verified, working code. | Python | 2,417 |
| [LLMStack](https://github.com/trypromptly/LLMStack) | No-code multi-agent framework to build LLM agents, workflows, and applications with your data. | Python | 2,309 |
| [AgentsMesh](https://github.com/AgentsMesh/AgentsMesh) | AI Agent Workforce Platform to run, schedule, isolate, and steer many agents from one console. | Go | 2,242 |
| [harmonist](https://github.com/GammaLabTechnologies/harmonist) | Portable multi-agent orchestration engine with 186 specialized agents and zero runtime dependencies. | Python | 2,023 |
| [AgentFlow](https://github.com/lupantech/AgentFlow) | Framework for optimizing agentic planning and tool use to improve multi-step agent workflows. | Python | 2,005 |
| [Memoh](https://github.com/memohai/Memoh) | Open-source multi-agent platform with per-agent compute, networking and long-term memory. | Go | 1,973 |
| [open-agent-platform](https://github.com/langchain-ai/open-agent-platform) | Open-source, no-code platform for building and orchestrating agents. | TypeScript | 1,902 |
| [uAgents at aiagentslive.com](https://github.com/fetchai/uAgents) | Lightweight framework for creating decentralized, multi-agent systems. | Python | 1,636 |
| [langgraph-swarm-py](https://github.com/langchain-ai/langgraph-swarm-py) | LangGraph Python package for multi-agent orchestration (swarm support). | Python | 1,554 |
| [zeroshot CLI](https://github.com/covibes/zeroshot) | CLI that orchestrates multi-agent coding workflows with planners, validators, and isolated runs. | JavaScript | 1,412 |
| [Orchestrator](https://github.com/Danau5tin/multi-agent-coding-system) | Multi-agent AI coding orchestrator coordinating explorer and coder agents. | Python | 1,368 |
| [TAKT](https://github.com/nrslib/takt) | YAML-based topology to define agent coordination, interventions, and recording. | TypeScript | 1,288 |
| [ClawTeam-OpenClaw](https://github.com/win4r/ClawTeam-OpenClaw) | Framework for multi-agent swarm coordination enabling autonomous task splitting, communication and worker spawning. | Python | 1,283 |
| [FAROS](https://github.com/OpenNSWM-Lab/FAROS) | Blueprint-driven AutoResearch runtime to orchestrate AI research workflows end-to-end. | Python | 1,240 |
| [Overstory](https://github.com/jayminwest/overstory) | TypeScript framework spawning worker agents in git worktrees and coordinating via a mail system. | TypeScript | 1,222 |
| [multi-agent-shogun](https://github.com/yohey-w/multi-agent-shogun) | Shell/tmux system to orchestrate parallel AI coding agents in a hierarchical model. | Shell | 1,219 |
| [tribe](https://github.com/StreetLamb/tribe) | Low-code tool to build and coordinate multi-agent teams. | TypeScript | 1,081 |
| [experts](https://github.com/metaskills/experts) | Library to create/deploy OpenAI Assistants and link them as tools for multi-agent systems. | JavaScript | 1,066 |
| [OpenOPC](https://github.com/HKUDS/OpenOPC) | Framework to build a personal AI-native company with role-based agent orchestration. | Python | 1,032 |
| [fugu](https://github.com/SakanaAI/fugu) | Multi-agent orchestration system that coordinates frontier LLMs via a single API. | Shell | 939 |
| [AgentSpace](https://github.com/HKUDS/AgentSpace) | Agent-native collaborative workspace that routes, schedules and governs multi-agent workflows. | TypeScript | 904 |
| [LatentMAS](https://github.com/Gen-Verse/LatentMAS) | Multi-agent reasoning framework using latent-space communication for coordinated LLM collaboration. | Python | 879 |
| [agent-swarm](https://github.com/desplega-ai/agent-swarm) | Agentic operating system for company-scale multi-agent workflows and orchestration. | TypeScript | 704 |
| [agent-relay](https://github.com/AgentWorkforce/relay) | Real-time communication framework/SDK for spawning and coordinating messages between AI agents. | TypeScript | 615 |
| [graphbit](https://github.com/InfinitiBit/graphbit) | Enterprise-grade agentic AI framework (Rust core, Python wrapper) for reliable, scalable multi-agent workflows. | Rust | 577 |
| [pilotfish](https://github.com/Nanako0129/pilotfish) | Multi-model orchestration layer that routes workloads among Claude Code models and subagents. | Python | 561 |
| [claude-code-sub-agent-collective](https://github.com/vanzan01/claude-code-sub-agent-collective) | Hub-and-spoke multi-agent collective using Claude Code for coordinated context engineering. | JavaScript | 523 |
| [Citadel](https://github.com/SethGammon/Citadel) | Agent orchestration harness/OS to manage and scale autonomous engineering agents. | JavaScript | 504 |
| [runagent](https://github.com/runagent-dev/runagent) | Serverless deployment tooling and CLI/SDK for invoking and streaming AI agents. | Python | 481 |
| [Agent View](https://github.com/Frayo44/agent-view) | Terminal-based dashboard to manage multiple AI coding assistant sessions using tmux, notifications, and git worktrees. | TypeScript | 349 |
| [Laddr](https://github.com/AgnetLabs/Laddr) | Python framework for building scalable, distributed multi-agent systems with queues, coordinators, and observability. | Python | 337 |
| [agents-council](https://github.com/0xwilliamortiz/agents-council) | Multi-agent collaboration plugin that runs multiple AI CLIs in parallel and synthesizes a consensus recommendation. | JavaScript | 293 |
| [superhq](https://github.com/superhq-ai/superhq) | Sandboxed AI agent orchestration platform for running and managing isolated agent tasks. | Rust | 276 |
| [Puzld](https://github.com/MedChaouch/Puzld.ai) | Terminal-native framework for orchestrating multiple LLMs/agents with routing, pipelines, memory, and observation layers. | TypeScript | 260 |
| [Gru](https://github.com/zscole/gru) | Self-hosted service to spin up specialized agents that work in parallel, with persistent memory and integrations for control channels. | Python | 216 |
| [collective-intelligence](https://github.com/ailinone/collective-intelligence) | Collective intelligence engine coordinating many models with diverse strategies, routing, audits and model ensemble logic. | TypeScript | 170 |
| [agentic-os](https://github.com/modimihir07/agentic-os) | Multi-agent orchestration platform with scheduler, skills hub, memory, and analytics. | JavaScript | 144 |
| [Orloj](https://github.com/OrlojHQ/orloj) | Orchestration runtime declaring agents, tools, and policies in YAML to schedule, route, and govern them. | Go | 106 |
| [Fractera](https://github.com/Fractera/Agent-Engineering-Infrastructure) | Self-hosted agent engineering infra orchestrating multiple code-generation engines. | TypeScript | 54 |
| [hive](https://github.com/ivankuznetsov/hive) | Open-source workflow engine/meta-harness to run folder-as-agent multi-step pipelines. | Ruby | 27 |
| [AI-Team-Orchestrator](https://github.com/khaoss85/AI-Team-Orchestrator) | Multi-agent AI platform with quality gates, real-time processes, and orchestration. | Python | 20 |
| [Agent-Router](https://github.com/dabit3/agent-router) | TypeScript framework for intelligently routing tasks across heterogeneous multi-agent systems. | TypeScript | 6 |
| [Agent-Manifest](https://github.com/dabit3/agent-manifest) | JSON schema and CLI standard for declaring agent capabilities, inputs, outputs and behaviors. | TypeScript | 4 |
| [Volcano SDK](https://github.com/Kong/volcano-sdk) | TypeScript SDK for building multi-provider, multi-agent workflows with chaining, branching, observability and retries. | — | 0 |
| [TinyClaw](https://github.com/jlia0/tinyclaw) | Multi-agent, multi-team orchestration platform with dashboard, multi-channel UIs, multi-provider support and persistent sessions. | — | 0 |
| [sympozium](https://github.com/AlexsJones/sympozium) | Kubernetes-native platform to deploy, manage and scale fleets of ephemeral multi-agent Pods. | — | 0 |
| [swarm-forge](https://github.com/unclebob/swarm-forge) | Orchestrates swarms of AI coding agents in tmux sessions and isolated git worktrees. | — | 0 |
| [Octop](https://github.com/TencentCloud/Octop) | Self-hosted multi-user, multi-agent assistant platform with dashboard and IM integrations. | — | 0 |
| [multi-agent-discuss](https://github.com/sjc88661/multi-agent-discuss) | Local-first control room orchestrating coding agents with PTY sessions, event sourcing, and review flows. | — | 0 |
| [GHOSTCREW](https://github.com/GH05TCREW/ghostcrew) | AI-powered pentesting framework supporting autonomous agents, multi-agent crews, playbooks, and tool execution. | — | 0 |
| [diri](https://github.com/cristicretu/diri) | macOS native orchestrator for coding agents with PTY session management and MCP server. | — | 0 |
| [Continuous Claude](https://github.com/parcadei/Continuous-Claude-v2) | Persistent multi-agent environment for Claude that maintains and compounds context across sessions. | — | 0 |
| [Constellation Gate AI](https://github.com/constellationgate.ai/constellation-gate-ai) | Orchestration layer coordinating models and agents into auditable, reliable workflows. | — | 0 |
| [nanobot](https://github.com/HKUDS/nanobot) | Lightweight agent framework with MCP support and multi-agent features. | Python | 47,103 |
| [Composio SDK](https://github.com/ComposioHQ/composio) | SDK that equips agents with tools and integrates remote MCP capabilities. | TypeScript | 29,738 |
| [adk-python](https://github.com/google/adk-python) | Python toolkit for building, evaluating, and deploying sophisticated AI agents and workflows. | Python | 21,165 |
| [OWL](https://github.com/camel-ai/owl) | OWL: framework for multi-agent assistance focused on real-world task automation and workforce learning. | Python | 20,080 |
| [Pixel Agents](https://github.com/pablodelucca/pixel-agents) | VS Code extension that visualizes and lets you manage multi-agent workflows as animated pixel-art characters and office scenes. | TypeScript | 6,797 |
| [Open Agents](https://github.com/vercel-labs/open-agents) | Open framework for building agent-driven workflows and AI applications. | TypeScript | 5,778 |
| [agent-service-toolkit](https://github.com/JoshuaC215/agent-service-toolkit) | Toolkit to run an AI agent service with LangGraph, FastAPI and Streamlit. | Python | 4,424 |
| [maestro](https://github.com/Doriandarko/maestro) | Framework to orchestrate subagents for Claude Opus, enabling intelligent subagent coordination. | Python | 4,359 |
| [AI SDK Tools](https://github.com/midday-ai/ai-sdk-tools) | Utilities for Vercel AI SDK including state, persistent memory, structured streaming, and workflows. | TypeScript | 2,048 |
| [octotools](https://github.com/octotools/octotools) | Agentic framework with extensible tools for complex reasoning and tool-augmented workflows. | Python | 1,482 |
| [OpenSquirrel](https://github.com/Infatoshi/OpenSquirrel) | Rust control plane to run multiple code-capable models side-by-side. | Rust | 1,364 |
| [voicetree](https://github.com/voicetreelab/voicetree) | Spatial IDE designed for recursive multi-agent orchestration. | TypeScript | 912 |
| [fablize](https://github.com/fivetaku/fablize) | Disciplined Fable-style agent workflow/harness implementation focused on validated behaviors. | Python | 888 |
| [Veritas Kanban](https://github.com/BradGroux/veritas-kanban) | Local-first Kanban platform to orchestrate agent workflows and enforce governance/SOPs. | TypeScript | 641 |
| [tinyclaw](https://github.com/TinyAGI/tinyclaw) | Framework to run multi-agent AI assistants concurrently with persistence and a dashboard. | — | 0 |
| [Murmell](https://github.com/murmell.com/murmell) | Shared online workspace where multiple coding agents collaborate live on a single project. | — | 0 |
| [langgraph-studio](https://github.com/langchain-ai/langgraph-studio) | Desktop app for prototyping and debugging LangGraph orchestration applications locally. | — | 0 |
| [hive](https://github.com/adenhq/hive) | Framework for outcome-driven agent development that evolves agent behaviors. | — | 0 |
| [Gas Town](https://github.com/steveyegge/gastown) | Multi-agent workspace manager for coordinating agent teams and workflows. | — | 0 |
| [Claude-Flow](https://github.com/ruvnet/claude-flow) | Claude-Flow: orchestration platform integrating Claude Code and swarm intelligence. | — | 0 |
| [agentscope](https://github.com/modelscope/agentscope) | Framework to build LLM-powered multi-agent applications more easily. | — | 0 |
| [Spacebot](https://github.com/spacedriveapp/spacebot) | Multi-agent platform aiming for robust multi-user/enterprise agent operation. | Rust | 2,302 |

#### Adjacent (30)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [dify](https://github.com/langgenius/dify) | Open-source LLM app platform combining AI workflows, RAG, agent features, model management and observability. | TypeScript | 152,721 |
| [Flowise](https://github.com/FlowiseAI/Flowise) | Drag-and-drop UI to build customized LLM/agent flows and workflows. | TypeScript | 55,380 |
| [haystack](https://github.com/deepset-ai/haystack) | LLM orchestration framework to build pipelines, RAG systems, agents and production-ready LLM apps. | Python | 26,234 |
| [Mastra](https://github.com/mastra-ai/mastra) | TypeScript framework for building AI applications and autonomous agents with orchestration, context and observability. | TypeScript | 23,116 |
| [LangChain.js](https://github.com/langchain-ai/langchainjs) | Modular framework for building LLM apps and chaining components, including agent orchestration. | TypeScript | 17,516 |
| [rowboat](https://github.com/rowboatlabs/rowboat) | Local-first AI coworker that orchestrates multi-agent workflows and maintains long-lived context. | TypeScript | 16,911 |
| [Automaker](https://github.com/AutoMaker-Org/automaker) | Autonomous AI development studio that orchestrates agents to implement features via Kanban workflows. | TypeScript | 3,213 |
| [Open Agent Builder](https://github.com/firecrawl/open-agent-builder) | Visual drag-and-drop workflow builder for AI agents with real-time execution. | TypeScript | 2,605 |
| [MiroFish-Offline](https://github.com/nikmcfly/MiroFish-Offline) | Fully local multi-agent simulation engine for modeling social dynamics, using Neo4j and local LLMs. | Python | 1,955 |
| [Agentic Data Scientist](https://github.com/K-Dense-AI/agentic-data-scientist) | Multi-agent data-science framework using Google's ADK, Claude SDK and MCP for planning/execution separation. | Python | 607 |
| [freephdlabor](https://github.com/ltjed/freephdlabor) | Multi-agent framework automating the end-to-end scientific research lifecycle with dynamic workflows and specialized agents. | Python | 501 |
| [CodeJury](https://github.com/krishagarwal314/CodeJury) | Terminal-first, knowledge-grounded multi-agent pipeline that automates scope-to-PR workflows with staged agents and QA. | Python | 129 |
| [TradingAgents](https://github.com/TauricResearch/TradingAgents) | Multi-agent LLM framework for financial trading and coordinated agent workflows. | Python | 89,122 |
| [agents](https://github.com/livekit/agents) | Framework for building realtime voice AI agents (audio/video/voice-focused agent framework). | Python | 13,040 |
| [Praison AI](https://github.com/MervinPraison/PraisonAI) | Low-code platform combining frameworks to build and manage multi-agent LLM systems. | Python | 8,908 |
| [TinyTroupe](https://github.com/microsoft/TinyTroupe) | LLM-driven multi-agent persona simulation for creativity and business insights. | Jupyter Notebook | 7,548 |
| [OpenSpace](https://github.com/HKUDS/OpenSpace) | Community platform/framework to build smarter, self-evolving agents. | Python | 7,422 |
| [lagent](https://github.com/InternLM/lagent) | Lightweight Python framework for building LLM-based agents. | Python | 2,277 |
| [Coding Agent Template](https://github.com/vercel-labs/coding-agent-template) | Template for a multi-agent AI coding platform using Vercel Sandbox and an AI gateway. | TypeScript | 1,764 |
| [AI-Gradio](https://github.com/AK391/ai-gradio) | Gradio-based framework integrating multiple AI providers, Agent Teams, and automation for multi-agent apps. | Python | 1,645 |
| [AutoGroq](https://github.com/jgravelle/AutoGroq) | Dynamically generates tailored teams of AI agents based on project requirements. | Python | 1,503 |
| [claude-code-by-agents](https://github.com/baryhuang/claude-code-by-agents) | Desktop app to coordinate local and remote Claude Code agents and orchestrate workflows. | Swift | 889 |
| [MiroShark](https://github.com/aaronjmars/MiroShark) | Universal swarm intelligence engine that simulates and coordinates hundreds of AI agents. | Python | 716 |
| [giselle](https://github.com/giselles-ai/giselle) | AI app builder for creating agentic apps and workflows, focused on no-code and multiagent composition. | TypeScript | 554 |
| [Roam](https://github.com/Cranot/roam-code) | Semantic graph engine that pre-indexes codebases to enable architecture-aware agent workflows. | Python | 450 |
| [LangChain](https://github.com/langchain-ai/langchain-aws) | Monorepo integrating LangChain/LangGraph with AWS services to enable RAG and agent applications on AWS. | Python | 317 |
| [MoChat](https://github.com/HKUDS/MoChat) | Platform that treats AI agents as first-class identities, enabling them to plug into messaging channels and coordinate social interactions. | TypeScript | 217 |
| [Altiverse](https://github.com/LeoTheAIDev/Altiverse) | Agent-based simulation platform running up to ~1,000 agents in alternate realities. | TypeScript | 19 |
| [Moonshine Flow](https://github.com/JRMeyer/MoonshineFlow) | Pipeline that preprocesses audio and streams live transcription into LLM/agent workflows. | — | 0 |
| [CoPaw](https://github.com/agentscope-ai/CoPaw) | Personal AI assistant platform supporting multi-agent collaboration, skills, and memory controls. | — | 0 |

### LLM, agent & MCP gateways / proxies

> **Classification:** **Gateway / proxy**. A gateway routes, normalizes, secures, observes, or governs traffic between models, agents, providers, and tools; it does not itself harness agents.

#### Core (27)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [LiteLLM](https://github.com/BerriAI/litellm) | Python SDK and proxy server (LLM Gateway) that normalizes calls to 100+ LLM APIs. | Python | 56,557 |
| [OmniRoute](https://github.com/diegosouzapw/OmniRoute) | AI gateway/proxy unifying 290+ providers and 500+ models behind an OpenAI-compatible endpoint with MCP support. | TypeScript | 36,262 |
| [reader](https://github.com/jina-ai/reader) | Service converting URLs into LLM-friendly inputs via a simple r.jina.ai prefix. | TypeScript | 11,876 |
| [agentgateway](https://github.com/agentgateway/agentgateway) | An agentic proxy / gateway for AI agents and MCP servers implemented in Rust. | Rust | 4,396 |
| [mcpo](https://github.com/open-webui/mcpo) | A simple, secure MCP-to-OpenAPI proxy server. | Python | 4,344 |
| [MCP Gateway](https://github.com/IBM/mcp-context-forge) | ContextForge: gateway and registry federating APIs (MCP/A2A/REST/gRPC) for centralized governance. | Python | 3,589 |
| [OneCLI](https://github.com/onecli/onecli) | Credential vault and Rust gateway that intercepts requests and injects secrets to agents. | TypeScript | 1,802 |
| [GOModel](https://github.com/ENTERPILOT/GOModel) | Go-based AI gateway offering an OpenAI-compatible unified API and observability. | Go | 971 |
| [router](https://github.com/workweave/router) | Model router that routes prompts to the appropriate model endpoint to reduce cost and latency. | Go | 962 |
| [claude-code-mux](https://github.com/9j/claude-code-mux) | High-performance Rust AI routing proxy with multi-provider routing, failover, and prioritization. | Rust | 518 |
| [mcpsnoop](https://github.com/kerlenton/mcpsnoop) | Transparent proxy/debugger for MCP traffic that inspects, logs and replays model-tool calls. | Go | 321 |
| [toolport](https://github.com/tsouth89/toolport) | Local-first MCP gateway exposing tools and AI clients through a single port, with quarantining. | Rust | 175 |
| [gallama](https://github.com/remichu-ai/gallama) | Opinionated local LLM inference API backend exposing OpenAI/Anthropic-compatible endpoints and native tool-calling. | Python | 137 |
| [VoidLLM](https://github.com/voidmind-io/voidllm) | Privacy-first LLM proxy/gateway: routing, key management, rate-limiting. | Go | 114 |
| [llm-gateway](https://github.com/openziti/llm-gateway) | OpenZiti zero-trust LLM gateway/proxy with semantic routing and load balancing. | Go | 69 |
| [LightCrawl](https://github.com/yosuke1024/LightCrawl) | Self-hosted web-scraping API and MCP server that converts pages to Markdown with sandboxed fetching and Playwright fallback. | HTML | 3 |
| [dlbrowser](https://github.com/DekryptLabs/dlbrowser) | Self‑hostable MCP providing resilient, metered web access for agents across multiple backends, handling Cloudflare/captchas and JS pages. | Python | 1 |
| [Toolport](https://github.com/toolport.app/toolport) | Open-source local MCP gateway consolidating MCP servers behind one local endpoint (Toolport). | — | 0 |
| [Opper AI](https://github.com/opper.ai/opper-ai) | EU-hosted AI gateway providing unified API access to 300+ models with routing and policy controls. | — | 0 |
| [headroom](https://github.com/chopratejas/headroom) | Library/proxy/MCP server that compresses tool outputs and RAG chunks before LLMs. | — | 0 |
| [HarnessRouter](https://github.com/harnessrouter.ai/harnessrouter) | Router/orchestration layer that routes agent work to appropriate runtimes and enforces policies. | — | 0 |
| [Claude Code Router](https://github.com/musistudio/claude-code-router) | Router/integration to use Claude Code as the basis for coding infra and control model interactions. | TypeScript | 36,692 |
| [AI.](https://github.com/vercel/ai) | TypeScript AI SDK (from Next.js authors) for building AI-powered apps and agent integrations. | TypeScript | 25,183 |
| [aisuite](https://github.com/andrewyng/aisuite) | Unified interface bridging multiple generative AI providers. | Python | 16,103 |
| [InsForge](https://github.com/InsForge/InsForge) | All-in-one backend platform providing auth, DB, compute and an AI gateway for coding agents. | TypeScript | 12,730 |
| [lean-ctx](https://github.com/yvgude/lean-ctx) | Rust context runtime with a centralized MCP server and shell hooks to reduce agent token costs. | Rust | 659 |
| [Ollama-LiteLLM](https://github.com/AIAnytime/Ollama-LiteLLM) | Lightweight Ollama LLM tooling aimed at local model hosting and routing. | Jupyter Notebook | 1 |

#### Adjacent (2)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Secure OpenClaw](https://github.com/ComposioHQ/secure-openclaw) | Personal messaging AI gateway integrating Claude with 500+ apps via Composio. | JavaScript | 1,210 |
| [restai](https://github.com/apocas/restai) | AI-as-a-Service platform built on LlamaIndex and LangChain to serve various LLMs and generation tools. | Python | 512 |

### Agent clients, chat interfaces & operator consoles

> **Classification:** **Client / operator console**. A client gives people a user-facing interface for operating agents or models. It may control a harness, but is not inherently one.

#### Core (25)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [open-webui](https://github.com/open-webui/open-webui) | User-friendly WebUI for interacting with LLMs (formerly Ollama WebUI). | Python | 149,050 |
| [LibreChat](https://github.com/danny-avila/LibreChat) | Open-source ChatGPT-like web client with multi-model and MCP support. | TypeScript | 42,153 |
| [AionUi](https://github.com/iOfficeAI/AionUi) | Local web UI (cowork) for interacting with agents across Gemini, Claude, Codex and others. | TypeScript | 32,063 |
| [grok-build](https://github.com/xai-org/grok-build) | Terminal-based AI coding agent with TUI, headless runtime, MCP integration, plugins and sandboxing. | Rust | 23,721 |
| [Craft Agents](https://github.com/craft-ai-agents/craft-agents-oss) | Desktop document-centric agent client enabling multi-session, multi-provider agent interactions. | TypeScript | 6,985 |
| [CodePilot](https://github.com/op7418/CodePilot) | Native desktop GUI for Claude Code to chat, code, and manage projects. | TypeScript | 6,401 |
| [skales](https://github.com/skalesapp/skales) | Cross-platform AI desktop agent to automate email, calendar, browser, and code tasks. | TypeScript | 1,668 |
| [open-coreui](https://github.com/xxnuo/open-coreui) | Rewritten Open WebUI in Rust offering server and Tauri desktop client for agent UIs. | Svelte | 1,534 |
| [CrewAI-Studio](https://github.com/strnad/CrewAI-Studio) | User-friendly GUI for managing and running CrewAI agents and tasks with no-code support. | Python | 1,343 |
| [Hermes Browser Extension](https://github.com/abundantbeing/hermes-browser-extension) | Browser side-panel extension linking web context to local/cloud/self-hosted Hermes agent runtimes and gateways. | JavaScript | 1,147 |
| [Kandev](https://github.com/kdlbs/kandev) | Self-hosted AI kanban and development control plane that orchestrates coding agents with reviews, worktrees, and a UI. | Go | 522 |
| [open-multi-agent-canvas](https://github.com/CopilotKit/open-multi-agent-canvas) | Open-source multi-agent chat interface to manage multiple agents and add MCP servers for research. | TypeScript | 520 |
| [Unity Agent Client](https://github.com/nuskey8/UnityAgentClient) | Unity editor extension implementing an Agent Client Protocol to integrate external AI agents into the Unity workflow. | C# | 252 |
| [Agent Console](https://github.com/eqtylab/agent-console) | Live inspection console for Claude Code sessions: logs, diffs, policy viewer, and traces. | TypeScript | 87 |
| [Gemini CLI](https://github.com/google-gemini/gemini-cli) | Terminal-based AI agent that brings Gemini into the command line (includes MCP-related client/server bits). | TypeScript | 106,542 |
| [odysseus](https://github.com/odysseus-dev/odysseus) | Self-hosted AI workspace for running and interacting with assistants and workflows. | Python | 85,543 |
| [Open Interpreter](https://github.com/openinterpreter/openinterpreter) | Terminal-based coding agent with harness emulation and native sandboxing. | Rust | 67,481 |
| [5ire](https://github.com/nanbingxyz/5ire) | Cross-platform desktop AI assistant and MCP client with local knowledge base support. | TypeScript | 5,335 |
| [Numa](https://github.com/razvandimescu/numa) | Local AI workspace for running assistant and productivity workflows privately. | Rust | 1,342 |
| [maestro](https://github.com/its-maestro-baby/maestro) | Terminal-style interface described as a Bloomberg Terminal for CLI agents. | TypeScript | 1,167 |
| [Arbor](https://github.com/penso/arbor) | Native Rust desktop hub for agentic coding workflows with integrated agent chats and daemon. | Rust | 698 |
| [Claude Usage Tracker](https://github.com/masorange/ClaudeUsageTracker) | Native macOS app for real-time monitoring and cost tracking of Claude Code API usage. | Swift | 110 |
| [task-monki](https://github.com/RojhatToptamus/task-monki) | App to manage software development workflows with AI coding agents (operator app). | TypeScript | 8 |
| [Waku](https://github.com/egoist/waku) | Native desktop workspace presenting multiple local coding agents behind one interface with session continuity. | — | 0 |
| [claude-code-controller](https://github.com/The-Vibe-Company/claude-code-controller) | Web interface/controller for managing and inspecting multi-agent Claude Code/Codex sessions. | — | 0 |

#### Adjacent (1)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [hermes-workspace](https://github.com/outsourc-e/hermes-workspace) | Web workspace UI for the Hermes Agent including chat, terminal, memory, skills and an inspector. | JavaScript | 6,451 |

### Agent runtimes, sandboxes & computer-use environments

> **Classification:** **Runtime / environment**. A runtime or sandbox supplies the execution environment—compute, isolation, browsers, desktops, or tool access—rather than the agent-control policy.

#### Core (31)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [Playwright](https://github.com/microsoft/playwright) | Browser automation framework with Playwright MCP extension enabling AI assistants to control browsers via structured snapshots. | TypeScript | 93,777 |
| [Lightpanda Browser](https://github.com/lightpanda-io/browser) | Lightweight headless browser for automation and AI agent workflows. | Zig | 34,010 |
| [smolagents](https://github.com/huggingface/smolagents) | Minimal Python library for code agents with sandboxed execution (Docker/Modal) and tool integrations. | Python | 26,709 |
| [OpenSandbox](https://github.com/opensandbox-group/OpenSandbox) | Secure, fast, extensible sandbox runtime environment for executing AI agents. | C | 14,166 |
| [Agent S](https://github.com/simular-ai/Agent-S) | Agentic framework that uses computers like a human, focusing on GUI/computer interaction and grounding. | Python | 12,164 |
| [sandbox](https://github.com/agent-infra/sandbox) | All-in-one Docker sandbox combining browser, shell, file, MCP and VSCode server for running agents safely. | Python | 5,734 |
| [agentos](https://github.com/rivet-dev/agentos) | Library 'OS' for agents that runs in your backend using WebAssembly and V8 isolates (no external sandboxes needed). | Rust | 4,397 |
| [gptme](https://github.com/gptme/gptme) | Terminal-based local agent with tools for coding, browsing, vision, and shell use. | Python | 4,390 |
| [WorkAny](https://github.com/workany-ai/workany) | Desktop AI agent app with in-process runtime, isolation sandbox, and built-in tools. | TypeScript | 1,439 |
| [Gondolin Agent Sandbox](https://github.com/earendil-works/gondolin) | Framework providing disposable local Linux micro‑VM sandboxes to safely execute AI agents and generated code with host policy controls. | TypeScript | 923 |
| [homerail](https://github.com/xiaotianfotos/homerail) | Runtime turning agent conversations into auditable workflows, provisioning Docker workers per DAG node. | TypeScript | 792 |
| [peerd](https://github.com/NotASithLord/peerd) | Browser-native agent harness extension that runs agent loops in-browser and provides sandboxed compute (WASM, notebooks). | JavaScript | 371 |
| [Agent Sandbox Skill](https://github.com/disler/agent-sandbox-skill) | Skill managing isolated execution environments (E2B sandboxes) so agents can safely execute code and build apps. | Python | 362 |
| [boring computers](https://github.com/michaelshimeles/boring-computers) | Firecracker microVM platform providing isolated, fast-booting Linux environments for AI agents with persistence and isolation. | Go | 291 |
| [openbrowser-ai](https://github.com/billy-enrizky/openbrowser-ai) | Framework for autonomous browser automation where the LLM writes and executes Python in a persistent namespace. | Python | 239 |
| [dscode](https://github.com/thinkany-ai/dscode) | Local-first multi-provider coding agent runtime with isolated agent roles, OS-level sandboxing, and MCP support. | TypeScript | 136 |
| [tupper](https://github.com/lightbearco/tupper) | Self-hostable sandboxing framework letting agents run untrusted code in isolated VMs. | TypeScript | 119 |
| [Odyssey](https://github.com/liquidos-ai/Odyssey) | Bundle-first Rust agent runtime with OS-level sandboxing for consistent artifacts. | Rust | 12 |
| [litellm-agent-platform](https://github.com/BerriAI/litellm-agent-platform) | Self-hosted platform to run coding agents in isolated sandboxes with a vault proxy. | — | 0 |
| [Hermes Agent](https://github.com/NousResearch/hermes-agent) | Persistent autonomous agent runtime with long-term memory that runs continuously across local and remote environments. | Python | 232,025 |
| [UI-TARS](https://github.com/bytedance/UI-TARS) | Automated GUI interaction system using native agents for GUI automation and interaction. | Python | 11,348 |
| [autoMate](https://github.com/yuruotong1/autoMate) | Local automation assistant / computer-using agents for natural-language automation. | Python | 3,943 |
| [mobile-use](https://github.com/minitap-ai/mobile-use) | Framework enabling agents to control Android/iOS UIs for automation and data scraping. | Python | 2,447 |
| [gelab-zero](https://github.com/stepfun-ai/gelab-zero) | GUI Exploration Lab for building GUI-driven agents that interact with interfaces and tools. | Python | 2,254 |
| [pi-computer-use](https://github.com/injaneity/pi-computer-use) | Agent-facing tool to control applications via a 'pi-coding-agent' for invisible automation. | TypeScript | 1,741 |
| [Anima](https://github.com/Fullive-AI/Anima) | Local-first agent runtime for smart-home device control with long-term memory. | Python | 1,103 |
| [on-device-browser-agent](https://github.com/RunanywhereAI/on-device-browser-agent) | On-device browser automation using WebLLM for private, local agent-driven browser control without cloud keys. | TypeScript | 298 |
| [prax-agent](https://github.com/ChanningLua/prax-agent) | Self-improving agent runtime with test-verify-fix loops, correction detection, memory and multi-model orchestration. | Python | 291 |
| [HOPX MCP Server](https://github.com/hopx-ai/mcp) | MCP server that runs code in isolated cloud containers and sandboxes. | Python | 162 |
| [rakazo](https://github.com/elie222/rakazo) | Personal bot platform where each bot has its own Linux instance, browser, memory, and scheduled routines reachable via web/desktop/mobile. | — | 0 |
| [Open Computer Use](https://github.com/LLmHub-dev/open-computer-use) | Platform letting agents control real systems (browser, terminal, desktop) with Dockerized VMs and multi-agent orchestration. | — | 0 |

#### Adjacent (2)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [HolyClaude](https://github.com/CoderLuii/HolyClaude) | AI coding workstation bundling Claude Code, web UI, CLIs, headless browser and many tools for local development. | Dockerfile | 2,506 |
| [ScaleCUA](https://github.com/OpenGVLab/ScaleCUA) | Dataset, models and evaluation suite for scaling GUI-based computer-use agents. | Python | 1,104 |

### MCP, agent protocols & tool interoperability

> **Classification:** **Protocol / interoperability layer**. Protocol hosts, registries, and reusable bridges make tools interoperable with agents. Individual one-off adapters were intentionally filtered out.

#### Core (57)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [servers](https://github.com/modelcontextprotocol/servers) | Reference implementations of MCP servers (Fetch, Filesystem, Memory, Git, etc.) across multiple languages. | TypeScript | 89,128 |
| [context7](https://github.com/upstash/context7) | MCP server and CLI injecting versioned docs into prompts for coding assistants. | TypeScript | 60,094 |
| [codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp) | High-performance MCP server indexing codebases into a knowledge graph. | C | 36,876 |
| [Serena](https://github.com/oraios/serena) | Coding agent toolkit that includes an MCP server and integrations for semantic edit/retrieval. | Python | 28,141 |
| [code-review-graph](https://github.com/tirth8205/code-review-graph) | Local knowledge graph that exposes parsed code structure via MCP to reduce token use for coding assistants. | Python | 27,912 |
| [Agent2Agent](https://github.com/a2aproject/A2A) | Open protocol for communication and interoperability between agentic applications. | Shell | 25,380 |
| [Context Mode](https://github.com/mksglu/context-mode) | Context-window optimizer that sandboxes and normalizes tool outputs across platforms. | TypeScript | 19,925 |
| [typescript-sdk](https://github.com/modelcontextprotocol/typescript-sdk) | Official TypeScript SDK implementing the Model Context Protocol for servers and clients. | TypeScript | 13,039 |
| [FastAPI-MCP](https://github.com/tadata-org/fastapi_mcp) | FastAPI framework to expose endpoints as Model Context Protocol tools for LLMs and agents. | Python | 11,813 |
| [PAL MCP](https://github.com/BeehiveInnovations/pal-mcp-server) | MCP server that unifies LLMs and AI CLIs into a Provider Abstraction Layer and workflows. | Python | 11,444 |
| [mcp-use](https://github.com/mcp-use/mcp-use) | Fullstack framework for developing MCP applications, servers, and MCP SDKs with inspector tooling. | TypeScript | 9,786 |
| [MCP Inspector](https://github.com/modelcontextprotocol/inspector) | Developer tool (client + proxy) for testing and debugging Model Context Protocol servers. | TypeScript | 9,480 |
| [MCP Registry](https://github.com/modelcontextprotocol/registry) | Community-driven registry/application store for discovering Model Context Protocol servers. | Go | 6,697 |
| [mcp-ui](https://github.com/MCP-UI-Org/mcp-ui) | UI toolkit / frontend layer designed to work with the MCP protocol. | TypeScript | 5,091 |
| [agent-skills](https://github.com/tech-leads-club/agent-skills) | Secure, validated skill registry for professional coding agents to extend platforms with trusted skills. | TypeScript | 5,040 |
| [MCP Go SDK](https://github.com/modelcontextprotocol/go-sdk) | Official Go SDK for implementing the Model Context Protocol (MCP) for servers and clients. | Go | 4,385 |
| [MCPorter](https://github.com/steipete/mcporter) | TypeScript tooling to call MCP servers like a local TypeScript API or package as a CLI. | TypeScript | 4,036 |
| [n8n-nodes-mcp](https://github.com/nerding-io/n8n-nodes-mcp) | n8n custom node that integrates the Model Context Protocol into n8n workflows. | TypeScript | 3,040 |
| [Microsoft MCP](https://github.com/microsoft/mcp) | Core libraries and tooling for implementing the Model Context Protocol (MCP). | C# | 2,986 |
| [Vibium](https://github.com/VibiumDev/vibium) | Go browser automation framework exposing an MCP server and client libraries for agent/browser automation. | Go | 2,776 |
| [ext-apps](https://github.com/modelcontextprotocol/ext-apps) | TypeScript SDK/spec for MCP Apps to build interactive, embeddable UI widgets. | TypeScript | 2,079 |
| [open-mcp-client](https://github.com/CopilotKit/open-mcp-client) | Full-stack MCP client pairing frontend UI with an MCP-capable agent backend. | TypeScript | 1,645 |
| [agentql](https://github.com/tinyfish-io/agentql) | Suite for connecting AI agents to the web: query language, Playwright integrations, REST API and SDKs. | Python | 1,451 |
| [mcp-cli](https://github.com/philschmid/mcp-cli) | Lightweight CLI for interacting with MCP servers. | TypeScript | 1,249 |
| [waggle](https://github.com/modiqo/waggle) | MCP-native reference layer for agent-to-agent handoffs, with content-addressed snapshots and audits. | Rust | 795 |
| [just-prompt](https://github.com/disler/just-prompt) | MCP server unifying access to multiple LLM providers. | Python | 737 |
| [fastctx](https://github.com/yc-duan/fastctx) | Rust runtime exposing structured, context-efficient repo tools to agents via the Model Context Protocol. | Rust | 711 |
| [clihub](https://github.com/thellimist/clihub) | Converts any MCP server into a static, standalone CLI by discovering server functions and generating subcommands. | Go | 659 |
| [frontman](https://github.com/frontman-ai/frontman) | Browser-based AI coding agent that turns dev servers into MCP servers exposing runtime and DOM context. | ReScript | 647 |
| [agent-kit](https://github.com/KeyID-AI/agent-kit) | JavaScript framework exposing 27 MCP email tools so agents can autonomously send, read, and manage email. | JavaScript | 619 |
| [mcp-graphql](https://github.com/blurrah/mcp-graphql) | TypeScript MCP server enabling LLMs to discover and query GraphQL APIs with schema introspection. | TypeScript | 381 |
| [context-ontology-accelerator](https://github.com/aws/context-ontology-accelerator) | Semantic context layer for AWS that builds a virtual knowledge graph and exposes context to agents via an MCP server. | Python | 318 |
| [sallyport](https://github.com/OlegSotnikov/sallyport) | macOS vault and executor that performs credentialed actions via MCP. | Swift | 274 |
| [mcp2py](https://github.com/MaximeRivest/mcp2py) | Converts any MCP server into a native Python module/SDK. | Python | 248 |
| [Skyll](https://github.com/assafelovic/skyll) | REST API and MCP server that indexes and serves agent 'skills' so agents can discover and fetch capabilities at runtime. | Python | 224 |
| [Sunpeak](https://github.com/Sunpeak-AI/sunpeak) | Framework for building, testing, and inspecting MCP apps across AI hosts. | TypeScript | 208 |
| [open-claude-in-chrome](https://github.com/noemica-io/open-claude-in-chrome) | Reverse-engineered Claude integration for Chromium with MCP tool support and same toolset. | HTML | 187 |
| [toMCP](https://github.com/Ami3466/tomcp) | Tool that converts websites/documents into structured Model Context Protocol (MCP) servers for reliable agent context. | HTML | 173 |
| [Add-MCP](https://github.com/neondatabase/add-mcp) | CLI utility to discover, install, and configure MCP servers for various coding agents via a single command. | TypeScript | 156 |
| [SuperMCP](https://github.com/dhanababum/supermcp) | Platform that creates multiple isolated MCP servers from one connector for multi-tenant MCP deployments. | Python | 56 |
| [DecisionNode](https://github.com/decisionnode/DecisionNode) | CLI + local MCP providing a shared structured memory store across MCP clients. | TypeScript | 39 |
| [adl](https://github.com/inference-gateway/adl) | Declarative language (ADL) to define agents, capabilities, and tools; generates code. | — | 31 |
| [TPMJS](https://github.com/tpmjs/tpmjs) | Tool Package Manager for AI agents: registry and secure execution of npm tools. | TypeScript | 24 |
| [starbase](https://github.com/metorial/starbase) | Tool/playground to connect, explore, and test MCP servers with AI models. | TypeScript | 21 |
| [Agent-Handoff](https://github.com/dabit3/agent-handoff) | TypeScript protocol for reliable context handoffs between multi-agent systems. | TypeScript | 13 |
| [Zen MCP](https://github.com/BeehiveInnovations/zen-mcp-server) | PAL Model Context Protocol server that abstracts model providers and includes a CLI bridge for isolated subagents. | — | 0 |
| [FastMCP](https://github.com/jlowin/fastmcp) | Pythonic toolkit for building MCP servers and clients. | — | 0 |
| [FastApps](https://github.com/DooiLabs/FastApps) | Python framework for building apps/widgets to expose to ChatGPT via an MCP endpoint. | — | 0 |
| [Context Mode](https://github.com/mksglu/claude-context-mode) | MCP server addressing context by saving/context indexing and maintaining session continuity. | — | 0 |
| [ClaudeComputerCommander](https://github.com/wonderwhy-er/ClaudeComputerCommander) | MCP server that gives Claude terminal control. | — | 0 |
| [AgentConnect](https://github.com/agentconnect.md/agentconnect) | Connectivity layer for agents to expose, discover, and chain MCP-compatible tools. | — | 0 |
| [AG-UI](https://github.com/ag-ui-protocol/ag-ui) | Agent-User Interaction Protocol for embedding agents into frontend applications. | Python | 15,348 |
| [mcp-agent](https://github.com/lastmile-ai/mcp-agent) | Toolkit to build agents using the Model Context Protocol and simple workflow patterns. | Python | 8,508 |
| [UltraRAG](https://github.com/OpenBMB/UltraRAG) | Low-code RAG framework built on an MCP architecture for retrievers/generators. | Python | 5,501 |
| [n-skills](https://github.com/numman-ali/n-skills) | Plugin marketplace standardizing skills across agent platforms for universal installable skills. | TypeScript | 974 |
| [Datailor-preference-MCP](https://github.com/fyaic/Datailor-preference-MCP) | Local, auditable MCP for assigning default preferences to AI agents. | Python | 11 |
| [In Parallel MCP](https://github.com/in-parallel.com/in-parallel-mcp) | MCP server that provides primitives for spawning and collecting parallel sub-tasks from a single model context. | — | 0 |

#### Adjacent (10)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [FastCode](https://github.com/HKUDS/FastCode) | Token-efficient code-analysis framework that integrates via an MCP server for tool integration. | Python | 2,137 |
| [Context+](https://github.com/ForLoopCodes/contextplus) | MCP server that builds searchable hierarchical feature graphs for large codebases and supports agent operations. | TypeScript | 1,769 |
| [pg-aiguide](https://github.com/timescale/pg-aiguide) | Framework and MCP server providing PostgreSQL expertise and agent skills for database-aware agents. | Python | 1,690 |
| [rocketplaneIO](https://github.com/olemeyer/rocketplaneIO) | Kubernetes SRE platform with observability, outboard agent, and an MCP interface for AI remediation and controlled mutations. | Go | 174 |
| [ClueoMCP](https://github.com/ClueoFoundation/ClueoMCP) | Personality layer that injects consistent AI personalities into MCP-compatible assistants, with adaptive memory. | JavaScript | 72 |
| [WebMCP](https://github.com/webmachinelearning/webmcp) | WebMCP — a web-focused implementation related to the Model Context Protocol. | Bikeshed | 3,036 |
| [Grepai](https://github.com/yoanbernabeu/grepai) | Local semantic search and call-graph tooling to support AI agents' code navigation and analysis. | C | 1,816 |
| [Code-Mode Library](https://github.com/universal-tool-calling-protocol/code-mode) | Library related to browser automation and model-context/tool protocols (UTCP/CodeMode). | TypeScript | 1,502 |
| [Open Generative UI](https://github.com/CopilotKit/OpenGenerativeUI) | Framework for agent-generated UIs; includes a MCP server for tooling. | TypeScript | 1,139 |
| [Watch Skill](https://github.com/oxbshw/watch-skill) | Local-first video intelligence layer exposing 23 MCP tools and a self-correction loop so agents can watch and verify video. | Python | 247 |

### Agent memory, context & state coordination

> **Classification:** **Memory / state layer**. Memory systems persist, retrieve, and synchronize context and state. They are infrastructure used by harnesses and orchestrators.

#### Core (32)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [mem0](https://github.com/mem0ai/mem0) | Memory layer designed for personalized AI and long-term state management. | Python | 63,466 |
| [Graphiti](https://github.com/getzep/graphiti) | Platform for building real-time knowledge graphs to provide structured context to AI agents. | Python | 30,018 |
| [OpenViking](https://github.com/volcengine/OpenViking) | Context database for AI agents using a filesystem paradigm for hierarchical context delivery. | Python | 28,891 |
| [agentmemory](https://github.com/rohitg00/agentmemory) | Persistent memory system for AI coding agents to store and retrieve long-term context. | TypeScript | 27,114 |
| [hindsight](https://github.com/vectorize-io/hindsight) | Retrieval system that builds datasets from application logs for use as retrieval memory. | Python | 17,669 |
| [engram](https://github.com/Gentleman-Programming/engram) | Single Go binary with SQLite/FTS5 providing persistent, searchable agent memory and session recovery. | Go | 4,691 |
| [MemMachine](https://github.com/MemMachine/MemMachine) | Universal memory layer for agent state: episodic, profile, and working memory. | Python | 4,129 |
| [Open Brain](https://github.com/NateBJones-Projects/OB1) | Unified, local-first personal memory system and AI gateway for shared persistent knowledge. | TypeScript | 1,565 |
| [Persome](https://github.com/Intuition-Lab/personal-model) | Local-first AI memory runtime for macOS exposing persistent personal-model memory via MCP. | Python | 1,280 |
| [mem9](https://github.com/mem9-ai/mem9) | Persistent shared memory server for agents, supporting vector/keyword search and plugins for multiple platforms. | TypeScript | 978 |
| [second-brain-cloudflare](https://github.com/rahilp/second-brain-cloudflare) | Self-hosted memory layer to store and recall data across AI tools and MCP clients on Cloudflare. | TypeScript | 718 |
| [Create Context Graph](https://github.com/neo4j-labs/create-context-graph) | Neo4j graph builder that converts documents/data into knowledge graphs for AI context. | Python | 667 |
| [vestige](https://github.com/samvallad33/vestige) | Local cognitive memory engine for agents implementing spaced-repetition and memory modules, with MCP integration. | Rust | 478 |
| [paxm](https://github.com/pax-beehive/paxm) | Provider-neutral persistent memory layer for coding-agent sessions with SQLite support. | Go | 435 |
| [ratel](https://github.com/ratel-ai/ratel) | Context engineering layer that catalogs tools/skills and injects only relevant capabilities to reduce token use and improve accuracy. | Rust | 391 |
| [Octopoda-OS](https://github.com/RyjoxTechnologies/Octopoda-OS) | Memory OS for AI agents with persistent memory, semantic search, messaging and observability. | Python | 347 |
| [brainapi2.git](https://github.com/Lumen-Labs/brainapi2) | Knowledge-graph memory layer converting text into structured graphs, exposing MCP server and memory APIs. | Python | 296 |
| [pmb](https://github.com/oleksiijko/pmb) | Local-first persistent memory store for AI coding agents over MCP (SQLite). | Python | 290 |
| [understory](https://github.com/thecodacus/understory) | Plain-markdown persistent memory layer exposing MCP server and tools with OKF-compliant markdown concepts. | TypeScript | 233 |
| [yantrikdb-server](https://github.com/yantrikos/yantrikdb-server) | Cognitive memory database for agents: dedupe, contradiction detection, temporal decay; library/MCP server. | Rust | 163 |
| [contextvc](https://github.com/HaochengLu/contextvc) | Git-native context control plane that version-controls agent memory and enforces pre-action checks. | Rust | 145 |
| [FlowState](https://github.com/dialectforge/FlowStateV1.1) | MCP server providing persistent development memory that flows between sessions. | TypeScript | 18 |
| [smriti](https://github.com/himanshudongre/smriti) | Agent memory system treating memory like Git with checkpoints and data-layer control. | Python | 16 |
| [opendream](https://github.com/pylit-ai/opendream) | Local-first memory and dreaming automation system for agents. | Python | 7 |
| [MEMORY.md](https://github.com/upstash/agent-memory) | Redis-backed agent memory implementation with live viewing. | TypeScript | 6 |
| [TencentDB-Agent-Memory](https://github.com/TencentCloud/TencentDB-Agent-Memory) | Layered memory framework and Memory Hub for agents to retain, organize, and share structured experiences and knowledge. | — | 0 |
| [MemoryGraph](https://github.com/gregorydickson/memory-graph) | Graph-based MCP memory server providing persistent structured memory for coding agents. | — | 0 |
| [Memori](https://github.com/GibsonAI/Memori) | Open-source memory engine for LLMs, AI agents, and multi-agent systems. | — | 0 |
| [mcp-memory](https://github.com/fellowgeek/mcp-memory) | MCP server providing persistent long-term memory using Markdown files and SQLite FTS, exposing MCP memory tools. | — | 0 |
| [Graft](https://github.com/NanoNets/Graft) | Persistent code graph and CLI to provide coding agents repository context and search. | — | 0 |
| [ContextOS](https://github.com/joshimohanlalit1303-ctrl/ContextOS) | Memory-as-a-Service for agents: persistent memory, pgvector search, deduplication, and a developer dashboard. | TypeScript | 0 |
| [getprofile](https://github.com/getprofile/getprofile) | Drop-in LLM proxy that provides persistent user profiles and long-term memory to models. | TypeScript | 39 |

#### Adjacent (3)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [graybox](https://github.com/Aaryanverma/graybox) | Local-first long-term memory tool that organizes notes into a cross-linked Markdown wiki for agent retrieval. | Python | 155 |
| [OpenHuman](https://github.com/tinyhumansai/openhuman) | Platform for digital human experiences with memory and multimodal interaction. | Rust | 36,330 |
| [kwami](https://github.com/alexcolls/kwami) | 3D AI companion library with STT/LLM/TTS, Zep persistent memory, and MCP tool support for interactive agents. | — | 0 |

### Agent evaluation, observability, safety & governance

> **Classification:** **Control plane**. Evaluation, tracing, guardrails, and governance monitor or constrain agent behavior. They complement a harness rather than necessarily executing one.

#### Core (19)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [langfuse](https://github.com/langfuse/langfuse) | Observability and analytics platform for LLM applications offering tracing, evaluation, and prompt management. | TypeScript | 32,262 |
| [superagent](https://github.com/superagent-ai/superagent) | Library to protect AI applications from prompt injection, data leaks and harmful outputs by embedding guardrails. | TypeScript | 6,713 |
| [helicone](https://github.com/Helicone/helicone) | Open-source LLM observability platform for monitoring, evaluating, and experimenting with models. | TypeScript | 6,077 |
| [agentops](https://github.com/AgentOps-AI/agentops) | Python SDK for agent monitoring, LLM cost tracking, benchmarking and integrations with agent frameworks. | Python | 5,779 |
| [claude-code-hooks-multi-agent-observability](https://github.com/disler/claude-code-hooks-multi-agent-observability) | Real-time monitoring via hook events for Claude Code agents. | Python | 1,516 |
| [bloom](https://github.com/safety-research/bloom) | Tool to immediately evaluate model/agent behavior. | Python | 1,388 |
| [intellagent](https://github.com/plurai-ai/intellagent) | Framework for diagnosing and optimizing agents using simulated, realistic synthetic interactions. | Python | 1,254 |
| [skillspec](https://github.com/modiqo/skillspec) | Converts prose SKILL.md into structured skill contracts with tests, risk checks and execution proofs. | Rust | 858 |
| [pandaprobe](https://github.com/chirpz-ai/pandaprobe) | Agent engineering platform for traces, evals and metrics to debug and improve AI agents. | Python | 754 |
| [ai-sdk](https://github.com/grafana/ai-sdk) | Go AI SDK to call/stream LLMs, execute tools, and provide middleware and observability. | Go | 163 |
| [agent-watch](https://github.com/AIAnytime/agent-watch) | AgentOps monitoring library designed for Crew AI applications. | Jupyter Notebook | 22 |
| [MCP Checkpoint](https://github.com/aira-security/mcp-checkpoint) | Security scanner for Model Context Protocol servers performing prompt-injection, tool-poisoning checks and audits. | — | 0 |
| [LockIn MCP](https://github.com/lockinmcp.com/lockin-mcp) | Governance/security layer for MCP servers with centralized policies, auth, audit logs, and approval workflows. | — | 0 |
| [Argos](https://github.com/tryargos.cc/argos) | Observability and evaluation platform capturing traces, tool calls, prompts and runs for agents. | — | 0 |
| [IronClaw](https://github.com/nearai/ironclaw) | Privacy-focused assistant with WASM/Docker sandboxes, prompt-injection defenses and credential protection. | Rust | 11,851 |
| [fable-method](https://github.com/Sahir619/fable-method) | Method and evaluation suite distilling Claude Fable 5 behaviors into verifiable agent skills with extensive testing. | Python | 2,011 |
| [sentrux](https://github.com/sentrux/sentrux) | Rust-based architectural sensor that scores code quality and provides feedback to agents via MCP. | Rust | 828 |
| [agentic-os](https://github.com/KbWen/agentic-os) | Governance framework enforcing plan/build/review/test/ship workflow and guardrails for coding agents. | Python | 133 |
| [claude-view](https://github.com/tombelieber/claude-view) | Live dashboard to monitor Claude sessions, costs, and sub-agent visibility. | Rust | 103 |

#### Adjacent (1)

| Repository | Catalog role | Primary language | Stars* |
| --- | --- | --- | ---: |
| [forsy-trace-skill](https://github.com/Forsy-AI/forsy-trace-skill) | Portable tracing skill that captures structured agent trajectory data for analysis, debugging, and evaluation. | Python | 90 |

## Use Notes

This catalog supports discovery and taxonomy, not a recommendation, security review, license assessment, deployment evaluation, or endorsement. Before adoption, review each project’s current documentation, supported model providers, protocol compatibility, data handling, identity and permission model, isolation model, licensing, maintenance activity, and operational cost. [1]

*Stars are the counts recorded in the attached dataset, not live GitHub values.*

## References

[1]: repo_showcase_merged.json (user-supplied repository dataset, analyzed August 18, 2026)
