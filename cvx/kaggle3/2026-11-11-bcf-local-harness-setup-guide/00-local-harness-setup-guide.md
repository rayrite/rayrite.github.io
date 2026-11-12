# BCF Local Test-Harness Setup Guide — Greenfield PowerSpec G914 (RTX 5090) to First Kaggle Submission

**Date:** 2026-11-11 · **Role:** senior infrastructure writer (BCF project) · **Method:** LOCAL ONLY — every command, pin, and fact below is grounded in the local sources listed in the source key. No web research was performed for this guide.
**Audience:** a technical reader with a bare PowerSpec G914 workstation (RTX 5090 32 GB, Windows 11 Pro preinstalled) who wants copy-pasteable, ordered steps from bare metal to a scored Kaggle submission — for BOTH the main 31B competition and the E4B small-model bonus.

**How to read this guide**

- `<PLACEHOLDER>` = replace with your value before pasting. `~` = your Linux home (Zorin or WSL2 Ubuntu). All hot Linux paths are **ext4** — never `/mnt/c` or `/mnt/d` (Part 4 §4.1).
- **UNVERIFIED** = not confirmed by the local sources; a concrete probe step is attached. Do not treat UNVERIFIED items as facts. **ESTIMATE** = arithmetic/inference from cited facts, not a measurement on this machine.
- Commands assume bash unless the block is tagged `powershell` (Windows PowerShell, Admin where noted).
- **Track-label note (important):** this guide calls **Track A = Zorin OS 18 native** (recommended primary) and **Track B = Windows 11 + WSL2** (probe-gated). The companion parity plan `03-local-env-parity-plan.md` uses the OPPOSITE letters (its Track A = WSL2, its Track B = Zorin). Section citations like "03 §3.6" keep 03's original numbering; the mapping is: 03 §3 = this guide's Track B, 03 §4 = this guide's Track A. Nothing else is changed.
- Safety: nothing under `input/` or the BCF deliverable trees is modified by any step here — all commands copy artifacts into fresh working directories. Downloaded archives are untrusted: each is extracted into its own new empty directory, and scripts you write live in `~/bcf/bin`, never inside extracted data trees (03 §0, safety rules).

**Source key (all local; paths relative to the project root `d:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_alibaba`)**

| Key | File | Used for |
|---|---|---|
| `03` | `deliverables/2026-11-11-bcf-hardening-research/03-local-env-parity-plan.md` | PRIMARY: stack pins, both OS tracks, probes, wheelhouse install, verification, divergences, troubleshooting |
| `RTX` | `scratch/bcf-hardening-2026-11-11/research/rtx5090-stack.md` | RTX 5090 / sm_120 facts, driver floors, WSL2 caveats, KV math |
| `ZOR` | `scratch/bcf-hardening-2026-11-11/research/zorin-docker.md` | Zorin 18 = Ubuntu 24.04, open kernel modules, Docker Engine + NCT |
| `SRV` | `scratch/bcf-hardening-2026-11-11/research/vllm-serving.md` | serving flags, parsers, KV fit, TP numerics |
| `HR` | `input/kagglecomp/kagglecomp_data_package/HARNESS_README.md` | harness contract: §3 serving, §4 sandbox, §7 budgets, §9 CLI, §10 gotchas |
| `GS` | `input/kagglecomp/docs/markdown/Kaggle-03-GettingStarted.md` | organizer notebook: env vars, wheelhouse install, VllmConfig, EvalConfig, packaging |
| `OV` / `DATA` | `input/kagglecomp/docs/markdown/Kaggle-01-Overview.md`, `Kaggle-02-Data.md` | submission contract, 12 h budget, deadlines, dataset contents, model rules |
| `INTEL` | `input/kagglecomp/intel_20261111/00-intel-brief-2026-11-11.md` | deadlines, queue stalls, bonus terms, runtime pins, open questions |
| `BRAIN` | `deliverables/2026-11-11-bcf-gemma4-brain/README.md` + `04-task2-bcf-design-justification.md` | BCF submission trees, validator, packaging, canary gates, ops plan |
| `04` | `deliverables/2026-11-11-bcf-hardening-research/04-local-scoring-and-feedback-guide.md` | local eval commands, artifact interpretation, correlation caveats |
| `05` | `deliverables/2026-11-11-bcf-hardening-research/05-robustness-audit-vs-field-issues.md` | canary concept + C0–C7 table (§6) |

