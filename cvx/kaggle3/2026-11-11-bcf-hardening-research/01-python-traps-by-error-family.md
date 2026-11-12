# Python Traps & Gotchas by Root-Cause Family — BCF Definitive Guide

**Project:** BCF / Kaggle Gemma 4 Developer Agent Competition (swegemma harness)
**Date:** 2026-11-11 · **Author:** L1 hardening research (local-only synthesis)
**Runtime context:** competition sandbox = Python 3.13 (`python:3.13-slim`); host notebook = 3.12.13; task code spans 3.8–3.14.
**Scope:** all 10 root-cause families over the 129-task public problem set (fastapi 67, rich 48, requests 13, httpx 1).

## How to read this guide

**Sources (all local).** Paths are relative to the project root `d:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test_alibaba/`.

| Source | Path | Role |
| --- | --- | --- |
| Official-docs research notes | `scratch/bcf-hardening-2026-11-11/research/python313-docs.md` | Citation backbone (cited below as **notes §N.N**) |
| Taxonomy + 129-task table | `scratch/bcf-2026-11-11/taxonomy.md` | Family definitions, stats, assignments |
| Per-task RCAs | `scratch/bcf-2026-11-11/rca/<iid>.md` / `.json` | Real problem-set mechanisms (cited as **RCA: \<iid\>**) |
| Harness contract | `input/kagglecomp/kagglecomp_data_package/HARNESS_README.md` §5.2, §8, §10 | Execution + verification rules |
| Sandbox image | `scratch/bcf-hardening-2026-11-11/docker/docker_Dockerfile.sandbox` (+ `docker_imp.py`, `docker_telnetlib.py`) | Python 3.13, pytest/pytest-timeout, shims |
| Scorer-convention intel | `scratch/bcf-2026-11-11/intel/live-harness-fixes.md`, `intel/live-solvability-data.md` | Competitor-reported harness bugs (thread 757893) |

**Confidence legend (inherited verbatim from the research notes — do not upgrade):**

- **HIGH (verbatim):** the exact quoted string appeared literally in a search snippet from the primary doc (`docs.python.org` / `docs.pytest.org`). Wording and page attribution trustworthy.
- **MEDIUM (paraphrase):** stated by the search summarizer, no verbatim snippet seen (or the only verbatim hit was a translated page). Not a word-for-word quote.
- **LOW / UNVERIFIED:** background knowledge not confirmed by any snippet, or snippets contradicted. Flagged explicitly.
- **RCA-verified:** mechanism confirmed by the per-task analyst against the actual repo code (sometimes "verified locally" in the RCA), but *not* covered by the official-docs notes.
- **Analyst inference:** reasoning by the guide/notes author; no primary source. Never present as doc fact.

**Method caveat that caps ALL doc confidence:** the docs research session could not use WebFetch (backend error on all 7 attempts); every quote was gathered via WebSearch snippets. HIGH means "verbatim in a snippet", not "read off the full page". Re-verify high-value quotes with a working fetch before external publication (notes, closing line).

**Citation format per trap:** `Doc: <URL> · <version gate> · <confidence> (notes §N.N)`. Problem-set examples always cite their RCA file. Fix patterns are **mechanism-level and generic** — the hidden evaluation set comes from PRIVATE repos, so memorizing public expected strings does not transfer (taxonomy Insight 5).

---

## 1. Interpreter context: the three-version skew

### 1.1 The skew

| Layer | Python | Evidence | Consequence |
| --- | --- | --- | --- |
| Host notebook (local dev / Kaggle V31) | 3.12.13 | `intel/live-harness-fixes.md` env table (thread 748287) | Your local repros run here; 3.13-only behavior is invisible |
| Competition sandbox (Container A agent + Container B verification) | 3.13 (`python:3.13-slim`) | `docker_Dockerfile.sandbox` line 1 | Graded behavior; 3.12-removed modules already gone, 3.13 removals newly gone |
| Task code / upstream support ranges | 3.8–3.14 | notes header; e.g. fastapi_14186 targets 3.14 + Pydantic 2.12.1 | A fix must not break the *oldest* supported interpreter even though it runs on 3.13 |

**Headline:** you debug on 3.12, you are graded on 3.13, and your patch must stay correct on 3.8–3.14. Every "modernize this API" instinct is a potential regression on the low end; every "it imports fine locally" observation is potentially false in the sandbox.

### 1.2 What changed per version that matters for these tasks

| Version | Change | Notes citation | Families hit |
| --- | --- | --- | --- |
| 3.10 | `X \| Y` unions produce `types.UnionType` (distinct from `typing.Union` until 3.14); `inspect.signature(eval_str=...)`; "Did you mean" suggestions; `TypeGuard` | §3.4 MEDIUM, §3.2 HIGH (eval_str), §1.10 MEDIUM, §3.8 MEDIUM | type-introspection, schema-generation-logic, compatibility-shim |
| 3.11 | `ExceptionGroup`/`except*` (PEP 654); `add_note` (PEP 678); `sys.exception()`; `asyncio.TaskGroup`; PEP 657 fine-grained traceback columns; `re` atomic groups/possessive quantifiers; global inline flags restricted to pattern start | §1.5, §1.3, §1.1 HIGH, §5.1 HIGH, §1.8 HIGH (title), §6.2 MEDIUM, §6.4 MEDIUM | api-contract-violation, state-lifecycle, compatibility-shim, ordering-off-by-one, infinite-loop-recursion |
| 3.12 | Removed `imp`, `asynchat`, `asyncore`, `distutils`; PEP 695 `type` statement → `TypeAliasType`; invalid escape sequences become `SyntaxWarning`; `DeprecationWarning` from `typing.ByteString`; traceback `capture_locals` swallows broken `repr()` (gh-87822); `unittest` legacy aliases removed | §7.2 MEDIUM, §3.1 MEDIUM, §6.3 MEDIUM, §3.9 MEDIUM, §2.2 MEDIUM | compatibility-shim, type-introspection, boundary-edge-case, docs-content-error |
| 3.13 | Removed 19 "dead batteries" (`telnetlib`, `cgi`, `cgitb`, `imghdr`, `mailcap`, `nntplib`, `uu`, `xdrlib`, ...); `typing.TypeIs` (PEP 742) + `typing.ReadOnly` (PEP 705); colorized tracebacks by default on TTY; `TracebackException(show_group=...)`; kwarg suggestions in errors; stricter `re` group references | §7.3 MEDIUM, §3.8 MEDIUM, §1.9 MEDIUM, §2.7 MEDIUM, §1.10 MEDIUM, §6.4 MEDIUM | compatibility-shim, missing-capability, docs-content-error, boundary-edge-case |
| 3.14 (awareness only — NOT the sandbox) | `types.UnionType` and `typing.Union` become aliases; PEP 649/749 deferred annotations + `annotationlib`; `pdb.Pdb(colorize=...)`; Pydantic ≥2.12 drops the `pydantic.v1` shim here (RCA: fastapi_14186) | §3.4 MEDIUM, §3.10 MEDIUM, §2.6 HIGH (pdb) | compatibility-shim, type-introspection, schema-generation-logic |

### 1.3 The shims the sandbox ships — and why

`docker_Dockerfile.sandbox` lines 10–11:

```dockerfile
COPY imp.py /usr/local/lib/python3.13/site-packages/imp.py
COPY telnetlib.py /usr/local/lib/python3.13/site-packages/telnetlib.py
```

- **`imp.py`** (26 lines, `docker_imp.py`): a *minimal* compatibility layer "specifically for flasgger". It implements only `find_module(name, path)` on top of `importlib.util.find_spec`, returns a dummy `(None, pathname, None)` tuple, and registers itself via `sys.modules['imp'] = sys.modules[__name__]`. **Trap:** `import imp` succeeds in the sandbox but `imp.load_module`, `imp.new_module`, etc. do not exist → `AttributeError`, not `ModuleNotFoundError`. Do not conclude "imp is available on 3.13" — only this one function is.
- **`telnetlib.py`** (680 lines, `docker_telnetlib.py`): a full vendored copy of the pre-3.13 stdlib module (RFC 854 client). It exists because some test dependency imports `telnetlib`, which 3.13 removed (§7.3 MEDIUM). **Trap:** it lives in `site-packages`, so `telnetlib.__file__` points there, not at the stdlib — a shadowing-style surprise when you audit imports (§7.1).
- **Not shimmed:** `cgi`, `cgitb`, `distutils`, `asynchat`, `asyncore`, and the other dead batteries. Code importing those fails in the sandbox even if it worked on a 3.11 host or a 3.12 host (`distutils`/`imp` died in 3.12, `cgi`/`telnetlib` in 3.13).

### 1.4 The "works locally, fails in sandbox" trap class

1. **Removed-module imports** — `import cgi` works on the 3.12.13 host, `ModuleNotFoundError` on 3.13 (notes §7.3 MEDIUM). Check every import against the 3.13 removal list before trusting a local green run.
2. **Version-gated new APIs** — `typing.TypeIs`/`ReadOnly` import fine on 3.13 but `ImportError` on the 3.12 host and on 3.8–3.12 task targets (notes §3.8 MEDIUM). The reverse gate (`sys.exception()`, `add_note`, `except*`, `TaskGroup`) parses/runs on host+sandbox but breaks 3.8–3.10 task variants (notes §1.1/1.3/1.5/5.1).
3. **Syntax-level gates** — `type X = ...` (3.12+) and `except*` (3.11+) are `SyntaxError` on older interpreters; a file containing them cannot even be *imported* there, so the failure is at collection, not at the call site (notes §3.1, §1.5).
4. **Colorized tracebacks** — 3.13 colorizes on TTY; ANSI escapes leak into captured strings/JUnit XML and break exact-match assertions. Set `NO_COLOR=1` or `PYTHON_COLORS=0` in repros (notes §1.9 MEDIUM; precedence `PYTHON_COLORS` > `NO_COLOR` > `FORCE_COLOR`).
5. **`sys.path` differences** — Phase 2 runs `PYTHONSAFEPATH=1 PYTHONNOUSERSITE=1 python3 -s -m pytest` (HARNESS_README §8.2), which changes script-dir/cwd path insertion vs your local `pytest` invocation; combined with repo files named like stdlib modules (§7.1 HIGH) and editable-vs-copied installs (§7.4 GAP), the module you *edited* may not be the module the test *imports*. Always check `module.__file__`.
6. **Warning visibility** — a `SyntaxWarning` (invalid escape, 3.12+) or a library `DeprecationWarning` that is silent in your casual local run becomes a hard error under the repo's `filterwarnings = ["error", ...]` (notes §6.3, §4.1, §4.2; RCA: fastapi_14077, fastapi_14186).
7. **Protocol `isinstance` semantics** — on 3.12+ `runtime_checkable` Protocol checks use `inspect.getattr_static`, bypassing `__getattr__` proxies (RCA-verified: requests_7502; not in the docs notes — see §2.1 TI-8). A check that passed on 3.11 can fail on host *and* sandbox.

### 1.5 Harness execution rules that shape every post-mortem (HARNESS_README §5.2, §8, §10)

- Single command timeout **300 s** (a hung repro fails the command, not the session); command output capped at **5000 chars**; `read_file` capped at **150 lines / 10000 chars**. Print small, chunked diagnostics; write big dumps to `/tmp` and read slices.
- **Offline**: no PyPI. All deps pre-installed. Never `pip install`; if a test needs a missing lib, that is an environment ceiling, not your bug (intel: ~34 tasks hit missing `inline_snapshot`/`dirty_equals`).
- `pytest` + `unittest` available in Container A (`enable_sandbox_testing=True` default); `pytest-timeout==2.1.0` installed (Dockerfile line 7) — use it for hang repros. Phase 2 sets `-o timeout=0` (no timeout) — hangs there burn the whole budget.
- Scratch repros go in **`/tmp`**, never `/workspace`: `submit_patch` runs `git add -N . && git diff` and would ship your repro inside the patch (§10.3). `TEST_TMPDIR=/tmp` is preset.
- Phase 2 **resets any touched test file or runner config** (`conftest.py`, `pytest.ini`, `pyproject.toml`, `tox.ini`, `setup.cfg`, ...) to baseline before applying `task.test_patch` (§8.2 anti-tampering). Fix library code only; editing tests is wasted work at best.
- Resolution requires pytest exit 0 **and** JUnit validation: `passed > 0`, `failures == 0`, `errors == 0`, and every required node explicitly passed **without being skipped** (§8.2). See §4.6 for the skipped-sibling matcher bug this interacts with.

---

## 2. Per-family playbooks

Family stats from `taxonomy.md` §3/§6.2. Examples cite RCA files under `scratch/bcf-2026-11-11/rca/`. Trap IDs are stable labels (e.g. `TI-3`) used by the quick-reference table in §6.

---

### 2.1 type-introspection — 15 tasks (fastapi 11, rich 1, requests 3)

**Definition (taxonomy §3):** Python introspection returns an unexpected wrapper/proxy/descriptor/metadata and a naive `isinstance`/`getattr`/unwrap misses it. The cross-repo hard skill (taxonomy Insight 9): one shared playbook covers fastapi annotation/callable peeling, requests protocol detection, rich descriptor guards.

**Real examples:**

| instance_id | Mechanism (one line) | Locus | RCA |
| --- | --- | --- | --- |
| fastapi_14512 (d3) | `Annotated` metadata splatted once explicitly AND re-applied via the trailing `FieldInfo` → callable discriminator wraps the union twice, receives models instead of raw dicts | `fastapi/_compat/v2.py::ModelField.__post_init__` L86–106 | `rca/fastapi_14512.md` (high confidence) |
| fastapi_14448 (d4) | Single-layer `inspect.unwrap` + ONE partial peel misclassifies async-wrapper-around-sync, partial-of-wrapped, wrapped `__call__`; dual gen-flags take the sync path → `TypeError` | `fastapi/dependencies/models.py::Dependant._unwrapped_call` L78–85, `is_*` L87–108; `dependencies/utils.py::_solve_generator` L547–555 | `rca/fastapi_14448.md` |
| requests_7502 (d2) | `isinstance(fp, _SupportsRead)` is False for `__getattr__` proxies on 3.12+ (Protocol checks use `getattr_static`) → wrapper object uploaded as data → `TypeError` in urllib3 | `src/requests/models.py::_encode_files` L239 | `rca/requests_7502.md` (locally verified) |
| rich_3894 (d2) | `__qualname__` in `__slots__` + `lru_cache` → `getattr` returns a `member_descriptor`, not `str` → `Text.assemble` `TypeError` | `rich/_inspect.py::Inspect._get_signature` L103 | `rca/rich_3894.md` (locally verified) |

**Traps & gotchas:**

- **TI-1 — `get_origin(Annotated[T, ...])` returns `Annotated`, not `T`.** The underlying type is `.__origin__`; `get_args` returns `(T, *metadata)`. Expecting `str` and getting `Annotated` mis-generates schemas.
  Doc: https://docs.python.org/3.13/library/typing.html · `Annotated` 3.9+ · HIGH (verbatim code: `get_origin(Password)` → `typing.Annotated`; `Password.__origin__` → `str`) (notes §3.3).
- **TI-2 — `types.UnionType` vs `typing.Union` are DISTINCT on 3.10–3.13.** `get_origin(int \| str) is types.UnionType`; `get_origin(Union[int, str]) is typing.Union`. Checking only one misses PEP 604 optionals. They become aliases in 3.14, but dual-check code still works there.
  Doc: https://docs.python.org/3.13/library/types.html + https://docs.python.org/3.13/library/typing.html + https://docs.python.org/3.14/whatsnew/3.14.html · unions 3.10+, unification 3.14 · MEDIUM (paraphrase) (notes §3.4).
