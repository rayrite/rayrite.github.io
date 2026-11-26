# Validation results and submission playbook

**Prepared:** 2026-11-24. **Scope:** what was tested on the BCF brain code, with what result, and how to reproduce it and carry it to a submission. Every figure in this document was read from the result files produced by the test runs; nothing was typed from memory.

---

## 0. Summary

| Check | Result |
|---|---|
| Helper tests | [[n_tests]] tests: 36 pass in the standard run, and the optional real-snapshot test passes on two real checkouts |
| Editor fidelity | All 129 published fixes applied through the helper's editor on the real snapshots: 129 of 129 byte-identical to `git apply` |
| Localizer | Gold-touched file in the top 9 for 96 of 129 tasks on real repositories |
| Bundles | 6 of 6 compile with the official harness compiler |
| Validator | [[n_controls]] of [[n_controls]] deliberately broken bundles rejected |
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

[[tests]]

To run: `python -m unittest tests.test_bcf -v` from the `bcf-brain` folder. The real-snapshot test is enabled by setting `BCF_TEST_SNAPSHOT` to a repository checkout.

---

## 3. Editor fidelity: replay of the published fixes

The editor is the part of the brain that must never corrupt a file, so it was tested against real upstream patches rather than only against hand-written cases. For each of the 129 tasks the repository snapshot was materialised, the helper installed, the published fix converted into search/replace blocks (three lines of context, as the version control tool produces them) and applied with `apply`; newly created files went through `put` and deleted files through `rm`. The result was then compared byte for byte with `git apply` of the same patch on a clean checkout. Where a search block was ambiguous, the context was widened to 6, 12 and 25 lines, and a file with repeated blocks was edited through the line-range form - the same recovery the solver prompt prescribes.

[[replay]]

Two notes on reading the table. The dataset's patches carry no file header, so `git apply` empties a deleted file while the helper removes it; both were counted as agreement because the upstream commit deleted the file. The helper refuses an edit whose search text matches more than one place; that refusal is deliberate and is what kept four of the 278 files from applying on the first attempt.

---

## 4. Localizer evaluation

The localizer was run against all 129 real snapshots through an in-memory store, with terms extracted mechanically from each problem statement (identifiers, quoted literals, paths and title words). This imitates a weak planner; a model-written term list should do better.

By repository, and by statement level:

[[localizer]]

How the localizer improved during the work:

[[locversions]]

A search took [[loc_time]] per repository in memory.

---

## 5. Bundles under the official compiler

`bcf-brain/tools/validate_official.py` calls the harness's own `compile_submission()` with the harness's own limits, then renders every instruction with the framework's own templating code under two state shapes: the planner's state, which holds only the issue, and the solver's state, which also holds the baton. It then checks what the compiler does not: skill name and frontmatter, the four integer budgets, the per-task cap, tools with list arguments, file extensions, tab characters and byte-order marks.

[[bundles]]

The validator's warning on four bundles is advisory: the solver instruction is longer than 2.6 KB.

### 5.1 Negative controls

A validator is only as good as the defects it rejects, so fifteen broken copies of a good bundle were presented to it.

[[controls]]

The control `strict_bcf_spec_var_missing_state` is the reason the solver instruction uses the optional form: with the strict `{bcf_spec}`, the first model call of every task would raise the error shown.

---

## 6. Speed on real checkouts

Measured on materialised snapshots with a cold and a warm file cache.

[[bench]]

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

The leaderboard cannot rank bundles that differ by two tasks, so bundles have to be ranked locally first. The panel below holds the [[panel_n]] tasks that an agent can address: specification gap none or minor, difficulty 3 or less, and gradable in the public sandbox. They were drawn evenly from the [[core_n]] tasks that satisfy these rules, in proportion to each repository's share ([[panel_by_repo]]).

[[panel]]

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
