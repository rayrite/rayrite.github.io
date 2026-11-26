# The six sets and their parts

Built by `tools/make_slices.py` from the task rows in `sets/_tasks/`. Each part is a list file with one task id per line. The table of every part with its tasks is in `sets/<NAME>/slices.md`.

| Set | Tasks | Repositories | Solved by both | One agent | Neither | Tasks per slice | Smoke sets | Parts and tasks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| P20 | 20 | 3 | 9 | 7 | 4 | 5 | yes | `sets/P20/slices.md` |
| B40 | 40 | 3 | 14 | 10 | 16 | 10 | no | `sets/B40/slices.md` |
| R1 | 20 | 15 | 9 | 7 | 4 | 5 | yes | `sets/R1/slices.md` |
| R2 | 20 | 18 | 9 | 7 | 4 | 5 | yes | `sets/R2/slices.md` |
| R3 | 20 | 17 | 9 | 7 | 4 | 5 | yes | `sets/R3/slices.md` |
| R4 | 20 | 18 | 9 | 7 | 4 | 5 | yes | `sets/R4/slices.md` |

P20 is the main panel, R1 to R4 are four rotation panels and B40 is the confirmation panel, to be used once per decision. The groups say which baseline agents solved a task in the runs published with FreshSWE-Py: both, one of the two, or neither.
