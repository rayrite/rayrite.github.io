# OpenMonoAgent.ai — The Complete Definitive User Guide
**A Comprehensive Technical Manual for Local-First Agentic Software Engineering**  
**Target Hardware Profile:** PowerSpec G914 Gaming PC  
* **CPU:** AMD Ryzen 9 9950X3D (16 Cores / 32 Threads, 4.3 GHz Base / 5.7 GHz Boost, 128MB L3 3D V-Cache)  
* **Motherboard:** MSI MAG X870E Tomahawk WiFi (AM5, PCIe 5.0, 5GbE LAN, WiFi 7)  
* **Memory (RAM):** 64GB DDR5-6000 (2x32GB, Dual-Channel, EXPO Profile 1)  
* **Graphics (GPU):** MSI Ventus 3X OC NVIDIA GeForce RTX 5090 (32GB GDDR7, Blackwell SM 12.0, 1,792 GB/s)  
* **Primary Storage:** 2TB NVMe PCIe SSD (7,000+ MB/s Sequential Read)  
* **Networking:** Realtek 5GbE LAN · Qualcomm WiFi 7 (802.11be) · Bluetooth 5.4  
* **Host Operating System:** Zorin OS 18.1 64-bit (Ubuntu 24.04 LTS "Noble" Base · Linux Kernel 6.8/6.11 HWE)  
**Mobile Client:** OpenMono Official Android Application (`ai.openmonoagent.app` on Google Play Store)  
**Project References:** [OpenMonoAgent.ai](https://www.openmonoagent.ai/) · [StartupHakk GitHub Repository](https://github.com/StartupHakk/OpenMonoAgent.ai)  
**Date of Record:** October 13, 2026  
**Document Classification:** Master Consolidated Technical Manual  

---

## Master Table of Contents

1. [Executive Overview & The StartupHakk Manifesto](#1-executive-overview--the-startuphakk-manifesto)
2. [PowerSpec G914 Hardware Mapping & Performance Profile](#2-powerspec-g914-hardware-mapping--performance-profile)
3. [System Architecture & Container Topology](#3-system-architecture--container-topology)
4. [Zorin OS 18.1 System Setup & Hardware Driver Configuration](#4-zorin-os-181-system-setup--hardware-driver-configuration)
   - [4.1 The Ubuntu Derivative Codename Mapping](#41-the-ubuntu-derivative-codename-mapping)
   - [4.2 NVIDIA RTX 5090 Blackwell Driver & CUDA 12.8+ Setup](#42-nvidia-rtx-5090-blackwell-driver--cuda-128-setup)
   - [4.3 Docker CE & NVIDIA Container Toolkit Integration](#43-docker-ce--nvidia-container-toolkit-integration)
   - [4.4 AMD Ryzen 9 9950X3D Processor Tuning on Linux](#44-amd-ryzen-9-9950x3d-processor-tuning-on-linux)
   - [4.5 Memory & Storage Optimization (64GB RAM & 2TB NVMe)](#45-memory--storage-optimization-64gb-ram--2tb-nvme)
   - [4.6 Network Configuration (5GbE LAN & WiFi 7)](#46-network-configuration-5gbe-lan--wifi-7)
5. [Installation & Service Configuration Guide](#5-installation--service-configuration-guide)
   - [5.1 Choosing Your Deployment Topology (Single-Box vs Dual-Box)](#51-choosing-your-deployment-topology-single-box-vs-dual-box)
   - [5.2 Step-by-Step Bootstrap Installation](#52-step-by-step-bootstrap-installation)
   - [5.3 Inference Server Management Lifecycle](#53-inference-server-management-lifecycle)
   - [5.4 Web Search (SearXNG) & Scraping (Scrapling) Gateway Setup](#54-web-search-searxng--scraping-scrapling-gateway-setup)
   - [5.5 Configuration System & Master `settings.json` Schema](#55-configuration-system--master-settingsjson-schema)
6. [Agent Operations, Developer Tools & Workflows](#6-agent-operations-developer-tools--workflows)
   - [6.1 Launching the Agent: ANSI TUI vs Classic Mode](#61-launching-the-agent-ansi-tui-vs-classic-mode)
   - [6.2 Complete 20 Built-in Tool Catalog](#62-complete-20-built-in-tool-catalog)
   - [6.3 Deep-Dive: Roslyn Compiler Intelligence for .NET](#63-deep-dive-roslyn-compiler-intelligence-for-net)
   - [6.4 Language Server Protocol (LSP) Engine](#64-language-server-protocol-lsp-engine)
   - [6.5 Model Context Protocol (MCP) Integration](#65-model-context-protocol-mcp-integration)
   - [6.6 Capability-Based Security Permissions](#66-capability-based-security-permissions)
   - [6.7 Reasoning Mode (`/think`) & Plan Mode (`/plan`)](#67-reasoning-mode-think--plan-mode-plan)
   - [6.8 Slash Commands Reference](#68-slash-commands-reference)
   - [6.9 Workflow Automation with Playbooks](#69-workflow-automation-with-playbooks)
   - [6.10 VS Code & Cursor IDE Extension Integration (ACP)](#610-vs-code--cursor-ide-extension-integration-acp)
7. [Special Section: Mobile App & Android Remote Control Guide](#7-special-section-mobile-app--android-remote-control-guide)
   - [7.1 The Distributed Mobile Dual-Box Architecture](#71-the-distributed-mobile-dual-box-architecture)
   - [7.2 Remote Connection Topologies (Relay vs Wi-Fi LAN vs Mesh VPN)](#72-remote-connection-topologies-relay-vs-wi-fi-lan-vs-mesh-vpn)
   - [7.3 Step-by-Step Android Setup & Host Pairing Walkthrough](#73-step-by-step-android-setup--host-pairing-walkthrough)
   - [7.4 Mobile Application Interface Tour](#74-mobile-application-interface-tour)
   - [7.5 Five Detailed Real-World Remote Control Scenarios](#75-five-detailed-real-world-remote-control-scenarios)
     - [Scenario 1: On-the-Go Code Review & Architecture Blast-Radius Triage](#scenario-1-on-the-go-code-review--architecture-blast-radius-triage)
     - [Scenario 2: Multimodal Camera / Screenshot UI Bug Diagnosis](#scenario-2-multimodal-camera--screenshot-ui-bug-diagnosis)
     - [Scenario 3: Running & Gating an Automated Release Playbook](#scenario-3-running--gating-an-automated-release-playbook)
     - [Scenario 4: Test-Driven Refactoring with Mobile Interactive Permission Prompts](#scenario-4-test-driven-refactoring-with-mobile-interactive-permission-prompts)
     - [Scenario 5: Background Long-Running Build Monitoring & Emergency Kill Switch](#scenario-5-background-long-running-build-monitoring--emergency-kill-switch)
   - [7.6 Android-Specific Optimizations & Security Safeguards](#76-android-specific-optimizations--security-safeguards)
8. [Maintenance, Troubleshooting & Operational Runbook](#8-maintenance-troubleshooting--operational-runbook)
   - [8.1 Daily Operations Cheat-Sheet](#81-daily-operations-cheat-sheet)
   - [8.2 Troubleshooting Matrix & Recovery Procedures](#82-troubleshooting-matrix--recovery-procedures)
   - [8.3 High-Performance Tuning for RTX 5090 & Ryzen 9 9950X3D](#83-high-performance-tuning-for-rtx-5090--ryzen-9-9950x3d)
   - [8.4 Session Persistence, Backup & Disaster Recovery](#84-session-persistence-backup--disaster-recovery)
   - [8.5 Uninstallation & Clean Reinstallation](#85-uninstallation--clean-reinstallation)
9. [Master System Reference Cheat-Sheet](#9-master-system-reference-cheat-sheet)

---

## 1. Executive Overview & The StartupHakk Manifesto

Modern artificial intelligence for software developers has predominantly evolved into a cloud-metered utility. Proprietary codebases, security tokens, and corporate intellectual property are routinely transmitted to remote cloud infrastructure, incurring escalating per-token fees, artificial usage rate limits, and third-party data retention risks.

**OpenMonoAgent.ai** (OMA) was created by **StartupHakk LLC** to reverse this trend. Its design philosophy is rooted in a single, foundational principle:

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

OpenMono combines a high-performance **.NET 10** terminal-native coding agent with an embedded **`llama.cpp`** inference server. Built with first-class support for Linux and NVIDIA CUDA hardware, it automatically provisions and executes high-capability open-weights foundation models (primarily the **Qwen3.8-27B** dense model for GPUs and the **Qwen3.6-35B-A3B** Mixture-of-Experts model for CPUs).

---

## 2. PowerSpec G914 Hardware Mapping & Performance Profile

The **PowerSpec G914 Gaming PC** is an enterprise-grade desktop computing platform that provides an optimal hardware profile for running local coding agents and foundation models.

```
+----------------------------------------------------------------------------------------------------+
|                         POWERSPEC G914 HARDWARE TO OPENMONO MAPPING                                |
+-------------------------+-----------------------------+--------------------------------------------+
| Component               | Specification               | OpenMono Role & Allocation                 |
+-------------------------+-----------------------------+--------------------------------------------+
| Graphics Processing Unit| MSI Ventus 3X OC RTX 5090   | Primary Inference Engine                   |
|                         | 32GB GDDR7 VRAM, 512-bit bus| Weights: Qwen3.8-27B-UD-Q4_K_M (~15.5GB)   |
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
|                         | Dual-Channel, EXPO Profile 1| SearXNG & Scrapling Headless Browser Buffer|
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

### Memory Bandwidth Mechanics
Large language model generation speed is bound by memory bandwidth:
$$\text{Generation Speed} \propto \frac{\text{VRAM Bandwidth}}{\text{Active Parameter Footprint}}$$

* On previous-generation GPUs like the **RTX 3090** (936 GB/s bandwidth), generation speeds hover around 42–45 tok/s.
* On the **RTX 5090** (1,792 GB/s bandwidth), the weights stream across the 512-bit bus at double the speed, delivering **75–80 tokens/sec**. At this throughput, tool chaining and multi-turn refactoring loops execute with virtually zero conversational delay.

---

## 3. System Architecture & Container Topology

OpenMono enforces clear boundaries between untrusted AI reasoning and host system assets. The host workspace is bind-mounted into an isolated Docker bridge network:

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

## 4. Zorin OS 18.1 System Setup & Hardware Driver Configuration

### 4.1 The Ubuntu Derivative Codename Mapping
Zorin OS 18.1 is built on the **Ubuntu 24.04 LTS (Noble Numbat)** package base. Because `/etc/os-release` specifies `ID=zorin`, third-party repository scripts must map the release codename to `noble`:

```bash
# Verify distribution codename on Zorin OS 18.1
. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}"
```
*Expected Output:* `noble`.

### 4.2 NVIDIA RTX 5090 Blackwell Driver & CUDA 12.8+ Setup
The Blackwell RTX 5090 requires NVIDIA driver series 570 or 580+.

```bash
# 1. Update kernel headers and base build tools
sudo apt update && sudo apt full-upgrade -y
sudo apt install -y build-essential dkms linux-headers-$(uname -r) pkg-config curl git jq ripgrep

# 2. Add Graphics Drivers PPA
sudo add-apt-repository ppa:graphics-drivers/ppa -y
sudo apt update

# 3. Install Driver 580 Open
sudo apt install -y nvidia-driver-580-open nvidia-utils-580
sudo update-initramfs -u

# 4. Reboot system
sudo reboot
```

After rebooting, verify driver and VRAM detection:
```bash
nvidia-smi
```
*Ensure the card reports Driver 580+, CUDA 12.8+, and 32768 MiB total VRAM.*

### 4.3 Docker CE & NVIDIA Container Toolkit Integration
Install the official Docker Community Edition and configure GPU passthrough:

```bash
# 1. Configure Docker GPG Key and Noble Repository
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  noble stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 2. Install Docker CE
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 3. Grant Non-Root Docker Access
sudo usermod -aG docker $USER
newgrp docker

# 4. Install NVIDIA Container Toolkit
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

sudo apt update
sudo apt install -y nvidia-container-toolkit

# 5. Configure Docker Daemon and Restart
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker

# 6. Verify GPU Passthrough Container
docker run --rm --gpus all nvidia/cuda:12.8.0-base-ubuntu24.04 nvidia-smi
```

### 4.4 AMD Ryzen 9 9950X3D Processor Tuning on Linux
Set the `amd-pstate-epp` driver to `balance_performance` to prioritize the 3D V-Cache CCD for compilation and tool dispatch:

```bash
echo "balance_performance" | sudo tee /sys/devices/system/cpu/cpu*/cpufreq/energy_performance_preference > /dev/null
```

### 4.5 Memory & Storage Optimization (64GB RAM & 2TB NVMe)
Optimize kernel memory management for large context caching and enable SSD TRIM:

```bash
# Configure sysctl memory rules
sudo tee /etc/sysctl.d/99-openmono.conf > /dev/null << 'EOF'
vm.swappiness = 10
vm.vfs_cache_pressure = 50
fs.file-max = 2097152
fs.inotify.max_user_watches = 524288
fs.inotify.max_user_instances = 1024
EOF

sudo sysctl --system
sudo systemctl enable --now fstrim.timer
```

### 4.6 Network Configuration (5GbE LAN & WiFi 7)
Open local subnet access for OpenMono's services:
```bash
sudo ufw allow from 192.168.0.0/16 to any port 7474 proto tcp comment 'OpenMono llama-server'
sudo ufw allow from 192.168.0.0/16 to any port 7475 proto tcp comment 'OpenMono ACP server'
sudo ufw allow from 192.168.0.0/16 to any port 47480 proto tcp comment 'OpenMono Caddy Gateway'
sudo ufw reload
```

---

## 5. Installation & Service Configuration Guide

### 5.1 Choosing Your Deployment Topology (Single-Box vs Dual-Box)
* **Single-Box Mode (Default):** Both agent and model run on the PowerSpec G914. Ideal for working directly at the desktop while keeping ACP and tunnel daemons accessible to external devices.
* **Dual-Box Mode:** The G914 acts purely as an inference host (Option 2), and laptops or mobile phones connect as client agents (Option 3).

### 5.2 Step-by-Step Bootstrap Installation
Run the single-line bootstrap installer:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/StartupHakk/OpenMonoAgent.ai/refs/heads/main/get-openmono.sh)
```

1. **Select Role:** Choose **`1`** (Both — agent + inference server).
2. **GPU Confirmation:** When prompted `NVIDIA GPU Detected. Would you like to install on GPU? (Y/n):`, answer **`Y`**.
3. **Model Selection:** The installer detects 32GB VRAM and automatically provisions:
   * `Qwen3.8-27B-UD-Q4_K_M.gguf` (~15.5GB)
   * `mmproj-qwen3.8-27B-F16.gguf` (~0.9GB)
   * Context window preset: `196,608` tokens (reduced to `172,032` with vision burst allocation).
4. **Shell Reload:**
   ```bash
   source ~/.bashrc
   ```

### 5.3 Inference Server Management Lifecycle
```bash
openmono status     # Check health and VRAM allocation
openmono logs       # Tail inference server output
openmono restart    # Restart container
openmono stop       # Stop container and reclaim VRAM
openmono start      # Start container
```

### 5.4 Web Search (SearXNG) & Scraping (Scrapling) Gateway Setup
```bash
openmono setup search    # Installs SearXNG and Caddy gateway (:47480)
openmono setup scraper   # Installs Scrapling + Camoufox stealth browser
```

### 5.5 Configuration System & Master `settings.json` Schema
OpenMono configuration resides in `~/.openmono/settings.json`:

```jsonc
{
  "llm": {
    "endpoint": "http://localhost:7474",
    "model": "qwen3.8-27b",
    "context_size": 196608,
    "max_output_tokens": 16384,
    "temperature": 0.7,
    "top_p": 0.8,
    "top_k": 20,
    "presence_penalty": 1.5
  },
  "permissions": {
    "tools": {
      "Bash": {
        "allow": ["git *", "dotnet *", "npm *"],
        "deny": ["rm -rf /*"],
        "ask": ["sudo *"]
      }
    }
  },
  "web": {
    "gateway": "http://localhost:47480",
    "search": true,
    "scrape": true
  },
  "vision_enabled": true,
  "data_directory": "~/.openmono"
}
```

---

## 6. Agent Operations, Developer Tools & Workflows

### 6.1 Launching the Agent: ANSI TUI vs Classic Mode
```bash
cd ~/projects/my-app
openmono agent            # Full ANSI TUI interactive panel
openmono agent --classic  # Scrolling terminal REPL
```

### 6.2 Complete 20 Built-in Tool Catalog

```
+-------------------+---------------+-------------+-------------------------------------------------+
| Tool Name         | Access Mode   | Concurrency | Core Functionality & Purpose                    |
+-------------------+---------------+-------------+-------------------------------------------------+
| `FileRead`        | Read-Only     | Safe (Task) | Reads file slices with byte and line offsets.   |
| `FileWrite`       | Read/Write    | Serial      | Writes complete file contents to workspace disk.|
| `FileEdit`        | Read/Write    | Serial      | Surgical substring replacement in files.        |
| `ApplyPatch`      | Read/Write    | Serial      | Applies unified diffs (patch format).           |
| `Bash`            | Mutating      | Serial      | Runs bash commands within the Docker container. |
| `Glob`            | Read-Only     | Safe (Task) | Fast pattern-based file and directory searching.|
| `Grep`            | Read-Only     | Safe (Task) | Ripgrep-powered regex and literal content search|
| `ListDirectory`   | Read-Only     | Safe (Task) | Enumerates directory hierarchies and file sizes.|
| `Roslyn`          | Read-Only     | Safe (Task) | In-memory .NET compiler semantic code analysis. |
| `Lsp`             | Read-Only     | Safe (Task) | Language Server Protocol integration (hover/ref)|
| `WebSearch`       | Read-Only     | Safe (Task) | Meta-search via SearXNG gateway / DuckDuckGo.   |
| `WebFetch`        | Read-Only     | Safe (Task) | Markdown web scraper via Scrapling / Camoufox.  |
| `Agent`           | Multi-Modal   | Serial      | Spawns scoped sub-agents (Plan, Coder, Verify). |
| `PlanMode`        | Guardrail     | Safe (Task) | Locks agent into read-only exploration mode.    |
| `Playbook`        | Automation    | Serial      | Executes multi-step YAML workflow procedures.   |
| `Todo`            | Tracking      | Safe (Task) | Manages hierarchical task lists and milestones. |
| `MemorySave`      | State         | Serial      | Saves cross-session knowledge to YAML frontmatter|
| `AskUser`         | Interactive   | Serial      | Prompts the human developer for clarification.  |
| `ToolSearch`      | Discovery     | Safe (Task) | Searches dynamic tool and MCP capabilities.     |
| `SanityCheck`     | Validation    | Safe (Task) | Validates workspace boundaries and permissions. |
+-------------------+---------------+-------------+-------------------------------------------------+
```

### 6.3 Deep-Dive: Roslyn Compiler Intelligence for .NET
The `RoslynTool` executes 8 compiler-level inspection actions: `overview`, `find-references`, `callers`, `diagnostics`, `search`, `type-hierarchy`, `blast-radius`, and `get-symbol`.

### 6.4 Language Server Protocol (LSP) Engine
Universal LSP client supporting OmniSharp (C#), TypeScript Language Server (TS/JS), PyLSP (Python), Gopls (Go), and Rust-Analyzer (Rust).

### 6.5 Model Context Protocol (MCP) Integration
Connects to external MCP servers via JSON-RPC 2.0. Auto-detects `code-review-graph` and `graphify` when present in the workspace.

### 6.6 Capability-Based Security Permissions
Tools request granular capabilities (`FileReadCap`, `FileWriteCap`, `ProcessExecCap`, `NetworkEgressCap`, `VcsMutationCap`). Actions are matched against config rules (`allow`, `deny`) or routed to interactive prompts (`Allow Once`, `Allow for Session`, `Deny`).

### 6.7 Reasoning Mode (`/think`) & Plan Mode (`/plan`)
* Toggle `/think` or press `Ctrl+T` to stream native step-by-step thinking traces.
* Toggle `/plan` to enforce strict read-only restrictions while mapping solution architecture.

### 6.8 Slash Commands Reference
* `/checkpoint`: Saves conversation state snapshot.
* `/undo [n]`: Reverts file modifications.
* `/compact`: Summarizes conversation to free context tokens.
* `/export`: Dumps session transcript to Markdown or HTML.
* `/model <name>`: Switches active inference provider.

### 6.9 Workflow Automation with Playbooks
Structured multi-step procedures encoded in `.openmono/playbooks/<name>/PLAYBOOK.md` with typed parameters, steps, and human review gates (`gate: confirm`).

### 6.10 VS Code & Cursor IDE Extension Integration (ACP)
```bash
# Launch OpenMono in headless ACP mode
openmono agent --acp-only --acp-port 7475
```
Connect the `StartupHakk.openmono-agent` extension via the VS Code sidebar.

---

## 7. Special Section: Mobile App & Android Remote Control Guide

### 7.1 The Distributed Mobile Dual-Box Architecture
The official **OpenMono Android App** (`ai.openmonoagent.app`) turns your smartphone into a remote command station:
* **Host Engine:** PowerSpec G914 handles model inference (RTX 5090), Roslyn AST generation, Docker execution, and SearXNG search.
* **Mobile Client:** Android phone displays streaming text, renders code diffs, prompts for permission gates, and sends camera captures for vision analysis.

### 7.2 Remote Connection Topologies
1. **Outbound Relay Tunnel (Global Anywhere Access):** G914 connects outbound to `relay.openmonoagent.ai` using `frpc`. Bypasses NAT/CGNAT without port forwarding.
2. **Direct Local Wi-Fi (Home Mode):** Connects directly to the PC's LAN IP (`http://192.168.1.xxx:7474` or `:47480`) via 5GbE / WiFi 7.
3. **Encrypted Mesh VPN (Tailscale):** Peer-to-peer WireGuard encrypted routing.

### 7.3 Step-by-Step Android Setup & Host Pairing Walkthrough
1. **Host Setup:** On Zorin OS 18.1, execute:
   ```bash
   openmono tunnel setup
   openmono tunnel start
   openmono tunnel status
   ```
2. **Install Android App:** Install `ai.openmonoagent.app` from Google Play Store.
3. **Configure Connection:** Enter the target relay URL (`http://relay.openmonoagent.ai:<port>`) and your secret `LLAMA_API_KEY`.
4. **Verify Link:** Green status light confirms connection to `qwen3.8-27b` on RTX 5090.

### 7.4 Mobile Application Interface Tour
* **Live Chat Stream:** Tokens stream at 75–80 tok/s.
* **Diff Viewer:** Visualizes green additions and red deletions.
* **Permission Modal:** Buttons for **[ALLOW ONCE]**, **[ALLOW SESSION]**, and **[DENY]**.
* **Multimodal Camera:** Attach photos directly into the prompt using `@photo.jpg`.

---

### 7.5 Five Detailed Real-World Remote Control Scenarios

#### Scenario 1: On-the-Go Code Review & Architecture Blast-Radius Triage
* **Prompt from Android:**
  ```
  Analyze symbol 'OrderManager.SubmitOrder' in src/Orders/OrderManager.cs. Use Roslyn to trace all callers and compute the blast radius.
  ```
* **Execution:** Host evaluates call hierarchy in RAM; streams caller tree and risk assessment to Android screen in seconds.

#### Scenario 2: Multimodal Camera / Screenshot UI Bug Diagnosis
* **Action:** Capture screenshot on Android, attach as `@screenshot.png`:
  ```
  @screenshot.png The mobile modal header is clipped under the system status bar. Locate the CSS file in wwwroot/css and fix the viewport padding.
  ```
* **Execution:** SkiaSharp resizes image; multimodal vision encoder detects visual defect; agent locates CSS rule and presents diff on mobile for approval.

#### Scenario 3: Running & Gating an Automated Release Playbook
* **Prompt from Android:**
  ```
  /playbook release --version-type minor
  ```
* **Execution:** Agent runs git verification, compiles solution, and executes 400+ unit tests across 32 Ryzen threads. When hitting `gate: confirm`, phone receives an interactive alert: **[APPROVE RELEASE]** / **[ABORT]**. Tapping approve executes git tag and push on host.

#### Scenario 4: Test-Driven Refactoring with Mobile Interactive Permission Prompts
* **Prompt from Android:**
  ```
  Refactor CustomerService.cs to use async repository methods and verify with dotnet test.
  ```
* **Execution:** Agent prompts for `FileEdit` approval; developer inspects diff on phone and approves; agent prompts for `Bash` command `dotnet test`; developer approves; test results stream live to mobile screen.

#### Scenario 5: Background Long-Running Build Monitoring & Emergency Kill Switch
* **Prompt from Android:**
  ```
  docker compose build --no-cache
  ```
* **Execution:** Build logs stream to mobile screen while developer is in transit. Developer can view VRAM load via `/status` or tap **[STOP TURN]** to immediately abort execution if an anomaly occurs.

### 7.6 Android-Specific Optimizations & Security Safeguards
* **Battery Exemption:** Set OpenMono app battery usage to **Unrestricted** to prevent background SSE disconnects.
* **Biometric Authentication:** Enable fingerprint/face unlock inside the OpenMono app to protect remote terminal write privileges.
* **Emergency Kill:** Run `openmono tunnel stop` on the PC to instantly drop remote connections.

---

## 8. Maintenance, Troubleshooting & Operational Runbook

### 8.1 Daily Operations Cheat-Sheet
```bash
openmono status     # Check containers and GPU state
openmono restart    # Restart inference engine
openmono logs       # Tail inference logs
openmono tunnel logs# Tail relay connection logs
```

### 8.2 Troubleshooting Matrix & Recovery Procedures
* **`401 Unauthorized`:** Verify matching `LLAMA_API_KEY` between `docker/.env`, `settings.json`, and client devices.
* **`Docker socket access denied`:** Run `newgrp docker` or reload shell via `exec $SHELL`.
* **Port Conflicts (`7474`, `7475`, `47480`):** Use `sudo lsof -i :<port>` and stop lingering containers with `docker compose down`.
* **VRAM Out-of-Memory:** Cap prompt cache with `--cache-ram 2048` and `--image-max-tokens 1280` in `docker-compose.override.yml`.
* **Tunnel Dropped:** Execute `openmono tunnel restart` or re-authenticate with `openmono tunnel setup`.

### 8.3 High-Performance Tuning for RTX 5090 & Ryzen 9 9950X3D
* Enable Flash-Attention (`--flash-attn on`).
* Use `q8_0` KV cache quantization to maintain high mathematical precision over 192k contexts.
* Increase batch sizes (`--batch-size 4096`, `--ubatch-size 2048`) for 1,200+ prompt tokens/sec prefill speeds.
* Set compute threads (`--threads 16`) to match the 16 physical Zen 5 cores.

### 8.4 Session Persistence, Backup & Disaster Recovery
* Sessions persist to `~/.openmono/sessions/{date}_{sessionId}.jsonl`.
* Export transcripts via `/export markdown <path>`.
* Backup configuration with:
  ```bash
  tar -czvf ~/openmono-backup-$(date +%F).tar.gz ~/.openmono/settings.json ~/openmono.ai/docker/.env
  ```

### 8.5 Uninstallation & Clean Reinstallation
* Run `~/openmono.ai/scripts/uninstall.sh` (prompts whether to retain ~16GB downloaded models).
* Run `~/openmono.ai/scripts/re-install.sh` for a clean rebuild using cached model weights.

---

## 9. Master System Reference Cheat-Sheet

```
+---------------------------------------------------------------------------------------------------+
|                                  MASTER SYSTEM REFERENCE TABLE                                    |
+--------------------------+----------------------------+-------------------------------------------+
| Entity / Resource        | Value / Path               | Description & Function                    |
+--------------------------+----------------------------+-------------------------------------------+
| Primary Inference API    | `http://localhost:7474`    | llama-server OpenAI-compatible endpoint.  |
| Agent Client Protocol    | `http://localhost:7475`    | ACP SSE server for VS Code and Mobile.    |
| Multi-Service Gateway    | `http://localhost:47480`   | Caddy reverse proxy for search and scrape.|
| Relay Tunnel Host        | `relay.openmonoagent.ai`   | Public reverse tunnel endpoint.           |
| Web Management Portal    | `app.openmonoagent.ai`     | Relay registration and credential portal. |
| Model Weights Storage    | `~/openmono.ai/models/`    | GGUF model files and vision projectors.   |
| Docker Configurations    | `~/openmono.ai/docker/`    | Compose files, Caddyfile, and env files.  |
| Global State Directory   | `~/.openmono/`             | User settings, transcripts, checkpoints.  |
| Active Transcripts       | `~/.openmono/sessions/`    | Durable JSONL conversation logs.          |
| Project Rules File       | `<workspace>/OPENMONO.md`  | Repository-specific agent instructions.   |
| Google Play Identifier   | `ai.openmonoagent.app`     | Official Android mobile companion app.    |
| App Store Identifier     | `id6766077801`             | Official iOS mobile companion app.        |
| VS Code Marketplace ID   | `StartupHakk.openmono-agent` Extension for VS Code and Cursor IDEs.   |
+--------------------------+----------------------------+-------------------------------------------+
```
