# R2: the set and its parts

Source of the task rows: `sets/_tasks/rotation_r2.jsonl`. Every part is a list file with one task id per line, ready for `--panel`.

| Part | Tasks | Solved by both | One agent | Neither | Closed issue | Pull request | Commit and changelog | Repositories | Gold test time, all tasks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `smoke_1.txt` | 1 | 1 | 0 | 0 | 1 | 0 | 0 | 1 | 0.3 s |
| `smoke_3.txt` | 3 | 1 | 1 | 1 | 3 | 0 | 0 | 3 | 2.5 s |
| `slice_A.txt` | 5 | 2 | 2 | 1 | 3 | 2 | 0 | 5 | 3.1 s |
| `slice_B.txt` | 5 | 2 | 2 | 1 | 2 | 3 | 0 | 5 | 6.5 s |
| `slice_C.txt` | 5 | 2 | 2 | 1 | 2 | 2 | 1 | 5 | 8.7 s |
| `slice_D.txt` | 5 | 3 | 1 | 1 | 3 | 2 | 0 | 4 | 9.2 s |
| `check_A.txt` | 5 | 2 | 2 | 1 | 3 | 2 | 0 | 4 | 8.8 s |
| `check_B.txt` | 5 | 2 | 2 | 1 | 2 | 3 | 0 | 5 | 8.3 s |
| `check_C.txt` | 5 | 2 | 2 | 1 | 2 | 2 | 1 | 5 | 6.2 s |
| `check_D.txt` | 5 | 3 | 1 | 1 | 3 | 2 | 0 | 5 | 4.2 s |
| `half_1.txt` | 10 | 4 | 4 | 2 | 5 | 5 | 0 | 10 | 9.6 s |
| `half_2.txt` | 10 | 5 | 3 | 2 | 5 | 4 | 1 | 9 | 17.9 s |
| `full.txt` | 20 | 9 | 7 | 4 | 10 | 9 | 1 | 18 | 27.5 s |
| `solved_both.txt` | 9 | 9 | 0 | 0 | 5 | 3 | 1 | 9 | 8.4 s |
| `solved_one.txt` | 7 | 0 | 7 | 0 | 1 | 6 | 0 | 7 | 16.1 s |
| `solved_neither.txt` | 4 | 0 | 0 | 4 | 4 | 0 | 0 | 4 | 3.0 s |
| `issues.txt` | 10 | 5 | 1 | 4 | 10 | 0 | 0 | 10 | 10.2 s |
| `pull_requests.txt` | 9 | 3 | 6 | 0 | 0 | 9 | 0 | 9 | 16.8 s |
| `changelogs.txt` | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 1 | 0.5 s |

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
| 1 | `w3lib_266` | w3lib | both | closed issue | 2 lines | 0.3 s | get_meta_refresh() is quadratic on malformed HTML (catastrophic backtracking) |

## smoke_3.txt (3 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `w3lib_266` | w3lib | both | closed issue | 2 lines | 0.3 s | get_meta_refresh() is quadratic on malformed HTML (catastrophic backtracking) |
| 2 | `pydantic_settings_1049` | pydantic-settings | one agent | closed issue | 9 lines | 1.9 s | CLI field typed as an alias of list[dict] merges the list into one dict |
| 3 | `markdown_1621` | markdown | neither | closed issue | 9 lines | 0.3 s | Super-linear (quadratic) rendering on many inline links: '[link](x)' * N |

## slice_A.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `w3lib_266` | w3lib | both | closed issue | 2 lines | 0.3 s | get_meta_refresh() is quadratic on malformed HTML (catastrophic backtracking) |
| 2 | `pluggy_727` | pluggy | both | pull request | 5 lines | 0.3 s | Point the missing-argument warning at the code making the hook call |
| 3 | `pydantic_settings_1049` | pydantic-settings | one agent | closed issue | 9 lines | 1.9 s | CLI field typed as an alias of list[dict] merges the list into one dict |
| 4 | `humanize_328` | humanize | one agent | pull request | 12 lines | 0.3 s | Carry metric() to the next SI prefix when rounding reaches 1000 |
| 5 | `markdown_1621` | markdown | neither | closed issue | 9 lines | 0.3 s | Super-linear (quadratic) rendering on many inline links: '[link](x)' * N |

