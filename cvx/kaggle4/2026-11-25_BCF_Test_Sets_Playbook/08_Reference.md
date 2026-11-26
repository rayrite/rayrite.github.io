# Reference

Commands, the terminal, the folder map, the file formats, the glossary, the sources and the status of every claim.

## 1. Commands

Every command is typed after `source ~/bcf/.venv-harness/bin/activate && cd ~/bcf/playbook`, except the server.

| To | Type |
| --- | --- |
| Start every session | `source ~/bcf/.venv-harness/bin/activate && cd ~/bcf/playbook` |
| Start the model server (its own terminal) | Playbook 2, step 3 |
| Is the machine ready? | `python3 tools/check_setup.py` (add `--full` for the complete import probe) |
| Do the tools work? | `python3 tools/selftest.py` |
| The sets and their parts | `python3 tools/run_set.py --list` |
| Run one part with one version | `python3 tools/run_set.py --set <set> --part <part> --version <version>` |
| The same, without running | The same, with `--dry-run` |
| Another bundle | The same, with `--bundle dist/<folder>` |
| Compare two runs | `python3 tools/compare.py <run folder A> <run folder B>` |
| Pool paired runs | `python3 tools/compare.py name=<run> name=<run> other=<run> other=<run>` |
| The table of every run | `python3 tools/ledger.py` |
| The gate on a set | `python3 tools/gates.py --set <set> --part full` |
| Write the lists again | `python3 tools/make_slices.py`; other sizes: `--custom name=3` |
| Check the lists | `python3 tools/make_slices.py --check` |
| Complete the harness environment | `python tools/finish_env.py` |
| Rebuild the HTML guide | `python3 tools/build_guide.py` (needs `pandoc`) |

## 2. The terminal in ten lines

| Key or command | What it does |
| --- | --- |
| Zorin Menu, type `terminal`, Enter | Opens a terminal |
| `Ctrl+Shift+V` | Pastes into the terminal (or right-click, Paste); `Ctrl+V` does not |
| `Ctrl+C` | Stops what runs in the terminal (the server itself was started with `&` and keeps running) |
| Arrow up and down | Brings back earlier commands |
| `Tab` | Completes a file name |
| `cd <folder>` | Goes to a folder; `cd ~` to the home folder; `cd ..` one level up |
| `ls` | Lists the folder; `ls ~/bcf` lists another |
| `sudo <command>` | Runs a command as administrator; it asks for your password |
| `cat <file>`, `less <file>` | Prints a file; `less` pages it (`q` to leave) |
| `tail -n 50 <file>`, `tail -f <file>` | The last 50 lines of a file; `-f` follows it while it grows |

A line that starts with `#` is a comment. Copy a whole block at a time. When a command prints nothing and returns to the prompt, it worked.

## 3. The folder map on the Zorin machine

| Path | Content | Made in |
| --- | --- | --- |
| `~/bcf/playbook` | This playbook | Playbook 1, step 4 |
| `~/bcf/brain` | The brain; `dist/` holds the bundles | Playbook 1, step 4 |
| `~/bcf/tools` | `run_panel.py` and the other tools of the 2026-11-24 package | Playbook 1, step 4 |
| `~/bcf/.venv` | The environment of the model server | Playbook 1, step 7 |
| `~/bcf/.venv-harness` | The environment of the harness | Playbook 1, steps 8 and 12 |
| `~/bcf/data/freshswe-py` | The data set as published | Playbook 1, step 6 |
| `~/bcf/wheelhouse` | The 41 wheels of the competition | Playbook 1, step 5 |
| `~/bcf/models` | The weights of the model | Playbook 1, step 9 |
| `~/bcf/results` | Every run: `<set>/<part>/<version>-run<number>`; the gates under `gates/` | as you work |
| `~/bcf/env` | What `finish_env.py` added to the harness environment | Playbook 1, step 12 |
| `~/.kaggle/kaggle.json` | Your Kaggle token; never shown, never read by the tools | Playbook 1, step 6 |
| `~/bcf/vllm-31b.log` | The log of the model server | Playbook 2, step 3 |

## 4. File formats

**A list file** (`sets/P20/slice_A.txt`): lines that start with `#` are comments; every other line is one task id.

**The row of a result** (`task_results.jsonl` in a run folder): one JSON object per line, written by the harness itself. Its fields, read from the harness's source (swegemma 0.2.11, `results.py`):

| Field | Content |
| --- | --- |
| `instance_id`, `repo` | The task |
| `resolved` | True when the hidden tests pass with the agent's patch |
| `agent_patch_size` | Size of the agent's patch in characters; 0 when it made none |
| `test_exit_code` | Exit code of the test run |
| `duration_seconds` | Wall-clock time of the task |
| `error` | Why the task has no result, or null |
| `tool_calls`, `total_llm_calls` | How much the agent used its budgets |
| `task_index` | Position of the task in the run |

**The sidecar** (`<run folder>.json`): written by `run_set.py`: the set, the part, the version, the run number, the task ids, the command, the bundle and its checksum, the sandbox, start and finish, the exit code.

**The summary** (`summary.json` in a run folder): `total_tasks`, `resolved`, `resolution_rate`, `by_repo`, `errors`.

**The gate report** (`~/bcf/results/gates/<set>-<part>/gates.md` and `passed.txt`): per task whether the reference fix resolved it and whether no patch did.

**The ledger** (`LEDGER.md` in the playbook folder): one line per run, written by `tools/ledger.py`.

**The configuration** (`playbook.conf`): lines `NAME=value`; `~` means the home folder.

## 5. Glossary

