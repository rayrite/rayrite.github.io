# Task 1 - Python exception-handling traps and post-mortem playbook for every error family in the problem set

**Prepared:** 2026-11-24. **Competition:** Kaggle, Google Gemma 4 Developer Agent (149921). **Scope:** the 129 published tasks as classified in `2026-11-23_BCF_Brain_and_Dataset_RCA/01_Dataset_Taxonomy_and_Root_Cause_Analysis.md`, re-read against the official Python documentation for the interpreter the competition actually runs, with a post-mortem procedure for each family.

---

## 0. Which interpreter, and why there are two

The phrase "the competition version of the Python interpreter" resolves to two different interpreters, and the distinction decides which documentation page applies:

| Interpreter | Where it runs | Version and evidence | What it means for this document |
| --- | --- | --- | --- |
| Sandbox interpreter | Inside the task container: the repository code the agent edits, the hidden tests, `python3` in every `run_command`, and the BCF helper `bcf.py` | The official image is built `FROM python:3.13-slim` (`docker/Dockerfile.sandbox` and `Dockerfile.public` in the competition zip, read 2026-11-24); the image ships `telnetlib.py` and `imp.py` shims for modules that 3.12 and 3.13 removed; a competitor who ran the public tasks with gold patches through the Docker backend reports Python 3.13 behaviour (discussion 754586) | The code and tests obey the **Python 3.13** documentation. All language claims below are quoted from `docs.python.org/3.13/` (the pages render as "3.13.18 Documentation" as fetched on 2026-11-24) |
| Harness interpreter | The notebook process that runs vLLM, Google ADK and `swegemma` | Python 3.12.13 in the official Getting Started notebook (notebook `language_info`, version 3, last run 2026-11-21); three wheelhouse wheels are `cp312`-only (`apache_tvm_ffi`, `cbor2`, `ijson`) | The harness, the tool-call parsing and the server-side retry logic obey the **3.12** documentation. In the staff Getting Started notebook the sandbox is the `subprocess` backend, so there the repository code also runs on 3.12.13 |

Three consequences worth stating before any trap:

1. **The BCF helper's docstring is wrong.** `parts/_bcf_head.py` line 27 says "the sandbox is offline with a pinned Python 3.12". On the scorer (Docker backend, "the competition's persistent Docker container" per the Overview page) the helper runs under 3.13. The helper's own code is compatible with both (checked: `from __future__ import annotations`, `ast.unparse`, `os.replace`, `sys.stdout.reconfigure` all exist on 3.12 and 3.13), but its **compile gate validates 3.13 syntax on the scorer and 3.12 syntax on a 3.12 subprocess rig**. A 3.13-only construct would be refused locally and accepted remotely, or the reverse for anything removed in 3.13.
2. **The notebook-based local replica is off by one minor version.** Teams who iterate in the Getting Started notebook test their edits on 3.12.13 and are scored on 3.13. Discussion 754586 lists `rich_3472` as failing with the gold patch under 3.13 because "Python 3.13 formats the AttributeError message differently from 3.12" (competitor-reported; my local probes on 3.12.10 and 3.13.15 did not reproduce a message difference for a plain missing attribute, so treat the exact wording as unverified and the risk as real).
3. **Two tasks can never pass in one environment.** The same thread shows `fastapi_14186` requiring one test under `@needs_pydanticv1` and another under `@needs_pydanticv2`, and `rich_3486` requiring one test under `skipif < 3.11` and another under `skipif >= 3.11`. A skipped required test counts as a failure (harness source, `_validate_junit_xml`). These belong in the "do not spend budget here" bucket of any routing rule.

---

## 1. How the families were derived

Two sources were joined on `instance_id`: the root-cause records (`data/rca_merged.jsonl`: category, mechanism, domain, route, spec gap) and a deterministic scan of the statements, the added lines of the 129 gold patches and the added lines of the 129 test patches (`scratch/2026-11-24-bcf-tuning-parity/excscan/exc_scan.md`). The scan counts mentions, not raised events, so its numbers are upper bounds used to order the families, never to claim that a task "is" a `ValueError` task.

### 1.1 Exception-like names by location

| Name | Kind | Statements | Gold patch (added lines) | Test patch (added lines) | Reading |
| --- | --- | ---: | ---: | ---: | --- |
| `FastAPIDeprecationWarning` | custom | 2 | 24 | 54 | Warnings are the largest single exception vocabulary in the set |
| `HTTPException` | custom | 0 | 29 | 7 | The status-code contract of FastAPI |
| `ValueError` | builtin | 0 | 12 | 14 | Wrong value, not wrong type |
| `ValidationError` | library | 2 | 3 | 18 | Pydantic and FastAPI validation |
| `HTTPValidationError` | library | 0 | 0 | 20 | Only in tests: the 422 response schema is compared |
| `AssertionError` | builtin | 6 | 3 | 11 | Six statements name it as the observed failure |
| `RuntimeError` | builtin | 1 | 10 | 9 | |
| `DeprecationWarning` | builtin | 0 | 4 | 11 | |
| `FastAPIError` | custom | 0 | 5 | 9 | |
| `RequestValidationError` | library | 3 | 4 | 6 | |
| `PydanticV1NotSupportedError` | custom | 0 | 8 | 2 | |
| `NameError` | builtin | 5 | 1 | 0 | Five statements show a `NameError`; the gold patch never mentions it |
| `JSONDecodeError` | library | 3 | 2 | 1 | |
| `OSError` | builtin | 0 | 1 | 4 | |
| `TypeError` | builtin | 2 | 1 | 0 | |
| `AttributeError` | builtin | 1 | 1 | 1 | |
| `BrokenPipeError`, `PermissionError`, `UnicodeDecodeError`, `TimeoutError`, `CancelledError`, `KeyboardInterrupt`, `SystemExit` | builtin | 0 to 1 each | 1 to 2 each | 0 to 1 each | One or two tasks each |

The telling column is the third: statements name `NameError`, `AssertionError`, `TypeError` and validation classes, and almost never name `OSError`, `RuntimeError` or a warning. **The statement usually shows the symptom, not the exception the fix must handle**, which is why an agent that greps for the exception name in the statement finds the wrong file.

### 1.2 Families and how many tasks carry their signals

| Code | Family | Tasks with a signal | In the statement | In the gold patch | In the test patch | Root-cause codes it maps to |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| F1 | Value and lookup (ValueError, KeyError, IndexError, wrong shape or container) | 30 | 14 | 17 | 14 | R01, R02, R06 |
| F2 | Type and attribute protocol (TypeError, AttributeError, duck typing, proxies) | 43 | 12 | 34 | 10 | R01, R02, R13 |
| F3 | Name and import resolution (NameError, forward references, `TYPE_CHECKING`) | 10 | 8 | 6 | 3 | R01, R02, R10 |
| F4 | Type-introspection and version branches (PEP 604, PEP 695, `Annotated`, `sys.version_info`) | 56 | 14 | 27 | 40 | R01, R02, R05, R13, R15 |
| F5 | Non-termination and recursion (RecursionError, StopIteration, infinite loop) | 10 | 4 | 7 | 1 | R07 |
| F6 | OS and I/O errors (OSError family, broken pipe, files, `isatty`) | 13 | 3 | 11 | 8 | R10, R11, R13 |
| F7 | Text encoding and Unicode (UnicodeDecodeError, encoders, cell widths) | 35 | 12 | 17 | 28 | R06, R07, R08 |
| F8 | Warnings and deprecation (DeprecationWarning, warning classes, filters) | 14 | 8 | 10 | 7 | R05, R13, R14, R15 |
| F9 | Async and lifecycle (coroutines, exit stack, lifespan, streaming teardown) | 43 | 11 | 20 | 32 | R01, R04, R07, R13 |
| F10 | Custom exceptions and contracts (new error class, exact message, status code) | 66 | 14 | 18 | 58 | R09, R10, R12, R13 |
| F11 | Hashing, pickling and identity (`__hash__`, `__reduce__`, cache keys, `__eq__`) | 11 | 4 | 6 | 5 | R01, R04, R09, R13 |
| F12 | Test-harness semantics the fix must satisfy (`raises`, `warns`, skip, monkeypatch) | 58 | 3 | 1 | 57 | all |
| F13 | Resource limits of the sandbox (4 GiB, command timeout, kill -9) | 9 | 0 | 5 | 5 | R07, R10 |

A task can carry signals of several families (66 tasks touch F10, 58 touch F12), so the table is a map of where to look, not a partition. The four bug-fix families of the taxonomy (unhandled input class, coordination failure, wrong logic, contract drift) are the *causes*; F1 to F13 are the *Python mechanisms* through which those causes surface.

