# Task 4 - Scoring and evaluating local runs: how to read them, how they relate to the official score, and how to turn them into tuning decisions

**Prepared:** 2026-11-24. **Applies to:** result folders written by `swegemma eval` (wheelhouse v31) for any of the six BCF bundles. **Companion tool:** `tools/run_report.py` in this package turns one or more result folders into the tables described in section 3 (standard library only; exercised on a synthetic fixture because no model run exists yet).

---

## 1. What a run writes

| File | Written by | Contains | Use it for |
| --- | --- | --- | --- |
| `summary.json` | after every task | `total_tasks`, `resolved`, `resolution_rate`, `by_repo`, `errors` | A first glance only: it has no timing and no outcome classes |
| `task_results.jsonl` | after every task | one line per task: `instance_id`, `repo`, `resolved`, `agent_patch_size`, `test_exit_code`, `duration_seconds`, `error`, `tool_calls`, `total_llm_calls`, `task_index` | The score, the outcome class, the call counts |
| `traces/trace_<id>.json` | at the end of a task | the ATIF v1.7 trajectory: every model step with its tool calls and arguments, every tool response, token usage, `final_metrics` with `total_prompt_tokens` and `total_completion_tokens` | Time, tokens, process counters, compliance |
| `logs/<id>.log` | during the task | the readable transcript of the agent session | Reading one task by hand |
| `test_outputs/<id>.log` | after verification | the stdout and stderr of the pytest run in Container B | Why a patch failed: assertion, missing dependency, skip |
| `patches/<id>.patch` | after verification | the exact unified diff extracted from Container A | What the agent really changed |

One fact to keep in mind before any number is read: **`duration_seconds` is not the agent's time.** The harness starts its clock before Container A is set up and stops it after Container B has verified the patch (`evaluate.py`, `start_time` at the top of `evaluate_task`; `verify_task` returns `time.perf_counter() - start_time`). The agent's own time is the last `elapsed_s` in the trace. A mean of 300 in `duration_seconds` may contain 60 seconds of setup and 60 of verification. The agent's own time is the last `elapsed_s` in the trace: the trace starts when Container A starts, so it includes that container's setup and excludes verification. The budgeted agent time proper is still smaller (the harness starts it after setup), so the trace figure is an upper bound for it and the right one for the 12-hour arithmetic, which includes setup.

---

## 2. Before the numbers: three panels and four exclusions

| Panel | Size | Purpose | Cost on the 5090 |
| --- | ---: | --- | --- |
| Smoke | 3 to 5 tasks, one of each repository | "Does the bundle run end to end, and what does one call cost?" | 5 to 15 minutes |
| Speed | 10 tasks chosen for long trajectories | "Does the bundle stay inside the time and call budgets?" | 20 to 50 minutes |
| Ranking | the 30-task panel of the validation report, or its 52-task superset | "Is bundle A better than bundle B?" | 1.5 to 3 hours per run |

Exclusions, applied before any comparison:

1. **Ungradable here (29 tasks, 22.5%):** 21 FastAPI tasks whose tests import `inline_snapshot` or `dirty_equals` and 8 requests tasks that need the `httpbin` fixture. A correct patch fails them in the public sandbox and in the staff notebook. They add noise without information.
2. **Unsatisfiable in one interpreter (2 tasks):** `fastapi_14186` and `rich_3486`, whose required tests are skipped under mutually exclusive conditions (discussion 754586).
3. **Network-dependent (the same eight requests tasks):** under `network_mode='none'` they fail with `OSError: [Errno 101] Network is unreachable` (discussion 754586). They are the eight tasks of exclusion 1, seen from the scorer's side: 31 tasks are excluded in total, not 39.
4. **Severe and hard (31 tasks):** severe specification gap with difficulty 4 or 5. Keep them in a separate "long tail" count; never in the ranking panel.

Run the panel **in the same order every time**, repeat **three times per bundle**, and keep the results folder named by the bundle's SHA-256 (`dist/MANIFEST.json` has it) so that a rerun cannot be mistaken for a new variant.

---

## 3. The report, table by table

Run `python tools/run_report.py results/run1 results/run2 --labels data/rca_merged.jsonl --out report.md` (the labels file is `rca_merged.jsonl` of the RCA package). Seven tables come out. Each has a question it answers and a pattern that should make you act.

