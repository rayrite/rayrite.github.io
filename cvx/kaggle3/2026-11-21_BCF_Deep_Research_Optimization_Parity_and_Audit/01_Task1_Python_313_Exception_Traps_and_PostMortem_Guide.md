# Task 1: Official Python 3.13 (and 3.12 Host) Exception Handling, Language Traps, Gotchas & Post-Mortem Guide for the 129-Task Problem Set

*Research scope: Exhaustive technical analysis of every exception, warning, and runtime-error family represented across the 129 public tasks in `tasks.jsonl` and `01_Dataset_Classification_and_Root_Cause_Analysis.md`, grounded in the exact competition Python interpreter versions (`python:3.13-slim` in Docker Containers A/B and Python `3.12.13` in the host harness/vLLM wheelhouse V31) and official Python 3.13 documentation.*  
*As of: 2026-11-21 | Primary Ground Truth: `gemma-4-developer-agent.zip` (`docker/Dockerfile.public`, `docker/Dockerfile.sandbox`, `docker/imp.py`, `docker/telnetlib.py`, `sandbox/setup.py`), `tasks.jsonl` (129 tasks), `01_Dataset_Classification_and_Root_Cause_Analysis.md`, `HARNESS_README.md`, and Official CPython 3.13 Documentation (`docs.python.org/3.13/`).*

---

## Executive Summary

A direct inspection of `gemma-4-developer-agent.zip` reveals a **critical two-interpreter architecture** that underpins almost every environment-dependent failure in the competition: the **Docker sandbox (`Container A` and `Container B`) runs `FROM python:3.13-slim`** (with custom `imp.py` and `telnetlib.py` compatibility shims injected into `/usr/local/lib/python3.13/site-packages/` to patch PEP 594 removals), whereas the **host harness, vLLM `0.19.1`, and official Wheelhouse V31 require Python `3.12.13`** (nine `cp312` binary wheels fail preflight on Python 3.13.15). Consequently, local `--sandbox subprocess` runs execute repository tests under Python 3.12, while Docker sandbox runs and official Phase 2 verification execute under Python 3.13—creating version-specific behavioral divergence in SSL strictness (`ssl.VERIFY_X509_STRICT`), dataclass `AttributeError` formatting, `ExceptionGroup` edge cases, and `netrc` parsing.

Across the 129 tasks (**103 bug/error tasks** and **26 non-bug tasks**), programmatic auditing of problem statements, reference patches, and test patches surfaces **six distinct Python exception and fault families**: (1) Introspection, Protocol, Descriptor & Typing traps (`TypeError`, `AttributeError`, `NameError`, `FrozenInstanceError`); (2) Exception Propagation, Chaining, Groups & OS Signal/Pipe faults (`BrokenPipeError`, `SystemExit`, `KeyboardInterrupt`, `ExceptionGroup`, `RecursionError`); (3) Iteration, Generator, Async Lifecycle & Control-Flow traps (`StopIteration`, `RuntimeError`, `AssertionError`, `UnboundLocalError`, `MemoryError`); (4) Serialization, Validation, Pickling & Schema Key faults (`KeyError`, `ValueError`, `JSONDecodeError`); (5) Encoding, Text, Wire-Protocol & Python 3.11–3.14 Compatibility drift (`UnicodeDecodeError`, `OSError`, `ssl.SSLCertVerificationError`, `NetrcParseError`); and (6) Warnings, Deprecations & Hermetic Import semantics (`DeprecationWarning`, `UserWarning`, `ImportError`, `PYTHONSAFEPATH=1`). Mastering the exact CPython 3.13 mechanics and post-mortem diagnostic workflow for each family transfers directly to the **unseen private repositories** on the Kaggle test set.

---

## 1. Competition Python Interpreter Baseline & Two-Runtime Traps

Before diagnosing individual error families, both developers and autonomous agents must account for the exact Python execution topology baked into the competition stack.

| Runtime Layer | Exact Python Version | Grounded Source | Key Interpreter / Stdlib Quirks Affecting Evaluation |
| :--- | :--- | :--- | :--- |
| **Container A & Container B (Docker Sandbox)** | **CPython 3.13** (`FROM python:3.13-slim`) | `docker/Dockerfile.public` & `Dockerfile.sandbox` in `gemma-4-developer-agent.zip` | `ssl.VERIFY_X509_STRICT` and `ssl.VERIFY_X509_PARTIAL_CHAIN` enabled by default; multi-line dataclass `AttributeError` formatting; PEP 594 removals (`imp`, `telnetlib`) patched via custom shims in `/usr/local/lib/python3.13/site-packages/`; `FrozenInstanceError` on `frozen=True, slots=True` non-field writes; `PythonFinalizationError` added; `ExceptionGroup.split()` return validation; `netrc` empty quoted-token fix. |
| **Host Harness & vLLM `0.19.1` (Wheelhouse V31)** | **CPython 3.12.13** (`pin 2026-07-01`) | Thread `#748287`, `#760140`, `gemma4-swe-kit/README.md` | Nine wheelhouse wheels are `cp312-cp312` binaries (`torch 2.10.0+cu128`, `vllm 0.19.1`, `swegemma 0.2.11`, `adk-submission 0.2.13`, `google-adk 1.36.1`). Attempting to install Wheelhouse V31 on Python 3.13.15 fails preflight (`_C.abi3.so` / `cp312` ABI mismatch, `#745699`). |
| **Subprocess Sandbox (`--sandbox subprocess`)** | **Inherits Host Python (3.12.13)** | `HARNESS_README.md` §4.1, `#760595` | Runs repository tests under **Python 3.12 instead of 3.13**! Masks Python 3.13 SSL/formatting regressions locally while differing from Docker Container B. |
| **Phase 2 Verification Invocation (`verify_task`)** | **Hermetic Isolated Python 3.13** | `HARNESS_README.md` §8.2 | Executes `PYTHONSAFEPATH=1 PYTHONNOUSERSITE=1 python3 -s -m pytest ... -p no:anyio -o timeout=0 -o python_classes="Test* *Test" -q`. Blocks implicit `sys.path[0] == ""` (CWD) and user site-packages! |

> [!IMPORTANT]
> **PEP 594 Shim Trap in `Dockerfile.public`:** The competition Docker image copies custom `imp.py` (834 bytes, implementing ONLY `find_module` for `flasgger`) and `telnetlib.py` (23 KB) into `/usr/local/lib/python3.13/site-packages/`. Any code importing other legacy `imp` attributes (e.g., `imp.load_source`, `imp.reload`) will still raise `AttributeError` under Python 3.13.

---

## 2. Quantitative Census of Exceptions & Warnings Across All 129 Tasks

