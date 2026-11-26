# Data digest — `httpx_3672`, its nearest neighbours, and the 129-task public set

All numbers recomputed 2026-11-25 from the local sources by `scratch/2026-11-25-bcf-naive-vs-brain-sim/scripts/agentB_digest.py`, `agentB_neighbours.py`, `agentB_testpatch_detail.py`, `agentB_final_checks.py` (read-only over sources). Nothing outside the project tree was used.

Source tags (all relative to the project root):

- **T** — `input/kagglecomp/kagglecomp_data_package/tasks.jsonl` (129 lines; fields `instance_id, repo, base_commit, patch, test_patch, problem_statement, hints_text, created_at`)
- **R** — `deliverables/2026-11-23_BCF_Brain_and_Dataset_RCA/data/rca_merged.jsonl` (129 coded records)
- **S** — `deliverables/2026-11-23_BCF_Brain_and_Dataset_RCA/data/rca_stats.json`
- **D1** — `deliverables/2026-11-23_BCF_Brain_and_Dataset_RCA/01_Dataset_Taxonomy_and_Root_Cause_Analysis.md`
- **D2** — `deliverables/2026-11-23_BCF_Brain_and_Dataset_RCA/02_BCF_Brain_Design_and_Justification.md`
- **SC** — `deliverables/2026-11-23_BCF_Brain_and_Dataset_RCA/analysis/RCA-SCHEMA.md`

Cross-checks run: category / mechanism / route / sub-category counts recomputed from R are identical to S (`agentB_final_checks.py` output: "category match: True", "mechanism match: True", "route match: True", "sub_primary match: True"); statement-length counts recomputed from T match the package's `features.jsonl` (`stmt<300: package features = 55 | mine = 55`).

---

## 1. The `httpx_3672` record

| Field | Value | Source |
|---|---|---|
| instance_id | `httpx_3672` | T line 78 |
| repo | `encode/httpx` | T line 78 |
| base_commit | `4acf5c2c37714cc63b5cf71b3e284fca83c90311` | T line 78 |
| created_at | `2025-09-19T11:03:13Z` | T line 78 |
| hints_text | `""` (empty) | T line 78 |
| statement length | 243 chars, 5 bullets | T line 78; R line 129 (`stmt_len`) |
| gold patch | 7 files, +57 / −22 lines, 0 new files | T line 78; R line 129 (`gold_files/gold_add/gold_rem`) |
| test patch | 1 file (`tests/test_parsers.py`), +5 / −5, 5 hunks, modifies existing tests only | T line 78 |

**Problem statement, verbatim** (T line 78, field `problem_statement`):

> Server connection handling.
>
> \* Add `HTTPParser.keep_alive`.
> \* Server... always read request to completion on keep alives.
> \* `HTTPParser.complete` -> `.reset`
> \* Close streams on server exit.
> \* Don't raise `KeyboardException` on server exit.

(Note "KeyboardException" is quoted as-is from the statement; the gold patch catches `KeyboardInterrupt` — T line 78, patch line `+            except KeyboardInterrupt:`.)

**Gold patch, per file** (computed from T line 78 `patch`; identical list in R line 129 `gold_paths` and D1:2143):

| File | + | − |
|---|---:|---:|
| `src/ahttpx/_parsers.py` | 10 | 2 |
| `src/ahttpx/_pool.py` | 4 | 4 |
| `src/ahttpx/_server.py` | 7 | 4 |
| `src/httpx/_network.py` | 11 | 1 |
| `src/httpx/_parsers.py` | 10 | 2 |
| `src/httpx/_pool.py` | 4 | 4 |
| `src/httpx/_server.py` | 11 | 5 |

Key patch content (line offsets within the `patch` string, T line 78): `-    async def complete(self):` → `+    async def reset(self) -> bool:` (ahttpx twin) and `-    def complete(self):` → `+    def reset(self) -> bool:` (httpx twin); `+    def is_keepalive(self) -> bool:` added in both `_parsers.py`; `-        stream = HTTPStream(self._recv_body, self._complete)` updated to `self._reset` in 4 files; `-    async def _complete(self) -> None:` / `-    def _complete(self) -> None:` deleted (pool + server, both trees).

