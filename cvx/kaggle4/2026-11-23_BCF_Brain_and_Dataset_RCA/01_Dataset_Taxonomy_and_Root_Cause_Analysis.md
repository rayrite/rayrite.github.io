# Gemma 4 Developer Agent: public problem dataset - taxonomy and root-cause analysis of all 129 tasks

**Competition:** Kaggle, Google Gemma 4 Developer Agent (competition 149921). **Prepared:** 2026-11-23 (local time).
**Dataset examined:** the 129 published development tasks in `tasks.jsonl` of `gemma-4-developer-agent.zip` (FastAPI 67, rich 48, requests 13, httpx 1), each with its problem statement, gold patch and hidden test patch, plus the full repository snapshot at the base commit (indexed locally from the zip: 129 snapshots, about 2,700 text files each).
**Companion document:** `02_BCF_Brain_Design_and_Justification.md` turns the findings of Section 7 into the agent design.

---

## 0. Executive summary

1. **The dataset is a bug-fix benchmark with a feature tail.** Of 129 tasks, 90 (69.8%) are bug fixes, 18 (14.0%) are new features, 11 are deliberate behaviour changes (deprecations, removals, new warnings), and 5 + 3 + 2 are refactors, documentation and build tooling. Mean judged difficulty for a Gemma 4 31B agent under a five-minute budget is 2.92 of 5.
2. **Two root-cause families account for half of all bug fixes.** Among the 90 bug fixes, 21 are a missing branch or an unhandled input class and 16 a wrong assumption about data shape or type (together 43, 47.8%). Another 22 (24.4%) are coordination failures: 11 regressions from an earlier change and 11 places where duplicated or parallel logic drifted apart.
3. **The specification, not the code, is the main obstacle.** 47 tasks (36.4%) have a statement under 250 characters: 27 are a title plus a link whose target is unreachable in the offline sandbox and 20 a bare title. Reviewers judged 52 tasks (40.3%) to have a severe specification gap: the hidden tests need a public name, an exact message or a format that the statement never gives. Mean difficulty climbs from 1.7 (no gap) to 2.72 (minor) to 3.75 (severe).
4. **Fixes are small; knowing what to fix is the work.** 91 of 129 gold patches touch one file, 41 change four lines or fewer and 22 change at most two lines. Difficulty tracks breadth, not size of idea: one-file tasks average 2.53, multi-file tasks 3.87.
5. **The hidden tests are strict.** 60 of 129 tasks have tests that compare exact strings, messages or structures; 19 require a new public name that the statement does not give, and 18 of those are severe-gap tasks with mean difficulty 4.32.
6. **Over half of the dataset is cleanly addressable.** 69 tasks (53.5%) combine a none-or-minor specification gap with difficulty 3 or less. 31 tasks (24.0%) are both severely under-specified and hard: they are where agent time is wasted.
7. **Local measurement is biased.** 29 tasks (22.5%) have hidden tests that import a package missing from the public sandbox (21 FastAPI: `inline_snapshot`, `dirty_equals`; 8 requests: an `httpbin` fixture). Any local A/B test that keeps them measures noise.
8. **Emoji prefixes are unreliable labels.** The 67 FastAPI statements open with a git-emoji; it predicts the effect-based category in only 50 of 67 cases (74.6%). A classifier must read keywords and the change itself.

The practical consequence for an agent is in Section 7: route by specification level first, by engineering domain second.

---

## 1. Scope, data and method

### 1.1 What counts as "the public dataset"

The competition publishes 129 development tasks. Each record has `instance_id`, `repo`, `base_commit`, `patch` (the accepted upstream fix), `test_patch` (tests the grader adds later), `problem_statement` and `hints_text` (empty for all 129). The agent sees only the statement and the repository at `base_commit`; it never sees `test_patch`. Scoring applies the agent's patch to a fresh checkout, resets every test and test-configuration file, applies `test_patch`, and marks the task resolved only if the targeted `pytest` run passes completely.

Two facts frame the whole analysis:

- **The scored leaderboard tasks are not these 129.** Staff stated that none of the private-repository tasks used for scoring touch an async function, and competitors report that the roughly 120 scored tasks come from private repositories and "behave very differently" from the published ones (discussion 756400, 745998). The 129 tasks are therefore a development proxy, not a sample of the test set.
- **The problem statement is often only an issue title.** 36.4% of statements are shorter than 250 characters.

### 1.2 Method

| Step | What was done | Output |
|---|---|---|
| 1. Deterministic features | Parsed every statement, gold patch and test patch: sizes, files, hunks, new symbols, imports added by tests, missing packages, statement level | 129 records |
| 2. Snapshot index | Streamed all 129 repository snapshots out of the 21.9 GB zip into a content-addressed store (text files only) | 129 index files, 98 MB of blobs |
| 3. Analysis packs | Built one pack per task: statement, gold patch with the pre-fix function enclosing every hunk, hidden-test digest, spec-sufficiency flags | 129 packs, 704 KB |
| 4. Root-cause coding | 13 independent review passes coded every task against a closed scheme (category, domain, mechanism, spec gap, difficulty, drivers, route), opening the pre-fix source where the pack left the mechanism open | 129 records |
| 5. Cross-check | Every code checked against its closed list; every record's file list compared with the gold patch | 0 problems, file-list recall 1.00, precision 1.00 |
| 6. Render | Tables and cards generated from the merged records; no number in this document is typed by hand | this file |

### 1.3 The classification scheme (three axes plus a route)

- **Axis 1 - Category (what kind of change):** C1 Bug fix, C2 New feature, C3 Refactor, C4 Behaviour change, C5 Documentation, C6 Build / tooling. Decided from the effect of the gold patch, not from the title or emoji.
- **Axis 2 - Sub-category (engineering domain):** 17 closed domains such as request/validation parameter handling (VAL), dependency-injection machinery (DI), text measurement (WID), console I/O (CON). Every task has one primary domain and an optional secondary one.
- **Axis 3 - Root-cause mechanism:** 16 closed codes R01-R16 (for example R01 missing branch, R04 regression, R13 incomplete feature).
- **Supporting judgements:** specification gap (none / minor / severe), difficulty 1-5 for a Gemma 4 31B agent under a five-minute budget, difficulty drivers, and the brain route P1-P10 that the task calls for.
- **Deterministic statement level:** L1 prescriptive, L2 descriptive, L3 title + link, L4 title only (computed from the statement text, independent of the reviewers).

### 1.4 Limitations

- Root-cause codes and difficulty are expert judgements made from the patch, the test digest and the pre-fix source; they are reproducible (closed lists, one pass per task with cross-checks) but not inter-rater tested.
- "Tests require" is read from the test patch; the grading harness derives its own required-test list, which can differ.
- Difficulty assumes one model, one budget and the stock harness tools. It is not a measured resolve rate.
- The hidden set comes from other repositories. Distributions found here describe the development tasks.

---

## 2. Anatomy of the dataset

### 2.1 Repositories and time

| Repository | 2023 | 2024 | 2025 | 2026 | Tasks | Share |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| fastapi | 0 | 0 | 41 | 26 | 67 | 51.9% |
| rich | 9 | 17 | 6 | 16 | 48 | 37.2% |
| requests | 1 | 4 | 0 | 8 | 13 | 10.1% |
| httpx | 0 | 0 | 1 | 0 | 1 | 0.8% |
| Total | 10 | 21 | 48 | 50 | 129 | 100.0% |

Three quarters of the tasks come from FastAPI and rich. The 2023-2024 tasks are almost all bug fixes; from 2025 on, features, behaviour changes and refactors appear (Section 3.4).

### 2.2 How much information the problem statement carries

| Level | Kind | Rule | Tasks | Share | Judged severe gap | Mean difficulty | Gold file in localizer top 5 | Gold file in top 9 |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| L1 | Prescriptive | statement carries code and a fix cue ("to fix", "solution", test plan) | 12 | 9.3% | 0 | 2 | 9/12 | 11/12 |
| L2 | Descriptive | 250+ characters: symptoms, examples or expected behaviour, no fix spelled out | 70 | 54.3% | 17 | 2.91 | 30/70 | 57/70 |
| L3 | Title + link | under 250 characters with a URL whose target is unreachable in the offline sandbox | 27 | 20.9% | 21 | 3 | 9/27 | 16/27 |
| L4 | Title only | under 250 characters, no link | 20 | 15.5% | 14 | 3.4 | 8/20 | 12/20 |

| Repository | L1 | L2 | L3 | L4 | Under 250 characters | Share of repository |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| fastapi | 11 | 40 | 4 | 12 | 16 | 23.9% |
| rich | 1 | 20 | 23 | 4 | 27 | 56.2% |
| requests | 0 | 10 | 0 | 3 | 3 | 23.1% |
| httpx | 0 | 0 | 0 | 1 | 1 | 100.0% |
| Total | 12 | 70 | 27 | 20 | 47 | 36.4% |

rich is the terse repository: 27 of its 48 statements (27 / 48) are a title, often four or five words such as "empty live", "fix fonts", "proxy isatty". FastAPI statements are longer because many are full GitHub issue reports with a reproducible example.

The last two columns join an independent measurement: a deterministic localizer (keyword search weighted by term rarity, described in the companion document) was given only the identifiers and title words of each statement and asked to rank the repository's functions. It puts the gold-touched file in its top 9 for 96 of 129 tasks. The hit rate is high when the statement says something (L1, L2) and drops to about 60% for titles: a terse statement starves both the reader and the search tool.

### 2.3 Shape of the accepted fixes

| Gold patch size (added + removed lines) | Tasks | Share | Mean difficulty |
| --- | ---: | ---: | ---: |
| 1-4 lines | 41 | 31.8% | 2.32 |
| 5-10 lines | 19 | 14.7% | 2.21 |
| 11-30 lines | 29 | 22.5% | 2.76 |
| 31-100 lines | 24 | 18.6% | 3.62 |
| more than 100 lines | 16 | 12.4% | 4.56 |

| Files in the gold patch | Tasks | Mean difficulty |
| --- | ---: | ---: |
| 1 | 91 | 2.53 |
| 2 | 19 | 3.47 |
| 3 | 5 | 3.6 |
| 4 | 3 | 4.33 |
| 5 or more | 11 | 4.55 |

| Difficulty (1 easy, 5 near-impossible) | Tasks | Share | FastAPI | rich | requests | httpx | Mean gold files |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 1 | 12 | 9.3% | 4 | 4 | 4 | 0 | 1 |
| 2 | 36 | 27.9% | 19 | 11 | 6 | 0 | 1.1 |
| 3 | 42 | 32.6% | 18 | 22 | 2 | 0 | 1.3 |
| 4 | 28 | 21.7% | 17 | 9 | 1 | 1 | 2.6 |
| 5 | 11 | 8.5% | 9 | 2 | 0 | 0 | 8.8 |
| Total | 129 | 100.0% | 67 | 48 | 13 | 1 | 2.2 |

Difficulty is a function of breadth. Single-file tasks average 2.53; from four files on, the mean is above 4.3 and the mean number of gold files jumps to 8.8 at difficulty 5 (refactors and removals).

### 2.4 Local gradability

| Repository | Tasks | Hidden tests import a package missing from the public sandbox | Cause |
| --- | ---: | ---: | --- |
| fastapi | 67 | 21 | inline_snapshot (18), dirty_equals (5) |
| requests | 13 | 8 | httpbin network fixture (8) |
| rich | 48 | 0 | none |
| httpx | 1 | 0 | none |
| Total | 129 | 29 | 22.5% |

A correct patch cannot be verified locally on 29 tasks because the public sandbox lacks a test dependency. These are not "impossible tasks" on the scoreboard - staff confirmed that the hidden tasks validate with their gold patch - but they must be excluded from local experiments.

---

## 3. The taxonomy

### 3.1 Category

| Code | Category | Definition | Tasks | Share | FastAPI | rich | requests | httpx | Mean difficulty |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| C1 | Bug fix | Wrong behaviour corrected; behaviour after the change matches the documented or intended contract. | 90 | 69.8% | 38 | 39 | 12 | 1 | 2.66 |
| C2 | New feature | A capability that did not exist: new parameter, class, response type, API surface. | 18 | 14.0% | 11 | 7 | 0 | 0 | 3.72 |
| C3 | Refactor | Internal rework that preserves behaviour (or extends it incidentally): structure, performance, reuse. | 5 | 3.9% | 3 | 1 | 1 | 0 | 3.8 |
| C4 | Behaviour change | Deliberate change of an existing contract: deprecation, removal, new warning, stricter check. | 11 | 8.5% | 10 | 1 | 0 | 0 | 3.36 |
| C5 | Documentation | Only documentation content or executable examples change. | 3 | 2.3% | 3 | 0 | 0 | 0 | 2.67 |
| C6 | Build / tooling | Release scripts, dependency ranges, test infrastructure. | 2 | 1.6% | 2 | 0 | 0 | 0 | 3.5 |

### 3.2 Sub-category (engineering domain)

| Code | Sub-category (engineering domain) | Covers | Primary | Any role | FastAPI | rich | requests | httpx |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| VAL | Request / validation parameter handling | Query, header, cookie, form and body parameters; defaults, aliases, extra fields, sequences, parameter models. | 10 | 16 | 16 | 0 | 0 | 0 |
| TYP | Type-annotation and model introspection | Unions, discriminators, Annotated, forward references, wrapped functions, stringified annotations, typing constructs. | 10 | 19 | 19 | 0 | 0 | 0 |
| OAS | Schema / contract generation | OpenAPI and JSON-Schema output: keys, refs, security schemes, media types. | 10 | 15 | 15 | 0 | 0 | 0 |
| DI | Dependency-injection machinery | Dependency graph construction, caching, hashing, scopes, wrapped or partial dependables, class dependencies. | 9 | 16 | 16 | 0 | 0 | 0 |
| RTG | Routing and lifecycle | Routers, prefixes, route contexts, startup/shutdown and event hooks, exception handling and traceback metadata. | 9 | 15 | 15 | 0 | 0 | 0 |
| SER | Serialisation and streaming | Response encoding, response models, server-sent events, response classes. | 4 | 10 | 10 | 0 | 0 | 0 |
| SEC | Security and auth | Credential headers, status codes, OAuth scopes, strict content-type checks. | 5 | 7 | 6 | 0 | 1 | 0 |
| CMP | Compatibility shims | Pydantic v1/v2 layers, Starlette compatibility, urllib3 versions, version branches. | 6 | 11 | 10 | 0 | 1 | 0 |
| WID | Text measurement and segmentation | Cell widths, grapheme clusters, wrapping, split cells, Unicode tables. | 10 | 12 | 0 | 12 | 0 | 0 |
| PAR | Markup / Markdown / syntax parsing | Escaping, ANSI codes, Markdown tables, highlighters, lexers, regexes. | 9 | 12 | 0 | 12 | 0 | 0 |
| REN | Widget rendering and styling | Table, panel, live, progress, segments, styles, padding and backgrounds. | 11 | 13 | 0 | 13 | 0 | 0 |
| CON | Console / terminal I/O | Capture and record, broken pipes, tty detection, proxies, environment switches, import-time behaviour. | 11 | 14 | 0 | 14 | 0 | 0 |
| DBG | Developer-facing introspection | Tracebacks, pretty printing, repr, inspect, notes and error locations. | 7 | 7 | 1 | 6 | 0 | 0 |
| NET | Network / HTTP protocol behaviour | Header and content-type parsing, redirects, netrc, URL paths, keep-alive, connection handling. | 8 | 11 | 1 | 0 | 9 | 1 |
| OBJ | Object protocol and duck typing | isinstance versus capability checks, __getattr__ proxies, pickling, hashing of objects. | 6 | 10 | 1 | 5 | 4 | 0 |
| EXM | Documentation examples | Executable example applications that documentation tests import. | 3 | 3 | 3 | 0 | 0 | 0 |
| BLD | Build, release and tooling | Release automation and developer tooling. | 1 | 1 | 1 | 0 | 0 | 0 |

"Primary" counts tasks whose main domain it is; "Any role" also counts it as secondary domain. Eleven domains hold 129 of the primary assignments across the four repositories: the taxonomy is repository-shaped, and an agent that will meet unseen repositories needs the domain table to be open-ended rather than memorised per repository.

### 3.3 Root-cause mechanism

| Code | Root-cause mechanism | All tasks | Share | Among the 90 bug fixes | Share of bug fixes |
| --- | --- | ---: | ---: | ---: | ---: |
| R01 | Missing branch / unhandled input class | 22 | 17.1% | 21 | 23.3% |
| R02 | Wrong assumption about data shape or type | 17 | 13.2% | 16 | 17.8% |
| R03 | Duplicated or parallel logic out of sync | 13 | 10.1% | 11 | 12.2% |
| R04 | Regression from an earlier change | 11 | 8.5% | 11 | 12.2% |
| R05 | Upstream dependency change | 3 | 2.3% | 2 | 2.2% |
| R06 | Boundary / empty-input / off-by-one error | 6 | 4.7% | 6 | 6.7% |
| R07 | Algorithmic flaw (loop, ordering, non-termination) | 7 | 5.4% | 7 | 7.8% |
| R08 | Encoding / escaping / whitespace error | 3 | 2.3% | 3 | 3.3% |
| R09 | State, identity, caching or hashing error | 5 | 3.9% | 5 | 5.6% |
| R10 | Error-handling gap | 7 | 5.4% | 4 | 4.4% |
| R11 | Environment / platform assumption | 1 | 0.8% | 1 | 1.1% |
| R12 | Contract mismatch | 3 | 2.3% | 2 | 2.2% |
| R13 | Incomplete feature | 19 | 14.7% | 0 | 0.0% |
| R14 | Design improvement / tech debt | 5 | 3.9% | 0 | 0.0% |
| R15 | Dependency / compatibility / tooling drift | 4 | 3.1% | 1 | 1.1% |
| R16 | Documentation error | 3 | 2.3% | 0 | 0.0% |

| Mechanism | fastapi | rich | requests | httpx | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| R01 Missing branch / unhandled input class | 10 | 8 | 3 | 1 | 22 |
| R02 Wrong assumption about data shape or type | 11 | 4 | 2 | 0 | 17 |
| R03 Duplicated or parallel logic out of sync | 5 | 7 | 1 | 0 | 13 |
| R04 Regression from an earlier change | 6 | 2 | 3 | 0 | 11 |
| R05 Upstream dependency change | 2 | 0 | 1 | 0 | 3 |
| R06 Boundary / empty-input / off-by-one error | 0 | 5 | 1 | 0 | 6 |
| R07 Algorithmic flaw (loop, ordering, non-termination) | 1 | 6 | 0 | 0 | 7 |
| R08 Encoding / escaping / whitespace error | 1 | 2 | 0 | 0 | 3 |
| R09 State, identity, caching or hashing error | 4 | 1 | 0 | 0 | 5 |
| R10 Error-handling gap | 4 | 2 | 1 | 0 | 7 |
| R11 Environment / platform assumption | 0 | 1 | 0 | 0 | 1 |
| R12 Contract mismatch | 2 | 1 | 0 | 0 | 3 |
| R13 Incomplete feature | 12 | 7 | 0 | 0 | 19 |
| R14 Design improvement / tech debt | 3 | 2 | 0 | 0 | 5 |
| R15 Dependency / compatibility / tooling drift | 3 | 0 | 1 | 0 | 4 |
| R16 Documentation error | 3 | 0 | 0 | 0 | 3 |

### 3.4 Category by statement level and by year

| Category | L1 | L2 | L3 | L4 | Total | Severe gap |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| C1 | 10 | 48 | 24 | 8 | 90 | 31 |
| C2 | 1 | 10 | 3 | 4 | 18 | 10 |
| C3 | 0 | 4 | 0 | 1 | 5 | 2 |
| C4 | 1 | 6 | 0 | 4 | 11 | 6 |
| C5 | 0 | 0 | 0 | 3 | 3 | 2 |
| C6 | 0 | 2 | 0 | 0 | 2 | 1 |

| Year | C1 | C2 | C3 | C4 | C5 | C6 | Total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 2023 | 9 | 1 | 0 | 0 | 0 | 0 | 10 |
| 2024 | 19 | 2 | 0 | 0 | 0 | 0 | 21 |
| 2025 | 34 | 9 | 0 | 3 | 1 | 1 | 48 |
| 2026 | 28 | 6 | 5 | 8 | 2 | 1 | 50 |

Features cluster in descriptive statements because a new capability needs a paragraph to describe; titles are almost always bug fixes.

### 3.5 Emoji prefixes versus effect

