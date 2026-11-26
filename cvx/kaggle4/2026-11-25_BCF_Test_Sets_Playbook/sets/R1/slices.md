# R1: the set and its parts

Source of the task rows: `sets/_tasks/rotation_r1.jsonl`. Every part is a list file with one task id per line, ready for `--panel`.

| Part | Tasks | Solved by both | One agent | Neither | Closed issue | Pull request | Commit and changelog | Repositories | Gold test time, all tasks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `smoke_1.txt` | 1 | 1 | 0 | 0 | 1 | 0 | 0 | 1 | 0.5 s |
| `smoke_3.txt` | 3 | 1 | 1 | 1 | 3 | 0 | 0 | 3 | 1.6 s |
| `slice_A.txt` | 5 | 2 | 2 | 1 | 3 | 2 | 0 | 5 | 2.6 s |
| `slice_B.txt` | 5 | 2 | 2 | 1 | 3 | 2 | 0 | 5 | 9.1 s |
| `slice_C.txt` | 5 | 2 | 2 | 1 | 2 | 1 | 2 | 5 | 8.5 s |
| `slice_D.txt` | 5 | 3 | 1 | 1 | 3 | 2 | 0 | 3 | 17.5 s |
| `check_A.txt` | 5 | 2 | 2 | 1 | 3 | 2 | 0 | 3 | 15.2 s |
| `check_B.txt` | 5 | 2 | 2 | 1 | 3 | 2 | 0 | 5 | 10.3 s |
| `check_C.txt` | 5 | 2 | 2 | 1 | 2 | 1 | 2 | 5 | 6.0 s |
| `check_D.txt` | 5 | 3 | 1 | 1 | 3 | 2 | 0 | 5 | 6.2 s |
| `half_1.txt` | 10 | 4 | 4 | 2 | 6 | 4 | 0 | 9 | 11.7 s |
| `half_2.txt` | 10 | 5 | 3 | 2 | 5 | 3 | 2 | 8 | 26.0 s |
| `full.txt` | 20 | 9 | 7 | 4 | 11 | 7 | 2 | 15 | 37.7 s |
| `solved_both.txt` | 9 | 9 | 0 | 0 | 5 | 3 | 1 | 7 | 18.6 s |
| `solved_one.txt` | 7 | 0 | 7 | 0 | 2 | 4 | 1 | 6 | 9.3 s |
| `solved_neither.txt` | 4 | 0 | 0 | 4 | 4 | 0 | 0 | 4 | 9.8 s |
| `issues.txt` | 11 | 5 | 2 | 4 | 11 | 0 | 0 | 7 | 25.6 s |
| `pull_requests.txt` | 7 | 3 | 4 | 0 | 0 | 7 | 0 | 7 | 11.4 s |
| `changelogs.txt` | 2 | 1 | 1 | 0 | 0 | 0 | 2 | 2 | 0.7 s |

| Part | Tasks | Use it for |
| --- | --- | --- |
| `smoke_1.txt` | 1 | Pipeline check: one task end to end |
| `smoke_3.txt` | 3 | One task of each group |
| `slice_A.txt` | 5 | Quick loop on these tasks |
| `slice_B.txt` | 5 | Quick loop on these tasks |
| `slice_C.txt` | 5 | Quick loop on these tasks |
| `slice_D.txt` | 5 | Quick loop on these tasks |
| `check_A.txt` | 5 | A second grouping of the same tasks, to check a quick-loop result |
| `check_B.txt` | 5 | A second grouping of the same tasks, to check a quick-loop result |
| `check_C.txt` | 5 | A second grouping of the same tasks, to check a quick-loop result |
| `check_D.txt` | 5 | A second grouping of the same tasks, to check a quick-loop result |
| `half_1.txt` | 10 | First half |
| `half_2.txt` | 10 | Second half |
| `full.txt` | 20 | The whole set: decisions |
| `solved_both.txt` | 9 | Tasks both baseline agents solved |
| `solved_one.txt` | 7 | Tasks one baseline agent solved |
| `solved_neither.txt` | 4 | Tasks no baseline agent solved |
| `issues.txt` | 11 | Closed-issue statements only |
| `pull_requests.txt` | 7 | Pull-request statements only |
| `changelogs.txt` | 2 | Commit-and-changelog statements only |

