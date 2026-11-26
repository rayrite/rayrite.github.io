# B40: the set and its parts

Source of the task rows: `sets/_tasks/confirm40.jsonl`. Every part is a list file with one task id per line, ready for `--panel`.

| Part | Tasks | Solved by both | One agent | Neither | Closed issue | Pull request | Commit and changelog | Repositories | Gold test time, all tasks |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `quarter_A.txt` | 10 | 4 | 2 | 4 | 3 | 7 | 0 | 3 | 9.2 s |
| `quarter_B.txt` | 10 | 4 | 2 | 4 | 3 | 7 | 0 | 3 | 13.4 s |
| `quarter_C.txt` | 10 | 3 | 3 | 4 | 4 | 6 | 0 | 3 | 17.0 s |
| `quarter_D.txt` | 10 | 3 | 3 | 4 | 1 | 9 | 0 | 3 | 24.5 s |
| `check_A.txt` | 10 | 4 | 2 | 4 | 3 | 7 | 0 | 3 | 22.5 s |
| `check_B.txt` | 10 | 4 | 2 | 4 | 3 | 7 | 0 | 3 | 14.1 s |
| `check_C.txt` | 10 | 3 | 3 | 4 | 4 | 6 | 0 | 3 | 11.0 s |
| `check_D.txt` | 10 | 3 | 3 | 4 | 1 | 9 | 0 | 3 | 16.5 s |
| `half_1.txt` | 20 | 8 | 4 | 8 | 6 | 14 | 0 | 3 | 22.6 s |
| `half_2.txt` | 20 | 6 | 6 | 8 | 5 | 15 | 0 | 3 | 41.5 s |
| `full.txt` | 40 | 14 | 10 | 16 | 11 | 29 | 0 | 3 | 64.1 s |
| `solved_both.txt` | 14 | 14 | 0 | 0 | 3 | 11 | 0 | 3 | 21.0 s |
| `solved_one.txt` | 10 | 0 | 10 | 0 | 1 | 9 | 0 | 2 | 24.8 s |
| `solved_neither.txt` | 16 | 0 | 0 | 16 | 7 | 9 | 0 | 3 | 18.3 s |
| `issues.txt` | 11 | 3 | 1 | 7 | 11 | 0 | 0 | 2 | 12.0 s |
| `pull_requests.txt` | 29 | 11 | 9 | 9 | 0 | 29 | 0 | 3 | 52.1 s |
| `changelogs.txt` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0.0 s |

| Part | Tasks | Use it for |
| --- | --- | --- |
| `quarter_A.txt` | 10 | Quick loop on these tasks |
| `quarter_B.txt` | 10 | Quick loop on these tasks |
| `quarter_C.txt` | 10 | Quick loop on these tasks |
| `quarter_D.txt` | 10 | Quick loop on these tasks |
| `check_A.txt` | 10 | A second grouping of the same tasks, to check a quick-loop result |
| `check_B.txt` | 10 | A second grouping of the same tasks, to check a quick-loop result |
| `check_C.txt` | 10 | A second grouping of the same tasks, to check a quick-loop result |
| `check_D.txt` | 10 | A second grouping of the same tasks, to check a quick-loop result |
| `half_1.txt` | 20 | First half |
| `half_2.txt` | 20 | Second half |
| `full.txt` | 40 | The whole set: decisions |
| `solved_both.txt` | 14 | Tasks both baseline agents solved |
| `solved_one.txt` | 10 | Tasks one baseline agent solved |
| `solved_neither.txt` | 16 | Tasks no baseline agent solved |
| `issues.txt` | 11 | Closed-issue statements only |
| `pull_requests.txt` | 29 | Pull-request statements only |
| `changelogs.txt` | 0 | Commit-and-changelog statements only |

## quarter_A.txt (10 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `click_3244` | click | both | closed issue | 65 lines | 0.2 s | CliRunner terminates with io.UnsupportedOperation when using faulthandler |
| 2 | `packaging_1362` | packaging | both | pull request | 2 lines | 0.4 s | fix(pylock): respect explicitly empty environments in select() |
| 3 | `packaging_1245` | packaging | both | pull request | 8 lines | 0.6 s | fix: duplicate explicit abi3t tags |
| 4 | `packaging_1265` | packaging | both | pull request | 8 lines | 1.8 s | fix(markers): raise UndefinedComparison for set-valued variables used outside th |
| 5 | `packaging_1266` | packaging | one agent | pull request | 18 lines | 0.6 s | fix: reject more invalid license expression forms |
| 6 | `more_itertools_1200` | more-itertools | one agent | pull request | 3 lines | 3.6 s | Raise for negative slice sizes in sliced() |
| 7 | `click_3126` | click | neither | closed issue | 23 lines | 0.3 s | Multi-line help text is not handled correctly in fish |
| 8 | `packaging_1351` | packaging | neither | closed issue | 25 lines | 0.7 s | migrating from distlib.wheel: packaging.utils.parse_wheel_filename allows illega |
| 9 | `click_3235` | click | neither | pull request | 45 lines | 0.3 s | Allow debugger interactions in tests |
| 10 | `click_3777` | click | neither | pull request | 61 lines | 0.7 s | Forward all user's parameters set in PAGER and improve flag detection |