| Task | Emoji prefix | Category implied by the emoji | Category from the patch's effect | Statement title |
| --- | ---: | --- | --- | --- |
| `fastapi_13786` | 🐛 | C1 | C4 | 🐛 Use `401` status code in security classes when credentials are missing |
| `fastapi_14077` | ⬆️ | C4 | C6 | ⬆️ Upgrade Starlette supported version range to >=0.40.0,<0.49.0 |
| `fastapi_14258` | ✨ | C2 | C4 | ✨ Show a clear error on attempt to include router into itself |
| `fastapi_14306` | 🚸 | C4 | C2 | 🚸  Improve tracebacks by adding endpoint metadata |
| `fastapi_14372` | ♻️ | C3 | C2 | ♻️ Make the result of `Depends()` and `Security()` hashable, as a workaround f |
| `fastapi_14605` | 🔊 | C4 | C2 | 🔊 Add a custom `FastAPIDeprecationWarning` |
| `fastapi_14791` | 🐛 | C1 | C4 | 🐛 Update `ValidationError` schema to include `input` and `ctx` |
| `fastapi_14794` | ✨ | C2 | C1 | ✨ Allow `Response` type hint as dependency annotation |
| `fastapi_14953` | ♻️ | C3 | C1 | ♻️ Fix JSON Schema for bytes, use `"contentMediaType": "application/octet-stre |
| `fastapi_14962` | ✨ | C2 | C3 | ✨ Serialize JSON response with Pydantic (in Rust), when there's a Pydantic ret |
| `fastapi_14978` | 🔒️ | C2 | C4 | 🔒️ Add `strict_content_type` checking for JSON requests |
| `fastapi_14986` | ♻️ | C3 | C1 | ♻️ Refactor logic to handle OpenAPI and Swagger UI escaping data |
| `fastapi_15588` | ♻️ | C3 | C4 | ♻️ Validate Server Sent Event fields to avoid applications from sending broken |
| `fastapi_15589` | ♻️ | C3 | C4 | ♻️ Do not accept underscore headers when using `convert_underscores=True` (the |
| `fastapi_5077` | ✨ | C2 | C1 | ✨ Add support for wrapped functions (e.g. `@functools.wraps()`) used with forw |
| `fastapi_9425` | ✨ | C2 | C1 | ✨  Allow `None` as return type for bodiless responses |
| `fastapi_9555` | ✨ | C2 | C1 | ✨ Handle wrapped dependencies |

Of 67 FastAPI statements with an emoji prefix, 50 agree with the category assigned from the patch's effect. The disagreements follow a pattern: the recycle emoji is used for bug fixes and behaviour changes, the sparkle for bug fixes ("Add support for wrapped functions" fixes a `NameError`), the bug emoji for deliberate contract changes. The prefix signals the author's framing, not the nature of the change.

### 3.6 Sub-category by category

| Sub-category | C1 | C2 | C3 | C4 | C5 | C6 | Total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| VAL | 8 | 0 | 0 | 2 | 0 | 0 | 10 |
| TYP | 9 | 1 | 0 | 0 | 0 | 0 | 10 |
| OAS | 8 | 1 | 0 | 1 | 0 | 0 | 10 |
| DI | 7 | 2 | 0 | 0 | 0 | 0 | 9 |
| RTG | 3 | 3 | 2 | 1 | 0 | 0 | 9 |
| SER | 0 | 1 | 1 | 2 | 0 | 0 | 4 |
| SEC | 3 | 0 | 0 | 2 | 0 | 0 | 5 |
| CMP | 2 | 1 | 0 | 2 | 0 | 1 | 6 |
| WID | 8 | 2 | 0 | 0 | 0 | 0 | 10 |
| PAR | 9 | 0 | 0 | 0 | 0 | 0 | 9 |
| REN | 10 | 0 | 0 | 1 | 0 | 0 | 11 |
| CON | 7 | 3 | 1 | 0 | 0 | 0 | 11 |
| DBG | 4 | 3 | 0 | 0 | 0 | 0 | 7 |
| NET | 8 | 0 | 0 | 0 | 0 | 0 | 8 |
| OBJ | 4 | 1 | 1 | 0 | 0 | 0 | 6 |
| EXM | 0 | 0 | 0 | 0 | 3 | 0 | 3 |
| BLD | 0 | 0 | 0 | 0 | 0 | 1 | 1 |

---

## 4. Root-cause findings by category

### 4.1 Bug fixes (C1, 90 tasks)

Bug fixes split into four families.

| Family | Mechanisms | Bug fixes | Share of bug fixes | Typical shape |
| --- | --- | ---: | ---: | --- |
| Unhandled input class | R01, R02, R06 | 43 | 47.8% | A parameter combination, a container type or an empty value that the code path never considered |
| Coordination failure | R03, R04 | 22 | 24.4% | The same rule implemented in several places and changed in some, or an earlier change that broke a sibling path |
| Wrong logic | R07, R09, R10 | 16 | 17.8% | Loops that do not terminate, caches keyed on the wrong thing, shared state mutated per request |
| Contract drift | R05, R08, R11, R12, R15 | 9 | 10.0% | A dependency or Python version changed semantics, or output drifted from its documented format |

**Unhandled input class (R01, 22 tasks; R02, 17 tasks).** The recurring mistake is treating a multi-valued or typed container as a plain mapping. In `fastapi_14303` the form parser iterated `received_body.items()`; `FormData.items()` yields only the last value of a repeated key, so an extra form parameter with several values kept only its last value (the fix iterates the keys and calls `getlist`). The same collapse in `fastapi_14356` affected query, header and cookie models. In requests, `super_len` measured a string body with `len()`, a character count, and sent a wrong `Content-Length` for multi-byte text (`requests_6589`). In the typing domain (TYP) the unhandled class is an annotation form: forward references on functions wrapped with `functools.wraps` (`fastapi_5077`), stringified annotations naming types imported under `if TYPE_CHECKING` (`fastapi_14485`), optional sequences combined with `None` through PEP 604 union syntax, whose origin is `types.UnionType` and not `typing.Union` (`fastapi_14430`), a discriminator merged twice inside `Annotated` (`fastapi_14512`). Each is legal Python that the introspection code did not resolve.

**Coordination failure (R03, 13 tasks; R04, 11 tasks).** The same rule lives in several places and is changed in only some of them. Alias lookups were implemented independently in value extraction, parameter conversion, error locations, OpenAPI parameter names and schema titles, each reading only `field_info.alias`, so `validation_alias` and `serialization_alias` were ignored everywhere (`fastapi_14371`, four files). Security scopes were tracked in a separate list that was not maintained the same way as the dependency tree, so scopes of parent and sub-dependencies were lost in the OpenAPI output (`fastapi_14459`). Table padding was computed by one formula for measuring and another for rendering (`rich_3935`). Regressions followed internal rewrites: after the routing refactor, an empty path in a router without a prefix was rejected (`fastapi_15763`, introduced by `fastapi_15745`). A fix can also become the next bug: `requests_6644` trimmed leading slashes from the request path so that urllib3 would not read it as an absolute URI; that broke S3 presigned URLs whose keys start with a slash, and `requests_7315` removed the trimming again. The most severe example is the request exit stack, which closed as soon as the response object was returned rather than after the body was streamed, tearing down `yield` dependencies and upload files too early (`fastapi_14099`, five files, difficulty 5).

**Wrong logic.** A generator that iterated the very list it was appending to never terminated (`rich_3480`); the grapheme splitter did not advance its index for input that starts with an escape or a variation selector (`rich_4006`); the traceback extractor followed `__cause__` and `__context__` without a visited set and looped forever on `raise e from e` (`rich_3772`). A dependency cache key always included inherited security scopes, so one dependency reached through different parents was never reused (`fastapi_14419`). The OpenAPI handler inserted the request's root path into the application's shared `servers` list, so one request changed every later `openapi.json` (`fastapi_14986`).

**What this means.** Nearly half of the bug fixes are an edge case with a small fix (median gold patch +8/-2 lines). The agent does not need to understand the whole subsystem; it needs the one branch that handles the general case. Reproducing the failure from the statement is the shortest path, which is why 27 tasks route to "repro-driven" and 22 to "prescriptive".

### 4.2 New features (C2, 18 tasks)

Features have the highest mean difficulty of the frequent categories (3.72) because the hidden tests pin the public surface. 19 tasks carry the "incomplete feature" mechanism. Three shapes appear:

- **New option or parameter on an existing API** (`external_docs` on the application, PEP 695 `TypeAliasType`, a dedicated warning class): find the sibling option and copy its plumbing through validation, schema and documentation.
- **New module or capability** (server-sent events in `fastapi_15030` create `fastapi/sse.py`, nine files; `app.frontend()` and `router.frontend()` in `fastapi_15800`, eight files; `@app.vibe()` in `fastapi_15280`): the tests import a module path and call names that the statement - often a single line - does not give. 10 tasks require a new file and 10 of them are severe-gap tasks. The extreme case is `fastapi_15280`: the statement is "Add support for `@app.vibe()`", and the hidden tests require a decorator whose body raises `FastAPIError` with the message "Are you kidding me? Happy April Fool's" - an unguessable string.
- **Example applications** (`fastapi_13786`, `fastapi_14099`, `fastapi_14262`, `fastapi_15030`, `fastapi_15800`): the hidden tutorial tests import modules under `docs_src/` that the gold patch creates. 13 tasks have tutorial tests, and the harness prunes `docs_src` from the workspace tree it shows the agent.

### 4.3 Behaviour changes (C4, 11 tasks)

Deprecation warnings for `pydantic.v1` (`fastapi_14583`) and removal of that support (`fastapi_14609`, 20 files), deprecation of two response classes (`fastapi_14964`), a strict content-type check for JSON bodies (`fastapi_14978`), 401 instead of 403 for missing credentials (`fastapi_13786`), validation of server-sent-event fields (`fastapi_15588`), rejection of underscore headers (`fastapi_15589`), a clear error when a router includes itself (`fastapi_14258`), and a Markdown restyle (`rich_3942`). The difficulty is in the expected values: the tests compare the new warning class name, the new status code, the `WWW-Authenticate` header, the exact OpenAPI structure or an ANSI snapshot. Mean difficulty 3.36.

### 4.4 Refactors (C3, 5 tasks), documentation (C5, 3 tasks) and build tooling (C6, 2 tasks)

Refactors preserve router and route instances instead of cloning them (`fastapi_15745`: four files, one of them `routing.py` with +885/-245 lines), re-implement `on_event` ahead of the next Starlette (`fastapi_14851`), defer imports to cut import time (`rich_4070`, nine files) and make the `Depends` and `Security` results hashable (`fastapi_14372`). They are large and mechanical: one file per edit, compile after each. The three documentation tasks edit FastAPI example applications that tutorial tests import (`fastapi_14487`, `fastapi_14492`, `fastapi_15023`), so they are code changes in disguise. The two build tasks are a release script (`fastapi_15661`) and a Starlette version range (`fastapi_14077`).

## 5. Sub-category deep dives

The table below summarises every domain: how many tasks, which mechanisms dominate, how hard, and how often the statement is too terse. The representative-task table that follows lists, per domain, the better-specified and easier tasks first.

| Code | Sub-category | Tasks | Most frequent mechanisms (count) | Mean difficulty | Severe gap | Terse statement |
| --- | --- | ---: | --- | ---: | ---: | ---: |
| VAL | Request / validation parameter handling | 10 | R02 wrong assumption about data shape or type (6), R03 duplicated or parallel logic out of sync (2), R04 regression from an earlier change (1) | 2.1 | 0 | 0 |
| TYP | Type-annotation and model introspection | 10 | R01 missing branch (4), R02 wrong assumption about data shape or type (3), R13 incomplete feature (1) | 3 | 2 | 2 |
| OAS | Schema / contract generation | 10 | R01 missing branch (3), R02 wrong assumption about data shape or type (2), R13 incomplete feature (1) | 3.1 | 3 | 3 |
| DI | Dependency-injection machinery | 9 | R13 incomplete feature (2), R04 regression from an earlier change (2), R01 missing branch (2) | 3.22 | 2 | 0 |
| RTG | Routing and lifecycle | 9 | R13 incomplete feature (3), R04 regression from an earlier change (2), R10 error-handling gap (1) | 3.78 | 4 | 1 |
| SER | Serialisation and streaming | 4 | R14 design improvement (2), R13 incomplete feature (1), R10 error-handling gap (1) | 3.25 | 2 | 2 |
| SEC | Security and auth | 5 | R12 contract mismatch (1), R08 encoding (1), R01 missing branch (1) | 3 | 3 | 2 |
| CMP | Compatibility shims | 6 | R15 dependency (3), R13 incomplete feature (2), R05 upstream dependency change (1) | 3.83 | 4 | 3 |
| WID | Text measurement and segmentation | 10 | R07 algorithmic flaw (4), R13 incomplete feature (2), R06 boundary (2) | 3.4 | 8 | 7 |
| PAR | Markup / Markdown / syntax parsing | 9 | R01 missing branch (4), R06 boundary (2), R03 duplicated or parallel logic out of sync (2) | 2.67 | 5 | 5 |
| REN | Widget rendering and styling | 11 | R03 duplicated or parallel logic out of sync (5), R07 algorithmic flaw (1), R01 missing branch (1) | 2.91 | 6 | 6 |
| CON | Console / terminal I/O | 11 | R13 incomplete feature (3), R01 missing branch (3), R12 contract mismatch (1) | 2.64 | 5 | 5 |
| DBG | Developer-facing introspection | 7 | R13 incomplete feature (3), R02 wrong assumption about data shape or type (3), R07 algorithmic flaw (1) | 3 | 4 | 4 |
| NET | Network / HTTP protocol behaviour | 8 | R01 missing branch (3), R02 wrong assumption about data shape or type (2), R10 error-handling gap (1) | 1.88 | 1 | 3 |
| OBJ | Object protocol and duck typing | 6 | R04 regression from an earlier change (2), R13 incomplete feature (1), R09 state, identity, caching or hashing error (1) | 2.17 | 0 | 1 |
| EXM | Documentation examples | 3 | R16 documentation error (3) | 2.67 | 2 | 3 |
| BLD | Build, release and tooling | 1 | R15 dependency (1) | 5 | 1 | 0 |

| Code | Representative tasks (easier and better specified first) |
| --- | --- |
| VAL | `fastapi_14297` Unwrap Optional unions in serialize_sequence_value so optional file lists work (R02, diff 1)<br>`fastapi_14303` Keep all repeated values for extra Form fields in model parsing (R02, diff 1)<br>`fastapi_11194` Use each field's own File info when extracting multipart bodies (R02, diff 2)<br>`fastapi_13537` Track visited form fields so empty strings fall back to None defaults (R04, diff 2) |
| TYP | `fastapi_5077` Resolve forward references of functools.wraps-wrapped functions using original globals (R01, diff 2)<br>`fastapi_9425` Treat stringified 'None' return annotation as None so 204 works (R03, diff 2)<br>`fastapi_11355` Evaluate stringified annotations with inspect.signature eval_str on Python 3.10+ (R02, diff 3)<br>`fastapi_12942` Recognize nested-Annotated discriminated unions as complex body fields (R01, diff 3) |
| OAS | `fastapi_14463` Stop duplicate anyOf refs when app-level Union responses also declare content examples (R09, diff 2)<br>`fastapi_14791` Add input and ctx fields to OpenAPI ValidationError schema (R03, diff 2)<br>`fastapi_14246` Fix nested-model schema separation between validation and serialization modes (R04, diff 3)<br>`fastapi_14266` Register security schemes used as top-level app dependencies in OpenAPI (R01, diff 3) |
| DI | `fastapi_14301` Forward Depends scope to get_dependant for parameterless route dependencies (R04, diff 2)<br>`fastapi_14458` Class dependencies with coroutine __call__ wrongly awaited as coroutines (R04, diff 2)<br>`fastapi_14794` Allow Response-typed parameters to use an explicit Depends (R01, diff 2)<br>`fastapi_9555` Detect dependency coroutine/generator kinds from the unwrapped call (R01, diff 2) |
| RTG | `fastapi_14873` Fix on_startup handlers wiped by Starlette Router init order (R04, diff 2)<br>`fastapi_14986` Make root_path servers request-scoped and escape Swagger UI JSON (R09, diff 3)<br>`fastapi_15763` Empty leaf path with nested prefix must not raise (R04, diff 3)<br>`fastapi_15785` Add public iter_route_contexts for code that walked router.routes (R13, diff 3) |
| SER | `fastapi_14964` Deprecate ORJSONResponse and UJSONResponse with FastAPIDeprecationWarning (R14, diff 2)<br>`fastapi_15588` Reject multi-line SSE event and id fields (R10, diff 2)<br>`fastapi_14962` Serialize JSON responses directly with Pydantic's Rust dump_json fast path (R14, diff 4)<br>`fastapi_15030` Add Server-Sent Events support: EventSourceResponse, ServerSentEvent, tutorials (R13, diff 5) |
| SEC | `fastapi_14786` Strip surrounding whitespace from Authorization header credentials (R08, diff 1)<br>`requests_7205` Ignore netrc entries whose authenticators are all empty strings (R05, diff 2)<br>`fastapi_13786` Return 401 with WWW-Authenticate when credentials missing; add not_authenticated_status_code escape hatch (R12, diff 4)<br>`fastapi_14978` Reject JSON bodies sent without Content-Type unless strict_content_type=False (R01, diff 4) |
| CMP | `fastapi_14077` Use literal 422 instead of deprecated Starlette status constant (R15, diff 2)<br>`fastapi_14605` Add a FastAPIDeprecationWarning class and switch deprecated warnings to it (R13, diff 3)<br>`fastapi_14583` Emit deprecation warnings when pydantic.v1 models or response models are used (R13, diff 4)<br>`requests_6757` Gate super_len string encoding on urllib3 major version; add is_urllib3_1 compat flag (R15, diff 4) |
| WID | `rich_3506` fix Segment._split_cells cutting at wrong cell positions (R02, diff 2)<br>`rich_3521` rewrite Segment.split_cells to split exactly on cell boundaries (R07, diff 3)<br>`rich_3480` fix infinite loop when a Text appends itself (R07, diff 3)<br>`rich_3535` correct the single-cell-width fast-path character regex (R06, diff 3) |
| PAR | `rich_3454` Add @ to url highlighter pattern so @-URLs highlight fully (R01, diff 1)<br>`rich_3067` URL highlighting stops at tilde; add ~ to the url pattern (R01, diff 2)<br>`rich_3278` Strip private-use ANSI escape sequences (ESC 0-?) from decoded text (R01, diff 2)<br>`rich_3130` Markdown table cells lose earlier inline-styled fragments; append content like TextElement (R03, diff 3) |
| REN | `rich_3905` Disabled Progress should not print a blank line on non-interactive consoles (R03, diff 1)<br>`rich_2725` Render mid box glyphs mid-table and footer glyphs in the footer (R07, diff 2)<br>`rich_3518` apply Table.highlight to columns auto-created by add_row (R01, diff 2)<br>`rich_3296` Syntax padding not painted with overridden background color; use base style (R03, diff 3) |
| CON | `rich_3882` Prompt validation errors print raw markup when console markup is disabled (R08, diff 1)<br>`rich_3043` Move misplaced html tag so exported HTML document structure is valid (R12, diff 2)<br>`rich_3777` Add TTY_INTERACTIVE environment variable to disable interactive animations in CI (R13, diff 2)<br>`rich_3052` Add case_sensitive option to Prompt.ask for case-insensitive choice matching (R13, diff 3) |
| DBG | `rich_3006` Custom __eq__ default equal to Parameter.empty breaks auto rich repr (R02, diff 2)<br>`rich_3894` Inspect must not crash on objects whose __qualname__ is not a string (R02, diff 2)<br>`fastapi_14306` Append endpoint file, line, function and route to validation error messages (R13, diff 4)<br>`rich_3472` skip dataclass fields missing on the instance when pretty printing (R02, diff 3) |
| NET | `requests_6589` Count UTF-8 encoded bytes, not characters, when computing length of string data (R02, diff 1)<br>`requests_6592` Add TOO_EARLY alias for status code 425 in requests.codes lookup (R01, diff 1)<br>`requests_7309` Skip Content-Type parameters lacking equals instead of emitting True sentinel values (R10, diff 1)<br>`requests_7315` Stop collapsing leading slashes in request_url so S3 presigned URLs stay valid (R04, diff 1) |
| OBJ | `fastapi_14372` Make Depends() and Security() results hashable for external tools (R13, diff 2)<br>`requests_6629` Make JSONDecodeError picklable by delegating __reduce__ to the JSON parent (R01, diff 2)<br>`requests_7433` Detect stream bodies through __getattr__ proxies in prepare_body again (R04, diff 2)<br>`requests_7505` Consolidate read detection into has_read helper for remaining isinstance sites (R03, diff 2) |
| EXM | `fastapi_14492` Correct docs metadata example license identifier to Apache-2.0 (R16, diff 1)<br>`fastapi_14487` Rework docs error-handling example to re-raise validation errors without leaking raw strings (R16, diff 3)<br>`fastapi_15023` Docs example: close image file in streams, add yield-from variant (R16, diff 4) |
| BLD | `fastapi_15661` Add a script automating release version bump and notes (R15, diff 5) |

### 5.1 FastAPI domains

**VAL - request and validation parameter handling.** The defects sit in three functions that turn raw request data into model fields (`request_body_to_args`, `request_params_to_args`, `serialize_sequence_value`) and in the parameter models. Multi-value containers collapse to one value when iterated as a mapping (`fastapi_14303`, `fastapi_14356`); aliases are read from one property in five separate places (`fastapi_14371`); the underscore spelling of a converted header leaks into the extras of a header model (`fastapi_15589`); optional lists written as `Json[list[str]]` fail to serialise (`fastapi_14616`); extra `Form` and non-body parameter lists are parsed wrongly (`fastapi_14303`, `fastapi_14356`). Brain rule: trace one value from the raw multidict to the model; when the statement says "list", "multiple values" or "extra", inspect every `.items()` call first.

**TYP - type-annotation and model introspection.** FastAPI resolves annotations by hand, so every typing construct is a candidate for a missed branch: wrapped functions (`fastapi_5077`, `fastapi_14448`), stringified annotations under `if TYPE_CHECKING` (`fastapi_14485`, `fastapi_11355`), PEP 604 unions (`fastapi_14430`), tagged unions in `Annotated` (`fastapi_12942`, `fastapi_14512`), arbitrary types (`fastapi_14482`), PEP 695 aliases (`fastapi_13920`). Brain rule: compare the project's resolution with what `typing.get_type_hints` does for the failing annotation; the accepted fix is typically one more origin or unwrap check in a single function.

**OAS - schema generation.** `_compat/v2.py` and `openapi/utils.py` build JSON Schema by walking model fields. Attributes named `$ref` were assumed to be strings (`fastapi_14349`, `fastapi_14361`); nested models shared a schema (`fastapi_14246`); computed fields broke with separate input and output schemas (`fastapi_13207`); bytes used a legacy schema (`fastapi_14953`); the validation-error schema lacked two fields (`fastapi_14791`); security schemes were duplicated or misplaced (`fastapi_14266`, `fastapi_14455`, `fastapi_14463`). Brain rule: print the generated schema for a minimal application before and after the change and compare keys exactly - 15 tasks carry the schema-snapshot driver.

**DI - dependency-injection machinery.** `get_dependant` builds a tree and `solve_dependencies` runs it with caching. Cache keys included inherited scopes that did not affect the dependency (`fastapi_14419`); scopes were lost between parents, siblings and sub-dependencies (`fastapi_5624`, `fastapi_14459`); class dependencies with `__call__` (`fastapi_14458`), wrapped and partial dependables (`fastapi_9555`, `fastapi_9753`) and function-scoped parameterless dependencies (`fastapi_14301`) were not recognised; the exit stack closed before a streaming response finished (`fastapi_14099`). Brain rule: write down what each node stores (cache key, scopes) and check that every consumer derives it the same way.

**RTG - routing and lifecycle.** `routing.py` is the largest module in the dataset (several thousand lines). A router could include itself (`fastapi_14258`); `on_startup` and `on_shutdown` parameters of a router were ignored (`fastapi_14873`); an empty path in a router without a prefix was rejected after a refactor (`fastapi_15763`); tracebacks lacked endpoint metadata (`fastapi_14306`); the root path leaked into shared application state (`fastapi_14986`); `on_event` depended on Starlette internals about to change (`fastapi_14851`). Brain rule: navigate by outline and read line ranges; whole-file reads are impossible here (the harness caps a read at 150 lines).

**SER - serialisation and streaming.** Sequence values with Pydantic v2 (`fastapi_14297`, `fastapi_14430`), JSON responses serialised by Pydantic (`fastapi_14962`), server-sent events added (`fastapi_15030`) and validated (`fastapi_15588`).

**SEC - security and auth.** Missing credentials produced 403 without a `WWW-Authenticate` header (`fastapi_13786`: the statement's own description of the header value is outdated and contradicts the tests); credentials were not stripped of whitespace (`fastapi_14786`); JSON bodies without a content type were parsed anyway (`fastapi_14978`); security schemes declared on the application were missing from OpenAPI (`fastapi_14266`, `fastapi_14455`). Brain rule: statuses, header names and header values are compared literally.

**CMP - compatibility shims.** A parallel Pydantic v1 stack caused warnings on new Python versions (`fastapi_14186`), was deprecated (`fastapi_14583`) and removed (`fastapi_14609`, 20 files); a supported-version range was widened (`fastapi_14077`); urllib3 1.26 support needed a flag (`requests_6757`). Brain rule: put the version branch in one place and keep both paths importable; for removals, expect a new exception class the statement does not name.

### 5.2 rich domains

**WID - text measurement and segmentation.** All defects are arithmetic on mixed-width text. The character index was estimated from a cell position as if every character were one cell wide (`rich_3506`, `rich_3521`); a reverse scan dropped a double-width character that straddled the wrap boundary (`rich_3180`); the grapheme splitter did not advance for input starting with an escape or variation selector (`rich_4006`) and mishandled zero-width joiners (`rich_3953`); grapheme support itself arrived with generated Unicode tables (`rich_3930`). Brain rule: run a one-line script that prints widths and segments for the failing input before editing; the hidden tests compare exact segment strings.

**PAR - markup, Markdown and syntax parsing.** Escaping of a trailing backslash (`rich_3063`), `@` inside hyperlink text (`rich_3454`), tildes in URLs (`rich_3067`), private escape sequences (`rich_3278`), Markdown tables (`rich_3064`, `rich_3130`, `rich_3469`, `rich_4079`), newline handling in ANSI decoding (`rich_4076`), raw markup printed on prompt errors (`rich_3882`), syntax padding (`rich_3296`, `rich_3782`). Brain rule: build the smallest input string that shows the defect and print the parsed tokens.

**REN - widget rendering and styling.** Box element order (`rich_2725`), highlighting of columns added by `add_row` (`rich_3518`), padding width computed differently for measuring and drawing (`rich_3935`), background style with soft wrap (`rich_3938`), panel title background (`rich_3718`), an empty `Live` view (`rich_3934`), export fonts (`rich_3944`), Markdown styles (`rich_3942`). Brain rule: render to text with recording enabled and compare style and segment strings.

**CON - console and terminal I/O.** A broken pipe raised a traceback instead of exiting (`rich_3468`); recording continued while a capture was active (`rich_3470`); tty detection ignored the proxied file (`rich_3675`, `rich_3777`, `rich_4077`); `print` with `end=""` (`rich_4075`); import time (`rich_4070`); style cache invalidation (`rich_2943`). Brain rule: check the detection predicate (`isatty`, an environment variable) and its default on each path. `rich_4077` is the clearest terse-title case: the title is "proxy isatty", the fix adds a two-line method that delegates `isatty` to the wrapped file.

**DBG - developer-facing introspection.** Fine-grained error locations (`rich_3486`), traceback recursion (`rich_3772`), a missing dataclass field in pretty printing (`rich_3472`), unusual `__qualname__` values (`rich_3894`), notes in tracebacks (`rich_3676`).

### 5.3 requests and httpx domains

**NET - HTTP protocol behaviour.** `super_len` counted characters instead of bytes (`requests_6589`); malformed content-type parameters were stored as `True` (`requests_7309`); each redirect response contained itself in its own history (`requests_7328`); path slashes (`requests_6644`, reversed by `requests_7315`); an empty netrc entry produced an empty `Authorization` header (`requests_7205`); a surrogate-escape fix was ported (`requests_7427`); httpx never completed its keep-alive cycle (`httpx_3672`, seven files, the only task with mean difficulty 4 in its repository).

**OBJ - object protocol and duck typing.** Runtime-checkable protocols use `inspect.getattr_static`, so file wrappers that expose `read` through `__getattr__` failed the `isinstance` check (`requests_7433`, `requests_7502`, `requests_7505`); a JSON decode error could not be pickled (`requests_6629`). Brain rule: when the statement mentions a wrapper, proxy or temporary file, replace the type check with a capability check.

**EXM - documentation examples (3) and BLD - build tooling (1).** Covered in Section 4.4.

---

## 6. Cross-cutting insights

### 6.1 The specification gap is the dominant variable

| Spec gap | Meaning | Tasks | Share | FastAPI | rich | requests | httpx | Mean difficulty | Difficulty 4-5 |
| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| none | the statement alone fixes the behaviour and the names | 27 | 20.9% | 16 | 5 | 6 | 0 | 1.7 | 0 |
| minor | behaviour described; exact names or format inferred from conventions | 50 | 38.8% | 29 | 15 | 6 | 0 | 2.72 | 8 |
| severe | title-only issue, or tests need names/format the statement never gives | 52 | 40.3% | 22 | 28 | 1 | 1 | 3.75 | 31 |

| Statement level | none | minor | severe | Total |
| --- | ---: | ---: | ---: | ---: |
| L1 | 8 | 4 | 0 | 12 |
| L2 | 15 | 38 | 17 | 70 |
| L3 | 0 | 6 | 21 | 27 |
| L4 | 4 | 2 | 14 | 20 |

Difficulty almost doubles between "no gap" (1.7) and "severe gap" (3.75). The two judgements agree with the deterministic statement level: of 27 title-plus-link tasks, 21 are severe; of 20 title-only tasks, 14. No prescriptive statement (L1) is severe.

Two different mechanisms produce a severe gap:

- **Too little text.** 28 of the 52 severe tasks are rich tasks whose statement is a few words. Nothing in "empty live" says what the hidden test checks.
- **Text that does not list what the tests need.** 17 severe tasks have a full description. Their tests import a new module (`fastapi_15030`), demand a new exception class (`fastapi_14609`), compare an ANSI snapshot (`rich_3942`) or need example files (`fastapi_15800`).

### 6.2 The hidden tests encode more than the statement

| Difficulty driver | Meaning | Tasks | Of these severe gap | Mean difficulty |
| --- | --- | ---: | ---: | ---: |
| tests compare exact strings | hidden tests assert literal strings, messages or structures | 60 | 34 | 3.2 |
| terse statement | statement under 250 characters | 52 | 41 | 3.38 |
| several files | gold change spans 2+ files | 26 | 17 | 4.19 |
| new public name to guess | tests call a name the statement does not give | 19 | 18 | 4.32 |
| schema compared exactly | OpenAPI / JSON-Schema equality | 15 | 6 | 3.33 |
| algorithmic | measurement or loop logic | 15 | 11 | 3.93 |
| Pydantic v1/v2 | both Pydantic lines involved | 14 | 5 | 3.14 |
| large patch | 40+ changed lines | 13 | 9 | 4.69 |
| new file required | tests import a file that must be created | 10 | 10 | 4.8 |
| example files imported by tests | tutorial tests import example applications | 9 | 8 | 3.89 |
| Unicode widths | wide / zero-width characters | 9 | 7 | 3.33 |
| Python version | version-specific typing behaviour | 8 | 3 | 3.38 |
| network fixture | needs an httpbin-style fixture | 6 | 1 | 2.33 |
| Starlette coupling | Starlette internals involved | 3 | 0 | 2.67 |
| terminal / environment | tty, pipe or env detection | 3 | 1 | 3 |
| removal | code is removed | 2 | 2 | 5 |
| generated data tables | generated Unicode data | 1 | 1 | 5 |

60 tasks carry the exact-string driver: the tests compare literal messages, structures or output. The single most expensive driver is a new public name the tests must call: 19 tasks, 18 of them severe, mean difficulty 4.32. A new file has the same effect (10 tasks, all 10 severe, mean difficulty 4.80). An agent cannot invent these names; it can only follow the repository's naming conventions and the statement's wording literally.

### 6.3 Fixes are tiny, so time goes into locating and deciding

41 accepted patches change four lines or fewer and 22 change at most two. Difficulty comes from breadth: 91 tasks touch one file (mean 2.53), 38 touch several (mean 3.87). An agent that reaches its first edit quickly wins more than one that reasons longer - the same pattern competitors measured on the leaderboard (first edit after 106 seconds in solved runs versus 183 seconds in failed runs, discussion 752848).

### 6.4 The dominant bug families need different oracles

For the unhandled-input family (43 of 90 bug fixes) the statement usually shows the failing input, and a script that fails before the fix and passes after it is a reliable oracle. For the coordination family (22 bug fixes) one repro proves one site only: the same flawed pattern exists in sibling code, so the agent must search for the duplicated pattern and fix every copy. For refactors and removals the oracle is weak; the best available check is that the package imports and sibling tests still pass.

### 6.5 A passing test proves less than it seems

29 tasks (22.5%) cannot be verified in the public sandbox at all. On the others, the repository's existing tests often pass before any change: a team that audited 114 internal tasks reported that tests passed before the patch on 65.7% of them (discussion 760014). An agent that runs a test, sees green and submits has verified nothing. The rule that follows is mechanical: require a reproduction to fail first, or name the specific test that the change is supposed to flip.

### 6.6 Fix and regression come in pairs

`requests_6644` introduced the path trimming that `requests_7315` removed; the routing rewrite of `fastapi_15745` caused `fastapi_15763`; the serialisation fast path of `fastapi_14962` made two response classes obsolete (`fastapi_14964`). 11 bug fixes are regressions. The practical lesson for an agent is to fix the cause at the place where the value is produced and to resist special-casing the example from the statement, because a special case is how the next regression is born.

### 6.7 Titles and emoji are weak classifiers; the statement level is a strong one

Emoji prefixes agree with the effect-based category in 50 of 67 cases (Section 3.5). The deterministic statement level, by contrast, predicts the spec gap and the route almost by itself (table below). A classifier should therefore read the statement's length and structure first and its keywords second.

| Route | L1 | L2 | L3 | L4 | Total |
| --- | ---: | ---: | ---: | ---: | ---: |
| P1 | 3 | 17 | 0 | 2 | 22 |
| P2 | 8 | 18 | 0 | 1 | 27 |
| P3 | 0 | 13 | 25 | 6 | 44 |
| P4 | 1 | 8 | 1 | 5 | 15 |
| P5 | 0 | 4 | 0 | 0 | 4 |
| P6 | 0 | 3 | 0 | 0 | 3 |
| P7 | 0 | 3 | 1 | 0 | 4 |
| P8 | 0 | 0 | 0 | 3 | 3 |
| P9 | 0 | 1 | 0 | 0 | 1 |
| P10 | 0 | 3 | 0 | 3 | 6 |

### 6.8 A deterministic localizer is good when the statement says something

Measured on the 129 real snapshots with only mechanical terms from each statement (identifiers, paths, title words): the gold-touched file appears in the top 5 files for 56 of 129 tasks and among the top 9 ranked symbols' files for 96. The hit rate is 96 overall but about 60% for title-only statements, where there are few terms to search for. Localisation is therefore not the bottleneck on descriptive tasks; writing the right fix is. On terse tasks both are hard.

---

## 7. What this means for an agent brain

### 7.1 Route by statement level first, by domain second

| Statement level | Tasks | Predominant route | What the brain should do |
|---|---|---|---|
| L1 prescriptive | 12 | P2 repro-driven (8), P1 prescribe (3) | Apply the fix the statement gives, after confirming that its example fails |
| L2 descriptive | 70 | P2 (18), P1 (17), P3 title-hunt (13), P4 feature-synthesis (8) | Reproduce, locate with the statement's identifiers, fix the cause |
| L3 title + link | 27 | P3 title-hunt (25) | The link is unreachable: treat as a title, locate by keywords, make a best-guess edit early |
| L4 title only | 20 | P3 (6), P4 (5), P8 docs-example (3), P10 timeboxed (3) | Lowest yield: smallest plausible change, submit early |

### 7.2 Spend effort where it pays

| Task group | Rule | Tasks | Share | What an agent can expect |
|---|---|---|---|---|
| Addressable core | spec gap none or minor, difficulty 1-3 | 69 | 53.5% | Realistic targets for a well-run agent; every avoided wasted minute here is a gained task |
| Severe and hard | spec gap severe, difficulty 4-5 | 31 | 24.0% | Low yield for any single-shot agent; cap the effort, keep the tree compiling, submit something |
| The rest | all other tasks | 29 | 22.5% | Mixed; effort should follow whether a reproduction exists |

The same split should drive local evaluation: a 30-task development panel drawn from the addressable core measures the agent; adding severe-and-hard tasks adds noise.

### 7.3 Playbook per route

| Route | First action | Oracle | Stop rule |
|---|---|---|---|
| P1 prescribe | Run the statement's example; it must fail | The same example passes | One verification |
| P2 repro-driven | Turn the statement's example into a script outside the repository | Script fails before, passes after; one related test file | One fix attempt, one correction |
| P3 title-hunt | Rank symbols by the title's words and identifiers; read the top symbol | One related test file, or an inline assertion | First edit early; no new exploration after two thirds of the budget |
| P4 feature-synthesis | Find the closest sibling implementation and its registration points | The sibling's tests, run for the new name | Stop when every visible requirement is wired |
| P5 schema-contract | Print the generated schema for a minimal application | Exact structure comparison | One regeneration |
| P6 compat-shim | Find where the version is detected | Both code paths import | One branch |
| P7 mechanical-sweep | List every call site | Compile after each file; sibling tests | All sites changed |
| P8 docs-example | Find the example module the tutorial tests import | The tutorial test file | Example matches the statement |
| P9 build-tooling | Read the neighbouring script | Run the script on a dry input | Script runs |
| P10 timeboxed-slice | Smallest change that satisfies the visible part | Package imports | Submit before the freeze |

### 7.4 Requirements that follow for the brain

1. **Read the statement's shape before its content.** Length and the presence of code decide how much exploration is justified.
2. **Enforce the edit discipline in code, not in prose.** 47.8% of bug fixes need a one-branch change, and the hardest part is not writing it; a gated editor that refuses ambiguous or non-compiling edits removes a whole failure class. Competitor traces on this harness show that a prompt instruction to compile after each edit is followed on about 24% of edits by the small model (discussion 760595, comment by Adam Johnson).
3. **Keep an independent clock.** The budget is consumed by planning, searching and verifying together; the brain needs to know the elapsed time without relying on the model.
4. **Verify against something that can fail.** A repro that must fail first, or a named test.
5. **Be repository-agnostic.** The scored tasks come from private repositories; the 17-domain table is a routing aid, not a memorisation target.

The companion document `02_BCF_Brain_Design_and_Justification.md` turns these five requirements into the BCF brain.

## 8. Complete classification of all 129 tasks

Sorted by repository and task id. Columns: category (C), sub-category (primary domain), root-cause mechanism (R), brain route (P), statement level (L), spec gap, difficulty (1-5), difficulty drivers.

| # | Task | Repo | Cat | Sub-category | Mechanism | Route | Level | Spec gap | Diff | Drivers |
| ---: | --- | --- | --- | --- | --- | --- | --- | --- | ---: | --- |
| 1 | `fastapi_11194` | fastapi | C1 | VAL | R02 | P2 | L2 | none | 2 |  |
| 2 | `fastapi_11355` | fastapi | C1 | TYP | R02 | P3 | L2 | minor | 3 | Python version |
| 3 | `fastapi_12942` | fastapi | C1 | TYP | R01 | P2 | L1 | minor | 3 | Pydantic v1/v2, schema compared exactly |
| 4 | `fastapi_13207` | fastapi | C1 | OAS | R02 | P5 | L2 | minor | 4 | Pydantic v1/v2, schema compared exactly |
| 5 | `fastapi_13537` | fastapi | C1 | VAL | R04 | P1 | L2 | none | 2 |  |
| 6 | `fastapi_13713` | fastapi | C2 | OAS | R13 | P4 | L2 | severe | 4 | new public name to guess, tests compare exact strings |
| 7 | `fastapi_13786` | fastapi | C4 | SEC | R12 | P1 | L2 | severe | 4 | several files, tests compare exact strings |
| 8 | `fastapi_13920` | fastapi | C2 | TYP | R13 | P3 | L3 | minor | 3 | terse statement, Python version |
| 9 | `fastapi_14077` | fastapi | C6 | CMP | R15 | P1 | L2 | none | 2 | several files, Starlette coupling |
| 10 | `fastapi_14099` | fastapi | C1 | DI | R07 | P10 | L2 | severe | 5 | several files, new file required, large patch, terse statement ... |
| 11 | `fastapi_14186` | fastapi | C1 | CMP | R05 | P6 | L2 | severe | 5 | several files, new file required, large patch, Pydantic v1/v2 ... |
| 12 | `fastapi_14246` | fastapi | C1 | OAS | R04 | P5 | L2 | minor | 3 | schema compared exactly, tests compare exact strings |
| 13 | `fastapi_14258` | fastapi | C4 | RTG | R10 | P3 | L2 | severe | 4 | tests compare exact strings, terse statement |
| 14 | `fastapi_14262` | fastapi | C2 | DI | R13 | P4 | L2 | severe | 5 | several files, new file required, example files imported by tests, large patch ... |
| 15 | `fastapi_14266` | fastapi | C1 | OAS | R01 | P3 | L3 | minor | 3 | schema compared exactly, tests compare exact strings |
| 16 | `fastapi_14297` | fastapi | C1 | VAL | R02 | P1 | L1 | none | 1 | Pydantic v1/v2 |
| 17 | `fastapi_14301` | fastapi | C1 | DI | R04 | P2 | L2 | none | 2 |  |
| 18 | `fastapi_14303` | fastapi | C1 | VAL | R02 | P1 | L1 | none | 1 | Pydantic v1/v2 |
| 19 | `fastapi_14306` | fastapi | C2 | DBG | R13 | P4 | L1 | minor | 4 | several files, tests compare exact strings |
| 20 | `fastapi_14349` | fastapi | C1 | OAS | R02 | P3 | L3 | severe | 3 | terse statement, schema compared exactly, tests compare exact strings, Pydantic v1/v2 |
| 21 | `fastapi_14356` | fastapi | C1 | VAL | R03 | P2 | L1 | minor | 2 | tests compare exact strings, Pydantic v1/v2 |
| 22 | `fastapi_14360` | fastapi | C1 | VAL | R02 | P2 | L2 | none | 2 | tests compare exact strings, Pydantic v1/v2 |
| 23 | `fastapi_14361` | fastapi | C1 | OAS | R01 | P3 | L4 | minor | 3 | terse statement, schema compared exactly, Pydantic v1/v2, Python version |
| 24 | `fastapi_14371` | fastapi | C1 | VAL | R03 | P7 | L2 | minor | 4 | several files, large patch, Pydantic v1/v2 |
| 25 | `fastapi_14372` | fastapi | C2 | OBJ | R13 | P1 | L2 | minor | 2 |  |
| 26 | `fastapi_14419` | fastapi | C1 | DI | R09 | P2 | L2 | minor | 4 | several files, algorithmic |
| 27 | `fastapi_14430` | fastapi | C1 | TYP | R01 | P3 | L2 | minor | 3 | Python version |
| 28 | `fastapi_14448` | fastapi | C1 | TYP | R02 | P2 | L2 | minor | 4 | several files, large patch, algorithmic |
| 29 | `fastapi_14455` | fastapi | C1 | OAS | R01 | P2 | L2 | minor | 3 | schema compared exactly, tests compare exact strings |
| 30 | `fastapi_14458` | fastapi | C1 | DI | R04 | P1 | L2 | none | 2 |  |
| 31 | `fastapi_14459` | fastapi | C1 | DI | R03 | P2 | L2 | minor | 4 | several files, schema compared exactly, tests compare exact strings |
| 32 | `fastapi_14463` | fastapi | C1 | OAS | R09 | P2 | L1 | none | 2 | schema compared exactly |
| 33 | `fastapi_14479` | fastapi | C4 | VAL | R10 | P2 | L1 | minor | 2 | tests compare exact strings |
| 34 | `fastapi_14482` | fastapi | C1 | TYP | R01 | P3 | L2 | severe | 3 | terse statement, schema compared exactly |
| 35 | `fastapi_14485` | fastapi | C1 | TYP | R10 | P3 | L2 | minor | 3 | terse statement, Python version |
| 36 | `fastapi_14487` | fastapi | C5 | EXM | R16 | P8 | L4 | severe | 3 | example files imported by tests, tests compare exact strings, terse statement |
| 37 | `fastapi_14492` | fastapi | C5 | EXM | R16 | P8 | L4 | none | 1 | example files imported by tests, tests compare exact strings |
| 38 | `fastapi_14512` | fastapi | C1 | TYP | R02 | P3 | L2 | severe | 4 | terse statement, schema compared exactly, Pydantic v1/v2 |
| 39 | `fastapi_14583` | fastapi | C4 | CMP | R13 | P3 | L4 | severe | 4 | terse statement, tests compare exact strings, several files, Pydantic v1/v2 |
| 40 | `fastapi_14605` | fastapi | C2 | CMP | R13 | P7 | L3 | minor | 3 | several files, tests compare exact strings, Pydantic v1/v2 |
| 41 | `fastapi_14609` | fastapi | C4 | CMP | R15 | P10 | L4 | severe | 5 | removal, several files, large patch, Pydantic v1/v2 ... |
| 42 | `fastapi_14616` | fastapi | C1 | VAL | R02 | P2 | L1 | none | 2 |  |
| 43 | `fastapi_14786` | fastapi | C1 | SEC | R08 | P2 | L1 | none | 1 |  |
| 44 | `fastapi_14791` | fastapi | C4 | OAS | R03 | P5 | L2 | minor | 2 | schema compared exactly, tests compare exact strings |
| 45 | `fastapi_14794` | fastapi | C1 | DI | R01 | P2 | L2 | none | 2 |  |
| 46 | `fastapi_14851` | fastapi | C3 | RTG | R05 | P6 | L2 | minor | 4 | Starlette coupling, large patch |
| 47 | `fastapi_14873` | fastapi | C1 | RTG | R04 | P2 | L2 | minor | 2 | Starlette coupling |
| 48 | `fastapi_14953` | fastapi | C1 | OAS | R12 | P5 | L2 | severe | 4 | tests compare exact strings, schema compared exactly, example files imported by tests, new file required ... |
| 49 | `fastapi_14962` | fastapi | C3 | SER | R14 | P4 | L4 | severe | 4 | several files, example files imported by tests, tests compare exact strings |
| 50 | `fastapi_14964` | fastapi | C4 | SER | R14 | P1 | L2 | minor | 2 | tests compare exact strings, terse statement |
| 51 | `fastapi_14978` | fastapi | C4 | SEC | R01 | P4 | L4 | severe | 4 | several files, terse statement, new public name to guess, new file required ... |
| 52 | `fastapi_14986` | fastapi | C1 | RTG | R09 | P1 | L2 | minor | 3 | several files, tests compare exact strings |
| 53 | `fastapi_15023` | fastapi | C5 | EXM | R16 | P8 | L4 | severe | 4 | example files imported by tests, terse statement, schema compared exactly, tests compare exact strings |
| 54 | `fastapi_15030` | fastapi | C2 | SER | R13 | P10 | L4 | severe | 5 | several files, new file required, example files imported by tests, large patch ... |
| 55 | `fastapi_15280` | fastapi | C2 | RTG | R13 | P4 | L4 | severe | 5 | new public name to guess, tests compare exact strings, terse statement |
| 56 | `fastapi_15588` | fastapi | C4 | SER | R10 | P1 | L2 | minor | 2 | tests compare exact strings |
| 57 | `fastapi_15589` | fastapi | C4 | VAL | R02 | P3 | L2 | minor | 3 |  |
| 58 | `fastapi_15661` | fastapi | C6 | BLD | R15 | P9 | L2 | severe | 5 | new file required, terse statement, tests compare exact strings, new public name to guess |
| 59 | `fastapi_15745` | fastapi | C3 | RTG | R14 | P10 | L2 | severe | 5 | several files, new file required, large patch, algorithmic ... |
| 60 | `fastapi_15763` | fastapi | C1 | RTG | R04 | P3 | L2 | minor | 3 | terse statement |
| 61 | `fastapi_15785` | fastapi | C2 | RTG | R13 | P4 | L2 | minor | 3 | new public name to guess, terse statement |
| 62 | `fastapi_15800` | fastapi | C2 | RTG | R13 | P4 | L2 | severe | 5 | several files, new file required, example files imported by tests, large patch ... |
| 63 | `fastapi_5077` | fastapi | C1 | TYP | R01 | P2 | L1 | none | 2 |  |
| 64 | `fastapi_5624` | fastapi | C1 | SEC | R09 | P3 | L4 | severe | 4 | terse statement, tests compare exact strings |
| 65 | `fastapi_9425` | fastapi | C1 | TYP | R03 | P1 | L4 | none | 2 |  |
| 66 | `fastapi_9555` | fastapi | C1 | DI | R01 | P1 | L1 | none | 2 |  |
| 67 | `fastapi_9753` | fastapi | C2 | DI | R13 | P4 | L2 | minor | 3 |  |
| 68 | `rich_2725` | rich | C1 | REN | R07 | P2 | L2 | none | 2 | tests compare exact strings |
| 69 | `rich_2943` | rich | C1 | OBJ | R09 | P1 | L2 | minor | 2 |  |
| 70 | `rich_3006` | rich | C1 | DBG | R02 | P3 | L2 | minor | 2 |  |
| 71 | `rich_3043` | rich | C1 | CON | R12 | P3 | L2 | minor | 2 | terse statement, tests compare exact strings |
| 72 | `rich_3052` | rich | C2 | CON | R13 | P4 | L2 | minor | 3 | tests compare exact strings |
| 73 | `rich_3061` | rich | C2 | WID | R13 | P4 | L2 | severe | 4 | algorithmic, new public name to guess, tests compare exact strings |
| 74 | `rich_3063` | rich | C1 | PAR | R06 | P3 | L3 | severe | 3 | terse statement, tests compare exact strings |
| 75 | `rich_3064` | rich | C1 | PAR | R10 | P3 | L3 | severe | 3 | terse statement, tests compare exact strings |
| 76 | `rich_3067` | rich | C1 | PAR | R01 | P3 | L2 | minor | 2 | tests compare exact strings |
| 77 | `rich_3105` | rich | C1 | CON | R11 | P3 | L2 | severe | 4 | terse statement, tests compare exact strings |
| 78 | `rich_3130` | rich | C1 | PAR | R03 | P1 | L2 | minor | 3 | tests compare exact strings |
| 79 | `rich_3180` | rich | C1 | WID | R07 | P2 | L2 | severe | 4 | algorithmic, Unicode widths, tests compare exact strings |
| 80 | `rich_3278` | rich | C1 | PAR | R01 | P2 | L2 | minor | 2 | tests compare exact strings |
| 81 | `rich_3296` | rich | C1 | REN | R03 | P3 | L2 | minor | 3 | tests compare exact strings |
| 82 | `rich_3454` | rich | C1 | PAR | R01 | P1 | L2 | none | 1 | tests compare exact strings |
| 83 | `rich_3468` | rich | C1 | CON | R10 | P3 | L3 | minor | 3 | terminal / environment, terse statement |
| 84 | `rich_3469` | rich | C1 | PAR | R01 | P3 | L3 | severe | 4 | terse statement |
| 85 | `rich_3470` | rich | C1 | CON | R01 | P3 | L3 | severe | 3 | terse statement, tests compare exact strings |
| 86 | `rich_3471` | rich | C1 | PAR | R03 | P3 | L3 | severe | 3 | terse statement, tests compare exact strings, Unicode widths |
| 87 | `rich_3472` | rich | C1 | DBG | R02 | P3 | L3 | severe | 3 | terse statement, tests compare exact strings |
| 88 | `rich_3480` | rich | C1 | WID | R07 | P3 | L3 | severe | 3 | algorithmic, terse statement |
| 89 | `rich_3486` | rich | C2 | DBG | R13 | P4 | L4 | severe | 4 | several files, Python version, new public name to guess, terse statement |
| 90 | `rich_3506` | rich | C1 | WID | R02 | P3 | L3 | minor | 2 | terse statement, algorithmic, Unicode widths |
| 91 | `rich_3518` | rich | C1 | REN | R01 | P1 | L2 | none | 2 | tests compare exact strings |
| 92 | `rich_3521` | rich | C1 | WID | R07 | P3 | L3 | minor | 3 | algorithmic, Unicode widths, terse statement |
| 93 | `rich_3535` | rich | C1 | WID | R06 | P3 | L4 | severe | 3 | Unicode widths, terse statement |
| 94 | `rich_3675` | rich | C2 | CON | R13 | P4 | L3 | severe | 4 | terminal / environment, tests compare exact strings, terse statement |
| 95 | `rich_3676` | rich | C2 | DBG | R13 | P4 | L4 | severe | 3 | new public name to guess, Python version, terse statement |
| 96 | `rich_3718` | rich | C1 | REN | R04 | P2 | L2 | minor | 3 | tests compare exact strings |
| 97 | `rich_3772` | rich | C1 | DBG | R07 | P3 | L3 | severe | 3 | algorithmic, terse statement |
| 98 | `rich_3777` | rich | C2 | CON | R13 | P4 | L2 | minor | 2 | terminal / environment |
| 99 | `rich_3782` | rich | C1 | REN | R03 | P3 | L3 | severe | 4 | tests compare exact strings, terse statement |
| 100 | `rich_3882` | rich | C1 | CON | R08 | P1 | L2 | minor | 1 | tests compare exact strings |
| 101 | `rich_3894` | rich | C1 | DBG | R02 | P2 | L1 | none | 2 |  |
| 102 | `rich_3905` | rich | C1 | REN | R03 | P1 | L2 | none | 1 | tests compare exact strings |
| 103 | `rich_3930` | rich | C2 | WID | R13 | P10 | L2 | severe | 5 | several files, new file required, large patch, algorithmic ... |
| 104 | `rich_3934` | rich | C1 | REN | R06 | P3 | L3 | severe | 3 | tests compare exact strings, terse statement |
| 105 | `rich_3935` | rich | C1 | REN | R03 | P3 | L3 | severe | 3 | tests compare exact strings, terse statement |
| 106 | `rich_3938` | rich | C1 | REN | R08 | P3 | L3 | severe | 3 | tests compare exact strings, terse statement, new public name to guess |
| 107 | `rich_3942` | rich | C4 | REN | R14 | P10 | L4 | severe | 5 | tests compare exact strings, terse statement, several files, large patch ... |
| 108 | `rich_3944` | rich | C1 | WID | R04 | P3 | L3 | severe | 3 | terse statement, Unicode widths |
| 109 | `rich_3953` | rich | C1 | WID | R06 | P3 | L3 | severe | 3 | terse statement, Unicode widths, algorithmic |
| 110 | `rich_4006` | rich | C1 | WID | R07 | P3 | L3 | severe | 4 | terse statement, tests compare exact strings, algorithmic, Unicode widths |
| 111 | `rich_4070` | rich | C3 | CON | R14 | P7 | L2 | minor | 4 | several files, large patch |
| 112 | `rich_4075` | rich | C1 | CON | R01 | P3 | L3 | severe | 2 | terse statement |
| 113 | `rich_4076` | rich | C1 | PAR | R06 | P3 | L3 | severe | 3 | terse statement, tests compare exact strings |
| 114 | `rich_4077` | rich | C1 | CON | R01 | P3 | L3 | severe | 1 | terse statement |
| 115 | `rich_4079` | rich | C1 | REN | R03 | P3 | L3 | severe | 3 | terse statement, tests compare exact strings |
| 116 | `requests_6589` | requests | C1 | NET | R02 | P1 | L4 | none | 1 | network fixture |
| 117 | `requests_6592` | requests | C1 | NET | R01 | P2 | L4 | none | 1 |  |
| 118 | `requests_6629` | requests | C1 | OBJ | R01 | P1 | L2 | none | 2 |  |
| 119 | `requests_6644` | requests | C1 | NET | R01 | P2 | L2 | minor | 2 |  |
| 120 | `requests_6757` | requests | C1 | CMP | R15 | P6 | L2 | severe | 4 | terse statement, several files, new public name to guess, network fixture |
| 121 | `requests_7205` | requests | C1 | SEC | R05 | P2 | L2 | none | 2 |  |
| 122 | `requests_7309` | requests | C1 | NET | R10 | P1 | L2 | minor | 1 |  |
| 123 | `requests_7315` | requests | C1 | NET | R04 | P2 | L2 | minor | 1 |  |
| 124 | `requests_7328` | requests | C1 | NET | R06 | P2 | L2 | none | 2 | network fixture |
| 125 | `requests_7427` | requests | C1 | NET | R02 | P2 | L2 | minor | 3 |  |
| 126 | `requests_7433` | requests | C1 | OBJ | R04 | P1 | L2 | none | 2 | network fixture |
| 127 | `requests_7502` | requests | C1 | OBJ | R04 | P3 | L4 | minor | 3 | terse statement, network fixture |
| 128 | `requests_7505` | requests | C3 | OBJ | R03 | P7 | L2 | minor | 2 | network fixture |
| 129 | `httpx_3672` | httpx | C1 | NET | R01 | P3 | L4 | severe | 4 | several files, terse statement, new public name to guess, tests compare exact strings |

## 9. Root-cause analysis of every task

One card per task, grouped by repository and ordered by category. Every statement is grounded in the gold patch, the hidden-test digest and the repository snapshot at the base commit (pre-fix source was opened for the mechanism where the patch alone left it open). "Tests require" lists what the hidden tests import or assert on; items the problem statement itself names are marked (in statement), the rest (NOT in statement).

### 9.1 fastapi (67 tasks)

#### fastapi: Bug fix (38 tasks)

##### `fastapi_11194` - Use each field's own File info when extracting multipart bodies

- **Class:** C1 Bug fix / VAL Request / validation parameter handling / R02 wrong assumption about data shape or type / route P2 Repro-driven bugfix / statement L2 / spec gap none / difficulty 2
- **Root cause:** _extract_form_body computed first_field_info = body_fields[0].field_info once and reused it for every field's UploadFile read branches; when a Form parameter precedes the File parameter, the File field's UploadFile is never read to bytes and validation fails with 422.
- **Why it existed:** Earlier fix (6185a92) keyed the file checks off the first body field only; Form-before-File ordering was never covered.
- **Fix:** Compute field_info = field.field_info inside the loop and test that field's own info in both branches, dropping first_field/first_field_info.
- **Tests require:** Form before File and List[bytes] File endpoints must answer 200 (in statement: declaration order must not matter); pytest tmp_path fixtures and endpoint paths like /file_after_form (NOT in statement)
- **How to verify:** Repro from statement: POST multipart with Form declared before File; expect 200 with file content, not 422.
- **Most likely failure:** Reordering or reclassifying parameters in analyze_param instead of fixing the extraction loop, or breaking single-file and embedded-body behavior.
- **Gold footprint:** 1 file(s), +3/-4 lines: `fastapi/dependencies/utils.py`

##### `fastapi_11355` - Evaluate stringified annotations with inspect.signature eval_str on Python 3.10+

- **Class:** C1 Bug fix / TYP Type-annotation and model introspection (secondary DI) / R02 wrong assumption about data shape or type / route P3 Title-hunt / statement L2 / spec gap minor / difficulty 3
- **Root cause:** get_typed_signature evaluates string annotations using globalns from getattr(unwrapped, "__globals__", {}); a callable-class instance like Dep() has no __globals__, so under `from __future__ import annotations` every annotation is a string and evaluation runs with empty globals and NameErrors.
- **Why it existed:** PEP 563 future-annotations with class-based dependencies never covered; Typer fixed the identical bug in its PR 721, FastAPI lagged behind.
- **Fix:** In get_typed_signature and get_typed_return_annotation, call inspect.signature(call, eval_str=True) when sys.version_info >= (3, 10), else keep inspect.signature(call).
- **Tests require:** `from __future__ import annotations` module with class-based Depends(Dep()) route (in statement: stringified annotations on Python 3.10); needs_py310 marker from tests/utils (NOT in statement); Annotated
- **How to verify:** Repro: module with future-annotations import, callable-class dependency via Depends; GET must return 200 on Python 3.10+.
- **Most likely failure:** Building a globalns fallback for instances instead of using eval_str, or calling eval_str unguarded, which breaks on Python below 3.10.
- **Gold footprint:** 1 file(s), +9/-2 lines: `fastapi/dependencies/utils.py`; drivers: Python version

##### `fastapi_12942` - Recognize nested-Annotated discriminated unions as complex body fields

- **Class:** C1 Bug fix / TYP Type-annotation and model introspection (secondary VAL) / R01 missing branch / unhandled input class / route P2 Repro-driven bugfix / statement L1 / spec gap minor / difficulty 3
- **Root cause:** field_annotation_is_complex only special-cases Union/UnionType origins; for Annotated[Union[Annotated[...],...], Discriminator] get_origin returns Annotated and no branch recurses into get_args(annotation)[0], so the annotation is judged scalar and the parameter becomes a query parameter.
- **Why it existed:** Nested Annotated forms (discriminator/Tag metadata wrapping unions) unhandled in the pydantic-v2 compat layer; surfaced once Tag/Discriminator nesting became common.
- **Fix:** Add `if origin is Annotated: return field_annotation_is_complex(get_args(annotation)[0])` to field_annotation_is_complex.
- **Tests require:** Annotated[Union[Annotated[Model,Tag],...],Field(discriminator=...)] body parameter (statement shows Discriminator-callable variant) (in statement); inline_snapshot OpenAPI assertions, dirty_equals IsDict, needs_pydanticv2 (NOT in statement)
- **How to verify:** Repro from statement: POST the discriminated union without Body() must be treated as body; check /openapi.json has requestBody.
- **Most likely failure:** Patching analyze_param or body inference instead of the is_complex helper, or handling only one nesting level so Annotated-in-Annotated still misclassifies.
- **Gold footprint:** 1 file(s), +3/-0 lines: `fastapi/_compat.py`; drivers: Pydantic v1/v2, schema compared exactly; local grading blocked: dirty_equals, inline_snapshot

##### `fastapi_13207` - Keep computed fields in OpenAPI when input/output schemas are merged

- **Class:** C1 Bug fix / OAS Schema / contract generation (secondary SER) / R02 wrong assumption about data shape or type / route P5 Schema-contract / statement L2 / spec gap minor / difficulty 4
- **Root cause:** With separate_input_output_schemas=False, get_schema_from_model_field and get_definitions force override_mode='validation', but pydantic computed_field entries exist only in the serialization core schema, so the selected validation schema omits them from output.
- **Why it existed:** The validation override assumed validation schema equals serialization schema; false for models declaring computed_field (discussion #10342).
- **Fix:** In both helpers, skip the validation override when the model's core schema has computed_fields (field._type_adapter.core_schema lookup), leaving separate schemas for those fields.
- **Tests require:** FastAPI(separate_input_output_schemas=False) app with computed_field model (in statement); parametrized client fixture True/False, needs_pydanticv2, existing tests/test_computed_fields.py assertions (NOT in statement)
- **How to verify:** Existing tests/test_computed_fields.py in the snapshot shows the model and assertions; app must expose area both in responses and openapi.json under both flag values.
- **Most likely failure:** Forcing serialization mode globally (changes unrelated schemas) or editing openapi/utils instead of the _compat v2 override_mode selection and its core_schema inspection.
- **Gold footprint:** 1 file(s), +12/-2 lines: `fastapi/_compat/v2.py`; drivers: Pydantic v1/v2, schema compared exactly

##### `fastapi_13537` - Track visited form fields so empty strings fall back to None defaults

- **Class:** C1 Bug fix / VAL Request / validation parameter handling / R04 regression from an earlier change / route P1 Prescribe / statement L2 / spec gap none / difficulty 2
- **Root cause:** _extract_form_body only stores non-None values, and PR 12134's complement loop adds received keys 'not in values'; an empty-string form field resolves to the None default, is skipped, then gets re-added as "" from received_body, failing int validation.
- **Why it existed:** Regression from PR #12134: complementing missing fields by inspecting the values dict instead of tracking which fields were already processed, unlike request_params_to_args.
- **Fix:** Build field_aliases = {field.alias for field in body_fields} and gate the complement loop on key not in field_aliases.
- **Tests require:** Optional[int] Form() = None posted with data {'age': ''} returning null (in statement); multipart variant with Optional[bytes] File returning {'file': None, 'age': None} (NOT in statement)
- **How to verify:** Repro from statement: POST age='' to an Optional Form endpoint; expect None result, not a 422 validation error.
- **Most likely failure:** Special-casing empty strings in _get_multidict_value instead of the alias set, or breaking pass-through of genuinely extra form keys.
- **Gold footprint:** 1 file(s), +2/-1 lines: `fastapi/dependencies/utils.py`

##### `fastapi_14099` - Run dependency-with-yield exit code only after the response finishes

- **Class:** C1 Bug fix / DI Dependency-injection machinery (secondary SER) / R07 algorithmic flaw (loop, ordering, non-termination) / route P10 Timeboxed-slice / statement L2 / spec gap severe / difficulty 5
- **Root cause:** In get_request_handler the per-request `async with AsyncExitStack() as async_exit_stack` closes as soon as app() returns the Response object, before Starlette streams the body, so dependency-with-yield cleanup (Sessions) and UploadFile close run while a StreamingResponse is still sending; get_websocket_app likewise nests everything in one early stack.
- **Why it existed:** An earlier refactor bound dependency exit code to the route-handler frame; the statement reintroduces an app-level AsyncExitStack middleware ("again") so cleanup unwinds only after the response completes.
- **Fix:** Adds fastapi/middleware/asyncexitstack.AsyncExitStackMiddleware putting an AsyncExitStack in scope, a FastAPI.build_middleware_stack override placing it inside ExceptionMiddleware, and routing.py wrappers (request_response, websocket_session) that solve dependencies with the scope stack so exit code runs post-response.
- **Tests require:** UploadFile close timing (in statement); Streaming/yield ordering, raise-after-yield 418/500 semantics, WebSocket yield deps, exact "Broken after yield"/"Session closed" messages (NOT in statement)
- **How to verify:** Repro: route returning StreamingResponse over a yield-dependency session; existing test_dependency_contextmanager.py and tutorial tests must stay green.
- **Most likely failure:** Patches per-route (sending the response inside the stack) instead of the middleware + scope["fastapi_inner_astack"] redesign, or breaks existing yield/exception/WebSocket semantics and runs out of budget mid-refactor of the 4,400-line routing.py.
- **Gold footprint:** 5 file(s), +346/-131 lines: `docs_src/dependencies/tutorial013_an_py310.py`; `docs_src/dependencies/tutorial014_an_py310.py`; `fastapi/applications.py`; `fastapi/middleware/asyncexitstack.py`; `fastapi/routing.py`; drivers: several files, new file required, large patch, terse statement, algorithmic

##### `fastapi_14186` - Stop importing Pydantic v1 eagerly; add may_v1 stub classes

- **Class:** C1 Bug fix / CMP Compatibility shims / R05 upstream dependency change / route P6 Compat-shim / statement L2 / spec gap severe / difficulty 5
- **Root cause:** fastapi/_compat/main.py and fastapi/_compat/__init__.py imported the v1 shim module (which imports pydantic.v1) at module level and used v1.BaseModel/v1.FieldInfo/v1.ModelField for isinstance checks, so every fastapi import touched pydantic.v1 even on pure-v2 installs, tripping Pydantic 2.12's v1-removed warning on Python 3.14.
- **Why it existed:** PR #14168 added mixed v1/v2 support with eager v1 imports; Pydantic 2.12 then dropped v1 support and warns on import (pydantic#12367), surfacing in the Python 3.14 CI.
- **Fix:** Adds fastapi/_compat/may_v1.py with dummy v1-shaped classes (BaseModel, FieldInfo, ModelField, ErrorWrapper, UndefinedType, BaseConfig, ...) used for isinstance checks; fastapi._compat.v1 imports move inside the v1 branches, lazily.
- **Tests require:** from fastapi._compat import may_v1 (NOT in statement); lazy "from fastapi._compat import v1" inside functions (NOT in statement); may_v1.BaseModel subclassing (NOT in statement)
- **How to verify:** Import fastapi under Pydantic 2.12 and assert no v1 deprecation warning; existing tests/test_compat.py exercises the _compat internals.
- **Most likely failure:** Guards some call sites but leaves a module-level v1 import chain; invents a stub-module name other than may_v1 (hidden tests import it directly); or breaks the pydantic-v1-only install paths.
- **Gold footprint:** 10 file(s), +266/-98 lines: `fastapi/_compat/__init__.py`; `fastapi/_compat/main.py`; `fastapi/_compat/may_v1.py`; `fastapi/_compat/shared.py`; `fastapi/_compat/v1.py`; `fastapi/_compat/v2.py` ...; drivers: several files, new file required, large patch, Pydantic v1/v2, Python version, new public name to guess

##### `fastapi_14246` - Fix nested-model schema separation between validation and serialization modes

- **Class:** C1 Bug fix / OAS Schema / contract generation (secondary TYP) / R04 regression from an earlier change / route P5 Schema-contract / statement L2 / spec gap minor / difficulty 3
- **Root cause:** get_definitions in fastapi/_compat/v2.py flattened nested models once with get_flat_models_from_fields over all fields and wrapped them in default-mode ModelFields, ignoring each field's validation/serialization mode; with separate_input_output_schemas, nested models shared by input and output got definitions in only one section, splitting schemas wrongly.
- **Why it existed:** Regression from 0.119.0's separate input/output schema feature: per-field modes were introduced, but the flat-model pass stayed mode-agnostic.
- **Fix:** get_definitions partitions fields by mode, flattens validation and serialization models separately, wraps each flat model in a ModelField carrying that mode, and concatenates both lists before generate_definitions.
- **Tests require:** OpenAPI schema snapshots (inline_snapshot/pydantic_snapshot) for Message/MessageOutput/MessageEvent nested models shared by body and response (NOT in statement)
- **How to verify:** Repro: app whose response model nests a model also used as request body; compare /openapi.json; run existing separate-input-output-schema tests.
- **Most likely failure:** Tweaks the unique_flat_model_fields dedup filter instead of splitting the flatten pass by field mode, leaving $defs still split or duplicated against the snapshotted schema.
- **Gold footprint:** 1 file(s), +24/-4 lines: `fastapi/_compat/v2.py`; drivers: schema compared exactly, tests compare exact strings; local grading blocked: inline_snapshot

##### `fastapi_14266` - Register security schemes used as top-level app dependencies in OpenAPI

- **Class:** C1 Bug fix / OAS Schema / contract generation (secondary SEC) / R01 missing branch / unhandled input class / route P3 Title-hunt / statement L3 / spec gap minor / difficulty 3
- **Root cause:** get_dependant appended a SecurityRequirement only inside the parameter loop when param_details.depends.dependency is a SecurityBase; a SecurityBase passed directly as the dependant's call (top-level dependencies=[Depends(scheme)]) never matched that branch, so get_openapi saw no security requirement and emitted no securitySchemes.
- **Why it existed:** SecurityBase always reached the requirement code as a function parameter; the call-is-the-scheme path was never handled (edge case never covered).
- **Fix:** Move SecurityRequirement registration to the top of get_dependant keyed on isinstance(call, SecurityBase), with OAuth2/OpenIdConnect inheriting security_scopes; drop the in-loop copy.
- **Tests require:** openapi.json listing the scheme under security and components.securitySchemes (in statement); HTTPBearer used via dependencies=[Depends(...)] (NOT in statement); 403 'Not authenticated' (NOT in statement).
- **How to verify:** Build an app with dependencies=[Depends(HTTPBearer())], fetch /openapi.json, expect the scheme and operation security listed.
- **Most likely failure:** Agent duplicates registration by adding the isinstance(call, SecurityBase) branch without removing the old parameter-loop branch, or only patches the parameterless path and misses sub-dependant parameters.
- **Gold footprint:** 1 file(s), +8/-10 lines: `fastapi/dependencies/utils.py`; drivers: schema compared exactly, tests compare exact strings; local grading blocked: inline_snapshot

##### `fastapi_14297` - Unwrap Optional unions in serialize_sequence_value so optional file lists work

- **Class:** C1 Bug fix / VAL Request / validation parameter handling (secondary CMP) / R02 wrong assumption about data shape or type / route P1 Prescribe / statement L1 / spec gap none / difficulty 1
- **Root cause:** In _compat/v2.py serialize_sequence_value, origin_type = get_origin(annotation) or annotation assumes the annotation is a bare sequence; for Optional[List[bytes]] get_origin returns Union and the following assert issubclass(Union, sequence_types) raises TypeError instead of serializing the uploaded list.
- **Why it existed:** Pydantic-v2 compat path never handled Optional (Union-with-None) sequence annotations; uncovered until optional file lists were exercised.
- **Fix:** In serialize_sequence_value, when origin_type is Union, iterate get_args, skip type(None), take the first remaining argument's origin as origin_type.
- **Tests require:** Optional[List[bytes]] = File(None) endpoint (in statement); v2.serialize_sequence_value called with ModelField/FieldInfo(annotation=Union[...]) (NOT in statement); needs_pydanticv2 marker (NOT in statement).
- **How to verify:** Run the statement snippet: POST /files with two files must return 200 and sizes [8, 8].
- **Most likely failure:** Unwrapping the Union but not handling None-first ordering (Union[None, List[...]]) that the direct compat unit test exercises, or fixing only the demo endpoint instead of the helper.
- **Gold footprint:** 1 file(s), +7/-0 lines: `fastapi/_compat/v2.py`; drivers: Pydantic v1/v2

##### `fastapi_14301` - Forward Depends scope to get_dependant for parameterless route dependencies

- **Class:** C1 Bug fix / DI Dependency-injection machinery / R04 regression from an earlier change / route P2 Repro-driven bugfix / statement L2 / spec gap none / difficulty 2
- **Root cause:** get_parameterless_sub_dependant calls get_dependant without scope=depends.scope, so parameterless (top-level) Depends entries build dependants with scope None; computed_scope then defaults generators to 'request' and their cleanup runs after the response even when scope='function' was requested.
- **Why it existed:** Regression from the dependency-scope feature: the parameter-path call site forwards scope, the parameterless one was missed.
- **Fix:** Pass scope=depends.scope in get_parameterless_sub_dependant's get_dependant call.
- **Tests require:** Depends(dep, scope='function') honored for route-, router- and app-level dependencies=[...] (in statement); post-yield HTTPException surfaces as 503 for function scope, 200 for request scope (NOT in statement).
- **How to verify:** Route-level dependencies=[Depends(yield_dep, scope='function')]; a post-yield HTTPException must produce 503, proving early exit.
- **Most likely failure:** Agent forwards scope only in APIRoute.__init__ instead of get_parameterless_sub_dependant, missing app- and router-level dependencies, or hunts for the fix in routing.
- **Gold footprint:** 1 file(s), +4/-1 lines: `fastapi/dependencies/utils.py`

##### `fastapi_14303` - Keep all repeated values for extra Form fields in model parsing

- **Class:** C1 Bug fix / VAL Request / validation parameter handling / R02 wrong assumption about data shape or type / route P1 Prescribe / statement L1 / spec gap none / difficulty 1
- **Root cause:** In the extra-fields loop of request_body_to_args, values[key] = value taken from received_body.items(); starlette's FormData.items() yields only the last value for repeated keys, so extra='allow' models get '789' rather than ['456','789'].
- **Why it existed:** Extras assumed single-valued when model-based Form parsing was added; repeated keys never exercised.
- **Fix:** Iterate received_body.keys(), use getlist; assign the single value when one item, else the full list, for keys not in body field aliases.
- **Tests require:** extra='allow' Form model endpoint returning extras (in statement); single extra stays str, repeated extra becomes list (in statement); PYDANTIC_V2-gated test model (NOT in statement).
- **How to verify:** Statement repro: POST param2=['456','789'] must return JSON with param2 as a list.
- **Most likely failure:** Always assigning getlist lists (hidden test asserts a single extra stays a plain string), or handling only declared fields and leaving the extras loop untouched.
- **Gold footprint:** 1 file(s), +6/-2 lines: `fastapi/dependencies/utils.py`; drivers: Pydantic v1/v2; local grading blocked: dirty_equals

##### `fastapi_14349` - Don't treat a JSON-Schema property named $ref as a reference

- **Class:** C1 Bug fix / OAS Schema / contract generation / R02 wrong assumption about data shape or type / route P3 Title-hunt / statement L3 / spec gap severe / difficulty 3
- **Root cause:** _replace_refs checks key == '$ref' and calls schema['$ref'].split('/') assuming every '$ref' key maps to a string; a model field aliased '$ref' puts a '$ref' property dict inside a nested schema, so .split raises AttributeError and OpenAPI generation crashes.
- **Why it existed:** Pydantic v2 allows fields whose alias/property name is '$ref'; the recursion never expected a non-string value under that key.
- **Fix:** Only rewrite when the '$ref' value isinstance(str); otherwise leave the entry untouched and continue with the remaining keys.
- **Tests require:** Model field aliased '$ref' via validation_alias/serialization_alias (NOT in statement); openapi.json snapshot keeping properties.$ref in ModelWithRef (NOT in statement); response {'$ref': 'some-ref'} (NOT in statement).
- **How to verify:** Define a model with a '$ref'-named property and fetch openapi.json; base raises AttributeError, fixed code returns the full schema.
- **Most likely failure:** Guarding the split but still assigning new_schema['$ref'] (clobbering the property), forgetting the continue so the dict gets treated as a ref, or building a repro whose '$ref' key never lands in a nested schema.
- **Gold footprint:** 1 file(s), +6/-6 lines: `fastapi/_compat/v2.py`; drivers: terse statement, schema compared exactly, tests compare exact strings, Pydantic v1/v2; local grading blocked: inline_snapshot

##### `fastapi_14356` - Keep all repeated values for extra Query and Header model fields

- **Class:** C1 Bug fix / VAL Request / validation parameter handling / R03 duplicated or parallel logic out of sync / route P2 Repro-driven bugfix / statement L1 / spec gap minor / difficulty 2
- **Root cause:** In request_params_to_args, the extra-keys loop copies params_to_process[key] = value from received_params.items(); QueryParams/Headers multidict items collapse repeated keys to the last value, so extra='allow' Query/Header models lose earlier values.
- **Why it existed:** Same .items() flaw as the Form path; #14303 fixed request_body_to_args only, leaving this parallel loop out of sync.
- **Fix:** Iterate unprocessed keys; when received_params has getlist use it and unwrap single-element lists; otherwise fall back to .get(key) so cookies (no repeats) keep the last value.
- **Tests require:** extra='allow' Query/Header/Cookie model endpoints (in statement); repeated extra yields list, single yields str, cookie keeps last value (in statement, prose note); changed test_tutorial003 expectation (NOT in statement).
- **How to verify:** Run the statement repro for repeated query params and re-run existing query/header-param-model test suites.
- **Most likely failure:** Calling getlist unconditionally crashes on starlette Cookies (no getlist) or returns lists where the hidden cookie test expects last value '789'; an existing tutorial003 header-model expectation also shifts.
- **Gold footprint:** 1 file(s), +9/-2 lines: `fastapi/dependencies/utils.py`; drivers: tests compare exact strings, Pydantic v1/v2

##### `fastapi_14360` - Alias-keyed Query/Header/Cookie param models fail validation and hide extras from errors

- **Class:** C1 Bug fix / VAL Request / validation parameter handling / R02 wrong assumption about data shape or type / route P2 Repro-driven bugfix / statement L2 / spec gap none / difficulty 2
- **Root cause:** request_params_to_args stored extracted values under field.name while Pydantic v2 validates the param model by field alias, so alias-supplied values are invisible to validation and yield a missing-field 422; it also added field.name to processed_keys, so a param sent by name was treated as consumed and dropped from the error's 'input'.
- **Why it existed:** Pydantic v2 param models are a recent feature; alias handling of their fields was never exercised, so extraction keyed the values dict by name.
- **Fix:** In request_params_to_args store the extracted value under field.alias instead of field.name, and stop adding field.name to processed_keys so only the alias counts as processed.
- **Tests require:** Model with Field(alias='param_alias') used as Query()/Header()/Cookie() (in statement); 422 detail[0].input containing the by-name param (in statement); dirty_equals IsPartialDict, PYDANTIC_V2 branch (NOT in statement)
- **How to verify:** Repro from statement: TestClient app with alias model param; alias request gives 200, by-name request gives 422 with input.
- **Most likely failure:** Re-keying values but keeping field.name in processed_keys, fixing only issue 1; or breaking the v1 path by unconditional alias keying.
- **Gold footprint:** 1 file(s), +1/-2 lines: `fastapi/dependencies/utils.py`; drivers: tests compare exact strings, Pydantic v1/v2; local grading blocked: dirty_equals

##### `fastapi_14361` - OpenAPI generation crashes remapping schemas that have no $ref

- **Class:** C1 Bug fix / OAS Schema / contract generation (secondary CMP) / R01 missing branch / unhandled input class / route P3 Title-hunt / statement L4 / spec gap minor / difficulty 3
- **Root cause:** _remap_definitions_and_field_mappings assumed every field_mapping schema is a '$ref' dict: after the model_name_map membership check it unconditionally reads schema['$ref']. Models like an empty Enum get a plain {'enum': [], 'title': ...} schema without a definition, so OpenAPI generation raises KeyError when such a model appears in a response union.
- **Why it existed:** Pydantic v2 emits no definition/$ref for empty enums; the remapping helper never met a mapped model whose schema lacks '$ref' (unknown beyond Discussion #14265).
- **Fix:** Skip remapping for schemas without the key: change the continue condition to 'if model not in model_name_map or "$ref" not in schema'.
- **Tests require:** OpenAPI snapshot where User.role is anyOf(PlatformRole $ref, inline empty OtherRole enum); needs_pydanticv2/needs_py310 markers, inline_snapshot equality (NOT in statement)
- **How to verify:** Repro: app whose response model field is typed PlatformRole \| OtherRole; GET /openapi.json raises KeyError before the fix.
- **Most likely failure:** Guarding with schema.get('$ref', '') producing wrong remaps, or skipping all non-$ref schemas including the Input/Output ones the map relies on.
- **Gold footprint:** 1 file(s), +1/-1 lines: `fastapi/_compat/v2.py`; drivers: terse statement, schema compared exactly, Pydantic v1/v2, Python version; local grading blocked: inline_snapshot

##### `fastapi_14371` - Parameter validation, serialization and OpenAPI aliases handled inconsistently across FastAPI

- **Class:** C1 Bug fix / VAL Request / validation parameter handling (secondary OAS) / R03 duplicated or parallel logic out of sync / route P7 Mechanical-sweep / statement L2 / spec gap minor / difficulty 4
- **Root cause:** Every alias read (ModelField.alias in _get_multidict_value, request_params_to_args, request_body_to_args, error locs, OpenAPI parameter names, schema titles) used only field_info.alias; FieldInfo.validation_alias/serialization_alias were ignored, and Param/Body __init__ never propagated a plain alias into them, so validation-alias keys were never extracted, located or documented.
- **Why it existed:** Pydantic v2 splits alias into validation/serialization variants; PR #14358's partial switch left FastAPI's extraction and OpenAPI paths reading the single legacy alias.
- **Fix:** Add validation_alias/serialization_alias properties to ModelField and a get_validation_alias(field) helper defaulting to alias; use it in extraction, locs, extras filtering, OpenAPI names and titles; propagate alias into both fields in Param/Body __init__ under Pydantic v2.
- **Tests require:** Query/Header/Cookie/Form/File/Body alias extraction returning {'p': value}, 422 locs, OpenAPI names (in statement: validation_alias, string-only); get_validation_alias helper (NOT in statement)
- **How to verify:** Repro: param sent under alias or validation_alias must 200 with {'p': ...}; header aliases convert underscores; openapi.json parameter names use the validation alias.
- **Most likely failure:** Patching only request_params_to_args and missing body extras filtering, error locs, OpenAPI names or schema titles; or breaking header convert_underscores and the Pydantic v1 path.
- **Gold footprint:** 4 file(s), +46/-16 lines: `fastapi/_compat/v2.py`; `fastapi/dependencies/utils.py`; `fastapi/openapi/utils.py`; `fastapi/params.py`; drivers: several files, large patch, Pydantic v1/v2; local grading blocked: dirty_equals

##### `fastapi_14419` - Stop caching dependencies on scopes they never use

- **Class:** C1 Bug fix / DI Dependency-injection machinery / R09 state, identity, caching or hashing error / route P2 Repro-driven bugfix / statement L2 / spec gap minor / difficulty 4
- **Root cause:** Dependant.cache_key always hashed security_scopes, and get_dependant cascaded parent scopes into every sub-dependant regardless of use, so the same dependency reached with and without scoped ancestors produced different cache keys and ran multiple times per request. Scopes should enter the key only when the dependency subtree actually consumes them.
- **Why it existed:** Scope-aware caching (PR #9790 lineage) made inherited scopes part of dependency identity; dependencies that never use scopes were not considered.
- **Fix:** Replace security_scopes with own_oauth_scopes/parent_oauth_scopes plus cached oauth_scopes and recursive _uses_scopes (own scopes, SecurityScopes param, or any sub-dependant); include scopes in cache_key only when _uses_scopes; feed oauth_scopes to SecurityScopes and security requirements.
- **Tests require:** SecurityScopes injection; Security(scopes=[...]) reuse called once via call_counter/call_counts assertions; new tests/test_security_scopes.py and test_security_scopes_sub_dependency.py (NOT in statement)
- **How to verify:** Repro: route using one dependency both scoped and unscoped; count invocations; existing tests/test_security_scopes.py must stay green.
- **Most likely failure:** Including scopes in the key whenever any exist without the recursive _uses_scopes walk, or dropping parent scopes from SecurityScopes/oauth2 requirements and breaking existing security tests.
- **Gold footprint:** 2 file(s), +42/-20 lines: `fastapi/dependencies/models.py`; `fastapi/dependencies/utils.py`; drivers: several files, algorithmic

##### `fastapi_14430` - Optional sequences declared with PEP 604 pipe union crash serialization

- **Class:** C1 Bug fix / TYP Type-annotation and model introspection (secondary SER) / R01 missing branch / unhandled input class / route P3 Title-hunt / statement L2 / spec gap minor / difficulty 3
- **Root cause:** serialize_sequence_value checked only 'origin_type is Union' (typing.Union); for 'list[str] \| None' get_origin returns types.UnionType, the branch misses, and the following issubclass assert runs against the union itself and raises AssertionError. fastapi.types.UnionType already existed but was neither imported nor used here.
- **Why it existed:** Regression from PR #14297, which added serialize_sequence_value handling only one union flavour; PEP 604 unions were untested.
- **Fix:** Import UnionType from fastapi.types and accept it next to Union: 'if origin_type is Union or origin_type is UnionType'.
- **Tests require:** fastapi._compat.v2.serialize_sequence_value called with FieldInfo(annotation=list[str] \| None) returning the list (NOT in statement); needs_py310 marker (NOT in statement)
- **How to verify:** Inline repro: v2.serialize_sequence_value on a FieldInfo(list[str] \| None) must return the list; needs Python 3.10+.
- **Most likely failure:** Using types.UnionType without the fastapi.types fallback for older Pythons, or patching get_origin checks elsewhere instead of serialize_sequence_value.
- **Gold footprint:** 1 file(s), +2/-2 lines: `fastapi/_compat/v2.py`; drivers: Python version

##### `fastapi_14448` - Wrapped partials of async functions misdetected as sync or generator

- **Class:** C1 Bug fix / TYP Type-annotation and model introspection (secondary DI) / R02 wrong assumption about data shape or type / route P2 Repro-driven bugfix / statement L2 / spec gap minor / difficulty 4
- **Root cause:** Dependant._unwrapped_call unwrapped __wrapped__ chains and stripped only one partial layer, then each is_*_callable judged a single probe point; a sync wrapper (functools.wraps) around a partial of an async function/generator was classified by the wrapper alone, so async callables were not awaited and generators were misrouted in _solve_generator.
- **Why it existed:** Decorators combining functools.wraps and partial over async/generator functions were an untested input class for the new introspection helpers.
- **Fix:** Add _impartial (strip all partial layers) and _unwrapped_call helpers; make each is_gen/is_async_gen/is_coroutine check probe both the partial-stripped and fully unwrapped call plus their __call__ attributes; check async generators before sync generators in _solve_generator.
- **Tests require:** functools.wraps+partial combos over async/sync/generator/class callables and callable instances (in statement); new tests/test_dependency_wrapped.py wrapper helpers (NOT in statement)
- **How to verify:** Repro: dependency = noop_wrap(partial(async_fn)) served through a route must work; existing wrapped-dependency tests at base stay green.
- **Most likely failure:** Stripping only one partial level, probing only the wrapper or only the original, or skipping the async-gen-before-gen reorder in _solve_generator, breaking wrapped generator dependencies.
- **Gold footprint:** 2 file(s), +82/-24 lines: `fastapi/dependencies/models.py`; `fastapi/dependencies/utils.py`; drivers: several files, large patch, algorithmic

##### `fastapi_14455` - Deduplicate repeated OAuth2 security schemes merging their scopes in OpenAPI

- **Class:** C1 Bug fix / OAS Schema / contract generation (secondary SEC) / R01 missing branch / unhandled input class / route P2 Repro-driven bugfix / statement L2 / spec gap minor / difficulty 3
- **Root cause:** get_openapi_security_definitions appended one {scheme_name: scopes} entry per security_requirement, so a scheme declared app-wide without scopes and again on routers/parameters with different scopes produced duplicate, conflicting security entries per operation instead of one merged scope list.
- **Why it existed:** One scheme reused at several security levels with different scopes was an unhandled input class.
- **Fix:** Collect scopes in an operation_security_dict keyed by scheme_name, appending unseen scopes in encounter order, then emit [{name: scopes}] entries.
- **Tests require:** OAuth2AuthorizationCodeBearer with scopes used on app, APIRouter and parameter levels; exact inline_snapshot OpenAPI security arrays (scheme names NOT in statement)
- **How to verify:** Repro: same bearer scheme at app/router/param scope levels; inspect openapi.json security arrays for duplicates and unmerged scopes.
- **Most likely failure:** Merging scopes across different schemes, dropping first-appearance order, emitting None instead of [] for scope-less entries, or deduplicating security_definitions instead of operation_security.
- **Gold footprint:** 1 file(s), +11/-2 lines: `fastapi/openapi/utils.py`; drivers: schema compared exactly, tests compare exact strings; local grading blocked: inline_snapshot

##### `fastapi_14458` - Class dependencies with coroutine __call__ wrongly awaited as coroutines

- **Class:** C1 Bug fix / DI Dependency-injection machinery (secondary TYP) / R04 regression from an earlier change / route P1 Prescribe / statement L2 / spec gap none / difficulty 2
- **Root cause:** The recent rework of is_gen_callable/is_async_gen_callable/is_coroutine_callable dropped the earlier inspect.isclass guard, so getattr(cls, '__call__') on a class whose __call__ is a coroutine/generator function makes the class itself classify as coroutine/generator; the solver then awaits or stack-enters the class call, which merely returns an instance.
- **Why it existed:** Regression introduced in FastAPI 0.123.6 by the partial/wraps introspection rework; class dependencies with __call__ were untested.
- **Fix:** Early-return False in all three cached properties when inspect.isclass(_unwrapped_call(self.call)) before any dunder __call__ inspection; drop the stale isclass comment.
- **Tests require:** Depends() with class annotations whose __call__ is sync/async/generator/async-generator; routes appended to tests/test_dependency_class.py (class names NOT in statement)
- **How to verify:** Extend existing tests/test_dependency_class.py patterns: a class dependency route must return the instance call result without error.
- **Most likely failure:** Adding the isclass guard only in is_coroutine_callable (statement names all three), or testing self.call directly instead of _unwrapped_call(self.call).
- **Gold footprint:** 1 file(s), +6/-1 lines: `fastapi/dependencies/models.py`

##### `fastapi_14459` - Fix OAuth2 security scopes missing in OpenAPI for scoped parent dependencies and cached schemes

- **Class:** C1 Bug fix / DI Dependency-injection machinery (secondary OAS) / R03 duplicated or parallel logic out of sync / route P2 Repro-driven bugfix / statement L2 / spec gap minor / difficulty 4
- **Root cause:** get_dependant recorded scopes in a parallel SecurityRequirement list only when the node's call is a SecurityBase; get_flat_dependant flattened that list without propagating parent_oauth_scopes, and _uses_scopes ignored SecurityBase nodes, so scopeless scheme sub-dependencies cached under empty scope keys and OpenAPI rendered schemes without their parent-declared scopes.
- **Why it existed:** Corner cases (scheme as scopeless sub-dependency, scoped parents) never covered when the parallel SecurityRequirement list design was introduced; scope bookkeeping drifted from the dependency tree.
- **Fix:** Delete SecurityRequirement; add cached _is_security_scheme, _security_scheme, _security_dependencies on Dependant; make _uses_scopes true for security schemes; thread parent_oauth_scopes through get_flat_dependant; OpenAPI reads oauth_scopes off flat_dependant._security_dependencies.
- **Tests require:** OpenAPI snapshot listing OAuth2AuthorizationCodeBearer scopes ['read','write'] on /with-oauth2-scheme and /with-get-token plus 200 Bearer responses (NOT in statement); Security/Depends usage pattern (in statement).
- **How to verify:** Build the statement's app variants, GET /openapi.json, check security scopes; existing tests/test_security_oauth2* files show the schema shape.
- **Most likely failure:** Patching only openapi/utils.py scope merging, or adding scopes without the _uses_scopes/cache_key change, leaving the scopeless scheme deduplicated wrong at runtime.
- **Gold footprint:** 3 file(s), +49/-22 lines: `fastapi/dependencies/models.py`; `fastapi/dependencies/utils.py`; `fastapi/openapi/utils.py`; drivers: several files, schema compared exactly, tests compare exact strings; local grading blocked: inline_snapshot

##### `fastapi_14463` - Stop duplicate anyOf refs when app-level Union responses also declare content examples

- **Class:** C1 Bug fix / OAS Schema / contract generation / R09 state, identity, caching or hashing error / route P2 Repro-driven bugfix / statement L1 / spec gap none / difficulty 2
- **Root cause:** In get_openapi_path, process_response = additional_response.copy() is shallow, so process_response['content'] is the same dict object stored in route.responses; deep_dict_update writing the generated Union anyOf schema mutates the app-level responses entry shared by every route, re-appending refs on each route processed.
- **Why it existed:** Shallow copy sufficed while responses were per-route; app-level shared responses dicts combined with model+content were never exercised.
- **Fix:** Import copy and replace the shallow .copy() with copy.deepcopy(additional_response) so mutation cannot alias the shared responses dict.
- **Tests require:** /openapi.json full-dict equality: anyOf holds exactly ModelA+ModelB refs per route's 500 response (NOT in statement).
- **How to verify:** Run the statement's app, fetch /openapi.json, assert anyOf holds exactly two $refs.
- **Most likely failure:** Deduplicating refs after generation, or deep-copying only part of the chain, instead of fixing the shallow-copy aliasing at the responses loop.
- **Gold footprint:** 1 file(s), +2/-1 lines: `fastapi/openapi/utils.py`; drivers: schema compared exactly

##### `fastapi_14482` - Support arbitrary-type model fields when arbitrary_types_allowed=True is set

- **Class:** C1 Bug fix / TYP Type-annotation and model introspection (secondary VAL) / R01 missing branch / unhandled input class / route P3 Title-hunt / statement L2 / spec gap severe / difficulty 3
- **Root cause:** ModelField.__post_init__ built its per-field TypeAdapter from Annotated[annotation, field_info] with no config, and get_model_fields never passed model.model_config, so fields of arbitrary types under arbitrary_types_allowed=True raised PydanticSchemaGenerationError when FastAPI rebuilt validators.
- **Why it existed:** FastAPI's per-field TypeAdapter never received the model's pydantic config; arbitrary types only worked where pydantic itself built the schema (discussion 14184).
- **Fix:** Add optional config field to ModelField; get_model_fields passes model.model_config unless the annotation is BaseModel/dict/dataclass; __post_init__ passes config and builds Annotated[annotation, *metadata, field_info] with it.
- **Tests require:** tests/test_arbitrary_types.py: FakeNumpyArray field with WithJsonSchema+PlainSerializer under ConfigDict(arbitrary_types_allowed=True); [1.0,2.0,3.0] round-trip plus OpenAPI/json_schema snapshots (NOT in statement).
- **How to verify:** Write a model with arbitrary_types_allowed and an arbitrary-type field; pre-fix app construction crashes; assert GET returns the serialized value.
- **Most likely failure:** Applying model config to nested BaseModel/dict/dataclass fields too, altering their schema, or patching create_body_model instead of get_model_fields.
- **Gold footprint:** 1 file(s), +25/-7 lines: `fastapi/_compat/v2.py`; drivers: terse statement, schema compared exactly; local grading blocked: inline_snapshot

##### `fastapi_14485` - Avoid NameError inspecting signatures with TYPE_CHECKING-only stringified annotations

- **Class:** C1 Bug fix / TYP Type-annotation and model introspection (secondary DI) / R10 error-handling gap / route P3 Title-hunt / statement L2 / spec gap minor / difficulty 3
- **Root cause:** get_typed_signature and get_typed_return_annotation each call inspect.signature(call, eval_str=True); stringified annotations naming types imported only under if TYPE_CHECKING (e.g. AsyncGenerator in a dependency's return annotation) raise NameError there with no fallback, crashing route construction.
- **Why it existed:** eval_str=True was adopted earlier (statement links PR #11355) without handling names invisible at runtime; the TYPE_CHECKING pattern surfaced via dependency return annotations.
- **Fix:** Extract _get_signature wrapping eval_str=True in try/except NameError falling back to plain inspect.signature; call it from both get_typed_signature and get_typed_return_annotation.
- **Tests require:** tests/test_stringified_annotation_dependency.py: from __future__ import annotations, TYPE_CHECKING AsyncGenerator import, Annotated[DummyClient, Depends(get_client)] param; 200 response plus OpenAPI snapshot (NOT in statement).
- **How to verify:** Repro: small app whose dependency has a TYPE_CHECKING-only return annotation under future annotations; app must build and serve /.
- **Most likely failure:** Wrapping only one of the two call sites, or catching broad exceptions so genuinely undefined annotation names fail silently later.
- **Gold footprint:** 1 file(s), +13/-6 lines: `fastapi/dependencies/utils.py`; drivers: terse statement, Python version; local grading blocked: inline_snapshot

##### `fastapi_14512` - Fix tagged-union discriminator inside Annotated combined with Body()

- **Class:** C1 Bug fix / TYP Type-annotation and model introspection (secondary VAL) / R02 wrong assumption about data shape or type / route P3 Title-hunt / statement L2 / spec gap severe / difficulty 4
- **Root cause:** copy_field_info merges Annotated metadata (Discriminator) into the Body FieldInfo; ModelField.__post_init__ then passes that same FieldInfo inside Annotated[annotation, *metadata, field_info], re-applying its absorbed metadata, so pydantic builds the tagged union without a working discriminator mapping.
- **Why it existed:** copy_field_info intentionally merges annotation metadata into the FieldInfo; the newer __post_init__ Annotated rebuild assumed that merged FieldInfo carried no metadata.
- **Fix:** Add an asdict(field_info) shim for pydantic <2.12.3 and rebuild a fresh Field(**attributes) in __post_init__, so the Annotated tuple carries annotation+metadata plus an attribute-only FieldInfo.
- **Tests require:** tests/test_union_body_discriminator_annotated.py: Annotated[Union[Annotated[Cat,Tag('cat')],Annotated[Dog,Tag('dog')]],Discriminator(...)] with Body(); {'pet_type':'cat'...}/{'pet_type':'dog'...} responses plus OpenAPI snapshot (NOT in statement).
- **How to verify:** Repro: tagged union via Discriminator/Tag in Annotated with Body(); POST cat/dog payloads and inspect /openapi.json discriminator.
- **Most likely failure:** Fixing analyze_param's merge instead of ModelField.__post_init__, or dropping the asdict shim and crashing on pydantic older than 2.12.3.
- **Gold footprint:** 1 file(s), +48/-4 lines: `fastapi/_compat/v2.py`; drivers: terse statement, schema compared exactly, Pydantic v1/v2; local grading blocked: inline_snapshot

##### `fastapi_14616` - Fix Json-wrapped list Form/Query params being misread as multi-value

- **Class:** C1 Bug fix / VAL Request / validation parameter handling (secondary TYP) / R02 wrong assumption about data shape or type / route P2 Repro-driven bugfix / statement L1 / spec gap none / difficulty 2
- **Root cause:** _get_multidict_value in fastapi/dependencies/utils.py branches on is_sequence_field(field) and calls values.getlist(alias); for Json[list[str]] the annotation looks sequential, so the single JSON string is wrapped as one-element list and Pydantic fails with 'JSON input should be string, bytes or bytearray'. Nothing checked field.field_info.metadata for Json.
- **Why it existed:** Json[T] parameters were classified purely by their sequence annotation; the Json-metadata case (issue #10997) was never covered.
- **Fix:** Adds _is_json_field(field) checking any(type(item) is Json for item in field.field_info.metadata) and gates the getlist branch on (not _is_json_field(field)) and is_sequence_field(field).
- **Tests require:** Json[list[str]] with Form/Query/Header/Cookie returning the parsed list (in statement); hidden routes /form-json-list etc. (NOT in statement)
- **How to verify:** Inline TestClient repro posting data={'items': json.dumps(['abc','def'])} to a Json[list[str]] Form route; statement shows exact before/after.
- **Most likely failure:** Agent may patch field_annotation_is_sequence or pydantic validation instead of the getlist branch, or over-generalise to pydantic v1 whose FieldInfo lacks .metadata (explicitly out of scope).
- **Gold footprint:** 1 file(s), +10/-2 lines: `fastapi/dependencies/utils.py`

##### `fastapi_14786` - Strip surrounding whitespace from Authorization header credentials

- **Class:** C1 Bug fix / SEC Security and auth (secondary NET) / R08 encoding / escaping / whitespace error / route P2 Repro-driven bugfix / statement L1 / spec gap none / difficulty 1
- **Root cause:** get_authorization_scheme_param in fastapi/security/utils.py splits the header with partition(' ') and returns param verbatim; RFC 6750 allows 1*SP between scheme and b64token but the token itself cannot contain whitespace, so extra leading/trailing spaces stay in credentials.credentials and break authentication.
- **Why it existed:** Parser assumed exactly one space between scheme and token; RFC 6750's multiple-space allowance was never handled.
- **Fix:** Returns param.strip() instead of param in get_authorization_scheme_param.
- **Tests require:** credentials stripped for multi-space and trailing-space Authorization headers (in statement repro); test_security_http_base_with_whitespaces and test_token_with_whitespaces (NOT in statement)
- **How to verify:** Statement repro via TestClient with Authorization 'Bearer   xxx' expecting credentials 'xxx'; tests/test_security_http_base.py already exists.
- **Most likely failure:** Agent may strip the whole header value instead of only param, or additionally collapse internal whitespace or lowercase the scheme beyond the one-line fix.
- **Gold footprint:** 1 file(s), +1/-1 lines: `fastapi/security/utils.py`

##### `fastapi_14794` - Allow Response-typed parameters to use an explicit Depends

- **Class:** C1 Bug fix / DI Dependency-injection machinery (secondary VAL) / R01 missing branch / unhandled input class / route P2 Repro-driven bugfix / statement L2 / spec gap none / difficulty 2
- **Root cause:** In analyze_param (fastapi/dependencies/utils.py) the special-type branch for Request/WebSocket/HTTPConnection/Response/BackgroundTasks/SecurityScopes runs unconditionally and asserts depends is None, so annotating such a parameter with Depends() raises AssertionError at route creation instead of resolving the dependency, even though the depends object is already parsed.
- **Why it existed:** Special-type injection and Depends were treated as mutually exclusive; producing a Response via a dependency was never considered (issue #10127).
- **Fix:** Branch condition becomes depends is None and lenient_issubclass(...); the assertion is dropped so an explicit Depends is called normally and its return value injected.
- **Tests require:** Annotated[Response, Depends(fn)] and Response = Depends(fn) supported (in statement); Request/BackgroundTasks parity and dependency chains with custom headers (NOT in statement)
- **How to verify:** Inline app with Annotated[Response, Depends(...)] route expecting 200 and custom header; pre-fix raises AssertionError 'Cannot specify `Depends` for type Response'.
- **Most likely failure:** Agent may remove the whole special-type branch (breaking plain response: Response injection) or special-case only Response instead of gating on depends, losing Request/BackgroundTasks parity the hidden tests check.
- **Gold footprint:** 1 file(s), +3/-2 lines: `fastapi/dependencies/utils.py`

##### `fastapi_14873` - Fix on_startup handlers wiped by Starlette Router init order

- **Class:** C1 Bug fix / RTG Routing and lifecycle (secondary CMP) / R04 regression from an earlier change / route P2 Repro-driven bugfix / statement L2 / spec gap minor / difficulty 2
- **Root cause:** Post-14851 APIRouter.__init__ assigns self.on_startup/self.on_shutdown before calling super().__init__(); Starlette's Router.__init__ still overwrites those attributes with empty lists (its on_startup/on_shutdown kwargs default to None), so handlers passed to FastAPI(on_startup=[...]) or APIRouter(on_startup=[...]) never run.
- **Why it existed:** Regression from PR #14851: the local handler lists were assigned before super().__init__ instead of after it.
- **Fix:** Moves the self.on_startup/self.on_shutdown assignments in APIRouter.__init__ to after super().__init__() and the prefix assertions, so Starlette no longer wipes them.
- **Tests require:** FastAPI(on_startup=[...], on_shutdown=[...]) handlers actually run (in statement); APIRouter and nested include_router propagation (NOT in statement)
- **How to verify:** Statement repro: app built with FastAPI(on_startup=[...]) inside TestClient context, handler flag must flip; existing tests/test_router_events.py.
- **Most likely failure:** Agent may instead stop passing lifespan_context, reassign too early (before super returns), or move only on_startup leaving on_shutdown wiped; sub-router propagation must come from the same reorder, not include_router changes.
- **Gold footprint:** 1 file(s), +11/-10 lines: `fastapi/routing.py`; drivers: Starlette coupling

##### `fastapi_14953` - Fix bytes JSON schema to use contentMediaType instead of format binary

- **Class:** C1 Bug fix / OAS Schema / contract generation (secondary TYP) / R12 contract mismatch / route P5 Schema-contract / statement L2 / spec gap severe / difficulty 4
- **Root cause:** Pydantic's GenerateJsonSchema.bytes_schema still emitted the legacy OpenAPI 3.0 {"type": "string", "format": "binary"} for bytes, and _compat/v2.py re-exported that class unchanged (get_definitions builds its schema_generator from it); UploadFile.__get_pydantic_json_schema__ also hardcoded format "binary", so OpenAPI 3.1 output carried the deprecated keyword and no contentEncoding for base64 modes.
- **Why it existed:** Schema dates to the author's original Pydantic 1.x implementation; OpenAPI 3.1 realigned bytes with JSON Schema draft-07 but pydantic (until PR 12841) and FastAPI never followed.
- **Fix:** In _compat/v2.py subclass GenerateJsonSchema overriding bytes_schema to emit contentMediaType "application/octet-stream" plus contentEncoding "base64" when val/ser_json_bytes is base64; change UploadFile's __get_pydantic_json_schema__ to the same shape; add json_base64_bytes docs tutorial.
- **Tests require:** "contentMediaType": "application/octet-stream" for bytes and UploadFile schemas (in statement); "contentEncoding": "base64" for base64-configured models (NOT in statement); docs_src.json_base64_bytes.tutorial001_py310 app with /data and /data-in-out routes (NOT in statement).
- **How to verify:** Build a TestClient app with bytes fields, GET openapi.json and compare against the key/value quoted in the statement.
- **Most likely failure:** Only edits UploadFile's schema found by grepping "binary" while plain bytes fields still emit format:binary from pydantic's bytes_schema; tutorial module name and fixture data ("A plumbus", base64 payloads) are unguessable.
- **Gold footprint:** 4 file(s), +102/-2 lines: `docs_src/json_base64_bytes/tutorial001_py310.py`; `fastapi/_compat/v2.py`; `fastapi/datastructures.py`; `scripts/playwright/json_base64_bytes/image01.py`; drivers: tests compare exact strings, schema compared exactly, example files imported by tests, new file required, several files, new public name to guess; local grading blocked: inline_snapshot

##### `fastapi_14986` - Make root_path servers request-scoped and escape Swagger UI JSON

- **Class:** C1 Bug fix / RTG Routing and lifecycle (secondary OAS) / R09 state, identity, caching or hashing error / route P1 Prescribe / statement L2 / spec gap minor / difficulty 3
- **Root cause:** setup()'s openapi handler mutated shared app state per request via self.servers.insert(0, root_path), with server_urls captured once at setup, so an attacker-influenced root_path persisted into every later openapi.json; get_swagger_ui_html also embedded json.dumps output unescaped inside the <script> block.
- **Why it existed:** Legacy root_path-in-servers convenience from early versions; escaping skipped because Swagger inputs are developer-controlled; prompted by automated scanner security reports.
- **Fix:** The openapi handler builds the schema per request and prepends {"url": root_path} to a copy without touching self.servers; new _html_safe_json escapes <, >, & and replaces raw json.dumps for swagger_ui parameters and init_oauth.
- **Tests require:** root_path not persisted across requests and self.servers unmutated (in statement); literal \u003c/\u003e/\u0026 escapes in Swagger HTML (NOT in statement); normal init_oauth output preserved (in statement).
- **How to verify:** Two TestClient requests with different root_path values then a clean one, checking servers; render get_swagger_ui_html with "<" in oauth parameters.
- **Most likely failure:** Removes only the stale server_urls closure but still mutates self.servers, or uses html.escape instead of the \u003c-style JSON escapes the hidden tests grep for.
- **Gold footprint:** 2 file(s), +25/-9 lines: `fastapi/applications.py`; `fastapi/openapi/docs.py`; drivers: several files, tests compare exact strings

##### `fastapi_15763` - Empty leaf path with nested prefix must not raise

- **Class:** C1 Bug fix / RTG Routing and lifecycle / R04 regression from an earlier change / route P3 Title-hunt / statement L2 / spec gap minor / difficulty 3
- **Root cause:** The prefixless-include guard in include_router iterated _iter_included_route_candidates(router.routes) and read each raw candidate's .path. Post-refactor those candidates are leaf routes carrying their own paths, so a route defined with path '' but included with prefix '/items' was falsely flagged 'Prefix and path cannot be both empty'.
- **Why it existed:** Regression from the routes-tree refactor (fastapi_15745): the guard was rewritten over raw tree candidates instead of prefix-resolved effective paths.
- **Fix:** Iterate _iter_routes_with_context(router.routes) and take path/name from the effective context - the Starlette route when present, else route_context.path/name - so prefix-joined paths are validated.
- **Tests require:** leaf route '' included with prefix '/items' then prefixless include serves 200 at /items (in statement); FastAPIError still raised when effective path empty (NOT in statement); fastapi.exceptions.FastAPIError import (NOT in statement).
- **How to verify:** Repro from title: @router.get('') included with prefix '/items' into a parent, parent included prefixless into app; GET /items must return 200.
- **Most likely failure:** Dropping the genuine empty-effective-path check, or mishandling the starlette_route branch so plain Starlette child routes crash the guard with missing attributes.
- **Gold footprint:** 1 file(s), +10/-3 lines: `fastapi/routing.py`; drivers: terse statement

##### `fastapi_5077` - Resolve forward references of functools.wraps-wrapped functions using original globals

- **Class:** C1 Bug fix / TYP Type-annotation and model introspection (secondary DI) / R01 missing branch / unhandled input class / route P2 Repro-driven bugfix / statement L1 / spec gap none / difficulty 2
- **Root cause:** get_typed_signature and get_typed_return_annotation computed globalns from the call itself (getattr(call, "__globals__")); functools.wraps copies string annotations onto the wrapper, so forward refs are evaluated against the wrapper's module where the model is undefined, raising NameError.
- **Why it existed:** Edge case never covered: get_typed_signature never followed __wrapped__ the way typing.get_type_hints does before evaluating string annotations.
- **Fix:** Call inspect.unwrap(call) in get_typed_signature and get_typed_return_annotation and take __globals__ from the unwrapped function.
- **Tests require:** functools.wraps passthrough wrapper on endpoint callable (in statement); tests/forward_reference_type.py fixture forwardref_method with 'ForwardRefModel' (NOT in statement); double wrapping, {'x': 1} responses (NOT in statement)
- **How to verify:** Repro in statement: wrapped method with forward-ref annotation raises NameError at route registration; fix until registration succeeds.
- **Most likely failure:** Trying to change forward-ref evaluation itself instead of the globals source, or unwrapping only in get_typed_annotation and missing both signature functions.
- **Gold footprint:** 1 file(s), +4/-2 lines: `fastapi/dependencies/utils.py`

##### `fastapi_5624` - Stop parent security scopes leaking between sibling sub-dependencies

- **Class:** C1 Bug fix / SEC Security and auth (secondary DI) / R09 state, identity, caching or hashing error / route P3 Title-hunt / statement L4 / spec gap severe / difficulty 4
- **Root cause:** In get_dependant, use_security_scopes = security_scopes or [] aliases the caller's list, and .extend(param_details.depends.scopes) mutates that shared object in place, so each later sibling sub-dependency inherits every earlier sibling's scopes appended to the parent's.
- **Why it existed:** In-place extend on an aliased list since scopes existed; a parent with multiple sibling Security sub-dependencies each declaring own scopes was never covered.
- **Fix:** Replace extend with use_security_scopes = use_security_scopes + list(param_details.depends.scopes), building a fresh list per sub-dependency.
- **Tests require:** Security(security1, scopes=['scope1']) and Security(security2, scopes=['scope2']) sibling deps under one Security parent, SecurityScopes injection, exact {'dep1': ['scope3','scope1'], 'dep2': ['scope3','scope2']} (NOT in statement)
- **How to verify:** none
- **Most likely failure:** Redesigning scope aggregation instead of fixing list aliasing, or dropping the parent scope prefix that must still appear in each child's scopes.
- **Gold footprint:** 1 file(s), +3/-1 lines: `fastapi/dependencies/utils.py`; drivers: terse statement, tests compare exact strings

##### `fastapi_9425` - Treat stringified 'None' return annotation as None so 204 works

- **Class:** C1 Bug fix / TYP Type-annotation and model introspection (secondary SER) / R03 duplicated or parallel logic out of sync / route P1 Prescribe / statement L4 / spec gap none / difficulty 2
- **Root cause:** get_typed_annotation's string branch evaluates "None" to type(None) and returns it, while a literal -> None annotation stays None; the route therefore gets a NoneType response annotation instead of response_model None, so the 204 bodiless-response path breaks.
- **Why it existed:** Parallel evaluation path out of sync: the ForwardRef branch never mapped the evaluated NoneType back to None the way real None annotations flow.
- **Fix:** After evaluate_forwardref in get_typed_annotation, return None when the evaluated annotation is type(None).
- **Tests require:** route with return annotation "None" and status_code 204 (in statement); http.HTTPStatus.NO_CONTENT plus empty response body assertions (NOT in statement)
- **How to verify:** Inline repro from statement: GET route declared -> "None" with 204 must return that status with no content.
- **Most likely failure:** Comparing the annotation string to 'None' before evaluation instead of converting the evaluated type(None), or patching response-class code rather than get_typed_annotation.
- **Gold footprint:** 1 file(s), +2/-0 lines: `fastapi/dependencies/utils.py`

##### `fastapi_9555` - Detect dependency coroutine/generator kinds from the unwrapped call

- **Class:** C1 Bug fix / DI Dependency-injection machinery (secondary TYP) / R01 missing branch / unhandled input class / route P1 Prescribe / statement L1 / spec gap none / difficulty 2
- **Root cause:** Dependant.is_coroutine_callable, is_gen_callable and is_async_gen_callable inspect self.call directly; an lru_cache/functools.cache wrapper object is not a coroutine or generator function, so solve_dependencies treats the cached async dependency as sync and never awaits it.
- **Why it existed:** functools.cache-wrapped async dependencies were an unhandled input class: callable kind detection never dereferenced __wrapped__.
- **Fix:** Add a cached_property _unwrapped_call returning inspect.unwrap(self.call) on Dependant and use it in the three kind-detection cached properties.
- **Tests require:** Depends on functools.wraps-wrapped sync, async, generator and async-generator dependencies (in statement: wrapped dependencies); four routes returning True; test_class_dependency name (NOT in statement)
- **How to verify:** Repro in statement: @cache-wrapped async dependency gives 'coroutine' object has no attribute error; fix until it is awaited and returns the value.
- **Most likely failure:** Unwrapping in solve_dependencies or at call time instead of the Dependant cached properties, or forgetting the __call__/dunder_call branches for callable instances.
- **Gold footprint:** 1 file(s), +14/-8 lines: `fastapi/dependencies/models.py`


#### fastapi: New feature (11 tasks)

##### `fastapi_13713` - Add openapi_external_docs parameter emitting externalDocs in OpenAPI output

- **Class:** C2 New feature / OAS Schema / contract generation (secondary RTG) / R13 incomplete feature / route P4 Feature-synthesis / statement L2 / spec gap severe / difficulty 4
- **Root cause:** FastAPI.__init__ had no external-documentation option and openapi()/get_openapi never emitted the OpenAPI externalDocs root object; the capability had to hook into __init__ storage, the self.openapi() get_openapi call, and get_openapi's output assembly.
- **Why it existed:** OpenAPI externalDocs metadata was simply not implemented; the PR author flagged the omission as an oversight.
- **Fix:** Add openapi_external_docs param (default None) to FastAPI.__init__, store it, pass external_docs=self.openapi_external_docs to get_openapi, and emit output['externalDocs'] when set.
- **Tests require:** FastAPI(openapi_external_docs={'description','url'}) kwarg and 'externalDocs' root key (NOT in statement - statement says external_docs); tests/main.py app and tests/test_application.py full-schema assertion (NOT in statement)
- **How to verify:** tests/test_application.py's full openapi-schema assertion and statement's dict shape show the target; agent can extend its own app and inspect /openapi.json.
- **Most likely failure:** Naming the parameter external_docs exactly as the statement says; the graded kwarg is openapi_external_docs and the JSON key must be externalDocs via the OpenAPI model.
- **Gold footprint:** 2 file(s), +31/-0 lines: `fastapi/applications.py`; `fastapi/openapi/utils.py`; drivers: new public name to guess, tests compare exact strings

##### `fastapi_13920` - Unwrap PEP 695 TypeAliasType annotations in dependency parameter analysis

- **Class:** C2 New feature / TYP Type-annotation and model introspection (secondary DI) / R13 incomplete feature / route P3 Title-hunt / statement L3 / spec gap minor / difficulty 3
- **Root cause:** analyze_param in fastapi/dependencies/utils.py never unwrapped TypeAliasType instances: a PEP 695 alias wrapping Annotated[int, Depends(some_value)] failed the get_origin(use_annotation) is Annotated check, so the inner Depends was invisible and the alias was analyzed as a plain arbitrary type instead of a dependency.
- **Why it existed:** PEP 695 type-statement aliases are newer than FastAPI's annotation analysis; PR #11140 explored support and this follow-up uses typing-inspection's is_typealiastype helper.
- **Fix:** Import is_typealiastype from typing_inspection.typing_objects and, at the top of analyze_param, replace annotation with annotation.__value__ when it is a TypeAliasType, before the Annotated extraction.
- **Tests require:** Route parameter annotated with a TypeAliasType over Annotated[int, Depends(...)] must resolve the dependency and return "value: 123" (NOT in statement); TypeAliasType support (in statement)
- **How to verify:** Inline repro: define a TypeAliasType alias over Annotated[int, Depends(...)], mount the route, assert the dependency runs; no base test covers it.
- **Most likely failure:** Unpacks after the Annotated extraction (too late), checks typing.TypeAliasType instead of the typing_inspection helper, or mishandles the alias as a query parameter of arbitrary type instead of resolving the wrapped Depends.
- **Gold footprint:** 1 file(s), +4/-0 lines: `fastapi/dependencies/utils.py`; drivers: terse statement, Python version

##### `fastapi_14262` - Add scope parameter to Depends for early function-scope yield cleanup

- **Class:** C2 New feature / DI Dependency-injection machinery (secondary RTG) / R13 incomplete feature / route P4 Feature-synthesis / statement L2 / spec gap severe / difficulty 5
- **Root cause:** Pre-fix, get_request_handler and websocket_session open a single AsyncExitStack (fastapi_inner_astack) around endpoint call plus response send, and solve_generator enters every yield dependency on that one stack, so cleanup always runs after the response is sent; Depends has no scope field, Dependant.cache_key ignores scope, and no scope validation exists.
- **Why it existed:** New capability proposed in this PR: no pre-existing hook for exiting yield dependencies before the response is sent.
- **Fix:** Adds Depends(scope=...), Dependant.scope with computed_scope cached property, scope-aware cache_key, a second fastapi_function_astack entered only around the endpoint (HTTP and WebSocket) and closed before the response, scope-aware stack routing in solve_dependencies, DependencyScopeError validation, tutorial008e docs examples.
- **Tests require:** Depends(..., scope='function'\|'request') semantics (in statement); invalid scope must raise FastAPIError subclass (NOT in statement); docs_src.dependencies.tutorial008e/_an/_an_py39 example modules (NOT in statement); StreamingResponse and ContextVar repros (NOT in statement).
- **How to verify:** Statement describes semantics; verify with a yield dependency whose finally runs before the response body is sent.
- **Most likely failure:** Agent adds the parameter but keeps one exit stack (cleanup still after response), omits scope from cache_key so cached values collide, or skips the unguessable tutorial008e example files.
- **Gold footprint:** 10 file(s), +196/-70 lines: `docs_src/dependencies/tutorial008e.py`; `docs_src/dependencies/tutorial008e_an.py`; `docs_src/dependencies/tutorial008e_an_py39.py`; `fastapi/dependencies/models.py`; `fastapi/dependencies/utils.py`; `fastapi/exceptions.py` ...; drivers: several files, new file required, example files imported by tests, large patch, new public name to guess, tests compare exact strings

##### `fastapi_14306` - Append endpoint file, line, function and route to validation error messages

- **Class:** C2 New feature / DBG Developer-facing introspection (secondary RTG) / R13 incomplete feature / route P4 Feature-synthesis / statement L1 / spec gap minor / difficulty 4
- **Root cause:** ValidationException stored only self._errors with no __str__ (only ResponseValidationError defined one) and no endpoint identity; routing raised Request/Response/WebSocketRequestValidationError without any endpoint context. Feature must extract cached file/line/function from dependant.call and thread endpoint_ctx through serialize_response and every raise site, including websockets.
- **Why it existed:** Debuggability gap: validation errors never identified the failing endpoint; PR adds an id()-keyed per-function cache to keep overhead negligible.
- **Fix:** Adds EndpointContext TypedDict and endpoint_ctx kwargs to the three validation exceptions, a shared __str__ appending File/line/function and method+path lines, and _extract_endpoint_context (cached) in routing wired into request, response and websocket validation raises with root_path-aware paths.
- **Tests require:** Error text with function name, route path, File "..." line, 'Endpoint: GET /api/test' (in statement, via examples); Request/Response/WebSocketRequestValidationError classes (in statement); sub-app root_path prefix 'WS /sub/ws/' (NOT in statement); EndpointContext name (NOT in statement).
- **How to verify:** Use TestClient with an exception handler capturing the validation error; assert str contains the endpoint function and route as in statement examples.
- **Most likely failure:** Formatting matches examples but misses the websocket site, the sub-app root_path prefix, or the path-only fallback when inspection fails; also breaking the singular '1 validation error' wording.
- **Gold footprint:** 2 file(s), +121/-16 lines: `fastapi/exceptions.py`; `fastapi/routing.py`; drivers: several files, tests compare exact strings

##### `fastapi_14372` - Make Depends() and Security() results hashable for external tools

- **Class:** C2 New feature / OBJ Object protocol and duck typing (secondary DI) / R13 incomplete feature / route P1 Prescribe / statement L2 / spec gap minor / difficulty 2
- **Root cause:** Depends/Security are plain @dataclass(eq=True) instances, and eq=True without frozen sets __hash__ = None, so they are unhashable. analyze_param also mutates a shallow copy (depends.dependency = type_annotation), which a frozen dataclass forbids, so that mutation site must switch to dataclasses.replace.
- **Why it existed:** Workaround requested by external tools interacting with internals (PR #14320); the dataclasses were declared mutable with default eq, hence unhashable since introduction.
- **Fix:** Declare Depends and Security as @dataclass(frozen=True) so they gain value-based __hash__, and replace analyze_param's copy-then-mutate with dataclasses.replace(depends, dependency=type_annotation).
- **Tests require:** hash(Depends(dep)) equal for equal args, different for scope='function'; Security hashes (in statement: Depends(), Security()); tests/test_depends_hashable.py name (NOT in statement)
- **How to verify:** Inline: hash(Depends(f)) stable across instances and differs with different scope; run existing dependency tests to catch FrozenInstanceError.
- **Most likely failure:** Giving Depends an identity-based __hash__ (object.__hash__) so hash(d1)==hash(d2) fails; or freezing without fixing analyze_param, raising FrozenInstanceError on every request.
- **Gold footprint:** 2 file(s), +4/-3 lines: `fastapi/dependencies/utils.py`; `fastapi/params.py`

##### `fastapi_14605` - Add a FastAPIDeprecationWarning class and switch deprecated warnings to it

- **Class:** C2 New feature / CMP Compatibility shims (secondary VAL) / R13 incomplete feature / route P7 Mechanical-sweep / statement L3 / spec gap minor / difficulty 3
- **Root cause:** No FastAPI-specific warning category existed; every deprecation site (params.py and temp_pydantic_v1_params.py __init__s, get_dependant, APIRoute.__init__, generate_operation_id, generate_operation_id_for_path) emitted stdlib DeprecationWarning, which default filters suppress outside __main__, so users never saw deprecations. A UserWarning subclass had to hook into exceptions.py and every warnings.warn category.
- **Why it existed:** Deprecations were built on Python's DeprecationWarning, invisible by default for library users; Seth Larson's article on library deprecations prompted a dedicated subclass.
- **Fix:** Adds FastAPIDeprecationWarning(UserWarning) to fastapi/exceptions.py and swaps category=DeprecationWarning to FastAPIDeprecationWarning at all eight warn sites across seven modules; the two generate_operation_id warnings also move to keyword form.
- **Tests require:** FastAPIDeprecationWarning from fastapi.exceptions (in statement); pytest.warns match strings '`regex` has been deprecated' and '`example` has been deprecated' (NOT in statement)
- **How to verify:** Inline pytest.warns around Param(example=...) or regex= triggers; existing tests test_regex_deprecated_params.py and test_schema_extra_examples.py pin every warn site.
- **Most likely failure:** Agent creates the class but misses one of the many warn sites (temp_pydantic_v1_params.py, openapi/utils.py, utils.py) or keeps positional DeprecationWarning, failing pytest.warns in unrelated tutorial tests.
- **Gold footprint:** 7 file(s), +28/-16 lines: `fastapi/dependencies/utils.py`; `fastapi/exceptions.py`; `fastapi/openapi/utils.py`; `fastapi/params.py`; `fastapi/routing.py`; `fastapi/temp_pydantic_v1_params.py` ...; drivers: several files, tests compare exact strings, Pydantic v1/v2; local grading blocked: dirty_equals, inline_snapshot

##### `fastapi_15030` - Add Server-Sent Events support: EventSourceResponse, ServerSentEvent, tutorials

- **Class:** C2 New feature / SER Serialisation and streaming (secondary RTG) / R13 incomplete feature / route P10 Timeboxed-slice / statement L4 / spec gap severe / difficulty 5
- **Root cause:** No SSE capability existed: routing's generator streaming only emitted application/jsonl lines or raw chunks, fastapi/responses.py had no text/event-stream response class, OpenAPI generation had no SSE response mapping, and no fastapi/sse module existed.
- **Why it existed:** New feature shipped in 0.135.0, built alongside the existing JSONL generator-streaming machinery added earlier.
- **Fix:** Adds fastapi/sse.py (EventSourceResponse, ServerSentEvent model with data/raw_data/event/id/retry/comment, validators, format_sse_event, 15s idle keepalive ping), exports EventSourceResponse from fastapi.responses, SSE streaming branches in routing.py, text/event-stream OpenAPI mapping, five tutorial apps.
- **Tests require:** EventSourceResponse importable from fastapi.responses and fastapi.sse; ServerSentEvent(data/raw_data/event/id/retry/comment) with exclusivity/retry validators (NOT in statement); headers text/event-stream; charset=utf-8, no-cache, x-accel-buffering (NOT in statement); keepalive via _PING_INTERVAL (NOT in statement); docs_src.server_sent_events.tutorial001-005 (NOT in statement).
- **How to verify:** Manual SSE curl shows event-stream output, but no repo test or statement text pins the names, headers or wire format.
- **Most likely failure:** Any partial guess fails: the hidden tests pin the module path fastapi.sse, class/field names, exact response headers, wire format, validation errors and the 15-second idle keepalive - none derivable from the title.
- **Gold footprint:** 9 file(s), +525/-35 lines: `docs_src/server_sent_events/tutorial001_py310.py`; `docs_src/server_sent_events/tutorial002_py310.py`; `docs_src/server_sent_events/tutorial003_py310.py`; `docs_src/server_sent_events/tutorial004_py310.py`; `docs_src/server_sent_events/tutorial005_py310.py`; `fastapi/openapi/utils.py` ...; drivers: several files, new file required, example files imported by tests, large patch, terse statement, tests compare exact strings, schema compared exactly, new public name to guess, algorithmic; local grading blocked: inline_snapshot

##### `fastapi_15280` - Add app.vibe() decorator that raises an April Fools error

- **Class:** C2 New feature / RTG Routing and lifecycle / R13 incomplete feature / route P4 Feature-synthesis / statement L4 / spec gap severe / difficulty 5
- **Root cause:** FastAPI had no vibe() method at all; the accepted change adds a documented decorator (path, *, prompt) whose body unconditionally raises FastAPIError("Are you kidding me? Happy April Fool's") - the deliverable is the raising joke API itself, not a working route.
- **Why it existed:** April Fools 2026 gag (PR created 2026-04-01): a deliberately non-functional endpoint decorator shipped upstream as a joke.
- **Fix:** Adds FastAPI.vibe(path, *, prompt="") with Doc annotations, docstring and example, whose body raises fastapi.exceptions.FastAPIError("Are you kidding me? Happy April Fool's"); plus a docs_src/vibe tutorial.
- **Tests require:** app.vibe usable as a decorator (in statement); FastAPIError from fastapi.exceptions raised at decoration time (NOT in statement); message containing "Are you kidding me" (NOT in statement).
- **How to verify:** none - no repo test or statement hint suggests the method must raise, let alone with that exact gag text.
- **Most likely failure:** Implements a working LLM-backed or no-op route decorator; passing requires FastAPIError specifically, raised at decoration time, with the unguessable gag text "Are you kidding me".
- **Gold footprint:** 2 file(s), +71/-1 lines: `docs_src/vibe/tutorial001_py310.py`; `fastapi/applications.py`; drivers: new public name to guess, tests compare exact strings, terse statement

##### `fastapi_15785` - Add public iter_route_contexts for code that walked router.routes

- **Class:** C2 New feature / RTG Routing and lifecycle (secondary OAS) / R13 incomplete feature / route P4 Feature-synthesis / statement L2 / spec gap minor / difficulty 3
- **Root cause:** After the routes-tree refactor, external code (Jupyverse) iterating app.router.routes saw _IncludedRouter nodes with no supported way to resolve effective paths; only private _iter_routes_with_context existed. A public RouteContext wrapper, iter_route_contexts() in fastapi/routing.py, and openapi utils accepting contexts were absent.
- **Why it existed:** Follow-up to the include-context refactor (discussion 15782): the breaking change to router.routes needed a sanctioned iteration API for ecosystem users.
- **Fix:** Add frozen RouteContext dataclass (path/path_format/name/methods/endpoint properties plus __getattr__ delegation) and public iter_route_contexts(); retype get_openapi/get_fields_from_routes/webhooks to Sequence[BaseRoute \| RouteContext]; simplify _get_api_route_for_openapi.
- **Tests require:** iter_route_contexts (in statement); RouteContext class with original_route/path/path_format/methods/endpoint (NOT in statement); get_openapi routes/webhooks accepting contexts, HTTPBearer securitySchemes assertions (NOT in statement).
- **How to verify:** Inline: list(iter_route_contexts(router.routes)) over a prefixed include; assert context.path is prefix-joined; smoke-check get_openapi still renders.
- **Most likely failure:** Naming the wrapper differently (RouteInfo, RouteEntry) or yielding raw tuples; omitting __getattr__ delegation so attribute access in openapi/utils and the tests' property assertions fails.
- **Gold footprint:** 2 file(s), +66/-15 lines: `fastapi/openapi/utils.py`; `fastapi/routing.py`; drivers: new public name to guess, terse statement

##### `fastapi_15800` - Add app.frontend and router.frontend to serve static frontend builds as low-priority routes

- **Class:** C2 New feature / RTG Routing and lifecycle (secondary SER) / R13 incomplete feature / route P4 Feature-synthesis / statement L2 / spec gap severe / difficulty 5
- **Root cause:** No frontend capability existed: FastAPI/APIRouter lacked frontend(), and routing.py's matching machinery (routes, matches, _IncludedRouter effective candidates) had no low-priority tier, so a static directory could only be mounted as a normal-priority route that shadows API path operations. The feature had to add frontend route classes and a low-priority match pass tried only after normal routes fail.
- **Why it existed:** New capability for SPA-style frontend builds; FastAPI routing only supported normal-priority routes and static mounts.
- **Fix:** Adds frontend() to applications.py delegating to APIRouter.frontend; routing.py gains _FrontendRoute/_FrontendRouteGroup/_FrontendStaticFiles, fallback auto/index.html/404.html/None, accept-header navigation detection, segment-boundary and longest-prefix matching, path-traversal checks, and _match_low_priority integrated into the include-candidates machinery.
- **Tests require:** FastAPI.frontend, APIRouter.frontend, directory (in statement); fallback=auto\|index.html\|404.html\|None, check_dir (NOT in statement); docs_src/frontend/tutorial001-006_py310.py (NOT in statement); private low-priority route helpers (NOT in statement)
- **How to verify:** Inline TestClient repro: temp dist dir, app.frontend('/'), assert file served and API routes win. Fallback/accept-header nuances unverifiable.
- **Most likely failure:** Mounting StaticFiles at '/' as a normal route (shadowing API routes) instead of low-priority fallback matching; missing router-prefix propagation, accept-header negotiation, traversal guards, 405 and partial-match precedence.
- **Gold footprint:** 8 file(s), +649/-5 lines: `docs_src/frontend/tutorial001_py310.py`; `docs_src/frontend/tutorial002_py310.py`; `docs_src/frontend/tutorial003_py310.py`; `docs_src/frontend/tutorial004_py310.py`; `docs_src/frontend/tutorial005_py310.py`; `docs_src/frontend/tutorial006_py310.py` ...; drivers: several files, new file required, example files imported by tests, large patch, terse statement, tests compare exact strings, new public name to guess, algorithmic

##### `fastapi_9753` - Make functools.partial dependables work for every callable kind

- **Class:** C2 New feature / DI Dependency-injection machinery (secondary TYP) / R13 incomplete feature / route P4 Feature-synthesis / statement L2 / spec gap minor / difficulty 3
- **Root cause:** Dependant._unwrapped_call only ran inspect.unwrap; a functools.partial object carries no __wrapped__ and the real callable lives in its .func, so coroutine/generator detection misclassifies partial of async functions and callable-class instances.
- **Why it existed:** Partial support was simply absent when wrapped-callable handling was added; discussion #9744 reported inconsistent partial behavior across kinds.
- **Fix:** In _unwrapped_call, after inspect.unwrap, if the result is a functools.partial replace it with .func before returning.
- **Tests require:** partial() over plain, async, generator and async-generator functions plus callable-class instances and methods as dependencies (in statement: all combinations); tests/test_dependency_partial.py, Annotated (NOT in statement)
- **How to verify:** Write own app using partial(async_fn) and partial(callable_instance) as Depends; all routes must return 200.
- **Most likely failure:** Inspecting the partial object itself instead of .func, hooking in get_typed_signature rather than Dependant._unwrapped_call, or mishandling partial(callable_instance).
- **Gold footprint:** 1 file(s), +5/-2 lines: `fastapi/dependencies/models.py`


#### fastapi: Refactor (3 tasks)

##### `fastapi_14851` - Reimplement on_event and lifespan handling inside FastAPI for next Starlette

- **Class:** C3 Refactor / RTG Routing and lifecycle (secondary CMP) / R05 upstream dependency change / route P6 Compat-shim / statement L2 / spec gap minor / difficulty 4
- **Root cause:** APIRouter.__init__ delegated on_startup/on_shutdown/lifespan to Starlette's Router, and on_event relied on Starlette's add_event_handler, _DefaultLifespan and lifespan wrapping; the next Starlette (PR 3117) removes those internals. FastAPI lacked its own copies, so the patch vendors _AsyncLiftContextManager and _wrap_gen_lifespan_context, adds _DefaultLifespan plus _startup/_shutdown/add_event_handler on APIRouter, and builds lifespan_context itself (async- and sync-generator aware), passing only lifespan to super().__init__.
- **Why it existed:** Upcoming Starlette release drops _DefaultLifespan and on_startup/on_shutdown support (starlette#3117); FastAPI must own the deprecated on_event path until a better lifespan interface exists.
- **Fix:** Vendors Starlette's lifespan helpers into fastapi/routing.py, adds APIRouter._startup/_shutdown/add_event_handler, computes lifespan_context locally from on_startup/on_shutdown and generator lifespans, and passes only lifespan to super().__init__.
- **Tests require:** on_event('shutdown') with async handler and FastAPI(lifespan=sync/async generator) both working (on_event named in statement; generator-lifespan expectations NOT in statement)
- **How to verify:** Existing tests/test_router_events.py lifespan/on_event tests must keep passing; inline TestClient context manager asserts startup/shutdown flags.
- **Most likely failure:** Agent may import private Starlette symbols instead of vendoring, or break the _merge_lifespan_context interplay so include_router/on_event handlers stop running; distinguishing isasyncgenfunction from isgeneratorfunction is easy to get wrong.
- **Gold footprint:** 1 file(s), +153/-4 lines: `fastapi/routing.py`; drivers: Starlette coupling, large patch

##### `fastapi_14962` - Serialize JSON responses directly with Pydantic's Rust dump_json fast path

- **Class:** C3 Refactor / SER Serialisation and streaming (secondary RTG) / R14 design improvement / tech debt / route P4 Feature-synthesis / statement L4 / spec gap severe / difficulty 4
- **Root cause:** serialize_response always called field.serialize (pydantic dump_python(mode="json") producing an intermediate Python dict) and the request handler then handed that dict to the response class, whose render runs Python json.dumps; Pydantic's single-pass Rust dump_json was never used for response-model endpoints.
- **Why it existed:** Performance optimization, no defect: the PR deliberately adds a fast path for default-response-class routes on top of the response-model serialization rework.
- **Fix:** Adds ModelField.serialize_json (TypeAdapter.dump_json) in _compat/v2.py; serialize_response gains a dump_json flag choosing serialize_json vs serialize; the handler computes use_dump_json when response_field exists and response_class is a DefaultPlaceholder, returning plain Response(media_type="application/json"); tutorial010 switches to HTMLResponse.
- **Tests require:** Default-path responses must bypass starlette json.dumps; explicit response_class must still call it (NOT in statement); response bodies unchanged (in statement); docs_src.custom_response.tutorial010_py310 exact HTML text (NOT in statement).
- **How to verify:** Hit response-model endpoints and confirm identical JSON output; existing response-model repo tests keep passing; the speed-up itself is not observable.
- **Most likely failure:** Skips the DefaultPlaceholder check so custom response classes (JSONResponse, ORJSONResponse) lose their render semantics, or breaks exact-body assertions; tutorial010's replacement HTML string is unguessable.
- **Gold footprint:** 3 file(s), +49/-6 lines: `docs_src/custom_response/tutorial010_py310.py`; `fastapi/_compat/v2.py`; `fastapi/routing.py`; drivers: several files, example files imported by tests, tests compare exact strings; local grading blocked: inline_snapshot

##### `fastapi_15745` - Rework include_router to keep original APIRouter and APIRoute instances

- **Class:** C3 Refactor / RTG Routing and lifecycle (secondary OAS) / R14 design improvement / tech debt / route P10 Timeboxed-slice / statement L2 / spec gap severe / difficulty 5
- **Root cause:** include_router cloned every route: it looped for route in router.routes and rebuilt each APIRoute via add_api_route(prefix + route.path, ...) copying ~30 constructor args, so original APIRoute/APIRouter instances and include-time metadata were discarded, leaving one flat top-level route list; later additions to an included router never propagated.
- **Why it existed:** Include-by-copy design inherited from the original router implementation (superseded PR #4794); deliberate rearchitecture to unblock router-level customisation features.
- **Fix:** Append _IncludedRouter with _RouterIncludeContext instead of cloning; add _EffectiveRouteContext/_APIRouteLike proxies, _iter_routes_with_context, APIRouter.matches()/handle(), include-cycle guards, routes-version-keyed OpenAPI cache in applications.py; update openapi/utils and docs_src tutorial002.
- **Tests require:** Preserved APIRoute subclass instances, live route addition, OpenAPI cache refresh (in statement); APIRouter.matches()/handle() (in statement); AssertionError 'already includes this router', url_path_for on included routers, private _iter helpers (NOT in statement).
- **How to verify:** Repro from statement: include a router, then add a route to it and check it serves; isinstance checks on routes entries; existing test_custom_route_class.py.
- **Most likely failure:** Attempting a partial patch: without the full context-tree and matching fallbacks, existing routing/OpenAPI tests break; the 5-minute budget yields an unimportable half-wired tree. Slice minimal and submit early.
- **Gold footprint:** 4 file(s), +939/-291 lines: `docs_src/path_operation_advanced_configuration/tutorial002_py310.py`; `fastapi/applications.py`; `fastapi/openapi/utils.py`; `fastapi/routing.py`; drivers: several files, new file required, large patch, algorithmic, new public name to guess, tests compare exact strings; local grading blocked: inline_snapshot


#### fastapi: Behaviour change (10 tasks)

##### `fastapi_13786` - Return 401 with WWW-Authenticate when credentials missing; add not_authenticated_status_code escape hatch

- **Class:** C4 Behaviour change / SEC Security and auth / R12 contract mismatch / route P1 Prescribe / statement L2 / spec gap severe / difficulty 4
- **Root cause:** APIKeyBase.check_api_key and the __call__ branches of HTTPBase, HTTPBearer, HTTPDigest and OpenIdConnect raised HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Not authenticated") with no WWW-Authenticate header when auto_error held and credentials were absent, diverging from RFC 7617/7616/6750 and from HTTPBasic/OAuth2, which already returned 401 with WWW-Authenticate.
- **Why it existed:** Long-standing non-standard defaults (issue #10177 and older PRs); this PR finally aligns all schemes with the RFCs, adding a temporary not_authenticated_status_code parameter so clients relying on 403 keep working.
- **Fix:** Adds an overridable make_not_authenticated_error() (401 + WWW-Authenticate) to each security class, a not_authenticated_status_code init option, WWW-Authenticate headers on APIKey and HTTPBase errors, stub Digest/Bearer headers, and updated docs examples.
- **Tests require:** 401 status (in statement); WWW-Authenticate == "APIKey"/"Bearer"/scheme string like "Other" (NOT in statement); {"detail": "Not authenticated"} (in statement); not_authenticated_status_code fallback (in statement)
- **How to verify:** Repro from statement per scheme; existing tests/test_security_api_key_*.py and test_security_http_*.py currently pin 403 and flip to 401.
- **Most likely failure:** Implements the WWW-Authenticate format the statement describes (ApiKey in=..., name=...) instead of the bare values tests assert ("APIKey", scheme string); or misses HTTPDigest/OpenIdConnect files or the OAuth2 refactor to make_not_authenticated_error.
- **Gold footprint:** 11 file(s), +176/-83 lines: `docs_src/authentication_error_status_code/tutorial001_an.py`; `docs_src/authentication_error_status_code/tutorial001_an_py39.py`; `docs_src/security/tutorial003.py`; `docs_src/security/tutorial003_an.py`; `docs_src/security/tutorial003_an_py310.py`; `docs_src/security/tutorial003_an_py39.py` ...; drivers: several files, tests compare exact strings

##### `fastapi_14258` - Raise a clear error when a router includes itself

- **Class:** C4 Behaviour change / RTG Routing and lifecycle / R10 error-handling gap / route P3 Title-hunt / statement L2 / spec gap severe / difficulty 4
- **Root cause:** APIRouter.include_router had no self-reference guard: router.include_router(router) iterates router.routes while add_api_route appends new copies to the same list, so inclusion runs away instead of failing with a clear message.
- **Why it existed:** Guard was proposed earlier (discussion #11424, PR #11425 lost when its fork closed) and re-landed after discussion #14251.
- **Fix:** Adds `assert self is not router` with the message "Cannot include the same APIRouter instance into itself. Did you mean to include a different router?" at the top of include_router, before the prefix checks.
- **Tests require:** AssertionError matching exactly "Cannot include the same APIRouter instance into itself. Did you mean to include a different router?" on router.include_router(router) (NOT in statement)
- **How to verify:** Inline repro router.include_router(router) must fail fast with a clear error; no existing base test covers it.
- **Most likely failure:** Places the guard correctly but words the message differently — the hidden test regex-matches the exact two-sentence string, so any paraphrase fails.
- **Gold footprint:** 1 file(s), +4/-0 lines: `fastapi/routing.py`; drivers: tests compare exact strings, terse statement

##### `fastapi_14479` - Add clear assertion message for unsupported query parameter type annotations

- **Class:** C4 Behaviour change / VAL Request / validation parameter handling (secondary TYP) / R10 error-handling gap / route P2 Repro-driven bugfix / statement L1 / spec gap minor / difficulty 2
- **Root cause:** In analyze_param's Query branch, the is_scalar_field/is_scalar_sequence_field assertion carries no message, so unsupported query-param annotations (e.g. str\|dict via BeforeValidator) crash route construction with a bare AssertionError naming neither parameter nor cause.
- **Why it existed:** PR #12942 (statement-linked) tightened query-param type checks into a bare assertion; the unhelpful crash was reported after upgrading to 0.181.2.
- **Fix:** Append the message f"Query parameter {param_name!r} must be one of the supported types" to that assert, mirroring the path-param branch's existing message.
- **Tests require:** pytest.raises(AssertionError, match="Query parameter 'q' must be one of the supported types") across tests/test_invalid_sequence_param.py cases (NOT exactly in statement; statement wording differs).
- **How to verify:** Statement gives before/after stacktraces; existing tests/test_invalid_sequence_param.py exercises the same assert.
- **Most likely failure:** Copying the statement's wording ('Query param ... of one of the supported types'); the matched message is 'Query parameter ... must be one of the supported types'.
- **Gold footprint:** 1 file(s), +1/-1 lines: `fastapi/dependencies/utils.py`; drivers: tests compare exact strings

##### `fastapi_14583` - Emit deprecation warnings when pydantic.v1 models or response models are used

- **Class:** C4 Behaviour change / CMP Compatibility shims (secondary RTG) / R13 incomplete feature / route P3 Title-hunt / statement L4 / spec gap severe / difficulty 4
- **Root cause:** No deprecation signalling existed for pydantic.v1: get_dependant silently created may_v1.ModelField parameter fields and APIRoute.__init__ silently created response fields from pydantic.v1 response_model/responses models; the warning capability had to hook into those construction points.
- **Why it existed:** Deliberate upstream design change: FastAPI is preparing to drop pydantic.v1 support; warnings precede removal at both construction entry points.
- **Fix:** In get_dependant, warn when param_details.field is a may_v1.ModelField; in APIRoute.__init__, warn for response_model and each responses={} model via annotation_is_pydantic_v1, with fixed DeprecationWarning messages and stacklevel 4-5.
- **Tests require:** DeprecationWarning matching 'pydantic.v1 is deprecated and will soon stop being supported by FastAPI.' at param, return-type, response_model and additional-responses sites; tests import fastapi._compat.v1 BaseModel (NOT in statement).
- **How to verify:** Wrap app construction in warnings.catch_warnings with a pydantic.v1 model; confirm DeprecationWarning fires; rerun existing test_pydantic_v1_v2* files.
- **Most likely failure:** Different wording than the expected message, warning per-request instead of at route setup, or missing the responses={} additional-status-code branch.
- **Gold footprint:** 2 file(s), +24/-0 lines: `fastapi/dependencies/utils.py`; `fastapi/routing.py`; drivers: terse statement, tests compare exact strings, several files, Pydantic v1/v2; local grading blocked: inline_snapshot

##### `fastapi_14609` - Remove all pydantic.v1 support and raise a dedicated error

- **Class:** C4 Behaviour change / CMP Compatibility shims (secondary TYP) / R15 dependency / compatibility / tooling drift / route P10 Timeboxed-slice / statement L4 / spec gap severe / difficulty 5
- **Root cause:** Pre-fix code keeps a parallel pydantic.v1 stack (_compat/main.py, may_v1.py, v1.py, model_field.py, temp_pydantic_v1_params.py, create_cloned_field) selected via annotation_is_pydantic_v1 checks that only warn. The patch deletes that stack and hooks hard failures: new is_pydantic_v1_model_class/instance helpers raise PydanticV1NotSupportedError at param, response-model and encoder entry points.
- **Why it existed:** Deliberate removal following the pydantic.v1 deprecation-warning release; upstream v1 is legacy and the dual-path _compat layer was tech debt.
- **Fix:** Deletes the v1 compat modules and 718-line temp_pydantic_v1_params.py, collapses _compat/__init__ to v2-only exports, inlines v2 helpers, and adds PydanticV1NotSupportedError raised where v1 models are detected; pv1 docs_src examples removed.
- **Tests require:** PydanticV1NotSupportedError from fastapi.exceptions (NOT in statement); pydantic.v1 model usage raising it (in statement, 'an error is raised'); jsonable_encoder datetime custom_encoder behaviour (NOT in statement)
- **How to verify:** Statement repro (build app with a pydantic.v1 model) can be run, but the expected error class and its name are not derivable from the statement.
- **Most likely failure:** A 26-file deletion cannot be reproduced reliably in budget; agent likely leaves dangling imports in _compat/__init__ or misses create_cloned_field/_CLONED_TYPES_CACHE and breaks collection, or invents a differently-named error class.
- **Gold footprint:** 20 file(s), +192/-1855 lines: `docs_src/request_form_models/tutorial002_pv1_an_py39.py`; `docs_src/request_form_models/tutorial002_pv1_py39.py`; `fastapi/_compat/__init__.py`; `fastapi/_compat/main.py`; `fastapi/_compat/may_v1.py`; `fastapi/_compat/model_field.py` ...; drivers: removal, several files, large patch, Pydantic v1/v2, new public name to guess; local grading blocked: inline_snapshot

##### `fastapi_14791` - Add input and ctx fields to OpenAPI ValidationError schema

- **Class:** C4 Behaviour change / OAS Schema / contract generation (secondary SER) / R03 duplicated or parallel logic out of sync / route P5 Schema-contract / statement L2 / spec gap minor / difficulty 2
- **Root cause:** validation_error_definition, the hand-written schema dict at module level in fastapi/openapi/utils.py, still listed only loc/msg/type from the Pydantic v1 era; Pydantic V2 error entries also carry input and ctx, so the generated 422 schema misdescribed the responses clients actually receive.
- **Why it existed:** The constant was never updated during the Pydantic v1-to-v2 migration (related to issue #10787).
- **Fix:** Adds 'input': {'title': 'Input'} and 'ctx': {'title': 'Context', 'type': 'object'} to validation_error_definition properties; required keys stay ['loc', 'msg', 'type'].
- **Tests require:** OpenAPI ValidationError properties 'input' and 'ctx' (in statement); exact fragments {'title': 'Input'} and {'title': 'Context', 'type': 'object'} across ~30 snapshot files (NOT in statement)
- **How to verify:** GET /openapi.json on any app with a validation error and inspect components.schemas.ValidationError; existing openapi snapshot tests fail pre-fix.
- **Most likely failure:** Agent may add the fields to validation_error_response_definition instead, use different titles/types, or list input/ctx as required, breaking dozens of snapshot assertions.
- **Gold footprint:** 1 file(s), +2/-0 lines: `fastapi/openapi/utils.py`; drivers: schema compared exactly, tests compare exact strings

##### `fastapi_14964` - Deprecate ORJSONResponse and UJSONResponse with FastAPIDeprecationWarning

- **Class:** C4 Behaviour change / SER Serialisation and streaming (secondary CMP) / R14 design improvement / tech debt / route P1 Prescribe / statement L2 / spec gap minor / difficulty 2
- **Root cause:** fastapi/responses.py defined ORJSONResponse and UJSONResponse without any deprecation marker; after PR 14962's Pydantic dump_json fast path they no longer outperform the default, so users needed a warning steering them away plus clearer manual-install requirements for orjson/ujson.
- **Why it existed:** Deliberate design change following the 14962 fast-path serialization; the statement also drops ujson/orjson from the "fastapi[all]" extra.
- **Fix:** Decorate both classes with typing_extensions.deprecated(..., category=FastAPIDeprecationWarning, stacklevel=2) using "X is deprecated..." messages, keep render() behaviour, and expand docstrings to explain deprecation and manual installation.
- **Tests require:** ORJSONResponse, UJSONResponse (in statement); FastAPIDeprecationWarning importable from fastapi.exceptions (NOT in statement); warning text "ORJSONResponse is deprecated"/"UJSONResponse is deprecated" (NOT in statement); responses still render correct JSON.
- **How to verify:** Instantiate each class under warnings.catch_warnings and confirm a warning fires; existing orjson/ujson response tests must keep passing.
- **Most likely failure:** Uses the default DeprecationWarning category or invents a new warning class instead of the existing FastAPIDeprecationWarning in fastapi.exceptions that the hidden tests match on.
- **Gold footprint:** 1 file(s), +44/-8 lines: `fastapi/responses.py`; drivers: tests compare exact strings, terse statement; local grading blocked: inline_snapshot

##### `fastapi_14978` - Reject JSON bodies sent without Content-Type unless strict_content_type=False

- **Class:** C4 Behaviour change / SEC Security and auth (secondary VAL) / R01 missing branch / unhandled input class / route P4 Feature-synthesis / statement L4 / spec gap severe / difficulty 4
- **Root cause:** In get_request_handler's body branch, "if not content_type_value: json_body = await request.json()" parsed every body lacking a Content-Type header as JSON, enabling CSRF-style requests that skip CORS preflight; no switch existed to enforce header presence.
- **Why it existed:** Deliberate security hardening (CSRF against localhost apps): strict checking becomes the default with strict_content_type=False as the opt-out.
- **Fix:** Adds strict_content_type (Default(True)) to FastAPI.__init__, APIRouter, APIRoute and get_request_handler, resolved via get_value_or_default; the no-content-type branch parses JSON only when strict is False; strict_content_type docs example added.
- **Tests require:** strict_content_type on FastAPI/APIRouter/APIRoute with app-router-route inheritance (name in statement); default 422 for bodies without Content-Type (NOT in statement); docs_src.strict_content_type.tutorial001_py310 (NOT in statement); text/plain with header still 422 (NOT in statement).
- **How to verify:** POST JSON without a Content-Type header via TestClient: expect 422 by default and 200 with strict_content_type=False; visible tests posting headerless JSON break.
- **Most likely failure:** Adds the flag but skips DefaultPlaceholder/get_value_or_default plumbing so router- and app-level overrides never reach get_request_handler, or fails the nested include_router precedence cases.
- **Gold footprint:** 3 file(s), +81/-1 lines: `docs_src/strict_content_type/tutorial001_py310.py`; `fastapi/applications.py`; `fastapi/routing.py`; drivers: several files, terse statement, new public name to guess, new file required, example files imported by tests

##### `fastapi_15588` - Reject multi-line SSE event and id fields

- **Class:** C4 Behaviour change / SER Serialisation and streaming (secondary TYP) / R10 error-handling gap / route P1 Prescribe / statement L2 / spec gap minor / difficulty 2
- **Root cause:** ServerSentEvent's only validator, _check_id_no_null, checked id solely for null bytes; event had no validator at all. Multi-line event/id values passed through unchecked into serialized SSE frames, corrupting the event-stream wire format for clients.
- **Why it existed:** Hardening gap never covered; maintainer states prior code was not a bug - a deliberate stricter-enforcement quality-of-life change prompted by repeated user reports.
- **Fix:** Replace _check_id_no_null with _check_single_line(v, field_name) helpers; wire AfterValidator(_check_event_single_line) on event and AfterValidator(_check_id_valid) on id, raising ValueError; update Doc strings.
- **Tests require:** ServerSentEvent event/id fields reject \n, \r, \r\n with ValueError 'SSE <field> must be a single line' (NOT in statement); field names event, id (in statement); existing null-id test intact.
- **How to verify:** Inline: ServerSentEvent(data='x', id='a\nb') must raise ValueError; existing tests/test_sse.py null-id test shows the message convention.
- **Most likely failure:** Validating at stream-serialization time in EventSourceResponse instead of via pydantic AfterValidators on the model, or raising an exception type pytest.raises(ValueError) will not catch; forgetting \r and \r\n variants.
- **Gold footprint:** 1 file(s), +18/-5 lines: `fastapi/sse.py`; drivers: tests compare exact strings

##### `fastapi_15589` - Ignore raw underscore header names when convert_underscores is on

- **Class:** C4 Behaviour change / VAL Request / validation parameter handling / R02 wrong assumption about data shape or type / route P3 Title-hunt / statement L2 / spec gap minor / difficulty 3
- **Root cause:** In request_params_to_args, header model fields with convert_underscores=True added only the hyphenated alias to processed_keys, so the raw underscore header name survived the extras diff and was fed to the model as an extra field instead of being ignored.
- **Why it existed:** convert_underscores rewrote only the lookup alias; the extras-collection pass assumed received keys equal processed keys - untested until header models with extra='allow'.
- **Fix:** Also processed_keys.add(get_validation_alias(field)) so both the converted header name and the original underscore alias are marked processed; underscore-only headers then yield a missing-field 422.
- **Tests require:** Hyphenated header preferred 200, underscore-only 422 with loc ['header','x_user_id'] (behaviour in statement); AuthHeaders Header() model on extra='allow' route and endpoint paths (NOT in statement).
- **How to verify:** Repro: Header() model route receiving only x_user_id header returns 200 pre-fix; expected 422 post-change; existing test_query_cookie_header_model_extra_params.py shows conventions.
- **Most likely failure:** Rejecting underscore headers outright with a new error instead of just marking the original alias processed; breaking query/cookie params that share request_params_to_args.
- **Gold footprint:** 1 file(s), +4/-0 lines: `fastapi/dependencies/utils.py`


#### fastapi: Documentation (3 tasks)

##### `fastapi_14487` - Rework docs error-handling example to re-raise validation errors without leaking raw strings

- **Class:** C5 Documentation / EXM Documentation examples / R16 documentation error / route P8 Docs-example / statement L4 / spec gap severe / difficulty 3
- **Root cause:** docs_src/handling_errors/tutorial004.py's validation_exception_handler returned PlainTextResponse(str(exc)), embedding the raw RequestValidationError repr (including submitted input values) in the response body; the docs taught leaking internals, and the hidden tutorial tests import this example file.
- **Why it existed:** Docs example deliberately echoed str(exc) for brevity; upstream hardened it against leaking validation input details.
- **Fix:** Rewrite the handler to compose 'Validation errors:' plus one 'Field: {loc}, Error: {msg}' line per exc.errors() entry, returning PlainTextResponse(message, status_code=400).
- **Tests require:** Hidden test_tutorial004.py imports docs_src/handling_errors/tutorial004.py; response text must contain 'Validation errors:' and "Field: ('path', 'item_id')" (NOT in statement).
- **How to verify:** Existing tests/test_tutorial/test_handling_errors/test_tutorial004.py drives the app; run it and inspect the 400 response text.
- **Most likely failure:** Keeping str(exc) or inventing a different layout; exact strings 'Validation errors:' and 'Field: (...)' are unguessable from the terse title.
- **Gold footprint:** 1 file(s), +5/-2 lines: `docs_src/handling_errors/tutorial004.py`; drivers: example files imported by tests, tests compare exact strings, terse statement

##### `fastapi_14492` - Correct docs metadata example license identifier to Apache-2.0

- **Class:** C5 Documentation / EXM Documentation examples / R16 documentation error / route P8 Docs-example / statement L4 / spec gap none / difficulty 1
- **Root cause:** docs_src/metadata/tutorial001_1_py39.py sets license_info identifier to 'MIT' while the name is 'Apache 2.0'; the wrong SPDX identifier propagates into the generated OpenAPI info.license that tutorial tests assert.
- **Why it existed:** Example authored with a mismatched SPDX identifier (MIT text under Apache 2.0 name); plain docs content error.
- **Fix:** Change the example's license_info identifier string from 'MIT' to 'Apache-2.0'.
- **Tests require:** docs_src/metadata/tutorial001_1_py39.py imported by tests/test_tutorial/test_metadata/test_tutorial001_1.py; openapi license.identifier == 'Apache-2.0' (in statement).
- **How to verify:** Import the example, GET /openapi.json, assert license.identifier == 'Apache-2.0'.
- **Most likely failure:** Editing docs prose or other tutorials' license_info instead of the one docs_src example; grep docs_src for '"identifier": "MIT"' finds it.
- **Gold footprint:** 1 file(s), +1/-1 lines: `docs_src/metadata/tutorial001_1_py39.py`; drivers: example files imported by tests, tests compare exact strings

##### `fastapi_15023` - Docs example: close image file in streams, add yield-from variant

- **Class:** C5 Documentation / EXM Documentation examples / R16 documentation error / route P8 Docs-example / statement L4 / spec gap severe / difficulty 4
- **Root cause:** docs_src/stream_data/tutorial002_py310.py iterated read_image() (a fresh BytesIO per call) in every endpoint without closing it and demonstrated no yield-from form for sync generators; the docs example lagged the new generator-streaming support.
- **Why it existed:** Docs follow-up to the new stream-with-yield support; a style/correctness refresh of the example, not a library defect.
- **Fix:** Wraps read_image() in with-blocks in all five endpoints and adds a stream_image_no_async_yield_from endpoint using `yield from image_file` under the same PNGStreamingResponse response_class.
- **Tests require:** /image/stream-no-async-yield-from route and stream_image_no_async_yield_from handler in docs_src.stream_data.tutorial002_py310 plus its OpenAPI snapshot entry (NOT in statement); image/png streaming responses (in statement).
- **How to verify:** Existing tests/test_tutorial/test_stream_data/test_tutorial002.py keeps passing after the with-block refactor; the new route has no visible oracle.
- **Most likely failure:** Applies the with-block refactor but never invents the exact new route name /image/stream-no-async-yield-from that the hidden parametrize and OpenAPI snapshot require.
- **Gold footprint:** 1 file(s), +18/-8 lines: `docs_src/stream_data/tutorial002_py310.py`; drivers: example files imported by tests, terse statement, schema compared exactly, tests compare exact strings


#### fastapi: Build / tooling (2 tasks)

##### `fastapi_14077` - Use literal 422 instead of deprecated Starlette status constant

- **Class:** C6 Build / tooling / CMP Compatibility shims / R15 dependency / compatibility / tooling drift / route P1 Prescribe / statement L2 / spec gap none / difficulty 2
- **Root cause:** fastapi/exception_handlers.py imported starlette.status.HTTP_422_UNPROCESSABLE_ENTITY for request_validation_exception_handler and fastapi/openapi/utils.py used it for the http422 responses key; Starlette 0.48 deprecates that name (renamed HTTP_422_UNPROCESSABLE_CONTENT per RFC 9110), so FastAPI emits deprecation warnings within its supported range.
- **Why it existed:** Upstream Starlette 0.48 renamed and deprecated the 422 constant following RFC 9110; FastAPI needs warning-free compatibility across its Starlette version range.
- **Fix:** Replace the constant with the literal 422 in request_validation_exception_handler and with the string "422" for http422 in get_openapi_path, dropping both imports; docs example tutorial005 uses status_code=422.
- **Tests require:** Validation errors still answer status 422 and OpenAPI keeps the "422" response key, using the literal value (in statement)
- **How to verify:** Grep the tree for HTTP_422_UNPROCESSABLE_ENTITY; existing validation-error and OpenAPI tests pass with the literal 422.
- **Most likely failure:** Switches to the new HTTP_422_UNPROCESSABLE_CONTENT name (still breaks Starlette <0.48) or forgets the OpenAPI http422 string and the docs example, leaving a deprecated import behind.
- **Gold footprint:** 3 file(s), +5/-6 lines: `docs_src/handling_errors/tutorial005.py`; `fastapi/exception_handlers.py`; `fastapi/openapi/utils.py`; drivers: several files, Starlette coupling

##### `fastapi_15661` - Add a script automating release version bump and notes

- **Class:** C6 Build / tooling / BLD Build, release and tooling / R15 dependency / compatibility / tooling drift / route P9 Build-tooling / statement L2 / spec gap severe / difficulty 5
- **Root cause:** No release-prep tooling existed: bumping __version__ and inserting the dated ## X.Y.Z heading into release-notes.md were manual edits (only add_latest_release_date.py dated the newest section). A new scripts/prepare_release.py typer CLI had to be created from scratch.
- **Why it existed:** Deliberate tooling investment modelled on asyncer PR #608 to automate repetitive release steps; no in-repo defect.
- **Fix:** Add scripts/prepare_release.py: typer commands prepare/current_version/release_notes; regex version bump with monotonicity check; heading insertion under '## Latest Changes'; section extraction; env-var-configurable options.
- **Tests require:** scripts.prepare_release module with bump_version, update_version_file, update_release_notes, get_release_notes_body, typer app (NOT in statement); output 'Prepared release X.Y.Z (date)', env vars PREPARE_RELEASE_*, RuntimeError messages (NOT in statement).
- **How to verify:** Essentially none; an agent can only self-test a script it writes - expected function names, messages and outputs are unguessable.
- **Most likely failure:** Building a differently-shaped CLI (argparse, other helper names, other messages); hidden tests import exact internals like bump_version and match RuntimeError text, so plausible implementations still fail.
- **Gold footprint:** 1 file(s), +216/-0 lines: `scripts/prepare_release.py`; drivers: new file required, terse statement, tests compare exact strings, new public name to guess


### 9.2 rich (48 tasks)

#### rich: Bug fix (39 tasks)

##### `rich_2725` - Render mid box glyphs mid-table and footer glyphs in the footer

- **Class:** C1 Bug fix / REN Widget rendering and styling / R07 algorithmic flaw (loop, ordering, non-termination) / route P2 Repro-driven bugfix / statement L2 / spec gap none / difficulty 2
- **Root cause:** Table._render builds box_segments in the order [head, foot, mid] but indexes it 0=header row, 1=body rows, last=footer row; body rows therefore drew foot glyphs and the footer row drew mid glyphs, so mid and footer were swapped.
- **Why it existed:** Tuple order in the box_segments list never matched its row-position indexing convention; authoring slip, ordering untested.
- **Fix:** Move the mid tuple before the foot tuple in box_segments so index 1 yields mid glyphs and the last index yields foot glyphs.
- **Tests require:** tests/test_table.py test_placement_table_box_elements; Table with show_header/show_footer and digit Box glyphs; exact dedent output ordering mid-before-foot (in statement); test name and cases (NOT in statement).
- **How to verify:** Reproduce the statement's numbered-glyph box table in a script and compare printed output to the given expected block.
- **Most likely failure:** Reordering the wrong tuples (e.g. head/mid) or editing per-row yield sites instead of box_segments; eyeballing output instead of exact comparison.
- **Gold footprint:** 1 file(s), +5/-5 lines: `rich/table.py`; drivers: tests compare exact strings

##### `rich_2943` - clear_meta_and_links keeps stale cached hash on the returned style copy

- **Class:** C1 Bug fix / OBJ Object protocol and duck typing / R09 state, identity, caching or hashing error / route P1 Prescribe / statement L2 / spec gap minor / difficulty 2
- **Root cause:** clear_meta_and_links builds a clone and copies self._hash (style.py) even though meta/link feed that hash; Style.__hash__ caches into _hash, so the cleared copy keeps the original's stale hash value.
- **Why it existed:** Style.__hash__ caches into _hash; the clone in clear_meta_and_links inherited the cached value without invalidation - stale-cache edge case.
- **Fix:** In clear_meta_and_links set style._hash = None instead of copying self._hash.
- **Tests require:** Style.parse('bold red on black link ...') plus Style.on(click=...); hash() caching; clear_meta_and_links (in statement); _hash attribute and assert clear_style._hash is None (NOT in statement).
- **How to verify:** Inline: hash a linked style, call clear_meta_and_links, confirm the copy's hash is recomputed; tests/test_style.py has test_clear_meta_and_links.
- **Most likely failure:** Setting self._hash = None on the original instead of the returned copy, or not realizing hash() must be called first to populate the cache.
- **Gold footprint:** 1 file(s), +1/-1 lines: `rich/style.py`

##### `rich_3006` - Custom __eq__ default equal to Parameter.empty breaks auto rich repr

- **Class:** C1 Bug fix / DBG Developer-facing introspection (secondary OBJ) / R02 wrong assumption about data shape or type / route P3 Title-hunt / statement L2 / spec gap minor / difficulty 2
- **Root cause:** auto_rich_repr tests the expression param.default == param.empty, invoking the default object's __eq__; a default whose __eq__ returns True against Parameter.empty is treated as missing, so repr omits name/default and yields the bare attribute.
- **Why it existed:** Edge case never covered: rich.repr.auto assumed no default object defines equality against inspect.Parameter.empty.
- **Fix:** Change the check to identity: use `if param.default is param.empty:` in auto_rich_repr.
- **Tests require:** rich.repr.auto class Bird with StupidClass/NotStupid defaults; repr output equals f-string of the objects' reprs (behaviour in statement; fixture class names and test_rich_repr_auto additions NOT in statement).
- **How to verify:** Inline: give a class a default whose __eq__ returns True for Parameter.empty and confirm repr keeps name=default; issue #2875 sample pattern.
- **Most likely failure:** Grepping the statement's 'Parameters.empty' wording matches nothing - the real identifier is Parameter.empty; also inverting the branch or editing auto_repr instead.
- **Gold footprint:** 1 file(s), +1/-1 lines: `rich/repr.py`

##### `rich_3043` - Move misplaced html tag so exported HTML document structure is valid

- **Class:** C1 Bug fix / CON Console / terminal I/O / R12 contract mismatch / route P3 Title-hunt / statement L2 / spec gap minor / difficulty 2
- **Root cause:** CONSOLE_HTML_FORMAT in rich/_export_format.py places the opening <html> tag after </head>, so export_html emits a document whose head and style block lie outside the html element - structurally invalid HTML.
- **Why it existed:** Authoring slip in the static template; existing tests baked in the wrong expected structure.
- **Fix:** Insert <html> directly after <!DOCTYPE html> and remove the stray <html> between </head> and <body> in CONSOLE_HTML_FORMAT.
- **Tests require:** Three tests/test_console.py expected strings updated to start with DOCTYPE, html, head in that order, compared exactly (required structure inferable from file; exact expected literals NOT in statement).
- **How to verify:** Read rich/_export_format.py - the misplaced <html> is directly visible; check output starts DOCTYPE then <html> then <head>.
- **Most likely failure:** Choosing a different valid restructure (wrapping everything in <html>, dropping </head>, normalizing whitespace) instead of the minimal two-line move the exact-string tests expect.
- **Gold footprint:** 1 file(s), +1/-1 lines: `rich/_export_format.py`; drivers: terse statement, tests compare exact strings

##### `rich_3063` - escape() leaves a lone trailing backslash undoubled, breaking markup round-trip

- **Class:** C1 Bug fix / PAR Markup / Markdown / syntax parsing / R06 boundary / empty-input / off-by-one error / route P3 Title-hunt / statement L3 / spec gap severe / difficulty 3
- **Root cause:** escape() doubles backslashes only when its regex matches a backslash run immediately before a [tag]; a lone trailing backslash is untouched, so _parse's backslash-pair counting treats it as escaping the following bracket and it disappears from rendered Text.
- **Why it existed:** Escaping logic only handled backslash runs adjacent to tags; end-of-string backslash (e.g. Windows paths) never covered (issue #2987).
- **Fix:** After the regex substitution, if markup ends with a single backslash append one more backslash before returning.
- **Tests require:** escape of a trailing-backslash string returns it doubled; Text.from_markup round-trip preserves the backslash with a red Span(0,3) (title names trailing backslash; exact cases and test_escape_backslash_end NOT in statement).
- **How to verify:** Inline: escape a Windows-path-like string, build Text.from_markup, confirm the round-trip preserves it; tests/test_markup.py test_escape cases.
- **Most likely failure:** Doubling every trailing backslash regardless of parity, or trying to fix it inside the regex instead of a post-sub endswith check.
- **Gold footprint:** 1 file(s), +3/-1 lines: `rich/markup.py`; drivers: terse statement, tests compare exact strings

##### `rich_3064` - Markdown tables without header or body rows crash rendering with AssertionError

- **Class:** C1 Bug fix / PAR Markup / Markdown / syntax parsing (secondary REN) / R10 error-handling gap / route P3 Title-hunt / statement L3 / spec gap severe / difficulty 3
- **Root cause:** TableElement.__rich_console__ asserts self.header, self.header.row and self.body are non-None; markdown truncated before the table body yields None parts and rendering crashes with AssertionError instead of yielding a partial table.
- **Why it existed:** Markdown sources ending mid-table produce None body/header parts; asserts guarded the happy path only.
- **Fix:** Replace the three asserts with None-guards: add columns only when header and row exist, rows only when body exists; always yield the table.
- **Tests require:** Markdown of a header plus separator with no body rows renders an exact expected ANSI table with bold headers (partial-table behaviour only hinted by title; test_partial_table and expected string NOT in statement).
- **How to verify:** Script: render markdown with header and separator but no body rows; pre-fix raises AssertionError, post-fix renders a table.
- **Most likely failure:** Skipping the table or raising a clean error when header/body is None instead of yielding the header-only table the exact expected output shows.
- **Gold footprint:** 1 file(s), +8/-9 lines: `rich/markdown.py`; drivers: terse statement, tests compare exact strings

##### `rich_3067` - URL highlighting stops at tilde; add ~ to the url pattern

- **Class:** C1 Bug fix / PAR Markup / Markdown / syntax parsing / R01 missing branch / unhandled input class / route P3 Title-hunt / statement L2 / spec gap minor / difficulty 2
- **Root cause:** ReprHighlighter's url character class [-0-9a-zA-Z$_+!`(),.?/;:&=%#] omits '~', a legal URI character, so URL matching stops at a tilde and the rest of the path loses repr.url styling.
- **Why it existed:** Character class never included tilde when the URL pattern was authored; edge case (issue #3057).
- **Fix:** Append '~' to the url character class in ReprHighlighter.highlights.
- **Tests require:** ' http://example.org/~folder ' yields a single Span(1, 27, 'repr.url'); anchor and query cases keep passing (tilde-in-URL in statement; span expectations and added test cases NOT in statement).
- **How to verify:** Inline: ReprHighlighter on a tilde URL yields one full repr.url span; existing url parametrization in tests/test_highlighter.py.
- **Most likely failure:** Inserting ~ into the path or filename pattern instead of the url class, or breaking the character class syntax with bad escaping.
- **Gold footprint:** 1 file(s), +1/-1 lines: `rich/highlighter.py`; drivers: tests compare exact strings

##### `rich_3105` - Fix issue #3104 - statement gives no details (HTML export code font)

- **Class:** C1 Bug fix / CON Console / terminal I/O / R11 environment / platform assumption / route P3 Title-hunt / statement L2 / spec gap severe / difficulty 4
- **Root cause:** CONSOLE_HTML_FORMAT sets font-family only on the <pre> element; the nested <code> element receives the browser's user-agent monospace instead of inheriting the intended font stack, so exported HTML renders the wrong font.
- **Why it existed:** Browser user-agent stylesheet styles code elements with their own monospace, overriding inheritance - environment assumption never handled (issue #3104).
- **Fix:** Add style="font-family:inherit" to the <code> tag in CONSOLE_HTML_FORMAT.
- **Tests require:** export_html output containing a code tag with an inline font-family inherit style inside three exact expected strings in tests/test_console.py (NOT in statement - statement is only 'Fix #3104').
- **How to verify:** none - issue text unreachable; the required attribute is unguessable from the repo alone.
- **Most likely failure:** Guessing any other template change (charset, html tag placement, font list) - without the issue text the required font-family inherit attribute is a shot in the dark.
- **Gold footprint:** 1 file(s), +1/-1 lines: `rich/_export_format.py`; drivers: terse statement, tests compare exact strings

##### `rich_3130` - Markdown table cells lose earlier inline-styled fragments; append content like TextElement

- **Class:** C1 Bug fix / PAR Markup / Markdown / syntax parsing (secondary REN) / R03 duplicated or parallel logic out of sync / route P1 Prescribe / statement L2 / spec gap minor / difficulty 3
- **Root cause:** TableDataElement.on_text rebuilt self.content from each incoming fragment alone (its plain text plus context.style_stack.current), so every new styled fragment replaced earlier cell content instead of accumulating the way TextElement.on_text appends.
- **Why it existed:** Table-cell text handling written parallel to TextElement.on_text but never aligned with its append semantics (issue #3115).
- **Fix:** Store content as Text('', justify=justify); on_text wraps str in Text, applies text.stylize(context.current_style), and appends via self.content.append_text(text).
- **Tests require:** test_inline_styles_in_table and test_inline_styles_with_justification: markdown tables with bold/italic/strikethrough/link cells and column justification, exact expected ANSI output (append-not-replace behaviour in statement; expected strings NOT in statement).
- **How to verify:** Render a table cell containing several styled fragments and confirm all fragments and their styles survive; statement describes the mechanism.
- **Most likely failure:** Keeping the replace-per-fragment behaviour, appending without stylize(context.current_style), or dropping the justify setting when building the cell Text.
- **Gold footprint:** 1 file(s), +5/-7 lines: `rich/markdown.py`; drivers: tests compare exact strings

##### `rich_3180` - Double-width characters vanish when word-wrap folds inside a wide character

- **Class:** C1 Bug fix / WID Text measurement and segmentation / R07 algorithmic flaw (loop, ordering, non-termination) / route P2 Repro-driven bugfix / statement L2 / spec gap severe / difficulty 4
- **Root cause:** chop_cells iterated characters in reverse while tracking total_size from a caller-supplied position, so a double-width character straddling the width boundary was dropped; divide_line's line_position accounting also mis-tracked folded words, losing following text.
- **Why it existed:** Known-fragile reverse-order implementation (in-file TODOs about inefficiency and CWJ); fold landing inside a double-width character never covered (issue #3176).
- **Fix:** Rewrite chop_cells as forward per-character cell-width splitting with signature (text, width); rewrite divide_line with remaining-space logic so folds start fresh lines and continue after the folded word.
- **Tests require:** chop_cells(text, 3) exact chops for plain, double-width and mixed-width strings; Text.wrap CJK regression lines like '123ari\nagatougo\nzaimashi\nta'; Lines lists for space/long-word cases (NOT in statement: signatures and expectations).
- **How to verify:** Script: wrap a CJK string like the statement's case at a narrow width, print, and confirm no characters are lost.
- **Most likely failure:** Keeping reverse iteration; mishandling a wide character that overflows the boundary (it must open a new line); mis-tracking the cell position after folded words.
- **Gold footprint:** 2 file(s), +89/-38 lines: `rich/_wrap.py`; `rich/cells.py`; drivers: algorithmic, Unicode widths, tests compare exact strings

##### `rich_3278` - Strip private-use ANSI escape sequences (ESC 0-?) from decoded text

- **Class:** C1 Bug fix / PAR Markup / Markdown / syntax parsing / R01 missing branch / unhandled input class / route P2 Repro-driven bugfix / statement L2 / spec gap minor / difficulty 2
- **Root cause:** re_ansi matched OSC and standard CSI/escape sequences only; two-byte private sequences - ESC followed by a byte in [0-?] such as ESC 7 / ESC 8 cursor save/restore - fell outside every alternative and passed into rendered output.
- **Why it existed:** ANSI regex authored for standard sequences only; private-use two-byte escapes (Alpine apk output) never considered.
- **Fix:** Add the alternative (?:\x1b[0-?]) at the start of re_ansi so private sequences are recognized and stripped.
- **Tests require:** Text.from_ansi of an ESC-plus-code sequence for each code 0 through ? printed on a force_terminal Console captures plain 'x' newline (sequence range in statement; test name NOT in statement).
- **How to verify:** Script: decode an ESC 7 sequence via Text.from_ansi, print through a force_terminal Console, confirm only the plain character remains.
- **Most likely failure:** Matching greedily so the following character is consumed too, or placing the alternative where standard CSI sequences stop matching.
- **Gold footprint:** 1 file(s), +1/-0 lines: `rich/ansi.py`; drivers: tests compare exact strings

##### `rich_3296` - Syntax padding not painted with overridden background color; use base style

- **Class:** C1 Bug fix / REN Widget rendering and styling / R03 duplicated or parallel logic out of sync / route P3 Title-hunt / statement L2 / spec gap minor / difficulty 3
- **Root cause:** Syntax.__rich_console__ styled the wrapping Padding with self._theme.get_background_style(), bypassing _get_base_style() (theme background plus self.background_style), so a background_color override coloured the code but not the surrounding padding.
- **Why it existed:** Padding branch wired to the raw theme background; the background-color-override-plus-padding combination was never covered (issue #3295).
- **Fix:** Yield Padding(segments, style=self._get_base_style(), pad=self.padding) instead of the raw theme background style.
- **Tests require:** Syntax('x = 1', lexer='python', padding=(1, 3), background_color='red') rendered ANSI equal to an exact expected string with red-background padding segments (behaviour in statement; expected string and test name NOT in statement).
- **How to verify:** Render a Syntax with padding and background_color='red' and confirm the padding cells carry the overridden background.
- **Most likely failure:** Styling the padding with background_color directly or the theme background again instead of _get_base_style(); wrong pad tuple order.
- **Gold footprint:** 1 file(s), +1/-3 lines: `rich/syntax.py`; drivers: tests compare exact strings

##### `rich_3454` - Add @ to url highlighter pattern so @-URLs highlight fully

- **Class:** C1 Bug fix / PAR Markup / Markdown / syntax parsing / R01 missing branch / unhandled input class / route P1 Prescribe / statement L2 / spec gap none / difficulty 1
- **Root cause:** The ReprHighlighter url character class lacks '@', so URLs like a YouTube channel URL stop matching at the @ and the tail loses repr.url highlighting.
- **Why it existed:** URL character class never included '@' when authored; edge case reported as issue #3327.
- **Fix:** Append '@' to the url character class in ReprHighlighter.highlights.
- **Tests require:** YouTube @-channel URL yields a single full Span(0, 38, 'repr.url') in tests/test_highlighter.py parametrization (@ fix, file and pattern named in statement; span expectation NOT in statement).
- **How to verify:** Inline: highlight the @-URL and confirm one full repr.url span covering the whole address.
- **Most likely failure:** Adding @ to the path or filename class instead of the url class, or breaking the character class syntax.
- **Gold footprint:** 1 file(s), +1/-1 lines: `rich/highlighter.py`; drivers: tests compare exact strings

##### `rich_3468` - exit cleanly when stdout is a broken pipe

- **Class:** C1 Bug fix / CON Console / terminal I/O / R10 error-handling gap / route P3 Title-hunt / statement L3 / spec gap minor / difficulty 3
- **Root cause:** Console._check_buffer wrote the rendered buffer to self.file with no BrokenPipeError handling; when a pipe reader (e.g. head -1) closes early, write() raised and rich aborted with a traceback/wrong exit code instead of the SIGPIPE convention.
- **Why it existed:** Piping rich output into head on Linux/macOS (issue #1591); the write path's exception branch was never handled.
- **Fix:** Extract the write into _write_buffer, wrap it in try/except BrokenPipeError, call new Console.on_broken_pipe: set quiet, dup2 devnull onto stdout, raise SystemExit(1).
- **Tests require:** subprocess pipe of 'python -m rich' into 'head -1'; proc1 returncode == 1 and proc2 == 0 (NOT in statement); on_broken_pipe/_write_buffer names not asserted (NOT in statement).
- **How to verify:** Unix repro via run_command: pipe 'python -m rich' into 'head -1', check exit code 1 and no traceback.
- **Most likely failure:** Catching BrokenPipeError but exiting 0 or 120, or not dup2'ing devnull over stdout so the interpreter's final flush still fails and the returncode assertion fails.
- **Gold footprint:** 1 file(s), +36/-6 lines: `rich/console.py`; drivers: terminal / environment, terse statement

##### `rich_3469` - stop Markdown adding an extra newline before inline elements

- **Class:** C1 Bug fix / PAR Markup / Markdown / syntax parsing / R01 missing branch / unhandled input class / route P3 Title-hunt / statement L3 / spec gap severe / difficulty 4
- **Root cause:** markdown.py __rich_console__ yielded _new_line_segment before rendering any closing element whose new_line flag was set; empty markdown table cells arrive as self-closing 'inline' tokens, so blank cells injected a stray newline above the table.
- **Why it existed:** markdown-it emits inline tokens for empty table cells; the newline emission never checked the token type.
- **Fix:** Gate the self-closing branch newline with 'and node_type != "inline"'.
- **Tests require:** Markdown tables with empty cells vs a complete table (NOT in statement); equal splitlines() counts via the test render helper (NOT in statement).
- **How to verify:** none — repro must be guessed; best fallback is rendering markdown tables and inspecting stray blank lines.
- **Most likely failure:** Suppressing newlines for all self-closing elements or trimming spaces inside table cells, breaking other Markdown tests' exact rendered output.
- **Gold footprint:** 1 file(s), +1/-1 lines: `rich/markdown.py`; drivers: terse statement

##### `rich_3470` - keep captured output out of console recording

- **Class:** C1 Bug fix / CON Console / terminal I/O / R01 missing branch / unhandled input class / route P3 Title-hunt / statement L3 / spec gap severe / difficulty 3
- **Root cause:** Console._write_buffer extended _record_buffer whenever self.record was set, ignoring _buffer_index; while console.capture() is active the buffer holds captured output, so export_text() included lines printed inside the capture block.
- **Why it existed:** Record-while-capturing combination uncovered; the old test_capture_and_record enshrined the polluted expectation (#2563).
- **Fix:** Record only when 'self.record and not self._buffer_index'.
- **Tests require:** Console(record=True); console.capture(); capture.get() == 'Print 1\nPrint 2\nPrint 3\nPrint 4\n'; console.export_text() == 'Print 0\n' (all NOT in statement).
- **How to verify:** Inline repro: record console, capture prints, compare export_text; existing test_capture_and_record passes pre-fix and must be reworked.
- **Most likely failure:** Trusting the existing test_capture_and_record, which asserts the buggy 'ABC\nHello\n' recording; the hidden patch replaces it, so preserving old behaviour fails.
- **Gold footprint:** 1 file(s), +1/-1 lines: `rich/console.py`; drivers: terse statement, tests compare exact strings

##### `rich_3471` - strip control codes in Text.append_tokens

- **Class:** C1 Bug fix / PAR Markup / Markdown / syntax parsing (secondary WID) / R03 duplicated or parallel logic out of sync / route P3 Title-hunt / statement L3 / spec gap severe / difficulty 3
- **Root cause:** Text.append_tokens appended token content raw while Text.__init__/append and other entry paths call strip_control_codes; control codes like \r\n stayed in plain text, corrupting cell-width calculation and wrapping downstream.
- **Why it existed:** Sanitisation was never wired into this append path; parallel text-entry paths drifted (#3014).
- **Fix:** Add 'content = strip_control_codes(content)' at the top of the token loop in append_tokens.
- **Tests require:** Text().append_tokens with '\r\n' content (append_tokens in statement); console.print(t, width=40) capture == 'long text that will be wrapped with a \ncontrol code \n\n' (NOT in statement).
- **How to verify:** Inline repro: append_tokens with control-code text, print with width=40 inside capture.
- **Most likely failure:** Chasing a nonexistent exception inside append_tokens, or stripping \n as well so the expected wrapped output ending 'control code \n\n' mismatches.
- **Gold footprint:** 1 file(s), +1/-0 lines: `rich/text.py`; drivers: terse statement, tests compare exact strings, Unicode widths

##### `rich_3472` - skip dataclass fields missing on the instance when pretty printing

- **Class:** C1 Bug fix / DBG Developer-facing introspection / R02 wrong assumption about data shape or type / route P3 Title-hunt / statement L3 / spec gap severe / difficulty 3
- **Root cause:** pretty.py's dataclass branch of iter_attrs calls getattr(obj, field.name) for every field with repr=True; a field declared field(init=False) with no default never becomes an instance attribute, so console.print of such a dataclass raises AttributeError.
- **Why it existed:** Dataclasses with init=False, default-less fields are valid but never exercised (#3417).
- **Fix:** Filter the loop_last generator with 'if field.repr and hasattr(obj, field.name)'.
- **Tests require:** @dataclass class with a field(init=False) and no default; console.print(instance) renders exactly 'BadDataclass()' (NOT in statement).
- **How to verify:** Inline repro: dataclass with init=False field; console.print raises AttributeError pre-fix.
- **Most likely failure:** Defaulting the missing attribute to None (prints 'item=None') instead of omitting the field, failing the exact 'BadDataclass()' expectation.
- **Gold footprint:** 1 file(s), +3/-1 lines: `rich/pretty.py`; drivers: terse statement, tests compare exact strings

##### `rich_3480` - fix infinite loop when a Text appends itself

- **Class:** C1 Bug fix / WID Text measurement and segmentation (secondary OBJ) / R07 algorithmic flaw (loop, ordering, non-termination) / route P3 Title-hunt / statement L3 / spec gap severe / difficulty 3
- **Root cause:** Text.append and append_text build spans with a generator iterating text._spans while extending self._spans; when text is self both names alias one list, so the generator consumes the spans it just appended and never terminates.
- **Why it existed:** Self-referential append never considered; lazy generator evaluation turned the aliasing into a hang (#3479).
- **Fix:** Iterate 'text._spans.copy()' in both append and append_text so the source list is snapshotted.
- **Tests require:** Text('one','blue').append(self); append_text(self); plain == 'oneone'/'twotwo' (NOT in statement).
- **How to verify:** Inline repro: a = Text('one'); a.append(a) must return with plain 'oneone', not hang.
- **Most likely failure:** Raising or skipping when text is self instead of snapshotting the span list, so plain != 'oneone'; or copying in a way that still mutates the live list mid-iteration.
- **Gold footprint:** 1 file(s), +2/-2 lines: `rich/text.py`; drivers: algorithmic, terse statement

##### `rich_3506` - fix Segment._split_cells cutting at wrong cell positions

- **Class:** C1 Bug fix / WID Text measurement and segmentation / R02 wrong assumption about data shape or type / route P3 Title-hunt / statement L3 / spec gap minor / difficulty 2
- **Root cause:** Segment._split_cells seeded its scan with pos = int((cut / cell_length) * (len(text) - 1)), assuming character index scales linearly with cell position; with mixed-width text the start overshoots, the forward-only scan settles past the cut, and the halves have wrong widths.
- **Why it existed:** Formula tuned for uniform-width strings; Textual #4996 surfaced mixed CJK/ASCII segments.
- **Fix:** Estimate pos = int((cut / cell_length) * len(text)) - 1 and clamp negatives to 0 before scanning.
- **Tests require:** Segment.split_cells at every position of mixed/double/single segments; cell_len(left) == position, cell_len(right) == remainder (NOT in statement); CJK fixture '早乙女リリエル (CV: 徳井青）' (NOT in statement).
- **How to verify:** Inline loop: split a CJK-mixed Segment at each cut and assert cell_len of both halves.
- **Most likely failure:** Patching only the emoji/ASCII cases or the fast path in split_cells instead of the _split_cells estimate; breaking the lru_cache call signature.
- **Gold footprint:** 1 file(s), +15/-2 lines: `rich/segment.py`; drivers: terse statement, algorithmic, Unicode widths

##### `rich_3518` - apply Table.highlight to columns auto-created by add_row

- **Class:** C1 Bug fix / REN Widget rendering and styling / R01 missing branch / unhandled input class / route P1 Prescribe / statement L2 / spec gap none / difficulty 2
- **Root cause:** add_row creates overflow columns as Column(_index=index), leaving Column.highlight at its False default and ignoring Table.highlight, so numbers in implicitly added columns were never highlighted.
- **Why it existed:** Auto-column creation path skipped propagating the table-level highlight flag (#3517).
- **Fix:** Column(_index=index, highlight=self.highlight).
- **Tests require:** Table(show_header=False, highlight=True); add_row; columns[i].highlight (in statement); exact ANSI '\x1b[1;36m1\x1b[0m' / '\x1b[32m'FOO'\x1b[0m' output (NOT in statement).
- **How to verify:** Repro: Table(highlight=True).add_row('1', repr('FOO')); check columns[1].highlight and rendered styles.
- **Most likely failure:** Restyling at render time or copying every Column attribute instead of just highlight; perturbing existing table tests.
- **Gold footprint:** 1 file(s), +1/-1 lines: `rich/table.py`; drivers: tests compare exact strings

##### `rich_3521` - rewrite Segment.split_cells to split exactly on cell boundaries

- **Class:** C1 Bug fix / WID Text measurement and segmentation / R07 algorithmic flaw (loop, ordering, non-termination) / route P3 Title-hunt / statement L3 / spec gap minor / difficulty 3
- **Root cause:** After the earlier estimate fix, _split_cells' one-way scan still replaced a double-width character only when overshooting by one and could not step back, so cuts adjacent to 2-cell characters landed one cell off or fell through to AssertionError('Will never reach here').
- **Why it existed:** Heuristic start plus forward-only scan never handled wide-character boundaries (Textual #5090).
- **Fix:** Rewrite as a walk computing out_by = cell_len(before) - cut: exact split at 0, straddled 2-cell char becomes two spaces for out_by ±1, else step pos toward the cut.
- **Tests require:** Parametrized CJK-mixed Segments incl. leading/trailing spaces; split at positions 0..cell_length; cell_len(left) == position, right == remainder (NOT in statement).
- **How to verify:** Inline loop over every cut of a mixed Segment asserting the halves' cell lengths.
- **Most likely failure:** Keeping a forward-only scan, mishandling cut 0 and cell_length, or off-by-one in the two-space replacement around wide characters.
- **Gold footprint:** 1 file(s), +16/-19 lines: `rich/segment.py`; drivers: algorithmic, Unicode widths, terse statement

##### `rich_3535` - correct the single-cell-width fast-path character regex

- **Class:** C1 Bug fix / WID Text measurement and segmentation / R06 boundary / empty-input / off-by-one error / route P3 Title-hunt / statement L4 / spec gap severe / difficulty 3
- **Root cause:** rich/cells.py `_is_single_cell_widths` matched only U+0020-U+006f (dropping p-z), wrote U+00A0 and U+02FF as two literals instead of the intended range, and omitted box-drawing U+2500-U+25FF, so border glyphs and printable ASCII missed the fast path and took the slow per-character route.
- **Why it existed:** Regex typo/drift; no test enumerated characters against the cell-width table.
- **Fix:** Replace the class with '^[\u0020-\u007e\u00a0-\u02ff\u0370-\u0482\u2500-\u25FF]*$' and assert cut >= 0 in Segment.split_cells.
- **Tests require:** Imports of _is_single_cell_widths and chop_cells from rich.cells (NOT in statement); every string.printable char >= 32 matches; box-drawing chars match; emoji/kana do not (NOT in statement).
- **How to verify:** Script comparing _is_single_cell_widths(ch) against get_character_cell_size(ch) == 1 across many characters.
- **Most likely failure:** Widening ranges too far so wide/zero-width characters wrongly match the fast path, or fixing only the box-drawing range and leaving ASCII p-z out.
- **Gold footprint:** 2 file(s), +7/-1 lines: `rich/cells.py`; `rich/segment.py`; drivers: Unicode widths, terse statement

##### `rich_3718` - give Panel title and subtitle the panel background style

- **Class:** C1 Bug fix / REN Widget rendering and styling / R04 regression from an earlier change / route P2 Repro-driven bugfix / statement L2 / spec gap minor / difficulty 3
- **Root cause:** Panel.__rich_console__ built border_style = style + partial_border_style but align_text stylized title/subtitle with partial_border_style alone (change 7a38204), so panel-level styles like 'on blue' never reached the title text.
- **Why it existed:** Regression from commit 7a38204 which split panel style from border style for titles.
- **Fix:** Drop partial_border_style; stylize_before(border_style) for both title and subtitle.
- **Tests require:** Panel(style='on blue', title/subtitle Texts) under force_terminal truecolor; exact escapes '\x1b[31;44m title \x1b[0m' and '\x1b[1;35;44m subtitle \x1b[0m' (NOT in statement); #2745 border-color case unchanged (NOT in statement).
- **How to verify:** Render Panel with style='on blue' plus styled title/subtitle under force_terminal and inspect escapes; rerun the #2745 example.
- **Most likely failure:** Using stylize instead of stylize_before, or applying border_style to surrounding segments, re-breaking #2745 where the title's own red style must win.
- **Gold footprint:** 1 file(s), +3/-4 lines: `rich/panel.py`; drivers: tests compare exact strings

##### `rich_3772` - stop traceback rendering looping on self-referential exceptions

- **Class:** C1 Bug fix / DBG Developer-facing introspection / R07 algorithmic flaw (loop, ordering, non-termination) / route P3 Title-hunt / statement L3 / spec gap severe / difficulty 3
- **Root cause:** Traceback.extract's while loop followed __cause__/__context__ unconditionally and recursed into ExceptionGroup members with no visited set, so 'raise e from e' (cause is exc_value) or a repeated group member rendered forever.
- **Why it existed:** Self-caused exceptions and exception groups sharing members never covered (#3708, #3682).
- **Fix:** Thread a _visited_exceptions set through recursive extract calls; skip already-seen group members; follow cause only when it is not exc_value and no group was expanded.
- **Tests require:** raise RuntimeError then 'raise e from e'; console.print_exception(show_locals=True) must terminate (NOT in statement); no rendered-output assertions (NOT in statement).
- **How to verify:** Inline repro: raise, re-raise from itself, print_exception must return promptly.
- **Most likely failure:** Guarding only the group branch while 'raise e from e' still loops, or adding a depth cap that alters normal cause-chain rendering.
- **Gold footprint:** 1 file(s), +29/-16 lines: `rich/traceback.py`; drivers: algorithmic, terse statement

##### `rich_3782` - Syntax padding should shrink code width and wrap correctly

- **Class:** C1 Bug fix / REN Widget rendering and styling (secondary WID) / R03 duplicated or parallel logic out of sync / route P3 Title-hunt / statement L3 / spec gap severe / difficulty 4
- **Root cause:** Syntax stored the padding argument raw; _get_syntax computed code_width from options.max_width without subtracting horizontal padding or clamping at 0, while __rich_measure__ did unpack padding — render and measure were out of sync, so padded wrapped code overflowed; __rich_console__'s 'if self.padding:' truthiness also mis-tested unpacked tuples.
- **Why it existed:** Horizontal padding was added to Syntax without updating the render-side code-width computation; reported via issue #3727.
- **Fix:** Adds PaddingProperty descriptor storing Padding.unpack'ed padding; _get_syntax subtracts horizontal padding from code_width with max(0, ...); __rich_console__ gates on any(self.padding).
- **Tests require:** Syntax(padding=(0, 3), word_wrap=True) render equals exact wrapped string (NOT in statement); many updated test_syntax.py render snapshots (NOT in statement)
- **How to verify:** Print Syntax(padding=(0,3), word_wrap=True) in Console(width=24); each code line must fit max_width minus horizontal padding.
- **Most likely failure:** Fixing only the truthiness check or the descriptor while missing the code_width subtraction, or breaking the many exact render snapshots the hidden patch silently retunes.
- **Gold footprint:** 1 file(s), +24/-5 lines: `rich/syntax.py`; drivers: tests compare exact strings, terse statement

##### `rich_3882` - Prompt validation errors print raw markup when console markup is disabled

- **Class:** C1 Bug fix / CON Console / terminal I/O (secondary PAR) / R08 encoding / escaping / whitespace error / route P1 Prescribe / statement L2 / spec gap minor / difficulty 1
- **Root cause:** PromptBase.on_validate_error called console.print(error) without markup=True; validate_error_message strings embed markup tags ('[prompt.invalid]Please enter Y or N'), so on a console built with markup=False the raw tag text was printed literally instead of being processed and styled.
- **Why it existed:** Error message strings embed markup tags by design; the print site trusted the console's global markup flag.
- **Fix:** on_validate_error passes markup=True to console.print so the error's embedded markup is always processed.
- **Tests require:** Confirm.ask('continue', console=Console(markup=False), stream=..., default=True) with exact expected output without raw '[prompt.invalid]' (NOT in statement)
- **How to verify:** Repro from statement: Confirm.ask on a markup=False console with invalid input; output must not contain raw '[prompt.invalid]'.
- **Most likely failure:** Stripping the markup tags from the message strings instead of forcing markup=True at the print site.
- **Gold footprint:** 1 file(s), +1/-1 lines: `rich/prompt.py`; drivers: tests compare exact strings

##### `rich_3894` - Inspect must not crash on objects whose __qualname__ is not a string

- **Class:** C1 Bug fix / DBG Developer-facing introspection (secondary OBJ) / R02 wrong assumption about data shape or type / route P2 Repro-driven bugfix / statement L1 / spec gap none / difficulty 2
- **Root cause:** Inspector._get_signature did 'qualname = name or getattr(obj, "__qualname__", name)' assuming __qualname__ is a str; with __slots__ = ('__qualname__',) under functools.lru_cache the attribute is a descriptor object, so later string handling of qualname raised.
- **Why it existed:** Edge case never covered: lru_cache forwarding via descriptors leaves a non-str __qualname__ on __slots__ classes.
- **Fix:** _get_signature checks isinstance(qualname, str); on failure falls back to getattr(obj, '__name__', name), then to the supplied name.
- **Tests require:** functools.lru_cache-decorated class with __slots__ = ('__qualname__',); rich.inspect must not raise (in statement)
- **How to verify:** Repro from statement: inspect the lru_cache __slots__ class, all=True, must not raise.
- **Most likely failure:** Patching the inspect() entry point instead of _inspect._get_signature, or forgetting the __name__ fallback level.
- **Gold footprint:** 1 file(s), +4/-0 lines: `rich/_inspect.py`

##### `rich_3905` - Disabled Progress should not print a blank line on non-interactive consoles

- **Class:** C1 Bug fix / REN Widget rendering and styling (secondary CON) / R03 duplicated or parallel logic out of sync / route P1 Prescribe / statement L2 / spec gap none / difficulty 1
- **Root cause:** Progress.start was guarded by 'if not self.disable', but Progress.stop unconditionally called live.stop() and, on non-interactive non-Jupyter consoles, printed a blank line — so a disabled Progress used as a context manager still emitted a stray newline on exit.
- **Why it existed:** Asymmetric guard: start() gained the disable check but stop() was never updated (issue #110).
- **Fix:** Wraps the whole body of Progress.stop in 'if not self.disable:', mirroring start().
- **Tests require:** Progress(console=..., disable=True) as context manager; captured output must equal empty string (in statement)
- **How to verify:** Capture output of 'with Progress(console=..., disable=True)' on a non-interactive console; must be empty.
- **Most likely failure:** Guarding only the console.print() line and leaving live.stop() running for disabled progress.
- **Gold footprint:** 1 file(s), +4/-3 lines: `rich/progress.py`; drivers: tests compare exact strings

##### `rich_3934` - Empty Live display should not emit a stray newline on stop

- **Class:** C1 Bug fix / REN Widget rendering and styling (secondary CON) / R06 boundary / empty-input / off-by-one error / route P3 Title-hunt / statement L3 / spec gap severe / difficulty 3
- **Root cause:** Live.stop called console.line() whenever not in alt screen and the console is a terminal, with no check that anything had been rendered; LiveRender tracked _shape but exposed no rendered-height notion, so an empty Live left a stray blank line on exit.
- **Why it existed:** Stop-path newline never conditioned on rendered height; an empty renderable leaves _shape None (issue #3796).
- **Fix:** LiveRender gains a last_render_height property (0 when _shape is None); Live.stop only calls console.line() when it is non-zero.
- **Tests require:** Live(Group(), console=..., transient=True) capture equals '\x1b[?25l\r\x1b[2K\x1b[?25h\r' with no newline (NOT in statement)
- **How to verify:** Capture a transient Live over an empty renderable in a terminal console; output must contain no newline.
- **Most likely failure:** Reading _shape directly but forgetting the transient path ordering, or gating the render loop instead of the stop() line call.
- **Gold footprint:** 2 file(s), +17/-3 lines: `rich/live.py`; `rich/live_render.py`; drivers: tests compare exact strings, terse statement

##### `rich_3935` - Table column padding width must match per-cell padding collapse rules

- **Class:** C1 Bug fix / REN Widget rendering and styling / R03 duplicated or parallel logic out of sync / route P3 Title-hunt / statement L3 / spec gap severe / difficulty 3
- **Root cause:** Padding collapse existed twice and out of sync: Table._get_cells.get_padding rendered it (left = max(0, left - right) on non-first columns, edge pads zeroed when pad_edge False) while _get_padding_width measured with a different formula and ignored pad_edge entirely — measured column widths exceeded rendered cell widths, giving uneven gaps.
- **Why it existed:** Two parallel padding computations drifted; issue #3871 reported uneven padding between grid cells.
- **Fix:** _get_padding_width rewritten: collapse_padding sets pad_left=0 and pad_right=abs(pad_left - pad_right); pad_edge False zeroes first-column pad_left and last-column pad_right, matching per-cell rendering.
- **Tests require:** Table.grid(padding=(0, 1)) with three width-3 columns renders exactly 'aaa aaa aaa' (NOT in statement)
- **How to verify:** Render Table.grid(padding=(0,1)) with width-3 columns and compare exported text; gaps must be even between cells.
- **Most likely failure:** Adjusting only the collapse_padding formula and missing the pad_edge handling, leaving edge columns measured wider than they render.
- **Gold footprint:** 1 file(s), +13/-3 lines: `rich/table.py`; drivers: tests compare exact strings, terse statement

##### `rich_3938` - Styled soft-wrapped prints should not carry background color across newlines

- **Class:** C1 Bug fix / REN Widget rendering and styling (secondary CON) / R08 encoding / escaping / whitespace error / route P3 Title-hunt / statement L3 / spec gap severe / difficulty 3
- **Root cause:** With soft_wrap=True, Console.print applied the requested style to the entire rendered segment stream via Segment.apply_style, including segments containing the line feed — so a background style stayed active across the newline and bled onto following output lines.
- **Why it existed:** Style was applied to the whole soft-wrapped segment stream without splitting at newlines; issue #3838 reported background bleed.
- **Fix:** New Segment.split_lines_terminator yields (line_segments, ended_with_newline); Console.print styles each line and appends an unstyled Segment.line() between lines.
- **Tests require:** Segment.split_lines_terminator (NOT in statement); Console.print(style='blue on white', soft_wrap=True) output with background reset before newline (soft_wrap in statement)
- **How to verify:** Capture a styled soft_wrap print followed by plain text; background must reset before the newline.
- **Most likely failure:** Restyling differently but emitting doubled newlines, dropping the final unterminated line, or never introducing the split_lines_terminator name the tests import.
- **Gold footprint:** 2 file(s), +40/-5 lines: `rich/console.py`; `rich/segment.py`; drivers: tests compare exact strings, terse statement, new public name to guess

##### `rich_3944` - Unassigned codepoints such as nerd font glyphs should count one cell

- **Class:** C1 Bug fix / WID Text measurement and segmentation / R04 regression from an earlier change / route P3 Title-hunt / statement L3 / spec gap severe / difficulty 3
- **Root cause:** get_character_cell_size returned 0 when the codepoint exceeded the last cell-table entry's end, treating all unallocated codepoints as zero-width; nerd-font private-use glyphs (e.g. U+F024D) therefore occupied no cells and text layouts collapsed.
- **Why it existed:** Regression from the grapheme cell-table rewrite: past-end codepoints newly defaulted to 0 where the old flat table lookup fell through to 1.
- **Fix:** get_character_cell_size returns 1 instead of 0 for codepoints beyond the last table entry.
- **Tests require:** cell_len('\U000f024d') == 1 for an unallocated private-use codepoint (NOT in statement)
- **How to verify:** Inline: cell_len(chr(0xF024D)) should be 1.
- **Most likely failure:** Flipping the wrong branch or returning 1 for all unknowns including control characters, after struggling to connect 'fix fonts' to cells.py.
- **Gold footprint:** 1 file(s), +1/-1 lines: `rich/cells.py`; drivers: terse statement, Unicode widths

##### `rich_3953` - Fix zero-width-joiner width handling and control-character edge cases

- **Class:** C1 Bug fix / WID Text measurement and segmentation / R06 boundary / empty-input / off-by-one error / route P3 Title-hunt / statement L3 / spec gap severe / difficulty 3
- **Root cause:** _cell_len consumed the post-ZWJ character with next(iter_characters); with a trailing ZWJ the iterator is exhausted and next() raises StopIteration. get_character_cell_size also lacked an explicit zero-width guard for codepoints below 32 and 0x7F-0xA0, relying on fragile table entries and duplicated binary-search bookkeeping.
- **Why it existed:** Edge cases in the 3930-era ZWJ handling: end-of-string boundary and control-character ranges (issues #3947, #3950).
- **Fix:** get_character_cell_size returns 0 for codepoints <32 and 0x7F-0xA0 and simplifies the binary search loop; _cell_len switches to an index-based walk so a trailing ZWJ no longer over-iterates.
- **Tests require:** cell_len('1\u200d') == 1 and cell_len('\u200d') == 0 without raising; cell_len(chr(n)) == 0 for n in range(31) (NOT in statement)
- **How to verify:** Inline: cell_len('1\u200d') equals 1 without raising; control characters report width 0.
- **Most likely failure:** Fixing only the trailing-ZWJ crash and skipping the control-character zero-width guard, since both hidden tests must pass.
- **Gold footprint:** 1 file(s), +16/-10 lines: `rich/cells.py`; drivers: terse statement, Unicode widths, algorithmic

##### `rich_4006` - Fix infinite loop when splitting graphemes of strings starting with zero-width characters

- **Class:** C1 Bug fix / WID Text measurement and segmentation / R07 algorithmic flaw (loop, ordering, non-termination) / route P3 Title-hunt / statement L3 / spec gap severe / difficulty 4
- **Root cause:** In split_graphemes' scan loop the variation-selector branch advances index only when last_measured_character is set, and the zero-width-character branch only when spans is non-empty; for input starting with ESC or VS16 (spans empty) index never moves, so the while-loop spins forever. ZWJ also blindly does index+=2 even at the string end.
- **Why it existed:** Grapheme-scanning loop shipped with unhandled edge cases (leading zero-width/control chars, VS16 without prior char, trailing ZWJ); no test covered empty-span prefixes.
- **Fix:** Emit zero-width spans for SPECIAL characters with no prior span, advance index on VS16/zero-width when there is no previous character, advance trailing ZWJ by 1, and return gapless spans plus total width.
- **Tests require:** split_graphemes (in statement); chop_cells on ESC-only strings returns [] (NOT in statement); span tuples with zero-width entries like (0,1,0) for lone ESC/VS16/ZWJ (NOT in statement); cell_len parity (NOT in statement).
- **How to verify:** Repro the hang: chop_cells('\x1b', 3) never returns at base. Exact span shapes are unverifiable from the statement alone.
- **Most likely failure:** Fixes only the hang by skipping zero-width characters without appending spans; hidden tests demand gapless spans with zero-width entries such as (0,1,0) for a lone escape.
- **Gold footprint:** 1 file(s), +33/-12 lines: `rich/cells.py`; drivers: terse statement, tests compare exact strings, algorithmic, Unicode widths

##### `rich_4075` - Printing nothing with a custom end should not add a newline

- **Class:** C1 Bug fix / CON Console / terminal I/O / R01 missing branch / unhandled input class / route P3 Title-hunt / statement L3 / spec gap severe / difficulty 2
- **Root cause:** Console.print substitutes NewLine() whenever objects is empty, unconditionally; so with any end string the call still renders a newline, and print(end='!') emits '\n!' instead of just '!' as print(end='\n') semantics would suggest.
- **Why it existed:** Empty-objects substitution predates end customisation; no test ever printed nothing with a non-default end.
- **Fix:** In print(), only substitute NewLine() when end == '\n'; otherwise use an empty-string objects tuple ('',) so just the end string is written.
- **Tests require:** console.print with no objects and end='!' outputs exactly '!' - test_print_empty_with_end (NOT in statement); Console, print, end names (in statement: title words only).
- **How to verify:** Console(file=StringIO()).print(end='!') currently emits '\n!'; expected '!' is inferable from the title, existing print tests show the harness format.
- **Most likely failure:** Chases the unrelated Python-3.8 note or the save_text reflow; or removes NewLine() unconditionally, breaking the default blank-line behaviour of console.print() when end is '\n'.
- **Gold footprint:** 1 file(s), +12/-3 lines: `rich/console.py`; drivers: terse statement

##### `rich_4076` - Preserve trailing and repeated newlines when decoding ANSI output

- **Class:** C1 Bug fix / PAR Markup / Markdown / syntax parsing / R06 boundary / empty-input / off-by-one error / route P3 Title-hunt / statement L3 / spec gap severe / difficulty 3
- **Root cause:** AnsiDecoder.decode iterates terminal_text.splitlines(), which discards whether the text ended with a newline and yields nothing at all for '\n'; so decode and Text.from_ansi lose trailing newlines, doubled newlines collapse, and empty input loses its final empty line.
- **Why it existed:** splitlines-based decode predates the issue; trailing-delimiter edge (filed 2024) was never covered until ANSI round-trip fidelity mattered.
- **Fix:** Split with re.split(r'(?<=\n)', terminal_text) so pieces keep line breaks and a trailing empty piece exists, then decode_line(line.rstrip('\n')) per piece.
- **Tests require:** Text.from_ansi plain outputs preserving leading/trailing/double newlines (NOT in statement); AnsiDecoder.decode yields a trailing empty Text after a final newline (NOT in statement); updated test_decode and test_decode_example expectations (NOT in statement).
- **How to verify:** Text.from_ansi('Hello\n').plain drops the newline at base - reproducible from the title; the exact decode() yield contract is not checkable.
- **Most likely failure:** Patches Text.from_ansi to append a missing trailing newline instead of reworking AnsiDecoder.decode's splitlines logic; hidden tests also assert decode() yields a trailing empty Text.
- **Gold footprint:** 1 file(s), +3/-3 lines: `rich/ansi.py`; drivers: terse statement, tests compare exact strings

##### `rich_4077` - FileProxy should report the wrapped file's isatty status

- **Class:** C1 Bug fix / CON Console / terminal I/O (secondary OBJ) / R01 missing branch / unhandled input class / route P3 Title-hunt / statement L3 / spec gap severe / difficulty 1
- **Root cause:** FileProxy inherits isatty from io.TextIOBase, which always returns False; because the name resolves on the class, its __getattr__ delegation to the wrapped file never runs for isatty - unlike fileno, isatty was not explicitly overridden.
- **Why it existed:** fileno was delegated explicitly but isatty was overlooked, since the TextIOBase default silently shadows the generic __getattr__ fallback.
- **Fix:** Add def isatty(self) -> bool: return self.__file.isatty() to FileProxy, mirroring the existing fileno delegation.
- **Tests require:** FileProxy.isatty delegating to the wrapped file (isatty in statement); FileProxy(console, file) construction and truthy result (NOT in statement).
- **How to verify:** Construct FileProxy over a file whose isatty returns True and call it; tests/test_file_proxy.py shows the delegation style.
- **Most likely failure:** Overrides isatty on Console or returns constant True instead of delegating to self.__file.isatty(), or mis-handles the name-mangled private attribute.
- **Gold footprint:** 1 file(s), +3/-0 lines: `rich/file_proxy.py`; drivers: terse statement

##### `rich_4079` - Inline code in markdown table cells loses syntax highlighting

- **Class:** C1 Bug fix / REN Widget rendering and styling / R03 duplicated or parallel logic out of sync / route P3 Title-hunt / statement L3 / spec gap severe / difficulty 3
- **Root cause:** TableDataElement.on_text calls stylize(context.current_style) on the already-highlighted Text that MarkdownContext.on_text assembles for code_inline tokens, laying a flat current-style span over the per-token highlight spans; TextElement.on_text avoids this by styling only str input.
- **Why it existed:** Table-cell on_text was written before lexer-highlighted inline code existed and never matched TextElement's str-versus-Text convention.
- **Fix:** Mirror TextElement.on_text: if text is str, content.append(text, context.current_style); else content.append_text(text) untouched, preserving highlight spans.
- **Tests require:** Markdown table cell containing backtick code with inline_code_lexer/inline_code_theme must render monokai per-token ANSI (NOT in statement); exact escape-sequence string equality (NOT in statement); render helper in test module (NOT in statement).
- **How to verify:** Render a Markdown table containing backtick code with inline_code_lexer set and compare with the same code in a paragraph (flat style vs highlighted).
- **Most likely failure:** Patches MarkdownContext.on_text or guesses the wrong element class instead of TableDataElement.on_text; or passes current_style when appending the Text instance, which Text.append rejects.
- **Gold footprint:** 1 file(s), +4/-3 lines: `rich/markdown.py`; drivers: terse statement, tests compare exact strings


#### rich: New feature (7 tasks)

##### `rich_3052` - Add case_sensitive option to Prompt.ask for case-insensitive choice matching

- **Class:** C2 New feature / CON Console / terminal I/O / R13 incomplete feature / route P4 Feature-synthesis / statement L2 / spec gap minor / difficulty 3
- **Root cause:** PromptBase had no case-sensitivity control: check_choice compared value.strip() exactly against self.choices and process_response returned the typed text, so case variants were rejected; no parameter existed to thread through ask()/__init__.
- **Why it existed:** Feature request (upstream-accepted): case-insensitive choice matching was absent by design.
- **Fix:** Add case_sensitive: bool = True to PromptBase.__init__ and every ask signature; lowercase-compare in check_choice; in process_response return the matching original choice from self.choices.
- **Tests require:** Prompt.ask(choices, default, case_sensitive=False, stream) returns canonical 'foo' for input 'FoO'; exact console output with illegal-choice re-prompt message (case_sensitive in statement; expected strings and return normalization NOT in statement).
- **How to verify:** Script Prompt.ask with a StringIO stream feeding egg then FoO; compare console output and returned value against existing test_prompt_str patterns.
- **Most likely failure:** Returning the lowercased typed value instead of the canonical choice string, or missing one of ask()'s signatures so case_sensitive never reaches __init__.
- **Gold footprint:** 1 file(s), +29/-5 lines: `rich/prompt.py`; drivers: tests compare exact strings

##### `rich_3061` - Expand tabs preserving span styles instead of unstyled spaces

- **Class:** C2 New feature / WID Text measurement and segmentation / R13 incomplete feature / route P4 Feature-synthesis / statement L2 / spec gap severe / difficulty 4
- **Root cause:** expand_tabs split on tabs and appended plain space runs with the Text's own top-level style, so spans ending at a tab were never extended over the new spaces; no span-extension API existed, and self.tab_size always beat console.tab_size.
- **Why it existed:** Tab expansion written span-unaware; capability gap surfaced via screenshots of unstyled tab fill.
- **Fix:** Add Span.extend(cells) and Text.extend_style(spaces) (extend spans ending at text end), rewrite expand_tabs with per-line cell_position modulo tab_size, and prefer console.tab_size when Text.tab_size is None.
- **Tests require:** Text.extend_style(n) public method (NOT in statement); expand_tabs span expectations like [Span(0,3,'red'), Span(4,9,'bold')]; parametrized markup/tab_size cases; Panel tab-title Segment (NOT in statement).
- **How to verify:** Partial: expand a styled tab in a script and confirm the spaces carry the span style; exact span boundaries not verifiable without the tests.
- **Most likely failure:** Extending spans that merely overlap instead of those ending at the text end, appending unstyled spaces again, or missing the console.tab_size precedence flip.
- **Gold footprint:** 1 file(s), +67/-24 lines: `rich/text.py`; drivers: algorithmic, new public name to guess, tests compare exact strings

##### `rich_3486` - underline the exact failing expression in tracebacks (PEP 657)

- **Class:** C2 New feature / DBG Developer-facing introspection (secondary PAR) / R13 incomplete feature / route P4 Feature-synthesis / statement L4 / spec gap severe / difficulty 4
- **Root cause:** Frame carried only filename/lineno/name; Traceback.extract never derived instruction positions from frame_summary.f_lasti via co_positions(), and Syntax.stylize_range had no style_before flag, so the precise failing sub-expression could not be highlighted in frames.
- **Why it existed:** PEP 657 fine-grained error locations (Python 3.11 co_positions) not yet adopted by rich.
- **Fix:** Add Frame.last_instruction (3.11: islice of co_positions at f_lasti//2), _SyntaxHighlightRange.style_before plus stylize_range(style_before=...), underline it via new traceback.error_range style; also drop function/class locals.
- **Tests require:** Traceback().trace.stacks[-1].frames[-1].last_instruction (NOT in statement); None before 3.11, tuple ((line,col),(line,col)) on 3.11+ (NOT in statement); version skipif gating (NOT in statement).
- **How to verify:** Inline: catch 1/0, render Traceback(), inspect the new frames attribute and the underline visually.
- **Most likely failure:** Naming the field anything but last_instruction, wrong tuple shape, or missing the 3.11 version gate; tests read the attribute directly and skipif on version.
- **Gold footprint:** 3 file(s), +74/-24 lines: `rich/default_styles.py`; `rich/syntax.py`; `rich/traceback.py`; drivers: several files, Python version, new public name to guess, terse statement

##### `rich_3675` - add TTY_COMPATIBLE environment variable for terminal detection

- **Class:** C2 New feature / CON Console / terminal I/O / R13 incomplete feature / route P4 Feature-synthesis / statement L3 / spec gap severe / difficulty 4
- **Root cause:** Console.is_terminal consulted only _force_terminal/Idle/Jupyter/FORCE_COLOR/isatty; no TTY_COMPATIBLE override existed, and FORCE_COLOR/NO_COLOR counted as set even when empty, so CI tooling could not explicitly declare tty-ness.
- **Why it existed:** Issue #2924 discussion: CI and log tooling need an explicit terminal/not-terminal declaration.
- **Fix:** In is_terminal: TTY_COMPATIBLE '0' returns False and '1' returns True before FORCE_COLOR; empty FORCE_COLOR falls through to isatty; NO_COLOR set only when non-empty.
- **Tests require:** Console(file=FakeFile/FakeTTY, _environ={'TTY_COMPATIBLE': '1'/'0'/''/'whatever'}) (TTY_COMPATIBLE in statement; _environ NOT in statement); is_terminal outcomes; file.called_isatty; FORCE_COLOR/NO_COLOR empty semantics (NOT in statement).
- **How to verify:** Inline: construct Console with _environ overrides (or patched os.environ) and assert is_terminal per value.
- **Most likely failure:** Checking TTY_COMPATIBLE after FORCE_COLOR, treating any non-'0' value as True, or skipping the empty-string tightening of FORCE_COLOR/NO_COLOR that the rewritten tests assert.
- **Gold footprint:** 2 file(s), +28/-13 lines: `rich/console.py`; `rich/diagnose.py`; drivers: terminal / environment, tests compare exact strings, terse statement

##### `rich_3676` - render Exception.__notes__ in rich tracebacks

- **Class:** C2 New feature / DBG Developer-facing introspection / R13 incomplete feature / route P4 Feature-synthesis / statement L4 / spec gap severe / difficulty 3
- **Root cause:** Traceback.extract never read __notes__, Stack/_SyntaxError dataclasses had no notes field, and no traceback.note style existed, so notes added via add_note() never appeared in rendered tracebacks.
- **Why it existed:** Python 3.11 PEP 678 Exception.__notes__/add_note not yet adopted.
- **Fix:** notes = getattr(exc_value, '__notes__', None) or [] stored on Stack (and _SyntaxError); after each stack yield Text.assemble(('[NOTE] ', 'traceback.note'), highlighter(note)); add the style.
- **Tests require:** error.add_note('Hello'/'World') (__notes__ in statement; add_note NOT in statement); Traceback().trace.stacks[0].notes == ['Hello', 'World'] (NOT in statement); 3.11 skipif (NOT in statement).
- **How to verify:** Inline: add_note twice, render Traceback, inspect [NOTE] lines and stack.notes.
- **Most likely failure:** Rendering notes without exposing a Stack.notes attribute, or naming the field differently, so stacks[0].notes fails; syntax-error stacks also need notes.
- **Gold footprint:** 2 file(s), +12/-1 lines: `rich/default_styles.py`; `rich/traceback.py`; drivers: new public name to guess, Python version, terse statement

##### `rich_3777` - Add TTY_INTERACTIVE environment variable to disable interactive animations in CI

- **Class:** C2 New feature / CON Console / terminal I/O / R13 incomplete feature / route P4 Feature-synthesis / statement L2 / spec gap minor / difficulty 2
- **Root cause:** Console.__init__ computed is_interactive solely from the force_interactive parameter or auto-detection (is_terminal and not is_dumb_terminal); no environment override existed, so CI runs emulating a terminal (TTY_COMPATIBLE) still got spinners/progress animations with no way to opt out.
- **Why it existed:** New capability: CI terminals now emulate TTYs (TTY_COMPATIBLE), so a companion opt-out for animations was needed.
- **Fix:** Console.__init__ reads TTY_INTERACTIVE when force_interactive is None: '0' forces False, '1' forces True, any other value leaves auto-detect; diagnose.report lists the new variable.
- **Tests require:** Console(file=..., _environ={'TTY_INTERACTIVE': ...}) (NOT in statement); attribute is_interactive (NOT in statement); unknown value falls back to auto-detect (NOT in statement)
- **How to verify:** Inline: Console(file=io.BytesIO(), _environ={'TTY_INTERACTIVE': '1'}).is_interactive True, '0' False, 'foo' auto-detect.
- **Most likely failure:** Treating any non-empty value as disabling, or missing the unknown-value auto-detect fallback and the TTY_COMPATIBLE interplay the hidden test checks.
- **Gold footprint:** 2 file(s), +12/-1 lines: `rich/console.py`; `rich/diagnose.py`; drivers: terminal / environment

##### `rich_3930` - Measure and split text by grapheme clusters using versioned Unicode width data

- **Class:** C2 New feature / WID Text measurement and segmentation / R13 incomplete feature / route P10 Timeboxed-slice / statement L2 / spec gap severe / difficulty 5
- **Root cause:** rich/cells.py measured each codepoint independently against the flat CELL_WIDTHS table from _cell_widths.py and chop_cells walked codepoint-by-codepoint; multi-codepoint glyphs (ZWJ emoji, variation selectors) were measured and wrapped as separate codepoints, and no grapheme segmentation or versioned width data existed to hook wrapping/cropping into.
- **Why it existed:** Deliberate design change: adopt wcwidth-derived, per-Unicode-version cell tables and grapheme segmentation as modern terminals converged on Unicode rules.
- **Fix:** New rich/_unicode_data package lazily loads per-version cell tables (load, _parse_version, _versions); cells.py rewritten around grapheme spans — split_graphemes, split_text, span-based chop_cells, table-driven get_character_cell_size; _cell_widths.py deleted.
- **Tests require:** rich.cells: cell_len, chop_cells, split_graphemes, split_text, get_character_cell_size, set_cell_size, CellSpan, _is_single_cell_widths; rich._unicode_data: load, _parse_version, VERSIONS (all NOT in statement)
- **How to verify:** Inline: cell_len of a ZWJ emoji sequence; wrap multi-codepoint emoji at small width; the Unicode data tables have no oracle.
- **Most likely failure:** Trying to vendor wcwidth or regenerate 21 Unicode tables offline, or missing the unguessable API names (split_graphemes, _unicode_data.load) the hidden tests import.
- **Gold footprint:** 26 file(s), +12170/-544 lines: `rich/__main__.py`; `rich/_cell_widths.py`; `rich/_unicode_data/__init__.py`; `rich/_unicode_data/_versions.py`; `rich/_unicode_data/unicode10-0-0.py`; `rich/_unicode_data/unicode11-0-0.py` ...; drivers: several files, new file required, large patch, algorithmic, Unicode widths, generated data tables, new public name to guess


#### rich: Refactor (1 tasks)

##### `rich_4070` - Defer heavy imports to cut Console and RichHandler import time

- **Class:** C3 Refactor / CON Console / terminal I/O / R14 design improvement / tech debt / route P7 Mechanical-sweep / statement L2 / spec gap minor / difficulty 4
- **Root cause:** No logic flaw: console.py, logging.py, syntax.py, theme.py, segment.py, _emoji_replace and emoji import inspect, zlib, getpass, html.escape, pretty, scope, Traceback, configparser and EMOJI at module level although only rare code paths need them; syntax.py importing console drags the whole chain into every import.
- **Why it existed:** Import graph accreted across features; pip-startup latency motivated an AI-assisted perf PR that restructures it - deliberate tech-debt cleanup, not a defect.
- **Fix:** Move annotation-only imports under TYPE_CHECKING; defer Traceback, pretty/Pretty, scope, getpass, html.escape, zlib, configparser, EMOJI and inspect into the methods using them; isclass to isinstance(x, type); delete dead _svg_hash and segment logging import.
- **Tests require:** Console.input must call getpass.getpass lazily (tests patch the getpass module) (NOT in statement); rich.syntax must stop exporting Console (tests import it from rich.console) (NOT in statement); all existing behaviour preserved (in statement).
- **How to verify:** python -X importtime before/after, plus pytest tests/ (statement says 952 passed, 25 skipped at base).
- **Most likely failure:** Defers an import but leaves a module-level binding in the code path (e.g. console.input still calls the old getpass name) so patching getpass.getpass has no effect; or parks a runtime-needed import under TYPE_CHECKING.
- **Gold footprint:** 9 file(s), +71/-57 lines: `rich/_emoji_replace.py`; `rich/console.py`; `rich/emoji.py`; `rich/logging.py`; `rich/protocol.py`; `rich/repr.py` ...; drivers: several files, large patch


#### rich: Behaviour change (1 tasks)

##### `rich_3942` - Retune default Markdown styles: headings, rules, bullets and tables

- **Class:** C4 Behaviour change / REN Widget rendering and styling (secondary PAR) / R14 design improvement / tech debt / route P10 Timeboxed-slice / statement L4 / spec gap severe / difficulty 5
- **Root cause:** Deliberate restyle rather than a defect: Heading.__rich_console__ centered every level and boxed h1 in a HEAVY Panel; HRule yielded a default Rule; TableElement used box.SIMPLE_HEAVY with plain columns; default_styles markdown.h1-h6/item.bullet/hr palette outdated — all deliberately replaced.
- **Why it existed:** Deliberate redesign of Markdown defaults for a closer terminal-markdown look; the target rendering is only visible in PR renders.
- **Fix:** default_styles retunes markdown keys and adds markdown.table.border/header; Heading drops the Panel and justifies per level (h1 center); HRule uses Rule(characters='-') plus a blank line; tables use box.SIMPLE with styled cyan headers.
- **Tests require:** Exact ANSI snapshot renders of Markdown headings, hr and tables in test_markdown.py and test_markdown_no_hyperlinks.py (NOT in statement)
- **How to verify:** none (hidden tests snapshot exact ANSI renders; unguessable from the statement).
- **Most likely failure:** Changing a few style colors while missing the structural changes (Panel removal, per-level justify, Rule characters, table box/padding) the snapshots pin.
- **Gold footprint:** 2 file(s), +43/-27 lines: `rich/default_styles.py`; `rich/markdown.py`; drivers: tests compare exact strings, terse statement, several files, large patch, removal


### 9.3 requests (13 tasks)

#### requests: Bug fix (12 tasks)

##### `requests_6589` - Count UTF-8 encoded bytes, not characters, when computing length of string data

- **Class:** C1 Bug fix / NET Network / HTTP protocol behaviour / R02 wrong assumption about data shape or type / route P1 Prescribe / statement L4 / spec gap none / difficulty 1
- **Root cause:** super_len(o) measures via len(o); for str that is a character count, while Content-Length must be the transmitted byte count. Multi-byte UTF-8 string bodies under-report length, so PreparedRequest sends a wrong Content-Length header. No str branch existed before the __len__ lookup.
- **Why it existed:** Issue #6586: the character-versus-byte mismatch for non-ASCII string bodies was never handled in super_len.
- **Fix:** In super_len, encode str inputs with o.encode('utf-8') before the __len__/fileno probes so the length counts bytes.
- **Tests require:** PreparedRequest.headers['Content-Length'] equals len(str.encode('utf-8')) for non-ASCII data, unchanged for bytes (in statement); httpbin fixture (NOT in statement)
- **How to verify:** Inline: prepare requests.Request('POST', url, data='multi-byte snowman') and compare header with encoded length.
- **Most likely failure:** Encoding at the wrong layer (prepare_body/models) or double-encoding bytes and latin-1 data; ignoring urllib3 version semantics.
- **Gold footprint:** 1 file(s), +3/-0 lines: `src/requests/utils.py`; drivers: network fixture; local grading blocked: httpbin

##### `requests_6592` - Add TOO_EARLY alias for status code 425 in requests.codes lookup

- **Class:** C1 Bug fix / NET Network / HTTP protocol behaviour / R01 missing branch / unhandled input class / route P2 Repro-driven bugfix / statement L4 / spec gap none / difficulty 1
- **Root cause:** The status_codes.py data table maps 425 only to ('unordered_collection', 'unordered'); the RFC 8470 name 'too_early'/'TOO_EARLY' is absent, so requests.codes lookups for it return None instead of 425.
- **Why it existed:** RFC 8470 introduced 425 TOO_EARLY after requests' status table was written; the alias was never added (#6584).
- **Fix:** Extend the 425 entry to ('unordered_collection', 'unordered', 'too_early'); the module's loop exposes every alias through the case-insensitive codes lookup.
- **Tests require:** requests.codes.get('TOO_EARLY'/'too_early'/'UNORDERED_COLLECTION'/'unordered'/...) == 425 (in statement)
- **How to verify:** Inline: assert requests.codes.get('too_early') == 425 after the edit.
- **Most likely failure:** Adding the alias in a wrong structure instead of the 425 tuple, or not realizing lookups lowercase automatically.
- **Gold footprint:** 1 file(s), +1/-1 lines: `src/requests/status_codes.py`; local grading blocked: httpbin

##### `requests_6629` - Make JSONDecodeError picklable by delegating __reduce__ to the JSON parent

- **Class:** C1 Bug fix / OBJ Object protocol and duck typing / R01 missing branch / unhandled input class / route P1 Prescribe / statement L2 / spec gap none / difficulty 2
- **Root cause:** JSONDecodeError(InvalidJSONError, CompatJSONDecodeError) inherits pickle's __reduce__ from RequestException (the IOError branch, first in the MRO), which serializes only one arg; CompatJSONDecodeError's doc/pos args are dropped, so pickle.loads reconstructs with wrong arity and raises. No __reduce__ override existed.
- **Why it existed:** Multiple-inheritance exception combining IOError and json.JSONDecodeError; MRO pickling semantics were never considered (#6628).
- **Fix:** Add __reduce__ returning CompatJSONDecodeError.__reduce__(self) so the JSON parent's reducer carries all three instantiation args.
- **Tests require:** requests.exceptions.JSONDecodeError(msg, doc, pos) survives pickle.loads(pickle.dumps(...)) with equal repr (in statement)
- **How to verify:** Inline: round-trip a 3-arg JSONDecodeError through pickle and compare repr.
- **Most likely failure:** Hand-rolling __reduce__ with wrong args, or adding __getstate__/__setstate__ instead of delegating to the correct parent's reducer.
- **Gold footprint:** 1 file(s), +10/-0 lines: `src/requests/exceptions.py`

##### `requests_6644` - Collapse leading double slashes in request URL so urllib3 does not reparse it

- **Class:** C1 Bug fix / NET Network / HTTP protocol behaviour / R01 missing branch / unhandled input class / route P2 Repro-driven bugfix / statement L2 / spec gap minor / difficulty 2
- **Root cause:** HTTPAdapter.request_url returns request.path_url verbatim; when the path starts with '//' (empty first segment), urllib3 re-parses the request-target as an absolute URI with host and port instead of a path, sending the request to the wrong target. No normalization branch existed.
- **Why it existed:** urllib3 request-target parsing treats leading '//' as scheme-relative; requests never normalized such paths (#6643).
- **Fix:** In request_url, if url.startswith('//') replace it with '/' + url.lstrip('/') before returning.
- **Tests require:** HTTPAdapter().request_url(prepared 'http://127.0.0.1:10000//v:h', {}) returns '/v:h' (trimming in statement; method name NOT in statement)
- **How to verify:** Inline: prepare that exact URL and assert adapter.request_url == '/v:h'.
- **Most likely failure:** Normalizing in models.path_url or PreparedRequest.url instead of adapters.request_url; stripping interior double slashes.
- **Gold footprint:** 1 file(s), +3/-0 lines: `src/requests/adapters.py`

##### `requests_6757` - Gate super_len string encoding on urllib3 major version; add is_urllib3_1 compat flag

- **Class:** C1 Bug fix / CMP Compatibility shims (secondary NET) / R15 dependency / compatibility / tooling drift / route P6 Compat-shim / statement L2 / spec gap severe / difficulty 4
- **Root cause:** super_len unconditionally encodes str to UTF-8 (added for urllib3 2.x byte counting), but urllib3 1.26 sends strings latin-1, so on 1.26.x Content-Length no longer matches the transmitted body. compat.py has no urllib3 version detection to branch on.
- **Why it existed:** Regression from the #6589 UTF-8 encode once the project re-supports urllib3 1.26.x; the two urllib3 majors differ in wire encoding.
- **Fix:** compat.py detects the urllib3 major version into is_urllib3_1 (default True on parse failure); utils.super_len applies the UTF-8 encode only when not is_urllib3_1.
- **Tests require:** requests.compat.is_urllib3_1 importable (NOT in statement); UTF-8 Content-Length for str kept on urllib3 2.x, skipif-gated on 1.x (NOT in statement)
- **How to verify:** Existing content-length tests in tests/test_requests.py; inline header check under the installed urllib3.
- **Most likely failure:** Only editing CI/tox config per the title and never adding is_urllib3_1 to compat.py, or removing the encode entirely and breaking urllib3 2.x byte counting.
- **Gold footprint:** 2 file(s), +16/-1 lines: `src/requests/compat.py`; `src/requests/utils.py`; drivers: terse statement, several files, new public name to guess, network fixture; local grading blocked: httpbin

##### `requests_7205` - Ignore netrc entries whose authenticators are all empty strings

- **Class:** C1 Bug fix / SEC Security and auth / R05 upstream dependency change / route P2 Repro-driven bugfix / statement L2 / spec gap none / difficulty 2
- **Root cause:** get_netrc_auth treats any truthy authenticators tuple as credentials: since Python 3.11 netrc returns ('', '', '') for entries without login/account/password (e.g. a bare 'default'), so requests sent an empty Authorization value instead of ignoring the profile. Only 'if _netrc' was checked.
- **Why it existed:** CPython 3.11 changed netrc to return empty tuples for credential-less entries instead of raising NetrcParseError; requests assumed pre-3.11 semantics.
- **Fix:** In get_netrc_auth change the guard to 'if _netrc and any(_netrc)' so all-empty tuples fall through and return None.
- **Tests require:** get_netrc_auth returns None for a bare 'default' netrc entry while real machine credentials still resolve (in statement); NETRC env var setup (NOT in statement)
- **How to verify:** Inline: temp .netrc with a 'default' line, NETRC env set, assert get_netrc_auth('http://host/') is None.
- **Most likely failure:** Testing equality against the exact ('', '', '') tuple, or wrongly skipping entries where only some fields are empty (any() keeps those).
- **Gold footprint:** 1 file(s), +1/-1 lines: `src/requests/utils.py`; local grading blocked: httpbin

##### `requests_7309` - Skip Content-Type parameters lacking equals instead of emitting True sentinel values

- **Class:** C1 Bug fix / NET Network / HTTP protocol behaviour / R10 error-handling gap / route P1 Prescribe / statement L2 / spec gap minor / difficulty 1
- **Root cause:** _parse_content_type_header initializes value=True and stores every non-empty parameter, so malformed tokens without '=' (e.g. 'charset') enter params_dict as boolean True, violating the RFC-required key=value parameter syntax and poisoning downstream consumers such as get_encoding_from_headers.
- **Why it existed:** Historic fallback default no consumer could use; RFC 1521 through 9110 all require '=' for parameters (#6646).
- **Fix:** Store a parameter only when it contains '=' (walrus find check); drop the True default and rename items_to_strip to strip_chars.
- **Tests require:** _parse_content_type_header omits '='-less params (in statement); get_encoding_from_headers({'content-type': 'text/html; charset'}) == 'ISO-8859-1' (NOT in statement)
- **How to verify:** Inline: parse 'text/html; charset' and assert the params dict is empty.
- **Most likely failure:** Keeping the True sentinel for compatibility, or also changing parse_dict_header, whose no-value convention is None.
- **Gold footprint:** 1 file(s), +6/-9 lines: `src/requests/utils.py`

##### `requests_7315` - Stop collapsing leading slashes in request_url so S3 presigned URLs stay valid

- **Class:** C1 Bug fix / NET Network / HTTP protocol behaviour / R04 regression from an earlier change / route P2 Repro-driven bugfix / statement L2 / spec gap minor / difficulty 1
- **Root cause:** The 6644-era trimming in HTTPAdapter.request_url rewrites '//key' paths to '/key', altering the request-target of S3 presigned URLs whose keys start with '/', so the signature no longer matches and S3 rejects the request. The normalization applies unconditionally to all non-proxied URLs.
- **Why it existed:** Regression from the #6644 urllib3 double-slash workaround, which broke legitimately double-slashed paths (#6711).
- **Fix:** Delete the two trimming lines in request_url, restoring request.path_url verbatim.
- **Tests require:** request_url preserves '//v:h' and '//key_name' paths exactly (behaviour in statement; method name in statement)
- **How to verify:** Inline: prepare 'https://bucket.s3.amazonaws.com//key.txt' and assert request_url keeps '//key.txt'.
- **Most likely failure:** Re-implementing a smarter trim (e.g. proxied URLs only) instead of deleting, or editing path_url generation in models.
- **Gold footprint:** 1 file(s), +0/-2 lines: `src/requests/adapters.py`

##### `requests_7328` - Stop including the current response in its own redirect history

- **Class:** C1 Bug fix / NET Network / HTTP protocol behaviour / R06 boundary / empty-input / off-by-one error / route P2 Repro-driven bugfix / statement L2 / spec gap none / difficulty 2
- **Root cause:** resolve_redirects appends resp to hist before slicing: 'hist.append(resp); resp.history = hist[1:]'. hist[1:] only removes the original response, so from the second redirect on each intermediate response contains itself in its own history - an off-by-one slice; history must be assigned before the append (or sliced [:-1]).
- **Why it existed:** Long-standing off-by-one in history bookkeeping; the self-reference also delays garbage collection (#6295).
- **Fix:** Assign resp.history = hist[:] before appending resp, keeping the original response out and never including resp itself.
- **Tests require:** For a 3-redirect chain: len(r.history)==3, no resp in resp.history, resp.history == r.history[:i] (in statement)
- **How to verify:** Inline against a local redirect server or existing history tests, asserting the prefix-chain property.
- **Most likely failure:** Slicing hist[:-1] after the append but breaking Session.send's final-response history, or sharing mutated list objects between responses.
- **Gold footprint:** 1 file(s), +1/-2 lines: `src/requests/sessions.py`; drivers: network fixture; local grading blocked: httpbin

##### `requests_7427` - Match no_proxy entries only at domain boundaries, like CPython bpo-39057

- **Class:** C1 Bug fix / NET Network / HTTP protocol behaviour / R02 wrong assumption about data shape or type / route P2 Repro-driven bugfix / statement L2 / spec gap minor / difficulty 3
- **Root cause:** should_bypass_proxies matches with hostname.endswith(host) / host_with_port.endswith(host): plain suffix matching crosses domain boundaries ('prelocalhost'.endswith('localhost')), ignores ports in entries ('newdomain.com:1234' matches any port), and never exact-matches leading-dot entries ('.d.o.t'). No boundary or port discipline existed.
- **Why it existed:** no_proxy suffix matching was undefined behaviour since implementation; CPython (bpo-39057) and curl later defined domain-boundary semantics (#4795).
- **Fix:** lstrip('.') each no_proxy entry; return True on exact hostname or host_with_port equality, otherwise match only endswith('.' + host).
- **Tests require:** should_bypass_proxies(url, no_proxy='localhost, anotherdomain.com, newdomain.com:1234, .d.o.t') across exact/port/dotted cases incl. 'prelocalhost' False (name NOT in statement; semantics in statement)
- **How to verify:** Inline the bpo-39057 case matrix: prelocalhost must not bypass, port-qualified entries must match exactly.
- **Most likely failure:** Keeping bare endswith (prelocalhost still bypasses), forgetting lstrip('.') so dotted entries never match, or mishandling port-qualified entries.
- **Gold footprint:** 1 file(s), +4/-2 lines: `src/requests/utils.py`

##### `requests_7433` - Detect stream bodies through __getattr__ proxies in prepare_body again

- **Class:** C1 Bug fix / OBJ Object protocol and duck typing (secondary NET) / R04 regression from an earlier change / route P1 Prescribe / statement L2 / spec gap none / difficulty 2
- **Root cause:** prepare_body gates stream handling on isinstance(data, Iterable); collections.abc checks probe the type, so wrappers exposing __iter__/read only via __getattr__ are misclassified as plain data - the stream path (super_len, rewind-on-redirect) is skipped and the body is consumed wrongly. The old hasattr(data, '__iter__') duck-typing fallback was dropped in the isinstance modernization.
- **Why it existed:** Modernization replaced hasattr duck-typing with isinstance(data, Iterable), regressing __getattr__-based file wrappers from 2.33.1 behavior (#7432).
- **Fix:** Compute is_iterable = isinstance(data, Iterable) or hasattr(data, '__iter__') and use it in the exclusion check, keeping the str/bytes/list/tuple/Mapping filters.
- **Tests require:** data=AttrProxy wrapping BytesIO via __getattr__ posts through a 307 redirect and echoes its data (class shape in statement)
- **How to verify:** Inline: wrap BytesIO in a __getattr__ proxy, post to a redirect endpoint, check echoed body.
- **Most likely failure:** Adding hasattr while dropping the (str, bytes, list, tuple, Mapping) exclusion, or switching to hasattr(data, 'read') and misclassifying iterables.
- **Gold footprint:** 1 file(s), +3/-3 lines: `src/requests/models.py`; drivers: network fixture; local grading blocked: httpbin

##### `requests_7502` - Detect __getattr__ file wrappers in _encode_files via hasattr read

- **Class:** C1 Bug fix / OBJ Object protocol and duck typing / R04 regression from an earlier change / route P3 Title-hunt / statement L4 / spec gap minor / difficulty 3
- **Root cause:** _encode_files classifies file objects with isinstance(fp, _SupportsRead); runtime-checkable protocol checks use inspect.getattr_static, so __getattr__-based wrappers (e.g. tempfile.NamedTemporaryFile's _TemporaryFileWrapper) fail it, fall into the else branch, and the raw file object is passed as RequestField data, producing a garbled multipart body.
- **Why it existed:** Same runtime-protocol modernization blind spot as #7432: isinstance checks stopped triggering instance __getattr__.
- **Fix:** Extend the branch to isinstance(fp, _SupportsRead) or hasattr(fp, 'read') so proxied readers still run fdata = fp.read().
- **Tests require:** files={'file': tempfile.NamedTemporaryFile('w+')} posts contents echoed in r.json()['files']['file'] (test name NOT in statement)
- **How to verify:** Inline: post a NamedTemporaryFile or read-proxy via files= and check echoed contents.
- **Most likely failure:** Assuming NamedTemporaryFile passes isinstance and hunting elsewhere; the 67-char title gives no repro, so the agent must trust _encode_files inspection.
- **Gold footprint:** 1 file(s), +3/-1 lines: `src/requests/models.py`; drivers: terse statement, network fixture; local grading blocked: httpbin


#### requests: Refactor (1 tasks)

##### `requests_7505` - Consolidate read detection into has_read helper for remaining isinstance sites

- **Class:** C3 Refactor / OBJ Object protocol and duck typing / R03 duplicated or parallel logic out of sync / route P7 Mechanical-sweep / statement L2 / spec gap minor / difficulty 2
- **Root cause:** The #7502 hasattr fix existed only in _encode_files; _encode_params and prepare_body still used raw isinstance(..., _SupportsRead), so read proxies were misclassified there too (params not passed through, content_type decided wrongly). The duplicated parallel isinstance checks had drifted out of sync.
- **Why it existed:** Successor cleanup after #7502: the same runtime-protocol/__getattr__ gap remained at the other two call sites.
- **Fix:** Add _types.has_read(obj) TypeIs helper (isinstance SupportsRead or hasattr 'read'); use it in _encode_params, _encode_files and prepare_body, replacing the _SupportsRead import.
- **Tests require:** data=ReadProxy exposing read but raising AttributeError for __iter__ posts 'streamed body' (proxy class NOT in statement); requests._types.has_read (NOT in statement)
- **How to verify:** Inline: post a read-only __getattr__ proxy and check the echoed body; verify imports still resolve.
- **Most likely failure:** Refactoring imports so models.py breaks (the _t alias moves from TYPE_CHECKING to runtime), or missing prepare_body's basestring+_SupportsRead compound condition.
- **Gold footprint:** 2 file(s), +9/-7 lines: `src/requests/_types.py`; `src/requests/models.py`; drivers: network fixture; local grading blocked: httpbin


### 9.4 httpx (1 tasks)

#### httpx: Bug fix (1 tasks)

##### `httpx_3672` - Fix server keep-alive: reset parser, drain request bodies, close streams, handle Ctrl-C

- **Class:** C1 Bug fix / NET Network / HTTP protocol behaviour / R01 missing branch / unhandled input class / route P3 Title-hunt / statement L4 / spec gap severe / difficulty 4
- **Root cause:** HTTPConnection.handle_requests never completes the keep-alive cycle: _complete references self._parser.complete without calling it, and the request stream is never read to completion after the response, so parser state is wrong for the next request on the connection. HTTPServer.wait spins in while(True) with no KeyboardInterrupt handling; NetworkServer never tracks or closes open streams (assigns the list type, not instances).
- **Why it existed:** Experimental server code shipped incomplete; keep-alive completion, stream bookkeeping, and Ctrl-C handling were never wired or tested.
- **Fix:** Rename HTTPParser.complete to reset returning bool and add is_keepalive(); pool/server _complete become _reset; server drains stream.read() when is_keepalive() before reset; NetworkStream gains is_closed and server exit closes streams; wait() catches KeyboardInterrupt.
- **Tests require:** HTTPParser.reset() replacing complete() at five call sites, keep-alive reuse vs CLOSED state transitions (reset in statement; is_keepalive naming NOT in statement)
- **How to verify:** Existing tests/test_parsers.py parser tests with complete renamed to reset; inline state-machine assertions on reset/close.
- **Most likely failure:** Applying the rename but missing the duplicated sync/async twins (httpx vs ahttpx) or the missing call parentheses; skipping drain-before-reset; guessing keep_alive instead of is_keepalive.
- **Gold footprint:** 7 file(s), +57/-22 lines: `src/ahttpx/_parsers.py`; `src/ahttpx/_pool.py`; `src/ahttpx/_server.py`; `src/httpx/_network.py`; `src/httpx/_parsers.py`; `src/httpx/_pool.py` ...; drivers: several files, terse statement, new public name to guess, tests compare exact strings

## 10. Quality control and limitations

### 10.1 Checks performed

| Check | Result |
|---|---|
| Records merged from 13 independent review batches | 129 of 129 tasks, no duplicates, no missing or extra ids |
| Category, sub-category, mechanism and route codes against their closed lists | 129 of 129 valid |
| Spec gap, difficulty and difficulty drivers against their closed lists | 129 of 129 valid |
| File list in each record versus the gold patch | recall 1.00, precision 1.00 |
| Word limits of the analysis fields | all within limit (tolerance of three words) |
| Deterministic features recomputed from `tasks.jsonl` and the snapshots | reproducible with the scripts listed below |
| Markdown tables | every table checked for a constant column count per row and for unescaped pipes (report in `03_Validation_Results_and_Submission_Playbook.md`) |
| Numbers quoted in the prose | all inserted from the merged records at render time; no number typed by hand except shares that are simple ratios of two inserted counts |

### 10.2 Known limitations

- **Judgement, not measurement.** Category, mechanism, spec gap and difficulty are expert codings of one pass each. They are consistent (closed lists, cross-checked file lists) but were not double-coded, so a different reviewer could move individual tasks between neighbouring codes - most likely between C1 and C4 where a fix is also a contract change, and between the R02, R03 and R07 mechanisms.
- **Difficulty is not a resolve rate.** It estimates how a Gemma 4 31B agent fares under a five-minute budget with the stock harness tools. It was not calibrated against agent runs.
- **The scoring harness derives its own required-test list.** "Tests require" was read from the test patch; the grader may require more or fewer tests.
- **The hidden set is different.** It comes from private repositories. Every distribution in this document describes the published development tasks.
- **Twenty-nine tasks cannot be graded locally.** Findings that depend on running the hidden tests exclude them by necessity.
- **Linked issue bodies were not available.** For the 27 title-plus-link tasks the analysis used the gold patch and the tests to recover intent; an agent in the sandbox has only the title.

### 10.3 Reproduction

All analysis code is in the scratch folder `scratch/2026-11-23-bcf-brain/scripts/` of the project: `tools_profile.py`, `tools_features.py`, `tools_snapshot_index.py`, `tools_build_packs.py`, `tools_show_base.py` (the base-commit viewer used during review), the coding scheme `RCA-SCHEMA.md`, `tools_merge_rca.py` (merge and cross-check) and `tools_render_task1.py` (this document). Intermediate data (features, packs, the 129 coded records) is in `scratch/2026-11-23-bcf-brain/data/`.

## 11. Sources

- Competition data: `gemma-4-developer-agent.zip` (`tasks.jsonl`, 129 snapshots) and `HARNESS_README.md`; `swegemma` 0.2.11, `adk-submission` 0.2.13, `adk-eval-core` 0.1.0 from the public wheelhouse (dataset version 31).
- Discussion board (Kaggle, competition `gemma-4-developer-agent`): 752848 (first edit timing in solved and failed runs), 756400 (audit of the 129 tasks), 760014 (1,800-trial E4B study: tests passing before the patch), 760595 (E4B trace diagnosis and the comment on compile-check compliance), 745998 (code graphs and async functions), 761060 (ceiling and budget discussion).
- Local intelligence packages: `input/kagglecomp/intel_20261120` and the live capture of 2026-11-24 00:29 UTC (board 364 to 378 topics, leaderboard 6,591 teams).
