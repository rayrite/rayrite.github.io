# Task 1: Exhaustive Dataset Classification & Root Cause Analysis — Kaggle Gemma 4 Developer Agent Competition

*Scope: Complete, code-grounded classification of all **129 tasks** in `input/kagglecomp/kagglecomp_data_package/tasks.jsonl` into a repo-agnostic 6-category / 21-subcategory software-engineering taxonomy, followed by detailed code-level Root Cause Analysis (RCA) for every single one of the **103 tasks containing bugs or errors**, architectural profiling of the 26 non-bug tasks, and cross-cutting insights powering the Batonic Coding Framework (BCF).*  
*Date: 2026-11-20 | Primary Ground Truth: `tasks.jsonl` (129 tasks, reference `patch` and `test_patch`), `HARNESS_README.md`, and Kaggle Discussion Board audits through 2026-11-20.*

---

## 1. Executive Summary & Dataset Census

The public development dataset (`tasks.jsonl`) contains **129 real-world Python software engineering tasks** drawn from four repositories: **`fastapi/fastapi` (67 tasks, 51.9%)**, **`Textualize/rich` (48 tasks, 37.2%)**, **`psf/requests` (13 tasks, 10.1%)**, and **`encode/httpx` (1 task, 0.8%)**. Every task ships with a frozen Git snapshot at `base_commit`, an empty `hints_text` field across all 129 records (0/129 populated), a reference `patch` modifying strictly Python files (0 non-`.py` files modified in reference patches), and a hidden verification `test_patch`.

Across the full 129-task corpus, **103 tasks (79.8%) contain concrete bugs or errors** (84 pure Bug Fixes, 10 Refactor + Bug Fixes, and 9 Feature + Bug Fixes), while **26 tasks (20.2%)** are pure Feature additions (16), Deprecations/Removals (4), Tooling/Docs updates (4), or pure internal Refactors (2). Crucially for autonomous agent design, **91 tasks (70.5%) modify only a single `.py` file** (median patch churn across all 129 tasks is just **12 added+removed lines**; 73/129 tasks change `<= 15` lines), whereas **38 tasks (29.5%) require coordinated multi-file changes**—and multi-file complexity is heavily concentrated in `FEAT_API` (15/20 = 75.0%) and `MAINT_LIFECYCLE` (6/11 = 54.5%), whereas **82.7% (81/98)** of pure defect-category tasks (`BUG_*`) are surgical single-file fixes.

### 1.1 Repository-Level Census

| Repository | Total Tasks | Share | Bug/Error Tasks | Pure Non-Bug | Single-File | Multi-File | Touches `async` | Sparse Prompt (<150c) | Median Churn (Lines) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `fastapi/fastapi` | 67 | 51.9% | 48 | 19 | 43 | 24 | 15 | 8 | 18 |
| `Textualize/rich` | 48 | 37.2% | 42 | 6 | 37 | 11 | 0 | 25 | 10 |
| `psf/requests` | 13 | 10.1% | 12 | 1 | 11 | 2 | 0 | 1 | 4 |
| `encode/httpx` | 1 | 0.8% | 1 | 0 | 0 | 1 | 1 | 0 | 79 |
| **Total** | **129** | **100.0%** | **103** | **26** | **91** | **38** | **16** | **34** | **12** |

### 1.2 Patch Churn & Complexity Distribution

| Churn Tier (`+add` + `-rem`) | Tasks | Share | Bug/Error Tasks | Multi-File Tasks | Complexity Implication for Gemma 4 |
| :--- | :---: | :---: | :---: | :---: | :--- |
| 1–5 lines (Micro-Surgical) | 43 | 33.3% | 39 | 0 | Highest EV for both 31B and E4B; 1-hunk guard, operator, or keyword fix. |
| 6–15 lines (Focused Local) | 30 | 23.3% | 27 | 5 | Core sweet spot; requires exact symbol localization and careful edge-case verification. |
| 16–50 lines (Function / Method Rewrite) | 27 | 20.9% | 22 | 9 | Strong 31B target; E4B needs line-range patching and AST verification to avoid truncation. |
| 51–200 lines (Subsystem / Multi-Method) | 19 | 14.7% | 11 | 15 | High coordination risk; requires structured plan + sibling/caller inventory. |
| >200 lines (Architectural / Feature) | 10 | 7.8% | 4 | 9 | Near-zero single-shot solve rate on E4B; 31B requires strict scope discipline. |

### 1.3 Local Sandbox Solvability & Benchmark Hygiene Caveats

Cross-referencing `tasks.jsonl` against community sandbox audits (Threads `#745855`, `#751487`, `#755554`, `#756400`, `#756587`, `#757661`, `#757893`, and `#760595`) reveals that **local pass rates on the 129 public tasks are severely distorted by missing test dependencies and verifier bugs** unless calibrated:

| Benchmark Distortion Mechanism | Affected Public Tasks | Root Cause in Local Harness / Dataset | Private-Test Status (Host Rulings) |
| :--- | :---: | :--- | :--- |
| Missing `inline_snapshot` / `dirty_equals` wheels | ~27–34 `fastapi` tasks (18 direct `inline_snapshot` + 5 `dirty_equals` in `test_patch`, plus transitive test-file imports) | Absent from default offline `/wheels` in the Getting Started notebook; pytest fails at collection regardless of patch (`#756587`, `#757661`). | Host confirmed hidden private tasks validate **100% with gold patches** (`#744370`, `#747248`). |
| Air-gapped `httpbin` / network-timeout fixtures | 8–12 `requests` tasks (`requests_6589`, `6592`, `6629`, `6757`, `7328`, `7433`, `7502`, `7505`, etc.) | Docker `network_mode="none"` causes instant `OSError: Network unreachable` or missing `pytest-httpbin` fixture (`#755554`, `#757661`). | Private repos validated 100% offline with gold patches (`#744370`). |
| Verifier skipped-sibling prefix bug (`_validate_junit_xml`) | 2 tasks (`fastapi_14186`, `rich_3486`) | Required test passes, but sibling with `{req_base}_` prefix or version-exclusive `skipif` skips; verifier rejects any skipped match (`#755554`, `#757893`). | Excluded during private-set gold validation if same verifier was used (`#757893`). |
| Python 3.13 `AttributeError` formatting drift | 1 task (`rich_3472`) | Python 3.13 formats multi-line dataclass `AttributeError` differently from Python 3.12 test snapshot (`#755554`). | Python runtime parity controlled in private validation. |
| Uninferable hidden symbol names in `test_patch` | 6 tasks (`fastapi_15661`, `15030`, `14609`, `15785`, `15745`, `rich_3930`) | `test_patch` imports brand-new module/class names never stated in the sparse problem statement (`#745855`). | Agents must rely on repository naming conventions when prompts are terse. |
| Sparse / URL-only problem statements (<150 chars) | 34 tasks (26.4%), heavily concentrated in `rich` (25), `fastapi` (8), and `requests` (1) | PR title + dead GitHub issue link (no internet in sandbox) or screenshot-only links (`rich_3064`, `rich_3105`, `rich_3296`, `#757149`). | Inspect existing code & git/test conventions directly instead of guessing from URLs. |
| Code graph blind to `async def` functions | 16 tasks whose reference patches touch `async` (15 `fastapi`, 1 `httpx`) | Competition AST graph indexer skipped `ast.AsyncFunctionDef` entirely (0/914 in FastAPI, 0/100 in httpx; `#758854`). | Host confirmed private tasks touch **0 `async def` functions** (`#745998`), though local CV is heavily affected! |

---

## 2. Complete Taxonomy: 6 Primary Categories & 21 Sub-Categories

To ensure the Batonic Coding Framework generalizes cleanly to **unseen private repositories** (Host ruling `#747248`: *"None of the published training repositories appear in the test set"*), the taxonomy below classifies problems by **domain-general Python software-engineering failure mechanics** rather than repository-specific module names.

### 2.1 Primary Category Distribution

| Primary Category | Name | Tasks | Share | Bug/Error Tasks | Single-File | Multi-File | `fastapi` | `rich` | `requests` | `httpx` |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| `BUG_PROTOCOL_IO` | Protocol, HTTP, Encoding & Terminal I/O Defects | 38 | 29.5% | 38 | 31 | 7 | 5 | 27 | 5 | 1 |
| `BUG_TYPE_SCHEMA` | Type System, Introspection, Schema & Validation Defects | 34 | 26.4% | 34 | 28 | 6 | 27 | 3 | 4 | 0 |
| `FEAT_API` | New Features, Public APIs & Formatting Enhancements | 20 | 15.5% | 4 | 5 | 15 | 12 | 7 | 1 | 0 |
| `BUG_LOGIC` | Algorithmic, Boundary, State & Control-Flow Defects | 18 | 14.0% | 18 | 17 | 1 | 8 | 9 | 1 | 0 |
| `MAINT_LIFECYCLE` | Deprecations, Removals, Internal Refactors & Tooling/Docs | 11 | 8.5% | 1 | 5 | 6 | 10 | 1 | 0 | 0 |
| `BUG_COMPAT_EXCEPTION` | Cross-Version Compatibility & Exception Propagation Defects | 8 | 6.2% | 8 | 5 | 3 | 5 | 1 | 2 | 0 |
| **Total** | **All 6 Primary Categories** | **129** | **100.0%** | **103** | **91** | **38** | **67** | **48** | **13** | **1** |

### 2.2 Complete 21 Sub-Category Breakdown

| Primary Category | Sub-Category ID | Tasks | Share | Bug/Err | Multi-File | Typical Mechanics & Defect Signature |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.ENCODING_UNICODE_AND_TEXT` | 9 | 7.0% | 9 | 1 | Unicode cell-width ranges, CJK bidirectional `split_cells`, trailing ZWJ `StopIteration`, PUA/Nerd Font widths, UTF-8 `super_len`, control-code stripping, trailing newline retention, and trailing backslash escaping. |
| `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.HTTP_HEADERS_AND_URL` | 10 | 7.8% | 10 | 1 | Underscore header passthrough, `Authorization` whitespace, `401` vs `403` + `WWW-Authenticate`, `no_proxy` dot boundaries, leading `//` URL slashes, malformed `Content-Type` params, and URL highlight regexes (`@`, `~`). |
| `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.STREAMING_AND_ASYNC` | 2 | 1.6% | 2 | 2 | ASGI `AsyncExitStack` teardown before `StreamingResponse` consumption and `httpx`/`ahttpx` dual-tree keep-alive/reset/shutdown parity. |
| `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.TERMINAL_AND_RENDERING` | 17 | 13.2% | 17 | 3 | Padding/width geometry, background style bleed on `soft_wrap`, ANSI private Fp escapes, `FileProxy.isatty()`, HTML export template/font inheritance, Markdown tables, `Panel` title styles, `Live.stop` blank lines, and `expand_tabs`. |
| `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.ANNOTATION_AND_INTROSPECTION` | 14 | 10.9% | 14 | 2 | Nested `Annotated`, `Union`/`Optional`, `ForwardRef` globals, `@wraps`/`functools.partial`, `isclass`, `Parameter.empty` identity, `Json[list[...]]`, and `__getattr__` proxy detection. |
| `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.SCHEMA_AND_OPENAPI` | 11 | 8.5% | 11 | 3 | `$ref` key/value collisions, `anyOf` shared-dict duplication, `-Input`/`-Output` mode splits, `@computed_field` omission, OAuth2 scope merging, OpenAPI 3.1 `contentMediaType`, and Swagger `<script>` XSS escaping. |
| `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.SERIALIZATION_AND_VALIDATION` | 7 | 5.4% | 7 | 1 | `validation_alias`/`serialization_alias`, multidict `extra='allow'`, duplicate `TypeAdapter` metadata, `arbitrary_types_allowed`, `JSONDecodeError.__reduce__` pickling, and SSE single-line validation. |
| `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.TYPE_ERROR_AND_ATTR_GUARD` | 2 | 1.6% | 2 | 0 | Uninitialized dataclass `field(init=False)` access and non-string `__qualname__` descriptors. |
| `BUG_LOGIC` | `BUG_LOGIC.BOUNDARY_AND_EMPTY_INPUT` | 4 | 3.1% | 4 | 0 | Empty strings/collections, partial structures, prefixless empty-path validation, and custom `end=` edge cases. |
| `BUG_LOGIC` | `BUG_LOGIC.CONTROL_FLOW_AND_DISPATCH` | 1 | 0.8% | 1 | 0 | Hoisted loop variables and parameter-order-dependent dispatch defects. |
| `BUG_LOGIC` | `BUG_LOGIC.INFINITE_LOOP_OR_RECURSION` | 4 | 3.1% | 4 | 0 | Unbounded `while` loops, zero-advance cursors, self-mutating list iteration, or cyclic exception/router graphs. |
| `BUG_LOGIC` | `BUG_LOGIC.STATE_AND_LIFECYCLE` | 9 | 7.0% | 9 | 1 | Shared mutable state aliasing, stale cached hashes, `super().__init__` overwrites, asymmetric `start`/`stop`, buffer/capture ordering, and dependency scope/caching drift. |
| `BUG_COMPAT_EXCEPTION` | `BUG_COMPAT_EXCEPTION.DEPENDENCY_COMPAT` | 4 | 3.1% | 4 | 3 | Starlette `on_startup`/`HTTP_422` changes, Pydantic v1/v2 Python 3.14 import warnings, and `urllib3` 1.x vs 2.x `latin-1`/UTF-8 body length parity. |
| `BUG_COMPAT_EXCEPTION` | `BUG_COMPAT_EXCEPTION.EXCEPTION_PROPAGATION` | 1 | 0.8% | 1 | 0 | Unhandled `BrokenPipeError` + `sys.stdout` shutdown flush errors when piping console output. |
| `BUG_COMPAT_EXCEPTION` | `BUG_COMPAT_EXCEPTION.PYTHON_VERSION_COMPAT` | 3 | 2.3% | 3 | 0 | Python 3.10+ `eval_str=True`, PEP 604 `types.UnionType`, and Python 3.11+ `netrc` empty tuple handling. |
| `FEAT_API` | `FEAT_API.CONFIG_AND_PARAMETER_EXT` | 6 | 4.7% | 2 | 4 | New options/env vars/aliases: `strict_content_type`, `TTY_COMPATIBLE`, `TTY_INTERACTIVE`, `case_sensitive`, `openapi_external_docs`, and HTTP 425 `too_early`. |
| `FEAT_API` | `FEAT_API.NEW_CAPABILITY_OR_ENDPOINT` | 7 | 5.4% | 1 | 5 | Major new capabilities: SSE, `FastAPI.frontend()`, `RouteContext`/`iter_route_contexts`, dependency `scope`, PEP 695 `TypeAliasType`, `Depends` on `Response`/`Request`, and `@app.vibe()`. |
| `FEAT_API` | `FEAT_API.RENDER_AND_FORMAT_EXT` | 7 | 5.4% | 1 | 6 | Formatting/output enhancements: `Exception.__notes__`, PEP 657 error ranges, `EndpointContext`, `serialize_json` fast path, grapheme cluster rewrite, Markdown theme redesign, and Query assertion messaging. |
| `MAINT_LIFECYCLE` | `MAINT_LIFECYCLE.DEPRECATION_AND_REMOVAL` | 4 | 3.1% | 0 | 3 | `FastAPIDeprecationWarning`, `pydantic.v1` deprecation and removal, and `UJSONResponse`/`ORJSONResponse` deprecation. |
| `MAINT_LIFECYCLE` | `MAINT_LIFECYCLE.REFACTOR_AND_INTERNAL_API` | 3 | 2.3% | 1 | 3 | Tree-based `include_router` refactor, lazy-import startup optimization, and frozen hashable `Depends`/`Security` dataclasses. |
| `MAINT_LIFECYCLE` | `MAINT_LIFECYCLE.TOOLING_AND_DOCS` | 4 | 3.1% | 0 | 0 | Typer release-preparation CLI (`scripts/prepare_release.py`) and executable `docs_src/` tutorial updates. |

### 2.3 Task Kind Breakdown

| Task Kind | Count | Share | Has Bug/Error | Multi-File | Notes |
| :--- | :---: | :---: | :---: | :---: | :--- |
| Bug Fix | 84 | 65.1% | 84 | 9 | Pure defect resolution; overwhelmingly single-file surgical fixes. |
| Feature | 16 | 12.4% | 0 | 12 | Pure capability/API/formatting additions; predominantly multi-file. |
| Refactor + Bug Fix | 10 | 7.8% | 10 | 8 | Structural refactoring required to eliminate a defect or dependency break. |
| Feature + Bug Fix | 9 | 7.0% | 9 | 4 | New option/API introduced jointly to resolve a security, spec, or runtime bug. |
| Tooling/Docs | 4 | 3.1% | 0 | 0 | Executable release scripts (`scripts/`) and tested tutorial code (`docs_src/`). |
| Deprecation/Removal | 4 | 3.1% | 0 | 3 | Planned deprecation warnings or removal of legacy compatibility layers. |
| Refactor | 2 | 1.6% | 0 | 2 | Pure architectural or import-latency restructuring with zero functional regression. |

---

## 3. Master Classification Table (All 129 Tasks)

Every task in `tasks.jsonl` is indexed below in dataset order (`#1`–`#129`) with exact file counts, reference diff churn (`+add/-rem`), complexity tier, primary/sub-category assignment, bug/error indicator, and local/agent risk flags.