## smoke_1.txt (1 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `isort_2581` | isort | both | closed issue | 6 lines | 0.5 s | sort_reexports does not respect isort: skip |

## smoke_3.txt (3 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `isort_2581` | isort | both | closed issue | 6 lines | 0.5 s | sort_reexports does not respect isort: skip |
| 2 | `loguru_1529` | loguru | one agent | closed issue | 7 lines | 0.8 s | Queued standard handlers use the consumer thread instead of the producer thread |
| 3 | `markdown_it_py_425` | markdown-it-py | neither | closed issue | 29 lines | 0.3 s | Hard line breaks parsed incorrectly in version 1.1.0 |

## slice_A.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `isort_2581` | isort | both | closed issue | 6 lines | 0.5 s | sort_reexports does not respect isort: skip |
| 2 | `structlog_807` | structlog | both | pull request | 5 lines | 0.6 s | Use WeakKeyDictionary for WRITE_LOCKS to prevent file object leaks |
| 3 | `loguru_1529` | loguru | one agent | closed issue | 7 lines | 0.8 s | Queued standard handlers use the consumer thread instead of the producer thread |
| 4 | `platformdirs_571` | platformdirs | one agent | pull request | 27 lines | 0.4 s | 🐛 fix(windows): treat empty PUBLIC and fallback env vars as unset |
| 5 | `markdown_it_py_425` | markdown-it-py | neither | closed issue | 29 lines | 0.3 s | Hard line breaks parsed incorrectly in version 1.1.0 |

## slice_B.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `litestar_4925` | litestar | both | closed issue | 2 lines | 1.8 s | Enhancement: Prometheus group_path=False default causes unbounded metric cardina |
| 2 | `python_multipart_230` | python-multipart | both | pull request | 2 lines | 1.7 s | Emit field_end for trailing bare field names on finalize |
| 3 | `pydantic_settings_917` | pydantic-settings | one agent | closed issue | 9 lines | 2.1 s | UTF-8 secret files can be silently decoded with the Windows locale encoding |
| 4 | `strawberry_4568` | strawberry | one agent | pull request | 14 lines | 1.7 s | fix: make nullable input fields optional for clients |
| 5 | `isort_2563` | isort | neither | closed issue | 7 lines | 1.8 s | isort.core.process incorrectly returns False if only changes to lines before imp |

## slice_C.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `litestar_4685` | litestar | both | closed issue | 2 lines | 2.1 s | Bug: inconsistent type of Decimal in JSON and OpenAPI schema |
| 2 | `cattrs_5bf7c97293` | cattrs | both | commit and changelog | 3 lines | 0.5 s | Escape the index note when structuring heterogeneous tuples |
| 3 | `w3lib_285` | w3lib | one agent | pull request | 15 lines | 2.0 s | treat backslash as slash for special-scheme urls in _urlsplit |
| 4 | `markdown_7a29324e03` | markdown | one agent | commit and changelog | 12 lines | 0.2 s | Fix inline HTML case |
| 5 | `attrs_1541` | attrs | neither | closed issue | 26 lines | 3.7 s | Add decorator for convert |

## slice_D.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `black_5167` | black | both | closed issue | 10 lines | 4.1 s | Unexpected version warning |
| 2 | `black_5148` | black | both | closed issue | 8 lines | 4.4 s | Excessive additional whitespace when using """ """ to document functions and tab |
| 3 | `sqlite_utils_828` | sqlite-utils | both | pull request | 4 lines | 2.9 s | Escape tokenize argument in enable_fts to prevent SQL injection |
| 4 | `pydantic_settings_910` | pydantic-settings | one agent | pull request | 22 lines | 2.1 s | fix: parse enum names through nested annotations |
| 5 | `black_5211` | black | neither | closed issue | 19 lines | 4.0 s | Invalid BLACK_NUM_WORKERS value can produce a raw ValueError traceback |

