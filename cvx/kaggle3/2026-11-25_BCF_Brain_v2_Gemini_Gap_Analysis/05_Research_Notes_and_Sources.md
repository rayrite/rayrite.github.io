# 05 - Research notes and sources

*Research scope: which claims in Gemini's Task 1 document about the 129 public tasks hold against the dataset, the
official harness documentation, the forum threads it cites and the official documentation of each tool; which of its
traps and proposals close a real gap in the BCF brain for the tasks that are scored; and what a validated brain v2
should change. Scoping calls: per-task fix descriptions were compared with the gold patches where they make a general
claim about a tool, not re-derived one by one; "useful" means a change in behaviour on an unseen repository or the
removal of a loss the harness design makes likely.*

*As of: 2026-11-25, with the forum and leaderboard captured 2026-11-26 01:40 UTC. The competition ends 2026-12-02
23:59 UTC.*

*Confidence note: high on the dataset figures and on tool behaviour, which were recomputed or executed; high on harness
facts, which come from the harness's own README; single-source on everything a forum thread reports; and no evidence
at all on how the scored repositories behave.*

## Executive summary

Gemini's document is accurate where it is mechanical and unreliable where it summarises. All 129 rows of its master
matrix match the dataset; 41 of 64 checked claims hold. Three census figures are wrong, two forum statistics are
quoted with the wrong denominator, and three of its ten laws describe a brain that did not exist. Its categories do not
tell an agent what to do, and its 16 defect cards are 109 per-task labels. Two of its traps were real gaps in the brain
and are now closed: a visible test that fails because it asserts what the issue asks to change, and the names a
compiled file never defines. Its two largest proposals by weight, async graph blindness and a mandatory failing
reproduction, should not be followed: staff say no scored task touches an async function, and the thread the document
cites reports that forcing a reproduction lowered a small agent's score.

## Theme 1 - What is scored, and what the harness does (well-supported)

- The test set has "about 120 tasks ... evenly divided between the public and private splits" and "was curated from a
  set of private repositories" (official competition page, saved 2026-09-29). None of the four public repositories is
  scored.
- Staff, 2026-10-05 (thread 745998, Note on Code Graphs for Async Functions): "`async def` functions are not included
  in the code graph tools. This is true and is an issue for some of the public tasks in fastapi and httpx. However, it
  is not an issue for any of the private repo tasks." Such functions are "at most 1.8% of functions" in the private
  repositories.
- The agent's sandbox installs cached test packages, and the prompt sent to the agent says "All repository and test
  dependencies are ALREADY pre-installed" (HARNESS_README, section 4.2 step 5 and section 5.2). Missing
  `inline_snapshot` or `dirty_equals` is a problem of a competitor's own local sandbox.
- The grader resets every test file and runner configuration the agent touched, then applies its own tests
  (HARNESS_README, section 8.2 step 3). A task resolves only when pytest exits 0 and "every required test node
  ... explicitly passed without being skipped" (section 8.2 step 5).
- `submit_patch()` and `get_status()` are free, and an unsubmitted tree is diffed anyway (HARNESS_README, section 10).

## Theme 2 - Why agents lose tasks (single-source; two independent teams agree)

- Thread 760595, a 91-task trace audit of a small agent (8 solved), 2026-11-20: 12 of 83 failures broke the code; 17
  never opened the right file; 56 of 83 edited the right file. "Finding the code is not the main problem." Of 133
  pytest runs after an edit, 34 showed no pass/fail summary. Two mechanical checks helped: `py_compile` plus `import`
  after every edit, and one related test file with a visible summary. Broken edits went from 12 to 7; solved from 8
  to 11 (exact sign test p about 0.45).
- Thread 760014, 1,800 trials with a 4-bit 4B model, 2026-11-18: in about 65.7 percent of development tasks the
  pre-existing suite passes on unmodified code; in about 34.3 percent "the old tests assert the *buggy* behavior";
  "Forcing the agent to write its own failing reproduction first also backfired (6.0 -> 3.5)". Prompt-level budget
  instructions were ignored in 61.4 percent of tasks; guards behind the tool layer halved timeouts.