- **TI-3 — `get_type_hints()` strips `Annotated` metadata by default, raises `NameError` on unresolvable strings, and replaces `None` with `type(None)`.** `TYPE_CHECKING`-only imports blow up at evaluation time; fastapi `Query`/`Body` markers vanish without `include_extras=True`. `inspect.signature(eval_str=True)` un-stringizes via `eval()` but is 3.10+ (`TypeError` on 3.8/3.9).
  Doc: https://docs.python.org/3.13/library/typing.html + https://docs.python.org/3.13/library/inspect.html · `get_type_hints` all versions, `eval_str` 3.10+ · HIGH (verbatim `eval_str` sentence) + MEDIUM (None→NoneType, verbatim-from-translation) (notes §3.2).
- **TI-4 — `inspect.signature()` follows `__wrapped__` by default.** A decorated function reports the WRAPPED signature; validating call args against the wrapper's real signature gets the wrong one. `functools.update_wrapper` copies `WRAPPER_ASSIGNMENTS` (missing attributes skipped, not errors) and sets `__wrapped__`; newer Pythons add `__type_params__`.
  Doc: https://docs.python.org/3.13/library/functools.html · all versions (`__type_params__` 3.12+) · MEDIUM (paraphrase) (notes §3.5).
- **TI-5 — `inspect.unwrap` raises `ValueError` on `__wrapped__` cycles.** `stop=` can terminate early; historically cyclic chains could hang annotation evaluation (3.14 changelog fix). Any hand-rolled peel loop needs a cycle guard.
  Doc: https://docs.python.org/3.13/library/inspect.html · 3.4+ · MEDIUM (paraphrase) (notes §3.6).
- **TI-6 — `functools.partial` has no `__name__`/`__doc__`.** `func.__name__` in logging/routing/schema naming raises `AttributeError` on a partial. Use `getattr(f, "__name__", None)` or peel `.func`.
  Doc: https://docs.python.org/3.13/library/functools.html · all versions · HIGH (verbatim: "For instance, the `__name__` and `__doc__` attributes are not created automatically.") (notes §3.7).
- **TI-7 — PEP 695 `type` aliases are opaque `TypeAliasType` objects.** Schema walkers must unwrap `__value__` (lazily evaluated) on 3.12+; on ≤3.11 the syntax doesn't parse at all.
  Doc: https://docs.python.org/3.13/library/typing.html + https://docs.python.org/3.13/reference/simple_stmts.html · 3.12+ · MEDIUM (paraphrase) (notes §3.1).
- **TI-8 — `runtime_checkable` Protocol `isinstance` bypasses `__getattr__` on 3.12+.** `isinstance(NamedTemporaryFile(...), SupportsRead)` is False while `hasattr(f, "read")` is True; the proxy falls through to the wrong branch and the crash surfaces *downstream* (urllib3), not at the check.
  RCA-verified: `rca/requests_7502.md` ("verified locally", Python 3.12+, urllib3 2.8.0). **Not covered by the docs notes** — do not cite upstream docs for this without re-verification.
- **TI-9 — `getattr(obj, "__qualname__")` can return a non-`str` descriptor.** Slots + wrappers forward the descriptor itself; downstream string-only APIs raise `TypeError`. Guard with `isinstance(x, str)` and a fallback chain.
  RCA-verified: `rca/rich_3894.md`. Analyst inference for the general rule (not doc-verified).
- **TI-10 — `TypeIs`/`ReadOnly` are 3.13+; `TypeGuard` is 3.10+.** Importing them from `typing` on older targets is `ImportError`; gate on version or use `typing_extensions` (already-installed only — sandbox is offline).
  Doc: https://docs.python.org/3.13/whatsnew/3.13.html + https://docs.python.org/3.13/library/typing.html · 3.13+ · MEDIUM (paraphrase) (notes §3.8).

**Post-mortem playbook:**

1. **Print the introspection chain, not just the failure.** For any annotation/callable bug: `print(type(x), getattr(x, "__origin__", None), typing.get_origin(x), typing.get_args(x))`. For callables: `print(type(f), isinstance(f, functools.partial), getattr(f, "__wrapped__", None))`. `repr` shows wrapper structure that `str` hides.
2. **`AttributeError: __name__` → suspect `partial`** (TI-6); **`ValueError` from unwrap → suspect a cycle** (TI-5); **`NameError` from `get_type_hints` → suspect `TYPE_CHECKING`/stringified annotations** (TI-3).
3. **Follow the data, not the traceback top.** requests_7502's `TypeError: a bytes-like object is required, not '_TemporaryFileWrapper'` raises inside urllib3; the defect is the detection branch in `_encode_files`. Grep the wrapper type name back to where the object was classified.
4. **Detect proxies explicitly:** compare `inspect.getattr_static(obj, "read", None)` vs `getattr(obj, "read", None)` — divergence means a `__getattr__` proxy (TI-8).
5. **Reproduce minimally in `/tmp`** with the exact wrapper stack from the RCA (e.g. `@lru_cache class K: __slots__ = ("__qualname__",)` for rich_3894) before touching library code.
6. **Pre-existing vs regression:** run the neighboring suites named in the RCA verification plan (e.g. `test_dependency_partial.py`, `test_arbitrary_types.py`) on the BASE first; fastapi_14448's rewrite itself caused fastapi_14458 by dropping the `isclass` guard — rewrites in this family are regression-prone.

**Defensive fix patterns:**

- **Dual union check:** `get_origin(tp) is typing.Union or get_origin(tp) is types.UnionType` (guard the `types.UnionType` attribute for 3.8/3.9).
- **Recursive Annotated unwrap:** while `get_origin(tp) is Annotated`: take `get_args(tp)[0]`, collect metadata separately; apply metadata **exactly once** (fastapi_14512: rebuild the trailing FieldInfo without metadata rather than dropping it).
- **Peel ALL layers, then classify every view:** `_impartial` loop over `.func` until not a partial; `inspect.unwrap(...)` with `ValueError` catch; check async/generator flags on {impartial, unwrapped} × {obj, obj.`__call__`} and OR them ("if either is async, it must be awaited"); check async-gen BEFORE sync-gen (fastapi_14448).
- **Capability guard for protocols:** `isinstance(fp, _SupportsRead) or hasattr(fp, "read")` — keep the isinstance term for type narrowing (requests_7502).
- **Type-guarded fallback chain:** `__qualname__` if `str` → `__name__` if `str` → passed-in name; never `str(descriptor)` (rich_3894).
- **`include_extras=True`** wherever metadata matters; `getattr(exc, "__notes__", [])` style defaults for optional attributes.

**Verification probes:**

```bash
python3 -c "
from typing import Annotated, Union, get_origin, get_args
import types
A = Annotated[str, 'meta']
assert get_origin(A) is Annotated and A.__origin__ is str
assert get_args(A) == (str, 'meta')
assert get_origin(int | str) is types.UnionType
assert get_origin(Union[int, str]) is Union
print('TI-1/TI-2 OK')"
```

```bash
python3 -c "
import functools, inspect
p = functools.partial(lambda x: x, 1)
assert getattr(p, '__name__', None) is None          # TI-6
def f(): pass
f.__wrapped__ = f                                     # cycle
try:
    inspect.unwrap(f); raise SystemExit('expected ValueError')
except ValueError:
    print('TI-5/TI-6 OK')"
```

```bash
python3 -c "
import inspect
class Proxy:
    def __getattr__(self, n):
        if n == 'read': return lambda: b'x'
        raise AttributeError(n)
p = Proxy()
print('dynamic:', getattr(p, 'read', None) is not None,
      'static:', inspect.getattr_static(p, 'read', None) is not None)  # TI-8: True False"
```

---

### 2.2 boundary-edge-case — 24 tasks (fastapi 5, rich 15, requests 4)

**Definition (taxonomy §3):** an unhandled edge input or platform boundary — empty/None/trailing values, out-of-range codepoints, regex char-class gaps, escape parity, closed pipes.

**Real examples:**

| instance_id | Mechanism (one line) | Locus | RCA |
| --- | --- | --- | --- |
| rich_3944 (d2) | Out-of-range guard `codepoint > table[-1][1] → 0` zeroes nerd-font PUA glyphs (U+F024D); in-range unassigned codepoints fall through to 1 — internally inconsistent | `rich/cells.py::get_character_cell_size` L57–60 | `rca/rich_3944.md` |
| rich_3953 (d2) | Trailing ZWJ: `next(iter_characters)` on exhausted iterator → `StopIteration` escapes `cell_len`; control codes 1–31/127–159 match no range → width 1 | `rich/cells.py::_cell_len` L138–150, `get_character_cell_size` L57–75 | `rca/rich_3953.md` |
| requests_7205 (d1) | Python 3.11+ `netrc` returns `('', '', '')` for a bare `default` instead of raising; `if _netrc:` truthiness passes → empty Basic auth header sent | `src/requests/utils.py::get_netrc_auth` L232–237 | `rca/requests_7205.md` |
| rich_3063 (d2) | `escape()` doubles backslashes only before tag-like brackets; a trailing lone backslash survives and escapes the closing tag (odd/even parity via `divmod(len(escapes), 2)`) | `rich/markup.py::escape` L48–67; `RE_TAGS`/`_parse` L12–15/L85–95 | `rca/rich_3063.md` |

**Traps & gotchas:**

- **BE-1 — `len(str)` counts CODE POINTS, not grapheme clusters or terminal cells.** ZWJ emoji and combining marks overcount; `unicodedata.east_asian_width` returns UAX #11 codes (W/F = 2 cells) but there is **no stdlib grapheme-segmentation API**. Truncating/padding by `len()` misaligns CJK/emoji.
  Doc: https://docs.python.org/3.13/library/unicodedata.html · all versions · MEDIUM (paraphrase) (notes §6.1).
- **BE-2 — Width-table boundaries are contracts.** Above-table codepoints (Supplementary PUA-A nerd fonts, newly assigned chars on old tables) must use the SAME fallback as in-range unassigned codepoints; control codes need an explicit zero-width guard.
  RCA-verified: `rca/rich_3944.md`, `rca/rich_3953.md`. Analyst inference for the general rule.
- **BE-3 — `next()` on a possibly-exhausted iterator raises `StopIteration`** — and inside generators/iteration contexts it can silently terminate or corrupt the loop instead of surfacing. Trailing joiners/selectors are the canonical trigger.
  RCA-verified: `rca/rich_3953.md`. Not in the docs notes (standard iterator semantics — analyst inference, not doc-verified).
- **BE-4 — Truthiness of empty-string tuples.** `('', '', '')` is truthy; `if creds:` is not an emptiness check. Stdlib contract changes (netrc on 3.11+) expose latent truthiness guards.
  RCA-verified: `rca/requests_7205.md` (stdlib behavior change described in RCA; not in docs notes).
- **BE-5 — Escape parity is a boundary property.** Even backslash runs self-escape; odd runs escape the next tag. A producer that only escapes before brackets misses end-of-string. Naive "double everything" breaks existing even-run behavior.
  RCA-verified: `rca/rich_3063.md`.
- **BE-6 — Invalid escape sequences in string literals are `SyntaxWarning` since 3.12** (was `DeprecationWarning`), future `SyntaxError`; visible by default. Under `-W error`/`filterwarnings=error` the escalation surfaces as **`SyntaxError` at compile/import time** (locally verified on 3.12: default shows `SyntaxWarning: invalid escape sequence`, `-W error` raises `SyntaxError`). This is about the LITERAL, not the `re` module. Fix: raw strings.
  Doc: https://docs.python.org/3.12/whatsnew/3.12.html + https://docs.python.org/3.13/library/re.html · 3.12+ · MEDIUM (paraphrase/verbatim example) (notes §6.3); escalation class locally verified.
- **BE-7 — `re` pattern portability:** atomic groups `(?>...)`/possessive quantifiers are 3.11+ (`re.error` on 3.8–3.10); mid-pattern global inline flags restricted since 3.11; 3.13 tightened numeric group references/names. Char-class gaps (e.g. URL highlighters missing `@`/`~`) are boundary defects, not engine bugs.
  Doc: https://docs.python.org/3.11/whatsnew/3.11.html + https://docs.python.org/3.13/whatsnew/3.13.html + https://docs.python.org/3.13/library/re.html · 3.11+/3.13 · MEDIUM (paraphrase; §6.4 snippet ambiguous across version pages — verify before asserting the exact rule) (notes §6.2, §6.4).
- **BE-8 — str/bytes boundary:** `.content` is bytes, `.text` is str; mixing raises `TypeError`. Measure lengths AFTER encoding when the wire counts bytes (requests_6757 shows the encoding choice itself is version-dependent).
  Doc: https://docs.python.org/3.13/library/stdtypes.html · all versions · **LOW / background, not snippet-verified** (notes §6.5) — verify before quoting. Encoding-choice mechanism: RCA-verified `rca/requests_6757.md`.
- **BE-9 — Column offsets are 0-based, line numbers 1-based** in traceback positions (shared with ordering family, §2.7).
  Doc: https://docs.python.org/3.13/library/traceback.html · 3.11+ · MEDIUM (paraphrase) (notes §1.8).

**Post-mortem playbook:**

1. **Enumerate the boundary sweep before reading code:** empty string, `None`, single char, trailing special char (ZWJ/VS16/backslash), leading control char, max/out-of-table codepoint, repeated keys. Most family failures are one of these.
2. **Dump codepoints, not glyphs:** `print([hex(ord(c)) for c in s])` plus `unicodedata.east_asian_width(c)` per char; `repr(s)` shows `\u200d`/`\x1b` that the terminal eats. For width bugs compare `cell_len` against the test's expected cell count, not against `len`.
3. **`StopIteration` in a traceback → find the `next()` call** and ask "what input exhausts this iterator?" (trailing ZWJ). Reproduce with the exact 1–2 char string from the acceptance test.
4. **For stdlib-contract exposed bugs (netrc):** reproduce with a tmp file + monkeypatched env (`NETRC`), on the sandbox version — the host may behave differently (3.11+ change).
5. **Parity bugs:** print `divmod(count, 2)` for the escape run; test even AND odd runs, and end-of-string vs mid-string positions.
6. **Pre-existing vs regression:** run the full locus suite (`tests/test_cells.py`, `tests/test_markup.py`) on base; the RCA "must-nots" list which neighboring behaviors are load-bearing (e.g. `"1"+ZWJ+"2"` measures 1 by design — do not "correct" it).

**Defensive fix patterns:**

- **Encode-before-measure** when the consumer counts bytes; pick the encoding by the actual downstream contract (urllib3 1.x latin-1 vs 2.x utf-8 — see CS-1).
- **Explicit emptiness:** `if creds and any(creds):` instead of `if creds:`.
- **Index-based loops instead of `next()`** for lookahead: a trailing joiner runs the index past the end and the loop exits cleanly (rich_3953).
- **Consistent fallbacks:** out-of-range and in-range-unassigned take the same default width; explicit `return 0` for C0 (except NUL) and DEL/C1.
- **Parity guard at the producer:** append one backslash iff the result ends with an odd run (`endswith("\\") and not endswith("\\\\")`); leave the parser alone.
- **Raw strings for every regex literal** (`r"..."`).

**Verification probes:**

```bash
python3 -c "
import unicodedata
s = '\U0001F469‍\U0001F527'   # woman+ZWJ+wrench
print('codepoints:', len(s))                  # 3, not 1 grapheme (BE-1)
assert unicodedata.east_asian_width('あ') == 'W'
assert any(('', '', '')) is False             # BE-4
print('BE-1/BE-4 OK')"
```