A full regex and structural scan of `tasks.jsonl` (problem statements, reference `patch`, and hidden `test_patch`) plus our 129-task RCA (`01_Dataset_Classification_and_Root_Cause_Analysis.md`) establishes the exact exception footprint of the competition corpus.

| Exception / Warning Class | CPython 3.13 Inheritance Root | Tasks Referencing It (`prob` / `patch` / `test`) | Representative Task IDs | Primary Error Family |
| :--- | :--- | :---: | :--- | :--- |
| `FastAPIError` | `RuntimeError` -> `Exception` | 12 (0 / 9 / 8) | `fastapi_15280`, `14099`, `14609`, `14306`, `15763` | Families C & D (Lifecycle / Validation) |
| `ValueError` | `Exception` | 9 (0 / 7 / 5) | `fastapi_15661`, `15588`, `15030`, `rich_3130` | Family D (Validation & Parsing) |
| `ValidationError` / `ValidationException` | `ValueError` / `Exception` | 11 (2 / 6 / 7) | `fastapi_15030`, `12942`, `14512`, `14482`, `14306` | Family D (Schema & Serialization) |
| `AssertionError` | `Exception` | 9 (4 / 2 / 5) | `fastapi_14258`, `14794`, `14479`, `rich_3064`, `3521` | Family C (Boundaries & Invariants) |
| `HTTPException` / `StarletteHTTPException` | `Exception` | 10 (0 / 8 / 4) | `fastapi_13786`, `14099`, `14301`, `15800` | Families D & E (HTTP Protocol) |
| `RuntimeError` | `Exception` | 7 (1 / 5 / 3) | `fastapi_15661`, `14609`, `9555`, `14262`, `14186` | Family C (Generator / State Errors) |
| `TypeError` | `Exception` | 7 (2 / 2 / 3) | `fastapi_14458`, `14297`, `14616`, `14372`, `httpx_3672`, `rich_3894` | Family A (Introspection & Typing) |
| `AttributeError` | `Exception` | 5 (1 / 3 / 1) | `fastapi_14349`, `9555`, `rich_3472`, `3894`, `requests_7433` | Family A (Descriptors, Proxies & Dataclasses) |
| `JSONDecodeError` (stdlib + `requests`) | `ValueError` / `(InvalidJSONError, CompatJSONDecodeError)` | 5 (1 / 3 / 3) | `requests_6629`, `fastapi_14099` | Family D (MRO Pickling & JSON) |
| `DeprecationWarning` / `FastAPIDeprecationWarning` / `UserWarning` | `Warning` -> `Exception` | 10 (1 / 9 / 7) | `fastapi_14605`, `14964`, `14583`, `14186`, `14077` | Family F (Warnings & Deprecations) |
| `PydanticSchemaGenerationError` | `PydanticUserError` -> `TypeError` | 4 (0 / 4 / 0) | `fastapi_14482`, `14512`, `14609`, `14430` | Family D (Schema Generation) |
| `NameError` (+ `UnboundLocalError` edits) | `Exception` | 3 (2 / 1 / 0) + 12/83 agent edits | `fastapi_14485`, `5077`, `rich_4070` | Families A & C (Annotations & Scope) |
| `ExceptionGroup` / `BaseExceptionGroup` / `BaseException` | `BaseException` | 2 (0 / 2 / 1) | `rich_3772`, `fastapi_14099`, `14851` | Family B (Chaining & Groups) |
| `BrokenPipeError` / `SystemExit` / `KeyboardInterrupt` | `ConnectionError(OSError)` / `BaseException` | 2 (1 / 2 / 1) | `rich_3468`, `httpx_3672` | Family B (OS Signals & Exit Codes) |
| `StopIteration` / `KeyError` / `RecursionError` / `MemoryError` | `Exception` / `LookupError` / `RuntimeError` | 5 (3 / 2 / 2) | `rich_3953`, `fastapi_14361`, `rich_3772`, `3480`, `4006` | Families B, C & D |
| `OSError` / `PermissionError` / `UnicodeDecodeError` / `NetrcParseError` | `OSError` / `ValueError` / `Exception` | 4 (+8 SSL-dead) | `fastapi_15800`, `13786`, `requests_7205`, `6589`–`7505` | Family E (OS, Encoding & SSL) |

*Structural complexity context from `tasks.jsonl`:* **97/129 tasks (75.2%)** modify code past line 150 (defeating unguided `read_file`), **50/129 (38.8%)** modify past line 600 (max line `4,559`), **71/129 (55.0%)** require multi-hunk edits (`33` single-file multi-hunk + `38` multi-file), **27/129 (20.9%)** contain literal backticks in their gold patches, and **11/129 (8.5%)** create brand-new `.py` files.

---

## 3. Family-by-Family Python 3.13 Traps, Gotchas & Post-Mortem Analysis

Each section below maps a family of errors in the problem set to the **official CPython 3.13 semantics**, the **exact traps** that derail both human engineers and coding agents, and the **post-mortem analysis protocol** to diagnose and verify fixes deterministically.

---

### Family A: Introspection, Protocol, Descriptor & Typing Traps
**Representative Tasks (19 tasks):** `requests_7505`, `7502`, `7433`; `fastapi_12942`, `14485`, `14458`, `14448`, `9753`, `5077`, `9555`, `9425`, `14297`, `14616`, `14430`, `11355`, `14372`, `13920`; `rich_3006`, `3894`, `3472`, `4077`.  
**Dominant Exceptions:** `TypeError`, `AttributeError`, `NameError`, `dataclasses.FrozenInstanceError`.

#### Official Python 3.13 Mechanics & Subtle Gotchas
1. **`@typing.runtime_checkable` Protocols & `collections.abc` ABCs Bypass `__getattr__` (`requests_7505`, `7502`, `7433`):** Per the official `typing` and `collections.abc` docs, `isinstance(obj, SupportsRead)` and `isinstance(obj, Iterable)` inspect the **class MRO (`__dict__`)** via `__subclasshook__` and `inspect.getattr_static()`—they intentionally **do NOT invoke instance `__getattr__`**. Standard-library file proxies such as `tempfile._TemporaryFileWrapper` delegate `.read` and `.__iter__` dynamically via `__getattr__`. Thus `isinstance(fp, SupportsRead)` and `isinstance(fp, Iterable)` return `False` even when `fp.read()` works!
   - *Trap:* Replacing `isinstance` outright with `hasattr` destroys static type narrowing (`TypeIs[SupportsRead]`). The canonical pattern is `isinstance(obj, Proto) or hasattr(obj, "read")` (or `hasattr(obj, "__iter__")`), while remembering that `hasattr(obj, name)` in Python works by calling `getattr(obj, name)` and swallowing **only `AttributeError`** (not arbitrary exceptions raised inside a buggy `@property`!).
