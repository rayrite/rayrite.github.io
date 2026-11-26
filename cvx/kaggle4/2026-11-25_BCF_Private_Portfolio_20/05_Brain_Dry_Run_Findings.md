# What a dry run of the brain's helper found on the candidate tasks

**Prepared:** 2026-11-25. **Scope:** the 2026-11-23 helper (`src/bcf.py`, version 1.0.0) driven exactly as the agent drives it, on 70 candidate tasks from three held-out sets, with no model. The 2026-11-24 patched helper was run beside it wherever the two differ. Raw results: `data/probe45.tsv`, `data/probeb.tsv`, `data/probef.tsv`, `data/replay*.json`, `data/route_census.tsv`, `data/localizer129_fixed.json`.

The dry run does three things the brain will do on every task. It applies each gold patch through the helper's editor and compares the result with `git apply`. It builds the baton with `plan` from a mechanical brief and reads the category, domain and route that the helper's own rules produce. It runs `find` and checks where the gold file and the gold function appear.

**The brief is a stand-in, not the planner.** The mechanical brief takes the title as the task line, the keyword category as `kind`, and identifiers and title words as `names`. A model planner will write better lines. Where that matters, the text says so.

---

## 1. The editor is safe on all three sets

Each gold patch was converted to SEARCH/REPLACE blocks with three lines of context and applied with `apply`, new files with `put`, the same route the solver prompt prescribes. The result was compared byte for byte with `git apply` of the same patch.

| Set | Tasks | Applied by the helper | Identical to `git apply` | Files that needed wider search context | Line-range route needed |
| --- | ---: | ---: | ---: | ---: | ---: |
| FreshSWE-Py candidates (P20, alternates, swaps) | 36 | 36 | 36 | 0 | 0 |
| OOD-45 candidates | 16 | 16 | 16 | 0 | 0 |
| OOD-B candidates | 18 | 18 | 17 | 0 | 0 |
| Total | 70 | 70 | 69 | 0 | 0 |

The one exception is not a helper failure: `markdown_1587` also edits `docs/changelog.md`, which my text-only copy of the snapshot does not contain, so `git apply` had nothing to compare against; the helper applied the Python part. On the public 129 the same test had needed wider context on four files and the line-range form on one; none of that was needed here.

One practical note for anyone repeating this on Windows: three snapshots (kedro, py-shiny) contain template paths longer than 260 characters, and `git add` fails on them unless git is told to accept long paths (`GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.longpaths GIT_CONFIG_VALUE_0=true` in the environment). That is a limit of the Windows test machine, not of the scorer.

---

## 2. The localizer finds the file; how well depends on the statement

`find` was run with the mechanical `names` list and its output parsed for the gold files and functions of the task.

| Set | Tasks | Gold file in first place | Gold file in top 5 files | Gold file among the files of the top 9 symbols | Gold function in top 3 | Gold function in top 9 | Median time | Slowest |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| FreshSWE-Py candidates | 36 | 28 | 34 | 35 | 22 | 26 | 1.05 s | 8.85 s |
| OOD-45 candidates | 16 | 13 | 14 | 14 | 7 | 10 | 1.25 s | 4.08 s |
| OOD-B candidates | 18 | 5 | 10 | 8 | 3 | 4 | 0.80 s | 13.86 s |

"In first place" counts a gold file as the first of the top-file line or as the single path match.

Two things stand out. First, **statement style moves the result more than the repository does.** The rewritten OOD-45 statements (each a user report that names the public API) and the FreshSWE-Py statements (issues and pull-request descriptions that name functions and arguments) put the gold file in the top 5 for 88 and 94 percent of tasks. The organic issue texts of OOD-B, many with issue templates, links and HTML comments, give 56 percent, and first place only 28 percent. A model planner that writes a cleaner `names` line should recover part of that gap; whether it does is one of the things to check in the first P20 run.

Second, **one large file costs seconds.** All nine `more-itertools` searches took 6.2 to 8.9 seconds because almost the whole library is one 5,538-line file that the localizer parses and scores function by function; the `sqlglot_7479` search took 13.9 seconds. The planner's `plan` command runs one search, and the solver typically runs one or two more, so on such repositories 15 to 25 seconds of the 150-second first-edit budget go to searching.

### 2.1 The published localizer number for the public set is an undercount

