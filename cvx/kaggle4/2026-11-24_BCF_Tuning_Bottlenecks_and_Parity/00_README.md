# BCF brain: exception traps, time bottlenecks, tuning levers, local-versus-Kaggle parity, scoring guide, board audit, roadmap, and setup guide

**Package of 2026-11-24** for the Kaggle competition *Google Gemma 4 Developer Agent* (149921). **Subject:** the BCF brain of `2026-11-23_BCF_Brain_and_Dataset_RCA/bcf-brain`. **Deadlines:** entry and team-merger deadline 2026-11-25 23:59 UTC; final submissions 2026-12-02 23:59 UTC.

---

## 1. The seven tasks and where each is answered

| Task | Document | One-line answer |
| --- | --- | --- |
| 1 | `01_Exception_Handling_Traps_by_Error_Family.md` | 13 error families in the 129 tasks, each with the traps as the documentation states them and a post-mortem procedure. The sandbox interpreter is Python **3.13** (the image is `python:3.13-slim`), not the 3.12 of the harness and of the staff notebook |
| 2a | `02_Time_Bottlenecks_and_Tuning_Levers.md`, Part A | The five numbers that decide the score: 12 hours, 360 seconds per task at 120 tasks, 13 to 25 tokens per second on the scorer, 219 to 322 tokens per model call, about seven attempts left |
| 2b | same, Part B | 17 levers ranked by impact over effort; the first three are one-line changes (solver thinking 4,096 to 2,048; the governor's gates; the per-task cap) |
| 2c | same, Part C | Six tiers of feedback from seconds to a day, and the rule to work at the lowest tier that can decide the question |
| 3 | `03_Local_Kaggle_Parity_Plan.md` | What the scoring environment is, dimension by dimension with its source; the parity matrix for Windows 11 with WSL2 and Zorin OS 18.1; three rungs of local parity; twelve acceptance tests |
| 4 | `04_Local_Scoring_and_Interpretation_Guide.md` and `tools/run_report.py` | How to read a result folder, what the local score can and cannot predict (with the power table of a paired design), and how to turn the largest failure class into the next lever |
| 5 | `05_Board_Issues_Graceful_Handling_Audit.md` | 51 issues: 31 handled, 9 partly, 6 not controllable, 2 not applicable, 3 defects. Six fixes, validated, in `bcf-brain-patched/` |
| 6 | `06_Impact_Effort_Roadmap.md` | The ranked list, the exact values to set, the calendar to 2026-12-02, and the decision gates |
| 7 | `07_Setup_and_Run_Guide.md` and `07_Setup_and_Run_Guide.html` | Download, install and run on the PowerSpec G914 on Zorin OS 18.1 and on Windows 11 Pro with WSL2; the smoke panel, the ranking panel, and the official submission for the main and the bonus tracks |

---

## 2. What this package found

| Finding | Evidence | Where |
| --- | --- | --- |
| The task sandbox is Python 3.13; the harness and the staff notebook are 3.12.13 | `docker/Dockerfile.sandbox` in the competition zip; the notebook's metadata; three wheelhouse wheels are built for 3.12 only | Task 1, section 0 |
| `finalize` deleted a correct new file: a root-level module created with `apply` was removed and the helper then reported "NO SOURCE CHANGES" | Executed probe of the helper in a temporary repository | Task 5, defect D2 |
| The helper allowed edits to nested test helpers that the scorer discards | Executed probe | Task 5, defect D1 |
| The helper's keyword routing reproduced the reviewed category for 43% of the statements and the reviewed domain for 38% | Measurement on the 129 statements, no model | Task 5, section 2.1 |
| A solver thinking budget of 4,096 is 164 to 241 seconds on the scorer; the average task can afford 219 to 322 generated tokens per call | Arithmetic on the published decode rate and the 12-hour rule | Task 2, section 0 |
| One run of a 30-task panel detects a ten-point gain 7% of the time | Exact power of the paired sign test | Task 4, section 6.3 |
| The competition is a code competition: the submission is a notebook that writes `submission.zip`; the plain `swegemma eval` command ignores the bundle's budgets and runs without compaction | Kaggle documentation; `swegemma/cli.py` | Task 7 |

---

## 3. The patched brain

`bcf-brain-patched/` is a copy of the validated brain with six fixes and nothing else changed. The original package was not modified.

| Fix | Before | After |
| --- | --- | --- |
| Protected paths follow the harness rule | 3 of 15 probe paths allowed | 0 |
| `finalize` keeps what the helper wrote and nested modules with scratch-like names | 2 files lost | kept |
| The helper's test command uses the scorer's verdict-changing flags | 0 of 4 | 4 of 4 |
| Keyword stems that could never match | `picklable`, `hashable`, `__qualname__`, `forward references` missed | matched |
| Routing: most distinct keyword match wins, generic words removed, bug fix before behaviour change | category 55, domain 49, route 42 of 129 | 97, 82, 52 |
| The docstring names both interpreters | "pinned Python 3.12" | 3.13 and 3.12.13 |

Validation of the copy on 2026-11-24: 37 helper tests (36 pass, 1 optional skipped), official compiler 6 of 6, 15 negative controls rejected, the 129 published fixes replayed through the editor 129 of 129 byte-identical to `git apply`, behaviour probe 15 pass and 0 gaps. The diff is `patches/bcf-brain-patches.diff`. Details: `bcf-brain-patched/validation/PATCHED-VALIDATION-2026-11-24.md`.

**Use the patched bundles for the next submission**, after one smoke run with the model.

---

## 4. What to do first

| Order | Action | Time |
| --- | --- | --- |
| 1 | Build and validate the patched brain where you work: `cd bcf-brain-patched`, `python build.py`, `python -m unittest tests.test_bcf`, `python tools/run_validator.py` | 5 minutes once the validation environment exists |
| 2 | Install the rig (Task 7, sections 3 or 4, then 5) and run the smoke panel through `tools/run_panel.py` | half a day the first time, mostly downloads |
| 3 | Read the smoke run with `tools/run_report.py`: seconds and tokens per call, the projection to scorer time | 10 minutes |
| 4 | Submit `bcf-31b-flat` (patched) early on 2026-11-25: it banks a score and answers whether skill scripts run on the scorer | one of about seven attempts |
| 5 | Pull the levers in the order of Task 6, deciding each on paired panel runs | the rest of the week |

---

## 5. What is not verified

| Item | Why | How to close it |
| --- | --- | --- |
| Any run with the Gemma 4 model | No model endpoint was available to this work | The smoke panel (Task 7, section 6) |
| The mean seconds per task on the scorer | Decides the 12-hour risk | The projection of Task 4, then the first scored run |
| The install steps on a greenfield G914 | They follow the official documentation and the staff notebook but were not executed on that machine here | The acceptance table of Task 7, section 13 |
| Whether skill scripts run on the scorer | Open board question since 2026-11-12 | The first skill-carrying submission |
| Whether the scorer uses the Docker backend | The Overview page implies it; thread 754586 asks | The same thread |
| The local decode rate of the 5090 for the 31B checkpoint | Every time projection depends on it | One smoke task |

---

## 6. Folder map

| Path | Content |
| --- | --- |
| `00_README.md`, `00_README.html` | This file, and a portable HTML hub |
| `01_...md` to `06_...md` | Tasks 1 to 6 |
| `07_Setup_and_Run_Guide.md`, `.html` | Task 7; the HTML is self-contained (no external file, font or script) |
| `bcf-brain-patched/` | The brain with the six fixes; six bundles in `dist/`; evidence in `validation/` |
| `patches/bcf-brain-patches.diff` | The exact change, 155 diff lines |
| `tools/` | `run_report.py`, `run_panel.py`, `install-wheelhouse.sh`, `panel30.txt`, `panel_smoke.txt`, `apply_brain_patches.py`, `brain_probe.py`, `route_eval.py`, `exc_scan.py`, `paired_power.py`, `py_probe.py`, `docgrep.py`, `make-html.sh`, `portable-toc.html` |
| `08_Table_QC_Report.md` | Result of the table check on every document |

Intermediate work (fetched pages, notes, probes, the synthetic fixture, the replay work folder) is in `scratch/2026-11-24-bcf-tuning-parity/`; the board capture of 2026-11-24 06:01 UTC is in its `board/` folder.

---

## 7. How the research was done

External research used the project's research toolkit on the main thread: the competition's Overview, Rules and Data pages and the Kaggle documentation were rendered in a browser; the staff notebook was read through Kaggle's public kernel API; the Python 3.13 documentation (30 pages), the vLLM 0.19.1 documentation, the Microsoft WSL documentation, NVIDIA's CUDA on WSL guide, the Docker, uv, pytest and statsmodels documentation and the vendor pages were fetched and quoted from; the board was captured anonymously at 06:01 UTC (378 topics, 6,605 teams). Search used the free engines and the included monthly allowance of the search provider; nothing was billed beyond it (see the credit line in the chat hand-back). Every source is listed at the end of each document with its date.
