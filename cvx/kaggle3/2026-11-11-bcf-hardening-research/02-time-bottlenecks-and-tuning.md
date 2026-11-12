# BCF Hardening — Task 2: Wall-Clock Bottlenecks, Tuning Levers & Fast Iteration

**Date:** 2026-11-11 · **Scope:** (a) every wall-clock bottleneck in local (PowerSpec G914, RTX 5090) and remote (Kaggle 4x L4) evaluation; (b) every BCF tuning juncture with a ranked impact-effort analysis; (c) iteration/feedback-loop strategies that avoid the bottlenecks. Evidence: HARNESS_README, the local intel captures (threads cited inline), the shipped BCF implementation, and CPU-measured engine metrics. Estimates are explicitly marked.

## Executive summary

**Remote (Kaggle):** the submission *queue* (36-52 h stalls, one-pending gate, 1/day, rescore paused) dominates iteration latency but sits outside the 12 h clock. Inside the clock, **decode consumes ~7-9 h of the 12 h budget** (31B at 33-35 tok/s on 4x L4; 76% of agent wall is decode). The reclaimable waste: thinking overrun (90s->316s/task when silently on), SequentialAgent nudge restarts (60-90s each), edit-failure loops (43% edit_file failure in the field; 51-call identical loops), compaction summarizer calls (~9.2 LLM calls/eval), and late edit commitment (first edit 106s solved vs 183s failed). Bootstrap is ~0.5 min/task; vLLM startup ~12.6 min measured.

**Local (RTX 5090):** no queue; decode ESTIMATE 50-80 tok/s (~1.5-2.3x the rig); prefill may be slower (4x L4 aggregate compute); **KV cache is the binding constraint** (uniform allocation ~0.86-0.94 MiB/token -> 32k context may not fit; probe at startup, fp8 KV or reduced max_model_len as fallbacks); WSL2 /mnt/d 9p crosses make bootstrap 3-10x slower (stage data on ext4); keep vLLM warm (cold start 4-9 min). BCF helper costs are negligible (cold spec p95 0.27s).

**Tuning:** 66 levers inventoried across YAML (14), prompts (16), engine (26), skill (3), eval strategy (7). Top ranked: the eval_config cap decision rule (prevents the 12h RUN-kill), the C0 compiler canary + skills-path fallback, planner-only thinking reduction, the temp-0.0 arm, the 3,000-char statement copy (31B), and the two E4B edit-line engine improvements (_family_lines priors + spec edit-line surfacing). 22 items are explicitly do-NOT-tune (harness-locked or evidence-against).

**Iteration:** a five-rung loop ladder — L0 CPU-only (engine battery, edit replay, localization probes, gold/empty audit, parser fuzz: seconds to ~1h, no GPU) -> L1 warm-server single-task drills (~45-75 min) -> L2 stratified dev30 paired A/B (~2.3h screen, win-both + McNemar, noise floor ~3 tasks/30) -> L3 overnight masked-68 x2 sharded (~5.2h/arm) + OOD proxies -> L4 Kaggle slots (~8-11 usable Nov 12-Dec 2, pre-slot C0-C7 checklist). Hypothesis ledger with pre-registration, promotion state machine, and a concrete first-week schedule.

## Contents

- **Part A — Wall-clock bottleneck inventory** (subtask a): pipeline map, remote/local/BCF tables, top-10 ranking, measurement plan, estimate register.
- **Part B — Tuning levers & impact-effort ranking** (subtask b): 66-lever inventory by layer, ranked top-20, quick wins, strategic items, do-NOT-tune list.
- **Part C — Iteration & feedback-loop strategy** (subtask c): loop ladder L0-L4, bottleneck-avoidance techniques, hypothesis ledger, script sketches, first-week plan.

---

# PART A — Wall-Clock Bottleneck Inventory (subtask 2a)

**Date:** 2026-11-11 · **Role:** performance analyst (BCF hardening L2) · **Method:** LOCAL ONLY, no web research.
**Scope:** (A) running the `swegemma` harness locally on a PowerSpec G914 desktop (RTX 5090 32 GB, Windows 11 + WSL2 or native Linux); (B) remote Kaggle submissions (4x L4 24 GB, TP4, `gemma-4-31b-it-qat-w4a16-ct` / E4B bonus).
**Nothing under `input/` or `deliverables/2026-11-11-bcf-gemma4-brain/` was modified.**

**Evidence classes.** `MEASURED` = a number reported in a cited local capture or measured in this repo's own artifacts (thread ids / file paths given). `ESTIMATE` = derived here; every ESTIMATE carries its reasoning inline and is collected in §8. Hardware specs (5090 ~1.79 TB/s, L4 ~300 GB/s) are task-provided reference specs, not local measurements.

**Budget legend (used in every table).**

| Code | Meaning |
| --- | --- |
| `G` | Counts against the **12 h global** whole-submission clock (43,200 s). Hitting it errors the whole submission and burns the daily slot (staff 743063; anomalies exist but are not bankable — 00-synthesis contradiction 4). |
| `T` | Counts against the **per-task agent timer** (`max_time_minutes`), which starts only after Container A bootstrap (HARNESS_README §7.1 TIP). The T clock runs inside G. |
| `G only` | Inside the 12 h global clock but **outside** the per-task agent timer (container setup, vLLM startup). |
| `OUT` | Outside the 12 h clock per docs/staff (queue wait; Phase 2 patch validation per 752017 docs reading — exact enforcement staff-unanswered, 748618/752017). Still consumes wall time and slots. |

---

## 1. Pipeline diagram (text)

```text
REMOTE (Kaggle scored submission)                          LOCAL (5090 desktop, swegemma eval CLI)
=================================                          =========================================
submit zip (<=3 GiB unpacked)                              build/validate submission tree (C0)
  |                                                          |  validate_submission.py + official compiler
  v                                                          v
[QUEUE WAIT]  36-52 h stalls (Nov 11)                      [DISK STAGING] 21.9 GB zip -> 129 snapshot tgz
  one-pending gate; 1/day; no cancel                         (median 214 MB; 21.5 GB total) + wheels cache
  OUT of 12h; burns daily slots                              + docker build swebench-sandbox (one-time)
  |                                                          |
  v                                                          v
notebook session starts  <-- 12 h GLOBAL clock starts      vLLM server start (TP1, 32 GB VRAM)
  |                                                          model load 16-18 GB + CUDA-graph capture
  v                                                          [KV ceiling: ~10-20k tokens ESTIMATE]
validate_directory + single-model rule                       |
compile_submission (declarative YAML -> ADK)                 v
  |                                                        per task (sequential; --concurrency N optional):
  v                                                          |
vLLM server startup  ~12.6 min measured (746250)             v
  weights 16-18 GB W4A16, TP4, util 0.80,                  Container A bootstrap (7 steps, G only):
  max_model_len 32768, gemma4 parsers                        1 wheel staging (/wheels)
  G only; LoRA edge: ~25 min load then OOM (749191)          2 snapshot extract (214 MB tgz -> /workspace)
  |                                                          3 .git/info/exclude
  v                                                          4 pip install -e --no-deps (build backend)
FOR EACH TASK (~120, SEQUENTIAL, staff 743063):              5 test-dep stream + setup.py --fast-path
  |                                                          6 pytest.ini + conftest.py
  v                                                          7 git add -A && git commit baseline
Container A bootstrap (7 steps, G only)  ~10-30 s            |
  |                                                          v
  v                                                        agent loop (T + G):  <-- same protocol as remote
agent loop (T + G):                                          prefill of growing context
  build_agent_prompt (7 sections)                            decode (31B: 33-35 tok/s remote;
  while True:                                                  5090 ~50-80 tok/s ESTIMATE)
    LLM call: prefill + thinking + tool_call                 thinking tokens (2048 budget)
    tool exec: run_command / read_file / edit_file ...       tool round trips (docker exec / subprocess)
    nudges (max 3) on non-submit turn exit                   nudges / MAX_TOKENS restarts
    compaction at ~14,336 tok (summarizer LLM call)          compaction summarizer calls
    budgets: time / tool_calls / turns                       budgets: 4.5 min / 50 calls / 50 turns (31B)
  |                                                          |
  v                                                          v
patch extraction: git add -N . && git diff --binary        patch extraction (same)
Container A teardown / warm-pool wipe                        |
  |                                                          v
  v                                                        Container B bootstrap (steps 1-7 again)
Container B bootstrap (steps 1-7, "eval_baseline")         apply agent_patch (4-pass) + test reset
apply agent_patch (4-pass resilient)                       apply test_patch
reset protected test/config files                          hermetic pytest + JUnit XML
apply test_patch                                           [OUT of 12h per docs; adds local wall]
hermetic pytest + JUnit XML validation                       |
  [OUT of 12h per docs; adds wall ~0.5 min/task]             v
  |                                                        results-dir: summary.json / task_results.jsonl
  v                                                        patches/ test_outputs/ traces/ logs/
score = resolved / total                                     |
  |                                                          v
12 h kill: whole-submission error, slot burned             iteration: rebuild zip -> re-validate ->
rescore PAUSED since Sep 28 (743683)                         re-run eval (server warm or cold)
```

**Key asymmetry:** remote has a queue + one-pending gate + hard 12 h kill and no interactivity; local has no queue and no 12 h kill, but pays VRAM/KV ceilings, WSL2 filesystem crosses, and per-run server startup on every iteration. The agent-loop protocol (nudges, compaction, budgets, tool semantics) is identical by design — local eval is only predictive if the serving path is pinned to the scorer's (wheelhouse v31, vLLM 0.19.1, gemma4 parsers, non-streaming; brief implication 22).

---

## 2. REMOTE bottleneck table (Kaggle 4x L4, TP4)

Magnitudes are per task unless stated. "p50/p95" refer to the cited study's distribution.

| Stage | Bottleneck | Mechanism | Magnitude | Budget-counted? | Evidence |
| --- | --- | --- | --- | --- | --- |
| Pre-run | Submission queue wait | L4x4 scarcity / hung jobs; one-pending gate (`400 FAILED_PRECONDITION`) blocks all new submits; no cancel; 1/day | Oct 13 staff baseline ~14 h; **Nov 9-11 stalls 36-52 h+** (40 h, 52 h reports); Oct wall-with-queue **22-46 h** (ref 56979096 ~46 h; 57053652 PENDING at 23 h+) | `OUT` of 12 h; burns daily slots | 747519 (Dustin STAFF baseline); 757993 (kush1235/Qiyu_Ma/FakeEyes2W); 748443 title+table; brief S2/C18 |
| Pre-run | Rescore pause / no reruns | Staff paused rescores Sep 28 until L4x4 queueing resolved; failed/stuck runs not auto-reprocessed | Indefinite; budget lost days, not reruns | `OUT` | 743683 (Ryan Holbrook STAFF); brief S3 |
| Session | Notebook session limits | Scoring notebook hard-killed at ~12 h ("Notebook Timeout"); interactive sessions/quota separate and not documented in local corpus | 12 h kill observed (Nir Aberman Oct 22, +5% local step cost blew it); two >12 h runs scored (unexplained anomalies — do not rely) | `G` enforcement | 752017; 743063 (Varun Ambadi refs 56667603/56701670); 00-synthesis contradiction 4 |
| Startup | vLLM server startup | Weight load 16-18 GB W4A16 across 4 GPUs + KV profiling + CUDA-graph capture (PIECEWISE 51 + FULL 35 graphs, ~2.19 GiB) | **~12.6 min fixed notebook/vLLM setup MEASURED** (746250); design assumption 600 s (architecture §8); health timeout 1200 s (749191 Cam-Mark) | `G only` (staff: "6. Yes." 745805) | 746250; 745805 Q6; 749191; HARNESS_README §3.1 |
| Startup | LoRA startup OOM edge | `cudagraph_specialize_lora=True` doubles graph memory; uncounted unless `VLLM_MEMORY_PROFILER_ESTIMATE_CUDAGRAPHS=1`; sampler warmup OOM after load | ~25 min load then OOM (Nir, 3 repros); rank-4 single-layer also OOM without flag; ~487 MB adapters score-or-die between runs | `G only`; can kill run before task 1 | 749191 (Nir/Cam-Mark/Young Uk Song); staff flag answer 749191 |
| Bootstrap A | Snapshot extraction | 214 MB median tgz (fastapi up to 335 MB) decompressed + ~2,973 files written into `/workspace` on 2 vCPU / 4 GiB container; `.git` fast-import objects | **ESTIMATE 3-10 s/container** (gzip ~100-200 MB/s single-thread; pigz in image; ~3k file creates). Dominant I/O step of bootstrap | `G only` (outside T per HR §7.1 TIP) | zip_listing.txt stats (this repo: n=129, median 214.0 MB, max 334.9 MB); extraction.log file counts; Dockerfile.sandbox (pigz); HR §4.2 |
| Bootstrap A | Editable install | `pip install --no-index --no-build-isolation --no-deps -e /workspace` invokes repo build backend (pdm-backend/setuptools/poetry-core) | **ESTIMATE 3-10 s** (pip + backend import + editable wheel build; no dependency resolution) | `G only` | HR §4.2 step 4; sandbox_setup.py `install_editable_package`; Dockerfile.sandbox build backends |
| Bootstrap A | Test-dependency streaming | Streams cached unpacked site-packages (<20 MB base wheels, >=20 MB workspace wheels) into container env + `setup.py --fast-path` | **ESTIMATE 2-8 s** (docker cp/tar stream of tens-hundreds MB; fast-path `.pth` injection itself <0.05 s per docstring) | `G only` | HR §4.2 step 5; sandbox_setup.py `execute_fast_path` ("<0.05s") |
| Bootstrap A | Wheel staging / exclude / pytest.ini / conftest / baseline commit | `/wheels` prep; `.git/info/exclude` append; config writes; `git add -A && git commit` over ~3k files | **ESTIMATE 1-4 s combined** (baseline commit dominates: git index write of ~3k files on 2 vCPU) | `G only` | HR §4.2 steps 1,3,6,7; sandbox_setup.py |
| Bootstrap A+B | Total per-task setup+verify overhead | Both containers' bootstrap + teardown + grading, on top of agent cap | **MEASURED ~0.5 min/task** (Zhukov: 4.5-min cap -> ~10 h for 120 tasks); design assumption 60 s/task, sensitivity 30-90 s | `G only` | 746250 (Zhukov); architecture §8 |
| Agent loop | **Decode (dominant compute cost)** | Autoregressive generation at 4x L4 TP4 bandwidth; thinking + visible text + tool-call payloads all decode serially | **31B: 33-35 tok/s MEASURED** (4xL4); fitted 1.4 s + 28.7 ms/output-token; median 10.3 s/model call; 8.68 s/call thinking-on (Kaggle calibration); **76% of agent wall-clock is decode** (12B study, effective 17.25 tok/s, dt=0.78+0.058·ct, r²=0.9996) | `T`+`G` | 750974 (Zhukov 4xL4 decode); 746250 (900.8 s/M tok ≈ 1,110 tok/s aggregate); 755291 (PRIMARY: four 12B fastapi runs; hardware unstated — do not assume 4xL4) |
| Agent loop | Thinking-token spend | `thinking_budget` shares the output allowance; reasoning decodes at the same tok/s before any action | One task **90 s -> 316 s** when thinking silently re-enabled (747914); 3-task panel: 94 s no-think / 362 s default / 458 s HIGH (748168); thinking-off collapses 48->23/129 (746250) — cannot simply disable | `T`+`G` | 747914; 748168; 746250; 755066 (4k ceiling spent entirely on reasoning) |
| Agent loop | Prefill of growing context | Every call re-prefills system prompt + history + tool results; cost grows with trajectory; prefix caching only partial (min_tokens 2048, ttl 1800) | **Prefill spikes: 82 s for 251 output tokens**; 4 spikes + 4 restatements = **8 of 43 steps hold 56% of budget** (755291); aggregate serving 1,110 tok/s prompt+completion (746250) | `T`+`G` | 755291; 746250; HR §7.2 ContextCacheConfig |
| Agent loop | File restatement after read | Model echoes file contents it just read (pure output-token waste) | **1,788 tokens / 104 s in one message** (755291); at 17.25 tok/s a 300 s budget ≈ 5,000 output tokens total | `T`+`G` | 755291; 00-synthesis constraint 10 |
| Agent loop | read_file truncation re-reads | Silent 150-line / 10,000-char cap; model re-reads same file without ranges | fastapi/params.py **754 lines read 6x, never fully seen**; **1,152 lines fetched twice** across four runs (755291 PRIMARY) | `T`+`G` | 755291; HR §6.2 |
| Agent loop | Tool-call round trips | Each tool result triggers a fresh LLM call (prefill + decode); sequential tool execution (no usable ParallelAgent on ADK 1.36) | ~22-30 calls/task at 8-12 s/call ≈ 176-360 s (architecture §8 micro-budget); median s/tool call 12.2 (31B, 750974); ParallelAgent search subagent ~90 s for 3,000 tokens (748287 Paquin) | `T`+`G` | architecture §8; 750974; 748287; 00-synthesis contradiction 1 |
| Agent loop | run_command latency | `docker exec` + bash in 2-vCPU container; grep/pytest/import time; output truncated at 5,000 chars | Trivial commands **ESTIMATE 0.2-1 s** (exec overhead); **24 of 7,424 commands >120 s — all failed/timed out**; 3 legitimate checks ~104 s (755066); command timeouts bind on only 0.06-0.47% of commands (747857) | `T`+`G` | 755066; 747857; HR §6.1 |
| Agent loop | In-sandbox pytest (targeted) | Python + repo import time (pydantic/rich), collection, test run; `-o timeout=0` means no per-test timeout | Grading-side **~5 s setup + 1-40 s pytest MEASURED** (748443); agent-side targeted runs **ESTIMATE 3-15 s** typical (import-dominated), up to ~104 s legitimate; hang tasks run to `timeout_seconds` cap | `T`+`G` | 748443; 755066; HR §8.2 pytest flags; rich_4070 (import-time task) |
| Agent loop | Compaction summarizer LLM calls | At ~14,336 prompt tokens ADK replaces history with an LLM summary; summarizer reads only text parts (tool results dropped); summary calls sample at temp 1.0/0.95/64 and carry thinking | **4,248 summary calls / 463 evals ≈ 9.2 per eval MEASURED** (753225); per-call **ESTIMATE 15-40 s** (prefill up to ~14k tok at ~1,110 tok/s ≈ 13 s + summary decode incl. thinking at 33-35 tok/s); plus downstream re-orientation/re-read tax after lossy summary | `T`+`G` | 753225; 754783 (+Jack Yu raw_json); 756336; HR §7.2 (interval 5, overlap 2, retention 5) |
| Agent loop | Context overflow | prompt+max_output > 32,768 rejected by vLLM; generic except skips fallback patch capture | **44/44 overflowed sessions empty patch** (14 after successful edits); ~12% of sessions at threshold 14,336 (744692) | `T`+`G` (wastes whole task) | 744692; 00-synthesis constraint 7 |
| Agent loop | Nudge restarts re-running plan | Non-submit turn exit -> new `run_async` on root; SequentialAgent restarts at sub_agents[0]; `include_contents:none` re-runs Stage 1 blind; shared-session duplication 10-12k tok -> premature compaction | **60-90 s + multiple tool calls per blind restart** (754636); 7 of 8 timeouts from Stage 1 (747519 Syurolh); max 3 nudges then terminate (HR §5.3) | `T`+`G` | 754636; 747519; HR §5.3 |
| Agent loop | MAX_TOKENS truncation waste | Thinking + large edit payload exhaust output cap; `<\|tool_call\|>` tag cut mid-flight; whole generation wasted + nudge round trip | Up to 6,144 output tokens ≈ **~3 min at 33 tok/s ESTIMATE** per truncated call; v20t at 8-min cap: **75 timeouts / 57 empty patches** (747696); nudge text pre-agreement mitigates (HR §5.3) | `T`+`G` | HR §5.3 + gotcha 1; 747696; 755066 |
| Agent loop | edit_file failure loops | Backtick-swallow serialization (old_string lost); escaped new_string residual; verbatim retries | **43% of edit_file calls failed** (107/246, 747923); 60/234 edit + 20/255 write rejected vs 0/1,135 run_command (747519); **51-call identical loop** burned a 60-turn budget (756051); E2B ~75% of failed edits are verbatim retries (756433) | `T`+`G` | 747923; 747519; 756051; 756433; 744272 residual |
| Agent loop | Edit-commit latency | Exploration over-read before first edit; gold file found early but edit lands late | Gold opened by call 2-3 in **84%** of 163 runs; first edit **~106 s solved vs ~183 s failed**; ~10 of 28 calls spent reading (752848) | `T`+`G` | 752848; 00-synthesis constraint 11 |
| Agent loop | LoRA serving tax (if used) | Adapter kernels + KV shrink (0.76x) + more tokens/step | **+29% time/task, +45% tokens/step MEASURED** (Kapil 755677); decode -11% (DECEM 749191); +15-20%/call (751596); 8-min cap x 120 tasks blew 12 h | `T`+`G` | 755677; 749191; 751596; 744331 (KV) |
| Agent loop | Transient-error retries | ModelRetryPlugin: 5 retries, 2 s initial, 2x, max 60 s, ±20% jitter | Worst-case backoff chain **~62 s + jitter ESTIMATE** per transient error (2+4+8+16+32); rare on healthy server | `T`+`G` | HR §7.2 |
| Agent loop | Array-parser server freeze | vLLM 0.19.1 gemma4 `_parse_gemma4_array` never advances on `]` inside unquoted element; runs on API event loop; SIGTERM ignored; client 600 s read timeout > per-task clock so retries never fire | **Zeroes every remaining task** (run-level); 2 freezes/~830 skill-agent tasks; one process 26.7 GB before OOM; 74/60,000 fuzz strings hang | `T`+`G` until kill; run-fatal | 753973; 745138; 746336; brief S/C2 (still unfixed Nov 8-9) |
| Agent loop | Reasoning-drop re-derivation | Public wheelhouse v31 drops `reasoning_content` between tool calls; agent re-derives state it "forgot" | Extra calls/tokens per task **ESTIMATE 10-30 s** (one re-orientation read + paraphrase); scorer parity unknown | `T`+`G` | 744354 (Lazaros Nov 11 repro); brief S4 |
| Patch extract | git add -N + diff --binary | Index scan of ~3k files + binary diff generation on 2 vCPU | **ESTIMATE 1-5 s** (large generated-table patches, e.g. rich_3930 +12.1k lines, at the upper end) | `G` (after T ends) | HR §8.1; intro.md (rich_3930) |
| Phase 2 | Container B bootstrap + 4-pass apply + pytest | Fresh snapshot + same 7 steps; resilient git apply passes; protected-file reset; hermetic pytest + JUnit validation | **~0.5 min/task setup+verify MEASURED** (746250, combined with A); grading pytest 1-40 s; **3 no-patch tasks hang to `timeout_seconds` cap** (748443); worst case 6-min cap + 300 s timeout ≈ **22-24 h total** (748443) | `OUT` of 12 h per docs (752017); adds wall; `timeout_seconds` also bounds grading pytest (745805 item 3) | 746250; 748443; 745805; HR §8.2 |
| Phase 2 | Scorer-convention false failures | `-p no:anyio`, overwritten pytest.ini, non-collectable targets, skipped-sibling matcher, 10 MiB JUnit cap | 277/1,143 (24%) correct fixes fail verification; rich_3486 + fastapi_14186 can never resolve — wasted agent time on unwinnable tasks | `OUT` (but wastes `T`+`G` upstream) | 757893; brief C6 |
| Ops | Daily slot burn | 12 h overrun, Kaggle Error, stuck PENDING each consume the 1/day slot; ~70 total cap | 36-52 h stalls = 1-2 lost days each; Nov wave: 3+ users stuck 40-52 h | `OUT`; strategic | 752017; 747519; 757993; 757626 (70 cap) |

**Remote budget math anchor.** 43,200 s / ~120 tasks = 360 s/task gross (755066). Observed scored runs **8.9-11.9 h** (752017). Zhukov: 4.5-min cap -> ~10 h incl. ~0.5 min/task overhead + ~12.6 min startup (746250). BCF worst case at 4.5-min cap, 60 s setup, 600 s startup: **11.17 h (N=120), 11.99 h (N=129, marginal)**; +1,800 s reserve -> 11.67 h (architecture §8). Hidden repos run slower than public: a +5% local step cost blew a 12 h run (752017 Nir Aberman).

---

## 3. LOCAL bottleneck table (PowerSpec G914, RTX 5090 32 GB, WSL2 / native Linux)

No queue, no 12 h kill, no daily slots. The `Budget-counted?` column describes the **remote equivalent** (what the local measurement predicts); local runs themselves are unbounded. All 5090 numbers are ESTIMATE unless noted — no local GPU run has been executed yet in this project.