## slice_B.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `isort_2542` | isort | both | closed issue | 22 lines | 0.5 s | git_hook(lazy=True) not checking unstaged changes |
| 2 | `cattrs_776` | cattrs | both | pull request | 2 lines | 0.5 s | Sort extra keys when formatting ForbiddenExtraKeysError |
| 3 | `platformdirs_573` | platformdirs | one agent | pull request | 29 lines | 0.6 s | 🐛 fix(macos): detect Homebrew Python by its opt/ framework path |
| 4 | `black_5438` | black | one agent | pull request | 9 lines | 4.4 s | Keep the CRLF ending of the line skipped by --skip-source-first-line |
| 5 | `marshmallow_2937` | marshmallow | neither | closed issue | 32 lines | 0.5 s | Update Email validator to support IDNs |

## slice_C.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `urllib3_5254` | urllib3 | both | closed issue | 5 lines | 0.6 s | Concurrent HTTP/2 probes can leave threads blocked in acquire_and_get |
| 2 | `sqlite_utils_a4acc3958c` | sqlite-utils | both | commit and changelog | 5 lines | 0.5 s | Fix transform() corrupting TRUE/FALSE/NULL column defaults into strings |
| 3 | `poetry_core_953` | poetry-core | one agent | pull request | 16 lines | 1.0 s | Fix Version.difference with a local variant of the same version |
| 4 | `strawberry_4360` | strawberry | one agent | pull request | 7 lines | 5.7 s | Fix error type when field with resolver= lacks type annotations |
| 5 | `loguru_1508` | loguru | neither | closed issue | 5 lines | 0.9 s | {time:x} is incorrect for negative timestamps due to toward-zero truncation |

## slice_D.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `litestar_4669` | litestar | both | closed issue | 2 lines | 1.6 s | Bug: KeyError when a ClassVar exists on msgspec dto struct |
| 2 | `tenacity_660` | tenacity | both | closed issue | 9 lines | 2.3 s | retry_if_exception_cause_type spins forever when the exception cause chain conta |
| 3 | `python_multipart_258` | python-multipart | both | pull request | 4 lines | 1.8 s | Handle CTE values case-insensitively |
| 4 | `litestar_4814` | litestar | one agent | pull request | 6 lines | 2.2 s | fix(openapi): handle Annotated metadata in Optional[Literal[...]] schemas |
| 5 | `platformdirs_540` | platformdirs | neither | closed issue | 33 lines | 1.3 s | user_state_dir returns invalid relative paths |

## check_A.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `litestar_4669` | litestar | both | closed issue | 2 lines | 1.6 s | Bug: KeyError when a ClassVar exists on msgspec dto struct |
| 2 | `python_multipart_258` | python-multipart | both | pull request | 4 lines | 1.8 s | Handle CTE values case-insensitively |
| 3 | `pydantic_settings_1049` | pydantic-settings | one agent | closed issue | 9 lines | 1.9 s | CLI field typed as an alias of list[dict] merges the list into one dict |
| 4 | `litestar_4814` | litestar | one agent | pull request | 6 lines | 2.2 s | fix(openapi): handle Annotated metadata in Optional[Literal[...]] schemas |
| 5 | `platformdirs_540` | platformdirs | neither | closed issue | 33 lines | 1.3 s | user_state_dir returns invalid relative paths |

