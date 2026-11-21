# Task 3 [Feature Parity]: Mimicking the Remote Kaggle 4× L4 Scorer on the PowerSpec G914 (RTX 5090) — Dual-Track Implementation Plan (Windows 11 + WSL2 vs. Zorin OS 18)

*Research scope: Hardware-specific, step-by-step engineering plan to achieve maximum behavioral, runtime, and verification feature parity with the remote Kaggle Gemma 4 Developer Agent scorer (4× NVIDIA L4, Wheelhouse V31, vLLM 0.19.1, Python 3.12.13 host + `python:3.13-slim` Docker sandbox) on a **PowerSpec G914** desktop (AMD Ryzen 9 9950X3D, MSI MAG X870E TOMAHAWK WIFI, 64 GB DDR5-6000, 2 TB NVMe Gen 5, NVIDIA GeForce RTX 5090 32 GB GDDR7), delivered across two complete tracks: **(a) Windows 11 + WSL2** and **(b) Zorin OS 18 Linux native install**.*  
*As of: 2026-11-21 | Grounded In: Micro Center PowerSpec G914 specs, Microsoft WSL2 `.wslconfig` & Docker docs, NVIDIA CUDA-on-WSL & Blackwell Open GPU Kernel Module docs, Zorin OS 18 / 18.1 (Ubuntu 24.04 LTS, Kernel 6.14–6.17) official docs, Docker CE Noble docs, vLLM 0.19.x Blackwell (`sm_120`) docs, `HARNESS_README.md`, `gemma-4-developer-agent.zip` (`Dockerfile.public`, `sandbox/setup.py`), `tools/gemma4-swe-kit`, and `input/kagglecomp/intel_20261006/03_Local_Eval_Change_Sheet_Finding6.md`.*

---

## Executive Summary

Your **PowerSpec G914** (`Ryzen 9 9950X3D` 16C/32T, `64 GB DDR5-6000`, `2 TB NVMe Gen 5`, `MSI MAG X870E TOMAHAWK WIFI`, `NVIDIA GeForce RTX 5090 32 GB GDDR7 Blackwell sm_120`) is exceptionally well suited to replicate the remote Kaggle scorer locally: `google/gemma-4-31B-it-qat-w4a16-ct` weighs `~16–18 GB` in W4A16, fitting comfortably inside the RTX 5090's `32 GB` VRAM with **`~10–14 GB` left for KV cache** (supporting the full `32,768`-token context window at single-stream decode speeds of **55–61 tok/s**—roughly **1.8×–2.4× faster** than Kaggle's 4× L4 TP=4!).

Achieving true **Kaggle feature parity** requires matching **six exact software layers** identically across both OS tracks—(1) Host Python `3.12.13` with Wheelhouse V31 (`swegemma==0.2.11`, `adk-submission==0.2.13`, `google-adk==1.36.1`, `vllm==0.19.1`), (2) exact Gemma 4 chat template revision (`e3dacad5f03b852209f5ce18e44094fc80120037`) and `gemma4` tool/reasoning parsers with `--reasoning-config` + `--no-scheduler-reserve-full-isl`, (3) ADK `EventsCompactionConfig` (`token_threshold=14336`) + `ContextCacheConfig` + HTTP 400 `32,768` overflow enforcement via `g4kit-harness run`, (4) Docker `python:3.13-slim` sandboxes enforcing `4 GiB` RAM, `2 vCPUs`, and `network_mode="none"`, (5) C2/C3/C4 local wheel calibration so public gold patches validate cleanly, and (6) wall-clock speed scaling (`g4kit-scorer-time`) to correct the RTX 5090's 2× speed advantage over 4× L4. **Strategic Track Choice:** Because the Kaggle notebook-publishing freeze is **Nov 25, 2026 (4 days away)**, deploy **Track A (Windows 11 + WSL2)** *today* (zero repartitioning risk, ~60 minutes to live parity), and reserve **Track B (Zorin OS 18 native Linux on a dedicated second M.2 NVMe slot)** for maximum bare-metal VRAM headroom (+1.5–2.5 GB saved vs Windows WDDM), zero VHDX/9P friction, and overnight RL/LoRA training runs.

---

## 1. Hardware & Software Parity Gap Matrix: PowerSpec G914 vs. Remote Kaggle 4× L4