`tools/eval_localizer.py` reads the top-5 files with the pattern `\| (\S+\.py) \(\d+\)`, which needs a pipe in front of a file. The first file of the line follows the colon ("TOP FILES: a.py (31) | b.py (12)"), so it is never counted unless it also appears as a path match. I re-ran the evaluation with that one line corrected; every other figure reproduces the published one exactly.

| Measure on the public 129 | Published (Documents 01 and 03) | With every entry of the line counted |
| --- | ---: | ---: |
| Gold file in the top 5 files | 56 of 129 | 96 of 129 |
| Gold file in first place | not reported | 64 of 129 |
| Gold file among the files of the top 9 symbols | 96 of 129 | 96 of 129 |
| Gold function among the top 3 symbols | 42 of 129 | 42 of 129 |
| Gold function among the top 9 symbols | 53 of 129 | 53 of 129 |

The localizer is better than the package says at file level; its real weakness is function level, where the right function is in the top 3 for a third of the tasks. The same flaw was in the first version of my own probe, which is how it was found.

---

## 3. The repository view at install time

`map` is the first thing the planner sees. On the three anchors it reports the right package and a useful "large files" line: `src/packaging/specifiers.py` (1,942 lines), `src/click/core.py` (3,437 lines), `more_itertools/more.py` (5,538 lines) and `recipes.py` (1,606 lines). Two small misreadings appeared: `packaging` has a `tasks/` directory with an `__init__.py`, which `map` lists as a package next to `src/packaging`; and for `pluggy` it reports 8 "example files (tests may import them)" because the repository has an `examples/` directory. Both are cosmetic, but the second shows that two sentences in the helper are specific to FastAPI's layout.

---

## 4. The keyword rules pick the wrong procedure on 12 of 70 statements

### 4.1 Traps in the category and domain rules

The category rules are first-match-wins over the task text. On real issue titles, common words send bug fixes to other routes. Each row was read by hand to confirm that the task is an ordinary bug fix or a small change. "Patched" is the 2026-11-24 helper.

| Task | Set | Title (shortened) | Word that fired | 2026-11-23 helper | 2026-11-24 patched helper | What the task is |
| --- | --- | --- | --- | --- | --- | --- |
| `pdm_3902` | OOD-45 | Dependency with python_version <= "X.Y" is locked but skipped | dependency | build, route P9 (read the neighbouring script, run it on a dry input) | same | Bug fix in marker evaluation |
| `nox_1188` | OOD-45 | install_and_run_script fails for a script that declares no dependencies | dependency | build, route P9 | bug fix, route P2 | Bug fix |
| `kedro_5792` | OOD-45 | --load-versions rejects a dataset name that the catalog resolves through a catch-all pattern | reject | behaviour change, route P7 (sweep: one file per apply) | same | Bug fix |
| `pint_2437` | OOD-45 | Defining a base unit with a scale raises AttributeError instead of a definition error | definitions (a domain rule) | bug fix, but schema route P5 (print the generated schema, compare keys) | same | Bug fix in unit-definition parsing |
| `canvasapi_716` | OOD-B | obj_or_str improperly rejects strings | reject | behaviour change, route P7 | same | Bug fix |
| `faker_2309` | OOD-B | Faker command line processing doesn't correctly support community providers | support | feature, route P4 (copy the closest sibling implementation) | same | Bug fix |
| `jsonargparse_827` | OOD-B | The choices parameter of add_argument() is not functioning correctly | add | feature, route P4 | same | Bug fix |
| `packaging_1299` | P20 | Unclear documentation and error messages around combining post releases and prefix matches | documentation | documentation, route P8 (edit the example application) | bug fix, route P2 | Bug fix in error messages |
| `packaging_1244` | P20 | fix(pylock): reject bools where TOML integers are expected | reject | behaviour change, route P7 | bug fix, route P2 | Bug fix |
| `packaging_1341` | P20 | fix: reject wheel file names containing a newline at the end of the name part | reject | behaviour change, route P7 | bug fix, route P2 | Bug fix |
| `pluggy_731` | swap | fix: reject PluginManager.register(None) | reject | behaviour change, route P7 | bug fix, route P2 | Bug fix |
| `more_itertools_1285` | alternate | bucket: a failed lookup or in test adds a phantom key to the keys returned | add | feature, route P4 | same | Bug fix |

Three facts follow from the table:

- **The patched helper repairs five of the twelve.** It tries the bug-fix rule first, so a title that contains a bug-fix word ("fails", "fix") wins over "dependency", "reject" or "documentation". The three traps inside P20 belong to this group: with the patched helper they route correctly.
- **Seven remain in both versions.** Their titles contain no bug-fix word: "rejects", "support", "add_argument", "adds", "dependency" (twice) and "definitions".
- **The planner's `kind:` line can correct six of those seven.** When the planner names one of its accepted words (bug, fix, error, feature, add and so on), that word decides the category. The exception is `pint_2437`: the word "definitions" is in the schema rule of the domain table, and a schema domain sends every bug fix, feature and behaviour change to route P5 whatever the category is.

So the traps measure two different things: whether the planner model writes a correct `kind:` line, and whether the domain table is tied too closely to one library.

### 4.2 How often each route comes up in whole pools

The same mechanical brief applied to every statement of each pool (2026-11-23 helper, patched helper in brackets):

| Pool | Statements | Bug fix | Feature | Behaviour change | Documentation, build or refactor | Repro route P2 | Short-statement route P3 | Feature route P4 | Schema and version routes P5 and P6 | Sweep, docs and build routes P7 to P9 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| FreshSWE-Py | 663 | 505 (557) | 88 (73) | 42 (23) | 28 (10) | 212 (225) | 274 (302) | 86 (70) | 21 (33) | 70 (33) |
| OOD-45 | 45 | 38 (40) | 2 (1) | 2 | 3 (2) | 36 (38) | 0 | 2 (1) | 2 (2) | 5 (4) |
| OOD-B | 82 | 66 (69) | 14 (12) | 1 | 1 (0) | 49 (50) | 17 (18) | 14 (12) | 0 (1) | 2 (1) |
| OOD-C | 186 | 154 (163) | 13 (10) | 8 (5) | 11 (8) | 117 (122) | 27 (30) | 13 (10) | 11 (12) | 18 (12) |

On FreshSWE-Py the most frequent outcome of the rules is the short-statement route (41 percent of statements), because only 43 percent of the statements show code or a traceback. The second most frequent is the feature route (13 percent), although many of those statements are bug reports that happen to contain "add" or "support".

---

## 5. The domain label describes another library most of the time

The domain table was written from the vocabulary of FastAPI, rich and requests. Outside those repositories it still fires, and the solver receives a hint written for a different kind of code.

| Pool | Statements | Generic domain | A specific domain from the table | Most frequent specific labels |
| --- | ---: | ---: | ---: | --- |
| FreshSWE-Py | 663 | 297 (45 percent) | 366 (55 percent) | request/validation parameters 126, markup parsing 27, network 26, typing 23, rendering 23, dependency injection 22 |
| OOD-C | 186 | 103 (55 percent) | 83 | request/validation parameters 16, network 9, serialisation 8, routing 8, compatibility 7, rendering 7 |
| OOD-B | 82 | 46 (56 percent) | 36 | request/validation parameters 9, serialisation 4, rendering 4, network 3, routing 3, markup parsing 3 |
| OOD-45 | 45 | 16 (36 percent) | 29 | dependency injection 6, rendering 5, request/validation parameters 3, markup parsing 3 |

2026-11-23 helper. The patched helper narrows the parameter rule and scores by distinct matches: the generic share rises to 50 percent on FreshSWE-Py, and "request/validation parameters" falls from 126 to 44 statements.

Examples of what the solver is told, from the 70 candidates (2026-11-23 helper):

