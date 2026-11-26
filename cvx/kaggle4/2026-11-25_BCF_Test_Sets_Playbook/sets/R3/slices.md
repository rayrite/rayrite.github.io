# R3: the set and its parts

Source of the task rows: `sets/_tasks/rotation_r3.jsonl`. Every part is a list file with one task id per line, ready for `--panel`.

| Part | Tasks | Solved by both | One agent | Neither | Closed issue | Pull request | Commit and changelog | Repositories | Gold test time, all tasks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `smoke_1.txt` | 1 | 1 | 0 | 0 | 1 | 0 | 0 | 1 | 0.4 s |
| `smoke_3.txt` | 3 | 1 | 1 | 1 | 3 | 0 | 0 | 3 | 2.7 s |
| `slice_A.txt` | 5 | 2 | 2 | 1 | 3 | 2 | 0 | 5 | 3.6 s |
| `slice_B.txt` | 5 | 2 | 2 | 1 | 2 | 3 | 0 | 5 | 3.6 s |
| `slice_C.txt` | 5 | 2 | 2 | 1 | 2 | 2 | 1 | 5 | 7.5 s |
| `slice_D.txt` | 5 | 3 | 1 | 1 | 3 | 2 | 0 | 4 | 12.4 s |
| `check_A.txt` | 5 | 2 | 2 | 1 | 3 | 2 | 0 | 5 | 10.4 s |
| `check_B.txt` | 5 | 2 | 2 | 1 | 2 | 3 | 0 | 5 | 6.9 s |
| `check_C.txt` | 5 | 2 | 2 | 1 | 2 | 2 | 1 | 5 | 3.7 s |
| `check_D.txt` | 5 | 3 | 1 | 1 | 3 | 2 | 0 | 5 | 6.1 s |
| `half_1.txt` | 10 | 4 | 4 | 2 | 5 | 5 | 0 | 10 | 7.2 s |
| `half_2.txt` | 10 | 5 | 3 | 2 | 5 | 4 | 1 | 8 | 19.9 s |
| `full.txt` | 20 | 9 | 7 | 4 | 10 | 9 | 1 | 17 | 27.1 s |
| `solved_both.txt` | 9 | 9 | 0 | 0 | 5 | 3 | 1 | 9 | 10.2 s |
| `solved_one.txt` | 7 | 0 | 7 | 0 | 1 | 6 | 0 | 6 | 8.7 s |
| `solved_neither.txt` | 4 | 0 | 0 | 4 | 4 | 0 | 0 | 4 | 8.2 s |
| `issues.txt` | 10 | 5 | 1 | 4 | 10 | 0 | 0 | 9 | 17.4 s |
| `pull_requests.txt` | 9 | 3 | 6 | 0 | 0 | 9 | 0 | 8 | 9.0 s |
| `changelogs.txt` | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 1 | 0.7 s |

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
| `issues.txt` | 10 | Closed-issue statements only |
| `pull_requests.txt` | 9 | Pull-request statements only |
| `changelogs.txt` | 1 | Commit-and-changelog statements only |

## smoke_1.txt (1 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `pluggy_767` | pluggy | both | closed issue | 21 lines | 0.4 s | list_plugin_distinfo() keeps unregistered plugins |

## smoke_3.txt (3 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `pluggy_767` | pluggy | both | closed issue | 21 lines | 0.4 s | list_plugin_distinfo() keeps unregistered plugins |
| 2 | `urllib3_5062` | urllib3 | one agent | closed issue | 3 lines | 2.0 s | Confusing FullPoolError raised when passing a string timeout |
| 3 | `parsel_352` | parsel | neither | closed issue | 33 lines | 0.3 s | Use of functools.lru_cache or functools.cache on methods can lead to memory leak |

## slice_A.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `pluggy_767` | pluggy | both | closed issue | 21 lines | 0.4 s | list_plugin_distinfo() keeps unregistered plugins |
| 2 | `marshmallow_3016` | marshmallow | both | pull request | 2 lines | 0.5 s | Fix URL validator rejecting a fragment after an empty path |
| 3 | `urllib3_5062` | urllib3 | one agent | closed issue | 3 lines | 2.0 s | Confusing FullPoolError raised when passing a string timeout |
| 4 | `humanize_320` | humanize | one agent | pull request | 7 lines | 0.4 s | Stop printing two minus signs in fractional for a negative mixed number |
| 5 | `parsel_352` | parsel | neither | closed issue | 33 lines | 0.3 s | Use of functools.lru_cache or functools.cache on methods can lead to memory leak |