2. **Concrete Base-Class Methods Shadow `__getattr__` (`rich_4077`):** Per Python's Data Model (`object.__getattr__`), `__getattr__` is invoked **only** when normal attribute lookup through the instance `__dict__` and the entire class MRO fails with `AttributeError`. Inheriting a proxy class from `io.TextIOBase` inherits the concrete `io.IOBase.isatty(self)` default (which returns `False`), so `FileProxy.__getattr__` is **never called** for `.isatty()`.
3. **`inspect.signature(..., eval_str=True)` `NameError` Under PEP 563 + `TYPE_CHECKING` (`fastapi_11355`, `14485`, `5077`, `9425`):** Under `from __future__ import annotations` (PEP 563), every annotation is stored as a raw string. Calling `inspect.signature(fn, eval_str=True)` (added in Python 3.10) eagerly evaluates **all** parameter and return annotations using `fn.__globals__`. Three compounding traps occur:
   - *Trap 1 (`TYPE_CHECKING` `NameError`):* If a module imports a type solely under `if TYPE_CHECKING:` (e.g., `AsyncGenerator` on a return annotation), `eval_str=True` raises `NameError` even if the framework never inspects the return type (`fastapi_14485`). Solution: wrap `eval_str=True` in narrow `try ... except NameError:` fallback to `inspect.signature(call)`.
   - *Trap 2 (`@functools.wraps` Foreign `__globals__`):* `@wraps` copies `__annotations__` onto a wrapper whose `__globals__` belongs to the decorator's module, causing `NameError` on forward refs unless you unwrap via `inspect.unwrap(call)` *for `__globals__` lookup only*, while keeping `inspect.signature(call)` so custom `__signature__` attributes remain intact (`fastapi_5077`).
   - *Trap 3 (`ForwardRef("None")` -> `type(None)`):* Evaluating `"None"` resolves to `types.NoneType` (`type(None)`), **not** the singleton `None` (`fastapi_9425`). Always normalize `if annotation is type(None): return None`.
4. **Unwrapping Order (`functools.partial` vs. `inspect.unwrap`) & Class Callables (`fastapi_14448`, `14458`, `9753`, `9555`):**
   - `functools.partial` objects do **not** define `__wrapped__`, so `inspect.unwrap(partial(decorated_fn))` stops immediately without unwrapping the inner decorator! You must strip nested `partial` layers (`while isinstance(fn, partial): fn = fn.func`) **before** calling `inspect.unwrap()`.
   - Checking `getattr(cls, "__call__")` on a **class object** (`inspect.isclass(obj) == True`) retrieves the *unbound* `__call__` method; if a class defines `async def __call__(self)`, inspecting `__call__` misclassifies instantiating `Cls(...)` as a coroutine (`TypeError: object Cls can't be used in 'await' expression`, `fastapi_14458`). Always guard `if inspect.isclass(unwrapped): return False` before inspecting `__call__`, and inspect BOTH outer wrapper and inner unwrapped callable!
5. **PEP 604 `types.UnionType`, Nested `Annotated`, and PEP 695 `TypeAliasType` (`fastapi_14430`, `14297`, `12942`, `13920`, `14616`):**
   - `typing.get_origin(list[str] | None)` returns `types.UnionType`, NOT `typing.Union`! Testing `origin is Union` misses all PEP 604 pipe unions. Always check `origin in (Union, types.UnionType)`.
   - `issubclass(origin_type, tuple_of_types)` raises `TypeError: issubclass() arg 1 must be a class` when `origin_type` is `Union`, `UnionType`, `Annotated`, or `None` (`fastapi_14297`). And `None` can appear **first** in `Union[None, list[str]]`—never assume `get_args(ann)[0]` is the non-`None` type!
   - Tagged discriminated unions nest `Annotated` *inside* `Union` members inside an outer `Annotated`—unwrapping must recurse (`fastapi_12942`). PEP 695 `type MyAlias = ...` creates a `typing.TypeAliasType` whose underlying annotation lives on `annotation.__value__` (`fastapi_13920`).
6. **Dataclasses (`frozen=True` Inheritance, `field(init=False)`) & Non-String Descriptors (`fastapi_14372`, `rich_3472`, `3894`, `3006`):**
   - Mutable `@dataclass` auto-generates `__eq__` and sets `__hash__ = None` (`TypeError: unhashable type`). Converting a base class to `@dataclass(frozen=True)` without freezing subclasses raises `TypeError: cannot inherit non-frozen dataclass from a frozen one`; mutating any field raises `dataclasses.FrozenInstanceError` (a subclass of `AttributeError`; in Python 3.13, even non-field writes on `frozen=True, slots=True` raise `FrozenInstanceError`). Use `dataclasses.replace()`.
   - `dataclasses.fields(obj)` lists `field(init=False)` fields even before assignment; accessing `getattr(obj, f.name)` raises `AttributeError`. Filtering with `hasattr(obj, f.name)` *before* `loop_last(...)` is essential so trailing-comma/last-element markers stay accurate (`rich_3472`).
   - A `__slots__` class declaring `"__qualname__"` exposes a `member_descriptor` on the class (truthy, not `str`!) (`rich_3894`). Always guard `isinstance(qualname, str)` across the entire fallback chain.
   - Sentinel comparisons such as `param.default is inspect.Parameter.empty` **must** use identity (`is`), never value equality (`==`), because user default objects can override `__eq__` (`rich_3006`).

#### Family A Post-Mortem Diagnostic Protocol
1. Inspect runtime type & MRO directly: `python3 -c "import inspect, typing; print(type(x), type(x).__mro__, typing.get_origin(ann), typing.get_args(ann))"`.
2. Distinguish static MRO presence from dynamic `__getattr__` presence: `inspect.getattr_static(obj, 'attr', None)` vs `hasattr(obj, 'attr')`.
3. For annotation `NameError`, check whether `from __future__ import annotations` is active, inspect `inspect.unwrap(fn).__globals__`, and verify `TYPE_CHECKING`-only imports.
4. For `FrozenInstanceError` or unhashable `TypeError`, grep all assignment sites (`git grep -n '\.<field>\s*='`) and all subclasses (`git grep -n '(BaseClass)'`).

---

### Family B: Exception Propagation, Chaining, Groups, Signals & OS Pipe Faults
**Representative Tasks (5 tasks):** `rich_3468`, `rich_3772`, `rich_3676`, `rich_3486`, `httpx_3672` (plus `fastapi_14099`, `14851`).  
**Dominant Exceptions:** `BrokenPipeError`, `SystemExit`, `KeyboardInterrupt`, `ExceptionGroup`, `BaseExceptionGroup`, `RecursionError`, `PythonFinalizationError`.

