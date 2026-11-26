# Playbook 4. Cut a set of 20 into smaller sets for fast loops

**Goal:** spend minutes instead of hours on each turn of the loop while you change the brain, without losing the meaning of the set. Every set is already cut: the lists are in `sets/`, and `tools/make_slices.py` makes them again or makes other cuts.

## 1. Why cut: what a run costs

One task-run takes about 277 seconds at the pace of the strongest public bundles on the scorer's hardware, and at most 8 minutes (the budget of the bundle). A comparison needs every task run by both versions.

| Part | Tasks | Task-runs for two versions | At 277 seconds each | At the 8-minute limit |
| --- | --- | --- | --- | --- |
| `smoke_1` | 1 | 2 | 9 minutes | 16 minutes |
| `smoke_3` | 3 | 6 | 28 minutes | 48 minutes |
| One slice (`slice_A` to `slice_D`) | 5 | 10 | 46 minutes | 80 minutes |
| One half (`half_1`, `half_2`) | 10 | 20 | 92 minutes | 160 minutes |
| A full set | 20 | 40 | 3 hours 5 minutes | 5 hours 20 minutes |
| One half of B40 | 20 | 40 | 3 hours 5 minutes | 5 hours 20 minutes |
| B40 | 40 | 80 | 6 hours 9 minutes | 10 hours 40 minutes |

One version alone takes half. Your RTX 5090 may be faster than the scorer; then treat the first column as an upper bound and the table as a scale.

## 2. The parts of a set

| Part | List files | Tasks each | Built how | Use it for |
| --- | --- | --- | --- | --- |
| Smoke, one task | `smoke_1.txt` | 1 | The cheapest closed-issue task that both baselines solved | Does the whole pipeline run? |
| Smoke, three tasks | `smoke_3.txt` | 3 | The cheapest closed-issue task of each group (both, one, neither); it contains `smoke_1` | Seeing the three kinds of outcome |
| Slices | `slice_A.txt` to `slice_D.txt` | 5 | The set dealt into four parts with the same shares; `slice_A` holds the three smoke tasks | The quick loop |
| Halves | `half_1.txt`, `half_2.txt` | 10 | `slice_A` + `slice_B`, and `slice_C` + `slice_D` | A steadier look before a full run |
| The full set | `full.txt` | 20 | The whole set | Decisions |
| Check slices | `check_A.txt` to `check_D.txt` | 5 | A second cut into four: the same shares, other tasks together | Finding out whether a slice result was a property of those five tasks |
| By group | `solved_both.txt`, `solved_one.txt`, `solved_neither.txt` | 9, 7, 4 | Which baseline agents solved the task | A change meant for one kind of task |
| By statement | `issues.txt`, `pull_requests.txt`, `changelogs.txt` | 13, 6, 1 in P20 | Where the statement comes from | A change to how the planner reads an issue or a pull request |
| Custom cuts | `custom/trio_A.txt` ... and `custom/fifths_A.txt` ... | 7, 7, 6 and 4, 4, 4, 4, 4 | The same deal into three parts and into five | Other loop sizes |

B40 has `quarter_A` to `quarter_D` (10 tasks each) instead of slices, halves of 20 and no smoke sets, because it is for confirmation only. The numbers of this table are P20's; `sets/<NAME>/slices.md` gives every set's.

The parts nest: `smoke_1` is in `smoke_3`, `smoke_3` in `slice_A`, `slice_A` in `half_1`, `half_1` in the full set. A result found on a small part can be checked on the part that contains it without changing tasks.

## 3. How the cut is made

Nothing in the cut is random, so the lists are the same on every machine and every day:

1. Every task has a **group** (both, one or neither baseline agent solved it) and a **statement source** (closed issue, pull request, commit and changelog). Group and source together make a cell.
2. The groups are shared out over the four slices: the floor of group size divided by 4 for every slice, and each spare task to the slice that is smallest at that moment. In a set of 20 every slice gets 4 tasks a baseline solved and 1 that none solved.
3. Inside each group the statement sources are shared out over the slices in the same proportion, without changing what step 2 gave each slice.
4. Inside each cell the tasks are ordered, cheapest first (test time, fix size, statement length, id), and dealt to the slices: `slice_A` gets the cheapest of each cell, and each slice gets its share of the cheap and of the expensive end.
5. The three smoke tasks are moved into `slice_A` by a swap inside their cell, so that every slice keeps its shares.
6. The check cut repeats steps 1 to 5 with one change: every cell is dealt to the slices in the opposite order, the last slice first. So `check_D` holds the cheapest tasks and `check_A` the most expensive ones, and a slice of one cut shares at most a few tasks with a slice of the other.

The script checks all of this itself and stops if a rule is broken.

## 4. The cut of P20, task by task

