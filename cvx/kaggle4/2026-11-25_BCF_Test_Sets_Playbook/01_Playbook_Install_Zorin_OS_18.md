# Playbook 1. Install everything on Zorin OS 18

**Goal:** a machine on which the brain can be run on the test sets. You do each step once. **Written for:** a beginner on the PowerSpec G914 (RTX 5090) who keeps Windows on the same disk.

## Read this first

| Item | Statement |
| --- | --- |
| What you will have at the end | Zorin OS 18.1 with the NVIDIA driver; the FreshSWE-Py data set (7 GB); the model (17 to 18 GB); two small Python environments, one for the model server and one for the harness; Docker with the sandbox image; the brain, built and tested; and this playbook, checked |
| Time | 2 to 4 hours the first time, most of it downloads (about 45 GB in total: the model, the two environments, the data set) |
| What was executed for this playbook | The Zorin pages were read; the package lists were resolved; the harness environment was built and tested on Windows. The steps below were **not run on a Zorin machine**: each block of commands says "not run here" in the table at the end |
| The three things that break everything if skipped | Python must be exactly 3.12.13 in both environments; the harness lives in its **own** environment (`~/.venv-harness`), the model server in another (`~/.venv`); the FreshSWE-Py release folder must be unpacked whole, because the sandbox image is built from it |
| Where the commands come from | The setup guide of the 2026-11-24 package (`07_Setup_and_Run_Guide.md`, sections 3 and 5), the FreshSWE-Py README, the official Zorin help pages. This playbook adds what that guide lacks: a second environment and the harness dependencies (steps 8 and 12) |

How to read a step: each has **Type**, the lines to copy into the terminal, one block at a time; **Expect**, what the last line should look like; and sometimes **If not**, where to look. A line that starts with `#` is a comment: you need not type it.

## Step 1. Install Zorin OS 18.1 next to Windows

1. On any computer, download **Zorin OS 18.1 Core** (free) from `https://zorin.com/os/download`. The Core edition is enough.
2. You need a USB stick of 4 GB or more for the Core edition. Everything on the stick is erased.
3. Write the downloaded `.iso` file to the stick with **balenaEtcher** (from `etcher.balena.io`): "Flash from file", choose the `.iso`; "Select target", choose the stick; "Flash!". On Windows, Rufus works too.
4. Shut the G914 down completely. Plug the stick in. Switch on and press the boot-menu key repeatedly (usually `Esc`, `Delete`, `F2` or `F12`); choose the entry that mentions "USB" or "EFI".
5. In the Zorin boot menu select **Try or install Zorin OS (modern NVIDIA drivers)** and press Enter. This option installs the official NVIDIA driver, version 580, during the installation. Do not skip the check of the USB stick the first time.
6. In the installer, connect to the Internet. At **Updates and other software**, make sure **Install third-party software for graphics and Wi-Fi hardware and additional media formats** is switched on.
7. At **Installation type**, choose **Install Zorin OS alongside Windows** and give Zorin at least 150 GB (the model, the data and the environments need about 60 GB; results take more). If the option does not appear because the machine has several internal drives, choose **Something else** and follow Zorin's manual partitioning guide (link at the end of Zorin's install page).
8. Create your user name and password, finish, restart, and remove the stick. At start-up you choose between Windows and Zorin.

> If the NVIDIA driver is not active after the first login: Zorin Menu, System Tools, Software Updater, Settings, tab **Additional Drivers**: select the newest standard **NVIDIA driver** marked "(proprietary)", Apply Changes, restart. If it still is not active, Zorin's guide says Secure Boot may block it: restart, enter the BIOS or UEFI settings (the same key as for the boot menu), open the **Boot** or **Security** tab, switch **Secure Boot** off, save and exit (usually `F10`).

## Step 2. First login: updates, a terminal, the driver

Open the **Zorin Menu** (the button at the bottom of the screen), type **Software Updater**, press Enter, install the updates, and restart if it asks. Then open a terminal: Zorin Menu, type **terminal**, Enter.

**Type** (the shortcut `Ctrl+Shift+V` pastes into the terminal, or right-click and Paste):

