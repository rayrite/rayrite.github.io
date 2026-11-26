# Playbook 2. First run: the gate, the model server, the first tasks

**Goal:** prove that the machine measures the brain and not a broken environment, then run the first tasks. After this playbook you have a first complete run of P20 to compare against.

| Item | Statement |
| --- | --- |
| Time | About 1 to 2 hours: the gate (minutes, not measured here), the first start of the model server (it compiles its kernels the first time), then about 1 hour 30 minutes for the full run of P20 if you do step 8 the same day |
| What was executed for this playbook | `gates.py --selfcheck` and the pre-flight of the runner, on Windows, in the harness environment built by Playbook 1. The gate, the model server and the agent runs were **not run here**: they need the GPU, Linux and the data set |
| The rule of this playbook | Never run the brain on a set before its gate has passed in the same sandbox image |

Every command below is typed in the terminal on Zorin unless stated otherwise. Start every session with:

```bash
source ~/bcf/.venv-harness/bin/activate && cd ~/bcf/playbook
```

## Step 1. Tell the tools where things are

`playbook.conf` holds the paths. The values it ships with are the ones Playbook 1 creates, so most people change nothing. If you put something somewhere else, edit the file (Zorin Menu, type **Text Editor**, open the file) and check:

**Type** (executed here on Windows; on this machine it lists the parts and then reports what is not installed):

```bash
python3 tools/run_set.py --list
python3 tools/run_set.py --set P20 --part smoke_1 --version v1 --dry-run
```

**Expect:** a table of the six sets and their parts; then eleven lines starting with `ok`, among them `ok    task file .../freshswe-py/tasks.jsonl` and `ok    all 1 tasks of the list are in the task file`, and the command it would run. A line starting with `FAIL` names a path: fix it in `playbook.conf`.

## Step 2. The gate

The gate proves two things about each task in the sandbox the agent will use: that the reference fix of the task passes the hidden tests, and that no patch at all does not. It uses the harness's own grader with the scorer's rules, and it calls no model, so the model server need not run.

**Type** (not run here):

```bash
python3 tools/gates.py --selfcheck
python3 tools/gates.py --set P20 --part full
```

**Expect:** from the self-check, `The harness in this interpreter has everything gates.py uses.` (this line was produced on Windows). From the gate, two progress blocks ("Gate 1 of 2", "Gate 2 of 2") and then:

```text
reference fix resolves 20 of 20 (expected 20) | no patch resolves 0 (expected 0) | keep 20 of 20
Every task passed both gates. The list for the agent run is sets/P20/full.txt.
```

The report is in `~/bcf/results/gates/P20-full/gates.md`, one line per task.

**If not:** a task whose reference fix does not resolve points at the environment: read the row's reason in `gates.md` and the entry in Playbook 7. A task that an empty patch resolves measures nothing. Drop such tasks only after the environment is fixed and the gate is run again; a gate report is never overwritten, so remove its folder to run again.

Repeat for every other set the first time you use it (`--set R1`, `R2`, `R3`, `R4`, each with `--part full`), and for B40 before its confirmation run. You can do this now or later.

## Step 3. Start the model server

The server is a program that loads the model into the RTX 5090 and answers the harness. It runs in **its own terminal** and in the environment of the model server, and it must keep running for every agent run. Open a second terminal (Zorin Menu, Terminal again).

**Type in the second terminal** (not run here; the settings are those of the staff Getting Started notebook, as in the 2026-11-24 setup guide):

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
tail -f ~/bcf/vllm-31b.log
```

**Expect:** a stream of log lines that ends with one saying the server started, on `http://127.0.0.1:8000`. The first start takes long: it compiles kernels for the GPU. Then press `Ctrl+C` to leave the log (the server keeps running in the background) and check from the first terminal:

```bash
curl -s http://127.0.0.1:8000/v1/models
```

**Expect:** a small JSON text that contains `"gemma-4-31b-it-qat-w4a16-ct"`. That name must be exactly the `model:` line of the bundle (`gemma-4-31b-it-qat-w4a16-ct` in `dist/bcf-31b-flat/agent.yaml`): the runner refuses to start otherwise.

**If not:** read the last 50 lines of the log (`tail -n 50 ~/bcf/vllm-31b.log`) and look the message up in Playbook 7.

