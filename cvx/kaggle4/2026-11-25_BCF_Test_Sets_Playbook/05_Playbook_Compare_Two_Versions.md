# Playbook 5. Compare two versions of the brain

**Goal:** decide, with numbers that mean something, whether a change to the brain is an improvement. The comparison is **paired**: both versions run the same tasks of the same set, in the same sandbox, with the same budgets, and every task is compared with itself.

| Item | Statement |
| --- | --- |
| Time | A loop on a slice: about 45 minutes per version at the scorer's pace. A decision: three paired runs of a full set, about 4.5 hours per version, plus B40 once |
| What was executed for this playbook | `compare.py` and `ledger.py`, on pretend results written in the harness's own result format (`tools/selftest.py`). No model was called, so the example below is from pretend results and says so |
| The one rule to remember | Two identical runs of the same agent differ on about 2 tasks in 20. A change smaller than that is invisible in one run, whatever the score looks like |

## 1. What a version is

A version is one build of the brain, in its own folder under `~/bcf/brain/dist/`, under a name you choose: `v1`, `v2`, `flat-2`. The tools record a checksum of the bundle with every run, so two runs can be shown to use the same build. To make a new version after a change under `~/bcf/brain/parts/` or `src/prompts/` (from the setup guide of the 2026-11-24 package; not run here):

```bash
source ~/bcf/.venv-harness/bin/activate
cd ~/bcf/brain
python assemble.py && python build.py
python -m unittest tests.test_bcf
python tools/run_validator.py
```

**Expect:** `OK` from the tests; from the validator, the official compiler at 6 of 6 and the controls at 15 of 15 (the figures of the 2026-11-24 package). Then give the folder a name in `playbook.conf` (`BUNDLE=dist/bcf-31b-flat`) or pass it to each command (`--bundle dist/<folder>`).

## 2. The protocol

| Step | Rule | Reason |
| --- | --- | --- |
| 1. Gate | The reference fix resolves every task and no patch resolves none, in the sandbox used for the run | A broken environment looks exactly like a weak agent |
| 2. Pair | The same tasks in the same order for both versions, in the same sandbox image | Pairing cancels the difficulty of the tasks |
| 3. Repeat | At least three runs per version | One run has a noise band of about 2 tasks |
| 4. Budgets | Those of the bundle's `eval_config.yaml` (8 minutes, 28 tool calls, 80 turns, 240 seconds per command); never override them for a comparison | A version that only wins with a larger budget has not won |
| 5. Speed | The model server runs at one speed for both versions, with nothing else on the GPU | A faster server flatters long thinking |
| 6. Decide | The change is adopted when its mean resolved count is higher and it resolves strictly more tasks than it loses over the paired runs | The rule of the measurement protocol of the portfolio package |
| 7. Confirm | Run the adopted version and the incumbent once each on B40; keep the change only if B40 does not contradict the set | Guards against a change tuned to one set by accident |
| 8. Log | One line per run in `LEDGER.md`, a note of what the change was | The score alone does not say why |

The runner applies rule 4 by itself: it reads the budgets from the bundle.

## 3. The loop on a slice

While a change is being written, work on one slice; both versions, the same slice (not run here):

```bash
cd ~/bcf/playbook
python3 tools/run_set.py --set P20 --part slice_A --version v1 --bundle dist/bcf-31b-flat
python3 tools/run_set.py --set P20 --part slice_A --version v2 --bundle dist/bcf-31b-flat-v2
python3 tools/compare.py ~/bcf/results/P20/slice_A/v1-run1 ~/bcf/results/P20/slice_A/v2-run1 --name v1 v2
```

**What to read:** the tasks that changed (table 4 of the output) and their logs. Five tasks cannot rank two versions (Playbook 4, Section 7); they can show that a change does what you meant on the tasks you watch, and that nothing obvious broke.

## 4. The decision on a full set

