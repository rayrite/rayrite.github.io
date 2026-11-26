# Replay toolkit: the real harness with scripted calls

These scripts run a list of tool calls through the real harness on a machine with no model: the harness's own sandbox setup, its own nine tools, its own Container B verifier. They produced every "actual" figure of the package.

## What is here

| File | Role |
|---|---|
| `scripts/replay.py` | The driver. One lane per invocation. Writes `lanes/<name>.json`, the final patch, and one patch per graded state |
| `scripts/trajectories.py` | The scripted decisions of every lane, with the rule behind each call. Edit strings are cut from the pristine snapshot by line number |
| `scripts/gitbash_manager.py` | The Windows stand-in for the Docker sandbox. Subclasses the harness's own `SubprocessManager` |
| `scripts/replay_settings.py` | Builds the harness configuration and the sandbox manager from `settings.json` |
| `scripts/harness_env.py` | Imports the harness with the Docker SDK stubbed, and adds `harness_extra` to the path |
| `scripts/probes.py` | The two side experiments: the spec matrix per planner word, and the edit gate |
| `scripts/variance.py` | Classifies every v5 call card against the real output |
| `scripts/extract_v5.py` | Reads the v5 deck's 73 call cards into JSON |
| `scripts/prep_shared_env.py` | Builds the task sandbox's site-packages with the harness's own wheel functions |
| `scripts/validate_trajectories.py` | Dry-applies every scripted edit in memory and compiles it, before a lane is run |
| `settings.this-workstation.json` | The settings used on 2026-11-25, with absolute paths of the build machine |

## What it needs

| Piece | Why | Where it came from on the build machine |
|---|---|---|
| A Python 3.12 environment with `swegemma` 0.2.11, `adk-eval-core` 0.1.0, `adk-submission` 0.2.13, `google-adk` 1.36.1, `PyYAML` | Runs the harness code | The validation environment of 2026-11-23 (`tools/setup_validate_venv.py` in the brain package) |
| `cachetools`, `networkx`, `numpy` in the folder `replay/harness_extra` | The three graph tools import them | `pip install --target replay/harness_extra cachetools networkx numpy` |
| A Python 3.13 environment | Stands in for the `python:3.13-slim` sandbox image | `python3.13 -m venv sandbox_venv`, then the base packages of `docker/Dockerfile.sandbox`, then `prep_shared_env.py` |
| The data package, laid out as `pkg_root` with `tasks.jsonl`, `snapshots`, `graphs`, `embeddings`, `wheels`, `sandbox` | The task, the snapshot, the wheels the harness injects | Extracted from the competition zip |
| Git for Windows | Supplies `bash`, `tar`, GNU `patch` and `sed` for the sandbox commands | Existing installation |

## Order of operations

```bash
python scripts/validate_trajectories.py <pristine snapshot> <bundle>      # every edit compiles in memory
python scripts/prep_shared_env.py <pkg_root> <sandbox_venv> <report.json> # once
python scripts/replay.py settings.json naive                              # then: bcf_v5, brain, custom
python scripts/variance.py v5_calls.json <lanes dir> variance.json
```

For a brain lane add `--bundle <bundle dir>`; options are `--fork alias` and `--kind bug`. For a live trace use lane `custom --steps <steps.json>`; `../scripts/shadow_live.py` builds the steps file.

## What is real, what is not

| Real | Scripted | Emulated |
|---|---|---|
| Container A setup, the nine tools and their caps, the initial prompt, the brain's installer and helper, Container B's `verify_task` after every change | Which call comes next and with which arguments | The Docker sandbox (Git Bash on Windows, with four substitutions recorded in `gitbash_manager.py`); ADK's `run_skill_script` wrapper, re-implemented from its source |

To use the harness's own Docker manager on Linux instead, put `"manager": "docker"` in the settings file. That path is implemented but was not run: the build machine's Docker daemon was stopped.
