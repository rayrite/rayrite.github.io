# Validation results and submission playbook

**Prepared:** 2026-11-24. **Scope:** what was tested on the BCF brain code, with what result, and how to reproduce it and carry it to a submission. Every figure in this document was read from the result files produced by the test runs; nothing was typed from memory.

---

## 0. Summary

| Check | Result |
|---|---|
| Helper tests | 37 tests: 36 pass in the standard run, and the optional real-snapshot test passes on two real checkouts |
| Editor fidelity | All 129 published fixes applied through the helper's editor on the real snapshots: 129 of 129 byte-identical to `git apply` |
| Localizer | Gold-touched file in the top 9 for 96 of 129 tasks on real repositories |
| Bundles | 6 of 6 compile with the official harness compiler |
| Validator | 15 of 15 deliberately broken bundles rejected |
| Model runs | None. The helper was tested without Gemma 4; how the model uses it is unmeasured |

---

## 1. Environment

| Item | Value |
|---|---|
| Machine | Windows 11, Python 3.12.10 for the tests and the build |
| Harness packages | `adk-submission` 0.2.13, `adk-eval-core` 0.1.0, `swegemma` 0.2.11 and `google-adk` 1.36.1, taken from the public wheelhouse (dataset version 31, downloaded 2026-11-23) and installed into an isolated virtual environment; the compiler was run with the harness's own `build_submission_limits()` and with stand-in tools and model aliases |
| Data | The 129 published tasks and their repository snapshots, indexed from the 21.9 GB competition zip into a content-addressed store (98 MB of text files) |
| Not available | A Gemma 4 model endpoint, the 4xL4 scorer, and the scoring sandbox |

---

## 2. Helper tests

`bcf-brain/tests/test_bcf.py`, standard library only. Each test creates a temporary Git repository with a small package, installs the helper into it and drives it through the command line exactly as the agent will.

| Test class | Tests | Covers |
| --- | ---: | --- |
| `T01Install` | 1 | first install prints the map and starts the clock; a second call reports a re-entry |
| `T02Read` | 5 | repository map; search by arguments and by heredoc; empty and no-hit queries; outline, line-window and grep; output cap |
| `T03Apply` | 11 | exact match; whitespace and indentation tolerance; several blocks all-or-nothing; ambiguous search refused; closest-lines hint; syntax error writes nothing; line-range replace, insert, delete; new file and whole-file put; truncated block ignored; protected paths refused; a missing heredoc never blocks |
| `T04Verify` | 3 | repro fails before the fix and passes after; a script that passes before any edit is flagged; timed-out script; test runner reports the true exit status and refuses a whole suite |
| `T05Hygiene` | 5 | check reverts test and configuration files; check reports a syntax error; finalize removes scratch files and keeps intended ones; finalize with no change; status, resume and note |
| `T06Spec` | 3 | plan builds and stores the baton, spec prints it with progress, installer re-entry; every route; spec without a plan |
| `T07Governor` | 3 | freeze refuses edits and names the next command; hard stop; urgent status before a first edit; every error path exits with status 0 |
| `T08Installer` | 4 | installer run from a folder that holds only the skill files; repository found by walking up; failure reported with exit 0; helper missing next to the installer |
| `T08RealSnapshot` | 1 | install and search on a real materialised checkout (optional, enabled with an environment variable) |
| `T09LineEndings` | 1 | an edit to a CRLF file keeps CRLF and produces a one-line diff |
| Total | 37 |  |

To run: `python -m unittest tests.test_bcf -v` from the `bcf-brain` folder. The real-snapshot test is enabled by setting `BCF_TEST_SNAPSHOT` to a repository checkout.

---

## 3. Editor fidelity: replay of the published fixes

The editor is the part of the brain that must never corrupt a file, so it was tested against real upstream patches rather than only against hand-written cases. For each of the 129 tasks the repository snapshot was materialised, the helper installed, the published fix converted into search/replace blocks (three lines of context, as the version control tool produces them) and applied with `apply`; newly created files went through `put` and deleted files through `rm`. The result was then compared byte for byte with `git apply` of the same patch on a clean checkout. Where a search block was ambiguous, the context was widened to 6, 12 and 25 lines, and a file with repeated blocks was edited through the line-range form - the same recovery the solver prompt prescribes.

