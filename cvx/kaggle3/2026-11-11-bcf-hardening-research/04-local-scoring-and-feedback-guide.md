# 04 — Local Scoring & Feedback Guide: Evaluating BCF Runs on the RTX 5090, Reading the Artifacts, and Turning Results into Tuning Plans

**Date:** 2026-11-11 · **Role:** technical writer + evaluation engineer (BCF hardening L5) · **Method:** LOCAL ONLY, no web research.
**Scope:** running `swegemma eval` locally (PowerSpec G914, RTX 5090 32 GB, Windows 11 + WSL2 or native Linux), interpreting every result artifact, diagnosing failures, clustering them against the task taxonomy, understanding what local scores do and do not predict about Kaggle, and converting findings into BCF tuning decisions.
**Nothing under `input/` or `deliverables/2026-11-11-bcf-gemma4-brain/` was modified by this guide.** All experiments run on *copies* of the submission trees in scratch space.

---

## How to read this guide

**Evidence classes.** Every empirical claim carries a citation and one of three classes:

| Class | Meaning |
| --- | --- |
| MEASURED | A number computed from a local artifact in this repo (file path given) or a measurement reported in a cited local capture. |
| REPORTED | A competitor/staff claim from a captured Kaggle thread. Thread ids (e.g. 756400) resolve to `scratch/bcf-2026-11-11/intel_texts/topic_<id>.md` (PRIMARY verbatim dumps) or to the digests/briefs (SECONDARY). Staff claims are labeled STAFF; everything else is unverified unless corroborated. |
| ESTIMATE | Derived in this project, not yet measured on the local GPU. **No local 5090 GPU eval has been executed yet** (02a §3); every 5090 timing number below is an ESTIMATE until the M1–M15 measurement plan (02a §6) replaces it. |

HYPOTHETICAL marks invented numbers used in worked examples. They are teaching devices, never evidence.

**Source legend** (short forms used throughout):

