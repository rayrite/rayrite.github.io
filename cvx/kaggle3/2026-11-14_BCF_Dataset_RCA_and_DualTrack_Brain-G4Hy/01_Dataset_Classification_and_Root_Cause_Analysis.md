# Kaggle Google Gemma 4 Developer Agent Competition — Complete Dataset Classification & Root Cause Analysis

> **Dataset:** `input/kagglecomp/kagglecomp_data_package/tasks.jsonl` (**129 tasks** across **4 repositories**)  
> **Coverage:** 100% mutually exclusive classification (`129 / 129` tasks) and individual Root Cause Analysis across all **90** bug, security, regression, and compatibility-fix tasks plus all **39** feature, performance, refactor, deprecation, documentation, tooling, and novelty tasks.

---

## 1. Executive Summary & Verified Dataset Census

An exhaustive programmatic and line-level diff audit of all **129** tasks in `tasks.jsonl` reveals a sharply bimodal evaluation distribution shaped by **FastAPI internals**, **Rich terminal/Unicode rendering**, **Requests HTTP client proxies/URLs**, and **HTTPX twin async/sync architecture**:

- **Zero Hints Available (`0 / 129`):** Every single task (`100.0%`) has an empty `hints_text` field. All localization must happen inside `/workspace` without external hints.
- **Offline URL & Short-Prompt Reality:** **82 / 129 (63.6%)** prompts embed GitHub issue/PR URLs or external web links that are unreachable inside Container A (`network_mode="none"`). Moreover, **37 / 129 (28.7%)** prompts are fewer than 180 characters (minimum **42 chars**, overall median **418 chars**, `Textualize/rich` median **138 chars**), frequently consisting of bare labels such as `"empty live"` (`rich_3934`), `"proxy isatty"` (`rich_4077`), or `"Fix #3104"` (`rich_3105`).
- **Bugs vs. Non-Bugs (`90` vs. `39`):** **90 / 129 (69.8%)** tasks are genuine bug, crash, security, regression, or Python/dependency compatibility fixes, while **39 / 129 (30.2%)** are new features/DX enhancements (**23**), performance/structural refactors (**6**), deprecations/removals (**5**), or pure documentation/tooling/novelty PRs (**5**).
- **Cross-Cutting Patch Complexity:** While **54 / 129 (41.9%)** tasks add only **1–5 source lines**, **37 / 129 (28.7%)** modify multiple source files, **12 / 129** add `>100` source lines (up to `12,170` generated/data lines in `rich_3930`), **15 / 129 (11.6%)** include `docs_src/` or `docs/` edits (`3` pure-docs tasks touch *no* core library source), and **4 / 129** add zero source lines (`fastapi_14487`, `fastapi_14492`, `fastapi_15023`, and `requests_7315` which deletes 2 lines).
- **Harness & Pytest Environment Traps:** In offline Container A/B execution, tests rely on `inline_snapshot` (**18 / 129, 14.0%**), local `httpbin` fixtures (**8 / 129, 6.2%**), `dirty_equals` (**5 / 129, 3.9%**), conditional `pytest.mark.skip` (**9 / 129, 7.0%**), `pytest.mark.xfail` (**1 / 129**, `fastapi_14371`), and `pytest.mark.anyio` (**1 / 129**, `fastapi_15745`).

---

## 2. Multi-Axis Taxonomy Tables

### Table 2.1: Repository × Task Intent Cross-Tabulation (`N = 129`)

| Task Intent | Total Tasks | Share | fastapi/fastapi | Textualize/rich | psf/requests | encode/httpx |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **I1. Bug & Security/Compat Fix** | **90** | 69.8% | 38 | 40 | 12 | 0 |
| **I2. Feature & DX Enhancement** | **23** | 17.8% | 15 | 6 | 1 | 1 |
| **I3. Performance & Structural Refactor** | **6** | 4.7% | 4 | 2 | 0 | 0 |
| **I4. Deprecation & Support Removal** | **5** | 3.9% | 5 | 0 | 0 | 0 |
| **I5. Docs, Tooling & Novelty PR** | **5** | 3.9% | 5 | 0 | 0 | 0 |
| **Total Across All Repos** | **129** | **100.0%** | **67 (51.9%)** | **48 (37.2%)** | **13 (10.1%)** | **1 (0.8%)** |

### Table 2.2: Prompt Length & Edit Size Profile (`N = 129`)

| Metric Dimension | Bucket / Repository | Count or Range | Share or Median | Engineering Implication |
| :--- | :--- | :---: | :---: | :--- |
| **Prompt Length (`fastapi/fastapi`)** | Min / Median / Max (chars) | 63 – 10,095 | Median: 677 | Detailed specs or code snippets in many FastAPI PRs |
| **Prompt Length (`Textualize/rich`)** | Min / Median / Max (chars) | 42 – 3,096 | Median: 138 | Heavy reliance on URL-only titles; AST/test localization critical |
| **Prompt Length (`psf/requests`)** | Min / Median / Max (chars) | 67 – 836 | Median: 406 | Clear issue descriptions; protocol/urllib3 edge cases |
| **Prompt Length (`encode/httpx`)** | Min / Median / Max (chars) | 243 – 243 | Median: 243 | Concise bullet checklist over mirrored async/sync packages |
| **Source Lines Added** | 0 lines (docs or pure delete) | 4 / 129 | 3.1% | Includes 3 `docs_src`-only tasks + `requests_7315` (2-line deletion) |
| **Source Lines Added** | 1 to 5 lines | 54 / 129 | 41.9% | Surgical fixes; highest sensitivity to exact localization & clean edit |
| **Source Lines Added** | 6 to 25 lines | 34 / 129 | 26.4% | Guard conditions, helper functions, schema propagation |
| **Source Lines Added** | 26 to 100 lines | 25 / 129 | 19.4% | Multi-method state fixes, security/routing extensions |
| **Source Lines Added** | > 100 lines | 12 / 129 | 9.3% | Architectural features (`15800`, `15745`, `15030`, `3930`) & removals (`14609`) |

### Table 2.3: Sandbox & Test Environment Traps (`N = 129`)

| Hazard / Signal | Count | Share | Exact Affected Task IDs or Impact |
| :--- | :---: | :---: | :--- |
| **Empty `hints_text`** | 129 | 100.0% | All 129 tasks; zero built-in hints provided |
| **Offline Web / GitHub URLs** | 82 | 63.6% | Container A has `network_mode="none"`; referencing PR links fails unless resolved locally |
| **Short Prompts (< 180 chars)** | 37 | 28.7% | E.g., `rich_3934`, `rich_3944`, `rich_4075`, `rich_4077`, `fastapi_14361` |
| **Multi-Src-File Changes (> 1 file)** | 37 | 28.7% | Cross-layer edits (e.g., `_compat` + `dependencies/utils` + `openapi/utils` or `ahttpx` + `httpx`) |
| **`inline_snapshot` Assertions** | 18 | 14.0% | `fastapi_15030`, `14962`, `14964`, `12942`, `14609`, `14349`, `14512`, `14485`, `14482`, `14459`, `14455`, `14361`, `14266`, `14246`, `14605`, `14583`, `15745`, `14953` |
| **`docs_src/` Coupled Tests** | 15 | 11.6% | Tutorial tests execute files directly under `docs_src/`; `fastapi_14487`, `14492`, `15023` edit only `docs_src/` |
| **`pytest.mark.skip` / `pytest.skip`** | 9 | 7.0% | `requests_7427`, `requests_6757`, `fastapi_15800`, `rich_3486`, `rich_3468`, `rich_3782`, `rich_3675`, `rich_3676`, `rich_3006` |
| **`httpbin` Local Fixture** | 8 | 6.2% | `requests_7505`, `7502`, `7433`, `7328`, `7205`, `6757`, `6589`, `6592` |
| **`dirty_equals` Matchers** | 5 | 3.9% | `fastapi_12942`, `14360`, `14371`, `14605`, `14303` |
| **`pytest.mark.xfail`** | 1 | 0.8% | `fastapi_14371` |
| **`pytest.mark.anyio` (JUnit Trap)** | 1 | 0.8% | `fastapi_15745` (`swegemma` runs `-p no:anyio` on pytest; anyio plugin flags or markers need awareness) |

### Table 2.4: Domain Category & Subcategory Breakdown (`9` Categories, `19` Subcategories, `129` Tasks)

| Category | Subcategory | Total | Bugs | Non-Bugs | Task IDs |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Cat 1: Dependency Injection, Annotations & Request Binding (FastAPI)** | **1A. Signature, Typing & Forward-Reference Resolution** | 6 | 2 | 4 | `fastapi_11355`, `fastapi_14485` (bugs); `fastapi_5077`, `fastapi_9425`, `fastapi_13920`, `fastapi_14794` |
| Cat 1 (cont.) | **1B. Wrapped Callables, Partials & Class Dependencies** | 4 | 2 | 2 | `fastapi_14448`, `fastapi_14458` (bugs); `fastapi_9555`, `fastapi_9753` |
| Cat 1 (cont.) | **1C. Dependency Scopes, Lifecycles, Caching & ExitStack** | 5 | 3 | 2 | `fastapi_14099`, `fastapi_14301`, `fastapi_14419` (bugs); `fastapi_14262`, `fastapi_14372` |
| Cat 1 (cont.) | **1D. Parameter Aliasing, Form/File/Extra-Params & Headers** | 9 | 8 | 1 | `fastapi_11194`, `fastapi_13537`, `fastapi_14303`, `fastapi_14356`, `fastapi_14360`, `fastapi_14371`, `fastapi_14616`, `fastapi_15589` (bugs); `fastapi_14479` |
| **Cat 2: Pydantic Compat, Validation & OpenAPI Schema (FastAPI)** | **2A. Pydantic v2 CoreSchema, Unions, `$ref` & Arbitrary Types** | 10 | 10 | 0 | `fastapi_12942`, `fastapi_13207`, `fastapi_14246`, `fastapi_14297`, `fastapi_14349`, `fastapi_14361`, `fastapi_14430`, `fastapi_14482`, `fastapi_14512`, `fastapi_14953` |
| Cat 2 (cont.) | **2B. OpenAPI Schema Generation & Swagger Docs Security** | 4 | 3 | 1 | `fastapi_14463`, `fastapi_14791`, `fastapi_14986` (bugs); `fastapi_13713` |
| Cat 2 (cont.) | **2C. Python 3.14/Pydantic v1 Compat, Deprecations & Removal** | 5 | 1 | 4 | `fastapi_14186` (bug); `fastapi_14583`, `fastapi_14605`, `fastapi_14609`, `fastapi_14964` |
| **Cat 3: Security, Auth & Protocol Hardening (FastAPI)** | **3A. Auth Status Codes, Headers & OAuth2 Scope Tree** | 6 | 6 | 0 | `fastapi_5624`, `fastapi_13786`, `fastapi_14266`, `fastapi_14455`, `fastapi_14459`, `fastapi_14786` |
| Cat 3 (cont.) | **3B. CSRF Content-Type Enforcement & SSE Validation** | 2 | 1 | 1 | `fastapi_15588` (bug); `fastapi_14978` |
| **Cat 4: Routing, Lifecycle, Streaming & Server Infra (FastAPI + HTTPX)** | **4A. Router Inclusion, Paths, Contexts & Traceback UX** | 5 | 1 | 4 | `fastapi_15763` (bug); `fastapi_14258`, `fastapi_14306`, `fastapi_15745`, `fastapi_15785` |
| Cat 4 (cont.) | **4B. Events, Starlette Compat, SSE, Fast-JSON & Frontend** | 6 | 1 | 5 | `fastapi_14873` (bug); `fastapi_14077`, `fastapi_14851`, `fastapi_14962`, `fastapi_15030`, `fastapi_15800` |
| Cat 4 (cont.) | **4C. Async/Sync Twin Pool & Server Connections (`encode/httpx`)** | 1 | 0 | 1 | `httpx_3672` |
| **Cat 5: Docs, Release Tooling & Novelty PRs (FastAPI)** | **5A. `docs_src` Examples, Release CLI & Easter Eggs** | 5 | 0 | 5 | `fastapi_14487`, `fastapi_14492`, `fastapi_15023`, `fastapi_15280`, `fastapi_15661` |
| **Cat 6: Terminal Unicode, Segments & Console I/O (Rich)** | **6A. Unicode Widths, Grapheme Splitting & Word Wrapping** | 8 | 7 | 1 | `rich_3180`, `rich_3506`, `rich_3521`, `rich_3535`, `rich_3944`, `rich_3953`, `rich_4006` (bugs); `rich_3930` |
| Cat 6 (cont.) | **6B. Console I/O, Env Flags, Broken Pipe & FileProxy** | 10 | 7 | 3 | `rich_3468`, `rich_3470`, `rich_3905`, `rich_3934`, `rich_3938`, `rich_4075`, `rich_4077` (bugs); `rich_3675`, `rich_3777`, `rich_4070` |
| **Cat 7: Markup, ANSI, Styling & Export (Rich)** | **7A. ANSI/Markup Escaping, Control Codes, URLs & HTML Export** | 9 | 9 | 0 | `rich_3043`, `rich_3063`, `rich_3067`, `rich_3105`, `rich_3278`, `rich_3454`, `rich_3471`, `rich_3480`, `rich_4076` |
| Cat 7 (cont.) | **7B. Style Hash Cache, Tab Spans & Syntax Padding/BG** | 4 | 4 | 0 | `rich_2943`, `rich_3061`, `rich_3296`, `rich_3782` |
| **Cat 8: Renderables, Tracebacks, Inspect & Prompts (Rich)** | **8A. Markdown, Table & Panel Layout/Styling** | 9 | 8 | 1 | `rich_2725`, `rich_3064`, `rich_3130`, `rich_3469`, `rich_3518`, `rich_3718`, `rich_3935`, `rich_4079` (bugs); `rich_3942` |
| Cat 8 (cont.) | **8B. Tracebacks, Pretty/Repr, Inspect & Prompts** | 8 | 5 | 3 | `rich_3006`, `rich_3472`, `rich_3772`, `rich_3882`, `rich_3894` (bugs); `rich_3052`, `rich_3486`, `rich_3676` |
| **Cat 9: HTTP Client Proxies, URLs, Auth & Headers (Requests)** | **9A. Protocol Proxies, Pickle MRO & `urllib3` Compat** | 5 | 5 | 0 | `requests_6629`, `requests_6757`, `requests_7433`, `requests_7502`, `requests_7505` |
| Cat 9 (cont.) | **9B. URL Paths, Redirects, `no_proxy`, Netrc & Headers** | 8 | 7 | 1 | `requests_6589`, `requests_6644`, `requests_7205`, `requests_7309`, `requests_7315`, `requests_7328`, `requests_7427` (bugs); `requests_6592` |
| **Total Across All Categories** | **19 Subcategories** | **129** | **90** | **39** | **100% Coverage Verified** |