---

## 2. Traps and post-mortem by family

Each family gets the same five parts: where it bites in the published set, the traps as the documentation states them, the first commands of a post-mortem, the shape of the accepted fix, and how the BCF brain covers it today.

### F1. Value and lookup errors: the wrong shape or the empty value

**Where it bites.** `fastapi_14303` and `fastapi_14356` (iterating `FormData.items()` yields only the last value of a repeated key, so an extra field keeps one value instead of several), `fastapi_13537` (an empty string never falls back to the `None` default), `fastapi_15763` (an empty leaf path is rejected when the router has a nested prefix), `fastapi_14297` and `fastapi_14616` (the statement itself names a `TypeError` for optional sequences), `rich_3506` and `rich_3521` (a character index estimated from a cell position as if every character were one cell wide), `rich_3934` (an empty `Live` view), `requests_6589` (`len()` on a string counts characters, so `Content-Length` is wrong for multi-byte text).

**Traps in the documentation.**

- `ValueError` is raised "when an operation or function receives an argument that has the right type but an inappropriate value, and the situation is not described by a more precise exception such as IndexError" (`library/exceptions`). `LookupError` is the base "when a key or index used on a mapping or sequence is invalid" (`IndexError`, `KeyError`).
- `KeyError` is a trap for anyone who reads its message as text: `str()` on a `BaseException` returns "the representation of the argument(s)", so the key is printed with its quotes, and a fix that compares `str(exc)` to a bare value fails.
- The official tutorial tells you to be specific and to let the rest propagate: "it is good practice to be as specific as possible with the types of exceptions that we intend to handle, and to allow any unexpected exceptions to propagate on" (`tutorial/errors`). A new `except ValueError` that swallows a lookup error turns a crash into a silent wrong value, which is how half of this family was born.

**Post-mortem, first three commands.**

1. Print the input as the code sees it, not as the statement shows it: one `repro` whose script builds the failing request or string and prints `type(value)`, `len(value)` and `repr(value)` at the entry of the suspect function.
2. `grep` for the access pattern before the comparison pattern: `.items()`, `.pop(`, `len(`, `getlist`. The defect is an access, hardly ever a comparison.
3. Decide between "collapse" and "empty": if several values become one, follow the container; if one value becomes nothing, follow the default.

**Shape of the accepted fix.** One to four lines that replace an iteration with `getlist` or a guard for the empty value at the place where the value is produced. Median gold patch for this family is under ten lines.

**Brain coverage.** Route P1 or P2 with the VAL hint ("multi-value containers often collapse to the last value"). The hint is correct for FastAPI and silent for rich's cell arithmetic; a WID task gets the WID hint instead, which is the right split.

### F2. Type and attribute protocol: the capability check that was an `isinstance`

**Where it bites.** `requests_7433`, `requests_7502`, `requests_7505` (file wrappers that expose `read` through `__getattr__` fail an `isinstance` check against a runtime-checkable protocol), `fastapi_9555` (the statement names `RuntimeError` and `AttributeError`; the fix detects coroutine and generator kinds from the unwrapped call), `fastapi_14458` (a class dependency with `async def __call__` is not awaited), `fastapi_9753` (`functools.partial` dependables), `rich_3006` (a custom `__eq__` whose default equals `Parameter.empty`), `rich_3472` (a dataclass field missing on the instance), `rich_3894` (`__qualname__` is not a string).

**Traps in the documentation.**

- `AttributeError` is raised "when an attribute reference or assignment fails. (When an object does not support attribute references or attribute assignments at all, TypeError is raised.)" and carries `name` and `obj` (added in 3.10). Read `e.name` instead of parsing the message.
- `isinstance()` triggers `__getattr__` and descriptors; `inspect.getattr_static()` "retrieve[s] attributes without triggering dynamic lookup via the descriptor protocol, `__getattr__()` or `__getattribute__()`". That asymmetry is the whole bug in the three requests tasks: a proxy answers `hasattr(proxy, "read")` with `True` and a static lookup with nothing (verified locally: `hasattr` is `True`, `getattr_static` returns the default).
- Coroutine detection has three right answers. `inspect.iscoroutinefunction()` returns `True` "if the object is a coroutine function ..., a functools.partial() wrapping a coroutine function, or a sync function marked with markcoroutinefunction()" (changed in 3.8 and again in 3.12). It returns `False` for a class whose `__call__` is `async def` and for a function wrapped by `functools.wraps` around an async function (both verified locally on 3.12.10 and 3.13.15). `inspect.isawaitable()` answers a different question (is this object awaitable now) and is `False` for a plain async function object.
- "It's recommended to only subclass one exception type at a time to avoid any possible conflicts between how the bases handle the args attribute, as well as due to possible memory layout incompatibilities" (`library/exceptions`); some built-in exceptions cannot be multiply inherited at all.

**Post-mortem.**

1. Print the real type and the real access path: `type(obj)`, `hasattr(obj, "read")`, `inspect.getattr_static(obj, "read", None)`, `inspect.iscoroutinefunction(obj)`, `inspect.unwrap(obj) is obj`. Four of these five lines decide every task in this family.
2. Ask which side is wrong: the caller that used a type check, or the callee that hides a capability behind `__getattr__`. In this set it is always the caller.
3. For "coroutine was never awaited" or "object coroutine is not awaitable": check whether the callable was unwrapped before `iscoroutinefunction` was consulted.

**Shape of the accepted fix.** Replace the check, not the caller: `hasattr(obj, "read")` or `callable(getattr(obj, "read", None))` instead of `isinstance(obj, HasRead)`; unwrap `functools.partial` and `__wrapped__` before deciding how to call.

**Brain coverage.** The OBJ hint ("Replace type checks with capability checks where duck-typed objects are accepted") is exactly this, but it fires only when the statement's words match the OBJ domain regex (`isinstance`, `hasattr`, `__getattr__`, `__wrapped__`, `__call__`, `pickl`, `hash`, ...). `fastapi_9555`, `fastapi_9753` and `fastapi_14458` live in the DI domain in the taxonomy and get the DI hint. One line added to the DI hint ("decide coroutine versus plain from the unwrapped callable, and check `async def __call__` on instances") would close that hole.

### F3. Name and import resolution: the name that exists only at type-check time

**Where it bites.** `fastapi_5077` (the statement shows a `NameError` four times: forward references on functions wrapped with `functools.wraps`), `fastapi_14485` (the gold patch adds a `NameError` path: stringified annotations that name types imported under `if TYPE_CHECKING:`), `fastapi_11355` (evaluate stringified annotations with `inspect.signature` and `eval_str` on 3.10 and later).

**Traps in the documentation.**

- `NameError` is "raised when a local or global name is not found. This applies only to unqualified names", with a `name` attribute since 3.10. `ImportError` is raised "when the import statement has troubles trying to load a module" **and** "when the 'from list' in from ... import has a name that cannot be found", so a failed `from x import y` is an `ImportError` with `name` set to the module, not a `NameError`.
- `typing.get_type_hints(obj, globalns=None, localns=None, include_extras=False)`: "Forward references encoded as string literals or ForwardRef objects are handled by evaluating them in globalns, localns, and (where applicable) obj's type parameter namespace. If globalns or localns is not given, appropriate namespaces" are derived from the object. The namespace is taken from the function object, so a wrapper created by `functools.wraps` makes the annotation resolve against the **wrapper's** module unless `__wrapped__.__globals__` is used: that is `fastapi_5077`.
- `inspect.signature(callable, *, follow_wrapped=True, globals=None, locals=None, eval_str=False)`: with `eval_str=False` (the default) string annotations stay strings (verified: `signature` prints `(x: 'NotFound')`); with `eval_str=True` the string is evaluated and an unresolvable name raises `NameError` (verified locally on 3.12.10 and 3.13.15). So the same function gives a string on 3.9 and a class on a newer runtime with `eval_str=True`.
- A name imported under `if TYPE_CHECKING:` does not exist at run time by construction. `from __future__ import annotations` (PEP 563) makes **every** annotation a string, which converts a run-time `NameError` at import into a deferred `NameError` at introspection time.

**Post-mortem.**

1. Reproduce the resolution the way the library does it, in one line: `typing.get_type_hints(fn)`, then `inspect.signature(fn, eval_str=True)`. Whichever raises is the path the library must fix.
2. `grep` the name: if its only definition is inside `if TYPE_CHECKING:`, the fix is to evaluate against the right globals or to import lazily, never to add the name to the type-checking block.
3. Check for a wrapper between the annotation and the function: `fn.__wrapped__`, `functools.partial`.

**Shape of the accepted fix.** One more unwrap or namespace step in the single resolver function (`get_typed_signature` or its sibling).