**Test patch — every hunk modifies an existing visible test call site** (T line 78 `test_patch`):

| Hunk header (base line) | Test function changed | Change |
|---|---|---|
| `@@ -67,7 +67,7 @@` | `test_parser` | `-    p.complete()` → `+    p.reset()` |
| `@@ -113,7 +113,7 @@` | `test_parser_server` | `-    p.complete()` → `+    p.reset()` |
| `@@ -315,7 +315,7 @@` | `test_parser_repr` | `-    p.complete()` → `+    p.reset()` |
| `@@ -554,7 +554,7 @@` | `test_client_connection_close` | `-    p.complete()` → `+    p.reset()` |
| `@@ -591,7 +591,7 @@` | `test_server_connection_close` | `-    p.complete()` → `+    p.reset()` |

**Hidden vs visible tests: modified, not added.** The test patch touches one pre-existing file, `tests/test_parsers.py`, adds no new file and no new test function, and consists of exactly five one-line replacements that rename calls the visible tests already make (`p.complete()` → `p.reset()`). So at base commit the visible suite calls `HTTPParser.complete`; the statement orders that method renamed; a fix that follows the statement makes the visible tests red (`AttributeError: 'HTTPParser' object has no attribute 'reset'` — inferred, see §5); the hidden patch rewrites the five call sites to match.

**Per-task card, verbatim** (D1:2134–2143):

> ##### `httpx_3672` - Fix server keep-alive: reset parser, drain request bodies, close streams, handle Ctrl-C
>
> - **Class:** C1 Bug fix / NET Network / HTTP protocol behaviour / R01 missing branch / unhandled input class / route P3 Title-hunt / statement L4 / spec gap severe / difficulty 4
> - **Root cause:** HTTPConnection.handle_requests never completes the keep-alive cycle: _complete references self._parser.complete without calling it, and the request stream is never read to completion after the response, so parser state is wrong for the next request on the connection. HTTPServer.wait spins in while(True) with no KeyboardInterrupt handling; NetworkServer never tracks or closes open streams (assigns the list type, not instances).
> - **Why it existed:** Experimental server code shipped incomplete; keep-alive completion, stream bookkeeping, and Ctrl-C handling were never wired or tested.
> - **Fix:** Rename HTTPParser.complete to reset returning bool and add is_keepalive(); pool/server _complete become _reset; server drains stream.read() when is_keepalive() before reset; NetworkStream gains is_closed and server exit closes streams; wait() catches KeyboardInterrupt.
> - **Tests require:** HTTPParser.reset() replacing complete() at five call sites, keep-alive reuse vs CLOSED state transitions (reset in statement; is_keepalive naming NOT in statement)
> - **How to verify:** Existing tests/test_parsers.py parser tests with complete renamed to reset; inline state-machine assertions on reset/close.
> - **Most likely failure:** Applying the rename but missing the duplicated sync/async twins (httpx vs ahttpx) or the missing call parentheses; skipping drain-before-reset; guessing keep_alive instead of is_keepalive.
> - **Gold footprint:** 7 file(s), +57/-22 lines: `src/ahttpx/_parsers.py`; `src/ahttpx/_pool.py`; `src/ahttpx/_server.py`; `src/httpx/_network.py`; `src/httpx/_parsers.py`; `src/httpx/_pool.py` ...; drivers: several files, terse statement, new public name to guess, tests compare exact strings

Same codes in the machine record (R line 129): `category C1, sub_primary NET, mechanism R01, route P3, spec_gap severe, difficulty 4, drivers [multi_file, terse_statement, api_naming, exact_string]`. D1 also carries it in the all-129 table (D1:674, row "129") and in the NET prose ("httpx never completed its keep-alive cycle (`httpx_3672`, seven files, the only task with mean difficulty 4 in its repository)" — D1:399).

---

## 2. Taxonomy tables (as the package defines them)

Definitions verbatim; counts are the package's own and were verified equal to recomputed counts from R.