## slice_B.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `uvicorn_3199` | uvicorn | both | closed issue | 2 lines | 0.7 s | --workers N loses TCP_NODELAY: every keep-alive request past the first costs ~43 |
| 2 | `sqlite_utils_811` | sqlite-utils | both | pull request | 4 lines | 0.5 s | Fix _decode_default_value to unescape doubled single quotes in string defaults |
| 3 | `w3lib_317` | w3lib | one agent | pull request | 11 lines | 0.5 s | Handle UTF-{16,32} the same for all 3 sources of encoding. |
| 4 | `platformdirs_562` | platformdirs | one agent | pull request | 7 lines | 1.1 s | 🐛 fix(unix): ignore XDG_RUNTIME_DIR when redirecting root |
| 5 | `isort_2558` | isort | neither | closed issue | 12 lines | 0.8 s | NOQA adds extra space characters |

## slice_C.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `loguru_1507` | loguru | both | closed issue | 2 lines | 0.8 s | Negative timezone offsets with sub-minute components are formatted one minute to |
| 2 | `jsonschema_865c27fc3d` | jsonschema | both | commit and changelog | 2 lines | 0.7 s | Properly set path and schema_path on nested boolean schemas. |
| 3 | `isort_2567` | isort | one agent | pull request | 12 lines | 0.9 s | Keep aliased import when the plain name carries a comment |
| 4 | `strawberry_4657` | strawberry | one agent | pull request | 21 lines | 2.8 s | Raise an error for unions with the same name but different types |
| 5 | `tenacity_654` | tenacity | neither | closed issue | 12 lines | 2.3 s | exponential wait issue |

## slice_D.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `pydantic_settings_912` | pydantic-settings | both | closed issue | 8 lines | 1.3 s | Dotenv extras silently dropped when their name shares a complex field's prefix |
| 2 | `black_5461` | black | both | closed issue | 10 lines | 4.0 s | Black changes the value of a docstring containing a form feed |
| 3 | `poetry_core_949` | poetry-core | both | pull request | 11 lines | 1.3 s | Fix VersionRange.intersect broadening for local-version other |
| 4 | `strawberry_4693` | strawberry | one agent | pull request | 18 lines | 1.0 s | Resolve the graphql_type of shared Annotated fields in each type's module |
| 5 | `black_5476` | black | neither | closed issue | 12 lines | 4.8 s | Check passes on unformatted file after running with line ranges |

## check_A.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `pydantic_settings_912` | pydantic-settings | both | closed issue | 8 lines | 1.3 s | Dotenv extras silently dropped when their name shares a complex field's prefix |
| 2 | `poetry_core_949` | poetry-core | both | pull request | 11 lines | 1.3 s | Fix VersionRange.intersect broadening for local-version other |
| 3 | `urllib3_5062` | urllib3 | one agent | closed issue | 3 lines | 2.0 s | Confusing FullPoolError raised when passing a string timeout |
| 4 | `strawberry_4693` | strawberry | one agent | pull request | 18 lines | 1.0 s | Resolve the graphql_type of shared Annotated fields in each type's module |
| 5 | `black_5476` | black | neither | closed issue | 12 lines | 4.8 s | Check passes on unformatted file after running with line ranges |

## check_B.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `loguru_1507` | loguru | both | closed issue | 2 lines | 0.8 s | Negative timezone offsets with sub-minute components are formatted one minute to |
| 2 | `sqlite_utils_811` | sqlite-utils | both | pull request | 4 lines | 0.5 s | Fix _decode_default_value to unescape doubled single quotes in string defaults |
| 3 | `w3lib_317` | w3lib | one agent | pull request | 11 lines | 0.5 s | Handle UTF-{16,32} the same for all 3 sources of encoding. |
| 4 | `strawberry_4657` | strawberry | one agent | pull request | 21 lines | 2.8 s | Raise an error for unions with the same name but different types |
| 5 | `tenacity_654` | tenacity | neither | closed issue | 12 lines | 2.3 s | exponential wait issue |

## check_C.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `uvicorn_3199` | uvicorn | both | closed issue | 2 lines | 0.7 s | --workers N loses TCP_NODELAY: every keep-alive request past the first costs ~43 |
| 2 | `jsonschema_865c27fc3d` | jsonschema | both | commit and changelog | 2 lines | 0.7 s | Properly set path and schema_path on nested boolean schemas. |
| 3 | `humanize_320` | humanize | one agent | pull request | 7 lines | 0.4 s | Stop printing two minus signs in fractional for a negative mixed number |
| 4 | `platformdirs_562` | platformdirs | one agent | pull request | 7 lines | 1.1 s | 🐛 fix(unix): ignore XDG_RUNTIME_DIR when redirecting root |
| 5 | `isort_2558` | isort | neither | closed issue | 12 lines | 0.8 s | NOQA adds extra space characters |

