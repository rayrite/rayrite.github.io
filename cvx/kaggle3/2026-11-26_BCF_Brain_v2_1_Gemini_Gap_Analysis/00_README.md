# BCF brain v2 from the Gemini Task 1 gap analysis (2026-11-25, updated 2026-11-26)

A gap analysis and claim-by-claim verification of Gemini 4 Carbon's classification of the 129 public tasks of the
Kaggle Gemma 4 Developer Agent competition, and a new version of the BCF brain that carries the changes the evidence
supports.

## Update of 2026-11-26: version 2.1

The whole of `HARNESS_README.md` was compared with the brain, section by section. Yesterday's run had used its
sandbox, verification and best-practice sections, but not checked the file end to end. The audit found one defect
and three smaller gaps, all closed in helper version 2.1.0 (`patches/v2.1-vs-v2.0.diff`, 7 files).

| Finding | Fix |
|---|---|
| In the worst case `test` could take 255 seconds, longer than the 240-second command timeout the bundles set, and lose its output | The comparison with the unedited tree is limited to 60 seconds in total and skipped for a test file that itself needed more than 30 seconds |
| The prompt said the helper prints the elapsed time; only `status` did | Every helper output ends with a `TIME` line |
| The harness's own `budget_warning` tells the model to submit, which would skip `finalize` | One sentence maps it to finalize, then submit |
| The no-skill bundles ran pytest without a bound | `timeout 45` |

Everything was re-run after the change: 54 helper tests (53 pass, 1 optional skip), the official compiler on all six
bundles, 15 of 15 negative controls rejected, 34 of 34 published fixes replayed byte-identical. The full audit,
including what the README offers and the brain deliberately does not use, is `07_Harness_Readme_Audit.md`.

## What was asked and what was done

| Asked | Done |
|---|---|
| Examine the classification, the traps and the proposed mitigations | Read in full; every figure recomputed from the dataset; every cited thread read; 64 claims checked against official documentation, by execution, or both |
| Research the claims | 51 pages of official documentation and standards, about 20 GitHub API reads, 5 PyPI lookups, 17 forum threads, 45 execution checks on Python 3.13 |
| Create a new brain by backing up and updating the 11-23 brain | 11-23 brain backed up (88 files, hash list), six fixes of 11-24 carried forward, v2 built and validated |
| Justify the decisions | Document 03: each change with its evidence, its measured effect and its cost; each rejected proposal with its reason |
| Markdown, tables checked | Seven documents and one README; every table passed two independent checkers (document 06) |

## The findings in brief

- **The document is exact where it is mechanical.** All 129 rows of its master matrix match the dataset. Of 64 checked
  claims, 41 hold and 12 hold partly.
- **Seven claims are wrong.** Three census figures: 11 tasks create a new file (it says 1); 29 test patches use a
  fixture package (it says 38); the tasks start in July 2023 (it says February 2020). Two forum statistics are quoted
  with the wrong denominator. Two tool claims are off: `inspect.isgeneratorfunction` has seen through
  `functools.partial` since Python 3.8, and no generator script exists for the rich Unicode tables.
- **It leaves out the staff note that matters most.** It ranks "async functions are missing from the code graph" among
  its main traps. Staff state that no scored task touches an `async def` (thread 745998).
- **Its categories cannot guide an agent.** Each spans 4 to 8 of the existing procedure routes, and a root cause is
  known only after the fix. Its 16 "reusable defect cards" carry 109 distinct titles for 129 tasks.
- **Two traps were real gaps in the brain.** A visible test that fails because it asserts what the issue asks to
  change, and a name the edited code never defines. Both are closed in v2.

## What v2 changes