| Component / Invariant | Remote Kaggle Scorer (`4× L4`) | PowerSpec G914 (`1× RTX 5090`) | Parity Status & Exact Compensation |
| :--- | :--- | :--- | :--- |
| **GPU Architecture & VRAM** | `4 × NVIDIA L4` (Ada `sm_89`, `4 × 24 GB = 96 GB GDDR6`, `300 GB/s` each, `TP=4` over PCIe Gen4) | `1 × GeForce RTX 5090` (Blackwell `sm_120`, `32 GB GDDR7`, `1,792 GB/s`, `TP=1` zero all-reduce) | **Hardware differs.** Fits 31B W4A16 (`~17 GB`) + 32K KV cache (`~10–14 GB`) at `--gpu-memory-utilization 0.90–0.92` (`TP=1`). Set `TORCH_CUDA_ARCH_LIST="12.0"` and `--attention-backend flashinfer` if FlashAttention hits `sm_120` symbol faults. |
| **Single-Stream Decode Speed** | `17.25–35 tok/s` (`25.5 tok/s` conservative fit in `timing.py`) | `55–61 tok/s` (31B W4A16 at 4K–32K ctx); `>140 tok/s` (E4B) | **1.8×–2.4× faster locally!** Compensate via `g4kit-harness run --time-scale 0.5` OR score every run through `g4kit-scorer-time --cap-minutes <cap>`. |
| **Host Python & Wheelhouse** | Python `3.12.13`, Wheelhouse V31 (`vllm 0.19.1`, `swegemma 0.2.11`, `adk-submission 0.2.13`, `google-adk 1.36.1`, `torch 2.10.0+cu128`, `transformers 5.13.1`) | Identical Python `3.12.13` venv (both WSL2 & Zorin OS 18) | **100% Exact Parity.** Do NOT use Python 3.13 for host venv (9 `cp312` wheels fail preflight, `#748287`). |
| **Chat Template & Parsers** | Original Gemma 4 template (`rev e3dacad5f03b852209f5ce18e44094fc80120037`), `tool_call_parser=gemma4`, `reasoning_parser=gemma4`, `--reasoning-config`, `--no-scheduler-reserve-full-isl` | Identical via native `vllm 0.19.1` OR `g4kit-proxy` (`g4kit-assets check`) | **100% Exact Parity.** Always verify `vllm_cmd.txt` contains `--reasoning-config` + send a 64-token `thinking_token_budget` preflight probe (`#745059`). |
| **Context Window & ADK Compaction** | `max_model_len=32768`, HTTP 400 overflow empties patch; `EventsCompactionConfig(token_threshold=14336, overlap_size=2, retention=5)` | Identical when run via **`g4kit-harness run`** (NOT bare `swegemma eval`, which leaves compaction OFF!) | **100% Exact Parity** (test both `--compaction-interval 5` per README and `15` per host notebook). |
| **Container A/B Sandbox** | Docker `python:3.13-slim`, `4 GiB` RAM, `2 vCPUs`, `network_mode="none"`, `PYTHONSAFEPATH=1 PYTHONNOUSERSITE=1 python3 -s` | Identical Docker image `swebench-sandbox:latest` with cgroup v2 (`--memory 4g --cpus 2 --network none`) | **100% Exact Parity** on Linux Docker engine (both WSL2 native Docker CE & Zorin OS 18 native Docker CE). |
| **Local Public-Task Test Deps** | Private tasks validate `100%` gold (`#747248`) | Public `wheels/` lacks `inline-snapshot`, `dirty-equals`, `h11`, `annotated-doc`, and `setup.py` strips Starlette `<0.51` pins | **Calibrate locally ONLY** via C2 supplemental wheels (with shadow guard!) + C3 constraint-aware `setup_local.py` + C4 Pygments `2.17.2` pin so public gold oracle mirrors private 100%-valid behavior. |

---

## 2. Track A: Windows 11 + WSL2 Implementation Plan (Recommended Immediate Path)

Track A keeps your PowerSpec G914's stock Windows 11 installation untouched while running an isolated Ubuntu 24.04 LTS Linux kernel, native Linux Docker Engine, and CUDA Blackwell pass-through inside WSL2.

### Phase A1: Windows 11 Host Prerequisites & BIOS Check (10 Minutes)
1. **BIOS / UEFI Verification (MSI MAG X870E TOMAHAWK WIFI):** Ensure **AMD SVM Mode** (hardware virtualization) is Enabled and motherboard BIOS is updated to the latest stable MSI release (improves DDR5-6000 EXPO and PCIe 5.0 RTX 5090 stability).
2. **Windows NVIDIA Driver ONLY:** Install the latest **NVIDIA Windows Game Ready or Studio Driver (`572+` / `580+` series)** supporting RTX 5090 Blackwell and CUDA 12.8+ on Windows 11.
   > [!CAUTION]
   > **NEVER install a Linux NVIDIA graphics driver (`nvidia-driver-*`) inside WSL2!** Per official NVIDIA CUDA-on-WSL documentation, WSL2 mounts the Windows host driver automatically into `/usr/lib/wsl/lib` and `/usr/lib/wsl/drivers/`. Installing a Linux driver package inside WSL2 overwrites `libcuda.so` and breaks GPU pass-through!
3. **Install WSL2 with Ubuntu 24.04 LTS** (Admin PowerShell):
   ```powershell
   wsl --install -d Ubuntu-24.04
   wsl --update
   wsl --set-default-version 2
   ```
4. **Configure `C:\Users\<YourUsername>\.wslconfig`** tuned specifically for the PowerSpec G914's `64 GB DDR5` and `16C / 32T` Ryzen 9 9950X3D (leaves `16 GB` RAM + `8` threads for Windows 11 while giving WSL2 generous headroom for vLLM + 3 parallel sandboxes):
   ```ini
   [wsl2]
   memory=48GB
   processors=24
   swap=16GB
   localhostForwarding=true
   networkingMode=mirrored
   dnsTunneling=true

   [experimental]
   autoMemoryReclaim=gradual
   sparseVhd=true
   ```
   Apply immediately from PowerShell: `wsl --shutdown`, then relaunch Ubuntu 24.04.