## check_B.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `urllib3_5254` | urllib3 | both | closed issue | 5 lines | 0.6 s | Concurrent HTTP/2 probes can leave threads blocked in acquire_and_get |
| 2 | `cattrs_776` | cattrs | both | pull request | 2 lines | 0.5 s | Sort extra keys when formatting ForbiddenExtraKeysError |
| 3 | `platformdirs_573` | platformdirs | one agent | pull request | 29 lines | 0.6 s | 🐛 fix(macos): detect Homebrew Python by its opt/ framework path |
| 4 | `strawberry_4360` | strawberry | one agent | pull request | 7 lines | 5.7 s | Fix error type when field with resolver= lacks type annotations |
| 5 | `loguru_1508` | loguru | neither | closed issue | 5 lines | 0.9 s | {time:x} is incorrect for negative timestamps due to toward-zero truncation |

## check_C.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `isort_2542` | isort | both | closed issue | 22 lines | 0.5 s | git_hook(lazy=True) not checking unstaged changes |
| 2 | `sqlite_utils_a4acc3958c` | sqlite-utils | both | commit and changelog | 5 lines | 0.5 s | Fix transform() corrupting TRUE/FALSE/NULL column defaults into strings |
| 3 | `humanize_328` | humanize | one agent | pull request | 12 lines | 0.3 s | Carry metric() to the next SI prefix when rounding reaches 1000 |
| 4 | `black_5438` | black | one agent | pull request | 9 lines | 4.4 s | Keep the CRLF ending of the line skipped by --skip-source-first-line |
| 5 | `marshmallow_2937` | marshmallow | neither | closed issue | 32 lines | 0.5 s | Update Email validator to support IDNs |

## check_D.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `w3lib_266` | w3lib | both | closed issue | 2 lines | 0.3 s | get_meta_refresh() is quadratic on malformed HTML (catastrophic backtracking) |
| 2 | `tenacity_660` | tenacity | both | closed issue | 9 lines | 2.3 s | retry_if_exception_cause_type spins forever when the exception cause chain conta |
| 3 | `pluggy_727` | pluggy | both | pull request | 5 lines | 0.3 s | Point the missing-argument warning at the code making the hook call |
| 4 | `poetry_core_953` | poetry-core | one agent | pull request | 16 lines | 1.0 s | Fix Version.difference with a local variant of the same version |
| 5 | `markdown_1621` | markdown | neither | closed issue | 9 lines | 0.3 s | Super-linear (quadratic) rendering on many inline links: '[link](x)' * N |

## half_1.txt (10 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `w3lib_266` | w3lib | both | closed issue | 2 lines | 0.3 s | get_meta_refresh() is quadratic on malformed HTML (catastrophic backtracking) |
| 2 | `pluggy_727` | pluggy | both | pull request | 5 lines | 0.3 s | Point the missing-argument warning at the code making the hook call |
| 3 | `pydantic_settings_1049` | pydantic-settings | one agent | closed issue | 9 lines | 1.9 s | CLI field typed as an alias of list[dict] merges the list into one dict |
| 4 | `humanize_328` | humanize | one agent | pull request | 12 lines | 0.3 s | Carry metric() to the next SI prefix when rounding reaches 1000 |
| 5 | `markdown_1621` | markdown | neither | closed issue | 9 lines | 0.3 s | Super-linear (quadratic) rendering on many inline links: '[link](x)' * N |
| 6 | `isort_2542` | isort | both | closed issue | 22 lines | 0.5 s | git_hook(lazy=True) not checking unstaged changes |
| 7 | `cattrs_776` | cattrs | both | pull request | 2 lines | 0.5 s | Sort extra keys when formatting ForbiddenExtraKeysError |
| 8 | `platformdirs_573` | platformdirs | one agent | pull request | 29 lines | 0.6 s | 🐛 fix(macos): detect Homebrew Python by its opt/ framework path |
| 9 | `black_5438` | black | one agent | pull request | 9 lines | 4.4 s | Keep the CRLF ending of the line skipped by --skip-source-first-line |
| 10 | `marshmallow_2937` | marshmallow | neither | closed issue | 32 lines | 0.5 s | Update Email validator to support IDNs |

