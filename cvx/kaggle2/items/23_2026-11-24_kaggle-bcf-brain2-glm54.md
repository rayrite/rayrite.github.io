# COMBINED MARKDOWN - combine

_Generated 2026-11-24 18:08:31 | 9 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle2\items\combine_

## Contents

1. 00_README.md
2. 01_Exception_Handling_Traps_by_Error_Family.md
3. 02_Time_Bottlenecks_and_Tuning_Levers.md
4. 03_Local_Kaggle_Parity_Plan.md
5. 04_Local_Scoring_and_Interpretation_Guide.md
6. 05_Board_Issues_Graceful_Handling_Audit.md
7. 06_Impact_Effort_Roadmap.md
8. 07_Setup_and_Run_Guide.md
9. 08_Table_QC_Report.md

---

<!-- ====================================================================== -->
<!-- FILE: 00_README.md -->
<!-- ====================================================================== -->

# BCF brain: exception traps, time bottlenecks, tuning levers, local-versus-Kaggle parity, scoring guide, board audit, roadmap, and setup guide

**Package of 2026-11-24** for the Kaggle competition *Google Gemma 4 Developer Agent* (149921). **Subject:** the BCF brain of `2026-11-23_BCF_Brain_and_Dataset_RCA/bcf-brain`. **Deadlines:** entry and team-merger deadline 2026-11-25 23:59 UTC; final submissions 2026-12-02 23:59 UTC.

---

## 1. The seven tasks and where each is answered

