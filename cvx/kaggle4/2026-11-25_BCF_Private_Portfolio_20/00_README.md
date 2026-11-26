# BCF brain: a private 20-task portfolio, four sets to rotate, and where more tasks come from

Package of 2026-11-25. Competition: Kaggle, Google Gemma 4 Developer Agent (149921). Brain under test: `deliverables/2026-11-23_BCF_Brain_and_Dataset_RCA/bcf-brain`.

## What was asked

| Question | Answered in |
| --- | --- |
| Q1. Recommend a 20-task portfolio of repositories for testing the agent (the exchange proposed a private set built by Route A, real merged pull requests, 15 to 25 tasks in 2 or 3 clean Python repositories) | `01_Portfolio_Recommendation.md`, `06_Measurement_Protocol.md` |
| Added: research repositories across the internet useful for creating problems with the same rigour, and include suitable repositories from them | `03_Problem_Source_Repositories.md`, `02_Repository_Recommendations.md` |
| Added: three or four more sets of 20 tasks, to rotate the tests | `09_Rotation_Panels.md`, `portfolio/rotation_r1.jsonl` to `rotation_r4.jsonl` |
| Added: a beginner's playbook for Zorin OS 18, with a portable HTML guide and scripts that cut each set into smaller ones | The package `deliverables/2026-11-25_BCF_Test_Sets_Playbook/` |

## The answer in six lines

1. **Use P20: 20 tasks from three zero-dependency repositories unrelated to FastAPI, rich and Requests**: `pypa/packaging` (8 tasks), `pallets/click` (6) and `more-itertools/more-itertools` (6). All were created between April and September 2026, after Gemma 4's release, and each fails before its fix and passes with it under the scorer's own test rules.
2. **Do not mine them yourself this week.** Competitors have published four held-out sets in the competition's task format. P20 is drawn from the largest, FreshSWE-Py (663 validated tasks from 33 repositories), and a second panel, B40, holds 40 further tasks of the same three repositories for one-time confirmation runs.
3. **The whole scored set comes from repositories the agent has never seen**, by a staff statement, so a panel of other repositories is the right instrument. The brain's editor is safe on them (69 of 70 gold patches applied byte-identically, one not comparable), and its localizer finds the file for 58 of 70.
4. **The helper's keyword rules are the weak part on unknown repositories.** On 12 of the 70 candidate statements they pick a procedure that does not fit; the 2026-11-24 patched helper repairs five of them. The domain table gives a specific label, written for the public four, to 55 percent of FreshSWE-Py's statements, and most of those labels do not fit the repository.
5. **A published figure of the package is too low.** With every entry of the top-file line counted, the localizer puts the gold file in its top 5 for 96 of the 129 public tasks, not 56.
6. **Twenty tasks rank nothing in one run.** One run of P20 detects a two-task gain 1 percent of the time; three paired runs detect a four-task gain without losses 99 percent of the time, and 58 percent of the time when one task is lost. Use P20 for smoke tests and paired runs, then confirm on B40.

## Four more sets, and how to rotate

1. **R1, R2, R3 and R4 are four more sets of 20 tasks.** Each follows the rules of P20 (post-release tasks from FreshSWE-Py; 9 solved by both baseline agents, 7 by one, 4 by neither; small fixes; fast gold tests) and comes from other repositories: 15 to 18 per set, 26 over the four, none of them one of P20's three. No task is shared with P20, B40 or another rotation set.
2. **Rotate by three rules**: run both versions of the agent on the same set; use a new set for each new comparison; pool two or more sets when the difference is small. Two sets (40 pairs) detect a gain of four tasks per 20 with one loss 36 percent of the time; four sets (80 pairs), 74 percent.
3. **The helper is as safe on them as on P20**: 80 of 80 reference fixes were applied byte-identically by the editor, and the localizer puts the gold file in its top 5 for 67 of 80.
4. **Eight of the 80 statements lead the keyword rules to a procedure that does not fit; the patched helper repairs three.** The five that remain sit in three of the sets, so a repair of the rules can be tried on one set while another stays untouched.
5. **A fifth set of the same recipe cannot be built** from FreshSWE-Py version 6: all 12 far-repository closed-issue statements solved by both baseline agents are in use. Document 09 lists three other shapes and the script that writes them.
6. **The playbook package** takes a beginner on Zorin OS 18 from an empty machine to a first comparison, and its scripts cut each set of 20 into slices of 3, 5 or 10 tasks that keep the 9 : 7 : 4 mix.

## What is in the package