| Part | Tasks | Solved by both | One agent | Neither | Closed issue | Pull request | Commit and changelog | Repositories | Gold test time, all tasks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `smoke_1.txt` | 1 | 1 | 0 | 0 | 1 | 0 | 0 | 1 | 0.2 s |
| `smoke_3.txt` | 3 | 1 | 1 | 1 | 3 | 0 | 0 | 1 | 0.8 s |
| `slice_A.txt` | 5 | 2 | 2 | 1 | 4 | 1 | 0 | 3 | 5.3 s |
| `slice_B.txt` | 5 | 2 | 2 | 1 | 3 | 2 | 0 | 2 | 7.3 s |
| `slice_C.txt` | 5 | 2 | 2 | 1 | 3 | 1 | 1 | 2 | 13.8 s |
| `slice_D.txt` | 5 | 3 | 1 | 1 | 3 | 2 | 0 | 2 | 12.0 s |
| `check_A.txt` | 5 | 2 | 2 | 1 | 4 | 1 | 0 | 3 | 16.0 s |
| `check_B.txt` | 5 | 2 | 2 | 1 | 3 | 2 | 0 | 2 | 9.8 s |
| `check_C.txt` | 5 | 2 | 2 | 1 | 3 | 1 | 1 | 3 | 9.0 s |
| `check_D.txt` | 5 | 3 | 1 | 1 | 3 | 2 | 0 | 2 | 3.6 s |
| `half_1.txt` | 10 | 4 | 4 | 2 | 7 | 3 | 0 | 3 | 12.6 s |
| `half_2.txt` | 10 | 5 | 3 | 2 | 6 | 3 | 1 | 3 | 25.8 s |
| `full.txt` | 20 | 9 | 7 | 4 | 13 | 6 | 1 | 3 | 38.4 s |
| `solved_both.txt` | 9 | 9 | 0 | 0 | 5 | 3 | 1 | 3 | 10.2 s |
| `solved_one.txt` | 7 | 0 | 7 | 0 | 5 | 2 | 0 | 3 | 22.1 s |
| `solved_neither.txt` | 4 | 0 | 0 | 4 | 3 | 1 | 0 | 2 | 6.1 s |
| `issues.txt` | 13 | 5 | 5 | 3 | 13 | 0 | 0 | 3 | 22.4 s |
| `pull_requests.txt` | 6 | 3 | 2 | 1 | 0 | 6 | 0 | 3 | 15.4 s |
| `changelogs.txt` | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 1 | 0.6 s |

### smoke_1.txt (1 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `click_3434` | click | both | closed issue | 8 lines | 0.2 s | Empty output from HelpFormatter.write_usage for a program without arguments |

### smoke_3.txt (3 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `click_3434` | click | both | closed issue | 8 lines | 0.2 s | Empty output from HelpFormatter.write_usage for a program without arguments |
| 2 | `click_3208` | click | one agent | closed issue | 6 lines | 0.3 s | Nested command option shadowing -h prints wrong suggestion |
| 3 | `click_3211` | click | neither | closed issue | 15 lines | 0.3 s | FuncParamType should use ValueError for self.fail(message) |

### slice_A.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `click_3434` | click | both | closed issue | 8 lines | 0.2 s | Empty output from HelpFormatter.write_usage for a program without arguments |
| 2 | `packaging_1341` | packaging | both | pull request | 2 lines | 0.4 s | fix: reject wheel file names containing a \n at the end of the distribution name |
| 3 | `click_3208` | click | one agent | closed issue | 6 lines | 0.3 s | Nested command option shadowing -h prints wrong suggestion |
| 4 | `more_itertools_1278` | more-itertools | one agent | closed issue | 15 lines | 4.1 s | zip_broadcast opens input iterables twice |
| 5 | `click_3211` | click | neither | closed issue | 15 lines | 0.3 s | FuncParamType should use ValueError for self.fail(message) |

### slice_B.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `packaging_611` | packaging | both | closed issue | 13 lines | 0.5 s | Add packaging.tags.interpreter_abi |
| 2 | `packaging_1244` | packaging | both | pull request | 5 lines | 0.4 s | fix(pylock): reject bools where TOML integers are expected |
| 3 | `packaging_1316` | packaging | one agent | closed issue | 8 lines | 1.8 s | str(Marker(...)) drops parentheses of a nested group and changes evaluation |
| 4 | `more_itertools_1279` | more-itertools | one agent | pull request | 14 lines | 4.0 s | Fix one() and only() dropping a falsy user-supplied exception |
| 5 | `packaging_1346` | packaging | neither | closed issue | 28 lines | 0.6 s | Provide a way to get just pure Python tags |

