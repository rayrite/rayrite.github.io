# P20: the set and its parts

Source of the task rows: `sets/_tasks/portfolio20.jsonl`. Every part is a list file with one task id per line, ready for `--panel`.

| Part | Tasks | Solved by both | One agent | Neither | Closed issue | Pull request | Commit and changelog | Repositories | Gold test time, all tasks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `smoke_1.txt` | 1 | 1 | 0 | 0 | 1 | 0 | 0 | 1 | 0.2 s |
| `smoke_3.txt` | 3 | 1 | 1 | 1 | 3 | 0 | 0 | 1 | 0.8 s |
| `slice_A.txt` | 5 | 2 | 2 | 1 | 4 | 1 | 0 | 3 | 5.3 s |
| `slice_B.txt` | 5 | 2 | 2 | 1 | 3 | 2 | 0 | 2 | 7.3 s |
| `slice_C.txt` | 5 | 2 | 2 | 1 | 3 | 1 | 1 | 2 | 13.8 s |
| `slice_D.txt` | 5 | 3 | 1 | 1 | 3 | 2 | 0 | 2 | 12.0 s |
| `check_A.txt` | 5 | 2 | 2 | 1 | 4 | 1 | 0 | 3 | 16.0 s |
| `check_B.txt` | 5 | 2 | 2 | 1 | 3 | 2 | 0 | 2 | 9.8 s |
| `check_C.txt` | 5 | 2 | 2 | 1 | 3 | 1 | 1 | 3 | 9.0 s |
| `check_D.txt` | 5 | 3 | 1 | 1 | 3 | 2 | 0 | 2 | 3.6 s |
| `half_1.txt` | 10 | 4 | 4 | 2 | 7 | 3 | 0 | 3 | 12.6 s |
| `half_2.txt` | 10 | 5 | 3 | 2 | 6 | 3 | 1 | 3 | 25.8 s |
| `full.txt` | 20 | 9 | 7 | 4 | 13 | 6 | 1 | 3 | 38.4 s |
| `solved_both.txt` | 9 | 9 | 0 | 0 | 5 | 3 | 1 | 3 | 10.2 s |
| `solved_one.txt` | 7 | 0 | 7 | 0 | 5 | 2 | 0 | 3 | 22.1 s |
| `solved_neither.txt` | 4 | 0 | 0 | 4 | 3 | 1 | 0 | 2 | 6.1 s |
| `issues.txt` | 13 | 5 | 5 | 3 | 13 | 0 | 0 | 3 | 22.4 s |
| `pull_requests.txt` | 6 | 3 | 2 | 1 | 0 | 6 | 0 | 3 | 15.4 s |
| `changelogs.txt` | 1 | 1 | 0 | 0 | 0 | 0 | 1 | 1 | 0.6 s |

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
| `issues.txt` | 13 | Closed-issue statements only |
| `pull_requests.txt` | 6 | Pull-request statements only |
| `changelogs.txt` | 1 | Commit-and-changelog statements only |

## smoke_1.txt (1 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `click_3434` | click | both | closed issue | 8 lines | 0.2 s | Empty output from HelpFormatter.write_usage for a program without arguments |

## smoke_3.txt (3 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `click_3434` | click | both | closed issue | 8 lines | 0.2 s | Empty output from HelpFormatter.write_usage for a program without arguments |
| 2 | `click_3208` | click | one agent | closed issue | 6 lines | 0.3 s | Nested command option shadowing -h prints wrong suggestion |
| 3 | `click_3211` | click | neither | closed issue | 15 lines | 0.3 s | FuncParamType should use ValueError for self.fail(message) |

## slice_A.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `click_3434` | click | both | closed issue | 8 lines | 0.2 s | Empty output from HelpFormatter.write_usage for a program without arguments |
| 2 | `packaging_1341` | packaging | both | pull request | 2 lines | 0.4 s | fix: reject wheel file names containing a \n at the end of the distribution name |
| 3 | `click_3208` | click | one agent | closed issue | 6 lines | 0.3 s | Nested command option shadowing -h prints wrong suggestion |
| 4 | `more_itertools_1278` | more-itertools | one agent | closed issue | 15 lines | 4.1 s | zip_broadcast opens input iterables twice |
| 5 | `click_3211` | click | neither | closed issue | 15 lines | 0.3 s | FuncParamType should use ValueError for self.fail(message) |