| # | Instance ID | Repo | Primary Category | Sub-Category | Task Kind | Bug/Err | Files (+add/-rem) | Complexity | Risk & Sandbox Flags |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: | :---: | :---: | :--- |
| 1 | `fastapi_15661` | `fastapi` | `MAINT_LIFECYCLE` | `MAINT_LIFECYCLE.TOOLING_AND_DOCS` | Tooling/Docs | No | 1f (+216/-0) | Medium | Hidden Symbol Name |
| 2 | `fastapi_15588` | `fastapi` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.SERIALIZATION_AND_VALIDATION` | Bug Fix | Yes | 1f (+18/-5) | Low | Clean Local |
| 3 | `fastapi_15589` | `fastapi` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.HTTP_HEADERS_AND_URL` | Bug Fix | Yes | 1f (+4/-0) | Medium | Clean Local |
| 4 | `fastapi_15030` | `fastapi` | `FEAT_API` | `FEAT_API.NEW_CAPABILITY_OR_ENDPOINT` | Feature | No | 9f (+525/-35) | High | Missing `inline_snapshot`; Hidden Symbol Name; Sparse Prompt (148c); Touches `async` |
| 5 | `fastapi_14962` | `fastapi` | `FEAT_API` | `FEAT_API.RENDER_AND_FORMAT_EXT` | Feature | No | 3f (+49/-6) | Medium | Missing `inline_snapshot`; Touches `async` |
| 6 | `fastapi_15280` | `fastapi` | `FEAT_API` | `FEAT_API.NEW_CAPABILITY_OR_ENDPOINT` | Feature | No | 2f (+71/-1) | Low | Sparse Prompt (64c); Touches `async` |
| 7 | `fastapi_14964` | `fastapi` | `MAINT_LIFECYCLE` | `MAINT_LIFECYCLE.DEPRECATION_AND_REMOVAL` | Deprecation/Removal | No | 1f (+44/-8) | Low | Missing `inline_snapshot` |
| 8 | `fastapi_15023` | `fastapi` | `MAINT_LIFECYCLE` | `MAINT_LIFECYCLE.TOOLING_AND_DOCS` | Tooling/Docs | No | 1f (+18/-8) | Low | Sparse Prompt (112c) |
| 9 | `fastapi_14986` | `fastapi` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.SCHEMA_AND_OPENAPI` | Refactor + Bug Fix | Yes | 2f (+25/-9) | Medium | Clean Local |
| 10 | `fastapi_14978` | `fastapi` | `FEAT_API` | `FEAT_API.CONFIG_AND_PARAMETER_EXT` | Feature + Bug Fix | Yes | 3f (+81/-1) | Medium | Sparse Prompt (112c); Touches `async` |
| 11 | `requests_7505` | `requests` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.ANNOTATION_AND_INTROSPECTION` | Refactor + Bug Fix | Yes | 2f (+9/-7) | Low | Network/httpbin Blocked |
| 12 | `requests_7502` | `requests` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.ANNOTATION_AND_INTROSPECTION` | Bug Fix | Yes | 1f (+3/-1) | Low | Network/httpbin Blocked; Sparse Prompt (67c) |
| 13 | `requests_7433` | `requests` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.ANNOTATION_AND_INTROSPECTION` | Bug Fix | Yes | 1f (+3/-3) | Low | Network/httpbin Blocked |
| 14 | `requests_7427` | `requests` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.HTTP_HEADERS_AND_URL` | Bug Fix | Yes | 1f (+4/-2) | Low | Clean Local |
| 15 | `requests_7315` | `requests` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.HTTP_HEADERS_AND_URL` | Bug Fix | Yes | 1f (+0/-2) | Low | Clean Local |
| 16 | `requests_7328` | `requests` | `BUG_LOGIC` | `BUG_LOGIC.STATE_AND_LIFECYCLE` | Bug Fix | Yes | 1f (+1/-2) | Low | Network/httpbin Blocked |
| 17 | `requests_7309` | `requests` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.HTTP_HEADERS_AND_URL` | Bug Fix | Yes | 1f (+6/-9) | Low | Clean Local |
| 18 | `requests_7205` | `requests` | `BUG_COMPAT_EXCEPTION` | `BUG_COMPAT_EXCEPTION.PYTHON_VERSION_COMPAT` | Bug Fix | Yes | 1f (+1/-1) | Low | Network/httpbin Blocked |
| 19 | `rich_4070` | `rich` | `MAINT_LIFECYCLE` | `MAINT_LIFECYCLE.REFACTOR_AND_INTERNAL_API` | Refactor | No | 9f (+71/-57) | High | Clean Local |
| 20 | `rich_4077` | `rich` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.TERMINAL_AND_RENDERING` | Bug Fix | Yes | 1f (+3/-0) | Low | Sparse Prompt (66c) |
| 21 | `rich_4079` | `rich` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.TERMINAL_AND_RENDERING` | Bug Fix | Yes | 1f (+4/-3) | Low | Sparse Prompt (71c) |
| 22 | `rich_4076` | `rich` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.ENCODING_UNICODE_AND_TEXT` | Bug Fix | Yes | 1f (+3/-3) | Low | Sparse Prompt (71c) |
| 23 | `rich_4075` | `rich` | `BUG_LOGIC` | `BUG_LOGIC.BOUNDARY_AND_EMPTY_INPUT` | Bug Fix | Yes | 1f (+12/-3) | Low | Sparse Prompt (101c) |
| 24 | `rich_4006` | `rich` | `BUG_LOGIC` | `BUG_LOGIC.INFINITE_LOOP_OR_RECURSION` | Bug Fix | Yes | 1f (+33/-12) | Medium | Sparse Prompt (96c) |
| 25 | `fastapi_14258` | `fastapi` | `BUG_LOGIC` | `BUG_LOGIC.INFINITE_LOOP_OR_RECURSION` | Bug Fix | Yes | 1f (+4/-0) | Low | Clean Local |
| 26 | `fastapi_14851` | `fastapi` | `BUG_COMPAT_EXCEPTION` | `BUG_COMPAT_EXCEPTION.DEPENDENCY_COMPAT` | Refactor + Bug Fix | Yes | 1f (+153/-4) | High | Touches `async` |
| 27 | `fastapi_14873` | `fastapi` | `BUG_LOGIC` | `BUG_LOGIC.STATE_AND_LIFECYCLE` | Bug Fix | Yes | 1f (+11/-10) | Low | Clean Local |
| 28 | `fastapi_13920` | `fastapi` | `FEAT_API` | `FEAT_API.NEW_CAPABILITY_OR_ENDPOINT` | Feature | No | 1f (+4/-0) | Low | Clean Local |
| 29 | `fastapi_14794` | `fastapi` | `FEAT_API` | `FEAT_API.NEW_CAPABILITY_OR_ENDPOINT` | Feature + Bug Fix | Yes | 1f (+3/-2) | Low | Clean Local |
| 30 | `fastapi_14786` | `fastapi` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.HTTP_HEADERS_AND_URL` | Bug Fix | Yes | 1f (+1/-1) | Low | Clean Local |
| 31 | `fastapi_14492` | `fastapi` | `MAINT_LIFECYCLE` | `MAINT_LIFECYCLE.TOOLING_AND_DOCS` | Tooling/Docs | No | 1f (+1/-1) | Low | Clean Local |
| 32 | `fastapi_14479` | `fastapi` | `FEAT_API` | `FEAT_API.RENDER_AND_FORMAT_EXT` | Feature | No | 1f (+1/-1) | Low | Clean Local |
| 33 | `fastapi_14463` | `fastapi` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.SCHEMA_AND_OPENAPI` | Bug Fix | Yes | 1f (+2/-1) | Low | Clean Local |
| 34 | `fastapi_12942` | `fastapi` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.ANNOTATION_AND_INTROSPECTION` | Bug Fix | Yes | 1f (+3/-0) | Low | Missing `inline_snapshot`; Missing `dirty_equals` |
| 35 | `fastapi_14099` | `fastapi` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.STREAMING_AND_ASYNC` | Bug Fix | Yes | 5f (+346/-131) | High | Touches `async` |
| 36 | `fastapi_14609` | `fastapi` | `MAINT_LIFECYCLE` | `MAINT_LIFECYCLE.DEPRECATION_AND_REMOVAL` | Deprecation/Removal | No | 20f (+192/-1855) | High | Missing `inline_snapshot`; Hidden Symbol Name; Sparse Prompt (144c); Touches `async` |
| 37 | `fastapi_14372` | `fastapi` | `MAINT_LIFECYCLE` | `MAINT_LIFECYCLE.REFACTOR_AND_INTERNAL_API` | Refactor + Bug Fix | Yes | 2f (+4/-3) | Low | Clean Local |
| 38 | `fastapi_14349` | `fastapi` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.SCHEMA_AND_OPENAPI` | Bug Fix | Yes | 1f (+6/-6) | Low | Missing `inline_snapshot` |
| 39 | `fastapi_14512` | `fastapi` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.SERIALIZATION_AND_VALIDATION` | Bug Fix | Yes | 1f (+48/-4) | Medium | Missing `inline_snapshot` |
| 40 | `fastapi_14487` | `fastapi` | `MAINT_LIFECYCLE` | `MAINT_LIFECYCLE.TOOLING_AND_DOCS` | Tooling/Docs | No | 1f (+5/-2) | Low | Touches `async` |
| 41 | `fastapi_11355` | `fastapi` | `BUG_COMPAT_EXCEPTION` | `BUG_COMPAT_EXCEPTION.PYTHON_VERSION_COMPAT` | Bug Fix | Yes | 1f (+9/-2) | Low | Clean Local |
| 42 | `fastapi_14485` | `fastapi` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.ANNOTATION_AND_INTROSPECTION` | Bug Fix | Yes | 1f (+13/-6) | Low | Missing `inline_snapshot` |
| 43 | `fastapi_14482` | `fastapi` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.SERIALIZATION_AND_VALIDATION` | Bug Fix | Yes | 1f (+25/-7) | Medium | Missing `inline_snapshot` |
| 44 | `fastapi_14306` | `fastapi` | `FEAT_API` | `FEAT_API.RENDER_AND_FORMAT_EXT` | Feature | No | 2f (+121/-16) | Medium | Touches `async` |
| 45 | `fastapi_14458` | `fastapi` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.ANNOTATION_AND_INTROSPECTION` | Bug Fix | Yes | 1f (+6/-1) | Low | Clean Local |
| 46 | `fastapi_14459` | `fastapi` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.SCHEMA_AND_OPENAPI` | Refactor + Bug Fix | Yes | 3f (+49/-22) | High | Missing `inline_snapshot` |
| 47 | `fastapi_14448` | `fastapi` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.ANNOTATION_AND_INTROSPECTION` | Bug Fix | Yes | 2f (+82/-24) | High | Touches `async` |
| 48 | `fastapi_14455` | `fastapi` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.SCHEMA_AND_OPENAPI` | Bug Fix | Yes | 1f (+11/-2) | Low | Missing `inline_snapshot` |
| 49 | `fastapi_9753` | `fastapi` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.ANNOTATION_AND_INTROSPECTION` | Feature + Bug Fix | Yes | 1f (+5/-2) | Low | Clean Local |
| 50 | `fastapi_14430` | `fastapi` | `BUG_COMPAT_EXCEPTION` | `BUG_COMPAT_EXCEPTION.PYTHON_VERSION_COMPAT` | Bug Fix | Yes | 1f (+2/-2) | Low | Clean Local |
| 51 | `fastapi_5077` | `fastapi` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.ANNOTATION_AND_INTROSPECTION` | Feature + Bug Fix | Yes | 1f (+4/-2) | Low | Clean Local |
| 52 | `fastapi_9555` | `fastapi` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.ANNOTATION_AND_INTROSPECTION` | Feature + Bug Fix | Yes | 1f (+14/-8) | Low | Clean Local |
| 53 | `fastapi_14361` | `fastapi` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.SCHEMA_AND_OPENAPI` | Bug Fix | Yes | 1f (+1/-1) | Low | Missing `inline_snapshot`; Sparse Prompt (96c) |
| 54 | `fastapi_13207` | `fastapi` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.SCHEMA_AND_OPENAPI` | Bug Fix | Yes | 1f (+12/-2) | Medium | Clean Local |
| 55 | `fastapi_14360` | `fastapi` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.SERIALIZATION_AND_VALIDATION` | Bug Fix | Yes | 1f (+1/-2) | Low | Missing `dirty_equals` |
| 56 | `fastapi_14356` | `fastapi` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.HTTP_HEADERS_AND_URL` | Bug Fix | Yes | 1f (+9/-2) | Low | Clean Local |
| 57 | `fastapi_5624` | `fastapi` | `BUG_LOGIC` | `BUG_LOGIC.STATE_AND_LIFECYCLE` | Bug Fix | Yes | 1f (+3/-1) | Low | Sparse Prompt (63c) |
| 58 | `fastapi_14419` | `fastapi` | `BUG_LOGIC` | `BUG_LOGIC.STATE_AND_LIFECYCLE` | Refactor + Bug Fix | Yes | 2f (+42/-20) | High | Clean Local |
| 59 | `fastapi_14301` | `fastapi` | `BUG_LOGIC` | `BUG_LOGIC.STATE_AND_LIFECYCLE` | Bug Fix | Yes | 1f (+4/-1) | Low | Clean Local |
| 60 | `fastapi_14262` | `fastapi` | `FEAT_API` | `FEAT_API.NEW_CAPABILITY_OR_ENDPOINT` | Feature | No | 10f (+196/-70) | High | Touches `async` |
| 61 | `fastapi_14266` | `fastapi` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.SCHEMA_AND_OPENAPI` | Bug Fix | Yes | 1f (+8/-10) | Low | Missing `inline_snapshot` |
| 62 | `fastapi_14246` | `fastapi` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.SCHEMA_AND_OPENAPI` | Bug Fix | Yes | 1f (+24/-4) | Medium | Missing `inline_snapshot` |
| 63 | `fastapi_14186` | `fastapi` | `BUG_COMPAT_EXCEPTION` | `BUG_COMPAT_EXCEPTION.DEPENDENCY_COMPAT` | Refactor + Bug Fix | Yes | 10f (+266/-98) | High | Verifier-Blocked (Skipped Sibling) |
| 64 | `fastapi_9425` | `fastapi` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.ANNOTATION_AND_INTROSPECTION` | Bug Fix | Yes | 1f (+2/-0) | Low | Clean Local |
| 65 | `fastapi_13713` | `fastapi` | `FEAT_API` | `FEAT_API.CONFIG_AND_PARAMETER_EXT` | Feature | No | 2f (+31/-0) | Low | Clean Local |
| 66 | `fastapi_14077` | `fastapi` | `BUG_COMPAT_EXCEPTION` | `BUG_COMPAT_EXCEPTION.DEPENDENCY_COMPAT` | Bug Fix | Yes | 3f (+5/-6) | Low | Clean Local |
| 67 | `rich_3718` | `rich` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.TERMINAL_AND_RENDERING` | Bug Fix | Yes | 1f (+3/-4) | Low | Clean Local |
| 68 | `rich_3934` | `rich` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.TERMINAL_AND_RENDERING` | Bug Fix | Yes | 2f (+17/-3) | Low | Sparse Prompt (64c) |
| 69 | `rich_3953` | `rich` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.ENCODING_UNICODE_AND_TEXT` | Bug Fix | Yes | 1f (+16/-10) | Medium | Sparse Prompt (130c) |
| 70 | `rich_3944` | `rich` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.ENCODING_UNICODE_AND_TEXT` | Bug Fix | Yes | 1f (+1/-1) | Low | Sparse Prompt (63c) |
| 71 | `rich_3942` | `rich` | `FEAT_API` | `FEAT_API.RENDER_AND_FORMAT_EXT` | Feature | No | 2f (+43/-27) | Medium | Sparse Prompt (54c) |
| 72 | `rich_3938` | `rich` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.TERMINAL_AND_RENDERING` | Bug Fix | Yes | 2f (+40/-5) | Medium | Sparse Prompt (89c) |
| 73 | `rich_3882` | `rich` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.TERMINAL_AND_RENDERING` | Bug Fix | Yes | 1f (+1/-1) | Low | Clean Local |
| 74 | `rich_3894` | `rich` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.TYPE_ERROR_AND_ATTR_GUARD` | Bug Fix | Yes | 1f (+4/-0) | Low | Clean Local |
| 75 | `rich_3935` | `rich` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.TERMINAL_AND_RENDERING` | Bug Fix | Yes | 1f (+13/-3) | Medium | Sparse Prompt (75c) |
| 76 | `rich_3905` | `rich` | `BUG_LOGIC` | `BUG_LOGIC.STATE_AND_LIFECYCLE` | Bug Fix | Yes | 1f (+4/-3) | Low | Clean Local |
| 77 | `rich_3930` | `rich` | `FEAT_API` | `FEAT_API.RENDER_AND_FORMAT_EXT` | Feature + Bug Fix | Yes | 26f (+12170/-544) | High | Hidden Symbol Name |
| 78 | `httpx_3672` | `httpx` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.STREAMING_AND_ASYNC` | Refactor + Bug Fix | Yes | 7f (+57/-22) | High | Touches `async` |
| 79 | `fastapi_14791` | `fastapi` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.SCHEMA_AND_OPENAPI` | Bug Fix | Yes | 1f (+2/-0) | Low | Clean Local |
| 80 | `fastapi_15800` | `fastapi` | `FEAT_API` | `FEAT_API.NEW_CAPABILITY_OR_ENDPOINT` | Feature | No | 8f (+649/-5) | High | Touches `async` |
| 81 | `fastapi_15785` | `fastapi` | `FEAT_API` | `FEAT_API.NEW_CAPABILITY_OR_ENDPOINT` | Feature | No | 2f (+66/-15) | Medium | Hidden Symbol Name |
| 82 | `fastapi_14371` | `fastapi` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.SERIALIZATION_AND_VALIDATION` | Bug Fix | Yes | 4f (+46/-16) | High | Missing `dirty_equals` |
| 83 | `fastapi_14605` | `fastapi` | `MAINT_LIFECYCLE` | `MAINT_LIFECYCLE.DEPRECATION_AND_REMOVAL` | Deprecation/Removal | No | 7f (+28/-16) | Low | Missing `inline_snapshot`; Missing `dirty_equals` |
| 84 | `fastapi_15763` | `fastapi` | `BUG_LOGIC` | `BUG_LOGIC.BOUNDARY_AND_EMPTY_INPUT` | Bug Fix | Yes | 1f (+10/-3) | Low | Clean Local |
| 85 | `fastapi_14583` | `fastapi` | `MAINT_LIFECYCLE` | `MAINT_LIFECYCLE.DEPRECATION_AND_REMOVAL` | Deprecation/Removal | No | 2f (+24/-0) | Low | Missing `inline_snapshot`; Sparse Prompt (104c) |
| 86 | `fastapi_15745` | `fastapi` | `MAINT_LIFECYCLE` | `MAINT_LIFECYCLE.REFACTOR_AND_INTERNAL_API` | Refactor | No | 4f (+939/-291) | High | Missing `inline_snapshot`; Hidden Symbol Name; Touches `async` |
| 87 | `fastapi_14297` | `fastapi` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.ANNOTATION_AND_INTROSPECTION` | Bug Fix | Yes | 1f (+7/-0) | Low | Clean Local |
| 88 | `fastapi_14303` | `fastapi` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.SERIALIZATION_AND_VALIDATION` | Bug Fix | Yes | 1f (+6/-2) | Low | Missing `dirty_equals` |
| 89 | `fastapi_13537` | `fastapi` | `BUG_LOGIC` | `BUG_LOGIC.BOUNDARY_AND_EMPTY_INPUT` | Bug Fix | Yes | 1f (+2/-1) | Low | Clean Local |
| 90 | `fastapi_14953` | `fastapi` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.SCHEMA_AND_OPENAPI` | Refactor + Bug Fix | Yes | 4f (+102/-2) | Medium | Missing `inline_snapshot` |
| 91 | `fastapi_13786` | `fastapi` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.HTTP_HEADERS_AND_URL` | Feature + Bug Fix | Yes | 11f (+176/-83) | High | Touches `async` |
| 92 | `fastapi_14616` | `fastapi` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.ANNOTATION_AND_INTROSPECTION` | Bug Fix | Yes | 1f (+10/-2) | Low | Clean Local |
| 93 | `fastapi_11194` | `fastapi` | `BUG_LOGIC` | `BUG_LOGIC.CONTROL_FLOW_AND_DISPATCH` | Bug Fix | Yes | 1f (+3/-4) | Low | Touches `async` |
| 94 | `requests_6757` | `requests` | `BUG_COMPAT_EXCEPTION` | `BUG_COMPAT_EXCEPTION.DEPENDENCY_COMPAT` | Bug Fix | Yes | 2f (+16/-1) | Low | Network/httpbin Blocked |
| 95 | `requests_6629` | `requests` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.SERIALIZATION_AND_VALIDATION` | Bug Fix | Yes | 1f (+10/-0) | Low | Network/httpbin Blocked |
| 96 | `requests_6644` | `requests` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.HTTP_HEADERS_AND_URL` | Bug Fix | Yes | 1f (+3/-0) | Low | Clean Local |
| 97 | `requests_6589` | `requests` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.ENCODING_UNICODE_AND_TEXT` | Bug Fix | Yes | 1f (+3/-0) | Low | Network/httpbin Blocked |
| 98 | `requests_6592` | `requests` | `FEAT_API` | `FEAT_API.CONFIG_AND_PARAMETER_EXT` | Feature | No | 1f (+1/-1) | Low | Network/httpbin Blocked |
| 99 | `rich_3180` | `rich` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.TERMINAL_AND_RENDERING` | Bug Fix | Yes | 2f (+89/-38) | Medium | Clean Local |
| 100 | `rich_3486` | `rich` | `FEAT_API` | `FEAT_API.RENDER_AND_FORMAT_EXT` | Feature | No | 3f (+74/-24) | Medium | Verifier-Blocked (Skipped Sibling); Sparse Prompt (98c) |
| 101 | `rich_3777` | `rich` | `FEAT_API` | `FEAT_API.CONFIG_AND_PARAMETER_EXT` | Feature | No | 2f (+12/-1) | Low | Clean Local |
| 102 | `rich_3468` | `rich` | `BUG_COMPAT_EXCEPTION` | `BUG_COMPAT_EXCEPTION.EXCEPTION_PROPAGATION` | Bug Fix | Yes | 1f (+36/-6) | Low | Sparse Prompt (146c) |
| 103 | `rich_3782` | `rich` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.TERMINAL_AND_RENDERING` | Refactor + Bug Fix | Yes | 1f (+24/-5) | Medium | Sparse Prompt (68c) |
| 104 | `rich_3772` | `rich` | `BUG_LOGIC` | `BUG_LOGIC.INFINITE_LOOP_OR_RECURSION` | Bug Fix | Yes | 1f (+29/-16) | Medium | Sparse Prompt (131c) |
| 105 | `rich_3296` | `rich` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.TERMINAL_AND_RENDERING` | Bug Fix | Yes | 1f (+1/-3) | Low | Clean Local |
| 106 | `rich_3675` | `rich` | `FEAT_API` | `FEAT_API.CONFIG_AND_PARAMETER_EXT` | Feature + Bug Fix | Yes | 2f (+28/-13) | Medium | Clean Local |
| 107 | `rich_3676` | `rich` | `FEAT_API` | `FEAT_API.RENDER_AND_FORMAT_EXT` | Feature | No | 2f (+12/-1) | Medium | Sparse Prompt (42c) |
| 108 | `rich_3518` | `rich` | `BUG_LOGIC` | `BUG_LOGIC.STATE_AND_LIFECYCLE` | Bug Fix | Yes | 1f (+1/-1) | Low | Clean Local |
| 109 | `rich_3535` | `rich` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.ENCODING_UNICODE_AND_TEXT` | Bug Fix | Yes | 2f (+7/-1) | Low | Clean Local |
| 110 | `rich_3521` | `rich` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.ENCODING_UNICODE_AND_TEXT` | Bug Fix | Yes | 1f (+16/-19) | Medium | Sparse Prompt (80c) |
| 111 | `rich_3506` | `rich` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.ENCODING_UNICODE_AND_TEXT` | Bug Fix | Yes | 1f (+15/-2) | Medium | Sparse Prompt (115c) |
| 112 | `rich_3480` | `rich` | `BUG_LOGIC` | `BUG_LOGIC.INFINITE_LOOP_OR_RECURSION` | Bug Fix | Yes | 1f (+2/-2) | Low | Sparse Prompt (81c) |
| 113 | `rich_3472` | `rich` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.TYPE_ERROR_AND_ATTR_GUARD` | Bug Fix | Yes | 1f (+3/-1) | Low | Py3.13 Format Mismatch; Sparse Prompt (88c) |
| 114 | `rich_3454` | `rich` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.HTTP_HEADERS_AND_URL` | Bug Fix | Yes | 1f (+1/-1) | Low | Clean Local |
| 115 | `rich_3471` | `rich` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.ENCODING_UNICODE_AND_TEXT` | Bug Fix | Yes | 1f (+1/-0) | Low | Sparse Prompt (86c) |
| 116 | `rich_3470` | `rich` | `BUG_LOGIC` | `BUG_LOGIC.STATE_AND_LIFECYCLE` | Bug Fix | Yes | 1f (+1/-1) | Medium | Sparse Prompt (74c) |
| 117 | `rich_3469` | `rich` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.TERMINAL_AND_RENDERING` | Bug Fix | Yes | 1f (+1/-1) | Medium | Sparse Prompt (75c) |
| 118 | `rich_3052` | `rich` | `FEAT_API` | `FEAT_API.CONFIG_AND_PARAMETER_EXT` | Feature | No | 1f (+29/-5) | Low | Clean Local |
| 119 | `rich_3278` | `rich` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.TERMINAL_AND_RENDERING` | Bug Fix | Yes | 1f (+1/-0) | Low | Clean Local |
| 120 | `rich_2943` | `rich` | `BUG_LOGIC` | `BUG_LOGIC.STATE_AND_LIFECYCLE` | Bug Fix | Yes | 1f (+1/-1) | Low | Clean Local |
| 121 | `rich_2725` | `rich` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.TERMINAL_AND_RENDERING` | Bug Fix | Yes | 1f (+5/-5) | Low | Clean Local |
| 122 | `rich_3105` | `rich` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.TERMINAL_AND_RENDERING` | Bug Fix | Yes | 1f (+1/-1) | Low | Clean Local |
| 123 | `rich_3130` | `rich` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.TERMINAL_AND_RENDERING` | Bug Fix | Yes | 1f (+5/-7) | Medium | Clean Local |
| 124 | `rich_3043` | `rich` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.TERMINAL_AND_RENDERING` | Bug Fix | Yes | 1f (+1/-1) | Low | Clean Local |
| 125 | `rich_3067` | `rich` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.HTTP_HEADERS_AND_URL` | Bug Fix | Yes | 1f (+1/-1) | Low | Clean Local |
| 126 | `rich_3006` | `rich` | `BUG_TYPE_SCHEMA` | `BUG_TYPE_SCHEMA.ANNOTATION_AND_INTROSPECTION` | Bug Fix | Yes | 1f (+1/-1) | Low | Clean Local |
| 127 | `rich_3064` | `rich` | `BUG_LOGIC` | `BUG_LOGIC.BOUNDARY_AND_EMPTY_INPUT` | Bug Fix | Yes | 1f (+8/-9) | Low | Sparse Prompt (76c) |
| 128 | `rich_3063` | `rich` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.ENCODING_UNICODE_AND_TEXT` | Bug Fix | Yes | 1f (+3/-1) | Low | Sparse Prompt (85c) |
| 129 | `rich_3061` | `rich` | `BUG_PROTOCOL_IO` | `BUG_PROTOCOL_IO.TERMINAL_AND_RENDERING` | Feature + Bug Fix | Yes | 1f (+67/-24) | High | Clean Local |

---

## 4. Detailed Root Cause Analysis (All 103 Tasks Containing Bugs and Errors)

This section presents a code-grounded Root Cause Analysis for **every single one of the 103 tasks** in `tasks.jsonl` that contains a bug, runtime exception, specification defect, security vulnerability, or compatibility error (all 98 `BUG_*` tasks plus the 5 hybrid `FEAT_API`/`MAINT_LIFECYCLE` tasks with embedded defects). Entries are grouped by **Primary Category -> Sub-Category** and reference the exact modified files, symbols, pre-fix fault mechanism, reference fix, and empirical traps that derail autonomous coding agents.

### 4.1 `BUG_PROTOCOL_IO` — Protocol, HTTP, Encoding & Terminal I/O Defects (38 Bug/Error Tasks)

Defects in HTTP header/URL parsing, streaming/async lifecycle, Unicode/grapheme cell measurement, escaping, and terminal/HTML/Markdown rendering geometry.

#### 4.1.1 `BUG_PROTOCOL_IO.ENCODING_UNICODE_AND_TEXT` (9 Tasks)

*Unicode cell-width ranges, CJK bidirectional `split_cells`, trailing ZWJ `StopIteration`, PUA/Nerd Font widths, UTF-8 `super_len`, control-code stripping, trailing newline retention, and trailing backslash escaping.*

##### `rich_4076` (#22, `Textualize/rich`, Bug Fix, 1 file(s), `+3/-3`, Complexity: Low)

- **Target Files & Symbols:** `rich/ansi.py` — `rich/ansi.py`, `AnsiDecoder.decode`, `AnsiDecoder.decode_line`, `Text.from_ansi`
- **Symptom / Exception:** Text.from_ansi() and AnsiDecoder.decode() silently dropped trailing newlines (e.g., Text.from_ansi('\n').plain == '' and Text.from_ansi('Hello\n').plain == 'Hello' instead of preserving '\n').
- **Root Cause:** In rich/ansi.py:AnsiDecoder.decode, splitting input via terminal_text.splitlines() discards a trailing newline rather than producing a trailing empty string element (e.g., 'Hello\n'.splitlines() yields only ['Hello']). When callers such as Text.from_ansi join the decoded lines with '\n', trailing newlines disappear.
- **Reference Fix Mechanism:** Replaced terminal_text.splitlines() in AnsiDecoder.decode with re.split(r'(?<=\n)', terminal_text) and passed line.rstrip('\n') to self.decode_line(), preserving the trailing empty element after any final '\n' while keeping empty input '' producing a single empty Text.
- **Agent Traps & Pitfalls:** Using terminal_text.splitlines(keepends=True) (which still yields only 1 element ['Hello\n'] for 'Hello\n' and drops the trailing newline once stripped), or returning an empty iterator for '' instead of yielding one empty Text.

##### `rich_3953` (#69, `Textualize/rich`, Bug Fix, 1 file(s), `+16/-10`, Complexity: Medium)