### slice_C.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `packaging_1179` | packaging | both | closed issue | 22 lines | 0.5 s | Cannot install pylock.toml from CPython dev version |
| 2 | `packaging_1187` | packaging | both | commit and changelog | 4 lines | 0.6 s | Prefer native linux tags before manylinux |
| 3 | `more_itertools_1193` | more-itertools | one agent | closed issue | 3 lines | 3.6 s | interleave_evenly([]) raises IndexError |
| 4 | `more_itertools_1270` | more-itertools | one agent | pull request | 4 lines | 4.2 s | fix nonpositive item limits in constrained_batches |
| 5 | `packaging_1299` | packaging | neither | closed issue | 13 lines | 4.9 s | Unclear documentation and error messages around combining post releases and pref |

### slice_D.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `click_3739` | click | both | closed issue | 2 lines | 0.6 s | [Bug] On Windows, get_pager_file returns a typing.BinaryIO object NOT typing.Tex |
| 2 | `click_3299` | click | both | closed issue | 2 lines | 0.9 s | semver.Version as default causing an error |
| 3 | `more_itertools_1260` | more-itertools | both | pull request | 6 lines | 6.1 s | Validate running window sizes through the index protocol |
| 4 | `more_itertools_1276` | more-itertools | one agent | closed issue | 13 lines | 4.1 s | numeric_range reverse iteration changes float values and overflows at datetime l |
| 5 | `click_3642` | click | neither | pull request | 3 lines | 0.3 s | Do not trigger a BytesWarning under python -bb |

The halves are `half_1` = `slice_A` + `slice_B` and `half_2` = `slice_C` + `slice_D`. For the other sets, the same tables are in `sets/R1/slices.md` and so on, and in Appendix B of the HTML guide.

## 5. Step by step: from a set to a loop

**Step 1. Look at the parts.** (executed here on Windows)

```bash
python3 tools/run_set.py --list
```

prints every set with its parts and sizes. For the tasks of a part open `sets/<NAME>/slices.md`.

**Step 2. Check that the lists are whole.** (executed here)

```bash
python3 tools/make_slices.py --check
```

**Expect:** `all files match the rules`. If a list was edited by hand, the next command writes every list again.

**Step 3. Run one part with one version.** (not run here)

```bash
python3 tools/run_set.py --set P20 --part slice_A --version v2
```

The tool checks the list, the data, the bundle and the results folder, prints the command, runs it, and writes the results to `~/bcf/results/P20/slice_A/v2-run1`. Run it again and you get `v2-run2`; nothing is overwritten. For B40 write `--set B40 --part quarter_A`.

**Step 4. Pair it with the other version.**

```bash
python3 tools/compare.py ~/bcf/results/P20/slice_A/v1-run1 ~/bcf/results/P20/slice_A/v2-run1 --name v1 v2
```

Playbook 5 explains how to read it.

**Step 5. Take the next part.** When a change looks good on `slice_A`, run `slice_B`, then `check_B` (other tasks, same shares). When a change looks bad, fix it and run `slice_A` again: it is the cheapest way to see whether the fix works.

**Step 6. Make other cuts if you want them.** (executed here: the two custom cuts of the folder were made this way)

```bash
python3 tools/make_slices.py --custom trio=3 --custom fifths=5
```

cuts every set into three parts (7, 7 and 6 tasks) and into five parts of 4. The lists go to `sets/<NAME>/custom/`, the table to `sets/CUSTOM.md`, and you run one with `--part custom/trio_A`. Any number from 2 to 10 parts works. To make the standard lists again: `python3 tools/make_slices.py` without options.

## 6. Which part for which loop

| You just | Run | Because |
| --- | --- | --- |
| Installed everything, or changed the bundle's structure | `smoke_1` | One task tells in minutes whether the pipeline works |
| Changed a prompt or a rule of the helper | `smoke_3`, then `slice_A` | The same five tasks every time: you learn how the brain acts on them and see a change at once |
| Seen a gain or a loss on `slice_A` and want to know whether it is real | `slice_B`, or `check_B` | Other tasks, same shares |
| Changed how the planner reads a statement | `issues` (13 tasks) or `pull_requests` (6 tasks) | Only those tasks can show it |
| Changed something meant for hard tasks | `solved_neither` (4 tasks) or `solved_one` (7 tasks) | The easy tasks would pass anyway |
| Seen the same result on two slices | `half_1` (10 tasks) | Twice the tasks, one quarter of the full set's time |
| Decided to keep a change | `full` (20 tasks), three paired runs | A decision needs the whole set (Playbook 5) |

## 7. What a part can and cannot show

A comparison of two versions on a few tasks is read with the sign test: count the tasks one version solved and the other did not. The table gives, for a number of pairs (one task run by both versions), the smallest split that chance would produce less than 5 percent of the time.