## slice_B.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `packaging_611` | packaging | both | closed issue | 13 lines | 0.5 s | Add packaging.tags.interpreter_abi |
| 2 | `packaging_1244` | packaging | both | pull request | 5 lines | 0.4 s | fix(pylock): reject bools where TOML integers are expected |
| 3 | `packaging_1316` | packaging | one agent | closed issue | 8 lines | 1.8 s | str(Marker(...)) drops parentheses of a nested group and changes evaluation |
| 4 | `more_itertools_1279` | more-itertools | one agent | pull request | 14 lines | 4.0 s | Fix one() and only() dropping a falsy user-supplied exception |
| 5 | `packaging_1346` | packaging | neither | closed issue | 28 lines | 0.6 s | Provide a way to get just pure Python tags |

## slice_C.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `packaging_1179` | packaging | both | closed issue | 22 lines | 0.5 s | Cannot install pylock.toml from CPython dev version |
| 2 | `packaging_1187` | packaging | both | commit and changelog | 4 lines | 0.6 s | Prefer native linux tags before manylinux |
| 3 | `more_itertools_1193` | more-itertools | one agent | closed issue | 3 lines | 3.6 s | interleave_evenly([]) raises IndexError |
| 4 | `more_itertools_1270` | more-itertools | one agent | pull request | 4 lines | 4.2 s | fix nonpositive item limits in constrained_batches |
| 5 | `packaging_1299` | packaging | neither | closed issue | 13 lines | 4.9 s | Unclear documentation and error messages around combining post releases and pref |

## slice_D.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `click_3739` | click | both | closed issue | 2 lines | 0.6 s | [Bug] On Windows, get_pager_file returns a typing.BinaryIO object NOT typing.Tex |
| 2 | `click_3299` | click | both | closed issue | 2 lines | 0.9 s | semver.Version as default causing an error |
| 3 | `more_itertools_1260` | more-itertools | both | pull request | 6 lines | 6.1 s | Validate running window sizes through the index protocol |
| 4 | `more_itertools_1276` | more-itertools | one agent | closed issue | 13 lines | 4.1 s | numeric_range reverse iteration changes float values and overflows at datetime l |
| 5 | `click_3642` | click | neither | pull request | 3 lines | 0.3 s | Do not trigger a BytesWarning under python -bb |

## check_A.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `click_3739` | click | both | closed issue | 2 lines | 0.6 s | [Bug] On Windows, get_pager_file returns a typing.BinaryIO object NOT typing.Tex |
| 2 | `more_itertools_1260` | more-itertools | both | pull request | 6 lines | 6.1 s | Validate running window sizes through the index protocol |
| 3 | `click_3208` | click | one agent | closed issue | 6 lines | 0.3 s | Nested command option shadowing -h prints wrong suggestion |
| 4 | `more_itertools_1278` | more-itertools | one agent | closed issue | 15 lines | 4.1 s | zip_broadcast opens input iterables twice |
| 5 | `packaging_1299` | packaging | neither | closed issue | 13 lines | 4.9 s | Unclear documentation and error messages around combining post releases and pref |

## check_B.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `packaging_1179` | packaging | both | closed issue | 22 lines | 0.5 s | Cannot install pylock.toml from CPython dev version |
| 2 | `packaging_1244` | packaging | both | pull request | 5 lines | 0.4 s | fix(pylock): reject bools where TOML integers are expected |
| 3 | `more_itertools_1276` | more-itertools | one agent | closed issue | 13 lines | 4.1 s | numeric_range reverse iteration changes float values and overflows at datetime l |
| 4 | `more_itertools_1270` | more-itertools | one agent | pull request | 4 lines | 4.2 s | fix nonpositive item limits in constrained_batches |
| 5 | `packaging_1346` | packaging | neither | closed issue | 28 lines | 0.6 s | Provide a way to get just pure Python tags |

## check_C.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `packaging_611` | packaging | both | closed issue | 13 lines | 0.5 s | Add packaging.tags.interpreter_abi |
| 2 | `packaging_1187` | packaging | both | commit and changelog | 4 lines | 0.6 s | Prefer native linux tags before manylinux |
| 3 | `more_itertools_1193` | more-itertools | one agent | closed issue | 3 lines | 3.6 s | interleave_evenly([]) raises IndexError |
| 4 | `more_itertools_1279` | more-itertools | one agent | pull request | 14 lines | 4.0 s | Fix one() and only() dropping a falsy user-supplied exception |
| 5 | `click_3211` | click | neither | closed issue | 15 lines | 0.3 s | FuncParamType should use ValueError for self.fail(message) |