### 3.1 Score and time

| Column | Question | Act when |
| --- | --- | --- |
| Resolved and Rate | How many tasks passed? | Only compared with another run on the same panel |
| Errors and Empty patches | How many tasks produced nothing? | More than one empty patch in thirty: read those traces first; an empty tree scores zero |
| Agent s: mean, p50, p90, max | How long did the agent take, from the trace? | A p90 near the cap means the governor is not ending tasks early enough |
| Projected s: mean, p90 | What would the agent have taken at the scorer's decode rate? | Mean above 300: the 12-hour risk is real (360 is the ceiling at 120 tasks) |
| Projected hours for the run | Mean projected time times the task count | Above 10.8 hours: lower the per-task cap before submitting |
| Tasks over budget | How many tasks would exceed the mean budget? | Each one is a task that probably ends without `submit_patch` |

The projection replaces the model's decode time with `completion tokens / rate` and keeps the tool time as measured. Its two parameters are the decode rate (13 to 25 tokens per second published; the tool defaults to 20) and the time to first token (default 1 second per call). It is an estimate, and it is deliberately conservative in the direction that matters: a projected mean that fits is a better sign than a local mean that fits.

### 3.2 Tokens per task

| Column | Act when |
| --- | --- |
| Completion tokens: mean and p90 | The mean is above about 9,000 (28 calls at the affordable 219 to 322 tokens): the model is thinking or writing too much per call |
| Output tokens per call: mean | Above 400: the same conclusion seen per call |
| max in one call | Near 8,192: one call is consuming the output cap; expect a MAX_TOKENS nudge and a lost edit |
| Prompt tokens: mean | Growing with the call count: context is not being kept small; compaction will follow |

### 3.3 Process counters

| Column | Act when |
| --- | --- |
| Tool calls per task: p90 | At or near 28: tasks run out of calls before they run out of time |
| Refused helper edits | More than about one per two tasks: the search blocks are wrong (stale text, non-unique match); read two refusals |
| Tool errors | Any: each one is a wasted call; read the first |
| Nudges | Any: a turn ended without `submit_patch`; in the relay, each nudge also re-runs the planner |
| Compactions | Any in the first 15 calls: the context grows too fast |
| Tasks with `finalize` | Should equal the number of tasks with a patch; otherwise the solver is submitting without the hygiene step |
| Tasks with `submit_patch` | Should equal the number of tasks with a non-empty patch |
| Patches touching protected paths | Must be zero; the harness discards those files, and the helper is supposed to refuse them |
| List-argument calls | Must be zero: a list argument is the parser-hang hazard of vLLM 0.19.1 |

### 3.4 Outcome of every task

Every unresolved task gets exactly one class, in this order:

| Class | Meaning | First thing to read |
| --- | --- | --- |
| `no edit: calls exhausted` | The budget of tool calls ended with nothing on disk | The call list: where did the calls go? |
| `no edit: time` | The time ended with nothing on disk | The first-call time and the tokens per call |
| `no edit` | Neither budget ended and still no edit | The last three tool results |
| `patch did not apply` | The diff could not be applied in Container B (four passes) | `patches/<id>.patch`: binary content, a renamed file, a mode change |
| `no JUnit report` | Pytest exited 0 but wrote no report | `test_outputs/<id>.log`: an early `os._exit` |
| `required test failed or skipped` | A required node failed or was skipped | The assertion in `test_outputs/<id>.log` |
| `ungradable here` | A dependency or a network fixture is missing | Nothing: exclude the task |
| `pytest error (exit 2 to 5)` | Interrupted, internal error, usage error, or nothing collected | The collection error in the log |
| `harness error` | An exception in the evaluation itself | `error` in `task_results.jsonl` |
| `edit but time ran out before submit` | An edit exists and no `submit_patch` was called | Why the turn did not end |

### 3.5 Breakdowns

Resolved counts by category, domain, route, specification gap and difficulty, taken from the RCA records. The useful reading is a row where one bundle is clearly ahead or behind: a route with zero resolved in three runs is a route whose procedure is wrong, not a hard route.

### 3.6 Paired comparison

For two runs on the same tasks: both, A only, B only, neither, the difference and the exact sign-test p-value. **This is the only table that can rank two bundles.** Rules:

- A change is adopted when A-only is larger than B-only **and** the projected mean time is not worse.
- A difference of one task is noise at any panel size. With 30 paired tasks, a true gain of 10 percentage points with no losses is detected 7% of the time (section 6).
- When three runs of each bundle exist, pair run 1 with run 1, run 2 with run 2 and run 3 with run 3, and add the three tables.

### 3.7 Per task

One line per task with every counter, for the traces you decide to open.

---

## 4. Reading one task

| Start from | Then | Conclusion |
| --- | --- | --- |
| `agent_patch_size` is 0 | `tool_calls` and the trace | The agent never edited: a localization failure, a refusal loop, or a budget that ended first |
| `error` mentions "Failed to apply agent patch" | `patches/<id>.patch` | The edit is not a clean text diff |
| `test_exit_code` is 1 | the `FAILED` lines in `test_outputs/<id>.log` | The fix is wrong or incomplete, or a sibling test in the same file broke |
| `test_exit_code` is 2 to 5 | the collection error | The patch broke an import, or a fixture is missing |
| `error` says "Required test node did not pass" with exit 0 | the skipped tests in the log | A required test was skipped: an unsatisfiable task or a skip the fix caused |
| Resolved, but the projected time is near the cap | the call list | A win that would not survive a slower scorer |

For a resolved task, still read the first-edit time and the call count: the cheap wins are the ones to protect when a lever changes the early phase of a task.

---

## 5. Compliance checks on a trace

The brain has rules that the score cannot show. Check them on three tasks per run (one per repository), by hand from `logs/<id>.log` or through the tool's counters.

| Check | Pass condition | Where |
| --- | --- | --- |
| The installer ran once, first | The first tool call of the task is the skill call, or the installer reports a re-entry | Trace, first `tool_calls` |
| The baton was relayed verbatim (relay bundles only) | The planner's final text equals the `<<<BCF-SPEC` block printed by `plan` | `logs/<id>.log` |
| Every file change went through the helper | No `edit_file`, no `write_file`, no `python3 -` heredoc that opens a file for writing in the solver's calls | Trace, `arguments` of `run_command` |
| The first edit exists by call 10 (31B) or call 6 (E4B) and before the governor's first gate | The first `APPLIED` appears before that | Trace |
| Verification happened | At least one `repro` or `test` call, and for P1 and P2 routes a repro that failed before the fix | Trace |
| `finalize` ran before `submit_patch` | Both present, in that order, `patch_size` above 0 | Trace |
| No protected path was edited | "Patches touching protected paths" is 0 | Report table 3 |
| No list argument was emitted | "List-argument calls" is 0 | Report table 3 |
| No tool call after `submit_patch` | The last tool call is `submit_patch` or nothing follows it | Trace |
| Thinking stays inside its budget | `max in one call` is below the output cap | Report table 2 |

A bundle that passes all ten and scores lower than one that fails three is still the better bundle: the failures are what the slower scorer will punish.

---

## 6. Local results against the official score

### 6.1 What the evidence says

| Finding | Source | What it means for reading a local run |
| --- | --- | --- |
| Byte-identical submissions scored 0.17 and 0.24, and 0.15 and 0.20 | Discussions 757588, 760924 | A single leaderboard value has a band of about 4 tasks (0.07) |
| The per-task flip rate between identical runs is 10 to 19% | arXiv 2611.19359; discussions 758969, 758954 | The band comes from tasks flipping, not from a different score formula |
| A pooled estimate of the standard deviation is about 1.5 tasks per draw; identical configurations disagreed on 5 to 8 of 129 tasks locally | 759329 (reply), 760595 (Adam Johnson) | Local single runs have the same kind of noise as the leaderboard |
| A real gain of two tasks is misranked 11 to 20% of the time with one run; a three-task effect needs 4 to 8 repetitions of the full set for p below 0.05 | 758954, 760595 | One run can rank nothing that differs by less than about four tasks |
| Local scores correlate with the leaderboard for a plain single-agent prompt, and stop correlating for elaborate multi-agent bundles that solved locally and scored 0.06 to 0.08 | 760924 (Murugesan Narayanaswamy) | The further a bundle is from a plain agent, the more the scorer's speed and compaction punish what worked locally |
| A local tie of 28 of 74 scored 0.17 and 0.10 | 751973 | Local rank inside a tie is meaningless |
| The scored tasks come from private repositories and "behave very differently" from the 129 public tasks | 756400, 745998 | The public panel is a ranking signal, never a calibration of the absolute score |
| Reference points on the public tasks: agentless with the unquantized model 47 of 129; the 31B model through the same harness 54 of 124 for a competitor; the top of the leaderboard is 14 of 58 | 758218, 761060, leaderboard capture | Public-task rates of 35 to 45% coexist with a leaderboard top of 24% |

