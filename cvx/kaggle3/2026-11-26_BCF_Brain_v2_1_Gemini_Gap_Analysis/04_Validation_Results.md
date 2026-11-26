# 04 - Validation results for brain v2

Everything below was executed on 2026-11-25 and 2026-11-26 on this Windows workstation: Python 3.12.10 for the helper
tests, the isolated environment of 2026-11-23 for the official compiler, and the snapshot store of 2026-11-23 for the
real checkouts. No Gemma 4 model was run and no Docker sandbox was used.

## 4.1 Runs

| Run | Command or method | Result | Evidence |
|---|---|---|---|
| Unit tests | python -m unittest tests.test_bcf | 54 tests: OK (skipped=1) | bcf-brain-v2/validation/unit_tests_v2.log |
| Official compiler and negative controls | python tools/run_validator.py | 6 bundles compiled, 0 failed; controls 15 rejected, 0 not rejected | bcf-brain-v2/validation/run_validator.log |
| Published fixes through the v2 editor | python tools/replay_gold.py --only (every fourth task plus httpx_3672) | 34 of 34 applied, 34 byte-identical to git apply, 74 files and 128 hunks | bcf-brain-v2/validation/replay_gold_v2_subset.log |
| Behaviour probe from forum reports | brain_probe.py (11-24 tool) | PASS: 15, GAP: 0, INFO: 1 | bcf-brain-v2/validation/brain_probe_v2.txt |
| Routing on the 129 statements | route_eval.py (11-24 tool) | category 97 of 129, domain 82 of 129, route 52 of 129; identical to the 11-24 helper | bcf-brain-v2/validation/route_eval_v2.txt |
| Editor and localizer unchanged | function-level diff against the 11-24 helper | 12 editor definitions and 2 localizer definitions unchanged; 0 definitions removed | bcf-brain-v2/validation/helper_diff_vs_11-24.md |

## 4.2 The new behaviour, measured

| Feature | How it was measured | Result | Evidence |
|---|---|---|---|
| Baseline comparison of failing tests | 14 new unit tests; real task rich_4070 | Unit: a visible test that asserts the old behaviour is reported as NEW SINCE YOUR EDIT with ON THE UNEDITED TREE: FAIL. Real task: the same two lines on rich_4070, where the published fix makes test_input_password fail with AttributeError | bcf-brain-v2/validation/real_task_rich_4070_test_delta.txt |
| Undefined-name check | 1,416 untouched files of four repositories; 4 injected mistakes per repository | 12 reports on untouched code, 0 of them in package code; M1 to M4 found on all four repositories; M5 (use before assignment) is a documented blind spot | bcf-brain-v2/validation/undefined_names_eval.json |
| Twin and call-site report | 38 multi-file tasks, largest file of the fix applied | names another file of the fix in 4 of 38; names no file of the fix in 2; still reports a line after the complete fix in 7 of 38 | bcf-brain-v2/validation/siblings_eval_38_multi_file_tasks.json |

### The baseline comparison on a real task

`rich_4070` is one of the document's TRAP-1 tasks: the published fix moves `getpass` out of the module-level imports of
`rich/console.py`, and the visible test `test_input_password` monkeypatches `rich.console.getpass`. Through the v2 helper:

| Step | Command | Output of the helper |
|---|---|---|
| Before any edit | `test tests/test_console.py -k input` | PASS, 2 passed |
| Published fix applied, 9 files | same command | FAIL, 1 failed, 1 passed; `test_input_password` with AttributeError; ON THE UNEDITED TREE: PASS - 2 passed; NEW SINCE YOUR EDIT (1): test_input_password; the rule to keep the fix |
| Finish | `finalize` | 9 files modified; no warning; RESULT: READY |

The unedited-tree result came from a temporary git worktree that the helper created and removed; the baseline took one extra
pytest run and no model call.

### Twin and call-site report, in numbers