---

## 3. Cross-Cutting Architectural Insights & Chronological Cascades

### 3.1 Temporal Regression & Feature Cascades Inside the Dataset
A striking property of this dataset is that multiple tasks are **chronologically coupled** snapshots of the same subsystems evolving over time. A solver that hardcodes assumptions from one historical commit will break on a later commit if it ignores the repo's exact `HEAD` state:

1. **Unicode Grapheme Cascade in Rich (`2026-01-22` to `2026-02-19`):**
   - `rich_3930` (`2026-01-22`) introduces multi-codepoint grapheme splitting (`split_graphemes`, `rich/_unicode_data/unicode*.py`).
   - `rich_3944` (`2026-01-24`) fixes Private Use Area (PUA / Nerd Font) codepoints returning width `0` instead of `1`.
   - `rich_3953` (`2026-02-01`) fixes C0/C1 control codes, table upper-bound checks, binary-search width return (`width` vs `-1`), and `index` iteration in `_cell_len`.
   - `rich_4006` (`2026-02-19`) fixes an infinite loop in `split_graphemes` when leading/trailing ZWJ or variation selectors leave `index` unincremented or `spans` empty.
2. **Pydantic v1 Policy Reversal in FastAPI (`2025-10-20` to `2025-12-27`):**
   - `fastapi_14186` (`2025-10-20`) *adds* `fastapi/_compat/may_v1.py` so Python 3.14 + Pydantic 2.12.1 doesn't crash importing `pydantic.v1`.
   - `fastapi_14583` (`2025-12-21`) emits deprecation warnings on `pydantic.v1` usage, and `fastapi_14605` (`2025-12-26`) replaces `DeprecationWarning` with `FastAPIDeprecationWarning(UserWarning)`.
   - `fastapi_14609` (`2025-12-27`) *removes* `pydantic.v1` support and deletes `may_v1.py` / `v1.py` glue across **18** source files.
3. **URL Leading-Slash Reversal in Requests (`2024-02-23` vs. `2026-05-10`):**
   - `requests_6644` (`2024-02-23`) *adds* `if url.startswith("//"): url = f"/{url.lstrip('/')}"` in `request_url` to avoid confusing `urllib3`.
   - `requests_7315` (`2026-05-10`) *deletes those exact 2 lines* because collapsing `//` breaks S3 presigned URL HMAC signatures on keys starting with `/`.
4. **Protocol Proxy Cascade in Requests (`2026-05-12` to `2026-06-09`):**
   - `requests_7433` (`2026-05-12`) fixes `isinstance(data, Iterable)` in `prepare_body` with `hasattr(data, "__iter__")`.
   - `requests_7502` (`2026-06-08`) fixes `_encode_files` with `hasattr(fp, "read")`.
   - `requests_7505` (`2026-06-09`) extracts shared `has_read(obj)` in `src/requests/_types.py` and sweeps remaining `isinstance(..., _SupportsRead)` calls in `_encode_params` and `prepare_body`.
5. **FastAPI Feature -> Harden Chains:**
   - `fastapi_14851` (`2026-02-06`) re-implements `on_event` locally -> `fastapi_14873` (`2026-02-09`) fixes `super().__init__(...)` overwriting `self.on_startup` / `self.on_shutdown`.
   - `fastapi_15030` (`2026-03-01`) adds `fastapi/sse.py` -> `fastapi_15588` (`2026-05-23`) closes CR/LF header/frame injection in `_check_single_line`.
   - `fastapi_14303` & `fastapi_14356` (`2025-12-02`) fix `.items()` -> `.getlist()` on `Form`/non-body models -> `fastapi_15589` (`2026-05-23`) closes the underscore-header leak in `processed_keys`.
   - `fastapi_14262` (`2025-11-03`) adds dependency `scope="function"|"request"` -> `fastapi_14301` (`2025-11-08`) forwards `scope` in `get_parameterless_sub_dependant` -> `fastapi_14419` (`2025-11-30`) fixes scope-aware dependency cache keys.

### 3.2 Seven Recurring Root-Cause Archetypes Across All 90 Bug Fixes