- Thread 758854, 2026-11-12: fastapi has 914 async functions and the graph has 0; a skill name that is not lowercase
  kebab-case makes the agent fail to compile and the leaderboard shows 0.00; a second post reports a skill script that
  indexed its own folder instead of the task's code.

## Theme 3 - Tool behaviour behind the per-task claims (well-supported: official documentation and execution on 3.13.15)

- `typing.get_origin()` returns `None` for a PEP 695 `TypeAliasType`; the value is `__value__` (Python documentation,
  typing; PEP 695).
- `ForwardRef('None')` evaluates to `NoneType` on 3.13 and to `None` on 3.14 (execution; What's New in Python 3.14).
  The scorer's sandbox is 3.13.
- `inspect.signature` takes `eval_str` (Python documentation, inspect). `inspect.unwrap` follows `__wrapped__` only,
  while the `inspect.is*function` predicates have seen through `functools.partial` since 3.8 (inspect; functools).
  The document's claim for `fastapi_9753` is half right.
- `DeprecationWarning` is "ignored by default, unless triggered by code in `__main__`" (Python documentation, warnings;
  PEP 565).
- `collections.abc` classes test an interface by checking that the methods are present on the class (collections.abc;
  PEP 544).
- Pydantic: three alias forms (Fields); `model_json_schema(mode='validation')` and `mode='serialization'` (JSON
  Schema); by execution with pydantic 2.13.5, `TypeAdapter(Model, config=...)` raises `PydanticUserError`; the
  changelog places the V1 runtime warning for Python 3.14 in 2.12.1.
- Starlette: `items()` of a multidict returns one value per key (datastructures.py); 0.48.0 renamed the 422 constant
  and kept the old name in a deprecated mapping (status.py at tag 0.48.0); the release notes list the removal of
  `on_event`, `on_startup` and `on_shutdown`, merged 2026-01-24 as pull request 3117.
- urllib3 1.26.18 leaves a `str` body to `http.client`, which encodes with Latin-1; 2.0.0 encodes chunks as UTF-8
  (connection.py at both tags; Python 3.13 http.client).
- `netrc` returns three empty strings for a credential-less default entry on 3.11.9, 3.12.10 and 3.13.15; the rewrite
  is CPython pull request 26330, merged 2021-11-17.
- Versions by the PyPI JSON API: inline-snapshot 0.37.0, dirty-equals 0.11, httpbin 0.10.4, pytest-httpbin 2.1.0,
  typing-inspection 0.4.5.

## Theme 4 - Protocol and standard claims (well-supported: primary text read)

- RFC 6750: `credentials = "Bearer" 1*SP b64token`.
- RFC 9110: `parameter = parameter-name "=" parameter-value`; `OWS = *( SP / HTAB )`; section 15.5.2 is 401 and
  section 15.5.4 is 403.
- RFC 3986: the tilde is unreserved; `pchar` includes the at sign and the colon.
- RFC 8470 and the IANA registry: 425 is Too Early.
- WHATWG HTML Standard: `end-of-line = ( cr lf / cr / lf )` for server-sent events; the `event` field sets the event
  type.
- UAX #29: the pictographic sequence rule is written with ZWJ. EastAsianWidth.txt marks private-use characters
  Ambiguous, where the document says "neutral width 1".
- no-color.org: the variable must be "present and not an empty string".
- ECMA-48 (5th edition) defines `ESC Fe` with final bytes 04/00 to 05/15; the 03/00 to 03/15 class the document cites
  for `rich_3278` is not in it. ECMA-35 was not obtained.
- OpenAPI 3.1.0 and JSON Schema 2020-12 both define `contentMediaType`.

## Theme 5 - What changed on the forum since 2026-11-23 (time-sensitive)

Captured 2026-11-26 01:40 UTC: 386 topics, 17 threads new or changed since 2026-11-23.

- Staff, thread 761004, 2026-11-24: "The failures were caused by a faulty GPU in our pool, going back to October 12.
  About 125 submissions were affected. We have quarantined the GPU, and we will rerun the affected submissions." A
  byte-identical 31B bundle scored 0.20, 0.18 and 0.00 on three runs; the 0.00 runs had a result size of 3,230 bytes.
- Thread 760830, 2026-11-24: the vLLM 0.19.1 `gemma4` tool parser "does not need quotes, or a tool with a list
  argument"; `_parse_gemma4_args("ids:[test_x[1]]")` never returns; about 1 to 2 calls in a thousand carry an array
  or an object in a string argument; "nothing restarts the server or checks its health during a run".
- Thread 761467, 2026-11-24: a submission with `max_time_minutes: 8` failed with "Your submission notebook exceeded the
  allowed runtime."
- Thread 761843, 2026-11-25: a 31B configuration measured at a mean of 253 seconds per task including setup.
- Threads 760471, 761733 and 761897: submissions pending 27 to 33 hours; staff's earlier estimate was 8 to 9 hours in
  the queue and 2 to 2.5 hours scoring.

## Open questions

- How many of the 46 tasks with a removed test line really contain a visible assertion that contradicts the fix. Needs
  the visible tests run before and after each published fix.
- What the scored repositories look like: how many fixes need several files, how often code is duplicated across
  files, how often a visible test asserts what the issue changes.
- Whether the Gemma 4 31B solver keeps a fix when `test` reports a new failure, and what it does with a warning line.
- Whether the skill bundles start on the scorer. The 0.00 runs of 2026-11-22 and later now have a staff explanation,
  but the earlier report of a skill bundle that works locally and scores 0.00 (thread 758854) has none.
- The mean seconds per task of the v2 bundles, and so their total runtime against the 12-hour limit.
- Whether the tool-parser loop has been fixed in the scoring environment. The thread asked the hosts; no staff reply
  was captured.

## Sources

Python documentation, version 3.13 unless noted (fetched 2026-11-26)

1. typing - Support for type hints. https://docs.python.org/3.13/library/typing.html
2. inspect - Inspect live objects. https://docs.python.org/3.13/library/inspect.html
3. warnings - Warning control. https://docs.python.org/3.13/library/warnings.html
4. netrc - netrc file processing. https://docs.python.org/3.13/library/netrc.html
5. functools - Higher-order functions and operations on callable objects. https://docs.python.org/3.13/library/functools.html
6. dataclasses - Data Classes. https://docs.python.org/3.13/library/dataclasses.html
7. collections.abc - Abstract Base Classes for Containers. https://docs.python.org/3.13/library/collections.abc.html
8. signal - Set handlers for asynchronous events. https://docs.python.org/3.13/library/signal.html
9. What's New in Python 3.10. https://docs.python.org/3.13/whatsnew/3.10.html
10. What's New in Python 3.11. https://docs.python.org/3.13/whatsnew/3.11.html
11. What's New in Python 3.14. https://docs.python.org/3.14/whatsnew/3.14.html

Python Enhancement Proposals (fetched 2026-11-26)

12. PEP 544 - Protocols: Structural subtyping (static duck typing). https://peps.python.org/pep-0544/
13. PEP 565 - Show DeprecationWarning in __main__. https://peps.python.org/pep-0565/
14. PEP 593 - Flexible function and variable annotations. https://peps.python.org/pep-0593/
15. PEP 604 - Allow writing union types as X and Y. https://peps.python.org/pep-0604/
16. PEP 657 - Include Fine Grained Error Locations in Tracebacks. https://peps.python.org/pep-0657/
17. PEP 678 - Enriching Exceptions with Notes. https://peps.python.org/pep-0678/
18. PEP 695 - Type Parameter Syntax. https://peps.python.org/pep-0695/

Pydantic (fetched 2026-11-26)

19. Fields. https://docs.pydantic.dev/latest/concepts/fields/
20. Type Adapter. https://docs.pydantic.dev/latest/concepts/type_adapter/
21. JSON Schema. https://docs.pydantic.dev/latest/concepts/json_schema/
22. Serialization. https://docs.pydantic.dev/latest/concepts/serialization/
23. Changelog. https://docs.pydantic.dev/latest/changelog/

Starlette and FastAPI

24. Starlette release notes (fetched 2026-11-26). https://www.starlette.dev/release-notes/
25. Starlette datastructures.py, main branch (GitHub API, 2026-11-26). https://github.com/encode/starlette/blob/main/starlette/datastructures.py
26. Starlette status.py at tag 0.48.0 (GitHub API, 2026-11-26). https://github.com/encode/starlette/blob/0.48.0/starlette/status.py
27. Starlette pull request 3117, Drop main deprecation warnings around applications and routing, merged 2026-01-24. https://github.com/encode/starlette/pull/3117
28. FastAPI release notes (fetched 2026-11-26). https://fastapi.tiangolo.com/release-notes/

urllib3, CPython and PyPI

29. urllib3 connection.py at tag 1.26.18 (GitHub API, 2026-11-26). https://github.com/urllib3/urllib3/blob/1.26.18/src/urllib3/connection.py
30. urllib3 connection.py at tag 2.0.0 (GitHub API, 2026-11-26). https://github.com/urllib3/urllib3/blob/2.0.0/src/urllib3/connection.py
31. CPython issue 83238, Issues with urllib.request.proxy_bypass_environment (GitHub API, 2026-11-26). https://github.com/python/cpython/issues/83238
32. CPython pull request 26330, bpo-28806: Continue work: improve the netrc library, merged 2021-11-17. https://github.com/python/cpython/pull/26330
33. PyPI JSON API for inline-snapshot, dirty-equals, httpbin, pytest-httpbin and typing-inspection (2026-11-26). https://pypi.org/pypi/typing-inspection/json

pytest (fetched 2026-11-26)

34. Exit codes. https://docs.pytest.org/en/stable/reference/exit-codes.html
35. How to skip and xfail tests. https://docs.pytest.org/en/stable/how-to/skipping.html
36. How to capture and manage logs and output, including JUnit XML. https://docs.pytest.org/en/stable/how-to/output.html

Standards (text read 2026-11-26)

37. RFC 6750, The OAuth 2.0 Authorization Framework: Bearer Token Usage. https://www.rfc-editor.org/rfc/rfc6750.txt
38. RFC 9110, HTTP Semantics. https://www.rfc-editor.org/rfc/rfc9110.txt
39. RFC 3986, Uniform Resource Identifier (URI): Generic Syntax. https://www.rfc-editor.org/rfc/rfc3986.txt
40. RFC 8470, Using Early Data in HTTP. https://www.rfc-editor.org/rfc/rfc8470.txt
41. IANA, Hypertext Transfer Protocol (HTTP) Status Code Registry. https://www.iana.org/assignments/http-status-codes/http-status-codes-1.csv
42. WHATWG HTML Standard, section 9.2 Server-sent events. https://html.spec.whatwg.org/multipage/server-sent-events.html
43. Unicode Standard Annex #11, East Asian Width. https://www.unicode.org/reports/tr11/
44. Unicode Standard Annex #29, Unicode Text Segmentation. https://www.unicode.org/reports/tr29/
45. EastAsianWidth.txt, Unicode Character Database. https://www.unicode.org/Public/UCD/latest/ucd/EastAsianWidth.txt
46. no-color.org. https://no-color.org/
47. OpenAPI Specification 3.1.0. https://spec.openapis.org/oas/v3.1.0
48. JSON Schema Validation, draft 2020-12. https://json-schema.org/draft/2020-12/json-schema-validation
49. ECMA-48, 5th edition (June 1991). https://ecma-international.org/wp-content/uploads/ECMA-48_5th_edition_june_1991.pdf

Repositories (GitHub API at the task's base commit, 2026-11-26)

50. encode/httpx at 4acf5c2c37: scripts and source tree. https://github.com/encode/httpx/tree/4acf5c2c37
51. Textualize/rich at 53757bc234: source tree. https://github.com/Textualize/rich/tree/53757bc234

Kaggle

52. Gemma 4 Developer Agent: overview and data pages, saved 2026-09-29. https://www.kaggle.com/competitions/gemma-4-developer-agent
53. HARNESS_README.md, competition data package (local file).
54. Thread 745998, Note on Code Graphs for Async Functions, Elan Markowitz (staff), 2026-10-05. https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/745998
55. Thread 758854, Harness pitfalls: no async functions in the code graph; bad skill names score 0.00, Purnima Pathak, 2026-11-12. https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758854
56. Thread 760014, Withdrawing, and sharing everything we measured, Japan OpenData Lab, 2026-11-18. https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760014
57. Thread 760595, Where a small E4B agent loses tasks, Arn2011, 2026-11-20. https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760595
58. Thread 761004, Byte-identical resubmission scored 0.00, with the staff reply of 2026-11-24. https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/761004
59. Thread 760830, vLLM 0.19.1: the gemma4 tool-call parser can loop forever on a list argument, comments of 2026-11-24. https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760830
60. Thread 761467, Submission exceeded runtime despite an 8-minute per-task limit, 2026-11-24. https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/761467
61. Thread 761843, Looking for a team, 2026-11-25. https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/761843
62. Thread 760471, Update on Submission Queue, staff post of 2026-11-19 with later comments. https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760471
63. Public leaderboard capture, 2026-11-26 01:40 UTC (file `research/leaderboard-public-2026-11-26.csv`).

Local files

64. `input/kagglecomp/kagglecomp_data_package/tasks.jsonl`: the 129 public tasks.
65. `deliverables/2026-11-23_BCF_Brain_and_Dataset_RCA/data/rca_merged.jsonl`: the independent coding of the 11-23 run.

## Reproducibility footer

- Research folder: `scratch/2026-11-25-bcf-brain-v2-gemini-gap/research-bcf-brain-v2-2026-11/`; scripts, notes and
  evaluation outputs in `scratch/2026-11-25-bcf-brain-v2-gemini-gap/`; copies of the notes and scripts in `research/`.
- Date: 2026-11-26 (started 2026-11-25 20:11 local time, UTC-5).
- Pages fetched: 51 through the research toolkit, about 20 through the GitHub API, 5 through the PyPI JSON API, 17
  forum threads through Kaggle's public discussion service.
- Queries by engine: 1 search (Bing through a browser); everything else was a direct fetch of a known primary address.
  The local SearXNG container was down and DuckDuckGo returned its throttle page on the first request.
- Paid credits used: 0. No billable search rung is configured; nothing was charged.
- Spend announced to user: not applicable, 0 credits.
- Failures: the Starlette datastructures page, the urllib3 changelog, the inline-snapshot and pytest-httpbin sites and
  the ECMA-48 address through the page fetcher returned near-empty shells; each was replaced by repository source or
  the PyPI JSON API, and the ECMA-48 PDF was read with the PDF tool. The ECMA-35 address served an HTML page, so that
  standard was not read. The typing check could not run under Python 3.11, which has no `TypeAliasType`; 3.13 is the
  version that matters.
- Untrusted-content incidents: none. No fetched page contained text addressed to the agent.
- Browser: ephemeral headless Chrome launched by the fetch tool per call; the headed pre-warm was skipped by the
  toolkit because search credits remained. No browser was left open.
- OS and runtimes: Windows 11 Pro 10.0.26200, Node 26.8.2, Python 3.12.10 (helper and scripts), 3.13.15 (execution
  checks, the scorer's version), 3.14.7 and 3.11.9 for version comparisons.
- One foreground command that ran the 129-task evaluation exceeded the 10-minute limit and was completed by the
  harness in the background; it was not launched in the background on purpose.
