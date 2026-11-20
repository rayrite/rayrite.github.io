# Task 3: Feature Parity Implementation Plan — PowerSpec G914 (RTX 5090) Mimicking Kaggle 4x L4 Remote Scorer (Track A: Windows 11 + WSL2 & Track B: Zorin OS 18 Linux)

*Research scope: Hardware- and software-grounded engineering blueprint to configure your **PowerSpec G914** workstation (AMD Ryzen 9 9950X3D, MSI MAG X870E TOMAHAWK WIFI, 64 GB DDR5-6000, NVIDIA GeForce RTX 5090 32 GB GDDR7 `sm_120`, 2 TB NVMe) for maximum feature parity with Kaggle's remote **4x NVIDIA L4** scoring stack (`Python 3.12` host wheelhouse v31 + `Python 3.13-slim` Docker sandbox), delivered as two complete implementation tracks: **Track A (Windows 11 Pro + WSL2 Ubuntu 24.04 LTS)** and **Track B (Zorin OS 18 / 18.1 Bare-Metal Linux)**.*

*As of: **2026-11-20** | Grounded In: PowerSpec G914 & MSI MAG X870E official specs, Zorin OS 18 / 18.1 release specs, NVIDIA Blackwell `sm_120` Linux/WSL2 open-driver & CUDA 12.8 docs, Docker Engine + NVIDIA Container Toolkit docs, `HARNESS_README.md`, `Kaggle-03-GettingStarted.md`, `03_Local_Eval_Change_Sheet_Finding6.md` (`C1–C4`), `gemma4-swe-kit`, and `06_Setup_Guide_WSL2_Swegemma_RTX5090.md`.*

---

## Executive Summary

