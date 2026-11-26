# Task 3 - Making the local rig behave like the Kaggle scorer: feature-parity plan for Windows 11 with WSL2 and for Zorin OS 18

**Prepared:** 2026-11-24. **Rig:** PowerSpec G914 (AMD Ryzen 9 9950X3D, NVIDIA GeForce RTX 5090 with 32 GB GDDR7 on PCIe Gen 5, 64 GB DDR5-6000 with sockets for 128 GB, 2 TB NVMe, AMD X870E board, 5 GbE LAN, Wi-Fi 7, 1,200 W supply; vendor page fetched 2026-11-24). **Target:** the scoring environment of the Gemma 4 Developer Agent competition as documented by its sources, not as guessed.

---

## 0. What "the remote environment" is

Every row states where the value comes from. Rows marked "staff notebook" come from the official Getting Started notebook (version 3, last run 2026-11-21), which is the closest public description of the scoring run.

| Dimension | Scoring environment | Source | Confidence |
| --- | --- | --- | --- |
| GPUs | 4 x NVIDIA L4, 24 GB GDDR6 each, 96 GB total | Overview page; HARNESS_README section 3.1; Google Cloud L4 page (24 GB per GPU) | High |
| Serving | vLLM 0.19.1, `tensor_parallel_size=4`, `max_model_len=32768`, `dtype=bfloat16`, `tool_call_parser=gemma4`, `reasoning_parser=gemma4`, `enable_auto_tool_choice`, thinking enabled by default | Staff notebook, cell 8 | High |
| GPU memory for vLLM | `gpu_memory_utilization=0.90` in the staff notebook; the older README says 0.80 | Notebook cell 8; README section 3.1; thread 759388 asks which the scorer uses | Medium: plan for 0.90 (21.6 GB per L4) |
| Scheduler | `scheduler_reserve_full_isl=False` (vLLM's default is `True`) | Notebook cell 8; vLLM 0.19.1 engine arguments | High |
| LoRA | enabled only when adapters are present; `max_loras` equals the number of adapters; rank up to 128 | Notebook cell 8 | High |
| Server start allowance | 1,200 seconds (`startup_timeout=60*20`, `VLLM_ENGINE_READY_TIMEOUT_S=1200`) | Notebook cell 2 and cell 8 | High |
| Harness process | Python 3.12.13 in the Kaggle image `gcr.io/kaggle-private-byod/python@sha256:37c64f7d...` | Notebook metadata; thread 748287 (wheelhouse v31 works on 3.12.13, fails on 3.13.15) | High |
| Task sandbox (scorer) | Docker, image built `FROM python:3.13-slim`, `network_mode='none'`, 4 GiB memory, 2 vCPUs, `/workspace`, git identity `agent@eval` | `docker/Dockerfile.sandbox`; `swegemma/sandbox/docker.py`; README section 4.1 | High for the image definition; the use of the Docker backend on the scorer is inferred from "the competition's persistent Docker container" (Overview) and is the open question of thread 754586 |
| Task sandbox (staff notebook) | Subprocess backend on the host: temp root with `workspace/`, `tmp/`, `wheels/`, `venv/`; `/workspace`, `/tmp`, `/wheels`, `/usr/local/bin` rewritten in the command text; no editable install and no test-dependency install | `swegemma/sandbox/subprocess.py`; `container_setup.py` skips both installs for the subprocess backend | High |
| Packages | wheelhouse v31 (2026-10-12): vLLM 0.19.1, transformers 5.13.1, flashinfer 0.6.6, compressed-tensors 0.15.0.1, google-adk 1.36.1, swegemma 0.2.11, adk-submission 0.2.13, adk-eval-core 0.1.0 and 33 more; installed `--no-deps` over the image's own torch (2.10.0+cu128 and Triton 3.6.0 per thread 751311) | Wheelhouse metadata and listing read 2026-11-24; notebook cell 2 | High |
| Host resources | Notebook sessions: 12-hour cap, 4 CPU cores and 30 GB RAM are documented for the standard session; the L4x4 machine's CPU and RAM are not documented on the page | Kaggle Notebooks documentation (fetched 2026-11-24) | Medium |
| Network | None inside the sandbox; "All L4 sessions must have internet disabled" | Harness source; Overview page | High |
| Context management | Compaction at 14,336 tokens, overlap 2, retention 5; interval 15 in the notebook and 5 in the README | Notebook cell 10; README section 7.2 | Medium on the interval, high on the threshold |
| Budgets | From the submission's `eval_config.yaml`; otherwise 60 minutes, 100 tool calls, no turn cap, 300-second command timeout | Notebook cell 10; README section 7.1 | High |
| Transient-error retries | Up to 5 retries, 2 s initial backoff, doubling, 60 s cap, 20% jitter | README section 7.2 | High |
| Task set | About 120 hidden tasks from private repositories; 58 of them form the public leaderboard; staff said none of the private tasks touches an async function | Board 761060, 756400, 745998 | Medium |
| The 12-hour clock | Stage 1 only (setup and agent loop), all or nothing | Overview page | High |

---

## 1. The parity matrix

"Gap" is what remains different after the best local setup. "Mitigation" is how to stop the gap from producing a wrong decision.

| Dimension | Scorer | Windows 11 + WSL2 | Zorin OS 18.1 | Gap that remains | Mitigation |
| --- | --- | --- | --- | --- | --- |
| GPU architecture | L4, sm_89 (Ada) | RTX 5090, sm_120 (Blackwell) | same card | Different kernels for the same vLLM build: the quantized (Marlin) kernels and the Triton attention kernels are selected per architecture | Decide on paired comparisons, never on absolute numbers; confirm the two finalists in the notebook tier (Task 2, tier T4) |
| Decode rate | 13 to 25 tokens per second | 40 to 60 (estimate, unmeasured) | same | Local runs are 2 to 3.5 times faster, so time gates fire late | Project local runs to scorer time (Task 2, C.2) or add load until each stream runs at the scorer's rate |
| Memory bandwidth | 4 x 300 GB/s shared through tensor parallelism | 1,792 GB/s on one card | same | Same as above | Same as above |
| Harness interpreter | 3.12.13 | 3.12.13 with `uv` | 3.12.13 with `uv` | None if pinned | `uv python install 3.12.13` |
| Sandbox interpreter | 3.13 (Docker image) | 3.13 in the Docker image; 3.12.13 in the subprocess backend | same | The subprocess backend is one minor version off | Use Docker for every decision that depends on the repository's behaviour under 3.13 |
| Sandbox isolation | network none, 4 GiB, 2 vCPUs | Docker: same flags; subprocess: none | same | None in Docker mode | Run the acceptance panel in Docker |
| Test dependencies | installed in the image from the task wheels | Docker image built with `Dockerfile.public`: same; subprocess: only what the host has | same | The subprocess backend cannot grade 29 tasks | Docker mode for scoring; or add the five missing packages to the host |
| vLLM build | wheelhouse v31 | wheelhouse v31 | wheelhouse v31 | None | Install from the wheelhouse with the notebook's rename step |
| Attention backend | selected by vLLM for Gemma 4 on sm_89 | selected for sm_120 | same | Both are 0.19.x on a model with mixed head dimensions, which forces a non-default backend; which one is chosen per architecture is logged at start | Record the "Using ... backend" line on both machines and in the notebook tier |
| Host CPU and RAM for the harness | undocumented; at least 4 cores | 16 cores and 32 threads, 64 GB (give the WSL VM 32 GB and 16 processors) | all of it | The local machine has more CPU than the scorer, so tool calls return sooner | The projection keeps tool time; measure tool time separately |
| Queue | hours | none | none | None | Nothing to do |
| Task set | hidden, about 120 | the 129 public tasks | same | Different repositories | Treat public results as a ranking signal only |

---

## 2. Track A: Windows 11 Pro with WSL2

### A.1 What WSL2 gives and what it costs

| Property | Fact | Source | Consequence for parity |
| --- | --- | --- | --- |
| vLLM does not run on Windows | "vLLM does not support Windows natively. To run vLLM on Windows, you can use the Windows Subsystem for Linux (WSL) with a compatible Linux distribution" | vLLM 0.19.1 installation page | Everything that touches the model runs inside WSL2; native Windows is for editing and for the static tiers only |
| The GPU is paravirtualised | "GPU acceleration in WSL is available on NVIDIA GeForce and NVIDIA RTX GPUs running in WDDM mode. It is not available on NVIDIA RTX GPUs running in TCC mode or on data center GPUs" | CUDA on WSL User Guide v13.5 | The 5090 in a desktop is in WDDM mode: supported |
| One driver only | "Once a Windows NVIDIA GPU driver is installed on the system, CUDA becomes available within WSL. The CUDA driver installed on the Windows host is stubbed inside WSL as libcuda.so. Therefore, you must not install any NVIDIA Linux GPU driver within WSL. Do not install the cuda-drivers or nvidia-open packages." | CUDA on WSL User Guide v13.5 | Never install a driver inside the distro; the WSL-Ubuntu CUDA repository is deprecated and has no toolkit 13.4 or later |
| Memory is capped | WSL 2 `memory` default is "50% of total memory on Windows"; `processors` default is "The same number of logical processors on Windows" | `.wslconfig` documentation | With 64 GB the VM gets 32 GB by default, enough for the harness and for staging one set of weights |
| Memory is not returned promptly | `autoMemoryReclaim` (experimental): `disabled`, `gradual` or `dropCache` (the default) | `.wslconfig` documentation | After a server stop the VM keeps its RAM until the cache is dropped; `wsl --shutdown` between heavy sessions |
| Files | Keep project files in the Linux file system, not under `/mnt/c` | WSL environment guide | Weights, snapshots, wheels and results live on ext4 inside the VHDX; `/mnt/d` is for the downloaded zip and the deliverables only |
| Systemd | Add `[boot]` `systemd=true` to `/etc/wsl.conf`, then `wsl.exe --shutdown`; verify with `systemctl list-unit-files --type=service` | WSL systemd guide | Needed for Docker Engine installed inside the distro |
| Networking | Default NAT; `mirrored` mode is recommended by Microsoft for the newest features; `localhostForwarding` is `true` by default | WSL networking and `.wslconfig` documentation | The harness and vLLM both run inside the distro and talk over `127.0.0.1:8000`; no cross-OS port matters |
| Pinned host memory is limited | "Pinned system memory ... availability for applications is limited. For example, some deep learning training workloads ... can exceed this limit and may not work." | CUDA on WSL User Guide v13.5, Known Limitations | Weight loading, CUDA graph capture and vLLM's sleep mode (level 1 backs weights up in CPU memory) touch pinned memory; if the server fails to start under WSL2 and starts on Zorin, this is the first suspect |
| No full unified memory | "Full Unified Memory features are not available ... Concurrent CPU/GPU access is not supported." | same | Not used by this stack |
| `nvidia-smi` is partial | "NVML (nvidia-smi) does not support all the queries yet. GPU utilization, active compute process are some queries that are not yet supported." | same, Features Not Yet Supported | Do not use GPU utilization as a health signal under WSL2; use the server's `/metrics` endpoint |
| Container toolkit | "Docker support: Supported with the latest NVIDIA Container Toolkit, using Docker CLI or Docker Desktop." "With the NVIDIA Container Toolkit for Docker, only `--gpus all` is supported." | same | One GPU, so `--gpus all` is all you need; do not try to select a GPU by index |

### A.2 Build order

The commands are in Task 7 of this package. The order matters for four reasons, stated here so that a failure can be placed:

1. **Driver on Windows first.** The Windows driver is the only driver (above). Check with `nvidia-smi` on Windows and with `/usr/lib/wsl/lib/nvidia-smi` inside the distro.
2. **Python 3.12.13 exactly**, through `uv`, because three wheelhouse wheels are built for 3.12 only (thread 748287: they failed on 3.13.15).
3. **The wheelhouse wheels, with the notebook's two corrections**: skip the cutlass wheels and restore the `+cu128` local version that Kaggle's upload strips from file names. Without the rename, `pip` sees a different torch build from the one the image has and reinstalls or refuses.
4. **Two sandboxes, two roles**: the subprocess backend for daily iteration (fast, no Docker), the Docker backend for the acceptance panel (3.13, network none, 4 GiB, 2 vCPUs, test dependencies installed from the task wheels).

### A.3 What can differ from the scorer and how to notice

| Symptom under WSL2 | Likely cause | Check | Fix |
| --- | --- | --- | --- |
| `torch.cuda.is_available()` is `False` although `nvidia-smi` works | Stale WSL kernel | `wsl.exe --version` | `wsl.exe --update`, then `wsl.exe --shutdown` |
| vLLM fails while allocating or capturing graphs | Pinned-memory limit of the GPU paravirtualisation | Run the same command on Zorin | `PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True` (the notebook sets it), a lower `gpu_memory_utilization`, or run the server on Zorin |
| The model loads slowly | Weights read through `/mnt/` | `df -h <model dir>` | Move the model cache to ext4 |
| Docker cannot see the GPU | Toolkit not configured, or Docker Desktop and Docker Engine both installed | `docker run --rm --gpus all ubuntu nvidia-smi` | `nvidia-ctk runtime configure --runtime=docker`, restart Docker; use one Docker |
| `localhost:8000` unreachable from a Windows browser | Expected with NAT; the harness runs inside the distro and does not need it | `curl` from inside the distro | None for parity; `networkingMode=mirrored` if you want a Windows browser to reach the server |
| The VM keeps 30 GB after a run | Cache not reclaimed | Windows Task Manager, the Vmmem process | `wsl --shutdown` between sessions |

---

## 3. Track B: Zorin OS 18.1 (native Linux)

### B.1 What the platform is

| Property | Fact | Source | Consequence for parity |
| --- | --- | --- | --- |
| Version | Zorin OS 18.1 is the latest version: released 2026-04-15, supported with software updates and security patches until 1 June 2029 | Zorin OS technical details page and release post, fetched 2026-11-24 | Use 18.1, not 18.0 |
| Base | Ubuntu 24.04 LTS | same | Every Ubuntu "noble" package and repository applies |
| Kernel | Linux 6.17, "the same version as in the latest Ubuntu 25.10", "with updated drivers ... NVIDIA graphics cards" | Zorin OS 18.1 release post | Newer than Ubuntu 24.04's own kernel; NVIDIA modules build through DKMS and need the headers of the running kernel |
| App formats | APT, Flatpak, Snap | technical details page | Use APT for the stack; Flatpak is irrelevant to a headless server |
| Docker | "Installation on Ubuntu derivative distributions, such as Linux Mint, is not officially supported (though it may work)" | Docker Engine installation guide for Ubuntu | It works with the `noble` repository; the documented command that interpolates the version id yields `18`, for which no repository exists |
| Driver | The RTX 5090 (sm_120) needs the Blackwell-capable driver line, 570 or later on Linux; the earlier guide of this project installed 580.196.07 from NVIDIA's repository for Ubuntu 24.04 | Prior local-testing guide (2026-10-31), citing NVIDIA's repository; the version was not re-verified today | Install through the package manager, never with a `.run` installer; read the current branch from the repository before installing |

### B.2 Build order

1. **Driver**: `linux-headers-$(uname -r)`, `dkms`, `build-essential`, then `ubuntu-drivers` or the NVIDIA repository; reboot; `nvidia-smi` shows the 5090 and a CUDA version of 12.8 or later.
2. **Python 3.12.13** through `uv`, then the wheelhouse wheels with the notebook's corrections.
3. **Docker Engine** from the `noble` repository, the NVIDIA Container Toolkit, `nvidia-ctk runtime configure --runtime=docker`.
4. **The same two sandboxes** as in Track A.

### B.3 What is better than Track A, and what is worse

| Better | Worse |
| --- | --- |
| No paravirtualisation: pinned memory, unified memory and every `nvidia-smi` query behave as on a server | A dual-boot machine: the Windows side holds the deliverables and the data package, so a shared NTFS volume or a second ext4 volume is needed |
| Native Docker with the NVIDIA runtime | Kernel 6.17 is newer than the driver branch was tested with at release; after every kernel update, check `nvidia-smi` before starting work |
| All 16 cores and all 64 GB are visible to the harness without a VM boundary | A derivative distribution: when a package is missing, read the Ubuntu 24.04 answer, not the Zorin one |
| The same ext4 file system for weights and snapshots | Secure Boot: the signed Ubuntu driver packages load without enrollment; a `.run` installer does not |

For the shared NTFS volume, mount it with the in-kernel `ntfs3` driver (not the FUSE `ntfs-3g`), disable Windows fast startup so that Linux can mount it read-write, and keep the model cache and the snapshot store on ext4.

---

## 4. Three rungs of local parity

| Rung | Where | What matches the scorer | What does not | Use it for |
| --- | --- | --- | --- | --- |
| R1 | Subprocess backend on the host, 3.12.13 | Harness versions, vLLM build, model, prompts, budgets, compaction, nudges | Sandbox interpreter (3.12 instead of 3.13), isolation (no network block, no memory and CPU caps), test dependencies (29 tasks ungradable), GPU speed | Daily iteration: tiers T2 and T3 of Task 2 |
| R2 | Docker backend on the host | Everything of R1 plus the sandbox interpreter (3.13), network none, 4 GiB, 2 vCPUs, the editable install, the test dependencies from the task wheels | GPU architecture and speed, host CPU count | The acceptance panel of every bundle; any question about how the repository behaves on 3.13 |
| R3 | Kaggle notebook with the staff Getting Started harness on L4x4 | The GPUs, the image, the harness, the model, the mount paths, the absence of internet | The subprocess backend (not Docker), the queue, the quota | The speed parity check and the final confirmation of the two finalists |

A decision that changes a submission should be confirmed on R2, and a decision about time should be confirmed on R3.

---

## 5. Acceptance tests for either track

Run these once after the build and after any change to the stack. Each has a pass condition that does not depend on the model.

| Test | Command or action | Pass condition | What it proves |
| --- | --- | --- | --- |
| V1 Interpreter versions | `python --version` in the harness environment; `docker run --rm swebench-sandbox:latest python3 --version` | 3.12.13 and 3.13.x | The two interpreters are the intended ones |
| V2 GPU visible to torch | `python -c "import torch; print(torch.cuda.is_available(), torch.cuda.get_device_capability())"` | `True (12, 0)` | The Blackwell build is installed |
| V3 vLLM build | `python -c "import vllm; print(vllm.__version__)"` | `0.19.1` | The wheelhouse build, not a newer PyPI build |
| V4 Server | Start vLLM with the notebook's settings and read the log lines for the attention backend and the KV-cache size | Server answers `/v1/models`; the two lines are recorded | The rig is characterised |
| V5 Rate | One prompt of 2,000 output tokens; tokens per second from the log | A number, written down | The projection factor for Task 2 |
| V6 Gold control, Docker | `swegemma eval --skip-agent-patch` is the baseline; then apply the 129 gold patches through the verification phase | With the five missing test packages added, 127 of 129 pass (the earlier guide's bar); without them, 100 of 129 | The sandbox can grade |
| V7 Baseline fails | `swegemma eval ... --skip-agent-patch` on the panel | Every task unresolved | The tests really test something |
| V8 Budget | A bundle with `max_time_minutes: 1` on one task | The task ends at about 60 s with the patch extracted | The cap wraps the agent loop |
| V9 Protected paths | A bundle that edits `tests/test_x.py` and `pyproject.toml` | The patch file contains neither | The reset rule is active |
| V10 Sandbox limits | `cat /proc/meminfo` and `nproc` through `run_command` in Docker mode | About 4 GiB and 2 | The container flags are active |
| V11 No network | `python3 -c "import urllib.request; urllib.request.urlopen('https://example.org', timeout=5)"` through `run_command` | `OSError` with errno 101 | The network block is active |
| V12 Brain | `python build.py`, `python -m unittest tests.test_bcf`, `python tools/run_validator.py` | 6 bundles, 36 pass and 1 skipped, 6 of 6 and 15 of 15 | The brain is intact |

V6 needs a word of warning: `--skip-agent-patch` runs the verification phase with an empty patch and is the *baseline* test (V7). To run the gold control, use the replay tool of the brain package (`tools/replay_gold.py`) for the editor fidelity, and the harness with the gold patches as the submission for the verification phase; the earlier local-testing guide (2026-10-31, file 05) has the procedure.

---

## 6. Irreducible differences

| Difference | Why it cannot be closed | What to do about it |
| --- | --- | --- |
| The GPU architecture | You cannot put an L4 in the machine | Decide on paired comparisons; confirm on R3 before the last submission |
| The hidden task set | Private repositories | Treat the public panel as a ranking signal |
| Concurrency on the scorer | Set by the scoring notebook | Plan the mean task time with a margin |
| The queue | Platform capacity | Submit early in the day and early in the week |
| The Docker versus subprocess backend in the notebook tier | The staff notebook uses subprocess | Use R2 for questions about the sandbox, R3 for questions about speed |

---

## 7. Sources

| Source | Publisher | Date | Used for |
| --- | --- | --- | --- |
| [Getting Started - Gemma 4 Developer Agent](https://www.kaggle.com/code/ryanholbrook/getting-started-gemma-4-developer-agent) | Ryan Holbrook (staff) | version 3, last run 2026-11-21; fetched 2026-11-24 through the anonymous kernel API | Serving settings, environment variables, sandbox backend, compaction, image digest, Python 3.12.13 |
| Competition [Overview](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview) and [Data](https://www.kaggle.com/competitions/gemma-4-developer-agent/data) pages | Kaggle | fetched 2026-11-24 | 4x L4, L4x4 quota, no internet, the hidden test set replaces the training set at scoring |
| [G914 Gaming PC](https://powerspec.com/product/698934) | PowerSpec | fetched 2026-11-24 | The machine's specification |
| [CUDA on WSL User Guide](https://docs.nvidia.com/cuda/wsl-user-guide/index.html) | NVIDIA | v13.5, fetched 2026-11-24 | Driver rule, limitations, unsupported features, Docker support |
| [`.wslconfig`](https://learn.microsoft.com/en-us/windows/wsl/wsl-config), [GPU compute](https://learn.microsoft.com/en-us/windows/wsl/tutorials/gpu-compute), [systemd](https://learn.microsoft.com/en-us/windows/wsl/systemd), [networking](https://learn.microsoft.com/en-us/windows/wsl/networking), [install](https://learn.microsoft.com/en-us/windows/wsl/install), [disk space](https://learn.microsoft.com/en-us/windows/wsl/disk-space), [development environment guide](https://learn.microsoft.com/en-us/windows/wsl/setup/environment) | Microsoft Learn | fetched 2026-11-24 | VM defaults, file placement, systemd, NAT and mirrored modes |
| [vLLM 0.19.1 installation](https://docs.vllm.ai/en/v0.19.1/getting_started/installation/gpu.html) and [engine arguments](https://docs.vllm.ai/en/v0.19.1/configuration/engine_args.html) | vLLM project | fetched 2026-11-24 | No native Windows, Python 3.10 to 3.13, CUDA 12.9 builds, defaults |
| [Zorin OS technical details](https://zorin.com/os/details/) and [Zorin OS 18.1 is released](https://blog.zorin.com/2026/04/15/zorin-os-18.1-is-released/) | Zorin | fetched 2026-11-24 | Version, base, kernel 6.17, support window |
| [Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/) | Docker | fetched 2026-11-24 | Supported versions, derivative-distribution caveat, commands |
| [NVIDIA Container Toolkit installation guide](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html) | NVIDIA | fetched 2026-11-24 | Repository and `nvidia-ctk` commands |
| [uv installation](https://docs.astral.sh/uv/getting-started/installation/) and [installing Python](https://docs.astral.sh/uv/guides/install-python/) | Astral | fetched 2026-11-24 | Installer and `uv python install` |
| [GPU platforms: L4](https://cloud.google.com/compute/docs/gpus#l4-gpus) | Google Cloud | fetched 2026-11-24 | 24 GB GDDR6 per L4 |
| Wheelhouse metadata and listing, harness source, `docker/Dockerfile.sandbox` | Kaggle | read 2026-11-24 | Versions, sandbox image, container flags |
| [New Gemma 4 Models Available](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/748287), [Which public tasks cannot pass in the scorer's sandbox](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754586) | Kaggle staff and competitors | 2026-10-11, 2026-10-31 | Python 3.12.13 versus 3.13.15, sandbox behaviour |
| RTX 5090 local-testing guide of 2026-10-31 (files 01, 02, 03, 05) | this project | 2026-10-31 | The 127-of-129 gold bar, driver floors, TRITON attention fallback, installed-torch versions |