### Phase A2: Native ext4 Workspace & Zero-9P I/O Discipline (5 Minutes)
- **CRITICAL PERFORMANCE RULE (Microsoft WSL2 Official Docs):** Never store `gemma-4-developer-agent.zip`, extracted `snapshots/`, Docker build contexts, or evaluation run directories under `/mnt/c/` or `/mnt/d/`! Crossing the Windows/WSL2 9P filesystem bridge degrades `tar`, `git`, and `pip` metadata operations by **5×–15×** (turning 5-second container setups into 45–60-second stalls!).
- Create all active harness paths inside native WSL2 ext4 (`~/g4/`):
  ```bash
  mkdir -p ~/g4/{data,runs,submissions,venv312,wheels_extra,wheels_pygments}
  # Copy competition ZIP ONCE from Windows NTFS into native ext4:
  cp /mnt/d/stuff/ai-misc/_bsh2026/vscode_project01/101e-Kaggle-antigrav/input/kagglecomp/kagglecomp_data_package/gemma-4-developer-agent.zip ~/g4/data/
  # Enable systemd inside /etc/wsl.conf (required for native dockerd):
  printf "[boot]\nsystemd=true\n" | sudo tee /etc/wsl.conf
  ```
  Run `wsl --shutdown` in PowerShell once so `systemd` boots cleanly.

### Phase A3: Native Docker CE + NVIDIA Container Toolkit Inside WSL2 (10 Minutes)
Following NVIDIA's official recommendation for granular runtime/cgroup control, install **native Linux Docker CE inside Ubuntu 24.04 WSL2** rather than relying solely on Docker Desktop's GUI wrapper:
```bash
sudo apt-get update && sudo apt-get install -y ca-certificates curl gnupg git build-essential jq
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"

# Install NVIDIA Container Toolkit (official repo)
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | \
  sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
sudo apt-get update && sudo apt-get install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl enable --now docker
```
- **RTX 5090 Blackwell (`sm_120`) WSL2 Container Library Fix:** Verify GPU visibility inside Docker immediately:
  ```bash
  docker run --rm --gpus all nvidia/cuda:12.8.0-base-ubuntu24.04 nvidia-smi
  ```
  If `nvidia-smi` succeeds on the WSL2 host but `torch.cuda.is_available()` returns `False` or throws a missing-symbol error inside a Dockerized vLLM container (a documented Blackwell WSL2 quirk involving `/usr/lib/wsl/drivers/nvmdi*`), bind-mount `/usr/lib/wsl:/usr/lib/wsl:ro` and prepend `/usr/lib/wsl/lib` to `LD_LIBRARY_PATH` (or run vLLM directly inside the WSL2 host Python `3.12.13` venv while using Docker strictly for `Container A` and `Container B`, which avoids double GPU containerization completely!).
- **Verify cgroup v2 Enforcement Inside WSL2** (ensures `4 GiB` RAM / `2 vCPUs` sandbox limits actually take effect):
  ```bash
  docker info --format '{{.CgroupDriver}} / v{{.CgroupVersion}}'
  docker run --rm --memory=4g --cpus=2 --network=none python:3.13-slim python3 -c "import sys; print(sys.version)"
  ```

### Phase A4: Windows-to-WSL2 Developer Ergonomics & Gotchas
- **VRAM Headroom Tip on Windows 11:** Windows Desktop Window Manager (DWM) + browsers + VS Code typically reserve `1.5–3.0 GB` of RTX 5090 VRAM. Close hardware-accelerated Chrome/Electron tabs during 31B runs (or disable GPU acceleration in VS Code) and start vLLM at `--gpu-memory-utilization 0.85` (leaving `~4.8 GB` for Windows DWM while giving 31B W4A16 + 32K KV cache `~27.2 GB`!).
- **Git Line-Ending Hygiene:** Run `git config --global core.autocrlf input` inside WSL2 so edits never introduce CRLF into Linux ZIP bundles.
- **VHDX Disk Compaction:** WSL2's virtual ext4 disk (`ext4.vhdx`) grows up to `1 TB` and does not shrink automatically on file deletion unless `sparseVhd=true` is set (already included above) or compacted via `Optimize-VHD`. Clean old `results/` logs periodically.

---

## 3. Track B: Zorin OS 18 Native Linux Implementation Plan (Maximum Parity & VRAM)

Track B boots native Linux on bare metal—eliminating Windows WDDM VRAM overhead (`+2–3 GB` extra KV cache / headroom on the 32 GB RTX 5090!), eliminating WSL2 VHDX/9P virtualization overhead, and giving 1:1 Linux kernel + cgroup v2 + `overlay2` Docker behavior matching Kaggle's Linux backend.

### Phase B1: Pre-Install Precautions on PowerSpec G914 (15 Minutes)
1. **Recommended Storage Strategy — Use a Second M.2 NVMe SSD!** The PowerSpec G914's **MSI MAG X870E TOMAHAWK WIFI** motherboard includes **four M.2 slots**. Installing Zorin OS 18 onto a dedicated secondary NVMe drive (e.g., 1–2 TB Gen 4/5 M.2) keeps your Windows 11 bootloader and BitLocker volume 100% isolated (switch OS cleanly via UEFI Boot Menu `F11` or GRUB).
2. **If Sharing the Existing 2 TB NVMe Drive (Dual Boot):**
   - Back up your **Windows 11 BitLocker Recovery Key** (Microsoft Account / USB) and suspend BitLocker *before* resizing NTFS.
   - Disable **Windows Fast Startup** (`Control Panel -> Power Options -> Choose what the power buttons do -> Uncheck Fast Startup`) so NTFS partitions are cleanly unmounted.
   - Shrink the Windows partition via Windows Disk Management (allocate **>= 300 GB** unallocated space for Zorin OS 18: 21 GB ZIP + extracted snapshots + Docker layers + Gemma 4 31B/E4B HF weights + run logs).
