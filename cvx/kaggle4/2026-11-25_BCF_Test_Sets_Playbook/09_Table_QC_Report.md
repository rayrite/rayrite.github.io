# Table QC report

**Run:** 2026-11-25, after the last edit. **Scope:** every Markdown file of this package, recursively: the nine documents, `sets/ALL_SETS.md`, `sets/CUSTOM.md`, the six `sets/<NAME>/slices.md` and `tools/README.md`. Fenced code blocks are skipped.

Two checkers with different implementations were used. The first is the brain's own `tools/qc_tables.py` (2026-11-23 package): separator on the second line, equal cell counts, well-formed separator cells, no unescaped pipe inside inline code in a row, blank lines around a table, at least one body row, no prose line with a pipe after a table. The second, `tools/qc_tables2.py` (copied from the portfolio package), splits cells by a character scan that honours escaped pipes and code spans and checks equal cell counts, separator cells of at least three dashes, blank lines around the table, a body row and no empty header cell.

| File | Tables |
| --- | ---: |
| `00_README.md` | 6 |
| `01_Playbook_Install_Zorin_OS_18.md` | 3 |
| `02_Playbook_First_Run_and_Gates.md` | 2 |
| `03_Playbook_The_Test_Sets.md` | 6 |
| `04_Playbook_Cut_a_Set_Into_Slices.md` | 15 |
| `05_Playbook_Compare_Two_Versions.md` | 5 |
| `06_Playbook_Rotate_and_Confirm.md` | 4 |
| `07_Playbook_Troubleshooting.md` | 7 |
| `08_Reference.md` | 8 |
| `sets/ALL_SETS.md` | 1 |
| `sets/CUSTOM.md` | 2 |
| `sets/B40/slices.md` | 18 |
| `sets/P20/slices.md`, `R1`, `R2`, `R3`, `R4` (five files) | 105 |
| `tools/README.md` | 1 |
| This report | 3 |
| Total | 186 |

| Checker | Files | Tables | Defects |
| --- | ---: | ---: | ---: |
| `tools/qc_tables.py` of the 2026-11-23 package | 19 | 186 | 0 |
| `tools/qc_tables2.py` (this package) | 19 | 186 | 0 |

Defects found and corrected before this result:

| Defect | Where | How it was corrected |
| --- | --- | --- |
| A table without a body row | `sets/B40/slices.md`: the part `changelogs` has no task in B40 | The generator no longer writes a table for a part without tasks (nor a list file) |
| A separator row with a different number of cells than its header | `rotation_tables.md` of the portfolio package, while the rotation panels were added | Its generator now passes every table line through a writer that takes the separator from the header |

Every table of the six `slices.md` files, of `sets/ALL_SETS.md` and of `sets/CUSTOM.md`, and every table that `tools/assemble.py` inserts into Playbook 4, is written by `common.md_table`, which derives the separator row from the header and refuses a row with another number of cells. The sample output of `compare.py` in Playbook 5 is a code block, not a table.

The HTML guide was checked in a browser after it was built: 180 tables and 1,436 rows in the rendered document (the report itself is not part of the guide), no row with a number of cells different from its header, nine navigation links without a broken target, and no script, style sheet, image or frame loaded from outside the file.

Wide tables: Playbook 4's composition table (10 columns), the task tables of the slices (8 columns), Playbook 5's sample and the paired table (7 and 8 columns) render in any GitHub-flavoured Markdown viewer; in a narrow pane they scroll. The same tables scroll sideways in the HTML guide when the window is narrower than the table.