## check_D.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `pluggy_767` | pluggy | both | closed issue | 21 lines | 0.4 s | list_plugin_distinfo() keeps unregistered plugins |
| 2 | `black_5461` | black | both | closed issue | 10 lines | 4.0 s | Black changes the value of a docstring containing a form feed |
| 3 | `marshmallow_3016` | marshmallow | both | pull request | 2 lines | 0.5 s | Fix URL validator rejecting a fragment after an empty path |
| 4 | `isort_2567` | isort | one agent | pull request | 12 lines | 0.9 s | Keep aliased import when the plain name carries a comment |
| 5 | `parsel_352` | parsel | neither | closed issue | 33 lines | 0.3 s | Use of functools.lru_cache or functools.cache on methods can lead to memory leak |

## half_1.txt (10 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `pluggy_767` | pluggy | both | closed issue | 21 lines | 0.4 s | list_plugin_distinfo() keeps unregistered plugins |
| 2 | `marshmallow_3016` | marshmallow | both | pull request | 2 lines | 0.5 s | Fix URL validator rejecting a fragment after an empty path |
| 3 | `urllib3_5062` | urllib3 | one agent | closed issue | 3 lines | 2.0 s | Confusing FullPoolError raised when passing a string timeout |
| 4 | `humanize_320` | humanize | one agent | pull request | 7 lines | 0.4 s | Stop printing two minus signs in fractional for a negative mixed number |
| 5 | `parsel_352` | parsel | neither | closed issue | 33 lines | 0.3 s | Use of functools.lru_cache or functools.cache on methods can lead to memory leak |
| 6 | `uvicorn_3199` | uvicorn | both | closed issue | 2 lines | 0.7 s | --workers N loses TCP_NODELAY: every keep-alive request past the first costs ~43 |
| 7 | `sqlite_utils_811` | sqlite-utils | both | pull request | 4 lines | 0.5 s | Fix _decode_default_value to unescape doubled single quotes in string defaults |
| 8 | `w3lib_317` | w3lib | one agent | pull request | 11 lines | 0.5 s | Handle UTF-{16,32} the same for all 3 sources of encoding. |
| 9 | `platformdirs_562` | platformdirs | one agent | pull request | 7 lines | 1.1 s | 🐛 fix(unix): ignore XDG_RUNTIME_DIR when redirecting root |
| 10 | `isort_2558` | isort | neither | closed issue | 12 lines | 0.8 s | NOQA adds extra space characters |

## half_2.txt (10 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `loguru_1507` | loguru | both | closed issue | 2 lines | 0.8 s | Negative timezone offsets with sub-minute components are formatted one minute to |
| 2 | `jsonschema_865c27fc3d` | jsonschema | both | commit and changelog | 2 lines | 0.7 s | Properly set path and schema_path on nested boolean schemas. |
| 3 | `isort_2567` | isort | one agent | pull request | 12 lines | 0.9 s | Keep aliased import when the plain name carries a comment |
| 4 | `strawberry_4657` | strawberry | one agent | pull request | 21 lines | 2.8 s | Raise an error for unions with the same name but different types |
| 5 | `tenacity_654` | tenacity | neither | closed issue | 12 lines | 2.3 s | exponential wait issue |
| 6 | `pydantic_settings_912` | pydantic-settings | both | closed issue | 8 lines | 1.3 s | Dotenv extras silently dropped when their name shares a complex field's prefix |
| 7 | `black_5461` | black | both | closed issue | 10 lines | 4.0 s | Black changes the value of a docstring containing a form feed |
| 8 | `poetry_core_949` | poetry-core | both | pull request | 11 lines | 1.3 s | Fix VersionRange.intersect broadening for local-version other |
| 9 | `strawberry_4693` | strawberry | one agent | pull request | 18 lines | 1.0 s | Resolve the graphql_type of shared Annotated fields in each type's module |
| 10 | `black_5476` | black | neither | closed issue | 12 lines | 4.8 s | Check passes on unformatted file after running with line ranges |