## check_A.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `black_5167` | black | both | closed issue | 10 lines | 4.1 s | Unexpected version warning |
| 2 | `sqlite_utils_828` | sqlite-utils | both | pull request | 4 lines | 2.9 s | Escape tokenize argument in enable_fts to prevent SQL injection |
| 3 | `pydantic_settings_917` | pydantic-settings | one agent | closed issue | 9 lines | 2.1 s | UTF-8 secret files can be silently decoded with the Windows locale encoding |
| 4 | `pydantic_settings_910` | pydantic-settings | one agent | pull request | 22 lines | 2.1 s | fix: parse enum names through nested annotations |
| 5 | `black_5211` | black | neither | closed issue | 19 lines | 4.0 s | Invalid BLACK_NUM_WORKERS value can produce a raw ValueError traceback |

## check_B.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `litestar_4685` | litestar | both | closed issue | 2 lines | 2.1 s | Bug: inconsistent type of Decimal in JSON and OpenAPI schema |
| 2 | `python_multipart_230` | python-multipart | both | pull request | 2 lines | 1.7 s | Emit field_end for trailing bare field names on finalize |
| 3 | `loguru_1529` | loguru | one agent | closed issue | 7 lines | 0.8 s | Queued standard handlers use the consumer thread instead of the producer thread |
| 4 | `w3lib_285` | w3lib | one agent | pull request | 15 lines | 2.0 s | treat backslash as slash for special-scheme urls in _urlsplit |
| 5 | `attrs_1541` | attrs | neither | closed issue | 26 lines | 3.7 s | Add decorator for convert |

## check_C.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `litestar_4925` | litestar | both | closed issue | 2 lines | 1.8 s | Enhancement: Prometheus group_path=False default causes unbounded metric cardina |
| 2 | `cattrs_5bf7c97293` | cattrs | both | commit and changelog | 3 lines | 0.5 s | Escape the index note when structuring heterogeneous tuples |
| 3 | `strawberry_4568` | strawberry | one agent | pull request | 14 lines | 1.7 s | fix: make nullable input fields optional for clients |
| 4 | `markdown_7a29324e03` | markdown | one agent | commit and changelog | 12 lines | 0.2 s | Fix inline HTML case |
| 5 | `isort_2563` | isort | neither | closed issue | 7 lines | 1.8 s | isort.core.process incorrectly returns False if only changes to lines before imp |

## check_D.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `isort_2581` | isort | both | closed issue | 6 lines | 0.5 s | sort_reexports does not respect isort: skip |
| 2 | `black_5148` | black | both | closed issue | 8 lines | 4.4 s | Excessive additional whitespace when using """ """ to document functions and tab |
| 3 | `structlog_807` | structlog | both | pull request | 5 lines | 0.6 s | Use WeakKeyDictionary for WRITE_LOCKS to prevent file object leaks |
| 4 | `platformdirs_571` | platformdirs | one agent | pull request | 27 lines | 0.4 s | 🐛 fix(windows): treat empty PUBLIC and fallback env vars as unset |
| 5 | `markdown_it_py_425` | markdown-it-py | neither | closed issue | 29 lines | 0.3 s | Hard line breaks parsed incorrectly in version 1.1.0 |