## half_2.txt (10 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `urllib3_5254` | urllib3 | both | closed issue | 5 lines | 0.6 s | Concurrent HTTP/2 probes can leave threads blocked in acquire_and_get |
| 2 | `sqlite_utils_a4acc3958c` | sqlite-utils | both | commit and changelog | 5 lines | 0.5 s | Fix transform() corrupting TRUE/FALSE/NULL column defaults into strings |
| 3 | `poetry_core_953` | poetry-core | one agent | pull request | 16 lines | 1.0 s | Fix Version.difference with a local variant of the same version |
| 4 | `strawberry_4360` | strawberry | one agent | pull request | 7 lines | 5.7 s | Fix error type when field with resolver= lacks type annotations |
| 5 | `loguru_1508` | loguru | neither | closed issue | 5 lines | 0.9 s | {time:x} is incorrect for negative timestamps due to toward-zero truncation |
| 6 | `litestar_4669` | litestar | both | closed issue | 2 lines | 1.6 s | Bug: KeyError when a ClassVar exists on msgspec dto struct |
| 7 | `tenacity_660` | tenacity | both | closed issue | 9 lines | 2.3 s | retry_if_exception_cause_type spins forever when the exception cause chain conta |
| 8 | `python_multipart_258` | python-multipart | both | pull request | 4 lines | 1.8 s | Handle CTE values case-insensitively |
| 9 | `litestar_4814` | litestar | one agent | pull request | 6 lines | 2.2 s | fix(openapi): handle Annotated metadata in Optional[Literal[...]] schemas |
| 10 | `platformdirs_540` | platformdirs | neither | closed issue | 33 lines | 1.3 s | user_state_dir returns invalid relative paths |

## full.txt (20 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `isort_2542` | isort | both | closed issue | 22 lines | 0.5 s | git_hook(lazy=True) not checking unstaged changes |
| 2 | `tenacity_660` | tenacity | both | closed issue | 9 lines | 2.3 s | retry_if_exception_cause_type spins forever when the exception cause chain conta |
| 3 | `w3lib_266` | w3lib | both | closed issue | 2 lines | 0.3 s | get_meta_refresh() is quadratic on malformed HTML (catastrophic backtracking) |
| 4 | `pydantic_settings_1049` | pydantic-settings | one agent | closed issue | 9 lines | 1.9 s | CLI field typed as an alias of list[dict] merges the list into one dict |
| 5 | `litestar_4669` | litestar | both | closed issue | 2 lines | 1.6 s | Bug: KeyError when a ClassVar exists on msgspec dto struct |
| 6 | `urllib3_5254` | urllib3 | both | closed issue | 5 lines | 0.6 s | Concurrent HTTP/2 probes can leave threads blocked in acquire_and_get |
| 7 | `litestar_4814` | litestar | one agent | pull request | 6 lines | 2.2 s | fix(openapi): handle Annotated metadata in Optional[Literal[...]] schemas |
| 8 | `strawberry_4360` | strawberry | one agent | pull request | 7 lines | 5.7 s | Fix error type when field with resolver= lacks type annotations |
| 9 | `black_5438` | black | one agent | pull request | 9 lines | 4.4 s | Keep the CRLF ending of the line skipped by --skip-source-first-line |
| 10 | `humanize_328` | humanize | one agent | pull request | 12 lines | 0.3 s | Carry metric() to the next SI prefix when rounding reaches 1000 |
| 11 | `poetry_core_953` | poetry-core | one agent | pull request | 16 lines | 1.0 s | Fix Version.difference with a local variant of the same version |
| 12 | `platformdirs_573` | platformdirs | one agent | pull request | 29 lines | 0.6 s | 🐛 fix(macos): detect Homebrew Python by its opt/ framework path |
| 13 | `loguru_1508` | loguru | neither | closed issue | 5 lines | 0.9 s | {time:x} is incorrect for negative timestamps due to toward-zero truncation |
| 14 | `markdown_1621` | markdown | neither | closed issue | 9 lines | 0.3 s | Super-linear (quadratic) rendering on many inline links: '[link](x)' * N |
| 15 | `marshmallow_2937` | marshmallow | neither | closed issue | 32 lines | 0.5 s | Update Email validator to support IDNs |
| 16 | `platformdirs_540` | platformdirs | neither | closed issue | 33 lines | 1.3 s | user_state_dir returns invalid relative paths |
| 17 | `sqlite_utils_a4acc3958c` | sqlite-utils | both | commit and changelog | 5 lines | 0.5 s | Fix transform() corrupting TRUE/FALSE/NULL column defaults into strings |
| 18 | `python_multipart_258` | python-multipart | both | pull request | 4 lines | 1.8 s | Handle CTE values case-insensitively |
| 19 | `pluggy_727` | pluggy | both | pull request | 5 lines | 0.3 s | Point the missing-argument warning at the code making the hook call |
| 20 | `cattrs_776` | cattrs | both | pull request | 2 lines | 0.5 s | Sort extra keys when formatting ForbiddenExtraKeysError |