## full.txt (20 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `loguru_1507` | loguru | both | closed issue | 2 lines | 0.8 s | Negative timezone offsets with sub-minute components are formatted one minute to |
| 2 | `black_5461` | black | both | closed issue | 10 lines | 4.0 s | Black changes the value of a docstring containing a form feed |
| 3 | `pluggy_767` | pluggy | both | closed issue | 21 lines | 0.4 s | list_plugin_distinfo() keeps unregistered plugins |
| 4 | `urllib3_5062` | urllib3 | one agent | closed issue | 3 lines | 2.0 s | Confusing FullPoolError raised when passing a string timeout |
| 5 | `uvicorn_3199` | uvicorn | both | closed issue | 2 lines | 0.7 s | --workers N loses TCP_NODELAY: every keep-alive request past the first costs ~43 |
| 6 | `pydantic_settings_912` | pydantic-settings | both | closed issue | 8 lines | 1.3 s | Dotenv extras silently dropped when their name shares a complex field's prefix |
| 7 | `strawberry_4657` | strawberry | one agent | pull request | 21 lines | 2.8 s | Raise an error for unions with the same name but different types |
| 8 | `strawberry_4693` | strawberry | one agent | pull request | 18 lines | 1.0 s | Resolve the graphql_type of shared Annotated fields in each type's module |
| 9 | `isort_2567` | isort | one agent | pull request | 12 lines | 0.9 s | Keep aliased import when the plain name carries a comment |
| 10 | `humanize_320` | humanize | one agent | pull request | 7 lines | 0.4 s | Stop printing two minus signs in fractional for a negative mixed number |
| 11 | `w3lib_317` | w3lib | one agent | pull request | 11 lines | 0.5 s | Handle UTF-{16,32} the same for all 3 sources of encoding. |
| 12 | `platformdirs_562` | platformdirs | one agent | pull request | 7 lines | 1.1 s | 🐛 fix(unix): ignore XDG_RUNTIME_DIR when redirecting root |
| 13 | `isort_2558` | isort | neither | closed issue | 12 lines | 0.8 s | NOQA adds extra space characters |
| 14 | `tenacity_654` | tenacity | neither | closed issue | 12 lines | 2.3 s | exponential wait issue |
| 15 | `black_5476` | black | neither | closed issue | 12 lines | 4.8 s | Check passes on unformatted file after running with line ranges |
| 16 | `parsel_352` | parsel | neither | closed issue | 33 lines | 0.3 s | Use of functools.lru_cache or functools.cache on methods can lead to memory leak |
| 17 | `jsonschema_865c27fc3d` | jsonschema | both | commit and changelog | 2 lines | 0.7 s | Properly set path and schema_path on nested boolean schemas. |
| 18 | `marshmallow_3016` | marshmallow | both | pull request | 2 lines | 0.5 s | Fix URL validator rejecting a fragment after an empty path |
| 19 | `poetry_core_949` | poetry-core | both | pull request | 11 lines | 1.3 s | Fix VersionRange.intersect broadening for local-version other |
| 20 | `sqlite_utils_811` | sqlite-utils | both | pull request | 4 lines | 0.5 s | Fix _decode_default_value to unescape doubled single quotes in string defaults |

## solved_both.txt (9 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `pluggy_767` | pluggy | both | closed issue | 21 lines | 0.4 s | list_plugin_distinfo() keeps unregistered plugins |
| 2 | `marshmallow_3016` | marshmallow | both | pull request | 2 lines | 0.5 s | Fix URL validator rejecting a fragment after an empty path |
| 3 | `sqlite_utils_811` | sqlite-utils | both | pull request | 4 lines | 0.5 s | Fix _decode_default_value to unescape doubled single quotes in string defaults |
| 4 | `jsonschema_865c27fc3d` | jsonschema | both | commit and changelog | 2 lines | 0.7 s | Properly set path and schema_path on nested boolean schemas. |
| 5 | `uvicorn_3199` | uvicorn | both | closed issue | 2 lines | 0.7 s | --workers N loses TCP_NODELAY: every keep-alive request past the first costs ~43 |
| 6 | `loguru_1507` | loguru | both | closed issue | 2 lines | 0.8 s | Negative timezone offsets with sub-minute components are formatted one minute to |
| 7 | `pydantic_settings_912` | pydantic-settings | both | closed issue | 8 lines | 1.3 s | Dotenv extras silently dropped when their name shares a complex field's prefix |
| 8 | `poetry_core_949` | poetry-core | both | pull request | 11 lines | 1.3 s | Fix VersionRange.intersect broadening for local-version other |
| 9 | `black_5461` | black | both | closed issue | 10 lines | 4.0 s | Black changes the value of a docstring containing a form feed |