Achieving trustworthy local-to-Kaggle parity on the **PowerSpec G914 (RTX 5090)** requires matching **eight distinct software layers**—not just running Gemma 4 locally. Using Ollama or LM Studio destroys parity because chat templates, tool parsers, thinking-budget enforcement, 32,768-token HTTP 400 overflow handling, and ADK 14,336-token compaction diverge silently from Kaggle's exact stack (`swegemma 0.2.11`, `adk-submission 0.2.13`, `google-adk 1.36.1`, `vllm 0.19.1`, `torch 2.10.0+cu128`, `transformers 5.13.1`, Python 3.12 host + `python:3.13-slim` Docker sandbox). **Both Track A (Windows 11 + WSL2) and Track B (Zorin OS 18.1)** run on **Ubuntu 24.04 LTS** underneath, meaning the entire Python/Docker/wheelhouse/sandbox software recipe is identical once OS/GPU plumbing is done—but the two tracks differ sharply in driver/kernel setup and operational risk: **Track A (WSL2)** is fastest to stand up today (**~90 minutes**, zero partitioning risk, keeps Windows desktop/tools intact, requires Windows NVIDIA R570+ driver + WSL `>= 2.7.0` and *never* installing a Linux driver inside WSL), whereas **Track B (Zorin OS 18.1)** removes WSL2's `dxgkrnl` VRAM/CUDA-graph overhead and `.wslconfig` 48 GB RAM ceiling (unlocking all 64 GB RAM, bare-metal NVMe I/O, and iGPU display offload to free 100% of RTX 5090's 32 GB VRAM), **provided** you explicitly install **Zorin OS 18.1 (Kernel 6.17)** and **NVIDIA R570+ open kernel modules (`nvidia-open`)** so Blackwell `sm_120`, Realtek RTL8126 5GbE, and Qualcomm QCNCM865 Wi-Fi 7 all initialize cleanly. With **12.5 days left** before December 2, **Track A is recommended immediately for Day 1 execution**, while Track B is ideal if installing onto a dedicated second M.2 NVMe SSD without risking your working Windows environment.

---

## 1. Exact Scorer-to-Local Feature Parity Blueprint (What Must Match 1:1)

Before picking an OS track, lock in the exact parity specification between Kaggle's hidden 4x L4 scorer and your PowerSpec G914:

| Layer | Remote Kaggle 4x L4 Scorer (Ground Truth) | Exact Local G914 Parity Target | Parity Achievable? | How to Bridge Residual Hardware Gap |
| :--- | :--- | :--- | :---: | :--- |
| **Host Python & Wheelhouse** | Python **3.12** (`cp312`): `swegemma==0.2.11`, `adk-submission==0.2.13`, `google-adk==1.36.1`, `vllm==0.19.1`, `torch==2.10.0+cu128`, `transformers==5.13.1` (`#758289`, `#760140`) | Exact same wheelhouse v31 in Python 3.12 venv (`~/g4/.venv`), skipping `*cutlass*` & renaming `cu128 -> +cu128` (`30_install_wheelhouse.sh`). | **100%** (or 99% if `sm_120` needs vLLM source rebuild) | If `vllm 0.19.1` hits `no kernel image` on `sm_120`, run inference in `.venv-vllm-5090` (built with `TORCH_CUDA_ARCH_LIST="12.0"` + `use_existing_torch.py`) while running `swegemma` + `adk-submission 0.2.13` in `.venv` AND fuzzing wheelhouse v31's exact `gemma4_tool_parser.py` via `g4kit-assets`! |
| **Chat Template & Parsers** | Original Gemma 4 template (`hf rev e3dacad5...`, NOT July refresh!), `--tool-call-parser gemma4 --reasoning-parser gemma4 --enable-auto-tool-choice`, `default_chat_template_kwargs={"enable_thinking": True}` | Exact same `google/gemma-4-31b-it-qat-w4a16-ct` (v2) & `gemma-4-e4b-it-qat-w4a16-ct` (v2) weights from Kaggle Models + `VllmServer` flags. | **100%** | Verify template SHA (`94899c0f...`) via `g4kit-assets check`; **never** serve through Ollama/LM Studio directly (`gemma4-swe-kit` README). |
| **Thinking Budget & `reasoning` Patch** | `VllmServer` emits `--reasoning-config` & `--no-scheduler-reserve-full-isl` (`C1`, `#744807`, `#745059`); `adk-submission 0.2.13` mirrors `reasoning_content -> reasoning` (`#744354`). | Copy exact `VllmServer.build_cmd()` flags into `vllm_cmd.txt` + run 64-token `thinking_token_budget` preflight HTTP check before every sweep (`C1`). | **100%** | Abort immediately on HTTP 400 so `thinking_budget` never silently fails. |
| **Context Limit, Compaction & Cache** | `max_model_len=32768` (HTTP 400 if `prompt + max_output_tokens > 32768`); `EventsCompactionConfig(token_threshold=14336, overlap_size=2, event_retention_size=5, compaction_interval=5 or 15)`; `ContextCacheConfig(min_tokens=2048, ttl_seconds=1800, cache_intervals=10)` | Pass identical `EventsCompactionConfig` & `ContextCacheConfig` in `40_local_eval.py` / `g4kit-harness run` (remember: bare `swegemma eval` CLI leaves compaction **OFF**!). | **100%** | Test both `compaction_interval=5` (README) and `15` (Getting Started) — `15` is stricter for HTTP 400 overflow stress-testing! |
| **Sandbox Runtime & Isolation** | Docker `swebench-sandbox:latest` (`FROM python:3.13-slim`, `imp.py`, `telnetlib.py`, `network_mode="none"`, `4g` RAM, `2 vCPU`, `TEST_TMPDIR=/tmp`) | Exact `docker build -f docker/Dockerfile.public -t swebench-sandbox:latest` with `--sandbox docker` + `C2/C3/C4` wheel/pin parity repair! | **100%** | **Never** rely on `--sandbox subprocess` for final scoring parity—subprocess runs Python 3.12 with no `4g`/network isolation! |
| **Phase 2 Grader (`verify_task`)** | `PYTHONSAFEPATH=1 PYTHONNOUSERSITE=1 python3 -s -m pytest ... --junitxml=... -p no:anyio -o timeout=0 -o python_classes="Test* *Test" -q` + `_validate_junit_xml` + protected-path reset | Executed identically by `swegemma.evaluate.Evaluator` inside Container B (`--sandbox docker`). | **100%** | Add `C2` tiered wheels (`annotated-doc`, `h11`, `inline-snapshot`, `dirty-equals`, `typing-inspection`) + `C3` constraint-aware `setup_local.py` + `C4` Pygments 2.17.2 so local public-set gold rate rises from ~52/129 to ~115–127/129! |
| **GPU Topology & Speed** | `4x L4` (`TP=4`, `96 GB` VRAM, PCIe Gen4, `~17.25 tok/s` on 31B, `enable_lora=True, max_loras=8, max_lora_rank=128`) | `1x RTX 5090` (`TP=1`, `32 GB` VRAM, `1,792 GB/s`, `~50–65 tok/s` on 31B, `enable_lora=bool(adapters)`) | **Hardware-Asymmetric** | Bridge via **local cap scaling** (`cap_local = cap_kaggle / k`, `k ≈ 1.6–1.8`), **`project_12h.py`**, **`g4kit-scorer-time`**, and a **30-minute free Kaggle 4x L4 calibration notebook** (5 tasks) to measure exact empirical `k`! |
| **Model Name Alias Routing** | Served under exact alias `gemma-4-31b-it-qat-w4a16-ct` (or `gemma-4-e4b-it-qat-w4a16-ct`) | Serve under exact string (`gemma-4-...`, NOT `gemma4`, which alters ADK tool-result role per `gemma4-swe-kit`!) | **100%** | Verify via `g4kit-fake-llm` before GPU runs. |

---

## 2. Hardware-Specific Checklist for Your PowerSpec G914

Verified specifications of the **PowerSpec G914** ([Micro Center Specs](https://www.microcenter.com/)) and the exact BIOS/hardware tweaks needed for **both** Track A and Track B:

| PowerSpec G914 Component | Exact Hardware | Parity / Linux / WSL2 Gotcha | Required Action |
| :--- | :--- | :--- | :--- |
| **CPU & iGPU** | **AMD Ryzen 9 9950X3D** (16C/32T, 128 MB L3, integrated **Radeon Graphics**) | Integrated Radeon iGPU can drive your desktop monitor(s) while freeing **100% of RTX 5090's 32 GB VRAM** (`~0.8–1.8 GB` desktop compositor savings = extra KV cache for `concurrency=3` on 31B!). | In MSI BIOS -> *Integrated Graphics Configuration* -> set `IGD Multi-Monitor = Enabled` and plug monitor into motherboard HDMI/DP (optional high-VRAM pro tip!). |
| **Motherboard & BIOS** | **MSI MAG X870E TOMAHAWK WIFI** (AM5, PCIe 5.0) | Track A needs **SVM Mode** (AMD virtualization) for WSL2; Track B needs **Secure Boot** disabled (or MOK enrolled) and **Fast Boot** off for dual-boot GRUB. | Enter MSI BIOS (`Del`): enable **SVM Mode** (`OC -> Advanced CPU Configuration`) and **Above 4G Decoding / Re-Size BAR Support** (`Settings -> Advanced -> PCIe`). |
| **GPU** | **NVIDIA GeForce RTX 5090 32 GB GDDR7** (Blackwell GB202, **`sm_120`**) | Requires **NVIDIA Driver R570+** and **CUDA 12.8 (`cu128`)** minimum. On Linux (Track B), Blackwell **ONLY works with NVIDIA Open Kernel Modules (`nvidia-open`)**—closed proprietary modules fail with `No such device`! | Track A: install latest Windows Studio/Game Ready R570+ driver (never install Linux driver in WSL!). Track B: install `nvidia-driver-570-open` (or newer `-open` branch). |
| **Networking (X870E)** | **Realtek RTL8126 5GbE LAN** + **Qualcomm QCNCM865 Wi-Fi 7 (`ath12k`)** | Stock Ubuntu 24.04 Kernel 6.8 lacks native drivers for both chips! Requires **Kernel >= 6.12** (`r8169`/RTL8126 + `ath12k`) + updated `linux-firmware`. | Track A: handled by Windows 11 host automatically. Track B: download **Zorin OS 18.1** (**Kernel 6.17**!) + keep phone USB tethering ready as fallback to run `apt install linux-firmware realtek-r8126-dkms`. |
| **RAM & Storage** | **64 GB DDR5-6000** + **2 TB NVMe SSD** (plus empty PCIe 5.0/4.0 M.2 slots!) | WSL2 defaults to capping RAM at 50% (32 GB)—too tight for `31B` weight staging + Docker + `tmpfs`. Storing repos on `/mnt/d` hits 9P (`10–20x` slower). | Track A: set `memory=48GB` in `.wslconfig` and keep all data under `~/g4` (`ext4`). Track B: native 64 GB RAM + install Zorin OS 18.1 on a **separate 1–2 TB M.2 NVMe** to keep Windows untouched! |

---

## 3. Track A: Windows 11 Pro + WSL2 (Ubuntu 24.04 LTS) Implementation Plan

*Best when: You want full scorer-parity local evaluation running **today (~90 minutes)** with zero disk-repartitioning risk while keeping Windows 11 tools, Antigravity IDE, and browsers seamlessly available.*

### Phase A1 — Windows 11 Host Preparation (Admin PowerShell)

1. **BIOS & Windows Driver:** Confirm Virtualization (`SVM Mode`) is Enabled in Task Manager -> Performance -> CPU. Install the latest **Windows NVIDIA Driver (`>= 570.xx`, CUDA `>= 12.8`)**. **Critical Rule:** *Never* install a Linux NVIDIA driver inside WSL2—WSL uses Windows' `dxgkrnl` paravirtualized GPU driver automatically ([NVIDIA CUDA on WSL](https://docs.nvidia.com/cuda/wsl-user-guide/index.html)).
2. **Update WSL to `>= 2.7.0` & Install Ubuntu 24.04:** Modern WSL builds (`>= 2.7.0`) include critical Blackwell `sm_120` CUDA-graph capture fixes (preventing `cudaErrorUnknown` during vLLM graph capture!).
   ```powershell
   wsl --update
   wsl --version
   wsl --install -d Ubuntu-24.04
   ```
3. **Configure `C:\Users\<YourUser>\.wslconfig`** (allocates 48 GB RAM, 24 threads, 32 GB swap, and mirrored networking):
   ```ini
   [wsl2]
   memory=48GB
   processors=24
   swap=32GB
   localhostForwarding=true
   ```
   Apply immediately: `wsl --shutdown` (then launch Ubuntu 24.04).
4. **Optional VRAM-Maximization Tip (Windows):** Plug your primary monitor into the MSI X870E motherboard HDMI/DisplayPort (AMD Ryzen 9950X3D Radeon iGPU) so Windows DWM (`dwm.exe`) uses `0 MB` of your RTX 5090's 32 GB VRAM!

### Phase A2 — Ubuntu 24.04 Bootstrap Inside WSL2 (`ext4` Native Disk Only!)

```bash
# 1. Verify GPU passthrough (MUST show RTX 5090, Driver >= 570, CUDA >= 12.8)
nvidia-smi

# 2. System tools + uv + Python 3.12 (host scorer) & Python 3.13 (sandbox)
sudo apt-get update && sudo apt-get install -y \
  build-essential git patch pigz unzip curl ca-certificates jq protobuf-compiler tmux htop
curl -LsSf https://astral.sh/uv/install.sh | sh
export PATH="$HOME/.local/bin:$PATH"
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
uv python install 3.12 3.13

# 3. Create native WSL2 ext4 workspace (NEVER work inside /mnt/c or /mnt/d!)
mkdir -p ~/g4/{data,wheelhouse,models,results,submissions,.vllm_cache}
git config --global user.email "agent@eval"
git config --global user.name "Agent"
git config --global init.defaultBranch main
```

### Phase A3 — Fetch Competition Assets, Wheelhouse v31 & Both Gemma 4 QAT Checkpoints

```bash
# Place kaggle.json at ~/.kaggle/kaggle.json (chmod 600)
uv tool install kaggle

# 1. Official competition wheelhouse (41 wheels: swegemma 0.2.11, adk-submission 0.2.13, vllm 0.19.1, torch 2.10.0+cu128)
kaggle datasets download -d metric/gemma-4-developer-agent-wheelhouse -p ~/g4/wheelhouse --unzip

# 2. Competition data package (FASTEST: copy 21.9 GB ZIP from your Windows/LAN path into ~/g4, then unzip on ext4!)
cp "/mnt/d/stuff/ai-misc/_bsh2026/vscode_project01/101e-Kaggle-antigrav/input/kagglecomp/kagglecomp_data_package/gemma-4-developer-agent.zip" ~/g4/
unzip -q ~/g4/gemma-4-developer-agent.zip -d ~/g4/data

# 3. Official QAT checkpoints (31B Main Track + E4B Bonus Track)
uvx --with kagglehub python -c "
import kagglehub
p31 = kagglehub.model_download('google/gemma-4/other/gemma-4-31b-it-qat-w4a16-ct/2')
pe4 = kagglehub.model_download('google/gemma-4/other/gemma-4-e4b-it-qat-w4a16-ct/2')
print('31B:', p31); print('E4B:', pe4)
"
# Symlink printed paths into ~/g4/models/gemma-4-31b-it-qat-w4a16-ct and ~/g4/models/gemma-4-e4b-it-qat-w4a16-ct
```

### Phase A4 — Exact Wheelhouse v31 Install + Blackwell `sm_120` Compatibility Gate

```bash
# Mirror Getting Started Cell 1 verbatim in Python 3.12 venv:
uv venv --python 3.12 ~/g4/.venv
source ~/g4/.venv/bin/activate
uv pip install pip

mkdir -p /tmp/whl && rm -f /tmp/whl/*
for w in ~/g4/wheelhouse/*.whl; do
  b=$(basename "$w")
  [[ "${b,,}" == *cutlass* ]] && continue
  [[ "$b" == *cu128* && "$b" != *+* ]] && b="${b/cu128/+cu128}"
  ln -sf "$w" "/tmp/whl/$b"
done
python -m pip install --no-deps --force-reinstall /tmp/whl/*.whl
python -m pip freeze > ~/g4/constraints.txt

# Fill missing Kaggle-image transitive deps while respecting wheelhouse pins:
for pass in 1 2 3 4; do
  missing=$(python -m pip check 2>/dev/null | sed -nE 's/.* requires ([^,]+), which is not installed\./\1/p' | sort -u | tr '\n' ' ')
  [[ -z "$missing" ]] && break
  python -m pip install -c ~/g4/constraints.txt $missing || python -m pip install $missing
done
python -m pip install pyyaml pandas

# CRITICAL sm_120 CUDA KERNEL SMOKE TEST:
python -c "
import torch, vllm, swegemma, adk_submission
print('GPU:', torch.cuda.get_device_name(0), 'CC:', torch.cuda.get_device_capability(0))
x = torch.randn((64, 64), device='cuda', dtype=torch.bfloat16)
print('BF16 MatMul OK:', (x @ x).sum().item())
"
```

**Blackwell `sm_120` Contingency (ONLY if `vllm 0.19.1` raises `no kernel image is available for execution on the device`):**
- Keep `~/g4/.venv` **untouched** for running `swegemma`, `adk-submission`, and `google-adk` (100% harness parity!).
- Create a **separate server-only venv** `~/g4/.venv-vllm5090` (Python 3.12), install `torch==2.10.0+cu128`, build vLLM from source (`python3 use_existing_torch.py && TORCH_CUDA_ARCH_LIST="12.0" pip install -e . --no-build-isolation`), and start it with the **exact** `--reasoning-config`, `--no-scheduler-reserve-full-isl`, `--tool-call-parser gemma4`, and `--reasoning-parser gemma4` flags printed by `VllmServer.build_cmd()` from `~/g4/.venv` (`C1` parity rule!).
- Simultaneously install `tools/gemma4-swe-kit` in `~/g4/.venv` (`g4kit-assets extract-parser ~/g4/wheelhouse/vllm-0.19.1-*.whl`) so every candidate bundle is still verified against Kaggle's exact unpatched `vllm 0.19.1` tool parser!

### Phase A5 — Native Docker Engine Inside WSL2 (NOT Docker Desktop!) + `C2/C3/C4` Sandbox Parity + `tmpfs`

1. **Install Native Docker Engine Inside WSL2** (avoids Docker Desktop's extra Hyper-V proxy & license overhead; requires `systemd=true` in `/etc/wsl.conf`, which is default on Ubuntu 24.04):
   ```bash
   curl -fsSL https://get.docker.com | sudo sh
   sudo usermod -aG docker "$USER"
   # Install NVIDIA Container Toolkit (for containerized GPU experiments/verification if needed)
   curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | \
     sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
   curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
     sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
     sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
   sudo apt-get update && sudo apt-get install -y nvidia-container-toolkit
   sudo nvidia-ctk runtime configure --runtime=docker
   sudo systemctl enable --now docker
   ```
   *(Run `wsl --shutdown` in PowerShell and reopen Ubuntu so your `docker` group membership activates!)*

2. **Apply `C2` Tiered Supplemental Wheels (With Shadow Guard!) & Build `swebench-sandbox:latest` (`Python 3.13`):**
   ```bash
   source ~/g4/.venv/bin/activate
   mkdir -p ~/g4/data/wheels_extra ~/g4/data/wheels_pygments

   # Tier A (import-critical) + Tier B (test-collection closure) for Python 3.13 Linux x86_64:
   python -m pip download --only-binary=:all: --python-version 3.13 --platform manylinux2014_x86_64 \
     -d ~/g4/data/wheels_extra \
     h11 annotated-doc typing-inspection inline-snapshot dirty-equals \
     python-multipart email-validator pyyaml pydantic-settings pydantic-extra-types \
     ujson orjson PyJWT pwdlib "uvicorn[standard]" fastapi-cli greenlet blinker trio attrs \
     pytest-httpbin trustme PySocks chardet passlib pytest-mock strawberry-graphql "pytest==8.3.5"

   # SHADOW GUARD (CRITICAL from 03_Local_Eval_Change_Sheet_Finding6.md C2!):
   # Delete any wheel from wheels_extra whose normalized package name already exists in competition wheels/
   python -c "
   import re, pathlib
   norm = lambda fn: re.sub(r'[-_.]+', '-', fn.split('-')[0]).lower()
   orig = {norm(p.name) for p in pathlib.Path.home().joinpath('g4/data/wheels').glob('*.whl')}
   for p in list(pathlib.Path.home().joinpath('g4/data/wheels_extra').glob('*.whl')):
       if norm(p.name) in orig and not p.name.startswith('pytest-8.3.5'):
           print('Shadow guard removing:', p.name); p.unlink()
   "
   cp ~/g4/data/wheels_extra/*.whl ~/g4/data/wheels/

   # C4: Separate Pygments 2.17.2 wheel for rich_3296 ANSI parity
   python -m pip download --only-binary=:all: --python-version 3.13 --platform manylinux2014_x86_64 \
     -d ~/g4/data/wheels_pygments "Pygments==2.17.2"

   # Build exact competition Python 3.13 Docker sandbox image:
   cd ~/g4/data
   cp docker/imp.py docker/telnetlib.py .
   docker build -f docker/Dockerfile.public -t swebench-sandbox:latest .
   docker run --rm --network=none --memory=4g --cpus=2 swebench-sandbox:latest \
     python3 -c "import sys, imp, telnetlib; print('Sandbox OK:', sys.version)"
   ```

3. **Mount 12 GB `tmpfs` RAM Disk** (eliminates `L3` disk churn):
   ```bash
   sudo mkdir -p /mnt/ram_sandbox
   sudo mount -t tmpfs -o size=12G,mode=1777 tmpfs /mnt/ram_sandbox
   ```

### Phase A6 — `C1` Preflight Verification & Persistent Warm Server Launch

Launch vLLM once in `tmux` with `VLLM_CACHE_ROOT=~/g4/.vllm_cache` using `VllmServer.build_cmd()` (verifying `--reasoning-config` and `--no-scheduler-reserve-full-isl` are present!), then send the **64-token `thinking_token_budget` preflight check**:
```bash
curl -s http://127.0.0.1:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gemma-4-31b-it-qat-w4a16-ct",
    "messages": [{"role": "user", "content": "Reply with OK."}],
    "max_tokens": 128,
    "thinking_token_budget": 64
  }' | jq '{id, finish_reason: .choices[0].finish_reason, reasoning_len: (.choices[0].message.reasoning // "" | length), content: .choices[0].message.content}'
```
Passing HTTP 200 with non-empty `reasoning_len` confirms **100% end-to-end inference & thinking-budget parity**!

---

## 4. Track B: Zorin OS 18 / 18.1 Bare-Metal Linux Implementation Plan

*Best when: You want **maximum bare-metal VRAM, zero `dxgkrnl`/Hyper-V overhead, all 64 GB RAM natively accessible, zero 9P risk, and fastest NVMe/Docker `overlay2` I/O**—strongly recommended on a **dedicated second M.2 NVMe SSD** (your MSI MAG X870E TOMAHAWK WIFI has multiple M.2 slots!) rather than shrinking your active Windows 11 partition 12 days before a Kaggle deadline.*

### Phase B1 — Pre-Install & BIOS Prep on PowerSpec G914

1. **Download Zorin OS 18.1 (NOT base 18.0 if avoidable!):** Zorin OS 18 is built on **Ubuntu 24.04.3 LTS** (supported to June 2029). Base 18.0 ships with **Linux Kernel 6.14**; **Zorin OS 18.1 upgrades to Linux Kernel 6.17** ([Zorin OS 18.1 Release Notes](https://blog.zorin.com/)). Kernel 6.14–6.17 is crucial because it includes native in-kernel support for both your **Realtek RTL8126 5GbE** (`>= 6.10/6.12`) and **Qualcomm QCNCM865 Wi-Fi 7 (`ath12k`, `>= 6.11`)**!
2. **Back Up Windows BitLocker Recovery Key** (Control Panel -> BitLocker) BEFORE touching UEFI settings!
3. **MSI MAG X870E BIOS Settings:**
   - Disable **Windows Fast Startup** inside Windows (`powercfg /h off`) and **Fast Boot** in MSI BIOS.
   - **Secure Boot Choice:** Either **Disable Secure Boot** (recommended for frictionless NVIDIA open-module DKMS + kernel updates) OR keep it enabled and enroll the **MOK (Machine Owner Key)** blue-screen password on first reboot after installing NVIDIA drivers.
   - Ensure **Above 4G Decoding = Enabled** and **Re-Size BAR = Enabled**.
   - **Pro Tip for 32 GB Free VRAM:** Set **IGD Multi-Monitor = Enabled** and attach your display cable to the motherboard DisplayPort/HDMI (Ryzen 9 9950X3D Radeon iGPU) so GNOME/Zorin Desktop renders on the AMD iGPU and leaves **32.0 GB / 32.0 GB** of RTX 5090 VRAM exclusively for vLLM!
4. **Installer Boot Option:** Boot the Zorin OS 18.1 USB and select **"Try or install Zorin OS (modern NVIDIA drivers)"** (if installing on a dedicated second NVMe, select that drive as target + place EFI/GRUB cleanly without overwriting Windows EFI).

### Phase B2 — PowerSpec G914 X870E Networking & Kernel Validation

If Ethernet or Wi-Fi 7 does not immediately connect on first boot (e.g., if `linux-firmware` lags behind your QCNCM865 revision), connect a smartphone via **USB Tethering** for 5 minutes and run:
```bash
# 1. Verify kernel (>= 6.14 on Zorin 18.0, >= 6.17 on Zorin 18.1)
uname -r

# 2. Update Zorin/Ubuntu 24.04 packages + latest firmware (fixes Qualcomm QCNCM865 ath12k Wi-Fi 7)
sudo apt-get update && sudo apt-get full-upgrade -y
sudo apt-get install -y linux-firmware linux-headers-$(uname -r) build-essential dkms

# 3. ONLY if Realtek RTL8126 5GbE still does not appear in `ip link`:
sudo add-apt-repository -y ppa:awesometic/ppa
sudo apt-get update && sudo apt-get install -y realtek-r8126-dkms
sudo modprobe r8126
```

### Phase B3 — Mandatory NVIDIA R570+ Open Kernel Driver (`sm_120` Blackwell!)

**CRITICAL BLACKWELL RULE ([NVIDIA Open GPU Kernel Modules](https://developer.nvidia.com/)):** The GeForce RTX 5090 (GB202) **will NOT initialize** under NVIDIA's legacy closed proprietary kernel module! You **must** install the `-open` driver branch (`>= 570.xx`, supporting CUDA `>= 12.8`):

```bash
# 1. Remove any incompatible legacy closed driver if auto-selected during install
sudo apt-get purge -y 'nvidia-*' || true

# 2. Add NVIDIA official Ubuntu 24.04 CUDA keyring (Zorin OS 18 == Ubuntu 24.04 noble!)
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2404/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt-get update

# 3. Install NVIDIA Open Kernel Driver (>= 570, CUDA 12.8+ support) + CUDA 12.8 Toolkit (for sm_120 source builds if needed)
sudo apt-get install -y nvidia-open cuda-toolkit-12-8

# 4. If Secure Boot is ON, complete MOK blue-screen enrollment on reboot!
sudo reboot
```

After reboot, verify both bare-metal driver health AND Wayland/Xorg stability:
```bash
nvidia-smi
# Expect: NVIDIA GeForce RTX 5090 | Driver Version: 570.xx+ | CUDA Version: 12.8+
cat /proc/driver/nvidia/version
# Expect: Open Kernel Module
```
*(Display server note: Zorin OS 18 supports both Wayland and Xorg via the login-screen gear icon. If driving the display on the AMD iGPU, Wayland runs cleanly with zero NVIDIA VRAM footprint; if driving on the RTX 5090 directly and any screen-sharing/IDE tool glitches, switch to "Zorin Desktop on Xorg" or enable persistence mode `sudo nvidia-smi -pm 1`.)*

### Phase B4 — Docker Engine + NVIDIA Container Toolkit + Native `tmpfs` (Ubuntu 24.04 `noble` Mapping!)

**Zorin OS 18 Gotcha:** In `/etc/os-release`, Zorin sets `ID=zorin` and `VERSION_CODENAME=noble` (or `UBUNTU_CODENAME=noble`). Some upstream APT repo scripts fail if they read `$ID` (`zorin`) instead of `ubuntu`! Always hardcode `ubuntu` + `noble` for Docker's APT repository:

```bash
# 1. Official Docker Engine repo (explicitly pin ubuntu / noble — NOT $ID!)
sudo apt-get update && sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu noble stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update && sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker "$USER"

# 2. Official NVIDIA Container Toolkit
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | \
  sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
sudo apt-get update && sudo apt-get install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl enable --now docker

# Log out and back in, then verify GPU inside Docker:
docker run --rm --gpus all nvidia/cuda:12.8.0-runtime-ubuntu24.04 nvidia-smi

# 3. Permanent 16 GB RAM-disk tmpfs (with 64 GB native RAM, 16 GB leaves 48 GB free!)
sudo mkdir -p /mnt/ram_sandbox
echo "tmpfs /mnt/ram_sandbox tmpfs rw,size=16G,mode=1777 0 0" | sudo tee -a /etc/fstab
sudo mount -a
```

### Phase B5 — Competition Stack Identical to Track A (Phases A2–A6)

Because Zorin OS 18.1 uses the exact same Ubuntu 24.04 LTS userland (`glibc 2.39`, `cp312` ABI), run the **identical** commands from **Phase A2 (uv + Python 3.12/3.13 + `~/g4`)**, **Phase A3 (Kaggle wheelhouse v31 + 21.9 GB data + 31B & E4B models)**, **Phase A4 (wheelhouse install + `sm_120` gate)**, **Phase A5 (`C2/C3/C4` supplemental wheels + `swebench-sandbox:latest` Python 3.13 image)**, and **Phase A6 (`C1` 64-token preflight)**.

*(Bonus Track B advantage: mount your Windows NTFS data drive read-only at `/mnt/win_d` to copy the 21.9 GB `gemma-4-developer-agent.zip` onto native Linux `ext4` at `>2 GB/s` in ~10 seconds without re-downloading!)*

---

## 5. Track A (Windows 11 + WSL2) vs. Track B (Zorin OS 18.1) Decision Matrix

| Evaluation Dimension | Track A: Windows 11 Pro + WSL2 (Ubuntu 24.04) | Track B: Zorin OS 18.1 Bare-Metal Linux | Winner |
| :--- | :--- | :--- | :---: |
| **Time to First Validated Local Run** | **~90 minutes** (zero reboot/partitioning drama) | **3–5 hours** (ISO flash, dual-boot/NVMe, open driver + X870E checks) | **Track A** |
| **Available RTX 5090 VRAM for vLLM** | `~29.5–30.5 GB` (`dxgkrnl` + Windows DWM overhead unless monitor on AMD iGPU) | **Full `31.8–32.0 GB`** (zero `dxgkrnl`; near-zero desktop VRAM on AMD iGPU) | **Track B** |
| **Available Host RAM & `tmpfs` Capacity** | `48 GB` via `.wslconfig` (`10–12 GB` `tmpfs`) | **Full `64 GB` native** (`16–20 GB` `tmpfs` + faster 12-thread `pytest`) | **Track B** |
| **CUDA Graph / Blackwell Stability** | Good on WSL `>= 2.7.0` + Driver `>= 570`, minor `dxgkrnl` latency tax | **Best** (native `nvidia-open` kernel driver, zero virtualization shim) | **Track B** |
| **Disk I/O (`overlay2` + Git + `tar`)** | Fast inside `ext4.vhdx` (`~/g4`), **10–20x slower** if touching `/mnt/*` | **Fastest** (native NVMe ext4/xfs everywhere, zero virtual VHDX overhead) | **Track B** |
| **Risk to Competition Deadline (12.5 Days Left)** | **Very Low** (keeps Antigravity IDE, browsers, Windows workflows untouched) | **Medium** (partition/bootloader/driver debugging eats competition hours unless on separate NVMe) | **Track A** |
| **Scorer Software Parity (`swegemma`, `vllm`, Docker Py 3.13)** | **100% Identical** (Ubuntu 24.04 + Docker `swebench-sandbox:latest`) | **100% Identical** (Ubuntu 24.04 base + Docker `swebench-sandbox:latest`) | **Tie** |

**Recommendation:** Stand up **Track A (WSL2)** immediately today so you start collecting 5090 evaluation traces within 2 hours. Only deploy **Track B (Zorin OS 18.1)** if you drop in a spare second NVMe SSD (zero risk to Windows) or if you decide to run multi-day LoRA fine-tuning (`M1`) where bare-metal VRAM and zero-`dxgkrnl` throughput pay back the setup hours.

---

## 6. Sources

1. **PowerSpec G914 & MSI MAG X870E TOMAHAWK WIFI Specs:** Micro Center Official Product Listing (`https://www.microcenter.com/`) & MSI X870E Tomahawk Specs (`https://www.msi.com/`).
2. **Zorin OS 18 / 18.1 Official Release & Hardware Stack:** Zorin Group Blog (`https://blog.zorin.com/` — Ubuntu 24.04.3 LTS base, Kernel 6.14 initial / Kernel 6.17 in Zorin 18.1, support to June 2029).
3. **NVIDIA Blackwell `sm_120`, Open Kernel Modules & CUDA on WSL2:** NVIDIA Open GPU Kernel Modules (`https://developer.nvidia.com/`), NVIDIA CUDA on WSL User Guide (`https://docs.nvidia.com/cuda/wsl-user-guide/index.html`), NVIDIA Container Toolkit Docs (`https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/`).
4. **vLLM & PyTorch `cu128` Blackwell Build Docs:** vLLM GPU Installation (`https://docs.vllm.ai/` — `TORCH_CUDA_ARCH_LIST="12.0"`, `use_existing_torch.py`), PyTorch CUDA 12.8 wheels (`https://pytorch.org/`).
5. **Local Competition Parity Ground Truth:** `input/kagglecomp/kagglecomp_data_package/HARNESS_README.md`, `input/kagglecomp/docs/markdown/Kaggle-03-GettingStarted.md`, `input/kagglecomp/intel_20261006/03_Local_Eval_Change_Sheet_Finding6.md` (`C1–C4`), `bcf/2026-11-08_Handoff_to_5090/setup_guide_06/06_Setup_Guide_WSL2_Swegemma_RTX5090.md`, `tools/gemma4-swe-kit/README.md`.