| Pairs | Smallest split that is not chance | Its p |
| --- | --- | --- |
| 1 to 5 | None: five wins and no loss gives p = 0.062 | --- |
| 6 | 6 wins, 0 losses | 0.031 |
| 10 | 9 wins, 1 loss | 0.021 |
| 20 | 15 wins, 5 losses | 0.041 |
| 40 | 27 wins, 13 losses | 0.038 |
| 60 | 39 wins, 21 losses | 0.027 |
| 80 | 50 wins, 30 losses | 0.033 |
| 100 | 61 wins, 39 losses | 0.035 |

So:

| A part | Can show | Cannot show |
| --- | --- | --- |
| `smoke_1`, `smoke_3` | Whether the pipeline runs; how the brain acts on a task | Anything about the score |
| A slice of 5 | That a change broke something or fixed a task you were watching; where the time goes | Whether the change is better: no split of 5 pairs is beyond chance |
| A half of 10 | The same, on more tasks | Whether the change is better: it would need 9 wins and 1 loss |
| The full set, once | A first paired number | A decision: two identical runs differ by about 2 tasks in 20 |
| The full set, three paired runs, or four sets once | A decision | That it holds on other kinds of repository, unless you rotated sets (Playbook 6) |

A slice is for speed and for seeing. A decision is made on full sets, and confirmed once on B40.

## 8. The smoke tasks of the other sets

| Set | The task of smoke_1 | Repository | Solved by (baselines) | Reference fix | Gold test |
| --- | --- | --- | --- | --- | --- |
| P20 | `click_3434` | click | both | 8 lines | 0.2 s |
| B40 | none: B40 is for confirmation only | - | - | - | - |
| R1 | `isort_2581` | isort | both | 6 lines | 0.5 s |
| R2 | `w3lib_266` | w3lib | both | 2 lines | 0.3 s |
| R3 | `pluggy_767` | pluggy | both | 21 lines | 0.4 s |
| R4 | `markdown_it_py_416` | markdown-it-py | both | 10 lines | 0.2 s |

The lists for R1 to R4 are the same kinds of files as for P20 (`smoke_1`, `smoke_3`, `slice_A` to `slice_D`, `half_1`, `half_2`, `check_A` to `check_D`, the lists by group and by statement). For B40: `quarter_A` to `quarter_D`, `half_1`, `half_2`, `check_A` to `check_D`, and the lists by group and by statement.

## 9. The custom cuts that ship with the playbook

Made with `--custom NAME=PARTS` (repeatable). The list files are in `sets/<NAME>/custom/`.

## trio: every set cut into 3 parts

Each cell: tasks in the part (solved by both baseline agents + by one + by neither). Run one with `--part custom/trio_A`.

| Set | trio_A | trio_B | trio_C |
| --- | --- | --- | --- |
| P20 | 7 (3+3+1) | 7 (3+2+2) | 6 (3+2+1) |
| B40 | 14 (5+4+5) | 13 (5+3+5) | 13 (4+3+6) |
| R1 | 7 (3+3+1) | 7 (3+2+2) | 6 (3+2+1) |
| R2 | 7 (3+3+1) | 7 (3+2+2) | 6 (3+2+1) |
| R3 | 7 (3+3+1) | 7 (3+2+2) | 6 (3+2+1) |
| R4 | 7 (3+3+1) | 7 (3+2+2) | 6 (3+2+1) |


## fifths: every set cut into 5 parts

Each cell: tasks in the part (solved by both baseline agents + by one + by neither). Run one with `--part custom/fifths_A`.

| Set | fifths_A | fifths_B | fifths_C | fifths_D | fifths_E |
| --- | --- | --- | --- | --- | --- |
| P20 | 4 (2+1+1) | 4 (2+1+1) | 4 (2+1+1) | 4 (2+2+0) | 4 (1+2+1) |
| B40 | 8 (3+2+3) | 8 (3+2+3) | 8 (3+2+3) | 8 (3+2+3) | 8 (2+2+4) |
| R1 | 4 (2+1+1) | 4 (2+1+1) | 4 (2+1+1) | 4 (2+2+0) | 4 (1+2+1) |
| R2 | 4 (2+1+1) | 4 (2+1+1) | 4 (2+1+1) | 4 (2+2+0) | 4 (1+2+1) |
| R3 | 4 (2+1+1) | 4 (2+1+1) | 4 (2+1+1) | 4 (2+2+0) | 4 (1+2+1) |
| R4 | 4 (2+1+1) | 4 (2+1+1) | 4 (2+1+1) | 4 (2+2+0) | 4 (1+2+1) |

## 10. How to change the way the sets are cut

The rules live at the top of `tools/make_slices.py`, in the functions `group_shares`, `split_group` and `cut`. To change what a slice holds, change them and run the script; it stops with a clear message when a rule is broken, and `tools/selftest.py` compares what it writes with the lists in the folder. To change which tasks a set holds, use `tools/build_rotation.py` of the portfolio package: the sets come from there.
