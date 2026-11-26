# Playbook 7. Troubleshooting

**Goal:** find the cause of what went wrong, in the order that saves time: the machine first, then the environment, then the run, then the brain.

## 1. First: where to look

| Order | Ask | How |
| --- | --- | --- |
| 1 | Is the machine ready? | `python3 tools/check_setup.py`: every failed row names the step to repeat |
| 2 | Is the server up? | `curl -s http://127.0.0.1:8000/v1/models` must show the bundle's model name |
| 3 | Did the tasks themselves fail, or the agent? | `python3 tools/gates.py --set <set> --part full`: the gate calls no model, so a failure here is the environment |
| 4 | Did the run end with harness errors? | Open `<run folder>/task_results.jsonl`: the `error` field of a row says why a task has no result |
| 5 | What did the agent do? | The folder `logs` of the run (one log per task) and the server's log (`tail -n 50 ~/bcf/vllm-31b.log`) |
| 6 | What did the tests say? | The folder `test_outputs` of the run: the output of the hidden tests |

A run folder is `~/bcf/results/<set>/<part>/<version>-run<number>`.

## 2. Installation

| Symptom | Cause | Fix |
| --- | --- | --- |
| `nvidia-smi` is not found, or shows no driver | The NVIDIA driver is not installed or blocked | Zorin Menu, System Tools, Software Updater, Settings, Additional Drivers: the newest "(proprietary)" NVIDIA driver; if still not, switch Secure Boot off in the firmware (Playbook 1, step 1) |
| `uv: command not found` in a new terminal | The folder of `uv` is not on the path of this terminal | `source "$HOME/.local/bin/env"`; it is added to the shell's start-up file by the installer, so a new terminal finds it |
| `uv python install` gives a version other than 3.12.13 | The version was typed differently | `uv python list` shows what is installed; the environments need exactly 3.12.13 |
| `kaggle: command not found` | The Kaggle command line was not installed, or its folder is not on the path | `uv tool install kaggle`, then `source "$HOME/.local/bin/env"` |
| `403 Forbidden` or `Unauthorized` from `kaggle` | The token file is missing, in the wrong place, or the competition's or data set's rules were not accepted | The file must be `~/.kaggle/kaggle.json` with permissions 600; accept the rules on the data set's page in the browser |
| `unzip` says the file is not a zip archive | The download stopped early | Download again; the data set is 6.97 GB |
| `docker: permission denied` on `docker run` | Your user was not yet in the docker group | Log out and in again after `sudo usermod -aG docker "$USER"` |
| `docker build` cannot find `wheelhouse/locks` or the Dockerfile | The build was not started from the release root | `cd ~/bcf/data/freshswe-py` first; the command is `docker build -t freshswe-sandbox:latest -f docker/Dockerfile .` |
| No disk space | The model, the data and the two environments need about 45 GB | `df -h ~`; remove the zip files after unpacking (the steps do), give Zorin 150 GB or more |

## 3. The two Python environments

| Symptom | Cause | Fix |
| --- | --- | --- |
| `ModuleNotFoundError: No module named 'docker'` (or `litellm`, `cachetools`, `networkx`) when the runner starts | The harness packages are installed but not what they import: the wheelhouse does not bring it | In the harness environment: `python tools/finish_env.py`, then `python tools/check_setup.py` |
| `ModuleNotFoundError` in the **model server** environment | A package was installed into the wrong environment | The server environment holds only the server; the harness lives in `~/.venv-harness`. Check which interpreter is active: `which python` |
| `uv` refuses to install with a long message about `starlette` or `mcp` | The two dependency trees were mixed in one environment | That is why there are two environments (Playbook 1, step 8). Remove the one that was mixed (`rm -rf ~/.venv-harness`) and repeat steps 8 and 12 |
| `finish_env.py` stops on `could not install ...` | No network, or a wheel missing for this platform | Read the message above it; re-run the script, it continues where it stopped |
| `finish_env.py` ends with "other error in ..." | Two packages do not fit together | Note the module and the message; run `python tools/finish_env.py --check` and follow the notes below |
| The pre-flight check fails with `the harness packages are not importable` | The runner is started with the wrong interpreter | `source ~/.venv-harness/bin/activate`, and `PYTHON=~/bcf/.venv-harness/bin/python` in `playbook.conf` |
| `No module named 'swegemma'` inside the sandbox image | Nothing is wrong: the sandbox holds the repositories' packages, not the harness | The message must come from the harness process; if it comes from a task log, the agent's own installer failed (next section) |

The facts behind this section, measured on 2026-11-25: the competition wheelhouse (version 31) has 41 wheels and brings the four harness packages but not `docker` or `litellm`, which swegemma 0.2.11 requires. vLLM 0.19.1 needs `mcp` 2 and `starlette` 1.0 or later; google-adk 1.36.1 needs `mcp` below 2 and `starlette` below 1.0. `finish_env.py` installs the harness tree (155 packages, resolved once with uv) into its own environment.