## check_D.txt (5 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `click_3434` | click | both | closed issue | 8 lines | 0.2 s | Empty output from HelpFormatter.write_usage for a program without arguments |
| 2 | `click_3299` | click | both | closed issue | 2 lines | 0.9 s | semver.Version as default causing an error |
| 3 | `packaging_1341` | packaging | both | pull request | 2 lines | 0.4 s | fix: reject wheel file names containing a \n at the end of the distribution name |
| 4 | `packaging_1316` | packaging | one agent | closed issue | 8 lines | 1.8 s | str(Marker(...)) drops parentheses of a nested group and changes evaluation |
| 5 | `click_3642` | click | neither | pull request | 3 lines | 0.3 s | Do not trigger a BytesWarning under python -bb |

## half_1.txt (10 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `click_3434` | click | both | closed issue | 8 lines | 0.2 s | Empty output from HelpFormatter.write_usage for a program without arguments |
| 2 | `packaging_1341` | packaging | both | pull request | 2 lines | 0.4 s | fix: reject wheel file names containing a \n at the end of the distribution name |
| 3 | `click_3208` | click | one agent | closed issue | 6 lines | 0.3 s | Nested command option shadowing -h prints wrong suggestion |
| 4 | `more_itertools_1278` | more-itertools | one agent | closed issue | 15 lines | 4.1 s | zip_broadcast opens input iterables twice |
| 5 | `click_3211` | click | neither | closed issue | 15 lines | 0.3 s | FuncParamType should use ValueError for self.fail(message) |
| 6 | `packaging_611` | packaging | both | closed issue | 13 lines | 0.5 s | Add packaging.tags.interpreter_abi |
| 7 | `packaging_1244` | packaging | both | pull request | 5 lines | 0.4 s | fix(pylock): reject bools where TOML integers are expected |
| 8 | `packaging_1316` | packaging | one agent | closed issue | 8 lines | 1.8 s | str(Marker(...)) drops parentheses of a nested group and changes evaluation |
| 9 | `more_itertools_1279` | more-itertools | one agent | pull request | 14 lines | 4.0 s | Fix one() and only() dropping a falsy user-supplied exception |
| 10 | `packaging_1346` | packaging | neither | closed issue | 28 lines | 0.6 s | Provide a way to get just pure Python tags |

## half_2.txt (10 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `packaging_1179` | packaging | both | closed issue | 22 lines | 0.5 s | Cannot install pylock.toml from CPython dev version |
| 2 | `packaging_1187` | packaging | both | commit and changelog | 4 lines | 0.6 s | Prefer native linux tags before manylinux |
| 3 | `more_itertools_1193` | more-itertools | one agent | closed issue | 3 lines | 3.6 s | interleave_evenly([]) raises IndexError |
| 4 | `more_itertools_1270` | more-itertools | one agent | pull request | 4 lines | 4.2 s | fix nonpositive item limits in constrained_batches |
| 5 | `packaging_1299` | packaging | neither | closed issue | 13 lines | 4.9 s | Unclear documentation and error messages around combining post releases and pref |
| 6 | `click_3739` | click | both | closed issue | 2 lines | 0.6 s | [Bug] On Windows, get_pager_file returns a typing.BinaryIO object NOT typing.Tex |
| 7 | `click_3299` | click | both | closed issue | 2 lines | 0.9 s | semver.Version as default causing an error |
| 8 | `more_itertools_1260` | more-itertools | both | pull request | 6 lines | 6.1 s | Validate running window sizes through the index protocol |
| 9 | `more_itertools_1276` | more-itertools | one agent | closed issue | 13 lines | 4.1 s | numeric_range reverse iteration changes float values and overflows at datetime l |
| 10 | `click_3642` | click | neither | pull request | 3 lines | 0.3 s | Do not trigger a BytesWarning under python -bb |