Global caveat (03 §0.2): RTX/ZOR/SRV were produced while WebFetch was broken; their quotes are search-snippet-mediated. Load-bearing values (torch pin, WSL#40401, KV behavior, repo command text) are re-verified **on the box** by the probes in this guide, not taken on faith.

---

# Part 0 — Overview: what you will build

## 0.1 The two pipelines

You are building a **local replica of the Kaggle scoring environment** on one RTX 5090, plus the packaging/upload path to the real scorer. Same pinned software stack on both tracks; only the OS/driver/container plumbing differs (03 §1).

```text
LOCAL (your workstation, Track A Zorin native OR Track B WSL2 Ubuntu 24.04)

  ~/bcf/submissions/bcf-31b (agent.yaml tree)
        |
        v
  swegemma harness (Python 3.12.13 venv: swegemma 0.2.11 + adk-submission 0.2.13 + google-adk 1.36.1)
        |  OpenAI /v1 API, key EMPTY, num_retries=5
        v
  vLLM 0.19.1 server @ 127.0.0.1:8000  ---- RTX 5090 32 GB, TP1, bf16, gemma4 parsers, thinking ON
        |
        |  docker exec (air-gapped)
        v
  Docker sandbox  swebench-sandbox:latest  (python:3.13-slim, network=none, 4 GiB, 2 vCPU)
     Container A: agent works in /workspace  ->  git diff patch
     Container B: fresh snapshot + patch + test_patch  ->  hermetic pytest + JUnit XML
        |
        v
  ~/bcf/results/<run>/  (summary.json, task_results.jsonl, patches/, test_outputs/, traces/, logs/)

SUBMISSION (same machine, any OS)

  submission tree  ->  zip (agent.yaml at ROOT, < 3 GiB)  ->  kaggle competitions submit / UI upload
        |
        v
  Kaggle managed scorer: 4x L4 24 GB, TP4, vLLM 0.19.1, max_model_len 32768, 12 h budget
     ~120 hidden private-repo tasks  ->  public LB (58 tasks) + private LB (finals)
```

(HR §1 architecture, §3.1, §4; GS §4–5; OV Evaluation; 03 §1.)

## 0.2 Hardware assumptions — verify, do not assume

- **GPU (assumed):** NVIDIA RTX 5090 32 GB GDDR7, Blackwell GB202, compute capability **12.0 (sm_120)**, 1,792 GB/s (RTX RQ1). This is the one component the whole plan is sized around.
- **CPU / RAM / disk: NOT asserted.** The research notes do not record the G914's CPU model or system RAM (03 §3.3 marks RAM UNVERIFIED). Check them yourself before sizing WSL or partitions:
  - Windows: press `Win+R`, run `dxdiag` (System tab: CPU, memory) and `msinfo32` (System Summary: installed physical RAM, disks). Or in PowerShell:

```powershell
systeminfo | findstr /C:"Total Physical Memory"
Get-PSDrive C | Select-Object Used,Free
```

  - Linux (after install): `lscpu`, `free -h`, `df -h ~`.
- **OS (assumed):** Windows 11 Pro preinstalled (the research notes were produced on build 26200; verify yours with `winver`). Track A keeps Windows intact as a dual-boot fallback; Track B stays inside Windows.

## 0.3 Time estimates (ESTIMATE, from 03 §9.3; assumes >= 100 Mbps and the 21.9 GB zip already local)

| Phase | Track A (Zorin native) | Track B (WSL2) |
|---|---|---|
| OS/driver/container plumbing | 1.5–3 h (USB, dual-boot, driver, MOK, Docker+NCT) | 0.5–1.5 h (WSL update, Ubuntu, Docker) |
| Downloads (wheelhouse ~3–5 GB + models ~21 GB) | 0.5–1.5 h | 0.5–1.5 h |
| Env + wheelhouse + sandbox build | 0.5 h | 0.5 h |
| Probes + verification checklist | 0.5 h | 0.5–1 h (incl. WSL#40401 probe) |
| First 3-task eval | 0.5 h | 0.5 h |
| **Total to first eval** | **~3–6 h** | **~2–4 h** |

If you must freshly download the 21.9 GB competition zip, add time for it. If the Track B VRAM probe FAILs after you invested in WSL2, add Track A's plumbing time — that is the bet the decision tree sizes (03 §9.3). A full 129-task local run is ESTIMATE 3.5–5.5 h at concurrency 1; iterate on subsets instead (04 §1.4).

## 0.4 Disk budget — plan for ~250 GB+ free

Measured/estimated sizes (03 §2.1; ZIP listing measured in `scratch/bcf-2026-11-11/zip_listing.txt`):

| Item | Size | Note |
|---|---|---|
| Competition zip (kept as downloaded) | 21.9 GB | 21,929,289,087 bytes measured |
| Extracted snapshots (129 tgz) | 21.5 GB | median 214 MB, max 334.9 MB |
| Graphs + embeddings + wheels + docker/sandbox | ~2–3 GB | 127 graphs + 127 embeddings (~1.2 GB), 124 wheels |
| Models: 31B ~17 GB + E4B ~4–5 GB | ~21 GB | keep originals for re-extraction |
| Wheelhouse dataset (41 wheels incl. torch/vLLM) | 3–5 GB | ESTIMATE |
| Installed venv (torch + vLLM + libs) | 5–10 GB | ESTIMATE |
| Docker images: sandbox ~0.6–1 GB; optional vLLM CUDA image 10–20 GB; build cache | 1–21 GB | ZOR RQ5 |
| Working copies + results/traces (two runs) | 5–10 GB | ESTIMATE |
| Backups (sandbox image tar, wheelhouse zip, WSL export / Timeshift) | 10–30 GB | ESTIMATE, 03 §9.4 |

Core working set is ~100–130 GB; 03 §2.1 sets the floor at **>= 100 GB free, recommends 150 GB** on the Linux filesystem. This guide's comfort target is **~250 GB+ free** (headroom for both model variants, docker build cache, backups, and a second results run). For dual-boot, leave **>= 250 GB unallocated** when shrinking Windows (Part 2 §2.3).

## 0.5 The two-track decision

- **Track A — Zorin OS 18.1 native (recommended primary).** Eliminates the three WSL2 tail risks outright — WSL#40401 (potentially fatal ~16 GiB invisible VRAM overhead), WSL#40732 (GPU-OOM VM panic), WSL#11050 (uncontrollable sysmem fallback) — plus ~1 GiB of Windows host VRAM share and the Docker Desktop quirks. The G914 is a desktop; dual-boot is cheap and Windows stays untouched (03 §9.2; ZOR RQ6).
- **Track B — Windows 11 Pro + WSL2 (fast start, probe-gated).** Viable **only if** the VRAM-overhead probe (Part 3 §3.8) PASSes and CUDA-graph capture works. If the probe FAILs, Track B is disqualified for this workload and you switch to Track A (03 §3 gate, §9.1).
- **Final-run policy (both tracks):** every pre-submission validation run happens on the track that passed ALL verification items (Part 4 §4.7, Part 5). If Track B was MARGINAL anywhere, final validation = Track A (03 §9.1).

## 0.6 Rules & ethics (read before downloading anything)

- **Accept the competition rules** on the competition page before competing; rules acceptance is required for data access and submissions, and the Entry Deadline is **Nov 25** (OV Timeline; DATA rules gate; 03 §2.2).
- **Offline data handling:** until the external-compute (757783) and third-party-LLM-annotation (757223) rules questions are answered, do NOT send competition task material to DeepInfra/RunPod/third-party chat LLMs; keep trajectory annotation offline/local or inside Kaggle (INTEL implication 3).
- **Do not attempt public/private split probing** — infeasible under the submission cap, ban risk, no staff ruling (INTEL implication 21, C15).
- **Do not "fix" the sandbox by patch-installing missing packages** — legality was asked (744370) and never answered; the dependency gaps are parity, not your bug (INTEL implication 15; 03 §2.3).
- This project's own policy: local-only research from the provided dataset; nothing under `input/` is modified.

---

# Part 1 — Accounts & prerequisites (both tracks)

Do these on Windows first (they are needed for downloads on either track). The Linux-side Kaggle CLI setup is repeated in Part 4 §4.2 where the downloads actually happen.

## 1.1 Kaggle account, rules acceptance, phone verification

1. Create/sign in to your account at `https://www.kaggle.com`.
2. Open the competition: `https://www.kaggle.com/competitions/gemma-4-developer-agent`.
3. **Accept the competition rules** (Rules tab / the data-page prompt "To see this data you need to agree to the competition rules"). Without this, API downloads of competition data fail and submissions are blocked (DATA rules gate; OV Entry Deadline; 03 §2.2 marks the API-failure behavior as standard Kaggle, UNVERIFIED for this specific competition — the probe is the download command itself).
4. **Phone-verify your account** (Kaggle Settings → Phone verification). This is standard Kaggle behavior for competition participation/submissions, not spelled out in the local competition docs — treat as UNVERIFIED-for-this-competition; the probe is whether the Submit button is enabled. Do it now so it never blocks a scarce submission slot.
5. If you plan the optional paper track, also sign up at `https://www.kaggle.com/competitions/gemma-4-developer-agent-paper` (separate competition; deadline Nov 12 — Part 6 §6.7).

## 1.2 Kaggle API token (kaggle.json)

1. On kaggle.com → your profile → **Settings → API → Create New Token**. This downloads `kaggle.json` (contains your username + key; treat it as a secret).
2. Place it where the Kaggle CLI looks:

**Windows (for any Windows-side CLI use):**

```powershell
mkdir $env:USERPROFILE\.kaggle -Force
copy <PATH_TO>\kaggle.json $env:USERPROFILE\.kaggle\kaggle.json
```

**Linux (Track A Zorin, or Track B inside WSL Ubuntu) — the canonical location:**

```bash
mkdir -p ~/.kaggle
cp <PATH_TO>/kaggle.json ~/.kaggle/kaggle.json
chmod 600 ~/.kaggle/kaggle.json
```

(03 §2.2. On Track B you can copy from Windows in one step: `cp /mnt/c/Users/<YOU>/Downloads/kaggle.json ~/.kaggle/` — a one-time copy off `/mnt/c` is fine; working there is not, Part 4 §4.1.)

## 1.3 Kaggle CLI install + sanity check

```bash
# Linux env (or any python on Windows for a quick auth test):
python3 -m pip install --user kaggle
kaggle --version                      # probe: confirm the CLI is on PATH and note the version
kaggle competitions list -s gemma     # sanity: API auth works (03 §2.2)
```

If `kaggle` is not found, add the user-site bin dir to PATH (`~/.local/bin` on Linux). The CLI version matters for one open question: whether dataset-version pinning is supported (Part 4 §4.2, UNVERIFIED probe).

## 1.4 git / curl / unzip prerequisites

- **Windows:** install Git for Windows (git-scm.com) if you want git on the Windows side; `curl` ships with Windows 11. You will do the real work in Linux, so Windows tooling is only for ISO/USB prep and the optional Windows-side validator run.
- **Linux (both tracks, run once after OS setup):**

```bash
sudo apt update
sudo apt install -y git curl unzip ca-certificates
```

(These are the standard tools the later steps invoke; `ca-certificates curl` are also the Docker repo prerequisites, 03 §4.4.)

## 1.5 BIOS/UEFI + Windows prep for dual-boot (Track A only; Track B can skip)

**Safety first — partitioning can destroy data. Back up Windows before touching partitions.**

1. **Back up** your Windows data (external drive / cloud). The Zorin install shrinks the Windows partition; a backup is your only undo (03 §4.1 step 1).
2. **BitLocker:** if the Windows drive is BitLocker-encrypted, **suspend BitLocker protection before repartitioning** (Windows Security → Device encryption / BitLocker → Suspend), and keep the recovery key saved. Shrinking an encrypted volume without suspending can trigger recovery prompts or fail. (Standard Windows dual-boot practice — not covered by the local research notes; marked as such.)
3. **Fast Startup off:** Control Panel → Power Options → "Choose what the power buttons do" → uncheck "Turn on fast startup". Fast Startup leaves NTFS volumes in a hibernated state that Linux must not write to; disabling it avoids cross-OS filesystem corruption. (Standard dual-boot practice — not in the local notes.)
4. **Secure Boot decision (pick ONE before installing Zorin):**
   - **Simplest for a competition dev box: disable Secure Boot in UEFI** — sidesteps MOK entirely; acceptable on a personal machine (ZOR RQ2; 03 §4.1 step 3).
   - Or keep Secure Boot ON and be ready to **enroll MOK** during the NVIDIA driver install (Part 2 §2.6). Both open and proprietary modules need signing when Secure Boot is on (ZOR RQ2).
5. **Boot-menu key:** PowerSpec machines typically use **F11 (boot menu) / Del (UEFI setup)** — **UNVERIFIED for the G914; check your manual / the POST screen** (the local notes do not record it). You will need it to boot the USB.

---

# Part 2 — TRACK A: Zorin OS 18.1 native (greenfield, recommended primary)

Zorin OS 18.1 (released 2026-04-15) = **Ubuntu 24.04.4 LTS "noble"**, kernel **6.17 HWE**, GNOME 46 base, **Wayland default** (Xorg session available), supported until 2029-06-01. All Ubuntu 24.04 NVIDIA/Docker guidance applies verbatim (ZOR RQ1). Finish line: this part + Part 4 + the verification battery green.

## 2.1 Download the official ISO

1. Go to **`https://zorin.com/os/download`** and download **Zorin OS 18.x Core** (Core is the free edition; Pro is paid, Lite is XFCE — ZOR RQ1 editions). Use the current 18.x point release: 18.1 is what the notes verified; **UNVERIFIED whether an 18.2 exists by Nov 2026** (ZOR open items) — any 18.x is still the Ubuntu 24.04 base.
2. **Verify the checksum if one is published** on the download page (SHA-256). UNVERIFIED whether Zorin publishes per-ISO checksums; the probe is the download page itself. On Windows: `Get-FileHash <PATH_TO>\zorin.iso -Algorithm SHA256` and compare. If no checksum is published, note that and proceed (official site over HTTPS).

## 2.2 Create the bootable USB

From Windows, write the ISO to a USB stick (>= 8 GB recommended; the ISO overwrites the stick):

- **Rufus** (rufus.ie) — select the ISO, GPT/UEFI target, Start; or
- **balenaEtcher** (etcher.balena.io) — select ISO → select USB → Flash.

(03 §4.1 step 2 names balenaEtcher/Rufus; tool settings above are standard usage, not from the local notes.)

## 2.3 Back up Windows and shrink the partition

1. Confirm your backup (Part 1 §1.5) and BitLocker suspension are done.
2. Windows: `Win+X` → **Disk Management** (`diskmgmt.msc`). Right-click the Windows `C:` volume → **Shrink Volume**. Shrink so that **>= 250 GB is left unallocated** (Part 0 §0.4; 03 §4.1 uses >= 150 GB as the comfortable Linux minimum — this guide's disk budget asks for 250 GB). Do not touch the EFI System Partition or Windows recovery partitions.
3. Leave the freed space **unallocated** — the Zorin installer will use it.

## 2.4 Boot the USB and install Zorin alongside Windows

1. Reboot and open the boot menu (PowerSpec typically **F11**; Del for UEFI — **check your manual**, Part 1 §1.5). Boot the USB in UEFI mode.
2. The boot menu offers **"Try or install Zorin OS (modern NVIDIA drivers)"** — prefer it; also tick **"Install third-party software for graphics and Wi-Fi"** (ZOR RQ2; 03 §4.1 step 4).
3. Choose **"Install alongside Windows Boot Manager"** (dual-boot), or manual partitioning. For manual partitioning, in the freed space:
   - **ext4 root `/` — >= 150 GB** (250 GB if you left that much; this holds `~/bcf` and `/var/lib/docker`).
   - **swap — optional** (a swapfile can be added later; if you want a partition, size it to your RAM for hibernate, otherwise a few GB or none).
   - **EFI: reuse the existing EFI System Partition** — mount it at `/boot/efi`, **do NOT format it** (formatting destroys the Windows bootloader).
   - Install the bootloader to the disk's existing EFI entry; the installer's alongside option handles this automatically.
4. Complete the install (user, password, timezone), remove the USB, reboot. You should get a boot menu with Zorin and Windows Boot Manager. Windows remains intact for gaming/other work and as the Track B fallback (03 §4.1).

**Safety:** the only destructive steps are the shrink (Windows-side, reversible with a backup) and writing partitions in the freed space. Never let the installer format the whole disk or the EFI partition.

## 2.5 First boot + updates

```bash
sudo apt update && sudo apt upgrade -y
sudo reboot
# after reboot:
lsb_release -a     # expect Ubuntu 24.04.x LTS (noble) — Zorin 18 base
uname -r           # expect 6.17.x (18.1 HWE); 6.14.x on 18.0
```

(03 §4.1 step 5; ZOR RQ1.)

## 2.6 NVIDIA driver: `nvidia-driver-580-open` (the single most important step)

**Blackwell is supported ONLY by the open kernel modules.** Verbatim (NVIDIA driver README 580.82.09, ZOR RQ2): "Blackwell and later are only supported by the open kernel modules." The proprietary `nvidia-driver-580` will fail to bring up a 5090. Minimum branch 570 (first stable 570.124.04, 2025-02-27); recommended today **580+** from noble `restricted` (ZOR RQ2).

```bash
# 1. See what's recommended:
ubuntu-drivers devices
# 2. Install the OPEN flavor (apt package name is the safe form; the `nvidia:580-open`
#    ubuntu-drivers selector syntax is UNVERIFIED per ZOR open items):
sudo apt install -y nvidia-driver-580-open
#    (or: sudo ubuntu-drivers install  — auto-selects recommended; confirm it picks an -open package)
# 3. Reboot:
sudo reboot
```

(03 §4.2.) GUI alternative: Zorin Menu → System Tools → Software Updater → Settings → "Additional Drivers" tab → recommended NVIDIA driver → Apply → reboot (ZOR RQ2, help.zorin.com).

**MOK enrollment (only if Secure Boot stayed ON):** the install prompts for a MOK password. On reboot, the blue **MokManager** screen appears: "Enroll MOK" → Continue → Yes → enter the password. **If you skip/miss this screen, the modules stay unsigned and blocked** → symptom: `nvidia-smi` fails, desktop falls back to llvmpipe software rendering. Recovery if missed: `sudo apt-get install mokutil openssl`, generate/import a signing key (`mokutil --import`), reboot to enroll, sign modules (re-sign on every kernel/driver build) — or just disable Secure Boot and reinstall the driver (ZOR RQ2; 03 §4.2).

**Do NOT:** use the graphics-drivers PPA for the 5090 (documented 580 boot failure on 5090, fixed by `ppa-purge` + noble restricted driver); use NVIDIA's `.run` installer (bypasses apt/DKMS, breaks on kernel updates, complicates Secure Boot) (ZOR RQ2 items 2–3).

## 2.7 Driver verification

```bash
nvidia-smi
# Expect: Driver Version 580.x, CUDA Version 12.8+/13.x, "NVIDIA GeForce RTX 5090", ~32510 MiB total
# (exact total UNVERIFIED — record it for the KV-fit probe, Part 4 §4.9), near-zero used on a quiet desktop.
lsmod | grep nvidia          # nvidia + nvidia_modeset + nvidia_drm loaded (open flavor)
dpkg -l | grep nvidia-driver # confirm the installed package is the -open variant
# If nvidia-smi fails:
mokutil --sb-state           # Secure Boot state
dmesg | grep -i nvidia       # module signature rejection?
```

(03 §4.3.) The torch-level probe (`(12, 0)` capability) comes after the wheelhouse install (Part 4 §4.7). On native Linux there is **no WSL#40401 overhead probe to pass** — but still run a 12 GiB contiguous allocation once (same python snippet as Part 3 §3.8, using plain `nvidia-smi`) to confirm healthy large-alloc behavior before vLLM (03 §4.3).

## 2.8 Docker Engine — official apt repo (NOT Docker Desktop)

**Docker Desktop for Linux does NOT support NVIDIA GPU containers** (runs containers in a VM without passthrough; verbatim docker/roadmap#497: "currently due to the virtualization in Linux, docker desktop does not support GPU accelerated containers but it is supported in WSL2"). Use **rootful Docker Engine** — Apache-2.0, free. **Rootless is broken on Ubuntu 24.04** (AppArmor restricts unprivileged user namespaces) and GPU+rootless is problematic — do not use it here (ZOR RQ3; 03 §4.4).

```bash
# Official docs.docker.com/engine/install/ubuntu/ procedure (ZOR RQ3; verify flags live if a step errors):
sudo apt-get update
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo docker run --rm hello-world
# Post-install (docs.docker.com/engine/install/linux-postinstall/):
sudo groupadd docker 2>/dev/null || true
sudo usermod -aG docker $USER
newgrp docker    # or log out/in
sudo systemctl enable docker.service containerd.service
docker run --rm hello-world    # now without sudo
```

(03 §4.4.) `VERSION_CODENAME` resolves to `noble` on Zorin 18. If you see `NO_PUBKEY ... noble InRelease is not signed`, the keyring placement/permissions are wrong — redo the key steps (ZOR RQ3). Security note: the `docker` group is root-equivalent; acceptable on a dedicated eval box (ZOR RQ3).

## 2.9 NVIDIA Container Toolkit (NCT) + validation

Prereq: host `nvidia-smi` works (§2.7). Official install-guide procedure (ZOR RQ4; snippet-reconstructed — validate live if a step errors):

```bash
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
sudo apt-get update
sudo apt-get install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker     # writes /etc/docker/daemon.json
sudo systemctl restart docker
# Validation (official sample-workload pattern):
docker run --rm --runtime=nvidia --gpus all ubuntu nvidia-smi
# Classic CUDA-image form (any valid full tag):
docker run --rm --gpus all nvidia/cuda:12.4.1-base-ubuntu22.04 nvidia-smi
# Expect: the standard nvidia-smi table INSIDE the container (driver 580.x, RTX 5090).
```

(03 §4.5.) Use **legacy `--gpus all`** (what the harness/vLLM examples use). CDI (`nvidia-ctk cdi generate --output=/etc/cdi/nvidia.yaml`, `--device nvidia.com/gpu=all`) works on native Linux but is optional — skip it for simplicity. No `no-cgroups` workaround needed here (that is WSL-only) (ZOR RQ4).

## 2.10 Wayland notes, disk/firewall pitfalls

- **Wayland** is the Zorin 18 default and is fine on the 5090: driver 570/580 is far past the 555 explicit-sync baseline, and the eval stack is headless anyway. If the desktop glitches: log out → gear icon → "Zorin on Xorg" session (ZOR RQ1/RQ2; 03 §4.6).
- **Disk:** `/var/lib/docker` (overlay2) holds images/build cache. The optional vLLM CUDA image is 10–20+ GB; keep models on the big partition. If root is small, set `data-root` in `/etc/docker/daemon.json` — **merge with the NCT-written config, do not clobber the `runtimes` block** — e.g. `{"data-root": "/home/<YOU>/bcf/docker-data"}`, then `sudo systemctl restart docker`. Prune between runs: `docker system prune`, `docker builder prune` (ZOR RQ5; 03 §4.6).
- **Firewall:** Docker's published ports **bypass UFW** (Docker inserts iptables rules ahead of UFW; 24.04 uses iptables-nft). Mitigation: bind vLLM to `127.0.0.1` only (all Part 4 serve commands do), never publish sandbox ports (the sandbox is `network_mode=none` anyway) (ZOR RQ5).
- cgroup v2 is default on 24.04; modern Docker handles it; the eval sandbox runs no systemd inside, so no cgroupns issues (ZOR RQ5).

**Track A finish line:** §2.7 + §2.8 + §2.9 green → Part 4 (shared build) → Part 4 §4.7 verification → Part 5.

---

# Part 3 — TRACK B: Windows 11 Pro + WSL2 (greenfield, probe-gated)

**Gate:** this track is viable **only if** the VRAM-overhead probe (§3.8) PASSes and CUDA-graph capture works (§3.9). microsoft/WSL#40401 reports ~16 GiB of invisible CUDA driver overhead on Blackwell under WSL2; if it reproduces on the 5090, **nothing fits in 32 GB and Track B is disqualified** (RTX RQ4 item 1, RQ5; 03 §3 gate). Run the probe before investing in the rest.

## 3.1 Windows Update + NVIDIA Windows driver (Windows ONLY)

1. Run **Windows Update** to current (Settings → Windows Update), reboot.
2. Install the latest GeForce Game Ready or Studio driver, **R580+ generation** (minimum ever for the 5090: 572.16 WHQL 2025-01-30; R570+ required for Blackwell CUDA; R580+ satisfies cu128/cu129/cu130 wheels). Get it from NVIDIA's official driver page (nvidia.com). (RTX RQ1 driver note, RQ4 rule 1; 03 §3.1.)
3. Reboot. Verify in Windows PowerShell: `nvidia-smi` → driver 580.x, RTX 5090, ~32 GB.
4. **HARD RULE: do NOT install any Linux display driver inside WSL.** Quote (NVIDIA CUDA on WSL guide, Step 2): "Do not install any Linux display driver in WSL". The Windows driver provides the Linux user-mode stubs (`libcuda`, `nvidia-smi`) at `/usr/lib/wsl/lib/` via `/dev/dxg` GPU paravirtualization. Installing a Linux driver overwrites the stubs and breaks passthrough (RTX RQ4 rules 1–2; 03 §3.1).

## 3.2 Install WSL2 + Ubuntu 24.04, update to >= 2.7.0

Windows PowerShell (Admin):

```powershell
wsl --install -d Ubuntu-24.04    # greenfield: installs WSL + the distro; set UNIX user/password on first launch
wsl --update
wsl --version                    # MUST show WSL version >= 2.7.0
wsl --set-default-version 2
wsl -l -v                        # Ubuntu-24.04 must be VERSION 2
```

(03 §3.2; order adapted for a greenfield box — install first, then update/verify.) **Why 2.7.0:** before it, CUDA-graph capture on the 5090 failed with `cudaErrorUnknown` (dxgkrnl); the `--enforce-eager` workaround cost ~8x throughput; WSL 2.7.0 fixed capture (vllm#37242 "RTX 5090 + WSL2 2.7.0: vLLM CUDA Graphs Work", microsoft/WSL#14452; one report: 102/102 graphs, startup ~90 s → ~25 s). It also fixed a WSL VM crash when loading ~20 GB models (dbirks/home-k8s#48) (RTX RQ3, RQ4 item 3).

## 3.3 `.wslconfig` memory/swap sizing

The G914's system RAM is not recorded in the notes — **UNVERIFIED**; check with `systeminfo | findstr /C:"Total Physical Memory"` (Part 0 §0.2). Sizing rationale: vLLM host-side needs weight-load buffers + spawn workers + page cache; each sandbox container is capped at 4 GiB (HR §4.1); leave Windows >= 6–8 GB. A hard WSL memory cap also contains the GPU-OOM → Hyper-V VM panic failure mode (microsoft/WSL#40732) by preventing host-wide memory exhaustion. ESTIMATE values — validate with `free -h` during the first vLLM startup (03 §3.3).

Create `C:\Users\<YOU>\.wslconfig`:

```ini
[wsl2]
# If host RAM = 32 GB:
memory=24GB
swap=8GB
# If host RAM = 64 GB, use instead: memory=48GB / swap=16GB
localhostForwarding=true
```

Then `wsl --shutdown` (PowerShell) and relaunch Ubuntu. Verify: `free -h` inside WSL shows the capped total. Keep the swap file on NVMe (default location is fine). Do not set memory so low that vLLM's CPU-side load OOMs — if the kernel OOM-killer fires during model load, raise memory by 4–8 GB and retry (03 §3.3).

## 3.4 Ubuntu first run + GPU visibility checks

Launch Ubuntu-24.04 (first run creates your UNIX user/password), then:

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl unzip ca-certificates
lsb_release -a                 # Ubuntu 24.04.x LTS (noble) — matches Kaggle-era userspace and Zorin 18 base
ls -l /dev/dxg                 # must exist (GPU paravirtualization device)
/usr/lib/wsl/lib/nvidia-smi    # must show the 5090; note memory.total and memory.used (Windows host share)
```

(03 §3.2.) **NVML caveat** (official guide quote, RTX RQ4 rule 3): "NVML (nvidia-smi) does not support all the queries yet. GPU utilization, active compute process are some queries that are not supported." Expect ~0.5–1.5 GiB of the VRAM consumed by the Windows desktop/DWM side (ESTIMATE, RTX RQ4 item 5) — budget for it in the KV-fit probe.

## 3.5 CUDA toolkit inside WSL (optional — nvcc only)

vLLM/torch wheels bundle their own CUDA runtime — the toolkit is needed only if you compile anything (e.g., a source-build fallback). Use the **`wsl-ubuntu` meta-package repo**, which excludes the driver; a standard runfile/desktop installer would overwrite the host stubs (RTX RQ4 rule 4; 03 §3.4).

```bash
# documented wsl-ubuntu pattern (RTX RQ4 rule 4); exact keyring filename UNVERIFIED — probe the repo index if 404:
wget https://developer.download.nvidia.com/compute/cuda/repos/wsl-ubuntu/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt-get update
sudo apt-get install -y cuda-toolkit-12-8     # CUDA 12.8 = first toolkit with sm_120 (RTX RQ1)
nvcc --version                                 # 12.8; PATH may need /usr/local/cuda-12.8/bin
```

## 3.6 Docker: two options (pick ONE)

**Option B1 — Docker Desktop, WSL2 backend (simplest):**

1. Install Docker Desktop for Windows **>= 4.31.1** (older versions fail GPU entirely — NVIDIA forum PSA 299421, RTX RQ4 rule 5). Free for personal use (ZOR RQ3 licensing). Official docs: docs.docker.com/desktop/features/gpu/.
2. Settings → General: "Use the WSL 2 based engine". Settings → Resources → WSL Integration: enable for `Ubuntu-24.04`.
3. Docker Desktop **bundles its own Container Toolkit — do NOT install NCT manually inside WSL** in this option. It ships **no CDI spec**, so `--device nvidia.com/gpu=all` fails; use `--gpus all` (legacy hook) (ZOR RQ4 "WSL2 vs native").
4. Verify from Ubuntu: `docker run --rm --gpus all nvidia/cuda:12.4.1-base-ubuntu22.04 nvidia-smi` → standard nvidia-smi table inside the container (ZOR RQ4 validation pattern).

**Option B2 — Docker Engine inside WSL + NCT with no-cgroups (no Desktop):**

1. Install Docker Engine exactly as in Part 2 §2.8 (the same Ubuntu 24.04 apt path works inside WSL).
2. Install NCT exactly as in Part 2 §2.9, then additionally set the WSL2 cgroup workaround (WSL2 lacks the cgroup device controller path):

```bash
sudo nvidia-ctk config --set nvidia-container-cli.no-cgroups=true --in-place
sudo systemctl restart docker    # or: sudo service docker restart (WSL without systemd)
```

(UNVERIFIED: exact flag text — the research snippet was truncated before `=true` (RTX RQ4 rule 6). Probe: `nvidia-ctk config --help` and `sudo nvidia-ctk config get nvidia-container-cli.no-cgroups` if supported; the validation run below is the real test.)

3. Verify: `docker run --rm --gpus all nvidia/cuda:12.4.1-base-ubuntu22.04 nvidia-smi`.

**Trade-off:** B1 adds a VM hop per `docker exec` (ESTIMATE 0.1–0.5 s vs 0.05–0.2 s native → +2–12 s/task at ~25 calls, 03 §3.5) and Desktop licensing considerations; B2 is leaner but the no-cgroups flag is snippet-level UNVERIFIED. Both are functional parity, not exact.

## 3.7 The ext4 data-placement rule (NEVER /mnt/d for hot data)

Model weights, HF cache, snapshots, docker data-root, and workspaces must live on the WSL2 **ext4-in-VHDX** filesystem (`~/...`). **Never** bind-mount hot data from `/mnt/c` or `/mnt/d`: the 9p/drvfs cross costs ~1–5 ms per file op → snapshot extraction degrades from ESTIMATE 2–5 s to 10–30 s per container (**3–10x**), and `git add -A` over ~3k files degrades similarly. One-time *copy* from `/mnt/d` is fine; working there is not (RTX RQ4 item 9; 03 §2.1). Optional quantification: time `tar -xzf` of one 214 MB snapshot into `~/bcf/data` vs a `/mnt/d` directory; expect a 3–10x gap — the number that justifies Track A if you are on the fence (03 §2.1, BOT M4).

## 3.8 The WSL#40401 VRAM-overhead PROBE (do this FIRST, before vLLM)

The bug: ~16 GiB "invisible" driver-context overhead (DXGI shim + Hyper-V GPU-PV) on Blackwell under WSL2, reported on RTX PRO 6000; 3–18 GiB contiguous allocations fail despite 50+ GiB free (pytorch#182286, sglang#24364, vllm#41619). Whether it hits the 5090 + current WSL + R580 is **UNVERIFIED — LOW confidence either way** (RTX RQ4 item 1). This probe decides Track B's fate (03 §3.6).

**Prerequisite:** the probe needs torch 2.10.0 from the wheelhouse — complete Part 4 §4.1–§4.7 (layout, downloads, venv, wheelhouse install, verification) first, then return here **before starting vLLM**. This ordering matches 03 (§3.6 sources the §2.5 venv).

**Safety:** never deliberately oversubscribe VRAM under WSL — GPU OOM can panic the whole VM (WSL#40732). The allocations below stay well under physical VRAM. Close GPU-heavy Windows apps (games, browsers with hardware acceleration) first.

```bash
source ~/bcf/venv/bin/activate    # torch 2.10.0 from the wheelhouse (Part 4 §4.6)
# Step 1 — baseline (Windows host usage):
/usr/lib/wsl/lib/nvidia-smi --query-gpu=memory.total,memory.used --format=csv,noheader
# record USED_BASELINE (MiB). Expect ~500-1500 MiB with a quiet desktop (ESTIMATE, RTX RQ4 item 5).

# Step 2 — init CUDA context + allocate 4 GiB, then compare:
python - <<'EOF'
import torch, subprocess
torch.cuda.init()
a = torch.empty(4 * 1024**3 // 2, dtype=torch.float16, device='cuda')  # 4 GiB
torch.cuda.synchronize()
out = subprocess.check_output(['/usr/lib/wsl/lib/nvidia-smi',
      '--query-gpu=memory.used', '--format=csv,noheader,nounits']).decode().strip()
used = int(out.split('\n')[0])
reserved = torch.cuda.memory_reserved() / 2**20
print(f"nvidia-smi used: {used} MiB | torch reserved: {reserved:.0f} MiB")
print(f"overhead_vs_baseline = used - USED_BASELINE - reserved  (compute with your baseline)")
# Step 3 — contiguous 12 GiB allocation (the #40401/#182286 failure class):
b = torch.empty(12 * 1024**3 // 2, dtype=torch.float16, device='cuda')
torch.cuda.synchronize()
print("12 GiB contiguous alloc: OK")
del a, b; torch.cuda.empty_cache()
EOF
```

**Decision thresholds (03 §3.6 policy, derived from RTX RQ4/RQ5):**

| Result | Verdict | Action |
|---|---|---|
| Invisible overhead <= 2 GiB AND 12 GiB contiguous alloc OK | **PASS** | Continue Track B; use util <= 0.90 in Part 4 §4.8 |
| Overhead 2–6 GiB, allocs OK | **MARGINAL** | Track B usable only with reduced KV budget; re-run the KV-fit probe; prefer Track A for final validation runs |
| Overhead > 6 GiB, OR any multi-GiB contiguous alloc fails, OR `used` jumps ~16 GiB at context init | **FAIL** | **Stop. Track B is disqualified for this workload → go to Track A (Part 2).** Log the numbers in PINS.txt |

Also record `memory.total` — the KV-fit math uses the actual reported total, not "32 GB" (03 §3.6).

## 3.9 CUDA-graph capture check + enforce-eager fallback

After the first vLLM startup (Part 4 §4.8), inspect the log for graph-capture lines (e.g., "Capturing CUDA graphs", PIECEWISE/FULL counts). If capture fails with `cudaErrorUnknown` (03 §3.7):

1. Re-verify `wsl --version` >= 2.7.0 (the fix, §3.2) and the Windows driver is current.
2. Fallback: add `--enforce-eager` to the serve command. Cost: slower decode (pre-2.7.0 reports ~8x throughput loss; with graphs otherwise working expect a smaller but real penalty), faster startup, less graph VRAM. Register the deviation (03 §8 D4).
3. Separate failure class: vLLM V1 engine hangs at startup on WSL2+5090 (EngineCore spawns, ZMQ never connects) — vllm#44732, reported on v0.21–0.22; **0.19.1 status UNVERIFIED**. If it happens: confirm `VLLM_WORKER_MULTIPROC_METHOD=spawn` is set (GS §1); as a diagnostic only, try `VLLM_ENABLE_V1_MULTIPROCESSING=0` (changes scheduling determinism; do not keep it for parity runs without registering it). If still hung → Track A.

## 3.10 Sysmem-fallback note (Windows setting; WSL does not honor it)

Windows NVIDIA Control Panel → Manage 3D Settings → **"CUDA - Sysmem Fallback Policy" → "Prefer No Sysmem Fallback"** (setting exists since driver 536.40). Intent: stop VRAM oversubscription from silently paging to system RAM at 10–30x slowdown. **Caveat (microsoft/WSL#11050):** this policy is reportedly **NOT honored inside WSL2** — treat the Control Panel change as best-effort for Windows-side processes only. **Registry equivalent: UNVERIFIED** — the notes capture no registry value name/path; do not apply undocumented registry edits. Probe instead: during vLLM startup and the first eval, watch `/usr/lib/wsl/lib/nvidia-smi` — if `memory.used` exceeds physical VRAM or decode throughput collapses without a config change, sysmem fallback is active. **The real mitigation is sizing the workload to physical VRAM** (Part 4 §4.9) and never raising `gpu-memory-utilization` past the probe-verified ceiling. Track A has no such ambiguity (03 §3.8).

## 3.11 OOM / VM-panic mitigations (Track B)

- Keep the `.wslconfig` memory cap (§3.3) so a runaway process cannot exhaust Windows RAM.
- Never probe by deliberately allocating past VRAM (WSL#40732 panic risk). Use the startup-log KV numbers (Part 4 §4.9), not trial-and-error OOM.
- If the VM panics/hangs: `wsl --shutdown` from PowerShell, relaunch; if GPU behaves degraded after multi-day uptime (dxgkrnl degradation, forum 384279: ~1.7x slowdown + `dxgvmb_send_sync_msg_wait_for_completion failed` in dmesg), reboot Windows (RTX RQ4 item 6).
- Run evals at `--concurrency 1` for 31B (KV-limited) — this also halves sandbox RAM pressure.
- Keep the vLLM server warm across iterations: cold startup is ESTIMATE 4–9 min each time (03 §3.9; 04 §1.2).

**Track B finish line:** §3.8 PASS + Part 4 done + verification battery green → Part 5. If MARGINAL anywhere, final validation runs go to Track A (03 §9.1).

---

# Part 4 — Shared environment build (inside the Linux env, both tracks)

Everything below runs inside your Linux environment (Track A Zorin or Track B WSL Ubuntu) and lands under `~/bcf` on ext4. The two tracks are identical from here on (03 §2).

## 4.1 Directory layout + the ext4 rule

```bash
mkdir -p ~/bcf/{downloads,data,models,wheelhouse,sandbox-build,submissions,bin,results,logs}
df -h ~        # confirm >= 100 GB free on the ext4 filesystem (recommend 150 GB; guide target 250 GB)
```

| Path | Contents | Notes |
|---|---|---|
| `~/bcf/downloads/` | competition zip, wheelhouse zip, model tarballs (as downloaded) | keep originals for re-extraction |
| `~/bcf/data/` | extracted competition data: `tasks.jsonl`, `snapshots/`, `wheels/`, `graphs/`, `embeddings/`, `docker/`, `sandbox/`, `sample_submission/`, `HARNESS_README.md` | fresh empty dir before extraction (untrusted-archive rule) |
| `~/bcf/models/gemma-4-31b-it-qat-w4a16-ct/`, `~/bcf/models/gemma-4-e4b-it-qat-w4a16-ct/` | checkpoint dirs (config.json, safetensors, tokenizer, chat template) | read-only after download; never on `/mnt/*` |
| `~/bcf/wheelhouse/` | extracted 41-wheel dataset (v31) | |
| `~/bcf/venv/` | Python 3.12.13 host env | |
| `~/bcf/sandbox-build/` | Docker build context (Dockerfiles + shims + wheels) | separate from data dir |
| `~/bcf/submissions/bcf-31b/`, `~/bcf/submissions/bcf-e4b/` | **copies** of the BCF submission trees | originals under `deliverables/` stay untouched |
| `~/bcf/bin/` | scripts we write (env.sh, probes, run_eval.py) | never put scripts inside extracted data dirs |
| `~/bcf/results/<run>/`, `~/bcf/logs/` | eval artifacts, server logs, pin manifests | |

(03 §2.1.) **The ext4 rule applies to both tracks** (Part 3 §3.7): hot data on the Linux filesystem only; one-time copies from `/mnt/d` are fine.

## 4.2 Kaggle data downloads

Prereq: Part 1 (account, rules acceptance, token). Set up the CLI in the Linux env if you have not:

```bash
python3 -m pip install --user kaggle
mkdir -p ~/.kaggle
cp <PATH_TO>/kaggle.json ~/.kaggle/kaggle.json
chmod 600 ~/.kaggle/kaggle.json
kaggle competitions list -s gemma   # sanity: API auth works
```

**(1) Competition data (21.9 GB).** If you already have the repo copy, skip the download and copy it (one-time copy off the Windows drive is allowed):

```bash
# Track B (WSL): copy from the project's Windows location —
cp "/mnt/d/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_alibaba/input/kagglecomp/kagglecomp_data_package/gemma-4-developer-agent.zip" ~/bcf/downloads/
# Track A (Zorin): copy from wherever the repo lives on your network/USB; same file, 21,929,289,087 bytes.

# Fresh download alternative (whole competition; 03 §2.2):
kaggle competitions download -c gemma-4-developer-agent -p ~/bcf/downloads
# Single-file form (UNVERIFIED that the competition exposes this exact filename via -f;
# probe: kaggle competitions files -c gemma-4-developer-agent):
kaggle competitions download -c gemma-4-developer-agent -f gemma-4-developer-agent.zip -p ~/bcf/downloads
# Or download from the competition Data tab in the browser (rules acceptance required) and
# place the zip in ~/bcf/downloads/.
```

**(2) Wheelhouse dataset — PIN version 19987205 (v31).**

```bash
kaggle datasets download -d metric/gemma-4-developer-agent-wheelhouse -p ~/bcf/downloads --unzip
# UNVERIFIED: whether your kaggle CLI supports pinning a dataset version (e.g. --dataset-version 19987205).
# Probe: kaggle datasets download --help | grep -i version
# If no pin flag: download current, then VERIFY it is v31 via the parser SHA + package versions (§4.7).
# If the SHA mismatches, do NOT use it — fetch version 19987205 manually from the dataset's Version
# history on kaggle.com and re-verify. (INTEL §3 757782: no official manifest exists; the SHA is the anchor.)
```

(03 §2.2; GS §1; INTEL implication 22.)

**(3) Models.** Kaggle Models CLI form (**UNVERIFIED exact syntax — probe: `kaggle models --help`**):

```bash
kaggle models instances versions download google/gemma-4/other/gemma-4-31b-it-qat-w4a16-ct/2 -p ~/bcf/models
kaggle models instances versions download google/gemma-4/other/gemma-4-e4b-it-qat-w4a16-ct/<VERSION> -p ~/bcf/models
# <VERSION>: list with `kaggle models instances versions list google/gemma-4/other/gemma-4-e4b-it-qat-w4a16-ct`
# (E4B variation slug UNVERIFIED — the sanctioned alias is gemma-4-e4b-it-qat-w4a16-ct per INTEL §2a/748287.)
# Hugging Face fallback (gated: accept the license on the model page first):
#   pip install -U "huggingface_hub[cli]"
#   hf download google/gemma-4-31B-it-qat-w4a16-ct --local-dir ~/bcf/models/gemma-4-31b-it-qat-w4a16-ct
#   hf download google/gemma-4-E4B-it-qat-w4a16-ct --local-dir ~/bcf/models/gemma-4-e4b-it-qat-w4a16-ct
# (HF repo names per SRV scope + RTX RQ5; Kaggle path per GS §4.)
```

(03 §2.2.) Verify the model config on the box (resolves the kv_heads 16-vs-8 conflict, SRV open gap 1):

```bash
python3 -I -c "
import json
c = json.load(open('$HOME/bcf/models/gemma-4-31b-it-qat-w4a16-ct/config.json'))
tc = c.get('text_config', c)
for k in ('num_hidden_layers','num_key_value_heads','head_dim','sliding_window','layer_types','quantization_config'):
    v = tc.get(k, c.get(k))
    print(k, ':', (str(v)[:120] if v is not None else None))
"
# Expect per SRV Q6 / RTX RQ5: 60 layers (50 sliding + 10 global), sliding_window 1024,
# kv heads 16 (sliding) / 4 global, head_dim 256 / global 512, compressed-tensors W4A16.
# If values differ, redo the §4.9 KV math with the real numbers before trusting the fit verdict.
```

## 4.3 Extract the competition data + snapshots

Extract into a **fresh empty directory** (untrusted-archive rule):

```bash
test -z "$(ls -A ~/bcf/data)" || { echo "data dir not empty — use a fresh dir"; exit 1; }
unzip -q ~/bcf/downloads/gemma-4-developer-agent.zip -d ~/bcf/data
ls ~/bcf/data   # expect: HARNESS_README.md docker embeddings graphs sample_submission sandbox snapshots tasks.jsonl wheels
# wheelhouse (if downloaded as zip without --unzip):
mkdir -p ~/bcf/wheelhouse && unzip -q ~/bcf/downloads/gemma-4-developer-agent-wheelhouse.zip -d ~/bcf/wheelhouse
ls ~/bcf/wheelhouse/*.whl | wc -l   # expect 41 (GS §1 output). If nested, adjust to the dir containing the .whl files.
```

(03 §2.2.) **Full extraction is what the harness needs**: `--snapshots-dir` points at the 129 `.tgz` archives themselves (HR §4.2 extracts them per task inside the sandbox). Keep `graphs/` + `embeddings/` extracted too — `build_agent_prompt` appends the Code Intelligence section ONLY when graph `.json` + embedding `.npz` exist; the scorer has them, so removing them locally changes the prompt and breaks parity even though BCF doesn't use the tools (HR §5.2 section 6; 03 §6.1).

**Selective alternative for fast iteration** (subset of snapshots; names are `<instance_id>.tgz`, verified in zip_listing.txt):

```bash
unzip -j ~/bcf/downloads/gemma-4-developer-agent.zip \
  "snapshots/rich_3454.tgz" "snapshots/fastapi_14361.tgz" "snapshots/requests_7502.tgz" \
  -d ~/bcf/data/snapshots/
```

(03 §6.1.) For **CPU-only source analysis** (not harness runs), the project's `scratch/bcf-2026-11-11/extract_task_sources.py` streams each snapshot tgz and extracts only patch/test-patch-touched files + packaging metadata (`python -I extract_task_sources.py <zip> <index_json> <out_dir> [iid ...]`), and `analyze_tasks.py` splits `tasks.jsonl` into per-task records + a compact index. Those produce analysis trees, NOT the full `.tgz` snapshots the harness consumes — use the full extraction above for `--snapshots-dir`.

## 4.4 Sandbox image build (exact commands)

The harness's docker backend expects image **`swebench-sandbox:latest`** (HR §4.1). Build it from the competition's own Dockerfiles — do not improvise. The zip contains `docker/Dockerfile.sandbox`, `docker/Dockerfile.public`, `docker/imp.py`, `docker/telnetlib.py`. The public variant additionally needs the `wheels/` cache (124 wheels) in the build context (03 §2.3).

```bash
# Fresh, empty build context (untrusted-archive rule):
test -z "$(ls -A ~/bcf/sandbox-build)" || { echo "not empty"; exit 1; }
unzip -j -q ~/bcf/downloads/gemma-4-developer-agent.zip \
  "docker/Dockerfile.sandbox" "docker/Dockerfile.public" "docker/imp.py" "docker/telnetlib.py" \
  -d ~/bcf/sandbox-build/
# wheels for the public variant (and for the harness wheels_dir):
unzip -q ~/bcf/downloads/gemma-4-developer-agent.zip "wheels/*" -d ~/bcf/sandbox-build/

cd ~/bcf/sandbox-build
docker build -f Dockerfile.sandbox -t swebench-sandbox:latest .
# Optional offline-public variant (harness stages /wheels itself per HR §4.2 step 1, so this is a convenience):
docker build -f Dockerfile.public -t swebench-sandbox-public:latest .
```

What the image contains (verbatim contract, 03 §2.3 / DK): `python:3.13-slim`; apt `git patch protobuf-compiler pigz`; pip `pytest pytest-timeout==2.1.0 typer pdm-backend setuptools wheel poetry-core hatchling flit-core editables`; `imp.py` + `telnetlib.py` copied into `/usr/local/lib/python3.13/site-packages/` (Python 3.13 removed both modules; eval deps such as flasgger still import them); git identity `Agent <agent@eval>`, default branch `main`; `ENV TEST_TMPDIR=/tmp`; `WORKDIR /workspace`.

**Where wheels come from:** the sandbox is `network_mode=none` (HR §4.1) — everything installable at eval time must already be in the image or in `/wheels`. The harness stages `/wheels` from the competition `wheels/` dir (HR §4.2 step 1; `EvalConfig.wheels_dir`) and runs `sandbox/setup.py --fast-path <repo>`. **Known gap you must NOT fix by hand:** `inline_snapshot`/`dirty_equals` are absent from the wheelhouse → 27+ fastapi tasks fail collection locally exactly as on the public scorer (INTEL C7/§4a). That is parity, not a bug in your build (03 §2.3, §7 item 12).

Smoke-test the image:

```bash
docker run --rm swebench-sandbox:latest bash -lc \
  'python3 -V; python3 -c "import imp, telnetlib, pytest; print(\"shims+pytest ok\")"; git --version; protoc --version; pigz --version; echo $TEST_TMPDIR; pwd'
# Expect: Python 3.13.x, "shims+pytest ok", git/protoc/pigz versions, /tmp, /workspace
```

## 4.5 Python 3.12.13 host environment

The host harness env must be Python **3.12.13** (INTEL implication 22). The sandbox is 3.13 by design — do not "align" them (03 §2.4).

```bash
# Option 1: uv (fast, exact patch installs via python-build-standalone)
curl -LsSf https://astral.sh/uv/install.sh | sh     # or: pip install --user uv
uv python install 3.12.13
# UNVERIFIED: that 3.12.13 is in uv's available list on this date. Probe: uv python list | grep 3.12.13
uv venv ~/bcf/venv --python 3.12.13
source ~/bcf/venv/bin/activate
python -V    # expect: Python 3.12.13

# Option 2: conda-forge (fallback if uv lacks the exact patch)
# conda create -y -n bcf -c conda-forge python=3.12.13
# conda activate bcf
```

(03 §2.4.)

## 4.6 Wheelhouse install (notebook-faithful, exact order) + env vars

Replicate GS §1 precisely: skip cutlass wheels, rename `cu128`→`+cu128` in filenames, install all 41 wheels in one `pip install --no-deps --force-reinstall` (no dependency resolution — this is how the scorer installs them too, INTEL §4d/744370). The wheelhouse is Linux x86_64 — it installs into the WSL/Zorin venv, **never into Windows Python** (03 §2.5).

```bash
source ~/bcf/venv/bin/activate

# --- env vars: add to ~/bcf/bin/env.sh and source it in EVERY shell that runs vllm/swegemma ---
cat > ~/bcf/bin/env.sh <<'EOF'
export LITELLM_LOCAL_MODEL_COST_MAP=True
export TRANSFORMERS_NO_TF=1
export VLLM_WORKER_MULTIPROC_METHOD=spawn
export VLLM_MEMORY_PROFILER_ESTIMATE_CUDAGRAPHS=1
export VLLM_ENGINE_READY_TIMEOUT_S=1200
export VLLM_NO_USAGE_STATS=1
export OTEL_SDK_DISABLED=true
export PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True
EOF
source ~/bcf/bin/env.sh
# (all eight verbatim from GS §1; VLLM_MEMORY_PROFILER_ESTIMATE_CUDAGRAPHS=1 is the staff-confirmed
#  fix for the LoRA CUDA-graph OOM edge, 749191 — keep it even without LoRA.)

# --- remove cutlass .pth hooks (GS §1 does this before install) ---
find ~/bcf/venv/lib -name "*cutlass*.pth" -print -delete

# --- stage symlinks with the cu128 rename, skipping cutlass wheels (GS §1) ---
WHEELHOUSE_DIR=~/bcf/wheelhouse        # adjust if the .whl files sit one level deeper
mkdir -p /tmp/wheelhouse
for w in "$WHEELHOUSE_DIR"/*.whl; do
  b=$(basename "$w")
  case "$b" in *[Cc][Uu][Tt][Ll][Aa][Ss][Ss]*) continue;; esac
  case "$b" in *cu128*) [ "${b/+cu128/}" = "$b" ] && b="${b/cu128/+cu128}";; esac
  ln -sf "$w" "/tmp/wheelhouse/$b"
done
ls /tmp/wheelhouse/*.whl | wc -l    # expect 41 minus any cutlass wheels (GS prints "Installing 41 wheels")

# --- single force-reinstall, no deps (GS §1) ---
python -m pip install -q --no-deps --force-reinstall /tmp/wheelhouse/*.whl
```

(03 §2.5.) **Never `pip install -U vllm`** — current PyPI vLLM is 0.33.0 / torch 2.14 / cu130-only (RTX RQ3), a different serving stack. Never upgrade any pinned package mid-competition (03 §9.4).

## 4.7 Version verification battery (the parity gate)

Record all output into `~/bcf/results/PINS.txt` (03 §2.5, §7):

```bash
python -c "import vllm, torch, transformers; print('vllm', vllm.__version__, '| torch', torch.__version__, '| transformers', transformers.__version__)"
# expect: vllm 0.19.1 | torch 2.10.0+cu128 (or +cu129) | transformers 5.5.x   (RTX RQ2/RQ3; INTEL impl 22)
python -m pip show swegemma adk-submission google-adk | grep -E '^(Name|Version)'
# expect: swegemma 0.2.11, adk-submission 0.2.13, google-adk 1.36.1            (INTEL impl 22)
sha256sum ~/bcf/venv/lib/python3.12/site-packages/vllm/tool_parsers/gemma4_tool_parser.py
# expect: 682b2152b76c031df9c58c3ffbb5b243945be5d8957ebdce00faef1b9de6b889     (INTEL §3 757782)
python -c "import torch; print(torch.cuda.get_device_capability(), torch.cuda.get_device_name(0))"
# expect: (12, 0) NVIDIA GeForce RTX 5090                                      (RTX RQ2)
nvidia-smi    # Track B: /usr/lib/wsl/lib/nvidia-smi — record driver 580.x + exact total MiB
```

- **If the SHA or any version mismatches:** the wheelhouse drifted (v31 was "last updated October 12"; INTEL S4). Stop and re-pin before any A/B — a different parser changes tool-call behavior and invalidates comparisons (0.24 rewrote the gemma4 parser per 753521). Fetch dataset-version 19987205 manually and re-verify (03 §2.5).
- **If `get_device_capability()` errors with "no kernel image" / sm_120 incompatibility:** the wheelhouse torch wheel lacks sm_120 (UNVERIFIED risk). Fallback ladder: (1) confirm driver R580+ and (Track B) WSL >= 2.7.0; (2) install the vLLM 0.19.1 cu128 variant wheel from wheels.vllm.ai + torch 2.10.0 cu128 from `https://download.pytorch.org/whl/cu128` — document as a wheel-provenance divergence; (3) last resort source build with `TORCH_CUDA_ARCH_LIST="12.0"` — hours of work, only if (2) fails (03 §2.5; RTX RQ2/RQ3).

**Track B gate:** if you are on WSL2, run the **WSL#40401 VRAM-overhead probe now (Part 3 §3.8)** — before any vLLM work. FAIL → switch to Track A. Track A: optionally run the 12 GiB contiguous-alloc sanity check (Part 2 §2.7).

## 4.8 vLLM serving — exact serve commands

Flag doctrine (SRV Q3; 03 §5.1): numerics-affecting flags (`dtype`, quantization auto, `kv-cache-dtype`, TP size, `enable_thinking`) must match the scorer; speed/memory-only flags (`gpu-memory-utilization`, `enforce-eager`, `max_loras` count) are safe local levers. Keep the known 0.19.1 gemma4 parser bugs — do NOT "fix" them by upgrading; they are identical on Kaggle (fidelity preserved). Expect the **TRITON_ATTN** backend in the log (heterogeneous head dims 256/512 force it; not an error) and **Marlin** W4A16 kernels (CC 12.0 qualifies). Avoid NVFP4 checkpoints (CUTLASS FP4 broken on consumer Blackwell) — the official `-ct` W4A16 is the parity-correct path (03 §5.1; SRV Q2).

**31B (main track):**

```bash
source ~/bcf/bin/env.sh && source ~/bcf/venv/bin/activate
vllm serve ~/bcf/models/gemma-4-31b-it-qat-w4a16-ct \
  --served-model-name gemma-4-31b-it-qat-w4a16-ct \
  --host 127.0.0.1 --port 8000 \
  --tensor-parallel-size 1 \
  --dtype bfloat16 \
  --max-model-len 32768 \
  --gpu-memory-utilization 0.90 \
  --enable-auto-tool-choice \
  --tool-call-parser gemma4 \
  --reasoning-parser gemma4 \
  --default-chat-template-kwargs '{"enable_thinking": true}' \
  --enable-lora --max-loras 8 --max-lora-rank 128 \
  2>&1 | tee ~/bcf/logs/vllm-31b-$(date +%Y%m%d-%H%M%S).log
# OMIT --quantization: compressed-tensors auto-detect (SRV Q2).
# --kv-cache-dtype: omitted = auto (bf16) = scorer parity; add fp8 ONLY per §4.9.
# --enforce-eager: omitted = CUDA graphs on = scorer parity; add ONLY per Part 3 §3.9 / §4.9.
```

(03 §5.2; provenance HR §3.1/§3.3 + GS §4 VllmConfig literal + SRV recommended config.) `--served-model-name` makes `/v1/models` report the alias the harness expects (HR §3.3 binds `openai/<served_model>`). TP1 is forced by hardware (one GPU). **Memory note:** LoRA buffers are preallocated for `max_loras x max_lora_rank` even with no adapter loaded; if the KV probe is tight and you run without adapters, reduce `--max-loras 1` (memory-only) and register it; keep `--max-lora-rank 128`. BCF ships no adapters today (03 §5.2; SRV Q7).

**E4B (bonus track):**

```bash
vllm serve ~/bcf/models/gemma-4-e4b-it-qat-w4a16-ct \
  --served-model-name gemma-4-e4b-it-qat-w4a16-ct \
  --host 127.0.0.1 --port 8000 \
  --tensor-parallel-size 1 \
  --dtype bfloat16 \
  --max-model-len 32768 \
  --gpu-memory-utilization 0.90 \
  --enable-auto-tool-choice \
  --tool-call-parser gemma4 \
  --reasoning-parser gemma4 \
  --default-chat-template-kwargs '{"enable_thinking": true}' \
  --enable-lora --max-loras 8 --max-lora-rank 128 \
  2>&1 | tee ~/bcf/logs/vllm-e4b-$(date +%Y%m%d-%H%M%S).log
```

(03 §5.3.) E4B (~4–5 GB weights) fits 32k context with large headroom — run the KV probe anyway to record the number. E4B's sliding window is 512 (vs 1024 for 31B); its exact layer/head config is **UNVERIFIED** — read the startup KV log rather than extrapolating 31B math. The E4B recipe additionally mentions `--chat-template examples/tool_chat_template_gemma4.jinja` (RTX RQ3, MEDIUM confidence): **UNVERIFIED whether the `-ct` checkpoint needs it** — probe = the tool-call smoke (§4.10) without it first; add only if tool calls fail to parse, and register the template provenance. E4B is the variant where the array-parser freeze was first hit (753973) — keep array-typed tool parameters out of all schemas and run the freeze canary (C3) before any bonus run (03 §5.3; INTEL implication 8).

## 4.9 KV-fit PROBE and max-model-len decision tree (the load-bearing procedure)

**Why uncertain:** Gemma-4-31B has 50 sliding-window layers (window 1024, 16 KV heads, head_dim 256) + 10 global layers (4 KV heads, head_dim 512). Per-token KV (SRV Q6; RTX RQ5):

| Allocation scheme | bf16 bytes/token | One 32,768-token sequence |
|---|---|---|
| **Uniform** (sliding layers pay full length — vllm#39133 behavior) | 901,120 B ≈ 880 KiB | ≈ **27.5 GiB** (fp8: 13.75 GiB) |
| **Sliding-aware hybrid** (SWA capped at 1024) | 81,920 B/token global + fixed 800 MiB/seq SWA | ≈ **3.28 GiB** (fp8: 1.64 GiB) |

Evidence leans **uniform** for the 0.19 era (vllm#39133 log "Available KV cache memory: 4.32 GiB, GPU KV cache size: 9,424 tokens"; tt-xla#5727). Counter-evidence: bf16 page sizes ARE divisible, so the hybrid manager *could* work on CUDA. **Unresolved — decide empirically.** Budget arithmetic (ESTIMATE, RTX RQ5): 5090 reports ~31.8 GiB total (record actual); Track B subtracts Windows host ~0.5–1.5 GiB; weights ~17 GB ≈ 15.8 GiB; non-KV overhead ~1.5–3 GiB. At util 0.90 → ~28.6 GiB vLLM budget → **~9–11 GiB for KV**. Kaggle's 4xL4 TP4 fits 32k under EITHER scheme — the single-5090 port is the risky case because TP1 concentrates all KV heads on one card (03 §5.4).

**Procedure:**

1. Start the §4.8 command as written (bf16 KV, util 0.90, max-model-len 32768). Read the startup log:
   - `GPU KV cache size: N tokens` ← **the number that decides everything**
   - `Available KV cache memory: X GiB`
   - any `Hybrid KV cache layout` / `num_kv_cache_groups` line (>1 group = sliding-aware).
2. **Branch:**

```text
Startup succeeds AND N >= 32768?
├─ YES (hybrid world): KEEP max-model-len 32768, bf16 KV. Full parity.
│    Concurrency ceiling = floor(N / 32768) full-context sequences; still run --concurrency 1.
└─ NO — ValueError "The model's max seq len (32768) is larger than the maximum ... KV cache"
   or N < 32768 (uniform world):
   ├─ Step 1: add --kv-cache-dtype fp8  (per-tensor fp8_e4m3; halves KV).
   │    Restart, re-read N_fp8.
   │    ├─ N_fp8 >= 32768: KEEP 32768 + fp8 KV. REGISTER numerics divergence (03 §8 D3):
   │    │    small quant error; vLLM Apr-2026 blog reports <=0.7pt impact / ~99% recovery.
   │    │    Do NOT use int8_per_token_head — it corrupts Gemma-4 output (vllm#49716, #40388 family).
   │    │    If fp8 startup hits a #40388-family page-size error → revert to bf16, go to Step 2.
   │    └─ N_fp8 < 32768: go to Step 2 with fp8 kept.
   ├─ Step 2: reduce --max-model-len to the largest power-of-two <= N (round down):
   │    bf16 uniform → expect ~8192–10240; fp8 uniform → expect ~16384–20480.
   │    REGISTER functional divergence (03 §8 D2): context cap < 32768. BCF's steady-state context
   │    is < 12k by design, so 16384 is tolerable; ~10k is marginal — any A/B relying on
   │    long-context behavior is non-predictive.
   ├─ Step 3 (optional, before accepting a reduced len): --enforce-eager frees CUDA-graph VRAM
   │    (~2.19 GiB on the remote rig per 749191; forum caveat: may NOT yield more KV blocks).
   │    Re-read N. Keep only if it buys a meaningfully larger len; register speed divergence.
   └─ Step 4 (optional): raise --gpu-memory-utilization to 0.95 (memory-only lever; recipe range
        0.90–0.95). Track B: re-check Part 3 §3.10 sysmem-fallback behavior first; never exceed
        the probe-verified physical ceiling. Re-read N.
```

3. Record in `~/bcf/results/PINS.txt`: actual VRAM total, util, KV dtype, N tokens, max_model_len, eager/graphs, and the branch taken. This record travels with every eval run (03 §5.4, §6.6).

**Expected verdict (ESTIMATE, pre-registered):** uniform-world → **fp8 KV + max_model_len 16384** is the most likely landing zone that preserves BCF's <12k design context; bf16-only fallback lands ~10k. If the hybrid world materializes, full 32768 bf16 parity is achieved. Either way the probe takes <15 min (03 §5.4). **fp8 tradeoff:** halves KV bytes; scales default 1.0 ("may cause accuracy issues" unless calibrated); measured <=0.7pt impact / ~99% recovery (SRV Q3). It is the pragmatic 5090 lever, **not** scorer parity (scorer = auto/bf16). Whether 0.19.1+CUDA+gemma4-31B accepts per-tensor fp8 is an open question — Step 1 answers it. Never use per-token-head/int8 paths (03 §5.5).

## 4.10 Harness wiring

**(a) Stage the submission copies** (never move/edit the deliverable trees):

```bash
# <PROJ> = d:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_alibaba
# Track B: prefix with /mnt/d/... for this ONE-TIME copy only (ext4 rule). Track A: from your repo copy.
cp -r "<PROJ>/deliverables/2026-11-11-bcf-gemma4-brain/02-bcf-brain-31b/submission" ~/bcf/submissions/bcf-31b
cp -r "<PROJ>/deliverables/2026-11-11-bcf-gemma4-brain/03-bcf-brain-e4b/submission" ~/bcf/submissions/bcf-e4b
```

(03 §6.1; BRAIN deliverables map.)

**(b) Server health + alias check** (with the §4.8 server running):

```bash
curl -s http://127.0.0.1:8000/v1/models
# expect JSON data[0].id == "gemma-4-31b-it-qat-w4a16-ct" (or e4b); log shows TRITON_ATTN + Marlin load
```

(03 §7 item 7.) Tool-call and reasoning smokes are in Part 5 §5.1 / 03 §7 items 9–10.

**(c) Path 1 — `swegemma eval` CLI with `--models-yaml` (schema UNVERIFIED).** HR §9.1 documents `--models-yaml <path>` ("Custom models.yaml file mapping model aliases and token pricing") but the file format is not shown in any local doc. Probe: `swegemma eval --help`, then inspect the installed source (`python -c "import swegemma, pathlib; print(pathlib.Path(swegemma.__file__).parent)"`, grep for `models_yaml`). Template to try (UNVERIFIED — validate against swegemma source before trusting):

```yaml
# ~/bcf/bin/models.yaml — UNVERIFIED format; validate against swegemma source before trusting
models:
  gemma-4-31b-it-qat-w4a16-ct:
    model: openai/gemma-4-31b-it-qat-w4a16-ct
    api_base: http://127.0.0.1:8000/v1
    api_key: EMPTY
    input_cost_per_token: 0.0
    output_cost_per_token: 0.0
```

(03 §6.4.) If the CLI insists on starting its own server, point it at the same checkpoint with the §4.8 flags; if it can attach to an existing `127.0.0.1:8000`, prefer that (warm server). When in doubt, Path 2 has zero format uncertainty.

**(d) Path 2 — organizer Python driver (recommended for full parity).** Adapts GS §4–5 to local paths; every budget and compaction knob is visible and echo-able. Save as `~/bcf/bin/run_eval.py` (our script dir; data elsewhere). This variant lets `VllmServer` manage the server (the fully grounded registry construction per 03 §6.3) — **stop any external `vllm serve` first** (port 8000 conflict), or keep the external server and build the registry via the probe noted inline.

```python
#!/usr/bin/env python3
"""Local parity eval driver — adapts GettingStarted §4-5 (GS) to local paths.
Run: python ~/bcf/bin/run_eval.py <submission_dir> <results_dir> [task_id ...]
"""
import sys, asyncio, pathlib, yaml
import litellm
import torch
from adk_submission import VllmConfig, VllmServer, discover_adapters
from swegemma.config import ALLOWED_ADAPTER_EXTENSIONS
from swegemma.models.discovery import validate_single_declared_model
from google.adk.agents.context_cache_config import ContextCacheConfig
from google.adk.apps._configs import EventsCompactionConfig
from swegemma.config import EvalConfig, build_submission_limits
from swegemma.evaluate import Evaluator
from swegemma.models import load_tasks

litellm.drop_params = True                      # GS §4
DATA = pathlib.Path.home() / "bcf/data"
submission_dir = pathlib.Path(sys.argv[1])
results_dir = pathlib.Path(sys.argv[2])
task_ids = sys.argv[3:]

# --- budgets: read the submission's eval_config.yaml exactly like scripts/inference.py (HR §7.1) ---
raw = yaml.safe_load((submission_dir / "eval_config.yaml").read_text())
ev = raw.get("evaluation", raw)
timeout_seconds = int(ev.get("timeout_seconds", 300))
max_tool_calls = int(ev.get("max_tool_calls", 100))
max_time_minutes = float(ev.get("max_time_minutes", 60.0))
turns_raw = ev.get("max_turns", ev.get("max_llm_calls"))
max_turns = int(turns_raw) if turns_raw is not None else None

tasks = load_tasks(DATA / "tasks.jsonl")
if task_ids:
    tasks = [t for t in tasks if t.instance_id in task_ids]
limits, gen_constraints = build_submission_limits()

# --- server + model registry: GS §4 literal, local model path, TP1 forced by hardware ---
declared_model = validate_single_declared_model(str(submission_dir))
adapters = discover_adapters(str(submission_dir), adapter_extensions=ALLOWED_ADAPTER_EXTENSIONS)
MODEL_PATH = pathlib.Path.home() / "bcf/models" / declared_model
vllm_cfg = VllmConfig(
    model=str(MODEL_PATH),
    port=8000,
    host='127.0.0.1',
    tool_call_parser='gemma4',
    reasoning_parser='gemma4',
    max_model_len=32768,                     # adjust per your §4.9 KV-probe verdict; register it
    dtype='bfloat16' if (torch.cuda.is_available() and torch.cuda.is_bf16_supported()) else 'auto',
    gpu_memory_utilization=0.90,
    enable_auto_tool_choice=True,
    enable_lora=True,
    max_loras=8,
    max_lora_rank=128,
    tensor_parallel_size=1,                  # single 5090 (GS auto would pick 4 on the Kaggle rig)
    startup_timeout=60 * 20,                 # 1200 s, matches VLLM_ENGINE_READY_TIMEOUT_S
)
server_instance = VllmServer(vllm_cfg, adapter_manifest=adapters)
server_instance.start()
models = server_instance.create_model_registry(
    aliases=[declared_model],
    model_prefix='openai/',
    api_key='EMPTY',
)
# If you instead run an EXTERNAL `vllm serve` (§4.8), skip VllmServer and construct the registry
# the same way VllmServer does — UNVERIFIED import location; probe:
#   python -c "import adk_submission, inspect; print([n for n in dir(adk_submission) if 'registr' in n.lower()])"
# and inspect VllmServer.create_model_registry. (03 §6.3.)

eval_config = EvalConfig(
    tasks_path=DATA / "tasks.jsonl",
    snapshots_dir=DATA / "snapshots",
    results_dir=results_dir,
    submission_dir=submission_dir,
    models=models,
    sandbox="docker",                      # LOCAL: docker (HR §4.1 default; notebook used subprocess)
    timeout_seconds=timeout_seconds,
    max_time_minutes=max_time_minutes,
    max_tool_calls=max_tool_calls,
    max_turns=max_turns,
    limits=limits,
    generation_constraints=gen_constraints,
    context_cache_config=ContextCacheConfig(min_tokens=2048, ttl_seconds=1800, cache_intervals=10),
    events_compaction_config=EventsCompactionConfig(
        compaction_interval=5,             # HR §7.2 (scripts/inference.py). GS §5 notebook uses 15.
        overlap_size=2,                    # Resolve via the source probe below; echo whichever you use.
        token_threshold=14336,
        event_retention_size=5,
    ),
    graph_dir=str(DATA / "graphs"),
    embeddings_dir=str(DATA / "embeddings"),
    wheels_dir=DATA / "wheels",
    verbose=False,
)
# --- PARITY ECHO (mandatory, 03 §7 item 14) ---
print("EVAL_CONFIG:", eval_config)
print("COMPACTION:", eval_config.events_compaction_config)
print("CONTEXT_CACHE:", eval_config.context_cache_config)

evaluator = Evaluator(eval_config)
async def main():
    for i, t in enumerate(tasks, 1):
        r = await evaluator.evaluate_task(task=t, task_index=i, total_tasks=len(tasks))
        print(t.instance_id, "resolved=", r.resolved, "exit=", r.test_exit_code,
              "patch_chars=", len(r.agent_patch or ""), "calls=", r.tool_calls,
              "dur=", round(r.duration_seconds, 1))
asyncio.run(main())
```

(03 §6.3; structure — EvalConfig fields, Evaluator.evaluate_task, load_tasks, build_submission_limits, compaction/cache configs — verbatim from GS §5 and HR §7.)

**(e) Compaction discrepancy — resolve once, then freeze.** HR §7.2 says `scripts/inference.py` uses `compaction_interval=5`; the GS §5 notebook passes `15`. Which the **managed scorer** runs is **UNVERIFIED**. Probe the installed wheelhouse source:

```bash
grep -rn "compaction_interval" ~/bcf/venv/lib/python3.12/site-packages/swegemma/ | head
# and, if scripts/inference.py ships in the wheel or data package, grep it too.
```

Use what `scripts/inference.py`/swegemma defaults say (scorer path), echo it in every run, and register the choice. Threshold (14,336), overlap (2), retention (5) agree across all sources — those are exact (03 §6.5; INTEL C12).

**(f) Keep the server warm.** Cold vLLM startup is ESTIMATE 4–9 min locally. Batch reruns into one invocation with multiple task ids; keep the eval process/server alive while you edit prompts in scratch copies; never use task #1 of a cold run for timing comparisons (04 §1.2; 03 §6.2). Write `~/bcf/results/<run>/PINS.txt` before each run: wheelhouse version + parser SHA, all package versions, Python version, serve command line, KV-probe verdict, track, driver version, WSL version (Track B), compaction interval (03 §6.6).

---

# Part 5 — Triggering local test runs

## 5.1 Pre-flight (before any eval)

**Validator on both BCF trees** (BRAIN packaging; run from the project root on Windows, or copy `validate_submission.py` to `~/bcf/bin` and run it against the staged Linux copies — it is stdlib + optional PyYAML):

```bash
python -I scratch/bcf-2026-11-11/validate_submission.py deliverables/2026-11-11-bcf-gemma4-brain/02-bcf-brain-31b/submission
python -I scratch/bcf-2026-11-11/validate_submission.py deliverables/2026-11-11-bcf-gemma4-brain/03-bcf-brain-e4b/submission
# expect: PASS, 0 errors / 0 warnings (BRAIN verified metrics; re-run after every change)
```

**Serving smokes** (03 §7 items 9–10, with the §4.8 server up):

```bash
# Tool-call smoke (gemma4 parser, thinking on):
curl -s http://127.0.0.1:8000/v1/chat/completions -H 'Content-Type: application/json' -d '{"model":"gemma-4-31b-it-qat-w4a16-ct","messages":[{"role":"user","content":"What is the weather in Boston? Use the get_weather tool."}],"tools":[{"type":"function","function":{"name":"get_weather","description":"Get current weather","parameters":{"type":"object","properties":{"city":{"type":"string"}},"required":["city"]}}}],"tool_choice":"auto","temperature":0,"max_tokens":1024}'
# expect: tool_calls[0].function.name == "get_weather", arguments parse as JSON with city
# (possible literal-quote quirk #51284 = parity, not failure); reasoning_content non-empty.
# Reasoning smoke: same curl without tools, prompt "Solve 17*23 step by step." → reasoning_content populated.
```

**Canary gates C0–C7 (summary).** A *canary* is a small, cheap probe that validates one load-bearing assumption before you spend a scarce submission slot or GPU hours — cheapest first, never spend a slot on an unvalidated assumption. Full concept + table: `05-robustness-audit-vs-field-issues.md` §6.0–6.1 (linked in Part 7).

| Canary | What it proves | Cost |
|---|---|---|
| C0 | Official `compile_submission` accepts both trees; skill tools inject; `skills:` path resolves | CPU, minutes |
| C1 | bcf.py engine battery on all 129 tasks (DONE per BRAIN; re-run after changes) | CPU, ~1 h |
| C2 | Harness smoke: nudge-restart byte-identical spec <=15 s; include_contents boundary; real setup time | 8–10 local tasks |
| C3 | gemma4 parser fuzz on your exact schemas — zero hangs (array-arg freeze class) | CPU, subprocess+timeout |
| C4 | Reasoning-drop parity on pinned v31 (delta <=1 task) | local |
| C5 | E4B serving end-to-end under the sanctioned alias; clean format — BEFORE a bonus slot | local + Kaggle notebook |
| C6 | Replicated eval on the masked-68 valid set; win-both selection; wall-clock extrapolation | GPU, overnight |
| C7 | Submission ops: validated ZIP, early submit, PENDING monitor, escalation | each slot |

C0 official-compiler probe (signature UNVERIFIED — inspect first): `python -c "import adk_submission, inspect; print(inspect.signature(adk_submission.compile_submission))"`, then compile each staged tree and confirm the skill tools appear (05 §6.1; BRAIN canary 1). The 744354 reasoning-drop repro (03 §7 item 11) must REPRODUCE the drop on public v31 — if local retains thoughts, the wheelhouse drifted; stop and re-pin.

## 5.2 `swegemma eval` CLI examples (HR §9.1; 03 §6.4; 04 §1.3–1.4)

```bash
source ~/bcf/bin/env.sh && source ~/bcf/venv/bin/activate

# (a) Single task — mechanism smoke (minutes):
swegemma eval \
  --tasks ~/bcf/data/tasks.jsonl \
  --snapshots-dir ~/bcf/data/snapshots \
  --submission-dir ~/bcf/submissions/bcf-31b \
  --results-dir ~/bcf/results/smoke_01 \
  --sandbox docker \
  --task-id rich_3454 \
  --max-tool-calls 50 --max-time-minutes 4.5 \
  --concurrency 1 --display auto

# (b) Subset — the iteration workhorse (3-task quick set from 03 §6.4; the frozen stratified
#     30-task set and its construction recipe are in 04 §1.4 — freeze only after your own gold/empty audit):
swegemma eval \
  --tasks ~/bcf/data/tasks.jsonl \
  --snapshots-dir ~/bcf/data/snapshots \
  --submission-dir ~/bcf/submissions/bcf-31b \
  --results-dir ~/bcf/results/run_01 \
  --sandbox docker \
  --max-tool-calls 50 --max-time-minutes 4.5 \
  --concurrency 1 --display auto \
  --task-ids rich_3454 fastapi_14361 requests_7502

# (c) Full 129 — gate runs only (ESTIMATE 3.5–5.5 h at concurrency 1, warm server):
swegemma eval \
  --tasks ~/bcf/data/tasks.jsonl \
  --snapshots-dir ~/bcf/data/snapshots \
  --submission-dir ~/bcf/submissions/bcf-31b \
  --results-dir ~/bcf/results/full_01 \
  --sandbox docker \
  --max-tool-calls 50 --max-time-minutes 4.5 \
  --concurrency 1 --display auto

# (d) Deterministic shards (checkpointing / resume after a server freeze): task_idx % M == k
swegemma eval ... --shard-index 0 --num-shards 2 --results-dir ~/bcf/results/shard0
swegemma eval ... --shard-index 1 --num-shards 2 --results-dir ~/bcf/results/shard1

# (e) Empty-patch baseline (Phase-2 baseline-failure behavior; the "empty" side of the gold/empty audit):
swegemma eval \
  --tasks ~/bcf/data/tasks.jsonl --snapshots-dir ~/bcf/data/snapshots \
  --submission-dir ~/bcf/submissions/bcf-31b --results-dir ~/bcf/results/empty_audit \
  --sandbox docker --skip-agent-patch
```

Key flags (HR §9.1; 04 §1.3): `--task-id`/`--task-ids` (rapid debugging); `--sandbox {docker,subprocess}`; `--concurrency N` (**keep 1 for 31B** — KV ceiling; E4B may tolerate 2–4, re-check the KV probe); `--shard-index k --num-shards M`; `--max-tool-calls` / `--max-time-minutes` overrides (match the tree: 50 / 4.5 for 31B; 40 / 4.0 for E4B); `--models-yaml` (UNVERIFIED schema, Part 4 §4.10c); `--skip-agent-patch`; `--display auto` (dashboard appears with concurrency > 1).

**Budget-parity check (every new build).** Whether the local CLI honors the submission's `eval_config.yaml` or only its own flags is **UNVERIFIED** (HR §7.1 documents the load for `scripts/inference.py`; probe `swegemma eval --help` for `timeout_seconds`/`max_turns` flags). Safeguards: pass CLI flags equal to the tree's four values (and set `SWE_TIMEOUT_SECONDS`/`SWE_MAX_TIME_MINUTES`/`SWE_MAX_TOOL_CALLS`/`SWE_MAX_TURNS` if your build reads them), then **verify the effective budgets in the artifact**: open `logs/<id>.log` and read the "Task Budget" block + a `get_status` tool result in the trace. If it says 60.0 minutes / unlimited calls, your eval_config was ignored — use the Python driver (04 §1.3; 03 §6.4, §7 item 14). BCF budgets: **31B = 180 s command timeout / 50 calls / 4.5 min / 50 turns; E4B = 150 s / 40 / 4.0 min / 40 turns** (both `eval_config.yaml`, read-only verified).

## 5.3 Docker vs subprocess sandbox — decision table (04 §1.5; HR §4.1; 03 §6.7)

| Dimension | `--sandbox docker` (default) | `--sandbox subprocess` |
|---|---|---|
| Isolation | `swebench-sandbox:latest`, `network_mode="none"`, 4 GiB (OOM kill = exit 137), 2 vCPU, `/workspace`, `TEST_TMPDIR=/tmp` | Temp dir `swegemma_sandbox_<id>_` with workspace/tmp/wheels/venv; path rewriting; process-group SIGKILL on timeout |
| Network | Air-gapped (no PyPI, no vLLM from inside; LLM calls flow harness→127.0.0.1:8000 outside) | Inherits host network behavior — NOT documented as air-gapped (UNVERIFIED; assume NOT isolated) |
| Python | 3.13 (image) | Host venv Python (3.12.13) |
| Resource parity | Matches scorer quotas exactly | No quota; desktop speed leaks into timings |
| Use for | **Every run feeding a tuning decision or submission gate** | Quick CPU-side mechanism drills; machines without Docker; never for parity A/B |

Verify isolation during a run: `docker ps` → grab the sandbox container id, then `docker inspect <id> --format '{{.HostConfig.NetworkMode}} {{.HostConfig.Memory}} {{.HostConfig.CpuQuota}}/{{.HostConfig.CpuPeriod}}'` → expect `none 4294967296 200000/100000` (HR §4.1; 03 §6.7, §7 item 13). Keep the 2-vCPU/4 GiB quota even though the desktop is faster — without it, bootstrap/pytest times under-predict the scorer and your 12 h extrapolation becomes optimistic. Never mix backends within an A/B pair. The subprocess `ensurepip unavailable ... creating venv without pip` warning is benign (visible in GS §5 output).

## 5.4 The Python-driver alternative

Run the Part 4 §4.10d driver (manages its own server, echoes all configs):

```bash
source ~/bcf/bin/env.sh && source ~/bcf/venv/bin/activate
python ~/bcf/bin/run_eval.py ~/bcf/submissions/bcf-31b ~/bcf/results/driver_01 rich_3454
# E4B: python ~/bcf/bin/run_eval.py ~/bcf/submissions/bcf-e4b ~/bcf/results/driver_e4b_01 rich_3454
```

Use it when the CLI cannot set all four budgets, when you need the compaction/cache config echoed, or when you want the harness to manage the server lifecycle (GS-faithful). For gold-patch audits, the same `Evaluator`/`verify_task` Phase-2 path can be driven with `prediction = task["patch"]` — exact invocation UNVERIFIED, probe `swegemma --help` / `swegemma.evaluate` source (03 §7 item 12; 04 §1.7).

## 5.5 Results artifacts tour (HR §9.2; deep interpretation in 04 §2)

```text
~/bcf/results/<run>/
├── summary.json                     # aggregate resolution_rate, resolved count, per-repo breakdown, errors
├── task_results.jsonl               # append-only, one line per finished task (metrics & exit codes)
├── patches/<instance_id>.patch      # exact unified diff extracted from Container A
├── test_outputs/<instance_id>.log   # full Phase-2 pytest STDOUT/STDERR from Container B
├── traces/trace_<instance_id>.json  # SessionTrace: ATIF-compatible steps, thoughts, tool calls, tokens
└── logs/<instance_id>.log           # Rich-formatted Phase-1 agent transcript (incl. the Task Budget block)
```

Add your own `PINS.txt` / `RUN_META.json` per run (track, tree sha256, config hashes, runtime pins, backend, concurrency, flags, mask version, cold/warm, wall time) — without it, runs are incomparable a week later (03 §6.6; 04 §1.8). **Read `04-local-scoring-and-feedback-guide.md` §2–§4 for artifact-by-artifact interpretation, the `resolved=False` decision tree, and failure clustering** — not duplicated here.

## 5.6 Expected first-run outcomes (parity checks, NOT pass gates)

Run the three staged tasks with their gold patches (03 §7 item 12) and expect the PUBLIC-wheelhouse failure signatures — a local PASS on the blocked tasks means your sandbox drifted:

| Task | Expected local outcome | Why |
|---|---|---|
| rich_3454 | gold resolves | rich: 39/48 gold-pass; 3454 not in the blocked list (INTEL audits) |
| fastapi_14361 | pytest **collection error** | inline_snapshot/dirty_equals absent — it is in the 27-list (INTEL §4a) |
| requests_7502 | **httpbin fixture errors** | 12/13 requests tasks fail this way (INTEL C10) |

More generally: gold tasks may fail locally due to dependency gaps; ~68/129 public tasks are discrimination-valid (gold passes AND empty fails); local "resolved" is an upper bound; raw-129 local rates are incomparable to the LB. **Link: 04 §5 (local↔Kaggle correlation caveats — what transfers, what lies, calibration protocol) and 03 §8 divergence register (D1–D18).** Never A/B on the raw 129; freeze a masked valid set first (INTEL implication 15; 04 §1.4).

## 5.7 Warm-server iteration practice (04 §1.2; 03 §3.9)

1. Batch reruns into **one** invocation with `--task-ids` rather than many single-task invocations.
2. Keep the eval process (and its server) alive while you edit prompts/configs in scratch copies; re-invoke only when the submission tree changes.
3. If your build can point the registry at an already-running server (check `--models-yaml` / `api_base` wiring — UNVERIFIED external-server flag), run vLLM as a persistent service; otherwise treat startup as a fixed per-invocation cost and log it.
4. The first task after a cold start pays cold-kernel latency (ESTIMATE +5–20 s). Never use task #1 of a cold run for timing comparisons.
5. One subset run is one observation; a decision needs paired repeats (win-both; ignore single-run deltas <4 tasks; ~10–13% per-task flip rate is normal) (04 §1.4; INTEL C11/C14).

## 5.8 Troubleshooting table (condensed from 03 §10; full table there)

| Symptom | Cause | Fix |
|---|---|---|
| `sm_120 is not compatible` / `no kernel image is available` | torch/vLLM wheel without sm_120 (cu126 or older), or CUDA < 12.8 | torch 2.10.0 cu128/cu129 + vLLM 0.19.1 cu128+ wheel (§4.7 fallback ladder); driver R570+/R580+; source build last resort with `TORCH_CUDA_ARCH_LIST="12.0"` |
| Track A: llvmpipe desktop, `nvidia-smi` fails after driver install | Secure Boot blocked unsigned module (MOK missed) OR proprietary module on Blackwell | Complete MokManager enrollment (or disable Secure Boot); ensure `nvidia-driver-580-open`; check `dpkg -l \| grep nvidia-driver`, `mokutil --sb-state`, `dmesg \| grep -i nvidia` |
| Track A: boot hang after adding graphics-drivers PPA | PPA 580 boot failure on 5090 | `sudo ppa-purge ppa:graphics-drivers/ppa`, install noble restricted `nvidia-driver-580-open` |
| Track B: `cudaErrorUnknown` during CUDA-graph capture; ~8x slow with `--enforce-eager` | WSL < 2.7.0 dxgkrnl bug | `wsl --update`, verify >= 2.7.0, `wsl --shutdown`, retry without enforce-eager |
| Track B: EngineCore spawns, ZMQ never connects | vllm#44732-class V1 WSL2 hang (0.19.1 UNVERIFIED) | Confirm `VLLM_WORKER_MULTIPROC_METHOD=spawn`; diagnostic `VLLM_ENABLE_V1_MULTIPROCESSING=0` (register if kept); persistent → Track A |
| Track B: multi-GiB allocs fail despite "free" VRAM; used ≫ torch reserved | microsoft/WSL#40401 invisible overhead | Part 3 §3.8 probe; FAIL → Track A. No WSL-side workaround known |
| Track B: whole WSL VM crashes during GPU OOM | microsoft/WSL#40732 Hyper-V panic | Never oversubscribe VRAM; size via KV log; `.wslconfig` cap; `wsl --shutdown` + relaunch; reboot Windows if dxgkrnl degraded |
| `ValueError: The model's max seq len (32768) is larger than ... KV cache` | Uniform KV world: ~27.5 GiB needed, ~9–11 GiB available | §4.9 decision tree: fp8 KV → reduce max_model_len → enforce-eager → util 0.95; register D2/D3 |
| Decode collapses 10–30x with no config change; used > physical VRAM | Sysmem fallback paging to RAM (Track B: policy not honored, WSL#11050) | Lower util/max_model_len to fit physical VRAM; Control Panel "Prefer No Sysmem Fallback" (best-effort on WSL); Track A honors it |
| Snapshot extraction / git commit / docker exec 3–10x slower than expected | Hot data on `/mnt/c` or `/mnt/d` (9p/drvfs per-file latency) | Move everything to ext4 (§4.1); one-time copies only from Windows drives |
| `docker run` asks for sudo / permission denied | User not in docker group (or group not applied) | `sudo usermod -aG docker $USER` then `newgrp docker` / log out-in (§2.8) |
| `docker run --gpus all` fails: could not select device driver | Track B: Desktop < 4.31.1 or manual NCT over bundled; Track A: NCT not configured | B1: update Desktop >= 4.31.1, remove manual NCT; B2: no-cgroups flag (UNVERIFIED — probe); A: `sudo nvidia-ctk runtime configure --runtime=docker && sudo systemctl restart docker` |
| `--device nvidia.com/gpu=all` fails under Docker Desktop WSL | Desktop ships no CDI spec | Use `--gpus all` (legacy hook) |
| apt: `NO_PUBKEY ... noble InRelease is not signed` | Docker keyring placement/permissions wrong | Redo §2.8 key steps exactly (`/etc/apt/keyrings/docker.asc`, `chmod a+r`) |
| Tool args contain literal quotes; raw-token leaks; `<pad>` under concurrency | Known gemma4 parser bugs on 0.19.1 (#51284, #44522, #39392) — SAME on Kaggle | Do not upgrade (parity!). Robust arg unescaping, scalar-only schemas, concurrency 1 |
| Server freezes mid-run; every later task scores 0; SIGTERM ignored | gemma4 array-argument parser infinite loop (753973) | `kill -9` the vLLM process, restart, re-run remaining tasks; PREVENT: zero array-typed tool/skill parameters; run the C3 fuzz canary before any submission |
| Structured output ignored when a request sets `enable_thinking=false` | vllm#39130: reasoning parser disables xgrammar in that mode | Keep thinking=True everywhere; never send enable_thinking=false for graded work |
| `reasoning_content` missing between tool calls | 744354 / vllm#38488 family — public v31 behavior (UNFIXED) | Parity, not a local bug (§5.1 must REPRODUCE it); agent restates critical state in visible text |
| `NotImplementedError: The page size of the layer is not divisible ...` at kv_cache_utils.py | Gemma-4 heterogeneous KV page-size bug family (#39914/#40388), often with KV quant | Revert to bf16 KV (`--kv-cache-dtype auto`); avoid int8_per_token_head; if persistent, register and try enforce-eager; keep 0.19.1 |
| fastapi collection `ModuleNotFoundError: inline_snapshot / dirty_equals`; requests httpbin errors | Missing sandbox deps in the public wheelhouse — SAME on Kaggle public env | Do NOT patch-install into the sandbox (legality unanswered); exclude from A/B denominators; frozen valid set |
| `/var/lib/docker` fills root partition (Track A) | vLLM image 10–20 GB + build cache | `data-root` on big partition (§2.10); `docker system prune` / `builder prune` between runs |
| vLLM reachable from LAN despite UFW (Track A) | Docker published ports bypass UFW | Bind `--host 127.0.0.1` (all serve commands do); never publish sandbox ports |

---

# Part 6 — First official Kaggle submissions (MAIN 31B + BONUS E4B)

## 6.1 The submission model (read this before spending a slot)

- **ONE competition:** `gemma-4-developer-agent`. There is **no separate upload portal for the bonus** — a bonus entry is a normal submission to the same competition whose base model is E2B or E4B (INTEL §2a, host OP 751104). The promised daily small-model leaderboard is a separate *notebook*, not a separate submission flow (its freshness is questioned; no staff reply).
- **Bonus terms (751104, host, verbatim):** "$10,000 to the highest-ranking submission utilizing Gemma E2B or Gemma E4B. Final scores are based on the private test set performance." Eligibility: "Submissions must explicitly use either Gemma E2B or Gemma E4B as the base model. For a submission to be eligible it must be one of the team's two selected final submissions." Cross-track: "Submissions eligible for the Small Model Prize remain fully eligible for general leaderboard awards and the Paper Track."
- **Slot math:** a bonus-eligible run consumes **one of your TWO final-selection slots**, but stays eligible for main prizes and the Paper Track — a strong small-model run can double-count. Winner is decided on the **PRIVATE set** with main-track tie-breaks: optimize private-set robustness, not public LB (INTEL §2a, implication 1).
- **Private final = better of your two selected submissions** (standard Kaggle final-selection mechanics; working assumption). The **error-fallback semantics are unanswered** (05 RR14: private multi-run / error-fallback / bonus deadline all open) — so treat each final as if it must stand alone: **both selected submissions must independently finish <12 h** (BRAIN 04 §7.4).
- **Same-variant rule (748287, STAFF):** "Every agent and subagent in your submission must use the same variant (though they can attach different LoRA adapters.)" No mixing 31B and E4B inside one submission. Small models are scored under **identical conditions** ("1. Yes, everything is the same." — same 4xL4, 12 h total, same per-task budgets).
- **Sanctioned QAT aliases (INTEL §2a / 748287):** `gemma-4-31b-it-qat-w4a16-ct` (main), `gemma-4-e4b-it-qat-w4a16-ct`, `gemma-4-e2b-it-qat-w4a16-ct` (bonus), plus `gemma-4-12b-it-qat-w4a16-ct` (registered; not bonus-eligible). Provenance note: the *packaged* Sept-29 HARNESS_README (§3.2) still shows `ALLOWED_MODEL_NAMES` as 31B-only — that snapshot is **stale**; the live Overview (verified 2026-11-11 by the hardening research) lists all four QAT variants as supported for the main competition, with the single-variant-per-submission rule unchanged. The bonus aliases are additionally sanctioned verbatim by the pinned staff thread 748287. If a scorer-side validator ever rejects a non-31B alias, that is the 752128-class "incorrect format" risk — run the C5 canary before betting the bonus slot.

## 6.2 Pre-slot gates (do NOT spend a slot until these pass)

Summarized from 05 §6.1 and BRAIN 04 §7.3 (full detail there):

1. **Validator** on both trees → PASS 0 errors / 0 warnings (Part 5 §5.1; re-run after every change).
2. **C0 official compiler canary** — `compile_submission` accepts both trees; skill tools inject; `skills:` path base resolves (one-line fallback `skills/bcf-spec` ready if root-relative); scalar/zero-arg schemas.
3. **C2-3 nudge-restart** — byte-identical cached spec, tax <=15 s, zero duplicated edits; **C2-4 include_contents boundary** (hard gate).
4. **C3 parser-freeze fuzz** — >=5,000 bracket-heavy scalar payloads against the exact injected schemas, subprocess + hard timeout, **zero hangs** — mandatory before any bonus run.
5. **C5 E4B serving canary** — E4B loads under the sanctioned alias, tool calls parse, clean format, one full task end-to-end — **BEFORE committing the bonus slot**.
6. **C2/C6 wall-clock telemetry** — real per-task setup time feeds the budget decision rule; 120-task extrapolation <=11.0 h (31B) / <=10.5 h (E4B).
7. **C6 replicated resolve rate** — win-both on the masked-68 valid set gates promotion to a slot; **E4B additionally requires a non-zero replicated resolve rate** (hold the slot at 0).

**Hard pre-slot gate order:** C0 (compiler) → C2-3 (restart) → C2-4 (include_contents) → C3 (fuzz) → C5 (E4B) → C2/C6 (wall clock). Keep a validated **fallback bundle** ready at all times (tighter caps, e.g. 31B 4.0 min) plus the pre-validated monolithic variant B as the hierarchy fallback (BRAIN 04 §7.4).

## 6.3 Packaging (agent.yaml at the ROOT of the zip)

Package from the **staged copy**, never the deliverable tree (BRAIN packaging; GS §6; OV Evaluation):

```bash
# MAIN (31B):
cd ~/bcf/submissions/bcf-31b && zip -r ../bcf-31b-v1.zip .
# BONUS (E4B):
cd ~/bcf/submissions/bcf-e4b && zip -r ../bcf-e4b-v1.zip .
# agent.yaml MUST be at the zip root (not nested under submission/). Verify:
unzip -l ~/bcf/submissions/bcf-31b-v1.zip | head    # first entries: agent.yaml, eval_config.yaml, ...
```

Name conventions: `bcf-31b-v1.zip`, `bcf-e4b-v1.zip` (bump v2/v3 per iteration; keep a ledger). Constraints (HR §2.4; GS §6): **total unpacked < 3 GiB** (`MAX_SUBMISSION_SIZE_BYTES = 3,221,225,472`, including adapters); allowed extensions only: `.yaml .yml .md .txt .py .json .safetensors` (pickle weights `.bin/.pt/.pth` rejected). Verify with the organizer's own packaging check (adapted from GS §6 to local paths):

```python
import zipfile
from pathlib import Path
from swegemma.config import ALLOWED_SUBMISSION_EXTENSIONS, MAX_SUBMISSION_SIZE_BYTES

zip_path = Path.home() / "bcf/submissions/bcf-31b-v1.zip"   # or bcf-e4b-v1.zip
with zipfile.ZipFile(zip_path, 'r') as zf:
    infos = zf.infolist()
    total_size = sum(i.file_size for i in infos)
    assert total_size <= MAX_SUBMISSION_SIZE_BYTES, f'Archive exceeds 3 GiB limit: {total_size}'
    for info in infos:
        if not info.is_dir():
            ext = Path(info.filename).suffix.lower()
            assert ext in ALLOWED_SUBMISSION_EXTENSIONS, f'Disallowed file extension: {info.filename}'
print(f'OK: {zip_path} ({zip_path.stat().st_size / (1024 * 1024):.2f} MiB)')
```

(GS §6 uses `shutil.make_archive(..., root_dir=AGENT_DIR)` — equivalent to `cd tree && zip -r ../out.zip .`; both put agent.yaml at the root.) BCF ships no adapters, so both zips are tiny (the sample submission zipped to 0.17 MiB in GS §6).

## 6.4 MAIN submission (31B) — step by step

**UI path:**

1. Open `https://www.kaggle.com/competitions/gemma-4-developer-agent` (signed in, rules accepted, phone verified).
2. Click **Submit Prediction** (the submission button on the competition page).
3. Upload `bcf-31b-v1.zip`, add a submission message (e.g. "BCF 31B v1 — plan→solver, masked-set validated"), submit.

**CLI path (equivalent):**

```bash
kaggle competitions submit -c gemma-4-developer-agent \
  -f ~/bcf/submissions/bcf-31b-v1.zip \
  -m "BCF 31B v1"
```

(Standard Kaggle CLI submit form; the competition slug is from OV/GS. The 1/day + one-pending limits below are INTEL-verified.)

**Cadence and limits (INTEL S2, C13, C18; BRAIN 04 §7.2):**

- **1 submission/day** and **one pending submission at a time** — a second submit while one is scoring returns `400 FAILED_PRECONDITION: Your team already has 1 pending submissions; please wait for one to finish scoring.` There is no cancel.
- **Submit early in the day.** Queue/scoring stalls of **36–52 h** are reported (vs the Oct 13 staff baseline ~14 h); scoring can exceed 24 h and still finish. **Monitor the PENDING state**; escalate same-day with submission IDs in threads **747519 / 743683** (staff precedent Oct 8: timeout extension + reprocessing, latency days).
- **What scoring does:** your zip is compiled and run on Kaggle's **4x L4** rig (vLLM 0.19.1, TP4, max_model_len 32768) against **~120 hidden private-repo tasks** under a **12 h total budget** (inclusive of sandbox setup, exclusive of patch validation). Competitor-reported (staff question 756963 unanswered): exceeding 12 h scores **zero** — design worst-case total runtime bounded (OV Issue Scoring; INTEL C13).
- **Public LB math:** the public split is **58 tasks**; every captured LB score equals floor(k/58) — **1 task = 0.017**. Run-to-run noise is **±1.5–3 tasks** (sd), ~10–13% per-task flip rate; published scores are likely best-of-several-tries. "One run is not a verdict." (INTEL §5, C11, C14.)
- **Rescore is paused** (staff, Sep 28); do not budget on automatic reruns (INTEL S3).

## 6.5 BONUS submission (E4B) — step by step

Same competition, same flow, with the E4B zip:

```bash
kaggle competitions submit -c gemma-4-developer-agent \
  -f ~/bcf/submissions/bcf-e4b-v1.zip \
  -m "BCF E4B v1 — bonus candidate"
```

**Bonus-specific gates (do these BEFORE spending the slot):**

1. **C5 serving canary first** — E4B loads under `gemma-4-e4b-it-qat-w4a16-ct`, tool calls parse, zero-arg skill install runs, one full task completes with clean format (Part 4 §4.8 E4B serve + Part 5 smokes; the contested thinking template and intermittent "incorrect format" reports make this non-negotiable — 05 §6.1 C5, BRAIN R4/R5).
2. **C3 parser fuzz** — the array-argument server freeze was first hit on E4B (753973); zero array-typed parameters anywhere, zero fuzz hangs.
3. **Hold the slot until a non-zero replicated resolve rate is demonstrated** (C6 win-both on the masked set). No E4B empirical score exists for this design yet — do not bet the $10k slot on an unproven serving path (BRAIN R6; 05 C6).
4. Remember the E4B budgets are tighter (150 s / 40 calls / 4.0 min / 40 turns) and the same-variant rule applies to every agent/subagent.

The bonus entry occupies one of your two final slots (§6.6) and remains fully eligible for main prizes and the Paper Track (§6.1).

## 6.6 FINAL SELECTION (before Dec 2)

1. Before the **Final Submission Deadline (Dec 2, 23:59 UTC)**, go to the competition → your **Team settings → Submissions** and **select up to 2 final submissions** (standard Kaggle final-selection UI; the two-slot rule is INTEL-verified via 751104).
2. **Recommended BCF allocation:** **slot 1 = your best 31B** (main-prize contender), **slot 2 = the E4B bonus** (eligible for the $10k AND main prizes — double-count). If the E4B never clears C6, fall back to two 31B variants (BRAIN 04 §7.1).
3. **Private final = better of the two** on the private test set (working assumption, §6.1). Because error-fallback semantics are unanswered, **both finals must independently finish <12 h** — verify each with wall-clock extrapolation (C2/C6), not just the champion.
4. Select on **replicated local eval** (2 runs on a fixed ~30-task set + ~106-task held-out, win-both rule) and cross-task-mix robustness, not single-run peak (INTEL implication 16; BRAIN 04 §7.1). Expect a large final shakeup (public LB is best-of-N noise).
5. **Re-check all open rules/staff threads before locking** (§6.8).

## 6.7 Deadlines table (all 23:59 UTC; OV Timeline; INTEL §2b; BRAIN 04 §7.1)

| Date | Event | Notes / BCF action |
|---|---|---|
| **2026-11-12** | **Paper Track deadline** (optional, $35k) | SEPARATE competition `gemma-4-developer-agent-paper`; submit design + CPU empirical + taxonomy. Also the **safe internal bonus milestone** until the ambiguity resolves |
| **2026-11-25** | **Entry Deadline** (rules acceptance required) + **Team Merger Deadline** | Lock entry; mergers are irreversible with unknown score-carry — pause submissions, compute combined count, get staff answers in 756693 first |
| **2026-12-02** | **Final Submission Deadline** | Lock two finals (one 31B + one E4B); both independently <12 h; re-check open threads before locking |
| Bonus deadline | **Ambiguous: Nov 12 vs Dec 2** | Prizes page says Nov 12 23:59 UTC; bonus announcement says main-track deadlines (Dec 2). Only substantive answer is a competitor EXPERT: Dec 2 (the Nov 12 line is misplaced Paper-Track text). **No staff confirmation.** Working assumption **Dec 2**; safe internal deadline **Nov 12** (INTEL S7, §2b; thread 757244) |

## 6.8 Submission ops (queue defense)

From INTEL implication 7 and BRAIN 04 §7.2 (all [P] = process facts from the capture):

- **Submit early in the day**; validate every ZIP with the official compiler before upload; keep a minimal validated **fallback bundle** ready.
- **Monitor PENDING**; escalate same-day with submission IDs in **747519 / 743683** (known stuck IDs from the capture: 58167555, 58168732, 58169454, 58168380).
- **Budget for lost days, not reruns** — rescore paused since Sep 28; 36–52 h stalls; one-pending gate burns daily slots. Never batch final-day submissions.
- **Never resubmit an unchanged ZIP** hoping for a scorer-side fix (744354 reasoning-drop; no rescores promised).
- **Spend the 1/day cadence on repeated runs of YOUR best config**, not on copying public bundles (noise basis: INTEL implication 16).
- **Re-check open rules threads before locking finals:** 757244 (bonus deadline), 757783 (external compute), 757223 (third-party annotation), 756963 (timeout semantics), 756693 (merger score carry), 744354 (reasoning-fix parity), 753973 (parser freeze). Zero staff posts since the Nov 5 cutoff — plan for the environment **as-is** (INTEL headline, §7).

## 6.9 Reading your scored results

- **Public score = floor(k/58)** — e.g. 0.17 = 10/58 public tasks resolved. It is a **best-retained, noisy sample** of your agent, not a verdict; the private set (~62 tasks, private repos) decides finals and can behave very differently (documented public→hidden transfer failure: a 50%-public agent timed out on hidden at 15 min/task — INTEL C9).
- **Triage a scored run** with the same signatures as local: compile rejection vs timeout vs parser freeze vs empty patches. **Link: 04 §2–§4 (artifact interpretation + failure clustering) and 05 §2–§3 (field-issue coverage + graceful handling).** A "complete, no score" pattern suggests timeout; 0.00 with adapters suggests loading/packaging (INTEL §3 LoRA row).
- Record every scored run (submission ID, message, zip sha256, public score, queue latency) in your ledger — it is your only ground truth for the local↔remote calibration (04 §5.4–5.5).

---

# Part 7 — Quick reference

## 7.1 Version-pin table (the frozen stack; INTEL implication 22; 03 §1)

| Component | Pin | Source |
|---|---|---|
| Inference engine | vLLM **0.19.1** (pins torch==2.10.0; Ray removed) | INTEL impl 22; RTX RQ2–RQ3 |
| PyTorch | **2.10.0+cu128** (or +cu129 if that is what the wheelhouse carries), sm_120 kernels | RTX RQ2; GS §1 |
| transformers | **5.5.x** | RTX RQ2/RQ3 |
| Host Python | **3.12.13** | INTEL impl 22 |
| swegemma | **0.2.11** | INTEL impl 22 |
| adk-submission | **0.2.13** | INTEL impl 22 |
| google-adk | **1.36.1** | INTEL impl 22 |
| Wheelhouse | dataset `metric/gemma-4-developer-agent-wheelhouse` **v31**, dataset-version **19987205**, 41 wheels | GS §1; INTEL §3 |
| gemma4 tool parser SHA-256 | `682b2152b76c031df9c58c3ffbb5b243945be5d8957ebdce00faef1b9de6b889` | INTEL §3 (757782) |
| Sandbox image | `swebench-sandbox:latest` = python:3.13-slim + git/patch/protobuf-compiler/pigz + pytest/pytest-timeout==2.1.0 + shims | HR §4.1; 03 §2.3 |
| Model (main) | `gemma-4-31b-it-qat-w4a16-ct` (W4A16 compressed-tensors QAT, ~17 GB) | HR §3.1; GS §4 |
| Model (bonus) | `gemma-4-e4b-it-qat-w4a16-ct` (~4–5 GB) | INTEL §2a; SRV scope |
| Serving (scorer) | TP4, bf16, util 0.80, max_model_len 32768, gemma4 parsers, thinking ON, LoRA 8/128 | HR §3.1 |
| Serving (local) | TP1, bf16, util 0.90, max_model_len 32768 target (KV-probe branches), same parsers/thinking/LoRA | 03 §5.2 |
| Track A OS/driver | Zorin 18.1 = Ubuntu 24.04.4 noble, kernel 6.17 HWE; `nvidia-driver-580-open` | ZOR RQ1/RQ2 |
| Track B OS/driver | Ubuntu 24.04 on WSL **>= 2.7.0**; Windows GeForce **R580+** only | RTX RQ3/RQ4 |
| Docker | Track A: Engine + NCT (rootful); Track B: Desktop **>= 4.31.1** or Engine + NCT no-cgroups | ZOR RQ3/RQ4; RTX RQ4 |
| Budgets | 31B: 180 s / 50 calls / 4.5 min / 50 turns · E4B: 150 s / 40 / 4.0 min / 40 turns | BCF eval_config.yaml; HR §7.1 |
| Compaction | interval 5 (HR) vs 15 (GS notebook) — scorer value UNVERIFIED; threshold 14,336 / overlap 2 / retention 5 | HR §7.2; GS §5; 03 §6.5 |

**Never upgrade any of these mid-competition** (03 §9.4). Re-verify the parser SHA after ANY pip operation that touches the venv; always `--no-deps` for anything added post-freeze.

## 7.2 Command cheat sheet (one page)

```bash
# --- env (every shell that runs vllm/swegemma) ---
source ~/bcf/bin/env.sh && source ~/bcf/venv/bin/activate

# --- pins (record into ~/bcf/results/PINS.txt) ---
python -c "import vllm, torch, transformers; print(vllm.__version__, torch.__version__, transformers.__version__, torch.cuda.get_device_capability())"
sha256sum ~/bcf/venv/lib/python3.12/site-packages/vllm/tool_parsers/gemma4_tool_parser.py

# --- serve (31B; E4B swaps the model path/name) ---
vllm serve ~/bcf/models/gemma-4-31b-it-qat-w4a16-ct --served-model-name gemma-4-31b-it-qat-w4a16-ct \
  --host 127.0.0.1 --port 8000 --tensor-parallel-size 1 --dtype bfloat16 --max-model-len 32768 \
  --gpu-memory-utilization 0.90 --enable-auto-tool-choice --tool-call-parser gemma4 --reasoning-parser gemma4 \
  --default-chat-template-kwargs '{"enable_thinking": true}' --enable-lora --max-loras 8 --max-lora-rank 128
curl -s http://127.0.0.1:8000/v1/models        # alias check; read "GPU KV cache size: N tokens" in the log

# --- sandbox image (one-time) ---
cd ~/bcf/sandbox-build && docker build -f Dockerfile.sandbox -t swebench-sandbox:latest .
docker run --rm swebench-sandbox:latest bash -lc 'python3 -V; python3 -c "import imp,telnetlib,pytest"; pwd'

# --- evals ---
swegemma eval --tasks ~/bcf/data/tasks.jsonl --snapshots-dir ~/bcf/data/snapshots \
  --submission-dir ~/bcf/submissions/bcf-31b --results-dir ~/bcf/results/smoke_01 \
  --sandbox docker --task-id rich_3454 --max-tool-calls 50 --max-time-minutes 4.5 --concurrency 1
swegemma eval ... --task-ids rich_3454 fastapi_14361 requests_7502      # subset
swegemma eval ... --shard-index 0 --num-shards 2                       # shard
swegemma eval ... --skip-agent-patch                                   # empty baseline
python ~/bcf/bin/run_eval.py ~/bcf/submissions/bcf-31b ~/bcf/results/driver_01 rich_3454   # Python driver

# --- validate + package + submit ---
python -I scratch/bcf-2026-11-11/validate_submission.py <submission_dir>
cd ~/bcf/submissions/bcf-31b && zip -r ../bcf-31b-v1.zip .
kaggle competitions submit -c gemma-4-developer-agent -f ~/bcf/submissions/bcf-31b-v1.zip -m "BCF 31B v1"

# --- Track B extras (PowerShell Admin) ---
# wsl --update ; wsl --version (>= 2.7.0) ; wsl --shutdown
# /usr/lib/wsl/lib/nvidia-smi  (inside WSL)
```

## 7.3 Track decision tree (03 §9.1, letters swapped to this guide)

```text
START (greenfield G914)
│
├─ Want the fastest start and already comfortable with WSL2? ──yes──► TRACK B (Part 3, ~0.5–1.5 h plumbing)
│        │                                                              │
│        no                                                             ▼
│        │                                              Part 4 §4.1–4.7, then §3.8 VRAM probe
│        │                                                │
│        │                                    ┌───────────┼──────────────────────┐
│        │                                  PASS        MARGINAL               FAIL (>6 GiB / alloc fails)
│        │                                    │           │                      │
│        │                                    ▼           ▼                      ▼
│        │                         §3.9 graph-capture   Track B for iteration   TRACK A (Part 2)
│        │                           check              only; Track A for       — no probe gate,
│        │                           │                  final validation        full 32 GB budget
│        │                     ┌─────┴─────┐
│        │                   graphs OK   cudaErrorUnknown / ZMQ hang
│        │                     │           │
│        │                     │      wsl --update >=2.7.0 → retry → still bad? ──► TRACK A
│        │                     ▼           (enforce-eager = temporary degraded mode, D4)
│        │                  TRACK B viable
│        │
└────────┴──► TRACK A (Part 2, recommended primary): Zorin 18.1 + 580-open + Engine + NCT
              Either track: Part 4 shared build → §4.9 KV probe → verification → Part 5 evals → Part 6 submit

FINAL-RUN POLICY: every pre-submission validation run happens on the track that passed ALL
verification items. If Track B was MARGINAL anywhere, final validation = Track A.
```

## 7.4 Glossary

- **Canary** — a small, cheap probe that validates one load-bearing assumption before you spend a scarce submission slot or GPU hours (05 §6.0). C0–C7 ladder in Part 5 §5.1.
- **QAT** — Quantization-Aware Training; the official `-qat-w4a16-ct` checkpoints are trained to tolerate 4-bit weights, serialized in compressed-tensors format (SRV Q2).
- **W4A16** — 4-bit weights, 16-bit activations; served via Marlin weight-only kernels on CC > 8.0 (both L4 sm_89 and 5090 sm_120 qualify) (SRV Q2).
- **TP (tensor parallel)** — splitting weights/KV across GPUs. Scorer TP4 (4x L4); local TP1 (one 5090). TP size changes all-reduce reduction order → token-level outputs differ even at temp 0; compare task metrics, not tokens (SRV Q8; 03 §5.6).
- **KV (cache)** — per-token key/value memory. Gemma-4's heterogeneous sliding/global layers make 32k context fit uncertain on one 32 GB card; the startup log's `GPU KV cache size: N tokens` decides (Part 4 §4.9).
- **F2P / P2P** — FAIL_TO_PASS / PASS_TO_PASS test lists: tests that must flip from failing to passing, and tests that must keep passing, for a task to count as resolved (HR §8.2; DATA pipeline).
- **masked-68** — the discrimination-valid public subset: gold patch passes AND empty patch fails; best local estimate 68/129 (756400). Never A/B on the raw 129; freeze your own audited mask (INTEL implication 15; 04 §1.4).
- **sm_120** — RTX 5090 compute capability 12.0 (consumer Blackwell); needs CUDA >= 12.8 / cu128+ wheels and R570+/R580+ drivers; distinct from datacenter sm_100 (RTX RQ1).
- **Marlin** — weight-only INT4 GEMM kernels used for W4A16 on sm_120 (SRV Q2).
- **MOK** — Machine Owner Key; Secure Boot enrollment for signed kernel modules (ZOR RQ2).
- **NCT** — NVIDIA Container Toolkit; wires the NVIDIA runtime into Docker (`nvidia-ctk runtime configure`) (ZOR RQ4).
- **9p / drvfs** — the WSL2 cross-OS file protocol behind `/mnt/c`; ~1–5 ms per file op → 3–10x slowdown on hot data (RTX RQ4 item 9).
- **Compaction / nudge** — ADK context compaction at 14,336 tokens (keeps last 5 events, summarizes the rest, drops tool results); continuation nudges (max 3) when a turn ends without submit_patch (HR §5.3, §7.2; INTEL C12).
- **One-pending gate** — Kaggle blocks a new submission while one is still scoring (`400 FAILED_PRECONDITION`); combined with 1/day and 36–52 h queues, slots are painfully scarce (INTEL S2).

## 7.5 Companion deliverables (cross-referenced, not duplicated)

- [03 — Local Environment Parity Plan](../2026-11-11-bcf-hardening-research/03-local-env-parity-plan.md) — THE primary source: full pin table, both tracks, probes, divergence register D1–D18, full troubleshooting table, maintenance rules.
- [04 — Local Scoring & Feedback Guide](../2026-11-11-bcf-hardening-research/04-local-scoring-and-feedback-guide.md) — run modes, artifact-by-artifact interpretation, resolved=False decision tree, failure clustering, local↔Kaggle correlation + calibration, results→action plans.
- [05 — Robustness Audit vs Field Issues](../2026-11-11-bcf-hardening-research/05-robustness-audit-vs-field-issues.md) — coverage matrix, fixes applied, canary concept + C0–C7 detailed checklist (§6), residual-risk register.
- [02 — Time Bottlenecks and Tuning](../2026-11-11-bcf-hardening-research/02-time-bottlenecks-and-tuning.md) — runtime context: 9p penalty, warm server, KV ceiling estimates, measurement plan M1–M15.
- [BCF brain README](../2026-11-11-bcf-gemma4-brain/README.md) — deliverables map, verified metrics, canary gates, packaging.
- [BCF design justification](../2026-11-11-bcf-gemma4-brain/04-task2-bcf-design-justification.md) — §6 risk register, §7 submission ops plan, evidence appendices.
- [Intel brief 2026-11-11](../../input/kagglecomp/intel_20261111/00-intel-brief-2026-11-11.md) — deadlines, queue state, bonus terms, harness bug-fix table, open questions.
- [HARNESS_README](../../input/kagglecomp/kagglecomp_data_package/HARNESS_README.md) — the harness contract (§3 serving, §4 sandbox, §7 budgets, §9 CLI, §10 gotchas).
- [Getting Started notebook](../../input/kagglecomp/docs/markdown/Kaggle-03-GettingStarted.md) — the organizer flow this guide's Part 4 replicates.

---

*End of guide. Every command and pin above is cited to the local sources in the source key; UNVERIFIED items carry probe steps; nothing in `input/` or the BCF submission trees was modified. Companion deep content lives in 03/04/05 — this guide is the ordered, copy-pasteable path from bare metal to a scored submission.*