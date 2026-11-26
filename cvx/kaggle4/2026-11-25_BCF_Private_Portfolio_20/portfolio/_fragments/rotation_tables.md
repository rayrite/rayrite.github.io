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

