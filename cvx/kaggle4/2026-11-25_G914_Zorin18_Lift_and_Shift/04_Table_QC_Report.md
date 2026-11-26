# Table quality report: the G914 lift-and-shift deliverables

*Written by `qc_tables.py` through `scripts/write_qc_report.py`, 2026-11-25. The tool's own lines are kept verbatim below.*

## Result

**6 file(s), 216 table(s), 0 defect(s), 1 prose line(s) containing a pipe (not tables)**

## Tables per file

| File | Tables |
|---|---|
| `00_README.md` | 2 |
| `01_Setup_Guide.md` | 195 |
| `02_Kickoff_System_Prompts.md` | 1 |
| `03_Package_Manifest_and_QC.md` | 14 |
| `README-FIRST.md` | 3 |
| `SYSTEM_PROMPT_KICKOFF.md` | 1 |

`04_Table_QC_Report.md` is not in the list: it is written after the scan and holds no table of its own outside this report.

## What the tool checks, per table

| Check | Meaning |
|---|---|
| T1 | A table is a run of pipe-lines whose second line is a separator row |
| T2 | Every row has the same number of cells as the header; an escaped pipe counts as text |
| T3 | Separator cells are well formed |
| T4 | No unescaped pipe inside inline code in a table row, where it would split the cell |
| T5 | A table is preceded by a blank line or a block boundary, so it is not absorbed by the paragraph above |
| T6 | A table has at least one body row |
| P1 | No single prose line with a pipe directly after a table, where it would become a table row |

A line with a pipe that is plain prose, away from any table, is reported for information only.

## Lines with a pipe that are prose, for information

```text
PIPE 01_Setup_Guide.md:L2025 1 prose line(s) with a pipe
```

Each is a paragraph in one of the attached documents that quotes a command with a pipe. It is separated from the table above it by a blank line and a heading, so it renders as a paragraph.

## The tool's lines