3. **BIOS Settings (MSI X870E):**
   - Update BIOS to latest stable MSI release.
   - **Secure Boot:** Either **Disable Secure Boot** during Linux bring-up (cleanest for NVIDIA out-of-tree open kernel modules & CUDA updates) OR keep Secure Boot enabled and enroll the **MOK (Machine Owner Key)** password when prompted during driver installation (you will enter it once on the blue MOK Manager screen at reboot).

### Phase B2: Zorin OS 18 / 18.1 Installation & X870E Hardware Enablement (25 Minutes)
1. **Download Zorin OS 18.1 Core ISO** (built on **Ubuntu 24.04 LTS Noble Numbat**, upgraded to **Linux Kernel 6.17** — initial Zorin OS 18.0 launched on Kernel 6.14).
2. **Boot Installer with Modern NVIDIA Option:** From the GRUB USB menu, select **"Try or Install Zorin OS (modern NVIDIA drivers)"**.
3. **MSI MAG X870E TOMAHAWK WIFI Networking Fallback:** While Kernel 6.14/6.17 adds strong support for the X870E chipset, Realtek 5GbE (`r8169`/`r8126`), and Qualcomm Wi-Fi 7 (`ath12k`), if the installer ISO lacks firmware blobs on initial boot, plug in an Android/iOS phone via **USB Tethering** to complete `sudo apt update && sudo apt full-upgrade && sudo apt install linux-firmware` immediately after first boot!
4. **Mandatory NVIDIA Blackwell Open Kernel Driver Setup:**
   > [!CAUTION]
   > **Blackwell (`sm_120`) Mandatory Open Kernel Module Rule:** Per NVIDIA's official Linux driver documentation, the legacy closed-source proprietary kernel module **does NOT support Blackwell (RTX 5090)** (`nvidia-smi` reports `"No devices were found"` and `dmesg` rejects the GPU!). You **MUST** install the **`-open`** driver package (`nvidia-driver-580-open` or newer 580+/590+ branch)!
   ```bash
   sudo add-apt-repository -y ppa:graphics-drivers/ppa
   sudo apt update
   sudo apt install -y nvidia-driver-580-open nvidia-utils-580
   sudo reboot
   # Verify after reboot:
   nvidia-smi   # Must show: NVIDIA GeForce RTX 5090, 32607MiB, Driver >= 580.xx, CUDA >= 12.8
   ```
5. **Wayland vs. Xorg & Headless Overnight Mode:**
   - Zorin OS 18 defaults to **Wayland**. If you observe desktop flicker or compositor hangs on RTX 5090, click the gear icon on the login screen and switch to **"Zorin OS on Xorg"**.
   - **Pro Tip for Maximum VRAM (`~31.8 GB` free!):** For heavy overnight sweeps or LoRA/RL experiments, switch temporarily to headless text console (`sudo systemctl isolate multi-user.target`, return with `graphical.target`) or plug your display into the Ryzen 9 9950X3D's **integrated Radeon RDNA2 iGPU** via the MSI X870E motherboard HDMI/USB-C port! Dedicating the RTX 5090 100% to compute frees every megabyte of its 32 GB GDDR7 for vLLM KV cache!

### Phase B3: Native Docker CE (`noble` Repo Trap!) + NVIDIA Container Toolkit on Zorin OS 18 (10 Minutes)
Zorin OS 18 derives from Ubuntu 24.04 (`noble`). Always use `${UBUNTU_CODENAME:-$VERSION_CODENAME}` so APT resolves to `noble` cleanly (never a nonexistent `zorin18` Docker suite):
```bash
sudo apt-get update && sudo apt-get install -y ca-certificates curl gnupg git build-essential jq
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker "$USER"

# NVIDIA Container Toolkit
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | \
  sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
sudo apt-get update && sudo apt-get install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl enable --now docker
```
Log out and back in, then verify:
```bash
docker info --format '{{.StorageDriver}} | {{.CgroupDriver}} v{{.CgroupVersion}}'  # overlay2 | systemd v2
docker run --rm --gpus all nvidia/cuda:12.8.0-base-ubuntu24.04 nvidia-smi
```

---

## 3B. Deep-Dive: Repartitioning the Hard Drive & Installing Zorin OS 18 on Top of Windows 11 Pro (Single-Drive Dual Boot)

If you prefer sharing your PowerSpec G914's stock **2 TB NVMe Gen 5 SSD** instead of adding a second M.2 drive, follow this exact six-step sequence to shrink Windows 11 Pro with zero data loss and establish a clean UEFI/GRUB dual boot.

### Target GPT Partition Layout on 2 TB NVMe (Before vs. After)