| Short form | File |
| --- | --- |
| HR | `input/kagglecomp/kagglecomp_data_package/HARNESS_README.md` (sections cited as §n) |
| brief | `input/kagglecomp/intel_20261111/00-intel-brief-2026-11-11.md` (implications cited as B#) |
| synthesis | `scratch/bcf-2026-11-11/intel/00-synthesis.md` (constraints cited as S#) |
| solvability | `scratch/bcf-2026-11-11/intel/solvability-scoring.md` |
| 02a / 02b | `scratch/bcf-hardening-2026-11-11/02a-bottlenecks.md` / `02b-levers.md` |
| empirical | `scratch/bcf-2026-11-11/design/bcf-empirical-report.md` |
| compliance | `scratch/bcf-2026-11-11/design/compliance-review.md` |
| e4b | `scratch/bcf-2026-11-11/design/e4b-viability-review.md` |
| architecture | `scratch/bcf-2026-11-11/design/architecture.md` (canaries C0–C7, §10) |
| taxonomy | `scratch/bcf-2026-11-11/taxonomy.md` + `taxonomy.json` (129-task classification) |
| index | `scratch/bcf-2026-11-11/index.json` (per-task patch/test stats) |
| LB CSV | `input/kagglecomp/intel_20261111/leaderboard-public-2026-11-11.csv` (5,439 teams) |

**The two submission trees under test** (read-only inputs to every eval):

- 31B main: `deliverables/2026-11-11-bcf-gemma4-brain/02-bcf-brain-31b/submission/`
- E4B bonus: `deliverables/2026-11-11-bcf-gemma4-brain/03-bcf-brain-e4b/submission/`

Both are `SequentialAgent(bcf_plan → bcf_solver)` with the byte-identical `bcf.py` helper (sha256 `b6ac6a07…`, 02b header). Current shipped budgets (02b §A): 31B `eval_config.yaml` = timeout 180 s / 50 tool calls / 4.5 min / 50 turns; E4B = 150 s / 40 / 4.0 min / 40. Sampling: 31B temp 0.2, top_p 0.95, top_k 64, max_output_tokens 6144, seed 7, thinking_budget 2048, include_thoughts true; E4B temp 0.0, max_output_tokens 4096, thinking_budget 0.

---

## 0. The scoring model in 90 seconds

Everything in this guide hangs on one criterion. A task is **resolved = True (score 1.0)** if and only if, in a *fresh* verification container (Container B):

1. the agent's patch applied (4-pass resilient apply, HR §8.2),
2. protected test/config files were reset to baseline and `task.test_patch` applied (anti-tampering, HR §8.2),
3. hermetic `pytest` exited **0**, **and**
4. the JUnit XML report exists, has `passed_tests > 0`, `failures == 0`, `errors == 0`, and **every required test node explicitly passed without being skipped** (HR §8.2 step 5). Required nodes = `FAIL_TO_PASS` + `PASS_TO_PASS` lists when present, otherwise test functions extracted from `test_patch` (HR §8.2; 755554 PRIMARY).

The competition metric is `Resolution Rate = resolved tasks / total tasks in the split` (HR §8.2). There is **no partial credit**: a patch that fixes 6 of 7 required tests scores exactly 0, and a patch that passes every test but leaves one required sibling skipped also scores 0 (the rich_3486 mechanism, solvability §1.1).

Two consequences that shape all local practice:

- **"resolved" is an upper bound on correctness, not a certificate.** A mutation audit found 24/163 (14.7%) planted broken fixes still marked resolved; inverted booleans and off-by-one edits escape most often (756400 REPORTED; brief B20).
- **"not resolved" is not necessarily a brain failure.** Missing test dependencies, scorer conventions, and environment quirks zero out correct patches at scale: 277/1,143 (24%) of real correct fixes fail verification purely on conventions in one audit (757893 REPORTED; solvability §3). Sections 3–5 exist to separate the two.

The agent side (Container A) runs the identical protocol locally and on Kaggle: 7-section initial prompt, budget-gated tools, max 3 continuation nudges, compaction at ~14,336 tokens, patch extraction via `git add -N . && git diff --binary` (HR §4–§8). Local eval is predictive **only to the extent the serving path and sandbox are pinned to the scorer's** (brief B22; 02a §1 "key asymmetry").

---

## 1. Running local evals

### 1.1 One-time staging (before any eval)

The dataset zip is `input/kagglecomp/kagglecomp_data_package/gemma-4-developer-agent.zip` (21.9 GB on disk, MEASURED `scratch/bcf-2026-11-11/zip_listing.txt`). Verified contents (zip_listing.txt, MEASURED this pass): `snapshots/` (129 repo `.tgz`, median 214 MB, max 334.9 MB, 21.5 GB total), `wheels/` (124 wheels), `graphs/` + `embeddings/` (127 each — 2 tasks have no graph data), `sandbox/setup.py`, `docker/` (Dockerfile.sandbox, Dockerfile.public, imp.py, telnetlib.py), `tasks.jsonl`, `sample_submission/`. `tasks.jsonl` is already extracted at the data-package root: 129 lines with keys `instance_id, repo, base_commit, patch, test_patch, problem_statement, hints_text, created_at` (MEASURED this pass).

Stage everything **inside the WSL2 ext4 filesystem (or native Linux), never on a `/mnt/d` bind mount**: the 9p/drvfs small-file penalty makes snapshot extraction an estimated 3–10x slower (02a §3, E7/E8 ESTIMATE; ~3k files per repo).

```bash
# Inside WSL2 (Ubuntu) or native Linux. Target on ext4, e.g. ~/bcf.
mkdir -p ~/bcf/data && cd ~/bcf/data
ZIP=/mnt/d/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_alibaba/input/kagglecomp/kagglecomp_data_package/gemma-4-developer-agent.zip
unzip -o "$ZIP" 'snapshots/*' 'wheels/*' 'sandbox/*' 'docker/*' 'tasks.jsonl' -d .
# Build the sandbox image (one-time, ESTIMATE 2-5 min; 02a §3):
docker build -t swebench-sandbox:latest -f docker/Dockerfile.sandbox .
```

The sandbox is air-gapped at runtime (`network_mode="none"`, HR §4.1), so the wheels cache must be complete *before* the first run. Budget ~60–100 GB disk for a comfortable rig (02a E16 ESTIMATE).

**Pin the runtime stack** in every results directory (brief B22; 02a §6 instrumentation discipline): wheelhouse v31 (dataset-version 19987205), vLLM 0.19.1 (gemma4 parser sha256 `682b2152…b6889`), swegemma 0.2.11, adk-submission 0.2.13, google-adk 1.36.1, Python 3.12.13 host, `python:3.13-slim` sandbox image. Newer vLLM rewrote the gemma4 parser (0.24) and fixes bugs the scorer still has — drift invalidates A/B comparisons (02a §3 "serving-path drift"; 753521, 744354 REPORTED). Verify the pinned wheel contains sm_120 (RTX 5090/Blackwell) kernels **before** any A/B; if it does not, you have a build project, not an eval (02a §3 verification item).

### 1.2 Serving on the 5090: the parity envelope

The scorer serves `gemma-4-31b-it-qat-w4a16-ct` on 4x L4, TP4, `gpu_memory_utilization=0.80`, `max_model_len=32768`, `tool_call_parser="gemma4"`, `reasoning_parser="gemma4"`, `enable_thinking=True` (HR §3.1). The 5090 is a single 32 GB GPU; the deviations below are unavoidable and must be *documented per run*, not hidden:

| Setting | Scorer (HR §3.1) | Local 5090 recommendation | Why / evidence |
| --- | --- | --- | --- |
| Tensor parallel | 4 | 1 | Single GPU. Removes TP all-reduce; decode ESTIMATE 50–80 tok/s vs 33–35 MEASURED on 4xL4 (02a E1/E2; 750974/748287). |
| `max_model_len` | 32,768 | Lower (e.g. 16,384–24,576) or fp8 KV | KV ceiling ESTIMATE ~10–12k tokens bf16 / ~20–24k fp8 after ~17 GB weights + graphs (02a E4/E5). 32,768 will not fit. Measure the real KV token count from the vLLM startup log (M2). |
| Concurrency | sequential tasks | 1 for 31B | `--concurrency 2` halves per-sequence KV (02a §3). E4B (~4–5 GB weights) has headroom for 2–4 (ESTIMATE). |
| Container limits | 4 GiB / 2 vCPU | Keep identical | The Docker backend enforces these itself (HR §4.1). Do not raise them for speed — bootstrap/pytest timings stop being predictive (02a §3). |
| Parsers / thinking | gemma4 / enable_thinking | Identical flags | Parity is the whole point (brief B22). Omit `thinking_level` on the vLLM path; use `include_thoughts` + `thinking_budget` (HR §2.4 note). |
| Prefill speed | 4x L4 ~480 TFLOPS aggregate | 5090 ~210 TFLOPS dense | Prefill-heavy steps (compaction summarizer, 82 s-class spikes) may be *slower* locally (02a E3 ESTIMATE). Decode wins do not apply to them. |

Because BCF's steady-state context is designed under ~12k tokens (architecture §8 context budget), the reduced local window is tolerable — but any local A/B that depends on long-context behavior is non-predictive (02a §7 note 6).

**Warm-server practice.** Cold vLLM startup is ESTIMATE 4–9 min locally (02a E6; remote 12.6 min MEASURED, 746250). Amortize it:

1. Batch reruns into **one** `swegemma eval` invocation with `--task-ids` rather than many single-task invocations.
2. Keep the eval process (and its server) alive while you edit prompts/configs in scratch copies; re-invoke only when the submission tree changes.
3. If your build supports pointing the model registry at an already-running server (check `--models-yaml` and the `api_base` wiring, HR §3.3/§9.1 — not documented as an external-server flag; verify on your build), run vLLM as a persistent service. Otherwise treat startup as a fixed per-invocation cost and log it (M1).
4. The first task after a cold start pays cold-kernel latency, ESTIMATE +5–20 s (02a §3). Never use task #1 of a cold run for timing comparisons.

### 1.3 The exact CLI (HR §9.1)

The documented reference invocation:

```bash
swegemma eval \
  --tasks tasks.jsonl \
  --snapshots-dir snapshots \
  --submission-dir sample_submission \
  --results-dir results/run_01 \
  --sandbox docker \
  --max-tool-calls 50 \
  --max-time-minutes 30 \
  --concurrency 2 \
  --display auto
```

All documented flags (HR §9.1):

| Flag | Meaning | Local BCF usage |
| --- | --- | --- |
| `--tasks <file>` | Task JSONL (the 129-task `tasks.jsonl`) | Point at staged `~/bcf/data/tasks.jsonl`. |
| `--snapshots-dir <dir>` | Repo snapshot `.tgz` directory | Staged `snapshots/` (129 files). |
| `--submission-dir <dir>` | Submission tree to compile and run | A **scratch copy** of `02-bcf-brain-31b/submission/` or `03-bcf-brain-e4b/submission/`. Never the deliverable tree itself. |
| `--results-dir <dir>` | Output root (all artifacts, §2) | One dir per run, named `results/<date>_<track>_<config-hash>_<purpose>/`. |
| `--sandbox {docker,subprocess}` | Isolation backend (§1.5) | `docker` for anything predictive. |
| `--max-tool-calls <N>` | Tool-call budget override | Match the tree's `eval_config.yaml`: 50 (31B) / 40 (E4B). |
| `--max-time-minutes <N>` | Agent wall-clock cap override | 4.5 (31B) / 4.0 (E4B). |
| `--concurrency <N>` | Parallel tasks; auto-enables multi-slot dashboard | 1 for 31B (KV); 2–4 E4B (ESTIMATE). |
| `--task-id <id>` / `--task-ids <id1> <id2> …` | Evaluate specific `instance_id`(s) | Smoke + subset iteration (§1.4). |
| `--shard-index <k> --num-shards <M>` | Deterministic shard: `task_idx % M == k` | Checkpointing / multi-machine (§1.6). |
| `--models-yaml <path>` | Custom model-alias/pricing map | Only if you need alias or pricing overrides; keep competition aliases intact. |
| `--skip-agent-patch` | Bypass Phase 1 (`agent_patch = ""`); verify baseline test behavior in Phase 2 | Empty-patch side of the gold/empty audit (§5.4). |
| `--display auto` | UI mode | `auto`; dashboard appears with concurrency > 1. |

**Budget-parity check (do this on every new build).** HR §7.1 documents `eval_config.yaml` loading for the *Kaggle* path (`scripts/inference.py`); whether the local CLI honors the submission's `eval_config.yaml` or only its own flags is not stated in HR §9.1. Two safeguards:

1. Pass CLI flags equal to the tree's four `eval_config` values (and set `SWE_TIMEOUT_SECONDS`/`SWE_MAX_TIME_MINUTES`/`SWE_MAX_TOOL_CALLS`/`SWE_MAX_TURNS` if your build reads them — documented for `inference.py`, HR §7.1).
2. **Verify the effective budgets in the artifact**: the initial prompt's "Task Budget" section lists the active limits (HR §5.2 section 3). Open `logs/<id>.log` and read that block before trusting any run. If it says 60.0 minutes / unlimited calls, your `eval_config` was ignored and the run is not testing what Kaggle will run.

Remember the defaults when nothing is set: 60 min, CLI tool-calls `None`, turns 500, command timeout 300 s (HR §7.1). On the scorer, **defaults = NO limit** for the four eval_config fields (synthesis S3; 743063 STAFF) — which is why the shipped `eval_config.yaml` is load-bearing.

### 1.4 Smoke → subset → full: the three run modes

**(a) Smoke — one task, mechanism check (minutes).**

```bash
swegemma eval --tasks tasks.jsonl --snapshots-dir snapshots \
  --submission-dir ~/bcf/work/31b-copy --results-dir results/smoke_01 \
  --sandbox docker --task-id fastapi_11194 \
  --max-tool-calls 50 --max-time-minutes 4.5 --concurrency 1
```

Pick a task whose mechanics you want to see (fastapi_11194: d2 few-lines, clean cues, taxonomy §9). A smoke run answers: does the tree compile, does install run once, does the spec render, does an edit land, does `check` pass, does `submit_patch` fire, does Phase 2 run? It does **not** answer "is the config good" — one task is far below the noise floor (§5).

The architecture's C2 canary set (architecture §10) is the right 8-task smoke battery, each chosen for a mechanism:

| Canary task | Why it is in the set (architecture §10 C2) |
| --- | --- |
| fastapi_14430 | d1 one-line happy path |
| rich_3471 | d1 one-line happy path |
| rich_3064 | URL-only statement (76 chars; 757149, brief C16) — sparse reconstruction |
| rich_3480 | hang bug (infinite-loop family) — timeout-wrapped repro discipline |
| fastapi_14356 | brace-heavy statement + multidict mechanism — interpolation safety |
| fastapi_14371 | d4 multi-file — long-trajectory/compaction survival |
| rich_3935 | few-lines contract task |
| requests_7433 | protocol duck-typing (type-introspection) |

**Caveat:** fastapi_14430, fastapi_14356, and fastapi_14371 are on the 27-task dependency-gap list (brief §4a). Their *resolved* flag is meaningless in an unmodified sandbox; the C2 drills assert **behavior** (first edit ≤ call 6, byte-identical spec re-entry, no duplicated edits, patch hygiene), not resolution. Keep drill assertions and scored denominators separate.

**(b) Subset — stratified iteration set (the workhorse).** Use `--task-ids` with a frozen, stratified, masked subset. Construction recipe:

1. Start from the discrimination-valid universe: gold passes AND empty fails. The best local estimate is 68/129 valid (756400 REPORTED: fastapi 29, rich 39, requests 0, httpx 0), but the valid ids are **not enumerated in the local capture** — you must run your own gold/empty audit (§5.4) before freezing.
2. Exclude unconditionally: `rich_3486`, `fastapi_14186` (structurally never-resolve, solvability §1.1; 757893); the 27 inline_snapshot/dirty_equals fastapi ids (brief §4a) plus the 4 local candidates `fastapi_14266/14609/15030/15745` pending reconciliation; empty-pass tasks (`rich_3468` plus shadowing-dependent `requests_7309/7315/7427` until the wheel fix is verified, solvability §2).
3. Conditionally exclude per backend: the requests httpbin/network set (12 per 757661; 8 specific ids per 754586 — reconcile locally) and `rich_3472` if your sandbox Python is 3.13 (solvability §1.2).
4. Stratify what remains by repo x difficulty x edit_shape (taxonomy §5) so the subset mirrors the corpus: ~75% one-line/few-lines, a few multi-file, d1–d4 coverage.

A **provisional 30-task iteration set** (all ids verified against taxonomy §9 and the exclusion lists this pass; freeze only after your own gold/empty audit):

| Stratum | ids (n) |
| --- | --- |
| rich d1 (6) | rich_2943, rich_3006, rich_3454, rich_3480, rich_3518, rich_4077 |
| rich d2 (6) | rich_2725, rich_3063, rich_3064, rich_3278, rich_3935, rich_3944 |
| rich d3 (3) | rich_3180, rich_4006, rich_4070 |
| rich multi-file feature (1) | rich_3675 |
| fastapi d1 (5) | fastapi_14258, fastapi_14301, fastapi_14463, fastapi_14479, fastapi_14786 |
| fastapi d2 (4) | fastapi_11194, fastapi_13920, fastapi_14873, fastapi_5624 |
| fastapi d3 (2) | fastapi_13207, fastapi_15763 |
| fastapi d4 multi-file (1) | fastapi_14448 |
| requests conditional sentinels (2) | requests_7433, requests_6644 (score only if your audit validates them; 6644 is half of the 6644/7315 opposite-fix pair, taxonomy insight 4 — a regression canary) |

Notes: rich_3278 is a known intrinsic localization miss (zero lexical overlap, empirical §5) — keep it as a *sentinel*, expect failure, and do not tune to it. rich_3480/rich_4006 are hang-bug tasks: they verify timeout discipline. d5/large tasks (rich_3930, fastapi_15800) are deliberately **not** in the promotion denominator — 35 of 38 multi-file gold tasks were never solved by anyone (753524 REPORTED) — run them as a separate *budget-telemetry pair* to measure worst-case wall time and large-data behavior (architecture §9 row 16).

```bash
swegemma eval --tasks tasks.jsonl --snapshots-dir snapshots \
  --submission-dir ~/bcf/work/31b-copy --results-dir results/subset_armA_r1 \
  --sandbox docker --concurrency 1 --max-tool-calls 50 --max-time-minutes 4.5 \
  --task-ids rich_2943 rich_3006 rich_3454 rich_3480 rich_3518 rich_4077 \
             rich_2725 rich_3063 rich_3064 rich_3278 rich_3935 rich_3944 \
             rich_3180 rich_4006 rich_4070 rich_3675 \
             fastapi_14258 fastapi_14301 fastapi_14463 fastapi_14479 fastapi_14786 \
             fastapi_11194 fastapi_13920 fastapi_14873 fastapi_5624 \
             fastapi_13207 fastapi_15763 fastapi_14448
```

Expected wall time: 30 tasks x ~2–3.5 min/task local ESTIMATE ≈ 1–2 h warm (02a E15 scaling; remote-equivalent mean 2.5–3.2 min, architecture §8). This is the unit of iteration: **one subset run is one observation; a decision needs paired repeats** (§5.5).

**(c) Full — all 129 (gate runs only).** Same command without `--task-ids`. ESTIMATE 3.5–5.5 h at concurrency 1, server warm (02a E15). Run full passes only at C6 gates (architecture §10) and before submissions — never for routine iteration. Report full-run numbers on the **masked denominator**, and also report the raw count with the mask list attached, so results stay comparable across environments (§5.3).

### 1.5 Docker vs subprocess sandbox on WSL2/native

| Dimension | `--sandbox docker` (default) | `--sandbox subprocess` |
| --- | --- | --- |
| Isolation | `swebench-sandbox:latest`, `network_mode="none"`, 4 GiB RAM (OOM kill = exit 137), 2 vCPU, `/workspace`, `TEST_TMPDIR=/tmp` (HR §4.1) | Temp dir `swegemma_sandbox_<id>_` with `workspace/ tmp/ wheels/ venv/`; path rewriting for `/workspace`, `/tmp`, `/wheels`, `/usr/local/bin`; process-group SIGKILL on timeout (HR §4.1) |
| Network behavior | Air-gapped: requests tests that expect a *timeout* on connect fail instantly with `OSError: [Errno 101] Network is unreachable` (754586 PRIMARY) | Inherits host network stack behavior — the 8 requests cases differ between backends (754586 Q2, staff-unanswered) |
| Python | 3.13 (image `python:3.13-slim`; pytest unpinned, build-date dependent — 754586 Q1) | Host venv Python (e.g. 3.12.13) — rich_3472's AttributeError-format failure is 3.13-conditional (solvability §1.2) |
| Resource parity | Matches scorer quotas exactly (HR §4.1) | No 4 GiB/2 vCPU quota; desktop speed leaks into timings (02a §3) |
| Warm pool | `/workspace` + `/tmp` + `/var/tmp` wiped between tasks (HR §4.1) | Fresh temp dir per task |
| BCF install ladder | `git rev-parse` → `/workspace` probe works | No `/workspace`; the F3-fixed sandbox probe (ancestor `workspace/.git`, unique `swegemma_sandbox_*`) is exercised (compliance F3) |
| WSL2 specifics | Docker Desktop WSL2 backend: near-native ext4-in-VHDX I/O; per-exec VM hop ESTIMATE 0.1–0.5 s (02a E14). Windows-drive bind mounts are the slow path (E8) | Runs wherever the host Python runs; keep it on ext4 too |

**Decision rule:** use **docker** for every run whose numbers will feed a tuning decision or a submission gate — it is the scorer-default backend and the only one with matching network/Python/quota semantics. Use **subprocess** for (a) machines without a Docker daemon, (b) fast CPU-side mechanism drills where environment realism is irrelevant, and (c) deliberately testing the F3 install ladder. Never mix backends within an A/B pair; the requests failure set alone can flip several tasks between them (754586). The scorer's actual backend is staff-unconfirmed (754586 Q2; solvability §1.2) — docker is the conservative choice because it reproduces the *stricter* environment.

### 1.6 Sharding and concurrency

- `--concurrency N` runs N tasks in parallel inside one invocation and activates the dashboard (HR §9.1). On the 5090, 31B stays at 1 (KV ceiling, 02a §3); E4B can try 2–4 (ESTIMATE). Concurrency changes *timing* (shared GPU, shared disk) — never compare per-task wall times across different concurrency settings (02a M12 discipline: calibration runs sequential).
- `--shard-index k --num-shards M` selects tasks where `task_idx % M == k` (HR §9.1). Uses on a single machine: (1) checkpoint long runs — run shard 0, then shard 1, each writing its own results dir, so a crash loses at most one shard; (2) resume after a server freeze without re-paying completed tasks. Across two machines it splits a full run — but each machine needs its own pinned stack and its own warm server.
- Merging shards: `task_results.jsonl` is append-only per finished task (HR §9.2), so concatenate shard JSONLs and recompute aggregates yourself; each shard's `summary.json` covers only its own tasks. Deduplicate by `instance_id` if a shard was re-run.

```bash
# Merge two shards and recompute the masked rate (schema-robust; see §2.2):
python3 - <<'EOF'
import json, pathlib
rows, seen = [], set()
for p in ["results/shard0/task_results.jsonl", "results/shard1/task_results.jsonl"]:
    for line in pathlib.Path(p).read_text().splitlines():
        if not line.strip(): continue
        r = json.loads(line)
        iid = r.get("instance_id") or r.get("task_id") or r.get("id")
        if iid in seen: continue
        seen.add(iid); rows.append(r)
res = sum(1 for r in rows if r.get("resolved") is True)
print(f"merged: {res}/{len(rows)} = {res/len(rows):.3f}  (apply your mask before reporting)")
EOF
```

### 1.7 Baseline verification with `--skip-agent-patch` (and the gold side)

`--skip-agent-patch` bypasses Phase 1 entirely (`agent_patch = ""`) and runs Phase 2 on the empty patch (HR §9.1). This is the **empty side** of the discrimination audit: on a valid task the baseline tests must FAIL without a fix; any task that *passes* empty is a free point that injects noise into every A/B (756400: 5 such tasks; brief B15).

```bash
swegemma eval --tasks tasks.jsonl --snapshots-dir snapshots \
  --submission-dir ~/bcf/work/31b-copy --results-dir results/empty_audit \
  --sandbox docker --skip-agent-patch
```

Known empty-passers to watch (solvability §2, PRIMARY 747248): `requests_7309`, `requests_7315`, `requests_7427` pass empty **only because the bundled requests wheel shadows the patched repo** — after the wheel fix they must fail empty; `rich_3468` passes empty even in a fixed setup (non-discriminating, drop it). 756400 also found 2 fastapi empty-passers (ids not enumerated locally — your audit will name them).

The **gold side** (reference patch must PASS) has no documented CLI flag. Two honest routes:

1. **Library-level driver (recommended).** `verify_task` in `swegemma/harness/verification.py` is the exact Phase-2 entry the scorer uses (HR §8.2). A short driver that loads each task from `tasks.jsonl` and calls `verify_task` with `prediction = task["patch"]` reproduces the community gold audits (756400 ran "every public task through the official harness twice"; 751487's calibrated-sandbox gold run). Schematic — check the installed 0.2.11 signature before use:

```python
# Schematic gold audit driver — adapt to the installed swegemma API.
# verify_task is the scorer's own Phase-2 path (HR §8.2). CPU-only, no GPU.
import json
from swegemma.harness import verification   # exact import path: verify on your build
for line in open("tasks.jsonl", encoding="utf-8"):
    t = json.loads(line)
    # result = verification.verify_task(task=t, agent_patch=t["patch"], ...)
    # record result.resolved, result.error, test exit code -> gold_audit.jsonl
```

2. **CPU-only re-verification runner.** 756400 released an Apache-2.0 CPU-only patch re-verification runner (TechNaom/gemma4-agentic-swe) and 756315 a pytest-verified context-selection harness (brief C8/C17). Not fetched (local-only policy); if you later obtain them through permitted channels, they do this without GPU time.

Run gold+empty **on your exact pinned wheelhouse and backend** before freezing any denominator (brief B15; 02b V1). Expect environment-dependent totals: 43/129 gold-pass in the broken public image, 52/129 plain notebook, 71 subprocess, 73–74 in the Nov audits, 127/129 in Kirchner's *calibrated* sandbox (solvability §2 timeline — always state the environment with any count).

### 1.8 Where outputs land

Every run writes incremental, crash-safe outputs to `--results-dir` (HR §9.2):

```text
results/run_01/
├── summary.json                     # aggregate resolution_rate, resolved count, per-repo, errors
├── task_results.jsonl               # append-only, one line per finished task (metrics & exit codes)
├── patches/<instance_id>.patch      # exact unified diff extracted from Container A
├── test_outputs/<instance_id>.log   # full Phase-2 pytest STDOUT/STDERR from Container B
├── traces/trace_<instance_id>.json  # SessionTrace: ATIF-compatible steps, thoughts, tool calls, tokens
└── logs/<instance_id>.log           # Rich-formatted Phase-1 agent transcript
```

Add your own `RUN_META.json` to each results dir (practice, not harness output): track, submission-tree sha256, config hashes, runtime pins (§1.1), backend, concurrency, CLI flags, mask version, server cold/warm, start/end wall time. Without it, runs are incomparable a week later.

---

## 2. Artifact-by-artifact interpretation

**Schema caveat up front:** HR §9.2 documents *what each artifact contains* but does not enumerate JSON field names. The field tables below list what the harness demonstrably computes (with the HR section that defines it); treat exact key names as *expected, verify on first run*. Every script in this guide uses defensive `.get()` access for that reason. Dump one real line before writing analysis code:

```bash
head -1 results/run_01/task_results.jsonl | python3 -m json.tool
python3 -m json.tool results/run_01/summary.json | head -40
```

### 2.1 `summary.json` — the run-level verdict

Documented contents: aggregate `resolution_rate`, resolved count, per-repo breakdown, errors (HR §9.2). Illustrative shape (ILLUSTRATIVE — keys will vary by build):

```json
{
  "resolution_rate": 0.4,
  "resolved": 12,
  "total": 30,
  "per_repo": {"fastapi": {"resolved": 5, "total": 12},
               "rich": {"resolved": 7, "total": 16},
               "requests": {"resolved": 0, "total": 2}},
  "errors": ["..."]
}
```

How to read it:

- **Never quote `resolution_rate` without its denominator and mask.** Raw 129 includes 5 empty-pass free points, 27+ dep-gap tasks, and 2 never-resolve tasks (§5.3). The same brain can "score" 0.35 raw and 0.55 masked; only the masked number discriminates configs (756400; brief B15).
- **Per-repo breakdown is your first clustering axis.** Repo personalities are real: fastapi is capability+introspection-heavy, rich is edge-case+contract-heavy, requests is protocol/encoding-heavy (taxonomy insight 2). A rich-only collapse suggests rendering/anchor issues; a fastapi-only collapse suggests either introspection-mechanism weakness *or* the dependency-gap ceiling — check collection errors before blaming the brain (§3 branch G).
- **`errors` is the run-health channel.** Run-level errors (server stalls, sandbox failures, compile errors) are different from task-level failures. A run where many tasks show near-zero tool calls and ~cap-length durations is the parser-freeze signature (§7; 753973: 3 consecutive tasks, 0 LLM calls, 480 s each).
- Cross-check `resolved` against `task_results.jsonl` (append-only, crash-safe): if the run died mid-way, summary may lag the JSONL. Recompute from JSONL when in doubt.

### 2.2 `task_results.jsonl` — the per-task record

One line per finished task, with metrics and exit codes (HR §9.2). Expected fields, grounded in the harness subsystems that produce them:

| Field (expected) | What it tells you | Defined by |
| --- | --- | --- |
| `instance_id` | Join key to taxonomy/index/tasks | HR §9.2 naming (`patches/<instance_id>`) |
| `resolved` | The binary verdict (§0 criterion) | HR §8.2 step 5 |
| `error` | Failure string when not resolved. Known values: `"Failed to apply agent patch: …"` (all 4 apply passes failed); timeout/budget errors; agent errors | HR §8.2 step 2; §5.3 |
| test `exit_code` | Phase-2 pytest return code (0 = all passed; nonzero = failed/collected-nothing/interrupted) | HR §8.2 steps 4–5 |
| patch size / `files_changed` | What `submit_patch` captured (`patch_size`, `files_changed`); 0 = empty patch | HR §6.1 submit_patch |
| `tool_calls_used`, turns | Budget consumption; compare against caps 50/50 (31B), 40/40 (E4B) | HR §6.1 get_status; §7.1 |
| duration / elapsed | Agent wall time (`agent_elapsed_seconds` analog); ≈ cap means timeout-bound | HR §6.1 get_status; §7.1 TIP (setup excluded) |
| token usage | Prompt/completion totals per task; feeds decode regression and cost math | HR §1 (TokenBudget), §9.2 traces |
| `agent_error` | Phase-1 exception (LLM/server/sandbox), distinct from test failure | HR §4 lifecycle note |

Reading patterns (all thresholds cited):

- **`resolved=false` + empty patch** → the task died before or during editing; go to §3 branch A. 44/44 context-overflowed sessions produced empty patches, 14 of them *after successful edits* (744692 REPORTED) — overflow destroys work that existed.
- **`resolved=false` + `error` starts "Failed to apply agent patch"** → §3 branch B; the patch exists but Container B could not apply it.
- **duration ≈ cap, calls well under 50** → time-bound (thinking/decode/long commands), not loop-bound. At an 8-min cap one study saw 75 timeouts / 57 empty patches (747696 REPORTED).
- **calls ≈ cap or turns ≈ cap** → loop-bound; look for identical-call streaks in the trace (the 51-call edit loop burned a 60-turn budget, 756051 PRIMARY).
- **`resolved=true` + tiny/empty patch** → suspect wheel shadowing or a non-discriminating task (§3 branch I), not a win.
- **exit_code 2 with collection errors in test_outputs** → environment, not brain (§3 branch G).

Aggregation one-liner (schema-robust):

```bash
python3 - <<'EOF'
import json, pathlib, collections
rows = [json.loads(l) for l in pathlib.Path("results/run_01/task_results.jsonl").read_text().splitlines() if l.strip()]
by = collections.Counter()
for r in rows:
    iid = r.get("instance_id","?")
    if r.get("resolved"): by["resolved"] += 1
    elif not (r.get("patch_size") or 0) and "apply" not in str(r.get("error","")).lower(): by["empty_or_no_patch"] += 1
    elif "apply" in str(r.get("error","")).lower(): by["apply_failed"] += 1
    else: by["tests_failed"] += 1
print(len(rows), "tasks:", dict(by))
EOF
```

### 2.3 `patches/<id>.patch` — what the agent actually did

The exact unified diff extracted from Container A via `git add -N . && git diff --binary _swegemma_baseline` (fallback `HEAD`) — identical commands for explicit `submit_patch()` and the automatic unsubmitted-patch recovery (HR §8.1). Reading anatomy:

- `diff --git a/<path> b/<path>` — one block per changed file. `--- a/…` / `+++ b/…` identify old/new paths; `@@ -l,s +l,s @@` hunks give line ranges; `+`/`-` lines are the edit; `GIT binary patch` blocks are binary diffs (new files added with `git add -N` appear as full-content diffs).
- **Locus check (the highest-value 30 seconds per failed task):** compare the patch's file list against `index.json` `patch_files` for that task (MEASURED: median 1 file, max 26; 38/129 multi-file). Wrong file = localization/targeting failure; right file wrong lines = edit-targeting failure (the E4B "Target line ≠ edit site" class, e4b §3.2); right lines wrong content = fix-authoring failure (e4b §3.1). These three map to *different* levers (§6).
- **Hygiene check:** any `test_*.py`, `*_test.py`, `tests/…`, `conftest.py`, `pytest.ini`, `pyproject.toml`, `tox.ini`, `setup.cfg`, `.pytest.ini`, `sitecustomize.py`, `usercustomize.py`, `_swegemma_stubs.py`, `*.pth` in the diff is **dead weight** — the anti-tampering reset discards it before testing (HR §8.2 step 3). Scratch files (`repro.py`, `scratch_*.py`, any untracked file under `/workspace`) are *included* by `git add -N .` and ride into verification (HR §10.3) — they should have lived in `/tmp`. BCF's `check` gate flags both (compliance F2/F8); if they appear anyway, the solver skipped `check`.
- **Empty-patch diagnosis** (0-byte or missing file): (1) no edit ever landed — localization/commitment failure (38% of default-prompt tasks never edit a source file, 749198 SECONDARY title-level); (2) context overflow killed the session before extraction (44/44, 744692); (3) three consecutive text-only turns terminated the session via nudges (HR §5.3); (4) budget exhausted before the first edit; (5) agent_error (server/sandbox). The trace distinguishes them (§2.5). Note the fallback: even without `submit_patch`, non-empty working-tree modifications are still captured and verified (HR §8.1) — so an empty patch means *nothing was ever written*, not merely "forgot to submit".
- **Patch size sanity:** median gold patch is +8 lines (index.json, MEASURED). A 2,000-line patch on a one-line task (taxonomy `edit_shape`) is an overwrite/runaway signature — E4B's measured whole-file-overwrite class (750974 SECONDARY). rich_3930's gold is +12.1k lines of generated width tables (taxonomy insight 6) — the exception that proves the rule: there, large is correct, and the brain should edit the loader/algorithm, not regenerate data.

### 2.4 `test_outputs/<id>.log` — Phase-2 pytest anatomy

Complete STDOUT/STDERR of the hermetic verification run in Container B (HR §9.2). The exact command (HR §8.2 step 4):

```bash
cd /workspace && PYTHONSAFEPATH=1 PYTHONNOUSERSITE=1 python3 -s -m pytest <pytest_targets> \
  --junitxml=/tmp/_swegemma_junit_<id>.xml \
  -p no:anyio -o timeout=0 \
  -o python_classes="Test* *Test" -q
```

Targets = every `.py` file referenced in `test_patch` (751707/757893 REPORTED) — including non-test helper/data files, which is itself a failure convention. `-o timeout=0` means **no per-test timeout**: a hanging test runs until the harness command timeout (`timeout_seconds`, which also bounds grading pytest — 745805 STAFF item 3; 748443).

Failure anatomy, in reading order:

| Log signature | Meaning | Class |
| --- | --- | --- |
| `ERROR collecting …` / `ModuleNotFoundError: No module named 'inline_snapshot'` (or `dirty_equals`, `typing_inspection`, `asttokens`, `executing`) | Collection error: test deps absent from the wheelhouse. Independent of your patch. 27+4 fastapi tasks (756587); typing_inspection broke 61/67 fastapi in the public image (747248 PRIMARY) | ENVIRONMENT (§3 G) |
| `ERROR at setup of …` / recursive `httpbin` fixture errors / `OSError: [Errno 101] Network is unreachable` | requests fixture/network failures: 12 httpbin-fixture tasks (757661), 8 connect-timeout tasks under docker-no-network (754586 PRIMARY) | ENVIRONMENT (§3 G) |
| `fixture 'anyio_backend' not found` | `-p no:anyio` killed anyio fixtures (79/1,143 audit cases; 757893). Public tasks mostly avoid it; private-repo proxies will hit it | SCORER CONVENTION (§3 G) |
| `FAILED tests/…::test_x - assert …` on a **new** test from `test_patch` | FAIL_TO_PASS still failing: the fix is wrong, incomplete, or at the wrong locus | BRAIN (§3 C) |
| `FAILED` on a **pre-existing** test that passed at baseline | PASS_TO_PASS regression: the fix broke existing behavior | BRAIN (§3 D) |
| `SKIPPED` on a required node; or `20 passed, 1 skipped` yet resolved=False | Skipped required test counts as failure; skipped-sibling prefix matcher can fail a *passed* test because its sibling skipped (rich_3486: `test_traceback_finely_grained` vs `…_missing`; solvability §1.1, 751707/755554) | SCORER (§3 H) |
| `Required test node did not pass: …` (verifier message) | JUnit validation rejected a required node (HR §8.2 step 5; 755554 quotes this exact line for fastapi_14186) | SCORER (§3 H) |
| `no tests ran` / exit code 5 | Targets collected nothing — non-collectable `.py` targets convention (65 audit cases, 757893) or wrong target paths | SCORER/ENV (§3 G) |
| Log ends mid-stream; JUnit XML missing/truncated | 10 MiB sandbox output cap truncated the report (8 python-multipart audit cases, 757893); or OOM kill (exit 137, HR §4.1) | SCORER/ENV (§3 J) |
| Log shows a hang then timeout at `timeout_seconds` | Hang task (rich_3480/4006/3772 class) or a test that waits on network; 3 no-patch tasks hang to the cap remotely (748443 REPORTED) | TASK (§3 E) |

**FAIL_TO_PASS vs PASS_TO_PASS semantics.** F2P = tests the `test_patch` adds/flips that must go fail→pass with your fix; P2P = tests that must stay passing. When the task ships no explicit lists (public tasks: fastapi_14186 has none, 755554 PRIMARY), the verifier derives required tests from `test_patch` functions. Either way, *every* required node must explicitly pass — skipped is not passed (HR §8.2). Whether verification also runs regression tests *outside* `test_patch` is staff-unanswered (750175); participant-derived evidence says no (solvability §3). Practical consequence: a P2P regression you see in the log came from the required set, and passing the required set is sufficient — but do not game this: the mutation audit shows weak required sets let broken fixes through (14.7% escape, 756400), and hidden tasks are staff-validated 100% with gold (744370 STAFF).

Standard pytest exit codes (general pytest knowledge): 0 = all passed; 1 = tests failed; 2 = interrupted/collection error; 3 = internal error; 4 = usage error; 5 = no tests collected. The resolution criterion needs 0 **plus** valid JUnit (HR §8.2).

### 2.5 `traces/trace_<id>.json` — the ATIF trajectory

Full `SessionTrace`, ATIF v1.7-compatible: steps, thoughts, tool calls, token usage (HR §1, §9.2). This is where *why* lives. What to look for, with the documented signatures:

| Pattern | How to spot it in the trace | Evidence / threshold |
| --- | --- | --- |
| **Edit loops** | Consecutive `edit_file` calls with byte-identical arguments; `FileEditError` responses repeating | 43% of edit_file calls failed in one study (107/246, 747923); 51-call identical loop, 38/51 byte-identical (756051 PRIMARY); E2B ~75% of failed edits are verbatim retries (756433 PRIMARY). BCF contract: zero 3rd identical calls (architecture C2-6) |
| **Nudge restarts** | User messages matching the three nudge texts (HR §5.3): unclosed `<\|tool_call\|>` tag; MAX_TOKENS/LENGTH thinking overrun; normal-stop "Please continue your work…". SequentialAgent restarts re-enter `sub_agents[0]` | Max 3 consecutive nudges then terminate (HR §5.3); blind restarts cost 60–90 s + calls (754636); BCF re-entry must be 1 call (31B) / ≤3 (E4B) with byte-identical spec, tax ≤15 s (architecture C2-3) |
| **Compaction events** | Summarizer LLM calls; prompt-token sawtooth crossing ~14,336; history replaced by a text summary | 9.2 summary calls/eval MEASURED (4,248/463, 753225); tool results dropped permanently, only text survives (754783 PRIMARY + Jack Yu raw_json); BCF target ~0 compactions on typical tasks (02a M7) |
| **Thinking overrun** | `finish_reason` = MAX_TOKENS/LENGTH; thinking tokens consuming the whole output allowance; truncated `<\|tool_call\|>` tags | A 4k ceiling spent entirely on reasoning with no action (755066); one task 90 s→316 s when thinking silently re-enabled (747914); up to ~3 min wasted per truncated call at 33 tok/s (02a E12 ESTIMATE) |
| **Context overflow** | Prompt + max_output approaching/exceeding the window; session dies; empty patch despite earlier edits | 44/44 overflowed sessions empty patch (744692); ~12% of sessions at threshold 14,336 (744692) |
| **Prefill spikes / restatement** | Steps with huge wall time but few completion tokens; assistant messages echoing file contents | 82 s for 251 output tokens; 1,788 tokens/104 s restatement; 8 of 43 steps hold 56% of budget (755291 PRIMARY, four 12B runs — hardware unstated, do not assume 4xL4) |
| **Truncation re-reads** | Repeated `read_file` on the same path without ranges; `is_truncated: true` responses | fastapi/params.py 754 lines read 6x never fully seen; 1,152 lines fetched twice across 4 runs (755291 PRIMARY) |
| **Budget pressure** | `budget_warning` fields ("Only X tool call(s) remaining…") in tool responses; `get_status` echoes | Appears when budget ≥20 and remaining ≤10 (HR §6). `get_status`/`submit_patch` are free — their presence never counts against the cap |
| **Edit-commit latency** | Call index and timestamp of first successful `edit_file`/`apply` | Gold file opened by call 2–3 in 84% of 163 runs, but first edit ~106 s solved vs ~183 s failed (752848 PRIMARY); BCF target first edit by call ~4–6 (architecture §8) |
| **Helper health (BCF)** | `run_command python3 .git/bcf/bcf.py …` invocations: install once, spec cached, anchors before every edit, strike after 2 failures, check before submit, state after restarts | Contracts: architecture §3; degradation tiers T0/T1/T2 (§9.1). Install attempts >2 or repeated `load_skill` = token waste + pathology (02b S2) |

A practical per-step timing/token decomposition (02a M5 method: regress step wall time on completion tokens, `dt = a + b·ct`; flag high-prompt-delta outliers as prefill spikes; any single step >60 s is a prompt bug per 755291):

```python
# Adaptive ATIF walker — key names vary; inspect one trace first.
import json
tr = json.load(open("results/run_01/traces/trace_rich_3064.json", encoding="utf-8"))
def walk(o):
    if isinstance(o, dict):
        yield o
        for v in o.values(): yield from walk(v)
    elif isinstance(o, list):
        for v in o: yield from walk(v)
steps = [d for d in walk(tr) if any(k in d for k in ("tool_calls","tool_name","function_call"))]
# Then: count tool names; diff consecutive edit_file argument strings;
# sum token-usage fields; locate the three nudge texts; find prompt-token drops.
```

### 2.6 `logs/<id>.log` — the Phase-1 transcript

Rich-formatted human-readable transcript of the agent session (HR §9.2). Read it in this order:

1. **The initial prompt** — confirm the 7 sections (HR §5.2): problem statement, hints (empty for all 129 public tasks, MEASURED index.json `hints_chars`), **Task Budget block (verify effective limits, §1.3)**, environment rules, standard instructions, code-intelligence section (only if graph data exists — 127/129 repos have it, zip_listing MEASURED), workspace layout.
2. **The plan stage** — install output (`installed:true` once), `problem.md` write, spec render (≤300 words, 7 sections, brace-free; empirical §7), spec echoed as final planner text (`{bcf_spec}` capture).
3. **The solver's first 6 calls** — localize/read/anchors/first edit. This is where the 106-vs-183 s commitment gap lives (752848).
4. **Every error response** — `FileEditError`, `CommandError`, `TimeoutExceeded` (HR §6 shapes); what the model did next (retry verbatim = breaker failure; strike+re-anchor = contract honored).
5. **The endgame** — `check` verdict, scratch cleanup, `submit_patch` last with `patch_size > 0`, final text. Or: the nudge that killed it, the budget_warning it ignored, the compaction summary it trusted over disk state.

The transcript is for *narrative*; the trace is for *measurement*. When they disagree (e.g. transcript shows an edit but the patch is empty), trust the patch + trace, and suspect overflow/extraction (HR §8.1; 744692).

---

## 3. Diagnostic decision tree: `resolved = False`

Work top-down; stop at the first branch that matches. Each branch names the exact artifact + field to check and the likely cause classes. (Branch letters are used by the clustering script in §4.)

```text
resolved = False
├─ 0. Was there a patch at all?  patches/<id>.patch size; task_results error/patch_size
│   ├─ EMPTY / missing ──────────────► A. no patch produced
│   └─ non-empty
│       ├─ error = "Failed to apply agent patch…" ──► B. apply failure
│       └─ applied → read test_outputs/<id>.log
│           ├─ collection/setup errors, no tests ran ──► G. environment / conventions
│           ├─ required node SKIPPED / "did not pass" with 0 failures ──► H. skipped-sibling / required-skip
│           ├─ JUnit missing/truncated, exit 137 ──► J. report / resource failure
│           ├─ new (F2P) tests FAILED ──► C. fix wrong / incomplete / wrong locus
│           ├─ pre-existing (P2P) tests FAILED ──► D. regression
│           └─ log ends at timeout_seconds ──► E2. grading-side hang
├─ duration ≈ agent cap OR error = timeout ──► E1. agent-side timeout
├─ tool_calls_used ≈ cap OR turns ≈ cap ──► F. budget exhausted (loop?)
└─ resolved = True but patch empty/trivial ──► I. empty-pass artifact (audit your denominator!)
```

| Branch | Check (artifact · field) | Likely cause classes | Evidence |
| --- | --- | --- | --- |
| **A. No patch produced** | `patches/<id>.patch` = 0 bytes; trace: last steps, `finish_reason`, prompt-token peak, nudge count; `task_results.agent_error` | (A1) never edited — localization/commitment failure (38% never-edit class); (A2) context overflow (44/44 empty, 14 after successful edits); (A3) 3 consecutive text-only turns → nudge termination; (A4) budget died before first edit; (A5) agent_error: LLM/server/sandbox crash, parser freeze (0 LLM calls + cap-length stall) | 749198; 744692; HR §5.3; 747696 (57 empty at 8-min cap); 753973 |
| **B. Patch failed to apply** | `task_results.error` = "Failed to apply agent patch: …"; `test_outputs/<id>.log` head (git apply/patch stderr); patch headers vs snapshot paths | All 4 passes failed (HR §8.2): context drift (patch built against modified baseline), CRLF/whitespace beyond pass-1 tolerance, symlinked prefixes (pass 2 exists for this), binary blocks, path-prefix mismatch (pass 3 `-p0`). Rare with clean BCF patches; suspect scratch-generated or hand-edited diffs | HR §8.2 step 2 |
| **C. F2P still failing** | `test_outputs/<id>.log`: `FAILED` on test_patch-added tests; compare patch locus vs `index.json patch_files` and gold hunk lines | (C1) wrong file (E4B 13/31 wrong-file class); (C2) right file, wrong lines (Target=def-line misread; anchors on signature not edit site); (C3) right lines, wrong content — confidently-wrong-but-compiling fix (directs→direct probe passes apply+check); (C4) incomplete multi-file fix (edited 1 of 3 required files) | 750974; e4b §3.1–3.2; empirical §8; 751596 funnel (18/41 within 20 lines of gold) |
| **D. P2P regression** | `test_outputs/<id>.log`: `FAILED` on pre-existing tests; diff scope vs task `edit_shape` | Over-broad edit; broke an adjacent contract; the opposite-fix trap (requests_6644 adds `//` collapse, requests_7315 deletes it — base behavior is not sacred, test_patch is the live spec); aliasing/shared-state side effects | taxonomy insight 4; HR §8.2 |
| **E1. Agent-side timeout** | `task_results` duration ≈ `max_time_minutes`; trace: where the seconds went (decode vs commands vs restarts); `get_status` echoes | Thinking overrun (90→316 s); MAX_TOKENS truncation + nudge round trips; blind SequentialAgent restarts (60–90 s each); read-before-edit tax (~10 of 28 calls); hang-bug repro without timeout wrapper; full-suite pytest | 747914; 747696; 754636; 752848; architecture §3.3f |
| **E2. Grading-side hang** | `test_outputs/<id>.log` ends at `timeout_seconds`; Phase-2 wall ≈ cap; patch may be empty | Hang tasks run to the cap in verification too (3 no-patch tasks, 748443); `-o timeout=0` = no per-test timeout; network-waiting tests under air-gap | 748443; 745805 item 3; HR §8.2 |
| **F. Budget exhausted** | `tool_calls_used` ≈ 50/40 or turns ≈ 50/40; trace: identical-call streaks; `budget_warning` present then ignored | Edit-retry loop (51 identical calls); exploration over-read; repair cycles >2; nudge restarts eating shared turns (worst case ~40 turns for 31B, 35–40 E4B — the E4B turns backstop binds by design) | 756051; 747923; compliance O1; architecture §8 |
| **G. Collection error / conventions** | `test_outputs/<id>.log`: `ModuleNotFoundError` (inline_snapshot/dirty_equals/typing_inspection/asttokens/executing), httpbin fixture errors, Errno 101, `anyio_backend` not found, `no tests ran` (exit 5) | **Environment, not brain.** 27+4 fastapi dep-gap ids; 12 requests httpbin; 8 requests no-network; `-p no:anyio` (79 cases); pytest.ini overwrite (101); non-collectable targets (65). Mask these ids; never tune the brain against them | 756587; 757661; 754586; 757893; brief §4a |
| **H. Skipped-sibling / required-skip** | `test_outputs/<id>.log`: `N passed, 1 skipped` with resolved=False; verifier "Required test node did not pass"; check required-node decorators (`skipif`, `needs_pydanticv1/v2`) | rich_3486 + fastapi_14186 can NEVER resolve (structural); platform-skipped required tests (24 audit cases); prefix-matcher counts a skipped sibling against a passed test. **Mask, do not tune** | solvability §1.1; 755554; 751707; 757893 |
| **I. Empty-pass artifact** | resolved=True with empty/trivial patch; `--skip-agent-patch` rerun also resolves | Wheel shadowing (installed release imports instead of patched snapshot: requests_7309/7315/7427); genuinely non-discriminating task (rich_3468). Fix wheels, re-audit, drop from denominator | 747248 PRIMARY; 752672; solvability §2 |
| **J. JUnit / resource failure** | JUnit XML missing or truncated; exit 137; log cut mid-stream | 10 MiB output cap truncation (8 cases); container OOM (4 GiB limit); passed_tests==0 with exit 0 (validation rejects) | 757893; HR §4.1, §8.2 |
| **K. resolved=True, suspicious** | Patch semantics vs statement; mutation-style probe | 14.7% of planted broken fixes escape (inverted booleans 53% pre-review, off-by-one 33%; removed-raise always caught). Treat resolve rate as upper bound; spot-check wins on sentinel tasks | 756400; brief B20 |

**Worked micro-example (HYPOTHETICAL).** `rich_3063` resolved=False. Patch exists, 1 file, `rich/markup.py` — matches index.json gold file. `test_outputs/rich_3063.log`: `FAILED tests/test_markup.py::test_escape_backslash_parity - assert '\\\\' == '\\'` — a new test from test_patch → branch C. Trace shows anchors returned the `escape()` def line, the edit changed the return statement one line below the true locus → C2 (edit targeting), not C1/C3. Lever candidates: E1 family-line priors + E2 candidate-edit-lines (§6). One task is an anecdote; cluster before acting (§4).

---

## 4. Failure clustering & analysis

### 4.1 Join keys and cluster axes

Every `instance_id` joins three local tables (all MEASURED, schemas verified this pass):

- `taxonomy.json` → `assignments[]`: `kind` (9 values), `subcategory` (40, repo-scoped), `root_cause_family` (10), `difficulty` (d1–d5), `edit_shape` (one-line/few-lines/multi-file/large/new-files), `is_bug`.
- `index.json` → per task: `patch_files` (paths + added/removed), `patch_added/removed`, `test_files`, `new_test_funcs` (median 1, max 84, 22 tasks with zero), `ps_chars`, `hints_chars` (0 for all 129).
- `tasks.jsonl` → `problem_statement`, `patch` (gold), `test_patch`.

Cluster on **repo x family x difficulty x edit_shape**, and separately on the **diagnostic branch** from §3 (the branch is the failure *mechanism*; the taxonomy is the task *population*). A cluster is actionable when it has ≥3 tasks with the same branch signature (ESTIMATE threshold — below that, read individual traces; single-task anomalies are noise, §5).

Corpus base rates to compare against (taxonomy §5, MEASURED): difficulty d1 27 / d2 59 / d3 27 / d4 9 / d5 7; shapes one-line 27 / few-lines 70 / multi-file 23 / large 7 / new-files 2; 75% of tasks are one-line/few-lines (insight 1). Repo x family: fastapi = missing-capability 23 + type-introspection 11; rich = boundary-edge-case 15 + api-contract-violation 12; requests = boundary 4 + introspection 3 + contract 3 (insight 2). If your failure clusters *disproportionately* hit d5/large/multi-file, that is partly the corpus being hard — 35/38 multi-file golds were never solved by anyone (753524 REPORTED) — not necessarily a regression.

### 4.2 Per-cluster metrics table (compute for every cluster)

| Metric | Source | Why it matters |
| --- | --- | --- |
| n tasks, n resolved, masked rate | task_results + mask | The headline; always masked (§5.3) |
| Branch distribution (A–K counts) | §3 triage | Separates brain vs environment vs scorer |
| Empty-patch rate | patches/ sizes | Commitment/overflow health (A-class) |
| Apply-fail rate | task_results.error | Patch hygiene (B-class) |
| F2P-fail vs P2P-regress split | test_outputs | Authoring vs over-breadth (C vs D) |
| Timeout rate; median/p95 duration vs cap | task_results + traces | Budget discipline (E/F) |
| Median tool_calls, turns; % hitting caps | task_results | Loop pathology |
| edit_file failure rate; max identical-call streak | traces | Edit reliability (target: 0 third identical calls) |
| First-edit call index / seconds | traces | Commitment latency (field: 106 s solved / 183 s failed, 752848) |
| Compaction count; overflow count | traces | Context discipline (BCF target ~0 typical) |
| Nudge/restart count; re-entry tax seconds | traces | Restart health (≤15 s, C2-3) |
| Median tokens (prompt/completion) | traces | Token economy; decode cost driver |
| Wrong-file / right-file-wrong-lines / wrong-content split | patch locus vs index.json | Targets E1/E2 vs E3 vs model ceiling |

### 4.3 Clustering script (schema-robust starting point)

```python
#!/usr/bin/env python3
"""Cluster a results dir by taxonomy axes + diagnostic branch. Adapt field names
to your build (dump one task_results line first). Mask file: one id per line."""
import json, pathlib, collections, statistics as st

RESULTS = pathlib.Path("results/run_01")
TAX = {a["instance_id"]: a for a in json.load(open("scratch/bcf-2026-11-11/taxonomy.json", encoding="utf-8"))["assignments"]}
IDX = {t["instance_id"]: t for t in json.load(open("scratch/bcf-2026-11-11/index.json", encoding="utf-8"))}
MASK = set(pathlib.Path("masks/excluded.txt").read_text().split())  # your frozen mask

def branch(r, patch_bytes, logout):
    err = str(r.get("error", "")).lower()
    if r.get("resolved"): return "I" if patch_bytes == 0 else "OK"
    if patch_bytes == 0: return "A"
    if "apply" in err: return "B"
    if "modulenotfounderror" in logout or "error collecting" in logout or "no tests ran" in logout: return "G"
    if "skipped" in logout and "failed" not in logout: return "H"
    if "timeout" in err: return "E"
    # C vs D needs F2P/P2P node lists; default C, refine with test_patch parsing:
    return "C"

rows = []
for line in (RESULTS / "task_results.jsonl").read_text().splitlines():
    if not line.strip(): continue
    r = json.loads(line); iid = r.get("instance_id", "?")
    p = RESULTS / "patches" / f"{iid}.patch"
    t = RESULTS / "test_outputs" / f"{iid}.log"
    pb = p.stat().st_size if p.exists() else 0
    lo = t.read_text(errors="replace").lower() if t.exists() else ""
    a = TAX.get(iid, {})
    rows.append(dict(iid=iid, repo=a.get("repo", "?"), fam=a.get("root_cause_family", "?"),
                     diff=a.get("difficulty", "?"), shape=a.get("edit_shape", "?"),
                     masked=iid in MASK, resolved=bool(r.get("resolved")),
                     branch=branch(r, pb, lo), calls=r.get("tool_calls_used"),
                     dur=r.get("duration_seconds") or r.get("agent_elapsed_seconds")))

for axis in ("repo", "fam", "diff", "shape", "branch"):
    print(f"\n== by {axis} ==")
    groups = collections.defaultdict(list)
    for r in rows: groups[r[axis]].append(r)
    for k, g in sorted(groups.items()):
        gm = [r for r in g if not r["masked"]]
        res = sum(r["resolved"] for r in gm)
        durs = [r["dur"] for r in g if isinstance(r["dur"], (int, float))]
        print(f"{k:28s} n={len(g):3d} masked_out={len(g)-len(gm):3d} "
              f"resolved={res:3d}/{len(gm):3d} "
              f"med_dur={st.median(durs) if durs else float('nan'):7.1f}")
```

### 4.4 Worked cluster examples (patterns from the evidence base; numbers cited, scenarios HYPOTHETICAL where invented)

**(a) `FileEditError` loop cluster on rich → anchor/strike levers.**
*Signature:* branch C/F; traces show ≥2 identical failed `edit_file` calls; `old_string` non-unique or stale; tasks concentrate in rich boundary-edge-case/api-contract families. *Why rich:* its tasks are contract/edge-heavy with many similar-looking code windows (taxonomy insight 2); 17/477 anchors (3.6%) are ambiguous even for the helper (empirical §8). *Field base rate:* 43% edit failure in one 31B study (747923); 60/234 edit + 20/255 write rejected vs 0/1,135 run_command (747519). *Levers:* E1 (`_family_lines` priors for the 5 unpatterned families — 70/129 tasks currently get def-line fallbacks), E2 (surface candidate edit lines in spec Target), E4 (window-granular strike exclusion, O9), E8 (9-line window arm for the 3.6% ambiguous); prompt P4/P5 stay (copy-verbatim, 2-strike). *Validation:* C1 uniqueness ≥90% + hit@k no regression (CPU, ~1 h), C2-6 stale-anchor drill, then L2 paired subset (§6). Do **not** respond with more prompt exhortations — 11 prompt/config interventions resolved zero tasks on 2B-class editing (756433).

**(b) Timeout cluster on d5/large → budget/thinking/token levers.**
*Signature:* branch E1; duration ≈ cap; tasks = the 7 d5 (6 large + 1 new-files, taxonomy §5.5): fastapi_14099/14262/14609/15030/15745/15800, rich_3930. *Mechanics:* whole-file reads of generated tables (rich_3930 +12.1k lines, taxonomy insight 6), thinking overrun, restart tax. *Levers:* Y4 cap decision rule (never raise 31B to 5.0 without measured setup ≤35 s AND extrapolated ≤11.0 h — N=129 at 4.5 min is already 11.99 h marginal, compliance O7), Y1 planner-only thinking 0/256 (removes 10–30 s/restart tax, O2), P3/P9 read limits + paraphrase (keep), large-data mode (edit loader/algorithm, never regenerate tables, architecture §9 row 16). *Validation:* C2 telemetry (setup ≤60 s median; per-task wall), budget-telemetry pair runs, C6 extrapolation. *Expectation management:* these tasks are mostly unwinnable (35/38 multi-file never solved, 753524) — the goal is **bounded time**, not solves. A d5 task that times out at the cap having produced a clean partial patch is behaving as designed; a d5 task that burns 3 restarts and overflows is not.

**(c) Localization-miss cluster → cue weights, but check intrinsics first.**
*Signature:* branch A (never edited) or C1 (wrong file); patch locus ∉ index.json patch_files. *Funnel to replicate* (751596 SECONDARY, 41 failed runs): wrong fix within 20 lines of gold 18; opened gold but never edited 11; edited only other files 7; edited gold far from change 3; never found gold 2. *Levers:* E5 (locate new-word weight 1.6→~2.2 or stale-cue decay — UNMEASURED, speculative), E9/E10/E24 ranking/vocab/subsystem — **OOD-gated only**; public hit@k is already 96.9% and extraction-biased (empirical §2/§5). The 4 public misses are intrinsic (fastapi_15661 new-file; rich_3105 reference-only; rich_3278/4076 zero lexical overlap) — no ranking fix closes them without forbidden URL fetches or overfitting hacks (empirical §5). *Validation:* V7 locbench (GPU-free, exact McNemar + Wilson CIs, 756315) + V3 OOD proxies before any promotion. If the cluster is "opened gold, never edited" (the 11/41 class), it is a *commitment* problem, not localization: soft gates P2 (weak evidence), structural budget reserve (architecture §8), never a hard "edit by call N" rule (~40% wrong-place edits, 747980 hypothesis).

**(d) Collection-error cluster → environment, not brain.**
*Signature:* branch G; `ModuleNotFoundError: inline_snapshot/dirty_equals` across fastapi; httpbin fixture errors across requests. *Action:* verify ids against the 27-list + 4 candidates (brief §4a), add to mask, re-audit gold/empty; optionally build the *calibrated* sandbox variant (add missing wheels: inline_snapshot, dirty_equals, typing_inspection, annotated_doc, pytest-httpbin + closure asttokens/executing — solvability §2/§3) for discrimination runs. **Zero brain changes.** The 24% convention-failure audit (757893) is the general form: correct fixes die on `-p no:anyio`, pytest.ini overwrite, non-collectable targets, skipped siblings, JUnit cap. Doctrine response (architecture §9 row 22): fixes target library code only; own repros never rely on anyio fixtures or repo pytest.ini; keep JUnit small.

**(e) Confidently-wrong-but-compiling cluster (E4B) → semantic signal, then measure the ceiling.**
*Signature:* branch C3; patch applies, `check` PASS, F2P fails; replacement text is plausible but semantically wrong (the directs→direct trailing-s probe passes apply+check, e4b §3.1; 753277 copy-bug class). *Levers:* E3 informational semantic smoke after apply (repro_seed exists for only 18/129 tasks — coverage-limited, never blocking), Y14 E4B thinking-2048 arm (contested; C5 must observe effective thinking first). *Hard truth:* fix authoring is the dominant unmitigated gap and deterministic synthesis for arbitrary private repos is infeasible (e4b §4/§7.1). If L2/C6 shows 0 replicated E4B solves after targeting fixes, ship 31B-only finals (e4b §8 gate).

**(f) P2P-regression cluster on requests url-path → tests-as-spec doctrine.**
*Signature:* branch D concentrated in requests_6644/7315-style tasks. *Cause:* the brain treats base behavior as sacred; the corpus explicitly punishes this (6644 adds the `//` collapse that 7315 deletes, taxonomy insight 4). *Action:* no engine lever — reinforce tests-as-spec in verification discipline (run the new acceptance tests; never edit tests), and keep the pair as regression sentinels in the subset.

---

## 5. Local ↔ Kaggle correlation: what transfers, what lies, and how to calibrate

### 5.1 What transfers vs what does not

| Transfers (mechanism-level) | Does NOT transfer (score-level) |
| --- | --- |
| Protocol correctness: nudges, restarts, compaction survival, submit discipline — identical protocol by design (HR §4–§8; 02a §1) | Public dependency gaps: 27+4 fastapi collection failures, 12 requests httpbin, typing_inspection — local ceilings are environment artifacts (756587/757661/747248) |
| Localization quality (hit@k, wrong-file rate) — but public hit@k is an extraction-biased upper bound (empirical §2) | Scorer conventions: 24% of correct fixes fail on anyio/pytest.ini/targets/skipped-sibling/JUnit-cap (757893); rich_3486/fastapi_14186 never resolve anywhere |
| Edit reliability (failure rate, identical-call streaks, anchor uniqueness) | Noise + best-of-N inflation: public LB retains each team's BEST score (brief §5, CSV-verified); published bundle scores rerun 1–4 tasks lower (757588) |
| Budget discipline (time/calls/turns distributions, first-edit latency, token economy) | Private-repo distribution shift: hidden tasks come from PRIVATE repos, none of the training repos (747248 STAFF); cue-rich public statements (avg 3.4 cues, 98/129 with anchors, taxonomy insight 7) overstate localization ease |
| Relative A/B ordering on a FROZEN MASKED set with paired repeats (the only score-like signal that transfers, and only probabilistically) | Hardware timing: 5090 decode ~1.5–2.3x faster ESTIMATE, prefill possibly slower (02a E1–E3); local wall-clock caps must be re-derived for 4xL4 (M12) before shipping |
| Run-health signatures (parser freeze, overflow, OOM) — same stack, same bugs (753973 unfixed Nov 8–9) | Context-window behavior: local KV ceiling ~10–24k vs scorer 32,768 (02a E5) — long-context A/Bs are non-predictive |

### 5.2 The documented anti-correlation cases (learn these numbers)

| Case | Numbers | Source |
| --- | --- | --- |
| Local tie → hidden divergence | Two configs tied **28/74 locally** scored **0.17 vs 0.10 hidden**; a **9–0 local win** scored LOWER hidden; "our local screen never ranked our hidden scores"; single tweaks move ~1 task | 751973 SECONDARY (solvability §4.2) |
| Public-strong → hidden timeout | A **50%-public** agent **timed out on the hidden set at 15 min/task**; with a 5-min cap + thinking off it scored **0.05 public** | 756400 REPORTED (brief C9) |
| Unchanged bundle rerun | Public **0.24 → 0.17** (14→10 of 58 tasks, 4-task gap); another 0.20 bundle reran **.18/.17/.17/.17/.13** | 757588 / 756438 REPORTED (brief C11) |
| Byte-identical ZIP, infra regime | Same sha256 ZIP: **0.18 → 0.01** (~10 tasks vanished; attributed unconfirmed to the array-parser server freeze) | 750521 PRIMARY (fan yunsheng; refs 57707644/57824740) |
| Identical files, sampling regime | Identical agent files score **0.12–0.22** public; identical files **7–13 of 58** | 750974 / 751596 SECONDARY |
| Local repeats are noisy too | 3 local runs of a closely related version: **50/50/47 of 121** (SD ≈ 2); 19/123 (**15%**) tasks flipped between two identical Gemma passes; local reruns flip resolved=True→False | 750521 PRIMARY; 747168 PRIMARY; 757588 (Kipruto) |

**Reading:** there are TWO noise regimes (synthesis contradiction 29). Sampling noise ≈ ±2 tasks per 58-task draw (±0.035); infra failures can zero 10+ tasks in one run. A 0.18→0.01 drop is not bad luck — it is a run-health incident. And local screens mis-rank hidden scores *even without noise*, because the populations differ (private repos, no dep gaps, different cue richness).

### 5.3 Score quantization and denominators (CSV-verified)

Public score = **floor(k/58 × 100)/100** — truncated, not rounded (753524; solvability §4.1; re-verified this pass against LB CSV: 5,439 rows, 16 distinct scores, every value equals floor(k/58) for integer k). **1 task = 0.01724 → displays 0.017.**

| k solved | Display | k solved | Display | k solved | Display |
| --- | --- | --- | --- | --- | --- |
| 0 | 0.00 | 6 | 0.10 | 12 | 0.20 |
| 1 | 0.01 | 7 | 0.12 | 13 | 0.22 |
| 2 | 0.03 | 8 | 0.13 | 14 | 0.24 |
| 3 | 0.05 | 9 | 0.15 | 17 | 0.29 |
| 4 | 0.06 | 10 | 0.17 | 58 | 1.00 |
| 5 | 0.08 | 11 | 0.18 | — | — |

Structural holes (no integer k produces them): 0.02, 0.04, 0.07, 0.09, 0.11, 0.14, 0.16, 0.19, 0.21, 0.23, 0.25–0.28 (solvability §4.1 lists the observed holes; the full set follows from the floor map). Nov 11 CSV buckets (MEASURED this pass): 0.29: 1 team (Yurnero), 0.24: 12, 0.22: 81, 0.20: 445, 0.18: 949, 0.17: 992, 0.15: 801; median 0.15; 5,439 teams. The whole 0.15–0.24 band is one statistical cluster (crossexam via solvability §4.4).

**Denominator discipline — never average these sets** (synthesis contradiction 10):

| Set | n | What it is |
| --- | --- | --- |
| Public practice/training tasks | 129 | Local eval corpus; NOT scored on Kaggle; repos absent from the test set (747248 STAFF) |
| Public LB split | 58 | Hidden tasks from OTHER repos; every LB score = floor(k/58) (CSV-verified) |
| Total hidden eval | ~120 | Public + private run in the SAME 12 h (743063 STAFF); 58x2=116≈120 |
| Private split | ~60 | ESTIMATE (754295); finals decided here; better-of-two selected submissions (752220 HOST) |
| Strictly valid discrimination set | 68 | Gold passes AND empty fails in 756400's audit (fastapi 29, rich 39, requests 0, httpx 0) |
| Calibrated-sandbox gold ceiling | 127/129 | Kirchner's rebuilt scorer-like sandbox (751487 SECONDARY); the 2 holdouts = rich_3486 + fastapi_14186 |

The "11 unsolvable → 0.91 LB ceiling" extrapolation is **LOW confidence** and must not be used: the 11-task mask applies to the practice set, not the 58 hidden LB tasks, and staff verified hidden tasks 100% gold-valid (solvability §1.3/§7; 744370/747248 STAFF).

### 5.4 Calibration protocol (run once per environment change, then freeze)

**Step 1 — Pin.** §1.1 stack pins; record in RUN_META. Verify the gemma4 parser sha and the reasoning-field survival check (brief B22; 744354: public v31 still drops `reasoning_content` — scorer state unknown; your agent must be retention-agnostic either way, C4).

**Step 2 — Build both sandbox variants.**
- *Scorer-faithful:* `Dockerfile.sandbox` as published, wheels as shipped. Reproduces the dep-gap ceilings; use for parity sanity checks.
- *Calibrated:* same image + missing test deps (inline_snapshot, dirty_equals, typing_inspection, annotated_doc, pytest-httpbin, closure asttokens/executing; period-correct Pygments for 7 rich tasks per 751487) + **wheel-shadowing fix**: remove the repo-under-test wheels (fastapi/requests/httpx/rich releases ship in `wheels/`) or put `/workspace` ahead of site-packages on sys.path (solvability §2/§8; 752672; 747248: site-packages precedes the `.pth` workspace entry, so src-layout requests/httpx import the bundled release). Use for discrimination A/B — it is closer to the hidden environment, which staff says is gold-clean.
- Verify the fix: `requests_7309/7315/7427` must now FAIL empty; `rich_3468` still passes empty → permanent mask.

**Step 3 — Gold+empty audit on YOUR sandbox.** Empty via `--skip-agent-patch` (§1.7); gold via the verify_task driver. Produce `gold_audit.jsonl` + `empty_audit.jsonl`. Reconcile: the 27 dep-gap ids + 4 candidates (fastapi_14266/14609/15030/15745); the requests httpbin set (12 per 757661 vs 8 per 754586 — your backend decides); rich_3472 (Python-version conditional); the 5 empty-passers (name the 2 fastapi ones). Cross-check gold totals against the environment timeline (solvability §2): expect ~73–74 gold-pass faithful, ~127 calibrated; investigate deviations before freezing.

**Step 4 — Freeze the masked denominator.** Write `masks/excluded.txt` with reasons:

| Exclusion | ids | Reason |
| --- | --- | --- |
| Structural never-resolve | rich_3486, fastapi_14186 | Skipped required siblings; no patch can resolve (755554/757893) |
| Dependency-gap (fastapi) | the 27-list (brief §4a) + reconciled candidates | Collection fails regardless of patch (756587) |
| requests httpbin/network | per your audit (12 or 8 ids) | Fixture/network failures (757661/754586); backend-conditional |
| Empty-pass | rich_3468 + any task passing empty after the wheel fix | Free points; zero discrimination (747248/756400) |
| Python-version conditional | rich_3472 (only if sandbox py3.13) | AttributeError format differs 3.12 vs 3.13 (754586) |

Expected result ≈ the 68-valid set (756400), composition rich-heavy. Version the mask file; a mask change invalidates cross-run comparisons.

**Step 5 — Paired repeats, win-both.** For any config change: run BOTH configs on the SAME frozen subset, ≥2 repeats each, seed 7 fixed (transmits on wheelhouse v28+, synthesis S11), same backend/concurrency/server state. A change is promoted only if it **wins on both repeats** (750907 two-team protocol; 02b V2). Record per-task flips, not just totals. Keep ~30 tasks for iteration and the rest held-out for C6 (750907 protocol; architecture C6).

**Step 6 — Statistics.** Wilson 95% CI for a rate; exact McNemar for paired discordance; noise floor from the measured sigma:

```python
import math
from math import comb
def wilson(k, n, z=1.96):
    if n == 0: return (0.0, 1.0)
    p = k / n; d = 1 + z*z/n
    c = (p + z*z/(2*n)) / d
    h = z * math.sqrt(p*(1-p)/n + z*z/(4*n*n)) / d
    return (max(0.0, c-h), min(1.0, c+h))
def mcnemar_exact(b, c):
    """b = A-only wins, c = B-only wins across paired tasks (pool repeats carefully:
    use per-task majority or analyze repeats separately). Two-sided exact p."""
    n = b + c
    if n == 0: return 1.0
    k = min(b, c)
    p = sum(comb(n, i) for i in range(k+1)) / 2**n
    return min(1.0, 2*p)
```

Noise rules (all cited): sigma ≈ 2 tasks per 58-task draw (753524: ~1.0 per 7-task rep); per-task flip rate 10–13% (750907) to 15% (747168); ~67% of well-sampled task x config cells are flippy, ~23% never-solve, ~10% always-solve (753524). Therefore: **single-run deltas <4 tasks are noise — never promote on them** (brief B16; 02a §6); deltas ≤2 tasks (~0.035 on the 58 scale) are within 1σ (synthesis S19 says <0.03 treat as noise). On a 30-task subset, binomial scaling gives sigma ≈ 2·sqrt(30/58) ≈ 1.4 tasks (ESTIMATE) — a 2-task subset win is ~1.4σ, suggestive but not decisive; win-both + McNemar is the arbiter. A 133-vs-77-run experiment reached only p=0.22 for a +9-point claim (753524) — respect how much data real significance needs.

**Step 7 — Time calibration before shipping caps.** Local seconds-per-task do not transfer: convert via seconds-per-million-model-tokens (prompt+completion, sequential runs only) on both stacks (02a M12; the 747857 method). Re-derive the §8 budget envelope with 4xL4 rates (33–35 tok/s decode MEASURED; 12.6 min startup; ~0.5 min/task setup+verify) before applying the Y4 cap decision rule. A +5% local step cost blew a 12 h Kaggle run (752017 REPORTED) — keep ≥1–2 h headroom.

### 5.5 Correlation-tracking table (template + hypothetical rows)

Keep one row per scored submission and per gate-level local run. The point is to *learn your own local→public mapping* instead of assuming it.

| Date | Config (tree sha / lever ids) | Local subset (masked, n=30, r1/r2) | Local full masked (n≈68) | Public score (implied k/58) | Δ public vs prev | Local→public read | Run-health flags |
| --- | --- | --- | --- | --- | --- | --- | --- |
| HYPOTHETICAL 2026-11-14 | 31b base `b6ac6a07` | 12/30, 13/30 | 27/68 | 0.17 (10) | — | subset 0.40–0.43 vs public 0.17: gap consistent with private-repo shift + noise; no conclusion from one row | clean |
| HYPOTHETICAL 2026-11-16 | 31b +E1+E2 | 15/30, 15/30 | 30/68 | 0.18 (11) | +1 task | local +3 masked, public +1: direction agrees, magnitude within noise; keep lever (won both repeats), do not claim +3 public | clean |
| HYPOTHETICAL 2026-11-18 | 31b +Y2 temp0 | 14/30, 15/30 | — | 0.10 (6) | −5 tasks | local ~flat, public −5: suspect infra regime (check entry count/durations if logs ever exposed) or noise; do NOT revert on one run; rerun before deciding | possible freeze |

Interpretation rules: (1) compare masked-local to public only as *direction over ≥3 submissions*, never as a calibrated predictor; (2) a public drop ≥5 tasks with flat local = infra/noise suspect, not a config verdict (two-regime rule, §5.2); (3) mechanism metrics (edit-fail rate, first-edit latency, empty-patch rate, compaction count) are the leading indicators that transfer even when scores don't — track them in the same ledger; (4) public LB is best-of-N: your single public run is a *sample*, your local paired repeats are the *experiment* (757588; brief §5 strategic read).

### 5.6 Why local screens mis-rank hidden scores (summary)

1. **Population shift:** hidden = private repos, no training repos (STAFF 747248); public cues (file/grep anchors in 98/129 statements) overstate localization ease; sparse/URL-only tasks behave differently offline (brief B18).
2. **Environment shift:** public dep gaps and convention failures mask real capability locally; the hidden env is gold-clean (STAFF 744370) so tasks that are locally impossible may be hidden-solvable, and vice versa your local free points don't exist there.
3. **Noise:** ±2 tasks/58 sampling + 10–15% flips + best-of-N display; a local tie can hide a real hidden gap (28/74 → 0.17 vs 0.10, 751973).
4. **Budget coupling:** hidden tasks run slower than public in at least one report (+5% step cost blew 12 h; 756400's 15-min hidden timeouts) — a config tuned to local speed can die remotely on time, which scores as zero, not as "slightly worse".
5. **Metric mismatch:** local raw-129 rate mixes free points and dead tasks; only the frozen masked paired protocol (§5.4) produces a rankable signal, and even that is probabilistic.

---

## 6. Results → action plan

### 6.1 Failure class → lever → change → validation map

Lever ids/locations are from 02b (file · field/function). **Every engine edit re-mirrors both tracks byte-identical and re-runs validator + C1 (N2; compliance F9).** Validation ladder used below: **L0** = C0 static/compile (CPU, minutes); **L1** = C1 corpus battery + targeted CPU probes (~1 h); **L2** = paired GPU subset, ≥2 repeats, win-both, masked (§5.4 steps 5–6); **L3** = C6 full masked set + OOD proxy + wall-clock extrapolation (gate for slots).

| Failure class (branch) | Lever location (02b) | Change | Validation loop |
| --- | --- | --- | --- |
| Edit targeting: anchors on def lines, wrong-line edits (C2) | E1 `bcf.py _family_lines()`; E2 `render_spec()` Target | Generic line priors for the 5 unpatterned families (70/129 tasks); surface "candidate edit lines: N, M" (≤300 words, brace-free) | L1 uniqueness ≥90% + hit@k no regression + join_words smoke → L2 → L3 |
| Edit mechanics: stale/overlapping windows, strike re-emits (C/F) | E4 `gen_anchors()` strike exclusion; E8 `MAX_WINDOW` | Window-granular strike exclusion (O9); optional 9-line window arm (3.6% ambiguous) | L1 anchors battery → C2-6 stale-anchor drill → L2 |
| Verbatim retry loops (F) | P5 prompt (keep) + engine strike (exists); E3 `cmd_apply()` | Do NOT add prompt rules (756433); verify stateful breaker fires; optional informational semantic smoke (18/129 coverage, never blocking) | C2-6 (zero 3rd identical calls) → L2 |
| Fix authoring: confidently-wrong-but-compiling (C3) | E3; Y14 E4B `thinking_budget` | Semantic smoke experiment; E4B thinking-2048 arm only after C5 observes effective thinking | C5 serving canary → L2 E4B arm → if 0 replicated solves: 31B-only finals (e4b §8) |
| Agent timeouts on d5/large (E1) | Y4 `eval_config.max_time_minutes`; Y1 planner thinking; P3/P9 (keep) | Apply §8 decision rule on C2 telemetry (lower 31B→4.0 if setup ≥65 s or N≥125; raise→5.0 ONLY if setup ≤35 s AND ≤11.0 h extrapolated); planner-only budget 0/256 arm | C2 telemetry → C2-3 restart tax ≤15 s → L2 → L3 wall ≤11.0 h/10.5 h |
| MAX_TOKENS truncation nudges (A/E) | Y3 `max_output_tokens` | 8192 arm ONLY if truncation nudges observed in C2 telemetry (default don't: peaks ~3.7k, no dependable gain, S9) | C2 nudge counts gate the arm → L2 |
| Compaction/overflow (A2) | P3/P9 (keep, load-bearing); S1 SKILL.md description | Keep narrow reads + paraphrase; trim skill description 285→~150 chars (per-message re-injection tax) | C2-5 compaction drill (patch non-empty, state recovery) → C0 injection check → L2 |
| Nudge-restart tax (E/F) | Y1; Y7 `include_contents` fallback; P15 plan fold | Planner thinking arm; fallback→default ONLY if C2-4 fails; 31B heredoc-fold arm (pre-registered) | C2-3 (byte-identical spec, no dup edits) + C2-4 HARD gate → L2 |
| Localization misses (A1/C1) | E5 `cmd_locate()` weights; E6/E7 scale guards; E9/E10/E24 (OOD-gated) | Raise new-word weight ~2.2 or decay stale cues (UNMEASURED); discover_tests deadline+cap; partial-scan marker | L1 miss tasks + V7 locbench (McNemar/Wilson) → V3 OOD → L2; never tune on public alone |
| Classification/playbook mis-selection (advisory) | E11/E12 `classify()`/`edit_shape()` | OOD-gated generic vocab only; api-contract top-1 4/23 is designed residual (top-2 12/23 + tie banner) | L1 top-2 ≥70% gate → OOD → L2 |
| Collection errors / conventions (G/H/J) | NO brain lever | Mask ids; calibrated sandbox; doctrine: library-code-only fixes, no anyio reliance, small JUnit | Gold/empty re-audit; mask version bump |
| Empty patches from overflow (A2) | P9/P3 + architecture context budget | Keep <12k steady state; disk state canonical; never trust summary alone | C2-5 → L2 empty-patch rate metric |
| Selection noise (decision quality) | V1/V2/V3/V7 | Frozen mask; paired repeats win-both; OOD proxies; locbench | This guide §5.4 is the protocol |
| Run-radius: parser freeze / compile reject (run-level) | Y8/Y9 (keep scalar surface); V4a/V4b | C0 official-compiler canary FIRST; C3 fuzz ≥5,000 bracket-heavy strings, zero hangs; skills-path fallback one-liner if C0 fails | L0 hard gates before ANY GPU time or slot |

### 6.2 Prioritization formula

Score each candidate change: **Priority = Frequency x Fixability x Evidence** (each 1–3; max 27). This is the operational form of 02b's impact/effort ranking — use it to order the week, use 02b's scores to sanity-check.

| Factor | 1 | 2 | 3 |
| --- | --- | --- | --- |
| Frequency (share of masked failures in the latest cluster table) | <10% of failures, or single-task anecdote | 10–30% | >30%, or RUN-radius (any frequency) |
| Fixability (effort + risk, from 02b) | Engine/infra change, full re-test (L effort) or contested evidence | Prompt rework / small code change (M), both-track sync | Config tweak (S), low regression risk, fallback exists |
| Evidence (directness for THIS failure on THIS stack) | Extrapolated from other models/scaffolds (e.g. E2B→E4B) | Reported on 31B/QAT but other harness, or unmeasured hypothesis | Measured in your own traces/C1, or PRIMARY on the pinned stack |

Worked scoring (HYPOTHETICAL frequencies): E1+E2 edit-targeting fix — Frequency 3 (C2 branch = 40% of masked failures), Fixability 2 (M, both-track sync), Evidence 3 (your traces show def-line anchors; e4b smoke probe) → **18, first**. Y2 temp-0 arm — F2, F3 (S), E2 (755066 n=376 but per-harness) → 12, batch with other S-effort arms. E9 ranking-weight tuning — F1, F2, E1 (public ceiling, overfit risk) → 2, defer to OOD. RUN-radius gates (C0/C3) are not scored — they are **prerequisites**, always first (02b ranks them #1–2 for the same reason).

### 6.3 End-to-end worked example (HYPOTHETICAL numbers throughout)

1. **Run.** L2 baseline: 31B tree on the frozen 30-task subset, 2 repeats → 12/30, 13/30 (masked). Cluster table (§4.3): branch C = 9 failures, of which 5 are rich boundary/contract tasks with patch locus = gold file but wrong lines; traces show anchors returning def lines and 2–3 failed edits before a strike. Branch E = 3 (d5 pair + fastapi_14448 at cap). Branch G = 2 (requests sentinels — mask, no action). Branch A = 2 (rich_3278 sentinel + one overflow on fastapi_14448).
2. **Hypothesis.** The 5-task wrong-line cluster is the E1 gap: boundary-edge-case HAS priors, but api-contract/missing-capability tasks in the cluster get def-line fallbacks; the solver reads the signature, edits the wrong line, and burns calls. (Check: 70/129 tasks lack family priors, 02b E1; e4b §3.2 join_words smoke: bug at line 6, spec said line 4, anchors returned 4 and 11.)
3. **Lever change.** Implement E1 generic priors + E2 candidate-edit-lines in a scratch copy; re-mirror both tracks byte-identical; bump BCF_VERSION (cache invalidation = free re-test, 02b E18).
4. **L0/L1.** Validator 0/0 both trees; official compiler canary green; C1 full battery: uniqueness 96.0%→96.4% (≥90% gate), hit@3 unchanged 96.9%, spec ≤300 words (max 224), join_words smoke now surfaces line 6. CPU cost ~1 h. Any regression here → fix before GPU.
5. **L2 paired test.** Same 30 tasks, seed 7, docker, concurrency 1, warm server, 2 repeats per arm. HYPOTHETICAL result: baseline 12/13, arm 15/15. Per-task flips: +4 wins (the 5-task cluster minus one), −1 loss (a fastapi task where the new prior misdirected), rest stable. Win-both: yes (15>12, 15>13). McNemar on pooled discordant pairs (b=1, c=4): p≈0.375 — *not significant alone*; the promotion case rests on win-both + mechanism evidence (the 4 wins are exactly the predicted cluster, and the loss is a named, inspectable regression). Inspect the loss: if the new prior shifted a correct anchor, refine the prior generically (no task-specific hacks) and re-run L1+L2.
6. **Decision.** Promote E1+E2 to the candidate config; log in the ledger; keep the loss task as a sentinel. Do NOT claim "+3 public tasks" — the subset delta is ~2σ ESTIMATE and public transfer is weak (§5). Schedule L3 (C6 full masked x2 + OOD proxy + wall extrapolation) at the next gate; only L3 passes unlock a submission slot.
7. **Feedback to telemetry.** Add "wrong-line edit rate" (patch locus vs gold hunk lines) to the standing cluster table so the next run measures the mechanism directly, not just the score.

### 6.4 Weekly cadence (aligned to 1/day slots and 36–52 h queues)

| Day | Activity | Gate/output |
| --- | --- | --- |
| Mon | Triage weekend runs; cluster table; pick ≤2 lever candidates by §6.2; check staff threads (753973/744354/757244/757661) for answers that change masks | Updated ledger + pre-registered hypotheses (rules BEFORE runs, 751973-style) |
| Tue | L0/L1: implement in scratch, both-track mirror, validator + C1 + targeted drills (CPU only) | C1 green or fix; no GPU wasted on broken engines |
| Wed–Thu | L2 paired subset x2 repeats per arm (warm server, batched); E4B arms only after C5 | Win-both verdicts; flip lists; mechanism metrics |
| Fri | Analysis + ledger + mask review; correlation table update; decide promotions/reversions | Frozen candidate config for the gate |
| Sat | L3/C6 gate runs ONLY when a candidate is ready (full masked x2 + OOD + wall extrapolation); submission early-day if a slot is earned and C0–C7 green | Slot decision (§6.6) |
| Sun | Ops: monitor PENDING (36–52 h stalls normal, brief C18); escalate same-day with submission ids in 747519/743683; keep fallback bundle validated; rest the GPU | Queue state logged; fallback ready |

Deadlines anchoring the cadence (synthesis S24; brief §2b): Paper Track Nov 12 (separate); Entry+Merger Nov 25; Final Submission Dec 2 23:59 UTC; bonus working assumption Dec 2 with **safe internal deadline Nov 12** until staff resolves 757244. With 36–52 h queues and one-pending gate, a "submit Saturday" decision must actually be made Thursday.

### 6.5 Ledger template (one row per change; keep forever)

| Field | Content |
| --- | --- |
| change_id / date | e.g. `E1E2-2026-11-14` |
| lever ids + files touched | 02b ids; both-track sha256 before/after; BCF_VERSION bump |
| hypothesis (pre-registered) | "def-line anchors cause wrong-line edits in family X; priors surface edit lines" |
| L0/L1 result | validator/compiler/C1 numbers vs gates |
| L2 paired result | subset n, mask version, r1/r2 both arms, flip list (b/c), McNemar p, mechanism deltas (edit-fail %, first-edit s, compactions) |
| decision | promote / reject / refine + reason (win-both? mechanism confirmed? regression named?) |
| L3/C6 result | full masked x2, OOD proxy, wall extrapolation vs 11.0 h/10.5 h |
| submission ref + public score | Kaggle ref id, score, implied k/58, run-health flags |
| correlation read | direction vs local; noise/infra caveat |

### 6.6 Stop/ship rules for Kaggle slots

**Ship (all must hold):**
1. L0 green: validator 0/0 both trees + official `compile_submission` canary (skills path resolution + injected scalar schemas confirmed; compliance O4).
2. C2-3 restart drill (tax ≤15 s, byte-identical spec, zero duplicated edits) and C2-4 `include_contents:none` boundary (HARD gate; spec correct on first entry) pass on the pinned wheelhouse.
3. C3 parser fuzz ≥5,000 bracket-heavy strings: zero hangs (753973 unfixed; one hang zeroes the rest of the run).
4. C6: win-both replicated masked-set evidence for the shipped config; wall-clock extrapolation ≤11.0 h (31B) / ≤10.5 h (E4B) at N=120 with measured setup; both finals independently <12 h (better-of-two scoring; error-fallback unanswered, synthesis S15).
5. E4B slot additionally: C5 serving canary end-to-end (loads, parses, zero-arg install, thinking observed, clean format, trailing-s probe; 752128 intermittent "incorrect format") AND non-zero replicated C6 resolve rate.
6. Ops: submit early-day; fallback bundle (same tree, tighter caps) validated; monitor PENDING; escalate same-day.

**Stop (any one triggers):**
- 0 replicated E4B solves → ship 31B-only finals posture (e4b §8; architecture C5 fail clause).
- Single-run delta <4 tasks → no promotion, no reversion; repeat first (brief B16).
- Any RUN-radius signature (parser hang in fuzz, compile rejection, overflow-empty-patch class) → fix before any further score-chasing (02b §0 radius discipline).
- Extrapolated total >11.0 h (31B) → lower the cap per Y4 decision rule; never ship 4.5 min at N=129 on assumption (11.99 h marginal, compliance O7).
- Mask invalidation (wheelhouse/backend/Python change) → re-run gold/empty before any further A/B.
- Unchanged-ZIP resubmission hoping for a scorer fix → forbidden; no rescores promised (brief B9; 743683 STAFF Sep 28 pause).
- Public/private split probing → forbidden (240+ submissions vs ~70 cap, ban risk, no ruling; 757626; brief B21).

---

## 7. Pitfalls checklist

Run this list before trusting any local number. Each item: symptom → detection → fix → source.

1. **Wheel shadowing (installed package vs snapshot).** Symptom: requests tasks pass with empty patches; httpx `module 'httpx' has no attribute 'Stream'`; fixes "work" locally but the patch never mattered. Detection: `--skip-agent-patch` audit; `python -c "import requests; print(requests.__file__)"` inside the sandbox (must point at `/workspace`). Fix: remove repo-under-test wheels from `wheels/` or put `/workspace` ahead of site-packages; re-audit (requests_7309/7315/7427 must fail empty). 747248 PRIMARY; 752672; solvability §2.
2. **Warm-pool wipes.** Symptom: helper "disappears" between tasks; state from task N leaks into N+1 expectations. Detection: HR §4.1 — `/workspace`, `/tmp`, `/var/tmp` are wiped between tasks. Fix: install once PER TASK (idempotent); never design cross-task persistence; `.git/bcf/` state survives only within a task, including nudge restarts. 02a §7 note 7; compliance warm-pool note.
3. **Scratch-in-patch.** Symptom: `repro.py`/`scratch_*.py` in `patches/<id>.patch`; verification noise or reset interactions. Detection: patch file list; BCF `check` scratch WARN (any-depth untracked, compliance F8). Fix: scratch lives in `/tmp` via `run_command` heredocs (`write_file` is workspace-relative and cannot reach /tmp); delete before submit; `git add -N .` includes ALL untracked files. HR §10.3; compliance submit-discipline note.
4. **Test/config tampering (even accidental).** Symptom: patch touches `conftest.py`/`pytest.ini`/`pyproject.toml`/tests; verification silently discards those edits and the fix "stops working". Detection: patch hygiene scan (§2.3); BCF `check` protected-path FAIL. Fix: library code only; the scorer resets every protected path AND every path referenced by `test_patch` (unknowable inside the sandbox — another reason to touch nothing but library code). HR §8.2 step 3; compliance notes.
5. **Bare pytest / full suites.** Symptom: agent-side command hangs to `timeout_seconds`; grading-side hang tasks eat the cap; 3 no-patch tasks hang to cap remotely. Detection: trace `TimeoutExceeded`; test_outputs truncated at cap. Fix: targeted files only, `timeout 60`-wrapped (spec Verify commands already carry it), repro `timeout 10`; `-o timeout=0` means no per-test safety net. rich_3480/4006/3772 are the hang sentinels. architecture §3.3f; 748443; 745805 item 3.
6. **Interpreting local ceilings as brain failures.** Symptom: "fastapi is hopeless" — 27+4 tasks fail collection on ANY patch; requests dies on httpbin; gold itself only passes 73–74/129 faithful. Detection: branch G clustering; gold audit. Fix: mask + calibrated sandbox; never tune the brain against environment zeros; report masked rates only. 756587/757661/756400; brief §4.
7. **KV-ceiling parity drift.** Symptom: local long-context runs behave differently than Kaggle (earlier compaction/overflow). Detection: vLLM startup KV token count (M2); compare max_model_len vs 32,768. Fix: document the deviation; keep BCF context <12k; concurrency 1 for 31B; never A/B long-context behavior locally. 02a E5, §7 note 6.
8. **Serving-path drift.** Symptom: local results don't reproduce on Kaggle; parser behaves differently; thoughts retained locally but dropped remotely. Detection: pin check (vLLM 0.19.1, parser sha `682b2152…`, wheelhouse v31); reasoning-survival repro (C4). Fix: pin everything (§1.1); be retention-agnostic; vLLM 0.24 rewrote the parser — do not "upgrade to fix" locally. brief B22; 753521; 744354.
9. **Backend mixing.** Symptom: requests results flip between runs; rich_3472 flips. Detection: RUN_META backend/Python fields. Fix: docker for all decision runs; never mix docker/subprocess or py3.12/3.13 within an A/B. 754586; solvability §1.2.
10. **Exit 137 / OOM kills.** Symptom: task dies mid-run, exit 137, partial log. Detection: task_results exit code; docker events. Fix: respect the 4 GiB limit (it exists on the scorer too); find the memory hog (full-suite pytest, giant reads); do not raise the limit to "fix" it. HR §4.1.
11. **JUnit report pathologies.** Symptom: all tests passed but resolved=False. Detection: XML missing/truncated (>10 MiB output cap), `passed_tests==0`, skipped required nodes. Fix: keep verification output small; mask structural skip cases; never chase rich_3486/fastapi_14186. 757893; HR §8.2 step 5.
12. **Seed ≠ determinism.** Symptom: identical config, different results; "but seed 7 is fixed". Detection: paired repeats flip 10–15% of tasks. Fix: treat every single run as one sample; win-both protocol; float non-associativity makes LLM inference non-deterministic even at temp 0 (Yurnero, 750521 PRIMARY). 750907; 747168.
13. **Empty-pass free points.** Symptom: config "improves" by +2 on tasks that pass with no patch. Detection: empty audit; resolved=True with 0-byte patch (branch I). Fix: mask all empty-passers; fix shadowing first. 756400; 747248.
14. **Best-of-N public display.** Symptom: "our 0.24 dropped to 0.17, the change broke it". Detection: LB retains best score (CSV-verified: 537 improvers, 0 decliners Nov 5→11); reruns land 1–4 tasks lower. Fix: compare your OWN repeated runs, not public displays; one run is not a verdict. brief §5; 757588.
15. **Denominator mixing.** Symptom: "we score 0.55 locally but 0.17 public — transfer is broken". Detection: which n? raw 129 vs masked 68 vs 58 hidden vs ~120 total. Fix: always state (n, mask version, environment) with every rate; never average sets. synthesis contradiction 10; §5.3.
16. **CLI budget ≠ eval_config.** Symptom: local runs use 60 min/unlimited while Kaggle uses 4.5 min/50. Detection: Task Budget block in `logs/<id>.log` (HR §5.2). Fix: mirror the four values via flags; verify per run (§1.3). HR §7.1/§9.1.
17. **Cold-start and first-task timing.** Symptom: "task 1 is always slowest". Detection: server startup 4–9 min ESTIMATE + cold-kernel +5–20 s. Fix: warm server, batched invocations, discard task-1 timings from comparisons. 02a E6, §3.
18. **Windows-drive crosses.** Symptom: bootstrap 3–10x slower than expected; docker exec latency. Detection: M4 benchmark (extract one 214 MB snapshot ext4 vs /mnt/d). Fix: everything on ext4 VHDX or native Linux. 02a E8, §5.2.
19. **Trusting the compaction summary.** Symptom: post-compaction the solver "remembers" wrong state, re-reads, loops. Detection: trace summary events; state-vs-summary divergence. Fix: disk state canonical (`bcf.py state`), paraphrase every important result into visible text (only text survives; summarizer samples temp 1.0 regardless of your config). 754783; 753225; architecture §8.
20. **Resolved = correct.** Symptom: confident wrong fixes counted as wins (inverted boolean, off-by-one). Detection: mutation-style spot checks on sentinel wins; 14.7% escape base rate. Fix: treat rate as upper bound; keep error-path assertions in your own repros; paper-track claims need mutation checks. 756400; brief B20.

---

## Appendix A — Command cheat sheet

```bash
# Smoke (one task)
swegemma eval --tasks tasks.jsonl --snapshots-dir snapshots --submission-dir ~/bcf/work/31b-copy \
  --results-dir results/smoke_01 --sandbox docker --task-id fastapi_11194 \
  --max-tool-calls 50 --max-time-minutes 4.5 --concurrency 1

# Subset (frozen stratified 30; §1.4) — one invocation per arm per repeat
swegemma eval ... --results-dir results/subset_armA_r1 --task-ids <30 ids>

# Full 129 (gate runs only)
swegemma eval ... --results-dir results/full_31b_gate --concurrency 1

# Empty-patch baseline audit
swegemma eval ... --results-dir results/empty_audit --skip-agent-patch

# Sharded full run (checkpointing)
swegemma eval ... --results-dir results/full_shard0 --shard-index 0 --num-shards 2
swegemma eval ... --results-dir results/full_shard1 --shard-index 1 --num-shards 2

# First-look triage of any results dir
python3 -m json.tool results/run_01/summary.json
head -1 results/run_01/task_results.jsonl | python3 -m json.tool
ls -la results/run_01/patches/ | sort -k5 -n | head     # smallest patches = empty-patch candidates
grep -l "ModuleNotFoundError" results/run_01/test_outputs/*.log   # environment zeros
grep -l "Failed to apply" results/run_01/task_results.jsonl       # apply failures (single file: grep per line)
```

## Appendix B — Source index (all local)

- **Harness contract:** `input/kagglecomp/kagglecomp_data_package/HARNESS_README.md` §3.1 (4xL4 serving), §4 (lifecycle, sandboxes, bootstrap), §5 (prompt, nudges), §6 (tools, truncation, free tools), §7 (budgets, compaction, retries), §8 (patch extraction, 4-pass apply, anti-tampering, hermetic pytest, resolution criterion), §9 (CLI + artifacts), §10 (gotchas).
- **Runtime context:** `scratch/bcf-hardening-2026-11-11/02a-bottlenecks.md` (local/remote bottleneck tables, E1–E20 estimates, M1–M15 measurement plan); `02b-levers.md` (Y/P/E/S/V lever inventory, failure-class map, do-not-tune list).
- **BCF design + measurements:** `scratch/bcf-2026-11-11/design/architecture.md` (§8 budget math, §9 failure matrix, §10 C0–C7 canaries); `design/bcf-empirical-report.md` (129-task C1 battery, 4 intrinsic misses, anchor/runtime stats); `design/compliance-review.md` (F1–F9 fixes, O1–O10 open risks); `design/e4b-viability-review.md` (fix-authoring ceiling, gates).
- **Task population:** `scratch/bcf-2026-11-11/taxonomy.md` + `taxonomy.json` (kinds/families/difficulty/edit_shape, insights 1–10); `index.json` (patch/test stats; median +8 lines, 38 multi-file, hints 0/129 — recomputed this pass); `tasks.jsonl` (129 tasks, schema verified this pass); `zip_listing.txt` (dataset layout/sizes).
- **Intel:** `input/kagglecomp/intel_20261111/00-intel-brief-2026-11-11.md` (§4 solvability audits, §5 leaderboard, §6 implications B1–B22); `scratch/bcf-2026-11-11/intel/00-synthesis.md` (constraints S1–S24, contradictions register); `intel/solvability-scoring.md` (unsolvable mechanisms, gold timeline, noise, localization base rates).
- **Leaderboard:** `input/kagglecomp/intel_20261111/leaderboard-public-2026-11-11.csv` (5,439 teams; floor(k/58) quantization and bucket counts re-verified by script this pass).
- **Threads cited** (PRIMARY dumps in `scratch/bcf-2026-11-11/intel_texts/topic_<id>.md` unless marked SECONDARY in solvability/brief): 743063, 743683, 744272, 744354, 744370, 744692, 745138, 745805, 746250, 747168, 747248, 747519, 747696, 747914, 747923, 747980, 748287, 748443, 749198 (title-level), 750175, 750521, 750907, 750974 (SECONDARY), 751487 (SECONDARY), 751596 (SECONDARY), 751707 (SECONDARY), 751973 (SECONDARY), 752017 (SECONDARY), 752128 (SECONDARY), 752220 (SECONDARY), 752672 (title-level), 752848, 753225 (SECONDARY), 753277 (SECONDARY), 753521, 753524 (SECONDARY), 753973, 754586, 754636, 754783, 755291, 755554, 755677 (SECONDARY), 756051, 756315, 756336, 756400, 756433, 756438 (SECONDARY), 756587, 756622 (SECONDARY), 757149, 757244, 757588, 757626, 757661, 757893, 757993.

*End of 04 — Local Scoring & Feedback Guide.*