## Step 4. The acceptance checks, again

**Type** (not run here):

```bash
python3 tools/check_setup.py
```

**Expect:** no `FAIL`; `PASS` on Model server; `TODO` only on Gate on P20 if you have not run it yet. The message ends with `The machine is ready for the first agent run.`

## Step 5. The first task

**Type** (not run here):

```bash
python3 tools/run_set.py --set P20 --part smoke_1 --version v1
```

**Expect:** the eleven checks (`ok`), the command, then the first line printed by the runner:

```text
model gemma-4-31b-it-qat-w4a16-ct | sandbox docker | concurrency 1 | eval_config.yaml read: 8 min, 28 calls, 80 turns, command 240 s | compaction at 14,336 tokens | tasks: 1
```

and after 5 to 8 minutes `Evaluation complete: .../1 resolved`, then `Exit code 0` and the path of the results.

| Look at | Expect | If not |
| --- | --- | --- |
| The runner's first line | `eval_config.yaml read: 8 min, 28 calls, 80 turns, command 240 s` | Another budget: the wrong bundle folder in `playbook.conf` |
| `~/bcf/results/P20/smoke_1/v1-run1/summary.json` | `"total_tasks": 1` and a `resolved` count of 0 or 1 | `"errors": 1`: open `task_results.jsonl`, the `error` field says why |
| The folder `logs` of the results | One log of the agent's calls: the installer, `plan`, `find`, `apply`, a test, `finalize` | `No module named` or `command not found`: the sandbox image is wrong (Playbook 7) |
| The server terminal's log | Requests arriving, no errors | Connection errors: the server stopped; read its last lines |

The task `click_3434` was solved by both published baseline agents, so a healthy run usually resolves it; a run that ends with a patch and a clear test result is a success even when it is not resolved.

## Step 6. Three tasks

**Type** (not run here):

```bash
python3 tools/run_set.py --set P20 --part smoke_3 --version v1
```

**Expect:** the same, with `tasks: 3`: about 15 to 25 minutes. The three tasks are one that both baselines solved (`click_3434`), one that only one solved (`click_3208`) and one that neither solved (`click_3211`), so that you see the three kinds of outcome. Open the log of the task that was not solved and follow what the agent did; that is the skill every later playbook uses.

## Step 7. The same version twice, on five tasks

Before comparing two versions, see how much two runs of the **same** version differ. That difference is the noise, and a change has to be larger than that to count.

**Type** (not run here; each command about 25 minutes at the scorer's pace, up to 40 at the limit):

```bash
python3 tools/run_set.py --set P20 --part slice_A --version v1
python3 tools/run_set.py --set P20 --part slice_A --version v1
python3 tools/compare.py ~/bcf/results/P20/slice_A/v1-run1 ~/bcf/results/P20/slice_A/v1-run2 --name v1 v1
```

**Expect:** the second `run_set.py` writes `v1-run2` (a run is never overwritten); `compare.py` prints five tables and, under "What it means", that 5 pairs are a loop result.

## Step 8. The first complete run of P20

**Type** (not run here; about 1 hour 30 minutes at the scorer's pace, 2 hours 40 minutes at the 8-minute limit):

```bash
python3 tools/run_set.py --set P20 --part full --version v1
python3 tools/ledger.py
```

**Expect:** `tasks: 20`; then the ledger, `LEDGER.md` in the playbook folder, with one line per run so far. This run is the first measurement of version `v1`; Playbook 5 repeats it.

## Step 9. Stop the server

In the terminal where the server runs, or any terminal:

```bash
pkill -f "vllm serve"
```

Then `nvidia-smi` should list no process. Start it again with Step 3 whenever you run the brain.

## The checklist of Playbook 2

- [ ] Step 1: `run_set.py --dry-run` prints eleven lines with `ok`
- [ ] Step 2: the gate on P20 keeps 20 of 20
- [ ] Step 3: `curl` shows the model name of the bundle
- [ ] Step 4: `check_setup.py` ends with "The machine is ready for the first agent run."
- [ ] Step 5: one task ran end to end without a harness error
- [ ] Step 6: three tasks ran; you read one log
- [ ] Step 7: two runs of the same version on `slice_A`, compared
- [ ] Step 8: one complete run of P20, in `LEDGER.md`