## solved_both.txt (9 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `w3lib_266` | w3lib | both | closed issue | 2 lines | 0.3 s | get_meta_refresh() is quadratic on malformed HTML (catastrophic backtracking) |
| 2 | `pluggy_727` | pluggy | both | pull request | 5 lines | 0.3 s | Point the missing-argument warning at the code making the hook call |
| 3 | `cattrs_776` | cattrs | both | pull request | 2 lines | 0.5 s | Sort extra keys when formatting ForbiddenExtraKeysError |
| 4 | `sqlite_utils_a4acc3958c` | sqlite-utils | both | commit and changelog | 5 lines | 0.5 s | Fix transform() corrupting TRUE/FALSE/NULL column defaults into strings |
| 5 | `isort_2542` | isort | both | closed issue | 22 lines | 0.5 s | git_hook(lazy=True) not checking unstaged changes |
| 6 | `urllib3_5254` | urllib3 | both | closed issue | 5 lines | 0.6 s | Concurrent HTTP/2 probes can leave threads blocked in acquire_and_get |
| 7 | `litestar_4669` | litestar | both | closed issue | 2 lines | 1.6 s | Bug: KeyError when a ClassVar exists on msgspec dto struct |
| 8 | `python_multipart_258` | python-multipart | both | pull request | 4 lines | 1.8 s | Handle CTE values case-insensitively |
| 9 | `tenacity_660` | tenacity | both | closed issue | 9 lines | 2.3 s | retry_if_exception_cause_type spins forever when the exception cause chain conta |

## solved_one.txt (7 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `humanize_328` | humanize | one agent | pull request | 12 lines | 0.3 s | Carry metric() to the next SI prefix when rounding reaches 1000 |
| 2 | `platformdirs_573` | platformdirs | one agent | pull request | 29 lines | 0.6 s | 🐛 fix(macos): detect Homebrew Python by its opt/ framework path |
| 3 | `poetry_core_953` | poetry-core | one agent | pull request | 16 lines | 1.0 s | Fix Version.difference with a local variant of the same version |
| 4 | `pydantic_settings_1049` | pydantic-settings | one agent | closed issue | 9 lines | 1.9 s | CLI field typed as an alias of list[dict] merges the list into one dict |
| 5 | `litestar_4814` | litestar | one agent | pull request | 6 lines | 2.2 s | fix(openapi): handle Annotated metadata in Optional[Literal[...]] schemas |
| 6 | `black_5438` | black | one agent | pull request | 9 lines | 4.4 s | Keep the CRLF ending of the line skipped by --skip-source-first-line |
| 7 | `strawberry_4360` | strawberry | one agent | pull request | 7 lines | 5.7 s | Fix error type when field with resolver= lacks type annotations |