| Measure | Value |
| --- | --- |
| Tasks replayed | 129 |
| Gold files and hunks | 278 files, 695 hunks |
| Applied by the helper without error | 129 of 129 |
| Byte-identical to `git apply` | 129 of 129 |
| Files that needed search context wider than three lines | 4: `fastapi_14609` params.py (12); `fastapi_14371` params.py (12); `fastapi_14605` exceptions.py (12); `fastapi_14605` temp_pydantic_v1_params.py (6) |
| Files that needed the line-range form | 1: `fastapi_14609` fastapi/param_functions.py |
| Files skipped as non-text | 0 |

Two notes on reading the table. The dataset's patches carry no file header, so `git apply` empties a deleted file while the helper removes it; both were counted as agreement because the upstream commit deleted the file. The helper refuses an edit whose search text matches more than one place; that refusal is deliberate and is what kept four of the 278 files from applying on the first attempt.

---

## 4. Localizer evaluation

The localizer was run against all 129 real snapshots through an in-memory store, with terms extracted mechanically from each problem statement (identifiers, quoted literals, paths and title words). This imitates a weak planner; a model-written term list should do better.

By repository, and by statement level:

| Repository | Tasks | Gold file in top 5 | Gold file in top 9 | Gold function in top 3 | Gold function in top 9 |
| --- | ---: | ---: | ---: | ---: | ---: |
| fastapi | 67 | 38/67 | 56/67 | 22/63 | 28/63 |
| rich | 48 | 15/48 | 27/48 | 14/45 | 16/45 |
| requests | 13 | 2/13 | 12/13 | 6/12 | 8/12 |
| httpx | 1 | 1/1 | 1/1 | 0/1 | 1/1 |
| All | 129 | 56/129 | 96/129 | 42/121 | 53/121 |

| Statement level | Kind | Tasks | Gold file in top 5 | Gold file in top 9 | Gold function in top 3 | Gold function in top 9 |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| L1 | prescriptive | 12 | 9/12 | 11/12 | 4/12 | 5/12 |
| L2 | descriptive | 70 | 30/70 | 57/70 | 23/64 | 31/64 |
| L3 | title and link | 27 | 9/27 | 16/27 | 11/27 | 11/27 |
| L4 | title only | 20 | 8/20 | 12/20 | 4/18 | 6/18 |

How the localizer improved during the work:

| Version | Change | Gold file in top 5 | Gold file in top 9 |
| --- | --- | ---: | ---: |
| v1 | term counts, no rarity weighting | 47/129 | 80/129 |
| v2 | rarity weighting and direct path matching | 47/129 | 95/129 |
| v3 and final | plus a size penalty so focused functions outrank large classes; source files scanned first | 56/129 | 96/129 |

A search took median 0.39 s, maximum 1.02 s per repository in memory.

---

## 5. Bundles under the official compiler

`bcf-brain/tools/validate_official.py` calls the harness's own `compile_submission()` with the harness's own limits, then renders every instruction with the framework's own templating code under two state shapes: the planner's state, which holds only the issue, and the solver's state, which also holds the baton. It then checks what the compiler does not: skill name and frontmatter, the four integer budgets, the per-task cap, tools with list arguments, file extensions, tab characters and byte-order marks.

| Bundle | Track and topology | Files | Bytes | Solver prompt (characters) | Planner prompt (bytes) | Helper (bytes) | Official compiler |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- |
| `bcf-31b-sequential` | 31B relay | 11 | 74,406 | 5,585 | 2488 | 59,029 | PASS (0 failures, 1 warnings) |
| `bcf-31b-flat` | 31B flat | 7 | 71,808 | 6,524 | - | 59,029 | PASS (0 failures, 1 warnings) |
| `bcf-31b-noskill` | 31B no-skill | 4 | 4,862 | 4,054 | - | - | PASS (0 failures, 1 warnings) |
| `bcf-e4b-sequential` | E4B relay | 11 | 70,288 | 2,799 | 1157 | 59,029 | PASS (0 failures, 0 warnings) |
| `bcf-e4b-flat` | E4B flat | 7 | 68,425 | 3,141 | - | 59,029 | PASS (0 failures, 1 warnings) |
| `bcf-e4b-noskill` | E4B no-skill | 4 | 2,806 | 1,998 | - | - | PASS (0 failures, 0 warnings) |

The validator's warning on four bundles is advisory: the solver instruction is longer than 2.6 KB.

### 5.1 Negative controls

