# Task 6 - Impact-effort analysis and roadmap: which levers to pull, with which values, in which order

**Prepared:** 2026-11-24, 22:40 UTC. **Horizon:** the final deadline, 2026-12-02 23:59 UTC, with the notebook-publish freeze at 2026-11-25 23:59 UTC. **Inputs:** Tasks 1 to 5 of this package. **Rule of the roadmap:** the private leaderboard is one draw of each of two selected submissions, so the objective is the mean and the spread of a single run, not the best public score.

---

## 1. What "return" means here

Three quantities move the final ranking, and each lever is scored against them:

| Quantity | What it is | Why it matters | How it is measured before submitting |
| --- | --- | --- | --- |
| Mean resolved count | Tasks a single run resolves on average | The private score is a single run | Paired panel runs, three per bundle (Task 4) |
| All-or-nothing risk | The probability that the run exceeds 12 hours, fails to start, or scores 0.00 | One failure erases the mean | Projected mean seconds per task; the official compiler; the result size after scoring |
| Spread | The standard deviation of a single run | Among equal means, the smaller spread wins more often | Paired runs: count of tasks that flip |

Effort is the working time to make the change and validate it at the cheapest tier that can decide it. Both scales run from 1 to 5.

---

## 2. The ranked list

| Rank | Lever and the value to set | Impact | Effort | Return (impact over effort) | Evidence | Tier that decides it |
| --- | --- | ---: | ---: | ---: | --- | --- |
| 1 | **Use the patched brain** (`bcf-brain-patched/`): the six fixes of Task 5 are already made and validated | 4 (two of them prevent losing a correct fix) | 1 | 4.0 | Executed probe: 5 gaps to 0; routing 43% to 75% on category | T0, T1 (done), T2 |
| 2 | **Solver thinking budget 4,096 to 2,048** on the 31B bundles (`build.py`, `SAMPLING[("31b","solver")]`) | 5 on time, neutral to positive on solves (hypothesis) | 1 | 3.0 | Board: 4,096 and 1,024 tied on solves for the small model; 4,096 is 164 to 241 s on the scorer | T3 paired |
| 3 | **Governor gates**: `T_EDIT_S` 150 to 110, `T_VERIFY_S` 300 to 230, `FREEZE_FRAC` 0.78 to 0.68, `HARD_FRAC` 0.90 to 0.82 | 4 on time and spread | 1 | 3.0 | Board: first edit at 106 s in solved runs against 183 s in failed ones | T3 paired, with projection |
| 4 | **Measure the mean task time once** (smoke panel, 5 tasks, with the trace extractor of Task 4) | 5 on risk: it decides whether lever 5 is needed | 1 | 3.0 | Arithmetic: 360 s per task at 120 tasks | T2 |
| 5 | **Per-task cap**: keep `max_time_minutes` 8 unless the projected mean exceeds 300 s, then 7, then 6; `max_turns` 80 to 56; `timeout_seconds` 240 to 120 | 5 on the all-or-nothing risk | 1 | 2.5 | Board: 15 minutes and 50 calls exceeded 12 hours; 28 calls is the cliff | T2 and T3 |
| 6 | **Routing and hints**: keep the patched rule; add the three hint sentences of Task 1, section 6, row 5 (coroutine detection in the DI hint, pickling in OBJ, broken pipe in CON, warnings in the solver core) | 3 on mean | 1 | 2.0 | Task 1 | T1 (routing measured), T3 |
| 7 | **Solver prompt from 5.6 KB to at most 3 KB** on the 31B track | 3 on mean, 4 on spread | 2 | 1.8 | Board: lean prompts win; elaborate decks scored 0.06 to 0.08 | T2, T3 paired |
| 8 | **E4B thinking 1,024 against 0 and 512** (`SAMPLING[("e4b","solver")]`), planner thinking 0 | 3 on the bonus track | 1 | 2.0 | Board: zero-think beat 4,096 by 16 to 10 on 114 tasks; 1,024 and 4,096 tied | T3 paired on E4B |
| 9 | **Drop `read_file` from the solver** (the helper reads) | 2 on malformed calls | 1 | 1.5 | Hypothesis; board evidence is about multi-argument tools in general | T3 |
| 10 | **Planner thinking 1,024 to 0** (relay bundles only) | 2 on time | 1 | 1.5 | Hypothesis H5 | T2, T3 |
| 11 | **Repeated failed block recognised** (about fifteen lines in `cmd_apply`) | 2 on calls saved | 2 | 1.0 | Board: 75% of failed edit calls repeat an earlier failure | T1, T3 |
| 12 | **Helper `status` without `git status` and recompilation outside the freeze** | 2 on time | 2 | 1.0 | Source: `status` calls `_check()` on every call | T1 |
| 13 | **Localizer: one indexed scan with a cached file list** | 3 on mean, 2 on time | 3 | 1.0 | Measured: top-9 file 96 of 129; three scans of the tree today | T1 (`eval_localizer.py`) |
| 14 | **Output cap 8,192 to 6,144** on 31B only | 2 on time | 1 | 1.0 | Board: a smaller cap doubled edit errors for the small model | T3 |
| 15 | **Temperature 0.2 to 0.0 and a fixed seed** | 2 on spread | 1 | 1.0 | Weak: temperature 0 is not deterministic for agents | T3 |
| 16 | **Three paired runs of the two finalists** and the projection check | 4 on the quality of the final choice | 2 | 1.5 | Task 4, section 6 | T3 |
| 17 | **One parity run on Kaggle L4x4** of the finalist | 3 on confidence in time | 3 | 0.7 | Notebook tier: the staff harness on the scorer's GPUs | T4 |
| — | LoRA | negative by default | 5 | below 0 | Board: minus 7 tasks for a zero-weight adapter | not attempted |

