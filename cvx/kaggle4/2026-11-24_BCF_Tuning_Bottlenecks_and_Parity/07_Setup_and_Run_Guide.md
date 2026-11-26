# Task 7 - Setup, install and run guide: the local test harness for the BCF brain on a PowerSpec G914, with official submissions for the main and the bonus track

**Prepared:** 2026-11-24. **Machine:** PowerSpec G914 (AMD Ryzen 9 9950X3D, 16 cores and 32 threads; NVIDIA GeForce RTX 5090 with 32 GB; 64 GB DDR5-6000; 2 TB NVMe; AMD X870E; Windows 11 Pro as shipped). **Two tracks:** A, Windows 11 Pro with WSL2; B, Zorin OS 18.1. **Brain:** `bcf-brain-patched/` in this package.

---

## 0. Read this first

| Item | Statement |
| --- | --- |
| What you will have at the end | One vLLM server of the exact competition build, the official harness, the 129 public tasks, a smoke panel and a ranking panel, the brain's build-and-validate loop, and a notebook that produces a valid `submission.zip` |
| What was executed for this document | The brain's build, tests, official validation, replay and probes (Windows, Python 3.12.10); the Kaggle pages, the staff notebook, the wheelhouse metadata, and the vendor and documentation pages named in section 13 |
| What was **not** executed | The install steps on a greenfield G914. They follow the official documentation of each tool and the staff Getting Started notebook; every command that this document could not run is marked "not run here". Run section 12's acceptance table once and you will know |
| Time needed | About half a day per track the first time, most of it downloads (21.9 GB of data, 17 to 18 GB of weights per model, 0.9 GB of wheels) |
| The three things that break parity if skipped | Python must be exactly 3.12.13 for the harness; the wheelhouse wheels must be installed with the notebook's two corrections; the eval must be run with the notebook's `EvalConfig` settings (`tools/run_panel.py`), not with the bare `swegemma eval` command |

---

## 1. The pieces

| Piece | Version | Size | Source |
| --- | --- | --- | --- |
| Driver | NVIDIA 580 or newer on Linux, 570.65 or newer on Windows; the same Windows driver serves WSL2 | - | The distribution's package manager on Zorin; Windows Update or NVIDIA on Windows |
| Python | 3.12.13 for the harness; 3.13 comes from the sandbox image | - | `uv python install 3.12.13` |
| Serving stack | vLLM 0.19.1, transformers 5.13.1, flashinfer 0.6.6, compressed-tensors 0.15.0.1 and 37 more wheels | 0.88 GB | The public wheelhouse, version 31 (`metric/gemma-4-developer-agent-wheelhouse`) |
| PyTorch | 2.10.0 built for CUDA 12.8 (not in the wheelhouse; pre-installed in the Kaggle image) | about 3 GB | `download.pytorch.org/whl/cu128` |
| Harness | swegemma 0.2.11, adk-submission 0.2.13, adk-eval-core 0.1.0, google-adk 1.36.1 | in the wheelhouse | same |
| Tasks | 129 published tasks with snapshots, graphs, embeddings, test wheels and the sandbox Dockerfiles | 21.9 GB compressed | The competition's Data page (rules must be accepted) |
| Model | `gemma-4-31b-it-qat-w4a16-ct` (17 to 18 GB) and `gemma-4-e4b-it-qat-w4a16-ct` for the bonus track | - | Kaggle Models (`google/gemma-4`) or Hugging Face (`google`) |
| Brain | `bcf-brain-patched/` in this package | 76 KB per bundle | this package |
| Container tools | Docker Engine and the NVIDIA Container Toolkit (only for the Docker sandbox) | - | `download.docker.com`, `nvidia.github.io` |
| Kaggle command line | the `kaggle` package, with your API token | - | `pypi.org/project/kaggle` |

---

## 2. Folder layout (the same on both tracks)

| Path inside Linux | Holds |
| --- | --- |
| `~/bcf/.venv` | the Python 3.12.13 environment with torch, vLLM and the wheelhouse |
| `~/bcf/models/<model name>` | the weights, one folder per model |
| `~/bcf/data/gemma-4-developer-agent/` | the unpacked data package: `tasks.jsonl`, `snapshots/`, `graphs/`, `embeddings/`, `wheels/`, `docker/`, `sandbox/`, `sample_submission/` |
| `~/bcf/brain/` | `bcf-brain-patched/` copied here, with `dist/` (the six bundles) and `tools/` |
| `~/bcf/results/<run name>` | one folder per run |
| `~/bcf/submit/` | the bundle to submit and `submission.zip` |

