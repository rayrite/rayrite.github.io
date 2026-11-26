# 02 - Claim verification ledger

Every checkable statement in Gemini's Task 1 document, what it was checked against, and what was found.
The document: `input/kagglecomp/docs/01_Task1_Public_Dataset_Classification_and_Root_Cause_Analysis.md`
(375,857 bytes, 5,300 lines). Prepared 2026-11-25; forum and leaderboard state as of 2026-11-26 01:40 UTC.

## How to read it

- **A** rows are dataset figures, recomputed from `tasks.jsonl` with `scratch/2026-11-25-bcf-brain-v2-gemini-gap/scripts/s02_audit_matrix.py`.
- **B** rows are statements about the harness, the forum, a tool or a standard. Each was settled by reading the primary
  source, by execution under Python 3.13.15 (the scorer's version), or both.
- **C** rows are facts that postdate the document or that it leaves out and that change a conclusion.
- The machine-readable copy is `data/claim_ledger.json`.

## Verdicts at a glance

| Verdict | Claims |
|---|---|
| Holds | 41 |
| Partly | 12 |
| Wrong | 7 |
| Holds under an unstated rule | 3 |
| Not supported | 1 |
| Total | 64 |

"Holds under an unstated rule" means the figure reproduces, but only after guessing a definition the document never gives.

## The ledger

| Id | Claim (section of the document) | Checked against | Verdict | What was found |
|---|---|---|---|---|
| A01 | 129 tasks: fastapi 67, rich 48, requests 13, httpx 1 (1.1) | tasks.jsonl, recomputed | Holds | same counts |
| A02 | 91 single-file and 38 multi-file tasks; 19 two-file tasks; largest fixes 26 and 20 files (1.1, 1.3, 1.4) | tasks.jsonl, recomputed | Holds | same counts; multi-file by repository: fastapi 24, rich 11, requests 2, httpx 1 |
| A03 | Complexity tiers 43, 42, 24, 20; median files per tier 1, 1, 2, 4 (1.3) | tasks.jsonl, recomputed | Holds | added plus removed lines per patch give the same tier on all 129 rows |
| A04 | Year cohorts 10, 21, 48, 50; 98 tasks (75.97 percent) from 2025 and 2026 (1.1, 1.2) | tasks.jsonl, recomputed | Holds | every year-by-repository cell equal |
| A05 | Date span per repository, fastapi 2025-09-16 to 2026-06-20, rich 2023-07-29 to 2026-04-12 (1.1) | tasks.jsonl, recomputed | Holds | created_at minimum and maximum equal for all four repositories |
| A06 | Master matrix: commit, date, files, lines added and removed, tier, in tasks.jsonl order (4) | tasks.jsonl, recomputed | Holds | 129 of 129 rows equal on 6 fields; order equal |
| A07 | Tasks span February 2020 through June 2026 (1.1, prose) | tasks.jsonl, recomputed | Wrong | earliest created_at is 2023-07-29 (rich_3043); the document's own table says 2023-07-29 |
| A08 | Only fastapi_15661 creates a new non-test file; 128 of 129 tasks modify existing files (1.4) | tasks.jsonl, recomputed | Wrong | 11 tasks create a non-test file: 6 outside docs_src (fastapi_15661, fastapi_15030, fastapi_14099, fastapi_14186, fastapi_14953, rich_3930) and 5 new docs_src files (fastapi_13786, fastapi_14262, fastapi_14978, fastapi_15280, fastapi_15800) |
| A09 | 21 tasks touch async code: fastapi 20, httpx 1 (1.1, 1.4, TRAP-4) | tasks.jsonl, recomputed | Holds under an unstated rule | holds as the union of two unstated rules: changed lines contain async or await (11 tasks) or a hunk lies inside an async function (17 tasks) |
| A10 | 15 tasks change docs_src tutorial files (1.4) | tasks.jsonl, recomputed | Holds | 15, all fastapi |
| A11 | test_patch deletes or edits existing test lines in 46 tasks (1.4, TRAP-1) | tasks.jsonl, recomputed | Holds under an unstated rule | 46 test patches contain a removed line; whether the removed assertion contradicts the fix was not measured task by task |
| A12 | No issue has hints; no issue contains a traceback (1.4) | tasks.jsonl, recomputed | Holds | hints_text empty in 129; no traceback string in 129 |
| A13 | test_patch uses inline_snapshot, dirty_equals or httpbin in 38 tasks: 30 FastAPI, 8 Requests (1.4) | tasks.jsonl, recomputed | Wrong | 29 tasks: 21 FastAPI (18 inline_snapshot, 5 dirty_equals) and 8 Requests (httpbin). 30 + 8 is another team's count of tasks ungradable in its own local sandbox (thread 760595) |
| A14 | Trap counts 46, 41, 2, 21, 41, 33, 5, 39 (3) | the matrix column, recomputed | Holds | every count equals the number of matrix rows carrying the trap |
| A15 | 41 terse or misnamed prompts: statements under 220 characters (TRAP-5) | tasks.jsonl and the 11-23 coding | Holds under an unstated rule | 40 statements under 220 characters plus httpx_3672. The rule misses 17 of the 52 tasks the 11-23 coding rated a severe spec gap |
| A16 | 7 categories, 18 sub-categories, 129 tasks (2.1) | arithmetic and the matrix | Holds | every row and column sum equal |
| A17 | About 120 hidden tasks: about 58 public, 60 private, from private repositories (summary) | official competition page, saved 2026-09-29 | Partly | page: about 120 tasks, evenly divided between the public and private splits, curated from private repositories; the 58 and 60 split is not on the page |
| A18 | Baseline agents plateau at 0.20 to 0.24 (6) | public leaderboard, captured 2026-11-26 | Holds | 6,772 teams: 18 at 0.24, 147 at 0.22, 679 at 0.20 |
| B01 | The code graph has zero async def nodes; thread 758854 (1.4, TRAP-4, Law 9) | thread 758854 read in full | Holds | fastapi: 914 async functions in the snapshot, 0 in the graph; httpx: 100, 0. Omitted: staff thread 745998 says no scored task touches an async def |
| B02 | 65.7 percent of agent failures; thread 760014 (TRAP-6, Law 10) | thread 760014 read in full | Wrong | source: in about 65.7 percent of dev tasks the pre-existing test suite already passes on the unmodified code. A property of the tasks, not of the failures |
| B03 | 60 to 86 percent correct-file rate in failed runs; threads 760014 and 760595 (Law 1) | both threads read in full | Partly | 760014: about 60 percent of tasks (67 to 70 of 114) reached the correct file; 760595: 56 of 83 failures (67.5 percent) edited the right file. 86 percent is in neither |
| B04 | 14.5 percent of failed trajectories submit broken syntax or imports; thread 760595 (Law 10) | thread 760595 | Holds | 12 of 83 failures: SyntaxError, IndentationError, NameError or UnboundLocalError |
| B05 | A skipped test does not count as passed (TRAP-8) | HARNESS_README, Phase 2, step 5 | Holds | a task resolves only when every required test node passed without being skipped |
| B06 | Tests that need inline_snapshot, dirty_equals or httpbin fail or skip in unconfigured sandboxes (TRAP-8) | HARNESS_README lines 278 and 328 | Partly | true for a competitor's own subprocess sandbox (760595: 91 of 129 gradable). On the scorer the agent prompt states that all test dependencies are pre-installed and Container A installs cached test site-packages |
| B07 | Mutually exclusive skipif marks in rich_3486 and fastapi_14186 (TRAP-8) | tasks.jsonl, recomputed | Partly | rich_3486 has two skipif marks. fastapi_14186 has the repository helper needs_py_lt_314, not a literal skipif, and on Python 3.13 those tests run |
| B08 | Starlette 0.48 renamed the 422 constant and deprecates the old name (TRAP-7) | starlette/status.py at tag 0.48.0 | Holds | HTTP_422_UNPROCESSABLE_CONTENT is defined; HTTP_422_UNPROCESSABLE_ENTITY is in the deprecated mapping |
| B09 | Python 3.14 and Pydantic 2.12 deprecated pydantic.v1 (fastapi_14609) | pydantic changelog; FastAPI release notes | Partly | changelog: Pydantic V1 will not work with Python 3.14 and greater; a warning is raised. FastAPI 0.128.0 (2025-12-27) dropped support for pydantic.v1 |
| B10 | DeprecationWarning is ignored by default outside __main__ (fastapi_14605) | Python warnings documentation; execution | Holds | quoted in the documentation; the default filter shows the ignore action with no module and the default action for __main__ |
| B11 | ImmutableMultiDict.items() gives one value per key, the last one (fastapi_14356) | starlette/datastructures.py | Holds | items() returns the items of a dict built by a dict comprehension; multi_items() returns every pair |
| B12 | RFC 6750 allows one or more spaces after Bearer (fastapi_14786) | RFC 6750 text | Holds | credentials = Bearer 1*SP b64token |
| B13 | RFC 9110 requires an equals sign in media type parameters (requests_7309) | RFC 9110 text, section 5.6.6 | Holds | parameter = parameter-name equals parameter-value; parameter-value is a token or a quoted string |
| B14 | RFC 8470 defines 425 Too Early, formerly WebDAV Unordered Collection (requests_6592) | RFC 8470 text; IANA registry | Partly | IANA: 425 Too Early, RFC 8470. The WebDAV origin is not in RFC 8470 and was not checked |
| B15 | bpo-39057 is the proxy-bypass suffix bug (requests_7427) | GitHub API, python/cpython | Holds | gh-83238: Issues with urllib.request.proxy_bypass_environment |
| B16 | CPython 3.11 changed netrc for a default entry without credentials (requests_7205) | execution; CPython history | Holds | a credential-less default entry yields three empty strings on 3.11.9, 3.12.10 and 3.13.15; the rewrite is PR 26330 (bpo-28806), merged 2021-11-17 |
| B17 | urllib3 1.x leaves a str body to http.client (Latin-1); 2.x encodes UTF-8 (requests_6757, requests_6589) | urllib3 source at tags 1.26.18 and 2.0.0; Python 3.13 http.client | Holds | 1.26.18 has no encoding for a plain str body and http.client encodes with latin-1; 2.0.0 encodes chunks with utf-8 |
| B18 | get_origin returns None for a PEP 695 TypeAliasType; the value is in __value__ (fastapi_13920) | Python 3.13 typing documentation; execution | Holds | reproduced on 3.13.15 |
| B19 | ForwardRef('None') evaluates to NoneType, which is truthy (fastapi_9425) | execution | Partly | true on 3.13.15, the scorer's version; on 3.14.7 it evaluates to None |
| B20 | inspect.signature has eval_str (fastapi_11355) | Python 3.13 inspect documentation | Holds | signature(callable, follow_wrapped, globals, locals, eval_str); with eval_str an unresolvable annotation raises NameError |
| B21 | functools.partial wrappers are opaque to inspect.isgeneratorfunction (fastapi_9753) | Python inspect documentation; execution | Partly | inspect.unwrap does not open a partial, but isgeneratorfunction, iscoroutinefunction and isasyncgenfunction return True for a partial wrapper (documentation: changed in 3.8; execution on 3.13) |
| B22 | A runtime-checkable isinstance check ignores an instance __getattr__ (requests_7502, requests_7433) | collections.abc documentation; execution | Holds | isinstance of an object whose __getattr__ supplies __iter__ is False; hasattr is True |
| B23 | The pre-fix Requests JSONDecodeError resolves to OSError.__reduce__ (requests_6629) | gold patch; execution | Holds | method resolution puts OSError first; pickling raises TypeError until __reduce__ delegates to the JSON error |
| B24 | TypeAdapter raises ConfigError when config is passed with a BaseModel (fastapi_14482) | execution, pydantic 2.13.5 | Partly | it raises PydanticUserError: Cannot use config when the type is a BaseModel, dataclass or TypedDict. ConfigError is the version 1 name |
| B25 | Pydantic v2 splits the alias into alias, validation_alias and serialization_alias (fastapi_14371) | pydantic fields documentation | Holds | three forms documented; alias is used for both validation and serialization |
| B26 | Starlette removed on_startup, on_shutdown and on_event in PR 3117 (fastapi_14851) | Starlette release notes; GitHub API | Holds | release notes list the removals; the pull request was merged 2026-01-24 |
| B27 | ECMA-48 defines the single-character 0x30 to 0x3F escape class (rich_3278) | ECMA-48, 5th edition, full text | Wrong | ECMA-48 defines ESC Fe with final bytes 04/00 to 05/15; 03/00 to 03/15 appear as CSI parameter bytes. ECMA-35 is the usual reference and was not obtained |
| B28 | Unicode gives unlisted and private-use code points a width of 1 (rich_3944) | EastAsianWidth.txt | Partly | E000..F8FF, F0000..FFFFD and 100000..10FFFD are marked Ambiguous. Width 1 is the terminal-library default, not a Unicode rule |
| B29 | RFC 3986: tilde is unreserved; at sign and colon are path characters (rich_3067, rich_3454) | RFC 3986 text | Holds | unreserved includes the tilde; pchar includes the at sign and the colon |
| B30 | WHATWG SSE: CR, LF or CRLF end a line; the event field sets the event type (fastapi_15588) | WHATWG HTML standard | Holds | end-of-line is cr lf, cr or lf; the event field sets the event type buffer |
| B31 | ZWJ U+200D joins pictographs into one grapheme cluster (rich_4006, rich_3930) | UAX #29 | Holds | the extended pictographic sequence rule is written with ZWJ |
| B32 | NO_COLOR must be present and not empty (rich_3675) | no-color.org | Holds | quoted on the page |
| B33 | PEP 657 adds co_positions; PEP 678 adds add_note and __notes__ (rich_3486, rich_3676) | both PEPs; execution | Holds | both present on 3.13.15 |
| B34 | SIGPIPE is ignored and the devnull recipe is in the signal docs (rich_3468) | Python signal documentation | Holds | quoted on the page; not executable on the Windows host |
| B35 | A dataclass with eq and without frozen is unhashable (fastapi_14372) | Python dataclasses documentation; execution | Holds | reproduced on 3.13.15 |
| B36 | The httpx sync and async trees are generated by scripts/unasync (TRAP-3, httpx_3672) | GitHub API at the base commit | Holds | scripts/unasync exists; src/ahttpx and src/httpx hold 16 modules each with the same names |
| B37 | The Unicode tables of rich_3930 are produced by a generator script (TRAP-3) | GitHub API at the base commit; gold patch | Not supported | no generator in the tree at the base commit; the published fix adds a loader, a version list and 21 data files and no generator |
| B38 | OpenAPI 3.1 and JSON Schema define contentMediaType (fastapi_14953) | OpenAPI 3.1.0; JSON Schema 2020-12 validation | Holds | the keyword is defined in both |
| B39 | The harness edit_file has no compile check (Law 10, context) | replay through the real harness, 2026-11-25 | Holds | the harness accepted an edit that broke the file; the helper refuses it |
| B40 | bcf.py builds an ast symbol table in under 1.2 s (Law 9) | bench_real.log of 2026-11-23 | Partly | find takes 0.52 s to 1.30 s cold and 0.53 s to 1.07 s warm on the fastapi and rich checkouts |
| B41 | bcf.py classify and verify detect pre-existing and expected-red test failures (Law 7) | helper source, v1 and v2 | Wrong | true of v2 only: v1 had no baseline comparison. v2 test reports it (unit tests and rich_4070) |
| B42 | bcf.py spec computes symbol closure and generator redirects (Law 8) | helper source, v1 and v2 | Wrong | the spec holds the top four ranked symbols. v2 adds a twin and call-site report; by measurement it names another file of the fix in 4 of 38 multi-file tasks |
| B43 | BCF mandates a failing reproduction first (Law 10) | solver prompts; thread 760014 | Partly | the repro is required on routes P1 and P2 only. Thread 760014 reports that forcing it lowered a small agent's score from 6.0 to 3.5 on a 20-task subset |
| C01 | Not in the document: staff explained the silent 0.00 scores | thread 761004, 2026-11-24 | Holds | a faulty GPU in the pool since 2026-10-12; about 125 submissions affected; reruns promised |
| C02 | Not in the document: the vLLM tool parser can hang without a list argument | thread 760830, 2026-11-24 | Holds | a bare array element that contains a bracket loops forever; 1 to 2 calls in a thousand in string arguments; nothing restarts the server |
| C03 | Not in the document: an 8-minute per-task cap can exceed the total runtime | thread 761467, 2026-11-24 | Holds | a submission with max_time_minutes 8 failed with exceeded the allowed runtime; 120 tasks at 8 minutes is 16 hours |

## Pattern behind the wrong figures

The three wrong dataset figures have the same cause: a number that describes something else was presented as a
measurement of the dataset.

- "38 tasks use inline_snapshot, dirty_equals or httpbin (30 FastAPI, 8 Requests)" is the count of tasks another team
  could not grade in its own local sandbox (thread 760595). In the dataset 29 test patches carry one of the three names.
- "Only one task creates a new non-test file" misses every fix that adds a module or an example file. Eleven do.
- "February 2020" contradicts the table two lines below it.

The forum citations drift in the same way: a number is kept and its denominator is changed. "65.7 percent of dev tasks
have a green pre-existing suite" became "65.7 percent of agent failures", and "about 60 percent of tasks reached the
correct file" became "60 to 86 percent of failed runs".

## What could not be checked

- Whether each of the 46 test patches with a removed line really removes an assertion that contradicts the fix. That needs
  the visible tests run before and after each published fix; v2's `test` command now does this for one task at a time.
- The "draft WebDAV Unordered Collection" origin of status code 425.
- The ECMA-35 escape-sequence classes: the download address served an HTML page.
- Per-task fix descriptions (129 of them) were read and compared with the gold patches where they make a general claim
  about a tool. They were not re-derived one by one, because a fix for a public repository does not transfer to the
  scored repositories.