---

## 3. The values, in one table

| Setting | File | 31B today | 31B, step 1 | 31B, step 2 (only if the projected mean is above 300 s) | E4B today | E4B, step 1 |
| --- | --- | --- | --- | --- | --- | --- |
| `thinking_budget`, solver | `build.py` `SAMPLING` | 4096 | 2048 | 1024 if step 1 lost nothing | 1024 | 0 and 512, in a paired run |
| `max_output_tokens`, solver | `build.py` | 8192 | 8192 | 6144 | 8192 | 8192 |
| `temperature`, solver | `build.py` | 0.2 | 0.2 | 0.0 with a seed | 0.2 | 0.2 |
| `thinking_budget`, planner | `build.py` | 1024 | 0 | 0 | 256 | 0 |
| `max_time_minutes` | `build.py` `EVAL` and `BUDGET_S` | 8 | 8 | 7, then 6 | 8 | 8 |
| `max_tool_calls` | `build.py` `EVAL` | 28 | 28 | 26 | 28 | 28 |
| `max_turns` | `build.py` `EVAL` | 80 | 56 | 48 | 80 | 56 |
| `timeout_seconds` | `build.py` `EVAL` | 240 | 240 | 120 | 240 | 240 |
| `T_EDIT_S` | `parts/_bcf_head.py` | 150 | 110 | 100 | 150 | 120 |
| `T_VERIFY_S` | `parts/_bcf_head.py` | 300 | 230 | 210 | 300 | 240 |
| `FREEZE_FRAC` | `parts/_bcf_head.py` | 0.78 | 0.68 | 0.65 | 0.78 | 0.70 |
| `HARD_FRAC` | `parts/_bcf_head.py` | 0.90 | 0.82 | 0.80 | 0.90 | 0.84 |
| `CMD_TIMEOUT_S`, `REPRO_TIMEOUT_S` | `parts/_bcf_head.py` | 45, 40 | 35, 25 | 35, 25 | 45, 40 | 35, 25 |
| Solver tools | `build.py` | 4 tools | 4 tools | 3 tools (drop `read_file`) | 4 tools | 4 tools |
| Solver instruction | `src/prompts/` | 5,585 characters (relay), 6,524 (flat) | at most 3,000 | same | 2,799 and 3,141 | same |

