# Openmonoagent User Guide

**Classification**: CVX Unified Research Collection  
**Source Deliverable**: `2026-10-13-openmonoagent-user-guide`  
**Constituent Files**: 7 documents  
**Generated**: 2026-10-14 03:57:28  

---

## Master Table of Contents

1. [OpenMonoAgent.ai — Executive Overview & System Architecture](#doc-1-00-openmonoagent-executive-and-hardware-architecture) (`00-openmonoagent-executive-and-hardware-architecture.md`)
2. [Zorin OS 18.1 System Setup & Hardware Driver Configuration](#doc-2-01-zorin-os-system-setup-and-driver-configuration) (`01-zorin-os-system-setup-and-driver-configuration.md`)
3. [OpenMonoAgent.ai — Installation & Configuration Guide](#doc-3-02-installation-and-configuration-guide) (`02-installation-and-configuration-guide.md`)
4. [OpenMonoAgent.ai — Agent Operations, Developer Tools & Workflows](#doc-4-03-agent-operations-developer-tools-and-workflows) (`03-agent-operations-developer-tools-and-workflows.md`)
5. [OpenMonoAgent.ai — Mobile App & Android Remote Control Guide](#doc-5-04-mobile-app-android-remote-control-guide) (`04-mobile-app-android-remote-control-guide.md`)
6. [OpenMonoAgent.ai — Maintenance, Troubleshooting & Operational Runbook](#doc-6-05-maintenance-troubleshooting-and-operational-runbook) (`05-maintenance-troubleshooting-and-operational-runbook.md`)
7. [OpenMonoAgent.ai — The Complete Definitive User Guide](#doc-7-openmonoagent-complete-user-guide) (`openmonoagent-complete-user-guide.md`)


---

<a id="doc-1-00-openmonoagent-executive-and-hardware-architecture"></a>
<!-- ====================================================================== -->
<!-- FILE: 00-openmonoagent-executive-and-hardware-architecture.md (Sequence: 01 of 07) -->
<!-- ====================================================================== -->

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


---

<a id="doc-2-01-zorin-os-system-setup-and-driver-configuration"></a>
<!-- ====================================================================== -->
<!-- FILE: 01-zorin-os-system-setup-and-driver-configuration.md (Sequence: 02 of 07) -->
<!-- ====================================================================== -->

# Zorin OS 18.1 System Setup & Hardware Driver Configuration
**Target Machine:** PowerSpec G914 Gaming PC  
**CPU:** AMD Ryzen 9 9950X3D (16 Cores / 32 Threads, Zen 5, 4.3–5.7 GHz, 128MB L3 3D V-Cache)  
**Motherboard:** MSI MAG X870E Tomahawk WiFi (AM5, PCIe 5.0, 5GbE LAN, WiFi 7)  
**RAM:** 64GB DDR5-6000 (2x32GB, EXPO Profile 1 Enabled)  
**GPU:** MSI Ventus 3X OC NVIDIA GeForce RTX 5090 (32GB GDDR7, Blackwell SM 12.0, 1,792 GB/s)  
**Storage:** 2TB NVMe PCIe 4.0/5.0 SSD  
**Operating System:** Zorin OS 18.1 64-bit (Ubuntu 24.04 LTS "Noble" base, Kernel 6.8/6.11 HWE)  
**Document Series:** Deliverable 01 of 05  

---

## 1. Operating System Foundation & Ubuntu Derivative Resolution

Zorin OS 18.1 is built upon the **Ubuntu 24.04 LTS (Noble Numbat)** package base. It pairs a refined, modern desktop environment with low-overhead Linux kernel scheduling, making it an outstanding platform for native artificial intelligence workloads, CUDA containers, and C#/.NET development.

### 1.1 The Codename Mapping Gotcha
Because Zorin OS reports its own distribution identity in `/etc/os-release`, standard third-party repository installers (such as Docker CE and NVIDIA CUDA) can fail if they query `VERSION_CODENAME` directly:

```bash
# Inspection of Zorin OS Release Identity
cat /etc/os-release
```
*Output:*
```ini
NAME="Zorin OS"
VERSION="18.1"
ID=zorin
ID_LIKE="ubuntu debian"
VERSION_CODENAME=noble
UBUNTU_CODENAME=noble
```

OpenMono's prerequisite installer (`scripts/install_prereqs.sh`) includes built-in logic to handle this:
```bash
ubuntu_codename() {
    local cn=""
    cn="$(. /etc/os-release 2>/dev/null && echo "${UBUNTU_CODENAME:-}")"
    if [ -z "$cn" ] && [ -f /etc/upstream-release/lsb-release ]; then
        cn="$(. /etc/upstream-release/lsb-release 2>/dev/null && echo "${DISTRIB_CODENAME:-}")"
    fi
    if [ -z "$cn" ]; then
        cn="$(. /etc/os-release 2>/dev/null && echo "${VERSION_CODENAME:-}")"
    fi
    echo "$cn"
}
```
In Zorin OS 18.1, `ubuntu_codename` evaluates to **`noble`**, ensuring that all official Ubuntu 24.04 LTS apt repositories map properly.

---

## 2. NVIDIA GeForce RTX 5090 (Blackwell) Driver & CUDA Stack Setup

The **MSI Ventus 3X OC RTX 5090** is powered by NVIDIA's **Blackwell** microarchitecture (Compute Capability / SM 12.0). It requires a modern driver (NVIDIA 570.xx or 580.xx series) with modern CUDA 12.8+ runtime support. Legacy 535.xx or 550.xx drivers will not detect the Blackwell architecture.

### Step 2.1: System Package Update & Kernel Headers
Ensure the Linux kernel headers and development packages are updated:

```bash
sudo apt update && sudo apt full-upgrade -y
sudo apt install -y build-essential dkms linux-headers-$(uname -r) pkg-config curl git jq ripgrep
```

### Step 2.2: Add the Graphics Drivers PPA & Install Driver 580 Open
The open-source kernel module driver (`580-server-open` or `580-open`) is recommended for modern 50-series GPUs on Linux kernels 6.8 and 6.11+:

```bash
# Add official proprietary GPU driver PPA
sudo add-apt-repository ppa:graphics-drivers/ppa -y
sudo apt update

# Install NVIDIA 580 Open Driver stack
sudo apt install -y nvidia-driver-580-open nvidia-utils-580

# Configure kernel modules to load early
sudo update-initramfs -u
```

### Step 2.3: Reboot Host System
```bash
sudo reboot
```

### Step 2.4: Validate GPU State via `nvidia-smi`
After rebooting into Zorin OS 18.1, verify that the RTX 5090 is initialized:

```bash
nvidia-smi
```

*Expected Verification Output:*
```text
+-----------------------------------------------------------------------------------------+
| NVIDIA-SMI 580.45                 Driver Version: 580.45         CUDA Version: 12.8     |
|-----------------------------------------+------------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id          Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |           Memory-Usage | GPU-Util  Compute M. |
|=========================================+========================+======================|
|   0  NVIDIA GeForce RTX 5090        Off |   00000000:01:00.0  On |                  N/A |
|  0%   34C    P8             28W / 600W  |     1124MiB / 32768MiB |      0%      Default |
+-----------------------------------------+------------------------+----------------------+
```
Notice the crucial parameters:
* **Memory-Usage:** `32768MiB` (32GB GDDR7 visible and ready).
* **CUDA Version:** `12.8` (or newer).
* **Bus-Id:** `01:00.0` running over PCIe 5.0 x16 via the MSI MAG X870E Tomahawk motherboard.

---

## 3. Docker CE & NVIDIA Container Toolkit Setup

OpenMono runs all agentic and inference workloads in isolated Docker containers. The NVIDIA Container Toolkit allows Docker containers to directly access the Blackwell GPU.

### Step 3.1: Install Official Docker Community Edition (CE)
Do not use the snap or standard Ubuntu universe Docker packages. Install the official Docker CE engine:

```bash
# 1. Install Docker apt repository keys
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# 2. Add Docker repository configured for 'noble'
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  noble stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 3. Install Docker Engine and Compose Plugin
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 4. Add your user account to the docker group
sudo usermod -aG docker $USER
```

> [!IMPORTANT]
> The current shell session will not recognize the new `docker` group until you refresh your group token or log out. Run:
> ```bash
> newgrp docker
> ```

### Step 3.2: Install NVIDIA Container Toolkit
```bash
# 1. Add NVIDIA Container Toolkit GPG repository
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

# 2. Update and install toolkit
sudo apt update
sudo apt install -y nvidia-container-toolkit

# 3. Configure Docker runtime for NVIDIA passthrough
sudo nvidia-ctk runtime configure --runtime=docker

# 4. Restart Docker daemon
sudo systemctl restart docker
```

### Step 3.3: Verify GPU Passthrough Inside a Container
Execute a one-line test container to guarantee that Docker can allocate the RTX 5090:

```bash
docker run --rm --gpus all nvidia/cuda:12.8.0-base-ubuntu24.04 nvidia-smi
```
If this prints the RTX 5090 status block from inside the container, your host-to-container GPU passthrough is functioning with zero virtualization penalty.

---

## 4. AMD Ryzen 9 9950X3D Processor Tuning on Linux

The **AMD Ryzen 9 9950X3D** is a dual-CCD processor:
* **CCD 0:** 8 Zen 5 cores equipped with 64MB 3D V-Cache (96MB total L3 cache) — optimal for single-threaded compilation, Roslyn parsing, and cache-intensive search.
* **CCD 1:** 8 Zen 5 high-frequency cores (up to 5.7 GHz) — optimal for parallel background processes, SearXNG indexing, and Scrapling headless browser engines.

### Step 4.1: Enable `amd-pstate-epp` Driver
In modern Linux kernels, the `amd-pstate-epp` driver provides hardware-guided frequency scaling. Confirm the driver status:

```bash
cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_driver
```
*Expected:* `amd-pstate-epp`.

### Step 4.2: Set Governor to Performance or Balanced-Performance
For compiling large solutions and running real-time agent loops, switch the Energy Performance Preference (EPP) to `balance_performance`:

```bash
# Apply to all 32 threads
echo "balance_performance" | sudo tee /sys/devices/system/cpu/cpu*/cpufreq/energy_performance_preference > /dev/null
```

To make this persistent across reboots, create a systemd service:

```bash
sudo tee /etc/systemd/system/amd-perf.service > /dev/null << 'EOF'
[Unit]
Description=Set AMD P-State EPP to Balance Performance
After=multi-user.target

[Service]
Type=oneshot
ExecStart=/bin/sh -c 'echo balance_performance | tee /sys/devices/system/cpu/cpu*/cpufreq/energy_performance_preference'

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now amd-perf.service
```

---

## 5. Storage (2TB NVMe) & Memory (64GB DDR5) Tuning

### Step 5.1: Swappiness Optimization
With 64GB of DDR5-6000 RAM, aggressive swapping to disk degrades system responsiveness. Lower the Linux swappiness threshold so the kernel keeps memory cached in RAM:

```bash
# Lower swappiness to 10 (swaps only under severe memory pressure)
sudo sysctl vm.swappiness=10
sudo sysctl vm.vfs_cache_pressure=50

# Persist to /etc/sysctl.d/99-openmono.conf
sudo tee /etc/sysctl.d/99-openmono.conf > /dev/null << 'EOF'
vm.swappiness = 10
vm.vfs_cache_pressure = 50
fs.file-max = 2097152
fs.inotify.max_user_watches = 524288
fs.inotify.max_user_instances = 1024
EOF

sudo sysctl --system
```

### Step 5.2: NVMe SSD Periodic TRIM
Ensure the 2TB NVMe SSD remains performant under repeated Docker layer builds and model weight caches:

```bash
sudo systemctl enable --now fstrim.timer
```

---

## 6. Networking Configuration (5GbE LAN & WiFi 7)

The MSI MAG X870E Tomahawk motherboard includes a **Realtek 5GbE LAN** controller and a **WiFi 7 (802.11be)** interface.

```bash
# Check physical network interfaces
ip link show
```

| Interface | Interface Name | Recommended Usage |
|---|---|---|
| **5GbE Wired LAN** | `enp*` / `eth0` | Primary connection for the PC. Connects directly to high-speed home router/switch for low-latency Android app control over Wi-Fi. |
| **WiFi 7 (802.11be)** | `wlp*` / `wlan0` | High-bandwidth wireless backup or dedicated hotspot network for remote devices. |

### Firewall (UFW) Configuration
If Zorin OS's firewall (`ufw`) is enabled, open the ports necessary for OpenMono's internal and LAN services:

```bash
# Check UFW status
sudo ufw status

# If enabled, allow local network access to OpenMono ports
sudo ufw allow from 192.168.0.0/16 to any port 7474 proto tcp comment 'OpenMono llama-server'
sudo ufw allow from 192.168.0.0/16 to any port 7475 proto tcp comment 'OpenMono ACP server'
sudo ufw allow from 192.168.0.0/16 to any port 47480 proto tcp comment 'OpenMono Caddy Gateway'
sudo ufw reload
```

---

## 7. Hardware & Driver Readiness Verification Matrix

Run through this checklist before executing the OpenMono installer:

| Verification Item | Command | Expected Healthy Result |
|---|---|---|
| **Linux Kernel** | `uname -r` | `6.8.0-*` or `6.11.0-*` (64-bit) |
| **Zorin OS Base** | `cat /etc/os-release &#124; grep UBUNTU_CODENAME` | `UBUNTU_CODENAME=noble` |
| **NVIDIA Driver** | `nvidia-smi --query-gpu=driver_version --format=csv,noheader` | `580.*` or `570.*` |
| **RTX 5090 VRAM** | `nvidia-smi --query-gpu=memory.total --format=csv,noheader` | `32768 MiB` |
| **Docker Engine** | `docker version --format '{{.Server.Version}}'` | `27.*` or `28.*` |
| **Docker GPU Support** | `docker run --rm --gpus all nvidia/cuda:12.8.0-base-ubuntu24.04 echo "CUDA OK"` | `CUDA OK` |
| **Docker Non-Root** | `docker ps` | Lists containers without `sudo` |
| **CPU Frequency Scaling** | `cat /sys/devices/system/cpu/cpu0/cpufreq/scaling_driver` | `amd-pstate-epp` |
| **RAM Total** | `free -h &#124; grep Mem:` | Total $\approx 62\text{--}64\text{ GiB}$ |
| **NVMe Free Storage** | `df -h / &#124; tail -n1` | Free $\ge 100\text{ GB}$ (Model requires ~22GB) |


---

<a id="doc-3-02-installation-and-configuration-guide"></a>
<!-- ====================================================================== -->
<!-- FILE: 02-installation-and-configuration-guide.md (Sequence: 03 of 07) -->
<!-- ====================================================================== -->

# OpenMonoAgent.ai — Installation & Configuration Guide
**Target System:** PowerSpec G914 Gaming PC (AMD Ryzen 9 9950X3D · 64GB DDR5-6000 · RTX 5090 32GB GDDR7 · 2TB NVMe)  
**Host OS:** Zorin OS 18.1 64-bit (Ubuntu 24.04 LTS "Noble" base)  
**Primary Model:** Qwen3.8-27B-UD-Q4_K_M (196,608 Context Window · Full Accuracy)  
**Document Series:** Deliverable 02 of 05  

---

## 1. Choosing Your Deployment Topology

When setting up OpenMono on your PowerSpec G914, you have two primary deployment architectures to choose from:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ OPTION A: Single-Box Mode (Recommended for the PowerSpec G914)              │
├─────────────────────────────────────────────────────────────────────────────┤
│ Both the agent CLI/TUI and the llama-server inference engine run locally on │
│ this machine. The RTX 5090's 32GB GDDR7 VRAM easily handles the 27B model,  │
│ vision projector, and full context window, while the Ryzen 9 9950X3D and    │
│ 64GB RAM power the agent, Roslyn analysis, and web scraping gateway.        │
│                                                                             │
│ [RTX 5090 (llama-server)] ◄── local socket / :7474 ──► [Agent TUI / ACP]    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ OPTION B: Dual-Box Mode (Distributed Inference Rig)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ The PowerSpec G914 acts as a dedicated 24/7 Inference Server (Option 2).    │
│ Your secondary device (e.g. lightweight travel laptop or Android phone)     │
│ runs the Agent (Option 3) and connects via local LAN or outbound relay.     │
│                                                                             │
│ [G914 RTX 5090 (Inference)] ◄── frpc / Relay ──► [Laptop / Android Phone]   │
└─────────────────────────────────────────────────────────────────────────────┘
```

For most developers with this PC, **Option A (Single-Box Mode)** is ideal because you can run the agent locally when sitting at your desk, while simultaneously exposing the background ACP and tunnel services to your Android phone when away.

---

## 2. Step-by-Step Installation

OpenMono provides an automated, idempotent bootstrap installer that checks dependencies, builds containers, downloads models, and configures the environment.

### Step 2.1: Execute the Bootstrap Installer
Open your terminal in Zorin OS 18.1 and run:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/StartupHakk/OpenMonoAgent.ai/refs/heads/main/get-openmono.sh)
```

### Step 2.2: Interactive Prompt — Select Installation Role
The installer will prompt you to select your installation scope:

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  OpenMono.ai — Bootstrap Installer
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  What do you want to install on this machine?

  1. Both              — agent + inference server on one box (single-box mode)
  2. Inference server  — dedicated inference box that runs the model (dual-box)
  3. Agent only        — laptop/workstation that talks to remote inference

  Select [1-3] (default: 1): 1
```
Press **`1`** (or press Enter).

### Step 2.3: Phase 1 — Prerequisite Installation `[1/8]` → `[8/8]`
Phase 1 scans the operating system and ensures all baseline packages are present:
1. `[1/8]` Detects OS (`Zorin OS 18.1` mapped to Ubuntu base `noble`).
2. `[2/8]` Verifies sudo privileges.
3. `[3/8]` Detects hardware:
   ```text
   NVIDIA GPU Detected: NVIDIA GeForce RTX 5090 (32768 MiB VRAM)
   Would you like to install on GPU? (Y/n): Y
   ```
   Type **`Y`** to confirm GPU mode.
4. `[4/8]` Installs build tools, CMake, ripgrep, and curl.
5. `[5/8]` Configures Docker CE and the `docker` user group.
6. `[6/8]` Configures NVIDIA Container Toolkit runtime integration.
7. `[7/8]` Installs .NET 10 SDK to `~/.dotnet`.
8. `[8/8]` Prepares local configuration directory at `~/.openmono`.

### Step 2.4: Phase 2 — Model Download & Container Composition
Once Phase 1 completes, Phase 2 begins automatically:

1. **Hardware Tier Detection:**  
   The installer reads the RTX 5090's 32GB VRAM and selects the top-tier **24GB+ configuration**:
   * **Base Model:** `Qwen3.8-27B-UD-Q4_K_M.gguf` (~15.5 GB)
   * **Multimodal Vision Projector:** `mmproj-qwen3.8-27B-F16.gguf` (~0.9 GB)
   * **Context Size Preset:** `196,608` tokens (reduced slightly to `172,032` tokens when vision encoder burst headroom is reserved).

2. **Parallel Download:**  
   Downloads stream directly from Hugging Face (`unsloth/Qwen3.8-27B-GGUF`) with checksum verification into `~/openmono.ai/models/`.

3. **Container Build & Startup:**  
   The script builds the `openmono-agent` container, pulls `ghcr.io/ggml-org/llama.cpp:server`, and launches the inference daemon via Docker Compose.

4. **Completion Message:**
   ```text
   ────────────────────────────────────────────────────────────
     Setup Complete
   ────────────────────────────────────────────────────────────

     ✓ OpenMono.ai is ready to use!
     Your machine is configured for single-box mode (agent + inference).

     Next steps:
       1. cd your-project/
       2. openmono agent

     Other commands:
       openmono status       # Show container and model state
       openmono config       # Configure runtime parameters
   ────────────────────────────────────────────────────────────
   ```

### Step 2.5: Reload Shell Environment
Update your active terminal session so that `openmono` is present on your system `PATH`:

```bash
source ~/.bashrc
```

Verify that the CLI is accessible:
```bash
openmono help
```

---

## 3. Managing the Inference Server Lifecycle

The inference server runs as a background system container (`llama-server`) managed by Docker Compose. You control it directly using the `openmono` wrapper:

```bash
# Check container health, model loaded, VRAM usage, and active port
openmono status

# Tail the real-time inference server logs (shows prompt processing tok/s)
openmono logs

# Stop the inference server and free GPU VRAM
openmono stop

# Start the inference server
openmono start

# Restart the inference server (useful after changing model quantization or context size)
openmono restart
```

### Checking Active GPU Allocation
To verify that the model is fully offloaded to the RTX 5090's VRAM without CPU paging:

```bash
nvidia-smi
```
Under `Processes`, you will see `llama-server` consuming approximately **18.5GB to 24.5GB** of VRAM (depending on active KV cache allocation). On your 32GB RTX 5090, you still retain **7.5GB to 13.5GB of free VRAM headroom**, preventing out-of-memory crashes even during long multi-turn sessions with vision.

---

## 4. Web Search & Scraping Services Setup

By default, OpenMono includes built-in fallback web search (via DuckDuckGo) and direct HTTP fetching. For private, production-grade search and anti-bot stealth scraping, OpenMono includes self-hosted containers:

```bash
# 1. Install SearXNG private meta-search engine + Caddy Gateway
openmono setup search

# 2. Install Scrapling + Camoufox stealth headless browser engine
openmono setup scraper
```

### How the Web Services Stack Works
```
Agent Tool: WebSearch ──┐
                        ├──► Caddy Gateway (:47480) ──┬──► SearXNG (:8080)
Agent Tool: WebFetch  ──┘     (Bearer Auth Protected) └──► Scrapling (:5000)
```
* **SearXNG:** Aggregates search results without tracking, advertisements, or rate limits.
* **Scrapling:** A high-speed FastAPI scraper with intelligent escalation:
  1. *Fast Path:* Asynchronous HTTP fetcher.
  2. *Stealth Path:* If a target website returns Cloudflare or Bot challenges (HTTP 403/429), it automatically escalates to **Camoufox** (a stealth, anti-fingerprinting headless Firefox browser) to render the DOM and extract clean Markdown.

---

## 5. Comprehensive Configuration Reference

OpenMono loads settings through a 6-tier hierarchical cascade, where later layers override earlier ones:
1. Built-in defaults.
2. Global user configuration (`~/.openmono/settings.json`).
3. Project-specific configuration (`.openmono/settings.json` in your project root).
4. Explicit configuration flag (`--config <path>`).
5. Environment variables (prefixed with `OPENMONO_`).
6. CLI runtime flags (`--model`, `--endpoint`, etc.).

### 5.1 Using `openmono config`
You can inspect and modify settings without opening text editors:

```bash
# Read a setting
openmono config get llm.endpoint

# Set a setting for the current project
openmono config set llm.temperature 0.6

# Set a setting globally across all projects
openmono config set --global llm.model qwen3.8-27b
```

### 5.2 Master `settings.json` Schema
Below is an annotated, production-ready `~/.openmono/settings.json` tailored for the PowerSpec G914:

```jsonc
{
  // Primary LLM connection and sampling settings
  "llm": {
    "endpoint": "http://localhost:7474",
    "model": "qwen3.8-27b",
    "context_size": 196608,
    "max_output_tokens": 16384,
    "temperature": 0.7,
    "top_p": 0.8,
    "top_k": 20,
    "presence_penalty": 1.5,
    "min_p": 0.0,
    "repetition_penalty": 1.0
  },

  // Opt-in cloud providers for hybrid workflows (Anthropic, OpenAI, Ollama)
  "providers": {
    "anthropic": {
      "api_key": "",
      "model": "claude-sonnet-4-20250514",
      "active": false
    },
    "openai": {
      "api_key": "",
      "model": "gpt-4o",
      "active": false
    },
    "ollama": {
      "endpoint": "http://localhost:11434",
      "model": "llama3",
      "active": false
    }
  },

  // Security and execution permissions
  "permissions": {
    "tools": {
      "Bash": {
        "allow": ["git *", "dotnet *", "npm *", "cargo *", "pytest *"],
        "deny": ["rm -rf /*", "mkfs *", "dd *", ":(){ :|:& };:"],
        "ask": ["sudo *", "docker rm *", "git reset --hard *"]
      },
      "FileWrite": {
        "deny": ["*.env", "*.pem", "*.key", "id_rsa*"]
      }
    }
  },

  // Lifecycle shell hooks
  "hooks": {
    "pre_tool_use": [
      {
        "if": { "tool": "Bash", "input_contains": "git push" },
        "run": "echo '[AUDIT] Git push attempted at $(date)' >> ~/.openmono/audit.log"
      }
    ],
    "post_tool_use": [],
    "session_start": []
  },

  // Model Context Protocol (MCP) external server registrations
  "mcp_servers": {
    "database-inspector": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://user:pass@localhost:5432/mydb"],
      "enabled": false
    }
  },

  // Sampling bundles switchable via /model or presets
  "model_presets": {
    "precise": {
      "temperature": 0.2,
      "top_p": 0.9,
      "presence_penalty": 0.0,
      "active": false
    },
    "creative": {
      "temperature": 1.0,
      "top_p": 0.95,
      "presence_penalty": 1.8,
      "active": false
    }
  },

  // Self-hosted web gateway settings
  "web": {
    "gateway": "http://localhost:47480",
    "search": true,
    "scrape": true
  },

  // System-level flags
  "auto_detect_code_graph": true,
  "vision_enabled": true,
  "verbose": false,
  "data_directory": "~/.openmono"
}
```

---

## 6. Environment Variables Reference

Every parameter in `settings.json` can be overridden by environment variables:

| Environment Variable | Equivalent Setting | Description |
|---|---|---|
| `OPENMONO_ENDPOINT` | `llm.endpoint` | URL of the inference server (e.g. `http://localhost:7474`) |
| `OPENMONO_MODEL` | `llm.model` | Model name alias sent in chat completions |
| `OPENMONO_API_KEY` | `llm.api_key` | Bearer authentication key |
| `OPENMONO_CONTEXT_SIZE` | `llm.context_size` | Context window ceiling in tokens |
| `OPENMONO_VISION_ENABLED` | `vision_enabled` | Set to `1` to enable multimodal image processing |
| `OPENMONO_WEB_SEARCH` | `web.search` | Set to `1` to route searches through local SearXNG |
| `OPENMONO_WEB_SCRAPE` | `web.scrape` | Set to `1` to route page fetches through local Scrapling |
| `OPENMONO_ACP_ENABLED` | (Internal) | Set to `1` to host the ACP server on port `7475` |
| `OPENMONO_WORKSPACE` | `working_directory` | Overrides the active workspace directory |
| `OPENMONO_MODEL_PRESET` | (Preset Selector) | Activates a named preset (e.g. `precise`, `creative`) |

---

## 7. Command-Line (CLI) Flag Overrides

Flags passed directly to `openmono agent` have the highest precedence, overriding both `settings.json` and environment variables for that single session:

| Flag | Parameter | Purpose |
|---|---|---|
| `--classic` | Display Mode | Launches standard scrolling terminal instead of the full-screen Spectre.Console ANSI TUI. |
| `--acp-only` | Headless Mode | Skips the terminal UI and runs exclusively as an ACP background server on port `7475` (for IDE extensions). |
| `--acp-port <port>` | Port Selection | Changes the ACP server port (default is `7475`). |
| `--endpoint <url>` | `llm.endpoint` | Redirects the agent to an alternate inference server (e.g. a remote box). |
| `--model <name>` | `llm.model` | Overrides the target model identifier. |
| `--verbose`, `-v` | Debugging | Displays full streaming JSON chunks, token counters, and tool execution diagnostics. |
| `--config <path>` | File Path | Forces OpenMono to load configuration from a specified JSON file. |


---

<a id="doc-4-03-agent-operations-developer-tools-and-workflows"></a>
<!-- ====================================================================== -->
<!-- FILE: 03-agent-operations-developer-tools-and-workflows.md (Sequence: 04 of 07) -->
<!-- ====================================================================== -->

# OpenMonoAgent.ai — Agent Operations, Developer Tools & Workflows
**Hardware Profile:** PowerSpec G914 Gaming PC (AMD Ryzen 9 9950X3D · 64GB DDR5-6000 · RTX 5090 32GB GDDR7 · 2TB NVMe)  
**Host Environment:** Zorin OS 18.1 64-bit  
**Core Runtime:** .NET 10 CLI · Roslyn Compiler Platform · Docker Sandbox  
**Document Series:** Deliverable 03 of 05  

---

## 1. Launching OpenMono in Your Workspace

Navigate to any source code repository on your filesystem and start the agent:

```bash
cd ~/projects/my-web-app

# Launch in default interactive Full-Screen ANSI TUI Mode
openmono agent

# Alternative: Launch in Classic Scrolling Terminal REPL Mode
openmono agent --classic
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       OPENMONO ANSI TUI INTERFACE TOUR                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ ~/projects/my-web-app  •  Session: e2a94f18b3c0  •  Model: qwen3.8-27b      │
│ [Context: 14,208 / 196,608 tokens (7%)]  •  [Speed: 78.4 tok/s]            │
├─────────────────────────────────────────────────────────────────────────────┤
│ ◈ Thinking [412 tok] (Press Ctrl+T to expand reasoning chain)               │
│                                                                             │
│ → Reading Program.cs (142 lines)                                            │
│ → Analyzing symbol graph with Roslyn (blast-radius: 3 call sites affected)  │
│ → Proposing unified diff:                                                   │
│   - public void ProcessOrder(Order order)                                   │
│   + public async Task ProcessOrderAsync(Order order, CancellationToken ct)  │
│                                                                             │
│ [Permission Prompt] Allow FileEdit on 'Program.cs'?                         │
│ [1] Allow Once   [2] Allow for Session   [3] Deny Once   [4] Deny Session   │
├─────────────────────────────────────────────────────────────────────────────┤
│ you › refactor Program.cs to use async/await                                │
│ [Tab] Autocomplete  •  [Ctrl+P] Commands  •  [Ctrl+T] Think  •  [F1] Help   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.1 TUI Component Breakdown
* **Header & Telemetry Panel:** Displays active session UUID, directory path, real-time memory bandwidth, streaming token generation velocity (~75–80 tok/s on the RTX 5090), and a dynamic context-window gauge.
* **Reasoning Hourglass & Thinking Panel:** When native reasoning mode (`/think`) is engaged, a live collapsible block displays hidden chain-of-thought logic. An animated indicator confirms active tool deliberation.
* **Diff Previewer:** Code modifications are rendered as syntax-highlighted unified diffs before being committed to disk.
* **Interactive Permission Gate:** Prompts the developer before executing any mutating tool call (bash execution, file writes, git operations).

---

## 2. Complete Built-In Tool Catalog

OpenMono ships with **20 built-in tools** compiled directly into the C# CLI binary. Tools declare their input schemas, concurrency safety, and required security capabilities.

```
+---------------------------------------------------------------------------------------------------+
|                                  OPENMONO BUILT-IN TOOLS CATALOG                                  |
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

### 2.1 Concurrency Rules
* **Read-Only Tools** (`FileRead`, `Glob`, `Grep`, `Roslyn`, `WebSearch`) implement `IsConcurrencySafe = true` and execute in parallel via `Task.WhenAll`. Read tasks can initiate even while the LLM is streaming incoming tokens.
* **Mutating Tools** (`FileWrite`, `FileEdit`, `ApplyPatch`, `Bash`) execute strictly in series to eliminate race conditions and corrupted file states.

---

## 3. Deep-Dive: Roslyn Compiler Intelligence

OpenMono is natively engineered for the .NET ecosystem. When pointed at a C# solution (`.sln`) or project (`.csproj`), the `RoslynTool` spins up an in-memory `Microsoft.CodeAnalysis.AdhocWorkspace` and loads project compilation metadata. Compilation references are cached in system RAM for 5 minutes.

The agent uses 8 distinct compiler actions:

```
+---------------------------------------------------------------------------------------------------+
|                                 ROSLYN COMPILER ENGINE ACTIONS                                    |
+-------------------+-------------------------------------------------------------------------------+
| Action            | Output & Developer Benefit                                                    |
+-------------------+-------------------------------------------------------------------------------+
| `overview`        | Enumerates all classes, structs, records, interfaces, and methods in a file.  |
| `find-references` | Discovers every exact reference to a symbol across the entire solution.       |
| `callers`         | Traces method call graphs upstream to locate every invoking method.           |
| `diagnostics`     | Runs the C# compiler against the file, returning compiler errors and warnings.|
| `search`          | Searches symbol tables for matching class, method, or property names.         |
| `type-hierarchy`  | Computes inheritance trees, base classes, interfaces, and derived types.      |
| `blast-radius`    | Calculates direct and transitive dependencies affected by changing a method. |
| `get-symbol`      | Inspects symbol metadata, exact modifiers, parameter types, and doc comments. |
+-------------------+-------------------------------------------------------------------------------+
```

### Example Roslyn Tool Invocation:
```json
{
  "action": "blast-radius",
  "symbol": "AuthService.ValidateToken",
  "file": "src/Services/AuthService.cs"
}
```
*Agent Response:*
```text
→ Blast-Radius Analysis for 'AuthService.ValidateToken':
  Direct Callers (3):
    • LoginController.cs: Line 45 (LoginController.Authenticate)
    • JwtMiddleware.cs: Line 28 (JwtMiddleware.InvokeAsync)
    • ApiKeyValidator.cs: Line 112 (ApiKeyValidator.VerifyHeader)
  Transitive Callers (2):
    • WebAppStartup.cs: Line 89 (registers JwtMiddleware in pipeline)
    • IntegrationTests/AuthTests.cs: Line 67 (test fixture invocation)
```

---

## 4. Language Server Protocol (LSP) Engine

For non-.NET languages, OpenMono features a universal LSP client (`LspServerManager`). Language servers load lazily upon first file access:

| Language | Extension | Underlying Language Server Binary |
|---|---|---|
| **C#** | `.cs` | OmniSharp |
| **TypeScript / JavaScript** | `.ts`, `.tsx`, `.js` | `typescript-language-server` |
| **Python** | `.py` | `pylsp` (Python LSP Server) |
| **Go** | `.go` | `gopls` |
| **Rust** | `.rs` | `rust-analyzer` |

The `LspTool` exposes 5 standard primitives: `hover`, `definition`, `references`, `completion`, and `diagnostic`.

---

## 5. Model Context Protocol (MCP) Integration

OpenMono acts as a first-class **Model Context Protocol (MCP)** host client. It connects to external MCP servers over `stdio` using JSON-RPC 2.0.

### 5.1 Auto-Detected Knowledge Graphs
OpenMono automatically discovers and registers MCP knowledge graph servers without requiring manual configuration:
1. **`code-review-graph`:** If present on your system path and a graph database exists in the workspace, OpenMono registers it automatically.
2. **`graphify`:** If `graphify-out/graph.json` exists in the repository, OpenMono exposes code knowledge graphs to the model.

### 5.2 Registering Custom MCP Servers
Add external tool providers in `~/.openmono/settings.json`:

```jsonc
"mcp_servers": {
  "sqlite-db": {
    "command": "uvx",
    "args": ["mcp-server-sqlite", "--db-path", "/workspace/data.db"],
    "enabled": true
  },
  "git-analyzer": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-git"],
    "enabled": true
  }
}
```
Registered MCP tools are automatically exposed to the agent as:  
`mcp__{serverName}__{toolName}` (e.g. `mcp__sqlite-db__query`).

---

## 6. Capability-Based Permissions & Sandboxing

Every tool request passes through OpenMono's security engine before touching disk or launching processes:

```
Tool Invocation ──► Schema Validation ──► Path Sanity Check ──► Plan Mode Guard
                                                                      │
                                                                      ▼
Denied ◄── Match 'deny' ◄── Match 'allow' ◄── PermissionEngine Capability Check
  │                            │                              │
Show Alert                 Auto-Approve                  Unmatched
                                                              │
                                                              ▼
                                                   Interactive Prompt
                                             (Allow Once / Session / Deny)
```

### Capability Declarations:
* `FileReadCap(path)` — Reading files within `/workspace`.
* `FileWriteCap(path, op)` — Creating, editing, or deleting files.
* `ProcessExecCap(binary, args)` — Executing bash or child commands.
* `NetworkEgressCap(host, port)` — Outbound HTTP/HTTPS requests.
* `VcsMutationCap(repo, op)` — Git commit, push, or branch operations.
* `AgentSpawnCap(type, task)` — Spawning child sub-agents.

---

## 7. Native Reasoning Mode (`/think`) & Plan Mode (`/plan`)

### 7.1 Reasoning Mode (`/think` / `Ctrl+T`)
Qwen3.8-27B possesses native chain-of-thought capabilities. When enabled:
* The model emits tokens to a hidden `reasoning_content` stream.
* Temperature is automatically dropped from `0.7` to **`0.6`**.
* Presence penalty is set to **`0.0`** to permit reiterative logical loops.
* The thinking chain displays in the TUI as a collapsible block: `◈ Thinking [312 tok]`.

### 7.2 Plan Mode (`/plan`)
Engaging Plan Mode restricts the agent exclusively to read-only tools (`FileRead`, `Glob`, `Grep`, `Roslyn`, `Lsp`, `WebSearch`). Any attempt by the model to call `FileWrite`, `FileEdit`, or mutating `Bash` commands is intercepted and blocked at the tool pipeline boundary. This provides a risk-free environment for exploring architecture before authorizing changes.

---

## 8. Slash Commands Reference

Slash commands provide immediate control over the active session:

| Command | Syntax | Operational Effect |
|---|---|---|
| `/help` | `/help` | Displays command reference and keyboard shortcuts. |
| `/think` | `/think` (or `Ctrl+T`) | Toggles native step-by-step reasoning mode. |
| `/plan` | `/plan` | Toggles read-only architectural planning guardrails. |
| `/model` | `/model <name>` | Switches active model or provider on the fly. |
| `/checkpoint` | `/checkpoint [name]` | Persists an immediate named snapshot of conversational state. |
| `/undo` | `/undo [n]` | Reverts the last $n$ file modifications using snapshot diffs. |
| `/compact` | `/compact [focus]` | Summarizes conversation history to reclaim context window. |
| `/resume` | `/resume [session_id]` | Resumes an earlier session from `~/.openmono/sessions/`. |
| `/status` | `/status` | Prints turn count, token utilization, model, and active directory. |
| `/stats` | `/stats` | Shows aggregate prompt tokens, completion tokens, and tok/s. |
| `/export` | `/export [markdown&#124;html]`| Exports conversation transcript and code diffs to a file. |
| `/init` | `/init` | Generates a tailored `OPENMONO.md` rules file for the project. |
| `/clear` | `/clear` | Flushes context window and initializes a clean turn. |
| `/debug` | `/debug` | Toggles verbose diagnostic logging in the console. |
| `/quit` | `/quit` (or `Ctrl+C` x2) | Safely shuts down the agent session. |

---

## 9. Automated Workflows: Playbooks

Playbooks are version-controlled, multi-step engineering procedures encoded in YAML frontmatter and Markdown. They allow engineering teams to codify repeatable workflows (e.g. pre-commit reviews, release tagging, security audits) with built-in human verification gates.

### 9.1 Directory Structure
Playbooks reside in `.openmono/playbooks/` (project-specific) or `~/.openmono/playbooks/` (user-wide):

```
.openmono/playbooks/
└── commit/
    ├── PLAYBOOK.md          # Primary workflow declaration
    └── constraints/
        └── git-rules.md     # Commit message formatting constraints
```

### 9.2 PLAYBOOK.md Architecture
```yaml
---
name: commit
version: 1.0.0
description: Prepares, tests, and stages git changes with conventional commit messages.
trigger: manual
parameters:
  scope:
    type: string
    description: Component or module scope (e.g. auth, api, ui)
    required: false
steps:
  - id: analyze-diff
    name: Inspect Git Status and Diffs
    instructions: Run 'git status' and 'git diff' to identify modified files.
  - id: run-tests
    name: Verify Test Suite
    instructions: Run 'dotnet test' or test suite. Halt if any test fails.
  - id: human-gate
    name: Developer Approval
    gate: confirm
    prompt: Review the proposed commit message. Proceed with commit?
  - id: execute-commit
    name: Commit Changes
    instructions: Stage files and execute git commit with conventional commit format.
---

You are an expert release engineer. Follow the step instructions precisely.
Do not proceed past gates without explicit human confirmation.
```
Run a playbook from the terminal with:
```bash
openmono agent --playbook commit
```

---

## 10. VS Code & Cursor IDE Extension Integration

For developers who prefer working inside their code editor, OpenMono provides an official extension (`StartupHakk.openmono-agent`). The extension communicates with OpenMono via the **Agent Client Protocol (ACP)** on port `7475`.

### Step 10.1: Install the Extension
```bash
# In VS Code or Cursor
code --install-extension StartupHakk.openmono-agent
```

### Step 10.2: Start OpenMono in ACP Mode
In your project directory, launch OpenMono in headless ACP server mode:

```bash
cd ~/projects/my-web-app
openmono agent --acp-only --acp-port 7475
```

### Step 10.3: Connect the Extension
1. Open the **OpenMono Agent** icon in the VS Code sidebar.
2. Click **Start Agent for Workspace**.
3. The panel connects to `localhost:7475` via streaming Server-Sent Events (SSE). You can reference files using `@filename`, toggle Plan/Build modes, and review diffs directly inside your editor.


---

<a id="doc-5-04-mobile-app-android-remote-control-guide"></a>
<!-- ====================================================================== -->
<!-- FILE: 04-mobile-app-android-remote-control-guide.md (Sequence: 05 of 07) -->
<!-- ====================================================================== -->

# OpenMonoAgent.ai — Mobile App & Android Remote Control Guide
**Target System:** PowerSpec G914 Gaming PC (AMD Ryzen 9 9950X3D · RTX 5090 32GB GDDR7 · Zorin OS 18.1)  
**Mobile Client:** OpenMono Official Android App (`ai.openmonoagent.app` on Google Play Store)  
**Connectivity Modes:** Outbound Relay Tunnel (Global WAN) · Direct Wi-Fi LAN · Encrypted Mesh VPN  
**Document Series:** Deliverable 04 of 05  

---

## 1. The "Dual-Box" Mobile Architecture

The official **OpenMono Mobile App** (`ai.openmonoagent.app`) transforms your Android cell phone into a secure, portable control center for your PowerSpec G914 gaming PC. 

Rather than running an underpowered, quantized model on mobile hardware, OpenMono implements a distributed **Dual-Box Architecture**:
* **The Compute Engine (Home):** Your PowerSpec G914 running Zorin OS 18.1 executes the high-throughput `llama.cpp` inference server (75–80 tok/s on the RTX 5090), the full .NET 10 Roslyn compiler, Docker sandboxing, and web search gateways.
* **The Command Surface (Mobile):** Your Android phone connects to the host over encrypted channels, streaming real-time tokens, inspecting code diffs, attaching camera screenshots for vision reasoning, and gating tool permissions.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        OPENMONO MOBILE DUAL-BOX ARCHITECTURE                           │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│  [ ANDROID SMARTPHONE ]                                                                │
│  Package: `ai.openmonoagent.app`                                                       │
│  Features: Streaming SSE Chat · Diff Viewer · Permission Gating · Camera / Vision      │
│        │                                                    │                          │
│        │ (Option 1: Global Cellular WAN)                    │ (Option 2: Home Wi-Fi)   │
│        │ Outbound HTTPS / WSS                               │ Direct Subnet HTTP       │
│        ▼                                                    ▼                          │
│  ┌────────────────────────────────────┐             ┌───────────────────────────────┐  │
│  │ OpenMono Relay Service             │             │ Qualcomm Wi-Fi 7 / 5GbE LAN   │  │
│  │ `relay.openmonoagent.ai:<port>`    │             │ `http://192.168.1.xxx:7474`   │  │
│  │ (Bypasses Home NAT & CGNAT)        │             │ (Sub-millisecond LAN Latency) │  │
│  └─────────────────┬──────────────────┘             └───────────────┬───────────────┘  │
│                    │                                                │                  │
│                    │ Reverse Tunnel Connection (frpc)               │ Direct Port      │
│                    ▼                                                ▼                  │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │                     POWERSPEC G914 INFERENCE & AGENT RIG                         │  │
│  │                                                                                  │  │
│  │  • Caddy Multi-Service Gateway (:47480) [Bearer Token Protected]                 │  │
│  │  • llama-server (:7474) [RTX 5090 32GB GDDR7 · Qwen3.8-27B · mmproj Vision]     │  │
│  │  • ACP Background Server (:7475) [Session Store & Tool Pipeline]                 │  │
│  │  • Docker Workspace Sandbox [Bind-mounted project filesystem]                    │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Choosing Your Remote Connection Method

You can connect your Android smartphone to your PowerSpec G914 using any of three connection methods:

### Method A: Outbound Relay Tunnel (Recommended for Global Anywhere Access)
* **Best For:** Controlling your agent when away from home over 5G/LTE cellular or external Wi-Fi.
* **Mechanism:** The PowerSpec G914 opens an **outbound-only** reverse tunnel using `frpc` to the OpenMono relay cluster (`relay.openmonoagent.ai`).
* **Security & Network Traversal:** Because the connection is outbound from your PC, **no router ports need to be opened**, no dynamic DNS is required, and it functions seamlessly behind Carrier-Grade NAT (CGNAT) and strict firewalls. Traffic is protected by your secret `LLAMA_API_KEY`.

### Method B: Direct Local Wi-Fi LAN (Ultra-Low Latency Home Mode)
* **Best For:** Controlling the agent from your couch, backyard, or local network.
* **Mechanism:** The phone connects directly to your PC's local IP address (e.g. `http://192.168.1.150:7474` or Caddy gateway `:47480`).
* **Performance:** Completely circumvents the internet. Zero external data usage, maximum throughput, and sub-millisecond network latency over the G914's WiFi 7 / 5GbE connection.

### Method C: Encrypted Mesh VPN (Tailscale / WireGuard)
* **Best For:** Developers who want peer-to-peer encrypted remote networking without utilizing any shared relay infrastructure.
* **Mechanism:** Both Zorin OS 18.1 and your Android phone join a private Tailscale tailnet. The phone reaches the G914 via its private 100.x.y.z IP address.

---

## 3. Step-by-Step Android Setup & Pairing Walkthrough

### Step 3.1: Install the Android Application
1. Open the **Google Play Store** on your Android phone.
2. Search for **`OpenMono: AI Coding Agent`** (or access package identifier: `ai.openmonoagent.app`).
3. Tap **Install** and open the application.

### Step 3.2: Configure the PowerSpec G914 for Remote Tunneling
On your PowerSpec G914 running Zorin OS 18.1, initialize the tunnel subsystem:

```bash
openmono tunnel setup
```

The terminal will prompt you for your email address and generate a 6-digit One-Time Passcode (OTP):
```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  OpenMono.ai — Relay Tunnel Setup
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Enter your email address: developer@example.com
  Requesting verification code...
  Verification code sent.

  Enter the 6-digit verification code: 849201
  ✓ Authenticated as developer@example.com
  ✓ Assigned relay port: 38472
  ✓ Tunnel configured and frpc service generated.
```

Start the background tunnel daemon:
```bash
openmono tunnel start
```

Retrieve your connection credentials:
```bash
# Print active connection parameters
openmono tunnel status
```
*Output:*
```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Inference Box Connection Details
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Target Endpoint:  http://relay.openmonoagent.ai:38472
  LLAMA API Key:    sk-oma-9f82d1c74a0e4b8593
  Local Target:     127.0.0.1:47480 (Caddy Gateway)
  Status:           Online (Active Tunnel)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

*(Note: For Local Wi-Fi Mode, run `hostname -I` on Zorin OS to find your local IP, e.g. `192.168.1.150`, and use `http://192.168.1.150:47480`).*

### Step 3.3: Pair the Android Phone
1. Open the OpenMono app on Android.
2. On the **Server Configuration** screen, enter:
   * **Server Endpoint:** `http://relay.openmonoagent.ai:38472` (or your local IP for LAN mode).
   * **API Key:** `sk-oma-9f82d1c74a0e4b8593` (copied from the host terminal or welcome email).
   * **Friendly Rig Name:** `G914-RTX5090`.
3. Tap **Test Connection & Connect**.
4. The status indicator will turn green:  
   `✓ Connected to Qwen3.8-27B on RTX 5090 (196k context)`.

---

## 4. Mobile Application Interface Tour

The Android interface is specifically engineered for software engineering workflows on touchscreens:

```
┌────────────────────────────────────────────────────────┐
│ ≡  G914-RTX5090  [Online • 78.2 tok/s]           ⚙   │
├────────────────────────────────────────────────────────┤
│ Session: mobile-triage-4491                            │
│ Workspace: /home/cooly/projects/ecommerce-core         │
│ Context Window: [■■□□□□□□□□] 18.2k / 196k              │
├────────────────────────────────────────────────────────┤
│ ◈ Thinking (248 tokens) [Tap to expand]                │
│                                                        │
│ OpenMono:                                              │
│ I analyzed `PaymentService.cs` using Roslyn. Three     │
│ methods are missing cancellation tokens. Proposing     │
│ the following fix:                                     │
│                                                        │
│ ┌─ Unified Diff: PaymentService.cs ──────────────────┐ │
│ │ @@ -42,7 +42,7 @@                                 │ │
│ │ - public async Task Charge(CreditCard card)        │ │
│ │ + public async Task Charge(CreditCard card,        │ │
│ │ +                          CancellationToken ct)   │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ ⚠️ PERMISSION REQUEST                                   │
│ Tool: FileEdit on 'src/Services/PaymentService.cs'     │
│                                                        │
│ [ ALLOW ONCE ]   [ ALLOW SESSION ]   [ DENY ]          │
├────────────────────────────────────────────────────────┤
│ [📷 Camera] [📎 File] [/ Commands]                    │
│ Type a message or task...                            ▲ │
└────────────────────────────────────────────────────────┘
```

* **Streaming Token Feed:** Tokens render in real time with low latency.
* **Syntax-Highlighted Diff Cards:** Code diffs are rendered with green additions and red deletions, optimized for mobile viewing.
* **Touch Permission Approvals:** When OpenMono invokes a gated tool (`FileEdit`, `FileWrite`, `Bash`), action buttons allow you to inspect the payload and approve or deny execution.
* **Camera & Attachment Integration:** Tap the camera icon to capture photos of whiteboard diagrams or UI bugs and upload them directly to the multimodal vision encoder.

---

## 5. Five Detailed Real-World Remote Control Examples

The following scenarios demonstrate real-world usage of OpenMono from an Android phone, connecting to the PowerSpec G914 at home.

---

### Example 1: On-the-Go Code Review & Architecture Blast-Radius Triage
* **Scenario:** You are away from your desk and need to assess the risk of modifying a shared utility method in your C# backend.

#### Action on Android Phone:
In the chat bar, enter:
```
Analyze the symbol 'TokenService.ValidateSignature' in src/Security/TokenService.cs. Use Roslyn to tell me every caller in the solution and calculate the blast radius before we touch it.
```

#### What Happens on the PowerSpec G914:
1. The request streams to the G914.
2. The agent executes the built-in `Roslyn` tool with the action `blast-radius`.
3. The AdhocWorkspace scans all project assemblies in RAM.

#### Output Streamed to Android Screen:
```text
→ Tracing symbol: TokenService.ValidateSignature(string token)
→ Roslyn Semantic Analysis Complete:

Direct Call Sites (4):
  1. src/Middleware/JwtAuthMiddleware.cs (Line 38)
  2. src/Controllers/WebhookController.cs (Line 92)
  3. src/Services/SessionManager.cs (Line 114)
  4. tests/SecurityTests/TokenTests.cs (Line 55)

Transitive Dependency Radius:
  • 12 downstream controllers depend on JwtAuthMiddleware.
  • WebhookController feeds payment ingestion.

Risk Verdict: HIGH
Any signature change requires updating 4 call sites and will affect authentication across all 12 API controllers.
```
*Developer Benefit:* You evaluate architectural risk from your phone before agreeing to a refactoring request.

---

### Example 2: Multimodal Camera / Screenshot UI Bug Diagnosis
* **Scenario:** You are reviewing a mobile web page on your Android phone and spot a broken layout. You take a screenshot and ask OpenMono to locate and fix the CSS bug in the repository.

#### Action on Android Phone:
1. Take a screenshot on your Android device (`Power + Volume Down`).
2. Tap the **📎 Attachment** icon in the OpenMono app and select the screenshot.
3. The app uploads the image as `@screenshot.png` to the G914's vision staging directory.
4. Enter the prompt:
   ```
   @screenshot.png Look at this screenshot of the navbar on mobile view. The hamburger menu is overlapping the logo and the cart icon is pushed off-screen. Find the stylesheet responsible in wwwroot/css and fix the responsive flexbox rules.
   ```

#### What Happens on the PowerSpec G914:
1. The G914 CLI compresses the image using SkiaSharp to fit the vision token budget (~1,100 tokens).
2. The multimodal projector (`mmproj-qwen3.8-27B-F16.gguf`) processes the image on the RTX 5090.
3. The model identifies the layout defect: `navbar-nav` has `flex-wrap: nowrap` and an explicit `min-width: 600px` that fails on mobile viewports under 480px.
4. The agent uses `Grep` to find `.navbar-nav` in `wwwroot/css/site.css` and generates a patch.

#### Output Streamed to Android Screen:
```text
→ Vision Analysis: Detected navbar overflow at <480px width.
→ Located style definition in wwwroot/css/site.css: Line 114.
→ Proposed Patch:

--- wwwroot/css/site.css
+++ wwwroot/css/site.css
@@ -114,3 +114,7 @@
-.navbar-nav { display: flex; flex-wrap: nowrap; min-width: 600px; }
+.navbar-nav { display: flex; flex-wrap: wrap; justify-content: space-between; }
+@media (max-width: 480px) {
+  .navbar-nav { flex-direction: column; width: 100%; }
+}

[PERMISSION REQUIRED] Allow FileEdit on 'wwwroot/css/site.css'?
```
5. You tap **[ALLOW ONCE]** on your phone screen. The file updates on the G914 NVMe SSD instantly.

---

### Example 3: Running & Gating an Automated Release Playbook
* **Scenario:** You are attending a meeting and need to trigger a staging release, verify the unit test suite, and approve the git release tag from your phone.

#### Action on Android Phone:
In the chat bar, enter:
```
/playbook release --version-type patch
```

#### What Happens on the PowerSpec G914:
1. OpenMono loads `.openmono/playbooks/release/PLAYBOOK.md`.
2. Step 1: Runs `git status` to ensure working tree is clean.
3. Step 2: Executes `dotnet test --configuration Release` inside the Docker sandbox.
4. The 32 threads of the Ryzen 9 9950X3D compile and execute 420 unit tests in 4.2 seconds.
5. All tests pass. The playbook hits Step 3: `gate: confirm`.

#### Notification on Android Screen:
Your phone vibrates with an interactive modal:
```text
╔════════════════════════════════════════════════════════╗
║  PLAYBOOK GATE: release v1.4.3                        ║
╠════════════════════════════════════════════════════════╣
║  • 420 Unit Tests Passed in 4.2s                       ║
║  • Version bumped: 1.4.2 → 1.4.3                      ║
║  • Target Tag: release/v1.4.3                          ║
║                                                        ║
║  Proceed with Git Tag and Push to Origin?              ║
║                                                        ║
║         [ APPROVE RELEASE ]      [ ABORT ]             ║
╚════════════════════════════════════════════════════════╝
```
6. Tap **[APPROVE RELEASE]**.
7. The agent completes the final steps: tags the commit, pushes to remote origin, and streams the confirmation message back to your phone.

---

### Example 4: Test-Driven Refactoring with Mobile Interactive Permission Prompts
* **Scenario:** You want OpenMono to refactor a blocking database repository into an asynchronous implementation and prove correctness by executing the test suite.

#### Action on Android Phone:
Enter the prompt:
```
Refactor UserRepository.cs to replace synchronous DbContext calls with async/await equivalents (e.g. ToListAsync, FirstOrDefaultAsync). Then run the test suite to make sure nothing broke.
```

#### Interaction Flow:
1. **Agent Turn 1:** OpenMono calls `FileRead` on `src/Data/UserRepository.cs`. (Auto-allowed).
2. **Agent Turn 2:** OpenMono inspects Entity Framework imports and rewrites the repository methods using `FileEdit`.
3. **Mobile Screen Alert:**
   ```text
   Permission Gate: FileEdit
   File: src/Data/UserRepository.cs
   Replaced 6 synchronous calls with Task/Async equivalents.
   ```
   Tap **[ALLOW ONCE]**.
4. **Agent Turn 3:** OpenMono prepares to execute the unit tests via `Bash`:
   ```bash
   dotnet test --filter Category=RepositoryTests
   ```
5. **Mobile Screen Alert:**
   ```text
   Permission Gate: Bash Command
   Command: dotnet test --filter Category=RepositoryTests
   ```
   Tap **[ALLOW ONCE]**.
6. The test execution streams live on your Android screen:
   ```text
   Starting test execution, please wait...
   Passed! - Failed: 0, Passed: 28, Skipped: 0, Total: 28, Duration: 820 ms.
   ✓ Refactor complete. 28 repository tests passing.
   ```

---

### Example 5: Background Long-Running Build Monitoring & Emergency Kill Switch
* **Scenario:** You start a large container rebuild or comprehensive benchmark suite on the G914 before heading out, and monitor progress while in transit.

#### Action on Android Phone:
From your phone:
```
Run 'docker compose build --no-cache' and keep me updated on progress.
```

#### Monitoring on Phone:
* As Docker builds layers on Zorin OS, the build logs stream to your mobile screen.
* You can check system load at any time by typing `/status`:
  ```text
  Turn: 4 • Tokens: 12,410 • Speed: 78.5 tok/s • Context: 16k/196k
  Host: CPU 38% • RTX 5090 VRAM: 18.2GB / 32GB • Temps: 42°C
  ```

#### Emergency Kill Switch:
If you notice an unexpected recursive script or failing build loop:
* Tap the red **[STOP TURN]** button in the top navigation bar (equivalent to double-tapping `Ctrl+C`).
* The agent halts container execution immediately.
* Type `/undo 1` to revert any tentative file changes back to the pre-build checkpoint.

---

## 6. Android Power Management & Security Best Practices

To ensure reliable remote operation from your smartphone:

### 6.1 Disable Android Battery Optimization for OpenMono
Modern Android operating systems (Android 14, 15, 16) aggressively sleep background apps, which can drop active Server-Sent Events (SSE) connections:
1. Open Android **Settings** → **Apps** → **OpenMono**.
2. Tap **App Battery Usage** (or Battery).
3. Select **Unrestricted**. This ensures background tasks continue streaming even when your phone screen turns off.

### 6.2 Lock Screen Security & Biometrics
Because OpenMono has write and shell execution capabilities within your workspace container:
1. In the OpenMono app, tap **Settings (⚙)**.
2. Enable **Require Biometric Authentication**.
3. The app will require your fingerprint or face scan whenever returning from the background before accepting permission approval taps.

### 6.3 Emergency Remote Tunnel Shutdown
If you lose your phone or suspect unauthorized access:
On the PowerSpec G914 terminal, run:
```bash
# Terminate the tunnel instantly
openmono tunnel stop

# Rotate your API key
openmono config set llm.api_key $(openssl rand -hex 24)
```
This drops all active relay tunnels immediately, cutting external access until you re-authenticate.


---

<a id="doc-6-05-maintenance-troubleshooting-and-operational-runbook"></a>
<!-- ====================================================================== -->
<!-- FILE: 05-maintenance-troubleshooting-and-operational-runbook.md (Sequence: 06 of 07) -->
<!-- ====================================================================== -->

# OpenMonoAgent.ai — Maintenance, Troubleshooting & Operational Runbook
**Target System:** PowerSpec G914 Gaming PC (AMD Ryzen 9 9950X3D · RTX 5090 32GB GDDR7 · Zorin OS 18.1)  
**System Services:** `llama-server` (Port 7474) · `openmono-agent` (ACP Port 7475) · `caddy` (Port 47480) · `frpc`  
**Document Series:** Deliverable 05 of 05  

---

## 1. Daily Operations Runbook

The following commands provide day-to-day administrative control over your OpenMono installation:

```bash
# Check overall health (Docker containers, GPU utilization, model loaded, active ports)
openmono status

# Start the background inference daemon
openmono start

# Stop the inference daemon and reclaim all 32GB GPU VRAM
openmono stop

# Restart the inference server (required after modifying model parameters or context size)
openmono restart

# Tail live inference server logs (displays prompt processing and token generation metrics)
openmono logs

# Inspect and follow the background relay tunnel logs
openmono tunnel logs

# View help and full command catalog
openmono help
```

---

## 2. Troubleshooting Matrix & Recovery Procedures

```
+---------------------------------------------------------------------------------------------------+
|                                 COMMON ISSUES & RESOLUTION RECIPES                                |
+-----------------------+---------------------------------------+-----------------------------------+
| Symptom / Error Code  | Root Cause                            | Resolution Procedure              |
+-----------------------+---------------------------------------+-----------------------------------+
| `401 Unauthorized`    | `LLAMA_API_KEY` mismatch between      | Re-align API key across docker,   |
| (API / Mobile App)    | inference server and agent / mobile.  | config, and client profiles.      |
+-----------------------+---------------------------------------+-----------------------------------+
| `Docker socket access | User group `docker` not refreshed in  | Execute `newgrp docker` or reload |
| denied (EACCES)`      | active shell session.                 | user session via `exec $SHELL`.   |
+-----------------------+---------------------------------------+-----------------------------------+
| Port conflict         | Orphaned container or process holding | Run `lsof -i :7474` and terminate |
| `7474 / 7475 / 47480` | port 7474, 7475, or 47480.            | the lingering process PID.        |
+-----------------------+---------------------------------------+-----------------------------------+
| GPU VRAM Out-of-Memory| Prompt cache growth + multimodal      | Cap `--cache-ram 2048` and adjust |
| (CUDA OOM / crash)    | vision encoder burst allocation.      | context size to 172,032 tokens.   |
+-----------------------+---------------------------------------+-----------------------------------+
| Relay tunnel offline  | Expired OTP token or stalled `frpc`   | Run `openmono tunnel restart` or  |
| (`Connection refused`)| background daemon.                    | re-authenticate with `setup`.     |
+-----------------------+---------------------------------------+-----------------------------------+
| `Command not found`   | `openmono` executable not on active   | Add `~/openmono.ai` to `PATH` in  |
| after terminal reboot | shell environment `PATH`.             | `~/.bashrc` and source file.      |
+-----------------------+---------------------------------------+-----------------------------------+
```

---

### Recipe 2.1: Resolving `401 Unauthorized` Errors
If your Android phone, remote laptop, or VS Code extension fails with an HTTP 401 error, the client API key does not match the server's bearer token.

1. **Check the server token on the PowerSpec G914:**
   ```bash
   grep '^LLAMA_API_KEY=' ~/openmono.ai/docker/.env
   ```
   *Example Output:* `LLAMA_API_KEY=sk-oma-9f82d1c74a0e4b8593`

2. **Check the client token:**
   ```bash
   openmono config get llm.api_key
   ```

3. **Re-synchronize the token:**
   ```bash
   # Update local agent configuration
   openmono config set llm.api_key sk-oma-9f82d1c74a0e4b8593

   # Update in the Android Mobile App:
   # Settings -> Server -> API Key -> Paste identical token
   ```

---

### Recipe 2.2: Resolving Docker Permission Denied Errors
If executing `openmono status` or running the installer produces:
`Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock`

The Linux kernel has not loaded your updated supplementary group memberships into the current shell:

```bash
# Refresh group membership in the active shell
newgrp docker

# Verify access without sudo
docker ps
```
To permanently ensure your user account is in the group:
```bash
sudo usermod -aG docker $USER
```

---

### Recipe 2.3: Clearing Port Conflicts
If port `7474` (llama-server), `7475` (ACP server), or `47480` (Caddy gateway) is locked by an orphaned process:

```bash
# Locate offending process PID
sudo lsof -i :7474
sudo lsof -i :7475
sudo lsof -i :47480

# Cleanly stop OpenMono Docker containers
cd ~/openmono.ai/docker
docker compose down

# If a stray process remains, terminate it
sudo kill -9 <PID>

# Restart OpenMono
openmono start
```

---

### Recipe 2.4: Managing VRAM Headroom During Heavy Vision Sessions
While the RTX 5090 has a massive 32GB GDDR7 capacity, running long multi-turn sessions with vision image attachments can accumulate KV cache. 

During inference, two memory pools expand:
1. **The KV Cache:** Memory storing token states across the conversation.
2. **The Prompt Cache (`--cache-ram`):** Prefill caching to accelerate subsequent turns (defaults to 8,192 MiB in `llama.cpp`).
3. **Vision Encoder Burst:** Whenever an image is processed, the multimodal projector requires a temporary spike of ~474 MiB to ~1,200 MiB of VRAM.

If you encounter CUDA memory exhaustion during vision sessions:
1. Edit `~/openmono.ai/docker/docker-compose.override.yml`:
   ```yaml
   services:
     llama-server:
       command: >
         --cache-ram 2048
         --cache-reuse 256
         --image-max-tokens 1280
   ```
   *Explanation:*
   * `--cache-ram 2048`: Caps the prompt cache buffer at 2GB instead of 8GB, freeing up 6GB of permanent VRAM headroom.
   * `--cache-reuse 256`: Prevents cache thrashing on brief prompts.
   * `--image-max-tokens 1280`: Restricts image token allocations.

2. Restart the server:
   ```bash
   openmono restart
   ```

---

### Recipe 2.5: Restoring the Relay Tunnel
If your Android phone cannot reach the PowerSpec G914 when switching from Wi-Fi to cellular data:

```bash
# Check the tunnel systemd unit
sudo systemctl status frpc

# Tail the tunnel connection logs
openmono tunnel logs

# Restart the tunnel client
openmono tunnel restart
```
If the tunnel credentials have expired or the port mapping was revoked:
```bash
# Re-run tunnel setup and re-authenticate via OTP
openmono tunnel setup
openmono tunnel start
```

---

## 3. High-Performance Tuning for RTX 5090 & Ryzen 9 9950X3D

To maximize performance on your specific hardware configuration:

### 3.1 Inference Server Concurrency & Batch Sizes
The default `docker-compose.yml` is tuned for a balance of speed and stability. On the G914, you can edit `~/openmono.ai/docker/docker-compose.override.yml` to take full advantage of the RTX 5090's 512-bit memory bus:

```yaml
services:
  llama-server:
    command: >
      --batch-size 4096
      --ubatch-size 2048
      --threads 16
      --threads-batch 16
      --flash-attn on
      --cache-type-k q8_0
      --cache-type-v q8_0
```
* **`--batch-size 4096` / `--ubatch-size 2048`:** Enlarges the prompt prefill batch, increasing prompt evaluation speed up to **1,200+ prompt tokens/sec**.
* **`--threads 16`:** Pins compute threads to match the 16 physical Zen 5 cores of the AMD Ryzen 9 9950X3D.
* **`--cache-type-k q8_0` / `--cache-type-v q8_0`:** Maintains 8-bit quantized KV cache, preserving precision for long-horizon coding tasks without the quality degradation of 4-bit KV caches.

---

## 4. Session Persistence, Backup & Disaster Recovery

### 4.1 Session Storage Format
Every conversation turn is recorded to a durable JSONL file:
* **Directory:** `~/.openmono/sessions/`
* **Naming Schema:** `{YYYY-MM-DD}_{sessionId}.jsonl`
* **Checkpoints:** Stored alongside as `{sessionId}.checkpoints.json`

Line 1 contains the session header and metadata, while subsequent lines store individual user turns, assistant responses, thinking traces, and tool execution outputs.

### 4.2 Exporting Transcripts
To generate an offline markdown or HTML transcript of an active or past session:

```bash
# Inside the OpenMono agent prompt:
/export markdown ~/reports/refactor-session.md
/export html ~/reports/refactor-session.html
```

### 4.3 Backing Up OpenMono Configuration
To preserve your custom playbooks, memory files, and configuration before system updates:

```bash
tar -czvf ~/openmono-backup-$(date +%F).tar.gz \
  ~/.openmono/settings.json \
  ~/.openmono/memory/ \
  ~/.openmono/playbooks/ \
  ~/openmono.ai/docker/.env
```

---

## 5. Uninstallation & Clean Reinstallation

### 5.1 Safe Uninstallation
To remove OpenMono without deleting your downloaded model weights (saving you a ~16GB re-download):

```bash
cd ~/openmono.ai
./scripts/uninstall.sh
```
The uninstaller will prompt:
```text
Keep downloaded model weights in ~/openmono.ai/models? (Y/n): Y
```
* Selecting **`Y`** retains the GGUF files in `models/` while cleaning Docker containers, volumes, and shell shortcuts.
* Selecting **`n`** performs a complete scrub of the filesystem.

### 5.2 Clean Re-Installation
To perform a fresh installation using previously downloaded models:

```bash
cd ~/openmono.ai
./scripts/re-install.sh
```

---

## 6. Master Reference Quick-Sheet

### Core Network Ports
* **`7474` (TCP):** Local `llama-server` OpenAI-compatible API.
* **`7475` (TCP):** OpenMono Agent Client Protocol (ACP) SSE server.
* **`47480` (TCP):** Caddy Multi-Service Gateway (SearXNG + Scrapling + llama-server).
* **`8080` (Internal Docker):** SearXNG meta-search engine.
* **`5000` (Internal Docker):** Scrapling / Camoufox stealth browser engine.

### Filesystem Paths
* **CLI Home Directory:** `~/openmono.ai`
* **Model Storage:** `~/openmono.ai/models/`
* **Docker Configurations:** `~/openmono.ai/docker/`
* **Global User State:** `~/.openmono/`
* **Active Transcripts:** `~/.openmono/sessions/`
* **Global Playbooks:** `~/.openmono/playbooks/`
* **Project Rules:** `<project-root>/OPENMONO.md`
* **Project Playbooks:** `<project-root>/.openmono/playbooks/`


---

<a id="doc-7-openmonoagent-complete-user-guide"></a>
<!-- ====================================================================== -->
<!-- FILE: openmonoagent-complete-user-guide.md (Sequence: 07 of 07) -->
<!-- ====================================================================== -->

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

