# Table quality check of this package's markdown

**Run:** 2026-11-25, after the last edit of every file except this one. **Tool:** `qc_tables.py` of the 2026-11-23 brain package, unmodified.

## Result

12 markdown files, 92 tables, **0 defects**. 7 prose lines contain a pipe character without being tables; they are listed below and are not defects.

## What the checker verifies, for every table outside fenced code

| Check | Rule |
|---|---|
| T1 | A table is a run of pipe-lines whose second line is a separator row |
| T2 | Every row has the same number of cells as the header; an escaped pipe inside a cell is honoured |
| T3 | Separator cells are well formed |
| T4 | No unescaped pipe inside inline code within a table row |
| T5 | A table is preceded by a blank line or a block boundary |
| T6 | A table has at least one body row |
| P1 | A prose line with a pipe directly after a table would be absorbed into it |

## Per file

| File | Tables | Body rows | Defects |
|---|---:|---:|---:|
| `00_README.md` | 5 | 43 | 0 |
| `01_Walkthrough_httpx_3672.md` | 23 | 136 | 0 |
| `02_Hypothetical_vs_Actual_Variance.md` | 5 | 37 | 0 |
| `03_How_the_Brain_Improves_on_Naive.md` | 8 | 54 | 0 |
| `04_Live_Run_Playbook.md` | 12 | 85 | 0 |
| `05_Evidence_Index_and_Sources.md` | 4 | 145 | 0 |
| `06_Table_QC_Report.md` | 3 | 27 | 0 |
| `PLAYBOOK.md` | 12 | 85 | 0 |
| `README.md` | 3 | 23 | 0 |
| `dataset_digest.md` | 10 | 116 | 0 |
| `design_digest.md` | 6 | 74 | 0 |
| `harness_digest.md` | 1 | 11 | 0 |

## The prose lines with a pipe

All seven are in the two analyst digests under `evidence/digests/`, which quote regular expressions and shell text. They are not tables and render as paragraphs.

| File | Lines |
|---|---:|
| `dataset_digest.md` | 1 |
| `harness_digest.md` | 6 |

## The HTML deck

The deck's 19 tables were checked in a browser at 1,680 and 885 pixels: every row has the header's number of cells, no element overflows the page, and the browser console shows no error or warning. That check is separate from this one because the checker reads markdown.

## Note

This report contains tables of its own. They were written in the same shape as the others and are covered by re-running the checker.