**Categories** (D1:147–152; S `category`):

| Code | Category | Definition | Tasks |
|---|---|---|---:|
| C1 | Bug fix | Wrong behaviour corrected; behaviour after the change matches the documented or intended contract. | 90 |
| C2 | New feature | A capability that did not exist: new parameter, class, response type, API surface. | 18 |
| C3 | Refactor | Internal rework that preserves behaviour (or extends it incidentally): structure, performance, reuse. | 5 |
| C4 | Behaviour change | Deliberate change of an existing contract: deprecation, removal, new warning, stricter check. | 11 |
| C5 | Documentation | Only documentation content or executable examples change. | 3 |
| C6 | Build / tooling | Release scripts, dependency ranges, test infrastructure. | 2 |

**Sub-categories (primary assignment)** (D1:158–174; S `sub_primary`; "Any role" = counting secondary assignments, D1:176):

| Code | Domain | Covers | Primary |
|---|---|---|---:|
| VAL | Request / validation parameter handling | Query, header, cookie, form and body parameters; defaults, aliases, extra fields, sequences, parameter models. | 10 |
| TYP | Type-annotation and model introspection | Unions, discriminators, Annotated, forward references, wrapped functions, stringified annotations, typing constructs. | 10 |
| OAS | Schema / contract generation | OpenAPI and JSON-Schema output: keys, refs, security schemes, media types. | 10 |
| DI | Dependency-injection machinery | Dependency graph construction, caching, hashing, scopes, wrapped or partial dependables, class dependencies. | 9 |
| RTG | Routing and lifecycle | Routers, prefixes, route contexts, startup/shutdown and event hooks, exception handling and traceback metadata. | 9 |
| SER | Serialisation and streaming | Response encoding, response models, server-sent events, response classes. | 4 |
| SEC | Security and auth | Credential headers, status codes, OAuth scopes, strict content-type checks. | 5 |
| CMP | Compatibility shims | Pydantic v1/v2 layers, Starlette compatibility, urllib3 versions, version branches. | 6 |
| WID | Text measurement and segmentation | Cell widths, grapheme clusters, wrapping, split cells, Unicode tables. | 10 |
| PAR | Markup / Markdown / syntax parsing | Escaping, ANSI codes, Markdown tables, highlighters, lexers, regexes. | 9 |
| REN | Widget rendering and styling | Table, panel, live, progress, segments, styles, padding and backgrounds. | 11 |
| CON | Console / terminal I/O | Capture and record, broken pipes, tty detection, proxies, environment switches, import-time behaviour. | 11 |
| DBG | Developer-facing introspection | Tracebacks, pretty printing, repr, inspect, notes and error locations. | 7 |
| NET | Network / HTTP protocol behaviour | Header and content-type parsing, redirects, netrc, URL paths, keep-alive, connection handling. | 8 |
| OBJ | Object protocol and duck typing | isinstance versus capability checks, `__getattr__` proxies, pickling, hashing of objects. | 6 |
| EXM | Documentation examples | Executable example applications that documentation tests import. | 3 |
| BLD | Build, release and tooling | Release automation and developer tooling. | 1 |

**Root-cause mechanisms** (D1:182–197; S `mechanism`):

| Code | Mechanism | Tasks |
|---|---|---:|
| R01 | Missing branch / unhandled input class | 22 |
| R02 | Wrong assumption about data shape or type | 17 |
| R03 | Duplicated or parallel logic out of sync | 13 |
| R04 | Regression from an earlier change | 11 |
| R05 | Upstream dependency change | 3 |
| R06 | Boundary / empty-input / off-by-one error | 6 |
| R07 | Algorithmic flaw (loop, ordering, non-termination) | 7 |
| R08 | Encoding / escaping / whitespace error | 3 |
| R09 | State, identity, caching or hashing error | 5 |
| R10 | Error-handling gap | 7 |
| R11 | Environment / platform assumption | 1 |
| R12 | Contract mismatch | 3 |
| R13 | Incomplete feature | 19 |
| R14 | Design improvement / tech debt | 5 |
| R15 | Dependency / compatibility / tooling drift | 4 |
| R16 | Documentation error | 3 |