## solved_neither.txt (4 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `markdown_1621` | markdown | neither | closed issue | 9 lines | 0.3 s | Super-linear (quadratic) rendering on many inline links: '[link](x)' * N |
| 2 | `marshmallow_2937` | marshmallow | neither | closed issue | 32 lines | 0.5 s | Update Email validator to support IDNs |
| 3 | `loguru_1508` | loguru | neither | closed issue | 5 lines | 0.9 s | {time:x} is incorrect for negative timestamps due to toward-zero truncation |
| 4 | `platformdirs_540` | platformdirs | neither | closed issue | 33 lines | 1.3 s | user_state_dir returns invalid relative paths |

## issues.txt (10 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `isort_2542` | isort | both | closed issue | 22 lines | 0.5 s | git_hook(lazy=True) not checking unstaged changes |
| 2 | `tenacity_660` | tenacity | both | closed issue | 9 lines | 2.3 s | retry_if_exception_cause_type spins forever when the exception cause chain conta |
| 3 | `w3lib_266` | w3lib | both | closed issue | 2 lines | 0.3 s | get_meta_refresh() is quadratic on malformed HTML (catastrophic backtracking) |
| 4 | `pydantic_settings_1049` | pydantic-settings | one agent | closed issue | 9 lines | 1.9 s | CLI field typed as an alias of list[dict] merges the list into one dict |
| 5 | `litestar_4669` | litestar | both | closed issue | 2 lines | 1.6 s | Bug: KeyError when a ClassVar exists on msgspec dto struct |
| 6 | `urllib3_5254` | urllib3 | both | closed issue | 5 lines | 0.6 s | Concurrent HTTP/2 probes can leave threads blocked in acquire_and_get |
| 7 | `loguru_1508` | loguru | neither | closed issue | 5 lines | 0.9 s | {time:x} is incorrect for negative timestamps due to toward-zero truncation |
| 8 | `markdown_1621` | markdown | neither | closed issue | 9 lines | 0.3 s | Super-linear (quadratic) rendering on many inline links: '[link](x)' * N |
| 9 | `marshmallow_2937` | marshmallow | neither | closed issue | 32 lines | 0.5 s | Update Email validator to support IDNs |
| 10 | `platformdirs_540` | platformdirs | neither | closed issue | 33 lines | 1.3 s | user_state_dir returns invalid relative paths |

## pull_requests.txt (9 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `litestar_4814` | litestar | one agent | pull request | 6 lines | 2.2 s | fix(openapi): handle Annotated metadata in Optional[Literal[...]] schemas |
| 2 | `strawberry_4360` | strawberry | one agent | pull request | 7 lines | 5.7 s | Fix error type when field with resolver= lacks type annotations |
| 3 | `black_5438` | black | one agent | pull request | 9 lines | 4.4 s | Keep the CRLF ending of the line skipped by --skip-source-first-line |
| 4 | `humanize_328` | humanize | one agent | pull request | 12 lines | 0.3 s | Carry metric() to the next SI prefix when rounding reaches 1000 |
| 5 | `poetry_core_953` | poetry-core | one agent | pull request | 16 lines | 1.0 s | Fix Version.difference with a local variant of the same version |
| 6 | `platformdirs_573` | platformdirs | one agent | pull request | 29 lines | 0.6 s | 🐛 fix(macos): detect Homebrew Python by its opt/ framework path |
| 7 | `python_multipart_258` | python-multipart | both | pull request | 4 lines | 1.8 s | Handle CTE values case-insensitively |
| 8 | `pluggy_727` | pluggy | both | pull request | 5 lines | 0.3 s | Point the missing-argument warning at the code making the hook call |
| 9 | `cattrs_776` | cattrs | both | pull request | 2 lines | 0.5 s | Sort extra keys when formatting ForbiddenExtraKeysError |

## changelogs.txt (1 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `sqlite_utils_a4acc3958c` | sqlite-utils | both | commit and changelog | 5 lines | 0.5 s | Fix transform() corrupting TRUE/FALSE/NULL column defaults into strings |
