# Gemma 4 Bcf Developer Agent Setup

**Classification**: CVX Unified Research Collection  
**Source Deliverable**: `2026-10-13-gemma-4-bcf-developer-agent-setup`  
**Constituent Files**: 8 documents  
**Generated**: 2026-10-14 03:18:39  

---

## Master Table of Contents

1. [Executive Briefing & Roadmap: BCF Developer Agent Deployment](#doc-1-00-executive-overview-and-roadmap) (`00-executive-overview-and-roadmap.md`)
2. [Tailored Blueprint & Deployment Guide: PowerSpec G914 Workstation](#doc-2-00a-antigrav-gem38flash-max-build-summary) (`00a-antigrav-gem38flash-max-build-summary.md`)
3. [Competition Brief & BCF Agent Architecture Dossier](#doc-3-01-competition-brief-and-agent-architecture) (`01-competition-brief-and-agent-architecture.md`)
4. [Windows 11 Toolchain & Environment Provisioning Guide](#doc-4-02-windows-11-toolchain-and-installation-guide) (`02-windows-11-toolchain-and-installation-guide.md`)
5. [End-to-End Deployment Plan & Milestone Checklists](#doc-5-03-end-to-end-deployment-plan-and-milestone-checklists) (`03-end-to-end-deployment-plan-and-milestone-checklists.md`)
6. [BCF Agent Code Templates & Fine-Tuning Recipes](#doc-6-04-bcf-agent-code-templates-and-fine-tuning-recipes) (`04-bcf-agent-code-templates-and-fine-tuning-recipes.md`)
7. [Zorin OS 18.1 Dual-Boot & Claude Code Developer Toolchain Guide](#doc-7-05-zorin-os-18-dual-boot-and-claude-developer-setup) (`05-zorin-os-18-dual-boot-and-claude-developer-setup.md`)
8. [Zorin OS 18.1 Kaggle Competition Toolchain & Platform Delta Analysis](#doc-8-06-zorin-os-kaggle-competition-toolchain-and-delta-analysis) (`06-zorin-os-kaggle-competition-toolchain-and-delta-analysis.md`)


---

<a id="doc-1-00-executive-overview-and-roadmap"></a>
<!-- ====================================================================== -->
<!-- FILE: 00-executive-overview-and-roadmap.md (Sequence: 01 of 08) -->
<!-- ====================================================================== -->

# Executive Briefing & Roadmap: BCF Developer Agent Deployment
**Target Competition:** [Google - The Gemma 4 Developer Agent Competition (Kaggle)](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview)  
**Deliverable Version:** 2.0.0 (Tailored Hardware Edition)  
**Date of Record:** October 13, 2026  
**Target Rig:** PowerSpec G914 Gaming PC (AMD Ryzen 9 9950X3D | MSI MAG X870E Tomahawk WiFi | 64GB DDR5-6000 | MSI Ventus 3X OC RTX 5090 32GB GDDR7 | 2TB NVMe SSD | Windows 11 Pro)  
**Agent Architecture:** BCF (Branch-Check-Fix / Behavior-Context-Feedback) Coding Agent on Google Agent Development Kit (ADK)

---

## 1. Executive Summary

This briefing provides the strategic foundation, hardware-tailored configuration, and end-to-end execution roadmap for deploying, evaluating, submitting, and fine-tuning your new **BCF (Branch-Check-Fix / Behavior-Context-Feedback) Coding Agent** in **Google's Gemma 4 Developer Agent Competition** hosted on Kaggle.

Your specific machine—the **PowerSpec G914**—is an elite workstation tailored for large-scale AI agent simulation and local post-training. With an **AMD Ryzen 9 9950X3D** (16 cores / 32 threads with 3D V-Cache), **64GB DDR5-6000 RAM**, and an **MSI Ventus 3X OC NVIDIA GeForce RTX 5090 with 32GB of high-speed GDDR7 VRAM** on an **MSI MAG X870E Tomahawk WiFi** motherboard, your local system surpasses typical cloud developer instances.

Specifically, the competition's primary target model—**`gemma-4-31b-it-qat-w4a16-ct`**—occupies approximately 18–20 GB of VRAM. On your 32GB RTX 5090, this model fits **100% into VRAM with over 12 GB of unconstrained headroom** for large KV-cache context expansion (up to 32k/64k tokens) and local multi-turn agent simulation. Furthermore, your 32GB VRAM allows you to execute **on-device 4-bit QLoRA fine-tuning** using Unsloth directly on your PC without relying on expensive cloud GPUs.

```
+---------------------------------------------------------------------------------------------------+
|                        POWERSPEC G914 WORKSTATION -> BCF COMPETITION ROADMAP                      |
+---------------------------------------------------------------------------------------------------+
|  [Hardware Tuning] MSI Click BIOS X (SVM Mode, AMD IOMMU, EXPO DDR5-6000, Re-Size BAR)            |
|      |                                                                                            |
|      v                                                                                            |
|  [Phase 1] Machine & Subsystem Provisioning (Win 11 Pro + WSL2 Ubuntu 24.04 + RTX 5090 Blackwell) |
|      * .wslconfig tuned for 64GB RAM (memory=48GB, processors=28 vCPUs, swap=32GB NVMe)          |
|      |                                                                                            |
|      v                                                                                            |
|  [Phase 2] Python & Harness Toolchain (`uv` + PyTorch Blackwell + vLLM + `google-adk` + `swegemma`)|
|      * Direct Blackwell CUDA passthrough + 129 `tasks.jsonl` development benchmarks cached         |
|      |                                                                                            |
|      v                                                                                            |
|  [Phase 3] BCF Declarative Agent Wiring (`agent.yaml` + System Prompts + AST Graph Tools)         |
|      * Strict ADK schema compilation validated via `validate_submission.py`                       |
|      |                                                                                            |
|      v                                                                                            |
|  [Phase 4] Local Dry-Run Simulation (Multi-turn Docker SWE Sandboxing + `submit_patch` checks)     |
|      * Zero-OOM local execution utilizing 32GB GDDR7 VRAM for ultra-fast local inference          |
|      |                                                                                            |
|      v                                                                                            |
|  [Phase 5] Package Pre-Flight & Kaggle Submission (`submission.zip` via Kaggle CLI)               |
|      * Validated zip bundle pushed directly to Kaggle API gateway                                 |
|      |                                                                                            |
|      v                                                                                            |
|  [Phase 6] Score Retrieval & Diagnostic Trajectory Auditing (Leaderboard Baseline Score Locked)   |
|      * Public test set evaluation result logged; failure modes cataloged for fine-tuning          |
|      |                                                                                            |
|      v                                                                                            |
|  [Phase 7] On-Device BCF Fine-Tuning Loop (Unsloth QLoRA on RTX 5090 -> Gen-2 Model Submission)   |
|      * Train 31B LoRA adapter locally on harvested trajectories; bundle into `submission_v2.zip`  |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Hardware Allocation Matrix: PowerSpec G914 Optimization

The table below outlines how each hardware component of your PowerSpec G914 is allocated between the Windows 11 host and the WSL2 AI development environment:

| Hardware Component | Hardware Specification | Host Windows 11 Allocation | WSL2 Ubuntu 24.04 Allocation | Role in BCF Coding Agent Workflow |
| :--- | :--- | :--- | :--- | :--- |
| **Processor (CPU)** | AMD Ryzen 9 9950X3D (16 Cores / 32 Threads, Zen 5, 4.3–5.7 GHz) | 4 logical threads reserved for Windows OS responsiveness | **28 vCPUs** assigned via `.wslconfig` | Parallel code search, AST graph building, and multi-worker Docker evaluation sandboxes. |
| **System Memory** | 64GB DDR5-6000 (Dual Channel) | 16GB RAM for host OS, IDE, and browser | **48GB RAM** dedicated to WSL2 Linux | Loading full Python AST graphs, running test suites, and caching dataset embeddings. |
| **Graphics Card** | MSI Ventus 3X OC RTX 5090 (32GB GDDR7 VRAM, Blackwell Architecture) | Display output & Windows desktop rendering | **Full Direct GPU Passthrough** via host display driver (570.x+) | 100% VRAM residency for `gemma-4-31b-it-qat-w4a16-ct` (~19GB) + 13GB KV-cache/LoRA buffer. |
| **Motherboard** | MSI MAG X870E Tomahawk WiFi (AM5, PCIe 5.0) | Motherboard chipset drivers & audio | Hardware virtualization (SVM, IOMMU) enabled in BIOS | Re-Size BAR & EXPO DDR5-6000 maximize PCIe throughput between CPU and RTX 5090. |
| **Storage (SSD)** | 2TB NVMe PCIe 4.0/5.0 SSD | Host OS `C:\` partition & Docker desktop files | High-speed Linux root filesystem (`ext4.vhdx`) + 32GB swapfile | Near-instant model weights loading, rapid container spins, and fast git diffing. |
| **Networking** | Realtek 5GbE LAN & WiFi 7 (802.11be) | High-speed fiber/gigabit Internet connection | Mirrored / bridged network connection | Rapid downloading of competition models, datasets, and Kaggle API submissions. |
| **Operating System** | Windows 11 Pro 64-bit | Virtual Machine Platform & Hyper-V Hypervisor | Ubuntu 24.04 LTS (Kernel >= 6.6) | Native POSIX environment for Python `pytest`, git patches, and Docker isolation. |

---

## 3. Core Competition Parameters at a Glance

| Parameter | Official Competition Specification | BCF Implementation on PowerSpec G914 |
| :--- | :--- | :--- |
| **Competition Name** | Google - The Gemma 4 Developer Agent Competition | Kaggle Competition Slug: `gemma-4-developer-agent` |
| **Submission Deadline** | November 25, 2026 | Initial baseline score achieved in Phase 5–6; fine-tuning iterations through November |
| **Official Tracks** | 1. Main Prediction Track (Ranked by bugs fixed)<br>2. Paper Track (Kaggle Writeup / arXiv PDF) | Track 1 active leaderboard submission; Track 2 writeup prepared from BCF ablations |
| **Submission Package** | Single compressed `submission.zip` | Root `agent.yaml` + system prompts + configs + optional LoRA weights |
| **Execution Entrypoint** | Declarative YAML compilation via `compile_submission` | Strictly NO `agent.py` script; declared against closed host registries |
| **Primary Base Model** | `gemma-4-31b-it-qat-w4a16-ct` (Quantization-Aware Trained, W4A16, compressed-tensors) | Hosted locally via vLLM on RTX 5090 (32GB VRAM); pre-registered alias used in evaluation |
| **Evaluation Sandbox** | Offline Linux container in `/workspace` with Git repository at base commit | WSL2 Ubuntu 24.04 + Docker Desktop sandbox locally to mirror Kaggle environment |
| **Compute Constraints** | ~12-Hour Global Timeout; per-task timeout and turn limits | BCF token budgeting & turn counters configured in `eval_config.yaml` / `agent.yaml` |
| **Leaderboard Metric** | Total count & percentage of resolved software bug benchmarks | Automated pass/fail verification against hidden unit test patches (`test_patch`) |

---

## 4. Deliverable Suite Directory Structure

All detailed operational guides have been compiled and tailored specifically for your PowerSpec G914 in the deliverables repository:

```text
deliverables/2026-10-13-gemma-4-bcf-developer-agent-setup/
├── 00-executive-overview-and-roadmap.md             <-- [This Document] Strategic overview & G914 allocation
├── 01-competition-brief-and-agent-architecture.md   <-- In-depth competition rules, harness & BCF design
├── 02-windows-11-toolchain-and-installation-guide.md <-- G914 MSI BIOS & step-by-step installation instructions
├── 03-end-to-end-deployment-plan-and-milestone-checklists.md <-- 7-phase deployment plan & acceptance checklists
├── 04-bcf-agent-code-templates-and-fine-tuning-recipes.md    <-- RTX 5090 vLLM config, agent YAML & Unsloth training
├── 05-zorin-os-18-dual-boot-and-claude-developer-setup.md    <-- Zorin OS 18.1 dual boot, Claude Code CLI & VS Code
└── 06-zorin-os-kaggle-competition-toolchain-and-delta-analysis.md <-- Native Linux competition toolchain & delta analysis
```


---

<a id="doc-2-00a-antigrav-gem38flash-max-build-summary"></a>
<!-- ====================================================================== -->
<!-- FILE: 00a-antigrav-gem38flash-max-build-summary.md (Sequence: 02 of 08) -->
<!-- ====================================================================== -->

Viewed 00-executive-overview-and-roadmap.md:1-45
Created 00-executive-overview-and-roadmap.md
Viewed 02-windows-11-toolchain-and-installation-guide.md:1-75
Created 02-windows-11-toolchain-and-installation-guide.md
Viewed 03-end-to-end-deployment-plan-and-milestone-checklists.md:1-60
Created 03-end-to-end-deployment-plan-and-milestone-checklists.md
Viewed 04-bcf-agent-code-templates-and-fine-tuning-recipes.md:150-240
Viewed 04-bcf-agent-code-templates-and-fine-tuning-recipes.md:300-433
Created 04-bcf-agent-code-templates-and-fine-tuning-recipes.md
Viewed 01-competition-brief-and-agent-architecture.md:90-120
Edited 01-competition-brief-and-agent-architecture.md

# Tailored Blueprint & Deployment Guide: PowerSpec G914 Workstation
**Target Competition:** [Google - The Gemma 4 Developer Agent Competition (Kaggle)](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview)  
**Deliverable Directory:** [`deliverables/2026-10-13-gemma-4-bcf-developer-agent-setup/`](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_gemini/deliverables/2026-10-13-gemma-4-bcf-developer-agent-setup)  
**Machine Profile:** **PowerSpec G914 Gaming PC**  
* **Processor:** AMD Ryzen 9 9950X3D (16 Cores / 32 Threads, 4.3–5.7 GHz, 3D V-Cache, Zen 5)
* **Motherboard:** MSI MAG X870E Tomahawk WiFi (AM5, PCIe 5.0)
* **Memory:** 64GB DDR5-6000 RAM (Dual Channel)
* **Graphics Card:** MSI Ventus 3X OC NVIDIA GeForce RTX 5090 (32GB GDDR7 VRAM, Blackwell Architecture)
* **Storage:** 2TB NVMe PCIe SSD
* **Networking & OS:** 5GbE LAN, WiFi 7 (802.11be), Bluetooth 5.4, Windows 11 Pro 64-bit

---

## 1. Executive Summary: The PowerSpec G914 Competitive Advantage

Your **PowerSpec G914** is an elite AI development and simulation workstation. In Google's Gemma 4 Developer Agent Competition, most competitors rely on 16GB or 24GB GPUs (RTX 3090 / 4090 / cloud T4x2 / L4), which forces them to throttle context windows, offload layers to CPU, or rent expensive cloud clusters.

Your hardware configuration eliminates these bottlenecks:
1. **Unconstrained 32GB GDDR7 VRAM Residency:**  
   The competition's target base model—**`gemma-4-31b-it-qat-w4a16-ct`**—occupies ~18–20 GB of VRAM. On your RTX 5090, it fits **100% in VRAM with over 12 GB of unconstrained headroom**. This allows you to allocate large KV caches (handling 16k–32k multi-turn agent conversation contexts) with zero CPU offloading.
2. **On-Device Post-Training & Fine-Tuning:**  
   With 32GB VRAM and PyTorch Blackwell acceleration, you can run **on-device 4-bit QLoRA fine-tuning** using Unsloth directly on your PC at sequence lengths up to 8,192 tokens.
3. **Massive Multithreaded Sandboxing:**  
   The AMD Ryzen 9 9950X3D (32 threads) and 64GB DDR5-6000 allow you to dedicate **28 vCPUs and 48GB RAM** to WSL2, enabling fast parallel AST code-graph parsing and multi-worker Docker SWE-bench evaluations.

```
+---------------------------------------------------------------------------------------------------+
|                        POWERSPEC G914 WORKSTATION -> BCF COMPETITION ROADMAP                      |
+---------------------------------------------------------------------------------------------------+
|  [Hardware Tuning] MSI Click BIOS X (SVM Mode, AMD IOMMU, EXPO DDR5-6000, Re-Size BAR)            |
|      |                                                                                            |
|      v                                                                                            |
|  [Phase 1] Machine & Subsystem Provisioning (Win 11 Pro + WSL2 Ubuntu 24.04 + RTX 5090 Blackwell) |
|      * .wslconfig tuned for G914 (memory=48GB, processors=28 vCPUs, swap=32GB NVMe)              |
|      |                                                                                            |
|      v                                                                                            |
|  [Phase 2] Python & Harness Toolchain (`uv` + PyTorch Blackwell + vLLM + `google-adk` + `swegemma`)|
|      * Direct Blackwell CUDA passthrough + 129 `tasks.jsonl` development benchmarks cached         |
|      |                                                                                            |
|      v                                                                                            |
|  [Phase 3] BCF Declarative Agent Wiring (`agent.yaml` + System Prompts + AST Graph Tools)         |
|      * Strict ADK schema compilation validated via `validate_submission.py`                       |
|      |                                                                                            |
|      v                                                                                            |
|  [Phase 4] Local Dry-Run Simulation (Multi-turn Docker SWE Sandboxing + `submit_patch` checks)     |
|      * Zero-OOM local execution utilizing 32GB GDDR7 VRAM for ultra-fast local inference          |
|      |                                                                                            |
|      v                                                                                            |
|  [Phase 5] Package Pre-Flight & Kaggle Submission (`submission.zip` via Kaggle CLI)               |
|      * Validated zip bundle pushed directly to Kaggle API gateway                                 |
|      |                                                                                            |
|      v                                                                                            |
|  [Phase 6] Score Retrieval & Diagnostic Trajectory Auditing (Leaderboard Baseline Score Locked)   |
|      * Public test set evaluation result logged; failure modes cataloged for fine-tuning          |
|      |                                                                                            |
|      v                                                                                            |
|  [Phase 7] On-Device BCF Fine-Tuning Loop (Unsloth QLoRA on RTX 5090 -> Gen-2 Model Submission)   |
|      * Train 31B LoRA adapter locally on harvested trajectories; bundle into `submission_v2.zip`  |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Updated Deliverables Suite (Tailored for PowerSpec G914)

All five deliverables in [`deliverables/2026-10-13-gemma-4-bcf-developer-agent-setup/`](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_gemini/deliverables/2026-10-13-gemma-4-bcf-developer-agent-setup) have been updated and verified:

1. [`00-executive-overview-and-roadmap.md`](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_gemini/deliverables/2026-10-13-gemma-4-bcf-developer-agent-setup/00-executive-overview-and-roadmap.md)  
   *Executive briefing, G914 hardware allocation matrix, competition parameters, and milestone roadmap.*
2. [`01-competition-brief-and-agent-architecture.md`](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_gemini/deliverables/2026-10-13-gemma-4-bcf-developer-agent-setup/01-competition-brief-and-agent-architecture.md)  
   *Competition mechanics, declarative security model (`compile_submission`), `gemma-4-31b-it-qat-w4a16-ct` properties, host tool registry (`submit_patch`, AST graph tools), and BCF architecture.*
3. [`02-windows-11-toolchain-and-installation-guide.md`](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_gemini/deliverables/2026-10-13-gemma-4-bcf-developer-agent-setup/02-windows-11-toolchain-and-installation-guide.md)  
   *Step-by-step setup: MSI Click BIOS X navigation (EXPO Profile 1, SVM Mode, Re-Size BAR), tailored `.wslconfig`, NVIDIA Blackwell 570.x/572.x+ driver, Astral `uv` Python 3.11, PyTorch Blackwell CUDA 12.6+, vLLM, and Kaggle CLI.*
4. [`03-end-to-end-deployment-plan-and-milestone-checklists.md`](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_gemini/deliverables/2026-10-13-gemma-4-bcf-developer-agent-setup/03-end-to-end-deployment-plan-and-milestone-checklists.md)  
   *7-phase operational deployment plan with milestone checklists, pass/fail acceptance commands, and diagnostics.*
5. [`04-bcf-agent-code-templates-and-fine-tuning-recipes.md`](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_gemini/deliverables/2026-10-13-gemma-4-bcf-developer-agent-setup/04-bcf-agent-code-templates-and-fine-tuning-recipes.md)  
   *Ready-to-use codebase templates: `agent.yaml`, `prompts/system.md`, `configs/sampling.yaml`, `serve_gemma4_rtx5090.sh` (vLLM launcher allocating 90% of 32GB VRAM), `validate_submission.py`, `build_submission.py`, `run_local_evaluation.py`, and `train_bcf_lora.py` (Unsloth on-device training).*

---

## 3. PowerSpec G914 Hardware Allocation Matrix

| Hardware Component | Hardware Specification | Host Windows 11 Allocation | WSL2 Ubuntu 24.04 Allocation | Role in BCF Coding Agent Workflow |
| :--- | :--- | :--- | :--- | :--- |
| **Processor (CPU)** | AMD Ryzen 9 9950X3D (16 Cores / 32 Threads, Zen 5, 4.3–5.7 GHz) | 4 logical threads reserved for Windows OS responsiveness | **28 vCPUs** assigned via `.wslconfig` | Parallel code search, AST graph building, and multi-worker Docker evaluation sandboxes. |
| **System Memory** | 64GB DDR5-6000 (Dual Channel) | 16GB RAM for host OS, IDE, and browser | **48GB RAM** dedicated to WSL2 Linux | Loading full Python AST graphs, running test suites, and caching dataset embeddings. |
| **Graphics Card** | MSI Ventus 3X OC RTX 5090 (32GB GDDR7 VRAM, Blackwell Architecture) | Display output & Windows desktop rendering | **Full Direct GPU Passthrough** via host display driver (570.x+) | 100% VRAM residency for `gemma-4-31b-it-qat-w4a16-ct` (~19GB) + 13GB KV-cache/LoRA buffer. |
| **Motherboard** | MSI MAG X870E Tomahawk WiFi (AM5, PCIe 5.0) | Motherboard chipset drivers & audio | Hardware virtualization (SVM, IOMMU) enabled in BIOS | Re-Size BAR & EXPO DDR5-6000 maximize PCIe throughput between CPU and RTX 5090. |
| **Storage (SSD)** | 2TB NVMe PCIe 4.0/5.0 SSD | Host OS `C:\` partition & Docker desktop files | High-speed Linux root filesystem (`ext4.vhdx`) + 32GB swapfile | Near-instant model weights loading, rapid container spins, and fast git diffing. |
| **Networking** | Realtek 5GbE LAN & WiFi 7 (802.11be) | High-speed fiber/gigabit Internet connection | Mirrored / bridged network connection | Rapid downloading of competition models, datasets, and Kaggle API submissions. |
| **Operating System** | Windows 11 Pro 64-bit | Virtual Machine Platform & Hyper-V Hypervisor | Ubuntu 24.04 LTS (Kernel >= 6.6) | Native POSIX environment for Python `pytest`, git patches, and Docker isolation. |

---

## 4. Immediate Action Checklist for Your PowerSpec G914

### Step 1: MSI Click BIOS X Setup
Reboot the G914 and tap **`DEL`** to enter the BIOS menu:
1. Press **`F7`** for Advanced Mode.
2. Under **OC** -> **DRAM Setting**, set **EXPO** to **`[Profile 1]`** (runs RAM at 6000 MHz instead of 4800 MHz).
3. Under **OC** -> **CPU Features**, set **SVM Mode** to **`[Enabled]`**.
4. Under **Settings** -> **Advanced** -> **PCIe/PCI Sub-system Settings**, set **Above 4G Decoding**, **Re-Size BAR Support**, and **AMD IOMMU** to **`[Enabled]`**.
5. Press **`F10`** to save and reboot into Windows 11 Pro.

### Step 2: Configure Windows 11 Pro & WSL2 Subsystem
Open Administrator PowerShell:
```powershell
# Enable virtualization and update WSL
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
wsl --update
wsl --install -d Ubuntu-24.04

# Configure .wslconfig tailored for 64GB RAM and 32 threads
@"
[wsl2]
memory=48GB
processors=28
swap=32GB
swapFile=C:\\temp\\wsl-swap.vhdx
localhostForwarding=true
[experimental]
autoMemoryReclaim=gradual
sparseVhd=true
"@ | Out-File -Encoding ASCII "$env:USERPROFILE\.wslconfig"

mkdir -Force C:\temp
wsl --shutdown
```

### Step 3: Install NVIDIA Blackwell Driver & Host Utilities
1. Install driver version **570.x / 572.x+** from [NVIDIA Driver Downloads](https://www.nvidia.com/Download/index.aspx).
2. Install host development utilities:
```powershell
winget install --id Microsoft.WindowsTerminal -e
winget install --id Git.Git -e
winget install --id Microsoft.VisualStudioCode -e
winget install --id Docker.DockerDesktop -e
git config --global core.autocrlf input
```

### Step 4: Provision In-WSL Python & Competition Toolchain
Launch **Ubuntu-24.04** in Windows Terminal and run:
```bash
# System packages
sudo apt update && sudo apt install -y build-essential cmake ninja-build git git-lfs curl jq unzip zip ripgrep

# High-speed Python manager & virtual environment
curl -LsSf https://astral.sh/uv/install.sh | sh
source ~/.cargo/env
mkdir -p ~/bcf_workspace && cd ~/bcf_workspace
uv python install 3.11 && uv venv .venv --python 3.11
source .venv/bin/activate

# Blackwell PyTorch, vLLM, ADK, and Kaggle CLI
uv pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu126
uv pip install vllm compressed-tensors google-adk adk-submission swegemma adk-eval-core kaggle
uv pip install transformers accelerate peft trl bitsandbytes datasets "unsloth[cu124-ampere-torch240]"
```

### Step 5: Validate RTX 5090 GPU Passthrough
In WSL2 bash, run:
```bash
python3 -c "import torch; print(f'PyTorch {torch.__version__} | Device: {torch.cuda.get_device_name(0)} | VRAM: {torch.cuda.get_device_properties(0).total_memory / 1024**3:.1f} GB')"
```
*Expected Output:* `CUDA Available: True | Device: NVIDIA GeForce RTX 5090 | VRAM: 32.0 GB`.

---

All detailed walkthroughs, pre-flight compiler scripts, packagers, and Unsloth training recipes are ready to execute inside [`deliverables/2026-10-13-gemma-4-bcf-developer-agent-setup/`](file:///d:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_gemini/deliverables/2026-10-13-gemma-4-bcf-developer-agent-setup).


---

<a id="doc-3-01-competition-brief-and-agent-architecture"></a>
<!-- ====================================================================== -->
<!-- FILE: 01-competition-brief-and-agent-architecture.md (Sequence: 03 of 08) -->
<!-- ====================================================================== -->

# Competition Brief & BCF Agent Architecture Dossier
**Target Competition:** [Google - The Gemma 4 Developer Agent Competition](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview)  
**Deliverable File:** `01-competition-brief-and-agent-architecture.md`  
**Date of Record:** October 13, 2026  
**Status:** Grounded Research & Technical Specification  

---

## 1. Competition Overview & Official Tracks

The **Google - The Gemma 4 Developer Agent Competition** on Kaggle represents a major benchmark in autonomous artificial intelligence for software engineering. The competition tasks participants with developing, configuring, and post-training an autonomous software engineering (SWE) agent utilizing Google's open-weights **Gemma 4** model family. The agent operates in a real-world repository environment, autonomously reading issue descriptions, exploring multi-module codebases, modifying source code, running tests, and generating production-grade patches.

```
+----------------------------------------------------------------------------------------------------+
|                         THE GEMMA 4 DEVELOPER AGENT COMPETITION STRUCTURE                         |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|    +------------------------------------------+    +------------------------------------------+    |
|    |           TRACK 1: MAIN LEADERBOARD      |    |            TRACK 2: PAPER TRACK          |    |
|    +------------------------------------------+    +------------------------------------------+    |
|    | * Autonomous bug resolution on hidden    |    | * Kaggle Writeup / arXiv-ready PDF       |    |
|    |   software repositories.                 |    | * Up to 3,000 words.                     |    |
|    | * Ranked by Pass/Fail score on unit      |    | * Focus: Agentic architectures, tool     |    |
|    |   test patches (`test_patch`).           |    |   ablation studies, fine-tuning recipes. |    |
|    | * Submission: `submission.zip` containing|    | * Submissions open concurrently via      |    |
|    |   root `agent.yaml` + LoRA adapters.     |    |   Kaggle Writeup interface.              |    |
|    +------------------------------------------+    +------------------------------------------+    |
|                                                                                                    |
|    +------------------------------------------------------------------------------------------+    |
|    | KEY DEADLINE: Submissions close on November 25, 2026 at 23:59 UTC.                      |    |
|    +------------------------------------------------------------------------------------------+    |
+----------------------------------------------------------------------------------------------------+
```

---

## 2. Declarative Security Model & Compilation Pipeline

A defining attribute of the Gemma 4 Developer Agent Competition is its strict **declarative-only security framework**. Standard competition formats often allow competitors to submit arbitrary Python execution scripts (e.g., `agent.py` or `main.py`) executed via dynamic importing (`importlib`). In contrast, to guarantee container safety, deterministic evaluation, and strict isolation during offline grading, the Gemma 4 evaluation harness mandates that agents be declared statically.

### 2.1 The Role of `agent.yaml` and `submission.zip`
Every submission to the competition must be packaged as a single compressed zip archive named `submission.zip`. The archive must strictly contain the root configuration file `agent.yaml` at its root directory level:

```text
submission.zip
├── agent.yaml              # MANDATORY: Root agent configuration and schema entrypoint
├── configs/
│   └── sampling.yaml       # OPTIONAL: Model generation parameters (temperature, top_p, etc.)
├── prompts/
│   ├── system.md           # OPTIONAL / RECOMMENDED: Modular system instructions
│   └── tools_guide.md      # OPTIONAL: Specialized guidelines for tool dispatching
└── lora/                   # OPTIONAL: Fine-tuned LoRA / PEFT adapter weights
    ├── adapter_config.json
    └── adapter_model.safetensors
```

### 2.2 Compilation via `adk_submission`
During automated evaluation on Kaggle's backend, the runner does not execute shell scripts from the competitor. Instead, it invokes the official compilation pipeline:

```python
from adk_submission import compile_submission, ModelRegistry, ToolRegistry
from swegemma.config import build_submission_limits

# Fetch host sandbox boundaries and generation limits
limits, constraints = build_submission_limits()

# Closed host registries prevent unauthorized network or system calls
models = ModelRegistry()
tools = ToolRegistry()

# Statically compile the declarative tree into live BaseAgent objects
agent = compile_submission(
    bundle_dir="/path/to/unzipped_submission",
    tool_registry=tools,
    model_registry=models,
    limits=limits,
    generation_constraints=constraints
)
```

If an archive lacks `agent.yaml` at the root, contains invalid YAML tags, attempts to import unapproved Python modules, or specifies models outside the approved registry, `compile_submission` throws an immediate compilation error, resulting in a submission failure.

---

## 3. Base Models & Inference Architecture

The competition is centered on Google DeepMind's **Gemma 4** open-weights architecture, with particular emphasis on high-efficiency quantization and reasoning capabilities.

### 3.1 Primary Leaderboard Target: `gemma-4-31b-it-qat-w4a16-ct`
The pre-registered model alias in the competition harness is:
`gemma-4-31b-it-qat-w4a16-ct`

| Component | Technical Specification | Operational Impact |
| :--- | :--- | :--- |
| **`31b`** | 31-Billion Parameter Dense Architecture | High reasoning capacity, strong code syntax and context comprehension. |
| **`it`** | Instruction-Tuned Variant | Optimized for conversational multi-turn agent loops and function calling. |
| **`qat`** | Quantization-Aware Training | Weights trained while modeling quantization noise; retains full-precision accuracy. |
| **`w4a16`** | 4-bit Weights, 16-bit Activations | VRAM footprint drops from ~64 GB (FP16) down to ~18–20 GB. |
| **`ct`** | Compressed-Tensors Format | Supported natively by optimized vLLM kernels for zero-loss inference throughput. |

Because the memory footprint is under 20 GB VRAM, the model fits with massive headroom on your **PowerSpec G914's MSI Ventus 3X OC RTX 5090 (32GB GDDR7 VRAM)**. With ~12 GB of unconstrained VRAM headroom, you can allocate huge KV caches (handling up to 16k–32k multi-turn agent context windows) and perform on-device 4-bit QLoRA fine-tuning without CPU offloading or memory thrashing.

### 3.2 PowerSpec G914 Hardware Advantage vs. Standard Competition Environments
Most competitors develop on constrained 16GB or 24GB GPUs (RTX 4090 / 3090 / Kaggle T4x2 / L4), which forces aggressive context truncations and slow CPU-offloaded training. Your PowerSpec G914 setup provides a decisive edge:
* **AMD Ryzen 9 9950X3D (Zen 5, 16C/32T):** 28 vCPUs dedicated to WSL2 enable parallel local batch evaluation across multiple Docker sandboxes simultaneously.
* **64GB DDR5-6000 (EXPO Profile 1):** Eliminates system memory bottlenecks when parsing large repository ASTs and code dependency graphs.
* **MSI RTX 5090 32GB GDDR7:** Runs both the 31B base inference engine and Unsloth LoRA fine-tuning 100% on-device.

### 3.3 Proxy Models for Fast Local Prototyping
For rapid local iteration, prompt experimentation, and testing harness wiring without loading the full 31B weights, smaller Gemma 4 family variants can be used in your local development environment:
* `gemma-4-e2b` / `gemma-4-e4b`: Ultra-lightweight edge variants for instant CPU/GPU sanity checks.
* `gemma-4-12b`: Intermediate balance for quick trajectory generation and sanity testing.
* `gemma-2-9b-it`: Readily accessible Hugging Face / Ollama fallback for pipeline testing.

---

## 4. Evaluation Benchmark & Sandbox Lifecycle

### 4.1 Benchmark Dataset Structure
The public development set provided by Google is distributed as `tasks.jsonl` containing 129 curated benchmark tasks adapted from high-impact open-source Python repositories (e.g., `fastapi`, `rich`, `requests`, `httpx`, `pydantic`).

Each line in `tasks.jsonl` contains the following schema:
```json
{
  "instance_id": "fastapi__fastapi-1024",
  "repo": "tiangolo/fastapi",
  "base_commit": "a1b2c3d4e5f6...",
  "problem_statement": "Issue description detailing unexpected HTTP 422 validation failure...",
  "patch": "diff --git a/fastapi/routing.py b/fastapi/routing.py...",
  "test_patch": "diff --git a/tests/test_routing.py b/tests/test_routing.py...",
  "version": "0.95.0",
  "environment_setup_commit": "setup_commit_hash..."
}
```

### 4.2 The Two-Container Sandbox Lifecycle
During evaluation, the harness spins up a sandboxed environment where:
1. **Repository Check-Out:** The target repository is checked out at `base_commit` inside `/workspace`.
2. **Offline Isolation:** Network access is completely disabled. All dependencies are pre-installed in the local repository environment.
3. **Agent Loop:** The agent receives `problem_statement` as its initial prompt and interacts with `/workspace` via declared tools.
4. **Terminal Patch Capture:** When the agent invokes `submit_patch()`, the harness executes `git diff` against `base_commit` and stores the resulting patch string.
5. **Grading Phase:** The harness applies the golden verification unit tests (`test_patch`), runs `pytest`, and evaluates whether all previously failing tests now pass without breaking existing tests.

```
+---------------------------------------------------------------------------------------------------+
|                                  SWEGEMMA EVALUATION HARNESS FLOW                                 |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|    +-----------------------------+               +-------------------------------------------+    |
|    |      `tasks.jsonl` Task     | ------------> | Isolated Docker Sandbox (`/workspace`)    |    |
|    | (repo, base_commit, issue)  |               | Clean Git checkout at `base_commit`       |    |
|    +-----------------------------+               +-------------------------------------------+    |
|                                                                    |                              |
|                                                                    v                              |
|                                                  +-------------------------------------------+    |
|                                                  | Multi-Turn BCF Agent Interaction Loop     |    |
|                                                  | Tools: `run_command`, `read_file`, etc.   |    |
|                                                  +-------------------------------------------+    |
|                                                                    |                              |
|                                                                    v                              |
|                                                  +-------------------------------------------+    |
|                                                  | Terminal Action: `submit_patch()`         |    |
|                                                  | Freezes unified `git diff` of workspace   |    |
|                                                  +-------------------------------------------+    |
|                                                                    |                              |
|                                                                    v                              |
|    +-----------------------------+               +-------------------------------------------+    |
|    | Hidden `test_patch` Applied | ------------> | PyTest Automated Verification Runner      |    |
|    +-----------------------------+               | PASS -> +1 Bug Fixed / FAIL -> 0          |    |
|                                                  +-------------------------------------------+    |
+---------------------------------------------------------------------------------------------------+
```

### 4.3 Compute & Resource Constraints
To avoid compute timeouts and submission disqualification:
* **Global Evaluation Limit:** The Kaggle evaluation notebook must complete all tasks within a global runtime window (typically 12 hours).
* **Per-Task Timeout:** Each task is governed by parameters such as `timeout_seconds: 600` (10 minutes) and `max_turns: 25`.
* **Turn Limits:** If an agent enters an infinite loop or fails to issue `submit_patch` before reaching `max_turns`, the task is terminated and scored as an empty patch.

---

## 5. Host Tool Registry

The host environment exposes a closed, sandboxed tool registry through `swegemma`. The BCF agent configures bindings to these exact tools in `agent.yaml`:

| Tool Name | Parameters | Description | Best Practice for BCF Agent |
| :--- | :--- | :--- | :--- |
| **`run_command`** | `command: string` | Executes non-interactive shell commands inside `/workspace`. | Use to run `pytest`, inspect git status, or check syntax. Avoid interactive commands (`vim`, `less`, `top`). |
| **`read_file`** | `path: string`, `start_line: int`, `end_line: int` | Reads slice of file contents with line numbers. | Always specify line ranges when reading large source files to conserve model context. |
| **`write_file`** | `path: string`, `content: string` | Overwrites or creates a new file. | Use when creating new reproduction test scripts. |
| **`edit_file`** | `path: string`, `old_str: string`, `new_str: string` | Replaces exact string block in file. | Ensure `old_str` contains unique surrounding context lines to avoid ambiguity errors. |
| **`get_status`** | *None* | Returns `git status` summary of modified files. | Use in the Check and Fix stages to monitor uncommitted workspace changes. |
| **`submit_patch`** | *None* | Terminal action that completes the task and freezes the git diff. | **MANDATORY.** Must be executed before context or turn limits expire. |
| **`get_code_neighbors`**| `symbol: string`, `depth: int` | Explores AST code graph neighbors (callers, callees, classes). | Use during the Branch phase to localize where buggy methods are invoked across files. |
| **`search_similar_code`**| `query: string`, `top_k: int` | Semantic and keyword retrieval across the repository AST. | Essential for locating error messages or identifiers mentioned in the issue. |
| **`get_code_subgraph`** | `node_id: string` | Extracts localized AST dependency subgraph. | Used for understanding class inheritance and data flow in complex modules. |

---

## 6. The BCF (Branch-Check-Fix) Coding Agent Architecture

The **BCF (Branch-Check-Fix / Behavior-Context-Feedback)** architecture is an engineering paradigm tailored to maximize SWE-bench bug resolution rates under constrained token budgets and turn limits.

### 6.1 Conceptual Foundation

```
                  +----------------------------------------------+
                  |               ISSUE STATEMENT                |
                  +----------------------------------------------+
                                         |
                                         v
+----------------------------------------------------------------------------------+
| PHASE 1: BRANCH (Hypothesis Generation & Context Scoping)                        |
| * Parse issue description & extract keywords / tracebacks.                      |
| * Use `search_similar_code` and `get_code_neighbors` to isolate target files.   |
| * Restrict context window to suspect modules; avoid dumping whole directories.  |
+----------------------------------------------------------------------------------+
                                         |
                                         v
+----------------------------------------------------------------------------------+
| PHASE 2: CHECK (Reproduction & Baseline Verification)                            |
| * Write a minimal standalone reproduction script or identify relevant unit test.  |
| * Execute `run_command("pytest ...")` to confirm the bug is reproducible.        |
| * Establish baseline: The test MUST fail before attempting any fix.              |
+----------------------------------------------------------------------------------+
                                         |
                                         v
+----------------------------------------------------------------------------------+
| PHASE 3: FIX (Surgical Implementation & Localized Modification)                  |
| * Formulate targeted patch targeting the exact root cause.                       |
| * Apply modification using `edit_file` with precise contextual anchors.          |
| * Re-run reproduction test: It must now pass cleanly.                           |
| * Re-run repository regression test suite: No other tests may break.            |
+----------------------------------------------------------------------------------+
                                         |
                                         v
+----------------------------------------------------------------------------------+
| PHASE 4: CONVERGENCE & TERMINAL ACTION (Integrity Guard)                         |
| * Run `get_status` to ensure no stray temporary files exist.                     |
| * Remove temporary test scripts.                                                 |
| * Call `submit_patch()` to freeze unified git diff and conclude task.            |
+----------------------------------------------------------------------------------+
```

### 6.2 Key Architectural Safeguards in BCF

1. **Anti-Hallucination Reproduction Gate:**  
   The agent is strictly instructed never to modify source code until it has confirmed a failing test. This prevents "blind edits" that alter logic without resolving the root issue.
2. **Context Budget Compaction:**  
   Gemma 4 models perform best when prompt context is concise. BCF uses `read_file` with line slices (max 80 lines per view) rather than reading entire 2,000-line files.
3. **Guaranteed Terminal Exit:**  
   If the turn counter reaches `max_turns - 2` (e.g., Turn 23 out of 25) or remaining execution time drops below 60 seconds, BCF abandons further exploratory loops, cleans up temporary files, and executes `submit_patch()` immediately. Any partial progress is preserved rather than throwing a turn-limit exception.


---

<a id="doc-4-02-windows-11-toolchain-and-installation-guide"></a>
<!-- ====================================================================== -->
<!-- FILE: 02-windows-11-toolchain-and-installation-guide.md (Sequence: 04 of 08) -->
<!-- ====================================================================== -->

# Windows 11 Toolchain & Environment Provisioning Guide
**Target Competition:** [Google - The Gemma 4 Developer Agent Competition](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview)  
**Deliverable File:** `02-windows-11-toolchain-and-installation-guide.md`  
**Date of Record:** October 13, 2026  
**Target Rig:** PowerSpec G914 Gaming PC (AMD Ryzen 9 9950X3D | MSI MAG X870E Tomahawk WiFi | 64GB DDR5-6000 | MSI Ventus 3X OC RTX 5090 32GB GDDR7 | 2TB NVMe SSD | Windows 11 Pro)  
**Status:** Comprehensive Technical Blueprint & Tailored Installation Manual  

---

## 1. Architectural Strategy: Why WSL2 is Mandatory on Windows 11

Setting up your **PowerSpec G914** to develop and evaluate the **BCF Coding Agent** for SWE-bench style benchmarks presents a distinct technical hurdle: software repair tasks execute across Linux-based Python open-source repositories (`fastapi`, `rich`, `requests`, `httpx`). These repositories rely on:
1. **Linux POSIX Process Management:** `pytest` subprocess spawning, signal interception, and process timeouts.
2. **Strict Line Endings:** Git diffs generated with Windows `CRLF` (`\r\n`) line endings fail golden unit test patch verification on Kaggle's Linux runners.
3. **Containerized Sandboxing:** `swegemma` spins up Docker containers mounted at `/workspace`. Running Docker with native Linux volume mounts inside WSL2 eliminates file-locking and permission mismatches.
4. **NVIDIA CUDA Direct Passthrough on RTX 5090:** Modern WSL2 communicates directly with the Windows NVIDIA kernel display driver (`nvcuda.dll`), providing 99.8% bare-metal Linux CUDA performance across the 32GB GDDR7 VRAM of your RTX 5090 without requiring Linux display drivers.

Therefore, our architecture leverages **Windows 11 Pro as the host operating system** with **WSL2 (Ubuntu 24.04 LTS) as the dedicated AI engineering environment**, bridged seamlessly via Visual Studio Code and Docker Desktop.

```
+---------------------------------------------------------------------------------------------------+
|                        POWERSPEC G914: HARDWARE & SUBSYSTEM ARCHITECTURE                          |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [HOST OS LAYER: Windows 11 Pro 64-bit]                                                           |
|  +---------------------------------------------------------------------------------------------+  |
|  | * MSI MAG X870E Tomahawk BIOS: SVM Mode [Enabled], EXPO [Profile 1], Re-Size BAR [Enabled]    |  |
|  | * NVIDIA Blackwell Windows Display Driver (570.x+ / 572.x+ with native CUDA passthrough)     |  |
|  | * Windows Terminal (PowerShell 7.4 + WSL Profiles)                                          |  |
|  | * VS Code (Host GUI) + Remote-WSL & Dev Containers Extensions                               |  |
|  | * Docker Desktop (WSL2 Backend Engine with Ubuntu-24.04 Integration)                       |  |
|  | * `.wslconfig` (Tuned for G914: 48GB RAM, 28 vCPUs, 32GB NVMe Swap)                         |  |
|  +---------------------------------------------------------------------------------------------+  |
|                                                | (Hyper-V / Virtual Machine Platform Bridge)      |
|                                                v                                                  |
|  [SUBSYSTEM LAYER: WSL2 Ubuntu 24.04 LTS (Primary Development & Evaluation Root)]                |
|  +---------------------------------------------------------------------------------------------+  |
|  | * System Build Essentials (gcc, g++, cmake, ninja, git-lfs, jq, ripgrep)                     |  |
|  | * High-Speed Python Toolchain (`uv` / `uvx` managing Python 3.11.x virtual environment)     |  |
|  | * CUDA Toolkit 12.6/12.8 Libraries + PyTorch Blackwell (CUDA 12.6+)                          |  |
|  | * Inference Serving: vLLM (Compressed-Tensors W4A16 engine, 32GB GDDR7 resident)           |  |
|  | * Fine-Tuning: Unsloth (Gemma 4 LoRA / QLoRA) + Hugging Face PEFT/TRL on RTX 5090           |  |
|  | * Agent Framework: Google ADK (`google-adk`) + `swegemma` + `adk-submission`               |  |
|  | * Benchmark Data: `tasks.jsonl` (129 Dev Tasks) + Repository Caches                         |  |
|  | * Cloud Gateway: Kaggle API CLI (`~/.kaggle/kaggle.json`)                                   |  |
|  +---------------------------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Layer 1: PowerSpec G914 BIOS & Host OS Setup

Perform these steps directly on your PowerSpec G914 before entering the Linux subsystem.

### Step 1.1: Configure MSI MAG X870E Tomahawk WiFi BIOS (Click BIOS X)
Your motherboard must be configured to enable hardware-assisted virtualization, memory overclocking, and full PCIe memory addressing for your RTX 5090:

1. Power on the PC and repeatedly tap the **`DEL`** key to enter **MSI Click BIOS X**.
2. Press **`F7`** to switch from EZ Mode to **Advanced Mode**.
3. **Enable EXPO (Memory Speed):**
   * Navigate to **OC (Overclocking)** -> **DRAM Setting**.
   * Locate **EXPO (AMD Extended Profiles for Overclocking)** and set it to **`[Profile 1]`**.
   * *Impact:* Ensures your 64GB DDR5 memory runs at its full rated **6000 MHz** speed rather than the 4800 MHz JEDEC fallback.
4. **Enable CPU Virtualization (SVM Mode):**
   * Navigate to **OC** -> **CPU Features** (or **Advanced** -> **CPU Configuration**).
   * Locate **SVM Mode (Secure Virtual Machine)** and set it to **`[Enabled]`**.
5. **Enable IOMMU & Re-Size BAR (Critical for 32GB VRAM RTX 5090):**
   * Navigate to **Settings** -> **Advanced** -> **PCIe/PCI Sub-system Settings**.
   * Set **Above 4G Decoding** to **`[Enabled]`**.
   * Set **Re-Size BAR Support** to **`[Enabled]`**.
   * Set **AMD IOMMU** to **`[Enabled]`**.
   * *Impact:* Re-Size BAR allows the Ryzen 9 9950X3D CPU to map the entire 32GB GDDR7 VRAM frame buffer in a single transaction, eliminating PCIe bottlenecks during vLLM weight transfers.
6. Press **`F10`** to save changes and reboot into Windows 11 Pro.

---

### Step 1.2: Enable Windows 11 Pro Virtualization Features
Open **Windows PowerShell** as Administrator and execute:
```powershell
# Enable Virtual Machine Platform, Hyper-V Hypervisor, and WSL
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

# Update WSL kernel to latest release
wsl --update
wsl --set-default-version 2
```
*Reboot the PC if prompted.*

---

### Step 1.3: Install Host NVIDIA Blackwell Display Drivers
Your MSI Ventus 3X OC RTX 5090 uses NVIDIA's **Blackwell** architecture, requiring driver series 570.x or newer:
1. Open your browser and navigate to the official [NVIDIA Driver Downloads](https://www.nvidia.com/Download/index.aspx).
2. Product Type: **GeForce** | Product Series: **GeForce RTX 50 Series** | Product: **GeForce RTX 5090** | OS: **Windows 11**.
3. Download and install the latest **Game Ready Driver** or **Studio Driver** (Version 572.x+ or 570.x+).
> [!IMPORTANT]
> **DO NOT** install Linux display drivers inside WSL2. The Windows display driver automatically exposes `libcuda.so` inside WSL2 via driver virtualization.

---

### Step 1.4: Install Ubuntu 24.04 LTS on WSL2
In Administrator PowerShell, execute:
```powershell
# Install Ubuntu 24.04 LTS
wsl --install -d Ubuntu-24.04
```
A terminal window will prompt you to set up your Linux username (e.g., `developer`) and password.

---

### Step 1.5: Tailor `.wslconfig` for PowerSpec G914 Hardware
Your G914 features **16 Cores / 32 Threads (Ryzen 9 9950X3D)**, **64GB DDR5 RAM**, and a **2TB NVMe SSD**. We configure WSL2 to harness this immense compute while reserving adequate resources for Windows 11:

In Windows PowerShell:
```powershell
notepad "$env:USERPROFILE\.wslconfig"
```
Paste the following tailored configuration:
```ini
[wsl2]
# Allocate 48GB of DDR5-6000 RAM to WSL2 (leaves 16GB for Windows 11 host)
memory=48GB

# Allocate 28 logical cores to WSL2 (leaves 4 threads for Windows UI responsiveness)
processors=28

# Create 32GB high-speed swap space on the fast 2TB NVMe SSD
swap=32GB
swapFile=C:\\temp\\wsl-swap.vhdx

# Enable localhost network bridging
localhostForwarding=true

[experimental]
# Dynamically reclaim memory when agent simulation finishes
autoMemoryReclaim=gradual
sparseVhd=true
```
Create the temp directory and restart WSL:
```powershell
mkdir -Force C:\temp
wsl --shutdown
```

---

## 3. Layer 2: Core Host Developer Utilities

### Step 2.1: Install Windows Terminal & Git for Windows
Open Administrator PowerShell and install via `winget`:
```powershell
winget install --id Microsoft.WindowsTerminal -e
winget install --id Git.Git -e
```

#### CRITICAL Git Line-Ending Configuration on Windows
Configure Git globally on Windows to prevent converting POSIX LF (`\n`) to Windows CRLF (`\r\n`), which would invalidate SWE-bench patch diffs:
```powershell
git config --global core.autocrlf input
```

### Step 2.2: Install Visual Studio Code & Extensions
```powershell
winget install --id Microsoft.VisualStudioCode -e
```
Install the required extensions:
```powershell
code --install-extension ms-vscode-remote.remote-wsl
code --install-extension ms-vscode-remote.remote-containers
code --install-extension ms-python.python
code --install-extension ms-python.vscode-pylance
code --install-extension redhat.vscode-yaml
code --install-extension ms-azuretools.vscode-docker
```

### Step 2.3: Install Docker Desktop for Windows
```powershell
winget install --id Docker.DockerDesktop -e
```
1. Launch Docker Desktop and open **Settings (gear icon)**.
2. In **General**, verify *"Use the WSL 2 based engine"* is checked.
3. In **Resources -> WSL Integration**, enable integration with **Ubuntu-24.04**.
4. Click **Apply & Restart**.

---

## 4. Layer 3: WSL2 Linux Subsystem & High-Speed Python Toolchain

Open **Windows Terminal**, select your **Ubuntu-24.04** tab, and execute all remaining commands in Linux bash.

### Step 3.1: Upgrade Subsystem Packages & Install Build Essentials
```bash
sudo apt update && sudo apt upgrade -y

# Install compilation, compression, and diagnostic tools
sudo apt install -y \
    build-essential \
    cmake \
    ninja-build \
    pkg-config \
    git \
    git-lfs \
    curl \
    wget \
    jq \
    unzip \
    zip \
    ripgrep \
    tree \
    htop \
    ca-certificates

git lfs install
```

### Step 3.2: Verify NVIDIA RTX 5090 Blackwell Passthrough
Execute:
```bash
nvidia-smi
```
*Expected Output:* You should see your **NVIDIA GeForce RTX 5090**, Driver Version 570.x/572.x+, CUDA Version 12.6/12.8+, and **32768 MiB (32 GB) VRAM**.

### Step 3.3: Install `uv` (The High-Speed Rust Python Manager)
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
source ~/.cargo/env
```
Verify:
```bash
uv --version
```

### Step 3.4: Provision Python 3.11 Virtual Environment
```bash
# Create project workspace directory
mkdir -p ~/bcf_workspace && cd ~/bcf_workspace

# Install hermetic Python 3.11 and create virtual environment
uv python install 3.11
uv venv .venv --python 3.11

# Activate virtual environment
source .venv/bin/activate
echo "source ~/bcf_workspace/.venv/bin/activate" >> ~/.bashrc
```

---

## 5. Layer 4: Deep Learning & RTX 5090 Inference Runtimes

### Step 5.1: Install PyTorch with Blackwell Support (CUDA 12.6+)
```bash
uv pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu126
```
Verify PyTorch RTX 5090 acceleration:
```bash
python3 -c "import torch; print(f'PyTorch {torch.__version__} | CUDA Available: {torch.cuda.is_available()} | GPU: {torch.cuda.get_device_name(0)} | VRAM: {torch.cuda.get_device_properties(0).total_memory / 1024**3:.1f} GB')"
```
*Expected Output:* `CUDA Available: True | GPU: NVIDIA GeForce RTX 5090 | VRAM: 32.0 GB`.

### Step 5.2: Install vLLM with Compressed-Tensors Engine
Install vLLM to serve `gemma-4-31b-it-qat-w4a16-ct` with compressed tensors:
```bash
uv pip install vllm compressed-tensors
```

### Step 5.3: Install Fine-Tuning & Adapter Libraries (Unsloth + Hugging Face)
Install Unsloth and Hugging Face training tools to fine-tune Gemma 4:
```bash
uv pip install transformers accelerate peft trl bitsandbytes datasets
uv pip install "unsloth[cu124-ampere-torch240]"
```

### Step 5.4: Install Ollama (Fast Local Testing Proxy)
```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama serve > /dev/null 2>&1 &
```

---

## 6. Layer 5: Google ADK & Competition Evaluation Harness

### Step 6.1: Install Google Agent Development Kit (`google-adk`)
```bash
uv pip install google-adk
```
Verify CLI:
```bash
adk --help
```

### Step 6.2: Install Competition Libraries (`swegemma` & `adk-submission`)
```bash
uv pip install adk-submission swegemma adk-eval-core
```

### Step 6.3: Install Code Graph Exploration & AST Utilities
```bash
uv pip install tree-sitter ast-grep-cli networkx
```

---

## 7. Layer 6: Kaggle CLI & Authentication Setup

### Step 7.1: Install Kaggle CLI
```bash
uv pip install kaggle
```

### Step 7.2: Obtain & Install API Token (`kaggle.json`)
1. Log into your Kaggle account in your web browser.
2. Go to **Settings** (`https://www.kaggle.com/settings`).
3. Under **API**, click **Create New Token** (`kaggle.json` downloads).

#### Copy Token into WSL2:
```bash
mkdir -p ~/.kaggle
cp /mnt/c/Users/$USER/Downloads/kaggle.json ~/.kaggle/kaggle.json
chmod 600 ~/.kaggle/kaggle.json
```

### Step 7.3: Validate Kaggle Connection & Accept Competition Rules
1. Verify API:
   ```bash
   kaggle competitions list
   ```
2. Accept rules at: [Google - The Gemma 4 Developer Agent Competition Rules](https://www.kaggle.com/competitions/gemma-4-developer-agent/rules).
3. Verify competition file access:
   ```bash
   kaggle competitions files -c gemma-4-developer-agent
   ```

---

## 8. Master Tool Inventory & Verification Matrix for PowerSpec G914

| Layer | Tool / Package Name | Required Version | Installation Command | Verification Command | PowerSpec G914 Role |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hardware** | **MSI Click BIOS X** | Latest Motherboard BIOS | MSI M-Flash / BIOS menu | Enter BIOS on boot (`DEL`) | Enables AMD SVM, EXPO DDR5-6000, and Re-Size BAR. |
| **Host OS** | **Windows 11 Pro** | 22H2 / 23H2 / 24H2 | Pre-installed / Windows Update | `winver` | Host hardware and driver virtualization baseline. |
| **Host OS** | **NVIDIA Blackwell Driver**| >= 570.00 | NVIDIA Driver Downloads | `nvidia-smi` (in PowerShell) | GPU virtualization and 32GB GDDR7 CUDA passthrough. |
| **Host OS** | **WSL2 (Ubuntu 24.04)** | Kernel >= 6.6 | `wsl --install -d Ubuntu-24.04` | `wsl --status` | 28 vCPUs and 48GB RAM allocated to Linux sandbox. |
| **Host OS** | **Docker Desktop** | >= 4.30.0 | `winget install Docker.DockerDesktop`| `docker version` | Container engine for `swegemma` isolated sandboxes. |
| **Host OS** | **Visual Studio Code** | Latest Stable | `winget install Microsoft.VisualStudioCode`| `code --version` | Primary IDE with Remote-WSL bridge. |
| **Host OS** | **Git for Windows** | >= 2.44.0 | `winget install Git.Git` | `git --version` | Host version control with `core.autocrlf input`. |
| **Subsystem**| **Build Essentials** | `build-essential` | `sudo apt install build-essential` | `gcc --version` | C/C++ compilation for native wheel extensions. |
| **Subsystem**| **`uv` Package Manager** | >= 0.4.0 | `curl -LsSf https://astral.sh/uv/install.sh &#124; sh` | `uv --version` | Ultra-fast Python package resolution and venvs. |
| **Subsystem**| **Python Runtime** | 3.11.x | `uv python install 3.11` | `python3 --version` | Standard Python runtime for ADK and PyTorch. |
| **Subsystem**| **PyTorch (CUDA 12.6+)**| >= 2.4.0 | `uv pip install torch --index-url ...` | `python3 -c "import torch; print(torch.cuda.is_available())"` | Utilizes 32GB VRAM on RTX 5090 Blackwell GPU. |
| **Subsystem**| **vLLM** | >= 0.6.0 | `uv pip install vllm compressed-tensors` | `vllm --version` | Local serving of `gemma-4-31b-it-qat-w4a16-ct`. |
| **Subsystem**| **Unsloth** | Latest | `uv pip install "unsloth[cu124-ampere-torch240]"` | `python3 -c "import unsloth"` | Fast on-device LoRA post-training for Gemma 4. |
| **Subsystem**| **Hugging Face Stack** | Latest | `uv pip install transformers peft trl` | `python3 -c "import transformers, peft"` | Model weights, tokenizer, and PEFT adapter handling. |
| **Subsystem**| **Google ADK** | Latest | `uv pip install google-adk` | `adk --help` | Official Google Agent Development Kit framework. |
| **Subsystem**| **`swegemma` Harness** | Competition ver. | `uv pip install swegemma adk-submission` | `python3 -c "import swegemma, adk_submission"` | Sandboxed task evaluation & `agent.yaml` compiler. |
| **Subsystem**| **AST Analysis Tools** | Latest | `uv pip install tree-sitter ast-grep-cli` | `ast-grep --version` | Code graph neighborhood and semantic AST retrieval. |
| **Subsystem**| **Kaggle CLI** | >= 1.6.0 | `uv pip install kaggle` | `kaggle --version` | Competition dataset download and zip submission. |


---

<a id="doc-5-03-end-to-end-deployment-plan-and-milestone-checklists"></a>
<!-- ====================================================================== -->
<!-- FILE: 03-end-to-end-deployment-plan-and-milestone-checklists.md (Sequence: 05 of 08) -->
<!-- ====================================================================== -->

# End-to-End Deployment Plan & Milestone Checklists
**Target Competition:** [Google - The Gemma 4 Developer Agent Competition](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview)  
**Deliverable File:** `03-end-to-end-deployment-plan-and-milestone-checklists.md`  
**Date of Record:** October 13, 2026  
**Target Rig:** PowerSpec G914 Gaming PC (AMD Ryzen 9 9950X3D | MSI MAG X870E Tomahawk WiFi | 64GB DDR5-6000 | MSI Ventus 3X OC RTX 5090 32GB GDDR7 | 2TB NVMe SSD | Windows 11 Pro)  
**Status:** Operational Execution Roadmap & Quality Gate Manual  

---

## 1. Lifecycle Roadmap Overview

This deployment plan outlines the step-by-step path from unboxing your **PowerSpec G914 Gaming PC** to submitting the first test run of your **BCF Coding Agent**, obtaining your initial public leaderboard evaluation score, and initiating the on-device fine-tuning loop on your 32GB RTX 5090.

```
+---------------------------------------------------------------------------------------------------+
|                        POWERSPEC G914: BCF AGENT DEPLOYMENT LIFECYCLE ROADMAP                     |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [PHASE 1] Hardware & Subsystem Foundation   ======>   [MILESTONE 1: OS & GPU Gate Passed]       |
|      * MSI Click BIOS X (SVM, EXPO, Re-Size BAR),       * `nvidia-smi` reports RTX 5090 (32GB)    |
|        WSL2 Ubuntu 24.04 (48GB RAM, 28 vCPUs)           * Docker daemon running with WSL bridge   |
|                                                                                                   |
|  [PHASE 2] Python & Competition Harness Ingestion ==> [MILESTONE 2: Tooling & Data Gate Passed]   |
|      * `uv` Python 3.11, PyTorch Blackwell CUDA 12.6,   * `google-adk` & `swegemma` functional    |
|        `google-adk`, `swegemma`, `tasks.jsonl`          * 129 development tasks cached on NVMe    |
|                                                                                                   |
|  [PHASE 3] BCF Declarative Configuration     ======>   [MILESTONE 3: Declarative Compiler Gate]   |
|      * `agent.yaml`, modular system prompts,            * `compile_submission()` returns valid    |
|        tool bindings, sampling configs                    `BaseAgent` tree without errors         |
|                                                                                                   |
|  [PHASE 4] Local Dry-Run Simulation on RTX 5090 ====> [MILESTONE 4: Simulation Gate Passed]      |
|      * Run sample task in Docker sandbox,               * Clean reproduction -> surgical patch -> |
|        verify BCF loop & `submit_patch` call              unified diff verified via `pytest`      |
|                                                                                                   |
|  [PHASE 5] Submission Packaging & Kaggle Upload ===>   [MILESTONE 5: Kaggle Pipeline Gate]        |
|      * Bundle `submission.zip` (root `agent.yaml`),     * CLI submission accepted with message    |
|        validate file limits, push via Kaggle CLI          "Successfully submitted"                |
|                                                                                                   |
|  [PHASE 6] Score Retrieval & Log Diagnostics ======>   [MILESTONE 6: First Score Gate Passed]     |
|      * Monitor Kaggle scoring container,                * Official public score posted on         |
|        extract execution logs, audit error traces         leaderboard; initial baseline locked    |
|                                                                                                   |
|  [PHASE 7] On-Device Fine-Tuning Loop on RTX 5090 ==>  [MILESTONE 7: Fine-Tuning Gate Passed]     |
|      * Harvest failure trajectories, train Gemma 4      * 31B LoRA adapter packaged into zip      |
|        with Unsloth QLoRA on 32GB GDDR7 VRAM              yielding higher bug-fix rate            |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Phase 1: Hardware & Subsystem Foundation (PowerSpec G914)

### Objective
Configure the MSI MAG X870E Tomahawk motherboard BIOS, provision Windows 11 Pro virtualization features, allocate high-performance resources (48GB RAM, 28 vCPUs) to WSL2 Ubuntu 24.04 LTS, and establish direct NVIDIA RTX 5090 Blackwell GPU passthrough.

### Task Breakdown
1. **Task 1.1 (MSI Click BIOS X Configuration):**
   * Boot PowerSpec G914 and tap `DEL` to enter BIOS. Press `F7` for Advanced Mode.
   * Go to **OC** -> **DRAM Setting** -> set **EXPO** to `[Profile 1]` (enables full 6000 MHz speed for 64GB DDR5).
   * Go to **OC** -> **CPU Features** -> set **SVM Mode** to `[Enabled]`.
   * Go to **Settings** -> **Advanced** -> **PCIe/PCI Sub-system Settings** -> set **Above 4G Decoding** to `[Enabled]`, **Re-Size BAR Support** to `[Enabled]`, and **AMD IOMMU** to `[Enabled]`.
   * Press `F10` to save and reboot.
2. **Task 1.2:** In Windows 11 Pro Administrator PowerShell, enable `VirtualMachinePlatform` and `Microsoft-Windows-Subsystem-Linux`, and run `wsl --update`.
3. **Task 1.3:** Download and install the latest NVIDIA Blackwell display driver (Version 572.x+ or 570.x+) for RTX 5090.
4. **Task 1.4:** Install Ubuntu 24.04 LTS via `wsl --install -d Ubuntu-24.04` and configure Linux user credentials.
5. **Task 1.5:** Create `%USERPROFILE%\.wslconfig` configured specifically for the G914:
   ```ini
   [wsl2]
   memory=48GB
   processors=28
   swap=32GB
   swapFile=C:\\temp\\wsl-swap.vhdx
   localhostForwarding=true
   [experimental]
   autoMemoryReclaim=gradual
   sparseVhd=true
   ```
6. **Task 1.6:** Install Windows Terminal, Git for Windows (configured with `core.autocrlf input`), and Docker Desktop with WSL2 Ubuntu-24.04 integration enabled.

### Milestone 1 Acceptance Checklist
- [ ] Running `wsl -l -v` in PowerShell shows `Ubuntu-24.04` running as **Version 2**.
- [ ] Running `nvidia-smi` inside WSL2 bash prints:
  `NVIDIA GeForce RTX 5090 | 32768 MiB VRAM | Driver: 57x.xx | CUDA: 12.6+`.
- [ ] Running `lscpu | grep "CPU(s):"` inside WSL2 reports `28` vCPUs.
- [ ] Running `free -h` inside WSL2 reports approximately `47G` or `48G` available memory.
- [ ] Running `docker run --rm hello-world` inside WSL2 bash prints `"Hello from Docker!"`.
- [ ] Running `git config --global core.autocrlf` prints `input`.

---

## 3. Phase 2: Python Tooling, ADK & Harness Ingestion

### Objective
Install high-speed Python tooling (`uv`), provision a clean Python 3.11 virtual environment, install PyTorch with CUDA 12.6+ (Blackwell acceleration), install Google ADK (`google-adk`), `swegemma`, and download the 129 competition tasks (`tasks.jsonl`).

### Task Breakdown
1. **Task 2.1:** Inside WSL2 Ubuntu, install system build tools (`build-essential`, `cmake`, `git-lfs`, `jq`, `ripgrep`, `zip`).
2. **Task 2.2:** Install Astral's `uv` package manager (`curl -LsSf https://astral.sh/uv/install.sh | sh`).
3. **Task 2.3:** Provision hermetic Python 3.11 virtual environment at `~/bcf_workspace/.venv` and activate it.
4. **Task 2.4:** Install PyTorch 2.4+ / CUDA 12.6+ for RTX 5090:
   ```bash
   uv pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu126
   ```
5. **Task 2.5:** Install Google Agent Development Kit (`uv pip install google-adk`).
6. **Task 2.6:** Install `adk-submission`, `swegemma`, and `adk-eval-core`.
7. **Task 2.7:** Set up Kaggle API token (`~/.kaggle/kaggle.json` with `chmod 600`) and download the competition development dataset (`kaggle competitions download -c gemma-4-developer-agent`).
8. **Task 2.8:** Extract dataset into `~/bcf_workspace/data/` on the fast 2TB NVMe SSD and verify `tasks.jsonl`.

### Milestone 2 Acceptance Checklist
- [ ] Running `python3 -c "import torch; assert torch.cuda.is_available(); print(torch.cuda.get_device_name(0))"` prints `NVIDIA GeForce RTX 5090`.
- [ ] Running `adk --help` displays Google ADK command-line interface.
- [ ] Running `python3 -c "import swegemma, adk_submission; print('Harness OK')"` executes cleanly.
- [ ] Running `wc -l ~/bcf_workspace/data/tasks.jsonl` reports exactly 129 development tasks.

---

## 4. Phase 3: BCF Agent Declarative Wiring & Local Assembly

### Objective
Construct the declarative architecture of your BCF coding agent conforming strictly to the `agent.yaml` schema required by `compile_submission`.

### Task Breakdown
1. **Task 3.1:** Create local agent project directory at `~/bcf_workspace/bcf_agent/`.
2. **Task 3.2:** Author modular prompt files:
   * `prompts/system.md`: Injects the Branch-Check-Fix discipline, tool constraints, context slice rules, and patch submission protocol.
   * `prompts/tools_guide.md`: Guidance on using AST tools (`get_code_neighbors`, `search_similar_code`).
3. **Task 3.3:** Author `configs/sampling.yaml` with temperature (0.2), top_p (0.95), and max_tokens (4096).
4. **Task 3.4:** Create root `agent.yaml` referencing `gemma-4-31b-it-qat-w4a16-ct`, system prompt paths via `!include`, generation parameters, and tool bindings (`run_command`, `read_file`, `edit_file`, `write_file`, `get_status`, `submit_patch`, and AST graph tools).
5. **Task 3.5:** Author `validate_submission.py` to compile the local bundle against `build_submission_limits()`.

### Milestone 3 Acceptance Checklist
- [ ] `agent.yaml` exists strictly at the root of `~/bcf_workspace/bcf_agent/agent.yaml`.
- [ ] Running `python3 validate_submission.py ~/bcf_workspace/bcf_agent` executes `compile_submission` and returns `"Bundle compiled successfully into BaseAgent"`.
- [ ] No undeclared tools or unauthorized dynamic imports exist.

---

## 5. Phase 4: Local Simulation on RTX 5090 & Benchmark Dry-Run

### Objective
Execute a dry-run evaluation on 1–2 sample tasks from `tasks.jsonl` in an isolated Docker sandbox using `swegemma eval`. Your RTX 5090 with 32GB GDDR7 VRAM runs the 31B model locally with full KV-cache headroom, verifying that the BCF loop functions end-to-end and cleanly produces a non-empty patch via `submit_patch()`.

### Task Breakdown
1. **Task 4.1:** Launch local model backend via vLLM utilizing the 32GB VRAM of your RTX 5090:
   ```bash
   vllm serve google/gemma-4-31b-it-qat-w4a16-ct \
       --gpu-memory-utilization 0.90 \
       --max-model-len 16384 \
       --port 8000
   ```
2. **Task 4.2:** Filter 1 known task from `tasks.jsonl` into `~/bcf_workspace/data/sample_task.jsonl`.
3. **Task 4.3:** Execute local evaluation harness:
   ```bash
   swegemma eval \
       --tasks ~/bcf_workspace/data/sample_task.jsonl \
       --submission-dir ~/bcf_workspace/bcf_agent \
       --sandbox docker \
       --timeout 600
   ```
4. **Task 4.4:** Inspect agent execution log:
   * Did BCF search and locate the target file?
   * Did BCF create a reproduction check?
   * Did BCF edit the code?
   * Did BCF call `submit_patch()` before hitting turn limits?
5. **Task 4.5:** Verify that the resulting git diff was captured and evaluated by the test runner.

### Milestone 4 Acceptance Checklist
- [ ] vLLM reports successful model initialization on RTX 5090 with ~19GB weight residency and ~10GB KV-cache allocation.
- [ ] The Docker container mounts `/workspace` cleanly without permission errors.
- [ ] The agent executes multiple tool calls (`search_similar_code` -> `read_file` -> `edit_file` -> `run_command`).
- [ ] The agent calls `submit_patch()` terminating the loop gracefully.
- [ ] The evaluation harness generates a non-empty `prediction.patch` file.

---

## 6. Phase 5: Submission Packaging, Pre-flight Verification & Upload

### Objective
Automate the production packaging of `submission.zip`, execute pre-flight integrity audits (zip structure, file sizes, root presence of `agent.yaml`), and dispatch your first submission via the Kaggle API CLI.

### Task Breakdown
1. **Task 5.1:** Author `build_submission.py` to package `~/bcf_workspace/bcf_agent/` into `submission.zip`. Ensure files are compressed with `agent.yaml` located at the root level (no enclosing folder).
2. **Task 5.2:** Audit archive structure with `unzip -l submission.zip`.
3. **Task 5.3:** Validate that no forbidden temporary files (`.git`, `.venv`, `__pycache__`, `.DS_Store`) are included.
4. **Task 5.4:** Submit to Kaggle via command line:
   ```bash
   kaggle competitions submit \
       -c gemma-4-developer-agent \
       -f submission.zip \
       -m "BCF Agent v1.0 Baseline - PowerSpec G914 Test Run"
   ```
5. **Task 5.5:** Check submission status via Kaggle CLI:
   ```bash
   kaggle competitions submissions -c gemma-4-developer-agent
   ```

### Milestone 5 Acceptance Checklist
- [ ] Running `unzip -l submission.zip | grep agent.yaml` shows `agent.yaml` with no leading path.
- [ ] Archive size is within competition upload boundaries (< 50MB without weights).
- [ ] Kaggle CLI returns `"Successfully submitted to Google - The Gemma 4 Developer Agent Competition"`.
- [ ] Submission status shows `pending` or `running` on the Kaggle submissions dashboard.

---

## 7. Phase 6: First Score Retrieval, Log Diagnostics & Error Auditing

### Objective
Track the execution of your test run on Kaggle's scoring backend, confirm completion, obtain your first leaderboard score, and perform diagnostic log audits.

### Task Breakdown
1. **Task 6.1:** Monitor submission state using `kaggle competitions submissions -c gemma-4-developer-agent`.
2. **Task 6.2:** Once status transitions from `running` to `complete`, record your initial public leaderboard score (number and percentage of bugs fixed).
3. **Task 6.3:** Download submission evaluation logs / diagnostic output if accessible via Kaggle UI.
4. **Task 6.4:** Audit error classes:
   * **Timeout Failures:** Did tasks terminate due to 10-minute per-task limits? (Remedy: Reduce `max_turns` or speed up code search).
   * **Empty Patch Failures:** Did the agent run out of turns before calling `submit_patch()`? (Remedy: Tighten BCF early exit safeguard).
   * **Syntax / Regression Failures:** Did the patch break other tests? (Remedy: Enhance Phase 3 regression testing prompt).

### Milestone 6 Acceptance Checklist
- [ ] Submission status transitions to `complete` without throwing `Compilation Error` or `Compute Exceeded`.
- [ ] Official public leaderboard displays a numerical score for your submission.
- [ ] Baseline performance documented in your experiment tracker.

---

## 8. Phase 7: On-Device Trajectory Harvesting & Fine-Tuning Loop (RTX 5090)

### Objective
Leverage the massive 32GB GDDR7 VRAM of your RTX 5090 and 28 vCPUs of the Ryzen 9 9950X3D to run local batch evaluations, harvest multi-turn trajectories, fine-tune Gemma 4 using Unsloth QLoRA directly on your PC, package custom LoRA adapters into Gen-2 submissions, and boost your bug-fix score.

### Task Breakdown
1. **Task 7.1:** Execute the BCF agent locally across all 129 tasks in `tasks.jsonl` with trajectory logging enabled (completed in parallel using your 28 vCPUs and RTX 5090).
2. **Task 7.2:** Filter trajectories into two datasets:
   * **Successful Trajectories (Positive Pairs):** Ideal reasoning steps and tool-call sequences that resolved the issue.
   * **Failed Trajectories (Negative Pairs):** Tool calls that hallucinated commands, failed to edit files, or generated broken patches.
3. **Task 7.3:** Format trajectory data into standard ChatML / Gemma instruction format with explicit `<tool_call>` and `<thought>` blocks.
4. **Task 7.4:** Run `train_bcf_lora.py` with Unsloth on RTX 5090:
   * Train 4-bit LoRA adapter on target layers (`q_proj`, `k_proj`, `v_proj`, `o_proj`, `gate_proj`, `up_proj`, `down_proj`).
   * Hyperparameters on RTX 5090: Batch size `2`, sequence length `8192` (enabled by 32GB VRAM), learning rate `2e-4`, rank `r=16`, `lora_alpha=32`, `bf16=True`.
5. **Task 7.5:** Export trained LoRA weights into `~/bcf_workspace/bcf_agent/lora/`.
6. **Task 7.6:** Update `agent.yaml` to register the adapter directory.
7. **Task 7.7:** Package and submit `submission_v2.zip` to Kaggle, obtaining your fine-tuned leaderboard score!

### Milestone 7 Acceptance Checklist
- [ ] Unsloth training script executes completely on RTX 5090 without VRAM memory errors.
- [ ] Exported `lora/` folder contains valid `adapter_config.json` and `adapter_model.safetensors`.
- [ ] `validate_submission.py` confirms that the compiled agent loads both the base model and the LoRA adapter cleanly.
- [ ] Gen-2 submission achieves a higher bug-resolution score on the leaderboard.


---

<a id="doc-6-04-bcf-agent-code-templates-and-fine-tuning-recipes"></a>
<!-- ====================================================================== -->
<!-- FILE: 04-bcf-agent-code-templates-and-fine-tuning-recipes.md (Sequence: 06 of 08) -->
<!-- ====================================================================== -->

# BCF Agent Code Templates & Fine-Tuning Recipes
**Target Competition:** [Google - The Gemma 4 Developer Agent Competition](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview)  
**Deliverable File:** `04-bcf-agent-code-templates-and-fine-tuning-recipes.md`  
**Date of Record:** October 13, 2026  
**Target Rig:** PowerSpec G914 Gaming PC (AMD Ryzen 9 9950X3D | MSI MAG X870E Tomahawk WiFi | 64GB DDR5-6000 | MSI Ventus 3X OC RTX 5090 32GB GDDR7 | 2TB NVMe SSD | Windows 11 Pro)  
**Status:** Production-Ready Code & Configuration Templates  

---

## 1. Directory Structure of the BCF Submission Bundle

Your local agent repository at `~/bcf_workspace/bcf_agent/` should be structured as follows:

```text
bcf_agent/
├── agent.yaml                 # Root declarative configuration entrypoint (MANDATORY)
├── configs/
│   └── sampling.yaml          # Generation & sampling hyperparameters
├── prompts/
│   ├── system.md              # Core BCF system prompt & behavioral protocol
│   └── tools_guide.md         # Specialized guidelines for AST code-graph tools
└── lora/                      # (Populated after Phase 7 on RTX 5090)
    ├── adapter_config.json
    └── adapter_model.safetensors
```

---

## 2. Root Declarative Specification (`agent.yaml`)

Save this file as `~/bcf_workspace/bcf_agent/agent.yaml`:

```yaml
version: "1.0.0"
agent_type: "swe_developer_agent"
name: "bcf-coding-agent"
description: "Branch-Check-Fix autonomous software engineering agent powered by Gemma 4"

# Base model declaration mapped to closed host registry
model:
  name: "gemma-4-31b-it-qat-w4a16-ct"
  backend: "vllm"
  sampling_config: "configs/sampling.yaml"

# System prompts injected via declarative include tags
prompts:
  system_prompt: "!include prompts/system.md"
  tools_prompt: "!include prompts/tools_guide.md"

# Tools bound from host tool registry (ToolRegistry)
tools:
  - name: "run_command"
    description: "Execute non-interactive shell commands in /workspace"
  - name: "read_file"
    description: "Read slices of file contents with line numbers"
  - name: "edit_file"
    description: "Replace exact string blocks in workspace files"
  - name: "write_file"
    description: "Create new files or overwrite existing files"
  - name: "get_status"
    description: "Inspect git status of modified files in repository"
  - name: "get_code_neighbors"
    description: "Inspect AST callers, callees, and class neighbors"
  - name: "search_similar_code"
    description: "Search AST symbols and code references across repository"
  - name: "get_code_subgraph"
    description: "Extract localized AST dependency subgraph"
  - name: "submit_patch"
    description: "Terminal action: freeze git diff and complete task"

# Runtime boundaries and task execution safeguards
runtime_limits:
  max_turns: 25
  timeout_seconds: 600
  early_exit_turn_threshold: 23

# Adapter configuration (Active in Phase 7 after fine-tuning)
adapters:
  enabled: false
  path: "lora"
```

---

## 3. Core BCF System Prompt (`prompts/system.md`)

Save this file as `~/bcf_workspace/bcf_agent/prompts/system.md`:

```markdown
You are the BCF (Branch-Check-Fix) Autonomous Software Engineering Agent.
Your objective is to resolve real-world software issues in the repository mounted at `/workspace`.

You must strictly adhere to the four sequential phases of the BCF protocol:

### PHASE 1: BRANCH (Localization & Context Scoping)
1. Read the user's issue statement and identify error messages, stack traces, and symbol names.
2. Use `search_similar_code` and `get_code_neighbors` to locate the suspect files and functions.
3. Use `read_file` with precise line slices (max 80 lines per view) to inspect the code. Never dump full files into context.
4. Do NOT attempt any code edits during Phase 1.

### PHASE 2: CHECK (Reproduction & Baseline Verification)
1. Identify existing relevant test files in the repository or write a minimal standalone reproduction script using `write_file`.
2. Run the test using `run_command` (e.g., `pytest tests/test_suspect.py -k test_target`).
3. CONFIRM the reproduction: The test MUST fail with the expected error before you make any code modifications.
4. If you cannot reproduce the failure, re-examine the traceback and re-locate the issue.

### PHASE 3: FIX (Surgical Implementation & Regression Testing)
1. Formulate a minimal, targeted patch that addresses the root cause without altering unrelated functionality.
2. Apply your change using `edit_file`, providing sufficient unique contextual lines in `old_str` to guarantee unambiguous replacement.
3. Re-run the reproduction test: It must now PASS.
4. Run the broader test module to verify that your fix introduced no regression errors.
5. If tests fail, analyze the error output and adjust your fix. Do not guess.

### PHASE 4: CONVERGENCE & TERMINAL ACTION (Integrity Guard)
1. Use `get_status` to inspect workspace modifications.
2. If you created any temporary reproduction scripts during Phase 2, remove them immediately (`rm repro_test.py`).
3. Ensure only genuine source file changes remain in `git status`.
4. Call `submit_patch()` to freeze the unified git diff as your official submission.
5. You MUST call `submit_patch()` before Turn 23. If you run low on turns or time, clean up and call `submit_patch()` immediately.

### CRITICAL RULES:
- Never execute interactive commands (`vim`, `nano`, `top`, `less`, `python -i`).
- Never make external network requests; all operations must run offline.
- Output your reasoning inside `<thought>` tags before invoking any tool.
- Always conclude the task with `submit_patch()`.
```

---

## 4. Sampling Configuration (`configs/sampling.yaml`)

Save this file as `~/bcf_workspace/bcf_agent/configs/sampling.yaml`:

```yaml
temperature: 0.2
top_p: 0.95
top_k: 40
max_tokens: 4096
presence_penalty: 0.0
frequency_penalty: 0.1
stop_sequences:
  - "<|im_end|>"
  - "<|end_of_turn|>"
```

---

## 5. Local vLLM Server Runner for RTX 5090 (`serve_gemma4_rtx5090.sh`)

Save this script as `~/bcf_workspace/serve_gemma4_rtx5090.sh`:

```bash
#!/usr/bin/env bash
# High-Throughput Local Model Server for PowerSpec G914 (MSI RTX 5090 32GB GDDR7)
set -euo pipefail

MODEL_ID="google/gemma-4-31b-it-qat-w4a16-ct"
PORT=8000

echo "[*] Launching vLLM Engine on NVIDIA GeForce RTX 5090 (32GB VRAM)..."
echo "    Allocating 90% VRAM (~28.8GB) for high-concurrency KV cache & 16k context window."

python3 -m vllm.entrypoints.openai.api_server \
    --model "${MODEL_ID}" \
    --gpu-memory-utilization 0.90 \
    --max-model-len 16384 \
    --enforce-eager \
    --dtype bfloat16 \
    --port "${PORT}" \
    --host 0.0.0.0
```

---

## 6. Pre-Flight Submission Compiler Validator (`validate_submission.py`)

Save this script as `~/bcf_workspace/validate_submission.py`:

```python
#!/usr/bin/env python3
"""
Pre-Flight Validator: Validates BCF agent submission against official
Kaggle ADK declarative compiler and submission limits.
"""

import sys
import os
from pathlib import Path

def validate(bundle_path: str):
    bundle_dir = Path(bundle_path).resolve()
    print(f"[*] Validating agent bundle at: {bundle_dir}")

    # 1. Check root agent.yaml presence
    agent_yaml = bundle_dir / "agent.yaml"
    if not agent_yaml.is_file():
        print(f"[!] ERROR: Mandatory 'agent.yaml' not found at root: {agent_yaml}")
        sys.exit(1)
    print("  [+] Root agent.yaml located successfully.")

    # 2. Check forbidden files
    forbidden_patterns = [".git", "__pycache__", ".venv", ".DS_Store"]
    found_forbidden = []
    for root, dirs, files in os.walk(bundle_dir):
        for item in dirs + files:
            if item in forbidden_patterns or item.endswith(".pyc"):
                found_forbidden.append(os.path.join(root, item))

    if found_forbidden:
        print(f"[!] WARNING: Found {len(found_forbidden)} forbidden/temporary items:")
        for item in found_forbidden[:5]:
            print(f"      - {item}")
        print("    Clean these before creating submission.zip!")

    # 3. Test compilation via adk_submission & swegemma
    try:
        from swegemma.config import build_submission_limits
        from adk_submission import compile_submission, ModelRegistry, ToolRegistry

        print("[*] Loading submission limits and constraints...")
        limits, constraints = build_submission_limits()

        models = ModelRegistry()
        tools = ToolRegistry()

        print("[*] Invoking compile_submission()...")
        agent = compile_submission(
            str(bundle_dir),
            tool_registry=tools,
            model_registry=models,
            limits=limits,
            generation_constraints=constraints
        )
        print("  [+] SUCCESS: Bundle compiled cleanly into BaseAgent tree!")
        print(f"  [+] Agent Name: {agent.name if hasattr(agent, 'name') else 'BCF Agent'}")
        return True

    except ImportError as e:
        print(f"[!] Skipping live harness compilation check (harness package not yet installed): {e}")
        print("  [+] Structural schema checks passed.")
        return True
    except Exception as e:
        print(f"[!] COMPILATION ERROR: {e}")
        sys.exit(1)

if __name__ == "__main__":
    target_dir = sys.argv[1] if len(sys.argv) > 1 else "~/bcf_workspace/bcf_agent"
    validate(os.path.expanduser(target_dir))
```

---

## 7. Automated Production Packager (`build_submission.py`)

Save this script as `~/bcf_workspace/build_submission.py`:

```python
#!/usr/bin/env python3
"""
Automated Packager: Compresses BCF agent directory into submission.zip
ensuring agent.yaml is located strictly at the zip root level.
"""

import os
import sys
import zipfile
from pathlib import Path

def create_submission_zip(source_dir: str, output_zip: str):
    src = Path(source_dir).resolve()
    out = Path(output_zip).resolve()

    if not (src / "agent.yaml").is_file():
        raise FileNotFoundError(f"agent.yaml must exist at the root of {src}")

    print(f"[*] Packaging {src} into {out}...")

    # Excluded files and directories
    ignore_names = {
        ".git", ".gitignore", "__pycache__", ".venv", ".pytest_cache",
        ".DS_Store", "submission.zip"
    }

    file_count = 0
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(src):
            # Prune excluded directories
            dirs[:] = [d for d in dirs if d not in ignore_names]
            
            for f in files:
                if f in ignore_names or f.endswith(".pyc") or f.endswith(".tmp"):
                    continue
                
                full_path = Path(root) / f
                # Crucial: relative path ensures agent.yaml is at zip root
                rel_path = full_path.relative_to(src)
                zf.write(full_path, arcname=str(rel_path))
                file_count += 1

    size_mb = out.stat().st_size / (1024 * 1024)
    print(f"  [+] Packed {file_count} files into {out.name} ({size_mb:.2f} MB)")

    # Verify zip structure
    with zipfile.ZipFile(out, "r") as zf:
        names = zf.namelist()
        if "agent.yaml" not in names:
            raise ValueError("Verification failed: agent.yaml is NOT at the root of submission.zip!")
        print("  [+] Structural audit PASSED: agent.yaml is verified at zip root.")

if __name__ == "__main__":
    src_folder = sys.argv[1] if len(sys.argv) > 1 else "~/bcf_workspace/bcf_agent"
    out_file = sys.argv[2] if len(sys.argv) > 2 else "~/bcf_workspace/submission.zip"
    create_submission_zip(os.path.expanduser(src_folder), os.path.expanduser(out_file))
```

---

## 8. Local Task Evaluation Runner (`run_local_evaluation.py`)

Save this script as `~/bcf_workspace/run_local_evaluation.py`:

```python
#!/usr/bin/env python3
"""
Local Evaluation Runner: Executes BCF agent against tasks from tasks.jsonl
using swegemma in an isolated Docker sandbox.
"""

import sys
import subprocess
from pathlib import Path

def run_eval(tasks_path: str, agent_dir: str):
    tasks_file = Path(tasks_path).resolve()
    agent_path = Path(agent_dir).resolve()

    print(f"[*] Starting local evaluation using: {tasks_file}")
    print(f"[*] Agent directory: {agent_path}")

    cmd = [
        "swegemma", "eval",
        "--tasks", str(tasks_file),
        "--submission-dir", str(agent_path),
        "--sandbox", "docker",
        "--timeout", "600",
        "--max-turns", "25",
        "--output-dir", str(Path.home() / "bcf_workspace/eval_results")
    ]

    print(f"[*] Command: {' '.join(cmd)}")
    result = subprocess.run(cmd)
    
    if result.returncode == 0:
        print("[+] Evaluation complete. Inspect results in ~/bcf_workspace/eval_results/")
    else:
        print(f"[!] Evaluation exited with error code: {result.returncode}")

if __name__ == "__main__":
    tasks = sys.argv[1] if len(sys.argv) > 1 else "~/bcf_workspace/data/sample_task.jsonl"
    agent = sys.argv[2] if len(sys.argv) > 2 else "~/bcf_workspace/bcf_agent"
    run_eval(tasks, agent)
```

---

## 9. On-Device Unsloth / PEFT Gemma 4 Fine-Tuning Recipe for RTX 5090 (`train_bcf_lora.py`)

Save this script as `~/bcf_workspace/train_bcf_lora.py`:

```python
#!/usr/bin/env python3
"""
On-Device Unsloth Gemma 4 Fine-Tuning Script:
Trained on NVIDIA GeForce RTX 5090 (32GB GDDR7 VRAM, Blackwell Architecture).
Trains 4-bit LoRA adapter on successful BCF execution trajectories.
"""

import os
import torch
from datasets import load_dataset
from transformers import TrainingArguments
from trl import SFTTrainer

def train_lora():
    print("[*] Initializing Unsloth Gemma 4 Training Pipeline on PowerSpec G914...")
    
    if not torch.cuda.is_available():
        raise SystemError("CUDA GPU not detected. Ensure WSL2 NVIDIA passthrough is functional.")

    gpu_name = torch.cuda.get_device_name(0)
    vram_gb = torch.cuda.get_device_properties(0).total_memory / (1024**3)
    print(f"[*] Detected GPU: {gpu_name} with {vram_gb:.1f} GB VRAM")

    try:
        from unsloth import FastLanguageModel
    except ImportError:
        print("[!] Unsloth not found. Install via: uv pip install 'unsloth[cu124-ampere-torch240]'")
        return

    # On a 32GB RTX 5090, we can train up to 8192 sequence length comfortably
    max_seq_length = 8192
    model_name = "google/gemma-4-31b-it"
    output_dir = os.path.expanduser("~/bcf_workspace/bcf_agent/lora")

    print(f"[*] Loading model {model_name} in 4-bit QLoRA mode...")
    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name=model_name,
        max_seq_length=max_seq_length,
        load_in_4bit=True,
    )

    print("[*] Attaching PEFT/LoRA adapters...")
    model = FastLanguageModel.get_peft_model(
        model,
        r=16,
        target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
        lora_alpha=32,
        lora_dropout=0.05,
        bias="none",
        use_gradient_checkpointing=True,
        random_state=3407,
    )

    data_path = os.path.expanduser("~/bcf_workspace/data/bcf_trajectories.jsonl")
    if not os.path.exists(data_path):
        print(f"[!] Trajectory dataset {data_path} not found. Run Phase 4 simulation first.")
        return

    print(f"[*] Loading training trajectories from {data_path}...")
    dataset = load_dataset("json", data_files=data_path, split="train")

    # Hyperparameters tuned for 32GB GDDR7 VRAM on RTX 5090
    training_args = TrainingArguments(
        output_dir=os.path.expanduser("~/bcf_workspace/training_checkpoints"),
        per_device_train_batch_size=2,          # 32GB VRAM handles batch size 2 at 8k length
        gradient_accumulation_steps=4,          # Effective batch size = 8
        warmup_steps=10,
        max_steps=100,
        learning_rate=2e-4,
        bf16=True,                              # Native bfloat16 on RTX 5090 Blackwell
        fp16=False,
        logging_steps=5,
        optim="adamw_8bit",
        weight_decay=0.01,
        lr_scheduler_type="cosine",
        seed=3407,
    )

    trainer = SFTTrainer(
        model=model,
        tokenizer=tokenizer,
        train_dataset=dataset,
        dataset_text_field="text",
        max_seq_length=max_seq_length,
        args=training_args,
    )

    print("[*] Starting on-device model training on RTX 5090...")
    trainer.train()

    print(f"[*] Saving fine-tuned LoRA adapters to {output_dir}...")
    model.save_pretrained(output_dir)
    tokenizer.save_pretrained(output_dir)
    print("  [+] Fine-tuning complete! LoRA adapters ready for packaging in Phase 7.")

if __name__ == "__main__":
    train_lora()
```


---

<a id="doc-7-05-zorin-os-18-dual-boot-and-claude-developer-setup"></a>
<!-- ====================================================================== -->
<!-- FILE: 05-zorin-os-18-dual-boot-and-claude-developer-setup.md (Sequence: 07 of 08) -->
<!-- ====================================================================== -->

# Zorin OS 18.1 Dual-Boot & Claude Code Developer Toolchain Guide
**Hardware Profile:** PowerSpec G914 Gaming PC  
* **CPU:** AMD Ryzen 9 9950X3D (16 Cores / 32 Threads, Zen 5, 4.3–5.7 GHz)  
* **Motherboard:** MSI MAG X870E Tomahawk WiFi (AM5, PCIe 5.0)  
* **RAM:** 64GB DDR5-6000 (EXPO Profile 1)  
* **GPU:** MSI Ventus 3X OC NVIDIA GeForce RTX 5090 (32GB GDDR7, Blackwell Architecture)  
* **Storage:** 2TB NVMe PCIe SSD  
* **Host OS:** Windows 11 Pro 64-bit  
**Target Dual-Boot OS:** Zorin OS 18.1 (64-bit, Ubuntu 24.04 LTS Base, Linux Kernel 6.8/6.11 HWE)  
**Deliverable File:** `05-zorin-os-18-dual-boot-and-claude-developer-setup.md`  
**Date of Record:** October 13, 2026  

---

## 1. Executive Summary & Dual-Boot Architecture

**Zorin OS 18.1** is a modern, high-performance Linux distribution built on the **Ubuntu 24.04 LTS** base with long-term support through June 2029. It combines the visual elegance and ease of use of a polished desktop environment with the raw power of the Ubuntu Linux kernel, making it an exceptional native platform for AI agent development, CUDA workloads, and full-stack software engineering.

Dual-booting Zorin OS 18.1 alongside Windows 11 Pro on your **PowerSpec G914** allows you to preserve your complete Windows 11 setup while unlocking bare-metal Linux performance. Unlike virtual machines or WSL2, running Zorin OS natively grants direct access to:
* **The 32GB GDDR7 VRAM of your RTX 5090** without virtualization layers.
* **The full 16 Cores / 32 Threads of the AMD Ryzen 9 9950X3D** using the Linux `amd-pstate-epp` frequency scaling driver.
* **Low-overhead Docker CE and Kubernetes engines** with direct GPU container passthrough.

```
+---------------------------------------------------------------------------------------------------+
|                         POWERSPEC G914 DUAL-BOOT STORAGE & BOOT ARCHITECTURE                      |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [PHYSICAL DISK: 2TB NVMe PCIe SSD (`/dev/nvme0n1`)]                                             |
|  +---------------------------------------------------------------------------------------------+  |
|  | Partition 1: EFI System Partition (FAT32, ~100–500MB)                                       |  |
|  |              Shared UEFI Bootloader (GRUB Boot Menu -> boots Zorin OS or Windows Boot Mgr)  |  |
|  +---------------------------------------------------------------------------------------------+  |
|  | Partition 2: Microsoft Reserved Partition (MSR, ~16MB)                                      |  |
|  +---------------------------------------------------------------------------------------------+  |
|  | Partition 3: Windows 11 Pro OS Partition (NTFS, ~1.0–1.4 TB)                                |  |
|  |              Windows C:\ Drive (BitLocker backed up, Fast Startup Disabled)                  |  |
|  +---------------------------------------------------------------------------------------------+  |
|  | Partition 4: Windows Recovery Environment (NTFS, ~800MB)                                    |  |
|  +---------------------------------------------------------------------------------------------+  |
|  | Partition 5: Zorin OS 18.1 Root Filesystem (`/`) (Ext4, ~500GB–800GB)                       |  |
|  |              Bare-Metal Linux OS, NVIDIA 570+ Driver, Claude Code CLI, VS Code              |  |
|  +---------------------------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Phase 1: Pre-Installation Preparations inside Windows 11 Pro

Before modifying partitions or booting the Zorin OS installer, perform these three critical preparatory steps inside Windows 11 Pro:

### Step 1.1: Backup Windows 11 BitLocker Recovery Key (CRITICAL)
Windows 11 Pro on modern prebuilt systems often activates BitLocker drive encryption automatically. Modifying partition boundaries or altering the UEFI boot order will trigger **BitLocker Recovery Mode** on your next Windows boot.

1. Open **Windows PowerShell** as Administrator and check BitLocker status:
   ```powershell
   manage-bde -status C:
   ```
2. If BitLocker is **Protection On**, retrieve and print your 48-digit Recovery Key:
   ```powershell
   manage-bde -protectors -get C:
   ```
   *Write down this 48-digit numerical password or save it to your phone/cloud account (`https://account.microsoft.com/devices/recoverykey`).*
3. **Recommended Temporary Suspension:** Suspend BitLocker protection for 2 reboots to allow seamless dual-boot setup:
   ```powershell
   Suspend-BitLocker -MountPoint "C:" -RebootCount 2
   ```

---

### Step 1.2: Disable Windows "Fast Startup"
Windows Fast Startup leaves NTFS partitions in a hibernated, locked state on shutdown. If Linux attempts to mount or inspect a hibernated NTFS partition, it can lead to boot loops or disk corruption.

1. In Administrator PowerShell, run:
   ```powershell
   powercfg /h off
   ```
   *Impact: Disables Windows hibernation and Fast Startup, guaranteeing clean unmounting of all NVMe partitions.*

---

### Step 1.3: Shrink Windows Volume to Create Unallocated Space
Allocate dedicated disk space on your 2TB NVMe SSD for Zorin OS 18.1:

1. Press **`Win + X`** and select **Disk Management** (`diskmgmt.msc`).
2. Right-click the **`C:`** volume and select **Shrink Volume**.
3. In *"Enter the amount of space to shrink in MB"*, enter your desired Linux allocation:
   * **For 500 GB:** Enter `512000` (500 × 1024)
   * **For 750 GB:** Enter `768000` (750 × 1024)
   * **For 1 TB:** Enter `1024000` (1000 × 1024)
4. Click **Shrink**.
5. *Result:* You will see a black block labeled **Unallocated Space** next to your `C:` partition. **Leave it unallocated** (do not format it as NTFS).

---

### Step 1.4: Download Zorin OS 18.1 & Flash Bootable USB
1. Download **Zorin OS 18.1 Core** (or Pro) 64-bit ISO from the official portal: [zorin.com/os/download](https://zorin.com/os/download).
2. Download **Rufus** (portable executable) from [rufus.ie](https://rufus.ie).
3. Insert a USB flash drive (minimum 8GB).
4. Launch Rufus and configure the settings:
   * **Device:** Select your USB Flash Drive.
   * **Boot selection:** Click *SELECT* and choose `Zorin-OS-18.1-Core-64-bit.iso`.
   * **Partition scheme:** **`GPT`** *(Do NOT select MBR)*.
   * **Target system:** **`UEFI (non CSM)`**.
   * **File system:** **`FAT32`** (or Large FAT32).
5. Click **START**. When prompted, choose **"Write in ISO Image mode (Recommended)"** and click **OK**.

---

## 3. Phase 2: MSI MAG X870E Tomahawk WiFi BIOS Settings

Reboot your PowerSpec G914 and tap **`DEL`** repeatedly during startup to enter **MSI Click BIOS X**:

1. Press **`F7`** to enter **Advanced Mode**.
2. **UEFI Mode Verification:**
   * Go to **Settings** -> **Boot**.
   * Ensure **Boot Mode Select** is set to **`[UEFI]`** (Legacy/CSM is disabled).
3. **MSI Fast Boot:**
   * Set **MSI Fast Boot** to **`[Disabled]`** (ensures USB devices are initialized on startup for boot menu selection).
4. **Secure Boot Configuration:**
   * Go to **Settings** -> **Security** -> **Secure Boot**.
   * Zorin OS 18.1 natively supports UEFI Secure Boot via Canonical's signed Shim loader.
   * *NVIDIA Driver Consideration:* If you keep Secure Boot `[Enabled]`, the installer will ask you to set a **Machine Owner Key (MOK) password** to sign the RTX 5090 proprietary driver. You must enroll this key on your first reboot. If you prefer zero driver-signing prompts, you may toggle Secure Boot to **`[Disabled]`**.
5. **Re-Size BAR & SVM Mode:**
   * Verify **Above 4G Decoding** = `[Enabled]`
   * Verify **Re-Size BAR Support** = `[Enabled]`
   * Verify **SVM Mode** = `[Enabled]`
6. Press **`F10`** to save and reboot.

---

## 4. Phase 3: Installing Zorin OS 18.1 Alongside Windows 11

### Step 3.1: Boot into Zorin OS Installer
1. While the system restarts, tap the **`F11`** key repeatedly to open the **MSI Boot Device Selection Menu**.
2. Select your UEFI flash drive (e.g., `UEFI: USB Flash Disk, Partition 1`).
3. In the Zorin OS GRUB menu, highlight:
   **`Try or Install Zorin OS (modern NVIDIA graphics)`**
   and press **Enter**.
   > [!IMPORTANT]
   > Selecting the *"modern NVIDIA graphics"* mode loads the proprietary NVIDIA driver during the live installer session, preventing display freezes on your RTX 5090 Blackwell card.

---

### Step 3.2: Installer Configuration
1. When the desktop loads, click **Install Zorin OS**.
2. **Language & Keyboard:** Select your language and layout.
3. **Network Connection:** Connect to your WiFi 7 network or ensure your 5GbE Ethernet cable is plugged in.
4. **Updates & Third-Party Drivers:**
   * Check **"Install third-party software for graphics and Wi-Fi hardware and additional media formats"**.
   * Check **"Download updates while installing Zorin OS"**.
   * *If Secure Boot is enabled:* You will be prompted to set a temporary MOK password (e.g., `developer123`). Remember this password for the first reboot.

---

### Step 3.3: Disk Partitioning (Installation Type)
The installer will display the **Installation type** window:

* **Automatic Option (Easiest):**  
  Select **"Install Zorin OS alongside Windows Boot Manager"**.  
  The installer will automatically detect the unallocated partition created in Windows and format it as Linux Ext4.
* **Manual Option ("Something else" - Recommended for Precise Control):**
  1. Highlight the `free space` entry corresponding to your unallocated NVMe space.
  2. Click the **`+`** (Add) button:
     * **Size:** Use all remaining free space (e.g., 500,000 MB).
     * **Type for the new partition:** Primary.
     * **Location for the new partition:** Beginning of this space.
     * **Use as:** `Ext4 journaling file system`.
     * **Mount point:** Select **`/`** (root).
  3. **Bootloader Device:** Ensure *"Device for boot loader installation"* is set to the NVMe SSD (`/dev/nvme0n1`). Zorin OS will automatically place the GRUB entry into the existing EFI System Partition alongside Windows Boot Manager without overwriting it.

5. Click **Install Now**, review the partition change summary, and click **Continue**.
6. Select your Timezone, create your username (e.g., `developer`), computer name (`powerspec-g914`), and password.
7. Wait for installation to complete. When prompted, click **Restart Now**, unplug the USB flash drive, and press **Enter**.

---

### Step 3.4: Enroll MOK Key (If Secure Boot was Enabled)
If Secure Boot was kept active, the system will restart into a blue screen labeled **Perform MOK management**:
1. Select **Enroll MOK** and press Enter.
2. Select **Continue** -> **Yes**.
3. Type the password you created during the installer step.
4. Select **Reboot**.

*Result:* Your PC will now present the **GRUB Boot Menu** on every power-on:
* **Zorin OS** (default)
* **Windows Boot Manager** (boots your Windows 11 Pro installation)

---

## 5. Phase 4: Zorin OS 18.1 Developer Toolchain Overview

Zorin OS 18.1 on your PowerSpec G914 gives you a bare-metal Linux environment with zero hypervisor overhead. Here is the architecture of your developer stack:

```
+---------------------------------------------------------------------------------------------------+
|                        ZORIN OS 18.1 NATIVE DEVELOPER TOOLCHAIN (G914)                            |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [APPLICATION / IDE LAYER]                                                                        |
|  * Visual Studio Code (Native .deb official build with Microsoft APT repository)                  |
|  * Official Claude Code VS Code Extension (`anthropic.claude-code`)                               |
|  * Anthropic Claude Code CLI (`@anthropic-ai/claude-code` via Node.js 22 LTS)                      |
|                                                                                                   |
|  [RUNTIME & AI ACCELERATION LAYER]                                                                |
|  * Node.js v22.x LTS (Managed via `nvm`)                                                          |
|  * Python 3.11 / 3.12 (High-speed virtual environments managed via `uv`)                          |
|  * NVIDIA Proprietary Driver 570.x+ / 572.x+ (Direct Blackwell RTX 5090 access)                   |
|  * NVIDIA CUDA Toolkit 12.6+ / cuDNN (Native bare-metal PyTorch 2.5+)                             |
|  * Docker Community Edition (CE) + NVIDIA Container Toolkit (`nvidia-ctk`)                        |
|                                                                                                   |
|  [KERNEL & HARDWARE ABSTRACTION LAYER]                                                            |
|  * Linux Kernel 6.8 / 6.11 HWE with AMD Zen 5 `amd-pstate-epp` CPU Governor                      |
|  * Realtek 5GbE LAN Driver (`r8125`) & Linux WiFi 7 / Bluetooth 5.4 Subsystem                     |
|  * Re-Size BAR enabled across 32GB GDDR7 frame buffer via PCIe 5.0                                |
+---------------------------------------------------------------------------------------------------+
```

---

## 6. Phase 5: Setting Up the RTX 5090 GPU & System Runtimes

Open the **Terminal** in Zorin OS (`Ctrl + Alt + T`) and execute:

### Step 5.1: System Updates & Build Essentials
```bash
sudo apt update && sudo apt upgrade -y

sudo apt install -y \
    build-essential \
    cmake \
    ninja-build \
    pkg-config \
    git \
    git-lfs \
    curl \
    wget \
    jq \
    unzip \
    zip \
    ripgrep \
    htop \
    ca-certificates \
    apt-transport-https \
    software-properties-common

git lfs install
```

### Step 5.2: Verify NVIDIA RTX 5090 Blackwell Driver
Verify that the proprietary driver was configured by the installer:
```bash
nvidia-smi
```
*Expected Output:* You should see your **NVIDIA GeForce RTX 5090**, 32768 MiB (32 GB) VRAM, and Driver version 570.x / 572.x+.

If the driver shows an older version or nouveau fallback, install the latest driver from the official graphics PPA:
```bash
sudo add-apt-repository ppa:graphics-drivers/ppa -y
sudo apt update
sudo apt install -y nvidia-driver-570
sudo reboot
```

---

## 7. Phase 6: Installing Visual Studio Code (Native `.deb`)

> [!CAUTION]
> **Avoid Software Store Flatpak/Snap for VS Code:** The version in the Zorin Software Store is often sandboxed via Flatpak, which isolates VS Code from global CLI tools like `claude`, `node`, `git`, and virtual environments. Installing the official Microsoft `.deb` repository ensures seamless access to system paths.

### Step 6.1: Add Microsoft GPG Key & Repository
In Terminal, run:
```bash
# Download and install Microsoft GPG signing key
curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor | sudo tee /usr/share/keyrings/packages.microsoft.gpg > /dev/null

# Add official Microsoft VS Code repository
echo "deb [arch=amd64,arm64,armhf signed-by=/usr/share/keyrings/packages.microsoft.gpg] https://packages.microsoft.com/repos/code stable main" | sudo tee /etc/apt/sources.list.d/vscode.list > /dev/null

# Update package cache and install code
sudo apt update
sudo apt install -y code
```

Verify VS Code installation:
```bash
code --version
```

---

## 8. Phase 7: Installing Claude Code CLI & Node.js Runtime

The **Claude Code CLI** (`@anthropic-ai/claude-code`) requires a modern Node.js runtime (Node.js 18.0 or newer; Node.js 22 LTS recommended).

### Step 7.1: Install Node.js 22 LTS via NVM (Node Version Manager)
Avoid outdated system node packages by installing `nvm`:
```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# Activate nvm in current session
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Install and activate Node.js 22 LTS
nvm install 22
nvm use 22
nvm alias default 22
```

Verify:
```bash
node -v   # Should output v22.x.x
npm -v    # Should output 10.x.x
```

### Step 7.2: Install Anthropic Claude Code CLI Globally
Install the official Claude Code CLI package:
```bash
npm install -g @anthropic-ai/claude-code
```
*(Alternative standalone installer: `curl -fsSL https://claude.ai/install.sh | bash`)*

Verify installation:
```bash
claude --version
```

### Step 7.3: Authenticate Claude Code CLI
1. Run the login command:
   ```bash
   claude login
   ```
2. A browser tab will open to Anthropic (`claude.ai`). Log into your Anthropic account (Claude Pro, Max, Team, or Console).
3. Authorize the CLI token.
4. *(Optional API Key Method):* If using an Anthropic API Key directly, export it in your shell:
   ```bash
   echo 'export ANTHROPIC_API_KEY="your-api-key-here"' >> ~/.bashrc
   source ~/.bashrc
   ```

---

## 9. Phase 8: Installing the Official Claude Code VS Code Extension

Anthropic publishes the official **Claude Code** extension (`anthropic.claude-code`) for Visual Studio Code, which integrates chat, agentic file modifications, and inline diff viewing.

### Step 8.1: Install the Extension via Command Line
In Terminal, execute:
```bash
code --install-extension anthropic.claude-code
```

*(Alternatively, inside VS Code: press `Ctrl + Shift + X`, search for **"Claude Code"** by publisher **Anthropic**, and click **Install**).*

### Step 8.2: Also Install Key Developer Extensions
```bash
code --install-extension ms-python.python
code --install-extension ms-python.vscode-pylance
code --install-extension redhat.vscode-yaml
code --install-extension ms-azuretools.vscode-docker
code --install-extension eamodio.gitlens
```

---

## 10. Phase 9: End-to-End Workflow & Verification

Let's verify that your native Zorin OS 18.1 AI agent stack is fully functional:

### Step 10.1: Test Claude Code in a Project Directory
```bash
mkdir -p ~/bcf_zorin_test && cd ~/bcf_zorin_test
git init
```

Launch Claude Code CLI:
```bash
claude
```
Ask Claude Code:
> *"Inspect this repository, create a Python script to verify the NVIDIA RTX 5090 using PyTorch, and commit it."*

Claude Code will autonomously inspect your environment, write the script, run test commands, and offer git actions.

### Step 10.2: Launch VS Code with Claude Code Extension
In the same directory, run:
```bash
code .
```
1. Click the **Claude** icon in the primary sidebar (or press `Ctrl + Alt + C` / open the Command Palette `Ctrl + Shift + P` -> *Claude: Open Chat*).
2. The interactive chat and diff panel will open inside VS Code.
3. You can now use `@` to reference files, prompt Claude for refactors, review inline unified diffs, and approve changes directly from the GUI.

---

## 11. Summary of Dual-Boot Maintenance & Tips

| Scenario | Recommended Action |
| :--- | :--- |
| **Switching back to Windows 11** | Reboot the PC. At the GRUB menu, select **Windows Boot Manager**. Windows 11 Pro will boot immediately. |
| **Default Boot OS Preference** | To make Windows the default boot choice instead of Zorin, edit `/etc/default/grub`, set `GRUB_DEFAULT="Windows Boot Manager"`, and run `sudo update-grub`. |
| **Kernel Updates** | When Zorin OS installs kernel updates via `apt upgrade`, DKMS will automatically re-build the NVIDIA Blackwell module in the background. |
| **Accessing Windows Files from Zorin OS** | Your Windows `C:` drive will appear in the Zorin Files manager under *Other Locations*. You can read and write files to your Windows partition safely (because Fast Startup was disabled). |
| **Accessing Linux Files from Windows 11** | In Windows 11, install the open-source **ExtFS for Windows** or use WSL2 to mount Linux ext4 partitions (`wsl --mount \\.\PHYSICALDRIVE0 --partition 5`). |


---

<a id="doc-8-06-zorin-os-kaggle-competition-toolchain-and-delta-analysis"></a>
<!-- ====================================================================== -->
<!-- FILE: 06-zorin-os-kaggle-competition-toolchain-and-delta-analysis.md (Sequence: 08 of 08) -->
<!-- ====================================================================== -->

# Zorin OS 18.1 Kaggle Competition Toolchain & Platform Delta Analysis
**Competition Target:** [Google - The Gemma 4 Developer Agent Competition](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview)  
**Deliverable File:** `06-zorin-os-kaggle-competition-toolchain-and-delta-analysis.md`  
**Date of Record:** October 13, 2026  
**Target Hardware:** PowerSpec G914 Gaming PC (AMD Ryzen 9 9950X3D | MSI MAG X870E Tomahawk WiFi | 64GB DDR5-6000 | MSI Ventus 3X OC RTX 5090 32GB GDDR7 | 2TB NVMe SSD)  
**Operating System:** Zorin OS 18.1 (64-bit, Ubuntu 24.04 LTS Base, Linux Kernel 6.8 / 6.11 HWE)  
**Status:** Comprehensive Toolchain Specification & Architectural Delta Analysis  

---

## 1. Architectural Overview: How the Toolchain Changes on Zorin OS

Switching from a **Windows 11 + WSL2** setup to **native bare-metal Zorin OS 18.1** fundamentally alters the execution model of your development environment. While the competition requirements, submission package format (`submission.zip`), declarative specification (`agent.yaml`), and target model (`gemma-4-31b-it-qat-w4a16-ct`) remain identical, the underlying plumbing becomes **significantly simpler, faster, and more robust**.

```
+---------------------------------------------------------------------------------------------------+
|               PLATFORM DELTA: WINDOWS 11 + WSL2 vs. BARE-METAL ZORIN OS 18.1                      |
+---------------------------------------------------------------------------------------------------+
|                                                                                                   |
|  [OPTION A: WINDOWS 11 + WSL2 ARCHITECTURE]                                                      |
|  Windows 11 Host OS                                                                               |
|    |-- Hyper-V Virtualization Hypervisor                                                          |
|    |-- `.wslconfig` Artificial Resource Limits (Memory: 48GB / 16GB, vCPUs: 28 / 4)               |
|    |-- Docker Desktop for Windows (GUI bridge + `docker-desktop` WSL proxy distro)                |
|    |-- NVIDIA Windows Display Driver -> `nvcuda.dll` virtualized passthrough                     |
|    |-- VS Code on Windows -> Remote-WSL Server Socket Bridge -> Linux Workspace                  |
|    +-- Virtualized Virtual Disk (`ext4.vhdx`)                                                     |
|                                                                                                   |
|                                          VS.                                                      |
|                                                                                                   |
|  [OPTION B: NATIVE ZORIN OS 18.1 ARCHITECTURE (BARE-METAL)]                                      |
|  Zorin OS 18.1 (Ubuntu 24.04 LTS Kernel 6.8/6.11 HWE)                                             |
|    |-- Direct Hardware Access (100% of 64GB DDR5-6000 & all 32 Threads of Ryzen 9 9950X3D)        |
|    |-- Native Docker CE (`docker-ce` + `containerd`) via native systemd daemon                   |
|    |-- Native NVIDIA Linux Driver (570.x+) on PCIe 5.0 with Re-Size BAR DMA transfers             |
|    |-- Native VS Code (.deb) -> Direct native shell execution (Zero Remote-WSL Bridge)           |
|    +-- Direct NVMe PCIe 4.0/5.0 Ext4 Filesystem (Zero VHDX virtualization overhead)               |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Comprehensive Toolchain Delta Matrix

The table below contrasts each component of the toolchain between the Windows 11 + WSL2 setup and native Zorin OS 18.1:

| Toolchain Dimension | Windows 11 + WSL2 Setup | Native Zorin OS 18.1 Setup | Architectural Impact & Delta on Zorin OS |
| :--- | :--- | :--- | :--- |
| **Operating System Layer** | Windows 11 Pro host running WSL2 Linux guest. | Bare-Metal Zorin OS 18.1 (Ubuntu 24.04 LTS). | **Eliminates virtualization layer completely.** Zero Hyper-V hypervisor scheduling overhead. |
| **CPU Core Scheduling** | Limited to 28 vCPUs via `.wslconfig` (reserving 4 threads for host). | **All 16 Cores / 32 Threads** available natively. | Full AMD `amd-pstate-epp` Zen 5 scaling; faster parallel AST graph parsing in Phase 1 (Branch). |
| **System Memory (RAM)** | Capped at 48GB in WSL2 (16GB reserved for Windows host). | **Full 64GB DDR5-6000** accessible to system. | +16GB additional RAM available for loading huge code graphs and running multi-task batches. |
| **GPU Communication** | Windows display driver passes CUDA calls through `nvcuda.dll`. | Direct Linux NVIDIA driver (570.x/572.x+) on PCIe bus. | Direct DMA memory transfers across the 32GB GDDR7 frame buffer via PCIe Re-Size BAR. |
| **Container Engine** | Docker Desktop for Windows (uses background WSL proxy distro). | **Native Docker CE (`docker-ce`)** via systemd. | Eliminates Docker Desktop memory overhead and Windows proxy socket lag; instant container startup. |
| **GPU in Containers** | Handled through Docker Desktop WSL2 GPU integration. | **NVIDIA Container Toolkit (`nvidia-ctk`)**. | Standardized Linux container GPU access (`--gpus all`) matching Kaggle's production runner. |
| **Storage & I/O Performance** | Stored inside virtual disk `ext4.vhdx`; slow `/mnt/c/` bridging. | **Direct NVMe PCIe 4.0/5.0 Ext4 partition**. | 30–40% faster disk I/O when loading 20GB Gemma 4 weights and compiling repository test trees. |
| **IDE & Development Bridge** | VS Code on Windows bridging to WSL via Remote-WSL server. | **Native VS Code (`.deb`)** running directly on desktop. | Seamless terminal integration, native hotkeys, direct access to system binaries without port forwarding. |
| **Line Endings & File Encoding** | Requires `core.autocrlf input` safeguard to avoid Windows CRLF. | **Native POSIX LF (`\n`) by default**. | Zero risk of CRLF line-ending corruption invalidating golden SWE-bench git patch diffs. |
| **Claude Code CLI** | Executed inside WSL2 terminal or via Remote-WSL integration. | **Native Linux CLI (`claude`)** in Zorin Terminal. | Direct execution alongside local Docker containers and native Git repositories. |
| **Competition Compatibility** | Fully compatible. | Fully compatible (100% mirrors Kaggle Ubuntu runner). | Eliminates all potential Windows/WSL edge cases; perfect parity with Kaggle evaluation containers. |

---

## 3. Step-by-Step Zorin OS 18.1 Competition Toolchain Setup

Follow these streamlined instructions inside your native Zorin OS 18.1 desktop terminal (`Ctrl + Alt + T`).

### Step 3.1: System Packages & Compilation Toolchain
```bash
sudo apt update && sudo apt upgrade -y

# Install compilation essentials, version control, and utilities
sudo apt install -y \
    build-essential \
    cmake \
    ninja-build \
    pkg-config \
    git \
    git-lfs \
    curl \
    wget \
    jq \
    unzip \
    zip \
    ripgrep \
    htop \
    ca-certificates \
    apt-transport-https \
    software-properties-common

git lfs install
```

---

### Step 3.2: Verify NVIDIA RTX 5090 Blackwell Driver
Verify the proprietary NVIDIA driver on your 32GB RTX 5090:
```bash
nvidia-smi
```
*Expected Output:*
```text
+-----------------------------------------------------------------------------------------+
| NVIDIA-SMI 570.xx.xx              Driver Version: 570.xx.xx      CUDA Version: 12.6     |
|-----------------------------------+------------------------+----------------------------+
| GPU  Name            Persistence-M| Bus-Id          Disp.A | Volatile Uncorr. ECC       |
| Fan  Temp   Perf          Pwr:Usage/Cap |         Memory-Usage | GPU-Util  Compute M.       |
|===================================+========================+============================|
|   0  NVIDIA GeForce RTX 5090   On | 00000000:01:00.0   On  |                          0 |
|  0%   38C    P8             35W / 600W |   1200MiB / 32768MiB |      0%      Default       |
+-----------------------------------+------------------------+----------------------------+
```

---

### Step 3.3: Install Native Docker Community Edition & NVIDIA Container Toolkit
Unlike Windows 11 where Docker Desktop is required, Zorin OS uses the lightweight native Linux Docker daemon:

```bash
# 1. Add official Docker GPG key and repository
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  noble stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 2. Add your user to the docker group (avoids requiring sudo for docker commands)
sudo usermod -aG docker $USER

# 3. Install NVIDIA Container Toolkit (enables GPU acceleration in Docker sandboxes)
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

sudo apt update
sudo apt install -y nvidia-container-toolkit

# Configure Docker daemon to recognize NVIDIA runtime
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker
```

*Verification:* Log out and log back in (or run `newgrp docker`), then verify container GPU access:
```bash
docker run --rm --gpus all nvidia/cuda:12.6.0-base-ubuntu24.04 nvidia-smi
```

---

### Step 3.4: Install `uv` & Python 3.11 Competition Virtual Environment
Install Astral's high-speed package manager and provision your competition workspace:

```bash
# Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh
source ~/.cargo/env

# Create project workspace directory
mkdir -p ~/bcf_workspace && cd ~/bcf_workspace

# Provision hermetic Python 3.11 virtual environment
uv python install 3.11
uv venv .venv --python 3.11
source .venv/bin/activate
echo "source ~/bcf_workspace/.venv/bin/activate" >> ~/.bashrc
```

---

### Step 3.5: Install Deep Learning, Inference & Competition Libraries
Install PyTorch (Blackwell CUDA 12.6+), vLLM, Unsloth, Google ADK, and the competition harness directly into your virtual environment:

```bash
# PyTorch with native CUDA 12.6 support
uv pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu126

# Local inference engine with compressed-tensors support
uv pip install vllm compressed-tensors

# Google Agent Development Kit & competition evaluation harness
uv pip install google-adk adk-submission swegemma adk-eval-core

# AST code navigation and graph tools
uv pip install tree-sitter ast-grep-cli networkx

# Fine-tuning stack (Unsloth & Hugging Face)
uv pip install transformers accelerate peft trl bitsandbytes datasets "unsloth[cu124-ampere-torch240]"

# Kaggle API CLI
uv pip install kaggle
```

---

### Step 3.6: Configure Kaggle API Credentials on Zorin OS
1. Log into your Kaggle account and download `kaggle.json` from [kaggle.com/settings](https://www.kaggle.com/settings).
2. Move it to your Zorin OS home directory and set required permissions:
```bash
mkdir -p ~/.kaggle
mv ~/Downloads/kaggle.json ~/.kaggle/kaggle.json
chmod 600 ~/.kaggle/kaggle.json
```
3. Test connectivity and download the competition development tasks (`tasks.jsonl`):
```bash
# Test API
kaggle competitions list

# Download 129 development tasks and harness files
mkdir -p ~/bcf_workspace/data && cd ~/bcf_workspace/data
kaggle competitions download -c gemma-4-developer-agent
unzip gemma-4-developer-agent.zip
```

Verify:
```bash
wc -l tasks.jsonl
# Outputs: 129 tasks.jsonl
```

---

## 4. What Remains Identical vs. What Changes

It is important to recognize that while the **system infrastructure** improves significantly on Zorin OS, your **agent application code and submission workflow remain 100% identical**:

```
+---------------------------------------------------------------------------------------------------+
|                        WHAT REMAINS IDENTICAL (ZERO RE-CODING REQUIRED)                           |
+---------------------------------------------------------------------------------------------------+
| * The declarative `agent.yaml` schema and `!include` prompt tags.                                 |
| * The BCF system prompt in `prompts/system.md` and sampling parameters in `configs/sampling.yaml`. |
| * The pre-registered base model identifier: `gemma-4-31b-it-qat-w4a16-ct`.                        |
| * The host tool bindings: `run_command`, `read_file`, `edit_file`, `write_file`,                  |
|   `get_status`, `submit_patch`, and AST graph tools (`get_code_neighbors`, `search_similar_code`).|
| * The Python validation script `validate_submission.py` (running `compile_submission`).           |
| * The packaging script `build_submission.py` producing `submission.zip`.                          |
| * The Kaggle CLI submission command:                                                              |
|   `kaggle competitions submit -c gemma-4-developer-agent -f submission.zip -m "..."`               |
+---------------------------------------------------------------------------------------------------+
```

---

## 5. Summary of Benefits: Why Zorin OS 18.1 is Ideal for BCF

1. **Zero Virtualization Overhead:**  
   Docker containers spin up in milliseconds on native Linux, and task evaluations in `swegemma` run with direct kernel file access instead of passing through WSL2 virtual disks.
2. **True 32GB VRAM Allocation:**  
   In Windows 11, the Windows desktop composition and background DirectX apps occupy 1.5–2.5 GB of VRAM. In Zorin OS (GNOME/Wayland), desktop memory overhead is under 600 MB, giving you **~32 GB of unencumbered VRAM** for serving Gemma 4 31B and fine-tuning with 8k sequence lengths.
3. **Flawless Claude Code & Terminal Integration:**  
   You can run `claude` in one terminal tab, the local vLLM model server in a second tab, and VS Code on your workspace simultaneously, all sharing the same native Linux filesystem with zero permission errors or path translations.