#### Official Python 3.13 Mechanics & Subtle Gotchas
1. **`BaseException` vs. `Exception` Hierarchy:** `SystemExit`, `KeyboardInterrupt`, `GeneratorExit`, and `BaseExceptionGroup` inherit directly from **`BaseException`**, NOT `Exception`. A bare `except Exception:` intentionally lets `KeyboardInterrupt` and `SystemExit` propagate (needed in `httpx_3672` where `wait()` must explicitly catch `KeyboardInterrupt`), whereas a bare `except:` silently swallows `KeyboardInterrupt` and `SystemExit`, breaking shutdown and ASGI `yield` cleanup (`fastapi_14099`).
2. **`BrokenPipeError` + `SIGPIPE` + Interpreter Shutdown Flush Trap (`rich_3468`):** Per the official Python 3.13 `signal` documentation (*"Note on SIGPIPE"*):
   - Python overrides the OS default `SIGPIPE` disposition to `SIG_IGN` so broken pipe writes raise `BrokenPipeError` (`ConnectionError -> OSError -> Exception`) instead of terminating the process silently.
   - **THE SHUTDOWN TRAP:** Merely catching `BrokenPipeError` and raising `SystemExit(1)` is **NOT enough**! During CPython interpreter finalization, Python attempts to flush `sys.stdout` (whose underlying file descriptor `1` is still the broken pipe), printing an ugly `Exception ignored in: <_io.TextIOWrapper name='<stdout>' ...>\nBrokenPipeError: [Errno 32] Broken pipe` to `stderr`!
   - **Official Python 3.13 Fix Pattern:** Silence further writes (`self.quiet = True`), open `os.devnull` (`devnull = os.open(os.devnull, os.O_WRONLY)`), redirect FD 1 via `os.dup2(devnull, sys.stdout.fileno())`, close `devnull`, and exit with `sys.exit(1)` (`SystemExit(1)`).
3. **Cyclic Exception Chains (`__cause__` / `__context__`) & `ExceptionGroup` Recursion (`rich_3772`):**
   - Python stores explicit chains (`raise X from Y`) in `exc.__cause__` (setting `__suppress_context__ = True`) and implicit chains (exceptions raised inside an `except` block) in `exc.__context__`. Nothing prevents user code from creating self-referential chains (`e.__cause__ = e`) or cyclic `ExceptionGroup` graphs (`eg = ExceptionGroup("m", [e1, e2])` where `e1.__cause__ = eg`).
   - Traversing chains without a `visited: set[int]` (keyed by `id(exc)`, or `set[BaseException]` carefully guarded if custom exceptions are unhashable!) causes an **infinite `while True` loop** or `RecursionError` (`sys.getrecursionlimit() == 1000`).
   - **Truthiness Gotcha:** Never write `if cause:`—custom `Exception` subclasses can implement `__bool__` returning `False` (or `__len__` returning `0`)! Always test `if cause is not None and cause is not exc_value:`.
   - **Python 3.13 `ExceptionGroup` Refinements:** `except*` (PEP 654) matches sub-exceptions inside `ExceptionGroup` / `BaseExceptionGroup` and wraps naked exceptions cleanly. In Python 3.13, custom `ExceptionGroup.split()` overrides that return invalid types raise a chained `TypeError` rather than crashing the interpreter.
4. **PEP 678 `BaseException.add_note()` / `__notes__` (`rich_3676`):** Added in Python 3.11; `__notes__` is **only created on the instance once `add_note(str)` is called** (it is NOT a default attribute on fresh `Exception()` instances!). Accessing `exc.__notes__` directly raises `AttributeError` even on Python 3.13 unless `add_note()` was called! Always read `getattr(exc_value, "__notes__", None) or []`.
5. **PEP 657 Fine-Grained Error Locations (`code.co_positions()` & `f_lasti // 2`, `rich_3486`):** CPython 3.11+ bytecode uses 2-byte code units (`f_lasti` is a **byte offset**, whereas `code.co_positions()` yields one `(lineno, end_lineno, col_offset, end_col_offset)` tuple per **2-byte instruction**). Forgetting integer division `frame.f_lasti // 2` indexes twice too far! Furthermore, any element of the 4-tuple can be `None` (synthetic bytecode, `exec`, or stripped tables)—always guard `all(v is not None for v in pos)`!

#### Family B Post-Mortem Diagnostic Protocol
1. Inspect the full chain with `traceback.TracebackException.from_exception(exc)` and verify `exc.__cause__`, `exc.__context__`, `exc.__suppress_context__`, `getattr(exc, '__notes__', None)`, and `isinstance(exc, BaseExceptionGroup)`.
2. For `BrokenPipeError` / shutdown errors, reproduce in a subprocess piped to a closed reader (`python3 -c "..." | head -n 1; echo "RC=$?"`) and check BOTH `stderr` (must contain zero `Exception ignored`) AND process exit code (`1`).
3. For hangs or `RecursionError`, run under `python3 -X faulthandler` or `faulthandler.dump_traceback_later(5)` in `/tmp/repro.py` to dump the exact looping stack frame after 5 seconds instead of burning the 60s command timeout!

---

### Family C: Iteration, Generator, Async Lifecycle & Control-Flow Traps
**Representative Tasks (18 tasks):** `rich_3953`, `4006`, `3480`, `3506`, `3521`, `3064`, `4075`, `3905`, `3518`, `3470`, `2943`; `fastapi_14099`, `14258`, `15763`, `13537`, `11194`, `14873`, `5624`, `14419`, `14301`; `requests_7328`.  
**Dominant Exceptions:** `StopIteration`, `RuntimeError`, `AssertionError`, `UnboundLocalError`, `MemoryError`.

#### Official Python 3.13 Mechanics & Subtle Gotchas
1. **PEP 479 (`StopIteration` -> `RuntimeError` Inside Generators) vs. Bare `next(it)` (`rich_3953`):**
   - Calling `next(iterator)` without a default value raises `StopIteration` when the iterator ends on a trailing marker (e.g., trailing ZWJ `\u200d` in `rich_3953`).
   - **PEP 479 Gotcha:** If that bare `next(iterator)` occurs **inside a generator function** (a function containing `yield`), CPython intercepts the uncaught `StopIteration` and converts it into **`RuntimeError: generator raised StopIteration`**! This completely obscures the root cause in tracebacks (`RuntimeError` instead of `StopIteration`). Always supply a sentinel default `next(it, None)` or use bounded index loops (`while index < n:`).
2. **`contextlib.AsyncExitStack` Lifetimes & Bare-Except Swallowing (`fastapi_14099`):**
   - Entering an `AsyncExitStack` inside a request-handler helper that *returns* a `StreamingResponse` runs all `__aexit__` teardowns **before** ASGI iterates the response stream! The stack must wrap **both** `response = await f(request)` AND `await response(scope, receive, send)`.
   - **Yield-Dependency Exception Swallowing Trap:** If a `yield` dependency catches an exception via `except Exception:` without re-raising, `AsyncExitStack.__aexit__` receives `True` (suppressing the exception) even though no ASGI response was ever sent (`response_awaited == False`). Frameworks must explicitly detect `not response_awaited` and raise `FastAPIError` rather than hanging the ASGI connection.