On Windows these paths are inside the WSL2 distribution's own file system (`\\wsl$\Ubuntu-24.04\home\<user>\bcf` from Windows), never under `/mnt/c` or `/mnt/d`: Microsoft's guidance is to keep project files in the Linux file system, and model weights read through `/mnt` load slowly. The 2 TB NVMe of the G914 holds both systems: about 120 GB for Windows and 80 GB for Zorin leaves roughly 800 GB each.

---

## 3. Track B: Zorin OS 18.1

Zorin OS 18.1 is the current version (released 2026-04-15): Ubuntu 24.04 LTS underneath, Linux 6.17, supported to 2029. Everything written for Ubuntu 24.04 applies.

### B.1 Install

1. Download the Zorin OS 18.1 Core 64-bit image and write it to a USB stick with balenaEtcher or Rufus (not run here).
2. Boot the G914 from the stick. In the installer choose **Install alongside Windows** (or "Something else" to size the partitions), keep the Windows bootloader, and create your user.
3. If the installer does not boot with the NVIDIA card visible, choose the "safe graphics" option on the boot menu; the driver is installed after the first boot.
4. After the first login: open **Software** and install updates, then reboot.

### B.2 Driver

```bash
sudo apt update
sudo apt install -y linux-headers-$(uname -r) build-essential dkms pciutils
ubuntu-drivers devices                       # lists what can be installed
sudo ubuntu-drivers install --gpgpu nvidia:580
sudo reboot
nvidia-smi                                   # expect: RTX 5090, driver 580 or newer, CUDA 12.8 or later
```

Use the package manager, never a `.run` installer: the packages carry signed modules that load with Secure Boot on. After every kernel update, check `nvidia-smi` before you start work; the module is rebuilt for the new kernel by DKMS and needs its headers.

### B.3 Base tools, `uv`, Python 3.12.13

```bash
sudo apt install -y git curl unzip pigz patch protobuf-compiler
curl -LsSf https://astral.sh/uv/install.sh | sh
source "$HOME/.local/bin/env"
uv python install 3.12.13
uv --version && uv python list | grep 3.12.13
```

### B.4 The environment

```bash
mkdir -p ~/bcf && cd ~/bcf
uv venv --python 3.12.13 .venv && source .venv/bin/activate
# 1. PyTorch for Blackwell (sm_120 needs CUDA 12.8 or later)
uv pip install torch==2.10.0+cu128 torchaudio==2.10.0+cu128 torchvision==0.25.0+cu128 \
  --index-url https://download.pytorch.org/whl/cu128
# 2. the dependencies of vLLM 0.19.1 (the pinned wheel comes from the wheelhouse in step 3)
uv pip install vllm==0.19.1
# 3. the competition wheelhouse, with the two corrections the staff notebook makes
mkdir -p ~/bcf/wheelhouse && cd ~/bcf/wheelhouse
curl -L -o wheelhouse.zip https://www.kaggle.com/api/v1/datasets/download/metric/gemma-4-developer-agent-wheelhouse
unzip -q wheelhouse.zip
# 4. overlay the wheelhouse with the notebook's two corrections
cp ~/bcf/tools/install-wheelhouse.sh ~/bcf/ && bash ~/bcf/install-wheelhouse.sh ~/bcf/wheelhouse
python -c "import torch, vllm, swegemma; print(torch.__version__, torch.cuda.get_device_capability(), vllm.__version__)"
# expect: 2.10.0+cu128 (12, 0) 0.19.1
```

The fourth step is the script `tools/install-wheelhouse.sh` of this package:

It skips the cutlass wheels, restores the `+cu128` label in the file names, installs with `--no-deps --force-reinstall` through `uv pip` (or `pip` when `uv` is absent), and prints the versions it could import, with the expected values.

Why the corrections: Kaggle's upload strips the `+` from wheel file names, so `torch`-compatible builds look like a different version; the notebook restores it (`'cu128'` to `'+cu128'`). If a `+cu128` build of `torchaudio` or `torchvision` is missing from the PyTorch index, install all three without the suffix from PyPI instead (that is the CUDA 12.9 build, which also supports Blackwell); do not mix indexes.

### B.5 The data package and the model