## quarter_B.txt (10 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `click_3704` | click | both | closed issue | 26 lines | 0.8 s | Deprecate isolated_filesystem() |
| 2 | `packaging_1240` | packaging | both | pull request | 5 lines | 0.4 s | fix(direct_url): parse URL scheme case-insensitively when checking for file URLs |
| 3 | `packaging_1099` | packaging | both | pull request | 40 lines | 0.6 s | Add support for abi3.abi3t tag from PEP 803 |
| 4 | `more_itertools_1157` | more-itertools | both | pull request | 37 lines | 3.7 s | Add generator support to serialize() |
| 5 | `packaging_1234` | packaging | one agent | pull request | 23 lines | 0.8 s | fix(utils): reject empty tag components in parse_wheel_filename/parse_tag (#577) |
| 6 | `more_itertools_1211` | more-itertools | one agent | pull request | 36 lines | 3.6 s | Fix stability in running_min and running_max |
| 7 | `packaging_1334` | packaging | neither | closed issue | 18 lines | 0.4 s | Allow Pylock.select to prefer source distributions |
| 8 | `packaging_1150` | packaging | neither | closed issue | 47 lines | 0.7 s | Bug: parse_wheel_filenames accepts wheel filenames with unsorted compressed tag |
| 9 | `click_3581` | click | neither | pull request | 53 lines | 0.4 s | Add @custom_version_option , freeze @version_option |
| 10 | `packaging_1276` | packaging | neither | pull request | 21 lines | 2.0 s | fix(markers): correct Marker.evaluate :raises: from docs (and subclass KeyError |

## quarter_C.txt (10 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `packaging_1206` | packaging | both | closed issue | 53 lines | 4.8 s | Requirement pickle drops specifier prereleases |
| 2 | `packaging_1271` | packaging | both | pull request | 2 lines | 0.6 s | fix(tags): raise SystemError (not IndexError) for empty EXT_SUFFIX in _generic_a |
| 3 | `packaging_1327` | packaging | both | pull request | 45 lines | 0.6 s | fix(metadata): don't rewrite user values containing '{field}' in errors |
| 4 | `packaging_1125` | packaging | one agent | closed issue | 4 lines | 1.7 s | Document or rename markers.format_full_version() |
| 5 | `packaging_1141` | packaging | one agent | pull request | 23 lines | 1.3 s | Narrow >V post-release exclusion to match spec |
| 6 | `more_itertools_1158` | more-itertools | one agent | pull request | 15 lines | 3.7 s | Add seekable.__getitem__ to access the internal cache |
| 7 | `click_3653` | click | neither | closed issue | 14 lines | 0.6 s | ANSI codes not stripped from click.confirm after upgrading to click 8.4 |
| 8 | `click_3328` | click | neither | closed issue | 18 lines | 1.2 s | show_default as a string isn't used in prompts as the default shown |
| 9 | `click_3681` | click | neither | pull request | 6 lines | 0.5 s | Strip all ANSI sequences |
| 10 | `packaging_1168` | packaging | neither | pull request | 134 lines | 2.0 s | fix: make Specifier / SpecifierSet pickle-safe |

## quarter_D.txt (10 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `click_3764` | click | both | pull request | 5 lines | 0.6 s | Fix error reporting on Windows when an error is raised in the pager |
| 2 | `packaging_1255` | packaging | both | pull request | 44 lines | 0.7 s | perf(tags): skip platform.mac_ver() when version and arch are given |
| 3 | `packaging_1320` | packaging | both | pull request | 7 lines | 5.2 s | perf: add __slots__ to Requirement |
| 4 | `packaging_1146` | packaging | one agent | pull request | 20 lines | 1.5 s | feat: marker & and / |
| 5 | `more_itertools_1216` | more-itertools | one agent | pull request | 47 lines | 3.8 s | Issue 1214: Update __eq__ and __hash__ for numeric_range |
| 6 | `more_itertools_1269` | more-itertools | one agent | pull request | 5 lines | 4.2 s | Issue 1268: seekable.peek/bool no longer drop items when maxlen is 0 |
| 7 | `click_2969` | click | neither | closed issue | 36 lines | 0.6 s | backspace and line-wrapping acting strange on Linux |
| 8 | `click_3405` | click | neither | pull request | 36 lines | 0.5 s | click.get_pager_file : add tests (#1572 followup) |
| 9 | `more_itertools_1223` | more-itertools | neither | pull request | 3 lines | 3.7 s | Raise a clear ValueError for negative n in chunked() |
| 10 | `more_itertools_1251` | more-itertools | neither | pull request | 4 lines | 3.7 s | Issue 1250: don't mask TypeError raised while iterating in value_chain |

## check_A.txt (10 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `packaging_1206` | packaging | both | closed issue | 53 lines | 4.8 s | Requirement pickle drops specifier prereleases |
| 2 | `packaging_1271` | packaging | both | pull request | 2 lines | 0.6 s | fix(tags): raise SystemError (not IndexError) for empty EXT_SUFFIX in _generic_a |
| 3 | `packaging_1327` | packaging | both | pull request | 45 lines | 0.6 s | fix(metadata): don't rewrite user values containing '{field}' in errors |
| 4 | `packaging_1320` | packaging | both | pull request | 7 lines | 5.2 s | perf: add __slots__ to Requirement |
| 5 | `packaging_1146` | packaging | one agent | pull request | 20 lines | 1.5 s | feat: marker & and / |
| 6 | `more_itertools_1216` | more-itertools | one agent | pull request | 47 lines | 3.8 s | Issue 1214: Update __eq__ and __hash__ for numeric_range |
| 7 | `click_3653` | click | neither | closed issue | 14 lines | 0.6 s | ANSI codes not stripped from click.confirm after upgrading to click 8.4 |
| 8 | `click_3328` | click | neither | closed issue | 18 lines | 1.2 s | show_default as a string isn't used in prompts as the default shown |
| 9 | `click_3405` | click | neither | pull request | 36 lines | 0.5 s | click.get_pager_file : add tests (#1572 followup) |
| 10 | `more_itertools_1223` | more-itertools | neither | pull request | 3 lines | 3.7 s | Raise a clear ValueError for negative n in chunked() |

## check_B.txt (10 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `click_3704` | click | both | closed issue | 26 lines | 0.8 s | Deprecate isolated_filesystem() |
| 2 | `packaging_1240` | packaging | both | pull request | 5 lines | 0.4 s | fix(direct_url): parse URL scheme case-insensitively when checking for file URLs |
| 3 | `packaging_1099` | packaging | both | pull request | 40 lines | 0.6 s | Add support for abi3.abi3t tag from PEP 803 |
| 4 | `more_itertools_1157` | more-itertools | both | pull request | 37 lines | 3.7 s | Add generator support to serialize() |
| 5 | `packaging_1141` | packaging | one agent | pull request | 23 lines | 1.3 s | Narrow >V post-release exclusion to match spec |
| 6 | `more_itertools_1158` | more-itertools | one agent | pull request | 15 lines | 3.7 s | Add seekable.__getitem__ to access the internal cache |
| 7 | `packaging_1334` | packaging | neither | closed issue | 18 lines | 0.4 s | Allow Pylock.select to prefer source distributions |
| 8 | `packaging_1150` | packaging | neither | closed issue | 47 lines | 0.7 s | Bug: parse_wheel_filenames accepts wheel filenames with unsorted compressed tag |
| 9 | `click_3681` | click | neither | pull request | 6 lines | 0.5 s | Strip all ANSI sequences |
| 10 | `packaging_1168` | packaging | neither | pull request | 134 lines | 2.0 s | fix: make Specifier / SpecifierSet pickle-safe |

## check_C.txt (10 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `click_3244` | click | both | closed issue | 65 lines | 0.2 s | CliRunner terminates with io.UnsupportedOperation when using faulthandler |
| 2 | `click_3764` | click | both | pull request | 5 lines | 0.6 s | Fix error reporting on Windows when an error is raised in the pager |
| 3 | `packaging_1255` | packaging | both | pull request | 44 lines | 0.7 s | perf(tags): skip platform.mac_ver() when version and arch are given |
| 4 | `packaging_1125` | packaging | one agent | closed issue | 4 lines | 1.7 s | Document or rename markers.format_full_version() |
| 5 | `packaging_1234` | packaging | one agent | pull request | 23 lines | 0.8 s | fix(utils): reject empty tag components in parse_wheel_filename/parse_tag (#577) |
| 6 | `more_itertools_1211` | more-itertools | one agent | pull request | 36 lines | 3.6 s | Fix stability in running_min and running_max |
| 7 | `click_3126` | click | neither | closed issue | 23 lines | 0.3 s | Multi-line help text is not handled correctly in fish |
| 8 | `packaging_1351` | packaging | neither | closed issue | 25 lines | 0.7 s | migrating from distlib.wheel: packaging.utils.parse_wheel_filename allows illega |
| 9 | `click_3581` | click | neither | pull request | 53 lines | 0.4 s | Add @custom_version_option , freeze @version_option |
| 10 | `packaging_1276` | packaging | neither | pull request | 21 lines | 2.0 s | fix(markers): correct Marker.evaluate :raises: from docs (and subclass KeyError |

## check_D.txt (10 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `packaging_1362` | packaging | both | pull request | 2 lines | 0.4 s | fix(pylock): respect explicitly empty environments in select() |
| 2 | `packaging_1245` | packaging | both | pull request | 8 lines | 0.6 s | fix: duplicate explicit abi3t tags |
| 3 | `packaging_1265` | packaging | both | pull request | 8 lines | 1.8 s | fix(markers): raise UndefinedComparison for set-valued variables used outside th |
| 4 | `packaging_1266` | packaging | one agent | pull request | 18 lines | 0.6 s | fix: reject more invalid license expression forms |
| 5 | `more_itertools_1200` | more-itertools | one agent | pull request | 3 lines | 3.6 s | Raise for negative slice sizes in sliced() |
| 6 | `more_itertools_1269` | more-itertools | one agent | pull request | 5 lines | 4.2 s | Issue 1268: seekable.peek/bool no longer drop items when maxlen is 0 |
| 7 | `click_2969` | click | neither | closed issue | 36 lines | 0.6 s | backspace and line-wrapping acting strange on Linux |
| 8 | `click_3235` | click | neither | pull request | 45 lines | 0.3 s | Allow debugger interactions in tests |
| 9 | `click_3777` | click | neither | pull request | 61 lines | 0.7 s | Forward all user's parameters set in PAGER and improve flag detection |
| 10 | `more_itertools_1251` | more-itertools | neither | pull request | 4 lines | 3.7 s | Issue 1250: don't mask TypeError raised while iterating in value_chain |

## half_1.txt (20 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `click_3244` | click | both | closed issue | 65 lines | 0.2 s | CliRunner terminates with io.UnsupportedOperation when using faulthandler |
| 2 | `packaging_1362` | packaging | both | pull request | 2 lines | 0.4 s | fix(pylock): respect explicitly empty environments in select() |
| 3 | `packaging_1245` | packaging | both | pull request | 8 lines | 0.6 s | fix: duplicate explicit abi3t tags |
| 4 | `packaging_1265` | packaging | both | pull request | 8 lines | 1.8 s | fix(markers): raise UndefinedComparison for set-valued variables used outside th |
| 5 | `packaging_1266` | packaging | one agent | pull request | 18 lines | 0.6 s | fix: reject more invalid license expression forms |
| 6 | `more_itertools_1200` | more-itertools | one agent | pull request | 3 lines | 3.6 s | Raise for negative slice sizes in sliced() |
| 7 | `click_3126` | click | neither | closed issue | 23 lines | 0.3 s | Multi-line help text is not handled correctly in fish |
| 8 | `packaging_1351` | packaging | neither | closed issue | 25 lines | 0.7 s | migrating from distlib.wheel: packaging.utils.parse_wheel_filename allows illega |
| 9 | `click_3235` | click | neither | pull request | 45 lines | 0.3 s | Allow debugger interactions in tests |
| 10 | `click_3777` | click | neither | pull request | 61 lines | 0.7 s | Forward all user's parameters set in PAGER and improve flag detection |
| 11 | `click_3704` | click | both | closed issue | 26 lines | 0.8 s | Deprecate isolated_filesystem() |
| 12 | `packaging_1240` | packaging | both | pull request | 5 lines | 0.4 s | fix(direct_url): parse URL scheme case-insensitively when checking for file URLs |
| 13 | `packaging_1099` | packaging | both | pull request | 40 lines | 0.6 s | Add support for abi3.abi3t tag from PEP 803 |
| 14 | `more_itertools_1157` | more-itertools | both | pull request | 37 lines | 3.7 s | Add generator support to serialize() |
| 15 | `packaging_1234` | packaging | one agent | pull request | 23 lines | 0.8 s | fix(utils): reject empty tag components in parse_wheel_filename/parse_tag (#577) |
| 16 | `more_itertools_1211` | more-itertools | one agent | pull request | 36 lines | 3.6 s | Fix stability in running_min and running_max |
| 17 | `packaging_1334` | packaging | neither | closed issue | 18 lines | 0.4 s | Allow Pylock.select to prefer source distributions |
| 18 | `packaging_1150` | packaging | neither | closed issue | 47 lines | 0.7 s | Bug: parse_wheel_filenames accepts wheel filenames with unsorted compressed tag |
| 19 | `click_3581` | click | neither | pull request | 53 lines | 0.4 s | Add @custom_version_option , freeze @version_option |
| 20 | `packaging_1276` | packaging | neither | pull request | 21 lines | 2.0 s | fix(markers): correct Marker.evaluate :raises: from docs (and subclass KeyError |

## half_2.txt (20 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `packaging_1206` | packaging | both | closed issue | 53 lines | 4.8 s | Requirement pickle drops specifier prereleases |
| 2 | `packaging_1271` | packaging | both | pull request | 2 lines | 0.6 s | fix(tags): raise SystemError (not IndexError) for empty EXT_SUFFIX in _generic_a |
| 3 | `packaging_1327` | packaging | both | pull request | 45 lines | 0.6 s | fix(metadata): don't rewrite user values containing '{field}' in errors |
| 4 | `packaging_1125` | packaging | one agent | closed issue | 4 lines | 1.7 s | Document or rename markers.format_full_version() |
| 5 | `packaging_1141` | packaging | one agent | pull request | 23 lines | 1.3 s | Narrow >V post-release exclusion to match spec |
| 6 | `more_itertools_1158` | more-itertools | one agent | pull request | 15 lines | 3.7 s | Add seekable.__getitem__ to access the internal cache |
| 7 | `click_3653` | click | neither | closed issue | 14 lines | 0.6 s | ANSI codes not stripped from click.confirm after upgrading to click 8.4 |
| 8 | `click_3328` | click | neither | closed issue | 18 lines | 1.2 s | show_default as a string isn't used in prompts as the default shown |
| 9 | `click_3681` | click | neither | pull request | 6 lines | 0.5 s | Strip all ANSI sequences |
| 10 | `packaging_1168` | packaging | neither | pull request | 134 lines | 2.0 s | fix: make Specifier / SpecifierSet pickle-safe |
| 11 | `click_3764` | click | both | pull request | 5 lines | 0.6 s | Fix error reporting on Windows when an error is raised in the pager |
| 12 | `packaging_1255` | packaging | both | pull request | 44 lines | 0.7 s | perf(tags): skip platform.mac_ver() when version and arch are given |
| 13 | `packaging_1320` | packaging | both | pull request | 7 lines | 5.2 s | perf: add __slots__ to Requirement |
| 14 | `packaging_1146` | packaging | one agent | pull request | 20 lines | 1.5 s | feat: marker & and / |
| 15 | `more_itertools_1216` | more-itertools | one agent | pull request | 47 lines | 3.8 s | Issue 1214: Update __eq__ and __hash__ for numeric_range |
| 16 | `more_itertools_1269` | more-itertools | one agent | pull request | 5 lines | 4.2 s | Issue 1268: seekable.peek/bool no longer drop items when maxlen is 0 |
| 17 | `click_2969` | click | neither | closed issue | 36 lines | 0.6 s | backspace and line-wrapping acting strange on Linux |
| 18 | `click_3405` | click | neither | pull request | 36 lines | 0.5 s | click.get_pager_file : add tests (#1572 followup) |
| 19 | `more_itertools_1223` | more-itertools | neither | pull request | 3 lines | 3.7 s | Raise a clear ValueError for negative n in chunked() |
| 20 | `more_itertools_1251` | more-itertools | neither | pull request | 4 lines | 3.7 s | Issue 1250: don't mask TypeError raised while iterating in value_chain |

## full.txt (40 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `packaging_1146` | packaging | one agent | pull request | 20 lines | 1.5 s | feat: marker & and / |
| 2 | `packaging_1141` | packaging | one agent | pull request | 23 lines | 1.3 s | Narrow >V post-release exclusion to match spec |
| 3 | `packaging_1099` | packaging | both | pull request | 40 lines | 0.6 s | Add support for abi3.abi3t tag from PEP 803 |
| 4 | `packaging_1125` | packaging | one agent | closed issue | 4 lines | 1.7 s | Document or rename markers.format_full_version() |
| 5 | `packaging_1150` | packaging | neither | closed issue | 47 lines | 0.7 s | Bug: parse_wheel_filenames accepts wheel filenames with unsorted compressed tag |
| 6 | `packaging_1168` | packaging | neither | pull request | 134 lines | 2.0 s | fix: make Specifier / SpecifierSet pickle-safe |
| 7 | `packaging_1206` | packaging | both | closed issue | 53 lines | 4.8 s | Requirement pickle drops specifier prereleases |
| 8 | `packaging_1234` | packaging | one agent | pull request | 23 lines | 0.8 s | fix(utils): reject empty tag components in parse_wheel_filename/parse_tag (#577) |
| 9 | `packaging_1255` | packaging | both | pull request | 44 lines | 0.7 s | perf(tags): skip platform.mac_ver() when version and arch are given |
| 10 | `packaging_1245` | packaging | both | pull request | 8 lines | 0.6 s | fix: duplicate explicit abi3t tags |
| 11 | `packaging_1271` | packaging | both | pull request | 2 lines | 0.6 s | fix(tags): raise SystemError (not IndexError) for empty EXT_SUFFIX in _generic_a |
| 12 | `packaging_1276` | packaging | neither | pull request | 21 lines | 2.0 s | fix(markers): correct Marker.evaluate :raises: from docs (and subclass KeyError |
| 13 | `packaging_1266` | packaging | one agent | pull request | 18 lines | 0.6 s | fix: reject more invalid license expression forms |
| 14 | `packaging_1240` | packaging | both | pull request | 5 lines | 0.4 s | fix(direct_url): parse URL scheme case-insensitively when checking for file URLs |
| 15 | `packaging_1265` | packaging | both | pull request | 8 lines | 1.8 s | fix(markers): raise UndefinedComparison for set-valued variables used outside th |
| 16 | `packaging_1320` | packaging | both | pull request | 7 lines | 5.2 s | perf: add __slots__ to Requirement |
| 17 | `packaging_1327` | packaging | both | pull request | 45 lines | 0.6 s | fix(metadata): don't rewrite user values containing '{field}' in errors |
| 18 | `packaging_1334` | packaging | neither | closed issue | 18 lines | 0.4 s | Allow Pylock.select to prefer source distributions |
| 19 | `packaging_1351` | packaging | neither | closed issue | 25 lines | 0.7 s | migrating from distlib.wheel: packaging.utils.parse_wheel_filename allows illega |
| 20 | `packaging_1362` | packaging | both | pull request | 2 lines | 0.4 s | fix(pylock): respect explicitly empty environments in select() |
| 21 | `click_3235` | click | neither | pull request | 45 lines | 0.3 s | Allow debugger interactions in tests |
| 22 | `click_3244` | click | both | closed issue | 65 lines | 0.2 s | CliRunner terminates with io.UnsupportedOperation when using faulthandler |
| 23 | `click_3328` | click | neither | closed issue | 18 lines | 1.2 s | show_default as a string isn't used in prompts as the default shown |
| 24 | `click_2969` | click | neither | closed issue | 36 lines | 0.6 s | backspace and line-wrapping acting strange on Linux |
| 25 | `click_3126` | click | neither | closed issue | 23 lines | 0.3 s | Multi-line help text is not handled correctly in fish |
| 26 | `click_3405` | click | neither | pull request | 36 lines | 0.5 s | click.get_pager_file : add tests (#1572 followup) |
| 27 | `click_3653` | click | neither | closed issue | 14 lines | 0.6 s | ANSI codes not stripped from click.confirm after upgrading to click 8.4 |
| 28 | `click_3581` | click | neither | pull request | 53 lines | 0.4 s | Add @custom_version_option , freeze @version_option |
| 29 | `click_3681` | click | neither | pull request | 6 lines | 0.5 s | Strip all ANSI sequences |
| 30 | `click_3704` | click | both | closed issue | 26 lines | 0.8 s | Deprecate isolated_filesystem() |
| 31 | `click_3764` | click | both | pull request | 5 lines | 0.6 s | Fix error reporting on Windows when an error is raised in the pager |
| 32 | `click_3777` | click | neither | pull request | 61 lines | 0.7 s | Forward all user's parameters set in PAGER and improve flag detection |
| 33 | `more_itertools_1157` | more-itertools | both | pull request | 37 lines | 3.7 s | Add generator support to serialize() |
| 34 | `more_itertools_1158` | more-itertools | one agent | pull request | 15 lines | 3.7 s | Add seekable.__getitem__ to access the internal cache |
| 35 | `more_itertools_1200` | more-itertools | one agent | pull request | 3 lines | 3.6 s | Raise for negative slice sizes in sliced() |
| 36 | `more_itertools_1211` | more-itertools | one agent | pull request | 36 lines | 3.6 s | Fix stability in running_min and running_max |
| 37 | `more_itertools_1216` | more-itertools | one agent | pull request | 47 lines | 3.8 s | Issue 1214: Update __eq__ and __hash__ for numeric_range |
| 38 | `more_itertools_1223` | more-itertools | neither | pull request | 3 lines | 3.7 s | Raise a clear ValueError for negative n in chunked() |
| 39 | `more_itertools_1251` | more-itertools | neither | pull request | 4 lines | 3.7 s | Issue 1250: don't mask TypeError raised while iterating in value_chain |
| 40 | `more_itertools_1269` | more-itertools | one agent | pull request | 5 lines | 4.2 s | Issue 1268: seekable.peek/bool no longer drop items when maxlen is 0 |

## solved_both.txt (14 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `click_3244` | click | both | closed issue | 65 lines | 0.2 s | CliRunner terminates with io.UnsupportedOperation when using faulthandler |
| 2 | `packaging_1362` | packaging | both | pull request | 2 lines | 0.4 s | fix(pylock): respect explicitly empty environments in select() |
| 3 | `packaging_1240` | packaging | both | pull request | 5 lines | 0.4 s | fix(direct_url): parse URL scheme case-insensitively when checking for file URLs |
| 4 | `packaging_1271` | packaging | both | pull request | 2 lines | 0.6 s | fix(tags): raise SystemError (not IndexError) for empty EXT_SUFFIX in _generic_a |
| 5 | `click_3764` | click | both | pull request | 5 lines | 0.6 s | Fix error reporting on Windows when an error is raised in the pager |
| 6 | `packaging_1245` | packaging | both | pull request | 8 lines | 0.6 s | fix: duplicate explicit abi3t tags |
| 7 | `packaging_1099` | packaging | both | pull request | 40 lines | 0.6 s | Add support for abi3.abi3t tag from PEP 803 |
| 8 | `packaging_1327` | packaging | both | pull request | 45 lines | 0.6 s | fix(metadata): don't rewrite user values containing '{field}' in errors |
| 9 | `packaging_1255` | packaging | both | pull request | 44 lines | 0.7 s | perf(tags): skip platform.mac_ver() when version and arch are given |
| 10 | `click_3704` | click | both | closed issue | 26 lines | 0.8 s | Deprecate isolated_filesystem() |
| 11 | `packaging_1265` | packaging | both | pull request | 8 lines | 1.8 s | fix(markers): raise UndefinedComparison for set-valued variables used outside th |
| 12 | `more_itertools_1157` | more-itertools | both | pull request | 37 lines | 3.7 s | Add generator support to serialize() |
| 13 | `packaging_1206` | packaging | both | closed issue | 53 lines | 4.8 s | Requirement pickle drops specifier prereleases |
| 14 | `packaging_1320` | packaging | both | pull request | 7 lines | 5.2 s | perf: add __slots__ to Requirement |

## solved_one.txt (10 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `packaging_1266` | packaging | one agent | pull request | 18 lines | 0.6 s | fix: reject more invalid license expression forms |
| 2 | `packaging_1234` | packaging | one agent | pull request | 23 lines | 0.8 s | fix(utils): reject empty tag components in parse_wheel_filename/parse_tag (#577) |
| 3 | `packaging_1141` | packaging | one agent | pull request | 23 lines | 1.3 s | Narrow >V post-release exclusion to match spec |
| 4 | `packaging_1146` | packaging | one agent | pull request | 20 lines | 1.5 s | feat: marker & and / |
| 5 | `packaging_1125` | packaging | one agent | closed issue | 4 lines | 1.7 s | Document or rename markers.format_full_version() |
| 6 | `more_itertools_1200` | more-itertools | one agent | pull request | 3 lines | 3.6 s | Raise for negative slice sizes in sliced() |
| 7 | `more_itertools_1211` | more-itertools | one agent | pull request | 36 lines | 3.6 s | Fix stability in running_min and running_max |
| 8 | `more_itertools_1158` | more-itertools | one agent | pull request | 15 lines | 3.7 s | Add seekable.__getitem__ to access the internal cache |
| 9 | `more_itertools_1216` | more-itertools | one agent | pull request | 47 lines | 3.8 s | Issue 1214: Update __eq__ and __hash__ for numeric_range |
| 10 | `more_itertools_1269` | more-itertools | one agent | pull request | 5 lines | 4.2 s | Issue 1268: seekable.peek/bool no longer drop items when maxlen is 0 |

## solved_neither.txt (16 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `click_3126` | click | neither | closed issue | 23 lines | 0.3 s | Multi-line help text is not handled correctly in fish |
| 2 | `click_3235` | click | neither | pull request | 45 lines | 0.3 s | Allow debugger interactions in tests |
| 3 | `packaging_1334` | packaging | neither | closed issue | 18 lines | 0.4 s | Allow Pylock.select to prefer source distributions |
| 4 | `click_3581` | click | neither | pull request | 53 lines | 0.4 s | Add @custom_version_option , freeze @version_option |
| 5 | `click_3681` | click | neither | pull request | 6 lines | 0.5 s | Strip all ANSI sequences |
| 6 | `click_3405` | click | neither | pull request | 36 lines | 0.5 s | click.get_pager_file : add tests (#1572 followup) |
| 7 | `click_3653` | click | neither | closed issue | 14 lines | 0.6 s | ANSI codes not stripped from click.confirm after upgrading to click 8.4 |
| 8 | `click_2969` | click | neither | closed issue | 36 lines | 0.6 s | backspace and line-wrapping acting strange on Linux |
| 9 | `packaging_1351` | packaging | neither | closed issue | 25 lines | 0.7 s | migrating from distlib.wheel: packaging.utils.parse_wheel_filename allows illega |
| 10 | `packaging_1150` | packaging | neither | closed issue | 47 lines | 0.7 s | Bug: parse_wheel_filenames accepts wheel filenames with unsorted compressed tag |
| 11 | `click_3777` | click | neither | pull request | 61 lines | 0.7 s | Forward all user's parameters set in PAGER and improve flag detection |
| 12 | `click_3328` | click | neither | closed issue | 18 lines | 1.2 s | show_default as a string isn't used in prompts as the default shown |
| 13 | `packaging_1276` | packaging | neither | pull request | 21 lines | 2.0 s | fix(markers): correct Marker.evaluate :raises: from docs (and subclass KeyError |
| 14 | `packaging_1168` | packaging | neither | pull request | 134 lines | 2.0 s | fix: make Specifier / SpecifierSet pickle-safe |
| 15 | `more_itertools_1223` | more-itertools | neither | pull request | 3 lines | 3.7 s | Raise a clear ValueError for negative n in chunked() |
| 16 | `more_itertools_1251` | more-itertools | neither | pull request | 4 lines | 3.7 s | Issue 1250: don't mask TypeError raised while iterating in value_chain |

## issues.txt (11 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `packaging_1125` | packaging | one agent | closed issue | 4 lines | 1.7 s | Document or rename markers.format_full_version() |
| 2 | `packaging_1150` | packaging | neither | closed issue | 47 lines | 0.7 s | Bug: parse_wheel_filenames accepts wheel filenames with unsorted compressed tag |
| 3 | `packaging_1206` | packaging | both | closed issue | 53 lines | 4.8 s | Requirement pickle drops specifier prereleases |
| 4 | `packaging_1334` | packaging | neither | closed issue | 18 lines | 0.4 s | Allow Pylock.select to prefer source distributions |
| 5 | `packaging_1351` | packaging | neither | closed issue | 25 lines | 0.7 s | migrating from distlib.wheel: packaging.utils.parse_wheel_filename allows illega |
| 6 | `click_3244` | click | both | closed issue | 65 lines | 0.2 s | CliRunner terminates with io.UnsupportedOperation when using faulthandler |
| 7 | `click_3328` | click | neither | closed issue | 18 lines | 1.2 s | show_default as a string isn't used in prompts as the default shown |
| 8 | `click_2969` | click | neither | closed issue | 36 lines | 0.6 s | backspace and line-wrapping acting strange on Linux |
| 9 | `click_3126` | click | neither | closed issue | 23 lines | 0.3 s | Multi-line help text is not handled correctly in fish |
| 10 | `click_3653` | click | neither | closed issue | 14 lines | 0.6 s | ANSI codes not stripped from click.confirm after upgrading to click 8.4 |
| 11 | `click_3704` | click | both | closed issue | 26 lines | 0.8 s | Deprecate isolated_filesystem() |

## pull_requests.txt (29 tasks)

| # | Task | Repository | Group | Statement | Fix | Gold test | What it is |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `packaging_1146` | packaging | one agent | pull request | 20 lines | 1.5 s | feat: marker & and / |
| 2 | `packaging_1141` | packaging | one agent | pull request | 23 lines | 1.3 s | Narrow >V post-release exclusion to match spec |
| 3 | `packaging_1099` | packaging | both | pull request | 40 lines | 0.6 s | Add support for abi3.abi3t tag from PEP 803 |
| 4 | `packaging_1168` | packaging | neither | pull request | 134 lines | 2.0 s | fix: make Specifier / SpecifierSet pickle-safe |
| 5 | `packaging_1234` | packaging | one agent | pull request | 23 lines | 0.8 s | fix(utils): reject empty tag components in parse_wheel_filename/parse_tag (#577) |
| 6 | `packaging_1255` | packaging | both | pull request | 44 lines | 0.7 s | perf(tags): skip platform.mac_ver() when version and arch are given |
| 7 | `packaging_1245` | packaging | both | pull request | 8 lines | 0.6 s | fix: duplicate explicit abi3t tags |
| 8 | `packaging_1271` | packaging | both | pull request | 2 lines | 0.6 s | fix(tags): raise SystemError (not IndexError) for empty EXT_SUFFIX in _generic_a |
| 9 | `packaging_1276` | packaging | neither | pull request | 21 lines | 2.0 s | fix(markers): correct Marker.evaluate :raises: from docs (and subclass KeyError |
| 10 | `packaging_1266` | packaging | one agent | pull request | 18 lines | 0.6 s | fix: reject more invalid license expression forms |
| 11 | `packaging_1240` | packaging | both | pull request | 5 lines | 0.4 s | fix(direct_url): parse URL scheme case-insensitively when checking for file URLs |
| 12 | `packaging_1265` | packaging | both | pull request | 8 lines | 1.8 s | fix(markers): raise UndefinedComparison for set-valued variables used outside th |
| 13 | `packaging_1320` | packaging | both | pull request | 7 lines | 5.2 s | perf: add __slots__ to Requirement |
| 14 | `packaging_1327` | packaging | both | pull request | 45 lines | 0.6 s | fix(metadata): don't rewrite user values containing '{field}' in errors |
| 15 | `packaging_1362` | packaging | both | pull request | 2 lines | 0.4 s | fix(pylock): respect explicitly empty environments in select() |
| 16 | `click_3235` | click | neither | pull request | 45 lines | 0.3 s | Allow debugger interactions in tests |
| 17 | `click_3405` | click | neither | pull request | 36 lines | 0.5 s | click.get_pager_file : add tests (#1572 followup) |
| 18 | `click_3581` | click | neither | pull request | 53 lines | 0.4 s | Add @custom_version_option , freeze @version_option |
| 19 | `click_3681` | click | neither | pull request | 6 lines | 0.5 s | Strip all ANSI sequences |
| 20 | `click_3764` | click | both | pull request | 5 lines | 0.6 s | Fix error reporting on Windows when an error is raised in the pager |
| 21 | `click_3777` | click | neither | pull request | 61 lines | 0.7 s | Forward all user's parameters set in PAGER and improve flag detection |
| 22 | `more_itertools_1157` | more-itertools | both | pull request | 37 lines | 3.7 s | Add generator support to serialize() |
| 23 | `more_itertools_1158` | more-itertools | one agent | pull request | 15 lines | 3.7 s | Add seekable.__getitem__ to access the internal cache |
| 24 | `more_itertools_1200` | more-itertools | one agent | pull request | 3 lines | 3.6 s | Raise for negative slice sizes in sliced() |
| 25 | `more_itertools_1211` | more-itertools | one agent | pull request | 36 lines | 3.6 s | Fix stability in running_min and running_max |
| 26 | `more_itertools_1216` | more-itertools | one agent | pull request | 47 lines | 3.8 s | Issue 1214: Update __eq__ and __hash__ for numeric_range |
| 27 | `more_itertools_1223` | more-itertools | neither | pull request | 3 lines | 3.7 s | Raise a clear ValueError for negative n in chunked() |
| 28 | `more_itertools_1251` | more-itertools | neither | pull request | 4 lines | 3.7 s | Issue 1250: don't mask TypeError raised while iterating in value_chain |
| 29 | `more_itertools_1269` | more-itertools | one agent | pull request | 5 lines | 4.2 s | Issue 1268: seekable.peek/bool no longer drop items when maxlen is 0 |
