# The 20-task portfolio for the BCF brain

**Prepared:** 2026-11-25. **Scope:** the answer to Q1 (recommend a 20-task portfolio of repositories for testing the agent) for the BCF brain as implemented at `deliverables/2026-11-23_BCF_Brain_and_Dataset_RCA/bcf-brain`. Companion documents: `09` (four more panels of 20 tasks, R1 to R4, for rotating the tests), `02` (which repositories to use and where more tasks come from), `03` (repositories across the internet that help create problems with the same rigour), `04` (build, verify and run), `05` (what a dry run of the helper found), `06` (how to measure with the panel).

Every number below was read from data on disk: the task rows of the published sets, the baseline result files that ship with them, the helper dry run of this run (`data/`), and the harness's own difficulty engine. The selection list and the one-line descriptions are the only hand-written inputs.

---

## 0. The recommendation

Use **P20**: 20 tasks from three repositories that have no runtime dependency, that are unrelated to FastAPI, rich and Requests, and whose tasks were all created after Gemma 4 was released.

| Property | P20 |
| --- | --- |
| Source | FreshSWE-Py, version 6 ([Kaggle dataset moshegolderson/freshswe-py](https://www.kaggle.com/datasets/moshegolderson/freshswe-py), updated 2026-11-07) |
| Anchor repositories | `pypa/packaging` (8 tasks), `pallets/click` (6), `more-itertools/more-itertools` (6) |
| Task dates | 2026-04-08 to 2026-09-18, all after the model's release |
| Verification | Fails at the base commit, passes with the reference patch, passes again, under the scorer's own test rules (the set's gate) |
| Statement sources | 13 closed issues, 6 pull-request descriptions, 1 commit message with changelog |
| Difficulty (two baseline agents) | 9 solved by both, 7 by one, 4 by neither |
| Machine-readable files | `portfolio/portfolio20.jsonl` (competition's 8 fields plus metadata), `portfolio/panel20.txt` |

A second panel, **B40** (`portfolio/panel40_confirm.txt`), holds 40 further tasks from the same three repositories. It is drawn once and is meant to confirm a decision taken on P20, never to tune on.

Three findings shaped this choice:

1. **The whole scored set comes from repositories the agent has never seen.** The official data page says the test set "was curated from a set of private repositories", and a staff reply adds: "None of the repos in the training tasks are present in the test set, however" ([thread 747248](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/747248), 2026-10-09). Testing transfer to other repositories is not a side check; it is the main thing a local panel can measure.
2. **Mining is no longer the bottleneck.** Four held-out sets in the competition's own task format have been published by other competitors (Section 7 and Document 03). FreshSWE-Py alone has 663 validated tasks from 33 repositories with up to 90 tasks in one repository, which is the "2 or 3 clean repos, 15 to 25 tasks" shape the exchange asked for, at zero build cost.
3. **The brain has never been run on these repositories.** A dry run without a model (Document 05) shows the editor is safe on them (69 of 70 gold patches byte-identical to `git apply`, one not comparable) and the localizer usually finds the file (58 of 70 in its top 5 files), but on 12 of those 70 statements the keyword rules pick a procedure that does not fit the task.

---

## 1. Why these tasks pass the rigour test

The competition's pipeline, in the words of its data page, is: commits that modify code and tests, linked to their issue, filtered for noise, then an execution gate in which the tests must fail before the fix and pass with it. FreshSWE-Py was built to that standard against this scorer in particular ([paper](https://www.kaggle.com/datasets/moshegolderson/freshswe-py), Mittelman, PDF dated 2026-11-06):

| Criterion | How FreshSWE-Py meets it | Evidence |
| --- | --- | --- |
| Real fix of a real issue | First-parent commits on the default branch that change both library code and tests; the library diff is the reference patch, the test diff the hidden tests | 1,143 candidates from 36 libraries |
| Noise removed | Dependency bumps, documentation, release and revert commits dropped; fixes of more than 5 library files or 200 lines dropped | `validation/scripts/mine.py` in the dataset |
| Fails before, passes after | Tests fail at the base commit, pass with the reference patch, and pass again on a rerun | 663 of 1,143 candidates pass (58 percent) |
| Scorer's own conventions | Validation re-implements the harness step: `pytest.ini` overwritten, header added to the root `conftest.py`, anyio plugin disabled, every `.py` file of the test patch passed as a target, no network, 4 GiB limit, CPython 3.13 | Test targets equal the harness's on all 1,143 candidates |
| Reproducible offline environment | The project's own `uv.lock` when it has one (290 tasks), otherwise dependencies resolved as of the day after the base commit (373 tasks); a 1,537-wheel wheelhouse | `locks/`, `wheelhouse/`, `sandbox/setup.py`, `docker/Dockerfile` |
| No future history | One-commit snapshots | `snapshots/` |
| Decontaminated by date | Every task created after 2026-04-02, the model's public release | `created_at` 2026-04-02 to 2026-10-18 |
| Upstream text as the statement | Never generated by a model: the closed issue, the pull-request description, or the commit message | 167, 411 and 85 tasks |

Two limits are stated by the author and matter for how to read results: the baselines ran FP4 weights on a hosted endpoint rather than the competition's INT4 checkpoint on 4x L4, and the 48 percent of tasks that no baseline solved are "unsolved, not shown to be solvable from their statements".

---

## 2. The three anchor repositories

| Anchor repository | What it is | Tasks in FreshSWE-Py | Issue statements | PR descriptions | Commit messages | Created from | Created to | Solved by both baseline agents | Tuned only | Reference only | Neither | Tasks in P20 |
| --- | --- | ---: | ---: | ---: | ---: | --- | --- | ---: | ---: | ---: | ---: | ---: |
| `pypa/packaging` | Version, specifier, marker and tag parsing (PEP 440 and friends); no runtime dependency; src layout | 90 | 14 | 75 | 1 | 2026-04-05 | 2026-10-13 | 50 | 3 | 3 | 34 | 8 |
| `pallets/click` | Command-line option and command parsing; no runtime dependency; src layout; a 3,437-line core.py | 38 | 19 | 17 | 2 | 2026-04-08 | 2026-10-04 | 6 | 1 | 1 | 30 | 6 |
| `more-itertools/more-itertools` | Iterator recipes; no runtime dependency; flat layout; a 5,538-line more.py | 21 | 4 | 17 | 0 | 2026-05-05 | 2026-09-29 | 3 | 8 | 5 | 5 | 6 |

"Solved by both" counts tasks solved by the author's tuned agent in at least one of two runs and by the organizers' reference agent. The three repositories were chosen for reasons that complement each other:

- **Different work, different owners.** Version-string parsing, command-line parsing and iterator algorithms share no vocabulary with FastAPI, rich or Requests. That is deliberate: the helper's domain table is built from the vocabulary of the public four, and a portfolio of similar libraries would not show whether it transfers.
- **Different code shapes.** `packaging` is many small parsing modules (20 Python files under `src/`); `click` has one very large module (`core.py`, 3,437 lines); `more-itertools` keeps almost everything in one 5,538-line file, so the search has to rank functions inside a file rather than files.
- **A difficulty gradient across repositories.** Most `packaging` tasks were solved by both agents, most `click` tasks by neither, and `more-itertools` splits evenly. A single panel therefore contains easy, medium and hard tasks without hand-picking by guesswork.
- **Zero runtime dependencies** (confirmed from `pyproject.toml` through the GitHub API on 2026-11-25), so the offline environment is small and the harness has little to get wrong.
- **Room behind them.** After P20 and the alternates are removed, 119 further validated tasks remain in these repositories (107 pass the usability filter of Section 5).

If one of the three does not suit, these are drop-in replacements, each with validated post-release tasks: `pytest-dev/pluggy` (14 tasks, 8 issue statements), `python-humanize/humanize` (11 tasks), `tox-dev/platformdirs` (54 tasks, but only 2 issue statements) and `PyCQA/isort` (46 tasks, 32 of them terse commit-message statements, which makes it a good stress test for the title-hunting route). Four tasks from `pluggy` and three from `humanize` are among the alternates in Section 6.

---

## 3. The 20 tasks

"Solved by": `both` means the tuned agent and the reference agent each solved it; `tuned` or `reference` means only that agent; `neither` means no baseline run solved it. "Helper route" is what the 2026-11-23 helper's rules produce from a mechanical brief (category, domain, route); see Document 05 for how it was produced. "Gold file rank" and "gold function rank" are the helper's own localizer result.

| # | Task | Statement | Created | Fix size | Fail-to-pass tests | Gold test time | Solved by | Harness tier | Helper route (dry run) | Gold file rank | Gold function rank | Bug class | What it exercises |
| ---: | --- | --- | --- | --- | ---: | ---: | --- | --- | --- | --- | ---: | --- | --- |
| 1 | `packaging_1179` | issue | 2026-04-27 | 22 lines, 2 files | 1 | 0.5 s | both | Medium (35.4) | C1 / GEN / P2 | top 5 | top 1 | unhandled input class | A version string that does not follow PEP 440 (a CPython dev build); two files |
| 2 | `packaging_611` | issue | 2026-08-20 | 13 lines, 1 file | 1 | 0.5 s | both | Easy (34.0) | C2 / GEN / P4 | top 5 | not in top 9 | new feature, name given in the title | Feature route; the title and the body of the issue suggest two different function names |
| 3 | `packaging_1316` | issue | 2026-07-06 | 8 lines, 1 file | 1 | 1.8 s | reference | Easy (24.8) | C1 / GEN / P2 | top 5 | not in top 9 | round-trip / serialisation | The string form of a marker parses back with another precedence; long test file |
| 4 | `packaging_1299` | issue | 2026-06-26 | 13 lines, 1 file | 3 | 4.9 s | neither | Easy (28.4) | C5 / RTG / P8 | not found | not in top 9 | error-message contract | Keyword trap: the title starts with documentation, so the helper's rules send it to the docs route |
| 5 | `packaging_1346` | issue | 2026-07-28 | 28 lines, 1 file | 5 | 0.6 s | neither | Medium (38.4) | C1 / GEN / P3 | top 5 | top 1 | terse feature request | Under 260 characters; the name to add is only guessed at in the text |
| 6 | `packaging_1244` | pr | 2026-07-07 | 5 lines, 1 file | 1 | 0.4 s | both | Easy (24.9) | C4 / CON / P7 | top 5 | top 3 | unhandled input class (bool is an int) | Keyword trap: reject in the title sends a bug fix to the behaviour-change route |
| 7 | `packaging_1341` | pr | 2026-07-20 | 2 lines, 1 file | 1 | 0.4 s | both | Easy (26.8) | C4 / GEN / P7 | top 5 | not in top 9 | regex anchor | Keyword trap again; the title contains a backslash literal; under 220 characters |
| 8 | `packaging_1187` | commit+changelog | 2026-05-27 | 4 lines, 1 file | 19 | 0.6 s | both | Easy (32.7) | C1 / GEN / P3 | top 5 | top 1 | ordering / priority change | Commit message plus changelog as the statement; under 200 characters |
| 9 | `click_3299` | issue | 2026-04-08 | 2 lines, 1 file | 1 | 0.9 s | both | Easy (22.4) | C1 / VAL / P2 | top 5 | top 1 | wrong assumption about type | A third-party Version object as a default; traceback in the issue |
| 10 | `click_3434` | issue | 2026-05-16 | 8 lines, 1 file | 7 | 0.2 s | both | Medium (36.0) | C1 / GEN / P2 | top 5 | top 1 | unhandled empty input | A formatter called without arguments; expected output is printed in the issue |
| 11 | `click_3739` | issue | 2026-08-14 | 2 lines, 1 file | 4 | 0.6 s | both | Easy (28.7) | C1 / TYP / P2 | top 5 | top 1 | platform-specific return type | Binary versus text file on Windows; the issue quotes the offending lines |
| 12 | `click_3208` | issue | 2026-04-29 | 6 lines, 1 file | 3 | 0.3 s | reference | Easy (31.4) | C1 / GEN / P2 | top 5 | top 8 | wrong logic | Help lookup picks the wrong command; the reproduction lives behind an offline link |
| 13 | `click_3211` | issue | 2026-05-08 | 15 lines, 1 file | 1 | 0.3 s | neither | Easy (30.8) | C1 / GEN / P2 | top 5 | not in top 9 | exception type contract | Behaviour change requested as a bug; no baseline agent solved it |
| 14 | `click_3642` | pr | 2026-07-02 | 3 lines, 1 file | 1 | 0.3 s | neither | Easy (29.5) | C1 / GEN / P3 | not found | not in top 9 | type comparison | Under 220 characters; the localizer does not find the file; no baseline agent solved it |
| 15 | `more_itertools_1193` | issue | 2026-06-30 | 3 lines, 1 file | 1 | 3.6 s | tuned | Easy (18.8) | C1 / GEN / P2 | top 5 | top 1 | unhandled empty input | IndexError on an empty argument list; smallest fix of the set |
| 16 | `more_itertools_1276` | issue | 2026-09-17 | 13 lines, 1 file | 2 | 4.1 s | tuned | Easy (26.7) | C1 / GEN / P2 | top 5 | top 5 | boundary / precision | Reverse iteration of a float range changes length and values |
| 17 | `more_itertools_1278` | issue | 2026-09-14 | 15 lines, 1 file | 1 | 4.1 s | reference | Easy (27.7) | C1 / GEN / P2 | top 5 | top 1 | iterator protocol | An iterable that can be opened only once |
| 18 | `more_itertools_1279` | pr | 2026-09-14 | 14 lines, 1 file | 4 | 4.0 s | reference | Medium (35.8) | C1 / RTG / P3 | top 5 | top 1 | falsy value taken as missing | The most common bug family of the public set: an exception object that evaluates to False |
| 19 | `more_itertools_1260` | pr | 2026-09-18 | 6 lines, 1 file | 3 | 6.1 s | both | Medium (36.6) | C1 / OBJ / P3 | top 5 | top 2 | duck typing (index protocol) | Validation of integer-like objects; the fix sits in recipes.py, not in more.py |
| 20 | `more_itertools_1270` | pr | 2026-09-10 | 4 lines, 1 file | 1 | 4.2 s | tuned | Easy (27.3) | C1 / GEN / P3 | top 5 | top 1 | boundary (zero and negative) | A limit of zero is silently ignored |

### 3.1 What the mix looks like

| Property | Result on P20 |
| --- | --- |
| Tasks solved by both baseline agents (tuned agent in two runs, organizers' reference agent) | 9 of 20 |
| Tasks solved by the tuned agent only | 3 of 20 |
| Tasks solved by the reference agent only | 4 of 20 |
| Tasks solved by neither | 4 of 20 |
| Statements that are the closed issue | 13 of 20 |
| Statements that are the pull-request description | 6 of 20 |
| Statements that are a commit message with changelog | 1 of 20 |
| In the set's own `issue` split | 13 of 20 |
| Helper routes with a mechanical brief: P2 10, P3 6, P4 1, P7 2, P8 1 | 20 |
| Harness difficulty tiers: Easy 15, Medium 5 | 20 |
| Gold patch touches one file | 19 of 20 |
| Source lines changed: median 8, smallest 2, largest 28 | 20 |
| Slowest gold test file | 6.1 s |
| Gold file in the helper's top 5 (dry run) | 18 of 20 |
| Gold function among the helper's top 9 symbols (dry run) | 14 of 20 |
| Created between 2026-04-08 and 2026-09-18 | 20 |

### 3.2 How to read the table

**Bug families.** Nine tasks belong to the "unhandled input class" family that makes up 47.8 percent of the bug fixes in the public set (Document 01 of the 2026-11-23 package): an empty argument list (`more_itertools_1193`, `click_3434`), a zero limit (`more_itertools_1270`), a `bool` where an integer was expected (`packaging_1244`), a third-party object used as a default (`click_3299`), a version string with a trailing plus (`packaging_1179`), a file name that ends with a newline (`packaging_1341`), an exception object that evaluates to False (`more_itertools_1279`), and bytes compared with a string (`click_3642`). Of the other eleven, two are feature requests (`packaging_611`, `packaging_1346`), three are contract errors about an error message, an exception type and a return type (`packaging_1299`, `click_3211`, `click_3739`), three are round-trip or protocol errors (`packaging_1316`, `more_itertools_1278`, `more_itertools_1260`), one is a precision error at a boundary (`more_itertools_1276`), one is a wrong lookup (`click_3208`) and one changes an ordering (`packaging_1187`).

**Statement style.** Thirteen statements are closed issues: twelve of 362 to 3,413 characters and the short `packaging_1346` (252 characters). Four statements are short texts of 195 to 252 characters (`packaging_1187`, `packaging_1341`, `click_3642`, `packaging_1346`), and one carries a traceback (`click_3299`). The short ones exist on purpose: they exercise the procedure for statements that give the model little to search with, which is how 36 percent of the public statements look.

**Pull-request statements carry fix details.** The paper behind the set reports that replacing an issue with its pull-request description raised the tuned agent's resolve rate from 22 to 32 percent on the same 167 tasks. `packaging_1244` shows why: its text says "`_get` used `isinstance(valu...`". Six of the twenty statements are of this kind; when a task is solved, check whether its statement gave the fix away before treating it as evidence of reasoning.

**Three tasks are traps for the helper's keyword rules.** `packaging_1299`, `packaging_1244` and `packaging_1341` are ordinary bug fixes whose titles contain the words "documentation" or "reject". The 2026-11-23 rules read those words as "documentation change" and "behaviour change" and send the solver to the docs route and the sweep route. Each title also contains a bug-fix word ("error", "fix"), so the 2026-11-24 patched helper, which tries the bug-fix rule first, routes them correctly; they stay in P20 as a check that this holds with the model, because the planner's own `kind:` line also overrides the keyword category.

---

## 4. Selection rules

The rules below produce P20 from the FreshSWE-Py task rows and are reproducible with `tools/build_portfolio.py`.

1. **Post-release only.** Keep tasks whose `created_at` is after the model's release. All 663 qualify.
2. **Repositories.** Keep repositories with zero runtime dependencies whose owner and subject are unrelated to the public four. That removes, among others, `fastapi/typer`, `fastapi/sqlmodel`, `encode/uvicorn`, `Textualize/textual`, `urllib3/urllib3` and the two Pallets web libraries.
3. **No asynchronous code.** Remove the 5 tasks whose reference patch touches `async` code (2 in strawberry, 3 in tenacity), because the organizers stated that no scored task touches an `async def` function ([thread 745998](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/745998)).
4. **Fast tests.** Keep tasks whose gold test file runs in at most 10 seconds, so the helper's `test` command (45 seconds by default) returns a verdict inside its timeout.
5. **Real statements.** Prefer the closed issue; add pull-request descriptions and one commit message to cover the other statement styles; drop statements that are noise ("Merge stable into main", "Stable").
6. **Size.** Keep fixes of one or two source files and at most about 30 changed lines, which matches the single-file share of the public set (70.5 percent) and leaves the multi-file route to the public panel.
7. **Difficulty spread.** Aim for about half of the tasks solved by both baseline agents and half solved by one or neither, so that the panel can move in both directions.
8. **Coverage of brain procedures.** Make sure the set contains the repro-driven route, the route for short statements, the feature route, falsy-value and empty-input bugs, a regex edit with a backslash literal, and at least two of the keyword traps.

---

## 5. The confirmation panel B40

Reserve after removing P20 and the alternates: 119 tasks, of which 107 pass the usability filter (gold test file at most 10 s, statement not a bare commit message, at least 150 characters, title not Merge or Stable).

| Confirmation panel B40 | Value |
| --- | --- |
| Tasks | 40 |
| Per repository | `pypa/packaging` 20, `pallets/click` 12, `more-itertools/more-itertools` 8 |
| Statement source | issue 11, pull-request description 29, commit with changelog 0 |
| Solved by both baseline agents | 14 |
| Tuned only | 7 |
| Reference only | 3 |
| Neither | 16 |
| Created between 2026-04-05 and 2026-09-21 | |

Tasks: `packaging_1146`, `packaging_1141`, `packaging_1099`, `packaging_1125`, `packaging_1150`, `packaging_1168`, `packaging_1206`, `packaging_1234`, `packaging_1255`, `packaging_1245`, `packaging_1271`, `packaging_1276`, `packaging_1266`, `packaging_1240`, `packaging_1265`, `packaging_1320`, `packaging_1327`, `packaging_1334`, `packaging_1351`, `packaging_1362`, `click_3235`, `click_3244`, `click_3328`, `click_2969`, `click_3126`, `click_3405`, `click_3653`, `click_3581`, `click_3681`, `click_3704`, `click_3764`, `click_3777`, `more_itertools_1157`, `more_itertools_1158`, `more_itertools_1200`, `more_itertools_1211`, `more_itertools_1216`, `more_itertools_1223`, `more_itertools_1251`, `more_itertools_1269`

The draw is stratified by baseline outcome (45 percent solved by both agents, 30 percent by one, 25 percent by neither, as far as each repository allows) with the fixed seed 20261125, so it can be regenerated exactly. It is harder than P20 because P20 and the alternates already took the easiest issue statements.

---

## 6. Alternates

Each alternate is interchangeable with a task of the same repository. The four `pluggy` and three `humanize` tasks also serve as the first choices if one of the three anchors is to be swapped.

| Alternate | Repository | Statement | Created | Fix size | Solved by | Helper route (dry run) | What it is |
| --- | --- | --- | --- | ---: | --- | --- | --- |
| `packaging_1218` | `pypa/packaging` | pr | 2026-06-05 | 2 lines | both | P2 | URL auth stripping with @ in a password |
| `packaging_1232` | `pypa/packaging` | pr | 2026-06-15 | 15 lines | both | P2 | hash inconsistent with equality (object protocol) |
| `packaging_1328` | `pypa/packaging` | pr | 2026-07-11 | 8 lines | both | P3 | exception classes that cannot be pickled |
| `packaging_1224` | `pypa/packaging` | issue | 2026-06-29 | 36 lines | neither | P3 | maximum number of tags (unresolved, 5 hunks) |
| `click_3363` | `pallets/click` | issue | 2026-04-28 | 23 lines | neither | P2 | flag_value passed through ParamType.convert |
| `click_3769` | `pallets/click` | issue | 2026-08-15 | 8 lines | neither | P2 | progress bar at full completion |
| `click_3364` | `pallets/click` | pr | 2026-04-28 | 5 lines | tuned | P3 | string values from default_map for multi-value parameters |
| `more_itertools_1285` | `more-itertools/more-itertools` | issue | 2026-09-17 | 13 lines | reference | P4 | bucket() adds a phantom key |
| `more_itertools_1305` | `more-itertools/more-itertools` | pr | 2026-09-29 | 5 lines | both | P3 | ichunked for n=0 and negative n |
| `more_itertools_1253` | `more-itertools/more-itertools` | pr | 2026-09-04 | 12 lines | reference | P2 | split with maxsplit 0 |
| `pluggy_752` | `pytest-dev/pluggy` | issue | 2026-10-14 | 5 lines | both | P3 | register(None) breaks devpi |
| `pluggy_731` | `pytest-dev/pluggy` | pr | 2026-09-23 | 3 lines | both | P7 | reject PluginManager.register(None) |
| `pluggy_741` | `pytest-dev/pluggy` | issue | 2026-09-25 | 32 lines | neither | P3 | register leaves partial state after a validation failure |
| `humanize_334` | `python-humanize/humanize` | issue | 2026-08-29 | 10 lines | neither | P2 | naturaldelta on float inf |
| `humanize_329` | `python-humanize/humanize` | pr | 2026-06-30 | 6 lines | tuned | P2 | naturalsize rounding at unit boundaries |
| `humanize_318` | `python-humanize/humanize` | pr | 2026-05-22 | 2 lines | both | P2 | natural_list of an empty list |

All 16 went through the same checks as P20: their gold patches apply through the helper's editor byte-identically to `git apply`, and the rows above carry the same dry-run and baseline figures (`portfolio/alternates.tsv`).

---

## 7. Other held-out sets, and how to use them

Four sets in the competition's own task format were published by competitors. None contains a task of the four public repositories.

| Set | Tasks and repositories | Created | Gate claimed by the author | Environment | Size on Kaggle | Downloads on 2026-11-25 | Role here |
| --- | --- | --- | --- | --- | --- | ---: | --- |
| FreshSWE-Py v6 | 663 tasks, 33 repositories | 2026-04-02 to 2026-10-18 | Fails, passes, passes again under the scorer's test rules | Docker image `freshswe-sandbox` with an offline wheelhouse; drop-in for `swegemma eval` | 6.97 GB | 99,851 | Base of P20 and B40 |
| OOD-45 | 45 tasks, 17 projects | fixes merged 2026-09-18 to 2026-10-03 | Gold resolves and base fails 3 of 3, on two platforms | Subprocess sandbox with the set's own runner that installs wheels | 5.62 GB | 25,285 | Cross-check with leakage-audited statements |
| OOD-B pilot | 82 tasks, 70 repositories | 2025-11-14 to 2026-05-11 | Gold resolves in four runs, empty patch does not | Same layout as OOD-45 | 9.78 GB | 349 | Cross-check with organic issue text |
| OOD-C | 186 tasks, 148 repositories | 2025-01-03 to 2026-05-05 | Agent path runs on all 186; 58 gradable with Python 3.13 | Same layout as OOD-45 | 15.65 GB | 2,952 | Source of far-transfer probes; filter on gradable |

Sources: the Kaggle metadata API and each set's own README, read on 2026-11-25.

**Why FreshSWE-Py and not OOD-45 as the base.** OOD-45 is the better-audited set: its statements were rewritten as user reports and checked for fix material, and its gate ran on the harness's Docker image. It is less suited as the main panel for three reasons. Every statement carries a reproduction, so every task takes the repro-driven route and the routes for short statements and features are never exercised. Its fixes are small (median 6 lines) and the harness's difficulty engine calls 89 percent of them Easy. And no repository has more than 4 unflagged tasks, so there is no per-repository depth.

**A cross-check panel (optional).** If a change looks good on P20, six unflagged OOD-45 tasks in six other repositories make a cheap second opinion: `cachetools_424` (the fastest task found: a 0.7 s test file in a 37-file repository), `tox_4094`, `pint_2437`, `great_tables_895`, `nox_1188` and `pdm_3902`. Three of them (`pint_2437`, `nox_1188`, `pdm_3902`) are tasks on which the helper's rules pick a wrong procedure (Document 05, Section 4), which is precisely what makes them informative.

---

## 8. What P20 does not cover

| Gap | Why it matters | Where it is covered instead |
| --- | --- | --- |
| Only one clear feature request | Features are 14 percent of the public set | The public 30-task panel of Document 03 (2026-11-23 package); `more_itertools_1285` among the alternates |
| One two-file fix | Multi-file fixes score far lower for small agents | The public panel; B40 has 7 fixes in more than one file and 15 of more than 30 lines |
| Small repositories (30 to 109 text files; 4 to 38 non-test Python files) | The scored repositories are private and their size is unknown | OOD-B tasks in larger repositories (`pyinfra`, `sqlglot`, `briefcase`) |
| Statements mostly long | 36 percent of the public statements are under 250 characters | Four short statements in P20; `PyCQA/isort` (32 terse commit statements) as a swap repository |
| No asynchronous code | By design, as on the scored set | The public FastAPI tasks |
| Easier per changed line than the public tasks | FreshSWE-Py's own paper: use it to rank agents, not to forecast a leaderboard score | Treat P20 scores as relative |
| Baselines ran FP4 weights on a fast hosted endpoint | The "solved by" column is a difficulty guide, not a prediction for the QAT model on 4x L4 | Document 06: pad the local run to the scorer's decode speed |
| Popular set | About 100,000 downloads; it is held out from your tuning, not from other teams | Keep B40 untouched; or mine fresh tasks with the recipe in Document 04 |

---

## 9. Not verified

| Not verified | Why |
| --- | --- |
| Any run of the BCF bundles on P20 | No model endpoint was available in this run; the helper was tested without the model |
| The gold and empty-patch gate of P20 in your own sandbox | The set's gate is the author's; re-run it locally before the first agent run (Document 04, Section 3) |
| The exact release date of Gemma 4 | Community sets give 2026-03-31 and 2026-04-02; the official model card fetched for this report prints no date. Every P20 task is at least six days after the later of the two |
| The licence of every task row | Task content keeps its repository's licence (MIT, BSD-2, BSD-3 or Apache-2.0 for the three anchors, per the set's README); check before redistributing the rows |
| The dependency claims in Document 02 for repositories outside the GitHub survey | They are assessments, marked as such |