```bash
uv tool install kaggle            # or: pip install kaggle
mkdir -p ~/.kaggle && chmod 700 ~/.kaggle
# put your token file (from kaggle.com/settings, "Create New Token") at ~/.kaggle/kaggle.json
chmod 600 ~/.kaggle/kaggle.json
mkdir -p ~/bcf/data && cd ~/bcf/data
kaggle competitions download -c gemma-4-developer-agent      # 21.9 GB; the rules must be accepted first
unzip -q gemma-4-developer-agent.zip -d ~/bcf/data
ls ~/bcf/data                      # tasks.jsonl snapshots graphs embeddings wheels docker sandbox sample_submission
```

For the weights, either download from the Kaggle model page (`google/gemma-4`, variant `gemma-4-31b-it-qat-w4a16-ct`, version 2) in the browser, or from Hugging Face:

```bash
uv pip install "huggingface_hub[cli]"
mkdir -p ~/bcf/models
huggingface-cli download google/gemma-4-31B-it-qat-w4a16-ct --local-dir ~/bcf/models/gemma-4-31b-it-qat-w4a16-ct
huggingface-cli download google/gemma-4-E4B-it-qat-w4a16-ct --local-dir ~/bcf/models/gemma-4-e4b-it-qat-w4a16-ct   # bonus track
```

The repository names on Hugging Face use capital letters (`31B`, `E4B`); the competition alias is lower-case. The folder name you choose is yours; what matters is the `--served-model-name` in section 5.

### B.6 Docker for the scorer-like sandbox (optional, about 20 minutes)

```bash
# Docker Engine from the Ubuntu 24.04 ("noble") repository: Zorin's version id is 18, for which no repository exists
sudo apt-get update && sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu noble stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update && sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker "$USER"          # log out and in afterwards
# NVIDIA Container Toolkit
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
sudo apt-get update && sudo apt-get install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker && sudo systemctl restart docker
docker run --rm --gpus all ubuntu nvidia-smi                   # expect the 5090
# the sandbox image, from the Dockerfile the competition ships (needs the network for its pip step)
cd ~/bcf/data && docker build -f docker/Dockerfile.sandbox -t swebench-sandbox:latest docker
docker run --rm swebench-sandbox:latest python3 --version      # 3.13.x: the interpreter the scorer's sandbox runs
```

Docker's documentation notes that derivative distributions such as Linux Mint are not officially supported; the `noble` repository works on Zorin 18.1 (not run here).

### B.7 The brain

```bash
mkdir -p ~/bcf/brain && cp -r <this package>/bcf-brain-patched/. ~/bcf/brain/
cp -r <this package>/tools/. ~/bcf/tools/ && mkdir -p ~/bcf/results ~/bcf/submit
cd ~/bcf/brain && python build.py && python -m unittest tests.test_bcf      # about 90 seconds
```

---

## 4. Track A: Windows 11 Pro with WSL2

vLLM does not support Windows natively ("To run vLLM on Windows, you can use the Windows Subsystem for Linux (WSL) with a compatible Linux distribution", vLLM 0.19.1 installation page). Everything that touches the model runs inside WSL2. Building and validating the brain runs on Windows itself (that is how this package was validated).

### A.1 Windows side (PowerShell as administrator)

```powershell
wsl --install -d Ubuntu-24.04          # enables the required features and installs Ubuntu 24.04
# restart the machine, then create your Linux user name and password
wsl --update                            # the fix for "nvidia-smi works but CUDA is unavailable" on 50-series cards
wsl --version
nvidia-smi                              # on Windows: RTX 5090, driver 570.65 or newer
```

Create `C:\Users\<you>\.wslconfig` (not run here; values chosen for a 64 GB, 32-thread machine):

```ini
[wsl2]
memory=40GB
processors=24
swap=16GB
localhostForwarding=true
[experimental]
autoMemoryReclaim=gradual
sparseVhd=true
```

then `wsl --shutdown`. The defaults you are overriding: 50% of the memory for the VM and all logical processors (`.wslconfig` documentation). `autoMemoryReclaim` is an experimental setting with the values `disabled`, `gradual` and `dropCache`.

### A.2 Inside Ubuntu (the `wsl` shell)

```bash
/usr/lib/wsl/lib/nvidia-smi               # WSL's own nvidia-smi: a limited feature set is normal
sudo apt update && sudo apt install -y git curl unzip pigz patch protobuf-compiler build-essential
printf '[boot]\nsystemd=true\n' | sudo tee /etc/wsl.conf      # needed only for Docker Engine inside the distro
```

then, from PowerShell, `wsl --shutdown` and open the shell again; verify with `systemctl list-unit-files --type=service`. Continue with **B.3 to B.7** exactly as on Zorin, with two differences:

- **Never install an NVIDIA driver inside the distribution.** The Windows driver is "stubbed inside WSL as libcuda.so"; "Do not install the cuda-drivers or nvidia-open packages" (CUDA on WSL User Guide). A CUDA toolkit is not needed for the pip environment; if you compile something, install `cuda-toolkit-<version>` from the standard Ubuntu repository (the WSL-Ubuntu repository is deprecated).
- **Downloads may land on Windows, work must not.** `D:\` is `/mnt/d` inside the distribution. Unpack the data package and the weights with `unzip ... -d ~/bcf/...` so that they end up on the Linux file system.

### A.3 Docker on Windows: one of two

| Option | How | When |
| --- | --- | --- |
| Docker Desktop | `winget install Docker.DockerDesktop`; Settings, General, "Use the WSL 2 based engine" on. The GPU passthrough is built in: `docker run --rm --gpus all ubuntu nvidia-smi` | The simplest |
| Docker Engine inside the distribution | The commands of B.6, unchanged, after `systemd` is enabled | If you prefer one less layer; mutually exclusive with Docker Desktop's integration for that distribution |

### A.4 Windows itself

The brain's loop runs natively: install Python 3.12 (or `uv`: `powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"`) and run `python build.py`, `python -m unittest tests.test_bcf` and the validator from PowerShell in `brain\`. To reach the folder from WSL: `/mnt/d/...`; to reach WSL from Windows: `\\wsl$\Ubuntu-24.04\home\<user>\bcf`. Turn off Git's automatic line-ending conversion for the brain (`git config --global core.autocrlf false`): the build refuses carriage returns.

---

## 5. Start the model server (both tracks)

Open a terminal, enter the environment, set the notebook's environment variables, and start vLLM with the notebook's settings for one GPU:

```bash
source ~/bcf/.venv/bin/activate
export HF_HOME=~/bcf/hf TRANSFORMERS_OFFLINE=1 TRANSFORMERS_NO_TF=1 TRANSFORMERS_NO_FLAX=1 \
       VLLM_NO_USAGE_STATS=1 VLLM_WORKER_MULTIPROC_METHOD=spawn VLLM_ENGINE_READY_TIMEOUT_S=1200 \
       VLLM_MEMORY_PROFILER_ESTIMATE_CUDAGRAPHS=1 PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True \
       NCCL_DEBUG=WARN LITELLM_LOCAL_MODEL_COST_MAP=True LITELLM_TELEMETRY=False OTEL_SDK_DISABLED=true
vllm serve ~/bcf/models/gemma-4-31b-it-qat-w4a16-ct \
  --served-model-name gemma-4-31b-it-qat-w4a16-ct \
  --host 127.0.0.1 --port 8000 \
  --max-model-len 32768 --dtype bfloat16 --gpu-memory-utilization 0.90 \
  --enable-auto-tool-choice --tool-call-parser gemma4 --reasoning-parser gemma4 \
  --no-scheduler-reserve-full-isl \
  --default-chat-template-kwargs '{"enable_thinking": true}' \
  > ~/bcf/vllm-31b.log 2>&1 &
tail -f ~/bcf/vllm-31b.log        # wait for the line that says the server is started; the first start compiles kernels
```

| Setting | Value | Source |
| --- | --- | --- |
| `--served-model-name` | the bundle's `model:` line, exactly | The harness maps the declared model to `openai/<name>` on the server |
| `--max-model-len` | 32768 | Staff notebook, cell 8; the harness caps `max_output_tokens` and `thinking_budget` at the same number |
| `--dtype` | bfloat16 | Notebook |
| `--gpu-memory-utilization` | 0.90 | Notebook (the older README says 0.80) |
| `--enable-auto-tool-choice`, both parsers | `gemma4` | Notebook; vLLM's Gemma 4 guide |
| `--no-scheduler-reserve-full-isl` | the notebook sets it to `False`; vLLM's default is `True` | Notebook; vLLM 0.19.1 engine arguments |
| `--default-chat-template-kwargs` | thinking on | vLLM's Gemma 4 guide: "add the argument --default-chat-template-kwargs '{"enable_thinking": true}'" (not run here on 0.19.1: check `vllm serve --help` for the flag's exact name on this build) |
| No `--quantization` flag | the checkpoint's own config is read | Earlier guide of this project (2026-10-31) |
| No `--tensor-parallel-size` | one GPU; the notebook uses 4 when it sees 4 | Notebook |

