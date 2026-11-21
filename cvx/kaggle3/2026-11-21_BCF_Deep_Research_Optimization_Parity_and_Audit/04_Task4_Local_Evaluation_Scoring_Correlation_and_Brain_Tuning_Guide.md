# Task 4: Complete User Guide to Local Evaluation Scoring, Result Analysis, Local-to-Kaggle Correlation & Actionable BCF Brain Fine-Tuning

*Research scope: Operational user manual for scoring local RTX 5090 runs under Kaggle-parity settings, interpreting every output artifact and failure funnel metric, mathematically and empirically relating local CV scores to official Kaggle Public and Private Leaderboard scores, and systematically converting the latest local telemetry into surgical, non-overfitting BCF brain upgrades.*  
*As of: 2026-11-21 | Grounded In: `HARNESS_README.md` (§8–§9), `tools/gemma4-swe-kit` (`harness.py`, `logstats.py`, `timing.py`, `replay/`), `01_Dataset_Classification_and_Root_Cause_Analysis.md`, BCF v1/v2 implementations, and Kaggle community statistical studies (Threads `#747168`, `#750907`, `#751596`, `#756400`, `#756587`, `#757588`, `#757661`, `#757893`, `#758954`, `#758969`, `#760014`, `#760126`, `#760595`).*

---

## Executive Summary

Raw local pass rates on the 129 public tasks are **dangerously misleading** unless calibrated: out of the box, 34–56 public tasks fail even with the **gold reference patch** due to missing test wheels (`inline_snapshot`, `dirty_equals`), air-gapped `httpbin` fixtures, Python 3.13 SSL/formatting drift, and the `_validate_junit_xml` skipped-sibling bug (`#756400`, `#757661`, `#757893`); another 5 tasks pass with an **empty patch**; 6–9 require uninferable hidden symbol names (`#745855`); 16–21 touch `async def` functions that **never appear on the private test set** (`#745998`); and your RTX 5090 executes ~2× faster than Kaggle's 4× L4 scorer. Meanwhile, Kaggle's public leaderboard evaluates strictly **58 tasks** (quantized as $\lfloor 100k / 58 \rfloor / 100$, `1 task = 0.0172`) with an irreducible run-to-run standard deviation of **$\sigma \approx 1.5\text{–}2.0$ tasks** even at `temperature=0.0` (`#757588`, `#760014`)!

This guide establishes a **four-stage closed-loop discipline**: (1) always run evaluations through **`g4kit-harness run`** (not raw `swegemma eval`, which silently disables ADK compaction and defaults to 60 min) against a pre-calibrated **Gold+Empty Oracle** clean denominator; (2) extract **10 diagnostic KPIs** and classify every unsolved task into a **12-bucket mutually exclusive failure funnel**; (3) predict Kaggle LB transfer using the **6-factor Local-to-LB Shrinkage Model**, **`g4kit-scorer-time`** 4× L4 time-capped projection (`H_120 <= 11.2h`), and **paired McNemar / exact sign tests** across a frozen **unseen holdout (`Textualize/rich`)**; and (4) translate each dominant failure bucket directly into surgical BCF file edits (`eval_config.yaml`, `agent.yaml`/`sub_agents/*.yaml`, `prompts/*.md`, `bcf.py`) using a concrete Symptom-to-Lever Decision Matrix.

---

## Part 1: How to Run & Score Local Evaluations Accurately

### 1.1 Why You Must Use `g4kit-harness run` (Not Raw `swegemma eval`)
Raw `swegemma eval` silently introduces **three critical parity distortions** compared to the Kaggle scorer (`tools/gemma4-swe-kit/src/gemma4_swe_kit/harness.py:6-15`):
1. It leaves `EventsCompactionConfig` (`token_threshold=14336`) and `ContextCacheConfig` **OFF**, hiding compaction amnesia completely.
2. It ignores `eval_config.yaml` unless explicitly overridden, defaulting to `60.0` minutes per task.
3. It does not record per-task `started_at` / `ended_at` timestamps needed by `g4kit-scorer-time` to project 4× L4 runtime.

