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
| **Subsystem**| **`uv` Package Manager** | >= 0.4.0 | `curl -LsSf https://astral.sh/uv/install.sh \| sh` | `uv --version` | Ultra-fast Python package resolution and venvs. |
| **Subsystem**| **Python Runtime** | 3.11.x | `uv python install 3.11` | `python3 --version` | Standard Python runtime for ADK and PyTorch. |
| **Subsystem**| **PyTorch (CUDA 12.6+)**| >= 2.4.0 | `uv pip install torch --index-url ...` | `python3 -c "import torch; print(torch.cuda.is_available())"` | Utilizes 32GB VRAM on RTX 5090 Blackwell GPU. |
| **Subsystem**| **vLLM** | >= 0.6.0 | `uv pip install vllm compressed-tensors` | `vllm --version` | Local serving of `gemma-4-31b-it-qat-w4a16-ct`. |
| **Subsystem**| **Unsloth** | Latest | `uv pip install "unsloth[cu124-ampere-torch240]"` | `python3 -c "import unsloth"` | Fast on-device LoRA post-training for Gemma 4. |
| **Subsystem**| **Hugging Face Stack** | Latest | `uv pip install transformers peft trl` | `python3 -c "import transformers, peft"` | Model weights, tokenizer, and PEFT adapter handling. |
| **Subsystem**| **Google ADK** | Latest | `uv pip install google-adk` | `adk --help` | Official Google Agent Development Kit framework. |
| **Subsystem**| **`swegemma` Harness** | Competition ver. | `uv pip install swegemma adk-submission` | `python3 -c "import swegemma, adk_submission"` | Sandboxed task evaluation & `agent.yaml` compiler. |
| **Subsystem**| **AST Analysis Tools** | Latest | `uv pip install tree-sitter ast-grep-cli` | `ast-grep --version` | Code graph neighborhood and semantic AST retrieval. |
| **Subsystem**| **Kaggle CLI** | >= 1.6.0 | `uv pip install kaggle` | `kaggle --version` | Competition dataset download and zip submission. |
