# Gemma 4 Developer Agent: dataset analysis and the BCF brain

Package of 2026-11-23 (analysis and code), completed 2026-11-24. Competition: Kaggle, Google Gemma 4 Developer Agent (149921).

## What is in the package

| File or folder | Content |
|---|---|
| `01_Dataset_Taxonomy_and_Root_Cause_Analysis.md` | Task 1. Classification of all 129 published problems into 6 categories and 17 sub-categories, with a root-cause analysis of every task (129 cards), cross-cutting findings and what they mean for an agent |
| `02_BCF_Brain_Design_and_Justification.md` | Task 2. The design of the BCF brain for the Gemma 4 31B and E4B tracks, the justification of every decision against the harness source and the competition evidence, and the special section: winning, the 0.24 deadlock, the pitfall register, always returning a score, the evaluation protocol and the submission plan |
| `03_Validation_Results_and_Submission_Playbook.md` | What was tested on the code and with what result, the proposed 30-task evaluation panel, how to reproduce everything, and the submission checklist |
| `04_Table_QC_Report.md` | Result of the table check on every document |
| `bcf-brain/` | The brain: source, build script, six ready-to-submit bundles with zips, tests, validator tools and the validation evidence |
| `analysis/` | The scripts that produced Document 01 (feature extraction, snapshot indexing, analysis packs, the coding scheme, merge, renderers) |
| `data/` | The coded records behind Document 01: one record per task, the deterministic features and the statistics |

## The brain in six lines

1. A **planner** reads the issue and hands over an eleven-line specification (the baton).
2. A **solver** follows the baton: locate, edit, verify, finish.
3. One deterministic **helper** (`bcf.py`, standard library only) does the editing, searching, verifying, journaling and time-keeping; the model decides, the helper enforces.
4. Every edit goes through one command with a single string argument and is refused unless it is unambiguous and compiles.
5. The clock starts when the helper is installed: first edit by 150 seconds, verification by 300, freeze at 374, hard stop at 432.
6. The same brain is delivered in three forms for each model: the two-stage relay (`sequential`), a single-agent twin (`flat`) and a no-skill fallback (`noskill`).

## State of the work

| Verified on 2026-11-23 and 2026-11-24 | Result |
|---|---|
| Helper tests | 37 of 37 (the last one on real repository checkouts) |
| The 129 published fixes replayed through the helper's editor | 129 of 129 byte-identical to `git apply` |
| Localizer on the 129 real repositories | Gold-touched file in the top 9 for 96 tasks |
| Bundles under the official harness compiler | 6 of 6 compile; 15 of 15 broken copies rejected |
| Documents | 84 tables, 0 defects under two checkers |

| Not verified | Why |
|---|---|
| Any run with the Gemma 4 model | No model endpoint was available; the brain was tested without the model |
| Mean seconds per task on the scorer | Decides whether a run finishes inside 12 hours; must be measured locally before the first submission |
| The relay against the single-agent twin | Public evidence favours single agents; the twin is built from the same source |

## Where to start

| If you want to | Open |
|---|---|
| Understand the problems | `01_...`, Sections 0, 3, 6 and 7; the per-task cards are in Section 9 |
| Understand or change the brain | `02_...`, Sections 2 to 9; then `bcf-brain/README.md` |
| Submit | `03_...`, Section 11 (checklist), and `02_...`, Section 10.7 (which bundle, in which order) |
| Re-run the validation | `bcf-brain/README.md` |
| Re-run the analysis | `analysis/README.md` |