3. **Self-Mutating Container Iteration -> Infinite Loop / `MemoryError` (`rich_3480`, `fastapi_14258`):**
   - `self._spans.extend(transform(s) for s in other._spans)` enters an unbounded loop exhausting the container's `4 GiB` RAM (killed by OS OOM with exit code `137`!) when `other is self` because the generator lazily advances over the growing list (`rich_3480`). Similarly, `router.include_router(router)` mutates `self.routes` while iterating `router.routes` (`fastapi_14258`).
   - *Fix pattern:* Guard identity (`assert self is not router`) or snapshot via shallow copy (`other._spans.copy()` / `hist[:]`) before mutating.
4. **Zero-Advance `while` Loops & Python Negative-Index Slicing (`rich_4006`, `3506`, `3521`):**
   - Any `continue` inside a `while index < n:` loop that skips `index += 1` hangs forever (`rich_4006`).
   - Computing an estimated index `pos = int(ratio * len(text)) - 1` without clamping `if pos < 0: pos = 0` produces `pos = -1`. In Python, **`text[:-1]` silently slices almost the entire string** instead of raising `IndexError` (`rich_3506`)!
5. **`UnboundLocalError` vs. `NameError` & Compile-Time `symtable` Binding (Agent Edit Hazard, `#760595`):**
   - In CPython, variable scope is determined **statically at compile time** (`symtable`), not dynamically at runtime. If *any* statement anywhere in a function body binds `x` (`x = ...`, `x += ...`, `for x in ...`, `except E as x:`, `import x`), CPython marks `x` as a `FAST` local across the **entire** function. Reading `x` before that assignment executes (e.g., inside an un-taken `if` branch or `x = x + 1` after an agent edit) raises `UnboundLocalError` (a subclass of `NameError`) rather than reading an outer global!
   - *Related `except E as e:` Gotcha:* Per Python's `try` statement docs, CPython automatically executes `del e` at the end of the `except` block to break traceback reference cycles; referencing `e` after the `except` block raises `UnboundLocalError`!
6. **`assert` Statements as Runtime Validation (`rich_3064`, `fastapi_14258`, `14794`, `14479`):**
   - Running Python with `-O` (`__debug__ == False`) strips all `assert` statements completely. Conversely, using `assert self.body is not None` on valid partial user inputs (`rich_3064`) causes spurious `AssertionError` crashes. Check existing test expectations carefully: some tasks (`fastapi_14258`, `14479`) explicitly test `pytest.raises(AssertionError, match=...)`, while others (`rich_3064`) require replacing `assert` with `if ... is not None:`.
7. **Mutable State Aliasing, `super().__init__` Overwrites & Stale Caches (`fastapi_5624`, `14873`, `rich_2943`, `3470`, `requests_7328`):**
   - `x = parent_list or []` aliases `parent_list` when non-empty; `x.extend(...)` mutates the parent and leaks into siblings (`fastapi_5624`). Use `x = x + list(...)` or `list(parent_list)`.
   - Assigning `self.attr = val` *before* `super().__init__(...)` allows the parent constructor to silently overwrite `self.attr = []` (`fastapi_14873`).
   - Cloning an object that caches `self._hash` without resetting `copy._hash = None` violates Python's dict/set invariant (`a == b` must imply `hash(a) == hash(b)`, `rich_2943`).