## 4. The model server

| Symptom | Cause | Fix |
| --- | --- | --- |
| `no OpenAI-compatible server answered` when a run starts | The server is not running, or on another port | Start it (Playbook 2, step 3); `BASE_URL` in `playbook.conf` must match `--port` |
| `the bundle declares ... but the server serves ...` | `--served-model-name` differs from the `model:` line of the bundle | Start the server with `--served-model-name gemma-4-31b-it-qat-w4a16-ct` for `bcf-31b-flat` |
| The server does not come up; the log ends with an attention-backend message | Gemma 4's mixed head dimensions and the selected attention backend | Read the backend line in the log; an earlier guide of this project set `VLLM_ATTENTION_BACKEND=TRITON_ATTN` for this case |
| The server answers slowly | Something else uses the GPU, or two runs share it | `nvidia-smi` lists the processes; run one thing at a time |
| The model loads very slowly | The weights are read through a mounted Windows disk | Keep `~/bcf/models` in the Linux file system |
| `CUDA out of memory` at start | The model and the KV cache do not fit | 17 to 18 GB of weights on 32 GB should fit; close other GPU programs; if needed lower `--gpu-memory-utilization` |
| The server stops by itself during a run | The terminal it ran in was closed, or memory ran out | Start it with the `&` of Playbook 2 so that it survives the log view, and keep the terminal open |

## 5. The gate

| Symptom | Cause | Fix |
| --- | --- | --- |
| `reference fix resolves` fewer tasks than expected | The sandbox image lacks a package or a test plugin, or the image was built from a partial release | Read the row in `gates.md`; rebuild the image from the whole release root; compare with the per-task validation records of the data set (`validation/`) |
| `no patch resolves` more than 0 | A task has no failing test in this sandbox | Drop the task only after the image is checked; such a task measures nothing |
| `gates.py` says a report folder exists | A report is never overwritten | Remove `~/bcf/results/gates/<set>-<part>/` to run it again |
| The gate takes very long | Every task starts a container and runs its tests twice | Use `--concurrency 3`; the gate calls no model |

## 6. A run

| Symptom | Cause | Fix |
| --- | --- | --- |
| `run_set.py` prints `FAIL` lines and runs nothing | A path in `playbook.conf` is wrong, or the results folder exists | Read each `FAIL` line; it names the path. For an existing run give `--run 2` |
| `FAIL results folder ... is free` | That run number is taken | Let the tool pick the next number (omit `--run`) or give a free one |
| The runner exits with code 2 | No server, or another model name | See "The model server" |
| Every task ends at once with an error about the snapshot | The `snapshots` folder does not match the tasks | `DATA` must be the release root: `<DATA>/snapshots/<task id>.tgz` |
| A task ends with `No module named ...` inside the agent's calls | The agent's installer could not set up its helper in the sandbox | Open the task's log; the sandbox image is built from the release root and must contain the task's lock file |
| A task ends with "Path traversal" or "No such file" | The sandbox cannot find `python3` or `git` | Rebuild the image from the shipped Dockerfile |
| Every task gets exactly 8 minutes and no result | The model server answers errors | Read the server's log while the first task runs |
| Tasks end at the 8-minute limit with no edit | The agent is lost, or the server is too slow | Read the task's log: the last calls show whether it was thinking, waiting or looping |
| A result folder has fewer tasks than the list | The run was stopped | Run the same command again: it takes the next run number; a stopped run is never resumed in place |
| `compare.py` says a folder has no `task_results.jsonl` | The path is not a results folder | The results folder is the one `run_set.py` printed |

## 7. The sets and the tools

| Symptom | Cause | Fix |
| --- | --- | --- |
| `make_slices.py --check` reports differences | A list file was edited by hand | `python3 tools/make_slices.py` writes every list again |
| `make_slices.py` stops with an assertion | A rule of the cut is broken by a change to the script | Read the message: it names the set and the rule |
| `selftest.py` reports a failure | A tool was changed, or the folder was copied incompletely | Copy the folder again; then run `python3 tools/selftest.py` |
| A list file is empty or missing | The set has no task of that kind (for example `changelogs.txt` of B40) | Nothing to run; `sets/<NAME>/slices.md` shows the parts that exist |
| `compare.py` reports a set or part as `?` | The run folder has no sidecar file (it was not started with `run_set.py`) | Harmless: the pairing uses the task ids, not the names |
| `check_setup.py` reports `System FAIL` on another Linux | The playbooks are written for Zorin OS 18 (Ubuntu 24.04) | It may still work; treat the steps of Playbook 1 as a guide |