## full.txt (20 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `packaging_1179` | packaging | both | closed issue | 22 lines | 0.5 s | Cannot install pylock.toml from CPython dev version |
| 2 | `packaging_611` | packaging | both | closed issue | 13 lines | 0.5 s | Add packaging.tags.interpreter_abi |
| 3 | `packaging_1316` | packaging | one agent | closed issue | 8 lines | 1.8 s | str(Marker(...)) drops parentheses of a nested group and changes evaluation |
| 4 | `packaging_1299` | packaging | neither | closed issue | 13 lines | 4.9 s | Unclear documentation and error messages around combining post releases and pref |
| 5 | `packaging_1346` | packaging | neither | closed issue | 28 lines | 0.6 s | Provide a way to get just pure Python tags |
| 6 | `packaging_1244` | packaging | both | pull request | 5 lines | 0.4 s | fix(pylock): reject bools where TOML integers are expected |
| 7 | `packaging_1341` | packaging | both | pull request | 2 lines | 0.4 s | fix: reject wheel file names containing a \n at the end of the distribution name |
| 8 | `packaging_1187` | packaging | both | commit and changelog | 4 lines | 0.6 s | Prefer native linux tags before manylinux |
| 9 | `click_3299` | click | both | closed issue | 2 lines | 0.9 s | semver.Version as default causing an error |
| 10 | `click_3434` | click | both | closed issue | 8 lines | 0.2 s | Empty output from HelpFormatter.write_usage for a program without arguments |
| 11 | `click_3739` | click | both | closed issue | 2 lines | 0.6 s | [Bug] On Windows, get_pager_file returns a typing.BinaryIO object NOT typing.Tex |
| 12 | `click_3208` | click | one agent | closed issue | 6 lines | 0.3 s | Nested command option shadowing -h prints wrong suggestion |
| 13 | `click_3211` | click | neither | closed issue | 15 lines | 0.3 s | FuncParamType should use ValueError for self.fail(message) |
| 14 | `click_3642` | click | neither | pull request | 3 lines | 0.3 s | Do not trigger a BytesWarning under python -bb |
| 15 | `more_itertools_1193` | more-itertools | one agent | closed issue | 3 lines | 3.6 s | interleave_evenly([]) raises IndexError |
| 16 | `more_itertools_1276` | more-itertools | one agent | closed issue | 13 lines | 4.1 s | numeric_range reverse iteration changes float values and overflows at datetime l |
| 17 | `more_itertools_1278` | more-itertools | one agent | closed issue | 15 lines | 4.1 s | zip_broadcast opens input iterables twice |
| 18 | `more_itertools_1279` | more-itertools | one agent | pull request | 14 lines | 4.0 s | Fix one() and only() dropping a falsy user-supplied exception |
| 19 | `more_itertools_1260` | more-itertools | both | pull request | 6 lines | 6.1 s | Validate running window sizes through the index protocol |
| 20 | `more_itertools_1270` | more-itertools | one agent | pull request | 4 lines | 4.2 s | fix nonpositive item limits in constrained_batches |

## solved_both.txt (9 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `click_3434` | click | both | closed issue | 8 lines | 0.2 s | Empty output from HelpFormatter.write_usage for a program without arguments |
| 2 | `packaging_1341` | packaging | both | pull request | 2 lines | 0.4 s | fix: reject wheel file names containing a \n at the end of the distribution name |
| 3 | `packaging_1244` | packaging | both | pull request | 5 lines | 0.4 s | fix(pylock): reject bools where TOML integers are expected |
| 4 | `packaging_611` | packaging | both | closed issue | 13 lines | 0.5 s | Add packaging.tags.interpreter_abi |
| 5 | `packaging_1179` | packaging | both | closed issue | 22 lines | 0.5 s | Cannot install pylock.toml from CPython dev version |
| 6 | `click_3739` | click | both | closed issue | 2 lines | 0.6 s | [Bug] On Windows, get_pager_file returns a typing.BinaryIO object NOT typing.Tex |
| 7 | `packaging_1187` | packaging | both | commit and changelog | 4 lines | 0.6 s | Prefer native linux tags before manylinux |
| 8 | `click_3299` | click | both | closed issue | 2 lines | 0.9 s | semver.Version as default causing an error |
| 9 | `more_itertools_1260` | more-itertools | both | pull request | 6 lines | 6.1 s | Validate running window sizes through the index protocol |