**Brain coverage.** The TYP hint ("Resolve the annotation the way typing.get_type_hints does; check wrapped/deferred/Annotated forms") is accurate. Route: these are P3 in the taxonomy (short statements), and the TYP domain ranks fourth in the domain table, after VAL, which matches `field`, `default`, `validation` and other generic words first. A statement about a wrapped function with a `field` in it is classified VAL. Moving TYP ahead of VAL, or requiring two VAL words before VAL wins, is a one-line change (see Section 8).

### F4. Type introspection and version branches: legal syntax the resolver never handled

**Where it bites.** `fastapi_14430` (optional sequences combined with `None` through PEP 604, whose origin is `types.UnionType` and not `typing.Union`), `fastapi_12942` and `fastapi_14512` (a discriminator merged twice inside `Annotated`), `fastapi_13920` (PEP 695 `TypeAliasType`), `fastapi_14482` (arbitrary types), `requests_6757` (urllib3 major-version branch), `fastapi_14186` and `fastapi_14583` (Pydantic v1 parallel stack on newer Pythons).

**Traps in the documentation and in the probes.**

- `int | None` creates a `types.UnionType` ("The type of union type expressions. Added in version 3.10"), and `typing.Union[int, None]` is a different object of a different type; the two compare equal (`u == typing.Optional[int]` is `True`). `typing.get_origin(int \| None)` returns `types.UnionType` on 3.12 and 3.13 (verified), so a resolver that tests `origin is typing.Union` misses every pipe union. In 3.14 the two types were unified and `get_origin` returns `typing.Union` instead (verified on 3.14.7): the trap moves rather than disappears.
- `isinstance(3, int \| None)` is allowed (verified), so a capability check can replace the origin test for simple unions.
- `typing.get_type_hints` strips `Annotated` metadata unless `include_extras=True`; the metadata lives in `__metadata__`, and `get_origin()` on an `Annotated` type returns `Annotated` itself.
- A PEP 695 alias is a `TypeAliasType` object; `get_type_hints` on a function annotated with the alias returns the alias object, not its value (verified on 3.12.10 and 3.13.15). The value is in `alias.__value__`.
- Python 3.13 removed the "dead batteries" (PEP 594: "Remove 'dead batteries' from the standard library", listed in "What's New In Python 3.13"), and the sandbox image restores exactly two of them by hand (`imp.py`, `telnetlib.py`). Any other removed module is a `ModuleNotFoundError` on the scorer and an import that works on a 3.12 notebook.
- PEP 667 (3.13): "The locals() builtin now has defined semantics when mutating the returned mapping". Code that writes `locals()[name] = value` inside a function has never been guaranteed to work; on 3.12 and 3.13 my probe shows the write has no effect in either version, and 3.13 is the first version that documents it.

**Post-mortem.**

1. Print the annotation object, not its text: `repr(annotation)`, `type(annotation).__name__`, `typing.get_origin(annotation)`, `typing.get_args(annotation)`.
2. `grep` the resolver for the comparison that failed (`is typing.Union`, `== Union`, `get_type_hints(` without `include_extras`).
3. For a version task, print the version the library reads (`sys.version_info`, `importlib.metadata.version`) next to the version the branch expects.

**Shape of the accepted fix.** One more branch in the hand-written resolver, or one version branch moved into a single place.

**Brain coverage.** Same TYP hint and the CMP hint ("Branch on the runtime version once, in one place; keep both code paths importable"), both correct.

### F5. Non-termination and recursion: the loop that cannot end

**Where it bites.** `rich_3480` (a generator iterates the very list it appends to), `rich_4006` (the grapheme splitter does not advance its index for input that starts with an escape or a variation selector), `rich_3772` (the traceback extractor follows `__cause__` and `__context__` without a visited set and loops on `raise e from e`).

**Traps in the documentation.**

- `RecursionError` "is derived from RuntimeError. It is raised when the interpreter detects that the maximum recursion depth (see sys.getrecursionlimit()) is exceeded." A deep recursion therefore appears as a `RuntimeError` to any `except RuntimeError` handler.
- "If a generator code directly or indirectly raises StopIteration, it is converted into a RuntimeError (retaining the StopIteration as the new exception's cause)" (PEP 479; verified: the message is `generator raised StopIteration`). A `next()` call inside a generator body that expects `StopIteration` to escape will never see it escape.
- Chaining: `raise X from Y` sets `__cause__` and "__suppress_context__ attribute to True"; an implicit chain is kept in `__context__` and shown "only if __cause__ is None and __suppress_context__ is false" (`library/exceptions`). `raise new_exc from None` "effectively replaces the old exception with the new one for display purposes ..., while leaving the old exception available in __context__". A `raise e from e` cycle is safe for the interpreter (the standard traceback printed three lines and stopped in my probes on 3.12.10 and 3.13.15), so a hang here is in the walker, not in Python.
- Comprehension inlining (PEP 709, 3.12): "Comprehension iteration variables remain isolated and don't overwrite a variable of the same name in the outer scope, nor are they visible after the comprehension." A loop counter or a flag set inside a comprehension body is not visible outside it on 3.12 and later.

**Post-mortem.** A hang leaves no traceback, so the post-mortem is built from the outside:

1. Rerun with a hard wall: the helper's `repro` kills the script after 40 seconds and reports `TIMEOUT` with the tail of the output; the last printed line names the iteration that never finished.
2. Print the index before and after each step of the suspect loop for the smallest failing input (`rich_4006` fails on a two-character string).
3. For any walk over a graph of exceptions or objects, check for a `seen` set before anything else.

**Shape of the accepted fix.** A visited set, an index increment, or iterating over a copy.

**Brain coverage.** The WID hint tells the model to "run a one-line script printing widths/segments for the failing input before editing", which is the right instrument; the DBG hint does not mention non-termination. The repro timeout (40 seconds) is the only defence against a hang inside a test: `test` stops at 45 seconds, well inside the harness limit of 240.

### F6. OS and I/O errors: the pipe, the file and the terminal

**Where it bites.** `rich_3468` (a broken pipe raises a traceback instead of exiting), `rich_3675`, `rich_3777`, `rich_4077` (`isatty` detection that ignores the proxied file), `rich_4075` (`print` with `end=""`), `rich_3470` (recording continues while a capture is active), `requests_7205` (an empty netrc entry; the statement names `NetrcParseError`), `requests_7328` (each redirect response contains itself in its history), `httpx_3672` (the keep-alive cycle never completes; `KeyboardInterrupt` appears in the test patch), `fastapi_15023` (an image file left open in a stream), `fastapi_15800` (the test patch raises `OSError`, `PermissionError` and `NotImplementedError`).

**Traps in the documentation.**

- `OSError` "is raised when a system function returns a system-related error, including I/O failures such as 'file not found' or 'disk full' (not for illegal argument types or other incidental errors)". The constructor "often actually returns a subclass of OSError ... The particular subclass depends on the final errno value", which is why `IOError is OSError` is `True` and `isinstance(e, FileNotFoundError)` holds for an `ENOENT` (verified). The attributes are `errno`, `strerror`, `filename`, `filename2`, and `winerror` only on Windows. "If three arguments are passed, the args attribute contains only a 2-tuple of the first two constructor arguments", so `e.args` is not a reliable third source.
- `errno.ENOENT` "is mapped to the exception FileNotFoundError", `EPERM` to `PermissionError`, `EINTR` to `InterruptedError` (`library/errno`). The Docker backend starts every sandbox with `network_mode='none'` (harness source, `swegemma/sandbox/docker.py`). A competitor who ran the gold patches through that backend reports that the eight requests tasks which open a connection and expect a timeout fail at once with `OSError: [Errno 101] Network is unreachable` (discussion 754586; whether the production scorer behaves the same is the open question of that thread).
- `GeneratorExit` and `SystemExit` "inherit from BaseException instead of Exception". `SystemExit` is raised by `sys.exit()` and "inherits from BaseException instead of Exception so that it is not accidentally caught by code that catches Exception". The official tutorial names the same group as the ones "not typically handled, because they are used to indicate that the program should terminate". `BrokenPipeError` is an `OSError` subclass, so an `except Exception` does catch it; the accepted fix in `rich_3468` converts it into a clean exit instead of a traceback.
- `subprocess.run(..., timeout=...)`: "If the timeout expires, the child process will be killed and waited for. The TimeoutExpired exception will be re-raised after the child process has terminated." `Popen` has `start_new_session` and `process_group`; the harness subprocess backend "executes commands in a new process group (`start_new_session=True`), terminating the full process group (`os.killpg(..., signal.SIGKILL)`) on command timeout" (HARNESS_README, section 4.1). A command that spawns children and exits leaves them running until the harness kills the group.
- `nvidia-smi`-style environment detection is irrelevant here, but `isatty` is not: `io.IOBase.isatty()` answers for **that file object**, and a proxy that forwards `read` and `write` but not `isatty` makes the wrapped file look non-interactive. That is the four-word fix in `rich_4077` ("proxy isatty").

