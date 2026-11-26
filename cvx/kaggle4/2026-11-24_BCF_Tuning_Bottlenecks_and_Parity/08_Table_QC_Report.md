# Table quality check of the package (2026-11-24)

Checker: `qc_tables.py` of the RCA package (`2026-11-23_BCF_Brain_and_Dataset_RCA/bcf-brain/tools/qc_tables.py`), run on 2026-11-24 after the last edit. It verifies every Markdown table: one header row, a separator with the right number of cells, every body row with the same number of cells as the header, no unescaped pipe inside a code span, at least one body row, consistent alignment markers. Pipes inside table cells are escaped or kept out of tables; the "prose lines containing a pipe" counted below are code lines and in-line expressions outside tables.

## 1. Per document

| Document | Tables | Defects | Prose lines with a pipe (not tables) |
| --- | ---: | ---: | ---: |
| `00_README.md` | 6 | 0 | 0 |
| `01_Exception_Handling_Traps_by_Error_Family.md` | 9 | 0 | 3 |
| `02_Time_Bottlenecks_and_Tuning_Levers.md` | 12 | 0 | 0 |
| `03_Local_Kaggle_Parity_Plan.md` | 10 | 0 | 0 |
| `04_Local_Scoring_and_Interpretation_Guide.md` | 16 | 0 | 0 |
| `05_Board_Issues_Graceful_Handling_Audit.md` | 11 | 0 | 0 |
| `06_Impact_Effort_Roadmap.md` | 6 | 0 | 0 |
| `07_Setup_and_Run_Guide.md` | 13 | 0 | 1 |
| `08_Table_QC_Report.md` (this file) | 4 | 0 | 0 |
| Total, documents | 87 | 0 | 4 |

## 2. Whole package, including sub-folders

| Scope | Files scanned | Tables | Defects |
| --- | ---: | ---: | ---: |
| The package (`bcf-brain-patched/` and `tools/` included) | 35 | 91 | 0 |
| `bcf-brain-patched/` on its own | 26 | 4 | 0 |
| `bcf-brain-patched/validation/` on its own | 1 | 2 | 0 |

## 3. Defects found and fixed during the check

| Document | Defect | Fix |
| --- | --- | --- |
| `01_...` | Two rows held an unescaped pipe inside a code span (the Gemma delimiter tokens and a regular expression), which splits a cell in GitHub-flavored Markdown | Both rows reworded without pipes |
| `03_...` | Two rows carried a garbled sentence and a wrong source cell (found on re-reading, not by the checker) | Rows rewritten |
| `05_...` | The tally counted twelve model-and-serving issues as nine handled; the correct count is eight, and the total is 51 issues, not 52 | Headline and tally corrected |
| `07_...` | The ledger template had a header and no body row | One example row added |

## 4. HTML twins

| File | Bytes | External scripts or styles | Images or frames from the network | Level-2 headings with an identifier (the table of contents links) |
| --- | ---: | ---: | ---: | ---: |
| `07_Setup_and_Run_Guide.html` | 73,748 | 0 | 0 | 16 |
| `00_README.html` | 18,691 | 0 | 0 | 7 |

Both files are built by `tools/make-html.sh` with pandoc 3.11 from the template `tools/portable-toc.html`: all style is inline, the page adapts to dark and light systems, and it prints without the navigation bar. The only links that leave the file are the citations in the text and the navigation links to the sibling Markdown files.