| Stage | Bottleneck | Mechanism | Magnitude (local) | 5090 vs 4x L4 delta | Budget-counted? (remote equiv.) | Evidence |
| --- | --- | --- | --- | --- | --- | --- |
| Setup (one-time) | Dataset staging | 21.9 GB zip (21,929,289,087 bytes on disk); 129 snapshot tgz = 21.50 GB (median 214.0 MB, mean 166.6, max 334.9); selective extraction already built `sources/` for C1, but the harness needs full snapshots | **MEASURED sizes** (zip_listing.txt, this repo); copy/extract to WSL2 ext4 **ESTIMATE 2-6 min** (NVMe ~2-3 GB/s); to `/mnt/d` **ESTIMATE 10-30 min** (9p small-file penalty) | Disk-bound; GPU irrelevant. Native Linux ≈ WSL2-ext4; both >> `/mnt/d` | n/a local; predicts `G only` bootstrap I/O | zip_listing.txt stats; intro.md §Methodology 2; extraction.log |
| Setup (one-time) | Sandbox image + wheels | `docker build` python:3.13-slim + apt (git/patch/protoc/pigz) + pip pytest/backends; COPY wheels/ (public cache) | **ESTIMATE 2-5 min** build; wheels cache must be pre-populated (sandbox is `network_mode=none`) | Same on both; CPU/disk-bound | n/a local | Dockerfile.sandbox / Dockerfile.public; HR §4.1 |
| Startup | vLLM startup per run | TP1 weight load 16-18 GB from disk + KV profiling + CUDA-graph capture; vLLM has no native Windows support -> WSL2/Docker required | **ESTIMATE 4-9 min** cold (16-18 GB at ~2-3 GB/s disk ≈ 6-9 s pure read, but load/dequant/profiling/graph capture dominate; remote 12.6 min is TP4 with 4-way shard coordination). Keep server warm across iterations to amortize | **Faster ESTIMATE ~1.5-3x** (TP1: no 4-way shard sync; single-GPU graph capture). CUDA-on-WSL2 overhead **ESTIMATE 2-5%** vs native | `G only` | 746250 (12.6 min remote); architecture §8 (600 s); 749191 (graph counts); vLLM Windows support = general knowledge, verify |
| Startup | **VRAM/KV ceiling (local-only)** | 32 GB total: ~17 GB weights + ~2-3 GB graphs/activations leaves ~10-12 GB KV. 31B KV ≈ 0.94 MiB/token total (16 KV heads x 256 dim x 60 layers x bf16 x K+V; whoami's TP4 figure 246 kB/GPU x 4) | **ESTIMATE ~10-12k tokens KV at bf16; ~20-24k with fp8 KV** -> `max_model_len=32768` will NOT fit; must lower max_model_len or quantize KV. `--concurrency 2` halves per-seq KV -> run concurrency 1 for 31B | 4xL4 has 76.8 GB usable -> 36,432-token KV (744331 Pierre). **Local context is the parity gap**: keep prompts <14,336 (BCF design does) and document the deviation | `G only` + shapes `T` behavior | 744331 (whoami KV math, Pierre 36,432); HR §3.1 (util 0.80); ESTIMATE derivation §8 |
| Startup | Blackwell kernel support | Pinned vLLM 0.19.1 wheel must contain sm_120 (RTX 5090) kernels; if not, local serving needs a different build -> parser/behavior parity risk (0.24 rewrote the gemma4 parser) | **Verify item, not measured.** If unsupported: +hours of build debugging | n/a | n/a | 753521 (parser fixed only in 0.24); brief implication 22 (pin v0.19.1); ESTIMATE risk |
| Bootstrap A/B | Snapshot extraction | Same 7 steps as remote; 214 MB median tgz -> ~3k files; container FS is ext4-in-VHDX (near-native) **unless** bind-mounted from `/mnt/d` (9p/drvfs cross) | **ESTIMATE 2-5 s/container** on WSL2-ext4/native (pigz + NVMe); **ESTIMATE 10-30 s** if workspace/wheels live on a Windows-drive bind mount (9p per-file latency ~1-5 ms x ~3k files) | Desktop CPU/NVMe likely faster than scorer's 2-vCPU quota -> local bootstrap **underestimates** remote `G only` cost; re-add the 2-vCPU quota locally (`--cpus 2`) for parity | `G only` | HR §4.1/4.2; Dockerfile.sandbox (pigz); zip_listing.txt; 9p penalty = ESTIMATE (§8) |
| Bootstrap A/B | Editable install + test deps + baseline commit | pip/build-backend + site-packages stream + git commit, same as remote | **ESTIMATE 5-15 s/container** native; 2-3x slower across 9p | Faster CPU helps; keep 2-vCPU/4 GiB quota for parity | `G only` | sandbox_setup.py; HR §4.2; ESTIMATE |
| Bootstrap | Warm-pool wipe | `find /workspace -mindepth 1 -exec rm -rf` of ~3k files between tasks | **ESTIMATE 1-3 s** ext4; **5-15 s** across 9p | Same mechanism | `G only` | HR §4.1 |
| Agent loop | **Decode** | TP1 bandwidth-bound generation; no TP all-reduce | **ESTIMATE 50-80 tok/s (31B W4A16)**: 17 GB / 1.79 TB/s ≈ 9.5 ms/token theoretical ≈ 105 tok/s; apply 50-70% efficiency (dequant kernels, launch overhead) -> 50-75 tok/s. E4B (~4-5 GB weights): **ESTIMATE >100 tok/s** | **~1.5-2.3x faster than 4xL4's 33-35 tok/s MEASURED.** Reasoning: L4 TP4 theoretical 4.25 GB shard / 300 GB/s ≈ 70 tok/s but measured 33-35 -> ~50% TP/PCIe efficiency; 5090 TP1 removes all-reduce entirely (L4 has no NVLink; PCIe Gen4 ~32 GB/s) | `T`+`G` | 750974/748287 (33-35, 62-64 tok/s); task-provided bandwidth specs; ESTIMATE derivation §8 |
| Agent loop | Prefill compute | Long-prompt prefill is compute-bound (bf16 matmul after W4 dequant) | **ESTIMATE: 4xL4 may prefill FASTER** — 4x L4 ≈ 480 TFLOPS bf16 aggregate (~390-430 effective at TP scaling) vs 5090 ≈ 210 TFLOPS dense. Compaction summarizer (14k-token prefill) and 82 s-class spikes may not shrink locally | **~0.5-1x (possible regression)** for prefill-heavy steps; decode-heavy steps still win | `T`+`G` | Task-provided specs + general L4/5090 TFLOPS figures; ESTIMATE §8; 755291 spikes |
| Agent loop | Thinking / nudges / compaction / edit loops | Identical protocol and token counts as remote; only tok/s changes | Same token magnitudes as §2; wall time scales by decode ratio (~0.5x) for decode-bound parts, ~1x for prefill-bound parts | Compaction per-event **ESTIMATE 8-25 s local** (vs 15-40 s remote) | `T`+`G` | §2 rows; HR §5/7 |
| Agent loop | run_command / docker exec overhead | Docker Desktop WSL2 backend adds a VM hop per exec; native Linux docker is leaner | **ESTIMATE 0.1-0.5 s/exec** Docker Desktop vs 0.05-0.2 s native; ~25 calls/task -> **+2-12 s/task** Docker Desktop overhead | Slightly worse than scorer's native docker; negligible vs decode | `T`+`G` | HR §6.1; ESTIMATE §8 |
| Agent loop | pytest runtimes | Import + collection + run; CPU-bound, identical code | **Same as remote: 3-15 s typical, up to ~104 s**; desktop CPU faster per-core but keep 2-vCPU quota for parity | ~0.5-1x with quota; faster without (but then non-predictive) | `T`+`G` | 748443 (1-40 s grading); 755066 (104 s checks) |
| Agent loop | E4B bonus track | E4B already fast; local deficit is edit targeting, not speed | Remote A100 panel: **1.8 min/task, 97% submit, 0/31 solved MEASURED** (750974, A100 — not 4xL4); local 5090 **ESTIMATE 1-1.5 min/task** | Faster decode; quality bottleneck unchanged | `T`+`G` | 750974; 00-synthesis constraint 14 |
| Iteration | Rebuild + re-validate zip | BCF bundle ~90-160 KB; validator + official compiler canary | **ESTIMATE <1 s zip; 1-10 s validate+compile** (C0 is CPU-only) | n/a | n/a | architecture §1 (size), §10 C0 |
| Iteration | Re-run eval | Full 129-task local run at expected 2.5-3.2 min/task (31B) ≈ 5.4-6.9 h remote-equivalent; local decode speedup -> **ESTIMATE 3.5-5.5 h** (concurrency 1, KV-limited). Use `--task-id`/`--task-ids` + frozen 68-valid masked set for iteration instead | Server-warm runs skip startup; cold runs pay 4-9 min each | ~0.6-0.8x per task vs remote | predicts `T`+`G` | architecture §8 expected case; HR §9.1 CLI flags; ESTIMATE |
| Iteration | GPU warmup per run | CUDA-graph capture + first-call kernel autotune on every cold server start | Part of the 4-9 min startup ESTIMATE; first task after start also pays cold-kernel latency **ESTIMATE +5-20 s** | TP1 capture smaller than TP4x2 (LoRA) | `G only` | 749191/744331 graph counts; ESTIMATE |
| Disk | Working-set footprint | 21.9 GB zip + 21.5 GB snapshots + extracted repos (~0.5-1 GB/fastapi-task working copy) + wheels + results/traces | **ESTIMATE 60-100 GB** total for a comfortable local rig; selective extraction (already done for `sources/`) avoids full-repo copies for CPU-only C1 work | n/a | n/a | zip_listing.txt; intro.md; extraction.log |
| Parity | Serving-path drift | Local must mirror non-streaming vLLM 0.19.1 + gemma4 parsers + wheelhouse v31; newer vLLM changes parser behavior (0.24 rewrite) and fixes bugs the scorer still has | Drift invalidates A/B: e.g. local no-hang vs scorer hang (753973), local reasoning-retained vs scorer dropped (744354) | n/a — process risk | n/a | brief implication 22; 753521; 00-synthesis constraint 18 |

**Local headline:** the 5090 removes the queue and roughly halves decode-bound agent time, but (a) KV capacity forces a shorter context or fp8 KV, (b) prefill-heavy steps may not speed up, (c) WSL2 Windows-drive crosses can make bootstrap 3-10x slower than native, and (d) every cold iteration pays a multi-minute server startup. Keep the server warm, keep data inside the WSL2 ext4 filesystem (or go native Linux), and pin the serving stack.

---

## 4. BCF-specific bottleneck table (helper costs on top of the harness)

All helper runtimes MEASURED in this repo (`design/bcf-empirical-report.md` §6, `design/skill-tests.md`) on Windows 11 / Python 3.12.10, including ~0.15 s interpreter startup; Linux container startup should be faster (report §12). Sources are selective extractions (<=18 files scanned); full-repo behavior probed with a synthetic 3,002-file repo.

| Stage | Bottleneck / cost | Mechanism | Magnitude | Budget-counted? | Evidence |
| --- | --- | --- | --- | --- | --- |
| Plan | install.py (run_skill_script, zero args) | Copies bcf.py (~70-85 KB) to `.git/bcf/`, compile sanity, skip-worktree flags; ADK runs skill scripts from a temp copy with chdir | Helper exec **~0.1-0.2 s MEASURED-class** (idempotent re-run <0.2 s, architecture §4); one LLM round trip dominates: **~3-8 s total ESTIMATE** on 4xL4 | `T`+`G` | architecture §4; skill-tests.md install tests; 747923 (temp-copy cwd lesson) |
| Plan | Statement copy (write_file) | Plan re-emits the problem statement verbatim as output tokens (first ~1,500 chars) | Statement lengths **MEASURED** (tasks/*.json, n=129): p50 418 chars, mean 803, p90 1,891, max 10,095; <=1,500 chars covers 112/129. Decode cost **ESTIMATE 4-16 s** at 33 tok/s (~120-540 tokens); E4B faster but copy-fidelity risk (trailing-s bug) | `T`+`G` | tasks/*.json computed this session; architecture §6.1; 753277 (copy bug) |
| Plan | Cold `spec` | Normalize -> cache key -> classify -> cues -> AST index -> rank -> anchors -> tests -> playbook -> render | **p50 0.219 s / p95 0.266 s / max 0.625 s MEASURED** (129 tasks, <=18 files); **3,002-file synthetic repo: 1.063 s cold / 0.172 s warm MEASURED**; guard 20 s -> partial exit 2 (never exercised on this corpus); full fastapi (~2,973 files) **ESTIMATE ~1-2 s** | `T`+`G` (helper exec inside run_command) | bcf-empirical-report.md §6; skill-tests.md runtime test; extraction.log (2,973 files) |
| Plan | Warm `spec` / re-entry cache | sha256(norm(problem)+git_HEAD+BCF_VERSION) cache; HEAD stable across edits | **max 0.235 s MEASURED** (10-sample); warm ≈ cold on small corpus because scan is ~0.1 s — cache dividend grows with repo size; re-entry = 1 call **~5-10 s ESTIMATE** vs 60-90 s unmitigated SequentialAgent restart | `T`+`G` | bcf-empirical-report.md §9; architecture §6.1; 754636 |
| Solver | `anchors <file>` | Window expansion to unique old_string; edit-time re-verification; struck-locus exclusion | **p95 0.219 s / max 0.313 s MEASURED** (129 runs); called before EVERY edit -> ~3-6 calls/task adds **~1 s helper + 3-6 LLM round trips (~25-60 s) ESTIMATE** | `T`+`G` | bcf-empirical-report.md §6; architecture §3.5 |
| Solver | `apply <file> <start> <end>` | Heredoc stdin, backup, atomic write, py_compile, auto-rollback | **<=2 s contract** (guard); typically <0.5 s ESTIMATE; E4B primary editor — removes old_string composition tokens entirely | `T`+`G` | architecture §3.5b; skill-tests.md behavioral tests |
| Solver | `check` pre-submit gate | git diff scan + protected-path scan + compile() every changed .py + scratch scan | **<=10 s contract**; ESTIMATE 1-3 s typical (few changed files) | `T`+`G` | architecture §3.6 |
| Solver | `state` / `locate` / `strike` | Restart compass (git diff --stat + state.json); re-rank; record failed locus | state <=1 s, locate <=3 s, strike ~instant (contracts); state call after each nudge/compaction **~5-10 s ESTIMATE** incl. round trip | `T`+`G` | architecture §3.1/3.4/3.7 |
| Solver | Skill-tool vs run_command overhead | `run_skill_script` re-injects skill body via load_skill and runs from temp copy; SKILL.md list re-injected per message; solver therefore uses ONLY `run_command python3 .git/bcf/bcf.py ...` | Avoided cost: SKILL.md body (~110 lines) per load_skill call **ESTIMATE 500-1,500 tokens/call** if misused; run_command path adds only docker-exec overhead (~0.1-0.5 s) | `T`+`G` | architecture §2.3/§5 (token economy); 747923; HR §6 |
| Solver | 2-strike / repair cycles | strike -> fresh anchors -> apply fallback; max 2 repair cycles after test failure | One breaker cycle ≈ 3 calls **~25-40 s ESTIMATE** on 4xL4; replaces the 51-call / 60-turn loop (~entire task budget) and E2B's 75% verbatim-retry class | `T`+`G` | architecture §6.2/6.4; 756051; 756433 |
| Solver | Verify command timeouts | `timeout_seconds` 180 (31B) / 150 (E4B) caps run_command AND grading pytest; spec test commands `timeout 60`-wrapped; `-o timeout=0` means hangs otherwise run to cap | Every design command <=60 s by construction -> 3x margin; 3 no-patch tasks hang to cap remotely (748443); BCF loop-family playbook always timeout-wraps | `T`+`G`; also bounds `OUT` grading | architecture §2.5/§3.3f; 748443; 745805 item 3 |
| Task | Per-task micro-budget (31B, 270 s cap) | plan <=3 calls 20-35 s; localize <=3 calls ~25 s; reproduce 20-30 s; edit+verify 3-6 calls 60-100 s; check+diff+submit ~20 s; reserve ~40 s | **~22-30 calls at 8-12 s/call**; time binds before the 50-call/50-turn backstops (correct ordering) | `T`+`G` | architecture §8 |
| Run | Worst-case envelope | 4.5/4.0-min caps x N + 60 s setup + 600 s startup + 1,800 s reserve | 31B: **11.17 h (N=120) / 11.99 h (N=129 marginal)**; E4B: 10.17 h / 10.92 h; decision rule: raise 31B to 5.0 only if measured setup <=35 s AND extrapolated total <=11.0 h | `G` | architecture §8 |
| Run | Helper failure degradation | T1 helper-only / T2 manual ladder; install <=2 attempts | T2 costs ~1-2 extra calls + slower localization (**ESTIMATE +30-90 s/task** vs T0); never a missing-key crash | `T`+`G` | architecture §9.1 |

---

## 5. Top-10 bottlenecks ranked by total time impact

Ranked by **total wall-clock impact per submission cycle** (submit -> score, ~120 tasks). The budget lens differs: inside the 12 h clock, decode is #1 and queue is irrelevant. Local-iteration ranking in §5.2.

| Rank | Bottleneck | Where | Total time impact (120-task cycle) | Budget? | Primary lever |
| --- | --- | --- | --- | --- | --- |
| 1 | Queue wait + one-pending gate + slot burn | Remote pre-run | **36-52 h per submission** (Nov 11); 22-46 h wall-with-queue historically; rescore paused -> lost days not recoverable | `OUT` | Submit early in day; validated fallback bundle; monitor PENDING; escalate same-day (brief implication 7) |
| 2 | Agent decode (thinking + text + tool payloads) | Remote agent loop | **~7-9 h of the 12 h** (76% of agent wall x ~9-11 h agent time); 33-35 tok/s x ~8,100 output tok/task x 120 | `T`+`G` | Token-lean prompting (no restatement, bounded reads); thinking 2048; temp 0; ~6k output cap; fewer calls via BCF spec/anchors |
| 3 | Thinking overrun + MAX_TOKENS truncation + nudge restarts | Remote agent loop | Up to **3.5x per-task time** (90->316 s); 75 timeouts/57 empty patches at 8-min cap in one study; blind SequentialAgent restarts 60-90 s each | `T`+`G` | thinking_budget 2048 explicit; output headroom; monolithic-root or cached plan re-entry (BCF: 1 call ~5-10 s); pre-agree with nudge text |
| 4 | Edit-failure loops + edit-commit latency | Remote agent loop | 43% edit failure rate; 51-call loops consume whole tasks; first-edit gap 106 vs 183 s x 120 tasks ≈ **hours of exploration tax** | `T`+`G` | Verified unique anchors; stateful 2-strike breaker; apply line-range editor; commit gate (edit after 1 targeted read) |
| 5 | Compaction summarizer + post-compaction re-orientation | Remote agent loop | ~9.2 summary calls/eval x 15-40 s ESTIMATE ≈ **2-6 min/task unmitigated**; lossy summaries cause re-reads/loops; overflow = 44/44 empty patches | `T`+`G` | Keep context <12k (narrow reads, paraphrase); spec-in-instruction + disk state (BCF); never overflow |
| 6 | Bootstrap x2 containers + teardown | Remote per-task | ~0.5 min/task MEASURED -> **~1 h/run**; design 60 s/task -> 2 h worst case; snapshot extraction + editable install dominate | `G only` | Warm pool (already on); measure per-step (C2); cannot skip — budget it |
| 7 | Prefill growth + spikes + truncation re-reads | Remote agent loop | 8 of 43 steps = 56% of budget in one trace; 82 s spikes; 1,152 duplicated lines across 4 runs | `T`+`G` | start_line/end_line always; grep first >400 lines; anchors give exact ranges; no whole-file reads |
| 8 | Phase 2 verification + hang tasks | Remote post-agent | ~1 h/run typical (0.5 min/task incl. A); **worst case 22-24 h** if tests hit 300 s caps; 3 no-patch tasks hang to cap | `OUT` (docs) | timeout_seconds 180/150; timeout-wrapped repros; never full suites |
| 9 | vLLM startup (+ LoRA OOM edge) | Remote run start | **~12.6 min MEASURED** every run; LoRA bundles: ~25 min load then OOM / 1200 s health timeout -> slot burned before task 1 | `G only` | No LoRA (BCF); budget 600-800 s; canary startup on newest wheelhouse |
| 10 | Array-parser server freeze (tail risk) | Remote any task | Expected value small (2/~830 tasks) but **impact = entire remaining run zeroed** + 12 h consumed by 480 s-per-task stalls | `T`+`G`, run-fatal | Zero array-typed tool args anywhere (BCF enforced); scalar-only schemas; local fuzz canary C3 |

### 5.1 Budget-lens ordering (inside the 12 h clock)

1. Decode → 2. Thinking/truncation/nudges → 3. Edit loops/commit latency → 4. Compaction → 5. Prefill/re-reads → 6. Bootstrap (G only) → 7. Startup (G only) → 8. LoRA tax (if used) → 9. Retry backoff → 10. Parser freeze (tail). Queue and Phase 2 do not consume the clock (docs reading; exact enforcement staff-unanswered).

### 5.2 Local-iteration ranking (5090)

1. **Cold vLLM startup per iteration** (4-9 min ESTIMATE) — amortize: keep server warm, batch task reruns via `--task-ids`.
2. **Decode** (still ~60-75% of agent wall even at 50-80 tok/s ESTIMATE) — same token-lean levers.
3. **WSL2 Windows-drive crosses** (bootstrap 3-10x slower ESTIMATE) — keep snapshots/workspaces in ext4 VHDX or native Linux.
4. **KV ceiling** (~10-24k tokens ESTIMATE) — forces max_model_len < 32,768 or fp8 KV; concurrency 1 for 31B; document parity deviation.
5. **Full-eval rerun cost** (3.5-5.5 h ESTIMATE for 129 tasks) — iterate on the frozen masked 68-valid set + `--task-id`; full runs only at C6 gates.
6. **Disk staging** (21.9 GB zip / 21.5 GB snapshots, one-time) — selective extraction for CPU work already done.
7. **pytest/import time** (unchanged, CPU-bound) — keep 2-vCPU quota for predictive numbers.
8. **Serving-path drift risk** (unbounded debugging time if pinned wheel lacks sm_120 or behaves differently) — verify first, before any A/B.

---

## 6. Measurement plan (how to time each stage locally)

All artifacts land in `--results-dir` (HR §9.2): `summary.json`, `task_results.jsonl`, `patches/`, `test_outputs/`, `traces/trace_<iid>.json` (ATIF steps, thoughts, tool calls, token usage), `logs/<iid>.log`.

| # | Stage to time | Method | Artifact / signal | Pass / use |
| --- | --- | --- | --- | --- |
| M1 | vLLM startup phases | Wall-clock from process spawn to first `/health` 200; parse server log for weight-load, KV profiling, graph-capture lines; repeat cold vs warm | Server log timestamps; `nvidia-smi` memory timeline | Establish local startup constant for §8 envelope; compare to remote 12.6 min |
| M2 | KV ceiling / max_model_len | Start vLLM at util 0.90 with target max_model_len; read reported KV token count; retry with fp8 KV | vLLM startup log "GPU KV cache size" | Confirm ~10-24k ESTIMATE; pick parity-preserving context config |
| M3 | Container bootstrap per step | Wrap/time the 7 `container_setup.py` steps (or diff timestamps: `task_start_time` at context creation vs `agent_start_time` after setup — HR §7.1 TIP); `docker events` for create/start/stop | Per-step seconds; setup delta per task | C2 gate: setup <=60 s median; identify dominant step (expect extraction + editable install) |
| M4 | Filesystem cross penalty | Benchmark `tar -xzf` of one 214 MB snapshot (e.g. fastapi_15800.tgz, 335 MB) into ext4 vs `/mnt/d` bind mount; time `git add -A && git commit`; time 100 `docker exec true` round trips | Seconds per extract/commit/exec | Decide WSL2-ext4 vs native; quantify 9p penalty (ESTIMATE 3-10x) |
| M5 | Decode vs prefill decomposition | Regress per-step wall time on completion tokens: dt = a + b·ct (755291 method, r²=0.9996 there); flag high-prompt-delta outliers as prefill spikes; cross-check vLLM `/metrics` TTFT/TPOT | `traces/trace_<iid>.json` step timestamps + token usage | Local tok/s constant; verify 50-80 tok/s ESTIMATE; find >60 s steps (prompt bugs) |
| M6 | Agent phase boundaries | `get_status` (free, uncounted) at start / after first edit / before check: `agent_elapsed_seconds`, `time_seconds_remaining`, `tool_calls_used` | Trace tool results | Validate architecture §8 micro-budget (plan 20-35 s, first edit by ~60-100 s) |
| M7 | Compaction frequency + cost | Count summarizer LLM calls in trace (753225 method: 4,248/463); time each; log prompt-token crossings of 14,336 | Trace events; token counters | BCF target: ~0 compactions on typical tasks; measure re-orientation tax after any summary |
| M8 | Nudge / restart / truncation counts | Count `finish_reason` MAX_TOKENS/LENGTH, nudge injections, plan re-entries; assert BCF re-entry = 1 call (31B) / <=3 (E4B), byte-identical spec | Trace; C2-3 forced-restart drill | Restart tax <=15 s (architecture C2-3) |
| M9 | Edit reliability + breaker | Count edit_file failures, identical-call streaks, strike/anchors/apply sequences; replay recorded failed edits CPU-cheap (E2B funnel style) | Trace; C1 edit-replay | Zero 3rd identical calls; anchor uniqueness >=90% |
| M10 | pytest cost | `pytest --durations=10` on spec test commands; `python -X importtime -c "import fastapi"` (and rich/requests); Phase 2 `test_outputs/<iid>.log` + JUnit XML timestamps | Durations tables | Confirm 3-15 s typical; find import-time hogs; verify timeout wrapping |
| M11 | Phase 2 wall | Time Container B bootstrap + apply + pytest separately from `task_results.jsonl` durations vs agent elapsed | Results JSONL | Quantify the `OUT`-of-budget wall add (~0.5 min/task remote) |
| M12 | Local->scorer calibration | Seconds-per-million-model-tokens (prompt+completion incl. repeated context) on local sequential runs vs Kaggle 4xL4 (747857 method; B40 factor was 1.2547 — rederive for 5090, never under concurrent load) | Token totals + wall from traces | Convert local caps to Kaggle-equivalent minutes before C6 promotion |
| M13 | Parser-freeze fuzz | Subprocess + hard timeout fuzz of attached schemas with bracket-heavy scalar payloads (>=5,000 strings; 74/60,000 hang class) | C3 canary output | Zero hangs before any submission |
| M14 | Full-run extrapolation | C2 telemetry (per-task wall, setup, calls, turns, compaction, restarts) -> extrapolate 120-task total; C6 full masked-set runs x2 repeats | §8 decision rule inputs | Ship caps 4.5/4.0 only if extrapolated <=11.0 h (31B) / <=10.5 h (E4B) |
| M15 | Reasoning-drop parity | Tokenize-level repro of reasoning vs reasoning_content survival on pinned v31; A/B 4 canary tasks | C4 output | Solve-set delta <=1 task (retention-agnostic design) |

**Instrumentation discipline:** every local run pins wheelhouse v31 / vLLM 0.19.1 / swegemma 0.2.11 / adk-submission 0.2.13 / google-adk 1.36.1 / Python 3.12.13 host + python:3.13-slim sandbox (brief implication 22; Dockerfile.sandbox). Record the pin in each results dir. Single-run deltas <4 tasks are noise (sigma ~2 tasks/58; 10-13% per-task flip — 753524/750907/757588).

---

## 7. Cross-cutting notes and gotchas

1. **Setup is inside the global clock but outside the agent timer** (HR §7.1 TIP + 752017 docs + 745805 staff). Never "save time" by shrinking the agent cap while ignoring bootstrap: at 60 s/task, bootstrap alone is 2 h of the 12 h.
2. **`timeout_seconds` is double-edged**: it caps agent commands AND grading pytest (745805 item 3; 748443 code-read). Too small fails correct patches on slow tests; too large lets hang tasks eat hours. BCF's 180/150 sits in the measured-safe 150-300 band.
3. **Phase 2 exclusion is a docs reading, not a staff-confirmed enforcement boundary** (752017/748618 unanswered; two >12 h runs scored, one timed out). Plan as if everything except queue counts; keep >=1-2 h headroom.
4. **12B is not a speed lever**: decode ~1.9x but ~1.8x more output tokens/call -> worse per-call latency (11.5 vs 10.3 s) and an 8-min 12B LB run blew 12 h for zero (750974). E4B is fast (1.8 min/task) but 0/31 — its bottleneck is edit targeting, not wall clock.
5. **The 17.25 tok/s figure is an effective rate from four 12B fastapi runs with hardware unstated in PRIMARY** (755291; the "4xL4" gloss is secondary-source drift — 00-synthesis contradiction 30). Use 33-35 tok/s (750974/748287) for 31B-on-4xL4 math.
6. **Local KV ceiling changes compaction/overflow dynamics** vs the scorer's 32,768-token window. BCF's <12k steady-state context makes this tolerable, but any local A/B that relies on long-context behavior is non-predictive.
7. **Warm pool wipes `/workspace` AND `/tmp` between tasks** (HR §4.1): BCF installs once per task; nothing persists across tasks; `.git/bcf/` state survives only within a task (incl. nudge restarts).
8. **Docker Desktop vs native**: container-internal I/O is near-native ext4 in both cases (WSL2 VHDX); the penalty is specifically Windows-drive bind mounts (9p/drvfs) and, secondarily, per-exec VM hops. Native Linux removes both; ESTIMATE, to be measured by M4.

---

## 8. ESTIMATE register (assumptions and derivations)

Every ESTIMATE used above, with reasoning. None of these are local GPU measurements yet — M1-M14 exist to replace them.

| # | Estimate | Value | Reasoning |
| --- | --- | --- | --- |
| E1 | 5090 decode, 31B W4A16 TP1 | 50-80 tok/s | Weights ~17 GB / 1.79 TB/s ≈ 9.5 ms/token ≈ 105 tok/s theoretical; 50-70% real-world efficiency (W4A16 dequant, kernel launch, sampling). Cross-check: 4xL4 theoretical 4.25 GB shard / 300 GB/s ≈ 70 tok/s vs 33-35 measured -> ~50% TP efficiency; TP1 removes PCIe all-reduce (L4: no NVLink), so 5090 efficiency should be higher, but desktop GDDR7 latency + dequant keep it below theoretical |
| E2 | 5090 vs 4xL4 decode delta | ~1.5-2.3x | E1 / 33-35 tok/s. Bandwidth ratio alone (1.79 / 1.2 aggregate) = 1.49x; TP1 overhead removal pushes above it |
| E3 | Prefill compute delta | 4xL4 possibly 1.5-2x faster | L4 ~121 TFLOPS bf16 dense x4 ≈ 484 aggregate (~390-430 at 80-90% TP scaling for compute-bound prefill) vs 5090 ~210 TFLOPS dense FP16. General spec figures; mark for M5 verification. Consequence: compaction/prefill-spike steps may not shrink locally |
| E4 | 31B KV per token | ~0.94 MiB total | whoami (744331): 16 KV heads x 256 head_dim x 60 layers x bf16 x (K+V) = 983,040 B; matches his 246 kB/GPU at TP4 |
| E5 | 5090 KV capacity | ~10-12k tok bf16; ~20-24k fp8 | 32 GB x 0.90 util ≈ 28.8 GB - ~17 GB weights - ~2-3 GB graphs/activations ≈ 9-12 GB KV; / 0.94 MiB (or 0.47 MiB fp8). Implies max_model_len 32,768 infeasible without fp8 + reduced len; verify M2 |
| E6 | Local vLLM cold startup | 4-9 min | Remote 12.6 min (746250) includes TP4 coordination; TP1 single-GPU load of 16-18 GB from NVMe (~6-9 s pure read) + profiling + graph capture; assume capture/profiling dominate at several minutes. Warm-server iterations skip it |
| E7 | Snapshot extraction, native/ext4 | 2-5 s per container | 214 MB median tgz; gzip ~100-200 MB/s single-thread (pigz available in image); ~3k file creates on NVMe ext4 ~0.3-1 s; .git objects add ~1 s |
| E8 | Snapshot extraction across 9p (`/mnt/d`) | 10-30 s per container | Per-file 9p latency ~1-5 ms x ~3k files + decompression; 3-10x native. Docker Desktop Windows-drive mounts are the slow path; WSL2-internal ext4 is not |
| E9 | Editable install | 3-10 s | pip startup + build-backend import (pdm-backend/setuptools) + editable wheel build, no deps resolution (`--no-deps --no-build-isolation`) |
| E10 | Test-dep stream + remaining bootstrap | 2-8 s + 1-4 s | docker cp/tar of cached site-packages (tens-hundreds MB); fast-path .pth injection <0.05 s (docstring); baseline git commit of ~3k files 1-3 s on 2 vCPU |
| E11 | Compaction summarizer call | 15-40 s remote; 8-25 s local | Prefill up to ~14,336 tok at ~1,110 tok/s aggregate ≈ 13 s + summary decode (few hundred tok incl. propagated thinking) at 33-35 tok/s ≈ 5-25 s. Frequency 9.2/eval MEASURED (753225) |
| E12 | MAX_TOKENS wasted generation | up to ~3 min | 6,144 output cap / 33 tok/s ≈ 186 s, plus nudge round trip |
| E13 | Statement copy decode | 4-16 s remote | p50 418 chars ≈ 120 tok, p90 1,891 ≈ 540 tok (chars/3.5); / 33 tok/s. Lengths MEASURED from tasks/*.json |
| E14 | docker exec round trip | 0.05-0.2 s native; 0.1-0.5 s Docker Desktop | Container exec + bash startup; VM hop adds latency. x ~25 calls/task = 2-12 s/task Desktop tax |
| E15 | Local full-eval wall | 3.5-5.5 h (129 tasks, 31B) | Architecture expected 2.5-3.2 min/task remote-equivalent x decode delta ~0.6-0.8, concurrency 1 (KV), + bootstrap; server warm |
| E16 | Local disk working set | 60-100 GB | 21.9 zip + 21.5 snapshots + extracted repos + wheels + images + results/traces |
| E17 | Retry backoff worst case | ~62 s + jitter | 2+4+8+16+32 (5 retries, 2x, cap 60) per HR §7.2 |
| E18 | Reasoning-drop re-orientation | 10-30 s/task | One extra state read + paraphrase round trip at 8-12 s/call |
| E19 | T2 manual-degradation tax | +30-90 s/task | ~1-2 extra calls + grep-based localization replacing ~1 s helper scans (architecture §9.1) |
| E20 | CUDA-on-WSL2 overhead | 2-5% | GPU passthrough is near-native for large kernels; small-kernel launch latency slightly higher. General virtualization knowledge; verify M5 |

---

## 9. Sources (all local)

**Harness contract:** `input/kagglecomp/kagglecomp_data_package/HARNESS_README.md` §3.1 (4xL4, util 0.80, 32,768, 4 GiB/2 vCPU), §4 (two-phase lifecycle, 7 bootstrap steps, warm pool), §5 (prompt, nudges), §6 (tools, truncation caps), §7 (budgets, compaction 14,336/interval 5/retention 5, retries), §8 (patch extraction, 4-pass apply, anti-tampering, pytest flags), §9 (CLI, results artifacts), §10 (gotchas).
**Docker/bootstrap:** `scratch/bcf-hardening-2026-11-11/docker/docker_Dockerfile.sandbox` + `docker_Dockerfile.public` (python:3.13-slim, pigz, build backends, wheels cache), `sandbox_setup.py` (fast-path <0.05 s, editable install, wheel dedup).
**Intel briefs:** `input/kagglecomp/intel_20261111/00-intel-brief-2026-11-11.md` §3 (harness status), §5 (leaderboard/noise), §6 implications 7/14/20/22; `input/kagglecomp/intel_20261031/00-intel-brief-2026-10-31.md` (752017: 8.9-11.9 h runs, +5% blowup, setup-in/validation-out; queue complaints 753084/753989/754000/754023).
**Syntheses:** `scratch/bcf-2026-11-11/intel/00-synthesis.md` (constraints 3/7/9/10/11; contradictions 4/5/11/30); `intel/budget-sampling.md` (12 h contract table; 755291 trace audit; 755066 settings; 750974 model-size panel; 747914 thinking; 746250/747857 calibration; 748443 grading); `intel/harness-bugs.md` (nudge restart, compaction, parser freeze, edit loops, KV); `intel/skills-lora.md` (LoRA tax table, skill setup, queue realism).
**PRIMARY thread dumps** (via the syntheses; `scratch/bcf-2026-11-11/intel_texts/`): 743063, 745805, 746250, 747857, 748443 (22-46 h title + ref table), 747519, 743683, 757993, 755291, 755066, 750974 (SECONDARY digest), 752848, 754636, 754783, 753225 (SECONDARY), 744692, 756051, 747923, 744272, 753973, 745138, 746336, 749191, 744331, 755677, 747914, 748168, 747696, 757893, 756433, 756400, 757588, 750907.
**BCF design + measurements:** `scratch/bcf-2026-11-11/design/architecture.md` §2.5/§3/§8/§9.1/§10 (caps, guards, budget math, canaries); `design/bcf-empirical-report.md` §6/§9/§12 (spec/anchors/warm runtimes, corpus caveat); `design/skill-tests.md` (3,002-file repo: 1.063 s cold / 0.172 s warm).
**Dataset measurements (this repo):** `scratch/bcf-2026-11-11/zip_listing.txt` (computed: 129 snapshots, min 1.6 / median 214.0 / mean 166.6 / max 334.9 MB, sum 21.50 GB; zip on disk 21,929,289,087 bytes); `extraction.log` (repo file counts: fastapi ~2,973, rich 553, requests ~128); `intro.md` (selective extraction method); `tasks/*.json` (statement lengths: p50 418 / mean 803 / p90 1,891 / max 10,095 chars, computed this session).

*End of 02a bottleneck inventory.*

---

# PART B — BCF Tuning Levers & Impact-Effort Ranking (subtask 2b)

**Date:** 2026-11-11 · **Role:** tuning analyst (local only, no web; read-only — no brain file modified)
**Scope:** every adjustable juncture in the current two-track BCF brain, ranked by impact/effort.
**Trees analyzed (read in full):**
- 31B main: `d:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_alibaba/deliverables/2026-11-11-bcf-gemma4-brain/02-bcf-brain-31b/submission/`
- E4B bonus: `d:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_alibaba/deliverables/2026-11-11-bcf-gemma4-brain/03-bcf-brain-e4b/submission/`

**Build identity (verified this pass):** `bcf.py` = 72,626 bytes / 1,714 lines, sha256 `b6ac6a072f2b045352d07fc149f7b9eed7d24913bfd938c779311607bcfb93cc`, **byte-identical both tracks** (N2 satisfied; the divergence flagged in e4b-viability-review §5.C was reconciled by compliance F9 + empirical final). `install.py` sha `14a9d916…3d540` identical. Per-track differing files: both `sub_agents/*.yaml` (model line only), `configs/sampling.yaml`, `eval_config.yaml`, both `prompts/*.md`. E4B `solver.md` is 4,685 bytes (grew from 4,457 after the viability review's applied prompt fix).

**Evidence base (all local, read in full):** `design/architecture.md` v1.0 (§§2–10, N1–N6, C0–C7); `design/bcf-empirical-report.md` (129-task measurement + 4 misses); `design/compliance-review.md` (F1–F9 fixed, O1–O10 open); `design/e4b-viability-review.md` (§6 proposed-not-applied engine levers); `design/integration-report.md`; `taxonomy.md` (129 tasks, 10 families, distributions + insights 1–10); intel brief §6 (B1–B22); `intel/00-synthesis.md` §3 (S1–S24); `HARNESS_README.md` §2.4 + §7.

---

## 0. Method, scoring, and the failure-class map

**Impact** — H = attacks a *measured dominant* failure class with quantified headroom, or prevents a RUN-radius zero; M = attacks a real but secondary/conditional class; L = marginal, cosmetic, or unmeasured.
**Effort** — S = config/prompt tweak; M = prompt rework or small code change (engine changes require both-track byte-identical sync + C1 re-test per N2); L = engine/infra change requiring full re-test.
**Impact/effort score** = impact(H=3, M=2, L=1) / effort(S=1, M=2, L=3). Ties broken by evidence directness, then blast radius.
**Risk** — what could regress + the harness constraint it must respect. **Validation** — the canary/eval that proves it (architecture §10). **Track** — 31B / E4B / both.

**Governing discipline (applies to every lever):** no promotion without paired, replicated, masked-set evidence — win-both rule, single-run deltas <4 tasks are noise (sigma ≈2 tasks/58; B16/S19). Never A/B on raw 129 (5 empty-pass tasks inject free-point noise; B15). Engine edits must re-mirror both tracks and re-run validator + C1 (N2, compliance F9). Configs freeze only on win-both evidence (architecture §11).

### Failure class → lever map (the score mechanisms)

| Failure class (evidence) | Radius | Levers that attack it |
| --- | --- | --- |
| 12h whole-submission kill at N=129 (O7: 43,170s = 11.99h marginal; S3) | RUN | Y4 (cap decision rule), Y5/Y6 (backstops) |
| Compile-time rejection / parser freeze / E4B serving format (O4, O5, 752128, 753973) | RUN | V4a (C0), V4b (C3/C5), Y8 (skills path fallback) |
| Edit targeting: anchor/Target = def line, not edit site (e4b §3.2 smoke; wrong-file 13/31 S14) | TASK | E1 (_family_lines), E2 (spec edit lines), E5 (locate weights) |
| Fix authoring / confidently-wrong-but-compiling fix (e4b §3.1 probe: directs→direct passes apply+check; 0/31 S14) | TASK (score ceiling) | E3 (semantic smoke), Y14 (E4B thinking arm); residual = model capability (e4b §7.1) |
| Edit mechanics: stale/overlapping windows, 2-strike loop (O9; 756051 51-call loop) | TASK | E4 (strike window exclusion), E8 (window size); anchors/apply already hardened |
| Budget/latency: planner thinking tax (O2 10–30s/restart), first-edit gap 106s vs 183s (S11), restart tax (O1) | TASK/TAX | Y1, Y2, P1, E6, E7, P15 |
| Localization at real-repo scale (empirical §2: ≤18 files scanned, upper bound; full repo unmeasured) | TASK | E6, E7, E19, V3, V7 |
| Classification/playbook mis-selection (family top-1 56.6%, api-contract 4/23; empirical §4) | TASK (advisory) | E11, E12 (OOD-gated only) |
| Selection noise / public→hidden transfer (B16/B17; 10–13% flip) | decision quality | V1, V2, V3, V7 |
| Token economy / compaction trigger 14,336 (S7/S10; skill list re-injected per message) | TAX | S1, read limits (keep), paraphrase (keep) |

---

## A. YAML / config layer

Current values — 31B `configs/sampling.yaml`: temp 0.2, top_p 0.95, top_k 64, max_output_tokens 6144, seed 7, thinking_budget 2048, include_thoughts true. E4B: temp 0.0, top_p 0.95, top_k 64, max_output_tokens 4096, seed 7, thinking_budget 0, include_thoughts true. Both agents per track share the one `!include ../configs/sampling.yaml`. `eval_config.yaml` 31B: timeout_seconds 180 / max_tool_calls 50 / max_time_minutes 4.5 / max_turns 50. E4B: 150 / 40 / 4.0 / 40.

| ID | Location (file · field) | Current | Proposed adjustment | Score mechanism / evidence | Impact | Effort | Risk / harness constraint | Validation | Track |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Y1 | `sub_agents/bcf_plan.yaml` · generate_content_config.thinking_config.thinking_budget (inline the planner config; solver keeps !include) | 2048 (shared N1) | Planner-only 0 (or 256); solver stays 2048 | Removes pure decode tax on the mechanical echo stage: 2048 tok ≈ up to ~60s at 33 tok/s, realistically 10–30s **per nudge restart** (up to 3) + first entry; buys solver wall-time under the 270s cap. O2 quantifies; S8 requires explicit pinned thinking, NOT 2048 on a mechanical stage | M | S | N1 is a frozen normalization → this is a pre-registered A/B arm, not an unambiguous fix (O2). Planner echo fidelity is mechanical (low risk). Must keep include_thoughts true + explicit budget (S8); inline config must pass C0 schema lint | C2-3 restart drill (tax ≤15s, byte-identical spec) + C6 paired win-both | 31B |
| Y2 | `configs/sampling.yaml` · temperature | 0.2 | 0.0 [ARM N4] | Decode speed at equal score (755066, n=376) → earlier first edit, lower restart tax; not a direct quality gain. Pre-registered arm N4; S9 says sweep per-harness, not transferable (synthesis contradiction 23) | M | S | 0.2 is the organizer starter with proven tool-call syntax reliability on this exact stack; 0.0 may shift formatting (unmeasured here). Respect temp ≥0 (HR §2.4) | C6 paired win-both on masked set; C0 syntax lint | 31B |
| Y3 | `configs/sampling.yaml` · max_output_tokens | 6144 | 8192 [ARM N4] **only if** truncation nudges appear | Prevents truncated-`<\|tool_call>` nudge class (HR gotcha #1) when 2048 thinking + visible edit exceed allowance. Default DON'T: 8k shows no dependable gain, real peaks ~3.7k (S9); thinking shares the allowance | M (conditional) | S | Raising without truncation evidence wastes headroom and can lengthen runaway turns; bounded by max_model_len 32768 (HR §2.4) | C2 telemetry (MAX_TOKENS nudge count) gates the arm; C6 if promoted | 31B |
| Y4 | `eval_config.yaml` · max_time_minutes (all four fields explicit) | 4.5 (31B) / 4.0 (E4B) | Apply architecture §8 decision rule on C2 telemetry: lower 31B→4.0 if setup ≥65s/task OR N≥125; raise→5.0 ONLY if setup ≤35s AND extrapolated 120-task total ≤11.0h | Prevents the 12h all-or-zero RUN kill. O7: 31B N=129 worst case 43,170s = 11.99h **without** the 1,800s reserve → marginal; defaults = NO limit (S3, HR §7.1) so this file is load-bearing | H | S | Lowering the cap trades per-task solve probability for RUN safety; raising without measured setup risks the kill. Setup is outside the agent timer but inside the 12h clock (HR §7.1 TIP) | C2 setup telemetry + C6 wall-clock extrapolation ≤11.0h (31B) / ≤10.5h (E4B) | both |
| Y5 | `eval_config.yaml` · timeout_seconds | 180 / 150 | Leave (tunable within 150–300 band) | Bounds any single command AND grading pytest (3 no-patch tasks hang to cap; S3). Every design command ≤60s → 3x margin already | L | S | Lowering risks killing slow legitimate tests; raising eats worst-case budget. Stay in 150–300 band (S3) | C1 hang-task drill (rich_3480/4006/3772) | both |
| Y6 | `eval_config.yaml` · max_tool_calls / max_turns | 50/50 (31B), 40/40 (E4B) | Leave | Runaway backstops, not the primary bound. 31B time binds first (correct); E4B turns bind on call-heavy tasks (correct — E4B's failure mode is loops, O1). Worst-case E4B 35–40 turns vs 40 cap is intentionally tight | L | S | Raising E4B turns re-opens the fast-loop surface the 2-strike breaker closes; submit_patch/get_status are free and don't count | C2 telemetry (calls/turns per task) | both |
| Y7 | `sub_agents/bcf_plan.yaml` · include_contents | none | Fallback→default **only if** C2-4 fails | Restart hedge: keeps planner ~1.2k tokens vs replaying 10–12k shared history (754636). O3: under `none`, whether ADK 1.36 passes the current user message + whether a system-only array renders on the Gemma template is unverified; if the template requires a user turn, every task fails at plan | H (conditional gate) | S | Switching to default accepts the restart duplication tax (10–12k tokens/re-entry → compaction pressure). Instruction is self-sufficient via {problem_description} so content always reaches the planner | C2-4 hard gate (spec correct on first entry) before any slot | both |
| Y8 | `sub_agents/bcf_plan.yaml` · skills path | `../skills/bcf-spec` (file-relative) | Fallback→`skills/bcf-spec` (root-relative) **only if** C0 compiler resolves root-relative | O4: harness resolution base undocumented; if root-relative, `../` escapes root → compile-time RUN rejection. One-line change | H (conditional gate) | S | Must re-validate after the switch; confirm injected skill-tool names/schemas in the C0 trace | C0 official compile_submission canary | both |
| Y9 | `sub_agents/bcf_plan.yaml` · tools; `solver.yaml` · tools | plan [run_command, write_file]; solver six scalar core tools | Leave. (Plan read_file deliberately absent; solver get_code_subgraph deliberately absent) | Minimal parser-hang surface (S5). Adding read_file to plan invites code exploration the stage forbids; graph tools have list[str] arg = freeze trigger + no end-to-end benefit (McNemar p=0.69, architecture §1) | L | S | Any array-typed tool entry is RUN-radius (753973). Six scalar core tools is the verified surface | C0 schema lint + C3 fuzz | both |
| Y10 | both sub_agents · disallow_transfer_to_parent / to_peers | true / true | Leave (do NOT tune) | Deterministic SequentialAgent ordering; enabling LLM-driven transfer re-opens routing loops the fixed hierarchy avoids (architecture §2.2) | L | S | Changing risks nudge-routing pathology (754636) | C2-3 | both |
| Y11 | `configs/sampling.yaml` · seed | 7 | Leave (reproducibility anchor) | Explicit seed transmits on wheelhouse v28+ (S8); required for paired A/B selection. Not a performance lever | L | S | Changing the seed breaks paired-repeat comparability (V2) | — | both |
| Y12 | `configs/sampling.yaml` · top_p / top_k | 0.95 / 64 | Leave (do NOT tune) | top_p 0.5–0.8 hurt (S9); top_k 64 is the model-card default. No evidence for change | L | S | Lowering top_p measurably hurts; respect 0≤top_p≤1, top_k≥1 (HR §2.4) | — | both |
| Y13 | `configs/sampling.yaml` · include_thoughts | true | Leave (do NOT tune to false) | Thought summaries OFF collapses solves 48→34–35/129 (S8/N1); on adk-submission ≥0.2.13 include_thoughts:false no longer disables thinking (intended semantics change). budget 0 is the only reliable off switch | L | S | false is both ineffective (off) and harmful (summaries). Never thinking_level (maps to reasoning_effort on vLLM, HR §2.4) | — | both |
| Y14 | E4B `configs/sampling.yaml` · thinking_budget | 0 | Keep a 2048 arm ready; promote only on C5+C6 evidence | O6 contested: 31B thinking-off collapsed 48→23 (S11), one team's thinking-off 5-min scored 0.05 (B17); but E4B's measured deficit is edit targeting/copy fidelity, not reasoning (S14), and thinking shares the 4096 allowance. Could aid fix authoring (the dominant gap) or squeeze output → truncation | M (contested) | S | HF#26: template may ignore enable_thinking → C5 must observe effective thinking. Output-allowance squeeze risk; keep include_thoughts true | C5 serving canary (thinking on/off observed) + C6 paired | E4B |

---

## B. Prompt layer

31B `prompts/bcf_plan.md` (2,214 B) / `solver.md` (4,943 B); E4B `bcf_plan.md` (2,118 B) / `solver.md` (4,685 B). Trust levels: 31B advisor (may overrule with evidence), E4B foreman (follow numbered Steps). Placeholders sanctioned: plan {problem_description}; solver {problem_description}+{bcf_spec}.

| ID | Location (file · section) | Current | Proposed adjustment | Score mechanism / evidence | Impact | Effort | Risk / harness constraint | Validation | Track |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P1 | `bcf_plan.md` · Step 2 statement copy | first ~1,500 chars | 3,000-char arm | Recovers decisive evidence sitting deep (long tracebacks): _TRACE_RE path cues are weight-3.0 near-oracle; truncation loses them → weaker localization. O8 recommends a 3,000 arm. Solver still gets the FULL statement, so loss is confined to deterministic cue extraction | M (frequency unmeasured; public cues concentrate at top) | S | Larger write_file payload = higher E4B copy-corruption risk → 31B-only arm. Keep verbatim/no-reformat rule; cache normalize absorbs drift | C1 re-run (hit@k delta, CPU-cheap) + C6 arm | 31B |
| P2 | `solver.md` · Commit gate | max 3 candidate reads; edit after ONE read if mechanism statable | 2-read arm (optional) | Attacks first-edit latency (106s solved vs 183s failed; ~10 of 28 calls reading, S11). BUT prompt rules to edit earlier are "mostly ignored" (S11) and hard commit forces ~40% wrong-place edits (747980) | L | S | Weak-evidence prompt-only class (756433 for 2B). Tightening risks wrong-place edits; keep the soft verification-triggered gate, never a hard call-N rule | C6 paired; C2 first-edit-call telemetry | 31B |
| P3 | `solver.md` · Edit loop read limits | ~20 around anchor, max 60/read (31B); max 40 (E4B); grep first >400 lines | Leave | Token-lean contract (S10): a 150-line/10k read ≈2.5–3k tokens; 3–4 such reads cross the 14,336 compaction trigger. read_file silently caps at 150 lines/10k chars (HR §7.1). Current values are design-optimal | L | S | Larger reads → earlier compaction + restatement tax (1,788 tok/104s per incident, S10); smaller reads → more calls. Keep is_truncated awareness | C2-5 compaction drill | both |
| P4 | `solver.md` · anchor copy cap | max 15 lines old_string (31B) / 10 (E4B) | Leave (engine windows ≤7 anyway) | Engine MAX_WINDOW=7 means emitted unique windows never exceed 7 lines; the prompt cap is slack, not binding. Aligning 15→7 is cosmetic | L | S | None material; keep "copy VERBATIM, never from memory" (copy-fidelity, S14) | C1 anchor uniqueness | both |
| P5 | `solver.md` · Two-strike circuit breaker | 2 identical failed edits → strike + change strategy; never a 3rd | Leave wording; engine lever is E4 | Stateful breaker makes the 51-identical-call loop + E2B 75% verbatim-retry class structurally unreachable (architecture §6.2.4, 756433). FileEditError = re-localize, not retry (recovery collapses with attempts) | L | S | Prompt-only breaker is weak; the stateful `strike` is the real guard. Keep | C2-6 stale-anchor drill | both |
| P6 | `solver.md` · Verify | max 2 repair cycles | Leave (do NOT raise) | Recovery probability collapses with attempts (ACI 23.4% class, architecture §6.2). More cycles burn the cap on low-probability retries | L | S | Raising re-opens the loop surface; ignore pre-existing unrelated failures (keep) | C2 | both |
| P7 | `solver.md` · Budget awareness | 50%/80% fractions (31B); first edit ~90s, finalize ~3.5min (E4B) | Leave; do NOT add exhortations | Prompt-only behavioral class 756433 found ineffective (11 interventions, zero incremental solves). The structural caps (Y4/Y6) are the real backstop. e4b §6 explicitly rejects more budget exhortations | L | S | Adding rules wastes tokens and doesn't move 2B-class reliability (756433). get_status is free — keep checkpoints | C2 telemetry | both |
| P8 | `solver.md` · Verify timeout wrapping | timeout-wrapped targeted tests; never bare pytest | Leave | Hang bugs (rich_4006/3480/3772) need subprocess timeout; spec Verify commands already carry `timeout 60`, repro `timeout 10`. Full suites hang to the cap (architecture §3.3f) | L | S | Bare pytest = TASK zero on hang tasks. Keep targeted-only | C1 hang drill | both |
| P9 | `solver.md` · Context hygiene | paraphrase EVERY important tool result into ONE sentence; never restate file contents | Leave (load-bearing) | Only assistant text survives LlmEventSummarizer; tool results dropped permanently at ~14,336 (S7/B11). 44/44 overflowed sessions lost their patch (756336) | L | S | Removing the rule re-opens compaction-amnesia. Summarizer samples temp 1.0 regardless of config → disk state canonical | C2-5 | both |
| P10 | `solver.md` · Turn discipline | ALWAYS end turns with a tool call until submit_patch | Leave (load-bearing) | Text-only turn ×3 consecutive nudges terminates the session (754783/756336). submit_patch free → call it rather than explaining | L | S | Removing risks premature termination. Keep MAX_TOKENS-nudge pre-agreement (next call immediately, no re-reason) | C2-3 | both |
| P11 | `solver.md` · Sparse/URL-only | never fetch URLs; reconstruct from repo + spec subsystem candidates | Leave (load-bearing) | 33/129 sparse (architecture census); offline sandbox network_mode=none; hints empty 129/129 (B18). Engine sparse tiers + subsystem map are the deterministic support | L | S | Fetching is impossible (offline) and wastes budget. Keep tests-as-spec doctrine | C1 sparse recall + C2 rich_3064 | both |
| P12 | `bcf_plan.md` · Failure ladder / fallback brief | fixed BCF-TOOLS-UNAVAILABLE brief; always end with spec text | Leave | Guarantees {bcf_spec} never a missing key (graft #12/#22); T2 manual tier is fully sufficient (architecture §9.1). Enriching the brief adds tokens for marginal gain | L | S | Must keep guaranteed-final-text (O10). Keep | C2-2 skill-disable injection | both |
| P13 | E4B `solver.md` · Plan sentence | ONE "Plan: …" sentence every message | Leave (A/B only if C5 shows format failures) | Thinking substitute (budget 0) + compaction hedge (e4b §3.6). A per-turn tax and another format to get wrong, but removing it loses the visible-state channel | L | M | Removing re-opens reasoning-drop exposure (S21). Contested; keep unless C5 evidence | C5 + C4 reasoning-drop parity | E4B |
| P14 | E4B `solver.md` · apply heredoc example | copyable 4-line heredoc example | A/B: prose-only description | 745143: prose command descriptions beat copyable examples (31%→5% malformed) — but that finding was about command NAMES; the command name here is prose, the example is payload shape (e4b §3.4). Unmeasured tension | L | S | Removing the example may worsen heredoc formatting (a real E4B failure); keeping it may invite copy errors. Contested | C5 + C6 E4B arm | E4B |
| P15 | `bcf_plan.md` · Steps 2+3 | write_file problem.md then run_command spec | 31B MAY fold into one heredoc-stdin run_command (pre-registered, architecture §6.1) | Saves one plan call (~8–12s) on first entry; removes the write_file copy step. graft #9 chose write_file as the lowest-risk E4B payload, so this is 31B-only | L | M | Heredoc is riskier than write_file for copy fidelity; must keep single-quoted delimiter (no shell expansion). Canonical shipped path stays write_file | C2-3 + C6 | 31B |
| P16 | E4B `bcf_plan.md` · Plan-sentence binding | bound to the message containing the FIRST tool call; never text-only | Leave (F4 already fixed) | A standalone "Plan: install path." text-only message would end the planner stage and capture the sentence as bcf_spec (F4). The fix binds it to the first tool-call message | L | S | Reverting re-opens the output_key capture trap. Keep | C2-2 | E4B |

---

## C. Engine layer — `skills/bcf-spec/scripts/bcf.py` (byte-identical both tracks; every edit re-mirrors + re-runs C1)

Constants block (lines 29–53): BCF_VERSION 1.0.0 · STDOUT_CAP 4800 · SPEC_WORD_CAP 300 · SPEC_CHAR_CAP 4800 · ANCHOR_CHAR_CAP 2000 · APPLY_DIFF_CAP 1500 · CHECK_CHAR_CAP 1500 · STATE_CHAR_CAP 1200 · MAX_WINDOW 7 · MAX_APPLY_LINES 120 · MAX_CUES 12 · SCAN_SOFT_DEADLINE 8.0 (declared target, NOT a guard) · SCAN_HARD_DEADLINE 20.0 (effective scan deadline = t0 + 17.0) · MAX_FILE_BYTES 400,000 · DELIM `<|"|>`.

| ID | Location (function · constant) | Current | Proposed adjustment | Score mechanism / evidence | Impact | Effort | Risk / harness constraint | Validation | Track |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| E1 | `_family_lines()` (l.981) | priors for only 5/10 families: infinite-loop-recursion, boundary-edge-case, ordering-off-by-one, type-introspection, state-lifecycle | Add generic priors for the 5 unpatterned families: api-contract-violation (return/raise/assert/string-literal lines), missing-capability (assignment/call/def-parameter lines), schema-generation-logic (dict/update/merge/ref lines), compatibility-shim (version-gate lines), docs-content-error (constant/assignment lines) | **Top engine lever (e4b §6.1).** 70/129 tasks (54.3%) are in families with NO line priors → anchors fall back to def lines, so the edit locus is not surfaced. Smoke test: join_words bug at line 6, spec said line 4, anchors returned 4 and 11 — neither is the edit site (e4b §3.2). Attacks edit targeting, E4B's measured bottleneck (S14) | H | M | New priors could shift anchors off the true site on some tasks → anchor uniqueness must stay ≥90% and hit@k must not regress. Generic mechanism patterns only — NO repo-specific words (overfit guard, empirical §5). Both-track sync + C1 | C1 full battery (uniqueness, hit@k) + e4b join_words smoke + C6 | both |
| E2 | `render_spec()` ## Target (l.1165) | Target shows path — symbol (def line N) only | Surface "candidate edit lines: N, M" from cue_lines inside the top symbol (data already exists in candidates.json / gen_anchors targets) | **e4b §6.2.** Lets the foreman read the right range without inferring it; attacks the "Target line = edit line" misread (e4b §3.2). Word headroom exists: measured max 219/300 words, 1,561/4,800 chars (empirical §7) → ~16 words fit | H | M | Wrong lines could misdirect → label "candidate", keep anchors authoritative at edit time. Must stay ≤300 words, brace-free, 7 sections (C1 format gate). Both-track sync | C1 format/word gate + e4b smoke + C6 | both |
| E3 | `cmd_apply()` (l.1405) post-write | compile gate only (syntax) | Optional semantic smoke: if repro_seed.py exists, copy to /tmp, run `timeout 10`, report PASS/FAIL as INFORMATIONAL in apply output; never block | **e4b §6.3.** Probe-confirmed: a semantically wrong but syntactically valid edit (directs→direct, the QAT trailing-s class 753277) passes apply + check (e4b §1/§3.1). Gives an immediate semantic signal instead of relying on the model to run Verify — the loop 756433 found 2B models fail | M | M | Coverage limited: repro_seed exists for only 18/129 tasks (architecture §3.3c). Seeds are statement-extracted, may be incomplete → false FAIL could misdirect; must not block valid edits. Side effects → run in /tmp. Treat as experiment, not gate (e4b §6.3) | C1 apply battery + C2-6 + C6 E4B arm | both (E4B value) |
| E4 | `gen_anchors()` strike exclusion (l.1055) | excludes targets whose EXACT line was struck | Exclude any window CONTAINING a struck line (window-granular) | O9: strike is line-granular but windows are not — an expanded window starting on a different line can still contain the struck line and be re-emitted, wasting edit calls on the 2-strike path. Small logic fix | M | M | Over-exclusion could leave no anchors → the "No cue-matching locus … apply/locate" fallback already exists. Both-track sync + C1 | C2-6 circuit-breaker drill + C1 | both |
| E5 | `cmd_locate()` cue merge (l.1487) | new locate words added as ident weight 1.6; original cues keep up to 3.0 | Raise new-word weight to ~2.2, or decay original non-path cues ×0.8 on re-locate | Refined solver hypotheses can be outranked by stale original cues (path 3.0 / ident 2.0 > 1.6). The 31B deviation license + the 4 misses prescribe locate as the re-localization path (empirical §5). UNMEASURED — no observed locate failure | M (speculative) | M | Over-weighting noisy solver words → worse ranking; keep path cues dominant. Validate before promoting. Both-track sync | C1 miss tasks (rich_3105/3278/4076) + locbench (V7) + C6 | both |
| E6 | `discover_tests()` (l.1095) | reads EVERY test file, no deadline of its own | Add wall-clock guard (~3s) + cap files read (~200); keep top-2 ranking | empirical §12 explicitly flags: test discovery has no deadline; at full-repo scale (2,600 files) it can blow the cold-spec budget. Protects the 8s target / 17s guard on private repos | M | M | Capping could miss the right test on huge repos → partial test list; the /tmp-repro fallback still exists. Both-track sync | C2 full-repo runtime (≥1 2,600-file repo) + C1 | both |
| E7 | `cmd_locate()` build_index deadline (l.1495) | hardcoded now+3.0; partial scan silently ranked | Emit a "(partial scan)" marker when the deadline trips (keep 3s per architecture §3.0 locate ≤3s contract) | On large repos locate ranks whatever was scanned before 3s with no signal → solver may trust a silently partial ranking. Marker tells it to grep directly. Same scale class as E6 | M | M | None material (text marker). Do NOT raise the deadline above the ≤3s contract. Both-track sync | C2 full-repo + C1 | both |
| E8 | `expand_window()` · MAX_WINDOW (l.37) | 7 lines | 9-line arm | 17/477 anchors (3.6%) are ambiguous (no unique window ≤7) and fall back to apply line-range (empirical §8). A larger window could resolve some to unique → fewer apply heredocs (E4B copy risk) | L | M | Larger windows cost anchor chars (cap 2000, measured max 1065 — headroom) and copy fidelity (longer verbatim spans). Ambiguous already has a deterministic fallback, so gain is marginal. Both-track sync | C1 uniqueness rate + C6 | both |
| E9 | `rank_candidates()` weights (l.920) + `rarity_weights()` (l.844) | 100·path + 12·stem + 25·coverage + 30·defined + 8·min(ref,5) + 15·subsystem + 8·prior; rarity 0.5+IDF | Leave on public evidence; tune ONLY via locbench/OOD | hit@1 = hit@3 = hit@5 = 96.9% (empirical §5); the 4 misses are intrinsic (1 new-file, 1 reference-only, 2 zero-overlap) — NOT ranking bugs. Tuning on public risks overfitting (6644/7315 opposite-fix pair, taxonomy insight 4). Real-repo recall unproven (empirical §2) | L (public) / unknown (private) | M | Overfitting to public extraction bias (43 solo-gold tasks trivially localizable). NO public ids/strings/snapshots. Generic coverage-first is the foundation (S12) | locbench (V7) + OOD (V3) + C1 non-solo subset | both |
| E10 | `extract_cues()` regexes (l.516–527) · MAX_CUES 12 · symptom cap 12 | path 3.0 / modsym 3.0+2.0 / backtick 2.0 / call 2.2 / camel 1.4 / snake 1.4 / quoted 2.0 (3–60 chars) / exception 2.0 / traceback 3.0 / symptom 1.0 | Leave | Caps not binding: avg 3.4 cues/task (taxonomy insight 7). Zero-overlap misses (rich_3278/4076) can't be fixed by regex — the words don't exist in the gold file (empirical §5). Adding e.g. an ansi→ansi.py map would be an extraction-specific hack, explicitly rejected | L | M | Overfit risk; cue precision already measured. Keep | C1 | both |
| E11 | `classify()` · KIND_PATTERNS / FAMILY_PATTERNS / _GENERIC_WORDS / _match_weight (1/2/3, title ×2) / margin 0.2 | specificity-weighted; generic discourse weight 1, mechanism noun 2, phrase 3; title += 2×; tie-break bugs prefer BUG_FAMILIES; conf high if strong cue + margin ≥0.2 | OOD-gated vocabulary expansion only (generic mechanism words) | Family top-1 56.6%, top-2 71.3% (passes ≥70% gate); api-contract-violation top-1 4/23 is the weakest (its vocabulary is deliberately generic discourse). Better family → better playbook + include_docs + edit_shape. empirical §12: "do not overfit further on the public set" | M (OOD-gated) | M | Overfitting; the tie banner + top/alt already mitigate. Generic words only. Both-track sync | locbench/OOD + C1 top-2 gate ≥70% | both |
| E12 | `edit_shape()` strong threshold (l.486) | score ≥40 = strong; family+locus rules | Recalibrate threshold (OOD-gated) | edit_shape agreement only 51.2% (empirical §3). Shape is advisory (one-line vs multi-file guidance); wrong shape could over/under-scope edits. 23 multi-file tasks (17.8%) | L | M | Advisory only; low measured impact. Overfit risk. Both-track sync | C1 + OOD | both |
| E13 | `render_spec()` · SPEC_WORD_CAP 300 / SPEC_CHAR_CAP 4800 / _trim_spec | 300 words / 4800 chars; trim drops banners then compacts Steps | Leave caps (headroom is an asset for E1/E2, not a lever to raise) | Measured max 219 words / 1,561 chars (empirical §7) — caps not binding. Raising bloats the per-turn instruction (spec lives in the solver instruction, re-sent every turn) | L | S | Bloat → compaction pressure (S7). Keep ≤300 hard cap | C1 format gate | both |
| E14 | `emit()` · STDOUT_CAP 4800 | 4800 (run_command caps at 5000) | Leave | Deliberate margin below the harness 5,000-char cap (HR §7.1); skill-tool caps undocumented → design to the tighter known cap. Off-by-one already fixed (empirical §11.1) | L | S | Raising toward 5000 removes the safety margin; harness-locked upper bound. Keep | C1 stdout-cap check | both |
| E15 | `cmd_apply()` · MAX_APPLY_LINES 120 | 120-line range cap | Leave (do NOT raise) | Anti-whole-file-overwrite — E4B's measured failure (S14). 75% of tasks are one-line/few-lines (taxonomy insight 1); multi-file tasks use multiple applies. Raising re-opens the overwrite class | L | S | Evidence-against: whole-file overwrites are a documented E4B failure. Keep | C1 apply >120 refusal | both |
| E16 | `cmd_check()` gates (l.1544) | protected scan FAIL / scratch WARN any-depth untracked / compile gate every changed .py / diff-nonempty incl untracked | Leave (load-bearing anti-tampering) | F2/F8 already fixed new-file-only + scratch depth. Compile gate catches the escaped-new_string residual (744272). Scorer discards test/config edits (HR §8.2) | L | S | Weakening re-opens anti-tampering TASK zeros. reasons[:5]/warns[:3] caps fine. Keep | C1 check battery (P4/P5/P11) | both |
| E17 | `cmd_state()` compass (l.1616) · keep[:8] · NEXT hint tree | spec header+Target ≤8 lines; hint: no diff→apply / FAIL→fix / PASS→review+submit / else→run Verify | Surface last edit range(s) from st["edits"]; optionally wire the vestigial tests_run flag | Post-compaction resume could re-read less if state showed the last edited range. NOTE: tests_run is initialized False and reset by cmd_spec but NEVER set True — architecture §3.7's "tests run vs not" hint distinction is unimplemented (the else-branch covers it). Minor | L | M | Adding lines costs STATE_CHAR_CAP 1200 headroom; wiring tests_run needs a new signal (no subcommand reports it). Low value. Both-track sync | C2-5 compaction drill | both |
| E18 | `normalize()` / `cache_key()` (l.271–282) | sha256(norm(problem)+git_HEAD+BCF_VERSION); norm strips emoji/URL/fence, lowercases, collapses ws | Leave (not a score lever) | Normalization absorbs E4B copy drift on re-entry; HEAD stable across edits → cache hit (graft #3, empirical §9). BCF_VERSION bump = cache invalidation, a RE-TEST tool when engine changes land | L | S | Changing normalization could break byte-identical re-entry (O1 restart idempotence). Keep | C1 cache probes | both |
| E19 | `cmd_spec()` scan deadline (l.1289) | t0 + max(2, SCAN_HARD_DEADLINE−3) = 17s; partial→confidence: partial-, exit 0 | Leave until C2 measures full-repo cold runtime | Cold spec on the corpus is ≤0.625s (≤18 files); the 17s guard / partial path is UNEXERCISED (empirical §2/§6). Lowering → more partial specs; raising → budget risk. SCAN_SOFT_DEADLINE 8.0 is a declared target, not a guard (awareness flag) | L (conditional) | M | Must re-measure on a 2,600-file repo before touching (empirical §12). F5 already made partial exit 0 (usable output). Keep | C2 full-repo cold runtime | both |
| E20 | `_good_anchor()` / DELIM / trailing-backtick guard (l.996) | reject empty / trailing-backtick / DELIM-containing windows | Leave (load-bearing copy fidelity) | Trailing backtick = serialization-loop trigger; DELIM `<\|"\|>` never inside anchors (architecture §3.5). Anchors closing prose line already fixes the rstrip copy-fidelity bug (empirical §11.2) | L | S | Weakening re-opens the backtick-swallow loop (756051). Keep | C1 anchor integrity | both |
| E21 | `read_stdin_bounded()` timeout (l.164) | 10.0s daemon-thread bound | Leave | F6: bounds heredoc stdin so an idle pipe can't burn the 150–180s command timeout. Empty-stdin refusal (F1) prevents silent range deletion | L | S | Lowering risks rejecting slow legitimate heredocs; raising re-opens the hang. Keep | C1 P2/P7/P12 | both |
| E22 | `install.py` · RUNNER_CONFIGS skip-worktree list (l.20) | pytest.ini, conftest.py, pyproject.toml, setup.cfg, tox.ini, sitecustomize.py | Add .pytest.ini, usercustomize.py for parity with bcf.py PROTECTED_NAMES | Defense-in-depth parity: bcf.py protects .pytest.ini/usercustomize.py/_swegemma_stubs.py but install only skip-worktrees 6 configs. Accidental edits to the missing ones would reach git diff (scorer discards anyway) | L | S | None (try/except wrapped, non-fatal). Both-track sync (install.py byte-identical). _swegemma_stubs.py is harness-created, skip-worktree optional | C1 install probe (P13) | both |
| E23 | `detect_repo()` / REPO_PRIORS (l.652) | fastapi/rich/requests/httpx priors +8; never gates generic path | Leave (do NOT add repos) | Hidden = private repos (S12); priors only tune weights, generic coverage-first is the foundation. Adding repo-specific priors = overfitting (6644/7315 warning) | L | M | Overfit; NO public ids/strings/snapshots (grep-verified clean, compliance §2). Keep | C1 + OOD | both |
| E24 | `SUBSYSTEM_MAP` (l.637) | 12 generic symptom→directory entries, +15 bonus | OOD-gated generic expansion only | Generic mechanism map is the private-repo fallback (sparse tasks). Expansion could help sparse localization but risks overfitting; the 2 zero-overlap misses are unfixable this way (empirical §5) | L | M | Overfit; generic mechanisms only. Both-track sync | locbench sparse subset + OOD | both |
| E25 | `discover_tests()` command shape (l.1134) | top-2 files; `timeout 60 … -k kw -x -q` | A/B: drop -x (show all failures) or top-3 | -x stops at first failure → model sees one failure per repair cycle (max 2). Dropping -x shows the full failure list at once (better repair targeting, more tokens). UNMEASURED | L | M | More output tokens → compaction pressure; -x gives fast feedback. Keep timeout 60 (hang guard). Both-track sync | C2 + C6 | both |
| E26 | `cmd_spec()` repro extraction (l.1305) · _FENCE_CODE_RE | first python code-fence only → repro_seed.py | Extract multiple fences (optional) | 18/129 tasks have fenced repro code; multiple fences could give richer repro material for E3. Marginal coverage gain | L | M | More seed files = more /tmp management; incomplete seeds misdirect. Both-track sync | C1 + C6 | both |

---

## D. Skill layer — `SKILL.md` + `install.py`

| ID | Location | Current | Proposed adjustment | Score mechanism / evidence | Impact | Effort | Risk / harness constraint | Validation | Track |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| S1 | `SKILL.md` frontmatter · description | 285 chars | Trim to ~150 chars keeping trigger keywords (classifier, fix-spec, install zero-arg, run_command) | The skill list is re-injected PER MESSAGE — recurring token cost, critical on E4B (architecture §5). Halving saves ~30–40 tok/turn × 40 turns ≈ 1.2–1.6k tokens vs the 14,336 compaction trigger | L | S | Skill auto-injection/triggering may depend on description wording → C0 must confirm injection still works. Keep name kebab-case ≤64, description ≤1024, brace-free (validator). Both-track byte-identical | C0 compiler canary + C5 | both |
| S2 | `SKILL.md` body · invocation wording / load_skill guidance | prose-first; zero-arg install spelled literally; load_skill only on unknown-skill error; "do NOT call load_skill otherwise" | Leave | Prose descriptions cut malformed tool names 31%→5% (745143). load_skill re-returns the whole body per call → token waste (architecture §5). Zero-arg install avoids the args-array hang (753973). Already compliant | L | S | Reverting to copyable JSON / frequent load_skill re-opens token waste + parser risk. Keep | C0 + C2-7 | both |
| S3 | `install.py` · find_root() ladder | git rev-parse → upward .git → /workspace → sandbox probe (ancestor workspace/.git, unique tempdir swegemma_sandbox_*) → honest error | Leave | F3 already fixed the off-repo install (subprocess sandbox, no /workspace). Never guesses between concurrent sandboxes. Idempotent sha-checked re-entry | L | S | Changing the ladder risks the F3 regression (install into skill copy → silent manual-tier degradation). Keep | C1 cwd-agnosticism (P9/P13) | both |

---

## E. Eval / selection-strategy layer

| ID | Lever | Current | Proposed adjustment | Score mechanism / evidence | Impact | Effort | Risk / constraint | Validation | Track |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| V1 | Masked valid-set freeze | 68-valid discrimination set (756400) | Freeze: exclude fastapi_14186 + rich_3486 + 27 inline_snapshot/dirty_equals ids + 12 requests httpbin (backend-conditional); reconcile 4 candidates (fastapi_14266/14609/15030/15745) by running gold+empty on the EXACT wheelhouse | Every A/B decision depends on a clean denominator. 5 empty-pass tasks inject free-point noise; 27 fastapi tasks can never pass in the sandbox (756587). Never A/B on raw 129 (B15/S18) | H | M | Wrong masking mis-ranks configs. Run gold+empty on the pinned wheelhouse (B22) before freezing; cross-check Kirchner gold_patch_check.csv 127/129 | gold+empty reconciliation run | both |
| V2 | Paired repeats + win-both | planned C6: 2 repeats × both tracks | Enforce: win-both rule for any config change; single-run deltas <4 tasks = noise (sigma ≈2/58; 10–13% per-task flip); ~30-task fixed set + ~106 held-out; pre-registered rules-before-run | Prevents promoting noise. Published bundle scores are best-of-N inflated (1–4 tasks; 0.24→0.17 observed). Seed 7 fixed for comparability (B16/S19) | H | M | GPU cost; skipping repeats → false promotions. Do NOT transmit competition data to third-party APIs (B3/S16) | C6 replicated eval | both |
| V3 | OOD / private-repo proxy | planned FreshSWE-Py 663 / OOD-45 | Self-host FreshSWE-Py (663 post-release) + OOD-45 (rewritten statements, fixed runner); pre-score before any slot | Public→hidden transfer is weak (B17); hidden = private repos. The corpus hit@k is an extraction-biased upper bound (empirical §2). OOD is the only honest generalization signal | H | L | Infra build cost; self-host only (S16 data policy). Do not tune on public alone | pre-slot OOD run | both |
| V4a | C0 official-compiler canary | planned | Run FIRST, both trees: confirm skills path resolution base + injected skill-tool scalar/zero-arg schemas; brace/schema lint; py_compile 3.12 AND 3.13 | Catches compile-time RUN rejection (O4 skills path) before packaging. Minutes of CPU. One-line fallback ready (Y8) | H | S | Skipping risks a RUN-zero on an uncompileable bundle. Any failure blocks packaging | C0 pass | both |
| V4b | C2/C3/C5 drills | planned | Execute in order: C2-3 forced nudge-restart (tax ≤15s, byte-identical spec, no dup edits); C2-4 include_contents:none boundary (HARD gate); C3 parser fuzz ≥5,000 bracket-heavy strings (zero hangs); C5 E4B serving end-to-end + trailing-s probe | Prevents RUN/TASK zeros: restart pathology (O1), system-only template failure (O3), parser freeze (O5/753973), E4B intermittent "incorrect format" (752128). C5 fail → hold E4B slot, ship 31B-only | H | M | GPU/notebook cost; these are gates, not score-adds. C2-4 and C5 are hard pre-slot gates | per-canary pass criteria (architecture §10) | both |
| V5 | LoRA gated experiment | none shipped (raw base both tracks) | Do NOT ship. Attempt ONLY with paired local gain ≥3 tasks over ≥4 seeds; PEFT-on-QAT only; notebook canary w/ noise adapter; verify attachment via traces | Every controlled study null-or-worse; serving tax +29% time/+45% tokens forces budget cuts that erase gains (S13/B5). rank-32 attempt scored 0.06 vs 0.17 baseline | L (expected negative) | L | Hand-constructed/activation-derived adapters UNADJUDICATED (756792) — no scored run without written clearance. alpha 32 caused a 0.0 submission. Keep raw-base fallback | gated local paired eval | both |
| V6 | Monolithic variant B | pre-validated fallback (planned) | Keep validated in parallel; promote ONLY if C2-3 proves the fixed SequentialAgent tree unrecoverable on the pinned wheelhouse | The fixed hierarchy deviates from S4 (user-fixed requirement, O1). Variant B is the emergency fallback so it never costs a slot. Do NOT flatten without the user's hierarchy decision changing | H (conditional) | M | Deviates from the user-fixed hierarchy → emergency-only. Must stay validator-green | C0 + C2 on variant B | both |
| V7 | GPU-free localization tuning | planned gemma4-locbench-v1 | Adopt locbench + pytest-verified context-selection harness; exact McNemar + Wilson CIs; CPU-only patch re-verification | Enables E9/E11/E24 ranking/vocab tuning with statistics instead of guesswork, GPU-free (B19). Re-verify borderline tasks multiple times (local reruns flip resolved) | M | M | locbench is a proxy, not the hidden set; pair with V3. Don't invest in graph-tool nudging (p=0.69) | locbench before/after | both |

---

## F. RANKED TOP-20 (by impact/effort score; ties → evidence directness → radius)

| Rank | Lever | Impact | Effort | Score | Risk (key) | Validation | Track |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Y4 — eval_config cap decision rule (§8) | H | S | 3.00 | Trades per-task solve prob for RUN safety; gated on C2 setup telemetry | C2 telemetry + C6 ≤11.0h extrapolation | both |
| 2 | V4a — C0 official-compiler canary + skills-path fallback | H | S | 3.00 | Compile-time RUN rejection if skipped; minutes of CPU | C0 pass before packaging | both |
| 3 | Y1 — planner-only thinking_budget 0/256 | M | S | 2.00 | N1 frozen → A/B arm; mechanical echo fidelity low-risk | C2-3 (tax ≤15s) + C6 win-both | 31B |
| 4 | Y2 — temperature 0.2→0.0 [ARM] | M | S | 2.00 | 0.2 proven syntax reliability; per-harness, not transferable | C6 paired + C0 lint | 31B |
| 5 | P1 — statement copy 1,500→3,000 chars [ARM] | M | S | 2.00 | Deep-evidence frequency unmeasured; 31B-only (E4B payload risk) | C1 re-run (CPU) + C6 | 31B |
| 6 | Y14 — E4B thinking_budget 0→2048 [ARM, contested] | M | S | 2.00 | Output-allowance squeeze; template may ignore (HF#26) | C5 observe + C6 paired | E4B |
| 7 | E1 — _family_lines priors for 5 unpatterned families | H | M | 1.50 | Anchor shift off true site; generic words only; both-track sync | C1 uniqueness/hit@k + join_words smoke + C6 | both |
| 8 | E2 — spec Target candidate edit lines | H | M | 1.50 | Wrong lines misdirect foreman; ≤300 words brace-free | C1 format gate + e4b smoke + C6 | both |
| 9 | V1 — masked valid-set freeze | H | M | 1.50 | Wrong masking mis-ranks all A/B; gold+empty on exact wheelhouse | gold+empty reconciliation | both |
| 10 | V2 — paired repeats + win-both + noise rule | H | M | 1.50 | GPU cost; skipping → false promotions | C6 replicated | both |
| 11 | V4b — C2-3/C2-4/C3/C5 drills | H | M | 1.50 | Gates not score-adds; C2-4/C5 hard pre-slot | per-canary criteria | both |
| 12 | V6 — monolithic variant B pre-validated | H (cond.) | M | 1.50 | User-fixed hierarchy → emergency-only | C0 + C2 on B | both |
| 13 | V3 — OOD proxies (FreshSWE-Py/OOD-45) | H | L | 1.00 | Infra cost; self-host only (data policy) | pre-slot OOD run | both |
| 14 | E3 — semantic smoke gate after apply | M | M | 1.00 | 18/129 coverage; incomplete seeds; experiment not gate | C1 apply + C2-6 + C6 E4B | both (E4B) |
| 15 | E4 — strike window-granular exclusion | M | M | 1.00 | Over-exclusion → no anchors (fallback exists) | C2-6 + C1 | both |
| 16 | E6 — discover_tests deadline + file cap | M | M | 1.00 | Miss right test on huge repos; partial list | C2 full-repo + C1 | both |
| 17 | E5 — locate new-word weight / stale-cue decay | M | M | 1.00 | Unmeasured; noisy words worse ranking | C1 misses + locbench + C6 | both |
| 18 | E7 — locate partial-scan marker | M | M | 1.00 | None material; keep ≤3s contract | C2 full-repo + C1 | both |
| 19 | V7 — locbench GPU-free localization tuning | M | M | 1.00 | Proxy not hidden set; pair with V3 | locbench before/after | both |
| 20 | S1 — SKILL.md description trim (~285→150 chars) | L | S | 1.00 | Injection/trigger wording; C0 confirm | C0 + C5 | both |

**Honorable mentions (just outside top-20):** Y3 (8192 arm, conditional on truncation nudges — default don't), E11 (classify vocab, OOD-gated only), E22 (skip-worktree parity, L/S), P2 (commit-gate 2-read arm, weak evidence). **Lowest value:** E9/E10/E12/E23/E24 (public hit@k ceiling + overfit risk), E13–E21/E25/E26 (caps not binding or load-bearing), P3–P16 (load-bearing prompt clauses — keep).

---

## G. Quick wins (S effort — the change is doable today; promotion still requires paired evidence)

These are config/prompt tweaks. CPU-cheap evidence (C0 lint, C1 re-run ~1h) can be gathered today; GPU arms (C6) follow the win-both discipline.

1. **V4a — run C0 official-compiler canary now** (minutes). Hard gate before any packaging; confirms skills path base + injected schemas. Fallback Y8 is a one-liner if it fails.
2. **Y1 — inline planner thinking_budget 0/256** in `bcf_plan.yaml` (solver keeps 2048). Pre-register the arm; prove via C2-3 restart drill (tax ≤15s) then C6. Removes the O2 quantified 10–30s/restart tax.
3. **Y2 — pre-register temp 0.0 arm** (N4). C6 paired; equal-score speed evidence (755066).
4. **P1 — 3,000-char statement arm (31B)**. C1 re-run is CPU-cheap → hit@k delta today; C6 to promote.
5. **Y14 — keep E4B thinking-2048 arm ready** (config flip). C5-gated; do not promote without serving observation.
6. **Y4 — apply the §8 cap decision rule** the moment C2 setup telemetry lands (the YAML edit is S; the decision is measurement-gated). At N=129 the 4.5-min cap is already marginal → likely lower 31B to 4.0.
7. **S1 — trim SKILL.md description** to ~150 chars; C0 confirm injection still triggers.
8. **E22 — add .pytest.ini + usercustomize.py to install.py skip-worktree** (parity, defense-in-depth, try/except-wrapped).
9. **Y3 — 8192 arm ONLY if C2 shows MAX_TOKENS truncation nudges** (otherwise leave; no dependable gain).

## H. Strategic (L effort — infrastructure / full re-test)

1. **V3 — self-host OOD proxies** (FreshSWE-Py 663 + OOD-45). The only honest generalization signal for private-repo scoring; prerequisite for safely tuning E9/E11/E24. Data policy: self-host, never transmit competition data (S16).
2. **Full-repo C2 calibration** on ≥1 2,600-file repo. Exercises the 17s scan guard, incremental AST index, and discover_tests at scale — all UNEXERCISED on the ≤18-file corpus (empirical §2/§12). Gates E6/E7/E19.
3. **V5 — LoRA, gated hard.** Default NO (null-or-worse + 29%/45% tax). Only attempt with paired ≥3-task gain over ≥4 seeds, PEFT-on-QAT, noise-adapter canary, trace-verified attachment. Hand-constructed adapters need written host clearance (756792).
4. **E3 grown into a real verification loop** (if the experimental smoke gate shows signal). Deterministic fix SYNTHESIS for arbitrary private repos is infeasible (e4b §4) — do not attempt; the residual fix-authoring gap is a model-capability ceiling to MEASURE (C6), not a spec bug to code away.
5. **V6 — keep variant B validated in parallel** (M effort, conditional H value) so the hierarchy fallback never costs a slot.

---

## I. Do NOT tune (harness-locked or evidence-against)

| Item | Why not | Evidence |
| --- | --- | --- |
| Compaction settings (interval 5 / overlap 2 / threshold 14,336 / retention 5) | Locked harness-side; no submission control. Summarizer samples temp 1.0/top_p 0.95 regardless of generate_content_config → low-temp tuning does NOT stabilize summaries | S7; HR §7.2; 754783 |
| ADK version upgrade | v2 refused; same code in 1.39.1; no migration path | S7; 748287 |
| Array-typed tool args / get_code_subgraph | gemma4 parser infinite-loop freezes the whole server (SIGTERM-proof), zeroes every remaining task; unfixed. list[str] arg = trigger; graph tools no end-to-end benefit (p=0.69) | S5/B8; 753973; architecture §1 |
| thinking_level | Maps to OpenAI reasoning_effort on the vLLM path → omit; use include_thoughts:true + thinking_budget | HR §2.4 warning; S8 |
| include_thoughts:false | Does NOT disable thinking on adk-submission ≥0.2.13 (intended change); thought summaries OFF collapses solves 48→34–35/129. budget 0 is the only reliable off switch | S8/N1; 747914 |
| top_p 0.5–0.8 | Measurably hurt | S9; 746250 |
| max_output_tokens 8192 (without truncation evidence) | No dependable gain; real peaks ~3.7k; wastes headroom. ARM only on observed nudges | S9/N4; 747696 |
| Prompt-only recovery rules / budget exhortations (esp. E4B) | 11 interventions resolved ZERO tasks on 2B-class editing; e4b §6 explicitly rejects adding more | 756433; e4b §6 |
| Hard "edit by call N" rule | Forces wrong-place edits on ~40% where lexical shortlists miss gold. Use soft verification-triggered gates | S11; 747980 |
| Repair cycles >2 | Recovery probability collapses with attempts | architecture §6.2; ACI 23.4% class |
| apply cap >120 lines / whole-file overwrite | Whole-file overwrites are a measured E4B failure; the cap is the guard | S14; 750974 |
| Public/private split probing | Needs 240+ submissions vs ~70 cap; variance defeats single probes; multi-account ban risk; no staff ruling — negative EV | B21/S19; 757626 |
| LoRA without demonstrated paired gain | Every controlled study null-or-worse; +29% time/+45% tokens tax erases gains | S13/B5; 755677 |
| Embedding public task ids / expected strings / snapshots | Hidden = private repos; 6644/7315 opposite-fix pair is the canonical overfitting warning; grep-verified clean today | S12/B19; taxonomy insight 4; empirical §5 |
| URL fetching | Offline sandbox (network_mode=none); hints empty 129/129; wastes budget | B18; 757149 |
| Editing tests / conftest / runner configs | Scorer discards them (anti-tampering); check/apply already refuse | HR §8.2; S22 |
| Bare pytest / full suites | Hang tasks run to the cap; targeted timeout-wrapped only | architecture §3.3f; rich_4006/3480/3772 |
| Flattening the SequentialAgent hierarchy (without user decision) | User-fixed requirement; variant B is emergency-only, not a tuning choice | O1; architecture §10 |
| A/B on raw 129 | 5 empty-pass tasks inject free-point noise; mask first | B15; 756400 |
| Raising 31B cap to 5.0 without measured setup ≤35s | 12h all-or-zero kill; N=129 already marginal at 4.5 | O7/§8; S3 |
| Resubmitting an unchanged ZIP hoping for a scorer fix | No rescores promised; burns a daily slot | B9; 744354 |
| top_k / seed changes | top_k 64 model-card default (no evidence); seed 7 is the paired-A/B reproducibility anchor | S9; S8 |
| Repo-specific priors / subsystem hacks for the 4 misses | The misses are intrinsic (new-file, reference-only, 2 zero-overlap); closing them needs URL fetching (forbidden) or extraction hacks (overfitting) | empirical §5 |

---

## J. Caveats on the evidence itself

- **Extraction bias:** hit@k 96.9% and cold runtime ≤0.625s are measured on ≤18-file selective reconstructions (43/129 solo-gold). They are UPPER bounds; full-repo (2,600-file) recall/runtime is a C2-stage risk (empirical §2). Levers E6/E7/E19 and V3 exist precisely because of this.
- **E4B has NO empirical score for THIS design.** The headline 0/31 was a different scaffold (Budget-Fit). The architecture's "E4B viability 7–9/10" are design intuition, not measurement (e4b §1/§2). Every E4B lever's impact is extrapolation until C5+C6 produce a replicated non-zero resolve rate. 0 replicated solves → ship 31B-only finals posture.
- **Fix authoring is the dominant unmitigated gap** (e4b §3.1/§4): the helper does localization + guardrails well and fix synthesis not at all (infeasible deterministically for arbitrary private repos). E1/E2/E3 attack targeting/semantic-signal, but the residual ceiling is model capability — measure before betting the bonus slot.
- **Prompt-only behavioral levers are weak-evidence** for small models (756433). The structural caps, stateful strike, apply rollback, check gate, and disk-state compass are what actually bound damage. Prefer engine/config levers over more prompt rules.
- **Cross-track identity (N2) is a hard constraint on every engine lever:** bcf.py/install.py/SKILL.md must change identically in both trees and re-run validator + C1 + the skill-author battery (compliance F9; e4b §5.C). The current build is identical (sha b6ac6a07…); keep it that way.

*End of lever inventory. Read-only analysis — no submission file was modified. Fixes are owned by the engine/config implementers; promotion is owned by the verification implementer via the C0–C7 gates and win-both masked-set discipline.*

---

# PART C — Fast Iteration & Feedback-Loop Strategy (subtask 2c)

**Date:** 2026-11-11 · **Role:** iteration-strategy designer (BCF hardening, user task 2c) · **Method:** LOCAL ONLY, no web research.
**Scope:** how to iterate, build feedback loops, and test hypotheses QUICKLY on the BCF two-track brain while avoiding the wall-clock bottlenecks inventoried in `02a-bottlenecks.md` (local RTX 5090 32 GB, Windows 11 + WSL2 or native Zorin; remote Kaggle 4x L4 TP4).
**Nothing under `input/` or `deliverables/2026-11-11-bcf-gemma4-brain/` was modified.** All proposed scripts live in a NEW directory `scratch/bcf-hardening-2026-11-11/iter/` (design only — not yet implemented) and a WSL2 ext4 working root `~/bcf-eval/`.

**Evidence classes.** `MEASURED` = number from a cited local capture/artifact. `ESTIMATE` = derived here or in 02a §8 (E-numbers referenced); every new estimate is collected in §11. `VERIFY` = an implementation detail to confirm against the installed wheelhouse before relying on it. Thread ids (e.g. 756400) refer to the local dumps in `scratch/bcf-2026-11-11/intel_texts/` via the syntheses.

**Governing discipline (inherited, non-negotiable):** no promotion without paired, replicated, masked-set evidence — win-both rule; single-run deltas <4 tasks / <0.03 are noise (σ≈2 tasks/58; 10–13% per-task flip — 753524/750907/757588; 02b §0). Never A/B on raw 129 (5 empty-pass tasks inject free-point noise — 756400, brief implication 15). Engine edits re-mirror both tracks byte-identical + re-run C1 (N2). Pin the serving stack: wheelhouse v31 / vLLM 0.19.1 / swegemma 0.2.11 / adk-submission 0.2.13 / google-adk 1.36.1 / Python 3.12.13 host + python:3.13-slim sandbox (brief implication 22). Self-host all competition-data processing (synthesis constraint 16).

---

## 0. The loop ladder (executive summary)

Five loops, cheapest first. **A hypothesis climbs the ladder only when it passes the gate below it; it never skips a rung.** The ladder exists because the two scarce resources are (a) GPU-hours on one 5090 and (b) Kaggle slots behind a 36–52 h queue (02a §2/§5). Everything that can be learned without GPU is learned without GPU; everything that can be learned on 1 task is learned on 1 task; everything that can be learned on 30 is not learned on 68; and nothing reaches Kaggle that has not passed C0–C7.

| Loop | Purpose | What it tests | Typical wall time | GPU? | Cadence | Gate to next loop |
| --- | --- | --- | --- | --- | --- | --- |
| **L0** CPU-only | Correctness + mechanism evidence at zero GPU cost | Engine regression (C1), edit-call replay funnel, locbench localization probes, gold/empty audits, CPU patch re-verification, prompt/schema lint (C0), parser fuzz (C3), reasoning-survival tokenize repro (C4a) | **seconds–~1 h** per battery (spec p50 0.219 s MEASURED; C1 full ~1 h per architecture §10; audit ~0.5–1 h ESTIMATE) | No | Every commit / every arm before GPU | All C0/C1 thresholds green; audit freezes the valid set; fuzz zero hangs |
| **L1** single-task GPU smoke | Protocol survival on the pinned serving path | C2 drills (happy path, nudge-restart, MAX_TOKENS, include_contents boundary, compaction, breaker, skill-disable, telemetry), C4b reasoning-drop A/B, C5-local E4B serving | **~2–5 min/task warm** (agent 1.5–2.6 min ESTIMATE + bootstrap); one cold start 4–9 min amortized per batch (02a E6) | Yes (warm server) | Every config/engine change that passed L0 | C2 pass criteria (architecture §10); restart tax ≤15 s; setup ≤60 s median |
| **L2** stratified 30-task paired A/B | Does the lever move solves beyond noise? | One pre-registered variable per arm, 2 repeats, win-both + exact McNemar on the frozen 30-task dev set (masked-valid only) | **~2.3 h screen (1 repeat, 2 arms); ~4.6 h full (2 repeats)** ESTIMATE; E4B ~2.4 h | Yes | 1–2 arms/day, overnight | Win-both + Δ above noise floor + McNemar p≤0.05 (or Δ≥4/68-equivalent) |
| **L3** full masked 68 + OOD | Confirmation, wall-clock envelope, generalization | 68-valid × 2 repeats sharded overnight; OOD-45 / FreshSWE-Py proxy; 12 h extrapolation + §8 cap decision rule | **~5.2 h (31B 68×2), ~2.7 h (E4B)** ESTIMATE; OOD-45 ~1.7 h/repeat | Yes | Overnight, 2–3×/week + pre-slot | Extrapolated ≤11.0 h (31B) / ≤10.5 h (E4B); win-both on 68; OOD non-regression |
| **L4** Kaggle submission | Calibration + final selection under the real scorer | Scored runs of the validated bundle; queue defense; per-run triage; finals pick | **36–52 h queue + 8.9–11.9 h run** (02a §2 MEASURED reports) | Remote 4x L4 | ≤1/day, realistically ~1 per 2 days; ~8–11 usable slots Nov 12→Dec 2 | Pre-slot checklist (§7.2) fully green |

**Feedback wiring (the loops are a system, not a ladder only):**

```text
L4 scored run ──traces/parquet (if exposed)──▶ L0 fixture corpus (real hidden-repo failure patterns)
      │ score vs local prediction                    │
      ▼                                              ▼
 transfer-gap calibration ◀── L3 68-valid + OOD ◀── L2 winners ◀── L1 drills ◀── L0 gates
      │                                              ▲
      └────────── new hypothesis → ledger (§8) ──────┘   (every loop appends to the SAME ledger)
L2/L3 failures ──▶ L1 targeted drill on the failing task (--task-id) ──▶ L0 root-cause fixture
```

---

## 1. Bottleneck-avoidance doctrine (the seven rules)

Each rule maps to a measured bottleneck in 02a; the loops below are built from them.

| # | Rule | Bottleneck it avoids (02a evidence) |
| --- | --- | --- |
| 1 | **Never pay cold start twice.** One vLLM start per work session; batch ALL drills of an iteration into one `--task-ids` invocation; keep the server warm between invocations | Cold vLLM 4–9 min local ESTIMATE (E6); 12.6 min remote MEASURED (746250); #1 local-iteration cost (02a §5.2) |
| 2 | **Move every GPU-free question off the GPU.** Engine regression, edit replay, localization, patch verification, parser fuzz, lint — all CPU | Decode is 76% of agent wall (755291); GPU time is the scarcest local resource; C1 battery is ~1 h CPU vs ~5 h GPU for the same questions answered end-to-end |
| 3 | **Shrink the denominator before shrinking the run.** Freeze the masked 68-valid set; iterate on a stratified 30; full 68 only at confirmation gates | Full 129 local run 3.5–5.5 h ESTIMATE (E15); 5 empty-pass + 27 missing-lib + 2 structural tasks are pure noise/dead weight (756400/756587/757893) |
| 4 | **Keep data inside ext4.** Stage snapshots/wheels/workspaces once into the WSL2 VHDX (or native Linux); never bind-mount `/mnt/d` into a sandbox | 9p small-file penalty: bootstrap 3–10x slower ESTIMATE (E8); staging 2–6 min ext4 vs 10–30 min `/mnt/d` (02a §3) |
| 5 | **Statistics before belief.** Pre-register every arm; paired repeats; win-both; ignore deltas below the noise floor; never tune on raw 129 or on LB single runs | 0.24→0.17 unchanged rerun (757588); σ≈2 tasks/58, 10–13% flip (753524/750907); local screens mis-rank hidden (751973) |
| 6 | **Pin parity, document deviation.** Same wheelhouse/parsers/non-streaming path as the scorer; record every local deviation (KV ceiling, max_model_len, backend) in the results dir | Serving-path drift invalidates A/B (02a §3 parity row; brief implication 22; 753521 parser rewrite in 0.24; 744354 reasoning drop) |
| 7 | **Treat slots as the scarcest resource.** Nothing reaches L4 without C0–C7; submit early-day; keep a validated fallback; never resubmit unchanged ZIPs hoping for a scorer fix | Queue 36–52 h + one-pending gate + no cancel + rescore paused (747519/757993/743683); 12 h kill burns the slot (743063/752017) |

---

## 2. Shared infrastructure (one-time setup, ~1–2 h mostly unattended)

### 2.1 Data placement (rule 4)

Windows project root (read-only source of truth):
`d:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_alibaba/` = `$PROJ` (WSL: `/mnt/d/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_alibaba`).
WSL2 ext4 working root: `~/bcf-eval/` = `$ITER`. **All eval I/O happens in `$ITER`; results are rsynced back to `$PROJ/scratch/bcf-hardening-2026-11-11/iter/results/` after each run** (archive + Windows-side analysis; the copy-back is sequential large-file writes, cheap even across 9p).

| Item | Source (local) | Destination | One-time cost | Why |
| --- | --- | --- | --- | --- |
| `tasks.jsonl` (129 rows) | `$PROJ/input/kagglecomp/kagglecomp_data_package/tasks.jsonl` | `$ITER/tasks.jsonl` | <1 s | Harness `--tasks` input (HR §9.1) |
| 129 snapshot tgz (21.50 GB; median 214 MB) | `snapshots/*.tgz` inside `gemma-4-developer-agent.zip` (zip_listing.txt MEASURED) | `$ITER/snapshots/` | **2–6 min ext4 ESTIMATE** (02a §3); extract zip selectively (`unzip -j ... 'snapshots/*'`) to avoid the 21.9 GB full unpack | Container A/B bootstrap reads these per task; 9p would tax every task (E8) |
| wheels cache | `wheels/*` inside the same zip | `$ITER/wheels/` | ~1 min ESTIMATE | Sandbox is `network_mode=none`; wheels must be pre-staged (HR §4.1) |
| Sandbox image | `scratch/bcf-hardening-2026-11-11/docker/docker_Dockerfile.sandbox` | `docker build -t swebench-sandbox:latest` | **2–5 min ESTIMATE** (02a §3) | python:3.13-slim + git/patch/protoc/pigz + pytest/backends (Dockerfile.sandbox) |
| Model weights | wheelhouse v31 / HF `google/gemma-4-31B-it-qat-w4a16-ct` (~17 GB) + E4B QAT (~4–5 GB) | `$ITER/models/` (ext4, never `/mnt/d`) | download user-action; disk read 6–9 s at NVMe speed (02a E6) | Weight load is disk-bound; 9p would multiply cold start |
| Submission arms | `$PROJ/deliverables/.../02-bcf-brain-31b/submission/` (read-only!) | `$ITER/arms/<arm>/submission/` (copies) | <1 s each (~90–160 KB, architecture §1) | **Never edit the deliverable trees in place**; every arm is a scratch copy; promotion = a deliberate, reviewed copy-back by the user |
| Selective sources (CPU work) | `$PROJ/scratch/bcf-2026-11-11/sources/<iid>/` + `tasks/<iid>.json` + `taxonomy.json` + `index.json` | used in place on `/mnt/d` for L0 | 0 | L0 reads ≤18 files/task; 9p penalty negligible at this scale (MEASURED runtimes below already include Windows I/O) |

Disk budget: **60–100 GB ESTIMATE** total working set (02a E16). Check free space before staging.

### 2.2 Environment bring-up order (WSL2 path; Zorin fallback)

From `research/rtx5090-stack.md` (local research note, this folder) — these are VERIFY items, not measurements:

1. Windows: latest GeForce driver (R580+ generation); `wsl --update` → **WSL ≥ 2.7.0** (CUDA-graph capture fix for 5090; earlier versions force `--enforce-eager` at ~8x throughput cost).
2. Inside WSL: **no Linux display driver**; `/usr/lib/wsl/lib/nvidia-smi` shows the card; `python -c "import torch; print(torch.cuda.get_device_capability())"` → expect `(12, 0)` with torch 2.10.0+cu128/cu129 (vLLM 0.19.1 pins torch==2.10.0).
3. **WSL#40401 probe (do this BEFORE investing in WSL):** allocate a few GiB via torch; compare `nvidia-smi` used vs `torch.cuda.memory_reserved()`. A reported ~16 GiB "invisible" driver overhead on Blackwell under WSL2 would disqualify WSL2 entirely for a 32 GB card → **fall back to native Zorin dual-boot** (same ext4 layout, Docker Engine + NVIDIA Container Toolkit with `nvidia-container-cli.no-cgroups=true` per `research/zorin-docker.md`). Budget: probe ~10 min; Zorin install ~1–2 h if needed (ESTIMATE).
4. Install pinned stack in a venv (or the official vLLM 0.19.1 image): vLLM 0.19.1 (verify parser SHA `682b2152…b6889`), swegemma 0.2.11, adk-submission 0.2.13, google-adk 1.36.1, host Python 3.12.13. Record the pin manifest in `$ITER/PINS.txt` and copy it into every results dir (02a §6 instrumentation discipline).
5. **M2 KV measurement at first server start** (§4.1): read `GPU KV cache size: N tokens` from the startup log. vLLM 0.19.1 may allocate uniform full-length KV for Gemma 4 (vllm#39133 evidence in rtx5090-stack.md) → 32,768 will NOT fit at bf16 (02a E5: ~10–12k tokens). Decision ladder: hybrid-aware bf16 32k if reported → else fp8 KV + 16,384 → else bf16 ~10–11k. **Record the chosen config as a parity deviation** (BCF steady-state context <12k by design, architecture §8, so the deviation is tolerable; long-context A/Bs are non-predictive — 02a §7.6).

### 2.3 Observability convention (standing user requirement)

- Every run appends `ISO-TIMESTAMP STATE message` lines to `$PROJ/_progress/iteration.log` (STARTED / CHECKPOINT / DONE / FAILED), bash `printf >>` only.
- `$PROJ/scratch/bcf-hardening-2026-11-11/iter/STATUS.md` is the live board (one row per arm/run: loop, arm, run-id, state, resolve count, wall, gate verdict).
- Results dirs are self-describing: `$ITER/results/<loop>/<arm>/<run>/` containing the harness artifacts (HR §9.2: `summary.json`, `task_results.jsonl`, `patches/`, `test_outputs/`, `traces/trace_<iid>.json`, `logs/`) **plus** `PINS.txt`, `arm.diff` (unified diff vs the baseline arm), `prereg.md` (frozen hypothesis + decision rule), `env.json` (max_model_len, KV tokens, sandbox backend, concurrency, server warm/cold).

---

## 3. L0 — CPU-only loop (seconds to ~1 h, no GPU)

**Purpose:** extract every ounce of evidence that does not need a GPU, so GPU time is spent only on questions that genuinely require the model. **Bottleneck avoided:** decode cost (76% of agent wall, 755291) and cold starts (E6) — L0 runs on the Windows side today, in parallel with GPU work later.

| Sub-loop | What it tests | Exact command / procedure | Runtime | Gate / promotion criterion |
| --- | --- | --- | --- | --- |
| **L0.1 C0 static pre-flight + prompt lint** | Bundle compiles; schemas safe; braces/placeholders legal | §3.1 below | **1–10 s validate+compile ESTIMATE** (02a §3 iteration row); minutes total | 0 errors both trees; any failure blocks packaging (architecture C0) |
| **L0.2 C1 engine regression battery** | spec/anchors/apply/check/state/cache on all 129 extracted sources | `python -I -X utf8 test_bcf_full.py --label <arm>` | cold spec p50 **0.219 s** / p95 0.266 / max 0.625 MEASURED; anchors p95 0.219 s MEASURED; full battery **~1 h** (architecture C1, includes warm samples + probes) | hit@3 ≥80% cue-rich, top-2 family ≥70%, anchor uniqueness ≥90% + 0 violations, caps/format green (empirical report §3) |
| **L0.3 Edit-call replay funnel** | Edit failure classes + 2-strike ladder, E2B method (756433) | `python -I replay_edits.py --traces <dir> --snapshots $ITER/snapshots` (§9.5) | **ms/call**; 1,000 calls ≈ minutes ESTIMATE | 0 third-identical calls; verbatim-retry share of failures ↓ vs baseline; anchor uniqueness ≥90% |
| **L0.4 locbench-style localization probe** | Context selectors at matched budgets, GPU-free (756315 method) | `python -I locbench.py --selectors bcf,grep,bm25 --budget-chars 12000` (§9.6) | **~0.2–2 s/task/selector** (spec scan MEASURED 0.219 s on ≤18 files; full-repo cold ~1–2 s ESTIMATE, 02a §4); 129×3 ≈ 10–20 min ESTIMATE | Exact McNemar + Wilson CIs; tune E9/E11/E24 ONLY on OOD/full-repo evidence, never public hit@k alone (02b E9) |
| **L0.5 Gold/empty audit + CPU patch re-verification** | Which tasks discriminate; freeze the 68-valid denominator; re-verify borderline patches (756400/751487) | `python -I verify_patches.py --arm gold ...` / `--arm empty` (§9.4); empty arm also via `swegemma eval --skip-agent-patch` | **~0.3–0.5 min/task/arm ESTIMATE** (phase-2-only share of the 0.5 min/task MEASURED, 746250); 129×2 serial ≈ 1.3–2.2 h; **concurrency 4 (CPU-only) ≈ 25–45 min ESTIMATE** | gold-pass ∧ empty-fail = valid; reconcile 4 candidates (fastapi_14266/14609/15030/15745); freeze `valid_tasks.txt` + checksums |
| **L0.6 C3 parser-freeze fuzz (CPU!)** | gemma4 array-parser hang class (753973/745138) without a GPU | §3.2 below | 5,000 strings × ≤2 s timeout ≈ **≤3 h worst case, ~10–30 min typical ESTIMATE** (74/60,000 hang rate → almost all strings return instantly) | **Zero hangs**; any hang → schema change before anything else (architecture C3) |
| **L0.7 C4a reasoning-survival tokenize repro** | Does pinned v31 drop `reasoning_content` between tool calls? (744354) | §3.3 below | minutes ESTIMATE | Documents local parity state; feeds C4b GPU A/B (L1) |

### 3.1 L0.1 — C0 pre-flight (every build, both trees)

```bash
cd "$PROJ"
# 1. Repo validator (PyYAML bootstrapped from scratch/pylibs per architecture C0)
python -I scratch/bcf-2026-11-11/validate_submission.py \
  deliverables/2026-11-11-bcf-gemma4-brain/02-bcf-brain-31b/submission
python -I scratch/bcf-2026-11-11/validate_submission.py \
  deliverables/2026-11-11-bcf-gemma4-brain/03-bcf-brain-e4b/submission
# 2. Brace + schema lint (part of validator; if separate: iter/prompt_lint.py)
#    allowed placeholders exactly: plan {problem_description}; solver {problem_description},{bcf_spec}
#    tools subset of the six scalar core tools; no thinking_level; no forbidden generate_content_config fields
# 3. py_compile under BOTH Pythons (host 3.12 + container 3.13)
python -I -m py_compile <tree>/skills/bcf-spec/scripts/bcf.py <tree>/skills/bcf-spec/scripts/install.py
docker run --rm -v "$ITER/arms/base/submission:/s:ro" python:3.13-slim \
  python -m py_compile /s/skills/bcf-spec/scripts/bcf.py /s/skills/bcf-spec/scripts/install.py
# 4. Official compiler canary (adk-submission installed in the pinned venv; import path VERIFY)
python -I - <<'EOF'
from adk_submission import compile_submission   # VERIFY module path against installed wheel
tree = compile_submission("$ITER/arms/base/submission")
# assert: skills ../skills/bcf-spec resolved; injected skill tools present; install schema ZERO-arg;
#         all tool schemas scalar (no array-typed parameter anywhere)
EOF
```

If the official compiler resolves skills root-relative (O4), apply the one-line Y8 fallback (`skills/bcf-spec`) **in the scratch arm copy**, re-validate, and record in the ledger. C0 is minutes of CPU and prevents a compile-time RUN-zero (02b V4a, rank 2).

### 3.2 L0.6 — parser fuzz without GPU (key bottleneck trick)

The hang lives in `_parse_gemma4_array` — **pure Python inside the vLLM wheel**, not in CUDA (753973/745138; minimal repro `_parse_gemma4_args('args:["Fix list[str] handling"]')` never returns). Therefore C3 needs no server:

1. Locate `vllm/entrypoints/openai/tool_parsers/gemma4_tool_parser.py` in the pinned wheel; verify member SHA-256 `682b2152…b6889` (brief implication 22).
2. Import it in a subprocess (it may import vLLM logging utilities — importing does not initialize CUDA; if the import chain is heavy, extract the file + stub its imports, the 745138 source-bound method). **VERIFY** import feasibility once.
3. Fuzz ≥5,000 bracket-heavy scalar payloads against the EXACT attached schemas (six core tools + zero-arg `run_skill_script`): `list[str]`, `Optional[int]`, `]` inside unquoted elements, the five MarchFederico payloads (753973), plus payloads mined from all 129 problem statements (bracket-heavy issue text is data, not args — but the parser sees whatever the model emits).
4. Each string in its own subprocess with a **2 s hard timeout**; a timeout = hang = FAIL. Assert no array branch is reachable with our scalar-only schemas.

This converts a "needs a live GPU server" canary into a CPU regression that runs on every schema change.

### 3.3 L0.7 — reasoning-drop tokenize repro (CPU half of C4)

On the pinned v31, build a two-turn tool-call conversation; call the chat-template/render path (`chat_utils.py:1512` reads `message.get("reasoning")` — 744354 Lazaros Nov 11 repro) and assert whether `reasoning_content` survives into the next prompt. Output: `reasoning_parity.json` {drops: true/false, wheel sha, repro script}. This tells us which world local L1 runs in; the scorer's state remains UNKNOWN (hedge both — synthesis constraint 21). The GPU A/B half (C4b) is in L1.

### 3.4 L0.5 — the audit that makes every later loop honest

Procedure (full spec in §9.4):

1. **Gold arm:** for each of 129 tasks, run Phase 2 only (Container B bootstrap + 4-pass apply + protected-file reset + test_patch + hermetic pytest, HR §8.2) with `patch = task.patch` from `tasks.jsonl`. No agent, no GPU.
2. **Empty arm:** same with `patch = ""` (or `swegemma eval --skip-agent-patch --task-ids ...`, HR §9.1 — bypasses Phase 1 exactly for this purpose).
3. **Valid = gold passes ∧ empty fails.** Expected ≈68 (756400: fastapi 29, rich 39, requests 0, httpx 0) but environment-dependent (gold counts 43/52/71/73/74/127 across environments — solvability-scoring §2; synthesis contradiction 20). **Our own audit on the exact wheelhouse is canonical** (brief implication 15).
4. Reconcile: the 27 posted missing-lib ids + 4 local candidates; wheel-shadowing fix (remove repo-under-test wheels or put `/workspace` ahead of site-packages) so requests_7309/7315/7427 stop passing empty; drop rich_3468 (passes empty even after fix); mask fastapi_14186 + rich_3486 unconditionally (structural, 755554/757893).
5. Cross-check vs Kirchner's calibrated-sandbox `gold_patch_check.csv` (127/129 ceiling, 751487) — if our gold-pass count is far below 127, our sandbox is mis-provisioned (missing typing_inspection/inline_snapshot/dirty_equals/asttokens/executing closure — solvability-scoring §2); fix the sandbox, not the mask. **Do NOT patch-install packages via agent patches** (legality unanswered, brief implication 15).
6. Freeze `$ITER/subsets/valid_tasks.txt` + sha256 manifest. Backend-conditional watchlist (8 requests network tasks + rich_3472 py3.13) is recorded separately: run them, report them, **never count them in win/loss denominators** unless the local backend matches Docker+no-network+py3.13 (synthesis constraint 18).
7. **Re-verification service (ongoing):** any L2/L3 patch whose resolved status is borderline or surprising gets re-run through the same CPU driver 2–3× (local reruns flip resolved=True→False — 757588 Allan Kipruto; brief implication 19). This is the TechNaom CPU-only re-verification pattern (756400) rebuilt locally.

**Mutation sanity (paper-track grade, optional):** plant inverted-boolean / off-by-one mutants into a sample of solved patches and re-verify; expect ~14.7% escape rate (756400) — "resolved" is an upper bound on correctness (brief implication 20). CPU-only.

---

## 4. L1 — single-task GPU smoke on a warm server

**Purpose:** prove protocol survival (nudges, compaction, restarts, truncation, serving format) on the pinned stack before spending subset-eval time. **Bottlenecks avoided:** cold start per iteration (E6, #1 local cost), full-eval rerun cost (E15), 9p bootstrap tax (E8).

### 4.1 Warm-server doctrine

- Start the pinned server ONCE per work session via `serve_pin.sh` (§9.1). Cold start **4–9 min ESTIMATE** (E6); every subsequent drill batch pays ~0.
- **Batch drills:** one `swegemma eval --task-ids id1 id2 ...` invocation per iteration, not one invocation per task. 8 canary tasks in one call amortize one cold start over ~20 min of agent work instead of 8×(4–9 min) of startup.
- **VERIFY-1 (server reuse across invocations):** the harness binds LiteLlm to `http://127.0.0.1:8000/v1` (HR §3.3). Read the installed `scripts/inference.py::setup_vllm_server` / `VllmServer` to determine whether an already-healthy external server on :8000 is reused or whether the CLI always spawns its own. If it always spawns: either (a) keep each session's drills in ONE invocation (primary plan), or (b) run the evaluator against the external server via the documented env/flag if one exists (do NOT hack the wheel — parity). Record the answer in `$ITER/PINS.txt`. Until verified, assume one startup per invocation and batch accordingly.
- Launch flags mirror the scorer (HR §3.1) at TP1: `--tool-call-parser gemma4 --reasoning-parser gemma4 --enable-auto-tool-choice --default-chat-template-kwargs '{"enable_thinking": true}'`, `--gpu-memory-utilization 0.90`, `--max-model-len` per M2 (§2.2). LoRA buffers: the scorer preallocates `max_loras=8 × rank 128` even with no adapter (research/vllm-serving.md); mirroring that shrinks local KV further. **Decision:** disable LoRA support locally (BCF ships no adapters; functional behavior identical) and record the deviation; revisit only if a LoRA experiment is ever gated in (02b V5: default NO).
- **Concurrency 1 for 31B, always.** Two independent reasons: KV ceiling (~10–24k tokens total ESTIMATE, E5 — a second sequence halves per-seq context), and `run_command` is synchronous and blocks the shared eval event loop — one slow command freezes every concurrent task while budgets tick (747168 gotcha). `--concurrency N` is a trap on this stack, not a lever.
- E4B block: separate server instance (model swap; 31B+E4B cannot co-reside with usable KV — 17+5 GB weights + graphs ≈ 28 GB, ESTIMATE). E4B is fast (**>100 tok/s, 1–1.5 min/task ESTIMATE**, 02a §3); schedule E4B drills as one batched block. E4B multi-process parallelism (2–3 shard processes, each concurrency 1) is plausible on KV but **only after a drill verifies budget isolation** — otherwise keep serial.

### 4.2 Drill battery (architecture C2/C4/C5, exact commands)

All drills run against **scratch arm copies** in `$ITER/arms/`, never the deliverable trees. Canary set (architecture C2): `fastapi_14430 rich_3471 rich_3064 rich_3480 fastapi_14356 fastapi_14371 rich_3935 requests_7433`. **Note:** fastapi_14430/14356/14371 are in the 27 missing-lib exclusion list (756587) — they are excellent *behavioral* drills (agent protocol observable in traces) but can never resolve locally; requests_7433 is backend-conditional. Drill pass/fail is about protocol, not resolve, for these.

```bash
# Happy-path + telemetry batch (C2-1, C2-7): one invocation, warm server
swegemma eval --tasks "$ITER/tasks.jsonl" --snapshots-dir "$ITER/snapshots" \
  --submission-dir "$ITER/arms/base/submission" \
  --results-dir "$ITER/results/L1/base-drills/r1" \
  --sandbox docker --concurrency 1 \
  --task-ids fastapi_14430 rich_3471 rich_3064 rich_3480 fastapi_14356 fastapi_14371 rich_3935 requests_7433 \
  --display auto
```

| Drill | How to force it | Assert (pass criterion) | Est. wall (warm) |
| --- | --- | --- | --- |
| **C2-1 happy path** | batch above | install once; spec cached; first edit ≤call 6; check PASS; patch = library files only. **≥6/8** protocol-pass | 8 × ~2–3 min ≈ **16–24 min** ESTIMATE |
| **C2-2 skill-disable (T2 ladder)** | scratch arm with `skills/` dir renamed | plan still sets `bcf_spec` (fallback brief); no missing-key error; ≥1 solve via manual path | 2 tasks ≈ **5–8 min** |
| **C2-3 nudge-restart + MAX_TOKENS** | scratch arm `max_output_tokens: 512` (forces MAX_TOKENS/truncated-tag exits, HR §5.3) on 2 tasks; then restore 6144 | plan re-entry = **1 call (31B) / ≤3 (E4B)**; `bcf_spec` byte-identical; solver resumes from `state`, zero duplicated edits; **restart tax ≤15 s** (vs 60–90 s unmitigated, 754636); MAX_TOKENS nudge → next call immediately, no re-reasoning | 2 × ~3–4 min ≈ **6–8 min** |
| **C2-4 include_contents:none boundary (HARD gate)** | normal arm, inspect first plan turn in trace | spec correct on FIRST entry ({problem_description} reaches planner regardless of current-turn visibility, O3) | covered by C2-1 batch |
| **C2-5 compaction survival** | fastapi_14371 (d4 multi-file, long trajectory) | post-compaction `state` recovery; patch non-empty; edits coherent; count summarizer calls (M7) | ~3–5 min (compaction events 8–25 s local ESTIMATE, E11) |
| **C2-6 stale-anchor / breaker** | pre-edit the target file in a scratch snapshot copy so the spec anchor is stale | `anchors` reports `absent`; strategy change within 2 failures; **no 3rd verbatim retry** (756051 class unreachable) | ~3 min |
| **C2-7 telemetry (M3/M5–M11)** | every drill above | per-task setup ≤60 s median (agent-timer boundary: `task_start_time` vs `agent_start_time`, HR §7.1 TIP); decode tok/s via dt=a+b·ct regression on trace timestamps (755291 method); compaction/nudge/truncation counts; **extrapolated 120-task total ≤11.0 h** | analysis, CPU, minutes |
| **C4b reasoning-drop A/B** | 4 canary tasks × 2 arms: pinned v31 as-is (drops) vs retention shim (separate venv with the one-line `reasoning`→`reasoning_content` read fixed, or a re-injecting proxy — g4kit-proxy pattern, 745143). Document as deviation | **solve-set delta ≤1 task** (design must be retention-agnostic, architecture C4) | 8 runs ≈ **16–25 min** |
| **C5-local E4B serving** | E4B server block; 3 tasks incl. one full end-to-end + trailing-s copy probe (753277) | model loads under sanctioned alias; tool calls parse; zero-arg install executes; thinking observed off/no-op (HF#26); clean format; copy-fidelity probe results recorded | 3 × ~1–1.5 min + one model swap ≈ **10–15 min** ESTIMATE |

**Y3 gate (conditional arm):** count MAX_TOKENS nudges at 6144 across all L1/L2 traces. Only if they appear, pre-register the 8192 arm (02b Y3: default DON'T — peaks ~3.7k, 755066).

**L1 total per iteration: ~45–75 min warm ESTIMATE** (one cold start 4–9 min if session-cold). Compare: the same questions asked via full evals would cost 3.5–5.5 h each (E15).

### 4.3 Sandbox backend tradeoff (docker vs subprocess)

| Dimension | `--sandbox docker` (default) | `--sandbox subprocess` |
| --- | --- | --- |
| Parity | Matches scorer image (python:3.13-slim), `network_mode=none`, 4 GiB/2 vCPU quota (HR §4.1) | Host venv Python (3.12.13) → **rich_3472-class differences** (py3.13 vs 3.12 AttributeError formatting, 754586); network not air-gapped → requests network tasks behave differently (754586) |
| Speed | docker exec 0.1–0.5 s/round trip Docker Desktop ESTIMATE (E14); ~25 calls/task → +2–12 s/task | No VM hop; leaner; faster mechanical drills |
| Path semantics | `/workspace` real | temp dir `swegemma_sandbox_<id>_` with path rewrites (HR §4.1) — exercises the F3 cwd-agnostic install fix |
| **Use for** | **All L2/L3 scoring runs and parity-critical drills** | Fast mechanical drills only: install/cwd probes, restart-tax timing, skill-disable; never for resolve-rate comparisons |

Keep the 2-vCPU/4 GiB quota in docker (harness default) so bootstrap/pytest numbers predict the scorer (02a §3: desktop CPU without quota underestimates remote `G only` cost).

---

## 5. L2 — stratified 30-task paired A/B (the iteration workhorse)

**Purpose:** decide whether ONE pre-registered change moves solves beyond noise, at ~1/2 the cost of a full masked eval and ~1/10 the cost of a Kaggle slot-cycle. **Bottlenecks avoided:** full-eval rerun cost (E15), noise-driven false promotions (757588/753524), queue (no remote involvement).

### 5.1 Denominator: masking rules (frozen by L0.5 before any A/B)

| Exclusion class | Ids | Source | Disposition |
| --- | --- | --- | --- |
| Structural (any env) | fastapi_14186, rich_3486 | 755554/754586/757893 | **Always masked** |
| Missing test libs (collection fails regardless of patch) | 27 posted fastapi ids (brief §4a) + 4 candidates fastapi_14266/14609/15030/15745 | 756587 + BCF local verification | Mask the 27; **reconcile the 4 by gold+empty on the exact wheelhouse** (L0.5) |
| Empty-pass (free points) | 5 per 756400 (2 fastapi + 3 requests); known: requests_7309/7315/7427 (wheel-shadowing — fixable), rich_3468 (not fixable) | 747248/756400 | Fix shadowing, re-audit, mask whatever still passes empty |
| Backend-conditional | 8 requests network tasks (6589/6592/6629/6757/7328/7433/7502/7505) + rich_3472 (py3.13) | 754586 | Watchlist: run + report separately; count only if local backend matches Docker+no-network+py3.13 |
| Gold-fail other (reference-fix failures 13, timeouts 7, other 2) | per our audit | 756400 breakdown | Masked by the gold∧empty rule automatically |

Expected result ≈ **68 valid (fastapi 29, rich 39)** — but OUR audit is canonical (environment dependence: synthesis contradiction 20). Never A/B on raw 129 (B15).

### 5.2 The frozen dev-30 subset

Selection (script `pick_subset.py`, §9.3): input `valid_tasks.txt` + `taxonomy.json`; **seed 7** (the reproducibility anchor, 02b Y11); stratified without replacement by:

- **Repo quota** proportional to valid counts: 29:39 → **13 fastapi / 17 rich** (requests/httpx contribute 0 valid; they live in the watchlist).
- **Difficulty quota** ≈ population shares (taxonomy §5.2): d1 ~6, d2 ~14, d3 ~6–7, d4+d5 ~3–4.
- **Family coverage:** ≥1 task per root-cause family present in the valid set (all 10 families; docs-content-error has exactly 1 task — fastapi_14492 — force-include; ordering + infinite-loop are rich-only).
- **Kind coverage (secondary):** bugfix dominates (~67%); ensure ≥3 feature tasks and ≥1 each of the non-bugfix kinds present in the valid set (docs, dx, security, dependency-compat, performance) so playbooks for implement-to-spec tasks are exercised (taxonomy insight 3: kind ≠ is_bug).
- **Sparse quota** ~26% (33/129 census-sparse): ≥7 url_only/low_info tasks.
- **Edit-shape mix:** include ≥1 multi-file, ≥1 large (rich_3930), ≥1 new-files (fastapi_15661) — the shape classes where BCF's playbooks differ.
- **Canary overlap:** include the valid C2 canaries (rich_3471/3064/3480/3935) so L1 and L2 speak about the same tasks.

Output: `subsets/dev30.txt` + `dev30.manifest.json` (ids + sha256 of the list + selection seed + strata counts) — mirroring the YosQuant IDs+checksums practice (750907). **The subset is frozen for the whole week; changing it invalidates cross-arm comparability** (new subset = new baseline runs).

**Illustrative provisional draw** (shape-check only — the frozen set is whatever `pick_subset.py` produces AFTER the L0.5 audit; several candidates below may fail our gold audit):

| Repo | Tasks (difficulty · family) |
| --- | --- |
| fastapi (13) | 14258 (d1·missing-cap), 14492 (d1·docs-content), 14786 (d1·boundary), 11194 (d2·type-intro), 13537 (d2·boundary), 14077 (d2·compat-shim), 14873 (d2·state-lifecycle), 15588 (d2·missing-cap/security), 9425 (d2·type-intro/feature), 13207 (d3·schema-gen), 15763 (d3·boundary), 15661 (d3·new-files/dx), 14448 (d4·type-intro/multi-file) |
| rich (17) | 3471 (d1·api-contract), 3067 (d1·boundary), 2943 (d1·state-lifecycle), 3064 (d2·boundary/url_only), 3935 (d2·api-contract/url_only), 2725 (d2·ordering), 3480 (d2·infinite-loop/url_only), 3063 (d2·boundary), 3470 (d2·state-lifecycle), 3944 (d2·boundary), 3052 (d2·missing-cap/feature), 3772 (d3·infinite-loop), 3521 (d3·boundary), 4070 (d3·missing-cap; performance kind), 3938 (d3·boundary/multi-file), 3061 (d4·state-lifecycle), 3930 (d5·large/missing-cap) |

Covers all 10 families, 7 kinds (bugfix/feature/security/dx/docs/dependency-compat/performance), d1–d5, all five edit-shape classes, 4 sparse + 1 new-files. The draw is deliberately short of the ≥7 sparse quota — `pick_subset.py` repairs it with within-stratum swaps (e.g. rich_3469/3472-class url_only tasks) when it produces the FROZEN set. Held-out complement: the remaining ~38 valid tasks are the **confirmation set** — never looked at during screening (750907 protocol: fixed 30 + held-out).

### 5.3 Paired-repeat protocol (win-both + McNemar)

For each arm pair (A = current champion, B = challenger), **one variable changed** (02b lever ids):

1. **Pre-register** (§8): hypothesis, lever, exact diff, predicted effect + mechanism, decision rule, noise floor — frozen in `prereg.md` + ledger BEFORE the first run. No post-hoc rule changes.
2. Run A and B on dev30, **same day, same warm server, same seed 7, same PINS** — repeat 1. Then repeat 2 (fresh results dirs; identical config). Screen-first economics: run repeat 1 of both arms (~2.3 h); only if B is promising (Δ ≥ 0 and no protocol regression) spend repeat 2 (~2.3 h). A clearly dead arm dies after one repeat.
3. **Decision rule (pre-registered default):**
   - **Win-both:** B's resolve count > A's in BOTH repeats (750907: "A change only counts if it wins on both").
   - **Noise floor:** the governing rule is *single-run deltas <4 tasks / <0.03 are noise* (σ≈2 tasks/58; architecture C6/02b §0). Scaling σ by √(n/58): on dev30 the 2σ floor is **≈3 tasks** (ESTIMATE derivation, §11); on the 68-set ≈4 tasks (consistent with the stated rule). Deltas below floor → "noise, no promotion" regardless of direction.
   - **Significance:** exact McNemar on discordant pairs per repeat (two-sided binomial on (b+c, min(b,c))); require same direction in both repeats AND pooled p ≤ 0.05, OR win-both with pooled Δ ≥ 4 tasks over the 60 paired observations. Wilson 95% CIs reported per arm (756315 convention).
   - **Protocol regression veto:** any new RUN/TASK-class failure (empty patch, overflow, hang, parser hang, duplicated edits) in B's traces vetoes promotion even if solves tie — reliability regressions are how 0.18→0.01 happens (750521).
4. **Promotion:** B becomes champion only after L3 confirmation (§6) on the full 68 + held-out. L2 alone promotes to "candidate", never to a submission.
5. Every run appends to the ledger (§8) — including nulls and negatives (Rodrigues-style "records what did not work", 751973).

### 5.4 Wall-time math and parallelism (honest version)

Per-task local 31B: expected agent 2.5–3.2 min remote-equivalent × 0.6–0.8 decode delta (E15) ≈ 1.5–2.6 min + local bootstrap ~0.2–0.4 min (E7+E9+E10) → **planning value 2.3 min/task** (range 1.7–3.0).

| Configuration | Task-runs | Wall (ESTIMATE) |
| --- | --- | --- |
| L2 screen: 2 arms × 30 × 1 repeat | 60 | **~2.3 h** (1.7–3.0 h) |
| L2 full: 2 arms × 30 × 2 repeats | 120 | **~4.6 h** (3.4–6.0 h) — overnight |
| L2 E4B full (1.2 min/task ESTIMATE, 02a §3) | 120 | **~2.4 h** |
| L3 confirm: 68 × 2 repeats (one arm vs champion = 2 arms → 272) | 136/arm | **~5.2 h/arm** (3.9–6.8 h) |

**Concurrency/sharding reality on one 5090:**

- 31B: `--concurrency 1` (KV + blocking run_command, §4.1). There is no safe intra-GPU parallelism for 31B; do not chase it.
- **Sharding is still useful** (`--shard-index k --num-shards M`, deterministic `task_idx % M == k`, HR §9.1): (a) split overnight runs into 4 restartable chunks — a crash at task 60 costs 15 tasks, not 60 (results are append-only/crash-safe per HR §9.2, but a dead server kills the whole invocation); (b) run the M shards as M **separate processes** for E4B (each concurrency 1) once KV headroom is measured — process isolation avoids the shared-event-loop budget contamination; (c) CPU-only Phase-2 re-verification shards run 4-wide in parallel with GPU work (different resource).
- **Overlap CPU and GPU lanes:** while the GPU runs L2/L3 overnight, the CPU lane runs audits, replay, locbench, lint, and trace analysis (M5–M11). This is the single biggest wall-clock win after warm servers: the 02a inventory shows most analysis work is CPU-bound.
- Phase 2 adds ~0.3–0.5 min/task local wall (OUT of the remote 12 h per docs reading, but real local time — 02a §2 Phase-2 row); it is included in the planning values above.

### 5.5 Arm queue (from 02b, ordered by score × cheapness)

One variable per arm; engine arms require both-track sync + C1 re-run BEFORE L2 (N2).

| Order | Arm (02b id) | Change | L0 evidence first | Predicted effect (pre-register) |
| --- | --- | --- | --- | --- |
| 1 | **Y1** planner-only thinking_budget 0 (or 256) | inline planner config; solver keeps 2048 | C0 lint + C2-3 restart drill | −10–30 s per restart/first entry (O2); solves ≥ parity; restart tax ≤15 s |
| 2 | **Y2** temperature 0.2→0.0 [ARM N4] | sampling.yaml | C0 lint | equal solves, faster decode (755066 n=376); syntax reliability must not regress |
| 3 | **P1** statement copy 1,500→3,000 chars (31B only) | bcf_plan.md | **C1 re-run hit@k delta (CPU, today)** | deeper traceback cues recovered; hit@3 non-regression; +4–16 s decode (E13) bounded |
| 4 | **E1+E2** family priors + Target candidate edit lines | bcf.py (both tracks) | C1 full battery + join_words smoke + locbench | anchors hit the edit site, not the def line (e4b §3.2); uniqueness ≥90% held |
| 5 | **Y14** E4B thinking 0→2048 [contested] | E4B sampling.yaml | C5-local observes effective thinking | fix-authoring aid OR output-allowance squeeze; E4B-only decision |
| 6 | **E4** strike window-granular exclusion | bcf.py | C2-6 drill + C1 | fewer wasted 2-strike cycles; no anchor-starvation |
| 7 | **Y4** cap decision (not an A/B — a measurement-gated config edit) | eval_config.yaml | C2-7 setup telemetry | apply §8 rule the moment telemetry lands (§6.3) |

**Do-not-tune list is binding** (02b §I): compaction settings, ADK version, array args, thinking_level, include_thoughts:false, top_p<0.95, repair cycles>2, apply cap>120, prompt-only exhortations, public-id embedding, split probing.

---

## 6. L3 — full masked local eval + OOD proxy (overnight, sharded)

**Purpose:** confirmation beyond the dev30 screen, the 12 h wall-clock envelope, and the only honest generalization signal (hidden = private repos; public→hidden transfer is weak — 756400/751973, brief implication 17).

### 6.1 Overnight run procedure

```bash
# Champion vs candidate on the full masked valid set, 2 repeats, 4 restartable shards each.
for arm in champion candidate; do
  for rep in r1 r2; do
    for k in 0 1 2 3; do
      swegemma eval --tasks "$ITER/tasks.jsonl" --snapshots-dir "$ITER/snapshots" \
        --submission-dir "$ITER/arms/$arm/submission" \
        --results-dir "$ITER/results/L3/$arm/$rep/shard$k" \
        --sandbox docker --concurrency 1 --shard-index $k --num-shards 4 \
        --task-ids $(cat "$ITER/subsets/valid_tasks.txt") --display auto
    done
  done
done
# Merge: cat shard*/task_results.jsonl > merged.jsonl; recompute summary; compare_paired.py (§9.2)
```

Shards run sequentially on the one GPU (31B); the sharding buys crash-restart granularity and a clean merge, not parallelism (§5.4). Wall: **~5.2 h/arm ESTIMATE** (68 × 2 × 2.3 min) → champion+candidate ≈ 10.4 h = two overnights, or one overnight if the candidate already won L2 and only its 2 repeats are needed (champion L3 numbers reused within the same PINS week). E4B: ~2.7 h/arm.

**Watchlist add-on:** the 9 backend-conditional tasks run once per night in a separate results dir (reported, never in the denominator). A raw-129 stress run is scheduled ONCE before finals for N=129 setup/wall telemetry (the §8 stress case) — scored denominator stays masked.

### 6.2 OOD proxy (generalization gate)

| Proxy | What it is (local evidence) | Local plan | Cost |
| --- | --- | --- | --- |
| **OOD-45** | 45 post-release bug fixes, 17 projects, swegemma format; **43/45 statements leak part of the fix → use the shipped REWRITTEN statements**; fixed runner resolves gold 44/45 (750573) | Prerequisite: user fetches `rodrigospalma/ood45-bugfix-split` + evaluate notebook (free Kaggle datasets; **user action — this design does not fetch**). Self-host; run all 45 with the fixed runner, 1 repeat per arm | 45 × 2.3 min ≈ **1.7 h/repeat ESTIMATE** |
| **FreshSWE-Py** | 663 validated post-release tasks, 33 repos + `validation/scorer_audit.json` + `public_tasks.jsonl` per-task flags (757893/751707) | User fetches `moshegolderson/freshswe-py`; stratified **60-task draw** (seed 7, repo-balanced) for speed; use scorer_audit flags to mask convention-blocked tasks; full 663 only pre-finals if time allows | 60 × 2.3 min ≈ **2.3 h/repeat ESTIMATE** |
| **locbench (L0.4)** | GPU-free localization probe (756315 method, rebuilt locally on full-repo snapshots) | runs in the CPU lane continuously | minutes |

OOD gates the levers that public data must NOT tune (02b E9/E11/E24: ranking weights, classify vocab, subsystem map — "OOD-gated only"). **Pass criterion:** candidate ≥ champion − noise floor on OOD (non-regression), even if it won on public dev30. A public-only win with an OOD loss is the 751973 anti-correlation trap (local 9–0 win → worse hidden) → **reject**.

### 6.3 Total-time projection vs 12 h (the Y4 decision rule)

From C2-7/L3 telemetry, per track:

```text
T_remote_extrapolated = startup_remote + N × (agent_remote_equiv + setup_remote)
  agent_remote_equiv  = local_agent_seconds × k_cal        (M12 calibration, below)
  setup_remote        = max(measured_local_setup × k_cpu, 60 s design floor)   # 2-vCPU quota parity
  startup_remote      = 600 s design (12.6 min MEASURED remote, 746250)
  N                   = 120 design / 129 stress
```

- **k_cal (local→scorer calibration, M12):** seconds-per-million-model-tokens (prompt+completion incl. repeated context) on local sequential runs vs the Kaggle 4xL4 reference (747857 method; the B40 factor was 1.2547 — rederive for the 5090, never under concurrent load). Until the first L4 scored run lands, use the decode-ratio band 1.5–2.3x (E2) with prefill-heavy steps NOT sped up (E3) — i.e., calibrate per-step-class, not one global factor. Mark k_cal ESTIMATE until L4.
- **Decision rule (architecture §8, binding):** ship caps 4.5/4.0. **Raise 31B to 5.0 ONLY if measured setup ≤35 s/task AND extrapolated 120-task total ≤11.0 h. Lower 31B to 4.0 if setup ≥65 s/task OR N≥125 confirmed.** E4B 240 s safe through N=149 at 45 s setup. Worst-case reference: 31B N=129 at 4.5 min = 43,170 s = 11.99 h **without reserve** (marginal — O7); +1,800 s reserve at N=120 → 11.67 h. Both finals must independently finish <12 h (better-of-two; error-fallback unanswered — synthesis #15). Never rely on the >12 h-scored anomalies (contradiction 4).
- **Phase-2 caveat:** exclusion from the 12 h clock is a docs reading, not staff-confirmed enforcement (752017/748618 unanswered; 02a §7.3). Plan as if everything except queue counts; keep ≥1–2 h headroom. `timeout_seconds` 180/150 also bounds grading pytest (745805 item 3) — the 3 no-patch hang tasks are why the cap stays in the 150–300 band.

**L3 gate:** win-both on 68 (§5.3 rules, 4-task floor) ∧ OOD non-regression ∧ extrapolated ≤11.0 h/10.5 h ∧ zero new RUN-class failures → candidate is **slot-eligible** (still needs §7.2 checklist).

---

## 7. L4 — Kaggle submission loop (scarce slots)

**Purpose:** calibrate local→scorer transfer, learn hidden-repo failure classes, and select the two finals. **Bottleneck:** the queue itself — 36–52 h stalls (Nov 9–11 wave), one-pending gate (`400 FAILED_PRECONDITION`), no cancel, 1/day, rescore paused since Sep 28 (02a §2; 747519/757993/743683).

### 7.1 Slot economics (plan for lossy slots)

Nov 12 → Dec 2 = 21 days. At 36–52 h queue+run per cycle and the one-pending gate, **realistic throughput ≈ 8–11 scored runs** (ESTIMATE: 21 days / ~2 days per cycle). The ~70 total cap is not binding; the queue is. Budget: 1 calibration run early (Nov 12–13), ~1 run/week on the evolving champion, 2–3 runs in the finals window (Nov 25–Dec 1) for the two final selections + one emergency re-run. **Never batch final-day submissions** (synthesis constraint 20). Entry/merger deadline Nov 25; paper track Nov 12 (separate, imminent — flag to user).

### 7.2 Pre-slot checklist (every submission, no exceptions)

| # | Check | Evidence it passes |
| --- | --- | --- |
| 1 | **C0** validator 0 errors both trees + official `compile_submission` canary; skills-path resolution confirmed; injected skill-tool schemas scalar/zero-arg | L0.1 output archived with the ZIP |
| 2 | **C1** engine battery green on the EXACT shipped bcf.py sha (both tracks byte-identical, N2) | `bcf_full_results_<label>.json` + sha match |
| 3 | **C2** all drills pass on the pinned wheelhouse (incl. C2-4 HARD gate); setup ≤60 s median; restart tax ≤15 s | L1 results dir |
| 4 | **C3** parser fuzz zero hangs on the shipped schemas | L0.6 report |
| 5 | **C4** reasoning-drop parity: solve-set delta ≤1 (retention-agnostic confirmed) | L0.7 + C4b |
| 6 | **C5** E4B serving canary end-to-end clean (before ANY E4B slot; 752128 intermittent "incorrect format" is scorer-side — local pass is necessary, not sufficient; if possible run the canary in an unscored Kaggle notebook session first) | C5-local + notebook canary |
| 7 | **C6** replicated masked-set evidence: win-both on 68 + OOD non-regression + extrapolated ≤11.0 h/10.5 h; caps per §8 decision rule | L3 report + ledger decision |
| 8 | **C7 ops** ZIP <3 GiB unpacked (BCF ~90–160 KB, trivial); ZIP sha recorded; validated fallback bundle (same tree, tighter caps) ready; submit **early in the day**; monitor PENDING; escalation text with submission ids ready for 747519/743683 | ops log |
| 9 | Open staff threads re-checked before locking finals (753973 parser, 744354 reasoning parity, 757149 URL-only, 757244 bonus deadline, 756963 timeout semantics) — zero staff replies as of Nov 11; plan for the environment AS-IS | capture note |

### 7.3 What to learn from each scored run (triage tree)

1. **Run completed, score present:** compare vs local 68-valid prediction → update k_cal and the transfer-gap model (local screens mis-rank hidden: 751973). A gap > noise floor is a *generalization* signal, not a bug — feed OOD analysis.
2. **Notebook Timeout / no score:** the 12 h kill (or queue-hung run). Pull per-task wall if exposed; recompute §6.3 with the observed setup; lower caps per the decision rule; **the slot is burned — do not panic-resubmit the same ZIP** (rescore paused; B9).
3. **Kaggle Error / "incorrect format":** infra/format class (752128). Wait for staff batch recovery precedent (743964) before resubmitting; verify bundle with the official compiler again; if E4B, hold the bonus slot (C5 fail posture: ship 31B-only finals).
4. **Score ≪ local (≥10-task gap):** suspect the SECOND noise regime — parser freeze / server stall (0.18→0.01 byte-identical ZIP, 750521), not sampling. Check whether traces show consecutive 0-LLM-call tasks at the per-task cap (753973 signature). Re-run C3 on any schema delta; do not attribute to sampling noise.
5. **If `submission.parquet` ([id, prediction], HR §2.2/§8.1) or traces/logs are exposed in the scored notebook's output:** download; diff per-task predictions vs local runs of the same bundle; classify hidden-repo failures (wrong-file edits, compaction amnesia, sparse-statement stalls) → **new L0 fixtures + L1 drills**. **Boundary: this is failure-class triage only. Never use per-task outcomes to identify the public/private split for probing** — 240+ submissions vs ~70 cap, variance defeats single probes, ban risk, no staff ruling (B21/S19; 757626).
6. Every outcome → ledger row (including "queue ate the slot" rows — they calibrate the throughput model).

### 7.4 Finals selection (Nov 25–Dec 1 window)

Two finals = one 31B + one E4B (better-of-two private scoring, 752220; both independently <12 h). Select on **cross-task-mix robustness, not single-run peaks** (synthesis constraint 15/19): champion = the config with the best *worst-repeat* masked-68 + OOD record. E4B slot only if C5 passed AND L2/L3 produced a replicated non-zero resolve rate (0 replicated solves → ship 31B-only posture, 02b §J). Bonus deadline working assumption Dec 2; safe internal milestone Nov 12 (757244 ambiguity unresolved). E4B target context: 4–6 tasks (0.06–0.10) plausibly wins the $10k in a thin field (prior-art §11 crossexam) — but that is a field estimate, not a gate.

---

## 8. Hypothesis ledger + pre-registration discipline

### 8.1 Ledger schema (CSV, append-only)

File: `$PROJ/scratch/bcf-hardening-2026-11-11/iter/ledger.csv` (mirrored to `$ITER/ledger.csv`). One row per hypothesis; runs accumulate in the `runs` field; **never delete rows** (nulls are evidence).

| Column | Type | Meaning |
| --- | --- | --- |
| `id` | str | H-001, H-002, … (monotonic) |
| `date_opened` | ISO date | when pre-registered |
| `hypothesis` | str | one sentence, mechanistic ("Planner thinking is a pure decode tax on a mechanical stage; removing it frees 10–30 s/restart without fidelity loss") |
| `lever` | str | 02b lever id (Y1, E1, P1, V1, …) or NEW |
| `change` | str | exact file(s)+field(s)+values; engine changes note both-track sync |
| `predicted_effect` | str | direction + magnitude + mechanism, falsifiable ("restart tax 30 s→≤15 s; solves Δ≥0 on dev30") |
| `loop` | enum | L0 / L1 / L2 / L3 / L4 (highest loop reached) |
| `prereg_hash` | str | sha256 of `prereg.md` frozen BEFORE the first run (rules-before-run, Rodrigues 751973) |
| `runs` | str | semicolon-separated run-ids (`L2/Y1/r1` …) with results-dir paths |
| `result` | str | metrics: resolve A/B per repeat, McNemar p, Wilson CIs, telemetry deltas, OOD delta |
| `decision` | enum | `promote-L1` / `promote-L2` / `promote-L3` / `slot-eligible` / `reject` / `iterate` / `noise` / `blocked` |
| `decision_date` | ISO date | |
| `evidence` | str | paths to results dirs / reports / traces |
| `notes` | str | confounds, deviations, follow-ups |

Markdown mirror (human-readable board, generated from the CSV):

```markdown
| id | hypothesis | lever | change | predicted | loop | runs | result | decision |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
```

### 8.2 Seeded examples (the first week's ledger, pre-registered)

| id | hypothesis | lever | change | predicted effect | loop | decision rule (frozen) |
| --- | --- | --- | --- | --- | --- | --- |
| H-001 | The 68-valid mask reproduces on our exact wheelhouse; the 4 candidates are missing-lib failures | V1 | audit only, no bundle change | gold-pass ≈73±3; valid ≈68; 4 candidates fail gold | L0 | freeze mask iff gold∧empty audit complete + Kirchner cross-check explained |
| H-002 | Planner thinking is a decode tax, not a fidelity need | Y1 | bcf_plan.yaml inline thinking_budget 0; solver 2048 | restart tax ≤15 s; spec byte-identical; dev30 Δ≥0 | L1→L2 | C2-3 pass → L2 win-both + McNemar; any spec-fidelity failure → reject |
| H-003 | temp 0.0 = speed at equal score on THIS stack | Y2 | sampling.yaml temperature 0.0 | equal solves (±noise), faster first-edit; tool-syntax failures ≤ baseline | L2 | win-both + syntax-failure veto; per-harness, not transferable (contradiction 23) |
| H-004 | Deep statement cues (1,500–3,000 chars) improve localization on long-traceback tasks | P1 | bcf_plan.md copy cap 3,000 (31B only) | C1 hit@3 Δ≥0; dev30 Δ≥0; +≤16 s plan decode | L0→L2 | C1 non-regression gates GPU spend; E4B excluded (copy-corruption risk) |
| H-005 | Anchors point at def lines, not edit sites, in the 5 unpatterned families (70/129 tasks) | E1+E2 | bcf.py _family_lines priors + Target candidate edit lines (both tracks) | anchor edit-site hit ↑ on join_words-class smoke; uniqueness ≥90% held; dev30 Δ≥+2 | L0→L2 | C1 + locbench first; any uniqueness regression → reject |
| H-006 | E4B thinking 2048 aids fix authoring more than it squeezes output | Y14 | E4B sampling.yaml thinking_budget 2048 | C5 observes effective thinking; E4B dev30 Δ≥+1 with truncation nudges ≤ baseline | L1→L2 | contested arm; C5 gate; output-squeeze veto (4096 allowance shared) |

### 8.3 Pre-registration discipline (rules before run)

1. Write `prereg.md` (hypothesis, exact diff, predicted effect, decision rule, noise floor, veto conditions) and hash it into the ledger **before** the first run of the arm. `ledger_append.py` refuses a `result` entry without a `prereg_hash`.
2. One variable per arm. Bundled changes (e.g., E1+E2) are pre-registered as ONE mechanism with a joint prediction; if it wins, an ablation arm decides attribution only if the mechanism is contested.
3. No threshold edits after seeing data. If the rule was wrong, record `iterate`, open a NEW hypothesis with a new pre-registration — never rewrite history.
4. Nulls and negatives are logged with the same rigor as wins (the field's published scores are best-of-N inflated; our ledger is the antidote — 757588/751973).
5. Every results dir carries `prereg.md` + `arm.diff` + `PINS.txt` so any row is reproducible months later.

### 8.4 Promotion / demotion state machine

```text
idea → [L0 gates: C0/C1/audit/fuzz/locbench] → [L1 drills: C2/C4/C5 protocol]
     → [L2 dev30: win-both + McNemar + noise floor + protocol veto] → candidate
     → [L3 68×2 + OOD + ≤11.0h extrapolation] → slot-eligible
     → [L4 checklist §7.2] → submitted → scored → champion (if transfer holds)
```

| Transition | Rule |
| --- | --- |
| Promote L0→L1 | All applicable CPU gates green on the exact arm bytes |
| Promote L1→L2 | C2 pass criteria met; no HARD-gate failure (C2-4); telemetry within envelope |
| Promote L2→L3 | Win-both + significance + above noise floor + no protocol veto (§5.3) |
| Promote L3→slot | §6.3 gate + §7.2 checklist; user approves the copy-back into the deliverable tree |
| **Demote champion** | Any L4 run shows a RUN-class failure signature, OR a later L3 re-run (fresh week/PINS) loses win-both to the previous champion, OR OOD regresses beyond floor → revert to the last slot-eligible bundle; the fallback bundle (tighter caps) is always validated and ready (C7) |
| Freeze | Configs freeze only on win-both replicated evidence (architecture §11); engine bytes freeze per build with sha recorded both tracks (N2) |
| Kill switch | Any parser-fuzz hang, any missing-key bcf_spec, any empty-patch overflow class → stop the ladder, fix at L0, re-climb from the affected rung |

---

## 9. Script sketches (precise enough to implement)

All scripts: stdlib-only where possible, `python -I` invocation, live in `$PROJ/scratch/bcf-hardening-2026-11-11/iter/`, copied to `$ITER/bin/`. Each appends STARTED/DONE/FAILED to `$PROJ/_progress/iteration.log`.

### 9.1 `serve_pin.sh` — warm pinned server (bash)

```bash
#!/usr/bin/env bash
# usage: serve_pin.sh {31b|e4b}   — starts the pinned vLLM server if not healthy; waits; prints KV size
set -euo pipefail
MODEL_DIR="$ITER/models/${1:?31b|e4b}"; PORT=8000; LOG="$ITER/server_${1}.log"
if curl -sf "http://127.0.0.1:$PORT/health" >/dev/null; then echo "warm: reusing server"; exit 0; fi
# max_model_len from M2 decision file (hybrid-32k / fp8-16k / bf16-10k); recorded as parity deviation
MAXLEN=$(cat "$ITER/config/max_model_len.txt")
nohup vllm serve "$MODEL_DIR" --tensor-parallel-size 1 --port "$PORT" \
  --max-model-len "$MAXLEN" --gpu-memory-utilization 0.90 \
  --tool-call-parser gemma4 --reasoning-parser gemma4 --enable-auto-tool-choice \
  --default-chat-template-kwargs '{"enable_thinking": true}' \
  > "$LOG" 2>&1 &
# health wait: 1200 s ceiling (749191 health-timeout precedent); poll /health every 5 s
for i in $(seq 1 240); do curl -sf "http://127.0.0.1:$PORT/health" >/dev/null && break; sleep 5; done
grep -m1 "GPU KV cache size" "$LOG"   # M2: record N tokens; abort if N < MAXLEN
# NOTE: no --enable-lora (BCF ships no adapters; deviation recorded in PINS.txt, §4.1)
```

### 9.2 `run_subset.sh` — one eval invocation per arm/repeat (bash)

```bash
#!/usr/bin/env bash
# usage: run_subset.sh <loop> <arm> <run> <subset-file> [extra swegemma flags...]
# e.g.:  run_subset.sh L2 Y1-temp0 r1 subsets/dev30.txt
set -euo pipefail
LOOP=$1 ARM=$2 RUN=$3 SUBSET=$4; shift 4
OUT="$ITER/results/$LOOP/$ARM/$RUN"; mkdir -p "$OUT"
cp "$ITER/PINS.txt" "$OUT/"; cp "$ITER/arms/$ARM/prereg.md" "$OUT/" 2>/dev/null || true
(cd "$ITER/arms/$ARM" && git diff > "$OUT/arm.diff" 2>/dev/null) || diff -ru "$ITER/arms/base/submission" "$ITER/arms/$ARM/submission" > "$OUT/arm.diff" || true
printf '%s STARTED %s/%s/%s subset=%s\n' "$(date -u +%FT%TZ)" "$LOOP" "$ARM" "$RUN" "$SUBSET" >> "$PROJ/_progress/iteration.log"
bash "$ITER/bin/serve_pin.sh" 31b                      # warm-server reuse (VERIFY-1: harness may spawn its own)
swegemma eval --tasks "$ITER/tasks.jsonl" --snapshots-dir "$ITER/snapshots" \
  --submission-dir "$ITER/arms/$ARM/submission" --results-dir "$OUT" \
  --sandbox docker --concurrency 1 --task-ids $(cat "$ITER/$SUBSET") --display auto "$@" \
  && STATE=DONE || STATE=FAILED
printf '%s %s %s/%s/%s\n' "$(date -u +%FT%TZ)" "$STATE" "$LOOP" "$ARM" "$RUN" >> "$PROJ/_progress/iteration.log"
rsync -a "$OUT/" "$PROJ/scratch/bcf-hardening-2026-11-11/iter/results/$LOOP/$ARM/$RUN/"   # archive to Windows side
python -I "$ITER/bin/ledger_append.py" --run "$LOOP/$ARM/$RUN" --summary "$OUT/summary.json"
```

### 9.3 `pick_subset.py` — stratified frozen draw (python)

Input: `valid_tasks.txt` (L0.5), `$PROJ/scratch/bcf-2026-11-11/taxonomy.json`, `--n 30 --seed 7`. Logic: (1) join valid ids with taxonomy assignments (repo/kind/family/difficulty/edit_shape) + sparse flags from the empirical appendix; (2) repo quotas by proportional allocation (13/17); (3) within repo, stratified sample without replacement hitting difficulty quotas (d1 6 / d2 14 / d3 6–7 / d4+d5 3–4, largest-remainder rounding); (4) constraint repair: force-include singleton-family tasks (fastapi_14492), ensure ≥1 per family, ≥7 sparse, ≥1 each multi-file/large/new-files, kind coverage (≥3 feature + ≥1 per non-bugfix kind present), include valid C2 canaries; swap within stratum to repair, deterministic under seed; (5) emit `subsets/dev30.txt` + `dev30.manifest.json` {ids, sha256(list bytes), seed, strata counts, selection timestamp}. Refuse to overwrite an existing frozen subset without `--force-new-week` (changing the set invalidates comparability).

### 9.4 `verify_patches.py` — CPU-only Phase-2 driver (python)

Input: `--arm {gold,empty,agent} --tasks tasks.jsonl --patches-dir <dir> --ids <file|all> --concurrency 4 --results <out.jsonl>`. Logic per task: (1) fresh Container B via the installed swegemma API — `from swegemma... import verify_task` / `Evaluator` (**VERIFY exact import against the 0.2.11 wheel**; fallback: replicate HR §8.2 with `docker run` + the 7 `container_setup.py` steps, 4-pass apply, protected-file reset, test_patch, the exact hermetic pytest command incl. `-p no:anyio -o timeout=0` and JUnit validation); (2) patch source: gold = `task.patch`; empty = ""; agent = `results/.../patches/<iid>.patch`; (3) record {iid, arm, resolved, exit_code, junit_valid, apply_pass, wall_s, error}; (4) ThreadPool over containers (CPU-only; 2 vCPU quota each; concurrency 4 on a ≥8-core desktop — ESTIMATE, verify core count); (5) `--repeat 3` mode for borderline re-verification (flip detection). Empty arm shortcut: `swegemma eval --skip-agent-patch` (HR §9.1) needs no agent and no GPU. Output feeds `valid_tasks.txt` (gold ∧ ¬empty) and the ledger.

### 9.5 `replay_edits.py` — edit-call funnel (python, E2B method 756433)

Input: `--traces <results dirs> --snapshots $ITER/snapshots [--synthetic]`. Logic: (1) parse `traces/trace_<iid>.json` (ATIF steps) → ordered `edit_file`/`write_file` calls with raw args; (2) extract the task snapshot fresh (CPU, ~2–5 s, E7); (3) replay each call through `adk_eval_core.apply_replacement` (the harness's own 3-tier engine — exact/flexible/regex, HR §6.2) against the evolving file state; (4) classify outcomes: ok / old_string-absent / non-unique / escaped-residual (literal `\n` written — 744272) / backtick-swallow (old_string missing, new_string ends `` `,old_string: `` — 756051); (5) detect verbatim retries via sha256 of normalized args → funnel metrics: failure rate, **verbatim-retry share of failures** (E2B baseline ~75%), wrong-file rate vs gold patch files, identical-call streaks (max streak; the 51-call class); (6) `--synthetic` mode injects the documented failure patterns as fixtures BEFORE any GPU traces exist (bootstrap); (7) `--anchors-arm` replays the same intended edits via `bcf.py anchors`+`apply` to measure the counterfactual failure rate. Output: funnel JSON + per-class counts → ledger + L0 gate (zero 3rd-identical calls).

### 9.6 `locbench.py` — budget-matched localization probe (python, 756315 method)

Input: `--ids <file> --selectors bcf,grep,bm25,oracle,floor --budget-chars 12000 --repo-root full|sources`. Logic: (1) per task, extract the FULL snapshot (fixes the ≤18-file extraction bias, empirical §2) or use `sources/`; (2) each selector returns a ranked context bundle ≤ the SAME character budget: `bcf` = spec candidates + anchors windows; `grep` = first identifier-grep hits (747980 baseline: top-1 30%); `bm25` = BM25+grep fusion (top-5 61% baseline); `oracle` = gold locus (ceiling); `floor` = random files (floor); (3) score: gold-file hit@k AND gold-line coverage within budget (the edit-site metric, not just file finding); (4) exact McNemar between selector pairs + Wilson 95% CIs; (5) runtime guard per selector (bcf cold ≤8 s target / 20 s guard on full repos — exercises E6/E7/E19 at 2,600-file scale, empirical §12). Output: comparison table → gates E9/E11/E24 tuning (with OOD confirmation, never public alone).

### 9.7 `compare_paired.py` — win-both + McNemar verdict (python)

Input: `--a <armA results dirs r1,r2> --b <armB dirs r1,r2> --subset dev30.txt`. Logic: (1) load `task_results.jsonl` per dir → {iid: resolved bool}; missing/crashed tasks = unresolved but flagged separately (a crash is a protocol veto, not a silent 0); (2) per repeat: Δ = B−A; discordant counts b (A✓B✗), c (A✗B✓); **exact McNemar** two-sided p = binom test on (b+c, min(b,c)) — implement via `math.comb` sum (stdlib, no scipy); (3) Wilson 95% CI per arm per repeat; (4) verdict: `win-both` = Δ>0 in both repeats; `noise` = |Δ| < floor (floor = ceil(2·2·√(n/58)) → 3 on 30, 4 on 68; configurable, pre-registered); `significant` = same-direction win-both ∧ pooled p≤0.05, or win-both ∧ pooled Δ≥4; (5) protocol veto scan: empty patches / overflow / hang signatures in B traces; (6) emit `verdict.json` + a ledger-ready markdown row + per-task discordance list (the tasks to drill at L1). Deterministic, stdlib-only.

### 9.8 `ledger_append.py` — append-only ledger writer (python)

Input: `--open <prereg.md> --id H-NNN --lever Y1 ...` (creates row, computes prereg_hash) or `--run <loop/arm/run> --summary <summary.json> --result "..." --decision <enum>` (appends run to existing row). Enforces: result entries require an existing prereg_hash; decision enum validation; append-only (no edits/deletes — corrections are new rows referencing the old id); CSV + regenerated markdown mirror; timestamped log line. Stdlib `csv`/`hashlib`.

---

## 10. First-week schedule (RTX 5090; WSL2 primary, Zorin fallback)

Two lanes every day: **GPU lane** (warm server, drills/evals) and **CPU lane** (audits, batteries, analysis, script-building). Overnight = unattended sharded evals. All times local; dates 2026. **Conflict flag: paper-track deadline is Nov 12 23:59 UTC (tomorrow) — if the user wants the paper, Day 1 reserves 2–3 h for it; the schedule below assumes the competition track takes priority after a go/no-go tonight.**

| Day | GPU lane | CPU lane | Deliverables / gates |
| --- | --- | --- | --- |
| **Nov 11 (tonight)** | — (no GPU work yet) | L0.1 C0 validator+compiler canary both trees; L0.2 C1 battery re-run on shipped sha; create ledger + pre-register H-001…H-006; `wsl --update` ≥2.7.0 + driver check; paper go/no-go | C0/C1 green on the delivered build; ledger seeded; WSL ready |
| **Nov 12 (Day 1)** | Bring-up: WSL#40401 probe → torch sm_120 check → stage data to ext4 (§2.1, 2–6 min) → docker build (2–5 min) → install pinned stack → first `serve_pin.sh` + **M1/M2** (startup phases, KV tokens, max_model_len decision). **If WSL fails the probe → Zorin install (1–2 h) and repeat** | **L0.5 gold+empty audit starts** (concurrency 4, ~25–45 min) + 4-candidate reconciliation; Kirchner cross-check; `verify_patches.py` implementation | PINS.txt + env.json frozen; KV decision recorded; audit running. *Optional: paper submission* |
| **Nov 13 (Day 2)** | **L1 full drill battery** (§4.2, ~45–75 min warm): C2-1…C2-7 + C4b + C5-local E4B block | Freeze `valid_tasks.txt` + `pick_subset.py` → **dev30 frozen**; L0.6 parser fuzz (CPU); L0.7 reasoning repro; `run_subset.sh`/`compare_paired.py` implementation | C2 pass (HARD gate C2-4); mask+subset frozen; **first Kaggle submission of the validated baseline bundle, early day** (queue 36–52 h → lands Nov 15–16) |
| **Nov 14 (Day 3)** | **L2 screen: H-002 (Y1) repeat 1** A/B (~2.3 h); E4B C5 follow-ups if needed | L0.3 replay funnel on L1 traces; L0.4 locbench build + first full-repo run (exercises E6/E7/E19 at scale); trace telemetry analysis (M5–M11) | Y1 screen verdict; locbench baseline table; telemetry → first §6.3 extrapolation |
| **Nov 15 (Day 4)** | **L2: Y1 repeat 2 + H-003 (Y2) screen** (~4.6 h total, can run into evening) | **Kaggle run 1 score arrives → §7.3 triage**; update k_cal; ledger rows; OOD-45/FreshSWE fetch request to user (free datasets; user action) | Y1 promote/reject; Y2 screen; transfer-gap calibration point 1 |
| **Nov 16 (Day 5)** | **Overnight L3: champion 68×2 sharded** (~5.2 h, starts evening) | Daytime: H-005 (E1+E2) engine implementation in scratch arm + both-track sync + **C1 full battery + join_words smoke + locbench delta**; H-004 (P1) C1 hit@k re-run | Engine arm L0-ready; champion L3 baseline by morning |
| **Nov 17 (Day 6)** | **Overnight L3: candidate (best L2 winner) 68×2** (~5.2 h); if E1+E2 passed L0+L1, its L2 screen instead | OOD-45 runner setup (if fetched) + first 45-task baseline run (CPU-side prep, GPU ~1.7 h slot); mutation sanity sample (optional, paper-grade) | L3 confirmation verdict; **weekly review: ledger decisions, Y4 cap decision on telemetry, submission-2 go/no-go** |
| **Nov 18 (Day 7)** | Buffer / re-runs of anything flaky (borderline tasks via CPU re-verification first); E4B L2 screen if C5 clean | Week retro: noise-floor check (did any "win" sit under floor?), subset stability, queue throughput model update; plan week 2 arm queue (E4, Y14, Y3-if-gated) | Week-1 report: champion config + caps + slot cadence; fallback bundle re-validated |

**Week-1 success criteria:** (1) pinned local rig serving with recorded KV/parity deviations; (2) frozen mask + dev30; (3) C0–C5 green; (4) ≥2 hypotheses decided with paired evidence (including at least one honest null); (5) one Kaggle calibration run submitted and triaged; (6) champion 68×2 baseline + first §6.3 extrapolation; (7) ledger + STATUS board live. **If WSL2 fails Day 1, everything shifts +1 day for Zorin; the CPU lane (audit, C0/C1, scripts) proceeds on Windows regardless — it has no GPU or Linux dependency.**

---

## 11. ESTIMATE register (new estimates introduced by this design)

02a estimates (E1–E20) are inherited by reference; only new derivations are listed here. None is a measurement yet; the M-plan (02a §6) and the L0–L3 telemetry replace them.

| # | Estimate | Value | Reasoning |
| --- | --- | --- | --- |
| N1 | L1 per-task warm drill wall | ~2–3 min (31B), ~1–1.5 min (E4B) | Expected agent 2.5–3.2 min remote-equivalent (architecture §8) × decode delta 0.6–0.8 (E15) + local bootstrap 0.2–0.4 min (E7+E9+E10); E4B from 02a §3 (1–1.5 min) |
| N2 | L2 screen / full cycle | 2.3 h / 4.6 h (31B); 2.4 h (E4B full) | 60 / 120 task-runs × N1 planning value 2.3 min (E4B 1.2); range 1.7–3.0 min/task → 3.4–6.0 h full |
| N3 | L3 68×2 per arm | ~5.2 h (31B), ~2.7 h (E4B) | 136 × N1; overnight-compatible; shards add no parallelism on one GPU (§5.4) |
| N4 | Gold/empty audit wall | 25–45 min at concurrency 4; 1.3–2.2 h serial | 129 × 2 arms × 0.3–0.5 min phase-2-only (share of the 0.5 min/task MEASURED combined A+B, 746250); desktop ≥8 cores assumed (2 vCPU/container); VERIFY core count |
| N5 | Noise floor scaling | 2σ ≈ 3 tasks on dev30; ≈ 4 on 68 | σ≈2 tasks/58 (753524) × √(n/58); matches the stated <4-task rule at n≈58–68; binomial approximation, paired design reduces variance further (McNemar uses discordants only) |
| N6 | Parser fuzz wall | ~10–30 min typical; ≤3 h worst | 5,000 strings, almost all return instantly (74/60,000 hang rate, 745138); 2 s timeout each, sequential subprocesses |
| N7 | locbench full-repo probe | ~1–2 s/task/selector cold; 129×3 ≈ 10–20 min | Full fastapi ~2,973 files: cold spec ~1–2 s ESTIMATE (02a §4); grep/bm25 similar order; sources-mode runs are 0.2 s MEASURED |
| N8 | Edit replay | ms/call; 1,000 calls ≈ minutes | apply_replacement is string matching on ≤400 KB files; snapshot extract 2–5 s/task dominates (E7) |
| N9 | Usable Kaggle slots Nov 12→Dec 2 | ~8–11 | 21 days / (36–52 h queue + ~10–12 h run per cycle, one-pending gate); 02a §2 MEASURED queue reports |
| N10 | E4B multi-process parallelism | 2–3 shard processes plausible | E4B weights ~4–5 GB → KV headroom large vs 31B; UNVERIFIED — gate on M2-style KV measurement + budget-isolation drill; default serial |
| N11 | Zorin fallback cost | +1 day | OS install 1–2 h ESTIMATE + stack re-install; CPU lane unaffected |
| N12 | First-week GPU utilization | ~60–70% of waking hours idle-or-CPU | L1 drills ~1 h/day + L2/L3 overnight; the design deliberately keeps the GPU for questions only it can answer (rules 1–2) |

---

## 12. Sources (all local)

- **Bottleneck inventory:** `scratch/bcf-hardening-2026-11-11/02a-bottlenecks.md` (§2 remote table, §3 local table, §5 rankings, §6 M1–M15 measurement plan, §8 E1–E20 estimate register).
- **Levers:** `scratch/bcf-hardening-2026-11-11/02b-levers.md` (Y/P/E/S/V ids, ranked top-20, do-not-tune list, governing discipline).
- **Harness contract:** `input/kagglecomp/kagglecomp_data_package/HARNESS_README.md` §3.1 (4xL4 serving config), §4 (two-phase lifecycle, 7 bootstrap steps, warm pool, sandbox backends), §5.3 (nudges), §6 (tools, truncation), §7 (budgets, compaction 14,336, retries, setup-outside-agent-timer TIP), §8 (patch extraction, 4-pass apply, anti-tampering, hermetic pytest), §9 (CLI flags incl. `--task-id/--task-ids/--sandbox/--concurrency/--shard-index/--num-shards/--skip-agent-patch`; results artifacts), §10 (gotchas). `tasks.jsonl` + `gemma-4-developer-agent.zip` (snapshots/, wheels/) in the same package.
- **Architecture + canaries:** `scratch/bcf-2026-11-11/design/architecture.md` (§8 budget math + decision rule; §10 C0–C7; §9 failure matrix; N1–N6 normalizations).
- **CPU-measured engine metrics:** `scratch/bcf-2026-11-11/design/bcf-empirical-report.md` (§3 gates, §6 runtimes, §8 anchors, §9 cache, §12 limitations) + driver `design/test_bcf_full.py`; `design/skill-tests.md` (3,002-file repo 1.063 s cold / 0.172 s warm).
- **Intel:** `input/kagglecomp/intel_20261111/00-intel-brief-2026-11-11.md` (implications 15/16/17/19/22; S2/S3 queue+rescore; C8/C11/C14; §4a 27-id list + 4 candidates); `scratch/bcf-2026-11-11/intel/00-synthesis.md` (constraints 16/18/19/20/21; contradictions 4/11/20/23/24); `intel/solvability-scoring.md` (751487 calibrated 127/129; 756400 68-valid + mutation audit; 753524 σ; 757588 reruns; environment-dependent gold counts); `intel/prior-art.md` (756433 E2B funnel/replay; 756315 locbench + McNemar/Wilson; 750907 paired-repeat win-both; 750573 OOD-45; 757893/751707 FreshSWE-Py; 745143 g4kit proxy/replay; 751973 pre-registration + local-vs-hidden anti-correlation; 750974 model panel).
- **Taxonomy:** `scratch/bcf-2026-11-11/taxonomy.md` (kinds/families/difficulty/edit-shape distributions + full 129-task assignment table; insights 1/4/5/7).
- **Local stack research (this folder):** `research/rtx5090-stack.md` (sm_120, WSL ≥2.7.0 CUDA-graph fix, WSL#40401 probe, KV uniform-vs-hybrid open question, vLLM 0.19.1/torch 2.10.0 pins), `research/vllm-serving.md` (KV fit criterion, LoRA buffer preallocation), `research/zorin-docker.md` (native fallback). These are prior-agent research notes; load-bearing claims are marked VERIFY in §2.2/§4.1.
- **Dataset measurements:** `scratch/bcf-2026-11-11/zip_listing.txt` (129 snapshots, median 214 MB, 21.50 GB), `extraction.log`, `tasks/*.json`, `sources/`, `taxonomy.json`, `index.json`.
- **Observability convention:** user auto-memory `research-observability-pattern.md` (per-task `_progress/` logs + STATUS.md board).

*End of 02c iteration strategy. Design-only — no submission tree, input file, or GPU run was touched. Implementation of the §9 scripts and the Day-1 bring-up is the next work package; promotion decisions belong to the ledger + win-both discipline, not to this document.*

---