| Archetype | Count (Approx.) | Core Failure Mechanism | Representative Tasks |
| :--- | :---: | :--- | :--- |
| **A1. Wrapper & Unwrap Boundary Failures** | 12 | Checking `Annotated[...]`, `Union`, `TypeAliasType`, `functools.partial`, `@functools.wraps`, `type(...)`, or `__getattr__` wrappers on the outer object instead of unwrapping recursively or duck-typing. | `fastapi_12942`, `14430`, `14448`, `14458`, `14485`, `requests_7433`, `7502`, `7505` |
| **A2. Validation vs. Serialization & Alias Split** | 10 | Treating Pydantic v2 single-mode helpers identically for input and output schemas, ignoring `validation_alias` vs `alias` / `field.name`, or duplicating `FieldInfo` metadata. | `fastapi_13207`, `14246`, `14360`, `14371`, `14482`, `14512`, `14616`, `13537` |
| **A3. Shallow Copy, In-Place Mutation & Init Ordering** | 9 | Calling `.copy()` on nested OpenAPI dicts, mutating `list` in-place via `.extend()` while recursing, mutating `self.servers` on requests, mutating `_spans` during iteration, or setting attributes before `super().__init__`. | `fastapi_5624`, `14463`, `14873`, `14986`, `rich_2943`, `rich_3480`, `requests_7328` |
| **A4. Terminal Geometry, Regex & String/Byte Boundaries** | 18 | Off-by-one bisection/offset math in `split_cells`, incomplete character classes in regexes (`url`, `ansi`, `_is_single_cell_widths`, trailing `\`), `splitlines()` losing final `\n`, `str` length vs UTF-8 bytes, wrong HTML tag placement. | `rich_3043`, `3063`, `3067`, `3180`, `3278`, `3454`, `3506`, `3521`, `3535`, `3953`, `4006`, `4076`, `requests_6589` |
| **A5. Protocol, HTTP Spec & Environment Edge Cases** | 13 | Returning HTTP `403` instead of `401`, preserving raw whitespace on `Bearer` tokens, missing `\r`/`\n` checks in SSE, subdomain vs domain-boundary `no_proxy` checks, Python 3.11+ `netrc` truthy empty tuple `('', '', '')`, `urllib3` 1.26 vs 2.x, cyclic `__cause__`/MRO `__reduce__`. | `fastapi_13786`, `14786`, `15588`, `requests_6629`, `6757`, `7205`, `7309`, `7427`, `rich_3468`, `3772`, `4077` |
| **A6. Multi-Layer Context & Inheritance Propagation Loss** | 10 | Losing parent OAuth2 scopes, `dependency.scope`, `table.highlight`, `border_style`, `style` on soft wraps, `config` (`arbitrary_types_allowed`), or parameter order assumptions (`File` after `Form`). | `fastapi_11194`, `14266`, `14301`, `14419`, `14455`, `14459`, `rich_3518`, `3718`, `3938` |
| **A7. Incomplete Feature/Multidict Handling** | 8 | Using `.items()` instead of `.getlist()` on Starlette `MultiDict`/`Headers`, ignoring `"$ref"` non-string schema attributes, ignoring empty markdown table sections or empty `live` height or `disable=True`. | `fastapi_14303`, `14356`, `14349`, `14361`, `rich_3064`, `3905`, `3934`, `4075` |

---

## 4. Complete Root Cause Analysis of All 90 Bug & Error Tasks

Every single one of the **90** tasks classified as `is_bug = True` is documented below by Category and Subcategory, with exact observed files, symbols, failure trigger, underlying root cause, and canonical fix pattern.

### Category 1: Dependency Injection, Annotations & Request Binding (`15` bugs in FastAPI)

#### 1A. Signature, Typing & Forward-Reference Resolution (`2` bugs)
- **`fastapi_11355`** — *Fix evaluating stringified annotations in Python 3.10* (`fastapi/dependencies/utils.py`: `get_typed_signature` / signature callsites)
  - **Symptom & Trigger:** Under `from __future__ import annotations` on Python 3.10+, dependency/endpoint parameter annotations stay un-evaluated strings when `inspect.signature(call)` is called without `eval_str=True`, breaking type resolution when local/function scope differs.
  - **Root Cause:** `inspect.signature(call)` in Python 3.10+ only evaluates string annotations eagerly if `eval_str=True` is explicitly passed; FastAPI omitted `eval_str=True` (added guarded by `sys.version_info >= (3, 10)`).
  - **Canonical Fix:** Conditionally pass `inspect.signature(call, eval_str=True)` when `sys.version_info >= (3, 10)`.
- **`fastapi_14485`** — *Fix support for `if TYPE_CHECKING`, non-evaluated stringified annotations* (`fastapi/dependencies/utils.py`: `get_typed_signature` renamed/wrapped in `_get_signature`)
  - **Symptom & Trigger:** Routes or dependencies whose return annotations (or `if TYPE_CHECKING:`-guarded annotations) refer to types unavailable at runtime raise `NameError` at route registration when `eval_str=True` runs.
  - **Root Cause:** `inspect.signature(call, eval_str=True)` raises `NameError` eagerly on ANY unresolvable string annotation on the signature, crashing even if FastAPI only needs runtime-resolvable parameter types.
  - **Canonical Fix:** Wrap `inspect.signature(call, eval_str=True)` in `try ... except NameError:` falling back to `inspect.signature(call)` (then per-param `get_typed_annotation` resolves individual parameters safely).

#### 1B. Wrapped Callables, Partials & Class Dependencies (`2` bugs)
- **`fastapi_14448`** — *Fix support for `functools.wraps` and `partial` combined across sync/async functions and classes* (`fastapi/dependencies/models.py`: `_unwrapped_call`, `_impartial`, `Dependant.is_gen_callable`, `is_async_gen_callable`, `is_coroutine_callable`; `fastapi/dependencies/utils.py`: `_solve_generator`)
  - **Symptom & Trigger:** Dependencies wrapped in *both* `functools.partial` and `@functools.wraps` (in either nesting order, including callable classes) misclassify coroutine/generator/async-gen execution mode (e.g., running async deps in threadpool or failing to await).
  - **Root Cause:** Previously `_unwrapped_call` called `inspect.unwrap(self.call)` *before* checking `isinstance(..., partial)` once; if a `partial` wrapped a decorated function (or vice versa, or wrapped a callable class instance), `inspect.iscoroutinefunction` / `isgeneratorfunction` only inspected one unwrapping order, and callable classes needed checks on both `_impartial` and `_unwrapped_call` and their `__call__` attributes. Additionally `_solve_generator` checked `is_gen_callable` before `is_async_gen_callable`.
  - **Canonical Fix:** Extract helper `_impartial(func)` (while-loop unwrapping nested `partial`) and `_unwrapped_call(call)` (`inspect.unwrap(_impartial(call))`); test generator/coroutine predicates against both `_impartial(call)` and `_unwrapped_call(call)` plus their `__call__` attributes; check `is_async_gen_callable` before `is_gen_callable` in `_solve_generator`.
- **`fastapi_14458`** — *Fix using class (not instance) dependency that has `__call__` method* (`fastapi/dependencies/models.py`: `Dependant.is_gen_callable`, `is_async_gen_callable`, `is_coroutine_callable`)
  - **Symptom & Trigger:** Regression when `Depends(MyClass)` passes a *class* whose `__call__` is `async def` or a generator: FastAPI inspects `getattr(MyClass, "__call__", None)` and treats instantiating `MyClass(...)` as calling an async/generator function, crashing or hanging on `await instance`.
  - **Root Cause:** Constructing a class `MyClass(**kwargs)` is always a synchronous call returning an instance (only calling an *instance* invokes `MyClass.__call__`). Checking `dunder_call` without `if inspect.isclass(_unwrapped_call(self.call)): return False` misclassified class constructors as coroutines/generators.
  - **Canonical Fix:** Guard `is_gen_callable`, `is_async_gen_callable`, and `is_coroutine_callable` with `if inspect.isclass(_unwrapped_call(self.call)): return False` (after checking the outer call / before inspecting `__call__`).

#### 1C. Dependency Scopes, Lifecycles, Caching & ExitStack (`3` bugs)
- **`fastapi_14099`** — *Fix `StreamingResponse` with `yield` dependencies or `UploadFile`, close after response is done* (`fastapi/applications.py`: `build_middleware_stack`; `fastapi/middleware/asyncexitstack.py`: `AsyncExitStackMiddleware`; `fastapi/routing.py`: custom `request_response`)
  - **Symptom & Trigger:** `StreamingResponse` endpoints that consume `UploadFile` or `yield` dependencies hit closed-file / prematurely-exited context managers before streaming finishes, or fail to run middleware exit cleanup.
  - **Root Cause:** Starlette's stock `request_response` + middleware ordering exits `AsyncExitStack` either inside the endpoint wrapper before response streaming completes or misorders `ServerErrorMiddleware` / `ExceptionMiddleware` relative to file/dependency cleanup stacks (`fastapi_middleware_astack` vs `fastapi_astack`).
  - **Canonical Fix:** Add `AsyncExitStackMiddleware` (`fastapi/middleware/asyncexitstack.py`) in `FastAPI.build_middleware_stack`, and wrap handlers with FastAPI's `request_response` managing per-dependency exit timing separately from request-wide file closure.
- **`fastapi_14301`** — *Fix `Depends(func, scope='function')` for top-level (parameterless) dependencies* (`fastapi/dependencies/utils.py`: `get_parameterless_sub_dependant`)
  - **Symptom & Trigger:** Passing `Depends(gen_func, scope="function")` inside `dependencies=[...]` on a route/app/router ignores `scope="function"` and keeps request-scoped teardown behavior.
  - **Root Cause:** `get_parameterless_sub_dependant` constructed `get_dependant(...)` without forwarding `scope=depends.scope`.
  - **Canonical Fix:** Pass `scope=depends.scope` when creating the `Dependant` in `get_parameterless_sub_dependant`.
- **`fastapi_14419`** — *Cache dependencies that don't use scopes and don't have sub-dependencies with scopes* (`fastapi/dependencies/models.py`: `Dependant.own_oauth_scopes`, `parent_oauth_scopes`, `oauth_scopes`, `_uses_scopes`, `cache_key`; `fastapi/dependencies/utils.py`: `get_parameterless_sub_dependant`, `get_dependant`, `get_flat_dependant`)
  - **Symptom & Trigger:** Same dependency called twice in a request—once directly and once underneath an OAuth2 security dependency with scopes—fails to share its cached result even though the leaf dependency neither accepts `SecurityScopes` nor has sub-dependencies with scopes.
  - **Root Cause:** `Dependant.cache_key` unconditionally included `tuple(sorted(set(self.security_scopes or [])))` propagated down from ancestors, giving an un-scoped helper a different cache key under a scoped parent than under an un-scoped caller.
  - **Canonical Fix:** Split `security_scopes` into `own_oauth_scopes` and `parent_oauth_scopes`, compute `_uses_scopes` recursively (checking `own_oauth_scopes`, `security_scopes_param_name`, `self._is_security_scheme`, and sub-dependencies), and include scopes in `cache_key` only when `self._uses_scopes` is True.

#### 1D. Parameter Aliasing, Form/File/Extra-Params & Header Parsing (`8` bugs)
- **`fastapi_11194`** — *Fix validation error when `File` is declared after `Form` parameter* (`fastapi/dependencies/utils.py`: `_extract_form_body`)
  - **Symptom & Trigger:** Route declaring `(field: str = Form(), upload: UploadFile = File())` fails with body/validation errors because `upload` isn't treated properly as multipart file data.
  - **Root Cause:** `_extract_form_body` inspected only `first_field = body_fields[0]` and checked `isinstance(first_field_info, params.File)`, assuming all file fields were preceded or led by a `File` field.
  - **Canonical Fix:** Check `isinstance(field_info, params.File)` per individual `field` inside the loop over `body_fields`.
- **`fastapi_13537`** — *Fix support for form values with empty strings interpreted as missing (`None` default)* (`fastapi/dependencies/utils.py`: `process_fn` / `_get_multidict_exc` loop)
  - **Symptom & Trigger:** Optional form field with default `None` fails or mishandles empty/missing form submissions when comparing keys against `values`.
  - **Root Cause:** After regression PR #12134, the check `if key not in values:` checked already-filtered `values` rather than `{field.alias for field in body_fields}` (`field_aliases`).
  - **Canonical Fix:** Build `field_aliases = {field.alias for field in body_fields}` (later updated to `get_validation_alias`) and check `if key not in field_aliases:`.
- **`fastapi_14303`** — *Fix parsing extra `Form` parameter list* (`fastapi/dependencies/utils.py`: `process_fn` / form extraction)
  - **Symptom & Trigger:** A Pydantic model with `model_config = ConfigDict(extra="allow")` bound via `Form()` receives only the *last* value when an extra multi-value key (e.g., `?x=1&x=2` in form body) is sent.
  - **Root Cause:** Iterating `for key, value in received_body.items():` over Starlette `FormData` (`ImmutableMultiDict`) yields only the last value per key instead of calling `received_body.getlist(key)`.
  - **Canonical Fix:** Iterate `received_body.keys()`, fetch `param_values = received_body.getlist(key)`, unwrap single-element lists (`param_values[0]`), and keep multi-element lists intact.
- **`fastapi_14356`** — *Fix parsing extra non-body parameter list* (`fastapi/dependencies/utils.py`: `request_params_to_args`)
  - **Symptom & Trigger:** Same data loss as `14303`, but for `Query()` / `Header()` / `Cookie()` parameter models with `extra="allow"`.
  - **Root Cause:** `request_params_to_args` iterated `for key, value in received_params.items():`, dropping duplicate query/header keys on Starlette `MultiDict`/`QueryParams`/`Headers`.
  - **Canonical Fix:** Iterate `received_params.keys()`; if `hasattr(received_params, "getlist")`, call `getlist(key)` and unwrap only when `len(value) == 1`.
- **`fastapi_14360`** — *Fix Query/Header/Cookie parameter model alias* (`fastapi/dependencies/utils.py`: `request_params_to_args`)
  - **Symptom & Trigger:** When a parameter model field uses `Field(alias="x-foo")`, FastAPI extracts the value under `"x-foo"` but stores it in `params_to_process[field.name]` and adds `field.name` to `processed_keys`, causing Pydantic validation (`populate_by_name=False`) to fail or treat the alias as an extra param!
  - **Root Cause:** Mixed up `field.name` vs `field.alias` when populating `params_to_process` and `processed_keys`.
  - **Canonical Fix:** Store `params_to_process[field.alias] = value` and remove the erroneous `processed_keys.add(field.name)`.
- **`fastapi_14371`** — *Fix parameter aliases (`validation_alias` / `serialization_alias`)* (`fastapi/_compat/v2.py`, `fastapi/dependencies/utils.py`, `fastapi/openapi/utils.py`, `fastapi/params.py`)
  - **Symptom & Trigger:** Parameters or parameter models declaring `validation_alias="foo"` (or different `alias` vs `validation_alias`) fail request extraction, error `loc` reporting, and OpenAPI parameter naming (which all still used `field.alias`). Tests carry `pytest.mark.xfail` for unimplemented `AliasPath`/`AliasChoices`.
  - **Root Cause:** `ModelField` in `_compat/v2.py` exposed `.alias` but lacked `.validation_alias` / `.serialization_alias`; `params.py` didn't default `validation_alias` / `serialization_alias` from `alias` cleanly; `dependencies/utils.py` and `openapi/utils.py` read `.alias` directly instead of `get_validation_alias(field)`.
  - **Canonical Fix:** Expose `validation_alias` and `serialization_alias` on `ModelField`, normalize defaults in `params.py`, introduce `get_validation_alias(field)` in `dependencies/utils.py`, and route all param extraction, error `loc`, `convert_underscores`, and `_get_openapi_operation_parameters` through it.
- **`fastapi_14616`** — *Fix using `Json[list[str]]` type (issue #10997)* (`fastapi/dependencies/utils.py`: `_validate_value_with_model_field`, new `_is_json_field`)
  - **Symptom & Trigger:** `Form()` parameter typed as `Json[list[str]]` fails validation because FastAPI calls `received.getlist(...)` and feeds a Python `list` to Pydantic's `Json` validator, which expects a JSON `str` / `bytes`!
  - **Root Cause:** `is_sequence_field(field)` checks the unwrapped inner type (`list[str]`), mistaking a `Json[list[str]]` field for a repeated-form-key sequence rather than a single JSON string scalar.
  - **Canonical Fix:** Add `_is_json_field(field)` checking `any(type(item) is Json for item in field.field_info.metadata)` and guard the `getlist` sequence branch with `not _is_json_field(field)`.
- **`fastapi_15589`** — *Do not accept underscore headers when `convert_underscores=True`* (`fastapi/dependencies/utils.py`: `request_params_to_args`)
  - **Symptom & Trigger:** In a `Header()` Pydantic model (`extra="forbid"` or `"allow"`), declaring `foo_bar: str` with default `convert_underscores=True` converts incoming `foo-bar`, yet STILL leaves `foo_bar` unmarked in `processed_keys`, allowing a client sending raw `foo_bar` header to bypass rejection as an extra header or leak through!
  - **Root Cause:** `processed_keys.add(alias or ...)` only recorded the hyphenated wire name `foo-bar`, omitting `get_validation_alias(field)` (`foo_bar`).
  - **Canonical Fix:** Explicitly add `processed_keys.add(get_validation_alias(field))` alongside the converted header key in `processed_keys`.

---

### Category 2: Pydantic Compat, Validation & OpenAPI Schema (`14` bugs in FastAPI)

#### 2A. Pydantic v2 CoreSchema, Unions, `$ref` & Arbitrary Types (`10` bugs)
- **`fastapi_12942`** — *Fix tagged discriminated union not recognized as body field* (`fastapi/_compat.py`: `field_annotation_is_complex`)
  - **Symptom & Trigger:** Route parameter `Annotated[Union[ApplePie, BananaPie], Field(discriminator="fruit")]` without explicit `Body()` is misclassified as a query parameter (or fails assertion) instead of a JSON request body.
  - **Root Cause:** `field_annotation_is_complex` inspected `get_origin(annotation)` without unwrapping `typing.Annotated`, so `get_origin(Annotated[Union[...], ...])` returned `Annotated`, falling through complex-type detection.
  - **Canonical Fix:** Add early unwrapping: `if origin is Annotated: return field_annotation_is_complex(get_args(annotation)[0])`.
- **`fastapi_13207`** — *Fix OpenAPI schema for computed fields when `separate_input_output_schemas=False`* (`fastapi/_compat/v2.py`: `get_schema_from_model_field`, `get_definitions`)
  - **Symptom & Trigger:** Setting `separate_input_output_schemas=False` drops `@computed_field` properties from the generated OpenAPI schema.
  - **Root Cause:** `get_schema_from_model_field` passed `mode="validation"` whenever `separate_input_output_schemas` was `False`, and Pydantic v2 omits `@computed_field`s from validation-mode JSON schemas!
  - **Canonical Fix:** Inspect `core_schema` for `computed_fields`; if present (when generating shared schema), use `mode=None` (or `"serialization"` / split mode checks in `get_definitions`) instead of `"validation"`.
- **`fastapi_14246`** — *Fix separation of schemas with nested models introduced in 0.119.0* (`fastapi/_compat/v2.py`: `get_definitions`)
  - **Symptom & Trigger:** Nested Pydantic models inside top-level input/output models fail to split into `-Input` / `-Output` schemas or lose field-level separation after 0.119.0.
  - **Root Cause:** `get_definitions` flattened all fields together (`flat_models = get_flat_models_from_fields(fields, ...)`) and recreated `ModelField(..., mode="validation")` (default mode) without preserving each field's `"validation"` vs `"serialization"` mode!
  - **Canonical Fix:** Partition `fields` by `field.mode == "validation"` and `field.mode == "serialization"`, compute flat nested models per mode, and construct separate `flat_validation_model_fields` (`mode="validation"`) and `flat_serialization_model_fields` (`mode="serialization"`).
- **`fastapi_14297`** — *Fix optional sequence handling in serialize sequence value with Pydantic V2* (`fastapi/_compat/v2.py`: `copy_field_info` / `serialize_sequence_value` helpers)
  - **Symptom & Trigger:** `Optional[List[UploadFile]]` or `Optional[Sequence[...]]` raises `TypeError: issubclass() arg 1 must be a class` (or crashes Python 3.14) because `origin_type` is `typing.Union`.
  - **Root Cause:** Code checked `issubclass(origin_type, ...)` directly without unwrapping `Union[list[T], None]` into its non-`None` union member.
  - **Canonical Fix:** When `origin_type is Union`, iterate `get_args(...)`, skip `type(None)`, and re-extract `origin_type = get_origin(union_arg) or union_arg`.
- **`fastapi_14349`** — *Fix handling of JSON Schema attributes named `"$ref"`* (`fastapi/_compat/v2.py`: `_replace_refs`)
  - **Symptom & Trigger:** A Pydantic model defining an arbitrary field literally named `dollar_ref` / schema property `"$ref": {"type": "string", ...}` crashes `_replace_refs` with `AttributeError: 'dict' object has no attribute 'split'`.
  - **Root Cause:** `_replace_refs` assumed every key named `"$ref"` in a JSON Schema dict had a `str` value (`schema["$ref"].split("/")`), not a property-definition `dict` or other JSON schema object!
  - **Canonical Fix:** Guard `value = schema["$ref"]` with `if isinstance(value, str):` before splitting on `"/"` and remapping `REF_TEMPLATE`.
- **`fastapi_14361`** — *Avoid accessing non-existing `"$ref"` key for Pydantic v2 compat remapping* (`fastapi/_compat/v2.py`: `_remap_definitions_and_field_mappings`)
  - **Symptom & Trigger:** `KeyError: '$ref'` during OpenAPI generation when a field's generated schema in `field_mapping` is an inlined dict rather than a `$ref` pointer.
  - **Root Cause:** Code checked `if model not in model_name_map:` and immediately indexed `schema["$ref"]` without checking `"$ref" in schema`.
  - **Canonical Fix:** Change condition to `if model not in model_name_map or "$ref" not in schema:`.
- **`fastapi_14430`** — *Fix optional sequence handling with Python 3.10+ union syntax (`X | None`)* (`fastapi/_compat/v2.py`: `copy_field_info`)
  - **Symptom & Trigger:** Sequel to `14297`: writing `list[UploadFile] | None` (PEP 604 `types.UnionType`) still crashes with the exact same `TypeError`, while `Optional[List[UploadFile]]` (`typing.Union`) works!
  - **Root Cause:** `fastapi_14297` checked only `if origin_type is Union:`, forgetting that `get_origin(list[T] | None)` returns `types.UnionType`, not `typing.Union`.
  - **Canonical Fix:** Import `UnionType` from `fastapi.types` and check `if origin_type is Union or origin_type is UnionType:`.
- **`fastapi_14482`** — *Fix handling arbitrary types when using `arbitrary_types_allowed=True`* (`fastapi/_compat/v2.py`: `ModelField.config`, `ModelField.__post_init__`, `create_body_model`)
  - **Symptom & Trigger:** Models/dataclasses using `ConfigDict(arbitrary_types_allowed=True)` inside FastAPI body/param wrapper models raise `PydanticSchemaGenerationError` because FastAPI's internal `TypeAdapter(Annotated[...])` lacks the parent model's `config`.
  - **Root Cause:** `ModelField` constructed its `TypeAdapter` without accepting or forwarding `config=self.config`, and `create_body_model` did not propagate `model.model_config` onto child `ModelField` instances.
  - **Canonical Fix:** Add `config: Union[ConfigDict, None] = None` to `ModelField`, pass `config=self.config` to `TypeAdapter(...)`, and forward `model.model_config` when instantiating `ModelField`s in `create_body_model` / dataclass handling.
- **`fastapi_14512`** — *Fix support for tagged union with discriminator inside of `Annotated` with `Body()`* (`fastapi/_compat/v2.py`: `_Attrs`, `asdict`, `ModelField.__post_init__`)
  - **Symptom & Trigger:** `Annotated[Union[A, B], Field(discriminator="type"), Body()]` raises Pydantic schema error or fails discriminator lookup in Pydantic < 2.12.3.
  - **Root Cause:** `ModelField.__post_init__` passed `Annotated[self.field_info.annotation, *self.field_info.metadata, self.field_info]`. Because `self.field_info` itself still holds `.metadata` in Pydantic < 2.12.3, passing both `*metadata` and `self.field_info` duplicated metadata entries (breaking `Field(discriminator=...)`).
  - **Canonical Fix:** Implement Pydantic v2.12.3's `asdict(field_info)` shim extracting clean `attributes` via `_Attrs`, then pass `Field(**field_dict["attributes"])` so metadata is applied cleanly once.
- **`fastapi_14953`** — *Fix JSON Schema for `bytes`: use `"contentMediaType": "application/octet-stream"` instead of `"format": "binary"`* (`fastapi/_compat/v2.py`: custom `GenerateJsonSchema.bytes_schema`; `fastapi/datastructures.py`: `UploadFile._validate`)
  - **Symptom & Trigger:** OpenAPI 3.1 / JSON Schema 2020-12 alignment: `bytes` and `UploadFile` schemas emitted legacy OpenAPI 3.0 `"format": "binary"` instead of `"contentMediaType": "application/octet-stream"` (plus `"contentEncoding": "base64"` when `bytes_mode == "base64"`).
  - **Root Cause:** `UploadFile` hardcoded `"format": "binary"`, and Pydantic's default `GenerateJsonSchema.bytes_schema` emitted OpenAPI 3.0 formatting before upstream Pydantic #12841.
  - **Canonical Fix:** Subclass `_GenerateJsonSchema` in `_compat/v2.py` overriding `bytes_schema`, update `UploadFile` JSON schema dict in `datastructures.py`, and update `docs_src`/`scripts/playwright` snapshots.

#### 2B. OpenAPI Schema Generation & Swagger Docs Security (`3` bugs)
- **`fastapi_14463`** — *Fix OpenAPI duplication of `anyOf` refs for app-level `responses` with `content` and `Union` model* (`fastapi/openapi/utils.py`: `get_openapi_path`)
  - **Symptom & Trigger:** Defining app-level `responses={400: {"model": Union[A, B], "content": {"application/json": {"examples": ...}}}}` causes OpenAPI `anyOf` list items to duplicate on every route sharing that app-level response!
  - **Root Cause:** `process_response = additional_response.copy()` performed a *shallow* dict copy! The nested `["content"]["application/json"]` dict was mutated in-place across every route iteration, accumulating repeated `anyOf` `$ref` objects.
  - **Canonical Fix:** Replace `additional_response.copy()` with `copy.deepcopy(additional_response)`.
- **`fastapi_14791`** — *Update `ValidationError` schema to include `input` and `ctx`* (`fastapi/openapi/utils.py`: `validation_error_definition`)
  - **Symptom & Trigger:** Generated OpenAPI component schema for `ValidationError` only listed `loc`, `msg`, `type`—omitting `input` and `ctx` fields actually emitted at runtime by Pydantic v2!
  - **Root Cause:** Static `validation_error_definition` dict hadn't been updated from Pydantic v1's error shape to Pydantic v2's error dict shape.
  - **Canonical Fix:** Add `"input": {"title": "Input"}` and `"ctx": {"title": "Context", "type": "object"}` to `validation_error_definition["properties"]`. (Impacts **29** snapshot/schema test files!)
- **`fastapi_14986`** — *Refactor OpenAPI `root_path` handling and Swagger UI HTML escaping* (`fastapi/applications.py`: `openapi` endpoint; `fastapi/openapi/docs.py`: `_html_safe_json`, `get_swagger_ui_html`)
  - **Symptom & Trigger:** Two intertwined bugs: (1) Under untrusted `x-forwarded-*` / proxy `root_path`, `app.openapi()` inserted `{"url": root_path}` directly into `self.servers` in-place, polluting the cached app state and leaking/caching attacker headers across requests; (2) `get_swagger_ui_html` interpolated `json.dumps(...)` inside an inline `<script>` tag without escaping `<`, `>`, `&`, enabling `</script>` breakout XSS if OpenAPI/OAuth/init configs contain HTML-significant sequences.
  - **Root Cause:** Shared mutable `self.servers` list mutated on request + raw `json.dumps` inside `<script>`.
  - **Canonical Fix:** Clone shallow `schema = dict(schema)` and prepend `root_path` to a new `schema["servers"]` list without mutating `self.servers` or cached `self.openapi_schema`; add `_html_safe_json()` replacing `<`, `>`, `&` with `\u003c`, `\u003e`, `\u0026` in `get_swagger_ui_html`.

#### 2C. Python 3.14 / Pydantic v1 Compat (`1` bug)
- **`fastapi_14186`** — *Fix internal Pydantic v1 compatibility (warnings/errors) for Python 3.14 and Pydantic 2.12.1* (`fastapi/_compat/may_v1.py` + `fastapi/_compat/{__init__,main,shared,v1,v2}.py`, `dependencies/utils.py`, `encoders.py`, `temp_pydantic_v1_params.py`, `utils.py`)
  - **Symptom & Trigger:** Importing `fastapi` on Python 3.14 + Pydantic 2.12.1 crashes or triggers deprecation warnings/errors when Pydantic v1 shim runs on Python 3.14 (where `pydantic.v1` is broken/unsupported).
  - **Root Cause:** `fastapi/_compat/__init__.py` and other modules eagerly imported `.v1` unconditionally even on `sys.version_info >= (3, 14)`.
  - **Canonical Fix:** Introduce `fastapi/_compat/may_v1.py` which cleanly stubs out `BaseModel`, `ModelField`, `CoreSchema`, `Undefined`, etc. when `sys.version_info >= (3, 14)` and delegates to `.v1` on `< 3.14`; rewire all 10 source imports from `v1` to `may_v1`. *(Chronologically superseded later by `fastapi_14609` dropping `v1` altogether!)*

---

### Category 3: Security, Auth & Protocol Hardening (`7` bugs in FastAPI)

#### 3A. Auth Status Codes, Headers & OAuth2 Scope Tree (`6` bugs)
- **`fastapi_5624`** — *Fix hierarchical security scope propagation* (`fastapi/dependencies/utils.py`: `get_dependant`)
  - **Symptom & Trigger:** Sibling security dependencies leak scopes into one another (e.g., first `Security(dep1, scopes=["a"])` causes sibling `Security(dep2, scopes=["b"])` to inherit `"a"` too).
  - **Root Cause:** `use_security_scopes.extend(param_details.depends.scopes)` mutated the caller's `security_scopes` list *in-place* across sibling loop iterations!
  - **Canonical Fix:** Rebind a fresh list: `use_security_scopes = use_security_scopes + list(param_details.depends.scopes)`.
- **`fastapi_13786`** — *Use `401` status code in security classes when credentials are missing* (`fastapi/security/{api_key,http,oauth2,open_id_connect_url}.py` + 7 `docs_src/` files)
  - **Symptom & Trigger:** `APIKey*`, `HTTPBase`, `HTTPBearer`, `HTTPDigest`, `OAuth2*`, `OpenIdConnect` returned HTTP `403 Forbidden` (instead of RFC-compliant `401 Unauthorized` + `WWW-Authenticate` header where applicable) when authentication credentials were absent or invalid.
  - **Root Cause:** Historical FastAPI security classes imported `HTTP_403_FORBIDDEN` and raised `HTTPException(status_code=HTTP_403_FORBIDDEN)` directly instead of centralizing `make_not_authenticated_error()` returning `HTTP_401_UNAUTHORIZED`.
  - **Canonical Fix:** Replace `HTTP_403_FORBIDDEN` with `HTTP_401_UNAUTHORIZED` across all 4 security modules and add overridable `make_not_authenticated_error()` methods on `APIKeyBase`, `HTTPBase`, `OAuth2`, `OpenIdConnect` (and update `docs_src` + 17 test suites).
- **`fastapi_14266`** — *Fix security schemes in OpenAPI when added at the top level app* (`fastapi/dependencies/utils.py`: `get_dependant`)
  - **Symptom & Trigger:** Security dependencies (`SecurityBase` instances like `HTTPBearer`, `APIKeyHeader`) passed via top-level `FastAPI(dependencies=[Depends(auth)])` or parameterless `dependencies=[...]` execute at runtime yet are completely missing from OpenAPI `components.securitySchemes` and route `security`.
  - **Root Cause:** `get_dependant` only appended `SecurityRequirement(...)` for sub-parameters inside `param_details`, forgetting to check `isinstance(call, SecurityBase)` on the `Dependant`'s own `call`!
  - **Canonical Fix:** Check `if isinstance(call, SecurityBase):` inside `get_dependant` and append `SecurityRequirement(security_scheme=call, scopes=use_scopes)` directly to `dependant.security_requirements`.
- **`fastapi_14455`** — *Fix OpenAPI security scheme OAuth2 scopes declaration, deduplicate security schemes with different scopes* (`fastapi/openapi/utils.py`: `get_openapi_security_definitions`)
  - **Symptom & Trigger:** When two dependencies on one endpoint use the same OAuth2 scheme with different scopes (e.g., `["read"]` and `["write"]`), OpenAPI emits `security: [{"OAuth2": ["read"]}, {"OAuth2": ["write"]}]` (logical OR in OpenAPI!) instead of `[{"OAuth2": ["read", "write"]}]` (logical AND).
  - **Root Cause:** `get_openapi_security_definitions` built a list of separate dicts (`operation_security.append({security_name: scopes})`) rather than merging scopes keyed by `security_name`.
  - **Canonical Fix:** Accumulate scopes per `security_name` in `operation_security_dict: Dict[str, List[str]]` deduplicating scopes in order before emitting a single `{security_name: scopes}` requirement dict.
- **`fastapi_14459`** — *Fix OAuth2 scopes in OpenAPI in extra corner cases* (`fastapi/dependencies/models.py`, `fastapi/dependencies/utils.py`, `fastapi/openapi/utils.py`)
  - **Symptom & Trigger:** Parent dependency declares `Security(dep_with_sub_auth, scopes=["items:read"])`, where `dep_with_sub_auth` uses an unscoped `Security(oauth2_scheme)` — AND the same `oauth2_scheme` is reused without parent scopes elsewhere — causing OpenAPI to lose inherited scopes or bleed scopes across reuse.
  - **Root Cause:** Separate `SecurityRequirement` list cached flatly alongside `security_requirements.copy()` failed to track `parent_oauth_scopes` through `get_flat_dependant` and evaluate scopes dynamically per security dependency instance.
  - **Canonical Fix:** Remove `SecurityRequirement`; compute `Dependant._is_security_scheme`, `_security_scheme`, `_security_dependencies` via `_unwrapped_call` (`@cached_property`); thread `parent_oauth_scopes=flat_dependant.oauth_scopes` into `get_flat_dependant` recursion; update `get_openapi_security_definitions` to iterate `flat_dependant._security_dependencies`.
- **`fastapi_14786`** — *Strip whitespaces from `Authorization` header credentials* (`fastapi/security/utils.py`: `get_authorization_scheme_param`)
  - **Symptom & Trigger:** Headers like `Authorization: Bearer  token123 ` (multiple spaces or trailing spaces, allowed by RFC 6750 / real clients) return `" token123 "` with leading/trailing whitespace, breaking exact token comparisons.
  - **Root Cause:** `scheme, _, param = authorization_header_value.partition(" ")` only split on the *first* space, returning `param` unstripped.
  - **Canonical Fix:** Return `scheme, param.strip()`.

#### 3B. SSE Validation (`1` bug)
- **`fastapi_15588`** — *Validate Server Sent Event fields to avoid sending broken data* (`fastapi/sse.py`: `_check_single_line`, `_check_event_single_line`, `_check_id_valid`, `ServerSentEvent`)
  - **Symptom & Trigger:** Sending `ServerSentEvent(event="foo\nbar", ...)` or `id="123\r\n..."` injects raw CR/LF newlines into the SSE wire stream, corrupting framing or enabling arbitrary SSE frame/event injection!
  - **Root Cause:** `ServerSentEvent` only validated `_check_id_no_null` on `id` (`\0` check) and had zero single-line (`\r` / `\n`) validation on `event` or `id`.
  - **Canonical Fix:** Replace `_check_id_no_null` with `_check_single_line(v, field_name)` raising `ValueError` on `"\r" in v or "\n" in v`, attach `AfterValidator(_check_event_single_line)` to `event`, and call `_check_single_line(v, "id")` inside `_check_id_valid`.

---

### Category 4: Routing, Lifecycle, Streaming & Server Infra (`2` bugs in FastAPI)

#### 4A. Router Inclusion & Prefixless Routes (`1` bug)
- **`fastapi_15763`** — *Fix bug: allow empty path in path operation in prefixless router* (`fastapi/routing.py`: `APIRouter.include_router` / route validation)
  - **Symptom & Trigger:** Creating `APIRouter()` with no prefix and adding `@router.get("")` raises or mis-validates route paths when included into a parent router that supplies the prefix.
  - **Root Cause:** Recent refactor (`_iter_included_route_candidates(router.routes)`) read raw `r.path` before route context expansion rather than iterating `(route, route_context)` from `_iter_routes_with_context(router.routes)`.
  - **Canonical Fix:** Switch iteration to `_iter_routes_with_context(router.routes)` and resolve effective path/name from `route_context.starlette_route` when present.

#### 4B. Router Event Attribute Initialization Ordering (`1` bug)
- **`fastapi_14873`** — *Fix `on_startup` and `on_shutdown` parameters of `APIRouter`* (`fastapi/routing.py`: `APIRouter.__init__`)
  - **Symptom & Trigger:** Passing `FastAPI(on_startup=[fn])` or `APIRouter(on_shutdown=[fn])` silently drops startup/shutdown handlers (`app.router.on_startup == []`)!
  - **Root Cause:** Regression introduced by `fastapi_14851`: `APIRouter.__init__` assigned `self.on_startup` and `self.on_shutdown` *before* calling `super().__init__(...)`, which in Starlette overwritten them with `[]`!
  - **Canonical Fix:** Move `self.on_startup = ...` and `self.on_shutdown = ...` *after* `super().__init__(...)` inside `APIRouter.__init__`.

---

### Category 6: Terminal Unicode, Segments & Console I/O (`14` bugs in Rich)

#### 6A. Unicode Widths, Grapheme Splitting & Word Wrapping (`7` bugs)
- **`rich_3180`** — *Fix double-width characters disappearing when wrapping* (`rich/_wrap.py`: `words`, `divide_line`; `rich/cells.py`: `chop_cells`)
  - **Symptom & Trigger:** Wrapping long strings of CJK/double-width characters (`overflow="fold"` or table/panel wrapping) silently drops characters or produces mis-aligned columns.
  - **Root Cause:** Legacy `chop_cells(text, max_size, position=0)` / `divide_line` accumulated character cell positions asymmetrically or emitted empty/mis-indexed slices when a wide character crossed `max_size`, dropping the boundary wide character instead of breaking cleanly before it (and comments literally noted `# TODO: This might not work with CWJ type characters`).
  - **Canonical Fix:** Rewrite `divide_line` and `chop_cells(text, width)` around accurate running cell offsets per character using `cached_cell_len` / `cell_len`, flushing the current line *before* a character whose width exceeds remaining space.
- **`rich_3506`** — *Fix `Segment._split_cells` cut calculation* (`rich/segment.py`: `Segment._split_cells`)
  - **Symptom & Trigger:** `Segment.split_cells(cut)` loops or cuts at the wrong offset on mixed single- and double-width strings (discovered via Textual #4996).
  - **Root Cause:** Operator-precedence / paren typo in initial proportional estimate: `pos = int((cut / cell_length) * (len(text) - 1))` subtracted `1` inside `(len(text) - 1)` before scaling, instead of scaling `len(text)` first (`- 1`), skewing the starting index when `len(text)` was small or mixed-width.
  - **Canonical Fix:** Change initial `pos` formula to `int((cut / cell_length) * len(text)) - 1` clamped `>= 0` (refined further in `rich_3521`!).
- **`rich_3521`** — *`Segment.split_cells` fix for overshoot/bisect edge cases* (`rich/segment.py`: `Segment._split_cells`)
  - **Symptom & Trigger:** Even after `3506`, splitting a segment where double-width characters precede or straddle `cut` still misaligns or fails when the initial `pos` overestimates or steps past `cut`.
  - **Root Cause:** Linear forward-only `while pos < len(text):` search could not step *backward* if proportional guess `pos` exceeded `cut` or when splitting directly on the second cell of a double-width char (`out_by == -1 and cell_size(text[pos]) == 2`).
  - **Canonical Fix:** Start at `pos = int((cut / cell_length) * len(text))` and loop adjusting `pos` using signed error `out_by = cell_pos - cut` (handling both positive and negative overshoots and double-width boundary space substitution).
- **`rich_3535`** — *Fast-path regex range error & negative cut assertion* (`rich/cells.py`: `_is_single_cell_widths`; `rich/segment.py`: `Segment.split_cells`)
  - **Symptom & Trigger:** ASCII chars `~`, `DEL` and lowercase `'p'..'~'` (`U+0070`–`U+007E`), Latin-1 Supplement (`U+00A1`–`U+02FF`), and Box Drawing (`U+2500`–`U+25FF`) fell off the fast O(1) regex path into slow per-char lookup; additionally negative `cut` wasn't asserted in `split_cells`.
  - **Root Cause:** Character class typo in `_is_single_cell_widths`: `[\u0020-\u006f\u00a0\u02ff...]` stopped at `006f` (`'o'`, cutting off `'p'`–`'~'`) and wrote `\u00a0\u02ff` (two endpoints) instead of a range `\u00a0-\u02ff`!
  - **Canonical Fix:** Fix regex to `"^[\u0020-\u007e\u00a0-\u02ff\u0370-\u0482\u2500-\u25FF]*$"` and add `assert cut >= 0` in `Segment.split_cells`.
- **`rich_3944`** — *Fix fonts (Private Use Area width 0 vs 1)* (`rich/cells.py`: `get_character_cell_size`)
  - **Symptom & Trigger:** Nerd Font / Private Use Area icons (and missing glyphs after `rich_3930` refactor) measured `0` width instead of `1`, collapsing padding/borders in terminals.
  - **Root Cause:** Default fallback at the bottom of `get_character_cell_size` returned `0` when a codepoint wasn't found in the Unicode width table instead of `1`.
  - **Canonical Fix:** Change fallback return from `0` to `1`.
- **`rich_3953`** — *Fix ZWJ and control/binary-search edge cases* (`rich/cells.py`: `get_character_cell_size`, `_cell_len`)
  - **Symptom & Trigger:** Control characters (`<32`, `0x7F..0x9F`) returned wrong width `1`/`-1`, table lookups returning `-1` escaped when binary search returned raw width, and `_cell_len` used `iter(text)` incompatible with ZWJ lookahead/indexing.
  - **Root Cause:** In the `rich_3930` rewrite: (1) C0/C1 control guard checked inconsistently; (2) `while True:` with `upper_bound < lower_bound` could mis-handle `-1` widths; (3) `for character in iter_characters:` couldn't track index jumps for grapheme sequences cleanly.
  - **Canonical Fix:** Return `0` immediately for C0/C1 control codepoints, tighten `while lower_bound <= upper_bound:` with `(lower_bound + upper_bound) >> 1` and explicit table bounds (`table[-1][1]`), and rewrite `_cell_len` using integer `index` iteration.
- **`rich_4006`** — *Fix infinite loop in `split_graphemes`* (`rich/cells.py`: `split_graphemes`)
  - **Symptom & Trigger:** Strings starting with a Zero-Width Joiner (`\u200d`), ending with a ZWJ, or containing repeated ZWJ / variation selector sequences hang forever in `split_graphemes`.
  - **Root Cause:** Two boundary bugs: (1) when a ZWJ/variation selector appeared at index 0 (`not spans`), `index` never advanced past it; (2) when a trailing ZWJ appeared at `index == codepoint_count - 1` (`index += 2` without checking bounds or empty `spans`), loop/span invariance broke.
  - **Canonical Fix:** Handle leading ZWJ/VS (`if not spans: spans.append((index, index := index + 1, 0)); continue`), use `index += 2 if index < (codepoint_count - 1) else 1` when nothing remains to join, and update docstring contract returning `(spans, total_cell_length)`.

#### 6B. Console I/O, Env Flags, Broken Pipe & FileProxy (`7` bugs)
- **`rich_3468`** — *Handle `BrokenPipeError` cleanly on console flush* (`rich/console.py`: `Console.on_broken_pipe`, `Console._check_buffer`)
  - **Symptom & Trigger:** Piping Rich CLI output to `head` / closed pager raises an unhandled `BrokenPipeError` (or crashes loudly on exit) instead of shutting output down gracefully.
  - **Root Cause:** `Console._check_buffer` called `self._write_buffer()` unguarded without catching `BrokenPipeError`.
  - **Canonical Fix:** Wrap `self._write_buffer()` in `try ... except BrokenPipeError: self.on_broken_pipe()`; implement default `on_broken_pipe(self)` setting `self.quiet = True`, redirecting `stdout` fd to `os.devnull`, and raising `SystemExit(1)`.
- **`rich_3470`** — *Fix `Console.record` and `Console.capture()` double-recording* (`rich/console.py`: `Console._write_buffer`)
  - **Symptom & Trigger:** Nesting `with console.capture():` inside a `Console(record=True)` session causes printed text to appear *twice* in `console.export_text()` / record buffer!
  - **Root Cause:** `_write_buffer` checked `if self.record:`, appending segments to `self._record_buffer` even when inside an outer buffering/capture block (`self._buffer_index > 0`), and then appended again when the outer block exited (`_buffer_index == 0`).
  - **Canonical Fix:** Guard recording with `if self.record and not self._buffer_index:`.
- **`rich_3905`** — *Don't output extraneous blank line when `Progress(disable=True)` stops/starts* (`rich/progress.py`: `Progress.start` / stop handling)
  - **Symptom & Trigger:** Running `with Progress(disable=True):` in non-interactive/CI stdout prints an unwanted blank newline anyway!
  - **Root Cause:** `Progress` unconditionally called `self.live.stop()` and `self.console.print()` on teardown/start paths without checking `if not self.disable:`.
  - **Canonical Fix:** Guard `self.live.stop()` and trailing `self.console.print()` with `if not self.disable:`.
- **`rich_3934`** — *Fix empty `Live` display erasing previous terminal line on `stop()`* (`rich/live.py`: `Live.stop`; `rich/live_render.py`: `LiveRender.last_render_height`)
  - **Symptom & Trigger:** Starting and stopping `Live("")` or an empty renderable without printing anything emits ANSI cursor-up / clear sequences in a terminal, erasing the line printed *before* `Live` started!
  - **Root Cause:** `Live.stop()` checked `if not self._alt_screen and self.console.is_terminal:` without checking whether `LiveRender` had actually rendered >= 1 line (`_shape is None` or height 0).
  - **Canonical Fix:** Expose `last_render_height` property on `LiveRender` (returning `0` if `self._shape is None` else `self._shape[1]`) and require `and self._live_render.last_render_height` in `Live.stop()`.
- **`rich_3938`** — *Fix background style bleeding on soft-wrapped lines* (`rich/console.py`: `Console.print`; `rich/segment.py`: `Segment.split_lines_terminator`)
  - **Symptom & Trigger:** `console.print(..., style="on red")` on multi-line content extends background color across trailing newlines or into subsequent terminal lines after soft wrap!
  - **Root Cause:** `Segment.apply_style(render(...), render_style)` applied background styling directly onto `Segment("\n")` line terminators! Because `\n` carried the background ANSI codes, terminals filled the rest of the line / next line with background color before resetting.
  - **Canonical Fix:** Add `Segment.split_lines_terminator()` yielding `(line_segments, has_newline)` and apply `render_style` only to `line` before appending an unstyled `Segment.line()`.
- **`rich_4075`** — *Preserve custom `end` when printing empty `Console.print()`* (`rich/console.py`: `Console.print`)
  - **Symptom & Trigger:** Calling `console.print(end="")` or `console.print(end="foo")` with no positional objects ignores `end` and prints a `\n` newline (`NewLine()`)!
  - **Root Cause:** When `not objects:`, `Console.print` hardcoded `objects = (NewLine(),)` instead of checking `if end == "\n":`.
  - **Canonical Fix:** Use `if end == "\n": objects = (NewLine(),) else: objects = ("",)` so `end` is printed verbatim without forcing an unwanted newline.
- **`rich_4077`** — *Add `isatty()` delegation to `FileProxy`* (`rich/file_proxy.py`: `FileProxy.isatty`)
  - **Symptom & Trigger:** Third-party code (or `sys.stdout.isatty()`) checking TTY status while stdout/stderr is wrapped by Rich's `FileProxy` raises `AttributeError` or falls through unexpectedly.
  - **Root Cause:** `FileProxy` proxied `write`/`flush`/`fileno` (or `__getattr__`) inconsistently without defining an explicit `isatty(self) -> bool` delegating to `self.__file.isatty()`.
  - **Canonical Fix:** Define `def isatty(self) -> bool: return self.__file.isatty()` on `FileProxy`.

---

### Category 7: Markup, ANSI, Styling & Export (`13` bugs in Rich)

#### 7A. ANSI/Markup Escaping, Control Codes, URLs & HTML Export (`9` bugs)
- **`rich_3043`** — *Fix the HTML export template (`<html>` placement)* (`rich/_export_format.py`: `CONSOLE_HTML_FORMAT`)
  - **Symptom & Trigger:** `console.export_html()` produces malformed HTML with `<head>...</head>` *outside* `<html>` (`<!DOCTYPE html><head>...</head><html><body>`).
  - **Root Cause:** Typo in `CONSOLE_HTML_FORMAT`: `<html>` line was placed right before `<body>` instead of right after `<!DOCTYPE html>`.
  - **Canonical Fix:** Move `<html>` immediately below `<!DOCTYPE html>`.
- **`rich_3063`** — *Fix escaping trailing backslash in `rich.markup.escape`* (`rich/markup.py`: `escape`)
  - **Symptom & Trigger:** Calling `escape("foo\\")` produces `"foo\\"` rather than `"foo\\\\"`, so embedding it inside `[tag]{escaped}[/tag]` escapes the closing/next markup sequence!
  - **Root Cause:** The internal regex `_escape(escape_backslashes, markup)` matched only backslashes immediately preceding `[` (`(\\*)(\[)`), leaving any odd trailing `\` at EOF untouched.
  - **Canonical Fix:** Check `if markup.endswith("\\") and not markup.endswith("\\\\"): return markup + "\\"` after `_escape(...)`.
- **`rich_3067`** — *Allow tilde (`~`) in URL regex* (`rich/highlighter.py`: `ReprHighlighter.highlights`)
  - **Symptom & Trigger:** URLs containing `~` (e.g. academic homepages `/~user/`) are truncated before the `~` when highlighted.
  - **Root Cause:** Character class in `ReprHighlighter` URL pattern `[-0-9a-zA-Z$_+!`(),.?/;:&=%#]*` omitted `~`.
  - **Canonical Fix:** Append `~` inside the URL regex character class.
- **`rich_3105`** — *Fix HTML `<pre><code>` monospace font inheritance* (`rich/_export_format.py`: `CONSOLE_HTML_FORMAT`)
  - **Symptom & Trigger:** Browser CSS rules targeting `code` (e.g. GitHub/Docs stylesheets) override `<pre style="font-family:Menlo,..."><code>` and render Rich HTML exports in the wrong font/size.
  - **Root Cause:** `<pre>` carried inline `font-family:...`, but inner `<code>` did not specify `style="font-family:inherit"`.
  - **Canonical Fix:** Update `<code>` in `CONSOLE_HTML_FORMAT` to `<code style="font-family:inherit">`.
- **`rich_3278`** — *Strip problematic private escape sequences in ANSI decoder* (`rich/ansi.py`: ANSI regex pattern)
  - **Symptom & Trigger:** Terminal logs containing private DEC/CSI sequences like `\x1b=`, `\x1b>`, or `\x1b<` leave stray unstripped ESC or printable sequence artifacts in `Text.from_ansi()`.
  - **Root Cause:** `re_ansi` matched CSI (`\x1b[...`) and OSC (`\x1b]...`) but lacked a branch for 2-byte ESC sequences in `\x1b[0-?]`.
  - **Canonical Fix:** Add `(?:\x1b[0-?])|` to the ANSI tokenization regex in `rich/ansi.py`.
- **`rich_3454`** — *Allow `@` in `ReprHighlighter` URL regex* (`rich/highlighter.py`: `ReprHighlighter.highlights`)
  - **Symptom & Trigger:** URLs containing `@` (userinfo `https://user@host` or scoped npm/Mastodon URLs like `/@handle`) stop highlighting right before `@`.
  - **Root Cause:** `@` was omitted from the `ReprHighlighter` URL character class (even after `3067` added `~`).
  - **Canonical Fix:** Append `@` inside the URL regex character class: `[...%#~@]*`.
- **`rich_3471`** — *Fixed exception in `Text.append_tokens` when tokens contain control codes* (`rich/text.py`: `Text.append_tokens`)
  - **Symptom & Trigger:** Passing strings containing `\r`, bell, or backspace control characters into `Text.append_tokens([(text, style)])` leaves unstripped control codes in `self._text` / spans, causing index mismatches or rendering exceptions later!
  - **Root Cause:** Unlike `Text.append()`, `Text.append_tokens()` pushed raw `content` directly into `_text` without calling `strip_control_codes(content)`.
  - **Canonical Fix:** Strip control codes via `content = strip_control_codes(content)` inside `append_tokens`.
- **`rich_3480`** — *Fix infinite loop when calling `text.append(text)` or `text.append_text(text)` on self* (`rich/text.py`: `Text.append`, `Text.append_text`)
  - **Symptom & Trigger:** Calling `t.append(t)` or `t.append_text(t)` appends new spans to `self._spans` *while iterating over `text._spans`*, creating an infinite loop and OOM!
  - **Root Cause:** `text._spans` and `self._spans` alias the exact same list when `text is self`, so iterating `for start, end, style in text._spans:` mutates the iterated list indefinitely.
  - **Canonical Fix:** Iterate over a shallow copy: `for start, end, style in text._spans.copy():` in both `append` and `append_text`.
- **`rich_4076`** — *Preserve trailing empty newlines in `AnsiDecoder.decode`* (`rich/ansi.py`: `AnsiDecoder.decode`)
  - **Symptom & Trigger:** Calling `AnsiDecoder().decode("foo\n")` drops the final empty line after trailing `\n` compared to interactive line emission.
  - **Root Cause:** `str.splitlines()` drops a trailing empty element after a final `\n` (`"foo\n".splitlines() == ["foo"]`).
  - **Canonical Fix:** Split using `re.split(r"(?<=\n)", terminal_text)` and yield `self.decode_line(line.rstrip("\n"))`, preserving every `\n`-delimited line boundary including trailing newline!

#### 7B. Style Hash Cache, Tab Spans & Syntax Padding/BG (`4` bugs)
- **`rich_2943`** — *Clear hashed cache when clearing style meta* (`rich/style.py`: `Style.clear_meta_and_links`)
  - **Symptom & Trigger:** Two `Style` objects that are equal after `.clear_meta_and_links()` produce *different* `hash(style)` values (breaking dict/set lookup contracts `a == b => hash(a) == hash(b)`).
  - **Root Cause:** `clear_meta_and_links()` copied `style._hash = self._hash` onto the stripped `Style` even though `_meta` contributes to `_hash`!
  - **Canonical Fix:** Set `style._hash = None` so `_hash` recomputes lazily from the cleared instance.
- **`rich_3061`** — *Extend tabs with styles and align `tab_size` defaults* (`rich/text.py`: `Span.extend`, `Text.expand_tabs`, `tab_size=None`)
  - **Symptom & Trigger:** `Text.expand_tabs()` inserts spaces for `\t`, leaving gaps in active `Span` highlights / styles over or after tabs; default `tab_size=8` also ignored `console.tab_size`.
  - **Root Cause:** `Span` had `right_crop()`/`split()`/`move()` helpers but lacked `extend(cells)` to stretch spans overlapping expanded tabs (and downstream offsets weren't shifted properly when expanding tabs), while `Text.__init__`/`from_ansi` defaulted `tab_size=8` instead of `None`.
  - **Canonical Fix:** Add `Span.extend(cells)`, adjust overlapping/subsequent spans in `Text.expand_tabs`, and change `tab_size` defaults to `None` to inherit `console.tab_size`.
- **`rich_3296`** — *Include padding when `Syntax` has background color override* (`rich/syntax.py`: `Syntax.__rich_console__`)
  - **Symptom & Trigger:** Using `Syntax(..., background_color="red", padding=2)` colors code lines `"red"` while the surrounding padding still renders in the underlying syntax theme's background color!
  - **Root Cause:** `__rich_console__` wrapped output in `Padding(segments, style=self._theme.get_background_style(), pad=self.padding)`, bypassing `self._get_base_style()` which incorporates `self.background_color`.
  - **Canonical Fix:** Pass `style=self._get_base_style()` to `Padding(...)`.
- **`rich_3782`** — *Unpack `Syntax.padding` via descriptor when reassigned after construction* (`rich/syntax.py`: `PaddingProperty`, `Syntax.padding`, `Syntax.__init__`)
  - **Symptom & Trigger:** Setting `syntax.padding = 2` (an `int` or 2-tuple) *after* `Syntax(...)` construction stores raw `2` directly in `self.padding`, crashing `__rich_console__` with `TypeError` when `Padding.unpack` is skipped!
  - **Root Cause:** `Syntax.__init__` stored `self.padding = padding` directly and only unpacked when passing to `Padding(...)` or didn't unpack dynamically on attribute mutation (and docstring indent bugs existed too).
  - **Canonical Fix:** Introduce `PaddingProperty` descriptor storing unpacked 4-tuples in `self._padding` via `Padding.unpack(padding)` on both initialization and property assignment (`syntax.padding = ...`).

---

### Category 8: Renderables, Tracebacks, Inspect & Prompts (`13` bugs in Rich)

#### 8A. Markdown, Table & Panel Layout/Styling (`8` bugs)
- **`rich_2725`** — *Fix table rendering order of box elements* (`rich/table.py`: `Table._render`)
  - **Symptom & Trigger:** Box element tuple sequence in `Table._render` placed bottom/footer segments before middle divider segments, breaking structural box element ordering checks/tests.
  - **Root Cause:** In `Table._render`, the tuple `(_box.foot_left, _box.foot_right, _box.foot_vertical)` accidentally preceded `(_box.mid_left, _box.mid_right, _box.mid_vertical)`.
  - **Canonical Fix:** Reorder the tuple list so `(mid_left, mid_right, mid_vertical)` precedes `(foot_left, foot_right, foot_vertical)`.
- **`rich_3064`** — *Fix crash on Markdown tables without header or body* (`rich/markdown.py`: `TableElement.__rich_console__`)
  - **Symptom & Trigger:** Malformed or minimal Markdown tables with missing `header` or `body` raise `AssertionError`.
  - **Root Cause:** `TableElement.__rich_console__` wrote hard `assert self.header is not None` and `assert self.body is not None`.
  - **Canonical Fix:** Replace `assert` statements with defensive `if self.header is not None and self.header.row is not None:` / `if self.body is not None:` conditionals.
- **`rich_3130`** — *Fix Markdown table cell dropping inline styles and links* (`rich/markdown.py`: `TableDataElement`)
  - **Symptom & Trigger:** Markdown table cells containing bold/italic/links (`[link](url)`, `**bold**`) lose formatting or render raw/garbled; plus a silent string-concat bug `token.attrs.get("style" "")` looked up key `"style"` only by accident (actually `"style" ""` == `"style"` in Python literal concatenation, a latent bug!).
  - **Root Cause:** `TableDataElement` reconstructed a new `Text(plain, ...)` using `self.content.plain` instead of accumulating stylized `Text` spans directly (`self.content: Text = Text("", justify=justify)`).
  - **Canonical Fix:** Fix `token.attrs.get("style")` and make `TableDataElement.content` a `Text` object appending inline tokens cleanly instead of flattening `.plain`. *(Which in turn surfaced the later subtle style-bleed bug fixed in `rich_4079`!)*
- **`rich_3469`** — *Fix superfluous blank space/newline on Markdown inline elements* (`rich/markdown.py`: `Markdown.__rich_console__`)
  - **Symptom & Trigger:** Rendering inline Markdown nodes emits an unintended extra newline (`new_line`).
  - **Root Cause:** `if new_line:` yielded separating newlines between elements without excluding `node_type == "inline"`.
  - **Canonical Fix:** Guard with `if new_line and node_type != "inline":`.
- **`rich_3518`** — *Propagate `Table.highlight` onto columns auto-created by `add_row`* (`rich/table.py`: `Table.add_row` / `add_cell`)
  - **Symptom & Trigger:** `Table(highlight=True)` without prior `table.add_column()` creates columns dynamically during `add_row()`, and none of those cells get syntax/repr highlighting!
  - **Root Cause:** Auto-created columns instantiated `Column(_index=index)` without passing `highlight=self.highlight`.
  - **Canonical Fix:** Change to `Column(_index=index, highlight=self.highlight)`.
- **`rich_3718`** — *Fix `Panel` title and subtitle missing panel background style* (`rich/panel.py`: `Panel.__rich_console__` -> `align_text`)
  - **Symptom & Trigger:** `Panel(..., style="on blue")` leaves title/subtitle text without the panel's background style (using only `border_style`).
  - **Root Cause:** Commit `7a38204` split `partial_border_style = console.get_style(self.border_style)` and styled `title_text` / `subtitle_text` with `partial_border_style` instead of combined `border_style = style + console.get_style(self.border_style)`.
  - **Canonical Fix:** Compute `border_style = style + console.get_style(self.border_style)` and call `stylize_before(border_style)` for both title and subtitle.
- **`rich_3935`** — *Fix `Table(collapse_padding=True)` column padding calculation* (`rich/table.py`: `Table._get_padding_width` / `get_padding`)
  - **Symptom & Trigger:** Tables/Columns with `collapse_padding=True` (and `pad_edge=False` / asymmetric `(top, right, bottom, left)` padding) compute wrong `pad_left` / `pad_right`, misaligning columns or clipped widths.
  - **Root Cause:** `get_padding` used `if column_index > 0: pad_left = max(0, pad_left - pad_right)`, corrupting symmetric/asymmetric collapsed padding between adjacent columns and failing to zero out `pad_edge=False` edges consistently.
  - **Canonical Fix:** On collapsed columns set `pad_left = 0` and `pad_right = abs(pad_left - pad_right)` (from original padding values), and cleanly enforce `pad_left = 0` on first column / `pad_right = 0` on last column when `not self.pad_edge`.
- **`rich_4079`** — *Fix inline table code / string style bleed in Markdown* (`rich/markdown.py`: `TableDataElement.on_text`)
  - **Symptom & Trigger:** After `rich_3130`, adding raw `str` text inside a `TableDataElement` wrapped it in `Text(text)` and called `text.stylize(context.current_style)`, leaking/re-applying context style or mutating `Text` differently from `self.content.append(text, context.current_style)`.
  - **Root Cause:** Wrapping `str` as `Text(text)` then `.stylize(context.current_style)` before `append_text` instead of letting `self.content.append(text, context.current_style)` span just that slice cleanly.
  - **Canonical Fix:** If `isinstance(text, str): self.content.append(text, context.current_style)` else `self.content.append_text(text)`.

#### 8B. Tracebacks, Pretty/Repr, Inspect & Prompts (`5` bugs)
- **`rich_3006`** — *Use identity (`is`) instead of equality (`==`) against `inspect.Parameter.empty` in `rich.repr`* (`rich/repr.py`: `auto_rich_repr`)
  - **Symptom & Trigger:** Custom classes whose `__eq__` raises or returns a non-boolean object (e.g., NumPy arrays, SQLAlchemy Column expressions) crash `rich.repr.auto` / `Console.print` when used as a default argument!
  - **Root Cause:** Checked `if param.default == param.empty:` (invoking `default.__eq__`) instead of identity `is`.
  - **Canonical Fix:** Replace `==` with `is`: `if param.default is param.empty:`.
- **`rich_3472`** — *Guard missing/uninitialized attributes on dataclass instances in `rich.pretty`* (`rich/pretty.py`: `pretty_repr` / `iter_attrs`)
  - **Symptom & Trigger:** Inspecting or pretty-printing a dataclass whose `init=False` field (or partially initialized object via `__new__`) hasn't been assigned yet raises `AttributeError`.
  - **Root Cause:** `iter_attrs()` yielded every `field` in `dataclasses.fields(obj)` with `field.repr` without verifying `hasattr(obj, field.name)`.
  - **Canonical Fix:** Filter with `if field.repr and hasattr(obj, field.name)`.
- **`rich_3772`** — *Prevent infinite recursion on cyclic exception groups / causes in `rich.traceback`* (`rich/traceback.py`: `Traceback.extract`)
  - **Symptom & Trigger:** `ExceptionGroup` containing shared/cyclic references or circular `__cause__` / `__context__` chains recurses infinitely in `Traceback.extract()` until `RecursionError`.
  - **Root Cause:** `extract()` recursively called `extract(type(exc), exc, ...)` on `BaseExceptionGroup.exceptions` without maintaining a visited set `_visited_exceptions`.
  - **Canonical Fix:** Thread `_visited_exceptions: Optional[Set[BaseException]] = None` through recursive `extract()` calls, skipping exceptions already in `grouped_exceptions`.
- **`rich_3882`** — *Enable markup rendering on `Prompt` validation errors* (`rich/prompt.py`: `PromptBase.on_validate_error`)
  - **Symptom & Trigger:** Prompt `InvalidResponse("[red]Invalid input[/red]")` prints literal `[red]...[/red]` brackets to user instead of styled text when markup wasn't enabled on that console print!
  - **Root Cause:** `self.console.print(error)` relied on console defaults instead of explicitly enabling markup (`markup=True`) for `PromptError`/`InvalidResponse` messages.
  - **Canonical Fix:** Pass `markup=True` to `self.console.print(error, markup=True)`.
- **`rich_3894`** — *Handle non-string `__qualname__` in `rich.inspect`* (`rich/_inspect.py`: `_get_signature`)
  - **Symptom & Trigger:** Inspecting proxy/mock/C-extension objects whose `__qualname__` is a custom descriptor, mock object, or `None` (not `str`) crashes `_get_signature`.
  - **Root Cause:** `_get_signature` assumed `getattr(obj, "__qualname__", ...)` is always a `str` before string operations / `Text` formatting.
  - **Canonical Fix:** Check `if not isinstance(qualname, str):`, fall back to `getattr(obj, "__name__", name)`, and if still not `str`, fall back to `name`.

---

### Category 9: HTTP Client Proxies, URLs, Auth & Headers (`12` bugs in Requests)

#### 9A. Protocol Proxies, Pickle MRO & `urllib3` Compat (`5` bugs)
- **`requests_6629`** — *Fix `requests.exceptions.JSONDecodeError` pickling via MRO* (`src/requests/exceptions.py`: `JSONDecodeError.__reduce__`)
  - **Symptom & Trigger:** Sending a `requests.exceptions.JSONDecodeError` across `multiprocessing` / `pickle.loads(pickle.dumps(err))` fails with `TypeError` because `__init__` expects JSON decode args `(msg, doc, pos)` whereas unpickling invokes single-arg `IOError`.
  - **Root Cause:** `requests.exceptions.JSONDecodeError` inherits from both `InvalidJSONError` (`IOError` subclass) and `CompatJSONDecodeError` (`json`/`simplejson`). Python's C3 MRO resolves `IOError.__reduce__` before `CompatJSONDecodeError.__reduce__`!
  - **Canonical Fix:** Explicitly define `def __reduce__(self): return CompatJSONDecodeError.__reduce__(self)` on `JSONDecodeError`.
- **`requests_6757`** — *Maintain `urllib3` 1.26.x string-encoding `Content-Length` compatibility* (`src/requests/compat.py`: `is_urllib3_1`; `src/requests/utils.py`: `super_len`)
  - **Symptom & Trigger:** After `requests_6589` encoded `str` bodies as UTF-8 inside `super_len()`, environments pinned to `urllib3` 1.26.x (where `http.client` encodes `str` as `latin-1`) compute the wrong `Content-Length` header for non-ASCII `str` bodies and hang/corrupt requests!
  - **Root Cause:** `super_len()` unconditionally encoded `str` as UTF-8 regardless of whether `urllib3` 1.x or 2.x was installed.
  - **Canonical Fix:** Parse `urllib3.__version__` in `compat.py` to expose boolean `is_urllib3_1`, and gate UTF-8 encoding in `super_len()` on `if not is_urllib3_1 and isinstance(o, str):`.
- **`requests_7433`** — *Fix `prepare_body` stream detection for `__getattr__`-based file wrappers* (`src/requests/models.py`: `PreparedRequest.prepare_body`)
  - **Symptom & Trigger:** Passing a file wrapper that delegates methods via `__getattr__` (like `tempfile.SpooledTemporaryFile` or custom proxy without explicit `__iter__` in its class dict) fails stream upload because `isinstance(data, Iterable)` returns `False`!
  - **Root Cause:** `collections.abc.Iterable` `__subclasshook__` uses `"__iter__" in B.__dict__` on the *class*, completely ignoring dynamic `__getattr__` delegation on instances!
  - **Canonical Fix:** Check `is_iterable = isinstance(data, Iterable) or hasattr(data, "__iter__")` before excluding `(str, bytes, list, tuple, Mapping)`.
- **`requests_7502`** — *Fix `_encode_files` detection for `__getattr__`-based file wrappers* (`src/requests/models.py`: `_encode_files`)
  - **Symptom & Trigger:** Multipart file upload wrapping a proxied file-like object (via `__getattr__`) fails to call `.read()` and raises/serializes wrong body because `isinstance(fp, _SupportsRead)` checks runtime `Protocol` attributes too strictly.
  - **Root Cause:** `@runtime_checkable Protocol` `isinstance()` checks `getattr_static` on the class hierarchy, bypassing instance `__getattr__` proxies!
  - **Canonical Fix:** Guard condition with `isinstance(fp, _SupportsRead) or hasattr(fp, "read")`.
- **`requests_7505`** — *Centralize `has_read` check for remaining `_SupportsRead` protocol `isinstance` calls* (`src/requests/_types.py`: `has_read`; `src/requests/models.py`: `_encode_params`, `_encode_files`, `prepare_body`)
  - **Symptom & Trigger:** Sequel to `7502`: two other callsites (`_encode_params` and `prepare_body`) still used `isinstance(..., _SupportsRead)`, breaking `__getattr__` proxies there too!
  - **Root Cause:** Incomplete fix in `7502` left duplicated `isinstance(..., _SupportsRead)` calls unswept across `models.py`.
  - **Canonical Fix:** Define `has_read(obj) -> TypeIs[SupportsRead[str | bytes]]` in `src/requests/_types.py` and replace all 3 callsites in `models.py` with `_t.has_read(...)`.

#### 9B. URL Paths, Redirects, `no_proxy`, Netrc & Headers (`7` bugs)
- **`requests_6589`** — *Count UTF-8 encoded byte length for `str` in `super_len`* (`src/requests/utils.py`: `super_len`)
  - **Symptom & Trigger:** Passing a multi-byte Unicode `str` as `data="héllo"` computes `len(o)` = character count rather than byte count, sending a truncated `Content-Length` header!
  - **Root Cause:** `super_len` fell through to `len(o)` on `str` objects without encoding to bytes first.
  - **Canonical Fix:** Encode `if isinstance(o, str): o = o.encode("utf-8")` before measuring length *(later refined by `requests_6757` for `urllib3` 1.x!)*.
- **`requests_6644`** — *Trim excess leading path separators before passing to `urllib3`* (`src/requests/adapters.py`: `HTTPAdapter.request_url`)
  - **Symptom & Trigger:** Requesting URL with double leading path slashes (e.g. `http://host//foo`) causes older `urllib3` `ConnectionPool.urlopen` to misparse `//foo` as a scheme-relative absolute URI rather than path!
  - **Root Cause:** `request_url` forwarded `url` starting with `//` verbatim to `urllib3`.
  - **Canonical Fix:** Strip redundant leading slashes: `if url.startswith("//"): url = f"/{url.lstrip('/')}"`. *(Important historical note: intentionally reverted two years later in `requests_7315`!)*
- **`requests_7205`** — *Fix empty `.netrc` entry usage on Python 3.11+* (`src/requests/utils.py`: `get_netrc_auth`)
  - **Symptom & Trigger:** Empty `default` / machine entries in `~/.netrc` on Python 3.11+ silently attach blank `Basic` credentials (`Authorization: Basic Og==` = `":"`) to outbound HTTP requests!
  - **Root Cause:** Python `<3.11` raised `NetrcParseError` on empty netrc entries; Python `3.11+` returns a truthy 3-tuple `("", "", "")`, so `if _netrc:` evaluated to `True`!
  - **Canonical Fix:** Change check to `if _netrc and any(_netrc):`.
- **`requests_7309`** — *Skip malformed Content-Type parameters lacking `=`* (`src/requests/utils.py`: `_parse_content_type_header` / `get_encodings_from_content` docstring/helper)
  - **Symptom & Trigger:** Header `text/html; foo` (without `=`) stored `{ "foo": True }` in parsed parameters dict per old logic instead of ignoring valueless malformed parameters per RFC 9110.
  - **Root Cause:** Parser pre-assigned `key, value = param, True` whenever `"="` was missing rather than skipping parameters lacking `"="`.
  - **Canonical Fix:** Only extract `key, value` when `(idx := param.find("=")) != -1`, skipping valueless tokens completely.
- **`requests_7315`** — *Preserve leading slashes in `request_url` for S3 presigned URLs* (`src/requests/adapters.py`: `HTTPAdapter.request_url`)
  - **Symptom & Trigger:** S3 presigned URLs pointing to keys starting with `/` (`https://bucket.s3.amazonaws.com//key_name`) fail signature verification (`403 SignatureDoesNotMatch`) because Requests rewrites `//key_name` to `/key_name`!
  - **Root Cause:** The earlier `requests_6644` workaround (`if url.startswith("//"): url = f"/{url.lstrip('/')}"`) mangled legitimate double-slash object paths required by modern HTTP/S3 signing.
  - **Canonical Fix:** Delete those exact 2 lines from `HTTPAdapter.request_url`.
- **`requests_7328`** — *Prevent `Response` self-reference in redirect `history`* (`src/requests/sessions.py`: `SessionRedirectMixin.resolve_redirects`)
  - **Symptom & Trigger:** Intermediate yielded/inspected `Response` objects inside `resolve_redirects` contain an extra shifted slice (`hist[1:]`) or reference themselves/original request inconsistently when yielding mid-chain or raising on errors.
  - **Root Cause:** `resp.history = hist[1:]` inside the loop relied on `hist` mutation order and self-tracking rather than copying `hist[:]` before appending `resp`.
  - **Canonical Fix:** Replace `resp.history = hist[1:]` with `resp.history = hist[:]` *(note: exact placement relative to `hist.append` determines original response inclusion/exclusion cleanly without self-reference)*.
- **`requests_7427`** — *Constrain `no_proxy` matching to domain boundaries (port of CPython bpo-39057)* (`src/requests/utils.py`: `should_bypass_proxies` / `get_proxy`)
  - **Symptom & Trigger:** Setting `NO_PROXY=example.com` wrongly bypasses proxies for an unrelated domain `badexample.com` (suffix match without dot boundary)!
  - **Root Cause:** Naive suffix/endswith check matched `hostname.endswith(host)` after stripping `.`, missing the leading `"."` domain separator check once exact equality failed.
  - **Canonical Fix:** Strip leading `"."` from `host`; first return `True` if `hostname == host or host_with_port == host`; otherwise normalize `host = "." + host` before suffix matching (`endswith`).

---

## 5. Complete Technical Breakdown of All 39 Non-Bug Tasks

While **90 / 129 (69.8%)** tasks fix defects, the remaining **39 / 129 (30.2%)** require implementing new public/internal APIs, refactoring architecture without regressions, emitting/removing deprecations, updating tutorial docs, or scripting release automation.

### 5.1 Intent `I2`: New Features & Developer Experience (`23` Tasks)

| `instance_id` | Category | Primary Files & Symbols | Architectural Scope & Implementation Trap |
| :--- | :---: | :--- | :--- |
| **`fastapi_5077`** | 1A | `fastapi/dependencies/utils.py`: `get_flat_params`, `get_typed_annotation` | Resolve `globalns = getattr(inspect.unwrap(call), "__globals__", {})` on `@functools.wraps()` endpoints/deps with forward refs. |
| **`fastapi_9425`** | 1A | `fastapi/dependencies/utils.py`: `get_typed_annotation` | Handle stringified/evaluated `type(None)` return type annotation as `None` (supporting `204` bodiless routes). |
| **`fastapi_13920`** | 1A | `fastapi/dependencies/utils.py`: `analyze_param` | Unpack PEP 695 `type X = ...` via `is_typealiastype(annotation)` -> `annotation.__value__`. |
| **`fastapi_14794`** | 1A | `fastapi/dependencies/utils.py`: `analyze_param` | Gate `lenient_issubclass(..., Response)` with `if depends is None` so `Annotated[Response, Depends(fn)]` injects the dependency's return value instead of asserting. |
| **`fastapi_9555`** | 1B | `fastapi/dependencies/models.py`: `Dependant._unwrapped_call` | Add `@cached_property _unwrapped_call` using `inspect.unwrap(self.call)` so wrapped async/gen dependencies don't degrade to threadpool execution. |
| **`fastapi_9753`** | 1B | `fastapi/dependencies/models.py`: `Dependant._unwrapped_call` | Strip `isinstance(..., partial)` after `inspect.unwrap(self.call)` so `functools.partial()` dependencies detect generator/coroutine callables. |
| **`fastapi_14262`** | 1C | `dependencies/{models,utils}.py`, `exceptions.py`, `param_functions.py`, `params.py`, `routing.py`, `types.py` (+3 `docs_src/`) | Major 7-file feature introducing `Depends(scope="function" or "request")`, `DependencyScopeError`, `DependencyCacheKey`, and per-request vs per-function teardown around streaming/websockets. |
| **`fastapi_14479`** | 1D | `fastapi/dependencies/utils.py`: `analyze_param` | Attach informative assertion message `"Query parameter {param_name!r} must be one of the supported types"` for invalid query annotations. |
| **`fastapi_13713`** | 2B | `fastapi/applications.py`, `fastapi/openapi/utils.py` | Wire `openapi_external_docs` on `FastAPI.__init__` into `get_openapi(..., external_docs=...)` (`output["externalDocs"]`). |
| **`fastapi_14978`** | 3B | `fastapi/applications.py`, `fastapi/routing.py` (+`docs_src/`) | Security feature: `strict_content_type: bool = True` default rejecting body JSON parsing without `Content-Type` header to block browser CSRF skipping CORS preflight. |
| **`fastapi_14258`** | 4A | `fastapi/routing.py`: `APIRouter.include_router` | Assert `self is not router` with actionable diagnostic preventing self-inclusion infinite recursion. |
| **`fastapi_14306`** | 4A | `fastapi/exceptions.py`: `EndpointContext`, `fastapi/routing.py`: `_extract_endpoint_context`, `_endpoint_context_cache` | Attach cached endpoint `function`, `path`, `file`, `line` metadata to validation error tracebacks. |
| **`fastapi_15785`** | 4A | `fastapi/routing.py`: `RouteContext`, `iter_route_contexts`; `fastapi/openapi/utils.py`: `get_openapi_path` | Expose frozen `RouteContext` public wrapper over preserved `APIRouter`/`APIRoute` inclusion trees without mutating routes. |
| **`fastapi_15030`** | 4B | `fastapi/sse.py`, `fastapi/routing.py`, `fastapi/responses.py`, `fastapi/openapi/utils.py` (+5 `docs_src/`) | Full Server-Sent Events (`ServerSentEvent`, `EventSourceResponse`, `_SSE_EVENT_SCHEMA`, keepalive ping, OpenAPI streaming integration; `+389` src lines). |
| **`fastapi_15800`** | 4B | `fastapi/applications.py`, `fastapi/routing.py` (+6 `docs_src/`) | Full SPA static frontend mount `app.frontend("/", directory="dist")` / `router.frontend(...)` (`+617` src lines). |
| **`httpx_3672`** | 4C | `src/ahttpx/{_parsers,_pool,_server}.py`, `src/httpx/{_network,_parsers,_pool,_server}.py` | Twin-tree feature/refactor: add `HTTPParser.is_keepalive()`, drain unread keepalive body, rename `HTTPParser.complete -> .reset`, add `is_closed()`, close streams cleanly on exit across **both** `ahttpx` (async) and `httpx` (sync)! |
| **`rich_3052`** | 8B | `rich/prompt.py`: `PromptBase.__init__`, `ask` | Add `case_sensitive: bool = True` option for prompt choice matching. |
| **`rich_3486`** | 8B | `rich/traceback.py`, `rich/syntax.py`, `rich/default_styles.py` | Add PEP 657 fine-grained `last_instruction` coordinate highlighting + `"traceback.error_range"` style (`skip` markers on `<3.11`). |
| **`rich_3675`** | 6B | `rich/console.py`, `rich/diagnose.py` | Support `TTY_COMPATIBLE` env var and normalize empty `NO_COLOR=""` checks across Console TTY detection & diagnostics. |
| **`rich_3676`** | 8B | `rich/traceback.py`, `rich/default_styles.py` | Extract `Exception.__notes__` onto `Stack`/`_SyntaxError` and render with `"traceback.note"` style. |
| **`rich_3777`** | 6B | `rich/console.py`, `rich/diagnose.py` | Support `TTY_INTERACTIVE` (`"0"` / `"1"`) env override when `force_interactive is None`. |
| **`rich_3930`** | 6A | `rich/cells.py`, `rich/_cell_widths.py`, `rich/__main__.py`, `rich/_unicode_data/*` (26 files) | Major grapheme architecture upgrade: versioned Unicode 4.1.0–17.0.0 data tables, bisect lookup, multi-codepoint emoji/grapheme splitting (`+12,170` lines via generator!). |
| **`requests_6592`** | 9B | `src/requests/status_codes.py` | Add `"too_early"` lookup alias to HTTP `425` status code tuple. |

### 5.2 Intent `I3`: Performance Optimization & Structural Refactors (`6` Tasks)

| `instance_id` | Category | Primary Files & Symbols | Engineering Purpose & Invariants |
| :--- | :---: | :--- | :--- |
| **`fastapi_14372`** | 1C | `fastapi/params.py`: `@dataclass(frozen=True)`, `fastapi/dependencies/utils.py`: `dataclasses.replace` | Make `Depends` / `Security` frozen & hashable while avoiding post-creation attribute mutation inside `analyze_param`. |
| **`fastapi_14851`** | 4B | `fastapi/routing.py`: `APIRouter`, `lifespan` | Re-implement `on_startup` / `on_shutdown` `on_event` handling directly in FastAPI ahead of upstream Starlette removal (`+153` src lines). |
| **`fastapi_14962`** | 4B | `fastapi/_compat/v2.py`: `ModelField.serialize_json`, `fastapi/routing.py`: `serialize_response` | Bypass Python `jsonable_encoder` + `json.dumps` with Pydantic v2 Rust `to_json()` (`dump_json=True`) when route declares Pydantic response model / return type. |
| **`fastapi_15745`** | 4A | `fastapi/applications.py`, `fastapi/openapi/utils.py`, `fastapi/routing.py` | Massive `933`-line architectural overhaul replacing route cloning with `_EffectiveRouteContext` / `_APIRouteLike` + `_get_routes_version()` OpenAPI cache invalidation so original `APIRouter`/`APIRoute` instances are preserved! |
| **`rich_3942`** | 8A | `rich/default_styles.py`, `rich/markdown.py` | Refresh default Markdown color palette (`yellow` -> `bold`/`cyan`/`dim`) and extract `HeadingFormat` dataclass. |
| **`rich_4070`** | 6B | 9 modules (`rich/_emoji_replace.py`, `console.py`, `emoji.py`, `logging.py`, `protocol.py`, `repr.py`, `segment.py`, `syntax.py`, `theme.py`) | Defer heavy module-level imports (`_emoji_codes.EMOJI`, `inspect`, `zlib`, `getpass`, `Pretty`, etc.) inside functions/TYPE_CHECKING, cutting `Console`/`RichHandler` import time by 1.50x–1.75x. |

### 5.3 Intent `I4`: Deprecations & Legacy Support Removal (`5` Tasks)

| `instance_id` | Category | Primary Files & Mechanism | Verification Constraint |
| :--- | :---: | :--- | :--- |
| **`fastapi_14077`** | 4B | `fastapi/exception_handlers.py`, `fastapi/openapi/utils.py` (+`docs_src/`) | Replace deprecated `starlette.status.HTTP_422_UNPROCESSABLE_ENTITY` imports/constants with literal `422` / `"422"` for Starlette 0.48+ compatibility. |
| **`fastapi_14583`** | 2C | `fastapi/dependencies/utils.py`, `fastapi/routing.py` | Emit `warnings.warn(..., DeprecationWarning, stacklevel=5)` whenever `pydantic.v1` models appear in params or `response_model`. |
| **`fastapi_14605`** | 2C | `fastapi/exceptions.py`: `FastAPIDeprecationWarning(UserWarning)` + 6 modules | Introduce custom `UserWarning` subclass because stdlib `DeprecationWarning` is silenced by default in Python CLI/apps; migrate all deprecation warnings across 7 source files. |
| **`fastapi_14609`** | 2C | 18 source files (`fastapi/_compat/*`, `dependencies/utils.py`, `encoders.py`, `temp_pydantic_v1_params.py`, etc.) + 2 `docs_src/` | Hard-drop `pydantic.v1` support across FastAPI (`18` src files touched), raising clear errors if Pydantic v1 models are used. |
| **`fastapi_14964`** | 2C | `fastapi/responses.py` | Annotate `ORJSONResponse` & `UJSONResponse` with `@typing_extensions.deprecated(...)` pointing to `fastapi_14962`'s Rust serialization fast path. |

### 5.4 Intent `I5`: Documentation, Release Tooling & Novelty PRs (`5` Tasks)

| `instance_id` | Category | Files Modified | Exact Requirement & Trap |
| :--- | :---: | :--- | :--- |
| **`fastapi_14487`** | 5A | `docs_src/handling_errors/tutorial004.py` | Update custom exception handler example so re-raised/400 response doesn't reflect raw exception string (`tests/test_tutorial/...` imports directly from `docs_src/`!). |
| **`fastapi_14492`** | 5A | `docs_src/metadata/tutorial001_1_py39.py` | Fix SPDX license identifier example under Apache 2.0 from `"MIT"` to `"Apache-2.0"`. |
| **`fastapi_15023`** | 5A | `docs_src/stream_data/tutorial002_py310.py` | Update `yield` streaming tutorial example + snapshots (`docs_src` only, zero core FastAPI edit). |
| **`fastapi_15280`** | 5A | `fastapi/applications.py` (+`docs_src/vibe/tutorial001_py310.py`) | April Fools (`2026-04-01`) `@app.vibe()` decorator method implemented inside `FastAPI` + tutorial test. |
| **`fastapi_15661`** | 5A | `scripts/prepare_release.py` (`+216` lines) | New standalone Typer CLI release-preparation script (`__version__` & markdown heading updater) — *zero edits inside `fastapi/` package itself*! |

---

## 6. Strategic Implications for Agent Brain Design (Bridging Task 1 -> Task 2)

Every engineering finding in Sections 1–5 maps directly to concrete design requirements for the **Batonic Coding Framework (BCF)** solver architecture:

1. **AST + Symbol + Test Localization Replaces Unreachable GitHub Links:** With **0 / 129** `hints_text`, **82 / 129** external URLs (blocked offline), and **37 / 129** short/opaque prompts, an agent that merely greps issue numbers fails immediately. Deterministic repository indexing must resolve: (a) symbols and module constants (`_is_single_cell_widths`, `CONSOLE_HTML_FORMAT`), (b) test file entrypoints (`tests/test_cells.py`, `tests/test_tutorial/...`), and (c) exact `HEAD` state in chronological cascades (`rich_3930 -> 3944 -> 3953 -> 4006`, `requests_6644` vs `7315`, `fastapi_14186` vs `14609`).
2. **Twin-Tree & Multi-Layer Dependency Awareness:** Editing only `src/ahttpx/` on `httpx_3672`, only `fastapi/_compat/v2.py` on alias bugs like `fastapi_14371`, or only `fastapi/` on `docs_src/`-tested tasks causes instant test failure. The planner (`bcf_plan`) must emit explicit **co-change couples** and **edit ordering** (`_types.py` / `exceptions.py` / `_compat/v2.py` -> `dependencies/utils.py` / `routing.py` -> `openapi/utils.py` -> `applications.py` -> `docs_src/`).
3. **Generator vs. Hand-Edits (`rich_3930`, `rich_3953`) & Protected Path Hygiene:** Tasks touching generated Unicode modules must locate repository generator scripts cleanly while keeping `<repo>/.git/bcf/` invisible to `git diff HEAD` so `submit_patch()` stays razor-clean.
4. **Test-First Red/Green Verification with Sandbox Awareness:** Pre-existing test infrastructure (`inline_snapshot`, `httpbin`, `dirty_equals`, `anyio`, `-p no:anyio`) plus protected Container B paths (`test_*.py`, `conftest.py`, `pyproject.toml`, `pytest.ini`) mean agents must *never* rely on modifying tests to pass, and should verify reproduction against existing domain tests + syntax/semantic static checks before calling `submit_patch()`.