```bash
python3 -c "
it = iter('a‍')
next(it); next(it)
try:
    next(it); raise SystemExit('expected StopIteration')
except StopIteration:
    print('BE-3 OK: trailing ZWJ exhausts the iterator')"
```

```bash
python3 -c "
import warnings
src = 's = ' + chr(34) + chr(92) + 'd' + chr(34)   # s = '\d' built without an escape here
warnings.simplefilter('error')
try:
    compile(src, '<probe>', 'exec'); print('no warning?')
except SyntaxError as e:
    print('BE-6 OK: invalid escape escalates to SyntaxError under -W error:', e)"
```

---

### 2.3 api-contract-violation — 23 tasks (fastapi 8, rich 12, requests 3)

**Definition (taxonomy §3):** behavior/output diverges from a documented or specified contract — RFC, OpenAPI/JSON-Schema spec, API docs, sentinel/identity contract, platform font contract.

**Real examples:**

| instance_id | Mechanism (one line) | Locus | RCA |
| --- | --- | --- | --- |
| requests_6629 (d2) | MRO reaches `OSError.__reduce__` before the JSON parent; pickle stores only `args` (1 string) but reconstruction needs `(msg, doc, pos)` → `TypeError` in the parent process | `src/requests/exceptions.py::JSONDecodeError` L31–42 | `rca/requests_6629.md` |
| requests_7315 (d2) | Legacy `//`→`/` collapse rewrites the signed canonical URI of S3 presigned URLs → 403; the fix DELETES the collapse that requests_6644 added | `src/requests/adapters.py::request_url` L547–549 | `rca/requests_7315.md` |
| rich_4075 (d1) | Zero-object `print` substitutes `NewLine()` unconditionally, bypassing the `end` handling path → custom `end` silently discarded | `rich/console.py::Console.print` L1689–1690; `NewLine.__rich_console__` L286–289 | `rca/rich_4075.md` |
| fastapi_14356 (d2) | Starlette `ImmutableMultiDict.items()` yields only the LAST value per repeated key → extra model params lose earlier values; cookies must keep last-value semantics | `fastapi/dependencies/utils.py::request_params_to_args` L794–796 | `rca/fastapi_14356.md` |

**Traps & gotchas:**

- **AC-1 — `except Exception` does NOT catch `BaseExceptionGroup` containing `KeyboardInterrupt`/`SystemExit`, nor those exceptions themselves.** `Exception` is the base of non-system-exiting exceptions only. Conversely `except BaseException` swallows Ctrl-C and `sys.exit()`; never suppress `GeneratorExit` in generators.
  Doc: https://docs.python.org/3.13/library/exceptions.html · all versions · HIGH (verbatim fragment: "All built-in, non-system-exiting exceptions are derived") (notes §1.7); group split MEDIUM (notes §1.5).
- **AC-2 — `TaskGroup` raises an `ExceptionGroup`, not the bare exception.** `except ValueError:` won't catch a single task's `ValueError` wrapped in a group; siblings get cancelled, so their side effects may not complete.
  Doc: https://docs.python.org/3.13/library/asyncio-task.html · 3.11+ · HIGH (verbatim: "The first time any of the tasks belonging to the group fails with an exception other than `CancelledError`, the remaining tasks in the group are cancelled.") (notes §5.1).
- **AC-3 — `except*` is not a drop-in for `except`:** `break`/`continue`/`return` are forbidden inside `except*`; `except` and `except*` cannot mix in one `try`; matching a `BaseExceptionGroup` subclass raises `TypeError`.
  Doc: https://docs.python.org/3.13/reference/compound_stmts.html + https://docs.python.org/3.13/tutorial/errors.html · 3.11+ · HIGH (verbatim: "break, continue and return cannot appear in an except* clause." / "It is not possible to mix `except` and `except*` in the same try.") + MEDIUM (TypeError rule) (notes §1.6).
- **AC-4 — `traceback.print_exc()` returns `None`.** `msg = traceback.print_exc()` captures nothing; use `format_exc()`, inside the active handler.
  Doc: https://docs.python.org/3.13/library/traceback.html · all versions · HIGH (verbatim: "This is like `print_exc(limit)` but returns a string instead of printing to a file.") (notes §2.1).
- **AC-5 — Exception message contracts are version-fragile.** "Did you mean: ..." is appended by the display hook, NOT stored in `exc.args`; suggestions differ by version (3.10 names, 3.12 stdlib imports, 3.13 kwargs). Notes added via `add_note` are not in `str(exc)` either. Assert on `exc.args`/structured attributes, never on full rendered stderr, when writing contract checks.
  Doc: https://docs.python.org/3.10/whatsnew/3.10.html + https://docs.python.org/3.13/whatsnew/3.13.html · 3.10+/3.13 · MEDIUM (paraphrase) (notes §1.10); notes-not-in-str: MEDIUM (notes §1.3).
- **AC-6 — Multiple inheritance routes dunder lookup through the MRO.** Pickle resolves `__reduce__` via MRO; an `OSError` base earlier in the chain hijacks serialization and drops constructor arguments. The contract "exceptions survive pickling" needs an explicit `__reduce__`.
  RCA-verified: `rca/requests_6629.md`. Pickle/MRO mechanics not in the docs notes — analyst inference for the general rule.
- **AC-7 — Mapping `.items()` is not a multi-value contract.** Dict-like APIs (Starlette multidicts, cookie dicts) differ in repeated-key semantics; a capability check (`hasattr(m, "getlist")`) is required before using the richer API.
  RCA-verified: `rca/fastapi_14356.md` (Starlette behavior — third-party, not stdlib docs).
- **AC-8 — Default-substitution branches must be conditioned on the default.** Substituting a renderable for "no objects" is only correct when `end` is the default; otherwise the caller's explicit contract (`end="!"`) is silently dropped.
  RCA-verified: `rca/rich_4075.md`.
- **AC-9 — The base test suite can encode the OLD contract.** requests_7315's base test and inline comment defend the collapse being deleted; `test_patch` flips the assertion. A correct fix makes a pre-patch test fail — that is expected, not a regression (taxonomy Insight 4/5).
  RCA-verified: `rca/requests_7315.md`.

**Post-mortem playbook:**

1. **Name the contract first:** RFC number, spec keyword, docstring promise, or platform behavior. Then diff actual vs contracted output — this family is "output is wrong", not "code crashes", so the traceback (if any) is often downstream.
2. **For serialization/round-trip bugs:** `print(type(exc).__mro__)`, `print(exc.args)`, `print(type(exc).__reduce__(exc))` — see which base supplies the reducer and what it emits (AC-6). Round-trip in a probe before editing.
3. **For exception-message tests:** compare `exc.args[0]` and `repr(exc)` vs `str(exc)`; inspect `__cause__`/`__context__`/`__notes__` separately (§3). Never hard-code suggestion suffixes (AC-5).
4. **For output-shape bugs:** capture the exact output (`console.capture()` / response JSON) and diff against the acceptance snapshot; check which branch produced it (the `NewLine` substitution is invisible in the output itself).
5. **For repeated-key loss:** print `list(m.items())` vs `m.getlist(k)` for the actual received object type; the divergence IS the bug.
6. **Pre-existing vs regression:** if a base test fails after your edit, check whether `test_patch` renames/flips it (requests_7315 pattern) before reverting. The test_patch is the live spec.

**Defensive fix patterns:**

- **Explicit `__reduce__` delegating to the correct parent:** `return CompatJSONDecodeError.__reduce__(self)` — keeps hierarchy and `__init__` untouched (requests_6629).
- **Passthrough at protocol boundaries:** don't rewrite signed/encoded artifacts (URLs, bodies) unless the current downstream contract demands it; delete obsolete workarounds when the supported dependency range no longer needs them (requests_7315).
- **Capability-guarded multi-value reads:** `if hasattr(m, "getlist"): vals = m.getlist(k); store vals[0] if len(vals) == 1 else vals` else `m.get(k)` (fastapi_14356).
- **Condition defaults on the default:** `if end == "\n": objects = (NewLine(),) else: objects = ("",)` (rich_4075).
- **Catch groups explicitly** where a TaskGroup boundary exists: `except* ValueError` or unwrap `eg.exceptions`; keep `KeyboardInterrupt`/`SystemExit` propagating (AC-1/AC-2).

**Verification probes:**

```bash
python3 -c "
import pickle
from json import JSONDecodeError
e = JSONDecodeError('Extra data', '<doc>', 36)
r = pickle.loads(pickle.dumps(e))
assert repr(r) == repr(e)                     # AC-6 shape: args must survive
print('MRO:', [c.__name__ for c in type(e).__mro__])"
```

```bash
python3 -c "
import traceback
try:
    1/0
except ZeroDivisionError:
    assert traceback.print_exc() is None      # AC-4
    s = traceback.format_exc()
    assert 'ZeroDivisionError' in s
print('AC-4 OK')"
```

```bash
python3 -c "
pairs = [('k', '456'), ('k', '789')]
assert dict(pairs)['k'] == '789'              # AC-7: last-value loss, by construction
print('AC-7 OK: .items()/dict() keep only the last value')"
```

---

### 2.4 state-lifecycle — 14 tasks (fastapi 7, rich 5, requests 1, httpx 1)

**Definition (taxonomy §3):** shared mutable state aliased/mutated, a cache not invalidated, or teardown ordered wrong relative to async consumption. Clusters in async/cache/teardown (taxonomy Insight 10).

**Real examples:**

| instance_id | Mechanism (one line) | Locus | RCA |
| --- | --- | --- | --- |
| fastapi_5624 (d2) | `use_security_scopes = security_scopes or []` aliases the caller's list; `.extend` mutates it → siblings share one growing scope list | `fastapi/dependencies/utils.py::get_dependant` L278–281 | `rca/fastapi_5624.md` |
| rich_2943 (d1) | `clear_meta_and_links` copies the stale `_hash` cache; `__eq__` delegates to `__hash__` → cleared style compares equal to original (only when hash was warmed) | `rich/style.py::clear_meta_and_links` L649–669; `__hash__` L432–445, `__eq__` L425 | `rca/rich_2943.md` |
| requests_7328 (d2) | `hist.append(resp)` then `resp.history = hist[1:]` puts each intermediate response inside its own history → self-referential cycles, delayed GC | `src/requests/sessions.py::resolve_redirects` L181–184 | `rca/requests_7328.md` |
| httpx_3672 (d4) | `self._parser.complete` (bare bound method, never called) leaves parser in DONE; `self._streams = list[NetworkStream]` assigns a GenericAlias, not a list; no body drain; Ctrl-C escapes `wait()` | `src/httpx/_server.py::_complete` L91–93; `src/httpx/_network.py` L163, `__exit__` L178–180 | `rca/httpx_3672.md` |

**Traps & gotchas:**

- **SL-1 — `x = y or []` aliases `y` when `y` is truthy; in-place mutation then leaks across branches.** Any `.append`/`.extend`/`+=` on a "default" container can mutate the caller's object. Children that STORE the reference propagate the leak.
  RCA-verified: `rca/fastapi_5624.md`. General aliasing rule: analyst inference (not doc-verified).
- **SL-2 — Cached hashes/derived state must be invalidated when ANY hash input changes.** If `__eq__` delegates to `__hash__`, a stale cache is an *equality* bug, not a perf artifact. Cold caches hide the bug — warm `hash(obj)` before testing.
  RCA-verified: `rca/rich_2943.md`.
- **SL-3 — `sys.exc_info()` is thread- and frame-specific and clears when the handler exits.** Storing the tuple for later use can capture a stale/cleared exception; the returned traceback keeps the whole frame stack alive (leak if cached).
  Doc: https://docs.python.org/3.13/library/sys.html · all versions · HIGH (verbatim: "returns a tuple of three values that give information about the exception that is currently being handled. The information returned is specific both to the current thread and to the current stack frame.") (notes §1.2).
- **SL-4 — Warning registry dedup makes warning state sticky.** `catch_warnings(record=True)` without `simplefilter("always")` loses repeats; a warning already emitted elsewhere is suppressed by the module's `__warningregistry__`; `catch_warnings` is not thread-safe and resets filters on exit.
  Doc: https://docs.python.org/3.13/library/warnings.html · all versions · HIGH (verbatim idiom) + MEDIUM (registry paraphrase) (notes §4.3).
- **SL-5 — `ExitStack`/`AsyncExitStack` unwind LIFO.** Registering a dependency AFTER its dependent closes it first (client closed before the response that uses it). `AsyncExitStack` is 3.7+.
  Doc: https://docs.python.org/3.13/library/contextlib.html · ExitStack 3.3+, AsyncExitStack 3.7+ · HIGH (verbatim fragment: "immediately unwinds the callback stack, invoking callbacks in the reverse order of registration") (notes §5.4).
- **SL-6 — Async generators need explicit finalization.** If the loop closes before `shutdown_asyncgens()`/`aclose()`, generator `finally` blocks may never run → resource leaks. `asyncio.run()` handles it; manual loop management often forgets. Reentering a running async generator corrupts state (`RuntimeError`); `contextlib.aclosing()` does not forward `athrow()`.
  Doc: https://docs.python.org/3.13/library/asyncio-eventloop.html + https://docs.python.org/3.13/library/asyncio-dev.html + https://docs.python.org/3.13/library/contextlib.html · 3.6+ · MEDIUM (paraphrase) (notes §5.2, §5.3).
- **SL-7 — A called-but-not-awaited coroutine is silent except for a `RuntimeWarning`.** `RuntimeWarning: coroutine '...' was never awaited` is often suppressed; under `-W error` it is a hard failure. Also: a bare bound-method reference (`self._parser.complete`) is a truthy no-op — no error at all.
  Doc: https://docs.python.org/3.13/library/asyncio-dev.html · all asyncio versions · HIGH (verbatim fragment: "coroutine 'test' was never awaited") (notes §5.5); bare-method no-op: RCA-verified `rca/httpx_3672.md`.