#### Family C Post-Mortem Diagnostic Protocol
1. Run `symtable` static scope analysis (built into `bcf.py verify`'s `_check_scope_warnings`) after every edit to catch `UnboundLocalError` before running tests.
2. For any `while` loop edit, audit **every** `if`/`elif`/`else` and `continue` branch to verify a strictly positive cursor delta or finite termination measure.
3. For every list/dict mutation (`.append`, `.extend`, `.insert`, `[k] = v`), verify ownership (`id(target) != id(source)`) and test self-aliasing (`a.op(a)`) plus empty/boundary inputs (`""`, `[]`, `None`, `0`, `1`-element).

---

### Family D: Serialization, Validation, Pickling & Schema Key Faults
**Representative Tasks (18 tasks):** `fastapi_14986`, `14463`, `14349`, `14459`, `14455`, `14361`, `13207`, `14266`, `14246`, `14791`, `14953`, `15588`, `14512`, `14482`, `14360`, `14371`, `14303`; `requests_6629`.  
**Dominant Exceptions:** `KeyError`, `ValueError`, `AttributeError`, `TypeError`, `ValidationError`, `PydanticSchemaGenerationError`, `PydanticUserError`, `JSONDecodeError`.

#### Official Python 3.13 Mechanics & Subtle Gotchas
1. **`pickle` & Multiple-Inheritance MRO `__reduce__` Precedence (`requests_6629`):**
   - When `class JSONDecodeError(InvalidJSONError, CompatJSONDecodeError):` inherits from `InvalidJSONError(RequestException(IOError))` first, Python's C3 MRO resolves `__reduce__` from `OSError`/`IOError` (which pickles only `self.args = (msg,)`) rather than `json.JSONDecodeError.__reduce__` (which preserves `(msg, doc, pos)`). Unpickling in `multiprocessing` pools fails with `TypeError: missing 2 required positional arguments: 'doc' and 'pos'`.
   - *Official Python 3.13 `pickle` Note:* Explicitly implement `__reduce__(self)` delegating to `CompatJSONDecodeError.__reduce__(self)` rather than reordering MRO bases. Also note setting `__reduce__ = None` explicitly raises `TypeError` during pickling.
2. **Shallow `.copy()` vs. `copy.deepcopy()` on Nested JSON/OpenAPI Dicts (`fastapi_14463`, `14986`):**
   - `dict.copy()` copies only top-level keys; nested dicts/lists (`content["application/json"]["schema"]["anyOf"]` or `schema["servers"]`) remain shared by reference, causing cross-route `anyOf` duplication or cross-request `self.servers` poisoning. Use `copy.deepcopy()` for nested mutation, or `dict(schema)` + fresh list `[{'url': root_path}] + schema.get('servers', [])` when replacing a single top-level key.
3. **JSON Schema Structural Key Collisions (`fastapi_14349`, `14361`):**
   - A Pydantic model can legitimately have a field named/aliased `"$ref"`, making `schema["properties"]["$ref"]` a `dict` instead of a `str` (`AttributeError: 'dict' object has no attribute 'split'`), OR Pydantic can inline a schema without any `"$ref"` key (`KeyError: '$ref'`). Always guard `if "$ref" in schema and isinstance(schema["$ref"], str):`.
4. **MultiDict `.items()` Silent Value Loss & Plain-Dict Compatibility (`fastapi_14356`, `14303`, `15589`, `13537`):**
   - Starlette's `ImmutableMultiDict` (`QueryParams`, `Headers`, `FormData`) implements `.items()` by returning only the **last** value for duplicate keys. Calling `.getlist(key)` unconditionally fails with `AttributeError` on `request.cookies` (a plain `dict`).
   - *Canonical Pattern:* Iterate `.keys()`, check `hasattr(mapping, "getlist")`, unwrap single-element lists (`vals[0] if len(vals) == 1 else vals`), and track `processed_keys` / `field_aliases` separately from non-`None` `values` so cleared optional fields are not re-inserted as raw `""` extra keys (`fastapi_13537`).
5. **Deterministic Ordering vs. `set` Randomization (`fastapi_14455`):**
   - Python 3.7+ guarantees `dict` insertion order, whereas `set` iteration order depends on per-process `PYTHONHASHSEED` randomization. Deduplicating OpenAPI scopes with `list(set(scopes))` produces flaky snapshot failures; always deduplicate via `dict.fromkeys(...)` or insertion-ordered `list` membership checks.
6. **Pydantic V2 `TypeAdapter(config=...)` `PydanticUserError` (`fastapi_14482`, `14512`):**
   - Passing `config=model.model_config` into `TypeAdapter` raises `PydanticUserError` whenever the annotated type is itself a `BaseModel`, `TypedDict`/`dict`, or `dataclass`. Guard with `lenient_issubclass(t, (BaseModel, dict)) or is_dataclass(t)`, and avoid duplicating `field_info.metadata` across `FieldInfo` and `Annotated[...]`.

#### Family D Post-Mortem Diagnostic Protocol
1. Test pickle round-trips explicitly (`pickle.loads(pickle.dumps(exc))`) on custom exception subclasses with multiple inheritance.
2. Inspect both generation and lookup keys in schema maps (`(field, override_mode or field.mode)`) and verify idempotence across **two consecutive calls** (`app.openapi()` twice -> identical output, catches shared-state mutation!).
3. Test multidict inputs with 0 values, 1 value, 2 duplicate values, empty string `""`, and plain `dict` (`cookies`).

---

### Family E: Encoding, Text, Wire-Protocol & Python 3.11–3.14 Compatibility Drift
**Representative Tasks (22 tasks):** `rich_4076`, `3953`, `3944`, `3535`, `3521`, `3506`, `3471`, `3063`, `3278`, `3454`, `3067`, `3105`, `3043`, `3061`; `requests_6589`, `6757`, `7427`, `7315`, `7309`, `6644`, `7205` (+ 8 SSL-dead `requests` tests); `fastapi_15589`, `14786`, `13786`, `14978`.  
**Dominant Exceptions:** `UnicodeDecodeError`, `UnicodeEncodeError`, `OSError`, `ssl.SSLCertVerificationError`, `NetrcParseError`, `AssertionError` (snapshot/framing mismatch).

#### Official Python 3.13 Mechanics & Subtle Gotchas
1. **Python 3.13 `ssl.VERIFY_X509_STRICT` Default Breaking Legacy Test Certs (`requests_6589`–`7505`):**
   - Official Python 3.13 *What's New*: `ssl.create_default_context()` now sets **`ssl.VERIFY_X509_STRICT`** and **`ssl.VERIFY_X509_PARTIAL_CHAIN`** by default. Older self-signed test certificates (such as `pytest-httpbin`'s bundled cert) missing RFC 5280 critical Basic Constraints fail SSL handshakes under Python 3.13 even when they passed on Python 3.12! Combined with Docker `network_mode="none"` (`OSError: [Errno 101] Network is unreachable`), this renders 8–12 public `requests` tasks locally unsolvable without environment calibration.
2. **`str.splitlines()` Silently Discards Trailing Newlines (`rich_4076`):**
   - Per official Python 3.13 `str.splitlines(keepends=False)` docs: unlike `str.split('\n')`, `"Hello\n".splitlines()` returns `['Hello']` (NOT `['Hello', '']`), and `"\n".splitlines()` returns `['']`. Even `splitlines(keepends=True)` returns `['Hello\n']` (1 element!), so stripping `'\n'` and re-joining with `'\n'` still loses the trailing newline! Furthermore, `splitlines()` splits on 11 Unicode line boundaries (`\v`, `\f`, `\x1c`–`\x1e`, `\x85`, `\u2028`, `\u2029`), not just `\n`/`\r\n`. Use `re.split(r"(?<=\n)", text)` or `text.split("\n")` when exact `\n` preservation is required.
3. **Codepoint Length (`len(str)`) vs. UTF-8 Byte Length vs. `latin-1` (`requests_6589`, `6757`):**
   - `len("héllo")` is `5` characters, `len("héllo".encode("utf-8"))` is `6` bytes, and `len("héllo".encode("latin-1"))` is `5` bytes. HTTP `Content-Length` is strictly **wire octets**, which depends on the transport encoder (`urllib3` 2.x encodes `str` as UTF-8; `urllib3` 1.26.x / `http.client` encodes `str` as `latin-1`). Never mutate `PreparedRequest.body` to `bytes` inside `super_len()`; compute encoded length locally.
4. **Python 3.11+ `netrc.authenticators()` Empty-Tuple Truthiness & Py 3.13 Parser Fix (`requests_7205`):**
   - Before Python 3.11, credential-less `.netrc` default entries raised `netrc.NetrcParseError`. Starting in Python 3.11, `netrc.authenticators(host)` returns `('', '', '')`—a non-empty 3-tuple whose `bool(t)` is **`True`**! Python 3.13 additionally tightened empty quoted token parsing vs EOF. Guard with `if _netrc and any(_netrc):` (NOT `all(_netrc)`, since valid entries often omit the `account` slot `_netrc[1]`).
5. **Regex Capturing Group Index Shift & Control-Code Span Alignment (`rich_3278`, `3471`, `3063`):**
   - Adding a capturing group `(...)` instead of a non-capturing group `(?:...)` to a master tokenizer regex shifts every subsequent `match.groups()` index silently (`rich_3278`).
   - Stripping control codes *after* recording `Span(offset, offset + len(content))` misaligns style spans against rendered text (`rich_3471`).
   - Python's `str.partition(" ")` splits strictly on the *first* space (preserving internal spaces in `Digest` auth headers), whereas `str.split()` destroys internal whitespace (`fastapi_14786`).
6. **Python 3.13 `AttributeError` / Dataclass Formatting Drift (`rich_3472`):**
   - Python 3.13 altered how certain built-in error strings and multi-line reprs format compared to Python 3.12 test snapshots. Always verify snapshot tests inside the exact `python:3.13-slim` container.