### 6.2 The arithmetic of one leaderboard value

One task is 1/58 = 0.0172. If each task flips between two runs of the same bundle with probability f, the difference between two single runs has a standard deviation of `sqrt(2 x 58 x f x (1 - f))` tasks:

| Flip rate f | Standard deviation of a difference | One-sigma band in score | A difference you can trust (two sigma) |
| --- | ---: | ---: | ---: |
| 0.10 | 3.2 tasks | 0.056 | about 0.11 |
| 0.15 | 3.9 tasks | 0.067 | about 0.13 |
| 0.19 | 4.2 tasks | 0.073 | about 0.15 |

So a leaderboard move from 0.20 to 0.22 between two single submissions is inside the noise, and a move from 0.17 to 0.24 is about one sigma. **The leaderboard confirms that a submission ran and scored in the expected band. It does not rank bundles.**

### 6.3 What a local panel can and cannot detect

Exact power of the paired sign test at the 5% level, computed for this document (`scratch/2026-11-24-bcf-tuning-parity/scripts/paired_power.py`):

| Effect of the change (gain g, loss l per task) | 30 pairs | 90 pairs | 129 pairs | 387 pairs |
| --- | ---: | ---: | ---: | ---: |
| +10 points, no losses (g = 0.10, l = 0) | 7% | 90% | 99% | 100% |
| +10 against 2 (g = 0.10, l = 0.02) | 5% | 50% | 71% | 100% |
| +5 points, no losses (g = 0.05, l = 0) | 0% | 29% | 63% | 100% |
| +5 against 1 (g = 0.05, l = 0.01) | 0% | 15% | 32% | 89% |
| +7 points on top of a 27% flip rate (g = 0.17, l = 0.10) | 5% | 18% | 27% | 73% |
| +7 points, no losses (g = 0.07, l = 0) | 2% | 61% | 89% | 100% |

The table says what the board has been saying: one run of a 30-task panel cannot see a ten-point improvement, and three runs of it see it only when the change loses nothing. Repeats of the same tasks are not independent observations, so the multi-run columns are optimistic; treat them as upper bounds.

What follows for the workflow:

| Local can decide | Local cannot decide |
| --- | --- |
| That a change removes a failure class (the outcome table moves) | The leaderboard value of the resulting bundle |
| That a change lowers time and tokens per task | Whether the hidden repositories behave like the public ones |
| That a change is not worse on paired tasks, when the effect is large or loss-free | Differences of one or two tasks |
| That the brain follows its own rules (section 5) | Backend failures, the queue, the silent 0.00 |
| That the projected mean fits the clock | The real setup cost on the scorer |

### 6.4 Building your own calibration line

Keep one row per official attempt and one row per local panel run of the same bytes:

| Field | Why |
| --- | --- |
| Date and time of the submission (UTC) | Queue position and the 24-hour rhythm |
| Bundle name and SHA-256 | The link between the local run and the scored run |
| Local panel: tasks, resolved in each of three runs, mean and p90 projected seconds | The predictors |
| Hours from submission to score | A very low score with a long latency is an infrastructure fault, not a draw (759329) |
| Public score and the result size | The outcome; about 3,230 bytes means a backend failure, not a score |

After three attempts you have three pairs (local mean, public score). Do not fit a line: read whether the local mean predicted the band (plus or minus 0.07) each time. A bundle whose local panel is 6 tasks better than another's is the one to select as a final, whatever the two public scores say, because the private leaderboard is one draw (Document 02 of the RCA package, section 10.1).

---

## 7. From results to a tuning plan

### 7.1 Failure class to lever

Read the outcome table of a run, take the largest unresolved class, and use the row. The lever numbers are those of Task 2, Part B.