| File or folder | Content |
| --- | --- |
| `01_Portfolio_Recommendation.md` | P20: why these tasks, the three anchor repositories, the 20 tasks with dates, fix sizes, baseline outcomes and what each exercises, selection rules, panel B40, alternates, the other held-out sets, limits |
| `02_Repository_Recommendations.md` | Repositories in three tiers: the 33 of FreshSWE-Py; repositories with validated post-cutoff tasks (the SWE-rebench family and other public datasets); 38 repositories surveyed through the GitHub API as mining targets; repositories to avoid |
| `03_Problem_Source_Repositories.md` | Repositories across the internet useful for creating tasks with the competition's rigour: the three named in the request, community sets, public datasets, environment builders, older bug databases, training sets, and six ranked routes |
| `04_Build_Verify_and_Run.md` | The task format, how to run a bundle on P20 with FreshSWE-Py, the OOD sets, the gold and empty gates, the step-by-step recipe for mining new tasks, pitfalls with numbers, a checklist |
| `05_Brain_Dry_Run_Findings.md` | What the helper did on 70 candidate tasks without a model: editor, localizer, routing, domain labels, and six changes worth testing on P20 |
| `06_Measurement_Protocol.md` | Power of a 20-task panel, the comparison protocol, what to record per task, time and compute, what to expect |
| `09_Rotation_Panels.md` | The four rotation sets R1 to R4: the rules of rotation, a rotation that uses every set once, why their shape differs from P20, the recipe by cells, the 80 tasks, validation, the eight misrouted statements, power of pooled sets, what is left |
| `08_Sources.md` | Numbered sources with publisher, date and use |
| `07_Table_QC_Report.md` | Result of the table check on every document |
| `portfolio/` | `portfolio20.jsonl` (the 20 task rows: the competition's 8 fields plus metadata), `panel20.txt`, `panel40_confirm.txt`, `confirm40.jsonl`, `alternates.tsv`, `reserve_pool.tsv`; the rotation sets `rotation_r1.jsonl` to `rotation_r4.jsonl`, `panel_r1.txt` to `panel_r4.txt`, `panel_rotation_all.txt`, `rotation_cells.tsv` |
| `data/` | The evidence: dry-run results, replays, route censuses, difficulty tiers, power tables, per-task facts of the held-out sets, the pool of the rotation sets, the GitHub survey |
| `tools/` | The scripts that produced the evidence, with a README |

## State of the work

| Verified on 2026-11-25 | Result |
| --- | --- |
| Task rows of P20, B40 and R1 to R4 against FreshSWE-Py version 6 | 20, 40 and 4 times 20 rows; dates, sizes and baseline outcomes read from the set's files |
| Editor replay through the 2026-11-23 helper on 70 candidate tasks and on the 80 rotation tasks | 70 applied, 69 byte-identical to `git apply`, 1 not comparable (a changelog file outside my text-only snapshot copy); 80 of 80 byte-identical on the rotation tasks |
| Localizer dry run on the same tasks | Gold file in the top 5 for 58 of 70 and for 67 of 80; ranked first for 45 of 70 and 47 of 80 |
| Localizer on the public 129 with the corrected count | Top 5: 96 of 129; first place: 64 of 129; all other figures reproduce the published ones |
| Shared tasks between P20, B40 and the four rotation sets | None |
| Archives read remotely from Kaggle | The 16 OOD-45 snapshots matched the set's SHA256SUMS; 150 snapshots were read in total |
| Tables in the documents | `07_Table_QC_Report.md` |

| Not verified | Why |
| --- | --- |
| Any run of a BCF bundle on P20, B40 or R1 to R4 | No model endpoint was available; the helper was tested without the model |
| The gold and empty gates of the sets in the sandbox image | No Linux Docker host and no full dataset download in this run; the set's own gate is the author's |
| The commands of Path A, B and C in Document 04 | Read from the sets' READMEs, scripts and the harness source; each is marked "Read, not executed" |
| The exact release date of Gemma 4 | Community sets give 2026-03-31 and 2026-04-02; the official model card prints no date. P20 starts on 2026-04-08 |
| Gate numbers and per-repository counts of gated datasets | Taken from the papers and READMEs; not re-run |

## Where to start

| If you want to | Open |
| --- | --- |
| The list of tasks | `01`, Section 3; `portfolio/panel20.txt` |
| More sets, to rotate | `09`; `portfolio/panel_r1.txt` to `panel_r4.txt` |
| Step-by-step instructions for a first installation and run, on Zorin OS 18 | The package `deliverables/2026-11-25_BCF_Test_Sets_Playbook/`, which starts at its `README.md` or at the HTML guide |
| To run it | `04`, Sections 3 and 5, then `06` |
| To know what may break in the brain first | `05`, Sections 4, 5 and 7; `09`, Section 6 |
| More repositories | `02` |
| To build your own tasks | `03`, Section 5, then `04`, Section 6 |

## How it was researched

Six research passes ran in parallel in isolated folders (pipeline documentation; contamination and leakage evidence; a GitHub API survey of 38 repositories; the competition's forum and official pages; an inventory of problem sources across GitHub, Hugging Face, Kaggle and arXiv; a census of 16 public datasets), and their claims were checked against the saved primary sources. On the main thread the four held-out sets were read from their own files, and the helper was driven on 70 candidate tasks and on the 80 rotation tasks. Searches used free and already-included engines only: real spend was $0.

Scratch folder of the run: `scratch/2026-11-25-bcf-portfolio/` (research folders, page dumps, notes, snapshots and stores).
