# How to measure with the panel

**Prepared:** 2026-11-25. **Scope:** how to use P20 to compare two versions of the brain, what a 20-task panel can and cannot show, and how to record a run so that it can be read afterwards. The power figures come from the paired-power tool of the 2026-11-24 package (`tools/paired_power.py`), run here for panels of 20 tasks (`data/panel_power.md`).

---

## 1. What 20 tasks can show

Two identical runs of one agent disagree on a sizeable share of tasks: 10.7 percent of 663 tasks for the tuned agent of FreshSWE-Py (95 percent interval 8.6 to 13.3), 19 percent of 98 tasks in a paired test with the same QAT model this competition serves (arXiv 2611.19359). A panel can only separate two versions if its paired result rises above that noise.

Power of the exact paired sign test at the 5 percent level (share of experiments in which a real effect is detected), for a gain and a loss expressed per task:

| Real effect of the change | P20, 1 run (20 pairs) | P20, 2 runs (40) | P20, 3 runs (60) | P20, 5 runs (100) | The public 129, 1 run |
| --- | ---: | ---: | ---: | ---: | ---: |
| +10 points, no losses (2 tasks gained, none lost) | 1 percent | 21 percent | 56 percent | 94 percent | 99 percent |
| +10 points against 5 points of losses | 1 percent | 5 percent | 9 percent | 18 percent | 24 percent |
| +20 points against 5 points (4 gained, 1 lost) | 10 percent | 36 percent | 58 percent | 84 percent | 93 percent |
| +20 points, no losses (4 gained, none lost) | 20 percent | 84 percent | 99 percent | 100 percent | 100 percent |
| +30 points against 10 points (6 gained, 2 lost) | 17 percent | 44 percent | 63 percent | 88 percent | 95 percent |

Noise band of a single unpaired run (one standard deviation of the difference between two runs of two versions with equal true strength), in tasks:

| Tasks per run | Flip rate 10 percent | Flip rate 15 percent | Flip rate 19 percent |
| --- | ---: | ---: | ---: |
| 20 (P20) | plus or minus 1.9 | plus or minus 2.3 | plus or minus 2.5 |
| 30 | plus or minus 2.3 | plus or minus 2.8 | plus or minus 3.0 |
| 60 | plus or minus 3.3 | plus or minus 3.9 | plus or minus 4.3 |
| 129 | plus or minus 4.8 | plus or minus 5.7 | plus or minus 6.3 |

FreshSWE-Py's paper reaches the same conclusion from its own data: a true five-point gain is detected 8 percent of the time on 58 tasks, 21 percent on 120, 51 percent on 278 and 88 percent on 663; about 491 task-runs are needed for 80 percent power at its measured disagreement rate.

What follows for P20:

| Use | Good for | Not good for |
| --- | --- | --- |
| One run of P20 | A smoke test: does the bundle compile, install the helper, edit, finalize and return a score on unknown repositories; where does the time go | Any comparison of two versions (noise of about 2 tasks, or 10 points) |
| Three paired runs of P20 (60 pairs) | Detecting a gain of about 4 tasks with few losses; ranking a change that helps several tasks at once | Detecting a 2-task gain (56 percent power even with no losses) |
| Three paired runs of P20 plus one of B40 | Confirming a decision before it becomes a submission | Tuning: B40 is to be touched once per decision |

The same numbers hold when the pairs come from other panels instead of repeated runs of one panel: one run of two versions on P20 and R1 gives 40 pairs, on P20 and R1 to R3 gives 80 pairs. Repeats answer "is the difference on this panel real"; rotation answers "does it hold on other repositories" (Document 09, Sections 1 and 7). The playbook package (`deliverables/2026-11-25_BCF_Test_Sets_Playbook/`) has the scripts that build small slices of any panel for the loops between comparisons.

---

## 2. Protocol for one comparison

| Step | Rule | Reason |
| --- | --- | --- |
| 1. Gate | Gold resolves 20 of 20 and the empty patch 0 of 20 in the sandbox used for the run, for every version compared | A broken environment looks exactly like a weak agent |
| 2. Pair | The same 20 tasks in the same order for both versions, in the same sandbox image | Pairs cancel task difficulty |
| 3. Repeat | At least three runs per version | One run has a noise band of about 2 tasks |
| 4. Budgets | The budgets of the bundle's `eval_config.yaml` (8 minutes, 28 tool calls, 80 turns, 240 seconds per command); do not override them for a comparison | A version that only wins with a larger budget has not won |
| 5. Speed | Pad every model call to the scorer's decode speed (about 30 tokens per second on 4x L4, as measured by FreshSWE-Py on the scorer's own hardware) | A fast local GPU over-rewards thinking and long outputs; the reference agent's 11-point lead from thinking vanished at the scorer's speed |
| 6. Decide | A change is adopted when its mean resolved count is higher and it resolves strictly more tasks than it loses over the paired runs | The rule of Document 02, Section 10.6 of the 2026-11-23 package |
| 7. Confirm | Run the adopted version and the incumbent once each on B40; keep the change only if B40 does not contradict P20 | Guards against a change tuned to P20 by accident |
| 8. Log | One line per task and run with the fields of Section 3 | The score alone does not say why |

