# BCF brain: design and evidence digest (naive-agent vs. scaffold)

**Prepared 2026-11-25.** Sources are the two local packages only; no web access was used.
Citation shorthand (all paths relative to `d:\stuff\ai-misc\_bsh2026\vscode_project01\46-wide_research_test\`):

| Tag | Full path |
|---|---|
| `00` | `deliverables/2026-11-23_BCF_Brain_and_Dataset_RCA/00_README.md` |
| `02` | `deliverables/2026-11-23_BCF_Brain_and_Dataset_RCA/02_BCF_Brain_Design_and_Justification.md` |
| `03` | `deliverables/2026-11-23_BCF_Brain_and_Dataset_RCA/03_Validation_Results_and_Submission_Playbook.md` |
| `01T` | `deliverables/2026-11-23_BCF_Brain_and_Dataset_RCA/01_Dataset_Taxonomy_and_Root_Cause_Analysis.md` (used only for the `httpx_3672` and `rich_3470` task cards) |
| `B-README` | `deliverables/2026-11-23_BCF_Brain_and_Dataset_RCA/bcf-brain/README.md` |
| `VAL` | `.../bcf-brain/validation/` (`final_validate.log`, `replay_gold_final.log`, `localizer_final.json`, `bench_real.log`) |
| `SOLVER` | `.../bcf-brain/src/prompts/solver_core_31b.md` (verbatim in all 31B/E4B dist renders; noskill variant `solver_noskill_31b.md:33`) |
| `TAIL` | `.../bcf-brain/src/prompts/solver_tail_seq.md` |
| `PLAN` | `.../bcf-brain/dist/bcf-31b-sequential/prompts/bcf_plan.md` |
| `24/00` | `deliverables/2026-11-24_BCF_Tuning_Bottlenecks_and_Parity/00_README.md` |
| `24/01` | `.../01_Exception_Handling_Traps_by_Error_Family.md` |
| `24/05` | `.../05_Board_Issues_Graceful_Handling_Audit.md` |
| `24/PV` | `.../bcf-brain-patched/validation/PATCHED-VALIDATION-2026-11-24.md` |
| `24/DIFF` | `.../patches/bcf-brain-patches.diff` |
| `OOS` | out-of-scope cross-reference: `deliverables/2026-10-31-rtx5090-local-testing-guide/04-local-eval-harness-usage.md:143` |

Everything below is validated-without-model unless marked **not validated**.

---

## 1. Architecture in one page

**Topologies.** One source tree builds six bundles (`B-README:25-34`): per model track (31B, E4B), a **sequential** relay (root `SequentialAgent`: `bcf_plan` then `solver`, 11 files), a **flat** twin (one agent, same helper/procedure, 7 files — exists because no one has shown a relay wins and multi-agent decks scored 0.06-0.08, `02:223`), and a **noskill** floor (4 files, no skill tool, heredoc edits — fallback and ablation baseline, `02:225`).

**What each agent sees and may call.** Both run `include_contents: none` (`02:251-252`). The planner gets `{problem_description}` and only `run_command` plus the one skill (`02:177-181`, `PLAN:42`); it is designed for exactly two tool calls (install, then `plan`) plus a verbatim echo. The solver's instruction embeds the issue and `{bcf_spec?}`; it sees the planner's last reply (the baton) and its own work. Its tools are `run_command, read_file, get_status, submit_patch` — `edit_file`/`write_file` are withheld so the helper is the only writer (A3 single-writer, `02:255`, `02:108`).

**The baton.** The helper's `plan` command builds an eleven-line spec delimited `<<<BCF-SPEC v1>>>` ... `<<<END-SPEC>>>` (`02:13`; markers at `PLAN:31,41`, emitted by the helper per `dist/.../scripts/bcf.py:1236,1254`). Lines: TASK, CLASS, ROUTE, GAP, TARGETS, NAMES, VERIFY, HINT, PLAN (`02:352-365`). The planner must echo it verbatim as its final answer, which the framework stores in session state as `bcf_spec` and substitutes into the solver's instruction (`PLAN:21,43`; `02:256`). The baton plus a progress section is regenerated from the journal by `spec` on any re-entry (`02:308`).

**Budgets and milestones.** Per task: 8 minutes, 28 tool calls, 80 turns, 240 s command timeout (`02:201-207`) — the largest values with public evidence of finishing (`02:257`). The governor's clock starts at installer run and is file-based (`02:329`): first edit by 150 s, verification by 300 s, **freeze at 374 s** (`apply`/`put`/`rm`/`repro`/`test` refused; reading, checking, journaling, `finalize` remain), **hard stop at 432 s** (only `status`/`check`/`finalize`; every reply begins "call submit_patch now") (`02:333-337`). Harness cap 480 s; whatever is on disk is graded, and unsubmitted changes still become the patch (`02:243`, `02:53`).

**Helper commands** (`02:292-311`, one line each): `map` repository map; `find terms` rarity-weighted localizer (top-9 symbols, top-5 files, best symbol's source); `outline path` classes/functions with line ranges; `ctx path line` numbered source window (max 70 lines); `grep regex` compact regex search; `apply path [A-B]` the single write channel (search/replace blocks or line-range replace/insert/delete); `put path` create/replace whole file; `rm path` delete one source file; `repro` run a script stored outside the repo (must fail first); `test target [-k]` one file/node, true exit status, whole suite refused; `note text` journal line; `status` time/phase/next action; `resume` status + last 10 journal entries; `plan` build+store the baton; `spec` print stored baton with progress; `check` revert test/config files + compile changed files; `finalize` check + remove scratch + readiness verdict.

---

## 2. The doctrine, itemised

| # | Rule (paraphrase/quote) | Lives in | Naive failure it prevents | Evidence offered |
|---|---|---|---|---|
| 1 | Budgets are gates **in code**, not prompt advice: governor freezes writes at 374 s, hard-stops at 432 s, tells elapsed time in every reply | helper (`02:327-338`) | Burning the whole 8-min cap; running past 12 h run limit with no score | "budget instructions in a prompt are unreliable ... ignored on 61% of [114] tasks" (`02:338`, `24/05:L4` line 92) |
| 2 | Call plan: "Calls 1-4 locate, calls 4-10 edit: have a source edit applied by call 10 and before [150] seconds ... Calls 11-20 verify and correct. From call 20: finalize and submit" (`SOLVER:20`) | solver prompt + governor | Endless exploration, no edit on disk | first edit 106 s in solved vs 183 s in failed runs (752848); median 12 vs 21 steps (`02:538`) |
| 3 | `apply` refuses an edit whose SEARCH is missing (prints closest numbered lines), ambiguous (lists line numbers), or whose result would not compile; whole call is all-or-nothing; atomic replace; line endings preserved (`SOLVER:12`; `02:314-319`) | helper | Corrupted files, truncated/malformed edits, repeated failed edits | "0 malformed calls in 807" heredoc vs 31-41% `edit_file` malformed (`02:61`); 129/129 gold replay (`03:60-64`); a failed edit drops later edit success 90.5%→57.2% (`02:66`) |
| 4 | Compile check after every edit (gate in helper, not prompt) | helper | Model skips compile steps; ships syntax errors | prompt-only compliance ~24% of edits; 12/83 failed E4B runs broke syntax (`24/05:M7` line 54) |
| 5 | Protected test/config files are never written; `check`/`finalize` revert tracked ones (`02:321`, `02:52`) | helper + prompt (`SOLVER:16`) | Spending a call on a file the grader discards | grader rule `verification.py` (`02:52`); defect D1 probe (`24/05:114`) |
| 6 | "Never run the whole test suite: always name one file" (`SOLVER:16`) | prompt + helper refusal (`24/05:S17` line 81) | Suite timeouts; wasted minutes | whole-suite timeouts reported by public bundles (`02:622`) |
| 7 | Output shaping: helper output capped at 3,800 chars (under the 5,000-char harness cut); `outline`/`ctx` replace whole-file reads; helper command timeouts 45 s (test), 40 s (repro), 20 s (search) | helper (`02:288`, `02:51`, `02:258`) | Context flooding; harness `TimeoutExceeded`; 150-line read loops | harness caps (`02:51`); search stopped at 8 s cold-disk, fixed by scanning source first (`03:171`) |
| 8 | Journal (`journal.jsonl`) + `resume` + idempotent installer; baton carries a progress section written by the helper from the journal, never by the model (`02:342`, `02:266-270`) | helper | Losing all state at compaction (14,336 tokens, drops tool results) or after a continuation nudge that restarts the planner (`02:272-278`, `02:264`) | compaction/nudge hazards 754783, 754636 (`02:624`); installer tests (`03:44`) |
| 9 | `finalize` = `check` + scratch removal + readiness verdict; `check` compiles every changed file (`02:309-310`) | helper | Shipping scratch files, syntax errors, or an empty tree | T05Hygiene tests (`03:41`); D2/D3 data-loss fixes (`24/05:115-116`) |
| 10 | Scratch hygiene: repro scripts stored outside the repository; finalize removes only root-level scratch-looking untracked files and scratch dirs | helper + prompt (`SOLVER:39`) | Scratch swept into the patch (HARNESS_README gotcha) | S9/D3 (`24/05:73`, `24/05:116`) |
| 11 | No-helper fallback: fixed fallback baton from the planner (`PLAN:30-41`) and a heredoc + `py_compile` procedure in the solver (`SOLVER:39`) | prompts | Total task loss if the skill script never runs on the scorer | skill-only bundle scored 0.00 twice while resolving 40% locally (`02:382`, `24/05:S2` line 66) — **not validated** on scorer |
| 12 | `{bcf_spec?}` optional form; build refuses any other brace expression | solver prompt + build (`02:153`) | `KeyError` at the first model call of every task | negative control `strict_bcf_spec_var_missing_state` (`03:141`) |
| 13 | `repro`/verification requires a failure before the fix to count (`02:64`, `SOLVER:26`) | helper + prompt | False "done" on the ~65% of tasks whose tests pass pre-patch (`24/05:S11` line 75) | 760014 measurement (`02:64`) |
| 14 | One command, one string argument (quoted heredoc); no list-argument tool attached | helper + YAML | vLLM alphabetical-argument truncation (`edit_file` loses search text); vLLM list-arg parser hang | 756051/758968 (`02:323`); R6 (`24/05:34`) |

**Routes P1-P10** (`02:435-447`; counts sum to 129; derived by the helper from category + repro-presence + huge-flag, with schema→P5 and compat→P6 overrides, `02:449`):

| Route | Name | Tasks | First action | Oracle | Stop rule |
|---|---|---:|---|---|---|
| P1 | Prescribe | 22 | run the issue's example; it must fail | same example passes | one verification |
| P2 | Repro-driven bugfix | 27 | example → script outside repo | fails before, passes after | one fix, one correction |
| P3 | Title-hunt | 44 | rank symbols by issue words, read top symbol | related test file / inline assertion | early first edit, no late exploration |
| P4 | Feature-synthesis | 15 | copy closest sibling + registration points | sibling's tests on the new name | every visible requirement wired |
| P5 | Schema-contract | 4 | print generated schema for a minimal app | exact structure comparison | one regeneration |
| P6 | Compat-shim | 3 | find version detection point | both code paths import | one branch |
| P7 | Mechanical-sweep | 4 | list every call site | compile per file; sibling tests | all sites changed |
| P8 | Docs-example | 3 | find the example module tutorial tests import | tutorial test file | example matches issue |
| P9 | Build-tooling | 1 | read neighbouring script | script runs on dry input | script runs |
| P10 | Timeboxed-slice | 6 | smallest change satisfying the visible part | package imports | submit before freeze |

---

## 3. The stale-test question (most important)

**The task shape (`httpx_3672`).** The issue orders a rename: "Rename HTTPParser.complete to reset returning bool and add is_keepalive()" (`01T:2139`). Hidden tests require "HTTPParser.reset() replacing complete() at five call sites" (`01T:2140`), and the RCA's how-to-verify is "Existing tests/test_parsers.py parser tests with complete renamed to reset" (`01T:2141`) — the visible test file goes red under a *correct* fix until the hidden test patch (which carries the rename) replaces it.

**Every statement in the scoped documents that bears on this situation:**

1. **The solver's verify rule** (`SOLVER:36`, verbatim): *"Failures caused by missing fixtures or unrelated imports existed before your change: ignore them and never repair tests. If a related test fails, read the traceback, fix the source once, and run it once more."* The first sentence covers pre-existing environmental failures (fixtures/imports); the second prescribes treating a related-test failure as a source defect to fix once. Neither clause names renames, issue-contradicted tests, or hidden-vs-visible asymmetry.
2. **Hard limits** (`SOLVER:16`): *"Never create, modify or delete tests or test configuration (they are discarded)."* Prevents repairing the red test, says nothing about reverting the source change.
3. **Decision rules** (`SOLVER:46-47`): *"Stuck after a failed fix: make a different, smaller change."* and *"Never conclude that nothing needs to change. Every task needs a non-empty source patch."* The first is the dangerous one for this trap: after the rename makes the visible test red, "a different, smaller change" plausibly means reverting or aliasing.
4. **Grader asymmetry facts.** "Edits to tests and test configuration are discarded by the grader" (`02:52`); protected paths are reset before the test patch is applied — "the tests run against the baseline versions" (`24/01:390`); "every `.py` of a test patch used as a target" is one of five scorer conventions that "make 24% of correct fixes fail" (`24/05:S15` line 79; `24/01:327`). These describe the mechanism that makes the visible suite unreliable but are written as tool-call economy, not as a do-not-revert instruction.
5. **Test-asymmetry instance, named.** The `rich_3470` card: *"Trusting the existing test_capture_and_record, which asserts the buggy 'ABC\nHello\n' recording; the hidden patch replaces it, so preserving old behaviour fails."* (`01T:1614`.) This is the exact phenomenon (visible test asserts the buggy behaviour; hidden patch replaces the test), but it lives in a task card of the analysis document, **not** in the solver prompt, the helper, or design doc 02's rules.
6. **Exception families that cover the symptom.** AttributeError: raised "when an attribute reference or assignment fails"; read `e.name` rather than the message (`24/01:104`); F2 carries 43 of 129 tasks. A `monkeypatch.setattr` of a name the fix did not create errors in setup — "explains most 'the fix is right but the test errors' outcomes" (`24/01:332`), and F12's post-mortem rule 3 sorts local failures into four buckets (fix wrong / missing dependency / skipped-unsatisfiable / harness flags) with "Only bucket (a) is worth more budget" (`24/01:333`) — an issue-mandated-rename red test falls into bucket (a) by this classification, though its true cause is none of the four. The compile gate "cannot catch a NameError, an AttributeError or an import error; it catches exactly what a truncated edit produces" (`24/01:374`) — so nothing mechanical flags a stale-name failure either.
7. **What the patched copy changed nearby** (not a stale-test rule): protected-path widening and scorer test flags (`24/05:114`, `24/05:117`); the audit's remaining defence-to-add for tests is about *width* of the protected rule, not about revert behaviour (`24/01:406`).
8. **Out-of-scope cross-reference (labelled).** An earlier package states it outright: "the visible suite can contradict the graded one (verified live on httpx_3672: the hidden `test_patch` renames 5 `p.complete()` call sites). Never 'fix' a test; never trust a locally-visible test name as the grading target" (`OOS`, i.e., `2026-10-31.../04-local-eval-harness-usage.md:143`). **No equivalent sentence exists anywhere in the 11-23/11-24 design doctrine or prompts.**

**Verdict.** The design contains **no explicit rule** that prevents reverting an issue-mandated rename when a stale visible test goes red. The protection is **only implicit and partial**: (i) `apply` mechanically refuses to write test files, so the solver cannot repair the test (validated: probe `24/05:114`); (ii) nothing reverts source automatically — the tree is graded as-is and "an edit that exists counts" (`02:53`), so the rename stays in the patch unless the model actively undoes it; (iii) "never repair tests" blocks test-editing but not source-reverting. Meanwhile the two nearest prompt sentences — "If a related test fails, read the traceback, fix the source once" (`SOLVER:36`) and "Stuck after a failed fix: make a different, smaller change" (`SOLVER:46`) — push *toward* undoing or aliasing in exactly this scenario, and no rule forbids adding a back-compat alias (`complete = reset`) to green the old test. Whether an alias would pass or fail the hidden tests is unmeasured. A one-line prompt fix ("the hidden tests were written from the issue; if a visible test contradicts the issue, trust the issue") is an identified gap, not shipped doctrine.

---

## 4. Validated evidence

All numbers below were read from result files on 2026-11-23/24 (`03:3`). Environment: Windows 11, Python 3.12.10, pinned harness wheels `adk-submission` 0.2.13 / `adk-eval-core` 0.1.0 / `swegemma` 0.2.11 / `google-adk` 1.36.1 from wheelhouse v31 (`03:25`).

| # | Metric | Value | Status | Source |
|---|---|---|---|---|
| 1 | Helper behaviour tests | 37 tests; 36 pass + 1 optional real-snapshot test (passes on two real checkouts) | validated-without-model | `03:11,38-49`; patched re-run "Ran 37 tests in 90.972s, OK (skipped=1)" `24/PV:10` |
| 2 | Gold-patch replay fidelity | 129/129 applied; **129/129 byte-identical to `git apply`**; 278 files, 695 hunks; 4 files needed wider context; 1 needed line-range form | validated-without-model | `03:57-64`; log line "TOTAL 129: bcf applied 129, identical to git apply 129" `VAL/replay_gold_final.log` |
| 3 | Localizer file hit rates | gold file in top-9: **96/129**; top-5: 56/129 | validated-without-model | `03:77-83`; `VAL/final_validate.log` §6 |
| 4 | Localizer function hit rates | gold function top-3: 42/121; top-9: 53/121 | validated-without-model | same |
| 5 | Localizer versions | v1 47/80 → v2 47/95 → v3 56/96 (top-5/top-9) | validated-without-model | `03:94-98` |
| 6 | Search latency | median 0.39 s, max 1.02 s per repo in memory | validated-without-model | `03:100` |
| 7 | Official compiler | 6/6 bundles compile and render under both state shapes | validated-without-model | `03:104-117` |
| 8 | Negative controls | **15/15** deliberately broken bundles rejected, each for the intended reason | validated-without-model | `03:119-141`; `VAL/final_validate.log` tail |
| 9 | Timing on real checkouts | install 0.58-0.71 s; search first run 0.54-1.38 s, warm 0.52-1.11 s; plan step 0.54-1.11 s | validated-without-model, "indicative, not measurements of the scorer" | `03:147-156` |
| 10 | Behaviour probe (16 situations) | original helper PASS 10 / GAP 5; patched **PASS 15 / GAP 0** | validated-without-model | `24/05:110`; `24/PV:14` |
| 11 | Routing accuracy (keyword classifier vs reviewed labels, 129 statements) | before→after: category 55 (43%)→97 (75%); domain 49 (38%)→82 (64%) (91 within reviewed pair); route 42 (33%)→52 (40%) | validated-without-model (statement-only; with a planner "the result should be better") | `24/05:123-134`; `24/PV:15` |
| 12 | Patched replay re-run | 129 applied / 129 identical again, 1,094 s | validated-without-model | `24/PV:13` |
| 13 | Defects caught by checks pre-submission | e.g., unquoted colon in YAML would have scored 0.00; replay counter bug produced a false "129/129" until corrected | validated | `03:162-175` |

**Documented limits (explicitly not validated):** no run with the Gemma 4 model at all (`00:38`; `03:16`); mean seconds per task on the scorer unknown — the number that decides the 12-hour risk (`03:39`); whether the planner relays the baton verbatim and whether the solver follows the route (`03:183-184`); sequential-vs-flat comparison (`03:185`); skill-script execution on the scorer — open board question since 2026-11-12 (`24/00:75`); E4B bundles never run with the E4B model (`03:188`); whether the scorer uses the Docker backend (`24/00:76`).

---

## 5. Known traps and board issues that bear on the claims

**Exception families most relevant to a rename/refactor task with a failing visible test** (`24/01:54-70` for the counts):

| Family | Count | Relevance |
|---|---|---|
| F2 type/attribute (TypeError, AttributeError) | 43 tasks | the literal symptom of a stale-name call site; read `e.name` (`24/01:104`) |
| F3 name/import (NameError, ImportError semantics) | 10 | failed `from x import y` is ImportError with `name` set (`24/01:125`) |
| F12 test-harness semantics | 58 | `pytest.raises` matches subclasses; monkeypatch setup AttributeError; **a skipped required test is a failure** (`24/01:325`); exit 0 not sufficient without JUnit (`24/01:389`); the whole target file must pass (`24/01:391`); verification runs under five flags (`24/01:327`) |
| F10 custom exceptions/contracts | 66 | hidden tests pin exact class and message (`24/01:275`) |

**Board facts** (`24/05`): silent 0.00 with status "complete" for a non-compiling bundle (R1, line 29); byte-identical resubmission scores 0.00 with a ~3,230-byte result, staff investigating (R7, line 35); one pending submission blocks the next, 26-29 h end-to-end (R12, line 40); vLLM list-argument parser hang zeroes all later tasks (R6, line 34); run over 12 h gets no score (R9, line 37); wheelhouse pinned v31, "still version 31 at 06:13 UTC" 2026-11-24 (R14, line 42); **test-file edits dropped from the patch** (S10/D1, lines 74, 114); five scorer conventions make 24% of correct fixes fail (S15, line 79); tests pass pre-fix on ~65% of tasks (S11, line 75); budget prompts ignored on 61% (L4, line 92); repeated failed actions not recognised as repeats (M11, line 58). **Deadlines:** entry and team-merger (notebook-publishing freeze) 2026-11-25 23:59 UTC; final submissions 2026-12-02 23:59 UTC (`24/00:3`; `02:656`).

---

## 6. What changed in the 2026-11-24 patches

Six fixes, 155 diff lines in two files (`24/00:89`; `24/05:143`).

| Defect (ID) | Effect before | Fix | Changes behaviour on a small rename task like httpx_3672? |
|---|---|---|---|
| Nested test helpers writable (D1) | a call spent editing `tests/helpers/util.py` is discarded by the scorer | `PROTECTED_RE` widened: any `.py` under `tests/test/testing` dirs (`24/DIFF` hunk `@@ -63`; `24/05:114`) | **Yes, indirectly**: if the solver tried to update visible call sites under a nested test dir, the call is now refused instead of wasted; does not change revert behaviour |
| `finalize` deleted correct new files (D2/D3) | root-level module created via `apply` removed, then "NO SOURCE CHANGES" | finalize keeps everything the helper wrote (`put` **or** `apply`), and scratch rule now needs root-level scratch-looking name or scratch dir (`24/DIFF` `_bcf_tail @@ -52`; `24/05:115-116`) | Marginal: httpx_3672 edits existing files only; protects any new-module variant |
| Helper `test` flags differed from scorer (D4) | local PASS did not mean what the scorer means | adds `-p no:anyio -o timeout=0 -o python_classes=Test* *Test` + `PYTHONSAFEPATH=1` (`24/DIFF` `cmd_test @@ -969`; `24/05:117`) | **Yes**: a rename task's local verification now reproduces the scorer's verdict semantics more closely |
| Dead keyword stems (D5) | `picklable`, `hashable`, `__qualname__`, `forward references` never matched | `\w*` suffixes and `__qualname__` added (`24/DIFF` `DOMAINS` hunks) | Low: NET domain already matched keep-alive/parser for this task |
| First-match routing (D5) | one generic word (`field`, `default`, `response`) decided the domain; warning-mentioning bug fixes routed C4 | most-distinct-matches-wins `domain_of`; C1 `KIND_RULE` moved first (`24/DIFF` `@@ -144`, `@@ -167`) | **Yes, in the baton text**: CLASS/HINT lines change for many tasks; for httpx_3672 the NET domain (keep-alive, parser keywords) and route P3 (bug, no repro) are unchanged; whether the model follows routes better is **not validated** (`24/05:132`) |
| Docstring pinned "3.12" (D6) | wrong interpreter named in the one place a maintainer looks | names 3.13 (Docker sandbox) and 3.12.13 (`24/DIFF` hunk 1; `24/05:119`) | No |

Validation of the patched copy: assemble 60,655 B / 1,424 lines; 37 tests; compiler 6/6; controls 15/15; replay 129/129; probe 15/0; routing 97/82/52 (`24/PV:5-15`; `24/05:140-151`). Guidance is to submit patched bundles after one smoke run (`24/00:52`).

---

## 7. Unconfirmed / open questions

1. **The stale-test gap (item 3).** No explicit anti-revert rule exists; adding one is a proposal, not shipped doctrine. Also unmeasured: whether the model would revert, alias, or hold the rename when the visible test goes red.
2. No model run of any kind; planner baton relay and solver route-following unobserved (`03:183-184`).
3. Mean seconds per task unknown; 270 s/task ≈ 9.0 h for 120 tasks is the planning figure (`02:582-591`).
4. Skill scripts on the scorer; Docker-vs-subprocess backend (thread 754586) (`24/05:163-166`).
5. Sequential-vs-flat (H1) and helper-vs-noskill (H2) undecided; ladder defined but not run (`02:549-556`).
6. M11: a repeated *failed* search block is not recognised as a repeat; ~15-line fix proposed, not implemented (`24/05:165`).
7. Routing docstring discrepancy: the diff's docstring says "81 of 129 with this one" (`24/DIFF`, `domain_of`) while the validation docs say 82 (`24/PV:15`, `24/05:129`) — one-off count drift, unexplained in the sources.
8. Exact `AttributeError` wording difference 3.13 vs 3.12 for `rich_3472` is competitor-reported and unreproduced (`24/01:19`, `24/01:438`); scorer's exact `python:3.13-slim` patch version and pytest pin unknown (`24/01:436-439`).
9. Which of FAIL_TO_PASS / PASS_TO_PASS the hidden tasks carry is unknown (`24/01:440`); scorer-side conventions for hidden tasks unverifiable (`24/05:167`).
10. The relay's 20-45 s planner timing is an estimate from decode rates, "not measured with the model" (`02:245`).