## half_1.txt (10 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `isort_2581` | isort | both | closed issue | 6 lines | 0.5 s | sort_reexports does not respect isort: skip |
| 2 | `structlog_807` | structlog | both | pull request | 5 lines | 0.6 s | Use WeakKeyDictionary for WRITE_LOCKS to prevent file object leaks |
| 3 | `loguru_1529` | loguru | one agent | closed issue | 7 lines | 0.8 s | Queued standard handlers use the consumer thread instead of the producer thread |
| 4 | `platformdirs_571` | platformdirs | one agent | pull request | 27 lines | 0.4 s | 🐛 fix(windows): treat empty PUBLIC and fallback env vars as unset |
| 5 | `markdown_it_py_425` | markdown-it-py | neither | closed issue | 29 lines | 0.3 s | Hard line breaks parsed incorrectly in version 1.1.0 |
| 6 | `litestar_4925` | litestar | both | closed issue | 2 lines | 1.8 s | Enhancement: Prometheus group_path=False default causes unbounded metric cardina |
| 7 | `python_multipart_230` | python-multipart | both | pull request | 2 lines | 1.7 s | Emit field_end for trailing bare field names on finalize |
| 8 | `pydantic_settings_917` | pydantic-settings | one agent | closed issue | 9 lines | 2.1 s | UTF-8 secret files can be silently decoded with the Windows locale encoding |
| 9 | `strawberry_4568` | strawberry | one agent | pull request | 14 lines | 1.7 s | fix: make nullable input fields optional for clients |
| 10 | `isort_2563` | isort | neither | closed issue | 7 lines | 1.8 s | isort.core.process incorrectly returns False if only changes to lines before imp |

## half_2.txt (10 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `litestar_4685` | litestar | both | closed issue | 2 lines | 2.1 s | Bug: inconsistent type of Decimal in JSON and OpenAPI schema |
| 2 | `cattrs_5bf7c97293` | cattrs | both | commit and changelog | 3 lines | 0.5 s | Escape the index note when structuring heterogeneous tuples |
| 3 | `w3lib_285` | w3lib | one agent | pull request | 15 lines | 2.0 s | treat backslash as slash for special-scheme urls in _urlsplit |
| 4 | `markdown_7a29324e03` | markdown | one agent | commit and changelog | 12 lines | 0.2 s | Fix inline HTML case |
| 5 | `attrs_1541` | attrs | neither | closed issue | 26 lines | 3.7 s | Add decorator for convert |
| 6 | `black_5167` | black | both | closed issue | 10 lines | 4.1 s | Unexpected version warning |
| 7 | `black_5148` | black | both | closed issue | 8 lines | 4.4 s | Excessive additional whitespace when using """ """ to document functions and tab |
| 8 | `sqlite_utils_828` | sqlite-utils | both | pull request | 4 lines | 2.9 s | Escape tokenize argument in enable_fts to prevent SQL injection |
| 9 | `pydantic_settings_910` | pydantic-settings | one agent | pull request | 22 lines | 2.1 s | fix: parse enum names through nested annotations |
| 10 | `black_5211` | black | neither | closed issue | 19 lines | 4.0 s | Invalid BLACK_NUM_WORKERS value can produce a raw ValueError traceback |

## full.txt (20 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `isort_2581` | isort | both | closed issue | 6 lines | 0.5 s | sort_reexports does not respect isort: skip |
| 2 | `black_5148` | black | both | closed issue | 8 lines | 4.4 s | Excessive additional whitespace when using """ """ to document functions and tab |
| 3 | `black_5167` | black | both | closed issue | 10 lines | 4.1 s | Unexpected version warning |
| 4 | `pydantic_settings_917` | pydantic-settings | one agent | closed issue | 9 lines | 2.1 s | UTF-8 secret files can be silently decoded with the Windows locale encoding |
| 5 | `litestar_4685` | litestar | both | closed issue | 2 lines | 2.1 s | Bug: inconsistent type of Decimal in JSON and OpenAPI schema |
| 6 | `litestar_4925` | litestar | both | closed issue | 2 lines | 1.8 s | Enhancement: Prometheus group_path=False default causes unbounded metric cardina |
| 7 | `pydantic_settings_910` | pydantic-settings | one agent | pull request | 22 lines | 2.1 s | fix: parse enum names through nested annotations |
| 8 | `strawberry_4568` | strawberry | one agent | pull request | 14 lines | 1.7 s | fix: make nullable input fields optional for clients |
| 9 | `loguru_1529` | loguru | one agent | closed issue | 7 lines | 0.8 s | Queued standard handlers use the consumer thread instead of the producer thread |
| 10 | `markdown_7a29324e03` | markdown | one agent | commit and changelog | 12 lines | 0.2 s | Fix inline HTML case |
| 11 | `w3lib_285` | w3lib | one agent | pull request | 15 lines | 2.0 s | treat backslash as slash for special-scheme urls in _urlsplit |
| 12 | `platformdirs_571` | platformdirs | one agent | pull request | 27 lines | 0.4 s | 🐛 fix(windows): treat empty PUBLIC and fallback env vars as unset |
| 13 | `isort_2563` | isort | neither | closed issue | 7 lines | 1.8 s | isort.core.process incorrectly returns False if only changes to lines before imp |
| 14 | `markdown_it_py_425` | markdown-it-py | neither | closed issue | 29 lines | 0.3 s | Hard line breaks parsed incorrectly in version 1.1.0 |
| 15 | `black_5211` | black | neither | closed issue | 19 lines | 4.0 s | Invalid BLACK_NUM_WORKERS value can produce a raw ValueError traceback |
| 16 | `attrs_1541` | attrs | neither | closed issue | 26 lines | 3.7 s | Add decorator for convert |
| 17 | `cattrs_5bf7c97293` | cattrs | both | commit and changelog | 3 lines | 0.5 s | Escape the index note when structuring heterogeneous tuples |
| 18 | `python_multipart_230` | python-multipart | both | pull request | 2 lines | 1.7 s | Emit field_end for trailing bare field names on finalize |
| 19 | `structlog_807` | structlog | both | pull request | 5 lines | 0.6 s | Use WeakKeyDictionary for WRITE_LOCKS to prevent file object leaks |
| 20 | `sqlite_utils_828` | sqlite-utils | both | pull request | 4 lines | 2.9 s | Escape tokenize argument in enable_fts to prevent SQL injection |