```text
ok   00_README.md:L13 12 rows x 4 cols
ok   00_README.md:L28 8 rows x 4 cols
ok   01_Setup_Guide.md:L13 10 rows x 6 cols
ok   01_Setup_Guide.md:L26 7 rows x 3 cols
ok   01_Setup_Guide.md:L36 7 rows x 3 cols
ok   01_Setup_Guide.md:L46 7 rows x 3 cols
ok   01_Setup_Guide.md:L66 5 rows x 4 cols
ok   01_Setup_Guide.md:L76 9 rows x 4 cols
ok   01_Setup_Guide.md:L92 11 rows x 6 cols
ok   01_Setup_Guide.md:L108 8 rows x 4 cols
ok   01_Setup_Guide.md:L139 5 rows x 4 cols
ok   01_Setup_Guide.md:L153 5 rows x 4 cols
ok   01_Setup_Guide.md:L177 4 rows x 3 cols
ok   01_Setup_Guide.md:L186 5 rows x 3 cols
ok   01_Setup_Guide.md:L228 5 rows x 6 cols
ok   01_Setup_Guide.md:L250 6 rows x 4 cols
ok   01_Setup_Guide.md:L309 5 rows x 4 cols
ok   01_Setup_Guide.md:L321 6 rows x 5 cols
ok   01_Setup_Guide.md:L353 10 rows x 4 cols
ok   01_Setup_Guide.md:L370 7 rows x 3 cols
ok   01_Setup_Guide.md:L423 4 rows x 3 cols
ok   01_Setup_Guide.md:L475 4 rows x 3 cols
ok   01_Setup_Guide.md:L488 12 rows x 4 cols
ok   01_Setup_Guide.md:L519 24 rows x 4 cols
ok   01_Setup_Guide.md:L550 22 rows x 5 cols
ok   01_Setup_Guide.md:L577 29 rows x 4 cols
ok   01_Setup_Guide.md:L618 7 rows x 3 cols
ok   01_Setup_Guide.md:L634 6 rows x 5 cols
ok   01_Setup_Guide.md:L655 6 rows x 5 cols
ok   01_Setup_Guide.md:L668 5 rows x 5 cols
ok   01_Setup_Guide.md:L700 4 rows x 3 cols
ok   01_Setup_Guide.md:L731 8 rows x 4 cols
ok   01_Setup_Guide.md:L754 6 rows x 4 cols
ok   01_Setup_Guide.md:L763 13 rows x 4 cols
ok   01_Setup_Guide.md:L779 4 rows x 4 cols
ok   01_Setup_Guide.md:L798 6 rows x 4 cols
ok   01_Setup_Guide.md:L821 13 rows x 3 cols
ok   01_Setup_Guide.md:L871 4 rows x 4 cols
ok   01_Setup_Guide.md:L904 5 rows x 3 cols
ok   01_Setup_Guide.md:L959 10 rows x 4 cols
ok   01_Setup_Guide.md:L989 6 rows x 4 cols
ok   01_Setup_Guide.md:L1013 7 rows x 4 cols
ok   01_Setup_Guide.md:L1025 9 rows x 4 cols
ok   01_Setup_Guide.md:L1047 7 rows x 4 cols
ok   01_Setup_Guide.md:L1059 11 rows x 3 cols
ok   01_Setup_Guide.md:L1192 8 rows x 4 cols
ok   01_Setup_Guide.md:L1225 8 rows x 3 cols
ok   01_Setup_Guide.md:L1253 12 rows x 6 cols
ok   01_Setup_Guide.md:L1274 16 rows x 4 cols
ok   01_Setup_Guide.md:L1303 5 rows x 5 cols
ok   01_Setup_Guide.md:L1341 5 rows x 3 cols
ok   01_Setup_Guide.md:L1355 9 rows x 6 cols
ok   01_Setup_Guide.md:L1378 11 rows x 4 cols
ok   01_Setup_Guide.md:L1396 6 rows x 4 cols
ok   01_Setup_Guide.md:L1412 10 rows x 4 cols
ok   01_Setup_Guide.md:L1429 18 rows x 5 cols
ok   01_Setup_Guide.md:L1464 10 rows x 4 cols
ok   01_Setup_Guide.md:L1481 11 rows x 4 cols
ok   01_Setup_Guide.md:L1501 12 rows x 4 cols
ok   01_Setup_Guide.md:L1522 11 rows x 4 cols
ok   01_Setup_Guide.md:L1542 9 rows x 4 cols
ok   01_Setup_Guide.md:L1560 16 rows x 4 cols
ok   01_Setup_Guide.md:L1587 17 rows x 4 cols
ok   01_Setup_Guide.md:L1609 30 rows x 4 cols
ok   01_Setup_Guide.md:L1646 7 rows x 4 cols
ok   01_Setup_Guide.md:L1656 22 rows x 3 cols
ok   01_Setup_Guide.md:L1681 19 rows x 4 cols
ok   01_Setup_Guide.md:L1703 15 rows x 4 cols
ok   01_Setup_Guide.md:L1721 4 rows x 4 cols
ok   01_Setup_Guide.md:L1728 7 rows x 3 cols
ok   01_Setup_Guide.md:L1740 15 rows x 4 cols
ok   01_Setup_Guide.md:L1770 9 rows x 4 cols
ok   01_Setup_Guide.md:L1782 9 rows x 3 cols
ok   01_Setup_Guide.md:L1812 7 rows x 3 cols
ok   01_Setup_Guide.md:L1824 12 rows x 5 cols
ok   01_Setup_Guide.md:L1841 8 rows x 3 cols
ok   01_Setup_Guide.md:L2018 4 rows x 4 cols
ok   01_Setup_Guide.md:L2050 11 rows x 4 cols
ok   01_Setup_Guide.md:L2088 7 rows x 4 cols
ok   01_Setup_Guide.md:L2136 6 rows x 4 cols
ok   01_Setup_Guide.md:L2195 6 rows x 3 cols
ok   01_Setup_Guide.md:L2210 7 rows x 4 cols
ok   01_Setup_Guide.md:L2226 3 rows x 10 cols
ok   01_Setup_Guide.md:L2236 11 rows x 4 cols
ok   01_Setup_Guide.md:L2252 16 rows x 4 cols
ok   01_Setup_Guide.md:L2273 14 rows x 5 cols
ok   01_Setup_Guide.md:L2296 7 rows x 3 cols
ok   01_Setup_Guide.md:L2308 4 rows x 3 cols
ok   01_Setup_Guide.md:L2341 6 rows x 4 cols
ok   01_Setup_Guide.md:L2359 6 rows x 4 cols
ok   01_Setup_Guide.md:L2374 6 rows x 3 cols
ok   01_Setup_Guide.md:L2383 9 rows x 4 cols
ok   01_Setup_Guide.md:L2395 10 rows x 5 cols
ok   01_Setup_Guide.md:L2412 5 rows x 4 cols
ok   01_Setup_Guide.md:L2424 5 rows x 3 cols
ok   01_Setup_Guide.md:L2454 9 rows x 4 cols
ok   01_Setup_Guide.md:L2466 10 rows x 4 cols
ok   01_Setup_Guide.md:L2479 8 rows x 3 cols
ok   01_Setup_Guide.md:L2616 10 rows x 4 cols
ok   01_Setup_Guide.md:L2643 8 rows x 3 cols
ok   01_Setup_Guide.md:L2656 6 rows x 3 cols
ok   01_Setup_Guide.md:L2669 13 rows x 4 cols
ok   01_Setup_Guide.md:L2691 9 rows x 3 cols
ok   01_Setup_Guide.md:L2711 7 rows x 7 cols
ok   01_Setup_Guide.md:L2719 6 rows x 8 cols
ok   01_Setup_Guide.md:L2728 5 rows x 5 cols
ok   01_Setup_Guide.md:L2742 8 rows x 9 cols
ok   01_Setup_Guide.md:L2757 17 rows x 3 cols
ok   01_Setup_Guide.md:L2783 6 rows x 9 cols
ok   01_Setup_Guide.md:L2798 12 rows x 4 cols
ok   01_Setup_Guide.md:L2815 8 rows x 4 cols
ok   01_Setup_Guide.md:L2830 32 rows x 10 cols
ok   01_Setup_Guide.md:L2869 7 rows x 3 cols
ok   01_Setup_Guide.md:L2885 11 rows x 4 cols
ok   01_Setup_Guide.md:L2907 8 rows x 5 cols
ok   01_Setup_Guide.md:L2922 5 rows x 5 cols
ok   01_Setup_Guide.md:L2945 8 rows x 4 cols
ok   01_Setup_Guide.md:L2958 6 rows x 3 cols
ok   01_Setup_Guide.md:L2967 11 rows x 3 cols
ok   01_Setup_Guide.md:L2983 12 rows x 4 cols
ok   01_Setup_Guide.md:L3016 8 rows x 4 cols
ok   01_Setup_Guide.md:L3033 12 rows x 4 cols
ok   01_Setup_Guide.md:L3054 10 rows x 4 cols
ok   01_Setup_Guide.md:L3069 5 rows x 5 cols
ok   01_Setup_Guide.md:L3081 8 rows x 6 cols
ok   01_Setup_Guide.md:L3094 7 rows x 3 cols
ok   01_Setup_Guide.md:L3106 7 rows x 3 cols
ok   01_Setup_Guide.md:L3124 12 rows x 5 cols
ok   01_Setup_Guide.md:L3150 4 rows x 4 cols
ok   01_Setup_Guide.md:L3159 8 rows x 5 cols
ok   01_Setup_Guide.md:L3180 7 rows x 5 cols
ok   01_Setup_Guide.md:L3196 12 rows x 4 cols
ok   01_Setup_Guide.md:L3254 8 rows x 4 cols
ok   01_Setup_Guide.md:L3281 6 rows x 4 cols
ok   01_Setup_Guide.md:L3323 6 rows x 5 cols
ok   01_Setup_Guide.md:L3338 12 rows x 3 cols
ok   01_Setup_Guide.md:L3353 5 rows x 4 cols
ok   01_Setup_Guide.md:L3376 13 rows x 4 cols
ok   01_Setup_Guide.md:L3396 8 rows x 5 cols
ok   01_Setup_Guide.md:L3415 5 rows x 5 cols
ok   01_Setup_Guide.md:L3427 8 rows x 3 cols
ok   01_Setup_Guide.md:L3456 5 rows x 5 cols
ok   01_Setup_Guide.md:L3468 20 rows x 8 cols
ok   01_Setup_Guide.md:L3493 17 rows x 8 cols
ok   01_Setup_Guide.md:L3519 10 rows x 5 cols
ok   01_Setup_Guide.md:L3536 7 rows x 3 cols
ok   01_Setup_Guide.md:L3548 9 rows x 3 cols
ok   01_Setup_Guide.md:L3572 7 rows x 3 cols
ok   01_Setup_Guide.md:L3635 4 rows x 3 cols
ok   01_Setup_Guide.md:L3826 5 rows x 3 cols
ok   01_Setup_Guide.md:L3838 5 rows x 3 cols
ok   01_Setup_Guide.md:L3946 6 rows x 4 cols
ok   01_Setup_Guide.md:L4021 8 rows x 3 cols
ok   01_Setup_Guide.md:L4036 8 rows x 10 cols
ok   01_Setup_Guide.md:L4051 5 rows x 4 cols
ok   01_Setup_Guide.md:L4061 5 rows x 4 cols
ok   01_Setup_Guide.md:L4071 8 rows x 3 cols
ok   01_Setup_Guide.md:L4084 5 rows x 3 cols
ok   01_Setup_Guide.md:L4100 9 rows x 6 cols
ok   01_Setup_Guide.md:L4114 11 rows x 6 cols
ok   01_Setup_Guide.md:L4145 21 rows x 11 cols
ok   01_Setup_Guide.md:L4169 3 rows x 9 cols
ok   01_Setup_Guide.md:L4175 5 rows x 9 cols
ok   01_Setup_Guide.md:L4183 7 rows x 9 cols
ok   01_Setup_Guide.md:L4193 7 rows x 9 cols
ok   01_Setup_Guide.md:L4203 7 rows x 9 cols
ok   01_Setup_Guide.md:L4213 7 rows x 9 cols
ok   01_Setup_Guide.md:L4269 9 rows x 4 cols
ok   01_Setup_Guide.md:L4283 10 rows x 4 cols
ok   01_Setup_Guide.md:L4296 7 rows x 4 cols
ok   01_Setup_Guide.md:L4308 8 rows x 7 cols
ok   01_Setup_Guide.md:L4327 8 rows x 5 cols
ok   01_Setup_Guide.md:L4341 8 rows x 7 cols
ok   01_Setup_Guide.md:L4360 5 rows x 3 cols
ok   01_Setup_Guide.md:L4382 10 rows x 4 cols
ok   01_Setup_Guide.md:L4453 7 rows x 3 cols
ok   01_Setup_Guide.md:L4465 6 rows x 3 cols
ok   01_Setup_Guide.md:L4474 8 rows x 3 cols
ok   01_Setup_Guide.md:L4491 5 rows x 3 cols
ok   01_Setup_Guide.md:L4499 8 rows x 5 cols
ok   01_Setup_Guide.md:L4510 3 rows x 7 cols
ok   01_Setup_Guide.md:L4518 7 rows x 7 cols
ok   01_Setup_Guide.md:L4601 8 rows x 4 cols
ok   01_Setup_Guide.md:L4614 11 rows x 4 cols
ok   01_Setup_Guide.md:L4628 9 rows x 4 cols
ok   01_Setup_Guide.md:L4642 9 rows x 4 cols
ok   01_Setup_Guide.md:L4654 6 rows x 4 cols
ok   01_Setup_Guide.md:L4663 12 rows x 4 cols
ok   01_Setup_Guide.md:L4678 8 rows x 4 cols
ok   01_Setup_Guide.md:L4697 18 rows x 3 cols
ok   01_Setup_Guide.md:L4718 12 rows x 3 cols
ok   01_Setup_Guide.md:L4735 14 rows x 4 cols
ok   01_Setup_Guide.md:L4756 10 rows x 3 cols
ok   01_Setup_Guide.md:L4779 16 rows x 3 cols
ok   01_Setup_Guide.md:L4798 13 rows x 5 cols
ok   01_Setup_Guide.md:L4814 10 rows x 3 cols
ok   01_Setup_Guide.md:L4827 5 rows x 3 cols
ok   02_Kickoff_System_Prompts.md:L129 9 rows x 3 cols
ok   03_Package_Manifest_and_QC.md:L7 6 rows x 3 cols
ok   03_Package_Manifest_and_QC.md:L16 6 rows x 4 cols
ok   03_Package_Manifest_and_QC.md:L27 24 rows x 6 cols
ok   03_Package_Manifest_and_QC.md:L56 11 rows x 4 cols
ok   03_Package_Manifest_and_QC.md:L70 7 rows x 5 cols
ok   03_Package_Manifest_and_QC.md:L78 5 rows x 3 cols
ok   03_Package_Manifest_and_QC.md:L90 7 rows x 4 cols
ok   03_Package_Manifest_and_QC.md:L102 8 rows x 5 cols
ok   03_Package_Manifest_and_QC.md:L113 11 rows x 3 cols
ok   03_Package_Manifest_and_QC.md:L137 14 rows x 4 cols
ok   03_Package_Manifest_and_QC.md:L154 10 rows x 4 cols
ok   03_Package_Manifest_and_QC.md:L169 11 rows x 3 cols
ok   03_Package_Manifest_and_QC.md:L183 10 rows x 3 cols
ok   03_Package_Manifest_and_QC.md:L198 10 rows x 4 cols
ok   README-FIRST.md:L7 6 rows x 4 cols
ok   README-FIRST.md:L18 11 rows x 4 cols
ok   README-FIRST.md:L32 9 rows x 4 cols
ok   SYSTEM_PROMPT_KICKOFF.md:L129 9 rows x 3 cols
PIPE 01_Setup_Guide.md:L2025 1 prose line(s) with a pipe
6 file(s), 216 table(s), 0 defect(s), 1 prose line(s) containing a pipe (not tables)
```