#### Family E Post-Mortem Diagnostic Protocol
1. Test string/protocol functions with a 6-case boundary harness in `/tmp/repro.py`: `""`, `"\n"`, `"a\n"`, `"C:\\"`, `"C:\\\\"`, `"早乙女 (CV: 徳井青)   "`, `"👩\u200d🔧\u200d"`, and `"\x01\r\x1b7"`.
2. Verify `repr(actual) == repr(expected)` (never `print()` alone, which hides `\r`, trailing spaces, and ANSI escape bytes!).
3. For DNS/URL checks, test exact match, `.prefix` match, subdomain match, and lookalike suffix (`evilexample.com` vs `example.com`).

---

### Family F: Warnings, Deprecations & Hermetic Import/Execution Semantics
**Representative Tasks (11 tasks):** `fastapi_14605`, `14964`, `14583`, `14186`, `14077`, `14609`, `14851`, `rich_4070`, `fastapi_15661`, `15023`, `14492`.  
**Dominant Exceptions/Warnings:** `DeprecationWarning`, `UserWarning`, `FastAPIDeprecationWarning`, `ImportError`, `ModuleNotFoundError`, `SyntaxWarning`.

#### Official Python 3.13 Mechanics & Subtle Gotchas
1. **Official Python 3.13 Default `warnings` Filter Precedence (`fastapi_14605`, `14964`, `14583`):**
   - Per official CPython 3.13 `warnings` documentation, release builds install five default filters:
     ```text
     default::DeprecationWarning:__main__
     ignore::DeprecationWarning
     ignore::PendingDeprecationWarning
     ignore::ImportWarning
     ignore::ResourceWarning
     ```
   - **Critical Design Consequence:** Plain `DeprecationWarning` emitted from library modules (outside `__main__`) is **silently ignored by default** for end users! That is why libraries like FastAPI define `class FastAPIDeprecationWarning(UserWarning):` inheriting from **`UserWarning`** (which IS shown by default!) rather than `DeprecationWarning` (`fastapi_14605`). Getting the base class wrong fails both visibility intent and `pytest.warns` / `issubclass` tests.
   - Always pass `stacklevel=2` (or exact caller frame depth) so the warning points at user code, not the library's own wrapper line (`fastapi_14964`).
2. **Import-Time Side Effects & `pytest -W error` (`fastapi_14186`, `14077`, `rich_4070`):**
   - Importing a deprecated upstream constant (`from starlette.status import HTTP_422_UNPROCESSABLE_ENTITY`) or eagerly importing a legacy submodule (`pydantic.v1` on Python 3.14) fires warnings **at module import time**, failing CI suites running under `-W error` even when the user never invokes the deprecated path.
   - *Fix Patterns:* Replace deprecated status-code constants with literals (`422` / `"422"`, `fastapi_14077`); defer optional/legacy imports into execution branches (`fastapi_14186`, `rich_4070`); place annotation-only imports inside `if TYPE_CHECKING:` **only when `from __future__ import annotations` is present** (otherwise runtime `NameError` occurs at class/function definition time!).
   - *Monkeypatch Regression Trap (`rich_4070`):* Moving a module-level `import getpass` inside a method breaks existing tests that call `monkeypatch.setattr("rich.console.getpass", ...)`. Always grep `tests/` for module-attribute monkeypatches before deferring an import!
3. **Hermetic Container B Flags: `PYTHONSAFEPATH=1`, `PYTHONNOUSERSITE=1`, `python3 -s` (`HARNESS_README.md` §8.2):**
   - Per official Python 3.13 CLI docs, `PYTHONSAFEPATH=1` (equivalent to `-P`, added in 3.11) prevents Python from prepending `""` (CWD) or the script's directory to `sys.path`. `-s` / `PYTHONNOUSERSITE=1` disables user site-packages.
   - **Consequence:** A patch that accidentally relies on relative CWD imports (working under plain `python3 /tmp/repro.py` or `python3 -m pytest` without `-P`) will crash with `ModuleNotFoundError` in Phase 2 verification unless the package is properly installed in editable mode and imported by its exact dotted package name!

#### Family F Post-Mortem Diagnostic Protocol
1. Smoke-import every modified dotted submodule under exact Container-B isolation **and** warning promotion:
   `PYTHONSAFEPATH=1 PYTHONNOUSERSITE=1 python3 -s -W error::DeprecationWarning -W error::SyntaxWarning -c "import importlib; importlib.import_module('<pkg.submod>')"`.
2. For deprecation tasks, verify with `warnings.catch_warnings(record=True)` checking exact `w.category`, exact `w.message`, AND `w.filename` (validating `stacklevel`).
3. Audit all eager imports repo-wide with `git grep -n "<deprecated_symbol>" -- '*.py' ':!tests/*'`.

---

## 4. Unified Post-Mortem Quick-Reference Matrix (Error Family -> Action)

| Error Family | Signature Exception(s) | Top Python 3.13 Gotcha | Deterministic Verification Command (`/tmp/repro.py` + CLI) |
| :--- | :--- | :--- | :--- |
| **A. Introspection & Typing** | `TypeError`, `AttributeError`, `NameError`, `FrozenInstanceError` | `@runtime_checkable` & ABCs ignore `__getattr__`; `partial` lacks `__wrapped__`; `isclass` before `__call__`; `UnionType` vs `Union`; `eval_str=True` `NameError` | `python3 -s -c "import inspect, typing, <mod>"` + proxy/partial/class/union assertions in `/tmp/repro.py` |
| **B. Propagation, Groups & Signals** | `BrokenPipeError`, `SystemExit`, `KeyboardInterrupt`, `ExceptionGroup`, `RecursionError` | Shutdown `sys.stdout` flush after `BrokenPipeError`; `f_lasti // 2` & `None` in `co_positions()`; `getattr(e, '__notes__', None)`; custom `__bool__` on `Exception` | Subprocess pipe `\| head -n 1` checking `RC=1` & empty `stderr`; cyclic `e.__cause__ = e` under `faulthandler.dump_traceback_later(5)` |
| **C. Loops, Generators & State** | `StopIteration`, `RuntimeError`, `AssertionError`, `UnboundLocalError`, `MemoryError` | PEP 479 converts `StopIteration` in generators to `RuntimeError`; `pos = -1` slices `text[:-1]`; `symtable` local binding; `AsyncExitStack` exiting before stream | `symtable` check + self-alias (`a.op(a)`) + empty/boundary test + `AsyncExitStack` stream consumption test |
| **D. Serialization & Schema** | `KeyError`, `ValueError`, `ValidationError`, `JSONDecodeError` | Multiple-inheritance `IOError.__reduce__` shadows `JSONDecodeError.__reduce__`; shallow `.copy()` mutates nested `anyOf`; `MultiDict.items()` drops duplicates | `pickle.loads(pickle.dumps(exc))`; call `app.openapi()` **twice** for idempotence; test duplicate + single + dict keys |
| **E. Encoding, Protocol & Py3.13 Drift** | `UnicodeDecodeError`, `OSError`, `SSLCertVerificationError`, `NetrcParseError` | `ssl.VERIFY_X509_STRICT` default in Py 3.13; `splitlines()` drops trailing `\n`; `len(str)` != UTF-8 bytes; `bool(('', '', '')) == True`; regex capture shift | `repr()` exact-match assertions on CJK, ZWJ `\u200d`, `\r`, trailing `\n`/`\\`, and `urllib3` 1.x/2.x monkeypatch |
| **F. Warnings & Hermetic Imports** | `DeprecationWarning`, `UserWarning`, `ImportError`, `SyntaxWarning` | Default filter hides `DeprecationWarning` outside `__main__`; `PYTHONSAFEPATH=1` removes CWD from `sys.path`; lazy import breaks `monkeypatch` | `PYTHONSAFEPATH=1 PYTHONNOUSERSITE=1 python3 -s -W error::SyntaxWarning -W error::DeprecationWarning -c "import ..."` + `warnings.catch_warnings(record=True)` |