| Task | Real subject | Label | Hint delivered |
| --- | --- | --- | --- |
| `cachetools_424` | `RRCache.popitem()` raises the wrong exception on an empty cache | dependency injection | "Find where the dependency graph is built and cached; check hashing, scopes and callable wrapping." |
| `apprise_1747` | an attachment is sent with the literal content type "attachment.mimetype" | network | "Print the parsed structure for a crafted header/URL; mind case and whitespace handling." |
| `iceberg_python_4005` | `load_catalog` ignores falsy properties from the caller | documentation examples | "Hidden tutorial tests import example modules: edit the example app exactly as documented." |
| `great_tables_869` | `fmt_date(date_style="iso")` drops leading zeros of the year | widget rendering | "Render the widget to text with record/capture and compare styles per segment." |
| `great_tables_893` | `nanoplot_options` ignores a stroke width of zero | text measurement | "Run a one-line script printing widths/segments for the failing input before editing." |
| `packaging_1218` | Direct URL auth stripping with @ in a password | security | "Follow the credential from header to verifier; statuses and WWW-Authenticate values are literal." |
| `packaging_1232` | `Requirement.__hash__` inconsistent with `__eq__` | build tooling | "Keep it mechanical: the same edit in every call site, compile after each file." |
| `packaging_1244` | pylock accepts bools where TOML integers are expected | console / terminal I/O | "Check the detection predicate (isatty, env var, pipe) and its default in each code path." |
| `more_itertools_1279` | `one()` and `only()` drop a falsy user-supplied exception | routing and lifecycle | "Follow construction order (init, include, startup, teardown); register new behaviour at every entry point." |
| `great_tables_895` | `fmt_index` does not escape LaTeX characters in its pattern | markup parsing | "Build a minimal input string and print the parsed tokens; escaping bugs show up immediately." (fits) |
| `more_itertools_1260` | window sizes not validated through the index protocol | object protocol | "Replace type checks with capability checks where duck-typed objects are accepted." (fits) |
| `markdown_1587` | `Markdown.markdown` loops forever on `<!--` | markup parsing | "Build a minimal input string and print the parsed tokens." (fits) |

Of the 37 candidate statements that received a specific label, three fit and about five fit partly, in my reading; the rest point at machinery that does not exist in the repository. The solver prompt treats the hint as guidance, so a wrong hint costs attention rather than correctness, but it is the one part of the baton that is wrong by construction on unknown repositories.

---

## 6. Other observations

| Observation | Evidence | Relevance |
| --- | --- | --- |
| The test command of the 2026-11-23 helper lacks the scorer's flags | It runs `pytest -x -q -p no:cacheprovider`; the scorer adds `-p no:anyio -o timeout=0 -o python_classes="Test* *Test"` and `PYTHONSAFEPATH=1` (patched on 2026-11-24) | FreshSWE-Py's audit shows why it matters: without the anyio ban, 79 real fixes pass locally that fail on the scorer |
| The helper protects only one level of test files | `PROTECTED_RE` matches `tests/x.py`, not `tests/helpers/x.py` (patched on 2026-11-24) | None of the P20 tasks has nested test files, so P20 cannot show this one |
| The planner's search is the slowest part of `plan` on big files | 6 to 9 seconds per search on `more-itertools`, 13.9 on sqlglot | A cache of parsed files under `.git/bcf/` would remove most of it |
| Short statements starve the search | `click_3642` (217 characters) and `packaging_1299` are the two P20 tasks whose gold file is not in the top 5 | The procedure for short statements exists for them |
| Some statements quote the fix | `packaging_1244` names the function and the old call; `click_3739` quotes the offending lines | A solved task is weaker evidence when the statement shows the code to change |

---

## 7. Changes worth testing on P20, in order

These are candidates for the paired runs described in Document 06, not recommendations to adopt untested.

| Rank | Change | What it should fix | Risk |
| ---: | --- | --- | --- |
| 1 | Run the 2026-11-24 patched helper, not the 2026-11-23 one | Scorer-identical test flags, nested test protection, the `finalize` data-loss fix, five of the twelve routing traps | Already validated on the public set (37 tests, 129 of 129 replays) |
| 2 | Gate the domain table by repository: the FastAPI, rich and requests rules apply only in those repositories; everywhere else the domain is generic | Wrong hints and the P5 trap on unknown repositories | None on the public tasks; on other repositories the solver gets the generic hint, which was right more often |
| 3 | Tighten the category rules: drop bare "reject" and "dependency" from the behaviour-change and build rules, and require a feature verb at the start of the title for the feature rule | The seven traps that remain in the patched helper | A real deprecation whose title says "reject" would be classed as a bug fix, which is the safer error |
| 4 | Cache parsed files between `find` calls | 15 to 25 seconds per task on one-file libraries | A stale cache after an edit; key the cache on path, size and modification time |
| 5 | Check the planner's `names:` line on long issue texts in the first run | The drop of localizer recall from 94 to 56 percent on organic text | None: a measurement |
| 6 | Correct the top-5 parse in `tools/eval_localizer.py` | The documentation understates the localizer by 40 tasks | None |

---

## 8. What the dry run cannot tell

Whether the planner model relays the baton, whether the solver follows the route it is given, how long a task takes on the scorer's hardware, and whether the helper's refusals help or frustrate the model. Those need the first P20 run with the model (Document 06).