For the bonus track, start the E4B server instead, with `--served-model-name gemma-4-e4b-it-qat-w4a16-ct`. For the 12B checkpoint only, add `--hf-overrides '{"architectures": ["Gemma4ForCausalLM"], "model_type": "gemma4"}'` (staff notebook).

Check it from a second terminal:

```bash
curl -s http://127.0.0.1:8000/v1/models | head -c 300        # lists "gemma-4-31b-it-qat-w4a16-ct"
```

Keep the server running for the whole working session: it is the slowest thing to recreate. Under WSL2, do not use `nvidia-smi` utilization as a health signal (unsupported query there); read `~/bcf/vllm-31b.log` or `curl -s http://127.0.0.1:8000/metrics`.

---

## 6. First run: the smoke panel

```bash
source ~/bcf/.venv/bin/activate && cd ~/bcf
D=~/bcf/data
python tools/run_panel.py --tasks $D/tasks.jsonl --snapshots $D/snapshots \
  --bundle brain/dist/bcf-31b-flat --results results/smoke-01 \
  --panel tools/panel_smoke.txt --sandbox subprocess
```

`run_panel.py` does what the staff notebook does in its evaluation cell: it reads the four budgets from the bundle's `eval_config.yaml`, switches on compaction at 14,336 tokens, points the model registry at your server, and refuses to start if the server does not serve the bundle's model under the bundle's name. The plain `swegemma eval` command does neither: it ignores `eval_config.yaml` (it would give every task 60 minutes) and runs without compaction.

What to look at after five tasks (expect 5 to 15 minutes; not run here):

| Look at | Expect | If not |
| --- | --- | --- |
| The first printed line of `run_panel.py` | `model gemma-4-31b-it-qat-w4a16-ct ... eval_config.yaml read: 8 min, 28 calls, 80 turns, command 240 s` | A different budget: the wrong bundle folder |
| `results/smoke-01/summary.json` | `total_tasks: 5` and a `resolved` count | `errors` above zero: open `task_results.jsonl`, column `error` |
| `results/smoke-01/logs/fastapi_14077.log` | The agent's calls: the installer, `plan`, `find`, `apply`, a test, `finalize`, `submit_patch` | `No module named` or `command not found` inside a call: the sandbox cannot find `python3` or `git` |
| `results/smoke-01/traces/trace_fastapi_14077.json` | Token usage and elapsed seconds per step | Absent: the trace was not written; read the log instead |
| `~/bcf/vllm-31b.log` | Requests arriving, no errors | Connection errors: the server restarted; read its last 50 lines |

For the Docker sandbox instead (slower per task, closer to the scorer): the same command with `--sandbox docker --image swebench-sandbox:latest`.

---

## 7. Panel runs and comparisons

```bash
cd ~/bcf && source .venv/bin/activate
for r in 1 2 3; do
  python tools/run_panel.py --tasks data/tasks.jsonl --snapshots data/snapshots \
    --bundle brain/dist/bcf-31b-flat --results results/31b-flat-r$r --panel tools/panel30.txt --sandbox subprocess
done
python tools/run_report.py results/31b-flat-r1 results/31b-flat-r2 results/31b-flat-r3 \
  --labels <this package>/../2026-11-23_BCF_Brain_and_Dataset_RCA/data/rca_merged.jsonl --out results/31b-flat-report.md
```

Rules that make the comparison worth the time: the same panel in the same order for every bundle; three runs per bundle; one change at a time; the adopt condition written down before the run (Task 2, section C.5); the decision read from the paired table (Task 4, section 3.6). `--concurrency 3` runs three tasks at once on the 5090 and is fine for ranking runs once the smoke run is clean; use `--concurrency 1` for any run whose time you want to trust.

---

## 8. The loop: change, build, validate

After any change under `brain/parts/` or `brain/src/prompts/`, or to the values in `brain/build.py`:

```bash
cd ~/bcf/brain
python assemble.py                               # helper from its parts; compiles before it writes
python build.py                                  # six bundles and zips in dist/
python -m unittest tests.test_bcf                # about 90 seconds: 36 pass, 1 skipped
python tools/setup_validate_venv.py              # once: the official harness packages (about 870 MB)
python tools/run_validator.py                    # official compiler 6 of 6, controls 15 of 15
sha256sum dist/bcf-31b-flat.zip                  # goes into the ledger
```

The per-task budgets live in two places that must agree: `EVAL` in `build.py` and `BUDGET_S` in `parts/_bcf_head.py`; the build stops when they disagree. Sampling parameters (thinking budget, temperature, output cap) live in `SAMPLING` in `build.py`.

