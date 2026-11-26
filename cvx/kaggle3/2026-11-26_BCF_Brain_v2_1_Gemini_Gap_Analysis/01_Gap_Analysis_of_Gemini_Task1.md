# 01 - Gap analysis of Gemini's Task 1 document

Subject: `input/kagglecomp/docs/01_Task1_Public_Dataset_Classification_and_Root_Cause_Analysis.md`, written by Gemini 4
Carbon on 2026-11-25: a taxonomy, a trap list and ten "laws" for the 129 public tasks of the Kaggle Gemma 4 Developer
Agent competition. Prepared 2026-11-25.

"Gap" is used in three ways below: where the document departs from the dataset, where it departs from the harness and
the forum, and where its proposals meet the current BCF brain. The claim-by-claim record is
`02_Claim_Verification_Ledger.md`; what was built as a result is `03_Brain_v2_Changes_and_Justification.md`.

## 1. Verdict

| Aspect | Verdict | Reason |
|---|---|---|
| The 129-row master matrix | Exact | 129 of 129 rows equal the dataset on commit, date, file count, lines added and removed, and tier |
| Census tables | Mostly right | 3 summary figures are wrong: new files, fixture packages, date span |
| Trap counts | Reproducible, loosely defined | every count equals the matrix column, but 5 of the 8 rest on a rule the document never states |
| Category taxonomy | Arithmetic right, weak as a guide | a category does not say which procedure a task needs |
| Defect cards | Per-task labels | 109 distinct titles for 129 tasks; one card carries 28 different titles; one card is assigned to nothing |
| Forum citations | 2 of 4 misquoted | a number is kept and its denominator is changed |
| Tool and standard claims | Nearly all hold | settled against official documentation and by execution on Python 3.13 |
| Ten laws | Partly new | Laws 2, 6, 9 and the editing half of law 1 were already in the brain; laws 7, 8 and the gate in law 10 describe behaviour the brain did not have; the mandatory reproduction in law 10 is contradicted by the thread it cites. The useful part is verification, which v2 builds |
| What it leaves out | Five things that matter | a staff note, a server-side bug, a runtime failure, the scored set's properties, any measurement |

Of 64 claims checked, 41 hold, 12 hold partly, 7 are wrong, 3 hold only under an unstated rule, and 1 is not supported.

## 2. The document against the dataset