On speed: the 2026-11-24 package's `tools/run_panel.py` has no speed padding. FreshSWE-Py ships one (`run_eval.py --emulate-tps 30` in its `validation/scripts/`). If you run without padding on a fast GPU, record the tokens per second of the server and treat the result as an upper bound on the scorer's.

---

## 3. What to record per task and run

| Field | Where it comes from | Why |
| --- | --- | --- |
| Resolved | `task_results.jsonl` | The outcome |
| Agent time | The last `elapsed_s` of the trace; `duration_seconds` includes verification | The 12-hour limit of the scored run |
| Time of the first source edit | The first `apply` or `put` record in `/workspace/.git/bcf/journal.jsonl` (it is outside the patch) | First edit by 150 seconds is the helper's first milestone |
| Tool calls used | `task_results.jsonl` (`tool_calls`) | Against the limit of 28 |
| Refusals by the helper | Count of "NOT APPLIED" and "NOT RUN" answers in the trace; the journal keeps only successful edits | Shows whether the model recovers from a refused edit |
| Tests and repro scripts run | `test` and `repro` records of the journal, with their verdict | Whether something that could fail was run |
| Phase at submission | Elapsed seconds at `submit_patch`: EXPLORE, VERIFY, FREEZE or HARD | Late submissions |
| Planner | Did the planner make exactly two calls and relay the baton verbatim | The relay is the unproven part of the sequential bundle |
| Route | Category, domain and route of the relayed baton | Compare with the dry-run column of Document 01 |
| Nudges and compactions | Trace | Each nudge re-runs the planner |
| Strata | Repository, statement source (issue, pull request, commit), baseline stratum (both, one agent, neither), route | Where a version gains or loses |

Report four cuts of every run: the overall resolved count; the macro average per repository (so that one repository cannot decide); the resolved count per baseline stratum (a version that only solves what both baseline agents solved has not advanced); and the resolved count for issue statements alone, because pull-request descriptions can give the fix away.

---

## 4. Time and compute for one comparison

| Quantity | Value |
| --- | --- |
| Worst case per run of P20 | 20 tasks at 8 minutes: 2 hours 40 minutes |
| At the pace of the strongest public bundles (about 277 seconds per task) | about 1 hour 30 minutes per run |
| Three paired runs of two versions | 6 runs: 9 to 16 hours |
| One confirmation run of B40 on two versions | 80 task-runs, the length of 4 runs of P20: about 6 hours at 277 seconds per task, 10 hours 40 minutes at the 8-minute limit |
| Disk | One FreshSWE-Py download (6.97 GB) and one sandbox image with the wheelhouse |

Concurrency shortens the wall clock but changes the outcome: one team measured the scoring hardware at 2.1 to 2.6 times slower per session when 10 sessions ran at once. For a comparison, use the same concurrency for both versions.

---

## 5. What to expect on the first run

| Reference | Result on FreshSWE-Py | Conditions |
| --- | --- | --- |
| The author's tuned agent, thinking off | 39.4 and 39.2 percent in two runs on all 663 tasks | Gemma 4 31B, FP4 weights on a hosted endpoint, 10-minute budget, 40 tool calls |
| The organizers' reference agent, thinking on | 46.9 percent | Same conditions |
| Same reference agent on 22 tasks on the scorer's own 4x L4 | 4 resolved with thinking on, 3 with thinking off, under a 4.5-minute limit | Scorer's hardware and serving stack |
| Fix size | The tuned agent solved 78 percent of the fixes of 1 to 5 lines and 6 percent of those over 60 lines | Whole set |

P20 was drawn so that 9 tasks were solved by both agents and 7 by one. As a rough expectation, an agent of that class would solve about half of the panel; the BCF bundles have never been run, so their first run is a measurement, not a test.

Inspect three traces by hand after the first run, whatever the score: one easy task (`packaging_1187`), one short statement (`click_3642`) and one keyword trap (`packaging_1299`). Look for the planner's two calls, a baton relayed word for word, edits that go through the helper, a test or repro that could fail, and `finalize` before `submit_patch`.