- **Target Files & Symbols:** `rich/cells.py` — `rich/cells.py`, `get_character_cell_size`, `_cell_len`
- **Symptom / Exception:** `cell_len()` raises unhandled `StopIteration` on strings ending with a Zero Width Joiner (`"\u200d"`), and non-printable C0/C1 control characters (`0x01..0x1F`, `0x7F..0x9F`) report cell width `1` instead of `0`.
- **Root Cause:** In `_cell_len` (`rich/cells.py`), encountering a ZWJ (`"\u200d"`) called `next(iter_characters)` without a default argument, raising `StopIteration` when `\u200d` was the last character in `text`. Separately, `get_character_cell_size` relied exclusively on binary searching `load_cell_table(unicode_version).widths` (defaulting misses to `1`), which omitted non-printable C0/C1 control characters after migrating to `wcwidth` tables and therefore returned `1` instead of `0`.
- **Reference Fix Mechanism:** Rewrote `_cell_len` to iterate via an index (`while index < character_count:`) incrementing `index += 1` on `"\u200d"` (plus the loop increment) so trailing ZWJs terminate cleanly without `StopIteration`. Added an explicit early check `if codepoint and codepoint < 32 or 0x07F <= codepoint < 0x0A0: return 0` and cleaned up the binary search loop (`while lower_bound <= upper_bound:`) in `get_character_cell_size`.
- **Agent Traps & Pitfalls:** The terse description ('Fix ZWJ and edge cases') hides two separate bugs (#3947 and #3950); fixing only `StopIteration` via `next(iter_characters, None)` leaves non-printable control characters broken, and care is needed around boundary codepoints `0`, `32`, `0x7F`, and `0xA0`.

##### `rich_3944` (#70, `Textualize/rich`, Bug Fix, 1 file(s), `+1/-1`, Complexity: Low)

- **Target Files & Symbols:** `rich/cells.py` — `rich/cells.py`, `get_character_cell_size`
- **Symptom / Exception:** Nerd Font / Supplementary Private Use Area glyphs (e.g., `"\U000f024d"`) return `cell_len(...) == 0` instead of `1`, breaking terminal column alignment and wrapping.
- **Root Cause:** In `get_character_cell_size` (`rich/cells.py`), the upper-bound fast path `if codepoint > table[-1][1]:` returned `0` instead of `1`. Because Private Use Area codepoints such as Nerd Font icons (`U+F0000+`) exceed the highest range in `load_cell_table(unicode_version).widths`, they hit this branch and were mismeasured as zero-width rather than matching the default width `1` of unmapped printable characters.
- **Reference Fix Mechanism:** Changed `return 0` to `return 1` under `if codepoint > table[-1][1]:` in `get_character_cell_size`.
- **Agent Traps & Pitfalls:** The problem statement only says 'fix fonts (Fixes #3943)'; agents unfamiliar with Nerd Font PUA codepoints exceeding `table[-1][1]` may try to edit generated `_unicode_data` tables instead of fixing the 1-line upper-bound return value in `get_character_cell_size`.

##### `requests_6589` (#97, `psf/requests`, Bug Fix, 1 file(s), `+3/-0`, Complexity: Low)

- **Target Files & Symbols:** `src/requests/utils.py` — `src/requests/utils.py:super_len`
- **Symptom / Exception:** Sending a `str` request body containing multi-byte Unicode characters produces an understated `Content-Length` header equal to the character count instead of the UTF-8 byte count, causing truncated bodies or HTTP framing errors on `urllib3` 2.x.
- **Root Cause:** In `src/requests/utils.py:super_len`, Python `str` inputs matched `if hasattr(o, "__len__"):` and returned `len(o)` (Unicode code point count) rather than the length of the UTF-8 encoded byte sequence transmitted on the wire by `urllib3` 2.x.
- **Reference Fix Mechanism:** Inserted `if isinstance(o, str): o = o.encode("utf-8")` near the start of `super_len(o)` in `src/requests/utils.py` before computing `len(o)` so `Content-Length` reflects the UTF-8 encoded byte length.
- **Agent Traps & Pitfalls:** Encoding `PreparedRequest.body` to `bytes` inside `prepare_body` instead of encoding locally inside `super_len` breaks callers and tests expecting `PreparedRequest.body` to remain a `str` and misses direct callers of `super_len`.

##### `rich_3535` (#109, `Textualize/rich`, Bug Fix, 2 file(s), `+7/-1`, Complexity: Low)

- **Target Files & Symbols:** `rich/cells.py`, `rich/segment.py` — `rich/cells.py:_is_single_cell_widths`, `rich/segment.py:Segment.split_cells`
- **Symptom / Exception:** _is_single_cell_widths returns None (falsy) for printable ASCII letters/symbols 'p'-'~', Latin characters U+00A1-U+02FE, and box-drawing glyphs U+2500-U+25FF, disabling the single-cell-width fast path and degrading performance.
- **Root Cause:** In rich/cells.py, the regex _is_single_cell_widths = re.compile('^[\u0020-\u006f\u00a0\u02ff\u0370-\u0482]*$').match contained two character-class typos: the ASCII upper bound stopped at \u006f ('o') instead of \u007e ('~'), and \u00a0\u02ff was missing a hyphen '-' so it only matched two codepoints instead of the range U+00A0-U+02FF. It also lacked the common box-drawing single-width range \u2500-\u25FF.
- **Reference Fix Mechanism:** Corrected _is_single_cell_widths in rich/cells.py to re.compile('^[\u0020-\u007e\u00a0-\u02ff\u0370-\u0482\u2500-\u25FF]*$').match, and added an assert cut >= 0 precondition guard (and Args docstring) in rich/segment.py:Segment.split_cells.
- **Agent Traps & Pitfalls:** The terse prompt ('Regex error') does not enumerate which Unicode ranges are broken. Agents might spot only \u006f->\u007e and miss the missing hyphen in \u00a0\u02ff or omit the box-drawing range \u2500-\u25FF explicitly tested in test_is_single_cell_widths, while over-expanding the regex to include double-width or zero-width codepoints would corrupt terminal width calculations.

##### `rich_3521` (#110, `Textualize/rich`, Bug Fix, 1 file(s), `+16/-19`, Complexity: Medium)

- **Target Files & Symbols:** `rich/segment.py` — `rich/segment.py:Segment._split_cells`, `rich/segment.py:Segment.split_cells`
- **Symptom / Exception:** Segment.split_cells() returns left/right segments whose cell_len does not equal cut / (cell_length - cut) (or hits AssertionError) on mixed single- and double-width Unicode strings with trailing spaces.
- **Root Cause:** In rich/segment.py, Segment._split_cells estimated an initial character index pos = int((cut / cell_length) * len(text)) - 1 and ran a forward-only loop (pos += 1) assuming cell_len(text[:pos]) <= cut. When double-width CJK characters preceded many single-width characters (e.g. trailing spaces), the linear estimate still overshot cut by more than one cell, causing the 'if cell_pos > cut:' branch to immediately slice at the wrong index instead of stepping backward.
- **Reference Fix Mechanism:** Rewrote the search loop in Segment._split_cells as a bidirectional while True loop starting at pos = int((cut / cell_length) * len(text)): it computes out_by = cell_len(text[:pos]) - cut, returns an exact split when out_by == 0, splits a double-width character into two spaces when out_by == -1 with cell_size(text[pos]) == 2 or out_by == +1 with cell_size(text[pos - 1]) == 2, and otherwise increments or decrements pos toward cut.
- **Agent Traps & Pitfalls:** The problem statement only links an external Textual issue (#5090). Simply subtracting a larger constant from the initial pos estimate fails to solve the general overshoot problem for arbitrary ratios of double-width prefixes to single-width suffixes; additionally, handling cut == 0 and splitting a 2-cell glyph from both the out_by == -1 and out_by == +1 sides requires exact slice boundaries so neither side drops or duplicates characters.

##### `rich_3506` (#111, `Textualize/rich`, Bug Fix, 1 file(s), `+15/-2`, Complexity: Medium)

- **Target Files & Symbols:** `rich/segment.py` — `rich/segment.py:Segment._split_cells`, `rich/segment.py:Segment.split_cells`
- **Symptom / Exception:** Segment.split_cells() returns segments with mismatched cell widths (cell_len(left.text) != cut) on mixed single-width and double-width CJK strings such as '早乙女リリエル (CV: 徳井青）'.
- **Root Cause:** In rich/segment.py, Segment._split_cells computed its initial index estimate as pos = int((cut / cell_length) * (len(text) - 1)), which could land one character past the target cell position cut on mixed-width strings where double-width characters appear early. Because the subsequent loop only incremented pos forward and assumed any cell_pos > cut resulted from crossing a single double-width character during scanning, starting with cell_pos > cut produced an off-by-one/wrongly sized split.
- **Reference Fix Mechanism:** Adjusted the initial index calculation in Segment._split_cells to pos = int((cut / cell_length) * (len(text))) - 1 with a lower-bound clamp (if pos < 0: pos = 0) so the starting cursor begins at or before the target cut position on the failing mixed-width cases.
- **Agent Traps & Pitfalls:** The prompt only references an external Textual issue (#4996) with no reproduction string. Note that clamping pos >= 0 is mandatory (without it, small cut yields pos = -1, causing Python negative-index slicing text[:-1] to take almost the entire string!), and while this patch fixed the immediate issue, the deeper bidirectional overshoot issue remained until rich_3521.

##### `rich_3471` (#115, `Textualize/rich`, Bug Fix, 1 file(s), `+1/-0`, Complexity: Low)

- **Target Files & Symbols:** `rich/text.py` — `rich/text.py:Text.append_tokens`, `rich/control.py:strip_control_codes`
- **Symptom / Exception:** Printing/wrapping a Text object populated via Text.append_tokens() with strings containing control codes (e.g. '\r') raises an exception during wrapping/rendering.
- **Root Cause:** Unlike Text.__init__ and Text.append, Text.append_tokens in rich/text.py did not sanitize incoming token text with strip_control_codes(). Unstripped control characters like '\r' violated Text's internal invariant (producing negative cell widths during cell calculation) and broke downstream line wrapping.
- **Reference Fix Mechanism:** Added content = strip_control_codes(content) at the top of the token loop in rich/text.py:Text.append_tokens before appending text, computing Span endpoints, and incrementing offset.
- **Agent Traps & Pitfalls:** The prompt ('Fixed exception in append_tokens / Fixes #3014') omits the triggering input ('\r'). Calling strip_control_codes(content) only inside append_text(...) without reassigning content first would misalign Span(offset, offset + len(content), style) and self._length against the stripped text length.

##### `rich_3063` (#128, `Textualize/rich`, Bug Fix, 1 file(s), `+3/-1`, Complexity: Low)

- **Target Files & Symbols:** `rich/markup.py` — `rich/markup.py:escape`, `rich/markup.py:_escape`
- **Symptom / Exception:** Escaping a string ending in a single backslash (e.g. 'C:\\') via rich.markup.escape() leaves the trailing backslash unescaped, so wrapping it in tags like f'[red]{escape(value)}[/red]' inadvertently escapes the closing '[/red]' tag.
- **Root Cause:** In rich/markup.py, escape() only transformed backslashes immediately preceding an opening markup tag '[' via _escape(escape_backslashes, markup). A trailing backslash at the end of the string was untouched, so when concatenated before a closing markup tag it acted as an escape prefix for '['.
- **Reference Fix Mechanism:** Added a post-processing check in rich/markup.py:escape: 'if markup.endswith("\\") and not markup.endswith("\\\\"): return markup + "\\"', doubling a single trailing backslash so subsequent closing tags are not escaped.
- **Agent Traps & Pitfalls:** Escaping all backslashes globally or unconditionally appending '\\' whenever markup.endswith('\\') breaks already-escaped double backslashes and existing test_escape cases. Note the patch's exact condition handles a single trailing backslash while avoiding doubling '\\\\'.

#### 4.1.2 `BUG_PROTOCOL_IO.HTTP_HEADERS_AND_URL` (10 Tasks)

*Underscore header passthrough, `Authorization` whitespace, `401` vs `403` + `WWW-Authenticate`, `no_proxy` dot boundaries, leading `//` URL slashes, malformed `Content-Type` params, and URL highlight regexes (`@`, `~`).*

##### `fastapi_15589` (#3, `fastapi/fastapi`, Bug Fix, 1 file(s), `+4/-0`, Complexity: Medium)

- **Target Files & Symbols:** `fastapi/dependencies/utils.py` — `fastapi/dependencies/utils.py`, `request_params_to_args`, `get_validation_alias`
- **Symptom / Exception:** Endpoints using a Header Pydantic model with convert_underscores=True (the default) accepted underscore-separated HTTP headers (e.g., x_user_id) with HTTP 200 instead of rejecting them with HTTP 422.
- **Root Cause:** In fastapi/dependencies/utils.py:request_params_to_args, processed_keys only added (alias or get_validation_alias(field)). When convert_underscores=True converted a field like x_user_id to alias 'x-user-id', an incoming underscore header 'x_user_id' was absent from processed_keys, fell through to the extra-params forwarding loop ('for key in received_params.keys(): if key not in processed_keys'), and was forwarded into params_to_process where Pydantic bound it to the field.
- **Reference Fix Mechanism:** Added processed_keys.add(get_validation_alias(field)) unconditionally after processed_keys.add(alias or get_validation_alias(field)) in request_params_to_args so both the converted hyphenated header name and the original underscore field alias are marked processed and never forwarded as extra headers.
- **Agent Traps & Pitfalls:** Modifying Header alias generation instead of the extra-params passthrough loop in request_params_to_args, or stripping all underscore headers globally which would break convert_underscores=False and legitimate extra headers on models allowing extras.

##### `requests_7427` (#14, `psf/requests`, Bug Fix, 1 file(s), `+4/-2`, Complexity: Low)

- **Target Files & Symbols:** `src/requests/utils.py` — `src/requests/utils.py`, `should_bypass_proxies`
- **Symptom / Exception:** should_bypass_proxies() falsely returned True for unrelated domains sharing a trailing substring with a no_proxy entry (e.g., 'evilexample.com' matched no_proxy='example.com'), bypassing configured proxies.
- **Root Cause:** In src/requests/utils.py:should_bypass_proxies, each entry in no_proxy_hosts was tested via raw suffix comparison (hostname.endswith(host) or host_with_port.endswith(host)) without requiring a DNS dot boundary. As a result, any hostname ending with the same character sequence matched even across different domain labels.
- **Reference Fix Mechanism:** Normalized each entry via host = host.lstrip('.'), returned True on exact equality (hostname == host or host_with_port == host), and then prepended '.' (host = '.' + host) before performing the endswith() subdomain check, matching CPython bpo-39057.
- **Agent Traps & Pitfalls:** Prepending '.' without first calling host.lstrip('.') (turning '.example.com' into '..example.com' and breaking matches on 'example.com' and 'sub.example.com'), or checking exact equality only on hostname while forgetting host_with_port.

##### `requests_7315` (#15, `psf/requests`, Bug Fix, 1 file(s), `+0/-2`, Complexity: Low)

- **Target Files & Symbols:** `src/requests/adapters.py` — `src/requests/adapters.py`, `HTTPAdapter.request_url`
- **Symptom / Exception:** URLs with multiple leading path slashes (such as S3 presigned URLs like https://bucket.s3.amazonaws.com//key or //v:h) had their leading slashes collapsed to a single '/', altering the request target and breaking URL signatures.
- **Root Cause:** In src/requests/adapters.py:HTTPAdapter.request_url, an obsolete workaround ('if url.startswith("//"): url = f"/{url.lstrip('/')}"') unconditionally collapsed leading slashes on request.path_url to avoid confusing older versions of urllib3.
- **Reference Fix Mechanism:** Deleted the two-line leading-slash stripping guard in HTTPAdapter.request_url so request.path_url is sent with its original leading slashes intact.
- **Agent Traps & Pitfalls:** Altering URL normalization in PreparedRequest.prepare_url instead of HTTPAdapter.request_url, or only exempting specific URL patterns instead of removing the obsolete slash-stripping block.

##### `requests_7309` (#17, `psf/requests`, Bug Fix, 1 file(s), `+6/-9`, Complexity: Low)

- **Target Files & Symbols:** `src/requests/utils.py` — `src/requests/utils.py`, `_parse_content_type_header`
- **Symptom / Exception:** Malformed Content-Type header parameters without '=' (e.g., 'text/plain; charset') were stored in params_dict with boolean value True instead of being skipped, violating RFC 9110 and breaking callers expecting string parameter values.
- **Root Cause:** In src/requests/utils.py:_parse_content_type_header, any non-empty semicolon-delimited token initialized 'key, value = param, True' and unconditionally assigned params_dict[key.lower()] = value even when param.find('=') returned -1.
- **Reference Fix Mechanism:** Changed the loop in _parse_content_type_header to 'if param and (idx := param.find("=")) != -1:' and only extracted/stored key and value when '=' is present, completely ignoring malformed valueless parameters.
- **Agent Traps & Pitfalls:** Storing '' or None as the value for malformed parameters instead of omitting the key from params_dict, or raising an exception on malformed Content-Type headers instead of gracefully skipping them.

##### `fastapi_14786` (#30, `fastapi/fastapi`, Bug Fix, 1 file(s), `+1/-1`, Complexity: Low)

- **Target Files & Symbols:** `fastapi/security/utils.py` — `fastapi/security/utils.py:get_authorization_scheme_param`
- **Symptom / Exception:** Extracted HTTP Authorization credentials retain leading or trailing spaces (e.g., '  xxx' for 'Bearer   xxx' or 'xxx ' for 'Bearer xxx '), causing downstream token authentication failures.
- **Root Cause:** In fastapi/security/utils.py:get_authorization_scheme_param, `scheme, _, param = authorization_header_value.partition(" ")` splits only on the first space and returns `param` verbatim. Under RFC 6750 Section 2.1, multiple separator spaces (1*SP) between scheme and token or trailing spaces are not part of the b64token, so unstripped spaces leaked into credentials.
- **Reference Fix Mechanism:** Changed the return statement of get_authorization_scheme_param from `return scheme, param` to `return scheme, param.strip()` so leading and trailing whitespace around the credential parameter is stripped.
- **Agent Traps & Pitfalls:** Replacing partition(' ') with split() breaks non-Bearer schemes whose credential parameter legitimately contains internal spaces (e.g., Digest auth params) or alters empty-header edge cases; only param.strip() should be applied after partition(' ').

##### `fastapi_14356` (#56, `fastapi/fastapi`, Bug Fix, 1 file(s), `+9/-2`, Complexity: Low)

- **Target Files & Symbols:** `fastapi/dependencies/utils.py` — `fastapi/dependencies/utils.py`, `request_params_to_args`
- **Symptom / Exception:** Repeated extra Query or Header parameters sent to a Pydantic parameter model with `extra="allow"` silently drop all values except the last (e.g., `'789'` instead of `['456', '789']`).
- **Root Cause:** In `request_params_to_args` (`fastapi/dependencies/utils.py`), unmapped extra keys were extracted with `for key, value in received_params.items(): params_to_process[key] = value`. On Starlette's `QueryParams` and `Headers` multidicts, `.items()` collapses duplicate keys to a single value (the last one), losing multi-valued HTTP query parameters and headers before model validation.
- **Reference Fix Mechanism:** Changed iteration to `for key in received_params.keys():` and checked `if hasattr(received_params, "getlist"):`; when present, called `received_params.getlist(key)` and unwrapped single-element lists (`len(value) == 1`) to `value[0]` while preserving multi-value lists, falling back to `received_params.get(key)` for plain dicts such as `Cookies`.
- **Agent Traps & Pitfalls:** Calling `received_params.getlist(key)` without `hasattr(..., "getlist")` raises `AttributeError` for `request.cookies` (a plain `dict`), and failing to unwrap 1-element lists breaks single-value extra Query/Header parameters by returning `['val']` instead of `'val'`.

##### `fastapi_13786` (#91, `fastapi/fastapi`, Feature + Bug Fix, 11 file(s), `+176/-83`, Complexity: High)

- **Target Files & Symbols:** `docs_src/authentication_error_status_code/tutorial001_an.py`, `docs_src/authentication_error_status_code/tutorial001_an_py39.py`, `docs_src/security/tutorial003.py`, `docs_src/security/tutorial003_an.py`, `docs_src/security/tutorial003_an_py310.py` *(+6 more)* — `fastapi/security/api_key.py:APIKeyBase.make_not_authenticated_error`, `fastapi/security/http.py:HTTPBase.make_not_authenticated_error`, `fastapi/security/oauth2.py:OAuth2`, `fastapi/security/open_id_connect_url.py:OpenIdConnect.make_not_authenticated_error`
- **Symptom / Exception:** FastAPI security dependencies (`APIKey*`, `HTTPBase`, `HTTPBearer`, `HTTPDigest`, `OAuth2`, `OpenIdConnect`) returned HTTP `403 Forbidden` without a `WWW-Authenticate` header when credentials were missing, violating HTTP authentication semantics (RFC 9110/6750) which require `401 Unauthorized` with `WWW-Authenticate`.
- **Root Cause:** The `__call__` methods across `fastapi/security/api_key.py`, `http.py`, `oauth2.py`, and `open_id_connect_url.py` hardcoded `HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Not authenticated")` when `self.auto_error` was enabled and credentials were absent or invalid, omitting `WWW-Authenticate` headers and providing no clean subclass hook to override the unauthenticated error.
- **Reference Fix Mechanism:** Changed unauthenticated error status codes from `HTTP_403_FORBIDDEN` to `HTTP_401_UNAUTHORIZED` with appropriate `WWW-Authenticate` headers (e.g., `"APIKey"`, `"Bearer"`) across all four security modules, and encapsulated error creation in an overridable `make_not_authenticated_error(self) -> HTTPException` method so users needing legacy 403 behavior can subclass it cleanly.
- **Agent Traps & Pitfalls:** Major trap in the problem statement: the PR description explicitly warns it is outdated and describes an abandoned `not_authenticated_status_code` constructor parameter and `format_www_authenticate_header_value` template (`ApiKey in=..., name=...`), whereas the actual merged code and tests require `make_not_authenticated_error()` and `WWW-Authenticate: APIKey` / `Bearer`. Also easy to miss one of the four security modules or the updated `detail="Not authenticated"` string.

##### `requests_6644` (#96, `psf/requests`, Bug Fix, 1 file(s), `+3/-0`, Complexity: Low)

- **Target Files & Symbols:** `src/requests/adapters.py` — `src/requests/adapters.py:HTTPAdapter.request_url`
- **Symptom / Exception:** Requests with URLs containing multiple leading path slashes (e.g., `http://example.com//v:h`) fail in `urllib3` because `urllib3`'s `ConnectionPool.urlopen` misparses the `//`-prefixed path as a scheme-relative full URI with a host and port.
- **Root Cause:** `HTTPAdapter.request_url` in `src/requests/adapters.py` passed `request.path_url` directly to `urllib3` without normalizing redundant leading slashes. When `path_url` starts with `"//"`, `urllib3` treats it as an authority/network-path reference (`//host:port`) instead of an origin-form request target.
- **Reference Fix Mechanism:** Added `if url.startswith("//"): url = f"/{url.lstrip('/')}"` in `HTTPAdapter.request_url` right after `url = request.path_url` (before the non-SOCKS proxy branch), collapsing any number of leading slashes to a single `'/'`.
- **Agent Traps & Pitfalls:** Stripping only one leading slash (`url[1:]`) fails for paths with three or more leading slashes (`///v:h`); mutating `PreparedRequest.path_url` or `prepare_url` instead of `HTTPAdapter.request_url` alters the prepared request URL globally and breaks unrelated URL preservation tests.

##### `rich_3454` (#114, `Textualize/rich`, Bug Fix, 1 file(s), `+1/-1`, Complexity: Low)

- **Target Files & Symbols:** `rich/highlighter.py` — `rich/highlighter.py:ReprHighlighter.highlights`
- **Symptom / Exception:** URLs containing '@' (such as YouTube handles like https://www.youtube.com/@LinusTechTips or userinfo URLs) stop being highlighted as repr.url at the '@' character.
- **Root Cause:** The (?P<url>...) regex pattern in rich/highlighter.py:ReprHighlighter.highlights used the character class [-0-9a-zA-Z$_+!`(),.?/;:&=%#~]*, which omitted '@' even though '@' is a valid RFC 3986 URL character.
- **Reference Fix Mechanism:** Added '@' to the URL character class in ReprHighlighter.highlights (rich/highlighter.py), updating it to [-0-9a-zA-Z$_+!`(),.?/;:&=%#~@]*.
- **Agent Traps & Pitfalls:** Over-broadening the URL regex (e.g., matching any non-whitespace character) would swallow trailing quotes or closing brackets in repr strings and break existing test_highlighter.py span assertions.

##### `rich_3067` (#125, `Textualize/rich`, Bug Fix, 1 file(s), `+1/-1`, Complexity: Low)

- **Target Files & Symbols:** `rich/highlighter.py` — `rich/highlighter.py:ReprHighlighter.highlights`
- **Symptom / Exception:** URLs containing a tilde '~' (e.g., http://example.org/~folder) stop being highlighted as repr.url right before '~'.
- **Root Cause:** The (?P<url>...) regular expression in rich/highlighter.py:ReprHighlighter.highlights used [-0-9a-zA-Z$_+!`(),.?/;:&=%#]*, omitting '~' despite tilde being a valid RFC 3986 unreserved URL character.
- **Reference Fix Mechanism:** Added '~' to the URL character class in ReprHighlighter.highlights (rich/highlighter.py), updating it to [-0-9a-zA-Z$_+!`(),.?/;:&=%#~]*.
- **Agent Traps & Pitfalls:** Adding extra characters beyond '~' or changing regex ordering in ReprHighlighter.highlights can alter overlapping highlight spans (such as attrib_name/attrib_value inside query strings tested in test_highlighter.py).

#### 4.1.3 `BUG_PROTOCOL_IO.STREAMING_AND_ASYNC` (2 Tasks)

*ASGI `AsyncExitStack` teardown before `StreamingResponse` consumption and `httpx`/`ahttpx` dual-tree keep-alive/reset/shutdown parity.*

##### `fastapi_14099` (#35, `fastapi/fastapi`, Bug Fix, 5 file(s), `+346/-131`, Complexity: High)

- **Target Files & Symbols:** `docs_src/dependencies/tutorial013_an_py310.py`, `docs_src/dependencies/tutorial014_an_py310.py`, `fastapi/applications.py`, `fastapi/middleware/asyncexitstack.py`, `fastapi/routing.py` — `fastapi/applications.py:FastAPI.build_middleware_stack`, `fastapi/middleware/asyncexitstack.py:AsyncExitStackMiddleware`, `fastapi/routing.py:request_response`, `fastapi/routing.py:websocket_session`, `fastapi/routing.py:get_request_handler`, `fastapi/routing.py:get_websocket_app`
- **Symptom / Exception:** StreamingResponse generators that rely on dependencies with `yield` (e.g., DB sessions) or UploadFile instances fail mid-stream with closed-resource errors because teardown executes before the stream is consumed.
- **Root Cause:** In fastapi/routing.py:get_request_handler, both the `file_stack` (for form/UploadFile cleanup) and `async_exit_stack` (for `yield` dependencies) were entered inside `app(request) -> Response`. Those context managers exited immediately when the endpoint returned the StreamingResponse object, before Starlette's `request_response` invoked `await response(scope, receive, send)` to iterate and transmit the stream.
- **Reference Fix Mechanism:** Re-introduced AsyncExitStackMiddleware (storing `scope["fastapi_middleware_astack"]`) via an overridden FastAPI.build_middleware_stack inside ExceptionMiddleware and user middlewares for closing uploaded files after the ASGI response completes. Replaced Starlette's `request_response` and `websocket_session` in fastapi/routing.py with custom ASGI wrappers that hold an `AsyncExitStack` in `scope["fastapi_inner_astack"]` spanning both `await f(request)` and `await response(scope, receive, send)` (plus a `response_awaited` check raising FastAPIError if a yield dependency swallows an exception), and updated get_request_handler and get_websocket_app to use those scope stacks.
- **Agent Traps & Pitfalls:** Closing yield dependencies in AsyncExitStackMiddleware breaks catching HTTPException inside yield dependencies; placing AsyncExitStackMiddleware outside user middlewares breaks contextvars isolation; omitting the `response_awaited` FastAPIError guard breaks bare-except detection in yield dependencies; and WebSocket routes must also receive `fastapi_inner_astack` via the custom `websocket_session`.

##### `httpx_3672` (#78, `encode/httpx`, Refactor + Bug Fix, 7 file(s), `+57/-22`, Complexity: High)

- **Target Files & Symbols:** `src/ahttpx/_parsers.py`, `src/ahttpx/_pool.py`, `src/ahttpx/_server.py`, `src/httpx/_network.py`, `src/httpx/_parsers.py` *(+2 more)* — `src/ahttpx/_parsers.py`, `src/httpx/_parsers.py`, `HTTPParser.reset`, `HTTPParser.is_keepalive`, `src/ahttpx/_server.py`, `src/httpx/_server.py`
- **Symptom / Exception:** Keep-alive server connections fail to reset or reuse (`await self._parser.complete` lacked `()` raising `TypeError` in `ahttpx` and acting as a no-op in `httpx`), unread request bodies prematurely close keep-alive connections, error path `Response(code=500)` raises `TypeError`, streams leak on server exit, and `KeyboardInterrupt` escapes `wait()`.
- **Root Cause:** In `src/ahttpx/_server.py` and `src/httpx/_server.py`, `_complete` referenced `self._parser.complete` without calling it, `handle_requests` neither drained unread request bodies on keep-alive connections (leaving `recv_state != State.DONE`) nor called reset after handling each request, error handling passed an invalid `code=500` keyword argument to `Response`, open streams were not closed on server shutdown, and `wait()` did not catch `KeyboardInterrupt`.
- **Reference Fix Mechanism:** Renamed `HTTPParser.complete` to `reset() -> bool` and added `HTTPParser.is_keepalive()` and `NetworkStream.is_closed()`; renamed `_complete` to `_reset` calling `self._parser.reset()` across both `ahttpx` and `httpx` pool/server modules; drained `stream.read()` when `self._parser.is_keepalive()` and called `_reset()` after each request in `handle_requests`; fixed `Response(500, content=content)`; closed streams on server exit; and caught `KeyboardInterrupt` to break cleanly in `wait()`.
- **Agent Traps & Pitfalls:** Failing to apply every change identically across both async (`src/ahttpx/`) and sync (`src/httpx/`) codebases; missing the uncalled-method typo (`self._parser.complete` without `()`) or the `Response(code=500)` kwarg bug inside the `except Exception:` branch; or omitting `self.send_state != State.CLOSED` inside `is_keepalive()`.

#### 4.1.4 `BUG_PROTOCOL_IO.TERMINAL_AND_RENDERING` (17 Tasks)

*Padding/width geometry, background style bleed on `soft_wrap`, ANSI private Fp escapes, `FileProxy.isatty()`, HTML export template/font inheritance, Markdown tables, `Panel` title styles, `Live.stop` blank lines, and `expand_tabs`.*

##### `rich_4077` (#20, `Textualize/rich`, Bug Fix, 1 file(s), `+3/-0`, Complexity: Low)

- **Target Files & Symbols:** `rich/file_proxy.py` — `rich/file_proxy.py`, `FileProxy`, `FileProxy.isatty`, `io.TextIOBase.isatty`
- **Symptom / Exception:** Calling file_proxy.isatty() (e.g., sys.stdout.isatty() when redirected via Rich's FileProxy) always returned False even when the underlying file was a real TTY.
- **Root Cause:** FileProxy in rich/file_proxy.py inherits from io.TextIOBase, which already implements a concrete IOBase.isatty() method returning False. Because isatty was resolved directly on the base class via MRO, Python never invoked FileProxy.__getattr__, preventing forwarding to self.__file.isatty().
- **Reference Fix Mechanism:** Explicitly implemented 'def isatty(self) -> bool: return self.__file.isatty()' on FileProxy in rich/file_proxy.py alongside flush() and fileno().
- **Agent Traps & Pitfalls:** Assuming FileProxy.__getattr__ automatically proxies all file methods without realizing io.TextIOBase defines concrete defaults like isatty() that shadow __getattr__.

##### `rich_4079` (#21, `Textualize/rich`, Bug Fix, 1 file(s), `+4/-3`, Complexity: Low)

- **Target Files & Symbols:** `rich/markdown.py` — `rich/markdown.py`, `TableDataElement.on_text`, `Text.stylize`, `Text.append`, `Text.append_text`
- **Symptom / Exception:** Inline code spans (and other pre-styled Text objects) inside Markdown table cells rendered with broken/overwritten styling.
- **Root Cause:** In rich/markdown.py:TableDataElement.on_text, the code unconditionally ran text.stylize(context.current_style) on both plain strings and already-styled Text instances. Applying stylize() over a pre-styled Text object layered the cell's context.current_style on top of existing spans, overriding the inline code styling.
- **Reference Fix Mechanism:** Changed TableDataElement.on_text to branch on isinstance(text, str): plain strings are styled and appended via self.content.append(text, context.current_style), while pre-styled Text instances are appended directly via self.content.append_text(text) without calling stylize().
- **Agent Traps & Pitfalls:** Calling text.stylize_before() or mutating the incoming Text object in place rather than preserving it untouched via append_text(), or patching TextElement/Paragraph instead of TableDataElement.

##### `rich_3718` (#67, `Textualize/rich`, Bug Fix, 1 file(s), `+3/-4`, Complexity: Low)

- **Target Files & Symbols:** `rich/panel.py` — `rich/panel.py`, `Panel.__rich_console__`
- **Symptom / Exception:** `Panel` title and subtitle text do not inherit the panel's background (base) `style`, rendering with missing background styling along the top and bottom border text.
- **Root Cause:** In `Panel.__rich_console__` (`rich/panel.py`), `title_text.stylize_before(partial_border_style)` and `subtitle_text.stylize_before(partial_border_style)` applied only `console.get_style(self.border_style)` rather than the combined `border_style = style + console.get_style(self.border_style)`, omitting the panel's base `self.style` (and its background color) from titles and subtitles.
- **Reference Fix Mechanism:** Removed `partial_border_style`, computed `border_style = style + console.get_style(self.border_style)` directly, and passed `border_style` to both `title_text.stylize_before(border_style)` and `subtitle_text.stylize_before(border_style)`.
- **Agent Traps & Pitfalls:** Using `stylize()` instead of `stylize_before()` overwrites inline markup styles inside the title/subtitle text; also easy to fix only `title_text` while overlooking `subtitle_text`.

##### `rich_3934` (#68, `Textualize/rich`, Bug Fix, 2 file(s), `+17/-3`, Complexity: Low)

- **Target Files & Symbols:** `rich/live.py`, `rich/live_render.py` — `rich/live.py`, `Live.stop`, `rich/live_render.py`, `LiveRender.last_render_height`, `LiveRender._shape`
- **Symptom / Exception:** Stopping a `Live` display that rendered an empty renderable (e.g., empty `Group()`) outputs an unwanted trailing newline (`\n`) to the terminal.
- **Root Cause:** `Live.stop` in `rich/live.py` unconditionally invoked `self.console.line()` whenever `not self._alt_screen and self.console.is_terminal`, without checking whether `LiveRender` actually rendered any non-zero height lines (`self._shape[1] > 0`).
- **Reference Fix Mechanism:** Added a `last_render_height` property on `LiveRender` (`rich/live_render.py`) returning `0` when `self._shape is None` else `self._shape[1]`, and added `and self._live_render.last_render_height` to the condition guarding `self.console.line()` in `Live.stop`.
- **Agent Traps & Pitfalls:** Checking only `self._live_render._shape is not None` fails for rendered-but-empty renderables like `Group()`, where `_shape` is `(0, 0)` (truthy tuple, yet height is `0`); also must still restore cursor visibility and pop the render hook.

##### `rich_3938` (#72, `Textualize/rich`, Bug Fix, 2 file(s), `+40/-5`, Complexity: Medium)

- **Target Files & Symbols:** `rich/console.py`, `rich/segment.py` — `rich/console.py`, `Console.print`, `rich/segment.py`, `Segment.split_lines_terminator`, `Segment.apply_style`
- **Symptom / Exception:** `console.print(..., style=..., soft_wrap=True)` with a background style applies the ANSI background style across `\n` newline characters, causing background color bleed across terminal lines.
- **Root Cause:** In `Console.print` (`rich/console.py`), `Segment.apply_style(render(renderable, render_options), self.get_style(style))` applied `style` to every segment indiscriminately, including `"\n"` newline segments. With `soft_wrap=True`, newline segments emitted with active background SGR codes cause terminals to bleed background colors past line breaks instead of resetting style before `\n`.
- **Reference Fix Mechanism:** Added `Segment.split_lines_terminator` in `rich/segment.py` to split segment streams on non-control `"\n"` characters while yielding `(line, add_new_line)` tuples, and updated `Console.print` to apply `render_style` only to each line's segments before appending an unstyled `Segment.line()` when `add_new_line` is True.
- **Agent Traps & Pitfalls:** Reusing `Segment.split_lines` (which discards whether a trailing `\n` existed) either drops trailing newlines or injects spurious ones when `end=""`; also failing to skip control segments (`not segment.control`) corrupts terminal control sequences.

##### `rich_3882` (#73, `Textualize/rich`, Bug Fix, 1 file(s), `+1/-1`, Complexity: Low)

- **Target Files & Symbols:** `rich/prompt.py` — `rich/prompt.py`, `PromptBase.on_validate_error`, `InvalidResponse`
- **Symptom / Exception:** Prompt validation errors print raw unparsed Rich markup tags (e.g., `[prompt.invalid]Please enter Y or N`) when the prompt's `Console` was initialized with `markup=False`.
- **Root Cause:** Built-in `PromptBase` error messages embed Rich markup tags (`[prompt.invalid]...`), but `PromptBase.on_validate_error` in `rich/prompt.py` called `self.console.print(error)` without passing `markup=True`, inheriting the console's global `markup=False` flag.
- **Reference Fix Mechanism:** Updated `PromptBase.on_validate_error` to call `self.console.print(error, markup=True)` so validation error markup is always rendered regardless of the console's global markup setting.
- **Agent Traps & Pitfalls:** Stripping markup from prompt error strings or modifying `InvalidResponse` breaks themed `[prompt.invalid]` styling when markup is desired, instead of simply overriding `markup=True` on `self.console.print`.

##### `rich_3935` (#75, `Textualize/rich`, Bug Fix, 1 file(s), `+13/-3`, Complexity: Medium)

- **Target Files & Symbols:** `rich/table.py` — `rich/table.py`, `Table._get_padding_width`, `Table._measure_column`, `Table._calculate_column_widths`
- **Symptom / Exception:** `Table` (and `Columns`, which builds on `Table`) over-allocates column padding width when `pad_edge=False` and/or `collapse_padding=True`, causing premature wrapping or misaligned column layouts.
- **Root Cause:** `Table._get_padding_width` in `rich/table.py` never checked `self.pad_edge`, so it always counted `pad_left` on column `0` and `pad_right` on the last column (`len(self.columns) - 1`) even when outer edge padding was disabled. Additionally, when `self.collapse_padding` was True, it only collapsed `pad_left` for `column_index > 0`, leaving column `0` with uncollapsed left padding.
- **Reference Fix Mechanism:** Updated `Table._get_padding_width` to collapse padding unconditionally via `pad_left = 0; pad_right = abs(pad_left - pad_right)` when `self.collapse_padding` is True, and added an `if not self.pad_edge:` guard zeroing `pad_left` for `column_index == 0` and `pad_right` for `column_index == len(self.columns) - 1`.
- **Agent Traps & Pitfalls:** Patching cell rendering in `_get_cells`/`_render` without updating `_get_padding_width` leaves `_measure_column` and `_calculate_column_widths` inconsistent; also easy to overlook that `Columns` relies on `Table(pad_edge=False, collapse_padding=True)` and breaks `tests/test_columns.py` if edge/collapse interactions are wrong.

##### `rich_3180` (#99, `Textualize/rich`, Bug Fix, 2 file(s), `+89/-38`, Complexity: Medium)

- **Target Files & Symbols:** `rich/_wrap.py`, `rich/cells.py` — `rich/cells.py:chop_cells`, `rich/_wrap.py:divide_line`, `rich/_wrap.py:words`
- **Symptom / Exception:** Double-width CJK characters disappear or wrap at incorrect offsets when folding long mixed-width or CJK text across terminal lines.
- **Root Cause:** In `rich/cells.py:chop_cells`, the loop iterated `for character, size in reversed(characters):`, chopping strings backward from the end instead of forward from the start. When `rich/_wrap.py:divide_line` summed `len(line)` from those reversed chunks to compute forward break offsets (`start += len(line)`), mixed-width and double-width CJK words produced break positions whose cell widths exceeded `width` or split inside double-width characters, causing characters to be cropped/disappear during rendering.
- **Reference Fix Mechanism:** Rewrote `rich/cells.py:chop_cells(text: str, width: int) -> list[str]` to iterate forward (`for character in text:`), tracking `total_width` with `_get_character_cell_size(character)` and starting a new line `[character]` whenever `total_width + cell_width > width`; updated `rich/_wrap.py:divide_line` to call `chop_cells(word, width=width)` while preserving browser-style line-move-then-fold semantics.
- **Agent Traps & Pitfalls:** Removing `max_size`/`position` parameters from `chop_cells` requires updating call sites in `rich/_wrap.py`; attempting to patch only `divide_line` without fixing `reversed(characters)` in `chop_cells` leaves mixed-width/CJK line splitting broken; changing `divide_line` folding logic carelessly breaks existing tests for leading/trailing whitespace, consecutive spaces, and long words following full-width words.

##### `rich_3782` (#103, `Textualize/rich`, Refactor + Bug Fix, 1 file(s), `+24/-5`, Complexity: Medium)

- **Target Files & Symbols:** `rich/syntax.py` — `rich/syntax.py:PaddingProperty`, `rich/syntax.py:Syntax.__init__`, `rich/syntax.py:Syntax._get_syntax`, `rich/syntax.py:Syntax.__rich_console__`, `rich/syntax.py:Syntax.__rich_measure__`
- **Symptom / Exception:** Rendering a `Syntax` block with horizontal `padding` overflows `options.max_width` (or wraps/clips lines at the wrong width) because the inner code width ignores horizontal padding.
- **Root Cause:** In `rich/syntax.py:Syntax._get_syntax`, when `self.code_width is None`, `code_width` was computed from `options.max_width` (minus `_numbers_column_width + 1` if `line_numbers`) without subtracting `pad_left + pad_right` or clamping at `0`. `Syntax.__rich_console__` then wrapped those full-width segments inside `Padding(..., pad=self.padding)`, causing total rendered width to exceed `options.max_width`.
- **Reference Fix Mechanism:** Added `PaddingProperty` descriptor on `Syntax` so `self.padding` always unpacks via `Padding.unpack(padding)` into a normalized 4-tuple stored in `self._padding`; updated `Syntax._get_syntax` to subtract `horizontal_padding = pad_left + pad_right` when `self.code_width is None` and clamp `code_width = max(0, code_width)`; updated `Syntax.__rich_console__` from `if self.padding:` to `if any(self.padding):`; and unpacked `self.padding` directly in `__rich_measure__`.
- **Agent Traps & Pitfalls:** Leaving `if self.padding:` in `__rich_console__` after normalizing `self.padding` to a 4-tuple `(0, 0, 0, 0)` evaluates truthy and wraps zero-padded syntax blocks in `Padding`; subtracting `horizontal_padding` when `self.code_width` is explicitly provided breaks explicit width settings; omitting `max(0, code_width)` produces negative widths when padding exceeds `options.max_width`.

##### `rich_3296` (#105, `Textualize/rich`, Bug Fix, 1 file(s), `+1/-3`, Complexity: Low)

- **Target Files & Symbols:** `rich/syntax.py` — `rich/syntax.py:Syntax.__rich_console__`, `rich/syntax.py:Syntax._get_base_style`, `rich/syntax.py:Syntax._theme.get_background_style`, `rich/padding.py:Padding`
- **Symptom / Exception:** When rendering Syntax with both padding and a background_color override, the padding border renders with the theme's original background color rather than the overridden background_color.
- **Root Cause:** In rich/syntax.py, Syntax.__rich_console__ wrapped rendered segments in Padding(segments, style=self._theme.get_background_style(), pad=self.padding) when self.padding was truthy. Calling self._theme.get_background_style() bypassed self.background_color, which is only merged into the base style by Syntax._get_base_style().
- **Reference Fix Mechanism:** Replaced style=self._theme.get_background_style() with style=self._get_base_style() when yielding Padding in Syntax.__rich_console__, ensuring the padding uses the resolved background color override (or falls back to the theme background when no override is set).
- **Agent Traps & Pitfalls:** The problem statement only provides screenshot links and a brief title without naming _get_base_style(). Agents that manually build Style(bgcolor=self.background_color) instead of delegating to self._get_base_style() risk breaking fallback behavior when background_color is None or 'default'.

##### `rich_3469` (#117, `Textualize/rich`, Bug Fix, 1 file(s), `+1/-1`, Complexity: Medium)

- **Target Files & Symbols:** `rich/markdown.py` — `rich/markdown.py:Markdown.__rich_console__`
- **Symptom / Exception:** Rendering a Markdown table that contains empty cells emits superfluous blank lines above the rendered table.
- **Root Cause:** In rich/markdown.py, Markdown.__rich_console__ yielded _new_line_segment whenever should_render and new_line were True, regardless of node_type. For empty Markdown table cells, the parser emits 'inline' tokens that satisfy should_render, causing block-separator newlines to be emitted prematurely for inline nodes inside the table.
- **Reference Fix Mechanism:** Tightened the newline emission condition in Markdown.__rich_console__ (rich/markdown.py) from 'if new_line:' to 'if new_line and node_type != "inline":'.
- **Agent Traps & Pitfalls:** The prompt ('fix superfluous space / Fixes #3027') does not mention Markdown tables or empty cells. Agents may erroneously chase trailing spaces in Paragraph/TableDataElement rather than inspecting how new_line and node_type == 'inline' interact in Markdown.__rich_console__.

##### `rich_3278` (#119, `Textualize/rich`, Bug Fix, 1 file(s), `+1/-0`, Complexity: Low)

- **Target Files & Symbols:** `rich/ansi.py` — `rich/ansi.py:re_ansi`, `rich/ansi.py:AnsiDecoder`
- **Symptom / Exception:** ANSI private (Fp) escape sequences such as \x1b7 and \x1b8 (cursor save/restore) are not stripped by Text.from_ansi()/AnsiDecoder, leaking raw control sequences that scramble terminal cursor position and output.
- **Root Cause:** The master ANSI tokenizer regex re_ansi in rich/ansi.py matched OSC (\x1b]...\x1b\\) and standard two-byte/CSI sequences (\x1b[@-Z\\-_] or \x1b[...), but omitted private Fp escape sequences in the range \x1b0 through \x1b? (ASCII 0x30-0x3F).
- **Reference Fix Mechanism:** Prepended the non-capturing alternative '(?:\x1b[0-?])|' to re_ansi in rich/ansi.py so private Fp escape sequences are matched and ignored/stripped by the ANSI parser.
- **Agent Traps & Pitfalls:** Adding a capturing group (...) instead of a non-capturing group (?:...) shifts the capture group indices unpacked by _ansi_tokenize and breaks existing OSC/SGR parsing; likewise, using an overly wide character class that overlaps '[' (0x5B) or ']' (0x5D) would swallow valid CSI/OSC color and hyperlink sequences.

##### `rich_2725` (#121, `Textualize/rich`, Bug Fix, 1 file(s), `+5/-5`, Complexity: Low)

- **Target Files & Symbols:** `rich/table.py` — `rich/table.py:Table._render`, `rich/box.py:Box`
- **Symptom / Exception:** Tables rendered with custom Box definitions having distinct mid and foot vertical/side glyphs display foot box characters on body rows and mid box characters on the last/footer row.
- **Root Cause:** In rich/table.py:Table._render, the 3-element box_segments list was constructed in the order [head_segments, foot_segments, mid_segments], whereas the rendering loop indexes slot 1 for middle body rows and slot 2 for the footer/final row.
- **Reference Fix Mechanism:** Swapped the second and third tuples in box_segments inside rich/table.py:Table._render so the list is ordered [head_segments, mid_segments, foot_segments].
- **Agent Traps & Pitfalls:** Standard built-in Box presets often share identical characters for mid and foot verticals, hiding the swap unless tested with distinct characters per slot. Swapping index constants at downstream call sites instead of fixing the list order risks breaking one of the four show_header/show_footer combinations.

##### `rich_3105` (#122, `Textualize/rich`, Bug Fix, 1 file(s), `+1/-1`, Complexity: Low)

- **Target Files & Symbols:** `rich/_export_format.py` — `rich/_export_format.py:CONSOLE_HTML_FORMAT`, `rich/console.py:Console.export_html`
- **Symptom / Exception:** HTML exported via Console.export_html() renders in the browser's default monospace font rather than the intended Menlo/'DejaVu Sans Mono'/consolas/'Courier New' font stack.
- **Root Cause:** In rich/_export_format.py, CONSOLE_HTML_FORMAT set the font-family stack on <pre style="font-family:..."> but wrapped {code} in an unstyled <code> tag. Browser user-agent stylesheets specify font-family: monospace directly on <code>, overriding the parent <pre>'s font-family instead of inheriting it.
- **Reference Fix Mechanism:** Updated CONSOLE_HTML_FORMAT in rich/_export_format.py to add style="font-family:inherit" on the inner <code> element (<code style="font-family:inherit">{code}</code>).
- **Agent Traps & Pitfalls:** The problem statement is completely opaque ('Fix #3104 / See #3104'). Even with issue context, moving font-family onto <code> or adding a <style> CSS rule instead of exact inline style="font-family:inherit" will fail the exact-string HTML snapshot assertions in tests/test_console.py.

##### `rich_3130` (#123, `Textualize/rich`, Bug Fix, 1 file(s), `+5/-7`, Complexity: Medium)

- **Target Files & Symbols:** `rich/markdown.py` — `rich/markdown.py:TableDataElement.__init__`, `rich/markdown.py:TableDataElement.on_text`, `rich/markdown.py:TableDataElement.create`
- **Symptom / Exception:** Markdown table cells containing multiple inline styles (bold, italic, strikethrough) or hyperlinks lose earlier text fragments and drop link/inline styles, rendering only the final text span.
- **Root Cause:** In rich/markdown.py, TableDataElement.__init__ initialized self.content as an empty string and TableDataElement.on_text overwrote self.content = Text(plain, justify=self.justify, style=context.style_stack.current) on every text callback, discarding previous fragments and stripping existing spans/links by reading text.plain. Additionally, TableDataElement.create had a missing-comma typo token.attrs.get('style' '').
- **Reference Fix Mechanism:** Initialized self.content: Text = Text('', justify=justify) in TableDataElement.__init__, updated TableDataElement.on_text to convert str to Text, apply text.stylize(context.current_style) (preserving existing spans/links), and accumulate via self.content.append_text(text), and cleaned up token.attrs.get('style') in TableDataElement.create.
- **Agent Traps & Pitfalls:** Two major Rich-specific traps: (1) calling self.content.append(text, style=context.current_style) raises ValueError when text is already a Text object (e.g. inline links/code), so stylize + append_text is required; (2) omitting justify=justify when initializing self.content = Text('', justify=justify) breaks column alignment tested in test_inline_styles_with_justification.

##### `rich_3043` (#124, `Textualize/rich`, Bug Fix, 1 file(s), `+1/-1`, Complexity: Low)

- **Target Files & Symbols:** `rich/_export_format.py` — `rich/_export_format.py:CONSOLE_HTML_FORMAT`, `rich/console.py:Console.export_html`
- **Symptom / Exception:** Console.export_html() produces invalid HTML markup with the <head> element placed outside and before the opening <html> tag.
- **Root Cause:** In rich/_export_format.py, CONSOLE_HTML_FORMAT mistakenly placed the opening <html> tag after </head> (just before <body>) instead of immediately after <!DOCTYPE html>.
- **Reference Fix Mechanism:** Moved <html> in rich/_export_format.py:CONSOLE_HTML_FORMAT from between </head> and <body> to immediately after <!DOCTYPE html> and before <head>.
- **Agent Traps & Pitfalls:** The prompt says only 'Fix the HTML export template (#3021)' without naming the misplaced tag. Agents must carefully audit CONSOLE_HTML_FORMAT and avoid making unrelated HTML/CSS edits that would break exact-string snapshot assertions in test_export_html and test_export_html_inline.

##### `rich_3061` (#129, `Textualize/rich`, Feature + Bug Fix, 1 file(s), `+67/-24`, Complexity: High)

- **Target Files & Symbols:** `rich/text.py` — `rich/text.py:Text.expand_tabs`, `rich/text.py:Text.extend_style`, `rich/text.py:Span.extend`, `rich/text.py:Text.__init__`, `rich/text.py:Text.__rich_console__`, `rich/text.py:Text.append`
- **Symptom / Exception:** Text.expand_tabs() replaced tabs with unstyled spaces (ignoring active style spans), miscalculated tab stops on multi-line and double-width Unicode text, Text.tab_size was shadowed by console.tab_size, and empty-string styles created redundant spans.
- **Root Cause:** In rich/text.py, Text.expand_tabs appended tab padding spaces with only self.style (dropping inline Span styles covering the tab), tracked character count len(part) instead of display width part.cell_len, and failed to reset pos = 0 on each new line. Additionally, Text.__init__ defaulted tab_size=8 while __rich_console__ used 'console.tab_size or self.tab_size or 8' (making console.tab_size override explicit Text.tab_size), and append/append_text/append_tokens checked 'is not None' instead of truthiness, creating useless empty-style spans.
- **Reference Fix Mechanism:** Added Span.extend(cells) and Text.extend_style(spaces) to extend end-reaching spans across appended spaces; rewrote Text.expand_tabs to track per-line cell_position using part.cell_len, replace trailing '\t' with ' ', extend tab styles via part.extend_style(tab_size - tab_remainder), and join parts via Text('').join(new_text); changed Text.tab_size default to None with precedence 'console.tab_size if self.tab_size is None else self.tab_size' in __rich_console__; and changed style checks to truthiness ('if style:' / 'if text.style:') in append, append_text, and append_tokens.
- **Agent Traps & Pitfalls:** The problem statement mistypes expand_tabs as 'Text.extend_tabs' and omits several coupled changes required by tests: (1) adding the new public Text.extend_style helper tested by test_extend_style; (2) resetting cell_position per line and using cell_len for double-width emoji ('💩\t💩'); and (3) filtering out empty-string style spans in append/append_text/append_tokens, which changes segment merging expected by tests/test_panel.py::test_render_size.

### 4.2 `BUG_TYPE_SCHEMA` — Type System, Introspection, Schema & Validation Defects (34 Bug/Error Tasks)

Defects in Python type/annotation introspection (`Annotated`, `Union`, `ForwardRef`, `partial`, `wraps`, `__getattr__` proxies), OpenAPI/JSON Schema generation, Pydantic serialization/validation, and attribute/type guards.

#### 4.2.1 `BUG_TYPE_SCHEMA.ANNOTATION_AND_INTROSPECTION` (14 Tasks)

*Nested `Annotated`, `Union`/`Optional`, `ForwardRef` globals, `@wraps`/`functools.partial`, `isclass`, `Parameter.empty` identity, `Json[list[...]]`, and `__getattr__` proxy detection.*

##### `requests_7505` (#11, `psf/requests`, Refactor + Bug Fix, 2 file(s), `+9/-7`, Complexity: Low)

- **Target Files & Symbols:** `src/requests/_types.py`, `src/requests/models.py` — `src/requests/_types.py`, `SupportsRead`, `has_read`, `src/requests/models.py`, `RequestEncodingMixin._encode_params`, `RequestEncodingMixin._encode_files`
- **Symptom / Exception:** Posting a __getattr__-based read-only proxy object as request data failed file-like detection in _encode_params and prepare_body, mis-encoding the body or incorrectly attaching Content-Type: application/x-www-form-urlencoded.
- **Root Cause:** After #7502 patched _encode_files, two remaining call sites in src/requests/models.py (RequestEncodingMixin._encode_params and PreparedRequest.prepare_body) still used bare isinstance(data, _SupportsRead). Because Python's @runtime_checkable Protocol checks class attributes along the MRO without invoking __getattr__, proxy objects that delegate .read dynamically failed isinstance(data, _SupportsRead).
- **Reference Fix Mechanism:** Defined has_read(obj: Any) -> TypeIs[SupportsRead[str | bytes]] in src/requests/_types.py returning isinstance(obj, SupportsRead) or hasattr(obj, 'read'), moved 'from . import _types as _t' to runtime imports in src/requests/models.py, and replaced all three _SupportsRead checks in _encode_params, _encode_files, and prepare_body with _t.has_read(...).
- **Agent Traps & Pitfalls:** Leaving 'from . import _types as _t' inside 'if TYPE_CHECKING:' (causing NameError at runtime), dropping isinstance(obj, SupportsRead) or the TypeIs return type (breaking static type narrowing), or forgetting the prepare_body content_type check.

##### `requests_7502` (#12, `psf/requests`, Bug Fix, 1 file(s), `+3/-1`, Complexity: Low)

- **Target Files & Symbols:** `src/requests/models.py` — `src/requests/models.py`, `RequestEncodingMixin._encode_files`, `_SupportsRead`
- **Symptom / Exception:** Uploading a tempfile.NamedTemporaryFile (or another __getattr__-based file wrapper) via files=... failed to read the file content during multipart form encoding.
- **Root Cause:** In src/requests/models.py:RequestEncodingMixin._encode_files, readable file objects were detected solely with isinstance(fp, _SupportsRead). Because stdlib wrappers like tempfile._TemporaryFileWrapper expose .read via __getattr__ rather than defining it on the wrapper class, @runtime_checkable Protocol isinstance(fp, _SupportsRead) evaluated to False and skipped fp.read().
- **Reference Fix Mechanism:** Updated the readable-object branch in RequestEncodingMixin._encode_files to 'elif isinstance(fp, _SupportsRead) or hasattr(fp, "read"):' so __getattr__-based file wrappers are recognized and read via fp.read().
- **Agent Traps & Pitfalls:** Replacing isinstance(fp, _SupportsRead) outright with hasattr(fp, 'read') (losing static type narrowing on fp.read()), or patching prepare_body instead of _encode_files where multipart files= payloads are read.

##### `requests_7433` (#13, `psf/requests`, Bug Fix, 1 file(s), `+3/-3`, Complexity: Low)

- **Target Files & Symbols:** `src/requests/models.py` — `src/requests/models.py`, `PreparedRequest.prepare_body`, `Iterable`
- **Symptom / Exception:** Passing a __getattr__-based file wrapper as request data failed stream detection in prepare_body, breaking streamed uploads and redirect replay (test_getattr_proxy_stream_follows_redirect).
- **Root Cause:** In src/requests/models.py:PreparedRequest.prepare_body, stream detection checked 'isinstance(data, Iterable) and not isinstance(data, (str, bytes, list, tuple, Mapping))'. Because collections.abc.Iterable.__subclasshook__ inspects the class MRO for __iter__ without calling instance __getattr__, proxy file wrappers that delegate __iter__ via __getattr__ returned False and bypassed the streaming code path.
- **Reference Fix Mechanism:** Changed the check in PreparedRequest.prepare_body to compute 'is_iterable = isinstance(data, Iterable) or hasattr(data, "__iter__")' before checking 'if is_iterable and not isinstance(data, (str, bytes, list, tuple, Mapping)):' so __getattr__-based iterables enter the stream branch.
- **Agent Traps & Pitfalls:** Checking hasattr(data, 'read') instead of hasattr(data, '__iter__') in the stream branch (altering behavior for non-iterable read-only objects), or accidentally dropping the exclusion of (str, bytes, list, tuple, Mapping).

##### `fastapi_12942` (#34, `fastapi/fastapi`, Bug Fix, 1 file(s), `+3/-0`, Complexity: Low)

- **Target Files & Symbols:** `fastapi/_compat.py` — `fastapi/_compat.py:field_annotation_is_complex`, `fastapi/_compat.py:_annotation_is_complex`
- **Symptom / Exception:** Endpoint parameter typed with a Pydantic v2 tagged discriminated union (e.g., Annotated[Annotated[ModelA, Tag('a')] | Annotated[ModelB, Tag('b')], Discriminator(...)]) is misclassified as a query parameter instead of a request body, causing 422 validation errors.
- **Root Cause:** In fastapi/_compat.py:field_annotation_is_complex, union annotations recurse over `get_args(annotation)`, but when a union member is itself an `Annotated[Model, Tag(...)]` type, `origin` is `Annotated` and neither `_annotation_is_complex(annotation)` nor `_annotation_is_complex(origin)` recognizes it as complex, causing `field_annotation_is_complex` to return False.
- **Reference Fix Mechanism:** Added a recursive unwrapping check `if origin is Annotated: return field_annotation_is_complex(get_args(annotation)[0])` inside `field_annotation_is_complex` in fastapi/_compat.py so nested `Annotated` wrappers inside unions are stripped before complexity detection.
- **Agent Traps & Pitfalls:** Unwrapping only top-level Annotated in analyze_param is insufficient because tagged discriminated unions nest Annotated inside Union members inside an outer Annotated; also note the compat module layout (single file fastapi/_compat.py in this revision).

##### `fastapi_14485` (#42, `fastapi/fastapi`, Bug Fix, 1 file(s), `+13/-6`, Complexity: Low)

- **Target Files & Symbols:** `fastapi/dependencies/utils.py` — `fastapi/dependencies/utils.py:_get_signature`, `fastapi/dependencies/utils.py:get_typed_signature`, `fastapi/dependencies/utils.py:get_typed_return_annotation`
- **Symptom / Exception:** NameError at route registration/startup when a module uses `from __future__ import annotations` and references a type imported only under `if TYPE_CHECKING:` (e.g., `AsyncGenerator` in a dependency's return annotation).
- **Root Cause:** Following #11355, `get_typed_signature` and `get_typed_return_annotation` called `inspect.signature(call, eval_str=True)` on Python >= 3.10 without error handling. `eval_str=True` eagerly evaluates all parameter and return annotations of `call`, raising `NameError` for any `TYPE_CHECKING`-only symbol even when FastAPI never uses that annotation (such as a dependency's return type).
- **Reference Fix Mechanism:** Extracted a shared `_get_signature(call)` helper in fastapi/dependencies/utils.py that wraps `inspect.signature(call, eval_str=True)` in `try ... except NameError:` and falls back to `inspect.signature(call)`, and called `_get_signature` from both `get_typed_signature` and `get_typed_return_annotation`.
- **Agent Traps & Pitfalls:** Simply reverting `eval_str=True` breaks the Python 3.10 stringified-annotation fix from #11355; catching `NameError` only in `get_typed_signature` leaves `get_typed_return_annotation` crashing; and catching overly broad exceptions can hide genuine signature errors.

##### `fastapi_14458` (#45, `fastapi/fastapi`, Bug Fix, 1 file(s), `+6/-1`, Complexity: Low)

- **Target Files & Symbols:** `fastapi/dependencies/models.py` — `fastapi/dependencies/models.py:Dependant.is_gen_callable`, `fastapi/dependencies/models.py:Dependant.is_async_gen_callable`, `fastapi/dependencies/models.py:Dependant.is_coroutine_callable`, `fastapi/dependencies/models.py:_unwrapped_call`
- **Symptom / Exception:** Using a class (not an instance) that defines an async or generator `__call__` method as a dependency fails at runtime (e.g., `TypeError: object <Class> can't be used in 'await' expression`) because FastAPI treats class instantiation as a coroutine/generator.
- **Root Cause:** A regression in #14448 removed `inspect.isclass` checks before inspecting `getattr(..., "__call__", None)` in `Dependant.is_gen_callable`, `is_async_gen_callable`, and `is_coroutine_callable` (fastapi/dependencies/models.py). For a class `Cls` with `async def __call__(self)`, `getattr(Cls, "__call__")` returns the unbound async method even though calling `Cls(...)` synchronously constructs an instance.
- **Reference Fix Mechanism:** Added `if inspect.isclass(_unwrapped_call(self.call)): return False` prior to inspecting `dunder_call` in all three cached properties (`is_gen_callable`, `is_async_gen_callable`, `is_coroutine_callable`) in fastapi/dependencies/models.py.
- **Agent Traps & Pitfalls:** Checking `inspect.isclass(self.call)` instead of `inspect.isclass(_unwrapped_call(self.call))` fails when a class dependency is wrapped with `functools.partial` or a decorator; fixing only `is_coroutine_callable` leaves `is_gen_callable` and `is_async_gen_callable` broken.

##### `fastapi_14448` (#47, `fastapi/fastapi`, Bug Fix, 2 file(s), `+82/-24`, Complexity: High)

- **Target Files & Symbols:** `fastapi/dependencies/models.py`, `fastapi/dependencies/utils.py` — `fastapi/dependencies/models.py:_impartial`, `fastapi/dependencies/models.py:_unwrapped_call`, `fastapi/dependencies/models.py:Dependant.is_gen_callable`, `fastapi/dependencies/models.py:Dependant.is_async_gen_callable`, `fastapi/dependencies/models.py:Dependant.is_coroutine_callable`, `fastapi/dependencies/utils.py:_solve_generator`
- **Symptom / Exception:** Path operations or dependencies combining `@functools.wraps` and `functools.partial` (including sync wrappers around async functions, async wrappers around sync functions, nested partials, or wrapped callable instances) fail at runtime with unawaited coroutines or wrong generator context manager dispatch.
- **Root Cause:** Previously, `Dependant._unwrapped_call` called `inspect.unwrap(self.call)` before checking a single `isinstance(..., partial)` layer, failing on `partial(wrapped_fn)` and nested partials, and `is_coroutine_callable`/`is_gen_callable`/`is_async_gen_callable` checked only the innermost unwrapped target—missing when the outer wrapper itself was async/generator or when `__call__` was wrapped/partial. Additionally, `_solve_generator` in fastapi/dependencies/utils.py checked `is_gen_callable` before `is_async_gen_callable`, misdispatching wrapped async generators.
- **Reference Fix Mechanism:** Added `_impartial(func)` (looping through nested `partial`s) and `_unwrapped_call(call)` (`inspect.unwrap(_impartial(call))`) in fastapi/dependencies/models.py, updated all three callable-classification properties to inspect both outer `_impartial(self.call)` and inner `_unwrapped_call(self.call)` plus their `__call__` attributes (also passed through `_impartial`/`_unwrapped_call`), and reordered `_solve_generator` to check `is_async_gen_callable` before `is_gen_callable`.
- **Agent Traps & Pitfalls:** Calling `inspect.unwrap` before stripping `partial` fails because `partial` lacks `__wrapped__`; checking only the unwrapped target misses an async wrapper around a sync function; forgetting to prioritize `is_async_gen_callable` over `is_gen_callable` in `_solve_generator` breaks mixed sync/async wrapped generators; and omitting `inspect.isclass` checks introduces the class-dependency regression later fixed in #14458.

##### `fastapi_9753` (#49, `fastapi/fastapi`, Feature + Bug Fix, 1 file(s), `+5/-2`, Complexity: Low)

- **Target Files & Symbols:** `fastapi/dependencies/models.py` — `fastapi/dependencies/models.py:Dependant._unwrapped_call`, `fastapi/dependencies/models.py:Dependant.is_coroutine_callable`, `fastapi/dependencies/models.py:Dependant.is_gen_callable`, `fastapi/dependencies/models.py:Dependant.is_async_gen_callable`
- **Symptom / Exception:** `functools.partial()` dependencies wrapping async functions, generators, async generators, or callable class instances fail inconsistently (e.g., async partials are executed synchronously without awaiting and return coroutine objects).
- **Root Cause:** In fastapi/dependencies/models.py:Dependant._unwrapped_call, only `inspect.unwrap(self.call)` was applied. Because `functools.partial` objects do not expose `__wrapped__` and are not themselves coroutine/generator functions (inspecting `partial.__call__` sees the C wrapper rather than `partial.func`), `is_coroutine_callable`, `is_gen_callable`, and `is_async_gen_callable` returned False.
- **Reference Fix Mechanism:** Imported `partial` from `functools` in fastapi/dependencies/models.py and extended `Dependant._unwrapped_call` to unwrap `if isinstance(unwrapped, partial): unwrapped = unwrapped.func` after `inspect.unwrap(self.call)`.
- **Agent Traps & Pitfalls:** Replacing `self.call` itself instead of `_unwrapped_call` drops the pre-bound partial arguments at execution time; patching only `is_coroutine_callable` misses generator, async generator, and callable-class partials.

##### `fastapi_5077` (#51, `fastapi/fastapi`, Feature + Bug Fix, 1 file(s), `+4/-2`, Complexity: Low)

- **Target Files & Symbols:** `fastapi/dependencies/utils.py` — `fastapi/dependencies/utils.py:get_typed_signature`, `fastapi/dependencies/utils.py:get_typed_return_annotation`
- **Symptom / Exception:** NameError: name '<ForwardRefType>' is not defined during route registration when an endpoint or dependency with forward-reference annotations is decorated with `@functools.wraps` defined in a different module.
- **Root Cause:** `functools.wraps` copies `__annotations__` (including string forward references) onto the wrapper function, whose `__globals__` belongs to the decorator's module rather than the original function's module. In fastapi/dependencies/utils.py, `get_typed_signature` and `get_typed_return_annotation` retrieved `globalns = getattr(call, "__globals__", {})` from the outer wrapper instead of unwrapping `__wrapped__`, so `evaluate_forwardref` failed to resolve types from the original module.
- **Reference Fix Mechanism:** Called `unwrapped = inspect.unwrap(call)` and extracted `globalns = getattr(unwrapped, "__globals__", {})` in both `get_typed_signature` and `get_typed_return_annotation` in fastapi/dependencies/utils.py.
- **Agent Traps & Pitfalls:** Passing `unwrapped` into `inspect.signature(...)` instead of keeping `inspect.signature(call)` can discard custom `__signature__` overrides set by decorators; fixing only `get_typed_signature` misses forward-referenced return annotations in `get_typed_return_annotation`; and checking `call.__wrapped__` only once fails for stacked decorators.

##### `fastapi_9555` (#52, `fastapi/fastapi`, Feature + Bug Fix, 1 file(s), `+14/-8`, Complexity: Low)

- **Target Files & Symbols:** `fastapi/dependencies/models.py` — `fastapi/dependencies/models.py:Dependant._unwrapped_call`, `fastapi/dependencies/models.py:Dependant.is_gen_callable`, `fastapi/dependencies/models.py:Dependant.is_async_gen_callable`, `fastapi/dependencies/models.py:Dependant.is_coroutine_callable`
- **Symptom / Exception:** AttributeError: 'coroutine' object has no attribute '...' (or unawaited coroutine / unhandled generator) when an async or generator dependency is decorated with `@functools.wraps` or `@functools.cache`.
- **Root Cause:** In fastapi/dependencies/models.py, `Dependant.is_gen_callable`, `is_async_gen_callable`, and `is_coroutine_callable` inspected `self.call` directly without following `__wrapped__`. Decorator wrappers like `functools._lru_cache_wrapper` do not register as coroutine or generator functions themselves, causing FastAPI to invoke them synchronously in a threadpool instead of awaiting or entering a context manager.
- **Reference Fix Mechanism:** Added a `@cached_property def _unwrapped_call(self)` on `Dependant` returning `inspect.unwrap(self.call)` (when `self.call is not None`) and switched `is_gen_callable`, `is_async_gen_callable`, and `is_coroutine_callable` to inspect `self._unwrapped_call` instead of `self.call`.
- **Agent Traps & Pitfalls:** Mutating `self.call` to the unwrapped function would bypass the decorator (e.g., `@cache` or `@wraps`) at call time—unwrapping must only be used for introspection; updating only `is_coroutine_callable` leaves wrapped generators, async generators, and callable classes broken.

##### `fastapi_9425` (#64, `fastapi/fastapi`, Bug Fix, 1 file(s), `+2/-0`, Complexity: Low)

- **Target Files & Symbols:** `fastapi/dependencies/utils.py` — `fastapi/dependencies/utils.py`, `get_typed_annotation`, `evaluate_forwardref`, `ForwardRef`
- **Symptom / Exception:** Routes annotated with `-> None` and a bodiless status code like `204 No Content` fail validation/registration when `from __future__ import annotations` (PEP 563 stringified annotations) is active.
- **Root Cause:** In `get_typed_annotation` (`fastapi/dependencies/utils.py`), stringified annotations such as `"None"` were wrapped in `ForwardRef` and evaluated via `evaluate_forwardref`. Python's `ForwardRef` evaluation resolves `"None"` to `type(None)` (`NoneType`) rather than `None`, breaking FastAPI's downstream checks for `None` return annotations on bodiless responses.
- **Reference Fix Mechanism:** Added `if annotation is type(None): return None` right after `evaluate_forwardref(annotation, globalns, globalns)` inside `get_typed_annotation`, normalizing evaluated `NoneType` back to `None`.
- **Agent Traps & Pitfalls:** Special-casing only `annotation == "None"` before evaluation misses aliases resolving to `NoneType`, while patching only `APIRoute`'s 204 check leaves other callers of `get_typed_annotation`/`get_typed_signature` inconsistent between stringified and non-stringified annotations.

##### `fastapi_14297` (#87, `fastapi/fastapi`, Bug Fix, 1 file(s), `+7/-0`, Complexity: Low)

- **Target Files & Symbols:** `fastapi/_compat/v2.py` — `fastapi/_compat/v2.py:serialize_sequence_value`, `fastapi/_compat/shared.py:sequence_types`, `fastapi/_compat/shared.py:sequence_annotation_to_type`
- **Symptom / Exception:** `TypeError: issubclass() arg 1 must be a class` (or equivalent Python 3.14 `TypeError`) when handling requests with an optional sequence parameter such as `files: Optional[List[bytes]] = File(None)` under Pydantic V2.
- **Root Cause:** In `fastapi/_compat/v2.py:serialize_sequence_value`, `origin_type = get_origin(field.field_info.annotation) or field.field_info.annotation` resolves to `typing.Union` for `Optional[List[bytes]]`. Passing `typing.Union` directly to `assert issubclass(origin_type, shared.sequence_types)` raises `TypeError` because `Union` is not a class and cannot be looked up in `shared.sequence_annotation_to_type`.
- **Reference Fix Mechanism:** Added an `if origin_type is Union:` block in `serialize_sequence_value` that iterates `get_args(field.field_info.annotation)`, skips `type(None)`, extracts the first non-`None` member's origin via `get_origin(union_arg) or union_arg`, and uses it as `origin_type` for `issubclass` and `shared.sequence_annotation_to_type[origin_type](value)`.
- **Agent Traps & Pitfalls:** Indexing `union_args[0]` directly fails when `None` appears first in the union (`Union[None, list[str]]`, covered by `test_serialize_sequence_value_with_none_first_in_union`); forgetting `or union_arg` breaks unparameterized sequence types like `Optional[list]` where `get_origin(list)` is `None`.

##### `fastapi_14616` (#92, `fastapi/fastapi`, Bug Fix, 1 file(s), `+10/-2`, Complexity: Low)

- **Target Files & Symbols:** `fastapi/dependencies/utils.py` — `fastapi/dependencies/utils.py:_is_json_field`, `fastapi/dependencies/utils.py:_get_multidict_value`, `fastapi/_compat/shared.py:is_sequence_field`
- **Symptom / Exception:** Declaring a parameter as `Json[list[str]]` (or `Json` wrapping any sequence type) with `Form()`, `Query()`, `Header()`, or `Cookie()` fails validation with `TypeError: JSON input should be string, bytes or bytearray` (HTTP 422).
- **Root Cause:** In Pydantic V2, `Json[list[str]]` expands to `Annotated[list[str], Json()]`, so `is_sequence_field(field)` inspects the inner `list[str]` annotation and returns `True`. In `fastapi/dependencies/utils.py:_get_multidict_value`, this caused FastAPI to call `values.getlist(alias)`, wrapping the raw JSON string `'["abc", "def"]'` inside a Python list `['["abc", "def"]']` before passing it to Pydantic's `Json` validator, which rejects list inputs.
- **Reference Fix Mechanism:** Added `_is_json_field(field)` in `fastapi/dependencies/utils.py` checking `any(type(item) is Json for item in field.field_info.metadata)` and gated the `values.getlist(alias)` branch in `_get_multidict_value` with `(not _is_json_field(field))` so `values.get(alias, None)` returns the single raw JSON string.
- **Agent Traps & Pitfalls:** Checking `get_origin(field.type_) is Json` fails because Pydantic V2 stores `Json()` inside `field.field_info.metadata` rather than as an outer generic origin; fixing only `_extract_form_body` misses `Query`, `Header`, and `Cookie` parameters tested by `test_json_type.py`.

##### `rich_3006` (#126, `Textualize/rich`, Bug Fix, 1 file(s), `+1/-1`, Complexity: Low)

- **Target Files & Symbols:** `rich/repr.py` — `rich/repr.py:auto`, `rich/repr.py:auto_rich_repr`
- **Symptom / Exception:** Classes decorated with @rich.repr.auto whose __init__ default argument defines a custom __eq__ returning True (or raising/returning non-bool) against inspect.Parameter.empty produce corrupted repr() output omitting keyword names/defaults.
- **Root Cause:** In rich/repr.py:auto_rich_repr, parameter introspection checked whether a parameter lacked a default using value equality (if param.default == param.empty:). Because == delegates to param.default.__eq__(Parameter.empty), custom default objects overriding __eq__ could erroneously compare equal to Parameter.empty, making auto_rich_repr yield a positional value instead of a (name, value, default) tuple.
- **Reference Fix Mechanism:** Replaced value equality (param.default == param.empty) with identity comparison (param.default is param.empty) in rich/repr.py:auto_rich_repr.
- **Agent Traps & Pitfalls:** Confusing the sentinel identity check (param.default is param.empty) with the runtime value-vs-default comparison later during repr formatting (which legitimately uses value equality == to omit arguments equal to their default).

#### 4.2.2 `BUG_TYPE_SCHEMA.SCHEMA_AND_OPENAPI` (11 Tasks)

*`$ref` key/value collisions, `anyOf` shared-dict duplication, `-Input`/`-Output` mode splits, `@computed_field` omission, OAuth2 scope merging, OpenAPI 3.1 `contentMediaType`, and Swagger `<script>` XSS escaping.*

##### `fastapi_14986` (#9, `fastapi/fastapi`, Refactor + Bug Fix, 2 file(s), `+25/-9`, Complexity: Medium)

- **Target Files & Symbols:** `fastapi/applications.py`, `fastapi/openapi/docs.py` — `fastapi/applications.py`, `FastAPI.setup`, `FastAPI.openapi`, `fastapi/openapi/docs.py`, `_html_safe_json`, `get_swagger_ui_html`
- **Symptom / Exception:** Per-request root_path values permanently persisted and accumulated in self.servers across unrelated requests, and HTML special characters like '</script>' in swagger_ui_parameters or init_oauth were emitted unescaped inside Swagger UI's <script> block.
- **Root Cause:** In fastapi/applications.py:FastAPI.setup, the /openapi.json endpoint mutated self.servers.insert(0, {'url': root_path}) and a shared closure set server_urls whenever an unseen req.scope['root_path'] arrived, poisoning the app's configured servers list across subsequent requests. Separately, fastapi/openapi/docs.py:get_swagger_ui_html interpolated raw json.dumps() output for swagger_ui_parameters and init_oauth directly inside an HTML <script> tag without escaping '<', '>', or '&'.
- **Reference Fix Mechanism:** Changed the openapi route in FastAPI.setup to read schema = self.openapi(), shallow-copy it via dict(schema) when root_path is missing from schema['servers'], and attach a fresh list [{'url': root_path}] + schema.get('servers', []) per request without mutating self.servers or the cached schema. Added _html_safe_json() in fastapi/openapi/docs.py replacing '<', '>', and '&' with '\u003c', '\u003e', and '\u0026', and used it for swagger_ui_parameters keys/values and init_oauth.
- **Agent Traps & Pitfalls:** Mutating the dict or servers list returned by self.openapi() in place (which corrupts the cached self.openapi_schema across requests) instead of shallow-copying schema and creating a new servers list; or using html.escape() instead of JSON Unicode escapes, which corrupts JS/JSON strings inside <script>.

##### `fastapi_14463` (#33, `fastapi/fastapi`, Bug Fix, 1 file(s), `+2/-1`, Complexity: Low)

- **Target Files & Symbols:** `fastapi/openapi/utils.py` — `fastapi/openapi/utils.py:get_openapi_path`, `APIRoute.responses`
- **Symptom / Exception:** Generated OpenAPI schema (/openapi.json) accumulates repeated duplicate $ref entries inside `anyOf` (multiplied by the number of routes) when app-level `responses` specifies both a Union `model` and a `content` dict (e.g., `examples`).
- **Root Cause:** In fastapi/openapi/utils.py:get_openapi_path, iterating over `route.responses.items()` created only a shallow copy via `process_response = additional_response.copy()`. Because app-level `responses` dicts are shared across all routes, nested dictionaries like `additional_response["content"]["application/json"]` remained shared by reference, so subsequent schema merging mutated the shared `anyOf` list in place once per route.
- **Reference Fix Mechanism:** Imported the `copy` module in fastapi/openapi/utils.py and changed `additional_response.copy()` to `copy.deepcopy(additional_response)` so each route processes an isolated copy of nested `content` dictionaries.
- **Agent Traps & Pitfalls:** Attempting to deduplicate `anyOf` arrays post-hoc or changing `deep_dict_update` treats only the symptom and still leaves shared `route.responses` dictionaries mutated across multiple calls to `app.openapi()`; deep-copying `additional_response` eliminates the root shared-state mutation.

##### `fastapi_14349` (#38, `fastapi/fastapi`, Bug Fix, 1 file(s), `+6/-6`, Complexity: Low)

- **Target Files & Symbols:** `fastapi/_compat/v2.py` — `fastapi/_compat/v2.py:_replace_refs`
- **Symptom / Exception:** AttributeError: 'dict' object has no attribute 'split' during OpenAPI schema generation when a Pydantic v2 model contains a field named or aliased "$ref".
- **Root Cause:** In fastapi/_compat/v2.py:_replace_refs, encountering `if key == "$ref":` unconditionally executed `schema["$ref"].split("/")[-1]`, assuming every "$ref" key in a JSON Schema dict holds a reference URI string. When a model has a property aliased "$ref", the value under `properties["$ref"]` is a nested property-schema dict rather than a str.
- **Reference Fix Mechanism:** Added an `if isinstance(value, str):` guard before calling `.split("/")[-1]` inside the `if key == "$ref":` branch of `_replace_refs`, and removed the redundant `else: new_schema["$ref"] = schema["$ref"]` branch since `new_schema` is already a deepcopy.
- **Agent Traps & Pitfalls:** Forgetting that `"$ref"` can appear as a property key whose value is a dict (not a string), or checking only the top-level schema instead of inside recursive `_replace_refs` traversal.

##### `fastapi_14459` (#46, `fastapi/fastapi`, Refactor + Bug Fix, 3 file(s), `+49/-22`, Complexity: High)

- **Target Files & Symbols:** `fastapi/dependencies/models.py`, `fastapi/dependencies/utils.py`, `fastapi/openapi/utils.py` — `fastapi/dependencies/models.py:Dependant._uses_scopes`, `fastapi/dependencies/models.py:Dependant._is_security_scheme`, `fastapi/dependencies/models.py:Dependant._security_scheme`, `fastapi/dependencies/models.py:Dependant._security_dependencies`, `fastapi/dependencies/utils.py:get_flat_dependant`, `fastapi/dependencies/utils.py:get_dependant`
- **Symptom / Exception:** OpenAPI schema renders an OAuth2 security scheme with empty scopes `[]` instead of the required parent scopes when a parent dependency declares scopes around a sub-dependency security scheme that has no scopes and is also reused without scopes elsewhere.
- **Root Cause:** In fastapi/dependencies/models.py, `Dependant._uses_scopes` returned False for bare `SecurityBase` sub-dependencies with no `own_oauth_scopes`, allowing their cached `Dependant` (and its static `SecurityRequirement(scopes=[])` created during `get_dependant`) to be reused without parent scopes. Furthermore, `get_flat_dependant` did not propagate `parent_oauth_scopes` down into flattened sub-dependencies.
- **Reference Fix Mechanism:** Removed the separate `SecurityRequirement` dataclass and `Dependant.security_requirements` list, added `_is_security_scheme`, `_security_scheme`, and `_security_dependencies` properties to `Dependant`, and made `_uses_scopes` return True when `_is_security_scheme` is True. Updated `get_flat_dependant` in fastapi/dependencies/utils.py to propagate `parent_oauth_scopes` recursively and flatten `dependencies`, and updated `get_openapi_security_definitions` in fastapi/openapi/utils.py to read schemes and `oauth_scopes` directly from `flat_dependant._security_dependencies`.
- **Agent Traps & Pitfalls:** Patching only `get_openapi_security_definitions` cannot recover scopes lost during dependency caching/`get_flat_dependant`; removing `SecurityRequirement` requires flattening `flat_dependant.dependencies` (previously unpopulated in `get_flat_dependant`) and checking `_unwrapped_call(self.call)` for `isinstance(..., SecurityBase)`.

##### `fastapi_14455` (#48, `fastapi/fastapi`, Bug Fix, 1 file(s), `+11/-2`, Complexity: Low)

- **Target Files & Symbols:** `fastapi/openapi/utils.py` — `fastapi/openapi/utils.py:get_openapi_security_definitions`
- **Symptom / Exception:** OpenAPI operation `security` array emits duplicate entries for the same OAuth2 security scheme with separate scope lists (e.g., `[{"OAuth2": ["read"]}, {"OAuth2": ["write"]}]`, implying logical OR instead of AND) when a route combines multiple Security dependencies for the same scheme.
- **Root Cause:** In fastapi/openapi/utils.py:get_openapi_security_definitions, each `security_requirement` in `flat_dependant.security_requirements` was unconditionally appended as a separate dict (`operation_security.append({security_name: security_requirement.scopes})`) without merging scopes for identical `security_name` keys.
- **Reference Fix Mechanism:** Replaced the list append with an insertion-ordered `operation_security_dict: Dict[str, List[str]] = {}` that merges and deduplicates scopes per `security_name` (`for scope in security_requirement.scopes or []:`), then converts it to `[{name: scopes} for name, scopes in operation_security_dict.items()]`.
- **Agent Traps & Pitfalls:** Using a Python `set` to deduplicate scopes breaks deterministic ordering and fails OpenAPI snapshot tests; failing to handle `security_requirement.scopes is None` causes `TypeError`; and schemes with zero scopes must still retain an empty `[]` entry in `operation_security_dict`.

##### `fastapi_14361` (#53, `fastapi/fastapi`, Bug Fix, 1 file(s), `+1/-1`, Complexity: Low)

- **Target Files & Symbols:** `fastapi/_compat/v2.py` — `fastapi/_compat/v2.py`, `_remap_definitions_and_field_mappings`
- **Symptom / Exception:** KeyError: '$ref' during OpenAPI schema generation when Pydantic v2 emits an inline JSON schema without a '$ref' key for a type present in model_name_map.
- **Root Cause:** In fastapi/_compat/v2.py, _remap_definitions_and_field_mappings iterated over field_mapping.items() and checked only `if model not in model_name_map:` before evaluating `schema["$ref"].split("/")[-1]`. When Pydantic v2 inlines a schema directly into field_mapping (e.g., for certain Enum or literal/union fields whose type is also in model_name_map) instead of emitting a $ref object, indexing `schema["$ref"]` raises KeyError.
- **Reference Fix Mechanism:** Updated the guard condition in `_remap_definitions_and_field_mappings` to `if model not in model_name_map or "$ref" not in schema: continue`, skipping non-reference inline schemas before extracting `old_name` from `schema["$ref"]`.
- **Agent Traps & Pitfalls:** The problem statement is a terse reference to Discussion #14265 with no reproducer; agents may mistakenly modify `model_name_map` construction or `GenerateJsonSchema` instead of guarding the `"$ref"` lookup in `_remap_definitions_and_field_mappings`.

##### `fastapi_13207` (#54, `fastapi/fastapi`, Bug Fix, 1 file(s), `+12/-2`, Complexity: Medium)

- **Target Files & Symbols:** `fastapi/_compat/v2.py` — `fastapi/_compat/v2.py`, `get_schema_from_model_field`, `get_definitions`, `GenerateJsonSchema`
- **Symptom / Exception:** Pydantic v2 `@computed_field` properties are silently omitted from the generated OpenAPI output schema when `FastAPI(separate_input_output_schemas=False)` is enabled.
- **Root Cause:** When `separate_input_output_schemas=False`, both `get_definitions` and `get_schema_from_model_field` in `fastapi/_compat/v2.py` forced `override_mode = "validation"`. Because Pydantic v2 includes `@computed_field` entries only in `"serialization"` mode JSON schemas (not `"validation"` mode), forcing validation mode caused computed fields to disappear from response schemas.
- **Reference Fix Mechanism:** Checked `field._type_adapter.core_schema.get("schema", {}).get("computed_fields", [])` in both `get_definitions` (`has_computed_fields = any(...)`) and `get_schema_from_model_field` (`len(computed_fields) > 0`), keeping `override_mode = None` whenever computed fields are present even if `separate_input_output_schemas=False` so `field.mode` (`"serialization"` for output fields) is preserved.
- **Agent Traps & Pitfalls:** Updating `override_mode` in only one of `get_definitions` or `get_schema_from_model_field` causes a `KeyError` on `field_mapping[(field, override_mode or field.mode)]` because generation and lookup modes diverge; also checking `BaseModel.model_computed_fields` directly fails for non-BaseModel or wrapped `TypeAdapter` annotations.

##### `fastapi_14266` (#61, `fastapi/fastapi`, Bug Fix, 1 file(s), `+8/-10`, Complexity: Low)

- **Target Files & Symbols:** `fastapi/dependencies/utils.py` — `fastapi/dependencies/utils.py`, `get_dependant`, `get_parameterless_sub_dependant`, `SecurityBase`, `SecurityRequirement`
- **Symptom / Exception:** Security schemes registered as top-level app/router/route dependencies (e.g., `FastAPI(dependencies=[Depends(HTTPBearer())])`) enforce auth at runtime but are omitted from the OpenAPI schema's `security` and `components.securitySchemes`.
- **Root Cause:** In `get_dependant` (`fastapi/dependencies/utils.py`), the `if isinstance(..., SecurityBase):` check that appends a `SecurityRequirement` was executed only inside the parent's signature parameter loop on `sub_dependant`. Parameterless dependencies created by `get_parameterless_sub_dependant` call `get_dependant` directly and bypass that loop, leaving `dependant.security_requirements` empty.
- **Reference Fix Mechanism:** Moved the `if isinstance(call, SecurityBase):` check to the top of `get_dependant` before the signature parameter loop, registering `SecurityRequirement(security_scheme=call, scopes=use_scopes)` directly on `dependant` regardless of how `get_dependant` was entered.
- **Agent Traps & Pitfalls:** Duplicating the `SecurityBase` check inside `get_parameterless_sub_dependant` instead of centralizing it in `get_dependant` fragments security requirement collection; also ensure `OAuth2`/`OpenIdConnect` scope propagation still attaches `security_scopes` cleanly.

##### `fastapi_14246` (#62, `fastapi/fastapi`, Bug Fix, 1 file(s), `+24/-4`, Complexity: Medium)

- **Target Files & Symbols:** `fastapi/_compat/v2.py` — `fastapi/_compat/v2.py`, `get_definitions`, `get_flat_models_from_fields`, `ModelField`
- **Symptom / Exception:** OpenAPI generation spuriously splits nested Pydantic v2 models into separate `*-Input` and `*-Output` definitions even when the nested model is only used in one mode (regression introduced in FastAPI 0.119.0).
- **Root Cause:** In `get_definitions` (`fastapi/_compat/v2.py`), all nested models were collected together via `get_flat_models_from_fields(fields, known_models=set())` and wrapped in `ModelField(field_info=FieldInfo(annotation=model), name=model.__name__)` without specifying `mode`, defaulting every nested model to `mode="validation"`. Nested models used exclusively inside `mode="serialization"` output fields were therefore also registered in validation mode, forcing Pydantic's `GenerateJsonSchema` to emit unnecessary `-Input`/`-Output` splits.
- **Reference Fix Mechanism:** Partitioned `fields` into `validation_fields` (`field.mode == "validation"`) and `serialization_fields` (`field.mode == "serialization"`), extracted `flat_validation_models` and `flat_serialization_models` separately via `get_flat_models_from_fields`, and instantiated their `ModelField` wrappers with explicit `mode="validation"` and `mode="serialization"` before concatenating them into `flat_model_fields`.
- **Agent Traps & Pitfalls:** Trying to post-process or deduplicate schemas in `_remap_definitions_and_field_mappings` instead of preserving `field.mode` when constructing `flat_model_fields` in `get_definitions`.

##### `fastapi_14791` (#79, `fastapi/fastapi`, Bug Fix, 1 file(s), `+2/-0`, Complexity: Low)

- **Target Files & Symbols:** `fastapi/openapi/utils.py` — `fastapi/openapi/utils.py:validation_error_definition`
- **Symptom / Exception:** Generated OpenAPI schemas for 422 HTTPValidationError responses omit the `input` and `ctx` fields actually returned by Pydantic V2 validation errors, causing OpenAPI-to-runtime drift and client schema validation mismatches.
- **Root Cause:** The hardcoded `validation_error_definition` dictionary in `fastapi/openapi/utils.py` only listed `loc`, `msg`, and `type` under `properties`, reflecting Pydantic V1's error shape rather than Pydantic V2's `ErrorDetails` payload which also emits optional `input` (arbitrary JSON value) and `ctx` (context dict) fields.
- **Reference Fix Mechanism:** Added `"input": {"title": "Input"}` (untyped so any JSON value is valid) and `"ctx": {"title": "Context", "type": "object"}` to `validation_error_definition["properties"]` in `fastapi/openapi/utils.py`, while keeping `"required": ["loc", "msg", "type"]` unchanged since both new fields are optional.
- **Agent Traps & Pitfalls:** Adding `input` or `ctx` to `required` breaks 29 OpenAPI snapshot tests and misrepresents optional fields; constraining `input` with a `"type"` (e.g., `string` or `object`) is incorrect because invalid inputs can be any JSON type.

##### `fastapi_14953` (#90, `fastapi/fastapi`, Refactor + Bug Fix, 4 file(s), `+102/-2`, Complexity: Medium)

- **Target Files & Symbols:** `docs_src/json_base64_bytes/tutorial001_py310.py`, `fastapi/_compat/v2.py`, `fastapi/datastructures.py`, `scripts/playwright/json_base64_bytes/image01.py` — `fastapi/_compat/v2.py:GenerateJsonSchema.bytes_schema`, `fastapi/datastructures.py:UploadFile.__get_pydantic_json_schema__`
- **Symptom / Exception:** Generated OpenAPI 3.1 / JSON Schema 2020-12 definitions for `bytes` and `UploadFile` emitted the obsolete OpenAPI 3.0 keyword `"format": "binary"` instead of `"contentMediaType": "application/octet-stream"` (and omitted `"contentEncoding": "base64"` for base64-configured `bytes` fields).
- **Root Cause:** `UploadFile.__get_pydantic_json_schema__` in `fastapi/datastructures.py` hardcoded `{"type": "string", "format": "binary"}`, and `fastapi/_compat/v2.py` re-exported Pydantic's unmodified `GenerateJsonSchema` whose `bytes_schema` still emitted OpenAPI 3.0 `"format": "binary"` rather than JSON Schema draft-07/2020-12 `contentMediaType` and `contentEncoding`.
- **Reference Fix Mechanism:** Subclassed `pydantic.json_schema.GenerateJsonSchema` in `fastapi/_compat/v2.py` to override `bytes_schema` with `"contentMediaType": "application/octet-stream"`, conditionally add `"contentEncoding": "base64"` based on `ser_json_bytes` (in serialization mode) or `val_json_bytes` (in validation mode), and preserve `update_with_validations(..., self.ValidationsMapping.bytes)`; also updated `UploadFile.__get_pydantic_json_schema__` to return `"contentMediaType": "application/octet-stream"`.
- **Agent Traps & Pitfalls:** Updating only `UploadFile` leaves raw `bytes` fields emitting `"format": "binary"`; overriding `bytes_schema` without calling `self.update_with_validations(json_schema, schema, self.ValidationsMapping.bytes)` silently drops `minLength`/`maxLength` validations; failing to branch on `self.mode == "serialization"` breaks separate input/output base64 schemas.

#### 4.2.3 `BUG_TYPE_SCHEMA.SERIALIZATION_AND_VALIDATION` (7 Tasks)

*`validation_alias`/`serialization_alias`, multidict `extra='allow'`, duplicate `TypeAdapter` metadata, `arbitrary_types_allowed`, `JSONDecodeError.__reduce__` pickling, and SSE single-line validation.*

##### `fastapi_15588` (#2, `fastapi/fastapi`, Bug Fix, 1 file(s), `+18/-5`, Complexity: Low)

- **Target Files & Symbols:** `fastapi/sse.py` — `fastapi/sse.py`, `ServerSentEvent`, `_check_single_line`, `_check_event_single_line`, `_check_id_valid`, `_check_id_no_null`
- **Symptom / Exception:** Constructing ServerSentEvent with multi-line event or id values (containing '\r' or '\n') silently succeeded instead of raising pydantic.ValidationError, emitting malformed or injected SSE wire frames.
- **Root Cause:** In fastapi/sse.py, ServerSentEvent.event had no Pydantic validator and ServerSentEvent.id only attached AfterValidator(_check_id_no_null), which rejected '\0' but allowed '\r' and '\n'. Because SSE wire formatting serializes event and id as single-line 'field: value' headers, embedded line breaks allowed applications passing unsanitized values to break or forge SSE directives.
- **Reference Fix Mechanism:** Added _check_single_line(v, field_name) raising ValueError("SSE '<field>' must be a single line") when '\r' or '\n' appears, attached AfterValidator(_check_event_single_line) to ServerSentEvent.event, and replaced _check_id_no_null with _check_id_valid so ServerSentEvent.id enforces both no-null and single-line validation.
- **Agent Traps & Pitfalls:** Checking only '\n' while omitting '\r' (SSE treats CR as a line ending), accidentally dropping the pre-existing '\0' check on id, or restricting comment/data/raw_data which legitimately support multi-line text.

##### `fastapi_14512` (#39, `fastapi/fastapi`, Bug Fix, 1 file(s), `+48/-4`, Complexity: Medium)

- **Target Files & Symbols:** `fastapi/_compat/v2.py` — `fastapi/_compat/v2.py:ModelField.__post_init__`, `fastapi/_compat/v2.py:asdict`, `fastapi/_compat/v2.py:_Attrs`
- **Symptom / Exception:** Pydantic TypeAdapter construction or request validation/OpenAPI schema generation fails when a tagged discriminated union is placed inside Annotated alongside Body().
- **Root Cause:** In fastapi/_compat/v2.py:ModelField.__post_init__, `annotated_args` was built as `(self.field_info.annotation, *self.field_info.metadata, self.field_info)`. Because `self.field_info` still retained its own `metadata` list (containing `Discriminator(...)`), passing both `*self.field_info.metadata` and `self.field_info` into `Annotated[...]` duplicated metadata entries when constructing the Pydantic TypeAdapter.
- **Reference Fix Mechanism:** Added a Pydantic < 2.12.3 compatibility helper `asdict(field_info)` (using `_Attrs` to extract non-Undefined FieldInfo attributes separately from `annotation` and `metadata`) in fastapi/_compat/v2.py, and updated `ModelField.__post_init__` to pass `(field_dict["annotation"], *field_dict["metadata"], Field(**field_dict["attributes"]))` into `Annotated[...]` so `metadata` is included exactly once.
- **Agent Traps & Pitfalls:** Removing `*self.field_info.metadata` regresses arbitrary-type metadata handling from #14482; calling `self.field_info.asdict()` directly fails on Pydantic versions < 2.12.3; and omitting attributes from `_Attrs` silently drops Field settings like alias, discriminator, exclude, or default_factory.

##### `fastapi_14482` (#43, `fastapi/fastapi`, Bug Fix, 1 file(s), `+25/-7`, Complexity: Medium)

- **Target Files & Symbols:** `fastapi/_compat/v2.py` — `fastapi/_compat/v2.py:ModelField`, `fastapi/_compat/v2.py:ModelField.__post_init__`, `fastapi/_compat/v2.py:get_model_fields`
- **Symptom / Exception:** PydanticSchemaGenerationError (unable to generate pydantic-core schema for custom/arbitrary type) or missing custom serializer/JSON schema metadata when a Pydantic v2 model specifies `arbitrary_types_allowed=True`.
- **Root Cause:** In fastapi/_compat/v2.py, `get_model_fields` constructed `ModelField` without passing the parent model's `model.model_config`, so `ModelField.__post_init__` instantiated `TypeAdapter` without `config=self.config` (losing `arbitrary_types_allowed=True`). Additionally, `ModelField.__post_init__` passed `Annotated[self.field_info.annotation, self.field_info]` without unpacking `*self.field_info.metadata`, dropping custom `PlainSerializer`/`WithJsonSchema` metadata on the field.
- **Reference Fix Mechanism:** Added `config: Union[ConfigDict, None] = None` to `ModelField`, updated `ModelField.__post_init__` to unpack `*self.field_info.metadata` into `Annotated[annotated_args]` and pass `config=self.config` to `TypeAdapter`, and updated `get_model_fields` to pass `model.model_config` except when the field type is a `BaseModel`, `dict`, or `dataclass` (where `model_config = None`).
- **Agent Traps & Pitfalls:** Major trap: passing `config=model.model_config` unconditionally into `TypeAdapter` triggers `PydanticUserError` whenever the field's annotation is itself a `BaseModel`, `TypedDict`/`dict`, or `dataclass` (which forbid overriding config on TypeAdapter); both the `lenient_issubclass(type_, (BaseModel, dict)) or is_dataclass(type_)` guard and `*self.field_info.metadata` unpacking are required.

##### `fastapi_14360` (#55, `fastapi/fastapi`, Bug Fix, 1 file(s), `+1/-2`, Complexity: Low)

- **Target Files & Symbols:** `fastapi/dependencies/utils.py` — `fastapi/dependencies/utils.py`, `request_params_to_args`, `_get_multidict_value`
- **Symptom / Exception:** HTTP 422 validation error when valid Query/Header/Cookie parameter model values are passed by field `alias`, and missing extra-parameter entry in `detail[0]["input"]` on 422 errors when passed by `field.name` instead of `alias`.
- **Root Cause:** In `request_params_to_args` (`fastapi/dependencies/utils.py`), values retrieved via `_get_multidict_value(field, received_params, alias=alias)` were stored under `params_to_process[field.name]` instead of `params_to_process[field.alias]`, causing Pydantic validation (which validates by alias) to treat the field as missing. Additionally, `processed_keys.add(field.name)` caused the subsequent extra-keys loop to ignore parameters submitted by `field.name`, omitting them from the validated `input` dict in 422 error responses.
- **Reference Fix Mechanism:** Changed `params_to_process[field.name] = value` to `params_to_process[field.alias] = value` and deleted `processed_keys.add(field.name)`, leaving only `processed_keys.add(alias or field.alias)`.
- **Agent Traps & Pitfalls:** Confusing the request-side `alias` (e.g., underscore-converted header key) with `field.alias` (the key expected by Pydantic model validation): `params_to_process` must use `field.alias`, while `processed_keys` tracks `alias or field.alias`; fixing only `params_to_process` without removing `processed_keys.add(field.name)` still breaks the `*_by_name` 422 input assertion.

##### `fastapi_14371` (#82, `fastapi/fastapi`, Bug Fix, 4 file(s), `+46/-16`, Complexity: High)

- **Target Files & Symbols:** `fastapi/_compat/v2.py`, `fastapi/dependencies/utils.py`, `fastapi/openapi/utils.py`, `fastapi/params.py` — `fastapi/_compat/v2.py:ModelField.validation_alias`, `fastapi/_compat/v2.py:ModelField.serialization_alias`, `fastapi/_compat/v2.py:get_schema_from_model_field`, `fastapi/dependencies/utils.py:get_validation_alias`, `fastapi/dependencies/utils.py:_get_multidict_value`, `fastapi/dependencies/utils.py:request_params_to_args`
- **Symptom / Exception:** Endpoints using `validation_alias`, `serialization_alias`, or `alias` on `Query`, `Path`, `Header`, `Cookie`, `Form`, `File`, or `Body` parameters fail with 422 validation errors, extract values under the wrong key, report wrong error `loc`, or emit mismatched OpenAPI parameter names and titles.
- **Root Cause:** Parameter extraction (`_get_multidict_value`, `request_params_to_args`, `_extract_form_body`, `request_body_to_args`), OpenAPI parameter/title generation (`fastapi/openapi/utils.py`, `get_schema_from_model_field`), and `Param`/`Body` initialization (`fastapi/params.py`) consistently referenced `field.alias` while ignoring Pydantic V2's `validation_alias` and `serialization_alias` fields, and `Param.__init__`/`Body.__init__` failed to default `validation_alias`/`serialization_alias` to `alias` when unset.
- **Reference Fix Mechanism:** Added `validation_alias` (returning non-empty `str` only) and `serialization_alias` properties to `v2.ModelField` plus mode-aware `field_alias` title generation in `get_schema_from_model_field`; added `get_validation_alias(field)` in `fastapi/dependencies/utils.py` and switched parameter lookup, `processed_keys`, `field_aliases`, error `loc`, and OpenAPI header underscore checks (`name == param.name`) to use it; and defaulted unset `validation_alias`/`serialization_alias` from `alias` in `Param.__init__` and `Body.__init__` under `PYDANTIC_V2`.
- **Agent Traps & Pitfalls:** Fixing only `request_params_to_args` misses `_extract_form_body`, `request_body_to_args`, `openapi/utils.py` header conversion, and `get_schema_from_model_field` titles; forgetting `getattr(field, 'validation_alias', None)` breaks Pydantic V1 compatibility; accepting non-string `validation_alias` (e.g., `AliasPath`/`AliasChoices`) without `isinstance(va, str) and va` breaks string dict lookups.

##### `fastapi_14303` (#88, `fastapi/fastapi`, Bug Fix, 1 file(s), `+6/-2`, Complexity: Low)

- **Target Files & Symbols:** `fastapi/dependencies/utils.py` — `fastapi/dependencies/utils.py:_extract_form_body`
- **Symptom / Exception:** When a `Form()` Pydantic model enables `extra="allow"` and receives multiple form values for an extra key (e.g., `param2=["456", "789"]`), only the last value (`"789"`) is passed to the model instead of the list `["456", "789"]`.
- **Root Cause:** In `fastapi/dependencies/utils.py:_extract_form_body`, undeclared extra form fields were collected by iterating `for key, value in received_body.items():`. Because Starlette's `FormData` (`ImmutableMultiDict`) implements `.items()` by returning only the last value per key, all earlier values for repeated extra keys were silently dropped.
- **Reference Fix Mechanism:** Changed the extra-fields loop in `_extract_form_body` to iterate `for key in received_body.keys():`, fetch all entries via `param_values = received_body.getlist(key)`, and store `param_values[0]` when `len(param_values) == 1` or the full list `param_values` otherwise.
- **Agent Traps & Pitfalls:** Unconditionally storing `received_body.getlist(key)` turns single-value extra parameters into 1-element lists, breaking `test_extra_param_single`; using `received_body.multi_items()` without aggregating values per key still overwrites `values[key]` with the last item.

##### `requests_6629` (#95, `psf/requests`, Bug Fix, 1 file(s), `+10/-0`, Complexity: Low)

- **Target Files & Symbols:** `src/requests/exceptions.py` — `src/requests/exceptions.py:JSONDecodeError.__reduce__`, `src/requests/compat.py:CompatJSONDecodeError`
- **Symptom / Exception:** Pickling and unpickling a `requests.exceptions.JSONDecodeError` via `pickle.loads(pickle.dumps(err))` raises `TypeError` (missing required positional arguments `doc` and `pos`), crashing multiprocessing worker pools when invalid JSON is encountered.
- **Root Cause:** `requests.exceptions.JSONDecodeError` inherits from `(InvalidJSONError, CompatJSONDecodeError)`, where `InvalidJSONError` derives from `RequestException(IOError)`. Due to MRO precedence, pickling invokes `IOError.__reduce__` (which serializes only the single message arg from `self.args`) instead of `CompatJSONDecodeError.__reduce__` (which preserves all three constructor arguments `msg`, `doc`, `pos`), so unpickling fails to instantiate `JSONDecodeError`.
- **Reference Fix Mechanism:** Implemented `JSONDecodeError.__reduce__(self)` in `src/requests/exceptions.py` to delegate explicitly to `CompatJSONDecodeError.__reduce__(self)`, preserving all arguments required by both stdlib `json.JSONDecodeError` and `simplejson.JSONDecodeError`.
- **Agent Traps & Pitfalls:** Reordering base classes to put `CompatJSONDecodeError` first risks altering `RequestException`/`IOError` MRO semantics; implementing `__reduce__` as `(self.__class__, self.args)` fails because `self.args` only contains `(msg,)` rather than `(msg, doc, pos)`.

#### 4.2.4 `BUG_TYPE_SCHEMA.TYPE_ERROR_AND_ATTR_GUARD` (2 Tasks)

*Uninitialized dataclass `field(init=False)` access and non-string `__qualname__` descriptors.*

##### `rich_3894` (#74, `Textualize/rich`, Bug Fix, 1 file(s), `+4/-0`, Complexity: Low)

- **Target Files & Symbols:** `rich/_inspect.py` — `rich/_inspect.py`, `Inspect._get_signature`
- **Symptom / Exception:** `rich.inspect()` crashes with `TypeError`/`AttributeError` when inspecting an object whose `__qualname__` attribute is not a `str` (e.g., a `__slots__` `member_descriptor` forwarded by `@functools.lru_cache`).
- **Root Cause:** In `Inspect._get_signature` (`rich/_inspect.py`), `qualname = name or getattr(obj, "__qualname__", name)` assumed any truthy `__qualname__` attribute is a `str`. When `__qualname__` is a non-string descriptor (such as on an `@lru_cache`-decorated class declaring `__slots__ = ("__qualname__",)`), passing the descriptor to subsequent string/`Text` operations raises an exception.
- **Reference Fix Mechanism:** Added `if not isinstance(qualname, str):` fallback checks in `Inspect._get_signature`, first falling back to `getattr(obj, "__name__", name)` and, if that is also not a `str`, falling back to `name`.
- **Agent Traps & Pitfalls:** Falling back directly to `name` loses `__name__` when `__qualname__` is non-string, whereas falling back to `getattr(obj, "__name__", name)` without a second `isinstance(qualname, str)` check still crashes if `__name__` is also a descriptor.

##### `rich_3472` (#113, `Textualize/rich`, Bug Fix, 1 file(s), `+3/-1`, Complexity: Low)

- **Target Files & Symbols:** `rich/pretty.py` — `rich/pretty.py:_traverse`, `rich/pretty.py:traverse`
- **Symptom / Exception:** Pretty-printing a dataclass instance with an uninitialized field (e.g., field(init=False) not yet assigned) raises AttributeError.
- **Root Cause:** In rich/pretty.py, the dataclass traversal branch in _traverse iterated over (field for field in fields(obj) if field.repr) and unconditionally called getattr(obj, field.name). Dataclass fields declared with init=False (or deleted attributes) remain in dataclasses.fields(obj) with field.repr == True even when absent from obj, triggering AttributeError.
- **Reference Fix Mechanism:** Added an attribute existence guard (and hasattr(obj, field.name)) to the generator comprehension passed to loop_last(...) inside rich/pretty.py:_traverse before calling getattr(obj, field.name).
- **Agent Traps & Pitfalls:** Catching AttributeError inside the loop body instead of filtering in the generator before loop_last(...) breaks the 'last' indicator when the final field is missing, leaving an erroneous trailing comma in the pretty-printed representation.

### 4.3 `BUG_LOGIC` — Algorithmic, Boundary, State & Control-Flow Defects (18 Bug/Error Tasks)

Defects in loop termination/recursion, boundary and empty-input handling, shared mutable state / cache invalidation / init lifecycle ordering, and control-flow dispatch.

#### 4.3.1 `BUG_LOGIC.BOUNDARY_AND_EMPTY_INPUT` (4 Tasks)

*Empty strings/collections, partial structures, prefixless empty-path validation, and custom `end=` edge cases.*

##### `rich_4075` (#23, `Textualize/rich`, Bug Fix, 1 file(s), `+12/-3`, Complexity: Low)

- **Target Files & Symbols:** `rich/console.py` — `rich/console.py`, `Console.print`, `NewLine`
- **Symptom / Exception:** Calling console.print(end='!') or console.print(end='') with no positional objects printed a newline instead of just the specified end string (failing assert console.file.getvalue() == '!').
- **Root Cause:** In rich/console.py:Console.print, an empty objects tuple ('if not objects:') was unconditionally replaced with (NewLine(),) regardless of the end parameter. Because NewLine renders a literal '\n' rather than emitting an empty renderable terminated by end, non-default end strings were ignored or preceded by a spurious newline.
- **Reference Fix Mechanism:** Added a check in Console.print under 'if not objects:' so objects = (NewLine(),) is only used when end == '\n', falling back to objects = ('',) otherwise so the custom end string is rendered cleanly.
- **Agent Traps & Pitfalls:** Removing the NewLine() path even when end == '\n' (which can change rendering/wrapping behavior for default blank-line console.print() calls), or writing end directly to self.file (bypassing Console recording, buffering, and styling).

##### `fastapi_15763` (#84, `fastapi/fastapi`, Bug Fix, 1 file(s), `+10/-3`, Complexity: Low)

- **Target Files & Symbols:** `fastapi/routing.py` — `fastapi/routing.py:APIRouter.include_router`, `fastapi/routing.py:_iter_included_route_candidates`, `fastapi/routing.py:_iter_routes_with_context`, `fastapi/routing.py:_EffectiveRouteContext`
- **Symptom / Exception:** Including a prefixless router that itself includes a prefixed sub-router containing an empty-path (`""`) route falsely raises `FastAPIError: Prefix and path cannot be both empty (path operation: ...)` even though the route's effective path is non-empty.
- **Root Cause:** In `fastapi/routing.py:APIRouter.include_router`, the prefixless validation branch iterated `_iter_included_route_candidates(router.routes)` and inspected `getattr(r, "path", None)` on the raw underlying route object instead of its effective contextual path. After the #15745 tree-based router inclusion refactor, a route with `path=""` inside a sub-router included with a non-empty prefix still had raw `r.path == ""`, falsely tripping `if path is not None and not path:`.
- **Reference Fix Mechanism:** Switched the validation loop in `APIRouter.include_router` to iterate `_iter_routes_with_context(router.routes)`, resolving `(path, name)` from `route_context.starlette_route` when present, `route_context` for contextualized `APIRoute`s, or the bare `route` when `route_context is None`, before checking `if path is not None and not path:`.
- **Agent Traps & Pitfalls:** Removing the empty-path validation check breaks `test_no_prefix_include_validation_rejects_empty_effective_api_route_path`; forgetting the `elif route_context.starlette_route is not None:` branch mishandles plain Starlette `Route` objects included via a prefixed router.

##### `fastapi_13537` (#89, `fastapi/fastapi`, Bug Fix, 1 file(s), `+2/-1`, Complexity: Low)

- **Target Files & Symbols:** `fastapi/dependencies/utils.py` — `fastapi/dependencies/utils.py:_extract_form_body`, `fastapi/dependencies/utils.py:_get_multidict_value`
- **Symptom / Exception:** Submitting an HTML form with an empty string (`""`) for an optional form/file field defaulting to `None` (e.g., `age: Optional[int] = Form(None)`) triggers a 422 validation error instead of resolving to `None`.
- **Root Cause:** In `fastapi/dependencies/utils.py:_extract_form_body`, `_get_multidict_value` maps an empty form value (`""`) to `None` so declared optional fields can fall back to their default, and the first loop skips adding keys whose value is `None` (`if value is not None: values[field.alias] = value`). The second loop that gathers extra form fields checked `if key not in values:`, mistaking omitted `None`-valued declared fields for unvisited extra fields and re-inserting their raw `""` string from `received_body`, causing Pydantic validation to fail.
- **Reference Fix Mechanism:** Precomputed `field_aliases = {field.alias for field in body_fields}` in `_extract_form_body` and changed the extra-fields guard from `if key not in values:` to `if key not in field_aliases:` so declared fields already processed as `None` are never re-added.
- **Agent Traps & Pitfalls:** Assigning `values[field.alias] = None` in the first loop instead of tracking `field_aliases` breaks fields that have non-`None` defaults by passing explicit `None` to Pydantic validation.

##### `rich_3064` (#127, `Textualize/rich`, Bug Fix, 1 file(s), `+8/-9`, Complexity: Low)

- **Target Files & Symbols:** `rich/markdown.py` — `rich/markdown.py:TableElement.__rich_console__`
- **Symptom / Exception:** Rendering a partial or header-only Markdown table (e.g., '| Simple | Table |\n| ------ | ----- ') crashes with AssertionError.
- **Root Cause:** In rich/markdown.py, TableElement.__rich_console__ used unconditional assertions (assert self.header is not None, assert self.header.row is not None, assert self.body is not None) before iterating header cells and body rows. Partial or header-only Markdown tables legitimately parse with self.body as None (or missing header/row), causing those assertions to fail at runtime.
- **Reference Fix Mechanism:** Replaced the three assert statements in TableElement.__rich_console__ (rich/markdown.py) with conditional guards: 'if self.header is not None and self.header.row is not None:' and 'if self.body is not None:'.
- **Agent Traps & Pitfalls:** The prompt ('fix for markdown table / Fixes #3053') omits the partial-table reproduction. Guarding only self.body while leaving the self.header assertions intact leaves headerless edge cases vulnerable; conversely, suppressing table yield completely when self.body is None fails test_partial_table, which expects the header-only table to render.

#### 4.3.2 `BUG_LOGIC.CONTROL_FLOW_AND_DISPATCH` (1 Tasks)

*Hoisted loop variables and parameter-order-dependent dispatch defects.*

##### `fastapi_11194` (#93, `fastapi/fastapi`, Bug Fix, 1 file(s), `+3/-4`, Complexity: Low)

- **Target Files & Symbols:** `fastapi/dependencies/utils.py` — `fastapi/dependencies/utils.py:_extract_form_body`
- **Symptom / Exception:** Endpoints declaring a `Form` parameter before a `bytes` or `list[bytes]` `File` parameter fail with HTTP 422 validation errors, whereas reversing the parameter declaration order succeeds.
- **Root Cause:** In `fastapi/dependencies/utils.py:_extract_form_body`, the code hoisted `first_field = body_fields[0]` and `first_field_info = first_field.field_info` outside the loop and tested `isinstance(first_field_info, params.File)` for every `field` in `body_fields`. Whenever a `Form` parameter was declared first, `isinstance(first_field_info, params.File)` evaluated to `False` for all subsequent `File` fields, skipping `await value.read()` and leaving raw `UploadFile` objects to fail `bytes`/`list[bytes]` validation.
- **Reference Fix Mechanism:** Removed `first_field` and `first_field_info` from `_extract_form_body`, assigned `field_info = field.field_info` inside the `for field in body_fields:` loop, and checked `isinstance(field_info, params.File)` in both the single-`bytes` and `bytes`-sequence branches.
- **Agent Traps & Pitfalls:** Fixing only the first `if` branch (`is_bytes_field`) while leaving `first_field_info` in the `elif` branch (`is_bytes_sequence_field`) leaves `list[bytes] = File()` broken when declared after a `Form` parameter (`test_file_list_form_order`).

#### 4.3.3 `BUG_LOGIC.INFINITE_LOOP_OR_RECURSION` (4 Tasks)

*Unbounded `while` loops, zero-advance cursors, self-mutating list iteration, or cyclic exception/router graphs.*

##### `rich_4006` (#24, `Textualize/rich`, Bug Fix, 1 file(s), `+33/-12`, Complexity: Medium)

- **Target Files & Symbols:** `rich/cells.py` — `rich/cells.py`, `split_graphemes`, `get_character_cell_size`, `chop_cells`
- **Symptom / Exception:** Calling split_graphemes() (and callers like chop_cells()) hung in an infinite while loop on strings starting with zero-width characters or '\ufe0f', or containing consecutive '\ufe0f' after a narrow-to-wide character; trailing '\u200d' also created out-of-bounds span end indices.
- **Root Cause:** In rich/cells.py:split_graphemes, the 'while index < codepoint_count' loop failed to advance index in two situations: (1) encountering '\ufe0f' in SPECIAL when last_measured_character was None (at string start or after a narrow-to-wide character cleared it) hit 'continue' without incrementing index; (2) encountering a zero-width character while spans was empty failed both 'if character_width' and 'elif spans' without incrementing index. Additionally, a trailing '\u200d' unconditionally ran 'index += 2' past codepoint_count, and a leading '\u200d' left uncovered index gaps.
- **Reference Fix Mechanism:** Added an 'if not spans:' guard inside the SPECIAL branch to emit a zero-width span and advance index by 1, bounded ZWJ advancement to 'index += 2 if index < (codepoint_count - 1) else 1', moved 'index += 1' before 'if last_measured_character:' in the VS16 branch while extending spans[-1] in both branches, and added an else fallback in the zero-width branch to append (index, index := index + 1, 0) when spans is empty.
- **Agent Traps & Pitfalls:** Fixing only one infinite-loop trigger (e.g., VS16 without fixing leading zero-width characters), failing to extend spans[-1] on a VS16 with last_measured_character=None (leaving index gaps that break chop_cells), or leaving 'index += 2' unguarded when ZWJ is the final codepoint.

##### `fastapi_14258` (#25, `fastapi/fastapi`, Bug Fix, 1 file(s), `+4/-0`, Complexity: Low)

- **Target Files & Symbols:** `fastapi/routing.py` — `fastapi/routing.py`, `APIRouter.include_router`
- **Symptom / Exception:** Calling router.include_router(router) entered an infinite loop (exhausting memory) instead of raising a clear AssertionError.
- **Root Cause:** In fastapi/routing.py:APIRouter.include_router, there was no guard checking whether self is router before iterating over router.routes and appending new routes to self.routes. When a router with routes was included into itself, mutating the same list being iterated caused unbounded self-appending.
- **Reference Fix Mechanism:** Added 'assert self is not router, "Cannot include the same APIRouter instance into itself. Did you mean to include a different router?"' at the top of APIRouter.include_router alongside the existing prefix assertions.
- **Agent Traps & Pitfalls:** Raising ValueError or FastAPIError instead of AssertionError (inconsistent with include_router's existing assert guards and tests expecting AssertionError), or failing to check identity via 'self is not router'.

##### `rich_3772` (#104, `Textualize/rich`, Bug Fix, 1 file(s), `+29/-16`, Complexity: Medium)

- **Target Files & Symbols:** `rich/traceback.py` — `rich/traceback.py:Traceback.extract`
- **Symptom / Exception:** Calling `Traceback.extract()` on a self-referential exception (`e.__cause__ = e`) or cyclic/repeated exceptions inside an `ExceptionGroup`/`BaseExceptionGroup` hangs in an infinite loop or crashes with `RecursionError`.
- **Root Cause:** In `rich/traceback.py:Traceback.extract`, the `while True` exception-chain loop checked `if cause:` without verifying `cause is not exc_value`, looping forever on self-referential `__cause__` links (and relying on truthiness rather than `is not None`). In addition, recursive `Traceback.extract()` calls for `ExceptionGroup`/`BaseExceptionGroup` sub-exceptions tracked no visited set and still executed `__cause__`/`__context__` chaining, allowing cyclic exception graphs to recurse infinitely.
- **Reference Fix Mechanism:** Added an internal `_visited_exceptions: Optional[Set[BaseException]] = None` parameter to `Traceback.extract()` threaded into recursive `ExceptionGroup`/`BaseExceptionGroup` calls, skipping any sub-exception already in `grouped_exceptions`, guarding the `__cause__`/`__context__` traversal block with `if not grouped_exceptions:`, and checking `cause is not None and cause is not exc_value` (and `cause is not None` for `__context__`).
- **Agent Traps & Pitfalls:** Fixing only `cause is not exc_value` misses `ExceptionGroup` recursion cycles (and vice versa); using a mutable default `set()` for `_visited_exceptions` leaks state across unrelated calls; using `if cause:` instead of `if cause is not None:` mishandles custom exception subclasses whose `__bool__` returns `False`.

##### `rich_3480` (#112, `Textualize/rich`, Bug Fix, 1 file(s), `+2/-2`, Complexity: Low)

- **Target Files & Symbols:** `rich/text.py` — `rich/text.py:Text.append`, `rich/text.py:Text.append_text`
- **Symptom / Exception:** Calling a.append(a) or b.append_text(b) on a styled Text instance enters an infinite loop and exhausts memory (MemoryError).
- **Root Cause:** In rich/text.py, both Text.append (when given a Text instance) and Text.append_text called self._spans.extend(_Span(start + text_length, end + text_length, style) for start, end, style in text._spans). When text is self, self._spans and text._spans alias the same list, so extend() continually appends newly shifted spans to the list being iterated by the generator expression, never reaching the end.
- **Reference Fix Mechanism:** Iterated over a shallow copy text._spans.copy() inside the generator expressions passed to self._spans.extend(...) in both Text.append and Text.append_text in rich/text.py.
- **Agent Traps & Pitfalls:** The problem statement only mentions 'append', not 'append_text'. Agents that patch only Text.append will fail test_append_loop_regression, which explicitly tests both a.append(a) and b.append_text(b).

#### 4.3.4 `BUG_LOGIC.STATE_AND_LIFECYCLE` (9 Tasks)

*Shared mutable state aliasing, stale cached hashes, `super().__init__` overwrites, asymmetric `start`/`stop`, buffer/capture ordering, and dependency scope/caching drift.*

##### `requests_7328` (#16, `psf/requests`, Bug Fix, 1 file(s), `+1/-2`, Complexity: Low)

- **Target Files & Symbols:** `src/requests/sessions.py` — `src/requests/sessions.py`, `SessionRedirectMixin.resolve_redirects`
- **Symptom / Exception:** Intermediate redirect Response objects contained themselves in their own resp.history (creating reference cycles delaying GC) and omitted the first redirect response instead of matching r.history[:i].
- **Root Cause:** In src/requests/sessions.py:SessionRedirectMixin.resolve_redirects, the loop executed hist.append(resp) before setting resp.history = hist[1:]. Appending resp first placed each redirect response after the first into its own resp.history (a self-reference), while slicing from index 1 dropped the initial redirect from intermediate histories.
- **Reference Fix Mechanism:** Reordered the statements in resolve_redirects to assign resp.history = hist[:] (a shallow copy of prior responses only) before calling hist.append(resp).
- **Agent Traps & Pitfalls:** Assigning resp.history = hist without copying via hist[:] (so the immediately following hist.append(resp) mutates resp.history in place and reintroduces the self-reference), or keeping the [1:] slice after reordering.

##### `fastapi_14873` (#27, `fastapi/fastapi`, Bug Fix, 1 file(s), `+11/-10`, Complexity: Low)

- **Target Files & Symbols:** `fastapi/routing.py` — `fastapi/routing.py:APIRouter.__init__`, `APIRouter.on_startup`, `APIRouter.on_shutdown`
- **Symptom / Exception:** Startup and shutdown event handlers passed via FastAPI(on_startup=[...]) or APIRouter(on_startup=[...], on_shutdown=[...]) silently never execute during application startup/shutdown.
- **Root Cause:** In fastapi/routing.py:APIRouter.__init__, self.on_startup and self.on_shutdown were assigned from the constructor parameters before calling super().__init__(...). Because Starlette's Router.__init__ initializes self.on_startup = [] and self.on_shutdown = [] when those parameters are omitted (not forwarded by APIRouter since Starlette removed/deprecated them), super().__init__ silently overwrote both lists back to empty lists.
- **Reference Fix Mechanism:** Moved the self.on_startup and self.on_shutdown assignments in APIRouter.__init__ to execute after super().__init__(...) and the prefix assertions. Because the default lifespan closure reads self.on_startup/self.on_shutdown lazily at runtime rather than during __init__, the handlers are preserved and invoked properly.
- **Agent Traps & Pitfalls:** Forwarding on_startup/on_shutdown into super().__init__ instead of moving the assignments after super().__init__ breaks on Starlette versions that removed those parameters (per Starlette PR #3117); also ensure the default lifespan block created earlier still resolves self.on_startup/self.on_shutdown dynamically.

##### `fastapi_5624` (#57, `fastapi/fastapi`, Bug Fix, 1 file(s), `+3/-1`, Complexity: Low)

- **Target Files & Symbols:** `fastapi/dependencies/utils.py` — `fastapi/dependencies/utils.py`, `get_dependant`
- **Symptom / Exception:** OAuth2 security scopes declared on one `Security(..., scopes=[...])` sub-dependency leak sideways into sibling dependencies and back into the parent `Dependant`'s `security_scopes`.
- **Root Cause:** Inside the signature parameter loop of `get_dependant` (`fastapi/dependencies/utils.py`), `use_security_scopes = security_scopes or []` aliased the parent's `security_scopes` list whenever it was non-empty. Calling `use_security_scopes.extend(param_details.depends.scopes)` mutated that shared list in place, contaminating both the parent `Dependant` and all subsequent sibling sub-dependencies.
- **Reference Fix Mechanism:** Replaced in-place `use_security_scopes.extend(param_details.depends.scopes)` with non-mutating list concatenation `use_security_scopes = use_security_scopes + list(param_details.depends.scopes)`, giving each child `sub_dependant` its own list copy.
- **Agent Traps & Pitfalls:** The problem statement is minimal ('Fix hierarchical security scope propagation, see defect #5623'); agents can easily misread this as needing to stop downward parent-to-child scope inheritance rather than spotting the shared-list in-place `.extend()` mutation causing sibling/parent leakage.

##### `fastapi_14419` (#58, `fastapi/fastapi`, Refactor + Bug Fix, 2 file(s), `+42/-20`, Complexity: High)

- **Target Files & Symbols:** `fastapi/dependencies/models.py`, `fastapi/dependencies/utils.py` — `fastapi/dependencies/models.py`, `Dependant`, `Dependant.cache_key`, `Dependant.oauth_scopes`, `Dependant._uses_scopes`, `fastapi/dependencies/utils.py`
- **Symptom / Exception:** Dependencies that do not declare or inspect OAuth scopes (e.g., `get_db_session`) are executed multiple times per request whenever they are reached via multiple `Security(..., scopes=[...])` branches with different scopes.
- **Root Cause:** `Dependant` in `fastapi/dependencies/models.py` tracked only a single merged `security_scopes` list and unconditionally included `tuple(sorted(set(self.security_scopes or [])))` in `Dependant.cache_key`. Because inherited ancestor scopes were always baked into the cache key and indistinguishable from a dependency's own declared scopes, scope-agnostic leaf dependencies received distinct cache keys under different security branches and bypassed per-request caching.
- **Reference Fix Mechanism:** Refactored `Dependant` to separate `own_oauth_scopes` and `parent_oauth_scopes` with an order-preserving `oauth_scopes` `@cached_property`, added a recursive `_uses_scopes` `@cached_property` (True iff `own_oauth_scopes`, `security_scopes_param_name is not None`, or any `sub_dep._uses_scopes`), and included scopes in `cache_key` only when `self._uses_scopes` is True (else `()`). Threaded `own_oauth_scopes`/`parent_oauth_scopes` through `get_parameterless_sub_dependant`, `get_dependant`, and `solve_dependencies`.
- **Agent Traps & Pitfalls:** Checking only `security_scopes_param_name` without recursively checking `sub_dep._uses_scopes` incorrectly collapses cache keys for intermediate dependencies whose sub-dependencies consume `SecurityScopes` (e.g., `get_user_me` depending on `get_current_user`); also forgetting to update `solve_dependencies` for overridden dependencies (`parent_oauth_scopes=sub_dependant.oauth_scopes`) and `SecurityScopes(scopes=dependant.oauth_scopes)` breaks runtime scope injection.

##### `fastapi_14301` (#59, `fastapi/fastapi`, Bug Fix, 1 file(s), `+4/-1`, Complexity: Low)

- **Target Files & Symbols:** `fastapi/dependencies/utils.py` — `fastapi/dependencies/utils.py`, `get_parameterless_sub_dependant`, `get_dependant`
- **Symptom / Exception:** Parameterless `yield` dependencies registered at app, router, or route level with `Depends(func, scope='function')` behave as `scope='request'`, running cleanup after the response is sent (so post-yield `HTTPException` fails to return 503).
- **Root Cause:** `get_parameterless_sub_dependant` in `fastapi/dependencies/utils.py` invoked `get_dependant(path=path, call=depends.dependency, security_scopes=use_security_scopes)` without passing `scope=depends.scope`. Consequently, `Dependant.scope` remained `None` and defaulted to `"request"` for generator dependencies.
- **Reference Fix Mechanism:** Forwarded `scope=depends.scope` to `get_dependant(...)` inside `get_parameterless_sub_dependant`.
- **Agent Traps & Pitfalls:** Inspecting `APIRoute`, `APIRouter`, or `FastAPI` route registration instead of `get_parameterless_sub_dependant` in `fastapi/dependencies/utils.py`, or missing that app-, router-, and route-level `dependencies=[...]` all pass through this single helper.

##### `rich_3905` (#76, `Textualize/rich`, Bug Fix, 1 file(s), `+4/-3`, Complexity: Low)

- **Target Files & Symbols:** `rich/progress.py` — `rich/progress.py`, `Progress.stop`, `Progress.start`, `Progress.disable`
- **Symptom / Exception:** Exiting or stopping a `Progress(disable=True)` instance on a non-interactive, non-Jupyter console prints an extraneous blank line.
- **Root Cause:** While `Progress.start` in `rich/progress.py` guards starting with `if not self.disable:`, `Progress.stop` lacked the symmetric `if not self.disable:` guard. As a result, `stop()` unconditionally called `self.live.stop()` and `self.console.print()` on non-interactive consoles even when progress output was disabled.
- **Reference Fix Mechanism:** Wrapped both `self.live.stop()` and the `if not self.console.is_interactive and not self.console.is_jupyter: self.console.print()` block inside `if not self.disable:` in `Progress.stop`.
- **Agent Traps & Pitfalls:** Using the attribute name `self.disabled` (as miswritten in the PR description) instead of the actual `self.disable`, or guarding only `self.console.print()` while still invoking `self.live.stop()` asymmetrically.

##### `rich_3518` (#108, `Textualize/rich`, Bug Fix, 1 file(s), `+1/-1`, Complexity: Low)

- **Target Files & Symbols:** `rich/table.py` — `rich/table.py:Table.add_row`, `rich/table.py:Column`
- **Symptom / Exception:** Cell values in columns lazily created by Table.add_row() are rendered without highlighting even when Table(highlight=True) is configured, and column.highlight remains False.
- **Root Cause:** In rich/table.py, Table.add_row dynamically appends missing columns using Column(_index=index) without forwarding self.highlight. Because Column.highlight defaults to False, auto-created columns failed to inherit the parent Table's highlight setting, unlike columns created via Table.add_column().
- **Reference Fix Mechanism:** Updated Table.add_row in rich/table.py to instantiate implicit columns with Column(_index=index, highlight=self.highlight).
- **Agent Traps & Pitfalls:** Changing the default of Column.highlight from False to True globally would break tables with highlight=False and standalone Column instances. Agents should inspect both add_column and add_row to ensure consistent property propagation without altering dataclass defaults.

##### `rich_3470` (#116, `Textualize/rich`, Bug Fix, 1 file(s), `+1/-1`, Complexity: Medium)

- **Target Files & Symbols:** `rich/console.py` — `rich/console.py:Console._write_buffer`, `rich/console.py:Console.capture`, `rich/console.py:Console._buffer_index`, `rich/console.py:Console._record_buffer`
- **Symptom / Exception:** When using console.capture() on a Console(record=True), captured prints leak into _record_buffer and are duplicated quadratically on every print inside the capture block, corrupting console.export_text().
- **Root Cause:** In rich/console.py, Console._write_buffer checked 'if self.record:' and extended self._record_buffer with self._buffer[:] BEFORE checking self._buffer_index (which defers flushing and clearing self._buffer while inside capture()). Consequently, each print inside capture() re-appended the entire uncleared self._buffer into self._record_buffer and recorded output that was captured rather than flushed to the console.
- **Reference Fix Mechanism:** Changed the recording guard in rich/console.py:Console._write_buffer from 'if self.record:' to 'if self.record and not self._buffer_index:', ensuring segments are appended to self._record_buffer only when the buffer is actually flushed at buffer depth 0.
- **Agent Traps & Pitfalls:** The problem statement is just 'Fix record and capture / Fix #2563', and the pre-existing test suite contained an older test_capture_and_record (with only a single print inside capture()) asserting recorded_text == 'ABC\nHello\n'. An agent trying to keep that legacy test passing instead of preventing recording during capture will fail the updated regression test expecting recorded_content == 'Print 0\n'.

##### `rich_2943` (#120, `Textualize/rich`, Bug Fix, 1 file(s), `+1/-1`, Complexity: Low)

- **Target Files & Symbols:** `rich/style.py` — `rich/style.py:Style.clear_meta_and_links`, `rich/style.py:Style.__hash__`
- **Symptom / Exception:** Calling clear_meta_and_links() on a Style whose hash has already been cached preserves the stale pre-cleared _hash, violating hash/equality invariants in dicts, sets, and LRU caches.
- **Root Cause:** In rich/style.py, Style.clear_meta_and_links constructs a new Style copy with _link = None, _link_id = '', and _meta = None, but explicitly copied style._hash = self._hash from the original instance. Because Style.__hash__ relies on self._hash when non-None, removing meta and links left the returned Style with a hash computed from the removed link/meta fields.
- **Reference Fix Mechanism:** Changed style._hash = self._hash to style._hash = None in rich/style.py:Style.clear_meta_and_links so the hash cache is invalidated and lazily recomputed on next hash() call.
- **Agent Traps & Pitfalls:** Eagerly recomputing hash(style) inside clear_meta_and_links instead of resetting style._hash = None violates Rich's lazy hashing design and directly fails test_clear_meta_and_links_clears_hash (assert clear_style._hash is None).

### 4.4 `BUG_COMPAT_EXCEPTION` — Cross-Version Compatibility & Exception Propagation Defects (8 Bug/Error Tasks)

Defects arising from Python 3.10–3.14 interpreter shifts, upstream dependency API drift (Starlette, Pydantic v1/v2, urllib3), and unhandled OS/runtime exception propagation.

#### 4.4.1 `BUG_COMPAT_EXCEPTION.DEPENDENCY_COMPAT` (4 Tasks)

*Starlette `on_startup`/`HTTP_422` changes, Pydantic v1/v2 Python 3.14 import warnings, and `urllib3` 1.x vs 2.x `latin-1`/UTF-8 body length parity.*

##### `fastapi_14851` (#26, `fastapi/fastapi`, Refactor + Bug Fix, 1 file(s), `+153/-4`, Complexity: High)

- **Target Files & Symbols:** `fastapi/routing.py` — `fastapi/routing.py`, `_AsyncLiftContextManager`, `_wrap_gen_lifespan_context`, `_DefaultLifespan`, `_merge_lifespan_context`, `APIRouter._startup`
- **Symptom / Exception:** Newer Starlette versions removing on_startup/on_shutdown and _DefaultLifespan (Kludex/starlette#3117) broke FastAPI's on_event, on_startup/on_shutdown handlers, and generator-based lifespan support.
- **Root Cause:** FastAPI's APIRouter previously relied on Starlette's Router for on_startup/on_shutdown execution, add_event_handler, and private starlette.routing lifespan wrappers. When Starlette removed _DefaultLifespan and startup/shutdown event handler support, FastAPI's backwards-compatible on_event interface and generator lifespan wrappers lost their backing implementation.
- **Reference Fix Mechanism:** Vendored _AsyncLiftContextManager and _wrap_gen_lifespan_context and copied _DefaultLifespan into fastapi/routing.py, and implemented APIRouter._startup(), APIRouter._shutdown() (handling both sync and async handlers via is_async_callable), and APIRouter.add_event_handler() directly inside FastAPI.
- **Agent Traps & Pitfalls:** Importing private symbols (_DefaultLifespan, _wrap_gen_lifespan_context) from starlette.routing (which fails on newer Starlette), failing to support both sync and async callables in _startup/_shutdown via is_async_callable, or breaking sync-generator and async-generator lifespan context wrapping.

##### `fastapi_14186` (#63, `fastapi/fastapi`, Refactor + Bug Fix, 10 file(s), `+266/-98`, Complexity: High)

- **Target Files & Symbols:** `fastapi/_compat/__init__.py`, `fastapi/_compat/main.py`, `fastapi/_compat/may_v1.py`, `fastapi/_compat/shared.py`, `fastapi/_compat/v1.py` *(+5 more)* — `fastapi/_compat/may_v1.py`, `fastapi/_compat/main.py`, `fastapi/_compat/__init__.py`, `fastapi/_compat/v1.py`, `fastapi/_compat/v2.py`, `fastapi/utils.py`
- **Symptom / Exception:** Importing FastAPI on Python 3.14 with Pydantic >=2.12.1 emits a Pydantic v1 incompatibility `UserWarning` (breaking tests under warnings-as-errors) even for pure Pydantic v2 applications.
- **Root Cause:** To support mixed Pydantic v1/v2 migrations (#14168), `fastapi/_compat/__init__.py`, `fastapi/_compat/main.py`, `fastapi/utils.py`, `fastapi/encoders.py`, and other modules eagerly imported `fastapi._compat.v1` (which imports `pydantic.v1`) at module import time for `isinstance`/`issubclass` checks and re-exports. Starting in Pydantic 2.12.1 on Python 3.14, importing `pydantic.v1` triggers a compatibility warning because Pydantic v1 does not support Python 3.14.
- **Reference Fix Mechanism:** Introduced `fastapi/_compat/may_v1.py` providing dummy/placeholder classes on Python 3.14+ / Pydantic >=2.12 (and real v1 symbols otherwise), re-exported `CoreSchema`, `GetJsonSchemaHandler`, `JsonSchemaValue`, and `_normalize_errors` from `may_v1` in `fastapi/_compat/__init__.py`, and replaced eager `from fastapi._compat import v1` imports across 10 files with `may_v1` type checks plus lazy local `from fastapi._compat import v1` imports only inside v1 execution paths.
- **Agent Traps & Pitfalls:** Swallowing warnings via `warnings.catch_warnings()` masks legitimate warnings for users who actually use `pydantic.v1`; missing even one eager `v1` import in any of the 10 touched modules (e.g., `encoders.py`, `temp_pydantic_v1_params.py`, or `_compat/__init__.py`) still triggers the warning on FastAPI import.

##### `fastapi_14077` (#66, `fastapi/fastapi`, Bug Fix, 3 file(s), `+5/-6`, Complexity: Low)

- **Target Files & Symbols:** `docs_src/handling_errors/tutorial005.py`, `fastapi/exception_handlers.py`, `fastapi/openapi/utils.py` — `fastapi/exception_handlers.py`, `request_validation_exception_handler`, `fastapi/openapi/utils.py`, `get_openapi_path`, `docs_src/handling_errors/tutorial005.py`
- **Symptom / Exception:** Importing `starlette.status.HTTP_422_UNPROCESSABLE_ENTITY` emits `DeprecationWarning` under Starlette >=0.48.0 (while switching to `HTTP_422_UNPROCESSABLE_CONTENT` breaks Starlette <0.48.0 with `ImportError`).
- **Root Cause:** Starlette 0.48.0 deprecated `HTTP_422_UNPROCESSABLE_ENTITY` in favor of RFC 9110's `HTTP_422_UNPROCESSABLE_CONTENT`. `fastapi/exception_handlers.py`, `fastapi/openapi/utils.py`, and `docs_src/handling_errors/tutorial005.py` directly imported and used `HTTP_422_UNPROCESSABLE_ENTITY`.
- **Reference Fix Mechanism:** Removed `HTTP_422_UNPROCESSABLE_ENTITY` imports and replaced them with the raw literal `422` in `request_validation_exception_handler` and `tutorial005.py`, and `"422"` in `get_openapi_path`, preserving warning-free compatibility across Starlette <0.48 and >=0.48.
- **Agent Traps & Pitfalls:** Naively renaming the constant to `HTTP_422_UNPROCESSABLE_CONTENT` breaks compatibility (`ImportError`) with Starlette 0.40–0.47; also easy to miss `fastapi/openapi/utils.py` (`str(HTTP_422_UNPROCESSABLE_ENTITY)`) or `docs_src/handling_errors/tutorial005.py`.

##### `requests_6757` (#94, `psf/requests`, Bug Fix, 2 file(s), `+16/-1`, Complexity: Low)

- **Target Files & Symbols:** `src/requests/compat.py`, `src/requests/utils.py` — `src/requests/compat.py:is_urllib3_1`, `src/requests/utils.py:super_len`
- **Symptom / Exception:** On `urllib3` 1.26.x, `super_len` computes the wrong `Content-Length` header for non-ASCII `latin-1` `str` request bodies (counting multi-byte UTF-8 length instead of 1-byte-per-char `latin-1` length), breaking `Content-Length` tests and wire framing on urllib3 1.x.
- **Root Cause:** PR #6589 unconditionally UTF-8 encoded `str` inputs in `src/requests/utils.py:super_len` to match `urllib3` 2.x's UTF-8 string encoding behavior. However, `urllib3` 1.26.x delegates to `http.client` which encodes `str` payloads as `latin-1` (`iso-8859-1`, 1 byte per character), so UTF-8 encoding in `super_len` over-reported `Content-Length` whenever `urllib3` 1.x was installed.
- **Reference Fix Mechanism:** Added `is_urllib3_1` major-version detection in `src/requests/compat.py` (parsing `urllib3.__version__.split('.')[0] == '1'` with fallback `True` on `TypeError`/`AttributeError`) and guarded the UTF-8 encoding in `src/requests/utils.py:super_len` with `if not is_urllib3_1 and isinstance(o, str):`.
- **Agent Traps & Pitfalls:** Deceptive PR title/description: the problem statement says 'Test on urllib3 1.26.x' and 'These will fail for now until the underlying issue is addressed', which can mislead an agent into thinking no library code fix is required, whereas the merged patch adds `is_urllib3_1` in `compat.py` and updates `super_len` in `utils.py`.

#### 4.4.2 `BUG_COMPAT_EXCEPTION.EXCEPTION_PROPAGATION` (1 Tasks)

*Unhandled `BrokenPipeError` + `sys.stdout` shutdown flush errors when piping console output.*

##### `rich_3468` (#102, `Textualize/rich`, Bug Fix, 1 file(s), `+36/-6`, Complexity: Low)

- **Target Files & Symbols:** `rich/console.py` — `rich/console.py:Console.on_broken_pipe`, `rich/console.py:Console._check_buffer`, `rich/console.py:Console._write_buffer`
- **Symptom / Exception:** Piping Rich console output to a command that closes stdin early (e.g., `| head` on Linux/macOS) crashes with an unhandled `BrokenPipeError` traceback and secondary shutdown flush errors on `sys.stdout`.
- **Root Cause:** `Console._check_buffer()` in `rich/console.py` wrote buffered segments directly to the output stream without catching `BrokenPipeError`. When the downstream pipe closed, `BrokenPipeError` propagated uncaught and Python's interpreter shutdown subsequently failed again while flushing the still-broken `sys.stdout` file descriptor.
- **Reference Fix Mechanism:** Extracted buffer writing into `Console._write_buffer()`, wrapped its call in `Console._check_buffer()` with `try ... except BrokenPipeError: self.on_broken_pipe()`, and added `Console.on_broken_pipe()` which sets `self.quiet = True`, redirects `sys.stdout.fileno()` to `os.devnull` via `os.dup2` (per Python's SIGPIPE documentation), and raises `SystemExit(1)`.
- **Agent Traps & Pitfalls:** Catching `BrokenPipeError` and raising `SystemExit(1)` without redirecting `sys.stdout.fileno()` to `os.devnull` still prints Python's `Exception ignored in <_io.TextIOWrapper>` error during process exit; omitting `self.quiet = True` allows further writes during unwinding; exiting with code `0` instead of `1` fails `test_brokenpipeerror`.

#### 4.4.3 `BUG_COMPAT_EXCEPTION.PYTHON_VERSION_COMPAT` (3 Tasks)

*Python 3.10+ `eval_str=True`, PEP 604 `types.UnionType`, and Python 3.11+ `netrc` empty tuple handling.*

##### `requests_7205` (#18, `psf/requests`, Bug Fix, 1 file(s), `+1/-1`, Complexity: Low)

- **Target Files & Symbols:** `src/requests/utils.py` — `src/requests/utils.py`, `get_netrc_auth`, `netrc.authenticators`
- **Symptom / Exception:** On Python 3.11+, an empty default entry in .netrc caused get_netrc_auth() to return ('', '') instead of None, causing Requests to send an empty Basic Authorization header (':').
- **Root Cause:** Prior to Python 3.11, stdlib netrc rejected credential-less entries with NetrcParseError, whereas Python 3.11+ changed netrc.authenticators(host) to return the 3-tuple ('', '', ''). Because a 3-tuple of empty strings is truthy, 'if _netrc:' in src/requests/utils.py:get_netrc_auth evaluated to True and returned empty credentials.
- **Reference Fix Mechanism:** Tightened the guard in src/requests/utils.py:get_netrc_auth from 'if _netrc:' to 'if _netrc and any(_netrc):', ignoring all-empty authenticator tuples so None is returned.
- **Agent Traps & Pitfalls:** Using 'all(_netrc)' instead of 'any(_netrc)' (which rejects valid netrc entries whose account field _netrc[1] or password _netrc[2] is None/empty), or checking only _netrc[0] (which breaks entries specifying account at _netrc[1] with an empty login).

##### `fastapi_11355` (#41, `fastapi/fastapi`, Bug Fix, 1 file(s), `+9/-2`, Complexity: Low)

- **Target Files & Symbols:** `fastapi/dependencies/utils.py` — `fastapi/dependencies/utils.py:get_typed_signature`, `fastapi/dependencies/utils.py:get_typed_return_annotation`
- **Symptom / Exception:** Stringified type annotations under `from __future__ import annotations` on Python 3.10+ (e.g., PEP 604 unions or Annotated expressions) fail to evaluate properly during endpoint/dependency signature inspection.
- **Root Cause:** In fastapi/dependencies/utils.py, both `get_typed_signature` and `get_typed_return_annotation` called `inspect.signature(call)` without `eval_str=True`, leaving PEP 563 stringified annotations unevaluated for Pydantic's fallback forward-ref evaluator rather than using Python 3.10+'s native signature string evaluation.
- **Reference Fix Mechanism:** Imported `sys` and updated both `get_typed_signature` and `get_typed_return_annotation` to call `inspect.signature(call, eval_str=True)` when `sys.version_info >= (3, 10)` and fall back to `inspect.signature(call)` on earlier Python versions.
- **Agent Traps & Pitfalls:** Passing `eval_str=True` unconditionally without the `sys.version_info >= (3, 10)` guard raises `TypeError` on Python < 3.10; updating only `get_typed_signature` while skipping `get_typed_return_annotation` leaves return annotations broken.

##### `fastapi_14430` (#50, `fastapi/fastapi`, Bug Fix, 1 file(s), `+2/-2`, Complexity: Low)

- **Target Files & Symbols:** `fastapi/_compat/v2.py` — `fastapi/_compat/v2.py:serialize_sequence_value`, `fastapi/types.py:UnionType`
- **Symptom / Exception:** Optional sequence fields declared with Python 3.10+ PEP 604 pipe syntax (e.g., `list[str] | None`) fail sequence serialization in Pydantic v2 compatibility layer instead of unwrapping the union to the inner sequence type.
- **Root Cause:** In fastapi/_compat/v2.py:serialize_sequence_value, the optional-sequence unwrapping branch checked only `if origin_type is Union:` (`typing.Union`). For PEP 604 pipe unions (`list[str] | None`), `get_origin(annotation)` returns `types.UnionType`, causing the union-unwrapping branch to be skipped.
- **Reference Fix Mechanism:** Imported FastAPI's compatibility `UnionType` from `fastapi.types` into fastapi/_compat/v2.py and updated the condition in `serialize_sequence_value` to `if origin_type is Union or origin_type is UnionType:`.
- **Agent Traps & Pitfalls:** Importing `UnionType` directly from stdlib `types` crashes on Python < 3.10 where `types.UnionType` does not exist; agents must import `UnionType` from `fastapi.types`.

### 4.5 `FEAT_API` — New Features, Public APIs & Formatting Enhancements (4 Bug/Error Tasks)

New user-facing subsystems, endpoints, configuration parameters/env vars, and error/rendering format enhancements (including 4 hybrid tasks that also fix underlying defects).

#### 4.5.1 `FEAT_API.CONFIG_AND_PARAMETER_EXT` (2 Tasks)

*New options/env vars/aliases: `strict_content_type`, `TTY_COMPATIBLE`, `TTY_INTERACTIVE`, `case_sensitive`, `openapi_external_docs`, and HTTP 425 `too_early`.*

##### `fastapi_14978` (#10, `fastapi/fastapi`, Feature + Bug Fix, 3 file(s), `+81/-1`, Complexity: Medium)

- **Target Files & Symbols:** `docs_src/strict_content_type/tutorial001_py310.py`, `fastapi/applications.py`, `fastapi/routing.py` — `fastapi/applications.py`, `FastAPI.__init__`, `fastapi/routing.py`, `get_request_handler`, `APIRoute.__init__`, `APIRoute.get_route_handler`
- **Symptom / Exception:** POST/body requests omitting the Content-Type header were silently parsed as JSON (HTTP 200) instead of failing validation (HTTP 422), exposing applications to CSRF attacks that bypass browser CORS preflight checks.
- **Root Cause:** In fastapi/routing.py:get_request_handler, request body parsing unconditionally ran 'if not content_type_value: json_body = await request.json()'. Because browsers can issue cross-origin requests without a Content-Type header without triggering CORS preflight, unconditionally parsing headerless bodies as JSON created a CSRF vector with no built-in way to enforce strict Content-Type checks.
- **Reference Fix Mechanism:** Added a strict_content_type: bool | DefaultPlaceholder = Default(True) parameter across FastAPI, APIRouter, APIRoute, add_api_route, include_router (resolved hierarchically via get_value_or_default), and get_request_handler, and guarded the headerless fallback in get_request_handler with 'if not actual_strict_content_type:' so missing Content-Type headers leave json_body as Undefined (HTTP 422) by default.
- **Agent Traps & Pitfalls:** Using plain bool defaults instead of Default(True)/DefaultPlaceholder on APIRouter/APIRoute/include_router, which breaks hierarchical inheritance in get_value_or_default(route.strict_content_type, router.strict_content_type, self.strict_content_type) when nested routers override app settings; or rejecting valid non-JSON Content-Type headers rather than only gating the empty content_type_value branch.

##### `rich_3675` (#106, `Textualize/rich`, Feature + Bug Fix, 2 file(s), `+28/-13`, Complexity: Medium)

- **Target Files & Symbols:** `rich/console.py`, `rich/diagnose.py` — `rich/console.py:Console.is_terminal`, `rich/console.py:Console.__init__`, `rich/diagnose.py:report`
- **Symptom / Exception:** Rich lacked TTY_COMPATIBLE env-var override support, while empty NO_COLOR='' or FORCE_COLOR='' env vars erroneously disabled color or forced terminal mode and mutated self._force_terminal.
- **Root Cause:** Console.is_terminal did not inspect TTY_COMPATIBLE, treated any non-None FORCE_COLOR (including empty string '') as True while side-effecting self._force_terminal = True, and Console.__init__ checked '"NO_COLOR" in self._environ' rather than checking for a non-empty value per no-color.org. Additionally, rich/diagnose.py:report did not include TTY_COMPATIBLE in its diagnostic env_names list.
- **Reference Fix Mechanism:** In Console.is_terminal (rich/console.py), added TTY_COMPATIBLE handling ('0' returns False, '1' returns True, any other/empty value falls through to FORCE_COLOR and file.isatty()), updated FORCE_COLOR to return force_color != '' without mutating self._force_terminal, updated Console.__init__ to set self.no_color using self._environ.get('NO_COLOR', '') != '', and added 'TTY_COMPATIBLE' to env_names in rich/diagnose.py:report.
- **Agent Traps & Pitfalls:** The prompt gives only the env var name and a GitHub issue link without stating exact values ('0'/'1'/other-falls-through), precedence relative to force_terminal/IDLE/Jupyter/FORCE_COLOR, or the accompanying empty-string spec fixes for NO_COLOR and FORCE_COLOR. Calling file.isatty() eagerly before checking TTY_COMPATIBLE fails test_tty_compatible's called_isatty assertions.

#### 4.5.2 `FEAT_API.NEW_CAPABILITY_OR_ENDPOINT` (1 Tasks)

*Major new capabilities: SSE, `FastAPI.frontend()`, `RouteContext`/`iter_route_contexts`, dependency `scope`, PEP 695 `TypeAliasType`, `Depends` on `Response`/`Request`, and `@app.vibe()`.*

##### `fastapi_14794` (#29, `fastapi/fastapi`, Feature + Bug Fix, 1 file(s), `+3/-2`, Complexity: Low)

- **Target Files & Symbols:** `fastapi/dependencies/utils.py` — `fastapi/dependencies/utils.py:analyze_param`
- **Symptom / Exception:** AssertionError: Cannot specify `Depends` for type <class 'starlette.responses.Response'> when annotating a dependency parameter with Response (or Request/BackgroundTasks) alongside Depends(...).
- **Root Cause:** In fastapi/dependencies/utils.py:analyze_param, the branch handling special non-param Starlette/FastAPI types (Request, WebSocket, HTTPConnection, Response, BackgroundTasks, SecurityScopes) matched lenient_issubclass(type_annotation, (...)) unconditionally and immediately executed `assert depends is None`. This blocked valid dependencies that return a Response, Request, or BackgroundTasks instance via Depends(...).
- **Reference Fix Mechanism:** Guarded the special-type branch in analyze_param with `if depends is None and lenient_issubclass(type_annotation, (...)):` and removed the `assert depends is None` statement, allowing explicit Depends(...) callables to run normally while retaining special injection and the `assert field_info is None` guard when no Depends is specified.
- **Agent Traps & Pitfalls:** Special-casing only Response (based on the PR title) fails tests covering Request and BackgroundTasks with Depends (test_request_with_depends_annotated, test_background_tasks_with_depends_annotated); conversely, removing `assert field_info is None` would break invalid FastAPI Param annotations on special types.

#### 4.5.3 `FEAT_API.RENDER_AND_FORMAT_EXT` (1 Tasks)

*Formatting/output enhancements: `Exception.__notes__`, PEP 657 error ranges, `EndpointContext`, `serialize_json` fast path, grapheme cluster rewrite, Markdown theme redesign, and Query assertion messaging.*

##### `rich_3930` (#77, `Textualize/rich`, Feature + Bug Fix, 26 file(s), `+12170/-544`, Complexity: High)

- **Target Files & Symbols:** `rich/__main__.py`, `rich/_cell_widths.py`, `rich/_unicode_data/__init__.py`, `rich/_unicode_data/_versions.py`, `rich/_unicode_data/unicode10-0-0.py` *(+21 more)* — `rich/cells.py`, `split_graphemes`, `split_text`, `chop_cells`, `cell_len`, `get_character_cell_size`
- **Symptom / Exception:** Multi-codepoint emoji and Unicode grapheme clusters (such as ZWJ sequences like `👩\u200d🔧` and variation selectors) have wrong measured widths and get sliced mid-grapheme during wrapping/cropping (`chop_cells`, `Text.wrap`), corrupting terminal output (issue #3897).
- **Root Cause:** Rich previously calculated display widths codepoint-by-codepoint from a single static `rich/_cell_widths.py` table with no grapheme cluster segmentation, ZWJ/variation-selector (`\u200d`/`\ufe0f`) rules, or Unicode version support. Consequently, multi-codepoint glyphs summed individual codepoint widths and `chop_cells`/`set_cell_size` split strings inside grapheme sequences.
- **Reference Fix Mechanism:** Removed `rich/_cell_widths.py`, added lazy-loaded versioned Unicode data modules (`rich/_unicode_data/unicode4-1-0.py` through `unicode17-0-0.py` with `load()`/`_parse_version()`), implemented `split_graphemes()` and `split_text()` in `rich/cells.py`, and rewrote `cell_len`, `get_character_cell_size`, and `chop_cells` to measure and wrap along grapheme spans.
- **Agent Traps & Pitfalls:** Updating only `cell_len` without grapheme-aware `split_graphemes`/`chop_cells` still corrupts multi-codepoint emoji during line wrapping; eagerly importing all Unicode tables hurts startup latency; and subtle table/ZWJ edge cases (trailing `\u200d`, PUA codepoints `> table[-1][1]`, C0/C1 control chars) easily introduce regressions (as later fixed in `rich_3944` and `rich_3953`).

### 4.6 `MAINT_LIFECYCLE` — Deprecations, Removals, Internal Refactors & Tooling/Docs (1 Bug/Error Tasks)

Planned deprecations and legacy removals, architectural internal refactors (including 1 hybrid bug-fix refactor), release automation scripts, and documentation tutorial updates.

#### 4.6.1 `MAINT_LIFECYCLE.REFACTOR_AND_INTERNAL_API` (1 Tasks)

*Tree-based `include_router` refactor, lazy-import startup optimization, and frozen hashable `Depends`/`Security` dataclasses.*

##### `fastapi_14372` (#37, `fastapi/fastapi`, Refactor + Bug Fix, 2 file(s), `+4/-3`, Complexity: Low)

- **Target Files & Symbols:** `fastapi/dependencies/utils.py`, `fastapi/params.py` — `fastapi/params.py:Depends`, `fastapi/params.py:Security`, `fastapi/dependencies/utils.py:analyze_param`
- **Symptom / Exception:** TypeError: unhashable type: 'Depends' / 'Security' when third-party tools hash Depends() or Security() instances (e.g., in sets, dicts, or Annotated caches).
- **Root Cause:** In fastapi/params.py, Depends and Security were decorated with mutable `@dataclass`, which auto-generates `__eq__` and sets `__hash__ = None` in Python, making instances unhashable. Meanwhile, fastapi/dependencies/utils.py:analyze_param mutated `depends.dependency = type_annotation` in place on a shallow copy.
- **Reference Fix Mechanism:** Changed both Depends and Security in fastapi/params.py to `@dataclass(frozen=True)` so Python generates `__hash__` automatically, and updated fastapi/dependencies/utils.py:analyze_param to replace the in-place attribute assignment with `depends = dataclasses.replace(depends, dependency=type_annotation)`.
- **Agent Traps & Pitfalls:** Making Depends frozen without also freezing Security raises `TypeError: cannot inherit non-frozen dataclass from a frozen one`; making them frozen without changing `depends.dependency = type_annotation` in analyze_param raises `dataclasses.FrozenInstanceError` whenever `Depends()` is used with a class/callable type annotation.

---

## 5. Non-Bug Tasks Profile (26 Pure Feature, Deprecation, Refactor & Tooling/Docs Tasks)

For completeness across all 129 tasks, the remaining **26 tasks** do not repair a pre-existing bug or error; they introduce new public APIs/capabilities, emit deprecation warnings or drop legacy compatibility layers, perform internal refactoring, or update release tooling/tutorial examples. Note that **16 of these 26 tasks (61.5%) are multi-file**, and **6 require inferring brand-new unmentioned module/class names**.

| # | Instance ID | Repo | Sub-Category | Task Kind | Files (+add/-rem) | Implementation Summary | Primary Agent Trap |
| :---: | :--- | :--- | :--- | :--- | :---: | :--- | :--- |
| 1 | `fastapi_15661` | `fastapi` | `MAINT_LIFECYCLE.TOOLING_AND_DOCS` | Tooling/Docs | 1f (+216/-0) | Added scripts/prepare_release.py with regex-validated version and Markdown section helpers (parse_version, get_current_version, bump_version, update_version_file, update_release_notes, get_release_notes_body) exposed via Typer CLI commands with PREPARE_RELEASE_* environment variable bindings. | The PR description is sparse (only linking fastapi/asyncer#608), so guessing exact CLI command/option/envvar names, ValueError vs RuntimeError contracts, and exact Markdown header/H2-section invariants without tests is error-prone. |
| 4 | `fastapi_15030` | `fastapi` | `FEAT_API.NEW_CAPABILITY_OR_ENDPOINT` | Feature | 9f (+525/-35) | Added fastapi/sse.py implementing EventSourceResponse, ServerSentEvent, SSE wire formatting, and keepalive pings; integrated sync/async generator SSE streaming in fastapi/routing.py, OpenAPI schema support in fastapi/openapi/utils.py, re-exports in fastapi/responses.py, and five tutorial examples. | Covering all SSE edge cases across routing, validation, and OpenAPI: sync vs async generators, annotated vs unannotated handlers, mixed plain/ServerSentEvent yields, mutual exclusivity of data vs raw_data, null-id and negative/float retry validation, cache-control/x-accel-buffering headers, and monkeypatchable _PING_INTERVAL. |
| 5 | `fastapi_14962` | `fastapi` | `FEAT_API.RENDER_AND_FORMAT_EXT` | Feature | 3f (+49/-6) | Added ModelField.serialize_json() calling self._type_adapter.dump_json() in fastapi/_compat/v2.py and a dump_json flag in fastapi/routing.py:serialize_response; when response_field is set and response_class is a DefaultPlaceholder, get_request_handler wraps the serialized JSON bytes directly in Response(media_type='application/json'). | Triggering the dump_json fast path when a user explicitly sets response_class=JSONResponse (not wrapped in DefaultPlaceholder) or a custom Response subclass, or failing to preserve status_code, solved_result.response.headers, and empty-body status code handling. |
| 6 | `fastapi_15280` | `fastapi` | `FEAT_API.NEW_CAPABILITY_OR_ENDPOINT` | Feature | 2f (+71/-1) | Added FastAPI.vibe(self, path, *, prompt='') in fastapi/applications.py that unconditionally raises FastAPIError("Are you kidding me? Happy April Fool's"), along with docs_src/vibe/tutorial001_py310.py. | Taking the docstring literally and attempting to build an LLM-forwarding endpoint instead of raising FastAPIError with the exact April Fool's message string. |
| 7 | `fastapi_14964` | `fastapi` | `MAINT_LIFECYCLE.DEPRECATION_AND_REMOVAL` | Deprecation/Removal | 1f (+44/-8) | Decorated UJSONResponse and ORJSONResponse in fastapi/responses.py with typing_extensions.deprecated(..., category=FastAPIDeprecationWarning, stacklevel=2) and updated their docstrings. | Emitting standard DeprecationWarning instead of FastAPIDeprecationWarning, omitting stacklevel=2, or warning manually inside __init__ instead of using typing_extensions.deprecated. |
| 8 | `fastapi_15023` | `fastapi` | `MAINT_LIFECYCLE.TOOLING_AND_DOCS` | Tooling/Docs | 1f (+18/-8) | Wrapped read_image() iteration in 'with read_image() as image_file:' across existing endpoints in docs_src/stream_data/tutorial002_py310.py and added the /image/stream-no-async-yield-from endpoint using 'yield from image_file'. | The PR description does not name the new route path (/image/stream-no-async-yield-from) or function name, making exact reproduction difficult without inspecting companion tests/docs. |
| 19 | `rich_4070` | `rich` | `MAINT_LIFECYCLE.REFACTOR_AND_INTERNAL_API` | Refactor | 9f (+71/-57) | Deferred optional imports into the methods that require them across 9 modules, moved annotation-only imports under TYPE_CHECKING, replaced inspect.isclass with isinstance(x, type), changed _caller_frame_info's default currentframe to None with lazy inspect import, and removed dead imports/code. | Altering call-stack frame offsets in Console._caller_frame_info when replacing inspect.currentframe, causing runtime NameError on type annotations without 'from __future__ import annotations', or breaking tests that monkeypatch previously module-level imports (like getpass on rich.console). |
| 28 | `fastapi_13920` | `fastapi` | `FEAT_API.NEW_CAPABILITY_OR_ENDPOINT` | Feature | 1f (+4/-0) | Imported is_typealiastype from typing_inspection.typing_objects and added an early check in analyze_param that unpacks annotation = annotation.__value__ when is_typealiastype(annotation) is True, prior to setting use_annotation/type_annotation and extracting Annotated metadata. | The PR description mentions 'vendoring a copy of is_typealiastype', which can mislead agents into reimplementing it manually instead of importing from typing_inspection.typing_objects (already available via Pydantic); also unpacking must happen before the inspect.Signature.empty check and Annotated extraction. |
| 31 | `fastapi_14492` | `fastapi` | `MAINT_LIFECYCLE.TOOLING_AND_DOCS` | Tooling/Docs | 1f (+1/-1) | Updated the license_info "identifier" value in docs_src/metadata/tutorial001_1_py39.py from "MIT" to "Apache-2.0". | Agents must locate the exact tutorial source file under docs_src/metadata/ covered by tests/test_tutorial/test_metadata/test_tutorial001_1.py without accidentally editing unrelated metadata tutorial files. |
| 32 | `fastapi_14479` | `fastapi` | `FEAT_API.RENDER_AND_FORMAT_EXT` | Feature | 1f (+1/-1) | Added the message `f"Query parameter {param_name!r} must be one of the supported types"` to the Query-type assertion in analyze_param. | Critical wording mismatch trap: the PR description shows `Query param 'data' must be of one of the supported types`, whereas the actual patch and updated tests expect `Query parameter {param_name!r} must be one of the supported types` ('parameter' instead of 'param', and no 'of'). |
| 36 | `fastapi_14609` | `fastapi` | `MAINT_LIFECYCLE.DEPRECATION_AND_REMOVAL` | Deprecation/Removal | 20f (+192/-1855) | Deleted the Pydantic v1 compatibility modules and branches across 20 files, re-exported Pydantic v2 primitives directly from fastapi/_compat/v2.py, added PydanticV1NotSupportedError(FastAPIError) plus is_pydantic_v1_model_class/instance helpers, and raised PydanticV1NotSupportedError in create_model_field, APIRoute response model setup, and jsonable_encoder. | Merely deleting v1 files causes cryptic AttributeError or PydanticSchemaGenerationError instead of raising the newly required PydanticV1NotSupportedError across all entry points (route params, response_model, additional responses, jsonable_encoder), and broken re-exports in fastapi/_compat/__init__.py will break internal/external imports. |
| 40 | `fastapi_14487` | `fastapi` | `MAINT_LIFECYCLE.TOOLING_AND_DOCS` | Tooling/Docs | 1f (+5/-2) | Updated `validation_exception_handler` in docs_src/handling_errors/tutorial004.py to iterate over `exc.errors()` and build a sanitized plain-text message listing only `error['loc']` and `error['msg']`. | Tutorial tests in tests/test_tutorial/test_handling_errors/test_tutorial004.py assert the exact output strings (`"Validation errors:"` and `"Field: ('path', 'item_id')"`), so paraphrasing the message format will fail tests. |
| 44 | `fastapi_14306` | `fastapi` | `FEAT_API.RENDER_AND_FORMAT_EXT` | Feature | 2f (+121/-16) | Added `EndpointContext` TypedDict, `endpoint_ctx` keyword parameter, `_format_endpoint_context`, and unified `__str__` formatting to `ValidationException` and its subclasses in fastapi/exceptions.py. Added cached `_extract_endpoint_context` in fastapi/routing.py and threaded `endpoint_ctx` (including `root_path` mount prefixes and `WS ` prefixes) into RequestValidationError, ResponseValidationError (via serialize_response), and WebSocketRequestValidationError. | Must support mounted sub-apps (`root_path`), WebSocket routes (`WS ` prefix), and partial/empty `EndpointContext` (e.g., only `path` or `None`); must remove `ResponseValidationError.__str__` override so it inherits the unified formatter; and must not leak endpoint context into HTTP 422 JSON response bodies. |
| 60 | `fastapi_14262` | `fastapi` | `FEAT_API.NEW_CAPABILITY_OR_ENDPOINT` | Feature | 10f (+196/-70) | Added `scope: Union[Literal['function', 'request'], None]` to `Depends`, `Security`, and `Dependant`, extended `Dependant.cache_key` (`DependencyCacheKey`) and callable-inspection cached properties, validated scope hierarchy constraints in `get_dependant`, and managed distinct function- and request-level exit stacks across HTTP and WebSocket routing in `fastapi/routing.py` and `fastapi/dependencies/utils.py`. | Missing any of the coordinated surfaces: both HTTP (`APIRoute`) and WebSocket (`APIWebSocketRoute`) routes, both `Depends` and `Security` across `params.py` and `param_functions.py`, rejecting `request`-scoped dependencies that depend on `function`-scoped sub-dependencies, and including `computed_scope` in `Dependant.cache_key`. |
| 65 | `fastapi_13713` | `fastapi` | `FEAT_API.CONFIG_AND_PARAMETER_EXT` | Feature | 2f (+31/-0) | Added `openapi_external_docs: Annotated[Optional[Dict[str, Any]], Doc(...)] = None` to `FastAPI.__init__`, saved it on `self.openapi_external_docs`, passed `external_docs=self.openapi_external_docs` in `FastAPI.openapi()`, and set `output["externalDocs"] = external_docs` when truthy in `get_openapi` (`fastapi/openapi/utils.py`). | The PR description calls the constructor parameter `external_docs`, but the actual merged API follows FastAPI's `openapi_*` convention (`openapi_external_docs` on `FastAPI.__init__`, `external_docs` on `get_openapi`, and camelCase `"externalDocs"` in the OpenAPI dict). |
| 71 | `rich_3942` | `rich` | `FEAT_API.RENDER_AND_FORMAT_EXT` | Feature | 2f (+43/-27) | Updated Markdown theme entries in `rich/default_styles.py` (including new `markdown.table.border` and `markdown.table.header` styles), introduced `HeadingFormat` and `Heading.LEVEL_ALIGN` to render H1–H6 as styled justified `Text` without `Panel`, updated `HorizontalRule` to emit `Rule(style=style, characters="-")` plus `Text()`, and switched `TableElement` to `box.SIMPLE` with `pad_edge=False`, `collapse_padding=True`, and styled header cells. | Underspecified visual redesign: exact default colors, `LEVEL_ALIGN` justification, `Rule` characters, `Table` kwargs, and `.copy()` calls before mutating `Text` must match snapshot tests (`test_markdown.py`, `test_markdown_no_hyperlinks.py`) verbatim. |
| 80 | `fastapi_15800` | `fastapi` | `FEAT_API.NEW_CAPABILITY_OR_ENDPOINT` | Feature | 8f (+649/-5) | Added `FastAPI.frontend(path, *, directory, fallback='auto', check_dir=True)` in `fastapi/applications.py` and low-priority frontend route registration, matching, caching, `Accept`-header navigation fallback (`auto`, `index.html`, `404.html`, `None`), and error handling in `fastapi/routing.py` alongside six tutorial examples. | Very large patch (+649/-5) with an empty PR description; normal routes with `Match.PARTIAL` (e.g. 405) and API 404s must not be shadowed by frontend fallbacks, invalid `Accept` `q`-values must be ignored safely, and `_FASTAPI_EFFECTIVE_ROUTE_CONTEXT_KEY` must be restored on the ASGI scope after candidate matching. |
| 81 | `fastapi_15785` | `fastapi` | `FEAT_API.NEW_CAPABILITY_OR_ENDPOINT` | Feature | 2f (+66/-15) | Introduced frozen dataclass `RouteContext` and public generator `iter_route_contexts(routes)` in `fastapi/routing.py`, and updated `_get_api_route_for_openapi`, `get_fields_from_routes`, and `get_openapi` in `fastapi/openapi/utils.py` to accept `Sequence[BaseRoute \| routing.RouteContext]` and iterate through `routing.iter_route_contexts`. | `iter_route_contexts` must yield already-wrapped `RouteContext` objects unchanged (idempotent) so filtered route/webhook contexts work in `get_openapi`; `RouteContext` must expose `original_route`, `path`, `path_format`, `name`, `methods`, `endpoint`, and delegate remaining attributes via `__getattr__` to `_effective_route`. |
| 83 | `fastapi_14605` | `fastapi` | `MAINT_LIFECYCLE.DEPRECATION_AND_REMOVAL` | Deprecation/Removal | 7f (+28/-16) | Defined `class FastAPIDeprecationWarning(UserWarning)` in `fastapi/exceptions.py` and updated all deprecation `warnings.warn()` calls across `dependencies/utils.py`, `openapi/utils.py`, `params.py`, `routing.py`, `temp_pydantic_v1_params.py`, and `utils.py` to use `category=FastAPIDeprecationWarning`. | Inheriting `FastAPIDeprecationWarning` from `DeprecationWarning` instead of `UserWarning` defeats the motivation of making warnings visible by default; missing call sites in `fastapi/temp_pydantic_v1_params.py`, `fastapi/openapi/utils.py`, or `fastapi/utils.py` leaves stale `DeprecationWarning` categories. |
| 85 | `fastapi_14583` | `fastapi` | `MAINT_LIFECYCLE.DEPRECATION_AND_REMOVAL` | Deprecation/Removal | 2f (+24/-0) | Added `DeprecationWarning` emissions in `fastapi/dependencies/utils.py:get_dependant` (when `isinstance(param_details.field, may_v1.ModelField)`) and `fastapi/routing.py:APIRoute.__init__` (when `annotation_is_pydantic_v1` matches `self.response_model` or any model in `responses`). | Missing any of the three detection sites (endpoint parameters, `response_model`/return type, and `responses={}` additional models) fails the corresponding warning tests; emitting warnings at request time instead of route/dependant creation time hurts performance and fails setup-time `pytest.warns` assertions. |
| 86 | `fastapi_15745` | `fastapi` | `MAINT_LIFECYCLE.REFACTOR_AND_INTERNAL_API` | Refactor | 4f (+939/-291) | Replaced route cloning in `APIRouter.include_router` with tree-based `_IncludedRouter` and `_RouterIncludeContext`/`_EffectiveRouteContext` wrappers in `fastapi/routing.py`, introduced `_APIRouteLike` and context traversal in `fastapi/openapi/utils.py`, and added `_openapi_routes_version` cache invalidation in `FastAPI.openapi`. | Very high architectural complexity (+939/-291): must reject indirect router inclusion cycles, keep distinct effective contexts for repeated deep inclusions of the same router under different prefixes (`url_path_for` and runtime scope), invoke original `APIRoute.get_route_handler` and `APIRouter.matches` subclass overrides, and invalidate cached `openapi_schema` when routes are added live to already-included routers. |
| 98 | `requests_6592` | `requests` | `FEAT_API.CONFIG_AND_PARAMETER_EXT` | Feature | 1f (+1/-1) | Appended `"too_early"` to the tuple for key `425` in `src/requests/status_codes.py:_codes`, automatically exposing lowercase/uppercase attribute and dictionary lookups via `_init()`. | Removing existing aliases `"unordered_collection"`/`"unordered"` breaks backward compatibility; adding uppercase `"TOO_EARLY"` directly breaks lowercase lookups because `_init()` derives uppercase aliases from lowercase entries. |
| 100 | `rich_3486` | `rich` | `FEAT_API.RENDER_AND_FORMAT_EXT` | Feature | 3f (+74/-24) | Added `last_instruction` to `Frame` and populated it on Python >= 3.11 via `frame_summary.f_code.co_positions()` at `frame_summary.f_lasti // 2` in `rich/traceback.py`, added `traceback.error_range` to `rich/default_styles.py`, and extended `Syntax.stylize_range()`/`_apply_stylized_ranges()` in `rich/syntax.py` with `style_before: bool = False` using `text.stylize_before()`. | Must guard `co_positions()` with `sys.version_info >= (3, 11)` and verify none of `(start_line, end_line, start_column, end_column)` is `None` (`test_traceback_finely_grained_missing`); forgetting `// 2` on `f_lasti` indexes the wrong bytecode instruction; not supporting `style_before=True` causes the range style to override token colors instead of layering cleanly. |
| 101 | `rich_3777` | `rich` | `FEAT_API.CONFIG_AND_PARAMETER_EXT` | Feature | 2f (+12/-1) | In `rich/console.py:Console.__init__`, when `force_interactive is None`, checked `self._environ.get("TTY_INTERACTIVE", None)` and set `force_interactive = False` for `"0"` and `True` for `"1"`; also added `"TTY_INTERACTIVE"` to `env_names` in `rich/diagnose.py:report`. | Reading `os.environ` instead of `self._environ` breaks isolated `Console(_environ=...)` tests; checking `TTY_INTERACTIVE` even when `force_interactive` is explicitly passed overrides caller intent; treating arbitrary non-empty values as truthy instead of matching exact `"0"`/`"1"` violates expected semantics. |
| 107 | `rich_3676` | `rich` | `FEAT_API.RENDER_AND_FORMAT_EXT` | Feature | 2f (+12/-1) | Added notes: List[str] = field(default_factory=list) to Stack and _SyntaxError, extracted getattr(exc_value, '__notes__', None) or [] in Traceback.extract, registered 'traceback.note': Style(color='green', bold=True) in rich/default_styles.py, and rendered each note in Traceback.__rich_console__ via Text.assemble(('[NOTE] ', 'traceback.note'), highlighter(note)). | The prompt is just 'Notes / Add support for Exception.__notes__' without specifying dataclass attribute names (Stack.notes), style key ('traceback.note'), or '[NOTE] ' prefix. Accessing exc_value.__notes__ directly without getattr(..., None) breaks Python <3.11 compatibility. |
| 118 | `rich_3052` | `rich` | `FEAT_API.CONFIG_AND_PARAMETER_EXT` | Feature | 1f (+29/-5) | Added case_sensitive: bool = True to PromptBase.__init__ and all PromptBase.ask overloads/implementation, updated check_choice to compare lowercased strings when case_sensitive is False, and updated process_response to resolve and return the matching canonical-case entry from self.choices. | Forgetting to return the canonical choice from self.choices in process_response (returning 'FoO' instead of 'foo' when choices=['foo', 'bar']) fails test_prompt_str_case_insensitive, and omitting case_sensitive from the typing @overload signatures of PromptBase.ask breaks static typing. |

---

## 6. Cross-Cutting Findings, Meta-Root-Cause Archetypes & BCF Brain Insights

Stepping back from the 103 individual RCAs reveals **six recurring Python fault archetypes** that cut across FastAPI, Rich, Requests, and HTTPX—meaning they will recur with high probability across the **unseen private repositories** on the Kaggle test set. Designing the BCF Brain around these structural invariants rather than repository trivia is the key to generalization.

### 6.1 The Six Recurring Meta-Root-Cause Archetypes

| Archetype | Representative Tasks | Underlying Python Mechanical Failure | Deterministic Detection & Fix Strategy for BCF |
| :--- | :--- | :--- | :--- |
| **1. Introspection & Proxy Blind Spots** | `requests_7505`, `7502`, `7433`; `fastapi_14448`, `14458`, `9555`, `9753`, `5077`, `12942`, `14297`, `14430`, `14616`; `rich_3006`, `3894`, `4077` | Runtime `isinstance`/`issubclass`/`==` checks ignore `__getattr__` proxies, `@wraps`/`functools.partial` layers, `inspect.isclass`, PEP 604 `UnionType`, nested `Annotated`, or concrete base-class methods (`IOBase.isatty`). | Check unwrapping order (`partial` -> `inspect.unwrap`), guard `isclass`, use `is` for sentinels (`Parameter.empty`), pair `isinstance` with `hasattr` for proxies, and unwrap `Union`/`UnionType`/`Annotated` recursively. |
| **2. Shared Mutable State & Cache/Lifecycle Drift** | `fastapi_5624`, `14463`, `14986`, `14873`, `14419`, `14301`; `requests_7328`; `rich_2943`, `3470`, `3480`, `3518`, `3905`, `3934` | In-place mutation of aliased lists/dicts (`extend`, shallow `.copy()`, `insert` on cached OpenAPI schema), stale `_hash`, `super().__init__` clobbering attrs, asymmetric `start`/`stop`, and wrong buffer/history ordering. | Audit every mutation site for aliasing (use non-mutating `+`, `copy.deepcopy`, or `[:]` copy), verify `super().__init__` ordering, invalidate cached hashes (`_hash = None`), and verify start/stop symmetry. |
| **3. Multidict / Alias / Extra-Field Leakage** | `fastapi_15589`, `14360`, `14356`, `14303`, `13537`, `14371` | Calling `.items()` on multidicts drops duplicate keys; `processed_keys` omits raw or converted aliases; checking `key not in values` re-inserts cleared `None` fields into `extra='allow'` models. | Always use `.keys()` + `.getlist(key)` (guarded by `hasattr(..., 'getlist')` for plain dicts), unwrap 1-element lists, track `processed_keys` with both raw and converted aliases, and distinguish `field_aliases` from non-`None` `values`. |
| **4. Zero-Progress Loops, Boundaries & String/Unicode Edge Cases** | `rich_4006`, `3772`, `3521`, `3506`, `3535`, `3953`, `3944`, `3063`, `3064`, `4075`, `4076`; `fastapi_14258`, `15763` | `while` loop `continue` without advancing index; negative index clamp omission; `splitlines()` eating trailing `\n`; `next()` without default on trailing `\u200d`; `if x:` instead of `if x is not None:`; missing cycle `visited` set. | Inspect every loop branch for guaranteed monotone cursor progress, clamp indices `>= 0`, guard `is not None` vs truthiness, check boundary inputs (`""`, single element, trailing delimiter, self-reference), and add visited-set cycle guards. |
| **5. Spec & Wire-Protocol Boundary Violations** | `fastapi_15588`, `14978`, `14786`, `13786`, `14953`; `requests_7427`, `7315`, `7309`, `6644`, `6589`, `6757`; `rich_3278`, `3454`, `3067`, `3043`, `3105` | Missing `\r`/`\n` header/SSE validation, raw `endswith` without DNS dot boundary, `403` vs `401` + `WWW-Authenticate`, `str` codepoint count vs UTF-8 byte length, missing RFC 3986 chars (`@`, `~`), misplaced `<html>` or CSS inheritance. | Check RFC/spec invariants at wire boundaries (CR/LF, dot-prefix hostnames, UTF-8 vs `latin-1`, exact status codes/headers, non-capturing regex groups) without breaking backwards compatibility. |
| **6. Cross-Version & Dual-Tree Drift** | `fastapi_14851`, `14186`, `14077`, `11355`, `14485`, `14430`; `requests_7205`, `6757`; `httpx_3672` | Python 3.10–3.14 changes (`eval_str`, `netrc`, `UnionType`, `pydantic.v1` warning), Starlette/urllib3 removals, and unannotated generated twin trees (`scripts/unasync` mapping `src/ahttpx/` -> `src/httpx/`). | Gate version-specific APIs via `sys.version_info` or feature checks, avoid importing deprecated third-party constants directly, and scan `scripts/` early for codegen tools (`unasync`) before editing twin directories. |

### 6.2 Five Quantitative Agent-Design Insights Directly Derived from the 129 Tasks

1. **Single-File Surgical Fixes Dominate Bug Resolution (82.7% of `BUG_*` Tasks):** Out of 98 pure defect-category tasks, 81 modify a single `.py` file and 73 of all 129 tasks have total diff churn `<= 15` lines. Meanwhile, community audits (`#753524`, `#760014`) prove that multi-file feature tasks (75% of `FEAT_API`) have near-zero solve rates for small models. **Design implication:** BCF must optimize ruthlessly for fast, exact, single-file surgical diagnosis and editing first, while using explicit caller/sibling-tree checklists on 31B when a multi-file task is detected.
2. **Finding the File Is Not the Bottleneck — Misreading Prompt Traps & Breaking Edits Are:** Independent trace studies (`#751596`, `#760595`) show Gemma 4 opens the gold file by tool call 2–3 in 63–76% of runs, yet loses tasks to (a) **misleading/terse PR prompts** (`fastapi_13786`, `14479`, `13713`, `requests_6757`, `rich_3061`, `3905`, `httpx_3672`), (b) **syntax/indentation corruption on edits** (12/83 failures on E4B, up to 43% `edit_file` mangling on 31B), and (c) **unreadable or exit-code-masked test verification** (96/133 E4B pytest runs gave no usable signal). **Design implication:** BCF must verify symbol names directly in the repository (never trusting PR prose blindly!), apply syntax-guarded atomic line-range edits, and run structured pytest verification that captures real exit codes.
3. **Spec-Change & Legacy-Test Contradictions Are Real (~15–34% of Tasks):** On tasks like `rich_3470`, `httpx_3672`, `fastapi_13786`, `fastapi_14978`, and `requests_7315`, a 100%-correct fix **intentionally breaks pre-existing visible tests** that asserted the old buggy behavior (`#760014`). Conversely, on ~65% of tasks existing tests pass on unmodified code. **Design implication:** BCF must teach the solver **before/after delta verification**—comparing a targeted test *or* a clean `/tmp` inline reproducer against the issue requirement, and distinguishing intentional spec changes (where an old test asserts the bug!) from genuine unintended regressions.
4. **Competition Code-Graph Tools Are Structurally Blind to 16/129 Public Tasks (100% of `async def`) and Uncalled Attributes:** As proven in `httpx_3672` (`self._parser.complete` without parentheses) and Thread `#758854` (0/914 FastAPI async functions indexed), relying on `search_similar_code`/`get_code_neighbors` drops async functions and non-call attribute references while injecting ~5.8 KB of noisy text. **Design implication:** BCF replaces precomputed graph tools with a stdlib-only offline **AST + BM25 + lexical reference locator** (`bcf.py`) that indexes both `def` and `async def`, finds unparenthesized attribute references, and discovers matching targeted test files in `<1` second.
5. **Hidden Blast-Radius Multipliers (`test_patch` Scope vs. Issue Prose):** Many issues name only one symptom while the test suite asserts a parallel code path (e.g., `rich_3480` mentions `append` but tests `append_text`; `rich_3718` must fix both `title_text` and `subtitle_text`; `fastapi_14458` must fix `is_gen_callable`, `is_async_gen_callable`, and `is_coroutine_callable`; `fastapi_11355` and `14485` must fix both `get_typed_signature` and `get_typed_return_annotation`; `fastapi_14262` and `14099` span both HTTP and WebSocket). **Design implication:** BCF's per-subcategory playbooks explicitly require a **Sibling-Path & Mirror-Method Sweep** before verification so partial single-site patches are caught before `submit_patch()`.