### Pytest Exit-Code Post-Mortem Reference (Container A & B)
When diagnosing `PYTEST_EXIT=<code>` in `bcf.py verify` or `test_outputs/<id>.log`, distinguish agent failures from collection/environment failures immediately using pytest's official exit codes:

| `pytest` Exit Code | Official Meaning | Post-Mortem Interpretation in Kaggle Sandbox |
| :---: | :--- | :--- |
| **`0`** | All collected tests passed | Check JUnit XML too! Still fails Phase 2 if `passed_tests == 0` or a required sibling test was **skipped** (`fastapi_14186`, `rich_3486`, `#757893`). |
| **`1`** | Tests collected and run, at least one failed | True assertion failure or runtime exception—inspect `--tb=short` and verify whether it is a regression vs. an intentional spec change (`SPEC_CHANGE_RISK`). |
| **`2`** | Test execution interrupted or **collection error** | Usually `SyntaxError`, `IndentationError`, `ImportError` from broken edit, OR missing offline test wheel (`inline_snapshot`, `dirty_equals`) in local dev! |
| **`3`** | Internal pytest error | Plugin conflict (e.g., `anyio` vs `-p no:anyio`) or corrupted `conftest.py` / `pytest.ini` (ensure protected configs were NOT edited!). |
| **`4`** | pytest command-line usage error | Invalid `-k` expression, nonexistent path, or unsupported flag. |
| **`5`** | No tests collected | Wrong test path or overly narrow `-k` filter—**zero verification signal** (common E4B trap in `#760595`, 45/133 runs!). |
| **`137`** | Process killed by `SIGKILL` (`128 + 9`) | Container hit the **`4 GiB` RAM cgroup limit** (often infinite list append / `MemoryError` loop) or command timeout `os.killpg(..., SIGKILL)`. |

---

## 5. Open Questions & Unverified Boundaries

- **Exact Private-Repo Python Feature Mix:** While Host Elan Markowitz confirmed that **0 private-set tasks touch `async def` functions** (`#745998`) and Ryan Holbrook confirmed **100% of hidden test tasks validate with gold patches** (`#744370`, `#747248`), the exact Python dependency matrix (e.g., whether private repos use Pydantic, SQLAlchemy, NumPy, or pure stdlib) is intentionally hidden. All six error families above were therefore analyzed at the CPython 3.13 language/stdlib level rather than overfitting to FastAPI/Rich/Requests internals.
- **Exact Minor Patch Version Inside Private Scorer Image:** `Dockerfile.public` pins `FROM python:3.13-slim` without a SHA digest; depending on when the host built the image, minor patch releases (`3.13.0`–`3.13.x`) can vary slightly in traceback wording (as seen in `rich_3472`). Local parity requires checking the exact `python3 --version` inside the built container.

---

## 6. Sources

1. **Competition Ground Truth Artifacts (Local):** `input/kagglecomp/kagglecomp_data_package/gemma-4-developer-agent.zip` (`docker/Dockerfile.public`, `docker/Dockerfile.sandbox`, `docker/imp.py`, `docker/telnetlib.py`, `sandbox/setup.py`), `tasks.jsonl` (129 tasks), `HARNESS_README.md`, and `deliverables/2026-11-20_BCF_Gemma4_Winning_Design/01_Dataset_Classification_and_Root_Cause_Analysis.md`.
2. **Official Python 3.13 Documentation — What's New in Python 3.13** (`ssl.VERIFY_X509_STRICT`, `PythonFinalizationError`, `ExceptionGroup` fixes, `dataclasses` `frozen=True, slots=True`, `netrc`): https://docs.python.org/3.13/whatsnew/3.13.html
3. **Official Python 3.13 Documentation — Built-in Exceptions & Exception Hierarchy** (`BaseException`, `ExceptionGroup`, `add_note()`, `UnboundLocalError`, `RecursionError`, `BrokenPipeError`): https://docs.python.org/3.13/library/exceptions.html
4. **Official Python 3.13 Documentation — `signal` Module (Note on `SIGPIPE` & `BrokenPipeError` shutdown flush)**: https://docs.python.org/3.13/library/signal.html
5. **Official Python 3.13 Documentation — `warnings` Module (Default Warning Filters)**: https://docs.python.org/3.13/library/warnings.html
6. **Official Python 3.13 Documentation — Command Line & Environment (`PYTHONSAFEPATH`, `PYTHONNOUSERSITE`, `-s`)**: https://docs.python.org/3.13/using/cmdline.html
7. **Official Python 3.13 Documentation — `inspect` (`signature(eval_str=True)`, `unwrap`), `typing` (`runtime_checkable`, `UnionType`, `TypeAliasType`), `dataclasses`, `contextlib.AsyncExitStack`, `pickle`, `symtable`, `faulthandler`, `str.splitlines`**: https://docs.python.org/3.13/library/
8. **PEP 479 (Change `StopIteration` handling inside generators), PEP 563 (Postponed Evaluation of Annotations), PEP 604 (`X | Y` Unions), PEP 654 (`ExceptionGroup` / `except*`), PEP 657 (Fine-Grained Error Locations `co_positions()`), PEP 678 (`Exception.__notes__`), PEP 695 (`TypeAliasType`)**: https://peps.python.org/
9. **Official pytest Documentation — Exit Codes (0–5)**: https://docs.pytest.org/en/stable/reference/exit-codes.html
10. **Kaggle Competition Intel Archive (`input/kagglecomp/`)**: Threads `#744370`, `#745699`, `#745998`, `#747248`, `#748287`, `#755554`, `#757893`, `#760140`, `#760595`.
