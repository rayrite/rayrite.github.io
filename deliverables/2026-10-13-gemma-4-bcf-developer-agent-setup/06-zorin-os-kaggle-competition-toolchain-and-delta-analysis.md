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