**Routes** (counts + one-line "first move" verbatim from D2:437–446; route derivation rule D2:358 and D2:449; short forms in SC):

| Route | Name | Tasks | Mean difficulty | One-line definition (package's "first move") |
|---|---|---:|---:|---|
| P1 | Prescribe | 22 | 1.86 | Run the issue's example; it must fail |
| P2 | Repro-driven bugfix | 27 | 2.33 | Turn the issue's example into a script outside the repository |
| P3 | Title-hunt | 44 | 3.05 | Rank symbols by the issue's words and read the top symbol |
| P4 | Feature-synthesis | 15 | 3.80 | Find the closest sibling implementation and its registration points |
| P5 | Schema-contract | 4 | 3.25 | Print the generated schema for a minimal application |
| P6 | Compat-shim | 3 | 4.33 | Find where the version is detected |
| P7 | Mechanical-sweep | 4 | 3.25 | List every call site |
| P8 | Docs-example | 3 | 2.67 | Find the example module the tutorial tests import |
| P9 | Build-tooling | 1 | 5.00 | Read the neighbouring script |
| P10 | Timeboxed-slice | 6 | 5.00 | Smallest change that satisfies the visible part |

---

## 3. Nearest neighbours of `httpx_3672`

**Scoring.** Every signal computed from T only (`agentB_neighbours.py`); 1 point each:

- **S1 stale-visible-test**: hidden test patch removes lines in a pre-existing test file (not merely adds files). Dataset total: **46 / 129 tasks**; 83 add only new files; 0 do both.
- **S2 public-name removed/renamed**: a `def`/`class`/assignment exists in the gold patch's removed lines and its definition is absent from the added lines of the same file (callers-updated case included).
- **S3 multi-bullet**: statement has ≥ 3 markdown list items (includes PR-template checkbox lines — caveat in §5).
- **S4 mirrored/sweep**: identical added line (≥ 20 chars) repeated across ≥ 2 files, or the same file basename patched in ≥ 2 directories.
- **S5 ask with no dedicated hidden test**: gold patch adds a new public `def`/`class` while the hidden patch adds no new test function, or list items > test functions in the hidden patch.

A post-hoc **tight link** was also checked (not scored): hidden patch's removed lines call a name the gold patch removes as `def`/`class`. Exactly two tasks have it: `httpx_3672` (`complete`, the five call sites above) and `fastapi_14609` (16 pydantic-v1 helper names whose calls are deleted from visible tests).

**Score matrix** (anchor `httpx_3672` scores S1+S2+S3+S4 = 4; it fails S5 because all five bullets map to changed lines inside the five existing test functions):

| Task | S1 | S2 | S3 | S4 | S5 | Score |
|---|---|---|---|---|---|---:|
| rich_4070 | x | x (weak) | x | x | x | **5** |
| fastapi_13786 | x | — | x | x | x | **4** |
| fastapi_14609 | x | x (+tight 16) | — | x | — | **3** |
| rich_3105 | x | — | x (template) | — | x | **3** |
| fastapi_14459 | x | x (weak) | — | x | — | **3** |
| fastapi_15785 | x | — | x | — | x | **3** |

**Top 6** (all fields from T lines 19 / 91 / 36 / 122 / 46 / 81 and coded records in R; summaries are the package's `title_plain`):

| instance_id (repo, T line) | One-line summary of the request | Asks (list items) | Gold files, +/− | Hidden test patch (modifies vs adds) | Shared signals | How its trap differs from `httpx_3672` |
|---|---|---:|---|---|---|---|
| `rich_4070` (Textualize/rich, L19) | Defer heavy imports to cut Console and RichHandler import time | 3 | 9 f, +71/−57 | Modifies: +3/−3 across `tests/test_console.py`, `tests/test_syntax.py`; rewires the existing `fake_input` fixture (`monkeypatch.setattr(rich.console, "getpass", …)` → patching `getpass` module) and moves a `Console` import; no new tests | S1–S5 (5/5) | A *performance refactor* (C3/R14/P7) makes a visible fixture's patch target stale, instead of a protocol bug ordering a rename; hidden patch is the same 5-line-scale in-place edit |
| `fastapi_13786` (fastapi/fastapi, L91) | Return 401 with WWW-Authenticate when credentials missing; add `not_authenticated_status_code` escape hatch | 43 (incl. PR template) | 11 f, +176/−83 | Modifies: +46/−28 across 17 existing security test files; rewrites `403` assertions to `401` + `WWW-Authenticate` in 3 existing test functions; no new test files | S1, S3, S4, S5 | A *deliberate contract change* (C4/R12/P1) that the visible assertions encode in the old form; the statement prescribes the new behaviour (P1) where `httpx_3672`'s is terse (P3) |
| `fastapi_14609` (fastapi/fastapi, L36) | Remove all pydantic.v1 support and raise a dedicated error | 1 | 20 f, +192/−1855 | Modifies + mass-deletes: +32/−1475 across 8 existing files (whole pv1 test files removed); tight link on 16 removed helper names | S1, S2, S4 | Same "correct fix obsoletes visible tests" mechanism at difficulty 5 / route P10 scale — deletion of 1,475 test lines rather than a 5-line rename |
| `rich_3105` (Textualize/rich, L122) | Fix issue #3104 — statement gives no details (HTML export code font) | 9 (all template checkboxes) | 1 f, +1/−1 | Modifies: +3/−3 in `tests/test_console.py` — three expected-HTML strings rewritten | S1, S3, S5 | Terse title-hunt (C1/R11/P3, severe gap) whose visible breakage is *expected-string* drift, not an API rename |
| `fastapi_14459` (fastapi/fastapi, L46) | Fix OAuth2 security scopes missing in OpenAPI for scoped parent dependencies and cached schemes | 1 | 3 f, +49/−22 | Modifies + appends: +70/−3 in one existing file (3 lines edited, 4 new tests) and +79/−0 append-only in a second | S1, S2, S4 | *Duplicated logic out of sync* (R03, the httpx-twin motif) fixed inside one framework, with hidden tests mostly added rather than renamed |
| `fastapi_15785` (fastapi/fastapi, L81) | Add public `iter_route_contexts` for code that walked `router.routes` | 5 | 2 f, +66/−15 | Modifies + appends: +104/−1 in one existing file (import line edited, 4 new test functions added) | S1, S3, S5 | A *feature synthesis* (C2/R13/P4) where the trap is guessing the new public name (`api_naming`), the same naming gap as `is_keepalive` but with additive hidden tests |

Also ran at score 3 with different sub-patterns: `fastapi_14186`, `rich_3052`, `rich_3130`, `fastapi_15588`, `fastapi_14262`; and notable near-misses below the cut: `fastapi_14371` (hidden patch removes `xfail` marks the fix makes obsolete), `fastapi_14978` (hidden patch deletes a visible test that asserts removed behaviour), `requests_7315` (expected-value rewrite in 2 lines), `requests_6757`, `requests_7309`.

**Best second example: `rich_4070`.** It is the only task that hits all five signals, and mechanically it is the `httpx_3672` twin in miniature: a *correct* fix removes a module-level binding (`-from getpass import getpass` in `rich/console.py`, deferred to `import getpass as _getpass_mod` inside the method — T L19 patch), which makes the visible test's `monkeypatch.setattr(rich.console, "getpass", fake_input)` stale, exactly as `p.complete()` goes stale after the rename; the hidden patch is the same tiny in-place edit of existing visible test code (+3/−3 vs +5/−5); and the gold patch repeats one change across sibling files (9 files) like the `httpx`/`ahttpx` twins. Its route (P7 mechanical-sweep) and category (C3 refactor) also widen the deck beyond bug-fix territory. Runner-up: `fastapi_13786` if the deck wants the *contract-change* flavour (visible assertions of the old 403 behaviour rewritten to 401 across 17 files).

---

## 4. Dataset-wide statistics

Computed from T (all 129 records) unless tagged otherwise; medians are over the 129 tasks.

| Metric | Value | Source |
|---|---|---|
| Tasks | 129 | T (129 lines) |
| Repos | `fastapi/fastapi` 67, `Textualize/rich` 48, `psf/requests` 13, `encode/httpx` 1 | T, recomputed; matches SC header ("FastAPI (67 tasks), rich (48), requests (13) or httpx (1)") |
| `created_at` range | 2023-07-29T07:06:41Z (`rich_3061`) → 2026-06-20T00:20:49Z (`fastapi_15800`) | T, recomputed |
| Gold files per task | median 1, max 26 (`rich_3930`) | T, recomputed |
| Gold added / removed lines | median +8 / −2; max +12,170 and −544 (`rich_3930`, total 12,714); max removed 1,855 (`fastapi_14609`) | T, recomputed |
| Gold patch size (add+rem) | median 12 lines | T, recomputed |
| Hidden test patch size (add+rem) | median 31 lines, max 1,507 (`fastapi_14609`) | T, recomputed |
| Hidden patch **modifies existing test lines** | **46 / 129** (list: 25 fastapi, 13 rich, 3 requests, 1 httpx — `httpx_3672` is the only httpx one) | T, recomputed (`agentB_digest.py`) |
| Hidden patch adds only new test files | 83 / 129 (0 tasks do both) | T, recomputed |
| Statements under 300 chars | 55 / 129 (median statement length 418 chars) | T recomputed; confirmed against package `features.jsonl` `stmt_len` |
| Category distribution | C1 90, C2 18, C4 11, C3 5, C5 3, C6 2 | S `category`; verified = recomputed from R |
| Route distribution | P3 44, P2 27, P1 22, P4 15, P10 6, P5 4, P7 4, P6 3, P8 3, P9 1 | S `route`; verified = recomputed from R |
| Spec gap | severe 52, minor 50, none 27 | S `spec_gap` |
| Mean difficulty | 2.92 (httpx 4.0, fastapi 3.12, rich 2.88, requests 2.0) | S `difficulty_mean`, `difficulty_mean_by_repo` |
| Cannot be graded locally | 29 | S `local_ungradable` |

---

## 5. Unconfirmed

1. **The grader's hidden tests are not these test patches.** D1 §10.2: "The hidden set is different. It comes from private repositories." So "a correct fix turns the visible tests red" describes the relationship between the gold patch and the *published* `test_patch` field, not necessarily the actual grading set.
2. **The red-test failure mode is inferred, not executed.** No repo checkout was run; `AttributeError` for `p.complete()`-callers and `rich_4070`'s stale-monkeypatch failure are conclusions from diff content.
3. **Weak S2 positives.** The name-removal heuristic also fires on local assignments; for `rich_4070` (`variants`, `currentframe`, `frame`, `frame_info`) and `fastapi_14459` (`alias`, `loc`, …) these are locals/params, not public API. The strong rename evidence is `httpx_3672` (`complete`, `_complete`) and the `fastapi_14609` tight link.
4. **Bullet counts include PR-template checkbox lines** (markdown list items). `rich_3105`'s nine "asks" are all template checkboxes; its real ask is one line ("Fix #3104"). `fastapi_13786`'s 43 likewise include template structure.
5. **Statement quirks treated as data:** `KeyboardException` (presumably means `KeyboardInterrupt`) and bullet 1's `HTTPParser.keep_alive` versus the implemented `is_keepalive()` — the mismatch is the card's own reading ("is_keepalive naming NOT in statement", R line 129); the upstream API was not verifiable offline.
6. **Codings are single-pass expert judgement,** not double-coded and not calibrated against agent runs (D1 §10.2); `difficulty` is an estimate, not a resolve rate.
7. **Mirrored twins:** the `src/httpx` vs `src/ahttpx` mirror is inferred from identical added lines across both trees plus the card's "duplicated sync/async twins" wording; no repo documentation was consulted.
8. **`n_test_funcs: 0` in R line 129** counts *newly added* test functions in the hidden patch (zero for `httpx_3672`); it does not mean no tests changed — five existing functions were edited (T line 78).