| Class in the outcome table, or the counter | Most likely cause | Levers | Confirm with |
| --- | --- | --- | --- |
| `no edit: calls exhausted` | Localization or refusal loop consumed the calls | 4 (prompt length), 6 (localizer), 14 (routes), 2 (earlier first-edit gate) | Refused edits and first-call time in table 3 |
| `no edit: time` or `edit but time ran out before submit` | Too many tokens per call | 1 (thinking budget), 2 (gates), 12 (output cap), 13 (planner thinking) | Table 2 and the projected mean |
| `required test failed or skipped` on P1 and P2 routes | The repro was not a real oracle | 15 (hints), the fail-first rule of the prompt | Repro results in the trace: passed before the fix? |
| `required test failed or skipped` on P3 routes | Wrong file or wrong guess | 6, 14, 15 | The first `ctx` target against the gold file |
| `pytest error` | The patch broke an import | The compile gate cannot see imports: add an import smoke test for new modules | The traceback in the log |
| Refused edits high | Search text not copied exactly, or non-unique | 4 (the worked example), 10 (drop `read_file`) | Two refusals read by hand |
| Nudges present | A turn ended without `submit_patch` | 12 (output cap), the finish rule of the prompt | The nudge variant in the trace |
| Compactions present | Context grows too fast | 4 (shorter prompt), helper output caps | Prompt tokens per call in table 2 |
| Projected mean above 300 | Everything is a little too slow | 1, 2, 3 (the cap itself), 9 | Projected hours in table 1 |
| Resolved by route: one route at zero | The procedure of that route is wrong | 14, 15 | Breakdown table |

### 7.2 The loop

1. **Read** the report of the last run. Write down the largest unresolved class and its count.
2. **Pick one lever** for that class. One at a time, so that the next run attributes the change.
3. **Tiers**: T0 (build, compiler) and T1 (helper tests, replay, localizer) for every change; T2 (smoke) for a prompt change; T3 (ranking panel, three runs, paired against the baseline) for anything that claims a score effect.
4. **Decide before the run**: write the adopt condition in the ledger of Task 2 (C.5).
5. **Decide after the run** with the paired table: adopt, reject, or "inconclusive: more pairs".
6. **Update the baseline** only on adopt; keep its results folder as the new reference.

### 7.3 Two worked readings

The numbers are illustrative and chosen to show the reasoning, not measured.

| Situation in the report | Reading | Action |
| --- | --- | --- |
| 30 tasks; 9 resolved; 6 `no edit: calls exhausted`; refused edits 31; p90 calls 28 | The agent spends its calls on edits that do not apply | Open two refusals. If the search text differs from the file by whitespace, the flexible matcher should have accepted it: look at the blocks. If the same block is sent twice, the prompt's rule is not followed: lever 4 or 10 |
| 30 tasks; 12 resolved in all three runs; projected mean 340; p90 520; 4 tasks over budget | The score is stable and the time is not | Levers 1 and 2 first (thinking 2,048, earlier gates); re-run the speed panel; adopt if the projected mean falls below 300 and the resolved count in the paired table does not |

---

## 8. Sources

| Source | Publisher | Date | Used for |
| --- | --- | --- | --- |
| `swegemma` 0.2.11 (`results.py`, `evaluate.py`, `harness/verification.py`) and `adk-eval-core` 0.1.0 (`tracing/trace.py`, `tracing/atif_converter.py`) | Kaggle wheelhouse v31 | read 2026-11-24 | The artifacts, the meaning of `duration_seconds`, the trace format |
| [Variation is the biggest differentiator](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760924), [Where a small E4B agent loses tasks](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760595), [thinking-budget and noise advice](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759329), [scorer-minutes](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758954), [Byte-identical resubmission scored 0.00](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/761004) | competitors | 2026-10 to 2026-11 | Local-versus-leaderboard evidence, noise, the 3,230-byte signature |
| [One Run Is Not Enough](https://arxiv.org/abs/2611.19359) (arXiv 2611.19359) | cited through the RCA package | 2026-11 | Flip rate |
| [statsmodels `mcnemar`](https://www.statsmodels.org/stable/generated/statsmodels.stats.contingency_tables.mcnemar.html) | statsmodels | fetched 2026-11-24 | The exact binomial form of the paired test |
| `03_Validation_Results_and_Submission_Playbook.md` (the 30-task panel and its exclusions) | this project | 2026-11-24 | Section 2 |
| Power tables | computed for this document | 2026-11-24 | Section 6.3 |