When the change looks right on slices (not run here; about 4.5 hours per version at the scorer's pace):

```bash
for v in v1 v2; do for r in 1 2 3; do
  python3 tools/run_set.py --set P20 --part full --version $v --run $r
done; done
python3 tools/compare.py v1=~/bcf/results/P20/full/v1-run1 v1=~/bcf/results/P20/full/v1-run2 v1=~/bcf/results/P20/full/v1-run3 \
                        v2=~/bcf/results/P20/full/v2-run1 v2=~/bcf/results/P20/full/v2-run2 v2=~/bcf/results/P20/full/v2-run3 \
                        --md ~/bcf/results/P20/full/v1-against-v2.md
python3 tools/ledger.py
```

The loop is typed as one block. `compare.py` pairs the first run of `v1` with the first of `v2`, the second with the second, and so on, and pools the 60 pairs. The report is written next to the results and `LEDGER.md` has one line per run.

## 5. How to read the report

The report has five parts. This is the real output of `compare.py` on **pretend results** (written by a script for this example, not by the brain), cut to the first rows of the fourth table:

```text
# before against after

## 1. The runs

| Version | Set and part | Run | Tasks | Resolved | Rate | Mean seconds per task | Errors |
| --- | --- | --- | --- | --- | --- | --- | --- |
| before | P20/full | va-run1 | 20 | 10 | 50% | 340 s | 0 |
| before | P20/full | va-run2 | 20 | 14 | 70% | 340 s | 0 |
| after | P20/full | vb-run1 | 20 | 14 | 70% | 340 s | 0 |
| after | P20/full | vb-run2 | 20 | 16 | 80% | 340 s | 0 |

## 2. Paired, task by task

| Pairs | Solved by both | before only | after only | Neither | Difference (after minus before) | p of the sign test |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 40 | 14 | 10 | 16 | 0 | +6 | 0.327 |

## 5. What it means

- 40 pairs from 2 paired runs of each version: provisional. The adoption rule is read after three paired runs of a full set; two identical runs of one agent differ by about 2 tasks in 20 (Playbook 5).
- So far: mean resolved per run before 12.0, after 15.0; tasks gained 16, tasks lost 10.
- p = 0.33 of the sign test on the 26 pairs that differ: a difference this large is within what chance produces.
```

| Part of the report | What it tells you |
| --- | --- |
| 1. The runs | Whether every run has its tasks and no errors; a run with errors is read after the errors are understood |
| 2. Paired | The tasks only one version solved. The difference and the p-value come from the sign test on those tasks alone |
| 3. By group and by statement | Where the change helps: on tasks both baselines solved (the core), on the margin, or on a kind of statement |
| 4. The tasks that changed | The list to read, task by task, with the logs of the runs: this is where the cause is |
| 5. What it means | The size of the evidence, and whether the adoption rule is met |

With three paired runs the last part states whether the adoption rule is met: the mean resolved count per run is higher, and more tasks are gained than lost over the 60 pairs.

## 6. What to do with the result

| Result | Next |
| --- | --- |
| Errors in a run | Stop. Find the error in `task_results.jsonl` (the `error` field) and in Playbook 7; an error is a property of the machine, not of the brain |
| The rule is not met | The change is not kept. Read the lost tasks before dropping it: a change that gains 8 and loses 7 may be two changes |
| The rule is met | Confirm once on B40 (Playbook 6); keep the change only if B40 does not contradict P20 |
| The rule is met but the gain is on the margin only | Run the same comparison on a rotation set (Playbook 6): a gain that shows only on one set is a tuned gain |

## 7. What not to do

| Do not | Because |
| --- | --- |
| Compare a run on one set with a run on another set | The sets hold different tasks; the difference would be the tasks, not the brain |
| Decide on one run | Two identical runs differ by about 2 tasks in 20 |
| Run two versions at the same time on the GPU | The server slows down and the budgets (8 minutes per task) cut the agent short |
| Give the new version more time, calls or turns | It would win for the wrong reason |
| Keep the change because the score went up and ignore the lost tasks | The rule counts gains and losses task by task for that reason |
| Use B40 more than once per decision | After it has shaped a change, it can no longer judge it |