| Task | Document | One-line answer |
| --- | --- | --- |
| 1 | `01_Exception_Handling_Traps_by_Error_Family.md` | 13 error families in the 129 tasks, each with the traps as the documentation states them and a post-mortem procedure. The sandbox interpreter is Python **3.13** (the image is `python:3.13-slim`), not the 3.12 of the harness and of the staff notebook |
| 2a | `02_Time_Bottlenecks_and_Tuning_Levers.md`, Part A | The five numbers that decide the score: 12 hours, 360 seconds per task at 120 tasks, 13 to 25 tokens per second on the scorer, 219 to 322 tokens per model call, about seven attempts left |
| 2b | same, Part B | 17 levers ranked by impact over effort; the first three are one-line changes (solver thinking 4,096 to 2,048; the governor's gates; the per-task cap) |
| 2c | same, Part C | Six tiers of feedback from seconds to a day, and the rule to work at the lowest tier that can decide the question |
| 3 | `03_Local_Kaggle_Parity_Plan.md` | What the scoring environment is, dimension by dimension with its source; the parity matrix for Windows 11 with WSL2 and Zorin OS 18.1; three rungs of local parity; twelve acceptance tests |
| 4 | `04_Local_Scoring_and_Interpretation_Guide.md` and `tools/run_report.py` | How to read a result folder, what the local score can and cannot predict (with the power table of a paired design), and how to turn the largest failure class into the next lever |
| 5 | `05_Board_Issues_Graceful_Handling_Audit.md` | 51 issues: 31 handled, 9 partly, 6 not controllable, 2 not applicable, 3 defects. Six fixes, validated, in `bcf-brain-patched/` |
| 6 | `06_Impact_Effort_Roadmap.md` | The ranked list, the exact values to set, the calendar to 2026-12-02, and the decision gates |
| 7 | `07_Setup_and_Run_Guide.md` and `07_Setup_and_Run_Guide.html` | Download, install and run on the PowerSpec G914 on Zorin OS 18.1 and on Windows 11 Pro with WSL2; the smoke panel, the ranking panel, and the official submission for the main and the bonus tracks |

---

## 2. What this package found

| Finding | Evidence | Where |
| --- | --- | --- |
| The task sandbox is Python 3.13; the harness and the staff notebook are 3.12.13 | `docker/Dockerfile.sandbox` in the competition zip; the notebook's metadata; three wheelhouse wheels are built for 3.12 only | Task 1, section 0 |
| `finalize` deleted a correct new file: a root-level module created with `apply` was removed and the helper then reported "NO SOURCE CHANGES" | Executed probe of the helper in a temporary repository | Task 5, defect D2 |
| The helper allowed edits to nested test helpers that the scorer discards | Executed probe | Task 5, defect D1 |
| The helper's keyword routing reproduced the reviewed category for 43% of the statements and the reviewed domain for 38% | Measurement on the 129 statements, no model | Task 5, section 2.1 |
| A solver thinking budget of 4,096 is 164 to 241 seconds on the scorer; the average task can afford 219 to 322 generated tokens per call | Arithmetic on the published decode rate and the 12-hour rule | Task 2, section 0 |
| One run of a 30-task panel detects a ten-point gain 7% of the time | Exact power of the paired sign test | Task 4, section 6.3 |
| The competition is a code competition: the submission is a notebook that writes `submission.zip`; the plain `swegemma eval` command ignores the bundle's budgets and runs without compaction | Kaggle documentation; `swegemma/cli.py` | Task 7 |

---

## 3. The patched brain

`bcf-brain-patched/` is a copy of the validated brain with six fixes and nothing else changed. The original package was not modified.

| Fix | Before | After |
| --- | --- | --- |
| Protected paths follow the harness rule | 3 of 15 probe paths allowed | 0 |
| `finalize` keeps what the helper wrote and nested modules with scratch-like names | 2 files lost | kept |
| The helper's test command uses the scorer's verdict-changing flags | 0 of 4 | 4 of 4 |
| Keyword stems that could never match | `picklable`, `hashable`, `__qualname__`, `forward references` missed | matched |
| Routing: most distinct keyword match wins, generic words removed, bug fix before behaviour change | category 55, domain 49, route 42 of 129 | 97, 82, 52 |
| The docstring names both interpreters | "pinned Python 3.12" | 3.13 and 3.12.13 |

Validation of the copy on 2026-11-24: 37 helper tests (36 pass, 1 optional skipped), official compiler 6 of 6, 15 negative controls rejected, the 129 published fixes replayed through the editor 129 of 129 byte-identical to `git apply`, behaviour probe 15 pass and 0 gaps. The diff is `patches/bcf-brain-patches.diff`. Details: `bcf-brain-patched/validation/PATCHED-VALIDATION-2026-11-24.md`.

**Use the patched bundles for the next submission**, after one smoke run with the model.

---

## 4. What to do first

| Order | Action | Time |
| --- | --- | --- |
| 1 | Build and validate the patched brain where you work: `cd bcf-brain-patched`, `python build.py`, `python -m unittest tests.test_bcf`, `python tools/run_validator.py` | 5 minutes once the validation environment exists |
| 2 | Install the rig (Task 7, sections 3 or 4, then 5) and run the smoke panel through `tools/run_panel.py` | half a day the first time, mostly downloads |
| 3 | Read the smoke run with `tools/run_report.py`: seconds and tokens per call, the projection to scorer time | 10 minutes |
| 4 | Submit `bcf-31b-flat` (patched) early on 2026-11-25: it banks a score and answers whether skill scripts run on the scorer | one of about seven attempts |
| 5 | Pull the levers in the order of Task 6, deciding each on paired panel runs | the rest of the week |

---

## 5. What is not verified

| Item | Why | How to close it |
| --- | --- | --- |
| Any run with the Gemma 4 model | No model endpoint was available to this work | The smoke panel (Task 7, section 6) |
| The mean seconds per task on the scorer | Decides the 12-hour risk | The projection of Task 4, then the first scored run |
| The install steps on a greenfield G914 | They follow the official documentation and the staff notebook but were not executed on that machine here | The acceptance table of Task 7, section 13 |
| Whether skill scripts run on the scorer | Open board question since 2026-11-12 | The first skill-carrying submission |
| Whether the scorer uses the Docker backend | The Overview page implies it; thread 754586 asks | The same thread |
| The local decode rate of the 5090 for the 31B checkpoint | Every time projection depends on it | One smoke task |

---

## 6. Folder map

| Path | Content |
| --- | --- |
| `00_README.md`, `00_README.html` | This file, and a portable HTML hub |
| `01_...md` to `06_...md` | Tasks 1 to 6 |
| `07_Setup_and_Run_Guide.md`, `.html` | Task 7; the HTML is self-contained (no external file, font or script) |
| `bcf-brain-patched/` | The brain with the six fixes; six bundles in `dist/`; evidence in `validation/` |
| `patches/bcf-brain-patches.diff` | The exact change, 155 diff lines |
| `tools/` | `run_report.py`, `run_panel.py`, `install-wheelhouse.sh`, `panel30.txt`, `panel_smoke.txt`, `apply_brain_patches.py`, `brain_probe.py`, `route_eval.py`, `exc_scan.py`, `paired_power.py`, `py_probe.py`, `docgrep.py`, `make-html.sh`, `portable-toc.html` |
| `08_Table_QC_Report.md` | Result of the table check on every document |

Intermediate work (fetched pages, notes, probes, the synthetic fixture, the replay work folder) is in `scratch/2026-11-24-bcf-tuning-parity/`; the board capture of 2026-11-24 06:01 UTC is in its `board/` folder.

---

## 7. How the research was done

External research used the project's research toolkit on the main thread: the competition's Overview, Rules and Data pages and the Kaggle documentation were rendered in a browser; the staff notebook was read through Kaggle's public kernel API; the Python 3.13 documentation (30 pages), the vLLM 0.19.1 documentation, the Microsoft WSL documentation, NVIDIA's CUDA on WSL guide, the Docker, uv, pytest and statsmodels documentation and the vendor pages were fetched and quoted from; the board was captured anonymously at 06:01 UTC (378 topics, 6,605 teams). Search used the free engines and the included monthly allowance of the search provider; nothing was billed beyond it (see the credit line in the chat hand-back). Every source is listed at the end of each document with its date.


---

<!-- ====================================================================== -->
<!-- FILE: 01_Exception_Handling_Traps_by_Error_Family.md -->
<!-- ====================================================================== -->

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


---

<!-- ====================================================================== -->
<!-- FILE: 02_Time_Bottlenecks_and_Tuning_Levers.md -->
<!-- ====================================================================== -->

# Task 2 - Wall-clock bottlenecks, the brain's tuning levers, and a fast feedback loop

**Prepared:** 2026-11-24. **Subject:** the six BCF bundles in `2026-11-23_BCF_Brain_and_Dataset_RCA/bcf-brain` as built on 2026-11-24. **Three parts:** (a) where the time goes, locally on an RTX 5090 and on Kaggle; (b) every juncture where the brain can be tuned, ranked by impact over effort; (c) how to iterate quickly despite (a).

---

## 0. The five numbers that decide everything

| Number | Value | Where it comes from | Why it decides the score |
| --- | --- | --- | --- |
| The whole-submission clock | 12 hours = 43,200 seconds, inclusive of sandbox setup, exclusive of patch validation | Overview page (fetched 2026-11-24) | One second over and the submission receives no score at all |
| Mean seconds per task that fits | 43,200 divided by the task count: 372 s at 116 tasks, 360 s at 120, 335 s at 129; with a 10% margin 335, 324 and 301 | Arithmetic; the hidden set is "roughly 120" tasks on the board and 58 public tasks on the leaderboard | The published bundles with the same budgets averaged 277 s (9.2 hours for 120 tasks); the brain's target is "at or below about 270" |
| Decode rate of the scorer | 13 to 25 tokens per second for the 31B model on 4x L4; 76% of a 300-second budget was decoding at about 17 tokens per second | Discussions 755291 and 758954 | At 17 tokens per second, a 4,096-token thinking budget is 241 seconds: half of the per-task cap |
| Budget per model call | 360 s divided by 28 calls is 12.9 s; at 17 to 25 tokens per second that is 219 to 322 generated tokens per call, thought included | Arithmetic on the two rows above | Every lever that removes a call or shortens a thought is worth more than any lever that adds reasoning |
| Attempts left | One submission per day, one pending at a time, 26 to 29 hours end to end, final deadline 2026-12-02 23:59 UTC | Rules page; discussions 760471 and 761259 (2026-11-23) | From today that is about seven usable attempts, each one noisy to plus or minus 0.03 to 0.06 |

The rest of this document explains where the 12 hours go, which knobs move them, and how to learn without spending an attempt.

---

## Part A. Where the time goes

### A.1 The clock, stage by stage

The harness runs each task in two sandboxes (source: `swegemma` 0.2.11, read locally). Container A is the agent's, Container B verifies. Only Container A is inside the 12 hours.

| Stage | What happens | Local, RTX 5090 | Kaggle L4x4 notebook | Official submission | Controllable by the bundle? |
| --- | --- | --- | --- | --- | --- |
| S0 Authoring and building | Edit parts, prompts, `build.py`, tests, official compiler | 2 minutes for tests (37 tests, about 90 seconds), seconds for the compiler | not applicable | not applicable | Yes: it is your time |
| S1 Server start | Weight load, kernel compile, CUDA graph capture | 2 to 10 minutes on the first boot of a session; seconds to relaunch a warm process | Cold starts of 514 to 1,677 seconds were reported on L4; the staff notebook allows 1,200 seconds | Same, once per scoring run; a start beyond the allowance ends the submission with an exception | Only through the size of the submission (an adapter adds load time; the brain ships none) |
| S2 Data | Unpack the 21.9 GB zip, index 129 snapshots (56 seconds), extract one snapshot per task | Minutes once; about 1 second per task afterwards | Mounted read-only; extraction per task | Mounted; extraction per task | No |
| S3 Container A setup | Start sandbox, stage wheels, extract snapshot, install the package editable, install test dependencies, write `pytest.ini` and `conftest.py`, make the baseline commit, print the workspace tree, **compile the submission again** | 10 to 60 seconds per task in Docker; 1 to 3 seconds in the subprocess backend | 1 to 3 seconds (subprocess) | Tens of seconds per task (Docker); 120 tasks times 30 seconds is one hour of the 12 | Partly: a larger bundle costs a little more to compile 120 times; nothing else |
| S4 Model calls | Time to first token plus generated tokens over the decode rate | 40 to 60 tokens per second single stream (estimate from bandwidth in the earlier guide; **not measured**) | 13 to 25 tokens per second | 13 to 25 tokens per second, shared with other sessions when the notebook runs tasks in parallel | Yes: thinking budget, output cap, prompt length, number of calls |
| S5 Tool calls | Each `run_command` starts `bash`, runs the helper, returns | Helper commands take 0.5 to 1.4 seconds on a real checkout; a test up to 45 seconds | Same, on 2 vCPUs | Same, on 2 vCPUs shared with vLLM's own CPU work | Yes: helper timeouts and helper speed |
| S6 Nudges and retries | A turn that ends without `submit_patch` restarts the root agent (and with it the planner); transient model errors are retried up to 5 times with backoff (2 s, doubling, 60 s cap) | Visible in the trace | Visible in the trace | Same | Yes: a short edit and an explicit `submit_patch` avoid both |
| S7 Patch extraction and teardown | `git add -N .` and `git diff --binary`, then stop the sandbox | 1 to 3 seconds | 1 to 3 seconds | 1 to 3 seconds | No |
| S8 Container B verification | Setup again, apply the patch in up to four passes, reset protected files, apply the test patch, run pytest with a 300-second timeout | 20 to 90 seconds per task | Same | Same, **outside** the 12 hours but inside the turnaround | No (it is excluded) |
| S9 Queue | Wait for a machine | None | The L4x4 pool can queue; sessions are capped at 12 hours and burn quota at twice the rate | 8 to 9 hours of queue plus 2 to 2.5 hours of scoring per the staff update of 2026-11-19; 26 to 29 hours end to end per teams on 2026-11-23 | No |
| S10 Feedback | A score | You read traces, patches and logs immediately | Traces and logs after the session ends | One scalar on 58 public tasks, plus the result size | No |

### A.2 What the arithmetic says about one task

With 120 tasks the average task must fit in 360 seconds including its setup. The BCF bundle allows 480 seconds of agent time plus a 240-second command tail, so **the bundle is safe only if the governor makes the average task end well before the cap**. That is the unmeasured number the validation report names first, and it is the first thing to measure locally.

Three consequences follow from the table above:

1. **Thinking is the largest single cost.** At 17 tokens per second the solver's 4,096-token thinking budget is 241 seconds if used; at 25 tokens per second it is 164. A model that thinks to the limit twice in a task has spent the whole cap on thought. The budget of 219 to 322 generated tokens per call means that **a thinking budget of 4,096 is fourteen to nineteen times the affordable average**. The published finding that 4,096 and 1,024 tied on solves for the small model (discussion 760014, confirmed by a team with about 2,000 runs in 760595) is the strongest hint that the large model can also think less.
2. **Setup is a fixed tax the bundle cannot see.** At 30 seconds per task, setup is 6% of the clock for 120 tasks. The governor's clock starts at install, which happens after setup, so the governor is blind to it: a mean agent time of 330 seconds is safe on its own and unsafe with the tax. Keep the mean agent time at or below 300 seconds until the real setup cost is known.
3. **The local rig is too fast to show the problem.** If the 5090 decodes at 40 to 60 tokens per second, every time gate of the helper (first edit by 150 s, verify by 300 s, freeze at 374 s) fires when the model has done 2 to 3.5 times more work than it will have done on the scorer at the same moment. A panel that never times out locally says nothing about the 12-hour risk.

### A.3 The local bottlenecks, ranked by how much of your day they take

| Rank | Bottleneck | Cost per occurrence | How often | What removes it |
| --- | --- | --- | --- | --- |
| 1 | The agent loop of a panel | 30 tasks at 277 s = 2.3 hours sequential; three runs per bundle = 7 hours | Every comparison | Concurrency on one 5090 (an estimate of three parallel sessions at the 14k-context compaction threshold beside 17 to 18 GB of weights: read the server's KV-cache log line to get the real number), a smaller smoke panel, and the no-model tiers of Part C |
| 2 | The server start | 2 to 10 minutes | Every reboot, every model swap, every crash | Never restart inside a working session; start once, run many; swap models through vLLM's sleep mode (level 2 discards weights; wake reloads) instead of a new process |
| 3 | The data package | 21.9 GB to download and unpack, 28 GB of snapshots | Once per machine | Do it once per operating system; keep the content-addressed store the RCA tools built (98 MB of text) for all no-model work |
| 4 | Trace reading by hand | 10 to 30 minutes per task | Every failure you want to understand | An extractor that prints one line per call (tool, seconds, tokens, status) from `traces/trace_<id>.json`; the harness writes one trace per task |
| 5 | Docker on Windows | Container start and `pip install -e` are slower through Docker Desktop's WSL2 engine | Every task in Docker mode | Use the subprocess backend for iteration and Docker only for the acceptance run; or run the whole rig on Zorin |
| 6 | The validator environment | The first setup downloads 870 MB | Once | Already scripted (`tools/setup_validate_venv.py`) |

### A.4 The remote bottlenecks, ranked by how much of the remaining calendar they take

| Rank | Bottleneck | Cost | What removes it |
| --- | --- | --- | --- |
| 1 | One pending submission blocks the next | 26 to 29 hours per attempt | Validate before every submission; never submit an untested change; keep the best-known bundle's exact bytes as the fallback |
| 2 | A silent 0.00 | One full slot (26 hours) for nothing | The signature is a result of about 3,230 bytes instead of 60 to 130 KB; resubmit the same file and ask for the slot back on thread 761004; do not change the bundle in response |
| 3 | The queue grows toward the deadline | The staff update promised under 24 hours for 94% of submissions; teams reported 26 to 29 hours on 2026-11-21 to 23 | Submit early in the day (UTC evening is the busiest); plan the last attempt for 2026-12-01 morning |
| 4 | One scalar per attempt | Noise of 4 to 5 tasks per run | Decide locally on paired panels; use the leaderboard to confirm, never to choose |
| 5 | L4x4 quota | Twice the rate of T4x2; about 15 hours of L4x4 per week on a 30-hour quota (check your account's quota panel) | Use the notebook tier for parity checks, not for exploration |

---

## Part B. Every tuning juncture, ranked by impact over effort

### B.1 How to read the table

- **Impact** is the expected effect on the two quantities that decide the private ranking, the mean and the spread of the single-run score (Document 02 of the RCA package, section 10.1), and on the mean task time that decides whether a run finishes. Scale 1 (small) to 5 (large).
- **Effort** is the work to make the change and to validate it at the cheapest tier that can decide it. Scale 1 (one line, minutes) to 5 (days, a model run per variant).
- **Evidence** names what is known today. "Board" means competitor-reported; "source" means read in the harness source; "measured" means measured on this machine without the model; "hypothesis" means no evidence yet.
- The rank is the order to try things in, given seven attempts and the calendar.

### B.2 The levers

| Rank | Lever | Where | Today | Try | Impact | Effort | Evidence | Deciding measurement |
| --- | --- | --- | --- | --- | ---: | ---: | --- | --- |
| 1 | Solver thinking budget | `build.py` `SAMPLING[("31b","solver")]` | 4096 | 2048, then 1024 | 5 on time, unknown on solves | 1 | The small model tied at 4,096 and 1,024 (board 760014, 760595); 4,096 is 164 to 241 s on the scorer | Paired panel runs; adopt if resolved is equal and mean time is lower (hypothesis H4 of the design document) |
| 2 | Governor gates | `parts/_bcf_head.py` `T_EDIT_S`, `T_VERIFY_S`, `FREEZE_FRAC`, `HARD_FRAC` | 150 s, 300 s, 0.78, 0.90 | 100 s, 220 s, 0.65, 0.82 | 4 on time and spread | 1 | First edit at 106 s in solved runs against 183 s in failed runs (board 752848) | Mean seconds per task and tasks lost at the freeze |
| 3 | Per-task budgets | `build.py` `EVAL` and `BUDGET_S` | 8 min, 28 calls, 80 turns, 240 s | 7 or 6 min if the mean is above 270 s; 24 calls; 48 turns; 120 s | 5 on the all-or-nothing risk | 1 | 15 minutes and 50 calls exceeded 12 hours (board 760140); 28 calls is the published cliff (761060) | Mean seconds per task on the local panel, projected to the scorer's rate |
| 4 | Solver prompt length | `src/prompts/solver_core_31b.md` | 5,585 characters | at most 3,000 | 3 on mean, 4 on spread | 2 | Lean prompts win; complex decks scored 0.06 to 0.08 (board 760924) | Panel; look at tool-call malformation rate in the trace |
| 5 | Topology | choice of bundle | relay and flat twins | flat | 3 | 1 | Public evidence favours single agents; a relay costs about 35 s and 2 calls per task, and every nudge re-runs the planner | H1: paired runs of `bcf-31b-sequential` and `bcf-31b-flat` |
| 6 | Localizer weights and cache | `parts/_bcf_find.py`, `cmd_find` | literals 6.0, identifiers 4.0, 8 s first-pass cap, three scans of the tree | one indexed scan with a cached file list; 4 s cap | 3 on mean, 2 on time | 2 | Measured without a model: top-9 file 96 of 129 | `tools/eval_localizer.py`; adopt when top-9 rises and the search stays under 1 s |
| 7 | Helper `status` cost | `cmd_status` in `parts/_bcf_tail.py` | runs `git status` and recompiles every changed file on each call | journal-only outside the freeze | 2 on time | 1 | Source: `_check()` is called by `status`, which the model calls often | `tools/bench_real.py`; seconds saved per task |
| 8 | Installer probe | `install()` in `parts/_bcf_tail.py` | `import pytest` with a 15 s timeout; `git rev-parse` | 5 s timeout, lazy | 1 | 1 | Source: the probe runs inside the skill call, inside the budget | Bench |
| 9 | Test and repro timeouts | `parts/_bcf_head.py` `CMD_TIMEOUT_S`, `REPRO_TIMEOUT_S` | 45 s, 40 s | 35 s, 25 s | 2 on time | 1 | Source; a test that needs more than 35 s is not a test the agent can use | Fraction of test calls that time out |
| 10 | Solver tool list | `build.py` solver YAML | `run_command`, `read_file`, `get_status`, `submit_patch` | drop `read_file` (the helper reads) | 2 on malformed calls | 1 | Board: multi-key tools fail more often; hypothesis for this list | Trace: malformed calls per 100 |
| 11 | Sampling temperature and seed | `build.py` `SAMPLING` | 0.2, no seed | 0.0 or 0.1; a fixed seed | 2 on spread | 1 | Temp 0 is not deterministic for agents (board 760014); lower temperature reduced nothing measurable so far | Spread across three paired runs |
| 12 | Output cap | `build.py` `max_output_tokens` | 8192 | 6144 for 31B; keep 8192 for E4B | 2 on time | 1 | A smaller output cap doubled edit errors for the small model (board 760014) | Count of MAX_TOKENS nudges |
| 13 | Planner thinking | `SAMPLING[("31b","plan")]` | 1024 | 0 | 2 on time | 1 | H5 of the design document | Baton relayed correctly on at least 29 of 30 |
| 14 | Route rules | `KIND_RULES` and `DOMAINS` in `parts/_bcf_head.py` | first match wins; C4 before C1; VAL before TYP | C1 before C4 for statements that contain "fix" and a warning word; TYP before VAL | 3 on mean | 1 | Source: `warn` matches "warning" in bug titles; `field` and `default` pull typing tasks into VAL | Replay the 129 statements through `classify` and `domain_of` and compare with the RCA labels: no model needed |
| 15 | Hints | `HINTS` | 17 lines | the additions of Task 1, section 6 | 2 | 1 | Task 1 of this package | Panel failures by domain |
| 16 | Protected-path rule and test flags | `PROTECTED_RE`, `cmd_test` | narrower than the harness; plain pytest | the harness rule; the five scorer flags | 2 on correctness of local signals | 1 | Task 1, section 6 | Helper tests |
| 17 | E4B thinking and prompts | `SAMPLING[("e4b", ...)]`, E4B prompts | 1024 solver, 256 planner, 2.8 KB | 0 or 512 solver; 0 planner | 3 on the bonus track | 1 | Board 760014: zero-think beat 4,096 by 16 to 10 on 114 tasks | H7: paired E4B panel |
| 18 | Skill or no skill | bundle choice | skill with a no-skill fallback | keep both until the first skill-carrying submission scores normally | 5 on the all-or-nothing risk | 0 | Board 758547; the Overview page says scripts run in the same container as `run_command` | First submission's result size |
| 19 | LoRA | none | none | none | negative by default | 5 | Board 760309 (minus 7 tasks for a zero-weight adapter), 758968 | Not worth an attempt before the deadline |

### B.3 Levers the bundle does not have

Three knobs would help and are not in the submission: the notebook's task concurrency (it decides how many sessions share the GPUs), `gpu_memory_utilization` (0.90 in the staff notebook, 0.80 in the older README), and the queue. Treat them as weather.

---

## Part C. Iterating fast despite the bottlenecks

### C.1 The ladder of feedback loops

Each tier answers a different question at a different cost. Climb only as far as the question requires.

| Tier | Question it answers | Cost | Uses the model? | Uses a Kaggle resource? |
| --- | --- | --- | --- | --- |
| T0 Static | Does the bundle build, pass hygiene and compile with the official compiler? | Seconds | No | No |
| T1 Helper | Does the helper still behave (37 tests), still replay the 129 gold fixes byte-identically, still localize as well or better? | 3 to 5 minutes | No | No |
| T2 Smoke | Does one task run end to end on this machine with this bundle, and what does one call cost in seconds and tokens? | 2 to 8 minutes | Yes | No |
| T3 Panel | Is bundle A better than bundle B on the same tasks? | 1 to 3 hours per run locally | Yes | No |
| T4 Parity | Does the same panel behave the same at the scorer's speed, in the staff harness, on L4? | 2 to 4 hours per run plus quota and queue | Yes | Yes: a notebook session, no submission slot |
| T5 Official | What does the leaderboard say? | 26 to 29 hours | Yes | Yes: one of about seven attempts |

**Work at the lowest tier that can decide the question.** Every helper change goes through T0 and T1 before any model time is spent. Every prompt change goes through T0, T2 and T3 before T4. T5 is for banking a score and for the two things only the real scorer can show: that skill scripts run, and that the mean task time fits.

### C.2 Removing each local bottleneck

| Bottleneck | Strategy |
| --- | --- |
| Server start per experiment | Start the server once per session and run every bundle against it: the model is the same for all six bundles. Swap between the 31B and the E4B server through sleep mode or by keeping two vLLM processes (the E4B server is small) rather than by restarting |
| Panel wall clock | Run three sessions in parallel on the 5090; parallelism also lowers each stream's decode rate toward the scorer's, which makes the time gates fire at a more realistic point |
| The rig is too fast | Project every local run to scorer time from its trace: for each model call, time to first token plus generated tokens over 17 to 25 tokens per second; for each tool call, its own duration unchanged. The projected mean is the number to compare with 360 seconds, not the local mean. Record tokens per call in the panel log |
| Hand-made traces | One extractor script, run after every panel: a table of task, resolved, projected seconds, calls, malformed calls, refused edits, tests run, phase at submission, nudges, compactions. The validation report already names these columns; the traces exist in `results/traces` |
| Docker on Windows | Iterate with `--sandbox subprocess`; run the acceptance panel in Docker once per bundle |
| Re-running what did not change | A fixed panel in a fixed order, a fixed seed where the harness allows one, and a results folder named by the bundle's SHA-256 so a rerun is recognisable |

### C.3 Removing each remote bottleneck

| Bottleneck | Strategy |
| --- | --- |
| One attempt per day | Never spend an attempt on a question that T3 or T4 can answer. Keep a short list of what only T5 can tell you and batch it into each attempt |
| The parity tier is slow | The staff Getting Started notebook is the harness: copy it, attach your bundle as a private dataset, select a 30-task panel, run. It burns GPU quota at twice the rate and needs no submission slot |
| Noise | Decide on paired runs: the same tasks, the same order, the same panel for both bundles. With a per-task flip rate of 10 to 19% one run cannot separate two bundles that differ by two tasks (Task 4, section 5) |
| A silent 0.00 | Check the result size after every scored run; resubmit the same file |
| The deadline | Freeze the bundle you will select as a final by 2026-11-30; use the remaining attempts to confirm it, not to explore |

### C.4 A weekly cadence that fits the calendar

| Day (UTC) | Local work | Kaggle work |
| --- | --- | --- |
| Nov 24 | Measure the mean task time of `bcf-31b-flat` on the smoke panel; fix the two helper defects of Task 1 (protected paths, test flags); run T0 and T1 | Submit the better of `bcf-31b-flat` and `bcf-31b-sequential` as validated on Nov 23; this is the attempt that answers "do skills run on the scorer" |
| Nov 25 | Panel comparison: thinking 4,096 against 2,048 (T3) | Notebook-publish freeze at 23:59 UTC: publish the notebook versions you may still need |
| Nov 26 | Adopt or reject lever 1; governor at the tighter gates (T3) | Read the Nov 24 result: score, hours to score, result size |
| Nov 27 | Localizer cache and weights (T1, no model) | Submit the improved 31B bundle if T3 says it is not worse |
| Nov 28 | E4B panel with thinking 0 against 1,024 (T3) | Submit the E4B bundle once (bonus eligibility needs one E4B submission among the two finals) |
| Nov 29 | Three paired runs of the two best bundles | Optional T4 parity run on L4 |
| Nov 30 | Freeze the two finalists by local mean | Submit the first finalist again only if its Nov result was abnormal |
| Dec 1 | Nothing new | Last safe morning for a submission; select the two finals |
| Dec 2 | Nothing new | Deadline 23:59 UTC |

### C.5 The hypothesis ledger

One row per idea, written before the run, so that a result cannot be reinterpreted afterwards.

| ID | Hypothesis | Tier | Adopt if | Reject if | State |
| --- | --- | --- | --- | --- | --- |
| H1 | The relay is at least as good as the flat twin | T3 | Mean resolved not lower | Any loss with no gain | Open |
| H2 | The helper's edit channel beats the heredoc editor | T3 | More resolved, fewer malformed calls | Equal | Open |
| H3 | Planner-written terms beat mechanical ones | T1 plus T2 | Top-9 above 96 of 129 | Equal or lower | Open |
| H4 | Solver thinking 2,048 loses nothing | T3 | Equal resolved, lower mean time | Lower resolved | Open |
| H5 | The planner can work without thinking | T2 plus T3 | Baton relayed on 29 of 30 | Fewer | Open |
| H6 | An earlier freeze keeps runs inside 12 hours | T3 with projection | Projected mean at or below 300 s with no loss | Lower resolved | Open |
| H7 | For E4B, thinking 1,024 beats thinking off | T3 | More resolved | Equal or lower | Open |
| H8 | The spec gap predicts wasted time | T3 logs | Severe-gap tasks use most of the budget | No difference | Open |
| H9 | Projected scorer time predicts the real mean | T5 against T3 | Within 15% | Otherwise recalibrate the rate | New in this document |

---

## 4. What is not known

| Gap | Why it matters | First measurement |
| --- | --- | --- |
| Mean seconds per task of any BCF bundle with the model | Decides the 12-hour risk and the per-task cap | One local panel with the projection of C.2 |
| The 5090's real decode rate for the 31B QAT checkpoint | Every projection depends on it | One smoke task: tokens and seconds per call from the trace |
| The scorer's setup cost per task in Docker | About 6% of the clock at 30 s per task | Not measurable by participants; assume 30 s |
| The scorer's task count | 58 public tasks; the total is "roughly 120" on the board | Not measurable; plan for 120 |
| Whether the projection holds | It rests on the published decode rate | Compare the projected mean with the hours to score of the first attempt |

---

## 5. Sources

| Source | Publisher | Date | Used for |
| --- | --- | --- | --- |
| Competition Overview, Rules pages | Kaggle | fetched 2026-11-24 | 12-hour rule, one submission per day, L4x4 quota at twice the rate, no internet on L4 sessions |
| [Getting Started notebook](https://www.kaggle.com/code/ryanholbrook/getting-started-gemma-4-developer-agent), version 3 | Ryan Holbrook (staff) | last run 2026-11-21 | Server settings, 0.90 memory utilisation, 1,200 s startup allowance, sequential tasks |
| `swegemma` 0.2.11, `adk-eval-core` 0.1.0, `adk-submission` 0.2.13 source (wheelhouse v31) and `HARNESS_README.md` | Kaggle | read 2026-11-24 | Stages S3 to S8, container limits, retry policy, nudges, artifacts |
| [vLLM 0.19.1 engine arguments](https://docs.vllm.ai/en/v0.19.1/configuration/engine_args.html), [sleep mode](https://docs.vllm.ai/en/v0.19.1/features/sleep_mode.html), [optimization](https://docs.vllm.ai/en/v0.19.1/configuration/optimization.html) | vLLM project | fetched 2026-11-24 | Memory utilisation default, sleep levels, optimization levels and start-up time |
| [Update on Submission Queue](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760471) | Ashley Oldacre (staff), with comments to 2026-11-23 | 2026-11-19 to 23 | Queue and scoring times |
| [Byte-identical resubmission scored 0.00](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/761004) | Jiatian Zhang2 and others | 2026-11-22 to 23 | The 3,230-byte signature |
| [E4B trace-level diagnosis](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760595), [1,800+ trials of a 4B agent](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760014), [Variation is the biggest differentiator](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760924), [What sets the ceiling here](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/761060) | competitors | 2026-11-18 to 23 | Decode rate, thinking budgets, lean prompts, the 28-call cliff |
| `02_BCF_Brain_Design_and_Justification.md` and `03_Validation_Results_and_Submission_Playbook.md` | this project | 2026-11-24 | Hypotheses H1 to H8, budgets, measured helper timings |
| Leaderboard capture | this machine | 2026-11-24 06:01 UTC | 6,605 teams; 0.24 x 16, 0.22 x 140, 0.20 x 640 |


---

<!-- ====================================================================== -->
<!-- FILE: 03_Local_Kaggle_Parity_Plan.md -->
<!-- ====================================================================== -->

# Task 3 - Making the local rig behave like the Kaggle scorer: feature-parity plan for Windows 11 with WSL2 and for Zorin OS 18

**Prepared:** 2026-11-24. **Rig:** PowerSpec G914 (AMD Ryzen 9 9950X3D, NVIDIA GeForce RTX 5090 with 32 GB GDDR7 on PCIe Gen 5, 64 GB DDR5-6000 with sockets for 128 GB, 2 TB NVMe, AMD X870E board, 5 GbE LAN, Wi-Fi 7, 1,200 W supply; vendor page fetched 2026-11-24). **Target:** the scoring environment of the Gemma 4 Developer Agent competition as documented by its sources, not as guessed.

---

## 0. What "the remote environment" is

Every row states where the value comes from. Rows marked "staff notebook" come from the official Getting Started notebook (version 3, last run 2026-11-21), which is the closest public description of the scoring run.

| Dimension | Scoring environment | Source | Confidence |
| --- | --- | --- | --- |
| GPUs | 4 x NVIDIA L4, 24 GB GDDR6 each, 96 GB total | Overview page; HARNESS_README section 3.1; Google Cloud L4 page (24 GB per GPU) | High |
| Serving | vLLM 0.19.1, `tensor_parallel_size=4`, `max_model_len=32768`, `dtype=bfloat16`, `tool_call_parser=gemma4`, `reasoning_parser=gemma4`, `enable_auto_tool_choice`, thinking enabled by default | Staff notebook, cell 8 | High |
| GPU memory for vLLM | `gpu_memory_utilization=0.90` in the staff notebook; the older README says 0.80 | Notebook cell 8; README section 3.1; thread 759388 asks which the scorer uses | Medium: plan for 0.90 (21.6 GB per L4) |
| Scheduler | `scheduler_reserve_full_isl=False` (vLLM's default is `True`) | Notebook cell 8; vLLM 0.19.1 engine arguments | High |
| LoRA | enabled only when adapters are present; `max_loras` equals the number of adapters; rank up to 128 | Notebook cell 8 | High |
| Server start allowance | 1,200 seconds (`startup_timeout=60*20`, `VLLM_ENGINE_READY_TIMEOUT_S=1200`) | Notebook cell 2 and cell 8 | High |
| Harness process | Python 3.12.13 in the Kaggle image `gcr.io/kaggle-private-byod/python@sha256:37c64f7d...` | Notebook metadata; thread 748287 (wheelhouse v31 works on 3.12.13, fails on 3.13.15) | High |
| Task sandbox (scorer) | Docker, image built `FROM python:3.13-slim`, `network_mode='none'`, 4 GiB memory, 2 vCPUs, `/workspace`, git identity `agent@eval` | `docker/Dockerfile.sandbox`; `swegemma/sandbox/docker.py`; README section 4.1 | High for the image definition; the use of the Docker backend on the scorer is inferred from "the competition's persistent Docker container" (Overview) and is the open question of thread 754586 |
| Task sandbox (staff notebook) | Subprocess backend on the host: temp root with `workspace/`, `tmp/`, `wheels/`, `venv/`; `/workspace`, `/tmp`, `/wheels`, `/usr/local/bin` rewritten in the command text; no editable install and no test-dependency install | `swegemma/sandbox/subprocess.py`; `container_setup.py` skips both installs for the subprocess backend | High |
| Packages | wheelhouse v31 (2026-10-12): vLLM 0.19.1, transformers 5.13.1, flashinfer 0.6.6, compressed-tensors 0.15.0.1, google-adk 1.36.1, swegemma 0.2.11, adk-submission 0.2.13, adk-eval-core 0.1.0 and 33 more; installed `--no-deps` over the image's own torch (2.10.0+cu128 and Triton 3.6.0 per thread 751311) | Wheelhouse metadata and listing read 2026-11-24; notebook cell 2 | High |
| Host resources | Notebook sessions: 12-hour cap, 4 CPU cores and 30 GB RAM are documented for the standard session; the L4x4 machine's CPU and RAM are not documented on the page | Kaggle Notebooks documentation (fetched 2026-11-24) | Medium |
| Network | None inside the sandbox; "All L4 sessions must have internet disabled" | Harness source; Overview page | High |
| Context management | Compaction at 14,336 tokens, overlap 2, retention 5; interval 15 in the notebook and 5 in the README | Notebook cell 10; README section 7.2 | Medium on the interval, high on the threshold |
| Budgets | From the submission's `eval_config.yaml`; otherwise 60 minutes, 100 tool calls, no turn cap, 300-second command timeout | Notebook cell 10; README section 7.1 | High |
| Transient-error retries | Up to 5 retries, 2 s initial backoff, doubling, 60 s cap, 20% jitter | README section 7.2 | High |
| Task set | About 120 hidden tasks from private repositories; 58 of them form the public leaderboard; staff said none of the private tasks touches an async function | Board 761060, 756400, 745998 | Medium |
| The 12-hour clock | Stage 1 only (setup and agent loop), all or nothing | Overview page | High |

---

## 1. The parity matrix

"Gap" is what remains different after the best local setup. "Mitigation" is how to stop the gap from producing a wrong decision.

| Dimension | Scorer | Windows 11 + WSL2 | Zorin OS 18.1 | Gap that remains | Mitigation |
| --- | --- | --- | --- | --- | --- |
| GPU architecture | L4, sm_89 (Ada) | RTX 5090, sm_120 (Blackwell) | same card | Different kernels for the same vLLM build: the quantized (Marlin) kernels and the Triton attention kernels are selected per architecture | Decide on paired comparisons, never on absolute numbers; confirm the two finalists in the notebook tier (Task 2, tier T4) |
| Decode rate | 13 to 25 tokens per second | 40 to 60 (estimate, unmeasured) | same | Local runs are 2 to 3.5 times faster, so time gates fire late | Project local runs to scorer time (Task 2, C.2) or add load until each stream runs at the scorer's rate |
| Memory bandwidth | 4 x 300 GB/s shared through tensor parallelism | 1,792 GB/s on one card | same | Same as above | Same as above |
| Harness interpreter | 3.12.13 | 3.12.13 with `uv` | 3.12.13 with `uv` | None if pinned | `uv python install 3.12.13` |
| Sandbox interpreter | 3.13 (Docker image) | 3.13 in the Docker image; 3.12.13 in the subprocess backend | same | The subprocess backend is one minor version off | Use Docker for every decision that depends on the repository's behaviour under 3.13 |
| Sandbox isolation | network none, 4 GiB, 2 vCPUs | Docker: same flags; subprocess: none | same | None in Docker mode | Run the acceptance panel in Docker |
| Test dependencies | installed in the image from the task wheels | Docker image built with `Dockerfile.public`: same; subprocess: only what the host has | same | The subprocess backend cannot grade 29 tasks | Docker mode for scoring; or add the five missing packages to the host |
| vLLM build | wheelhouse v31 | wheelhouse v31 | wheelhouse v31 | None | Install from the wheelhouse with the notebook's rename step |
| Attention backend | selected by vLLM for Gemma 4 on sm_89 | selected for sm_120 | same | Both are 0.19.x on a model with mixed head dimensions, which forces a non-default backend; which one is chosen per architecture is logged at start | Record the "Using ... backend" line on both machines and in the notebook tier |
| Host CPU and RAM for the harness | undocumented; at least 4 cores | 16 cores and 32 threads, 64 GB (give the WSL VM 32 GB and 16 processors) | all of it | The local machine has more CPU than the scorer, so tool calls return sooner | The projection keeps tool time; measure tool time separately |
| Queue | hours | none | none | None | Nothing to do |
| Task set | hidden, about 120 | the 129 public tasks | same | Different repositories | Treat public results as a ranking signal only |

---

## 2. Track A: Windows 11 Pro with WSL2

### A.1 What WSL2 gives and what it costs

| Property | Fact | Source | Consequence for parity |
| --- | --- | --- | --- |
| vLLM does not run on Windows | "vLLM does not support Windows natively. To run vLLM on Windows, you can use the Windows Subsystem for Linux (WSL) with a compatible Linux distribution" | vLLM 0.19.1 installation page | Everything that touches the model runs inside WSL2; native Windows is for editing and for the static tiers only |
| The GPU is paravirtualised | "GPU acceleration in WSL is available on NVIDIA GeForce and NVIDIA RTX GPUs running in WDDM mode. It is not available on NVIDIA RTX GPUs running in TCC mode or on data center GPUs" | CUDA on WSL User Guide v13.5 | The 5090 in a desktop is in WDDM mode: supported |
| One driver only | "Once a Windows NVIDIA GPU driver is installed on the system, CUDA becomes available within WSL. The CUDA driver installed on the Windows host is stubbed inside WSL as libcuda.so. Therefore, you must not install any NVIDIA Linux GPU driver within WSL. Do not install the cuda-drivers or nvidia-open packages." | CUDA on WSL User Guide v13.5 | Never install a driver inside the distro; the WSL-Ubuntu CUDA repository is deprecated and has no toolkit 13.4 or later |
| Memory is capped | WSL 2 `memory` default is "50% of total memory on Windows"; `processors` default is "The same number of logical processors on Windows" | `.wslconfig` documentation | With 64 GB the VM gets 32 GB by default, enough for the harness and for staging one set of weights |
| Memory is not returned promptly | `autoMemoryReclaim` (experimental): `disabled`, `gradual` or `dropCache` (the default) | `.wslconfig` documentation | After a server stop the VM keeps its RAM until the cache is dropped; `wsl --shutdown` between heavy sessions |
| Files | Keep project files in the Linux file system, not under `/mnt/c` | WSL environment guide | Weights, snapshots, wheels and results live on ext4 inside the VHDX; `/mnt/d` is for the downloaded zip and the deliverables only |
| Systemd | Add `[boot]` `systemd=true` to `/etc/wsl.conf`, then `wsl.exe --shutdown`; verify with `systemctl list-unit-files --type=service` | WSL systemd guide | Needed for Docker Engine installed inside the distro |
| Networking | Default NAT; `mirrored` mode is recommended by Microsoft for the newest features; `localhostForwarding` is `true` by default | WSL networking and `.wslconfig` documentation | The harness and vLLM both run inside the distro and talk over `127.0.0.1:8000`; no cross-OS port matters |
| Pinned host memory is limited | "Pinned system memory ... availability for applications is limited. For example, some deep learning training workloads ... can exceed this limit and may not work." | CUDA on WSL User Guide v13.5, Known Limitations | Weight loading, CUDA graph capture and vLLM's sleep mode (level 1 backs weights up in CPU memory) touch pinned memory; if the server fails to start under WSL2 and starts on Zorin, this is the first suspect |
| No full unified memory | "Full Unified Memory features are not available ... Concurrent CPU/GPU access is not supported." | same | Not used by this stack |
| `nvidia-smi` is partial | "NVML (nvidia-smi) does not support all the queries yet. GPU utilization, active compute process are some queries that are not yet supported." | same, Features Not Yet Supported | Do not use GPU utilization as a health signal under WSL2; use the server's `/metrics` endpoint |
| Container toolkit | "Docker support: Supported with the latest NVIDIA Container Toolkit, using Docker CLI or Docker Desktop." "With the NVIDIA Container Toolkit for Docker, only `--gpus all` is supported." | same | One GPU, so `--gpus all` is all you need; do not try to select a GPU by index |

### A.2 Build order

The commands are in Task 7 of this package. The order matters for four reasons, stated here so that a failure can be placed:

1. **Driver on Windows first.** The Windows driver is the only driver (above). Check with `nvidia-smi` on Windows and with `/usr/lib/wsl/lib/nvidia-smi` inside the distro.
2. **Python 3.12.13 exactly**, through `uv`, because three wheelhouse wheels are built for 3.12 only (thread 748287: they failed on 3.13.15).
3. **The wheelhouse wheels, with the notebook's two corrections**: skip the cutlass wheels and restore the `+cu128` local version that Kaggle's upload strips from file names. Without the rename, `pip` sees a different torch build from the one the image has and reinstalls or refuses.
4. **Two sandboxes, two roles**: the subprocess backend for daily iteration (fast, no Docker), the Docker backend for the acceptance panel (3.13, network none, 4 GiB, 2 vCPUs, test dependencies installed from the task wheels).

### A.3 What can differ from the scorer and how to notice

| Symptom under WSL2 | Likely cause | Check | Fix |
| --- | --- | --- | --- |
| `torch.cuda.is_available()` is `False` although `nvidia-smi` works | Stale WSL kernel | `wsl.exe --version` | `wsl.exe --update`, then `wsl.exe --shutdown` |
| vLLM fails while allocating or capturing graphs | Pinned-memory limit of the GPU paravirtualisation | Run the same command on Zorin | `PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True` (the notebook sets it), a lower `gpu_memory_utilization`, or run the server on Zorin |
| The model loads slowly | Weights read through `/mnt/` | `df -h <model dir>` | Move the model cache to ext4 |
| Docker cannot see the GPU | Toolkit not configured, or Docker Desktop and Docker Engine both installed | `docker run --rm --gpus all ubuntu nvidia-smi` | `nvidia-ctk runtime configure --runtime=docker`, restart Docker; use one Docker |
| `localhost:8000` unreachable from a Windows browser | Expected with NAT; the harness runs inside the distro and does not need it | `curl` from inside the distro | None for parity; `networkingMode=mirrored` if you want a Windows browser to reach the server |
| The VM keeps 30 GB after a run | Cache not reclaimed | Windows Task Manager, the Vmmem process | `wsl --shutdown` between sessions |

---

## 3. Track B: Zorin OS 18.1 (native Linux)

### B.1 What the platform is

| Property | Fact | Source | Consequence for parity |
| --- | --- | --- | --- |
| Version | Zorin OS 18.1 is the latest version: released 2026-04-15, supported with software updates and security patches until 1 June 2029 | Zorin OS technical details page and release post, fetched 2026-11-24 | Use 18.1, not 18.0 |
| Base | Ubuntu 24.04 LTS | same | Every Ubuntu "noble" package and repository applies |
| Kernel | Linux 6.17, "the same version as in the latest Ubuntu 25.10", "with updated drivers ... NVIDIA graphics cards" | Zorin OS 18.1 release post | Newer than Ubuntu 24.04's own kernel; NVIDIA modules build through DKMS and need the headers of the running kernel |
| App formats | APT, Flatpak, Snap | technical details page | Use APT for the stack; Flatpak is irrelevant to a headless server |
| Docker | "Installation on Ubuntu derivative distributions, such as Linux Mint, is not officially supported (though it may work)" | Docker Engine installation guide for Ubuntu | It works with the `noble` repository; the documented command that interpolates the version id yields `18`, for which no repository exists |
| Driver | The RTX 5090 (sm_120) needs the Blackwell-capable driver line, 570 or later on Linux; the earlier guide of this project installed 580.196.07 from NVIDIA's repository for Ubuntu 24.04 | Prior local-testing guide (2026-10-31), citing NVIDIA's repository; the version was not re-verified today | Install through the package manager, never with a `.run` installer; read the current branch from the repository before installing |

### B.2 Build order

1. **Driver**: `linux-headers-$(uname -r)`, `dkms`, `build-essential`, then `ubuntu-drivers` or the NVIDIA repository; reboot; `nvidia-smi` shows the 5090 and a CUDA version of 12.8 or later.
2. **Python 3.12.13** through `uv`, then the wheelhouse wheels with the notebook's corrections.
3. **Docker Engine** from the `noble` repository, the NVIDIA Container Toolkit, `nvidia-ctk runtime configure --runtime=docker`.
4. **The same two sandboxes** as in Track A.

### B.3 What is better than Track A, and what is worse

| Better | Worse |
| --- | --- |
| No paravirtualisation: pinned memory, unified memory and every `nvidia-smi` query behave as on a server | A dual-boot machine: the Windows side holds the deliverables and the data package, so a shared NTFS volume or a second ext4 volume is needed |
| Native Docker with the NVIDIA runtime | Kernel 6.17 is newer than the driver branch was tested with at release; after every kernel update, check `nvidia-smi` before starting work |
| All 16 cores and all 64 GB are visible to the harness without a VM boundary | A derivative distribution: when a package is missing, read the Ubuntu 24.04 answer, not the Zorin one |
| The same ext4 file system for weights and snapshots | Secure Boot: the signed Ubuntu driver packages load without enrollment; a `.run` installer does not |

For the shared NTFS volume, mount it with the in-kernel `ntfs3` driver (not the FUSE `ntfs-3g`), disable Windows fast startup so that Linux can mount it read-write, and keep the model cache and the snapshot store on ext4.

---

## 4. Three rungs of local parity

| Rung | Where | What matches the scorer | What does not | Use it for |
| --- | --- | --- | --- | --- |
| R1 | Subprocess backend on the host, 3.12.13 | Harness versions, vLLM build, model, prompts, budgets, compaction, nudges | Sandbox interpreter (3.12 instead of 3.13), isolation (no network block, no memory and CPU caps), test dependencies (29 tasks ungradable), GPU speed | Daily iteration: tiers T2 and T3 of Task 2 |
| R2 | Docker backend on the host | Everything of R1 plus the sandbox interpreter (3.13), network none, 4 GiB, 2 vCPUs, the editable install, the test dependencies from the task wheels | GPU architecture and speed, host CPU count | The acceptance panel of every bundle; any question about how the repository behaves on 3.13 |
| R3 | Kaggle notebook with the staff Getting Started harness on L4x4 | The GPUs, the image, the harness, the model, the mount paths, the absence of internet | The subprocess backend (not Docker), the queue, the quota | The speed parity check and the final confirmation of the two finalists |

A decision that changes a submission should be confirmed on R2, and a decision about time should be confirmed on R3.

---

## 5. Acceptance tests for either track

Run these once after the build and after any change to the stack. Each has a pass condition that does not depend on the model.

| Test | Command or action | Pass condition | What it proves |
| --- | --- | --- | --- |
| V1 Interpreter versions | `python --version` in the harness environment; `docker run --rm swebench-sandbox:latest python3 --version` | 3.12.13 and 3.13.x | The two interpreters are the intended ones |
| V2 GPU visible to torch | `python -c "import torch; print(torch.cuda.is_available(), torch.cuda.get_device_capability())"` | `True (12, 0)` | The Blackwell build is installed |
| V3 vLLM build | `python -c "import vllm; print(vllm.__version__)"` | `0.19.1` | The wheelhouse build, not a newer PyPI build |
| V4 Server | Start vLLM with the notebook's settings and read the log lines for the attention backend and the KV-cache size | Server answers `/v1/models`; the two lines are recorded | The rig is characterised |
| V5 Rate | One prompt of 2,000 output tokens; tokens per second from the log | A number, written down | The projection factor for Task 2 |
| V6 Gold control, Docker | `swegemma eval --skip-agent-patch` is the baseline; then apply the 129 gold patches through the verification phase | With the five missing test packages added, 127 of 129 pass (the earlier guide's bar); without them, 100 of 129 | The sandbox can grade |
| V7 Baseline fails | `swegemma eval ... --skip-agent-patch` on the panel | Every task unresolved | The tests really test something |
| V8 Budget | A bundle with `max_time_minutes: 1` on one task | The task ends at about 60 s with the patch extracted | The cap wraps the agent loop |
| V9 Protected paths | A bundle that edits `tests/test_x.py` and `pyproject.toml` | The patch file contains neither | The reset rule is active |
| V10 Sandbox limits | `cat /proc/meminfo` and `nproc` through `run_command` in Docker mode | About 4 GiB and 2 | The container flags are active |
| V11 No network | `python3 -c "import urllib.request; urllib.request.urlopen('https://example.org', timeout=5)"` through `run_command` | `OSError` with errno 101 | The network block is active |
| V12 Brain | `python build.py`, `python -m unittest tests.test_bcf`, `python tools/run_validator.py` | 6 bundles, 36 pass and 1 skipped, 6 of 6 and 15 of 15 | The brain is intact |

V6 needs a word of warning: `--skip-agent-patch` runs the verification phase with an empty patch and is the *baseline* test (V7). To run the gold control, use the replay tool of the brain package (`tools/replay_gold.py`) for the editor fidelity, and the harness with the gold patches as the submission for the verification phase; the earlier local-testing guide (2026-10-31, file 05) has the procedure.

---

## 6. Irreducible differences

| Difference | Why it cannot be closed | What to do about it |
| --- | --- | --- |
| The GPU architecture | You cannot put an L4 in the machine | Decide on paired comparisons; confirm on R3 before the last submission |
| The hidden task set | Private repositories | Treat the public panel as a ranking signal |
| Concurrency on the scorer | Set by the scoring notebook | Plan the mean task time with a margin |
| The queue | Platform capacity | Submit early in the day and early in the week |
| The Docker versus subprocess backend in the notebook tier | The staff notebook uses subprocess | Use R2 for questions about the sandbox, R3 for questions about speed |

---

## 7. Sources

| Source | Publisher | Date | Used for |
| --- | --- | --- | --- |
| [Getting Started - Gemma 4 Developer Agent](https://www.kaggle.com/code/ryanholbrook/getting-started-gemma-4-developer-agent) | Ryan Holbrook (staff) | version 3, last run 2026-11-21; fetched 2026-11-24 through the anonymous kernel API | Serving settings, environment variables, sandbox backend, compaction, image digest, Python 3.12.13 |
| Competition [Overview](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview) and [Data](https://www.kaggle.com/competitions/gemma-4-developer-agent/data) pages | Kaggle | fetched 2026-11-24 | 4x L4, L4x4 quota, no internet, the hidden test set replaces the training set at scoring |
| [G914 Gaming PC](https://powerspec.com/product/698934) | PowerSpec | fetched 2026-11-24 | The machine's specification |
| [CUDA on WSL User Guide](https://docs.nvidia.com/cuda/wsl-user-guide/index.html) | NVIDIA | v13.5, fetched 2026-11-24 | Driver rule, limitations, unsupported features, Docker support |
| [`.wslconfig`](https://learn.microsoft.com/en-us/windows/wsl/wsl-config), [GPU compute](https://learn.microsoft.com/en-us/windows/wsl/tutorials/gpu-compute), [systemd](https://learn.microsoft.com/en-us/windows/wsl/systemd), [networking](https://learn.microsoft.com/en-us/windows/wsl/networking), [install](https://learn.microsoft.com/en-us/windows/wsl/install), [disk space](https://learn.microsoft.com/en-us/windows/wsl/disk-space), [development environment guide](https://learn.microsoft.com/en-us/windows/wsl/setup/environment) | Microsoft Learn | fetched 2026-11-24 | VM defaults, file placement, systemd, NAT and mirrored modes |
| [vLLM 0.19.1 installation](https://docs.vllm.ai/en/v0.19.1/getting_started/installation/gpu.html) and [engine arguments](https://docs.vllm.ai/en/v0.19.1/configuration/engine_args.html) | vLLM project | fetched 2026-11-24 | No native Windows, Python 3.10 to 3.13, CUDA 12.9 builds, defaults |
| [Zorin OS technical details](https://zorin.com/os/details/) and [Zorin OS 18.1 is released](https://blog.zorin.com/2026/04/15/zorin-os-18.1-is-released/) | Zorin | fetched 2026-11-24 | Version, base, kernel 6.17, support window |
| [Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/) | Docker | fetched 2026-11-24 | Supported versions, derivative-distribution caveat, commands |
| [NVIDIA Container Toolkit installation guide](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html) | NVIDIA | fetched 2026-11-24 | Repository and `nvidia-ctk` commands |
| [uv installation](https://docs.astral.sh/uv/getting-started/installation/) and [installing Python](https://docs.astral.sh/uv/guides/install-python/) | Astral | fetched 2026-11-24 | Installer and `uv python install` |
| [GPU platforms: L4](https://cloud.google.com/compute/docs/gpus#l4-gpus) | Google Cloud | fetched 2026-11-24 | 24 GB GDDR6 per L4 |
| Wheelhouse metadata and listing, harness source, `docker/Dockerfile.sandbox` | Kaggle | read 2026-11-24 | Versions, sandbox image, container flags |
| [New Gemma 4 Models Available](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/748287), [Which public tasks cannot pass in the scorer's sandbox](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/754586) | Kaggle staff and competitors | 2026-10-11, 2026-10-31 | Python 3.12.13 versus 3.13.15, sandbox behaviour |
| RTX 5090 local-testing guide of 2026-10-31 (files 01, 02, 03, 05) | this project | 2026-10-31 | The 127-of-129 gold bar, driver floors, TRITON attention fallback, installed-torch versions |


---

<!-- ====================================================================== -->
<!-- FILE: 04_Local_Scoring_and_Interpretation_Guide.md -->
<!-- ====================================================================== -->

# Task 4 - Scoring and evaluating local runs: how to read them, how they relate to the official score, and how to turn them into tuning decisions

**Prepared:** 2026-11-24. **Applies to:** result folders written by `swegemma eval` (wheelhouse v31) for any of the six BCF bundles. **Companion tool:** `tools/run_report.py` in this package turns one or more result folders into the tables described in section 3 (standard library only; exercised on a synthetic fixture because no model run exists yet).

---

## 1. What a run writes

| File | Written by | Contains | Use it for |
| --- | --- | --- | --- |
| `summary.json` | after every task | `total_tasks`, `resolved`, `resolution_rate`, `by_repo`, `errors` | A first glance only: it has no timing and no outcome classes |
| `task_results.jsonl` | after every task | one line per task: `instance_id`, `repo`, `resolved`, `agent_patch_size`, `test_exit_code`, `duration_seconds`, `error`, `tool_calls`, `total_llm_calls`, `task_index` | The score, the outcome class, the call counts |
| `traces/trace_<id>.json` | at the end of a task | the ATIF v1.7 trajectory: every model step with its tool calls and arguments, every tool response, token usage, `final_metrics` with `total_prompt_tokens` and `total_completion_tokens` | Time, tokens, process counters, compliance |
| `logs/<id>.log` | during the task | the readable transcript of the agent session | Reading one task by hand |
| `test_outputs/<id>.log` | after verification | the stdout and stderr of the pytest run in Container B | Why a patch failed: assertion, missing dependency, skip |
| `patches/<id>.patch` | after verification | the exact unified diff extracted from Container A | What the agent really changed |

One fact to keep in mind before any number is read: **`duration_seconds` is not the agent's time.** The harness starts its clock before Container A is set up and stops it after Container B has verified the patch (`evaluate.py`, `start_time` at the top of `evaluate_task`; `verify_task` returns `time.perf_counter() - start_time`). The agent's own time is the last `elapsed_s` in the trace. A mean of 300 in `duration_seconds` may contain 60 seconds of setup and 60 of verification. The agent's own time is the last `elapsed_s` in the trace: the trace starts when Container A starts, so it includes that container's setup and excludes verification. The budgeted agent time proper is still smaller (the harness starts it after setup), so the trace figure is an upper bound for it and the right one for the 12-hour arithmetic, which includes setup.

---

## 2. Before the numbers: three panels and four exclusions

| Panel | Size | Purpose | Cost on the 5090 |
| --- | ---: | --- | --- |
| Smoke | 3 to 5 tasks, one of each repository | "Does the bundle run end to end, and what does one call cost?" | 5 to 15 minutes |
| Speed | 10 tasks chosen for long trajectories | "Does the bundle stay inside the time and call budgets?" | 20 to 50 minutes |
| Ranking | the 30-task panel of the validation report, or its 52-task superset | "Is bundle A better than bundle B?" | 1.5 to 3 hours per run |

Exclusions, applied before any comparison:

1. **Ungradable here (29 tasks, 22.5%):** 21 FastAPI tasks whose tests import `inline_snapshot` or `dirty_equals` and 8 requests tasks that need the `httpbin` fixture. A correct patch fails them in the public sandbox and in the staff notebook. They add noise without information.
2. **Unsatisfiable in one interpreter (2 tasks):** `fastapi_14186` and `rich_3486`, whose required tests are skipped under mutually exclusive conditions (discussion 754586).
3. **Network-dependent (the same eight requests tasks):** under `network_mode='none'` they fail with `OSError: [Errno 101] Network is unreachable` (discussion 754586). They are the eight tasks of exclusion 1, seen from the scorer's side: 31 tasks are excluded in total, not 39.
4. **Severe and hard (31 tasks):** severe specification gap with difficulty 4 or 5. Keep them in a separate "long tail" count; never in the ranking panel.

Run the panel **in the same order every time**, repeat **three times per bundle**, and keep the results folder named by the bundle's SHA-256 (`dist/MANIFEST.json` has it) so that a rerun cannot be mistaken for a new variant.

---

## 3. The report, table by table

Run `python tools/run_report.py results/run1 results/run2 --labels data/rca_merged.jsonl --out report.md` (the labels file is `rca_merged.jsonl` of the RCA package). Seven tables come out. Each has a question it answers and a pattern that should make you act.

### 3.1 Score and time

| Column | Question | Act when |
| --- | --- | --- |
| Resolved and Rate | How many tasks passed? | Only compared with another run on the same panel |
| Errors and Empty patches | How many tasks produced nothing? | More than one empty patch in thirty: read those traces first; an empty tree scores zero |
| Agent s: mean, p50, p90, max | How long did the agent take, from the trace? | A p90 near the cap means the governor is not ending tasks early enough |
| Projected s: mean, p90 | What would the agent have taken at the scorer's decode rate? | Mean above 300: the 12-hour risk is real (360 is the ceiling at 120 tasks) |
| Projected hours for the run | Mean projected time times the task count | Above 10.8 hours: lower the per-task cap before submitting |
| Tasks over budget | How many tasks would exceed the mean budget? | Each one is a task that probably ends without `submit_patch` |

The projection replaces the model's decode time with `completion tokens / rate` and keeps the tool time as measured. Its two parameters are the decode rate (13 to 25 tokens per second published; the tool defaults to 20) and the time to first token (default 1 second per call). It is an estimate, and it is deliberately conservative in the direction that matters: a projected mean that fits is a better sign than a local mean that fits.

### 3.2 Tokens per task

| Column | Act when |
| --- | --- |
| Completion tokens: mean and p90 | The mean is above about 9,000 (28 calls at the affordable 219 to 322 tokens): the model is thinking or writing too much per call |
| Output tokens per call: mean | Above 400: the same conclusion seen per call |
| max in one call | Near 8,192: one call is consuming the output cap; expect a MAX_TOKENS nudge and a lost edit |
| Prompt tokens: mean | Growing with the call count: context is not being kept small; compaction will follow |

### 3.3 Process counters

| Column | Act when |
| --- | --- |
| Tool calls per task: p90 | At or near 28: tasks run out of calls before they run out of time |
| Refused helper edits | More than about one per two tasks: the search blocks are wrong (stale text, non-unique match); read two refusals |
| Tool errors | Any: each one is a wasted call; read the first |
| Nudges | Any: a turn ended without `submit_patch`; in the relay, each nudge also re-runs the planner |
| Compactions | Any in the first 15 calls: the context grows too fast |
| Tasks with `finalize` | Should equal the number of tasks with a patch; otherwise the solver is submitting without the hygiene step |
| Tasks with `submit_patch` | Should equal the number of tasks with a non-empty patch |
| Patches touching protected paths | Must be zero; the harness discards those files, and the helper is supposed to refuse them |
| List-argument calls | Must be zero: a list argument is the parser-hang hazard of vLLM 0.19.1 |

### 3.4 Outcome of every task

Every unresolved task gets exactly one class, in this order:

| Class | Meaning | First thing to read |
| --- | --- | --- |
| `no edit: calls exhausted` | The budget of tool calls ended with nothing on disk | The call list: where did the calls go? |
| `no edit: time` | The time ended with nothing on disk | The first-call time and the tokens per call |
| `no edit` | Neither budget ended and still no edit | The last three tool results |
| `patch did not apply` | The diff could not be applied in Container B (four passes) | `patches/<id>.patch`: binary content, a renamed file, a mode change |
| `no JUnit report` | Pytest exited 0 but wrote no report | `test_outputs/<id>.log`: an early `os._exit` |
| `required test failed or skipped` | A required node failed or was skipped | The assertion in `test_outputs/<id>.log` |
| `ungradable here` | A dependency or a network fixture is missing | Nothing: exclude the task |
| `pytest error (exit 2 to 5)` | Interrupted, internal error, usage error, or nothing collected | The collection error in the log |
| `harness error` | An exception in the evaluation itself | `error` in `task_results.jsonl` |
| `edit but time ran out before submit` | An edit exists and no `submit_patch` was called | Why the turn did not end |

### 3.5 Breakdowns

Resolved counts by category, domain, route, specification gap and difficulty, taken from the RCA records. The useful reading is a row where one bundle is clearly ahead or behind: a route with zero resolved in three runs is a route whose procedure is wrong, not a hard route.

### 3.6 Paired comparison

For two runs on the same tasks: both, A only, B only, neither, the difference and the exact sign-test p-value. **This is the only table that can rank two bundles.** Rules:

- A change is adopted when A-only is larger than B-only **and** the projected mean time is not worse.
- A difference of one task is noise at any panel size. With 30 paired tasks, a true gain of 10 percentage points with no losses is detected 7% of the time (section 6).
- When three runs of each bundle exist, pair run 1 with run 1, run 2 with run 2 and run 3 with run 3, and add the three tables.

### 3.7 Per task

One line per task with every counter, for the traces you decide to open.

---

## 4. Reading one task

| Start from | Then | Conclusion |
| --- | --- | --- |
| `agent_patch_size` is 0 | `tool_calls` and the trace | The agent never edited: a localization failure, a refusal loop, or a budget that ended first |
| `error` mentions "Failed to apply agent patch" | `patches/<id>.patch` | The edit is not a clean text diff |
| `test_exit_code` is 1 | the `FAILED` lines in `test_outputs/<id>.log` | The fix is wrong or incomplete, or a sibling test in the same file broke |
| `test_exit_code` is 2 to 5 | the collection error | The patch broke an import, or a fixture is missing |
| `error` says "Required test node did not pass" with exit 0 | the skipped tests in the log | A required test was skipped: an unsatisfiable task or a skip the fix caused |
| Resolved, but the projected time is near the cap | the call list | A win that would not survive a slower scorer |

For a resolved task, still read the first-edit time and the call count: the cheap wins are the ones to protect when a lever changes the early phase of a task.

---

## 5. Compliance checks on a trace

The brain has rules that the score cannot show. Check them on three tasks per run (one per repository), by hand from `logs/<id>.log` or through the tool's counters.

| Check | Pass condition | Where |
| --- | --- | --- |
| The installer ran once, first | The first tool call of the task is the skill call, or the installer reports a re-entry | Trace, first `tool_calls` |
| The baton was relayed verbatim (relay bundles only) | The planner's final text equals the `<<<BCF-SPEC` block printed by `plan` | `logs/<id>.log` |
| Every file change went through the helper | No `edit_file`, no `write_file`, no `python3 -` heredoc that opens a file for writing in the solver's calls | Trace, `arguments` of `run_command` |
| The first edit exists by call 10 (31B) or call 6 (E4B) and before the governor's first gate | The first `APPLIED` appears before that | Trace |
| Verification happened | At least one `repro` or `test` call, and for P1 and P2 routes a repro that failed before the fix | Trace |
| `finalize` ran before `submit_patch` | Both present, in that order, `patch_size` above 0 | Trace |
| No protected path was edited | "Patches touching protected paths" is 0 | Report table 3 |
| No list argument was emitted | "List-argument calls" is 0 | Report table 3 |
| No tool call after `submit_patch` | The last tool call is `submit_patch` or nothing follows it | Trace |
| Thinking stays inside its budget | `max in one call` is below the output cap | Report table 2 |

A bundle that passes all ten and scores lower than one that fails three is still the better bundle: the failures are what the slower scorer will punish.

---

## 6. Local results against the official score

### 6.1 What the evidence says

| Finding | Source | What it means for reading a local run |
| --- | --- | --- |
| Byte-identical submissions scored 0.17 and 0.24, and 0.15 and 0.20 | Discussions 757588, 760924 | A single leaderboard value has a band of about 4 tasks (0.07) |
| The per-task flip rate between identical runs is 10 to 19% | arXiv 2611.19359; discussions 758969, 758954 | The band comes from tasks flipping, not from a different score formula |
| A pooled estimate of the standard deviation is about 1.5 tasks per draw; identical configurations disagreed on 5 to 8 of 129 tasks locally | 759329 (reply), 760595 (Adam Johnson) | Local single runs have the same kind of noise as the leaderboard |
| A real gain of two tasks is misranked 11 to 20% of the time with one run; a three-task effect needs 4 to 8 repetitions of the full set for p below 0.05 | 758954, 760595 | One run can rank nothing that differs by less than about four tasks |
| Local scores correlate with the leaderboard for a plain single-agent prompt, and stop correlating for elaborate multi-agent bundles that solved locally and scored 0.06 to 0.08 | 760924 (Murugesan Narayanaswamy) | The further a bundle is from a plain agent, the more the scorer's speed and compaction punish what worked locally |
| A local tie of 28 of 74 scored 0.17 and 0.10 | 751973 | Local rank inside a tie is meaningless |
| The scored tasks come from private repositories and "behave very differently" from the 129 public tasks | 756400, 745998 | The public panel is a ranking signal, never a calibration of the absolute score |
| Reference points on the public tasks: agentless with the unquantized model 47 of 129; the 31B model through the same harness 54 of 124 for a competitor; the top of the leaderboard is 14 of 58 | 758218, 761060, leaderboard capture | Public-task rates of 35 to 45% coexist with a leaderboard top of 24% |

### 6.2 The arithmetic of one leaderboard value

One task is 1/58 = 0.0172. If each task flips between two runs of the same bundle with probability f, the difference between two single runs has a standard deviation of `sqrt(2 x 58 x f x (1 - f))` tasks:

| Flip rate f | Standard deviation of a difference | One-sigma band in score | A difference you can trust (two sigma) |
| --- | ---: | ---: | ---: |
| 0.10 | 3.2 tasks | 0.056 | about 0.11 |
| 0.15 | 3.9 tasks | 0.067 | about 0.13 |
| 0.19 | 4.2 tasks | 0.073 | about 0.15 |

So a leaderboard move from 0.20 to 0.22 between two single submissions is inside the noise, and a move from 0.17 to 0.24 is about one sigma. **The leaderboard confirms that a submission ran and scored in the expected band. It does not rank bundles.**

### 6.3 What a local panel can and cannot detect

Exact power of the paired sign test at the 5% level, computed for this document (`scratch/2026-11-24-bcf-tuning-parity/scripts/paired_power.py`):

| Effect of the change (gain g, loss l per task) | 30 pairs | 90 pairs | 129 pairs | 387 pairs |
| --- | ---: | ---: | ---: | ---: |
| +10 points, no losses (g = 0.10, l = 0) | 7% | 90% | 99% | 100% |
| +10 against 2 (g = 0.10, l = 0.02) | 5% | 50% | 71% | 100% |
| +5 points, no losses (g = 0.05, l = 0) | 0% | 29% | 63% | 100% |
| +5 against 1 (g = 0.05, l = 0.01) | 0% | 15% | 32% | 89% |
| +7 points on top of a 27% flip rate (g = 0.17, l = 0.10) | 5% | 18% | 27% | 73% |
| +7 points, no losses (g = 0.07, l = 0) | 2% | 61% | 89% | 100% |

The table says what the board has been saying: one run of a 30-task panel cannot see a ten-point improvement, and three runs of it see it only when the change loses nothing. Repeats of the same tasks are not independent observations, so the multi-run columns are optimistic; treat them as upper bounds.

What follows for the workflow:

| Local can decide | Local cannot decide |
| --- | --- |
| That a change removes a failure class (the outcome table moves) | The leaderboard value of the resulting bundle |
| That a change lowers time and tokens per task | Whether the hidden repositories behave like the public ones |
| That a change is not worse on paired tasks, when the effect is large or loss-free | Differences of one or two tasks |
| That the brain follows its own rules (section 5) | Backend failures, the queue, the silent 0.00 |
| That the projected mean fits the clock | The real setup cost on the scorer |

### 6.4 Building your own calibration line

Keep one row per official attempt and one row per local panel run of the same bytes:

| Field | Why |
| --- | --- |
| Date and time of the submission (UTC) | Queue position and the 24-hour rhythm |
| Bundle name and SHA-256 | The link between the local run and the scored run |
| Local panel: tasks, resolved in each of three runs, mean and p90 projected seconds | The predictors |
| Hours from submission to score | A very low score with a long latency is an infrastructure fault, not a draw (759329) |
| Public score and the result size | The outcome; about 3,230 bytes means a backend failure, not a score |

After three attempts you have three pairs (local mean, public score). Do not fit a line: read whether the local mean predicted the band (plus or minus 0.07) each time. A bundle whose local panel is 6 tasks better than another's is the one to select as a final, whatever the two public scores say, because the private leaderboard is one draw (Document 02 of the RCA package, section 10.1).

---

## 7. From results to a tuning plan

### 7.1 Failure class to lever

Read the outcome table of a run, take the largest unresolved class, and use the row. The lever numbers are those of Task 2, Part B.

| Class in the outcome table, or the counter | Most likely cause | Levers | Confirm with |
| --- | --- | --- | --- |
| `no edit: calls exhausted` | Localization or refusal loop consumed the calls | 4 (prompt length), 6 (localizer), 14 (routes), 2 (earlier first-edit gate) | Refused edits and first-call time in table 3 |
| `no edit: time` or `edit but time ran out before submit` | Too many tokens per call | 1 (thinking budget), 2 (gates), 12 (output cap), 13 (planner thinking) | Table 2 and the projected mean |
| `required test failed or skipped` on P1 and P2 routes | The repro was not a real oracle | 15 (hints), the fail-first rule of the prompt | Repro results in the trace: passed before the fix? |
| `required test failed or skipped` on P3 routes | Wrong file or wrong guess | 6, 14, 15 | The first `ctx` target against the gold file |
| `pytest error` | The patch broke an import | The compile gate cannot see imports: add an import smoke test for new modules | The traceback in the log |
| Refused edits high | Search text not copied exactly, or non-unique | 4 (the worked example), 10 (drop `read_file`) | Two refusals read by hand |
| Nudges present | A turn ended without `submit_patch` | 12 (output cap), the finish rule of the prompt | The nudge variant in the trace |
| Compactions present | Context grows too fast | 4 (shorter prompt), helper output caps | Prompt tokens per call in table 2 |
| Projected mean above 300 | Everything is a little too slow | 1, 2, 3 (the cap itself), 9 | Projected hours in table 1 |
| Resolved by route: one route at zero | The procedure of that route is wrong | 14, 15 | Breakdown table |

### 7.2 The loop

1. **Read** the report of the last run. Write down the largest unresolved class and its count.
2. **Pick one lever** for that class. One at a time, so that the next run attributes the change.
3. **Tiers**: T0 (build, compiler) and T1 (helper tests, replay, localizer) for every change; T2 (smoke) for a prompt change; T3 (ranking panel, three runs, paired against the baseline) for anything that claims a score effect.
4. **Decide before the run**: write the adopt condition in the ledger of Task 2 (C.5).
5. **Decide after the run** with the paired table: adopt, reject, or "inconclusive: more pairs".
6. **Update the baseline** only on adopt; keep its results folder as the new reference.

### 7.3 Two worked readings

The numbers are illustrative and chosen to show the reasoning, not measured.

| Situation in the report | Reading | Action |
| --- | --- | --- |
| 30 tasks; 9 resolved; 6 `no edit: calls exhausted`; refused edits 31; p90 calls 28 | The agent spends its calls on edits that do not apply | Open two refusals. If the search text differs from the file by whitespace, the flexible matcher should have accepted it: look at the blocks. If the same block is sent twice, the prompt's rule is not followed: lever 4 or 10 |
| 30 tasks; 12 resolved in all three runs; projected mean 340; p90 520; 4 tasks over budget | The score is stable and the time is not | Levers 1 and 2 first (thinking 2,048, earlier gates); re-run the speed panel; adopt if the projected mean falls below 300 and the resolved count in the paired table does not |

---

## 8. Sources

| Source | Publisher | Date | Used for |
| --- | --- | --- | --- |
| `swegemma` 0.2.11 (`results.py`, `evaluate.py`, `harness/verification.py`) and `adk-eval-core` 0.1.0 (`tracing/trace.py`, `tracing/atif_converter.py`) | Kaggle wheelhouse v31 | read 2026-11-24 | The artifacts, the meaning of `duration_seconds`, the trace format |
| [Variation is the biggest differentiator](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760924), [Where a small E4B agent loses tasks](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/760595), [thinking-budget and noise advice](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/759329), [scorer-minutes](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/758954), [Byte-identical resubmission scored 0.00](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/761004) | competitors | 2026-10 to 2026-11 | Local-versus-leaderboard evidence, noise, the 3,230-byte signature |
| [One Run Is Not Enough](https://arxiv.org/abs/2611.19359) (arXiv 2611.19359) | cited through the RCA package | 2026-11 | Flip rate |
| [statsmodels `mcnemar`](https://www.statsmodels.org/stable/generated/statsmodels.stats.contingency_tables.mcnemar.html) | statsmodels | fetched 2026-11-24 | The exact binomial form of the paired test |
| `03_Validation_Results_and_Submission_Playbook.md` (the 30-task panel and its exclusions) | this project | 2026-11-24 | Section 2 |
| Power tables | computed for this document | 2026-11-24 | Section 6.3 |


---

<!-- ====================================================================== -->
<!-- FILE: 05_Board_Issues_Graceful_Handling_Audit.md -->
<!-- ====================================================================== -->

# Task 5 - Does the BCF brain handle what other teams are hitting? Audit, defects found, and the validated fix

**Prepared:** 2026-11-24 (board captured at 06:01 UTC: 378 topics). **Question:** do the six bundles in `2026-11-23_BCF_Brain_and_Dataset_RCA/bcf-brain` behave gracefully when the problems reported on the discussion board happen to them? **Answer in one line:** of 51 issues, 31 were already handled, 9 are partly handled, 6 cannot be influenced by a submission and 2 do not apply; 3 were real defects, and executing the helper against the board's issues found 3 more (one of them a silent data-loss trap). All six are fixed in a validated copy, `bcf-brain-patched/`, next to this document. The original package is untouched.

---

## 0. How the audit was done

| Step | What | Where the evidence is |
| --- | --- | --- |
| 1 Collect | Five board captures (2026-10-31, 11-05, 11-11, 11-20 and today's), the RCA package's pitfall register, and the harness source | `input/kagglecomp/intel_*`, `scratch/2026-11-24-bcf-tuning-parity/board/`, `02_..._Design_and_Justification.md` section 10.5 |
| 2 Reduce | Merge duplicates into 52 issues, grouped by where they bite | Section 1 |
| 3 Check each | Three kinds of evidence, named per row: **source** (read in the pinned harness or Python source), **probe** (the helper was run in a temporary repository: `tools/brain_probe.py`), **reading** (the bundle files) | `bcf-brain-patched/validation/brain_probe_before.txt` |
| 4 Fix | A copy of the brain with a patch that must match every target exactly once and compile before it writes | `patches/bcf-brain-patches.diff`, `tools/apply_brain_patches.py` |
| 5 Validate | Assemble, build, the 37 helper tests, the official compiler, the 15 negative controls, the 129-fix replay, the probe again, and a routing measurement | `bcf-brain-patched/validation/PATCHED-VALIDATION-2026-11-24.md` |

What the audit cannot see: the scorer itself. Issues marked "not controllable" are platform behaviour; issues marked "partly" are reduced by design but unproven on the scorer.

---

## 1. The register

Status before the fix, in capitals: **HANDLED** (the design prevents it and a check shows it), **PARTLY** (reduced, with a named remainder), **FIXED TODAY** (was a defect, is fixed in the patched copy), **NOT CONTROLLABLE** (the platform decides), **NOT APPLICABLE** (the bundles never take that path).

### 1.1 Run level: a mistake here costs the whole submission

| ID | Issue as teams meet it | Evidence | Status | How the brain handles it, or why it cannot |
| --- | --- | --- | --- | --- |
| R1 | A bundle that fails to compile scores 0.00 with the status "complete" and no error; an underscore in a skill name is enough | 758854; source `compile_submission` | HANDLED | The official compiler is run on all six bundles before any submission, with 15 broken copies that must be rejected (probe: 6 of 6 and 15 of 15 today) |
| R2 | An unquoted colon in a YAML description makes the file unparsable | RCA validation report, section 7 | HANDLED | Caught by the compiler check; a control reproduces it for the skill frontmatter |
| R3 | An instruction placeholder naming a variable that is not in the session state raises `KeyError` at the first model call of every task | source `instructions_utils.py` | HANDLED | The optional form `{bcf_spec?}`; the build refuses any other brace expression |
| R4 | Explicit `null` budgets crash the public submit notebook's `int()` parser | 760140 | HANDLED | Four explicit integers in every `eval_config.yaml`; a control |
| R5 | Budgets left unset mean 60 minutes per task and starve later tasks | HARNESS_README 7.1 | HANDLED | Explicit budgets in every bundle |
| R6 | vLLM 0.19.1's tool parser loops forever on a list argument that contains a bracket; the server stops answering and every task after it scores zero | 753973, 759580, 760830 | PARTLY | No tool with a list argument is attached. The remainder: the skill tool's two optional list arguments are in the schema of every agent that declares a skill (the planner in the relay bundles, the single agent in the flat bundles). The no-skill bundles have zero exposure |
| R7 | A byte-identical resubmission scores 0.00 with no error; the result is about 3,230 bytes instead of 60 to 130 KB; staff are investigating | 761004 and three teams in its comments | NOT CONTROLLABLE | Recognise the signature, resubmit the same file, ask for the slot back |
| R8 | "Notebook Threw Exception" with no stage information | 743683, comments of 2026-11-23 | NOT CONTROLLABLE | Nothing in a bundle can produce or prevent it |
| R9 | A run over 12 hours receives no score; 15 minutes and 50 calls per task exceeded it | 760140, 761060, 752017 | PARTLY | Budgets at the largest values with public evidence of finishing, the governor's freeze and hard stop. The remainder: the mean task time has not been measured with the model |
| R10 | A vLLM cold start beyond the 1,200-second allowance ends the submission with an exception | 747519, 752017 | NOT CONTROLLABLE | The bundles ship no adapter, so nothing slows the load |
| R11 | The E2B checkpoint fails to load on the pinned serving stack | 748287, comment of 2026-11-22 | NOT APPLICABLE | The bundles use the 31B and E4B checkpoints |
| R12 | One pending submission blocks the next; 26 to 29 hours end to end; no cancel | 760471, 761259, 761278, 747740 | NOT CONTROLLABLE | Validate before every submission; keep attempts few |
| R13 | The metric bug that allowed improperly high scores was fixed and the affected submissions rescored | 760126 | NOT APPLICABLE | The brain uses no exploit |
| R14 | The wheelhouse moves and a local stack drifts from the scorer | 757782 | HANDLED | Everything is pinned to wheelhouse v31 (still version 31 at 06:13 UTC today); the validator uses the pinned packages |

### 1.2 Model and serving behaviour

| ID | Issue as teams meet it | Evidence | Status | How the brain handles it, or why it cannot |
| --- | --- | --- | --- | --- |
| M1 | Reasoning produced by the model is not carried between tool calls on vLLM 0.19.1 | 744354 | HANDLED | No step relies on remembered thought; the state is in text, on disk |
| M2 | Tool arguments are emitted in alphabetical order, so a long `new_string` is produced before `old_string`; a string ending in a backtick makes the parser drop the next argument | 756051, 758968, 747519 | HANDLED | One command with a single string argument; `edit_file` is not attached; the prompts forbid backticks around values |
| M3 | Tool results were double-JSON encoded; the residual bug writes escaped text literally through `edit_file` and `write_file` | 744272 | HANDLED | Neither tool is attached; a quoted heredoc passes its content unchanged |
| M4 | A long thought plus a long edit is cut off before the tool call closes | HARNESS_README 10.1 | HANDLED | An unclosed block is ignored with a message and nothing is written (probe) |
| M5 | Turning the thought output off multiplies tool-argument errors | 760014 | HANDLED | `include_thoughts` is `true` in every sampling file |
| M6 | Long thinking hurts the small model; too small an output cap doubles its edit errors | 760014, 760595 | PARTLY | E4B: thinking 1,024, output cap 8,192. The remainder is on the 31B track: thinking 4,096 is 164 to 241 seconds per task on the scorer (Task 2, lever 1) |
| M7 | An instruction to compile after each edit is followed on about 24% of edits; 12 of 83 failed runs broke the syntax | 760595 | HANDLED | The compile gate is in the helper, not in the prompt (probe: a replacement that does not compile writes nothing) |
| M8 | The small model edits the right file and submits early | 760595 | HANDLED | The E4B procedure asks for a first edit by call 6 and one verification |
| M9 | A LoRA adapter costs time, can silence the thinking channel, and has no demonstrated gain | 760309, 758968, 759514 | HANDLED | No adapter in any bundle |
| M10 | Elaborate multi-agent decks solve locally and score 0.06 to 0.08; lean prompts win | 760924, 754636 | PARTLY | A single-agent twin exists for each track. The remainder: the 31B solver instruction is 5.6 KB (Task 2, lever 4) |
| M11 | Agents repeat a failed action; a loop of ten or more repeats appears in over a quarter of trajectories | arXiv 2504.21798; 11-11 brief, item C1 | PARTLY | A repeated *identical* replacement is refused; a repeated *failed search block* is refused again but is not recognised as a repeat. Recommendation in section 4 |
| M12 | Temperature 0 is not deterministic for agents; the same bundle scores differently | 760014 | NOT CONTROLLABLE | The evaluation protocol decides on paired runs instead |

### 1.3 Sandbox and tool behaviour

| ID | Issue as teams meet it | Evidence | Status | How the brain handles it, or why it cannot |
| --- | --- | --- | --- | --- |
| S1 | A skill script runs with the working directory set to the skill's own folder, so a search skill finds its own files | 758854, 760886; source `skill_toolset.py` | HANDLED | The installer probes `/workspace` first; the helper itself runs only through `run_command` |
| S2 | A bundle whose only tool was a skill script resolved 40% locally and scored 0.00 twice; unanswered | 758547 | PARTLY | One skill call with no arguments, a no-helper procedure in the prompt, and the no-skill bundles. The Overview page says scripts run in the competition's Docker container with the same file system as `run_command` |
| S3 | Each skill call writes `.adk_exec_<hex>.py` into `/workspace` while it runs | 760886 | HANDLED | The helper's file walk skips it; the harness excludes it from git |
| S4 | A skill script that exits non-zero returns only an error string | source | HANDLED | The installer always exits 0 and prints its problems |
| S5 | File tools refuse paths outside `/workspace`; `write_file("/tmp/x.py")` fails with "Path traversal detected" | 760595 | HANDLED | `write_file` is not attached; the helper stores repro scripts outside the repository itself |
| S6 | A read returns at most 150 lines and 10,000 characters | source | HANDLED | `outline`, `ctx`, `find` replace whole-file reads |
| S7 | Command output is cut at 5,000 characters | source | HANDLED | Helper output is capped at 3,800 |
| S8 | A pipe hides pytest's failing exit code | 760595 | HANDLED | The helper's `test` prints the real status |
| S9 | Scratch files inside the workspace are swept into the patch | HARNESS_README 10.3 | FIXED TODAY | It removed too much: see D1 and D2 in section 2 |
| S10 | Edits to tests and configuration are discarded by the grader | source `verification.py` | FIXED TODAY | Nested test helpers were allowed: see D1 |
| S11 | Tests pass before any fix on about 65% of tasks, so a green test proves nothing | 760014 | PARTLY | A repro must fail first. A plain test file cannot be validated this way |
| S12 | `git stash pop` restores the wrong stash | 760595 | HANDLED | The helper never uses `git stash` |
| S13 | A script in `/tmp` cannot import the repository without `PYTHONPATH` | 760595 | HANDLED | The helper sets `PYTHONPATH` to the repository root for every subprocess it starts |
| S14 | Tests import packages missing from the sandbox, or need a network fixture | 756400, 756587, 757661, 754586 | PARTLY | The prompt says to ignore those failures; the panels exclude the 29 affected tasks and the 2 unsatisfiable ones; the report has a class for them |
| S15 | Five scorer conventions make 24% of correct fixes fail: the anyio plugin disabled, an overwritten `pytest.ini`, every `.py` of a test patch used as a target, skipped-sibling matching, a truncated JUnit report | 757893 | PARTLY | FIXED TODAY for the flags that change a verdict in the helper's own `test` command; the rest is the scorer's behaviour and cannot be influenced |
| S16 | The sandbox is Python 3.13 while the notebook and the harness run 3.12.13 | `docker/Dockerfile.sandbox`; 754586 | FIXED TODAY | The docstring said "pinned Python 3.12"; the compile gate already uses the running interpreter, which is the right one on the scorer |
| S17 | Whole-suite test runs time out | public bundles | HANDLED | One file or node; the whole suite is refused |
| S18 | Graph tools bring no gain, cover no async function, and one takes a list argument | 756400, 758854 | HANDLED | Not attached |
| S19 | Links in statements are unreachable offline; many statements are a title only | 757149, 745998 | HANDLED | Route P3: locate by the title's words and edit early |

### 1.4 The agent loop

| ID | Issue as teams meet it | Evidence | Status | How the brain handles it, or why it cannot |
| --- | --- | --- | --- | --- |
| L1 | A continuation nudge starts the root agent again, and a two-stage pipeline loses its context | 754636 | HANDLED | The installer is idempotent; the baton carries a progress section written from the journal; `resume` |
| L2 | Compaction at 14,336 tokens drops tool calls and their results | 754783, 756336 | HANDLED | The issue and the baton are in the instruction and are re-sent with every request; the journal is on disk |
| L3 | Nested tool wrappers multiply schema errors | 760014 | HANDLED | Four tools with scalar arguments; the skill tools only for the installer |
| L4 | Budget instructions written in a prompt are ignored on 61% of tasks | 760014 | HANDLED | The gates are code |
| L5 | A turn ends in plain text without `submit_patch` | source | HANDLED | The nudge path and the no-tool-call-after-submit rule |
| L6 | The tests need a name or a message the statement never gives | RCA document 01, section 6.2 | NOT CONTROLLABLE | The most literal reading and a best-guess edit; 19 published tasks are of this kind |

### 1.5 Tally

| Group | HANDLED | PARTLY | FIXED TODAY | NOT CONTROLLABLE | NOT APPLICABLE | Total |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Run level | 6 | 2 | 0 | 4 | 2 | 14 |
| Model and serving | 8 | 3 | 0 | 1 | 0 | 12 |
| Sandbox and tools | 12 | 4 | 3 | 0 | 0 | 19 |
| Agent loop | 5 | 0 | 0 | 1 | 0 | 6 |
| Total | 31 | 9 | 3 | 6 | 2 | 51 |

---

## 2. The defects, as executed

`tools/brain_probe.py` loads the assembled helper into a temporary git repository and runs sixteen situations. On the helper of 2026-11-23 it reported 10 passes and 5 gaps; on the patched helper 15 passes and 0 gaps.

| ID | Situation | Observed on the helper of 2026-11-23 | Why it matters | Observed on the patched helper |
| --- | --- | --- | --- | --- |
| D1 | An edit to `tests/helpers/util.py`, `tests/unit/deep/fixture.py`, `test/integration/check.py` | `APPLIED 1 block(s) -> tests/helpers/util.py` | The scorer discards any `.py` under `tests`, `test` or `testing`. The call was spent and the fix was not in the patch | `NOT APPLIED: tests and test configuration are reset by the grader` |
| D2 | A new root-level module created with `apply` on a path that did not exist, then `finalize` | `REMOVED scratch files: newroot.py`, then `RESULT: NO SOURCE CHANGES. An unedited tree scores zero` | A correct new file was deleted right before submission. A root-level module is common in small private repositories | Kept: `RESULT: READY` |
| D3 | New modules named `pkg/temp_conv.py`, `scripts/check_release.py`, `examples/try_it.py` | All three deleted as "scratch" | A name prefix is not evidence of a scratch file | All three kept; a root-level `repro.py` and files under `tmp/`, `scratch/`, `repro/` are still removed (test `T05Hygiene`) |
| D4 | The helper's `test` command against the scorer's verification command | No anyio plugin switch, no timeout override, no class pattern, no safe path | A local PASS did not mean what the scorer means | The four verdict-changing flags are present |
| D5 | Classification of 129 statements without a planner word, against the reviewed labels | Category 55 of 129, domain 49 of 129, route 42 of 129 | A bug fix that mentions a warning was routed as a behaviour change; `field` and `default` decided almost every FastAPI domain; `picklable`, `hashable`, `__qualname__`, `forward references` could never match because a word boundary followed the stem | Category 97, domain 82, route 52 |
| D6 | The docstring | "a pinned Python 3.12" | The wrong interpreter in the one place a maintainer looks | Names both interpreters |

Two checks that passed on both versions are worth naming because they are the ones teams lose submissions to: a search block that was cut off before its closing marker writes nothing and says so, and the model's own string-delimiter tokens leaked around a block are stripped.

### 2.1 The routing numbers

| Measure on the 129 published statements | Helper of 2026-11-23 | Patched helper |
| --- | ---: | ---: |
| Category reproduced (6 classes) | 55 (43%) | 97 (75%) |
| Domain reproduced (17 domains) | 49 (38%) | 82 (64%) |
| Domain within the reviewed primary-or-secondary pair | 57 (44%) | 91 (71%) |
| Route reproduced through the helper's own route rule | 42 (33%) | 52 (40%) |

Three cautions on reading them. The measurement uses the statement alone; with a planner the planner's `kind` word wins and the result should be better than either column. The new rule is a general principle (the domain with the most distinct keyword matches wins; generic words removed), not vocabulary learned from the four public repositories, so it should transfer to the hidden ones. And what the rules produce is the baton's CLASS, ROUTE and HINT lines: whether the model follows a better route better is unmeasured.

The cost of the category change is visible in the confusion: eight features are now classified as bug fixes because their statements contain "error" or "add support for ... error". For those the route changes from P4 (copy the sibling implementation) to P3 (read the top symbol, edit early). Against that, 42 statements that are bug fixes get a bug-fix route instead of a mechanical sweep. In the relay bundles the planner's word still decides.

---

## 3. What the patched copy is and how it was validated

| Item | Value |
| --- | --- |
| Location | `bcf-brain-patched/` in this package |
| Difference from the original | 155 diff lines in two files: `patches/bcf-brain-patches.diff` |
| Reproduce from a fresh copy | `python tools/apply_brain_patches.py <copy of bcf-brain>`; every replacement must match exactly once and both files must compile before anything is written |
| Helper tests | 36 pass, 1 optional skipped (the same as the original) |
| Official compiler on six bundles | 6 of 6, with the same advisory warning on the same four bundles |
| Negative controls | 15 of 15 rejected |
| Replay of the 129 published fixes through the editor | 129 applied, 129 byte-identical to `git apply`, 0 failures (the editor code is unchanged) |
| Behaviour probe | 15 pass, 0 gaps |
| Bundles | Rebuilt: the six folders and zips in `bcf-brain-patched/dist/` |

The first attempt at D4 taught a lesson worth keeping: it also passed `-s` and `PYTHONNOUSERSITE=1`, exactly as the scorer does, and three helper tests failed with `No module named pytest`, because on a development machine pytest can live in the user site-packages. The scorer's image has no user site, so those two flags change nothing there; they were dropped and the four flags that can change a verdict stayed.

**Use the patched bundles, not the original ones, for the next submission**, after one smoke run with the model: the routing change alters what the solver reads.

---

## 4. What remains open

| Open item | Kind | What to do |
| --- | --- | --- |
| The mean seconds per task with the model | Measurement | One local panel with the projection of Task 4 |
| Whether skill scripts run on the scorer | Scorer | The first skill-carrying submission answers it; keep `bcf-31b-noskill` validated as the fallback |
| The skill tool's optional list arguments (R6) | Scorer | If a skill-carrying bundle returns an abnormal score with a normal local run, submit the no-skill bundle next |
| A repeated failed search block is not recognised as a repeat (M11) | Helper | Keep the hash of the last refused search blocks in the journal and answer "this exact block failed before; copy the numbered lines". About fifteen lines in `cmd_apply` |
| The Docker versus subprocess backend on the scorer | Scorer | Ask on thread 754586; until answered, run the acceptance panel in Docker locally |
| Whether the scorer honours the same five conventions for the hidden tasks | Scorer | Nothing; the staff confirmed that the hidden tasks validate with their gold patches |

---

## 5. Sources

| Source | Publisher | Date | Used for |
| --- | --- | --- | --- |
| Discussion board captures: intel 2026-10-31, 2026-11-05, 2026-11-11, 2026-11-20 and the capture of 2026-11-24 06:01 UTC; threads cited above | this project | 2026-10-08 to 2026-11-24 | The register |
| `swegemma` 0.2.11, `adk-eval-core` 0.1.0, `adk-submission` 0.2.13 source; `HARNESS_README.md`; `docker/Dockerfile.sandbox` | Kaggle wheelhouse v31 and competition data package | read 2026-11-24 | Every "source" row |
| `tools/brain_probe.py`, `tools/route_eval.py`, `tools/apply_brain_patches.py` and their outputs in `bcf-brain-patched/validation/` | this package | 2026-11-24 | Section 2 and 3 |
| arXiv 2504.21798 (SWE-smith), arXiv 2405.15793 (SWE-agent) | cited through the RCA package | 2025 | M11 |


---

<!-- ====================================================================== -->
<!-- FILE: 06_Impact_Effort_Roadmap.md -->
<!-- ====================================================================== -->

# Task 6 - Impact-effort analysis and roadmap: which levers to pull, with which values, in which order

**Prepared:** 2026-11-24, 22:40 UTC. **Horizon:** the final deadline, 2026-12-02 23:59 UTC, with the notebook-publish freeze at 2026-11-25 23:59 UTC. **Inputs:** Tasks 1 to 5 of this package. **Rule of the roadmap:** the private leaderboard is one draw of each of two selected submissions, so the objective is the mean and the spread of a single run, not the best public score.

---

## 1. What "return" means here

Three quantities move the final ranking, and each lever is scored against them:

| Quantity | What it is | Why it matters | How it is measured before submitting |
| --- | --- | --- | --- |
| Mean resolved count | Tasks a single run resolves on average | The private score is a single run | Paired panel runs, three per bundle (Task 4) |
| All-or-nothing risk | The probability that the run exceeds 12 hours, fails to start, or scores 0.00 | One failure erases the mean | Projected mean seconds per task; the official compiler; the result size after scoring |
| Spread | The standard deviation of a single run | Among equal means, the smaller spread wins more often | Paired runs: count of tasks that flip |

Effort is the working time to make the change and validate it at the cheapest tier that can decide it. Both scales run from 1 to 5.

---

## 2. The ranked list

| Rank | Lever and the value to set | Impact | Effort | Return (impact over effort) | Evidence | Tier that decides it |
| --- | --- | ---: | ---: | ---: | --- | --- |
| 1 | **Use the patched brain** (`bcf-brain-patched/`): the six fixes of Task 5 are already made and validated | 4 (two of them prevent losing a correct fix) | 1 | 4.0 | Executed probe: 5 gaps to 0; routing 43% to 75% on category | T0, T1 (done), T2 |
| 2 | **Solver thinking budget 4,096 to 2,048** on the 31B bundles (`build.py`, `SAMPLING[("31b","solver")]`) | 5 on time, neutral to positive on solves (hypothesis) | 1 | 3.0 | Board: 4,096 and 1,024 tied on solves for the small model; 4,096 is 164 to 241 s on the scorer | T3 paired |
| 3 | **Governor gates**: `T_EDIT_S` 150 to 110, `T_VERIFY_S` 300 to 230, `FREEZE_FRAC` 0.78 to 0.68, `HARD_FRAC` 0.90 to 0.82 | 4 on time and spread | 1 | 3.0 | Board: first edit at 106 s in solved runs against 183 s in failed ones | T3 paired, with projection |
| 4 | **Measure the mean task time once** (smoke panel, 5 tasks, with the trace extractor of Task 4) | 5 on risk: it decides whether lever 5 is needed | 1 | 3.0 | Arithmetic: 360 s per task at 120 tasks | T2 |
| 5 | **Per-task cap**: keep `max_time_minutes` 8 unless the projected mean exceeds 300 s, then 7, then 6; `max_turns` 80 to 56; `timeout_seconds` 240 to 120 | 5 on the all-or-nothing risk | 1 | 2.5 | Board: 15 minutes and 50 calls exceeded 12 hours; 28 calls is the cliff | T2 and T3 |
| 6 | **Routing and hints**: keep the patched rule; add the three hint sentences of Task 1, section 6, row 5 (coroutine detection in the DI hint, pickling in OBJ, broken pipe in CON, warnings in the solver core) | 3 on mean | 1 | 2.0 | Task 1 | T1 (routing measured), T3 |
| 7 | **Solver prompt from 5.6 KB to at most 3 KB** on the 31B track | 3 on mean, 4 on spread | 2 | 1.8 | Board: lean prompts win; elaborate decks scored 0.06 to 0.08 | T2, T3 paired |
| 8 | **E4B thinking 1,024 against 0 and 512** (`SAMPLING[("e4b","solver")]`), planner thinking 0 | 3 on the bonus track | 1 | 2.0 | Board: zero-think beat 4,096 by 16 to 10 on 114 tasks; 1,024 and 4,096 tied | T3 paired on E4B |
| 9 | **Drop `read_file` from the solver** (the helper reads) | 2 on malformed calls | 1 | 1.5 | Hypothesis; board evidence is about multi-argument tools in general | T3 |
| 10 | **Planner thinking 1,024 to 0** (relay bundles only) | 2 on time | 1 | 1.5 | Hypothesis H5 | T2, T3 |
| 11 | **Repeated failed block recognised** (about fifteen lines in `cmd_apply`) | 2 on calls saved | 2 | 1.0 | Board: 75% of failed edit calls repeat an earlier failure | T1, T3 |
| 12 | **Helper `status` without `git status` and recompilation outside the freeze** | 2 on time | 2 | 1.0 | Source: `status` calls `_check()` on every call | T1 |
| 13 | **Localizer: one indexed scan with a cached file list** | 3 on mean, 2 on time | 3 | 1.0 | Measured: top-9 file 96 of 129; three scans of the tree today | T1 (`eval_localizer.py`) |
| 14 | **Output cap 8,192 to 6,144** on 31B only | 2 on time | 1 | 1.0 | Board: a smaller cap doubled edit errors for the small model | T3 |
| 15 | **Temperature 0.2 to 0.0 and a fixed seed** | 2 on spread | 1 | 1.0 | Weak: temperature 0 is not deterministic for agents | T3 |
| 16 | **Three paired runs of the two finalists** and the projection check | 4 on the quality of the final choice | 2 | 1.5 | Task 4, section 6 | T3 |
| 17 | **One parity run on Kaggle L4x4** of the finalist | 3 on confidence in time | 3 | 0.7 | Notebook tier: the staff harness on the scorer's GPUs | T4 |
| — | LoRA | negative by default | 5 | below 0 | Board: minus 7 tasks for a zero-weight adapter | not attempted |

---

## 3. The values, in one table

| Setting | File | 31B today | 31B, step 1 | 31B, step 2 (only if the projected mean is above 300 s) | E4B today | E4B, step 1 |
| --- | --- | --- | --- | --- | --- | --- |
| `thinking_budget`, solver | `build.py` `SAMPLING` | 4096 | 2048 | 1024 if step 1 lost nothing | 1024 | 0 and 512, in a paired run |
| `max_output_tokens`, solver | `build.py` | 8192 | 8192 | 6144 | 8192 | 8192 |
| `temperature`, solver | `build.py` | 0.2 | 0.2 | 0.0 with a seed | 0.2 | 0.2 |
| `thinking_budget`, planner | `build.py` | 1024 | 0 | 0 | 256 | 0 |
| `max_time_minutes` | `build.py` `EVAL` and `BUDGET_S` | 8 | 8 | 7, then 6 | 8 | 8 |
| `max_tool_calls` | `build.py` `EVAL` | 28 | 28 | 26 | 28 | 28 |
| `max_turns` | `build.py` `EVAL` | 80 | 56 | 48 | 80 | 56 |
| `timeout_seconds` | `build.py` `EVAL` | 240 | 240 | 120 | 240 | 240 |
| `T_EDIT_S` | `parts/_bcf_head.py` | 150 | 110 | 100 | 150 | 120 |
| `T_VERIFY_S` | `parts/_bcf_head.py` | 300 | 230 | 210 | 300 | 240 |
| `FREEZE_FRAC` | `parts/_bcf_head.py` | 0.78 | 0.68 | 0.65 | 0.78 | 0.70 |
| `HARD_FRAC` | `parts/_bcf_head.py` | 0.90 | 0.82 | 0.80 | 0.90 | 0.84 |
| `CMD_TIMEOUT_S`, `REPRO_TIMEOUT_S` | `parts/_bcf_head.py` | 45, 40 | 35, 25 | 35, 25 | 45, 40 | 35, 25 |
| Solver tools | `build.py` | 4 tools | 4 tools | 3 tools (drop `read_file`) | 4 tools | 4 tools |
| Solver instruction | `src/prompts/` | 5,585 characters (relay), 6,524 (flat) | at most 3,000 | same | 2,799 and 3,141 | same |

`BUDGET_S` must equal `max_time_minutes` times 60; the build stops when they disagree. After any change to `parts/`: `python assemble.py`, `python build.py`, `python -m unittest tests.test_bcf`, `python tools/run_validator.py`.

---

## 4. The calendar

Seven submission days remain (2026-11-25 to 2026-12-01); the last safe morning is 2026-12-01.

| Day (UTC) | Local work | Submission | Gate to pass before submitting |
| --- | --- | --- | --- |
| Nov 25 | Smoke run of the patched `bcf-31b-flat` (5 tasks): per-call seconds and tokens; write the projection factor | `bcf-31b-flat` (patched), early in the day. It banks a score and answers whether skill scripts run on the scorer | Compiler 6 of 6, controls 15 of 15, smoke run clean on 5 tasks |
| Nov 26 | Thinking 2,048 and the new gates: three paired runs against the baseline on the ranking panel | Nothing | Paired table: not fewer resolved, lower projected mean |
| Nov 27 | Prompt trim to 3 KB; drop `read_file`; hint sentences | The improved 31B bundle if Nov 26 passed its gate | Paired table; malformed calls per 100 |
| Nov 28 | E4B: thinking 0 and 512 against 1,024, paired | `bcf-e4b-flat` once (bonus eligibility needs one E4B submission among the two finals) | E4B smoke run; compiler |
| Nov 29 | Three paired runs of the two best 31B bundles; read the result sizes and hours-to-score of every attempt so far | Nothing | Ledger complete |
| Nov 30 | Choose the two finalists by local mean; optional L4x4 parity run of the finalist | A confirmation run of finalist 1 only if its last score was abnormal | Result size normal |
| Dec 1 | Nothing new | Last safe morning for a submission; select the two finals | Selection done |
| Dec 2 | Nothing new | Deadline 23:59 UTC | |

Publish any notebook version you may still need before the freeze at 2026-11-25 23:59 UTC (board thread 759388 asked whether private versions can still be submitted after it; unanswered).

---

## 5. Decision gates

| Question | Rule |
| --- | --- |
| Is a change better? | Adopt when the paired table shows more tasks gained than lost and the projected mean time is not worse; reject when tasks are lost with no gain; otherwise run more pairs |
| Is the bundle safe to submit? | Compiler 6 of 6, 15 controls rejected, one smoke run clean, the bundle's SHA-256 written in the ledger |
| Is the run inside the clock? | Projected hours for 120 tasks at or below 10.8; otherwise lower the cap one step before submitting |
| Is a scored result a draw or a fault? | Hours to score in the normal band and a result size of 60 to 130 KB: a draw. About 3,230 bytes: a fault; resubmit the same file |
| Which two finals? | The two bundles with the best local mean over paired runs; the public score breaks ties only |

---

## 6. What not to spend time on

| Temptation | Why not |
| --- | --- |
| A LoRA adapter | No demonstrated gain; a measured cost in time and a risk to the thinking channel; eight days are not enough to beat the cost |
| A second model or a mixed bundle | Not allowed: one base model per submission |
| The E2B checkpoint | Reported to fail to load on the pinned stack |
| Graph tools | No measured gain and one list-argument tool |
| A bigger thinking budget | 4,096 is already 164 to 241 seconds on the scorer |
| Tuning against public-score differences below 0.07 | Inside the noise of a single run |
| The 29 ungradable and 2 unsatisfiable public tasks | They add noise to every panel |

---

## 7. Sources

This document applies the measurements of Tasks 1 to 5. The evidence behind each lever is in `02_Time_Bottlenecks_and_Tuning_Levers.md` (Part B), the validation of the patched brain in `bcf-brain-patched/validation/PATCHED-VALIDATION-2026-11-24.md`, the noise arithmetic and power tables in `04_Local_Scoring_and_Interpretation_Guide.md` (section 6), and the deadline facts in the Overview page of the competition (fetched 2026-11-24).


---

<!-- ====================================================================== -->
<!-- FILE: 07_Setup_and_Run_Guide.md -->
<!-- ====================================================================== -->

# Task 7 - Setup, install and run guide: the local test harness for the BCF brain on a PowerSpec G914, with official submissions for the main and the bonus track

**Prepared:** 2026-11-24. **Machine:** PowerSpec G914 (AMD Ryzen 9 9950X3D, 16 cores and 32 threads; NVIDIA GeForce RTX 5090 with 32 GB; 64 GB DDR5-6000; 2 TB NVMe; AMD X870E; Windows 11 Pro as shipped). **Two tracks:** A, Windows 11 Pro with WSL2; B, Zorin OS 18.1. **Brain:** `bcf-brain-patched/` in this package.

---

## 0. Read this first

| Item | Statement |
| --- | --- |
| What you will have at the end | One vLLM server of the exact competition build, the official harness, the 129 public tasks, a smoke panel and a ranking panel, the brain's build-and-validate loop, and a notebook that produces a valid `submission.zip` |
| What was executed for this document | The brain's build, tests, official validation, replay and probes (Windows, Python 3.12.10); the Kaggle pages, the staff notebook, the wheelhouse metadata, and the vendor and documentation pages named in section 13 |
| What was **not** executed | The install steps on a greenfield G914. They follow the official documentation of each tool and the staff Getting Started notebook; every command that this document could not run is marked "not run here". Run section 12's acceptance table once and you will know |
| Time needed | About half a day per track the first time, most of it downloads (21.9 GB of data, 17 to 18 GB of weights per model, 0.9 GB of wheels) |
| The three things that break parity if skipped | Python must be exactly 3.12.13 for the harness; the wheelhouse wheels must be installed with the notebook's two corrections; the eval must be run with the notebook's `EvalConfig` settings (`tools/run_panel.py`), not with the bare `swegemma eval` command |

---

## 1. The pieces

| Piece | Version | Size | Source |
| --- | --- | --- | --- |
| Driver | NVIDIA 580 or newer on Linux, 570.65 or newer on Windows; the same Windows driver serves WSL2 | - | The distribution's package manager on Zorin; Windows Update or NVIDIA on Windows |
| Python | 3.12.13 for the harness; 3.13 comes from the sandbox image | - | `uv python install 3.12.13` |
| Serving stack | vLLM 0.19.1, transformers 5.13.1, flashinfer 0.6.6, compressed-tensors 0.15.0.1 and 37 more wheels | 0.88 GB | The public wheelhouse, version 31 (`metric/gemma-4-developer-agent-wheelhouse`) |
| PyTorch | 2.10.0 built for CUDA 12.8 (not in the wheelhouse; pre-installed in the Kaggle image) | about 3 GB | `download.pytorch.org/whl/cu128` |
| Harness | swegemma 0.2.11, adk-submission 0.2.13, adk-eval-core 0.1.0, google-adk 1.36.1 | in the wheelhouse | same |
| Tasks | 129 published tasks with snapshots, graphs, embeddings, test wheels and the sandbox Dockerfiles | 21.9 GB compressed | The competition's Data page (rules must be accepted) |
| Model | `gemma-4-31b-it-qat-w4a16-ct` (17 to 18 GB) and `gemma-4-e4b-it-qat-w4a16-ct` for the bonus track | - | Kaggle Models (`google/gemma-4`) or Hugging Face (`google`) |
| Brain | `bcf-brain-patched/` in this package | 76 KB per bundle | this package |
| Container tools | Docker Engine and the NVIDIA Container Toolkit (only for the Docker sandbox) | - | `download.docker.com`, `nvidia.github.io` |
| Kaggle command line | the `kaggle` package, with your API token | - | `pypi.org/project/kaggle` |

---

## 2. Folder layout (the same on both tracks)

| Path inside Linux | Holds |
| --- | --- |
| `~/bcf/.venv` | the Python 3.12.13 environment with torch, vLLM and the wheelhouse |
| `~/bcf/models/<model name>` | the weights, one folder per model |
| `~/bcf/data/gemma-4-developer-agent/` | the unpacked data package: `tasks.jsonl`, `snapshots/`, `graphs/`, `embeddings/`, `wheels/`, `docker/`, `sandbox/`, `sample_submission/` |
| `~/bcf/brain/` | `bcf-brain-patched/` copied here, with `dist/` (the six bundles) and `tools/` |
| `~/bcf/results/<run name>` | one folder per run |
| `~/bcf/submit/` | the bundle to submit and `submission.zip` |

On Windows these paths are inside the WSL2 distribution's own file system (`\\wsl$\Ubuntu-24.04\home\<user>\bcf` from Windows), never under `/mnt/c` or `/mnt/d`: Microsoft's guidance is to keep project files in the Linux file system, and model weights read through `/mnt` load slowly. The 2 TB NVMe of the G914 holds both systems: about 120 GB for Windows and 80 GB for Zorin leaves roughly 800 GB each.

---

## 3. Track B: Zorin OS 18.1

Zorin OS 18.1 is the current version (released 2026-04-15): Ubuntu 24.04 LTS underneath, Linux 6.17, supported to 2029. Everything written for Ubuntu 24.04 applies.

### B.1 Install

1. Download the Zorin OS 18.1 Core 64-bit image and write it to a USB stick with balenaEtcher or Rufus (not run here).
2. Boot the G914 from the stick. In the installer choose **Install alongside Windows** (or "Something else" to size the partitions), keep the Windows bootloader, and create your user.
3. If the installer does not boot with the NVIDIA card visible, choose the "safe graphics" option on the boot menu; the driver is installed after the first boot.
4. After the first login: open **Software** and install updates, then reboot.

### B.2 Driver

```bash
sudo apt update
sudo apt install -y linux-headers-$(uname -r) build-essential dkms pciutils
ubuntu-drivers devices                       # lists what can be installed
sudo ubuntu-drivers install --gpgpu nvidia:580
sudo reboot
nvidia-smi                                   # expect: RTX 5090, driver 580 or newer, CUDA 12.8 or later
```

Use the package manager, never a `.run` installer: the packages carry signed modules that load with Secure Boot on. After every kernel update, check `nvidia-smi` before you start work; the module is rebuilt for the new kernel by DKMS and needs its headers.

### B.3 Base tools, `uv`, Python 3.12.13

```bash
sudo apt install -y git curl unzip pigz patch protobuf-compiler
curl -LsSf https://astral.sh/uv/install.sh | sh
source "$HOME/.local/bin/env"
uv python install 3.12.13
uv --version && uv python list | grep 3.12.13
```

### B.4 The environment

```bash
mkdir -p ~/bcf && cd ~/bcf
uv venv --python 3.12.13 .venv && source .venv/bin/activate
# 1. PyTorch for Blackwell (sm_120 needs CUDA 12.8 or later)
uv pip install torch==2.10.0+cu128 torchaudio==2.10.0+cu128 torchvision==0.25.0+cu128 \
  --index-url https://download.pytorch.org/whl/cu128
# 2. the dependencies of vLLM 0.19.1 (the pinned wheel comes from the wheelhouse in step 3)
uv pip install vllm==0.19.1
# 3. the competition wheelhouse, with the two corrections the staff notebook makes
mkdir -p ~/bcf/wheelhouse && cd ~/bcf/wheelhouse
curl -L -o wheelhouse.zip https://www.kaggle.com/api/v1/datasets/download/metric/gemma-4-developer-agent-wheelhouse
unzip -q wheelhouse.zip
# 4. overlay the wheelhouse with the notebook's two corrections
cp ~/bcf/tools/install-wheelhouse.sh ~/bcf/ && bash ~/bcf/install-wheelhouse.sh ~/bcf/wheelhouse
python -c "import torch, vllm, swegemma; print(torch.__version__, torch.cuda.get_device_capability(), vllm.__version__)"
# expect: 2.10.0+cu128 (12, 0) 0.19.1
```

The fourth step is the script `tools/install-wheelhouse.sh` of this package:

It skips the cutlass wheels, restores the `+cu128` label in the file names, installs with `--no-deps --force-reinstall` through `uv pip` (or `pip` when `uv` is absent), and prints the versions it could import, with the expected values.

Why the corrections: Kaggle's upload strips the `+` from wheel file names, so `torch`-compatible builds look like a different version; the notebook restores it (`'cu128'` to `'+cu128'`). If a `+cu128` build of `torchaudio` or `torchvision` is missing from the PyTorch index, install all three without the suffix from PyPI instead (that is the CUDA 12.9 build, which also supports Blackwell); do not mix indexes.

### B.5 The data package and the model

```bash
uv tool install kaggle            # or: pip install kaggle
mkdir -p ~/.kaggle && chmod 700 ~/.kaggle
# put your token file (from kaggle.com/settings, "Create New Token") at ~/.kaggle/kaggle.json
chmod 600 ~/.kaggle/kaggle.json
mkdir -p ~/bcf/data && cd ~/bcf/data
kaggle competitions download -c gemma-4-developer-agent      # 21.9 GB; the rules must be accepted first
unzip -q gemma-4-developer-agent.zip -d ~/bcf/data
ls ~/bcf/data                      # tasks.jsonl snapshots graphs embeddings wheels docker sandbox sample_submission
```

For the weights, either download from the Kaggle model page (`google/gemma-4`, variant `gemma-4-31b-it-qat-w4a16-ct`, version 2) in the browser, or from Hugging Face:

```bash
uv pip install "huggingface_hub[cli]"
mkdir -p ~/bcf/models
huggingface-cli download google/gemma-4-31B-it-qat-w4a16-ct --local-dir ~/bcf/models/gemma-4-31b-it-qat-w4a16-ct
huggingface-cli download google/gemma-4-E4B-it-qat-w4a16-ct --local-dir ~/bcf/models/gemma-4-e4b-it-qat-w4a16-ct   # bonus track
```

The repository names on Hugging Face use capital letters (`31B`, `E4B`); the competition alias is lower-case. The folder name you choose is yours; what matters is the `--served-model-name` in section 5.

### B.6 Docker for the scorer-like sandbox (optional, about 20 minutes)

```bash
# Docker Engine from the Ubuntu 24.04 ("noble") repository: Zorin's version id is 18, for which no repository exists
sudo apt-get update && sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc
echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu noble stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update && sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo usermod -aG docker "$USER"          # log out and in afterwards
# NVIDIA Container Toolkit
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/stable/deb/nvidia-container-toolkit.list | \
  sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
  sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
sudo apt-get update && sudo apt-get install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker && sudo systemctl restart docker
docker run --rm --gpus all ubuntu nvidia-smi                   # expect the 5090
# the sandbox image, from the Dockerfile the competition ships (needs the network for its pip step)
cd ~/bcf/data && docker build -f docker/Dockerfile.sandbox -t swebench-sandbox:latest docker
docker run --rm swebench-sandbox:latest python3 --version      # 3.13.x: the interpreter the scorer's sandbox runs
```

Docker's documentation notes that derivative distributions such as Linux Mint are not officially supported; the `noble` repository works on Zorin 18.1 (not run here).

### B.7 The brain

```bash
mkdir -p ~/bcf/brain && cp -r <this package>/bcf-brain-patched/. ~/bcf/brain/
cp -r <this package>/tools/. ~/bcf/tools/ && mkdir -p ~/bcf/results ~/bcf/submit
cd ~/bcf/brain && python build.py && python -m unittest tests.test_bcf      # about 90 seconds
```

---

## 4. Track A: Windows 11 Pro with WSL2

vLLM does not support Windows natively ("To run vLLM on Windows, you can use the Windows Subsystem for Linux (WSL) with a compatible Linux distribution", vLLM 0.19.1 installation page). Everything that touches the model runs inside WSL2. Building and validating the brain runs on Windows itself (that is how this package was validated).

### A.1 Windows side (PowerShell as administrator)

```powershell
wsl --install -d Ubuntu-24.04          # enables the required features and installs Ubuntu 24.04
# restart the machine, then create your Linux user name and password
wsl --update                            # the fix for "nvidia-smi works but CUDA is unavailable" on 50-series cards
wsl --version
nvidia-smi                              # on Windows: RTX 5090, driver 570.65 or newer
```

Create `C:\Users\<you>\.wslconfig` (not run here; values chosen for a 64 GB, 32-thread machine):

```ini
[wsl2]
memory=40GB
processors=24
swap=16GB
localhostForwarding=true
[experimental]
autoMemoryReclaim=gradual
sparseVhd=true
```

then `wsl --shutdown`. The defaults you are overriding: 50% of the memory for the VM and all logical processors (`.wslconfig` documentation). `autoMemoryReclaim` is an experimental setting with the values `disabled`, `gradual` and `dropCache`.

### A.2 Inside Ubuntu (the `wsl` shell)

```bash
/usr/lib/wsl/lib/nvidia-smi               # WSL's own nvidia-smi: a limited feature set is normal
sudo apt update && sudo apt install -y git curl unzip pigz patch protobuf-compiler build-essential
printf '[boot]\nsystemd=true\n' | sudo tee /etc/wsl.conf      # needed only for Docker Engine inside the distro
```

then, from PowerShell, `wsl --shutdown` and open the shell again; verify with `systemctl list-unit-files --type=service`. Continue with **B.3 to B.7** exactly as on Zorin, with two differences:

- **Never install an NVIDIA driver inside the distribution.** The Windows driver is "stubbed inside WSL as libcuda.so"; "Do not install the cuda-drivers or nvidia-open packages" (CUDA on WSL User Guide). A CUDA toolkit is not needed for the pip environment; if you compile something, install `cuda-toolkit-<version>` from the standard Ubuntu repository (the WSL-Ubuntu repository is deprecated).
- **Downloads may land on Windows, work must not.** `D:\` is `/mnt/d` inside the distribution. Unpack the data package and the weights with `unzip ... -d ~/bcf/...` so that they end up on the Linux file system.

### A.3 Docker on Windows: one of two

| Option | How | When |
| --- | --- | --- |
| Docker Desktop | `winget install Docker.DockerDesktop`; Settings, General, "Use the WSL 2 based engine" on. The GPU passthrough is built in: `docker run --rm --gpus all ubuntu nvidia-smi` | The simplest |
| Docker Engine inside the distribution | The commands of B.6, unchanged, after `systemd` is enabled | If you prefer one less layer; mutually exclusive with Docker Desktop's integration for that distribution |

### A.4 Windows itself

The brain's loop runs natively: install Python 3.12 (or `uv`: `powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"`) and run `python build.py`, `python -m unittest tests.test_bcf` and the validator from PowerShell in `brain\`. To reach the folder from WSL: `/mnt/d/...`; to reach WSL from Windows: `\\wsl$\Ubuntu-24.04\home\<user>\bcf`. Turn off Git's automatic line-ending conversion for the brain (`git config --global core.autocrlf false`): the build refuses carriage returns.

---

## 5. Start the model server (both tracks)

Open a terminal, enter the environment, set the notebook's environment variables, and start vLLM with the notebook's settings for one GPU:

```bash
source ~/bcf/.venv/bin/activate
export HF_HOME=~/bcf/hf TRANSFORMERS_OFFLINE=1 TRANSFORMERS_NO_TF=1 TRANSFORMERS_NO_FLAX=1 \
       VLLM_NO_USAGE_STATS=1 VLLM_WORKER_MULTIPROC_METHOD=spawn VLLM_ENGINE_READY_TIMEOUT_S=1200 \
       VLLM_MEMORY_PROFILER_ESTIMATE_CUDAGRAPHS=1 PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True \
       NCCL_DEBUG=WARN LITELLM_LOCAL_MODEL_COST_MAP=True LITELLM_TELEMETRY=False OTEL_SDK_DISABLED=true
vllm serve ~/bcf/models/gemma-4-31b-it-qat-w4a16-ct \
  --served-model-name gemma-4-31b-it-qat-w4a16-ct \
  --host 127.0.0.1 --port 8000 \
  --max-model-len 32768 --dtype bfloat16 --gpu-memory-utilization 0.90 \
  --enable-auto-tool-choice --tool-call-parser gemma4 --reasoning-parser gemma4 \
  --no-scheduler-reserve-full-isl \
  --default-chat-template-kwargs '{"enable_thinking": true}' \
  > ~/bcf/vllm-31b.log 2>&1 &
tail -f ~/bcf/vllm-31b.log        # wait for the line that says the server is started; the first start compiles kernels
```

| Setting | Value | Source |
| --- | --- | --- |
| `--served-model-name` | the bundle's `model:` line, exactly | The harness maps the declared model to `openai/<name>` on the server |
| `--max-model-len` | 32768 | Staff notebook, cell 8; the harness caps `max_output_tokens` and `thinking_budget` at the same number |
| `--dtype` | bfloat16 | Notebook |
| `--gpu-memory-utilization` | 0.90 | Notebook (the older README says 0.80) |
| `--enable-auto-tool-choice`, both parsers | `gemma4` | Notebook; vLLM's Gemma 4 guide |
| `--no-scheduler-reserve-full-isl` | the notebook sets it to `False`; vLLM's default is `True` | Notebook; vLLM 0.19.1 engine arguments |
| `--default-chat-template-kwargs` | thinking on | vLLM's Gemma 4 guide: "add the argument --default-chat-template-kwargs '{"enable_thinking": true}'" (not run here on 0.19.1: check `vllm serve --help` for the flag's exact name on this build) |
| No `--quantization` flag | the checkpoint's own config is read | Earlier guide of this project (2026-10-31) |
| No `--tensor-parallel-size` | one GPU; the notebook uses 4 when it sees 4 | Notebook |

For the bonus track, start the E4B server instead, with `--served-model-name gemma-4-e4b-it-qat-w4a16-ct`. For the 12B checkpoint only, add `--hf-overrides '{"architectures": ["Gemma4ForCausalLM"], "model_type": "gemma4"}'` (staff notebook).

Check it from a second terminal:

```bash
curl -s http://127.0.0.1:8000/v1/models | head -c 300        # lists "gemma-4-31b-it-qat-w4a16-ct"
```

Keep the server running for the whole working session: it is the slowest thing to recreate. Under WSL2, do not use `nvidia-smi` utilization as a health signal (unsupported query there); read `~/bcf/vllm-31b.log` or `curl -s http://127.0.0.1:8000/metrics`.

---

## 6. First run: the smoke panel

```bash
source ~/bcf/.venv/bin/activate && cd ~/bcf
D=~/bcf/data
python tools/run_panel.py --tasks $D/tasks.jsonl --snapshots $D/snapshots \
  --bundle brain/dist/bcf-31b-flat --results results/smoke-01 \
  --panel tools/panel_smoke.txt --sandbox subprocess
```

`run_panel.py` does what the staff notebook does in its evaluation cell: it reads the four budgets from the bundle's `eval_config.yaml`, switches on compaction at 14,336 tokens, points the model registry at your server, and refuses to start if the server does not serve the bundle's model under the bundle's name. The plain `swegemma eval` command does neither: it ignores `eval_config.yaml` (it would give every task 60 minutes) and runs without compaction.

What to look at after five tasks (expect 5 to 15 minutes; not run here):

| Look at | Expect | If not |
| --- | --- | --- |
| The first printed line of `run_panel.py` | `model gemma-4-31b-it-qat-w4a16-ct ... eval_config.yaml read: 8 min, 28 calls, 80 turns, command 240 s` | A different budget: the wrong bundle folder |
| `results/smoke-01/summary.json` | `total_tasks: 5` and a `resolved` count | `errors` above zero: open `task_results.jsonl`, column `error` |
| `results/smoke-01/logs/fastapi_14077.log` | The agent's calls: the installer, `plan`, `find`, `apply`, a test, `finalize`, `submit_patch` | `No module named` or `command not found` inside a call: the sandbox cannot find `python3` or `git` |
| `results/smoke-01/traces/trace_fastapi_14077.json` | Token usage and elapsed seconds per step | Absent: the trace was not written; read the log instead |
| `~/bcf/vllm-31b.log` | Requests arriving, no errors | Connection errors: the server restarted; read its last 50 lines |

For the Docker sandbox instead (slower per task, closer to the scorer): the same command with `--sandbox docker --image swebench-sandbox:latest`.

---

## 7. Panel runs and comparisons

```bash
cd ~/bcf && source .venv/bin/activate
for r in 1 2 3; do
  python tools/run_panel.py --tasks data/tasks.jsonl --snapshots data/snapshots \
    --bundle brain/dist/bcf-31b-flat --results results/31b-flat-r$r --panel tools/panel30.txt --sandbox subprocess
done
python tools/run_report.py results/31b-flat-r1 results/31b-flat-r2 results/31b-flat-r3 \
  --labels <this package>/../2026-11-23_BCF_Brain_and_Dataset_RCA/data/rca_merged.jsonl --out results/31b-flat-report.md
```

Rules that make the comparison worth the time: the same panel in the same order for every bundle; three runs per bundle; one change at a time; the adopt condition written down before the run (Task 2, section C.5); the decision read from the paired table (Task 4, section 3.6). `--concurrency 3` runs three tasks at once on the 5090 and is fine for ranking runs once the smoke run is clean; use `--concurrency 1` for any run whose time you want to trust.

---

## 8. The loop: change, build, validate

After any change under `brain/parts/` or `brain/src/prompts/`, or to the values in `brain/build.py`:

```bash
cd ~/bcf/brain
python assemble.py                               # helper from its parts; compiles before it writes
python build.py                                  # six bundles and zips in dist/
python -m unittest tests.test_bcf                # about 90 seconds: 36 pass, 1 skipped
python tools/setup_validate_venv.py              # once: the official harness packages (about 870 MB)
python tools/run_validator.py                    # official compiler 6 of 6, controls 15 of 15
sha256sum dist/bcf-31b-flat.zip                  # goes into the ledger
```

The per-task budgets live in two places that must agree: `EVAL` in `build.py` and `BUDGET_S` in `parts/_bcf_head.py`; the build stops when they disagree. Sampling parameters (thinking budget, temperature, output cap) live in `SAMPLING` in `build.py`.

---

## 9. Prepare a submission

| Step | Action | Pass condition |
| --- | --- | --- |
| 1 | Build and validate (section 8) | 6 of 6, 15 of 15, 36 tests |
| 2 | One smoke run with the model on the exact bundle | Clean: every task has a patch or a clear reason |
| 3 | One ranking-panel run, read with `run_report.py` | Projected hours for 120 tasks at or below 10.8 |
| 4 | Use `dist/<bundle>.zip` as built: `agent.yaml` is at the root of the archive | `unzip -l dist/bcf-31b-flat.zip` shows `agent.yaml` first |

---

## 10. Submit to the competition: the main track

This is a code competition. Kaggle's documentation describes the flow: "all submissions must be made from inside a Kaggle Notebook. You cannot upload predictions directly", and "Initialize a Notebook with the competition dataset. Generate a submission file ... in /kaggle/working. Click 'Save Version', 'Save & Run All'. From the Notebook Viewer" submit to the competition. For this competition the file is `submission.zip` with `agent.yaml` at its root (Overview page); the staff Getting Started notebook writes it to `/kaggle/working/submission.zip`. The competition's scoring program then unpacks it, runs the agent on the hidden tasks and verifies the patches.

### 10.1 Put the bundle where a notebook can read it

A notebook can only read its inputs, so the bundle travels as a private Kaggle Dataset (not run here; the dialog names are Kaggle's):

1. On kaggle.com: **Create**, **New Dataset**.
2. Upload the **contents** of `brain/dist/bcf-31b-flat/` (so that `agent.yaml` sits at the top level of the dataset, not inside a folder).
3. Title it after the bundle (for example `bcf-31b-flat-patched`), set **Private**, create.
4. Every time the bundle changes, add a new version of the same dataset with the same rule.

With the command line instead (the metadata file format is in `kaggle datasets create --help`):

```bash
mkdir -p ~/bcf/submit/ds && cp -r brain/dist/bcf-31b-flat/. ~/bcf/submit/ds/
cd ~/bcf/submit && kaggle datasets create -p ds        # later: kaggle datasets version -p ds -m "what changed"
```

### 10.2 Create the submission notebook

1. **Code**, **New Notebook**. Add **Input**: the competition `Gemma 4 Developer Agent` (this attaches the data package; at scoring time the hidden test set replaces the training set) and your bundle dataset.
2. **Settings**: Internet **Off** (the L4 sessions must run without internet). Accelerator: none is enough for a notebook that only packages a file; choose **GPU L4 x4** only if the Submit option is not offered without an accelerator version.
3. Replace the content with one cell:

```python
import pathlib, shutil, zipfile

work = pathlib.Path('/kaggle/working')
roots = [p.parent for p in pathlib.Path('/kaggle/input').glob('*/agent.yaml')]
assert len(roots) == 1, f'expected one dataset with agent.yaml at its root, found {roots}'
agent = work / 'agent'
if agent.exists():
    shutil.rmtree(agent)
shutil.copytree(roots[0], agent)
archive = shutil.make_archive(str(work / 'submission'), 'zip', root_dir=agent)
with zipfile.ZipFile(archive) as z:
    infos = z.infolist()
print(archive, len(infos), 'files,', sum(i.file_size for i in infos), 'bytes; agent.yaml at root:',
      'agent.yaml' in z.namelist())
for i in infos:
    print(' ', i.filename, i.file_size)
```

4. **Save Version**, mode **Save & Run All (Commit)**. When the version has finished, open it from the Notebook Viewer and use **Submit to Competition**.
5. Keep the notebook and the dataset: a new bundle is a new dataset version and a new notebook version.

### 10.3 After submitting

| When | Do |
| --- | --- |
| Right after | My Submissions shows the new entry as pending; one pending submission blocks the next |
| 26 to 29 hours later, typically | The score appears. Record it in the ledger (section 12) with the hours it took and the result size |
| The score is 0.00 | Read the result size: about 3,230 bytes means a backend failure (three teams, 2026-11-21 to 23; staff investigating). Resubmit the same file; do not change the bundle in response |
| The score is in the expected band | Nothing: a single value has a band of about 4 tasks (Task 4, section 6) |

Rules that apply to every submission: one per day; at most two final selections, by 2026-12-02 23:59 UTC; entry and team-merger deadline 2026-11-25 23:59 UTC.

---

## 11. Submit to the bonus track: the small-model prize

The bonus prize ($10,000) goes to the highest-ranked submission on the private set whose base model is `gemma-4-e4b-it-qat-w4a16-ct` or `gemma-4-e2b-it-qat-w4a16-ct`, and the submission must be one of the team's two selected finals (Overview page, "Bonus Prize"). Nothing in the procedure changes except the bundle:

| Step | Main track | Bonus track |
| --- | --- | --- |
| Bundle | `dist/bcf-31b-flat` (or the relay twin) | `dist/bcf-e4b-flat` |
| Local server | the 31B weights, `--served-model-name gemma-4-31b-it-qat-w4a16-ct` | the E4B weights, `--served-model-name gemma-4-e4b-it-qat-w4a16-ct` |
| Dataset | the contents of the bundle folder | the contents of the E4B bundle folder |
| Notebook | the one-cell packaging notebook | the same notebook (it finds the dataset with `agent.yaml`) |
| Final selection | at most two, across both tracks | the E4B submission must be one of the two |

The E4B bundles already carry the settings the public measurements support for the small model: a thinking budget of 1,024 for the solver and 256 for the planner, planner temperature 0, an output cap of 8,192, short prompts, and a first edit by call 6. Do not attach a LoRA adapter to a first bonus submission. E4B is the variant to choose over E2B: a public report describes a loading failure of the E2B checkpoint on the pinned serving stack (thread 748287).

---

## 12. The ledger

One row per attempt, kept by hand in any spreadsheet:

| Date (UTC) | Bundle | SHA-256 of the zip | Local panel: resolved in 3 runs | Projected mean s per task | Hours to score | Public score | Result size | Note |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| example: 2026-11-25 08:10 | bcf-31b-flat (patched) | first 12 characters of `sha256sum` | 11, 10, 11 of 30 | 265 | 27 | 0.21 | 91,204 bytes | first attempt; answers whether skills run on the scorer |

---

## 13. Acceptance table

Run these once after the install. Every pass condition can be checked without the model.

| Test | Command | Pass condition |
| --- | --- | --- |
| Driver | `nvidia-smi` (on Zorin; `/usr/lib/wsl/lib/nvidia-smi` under WSL2) | RTX 5090, driver 580 or newer on Linux (570.65 or newer on Windows) |
| Interpreter | `python --version` in the environment | `Python 3.12.13` |
| Torch | `python -c "import torch; print(torch.cuda.is_available(), torch.cuda.get_device_capability())"` | `True (12, 0)` |
| Stack | `bash tools/install-wheelhouse.sh` (it prints them) | vllm 0.19.1, transformers 5.13.1, swegemma 0.2.11 |
| Server | `curl -s http://127.0.0.1:8000/v1/models` | the bundle's model name |
| Data | `ls ~/bcf/data` | `tasks.jsonl snapshots graphs embeddings wheels docker sandbox sample_submission` |
| Brain | section 8 | 36 pass and 1 skipped; 6 of 6; 15 of 15 |
| Sandbox interpreter (Docker) | `docker run --rm swebench-sandbox:latest python3 --version` | `Python 3.13.x` |
| First smoke run | section 6 | five tasks, a result per task, no harness error |

---

## 14. Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| `No module named torch` after the wheelhouse install | The wheels were installed into another interpreter | Activate `~/bcf/.venv` first; `which python` must point into it |
| `CUDA error: no kernel image is available` | A PyTorch build without Blackwell kernels | Install torch from the cu128 index before everything else (section B.4) |
| `torch.cuda.is_available()` is `False` under WSL2 with `nvidia-smi` working | Stale WSL kernel | `wsl --update`, then `wsl --shutdown` |
| vLLM fails while starting under WSL2 and starts on Zorin | The GPU paravirtualisation limits pinned host memory | Keep `PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True`; lower `--gpu-memory-utilization`; or serve from Zorin |
| The model loads very slowly | Weights read through `/mnt/` | Move `~/bcf/models` and `HF_HOME` into the Linux file system |
| The server exits with a "head size not supported" message | Gemma 4's mixed head dimensions and the selected attention backend on vLLM 0.19.x | Read the backend line in the log; the earlier guide of this project set `VLLM_ATTENTION_BACKEND=TRITON_ATTN` for this case (2026-10-31) |
| `run_panel.py` exits with code 2 | No server, or the served name differs from the bundle's model | Start the server with `--served-model-name` equal to the `model:` line |
| Every task gets 60 minutes | The run went through `swegemma eval` instead of `run_panel.py` | Use `run_panel.py` |
| Tasks end at once with "Path traversal" or "No such file" | The sandbox cannot see `python3` or `git` | In Docker mode, rebuild the image from the shipped Dockerfile |
| Docker cannot see the GPU | Toolkit not configured, or two Dockers installed | `sudo nvidia-ctk runtime configure --runtime=docker`, restart Docker; keep one |
| `docker build` cannot find `imp.py` | Wrong build context | `docker build -f docker/Dockerfile.sandbox -t swebench-sandbox:latest docker` (the context is the `docker` folder) |
| The VM keeps its memory after a run | Cache not reclaimed | `wsl --shutdown` between sessions |
| The notebook's Save & Run All fails on the one-cell notebook | More than one input has `agent.yaml` at its root, or the dataset was uploaded as a folder | Upload the contents of the bundle folder; keep only one such dataset attached |
| The submission scored 0.00 | Backend failure or a compile failure | Result size about 3,230 bytes: resubmit the same file. Normal size: run the validator on the exact zip |

---

## 15. Sources

| Source | Publisher | Date | Used for |
| --- | --- | --- | --- |
| [Getting Started - Gemma 4 Developer Agent](https://www.kaggle.com/code/ryanholbrook/getting-started-gemma-4-developer-agent), version 3 | Ryan Holbrook (staff) | last run 2026-11-21; fetched 2026-11-24 | Environment variables, the wheelhouse install and its two corrections, vLLM settings, the `EvalConfig` values, the packaging cell, Python 3.12.13 |
| Competition [Overview](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview), [Data](https://www.kaggle.com/competitions/gemma-4-developer-agent/data), [Rules](https://www.kaggle.com/competitions/gemma-4-developer-agent/rules) | Kaggle | fetched 2026-11-24 | `submission.zip` with `agent.yaml` at the root, the 12-hour rule, the bonus terms, deadlines, one submission per day |
| [Kaggle competitions documentation](https://www.kaggle.com/docs/competitions) and [notebooks documentation](https://www.kaggle.com/docs/notebooks) | Kaggle | fetched 2026-11-24 | The code-competition flow, session limits, L4x4 quota |
| [G914 Gaming PC](https://powerspec.com/product/698934) | PowerSpec | fetched 2026-11-24 | The machine |
| [vLLM 0.19.1 installation](https://docs.vllm.ai/en/v0.19.1/getting_started/installation/gpu.html), [engine arguments](https://docs.vllm.ai/en/v0.19.1/configuration/engine_args.html), [Gemma 4 usage guide](https://docs.vllm.ai/projects/recipes/en/stable/Google/Gemma4.html) | vLLM project | fetched 2026-11-24 | No native Windows, CUDA builds, the serve flags |
| [CUDA on WSL User Guide](https://docs.nvidia.com/cuda/wsl-user-guide/index.html) | NVIDIA | v13.5, fetched 2026-11-24 | The driver rule, limitations |
| [`.wslconfig`](https://learn.microsoft.com/en-us/windows/wsl/wsl-config), [install WSL](https://learn.microsoft.com/en-us/windows/wsl/install), [systemd](https://learn.microsoft.com/en-us/windows/wsl/systemd), [development environment guide](https://learn.microsoft.com/en-us/windows/wsl/setup/environment) | Microsoft Learn | fetched 2026-11-24 | The Windows track |
| [Zorin OS technical details](https://zorin.com/os/details/), [Zorin OS 18.1 release post](https://blog.zorin.com/2026/04/15/zorin-os-18.1-is-released/) | Zorin | fetched 2026-11-24 | Version, base, kernel |
| [Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/), [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html), [uv](https://docs.astral.sh/uv/getting-started/installation/) | Docker, NVIDIA, Astral | fetched 2026-11-24 | The commands of sections B.3 and B.6 |
| `HARNESS_README.md`, `docker/Dockerfile.sandbox`, `swegemma` 0.2.11 source | Kaggle data package and wheelhouse v31 | read 2026-11-24 | The sandbox image, the CLI, the result files |
| [Byte-identical resubmission scored 0.00](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/761004), [New Gemma 4 models](https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/748287) | Kaggle staff and competitors | 2026-10-11 to 2026-11-23 | The 3,230-byte signature, the 12B override, the E2B report |
| RTX 5090 local-testing guide of 2026-10-31 (files 02, 03, 07, 08) | this project | 2026-10-31 | Driver floors, the TRITON attention fallback, Hugging Face repository names |


---

<!-- ====================================================================== -->
<!-- FILE: 08_Table_QC_Report.md -->
<!-- ====================================================================== -->

# Table quality check of the package (2026-11-24)

Checker: `qc_tables.py` of the RCA package (`2026-11-23_BCF_Brain_and_Dataset_RCA/bcf-brain/tools/qc_tables.py`), run on 2026-11-24 after the last edit. It verifies every Markdown table: one header row, a separator with the right number of cells, every body row with the same number of cells as the header, no unescaped pipe inside a code span, at least one body row, consistent alignment markers. Pipes inside table cells are escaped or kept out of tables; the "prose lines containing a pipe" counted below are code lines and in-line expressions outside tables.

## 1. Per document

| Document | Tables | Defects | Prose lines with a pipe (not tables) |
| --- | ---: | ---: | ---: |
| `00_README.md` | 6 | 0 | 0 |
| `01_Exception_Handling_Traps_by_Error_Family.md` | 9 | 0 | 3 |
| `02_Time_Bottlenecks_and_Tuning_Levers.md` | 12 | 0 | 0 |
| `03_Local_Kaggle_Parity_Plan.md` | 10 | 0 | 0 |
| `04_Local_Scoring_and_Interpretation_Guide.md` | 16 | 0 | 0 |
| `05_Board_Issues_Graceful_Handling_Audit.md` | 11 | 0 | 0 |
| `06_Impact_Effort_Roadmap.md` | 6 | 0 | 0 |
| `07_Setup_and_Run_Guide.md` | 13 | 0 | 1 |
| `08_Table_QC_Report.md` (this file) | 4 | 0 | 0 |
| Total, documents | 87 | 0 | 4 |

## 2. Whole package, including sub-folders

| Scope | Files scanned | Tables | Defects |
| --- | ---: | ---: | ---: |
| The package (`bcf-brain-patched/` and `tools/` included) | 35 | 91 | 0 |
| `bcf-brain-patched/` on its own | 26 | 4 | 0 |
| `bcf-brain-patched/validation/` on its own | 1 | 2 | 0 |

## 3. Defects found and fixed during the check

| Document | Defect | Fix |
| --- | --- | --- |
| `01_...` | Two rows held an unescaped pipe inside a code span (the Gemma delimiter tokens and a regular expression), which splits a cell in GitHub-flavored Markdown | Both rows reworded without pipes |
| `03_...` | Two rows carried a garbled sentence and a wrong source cell (found on re-reading, not by the checker) | Rows rewritten |
| `05_...` | The tally counted twelve model-and-serving issues as nine handled; the correct count is eight, and the total is 51 issues, not 52 | Headline and tally corrected |
| `07_...` | The ledger template had a header and no body row | One example row added |

## 4. HTML twins

| File | Bytes | External scripts or styles | Images or frames from the network | Level-2 headings with an identifier (the table of contents links) |
| --- | ---: | ---: | ---: | ---: |
| `07_Setup_and_Run_Guide.html` | 73,748 | 0 | 0 | 16 |
| `00_README.html` | 18,691 | 0 | 0 | 7 |

Both files are built by `tools/make-html.sh` with pandoc 3.11 from the template `tools/portable-toc.html`: all style is inline, the page adapts to dark and light systems, and it prints without the navigation bar. The only links that leave the file are the citations in the text and the navigation links to the sibling Markdown files.

