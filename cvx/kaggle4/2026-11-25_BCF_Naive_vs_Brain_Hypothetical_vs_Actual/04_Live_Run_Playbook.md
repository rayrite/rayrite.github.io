# Live-run playbook: watch the BCF brain make its own decisions on the RTX 5090

**Prepared:** 2026-11-25. **Machine it is written for:** PowerSpec G914 (RTX 5090, 32 GB) on Zorin OS 18. **Purpose:** run the real model through the real harness on `httpx_3672`, for both versions of the BCF brain and for the naive baseline, and read what the model actually did at every call.

## 0. What this kit does and how far it was verified

| Question | Answer |
|---|---|
| Why a live run is needed | The package this kit belongs to ran the real harness with the model's choices written by hand. Only a live run shows what Gemma 4 31B decides on its own |
| What runs | `run_panel.py`, the staff Getting Started notebook's evaluation cell as a script. It compiles the bundle with the harness, drives the agent from your vLLM server, and grades the result with the harness's own verifier |
| What was verified, and where | On the Windows machine that built the package: `extract_decisions.py`, `compare_live.py` and `shadow_live.py` were run against a trace written in the harness's own format by the harness's own trace class, holding the scripted lane's calls. They produced the expected table, a 14-of-14 call alignment, and the expected verdicts. `run_live.py` was exercised in `--dry-run`; `preflight.py` was run and reported exactly the checks that cannot pass on a machine with no model server |
| What was not verified | No live run. The build machine has a 6 GB GTX 1060 and no Gemma 4 server. The first live run on the G914 is therefore a test of this kit as well as of the brain |
| Sampling | Both brains sample at temperature 0.2, so two runs of the same bundle differ. That is why the playbook asks for three repeats |

## 1. Prerequisites

Complete sections 2 to 5 of the setup guide written for this machine on 2026-11-24 (`../2026-11-24_BCF_Tuning_Bottlenecks_and_Parity/07_Setup_and_Run_Guide.md`, Track B, Zorin): the `~/bcf` folder, the Python 3.12.13 environment, the data package, the model weights and the vLLM server. This kit adds two things.

| Item | What to do |
|---|---|
| Both brain versions | Copy the 2026-11-23 brain to `~/bcf/brain-v1123/` and keep the 2026-11-24 patched brain at `~/bcf/brain/`. Build each once with `python build.py` in its folder, so that `dist/bcf-31b-sequential` exists in both |
| LoRA on the model server | Start vLLM with three extra flags: `--enable-lora --max-loras 8 --max-lora-rank 128`. The official sample submission, which is the naive baseline, ships two LoRA adapters and declares them in its `agent.yaml`. The staff notebook starts its server with exactly these three settings (its cell 4, `enable_lora=True`, `max_loras=8`, `max_lora_rank=128`). The flags are harmless for the brains, which use no adapters, so use them always |

The full serve command of the setup guide, with the three flags added:

```bash
vllm serve ~/bcf/models/gemma-4-31b-it-qat-w4a16-ct \
  --served-model-name gemma-4-31b-it-qat-w4a16-ct \
  --host 127.0.0.1 --port 8000 \
  --max-model-len 32768 --dtype bfloat16 --gpu-memory-utilization 0.90 \
  --enable-auto-tool-choice --tool-call-parser gemma4 --reasoning-parser gemma4 \
  --no-scheduler-reserve-full-isl \
  --enable-lora --max-loras 8 --max-lora-rank 128
```

## 2. Bring the kit over and point it at your folders

```bash
mkdir -p ~/bcf/live-run-kit && cd ~/bcf/live-run-kit     # then copy this folder's contents here
cp settings.example.json settings.json && nano settings.json
```

`settings.json` names five things: the task file, the snapshots folder, the two brain bundles, the sample submission and where captures go. Paths may start with `~`. The values in `settings.example.json` match the layout of the setup guide, so on a standard install only the captures folder needs no change at all.

## 3. Preflight: prove it can work before spending GPU time

```bash
cd ~/bcf/live-run-kit && source ~/bcf/.venv/bin/activate
python scripts/preflight.py --settings settings.json
```

| Result to expect | Check | If it fails |
|---|---|---|
| PASS | `model server answers /models` and lists `gemma-4-31b-it-qat-w4a16-ct` | vLLM is still loading. Read `~/bcf/vllm-31b.log` and wait for the line that says the server started |
| PASS | `model returns a tool call` | The server was started without `--enable-auto-tool-choice --tool-call-parser gemma4`. Restart it with both flags. Without them the agent answers in prose and never touches the repository |
| PASS | `harness packages in this interpreter` | You are outside the environment. Run `source ~/bcf/.venv/bin/activate` |
| PASS | `bash` at `/bin/bash` | The harness's local sandbox needs it. On Windows, use the Docker sandbox or run on Linux |

The last check sends one real request with a tool definition to the model and prints the token usage of that request. It is the only check that uses the GPU.

## 4. Kick off the live run

One command runs every combination, captures everything and resumes where it stopped if interrupted:

```bash
python scripts/run_live.py --settings settings.json --name live-01 \
  --tasks httpx_3672 --bundles v1123 v1124 naive --repeats 3
```