`BUDGET_S` must equal `max_time_minutes` times 60; the build stops when they disagree. After any change to `parts/`: `python assemble.py`, `python build.py`, `python -m unittest tests.test_bcf`, `python tools/run_validator.py`.

---

## 4. The calendar

Seven submission days remain (2026-11-25 to 2026-12-01); the last safe morning is 2026-12-01.

| Day (UTC) | Local work | Submission | Gate to pass before submitting |
| --- | --- | --- | --- |
| Nov 25 | Smoke run of the patched `bcf-31b-flat` (5 tasks): per-call seconds and tokens; write the projection factor | `bcf-31b-flat` (patched), early in the day. It banks a score and answers whether skill scripts run on the scorer | Compiler 6 of 6, controls 15 of 15, smoke run clean on 5 tasks |
| Nov 26 | Thinking 2,048 and the new gates: three paired runs against the baseline on the ranking panel | Nothing | Paired table: not fewer resolved, lower projected mean |
| Nov 27 | Prompt trim to 3 KB; drop `read_file`; hint sentences | The improved 31B bundle if Nov 26 passed its gate | Paired table; malformed calls per 100 |
| Nov 28 | E4B: thinking 0 and 512 against 1,024, paired | `bcf-e4b-flat` once (bonus eligibility needs one E4B submission among the two finals) | E4B smoke run; compiler |
| Nov 29 | Three paired runs of the two best 31B bundles; read the result sizes and hours-to-score of every attempt so far | Nothing | Ledger complete |
| Nov 30 | Choose the two finalists by local mean; optional L4x4 parity run of the finalist | A confirmation run of finalist 1 only if its last score was abnormal | Result size normal |
| Dec 1 | Nothing new | Last safe morning for a submission; select the two finals | Selection done |
| Dec 2 | Nothing new | Deadline 23:59 UTC | |

Publish any notebook version you may still need before the freeze at 2026-11-25 23:59 UTC (board thread 759388 asked whether private versions can still be submitted after it; unanswered).

---

## 5. Decision gates

| Question | Rule |
| --- | --- |
| Is a change better? | Adopt when the paired table shows more tasks gained than lost and the projected mean time is not worse; reject when tasks are lost with no gain; otherwise run more pairs |
| Is the bundle safe to submit? | Compiler 6 of 6, 15 controls rejected, one smoke run clean, the bundle's SHA-256 written in the ledger |
| Is the run inside the clock? | Projected hours for 120 tasks at or below 10.8; otherwise lower the cap one step before submitting |
| Is a scored result a draw or a fault? | Hours to score in the normal band and a result size of 60 to 130 KB: a draw. About 3,230 bytes: a fault; resubmit the same file |
| Which two finals? | The two bundles with the best local mean over paired runs; the public score breaks ties only |

---

## 6. What not to spend time on

| Temptation | Why not |
| --- | --- |
| A LoRA adapter | No demonstrated gain; a measured cost in time and a risk to the thinking channel; eight days are not enough to beat the cost |
| A second model or a mixed bundle | Not allowed: one base model per submission |
| The E2B checkpoint | Reported to fail to load on the pinned stack |
| Graph tools | No measured gain and one list-argument tool |
| A bigger thinking budget | 4,096 is already 164 to 241 seconds on the scorer |
| Tuning against public-score differences below 0.07 | Inside the noise of a single run |
| The 29 ungradable and 2 unsatisfiable public tasks | They add noise to every panel |

---

## 7. Sources

This document applies the measurements of Tasks 1 to 5. The evidence behind each lever is in `02_Time_Bottlenecks_and_Tuning_Levers.md` (Part B), the validation of the patched brain in `bcf-brain-patched/validation/PATCHED-VALIDATION-2026-11-24.md`, the noise arithmetic and power tables in `04_Local_Scoring_and_Interpretation_Guide.md` (section 6), and the deadline facts in the Overview page of the competition (fetched 2026-11-24).