```bash
nvidia-smi
```

**Expect:** a table with `NVIDIA GeForce RTX 5090` and `Driver Version: 580.xx` or later. (On the machine this playbook was written on it prints a GTX 1060 with 582.66, which is why the tools only ask for 580 or later.) If `nvidia-smi` is not found, do the block quote of step 1.

## Step 3. The base tools, `uv`, and Python 3.12.13

`uv` installs Python and Python packages; everything else in this playbook uses it.

**Type** (not run here):

```bash
sudo apt update
sudo apt install -y git curl unzip pigz patch protobuf-compiler build-essential pandoc
curl -LsSf https://astral.sh/uv/install.sh | sh
source "$HOME/.local/bin/env"
uv --version
uv python install 3.12.13
uv python list | grep 3.12.13
```

**Expect:** a version number from `uv --version`, and a line with `cpython-3.12.13` from the last command. `pandoc` is only needed if you want to rebuild the HTML guide yourself.

## Step 4. The working folder, and the files from Windows

**Type** (not run here):

```bash
mkdir -p ~/bcf/from-windows ~/bcf/data ~/bcf/models ~/bcf/results ~/bcf/env ~/bcf/tools
```

Copy two folders from the Windows disk into `~/bcf/from-windows`. In Zorin's **Files** app, open **Other Locations** in the left bar, then the Windows drive (D:), and go to `stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test/deliverables`. If Windows asks for a BitLocker recovery key, enter it. The two folders:

| Folder on Windows | What it holds |
| --- | --- |
| `2026-11-24_BCF_Tuning_Bottlenecks_and_Parity` | The brain (`bcf-brain-patched`) and the panel runner (`tools/run_panel.py`) |
| `2026-11-25_BCF_Test_Sets_Playbook` | This playbook |

Then put them where the playbook expects them (not run here):

```bash
cp -r ~/bcf/from-windows/2026-11-24_BCF_Tuning_Bottlenecks_and_Parity/bcf-brain-patched/. ~/bcf/brain/
cp -r ~/bcf/from-windows/2026-11-24_BCF_Tuning_Bottlenecks_and_Parity/tools/. ~/bcf/tools/
mv ~/bcf/from-windows/2026-11-25_BCF_Test_Sets_Playbook ~/bcf/playbook
ls ~/bcf/brain ~/bcf/tools ~/bcf/playbook
```

**Expect:** `agent.yaml`-style build files under `brain` (`build.py`, `parts`, `src`, `tools`, `tests`), `run_panel.py` under `tools`, and `playbook.conf` and `sets` under `playbook`. Work only inside your home folder, never directly on the Windows partition: Linux runs faster and keeps the file permissions.

> If the two machines are not the same: copy the two folders with a USB stick instead; nothing else changes.

## Step 5. The competition wheelhouse

The wheelhouse is Kaggle's set of 41 pinned Python packages for this competition (881 MB): the harness and the serving stack.

**Type** (not run here):

```bash
mkdir -p ~/bcf/wheelhouse && cd ~/bcf/wheelhouse
curl -L -o wheelhouse.zip https://www.kaggle.com/api/v1/datasets/download/metric/gemma-4-developer-agent-wheelhouse
unzip -q wheelhouse.zip && rm wheelhouse.zip
ls *.whl | wc -l
```

**Expect:** `41`.

## Step 6. Kaggle, and the FreshSWE-Py data set

The test sets are tasks of **FreshSWE-Py**, a public Kaggle data set (6.97 GB to download, 6.6 GB unpacked). Downloading needs a Kaggle account and its token file.

1. On `https://www.kaggle.com/settings`, under API, choose **Create New Token**. Your browser saves a file `kaggle.json`. Move it into the folder `~/.kaggle` on Zorin (in Files, press `Ctrl+L`, type `~/.kaggle` and Enter; create the folder if it does not exist).
2. Never show this file to anyone and never paste it into a chat; the tools of this playbook only check that it exists.

**Type** (not run here):

