# Task 5 - Does the BCF brain handle what other teams are hitting? Audit, defects found, and the validated fix

**Prepared:** 2026-11-24 (board captured at 06:01 UTC: 378 topics). **Question:** do the six bundles in `2026-11-23_BCF_Brain_and_Dataset_RCA/bcf-brain` behave gracefully when the problems reported on the discussion board happen to them? **Answer in one line:** of 51 issues, 31 were already handled, 9 are partly handled, 6 cannot be influenced by a submission and 2 do not apply; 3 were real defects, and executing the helper against the board's issues found 3 more (one of them a silent data-loss trap). All six are fixed in a validated copy, `bcf-brain-patched/`, next to this document. The original package is untouched.

---

## 0. How the audit was done

| Step | What | Where the evidence is |
| --- | --- | --- |
| 1 Collect | Five board captures (2026-10-31, 11-05, 11-11, 11-20 and today's), the RCA package's pitfall register, and the harness source | `input/kagglecomp/intel_*`, `scratch/2026-11-24-bcf-tuning-parity/board/`, `02_..._Design_and_Justification.md` section 10.5 |
| 2 Reduce | Merge duplicates into 52 issues, grouped by where they bite | Section 1 |
| 3 Check each | Three kinds of evidence, named per row: **source** (read in the pinned harness or Python source), **probe** (the helper was run in a temporary repository: `tools/brain_probe.py`), **reading** (the bundle files) | `bcf-brain-patched/validation/brain_probe_before.txt` |
| 4 Fix | A copy of the brain with a patch that must match every target exactly once and compile before it writes | `patches/bcf-brain-patches.diff`, `tools/apply_brain_patches.py` |
| 5 Validate | Assemble, build, the 37 helper tests, the official compiler, the 15 negative controls, the 129-fix replay, the probe again, and a routing measurement | `bcf-brain-patched/validation/PATCHED-VALIDATION-2026-11-24.md` |

What the audit cannot see: the scorer itself. Issues marked "not controllable" are platform behaviour; issues marked "partly" are reduced by design but unproven on the scorer.

---

## 1. The register

Status before the fix, in capitals: **HANDLED** (the design prevents it and a check shows it), **PARTLY** (reduced, with a named remainder), **FIXED TODAY** (was a defect, is fixed in the patched copy), **NOT CONTROLLABLE** (the platform decides), **NOT APPLICABLE** (the bundles never take that path).

### 1.1 Run level: a mistake here costs the whole submission

| ID | Issue as teams meet it | Evidence | Status | How the brain handles it, or why it cannot |
| --- | --- | --- | --- | --- |
| R1 | A bundle that fails to compile scores 0.00 with the status "complete" and no error; an underscore in a skill name is enough | 758854; source `compile_submission` | HANDLED | The official compiler is run on all six bundles before any submission, with 15 broken copies that must be rejected (probe: 6 of 6 and 15 of 15 today) |
| R2 | An unquoted colon in a YAML description makes the file unparsable | RCA validation report, section 7 | HANDLED | Caught by the compiler check; a control reproduces it for the skill frontmatter |
| R3 | An instruction placeholder naming a variable that is not in the session state raises `KeyError` at the first model call of every task | source `instructions_utils.py` | HANDLED | The optional form `{bcf_spec?}`; the build refuses any other brace expression |
| R4 | Explicit `null` budgets crash the public submit notebook's `int()` parser | 760140 | HANDLED | Four explicit integers in every `eval_config.yaml`; a control |
| R5 | Budgets left unset mean 60 minutes per task and starve later tasks | HARNESS_README 7.1 | HANDLED | Explicit budgets in every bundle |
| R6 | vLLM 0.19.1's tool parser loops forever on a list argument that contains a bracket; the server stops answering and every task after it scores zero | 753973, 759580, 760830 | PARTLY | No tool with a list argument is attached. The remainder: the skill tool's two optional list arguments are in the schema of every agent that declares a skill (the planner in the relay bundles, the single agent in the flat bundles). The no-skill bundles have zero exposure |
| R7 | A byte-identical resubmission scores 0.00 with no error; the result is about 3,230 bytes instead of 60 to 130 KB; staff are investigating | 761004 and three teams in its comments | NOT CONTROLLABLE | Recognise the signature, resubmit the same file, ask for the slot back |
| R8 | "Notebook Threw Exception" with no stage information | 743683, comments of 2026-11-23 | NOT CONTROLLABLE | Nothing in a bundle can produce or prevent it |
| R9 | A run over 12 hours receives no score; 15 minutes and 50 calls per task exceeded it | 760140, 761060, 752017 | PARTLY | Budgets at the largest values with public evidence of finishing, the governor's freeze and hard stop. The remainder: the mean task time has not been measured with the model |
| R10 | A vLLM cold start beyond the 1,200-second allowance ends the submission with an exception | 747519, 752017 | NOT CONTROLLABLE | The bundles ship no adapter, so nothing slows the load |
| R11 | The E2B checkpoint fails to load on the pinned serving stack | 748287, comment of 2026-11-22 | NOT APPLICABLE | The bundles use the 31B and E4B checkpoints |
| R12 | One pending submission blocks the next; 26 to 29 hours end to end; no cancel | 760471, 761259, 761278, 747740 | NOT CONTROLLABLE | Validate before every submission; keep attempts few |
| R13 | The metric bug that allowed improperly high scores was fixed and the affected submissions rescored | 760126 | NOT APPLICABLE | The brain uses no exploit |
| R14 | The wheelhouse moves and a local stack drifts from the scorer | 757782 | HANDLED | Everything is pinned to wheelhouse v31 (still version 31 at 06:13 UTC today); the validator uses the pinned packages |

### 1.2 Model and serving behaviour

| ID | Issue as teams meet it | Evidence | Status | How the brain handles it, or why it cannot |
| --- | --- | --- | --- | --- |
| M1 | Reasoning produced by the model is not carried between tool calls on vLLM 0.19.1 | 744354 | HANDLED | No step relies on remembered thought; the state is in text, on disk |
| M2 | Tool arguments are emitted in alphabetical order, so a long `new_string` is produced before `old_string`; a string ending in a backtick makes the parser drop the next argument | 756051, 758968, 747519 | HANDLED | One command with a single string argument; `edit_file` is not attached; the prompts forbid backticks around values |
| M3 | Tool results were double-JSON encoded; the residual bug writes escaped text literally through `edit_file` and `write_file` | 744272 | HANDLED | Neither tool is attached; a quoted heredoc passes its content unchanged |
| M4 | A long thought plus a long edit is cut off before the tool call closes | HARNESS_README 10.1 | HANDLED | An unclosed block is ignored with a message and nothing is written (probe) |
| M5 | Turning the thought output off multiplies tool-argument errors | 760014 | HANDLED | `include_thoughts` is `true` in every sampling file |
| M6 | Long thinking hurts the small model; too small an output cap doubles its edit errors | 760014, 760595 | PARTLY | E4B: thinking 1,024, output cap 8,192. The remainder is on the 31B track: thinking 4,096 is 164 to 241 seconds per task on the scorer (Task 2, lever 1) |
| M7 | An instruction to compile after each edit is followed on about 24% of edits; 12 of 83 failed runs broke the syntax | 760595 | HANDLED | The compile gate is in the helper, not in the prompt (probe: a replacement that does not compile writes nothing) |
| M8 | The small model edits the right file and submits early | 760595 | HANDLED | The E4B procedure asks for a first edit by call 6 and one verification |
| M9 | A LoRA adapter costs time, can silence the thinking channel, and has no demonstrated gain | 760309, 758968, 759514 | HANDLED | No adapter in any bundle |
| M10 | Elaborate multi-agent decks solve locally and score 0.06 to 0.08; lean prompts win | 760924, 754636 | PARTLY | A single-agent twin exists for each track. The remainder: the 31B solver instruction is 5.6 KB (Task 2, lever 4) |
| M11 | Agents repeat a failed action; a loop of ten or more repeats appears in over a quarter of trajectories | arXiv 2504.21798; 11-11 brief, item C1 | PARTLY | A repeated *identical* replacement is refused; a repeated *failed search block* is refused again but is not recognised as a repeat. Recommendation in section 4 |
| M12 | Temperature 0 is not deterministic for agents; the same bundle scores differently | 760014 | NOT CONTROLLABLE | The evaluation protocol decides on paired runs instead |

### 1.3 Sandbox and tool behaviour

| ID | Issue as teams meet it | Evidence | Status | How the brain handles it, or why it cannot |
| --- | --- | --- | --- | --- |
| S1 | A skill script runs with the working directory set to the skill's own folder, so a search skill finds its own files | 758854, 760886; source `skill_toolset.py` | HANDLED | The installer probes `/workspace` first; the helper itself runs only through `run_command` |
| S2 | A bundle whose only tool was a skill script resolved 40% locally and scored 0.00 twice; unanswered | 758547 | PARTLY | One skill call with no arguments, a no-helper procedure in the prompt, and the no-skill bundles. The Overview page says scripts run in the competition's Docker container with the same file system as `run_command` |
| S3 | Each skill call writes `.adk_exec_<hex>.py` into `/workspace` while it runs | 760886 | HANDLED | The helper's file walk skips it; the harness excludes it from git |
| S4 | A skill script that exits non-zero returns only an error string | source | HANDLED | The installer always exits 0 and prints its problems |
| S5 | File tools refuse paths outside `/workspace`; `write_file("/tmp/x.py")` fails with "Path traversal detected" | 760595 | HANDLED | `write_file` is not attached; the helper stores repro scripts outside the repository itself |
| S6 | A read returns at most 150 lines and 10,000 characters | source | HANDLED | `outline`, `ctx`, `find` replace whole-file reads |
| S7 | Command output is cut at 5,000 characters | source | HANDLED | Helper output is capped at 3,800 |
| S8 | A pipe hides pytest's failing exit code | 760595 | HANDLED | The helper's `test` prints the real status |
| S9 | Scratch files inside the workspace are swept into the patch | HARNESS_README 10.3 | FIXED TODAY | It removed too much: see D1 and D2 in section 2 |
| S10 | Edits to tests and configuration are discarded by the grader | source `verification.py` | FIXED TODAY | Nested test helpers were allowed: see D1 |
| S11 | Tests pass before any fix on about 65% of tasks, so a green test proves nothing | 760014 | PARTLY | A repro must fail first. A plain test file cannot be validated this way |
| S12 | `git stash pop` restores the wrong stash | 760595 | HANDLED | The helper never uses `git stash` |
| S13 | A script in `/tmp` cannot import the repository without `PYTHONPATH` | 760595 | HANDLED | The helper sets `PYTHONPATH` to the repository root for every subprocess it starts |
| S14 | Tests import packages missing from the sandbox, or need a network fixture | 756400, 756587, 757661, 754586 | PARTLY | The prompt says to ignore those failures; the panels exclude the 29 affected tasks and the 2 unsatisfiable ones; the report has a class for them |
| S15 | Five scorer conventions make 24% of correct fixes fail: the anyio plugin disabled, an overwritten `pytest.ini`, every `.py` of a test patch used as a target, skipped-sibling matching, a truncated JUnit report | 757893 | PARTLY | FIXED TODAY for the flags that change a verdict in the helper's own `test` command; the rest is the scorer's behaviour and cannot be influenced |
| S16 | The sandbox is Python 3.13 while the notebook and the harness run 3.12.13 | `docker/Dockerfile.sandbox`; 754586 | FIXED TODAY | The docstring said "pinned Python 3.12"; the compile gate already uses the running interpreter, which is the right one on the scorer |
| S17 | Whole-suite test runs time out | public bundles | HANDLED | One file or node; the whole suite is refused |
| S18 | Graph tools bring no gain, cover no async function, and one takes a list argument | 756400, 758854 | HANDLED | Not attached |
| S19 | Links in statements are unreachable offline; many statements are a title only | 757149, 745998 | HANDLED | Route P3: locate by the title's words and edit early |

### 1.4 The agent loop

| ID | Issue as teams meet it | Evidence | Status | How the brain handles it, or why it cannot |
| --- | --- | --- | --- | --- |
| L1 | A continuation nudge starts the root agent again, and a two-stage pipeline loses its context | 754636 | HANDLED | The installer is idempotent; the baton carries a progress section written from the journal; `resume` |
| L2 | Compaction at 14,336 tokens drops tool calls and their results | 754783, 756336 | HANDLED | The issue and the baton are in the instruction and are re-sent with every request; the journal is on disk |
| L3 | Nested tool wrappers multiply schema errors | 760014 | HANDLED | Four tools with scalar arguments; the skill tools only for the installer |
| L4 | Budget instructions written in a prompt are ignored on 61% of tasks | 760014 | HANDLED | The gates are code |
| L5 | A turn ends in plain text without `submit_patch` | source | HANDLED | The nudge path and the no-tool-call-after-submit rule |
| L6 | The tests need a name or a message the statement never gives | RCA document 01, section 6.2 | NOT CONTROLLABLE | The most literal reading and a best-guess edit; 19 published tasks are of this kind |

### 1.5 Tally

| Group | HANDLED | PARTLY | FIXED TODAY | NOT CONTROLLABLE | NOT APPLICABLE | Total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Run level | 6 | 2 | 0 | 4 | 2 | 14 |
| Model and serving | 8 | 3 | 0 | 1 | 0 | 12 |
| Sandbox and tools | 12 | 4 | 3 | 0 | 0 | 19 |
| Agent loop | 5 | 0 | 0 | 1 | 0 | 6 |
| Total | 31 | 9 | 3 | 6 | 2 | 51 |

---

## 2. The defects, as executed

`tools/brain_probe.py` loads the assembled helper into a temporary git repository and runs sixteen situations. On the helper of 2026-11-23 it reported 10 passes and 5 gaps; on the patched helper 15 passes and 0 gaps.

| ID | Situation | Observed on the helper of 2026-11-23 | Why it matters | Observed on the patched helper |
| --- | --- | --- | --- | --- |
| D1 | An edit to `tests/helpers/util.py`, `tests/unit/deep/fixture.py`, `test/integration/check.py` | `APPLIED 1 block(s) -> tests/helpers/util.py` | The scorer discards any `.py` under `tests`, `test` or `testing`. The call was spent and the fix was not in the patch | `NOT APPLIED: tests and test configuration are reset by the grader` |
| D2 | A new root-level module created with `apply` on a path that did not exist, then `finalize` | `REMOVED scratch files: newroot.py`, then `RESULT: NO SOURCE CHANGES. An unedited tree scores zero` | A correct new file was deleted right before submission. A root-level module is common in small private repositories | Kept: `RESULT: READY` |
| D3 | New modules named `pkg/temp_conv.py`, `scripts/check_release.py`, `examples/try_it.py` | All three deleted as "scratch" | A name prefix is not evidence of a scratch file | All three kept; a root-level `repro.py` and files under `tmp/`, `scratch/`, `repro/` are still removed (test `T05Hygiene`) |
| D4 | The helper's `test` command against the scorer's verification command | No anyio plugin switch, no timeout override, no class pattern, no safe path | A local PASS did not mean what the scorer means | The four verdict-changing flags are present |
| D5 | Classification of 129 statements without a planner word, against the reviewed labels | Category 55 of 129, domain 49 of 129, route 42 of 129 | A bug fix that mentions a warning was routed as a behaviour change; `field` and `default` decided almost every FastAPI domain; `picklable`, `hashable`, `__qualname__`, `forward references` could never match because a word boundary followed the stem | Category 97, domain 82, route 52 |
| D6 | The docstring | "a pinned Python 3.12" | The wrong interpreter in the one place a maintainer looks | Names both interpreters |

Two checks that passed on both versions are worth naming because they are the ones teams lose submissions to: a search block that was cut off before its closing marker writes nothing and says so, and the model's own string-delimiter tokens leaked around a block are stripped.

### 2.1 The routing numbers

| Measure on the 129 published statements | Helper of 2026-11-23 | Patched helper |
| --- | ---: | ---: |
| Category reproduced (6 classes) | 55 (43%) | 97 (75%) |
| Domain reproduced (17 domains) | 49 (38%) | 82 (64%) |
| Domain within the reviewed primary-or-secondary pair | 57 (44%) | 91 (71%) |
| Route reproduced through the helper's own route rule | 42 (33%) | 52 (40%) |

Three cautions on reading them. The measurement uses the statement alone; with a planner the planner's `kind` word wins and the result should be better than either column. The new rule is a general principle (the domain with the most distinct keyword matches wins; generic words removed), not vocabulary learned from the four public repositories, so it should transfer to the hidden ones. And what the rules produce is the baton's CLASS, ROUTE and HINT lines: whether the model follows a better route better is unmeasured.

The cost of the category change is visible in the confusion: eight features are now classified as bug fixes because their statements contain "error" or "add support for ... error". For those the route changes from P4 (copy the sibling implementation) to P3 (read the top symbol, edit early). Against that, 42 statements that are bug fixes get a bug-fix route instead of a mechanical sweep. In the relay bundles the planner's word still decides.

---

## 3. What the patched copy is and how it was validated

| Item | Value |
| --- | --- |
| Location | `bcf-brain-patched/` in this package |
| Difference from the original | 155 diff lines in two files: `patches/bcf-brain-patches.diff` |
| Reproduce from a fresh copy | `python tools/apply_brain_patches.py <copy of bcf-brain>`; every replacement must match exactly once and both files must compile before anything is written |
| Helper tests | 36 pass, 1 optional skipped (the same as the original) |
| Official compiler on six bundles | 6 of 6, with the same advisory warning on the same four bundles |
| Negative controls | 15 of 15 rejected |
| Replay of the 129 published fixes through the editor | 129 applied, 129 byte-identical to `git apply`, 0 failures (the editor code is unchanged) |
| Behaviour probe | 15 pass, 0 gaps |
| Bundles | Rebuilt: the six folders and zips in `bcf-brain-patched/dist/` |

The first attempt at D4 taught a lesson worth keeping: it also passed `-s` and `PYTHONNOUSERSITE=1`, exactly as the scorer does, and three helper tests failed with `No module named pytest`, because on a development machine pytest can live in the user site-packages. The scorer's image has no user site, so those two flags change nothing there; they were dropped and the four flags that can change a verdict stayed.

**Use the patched bundles, not the original ones, for the next submission**, after one smoke run with the model: the routing change alters what the solver reads.

---

## 4. What remains open

| Open item | Kind | What to do |
| --- | --- | --- |
| The mean seconds per task with the model | Measurement | One local panel with the projection of Task 4 |
| Whether skill scripts run on the scorer | Scorer | The first skill-carrying submission answers it; keep `bcf-31b-noskill` validated as the fallback |
| The skill tool's optional list arguments (R6) | Scorer | If a skill-carrying bundle returns an abnormal score with a normal local run, submit the no-skill bundle next |
| A repeated failed search block is not recognised as a repeat (M11) | Helper | Keep the hash of the last refused search blocks in the journal and answer "this exact block failed before; copy the numbered lines". About fifteen lines in `cmd_apply` |
| The Docker versus subprocess backend on the scorer | Scorer | Ask on thread 754586; until answered, run the acceptance panel in Docker locally |
| Whether the scorer honours the same five conventions for the hidden tasks | Scorer | Nothing; the staff confirmed that the hidden tasks validate with their gold patches |

---

## 5. Sources

| Source | Publisher | Date | Used for |
| --- | --- | --- | --- |
| Discussion board captures: intel 2026-10-31, 2026-11-05, 2026-11-11, 2026-11-20 and the capture of 2026-11-24 06:01 UTC; threads cited above | this project | 2026-10-08 to 2026-11-24 | The register |
| `swegemma` 0.2.11, `adk-eval-core` 0.1.0, `adk-submission` 0.2.13 source; `HARNESS_README.md`; `docker/Dockerfile.sandbox` | Kaggle wheelhouse v31 and competition data package | read 2026-11-24 | Every "source" row |
| `tools/brain_probe.py`, `tools/route_eval.py`, `tools/apply_brain_patches.py` and their outputs in `bcf-brain-patched/validation/` | this package | 2026-11-24 | Section 2 and 3 |
| arXiv 2504.21798 (SWE-smith), arXiv 2405.15793 (SWE-agent) | cited through the RCA package | 2025 | M11 |