| Word | Meaning |
| --- | --- |
| Agent, the brain | The program that reads a task and writes a patch: a planner and a solver built on Google's Agent Development Kit, with a small helper |
| Baselines | Two reference agents whose results on every task were published with the data set |
| Bundle | The folder that becomes a submission: `agent.yaml`, prompts, the helper, `eval_config.yaml` |
| Gate | Proof that the reference fix passes and no patch fails on a task, in the sandbox used for the run |
| Harness | The competition's grading software (`swegemma`): it starts the sandbox, runs the agent, applies the patch and runs the hidden tests |
| Pair | One task run by both versions |
| Part | A list of a few tasks of a set |
| p-value | The probability that chance alone produces a split at least as uneven as the one observed |
| Sandbox | The Docker container in which the agent works on a copy of the repository at the base commit |
| Set | P20, R1 to R4 or B40: 20 or 40 tasks |
| Sign test | The comparison of two versions task by task: the tasks only one version solved are counted |
| Slice | A part of 5 tasks |
| Version | One build of the brain |
| vLLM | The program that serves the model on the GPU |

## 6. Sources

| Source | Publisher | Read on | Used for |
| --- | --- | --- | --- |
| [Zorin OS technical details](https://zorin.com/os/details/) | Zorin | 2026-11-25 | 18.1 is the current version; Ubuntu 24.04 LTS; kernel 6.17; supported until 1 June 2029 |
| [How to install Zorin OS](https://help.zorin.com/docs/getting-started/install-zorin-os/) | Zorin Help | 2026-11-25 (page last modified 2026-03-23) | The installer steps, the boot-menu option for NVIDIA cards, the third-party software option, the installation types |
| [Activate NVIDIA graphics card](https://help.zorin.com/docs/hardware/activate-nvidia-drivers/) | Zorin Help | 2026-11-25 (page last modified 2026-03-24) | Driver 580 by the installer; the Additional Drivers path; Secure Boot |
| [System requirements](https://help.zorin.com/docs/getting-started/system-requirements/) and the [download page](https://zorin.com/os/download/) | Zorin | 2026-11-25 | The USB stick size; the Core edition is free |
| `07_Setup_and_Run_Guide.md` and `tools/run_panel.py` of the 2026-11-24 package | this project | written 2026-11-24 | The commands of steps 3, 7, 9 and 10 and the server settings; the runner's behaviour |
| `04_Build_Verify_and_Run.md` of the 2026-11-25 portfolio package | this project | written 2026-11-25 | Path A: run the bundle on P20 with FreshSWE-Py; the gold and empty gate |
| The FreshSWE-Py README, Dockerfile and member list (Kaggle, `moshegolderson/freshswe-py`) | the data set's author | 2026-11-25 | The layout of the release; the image is built from its root; 6.6 GB unpacked |
| The competition wheelhouse, version 31 (Kaggle, `metric/gemma-4-developer-agent-wheelhouse`) | Kaggle | 2026-11-25 | 41 wheels, 881 MB; which packages it brings and which it does not |
| `swegemma` 0.2.11 and `adk-eval-core` 0.1.0 as installed from the wheelhouse | Kaggle | 2026-11-25 | The result format; the settings and methods the gate and the pre-flight use |
| [Hugging Face API](https://huggingface.co/api/models/google/gemma-4-31B-it-qat-w4a16-ct) for the model repository | Hugging Face | 2026-11-25 | The repository is public and not gated |
| The dependency trees, resolved with uv 0.12.13 for Linux and CPython 3.12.13 (metadata only) | this project | 2026-11-25 | The server tree (179 packages), the harness tree (155 packages), and the conflicts between them |

## 7. What is measured, what is read, what is assumed

| Statement in the playbooks | Status |
| --- | --- |
| The lists and their composition | Measured: written by `make_slices.py` and checked by `--check` and `selftest.py` |
| The minutes per part | Computed from two published figures (277 seconds per task-run; 8 minutes as the limit), not measured |
| The sign-test thresholds | Computed with the exact binomial test (`tools/compare.py` prints the same p-values) |
| The dependency facts | Measured today from the wheelhouse listing, the package metadata and two uv resolutions |
| The harness environment recipe | Executed on Windows in a new environment: lock (151 packages), probe (1,340 of 1,341 modules), pre-flight of the runner passed. Not executed on Zorin |
| The Zorin steps | Read from the official Zorin help pages today; not executed |
| The server, the Docker sandbox and the gates | Not executed: they need the GPU, Linux and the data set; the scripts were checked against the harness source and by `--selfcheck` |
| A real run and a real comparison | Not executed; no model was called |

## 8. The other packages this playbook builds on

| Package | What it gives this playbook |
| --- | --- |
| `deliverables/2026-11-24_BCF_Tuning_Bottlenecks_and_Parity` | The brain (`bcf-brain-patched`), `run_panel.py`, `install-wheelhouse.sh`, the setup guide and the server settings |
| `deliverables/2026-11-25_BCF_Private_Portfolio_20` | The six sets (`portfolio/`), the reasons behind them (Documents 01 and 09), the measurement protocol (Document 06) |
| `deliverables/2026-11-23_BCF_Brain_and_Dataset_RCA` | The first version of the brain and its tools; the portfolio package's scripts use some of them |

**What this playbook changes in the setup guide of 2026-11-24:** the guide put the harness and the model server into one environment, as the staff notebook does on Kaggle, where the image already holds every dependency. On a new machine that environment stops at `import swegemma`, and a strict resolver refuses to build it. The playbook uses two environments and a script that completes the harness one; the server's part of the guide is unchanged.
