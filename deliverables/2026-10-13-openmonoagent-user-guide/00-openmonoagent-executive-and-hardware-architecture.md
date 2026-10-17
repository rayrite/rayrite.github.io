# OpenMonoAgent.ai — Executive Overview & System Architecture
**Hardware Profile:** PowerSpec G914 Gaming PC (AMD Ryzen 9 9950X3D · 64GB DDR5-6000 · RTX 5090 32GB GDDR7 · 2TB NVMe)  
**Operating System:** Zorin OS 18.1 64-bit (Ubuntu 24.04 LTS "Noble" Base · Linux Kernel 6.8/6.11 HWE)  
**Project Reference:** [OpenMonoAgent.ai](https://www.openmonoagent.ai/) · [StartupHakk GitHub Repository](https://github.com/StartupHakk/OpenMonoAgent.ai)  
**Date of Record:** October 13, 2026  
**Document Series:** Deliverable 00 of 05  

---

## 1. Executive Summary & The OpenMono Manifesto

Modern software engineering with artificial intelligence has largely devolved into a metered, cloud-tethered subscription service. Developers routinely pipe proprietary source code, internal schemas, API credentials, and trade secrets to third-party datacenters, incurring variable token costs, rigid usage quotas, and opaque privacy policies. 

**OpenMonoAgent.ai** (OMA) was created by **StartupHakk LLC** to dismantle this dynamic. Its core thesis is uncompromising:

> *"AI shouldn't be a subscription you rent. It should be infrastructure you own — sitting on your desk, serving your code, and answering only to you."*

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       THE STARTUPHAKK OMA PRINCIPLES                        │
├─────────────────────────────────────────────────────────────────────────────┤
│ 1. Local-First Always: Compute, models, and agents execute on bare metal.    │
│ 2. Unlimited Tokens: Zero per-token meter, zero cloud invoices forever.     │
│ 3. Docker-Native Sandboxing: Code is bind-mounted; the agent cannot escape. │
│ 4. Compiler-Grade Intelligence: Built in C#/.NET with Roslyn compiler tools.│
│ 5. Multi-Surface Control: Full ANSI TUI, VS Code/Cursor ACP, & Mobile App.  │
└─────────────────────────────────────────────────────────────────────────────┘
```

OpenMono couples a high-performance **.NET 10** terminal-native coding agent CLI with a containerized **`llama.cpp`** inference runtime. By embedding the inference server directly into the stack, OpenMono automatically selects, quantizes, and executes state-of-the-art open-weights models (principally the **Qwen3.8-27B** dense architecture for GPUs and **Qwen3.6-35B-A3B** MoE architecture for CPUs).

---

## 2. PowerSpec G914 Hardware Mapping & Performance Envelope

The **PowerSpec G914 Gaming PC** represents an ideal, tier-1 hardware configuration for running local foundation models and agentic software development loops. 

```
+----------------------------------------------------------------------------------------------------+
|                         POWERSPEC G914 HARDWARE TO OPENMONO MAPPING                                |
+----------------------------------------------------------------------------------------------------+
| Component               Specification                 OpenMono Role & Allocation                   |
+-------------------------+-----------------------------+--------------------------------------------+
| Graphics Processing Unit| MSI Ventus 3X OC RTX 5090   | Primary Inference Engine                   |
|                         | 32GB GDDR7 VRAM, 512-bit bus| Weights: Qwen3.8-27B-Q4_K_M (~15.5GB)      |
|                         | 1,792 GB/s Bandwidth        | Vision: mmproj-F16 (~0.9GB)                |
|                         | Blackwell SM 12.0 (CUDA 12.8| KV Cache: q8_0 precision (192,000 tokens)  |
|                         |                             | Inference Speed: ~75–80 tokens/sec         |
+-------------------------+-----------------------------+--------------------------------------------+
| Central Processing Unit | AMD Ryzen 9 9950X3D         | Host Orchestration & Compilation           |
|                         | 16 Cores / 32 Threads, Zen 5| CCD0 (3D V-Cache): Roslyn analysis & TUI   |
|                         | 4.3 GHz Base / 5.7 GHz Boost| CCD1: Docker daemon, Search/Scrape gateway |
|                         | 128MB L3 Cache              | CPU Fallback Mode: ~20–22 tokens/sec       |
+-------------------------+-----------------------------+--------------------------------------------+
| System Memory (RAM)     | 64GB DDR5-6000 (2x32GB)     | Roslyn AdhocWorkspace In-Memory Compilation|
|                         | Dual-Channel, EXPO Profile 1| SearXNG & Scrapling Headless Browser Buffers|
|                         | ~96 GB/s Measured Bandwidth | Session JSONL Transcripts & Memory Caching |
+-------------------------+-----------------------------+--------------------------------------------+
| Motherboard             | MSI MAG X870E Tomahawk WiFi | PCIe 5.0 x16 Bus Passthrough to GPU        |
|                         | AMD AM5 Platform            | IOMMU Grouping & Hardware Virtualization   |
+-------------------------+-----------------------------+--------------------------------------------+
| Storage                 | 2TB NVMe PCIe 4.0/5.0 SSD   | High-Speed Model Weights Streaming & Docker|
|                         | 7,000+ MB/s Sequential Read | Instantaneous Checkpoint Saves & File Undo |
+-------------------------+-----------------------------+--------------------------------------------+
| Networking              | Realtek 5GbE LAN            | Zero-Latency Mobile / Laptop LAN Connect   |
|                         | Qualcomm WiFi 7 (802.11be)  | Encrypted Outbound Reverse Tunnel (frpc)   |
|                         | Bluetooth 5.4               | Dual-Box Remote Orchestration from Android |
+-------------------------+-----------------------------+--------------------------------------------+
| Host OS                 | Zorin OS 18.1 (64-bit)      | Low-Overhead Linux Kernel 6.8/6.11 HWE     |
|                         | Ubuntu 24.04 LTS Base       | Native NVIDIA Container Toolkit Integration|
+-------------------------+-----------------------------+--------------------------------------------+
```

### 2.1 Bandwidth Mechanics: Why the RTX 5090 Excels
Large language model token generation is memory-bandwidth bound. To emit a single token, the GPU must stream every active parameter weight across its memory bus:
$$\text{Latency per Token} \approx \frac{\text{Model Weights Size (Bytes)}}{\text{Memory Bandwidth (Bytes/sec)}}$$

* On an **RTX 3090** (936 GB/s bandwidth), reading a 15.5GB 27B model takes $\approx 16.5\text{ ms}$, yielding $\approx 42\text{--}45\text{ tok/s}$.
* On the **RTX 5090** (1,792 GB/s bandwidth), streaming 15.5GB takes only $\approx 8.6\text{ ms}$, resulting in **75–80 tokens/sec**.

At 80 tokens/sec, OpenMono operates faster than standard commercial cloud APIs (which typically stream between 30 and 60 tokens/sec), eliminating the lag commonly experienced during multi-step tool call loops.

---

## 3. High-Level System Architecture & Container Topology

OpenMono enforces strict isolation. Rather than granting an AI model unfettered access to host shells and system utilities, the architecture isolates concerns across discrete runtime boundaries:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                     POWERSPEC G914 (HOST SYSTEM)                                │
│                                                                                                 │
│  User Workspace: `/home/user/projects/my-app` (Bind-mounted read-write)                         │
│  Global State:   `~/.openmono` (Sessions, checkpoints, memory, settings.json)                   │
│                                                                                                 │
│  ┌───────────────────────────────────────────────────────────────────────────────────────────┐  │
│  │                                 DOCKER VIRTUAL NETWORK (`openmono-network`)               │  │
│  │                                                                                           │  │
│  │  ┌─────────────────────────────┐           ┌───────────────────────────────────────────┐  │  │
│  │  │ openmono-agent              │           │ openmono-gateway (Caddy 2 Proxy)          │  │  │
│  │  │ (C#/.NET 10 CLI Runtime)    │           │ Port :47480 (Tunneled via frpc)           │  │  │
│  │  │                             │           │                                           │  │  │
│  │  │ • Spectre.Console ANSI TUI  │           │   ├── /v1/*, /props ──► llama-server:7474 │  │  │
│  │  │ • ACP Server (:7475)        │           │   ├── /search*      ──► searxng:8080      │  │  │
│  │  │ • Roslyn Tool Engine        │           │   ├── /scrape*      ──► scrapling:5000    │  │  │
│  │  │ • 20 Built-in Tools + MCP   │           │   └── /services     ──► Capability Map    │  │  │
│  │  │ • Permission Engine         │           └─────────────────────┬─────────────────────┘  │  │
│  │  └──────────────┬──────────────┘                                 │                        │  │
│  │                 │                                                │                        │  │
│  │                 │ HTTP :7474 / :47480                            │                        │  │
│  │                 ▼                                                │                        │  │
│  │  ┌─────────────────────────────┐                                 │                        │  │
│  │  │ llama-server                │                                 │                        │  │
│  │  │ (ghcr.io/ggml-org/llama.cpp)│                                 │                        │  │
│  │  │                             │                                 │                        │  │
│  │  │ • CUDA 12.8 / SM 12.0       │                                 │                        │  │
│  │  │ • Qwen3.8-27B-UD-Q4_K_M     │                                 │                        │  │
│  │  │ • mmproj-qwen3.8-27B-F16    │                                 │                        │  │
│  │  │ • Flash-Attention + q8_0 KV │                                 │                        │  │
│  │  └─────────────────────────────┘                                 │                        │  │
│  │                                                                  │                        │  │
│  │  ┌─────────────────────────────┐           ┌─────────────────────▼─────────────────────┐  │  │
│  │  │ openmono-searxng            │           │ openmono-scrapling                        │  │  │
│  │  │ (Private Meta-Search)       │           │ (Python FastAPI + Camoufox Stealth)       │  │  │
│  │  │ Port :8080 (Internal)       │           │ Port :5000 (Internal)                     │  │  │
│  │  └─────────────────────────────┘           └───────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────┬──────────────────────────────────────────────────┘
                                               │
                                               │ Outbound TLS Tunnel (frpc)
                                               ▼
                        ┌──────────────────────────────────────────────┐
                        │       OpenMono Relay Service                 │
                        │       `relay.openmonoagent.ai`               │
                        │       (Managed via app.openmonoagent.ai)     │
                        └──────────────────────┬───────────────────────┘
                                               │
                                               │ Encrypted HTTPS / WSS
                                               ▼
                        ┌──────────────────────────────────────────────┐
                        │           REMOTE CLIENT SURFACES             │
                        │                                              │
                        │ • Android Mobile App (ai.openmonoagent.app)  │
                        │ • Remote Laptop / Workstation (Agent Only)   │
                        │ • VS Code / Cursor IDE Extension             │
                        └──────────────────────────────────────────────┘
```

---

## 4. Key Architectural Pillars

### 4.1 Embedded Local Inference (`llama.cpp`)
OpenMono does not require an external Ollama, vLLM, or LM Studio installation. It bundles an optimized container image derived from `ghcr.io/ggml-org/llama.cpp:server`. On the G914's RTX 5090:
* Weights are locked into the 32GB GDDR7 VRAM.
* Flash-Attention is permanently enabled (`--flash-attn on`).
* Key-Value (KV) cache quantization defaults to `q8_0` precision, preserving reasoning fidelity across deep contexts up to **196,608 tokens**.

### 4.2 The Caddy Multi-Service Gateway
Rather than managing multiple public ports and authentication credentials for external tools, OpenMono installs a lightweight Caddy 2 reverse proxy.
* Caddy exposes port `47480`.
* A single bearer token (`LLAMA_API_KEY`) secures all incoming traffic.
* Internal path-based routing routes `/v1/*` to the inference engine, `/search*` to the private SearXNG search aggregator, and `/scrape*` to the Scrapling/Camoufox headless browser scraping engine.

### 4.3 Agent Client Protocol (ACP) Server
In addition to the Spectre.Console interactive terminal UI, the agent process hosts an **ACP Server** on port `7475`. ACP is a standardized, streaming JSON/SSE protocol that allows IDE extensions (VS Code, Cursor) and the official Mobile App to interact with the exact same conversational state, tool executor, and permission engine running in the terminal.

### 4.4 Roslyn Compiler Intelligence
Unlike generic coding agents that treat codebases as raw plain text, OpenMono integrates the **Microsoft.CodeAnalysis (Roslyn)** compiler platform. When executing within a C#/.NET solution, the agent creates an in-memory `AdhocWorkspace`, giving it compiler-level capabilities:
* Symbol resolution across external packages and project references.
* Exact call graphs (finding all callers and callees).
* Transitive blast-radius calculations before refactoring.
* Diagnostic validation (compilation errors and warnings) before presenting diffs to the developer.

---

## 5. Security & Isolation Guarantee

OpenMono implements defense-in-depth to protect the host operating system:

| Security Boundary | Mechanism | Protection Scope |
|---|---|---|
| **Filesystem Isolation** | Docker bind-mount (`${WORKSPACE}:/workspace`) | The agent cannot traverse into host `/etc`, `/home`, or root directories. |
| **Capability Engine** | Granular permissions (`FileRead`, `FileWrite`, `ProcessExec`) | Every mutating shell command or disk write requires explicit user approval or explicit whitelist matching. |
| **Network Egress Guard** | Internal Docker bridge network | Model inference and tool execution occur on an isolated virtual subnet. Outbound traffic is restricted to verified relay and search endpoints. |
| **Session Rollback** | Snapshot-based `/undo` history | File edits create discrete diff snapshots, allowing immediate reversal of multi-file refactoring passes. |