## solved_one.txt (7 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `click_3208` | click | one agent | closed issue | 6 lines | 0.3 s | Nested command option shadowing -h prints wrong suggestion |
| 2 | `packaging_1316` | packaging | one agent | closed issue | 8 lines | 1.8 s | str(Marker(...)) drops parentheses of a nested group and changes evaluation |
| 3 | `more_itertools_1193` | more-itertools | one agent | closed issue | 3 lines | 3.6 s | interleave_evenly([]) raises IndexError |
| 4 | `more_itertools_1279` | more-itertools | one agent | pull request | 14 lines | 4.0 s | Fix one() and only() dropping a falsy user-supplied exception |
| 5 | `more_itertools_1276` | more-itertools | one agent | closed issue | 13 lines | 4.1 s | numeric_range reverse iteration changes float values and overflows at datetime l |
| 6 | `more_itertools_1278` | more-itertools | one agent | closed issue | 15 lines | 4.1 s | zip_broadcast opens input iterables twice |
| 7 | `more_itertools_1270` | more-itertools | one agent | pull request | 4 lines | 4.2 s | fix nonpositive item limits in constrained_batches |

## solved_neither.txt (4 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `click_3642` | click | neither | pull request | 3 lines | 0.3 s | Do not trigger a BytesWarning under python -bb |
| 2 | `click_3211` | click | neither | closed issue | 15 lines | 0.3 s | FuncParamType should use ValueError for self.fail(message) |
| 3 | `packaging_1346` | packaging | neither | closed issue | 28 lines | 0.6 s | Provide a way to get just pure Python tags |
| 4 | `packaging_1299` | packaging | neither | closed issue | 13 lines | 4.9 s | Unclear documentation and error messages around combining post releases and pref |

## issues.txt (13 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `packaging_1179` | packaging | both | closed issue | 22 lines | 0.5 s | Cannot install pylock.toml from CPython dev version |
| 2 | `packaging_611` | packaging | both | closed issue | 13 lines | 0.5 s | Add packaging.tags.interpreter_abi |
| 3 | `packaging_1316` | packaging | one agent | closed issue | 8 lines | 1.8 s | str(Marker(...)) drops parentheses of a nested group and changes evaluation |
| 4 | `packaging_1299` | packaging | neither | closed issue | 13 lines | 4.9 s | Unclear documentation and error messages around combining post releases and pref |
| 5 | `packaging_1346` | packaging | neither | closed issue | 28 lines | 0.6 s | Provide a way to get just pure Python tags |
| 6 | `click_3299` | click | both | closed issue | 2 lines | 0.9 s | semver.Version as default causing an error |
| 7 | `click_3434` | click | both | closed issue | 8 lines | 0.2 s | Empty output from HelpFormatter.write_usage for a program without arguments |
| 8 | `click_3739` | click | both | closed issue | 2 lines | 0.6 s | [Bug] On Windows, get_pager_file returns a typing.BinaryIO object NOT typing.Tex |
| 9 | `click_3208` | click | one agent | closed issue | 6 lines | 0.3 s | Nested command option shadowing -h prints wrong suggestion |
| 10 | `click_3211` | click | neither | closed issue | 15 lines | 0.3 s | FuncParamType should use ValueError for self.fail(message) |
| 11 | `more_itertools_1193` | more-itertools | one agent | closed issue | 3 lines | 3.6 s | interleave_evenly([]) raises IndexError |
| 12 | `more_itertools_1276` | more-itertools | one agent | closed issue | 13 lines | 4.1 s | numeric_range reverse iteration changes float values and overflows at datetime l |
| 13 | `more_itertools_1278` | more-itertools | one agent | closed issue | 15 lines | 4.1 s | zip_broadcast opens input iterables twice |

## pull_requests.txt (6 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `packaging_1244` | packaging | both | pull request | 5 lines | 0.4 s | fix(pylock): reject bools where TOML integers are expected |
| 2 | `packaging_1341` | packaging | both | pull request | 2 lines | 0.4 s | fix: reject wheel file names containing a \n at the end of the distribution name |
| 3 | `click_3642` | click | neither | pull request | 3 lines | 0.3 s | Do not trigger a BytesWarning under python -bb |
| 4 | `more_itertools_1279` | more-itertools | one agent | pull request | 14 lines | 4.0 s | Fix one() and only() dropping a falsy user-supplied exception |
| 5 | `more_itertools_1260` | more-itertools | both | pull request | 6 lines | 6.1 s | Validate running window sizes through the index protocol |
| 6 | `more_itertools_1270` | more-itertools | one agent | pull request | 4 lines | 4.2 s | fix nonpositive item limits in constrained_batches |

## changelogs.txt (1 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `packaging_1187` | packaging | both | commit and changelog | 4 lines | 0.6 s | Prefer native linux tags before manylinux |