---

## 9. Prepare a submission

| Step | Action | Pass condition |
| --- | --- | --- |
| 1 | Build and validate (section 8) | 6 of 6, 15 of 15, 36 tests |
| 2 | One smoke run with the model on the exact bundle | Clean: every task has a patch or a clear reason |
| 3 | One ranking-panel run, read with `run_report.py` | Projected hours for 120 tasks at or below 10.8 |
| 4 | Use `dist/<bundle>.zip` as built: `agent.yaml` is at the root of the archive | `unzip -l dist/bcf-31b-flat.zip` shows `agent.yaml` first |

---

## 10. Submit to the competition: the main track

This is a code competition. Kaggle's documentation describes the flow: "all submissions must be made from inside a Kaggle Notebook. You cannot upload predictions directly", and "Initialize a Notebook with the competition dataset. Generate a submission file ... in /kaggle/working. Click 'Save Version', 'Save & Run All'. From the Notebook Viewer" submit to the competition. For this competition the file is `submission.zip` with `agent.yaml` at its root (Overview page); the staff Getting Started notebook writes it to `/kaggle/working/submission.zip`. The competition's scoring program then unpacks it, runs the agent on the hidden tasks and verifies the patches.

### 10.1 Put the bundle where a notebook can read it

A notebook can only read its inputs, so the bundle travels as a private Kaggle Dataset (not run here; the dialog names are Kaggle's):

1. On kaggle.com: **Create**, **New Dataset**.
2. Upload the **contents** of `brain/dist/bcf-31b-flat/` (so that `agent.yaml` sits at the top level of the dataset, not inside a folder).
3. Title it after the bundle (for example `bcf-31b-flat-patched`), set **Private**, create.
4. Every time the bundle changes, add a new version of the same dataset with the same rule.

With the command line instead (the metadata file format is in `kaggle datasets create --help`):

```bash
mkdir -p ~/bcf/submit/ds && cp -r brain/dist/bcf-31b-flat/. ~/bcf/submit/ds/
cd ~/bcf/submit && kaggle datasets create -p ds        # later: kaggle datasets version -p ds -m "what changed"
```

### 10.2 Create the submission notebook

1. **Code**, **New Notebook**. Add **Input**: the competition `Gemma 4 Developer Agent` (this attaches the data package; at scoring time the hidden test set replaces the training set) and your bundle dataset.
2. **Settings**: Internet **Off** (the L4 sessions must run without internet). Accelerator: none is enough for a notebook that only packages a file; choose **GPU L4 x4** only if the Submit option is not offered without an accelerator version.
3. Replace the content with one cell:

```python
import pathlib, shutil, zipfile

work = pathlib.Path('/kaggle/working')
roots = [p.parent for p in pathlib.Path('/kaggle/input').glob('*/agent.yaml')]
assert len(roots) == 1, f'expected one dataset with agent.yaml at its root, found {roots}'
agent = work / 'agent'
if agent.exists():
    shutil.rmtree(agent)
shutil.copytree(roots[0], agent)
archive = shutil.make_archive(str(work / 'submission'), 'zip', root_dir=agent)
with zipfile.ZipFile(archive) as z:
    infos = z.infolist()
print(archive, len(infos), 'files,', sum(i.file_size for i in infos), 'bytes; agent.yaml at root:',
      'agent.yaml' in z.namelist())
for i in infos:
    print(' ', i.filename, i.file_size)
```

4. **Save Version**, mode **Save & Run All (Commit)**. When the version has finished, open it from the Notebook Viewer and use **Submit to Competition**.
5. Keep the notebook and the dataset: a new bundle is a new dataset version and a new notebook version.

### 10.3 After submitting

| When | Do |
| --- | --- |
| Right after | My Submissions shows the new entry as pending; one pending submission blocks the next |
| 26 to 29 hours later, typically | The score appears. Record it in the ledger (section 12) with the hours it took and the result size |
| The score is 0.00 | Read the result size: about 3,230 bytes means a backend failure (three teams, 2026-11-21 to 23; staff investigating). Resubmit the same file; do not change the bundle in response |
| The score is in the expected band | Nothing: a single value has a band of about 4 tasks (Task 4, section 6) |

Rules that apply to every submission: one per day; at most two final selections, by 2026-12-02 23:59 UTC; entry and team-merger deadline 2026-11-25 23:59 UTC.

---

## 11. Submit to the bonus track: the small-model prize

The bonus prize ($10,000) goes to the highest-ranked submission on the private set whose base model is `gemma-4-e4b-it-qat-w4a16-ct` or `gemma-4-e2b-it-qat-w4a16-ct`, and the submission must be one of the team's two selected finals (Overview page, "Bonus Prize"). Nothing in the procedure changes except the bundle:

| Step | Main track | Bonus track |
| --- | --- | --- |
| Bundle | `dist/bcf-31b-flat` (or the relay twin) | `dist/bcf-e4b-flat` |
| Local server | the 31B weights, `--served-model-name gemma-4-31b-it-qat-w4a16-ct` | the E4B weights, `--served-model-name gemma-4-e4b-it-qat-w4a16-ct` |
| Dataset | the contents of the bundle folder | the contents of the E4B bundle folder |
| Notebook | the one-cell packaging notebook | the same notebook (it finds the dataset with `agent.yaml`) |
| Final selection | at most two, across both tracks | the E4B submission must be one of the two |

The E4B bundles already carry the settings the public measurements support for the small model: a thinking budget of 1,024 for the solver and 256 for the planner, planner temperature 0, an output cap of 8,192, short prompts, and a first edit by call 6. Do not attach a LoRA adapter to a first bonus submission. E4B is the variant to choose over E2B: a public report describes a loading failure of the E2B checkpoint on the pinned serving stack (thread 748287).

---

## 12. The ledger

One row per attempt, kept by hand in any spreadsheet:

| Date (UTC) | Bundle | SHA-256 of the zip | Local panel: resolved in 3 runs | Projected mean s per task | Hours to score | Public score | Result size | Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| example: 2026-11-25 08:10 | bcf-31b-flat (patched) | first 12 characters of `sha256sum` | 11, 10, 11 of 30 | 265 | 27 | 0.21 | 91,204 bytes | first attempt; answers whether skills run on the scorer |

---

## 13. Acceptance table

Run these once after the install. Every pass condition can be checked without the model.

| Test | Command | Pass condition |
| --- | --- | --- |
| Driver | `nvidia-smi` (on Zorin; `/usr/lib/wsl/lib/nvidia-smi` under WSL2) | RTX 5090, driver 580 or newer on Linux (570.65 or newer on Windows) |
| Interpreter | `python --version` in the environment | `Python 3.12.13` |
| Torch | `python -c "import torch; print(torch.cuda.is_available(), torch.cuda.get_device_capability())"` | `True (12, 0)` |
| Stack | `bash tools/install-wheelhouse.sh` (it prints them) | vllm 0.19.1, transformers 5.13.1, swegemma 0.2.11 |
| Server | `curl -s http://127.0.0.1:8000/v1/models` | the bundle's model name |
| Data | `ls ~/bcf/data` | `tasks.jsonl snapshots graphs embeddings wheels docker sandbox sample_submission` |
| Brain | section 8 | 36 pass and 1 skipped; 6 of 6; 15 of 15 |
| Sandbox interpreter (Docker) | `docker run --rm swebench-sandbox:latest python3 --version` | `Python 3.13.x` |
| First smoke run | section 6 | five tasks, a result per task, no harness error |

---

## 14. Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `No module named torch` after the wheelhouse install | The wheels were installed into another interpreter | Activate `~/bcf/.venv` first; `which python` must point into it |
| `CUDA error: no kernel image is available` | A PyTorch build without Blackwell kernels | Install torch from the cu128 index before everything else (section B.4) |
| `torch.cuda.is_available()` is `False` under WSL2 with `nvidia-smi` working | Stale WSL kernel | `wsl --update`, then `wsl --shutdown` |
| vLLM fails while starting under WSL2 and starts on Zorin | The GPU paravirtualisation limits pinned host memory | Keep `PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True`; lower `--gpu-memory-utilization`; or serve from Zorin |
| The model loads very slowly | Weights read through `/mnt/` | Move `~/bcf/models` and `HF_HOME` into the Linux file system |
| The server exits with a "head size not supported" message | Gemma 4's mixed head dimensions and the selected attention backend on vLLM 0.19.x | Read the backend line in the log; the earlier guide of this project set `VLLM_ATTENTION_BACKEND=TRITON_ATTN` for this case (2026-10-31) |
| `run_panel.py` exits with code 2 | No server, or the served name differs from the bundle's model | Start the server with `--served-model-name` equal to the `model:` line |
| Every task gets 60 minutes | The run went through `swegemma eval` instead of `run_panel.py` | Use `run_panel.py` |
| Tasks end at once with "Path traversal" or "No such file" | The sandbox cannot see `python3` or `git` | In Docker mode, rebuild the image from the shipped Dockerfile |
| Docker cannot see the GPU | Toolkit not configured, or two Dockers installed | `sudo nvidia-ctk runtime configure --runtime=docker`, restart Docker; keep one |
| `docker build` cannot find `imp.py` | Wrong build context | `docker build -f docker/Dockerfile.sandbox -t swebench-sandbox:latest docker` (the context is the `docker` folder) |
| The VM keeps its memory after a run | Cache not reclaimed | `wsl --shutdown` between sessions |
| The notebook's Save & Run All fails on the one-cell notebook | More than one input has `agent.yaml` at its root, or the dataset was uploaded as a folder | Upload the contents of the bundle folder; keep only one such dataset attached |
| The submission scored 0.00 | Backend failure or a compile failure | Result size about 3,230 bytes: resubmit the same file. Normal size: run the validator on the exact zip |

---

## 15. Sources

| Source | Publisher | Date | Used for |
| --- | --- | --- | --- |
| [Getting Started - Gemma 4 Developer Agent](https://www.kaggle.com/code/ryanholbrook/getting-started-gemma-4-developer-agent), version 3 | Ryan Holbrook (staff) | last run 2026-11-21; fetched 2026-11-24 | Environment variables, the wheelhouse install and its two corrections, vLLM settings, the `EvalConfig` values, the packaging cell, Python 3.12.13 |
| Competition [Overview](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview), [Data](https://www.kaggle.com/competitions/gemma-4-developer-agent/data), [Rules](https://www.kaggle.com/competitions/gemma-4-developer-agent/rules) | Kaggle | fetched 2026-11-24 | `submission.zip` with `agent.yaml` at the root, the 12-hour rule, the bonus terms, deadlines, one submission per day |
| [Kaggle competitions documentation](https://www.kaggle.com/docs/competitions) and [notebooks documentation](https://www.kaggle.com/docs/notebooks) | Kaggle | fetched 2026-11-24 | The code-competition flow, session limits, L4x4 quota |
| [G914 Gaming PC](https://powerspec.com/product/698934) | PowerSpec | fetched 2026-11-24 | The machine |
| [vLLM 0.19.1 installation](https://docs.vllm.ai/en/v0.19.1/getting_started/installation/gpu.html), [engine arguments](https://docs.vllm.ai/en/v0.19.1/configuration/engine_args.html), [Gemma 4 usage guide](https://docs.vllm.ai/projects/recipes/en/stable/Google/Gemma4.html) | vLLM project | fetched 2026-11-24 | No native Windows, CUDA builds, the serve flags |
| [CUDA on WSL User Guide](https://docs.nvidia.com/cuda/wsl-user-guide/index.html) | NVIDIA | v13.5, fetched 2026-11-24 | The driver rule, limitations |
| [`.wslconfig`](https://learn.microsoft.com/en-us/windows/wsl/wsl-config), [install WSL](https://learn.microsoft.com/en-us/windows/wsl/install), [systemd](https://learn.microsoft.com/en-us/windows/wsl/systemd), [development environment guide](https://learn.microsoft.com/en-us/windows/wsl/setup/environment) | Microsoft Learn | fetched 2026-11-24 | The Windows track |
| [Zorin OS technical details](https://zorin.com/os/details/), [Zorin OS 18.1 release post](https://blog.zorin.com/2026/04/15/zorin-os-18.1-is-released/) | Zorin | fetched 2026-11-24 | Version, base, kernel |
| [Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/), [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html), [uv](https://docs.astral.sh/uv/getting-started/installation/) | Docker, NVIDIA, Astral | fetched 2026-11-24 | The commands of sections B.3 and B.6 |
| `HARNESS_README.md`, `docker/Dockerfile.sandbox`, `swegemma` 0.2.11 source | Kaggle data package and wheelhouse v31 | read 2026-11-24 | The sandbox image, the CLI, the result files |
| [Byte-identical resubmission scored 0.00](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/761004), [New Gemma 4 models](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/748287) | Kaggle staff and competitors | 2026-10-11 to 2026-11-23 | The 3,230-byte signature, the 12B override, the E2B report |
| RTX 5090 local-testing guide of 2026-10-31 (files 02, 03, 07, 08) | this project | 2026-10-31 | Driver floors, the TRITON attention fallback, Hugging Face repository names |