## solved_both.txt (9 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `cattrs_5bf7c97293` | cattrs | both | commit and changelog | 3 lines | 0.5 s | Escape the index note when structuring heterogeneous tuples |
| 2 | `isort_2581` | isort | both | closed issue | 6 lines | 0.5 s | sort_reexports does not respect isort: skip |
| 3 | `structlog_807` | structlog | both | pull request | 5 lines | 0.6 s | Use WeakKeyDictionary for WRITE_LOCKS to prevent file object leaks |
| 4 | `python_multipart_230` | python-multipart | both | pull request | 2 lines | 1.7 s | Emit field_end for trailing bare field names on finalize |
| 5 | `litestar_4925` | litestar | both | closed issue | 2 lines | 1.8 s | Enhancement: Prometheus group_path=False default causes unbounded metric cardina |
| 6 | `litestar_4685` | litestar | both | closed issue | 2 lines | 2.1 s | Bug: inconsistent type of Decimal in JSON and OpenAPI schema |
| 7 | `sqlite_utils_828` | sqlite-utils | both | pull request | 4 lines | 2.9 s | Escape tokenize argument in enable_fts to prevent SQL injection |
| 8 | `black_5167` | black | both | closed issue | 10 lines | 4.1 s | Unexpected version warning |
| 9 | `black_5148` | black | both | closed issue | 8 lines | 4.4 s | Excessive additional whitespace when using """ """ to document functions and tab |

## solved_one.txt (7 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `markdown_7a29324e03` | markdown | one agent | commit and changelog | 12 lines | 0.2 s | Fix inline HTML case |
| 2 | `platformdirs_571` | platformdirs | one agent | pull request | 27 lines | 0.4 s | 🐛 fix(windows): treat empty PUBLIC and fallback env vars as unset |
| 3 | `loguru_1529` | loguru | one agent | closed issue | 7 lines | 0.8 s | Queued standard handlers use the consumer thread instead of the producer thread |
| 4 | `strawberry_4568` | strawberry | one agent | pull request | 14 lines | 1.7 s | fix: make nullable input fields optional for clients |
| 5 | `w3lib_285` | w3lib | one agent | pull request | 15 lines | 2.0 s | treat backslash as slash for special-scheme urls in _urlsplit |
| 6 | `pydantic_settings_917` | pydantic-settings | one agent | closed issue | 9 lines | 2.1 s | UTF-8 secret files can be silently decoded with the Windows locale encoding |
| 7 | `pydantic_settings_910` | pydantic-settings | one agent | pull request | 22 lines | 2.1 s | fix: parse enum names through nested annotations |