A validator is only as good as the defects it rejects, so fifteen broken copies of a good bundle were presented to it.

| Broken copy | Why it was rejected |
| --- | --- |
| `skill_name_with_underscore` | FAIL skill directory is lowercase kebab-case: bcf_spec |
| `root_has_model_key` | FAIL compile_submission raised SubmissionSchemaError: Submission schema validation failed: 1 validation error for Sandb |
| `root_has_instruction_key` | FAIL compile_submission raised SubmissionSchemaError: Submission schema validation failed: 1 validation error for Sandb |
| `unknown_tool` | FAIL compile_submission raised ToolNotFoundError: Tool 'web_search' not found in registry. Available tools: edit_file, |
| `graph_tool_list_argument` | FAIL no list-argument tools attached (parser-hang hazard): ['get_code_subgraph'] |
| `prompt_bare_brace_variable` | KeyError: 'Context variable not found: `filename`.' |
| `strict_bcf_spec_var_missing_state` | KeyError: 'Context variable not found: `bcf_spec`.' |
| `unknown_model` | FAIL compile_submission raised ModelNotFoundError: Model alias 'gemma-3-27b-it' not found in registry. Available models |
| `missing_include_file` | FAIL compile_submission raised SubmissionValidationError: !include file not found: <path> |
| `eval_null_budget` | FAIL eval_config.max_tool_calls is a positive integer (got None) |
| `eval_15_minute_cap` | FAIL max_time_minutes <= 8 (largest per-task cap with public evidence of finishing: got 15) |
| `eval_file_removed` | FAIL eval_config.yaml present (explicit budgets; unset = 60 min/task) |
| `disallowed_extension` | FAIL allowed extension: notes.txt.bak |
| `tab_in_prompt` | FAIL no tab characters: prompts\solver.md |
| `frontmatter_colon_unquoted` | FAIL SKILL.md frontmatter parses: bcf-spec (ScannerError: mapping values are not allowed here |

The control `strict_bcf_spec_var_missing_state` is the reason the solver instruction uses the optional form: with the strict `{bcf_spec}`, the first model call of every task would raise the error shown.

---

## 6. Speed on real checkouts

Measured on materialised snapshots with a cold and a warm file cache.

| Checkout | Text files | Install (s) | Search, first run (s) | Search, second run (s) | Plan step (s) | Search output (characters) | Time cap reached |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | --- |
| fastapi_15763 | 1322 | 0.70 | 1.38 | 1.11 | 1.08 | 1641 | no |
| fastapi_15763 | 1322 | 0.71 | 1.12 | 1.08 | 1.11 | 1813 | no |
| rich_4079 | 509 | 0.58 | 0.86 | 0.74 | 0.79 | 1456 | no |
| rich_4079 | 509 | 0.58 | 0.54 | 0.52 | 0.54 | 1837 | no |

The scorer has two virtual CPUs and the repository is extracted shortly before the task, so these times are indicative, not measurements of the scorer.

---

## 7. Defects found and fixed during development

Recorded because each one would have reached the submission unnoticed without a specific check.

| Defect | How it was found | Fix |
|---|---|---|
| The editor's block parser never matched a block, so no edit applied | First test run | The block accumulator was flattened by an earlier edit; restored |
| Commands that read standard input hung when no heredoc was supplied | Tests timed out | Input is read on a thread with a timeout; the helper always exits |
| Test run times reported as about half the true value | The installer printed a wrong elapsed time | Clock started at the right moment |
| Messages contained absolute Windows paths | Test assertions | Repository-relative paths everywhere |
| An edit to a CRLF file converted the whole file to LF | Found while designing the replay | Line-ending style detected and preserved; covered by a test |
| Search stopped after 8 seconds on a cold disk and had not reached all source files | Real-snapshot test on a 1,322-file checkout | Source files are scanned first, with a longer cap |
| The replay harness counted "NOT APPLIED" as applied, which produced a false "129 of 129 applied" | Inspecting the four tasks whose result differed from `git apply` | Success is now matched at line start. With that correction three tasks (`fastapi_14371`, `fastapi_14605`, `fastapi_14609`) turned out to be refused by the editor, correctly, because their search text matched more than one place. The widening and line-range recovery routes were then added to the replay, as the solver prompt prescribes them, and the final result is 129 of 129 applied and identical |
| The brain never emitted two of its ten routes | Cross-reading the document against the code | Routes for schema and compatibility tasks added to the helper and to the solver prompt |
| An unquoted colon in a bundle description made the YAML unparsable | The official compiler | Description quoted; the bundle would have scored 0.00 |
| A helper source file was emptied by a failing patch script | The build stopped compiling | The helper is assembled from its parts with compile check, atomic replace and a backup |

---

## 8. What was not validated

| Not validated | Why it matters | How to close it |
|---|---|---|
| Whether the planner makes the two calls and relays the baton verbatim | The relay depends on it | Run 30 tasks locally and count batons that match the stored baton |
| Whether the solver follows the route and calls `finalize` and `submit_patch` | Determines whether edits reach the grader | Inspect the per-task traces |
| Mean seconds per task | A run over 12 hours scores zero | Read it from the same local runs before the first submission |
| The sequential relay against the flat twin | The relay is the unproven part of the design | Paired panel runs (Document 02, Section 10.3, hypothesis H1) |
| Skill-script execution on the scorer | One team's skill-only bundle scored 0.00 | First submission of a skill-carrying bundle; the no-skill bundle is the fallback |
| The E4B bundles with the E4B model | All E4B settings come from other teams' measurements | Same protocol with the E4B model |

---

## 9. Proposed evaluation panel

The leaderboard cannot rank bundles that differ by two tasks, so bundles have to be ranked locally first. The panel below holds the 30 tasks that an agent can address: specification gap none or minor, difficulty 3 or less, and gradable in the public sandbox. They were drawn evenly from the 52 tasks that satisfy these rules, in proportion to each repository's share (fastapi 16, rich 11, requests 3).

| Task | Repo | Category | Sub-category | Route | Difficulty | Spec gap | Statement level | What it asks |
| --- | --- | --- | --- | --- | ---: | --- | --- | --- |
| `fastapi_11194` | fastapi | C1 | VAL | P2 | 2 | none | L2 | Use each field's own File info when extracting multipart bodies |
| `fastapi_13537` | fastapi | C1 | VAL | P1 | 2 | none | L2 | Track visited form fields so empty strings fall back to None defaults |
| `fastapi_14297` | fastapi | C1 | VAL | P1 | 1 | none | L1 | Unwrap Optional unions in serialize_sequence_value so optional file lists |
| `fastapi_14356` | fastapi | C1 | VAL | P2 | 2 | minor | L1 | Keep all repeated values for extra Query and Header model fields |
| `fastapi_14430` | fastapi | C1 | TYP | P3 | 3 | minor | L2 | Optional sequences declared with PEP 604 pipe union crash serialization |
| `fastapi_14463` | fastapi | C1 | OAS | P2 | 2 | none | L1 | Stop duplicate anyOf refs when app-level Union responses also declare cont |
| `fastapi_14616` | fastapi | C1 | VAL | P2 | 2 | none | L1 | Fix Json-wrapped list Form/Query params being misread as multi-value |
| `fastapi_14873` | fastapi | C1 | RTG | P2 | 2 | minor | L2 | Fix on_startup handlers wiped by Starlette Router init order |
| `fastapi_15763` | fastapi | C1 | RTG | P3 | 3 | minor | L2 | Empty leaf path with nested prefix must not raise |
| `fastapi_9425` | fastapi | C1 | TYP | P1 | 2 | none | L4 | Treat stringified 'None' return annotation as None so 204 works |
| `fastapi_15785` | fastapi | C2 | RTG | P4 | 3 | minor | L2 | Add public iter_route_contexts for code that walked router.routes |
| `fastapi_9753` | fastapi | C2 | DI | P4 | 3 | minor | L2 | Make functools.partial dependables work for every callable kind |
| `fastapi_14791` | fastapi | C4 | OAS | P5 | 2 | minor | L2 | Add input and ctx fields to OpenAPI ValidationError schema |
| `fastapi_15588` | fastapi | C4 | SER | P1 | 2 | minor | L2 | Reject multi-line SSE event and id fields |
| `fastapi_14492` | fastapi | C5 | EXM | P8 | 1 | none | L4 | Correct docs metadata example license identifier to Apache-2.0 |
| `fastapi_14077` | fastapi | C6 | CMP | P1 | 2 | none | L2 | Use literal 422 instead of deprecated Starlette status constant |
| `requests_6629` | requests | C1 | OBJ | P1 | 2 | none | L2 | Make JSONDecodeError picklable by delegating __reduce__ to the JSON parent |
| `requests_7309` | requests | C1 | NET | P1 | 1 | minor | L2 | Skip Content-Type parameters lacking equals instead of emitting True senti |
| `requests_7427` | requests | C1 | NET | P2 | 3 | minor | L2 | Match no_proxy entries only at domain boundaries, like CPython bpo-39057 |
| `rich_2725` | rich | C1 | REN | P2 | 2 | none | L2 | Render mid box glyphs mid-table and footer glyphs in the footer |
| `rich_3006` | rich | C1 | DBG | P3 | 2 | minor | L2 | Custom __eq__ default equal to Parameter.empty breaks auto rich repr |
| `rich_3067` | rich | C1 | PAR | P3 | 2 | minor | L2 | URL highlighting stops at tilde; add ~ to the url pattern |
| `rich_3278` | rich | C1 | PAR | P2 | 2 | minor | L2 | Strip private-use ANSI escape sequences (ESC 0-?) from decoded text |
| `rich_3454` | rich | C1 | PAR | P1 | 1 | none | L2 | Add @ to url highlighter pattern so @-URLs highlight fully |
| `rich_3506` | rich | C1 | WID | P3 | 2 | minor | L3 | fix Segment._split_cells cutting at wrong cell positions |
| `rich_3521` | rich | C1 | WID | P3 | 3 | minor | L3 | rewrite Segment.split_cells to split exactly on cell boundaries |
| `rich_3718` | rich | C1 | REN | P2 | 3 | minor | L2 | give Panel title and subtitle the panel background style |
| `rich_3882` | rich | C1 | CON | P1 | 1 | minor | L2 | Prompt validation errors print raw markup when console markup is disabled |
| `rich_3905` | rich | C1 | REN | P1 | 1 | none | L2 | Disabled Progress should not print a blank line on non-interactive console |
| `rich_3052` | rich | C2 | CON | P4 | 3 | minor | L2 | Add case_sensitive option to Prompt.ask for case-insensitive choice matchi |

Protocol: three runs per bundle on the same tasks in the same order; a change is adopted when its mean resolved count is higher and it resolves strictly more tasks than it loses across the paired runs; record, per task, the resolved flag, the time of the first edit, the calls used, the refused edits, the tests run, the phase at submission, the nudges and the compactions; and record the mean seconds per task, which multiplied by the task count must stay below about 10 hours.

---

## 10. Reproduction

| Step | Command (from the `bcf-brain` folder unless stated) |
|---|---|
| Assemble the helper from its parts | not needed for use: `src/bcf.py` is the assembled file |
| Build the six bundles and zips | `python build.py` |
| Helper tests | `python -m unittest tests.test_bcf -v` |
| Compile with the official harness | `python tools/setup_validate_venv.py` once, then `python tools/run_validator.py` |
| Check the Markdown tables | `python tools/qc_tables.py <folder>` |

`tools/setup_validate_venv.py` downloads the public wheelhouse (about 870 MB), creates a virtual environment next to the `bcf-brain` folder and installs the four pinned packages. `tools/run_validator.py` validates all six bundles and then runs the negative controls.

The analysis pipeline of Document 01 (feature extraction, snapshot indexing, analysis packs, merge of the coded records, rendering) is in the `analysis/` folder of this deliverable, with the coded records in `data/`.

---

## 11. Submission checklist

| Step | Action | Pass condition |
|---|---|---|
| 1 | `python build.py` | six bundles and six zips, no hygiene error |
| 2 | `python -m unittest tests.test_bcf` | 36 pass, 1 skipped |
| 3 | `python tools/run_validator.py` | 6 of 6 pass, 15 of 15 controls rejected |
| 4 | Local panel run of the bundle to submit | mean resolved known; mean seconds per task at or below about 270 |
| 5 | Inspect three traces by hand | the planner made two calls and relayed the baton; the solver edited through the helper; `finalize` ran before `submit_patch` |
| 6 | Zip the folder contents at the archive root | the archive holds `agent.yaml` at the top level |
| 7 | Submit early in the day | one pending submission at a time; 26-29 hours per attempt |
| 8 | After scoring, read the result size from the submissions page | a normal result is tens of kilobytes; about 3,230 bytes means a backend failure, so resubmit the same file |
| 9 | Choose the two finals by local mean | the private leaderboard is one run |