| Option | Meaning | Default in this playbook |
|---|---|---|
| `--tasks` | Instance ids from `tasks.jsonl`. The public one used throughout the package is `httpx_3672` | `httpx_3672` |
| `--bundles` | `v1123` (brain of 2026-11-23), `v1124` (patched brain of 2026-11-24), `naive` (the official sample submission) | all three |
| `--repeats` | Runs per combination. Each is a fresh sandbox and a fresh conversation | 3 |
| `--sandbox` | `subprocess` (what the staff notebook uses) or `docker` (slower, closer to the scorer) | `subprocess` |

Nine runs at most eight minutes each fit well under an hour and a half, usually much less. Leave the terminal open, or start the command inside `tmux` so that a closed window does not kill it. `run_live.py` skips any run whose folder already holds `task_results.jsonl`.

What `run_live.py` does for each run: it calls `run_panel.py` with the bundle's own budgets (8 minutes, 28 tool calls, 80 turns, 240 seconds per command for the brains), it then runs `extract_decisions.py`, and it runs `compare_live.py` against the scripted lane shipped under `reference/lanes/`.

## 5. Read the decisions

Every run folder holds four files worth reading first.

| File under `captures/<name>/<bundle>/<task>/r<k>/` | What it holds |
|---|---|
| `decisions.md` | One row per tool call the model made: which agent, what role, the target, the second it was made, what came back, and flags such as `INSTALLED`, `APPLIED`, `NOT_APPLIED`, `TEST_FAIL`, `READY` |
| `decisions.json` | The same as data, plus the checkpoints |
| `live_vs_scripted.md` | The live calls aligned with the hand-written lane, marked `same`, `live only` or `scripted only` |
| `traces/trace_httpx_3672.json`, `logs/httpx_3672.log` | What the harness itself recorded: every event with token usage, and the agent's console |

### 5.1 The checkpoints, and what a healthy run looks like

| Checkpoint | Healthy value | Why it matters |
|---|---|---|
| `installer` | `INSTALLED` | `INSTALL_FAILED` means the skill script could not find the repository or the helper. Every later helper call then fails |
| `baton_relayed` | `yes, verbatim` | The planner's whole job is to echo the spec. A reworded or missing spec leaves the solver without targets, route or budget plan |
| `first_edit` | call 2 to 6, under 150 seconds | The solver prompt asks for a source edit by call 10 and before 150 seconds |
| `edit_refusals` | 0 or 1 | Each `NOT APPLIED` is a call spent. Several in a row on one file means the model is copying search text badly |
| `first_red_test` and `decision_at_first_red` | `kept the rename` | This is the decisive moment on this task. See section 6 |
| `finalize` | `RESULT: READY` | `NOT READY` means a syntax error is on disk; `NO SOURCE CHANGES` means nothing was edited |
| `container_b_resolved` | `True` | The harness's verdict on the submitted patch |

### 5.2 The call skeleton the prompts ask for

| Agent | Tool call | Role | What the model is told to do |
|---|---:|---|---|
| Planner | 1 | `install` | Run the skill's installer once, with no argument |
| Planner | 2 | `plan` | One command that builds the spec from a six-line brief |
| Planner | text | none | Answer with the spec, nothing else. A text answer is not a tool call |
| Solver | 3 | `ctx` | Read about 60 lines around the first target |
| Solver | 4 to 10 | `apply` | Edit one file per call, following the route |
| Solver | 11 | `test` or `repro` | One related test file |
| Solver | 12 | `finalize` | Compile every changed file, remove scratch files |
| Solver | 13 | `submit_patch` | Submit once, confirm `patch_size` is greater than 0. Free: it is not charged |

The scripted lane used 13 tool calls, 12 of them charged. The budget allows 28.

## 6. The decision to watch: the first red test

`httpx_3672` orders a rename. A correct fix turns the visible test file red, because the visible tests still call the old name. The harness replaces those tests with hidden ones when it grades. Neither the brain's solver prompt nor the sample submission's prompt states a rule for this situation. The live run answers a question the package could not: what the model does when the test it just ran turns red.

| `decision_at_first_red` | What the model did | Graded result, measured in the package |
|---|---|---|
| `kept the rename` | Continued to `finalize` and submitted | Resolved |
| `alias (old name re-added as assignment)` | Added `complete = reset` so the visible test passes | Resolved, at the cost of two more calls |
| `reverted (old def restored)` | Undid the rename | Not resolved: 5 of 24 graded tests fail |

If several repeats land on `reverted`, the brain has a gap that costs the task. The package's document `03_How_the_Brain_Improves_on_Naive.md`, section 5, gives the one-sentence rule that closes it.

## 7. Compare with what the package measured

`live_vs_scripted.md` is the place to look for surprises. Read its alignment table in this order.

| Column | How to read it |
|---|---|
| `same` | The model made the call the prompts ask for, on the same target |
| `live only` | A call the scripted lane did not make. Extra `ctx`, `grep` or `status` calls are normal. An `edit` or `apply` after the first red test is the decision of section 6 |
| `scripted only` | A call the model skipped. A missing `finalize` is worth a look at the next row: the prompt allows a direct `submit_patch` |

