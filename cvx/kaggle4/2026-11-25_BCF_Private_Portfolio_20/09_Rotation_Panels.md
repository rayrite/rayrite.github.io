# Rotation panels R1 to R4: four more sets of 20

Package of 2026-11-25, Document 09. Request: three or four more sets of 20 tasks, to rotate the tests. Files: `portfolio/rotation_r1.jsonl` to `portfolio/rotation_r4.jsonl` (the task rows, in the competition's format), `portfolio/panel_r1.txt` to `portfolio/panel_r4.txt` (one instance id per line), `portfolio/panel_rotation_all.txt` (all 80), `portfolio/rotation_cells.tsv` (panel, cell and repository tier of each task).

## 1. The answer

Four panels of 20 tasks, named R1, R2, R3 and R4. Each follows the rules of P20 (post-release tasks from FreshSWE-Py version 6; 9 solved by both baseline agents, 7 by one, 4 by neither; small fixes; fast gold tests) and each comes from other repositories: 15 to 18 repositories per panel and 26 over the four, none of them one of P20's three. No task is shared with P20, with B40 or with another rotation panel.

| Panel | Repositories | Far | Near | Closed issue | Pull request | Commit and changelog | Solved by both | Tuned agent only | Reference agent only | Neither | Median fix | Slowest gold test | Created from | Created to |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | --- | --- | --- |
| P20, for comparison | 3: `packaging` 8, `click` 6, `more-itertools` 6 | 20 | 0 | 13 | 6 | 1 | 9 | 3 | 4 | 4 | 7 lines | 6.1 s | 2026-04-08 | 2026-09-18 |
| R1 | 15: `black` 3, `isort` 2, `pydantic-settings` 2, `litestar` 2, `strawberry` 1, `loguru` 1, `markdown` 1, `w3lib` 1, `platformdirs` 1, `markdown-it-py` 1, `attrs` 1, `cattrs` 1, `python-multipart` 1, `structlog` 1, `sqlite-utils` 1 | 15 | 5 | 11 | 7 | 2 | 9 | 4 | 3 | 4 | 8.5 lines | 4.4 s | 2026-04-10 | 2026-10-17 |
| R2 | 18: `litestar` 2, `platformdirs` 2, `isort` 1, `tenacity` 1, `w3lib` 1, `pydantic-settings` 1, `urllib3` 1, `strawberry` 1, `black` 1, `humanize` 1, `poetry-core` 1, `loguru` 1, `markdown` 1, `marshmallow` 1, `sqlite-utils` 1, `python-multipart` 1, `pluggy` 1, `cattrs` 1 | 15 | 5 | 10 | 9 | 1 | 9 | 4 | 3 | 4 | 8 lines | 5.7 s | 2026-04-02 | 2026-10-15 |
| R3 | 17: `black` 2, `strawberry` 2, `isort` 2, `loguru` 1, `pluggy` 1, `urllib3` 1, `uvicorn` 1, `pydantic-settings` 1, `humanize` 1, `w3lib` 1, `platformdirs` 1, `tenacity` 1, `parsel` 1, `jsonschema` 1, `marshmallow` 1, `poetry-core` 1, `sqlite-utils` 1 | 15 | 5 | 10 | 9 | 1 | 9 | 2 | 5 | 4 | 10.5 lines | 4.8 s | 2026-05-26 | 2026-10-17 |
| R4 | 18: `w3lib` 2, `isort` 2, `markdown-it-py` 1, `black` 1, `litestar` 1, `strawberry` 1, `urllib3` 1, `typer` 1, `pydantic-settings` 1, `python-multipart` 1, `attrs` 1, `platformdirs` 1, `tenacity` 1, `pluggy` 1, `sqlite-utils` 1, `poetry-core` 1, `parsel` 1, `tqdm` 1 | 15 | 5 | 10 | 8 | 2 | 9 | 2 | 5 | 4 | 10 lines | 4.0 s | 2026-04-05 | 2026-10-03 |

Rotation in three rules:

| Rule | Reason |
| --- | --- |
| Run both versions of the agent on the same panel | Tasks differ in difficulty: the baseline agents solve 9 of 20 and fail 4 of 20 in every panel. A result on R1 and a result on R2 are two different tests, even when both have 20 tasks |
| Use a new panel for each new comparison | A panel that was read while a change was developed is no longer a fair test of that change: the change was shaped by its tasks |
| Pool two or more panels when the difference is small | Twenty pairs detect a real gain of 10 points with no losses 1 percent of the time; 80 pairs, 82 percent of the time (Section 7) |

## 2. A rotation that uses every set once

| Comparison | Set | Why this one | Task-runs for two versions |
| --- | --- | --- | ---: |
| Change 1 | P20 | The main panel: three repositories, 13 closed-issue statements | 40 |
| Quick loops while a change is being written | 5-task slices of the set in use | Minutes instead of hours; the slices are built by the playbook's script and keep the 9 : 7 : 4 mix in proportion | 10 |
| Change 2 | R1 | 15 repositories, 11 closed-issue statements | 40 |
| Change 3 | R2 | 18 repositories | 40 |
| Change 4 | R3 | 17 repositories; its tasks are the newest (created from 2026-05-26) | 40 |
| Final check | R4, then B40 | Two sets that were not used while the changes were developed. R4 has the shortest statements (median 1,003 characters) and the fastest gold tests (22 seconds for all 20); B40 has larger fixes (median 22 lines against 7 in P20) | 120 |

At the 8-minute limit of the bundle, one version on 20 tasks takes 2 hours 40 minutes at most, so two versions take 5 hours 20 minutes; at the pace of the strongest public bundles (277 seconds per task-run; Document 06, Section 4) two versions take about 3 hours, and a 5-task slice on two versions 46 minutes. The slices are described in the playbook package (`deliverables/2026-11-25_BCF_Test_Sets_Playbook/`).

## 3. Why the panels are shaped differently from P20

P20 is a depth panel: three repositories, and 13 of its 20 statements are closed issues. A rotation panel is a breadth panel. The pool could not give four more depth panels:

| Repository tier | Statement | Solved by both | Tuned agent only | Reference agent only | Neither | Total |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| far | closed issue | 12 | 0 | 2 | 21 | 35 |
| far | pull request | 86 | 3 | 15 | 30 | 134 |
| far | commit and changelog | 11 | 1 | 1 | 4 | 17 |
| far | any | 109 | 4 | 18 | 55 | 186 |
| near | closed issue | 10 | 7 | 1 | 22 | 40 |
| near | pull request | 32 | 5 | 4 | 25 | 66 |
| near | commit and changelog | 0 | 0 | 0 | 0 | 0 |
| near | any | 42 | 12 | 5 | 47 | 106 |
| both tiers | any | 151 | 16 | 23 | 102 | 292 |

- Every panel needs 9 tasks solved by both baseline agents, and a closed issue is the statement type a scorer's tasks have. Far repositories had 12 unused closed-issue statements of that kind (P20 holds 5). All 12 are used, three per panel; the other tasks solved by both come from pull requests and changelogs.
- Closed-issue statements solved by one baseline agent are rare in both tiers and rarer far away: 8 of 40 in near repositories, 2 of 35 in far repositories. The far ones are pull-request statements mostly (22 of 186 far tasks were solved by one agent, 17 of 106 near tasks).
- So each rotation panel takes 10 or 11 closed-issue statements, 7 to 9 pull-request statements and 1 or 2 commit-and-changelog statements, and 5 of its 20 tasks from near repositories. The baseline mix stays at 9 : 7 : 4, as in P20.

"Far" and "near" describe the repository, not the contamination risk; all 80 tasks were created after April 2026. Near repositories are the web frameworks and libraries built on the public four's ecosystem: `litestar`, `strawberry`, `pydantic-settings`, `typer`, `uvicorn` and `urllib3` are used; `flask`, `werkzeug`, `sqlmodel` and `textual` had no task that fitted a cell. The helper's keyword rules were written against FastAPI and rich, so near repositories are where those rules may fit, or mislead; Section 6 shows both.

## 4. The recipe

Every panel is filled cell by cell with fixed quotas. A cell is a combination of repository tier, statement source and baseline outcome.

| Cell | Repository tier | Statement | Baseline outcome | Per panel | Used in R1 to R4 | Left |
| --- | --- | --- | --- | --- | ---: | ---: |
| A | far | closed issue | both | 3 / 3 / 3 / 3 | 12 | 0 |
| G | near | closed issue | one agent | 1 / 1 / 1 / 1 | 4 | 4 |
| F | near | closed issue | both | 2 / 2 / 2 / 2 | 8 | 2 |
| H | near | pull request | one agent | 2 / 2 / 2 / 2 | 8 | 1 |
| E | far | closed issue or pull request or commit and changelog | one agent | 4 / 4 / 4 / 4 | 16 | 6 |
| C | far | closed issue | neither | 4 / 4 / 4 / 4 | 16 | 5 |
| D2 | far | commit and changelog | both | 1 / 1 / 1 / 1 | 4 | 7 |
| D1 | far | pull request | both | 3 / 3 / 3 / 3 | 12 | 74 |

"Per panel" reads R1 / R2 / R3 / R4. Cell E takes any statement source. "Left" counts unused tasks outside the three anchor repositories after the four panels were built, with the size limits of Section 5.

Inside a cell, each panel in turn takes its best candidate. The score of a candidate prefers a repository not yet in the panel (at most 4 tasks of a far repository and 3 of a near repository per panel), then a repository the other panels have not used, then small fixes (15 lines or fewer), fast test files (3 seconds or fewer), fewer than 50 fail-to-pass tests and statements under 6,000 characters; a seeded random number breaks ties. The result is fixed for a given seed (20261125). A different panel drafts first in every cell, so no panel always gets the first choice.

Six tasks were kept out after their titles were read: `w3lib_345`, `platformdirs_535`, `platformdirs_473` and `platformdirs_537` (refactors or a vague title), `urllib3_5271` (a title about tests) and `litestar_4929` (a missing optional dependency). The reserve of the anchor repositories (51 usable tasks) stays with P20 and B40 and was not touched.

## 5. The four panels

Each table lists a panel in the order of `panel_rN.txt`. Columns:

| Column | Meaning |
| --- | --- |
| Kind and Statement | Repository tier (far or near) and where the statement comes from: a closed issue, a pull request, or a commit message with its changelog entry |
| Fix size | Lines changed by the reference fix, and files |
| Fail-to-pass tests | Test cases that fail before the fix and pass after it |
| Gold test time | Seconds the test file takes after the fix, measured by the set's authors |
| Solved by | Which baseline agents solved the task: both, the tuned agent only, the reference agent only, neither |
| Harness tier | The competition harness's own difficulty label and composite score (higher is harder) |
| Helper route | What the 2026-11-23 helper's keyword rules decide without a model: category (C1 bug fix, C2 feature, C3 refactor, C4 behaviour change), domain, and the procedure it selects. P2: reproduce the error with a short script, then fix. P3: short statement, read the code around the names it mentions. P4: write a feature. P5: print the generated schema and compare. P6: look for a compatibility shim. P7: change behaviour and update the tests |
| Gold file rank, Gold function rank | Whether the helper's `find` command puts the file the reference fix touches among its first 5 results, and a function of the fix among its first 9 symbols |
| What it is | The title of the issue or pull request |

### R1

Repositories: `psf/black` 3, `PyCQA/isort` 2, `pydantic/pydantic-settings` 2, `litestar-org/litestar` 2, `strawberry-graphql/strawberry` 1, `Delgan/loguru` 1, `Python-Markdown/markdown` 1, `scrapy/w3lib` 1, `tox-dev/platformdirs` 1, `executablebooks/markdown-it-py` 1, `python-attrs/attrs` 1, `python-attrs/cattrs` 1, `Kludex/python-multipart` 1, `hynek/structlog` 1, `simonw/sqlite-utils` 1.

| # | Task | Kind | Statement | Created | Fix size | Fail-to-pass tests | Gold test time | Solved by | Harness tier | Helper route (dry run) | Gold file rank | Gold function rank | What it is |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | --- | --- | --- | --- | --- | --- |
| 1 | `isort_2581` | far | issue | 2026-07-16 | 6 lines, 1 file | 1 | 0.5 s | both | Easy (26.2) | C1 / CMP / P6 | top 5 | not in top 9 | sort_reexports does not respect isort: skip |
| 2 | `black_5148` | far | issue | 2026-05-22 | 8 lines, 1 file | 1 | 4.4 s | both | Easy (26.8) | C2 / GEN / P4 | not found | not in top 9 | Excessive additional whitespace when using """ """ to document functions and tab |
| 3 | `black_5167` | far | issue | 2026-06-07 | 10 lines, 1 file | 1 | 4.1 s | both | Easy (32.2) | C4 / GEN / P7 | top 5 | top 5 | Unexpected version warning |
| 4 | `pydantic_settings_917` | near | issue | 2026-07-22 | 9 lines, 2 files | 2 | 2.1 s | tuned | Medium (36.7) | C1 / NET / P2 | top 5 | not in top 9 | UTF-8 secret files can be silently decoded with the Windows locale encoding |
| 5 | `litestar_4685` | near | issue | 2026-04-11 | 2 lines, 1 file | 1 | 2.1 s | both | Easy (19.4) | C1 / VAL / P2 | top 5 | not in top 9 | Bug: inconsistent type of Decimal in JSON and OpenAPI schema |
| 6 | `litestar_4925` | near | issue | 2026-07-16 | 2 lines, 1 file | 2 | 1.8 s | both | Easy (22.3) | C1 / VAL / P2 | top 5 | top 1 | Enhancement: Prometheus group_path=False default causes unbounded metric cardina |
| 7 | `pydantic_settings_910` | near | pr | 2026-07-14 | 22 lines, 1 file | 2 | 2.1 s | tuned | Medium (38.5) | C1 / TYP / P3 | not found | not in top 9 | fix: parse enum names through nested annotations |
| 8 | `strawberry_4568` | near | pr | 2026-10-05 | 14 lines, 1 file | 6 | 1.7 s | tuned | Medium (36.9) | C1 / VAL / P2 | not found | not in top 9 | fix: make nullable input fields optional for clients |
| 9 | `loguru_1529` | far | issue | 2026-10-17 | 7 lines, 1 file | 3 | 0.8 s | reference | Easy (33.9) | C1 / CON / P2 | not found | not in top 9 | Queued standard handlers use the consumer thread instead of the producer thread |
| 10 | `markdown_7a29324e03` | far | commit+changelog | 2026-10-03 | 12 lines, 1 file | 1 | 0.2 s | tuned | Easy (32.8) | C1 / GEN / P3 | top 5 | not in top 9 | Fix inline HTML case |
| 11 | `w3lib_285` | far | pr | 2026-07-24 | 15 lines, 1 file | 8 | 2.0 s | reference | Easy (28.0) | C1 / PAR / P3 | top 5 | top 2 | treat backslash as slash for special-scheme urls in _urlsplit |
| 12 | `platformdirs_571` | far | pr | 2026-09-25 | 27 lines, 1 file | 6 | 0.4 s | reference | Medium (36.0) | C1 / GEN / P3 | top 5 | top 3 | 🐛 fix(windows): treat empty PUBLIC and fallback env vars as unset |
| 13 | `isort_2563` | far | issue | 2026-07-25 | 7 lines, 1 file | 1 | 1.8 s | neither | Easy (26.3) | C1 / GEN / P2 | top 5 | not in top 9 | isort.core.process incorrectly returns False if only changes to lines before imp |
| 14 | `markdown_it_py_425` | far | issue | 2026-09-09 | 29 lines, 1 file | 5 | 0.3 s | neither | Easy (33.7) | C1 / REN / P2 | top 5 | top 1 | Hard line breaks parsed incorrectly in version 1.1.0 |
| 15 | `black_5211` | far | issue | 2026-07-03 | 19 lines, 1 file | 1 | 4.0 s | neither | Easy (32.6) | C1 / RTG / P2 | top 5 | top 1 | Invalid BLACK_NUM_WORKERS value can produce a raw ValueError traceback |
| 16 | `attrs_1541` | far | issue | 2026-04-16 | 26 lines, 1 file | 5 | 3.7 s | neither | Medium (45.3) | C2 / GEN / P4 | top 5 | top 5 | Add decorator for convert |
| 17 | `cattrs_5bf7c97293` | far | commit+changelog | 2026-09-14 | 3 lines, 1 file | 1 | 0.5 s | both | Easy (23.9) | C1 / PAR / P3 | top 5 | top 1 | Escape the index note when structuring heterogeneous tuples |
| 18 | `python_multipart_230` | far | pr | 2026-04-10 | 2 lines, 1 file | 2 | 1.7 s | both | Easy (24.1) | C1 / VAL / P2 | top 5 | top 3 | Emit field_end for trailing bare field names on finalize |
| 19 | `structlog_807` | far | pr | 2026-05-02 | 5 lines, 1 file | 3 | 0.6 s | both | Easy (25.2) | C1 / EXM / P2 | top 5 | not in top 9 | Use WeakKeyDictionary for WRITE_LOCKS to prevent file object leaks |
| 20 | `sqlite_utils_828` | far | pr | 2026-08-11 | 4 lines, 1 file | 1 | 2.9 s | both | Easy (26.1) | C2 / DI / P4 | top 5 | top 8 | Escape tokenize argument in enable_fts to prevent SQL injection |

### R2

Repositories: `litestar-org/litestar` 2, `tox-dev/platformdirs` 2, `PyCQA/isort` 1, `jd/tenacity` 1, `scrapy/w3lib` 1, `pydantic/pydantic-settings` 1, `urllib3/urllib3` 1, `strawberry-graphql/strawberry` 1, `psf/black` 1, `python-humanize/humanize` 1, `python-poetry/poetry-core` 1, `Delgan/loguru` 1, `Python-Markdown/markdown` 1, `marshmallow-code/marshmallow` 1, `simonw/sqlite-utils` 1, `Kludex/python-multipart` 1, `pytest-dev/pluggy` 1, `python-attrs/cattrs` 1.

| # | Task | Kind | Statement | Created | Fix size | Fail-to-pass tests | Gold test time | Solved by | Harness tier | Helper route (dry run) | Gold file rank | Gold function rank | What it is |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | --- | --- | --- | --- | --- | --- |
| 1 | `isort_2542` | far | issue | 2026-05-12 | 22 lines, 1 file | 1 | 0.5 s | both | Easy (30.6) | C1 / GEN / P2 | top 5 | top 1 | git_hook(lazy=True) not checking unstaged changes |
| 2 | `tenacity_660` | far | issue | 2026-07-29 | 9 lines, 1 file | 134 | 2.3 s | both | Easy (26.7) | C1 / RTG / P2 | top 5 | top 1 | retry_if_exception_cause_type spins forever when the exception cause chain conta |
| 3 | `w3lib_266` | far | issue | 2026-06-15 | 2 lines, 1 file | 1 | 0.3 s | both | Easy (19.9) | C1 / GEN / P2 | top 5 | not in top 9 | get_meta_refresh() is quadratic on malformed HTML (catastrophic backtracking) |
| 4 | `pydantic_settings_1049` | near | issue | 2026-10-15 | 9 lines, 1 file | 10 | 1.9 s | tuned | Easy (30.2) | C1 / VAL / P2 | top 5 | top 2 | CLI field typed as an alias of list[dict] merges the list into one dict |
| 5 | `litestar_4669` | near | issue | 2026-04-04 | 2 lines, 1 file | 1 | 1.6 s | both | Easy (21.2) | C1 / GEN / P2 | not found | not in top 9 | Bug: KeyError when a ClassVar exists on msgspec dto struct |
| 6 | `urllib3_5254` | near | issue | 2026-10-04 | 5 lines, 1 file | 1 | 0.6 s | both | Easy (26.2) | C1 / NET / P2 | top 5 | top 2 | Concurrent HTTP/2 probes can leave threads blocked in acquire_and_get |
| 7 | `litestar_4814` | near | pr | 2026-05-28 | 6 lines, 1 file | 2 | 2.2 s | tuned | Easy (24.3) | C1 / TYP / P2 | top 5 | top 1 | fix(openapi): handle Annotated metadata in Optional[Literal[...]] schemas |
| 8 | `strawberry_4360` | near | pr | 2026-04-25 | 7 lines, 1 file | 5 | 5.7 s | reference | Medium (35.9) | C1 / VAL / P3 | top 5 | top 1 | Fix error type when field with resolver= lacks type annotations |
| 9 | `black_5438` | far | pr | 2026-09-29 | 9 lines, 1 file | 1 | 4.4 s | tuned | Easy (29.9) | C1 / GEN / P2 | top 5 | top 1 | Keep the CRLF ending of the line skipped by --skip-source-first-line |
| 10 | `humanize_328` | far | pr | 2026-06-30 | 12 lines, 1 file | 4 | 0.3 s | reference | Easy (22.7) | C1 / RTG / P2 | top 5 | top 1 | Carry metric() to the next SI prefix when rounding reaches 1000 |
| 11 | `poetry_core_953` | far | pr | 2026-08-09 | 16 lines, 1 file | 2 | 1.0 s | reference | Easy (28.7) | C1 / PAR / P2 | not found | not in top 9 | Fix Version.difference with a local variant of the same version |
| 12 | `platformdirs_573` | far | pr | 2026-09-25 | 29 lines, 1 file | 6 | 0.6 s | tuned | Easy (34.6) | C1 / DI / P3 | top 5 | top 6 | 🐛 fix(macos): detect Homebrew Python by its opt/ framework path |
| 13 | `loguru_1508` | far | issue | 2026-08-29 | 5 lines, 1 file | 2 | 0.9 s | neither | Easy (25.5) | C1 / GEN / P2 | top 5 | top 1 | {time:x} is incorrect for negative timestamps due to toward-zero truncation |
| 14 | `markdown_1621` | far | issue | 2026-08-24 | 9 lines, 1 file | 89 | 0.3 s | neither | Medium (39.7) | C1 / REN / P3 | not found | not in top 9 | Super-linear (quadratic) rendering on many inline links: '[link](x)' * N |
| 15 | `marshmallow_2937` | far | issue | 2026-04-02 | 32 lines, 1 file | 2 | 0.5 s | neither | Medium (48.1) | C2 / VAL / P4 | top 5 | not in top 9 | Update Email validator to support IDNs |
| 16 | `platformdirs_540` | far | issue | 2026-09-08 | 33 lines, 2 files | 73 | 1.3 s | neither | Hard (55.6) | C1 / GEN / P3 | top 5 | not in top 9 | user_state_dir returns invalid relative paths |
| 17 | `sqlite_utils_a4acc3958c` | far | commit+changelog | 2026-07-05 | 5 lines, 1 file | 5 | 0.5 s | both | Easy (32.0) | C1 / VAL / P3 | top 5 | top 3 | Fix transform() corrupting TRUE/FALSE/NULL column defaults into strings |
| 18 | `python_multipart_258` | far | pr | 2026-04-10 | 4 lines, 1 file | 2 | 1.8 s | both | Easy (25.9) | C1 / GEN / P3 | top 5 | not in top 9 | Handle CTE values case-insensitively |
| 19 | `pluggy_727` | far | pr | 2026-09-12 | 5 lines, 1 file | 1 | 0.3 s | both | Easy (25.2) | C4 / CON / P7 | top 5 | top 5 | Point the missing-argument warning at the code making the hook call |
| 20 | `cattrs_776` | far | pr | 2026-09-07 | 2 lines, 1 file | 1 | 0.5 s | both | Easy (25.5) | C1 / VAL / P2 | top 5 | top 2 | Sort extra keys when formatting ForbiddenExtraKeysError |

### R3

Repositories: `psf/black` 2, `strawberry-graphql/strawberry` 2, `PyCQA/isort` 2, `Delgan/loguru` 1, `pytest-dev/pluggy` 1, `urllib3/urllib3` 1, `encode/uvicorn` 1, `pydantic/pydantic-settings` 1, `python-humanize/humanize` 1, `scrapy/w3lib` 1, `tox-dev/platformdirs` 1, `jd/tenacity` 1, `scrapy/parsel` 1, `python-jsonschema/jsonschema` 1, `marshmallow-code/marshmallow` 1, `python-poetry/poetry-core` 1, `simonw/sqlite-utils` 1.

| # | Task | Kind | Statement | Created | Fix size | Fail-to-pass tests | Gold test time | Solved by | Harness tier | Helper route (dry run) | Gold file rank | Gold function rank | What it is |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | --- | --- | --- | --- | --- | --- |
| 1 | `loguru_1507` | far | issue | 2026-08-29 | 2 lines, 1 file | 2 | 0.8 s | both | Easy (16.0) | C1 / GEN / P2 | top 5 | top 2 | Negative timezone offsets with sub-minute components are formatted one minute to |
| 2 | `black_5461` | far | issue | 2026-10-03 | 10 lines, 1 file | 1 | 4.0 s | both | Easy (28.9) | C1 / VAL / P2 | not found | not in top 9 | Black changes the value of a docstring containing a form feed |
| 3 | `pluggy_767` | far | issue | 2026-10-17 | 21 lines, 1 file | 1 | 0.4 s | both | Medium (39.0) | C1 / GEN / P3 | top 5 | top 1 | list_plugin_distinfo() keeps unregistered plugins |
| 4 | `urllib3_5062` | near | issue | 2026-05-26 | 3 lines, 1 file | 1 | 2.0 s | tuned | Easy (20.5) | C1 / CMP / P6 | top 5 | not in top 9 | Confusing FullPoolError raised when passing a string timeout |
| 5 | `uvicorn_3199` | near | issue | 2026-10-11 | 2 lines, 1 file | 1 | 0.7 s | both | Easy (14.3) | C1 / NET / P2 | top 5 | top 1 | --workers N loses TCP_NODELAY: every keep-alive request past the first costs ~43 |
| 6 | `pydantic_settings_912` | near | issue | 2026-07-15 | 8 lines, 1 file | 4 | 1.3 s | both | Easy (29.2) | C1 / VAL / P2 | top 5 | top 3 | Dotenv extras silently dropped when their name shares a complex field's prefix |
| 7 | `strawberry_4657` | near | pr | 2026-10-02 | 21 lines, 1 file | 2 | 2.8 s | tuned | Easy (31.6) | C4 / VAL / P7 | top 5 | top 3 | Raise an error for unions with the same name but different types |
| 8 | `strawberry_4693` | near | pr | 2026-10-12 | 18 lines, 1 file | 2 | 1.0 s | reference | Easy (31.6) | C1 / VAL / P2 | top 5 | top 1 | Resolve the graphql_type of shared Annotated fields in each type's module |
| 9 | `isort_2567` | far | pr | 2026-07-24 | 12 lines, 1 file | 1 | 0.9 s | reference | Easy (26.6) | C1 / GEN / P2 | top 5 | not in top 9 | Keep aliased import when the plain name carries a comment |
| 10 | `humanize_320` | far | pr | 2026-06-25 | 7 lines, 1 file | 2 | 0.4 s | reference | Easy (20.5) | C1 / GEN / P3 | top 5 | top 1 | Stop printing two minus signs in fractional for a negative mixed number |
| 11 | `w3lib_317` | far | pr | 2026-09-08 | 11 lines, 1 file | 1 | 0.5 s | reference | Easy (30.0) | C1 / NET / P3 | top 5 | not in top 9 | Handle UTF-{16,32} the same for all 3 sources of encoding. |
| 12 | `platformdirs_562` | far | pr | 2026-09-25 | 7 lines, 1 file | 2 | 1.1 s | reference | Easy (29.5) | C1 / GEN / P3 | top 5 | top 3 | 🐛 fix(unix): ignore XDG_RUNTIME_DIR when redirecting root |
| 13 | `isort_2558` | far | issue | 2026-06-15 | 12 lines, 1 file | 1 | 0.8 s | neither | Easy (26.9) | C2 / VAL / P4 | not found | not in top 9 | NOQA adds extra space characters |
| 14 | `tenacity_654` | far | issue | 2026-07-13 | 12 lines, 1 file | 1 | 2.3 s | neither | Medium (36.5) | C1 / GEN / P3 | top 5 | not in top 9 | exponential wait issue |
| 15 | `black_5476` | far | issue | 2026-10-05 | 12 lines, 1 file | 2 | 4.8 s | neither | Easy (25.9) | C1 / GEN / P2 | top 5 | top 1 | Check passes on unformatted file after running with line ranges |
| 16 | `parsel_352` | far | issue | 2026-08-03 | 33 lines, 1 file | 4 | 0.3 s | neither | Medium (36.6) | C1 / DI / P3 | top 5 | top 7 | Use of functools.lru_cache or functools.cache on methods can lead to memory leak |
| 17 | `jsonschema_865c27fc3d` | far | commit+changelog | 2026-09-07 | 2 lines, 1 file | 1 | 0.7 s | both | Easy (34.9) | C1 / OAS / P5 | top 5 | not in top 9 | Properly set path and schema_path on nested boolean schemas. |
| 18 | `marshmallow_3016` | far | pr | 2026-08-08 | 2 lines, 1 file | 4 | 0.5 s | both | Easy (17.7) | C4 / VAL / P7 | top 5 | not in top 9 | Fix URL validator rejecting a fragment after an empty path |
| 19 | `poetry_core_949` | far | pr | 2026-06-08 | 11 lines, 1 file | 3 | 1.3 s | both | Easy (29.6) | C1 / GEN / P3 | top 5 | top 1 | Fix VersionRange.intersect broadening for local-version other |
| 20 | `sqlite_utils_811` | far | pr | 2026-07-25 | 4 lines, 1 file | 2 | 0.5 s | both | Easy (30.8) | C1 / VAL / P3 | top 5 | top 1 | Fix _decode_default_value to unescape doubled single quotes in string defaults |

### R4

Repositories: `scrapy/w3lib` 2, `PyCQA/isort` 2, `executablebooks/markdown-it-py` 1, `psf/black` 1, `litestar-org/litestar` 1, `strawberry-graphql/strawberry` 1, `urllib3/urllib3` 1, `fastapi/typer` 1, `pydantic/pydantic-settings` 1, `Kludex/python-multipart` 1, `python-attrs/attrs` 1, `tox-dev/platformdirs` 1, `jd/tenacity` 1, `pytest-dev/pluggy` 1, `simonw/sqlite-utils` 1, `python-poetry/poetry-core` 1, `scrapy/parsel` 1, `tqdm/tqdm` 1.

| # | Task | Kind | Statement | Created | Fix size | Fail-to-pass tests | Gold test time | Solved by | Harness tier | Helper route (dry run) | Gold file rank | Gold function rank | What it is |
| ---: | --- | --- | --- | --- | --- | ---: | ---: | --- | --- | --- | --- | --- | --- |
| 1 | `markdown_it_py_416` | far | issue | 2026-09-08 | 10 lines, 2 files | 2 | 0.2 s | both | Easy (32.2) | C1 / REN / P2 | top 5 | top 1 | IndexError: table inside a blockquote at end of input (html_block.py, heading.py |
| 2 | `black_5471` | far | issue | 2026-10-03 | 17 lines, 1 file | 1 | 4.0 s | both | Easy (30.2) | C1 / GEN / P2 | top 5 | not in top 9 | force-exclude doesnt apply when the file path has .. in it |
| 3 | `w3lib_264` | far | issue | 2026-06-15 | 2 lines, 1 file | 1 | 0.3 s | both | Easy (27.2) | C1 / GEN / P3 | top 5 | not in top 9 | w3lib.html.get_base_url() can be slow due to quadratic regex complexity |
| 4 | `litestar_4921` | near | issue | 2026-07-14 | 11 lines, 1 file | 5 | 2.0 s | tuned | Easy (33.7) | C1 / OAS / P5 | not found | not in top 9 | Bug: Autogenerated OpenAPI titles don't handle acronyms well |
| 5 | `strawberry_4504` | near | issue | 2026-07-06 | 26 lines, 1 file | 2 | 1.0 s | both | Easy (32.5) | C1 / VAL / P2 | top 5 | not in top 9 | print_schema duplicates enum types referenced by schema directive fields |
| 6 | `urllib3_5057` | near | issue | 2026-08-10 | 10 lines, 1 file | 1 | 1.9 s | both | Medium (40.8) | C1 / GEN / P3 | top 5 | top 1 | Make custom queue class feature work well with gevent |
| 7 | `typer_1791` | near | pr | 2026-05-27 | 5 lines, 1 file | 1 | 1.3 s | reference | Easy (27.2) | C1 / GEN / P2 | top 5 | not in top 9 | 🐛 Ensure that an envvar set for a typer.Option list is split on whitespace |
| 8 | `pydantic_settings_958` | near | pr | 2026-09-04 | 9 lines, 1 file | 2 | 1.4 s | tuned | Easy (30.4) | C1 / TYP / P3 | top 5 | top 2 | Fix CliVariadicArg empty-value handling for named options |
| 9 | `python_multipart_244` | far | pr | 2026-04-05 | 3 lines, 1 file | 121 | 1.8 s | reference | Easy (21.1) | C1 / PAR / P3 | top 5 | top 1 | Validate chunk_size in parse_form() |
| 10 | `isort_2267` | far | commit+changelog | 2026-08-18 | 8 lines, 1 file | 3 | 0.5 s | reference | Easy (29.0) | C1 / WID / P3 | top 5 | top 5 | Fix word-wrapping of 'from ... import *' into invalid Python |
| 11 | `attrs_1571` | far | pr | 2026-08-01 | 33 lines, 2 files | 168 | 0.6 s | reference | Medium (36.1) | C2 / VAL / P4 | not found | not in top 9 | Add ne validator |
| 12 | `platformdirs_538` | far | pr | 2026-09-08 | 20 lines, 1 file | 4 | 0.8 s | reference | Easy (32.9) | C1 / GEN / P2 | top 5 | not in top 9 | fix: return one user path for root under multipath |
| 13 | `isort_2574` | far | issue | 2026-07-04 | 15 lines, 1 file | 1 | 0.8 s | neither | Easy (34.7) | C1 / GEN / P2 | not found | not in top 9 | isort: skip not working when futures imports are present |
| 14 | `tenacity_640` | far | issue | 2026-05-22 | 8 lines, 1 file | 3 | 2.5 s | neither | Medium (47.1) | C1 / GEN / P3 | top 5 | top 8 | TryAgain ignores reraise=True |
| 15 | `pluggy_732` | far | issue | 2026-09-22 | 21 lines, 2 files | 8 | 0.3 s | neither | Medium (41.6) | C1 / GEN / P3 | not found | not in top 9 | Howto handle hook changes |
| 16 | `w3lib_300` | far | issue | 2026-08-13 | 22 lines, 1 file | 9 | 0.3 s | neither | Easy (34.1) | C1 / GEN / P3 | top 5 | not in top 9 | Python's gb18030 decoder is not the same as w3c's |
| 17 | `sqlite_utils_adc10df981` | far | commit+changelog | 2026-07-06 | 11 lines, 1 file | 13 | 0.6 s | both | Easy (34.3) | C1 / VAL / P3 | top 5 | top 4 | Fix for db.query("; COMMIT") bypasses the first-token scanner |
| 18 | `poetry_core_966` | far | pr | 2026-09-04 | 3 lines, 1 file | 1 | 1.0 s | both | Easy (20.5) | C1 / TYP / P3 | top 5 | top 2 | Fix union of public and local versions |
| 19 | `parsel_374` | far | pr | 2026-09-21 | 2 lines, 1 file | 1 | 0.2 s | both | Easy (30.1) | C1 / GEN / P3 | top 5 | top 1 | Keep nested iflatten iteration lazy |
| 20 | `tqdm_1783` | far | pr | 2026-07-27 | 5 lines, 1 file | 1 | 0.3 s | both | Easy (28.7) | C1 / GEN / P2 | top 5 | not in top 9 | Treat inf total as unknown in reset() too |

## 6. Validation

The checks of Document 05 were repeated on the 80 tasks. Nothing here runs a model: the helper was driven on each snapshot with a mechanical brief and its output was compared with the reference fix.

| Panel | Gold patch identical to git apply through the helper | Gold file in the helper's top 5 | Gold function among the top 9 symbols | Repro route P2 | Short-statement route P3 | Other routes | Easy tier | Medium tier | Hard tier |
| --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: | ---: |
| R1 | 20 of 20 | 16 of 20 | 10 of 20 | 10 | 5 | P4 3, P6 1, P7 1 | 15 | 5 | 0 |
| R2 | 20 of 20 | 17 of 20 | 13 of 20 | 12 | 6 | P4 1, P7 1 | 16 | 3 | 1 |
| R3 | 20 of 20 | 18 of 20 | 12 of 20 | 7 | 8 | P4 1, P5 1, P6 1, P7 2 | 17 | 3 | 0 |
| R4 | 20 of 20 | 16 of 20 | 9 of 20 | 7 | 11 | P4 1, P5 1 | 16 | 4 | 0 |

| Check over all 80 | Result |
| --- | --- |
| Reference fix applied through the helper's editor, compared with `git apply` | 80 of 80 byte-identical (87 files, 149 hunks) |
| Helper's `find`: gold file in the top 5 | 67 of 80; gold function among the top 9 symbols: 44 of 80; gold file in the top 3: 35 of 80 |
| Helper's `find`: time per task | Median 0.59 seconds, longest 6.08 seconds |
| Shared tasks with P20 or B40 | 0 |
| Shared tasks between rotation panels | 0 |
| Difficulty tier from the harness's engine | Easy 64, Medium 15, Hard 1 (one task of R2) |

### 6.1 Routes under each helper's own rules

| Helper | P2 reproduce | P3 short statement | P4 feature | P5 schema | P6 compatibility | P7 behaviour change |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 2026-11-23 (shipped) | 36 | 30 | 6 | 2 | 2 | 4 |
| 2026-11-24 (patched) | 38 | 30 | 6 | 4 | 2 | 0 |

### 6.2 Eight statements on which the keyword rules pick a procedure that does not fit

| Task | Panel | What the task is | Word that fired the rule | Shipped helper | Patched helper |
| --- | --- | --- | --- | --- | --- |
| `black_5148` | R1 | Bug: too much whitespace before a docstring | "additional" in the title | C2 feature, route P4 | same |
| `isort_2558` | R3 | Bug: a `NOQA` comment gains a space | "adds" in the title | C2 feature, route P4 | same |
| `sqlite_utils_828` | R4 | Bug: an SQL injection in `enable_fts` | "enable_fts" in the title | C2 feature, route P4 | same |
| `black_5167` | R1 | Bug: a version warning appears when it should not | "warning" in the title | C4 behaviour change, route P7 | C1 bug fix, route P2 |
| `pluggy_727` | R2 | Bug: a warning points at the wrong line | "warning" in the title | C4 behaviour change, route P7 | C1 bug fix, route P2 |
| `marshmallow_3016` | R3 | Bug: a URL validator rejects a valid fragment | "rejecting" in the title | C4 behaviour change, route P7 | C1 bug fix, route P2 |
| `isort_2581` | R1 | Bug: `sort_reexports` ignores a setting | "python 3.10" and "workaround" in the body | Compatibility domain, route P6 | same |
| `urllib3_5062` | R3 | Bug: a confusing error for a string timeout | "python 3.14" and "urllib3" in the body | Compatibility domain, route P6 | same |

These are 8 of 80 statements (10 percent), against 12 of 70 (17 percent) on the candidates of Document 05, which included the OOD sets. The patched helper repairs the three P7 cases and leaves five. Three of the five are bug fixes whose titles contain a word of the feature list; two are bug fixes whose body mentions a Python version, a word of the compatibility list. Both lists are first-match rules on the whole statement, and both are candidates for the tests proposed in Document 05, Section 7. The five that remain sit in three panels (R1, R3 and R4), so a repair of the rules can be tried on one panel while another stays untouched for the confirmation run.

Two further routes are debatable rather than wrong: `strawberry_4504` (R1) and `litestar_4685` (R3) go from P2 to the schema route P5 in the patched helper, which suits tasks about generated OpenAPI schemas.

## 7. What pooled panels can show

The table is the paired sign test of Document 06 with the panel count as the number of pairs. "One run" means one run of each version on every task of the panels named.

| Real effect of the change | One panel, 20 pairs | Two panels, 40 pairs | Three panels, 60 pairs | Four panels, 80 pairs | P20 and R1 to R4, 100 pairs | The public 129, 129 pairs |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| +10 points, no losses (2 tasks gained per 20) | 1% | 21% | 56% | 82% | 94% | 99% |
| +10 points against 5 points of losses (2 gained, 1 lost) | 1% | 5% | 9% | 13% | 18% | 24% |
| +20 points against 5 (4 gained, 1 lost) | 10% | 36% | 58% | 74% | 84% | 93% |
| +20 points, no losses (4 gained) | 20% | 84% | 99% | 100% | 100% | 100% |
| +30 points against 10 (6 gained, 2 lost) | 17% | 44% | 63% | 78% | 88% | 95% |

Reading: a change that gains four tasks per 20 and loses one is detected 36 percent of the time on two panels (40 pairs) and 74 percent of the time on four (80 pairs). A change that gains four per 20 and loses none is detected 84 percent of the time on two panels and 99 percent of the time on three. Three paired runs of one panel also reach 99 percent for the second case (Document 06), so repeats and rotation answer two different questions: rotate when the question is "does it hold on other repositories", repeat when the question is "is the difference on this panel real".

## 8. What is left, and a fifth panel

| Size limits of the usability filter | Unused tasks | A | G | F | H | E | C | D2 | D1 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| as used: 35 lines, 2 files, 10 seconds | 212 | 0 | 4 | 2 | 1 | 6 | 5 | 7 | 74 |
| 50 lines, 3 files, 15 seconds | 251 | 0 | 4 | 2 | 3 | 10 | 13 | 8 | 77 |
| 80 lines, 4 files, 20 seconds | 298 | 0 | 6 | 2 | 4 | 12 | 16 | 11 | 79 |
| any number of lines and files, 20 seconds | 346 | 0 | 7 | 2 | 4 | 12 | 19 | 11 | 80 |

Unused tasks outside the anchor repositories after the four panels: 212 (126 far, 86 near). Reserve of the three anchor repositories, untouched: 51 usable tasks. Columns A to D1 are the cells of Section 4; a panel needs 3, 1, 2, 2, 4, 4, 1 and 3.

A fifth panel with this recipe cannot be built from FreshSWE-Py version 6: the 12 far-repository closed-issue statements solved by both baseline agents are all used, and that does not change when the size limits are relaxed (checked with limits of 50, 80 and any number of lines). Three other shapes are possible:

| Shape of a fifth panel | What is available | What changes against R1 to R4 |
| --- | --- | --- |
| Pull-request statements only | 74 unused far-repository pull-request statements solved by both baseline agents | No closed-issue statement, so it tests a different reading skill than P20 |
| Larger fixes | With limits of 80 lines, 4 files and 20 seconds: 16 far closed-issue statements solved by neither, 12 far statements solved by one agent | Longer patches, closer to B40 (median 22 lines) than to P20 (7) |
| Another held-out set | The 45 tasks of OOD-45 and the 82 of OOD-B; none of them is in P20, B40 or R1 to R4. Or tasks mined by the recipe of Document 04, Section 6 | The statements come from another author, with other validation rules |

`tools/build_rotation.py` writes any of them: change the `CELLS` table and the limits in `tools/rotation_pool.py`, then run `select` and `report` as described in `tools/README.md`.

## 9. Not verified

| Not verified | Why |
| --- | --- |
| Any model run on R1 to R4 | No model endpoint was used in this run; the helper was tested without the model |
| The gold and empty gates in the sandbox image | The set's own gate (fails, then passes, then passes, under the scorer's conventions) is the author's; it was not re-run here |
| The quality of each of the 80 statements | Length, source and keywords were measured for all 80; titles were read for all 80; the bodies were read only where a route looked wrong |
| The near and far tiers | Assigned by repository subject matter; no contamination test was run |
| Baseline outcomes | Read from the set's files: two runs of the author's tuned agent and one run of the reference agent |