All figures in this section were recomputed from `tasks.jsonl` (`data/features_audit.jsonl` in the scratch folder
keeps one ground-truth row per task beside the document's row).

### 2.1 What reproduces exactly

- Repository split: fastapi 67, rich 48, requests 13, httpx 1.
- 91 single-file and 38 multi-file tasks; 19 two-file tasks; the largest fixes touch 26 and 20 files.
- Complexity tiers 43, 42, 24 and 20, and the median file count per tier.
- Year cohorts 10, 21, 48 and 50; 98 tasks from 2025 and 2026.
- 15 tasks change `docs_src` tutorial files; 46 test patches remove at least one line; no issue has hints or a
  traceback.

The per-task root-cause write-ups are specific and, where compared with the gold patches, accurate about the fix.

### 2.2 Three figures that are wrong

| Claim in the document | What the dataset holds |
|---|---|
| Only `fastapi_15661` creates a new non-test file; 128 tasks modify existing files | 11 tasks create a non-test file. Six add a module or script outside `docs_src`: `fastapi/sse.py`, `fastapi/middleware/asyncexitstack.py`, `fastapi/_compat/may_v1.py`, `scripts/prepare_release.py`, a Playwright script, and the 21 Unicode data files of `rich_3930` |
| 38 test patches use `inline_snapshot`, `dirty_equals` or `httpbin`: 30 FastAPI and 8 Requests | 29: 21 FastAPI (18 `inline_snapshot`, 5 `dirty_equals`) and 8 Requests (`httpbin`) |
| Tasks span February 2020 to June 2026 | 2023-07-29 to 2026-06-20, as the document's own table says |

The first matters for the brain: a task that needs a new file is a different job from a one-line fix, and the document
undercounts it by a factor of eleven. The second matters because the figure is another team's count of tasks that could
not be graded in that team's own local sandbox (thread 760595), not a property of the dataset.

### 2.3 Figures that need a rule the document never gives

| Figure | Rule that reproduces it |
|---|---|
| 21 tasks touch async code | changed lines contain `async` or `await` (11 tasks), or a changed hunk lies inside an `async def` (17 tasks); union 21 |
| TRAP-2 in 41 tasks | multi-file (38) plus every task that touches `docs_src` (15, three of them single-file) |
| TRAP-5 in 41 tasks | problem statement under 220 characters (40) plus `httpx_3672` |
| TRAP-6 in 33 tasks | every T1-Micro task (43) except 10 |
| TRAP-8 in 39 tasks | 29 tasks with one of the three fixture names plus 10 others |
| TRAP-1 in 46 tasks | any removed line anywhere in the test patch |

None of these rules is wrong. They were found by trial, which means a reader cannot tell what the numbers mean.

### 2.4 How much of each trap can change an agent's decision

A trap matters in proportion to the tasks where following the naive move loses points. The document counts tasks where
a trap *could* apply.

| Trap | Document's count | What the count really measures | Known about the size of the real effect |
|---|---|---|---|
| TRAP-1 visible tests assert the old behaviour | 46 | test patches that remove a line | Upper bound 46. Another team measured about 34 percent of its development set as spec changes whose old tests assert the buggy behaviour (thread 760014). Not measured task by task here |
| TRAP-2 multi-file and example files | 41 | files touched | 26 tasks change two or more source files only, 12 change source and example files, 3 change one example file |
| TRAP-3 generated code | 2 | tasks with a generator | 1: `scripts/unasync` exists in httpx. No generator exists for the rich tables (ledger B37) |
| TRAP-4 async code is missing from the code graph | 21 | tasks with async code | 0 on the scored set: staff state that no scored task touches an `async def` (thread 745998) |
| TRAP-5 terse prompt | 41 | statement length | A weak proxy: the rule misses 17 of the 52 tasks that the 11-23 coding rated a severe gap between statement and hidden tests, including statements of 1,000 to 5,300 characters |
| TRAP-6 a green old test proves nothing | 33 | T1-Micro minus 10 | Applies to almost every bug fix whose hidden tests are new: 83 test patches only add lines |
| TRAP-7 cross-version shims | 5 | the document's choice | The 11-23 coding counts 14 pydantic v1 and v2 tasks, 8 Python-version tasks and 3 Starlette tasks |
| TRAP-8 hermetic sandbox and skip gate | 39 | fixture names plus 10 others | On the scorer the packages are pre-installed. What remains is real: a skipped required test is not a pass |

## 3. The classification as a guide for the brain

### 3.1 A category does not say which procedure a task needs

The 11-23 coding gave every task a route: the procedure the agent should run. Crossing the document's seven categories
with those routes:

| Category | Tasks | Routes used | Largest groups |
|---|---|---|---|
| CAT-1 type introspection | 23 | 5 | title-hunt 8, repro-driven 7, prescribed 6 |
| CAT-2 serialization and schemas | 21 | 8 | title-hunt 5, schema contract 4, repro-driven 3 |
| CAT-3 state and lifecycle | 19 | 7 | repro-driven 7, title-hunt 5, prescribed 3 |
| CAT-4 HTTP protocol and routing | 22 | 6 | repro-driven 6, prescribed 5, feature 5 |
| CAT-5 cell widths | 10 | 4 | title-hunt 7 |
| CAT-6 terminal and layout | 30 | 5 | title-hunt 16, prescribed 5, feature 5 |
| CAT-7 release and examples | 4 | 2 | example files 3 |

A root cause is known only after the fix. At the start of a task the agent can observe the issue and the code, which
is what the existing routes are keyed on. Mean difficulty on the 1-to-5 scale also separates the categories poorly:
2.48 for CAT-1 against 3.40 for CAT-5.

### 3.2 What CAT-1 contains

CAT-1 is named "Type Introspection, Generics and Runtime Signature Unwrapping". Only 9 of its 23 tasks are typing work.
The others are 4 dependency-injection tasks, 4 object-protocol guards (`hasattr` checks, pickling, identity against
equality), 3 validation tasks and 3 traceback-rendering tasks. Those need different procedures and different hints.

### 3.3 The defect cards are per-task labels

The document announces "16 reusable defect cards". Counting the parenthetical title of each card across the 129 rows:
109 distinct titles. DC-04 has 28 different titles for its 29 tasks; ten other cards have one title per task. Only
DC-01 is used as one pattern (2 titles, 15 tasks). DC-02 is assigned to no task although Law 3 cites it. The cards are
never defined, so they cannot be turned into procedures.

### 3.4 Statement length is a poor stand-in for the specification gap

TRAP-5 flags short statements. The property that costs points is different: the hidden tests need names, messages or
formats that the statement does not give. In the 11-23 coding that gap is severe in 52 tasks and minor in 50; 17 of the
severe ones have long statements, for example `fastapi_13786` (5,328 characters), `fastapi_15745` (4,304) and
`fastapi_14262` (2,437). The brain already records this as `GAP` in its spec.

## 4. The traps against the harness and the forum

| Trap | The document's mechanism | What the harness and the forum say |
|---|---|---|
| TRAP-1 | visible tests assert obsolete behaviour; agents revert a winning patch | Holds. The grader resets test files and runner configuration, then applies its own tests (HARNESS_README, Phase 2, step 3). Thread 760014: "any 'prefer the patch that passes existing tests' logic actively destroys correct patches" |
| TRAP-2 | fix must propagate to wrappers, twin trees, example files | Holds as a fact about the fixes. 35 of the 38 multi-file tasks are tied by callers, wrappers and tables, not by copied code |
| TRAP-3 | hand-editing generated output fails | Holds for httpx only |
| TRAP-4 | graph tools cannot find async functions | Holds and omitted: staff say it affects no scored task |
| TRAP-5 | terse or misnamed prompts | Holds, with the limits in section 3.4 |
| TRAP-6 | old tests stay green on a wrong guard | Holds: thread 760014 found the pre-existing suite green on unmodified code in about 65.7 percent of development tasks |
| TRAP-7 | cross-version dependencies | Holds; already a route in the brain |
| TRAP-8 | fixture packages and skipif fail or skip in unconfigured sandboxes; strict JUnit check | Partly. The agent prompt on the scorer says all test dependencies are pre-installed, and Container A installs cached test packages. The skip rule is real |

## 5. Forum citations

| Document says | Source says |
|---|---|
| 65.7 percent of agent failures (TRAP-6) and of failed trajectories (Law 10) | In about 65.7 percent of development tasks the pre-existing suite already passes on the unmodified code (thread 760014) |
| E4B reaches the right file in 60 to 86 percent of failed runs (Law 1) | About 60 percent of tasks, 67 to 70 of 114, reached the correct file (760014); 56 of 83 failures, 67.5 percent, edited the right file (760595). 86 percent is in neither |
| 14.5 percent of failed trajectories submit broken code | 12 of 83 failures (760595); holds |
| The graph has zero async nodes (thread 758854) | Holds; the same thread cites the staff note that scored tasks are unaffected |

The document also cites a rule against forcing a reproduction first only to argue for one: thread 760014 reports that
forcing a failing reproduction lowered a small agent's score from 6.0 to 3.5 on a 20-task subset.

## 6. The ten laws as proposals for the brain

| Law | Proposal | Assessment | Decision |
|---|---|---|---|
| 1 | Help with editing and with verification, not only search | The editor already gated every write. Verification was the gap | Adopted: section 3.1 of document 03 |
| 2 | Peel typing wrappers recursively | Already the TYP hint, at a more general level | No change |
| 3 | Input and output names differ in schema libraries | A good one-line hint; DC-02 does not exist | Hint wording |
| 4 | Copy shared mutable state before changing it | A good one-line hint | Hint wording |
| 5 | Count wire lengths in bytes | A good one-line hint; specific to HTTP clients | Hint wording |
| 6 | Grapheme and cell-width accounting | Already the WID hint; one repository only | No change |
| 7 | Detect expected-red test failures | The document says the brain does this. It did not | Adopted: section 3.1 of document 03 |
| 8 | Enforce sibling closure before submitting; the spec computes closure | The spec holds four ranked symbols. By measurement, name-based closure finds another file of the fix in 4 of 38 multi-file tasks | Adopted as an informational line: section 3.5 of document 03 |
| 9 | Index the code with the standard library `ast` | Already so since 11-23; no scored task needs it | No change |
| 10 | Compile and import gate; a failing reproduction first | The compile gate existed. The import gate is new and supported. The mandatory reproduction is contradicted by the cited thread | Import gate adopted; mandatory reproduction not adopted |

## 7. What the document does not cover

1. **The scored set is not the public set.** The competition page says the test tasks come from private repositories.
   Staff add that no scored task touches an `async def` and that such functions are at most 1.8 percent of functions in
   the private repositories (thread 745998). The document ranks async graph blindness among its main traps.
2. **A server-side failure that can end a scoring run.** In vLLM 0.19.1 the `gemma4` tool parser loops forever on a
   bare array element that contains a bracket, without any list-typed argument, in about 1 to 2 calls per thousand;
   nothing restarts the server (thread 760830, confirmed by a second team on 2026-11-24).
3. **The 12-hour limit.** A submission with an 8-minute cap per task failed with "exceeded the allowed runtime" on
   2026-11-24 (thread 761467). At 8 minutes, 120 tasks take 16 hours.
4. **The silent 0.00.** Staff attributed the 0.00 runs to a faulty GPU in the pool since 2026-10-12, about 125
   submissions affected, with reruns (thread 761004, 2026-11-24). The document knows only the skill-name cause.
5. **Cost.** No proposal is measured, and none is priced in calls, seconds or prompt tokens.

## 8. Internal defects

- The 129 rows are numbered in `tasks.jsonl` order in section 4 and in category order in section 5.
- The label `PC-5` is used three times as if defined; it is not.
- Trap labels change meaning: TRAP-6 is glossed as a module-level constant being invisible to call-graph tools and as
  "AST graph blind to async def", which is TRAP-4's definition; TRAP-4 is glossed once as a terse prompt.
- `fastapi_14482` names `ConfigError`; the exception is `PydanticUserError`.
- `fastapi_9753` says `inspect.isgeneratorfunction` cannot see through `functools.partial`; it has since Python 3.8.

## 9. What is worth taking from the document

- TRAP-1, stated precisely: the visible tests are replaced by the grader, so a test that fails after a correct fix is
  not evidence against the fix.
- TRAP-6: a test file that passes proves nothing about the reported bug.
- TRAP-2 as a count: 29.5 percent of fixes change several source files.
- The compile-and-import idea behind Law 10, which thread 760595 measured as helpful.
- Its per-task write-ups, which are a reliable index of what each public task is about.