## solved_neither.txt (4 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `markdown_it_py_425` | markdown-it-py | neither | closed issue | 29 lines | 0.3 s | Hard line breaks parsed incorrectly in version 1.1.0 |
| 2 | `isort_2563` | isort | neither | closed issue | 7 lines | 1.8 s | isort.core.process incorrectly returns False if only changes to lines before imp |
| 3 | `attrs_1541` | attrs | neither | closed issue | 26 lines | 3.7 s | Add decorator for convert |
| 4 | `black_5211` | black | neither | closed issue | 19 lines | 4.0 s | Invalid BLACK_NUM_WORKERS value can produce a raw ValueError traceback |

## issues.txt (11 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `isort_2581` | isort | both | closed issue | 6 lines | 0.5 s | sort_reexports does not respect isort: skip |
| 2 | `black_5148` | black | both | closed issue | 8 lines | 4.4 s | Excessive additional whitespace when using """ """ to document functions and tab |
| 3 | `black_5167` | black | both | closed issue | 10 lines | 4.1 s | Unexpected version warning |
| 4 | `pydantic_settings_917` | pydantic-settings | one agent | closed issue | 9 lines | 2.1 s | UTF-8 secret files can be silently decoded with the Windows locale encoding |
| 5 | `litestar_4685` | litestar | both | closed issue | 2 lines | 2.1 s | Bug: inconsistent type of Decimal in JSON and OpenAPI schema |
| 6 | `litestar_4925` | litestar | both | closed issue | 2 lines | 1.8 s | Enhancement: Prometheus group_path=False default causes unbounded metric cardina |
| 7 | `loguru_1529` | loguru | one agent | closed issue | 7 lines | 0.8 s | Queued standard handlers use the consumer thread instead of the producer thread |
| 8 | `isort_2563` | isort | neither | closed issue | 7 lines | 1.8 s | isort.core.process incorrectly returns False if only changes to lines before imp |
| 9 | `markdown_it_py_425` | markdown-it-py | neither | closed issue | 29 lines | 0.3 s | Hard line breaks parsed incorrectly in version 1.1.0 |
| 10 | `black_5211` | black | neither | closed issue | 19 lines | 4.0 s | Invalid BLACK_NUM_WORKERS value can produce a raw ValueError traceback |
| 11 | `attrs_1541` | attrs | neither | closed issue | 26 lines | 3.7 s | Add decorator for convert |

## pull_requests.txt (7 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `pydantic_settings_910` | pydantic-settings | one agent | pull request | 22 lines | 2.1 s | fix: parse enum names through nested annotations |
| 2 | `strawberry_4568` | strawberry | one agent | pull request | 14 lines | 1.7 s | fix: make nullable input fields optional for clients |
| 3 | `w3lib_285` | w3lib | one agent | pull request | 15 lines | 2.0 s | treat backslash as slash for special-scheme urls in _urlsplit |
| 4 | `platformdirs_571` | platformdirs | one agent | pull request | 27 lines | 0.4 s | 🐛 fix(windows): treat empty PUBLIC and fallback env vars as unset |
| 5 | `python_multipart_230` | python-multipart | both | pull request | 2 lines | 1.7 s | Emit field_end for trailing bare field names on finalize |
| 6 | `structlog_807` | structlog | both | pull request | 5 lines | 0.6 s | Use WeakKeyDictionary for WRITE_LOCKS to prevent file object leaks |
| 7 | `sqlite_utils_828` | sqlite-utils | both | pull request | 4 lines | 2.9 s | Escape tokenize argument in enable_fts to prevent SQL injection |

## changelogs.txt (2 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `markdown_7a29324e03` | markdown | one agent | commit and changelog | 12 lines | 0.2 s | Fix inline HTML case |
| 2 | `cattrs_5bf7c97293` | cattrs | both | commit and changelog | 3 lines | 0.5 s | Escape the index note when structuring heterogeneous tuples |