**Post-mortem.**

1. Reproduce with the smallest fake: for a pipe, `python3 repro.py | head -1`; for a terminal, run under a `pseudo-terminal` or set the environment switch the library reads and unset it again.
2. Print the detection predicate at each decision point: `sys.stdout.isatty()`, `os.environ.get("FORCE_COLOR")`, `os.environ.get("NO_COLOR")`, `sys.__stdout__.fileno()`.
3. For a file error, print `e.errno`, `e.strerror` and `e.filename`; never the message.

**Shape of the accepted fix.** Catch `BrokenPipeError` (or `errno.EPIPE`) at the top level and exit cleanly; delegate `isatty` to the wrapped file; close a resource in a `finally` or a context manager.

**Brain coverage.** The CON hint ("Check the detection predicate (isatty, env var, pipe) and its default in each code path") is right for rich. No hint mentions the broken-pipe-exit idiom; adding "a broken pipe on stdout is an exit, not an error" to the CON hint is cheap.

### F7. Text encoding and Unicode: the byte that was a character

**Where it bites.** `requests_6589` (count UTF-8 bytes, not characters), `fastapi_13786` (the gold patch adds a `UnicodeDecodeError` path while stripping whitespace from `Authorization` credentials), `fastapi_14986` (Swagger UI JSON escaping), `rich_3063` (a trailing backslash is not escaped), `rich_3278` (private-use ANSI escape sequences), `rich_4076` (newlines in ANSI decoding), `rich_3454` and `rich_3067` (the URL highlighter stops at `@` and at `~`), `rich_3471`, `rich_3953`, `rich_3930` (zero-width joiners, generated Unicode tables).

**Traps in the documentation.**

- `UnicodeDecodeError`, `UnicodeEncodeError` and `UnicodeTranslateError` are subclasses of `UnicodeError`, which is a subclass of `ValueError`, so `except ValueError` silently catches an encoding problem. The instances carry `encoding`, `reason`, `object`, `start` and `end` (verified: `'utf-8'`, `invalid start byte`, 0, 1), which is more information than the message and is stable across versions.
- `len()` on a `str` counts code points; `len(s.encode("utf-8"))` counts bytes. `super_len` in requests measured the string and sent the count as `Content-Length`.
- The `re` module: `re.error` is the exception for a bad pattern; a pattern that "works" in a REPL and fails in a test is usually a raw-string problem (an escape such as `\b` that the string layer consumed first).
- The helper's own `_run` sets `PYTHONIOENCODING=utf-8` for every subprocess it starts (`repro`, `test`), so output printed through the helper is UTF-8 whatever the sandbox locale. The scorer's verification step runs pytest under `PYTHONSAFEPATH=1 PYTHONNOUSERSITE=1 python3 -s` (harness source) and sets no encoding variable, so an encoding that depends on the locale is one more thing a local pass does not prove.

**Post-mortem.**

1. Print `[hex(ord(c)) for c in s]` for the failing string; the variation selector or the zero-width joiner is invisible in normal output.
2. `grep` the regex or the encoder for the character class that excludes the failing character.
3. For a width bug, print `unicodedata.east_asian_width(c)`, `unicodedata.combining(c)` and the library's own measure for each character, in one line.

**Shape of the accepted fix.** One character or one character class added to a pattern, or `len(s.encode(...))` in place of `len(s)`.

**Brain coverage.** PAR and WID hints are right. Nothing in the brain tells the model that a hidden test compares exact segment strings for this family; the RCA found 35 tasks with Unicode signals and exact-string comparison in most of them, so the verify step should compare `repr()` of the output, not the printed output.

### F8. Warnings and deprecation: the exception that is not raised

**Where it bites.** `fastapi_14605` (a `FastAPIDeprecationWarning` class replaces `DeprecationWarning` in 20 files: 80 mentions of the class name across the statement, the gold patch and the test patch), `fastapi_14583` (deprecation warnings for `pydantic.v1`), `fastapi_14964` (deprecate `ORJSONResponse` and `UJSONResponse`), `fastapi_14851` (the gold patch catches `BaseException` twice around `on_event`; the test patch expects a `DeprecationWarning`), `fastapi_14186` (a parallel Pydantic v1 stack warns on newer Pythons), `rich_4070` (import-time refactor), `fastapi_15589` and `fastapi_14978` (stricter checks that raise where the old code was silent).

**Traps in the documentation.**

- A warning is not an exception until a filter makes it one. "The warnings filter controls whether warnings are ignored, displayed, or turned into errors (raising an exception)" (`library/warnings`). `warnings.warn()` "raise[s] an exception if the particular warning issued is changed into an error by the warnings filter".
- The default filter is the first trap. "In regular release builds, the default warning filter has the following entries (in order of precedence): `default::DeprecationWarning:__main__`, `ignore::DeprecationWarning`, `ignore::PendingDeprecationWarning`, `ignore::ImportWarning`, `ignore::ResourceWarning`." So a library's own `DeprecationWarning` is **invisible** in a normal run and **visible** only from code in `__main__` or under pytest, which "will display DeprecationWarning and PendingDeprecationWarning warnings from user code and third-party libraries, as recommended by PEP 565" (pytest documentation, "How to capture warnings"). An agent that runs the snippet from the statement and sees no warning concludes the warning is not emitted, and then "fixes" the wrong layer.
- The registry is the second trap. "If a warning has already been raised because of a once / default rule, then no matter what filters are set the warning will not be seen again unless the warnings registry related to the warning has been cleared" (`library/warnings`, on `catch_warnings`). My probe shows the mechanism: the same call warns once under `default` and twice under `always`, and `__warningregistry__` appears in the function's globals after the first call. A fix that adds `warnings.warn(...)` in a function that was already imported will not show anything in a long-lived process, including a test session that imported the module earlier.
- `stacklevel` is the third. `warnings.warn(message, category=None, stacklevel=1, source=None, *, skip_file_prefixes=())`: with the default the warning is attributed to the line that calls `warn`, so the warning names library code instead of the user's line, and a test with `pytest.warns` that matches on the message still passes while a test with a filter on the module name does not.
- Escalation is a one-way door: `filterwarnings = error` in `pytest.ini` turns every warning into a failure, and a `catch_warnings` block "can only be guaranteed in a single-threaded application" (`library/warnings`).
- `unittest.skipIf`, `skipUnless` and `SkipTest` are the unittest side of the same rule; `@unittest.skip` and raising `SkipTest` are documented equivalents (`library/unittest`).

**Post-mortem.**

1. Run the snippet with `-W error::DeprecationWarning` or inside `with warnings.catch_warnings(record=True): warnings.simplefilter("always")`. If nothing is recorded, the warning is not emitted; if something is, the bug is in the filter or the `stacklevel`, not in the emitter.
2. Check where the class is defined and whether it is the one the tests import. The statement of `fastapi_14605` gives the class name; `fastapi_14609` removes the class it deprecates and introduces `PydanticV1NotSupportedError`, a name the statement does not give (RCA: "removals ... expect a new exception class the statement does not name").
3. For a behaviour change that turns silence into an error, find the one place that decides (a status constant, a content-type check) and change that place only; a check added at a second entry point is how the next regression is born (RCA, section 6.6: `requests_6644` introduced the path trimming that `requests_7315` removed).

**Shape of the accepted fix.** A new `Warning` subclass, every `warnings.warn` switched to it, and the tests asserting with `pytest.warns(FastAPIDeprecationWarning)`.

**Brain coverage.** The CMP hint ("Branch on the runtime version once, in one place") and the C4 keyword rule cover the vocabulary. The solver prompt says nothing about warnings, and the model's natural instinct (search for `raise`) finds nothing: 80 mentions of a warning class and not one `raise`. One sentence in the solver core ("when the statement names a `*Warning`, search for `warnings.warn` and for the class definition, not for `raise`") is the cheapest fix in this document.

### F9. Async and lifecycle: the coroutine, the exit stack and the teardown order

