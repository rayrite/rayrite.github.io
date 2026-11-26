# Naive agent against the BCF brain on httpx_3672: hypothetical beside actual

**Prepared:** 2026-11-25. **Supersedes for reading purposes:** `input/kagglecomp/docs/03-bcf-simulation-httpx-3672.slides.v5.html`, which is kept unchanged as the hypothetical lane.

## What this package answers

Three questions were asked of the v5 deck. Does the harness behave the way v5's emulator assumed? How would the current BCF brain perform on the same problem? And why is that better than the naive agent? The method was the one v5 preached: execute. Every call of both v5 lanes was run through the real harness code on the real task snapshot, then the current brain was run the same way, in both shipped versions, and the harness's own grader scored the working tree after every call.

## Headline results, all from the real grader

| Lane (actual run) | Container B | Graded tests | Calls, total / charged | Calls holding a passing patch | First passing call | Final patch | Text received from tools (chars / 4) | Tool time, summed | Tree states graded |
|---|---|---|---|---|---|---|---|---|---|
| Naive agent | **False** | 5 failed, 19 passed | 43 / 40 | 5 | N8 | 4 files, 2,851 bytes | 12,455 | 74.3 s | 10 |
| Older BCF (v5's Config 3) | **True** | 24 passed | 30 / 26 | 21 | C9 | 7 files, 9,563 bytes | 6,521 | 19.8 s | 15 |
| Brain 2026-11-23 | **True** | 24 passed | 13 / 12 | 10 | S2 | 7 files, 7,549 bytes | 1,730 | 5.5 s | 8 |
| Brain 2026-11-24 (patched) | **True** | 24 passed | 13 / 12 | 10 | S2 | 7 files, 7,549 bytes | 1,729 | 5.5 s | 8 |
| Brain 2026-11-23, alias fork | **True** | 24 passed | 15 / 14 | 12 | S2 | 7 files, 7,573 bytes | 1,824 | 6.8 s | 9 |
| Brain 2026-11-24, alias fork | **True** | 24 passed | 15 / 14 | 12 | S2 | 7 files, 7,573 bytes | 1,823 | 6.6 s | 9 |

The older-BCF lane shows 30 cards, of which 28 were executed: its two skill scripts (`classify_issue`, `write_spec`) are not shipped in either BCF package, so v5's output for them is carried over. "Text received from tools" counts only tool results, divided by four; it excludes the prompt, the model's words and its thinking.

Four statements follow from the table, and a fifth from a second task.

| # | Statement | Evidence |
|---|---|---|
| 1 | v5 predicted both of its trajectories correctly | All 43 naive cards and 26 of 30 older-BCF cards carry the same facts as the real tools; no verdict changed |
| 2 | The emulator understated the cost | On a failing command the real tool delivers the capped output twice: 10,811 characters at N9 against 5,000 in v5 |
| 3 | The current brain resolves the task in 12 charged calls and receives about one seventh of the naive agent's text | 1,730 against 12,455 tokens; a passing patch from the fourth call |
| 4 | Both brain versions produce the same patch and verdict; they differ in one line of the spec | Slide "versions" of the deck, and `evidence/probes/plan_matrix.json` |
| 5 | The trap is not a quirk of one task | On `rich_4070` the real harness shows a correct fix turning a visible test file into an import error; 46 of the 129 public tasks have hidden tests that rewrite visible ones |

## What is real, what is scripted

| Class | Content | Status |
|---|---|---|
| Real | The harness's sandbox setup, its nine tools and caps, the first message, the brain's installer and helper, Container B's `verify_task` after every change | Executed on 2026-11-25 |
| Scripted | Which call comes next and with which arguments. No model was sampled | Labelled [SIM] throughout |
| Emulated | The Docker sandbox (Git Bash on Windows, four disclosed substitutions) and ADK's skill-script wrapper | Labelled [HOST] |

A live run with the model needs a machine that serves Gemma 4 31B. `live-run-kit/PLAYBOOK.md` gives the commands for the RTX 5090.

## What is in the folder

| Path | What it holds |
|---|---|
| `03-bcf-simulation-httpx-3672.slides.v6.html` | The deck. 22 slides. Every v5 card beside the real output of the same call, the current brain in both versions, the reasons for every difference, and the same trap on a second real task |
| `00_README.md` | This file |
| `01_Walkthrough_httpx_3672.md` | The eight steps in markdown: every call of every lane with both verdicts and its variance |
| `02_Hypothetical_vs_Actual_Variance.md` | How v5's emulator compares with the real harness, card by card, and why they differ |
| `03_How_the_Brain_Improves_on_Naive.md` | The justification: seven mechanisms, the real call that shows each, and the research behind it |
| `04_Live_Run_Playbook.md` | How to run the model itself on the RTX 5090 and read its decisions (a copy of `live-run-kit/PLAYBOOK.md`) |
| `05_Evidence_Index_and_Sources.md` | Every file, its fingerprint, and every source |
| `06_Table_QC_Report.md` | The table check of these markdown files |
| `evidence/lanes/` | Six lane records: every real output, shadow verdict and patch |
| `evidence/variance.json` | The card-by-card classification |
| `evidence/probes/` | The spec matrix, the edit gate and the second-task probe |
| `evidence/slip/` | The run with the one-line-off edit, kept as evidence |
| `evidence/digests/` | Harness, dataset and design digests with file and line citations |
| `live-run-kit/` | The playbook, six scripts for the live run, the reference lanes and the replay toolkit |

## Read next

| If you have | Read |
|---|---|
| Ten minutes | The deck, slides 1 to 4, then 14 to 18 |
| A question about one call | `01_Walkthrough_httpx_3672.md`, which lists every call with both verdicts |
| Doubt about v5 | `02_Hypothetical_vs_Actual_Variance.md` |
| To justify the brain to someone | `03_How_the_Brain_Improves_on_Naive.md` |
| The RTX 5090 in front of you | `04_Live_Run_Playbook.md` |
