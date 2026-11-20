# Task 1: Python 3.13 Official Exception-Handling Traps, Gotchas & Post-Mortem Analysis Across the 129-Task Problem Set

*Research scope: Exhaustive, interpreter-grounded analysis of every exception, error, and warning family represented across all **129 tasks** in `input/kagglecomp/kagglecomp_data_package/tasks.jsonl` and `deliverables/2026-11-20_BCF_Gemma4_Winning_Design/01_Dataset_Classification_and_Root_Cause_Analysis.md`, anchored strictly to the **official Python 3.13 documentation** (the competition's Docker sandbox interpreter, `FROM python:3.13-slim`) alongside **Python 3.12 host-harness deltas** (`cp312` competition wheelhouse) and target-library cross-version boundaries (`3.9`–`3.14`).*

*As of: **2026-11-20** | Grounded In: `docker/Dockerfile.public`, `docker/Dockerfile.sandbox`, `tasks.jsonl` (129 tasks), `01_Dataset_Classification_and_Root_Cause_Analysis.md` (103 bug RCAs + 26 non-bug profiles), and Official Python 3.13 Documentation (`docs.python.org/3.13/`).*

---

## Executive Summary

A programmatic audit of `gemma-4-developer-agent.zip` confirms a **dual-interpreter competition architecture**: the scoring host (`swegemma 0.2.11`, `adk-submission 0.2.13`, `vllm 0.19.1`, `google-adk 1.36.1`) runs **Python 3.12**, whereas both isolated evaluation sandboxes (**Container A** for agent execution and **Container B** for `pytest` verification) run **`FROM python:3.13-slim` (Python 3.13)** with PEP 594 compatibility shims (`imp.py` and `telnetlib.py`) injected into `/usr/local/lib/python3.13/site-packages/`. Across the 129 public tasks, every runtime failure clusters into **nine distinct Python exception and warning families**—led by `TypeError` (10 RCA tasks), `AttributeError` / `FrozenInstanceError` (8), `ValueError` & validation/JSON subclasses (15+), `AssertionError` / `RuntimeError` / `FastAPIError` (12+), `OSError` / `BrokenPipeError` / `BaseException` lifecycle errors (10+), `NameError` / `ImportError` (6), `RecursionError` / `MemoryError` / cyclic `ExceptionGroup` graphs (6), `Warning` categories (6), and `LookupError` / `StopIteration` (5+). Python 3.13 introduces concrete behavioral shifts—including default `ssl.VERIFY_X509_STRICT` certificate rejection, PEP 667 `frame.f_locals` write-through proxies versus `locals()` snapshots, default colorized tracebacks (`PYTHON_COLORS`), PEP 594 standard-library removals, and dataclass `AttributeError` formatting—that directly explain both real task bugs (`rich_3472`, `rich_3468`, `rich_3772`, `rich_3953`, `requests_6629`, `fastapi_14485`, `fastapi_14099`) and local-versus-Docker sandbox verification mismatches.

---

## 1. Competition Interpreter Architecture & Python 3.13 Behavioral Shifts

Before diagnosing any individual exception family, an autonomous agent (or engineer building the BCF brain) must account for **which Python interpreter executes each stage** of the Kaggle competition pipeline:

| Pipeline Stage | Official Interpreter | Key Runtime & Exception Configuration | Direct Consequence for Debugging & Parity |
| :--- | :--- | :--- | :--- |
| **Host Scorer / ADK / vLLM** (`scripts/inference.py`) | **Python 3.12** (`cp312` wheels in `metric/gemma-4-developer-agent-wheelhouse`) | Runs `google-adk 1.36.1`, `swegemma 0.2.11`, `vllm 0.19.1`. Local `--sandbox subprocess` inherits host Python 3.12 unless isolated! | Local `subprocess` runs mask **Python 3.13-specific** failures (`ssl.VERIFY_X509_STRICT`, `AttributeError` format, PEP 594 removals, PEP 667 `f_locals`)! |
| **Container A (Agent Sandbox)** (`docker/Dockerfile.sandbox`) | **Python 3.13** (`FROM python:3.13-slim`) | Injects `imp.py` & `telnetlib.py` into `site-packages/`; `network_mode="none"`; `4 GiB` RAM (`SIGKILL` exit 137); `2 vCPU`. | Agent's `run_command` executes in Python 3.13, where `PYTHON_COLORS` defaults to colorized tracebacks on TTYs and `SyntaxWarning` fires on invalid escapes. |
| **Container B (Phase 2 Grader)** (`harness/verification.py`) | **Python 3.13** (`FROM python:3.13-slim`) | Runs `PYTHONSAFEPATH=1 PYTHONNOUSERSITE=1 python3 -s -m pytest ... --junitxml=... -p no:anyio -o timeout=0`. | `PYTHONSAFEPATH=1` removes CWD `""` from `sys.path[0]`; `-s` / `PYTHONNOUSERSITE=1` disables user site-packages; editable install + `import` paths must be clean! |
| **Target Repositories** (`fastapi`, `rich`, `requests`, `httpx` + unseen private repos) | Source supports **Python 3.9–3.14** | Tests frequently check `sys.version_info` gates (`>= (3, 10)`, `>= (3, 11)`, `>= (3, 14)`), `@pytest.mark.skipif`, and `pytest.warns`. | A patch running under Python 3.13 must NOT break version-gated guards (`eval_str=True`, `types.UnionType`, `co_positions()`, `Exception.__notes__`). |

### Critical Python 3.12 / 3.13 Interpreter Changes Relevant to SWE-Bench Tasks

Grounded in [What's New in Python 3.13](https://docs.python.org/3.13/whatsnew/3.13.html) and [What's New in Python 3.12](https://docs.python.org/3.13/whatsnew/3.12.html):

1. **Default Colorized Tracebacks (`PYTHON_COLORS` / `NO_COLOR` / `FORCE_COLOR`):** Python 3.13 colorizes tracebacks by default when stderr is a TTY. Any agent script or test asserting raw traceback substrings must account for ANSI escape codes (or set `PYTHON_COLORS=0` / `NO_COLOR=1`) when capturing output on pseudo-TTYs.
2. **PEP 667 — Consistent `locals()` and `frame.f_locals` Semantics:** In Python 3.13, `locals()` in optimized scopes (functions, generators, coroutines, comprehensions) returns an **independent snapshot dict**, whereas `frame.f_locals` returns a **write-through proxy** (`FrameLocalsProxy`) that immediately updates fast locals and cell variables ([PEP 667](https://docs.python.org/3.13/whatsnew/3.13.html)). Post-mortem debuggers (`pdb`, `rich.traceback` with `show_locals=True`) inspecting `frame.f_locals` now see consistent live mappings without stale-dict quirks, while mutating `locals()` inside a function no longer alters local bindings.
3. **Strict TLS X.509 Verification by Default (`ssl.VERIFY_X509_STRICT` + `VERIFY_X509_PARTIAL_CHAIN`):** Python 3.13's `ssl.create_default_context()` enables both flags by default ([Python 3.13 `ssl` Docs](https://docs.python.org/3.13/whatsnew/3.13.html)). Legacy test CA certificates lacking RFC 5280 critical `Basic Constraints` or `Authority Key Identifier` (such as older `pytest-httpbin` / `trustme` fixtures in `requests_*`) fail immediately with `ssl.SSLCertVerificationError` on Python 3.13 even when they passed on Python 3.12!
4. **PEP 594 Dead Batteries Removed & Sandbox Shims:** Python 3.12 removed `imp` and Python 3.13 removed 19 legacy stdlib modules including `telnetlib`, `cgi`, `cgitb`, `imghdr`, `nntplib`, `sndhdr`, `uu`, and `xdrlib`. Notice that `docker/Dockerfile.sandbox` explicitly copies `imp.py` (noting `# specifically for flasgger`) and `telnetlib.py` into `/usr/local/lib/python3.13/site-packages/`—proving unseen private repositories may include legacy packages sensitive to PEP 594 removals.
5. **Improved Error Messages & Stdlib-Shadowing Hints:** Python 3.13 expands `AttributeError` and `NameError` hints (including detecting when a local script shadows a stdlib module and suggesting keyword argument typos). However, richer `AttributeError` formatting causes exact-string snapshot tests written on Python 3.12 to fail on Python 3.13 (e.g., `rich_3472`).
6. **`sys.last_exc` (3.12+), `warnings.deprecated` (PEP 702, 3.13), and `SyntaxWarning` on Invalid Escapes (3.12+):** Python 3.12 replaced legacy `sys.last_type`/`last_value`/`last_traceback` with `sys.last_exc` and upgraded unrecognized backslash escapes (`"\d"`, `"\s"`, `"\["`) from `DeprecationWarning` to visible `SyntaxWarning` (which becomes a fatal `SyntaxError` under `-W error::SyntaxWarning`). Python 3.13 added native `warnings.deprecated()` (PEP 702), mirroring `typing_extensions.deprecated` used in `fastapi_14964`.

---

## 2. Master Problem-Set Exception & Error Family Census (All 129 Tasks)

Programmatic extraction across all 129 `tasks.jsonl` records (`problem_statement`, reference `patch`, `test_patch`) and all 103 RCAs in `01_Dataset_Classification_and_Root_Cause_Analysis.md` maps every defect to **9 Python Exception/Error Families**:

| # | Python Exception / Error Family | Official Base Class (Py 3.13) | RCA & Test Incidence | Representative Tasks in Problem Set | Primary Mechanical Fault Pattern |
| :---: | :--- | :--- | :---: | :--- | :--- |
| **1** | **`TypeError` & Introspection / Protocol / Pickling** | `Exception` | `10` RCA (`18+` related) | `fastapi_11355`, `12942`, `14297`, `14372`, `14430`, `14448`, `14455`, `14458`, `14616`, `9753`, `httpx_3672`, `requests_6629`, `6757`, `7433`, `7502`, `7505`, `rich_3894`, `3006` | `issubclass` on non-class (`Union`/`UnionType`), uncalled methods, `@runtime_checkable Protocol` bypassing `__getattr__`, `partial`/`@wraps` unwrap order, unhashable dataclass, `IOError.__reduce__` MRO shadow. |
| **2** | **`AttributeError`, `FrozenInstanceError` & Descriptors** | `Exception` (`FrozenInstanceError` $\subset$ `AttributeError`) | `8` RCA (`10+` related) | `fastapi_14349`, `14356`, `14372`, `14609`, `9555`, `requests_6757`, `rich_3472`, `3894`, `4077` | Uninitialized `field(init=False)` dataclass access, non-`str` `__slots__` descriptors, mutating `@dataclass(frozen=True)` instead of `dataclasses.replace`, `IOBase.isatty()` shadowing `__getattr__`, `dict` under `"$ref"` key. |
| **3** | **`NameError`, `UnboundLocalError`, `ImportError` / `ModuleNotFoundError`** | `Exception` (`UnboundLocalError` $\subset$ `NameError`; `ModuleNotFoundError` $\subset$ `ImportError`) | `6` RCA (+ agent edits `#760595`) | `fastapi_14485`, `5077`, `14077`, `14186`, `requests_7505`, `rich_4070` | `inspect.signature(eval_str=True)` on `TYPE_CHECKING` imports, `@wraps` wrong `__globals__`, `if TYPE_CHECKING:` import used at runtime, deprecated Starlette constants (`HTTP_422_UNPROCESSABLE_ENTITY`), lazy-import frame-depth shifts. |
| **4** | **`LookupError` (`KeyError`, `IndexError`) & `StopIteration`** | `Exception` | `5+` RCA | `fastapi_13207`, `14361`, `rich_3953`, `3506`, `3521`, `4006` | Unguarded `next(iter)` on trailing ZWJ (`StopIteration` / PEP 479 `RuntimeError`), missing `"$ref"` key in inline JSON Schema, validation/serialization mode key mismatch, unclamped `pos = -1` negative slicing. |
| **5** | **`ValueError` & Validation / Serialization / JSON / Encoding Subclasses** | `Exception` (`JSONDecodeError`, `UnicodeError`, `ValidationError` $\subset$ `ValueError`) | `15+` RCA (`20+` test_patch) | `fastapi_15588`, `14306`, `14482`, `14512`, `14360`, `14371`, `14303`, `13537`, `11194`, `14791`, `15661`, `requests_6629`, `7205`, `6589`, `rich_3130` | SSE CR/LF injection, `validation_alias`/`serialization_alias` mismatch, multidict `.items()` collapsing repeated keys, `TypeAdapter(config=...)` `PydanticUserError`, `netrc` `('', '', '')` truthiness, UTF-8 byte vs `str` length. |
| **6** | **`AssertionError`, `RuntimeError` & Domain Exceptions (`FastAPIError`, `HTTPException`)** | `Exception` (`FastAPIError` $\subset$ `RuntimeError`) | `12+` RCA (`19+` test_patch) | `fastapi_14258`, `14794`, `14099`, `14609`, `15280`, `15763`, `14479`, `13786`, `14301`, `15661`, `rich_3064`, `3521`, `3535` | Crashy `assert self.body is not None` on partial input, self-router inclusion `AssertionError` vs `ValueError`, exact exception wording contracts, `403` vs `401` + `WWW-Authenticate`, `PydanticV1NotSupportedError(FastAPIError)`. |
| **7** | **`RecursionError`, `MemoryError`, Infinite Loops & `ExceptionGroup` / Tracebacks** | `RuntimeError` / `Exception` / `BaseExceptionGroup` | `6` RCA | `rich_3772`, `3480`, `4006`, `3676`, `3486`, `fastapi_14258` | Self-referential `e.__cause__ = e` infinite loop, cyclic `ExceptionGroup`/`BaseExceptionGroup` recursion without `visited` set, self-mutating `self._spans.extend(... self._spans)` OOM, zero-advance `while` cursor, PEP 657 `f_lasti // 2`, `Exception.__notes__`. |
| **8** | **`OSError` (`BrokenPipeError`, `SSLCertVerificationError`), `BaseException` (`SystemExit`, `KeyboardInterrupt`, `CancelledError`) & `AsyncExitStack`** | `Exception` / `BaseException` | `10+` tasks (incl. 8 `requests_*`) | `rich_3468`, `httpx_3672`, `fastapi_14099`, `requests_6629`, `6589`–`7505` (8 SSL/offline tasks) | Uncaught `BrokenPipeError` + shutdown `sys.stdout` flush error, `KeyboardInterrupt` (`BaseException`) escaping `except Exception:`, `AsyncExitStack` premature teardown before `StreamingResponse`, bare `except:` swallowing exceptions, Python 3.13 `VERIFY_X509_STRICT`. |
| **9** | **`Warning` Hierarchy (`UserWarning`, `DeprecationWarning`, `FastAPIDeprecationWarning`, `SyntaxWarning`)** | `Warning` $\subset$ `Exception` | `6` RCA (`7+` test_patch) | `fastapi_14186`, `14077`, `14583`, `14605`, `14964`, `14609` | `DeprecationWarning` silently suppressed outside `__main__` vs `UserWarning` visible by default, eager `pydantic.v1` import triggering Py 3.14 `UserWarning`, `stacklevel=2`, `typing_extensions.deprecated` / PEP 702. |

---

## 3. Deep-Dive Analysis: Traps, Gotchas & Post-Mortem Recipes by Error Family

### Family 1: `TypeError` & Introspection / Typing / Protocol / Pickling MRO Errors

**Represented Tasks:** `fastapi_11355`, `fastapi_12942`, `fastapi_14297`, `fastapi_14372`, `fastapi_14430`, `fastapi_14448`, `fastapi_14455`, `fastapi_14458`, `fastapi_14616`, `fastapi_9753`, `httpx_3672`, `requests_6629`, `requests_6757`, `requests_7433`, `requests_7502`, `requests_7505`, `rich_3894`, `rich_3006`.

#### Official Python 3.13 Mechanics, Traps & Gotchas
1. **`@runtime_checkable Protocol` & `collections.abc` Bypass Instance `__getattr__` ([Python 3.13 `typing` Docs](https://docs.python.org/3.13/library/typing.html#typing.runtime_checkable)):** Python's `isinstance(obj, Proto)` and `collections.abc.Iterable.__subclasshook__` inspect the **class MRO** (`type(obj).__mro__`) for method descriptors—they do *not* invoke instance-level `__getattr__` (nor validate call signatures!). Thus, stdlib proxy wrappers like `tempfile._TemporaryFileWrapper` return `False` for `isinstance(fp, SupportsRead)` and `isinstance(fp, Iterable)` (`requests_7502`, `7505`, `7433`). **Fix pattern:** Always pair `isinstance(obj, Proto) or hasattr(obj, "method")` (preserving static type narrowing via `TypeIs` while honoring dynamic proxies!).
2. **`issubclass()` Rejects Typing Special Forms (`typing.Union` & `types.UnionType`):** Calling `issubclass(origin, sequence_types)` raises `TypeError: issubclass() arg 1 must be a class` whenever `origin` is `typing.Union` (`Optional[list[bytes]]`, `fastapi_14297`) or PEP 604 `types.UnionType` (`list[str] | None`, `fastapi_14430`). In Python 3.10–3.13, `typing.get_origin(int | str)` returns `types.UnionType` (NOT `typing.Union`!), whereas `typing.get_origin(Union[int, str])` returns `typing.Union`—so checking ONLY `origin is Union` silently skips pipe unions! And **never assume `None` is at index 1** (`Union[None, list[str]]` puts `NoneType` at index 0!).
3. **`inspect.unwrap()` vs `functools.partial` & `inspect.isclass()` Precedence ([Python 3.13 `inspect` Docs](https://docs.python.org/3.13/library/inspect.html#inspect.unwrap)):**
   - `functools.partial` objects do **not** define `__wrapped__`. Calling `inspect.unwrap(partial(decorated_fn))` stops immediately at the `partial` wrapper and misses `@wraps` layers underneath (`fastapi_9753`, `fastapi_14448`). You MUST strip nested `partial` layers (`while isinstance(fn, partial): fn = fn.func`) **before** calling `inspect.unwrap()`.
   - Checking `getattr(call, "__call__", None)` *without* first checking `inspect.isclass(unwrapped)` misclassifies a **class** with `async def __call__(self)` as a coroutine callable (`fastapi_14458`), causing `TypeError: object <Class> can't be used in 'await' expression` when the framework tries to `await Cls(...)`!
4. **Multiple-Inheritance `pickle.__reduce__` MRO Shadowing (`requests_6629`):** Under [Python 3.13 `pickle` protocol](https://docs.python.org/3.13/library/pickle.html#object.__reduce__), `BaseException.__reduce__` serializes `(type(self), self.args)`. When `requests.exceptions.JSONDecodeError` inherits `(InvalidJSONError, CompatJSONDecodeError)`, `InvalidJSONError -> RequestException -> IOError (OSError)` sits *ahead* of `CompatJSONDecodeError` in the MRO. `OSError.__reduce__` serializes only `(msg,)` instead of `(msg, doc, pos)`, so `pickle.loads(pickle.dumps(err))` crashes with `TypeError: JSONDecodeError.__init__() missing 2 required positional arguments: 'doc' and 'pos'`. **Gotcha:** Reordering base classes alters MRO exception semantics; explicitly delegating `__reduce__` to `CompatJSONDecodeError.__reduce__(self)` is mandatory.
5. **Uncalled Method Attribute References & Sentinel Value Equality:** In `httpx_3672`, `await self._parser.complete` (missing `()`) raises `TypeError: object method can't be used in 'await' expression` in async code and evaluates as a **silent truthy no-op** in sync code! In `rich_3006`, comparing `param.default == inspect.Parameter.empty` triggers custom `__eq__` methods (which can return `True`, non-bool, or raise `TypeError`); sentinel checks MUST use identity (`is` / `is not`).
6. **Mutable `@dataclass` Sets `__hash__ = None` (`fastapi_14372`):** Per [Python 3.13 `dataclasses` Docs](https://docs.python.org/3.13/library/dataclasses.html), any `@dataclass` with default `eq=True, frozen=False` sets `__hash__ = None`, raising `TypeError: unhashable type` when placed in sets/dicts/`Annotated` caches. Making a parent `@dataclass(frozen=True)` requires freezing all subclasses too (`TypeError: cannot inherit non-frozen dataclass from a frozen one`).

#### Post-Mortem Diagnostic Recipe
```bash
# Inspect exact MRO, __reduce__, unwrap chain, and typing origin/args in Container A (Python 3.13):
PYTHONPATH=/workspace:/workspace/src python3 -c "
import inspect, pickle, types, typing
obj = ...  # offending object / annotation / exception
print('type:', type(obj), 'mro:', [c.__name__ for c in type(obj).__mro__])
print('origin:', typing.get_origin(obj), 'args:', typing.get_args(obj))
print('isclass:', inspect.isclass(obj), 'reduce_owner:', next(c for c in type(obj).__mro__ if '__reduce__' in c.__dict__))
"
```

---

### Family 2: `AttributeError`, `FrozenInstanceError` & Descriptor / Proxy Shadowing

**Represented Tasks:** `fastapi_14349`, `fastapi_14356`, `fastapi_14372`, `fastapi_14609`, `fastapi_9555`, `requests_6757`, `rich_3472`, `rich_3894`, `rich_4077`.

#### Official Python 3.13 Mechanics, Traps & Gotchas
1. **Dataclass `field(init=False)` & Python 3.13 `AttributeError` Formatting Drift (`rich_3472`):** `dataclasses.fields(obj)` returns *every* declared field (including `field(init=False)` and `del`'d attributes) with `field.repr == True`. Calling `getattr(obj, f.name)` raises `AttributeError`. **Two traps:** (a) Catching `AttributeError` inside a formatting loop breaks `loop_last(...)` trailing-comma logic—you must filter with `hasattr(obj, f.name)` *before* `loop_last(...)`. (b) On Python 3.13, `AttributeError` objects carry `.name` and `.obj` (added in 3.10) and trigger Python 3.13's enhanced multi-line formatting/suggestions, breaking Python 3.12 exact-string `AttributeError` snapshot tests (`rich_3472` is 1 of 11 local/Python-3.13 drift tasks!).
2. **`hasattr()` Swallows ONLY `AttributeError`—Not `TypeError` or `RuntimeError` ([Python 3.13 Built-ins](https://docs.python.org/3.13/library/functions.html#hasattr)):** In Python 3.x, `hasattr(obj, name)` calls `getattr(obj, name)` and catches *only* `AttributeError`. If a `@property` or custom `__getattr__` raises `TypeError`, `KeyError`, or `RuntimeError`, `hasattr()` propagates it! Conversely, if a `@property` has a bug that raises `AttributeError` internally, `hasattr()` silently returns `False` and masks the real bug (a classic debugging trap when auditing proxies!).
3. **`__getattr__` Is ONLY Invoked on Lookup Misses (`rich_4077`):** Per [Python 3.13 Data Model](https://docs.python.org/3.13/reference/datamodel.html#object.__getattr__), Python calls `__getattr__` *only* after normal attribute lookup across the instance `__dict__` and the entire class MRO fails. When `FileProxy` inherits from `io.TextIOBase`, `IOBase.isatty()` exists concretely on the base class and returns `False`, completely shadowing `FileProxy.__getattr__`! Any proxy subclassing a concrete ABC/base class must explicitly override every concrete base method (`isatty`, `fileno`, `flush`, `readable`, `writable`).
4. **Non-String Descriptors Occupying `__qualname__` / `__name__` (`rich_3894`):** A class declaring `__slots__ = ("__qualname__",)` installs a C `member_descriptor` object on the class attribute `__qualname__`. `getattr(obj, "__qualname__", None)` succeeds and returns a truthy non-`str` descriptor, which later crashes string formatting! Always guard with `isinstance(val, str)` at every step of a fallback chain (`__qualname__` -> `__name__` -> default).
5. **`dataclasses.FrozenInstanceError` Subclasses `AttributeError` (`fastapi_14372`):** When converting a dataclass to `@dataclass(frozen=True)`, any downstream `obj.attr = val` raises `dataclasses.FrozenInstanceError` (a subclass of `AttributeError`!). Because it inherits from `AttributeError`, any broad `except AttributeError:` block elsewhere will accidentally catch and hide frozen-mutation bugs! Replace in-place mutations with `dataclasses.replace(obj, attr=val)`.
6. **Heterogeneous JSON/Multidict Values (`fastapi_14349`, `fastapi_14356`):** Assuming `schema["$ref"]` is always a `str` crashes with `AttributeError: 'dict' object has no attribute 'split'` when a model defines a field named `"$ref"` (`properties["$ref"]` is a schema `dict`). Assuming `received_params` always supports `.getlist()` crashes with `AttributeError` on `request.cookies` (plain `dict`). Guard with `isinstance(val, str)` and `hasattr(received_params, "getlist")`.

#### Post-Mortem Diagnostic Recipe
```bash
# Inspect AttributeError.name / .obj and check for MRO shadowing or property-masked AttributeErrors:
PYTHONPATH=/workspace:/workspace/src python3 -c "
import inspect
try:
    ...
except AttributeError as exc:
    print('name:', getattr(exc, 'name', None), 'obj_type:', type(getattr(exc, 'obj', None)))
    print('class_attr:', inspect.getattr_static(exc.obj, exc.name, '<MISSING>'))
"
```

---

### Family 3: `NameError`, `UnboundLocalError`, `ImportError` & `ModuleNotFoundError`

**Represented Tasks:** `fastapi_14485`, `fastapi_5077`, `fastapi_14077`, `fastapi_14186`, `requests_7505`, `rich_4070`, plus agent-introduced broken edits (`#760595`).

#### Official Python 3.13 Mechanics, Traps & Gotchas
1. **PEP 563 (`from __future__ import annotations`) + `inspect.signature(eval_str=True)` Trap (`fastapi_11355`, `fastapi_14485`, `fastapi_5077`, `fastapi_9425`):**
   - Passing `eval_str=True` to `inspect.signature()` (added in Python 3.10) eagerly calls `eval()` on **every** stringified parameter and return annotation using `fn.__globals__`.
   - **Trap A (`TYPE_CHECKING` Crash):** Any symbol imported only under `if TYPE_CHECKING:` (e.g., `AsyncGenerator` in a dependency's return annotation) raises `NameError` at route-registration time even if the framework never inspects the return type (`fastapi_14485`). Solution: wrap `inspect.signature(call, eval_str=True)` in `try ... except NameError:` and fall back to `inspect.signature(call)`.
   - **Trap B (`@functools.wraps` Wrong `__globals__`):** `@wraps(fn)` copies `__annotations__` onto the wrapper function, whose `__globals__` is the *decorator's* module rather than `fn`'s module (`fastapi_5077`). Always resolve `globalns = getattr(inspect.unwrap(call), "__globals__", {})` while still calling `inspect.signature(call)` (preserving any custom `__signature__`!).
   - **Trap C (`"None"` Evaluates to `NoneType`):** `ForwardRef("None")` evaluates to `type(None)`, NOT `None` (`fastapi_9425`). Downstream `if return_annotation is None:` checks fail unless normalized (`if annotation is type(None): return None`).
2. **`if TYPE_CHECKING:` Runtime Leaks & Lazy-Import Frame Offsets (`requests_7505`, `rich_4070`):**
   - Moving a helper like `from . import _types as _t` into runtime code while leaving its import inside `if TYPE_CHECKING:` passes static type checkers (`mypy`) 100% cleanly yet crashes at runtime with `NameError` (`requests_7505`).
   - Deferring module imports inside methods (`rich_4070`) changes two things: (a) tests that `monkeypatch.setattr(rich.console, "getpass", ...)` fail with `AttributeError` if `getpass` is no longer module-level; (b) replacing `inspect.currentframe` default arguments changes stack frame depth in `sys._getframe(depth)` / `_caller_frame_info`!
3. **`UnboundLocalError` Subclasses `NameError` (Compile-Time Scope Binding Trap):** Python decides variable scope **statically at compile time** for the entire function body. Adding a conditional assignment `x = ...` at line 90 of a function turns an earlier read of global/enclosing `x` at line 20 into `UnboundLocalError`! This is a leading cause of LLM agent edit failures (`#760595`: 12/83 broken edits included `NameError` and `UnboundLocalError`), which `ast.parse` and `py_compile` do **NOT** catch (because it is syntactically valid)!
4. **Upstream Deprecated/Removed Constants & PEP 594 (`fastapi_14077`, `docker/imp.py`):** Replacing `from starlette.status import HTTP_422_UNPROCESSABLE_ENTITY` with `HTTP_422_UNPROCESSABLE_CONTENT` triggers `ImportError` on Starlette `< 0.48.0`; using literal `422` / `"422"` preserves warning-free compatibility across all versions (`fastapi_14077`). Under Python 3.13, importing stdlib modules removed by PEP 594 raises `ModuleNotFoundError` (except `imp` and `telnetlib` shimmed in `Dockerfile.sandbox`). Note also Python 3.13's `PYTHONSAFEPATH=1` in Container B: scripts relying on implicit `sys.path[0] == ""` fail with `ModuleNotFoundError` unless the package is properly editable-installed or `PYTHONPATH=/workspace:/workspace/src` is set.

#### Post-Mortem Diagnostic Recipe
```bash
# Detect NameError / UnboundLocalError / lazy-submodule ImportError WITHOUT running full pytest:
PYTHONSAFEPATH=1 PYTHONNOUSERSITE=1 PYTHONPATH=/workspace:/workspace/src python3 -s -c "
import importlib, ast, pathlib
# 1. Import exact modified submodule (catches top-level & TYPE_CHECKING runtime NameError/ImportError)
importlib.import_module('fastapi.dependencies.utils')
# 2. Check symtable for unbound locals or accidental shadowing
import symtable
src = pathlib.Path('fastapi/dependencies/utils.py').read_text(encoding='utf-8')
st = symtable.symtable(src, 'fastapi/dependencies/utils.py', 'exec')
print('Symtable children:', len(st.get_children()))
"
```

---

### Family 4: `LookupError` (`KeyError`, `IndexError`) & `StopIteration` (PEP 479)

**Represented Tasks:** `fastapi_13207`, `fastapi_14361`, `rich_3953`, `rich_3506`, `rich_3521`, `rich_4006`.

#### Official Python 3.13 Mechanics, Traps & Gotchas
1. **`StopIteration` & PEP 479 Generator-Boundary Conversion (`rich_3953`, [PEP 479](https://docs.python.org/3.13/whatsnew/3.7.html#changes-in-python-behavior)):**
   - Calling `next(iterator)` without a default argument raises `StopIteration` when the iterator is exhausted (in `rich_3953`, a trailing Zero Width Joiner `"\u200d"` at the end of a string called `next(iter_characters)` and crashed!).
   - **Critical PEP 479 Trap:** If an unguarded `next(it)` executes **inside a generator function or async generator**, Python 3.7–3.13 **converts `StopIteration` into `RuntimeError: generator raised StopIteration`** (setting `__cause__ = StopIteration`). Catching `except StopIteration:` *outside* the generator will **NOT** catch it! Always either pass a sentinel default (`next(it, None)`) or use explicit index bounds (`while index < n:`).
2. **Negative Index Slicing Never Raises `IndexError` (`rich_3506`, `rich_3521`):** In Python, `pos = int((cut / cell_length) * len(text)) - 1` yields `pos = -1` for small `cut`. While `text[-1]` accesses the last character without error, `text[:-1]` **silently returns almost the entire string** instead of raising `IndexError`! Always clamp computed slice indices with `max(0, pos)` and verify `0 <= pos <= len(text)`.
3. **`KeyError` Formatting & Mode-Split Dict Divergence (`fastapi_13207`, `fastapi_14361`):**
   - `KeyError.__str__` calls `repr(key)`, so `str(KeyError("$ref"))` is `"'$ref'"` (with extra single quotes)—a trap when regex-matching error strings.
   - In `fastapi_13207`, changing `override_mode` in `get_definitions()` without applying the *identical* check in `get_schema_from_model_field()` causes `field_mapping[(field, mode)]` to raise `KeyError` because the producer and consumer tuple keys diverge!
   - In `fastapi_14361`, Pydantic v2 can inline a JSON schema without a `"$ref"` key even when the model appears in `model_name_map`; always check `if "$ref" not in schema:` before indexing.

#### Post-Mortem Diagnostic Recipe
```bash
# Always inspect __cause__ when seeing RuntimeError inside generators (PEP 479 check!):
PYTHONPATH=/workspace:/workspace/src python3 -c "
import traceback
try:
    ...
except RuntimeError as exc:
    print('PEP 479 StopIteration cause?:', isinstance(exc.__cause__, StopIteration))
    traceback.print_exception(exc)
"
```

---

### Family 5: `ValueError` & Validation / Serialization / JSON / Encoding Subclasses

**Represented Tasks:** `fastapi_15588`, `fastapi_14306`, `fastapi_14482`, `fastapi_14512`, `fastapi_14360`, `fastapi_14371`, `fastapi_14303`, `fastapi_13537`, `fastapi_11194`, `fastapi_14791`, `fastapi_15661`, `requests_6629`, `requests_7205`, `requests_6589`, `rich_3130`.

#### Official Python 3.13 Mechanics, Traps & Gotchas
1. **Python 3.11–3.13 `netrc.authenticators()` Empty-Tuple Truthiness (`requests_7205`, [Python 3.13 `netrc` Docs](https://docs.python.org/3.13/library/netrc.html)):** Before Python 3.11, missing credentials in `.netrc` raised `netrc.NetrcParseError`. Python 3.11+ changed `netrc.authenticators(host)` to return `('', '', '')` for empty default entries. Because a non-empty 3-tuple of empty strings evaluates **truthy** (`bool(('', '', '')) is True`!), `if _netrc:` silently sent a broken `Authorization: Basic Og==` (`":"`) header! **Gotcha:** `all(_netrc)` rejects valid entries whose optional `account` slot `_netrc[1]` is `None`/`""`; the exact check is `if _netrc and any(_netrc):`.
2. **`str` Codepoint Length vs UTF-8 / `latin-1` Wire Byte Length (`requests_6589`, `requests_6757`):** In Python 3, `len(s)` counts Unicode codepoints, NOT encoded bytes. Passing `str` to `super_len()` understated `Content-Length` on `urllib3` 2.x (which encodes `str` as UTF-8), whereas `urllib3` 1.26.x delegates to `http.client` (which encodes `str` as `latin-1`—raising `UnicodeEncodeError` for codepoints `> 255` and using 1 byte/char for `0x80..0xFF`!). Encoding `PreparedRequest.body` in place breaks callers expecting `str`; encode a local copy inside `super_len()` gated on `not is_urllib3_1`.
3. **Multidict `.items()` Silent Loss & Alias/Extra-Field Validation (`fastapi_14356`, `14303`, `14360`, `14371`, `13537`, `15589`):** Starlette's `QueryParams`, `Headers`, and `FormData` (`ImmutableMultiDict`) implement `.items()` by yielding **only the last value per duplicate key**, causing Pydantic `list[str]` validation to fail with HTTP 422 (`ValidationError`, a `ValueError` subclass in Pydantic v2!). Worse: tracking processed keys via `if key not in values:` fails when optional fields map `"" -> None` and are omitted from `values` (`fastapi_13537`), re-inserting raw `""` and triggering 422! Always iterate `.keys()`, call `.getlist(key)` (when `hasattr(..., "getlist")`), unwrap 1-item lists, and track `field_aliases` / `processed_keys` separately from non-`None` `values`.
4. **Pydantic v2 `TypeAdapter(config=...)` `PydanticUserError` & Metadata Duplication (`fastapi_14482`, `fastapi_14512`):** Passing `config=model.model_config` into `TypeAdapter` raises `PydanticUserError` whenever the target annotation is itself a `BaseModel`, `dict`/`TypedDict`, or `dataclass`! And passing both `*field_info.metadata` AND `field_info` into `Annotated[...]` duplicates validators/serializers (`fastapi_14512`).
5. **Text-Append Type Overloading (`rich_3130`):** Calling `Text.append(other_text, style=...)` raises `ValueError` when `other_text` is already a `Text` instance; branch on `isinstance(text, str)` (`append` vs `stylize` + `append_text`).

#### Post-Mortem Diagnostic Recipe
```bash
# Inspect Pydantic v2 ValidationError structured details (loc, type, msg, input, ctx) & MRO:
PYTHONPATH=/workspace:/workspace/src python3 -c "
import json
from pydantic import ValidationError
try:
    ...
except ValidationError as exc:
    print(json.dumps(exc.errors(), indent=2, default=repr))
"
```

---

### Family 6: `AssertionError`, `RuntimeError` & Domain Exceptions (`FastAPIError`, `HTTPException`)

**Represented Tasks:** `fastapi_14258`, `fastapi_14794`, `fastapi_14099`, `fastapi_14609`, `fastapi_15280`, `fastapi_15763`, `fastapi_14479`, `fastapi_13786`, `fastapi_14301`, `fastapi_15661`, `rich_3064`, `rich_3521`, `rich_3535`.

#### Official Python 3.13 Mechanics, Traps & Gotchas
1. **`assert` Is Stripped Under `python3 -O` (`__debug__ == False`) ([Python 3.13 Simple Statements](https://docs.python.org/3.13/reference/simple_stmts.html#the-assert-statement)):**
   - **Trap A (Over-Assertion on Valid Partial Inputs):** Using `assert self.body is not None` in runtime rendering (`rich_3064`) crashes on valid partial Markdown tables with `AssertionError`. Replace with explicit `if self.body is not None:` guards.
   - **Trap B (Exception-Type Contract Mismatch):** Conversely, when a codebase's existing API and tests explicitly use `assert` (e.g., `APIRouter.include_router` prefix checks in `fastapi_14258` and `Query` assertion message in `fastapi_14479`), raising `ValueError` or `FastAPIError` instead of `AssertionError` **fails `pytest.raises(AssertionError)`**! Always match the exact exception class and exact wording asserted in sibling code/tests (`fastapi_14479`: `"Query parameter ..."` NOT `"Query param ... of ..."`!).
2. **`FastAPIError(RuntimeError)` & Custom Error Hierarchy Contracts (`fastapi_14609`, `15280`, `15763`, `14099`):** Deleting legacy code (`fastapi_14609` Pydantic v1 removal) without raising the required domain exception (`PydanticV1NotSupportedError(FastAPIError)`) lets raw `AttributeError`/`PydanticSchemaGenerationError` leak and fails every negative test. Similarly, `fastapi_15763` falsely raised `FastAPIError("Prefix and path cannot be both empty")` by inspecting raw `route.path` instead of the resolved contextual path.
3. **HTTP Authentication Semantics (`fastapi_13786`):** Raising `HTTPException(403)` without `WWW-Authenticate` violates RFC 9110/6750 (`401 Unauthorized` + `WWW-Authenticate: Bearer` / `APIKey`). Always verify method hooks (`make_not_authenticated_error`) against actual repository code rather than outdated PR descriptions!

---

### Family 7: `RecursionError`, `MemoryError`, Infinite Loops & Cyclic `ExceptionGroup` / Tracebacks

**Represented Tasks:** `rich_3772`, `rich_3480`, `rich_4006`, `rich_3676`, `rich_3486`, `fastapi_14258`.

#### Official Python 3.13 Mechanics, Traps & Gotchas
1. **Self-Referential & Cyclic Exception Chains (`rich_3772`, [Python 3.13 Built-in Exceptions](https://docs.python.org/3.13/library/exceptions.html)):**
   - In Python, `raise e from e` is **legal** and sets `e.__cause__ = e` (a cycle!). Similarly, an `ExceptionGroup` / `BaseExceptionGroup` can contain cyclic or repeated sub-exceptions.
   - Any exception walker traversing `while True: cause = exc.__cause__ or exc.__context__` WITHOUT checking `cause is not None and cause is not exc` and maintaining a `visited: set[BaseException]` (never a mutable default argument `visited=set()`!) hangs forever or hits `RecursionError`!
   - **Truthiness Trap:** Always test `if cause is not None:` rather than `if cause:`, because a custom `Exception` subclass implementing `__bool__ -> False` (or `__len__ -> 0`) would otherwise silently truncate the exception chain!
2. **`ExceptionGroup` / `BaseExceptionGroup` & `except*` Rules (PEP 654, Python 3.11–3.13):**
   - `BaseExceptionGroup` inherits from `BaseException`; `ExceptionGroup` inherits from `(BaseExceptionGroup, Exception)`.
   - You **cannot** mix `except` and `except*` in the same `try` block (`SyntaxError`), and `except* ExceptionGroup:` or `except* BaseExceptionGroup:` raises `TypeError`! Furthermore, `break`, `continue`, and `return` are forbidden inside `except*` blocks (`SyntaxError`).
3. **`Exception.__notes__` (PEP 678) & PEP 657 `co_positions()` / `f_lasti // 2` (`rich_3676`, `rich_3486`):**
   - `__notes__` was added in Python 3.11 (`exc.add_note("...")`), and does NOT exist until `add_note()` is called—always read via `getattr(exc, "__notes__", None) or []`.
   - PEP 657 `frame.f_code.co_positions()` yields `(start_line, end_line, start_column, end_column)` tuples indexed by bytecode instruction number **`frame.f_lasti // 2`** (because CPython 3.6+ uses 2-byte wordcode instructions!). Forgetting `// 2` indexes double the offset; forgetting that any of the 4 coordinates can be `None` (synthetic/generated bytecode) crashes formatting (`rich_3486`)!
4. **C Stack vs Python `RecursionError` & Self-Aliasing `MemoryError` (`rich_3480`, `fastapi_14258`, `rich_4006`):**
   - Python 3.12/3.13 track both Python recursion depth (`sys.getrecursionlimit()`, default `1000`) and native C-stack recursion guards so deep C-level calls raise `RecursionError` cleanly rather than segfaulting.
   - Iterating over a list while extending the **exact same list object** (`self._spans.extend(... for x in self._spans)` in `rich_3480`, or `router.include_router(router)` in `fastapi_14258`) never terminates until `MemoryError` or Docker's `4 GiB` OOM killer (`SIGKILL` exit code `137`)! Always copy (`text._spans.copy()`) or assert `self is not router` before mutating.
   - Every `while index < n:` loop with `continue` branches (`rich_4006`) MUST prove monotone strict advance on **every** path (especially empty `spans`, leading zero-width chars, and trailing `\u200d` / `\ufe0f`).

#### Post-Mortem Diagnostic Recipe (For Hangs & Infinite Loops!)
```bash
# NEVER wait 60s for a hang! Use Python 3.13's C-level signal-safe faulthandler timer:
PYTHONPATH=/workspace:/workspace/src python3 -X faulthandler -c "
import faulthandler, sys
faulthandler.dump_traceback_later(3, exit=True)  # dumps exact stuck line in 3s and exits!
# ... run suspected infinite loop / cyclic recursion repro here ...
"
```

---

### Family 8: `OSError` (`BrokenPipeError`, `SSLCertVerificationError`), `BaseException` (`SystemExit`, `KeyboardInterrupt`, `CancelledError`) & `AsyncExitStack`

**Represented Tasks:** `rich_3468`, `httpx_3672`, `fastapi_14099`, `requests_6629`, plus the 8 `requests_*` offline/SSL tasks (`requests_6589`, `6592`, `6629`, `6757`, `7328`, `7433`, `7502`, `7505`).

#### Official Python 3.13 Mechanics, Traps & Gotchas
1. **`BrokenPipeError` & Official Python 3.13 `SIGPIPE` Shutdown Flush Trap (`rich_3468`, [Python 3.13 `signal` Note on SIGPIPE](https://docs.python.org/3.13/library/signal.html#note-on-sigpipe)):**
   - Python ignores `SIGPIPE` at startup so broken pipe writes raise `BrokenPipeError` (`OSError` subclass) instead of silently killing processes.
   - **The Shutdown Double-Fault Trap:** Merely catching `except BrokenPipeError: sys.exit(1)` STILL prints `Exception ignored in: <_io.TextIOWrapper name='<stdout>' ...> BrokenPipeError: [Errno 32] Broken pipe` during interpreter finalization when CPython flushes `sys.stdout` (via `sys.unraisablehook`)!
   - **Official Python 3.13 Fix (Verbatim Pattern Used in `rich_3468`):** Inside `except BrokenPipeError:`, silence future writes (`self.quiet = True`), open `os.devnull` (`devnull = os.open(os.devnull, os.O_WRONLY)`), redirect `os.dup2(devnull, sys.stdout.fileno())`, and raise `SystemExit(1)`! **Never** restore `signal.SIG_DFL` globally in libraries because it kills processes abruptly on unrelated network socket disconnects.
2. **`BaseException` Subclasses Outside `Exception` (`httpx_3672`, `fastapi_14099`):**
   - `SystemExit`, `KeyboardInterrupt`, `GeneratorExit`, `BaseExceptionGroup`, and **`asyncio.CancelledError`** (since Python 3.8!) inherit directly from **`BaseException`**, NOT `Exception`.
   - `except Exception:` intentionally does **not** catch `KeyboardInterrupt` (why `httpx_3672`'s `wait()` had to catch `KeyboardInterrupt` explicitly) nor `asyncio.CancelledError`. Conversely, **bare `except:` or `except BaseException:`** dangerously swallows `CancelledError`, `KeyboardInterrupt`, and `SystemExit`—breaking `asyncio.TaskGroup` / `asyncio.timeout()` structured concurrency!
3. **`contextlib.AsyncExitStack.__aexit__` Lifetime & Exception Suppression (`fastapi_14099`, [Python 3.13 `contextlib` Docs](https://docs.python.org/3.13/library/contextlib.html#contextlib.AsyncExitStack)):**
   - Entering an `AsyncExitStack` inside an endpoint handler that returns a `StreamingResponse` closes all `yield` dependencies and `UploadFile` handles *before* ASGI calls `await response(scope, receive, send)` to consume the generator! The `AsyncExitStack` must wrap **both** endpoint invocation AND response streaming (split across `fastapi_inner_astack` for yield deps and `fastapi_middleware_astack` inside `ExceptionMiddleware` for `UploadFile`).
   - **Suppression Trap:** If a `yield` dependency catches an exception inside `try: yield ... except Exception:` and returns normally without re-raising, `AsyncExitStack.__aexit__` receives `True` (suppressed!), leaving `response_awaited == False`. FastAPI must explicitly check `response_awaited` and raise `FastAPIError` rather than silently producing an empty HTTP response!
4. **Python 3.13 `ssl.VERIFY_X509_STRICT` & Air-Gapped Docker `OSError` (`requests_*`):** In Container A/B (`network_mode="none"` + Python 3.13), external network connections fail immediately with `OSError: [Errno 101] Network is unreachable`, and legacy test CAs fail with `ssl.SSLCertVerificationError` (`Basic Constraints of CA cert not marked critical`). Do **NOT** weaken SSL verification in library code to work around offline sandbox fixtures!

---

### Family 9: `Warning` Hierarchy (`UserWarning`, `DeprecationWarning`, `FastAPIDeprecationWarning`, `SyntaxWarning`)

**Represented Tasks:** `fastapi_14186`, `fastapi_14077`, `fastapi_14583`, `fastapi_14605`, `fastapi_14964`, `fastapi_14609`.

#### Official Python 3.13 Mechanics, Traps & Gotchas
1. **`DeprecationWarning` Is Silently Ignored Outside `__main__` by Default ([Python 3.13 `warnings` Docs](https://docs.python.org/3.13/library/warnings.html#default-warning-filter)):**
   - Python's default filter ignores `DeprecationWarning`, `PendingDeprecationWarning`, and `ImportWarning` in all library modules except `__main__`, whereas **`UserWarning` is shown by default everywhere**.
   - That is why `fastapi_14605` explicitly defines `class FastAPIDeprecationWarning(UserWarning):` instead of subclassing `DeprecationWarning`! Subclassing `DeprecationWarning` breaks visibility expectations and `issubclass` tests.
2. **Eager Import Warnings Under `-W error` (`fastapi_14186`, `fastapi_14077`):** Under `pytest` (which defaults to showing `DeprecationWarning` and often promotes warnings to errors in CI), importing a deprecated upstream symbol (`pydantic.v1` on Python 3.14 or `starlette.status.HTTP_422_UNPROCESSABLE_ENTITY` on Starlette `>=0.48`) at **module import time** breaks even applications that never touch the deprecated feature. Always use lazy local imports (`may_v1.py` placeholders) or raw literals, and never hide legitimate user warnings with global `warnings.catch_warnings()`!
3. **`stacklevel=2` & PEP 702 `@deprecated` (`fastapi_14964`, `fastapi_14583`):** Omitting `stacklevel=2` points the warning at the library's internal `warnings.warn()` line instead of the caller's code (failing `pytest.warns` line-origin checks). In Python 3.13, `warnings.deprecated` (PEP 702) is built into stdlib, while multi-version libraries use `typing_extensions.deprecated(..., category=FastAPIDeprecationWarning, stacklevel=2)`. Emit deprecation warnings at route/schema registration time—never inside hot per-request paths!
4. **`SyntaxWarning` on Unescaped Backslashes in Python 3.12+:** Any non-raw regex string like `"\."` or `"\d"` emits `SyntaxWarning` in Python 3.12/3.13 (and fails under `-W error::SyntaxWarning`). Always use raw strings `r"..."` for regexes and escape sequences.

#### Post-Mortem Diagnostic Recipe
```bash
# Audit imports and warning categories strictly (matches CI warnings-as-errors):
PYTHONSAFEPATH=1 PYTHONNOUSERSITE=1 PYTHONPATH=/workspace:/workspace/src \
  python3 -s -W error::SyntaxWarning -W error::DeprecationWarning -W error::UserWarning \
  -c "import fastapi; print('CLEAN_IMPORT_OK')"
```

---

## 4. Python 3.13 Official Post-Mortem Debugging Playbook (Offline Container A & Local Harness)

When a task fails in Container A (Python 3.13) or Container B (`pytest`), use this **zero-dependency stdlib post-mortem workflow** (compatible with offline `network_mode="none"` and strict `5,000`-char tool output truncation):

| Failure Symptom | Official Python 3.13 Mechanism to Invoke | Exact Command / Snippet | What It Reveals Immediately |
| :--- | :--- | :--- | :--- |
| **Infinite loop / hang / OOM (`SIGKILL 137`)** | `faulthandler.dump_traceback_later()` + `-X faulthandler` | `python3 -X faulthandler -c "import faulthandler; faulthandler.dump_traceback_later(3, exit=True); ..."` | Exact file + line + call stack where the `while` loop or recursion is spinning—in 3 seconds instead of hitting 60s timeout. |
| **Chained / grouped / silent-cause exception** | `traceback.TracebackException.from_exception(exc, capture_locals=True)` | Inspect `.exc_type`, `.__cause__`, `.__context__`, `.__suppress_context__`, `.__notes__`, `.exceptions` | Exposes PEP 479 `StopIteration` hidden behind `RuntimeError`, cyclic `__cause__`, `ExceptionGroup` leaves, and PEP 678 notes without leaking frame refs. |
| **Wrong variable state at crash point** | `pdb.post_mortem()` / `pytest --pdb` / PEP 667 `frame.f_locals` | `python3 -m pytest <target> --tb=short -l --show-capture=no` (locally interactive: `--pdb`) | Prints exact per-frame locals (reliable in Python 3.13 via PEP 667 `FrameLocalsProxy`) and exact sub-expression caret (PEP 657 `co_positions()`). |
| **Shutdown / `__del__` / GC hidden error** | `sys.unraisablehook` + `PYTHON_COLORS=0` | `PYTHON_COLORS=0 python3 -X dev /tmp/repro.py` | Surfaces `BrokenPipeError` shutdown flushes, `ResourceWarning` unclosed streams/sockets, and `AsyncExitStack` unawaited coroutines cleanly without ANSI noise. |
| **Import / warning / syntax regression** | `-s` + `PYTHONSAFEPATH=1` + `-W error::SyntaxWarning` + `symtable` | `PYTHONSAFEPATH=1 PYTHONNOUSERSITE=1 python3 -s -W error::SyntaxWarning -m py_compile <file>` | Matches Container B's exact `sys.path` isolation and catches invalid escapes, `SyntaxError`, and shadowing bugs before `submit_patch()`. |

---

## 5. Sources

1. **Python 3.13 Official Documentation — Built-in Exceptions & Hierarchy:** `https://docs.python.org/3.13/library/exceptions.html`
2. **Python 3.13 Official Documentation — What's New in Python 3.13 (PEP 667 `locals()`/`f_locals`, Colorized Tracebacks, `ssl.VERIFY_X509_STRICT`, PEP 594 Removals, PEP 702 `warnings.deprecated`):** `https://docs.python.org/3.13/whatsnew/3.13.html`
3. **Python 3.13 Official Documentation — `signal` Note on `SIGPIPE` & `BrokenPipeError`:** `https://docs.python.org/3.13/library/signal.html#note-on-sigpipe`
4. **Python 3.13 Official Documentation — `typing` (`@runtime_checkable`, `Protocol`, `UnionType`), `inspect` (`signature(eval_str=True)`, `unwrap`, `isclass`), `contextlib` (`AsyncExitStack`), `dataclasses` (`FrozenInstanceError`, `replace`), `pickle` (`__reduce__`), `netrc`, `warnings`, `traceback`, `pdb`, `faulthandler`, `sys` (`last_exc`, `excepthook`, `unraisablehook`):** `https://docs.python.org/3.13/library/`
5. **Local Competition Ground Truth:** `input/kagglecomp/kagglecomp_data_package/gemma-4-developer-agent.zip` (`docker/Dockerfile.public`, `docker/Dockerfile.sandbox`, `docker/imp.py`, `docker/telnetlib.py`), `tasks.jsonl` (129 tasks), `deliverables/2026-11-20_BCF_Gemma4_Winning_Design/01_Dataset_Classification_and_Root_Cause_Analysis.md`, and `scratch/2026-11-20_deep_audit/audit_summary.json`.