**Where it bites.** `fastapi_14099` (the request exit stack closes as soon as the response object is returned instead of after the body is streamed: five files, difficulty 5), `fastapi_14458` (class dependencies with a coroutine `__call__` are awaited as if they were coroutines), `fastapi_9555` and `fastapi_9753` (wrapped and partial dependables), `fastapi_14301` (a function-scoped, parameterless dependency loses its scope), `fastapi_14873` (`on_startup` handlers are wiped by the `Router` init order), `fastapi_14851` (`on_event` reimplemented ahead of the next Starlette), `fastapi_15030` (the server-sent-events patch touches `CancelledError` and `TimeoutError`), `httpx_3672` (the keep-alive cycle, with `KeyboardInterrupt` in its test patch).

**Traps in the documentation and in the probes.**

- `ExceptionGroup` and `BaseExceptionGroup` (3.11): "BaseExceptionGroup extends BaseException and it can wrap any exception, while ExceptionGroup extends Exception and it can only wrap subclasses of Exception. This design is so that except Exception catches an ExceptionGroup but not BaseExceptionGroup." A task group that fails with a cancelled child raises a group that `except Exception` does not catch.
- `except*` splits, it does not select: "When an exception group is raised in the try block, each except* clause splits (see split()) it into the subgroups of matching and non-matching exceptions. If the matching subgroup is not empty, it becomes the handled exception ... and assigned to the target of the except* clause", and "break, continue and return cannot appear in an except* clause". A bare `except*` is a `SyntaxError`, and `except` and `except*` cannot be mixed in one `try` (verified by compiling the forms locally on 3.12.10 and 3.13.15: the mix raises `SyntaxError`).
- `contextlib.ExitStack` "is designed to make it easy to programmatically combine other context managers and cleanup functions, especially those that are optional or otherwise driven by input data" (added in 3.10; `AsyncExitStack` in 3.7). `@contextmanager` has a documented rule that is the whole of `fastapi_14099`: "If an exception is trapped merely in order to log it or to perform some action (rather than to suppress it entirely), the generator must reraise that exception. Otherwise the generator context manager will indicate to the with statement that the exception has been handled."
- Coroutine detection is the F2 trap again, with a lifecycle consequence: `inspect.iscoroutinefunction()` is `True` for an `async def` and for a `functools.partial` of one, and `False` for an instance whose `__call__` is `async def` (verified on 3.12.10 and 3.13.15). `asyncio.CancelledError` inherits from `BaseException` (changed in 3.8), so a `try/except Exception` around an `await` does not observe a cancellation, and a `finally` that assumes a normal exit runs on cancellation too.
- `finally` can swallow: "If the finally clause executes a return, break or continue statement, the saved exception is discarded" (verified: `swallower()` returns `"returned from finally"` and the `ValueError` is lost). Python 3.14 adds a `SyntaxWarning` for this (seen on 3.14.7); 3.12 and 3.13 accept it silently.
- The tutorial's rule for the order of handlers: "Exception handlers do not handle only exceptions that occur immediately in the try clause, but also those that occur inside functions that are called (even indirectly) in the try clause", and the `else` clause "is executed if the control flow leaves the try suite, no exception was raised, and no return, continue, or break statement was executed. Exceptions in the else clause are not handled by the preceding except clauses" (verified).

**Post-mortem.**

1. Print the order of events, not the values: wrap each constructor and each hook in a one-line print of `repr(self)` and the hook name. `fastapi_14873` is a constructor-order bug (`init`, `include`, `startup`, `teardown`), and the printout shows the wipe in three lines.
2. For a teardown bug, assert where the resource closes: a repro that opens a stream and checks that the dependency's code after `yield` has not run before the first chunk is consumed. The repro must fail before the fix; `fastapi_14099` is the proof that a test which passes before the fix proves nothing (65.7% of tasks had tests that passed pre-patch, discussion 760014).
3. For a coroutine bug, print `inspect.iscoroutinefunction()` on the unwrapped callable and on the instance.

**Shape of the accepted fix.** One branch in the dependency solver that decides between `await callable(...)` and `await callable().__call__()`, or a stack that is closed in the response's `finally` instead of in the dependency's `finally`.

**Brain coverage.** The DI hint ("Find where the dependency graph is built and cached; check hashing, scopes and callable wrapping") and the RTG hint ("Follow construction order (init, include, startup, teardown)") are both right. The repro rule of the solver prompt ("it must FAIL before the fix") is the only defence against the false "done" of this family.

### F10. Custom exceptions and contracts: the name, the message, the status code

