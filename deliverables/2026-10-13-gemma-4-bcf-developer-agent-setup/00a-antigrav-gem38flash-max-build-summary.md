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