**Standard Parity-Faithful Local Evaluation Command (RTX 5090):**
```bash
# Always run paired arms on the EXACT same task list against your persistent vLLM / proxy server:
g4kit-harness run \
  --arm baseline=deliverables/2026-11-20_BCF_Gemma4_Winning_Design/v2/submission_31b_monolith \
  --arm candidate=deliverables/2026-11-20_BCF_Gemma4_Winning_Design/v2/submission_31b \
  --tasks ~/g4/data/tasks.jsonl \
  --snapshots ~/g4/data/snapshots \
  --ids $(cat ~/g4/splits/dev_30_clean.txt) \
  --sandbox docker \
  --image swebench-sandbox:latest \
  --compaction-interval 5 \
  --compaction-threshold 14336 \
  --time-scale 0.55 \
  --api-base http://127.0.0.1:8000/v1 \
  --out ~/g4/runs/20261121_ab01
```
*(Why `--time-scale 0.55`? Because RTX 5090 single-stream decode is ~55–61 tok/s vs Kaggle 4× L4's ~25.5–35 tok/s, scaling `max_time_minutes` by `0.50–0.55` reproduces the true Kaggle wall-clock cutoff during local runs! Alternatively, run with `--time-scale 1.0` for ceiling analysis AND compute the exact time-capped score via `g4kit-scorer-time --cap-minutes 4.75`.)*

### 1.2 Step Zero: Build Your Machine's Calibrated Denominator (Gold + Empty Oracle)
Before judging ANY agent score, run the **Gold Patch** and **Empty Patch (`--skip-agent-patch`)** once across all 129 tasks in your calibrated `swebench-sandbox:latest` Docker image. Partition the 129 tasks into **five stratified reporting denominators**:

| Denominator Name | Definition | Expected Size (Uncalibrated vs. C2–C4 Calibrated) | Purpose in Local Decision-Making |
| :--- | :--- | :---: | :--- |
| **`D_raw` (All 129)** | Every record in `tasks.jsonl` | `129` / `129` | Reference bookkeeping only—**NEVER** compare arms on raw 129 alone! |
| **`D_valid` (Gold-Pass & Empty-Fail)** | `gold_resolved == True` AND `empty_resolved == False` | `~68–74` (raw) -> **`~112–117`** (after C2/C3/C4) | Primary mechanical denominator; eliminates broken wheels, SSL-dead `requests`, skipped-sibling bugs (`fastapi_14186`, `rich_3486`), and 5 empty-pass freebies (`#756400`). |
| **`D_win` (Winnable Clean)** | `D_valid` minus the 6–9 hidden-symbol tasks (`fastapi_15661`, `15030`, `14609`, `15785`, `15745`, `rich_3930`) | **`~103–110`** | Removes unwinnable zero-signal dilution when tuning prompts & patchers (`#745855`, `03_Local_Eval_Change_Sheet_Finding6.md`). |
| **`D_sync` (Zero-Async Private Mirror)** | `D_win` minus the 16–21 tasks touching `async def` | **`~85–92`** | Mirrors the host-confirmed **0-async private test set** (`#745998`)! |
| **`D_holdout_rich` (Locked Unseen Repo)** | Clean `D_win` subset of `Textualize/rich` (**NEVER** used for prompt/keyword tuning!) | **`~38–42`** | **Gold-standard unseen-repo generalization proxy**—mirrors the 0%-repo-overlap Kaggle hidden test set (`#747248`, `#760014`)! |

### 1.3 Anatomy of Local Output Artifacts (`--out ~/g4/runs/<run_id>/`)

| Artifact Path | Format | Exact Diagnostic Questions It Answers |
| :--- | :--- | :--- |
| `results_<arm>.jsonl` | Append-only JSONL (1 row/task) | `resolved`, `wall_s`, `started_at`, `ended_at`, `tool_calls`, `status`, `error`, `test_exit_code`, `patch_chars`, `patch`, `test_output_tail`. |
| `results_<arm>/summary.json` | JSON summary | Aggregate resolution rate, per-repo breakdown (`fastapi`, `rich`, `requests`, `httpx`), aggregate error counts. |
| `results_<arm>/patches/<id>.patch` | Unified Git diff | Did the agent modify protected test files? Leave `/workspace/tmp/repro.py`? Edit the right file/hunk? Produce empty patch? |
| `results_<arm>/test_outputs/<id>.log` | Full Phase-2 `pytest` stdout/stderr | Exact `PYTEST_EXIT` (`0–5` or `137`), `SyntaxError`/`ImportError`/`AssertionError`, JUnit XML skip rejection vs genuine logic failure. |
| `results_<arm>/traces/trace_<id>.json` | ATIF v1.7 SessionTrace | Exact turn-by-turn thoughts, tool calls, tool responses, token counts, compaction events, `submit_patch` timing. |
| `proxy.jsonl` & `proxy_full.jsonl` | `g4kit-proxy` JSONL logs | Per-call `prompt_tokens`, `completion_tokens`, HTTP `400` context overflows, malformed tool names, unparsed calls, exact replay inputs for `g4kit-replay`! |

---

## Part 2: User Guide to Interpreting & Analyzing Local Results

### 2.1 The 10 Core Telemetry KPIs (Extract After Every Run)
Run `g4kit-log-stats` and `g4kit-scorer-time` immediately after every Tier 3/4 evaluation:
```bash
g4kit-scorer-time \
  --results ~/g4/runs/20261121_ab01/results_baseline.jsonl ~/g4/runs/20261121_ab01/results_candidate.jsonl \
  --proxy-log ~/g4/runs/20261121_ab01/proxy.jsonl \
  --cap-minutes 4.75 --tasks 120 --setup-minutes 0.75 --by-arm

g4kit-log-stats ~/g4/runs/20261121_ab01/proxy_full.jsonl \
  --role plan="^You are \`bcf_plan\`" \
  --role solver="^You are (\`solver\`|an expert Python)"
```

| # | KPI | Healthy Target (31B) | Healthy Target (E4B) | Red-Flag Threshold & Immediate Meaning |
| :---: | :--- | :---: | :---: | :--- |
| **1** | **Clean Winnable Solve Rate (`R_win`)** | `>= 42%` | `>= 18%` | Below target = core localization, repair, or verification breakdown. |
| **2** | **Time-Capped 4×L4 Solve Rate (`R_cap`)** | `>= 38%` (`<= 4 pp` drop vs `R_win`) | `>= 16%` (`<= 2 pp` drop) | Large gap `R_win - R_cap > 6 pp` means RTX 5090 speed is masking Kaggle timeouts! |
| **3** | **Projected 120-Task Scorer Hours (`H_120`)** | **`<= 10.5 h`** (worst-case `< 11.2 h`) | **`<= 9.5 h`** (worst-case `< 10.2 h`) | **`> 11.2 h` = DO NOT SUBMIT!** High probability of 12-hour `Notebook Timeout` (`0.00`) on Kaggle! |
| **4** | **Locked Holdout Solve Rate (`R_holdout_rich`)** | `>= 36%` | `>= 15%` | If `R_dev` jumps `+8 pp` while `R_holdout_rich` drops -> **overfitting to `fastapi`/`requests`!** Reject immediately. |
| **5** | **Empty-Patch Rate** | `< 8%` | `< 12%` | `> 15%` = read-only paralysis, HTTP 400 overflow wipe, or early quit (`#758969`, `#760595`). |
| **6** | **Broken-Code Edit Rate** (`Syntax`/`Indent`/`Name`/`UnboundLocal`/`Import` in Phase 2) | **`< 3%`** | **`< 6%`** | `> 8%` = agent bypassed `py_compile`/import gate or hit `edit_file` backtick/char-drop corruption (`#756051`, `#760595`). |
| **7** | **Context Overflow (`HTTP 400`) & Compaction Count** | **`0` overflows**; `< 20%` tasks compacted | **`0` overflows**; `< 10%` compacted | Even **1** HTTP 400 wipes an already-submitted patch (`g4kit-proxy` context.py)! Lower `max_output_tokens` or read slice sizes. |
| **8** | **Malformed / Unparsed Tool Calls** | `< 2%` of calls | `< 4%` of calls | Spike indicates shell-command tool-name hallucination (fenced bash leak) or `include_thoughts: false` collapse (`#760014`). |
| **9** | **Median Calls & Time to First Edit** | `<= 6 calls` (`<= 35%` budget) | `<= 5 calls` (`<= 35%` budget) | `> 10 calls` strongly predicts failure (`53%` solve if edit `<= 3` calls vs `24%` if `>= 12`, `#751596`). |
| **10** | **Actionable Verification Rate** (`PYTEST_EXIT` readable, non-exit-5) | `>= 80%` of post-edit tests | `>= 70%` of post-edit tests | `< 50%` = agent running non-existent paths, bare `pytest` timeouts, or piping to `tail` (`#760595`). |

### 2.2 The 12-Bucket Mutually Exclusive Failure Funnel
Classify **every single failed task (`resolved == False`)** in `D_valid` into the **first matching bucket** below (extending arnelperezposadas `#760595` & Munal Singh `#751596` with harness-parity traps):

| Order | Failure Bucket | Detection Signature in Artifacts | Primary Owner Layer |
| :---: | :--- | :--- | :--- |
| **F1** | **Harness / HTTP 400 Context Overflow** | `error` contains `BadRequestError` / `maximum context length` / `Sandbox execution error` with `patch_chars == 0` | `max_output_tokens`, read cap, sub-agent isolation |
| **F2** | **Parser Hang / Malformed Tool Loop** | `logstats` shows `malformed > 0`, `unparsed > 0`, or identical rejected tool call repeated `>= 3×` | Prompt prose-binding, retry circuit breaker, zero array tools |
| **F3** | **Timeout / Budget Exhaustion (No Edit)** | `wall_s >= cap` or `tool_calls == max`, `patch_chars == 0`, gold file opened (`F3a`) or never opened (`F3b`) | `thinking_budget`, early-edit commitment, locator (`bcf.py`) |
| **F4** | **Early Quit (Empty Patch Before Budget)** | `patch_chars == 0` with `< 50%` time/calls used (`#758969`) | Anti-early-quit verification prompt rule |
| **F5** | **Protected-Path / Patch-Apply Wipe** | `patches/<id>.patch` edits only `tests/`/`conftest.py`/`pytest.ini` (reset in Phase 2) or fails `git apply` | Protected-path guard (`bcf.py patch` + `system.md`) |
| **F6** | **Broken Code (Compile / Import / Scope Error)** | Phase 2 `test_outputs/<id>.log` shows `SyntaxError`, `IndentationError`, `NameError`, `UnboundLocalError`, `ImportError` | `bcf.py patch` auto-rollback, `py_compile` + submodule import gate |
| **F7** | **Localization Miss (Never Touched Gold File)** | Non-empty patch, `0` overlap with gold-patch filenames | `bcf.py locate` (AST + BM25 + importer graph), Phase 1 grep |
| **F8** | **Wrong Region (>20 Lines From Gold Hunk)** | Edited gold file, but every modified line is `> 20` lines away from gold hunk | Bounded symbol slicing, verify-symbols-in-source rule |
| **F9** | **Partial / Missed Sibling Path** | Edited within 20 lines of 1 gold hunk, but missed mirror method (`append_text`, `subtitle`, sibling file, `unasync` twin) | Sibling-path sweep checklist, `patch-multi`, `bcf.py` repo traps |
| **F10** | **Spec-Change Revert / Self-Sabotage** | Trace shows a valid edit matching the issue was reverted after an old visible test failed! | `SPEC_CHANGE_RISK` guidance, `/tmp/repro.py` delta rule |
| **F11** | **New-File Creation Failure** | Gold patch creates a new `.py` file (`11/129`), agent failed to create it or wrote it to `/workspace/tmp/` | `bcf.py create` + explicit heredoc new-file recipe |
| **F12** | **Deep Logic / Algorithmic Mismatch** | Edited exact lines, compiles & imports cleanly, sibling paths covered, yet assertions still fail | Task 1 Python 3.13 archetype checklist, `thinking_budget` / `temp` |

---

## Part 3: Local-to-Kaggle Leaderboard Correlation & Statistical Reality

### 3.1 Why Local Clean CV (`40–50%`) Maps to `0.18–0.28` on Kaggle Public LB
Understanding the exact quantitative bridge between your local PowerSpec G914 score and Kaggle Public/Private LB prevents both false optimism and premature abandonment of real improvements:

$$\text{Expected Kaggle LB} \approx \underbrace{R_{\text{cap,sync}}(\text{Local } D_{\text{win}})}_{\text{Time-capped, zero-async}} \times \underbrace{\gamma_{\text{OOD}}}_{\substack{\text{Unseen-repo transfer} \\ \approx 0.55\text{–}0.70}} - \underbrace{\Delta_{\text{parity}}}_{\substack{\text{Scorer-only traps} \\ (\text{skills/compaction/400})}} \pm \underbrace{1.96 \sqrt{\frac{p(1-p)}{58} + \frac{\sigma_{\text{inf}}^2}{58^2}}}_{\text{95\% sampling + batching band}}$$

| Correlation Factor | Quantitative Impact | Empirical Grounding | How to Control It Locally |
| :--- | :--- | :--- | :--- |
| **1. Unseen-Repo Shrinkage ($\gamma_{\text{OOD}}$)** | **`0.55×–0.70×`** (e.g., `42%` clean local -> `~23%–29%` = `13–17/58` = `0.22–0.29` LB!) | Zero training repos appear in the hidden set (`#747248`). Murugesan's 31B prompt-only baseline scored `47/129` (`36.4%` raw / `~48%` clean) locally and `0.18–0.22` (`11–13/58`) on Public LB (`#758218`). | Weight **`R_holdout_rich`** (isolated unseen repo) and external **`OOD-C`** (186 tasks, 148 repos, `#758821`) 2× higher than `fastapi` dev gains! |
| **2. `async def` Distribution Shift** | Removes `16–21/129` public tasks (`0` in private!) | Host Elan Markowitz confirmed `0` private tasks touch `async def` (`#745998`). | Always track **`D_sync`** separately; don't judge Kaggle EV solely on FastAPI ASGI `async` wins. |
| **3. Hardware Speed Distortion ($k_{\text{5090}\to\text{4xL4}}$)** | Unscaled RTX 5090 inflates local solves by **`+10% to +25%`** relative | 5090 decodes `55–61 tok/s` vs 4× L4 `25.5 tok/s` (`timing.py`). Unconverted caps hid 37/55 timeouts on slower GPUs (`#758954`). | **Always** report `R_cap` via `g4kit-scorer-time --cap-minutes <eval_cfg_cap>` AND run Tier 3/4 with `--time-scale 0.55`! |
| **4. 58-Task Public Lattice Quantization** | Exact floor truncation $\lfloor 100k/58 \rfloor / 100$ (`1 task = 0.0172`) | Verified across all 6,228 leaderboard teams (`14/58 -> 0.24`, `15/58 -> 0.25`, `16/58 -> 0.27`, `#757588`, Nov 20 CSV). | Never celebrate or panic over a `0.01–0.03` (`1–2` task) single-run LB jump! |
| **5. Run-to-Run Inference Stochasticity ($\sigma_{\text{inf}}$)** | **$\sigma \approx 1.5\text{–}2.0$ tasks** (`±3–4` task swing on byte-identical ZIPs!) | `0.24 -> 0.17` unchanged rerun (`#757588`); `11–15/114` across 10 runs at `temp=0.0` (`#760014`, SD `1.52`); `10–15%` per-task flip rate (`#750907`, `#747168`). | Use **paired comparisons on identical task IDs**, run **`R = 2` repeats** on Tier 4, and judge by **discordant pairs `(won, lost)`** using exact McNemar's test! |
| **6. Multi-Agent / Skill Scorer Divergence ($\Delta_{\text{parity}}$)** | Can collapse LB to `0.00` or `-0.08` despite strong local CV! | Skill-only `40%` local -> `0.00` LB (`#758547`); `SequentialAgent`/`agent_tool` equal locally -> `0.10` vs `0.18` LB (`#760126` Murugesan). | **Never assume `SequentialAgent` or `skills:` transfer 1:1 until verified by a live Kaggle canary!** Keep Monolith as your calibrated baseline anchor! |

### 3.2 Exact Statistical Promotion Rules (Beating the Noise Floor)
Given two paired arms **A (Champion)** and **B (Challenger)** evaluated on the exact same $N$ clean tasks, build the $2 \times 2$ paired contingency table:
- $b$ = tasks **won by B, lost by A** (new solves)
- $c$ = tasks **won by A, lost by B** (regressions)
- Net gain $\Delta = b - c$. Under the null hypothesis of equal capability, $b \sim \text{Binomial}(b+c, 0.5)$ (Exact McNemar / Binomial Sign Test):

| Decision Tier | Required Sample Size & Repeats | Quantitative Promotion Criterion | Statistical / Practical Rationale |
| :--- | :--- | :--- | :--- |
| **Fast Reject (Tier 2 Replay)** | `15–30` contexts × `6` samples (`90–180` pairs) | Drop in failure rate with one-sided exact sign test `p < 0.05` | Cheap 5-min filter; kills bad prompt edits immediately before touching Docker. |
| **Tier 3 Dev Gate (`dev_30`)** | `30` clean tasks × `1` run (or `2` runs if borderline) | `H_120 <= 11.0h` AND `overflows == 0` AND (`b - c >= +2` OR (`b >= c` AND target failure bucket drops `>= 40%`)) | Prevents discarding true mechanism wins (e.g., broken edits `12 -> 4`) masked by single-run variance (`#760595`). |
| **Tier 4 Holdout Promotion Gate** | `dev_30` + `holdout_rich` (~70 tasks) × **`2` paired runs** (`140` task-trials/arm) | Mean net gain `>= +2.5` tasks/run across BOTH `dev_30` AND `holdout_rich`, zero regressions on `H_120 <= 11.2h`, zero HTTP 400 overflows | At 10–15% per-task flip rate, `R = 2` paired runs cut standard error by $\sqrt{2}$ and reduce wrong-ranking probability from `20%` (`#758954`) to `< 5%`. |
| **Kaggle Slot Promotion Gate** | Validated Tier 4 winner | Beats current submitted champion's Tier 4 mean by `>= +2` clean tasks (or is first clean bank of Track 1 31B / Track 2 E4B) | Protects your scarce 1-slot/24h Kaggle cadence before Nov 25 / Dec 2. |

---

## Part 4: Converting Latest Local Results into Actionable BCF Brain Fine-Tuning Plans

### 4.1 Closed-Loop Symptom-to-Lever Diagnostic Decision Matrix

After every Tier 3 or Tier 4 local run, compute the 12-bucket failure counts (Section 2.2) and map the **top 1–2 dominant failure buckets** directly into surgical BCF edits:

| Dominant Failure Bucket(s) in Latest Run | Exact Root-Cause Check (Verify in Trace/Logs) | Concrete BCF Brain Modification (File & Exact Knob) | Verification Test Before Next Full Sweep |
| :--- | :--- | :--- | :--- |
| **F1: HTTP 400 Context Overflow (`> 0` tasks)** | Check `proxy_full.jsonl` for `prompt_tokens + max_output_tokens > 32768`; check if `bcf_plan` or `solver` blew context | 1. Lower `max_output_tokens` to `4096` (never `8192`!) in `agent.yaml` / `solver.yaml`.<br>2. Tighten `cmd_read` char cap (`6000 -> 4500`) & `bcf_plan.md` `<<'BCF_PROB'` digest (`<= 12` lines).<br>3. Add explicit `\| head -n 45` cap to grep commands in `prompts/*.md`. | `g4kit-log-stats` -> `overflow == 0` across re-run of overflowed task IDs. |
| **F2: Malformed Calls / `edit_file` Retry Loops (`> 3%` calls)** | Inspect `g4kit-log-stats` `malformed`, `unparsed`, and `most repetitive sessions`; check for backticks or shell-command tool names | 1. Audit ALL prompts for any accidental fenced shell blocks (triple-backtick `bash`) -> rewrite as prose bound to `run_command`.<br>2. Add/strengthen 1-strike circuit breaker in `prompts/system.md` & `solver.md`: after 1 `edit_file` failure, re-read & switch to single-quoted Python heredoc (`python3 - <<'PY_EOF'`) or `bcf.py patch`. | `g4kit-replay --select malformed --n 6` -> statistically significant drop (`p < 0.05`). |
| **F3: Timeout / Over-Thinking / Late First Edit (`H_120 > 10.8h` or `R_win - R_cap > 5 pp`)** | Check `g4kit-scorer-time` per-task `completion_tokens`, `n_thinking`, and median call of first edit | 1. Lower `thinking_budget` (`31B: 2048 -> 1536` or `1024`; `E4B: 768 -> 512`), keeping `max_output_tokens: 4096` & `include_thoughts: true`!<br>2. Enforce tighter `max_time_minutes` (`4.75 -> 4.50`) or `timeout_seconds` (`60 -> 45`).<br>3. Check if `SequentialAgent` nudges re-entered `bcf_plan` -> switch to Monolith if nudge turns `> 10%` of tasks! | `g4kit-scorer-time` -> `H_120 <= 10.5h` with zero loss in `R_cap`. |
| **F4: Early Quit on E4B (`patch_chars == 0` with `<50%` budget used)** | Inspect `logs/<id>.log` to see if agent called `submit_patch` after 0 edits or stopped with prose text | Strengthen `v2/submission_e4b*/prompts/*.md`: explicitly prohibit calling `submit_patch` when `git status --porcelain` is empty or while `py_compile`/`import`/`repro.py` fails; **do NOT add a minimum-minutes floor** (`#758969`). | Re-run the early-quit task IDs (`--ids ...`): verify empty-patch count drops `>= 50%`. |
| **F5: Protected-Path or Scratch-File Pollution** | Check `patches/<id>.patch` for `tests/`, `conftest.py`, `pytest.ini`, or `/workspace/tmp/` | Confirm `write_file` stays removed; reinforce `git checkout HEAD -- <protected>` in Phase 4; ensure `bcf.py verify` exits non-zero when `untracked` or `protected_touched` is non-empty! | `validate_and_package_bcf_v2.py` + inspect `patches/*.patch` on run (`0` protected/scratch diffs). |
| **F6: Broken Code (`SyntaxError` / `UnboundLocalError` / `ImportError`)** | Inspect `test_outputs/<id>.log` for exit code `2` + traceback; check if agent saw error and submitted anyway (`#760595`) | 1. In `bcf.py`: ensure `cmd_verify` wraps smoke-import `TimeoutExpired`, prints `VERIFY_VERDICT=FAIL` on any compile/import/scope error, and returns non-zero!<br>2. In Monolith `system.md`: require `python3 -m py_compile` + exact dotted submodule `importlib.import_module` before `submit_patch`. | Broken-edit count in `test_outputs/` drops to `< 3%` (31B) / `< 6%` (E4B). |
| **F7: Localization Miss (`never opened gold file`)** | Compare `CANDIDATE_FILES` in `last_spec.json` / traces against gold-patch paths; check if sparse prompt or `>200KB` file or caller indirection | 1. Upgrade `bcf.py:locate_candidates`: add stdlib AST `ImportFrom` + attribute-ref cross-file booster and raise test-file scoring weight.<br>2. In Monolith `system.md`: instruct 2-step grep (exact error/symbol first, then directory/filename `find` + `git grep` on stem). | Offline CPU recall benchmark on all 129 tasks (`recall@5` increases without repo-specific terms!). |
| **F8 / F9: Wrong Region or Missed Sibling Path** | Diff `patches/<id>.patch` against gold patch: did agent patch only 1 of 2 mirror methods or miss `src/httpx/` twin? | 1. Add missing generalizable mirror-pattern bullet (e.g., `sync/async`, `title/subtitle`, `signature/return_annotation`, `patch-multi`) to `prompts/solver.md` / `system.md`.<br>2. Expand `bcf.py:detect_repo_traps` for dual-tree / codegen patterns. | Paired re-run on missed-sibling tasks + holdout check. |
| **F10: Spec-Change Revert (`reverted valid fix`)** | Read trace: agent edited correctly -> ran pre-existing test -> saw failure on old assertion -> undid fix! | Strengthen `SPEC_CHANGE_RISK` trigger in `bcf.py:classify_issue` and clarify in `prompts/*.md` to validate against `/tmp/repro.py` encoding the *issue statement* rather than blindly obeying a single legacy test asserting the bug. | Re-run spec-change subset (`rich_3470`, `requests_7315`, `fastapi_13786`, `14978`). |
| **F11: New-File Creation Failure** | Gold patch creates a new `.py` file (`11/129`), agent errored on `bcf.py patch` (`not_found`) | Add `bcf.py create <path> <<'BCF_EOF'` (protected-path guard + `ast.parse`/`py_compile` auto-delete rollback) AND add 1-line prose heredoc file-creation rule to Monolith `system.md`. | Unit test in `validate_and_package_bcf_v2.py` + paired run on new-file tasks. |
| **F12: Deep Logic Mismatch on Right Lines** | Inspect failing assertion in `test_outputs/<id>.log` against Task 1's 6 Python 3.13 error families | Only if a **general Python 3.13 mechanic** recurred across `>= 2` repos (e.g., `UnionType`, `partial` before `unwrap`, `deepcopy`, `hasattr` proxy): fold 1 concise, repo-agnostic rule into the 6-archetype checklist (never add repo-specific trivia!). | Must improve **`R_holdout_rich`** (unseen repo), proving zero overfitting! |

### 4.2 Worked Example: Turning One Local Run into a 24-Hour Tuning Sprint
Suppose your first Tier 3 run of **`v2/submission_31b_monolith`** on `dev_30` (30 clean FastAPI/Requests tasks) + `holdout_rich` (38 clean Rich tasks) yields:
- **`dev_30`**: `14/30` (`46.7%`) uncapped, `12/30` (`40.0%`) time-capped at 4× L4 `4.75m`, `H_120 = 9.4h` (safe margin!).
- **`holdout_rich`**: `14/38` (`36.8%`) time-capped.
- **Failure Funnel across the 42 time-capped failures:** `F1 (Overflow) = 0`, `F2 (Malformed/edit retry loop) = 5`, `F3 (Timeout) = 4`, `F6 (Broken code) = 2`, `F7 (Loc miss) = 5`, `F9 (Missed sibling) = 6`, `F10 (Spec revert) = 3`, `F11 (New file) = 2`, `F12 (Deep logic) = 15`.

**Actionable Sprint Plan Generated Directly from This Telemetry:**
1. **Sprint Hypothesis 1 (Targets `F2 = 5` + `F6 = 2` -> 7 recoverable tasks, Effort = 1h):** Add the 1-strike `edit_file` retry circuit breaker + single-quoted Python heredoc fallback (Lever `L3`) AND verify via Tier 2 `g4kit-replay` on the 5 logged `F2` contexts (`5 min`!).
2. **Sprint Hypothesis 2 (Targets `F9 = 6` + `F11 = 2` -> 8 recoverable tasks, Effort = 1h):** Embed the 6-archetype Python 3.13 checklist + sibling-sweep prompt rule (Lever `L9`) and new-file creation heredoc rule (Lever `L2`) into `prompts/system.md`.
3. **Sprint Hypothesis 3 (Targets `F3 = 4` using spare `1.8h` headroom -> `H_120 = 9.4h -> ~10.4h`, Effort = 30m):** Raise `max_tool_calls: 28 -> 34` while testing `thinking_budget: 2048 -> 1536` (Lever `L7` + `L8`) to buy +6 tool calls inside the exact same `4.75m` cap!
4. **Validation & Promotion:** Run `2×` paired Tier 4 evaluations on `dev_30` + `holdout_rich` (`~2h` overnight on RTX 5090). If `v2.1_monolith` achieves `>= 15/30` on `dev_30` AND `>= 16/38` on `holdout_rich` with `H_120 <= 10.8h` and `0` overflows -> package, run Tier 0 + Tier 1 smoke, and submit to Kaggle!

---

## Open Questions & Sources

- **Open Question — Exact Private-Set Difficulty Relative to `Textualize/rich`:** Because private test repositories are completely undisclosed, `holdout_rich` plus public external datasets like `OOD-C` (`186` tasks across `148` repos, `#758821`) and `FreshSWE-Py` (`#757893`) are the closest available proxies for unseen-repo transfer. Tracking BOTH `holdout_rich` and a 30-task `OOD-C` slice provides the strongest protection against overfitting to the 4 competition training repositories.
- **Sources:** `HARNESS_README.md` (§8–§9); `tools/gemma4-swe-kit/` (`harness.py`, `timing.py`, `logstats.py`, `proxy/context.py`, `replay/`); `deliverables/2026-11-20_BCF_Gemma4_Winning_Design/` (`01_Dataset_Classification_and_Root_Cause_Analysis.md`, `v2/`); `input/kagglecomp/intel_20261006/03_Local_Eval_Change_Sheet_Finding6.md`; Kaggle Competition Intel Threads `#745855`, `#745998`, `#747168`, `#747248`, `#750907`, `#751596`, `#756400`, `#756587`, `#757588`, `#757661`, `#757893`, `#758218`, `#758547`, `#758821`, `#758954`, `#758969`, `#760014`, `#760126`, `#760595`.
