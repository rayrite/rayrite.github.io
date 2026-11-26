# Playbook 3. The test sets: what they are and which one to use

**Goal:** know what P20, B40 and R1 to R4 are, where they come from and what each is for.

## 1. One task

A task is one real bug in one open-source Python repository, turned into a row in the competition's format. The row holds what the Kaggle scorer uses:

| Field | Content |
| --- | --- |
| `instance_id` | The name of the task: repository and number, for example `click_3434` |
| `repo`, `base_commit` | The repository and the commit before the fix; the sandbox starts from it |
| `problem_statement` | The text the agent reads: the issue, or the description of the pull request |
| `patch` | The reference fix, written by the maintainers |
| `test_patch` | The hidden tests: they fail before the fix and pass after it |
| `created_at` | When the fix was merged |

The FreshSWE-Py data set adds fields of its own that the scorer ignores, among them which baseline agents solved the task and where the statement came from. This playbook uses those two to cut the sets.

## 2. The six sets

All tasks come from one public data set, **FreshSWE-Py** (663 validated tasks from 33 repositories, all created in April 2026 or later, after the Gemma 4 model was released). The portfolio package of 2026-11-25 selected the sets from it.

| Set | Tasks | Repositories | Statement sources | Solved by both baselines | By one | By neither | Created from | Created to |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P20 | 20 | 3 (`packaging` 8, `click` 6, `more-itertools` 6) | 13 closed issues, 6 pull requests, 1 changelog | 9 | 7 | 4 | 2026-04-08 | 2026-09-18 |
| R1 | 20 | 15 | 11, 7, 2 | 9 | 7 | 4 | 2026-04-10 | 2026-10-17 |
| R2 | 20 | 18 | 10, 9, 1 | 9 | 7 | 4 | 2026-04-02 | 2026-10-15 |
| R3 | 20 | 17 | 10, 9, 1 | 9 | 7 | 4 | 2026-05-26 | 2026-10-17 |
| R4 | 20 | 18 | 10, 8, 2 | 9 | 7 | 4 | 2026-04-05 | 2026-10-03 |
| B40 | 40 | 3 (the ones of P20) | 11 closed issues, 29 pull requests | 14 | 10 | 16 | 2026-04-05 | 2026-09-21 |

No task is in two sets. The 26 repositories of R1 to R4 are not among the three of P20 and B40, and none of the 29 is one of the four public repositories of the competition (FastAPI, rich and Requests are three of them): by a statement of the organizers, the scored tasks all come from repositories that are in neither, so a set of other repositories is the right instrument.

## 3. What "solved by both, one, neither" means

FreshSWE-Py was published with the results of two reference agents on every task: the author's own tuned agent (two runs) and the organizers' reference agent (one run). For every task that gives:

| Group | Tasks in a set of 20 | What a task of the group is good for |
| --- | --- | --- |
| Both baseline agents solved it | 9 | The core: a healthy brain solves most of them; a change that loses one of them is a regression |
| One baseline agent solved it | 7 | The margin: these tasks separate a good change from noise, because they are solvable but not easily |
| Neither baseline agent solved it | 4 | The stretch: rarely solved; a change that solves one is worth a look, and one that never solves any is normal |

A set built any other way would be easier to pass by accident: a set of 20 easy tasks is solved 20 to 18 by every version, a set of 20 hard ones 0 to 2. The mix 9 : 7 : 4 is the same in P20 and in each of R1 to R4, so a score means the same thing on every set.

## 4. What each set is for

| Set | Use it for | Do not use it for |
| --- | --- | --- |
| P20 | Learning how the brain behaves task by task; the first comparison of any change; the loops (cut into parts, Playbook 4) | The final word on a change you tuned on it |
| R1 to R4 | Each new comparison of the same line of work on a new set; seeing whether a change holds on other kinds of repository | Learning the tasks line by line: that is what P20 is for |
| B40 | One confirmation run of the version you are about to keep, against the one it replaces | Any loop, any tuning: once a set has been used to shape a change, it can no longer judge that change |

The rule behind the table: a set measures a change fairly only if the change was not shaped by that set's tasks.

## 5. The files

| File | Content |
| --- | --- |
| `sets/P20/full.txt` and the other list files | One task id per line, ready for the runner; lines that start with `#` are comments |
| `sets/P20/slices.md` | Every part of P20 with its tasks: group, statement source, size of the fix, test time, title |
| `sets/ALL_SETS.md` | The six sets and their parts in one table |
| `sets/CUSTOM.md` | The custom cuts (three parts, five parts) |
| `sets/_tasks/portfolio20.jsonl` and the other five | The task rows themselves, in the competition's format with the FreshSWE-Py fields |
| `~/bcf/data/freshswe-py/tasks.jsonl` on the Zorin machine | The data set as published (663 tasks): what the runner reads; the lists select tasks from it |

The runner takes the published `tasks.jsonl` and a list file; the list file selects the tasks. So a list is a lens on the data set, not a copy of it.

## 6. What the sets do not cover

| Not covered | Where to look instead |
| --- | --- |
| The public repositories of the competition | The public 129 tasks of the competition data package (21.9 GB, not needed for these sets) |
| Tasks with `async` code, large fixes or slow test files | Left out on purpose. P20 holds fixes of at most 28 lines with test files of at most 6.1 seconds; R1 to R4 hold fixes of at most 33 lines with test files of at most 5.7 seconds; none has `async` code, which the competition's scored tasks do not have either |
| Other held-out sets (OOD-45, OOD-B, OOD-C) | Document 04 of the portfolio package: they need their own runner |