**Where it bites.** 66 tasks carry the signal and 58 of them carry it in the test patch. `fastapi_14258` (a clear error when a router includes itself; the test asserts an exact message), `fastapi_13786` (401 with `WWW-Authenticate` instead of 403; the statement's own header value contradicts the tests), `fastapi_15280` (`@app.vibe()`; the hidden test requires `FastAPIError` with the message "Are you kidding me? Happy April Fool's"), `fastapi_14262` (`DependencyScopeError`), `fastapi_14609` (`PydanticV1NotSupportedError` in eight files), `fastapi_15661` (`RuntimeError` seven times in a release script), `fastapi_15588` (`ValueError` for multi-line server-sent-event fields), `fastapi_14306` and `fastapi_14791` (validation-error messages and schema: endpoint file, line, function and route), `rich_3882` (prompt validation errors print raw markup), `rich_3486` and `rich_3676` (fine-grained error locations and notes in tracebacks), `rich_3772`.

**Traps in the documentation.**

- "In Python, all exceptions must be instances of a class that derives from BaseException. In a try statement with an except clause that mentions a particular class, that clause also handles any exception classes derived from that class" (`library/exceptions`). So a new `FastAPIDeprecationWarning(DeprecationWarning)` is caught by every existing `except DeprecationWarning`, and a new `PydanticV1NotSupportedError` that does not derive from the class the caller catches is a crash on the caller's side.
- `BaseException` "is not meant to be directly inherited by user-defined classes (for that, use Exception)". Catching `BaseException` (as the gold patch of `fastapi_14851` does, twice) also catches `KeyboardInterrupt` and `SystemExit`: right in a framework shim, wrong in library code that then re-raises nothing.
- `args` is a tuple and `str()` returns "the representation of the argument(s) to the instance, or the empty string when there were no arguments". An exception defined with `__init__(self, detail: str)` and no `super().__init__(detail)` has an empty message and `args == ()`; a test with `match=` then fails on the message, not on the class.
- `pytest.raises` "will match the exception type or any subclasses (like the standard except statement)" (pytest documentation, "Assertions about exceptions"). A test with `pytest.raises(RuntimeError)` passes when the code raises `NotImplementedError` or `RecursionError`. The inverse is the agent's risk: a fix that raises a broader class than the test expects is not noticed until the test asserts `excinfo.type is ...`.
- `add_note()` adds "the string note to the exception's notes which appear in the standard traceback after the exception string. A TypeError is raised if note is not a string. Added in version 3.11." Notes are a second channel for context that tests can read from `e.__notes__` (verified) and that the traceback printer shows; `rich_3676` is the task that renders them.
- PEP 657 (3.11): "Fine-grained error locations in tracebacks" put the caret under the exact expression. A test that compares a rendered traceback (`rich_3486`) is comparing against the 3.11+ format; under the 3.13 sandbox the locations are the same as under 3.12, but under 3.14 the `SyntaxWarning` for a return in `finally` adds one more line to the same file.

**Post-mortem.**

1. Read the test's assertion, not the statement's prose, when the two disagree. For a contract task the statement is a summary and the test is the contract; `fastapi_13786` documents a header value the tests reject.
2. When the required name is not in the statement (`fastapi_14609`, `fastapi_14262`, `fastapi_15280`), follow the repository's convention: the class is named after the concept with the `Error` or `Warning` suffix, defined next to its sibling in the same module. The RCA's judgement stands: 19 tasks require a new public name the statement does not give, 18 of them severe, mean difficulty 4.32. The post-mortem for a failed task of this kind is "the name was unguessable", not "the model was weak".
3. For a message task, build the message with `repr` of the pieces in a one-line script and compare it character for character with the expected string from the test output. Whitespace, quotes and a colon are the usual differences.

**Shape of the accepted fix.** One class, one `raise`, one message; or one status constant changed in one place (`fastapi_14077`: a literal 422 instead of a deprecated Starlette constant).

**Brain coverage.** The solver prompt's rule "Treat every concrete string in the issue as a literal that must appear in the code" is the right instruction. The SEC and OAS hints cover the status and schema cases. Nothing tells the model that a test may assert the exact *type* of an exception through `excinfo.type`, which is why the exact class of a `raise` matters as much as its message.

### F11. Hashing, pickling and identity: the key that stopped being a key

**Where it bites.** `fastapi_14372` (`Depends()` and `Security()` results must be hashable), `fastapi_14419` (the dependency cache key always includes inherited security scopes, so a dependency reached through different parents is never reused), `requests_6629` (`JSONDecodeError` must be picklable; the gold patch touches `IOError` and a `CompatJSONDecodeError`), `rich_3006` (a custom `__eq__` whose default equals `Parameter.empty`), `rich_2943` (the style cache is not invalidated), `rich_3894` and `rich_3472` (identity and introspection of dataclasses).

**Traps in the documentation.**

- `pickle.PicklingError` is the "error raised when an unpicklable object is encountered by Pickler. It inherits from PickleError". An exception pickles by its class and its `args`; a subclass that stores state in attributes the base does not know about (the `requests_6629` case: a JSON decode error with a custom `__init__` and a `__reduce__` that delegates to the wrong parent) unpickles as the base class or not at all.
- `functools.lru_cache`, dictionary keys and set members all require hashable arguments; an unhashable argument is a `TypeError: unhashable type`, which reads as a type bug and is a contract bug. A class that defines `__eq__` without `__hash__` becomes unhashable from that point down its subclasses (the default `__hash__` is set to `None` when `__eq__` is defined).
- `weakref`: a weak reference is cleared when the referent is garbage collected (the call returns `None`: verified), while a weak proxy raises `ReferenceError` on access to a dead referent. A cache keyed by weak references loses entries that a strong cache would keep, which is the symptom of `rich_2943`.

**Post-mortem.**

1. Print `hash(obj)` and `obj == other` for the two objects the cache should have merged; then print the key the cache computed. In `fastapi_14419` the key is correct and the scope list inside it is wrong.
2. For a pickle failure, run `pickle.loads(pickle.dumps(exc))` in the `repro` and print `type(restored)`, `restored.args` and the restored attributes.
3. For an equality failure, print `obj == other` **and** `other == obj`, then `Parameter.empty` against the class's sentinel.

**Shape of the accepted fix.** A `__hash__` that hashes what `__eq__` compares, a `__reduce__` that delegates to the right parent, or a cache key computed from the same fields the consumer uses.

**Brain coverage.** The DI hint mentions hashing; the OBJ hint mentions `hash`. No hint mentions `__reduce__` or `__eq__` without `__hash__`; one clause in the OBJ hint would do.

### F12. Test-harness semantics: what "passing" means to the scorer

**Where it bites.** 58 test patches use the pytest API in a way the fix must satisfy: `pytest.raises` in 13, `monkeypatch` in 6, `tmp_path` in 4, `TestClient` in 44. The skip markers of `fastapi_14186` and `rich_3486` make two tasks unsatisfiable in one environment; the `httpbin` fixture makes eight requests tasks fail without a network.

**Traps in the documentation and in the harness source.**

- Exit codes (pytest documentation): "Exit code 0: All tests were collected and passed successfully. Exit code 1: Tests were collected and run but some of the tests failed. Exit code 2: Test execution was interrupted by the user. Exit code 3: Internal error happened while executing tests, or a plugin raised while importing. Exit code 4: pytest command line usage error, including a plugin that cannot be found or a conftest.py that fails to import. Exit code 5: No tests were collected. Exit code 6: Maximum number of warnings exceeded". A pipe hides the code: `pytest ... | tail` returns the exit status of `tail` (0) whether or not tests failed (discussion 760595). The BCF `test` command prints the real status and maps 2 to 5 to `ERROR` (`parts/_bcf_head.py`, `cmd_test`).
- `pytest.raises(..., match=...)` applies `re.search` to the string of the exception, so a message with parentheses or brackets needs escaping; `pytest.warns` requires at least one matching warning, and `pytest.warns(None)` (record anything) is rejected by current pytest.
- `monkeypatch.setattr(obj, name, value, raising=True)`: "The raising parameter determines if a KeyError or AttributeError will be raised if the target of the set/deletion operation does not exist." A test that patches `module.Function` fails with `AttributeError` in setup when the fix renamed or did not create that attribute, and that failure is reported as an error in the test, not as a failure of the assertion. "All modifications will be undone after the requesting test function or fixture has finished."
- Skips (pytest documentation): "it is also possible to skip imperatively during test execution or setup by calling the pytest.skip(reason) function"; `pytest.importorskip("mod")` "will lead to a skip outcome of the test" when the module is missing. The scorer treats a skipped required test as a failure: `resolved` requires the exit code 0 **and** a JUnit report with at least one passed test, no failures and no errors **and** "every required test node (FAIL_TO_PASS, PASS_TO_PASS, or test functions extracted from test_patch) explicitly passed without being skipped" (HARNESS_README, section 8.2; `_validate_junit_xml` in `harness/verification.py`).
- Protected paths: any change the agent makes to `test_*.py`, `*_test.py`, a `.py` under `tests`, `test` or `testing`, `conftest.py`, `pytest.ini`, `pyproject.toml`, `tox.ini`, `setup.cfg`, `.pytest.ini`, `sitecustomize.py`, `usercustomize.py`, `_swegemma_stubs.py` or a `.pth` file is removed from the patch before the test patch is applied. **`pyproject.toml` is on that list**: a task whose reference fix adds a dependency or changes a version range (`fastapi_14077`, `fastapi_15030`) cannot be completed by editing the file the statement talks about; the change is discarded and the tests run against the old dependency set.
- The verification command is `PYTHONSAFEPATH=1 PYTHONNOUSERSITE=1 python3 -s -m pytest <targets> --junitxml=... -p no:anyio -o timeout=0 -o python_classes="Test* *Test" -q`. `-s` and `PYTHONNOUSERSITE` ignore the user site, `PYTHONSAFEPATH` keeps the working directory off `sys.path` (the package is imported from its editable install, not from `/workspace`), `-p no:anyio` disables the anyio plugin's strict mode, and `-o timeout=0` disables per-test timeouts. A repro that passes with a bare `python3 -m pytest` can fail under these flags for a reason that has nothing to do with the fix.

**Post-mortem.**

1. Run the exact verification form once per session on a known-passing task to learn what the sandbox's pytest reports; then run the single test file with the helper (`test path -k name`), which adds the same `-x -q -p no:cacheprovider` but not the five flags above. A difference between the two outcomes is a harness-semantics difference, not a code difference.
2. Read the test's **setup** lines before its assertions: a `monkeypatch.setattr` of a name the fix did not create explains most "the fix is right but the test errors" outcomes.
3. Classify every local failure into one of four buckets before touching the code again: (a) the fix is wrong; (b) the test needs a dependency the sandbox lacks (`inline_snapshot`, `dirty_equals`, `httpbin`: 29 tasks, 22.5% of the set); (c) the test is skipped or unsatisfiable in this interpreter (two tasks); (d) the harness flags change the outcome. Only bucket (a) is worth more budget.

**Brain coverage.** The solver prompt already says "Failures caused by missing fixtures or unrelated imports existed before your change: ignore them and never repair tests", and the helper refuses protected paths. Three gaps remain: the helper's `test` command does not use the scorer's five flags (see Section 8), the helper's `PROTECTED_RE` is narrower than the harness's rule for nested test directories (a `.py` file under `tests/some/dir/` that is not named `test_*` is writable through the helper and discarded by the scorer), and nothing tells the model that `pyproject.toml` is protected.

### F13. Resource limits of the sandbox: the process that was killed

**Where it bites.** Nine tasks carry a signal (threads, sleeps, signals, a `137`); the RCA lists `fastapi_15800` (tests that raise `OSError` and `PermissionError`) and the rich console tasks that spawn threads. The limits themselves come from the harness, not the tasks.

**Traps in the documentation and in the harness source.**

- The container runs with `network_mode='none'`, a 4 GiB memory limit ("processes exceeding this are killed with exit code 137 / SIGKILL", HARNESS_README) and a 2-vCPU quota. `MemoryError` is raised only when the interpreter notices; the kernel's OOM killer ends the process with 137 and no traceback, and `subprocess.run` reports a negative return code for a signalled child.
- `run_command` has "Timeout: min(command_timeout_seconds [300s], max(5, int(remaining_time_seconds)))" and a command that times out returns `error_type: "TimeoutExceeded"` "without ending the agent session". The command's own children keep running until the process group is killed. A test run that leaves a server thread behind (a `TestClient` bound to a lifespan that never completes) holds the slot.
- `PythonFinalizationError` (added in 3.13) "is derived from RuntimeError. It is raised when an operation is blocked during interpreter shutdown", for example "Creating a new Python thread. os.fork()". A `threading.Thread` started from an `atexit` handler is a `RuntimeError` on 3.13 and worked (or silently did nothing) earlier.
- `sys.excepthook` "prints out a given traceback and exception to sys.stderr. When an exception other than SystemExit is raised and uncaught, the interpreter calls sys.excepthook". A thread that dies prints through `threading.excepthook` (added in 3.8) and does not stop the process, so a background thread's failure is invisible in the exit code.

**Post-mortem.**

1. Look for `137`, `Killed` or an empty stderr with a non-zero code: that is the memory limit, and the fix is to stream instead of loading, never to raise the limit.
2. For a command that returns `TimeoutExceeded`, rerun the same command through the helper's `repro` (40-second kill) and read the last printed line.
3. For a thread that vanished, check `threading.excepthook` in the repro: install a hook that prints the exception, and the hidden failure shows up.

**Brain coverage.** The helper's own timeouts are well inside the harness limits (45 seconds for a test, 40 for a repro, 20 for a search, 8 for the first scan pass). The solver prompt's rule "Never run the whole test suite" is the defence for memory. No rule covers a thread left behind by a test.

---

## 3. Cross-cutting traps of the language itself

These apply to every family. Each was verified today, either in the documentation or by running the same probe on 3.12.10, 3.13.15 and 3.14.7 on this machine (`scratch/2026-11-24-bcf-tuning-parity/scripts/py_probe.py`).

| Trap | What the documentation says | Verified behaviour | Consequence for an agent in this sandbox |
| --- | --- | --- | --- |
| The `except ... as name` binding is deleted | "When an exception has been assigned using as target, it is cleared at the end of the except clause. This is as if: `except E as N: try: foo finally: del N`" | `NameError` on the name after the block on 3.12 and 3.13 | Store the exception in another name before leaving the block if it is needed afterwards |
| A bare `raise` outside a handler | The tutorial shows the bare `raise` to re-raise inside a handler | `RuntimeError: No active exception to reraise` outside one | Re-raise only inside `except`; a helper function that re-raises must receive the exception |
| Chaining changes the traceback the tests see | `raise X from Y` sets `__cause__` and `__suppress_context__ = True`; `from None` keeps `__context__` but hides it | Verified on 3.12 and 3.13 | A wrapped exception is a different type from the one the test expects unless it derives from it |
| `finally` discards, `else` escapes | "If the finally clause executes a return, break or continue statement, the saved exception is discarded"; "Exceptions in the else clause are not handled by the preceding except clauses" | Verified on 3.12 and 3.13; 3.14 adds a `SyntaxWarning` | Cleanup code with a `return` in `finally` turns a failure into a wrong success |
| `StopIteration` inside a generator | "it is converted into a RuntimeError (retaining the StopIteration as the new exception's cause)" | `RuntimeError: generator raised StopIteration` | A `next()` without a default inside a generator is a `RuntimeError`, which a test for `StopIteration` reports as the wrong type |
| `RecursionError` and `NotImplementedError` are `RuntimeError` | Both "derived from RuntimeError" | Verified in the class hierarchy | `pytest.raises(RuntimeError)` accepts both; so does `except RuntimeError` |
| `UnicodeError` is a `ValueError` | "It is a subclass of UnicodeError" which is under `ValueError` | `isinstance(e, ValueError)` is `True` | An encoding bug hides behind a value bug for every handler and every test written for `ValueError` |
| `IOError is OSError`, `EnvironmentError` too | "for backwards compatibility" aliases | `IOError is OSError` is `True` | A test for `IOError` passes for any `OSError` subclass |
| `KeyError` prints the repr of the key | `str()` returns "the representation of the argument(s)" | `KeyError: 'missing'` | Message comparisons must quote the key |
| `OSError` attributes are the contract | `errno`, `strerror`, `filename`, `filename2`, `winerror`; "if three arguments are passed, the args attribute contains only a 2-tuple" | Verified `[Errno 2] No such file or directory: '/no/such/file'` | Branch on `e.errno`, never on the text |
| `compile()` is a syntax gate only | `SyntaxError` is raised "in a call to the built-in functions compile(), exec(), or eval()" | `def f(:` fails, a null byte fails (as `SyntaxError` on 3.12.10 and 3.13.15), an undefined name compiles | The helper's compile gate cannot catch a `NameError`, an `AttributeError` or an import error; it catches exactly what a truncated edit produces |
| The compile gate is version-bound | The gate calls `compile(src, path, "exec")` with the interpreter that runs the helper | The helper runs on 3.13 on the scorer and on 3.12 in a notebook replica | A 3.13-only or 3.12-only construct is judged by the wrong interpreter in one of the two places |
| `BaseException` is not caught by `except Exception` | `SystemExit`, `KeyboardInterrupt`, `GeneratorExit` inherit from `BaseException` | Verified with a custom `BaseException` subclass and `KeyboardInterrupt` | Cleanup that must run on interrupt belongs in `finally` or a context manager, not under `except Exception` |
| Comprehension variables are isolated | PEP 709 (3.12): "Comprehension iteration variables remain isolated and don't overwrite a variable of the same name in the outer scope, nor are they visible after the comprehension" | Documented; not probed | A name assigned inside a comprehension is not readable after it on 3.12 and later |
| `locals()` is a snapshot | PEP 667 (3.13): "The locals() builtin now has defined semantics when mutating the returned mapping" | Writing to the dict had no effect on 3.12.10 or 3.13.15 | Code that sets a local through `locals()[...]` does not work, in either interpreter |

---

## 4. Scoring-side exception semantics that decide a task

Six rules from the harness source (wheelhouse v31, read 2026-11-24) turn a correct fix into a zero or a wrong fix into a pass. They belong in every post-mortem because they explain failures that the code does not:

| Rule | Source | Effect on a task |
| --- | --- | --- |
| A skipped required test is a failure | `_validate_junit_xml`: a required node must be in `passed_names` and not in `failed_or_skipped_names` | Two published tasks cannot pass in one interpreter; any fix that turns a passing test into a skipped one fails the task |
| Exit code 0 is necessary and not sufficient | `verify_task`: `resolved = test_res.exit_code == 0`, then the JUnit check | A test file that exits 0 through `os._exit(0)` produces no JUnit report and fails with "Missing JUnit XML report" |
| Every protected path is reset | `_is_protected_test_or_config_path`, `strip_protected_files_from_patch` | An edit to `pyproject.toml`, `conftest.py` or a nested test helper is discarded; the tests run against the baseline versions |
| The whole target file must pass | `pytest <targets>` with `-q`, no `-k` | A fix that repairs the named test and breaks its sibling in the same file scores zero; the RCA calls this "fix and regression come in pairs" |
| The command runs under five flags | `PYTHONSAFEPATH=1 PYTHONNOUSERSITE=1 python3 -s ... -p no:anyio -o timeout=0 -o python_classes="Test* *Test"` | A local pass under a bare `pytest` is a weaker statement than it looks |
| No network, 4 GiB, 2 vCPUs, 300 seconds | `ContainerConfig`, `HarnessLimits` | Eight requests tasks fail without a fixture; a heavy test dies with 137; the time cap wraps planner, solver and nudges together |

---

## 5. Traps in the agent's own tooling

These are the exception families the agent creates rather than fixes. The evidence is the board and the RCA, not the statements.

| Trap | Evidence | Defence in the brain | Defence to add |
| --- | --- | --- | --- |
| An edit that does not compile | 12 of 83 failed E4B runs broke the syntax; a prompt instruction to compile after each edit was followed on about 24% of edits (discussion 760595) | The helper compiles every edit and writes nothing on failure | Keep; and make the gate version-aware (compile with the interpreter the scorer uses) |
| A heredoc cut off at the token limit | Three nudge variants exist for this case (HARNESS_README, section 5.3) | `parse_blocks` drops an unclosed block and says so | Keep the edit below a few hundred tokens; the solver prompt already asks for 2 to 8 lines of search text |
| Leaked Gemma string delimiters | The model's own string-delimiter tokens (angle bracket, pipe, quote) leak into the heredoc | `parse_blocks` strips them at line start and at line end | Keep |
| A test or configuration file edited by mistake | "they are discarded" (harness documentation) | `PROTECTED_RE` refuses the write; `check` and `finalize` revert tracked ones | Widen `PROTECTED_RE` to the harness rule for nested test directories; add the rule to the prompt |
| A scratch file inside the workspace | HARNESS_README, gotcha 3 | `repro` stores scripts in the temp folder; `finalize` removes scratch-looking untracked files | Keep; note that `finalize` keeps any untracked file created through `apply` without a search block at the repository root, by design |
| A pipe that hides the exit status | discussion 760595 | `test` prints the real status | Keep |
| A list argument that freezes the server | vLLM 0.19.1 parser loop (discussion 760830) | No list-argument tool is attached; the skill tool's optional list arguments remain in the planner's schema | Prefer the no-skill bundle if a skill-carrying bundle ever scores 0.00 with a normal local run |
| A null in a file | A binary file or a truncated write | `read_text` returns `None` and the command reports "missing, binary or larger than 2,000,000 bytes" | Keep |

---

## 6. What this analysis changes in the brain

Ordered by the size of the hole over the cost of closing it. Each is a one-line or one-sentence change except the last two.

| Rank | Change | Where | Closes |
| --- | --- | --- | --- |
| 1 | Widen the protected-path rule to the harness rule: any `.py` file with `tests`, `test` or `testing` anywhere in its directory path, plus the existing name-based rules | `parts/_bcf_head.py`, `PROTECTED_RE` | Nested test helpers are refused instead of edited and discarded |
| 2 | Add the scorer's flags to the helper's test command: `PYTHONSAFEPATH=1 PYTHONNOUSERSITE=1 python3 -s -m pytest ... -p no:anyio -o timeout=0 -o python_classes="Test* *Test"` | `cmd_test` | A local pass that the scorer would not reproduce |
| 3 | Correct the docstring ("Python 3.13 in the Docker sandbox, 3.12.13 in the notebook") and compile with the sandbox interpreter, not with a hard-coded assumption | `parts/_bcf_head.py` line 27; `compile_error` | A gate that validates the wrong dialect in one of the two environments |
| 4 | One sentence for warnings in the solver core: "when the statement names a `*Warning`, search for `warnings.warn` and for the class definition, not for `raise`" | `src/prompts/solver_core_31b.md`, step 2 | 14 tasks whose vocabulary has no `raise` |
| 5 | Extend the OBJ hint with `__reduce__`, and `__eq__` without `__hash__`; extend the DI hint with "decide coroutine versus plain from the unwrapped callable and from `async def __call__` on instances"; extend the CON hint with "a broken pipe on stdout is an exit, not an error" | `HINTS` in `parts/_bcf_head.py` | F11, F2 in the DI domain, F6 in the console domain |
| 6 | Move TYP ahead of VAL in `DOMAINS`, or require two VAL words | `DOMAINS` | Three typing tasks that are classified VAL because of the words `field` and `default` |
| 7 | Add the two unsatisfiable tasks and the eight network tasks to a "do not spend budget" list for local panels (they are not in the scored set, but their shape is) | Panel definition in Document 04 of this package | Budget spent on tasks that cannot pass |

Status on 2026-11-24: rows 1, 2 and 3 are implemented and validated in `bcf-brain-patched/`; row 6 is implemented there as a different rule (the domain with the most distinct keyword matches wins, with the generic words removed from VAL and SER), which raised the reproduced domains from 49 to 82 of 129; rows 4, 5 and 7 are open. The eight network tasks of row 7 are the same eight requests tasks that need the `httpbin` fixture.

---

## 7. Open questions

| Question | State | How to close it |
| --- | --- | --- |
| The exact patch version of the scorer's `python:3.13-slim` image | Not published; the tag moves with each build | Read `python3 --version` in the first task of the first local Docker run and of the first scored run's trace |
| Whether the scorer uses the Docker backend | The Overview page says scripts run "inside the competition's persistent Docker container"; the harness resolves pre-seeded image tags; no staff statement names the backend | Ask on the board (thread 754586, question 2 is still open) |
| The exact `AttributeError` wording difference reported for `rich_3472` | Competitor-reported; not reproduced by my probe on 3.12.10 versus 3.13.15 | Run the gold test for `rich_3472` in a `python:3.13-slim` container and in a 3.12 environment |
| The pytest version in the scoring image | `Dockerfile.sandbox` installs pytest without a pin (thread 754586, question 1) | `python3 -m pytest --version` in the first task |
| Which of `FAIL_TO_PASS` and `PASS_TO_PASS` the hidden tasks carry | The public code falls back to test functions parsed from the test patch | Read a trace's verification log from a scored run (not available to participants beyond the score) |

---

## 8. Sources

| Source | Publisher | Date | Used for |
| --- | --- | --- | --- |
| [The Python Tutorial, chapter 8, Errors and Exceptions](https://docs.python.org/3.13/tutorial/errors.html) | Python Software Foundation | 3.13 documentation, fetched 2026-11-24 | Handler order, bare `except`, re-raise, chaining, `from None`, user-defined exceptions |
| [Built-in Exceptions](https://docs.python.org/3.13/library/exceptions.html) | Python Software Foundation | fetched 2026-11-24 | Hierarchy, attributes, `OSError` forms, `add_note`, `ExceptionGroup`, `PythonFinalizationError`, warnings classes, multiple inheritance caution |
| [Compound statements: the `try`, `except*`, `else`, `finally` and `raise` statements](https://docs.python.org/3.13/reference/compound_stmts.html) | Python Software Foundation | fetched 2026-11-24 | Name clearing, `else` and `finally` semantics, `except*` splitting |
| [Execution model](https://docs.python.org/3.13/reference/executionmodel.html) | Python Software Foundation | fetched 2026-11-24 | The termination model of error handling |
| [warnings: Warning control](https://docs.python.org/3.13/library/warnings.html) | Python Software Foundation | fetched 2026-11-24 | Default filters, registry, `stacklevel`, escalation |
| [contextlib](https://docs.python.org/3.13/library/contextlib.html) | Python Software Foundation | fetched 2026-11-24 | `contextmanager` re-raise rule, `ExitStack`, `suppress` |
| [typing](https://docs.python.org/3.13/library/typing.html), [types](https://docs.python.org/3.13/library/types.html) | Python Software Foundation | fetched 2026-11-24 | `get_type_hints`, `Annotated`, `UnionType` |
| [inspect](https://docs.python.org/3.13/library/inspect.html) | Python Software Foundation | fetched 2026-11-24 | `signature(eval_str)`, `iscoroutinefunction`, `getattr_static` |
| [errno](https://docs.python.org/3.13/library/errno.html), [pickle](https://docs.python.org/3.13/library/pickle.html), [subprocess](https://docs.python.org/3.13/library/subprocess.html), [unittest](https://docs.python.org/3.13/library/unittest.html), [sys](https://docs.python.org/3.13/library/sys.html), [dataclasses](https://docs.python.org/3.13/library/dataclasses.html) | Python Software Foundation | fetched 2026-11-24 | Family-specific traps |
| [What's New In Python 3.11](https://docs.python.org/3.13/whatsnew/3.11.html), [3.12](https://docs.python.org/3.13/whatsnew/3.12.html), [3.13](https://docs.python.org/3.13/whatsnew/3.13.html) | Python Software Foundation | fetched 2026-11-24 | PEP 654, 657, 678, 667, 709, 594 |
| [pytest: exit codes](https://docs.pytest.org/en/stable/reference/exit-codes.html), [skipping](https://docs.pytest.org/en/stable/how-to/skipping.html), [warnings](https://docs.pytest.org/en/stable/how-to/capture-warnings.html), [assertions about exceptions](https://docs.pytest.org/en/stable/how-to/assert.html), [monkeypatch](https://docs.pytest.org/en/stable/how-to/monkeypatch.html) | pytest | stable documentation, fetched 2026-11-24 | Test-harness semantics |
| `docker/Dockerfile.sandbox`, `docker/Dockerfile.public`, `HARNESS_README.md` | Kaggle competition data package | local copy 2026-09-29; zip read 2026-11-24 | The 3.13 image, the two shims, the two-phase lifecycle |
| `swegemma` 0.2.11, `adk-eval-core` 0.1.0, `adk-submission` 0.2.13 sources | Kaggle wheelhouse v31 | read locally 2026-11-24 | Scoring rules, protected paths, the verification command, container limits |
| [Getting Started - Gemma 4 Developer Agent](https://www.kaggle.com/code/ryanholbrook/getting-started-gemma-4-developer-agent) | Ryan Holbrook (staff) | version 3, last run 2026-11-21 | Python 3.12.13 of the harness |
| [Which public tasks cannot pass in the scorer's sandbox?](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754586) | Luxshan Thavarasa (competitor) | 2026-10-31 | 3.13 versus 3.12, unsatisfiable tasks, network-unreachable tasks, unpinned pytest |
| [Where a small E4B agent loses tasks](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760595) | Arn2011 (competitor) | 2026-11-20 | Syntax breakage, compile-check compliance, the pipe trap |
| Local probes | this machine: Python 3.12.10, 3.13.15, 3.14.7 | 2026-11-24 | Every "verified" statement; script in `scratch/2026-11-24-bcf-tuning-parity/scripts/py_probe.py` |
| Exception-signal scan | this machine | 2026-11-24 | Section 1; script `exc_scan.py`, output `excscan/exc_scan.md` |
