# 06 - Table quality check

Every Markdown file of this package was checked with two independent tools after the last edit:

- `bcf-brain-v2/tools/qc_tables.py`, the checker of the 11-23 brain. Outside fenced code blocks it checks that a table is a
  run of pipe lines with a separator row as second line, that every row has the header's number of cells, that separator
  cells are well formed, that no inline code in a row holds an unescaped pipe, that a table is preceded and followed by a
  blank line, that it has a body row, and that no prose line with a pipe sits directly under a table.
- `qc_tables2.py`, the second checker written on 2026-11-25, which splits cells by a character scan instead of a regular
  expression and in addition requires three dashes per separator cell and no empty header cell.

Tables, rows and cells were counted by the script that produced this file, not by eye. Raw forum captures are stored
as `.md.txt` because they quote other users' Markdown verbatim and are evidence, not documents.

Result: 65 files, 50 tables, 487 body rows, 2233 cells; files with a defect: 0.

| File | Tables | Body rows | Cells | Checker 1 | Checker 2 |
|---|---:|---:|---:|---|---|
| `00_README.md` | 4 | 27 | 70 | pass | pass |
| `01_Gap_Analysis_of_Gemini_Task1.md` | 8 | 55 | 225 | pass | pass |
| `02_Claim_Verification_Ledger.md` | 2 | 70 | 346 | pass | pass |
| `03_Brain_v2_Changes_and_Justification.md` | 8 | 44 | 177 | pass | pass |
| `04_Validation_Results.md` | 7 | 36 | 216 | pass | pass |
| `05_Research_Notes_and_Sources.md` | 0 | 0 | 0 | pass | pass |
| `06_Table_QC_Report.md` | 2 | 66 | 408 | pass | pass |
| `07_Harness_Readme_Audit.md` | 4 | 38 | 130 | pass | pass |
| `backup/bcf-brain-2026-11-23/dist/bcf-31b-flat/prompts/solver.md` | 0 | 0 | 0 | pass | pass |
| `backup/bcf-brain-2026-11-23/dist/bcf-31b-flat/skills/bcf-spec/SKILL.md` | 0 | 0 | 0 | pass | pass |
| `backup/bcf-brain-2026-11-23/dist/bcf-31b-noskill/prompts/solver.md` | 0 | 0 | 0 | pass | pass |
| `backup/bcf-brain-2026-11-23/dist/bcf-31b-sequential/prompts/bcf_plan.md` | 0 | 0 | 0 | pass | pass |
| `backup/bcf-brain-2026-11-23/dist/bcf-31b-sequential/prompts/solver.md` | 0 | 0 | 0 | pass | pass |
| `backup/bcf-brain-2026-11-23/dist/bcf-31b-sequential/skills/bcf-spec/SKILL.md` | 0 | 0 | 0 | pass | pass |
| `backup/bcf-brain-2026-11-23/dist/bcf-e4b-flat/prompts/solver.md` | 0 | 0 | 0 | pass | pass |
| `backup/bcf-brain-2026-11-23/dist/bcf-e4b-flat/skills/bcf-spec/SKILL.md` | 0 | 0 | 0 | pass | pass |
| `backup/bcf-brain-2026-11-23/dist/bcf-e4b-noskill/prompts/solver.md` | 0 | 0 | 0 | pass | pass |
| `backup/bcf-brain-2026-11-23/dist/bcf-e4b-sequential/prompts/bcf_plan.md` | 0 | 0 | 0 | pass | pass |
| `backup/bcf-brain-2026-11-23/dist/bcf-e4b-sequential/prompts/solver.md` | 0 | 0 | 0 | pass | pass |
| `backup/bcf-brain-2026-11-23/dist/bcf-e4b-sequential/skills/bcf-spec/SKILL.md` | 0 | 0 | 0 | pass | pass |
| `backup/bcf-brain-2026-11-23/README.md` | 5 | 31 | 121 | pass | pass |
| `backup/bcf-brain-2026-11-23/src/prompts/plan_31b.md` | 0 | 0 | 0 | pass | pass |
| `backup/bcf-brain-2026-11-23/src/prompts/plan_e4b.md` | 0 | 0 | 0 | pass | pass |
| `backup/bcf-brain-2026-11-23/src/prompts/solver_core_31b.md` | 0 | 0 | 0 | pass | pass |
| `backup/bcf-brain-2026-11-23/src/prompts/solver_core_e4b.md` | 0 | 0 | 0 | pass | pass |
| `backup/bcf-brain-2026-11-23/src/prompts/solver_head_flat_31b.md` | 0 | 0 | 0 | pass | pass |
| `backup/bcf-brain-2026-11-23/src/prompts/solver_head_flat_e4b.md` | 0 | 0 | 0 | pass | pass |
| `backup/bcf-brain-2026-11-23/src/prompts/solver_head_seq.md` | 0 | 0 | 0 | pass | pass |
| `backup/bcf-brain-2026-11-23/src/prompts/solver_noskill_31b.md` | 0 | 0 | 0 | pass | pass |
| `backup/bcf-brain-2026-11-23/src/prompts/solver_noskill_e4b.md` | 0 | 0 | 0 | pass | pass |
| `backup/bcf-brain-2026-11-23/src/prompts/solver_tail_flat.md` | 0 | 0 | 0 | pass | pass |
| `backup/bcf-brain-2026-11-23/src/prompts/solver_tail_seq.md` | 0 | 0 | 0 | pass | pass |
| `backup/bcf-brain-2026-11-23/src/skills/bcf-spec/SKILL.md` | 0 | 0 | 0 | pass | pass |
| `bcf-brain-v2/dist/bcf-31b-flat/prompts/solver.md` | 0 | 0 | 0 | pass | pass |
| `bcf-brain-v2/dist/bcf-31b-flat/skills/bcf-spec/SKILL.md` | 0 | 0 | 0 | pass | pass |
| `bcf-brain-v2/dist/bcf-31b-noskill/prompts/solver.md` | 0 | 0 | 0 | pass | pass |
| `bcf-brain-v2/dist/bcf-31b-sequential/prompts/bcf_plan.md` | 0 | 0 | 0 | pass | pass |
| `bcf-brain-v2/dist/bcf-31b-sequential/prompts/solver.md` | 0 | 0 | 0 | pass | pass |
| `bcf-brain-v2/dist/bcf-31b-sequential/skills/bcf-spec/SKILL.md` | 0 | 0 | 0 | pass | pass |
| `bcf-brain-v2/dist/bcf-e4b-flat/prompts/solver.md` | 0 | 0 | 0 | pass | pass |
| `bcf-brain-v2/dist/bcf-e4b-flat/skills/bcf-spec/SKILL.md` | 0 | 0 | 0 | pass | pass |
| `bcf-brain-v2/dist/bcf-e4b-noskill/prompts/solver.md` | 0 | 0 | 0 | pass | pass |
| `bcf-brain-v2/dist/bcf-e4b-sequential/prompts/bcf_plan.md` | 0 | 0 | 0 | pass | pass |
| `bcf-brain-v2/dist/bcf-e4b-sequential/prompts/solver.md` | 0 | 0 | 0 | pass | pass |
| `bcf-brain-v2/dist/bcf-e4b-sequential/skills/bcf-spec/SKILL.md` | 0 | 0 | 0 | pass | pass |
| `bcf-brain-v2/README.md` | 6 | 47 | 181 | pass | pass |
| `bcf-brain-v2/src/prompts/plan_31b.md` | 0 | 0 | 0 | pass | pass |
| `bcf-brain-v2/src/prompts/plan_e4b.md` | 0 | 0 | 0 | pass | pass |
| `bcf-brain-v2/src/prompts/solver_core_31b.md` | 0 | 0 | 0 | pass | pass |
| `bcf-brain-v2/src/prompts/solver_core_e4b.md` | 0 | 0 | 0 | pass | pass |
| `bcf-brain-v2/src/prompts/solver_head_flat_31b.md` | 0 | 0 | 0 | pass | pass |
| `bcf-brain-v2/src/prompts/solver_head_flat_e4b.md` | 0 | 0 | 0 | pass | pass |
| `bcf-brain-v2/src/prompts/solver_head_seq.md` | 0 | 0 | 0 | pass | pass |
| `bcf-brain-v2/src/prompts/solver_noskill_31b.md` | 0 | 0 | 0 | pass | pass |
| `bcf-brain-v2/src/prompts/solver_noskill_e4b.md` | 0 | 0 | 0 | pass | pass |
| `bcf-brain-v2/src/prompts/solver_tail_flat.md` | 0 | 0 | 0 | pass | pass |
| `bcf-brain-v2/src/prompts/solver_tail_seq.md` | 0 | 0 | 0 | pass | pass |
| `bcf-brain-v2/src/skills/bcf-spec/SKILL.md` | 0 | 0 | 0 | pass | pass |
| `bcf-brain-v2/validation/helper_diff_vs_11-24.md` | 1 | 10 | 36 | pass | pass |
| `research/data/gemini-rca-condensed.md` | 0 | 0 | 0 | pass | pass |
| `research/fetched-pages.md` | 1 | 51 | 265 | pass | pass |
| `research/notes/00-scope.md` | 0 | 0 | 0 | pass | pass |
| `research/notes/01-audit-findings.md` | 1 | 4 | 18 | pass | pass |
| `research/notes/02-brain-gap.md` | 1 | 8 | 40 | pass | pass |
| `research/notes/03-research-findings.md` | 0 | 0 | 0 | pass | pass |

## Whole-package runs

| Checker | Exit code | Last line of its output |
|---|---:|---|
| Checker 1 | 0 | 65 file(s), 50 table(s), 0 defect(s), 150 prose line(s) containing a pipe (not tables) |
| Checker 2 | 0 | 65 file(s), 50 table(s), 0 defect(s) [second checker] |