```bash
mkdir -p ~/.kaggle && chmod 700 ~/.kaggle && chmod 600 ~/.kaggle/kaggle.json
uv tool install kaggle
mkdir -p ~/bcf/data && cd ~/bcf/data
kaggle datasets download -d moshegolderson/freshswe-py
unzip -q freshswe-py.zip -d freshswe-py && rm freshswe-py.zip
ls freshswe-py
```

**Expect:** the download (several minutes), then the list `baselines  docker  embeddings  graphs  locks  README.md  sandbox  snapshots  splits.json  tasks.jsonl  validation  wheelhouse`.

## Step 7. The environment of the model server

The model server is vLLM, served from the RTX 5090. It has its own environment, `~/.venv`, exactly as in the setup guide of the 2026-11-24 package.

**Type** (not run here):

```bash
cd ~/bcf
uv venv --python 3.12.13 .venv && source .venv/bin/activate
uv pip install torch==2.10.0+cu128 torchaudio==2.10.0+cu128 torchvision==0.25.0+cu128 --index-url https://download.pytorch.org/whl/cu128
uv pip install vllm==0.19.1
cp ~/bcf/tools/install-wheelhouse.sh ~/bcf/ && bash ~/bcf/install-wheelhouse.sh ~/bcf/wheelhouse
python -c "import torch, vllm; print(torch.__version__, torch.cuda.get_device_capability(), vllm.__version__)"
deactivate
```

**Expect:** from the script, `wheelhouse installed: ... wheels (cutlass skipped)`; from the last line, `2.10.0+cu128 (12, 0) 0.19.1`.

**If not:** `CUDA error: no kernel image is available` means PyTorch was installed from the wrong place: remove the folder `~/.venv` and repeat the step from `uv venv`.

> The install script also prints whether `swegemma` can be imported. In this environment it is expected to print `NOT IMPORTABLE` for `swegemma`, `adk_submission` and `google.adk`: the harness lives in the next environment. That is the one place where this playbook differs from the 2026-11-24 guide, which put both in one environment. The reason is in step 8.

## Step 8. The environment of the harness

The harness (`swegemma`) runs the brain on a task and grades the patch. Its packages and the model server's packages want different versions of the same library: vLLM 0.19.1 needs `starlette` 1.0 or later and `mcp` 2, google-adk 1.36.1 (which the harness needs) asks for `starlette` below 1.0 and `mcp` below 2. One environment cannot hold both; two can. The harness environment needs no PyTorch at all.

**Type** (not run here):

```bash
cd ~/bcf
uv venv --python 3.12.13 .venv-harness
source .venv-harness/bin/activate
uv pip install --no-deps ~/bcf/wheelhouse/swegemma-*.whl ~/bcf/wheelhouse/adk_submission-*.whl ~/bcf/wheelhouse/adk_eval_core-*.whl ~/bcf/wheelhouse/google_adk-*.whl
deactivate
```

**Expect:** `uv` lists the four packages: `adk-eval-core 0.1.0`, `adk-submission 0.2.13`, `google-adk 1.36.1`, `swegemma 0.2.11`.

## Step 9. The model weights

**Type** (not run here):

```bash
source ~/bcf/.venv/bin/activate
uv pip install "huggingface_hub[cli]"
mkdir -p ~/bcf/models
huggingface-cli download google/gemma-4-31B-it-qat-w4a16-ct --local-dir ~/bcf/models/gemma-4-31b-it-qat-w4a16-ct
deactivate
```

**Expect:** 17 to 18 GB, then a line `.../gemma-4-31b-it-qat-w4a16-ct` with the folder path. The repository is public and not gated (checked on the Hugging Face API on 2026-11-25), so no login is needed. The repository name uses capital letters (`31B`); the folder name is yours, and what matters is the `--served-model-name` of Playbook 2.

## Step 10. Docker and the sandbox image

The agent works inside a sandbox: a Docker image built from the FreshSWE-Py release. It holds the Python 3.13 of the scorer and every package the tasks need, offline.

**Type** (not run here):

```bash
sudo apt-get update && sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu noble stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update && sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker "$USER"
```

Log out and in again (so that your user may use Docker), open a terminal, then (not run here):