| Situation | Tasks | Meaning |
|---|---|---|
| One file of the fix applied; a line names another file of the fix | 4 of 38 | fastapi_14262, fastapi_14459, fastapi_14978, httpx_3672 |
| One file applied; lines name no file of the fix | 2 | fastapi_14186, fastapi_14419 |
| Complete fix applied; a line is still reported | 7 of 38 | callers that kept working with the new optional parameter, and two definitions removed with an alias left behind |

This is a weak signal and is shipped as an informational line that never blocks the submission.

## 4.3 Wall-clock cost on real checkouts

Median of three runs of each command, with the published fix applied (`bcf-brain-v2/validation/timing_v2_checks.txt`):

| Task | Size of the checkout | status s | check s | twins s | finalize s |
|---|---|---|---|---|---|
| fastapi_15745 | 4 files changed, 1120 Python files in the checkout | 0.27 | 1.83 | 1.48 | 3.68 |
| rich_4070 | 9 files changed, 213 Python files in the checkout | 0.30 | 2.11 | 1.97 | 2.68 |
| httpx_3672 | 7 files changed, 45 Python files in the checkout | 0.25 | 1.28 | 1.21 | 1.60 |
| requests_6757 | 2 files changed, 36 Python files in the checkout | 0.24 | 0.52 | 0.50 | 1.43 |
| rich_3930 | 26 files changed, 212 Python files in the checkout | 0.35 | 1.78 | 1.42 | 2.47 |

`status` is unchanged from v1. `finalize` adds the import gate (up to three Python processes) and is the only command that
takes more than about 2 seconds.

## 4.4 What changed in the helper

Top-level definitions: baseline 88, v2 129; unchanged 78, changed 10, added 41, removed 0.

| Definition | Lines added | Lines removed |
|---|---|---|
| `=VERSION` | 1 | 1 |
| `=SAFE_IN_FREEZE` | 1 | 1 |
| `=HINTS` | 8 | 4 |
| `_run` | 9 | 4 |
| `cmd_test` | 38 | 13 |
| `cmd_check` | 6 | 1 |
| `cmd_finalize` | 11 | 1 |
| `cmd_status` | 7 | 1 |
| `=USAGE` | 1 | 1 |
| `main` | 4 | 0 |

The 12 definitions of the editor write path (block parsing, text location, atomic write, compile gate, apply, put) and
the localizer are unchanged, which is why the 129-task replay of 2026-11-24 carries over; the 34-task replay above
confirms the path end to end.

## 4.5 Prompt size

| Bundle | Solver prompt, 11-24, characters | v2, characters | Change | 11-24, words | v2, words | Change |
|---|---|---|---|---|---|---|
| bcf-31b-sequential | 5585 | 6399 | 814 | 926 | 1065 | 139 |
| bcf-31b-flat | 6524 | 7338 | 814 | 1079 | 1218 | 139 |
| bcf-31b-noskill | 4054 | 4597 | 543 | 678 | 773 | 95 |
| bcf-e4b-sequential | 2799 | 3145 | 346 | 446 | 509 | 63 |
| bcf-e4b-flat | 3141 | 3487 | 346 | 498 | 561 | 63 |
| bcf-e4b-noskill | 1998 | 2168 | 170 | 329 | 360 | 31 |

## 4.6 Not validated

- Any run with the Gemma 4 model: whether the planner relays the baton, whether the solver follows the NEW and OLDER
  lines of `test`, and whether it acts correctly on the warnings of `finalize`.
- The mean seconds per task, and therefore the total runtime against the 12-hour limit.
- The skill path on the scorer. One team reports a skill bundle that works locally and scores 0.00 (thread 758854);
  staff attributed the 0.00 runs of 2026-11-22 and later to a faulty GPU (thread 761004). The no-skill bundles avoid the question.
- The import gate inside the scorer's Docker image, where packages are installed in editable mode. It was exercised on
  Windows checkouts only.
- Behaviour on the scored repositories. Every recall figure here comes from the four public repositories.