| Partition | Before Shrinking (Stock Windows 11 Pro) | After Installing Zorin OS 18.1 (Dual Boot) | Rule / Notes |
| :---: | :--- | :--- | :--- |
| **`p1`** | `100–260 MB` FAT32 EFI System Partition (ESP) | **Shared ESP** (`Windows Boot Manager` + GRUB `~5–8 MB`) | **NEVER format `p1`!** GRUB stores Linux kernels in ext4 `/boot`, not `/boot/efi`, so GRUB+shim uses only `~5–8 MB` in `/EFI/ubuntu`. |
| **`p2`** | `16 MB` Microsoft Reserved (MSR) | Untouched (`16 MB`) | Do not modify. |
| **`p3`** | `~1,860 GB` Windows 11 Pro (`C:\` NTFS) | **`~1,360–1,460 GB`** Windows 11 Pro (`C:\` NTFS) | Shrunk strictly from *inside* Windows 11 Disk Management. |
| **`p5`** | *(Did not exist)* | **`400–500 GB`** Zorin OS 18.1 (`/` ext4 + auto `/swapfile`) | Created in the Unallocated gap between `p3` and `p4` (GPT allows 128 primary partitions). Min `300 GB` for Kaggle Gemma 4 data + weights + Docker. |
| **`p4`** | `~700 MB` Windows Recovery (WinRE NTFS) | Untouched (`~700 MB`) | Remains safely at the end of the drive. |

### Step D1: Windows 11 Pro Safety Prep (UEFI/GPT Check, BitLocker & Fast Startup)
1. **Verify UEFI + GPT** in Admin PowerShell:
   ```powershell
   Get-Disk | Select-Object Number, FriendlyName, PartitionStyle
   (Get-ComputerInfo).BiosFirmwareType   # Must be: Uefi
   ```
2. **Back Up & Decrypt BitLocker:** Windows 11 Pro often enables BitLocker by default. Merely suspending BitLocker (`-rc 1`) lasts only 1 reboot and frequently triggers BitLocker Recovery screens when GRUB modifies the UEFI boot chain. On a new Gen 5 NVMe, decrypting `C:` takes only 2–5 minutes and prevents lockouts:
   ```powershell
   manage-bde -protectors -get C: | Out-File "$env:USERPROFILE\Desktop\BitLocker_Recovery_Key_BACKUP.txt"
   manage-bde -off C:
   manage-bde -status C:   # Wait until Percentage Encrypted == 0.0% & Protection Off
   ```
3. **Disable Hibernation & Fast Startup** (unlocks NTFS cleanly & removes `hiberfil.sys`):
   ```powershell
   powercfg.exe /hibernate off
   ```
   Verify in *Control Panel -> Power Options -> Choose what the power buttons do* that **Turn on fast startup** is unchecked.

### Step D2: Shrink `C:\` Safely Inside Windows 11 Pro (Plus the "Unmovable Files" Fix)
1. Press `Win + X` -> **Disk Management** (`diskmgmt.msc`).
2. Right-click **`C:`** -> **Shrink Volume...** -> enter `409600` MB (`400 GB`) or `512000` MB (`500 GB`) -> click **Shrink**. Leave the resulting black block **Unallocated** (do NOT format it in Windows!).
3. **If Windows only lets you shrink by a few GB ("Unmovable Files" Fix):**
   - Ensure `powercfg.exe /hibernate off` has been run.
   - Disable System Protection (*Create a restore point -> Configure -> Disable system protection -> Delete*).
   - Temporarily set **No paging file** (*Advanced System Settings -> Performance Settings -> Advanced -> Virtual Memory Change -> No paging file -> Set*).
   - **Reboot Windows**, repeat **Shrink Volume** (check *Event Viewer -> Application -> Source: Defrag Event ID 259* if any stubborn file still blocks the boundary), and **immediately re-enable System-Managed Virtual Memory + reboot** right after shrinking!

### Step D3: Create UEFI Bootable USB & Set MSI MAG X870E BIOS Options
1. Download **Zorin OS 18.1 Core (64-bit) ISO** and verify SHA-256 (`Get-FileHash Zorin-OS-18.1*.iso -Algorithm SHA256`).
2. Flash to an 8 GB+ USB drive using **Rufus** with Partition scheme **`GPT`** and Target system **`UEFI (non CSM)`** (or BalenaEtcher).
3. Restart Windows (`Start -> Power -> Restart`), press `Del` to enter **MSI Click BIOS**, confirm **UEFI Only (CSM Disabled)**, **Fast Boot = Disabled**, **SATA Mode = AHCI**, and **Secure Boot = Disabled** *(cleanest for `nvidia-driver-580-open` DKMS; or keep Enabled and enroll MOK on reboot)*, then click **Save & Exit (`F10`)**.

### Step D4: Boot Live USB & Partition in Zorin OS 18.1 Installer
1. Tap **`F11`** at the MSI logo -> select **`UEFI: <Your USB Drive>`** (never Legacy/non-UEFI).
2. Choose **"Try or Install Zorin OS (modern NVIDIA drivers)"** -> click **Try Zorin OS** to verify display/networking -> launch **Install Zorin OS 18**.
3. On **Installation Type**, pick either:
   - **Path 1 (Simplest on Single Drive): "Install Zorin OS alongside Windows Boot Manager"** — automatically places Zorin ext4 `/` inside your pre-shrunk Unallocated space and shares Windows' `p1` EFI partition without formatting it.
   - **Path 2 (Manual Control / 2nd M.2 SSD): "Something else"** — DO NOT format `p1` (EFI), `p2` (MSR), `p3` (Windows), or `p4` (WinRE). Select the `free space` -> `+` -> Primary, **Ext4 journaling file system**, mount point **`/`** -> set **Device for boot loader installation** to the whole disk (`/dev/nvme0n1`).
   - *2nd M.2 SSD Warning (Ubiquity Bug `#1396379`):* When installing to a second physical SSD with a dedicated 512 MB FAT32 (`boot, esp`) partition, Ubiquity may still write GRUB into Drive 1's Windows ESP unless Drive 1 is temporarily disabled/disconnected during install (or re-targeted afterward via `grub-install --efi-directory=/boot/efi` + `/etc/fstab` UUID check).

### Step D5: Post-Install Polish (GRUB `os-prober`, Boot Memory & Dual-Boot Clock Drift)
1. **Restore Windows 11 in GRUB** (Ubuntu 24.04 / Zorin OS 18 disables `os-prober` by default) and make GRUB remember your last-booted OS:
   ```bash
   sudo apt-get update && sudo apt-get install -y os-prober efibootmgr
   sudo cp /etc/default/grub /etc/default/grub.bak
   sudo sed -i 's/^#*GRUB_DISABLE_OS_PROBER=.*/GRUB_DISABLE_OS_PROBER=false/' /etc/default/grub
   grep -q '^GRUB_DISABLE_OS_PROBER=' /etc/default/grub || echo 'GRUB_DISABLE_OS_PROBER=false' | sudo tee -a /etc/default/grub
   sudo sed -i 's/^GRUB_DEFAULT=.*/GRUB_DEFAULT=saved/' /etc/default/grub
   grep -q '^GRUB_SAVEDEFAULT=' /etc/default/grub || echo 'GRUB_SAVEDEFAULT=true' | sudo tee -a /etc/default/grub
   sudo sed -i 's/^GRUB_TIMEOUT_STYLE=.*/GRUB_TIMEOUT_STYLE=menu/' /etc/default/grub
   sudo sed -i 's/^GRUB_TIMEOUT=.*/GRUB_TIMEOUT=10/' /etc/default/grub
   sudo update-grub   # Confirm: "Found Windows Boot Manager on /dev/nvme0n1p1@/EFI/Microsoft/Boot/bootmgfw.efi"
   df -h /boot/efi && efibootmgr -v
   ```
2. **Fix Windows/Linux Hardware Clock Offset Permanently:** In Windows 11 Admin CMD, tell Windows to read the hardware RTC clock as UTC (matching Linux):
   ```cmd
   reg add "HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\TimeZoneInformation" /v RealTimeIsUniversal /t REG_DWORD /d 1 /f
   ```
   *(Alternative inside Zorin OS: `timedatectl set-local-rtc 1 --adjust-system-clock`.)*

### Step D6: Recovery & Clean Uninstall Reference
- **Windows Update Hijacked Boot Order (GRUB vanished):** Press `Del` -> MSI BIOS -> *UEFI Hard Disk Drive BBS Priorities* -> move `ubuntu`/`zorin` back to #1 (or from Windows Admin CMD run `bcdedit /set {bootmgr} path \EFI\ubuntu\shimx64.efi`).
- **Cleanly Uninstall Zorin OS 18 Later:** Set `Windows Boot Manager` to #1 in BIOS -> boot Windows 11 -> open `diskmgmt.msc` -> delete the Linux ext4 partition -> right-click `C:` -> **Extend Volume** (optionally remove `EFI\ubuntu` inside mounted `mountvol S: /S` ESP).

---

## 4. Shared Kaggle-Parity Stack Setup (Identical Across Both Track A & Track B)

Once Linux + Docker CE + RTX 5090 CUDA are live on **either** Track A (WSL2) or Track B (Zorin OS 18), execute these exact 5 steps to achieve full Kaggle behavioral parity:

### Step 1: Install Host Python `3.12.13` & Competition Wheelhouse V31
Use `uv` or `pyenv` to pin **exact Python `3.12.13`** (matching Kaggle's `2026-07-01` env pin where all 9 `cp312` binary wheels install cleanly):
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
source ~/.local/bin/env
uv python install 3.12.13
uv venv --python 3.12.13 ~/g4/venv312
source ~/g4/venv312/bin/activate

# Install official Kaggle wheelhouse V31 packages (downloaded via kaggle datasets download metric/gemma-4-developer-agent-wheelhouse)
pip install --no-index --find-links ~/g4/wheelhouse_v31 \
  vllm==0.19.1 swegemma==0.2.11 adk-submission==0.2.13 google-adk==1.36.1 transformers==5.13.1

# Install gemma4-swe-kit in editable mode inside the harness venv
pip install -e ~/g4/tools/gemma4-swe-kit --no-deps
```
- **Blackwell `sm_120` PyTorch / vLLM Fallback:** Wheelhouse V31 ships `torch 2.10.0+cu128` + `vllm 0.19.1`, which supports CUDA 12.8 (`sm_120`). If `vllm 0.19.1` raises `cudaErrorNoKernelImageForDevice` or a FlashAttention symbol error on RTX 5090, set:
  ```bash
  export TORCH_CUDA_ARCH_LIST="12.0"
  export FLASHINFER_CUDA_ARCH_LIST="12.0f"
  export VLLM_ATTENTION_BACKEND="FLASHINFER"
  ```
  If a separate newer vLLM build is ever needed for Blackwell kernels, **always copy the exact `--reasoning-config` JSON and `--no-scheduler-reserve-full-isl` arguments emitted by `adk_submission`'s `VllmServer.build_cmd()`** (`vllm_cmd.txt`), AND validate parser parity via `g4kit-assets check`!

### Step 2: Install & Fingerprint Official Chat Template & Parser (`gemma4-swe-kit`)
```bash
hf download google/gemma-4-31B-it-qat-w4a16-ct chat_template.jinja \
  --revision e3dacad5f03b852209f5ce18e44094fc80120037 --local-dir ~/g4/assets
g4kit-assets install-template ~/g4/assets/chat_template.jinja
g4kit-assets extract-parser ~/g4/wheelhouse_v31/vllm-0.19.1-*.whl
g4kit-assets check
# Verify SHA-256 of gemma4_tool_parser.py == 682b2152b76c031df9c58c3ffbb5b243945be5d8957ebdce00faef1b9de6b889 (#759580)
```
> [!IMPORTANT]
> **Critical Template Pin:** Always use the **original** Gemma 4 chat template (`rev e3dacad5f03b852209f5ce18e44094fc80120037`), NOT the July 2026 refresh (which suffers from the text+tool-call turn-boundary bug documented in `#744844`).

### Step 3: Launch Persistent vLLM Server Matching Scorer Flags (Single-GPU TP=1)
Start vLLM once in a `tmux` session on `127.0.0.1:8000` with **exact scorer parsers, thinking-budget logits processor, and 32,768 context limit**:
```bash
# First dump the exact --reasoning-config string from wheelhouse V31 VllmServer:
python -c "from adk_submission.server import VllmServer, VllmConfig; print(' '.join(VllmServer(VllmConfig(model='google/gemma-4-31B-it-qat-w4a16-ct', tensor_parallel_size=1, max_model_len=32768, reasoning_parser='gemma4', tool_call_parser='gemma4')).build_cmd()))" > ~/g4/vllm_cmd.txt

# Launch with TP=1, compressed-tensors W4A16, FlashInfer, exact --reasoning-config, and --no-scheduler-reserve-full-isl:
vllm serve google/gemma-4-31B-it-qat-w4a16-ct \
  --served-model-name gemma-4-31b-it-qat-w4a16-ct \
  --host 127.0.0.1 --port 8000 \
  --tensor-parallel-size 1 \
  --dtype bfloat16 \
  --quantization compressed-tensors \
  --attention-backend flashinfer \
  --max-model-len 32768 \
  --gpu-memory-utilization 0.88 \
  --enable-prefix-caching \
  --enable-auto-tool-choice \
  --tool-call-parser gemma4 \
  --reasoning-parser gemma4 \
  --default-chat-template-kwargs '{"enable_thinking": true}' \
  --no-scheduler-reserve-full-isl \
  $(grep -o -- '--reasoning-config [^ ]*' ~/g4/vllm_cmd.txt)
```
*(For the E4B Small-Model Bonus track, swap the model to `google/gemma-4-E4B-it-qat-w4a16-ct` with `--served-model-name gemma-4-e4b-it-qat-w4a16-ct` and `--gpu-memory-utilization 0.60`.)*

### Step 4: Build Calibrated `python:3.13-slim` Docker Sandbox (C2 + C3 + C4 Local Parity)
Extract `docker/`, `sandbox/`, `wheels/`, `snapshots/`, and `tasks.jsonl` from `~/g4/data/gemma-4-developer-agent.zip` into `~/g4/data/`, then apply the C2/C3/C4 local calibration fixes (`input/kagglecomp/intel_20261006/03_Local_Eval_Change_Sheet_Finding6.md`):
1. **Tier A + B Supplemental Wheels (with Shadow Guard!):** Download `h11`, `annotated-doc`, `typing-inspection`, `inline-snapshot`, `dirty-equals`, `python-multipart`, `email-validator`, `pyyaml`, `pydantic-settings`, `pydantic-extra-types`, `ujson`, `orjson`, `PyJWT`, `pwdlib`, `uvicorn[standard]`, `fastapi-cli`, `greenlet`, `blinker`, `trio`, `attrs`, `pytest-httpbin`, `trustme`, `PySocks`, `chardet`, `passlib`, `pytest-mock`, `strawberry-graphql`, `pytest==8.3.5` for `--python-version 3.13 --platform manylinux2014_x86_64`, **deleting any wheel whose normalized package name already exists in the competition `wheels/`** so competition `pydantic` / `starlette` versions remain authoritative!
2. **Constraint-Aware `setup_local.py` (C3):** Replace `clean_requirement_line()`'s specifier stripping with `pip._vendor.packaging` constraint matching against `/wheels` so the 57 FastAPI snapshots requiring `starlette<0.51` and 53 snapshots requiring `pytest<9` receive their compliant pre-baked wheels instead of Starlette 1.6.0 / pytest 9.1.1!
3. **Pygments Side-Folder (C4):** Download `Pygments==2.17.2` into a separate `wheels_pygments/` folder for `rich_3296` ANSI highlight calibration.
4. **Build `swebench-sandbox:latest`:** `docker build -f docker/Dockerfile.public -t swebench-sandbox:latest .`

### Step 5: Mandatory 5-Gate Parity Verification Suite (Run Before Any Benchmark!)

| Parity Gate | Exact Verification Command | Expected Pass Criterion |
| :---: | :--- | :--- |
| **G1. Thinking Budget Preflight** | `curl -s http://127.0.0.1:8000/v1/chat/completions -d '{"model":"gemma-4-31b-it-qat-w4a16-ct","messages":[{"role":"user","content":"Count 1 to 5"}],"max_tokens":128,"extra_body":{"thinking_token_budget":64}}'` | **HTTP 200** (NOT HTTP 400 `reasoning_config not configured`!) with non-empty `reasoning` capped at `<= 64` tokens. |
| **G2. Reasoning-Retention Check** | Replay 2-turn tool history via `adk_submission` (`#744354`) | Outgoing HTTP payload mirrors `reasoning_content` -> `reasoning` (`adk_submission==0.2.13`); prompt token delta matches `~1.0×` previous reply. |
| **G3. Overflow HTTP 400 Check** | Send a 29,000-token dummy prompt with `max_tokens=4096` (`33,096 > 32,768`) | **HTTP 400 `BadRequestError`** before generation (identical to Kaggle vLLM). |
| **G4. Sandbox Python 3.13 & Cgroup Check** | `docker run --rm --memory=4g --cpus=2 --network=none swebench-sandbox:latest python3 -c "import sys, ssl, h11, annotated_doc, inline_snapshot, dirty_equals; print(sys.version, bool(ssl.create_default_context().verify_flags & ssl.VERIFY_X509_STRICT))"` | Prints **`3.13.x ... True`** with zero `ImportError`, and `ping -c1 1.1.1.1` fails immediately (`Network is unreachable`). |
| **G5. Zero-GPU Harness Smoke** | `g4kit-fake-llm --port 11450 &` then `g4kit-harness run --arm v2m=v2/submission_31b_monolith --tasks ~/g4/data/tasks.jsonl --snapshots ~/g4/data/snapshots --n 1 --sandbox docker --api-base http://127.0.0.1:11450/v1` | Completes in `<45s`; logs exact `eval_config.yaml` budgets, compaction `threshold=14336`, single-level tool JSON, and clean `submit_patch()`. |

---

## 5. Track A (Windows 11 + WSL2) vs. Track B (Zorin OS 18): Head-to-Head Comparison

| Evaluation Dimension | Track A: Windows 11 + WSL2 (Ubuntu 24.04) | Track B: Zorin OS 18.1 Native Linux (Ubuntu 24.04) | Winner |
| :--- | :--- | :--- | :---: |
| **Time to Operational Parity** | **~60 minutes** (zero reboot/partitioning risk; Windows apps stay live) | **~2–3 hours** (ISO flash, dual-boot / 2nd NVMe setup, MOK/driver, X870E firmware check) | **Track A** |
| **Usable RTX 5090 VRAM** | `~28.5–30.0 GB` (`1.5–3.0 GB` reserved by Windows DWM/compositor) | **`~31.0–31.8 GB`** (up to `31.8 GB` if display on 9950X3D iGPU or `multi-user.target`!) | **Track B** |
| **Container & Disk I/O Speed** | Near-native inside WSL2 ext4 VHDX (`~90–95%` of bare metal); **5–15× slower if accidentally on `/mnt/`** | **100% native NVMe Gen 5 + `overlay2`** (zero VHDX translation) | **Track B** |
| **CUDA / Blackwell Driver Ergonomics** | Seamless Windows driver updates; minor Docker `/usr/lib/wsl/drivers` bind-mount edge case | Clean native CUDA; requires explicit **`nvidia-driver-580-open`** + Secure Boot MOK handling | **Tie** |
| **Kaggle Scorer Kernel/Cgroup Parity** | **~95% parity** (Microsoft WSL2 custom 6.6 kernel + cgroup v2) | **~99% parity** (native Linux 6.14/6.17 + native systemd cgroup v2 + `overlay2`) | **Track B** |
| **Best Use Before Dec 2 Deadline** | **Deploy TODAY (Nov 21)** to run Tier 2–4 local evaluations immediately before the Nov 25 publishing freeze! | **Install on a dedicated 2nd M.2 SSD** after Nov 25 or for long-horizon post-competition / heavy LoRA / RL runs. | **Phased: A -> B** |

---

## 6. Open Questions & Sources

- **Open Question — Exact Scorer `gpu_memory_utilization` & `compaction_interval`:** `HARNESS_README.md` lists `gpu_memory_utilization=0.80` and `compaction_interval=5`, whereas some Getting Started notebook versions used `0.90` and `15` (`#759388`, `gemma4-swe-kit/harness.py`). Because `compaction_interval=5` triggers *sooner* and stresses compaction amnesia harder, testing locally with `--compaction-interval 5` is the safer conservative default.
- **Sources:** Micro Center PowerSpec G914 product specifications; Microsoft Learn WSL2 Advanced Settings (`.wslconfig`, `networkingMode=mirrored`, `autoMemoryReclaim`, cross-OS file I/O: https://learn.microsoft.com/en-us/windows/wsl/wsl-config); NVIDIA CUDA on WSL User Guide & NVIDIA Container Toolkit docs (https://docs.nvidia.com/cuda/wsl-user-guide/, https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/); NVIDIA Open GPU Kernel Modules documentation (mandatory for Blackwell `sm_120`); Zorin OS 18 / 18.1 official release notes (Ubuntu 24.04 LTS, Kernel 6.14/6.17, NVIDIA 580 driver); Docker Engine Ubuntu `noble` install docs (https://docs.docker.com/engine/install/ubuntu/); vLLM `0.19` Blackwell `sm_120` & `--no-scheduler-reserve-full-isl` docs; local files `HARNESS_README.md`, `tools/gemma4-swe-kit/`, `input/kagglecomp/intel_20261006/03_Local_Eval_Change_Sheet_Finding6.md`, and Threads `#744354`, `#744844`, `#745059`, `#747168`, `#748287`, `#759580`, `#760140`.
