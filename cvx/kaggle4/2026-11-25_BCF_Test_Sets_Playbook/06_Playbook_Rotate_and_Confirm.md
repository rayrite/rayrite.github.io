# Playbook 6. Rotate through the sets, and confirm a decision

**Goal:** never let a change be judged by the tasks it was shaped on, and make the final decision on sets that have not been touched. Five sets of 20 and one of 40 are enough for a whole line of work.

## 1. The three rules

| Rule | Reason |
| --- | --- |
| Both versions always run on the same set | The sets hold different tasks: a result on R1 and a result on R2 are two different tests, even with 20 tasks each |
| Each new comparison uses a set that was not used while the change was written | A set whose tasks you have read while fixing a change can no longer judge that change |
| When the difference is small, pool sets rather than repeat one | Repeats answer "is it real on these tasks"; rotation answers "does it hold on other kinds of repository" |

## 2. A schedule that uses every set once

| Comparison | Set | Task-runs for two versions | Time at the scorer's pace |
| --- | --- | --- | --- |
| Change 1 | P20 | 40 | 3 hours |
| The loops while every change is written | Slices of the set in use (`slice_A` first, then `slice_B` or `check_B`) | 10 per loop | 46 minutes per loop |
| Change 2 | R1 | 40 | 3 hours |
| Change 3 | R2 | 40 | 3 hours |
| Change 4 | R3 | 40 | 3 hours |
| Final check | R4, then B40 | 40 and 80 | 3 hours and 6 hours |

When the four changes are done, start again at P20: by then its tasks have not been read for a while. Keep R4 and B40 untouched until the final check, and write down which set served which change, in a table like this one (keep it in a file of your own):

| Change | Date | Sets read during development | Set of the decision | Result | Sets still untouched |
| --- | --- | --- | --- | --- | --- |
| example: shorter planner prompt | 2026-11-27 | P20 (slice_A, slice_B) | P20, three paired runs | rule met | R1, R2, R3, R4, B40 |

## 3. What pooled sets can show

A pair is one task run by both versions. The table gives the share of experiments in which a real change is detected (the exact paired sign test, as in Document 06 of the portfolio package).

| Real effect of the change | One set, 20 pairs | Two sets, 40 pairs | Three sets, 60 pairs | Four sets, 80 pairs | Five sets, 100 pairs |
| --- | --- | --- | --- | --- | --- |
| Gains 2 tasks per 20, loses none | 1 percent | 21 percent | 56 percent | 82 percent | 94 percent |
| Gains 2, loses 1 | 1 percent | 5 percent | 9 percent | 13 percent | 18 percent |
| Gains 4, loses 1 | 10 percent | 36 percent | 58 percent | 74 percent | 84 percent |
| Gains 4, loses none | 20 percent | 84 percent | 99 percent | 100 percent | 100 percent |
| Gains 6, loses 2 | 17 percent | 44 percent | 63 percent | 78 percent | 88 percent |

A change that gains four tasks per 20 and loses one is detected 36 percent of the time on two sets and 74 percent on four. One run of each version on four sets (80 pairs) costs the same as four paired runs of one set, and tells you in addition that the change holds on other repositories.

## 4. Step by step: a comparison on a new set

**Step 1. The gate**, the first time the set is used (not run here):

```bash
python3 tools/gates.py --set R1 --part full
```

**Step 2. Loops on its slices if the change is still moving** (not run here):

```bash
python3 tools/run_set.py --set R1 --part slice_A --version v3
python3 tools/run_set.py --set R1 --part slice_A --version v4
python3 tools/compare.py ~/bcf/results/R1/slice_A/v3-run1 ~/bcf/results/R1/slice_A/v4-run1
```

**Step 3. The full set, three paired runs, or several sets once.** The commands are those of Playbook 5 with `--set R1`, then `--set R2`, and so on. Pool the sets in one report:

```bash
python3 tools/compare.py v3=~/bcf/results/R1/full/v3-run1 v3=~/bcf/results/R2/full/v3-run1 \
                        v4=~/bcf/results/R1/full/v4-run1 v4=~/bcf/results/R2/full/v4-run1
```

The names in `v3=...` are the version names; the tool pairs the runs in the order they are listed.

## 5. The confirmation on B40

B40 has 40 tasks of the same three repositories as P20, with larger fixes (median 22 lines against 7 in P20). It is used once per decision, for the version you are about to keep and the one it replaces.

**Step 1. The gate**, if B40 has not been gated yet (not run here):

```bash
python3 tools/gates.py --set B40 --part full
```

**Step 2. The first half, both versions** (not run here; about 3 hours at the scorer's pace):

```bash
python3 tools/run_set.py --set B40 --part half_1 --version v4
python3 tools/run_set.py --set B40 --part half_1 --version v3
python3 tools/compare.py ~/bcf/results/B40/half_1/v3-run1 ~/bcf/results/B40/half_1/v4-run1
```

**Step 3. Read, then decide whether to continue.** If the new version is clearly behind on the first half (more tasks lost than gained), stop here: the change contradicts B40 and is not kept. Otherwise run the second half with the same three commands and `--part half_2`, and read both halves together:

```bash
python3 tools/compare.py v3=~/bcf/results/B40/half_1/v3-run1 v3=~/bcf/results/B40/half_2/v3-run1 \
                        v4=~/bcf/results/B40/half_1/v4-run1 v4=~/bcf/results/B40/half_2/v4-run1
```

The two halves are paired by their order in the list. A change is kept when the set of the decision (P20 or a rotation set) showed the rule met and B40 does not contradict it: about as many tasks gained as lost, or more.

**Step 4. Write it down.** `python3 tools/ledger.py` updates `LEDGER.md`; add the line to your own table of Section 2.

## 6. The checklist of a decision

- [ ] The gate of every set used has passed (20 of 20 and 0 of 20; 40 of 40 and 0 of 40 for B40)
- [ ] Both versions ran on the same tasks, in the same sandbox, with the bundle's budgets
- [ ] Three paired runs of a full set, or the same number of pairs pooled over rotation sets
- [ ] No run has a harness error
- [ ] The adoption rule is met: a higher mean and strictly more tasks gained than lost
- [ ] The lost tasks were read, not only counted
- [ ] B40 ran once for both versions and does not contradict the decision
- [ ] The ledger and your table name the change, the sets and the result