| Change | Closes |
|---|---|
| `test` labels each failing test as newer than the edit or older, after running the same file on the unedited tree | TRAP-1: the grader replaces visible tests; the old prompt told the model to fix the source when a related test failed |
| `test` runs the whole file and names skipped tests | a summary cut off by the output limit; a skipped test is not a pass on the grader |
| `check` and `finalize` list names a changed file never defines | the `NameError` and `UnboundLocalError` part of broken edits that `compile()` cannot see |
| `finalize` imports each changed module | the second mechanical check that thread 760595 found helpful |
| `twins`, `check`, `finalize` list unedited copies of changed code and call sites of a changed signature | TRAP-2, as far as a name search can reach: 4 of 38 multi-file tasks by measurement, so it never blocks a submission |
| Solver prompts: the rule for an expected failure, and commands that start with `python3`, `cd` or `git` | how to read the new output; the tool-parser hang of thread 760830 |

Not adopted, with reasons in document 03: a mandatory failing reproduction (the cited thread reports it lowered a
small agent's score), prompt text about async functions, the seven categories as routing, the defect cards.

## The package

| Path | Content |
|---|---|
| `01_Gap_Analysis_of_Gemini_Task1.md` | The document against the dataset, the harness, the forum and the brain; its ten laws assessed |
| `02_Claim_Verification_Ledger.md` | 64 claims with verdict and evidence; machine-readable copy in `data/claim_ledger.json` |
| `03_Brain_v2_Changes_and_Justification.md` | Each change, its evidence, cost and limits; what was rejected |
| `04_Validation_Results.md` | Every run with its result and evidence file |
| `05_Research_Notes_and_Sources.md` | Findings by theme with confidence notes, open questions, 65 sources, reproducibility footer |
| `06_Table_QC_Report.md` | Result of the two table checkers |
| `07_Harness_Readme_Audit.md` | Every fact of `HARNESS_README.md` against the brain: what was used, what the audit changed, what is deliberately not used |
| `bcf-brain-v2/` | The new brain: source, prompts, six bundles in `dist/`, 54 tests, tools, validation evidence |
| `backup/bcf-brain-2026-11-23/` | The 11-23 brain exactly as it was, with a SHA-256 list beside it |
| `patches/bcf-brain-v2-vs-11-24.diff` | The complete diff of v2 against the validated 11-24 helper |
| `patches/v2.1-vs-v2.0.diff` | The 2.1 changes alone; reversing it reproduces 2.0 byte for byte |
| `research/` | Notes, forum captures, execution results, data, scripts and the list of fetched pages |

## How to use the brain

The six ready-to-submit bundles are in `bcf-brain-v2/dist/`: `bcf-31b-sequential`, `bcf-31b-flat`, `bcf-31b-noskill`,
`bcf-e4b-sequential`, `bcf-e4b-flat` and `bcf-e4b-noskill`. The layout and the budgets are those of 11-23. After a
change: `python assemble.py`, `python build.py`, `python -m unittest tests.test_bcf`, `python tools/run_validator.py`.

## What is validated and what is not

Validated without a model: 54 helper tests (53 pass, 1 optional skip); the official compiler accepts all six bundles
and rejects all 15 negative controls; 34 published fixes replay byte-identical through the v2 editor; the 15 forum
checks of the 11-24 probe pass; routing is unchanged; the baseline comparison works on a real task.

Not validated: any run with the Gemma 4 model; the mean seconds per task; the skill path on the scorer; behaviour on
the scored repositories. Every recall figure comes from the four public repositories, and staff state that none of
them is scored.

## Three things to know before the next submission

1. An 8-minute cap per task does not keep a run inside 12 hours: 120 tasks at 8 minutes is 16 hours, and a submission
   with that cap failed with "exceeded the allowed runtime" on 2026-11-24 (thread 761467).
2. The silent 0.00 scores of 2026-11-22 and later were a faulty GPU, about 125 submissions, with reruns promised
   (staff, thread 761004). The signature is a result size of 3,230 bytes.
3. The vLLM tool parser can hang the model server on a bare argument value that starts as an array; nothing restarts
   the server (thread 760830). The v2 prompts tell the model how to start every command.

## Related packages

- `2026-11-23_BCF_Brain_and_Dataset_RCA`: the original brain and the first taxonomy.
- `2026-11-24_BCF_Tuning_Bottlenecks_and_Parity`: the six fixes v2 carries forward.
- `2026-11-25_BCF_Naive_vs_Brain_Hypothetical_vs_Actual`: the replay of a trap-1 task through the real harness.