Numbers that mean nothing on their own: the token totals are summed over trace entries, and one entry can carry the same usage as its neighbour. Use them to compare runs with each other, not as a cost figure.

## 8. Shadow verdicts for the live trajectory (optional)

The live run reports one verdict, for the final patch. To learn at which call the live trajectory started holding a passing patch, re-execute its calls with the replay driver:

```bash
python scripts/shadow_live.py captures/live-01/v1123/httpx_3672/r1/decisions.json \
  --steps /tmp/live_steps.json --run --settings replay/settings.json \
  --bundle ~/bcf/brain-v1123/dist/bcf-31b-sequential
```

This needs the replay toolkit described in `replay/README.md`. It was exercised on Windows with the Git Bash stand-in for the sandbox. On Linux it needs the `"manager": "docker"` setting and the `swebench-sandbox:latest` image of the setup guide, section B.6. That Docker path is implemented but has not been run anywhere yet.

## 9. Panel runs (after the single task looks healthy)

The single task is one roll of one task. For a number that means something, run the ranking panel three times per bundle with `run_panel.py` directly, as the setup guide's section 7 describes, and read the result with its `run_report.py`.

## 10. Bring the results back into the package

Copy the whole `captures/<name>/` folder into `live-run-kit/captures/` of the package. Keep `manifest.json` and `SUMMARY.md` at its top: they record the bundle fingerprint (a hash of every file in the bundle), the sandbox and the server address for each run, which is what makes a capture interpretable later.

## 11. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| `run_panel.py` prints `no OpenAI-compatible server answered` | vLLM is down or on another port | `curl -s http://127.0.0.1:8000/v1/models`, or pass `--base-url` |
| `the bundle declares ... but the server serves ...` | The served name differs from the bundle's `model:` line | Restart vLLM with `--served-model-name` set to exactly that line |
| Every task ends with an empty patch and no tool calls | The model returned prose instead of tool calls | The server lacks `--enable-auto-tool-choice --tool-call-parser gemma4` |
| The naive runs fail with an adapter error | The server runs without LoRA | Add `--enable-lora --max-loras 8 --max-lora-rank 128` |
| `INSTALLED` never appears; helper calls print `No such file` | The skill script did not run | Read `logs/httpx_3672.log`. The noskill bundles exist for this case |
| `decisions.md` says `no trace at ...` | The trace was not written | Pass `--instance httpx_3672`, and read `logs/` instead |
| A run stops early with `Agent exceeded session timeout` | The 8-minute budget ended | Normal for a slow task. Compare `agent_elapsed_seconds` across repeats |

## 12. Notes for a first week on Linux

| Habit from Windows | On Zorin | The mistake to avoid |
|---|---|---|
| Paths with backslashes | Forward slashes, and your folder is `/home/<you>` or `~` | Pasting a Windows path such as `C:\Users\...` into a command |
| `python` | `python3`, or `python` after `source ~/bcf/.venv/bin/activate` | Installing into the system Python with `sudo pip` |
| Double-click to run | Run a script with its interpreter: `python scripts/preflight.py` | Expecting a copied file to be executable. Files copied from Windows lose that bit; `chmod +x file` restores it |
| Files edited in a Windows editor | Files must end lines with LF | A CRLF file makes bash fail with `$'\r': command not found`. Fix with `sed -i 's/\r$//' file` |
| Case does not matter | It does | `Tasks.jsonl` and `tasks.jsonl` are two files |
| A closed window keeps a job running | It does not | Start long runs inside `tmux`: `tmux new -s live`, run, then detach with Ctrl+B and D |
| Software from a website | `sudo apt install <name>` first | Adding repositories by hand when the package exists |
| Drive letters | Disks are folders: the Windows disk is `/mnt/c` | Working under `/mnt/c` for the model or the harness. It is many times slower than the Linux file system |

## Sources

| Source | Used for |
|---|---|
| `run_panel.py`, the 2026-11-24 package's tool, unchanged | The evaluation settings: budgets from the bundle, compaction at 14,336 tokens, model registry |
| Staff Getting Started notebook, cell 4 (`input/kagglecomp/docs/markdown/Kaggle-03-GettingStarted.md`, lines 236 to 275) | LoRA settings of the model server; tool and reasoning parsers |
| `swegemma/results.py`, `swegemma/harness/agent_runner.py`, `adk_eval_core/tracing/trace.py` in the harness | The files a run writes and the trace format that `extract_decisions.py` reads |
| `2026-11-24_BCF_Tuning_Bottlenecks_and_Parity/07_Setup_and_Run_Guide.md`, sections 2, 3, 5, 6, 7 | Folder layout, installation, the serve command, smoke panel |
| vLLM documentation, Tool Calling (https://docs.vllm.ai/en/latest/features/tool_calling.html) | `--enable-auto-tool-choice` and `--tool-call-parser` are both required for the model to emit tool calls |
| Bundle files `configs/plan_sampling.yaml` and `configs/solver_sampling.yaml` | Temperature 0.2, output and thinking budgets |