```bash
docker run --rm hello-world
cd ~/bcf/data/freshswe-py && docker build -t freshswe-sandbox:latest -f docker/Dockerfile .
docker run --rm freshswe-sandbox:latest python --version
```

**Expect:** `Hello from Docker!`; a build that takes several minutes (it installs packages from the network once); then `Python 3.13.x`. The NVIDIA Container Toolkit is not needed: the sandbox uses no GPU. Docker's own documentation does not list Zorin as a supported distribution; the Ubuntu 24.04 ("noble") repository is the one for it, as Zorin 18 is built on Ubuntu 24.04.

## Step 11. The brain

**Type** (not run here):

```bash
source ~/bcf/.venv-harness/bin/activate
cd ~/bcf/brain && python build.py && python -m unittest tests.test_bcf
ls dist
deactivate
```

**Expect:** the tests take about 90 seconds and end with `OK` (36 pass, 1 skipped on 2026-11-24); `dist` holds six bundles, among them `bcf-31b-flat`, the one this playbook runs.

## Step 12. Finish the harness environment

The wheelhouse brings the four harness packages but not what they import (`docker`, `litellm` and about 150 others). `finish_env.py` installs them from a list resolved once with uv (155 packages, the wheelhouse's versions kept), each on its own, and then imports every module the harness uses to prove nothing is missing.

**Type** (not run here):

```bash
source ~/bcf/.venv-harness/bin/activate
cd ~/bcf/playbook
python tools/finish_env.py --dry-run
python tools/finish_env.py
```

**Expect:** the dry run lists about 150 packages under "would install"; the real run ends with `Every probed module imports. Next: the acceptance checks` after about 4 minutes (on Windows it took 223 seconds). The list of what it added is in `~/bcf/env/harness-deps.txt`.

## Step 13. The acceptance checks

**Type** (not run here):

```bash
cd ~/bcf/playbook
python3 tools/selftest.py
python3 tools/check_setup.py
```

**Expect:** `21 of 21 tests passed` from the self-test. From the checks: `PASS` on System, NVIDIA driver, Harness Python, Harness ready (pre-flight), Server Python (torch), FreshSWE-Py, Docker and sandbox image, The sets and their parts, Disk, Kaggle token file; and `TODO` on exactly two rows, Model server and Gate on P20, which Playbook 2 does.

**If not:** each failed row names the step to repeat; `07_Playbook_Troubleshooting.md` has the rest.

## The checklist of Playbook 1

- [ ] Step 1: Zorin OS 18.1 installed next to Windows
- [ ] Step 2: `nvidia-smi` shows driver 580 or later
- [ ] Step 3: `uv` works and Python 3.12.13 is installed
- [ ] Step 4: `~/bcf/brain`, `~/bcf/tools` and `~/bcf/playbook` exist
- [ ] Step 5: 41 wheels in `~/bcf/wheelhouse`
- [ ] Step 6: `~/bcf/data/freshswe-py/tasks.jsonl` exists
- [ ] Step 7: the server environment prints `2.10.0+cu128 (12, 0) 0.19.1`
- [ ] Step 8: the harness environment holds the four harness packages
- [ ] Step 9: the model is in `~/bcf/models`
- [ ] Step 10: `docker run --rm freshswe-sandbox:latest python --version` prints 3.13
- [ ] Step 11: the brain's tests end with `OK`
- [ ] Step 12: `finish_env.py` ends with "Every probed module imports"
- [ ] Step 13: `check_setup.py` shows no `FAIL`, and `TODO` on Model server and Gate only

## What was not run here, step by step

| Step | Status |
| --- | --- |
| 1 to 11 | Written from the official Zorin help pages, the 2026-11-24 setup guide and the FreshSWE-Py README; not executed on a Zorin machine |
| 12 | The same recipe was executed on Windows in a new environment: the four wheels, then the lock (151 packages), then the probe; the pre-flight of the panel runner passed there. Not executed on Zorin |
| 13 | `selftest.py` and `check_setup.py` were executed on Windows (the checks correctly report what this Windows machine lacks); not on Zorin |