- **SL-8 — `list[T]` is a type object (GenericAlias), not a container.** `self._streams = list[NetworkStream]` "initializes" nothing. Nastier than a clean `AttributeError`: attribute access forwards to the origin `list`, so `.append` EXISTS as an unbound descriptor and calling it raises `TypeError: descriptor 'append' for 'list' objects doesn't apply to a 'int' object` (locally verified on 3.12 during this guide's probe QC).
  RCA-verified: `rca/httpx_3672.md`; descriptor-forwarding detail locally verified (not in the docs notes).
- **SL-9 — `sys.path` shadowing + install staleness.** The script dir precedes the stdlib; a repo `types.py`/`json.py` shadows the stdlib module. With a non-editable install, tests import the stale site-packages copy and your repo edit "does nothing". Check `module.__file__`.
  Doc: https://docs.python.org/3.13/library/sys.html + https://docs.python.org/3.13/tutorial/modules.html · all versions · HIGH (verbatim: "The directory containing the script being run is placed at the beginning of the search path, ahead of the standard library path.") (notes §7.1); editable-install specifics: **GAP** — setuptools docs out of allowed source scope (notes §7.4).
- **SL-10 — History/slice bookkeeping: assign-before-append vs append-before-slice changes self-inclusion but must preserve lengths** (the `max_redirects` check sees k-1 entries at iteration k).
  RCA-verified: `rca/requests_7328.md`.

**Post-mortem playbook:**

1. **Prove aliasing with `id()`:** print `id(parent_list)` and `id(child_list)` at creation and after mutation; equal ids across branches = SL-1. For caches, print the cached field before/after the mutating call (rich_2943: `_hash`).
2. **Warm the cache before reproducing:** `hash(style)` first, then mutate — cold-cache runs pass and mislead (SL-2).
3. **For async teardown bugs:** run with `PYTHONASYNCIODEBUG=1` and `-W error` to surface never-awaited coroutines and unclosed resources; check that every `await` consuming a resource happens BEFORE the exit stack unwinds (SL-5/SL-6/SL-7).
4. **For shutdown hangs:** `faulthandler.dump_traceback_later(10, exit=True)` in a `/tmp` repro shows where threads block (httpx_3672: `recv` + `executor.shutdown(wait=True)`).
5. **For "my fix does nothing":** `python3 -c "import requests; print(requests.__file__)"` — repo copy vs site-packages (SL-9). Phase 2 installs `/workspace` editable, Container A may differ.
6. **For cycle leaks:** `resp in resp.history` / `gc.get_referrers` probes; check `__context__` chains kept alive by stored tracebacks (SL-3).
7. **Pre-existing vs regression:** lifecycle fixes have invariant guards (redirect-limit lengths, scope ORDER parents-first, `copy()` semantics for unchanged inputs). Run the full neighboring suite, not just the new test.

**Defensive fix patterns:**

- **Per-branch fresh containers:** `use_scopes = list(parent_scopes) + list(new_scopes)` (concatenation, not `.extend` on a possibly-shared list); copy at the point where children STORE references, not only at the recursive call.
- **Invalidate derived state on input change:** `style._hash = None` in every mutator that touches hash inputs; audit sibling methods for the pattern (`update_link`, `__add__` already do it).
- **Snapshot-before-append:** `resp.history = hist[:]` then `hist.append(resp)`; preserve the length invariant.
- **Teardown-after-await:** consume/close response bodies before unwinding the stack that owns the client; register cleanup in dependency order (LIFO means register the dependency FIRST).
- **Actually call methods and build real containers:** `self._parser.reset()` with parentheses; `self._streams: list[NetworkStream] = []`.
- **Own-vs-shared audit:** for every mutable attribute ask "who else holds this reference?" — the recurring mechanism across all 14 tasks (taxonomy Insight 10).

**Verification probes:**

```bash
python3 -c "
parent = ['scope3']
child = parent or []          # SL-1: aliases parent
child.extend(['scope1'])
assert parent == ['scope3', 'scope1']         # leaked!
fixed = list(parent) + ['scope2']             # fresh list
print('SL-1 OK: aliasing reproduced; concatenation isolates')"
```

```bash
python3 -c "
from contextlib import ExitStack
order = []
with ExitStack() as s:
    s.callback(lambda: order.append('client'))   # registered first
    s.callback(lambda: order.append('response')) # registered second
assert order == ['response', 'client']           # SL-5: LIFO
print('SL-5 OK')"
```

```bash
python3 -c "
streams = list[int]          # SL-8: GenericAlias, not a list
assert not isinstance(streams, list)
try:
    streams.append(1); raise SystemExit('expected TypeError')
except TypeError:            # .append forwards to list as an unbound descriptor
    print('SL-8 OK: list[int] is a type, not a container')"
```

---

### 2.5 schema-generation-logic — 7 tasks (fastapi 7)

**Definition (taxonomy §3):** incorrect OpenAPI/Pydantic schema-construction logic — ref resolution, mode selection, security-array merging, config propagation.

**Real examples:**

| instance_id | Mechanism (one line) | Locus | RCA |
| --- | --- | --- | --- |
| fastapi_14361 (d2) | Remapper assumes every named model's schema has `$ref`; an empty Enum renders INLINE (`{"enum": [], "title": ...}`) → `KeyError: '$ref'` → `/openapi.json` 500 | `fastapi/_compat/v2.py::_remap_definitions_and_field_mappings` L305–313 (raise at L310) | `rca/fastapi_14361.md` |
| fastapi_13207 (d3) | `override_mode="validation"` forced by `separate_input_output_schemas=False` strips computed fields, which exist ONLY in the serialization core schema; cache-selection and definition-generation must agree | `fastapi/_compat/v2.py::get_schema_from_model_field` L183–185 + `get_definitions` L207–209 | `rca/fastapi_13207.md` |
| fastapi_14482 (d3) | Standalone `TypeAdapter` built without the parent model's `config` loses `arbitrary_types_allowed` → `PydanticSchemaGenerationError`; metadata splat added here later double-applies (→ fastapi_14512) | `fastapi/_compat/v2.py::ModelField.__post_init__` L85–99 + `get_model_fields` L414–418 | `rca/fastapi_14482.md` |

**Traps & gotchas:**

- **SG-1 — Schema dicts are not uniformly `$ref`-shaped.** Named types can render inline (empty enums, scalars with metadata). Key-presence guards (`"$ref" not in schema`) are required before indexing; `.get("$ref", "")` + split creates bogus empty-name mappings — guard, don't default.
  RCA-verified: `rca/fastapi_14361.md`.
- **SG-2 — Validation vs serialization modes expose different fields.** Pydantic v2 computed fields are serialization-only; forcing validation mode silently deletes them. Mode overrides must be relaxed when the model contains mode-exclusive fields, at EVERY site that selects or generates schemas (cache key and definitions must stay in sync).
  RCA-verified: `rca/fastapi_13207.md` (Pydantic behavior — third-party, not stdlib docs).
- **SG-3 — Config does not propagate through standalone adapters.** A `TypeAdapter` rebuilt from a field loses the parent model's `model_config`; propagate it explicitly, EXCEPT for nested types that own their config (BaseModel/dict/dataclass).
  RCA-verified: `rca/fastapi_14482.md`.
- **SG-4 — Annotation walking inherits every type-introspection trap:** `Annotated` metadata stripped without `include_extras=True` (TI-3), PEP 604 unions missed by single-origin checks (TI-2), `TypeAliasType` opaque without `__value__` unwrap (TI-7), and on 3.14 deferred annotations change when `__annotations__` evaluates (names that were tolerated strings can raise `NameError`).
  Doc: https://docs.python.org/3.13/library/typing.html · 3.9+/3.12+ · HIGH (Annotated code) + MEDIUM (hints/alias) (notes §3.2, §3.3, §3.1); 3.14: https://docs.python.org/3.14/library/annotationlib.html · 3.14 only · MEDIUM (paraphrase) (notes §3.10).
- **SG-5 — Metadata must be applied exactly once.** Splatting `*field_info.metadata` while ALSO passing the `FieldInfo` that carries the same metadata double-wraps discriminators/serializers (the 14482→14512 chain).
  RCA-verified: `rca/fastapi_14512.md`, `rca/fastapi_14482.md`.
- **SG-6 — Temporal coupling:** the correct fix in one task is the bug in a later task (14482's splat → 14512's dedup; 14349 guards `$ref` VALUE type while 14361 guards `$ref` KEY presence — sibling functions, distinct guards). Never assume base behavior is sacred; `test_patch` is the live spec (taxonomy Insight 4).
  RCA-verified: the cited RCAs; taxonomy §7.

**Post-mortem playbook:**

1. **Dump the intermediate schema, not just the endpoint error:** `json.dumps(schema, indent=2)` at each construction stage; for `KeyError` print `sorted(d.keys())` — the missing key tells you inline-vs-ref immediately (SG-1).
2. **For `KeyError`/500 on `/openapi.json` while endpoints work:** the defect is in schema assembly, not routing. Grep the failing key (`schema["$ref"]`) to land on the exact line.
3. **For disappearing fields:** print the core schema's `computed_fields` and the selected mode at BOTH the cache-selection and definition-generation sites; a one-site fix desynchronizes them (SG-2).
4. **For `PydanticSchemaGenerationError`:** compare the standalone adapter's config against `model.model_config`; missing config propagation is the first suspect (SG-3).
5. **Run both flag parametrizations** (`separate_input_output_schemas` True/False) and both Pydantic majors where gated (`needs_pydanticv2`, `needs_py310`).
6. **Pre-existing vs regression:** re-run the predecessor task's suite (`test_arbitrary_types.py` for 14512) — the RCA must-nots encode the regression chain explicitly.

**Defensive fix patterns:**

- **Guard key presence before access:** `if model not in model_name_map or "$ref" not in schema: continue`.
- **Mode relaxation with detection:** read `core_schema.get("schema", {}).get("computed_fields", [])` defensively; relax the override only when such fields exist; mirror the check at every site (per-field vs `any()` across fields).
- **Config propagation with ownership exceptions:** pass `config=model.model_config` per field, skipping nested BaseModel/dict/dataclass fields.
- **Single-application metadata:** rebuild the trailing FieldInfo without metadata (`Field(**attrs)` via an `asdict`-style shim for older Pydantic) and splat metadata exactly once.
- **Version-robust annotation walking:** dual union checks, `include_extras=True`, `TypeAliasType.__value__` unwrap behind `sys.version_info` gates.

**Verification probes:**

```bash
python3 -c "
from typing import Annotated, get_type_hints
def f(x: Annotated[int, 'meta']): pass
assert get_type_hints(f)['x'] is int                       # metadata stripped
assert get_type_hints(f, include_extras=True)['x'].__metadata__ == ('meta',)
print('SG-4/TI-3 OK')"
```

```bash
python3 -c "
inline = {'enum': [], 'title': 'OtherRole'}
ref = {'\$ref': '#/components/schemas/Role'}
for s in (inline, ref):
    if '\$ref' not in s:      # SG-1 guard: skip, don't default
        print('inline -> skipped'); continue
    print('ref ->', s['\$ref'].split('/')[-1])"
```

---

### 2.6 compatibility-shim — 6 tasks (fastapi 5, requests 1)

**Definition (taxonomy §3):** an upstream dependency version/API change requires a shim, vendoring, or gated behavior.

**Real examples:**

| instance_id | Mechanism (one line) | Locus | RCA |
| --- | --- | --- | --- |
| requests_6757 (d3) | `super_len` encodes str bodies as UTF-8 unconditionally; urllib3 1.x transmits latin-1 → Content-Length mismatch, framing hang. Corrective follow-up to requests_6589 | `src/requests/utils.py::super_len` L139–140; new `is_urllib3_1` in `compat.py` | `rca/requests_6757.md` |
| fastapi_14186 (d4) | Unconditional `pydantic.v1` imports at ~10 module sites; Pydantic 2.12 drops the v1 shim on 3.14 and warns → `filterwarnings=["error"]` turns it into a collection error | `fastapi/_compat/__init__.py` L47–50, `v1.py` L71–119 + ~8 consumers; fix: `may_v1.py` dummy classes | `rca/fastapi_14186.md` |
| fastapi_14077 (d1) | Starlette 0.48 renames `HTTP_422_UNPROCESSABLE_ENTITY` → `..._CONTENT`; old name resolves via warning-emitting accessor → warnings-as-errors failure; fix uses literal `422` (new name would break the 0.40 lower bound) | `fastapi/exception_handlers.py` L8/L24; `fastapi/openapi/utils.py` L38/L419 | `rca/fastapi_14077.md` |

**Traps & gotchas:**

- **CS-1 — The same operation has different contracts across dependency majors.** str-body length = latin-1 bytes on urllib3 1.x, UTF-8 bytes on 2.x. Version detection must be defensive: parse `int(version.split(".")[0])` with `TypeError/AttributeError` fallback (prefer legacy when indeterminate); never crash at import. **Gap worth knowing (locally verified during probe QC):** that fallback covers `None`/non-strings, but a non-numeric prefix (`'weird'`) raises `ValueError`, which the reference does NOT catch — add `ValueError` if you want truly never-crash parsing for arbitrary strings.
  RCA-verified: `rca/requests_6757.md`; ValueError gap locally verified on 3.12.
- **CS-2 — Module-scope imports of deprecated shims are collection-time bombs under warnings-as-errors.** Dispatch-only `isinstance` checks force the deprecated import even when always False. Defer real imports into branches; provide dummy classes for dispatch on versions where the shim is gone.
  RCA-verified: `rca/fastapi_14186.md`; warning escalation: Doc: https://docs.python.org/3.13/library/warnings.html + https://docs.pytest.org/en/stable/how-to/capture-warnings.html · all versions · HIGH (default-filter table) + MEDIUM (pytest config) (notes §4.1, §4.2).
- **CS-3 — Renamed constants: prefer the literal over the new name when the support range spans the rename.** The new name doesn't exist on the lower bound; the old name warns on the upper bound. A literal (`422`) is stable across both.
  RCA-verified: `rca/fastapi_14077.md`.
- **CS-4 — Removed stdlib modules:** 3.12 removed `imp`, `asynchat`, `asyncore`, `distutils` (+ `unittest` aliases like `assertEquals`); 3.13 removed 19 dead batteries incl. `telnetlib`, `cgi`, `cgitb`, `imghdr`, `nntplib`, `uu`, `xdrlib`. The sandbox shims `imp` (find_module only) and `telnetlib` (full vendored copy) — nothing else.
  Doc: https://docs.python.org/3.12/whatsnew/3.12.html · removed 3.12 · MEDIUM (paraphrase) (notes §7.2); https://docs.python.org/3.13/whatsnew/3.13.html · removed 3.13 · MEDIUM (paraphrase) (notes §7.3). Shim scope: `docker_Dockerfile.sandbox` + `docker_imp.py` (local evidence).
- **CS-5 — New-API version gates:** `sys.exception()`/`add_note`/`ExceptionGroup`/`except*`/`TaskGroup` are 3.11+; `TypeIs`/`ReadOnly` 3.13+; `eval_str` 3.10+; `type` statement 3.12+; `annotationlib` 3.14+. "Modernizing" `exc_info()[1]` → `sys.exception()` breaks 3.8–3.10 task variants; `sys.exc_info()` still works everywhere.
  Doc: https://docs.python.org/3.11/whatsnew/3.11.html + https://docs.python.org/3.13/library/sys.html · 3.11+ · HIGH (verbatim: "Add `sys.exception()` which returns the active exception instance (equivalent to `sys.exc_info()[1]`).") (notes §1.1); §1.3 MEDIUM, §1.5 HIGH/MEDIUM, §5.1 HIGH, §3.8 MEDIUM, §3.2 HIGH, §3.10 MEDIUM.
- **CS-6 — `typing.ByteString` is NOT removed in 3.13/3.14.** Deprecated 3.9, warns since 3.12, removal postponed to 3.17 (MEDIUM, from a translated page — confirm on the English page before asserting).
  Doc: https://docs.python.org/3.12/deprecations/index.html + https://docs.python.org/3.14/whatsnew/3.14.html · removal 3.17 · MEDIUM (verbatim-from-translation) (notes §3.9).
- **CS-7 — Regex engine features are version-gated:** atomic/possessive constructs 3.11+; a "performance fix" adding `*+` changes match semantics AND breaks 3.8–3.10.
  Doc: https://docs.python.org/3.11/whatsnew/3.11.html + https://docs.python.org/3.13/library/re.html · 3.11+ · MEDIUM (paraphrase) (notes §6.2).

**Post-mortem playbook:**

1. **`ModuleNotFoundError` at import/collection:** check the interpreter version and the 3.12/3.13 removal lists FIRST (CS-4); then `importlib.util.find_spec(name)` and `module.__file__` — a hit in site-packages may be a shim with partial API (the `imp` trap).
2. **Collection errors that mention warnings:** run `python3 -W error -c "import <package>"` to reproduce outside pytest; the escalation is the repo's `filterwarnings`, and the underlying signal is a deprecated import/accessor (CS-2). Grep ALL import sites exhaustively — fastapi_14186's risk was missing one of ~10.
3. **`AttributeError` on a "new" API in a test variant:** check the variant's target version; gate with `sys.version_info` (CS-5).
4. **Content-Length/framing mismatches:** print the declared length vs `len(body.encode(enc))` for BOTH candidate encodings; identify which dependency major is installed (`urllib3.__version__`).
5. **Pre-existing vs regression:** shim tasks must keep the OLD range byte-identical (fastapi_14186: <3.14 re-export path unchanged); run the suite under both dependency majors where the RCA says so.

**Defensive fix patterns:**

- **Defensive version flags:** `try: is_old = int(ver.split(".")[0]) == 1 except (TypeError, AttributeError): is_old = True` at module scope; branch behavior, never crash at import.
- **Dummy-class dispatch shims:** on the cutoff version define empty stand-ins so `isinstance`/`lenient_issubclass` checks are safely False; source still-needed symbols from the new module; keep stand-ins distinct types.
- **Lazy imports inside detection branches** instead of module-scope deprecated imports.
- **Literal constants across rename boundaries** (int `422`, string `"422"` where a str is contracted).
- **Version-gated new APIs with old-API fallbacks** (`sys.exc_info()[1]` works everywhere); `typing_extensions` only if already installed (offline sandbox).

**Verification probes:**

```bash
python3 -c "
import sys, importlib.util
print(sys.version_info[:2])
for m in ('imp', 'telnetlib', 'cgi', 'distutils'):
    spec = importlib.util.find_spec(m)
    print(m, '->', spec.origin if spec else 'MISSING')"
# sandbox 3.13 expectation: imp/telnetlib -> site-packages shims; cgi/distutils -> MISSING
```

```bash
python3 -c "
def parse_major(v):
    try: return int(v.split('.')[0])
    except (TypeError, AttributeError): return 1   # CS-1 reference fallback
assert parse_major('1.26.20') == 1 and parse_major('2.8.0') == 2
assert parse_major(None) == 1                     # AttributeError -> legacy
try:
    parse_major('weird')                          # ValueError NOT covered
except ValueError:
    print('CS-1 OK: add ValueError for arbitrary-string safety')"
```

```bash
python3 -W error -c "import warnings; warnings.warn('x', DeprecationWarning)" 2>&1 | head -2
# proves warnings-as-errors escalation (CS-2); exits non-zero with DeprecationWarning raised
```

---

### 2.7 ordering-off-by-one — 3 tasks (rich 3)

**Definition (taxonomy §3):** index/offset/order arithmetic error — len-1 bias, reverse-vs-forward chunk order, head/mid/foot mis-index.

**Real examples (all three):**

| instance_id | Mechanism (one line) | Locus | RCA |
| --- | --- | --- | --- |
| rich_2725 (d2) | `box_segments` built [head, foot, mid] but selector indexes [head, mid, foot] → last row gets mid glyphs, middle rows get foot glyphs; invisible with stock boxes | `rich/table.py::Table._render` L772–788, selector L869 | `rca/rich_2725.md` |
| rich_3180 (d3) | `chop_cells` packs in REVERSE order; `divide_line` accumulates offsets as if forward → with double-width chars breaks land mid-glyph and cropping deletes characters | `rich/cells.py::chop_cells` L124–144 (`reversed` at L135); `rich/_wrap.py::divide_line` L20–48 | `rca/rich_3180.md` |
| rich_3506 (d2) | Position estimate `int((cut / cell_length) * (len(text) - 1))` biased by len-1; forward-only correction can't recover an overshoot → mixed CJK/ASCII splits too wide | `rich/segment.py::_split_cells` L111–146 (estimate L121) | `rca/rich_3506.md` |

**Traps & gotchas:**

- **OO-1 — Two-sided index contracts: fix ONE side.** When a list order and an index expression disagree, correcting both double-swaps back to the bug. Decide which side is the contract (here: the selector) and reorder the data.
  RCA-verified: `rca/rich_2725.md`.
- **OO-2 — Reverse greedy packing ≠ forward greedy packing for variable-width items.** Single-width text has a symmetric chunk-length multiset, so single-width tests pass before AND after — the bug only manifests with double-width characters.
  RCA-verified: `rca/rich_3180.md`.
- **OO-3 — `len-1` factors in position estimates bias the guess; forward-only correction loops cannot recover overshoot.** Clamp negative positions; know whether your estimator lands at-or-before vs at-or-after the target.
  RCA-verified: `rca/rich_3506.md` (partial fix — residual cases handled later by rich_3521's bidirectional search; do not assume full correctness).
- **OO-4 — Traceback columns are 0-based; line numbers 1-based.** `FrameSummary.colno`/`end_colno` index from 0 (default `None`); computing caret positions or slicing source by `colno` hits off-by-one; parsers must tolerate 3.11+ `~~~^^^` anchor lines absent on 3.8–3.10.
  Doc: https://docs.python.org/3.11/whatsnew/3.11.html + https://docs.python.org/3.13/library/traceback.html · 3.11+ · HIGH (verbatim title "PEP 657: Fine-grained error locations in tracebacks") + MEDIUM (colno paraphrase) (notes §1.8).
- **OO-5 — LIFO is an ordering contract:** `ExitStack` unwinds reverse-registration (SL-5); warning filters: LATER entries take precedence; pytest `prepend` import mode puts rootdir at the FRONT of `sys.path` (ordering decides which module wins).
  Doc: https://docs.python.org/3.13/library/contextlib.html · 3.3+ · HIGH (notes §5.4); https://docs.pytest.org/en/stable/how-to/capture-warnings.html · MEDIUM (notes §4.2); https://docs.pytest.org/en/stable/explanation/pythonpath.html · MEDIUM (notes §8.8).

**Post-mortem playbook:**

1. **Print the index table:** for each row/chunk/cut print (index, expected glyph/offset, actual). The acceptance-test technique for rich_2725 — monkeypatch every box glyph to a UNIQUE letter/digit — makes ordering bugs visible in plain text; copy it into `/tmp` repros.
2. **Reproduce with MIXED-width text** (e.g. `123ありがとうございました` at width 8); all-single and all-double inputs hide OO-2/OO-3.
3. **Simulate the arithmetic offline:** compute the estimate, the scan direction, and the resulting widths for every cut position; count bad cuts (rich_3506's RCA found 34 across the corpus).
4. **For traceback-position code:** verify `lineno` vs `colno` bases explicitly; on <3.11 expect `None` columns (rich_3486's version-skipped tests).
5. **Pre-existing vs regression:** stock-box renders must stay bit-identical (rich_2725); signature changes (`chop_cells(max_size, position)` → `(text, width)`) break other callers — grep usages before changing (rich_3180).

**Defensive fix patterns:**

- **Reorder the data to match the documented selector**, leave the selector and horizontal-rule calls untouched (rich_2725).
- **Forward greedy packer** with explicit `cell_offset`/`remaining_space`; move a straddling double-width character WHOLE to the next line; no break before the first chunk when `start == 0` (rich_3180).
- **Unbiased estimate + clamp:** `int((cut / cell_length) * len(text)) - 1`, clamp to 0; preserve early returns and straddle behavior (rich_3506).
- **One source of truth for offsets:** derive every span from the same forward pass; never mix reversed accumulation with forward offsets.

**Verification probes:**

```bash
python3 -c "
text = '123ありがとうございました'
# reverse vs forward chunk-length multisets differ for wide chars (OO-2)
w = [1 if ord(c) < 0x1100 else 2 for c in text]
print('widths:', w)
assert sum(w) != len(text)   # mixed width: len() is not cell length
print('OO-2 precondition OK: use mixed-width repros')"
```

```bash
python3 -c "
import traceback
try:
    x = {'a': 1}; x['b'] + 1
except KeyError:
    te = traceback.TracebackException(*__import__('sys').exc_info())
    fs = te.stack[-1]
    print('lineno (1-based):', fs.lineno, 'colno (0-based):', fs.colno)  # OO-4"
```

---

### 2.8 infinite-loop-recursion — 3 tasks (rich 3)

**Definition (taxonomy §3):** a loop/recursion fails to advance or lacks cycle detection, causing a hang. All three public tasks are rich; all reproduce as HANGS, not exceptions (taxonomy Insight 8: subprocess timeout required).

**Real examples (all three):**

| instance_id | Mechanism (one line) | Locus | RCA |
| --- | --- | --- | --- |
| rich_3480 (d1) | Self-append: `self._spans.extend(gen over text._spans)` where `text is self` — the generator iterates the live list while extend grows it → unbounded loop + memory growth | `rich/text.py::append` L999–1002, `append_text` L1021–1024 | `rca/rich_3480.md` |
| rich_3772 (d3) | `Traceback.extract` follows `__cause__`/`__context__` in `while True` with no visited set → `raise e from e` spins forever; cyclic ExceptionGroups recurse unboundedly; `if cause:` also skips falsy exceptions | `rich/traceback.py::Traceback.extract` L410, walk L453, cause L564–572, context L574–580, group recursion L461–475 | `rca/rich_3772.md` |
| rich_4006 (d3) | `split_graphemes` has branches that never advance `index`: leading VS16 with no measured char hits `continue`; leading zero-width char fails the walrus AND `elif spans:` → spin; trailing ZWJ emits spans past `len(text)` | `rich/cells.py::split_graphemes` L182–209 (L190/L200/L202/L206) | `rca/rich_4006.md` |

**Traps & gotchas:**

- **IL-1 — Extending a list from a generator that iterates the SAME list never terminates.** `list.extend(gen)` consumes lazily; if the source aliases the destination, each yielded item lengthens the iteration. Snapshot first (`.copy()`), don't special-case `is self`.
  RCA-verified: `rca/rich_3480.md`.
- **IL-2 — Exception chains can be cyclic; walkers need an identity-based visited set.** `raise e from e` is legal; `BaseException` hashes by identity, so a `set` of exceptions detects cycles without collapsing distinct ones. Dedup by `str(exc)` or type is WRONG. The stdlib's own cycle handling (`TracebackException` internal `_seen`) is **UNVERIFIED** in the notes — prefer `TracebackException`/`format_exception` over hand-rolled walkers, but do not cite the exact mechanism.
  Doc (UNVERIFIED target): https://docs.python.org/3.13/library/traceback.html · believed 3.5+ · **LOW / UNVERIFIED** (notes §2.5). Cycle mechanism: RCA-verified `rca/rich_3772.md`.
- **IL-3 — Truthiness tests on exceptions skip falsy objects.** `if cause:` misses exceptions with falsy `__bool__`/`__len__`; use `is not None` (plus an identity guard `cause is not exc_value`).
  RCA-verified: `rca/rich_3772.md`.
- **IL-4 — Every branch of a `while index < n` loop must advance `index` (or break).** Zero-width/leading-special-character paths are the classic non-advancing branches; `continue` with unchanged index is an infinite loop. Also: `index += 2` at the last position overshoots — bound span ends by `len(text)`.
  RCA-verified: `rca/rich_4006.md`.
- **IL-5 — `RecursionError` at ~1000 frames is the catchable boundary; raising the limit risks a hard C-stack segfault.** Deep schema/JSON/tree traversal hits the default limit; 3.12+ changed C-recursion accounting so the same code can reach different depths across versions (notes context, not a verbatim doc claim).
  Doc: https://docs.python.org/3.13/library/sys.html · all versions · HIGH (verbatim fragment: "maximum recursion depth exceeded") (notes §1.11).
- **IL-6 — `__wrapped__` cycles raise `ValueError` in `inspect.unwrap`** (and historically could hang annotation evaluation) — catch it in peel loops (TI-5).
  Doc: https://docs.python.org/3.13/library/inspect.html · 3.4+ · MEDIUM (paraphrase) (notes §3.6).
- **IL-7 — Regex catastrophic backtracking:** nested quantifiers can hang matching; 3.11 atomic groups/possessive quantifiers prevent it but change semantics and are version-gated (CS-7).
  Doc: https://docs.python.org/3.11/whatsnew/3.11.html + https://docs.python.org/3.13/library/re.html · 3.11+ · MEDIUM (paraphrase) (notes §6.2).
- **IL-8 — Async-generator reentrancy:** concurrent `__anext__`/`athrow`/`aclose` on one generator yields `RuntimeError`/corrupt state — serialize access.
  Doc: https://docs.python.org/3.13/library/asyncio-dev.html + https://docs.python.org/3.13/library/contextlib.html · 3.6+ · MEDIUM (paraphrase) (notes §5.3).

**Post-mortem playbook:**

1. **Treat hangs as first-class failures.** Reproduce in `/tmp` under a hard timeout: `timeout 10 python3 /tmp/repro.py` (sandbox) or `pytest --timeout=10` (pytest-timeout 2.1.0 is installed). Phase 2 runs `-o timeout=0` — a hang there consumes the entire task budget.
2. **Get the spinning stack:** `import faulthandler; faulthandler.dump_traceback_later(5, exit=True)` at the top of the repro prints where the loop spins, then exits — no interactive debugger needed offline.
3. **Distinguish hang vs `RecursionError`:** a traceback ending in repeated frames + `RecursionError` = depth (IL-5); no output at all + growing memory = non-advancing loop or live-list extend (IL-1/IL-4).
4. **For chain walkers:** build the cyclic input explicitly (`e = ValueError(); e.__cause__ = e`) and assert termination; check BOTH vectors (self-cause AND cyclic groups) — a self-cause-only guard leaves rich_3772's second issue broken.
5. **For index loops:** enumerate the special-character inputs from the acceptance tests (leading ESC/VS16/ZWJ, trailing ZWJ, empty string) and trace `index` per iteration on paper or with a print.
6. **Pre-existing vs regression:** re-run the full locus suite (`test_traceback.py` groups/notes/chains, `test_cells.py` emoji/VS16) — over-deduplication and span-semantics changes are the regression modes.

**Defensive fix patterns:**

- **Snapshot before extend:** `text._spans.copy()` in both append paths; keep `text_length` captured before mutation (rich_3480).
- **Threaded visited set:** fresh `set` at top level, passed through group recursion; add BEFORE recursing; identity guards `cause is not exc_value` and `is not None`; follow cause/context only at top level (`if not grouped_exceptions:`) (rich_3772).
- **Advance-on-every-branch:** leading zero-width chars emit their own zero-width span; ZWJ advances 2 only when a next codepoint exists else 1; span ends never exceed `len(text)` (rich_4006).
- **Iterative traversal with explicit stack + visited set** instead of deep recursion for untrusted nesting; never raise `sys.setrecursionlimit` as a "fix".
- **Catch `ValueError` around `inspect.unwrap`**; use `stop=` when a layer boundary is known.

**Verification probes:**

```bash
# /tmp/probe_il1.py — SAFE snapshot version proves the mechanism without hanging
python3 -c "
spans = [(0, 3, 'blue')]
spans.extend((s + 3, e + 3, st) for s, e, st in spans.copy())  # IL-1 fix shape
assert spans == [(0, 3, 'blue'), (3, 6, 'blue')]
print('IL-1 OK: snapshot terminates; live-list extend would not')"
```

```bash
python3 -c "
e = ValueError('x'); e.__cause__ = e
seen = set(); cur = e; n = 0
while cur is not None and cur not in seen:   # IL-2/IL-3 fix shape
    seen.add(cur); cur = cur.__cause__; n += 1
assert n == 1
print('IL-2 OK: identity visited-set terminates on raise e from e')"
```

```bash
# hang repro template (sandbox): timeout + faulthandler
cat > /tmp/repro_hang.py <<'EOF'
import faulthandler
faulthandler.dump_traceback_later(5, exit=True)  # prints the spinning stack, then exits
from rich.cells import split_graphemes
split_graphemes(chr(27))   # leading ESC: the rich_4006 hang input
EOF
timeout 10 python3 /tmp/repro_hang.py   # exit 124 = still hanging after fix attempt
```

---

### 2.9 missing-capability — 33 tasks (fastapi 23, rich 9, requests 1)

**Definition (taxonomy §3):** a required capability/API/keyword did not exist; the task implements it (features, dx, docs, most deprecations). The largest family — these are implement-to-spec tasks, not bug hunts (taxonomy Insight 3: 38 non-bug tasks).

**Real examples:**

| instance_id | Mechanism (one line) | Locus | RCA |
| --- | --- | --- | --- |
| rich_3486 (d4, feature) | PEP 657 column anchors missing: `Frame` stores only `lineno`; add `last_instruction` from `f_lasti // 2` + `co_positions()` under a 3.11 gate; underline must layer UNDER token colors (`stylize_before`) | `rich/traceback.py::Frame` L175–181, extract L443–468; `rich/syntax.py::stylize_range` L536–551 | `rca/rich_3486.md` |
| fastapi_14583 (d2, deprecation) | No migration signal for pydantic.v1 models: add `DeprecationWarning` at route registration (params `stacklevel=5`, response models `stacklevel=4`); behavior unchanged | `fastapi/dependencies/utils.py::get_dependant` L324–330; `fastapi/routing.py::APIRoute.__init__` L636–641/L669–672 | `rca/fastapi_14583.md` |
| requests_6592 (d1, feature) | `codes.TOO_EARLY` absent: the `_codes[425]` title tuple is the single extension point; `_init()` auto-registers lower+upper names | `src/requests/status_codes.py` L82, `_init()` L109–114 | `rca/requests_6592.md` |
| rich_3930 (d5, feature) | Per-codepoint measurement tears ZWJ emoji: add grapheme model + per-Unicode-version tables; ~11.6k of +12.1k lines are GENERATED data assets that cannot be regenerated offline | `rich/cells.py` (rewrite around `split_graphemes`); new `rich/_unicode_data` package | `rca/rich_3930.md` |

**Traps & gotchas:**

- **MC-1 — The stdlib has no grapheme-cluster API.** New measurement features must approximate (ZWJ/VS16 rules + width tables) or vendor data; you cannot add a dependency (offline sandbox). Generated tables are data assets — implement the loader + algorithm, never try to regenerate wcwidth data.
  Doc: https://docs.python.org/3.13/library/unicodedata.html · all versions · MEDIUM (paraphrase) (notes §6.1); data-asset constraint: RCA-verified `rca/rich_3930.md`.
- **MC-2 — New callable-handling features inherit the partial/wrapper traps:** `partial` has no `__name__`/`__doc__`; any new naming/routing/introspection capability must use `getattr` defaults or peel `.func`.
  Doc: https://docs.python.org/3.13/library/functools.html · all versions · HIGH (verbatim) (notes §3.7).
- **MC-3 — Do not build new capabilities on removed modules** (imp/distutils 3.12; telnetlib/cgi 3.13) — the sandbox shims are partial (CS-4).
  Doc: https://docs.python.org/3.12/whatsnew/3.12.html + https://docs.python.org/3.13/whatsnew/3.13.html · MEDIUM (paraphrase) (notes §7.2, §7.3).
- **MC-4 — New-API surface is version-gated:** `add_note` 3.11+, `show_group` 3.13+ (`TypeError` on older), `TypeIs`/`ReadOnly` 3.13+. A feature using them needs gates or fallbacks for the supported range.
  Doc: https://docs.python.org/3.13/library/exceptions.html (3.11+, MEDIUM §1.3); https://docs.python.org/3.13/whatsnew/3.13.html (3.13+, MEDIUM §2.7/§3.8).
- **MC-5 — A warning added inside a library is INVISIBLE by default.** `DeprecationWarning` is ignored except when triggered directly in `__main__` (PEP 565, since 3.7). New deprecation features must be tested with `pytest.warns` / `catch_warnings(record=True)` + `simplefilter("always")`; `stacklevel` decides which file:line the warning blames (regex-tested in fastapi_14583).
  Doc: https://docs.python.org/3.13/library/warnings.html + https://docs.python.org/3.13/library/exceptions.html · 3.7+ behavior · HIGH (verbatim: "Ignored by the default warning filters, except in the `__main__` module (PEP 565).") (notes §4.1); stacklevel contract: RCA-verified `rca/fastapi_14583.md`.
- **MC-6 — Warning registry dedup bites repeated-registration tests:** without `simplefilter("always")`, the second route registration may emit nothing (module `__warningregistry__`); `catch_warnings` resets filters on exit and is not thread-safe.
  Doc: https://docs.python.org/3.13/library/warnings.html · all versions · HIGH (idiom) + MEDIUM (registry) (notes §4.3).
- **MC-7 — PEP 657 positions: `f_lasti` is a BYTE offset — divide by 2 for the instruction index; `co_positions()` entries can contain `None`.** Store positions only when all four values are non-None; guard on `sys.version_info >= (3, 11)`; tests are version-skipped so exactly one side runs.
  RCA-verified: `rca/rich_3486.md` (co_positions/f_lasti mechanics are not in the docs notes; notes §1.8 covers the column anchors themselves, HIGH title + MEDIUM colno).
- **MC-8 — anyio internals are a sourced GAP.** Only the `-p no:NAME` disable mechanism is doc-covered; do not build repros that depend on anyio fixtures — Phase 2 disables the plugin (§4.5).
  Doc (mechanism only): https://docs.pytest.org/en/stable/how-to/plugins.html · MEDIUM (notes §8.4); anyio semantics: **GAP** (notes §5.6).
- **MC-9 — Extend the single extension point, don't hand-wire around it.** requests_6592: appending to the title tuple auto-registers both cases AND the docstring; manual `setattr` outside `_init()` diverges from generated docs.
  RCA-verified: `rca/requests_6592.md`.

**Post-mortem playbook:**

1. **The acceptance tests ARE the spec.** Enumerate the contract surface they pin: exact attribute names (`last_instruction`), shapes (2-tuple of position pairs), version gates, warning categories/stacklevels, message fragments. Features fail on contract details, not algorithms.
2. **`AttributeError` on a plausibly-new API → check the version gate first** (MC-4/MC-7), then find the nearest sibling implementation and mirror its signature/conventions (e.g. how other `Frame` fields are extracted and rendered).
3. **For warning features:** reproduce with `warnings.catch_warnings(record=True)` + `simplefilter("always")`; inspect `w[0].filename`/`lineno` to validate `stacklevel` — the warning must blame the USER's code, not library internals (MC-5).
4. **For version-skipped tests:** run both sides of the gate mentally; on the 3.13 sandbox the 3.11+ side runs. Beware the scorer's skipped-sibling matcher (§4.6) — rich_3486 is one of the two public tasks that can never be marked resolved because its <3.11 sibling is skipped.
5. **For data-heavy features (rich_3930):** verify the loader's version-selection contract (`load("5.0.1") == "5.0.0"`, clamp low/high, invalid → latest) separately from the algorithm; never load whole generated tables into context (taxonomy Insight 6).
6. **Pre-existing vs regression:** features must not change existing behavior — fastapi_14583's endpoints still return 200; rich_3486's existing snapshots must stay byte-identical (hence `stylize_before`, not `stylize`).

**Defensive fix patterns:**

- **Single extension point:** append to the registry tuple/list that the initialization loop consumes; let generated artifacts (docstrings, lookups) follow automatically.
- **Version-guarded capability extraction:** `if sys.version_info >= (3, 11): idx = f_lasti // 2; pos = next(islice(co_positions(), idx, idx + 1), None)`; store only fully-non-None positions; `None` otherwise.
- **Registration-time warnings:** `warnings.warn(msg, DeprecationWarning, stacklevel=N)` at decoration/registration, with N chosen so the user's frame is blamed; keep behavior unchanged; category per the task's contract stage (plain `DeprecationWarning` before `FastAPIDeprecationWarning` exists — RCA: fastapi_14583 vs 14605).
- **Layer styles without repainting:** underline ranges via `stylize_before` so token colors survive.
- **Data assets + loader + algorithm split:** treat generated tables as inputs; implement cached lazy loading and the span algorithm; thread version selection through public functions.

**Verification probes:**

```bash
python3 -c "
import warnings
def emit():
    warnings.warn('legacy usage', DeprecationWarning, stacklevel=2)
with warnings.catch_warnings(record=True) as w:
    warnings.simplefilter('always')           # MC-6: defeat registry dedup
    emit(); emit()
assert len(w) == 2 and w[0].category is DeprecationWarning
print('MC-5/MC-6 OK; blamed file:', w[0].filename)"
```

```bash
python3 -c "
import sys
if sys.version_info >= (3, 11):
    def f(): return 1 / 0
    try:
        f()
    except ZeroDivisionError:
        tb = sys.exc_info()[2]
        fr = tb.tb_frame
        idx = fr.f_lasti // 2                  # MC-7: byte offset -> instruction index
        import itertools
        pos = next(itertools.islice(fr.f_code.co_positions(), idx, idx + 1))
        print('positions:', pos)               # all non-None for this simple case
else:
    print('pre-3.11: no co_positions (gate required)')"
```

```bash
python3 -c "
codes = {}
_CODES = {425: ('unordered_collection', 'unordered', 'too_early')}
for code, titles in _CODES.items():           # MC-9: single extension point
    for t in titles:
        codes[t] = code; codes[t.upper()] = code
assert codes['TOO_EARLY'] == codes['too_early'] == 425
print('MC-9 OK')"
```

---

### 2.10 docs-content-error — 1 task (fastapi 1)

**Definition (taxonomy §3):** incorrect constant/content in a documentation example (no library logic involved). Smallest family, but its meta-level traps (version folklore) infect every other family — see the corrections register (§5).

**Real example (the only one):**

| instance_id | Mechanism (one line) | Locus | RCA |
| --- | --- | --- | --- |
| fastapi_14492 (d1, docs) | Metadata tutorial declares `license_info={"name": "Apache 2.0", "identifier": "MIT"}` — SPDX id contradicts the name; FastAPI passes it verbatim into OpenAPI `info.license`; the tutorial test mirrored the wrong value, locking it in | `docs_src/metadata/tutorial001_1_py39.py::app` L29–32 | `rca/fastapi_14492.md` |

**Traps & gotchas:**

- **DC-1 — Tutorial tests mirror the example's content, including its errors.** The fix belongs in the example source; `test_patch` updates the expected schema. Editing the test instead is discarded by the anti-tampering reset (HARNESS_README §8.2) and fails the contract.
  RCA-verified: `rca/fastapi_14492.md`.
- **DC-2 — Exact-string contracts are case/hyphen-sensitive.** SPDX `Apache-2.0` (capital A, hyphen) is the identifier; the human-readable `name` stays `"Apache 2.0"`. OpenAPI 3.1 expects an SPDX expression in `identifier` — a valid-but-wrong id (`MIT`) passes type checks and ships contradictory metadata.
  RCA-verified: `rca/fastapi_14492.md` (OpenAPI/SPDX contract — not stdlib docs).
- **DC-3 — Version folklore is this family's recurring hazard.** The research REFUTED several widely repeated claims: "Did you mean" is 3.10 not 3.11 (notes §1.10, MEDIUM); invalid-escape `SyntaxWarning` is 3.12 not 3.13 (notes §6.3, MEDIUM); the `colorize` kwarg belongs to `pdb.Pdb` (3.14, HIGH) and is UNVERIFIED for `traceback` (notes §2.6); `typing.ByteString` removal is postponed to 3.17 (notes §3.9, MEDIUM). Full register in §5.
  Doc: https://docs.python.org/3.10/whatsnew/3.10.html · https://docs.python.org/3.12/whatsnew/3.12.html · https://docs.python.org/3.14/library/pdb.html · https://docs.python.org/3.12/deprecations/index.html (versions/confidences as listed; notes §1.10/§6.3/§2.6/§3.9).

**Post-mortem playbook:**

1. **Grep the constant, not the symptom:** `grep -rn "identifier" docs_src/` lands instantly; the statement usually names both wrong and correct values.
2. **Check the example's test mirror:** run the tutorial test; its expected dict tells you the exact contracted string. After fixing the example, the OLD test fails until `test_patch` lands — expected inversion (AC-9 pattern).
3. **Scope discipline:** touch only the file the reference contract names (`tutorial001_1_py39.py`); sibling tutorial variants may legitimately differ.
4. **For any doc claim you are about to act on:** check §5 first; if the claim is UNVERIFIED there, do not build a fix on it.

**Defensive fix patterns:**

- Single-line content correction with the EXACT contracted string; leave adjacent fields (`name`) untouched.
- Fix the example, never the test; let `test_patch` carry the expectation change.
- When documenting version-gated behavior yourself, copy the version attribution from the primary source (or mark UNVERIFIED) — do not repeat folklore.

**Verification probes:**

```bash
# in the repo (sandbox): localize and verify the tutorial contract
grep -rn "identifier" docs_src/metadata/ | head -5
python3 -m pytest tests/test_tutorial/test_metadata/test_tutorial001_1.py -v -p no:anyio
```

```bash
python3 -c "
license_info = {'name': 'Apache 2.0', 'identifier': 'Apache-2.0'}
assert license_info['identifier'] == 'Apache-2.0'   # DC-2: exact SPDX string
print('DC-2 OK')"
```

---

## 3. Exception-handling reference card (3.13 sandbox essentials)

### 3.1 Hierarchy: what `except Exception` does and does not catch

```text
BaseException
 +-- BaseExceptionGroup      (3.11+; auto-downcasts to ExceptionGroup, see 3.2)
 +-- GeneratorExit           (never catch-and-suppress in generators)
 +-- KeyboardInterrupt       (Ctrl-C; harness/CLI must let it propagate or handle explicitly)
 +-- SystemExit              (sys.exit(); swallowing it breaks test runners/CLIs)
 +-- Exception
      +-- ExceptionGroup     (3.11+; all members are Exception)
      +-- ... all built-in non-system-exiting exceptions ...
```

Doc: https://docs.python.org/3.13/library/exceptions.html · all versions (groups 3.11+) · HIGH (verbatim fragment: "All built-in, non-system-exiting exceptions are derived") (notes §1.7).
Harness note: httpx_3672's `wait()` loop had to catch `KeyboardInterrupt` explicitly for clean Ctrl-C shutdown (RCA: `rca/httpx_3672.md`) — the exception is not an `Exception`, so a broad `except Exception` server loop never sees it.

### 3.2 ExceptionGroup / except* (PEP 654, 3.11+)

- Groups wrap "multiple unrelated exceptions" (HIGH verbatim fragment, notes §1.5). `BaseExceptionGroup(...)` **automatically returns an `ExceptionGroup`** when all members are non-Base exceptions — `isinstance` checks must tolerate the downcast (MEDIUM paraphrase, notes §1.5).
- `except Exception` catches an `ExceptionGroup` but NOT a `BaseExceptionGroup` containing e.g. `KeyboardInterrupt` (notes §1.5).
- `except*` matches/splits groups; unmatched portions recombine preserving nesting and are **RE-RAISED** after the matching clauses run — a single `except* ValueError` does NOT swallow a mixed group (locally verified during probe QC); each clause handles at most one split portion (MEDIUM, notes §1.5/§1.6).
- **Restrictions (HIGH verbatim):** "break, continue and return cannot appear in an except* clause." / "It is not possible to mix `except` and `except*` in the same try." Matching a `BaseExceptionGroup` subclass raises `TypeError` (MEDIUM).
- Doc: https://docs.python.org/3.13/library/exceptions.html + https://docs.python.org/3.13/reference/compound_stmts.html + https://docs.python.org/3.13/tutorial/errors.html · 3.11+ (notes §1.5, §1.6).
- On 3.8–3.10 targets, `ExceptionGroup`/`except*` are absent at SyntaxError level — never introduce them into range-spanning code without gates (CS-5).

```bash
python3 -c "
eg = BaseExceptionGroup('g', [ValueError('v'), KeyError('k')])
assert type(eg) is ExceptionGroup            # auto-downcast (3.2)
try:
    raise eg
except* ValueError as h:
    assert len(h.exceptions) == 1
except* KeyError as h:            # unmatched portion would otherwise re-raise
    assert len(h.exceptions) == 1
print('3.2 OK')"
```

### 3.3 Chaining: `__cause__`, `__context__`, `__suppress_context__`

- `raise X from Y` sets `X.__cause__ = Y` and `X.__suppress_context__ = True`; raising inside a handler without `from` sets `__context__` implicitly. Display rule: `__cause__` shown if present; `__context__` shown only if `__cause__ is None` AND `__suppress_context__` is false (MEDIUM paraphrase, notes §1.4).
- **Post-mortem consequence:** `raise NewError(...) from None` HIDES the root cause from the rendered traceback, but `__context__` still holds it — inspect the attributes, not just the printed chain. `traceback.format_exception(..., chain=False)` drops BOTH cause and context. Manually assigning `__cause__` also flips `__suppress_context__`.
- Cyclic chains are legal (`raise e from e`) and break naive walkers (IL-2; rich_3772).
- Doc: https://docs.python.org/3.13/library/exceptions.html + https://docs.python.org/3.13/reference/simple_stmts.html + https://docs.python.org/3.13/library/traceback.html · all versions · MEDIUM (paraphrase) (notes §1.4).

### 3.4 Notes: `add_note()` / `__notes__` (PEP 678, 3.11+)

- `add_note(str)` appends; `__notes__` is created LAZILY on first call — reading it before any call raises `AttributeError`; use `getattr(exc, "__notes__", [])`. Notes render in the traceback after the exception string but are NOT part of `str(exc)` or `exc.args` (MEDIUM paraphrase, notes §1.3).
- Absent on 3.8–3.10 → `AttributeError` (CS-5). rich_3676 adds notes rendering to rich.traceback (taxonomy: traceback-rendering feature).
- Doc: https://docs.python.org/3.13/library/exceptions.html (canonical newer: https://docs.python.org/3/builtins/exceptions.html) · 3.11+ · MEDIUM (paraphrase) (notes §1.3).

### 3.5 Active-exception access: `sys.exception()` vs `sys.exc_info()`

- `sys.exception()` (3.11+) returns the active exception instance — "equivalent to `sys.exc_info()[1]`" (HIGH verbatim, notes §1.1). Absent on 3.8–3.10: modernizing to it breaks old targets; `sys.exc_info()` works everywhere.
- `sys.exc_info()` returns `(type, value, traceback)`, specific to the current thread AND stack frame; `(None, None, None)` outside a handler; the traceback keeps frames alive (HIGH verbatim, notes §1.2). Capture what you need INSIDE the handler; do not cache the tuple.
- Doc: https://docs.python.org/3.11/whatsnew/3.11.html + https://docs.python.org/3.13/library/sys.html · 3.11+ / all versions (notes §1.1, §1.2).

### 3.6 `traceback` module API — what to reach for

| API | Use | Gotcha | Doc / version / confidence |
| --- | --- | --- | --- |
| `format_exc(limit=None, chain=True)` | Capture traceback as string inside `except` | `print_exc()` prints and returns `None` (AC-4) | https://docs.python.org/3.13/library/traceback.html · all · HIGH (verbatim) (notes §2.1) |
| `StackSummary.extract(frame_gen, capture_locals=True)` | Frame list + `repr()` of locals | Keeps objects alive; on 3.12+ broken local `repr()` is SWALLOWED (gh-87822) — locals may silently vanish vs 3.8–3.11 where it raised | https://docs.python.org/3.13/library/traceback.html + https://docs.python.org/3.12/whatsnew/changelog.html · 3.5+, change 3.12 · MEDIUM (paraphrase) (notes §2.2) |
| `walk_tb(tb)` | Iterate `(frame, lineno)` pairs | Raw frames, not `FrameSummary`; holds references (leak); `lineno` 1-based, `colno` 0-based | https://docs.python.org/3.13/library/traceback.html · 3.5+ · MEDIUM (paraphrase) (notes §2.3) |
| `TracebackException(exc, compact=..., lookup_lines=..., capture_locals=...)` | Capture now, render later | `compact=True` leaves `.stack` incomplete; `lookup_lines=False` leaves `.line` empty | https://docs.python.org/3.13/library/traceback.html · 3.5+ · MEDIUM (paraphrase) (notes §2.4) |
| `TracebackException(..., show_group=True)` | Recursively format nested group members | 3.13+ only; `TypeError` (unexpected kwarg) on 3.8–3.12 | https://docs.python.org/3.13/whatsnew/3.13.html + https://docs.python.org/3.13/library/traceback.html · 3.13+ · MEDIUM (paraphrase) (notes §2.7) |
| `format_exception(..., chain=False)` | Render without cause/context | Drops BOTH chains — root cause invisible (3.3) | https://docs.python.org/3.13/library/traceback.html · all · MEDIUM (notes §1.4) |
| `colorize=` kwarg on traceback APIs | — | **UNVERIFIED — do not use or cite.** Confirmed `colorize` is `pdb.Pdb` (3.14): "Added in version 3.14: Added the colorize argument." (HIGH, pdb only) | https://docs.python.org/3.14/library/pdb.html · pdb 3.14 · HIGH for pdb / UNVERIFIED for traceback (notes §2.6) |
| Internal `_seen` cycle guard | — | **UNVERIFIED** mechanism; prefer `TracebackException` over hand-rolled walkers, but don't cite `_seen` as documented | target https://docs.python.org/3.13/library/traceback.html · LOW / UNVERIFIED (notes §2.5) |

### 3.7 Warnings: filters, visibility, capture

Default filter table (HIGH verbatim, notes §4.1): `default::DeprecationWarning:__main__`, `ignore::DeprecationWarning`, `ignore::PendingDeprecationWarning`, `ignore::ImportWarning`, `ignore::ResourceWarning`. Consequences:

- Library deprecations are SILENT by default; only `__main__`-triggered ones show (PEP 565, 3.7+). Run repros with `-W error` / `PYTHONWARNINGS=error` to surface them (notes §4.1, HIGH).
- pytest `filterwarnings = ['error', ...]` turns ANY warning into a test failure — including third-party `ResourceWarning`s; later entries take precedence (order matters). A warning-as-error is not necessarily a logic bug (notes §4.2, MEDIUM; https://docs.pytest.org/en/stable/how-to/capture-warnings.html).
- Canonical capture idiom (HIGH verbatim code, notes §4.3):

```python
with warnings.catch_warnings(record=True) as w:
    warnings.simplefilter("always")   # without this, registry dedup eats repeats
    ...
```

- `warn_explicit` without a `registry` treats every warning as first occurrence; with the module's `__warningregistry__`, repeats are deduped (MEDIUM, notes §4.3). `catch_warnings` is not thread-safe and resets filters on exit.
- Doc: https://docs.python.org/3.13/library/warnings.html · all versions (notes §4.1–§4.3).

### 3.8 Reading 3.11+ tracebacks: PEP 657 anchors and 3.13 color

- 3.11+ tracebacks underline the exact faulting sub-expression (`~~~^^^` anchor lines). `FrameSummary.colno`/`end_colno` are **0-based** (default `None`); `lineno` is 1-based. Parsers written for 3.8–3.10 output must tolerate the anchor lines (notes §1.8, HIGH title + MEDIUM colno; https://docs.python.org/3.11/whatsnew/3.11.html + https://docs.python.org/3.13/library/traceback.html).
- 3.13 colorizes tracebacks on TTY by default; precedence `PYTHON_COLORS` > `NO_COLOR` > `FORCE_COLOR`. ANSI codes leak into captured strings/JUnit XML — set `NO_COLOR=1` or `PYTHON_COLORS=0` for exact-match work. Point-release edge cases: empty-string `FORCE_COLOR`/`NO_COLOR`; `-E` ignores only `PYTHON_COLORS` (notes §1.9, MEDIUM; https://docs.python.org/3.13/whatsnew/3.13.html + https://docs.python.org/3.13/using/cmdline.html).
- "Did you mean" suffixes are added by the DISPLAY hook, not stored in `exc.args`; present since 3.10 (names), 3.12 (stdlib imports), 3.13 (kwargs). Never hard-code them (notes §1.10, MEDIUM).

### 3.9 System-exiting exceptions in the harness

- `KeyboardInterrupt`/`SystemExit`/`GeneratorExit` bypass `except Exception` (3.1). In test harnesses: a `SystemExit` raised inside a test is reported as an error unless caught by `pytest.raises(SystemExit)`; a `KeyboardInterrupt` aborts the run. Server/CLI loops that must shut down cleanly catch `KeyboardInterrupt` explicitly (RCA: httpx_3672).
- The harness kills commands at **300 s** (HARNESS_README §5.2) — a hang fails the command, not the session; Phase 2 pytest runs with `-o timeout=0`, so hangs there burn the task budget. Use `pytest --timeout=N` (pytest-timeout 2.1.0 preinstalled) or `timeout N python3 /tmp/repro.py` for your own hang repros (IL playbook).
- `TaskGroup` external cancellation + group error calls the parent task's `cancel()` (MEDIUM, notes §5.1) — cancellation can surface as `CancelledError` outside the group; do not swallow it.

---

## 4. pytest / harness gotchas

### 4.1 The exact Phase 2 verification command (HARNESS_README §8.2)

```bash
cd /workspace && PYTHONSAFEPATH=1 PYTHONNOUSERSITE=1 python3 -s -m pytest <pytest_targets> \
  --junitxml=/tmp/_swegemma_junit_<id>.xml \
  -p no:anyio -o timeout=0 \
  -o python_classes="Test* *Test" -q
```

What each piece means for you:

- `PYTHONSAFEPATH=1` + `-s` + `PYTHONNOUSERSITE=1`: no cwd/script-dir/user-site on `sys.path` — your local `pytest` invocation may import DIFFERENT modules than verification (SL-9). `/workspace` is installed editable in Container B.
- `-p no:anyio`: the anyio plugin is disabled (see 4.5).
- `-o timeout=0`: pytest-timeout is installed but DISABLED in verification — hangs are fatal to the budget.
- `-o python_classes="Test* *Test"`: class collection is broader than pytest's default `Test*` — classes named `*Test` also collect.
- Targets come from `test_patch` files; the harness overwrites `pytest.ini`/`conftest.py` with its own (see 4.4).
- **Resolution criterion:** exit code 0 AND JUnit validation: `passed_tests > 0`, `failures == 0`, `errors == 0`, and every required node (FAIL_TO_PASS / PASS_TO_PASS / extracted test functions) explicitly passed **without being skipped** (HARNESS_README §8.2).

### 4.2 Assert rewriting

pytest rewrites test modules on import via an import hook writing new `.pyc` files (HIGH verbatim: "pytest rewrites test modules on import by using an import hook to write new pyc files. Most of the time this works transparently."). Only test modules (and modules registered via `pytest.register_assert_rewrite()` BEFORE import) are rewritten (MEDIUM). Traps: asserts in non-test helpers get no rich introspection; modules imported before the hook skip rewriting (warning); stale `.pyc` can serve un-rewritten asserts; side-effecting asserts are dangerous. Disable with `--assert=plain` when diagnosing rewriting itself.
Doc: https://docs.pytest.org/en/stable/how-to/assert.html + https://docs.pytest.org/en/stable/how-to/writing_plugins.html · pytest all · HIGH + MEDIUM (notes §8.1).

### 4.3 Collection rules

Default discovery: `test_*.py` / `*_test.py` files; `test`-prefixed functions/classes (plus the harness's `*Test` classes override). `python_files` overrides patterns; `testpaths` restricts search when no args given (MEDIUM). Traps: `check_foo.py` / `foo_tests.py` (plural) are NOT collected — "all tests pass" can mean "no tests ran". The harness passes every `.py` in `test_patch` as a target; non-test data/helper files break collection (competitor audit: 65 blocked fixes — intel/live-harness-fixes.md, 757893). Verify collection with `--collect-only -q` before trusting a green run.
Doc: https://docs.pytest.org/en/stable/explanation/goodpractices.html + https://docs.pytest.org/en/stable/reference/reference.html · pytest all · MEDIUM (notes §8.2).

### 4.4 conftest scope and the harness-written config

`conftest.py` is a local per-directory plugin; fixtures are visible throughout that directory's scope; moving a test file changes which conftests apply (MEDIUM; `fixture 'x' not found` is the symptom). The harness WRITES `/workspace/pytest.ini` and `/workspace/conftest.py` and commits them to baseline; Phase 2 resets any agent modification to them (and to all test files / `pyproject.toml` / `tox.ini` / `setup.cfg` / ...) before applying `test_patch` (HARNESS_README §8.2 anti-tampering, §10.2). Overwriting the repo's pytest config drops `asyncio_mode = auto` and plugin registrations (competitor audit: 101 blocked fixes — 757893). **Never edit runner configs or tests; fix library code.**
Doc: https://docs.pytest.org/en/stable/how-to/writing_plugins.html + https://docs.pytest.org/en/stable/reference/fixtures.html · pytest all · MEDIUM (notes §8.3).

### 4.5 `-p no:anyio` and async tests

`-p no:<name>` disables a plugin EARLY at startup (before plugin load/import hooks); essential plugins cannot be disabled (MEDIUM). With anyio disabled, tests using `@pytest.mark.anyio` lose their async runner — they are collected but not properly run (analyst inference; anyio internals are a sourced GAP, notes §5.6). The competitor audit attributes 79 blocked fixes to this flag (54 starlette + 25 uvicorn; test clients need anyio fixtures — 757893, competitor-reported). For YOUR repros: avoid anyio-fixture dependence; use `asyncio.run()` inline or the repo's own asyncio-mode tests.
Doc (mechanism only): https://docs.pytest.org/en/stable/how-to/plugins.html + https://docs.pytest.org/en/stable/how-to/usage.html · pytest all · MEDIUM (notes §8.4); anyio semantics: GAP (notes §5.6).

### 4.6 skip / xfail — and the skipped-sibling matcher bug

- `@pytest.mark.skip(reason=...)` skips; `xfail(strict=True)` turns an XPASS into a FAILURE — fixing a bug under a strict xfail requires removing the marker; non-strict xfail hides a now-passing test (MEDIUM). Newer pytest requires `reason` as keyword for `pytest.skip()`/`xfail()`.
  Doc: https://docs.pytest.org/en/stable/how-to/skipping.html + https://docs.pytest.org/en/stable/reference/reference.html · pytest all · MEDIUM (notes §8.5).
- **Scorer bug (competitor-reported, medium-high confidence, NO staff verification — intel thread 757893, `intel/live-harness-fixes.md` + `intel/live-solvability-data.md` §8c):** in `_validate_junit_xml`, any SKIPPED case whose name starts with `{req_base}_` fails the requirement — e.g. required `test_x` passes but platform-skipped `test_x_windows` (or the <3.11 version-skipped sibling) rejects the task. **rich_3486 and fastapi_14186 pass every test with their gold patch but can never be marked resolved.** Audit scale: 277/1,143 correct fixes (24%) blocked by five conventions; this one accounts for 24 + those two tasks.
- **Agent consequence:** do not burn budget trying to un-skip platform/version-gated siblings (you cannot edit tests anyway); recognize version-skipped pairs (rich_3486's `test_traceback_finely_grained` / `..._missing`) as a scorer ceiling, not a fix failure. For local A/B scoring, exclude these two tasks from the denominator (denominator hygiene).

### 4.7 JUnit XML validation

`pytest --junit-xml=path` writes the report; `junit_logging` controls captured-output inclusion (`log`, `system-out`, `system-err`, `out-err`); since pytest 4.0 the `time` attribute includes setup/teardown (MEDIUM). Traps: ANSI color codes (3.13 TTY color, §3.8) and captured warnings leak into XML and break downstream parsers/exact-match assertions — set `NO_COLOR=1`. The competitor audit also reports a **10 MiB output cap** truncating the report when read back through the sandbox's capped output (8 blocked fixes, python-multipart — 757893, competitor-reported). Keep test output small; the harness's own validation reads the file directly.
Doc: https://docs.pytest.org/en/stable/how-to/output.html · pytest all (time semantics 4.0+) · MEDIUM (notes §8.6).

### 4.8 pytest 8 breaking changes

pytest 8 removed nose integration (nose-style `setup`/`teardown` methods no longer collected), removed the `Instance` collector (`Class -> Instance -> Function` became `Class -> Function`), and deprecated `fspath` (py.path) in favor of `path` (pathlib) (MEDIUM). Plugins/hooks referencing `Instance` or `node.fspath` break; pinning pytest<8 locally vs 8 in the sandbox changes collection. Check the installed pytest version before debugging collection differences.
Doc: https://docs.pytest.org/en/stable/deprecations.html + https://docs.pytest.org/en/stable/changelog.html · pytest 8.0 · MEDIUM (notes §8.7).

### 4.9 Import modes

Default `--import-mode=prepend` inserts the test's rootdir at the FRONT of `sys.path` and requires unique test-module basenames (without `__init__.py`); two `test_utils.py` in different dirs collide ("import file mismatch"). `importlib` mode imports without modifying `sys.path` (allows duplicate basenames; recommended for new projects; historically broke pickle/dataclasses needing `sys.modules`, #7856 fixed). `prepend`'s path mutation can shadow the installed package under test with the repo copy (ties to SL-9/CS-4).
Doc: https://docs.pytest.org/en/stable/explanation/pythonpath.html + https://docs.pytest.org/en/stable/explanation/goodpractices.html · importlib mode via #7245 · MEDIUM (notes §8.8).

### 4.10 pytest-timeout

The sandbox installs `pytest-timeout==2.1.0` (Dockerfile line 7). Use `python3 -m pytest --timeout=10 <target>` for hang-family repros (rich_3480/3772/4006) — a timeout failure prints the stack of the spinning frame, which IS the diagnosis. Phase 2 runs `-o timeout=0`, so this protection exists only in YOUR runs. For non-pytest repros use `timeout 10 python3 /tmp/repro.py` plus `faulthandler.dump_traceback_later` (§2.8 playbook).

### 4.11 Patch hygiene (HARNESS_README §8.1, §10)

- `submit_patch()` runs `git add -N . && git diff --binary _swegemma_baseline` — EVERY untracked file in `/workspace` ships in the patch. Put repros in `/tmp` (`TEST_TMPDIR=/tmp` preset) or delete them before submitting.
- Patch application in Container B is 4-pass resilient (`git apply` variants → symlink-normalized → `-p0` → GNU `patch`); if all fail, the task fails outright — keep diffs clean and context-accurate.
- Test/config modifications are reset before `test_patch` (4.4); a patch that only touches tests resolves nothing.
- `submit_patch()` is free (no tool-call cost) and terminates the session immediately — verify first, clean scratch, submit LAST. `get_status()` is also free.
- Unsubmitted patches are still recovered and scored at session end (§8.1) — but do not rely on it.

---

## 5. Corrections register — claims the research REFUTED or could not verify

Act on this table before repeating any "common knowledge" version claim. Confidences are inherited from `scratch/bcf-hardening-2026-11-11/research/python313-docs.md`; nothing here was upgraded.

| # | Common claim | Verdict | Correct statement | Evidence / confidence |
| --- | --- | --- | --- | --- |
| 1 | "Did you mean" suggestions arrived in 3.11 | REFUTED | Introduced in **3.10** (bpo-38530); 3.12 adds stdlib-import suggestions; 3.13 adds kwarg suggestions. Suffix is display-hook-only, not in `exc.args` | notes §1.10 · https://docs.python.org/3.10/whatsnew/3.10.html · MEDIUM (paraphrase) |
| 2 | Invalid-escape `SyntaxWarning` is new in 3.13 | REFUTED | Landed in **3.12** (was `DeprecationWarning`); future `SyntaxError`; about the string literal, not `re` | notes §6.3 · https://docs.python.org/3.12/whatsnew/3.12.html · MEDIUM |
| 3 | `traceback.format_exception(..., colorize=True)` is a 3.13 API | UNVERIFIED — do not use | The confirmed `colorize` argument belongs to **`pdb.Pdb` (3.14)**: "Added in version 3.14: Added the colorize argument." Interpreter-level traceback color is 3.13 via env vars; the confirmed 3.13 traceback addition is `show_group` | notes §2.6/§2.7 · https://docs.python.org/3.14/library/pdb.html · HIGH for pdb; UNVERIFIED for traceback |
| 4 | `typing.ByteString` was removed in 3.14 | REFUTED | Deprecated 3.9, warns since 3.12, removal **postponed to 3.17**; still exists in 3.13/3.14 | notes §3.9 · https://docs.python.org/3.12/deprecations/index.html + https://docs.python.org/3.14/whatsnew/3.14.html · MEDIUM (verbatim-from-translation, zh-tw page — confirm on English page) |
| 5 | `TracebackException` documents a `_seen` cycle guard | UNVERIFIED | Only changelogs surfaced, not the library page. Prefer `TracebackException`/`format_exception` over hand-rolled walkers, but do not cite the mechanism | notes §2.5 · LOW / UNVERIFIED |
| 6 | Exact stdtypes wording for str/bytes | LOW | str = code points, bytes = ints 0–255, mixing raises `TypeError` — background knowledge, not snippet-confirmed this session | notes §6.5 · https://docs.python.org/3.13/library/stdtypes.html · LOW |
| 7 | anyio / pytest-asyncio mode semantics | GAP | Outside the allowed primary-source set; only the `-p no:NAME` mechanism is doc-sourced. Do not assert anyio internals | notes §5.6 · mechanism: https://docs.pytest.org/en/stable/how-to/plugins.html |
| 8 | Editable-install (`pip install -e`) mechanics | GAP | setuptools/pypa docs out of scope; the sourced fact is `sys.path` ordering — verify `module.__file__` instead of asserting install internals | notes §7.4 · https://docs.python.org/3.13/library/sys.html |
| 9 | Exact 3.13 `re` group-reference rule | MEDIUM, ambiguous | 3.13 tightened numeric group references/names; snippet ambiguous across version pages — verify before asserting the exact rule | notes §6.4 · https://docs.python.org/3.13/whatsnew/3.13.html · MEDIUM |
| 10 | "`sys.exception()` is a safe modernization of `exc_info()[1]`" | REFUTED for range-spanning code | 3.11+ only; `AttributeError` on 3.8–3.10 task variants. `sys.exc_info()` works everywhere | notes §1.1 · https://docs.python.org/3.11/whatsnew/3.11.html · HIGH |
| 11 | "`imp` is available in the 3.13 sandbox" | MISLEADING | Only a 26-line `find_module` shim for flasgger is installed; other `imp` APIs raise `AttributeError`. `telnetlib` is a full vendored copy; nothing else is shimmed | `docker_Dockerfile.sandbox` L10–11 + `docker_imp.py` (local evidence) |
| 12 | "Quotes were read off full doc pages" | REFUTED | WebFetch failed all 7 attempts ("Model not exist"); ALL evidence is WebSearch-snippet-level. Re-verify HIGH-value quotes with a working fetch before external publication | notes, method section + closing line |
| 13 | "`types.UnionType` and `typing.Union` are the same" | TRUE ONLY FROM 3.14 | Distinct on 3.10–3.13 (dual-check required); aliases in 3.14; dual-check code still works there | notes §3.4 · https://docs.python.org/3.14/whatsnew/3.14.html · MEDIUM |
| 14 | "`BaseExceptionGroup(...)` always returns a `BaseExceptionGroup`" | REFUTED | Auto-returns `ExceptionGroup` when all members are non-Base exceptions | notes §1.5 · https://docs.python.org/3.13/library/exceptions.html · MEDIUM |
| 15 | "3.12 C-recursion accounting is unchanged" | CONTEXT, not verbatim | Notes state 3.12+ changed C-recursion accounting so equal code can reach different depths; the verbatim-confirmed part is only the `RecursionError` message fragment | notes §1.11 · https://docs.python.org/3.13/library/sys.html · HIGH for fragment; accounting claim is notes context |

**Scorer-related claims (not Python docs):** the skipped-sibling matcher bug, `-p no:anyio` blockage, pytest.ini overwrite, non-collectable targets, and the 10 MiB JUnit cap are **competitor-reported** (thread 757893, FreshSWE-Py audit; medium-high confidence; partial independent corroboration for rich_3486; NO staff verification). Treat as working hypotheses for local-eval hygiene, not as official harness documentation.

---

## 6. Quick-reference table

Trap IDs refer to §2; probes are the fenced snippets in each family section. "First move" assumes you have the failing test output or hang symptom in hand.

| Family (n) | Top 3 traps | Post-mortem first move | Fix pattern | Probe |
| --- | --- | --- | --- | --- |
| type-introspection (15) | TI-1 `get_origin(Annotated)` returns `Annotated`; TI-2 UnionType vs Union dual-check; TI-6 partial has no `__name__` | Print `type/get_origin/get_args/__wrapped__` chain; follow downstream `TypeError` back to the classification branch | Recursive unwrap + dual union check + peel-all-partials + `getattr` defaults / `isinstance or hasattr` | `get_origin`/`get_args` asserts; unwrap-cycle `ValueError`; `getattr_static` vs `getattr` |
| boundary-edge-case (24) | BE-1 `len` = codepoints not cells; BE-3 trailing-ZWJ `StopIteration`; BE-4 truthy empty tuples | Boundary sweep (empty/trailing/control/out-of-range); dump `hex(ord(c))` + `repr(s)` | Encode-before-measure; `any()` emptiness; index loops not `next()`; parity guards; raw strings | ZWJ `len` vs width; exhausted-iterator `StopIteration`; invalid-escape escalation under `-W error` |
| api-contract-violation (23) | AC-1 `except Exception` misses Base groups/Ctrl-C; AC-6 MRO hijacks `__reduce__`; AC-9 base tests encode the OLD contract | Name the contract (RFC/spec/docstring); diff actual vs contracted output; print `__mro__`/`args` for round-trips | Explicit `__reduce__`; boundary passthrough; capability-guarded `getlist`; condition defaults on the default | pickle round-trip; `print_exc() is None`; dict last-value loss |
| state-lifecycle (14) | SL-1 `x = y or []` aliasing; SL-2 stale hash cache = equality bug; SL-5 ExitStack LIFO / teardown-before-consume | `id()` before/after mutation; warm `hash()` first; `PYTHONASYNCIODEBUG=1 -W error`; check `module.__file__` | Per-branch fresh lists; invalidate `_hash`; snapshot-before-append; teardown-after-await; real containers + called methods | aliasing repro; ExitStack order; `list[int]` not a list |
| schema-generation-logic (7) | SG-1 inline schemas have no `$ref`; SG-2 validation mode strips computed fields; SG-5 metadata applied twice | `json.dumps` intermediate schemas; print `sorted(keys)` on `KeyError`; check BOTH mode-selection sites | Key-presence guards; config propagation with ownership exceptions; single-application metadata; sync cache+generation | `include_extras` demo; `$ref` guard loop |
| compatibility-shim (6) | CS-4 removed modules 3.12/3.13 (+partial shims); CS-5 new-API version gates; CS-2 deprecated imports under warnings-as-errors | `find_spec` + `__file__` audit; `python3 -W error -c "import pkg"`; grep ALL import sites | Defensive version flags; dummy-class dispatch; lazy imports; literal constants across renames | removal-list probe; version-parse fallback; `-W error` escalation |
| ordering-off-by-one (3) | OO-1 two-sided index contract (fix ONE side); OO-2 reverse vs forward packing; OO-4 colno 0-based vs lineno 1-based | Unique-glyph monkeypatch; MIXED-width repro; print index/offset table | Reorder data to match selector; forward packer with explicit offsets; unbiased estimate + clamp | mixed-width precondition; `FrameSummary.colno` dump |
| infinite-loop-recursion (3) | IL-1 live-list extend never ends; IL-2 cyclic chains need identity visited-set; IL-4 every branch must advance index | `timeout 10` + `faulthandler.dump_traceback_later(5, exit=True)` in `/tmp` repro; distinguish hang vs `RecursionError` | `.copy()` snapshot; threaded visited set + `is not None`; advance-on-every-branch; never raise the recursion limit | snapshot-extend; self-cause walker; hang template |
| missing-capability (33) | MC-5 library warnings invisible by default; MC-7 `f_lasti` is bytes (//2), positions may be None; MC-1 no stdlib grapheme API | Read acceptance tests as the contract (names/shapes/gates/stacklevels); mirror nearest sibling | Single extension point; version-gated extraction; registration-time warnings with tested stacklevel; data-asset split | `catch_warnings(record=True)`; `co_positions` probe; registry-loop demo |
| docs-content-error (1) | DC-1 tests mirror the wrong content; DC-2 exact SPDX strings; DC-3 version folklore (§5) | Grep the constant under `docs_src/`; check §5 before acting on any version claim | One-line content fix in the example, never the test; exact contracted string | tutorial pytest run; SPDX assert |

---

## Cross-references

- Version-skew headline and sandbox shims: §1; harness execution rules: §1.5.
- Exception machinery deep-dive: §3; pytest/scorer conventions: §4; folklore corrections: §5.
- Companion deliverables (same directory): `02-time-bottlenecks-and-tuning.md`, `03-local-env-parity-plan.md`, `04-local-scoring-and-feedback-guide.md`, `05-robustness-audit-vs-field-issues.md`, `00-index.md`.
- Primary evidence: `scratch/bcf-hardening-2026-11-11/research/python313-docs.md` (all doc citations), `scratch/bcf-2026-11-11/taxonomy.md` (stats/assignments), `scratch/bcf-2026-11-11/rca/` (32 RCA files read for this guide), `input/kagglecomp/kagglecomp_data_package/HARNESS_README.md` (§5.2/§8/§10), `scratch/bcf-hardening-2026-11-11/docker/` (image + shims), `scratch/bcf-2026-11-11/intel/live-harness-fixes.md` (757893 scorer audit).

*End of guide. All doc claims carry URL + version + confidence from the research notes; UNVERIFIED/GAP items are flagged inline and in §5. Fix patterns are mechanism-level by design — the hidden set is private repos, so public expected strings are not the contract (taxonomy Insight 5).*