## solved_one.txt (7 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `humanize_320` | humanize | one agent | pull request | 7 lines | 0.4 s | Stop printing two minus signs in fractional for a negative mixed number |
| 2 | `w3lib_317` | w3lib | one agent | pull request | 11 lines | 0.5 s | Handle UTF-{16,32} the same for all 3 sources of encoding. |
| 3 | `isort_2567` | isort | one agent | pull request | 12 lines | 0.9 s | Keep aliased import when the plain name carries a comment |
| 4 | `strawberry_4693` | strawberry | one agent | pull request | 18 lines | 1.0 s | Resolve the graphql_type of shared Annotated fields in each type's module |
| 5 | `platformdirs_562` | platformdirs | one agent | pull request | 7 lines | 1.1 s | 🐛 fix(unix): ignore XDG_RUNTIME_DIR when redirecting root |
| 6 | `urllib3_5062` | urllib3 | one agent | closed issue | 3 lines | 2.0 s | Confusing FullPoolError raised when passing a string timeout |
| 7 | `strawberry_4657` | strawberry | one agent | pull request | 21 lines | 2.8 s | Raise an error for unions with the same name but different types |

## solved_neither.txt (4 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `parsel_352` | parsel | neither | closed issue | 33 lines | 0.3 s | Use of functools.lru_cache or functools.cache on methods can lead to memory leak |
| 2 | `isort_2558` | isort | neither | closed issue | 12 lines | 0.8 s | NOQA adds extra space characters |
| 3 | `tenacity_654` | tenacity | neither | closed issue | 12 lines | 2.3 s | exponential wait issue |
| 4 | `black_5476` | black | neither | closed issue | 12 lines | 4.8 s | Check passes on unformatted file after running with line ranges |

## issues.txt (10 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `loguru_1507` | loguru | both | closed issue | 2 lines | 0.8 s | Negative timezone offsets with sub-minute components are formatted one minute to |
| 2 | `black_5461` | black | both | closed issue | 10 lines | 4.0 s | Black changes the value of a docstring containing a form feed |
| 3 | `pluggy_767` | pluggy | both | closed issue | 21 lines | 0.4 s | list_plugin_distinfo() keeps unregistered plugins |
| 4 | `urllib3_5062` | urllib3 | one agent | closed issue | 3 lines | 2.0 s | Confusing FullPoolError raised when passing a string timeout |
| 5 | `uvicorn_3199` | uvicorn | both | closed issue | 2 lines | 0.7 s | --workers N loses TCP_NODELAY: every keep-alive request past the first costs ~43 |
| 6 | `pydantic_settings_912` | pydantic-settings | both | closed issue | 8 lines | 1.3 s | Dotenv extras silently dropped when their name shares a complex field's prefix |
| 7 | `isort_2558` | isort | neither | closed issue | 12 lines | 0.8 s | NOQA adds extra space characters |
| 8 | `tenacity_654` | tenacity | neither | closed issue | 12 lines | 2.3 s | exponential wait issue |
| 9 | `black_5476` | black | neither | closed issue | 12 lines | 4.8 s | Check passes on unformatted file after running with line ranges |
| 10 | `parsel_352` | parsel | neither | closed issue | 33 lines | 0.3 s | Use of functools.lru_cache or functools.cache on methods can lead to memory leak |

## pull_requests.txt (9 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `strawberry_4657` | strawberry | one agent | pull request | 21 lines | 2.8 s | Raise an error for unions with the same name but different types |
| 2 | `strawberry_4693` | strawberry | one agent | pull request | 18 lines | 1.0 s | Resolve the graphql_type of shared Annotated fields in each type's module |
| 3 | `isort_2567` | isort | one agent | pull request | 12 lines | 0.9 s | Keep aliased import when the plain name carries a comment |
| 4 | `humanize_320` | humanize | one agent | pull request | 7 lines | 0.4 s | Stop printing two minus signs in fractional for a negative mixed number |
| 5 | `w3lib_317` | w3lib | one agent | pull request | 11 lines | 0.5 s | Handle UTF-{16,32} the same for all 3 sources of encoding. |
| 6 | `platformdirs_562` | platformdirs | one agent | pull request | 7 lines | 1.1 s | 🐛 fix(unix): ignore XDG_RUNTIME_DIR when redirecting root |
| 7 | `marshmallow_3016` | marshmallow | both | pull request | 2 lines | 0.5 s | Fix URL validator rejecting a fragment after an empty path |
| 8 | `poetry_core_949` | poetry-core | both | pull request | 11 lines | 1.3 s | Fix VersionRange.intersect broadening for local-version other |
| 9 | `sqlite_utils_811` | sqlite-utils | both | pull request | 4 lines | 0.5 s | Fix _decode_default_value to unescape doubled single quotes in string defaults |

## changelogs.txt (1 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `jsonschema_865c27fc3d` | jsonschema | both | commit and changelog | 2 lines | 0.7 s | Properly set path and schema_path on nested boolean schemas. |
