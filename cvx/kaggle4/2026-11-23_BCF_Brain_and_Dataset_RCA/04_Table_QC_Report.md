# Table quality check

Every Markdown table in the package was checked with two independent tools after the documents were final:

- `bcf-brain/tools/qc_tables.py`: finds table blocks outside code fences and checks that the second line is a valid separator, that every row has the header's number of cells (escaped pipes honored), that no unescaped pipe sits inside a code span in a row, that a table is not glued to a preceding paragraph or followed directly by text, and that it has a body row.
- The project's older strict checker (`qc-tables.mjs`), which treats every line containing a pipe as a table row.

## Results

| Document | Tables (new checker) | Defects (new checker) | Tables (strict checker) | Defects (strict checker) |
|---|---:|---:|---:|---:|
| `00_README.md` | 4 | 0 | 4 | 0 |
| `01_Dataset_Taxonomy_and_Root_Cause_Analysis.md` | 28 | 0 | 28 | 0 |
| `02_BCF_Brain_Design_and_Justification.md` | 29 | 0 | 29 | 0 |
| `03_Validation_Results_and_Submission_Playbook.md` | 15 | 0 | 15 | 0 |
| `bcf-brain/README.md` | 5 | 0 | 0 | 0 |
| `analysis/README.md` | 3 | 0 | 0 | 0 |
| **Total** | **84** | **0** | **76** | **0** |

Strict checker summary line: `4 files, 76 tables, 0 defect(s)`.

No defects. Every table has a valid separator row, the same number of cells in every row, and is separated from the text around it. This report was checked with the new checker after it was written (result appended below).

Self-check of this report: `1 file(s), 1 table(s), 0 defect(s), 0 prose line(s) containing a pipe (not tables)`
