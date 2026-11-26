# Table QC report

**Run:** 2026-11-25, after the last edit (rotation panels included). **Scope:** every Markdown file of this package, recursively, including the fragments in `portfolio/_fragments/`, `data/panel_power.md` and `tools/README.md`. Fenced code blocks are skipped.

Two checkers with different implementations were used. The first is the brain's own `tools/qc_tables.py` (2026-11-23 package): T1 separator on the second line, T2 equal cell counts, T3 well-formed separator cells, T4 no unescaped pipe inside inline code in a row, T5 blank line before a table, T6 at least one body row, T7 blank line after a table, P1 prose line with a pipe after a table. The second, `tools/qc_tables2.py`, was written for this package: it splits cells by a character scan that honours escaped pipes and code spans and checks equal cell counts, separator cells of at least three dashes, blank lines around the table, a body row and no empty header cell. On the 2026-11-24 package it reports 35 files and 91 tables with 0 defects, which is the count that package published.

| File | Tables |
| --- | ---: |
| `00_README.md` | 5 |
| `01_Portfolio_Recommendation.md` | 10 |
| `02_Repository_Recommendations.md` | 9 |
| `03_Problem_Source_Repositories.md` | 8 |
| `04_Build_Verify_and_Run.md` | 7 |
| `05_Brain_Dry_Run_Findings.md` | 9 |
| `06_Measurement_Protocol.md` | 7 |
| `08_Sources.md` | 5 |
| `09_Rotation_Panels.md` | 18 |
| `data/panel_power.md` | 2 |
| `portfolio/_fragments/` (10 fragment files) | 13 |
| `tools/README.md` | 1 |
| This report | 2 |
| Total | 96 |

| Checker | Files | Tables | Defects |
| --- | ---: | ---: | ---: |
| `tools/qc_tables.py` of the 2026-11-23 package | 22 | 96 | 0 |
| `tools/qc_tables2.py` (this package) | 22 | 96 | 0 |

One informational note, not a defect: `05_Brain_Dry_Run_Findings.md`, line 46, contains an escaped pipe in a prose line outside any table (the regular expression of the localizer evaluation, inside inline code). It renders as code.

Defects found and corrected before this result, all separator rows with a different number of cells than their header: the P20 table in Document 01 and in its fragment (15 cells against 14), the repository survey table in Document 02 (10 against 11), the power table in `data/panel_power.md` (5 against 6) and, while the rotation panels were added, the task table of the rotation fragment and of Document 09 (15 against 14, in each of the four panels). The generators no longer type a separator: the generator of the P20 fragment derives it from a list whose length is asserted against the header, and the generator of the rotation tables passes every table line through a writer that takes the separator from the header above it and stops the run on a body row with another cell count.

The table check is the last step of every edit in this package; the figures inside the tables were checked separately, by recomputing them from the files in `data/` with the scripts in `tools/`. One figure of the earlier version of the README was corrected that way: the localizer ranks the gold file first for 45 of the 70 candidate tasks (the README had 46).

Wide tables: the P20 table (14 columns), the rotation task tables (14 columns), the panel summary table of Document 09 (15 columns), the FreshSWE-Py repository table (14 columns), the dataset table in Document 02 (10 columns) and the trap tables in Documents 05 and 09 (7 and 6 columns) render in any GitHub-flavoured Markdown viewer; in a narrow pane they scroll.
