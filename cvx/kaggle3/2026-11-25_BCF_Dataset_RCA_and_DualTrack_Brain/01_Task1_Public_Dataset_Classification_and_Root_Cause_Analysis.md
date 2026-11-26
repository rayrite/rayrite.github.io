# Kaggle Google Gemma 4 Developer Agent Competition — Task 1: Complete Public Dataset Taxonomy & 129-Problem Root Cause Analysis

> **Competition**: [Google Gemma 4 Good — Developer Agent Challenge](https://www.kaggle.com/competitions/gemma-4-developer-agent/data)  
> **Dataset Audited**: `input/kagglecomp/kagglecomp_data_package/tasks.jsonl` (**129 / 129 Public Tasks**, 100% Ground-Truth Verified)  
> **Submission System**: **Batonic Coding Framework (`BCF`)** — Dual-Track Brain (`Gemma 4 31B` Main Track & `Gemma 4 E4B` Bonus Track)  
> **Date Prepared**: `2026-11-25`

---

## Executive Summary

This document delivers an exhaustive, ground-truth empirical classification and three-level **Root Cause Analysis (RCA)** for every single one of the **129 software engineering problems** in the official Kaggle **Google Gemma 4 Developer Agent** public dataset (`tasks.jsonl`). Unlike surface-level summaries that rely on issue titles alone, every entry in this report was derived by inspecting the exact repository `base_commit`, problem statement, production unified diff (`patch`), and hidden grading diff (`test_patch`) across all 129 benchmark instances.

> [!IMPORTANT]
> **Critical Generalization Boundary (Why Structural Archetypes Beat Repo Memorization):** Per the official competition data documentation (`Kaggle-00-Complete.md`) and host forum disclosures, the ~120 hidden evaluation tasks (~58 on the Public Leaderboard and ~60 on the Private Leaderboard) are drawn from **held-out private/unseen Python repositories** rather than the four public training repositories (`fastapi`, `rich`, `requests`, `httpx`). Consequently, hardcoding repository names or `instance_id` rules yields zero leaderboard gain. Instead, our taxonomy maps all 129 public tasks into **7 Primary Categories**, **18 Sub-Categories**, **8 Harness/Verification Trap Archetypes (`TRAP-1`–`TRAP-8`)**, and **16 Reusable BCF Defect-Resolution Cards (`DC-01`–`DC-16`)** that transfer directly to unseen Python codebases.

## 1. Empirical Census & Structural Anatomy of the Public Dataset

### 1.1 Repository & Temporal Distribution (Contamination-Resistant 2025–2026 Skew)

All 129 public instances are real-world GitHub pull requests spanning February 2020 through June 2026. Crucially, **98 of the 129 tasks (`75.97%`) originate from 2025 and 2026**, mirroring the contamination-free post-cutoff construction of the hidden competition test split.

| Repository | Tasks | Share (%) | Single-File | Multi-File | Async-Touching | Year Span |
| :--- | ---: | ---: | ---: | ---: | ---: | :--- |
| `fastapi/fastapi` | 67 | 51.94% | 43 | 24 | 20 | `2025-09-16` to `2026-06-20` |
| `Textualize/rich` | 48 | 37.21% | 37 | 11 | 0 | `2023-07-29` to `2026-04-12` |
| `psf/requests` | 13 | 10.08% | 11 | 2 | 0 | `2023-12-16` to `2026-06-09` |
| `encode/httpx` | 1 | 0.78% | 0 | 1 | 1 | `2025-09-19` to `2025-09-19` |
| **Total** | **129** | **100.00%** | **91 (70.54%)** | **38 (29.46%)** | **21 (16.28%)** | **`2023-07-29` to `2026-06-20`** |

### 1.2 Chronological Cohort Breakdown

| Year | Task Count | Share (%) | Primary Repositories Active in Cohort | Pretraining Contamination Risk |
| :--- | ---: | ---: | :--- | :--- |
| `2023` | 10 | 7.75% | `rich` (9), `requests` (1) | Moderate (older PRs) |
| `2024` | 21 | 16.28% | `rich` (17), `requests` (4) | Low (recent PRs) |
| `2025` | 48 | 37.21% | `fastapi` (41), `rich` (6), `httpx` (1) | Near-Zero (post-cutoff PRs) |
| `2026` | 50 | 38.76% | `fastapi` (26), `rich` (16), `requests` (8) | Near-Zero (post-cutoff PRs) |

### 1.3 Patch Complexity Tiers & Multi-File Distribution

A central finding of our audit is that **most tasks require surgical, localized edits**, while a significant tail (`29.46%`) requires synchronized multi-file edits (across sibling modules, `docs_src/` tutorials, or sync/async twin trees):

| Complexity Tier | Definition (Changed Lines `+A + -R`) | Tasks | Share (%) | Median Files | Strategic Implication for BCF Brain |
| :--- | :--- | ---: | ---: | ---: | :--- |
| `T1-Micro (1-5L)` | 1 to 5 total lines added + removed | 43 | 33.33% | 1 | High risk of `TRAP-6` (existing tests stay green on wrong guard); precision beats broad refactoring. |
| `T2-Surgical (6-25L)` | 6 to 25 total lines added + removed | 42 | 32.56% | 1 | Core leaderboard battleground; ideal for single-hunk AST-verified surgical patching. |
| `T3-Moderate (26-80L)` | 26 to 80 total lines added + removed | 24 | 18.60% | 2 | Often spans 2–4 files or adds a helper function + caller wiring; requires explicit `fix_order`. |
| `T4-Arch (>80L)` | Over 80 total lines added + removed | 20 | 15.50% | 4 | Includes codegen tables (`rich_3930`), v1 removal (`fastapi_14609`), and new CLI scripts (`fastapi_15661`). |

### 1.4 Key Structural & Prompt Signals Measured Across All 129 Tasks

| Structural Signal | Exact Count | Share (%) | Ground-Truth Finding & Operational Consequence |
| :--- | ---: | ---: | :--- |
| Single-file gold patches (`file_count == 1`) | 91 | 70.54% | Over 70% of problems resolve inside a single file once localized accurately. |
| Multi-file gold patches (`file_count >= 2`) | 38 | 29.46% | Ranges from 2 files (19 tasks) up to 20 (`fastapi_14609`) and 26 (`rich_3930`). Stopping after file #1 loses ~30% of ceiling! |
| Creates brand-new non-test file | 1 | 0.78% | Only `fastapi_15661` (`scripts/prepare_release.py`); 128/129 tasks modify existing tracked files. |
| Touches `async def` / `await` (`TRAP-4`) | 21 | 16.28% | Harness `graphs/*.json` contains **zero** `async def` nodes (Thread `#758854`); AST indexing must include `ast.AsyncFunctionDef`. |
| Synchronizes `docs_src/` tutorial files | 15 | 11.63% | FastAPI's `test_tutorial` executes `docs_src/` examples directly inside `test_patch`! |
| `test_patch` deletes/edits existing test lines (`TRAP-1`) | 46 | 35.66% | Over a third of tasks alter existing visible tests during grading; naive agents panic and self-revert when old assertions turn red. |
| Issues containing `hints_text` | 0 | 0.00% | `{hints}` is empty across 100% of public tasks. |
| Issues containing a Python `Traceback (most recent call last):` | 0 | 0.00% | **Zero** issues provide stack traces; localization must resolve prose concepts and symbol anchors directly. |
| `test_patch` uses `inline_snapshot` / `dirty_equals` / `httpbin` | 38 | 29.46% | 30 FastAPI tasks + 8 Requests tasks trigger `TRAP-8` in unconfigured local subprocess sandboxes or offline runs. |

---

## 2. Hierarchical Problem Taxonomy (7 Categories, 18 Sub-Categories)

Every problem in the 129-task corpus is classified into a mutually exclusive, collectively exhaustive (**MECE**) hierarchy of **7 Primary Categories (`CAT-1`–`CAT-7`)** and **18 Sub-Categories (`SUB-1A`–`SUB-7B`)** based on the underlying computer-science and software-engineering mechanism of its root cause.

```mermaid
flowchart LR
    Root["129 Public Tasks (tasks.jsonl)"] --> C1["CAT-1: Type Introspection & Signature Unwrapping (23)"]
    Root --> C2["CAT-2: Serialization, Schemas & Pydantic Lifecycle (21)"]
    Root --> C3["CAT-3: State Isolation, Caching & Async Scopes (19)"]
    Root --> C4["CAT-4: HTTP Protocol, Security & Router Architecture (22)"]
    Root --> C5["CAT-5: Unicode Cell Widths & Text Wrapping (10)"]
    Root --> C6["CAT-6: Escape Decoding, Box Layout & Console I/O (30)"]
    Root --> C7["CAT-7: Release CLI & Executable Docs (4)"]
    C1 --> S1A["SUB-1A: Annotated / Union / PEP 695 (9)"]
    C1 --> S1B["SUB-1B: ForwardRefs / @wraps / TYPE_CHECKING (7)"]
    C1 --> S1C["SUB-1C: Descriptors / NamedTuple / MRO (7)"]
    C2 --> S2A["SUB-2A: Aliases / MultiDict / Discriminators (7)"]
    C2 --> S2B["SUB-2B: OpenAPI 3.1 / $ref / ConfigDict (8)"]
    C2 --> S2C["SUB-2C: Rust TypeAdapter & v1 Migration (6)"]
    C3 --> S3A["SUB-3A: Mutable Aliasing & Cycle Guards (7)"]
    C3 --> S3B["SUB-3B: Scope Cache Keys & Lazy Imports (7)"]
    C3 --> S3C["SUB-3C: ExitStack Scopes & Lifespan Order (5)"]
    C4 --> S4A["SUB-4A: Auth 401/403 & CSRF Guards (5)"]
    C4 --> S4B["SUB-4B: URI / Proxy / Byte-Len / SSE Frame (9)"]
    C4 --> S4C["SUB-4C: Router Contexts, SSE/SPA & Twin Trees (8)"]
    C5 --> S5A["SUB-5A: Grapheme Scanners, UCD & PUA Widths (5)"]
    C5 --> S5B["SUB-5B: CJK Wrapping, Cell Cuts & Tab Spans (5)"]
    C6 --> S6A["SUB-6A: ANSI / Control / Markup / URL Regex (6)"]
    C6 --> S6B["SUB-6B: Markdown, Box Geometry & Tracebacks (12)"]
    C6 --> S6C["SUB-6C: Console / Live / Pipe / HTML / TTY (12)"]
    C7 --> S7A["SUB-7A: Release CLI Synthesis (1)"]
    C7 --> S7B["SUB-7B: Executable docs_src Tutorials (3)"]
```

### 2.1 Category & Sub-Category Distribution Matrix

| Cat ID | Category Name | Sub ID | Sub-Category Name | Tasks | Share (%) | Repo Breakdown (`fa`/`ri`/`re`/`ht`) |
| :--- | :--- | :--- | :--- | ---: | ---: | :--- |
| **`CAT-1`** (23) | Type Introspection, Generics & Runtime Signature Unwrapping | `SUB-1A` | Annotated, Union/UnionType (`\|`), PEP 695 TypeAliasType & ForwardRef('None') Unpacking | 9 | 6.98% | `9/0/0/0` |
| `CAT-1` | ↳ | `SUB-1B` | Deferred String Annotations (`__future__`), `TYPE_CHECKING`, `@wraps` & Callable Unwrapping | 7 | 5.43% | `7/0/0/0` |
| `CAT-1` | ↳ | `SUB-1C` | Runtime Inspection Edge Cases, Metaclass Descriptors, `NamedTuple` & Exception MRO | 7 | 5.43% | `0/3/4/0` |
| **`CAT-2`** (21) | Data Serialization, Validation Aliases, OpenAPI Schemas & Pydantic Lifecycle | `SUB-2A` | Pydantic v2 Field/Form Aliases, MultiDict Extraction & Discriminator Validation | 7 | 5.43% | `7/0/0/0` |
| `CAT-2` | ↳ | `SUB-2B` | OpenAPI 3.1 JSON Schema Generation, `$ref` Guards, Computed Fields & `ConfigDict` | 8 | 6.20% | `8/0/0/0` |
| `CAT-2` | ↳ | `SUB-2C` | Rust `TypeAdapter` Serialization Fast-Path, Deprecation Warnings & Pydantic v1 Migration | 6 | 4.65% | `6/0/0/0` |
| **`CAT-3`** (19) | Mutable State Isolation, Dependency Caching & Async Lifecycle Scoping | `SUB-3A` | Shared Mutable State Aliasing, Self-Referential Mutation & Cycle Guards | 7 | 5.43% | `4/2/1/0` |
| `CAT-3` | ↳ | `SUB-3B` | Depends() Hashability, OAuth2 Scope Cache Keys, Memoized Hashes & Lazy Imports | 7 | 5.43% | `4/3/0/0` |
| `CAT-3` | ↳ | `SUB-3C` | AsyncExitStack Function/Request Scopes, Lifespan Contexts & `super().__init__` Order | 5 | 3.88% | `5/0/0/0` |
| **`CAT-4`** (22) | HTTP Protocol Semantics, Security Boundaries & Router/Subsystem Architecture | `SUB-4A` | Authentication Status (`401` vs `403`), Bearer Header Stripping, Netrc & CSRF Guards | 5 | 3.88% | `4/0/1/0` |
| `CAT-4` | ↳ | `SUB-4B` | URI Path/Proxy Normalization, RFC Media-Type Parsing, Wire Byte-Length & SSE Framing | 9 | 6.98% | `2/0/7/0` |
| `CAT-4` | ↳ | `SUB-4C` | Non-Cloning Router Contexts, Native SSE/SPA Subsystems & Twin-Tree Protocol Refactors | 8 | 6.20% | `7/0/0/1` |
| **`CAT-5`** (10) | Unicode Cell Widths, Grapheme Scanners & Proportional Text Wrapping | `SUB-5A` | ZWJ/Variation-Selector Grapheme Scanners, UCD Tables, PUA Widths & Fast-Path Regexes | 5 | 3.88% | `0/5/0/0` |
| `CAT-5` | ↳ | `SUB-5B` | CJK Double-Width Line Wrapping, Bidirectional Cell Splits, SGR Newlines & Tab Spans | 5 | 3.88% | `0/5/0/0` |
| **`CAT-6`** (30) | Terminal Escape Decoding, Box/Markdown Layout & Console I/O Lifecycles | `SUB-6A` | ANSI Escape Decoding, Control-Code Sanitization, Markup Escaping & URL Highlighters | 6 | 4.65% | `0/6/0/0` |
| `CAT-6` | ↳ | `SUB-6B` | Markdown Elements, Table/Panel/Syntax Box-Model Geometry & PEP 657/678 Tracebacks | 12 | 9.30% | `0/12/0/0` |
| `CAT-6` | ↳ | `SUB-6C` | Console/Live/Progress/Prompt I/O Proxies, BrokenPipe, HTML Export & CI TTY Flags | 12 | 9.30% | `0/12/0/0` |
| **`CAT-7`** (4) | Release Automation Scripts & Executable Documentation (`docs_src/`) Integrity | `SUB-7A` | Standalone Release Automation CLI Tooling (`scripts/prepare_release.py`) | 1 | 0.78% | `1/0/0/0` |
| `CAT-7` | ↳ | `SUB-7B` | Executable Documentation (`docs_src/`) Metadata, Context-Manager & Error Hygiene | 3 | 2.33% | `3/0/0/0` |
| **Total** | **All 7 Categories** | **18 Subs** | **Complete MECE Public Dataset Coverage** | **129** | **100.00%** | **`67/48/13/1`** |

---

## 3. Orthogonal Harness & Verification Trap Taxonomy (`TRAP-1`–`TRAP-8`)

Beyond pure code logic, agent trajectories fail when repository conventions or test-suite mechanics deceive naive edit-and-test loops. Across the 129 public tasks, we identified and measured **8 distinct trap archetypes** that the BCF Brain explicitly neutralizes:

| Trap ID | Trap Archetype | Tasks Flagged | Share (%) | Failure Mechanism & Why Naive Agents Lose Points |
| :--- | :--- | ---: | ---: | :--- |
| `TRAP-1` | **Visible vs. Graded Test Suite Divergence** | 46 | 35.66% | Existing visible tests assert obsolete behavior or get edited in `test_patch` (e.g., `requests_7315` `//v:h`, `requests_7309` `no_equals`, `fastapi_13786` `403->401`, `httpx_3672` `complete->reset`). Naive agents see red visible tests and self-revert a winning patch! |
| `TRAP-2` | **Multi-File / Twin-Tree / `docs_src` Synchronization** | 41 | 31.78% | Fix must propagate across `FastAPI -> APIRouter -> APIRoute`, sync/async twin trees (`ahttpx` + `httpx`), or `docs_src/` tutorial files imported by `test_tutorial`. |
| `TRAP-3` | **Code-Generator / Table-Driven Source Provenance** | 2 | 1.55% | Target files are overwritten or produced by generator scripts (`scripts/unasync` in `httpx_3672`, `_unicode_data` UCD tables in `rich_3930`). Hand-editing generated output without updating the generator/source fails. |
| `TRAP-4` | **Pre-Computed AST Graph Blindness on `async def`** | 21 | 16.28% | The harness's pre-built `graphs/*.json` indexes `0` `async def` functions (`#758854`). Agents relying on `get_code_neighbors` miss async endpoints, teardowns, and twin modules. |
| `TRAP-5` | **Terse / Prose-Only / Misnamed-Symbol Prompts** | 41 | 31.78% | Zero tracebacks across all 129 tasks; concise 1-sentence prompts (<220 chars) or prompts naming a non-existent symbol (`KeyboardException` instead of `KeyboardInterrupt` in `httpx_3672`). |
| `TRAP-6` | **Silent-Green Micro-Guard Invariants** | 33 | 25.58% | 1–5 line guard fixes where the pre-existing visible test suite already passes 100% and stays green even if the new guard is placed on the wrong branch (65.7% of agent failures per `#760014`!). |
| `TRAP-7` | **Cross-Version Dependency / Compatibility Shims** | 5 | 3.88% | Requires dual-version awareness (`urllib3` 1.x Latin-1 vs 2.x UTF-8 in `requests_6757`, Starlette 0.48 `422` constant deprecation in `fastapi_14077`, Pydantic v1 vs v2 `ModelField`). |
| `TRAP-8` | **Hermetic Sandbox / Offline / JUnit Skip-Gate Hazards** | 39 | 30.23% | Tests using `inline_snapshot`, `dirty_equals`, `httpbin`, or mutually exclusive `@pytest.mark.skipif` (`rich_3486`, `fastapi_14186`) fail or skip in unconfigured sandboxes, tricking agents into abandoning valid code. |

---

## 4. Master 129-Task Classification & Metrics Matrix

The master table below indexes all **129 public dataset tasks** in exact `tasks.jsonl` order (`#1`–`#129`), linking each instance to its ground-truth `base_commit`, date, Category, Sub-Category, file count, line delta, complexity tier, active traps, and BCF Pattern Card.

| # | Instance ID | Repo | Commit | Date | Cat | Sub | Files | +A / -R | Tier | Active Traps | BCF Pattern Card |
| ---: | :--- | :--- | :--- | :--- | :--- | :--- | ---: | :--- | :--- | :--- | :--- |
| 1 | `fastapi_15661` | `fastapi` | `ee22a4b8ca` | `2026-05-31` | `CAT-7` | `SUB-7A` | 1 | `+216/-0` | `T4-Arch` | `STD` | DC-14 (Standalone Typer CLI Script Synthesis) |
| 2 | `fastapi_15588` | `fastapi` | `cb83b83dcf` | `2026-05-23` | `CAT-4` | `SUB-4B` | 1 | `+18/-5` | `T2-Surgical` | `STD` | DC-04 (Wire Frame Line-Break Injection Guard) |
| 3 | `fastapi_15589` | `fastapi` | `22b02e26f9` | `2026-05-23` | `CAT-2` | `SUB-2A` | 1 | `+4/-0` | `T1-Micro` | `TRAP-6` | DC-03 (Wire Alias vs Python Field Name Tracking) |
| 4 | `fastapi_15030` | `fastapi` | `48d58ae3b6` | `2026-03-01` | `CAT-4` | `SUB-4C` | 9 | `+525/-35` | `T4-Arch` | `TRAP-2`, `TRAP-4`, `TRAP-5`, `TRAP-8` | DC-15 (Full Subsystem + OpenAPI + docs_src Sync) |
| 5 | `fastapi_14962` | `fastapi` | `1e78a36b73` | `2026-02-22` | `CAT-2` | `SUB-2C` | 3 | `+49/-6` | `T3-Moderate` | `TRAP-1`, `TRAP-2`, `TRAP-4`, `TRAP-5`, `TRAP-8` | DC-15 (Rust Fast-Path + Tutorial Sync) |
| 6 | `fastapi_15280` | `fastapi` | `6ee87478d8` | `2026-04-01` | `CAT-4` | `SUB-4C` | 2 | `+71/-1` | `T3-Moderate` | `TRAP-2`, `TRAP-4`, `TRAP-5` | DC-08 (Exact Exception Message & Tutorial Sync) |
| 7 | `fastapi_14964` | `fastapi` | `bc06e4296d` | `2026-02-22` | `CAT-2` | `SUB-2C` | 1 | `+44/-8` | `T3-Moderate` | `TRAP-1`, `TRAP-8` | DC-11 (Non-Destructive `@deprecated` Decorator) |
| 8 | `fastapi_15023` | `fastapi` | `c0836dc1b7` | `2026-02-27` | `CAT-7` | `SUB-7B` | 1 | `+18/-8` | `T3-Moderate` | `TRAP-2`, `TRAP-5` | DC-15 (Executable Tutorial `docs_src/` Audit) |
| 9 | `fastapi_14986` | `fastapi` | `2f9c914d44` | `2026-02-24` | `CAT-3` | `SUB-3A` | 2 | `+25/-9` | `T3-Moderate` | `TRAP-2` | DC-09 (Immutable Per-Request Copy + HTML JSON Escaping) |
| 10 | `fastapi_14978` | `fastapi` | `94a1ee749e` | `2026-02-23` | `CAT-4` | `SUB-4A` | 3 | `+81/-1` | `T4-Arch` | `TRAP-1`, `TRAP-2`, `TRAP-4`, `TRAP-5` | DC-15 (Cross-Layer Security Flag + Tutorial Sync) |
| 11 | `requests_7505` | `requests` | `6f205ff422` | `2026-06-09` | `CAT-1` | `SUB-1C` | 2 | `+9/-7` | `T2-Surgical` | `TRAP-2`, `TRAP-8` | DC-12 (Dynamic Proxy hasattr Duck-Typing) |
| 12 | `requests_7502` | `requests` | `661970d171` | `2026-06-08` | `CAT-1` | `SUB-1C` | 1 | `+3/-1` | `T1-Micro` | `TRAP-5`, `TRAP-6`, `TRAP-8` | DC-12 (Dynamic Proxy hasattr Duck-Typing) |
| 13 | `requests_7433` | `requests` | `0b401c76b6` | `2026-05-12` | `CAT-1` | `SUB-1C` | 1 | `+3/-3` | `T2-Surgical` | `TRAP-8` | DC-12 (Dynamic Proxy hasattr Duck-Typing) |
| 14 | `requests_7427` | `requests` | `b684dcb9bb` | `2026-05-11` | `CAT-4` | `SUB-4B` | 1 | `+4/-2` | `T2-Surgical` | `TRAP-8` | DC-04 (Domain Boundary Suffix Matching) |
| 15 | `requests_7315` | `requests` | `6360477c52` | `2026-05-10` | `CAT-4` | `SUB-4B` | 1 | `+0/-2` | `T1-Micro` | `TRAP-1` | DC-11 (Spec-Reversal Trap-1 Awareness) |
| 16 | `requests_7328` | `requests` | `cbce031327` | `2026-04-05` | `CAT-3` | `SUB-3A` | 1 | `+1/-2` | `T1-Micro` | `TRAP-6`, `TRAP-8` | DC-09 (Pre-Append Slice Snapshot) |
| 17 | `requests_7309` | `requests` | `7407309c8a` | `2026-03-30` | `CAT-4` | `SUB-4B` | 1 | `+6/-9` | `T2-Surgical` | `TRAP-1` | DC-04 (RFC 9110 Header Parameter Parsing) |
| 18 | `requests_7205` | `requests` | `1b40fdd004` | `2026-02-13` | `CAT-4` | `SUB-4A` | 1 | `+1/-1` | `T1-Micro` | `TRAP-6`, `TRAP-8` | DC-04 (Python 3.11+ Stdlib Return Tuple Guard) |
| 19 | `rich_4070` | `rich` | `fc41075a32` | `2026-04-11` | `CAT-3` | `SUB-3B` | 9 | `+71/-57` | `T4-Arch` | `TRAP-1`, `TRAP-2` | DC-06 (Lazy Function-Scoped Import Deferral + Trap-1 Monkeypatch Awareness) |
| 20 | `rich_4077` | `rich` | `58ac15120f` | `2026-04-12` | `CAT-6` | `SUB-6C` | 1 | `+3/-0` | `T1-Micro` | `TRAP-5`, `TRAP-6` | DC-12 (Transparent IO Wrapper Method Forwarding) |
| 21 | `rich_4079` | `rich` | `19c67b9a34` | `2026-04-12` | `CAT-6` | `SUB-6B` | 1 | `+4/-3` | `T2-Surgical` | `TRAP-5` | DC-04 (Pre-Stylized Text Span Preservation) |
| 22 | `rich_4076` | `rich` | `9cb198944f` | `2026-04-12` | `CAT-6` | `SUB-6A` | 1 | `+3/-3` | `T2-Surgical` | `TRAP-1`, `TRAP-5` | DC-04 (Trailing-Newline Preserving Split) |
| 23 | `rich_4075` | `rich` | `1fc7cb210a` | `2026-04-11` | `CAT-6` | `SUB-6C` | 1 | `+12/-3` | `T2-Surgical` | `TRAP-5` | DC-04 (Default vs Custom Keyword Argument Branching) |
| 24 | `rich_4006` | `rich` | `2770102908` | `2026-02-19` | `CAT-5` | `SUB-5A` | 1 | `+33/-12` | `T3-Moderate` | `TRAP-5` | DC-07 (Monotonic Scanner Loop Progress Invariant) |
| 25 | `fastapi_14258` | `fastapi` | `e94028ab60` | `2026-02-10` | `CAT-3` | `SUB-3A` | 1 | `+4/-0` | `T1-Micro` | `TRAP-6` | DC-08 (Self-Inclusion Identity Assertion) |
| 26 | `fastapi_14851` | `fastapi` | `8e50c55fd9` | `2026-02-06` | `CAT-3` | `SUB-3C` | 1 | `+153/-4` | `T4-Arch` | `TRAP-4` | DC-10 (Lifespan Context Manager & Event Hook Composition) |
| 27 | `fastapi_14873` | `fastapi` | `cd31576d57` | `2026-02-09` | `CAT-3` | `SUB-3C` | 1 | `+11/-10` | `T2-Surgical` | `STD` | DC-10 (Subclass `super().__init__()` Attribute Overwrite Guard) |
| 28 | `fastapi_13920` | `fastapi` | `0dd42b746e` | `2026-02-05` | `CAT-1` | `SUB-1A` | 1 | `+4/-0` | `T1-Micro` | `TRAP-6` | DC-01 (Recursive Annotated & Union Unpacking) |
| 29 | `fastapi_14794` | `fastapi` | `464c359bb0` | `2026-02-05` | `CAT-1` | `SUB-1A` | 1 | `+3/-2` | `T1-Micro` | `TRAP-6` | DC-01 (Recursive Annotated & Union Unpacking) |
| 30 | `fastapi_14786` | `fastapi` | `eacbce24c9` | `2026-02-04` | `CAT-4` | `SUB-4A` | 1 | `+1/-1` | `T1-Micro` | `TRAP-6` | DC-04 (RFC Header Token Whitespace Normalization) |
| 31 | `fastapi_14492` | `fastapi` | `a456e92a21` | `2026-02-04` | `CAT-7` | `SUB-7B` | 1 | `+1/-1` | `T1-Micro` | `TRAP-1`, `TRAP-2`, `TRAP-5` | DC-15 (Executable Tutorial `docs_src/` Audit) |
| 32 | `fastapi_14479` | `fastapi` | `2b212ddd76` | `2026-02-04` | `CAT-1` | `SUB-1A` | 1 | `+1/-1` | `T1-Micro` | `TRAP-1` | DC-08 (Domain Exception & Assertion Specificity) |
| 33 | `fastapi_14463` | `fastapi` | `f2687dc1bb` | `2026-02-04` | `CAT-3` | `SUB-3A` | 1 | `+2/-1` | `T1-Micro` | `TRAP-6` | DC-09 (Deepcopy Shared Mutable Schema Dicts) |
| 34 | `fastapi_12942` | `fastapi` | `27c0f7e75f` | `2025-10-08` | `CAT-1` | `SUB-1A` | 1 | `+3/-0` | `T1-Micro` | `TRAP-6`, `TRAP-8` | DC-01 (Recursive Annotated & Union Unpacking) |
| 35 | `fastapi_14099` | `fastapi` | `861b22c408` | `2025-09-29` | `CAT-3` | `SUB-3C` | 5 | `+346/-131` | `T4-Arch` | `TRAP-1`, `TRAP-2`, `TRAP-4` | DC-10 (AsyncExitStack Lifecycle Teardown + Tutorial Sync) |
| 36 | `fastapi_14609` | `fastapi` | `1b3bea8b6b` | `2025-12-27` | `CAT-2` | `SUB-2C` | 20 | `+192/-1855` | `T4-Arch` | `TRAP-1`, `TRAP-2`, `TRAP-4`, `TRAP-5`, `TRAP-7`, `TRAP-8` | DC-13 (Coordinated Multi-File Heredoc Refactor) |
| 37 | `fastapi_14372` | `fastapi` | `566e3157a5` | `2025-11-19` | `CAT-3` | `SUB-3B` | 2 | `+4/-3` | `T2-Surgical` | `TRAP-2` | DC-09 (Frozen Dataclass & dataclasses.replace) |
| 38 | `fastapi_14349` | `fastapi` | `eaf611f9ee` | `2025-11-13` | `CAT-2` | `SUB-2B` | 1 | `+6/-6` | `T2-Surgical` | `TRAP-5`, `TRAP-8` | DC-12 (JSON Schema Type Guard on Reserved Keys) |
| 39 | `fastapi_14512` | `fastapi` | `1fcec88ad2` | `2025-12-12` | `CAT-1` | `SUB-1A` | 1 | `+48/-4` | `T3-Moderate` | `TRAP-7`, `TRAP-8` | DC-01 (Recursive Annotated & Union Unpacking) |
| 40 | `fastapi_14487` | `fastapi` | `4a98a66778` | `2025-12-10` | `CAT-7` | `SUB-7B` | 1 | `+5/-2` | `T2-Surgical` | `TRAP-1`, `TRAP-2`, `TRAP-4`, `TRAP-5` | DC-15 (Executable Tutorial Security Hygiene) |
| 41 | `fastapi_11355` | `fastapi` | `811fa89875` | `2025-12-04` | `CAT-1` | `SUB-1B` | 1 | `+9/-2` | `T2-Surgical` | `STD` | DC-01 (Forward-Ref & Callable Unwrapping) |
| 42 | `fastapi_14485` | `fastapi` | `60699f306b` | `2025-12-10` | `CAT-1` | `SUB-1B` | 1 | `+13/-6` | `T2-Surgical` | `TRAP-8` | DC-01 (Forward-Ref & Callable Unwrapping) |
| 43 | `fastapi_14482` | `fastapi` | `71a17b5932` | `2025-12-10` | `CAT-2` | `SUB-2B` | 1 | `+25/-7` | `T3-Moderate` | `TRAP-8` | DC-03 (ConfigDict Propagation to TypeAdapter) |
| 44 | `fastapi_14306` | `fastapi` | `08b09e5236` | `2025-12-06` | `CAT-4` | `SUB-4C` | 2 | `+121/-16` | `T4-Arch` | `TRAP-2`, `TRAP-4` | DC-08 (Cached Traceback EndpointContext Metadata) |
| 45 | `fastapi_14458` | `fastapi` | `516169428d` | `2025-12-05` | `CAT-1` | `SUB-1B` | 1 | `+6/-1` | `T2-Surgical` | `STD` | DC-01 (Forward-Ref & Callable Unwrapping) |
| 46 | `fastapi_14459` | `fastapi` | `eb1d50479b` | `2025-12-04` | `CAT-3` | `SUB-3B` | 3 | `+49/-22` | `T3-Moderate` | `TRAP-1`, `TRAP-2`, `TRAP-8` | DC-09 (Sub-Dependency Security Scope Resolution) |
| 47 | `fastapi_14448` | `fastapi` | `c57ac7bdf3` | `2025-12-04` | `CAT-1` | `SUB-1B` | 2 | `+82/-24` | `T4-Arch` | `TRAP-1`, `TRAP-2`, `TRAP-4` | DC-01 (Forward-Ref & Callable Unwrapping) |
| 48 | `fastapi_14455` | `fastapi` | `603df6e36f` | `2025-12-04` | `CAT-3` | `SUB-3B` | 1 | `+11/-2` | `T2-Surgical` | `TRAP-8` | DC-09 (Ordered Dict Scope Deduplication) |
| 49 | `fastapi_9753` | `fastapi` | `aee8e78078` | `2025-12-02` | `CAT-1` | `SUB-1B` | 1 | `+5/-2` | `T2-Surgical` | `STD` | DC-01 (Forward-Ref & Callable Unwrapping) |
| 50 | `fastapi_14430` | `fastapi` | `cff2236dac` | `2025-12-02` | `CAT-1` | `SUB-1A` | 1 | `+2/-2` | `T1-Micro` | `TRAP-1`, `TRAP-8` | DC-01 (Recursive Annotated & Union Unpacking) |
| 51 | `fastapi_5077` | `fastapi` | `930b27e5fa` | `2025-12-02` | `CAT-1` | `SUB-1B` | 1 | `+4/-2` | `T2-Surgical` | `STD` | DC-01 (Forward-Ref & Callable Unwrapping) |
| 52 | `fastapi_9555` | `fastapi` | `4976568fc7` | `2025-12-02` | `CAT-1` | `SUB-1B` | 1 | `+14/-8` | `T2-Surgical` | `STD` | DC-01 (Forward-Ref & Callable Unwrapping) |
| 53 | `fastapi_14361` | `fastapi` | `5265c4f5cb` | `2025-12-02` | `CAT-2` | `SUB-2B` | 1 | `+1/-1` | `T1-Micro` | `TRAP-5`, `TRAP-6`, `TRAP-8` | DC-12 (JSON Schema Dict Key Guard) |
| 54 | `fastapi_13207` | `fastapi` | `5126e099bd` | `2025-12-02` | `CAT-2` | `SUB-2B` | 1 | `+12/-2` | `T2-Surgical` | `TRAP-1` | DC-03 (Validation vs Serialization Schema Mode) |
| 55 | `fastapi_14360` | `fastapi` | `eead41bf4c` | `2025-12-02` | `CAT-2` | `SUB-2A` | 1 | `+1/-2` | `T1-Micro` | `TRAP-6`, `TRAP-8` | DC-03 (Wire Alias vs Python Field Name Tracking) |
| 56 | `fastapi_14356` | `fastapi` | `6cf40df24d` | `2025-12-02` | `CAT-2` | `SUB-2A` | 1 | `+9/-2` | `T2-Surgical` | `TRAP-1` | DC-03 (MultiDict getlist Extra Parameter Preservation) |
| 57 | `fastapi_5624` | `fastapi` | `c6487ed632` | `2025-11-30` | `CAT-3` | `SUB-3A` | 1 | `+3/-1` | `T1-Micro` | `TRAP-5`, `TRAP-6` | DC-09 (Non-Mutating List Concatenation on Tree Traversal) |
| 58 | `fastapi_14419` | `fastapi` | `63d7a2b997` | `2025-11-30` | `CAT-3` | `SUB-3B` | 2 | `+42/-20` | `T3-Moderate` | `TRAP-2`, `TRAP-4` | DC-09 (Scope-Sensitive Dependency Cache Key) |
| 59 | `fastapi_14301` | `fastapi` | `972a967d5d` | `2025-11-08` | `CAT-3` | `SUB-3C` | 1 | `+4/-1` | `T1-Micro` | `TRAP-1` | DC-03 (Parameter Forwarding Completeness) |
| 60 | `fastapi_14262` | `fastapi` | `425a4c5bb1` | `2025-11-03` | `CAT-3` | `SUB-3C` | 10 | `+196/-70` | `T4-Arch` | `TRAP-2`, `TRAP-4` | DC-10 (Dual-Scope `function` vs `request` ExitStack Architecture) |
| 61 | `fastapi_14266` | `fastapi` | `2cf04ee30d` | `2025-10-31` | `CAT-4` | `SUB-4A` | 1 | `+8/-10` | `T2-Surgical` | `TRAP-8` | DC-09 (Top-Level Dependant Security Registration) |
| 62 | `fastapi_14246` | `fastapi` | `7132a69046` | `2025-10-29` | `CAT-2` | `SUB-2B` | 1 | `+24/-4` | `T3-Moderate` | `TRAP-1`, `TRAP-8` | DC-03 (Validation vs Serialization Schema Mode) |
| 63 | `fastapi_14186` | `fastapi` | `6e49dc0295` | `2025-10-20` | `CAT-2` | `SUB-2C` | 10 | `+266/-98` | `T4-Arch` | `TRAP-1`, `TRAP-2`, `TRAP-7`, `TRAP-8` | DC-16 (Sandbox Skip-Trap Awareness & Lazy Compat Shim) |
| 64 | `fastapi_9425` | `fastapi` | `0bdc3ca373` | `2025-09-20` | `CAT-1` | `SUB-1A` | 1 | `+2/-0` | `T1-Micro` | `TRAP-6` | DC-01 (Recursive Annotated & Union Unpacking) |
| 65 | `fastapi_13713` | `fastapi` | `5c1f87c563` | `2025-09-20` | `CAT-2` | `SUB-2B` | 2 | `+31/-0` | `T3-Moderate` | `TRAP-1`, `TRAP-2` | DC-03 (End-to-End Parameter Plumbing) |
| 66 | `fastapi_14077` | `fastapi` | `16d75d90eb` | `2025-09-16` | `CAT-4` | `SUB-4B` | 3 | `+5/-6` | `T2-Surgical` | `TRAP-1`, `TRAP-2`, `TRAP-4`, `TRAP-7` | DC-11 (Version-Agnostic Literal Status Constant) |
| 67 | `rich_3718` | `rich` | `7d36119f83` | `2025-06-24` | `CAT-6` | `SUB-6B` | 1 | `+3/-4` | `T2-Surgical` | `STD` | DC-04 (Composite Style Inheritance Order) |
| 68 | `rich_3934` | `rich` | `6764b24739` | `2026-01-22` | `CAT-6` | `SUB-6C` | 2 | `+17/-3` | `T2-Surgical` | `TRAP-2`, `TRAP-5` | DC-07 (Zero-Height Renderable Terminal Newline Guard) |
| 69 | `rich_3953` | `rich` | `1d402e0c59` | `2026-02-01` | `CAT-5` | `SUB-5A` | 1 | `+16/-10` | `T3-Moderate` | `TRAP-5` | DC-07 (Control Codepoint Guard & Index Bounds) |
| 70 | `rich_3944` | `rich` | `36fe3f7ca9` | `2026-01-24` | `CAT-5` | `SUB-5A` | 1 | `+1/-1` | `T1-Micro` | `TRAP-5`, `TRAP-6` | DC-04 (Unicode Private Use Area Default Cell Width) |
| 71 | `rich_3942` | `rich` | `c595fa9506` | `2026-01-24` | `CAT-6` | `SUB-6B` | 2 | `+43/-27` | `T3-Moderate` | `TRAP-1`, `TRAP-2`, `TRAP-5` | DC-11 (Theme Palette & Heading Element Refactor) |
| 72 | `rich_3938` | `rich` | `05ff970926` | `2026-01-23` | `CAT-5` | `SUB-5B` | 2 | `+40/-5` | `T3-Moderate` | `TRAP-2`, `TRAP-5` | DC-04 (ANSI Background Style Newline Isolation) |
| 73 | `rich_3882` | `rich` | `4d6d631a3d` | `2026-01-23` | `CAT-6` | `SUB-6C` | 1 | `+1/-1` | `T1-Micro` | `TRAP-6` | DC-04 (Explicit Render Flag Override on Shared Console) |
| 74 | `rich_3894` | `rich` | `4d6d631a3d` | `2026-01-23` | `CAT-1` | `SUB-1C` | 1 | `+4/-0` | `T1-Micro` | `TRAP-6` | DC-12 (Dunder Attribute Type Guard) |
| 75 | `rich_3935` | `rich` | `fe55a131c2` | `2026-01-23` | `CAT-6` | `SUB-6B` | 1 | `+13/-3` | `T2-Surgical` | `TRAP-1`, `TRAP-5` | DC-07 (Box-Model Padding Width Symmetry) |
| 76 | `rich_3905` | `rich` | `96dd4b60e3` | `2026-01-23` | `CAT-6` | `SUB-6C` | 1 | `+4/-3` | `T2-Surgical` | `STD` | DC-04 (Disabled-Component Teardown Guard) |
| 77 | `rich_3930` | `rich` | `53757bc234` | `2026-01-22` | `CAT-5` | `SUB-5A` | 26 | `+12170/-544` | `T4-Arch` | `TRAP-1`, `TRAP-2`, `TRAP-3` | DC-16 (Generated Multi-Table UCD Architecture) |
| 78 | `httpx_3672` | `httpx` | `4acf5c2c37` | `2025-09-19` | `CAT-4` | `SUB-4C` | 7 | `+57/-22` | `T3-Moderate` | `TRAP-1`, `TRAP-2`, `TRAP-3`, `TRAP-4`, `TRAP-5` | DC-11 + DC-15 (Alias Preservation, `unasync` Generator & Twin-Tree Sync) |
| 79 | `fastapi_14791` | `fastapi` | `08924400c2` | `2026-02-04` | `CAT-2` | `SUB-2B` | 1 | `+2/-0` | `T1-Micro` | `TRAP-6` | DC-14 (Module-Level Schema Constant Update) |
| 80 | `fastapi_15800` | `fastapi` | `f1d750fdda` | `2026-06-20` | `CAT-4` | `SUB-4C` | 8 | `+649/-5` | `T4-Arch` | `TRAP-2`, `TRAP-4` | DC-15 (SPA Static Routing + docs_src Sync) |
| 81 | `fastapi_15785` | `fastapi` | `202b2d2f5f` | `2026-06-18` | `CAT-4` | `SUB-4C` | 2 | `+66/-15` | `T4-Arch` | `TRAP-1`, `TRAP-2` | DC-11 (Public API Surface Extraction) |
| 82 | `fastapi_14371` | `fastapi` | `3fe6522aae` | `2025-12-12` | `CAT-2` | `SUB-2A` | 4 | `+46/-16` | `T3-Moderate` | `TRAP-1`, `TRAP-2`, `TRAP-4`, `TRAP-8` | DC-03 (Pydantic v2 Validation vs Serialization Alias) |
| 83 | `fastapi_14605` | `fastapi` | `6b53786f62` | `2025-12-26` | `CAT-2` | `SUB-2C` | 7 | `+28/-16` | `T3-Moderate` | `TRAP-1`, `TRAP-2`, `TRAP-8` | DC-08 (UserWarning Subclass for Visible Deprecations) |
| 84 | `fastapi_15763` | `fastapi` | `9a9c4ad5d0` | `2026-06-15` | `CAT-4` | `SUB-4C` | 1 | `+10/-3` | `T2-Surgical` | `STD` | DC-04 (Effective Mounted Path Validation) |
| 85 | `fastapi_14583` | `fastapi` | `6513d4daa1` | `2025-12-21` | `CAT-2` | `SUB-2C` | 2 | `+24/-0` | `T2-Surgical` | `TRAP-1`, `TRAP-2`, `TRAP-5`, `TRAP-8` | DC-11 (Targeted Deprecation Warning Injection) |
| 86 | `fastapi_15745` | `fastapi` | `016ab760fa` | `2026-06-14` | `CAT-4` | `SUB-4C` | 4 | `+939/-291` | `T4-Arch` | `TRAP-1`, `TRAP-2`, `TRAP-4`, `TRAP-8` | DC-13 (Architectural Router Context Preservation) |
| 87 | `fastapi_14297` | `fastapi` | `3c54a8f07b` | `2025-12-02` | `CAT-1` | `SUB-1A` | 1 | `+7/-0` | `T2-Surgical` | `TRAP-8` | DC-01 (Recursive Annotated & Union Unpacking) |
| 88 | `fastapi_14303` | `fastapi` | `740ec2787b` | `2025-12-02` | `CAT-2` | `SUB-2A` | 1 | `+6/-2` | `T2-Surgical` | `TRAP-4`, `TRAP-8` | DC-03 (MultiDict getlist Extra Parameter Preservation) |
| 89 | `fastapi_13537` | `fastapi` | `3b4b5ab8c8` | `2025-12-02` | `CAT-2` | `SUB-2A` | 1 | `+2/-1` | `T1-Micro` | `TRAP-4`, `TRAP-6` | DC-03 (Sentinel Presence vs None Value Disambiguation) |
| 90 | `fastapi_14953` | `fastapi` | `d2c17b603d` | `2026-02-21` | `CAT-2` | `SUB-2B` | 4 | `+102/-2` | `T4-Arch` | `TRAP-1`, `TRAP-2`, `TRAP-8` | DC-15 (OpenAPI 3.1 JSON Schema + docs_src Sync) |
| 91 | `fastapi_13786` | `fastapi` | `e2354a0a06` | `2025-11-24` | `CAT-4` | `SUB-4A` | 11 | `+176/-83` | `T4-Arch` | `TRAP-1`, `TRAP-2`, `TRAP-4` | DC-15 (HTTP 401 Auth Semantics + Multi-File Tutorial Sync) |
| 92 | `fastapi_14616` | `fastapi` | `54f8aeeb9a` | `2026-02-05` | `CAT-1` | `SUB-1A` | 1 | `+10/-2` | `T2-Surgical` | `STD` | DC-01 (Recursive Annotated & Union Unpacking) |
| 93 | `fastapi_11194` | `fastapi` | `a7f2dbe976` | `2025-09-20` | `CAT-2` | `SUB-2A` | 1 | `+3/-4` | `T2-Surgical` | `TRAP-4` | DC-03 (Per-Field Loop Invariant Check) |
| 94 | `requests_6757` | `requests` | `0e322af877` | `2024-07-30` | `CAT-4` | `SUB-4B` | 2 | `+16/-1` | `T2-Surgical` | `TRAP-1`, `TRAP-2`, `TRAP-7`, `TRAP-8` | DC-04 (Upstream Major-Version Compat Guard) |
| 95 | `requests_6629` | `requests` | `7a13c041db` | `2024-02-22` | `CAT-1` | `SUB-1C` | 1 | `+10/-0` | `T2-Surgical` | `STD` | DC-05 (MRO Pickle __reduce__ Serialization) |
| 96 | `requests_6644` | `requests` | `382fc2c0c6` | `2024-02-23` | `CAT-4` | `SUB-4B` | 1 | `+3/-0` | `T1-Micro` | `TRAP-6` | DC-04 (URI Path Authority Disambiguation) |
| 97 | `requests_6589` | `requests` | `7a13c041db` | `2024-02-23` | `CAT-4` | `SUB-4B` | 1 | `+3/-0` | `T1-Micro` | `TRAP-6`, `TRAP-8` | DC-04 (UTF-8 Byte Length vs Codepoint Length) |
| 98 | `requests_6592` | `requests` | `0b4d494192` | `2023-12-16` | `CAT-4` | `SUB-4B` | 1 | `+1/-1` | `T1-Micro` | `TRAP-6`, `TRAP-8` | DC-04 (RFC Status Registry Alias) |
| 99 | `rich_3180` | `rich` | `e76f3c3ea7` | `2023-11-14` | `CAT-5` | `SUB-5B` | 2 | `+89/-38` | `T4-Arch` | `TRAP-2` | DC-07 (Cell-Offset vs Codepoint-Index Wrapping) |
| 100 | `rich_3486` | `rich` | `d0de442c08` | `2024-09-11` | `CAT-6` | `SUB-6B` | 3 | `+74/-24` | `T4-Arch` | `TRAP-2`, `TRAP-5`, `TRAP-8` | DC-16 (PEP 657 Instruction Caret Ranges + Skipif Trap Awareness) |
| 101 | `rich_3777` | `rich` | `49117ced66` | `2025-06-23` | `CAT-6` | `SUB-6C` | 2 | `+12/-1` | `T2-Surgical` | `TRAP-2` | DC-04 (Environment Variable Precedence Matrix) |
| 102 | `rich_3468` | `rich` | `ae15db6009` | `2024-08-26` | `CAT-6` | `SUB-6C` | 1 | `+36/-6` | `T3-Moderate` | `TRAP-5`, `TRAP-8` | DC-08 (POSIX BrokenPipeError / SIGPIPE Graceful Exit) |
| 103 | `rich_3782` | `rich` | `3b70db5a29` | `2025-06-23` | `CAT-3` | `SUB-3B` | 1 | `+24/-5` | `T3-Moderate` | `TRAP-1`, `TRAP-5`, `TRAP-8` | DC-09 (Descriptor Normalization on Attribute Mutation) |
| 104 | `rich_3772` | `rich` | `2809954800` | `2025-06-19` | `CAT-3` | `SUB-3A` | 1 | `+29/-16` | `T3-Moderate` | `TRAP-5` | DC-07 (Visited-Set Cycle Breaker on Exception Graphs) |
| 105 | `rich_3296` | `rich` | `fde5d6eee3` | `2024-07-01` | `CAT-6` | `SUB-6B` | 1 | `+1/-3` | `T1-Micro` | `TRAP-6` | DC-04 (Override-Aware Style Helper Consistency) |
| 106 | `rich_3675` | `rich` | `edc6b0a39b` | `2025-03-28` | `CAT-6` | `SUB-6C` | 2 | `+28/-13` | `T3-Moderate` | `TRAP-1`, `TRAP-2`, `TRAP-5`, `TRAP-8` | DC-04 (Environment Variable Precedence Matrix) |
| 107 | `rich_3676` | `rich` | `2b5d648b2c` | `2025-03-28` | `CAT-6` | `SUB-6B` | 2 | `+12/-1` | `T2-Surgical` | `TRAP-2`, `TRAP-5`, `TRAP-8` | DC-08 (PEP 678 Exception `__notes__` Extraction) |
| 108 | `rich_3518` | `rich` | `5ba9cb56e6` | `2024-10-04` | `CAT-6` | `SUB-6B` | 1 | `+1/-1` | `T1-Micro` | `TRAP-6` | DC-03 (Implicit Child Component Attribute Inheritance) |
| 109 | `rich_3535` | `rich` | `0f2f51b872` | `2024-10-22` | `CAT-5` | `SUB-5A` | 2 | `+7/-1` | `T2-Surgical` | `TRAP-1`, `TRAP-2`, `TRAP-5` | DC-04 (Regex Character-Range Boundary Verification) |
| 110 | `rich_3521` | `rich` | `66074922ed` | `2024-10-04` | `CAT-5` | `SUB-5B` | 1 | `+16/-19` | `T3-Moderate` | `TRAP-1`, `TRAP-5` | DC-07 (Bidirectional Cell-Cut Convergence) |
| 111 | `rich_3506` | `rich` | `4101991898` | `2024-09-28` | `CAT-5` | `SUB-5B` | 1 | `+15/-2` | `T2-Surgical` | `TRAP-5` | DC-07 (Interpolation Lower-Bound Clamp) |
| 112 | `rich_3480` | `rich` | `9ec4191541` | `2024-09-06` | `CAT-3` | `SUB-3A` | 1 | `+2/-2` | `T1-Micro` | `TRAP-5`, `TRAP-6` | DC-09 (Self-Append Collection Snapshot `.copy()`) |
| 113 | `rich_3472` | `rich` | `b6f2f7aa5b` | `2024-08-26` | `CAT-1` | `SUB-1C` | 1 | `+3/-1` | `T1-Micro` | `TRAP-5`, `TRAP-6` | DC-12 (Uninitialized Dataclass hasattr Guard) |
| 114 | `rich_3454` | `rich` | `e1e6d745f6` | `2024-08-26` | `CAT-6` | `SUB-6A` | 1 | `+1/-1` | `T1-Micro` | `TRAP-6` | DC-04 (RFC 3986 Sub-Delim / Path `@` URL Character Class) |
| 115 | `rich_3471` | `rich` | `e2a982d5ea` | `2024-08-26` | `CAT-6` | `SUB-6A` | 1 | `+1/-0` | `T1-Micro` | `TRAP-5`, `TRAP-6` | DC-04 (Control-Code Sanitization on Token Ingestion) |
| 116 | `rich_3470` | `rich` | `0ba607dc08` | `2024-08-26` | `CAT-6` | `SUB-6C` | 1 | `+1/-1` | `T1-Micro` | `TRAP-1`, `TRAP-5` | DC-09 (Nested Buffer Index Guard on Recording) |
| 117 | `rich_3469` | `rich` | `c478588f3c` | `2024-08-26` | `CAT-6` | `SUB-6B` | 1 | `+1/-1` | `T1-Micro` | `TRAP-1`, `TRAP-5` | DC-04 (Block vs Inline Newline Segment Guard) |
| 118 | `rich_3052` | `rich` | `7a168a27c5` | `2024-07-01` | `CAT-6` | `SUB-6C` | 1 | `+29/-5` | `T3-Moderate` | `TRAP-1` | DC-03 (Case-Insensitive Choice Matching with Canonical Return) |
| 119 | `rich_3278` | `rich` | `4c5d305bb9` | `2024-07-01` | `CAT-6` | `SUB-6A` | 1 | `+1/-0` | `T1-Micro` | `TRAP-6` | DC-04 (ECMA-48 Private Escape Sequence Regex) |
| 120 | `rich_2943` | `rich` | `610fd75c43` | `2024-07-01` | `CAT-3` | `SUB-3B` | 1 | `+1/-1` | `T1-Micro` | `TRAP-6` | DC-09 (Cached Hash Invalidation on Copy-Mutate) |
| 121 | `rich_2725` | `rich` | `577def22dd` | `2024-07-01` | `CAT-6` | `SUB-6B` | 1 | `+5/-5` | `T2-Surgical` | `STD` | DC-04 (Positional Enum/Tuple Indexing Order) |
| 122 | `rich_3105` | `rich` | `9f620dc50c` | `2023-11-07` | `CAT-6` | `SUB-6C` | 1 | `+1/-1` | `T1-Micro` | `TRAP-1` | DC-14 (CSS Font Inheritance on Nested `<code>`) |
| 123 | `rich_3130` | `rich` | `720800e693` | `2023-09-17` | `CAT-6` | `SUB-6B` | 1 | `+5/-7` | `T2-Surgical` | `TRAP-1` | DC-09 (Accumulator Append vs Overwrite + Implicit String Concat Typo) |
| 124 | `rich_3043` | `rich` | `8a616de8e2` | `2023-07-29` | `CAT-6` | `SUB-6C` | 1 | `+1/-1` | `T1-Micro` | `TRAP-1` | DC-14 (Module Template Constant Inspection) |
| 125 | `rich_3067` | `rich` | `1ad6f73a4d` | `2023-07-31` | `CAT-6` | `SUB-6A` | 1 | `+1/-1` | `T1-Micro` | `TRAP-6` | DC-04 (RFC 3986 Unreserved URL Character Class) |
| 126 | `rich_3006` | `rich` | `0c8bb032ad` | `2023-07-29` | `CAT-1` | `SUB-1C` | 1 | `+1/-1` | `T1-Micro` | `TRAP-6`, `TRAP-8` | DC-08 (Sentinel Identity `is` vs Equality `==`) |
| 127 | `rich_3064` | `rich` | `01b85ac116` | `2023-07-29` | `CAT-6` | `SUB-6B` | 1 | `+8/-9` | `T2-Surgical` | `TRAP-5` | DC-08 (Graceful Partial-AST Guard vs Bare Assert) |
| 128 | `rich_3063` | `rich` | `368e8ad77c` | `2023-07-29` | `CAT-6` | `SUB-6A` | 1 | `+3/-1` | `T1-Micro` | `TRAP-1`, `TRAP-5` | DC-04 (Trailing Backslash Escape Parity) |
| 129 | `rich_3061` | `rich` | `aca9467ec6` | `2023-07-29` | `CAT-5` | `SUB-5B` | 1 | `+67/-24` | `T4-Arch` | `TRAP-1` | DC-07 (Span Offset Translation Under Tab Expansion) |

---

## 5. Exhaustive Root Cause Analysis of All 129 Public Dataset Problems

Each problem below is analyzed across three causal levels—**Level 1 (Observable Symptom)**, **Level 2 (Code-Level Defect)**, and **Level 3 (Architectural Root Cause)**—followed by the **Actionable Fix & BCF Brain Insight** and a ground-truth excerpt of the verified production diff.

### CAT-1: Type Introspection, Generics & Runtime Signature Unwrapping (23 Tasks)

**Category Overview:** Failures in runtime unpacking of PEP 593 `Annotated`, PEP 604 `UnionType` (`|`), PEP 695 `TypeAliasType`, PEP 563 stringified forward references, `@functools.wraps` decorator chains, metaclass descriptors, and exception/callable MRO hierarchies.

#### SUB-1A: Annotated, Union/UnionType (`|`), PEP 695 TypeAliasType & ForwardRef('None') Unpacking (9 Tasks)

##### [1/129] `fastapi_13920` — ✨ Add support for PEP695 `TypeAliasType`

- **Repository & Baseline**: `fastapi/fastapi` @ `0dd42b746e17` (`2026-02-05`) | **Prompt Length**: `225` chars | **Complexity**: `T1-Micro (1-5L)` (`+4 / -0` across `1` file(s))
- **Production Files Modified**: `fastapi/dependencies/utils.py`
- **Hidden Grading Test Files**: `tests/test_dependency_pep695.py` (`+27 / -0` test lines)
- **Active Traps**: `TRAP-6` | **Assigned BCF Card**: `DC-01 (Recursive Annotated & Union Unpacking)`
- **Level 1 — Observable Symptom**: Python 3.12+ PEP 695 `type Dep = Annotated[int, Depends(fn)]` (`TypeAliasType`) annotations on endpoint parameters are not unpacked, causing FastAPI to miss the inner `Depends()` marker and treat the alias as an arbitrary query/body type.
- **Level 2 — Code-Level Defect**: In `fastapi/dependencies/utils.py:analyze_param()`, `get_origin(annotation)` returns `None` for a `typing.TypeAliasType` object rather than `Annotated`, so `analyze_param` never inspects `annotation.__value__`.
- **Level 3 — Architectural Root Cause**: PEP 695 introduced lazy `TypeAliasType` runtime objects that do not eagerly flatten like legacy `TypeAlias` assignments, breaking `get_origin()`/`get_args()` introspection pipelines.
- **Actionable Fix & BCF Brain Insight**: Checking `if is_typealiastype(annotation): annotation = annotation.__value__` (via `typing_inspection.typing_objects.is_typealiastype`) at the entry of `analyze_param` transparently resolves PEP 695 aliases.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/dependencies/utils.py
+++ b/fastapi/dependencies/utils.py
@@ -66,6 +66,7 @@
 from starlette.responses import Response
 from starlette.websockets import WebSocket
 from typing_extensions import Literal, get_args, get_origin
+from typing_inspection.typing_objects import is_typealiastype
 
 multipart_not_installed_error = (
     'Form data requires "python-multipart" to be installed. \n'
@@ -370,6 +371,9 @@ def analyze_param(
     depends = None
     type_annotation: Any = Any
     use_annotation: Any = Any
+    if is_typealiastype(annotation):
+        # unpack in case PEP 695 type syntax is used
+        annotation = annotation.__value__
     if annotation is not inspect.Signature.empty:
         use_annotation = annotation
         type_annotation = annotation
```
</details>

##### [2/129] `fastapi_14794` — ✨ Allow `Response` type hint as dependency annotation

- **Repository & Baseline**: `fastapi/fastapi` @ `464c359bb03f` (`2026-02-05`) | **Prompt Length**: `816` chars | **Complexity**: `T1-Micro (1-5L)` (`+3 / -2` across `1` file(s))
- **Production Files Modified**: `fastapi/dependencies/utils.py`
- **Hidden Grading Test Files**: `tests/test_response_dependency.py` (`+173 / -0` test lines)
- **Active Traps**: `TRAP-6` | **Assigned BCF Card**: `DC-01 (Recursive Annotated & Union Unpacking)`
- **Level 1 — Observable Symptom**: Annotating a sub-dependency parameter with FastAPI/Starlette special types like `response: Annotated[Response, Depends(get_custom_response)]` or `response: Response = Depends(...)` crashes route registration with `AssertionError: Cannot specify Depends for type Response`.
- **Level 2 — Code-Level Defect**: In `fastapi/dependencies/utils.py:analyze_param()`, `if lenient_issubclass(type_annotation, (Request, WebSocket, HTTPConnection, Response, BackgroundTasks, SecurityScopes)):` executes unconditionally before checking if an explicit `depends` callable was provided, hitting `assert depends is None`.
- **Level 3 — Architectural Root Cause**: Over-eager special-parameter interception order: FastAPI assumed `Response`/`Request` type hints always request framework-injected context objects rather than describing the return type of a user `Depends` callable.
- **Actionable Fix & BCF Brain Insight**: Changing the branch condition to `if depends is None and lenient_issubclass(...)` lets explicit `Depends(...)` parameters bypass framework-singleton injection and resolve normally.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/dependencies/utils.py
+++ b/fastapi/dependencies/utils.py
@@ -449,7 +449,9 @@ def analyze_param(
         depends = dataclasses.replace(depends, dependency=type_annotation)
 
     # Handle non-param type annotations like Request
-    if lenient_issubclass(
+    # Only apply special handling when there's no explicit Depends - if there's a Depends,
+    # the dependency will be called and its return value used instead of the special injection
+    if depends is None and lenient_issubclass(
         type_annotation,
         (
             Request,
@@ -460,7 +462,6 @@ def analyze_param(
             SecurityScopes,
         ),
     ):
-        assert depends is None, f"Cannot specify `Depends` for type {type_annotation!r}"
         assert field_info is None, (
             f"Cannot specify FastAPI annotation for type {type_annotation!r}"
         )
```
</details>

##### [3/129] `fastapi_14479` — 🚸 Improve error message for invalid query parameter type annotations

- **Repository & Baseline**: `fastapi/fastapi` @ `2b212ddd7604` (`2026-02-04`) | **Prompt Length**: `2455` chars | **Complexity**: `T1-Micro (1-5L)` (`+1 / -1` across `1` file(s))
- **Production Files Modified**: `fastapi/dependencies/utils.py`
- **Hidden Grading Test Files**: `tests/test_invalid_sequence_param.py` (`+16 / -4` test lines)
- **Active Traps**: `TRAP-1` | **Assigned BCF Card**: `DC-08 (Domain Exception & Assertion Specificity)`
- **Level 1 — Observable Symptom**: Declaring an unsupported union/complex query parameter (e.g., `Annotated[str | dict, ...] = Query(None)`) crashes application startup with a bare, message-less `AssertionError` that gives zero indication which parameter failed.
- **Level 2 — Code-Level Defect**: In `fastapi/dependencies/utils.py:analyze_param()`, the assertion validating scalar/primitive sequence query types (`assert field is not None and ...`) had no assertion error string.
- **Level 3 — Architectural Root Cause**: After PR #12942 improved `Annotated` union detection, previously misclassified complex unions began hitting the bare internal invariant `assert` in `analyze_param` without user-facing diagnostics.
- **Actionable Fix & BCF Brain Insight**: Appending `, f"Query parameter {param_name!r} must be one of the supported types"` satisfies existing `pytest.raises(AssertionError)` checks while matching the exact message required by `test_invalid_sequence_param.py` (Trap-1 tightened test assertion).

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/dependencies/utils.py
+++ b/fastapi/dependencies/utils.py
@@ -552,7 +552,7 @@ def analyze_param(
                     # For Pydantic v1
                     and getattr(field, "shape", 1) == 1
                 )
-            )
+            ), f"Query parameter {param_name!r} must be one of the supported types"
 
     return ParamDetails(type_annotation=type_annotation, depends=depends, field=field)
```
</details>

##### [4/129] `fastapi_12942` — 🐛 Fix tagged discriminated union not recognized as body field

- **Repository & Baseline**: `fastapi/fastapi` @ `27c0f7e75fc0` (`2025-10-08`) | **Prompt Length**: `1392` chars | **Complexity**: `T1-Micro (1-5L)` (`+3 / -0` across `1` file(s))
- **Production Files Modified**: `fastapi/_compat.py`
- **Hidden Grading Test Files**: `tests/test_union_body_discriminator.py` (`+188 / -0` test lines)
- **Active Traps**: `TRAP-6`, `TRAP-8` | **Assigned BCF Card**: `DC-01 (Recursive Annotated & Union Unpacking)`
- **Level 1 — Observable Symptom**: Endpoint parameters typed as a tagged discriminated union wrapped in `Annotated[..., Discriminator(...)]` are misclassified as query parameters instead of JSON request bodies, triggering HTTP 422 validation errors.
- **Level 2 — Code-Level Defect**: In `fastapi/_compat.py:field_annotation_is_complex()`, `get_origin(annotation)` checks `origin is Union or origin is UnionType` first, but when the union is wrapped in `Annotated[Union[A, B], Discriminator(...)]`, `origin` is `Annotated` rather than `Union`, causing `_annotation_is_complex` to return `False`.
- **Level 3 — Architectural Root Cause**: Incomplete recursive unwrapping of nested PEP 593 `typing.Annotated` wrappers in FastAPI's scalar-vs-complex parameter classification heuristic.
- **Actionable Fix & BCF Brain Insight**: Adding `if origin is Annotated: return field_annotation_is_complex(get_args(annotation)[0])` recursively peels outer metadata before inspecting union branches. Note: `test_patch` imports `dirty_equals` and `inline_snapshot`.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/_compat.py
+++ b/fastapi/_compat.py
@@ -590,6 +590,9 @@ def field_annotation_is_complex(annotation: Union[Type[Any], None]) -> bool:
     if origin is Union or origin is UnionType:
         return any(field_annotation_is_complex(arg) for arg in get_args(annotation))
 
+    if origin is Annotated:
+        return field_annotation_is_complex(get_args(annotation)[0])
+
     return (
         _annotation_is_complex(annotation)
         or _annotation_is_complex(origin)
```
</details>

##### [5/129] `fastapi_14512` — 🐛 Fix support for tagged union with discriminator inside of `Annotated` with `Body()`

- **Repository & Baseline**: `fastapi/fastapi` @ `1fcec88ad2df` (`2025-12-12`) | **Prompt Length**: `289` chars | **Complexity**: `T3-Moderate (26-80L)` (`+48 / -4` across `1` file(s))
- **Production Files Modified**: `fastapi/_compat/v2.py`
- **Hidden Grading Test Files**: `tests/test_union_body_discriminator_annotated.py` (`+207 / -0` test lines)
- **Active Traps**: `TRAP-7`, `TRAP-8` | **Assigned BCF Card**: `DC-01 (Recursive Annotated & Union Unpacking)`
- **Level 1 — Observable Symptom**: Combining a Pydantic v2 tagged discriminated union (`Annotated[Cat | Dog, Discriminator(...)]`) inside `Annotated[..., Body()]` raises `PydanticSchemaGenerationError` or loses discriminator metadata during `ModelField` initialization.
- **Level 2 — Code-Level Defect**: In `fastapi/_compat/v2.py:ModelField.__post_init__()`, constructing `TypeAdapter(Annotated[self.field_info.annotation, self.field_info])` passes a merged `Body` `FieldInfo` whose unset default attributes override inner `Discriminator` metadata on Pydantic < 2.12.3.
- **Level 3 — Architectural Root Cause**: Pydantic v2 `FieldInfo` composition asymmetry when re-wrapping an already-annotated union inside a FastAPI `Body()` `FieldInfo` subclass without decomposing `annotation`, `metadata`, and explicit `Field(...)` attributes.
- **Actionable Fix & BCF Brain Insight**: Decomposing `self.field_info` via a custom `asdict(field_info)` helper and rebuilding `Field(**attributes)` inside `Annotated` preserves inner `Tag` and `Discriminator` annotations cleanly.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/_compat/v2.py
+++ b/fastapi/_compat/v2.py
@@ -18,7 +18,7 @@
 from fastapi._compat import may_v1, shared
 from fastapi.openapi.constants import REF_TEMPLATE
 from fastapi.types import IncEx, ModelNameMap, UnionType
-from pydantic import BaseModel, ConfigDict, TypeAdapter, create_model
+from pydantic import BaseModel, ConfigDict, Field, TypeAdapter, create_model
 from pydantic import PydanticSchemaGenerationError as PydanticSchemaGenerationError
 from pydantic import PydanticUndefinedAnnotation as PydanticUndefinedAnnotation
 from pydantic import ValidationError as ValidationError
@@ -50,6 +50,45 @@
 evaluate_forwardref = eval_type_lenient
 Validator = Any
 
+# TODO: remove when dropping support for Pydantic < v2.12.3
+_Attrs = {
+    "default": ...,
+    "default_factory": None,
+    "alias": None,
+    "alias_priority": None,
+    "validation_alias": None,
+    "serialization_alias": None,
+    "title": None,
+    "field_title_generator": None,
+    "description": None,
# ... [50 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [6/129] `fastapi_14430` — 🐛 Fix optional sequence handling with new union syntax from Python 3.10

- **Repository & Baseline**: `fastapi/fastapi` @ `cff2236dacb7` (`2025-12-02`) | **Prompt Length**: `335` chars | **Complexity**: `T1-Micro (1-5L)` (`+2 / -2` across `1` file(s))
- **Production Files Modified**: `fastapi/_compat/v2.py`
- **Hidden Grading Test Files**: `tests/test_compat.py` (`+14 / -1` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-8` | **Assigned BCF Card**: `DC-01 (Recursive Annotated & Union Unpacking)`
- **Level 1 — Observable Symptom**: Optional sequence parameters written with Python 3.10 PEP 604 pipe syntax (`files: list[bytes] | None = File(None)`) still crash with `TypeError: issubclass() arg 1 must be a class` in `serialize_sequence_value`.
- **Level 2 — Code-Level Defect**: In `fastapi/_compat/v2.py:serialize_sequence_value()`, the guard added in PR #14297 checked `if origin_type is Union:` exclusively, missing `types.UnionType` (`fastapi.types.UnionType`) produced by the `|` operator.
- **Level 3 — Architectural Root Cause**: Dual union runtime representation in Python 3.10+ (`typing.Union` vs `types.UnionType`), a recurring pitfall whenever `is Union` is used instead of `origin_type is Union or origin_type is UnionType`.
- **Actionable Fix & BCF Brain Insight**: Updating the check to `if origin_type is Union or origin_type is UnionType:` handles both `Optional[list[T]]` and `list[T] | None` uniformly.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/_compat/v2.py
+++ b/fastapi/_compat/v2.py
@@ -17,7 +17,7 @@
 
 from fastapi._compat import may_v1, shared
 from fastapi.openapi.constants import REF_TEMPLATE
-from fastapi.types import IncEx, ModelNameMap
+from fastapi.types import IncEx, ModelNameMap, UnionType
 from pydantic import BaseModel, TypeAdapter, create_model
 from pydantic import PydanticSchemaGenerationError as PydanticSchemaGenerationError
 from pydantic import PydanticUndefinedAnnotation as PydanticUndefinedAnnotation
@@ -381,7 +381,7 @@ def copy_field_info(*, field_info: FieldInfo, annotation: Any) -> FieldInfo:
 
 def serialize_sequence_value(*, field: ModelField, value: Any) -> Sequence[Any]:
     origin_type = get_origin(field.field_info.annotation) or field.field_info.annotation
-    if origin_type is Union:  # Handle optional sequences
+    if origin_type is Union or origin_type is UnionType:  # Handle optional sequences
         union_args = get_args(field.field_info.annotation)
         for union_arg in union_args:
             if union_arg is type(None):
```
</details>

##### [7/129] `fastapi_9425` — ✨  Allow `None` as return type for bodiless responses

- **Repository & Baseline**: `fastapi/fastapi` @ `0bdc3ca3732e` (`2025-09-20`) | **Prompt Length**: `235` chars | **Complexity**: `T1-Micro (1-5L)` (`+2 / -0` across `1` file(s))
- **Production Files Modified**: `fastapi/dependencies/utils.py`
- **Hidden Grading Test Files**: `tests/test_return_none_stringified_annotations.py` (`+17 / -0` test lines)
- **Active Traps**: `TRAP-6` | **Assigned BCF Card**: `DC-01 (Recursive Annotated & Union Unpacking)`
- **Level 1 — Observable Symptom**: Declaring an HTTP `204 No Content` route with a stringified return annotation (`def endpoint() -> 'None':` or under `from __future__ import annotations`) triggers `AssertionError: Status code 204 must not have a response body` at startup.
- **Level 2 — Code-Level Defect**: In `fastapi/dependencies/utils.py:get_typed_annotation()`, `evaluate_forwardref(ForwardRef('None'), ...)` evaluates to `type(None)` (`NoneType` class) rather than the singleton `None`, whereas `APIRoute.__init__` checks `if self.response_model:` (and `bool(type(None))` is `True`!).
- **Level 3 — Architectural Root Cause**: Semantic mismatch in CPython typing between unquoted `-> None` (stored in `Signature` or normalized by `get_type_hints`, vs `ForwardRef('None')._evaluate()` returning `NoneType`).
- **Actionable Fix & BCF Brain Insight**: Adding `if annotation is type(None): return None` immediately after `evaluate_forwardref` normalizes stringified `'None'` to `None` so bodiless `204`/`205`/`304` assertions pass.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/dependencies/utils.py
+++ b/fastapi/dependencies/utils.py
@@ -254,6 +254,8 @@ def get_typed_annotation(annotation: Any, globalns: Dict[str, Any]) -> Any:
     if isinstance(annotation, str):
         annotation = ForwardRef(annotation)
         annotation = evaluate_forwardref(annotation, globalns, globalns)
+        if annotation is type(None):
+            return None
     return annotation
```
</details>

##### [8/129] `fastapi_14297` — 🐛 Fix optional sequence handling in `serialize sequence value` with Pydantic V2

- **Repository & Baseline**: `fastapi/fastapi` @ `3c54a8f07b70` (`2025-12-02`) | **Prompt Length**: `1219` chars | **Complexity**: `T2-Surgical (6-25L)` (`+7 / -0` across `1` file(s))
- **Production Files Modified**: `fastapi/_compat/v2.py`
- **Hidden Grading Test Files**: `tests/test_compat.py`, `tests/test_optional_file_list.py` (`+54 / -0` test lines)
- **Active Traps**: `TRAP-8` | **Assigned BCF Card**: `DC-01 (Recursive Annotated & Union Unpacking)`
- **Level 1 — Observable Symptom**: Endpoints accepting optional file/byte sequences such as `files: Optional[List[bytes]] = File(None)` crash at runtime with `TypeError: issubclass() arg 1 must be a class` when multipart files are uploaded.
- **Level 2 — Code-Level Defect**: In `fastapi/_compat/v2.py:serialize_sequence_value()`, `origin_type = get_origin(field.field_info.annotation)` evaluates to `typing.Union` for `Optional[List[bytes]]`, which is passed directly into `assert issubclass(origin_type, shared.sequence_types)`.
- **Level 3 — Architectural Root Cause**: Pydantic v2 `ModelField` retains the outer `Union[List[T], None]` annotation in `field_info.annotation` instead of stripping `NoneType` into a dedicated `shape` flag as Pydantic v1 did.
- **Actionable Fix & BCF Brain Insight**: Unwrapping `if origin_type is Union:` and extracting `get_origin(union_arg) or union_arg` for the first non-`NoneType` argument restores concrete sequence coercion (`list`, `tuple`, `set`).

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/_compat/v2.py
+++ b/fastapi/_compat/v2.py
@@ -371,6 +371,13 @@ def copy_field_info(*, field_info: FieldInfo, annotation: Any) -> FieldInfo:
 
 def serialize_sequence_value(*, field: ModelField, value: Any) -> Sequence[Any]:
     origin_type = get_origin(field.field_info.annotation) or field.field_info.annotation
+    if origin_type is Union:  # Handle optional sequences
+        union_args = get_args(field.field_info.annotation)
+        for union_arg in union_args:
+            if union_arg is type(None):
+                continue
+            origin_type = get_origin(union_arg) or union_arg
+            break
     assert issubclass(origin_type, shared.sequence_types)  # type: ignore[arg-type]
     return shared.sequence_annotation_to_type[origin_type](value)  # type: ignore[no-any-return]
```
</details>

##### [9/129] `fastapi_14616` — 🐛 Fix using `Json[list[str]]` type (issue #10997)

- **Repository & Baseline**: `fastapi/fastapi` @ `54f8aeeb9a15` (`2026-02-05`) | **Prompt Length**: `1176` chars | **Complexity**: `T2-Surgical (6-25L)` (`+10 / -2` across `1` file(s))
- **Production Files Modified**: `fastapi/dependencies/utils.py`
- **Hidden Grading Test Files**: `tests/test_json_type.py` (`+63 / -0` test lines)
- **Active Traps**: `STD` | **Assigned BCF Card**: `DC-01 (Recursive Annotated & Union Unpacking)`
- **Level 1 — Observable Symptom**: Using Pydantic's `Json[list[str]]` inside `Form()`, `Query()`, `Header()`, or `Cookie()` fails validation with `TypeError: JSON input should be string, bytes or bytearray` when a valid JSON array string `'["a", "b"]'` is sent.
- **Level 2 — Code-Level Defect**: In `fastapi/dependencies/utils.py:_get_multidict_value()`, `is_sequence_field(field)` returns `True` because the inner type of `Json[list[str]]` is `list[str]`, causing FastAPI to call `values.getlist(alias)` and wrap the raw JSON string inside an extra Python `list` (`['["a", "b"]']`).
- **Level 3 — Architectural Root Cause**: Conflating wire-format container cardinality (single JSON-encoded string wire scalar) with post-validation target Python type (`list[str]`) when `pydantic.Json` metadata is attached.
- **Actionable Fix & BCF Brain Insight**: Checking `not _is_json_field(field)` (`any(type(item) is Json for item in field.field_info.metadata)`) before `is_sequence_field(field)` forces scalar `.get(alias)` extraction so Pydantic parses the JSON string.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/dependencies/utils.py
+++ b/fastapi/dependencies/utils.py
@@ -51,7 +51,7 @@
 from fastapi.security.oauth2 import SecurityScopes
 from fastapi.types import DependencyCacheKey
 from fastapi.utils import create_model_field, get_path_param_names
-from pydantic import BaseModel
+from pydantic import BaseModel, Json
 from pydantic.fields import FieldInfo
 from starlette.background import BackgroundTasks as StarletteBackgroundTasks
 from starlette.concurrency import run_in_threadpool
@@ -726,11 +726,19 @@ def _validate_value_with_model_field(
         return v_, []
 
 
+def _is_json_field(field: ModelField) -> bool:
+    return any(type(item) is Json for item in field.field_info.metadata)
+
+
 def _get_multidict_value(
     field: ModelField, values: Mapping[str, Any], alias: Union[str, None] = None
 ) -> Any:
     alias = alias or get_validation_alias(field)
-    if is_sequence_field(field) and isinstance(values, (ImmutableMultiDict, Headers)):
+    if (
+        (not _is_json_field(field))
# ... [6 additional diff lines omitted for brevity; full file list above] ...
```
</details>

#### SUB-1B: Deferred String Annotations (`__future__`), `TYPE_CHECKING`, `@wraps` & Callable Unwrapping (7 Tasks)

##### [10/129] `fastapi_11355` — 🐛 Fix evaluating stringified annotations in Python 3.10

- **Repository & Baseline**: `fastapi/fastapi` @ `811fa898752e` (`2025-12-04`) | **Prompt Length**: `299` chars | **Complexity**: `T2-Surgical (6-25L)` (`+9 / -2` across `1` file(s))
- **Production Files Modified**: `fastapi/dependencies/utils.py`
- **Hidden Grading Test Files**: `tests/test_stringified_annotations_simple.py` (`+26 / -0` test lines)
- **Active Traps**: `STD` | **Assigned BCF Card**: `DC-01 (Forward-Ref & Callable Unwrapping)`
- **Level 1 — Observable Symptom**: Under `from __future__ import annotations` on Python 3.10+, parameter annotations like `Annotated[str, Depends(Dep())]` remain un-evaluated strings (`"Annotated[str, Depends(Dep())]"`), so FastAPI misses `Depends` and treats `test` as a required query parameter (HTTP 422).
- **Level 2 — Code-Level Defect**: In `fastapi/dependencies/utils.py`, `get_typed_signature()` and `get_typed_return_annotation()` called `inspect.signature(call)` without `eval_str=True`, leaving `Annotated` expressions as raw strings when `Dep()` is a local/closure instance.
- **Level 3 — Architectural Root Cause**: PEP 563 deferred string annotations require `inspect.signature(call, eval_str=True)` (added in Python 3.10) to resolve `call.__globals__` and closure `f_locals` accurately.
- **Actionable Fix & BCF Brain Insight**: Calling `inspect.signature(call, eval_str=True)` when `sys.version_info >= (3, 10)` evaluates stringified `Annotated[..., Depends(...)]` signatures natively.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/dependencies/utils.py
+++ b/fastapi/dependencies/utils.py
@@ -1,5 +1,6 @@
 import dataclasses
 import inspect
+import sys
 from contextlib import AsyncExitStack, contextmanager
 from copy import copy, deepcopy
 from dataclasses import dataclass
@@ -191,7 +192,10 @@ def get_flat_params(dependant: Dependant) -> List[ModelField]:
 
 
 def get_typed_signature(call: Callable[..., Any]) -> inspect.Signature:
-    signature = inspect.signature(call)
+    if sys.version_info >= (3, 10):
+        signature = inspect.signature(call, eval_str=True)
+    else:
+        signature = inspect.signature(call)
     unwrapped = inspect.unwrap(call)
     globalns = getattr(unwrapped, "__globals__", {})
     typed_params = [
@@ -217,7 +221,10 @@ def get_typed_annotation(annotation: Any, globalns: Dict[str, Any]) -> Any:
 
 
 def get_typed_return_annotation(call: Callable[..., Any]) -> Any:
-    signature = inspect.signature(call)
# ... [6 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [11/129] `fastapi_14485` — 🐛 Fix support for `if TYPE_CHECKING`,  non-evaluated stringified annotations

- **Repository & Baseline**: `fastapi/fastapi` @ `60699f306b67` (`2025-12-10`) | **Prompt Length**: `317` chars | **Complexity**: `T2-Surgical (6-25L)` (`+13 / -6` across `1` file(s))
- **Production Files Modified**: `fastapi/dependencies/utils.py`
- **Hidden Grading Test Files**: `tests/test_stringified_annotation_dependency.py` (`+80 / -0` test lines)
- **Active Traps**: `TRAP-8` | **Assigned BCF Card**: `DC-01 (Forward-Ref & Callable Unwrapping)`
- **Level 1 — Observable Symptom**: Dependencies or endpoints using `from __future__ import annotations` whose return type or unused annotation is imported under `if TYPE_CHECKING:` crash at import/startup with `NameError`.
- **Level 2 — Code-Level Defect**: In `fastapi/dependencies/utils.py`, `inspect.signature(call, eval_str=True)` (introduced in #11355) eagerly evaluates *every* parameter and return annotation on `call`, raising unhandled `NameError` when any symbol is guarded by `if TYPE_CHECKING:`.
- **Level 3 — Architectural Root Cause**: Eager whole-signature evaluation in CPython's `inspect.signature(..., eval_str=True)` fails atomically if even one non-FastAPI return annotation is absent from runtime `__globals__`.
- **Actionable Fix & BCF Brain Insight**: Extracting `_get_signature(call)` with `try: signature = inspect.signature(call, eval_str=True) except NameError: signature = inspect.signature(call)` falls back gracefully to per-parameter `get_typed_annotation`.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/dependencies/utils.py
+++ b/fastapi/dependencies/utils.py
@@ -209,11 +209,21 @@ def get_flat_params(dependant: Dependant) -> List[ModelField]:
     return path_params + query_params + header_params + cookie_params
 
 
-def get_typed_signature(call: Callable[..., Any]) -> inspect.Signature:
+def _get_signature(call: Callable[..., Any]) -> inspect.Signature:
     if sys.version_info >= (3, 10):
-        signature = inspect.signature(call, eval_str=True)
+        try:
+            signature = inspect.signature(call, eval_str=True)
+        except NameError:
+            # Handle type annotations with if TYPE_CHECKING, not used by FastAPI
+            # e.g. dependency return types
+            signature = inspect.signature(call)
     else:
         signature = inspect.signature(call)
+    return signature
+
+
+def get_typed_signature(call: Callable[..., Any]) -> inspect.Signature:
+    signature = _get_signature(call)
     unwrapped = inspect.unwrap(call)
     globalns = getattr(unwrapped, "__globals__", {})
     typed_params = [
# ... [11 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [12/129] `fastapi_14458` — 🐛 Fix using class (not instance) dependency that has `__call__` method

- **Repository & Baseline**: `fastapi/fastapi` @ `516169428d2f` (`2025-12-05`) | **Prompt Length**: `591` chars | **Complexity**: `T2-Surgical (6-25L)` (`+6 / -1` across `1` file(s))
- **Production Files Modified**: `fastapi/dependencies/models.py`
- **Hidden Grading Test Files**: `tests/test_dependency_class.py` (`+32 / -0` test lines)
- **Active Traps**: `STD` | **Assigned BCF Card**: `DC-01 (Forward-Ref & Callable Unwrapping)`
- **Level 1 — Observable Symptom**: Declaring a class (not an instance) as a dependency (`instance: CallableAsyncClass = Depends()`) where the class defines `async def __call__` or generator `__call__` causes FastAPI to await `CallableAsyncClass()` instantiation itself, crashing with `TypeError: object CallableAsyncClass can't be used in 'await' expression`.
- **Level 2 — Code-Level Defect**: In `fastapi/dependencies/models.py`, PR #14448 removed the early `if inspect.isclass(...): return False` guard before inspecting `dunder_call = getattr(..., '__call__', None)`. On a class object, `getattr(Cls, '__call__')` retrieves the unbound instance method `Cls.__call__`, fooling `iscoroutinefunction(dunder_call)`!
- **Level 3 — Architectural Root Cause**: Python data-model subtlety: `getattr(MyClass, '__call__')` returns the `async def __call__` function defined for *instances* of `MyClass`, even though calling `MyClass(...)` invokes `type.__call__` (`__new__`/`__init__`) synchronously.
- **Actionable Fix & BCF Brain Insight**: Adding `if inspect.isclass(_unwrapped_call(self.call)): return False` before `dunder_call` inspection in `is_gen_callable`, `is_async_gen_callable`, and `is_coroutine_callable` restores class-dependency instantiation.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/dependencies/models.py
+++ b/fastapi/dependencies/models.py
@@ -110,6 +110,8 @@ def is_gen_callable(self) -> bool:
             _impartial(self.call)
         ) or inspect.isgeneratorfunction(_unwrapped_call(self.call)):
             return True
+        if inspect.isclass(_unwrapped_call(self.call)):
+            return False
         dunder_call = getattr(_impartial(self.call), "__call__", None)  # noqa: B004
         if dunder_call is None:
             return False  # pragma: no cover
@@ -134,6 +136,8 @@ def is_async_gen_callable(self) -> bool:
             _impartial(self.call)
         ) or inspect.isasyncgenfunction(_unwrapped_call(self.call)):
             return True
+        if inspect.isclass(_unwrapped_call(self.call)):
+            return False
         dunder_call = getattr(_impartial(self.call), "__call__", None)  # noqa: B004
         if dunder_call is None:
             return False  # pragma: no cover
@@ -162,6 +166,8 @@ def is_coroutine_callable(self) -> bool:
             _unwrapped_call(self.call)
         ):
             return True
+        if inspect.isclass(_unwrapped_call(self.call)):
+            return False
# ... [11 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [13/129] `fastapi_14448` — 🐛 Fix support for functools wraps and partial combined, for async and regular functions and classes in path operations and dependencies

- **Repository & Baseline**: `fastapi/fastapi` @ `c57ac7bdf361` (`2025-12-04`) | **Prompt Length**: `1226` chars | **Complexity**: `T4-Arch (>80L)` (`+82 / -24` across `2` file(s))
- **Production Files Modified**: `fastapi/dependencies/models.py`, `fastapi/dependencies/utils.py`
- **Hidden Grading Test Files**: `tests/test_dependency_wrapped.py` (`+376 / -4` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-2`, `TRAP-4` | **Assigned BCF Card**: `DC-01 (Forward-Ref & Callable Unwrapping)`
- **Level 1 — Observable Symptom**: Arbitrary compositions of `functools.wraps` and stacked `functools.partial` (e.g., an async wrapper around a sync function, or `partial(wraps(partial(async_gen)))`) misclassify coroutine vs threadpool execution in endpoints and dependencies.
- **Level 2 — Code-Level Defect**: In `fastapi/dependencies/models.py` and `utils.py`, unwrapping only once (`if isinstance(unwrapped, partial)`) missed nested `partial(partial(...))` chains AND checking *only* the innermost `_unwrapped_call` missed async decorators wrapping sync functions.
- **Level 3 — Architectural Root Cause**: Callable execution semantics depend on the union of the outer wrapper AND inner target: if *either* the outer decorator or the inner unwrapped callable (or its `__call__`) is async/generator, the invocation yields a coroutine/generator.
- **Actionable Fix & BCF Brain Insight**: Introducing `while isinstance(func, partial): func = func.func` (`_impartial`) and checking both `_impartial(call)` and `_unwrapped_call(call)` (plus their `__call__` methods) covers the entire decorator/partial matrix.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/dependencies/models.py
+++ b/fastapi/dependencies/models.py
@@ -15,6 +15,19 @@
     from asyncio import iscoroutinefunction
 
 
+def _unwrapped_call(call: Optional[Callable[..., Any]]) -> Any:
+    if call is None:
+        return call  # pragma: no cover
+    unwrapped = inspect.unwrap(_impartial(call))
+    return unwrapped
+
+
+def _impartial(func: Callable[..., Any]) -> Callable[..., Any]:
+    while isinstance(func, partial):
+        func = func.func
+    return func
+
+
 @dataclass
 class SecurityRequirement:
     security_scheme: SecurityBase
@@ -75,37 +88,82 @@ def _uses_scopes(self) -> bool:
                 return True
         return False
 
# ... [114 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [14/129] `fastapi_9753` — ✨ Allow using dependables with `functools.partial()`

- **Repository & Baseline**: `fastapi/fastapi` @ `aee8e78078e8` (`2025-12-02`) | **Prompt Length**: `689` chars | **Complexity**: `T2-Surgical (6-25L)` (`+5 / -2` across `1` file(s))
- **Production Files Modified**: `fastapi/dependencies/models.py`
- **Hidden Grading Test Files**: `tests/test_dependency_partial.py` (`+251 / -0` test lines)
- **Active Traps**: `STD` | **Assigned BCF Card**: `DC-01 (Forward-Ref & Callable Unwrapping)`
- **Level 1 — Observable Symptom**: Passing `Depends(functools.partial(async_dep, value='x'))` or `partial(CallableClass())` fails to detect coroutine or generator callables consistently on Python < 3.11 / callable instances.
- **Level 2 — Code-Level Defect**: In `fastapi/dependencies/models.py:Dependant._unwrapped_call`, `inspect.unwrap(self.call)` does not unwrap `functools.partial` instances (which store the target callable on `.func` rather than `__wrapped__`).
- **Level 3 — Architectural Root Cause**: Standard library `inspect.unwrap()` only traverses `__wrapped__` attributes, leaving `functools.partial` wrappers opaque to `inspect.isgeneratorfunction` and `dunder_call` checks.
- **Actionable Fix & BCF Brain Insight**: Unwrapping `if isinstance(unwrapped, partial): unwrapped = unwrapped.func` inside `_unwrapped_call` enables `partial` across sync/async functions, generators, and callable class instances.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/dependencies/models.py
+++ b/fastapi/dependencies/models.py
@@ -1,7 +1,7 @@
 import inspect
 import sys
 from dataclasses import dataclass, field
-from functools import cached_property
+from functools import cached_property, partial
 from typing import Any, Callable, List, Optional, Sequence, Union
 
 from fastapi._compat import ModelField
@@ -79,7 +79,10 @@ def _uses_scopes(self) -> bool:
     def _unwrapped_call(self) -> Any:
         if self.call is None:
             return self.call  # pragma: no cover
-        return inspect.unwrap(self.call)
+        unwrapped = inspect.unwrap(self.call)
+        if isinstance(unwrapped, partial):
+            unwrapped = unwrapped.func
+        return unwrapped
 
     @cached_property
     def is_gen_callable(self) -> bool:
```
</details>

##### [15/129] `fastapi_5077` — ✨ Add support for wrapped functions (e.g. `@functools.wraps()`) used with forward references

- **Repository & Baseline**: `fastapi/fastapi` @ `930b27e5fa32` (`2025-12-02`) | **Prompt Length**: `2679` chars | **Complexity**: `T2-Surgical (6-25L)` (`+4 / -2` across `1` file(s))
- **Production Files Modified**: `fastapi/dependencies/utils.py`
- **Hidden Grading Test Files**: `tests/forward_reference_type.py`, `tests/test_wrapped_method_forward_reference.py` (`+40 / -0` test lines)
- **Active Traps**: `STD` | **Assigned BCF Card**: `DC-01 (Forward-Ref & Callable Unwrapping)`
- **Level 1 — Observable Symptom**: Decorating an endpoint or dependency imported from another module with `@functools.wraps(f)` causes `NameError: name 'ForwardRefModel' is not defined` when resolving string forward references.
- **Level 2 — Code-Level Defect**: In `fastapi/dependencies/utils.py`, `get_typed_signature` and `get_typed_return_annotation` read `globalns = getattr(call, '__globals__', {})` from the outer decorator wrapper rather than the original unwrapped function.
- **Level 3 — Architectural Root Cause**: `functools.wraps` copies `__annotations__` onto the wrapper function, but the wrapper's `__globals__` points to the decorator's module rather than the module where the forward-referenced types were defined.
- **Actionable Fix & BCF Brain Insight**: Calling `unwrapped = inspect.unwrap(call)` and reading `getattr(unwrapped, '__globals__', {})` mirrors `typing.get_type_hints()` and resolves cross-module forward references accurately.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/dependencies/utils.py
+++ b/fastapi/dependencies/utils.py
@@ -192,7 +192,8 @@ def get_flat_params(dependant: Dependant) -> List[ModelField]:
 
 def get_typed_signature(call: Callable[..., Any]) -> inspect.Signature:
     signature = inspect.signature(call)
-    globalns = getattr(call, "__globals__", {})
+    unwrapped = inspect.unwrap(call)
+    globalns = getattr(unwrapped, "__globals__", {})
     typed_params = [
         inspect.Parameter(
             name=param.name,
@@ -217,12 +218,13 @@ def get_typed_annotation(annotation: Any, globalns: Dict[str, Any]) -> Any:
 
 def get_typed_return_annotation(call: Callable[..., Any]) -> Any:
     signature = inspect.signature(call)
+    unwrapped = inspect.unwrap(call)
     annotation = signature.return_annotation
 
     if annotation is inspect.Signature.empty:
         return None
 
-    globalns = getattr(call, "__globals__", {})
+    globalns = getattr(unwrapped, "__globals__", {})
     return get_typed_annotation(annotation, globalns)
```
</details>

##### [16/129] `fastapi_9555` — ✨ Handle wrapped dependencies

- **Repository & Baseline**: `fastapi/fastapi` @ `4976568fc7cb` (`2025-12-02`) | **Prompt Length**: `2934` chars | **Complexity**: `T2-Surgical (6-25L)` (`+14 / -8` across `1` file(s))
- **Production Files Modified**: `fastapi/dependencies/models.py`
- **Hidden Grading Test Files**: `tests/test_dependency_wrapped.py` (`+77 / -0` test lines)
- **Active Traps**: `STD` | **Assigned BCF Card**: `DC-01 (Forward-Ref & Callable Unwrapping)`
- **Level 1 — Observable Symptom**: Wrapping an `async def` or generator dependency with `@functools.wraps` or `@functools.lru_cache` causes FastAPI to run it in a sync threadpool without awaiting it, failing with `AttributeError: 'coroutine' object has no attribute ...`.
- **Level 2 — Code-Level Defect**: In `fastapi/dependencies/models.py:Dependant`, `is_gen_callable`, `is_async_gen_callable`, and `is_coroutine_callable` inspected `self.call` directly instead of following `__wrapped__` chains via `inspect.unwrap(self.call)`.
- **Level 3 — Architectural Root Cause**: C-level or sync Python wrapper objects (`_lru_cache_wrapper`, sync `@wraps` decorators) are not themselves coroutine functions even when `__wrapped__` returns an awaitable coroutine or generator.
- **Actionable Fix & BCF Brain Insight**: Adding `@cached_property def _unwrapped_call(self)` calling `inspect.unwrap(self.call)` and checking `_unwrapped_call` across all three callable properties fixes wrapped dependency execution.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/dependencies/models.py
+++ b/fastapi/dependencies/models.py
@@ -75,27 +75,33 @@ def _uses_scopes(self) -> bool:
                 return True
         return False
 
+    @cached_property
+    def _unwrapped_call(self) -> Any:
+        if self.call is None:
+            return self.call  # pragma: no cover
+        return inspect.unwrap(self.call)
+
     @cached_property
     def is_gen_callable(self) -> bool:
-        if inspect.isgeneratorfunction(self.call):
+        if inspect.isgeneratorfunction(self._unwrapped_call):
             return True
-        dunder_call = getattr(self.call, "__call__", None)  # noqa: B004
+        dunder_call = getattr(self._unwrapped_call, "__call__", None)  # noqa: B004
         return inspect.isgeneratorfunction(dunder_call)
 
     @cached_property
     def is_async_gen_callable(self) -> bool:
-        if inspect.isasyncgenfunction(self.call):
+        if inspect.isasyncgenfunction(self._unwrapped_call):
             return True
# ... [18 additional diff lines omitted for brevity; full file list above] ...
```
</details>

#### SUB-1C: Runtime Inspection Edge Cases, Metaclass Descriptors, `NamedTuple` & Exception MRO (7 Tasks)

##### [17/129] `requests_7505` — Add hasattr checks for remaining protocol isinstance checks

- **Repository & Baseline**: `psf/requests` @ `6f205ff422bc` (`2026-06-09`) | **Prompt Length**: `518` chars | **Complexity**: `T2-Surgical (6-25L)` (`+9 / -7` across `2` file(s))
- **Production Files Modified**: `src/requests/_types.py`, `src/requests/models.py`
- **Hidden Grading Test Files**: `tests/test_requests.py` (`+15 / -0` test lines)
- **Active Traps**: `TRAP-2`, `TRAP-8` | **Assigned BCF Card**: `DC-12 (Dynamic Proxy hasattr Duck-Typing)`
- **Level 1 — Observable Symptom**: Read-only `__getattr__` proxy objects (raising `AttributeError` on `__iter__` while delegating `read`) still fail in `_encode_params` and `prepare_body` where raw `isinstance(data, _SupportsRead)` checks remained.
- **Level 2 — Code-Level Defect**: In `src/requests/models.py`, lines 162 (`_encode_params`) and 643 (`prepare_body`) still used `isinstance(data, _SupportsRead)` without `hasattr(data, 'read')`.
- **Level 3 — Architectural Root Cause**: Incomplete codebase-wide sweep after fixing `_encode_files` in PR #7502 left two sibling `_SupportsRead` call sites vulnerable to `__getattr__` proxies.
- **Actionable Fix & BCF Brain Insight**: Centralizing `def has_read(obj: Any) -> TypeIs[SupportsRead[str | bytes]]: return isinstance(obj, SupportsRead) or hasattr(obj, 'read')` in `src/requests/_types.py` and calling `_t.has_read(...)` across all three sites eliminates protocol drift.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/src/requests/_types.py
+++ b/src/requests/_types.py
@@ -29,6 +29,11 @@ class SupportsRead(Protocol[_T_co]):
     def read(self, length: int = ..., /) -> _T_co: ...
 
 
+def has_read(obj: Any) -> TypeIs[SupportsRead[str | bytes]]:
+    """Check if obj supports read, including __getattr__ based proxies."""
+    return isinstance(obj, SupportsRead) or hasattr(obj, "read")
+
+
 @runtime_checkable
 class SupportsItems(Protocol[_KT_co, _VT_co]):
     def items(self) -> Iterable[tuple[_KT_co, _VT_co]]: ...
--- a/src/requests/models.py
+++ b/src/requests/models.py
@@ -35,8 +35,8 @@
 from urllib3.filepost import encode_multipart_formdata
 from urllib3.util import parse_url
 
+from . import _types as _t
 from ._internal_utils import to_native_string, unicode_is_ascii
-from ._types import SupportsRead as _SupportsRead
 from .auth import HTTPBasicAuth
 from .compat import (
     JSONDecodeError,
# ... [37 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [18/129] `requests_7502` — Fix `_encode_files` detection for `__getattr__`-based file wrappers

- **Repository & Baseline**: `psf/requests` @ `661970d171d9` (`2026-06-08`) | **Prompt Length**: `67` chars | **Complexity**: `T1-Micro (1-5L)` (`+3 / -1` across `1` file(s))
- **Production Files Modified**: `src/requests/models.py`
- **Hidden Grading Test Files**: `tests/test_requests.py` (`+11 / -0` test lines)
- **Active Traps**: `TRAP-5`, `TRAP-6`, `TRAP-8` | **Assigned BCF Card**: `DC-12 (Dynamic Proxy hasattr Duck-Typing)`
- **Level 1 — Observable Symptom**: Uploading a `tempfile.NamedTemporaryFile` via `requests.post(url, files={'file': f})` silently skips or mishandles reading the file payload in `_encode_files`.
- **Level 2 — Code-Level Defect**: In `src/requests/models.py:RequestEncodingMixin._encode_files()`, `elif isinstance(fp, _SupportsRead):` uses a `@runtime_checkable` `Protocol`, which fails (`False`) on Python's `tempfile._TemporaryFileWrapper` because `.read` is proxied via `__getattr__` on non-POSIX/wrapper implementations.
- **Level 3 — Architectural Root Cause**: PEP 544 `@runtime_checkable` `Protocol` `isinstance()` checks suffer from a subtle limitation on dynamic proxy objects when static typing modernizations replace legacy `hasattr(fp, 'read')`.
- **Actionable Fix & BCF Brain Insight**: Checking `elif isinstance(fp, _SupportsRead) or hasattr(fp, 'read'):` fixes `NamedTemporaryFile` multipart uploads cleanly.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/src/requests/models.py
+++ b/src/requests/models.py
@@ -236,7 +236,9 @@ def _encode_files(
 
             if isinstance(fp, (str, bytes, bytearray)):
                 fdata = fp
-            elif isinstance(fp, _SupportsRead):  # defensive check for untyped callers
+            # data that proxies attributes to underlying objects needs hasattr
+            # defensive check for untyped callers
+            elif isinstance(fp, _SupportsRead) or hasattr(fp, "read"):
                 fdata = fp.read()
             elif fp is None:  # defensive check for untyped callers
                 continue
```
</details>

##### [19/129] `requests_7433` — Fix `prepare_body` stream detection for `__getattr__`-based file wrappers

- **Repository & Baseline**: `psf/requests` @ `0b401c76b6e8` (`2026-05-12`) | **Prompt Length**: `498` chars | **Complexity**: `T2-Surgical (6-25L)` (`+3 / -3` across `1` file(s))
- **Production Files Modified**: `src/requests/models.py`
- **Hidden Grading Test Files**: `tests/test_requests.py` (`+15 / -0` test lines)
- **Active Traps**: `TRAP-8` | **Assigned BCF Card**: `DC-12 (Dynamic Proxy hasattr Duck-Typing)`
- **Level 1 — Observable Symptom**: Passing a file-like wrapper that delegates methods via `__getattr__` (such as `tempfile._TemporaryFileWrapper` or custom stream proxies) as `requests.post(url, data=wrapper)` fails stream detection and breaks chunked/redirect body handling.
- **Level 2 — Code-Level Defect**: In `src/requests/models.py:PreparedRequest.prepare_body()`, `isinstance(data, Iterable)` checks the class MRO for `__iter__`, which returns `False` when `__iter__` is only dynamically exposed on the instance via `__getattr__`.
- **Level 3 — Architectural Root Cause**: Python's `collections.abc.Iterable.__subclasshook__` inspects class dictionaries (`type(obj).__mro__`), intentionally ignoring instance-level `__getattr__` delegation.
- **Actionable Fix & BCF Brain Insight**: Replacing `isinstance(data, Iterable)` with `isinstance(data, Iterable) or hasattr(data, '__iter__')` (while excluding `(str, bytes, list, tuple, Mapping)`) restores duck-typed stream detection. Note: `test_patch` uses `httpbin` (TRAP-8 in air-gapped Docker without local httpbin).

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/src/requests/models.py
+++ b/src/requests/models.py
@@ -596,9 +596,9 @@ def prepare_body(
             if not isinstance(body, bytes):
                 body = body.encode("utf-8")
 
-        if isinstance(data, Iterable) and not isinstance(
-            data, (str, bytes, list, tuple, Mapping)
-        ):
+        # data that proxies attributes to underlying objects needs hasattr
+        is_iterable = isinstance(data, Iterable) or hasattr(data, "__iter__")
+        if is_iterable and not isinstance(data, (str, bytes, list, tuple, Mapping)):
             try:
                 length = super_len(data)
             except (TypeError, AttributeError, UnsupportedOperation):
```
</details>

##### [20/129] `rich_3894` — Handle unusual __qualname__ in inspect

- **Repository & Baseline**: `Textualize/rich` @ `4d6d631a3d2d` (`2026-01-23`) | **Prompt Length**: `1972` chars | **Complexity**: `T1-Micro (1-5L)` (`+4 / -0` across `1` file(s))
- **Production Files Modified**: `rich/_inspect.py`
- **Hidden Grading Test Files**: `tests/test_inspect.py` (`+13 / -0` test lines)
- **Active Traps**: `TRAP-6` | **Assigned BCF Card**: `DC-12 (Dunder Attribute Type Guard)`
- **Level 1 — Observable Symptom**: Calling `rich.inspect(Klass)` on an `@lru_cache`-wrapped class defining `__slots__ = ('__qualname__',)` crashes with `AttributeError` or `TypeError` during signature formatting.
- **Level 2 — Code-Level Defect**: In `rich/_inspect.py:Inspect._get_signature()`, `qualname = name or getattr(obj, '__qualname__', name)` assumes `__qualname__` is always a `str`, but `__slots__ = ('__qualname__',)` places a `member_descriptor` object on the class attribute.
- **Level 3 — Architectural Root Cause**: Assuming Python dunder metadata attributes (`__qualname__`, `__name__`) always return `str` even on descriptors, slots, or functools wrappers.
- **Actionable Fix & BCF Brain Insight**: Guarding `if not isinstance(qualname, str): qualname = getattr(obj, '__name__', name)` with a second fallback `if not isinstance(qualname, str): qualname = name` prevents descriptor crashes.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/_inspect.py
+++ b/rich/_inspect.py
@@ -101,6 +101,10 @@ def _get_signature(self, name: str, obj: Any) -> Optional[Text]:
         signature_text = self.highlighter(_signature)
 
         qualname = name or getattr(obj, "__qualname__", name)
+        if not isinstance(qualname, str):
+            qualname = getattr(obj, "__name__", name)
+            if not isinstance(qualname, str):
+                qualname = name
 
         # If obj is a module, there may be classes (which are callable) to display
         if inspect.isclass(obj):
```
</details>

##### [21/129] `requests_6629` — Fix #6628 - JSONDecodeError are not deserializable

- **Repository & Baseline**: `psf/requests` @ `7a13c041dbef` (`2024-02-22`) | **Prompt Length**: `836` chars | **Complexity**: `T2-Surgical (6-25L)` (`+10 / -0` across `1` file(s))
- **Production Files Modified**: `src/requests/exceptions.py`
- **Hidden Grading Test Files**: `tests/test_requests.py` (`+10 / -0` test lines)
- **Active Traps**: `STD` | **Assigned BCF Card**: `DC-05 (MRO Pickle __reduce__ Serialization)`
- **Level 1 — Observable Symptom**: Pickling and unpickling `requests.exceptions.JSONDecodeError` (e.g., across `multiprocessing.Pool` workers) crashes with `TypeError: __init__() missing 2 required positional arguments: 'doc' and 'pos'`.
- **Level 2 — Code-Level Defect**: In `src/requests/exceptions.py`, `class JSONDecodeError(InvalidJSONError, CompatJSONDecodeError):` inherits from `InvalidJSONError -> RequestException -> IOError (OSError)` *before* `json.JSONDecodeError`, so `pickle` resolves `OSError.__reduce__` (which drops `doc` and `pos`) instead of `CompatJSONDecodeError.__reduce__`.
- **Level 3 — Architectural Root Cause**: Multiple-inheritance C-extension exception MRO conflict between `OSError.__reduce__` (1-arg message state) and `json.JSONDecodeError.__reduce__` (3-arg `(msg, doc, pos)` constructor requirement).
- **Actionable Fix & BCF Brain Insight**: Defining `def __reduce__(self): return CompatJSONDecodeError.__reduce__(self)` on `requests.exceptions.JSONDecodeError` restores lossless pickle serialization.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/src/requests/exceptions.py
+++ b/src/requests/exceptions.py
@@ -41,6 +41,16 @@ def __init__(self, *args, **kwargs):
         CompatJSONDecodeError.__init__(self, *args)
         InvalidJSONError.__init__(self, *self.args, **kwargs)
 
+    def __reduce__(self):
+        """
+        The __reduce__ method called when pickling the object must
+        be the one from the JSONDecodeError (be it json/simplejson)
+        as it expects all the arguments for instantiation, not just
+        one like the IOError, and the MRO would by default call the
+        __reduce__ method from the IOError due to the inheritance order.
+        """
+        return CompatJSONDecodeError.__reduce__(self)
+
 
 class HTTPError(RequestException):
     """An HTTP error occurred."""
```
</details>

##### [22/129] `rich_3472` — fix for missing field in dataclass

- **Repository & Baseline**: `Textualize/rich` @ `b6f2f7aa5b27` (`2024-08-26`) | **Prompt Length**: `88` chars | **Complexity**: `T1-Micro (1-5L)` (`+3 / -1` across `1` file(s))
- **Production Files Modified**: `rich/pretty.py`
- **Hidden Grading Test Files**: `tests/test_pretty.py` (`+20 / -0` test lines)
- **Active Traps**: `TRAP-5`, `TRAP-6` | **Assigned BCF Card**: `DC-12 (Uninitialized Dataclass hasattr Guard)`
- **Level 1 — Observable Symptom**: Pretty-printing a `@dataclass` instance that declares `item: int = field(init=False)` without assigning `self.item` crashes `console.print()` with `AttributeError: 'BadDataclass' object has no attribute 'item'`.
- **Level 2 — Code-Level Defect**: In `rich/pretty.py:_traverse` (`iter_attrs`), `for field in fields(obj) if field.repr` immediately calls `getattr(obj, field.name)` without checking whether the attribute actually exists on the instance.
- **Level 3 — Architectural Root Cause**: `dataclasses.fields(obj)` enumerates class-level field descriptors regardless of whether `init=False` or `del obj.attr` left the instance slot unpopulated.
- **Actionable Fix & BCF Brain Insight**: Adding `and hasattr(obj, field.name)` to the generator filter skips unpopulated dataclass fields cleanly, matching stdlib `dataclasses` repr behavior.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/pretty.py
+++ b/rich/pretty.py
@@ -781,7 +781,9 @@ def iter_attrs() -> (
                 )
 
                 for last, field in loop_last(
-                    field for field in fields(obj) if field.repr
+                    field
+                    for field in fields(obj)
+                    if field.repr and hasattr(obj, field.name)
                 ):
                     child_node = _traverse(getattr(obj, field.name), depth=depth + 1)
                     child_node.key_repr = field.name
```
</details>

##### [23/129] `rich_3006` — Fixed issue with custom classes (fixes #2875)

- **Repository & Baseline**: `Textualize/rich` @ `0c8bb032ad3b` (`2023-07-29`) | **Prompt Length**: `675` chars | **Complexity**: `T1-Micro (1-5L)` (`+1 / -1` across `1` file(s))
- **Production Files Modified**: `rich/repr.py`
- **Hidden Grading Test Files**: `tests/test_repr.py` (`+40 / -0` test lines)
- **Active Traps**: `TRAP-6`, `TRAP-8` | **Assigned BCF Card**: `DC-08 (Sentinel Identity `is` vs Equality `==`)`
- **Level 1 — Observable Symptom**: `@rich.repr.auto` produces wrong positional-vs-keyword repr output (or crashes) when formatting an instance whose parameter value overrides `__eq__` and returns `True` when compared to `inspect.Parameter.empty`.
- **Level 2 — Code-Level Defect**: In `rich/repr.py:auto_rich_repr()`, line 79 wrote `if param.default == param.empty:` using value equality `==`, invoking user-defined `__eq__` on default parameter objects.
- **Level 3 — Architectural Root Cause**: Using `==` instead of `is` when testing CPython singleton sentinel classes (`inspect.Parameter.empty`), allowing arbitrary `__eq__` overloads (such as SQLAlchemy column expressions, NumPy arrays, or custom classes) to hijack control flow.
- **Actionable Fix & BCF Brain Insight**: Replacing `==` with `if param.default is param.empty:` enforces O(1) pointer identity without invoking user `__eq__`.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/repr.py
+++ b/rich/repr.py
@@ -76,7 +76,7 @@ def auto_rich_repr(self: Type[T]) -> Result:
                         param.POSITIONAL_OR_KEYWORD,
                         param.KEYWORD_ONLY,
                     ):
-                        if param.default == param.empty:
+                        if param.default is param.empty:
                             yield getattr(self, param.name)
                         else:
                             yield param.name, getattr(self, param.name), param.default
```
</details>

### CAT-2: Data Serialization, Validation Aliases, OpenAPI Schemas & Pydantic Lifecycle (21 Tasks)

**Category Overview:** Directional mismatches between input validation and output serialization in Pydantic v2 (`validation_alias` vs `serialization_alias`, `MultiDict`/`FormData` extraction), OpenAPI 3.1 JSON Schema `$ref`/computed-field generation, Rust `TypeAdapter.dump_json()` fast-paths, and staged `pydantic.v1` deprecation/removal.

#### SUB-2A: Pydantic v2 Field/Form Aliases, MultiDict Extraction & Discriminator Validation (7 Tasks)

##### [24/129] `fastapi_15589` — ♻️ Do not accept underscore headers when using `convert_underscores=True` (the default)

- **Repository & Baseline**: `fastapi/fastapi` @ `22b02e26f9e8` (`2026-05-23`) | **Prompt Length**: `1245` chars | **Complexity**: `T1-Micro (1-5L)` (`+4 / -0` across `1` file(s))
- **Production Files Modified**: `fastapi/dependencies/utils.py`
- **Hidden Grading Test Files**: `tests/test_query_cookie_header_model_extra_params.py` (`+35 / -0` test lines)
- **Active Traps**: `TRAP-6` | **Assigned BCF Card**: `DC-03 (Wire Alias vs Python Field Name Tracking)`
- **Level 1 — Observable Symptom**: When using a Pydantic `Header()` model with `extra='allow'` and default `convert_underscores=True`, sending an underscore header (`x_user_id`) instead of a hyphenated header (`x-user-id`) fails to report `x_user_id` correctly or leaks underscore keys.
- **Level 2 — Code-Level Defect**: In `fastapi/dependencies/utils.py:request_params_to_args()`, `processed_keys.add(alias or get_validation_alias(field))` only marked the converted hyphenated `alias` (`x-user-id`) as processed, leaving the raw `get_validation_alias(field)` (`x_user_id`) unmarked so the extra-params loop accepted `x_user_id` as an extra field!
- **Level 3 — Architectural Root Cause**: Incomplete dual-key accounting when `convert_underscores=True` creates two distinct wire representations (hyphenated HTTP header name vs raw underscore validation alias) for a single model field.
- **Actionable Fix & BCF Brain Insight**: Adding `processed_keys.add(get_validation_alias(field))` unconditionally prevents raw underscore headers from sneaking into `params_to_process` as extra fields unless `convert_underscores=False`.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/dependencies/utils.py
+++ b/fastapi/dependencies/utils.py
@@ -826,6 +826,10 @@ def request_params_to_args(
         if value is not None:
             params_to_process[get_validation_alias(field)] = value
         processed_keys.add(alias or get_validation_alias(field))
+        # For headers with convert_underscores=True, mark both the converted
+        # header name and the original field alias as processed to avoid
+        # accepting the original alias as an extra header.
+        processed_keys.add(get_validation_alias(field))
 
     for key in received_params.keys():
         if key not in processed_keys:
```
</details>

##### [25/129] `fastapi_14360` — 🐛 Fix Query\Header\Cookie parameter model alias

- **Repository & Baseline**: `fastapi/fastapi` @ `eead41bf4cf8` (`2025-12-02`) | **Prompt Length**: `753` chars | **Complexity**: `T1-Micro (1-5L)` (`+1 / -2` across `1` file(s))
- **Production Files Modified**: `fastapi/dependencies/utils.py`
- **Hidden Grading Test Files**: `tests/test_request_param_model_by_alias.py` (`+76 / -0` test lines)
- **Active Traps**: `TRAP-6`, `TRAP-8` | **Assigned BCF Card**: `DC-03 (Wire Alias vs Python Field Name Tracking)`
- **Level 1 — Observable Symptom**: Declaring a `Query()`, `Header()`, or `Cookie()` Pydantic `BaseModel` with `Field(alias='param_alias')` fails validation even when `?param_alias=foo` is sent, and hides invalid `?param=foo` from validation error `input` details.
- **Level 2 — Code-Level Defect**: In `fastapi/dependencies/utils.py:request_params_to_args()`, extracted values were stored under `params_to_process[field.name] = value` instead of `params_to_process[field.alias] = value`, AND `processed_keys.add(field.name)` suppressed unaliased `field.name` from being reported as an unexpected input.
- **Level 3 — Architectural Root Cause**: Key-space confusion between single-parameter injection (which binds Python function kwargs by `field.name`) and Pydantic model validation (which validates raw input dicts by `field.alias`).
- **Actionable Fix & BCF Brain Insight**: Writing `params_to_process[field.alias] = value` and removing `processed_keys.add(field.name)` fixes both model validation and error input reporting in 2 lines.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/dependencies/utils.py
+++ b/fastapi/dependencies/utils.py
@@ -787,9 +787,8 @@ def request_params_to_args(
                 )
         value = _get_multidict_value(field, received_params, alias=alias)
         if value is not None:
-            params_to_process[field.name] = value
+            params_to_process[field.alias] = value
         processed_keys.add(alias or field.alias)
-        processed_keys.add(field.name)
 
     for key in received_params.keys():
         if key not in processed_keys:
```
</details>

##### [26/129] `fastapi_14356` — 🐛 Fix parsing extra non-body parameter list

- **Repository & Baseline**: `fastapi/fastapi` @ `6cf40df24d1d` (`2025-12-02`) | **Prompt Length**: `1481` chars | **Complexity**: `T2-Surgical (6-25L)` (`+9 / -2` across `1` file(s))
- **Production Files Modified**: `fastapi/dependencies/utils.py`
- **Hidden Grading Test Files**: `tests/test_query_cookie_header_model_extra_params.py`, `tests/test_tutorial/test_header_param_models/test_tutorial003.py` (`+112 / -1` test lines)
- **Active Traps**: `TRAP-1` | **Assigned BCF Card**: `DC-03 (MultiDict getlist Extra Parameter Preservation)`
- **Level 1 — Observable Symptom**: Passing repeated query or header values (`?param2=456&param2=789`) to a `Query()` or `Header()` Pydantic model with `model_config = {'extra': 'allow'}` drops all values except the last (`'789'`).
- **Level 2 — Code-Level Defect**: In `fastapi/dependencies/utils.py:request_params_to_args()`, extra keys not in `processed_keys` were iterated via `for key, value in received_params.items():`, which on Starlette's `QueryParams` / `Headers` `ImmutableMultiDict` yields only the last value per duplicate key.
- **Level 3 — Architectural Root Cause**: Starlette's `ImmutableMultiDict.items()` returns unique-key scalar pairs (last-write-wins) unless `.getlist(key)` is explicitly queried.
- **Actionable Fix & BCF Brain Insight**: Iterating `for key in received_params.keys():` and calling `received_params.getlist(key)` (unwrapping length-1 lists to `value[0]` and preserving multi-item `list`s) preserves multi-value extra parameters.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/dependencies/utils.py
+++ b/fastapi/dependencies/utils.py
@@ -791,9 +791,16 @@ def request_params_to_args(
         processed_keys.add(alias or field.alias)
         processed_keys.add(field.name)
 
-    for key, value in received_params.items():
+    for key in received_params.keys():
         if key not in processed_keys:
-            params_to_process[key] = value
+            if hasattr(received_params, "getlist"):
+                value = received_params.getlist(key)
+                if isinstance(value, list) and (len(value) == 1):
+                    params_to_process[key] = value[0]
+                else:
+                    params_to_process[key] = value
+            else:
+                params_to_process[key] = received_params.get(key)
 
     if single_not_embedded_field:
         field_info = first_field.field_info
```
</details>

##### [27/129] `fastapi_14371` — 🐛 Fix parameter aliases

- **Repository & Baseline**: `fastapi/fastapi` @ `3fe6522aaed4` (`2025-12-12`) | **Prompt Length**: `397` chars | **Complexity**: `T3-Moderate (26-80L)` (`+46 / -16` across `4` file(s))
- **Production Files Modified**: `fastapi/_compat/v2.py`, `fastapi/dependencies/utils.py`, `fastapi/openapi/utils.py`, `fastapi/params.py`
- **Hidden Grading Test Files**: `tests/test_request_params/test_body/test_list.py`, `tests/test_request_params/test_body/test_optional_list.py`, `tests/test_request_params/test_body/test_optional_str.py`, `tests/test_request_params/test_body/test_required_str.py`, `tests/test_request_params/test_cookie/test_optional_str.py`, ... (+18 more) (`+309 / -1073` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-2`, `TRAP-4`, `TRAP-8` | **Assigned BCF Card**: `DC-03 (Pydantic v2 Validation vs Serialization Alias)`
- **Level 1 — Observable Symptom**: Declaring `Field(validation_alias='...')` or `Field(serialization_alias='...')` on FastAPI `Query`, `Header`, `Cookie`, `Form`, or `Body` parameters fails parameter extraction and generates wrong OpenAPI parameter names/titles.
- **Level 2 — Code-Level Defect**: Across `fastapi/_compat/v2.py`, `fastapi/dependencies/utils.py`, `fastapi/openapi/utils.py`, and `fastapi/params.py`, FastAPI read `field.alias` (`field_info.alias`), which is `None` in Pydantic v2 when only `validation_alias` or `serialization_alias` is specified.
- **Level 3 — Architectural Root Cause**: Pydantic v2 split unified v1 `alias` into three orthogonal properties (`alias`, `validation_alias`, `serialization_alias`), breaking FastAPI's assumption that `field.alias` always reflects the active input/output wire key.
- **Actionable Fix & BCF Brain Insight**: Adding `validation_alias` and `serialization_alias` properties on `v2.ModelField` and routing input extraction + OpenAPI parameter schemas through `get_validation_alias(field)` resolves alias mismatches across 4 core files.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/_compat/v2.py
+++ b/fastapi/_compat/v2.py
@@ -110,6 +110,18 @@ def alias(self) -> str:
         a = self.field_info.alias
         return a if a is not None else self.name
 
+    @property
+    def validation_alias(self) -> Union[str, None]:
+        va = self.field_info.validation_alias
+        if isinstance(va, str) and va:
+            return va
+        return None
+
+    @property
+    def serialization_alias(self) -> Union[str, None]:
+        sa = self.field_info.serialization_alias
+        return sa or None
+
     @property
     def required(self) -> bool:
         return self.field_info.is_required()
@@ -243,12 +255,18 @@ def get_schema_from_model_field(
         if (separate_input_output_schemas or _has_computed_fields(field))
         else "validation"
     )
+    field_alias = (
# ... [142 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [28/129] `fastapi_14303` — 🐛 Fix parsing extra `Form` parameter list

- **Repository & Baseline**: `fastapi/fastapi` @ `740ec2787b25` (`2025-12-02`) | **Prompt Length**: `2644` chars | **Complexity**: `T2-Surgical (6-25L)` (`+6 / -2` across `1` file(s))
- **Production Files Modified**: `fastapi/dependencies/utils.py`
- **Hidden Grading Test Files**: `tests/test_forms_single_model.py` (`+47 / -0` test lines)
- **Active Traps**: `TRAP-4`, `TRAP-8` | **Assigned BCF Card**: `DC-03 (MultiDict getlist Extra Parameter Preservation)`
- **Level 1 — Observable Symptom**: Submitting multiple form values for an undeclared field (`data={'param': '1', 'param2': ['456', '789']}`) to a `Form()` Pydantic model with `extra='allow'` silently discards earlier list elements, keeping only `'789'`.
- **Level 2 — Code-Level Defect**: In `fastapi/dependencies/utils.py:_extract_form_body()`, extra form keys were collected via `for key, value in received_body.items(): values[key] = value`, losing multi-value entries in Starlette `FormData`.
- **Level 3 — Architectural Root Cause**: Same `ImmutableMultiDict` / `FormData` `.items()` scalar-collapse semantics as #14356, occurring in the multipart/urlencoded form body extraction path.
- **Actionable Fix & BCF Brain Insight**: Iterating `received_body.keys()` for `key not in field_aliases` and calling `received_body.getlist(key)` (scalarizing when `len == 1`) preserves repeated extra form fields.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/dependencies/utils.py
+++ b/fastapi/dependencies/utils.py
@@ -903,9 +903,13 @@ async def process_fn(
         if value is not None:
             values[field.alias] = value
     field_aliases = {field.alias for field in body_fields}
-    for key, value in received_body.items():
+    for key in received_body.keys():
         if key not in field_aliases:
-            values[key] = value
+            param_values = received_body.getlist(key)
+            if len(param_values) == 1:
+                values[key] = param_values[0]
+            else:
+                values[key] = param_values
     return values
```
</details>

##### [29/129] `fastapi_13537` — 🐛 Fix support for form values with empty strings interpreted as missing (`None` if that's the default), for compatibility with HTML forms

- **Repository & Baseline**: `fastapi/fastapi` @ `3b4b5ab8c819` (`2025-12-02`) | **Prompt Length**: `1649` chars | **Complexity**: `T1-Micro (1-5L)` (`+2 / -1` across `1` file(s))
- **Production Files Modified**: `fastapi/dependencies/utils.py`
- **Hidden Grading Test Files**: `tests/test_form_default.py` (`+35 / -0` test lines)
- **Active Traps**: `TRAP-4`, `TRAP-6` | **Assigned BCF Card**: `DC-03 (Sentinel Presence vs None Value Disambiguation)`
- **Level 1 — Observable Symptom**: Submitting an HTML form with an empty string `age=""` for `age: Annotated[Optional[int], Form()] = None` raises a 422 integer-parsing error instead of treating `""` as missing (`None`).
- **Level 2 — Code-Level Defect**: In `fastapi/dependencies/utils.py:_extract_form_body()`, `_get_multidict_value` mapped `""` to the default `None`, which `if value is not None:` skipped adding to `values`; then the extra-fields loop checked `if key not in values:` and stuffed the raw `""` right back into `values['age']`!
- **Level 3 — Architectural Root Cause**: Conflating 'field was not declared on the model' with 'field resolved to `None` so it was omitted from `values`' during the extra-form-fields pass introduced in PR #12134.
- **Actionable Fix & BCF Brain Insight**: Computing `field_aliases = {field.alias for field in body_fields}` and checking `if key not in field_aliases:` prevents declared optional fields from being re-populated with raw empty strings.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/dependencies/utils.py
+++ b/fastapi/dependencies/utils.py
@@ -902,8 +902,9 @@ async def process_fn(
             value = serialize_sequence_value(field=field, value=results)
         if value is not None:
             values[field.alias] = value
+    field_aliases = {field.alias for field in body_fields}
     for key, value in received_body.items():
-        if key not in values:
+        if key not in field_aliases:
             values[key] = value
     return values
```
</details>

##### [30/129] `fastapi_11194` — 🐛 Fix validation error when `File` is declared after `Form` parameter

- **Repository & Baseline**: `fastapi/fastapi` @ `a7f2dbe976bf` (`2025-09-20`) | **Prompt Length**: `615` chars | **Complexity**: `T2-Surgical (6-25L)` (`+3 / -4` across `1` file(s))
- **Production Files Modified**: `fastapi/dependencies/utils.py`
- **Hidden Grading Test Files**: `tests/test_file_and_form_order_issue_9116.py` (`+90 / -0` test lines)
- **Active Traps**: `TRAP-4` | **Assigned BCF Card**: `DC-03 (Per-Field Loop Invariant Check)`
- **Level 1 — Observable Symptom**: Declaring `city: str = Form()` *before* `file: bytes = File()` in an endpoint signature returns HTTP 422 (`bytes_type` error receiving `UploadFile`), whereas declaring `file` first succeeds!
- **Level 2 — Code-Level Defect**: In `fastapi/dependencies/utils.py:_extract_form_body()`, `first_field_info = body_fields[0].field_info` was hoisted outside `for field in body_fields:` and checked via `isinstance(first_field_info, params.File)` for *every* field in the loop!
- **Level 3 — Architectural Root Cause**: Copy-paste variable scoping bug from single-field body handling into the multi-field form loop, tying `await value.read()` byte extraction of every field to whether parameter #0 happened to be a `File`.
- **Actionable Fix & BCF Brain Insight**: Replacing `first_field_info` inside the loop with `field_info = field.field_info` makes `Form` and `File` parameter ordering completely commutative.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/dependencies/utils.py
+++ b/fastapi/dependencies/utils.py
@@ -872,20 +872,19 @@ async def _extract_form_body(
     received_body: FormData,
 ) -> Dict[str, Any]:
     values = {}
-    first_field = body_fields[0]
-    first_field_info = first_field.field_info
 
     for field in body_fields:
         value = _get_multidict_value(field, received_body)
+        field_info = field.field_info
         if (
-            isinstance(first_field_info, params.File)
+            isinstance(field_info, params.File)
             and is_bytes_field(field)
             and isinstance(value, UploadFile)
         ):
             value = await value.read()
         elif (
             is_bytes_sequence_field(field)
-            and isinstance(first_field_info, params.File)
+            and isinstance(field_info, params.File)
             and value_is_sequence(value)
         ):
             # For types
```
</details>

#### SUB-2B: OpenAPI 3.1 JSON Schema Generation, `$ref` Guards, Computed Fields & `ConfigDict` (8 Tasks)

##### [31/129] `fastapi_14349` — 🐛 Fix handling of JSON Schema attributes named "$ref"

- **Repository & Baseline**: `fastapi/fastapi` @ `eaf611f9ee56` (`2025-11-13`) | **Prompt Length**: `169` chars | **Complexity**: `T2-Surgical (6-25L)` (`+6 / -6` across `1` file(s))
- **Production Files Modified**: `fastapi/_compat/v2.py`
- **Hidden Grading Test Files**: `tests/test_schema_ref_pydantic_v2.py` (`+72 / -0` test lines)
- **Active Traps**: `TRAP-5`, `TRAP-8` | **Assigned BCF Card**: `DC-12 (JSON Schema Type Guard on Reserved Keys)`
- **Level 1 — Observable Symptom**: Defining a Pydantic v2 model field with `validation_alias='$ref'` or `serialization_alias='$ref'` crashes `/openapi.json` schema generation with `AttributeError: 'dict' object has no attribute 'split'`.
- **Level 2 — Code-Level Defect**: In `fastapi/_compat/v2.py:_replace_refs()`, `if key == '$ref':` assumed `schema['$ref']` is always a JSON Reference string (`'#/components/schemas/...'`), but inside a model's `properties` dictionary, `properties['$ref']` is a nested property schema `dict` (`{'title': '$Ref', 'type': 'string'}`).
- **Level 3 — Architectural Root Cause**: Structural ambiguity in JSON Schema traversal: `"$ref"` is both a reserved JSON Reference pointer keyword (string value) and a legal object property name inside `"properties"` (dict value).
- **Actionable Fix & BCF Brain Insight**: Guarding `if isinstance(value, str):` when `key == '$ref'` (and letting dict-valued `properties['$ref']` recurse or remain intact) prevents `.split('/')` crashes on `$ref`-named fields.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/_compat/v2.py
+++ b/fastapi/_compat/v2.py
@@ -262,12 +262,12 @@ def _replace_refs(
     new_schema = deepcopy(schema)
     for key, value in new_schema.items():
         if key == "$ref":
-            ref_name = schema["$ref"].split("/")[-1]
-            if ref_name in old_name_to_new_name_map:
-                new_name = old_name_to_new_name_map[ref_name]
-                new_schema["$ref"] = REF_TEMPLATE.format(model=new_name)
-            else:
-                new_schema["$ref"] = schema["$ref"]
+            value = schema["$ref"]
+            if isinstance(value, str):
+                ref_name = schema["$ref"].split("/")[-1]
+                if ref_name in old_name_to_new_name_map:
+                    new_name = old_name_to_new_name_map[ref_name]
+                    new_schema["$ref"] = REF_TEMPLATE.format(model=new_name)
             continue
         if isinstance(value, dict):
             new_schema[key] = _replace_refs(
```
</details>

##### [32/129] `fastapi_14482` — 🐛 Fix handling arbitrary types when using `arbitrary_types_allowed=True`

- **Repository & Baseline**: `fastapi/fastapi` @ `71a17b5932e3` (`2025-12-10`) | **Prompt Length**: `262` chars | **Complexity**: `T3-Moderate (26-80L)` (`+25 / -7` across `1` file(s))
- **Production Files Modified**: `fastapi/_compat/v2.py`
- **Hidden Grading Test Files**: `tests/test_arbitrary_types.py` (`+141 / -0` test lines)
- **Active Traps**: `TRAP-8` | **Assigned BCF Card**: `DC-03 (ConfigDict Propagation to TypeAdapter)`
- **Level 1 — Observable Symptom**: Pydantic v2 models configured with `model_config = ConfigDict(arbitrary_types_allowed=True)` containing custom non-Pydantic types (e.g., `FakeNumpyArray` with `PlainSerializer`/`WithJsonSchema`) raise `PydanticSchemaGenerationError` when used in FastAPI endpoints.
- **Level 2 — Code-Level Defect**: In `fastapi/_compat/v2.py`, `get_model_fields()` instantiated `ModelField(field_info=field_info, name=name)` without passing `model.model_config`, so `ModelField.__post_init__` created `TypeAdapter(...)` with `config=None` (disabling `arbitrary_types_allowed`).
- **Level 3 — Architectural Root Cause**: In Pydantic v2, `TypeAdapter` raises a `ConfigError` if `config` is passed when the target type itself is already a `BaseModel`, `TypedDict`, or `dataclass`, but *requires* `config=model.model_config` when wrapping bare/arbitrary field types!
- **Actionable Fix & BCF Brain Insight**: Adding `config: ConfigDict | None = None` to `ModelField` and passing `model.model_config` only when `type_` is not a `(BaseModel, dict)` or `dataclass` satisfies Pydantic v2's strict `TypeAdapter` config rules.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/_compat/v2.py
+++ b/fastapi/_compat/v2.py
@@ -1,7 +1,7 @@
 import re
 import warnings
 from copy import copy, deepcopy
-from dataclasses import dataclass
+from dataclasses import dataclass, is_dataclass
 from enum import Enum
 from typing import (
     Any,
@@ -18,7 +18,7 @@
 from fastapi._compat import may_v1, shared
 from fastapi.openapi.constants import REF_TEMPLATE
 from fastapi.types import IncEx, ModelNameMap, UnionType
-from pydantic import BaseModel, TypeAdapter, create_model
+from pydantic import BaseModel, ConfigDict, TypeAdapter, create_model
 from pydantic import PydanticSchemaGenerationError as PydanticSchemaGenerationError
 from pydantic import PydanticUndefinedAnnotation as PydanticUndefinedAnnotation
 from pydantic import ValidationError as ValidationError
@@ -64,6 +64,7 @@ class ModelField:
     field_info: FieldInfo
     name: str
     mode: Literal["validation", "serialization"] = "validation"
+    config: Union[ConfigDict, None] = None
 
# ... [44 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [33/129] `fastapi_14361` — 🐛 Avoid accessing non-existing "$ref" key for Pydantic v2 compat remapping

- **Repository & Baseline**: `fastapi/fastapi` @ `5265c4f5cb4d` (`2025-12-02`) | **Prompt Length**: `96` chars | **Complexity**: `T1-Micro (1-5L)` (`+1 / -1` across `1` file(s))
- **Production Files Modified**: `fastapi/_compat/v2.py`
- **Hidden Grading Test Files**: `tests/test_schema_compat_pydantic_v2.py` (`+92 / -0` test lines)
- **Active Traps**: `TRAP-5`, `TRAP-6`, `TRAP-8` | **Assigned BCF Card**: `DC-12 (JSON Schema Dict Key Guard)`
- **Level 1 — Observable Symptom**: Generating OpenAPI schemas for Pydantic v2 models containing unions of `Enum` types (e.g., `role: PlatformRole | OtherRole`) crashes with `KeyError: '$ref'` in `_remap_definitions_and_field_mappings`.
- **Level 2 — Code-Level Defect**: In `fastapi/_compat/v2.py:_remap_definitions_and_field_mappings()`, `old_name = schema['$ref'].split('/')[-1]` indexed `schema['$ref']` unconditionally whenever `model in model_name_map`, even when Pydantic v2 inlined or wrapped the schema (`anyOf` without a top-level `'$ref'`).
- **Level 3 — Architectural Root Cause**: Assuming every mapped `ModelField` produces a bare `{'$ref': '...'}` top-level schema dict, which breaks on union/inlined schemas in Pydantic v2.
- **Actionable Fix & BCF Brain Insight**: Changing the skip guard to `if model not in model_name_map or '$ref' not in schema: continue` eliminates `KeyError: '$ref'` in 1 line.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/_compat/v2.py
+++ b/fastapi/_compat/v2.py
@@ -304,7 +304,7 @@ def _remap_definitions_and_field_mappings(
     old_name_to_new_name_map = {}
     for field_key, schema in field_mapping.items():
         model = field_key[0].type_
-        if model not in model_name_map:
+        if model not in model_name_map or "$ref" not in schema:
             continue
         new_name = model_name_map[model]
         old_name = schema["$ref"].split("/")[-1]
```
</details>

##### [34/129] `fastapi_13207` — 🐛 Fix OpenAPI schema support for computed fields when using `separate_input_output_schemas=False`

- **Repository & Baseline**: `fastapi/fastapi` @ `5126e099bdda` (`2025-12-02`) | **Prompt Length**: `354` chars | **Complexity**: `T2-Surgical (6-25L)` (`+12 / -2` across `1` file(s))
- **Production Files Modified**: `fastapi/_compat/v2.py`
- **Hidden Grading Test Files**: `tests/test_computed_fields.py` (`+5 / -2` test lines)
- **Active Traps**: `TRAP-1` | **Assigned BCF Card**: `DC-03 (Validation vs Serialization Schema Mode)`
- **Level 1 — Observable Symptom**: Setting `FastAPI(separate_input_output_schemas=False)` silently drops all Pydantic v2 `@computed_field` properties from response model schemas in `/openapi.json`.
- **Level 2 — Code-Level Defect**: In `fastapi/_compat/v2.py`, `get_schema_from_model_field` and `get_definitions` forced `override_mode = None if separate_input_output_schemas else 'validation'`, and Pydantic v2 omits `@computed_field`s in `'validation'` JSON Schema mode because computed fields are output-only.
- **Level 3 — Architectural Root Cause**: Mode-coalescing optimization (`override_mode='validation'`) ignored that models with `computed_fields` in `core_schema` inherently have asymmetric validation vs serialization shapes.
- **Actionable Fix & BCF Brain Insight**: Inspecting `field._type_adapter.core_schema.get('schema', {}).get('computed_fields', [])` and keeping `override_mode = None` whenever computed fields exist preserves `@computed_field` in OpenAPI output schemas.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/_compat/v2.py
+++ b/fastapi/_compat/v2.py
@@ -180,8 +180,13 @@ def get_schema_from_model_field(
     ],
     separate_input_output_schemas: bool = True,
 ) -> Dict[str, Any]:
+    computed_fields = field._type_adapter.core_schema.get("schema", {}).get(
+        "computed_fields", []
+    )
     override_mode: Union[Literal["validation"], None] = (
-        None if separate_input_output_schemas else "validation"
+        None
+        if (separate_input_output_schemas or len(computed_fields) > 0)
+        else "validation"
     )
     # This expects that GenerateJsonSchema was already used to generate the definitions
     json_schema = field_mapping[(field, override_mode or field.mode)]
@@ -203,9 +208,14 @@ def get_definitions(
     Dict[Tuple[ModelField, Literal["validation", "serialization"]], JsonSchemaValue],
     Dict[str, Dict[str, Any]],
 ]:
+    has_computed_fields: bool = any(
+        field._type_adapter.core_schema.get("schema", {}).get("computed_fields", [])
+        for field in fields
+    )
+
# ... [7 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [35/129] `fastapi_14246` — 🐛 Fix separation of schemas with nested models introduced in 0.119.0

- **Repository & Baseline**: `fastapi/fastapi` @ `7132a690461c` (`2025-10-29`) | **Prompt Length**: `273` chars | **Complexity**: `T3-Moderate (26-80L)` (`+24 / -4` across `1` file(s))
- **Production Files Modified**: `fastapi/_compat/v2.py`
- **Hidden Grading Test Files**: `tests/test_no_schema_split.py`, `tests/test_pydantic_v1_v2_multifile/test_multifile.py` (`+205 / -13` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-8` | **Assigned BCF Card**: `DC-03 (Validation vs Serialization Schema Mode)`
- **Level 1 — Observable Symptom**: Nested Pydantic models with default values produce split `-Input` / `-Output` OpenAPI schemas unexpectedly (or fail lookup) even when only used in serialization or when `separate_input_output_schemas` interacts with nested sub-models.
- **Level 2 — Code-Level Defect**: In `fastapi/_compat/v2.py:get_definitions()`, `flat_model_fields` constructed every discovered nested sub-model with default `mode='validation'`, even if that sub-model was only reachable from `serialization` response fields!
- **Level 3 — Architectural Root Cause**: Regression from FastAPI 0.119.0 where flattening `fields` erased the parent field's `mode` (`'validation'` vs `'serialization'`) when synthesizing `ModelField` wrappers for nested models.
- **Actionable Fix & BCF Brain Insight**: Partitioning `validation_fields` and `serialization_fields` first and creating `flat_validation_model_fields` (`mode='validation'`) and `flat_serialization_model_fields` (`mode='serialization'`) preserves directional schema modes.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/_compat/v2.py
+++ b/fastapi/_compat/v2.py
@@ -207,11 +207,31 @@ def get_definitions(
     override_mode: Union[Literal["validation"], None] = (
         None if separate_input_output_schemas else "validation"
     )
-    flat_models = get_flat_models_from_fields(fields, known_models=set())
-    flat_model_fields = [
-        ModelField(field_info=FieldInfo(annotation=model), name=model.__name__)
-        for model in flat_models
+    validation_fields = [field for field in fields if field.mode == "validation"]
+    serialization_fields = [field for field in fields if field.mode == "serialization"]
+    flat_validation_models = get_flat_models_from_fields(
+        validation_fields, known_models=set()
+    )
+    flat_serialization_models = get_flat_models_from_fields(
+        serialization_fields, known_models=set()
+    )
+    flat_validation_model_fields = [
+        ModelField(
+            field_info=FieldInfo(annotation=model),
+            name=model.__name__,
+            mode="validation",
+        )
+        for model in flat_validation_models
+    ]
# ... [12 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [36/129] `fastapi_13713` — ✨ Add OpenAPI `external_docs` parameter to `FastAPI`

- **Repository & Baseline**: `fastapi/fastapi` @ `5c1f87c56387` (`2025-09-20`) | **Prompt Length**: `756` chars | **Complexity**: `T3-Moderate (26-80L)` (`+31 / -0` across `2` file(s))
- **Production Files Modified**: `fastapi/applications.py`, `fastapi/openapi/utils.py`
- **Hidden Grading Test Files**: `tests/main.py`, `tests/test_application.py` (`+10 / -1` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-2` | **Assigned BCF Card**: `DC-03 (End-to-End Parameter Plumbing)`
- **Level 1 — Observable Symptom**: `FastAPI(...)` constructor lacks an `openapi_external_docs` parameter to populate the root-level `externalDocs` object in the generated OpenAPI 3.1 specification.
- **Level 2 — Code-Level Defect**: While `fastapi.openapi.models.OpenAPI` already supported `externalDocs`, neither `FastAPI.__init__`, `FastAPI.openapi()`, nor `get_openapi()` accepted or forwarded `openapi_external_docs` / `external_docs`.
- **Level 3 — Architectural Root Cause**: Incomplete parameter plumbing between the underlying OpenAPI Pydantic schema model (`OpenAPI.externalDocs`) and the high-level `FastAPI` application constructor.
- **Actionable Fix & BCF Brain Insight**: Adding `openapi_external_docs: Optional[Dict[str, Any]] = None` on `FastAPI.__init__`, storing `self.openapi_external_docs`, and passing `external_docs` into `get_openapi()` populates `output['externalDocs']` cleanly.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/applications.py
+++ b/fastapi/applications.py
@@ -810,6 +810,32 @@ class Item(BaseModel):
                 """
             ),
         ] = True,
+        openapi_external_docs: Annotated[
+            Optional[Dict[str, Any]],
+            Doc(
+                """
+                This field allows you to provide additional external documentation links.
+                If provided, it must be a dictionary containing:
+
+                * `description`: A brief description of the external documentation.
+                * `url`: The URL pointing to the external documentation. The value **MUST**
+                be a valid URL format.
+
+                **Example**:
+
+                ```python
+                from fastapi import FastAPI
+
+                external_docs = {
+                    "description": "Detailed API Reference",
+                    "url": "https://example.com/api-docs",
+                }
# ... [42 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [37/129] `fastapi_14791` — 🐛 Update `ValidationError` schema to include `input` and `ctx`

- **Repository & Baseline**: `fastapi/fastapi` @ `08924400c2c7` (`2026-02-04`) | **Prompt Length**: `591` chars | **Complexity**: `T1-Micro (1-5L)` (`+2 / -0` across `1` file(s))
- **Production Files Modified**: `fastapi/openapi/utils.py`
- **Hidden Grading Test Files**: `tests/test_additional_properties.py`, `tests/test_additional_properties_bool.py`, `tests/test_additional_responses_custom_model_in_callback.py`, `tests/test_additional_responses_default_validationerror.py`, `tests/test_annotated.py`, ... (+24 more) (`+72 / -0` test lines)
- **Active Traps**: `TRAP-6` | **Assigned BCF Card**: `DC-14 (Module-Level Schema Constant Update)`
- **Level 1 — Observable Symptom**: FastAPI's generated OpenAPI `ValidationError` component schema omits the `input` and `ctx` properties that Pydantic v2 actually returns in HTTP 422 validation error payloads.
- **Level 2 — Code-Level Defect**: In `fastapi/openapi/utils.py`, the module-level dict `validation_error_definition` still reflected Pydantic v1's 3-field schema (`loc`, `msg`, `type`), omitting `"input": {"title": "Input"}` and `"ctx": {"title": "Context", "type": "object"}`.
- **Level 3 — Architectural Root Cause**: Static OpenAPI constant dict in `fastapi/openapi/utils.py` was not updated when FastAPI migrated runtime validation error serialization to Pydantic v2 (Trap-6: module-level dict is invisible to AST call-graph tools!).
- **Actionable Fix & BCF Brain Insight**: Adding `'input'` and `'ctx'` to `validation_error_definition['properties']` updates all OpenAPI schemas across 29 snapshot test files in 2 lines.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/openapi/utils.py
+++ b/fastapi/openapi/utils.py
@@ -49,6 +49,8 @@
         },
         "msg": {"title": "Message", "type": "string"},
         "type": {"title": "Error Type", "type": "string"},
+        "input": {"title": "Input"},
+        "ctx": {"title": "Context", "type": "object"},
     },
     "required": ["loc", "msg", "type"],
 }
```
</details>

##### [38/129] `fastapi_14953` — ♻️ Fix JSON Schema for bytes, use `"contentMediaType": "application/octet-stream"` instead of `"format": "binary"`

- **Repository & Baseline**: `fastapi/fastapi` @ `d2c17b603d2f` (`2026-02-21`) | **Prompt Length**: `1775` chars | **Complexity**: `T4-Arch (>80L)` (`+102 / -2` across `4` file(s))
- **Production Files Modified**: `docs_src/json_base64_bytes/tutorial001_py310.py`, `fastapi/_compat/v2.py`, `fastapi/datastructures.py`, `scripts/playwright/json_base64_bytes/image01.py`
- **Hidden Grading Test Files**: `tests/test_request_params/test_file/test_list.py`, `tests/test_request_params/test_file/test_optional.py`, `tests/test_request_params/test_file/test_optional_list.py`, `tests/test_request_params/test_file/test_required.py`, `tests/test_tutorial/test_json_base64_bytes/test_tutorial001.py`, ... (+6 more) (`+303 / -28` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-2`, `TRAP-8` | **Assigned BCF Card**: `DC-15 (OpenAPI 3.1 JSON Schema + docs_src Sync)`
- **Level 1 — Observable Symptom**: `bytes` and `UploadFile` fields emit legacy OpenAPI 3.0 `{"type": "string", "format": "binary"}` instead of OpenAPI 3.1 / JSON Schema Draft-07 `{"type": "string", "contentMediaType": "application/octet-stream"}` (or `contentEncoding: base64` when `val_json_bytes`/`ser_json_bytes` is `'base64'`).
- **Level 2 — Code-Level Defect**: In `fastapi/datastructures.py` (`UploadFile.__get_pydantic_json_schema__`) and Pydantic v2's default `GenerateJsonSchema.bytes_schema`, `bytes` schemas hardcoded `'format': 'binary'`.
- **Level 3 — Architectural Root Cause**: Specification drift between OpenAPI 3.0.3 (`format: binary`) and OpenAPI 3.1.0 (which aligns with JSON Schema 2020-12 / Draft-07 `contentMediaType` and `contentEncoding`).
- **Actionable Fix & BCF Brain Insight**: Subclassing `_GenerateJsonSchema` in `fastapi/_compat/v2.py` to override `bytes_schema` (inspecting `ser_json_bytes`/`val_json_bytes` for `'base64'`), updating `UploadFile`, and adding `docs_src/json_base64_bytes/tutorial001_py310.py` aligns FastAPI with OpenAPI 3.1 (Trap-1 + Trap-2).

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/docs_src/json_base64_bytes/tutorial001_py310.py
+++ b/docs_src/json_base64_bytes/tutorial001_py310.py
@@ -0,0 +1,46 @@
+from fastapi import FastAPI
+from pydantic import BaseModel
+
+
+class DataInput(BaseModel):
+    description: str
+    data: bytes
+
+    model_config = {"val_json_bytes": "base64"}
+
+
+class DataOutput(BaseModel):
+    description: str
+    data: bytes
+
+    model_config = {"ser_json_bytes": "base64"}
+
+
+class DataInputOutput(BaseModel):
+    description: str
+    data: bytes
+
+    model_config = {
# ... [109 additional diff lines omitted for brevity; full file list above] ...
```
</details>

#### SUB-2C: Rust `TypeAdapter` Serialization Fast-Path, Deprecation Warnings & Pydantic v1 Migration (6 Tasks)

##### [39/129] `fastapi_14962` — ✨ Serialize JSON response with Pydantic (in Rust), when there's a Pydantic return type or response model

- **Repository & Baseline**: `fastapi/fastapi` @ `1e78a36b7310` (`2026-02-22`) | **Prompt Length**: `210` chars | **Complexity**: `T3-Moderate (26-80L)` (`+49 / -6` across `3` file(s))
- **Production Files Modified**: `docs_src/custom_response/tutorial010_py310.py`, `fastapi/_compat/v2.py`, `fastapi/routing.py`
- **Hidden Grading Test Files**: `tests/test_dump_json_fast_path.py`, `tests/test_tutorial/test_custom_response/test_tutorial001.py`, `tests/test_tutorial/test_custom_response/test_tutorial010.py` (`+101 / -1` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-2`, `TRAP-4`, `TRAP-5`, `TRAP-8` | **Assigned BCF Card**: `DC-15 (Rust Fast-Path + Tutorial Sync)`
- **Level 1 — Observable Symptom**: Endpoints with a Pydantic `response_model` or return type needlessly convert validated objects to Python `dict`s via `dump_python(mode='json')` and re-serialize them in pure Python via `json.dumps()` inside `JSONResponse`.
- **Level 2 — Code-Level Defect**: In `fastapi/_compat/v2.py` and `fastapi/routing.py`, `serialize_response` always returned Python primitives rather than invoking `TypeAdapter.dump_json()` (implemented in Rust `pydantic-core`) to emit UTF-8 JSON `bytes` in a single pass.
- **Level 3 — Architectural Root Cause**: Legacy two-stage serialization pipeline inherited from Pydantic v1 (`jsonable_encoder` -> `JSONResponse.render`), before `pydantic-core` exposed direct Rust-to-bytes `dump_json()`.
- **Actionable Fix & BCF Brain Insight**: Adding `ModelField.serialize_json()`, `dump_json: bool = False` on `serialize_response`, returning `Response(content=content, media_type='application/json')` when default `JSONResponse` is active, and updating `docs_src/custom_response/tutorial010_py310.py` delivers 2x+ JSON throughput (Trap-2).

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/docs_src/custom_response/tutorial010_py310.py
+++ b/docs_src/custom_response/tutorial010_py310.py
@@ -1,9 +1,9 @@
 from fastapi import FastAPI
-from fastapi.responses import ORJSONResponse
+from fastapi.responses import HTMLResponse
 
-app = FastAPI(default_response_class=ORJSONResponse)
+app = FastAPI(default_response_class=HTMLResponse)
 
 
 @app.get("/items/")
 async def read_items():
-    return [{"item_id": "Foo"}]
+    return "<h1>Items</h1><p>This is a list of items.</p>"
--- a/fastapi/_compat/v2.py
+++ b/fastapi/_compat/v2.py
@@ -199,6 +199,32 @@ def serialize(
             exclude_none=exclude_none,
         )
 
+    def serialize_json(
+        self,
+        value: Any,
+        *,
+        include: IncEx | None = None,
# ... [78 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [40/129] `fastapi_14964` — 🗑️ Deprecate `ORJSONResponse` and `UJSONResponse`

- **Repository & Baseline**: `fastapi/fastapi` @ `bc06e4296d58` (`2026-02-22`) | **Prompt Length**: `370` chars | **Complexity**: `T3-Moderate (26-80L)` (`+44 / -8` across `1` file(s))
- **Production Files Modified**: `fastapi/responses.py`
- **Hidden Grading Test Files**: `tests/test_deprecated_responses.py`, `tests/test_orjson_response_class.py`, `tests/test_tutorial/test_custom_response/test_tutorial001.py`, `tests/test_tutorial/test_custom_response/test_tutorial001b.py` (`+94 / -4` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-8` | **Assigned BCF Card**: `DC-11 (Non-Destructive `@deprecated` Decorator)`
- **Level 1 — Observable Symptom**: Following Rust Pydantic JSON serialization (#14962), `ORJSONResponse` and `UJSONResponse` need formal deprecation warnings (`FastAPIDeprecationWarning`) and `@typing_extensions.deprecated` type-checker markers without breaking existing apps.
- **Level 2 — Code-Level Defect**: `fastapi/responses.py` exposed `UJSONResponse` and `ORJSONResponse` without `@deprecated(..., category=FastAPIDeprecationWarning, stacklevel=2)` decorators.
- **Level 3 — Architectural Root Cause**: Ecosystem transition away from third-party C/Rust JSON response subclasses once `pydantic-core` native Rust byte serialization became FastAPI's default path.
- **Actionable Fix & BCF Brain Insight**: Decorating both classes with `@deprecated(..., category=FastAPIDeprecationWarning, stacklevel=2)` emits runtime warnings on instantiation while keeping both classes functional (Trap-1 warning filters in tests).

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/responses.py
+++ b/fastapi/responses.py
@@ -1,12 +1,14 @@
 from typing import Any
 
+from fastapi.exceptions import FastAPIDeprecationWarning
 from starlette.responses import FileResponse as FileResponse  # noqa
 from starlette.responses import HTMLResponse as HTMLResponse  # noqa
 from starlette.responses import JSONResponse as JSONResponse  # noqa
 from starlette.responses import PlainTextResponse as PlainTextResponse  # noqa
 from starlette.responses import RedirectResponse as RedirectResponse  # noqa
 from starlette.responses import Response as Response  # noqa
 from starlette.responses import StreamingResponse as StreamingResponse  # noqa
+from typing_extensions import deprecated
 
 try:
     import ujson
@@ -20,25 +22,59 @@
     orjson = None  # type: ignore
 
 
+@deprecated(
+    "UJSONResponse is deprecated, FastAPI now serializes data directly to JSON "
+    "bytes via Pydantic when a return type or response model is set, which is "
+    "faster and doesn't need a custom response class. Read more in the FastAPI "
+    "docs: https://fastapi.tiangolo.com/advanced/custom-response/#orjson-or-response-model "
# ... [59 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [41/129] `fastapi_14609` — ➖ Drop support for `pydantic.v1`

- **Repository & Baseline**: `fastapi/fastapi` @ `1b3bea8b6be2` (`2025-12-27`) | **Prompt Length**: `144` chars | **Complexity**: `T4-Arch (>80L)` (`+192 / -1855` across `20` file(s))
- **Production Files Modified**: `docs_src/request_form_models/tutorial002_pv1_an_py39.py`, `docs_src/request_form_models/tutorial002_pv1_py39.py`, `fastapi/_compat/__init__.py`, `fastapi/_compat/main.py`, `fastapi/_compat/may_v1.py`, `fastapi/_compat/model_field.py`, `fastapi/_compat/shared.py`, `fastapi/_compat/v1.py`, ... (+12 more; 20 total)
- **Hidden Grading Test Files**: `tests/test_compat.py`, `tests/test_compat_params_v1.py`, `tests/test_datetime_custom_encoder.py`, `tests/test_filter_pydantic_sub_model/app_pv1.py`, `tests/test_filter_pydantic_sub_model/test_filter_pydantic_sub_model_pv1.py`, ... (+3 more) (`+32 / -1475` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-2`, `TRAP-4`, `TRAP-5`, `TRAP-7`, `TRAP-8` | **Assigned BCF Card**: `DC-13 (Coordinated Multi-File Heredoc Refactor)`
- **Level 1 — Observable Symptom**: FastAPI drops legacy `pydantic.v1` support across the entire codebase (20 files, `-1,855` lines) and must raise an explicit error when a `pydantic.v1` model is passed.
- **Level 2 — Code-Level Defect**: 20 modules across `fastapi/_compat/`, `dependencies/`, `encoders.py`, `openapi/`, `params.py`, `routing.py`, and `docs_src/` carried dual v1/v2 branching (`v1.py`, `may_v1.py`, `temp_pydantic_v1_params.py`).
- **Level 3 — Architectural Root Cause**: Planned major-lifecycle removal of Pydantic v1 compatibility layer once Python 3.14 and Pydantic 2.12 deprecated v1.
- **Actionable Fix & BCF Brain Insight**: Collapsing `fastapi/_compat` to pure v2, deleting v1 modules/tutorials, and raising an explicit error on `pydantic.v1` models removes 1,855 lines across 20 files (Trap-1: visible v1 tests fail locally until `test_patch` removes 1,475 lines of v1 tests!).

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/docs_src/request_form_models/tutorial002_pv1_an_py39.py
+++ b/docs_src/request_form_models/tutorial002_pv1_an_py39.py
@@ -1,20 +0,0 @@
-from typing import Annotated
-
-from fastapi import FastAPI
-from fastapi.temp_pydantic_v1_params import Form
-from pydantic.v1 import BaseModel
-
-app = FastAPI()
-
-
-class FormData(BaseModel):
-    username: str
-    password: str
-
-    class Config:
-        extra = "forbid"
-
-
-@app.post("/login/")
-async def login(data: Annotated[FormData, Form()]):
-    return data
--- a/docs_src/request_form_models/tutorial002_pv1_py39.py
+++ b/docs_src/request_form_models/tutorial002_pv1_py39.py
@@ -1,18 +0,0 @@
# ... [2788 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [42/129] `fastapi_14186` — 🐛 Fix internal Pydantic v1 compatibility (warnings) for Python 3.14 and Pydantic 2.12.1

- **Repository & Baseline**: `fastapi/fastapi` @ `6e49dc029541` (`2025-10-20`) | **Prompt Length**: `1009` chars | **Complexity**: `T4-Arch (>80L)` (`+266 / -98` across `10` file(s))
- **Production Files Modified**: `fastapi/_compat/__init__.py`, `fastapi/_compat/main.py`, `fastapi/_compat/may_v1.py`, `fastapi/_compat/shared.py`, `fastapi/_compat/v1.py`, `fastapi/_compat/v2.py`, `fastapi/dependencies/utils.py`, `fastapi/encoders.py`, ... (+2 more; 10 total)
- **Hidden Grading Test Files**: `tests/test_compat.py`, `tests/test_get_model_definitions_formfeed_escape.py`, `tests/test_response_model_as_return_annotation.py` (`+17 / -4` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-2`, `TRAP-7`, `TRAP-8` | **Assigned BCF Card**: `DC-16 (Sandbox Skip-Trap Awareness & Lazy Compat Shim)`
- **Level 1 — Observable Symptom**: Importing `fastapi` on Python 3.14 with Pydantic 2.12.1+ triggers `PydanticDeprecationWarning` or failures because `fastapi/_compat` eagerly imported `pydantic.v1` symbols even when an app only used Pydantic v2.
- **Level 2 — Code-Level Defect**: `fastapi/_compat/__init__.py` and `main.py` imported `fastapi._compat.v1` at module import time rather than routing through a Python-3.14-safe stub/lazy module (`may_v1.py`).
- **Level 3 — Architectural Root Cause**: Pydantic 2.12.0+ deprecated `pydantic.v1` on Python 3.14 and emits warnings on import; eager dual-version compatibility shims violated zero-warning startup.
- **Actionable Fix & BCF Brain Insight**: Routing `v1` checks through `fastapi/_compat/may_v1.py` isolates v1 imports. **TRAP-8 Warning**: `test_patch` adds `@needs_py_lt_314` / v1 skip decorators in `tests/test_compat.py` which can trigger skipped-test failures in strict JUnit XML verifiers.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/_compat/__init__.py
+++ b/fastapi/_compat/__init__.py
@@ -30,6 +30,10 @@
 from .main import (
     with_info_plain_validator_function as with_info_plain_validator_function,
 )
+from .may_v1 import CoreSchema as CoreSchema
+from .may_v1 import GetJsonSchemaHandler as GetJsonSchemaHandler
+from .may_v1 import JsonSchemaValue as JsonSchemaValue
+from .may_v1 import _normalize_errors as _normalize_errors
 from .model_field import ModelField as ModelField
 from .shared import PYDANTIC_V2 as PYDANTIC_V2
 from .shared import PYDANTIC_VERSION_MINOR_TUPLE as PYDANTIC_VERSION_MINOR_TUPLE
@@ -44,7 +48,3 @@
 from .shared import lenient_issubclass as lenient_issubclass
 from .shared import sequence_types as sequence_types
 from .shared import value_is_sequence as value_is_sequence
-from .v1 import CoreSchema as CoreSchema
-from .v1 import GetJsonSchemaHandler as GetJsonSchemaHandler
-from .v1 import JsonSchemaValue as JsonSchemaValue
-from .v1 import _normalize_errors as _normalize_errors
--- a/fastapi/_compat/main.py
+++ b/fastapi/_compat/main.py
@@ -1,3 +1,4 @@
+import sys
 from functools import lru_cache
# ... [749 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [43/129] `fastapi_14605` — 🔊 Add a custom `FastAPIDeprecationWarning`

- **Repository & Baseline**: `fastapi/fastapi` @ `6b53786f626d` (`2025-12-26`) | **Prompt Length**: `242` chars | **Complexity**: `T3-Moderate (26-80L)` (`+28 / -16` across `7` file(s))
- **Production Files Modified**: `fastapi/dependencies/utils.py`, `fastapi/exceptions.py`, `fastapi/openapi/utils.py`, `fastapi/params.py`, `fastapi/routing.py`, `fastapi/temp_pydantic_v1_params.py`, `fastapi/utils.py`
- **Hidden Grading Test Files**: `tests/benchmarks/test_general_performance.py`, `tests/test_compat_params_v1.py`, `tests/test_pydantic_v1_deprecation_warnings.py`, `tests/test_regex_deprecated_body.py`, `tests/test_regex_deprecated_params.py`, ... (+7 more) (`+38 / -27` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-2`, `TRAP-8` | **Assigned BCF Card**: `DC-08 (UserWarning Subclass for Visible Deprecations)`
- **Level 1 — Observable Symptom**: FastAPI's deprecation warnings (such as `pydantic.v1` usage, `regex=` parameter, `openapi_prefix`) use standard `DeprecationWarning`, which Python hides by default outside `__main__`, leaving users unaware of impending removals.
- **Level 2 — Code-Level Defect**: `fastapi/exceptions.py` lacked a `UserWarning`-derived `FastAPIDeprecationWarning` class, and 6 modules emitted ignored `DeprecationWarning`s.
- **Level 3 — Architectural Root Cause**: CPython's default warning filter suppresses `DeprecationWarning` in imported third-party libraries (PEP 565), requiring library-specific `UserWarning` subclasses when maintainers want visible migration notices.
- **Actionable Fix & BCF Brain Insight**: Defining `class FastAPIDeprecationWarning(UserWarning):` in `fastapi/exceptions.py` and replacing `DeprecationWarning` across 7 files (`dependencies/utils.py`, `openapi/utils.py`, `params.py`, `routing.py`, `temp_pydantic_v1_params.py`, `utils.py`) makes deprecations visible (Trap-1: 12 existing test files updated in `test_patch`).

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/dependencies/utils.py
+++ b/fastapi/dependencies/utils.py
@@ -51,7 +51,7 @@
     contextmanager_in_threadpool,
 )
 from fastapi.dependencies.models import Dependant
-from fastapi.exceptions import DependencyScopeError
+from fastapi.exceptions import DependencyScopeError, FastAPIDeprecationWarning
 from fastapi.logger import logger
 from fastapi.security.oauth2 import SecurityScopes
 from fastapi.types import DependencyCacheKey
@@ -327,7 +327,7 @@ def get_dependant(
             warnings.warn(
                 "pydantic.v1 is deprecated and will soon stop being supported by FastAPI."
                 f" Please update the param {param_name}: {param_details.type_annotation!r}.",
-                category=DeprecationWarning,
+                category=FastAPIDeprecationWarning,
                 stacklevel=5,
             )
         if isinstance(
--- a/fastapi/exceptions.py
+++ b/fastapi/exceptions.py
@@ -231,3 +231,10 @@ def __init__(
     ) -> None:
         super().__init__(errors, endpoint_ctx=endpoint_ctx)
         self.body = body
# ... [171 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [44/129] `fastapi_14583` — 🔊 Add deprecation warnings when using `pydantic.v1`

- **Repository & Baseline**: `fastapi/fastapi` @ `6513d4daa16a` (`2025-12-21`) | **Prompt Length**: `104` chars | **Complexity**: `T2-Surgical (6-25L)` (`+24 / -0` across `2` file(s))
- **Production Files Modified**: `fastapi/dependencies/utils.py`, `fastapi/routing.py`
- **Hidden Grading Test Files**: `tests/benchmarks/test_general_performance.py`, `tests/test_compat_params_v1.py`, `tests/test_datetime_custom_encoder.py`, `tests/test_filter_pydantic_sub_model/app_pv1.py`, `tests/test_get_model_definitions_formfeed_escape.py`, ... (+13 more) (`+778 / -602` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-2`, `TRAP-5`, `TRAP-8` | **Assigned BCF Card**: `DC-11 (Targeted Deprecation Warning Injection)`
- **Level 1 — Observable Symptom**: Using `pydantic.v1.BaseModel` classes as endpoint parameters or `response_model`s emits no warning from FastAPI prior to dropping `pydantic.v1` support.
- **Level 2 — Code-Level Defect**: `fastapi/dependencies/utils.py:get_dependant()` and `fastapi/routing.py:APIRoute.__init__()` accepted `may_v1.ModelField` and `annotation_is_pydantic_v1(...)` silently.
- **Level 3 — Architectural Root Cause**: Staged deprecation lifecycle: before removing `pydantic.v1` in #14609, FastAPI needed runtime warnings at parameter analysis and route registration boundaries.
- **Actionable Fix & BCF Brain Insight**: Emitting `warnings.warn('pydantic.v1 is deprecated...', category=DeprecationWarning, stacklevel=...)` in `get_dependant` and `APIRoute.__init__` (`response_model` and `responses`) covers all v1 entrypoints.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/dependencies/utils.py
+++ b/fastapi/dependencies/utils.py
@@ -1,6 +1,7 @@
 import dataclasses
 import inspect
 import sys
+import warnings
 from collections.abc import Coroutine, Mapping, Sequence
 from contextlib import AsyncExitStack, contextmanager
 from copy import copy, deepcopy
@@ -322,6 +323,13 @@ def get_dependant(
             )
             continue
         assert param_details.field is not None
+        if isinstance(param_details.field, may_v1.ModelField):
+            warnings.warn(
+                "pydantic.v1 is deprecated and will soon stop being supported by FastAPI."
+                f" Please update the param {param_name}: {param_details.type_annotation!r}.",
+                category=DeprecationWarning,
+                stacklevel=5,
+            )
         if isinstance(
             param_details.field.field_info, (params.Body, temp_pydantic_v1_params.Body)
         ):
--- a/fastapi/routing.py
+++ b/fastapi/routing.py
# ... [44 additional diff lines omitted for brevity; full file list above] ...
```
</details>

### CAT-3: Mutable State Isolation, Dependency Caching & Async Lifecycle Scoping (19 Tasks)

**Category Overview:** Shallow-copy aliasing and self-referential container mutation bugs, `Depends()` hashability and OAuth2 scope cache-key granularity, memoized hash invalidation, lazy import deferral, and dual `function` vs `request` `AsyncExitStack` / lifespan teardown ordering.

#### SUB-3A: Shared Mutable State Aliasing, Self-Referential Mutation & Cycle Guards (7 Tasks)

##### [45/129] `fastapi_14986` — ♻️ Refactor logic to handle OpenAPI and Swagger UI escaping data

- **Repository & Baseline**: `fastapi/fastapi` @ `2f9c914d440e` (`2026-02-24`) | **Prompt Length**: `1000` chars | **Complexity**: `T3-Moderate (26-80L)` (`+25 / -9` across `2` file(s))
- **Production Files Modified**: `fastapi/applications.py`, `fastapi/openapi/docs.py`
- **Hidden Grading Test Files**: `tests/test_openapi_cache_root_path.py`, `tests/test_swagger_ui_escape.py` (`+112 / -0` test lines)
- **Active Traps**: `TRAP-2` | **Assigned BCF Card**: `DC-09 (Immutable Per-Request Copy + HTML JSON Escaping)`
- **Level 1 — Observable Symptom**: (1) A single request with a spoofed ASGI `root_path` permanently mutates `app.servers` for all subsequent `/openapi.json` callers; (2) Swagger UI inline `<script>` JSON config lacks `<`, `>`, `&` Unicode escaping.
- **Level 2 — Code-Level Defect**: In `fastapi/applications.py:FastAPI.setup()`, `self.servers.insert(0, {'url': root_path})` mutated instance state `self.servers` in-place during request handling; in `fastapi/openapi/docs.py`, `json.dumps()` emitted raw `</script>`-unsafe characters.
- **Level 3 — Architectural Root Cause**: Request-scoped dynamic ASGI `scope['root_path']` was written back into singleton application state (`self.servers` / cached `self.openapi_schema`), creating cross-request cache poisoning.
- **Actionable Fix & BCF Brain Insight**: Copying `schema = dict(schema)` per request when prepending `root_path` to `schema['servers']` and adding `_html_safe_json()` (`\u003c`, `\u003e`, `\u0026`) fixes both state poisoning and XSS hardening.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/applications.py
+++ b/fastapi/applications.py
@@ -1101,16 +1101,18 @@ def openapi(self) -> dict[str, Any]:
 
     def setup(self) -> None:
         if self.openapi_url:
-            urls = (server_data.get("url") for server_data in self.servers)
-            server_urls = {url for url in urls if url}
 
             async def openapi(req: Request) -> JSONResponse:
                 root_path = req.scope.get("root_path", "").rstrip("/")
-                if root_path not in server_urls:
-                    if root_path and self.root_path_in_servers:
-                        self.servers.insert(0, {"url": root_path})
-                        server_urls.add(root_path)
-                return JSONResponse(self.openapi())
+                schema = self.openapi()
+                if root_path and self.root_path_in_servers:
+                    server_urls = {s.get("url") for s in schema.get("servers", [])}
+                    if root_path not in server_urls:
+                        schema = dict(schema)
+                        schema["servers"] = [{"url": root_path}] + schema.get(
+                            "servers", []
+                        )
+                return JSONResponse(schema)
 
# ... [43 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [46/129] `requests_7328` — Prevent Response self-reference in redirect history

- **Repository & Baseline**: `psf/requests` @ `cbce031327be` (`2026-04-05`) | **Prompt Length**: `580` chars | **Complexity**: `T1-Micro (1-5L)` (`+1 / -2` across `1` file(s))
- **Production Files Modified**: `src/requests/sessions.py`
- **Hidden Grading Test Files**: `tests/test_requests.py` (`+8 / -0` test lines)
- **Active Traps**: `TRAP-6`, `TRAP-8` | **Assigned BCF Card**: `DC-09 (Pre-Append Slice Snapshot)`
- **Level 1 — Observable Symptom**: During multi-hop HTTP redirects (`302 -> 302 -> 200`), intermediate `Response` objects inside `r.history` contain *themselves* inside their own `resp.history` (`resp in resp.history == True`), creating reference cycles.
- **Level 2 — Code-Level Defect**: In `src/requests/sessions.py:SessionRedirectMixin.resolve_redirects()`, `hist.append(resp)` ran *before* `resp.history = hist[1:]`, which sliced off `hist[0]` (the initial response) while leaving the just-appended `resp` at the end of `resp.history`!
- **Level 3 — Architectural Root Cause**: Off-by-one slice index (`hist[1:]` after append instead of `hist[:]` before append) rooted in a misunderstood comment about excluding the current vs original request.
- **Actionable Fix & BCF Brain Insight**: Assigning `resp.history = hist[:]` *before* `hist.append(resp)` gives hop $i$ exact history `r.history[:i]` with zero self-references (Note: `test_patch` uses `httpbin` redirect fixture).

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/src/requests/sessions.py
+++ b/src/requests/sessions.py
@@ -179,9 +179,8 @@ def resolve_redirects(
             prepared_request = req.copy()
 
             # Update history and keep track of redirects.
-            # resp.history must ignore the original request in this loop
+            resp.history = hist[:]
             hist.append(resp)
-            resp.history = hist[1:]
 
             try:
                 resp.content  # Consume socket so it can be released
```
</details>

##### [47/129] `fastapi_14258` — ✨ Show a clear error on attempt to include router into itself

- **Repository & Baseline**: `fastapi/fastapi` @ `e94028ab60d1` (`2026-02-10`) | **Prompt Length**: `418` chars | **Complexity**: `T1-Micro (1-5L)` (`+4 / -0` across `1` file(s))
- **Production Files Modified**: `fastapi/routing.py`
- **Hidden Grading Test Files**: `tests/test_router_circular_import.py` (`+12 / -0` test lines)
- **Active Traps**: `TRAP-6` | **Assigned BCF Card**: `DC-08 (Self-Inclusion Identity Assertion)`
- **Level 1 — Observable Symptom**: Accidentally calling `router.include_router(router)` hangs or crashes with an inscrutable failure as `router.routes` grows while being iterated.
- **Level 2 — Code-Level Defect**: In `fastapi/routing.py:APIRouter.include_router()`, no guard checked `self is not router` before iterating `for route in router.routes:` and appending routes onto `self.routes`.
- **Level 3 — Architectural Root Cause**: Missing object-identity precondition (`self is not router`) on recursive/self-mutating container composition.
- **Actionable Fix & BCF Brain Insight**: Adding `assert self is not router, ('Cannot include the same APIRouter instance into itself. Did you mean to include a different router?')` raises the exact `AssertionError` expected by `test_router_circular_import.py`.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/routing.py
+++ b/fastapi/routing.py
@@ -1393,6 +1393,10 @@ def read_users():
         app.include_router(internal_router)
         ```
         """
+        assert self is not router, (
+            "Cannot include the same APIRouter instance into itself. "
+            "Did you mean to include a different router?"
+        )
         if prefix:
             assert prefix.startswith("/"), "A path prefix must start with '/'"
             assert not prefix.endswith("/"), (
```
</details>

##### [48/129] `fastapi_14463` — 🐛 Fix OpenAPI duplication of `anyOf` refs for app-level responses with specified `content` and `model` as `Union`

- **Repository & Baseline**: `fastapi/fastapi` @ `f2687dc1bb01` (`2026-02-04`) | **Prompt Length**: `10095` chars | **Complexity**: `T1-Micro (1-5L)` (`+2 / -1` across `1` file(s))
- **Production Files Modified**: `fastapi/openapi/utils.py`
- **Hidden Grading Test Files**: `tests/test_additional_responses_union_duplicate_anyof.py` (`+123 / -0` test lines)
- **Active Traps**: `TRAP-6` | **Assigned BCF Card**: `DC-09 (Deepcopy Shared Mutable Schema Dicts)`
- **Level 1 — Observable Symptom**: Configuring app-level `FastAPI(responses={500: {'model': ModelA | ModelB, 'content': {'application/json': {'examples': ...}}}})` across $N$ routes causes `/openapi.json` to accumulate $N$ duplicate `$ref` entries inside `anyOf`!
- **Level 2 — Code-Level Defect**: In `fastapi/openapi/utils.py:get_openapi_path()`, `process_response = additional_response.copy()` performed a *shallow* dict copy, leaving nested `['content']['application/json']['schema']['anyOf']` lists shared across every route's `deep_dict_update` call!
- **Level 3 — Architectural Root Cause**: Classic Python shallow-copy aliasing bug (`dict.copy()`) when `deep_dict_update` mutates nested dictionaries/lists in-place across multiple iterations over a shared `app.responses` template.
- **Actionable Fix & BCF Brain Insight**: Replacing `additional_response.copy()` with `copy.deepcopy(additional_response)` (2-line diff) isolates per-route OpenAPI response dictionaries completely.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/openapi/utils.py
+++ b/fastapi/openapi/utils.py
@@ -1,3 +1,4 @@
+import copy
 import http.client
 import inspect
 import warnings
@@ -377,7 +378,7 @@ def get_openapi_path(
                     additional_status_code,
                     additional_response,
                 ) in route.responses.items():
-                    process_response = additional_response.copy()
+                    process_response = copy.deepcopy(additional_response)
                     process_response.pop("model", None)
                     status_code_key = str(additional_status_code).upper()
                     if status_code_key == "DEFAULT":
```
</details>

##### [49/129] `fastapi_5624` — 🐛 Fix hierarchical security scope propagation

- **Repository & Baseline**: `fastapi/fastapi` @ `c6487ed63205` (`2025-11-30`) | **Prompt Length**: `63` chars | **Complexity**: `T1-Micro (1-5L)` (`+3 / -1` across `1` file(s))
- **Production Files Modified**: `fastapi/dependencies/utils.py`
- **Hidden Grading Test Files**: `tests/test_security_scopes_dont_propagate.py` (`+45 / -0` test lines)
- **Active Traps**: `TRAP-5`, `TRAP-6` | **Assigned BCF Card**: `DC-09 (Non-Mutating List Concatenation on Tree Traversal)`
- **Level 1 — Observable Symptom**: When dependency `dep3` depends on both `Security(sec1, scopes=['scope1'])` and `Security(sec2, scopes=['scope2'])`, `sec2` erroneously receives `['scope1', 'scope2']` in `SecurityScopes`!
- **Level 2 — Code-Level Defect**: In `fastapi/dependencies/utils.py:get_dependant()`, `use_security_scopes = security_scopes or []` bound `use_security_scopes` to the caller's list (or reused the same list across loop iterations) and called `use_security_scopes.extend(param_details.depends.scopes)` in-place!
- **Level 3 — Architectural Root Cause**: Mutating an inherited list parameter via `.extend()` inside a `for param_name, param in signature_params.items():` tree-walk leaked sibling branch scopes horizontally and upward.
- **Actionable Fix & BCF Brain Insight**: Replacing `.extend(...)` with `use_security_scopes = use_security_scopes + list(param_details.depends.scopes)` allocates a fresh list per child branch, isolating hierarchical security scopes.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/dependencies/utils.py
+++ b/fastapi/dependencies/utils.py
@@ -278,7 +278,9 @@ def get_dependant(
             use_security_scopes = security_scopes or []
             if isinstance(param_details.depends, params.Security):
                 if param_details.depends.scopes:
-                    use_security_scopes.extend(param_details.depends.scopes)
+                    use_security_scopes = use_security_scopes + list(
+                        param_details.depends.scopes
+                    )
             sub_dependant = get_dependant(
                 path=path,
                 call=param_details.depends.dependency,
```
</details>

##### [50/129] `rich_3772` — Fix traceback recursion

- **Repository & Baseline**: `Textualize/rich` @ `2809954800af` (`2025-06-19`) | **Prompt Length**: `131` chars | **Complexity**: `T3-Moderate (26-80L)` (`+29 / -16` across `1` file(s))
- **Production Files Modified**: `rich/traceback.py`
- **Hidden Grading Test Files**: `tests/test_traceback.py` (`+24 / -0` test lines)
- **Active Traps**: `TRAP-5` | **Assigned BCF Card**: `DC-07 (Visited-Set Cycle Breaker on Exception Graphs)`
- **Level 1 — Observable Symptom**: Rendering a `rich.traceback.Traceback` for an exception with a self-referential cause/context cycle (`raise e from e`) or cyclic `ExceptionGroup` crashes with `RecursionError`.
- **Level 2 — Code-Level Defect**: In `rich/traceback.py:Traceback.extract()`, the `while True:` loop walking `__cause__`/`__context__` and recursive `Traceback.extract()` calls over `BaseExceptionGroup.exceptions` had no `visited` set to detect already-traversed exception instances.
- **Level 3 — Architectural Root Cause**: CPython permits cyclic `__cause__` and `__context__` pointers on `BaseException` instances (stdlib `traceback.TracebackException` guards this with `_seen`), which Rich's extractor omitted.
- **Actionable Fix & BCF Brain Insight**: Tracking seen exceptions in `grouped_exceptions: Set[BaseException]` (`_visited_exceptions`) across both `ExceptionGroup` recursion and `__cause__`/`__context__` chaining breaks cycles cleanly.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/traceback.py
+++ b/rich/traceback.py
@@ -14,6 +14,7 @@
     List,
     Optional,
     Sequence,
+    Set,
     Tuple,
     Type,
     Union,
@@ -418,6 +419,7 @@ def extract(
         locals_max_string: int = LOCALS_MAX_STRING,
         locals_hide_dunder: bool = True,
         locals_hide_sunder: bool = False,
+        _visited_exceptions: Optional[Set[BaseException]] = None,
     ) -> Trace:
         """Extract traceback information.
 
@@ -443,6 +445,10 @@ def extract(
 
         notes: List[str] = getattr(exc_value, "__notes__", None) or []
 
+        grouped_exceptions: Set[BaseException] = (
+            set() if _visited_exceptions is None else _visited_exceptions
+        )
+
# ... [63 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [51/129] `rich_3480` — fix infinite loop in append

- **Repository & Baseline**: `Textualize/rich` @ `9ec419154102` (`2024-09-06`) | **Prompt Length**: `81` chars | **Complexity**: `T1-Micro (1-5L)` (`+2 / -2` across `1` file(s))
- **Production Files Modified**: `rich/text.py`
- **Hidden Grading Test Files**: `tests/test_text.py` (`+11 / -0` test lines)
- **Active Traps**: `TRAP-5`, `TRAP-6` | **Assigned BCF Card**: `DC-09 (Self-Append Collection Snapshot `.copy()`)`
- **Level 1 — Observable Symptom**: Appending a styled `rich.text.Text` object to itself (`a.append(a)` or `a.append_text(a)`) hangs indefinitely in an infinite loop until `MemoryError` kills the process.
- **Level 2 — Code-Level Defect**: In `rich/text.py`, both `Text.append()` and `Text.append_text()` execute `self._spans.extend(_Span(...) for start, end, style in text._spans)`. When `text is self`, `list.extend` consumes a lazy generator iterating `self._spans` while simultaneously appending new elements to `self._spans`!
- **Level 3 — Architectural Root Cause**: Lazy generator evaluation during `list.extend()` over an aliased target list (`self._spans is text._spans`) causes CPython's list iterator to chase the growing list tail forever.
- **Actionable Fix & BCF Brain Insight**: Iterating over `text._spans.copy()` in both `append` and `append_text` snapshots the source spans before mutation in a 2-line fix.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/text.py
+++ b/rich/text.py
@@ -998,7 +998,7 @@ def append(
                 self._text.append(text.plain)
                 self._spans.extend(
                     _Span(start + text_length, end + text_length, style)
-                    for start, end, style in text._spans
+                    for start, end, style in text._spans.copy()
                 )
                 self._length += len(text)
         return self
@@ -1020,7 +1020,7 @@ def append_text(self, text: "Text") -> "Text":
         self._text.append(text.plain)
         self._spans.extend(
             _Span(start + text_length, end + text_length, style)
-            for start, end, style in text._spans
+            for start, end, style in text._spans.copy()
         )
         self._length += len(text)
         return self
```
</details>

#### SUB-3B: Depends() Hashability, OAuth2 Scope Cache Keys, Memoized Hashes & Lazy Imports (7 Tasks)

##### [52/129] `rich_4070` — perf: reduce Console and RichHandler import time by deferring unused imports

- **Repository & Baseline**: `Textualize/rich` @ `fc41075a3206` (`2026-04-11`) | **Prompt Length**: `3096` chars | **Complexity**: `T4-Arch (>80L)` (`+71 / -57` across `9` file(s))
- **Production Files Modified**: `rich/_emoji_replace.py`, `rich/console.py`, `rich/emoji.py`, `rich/logging.py`, `rich/protocol.py`, `rich/repr.py`, `rich/segment.py`, `rich/syntax.py`, ... (+1 more; 9 total)
- **Hidden Grading Test Files**: `tests/test_console.py`, `tests/test_syntax.py` (`+3 / -3` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-2` | **Assigned BCF Card**: `DC-06 (Lazy Function-Scoped Import Deferral + Trap-1 Monkeypatch Awareness)`
- **Level 1 — Observable Symptom**: `from rich.console import Console` (78ms) and `from rich.logging import RichHandler` (99ms) incur heavy startup latency by eagerly importing `_emoji_codes` (3,500+ entries), `inspect`, `pygments`, `Traceback`, `Pretty`, `zlib`, `html`, and `getpass`.
- **Level 2 — Code-Level Defect**: 9 modules (`_emoji_replace.py`, `console.py`, `emoji.py`, `logging.py`, `protocol.py`, `repr.py`, `segment.py`, `syntax.py`, `theme.py`) imported rarely-used stdlib and Rich submodules at module top-level.
- **Level 3 — Architectural Root Cause**: Accumulated top-level convenience imports and runtime annotation imports not guarded under `if TYPE_CHECKING:`.
- **Actionable Fix & BCF Brain Insight**: Deferring cold-path imports into the methods that need them and replacing `inspect.isclass(x)` with `isinstance(x, type)` cuts import time by 35–43%. **TRAP-1**: `tests/test_console.py` monkeypatched `rich.console.getpass` at line 403, which turns red locally once `getpass` is deferred into `Console.input()` (`test_patch` updates the monkeypatch target to `getpass.getpass`).

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/_emoji_replace.py
+++ b/rich/_emoji_replace.py
@@ -1,8 +1,5 @@
-from typing import Callable, Match, Optional
 import re
-
-from ._emoji_codes import EMOJI
-
+from typing import Callable, Match, Optional
 
 _ReStringMatch = Match[str]  # regex match object
 _ReSubCallable = Callable[[_ReStringMatch], str]  # Callable invoked by re.sub
@@ -15,8 +12,10 @@ def _emoji_replace(
     _emoji_sub: _EmojiSubMethod = re.compile(r"(:(\S*?)(?:(?:\-)(emoji|text))?:)").sub,
 ) -> str:
     """Replace emoji code in text."""
+    from ._emoji_codes import EMOJI
+
     get_emoji = EMOJI.__getitem__
-    variants = {"text": "\uFE0E", "emoji": "\uFE0F"}
+    variants = {"text": "\ufe0e", "emoji": "\ufe0f"}
     get_variant = variants.get
     default_variant_code = variants.get(default_variant, "") if default_variant else ""
 
--- a/rich/console.py
+++ b/rich/console.py
# ... [376 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [53/129] `fastapi_14372` — ♻️ Make the result of `Depends()` and `Security()` hashable, as a workaround for other tools interacting with these internal parts

- **Repository & Baseline**: `fastapi/fastapi` @ `566e3157a551` (`2025-11-19`) | **Prompt Length**: `1159` chars | **Complexity**: `T2-Surgical (6-25L)` (`+4 / -3` across `2` file(s))
- **Production Files Modified**: `fastapi/dependencies/utils.py`, `fastapi/params.py`
- **Hidden Grading Test Files**: `tests/test_depends_hashable.py` (`+25 / -0` test lines)
- **Active Traps**: `TRAP-2` | **Assigned BCF Card**: `DC-09 (Frozen Dataclass & dataclasses.replace)`
- **Level 1 — Observable Symptom**: Third-party libraries/tools inspecting FastAPI route signatures crash with `TypeError: unhashable type: 'Depends'` (or `'Security'`) when caching or deduplicating parameter metadata.
- **Level 2 — Code-Level Defect**: In `fastapi/params.py`, `Depends` and `Security` were decorated with `@dataclass` (mutable, `frozen=False`, setting `__hash__ = None`), and `fastapi/dependencies/utils.py:analyze_param()` mutated `depends.dependency = type_annotation` in-place after `copy(depends)`.
- **Level 3 — Architectural Root Cause**: Converting `Depends`/`Security` to `@dataclass` without `frozen=True` stripped object hashability previously inherited from `object.__hash__`.
- **Actionable Fix & BCF Brain Insight**: Setting `@dataclass(frozen=True)` on `Depends` and `Security` in `fastapi/params.py` and replacing in-place mutation in `analyze_param` with `dataclasses.replace(depends, dependency=type_annotation)` restores hashability.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/dependencies/utils.py
+++ b/fastapi/dependencies/utils.py
@@ -1,3 +1,4 @@
+import dataclasses
 import inspect
 from contextlib import AsyncExitStack, contextmanager
 from copy import copy, deepcopy
@@ -428,7 +429,7 @@ def analyze_param(
     if depends is not None and depends.dependency is None:
         # Copy `depends` before mutating it
         depends = copy(depends)
-        depends.dependency = type_annotation
+        depends = dataclasses.replace(depends, dependency=type_annotation)
 
     # Handle non-param type annotations like Request
     if lenient_issubclass(
--- a/fastapi/params.py
+++ b/fastapi/params.py
@@ -762,13 +762,13 @@ def __init__(
         )
 
 
-@dataclass
+@dataclass(frozen=True)
 class Depends:
     dependency: Optional[Callable[..., Any]] = None
# ... [8 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [54/129] `fastapi_14459` — 🐛 Fix OAuth2 scopes in OpenAPI in extra corner cases, parent dependency with scopes, sub-dependency security scheme without scopes

- **Repository & Baseline**: `fastapi/fastapi` @ `eb1d50479ba0` (`2025-12-04`) | **Prompt Length**: `815` chars | **Complexity**: `T3-Moderate (26-80L)` (`+49 / -22` across `3` file(s))
- **Production Files Modified**: `fastapi/dependencies/models.py`, `fastapi/dependencies/utils.py`, `fastapi/openapi/utils.py`
- **Hidden Grading Test Files**: `tests/test_security_oauth2_authorization_code_bearer_scopes_openapi.py`, `tests/test_security_oauth2_authorization_code_bearer_scopes_openapi_simple.py` (`+149 / -3` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-2`, `TRAP-8` | **Assigned BCF Card**: `DC-09 (Sub-Dependency Security Scope Resolution)`
- **Level 1 — Observable Symptom**: When a parent `Security(dep, scopes=['read'])` wraps a sub-dependency `Depends(oauth2_scheme)` (declared without scopes) and another endpoint also uses `oauth2_scheme` without scopes, OpenAPI renders the scoped endpoint with empty scopes `[]`.
- **Level 2 — Code-Level Defect**: In `fastapi/dependencies/models.py` and `utils.py`, `SecurityRequirement` was attached at `Dependant` creation time with static scopes and `_uses_scopes` returned `False` for `SecurityBase` callables invoked via `Depends()`, causing `get_flat_dependant` caching/deduplication to drop parent scopes.
- **Level 3 — Architectural Root Cause**: Premature binding of `SecurityRequirement(scopes=...)` onto `Dependant` nodes before parent-to-child `oauth_scopes` inheritance was resolved.
- **Actionable Fix & BCF Brain Insight**: Computing `_is_security_scheme` and `_security_dependencies` dynamically on `Dependant` (removing static `SecurityRequirement`) ensures OpenAPI always reads each `Dependant`'s effective inherited `oauth_scopes`.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/dependencies/models.py
+++ b/fastapi/dependencies/models.py
@@ -2,7 +2,7 @@
 import sys
 from dataclasses import dataclass, field
 from functools import cached_property, partial
-from typing import Any, Callable, List, Optional, Sequence, Union
+from typing import Any, Callable, List, Optional, Union
 
 from fastapi._compat import ModelField
 from fastapi.security.base import SecurityBase
@@ -28,12 +28,6 @@ def _impartial(func: Callable[..., Any]) -> Callable[..., Any]:
     return func
 
 
-@dataclass
-class SecurityRequirement:
-    security_scheme: SecurityBase
-    scopes: Optional[Sequence[str]] = None
-
-
 @dataclass
 class Dependant:
     path_params: List[ModelField] = field(default_factory=list)
@@ -42,7 +36,6 @@ class Dependant:
     cookie_params: List[ModelField] = field(default_factory=list)
# ... [146 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [55/129] `fastapi_14455` — 🐛 Fix OpenAPI security scheme OAuth2 scopes declaration, deduplicate security schemes with different scopes

- **Repository & Baseline**: `fastapi/fastapi` @ `603df6e36f59` (`2025-12-04`) | **Prompt Length**: `283` chars | **Complexity**: `T2-Surgical (6-25L)` (`+11 / -2` across `1` file(s))
- **Production Files Modified**: `fastapi/openapi/utils.py`
- **Hidden Grading Test Files**: `tests/test_security_oauth2_authorization_code_bearer_scopes_openapi.py` (`+131 / -0` test lines)
- **Active Traps**: `TRAP-8` | **Assigned BCF Card**: `DC-09 (Ordered Dict Scope Deduplication)`
- **Level 1 — Observable Symptom**: When multiple dependencies on the same endpoint reference the same OAuth2 security scheme with different scopes (e.g., `['read']` and `['write']`), OpenAPI `security` emits duplicate entries `[{'OAuth2': ['read']}, {'OAuth2': ['write']}]` instead of merged `[{'OAuth2': ['read', 'write']}]`.
- **Level 2 — Code-Level Defect**: In `fastapi/openapi/utils.py:get_openapi_security_definitions()`, `operation_security.append({security_name: security_requirement.scopes})` appended a new single-key dict per `security_requirement` without merging by `security_name`.
- **Level 3 — Architectural Root Cause**: In OpenAPI 3.x, separate objects in the `security` list represent logical `OR` alternatives, whereas multiple scopes inside one `{scheme_name: [...]}` object represent logical `AND` requirements!
- **Actionable Fix & BCF Brain Insight**: Accumulating scopes in `operation_security_dict: Dict[str, List[str]]` preserving insertion order and deduplicating per `security_name` emits valid OpenAPI `AND`-scoped security requirements.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/openapi/utils.py
+++ b/fastapi/openapi/utils.py
@@ -79,7 +79,8 @@ def get_openapi_security_definitions(
     flat_dependant: Dependant,
 ) -> Tuple[Dict[str, Any], List[Dict[str, Any]]]:
     security_definitions = {}
-    operation_security = []
+    # Use a dict to merge scopes for same security scheme
+    operation_security_dict: Dict[str, List[str]] = {}
     for security_requirement in flat_dependant.security_requirements:
         security_definition = jsonable_encoder(
             security_requirement.security_scheme.model,
@@ -88,7 +89,15 @@ def get_openapi_security_definitions(
         )
         security_name = security_requirement.security_scheme.scheme_name
         security_definitions[security_name] = security_definition
-        operation_security.append({security_name: security_requirement.scopes})
+        # Merge scopes for the same security scheme
+        if security_name not in operation_security_dict:
+            operation_security_dict[security_name] = []
+        for scope in security_requirement.scopes or []:
+            if scope not in operation_security_dict[security_name]:
+                operation_security_dict[security_name].append(scope)
+    operation_security = [
+        {name: scopes} for name, scopes in operation_security_dict.items()
+    ]
# ... [1 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [56/129] `fastapi_14419` — 🐛 Cache dependencies that don't use scopes and don't have sub-dependencies with scopes

- **Repository & Baseline**: `fastapi/fastapi` @ `63d7a2b99782` (`2025-11-30`) | **Prompt Length**: `689` chars | **Complexity**: `T3-Moderate (26-80L)` (`+42 / -20` across `2` file(s))
- **Production Files Modified**: `fastapi/dependencies/models.py`, `fastapi/dependencies/utils.py`
- **Hidden Grading Test Files**: `tests/test_security_scopes.py`, `tests/test_security_scopes_sub_dependency.py` (`+153 / -0` test lines)
- **Active Traps**: `TRAP-2`, `TRAP-4` | **Assigned BCF Card**: `DC-09 (Scope-Sensitive Dependency Cache Key)`
- **Level 1 — Observable Symptom**: Shared utility dependencies (like `get_db`) that do not use OAuth2 scopes are executed multiple times per request when invoked both directly and under `Security(..., scopes=['read'])` sub-trees.
- **Level 2 — Code-Level Defect**: In `fastapi/dependencies/models.py:Dependant.cache_key`, `tuple(sorted(set(self.security_scopes or [])))` included inherited parent OAuth2 scopes in the cache key even when neither the dependency nor any of its sub-dependencies declared scopes or injected `SecurityScopes`!
- **Level 3 — Architectural Root Cause**: Over-granular cache-key construction: propagating `security_scopes` unconditionally down the entire dependency tree invalidated request-level caching for scope-agnostic leaf dependencies.
- **Actionable Fix & BCF Brain Insight**: Splitting `own_oauth_scopes` and `parent_oauth_scopes`, adding `_uses_scopes` recursive check, and setting `scopes_for_cache = ()` when `not self._uses_scopes` unifies request caching without leaking scoped auth.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/dependencies/models.py
+++ b/fastapi/dependencies/models.py
@@ -38,19 +38,43 @@ class Dependant:
     response_param_name: Optional[str] = None
     background_tasks_param_name: Optional[str] = None
     security_scopes_param_name: Optional[str] = None
-    security_scopes: Optional[List[str]] = None
+    own_oauth_scopes: Optional[List[str]] = None
+    parent_oauth_scopes: Optional[List[str]] = None
     use_cache: bool = True
     path: Optional[str] = None
     scope: Union[Literal["function", "request"], None] = None
 
+    @cached_property
+    def oauth_scopes(self) -> List[str]:
+        scopes = self.parent_oauth_scopes.copy() if self.parent_oauth_scopes else []
+        # This doesn't use a set to preserve order, just in case
+        for scope in self.own_oauth_scopes or []:
+            if scope not in scopes:
+                scopes.append(scope)
+        return scopes
+
     @cached_property
     def cache_key(self) -> DependencyCacheKey:
+        scopes_for_cache = (
+            tuple(sorted(set(self.oauth_scopes or []))) if self._uses_scopes else ()
# ... [126 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [57/129] `rich_3782` — Syntax padding

- **Repository & Baseline**: `Textualize/rich` @ `3b70db5a2997` (`2025-06-23`) | **Prompt Length**: `68` chars | **Complexity**: `T3-Moderate (26-80L)` (`+24 / -5` across `1` file(s))
- **Production Files Modified**: `rich/syntax.py`
- **Hidden Grading Test Files**: `tests/test_syntax.py` (`+41 / -25` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-5`, `TRAP-8` | **Assigned BCF Card**: `DC-09 (Descriptor Normalization on Attribute Mutation)`
- **Level 1 — Observable Symptom**: Passing shorthand `padding=1` or assigning `syntax.padding = (1, 2)` on a `rich.syntax.Syntax` instance crashes `__rich_console__` or `__rich_measure__` with `ValueError: not enough values to unpack (expected 4)`.
- **Level 2 — Code-Level Defect**: In `rich/syntax.py`, `Syntax.__init__` stored raw `self.padding = padding` (`int` or 2-tuple) without unpacking via `Padding.unpack(padding)`, and inconsistent sites unpacked `self.padding` in `__rich_measure__` while assuming 4-tuple elsewhere.
- **Level 3 — Architectural Root Cause**: Public mutable attribute (`self.padding`) accepted polymorphic `PaddingDimensions` (`int | tuple[int] | tuple[int, int] | tuple[int, int, int, int]`) without a property/descriptor normalizer.
- **Actionable Fix & BCF Brain Insight**: Introducing `PaddingProperty` descriptor (`__get__` returning `obj._padding`, `__set__` storing `Padding.unpack(padding)`) and initializing `self._padding = Padding.unpack(padding)` guarantees a canonical 4-tuple everywhere.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/syntax.py
+++ b/rich/syntax.py
@@ -1,3 +1,5 @@
+from __future__ import annotations
+
 import os.path
 import re
 import sys
@@ -224,6 +226,17 @@ class _SyntaxHighlightRange(NamedTuple):
     style_before: bool = False
 
 
+class PaddingProperty:
+    """Descriptor to get and set padding."""
+
+    def __get__(self, obj: Syntax, objtype: Type[Syntax]) -> Tuple[int, int, int, int]:
+        """Space around the Syntax."""
+        return obj._padding
+
+    def __set__(self, obj: Syntax, padding: PaddingDimensions) -> None:
+        obj._padding = Padding.unpack(padding)
+
+
 class Syntax(JupyterMixin):
     """Construct a Syntax object to render syntax highlighted code.
 
# ... [64 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [58/129] `rich_2943` — Clear hashed cache when clearing meta.

- **Repository & Baseline**: `Textualize/rich` @ `610fd75c433c` (`2024-07-01`) | **Prompt Length**: `469` chars | **Complexity**: `T1-Micro (1-5L)` (`+1 / -1` across `1` file(s))
- **Production Files Modified**: `rich/style.py`
- **Hidden Grading Test Files**: `tests/test_style.py` (`+14 / -0` test lines)
- **Active Traps**: `TRAP-6` | **Assigned BCF Card**: `DC-09 (Cached Hash Invalidation on Copy-Mutate)`
- **Level 1 — Observable Symptom**: Calling `style.clear_meta_and_links()` on a `Style` object whose `hash(style)` was already computed leaves the new cleared `Style` carrying the old pre-clear `_hash`, breaking `dict`/`set` lookups and equality invariants!
- **Level 2 — Code-Level Defect**: In `rich/style.py:Style.clear_meta_and_links()`, fast manual instance construction copied `style._hash = self._hash` even though `style._link = None` and `style._meta = None` changed the fields included in `__hash__`.
- **Level 3 — Architectural Root Cause**: Stale memoized hash (`_hash`) copied across a clone-and-modify fast path (`__new__` bypassing `__init__`).
- **Actionable Fix & BCF Brain Insight**: Setting `style._hash = None` in `clear_meta_and_links()` forces lazy hash recomputation on next `hash(clear_style)` call in a 1-line fix.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/style.py
+++ b/rich/style.py
@@ -663,7 +663,7 @@ def clear_meta_and_links(self) -> "Style":
         style._set_attributes = self._set_attributes
         style._link = None
         style._link_id = ""
-        style._hash = self._hash
+        style._hash = None
         style._null = False
         style._meta = None
         return style
```
</details>

#### SUB-3C: AsyncExitStack Function/Request Scopes, Lifespan Contexts & `super().__init__` Order (5 Tasks)

##### [59/129] `fastapi_14851` — ♻️ Re-implement `on_event` in FastAPI for compatibility with the next Starlette, while keeping backwards compatibility

- **Repository & Baseline**: `fastapi/fastapi` @ `8e50c55fd90c` (`2026-02-06`) | **Prompt Length**: `464` chars | **Complexity**: `T4-Arch (>80L)` (`+153 / -4` across `1` file(s))
- **Production Files Modified**: `fastapi/routing.py`
- **Hidden Grading Test Files**: `tests/test_router_events.py` (`+76 / -0` test lines)
- **Active Traps**: `TRAP-4` | **Assigned BCF Card**: `DC-10 (Lifespan Context Manager & Event Hook Composition)`
- **Level 1 — Observable Symptom**: Upcoming Starlette releases remove `Router.on_startup`, `Router.on_shutdown`, and `on_event`, which breaks FastAPI's backwards-compatible `@app.on_event('startup')` / `@router.on_event('shutdown')` API.
- **Level 2 — Code-Level Defect**: `fastapi/routing.py:APIRouter` delegated `on_startup`, `on_shutdown`, `on_event`, and generator lifespan wrapping (`_AsyncLiftContextManager`) to Starlette's `Router` internals instead of managing them in FastAPI's `_merge_lifespan_context`.
- **Level 3 — Architectural Root Cause**: Upstream Starlette deprecation removal (`Kludex/starlette#3117`) required FastAPI to vendor lifespan context lifting and self-host `on_startup`/`on_shutdown` execution inside `APIRouter`'s lifespan.
- **Actionable Fix & BCF Brain Insight**: Implementing `_AsyncLiftContextManager`, `_wrap_gen_lifespan_context`, `APIRouter._default_lifespan`, and `on_event` directly in `fastapi/routing.py` preserves 100% backwards compatibility independent of Starlette.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/routing.py
+++ b/fastapi/routing.py
@@ -1,22 +1,31 @@
+import contextlib
 import email.message
 import functools
 import inspect
 import json
+import types
 from collections.abc import (
     AsyncIterator,
     Awaitable,
     Collection,
     Coroutine,
+    Generator,
     Mapping,
     Sequence,
 )
-from contextlib import AsyncExitStack, asynccontextmanager
+from contextlib import (
+    AbstractAsyncContextManager,
+    AbstractContextManager,
+    AsyncExitStack,
+    asynccontextmanager,
+)
 from enum import Enum, IntEnum
# ... [187 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [60/129] `fastapi_14873` — 🐛 Fix `on_startup` and `on_shutdown` parameters of `APIRouter`

- **Repository & Baseline**: `fastapi/fastapi` @ `cd31576d5704` (`2026-02-09`) | **Prompt Length**: `674` chars | **Complexity**: `T2-Surgical (6-25L)` (`+11 / -10` across `1` file(s))
- **Production Files Modified**: `fastapi/routing.py`
- **Hidden Grading Test Files**: `tests/test_router_events.py` (`+60 / -0` test lines)
- **Active Traps**: `STD` | **Assigned BCF Card**: `DC-10 (Subclass `super().__init__()` Attribute Overwrite Guard)`
- **Level 1 — Observable Symptom**: Passing `FastAPI(on_startup=[fn], on_shutdown=[fn])` or `APIRouter(on_startup=[fn])` via constructor kwargs silently drops all startup/shutdown handlers—none are ever called!
- **Level 2 — Code-Level Defect**: In `fastapi/routing.py:APIRouter.__init__()`, PR #14851 assigned `self.on_startup = ...` and `self.on_shutdown = ...` *before* calling `super().__init__(...)` (without passing them to `super()`), and Starlette's `Router.__init__` subsequently executed `self.on_startup = []`, wiping FastAPI's lists!
- **Level 3 — Architectural Root Cause**: Inheritance initialization-order hazard: setting attributes on `self` prior to `super().__init__()` when the base class initializes identically named attributes to empty defaults.
- **Actionable Fix & BCF Brain Insight**: Moving `self.on_startup` and `self.on_shutdown` assignment *after* `super().__init__(...)` in `APIRouter.__init__` immediately fixes constructor-passed lifecycle handlers.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/routing.py
+++ b/fastapi/routing.py
@@ -952,16 +952,6 @@ def __init__(
             ),
         ] = Default(generate_unique_id),
     ) -> None:
-        # Handle on_startup/on_shutdown locally since Starlette removed support
-        # Ref: https://github.com/Kludex/starlette/pull/3117
-        # TODO: deprecate this once the lifespan (or alternative) interface is improved
-        self.on_startup: list[Callable[[], Any]] = (
-            [] if on_startup is None else list(on_startup)
-        )
-        self.on_shutdown: list[Callable[[], Any]] = (
-            [] if on_shutdown is None else list(on_shutdown)
-        )
-
         # Determine the lifespan context to use
         if lifespan is None:
             # Use the default lifespan that runs on_startup/on_shutdown handlers
@@ -985,6 +975,17 @@ def __init__(
             assert not prefix.endswith("/"), (
                 "A path prefix must not end with '/', as the routes will start with '/'"
             )
+
+        # Handle on_startup/on_shutdown locally since Starlette removed support
+        # Ref: https://github.com/Kludex/starlette/pull/3117
# ... [11 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [61/129] `fastapi_14099` — 🐛 Fix support for `StreamingResponse`s with dependencies with `yield` or `UploadFile`s, close after the response is done

- **Repository & Baseline**: `fastapi/fastapi` @ `861b22c40897` (`2025-09-29`) | **Prompt Length**: `644` chars | **Complexity**: `T4-Arch (>80L)` (`+346 / -131` across `5` file(s))
- **Production Files Modified**: `docs_src/dependencies/tutorial013_an_py310.py`, `docs_src/dependencies/tutorial014_an_py310.py`, `fastapi/applications.py`, `fastapi/middleware/asyncexitstack.py`, `fastapi/routing.py`
- **Hidden Grading Test Files**: `tests/test_dependency_after_yield_raise.py`, `tests/test_dependency_after_yield_streaming.py`, `tests/test_dependency_after_yield_websockets.py`, `tests/test_dependency_contextmanager.py`, `tests/test_route_scope.py`, ... (+1 more) (`+284 / -9` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-2`, `TRAP-4` | **Assigned BCF Card**: `DC-10 (AsyncExitStack Lifecycle Teardown + Tutorial Sync)`
- **Level 1 — Observable Symptom**: Dependencies using `yield` (e.g., SQLAlchemy/SQLModel DB sessions) and `UploadFile` handles exit and close *before* a `StreamingResponse` finishes streaming its generator body, causing closed-session/closed-file crashes mid-stream!
- **Level 2 — Code-Level Defect**: In `fastapi/routing.py` and `fastapi/applications.py`, the inner dependency `AsyncExitStack` unwound as soon as the endpoint returned the `StreamingResponse` object rather than wrapping the full ASGI response send lifecycle.
- **Level 3 — Architectural Root Cause**: Two-phase lifecycle mismatch in ASGI: endpoint return happens *before* streaming body chunks are pulled by the server, requiring separate function-level vs request/response-level `AsyncExitStack` scopes.
- **Actionable Fix & BCF Brain Insight**: Restoring `AsyncExitStackMiddleware` for post-response cleanup while keeping an inner stack for pre-response exception handling (plus adding `docs_src/dependencies/tutorial013_an_py310.py` & `tutorial014_an_py310.py`) fixes streaming & WebSocket `yield` lifecycles.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/docs_src/dependencies/tutorial013_an_py310.py
+++ b/docs_src/dependencies/tutorial013_an_py310.py
@@ -0,0 +1,38 @@
+import time
+from typing import Annotated
+
+from fastapi import Depends, FastAPI, HTTPException
+from fastapi.responses import StreamingResponse
+from sqlmodel import Field, Session, SQLModel, create_engine
+
+engine = create_engine("postgresql+psycopg://postgres:postgres@localhost/db")
+
+
+class User(SQLModel, table=True):
+    id: int | None = Field(default=None, primary_key=True)
+    name: str
+
+
+app = FastAPI()
+
+
+def get_session():
+    with Session(engine) as session:
+        yield session
+
+
# ... [541 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [62/129] `fastapi_14301` — 🐛 Fix `Depends(func, scope='function')` for top level (parameterless) dependencies

- **Repository & Baseline**: `fastapi/fastapi` @ `972a967d5d3f` (`2025-11-08`) | **Prompt Length**: `739` chars | **Complexity**: `T1-Micro (1-5L)` (`+4 / -1` across `1` file(s))
- **Production Files Modified**: `fastapi/dependencies/utils.py`
- **Hidden Grading Test Files**: `tests/test_dependency_yield_scope.py` (`+63 / -1` test lines)
- **Active Traps**: `TRAP-1` | **Assigned BCF Card**: `DC-03 (Parameter Forwarding Completeness)`
- **Level 1 — Observable Symptom**: Registering a function-scoped `yield` dependency at the route decorator level (`@app.get('/', dependencies=[Depends(dep, scope='function')])`) silently ignores `scope='function'` and runs cleanup at `'request'` scope instead!
- **Level 2 — Code-Level Defect**: In `fastapi/dependencies/utils.py:get_parameterless_sub_dependant()`, `return get_dependant(path=path, call=depends.dependency, security_scopes=use_security_scopes)` omitted `scope=depends.scope`!
- **Level 3 — Architectural Root Cause**: Forgotten keyword-argument forwarding in the secondary `get_parameterless_sub_dependant` factory when `scope` was added to `get_dependant` in PR #14262.
- **Actionable Fix & BCF Brain Insight**: Forwarding `scope=depends.scope` inside `get_parameterless_sub_dependant` fixes route/router/app-level `dependencies=[...]` scope handling in 4 lines.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/dependencies/utils.py
+++ b/fastapi/dependencies/utils.py
@@ -129,7 +129,10 @@ def get_parameterless_sub_dependant(*, depends: params.Depends, path: str) -> De
     if isinstance(depends, params.Security) and depends.scopes:
         use_security_scopes.extend(depends.scopes)
     return get_dependant(
-        path=path, call=depends.dependency, security_scopes=use_security_scopes
+        path=path,
+        call=depends.dependency,
+        scope=depends.scope,
+        security_scopes=use_security_scopes,
     )
```
</details>

##### [63/129] `fastapi_14262` — ✨ Add support for dependencies with scopes, support `scope="request"` for dependencies with `yield` that exit before the response is sent

- **Repository & Baseline**: `fastapi/fastapi` @ `425a4c5bb1d1` (`2025-11-03`) | **Prompt Length**: `2437` chars | **Complexity**: `T4-Arch (>80L)` (`+196 / -70` across `10` file(s))
- **Production Files Modified**: `docs_src/dependencies/tutorial008e.py`, `docs_src/dependencies/tutorial008e_an.py`, `docs_src/dependencies/tutorial008e_an_py39.py`, `fastapi/dependencies/models.py`, `fastapi/dependencies/utils.py`, `fastapi/exceptions.py`, `fastapi/param_functions.py`, `fastapi/params.py`, ... (+2 more; 10 total)
- **Hidden Grading Test Files**: `tests/test_dependency_yield_scope.py`, `tests/test_dependency_yield_scope_websockets.py`, `tests/test_tutorial/test_dependencies/test_tutorial008e.py` (`+412 / -0` test lines)
- **Active Traps**: `TRAP-2`, `TRAP-4` | **Assigned BCF Card**: `DC-10 (Dual-Scope `function` vs `request` ExitStack Architecture)`
- **Level 1 — Observable Symptom**: After #14099 moved `yield` teardown after response completion, users had no opt-in mechanism to run `yield` cleanup *before* the response is sent (`scope='function'`) vs *after* (`scope='request'`), and invalid scope hierarchies weren't guarded.
- **Level 2 — Code-Level Defect**: `Depends()` / `Security()` / `Dependant` lacked a `scope: Literal['function', 'request'] | None` parameter, `DependencyScopeError` validation (forbidding `'request'` child inside `'function'` parent), and dual `function_stack` / `request_stack` routing in `solve_dependencies`.
- **Level 3 — Architectural Root Cause**: Single implicit teardown timing cannot satisfy both streaming-safe resource retention (`'request'`) and transactional pre-response commit/cleanup (`'function'`).
- **Actionable Fix & BCF Brain Insight**: Adding `scope` across 7 core FastAPI files + 3 `docs_src/dependencies/tutorial008e*` files, computing `computed_scope`, raising `DependencyScopeError` on invalid nesting, and routing `yield` teardowns to `inner_astack` vs `async_exit_stack` solves both use cases.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/docs_src/dependencies/tutorial008e.py
+++ b/docs_src/dependencies/tutorial008e.py
@@ -0,0 +1,15 @@
+from fastapi import Depends, FastAPI
+
+app = FastAPI()
+
+
+def get_username():
+    try:
+        yield "Rick"
+    finally:
+        print("Cleanup up before response is sent")
+
+
+@app.get("/users/me")
+def get_user_me(username: str = Depends(get_username, scope="function")):
+    return username
--- a/docs_src/dependencies/tutorial008e_an.py
+++ b/docs_src/dependencies/tutorial008e_an.py
@@ -0,0 +1,16 @@
+from fastapi import Depends, FastAPI
+from typing_extensions import Annotated
+
+app = FastAPI()
+
# ... [477 additional diff lines omitted for brevity; full file list above] ...
```
</details>

### CAT-4: HTTP Protocol Semantics, Security Boundaries & Router/Subsystem Architecture (22 Tasks)

**Category Overview:** RFC 9110/6750/8470/3986 wire-protocol and security boundary bugs across authentication status codes (`401` vs `403`), CSRF `Content-Type` enforcement, URI/proxy DNS suffix matching, UTF-8 vs Latin-1 byte-length calculation, SSE frame validation, non-cloning router contexts, and sync/async twin trees.

#### SUB-4A: Authentication Status (`401` vs `403`), Bearer Header Stripping, Netrc & CSRF Guards (5 Tasks)

##### [64/129] `fastapi_14978` — 🔒️ Add `strict_content_type` checking for JSON requests

- **Repository & Baseline**: `fastapi/fastapi` @ `94a1ee749e63` (`2026-02-23`) | **Prompt Length**: `112` chars | **Complexity**: `T4-Arch (>80L)` (`+81 / -1` across `3` file(s))
- **Production Files Modified**: `docs_src/strict_content_type/tutorial001_py310.py`, `fastapi/applications.py`, `fastapi/routing.py`
- **Hidden Grading Test Files**: `tests/test_strict_content_type_app_level.py`, `tests/test_strict_content_type_nested.py`, `tests/test_strict_content_type_router_level.py`, `tests/test_tutorial/test_body/test_tutorial001.py`, `tests/test_tutorial/test_strict_content_type/test_tutorial001.py` (`+241 / -8` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-2`, `TRAP-4`, `TRAP-5` | **Assigned BCF Card**: `DC-15 (Cross-Layer Security Flag + Tutorial Sync)`
- **Level 1 — Observable Symptom**: Browsers can send cross-origin `POST` `fetch()` requests with `text/plain` or omitted `Content-Type` (bypassing CORS preflight) whose body FastAPI still parses as JSON, creating CSRF exposure for localhost developer servers.
- **Level 2 — Code-Level Defect**: `FastAPI`, `APIRouter`, `APIRoute`, and `get_request_handler` parsed request bodies as JSON even when no `application/json` (or `+*json`) `Content-Type` header was present.
- **Level 3 — Architectural Root Cause**: Permissive body-parsing convenience (`request.json()` fallback without `Content-Type` header verification) conflicted with browser CORS simple-request security boundaries.
- **Actionable Fix & BCF Brain Insight**: Plumbing `strict_content_type: bool = True` through `FastAPI`, `APIRouter`, `APIRoute`, and `get_request_handler` (returning 422 when `Content-Type` is missing/non-JSON unless `strict_content_type=False`) plus `docs_src/strict_content_type/tutorial001_py310.py` closes the vector (Trap-1 + Trap-2).

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/docs_src/strict_content_type/tutorial001_py310.py
+++ b/docs_src/strict_content_type/tutorial001_py310.py
@@ -0,0 +1,14 @@
+from fastapi import FastAPI
+from pydantic import BaseModel
+
+app = FastAPI(strict_content_type=False)
+
+
+class Item(BaseModel):
+    name: str
+    price: float
+
+
+@app.post("/items/")
+async def create_item(item: Item):
+    return item
--- a/fastapi/applications.py
+++ b/fastapi/applications.py
@@ -840,6 +840,29 @@ class Item(BaseModel):
                 """
             ),
         ] = None,
+        strict_content_type: Annotated[
+            bool,
+            Doc(
# ... [154 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [65/129] `requests_7205` — Fix empty netrc entry usage

- **Repository & Baseline**: `psf/requests` @ `1b40fdd004bf` (`2026-02-13`) | **Prompt Length**: `609` chars | **Complexity**: `T1-Micro (1-5L)` (`+1 / -1` across `1` file(s))
- **Production Files Modified**: `src/requests/utils.py`
- **Hidden Grading Test Files**: `tests/test_utils.py` (`+10 / -0` test lines)
- **Active Traps**: `TRAP-6`, `TRAP-8` | **Assigned BCF Card**: `DC-04 (Python 3.11+ Stdlib Return Tuple Guard)`
- **Level 1 — Observable Symptom**: On Python 3.11+, a `~/.netrc` file containing a bare `default` entry with no login/password causes Requests to attach an empty `Authorization: Basic Og==` (`':'`) header to outgoing HTTP requests.
- **Level 2 — Code-Level Defect**: In `src/requests/utils.py:get_netrc_auth()`, `_netrc = netrc(netrc_path).authenticators(host)` was checked with `if _netrc:`, which is `True` for the non-empty 3-tuple of empty strings `('', '', '')`!
- **Level 3 — Architectural Root Cause**: Upstream CPython 3.11 stdlib behavior change: `netrc` stopped raising `NetrcParseError` on credential-less `default` tokens and began returning `('', None, None)` / `('', '', '')`, a truthy tuple whose elements are all falsy.
- **Actionable Fix & BCF Brain Insight**: Changing `if _netrc:` to `if _netrc and any(_netrc):` restores Requests' pre-3.11 behavior of ignoring empty netrc profiles.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/src/requests/utils.py
+++ b/src/requests/utils.py
@@ -231,7 +231,7 @@ def get_netrc_auth(url, raise_errors=False):
 
         try:
             _netrc = netrc(netrc_path).authenticators(host)
-            if _netrc:
+            if _netrc and any(_netrc):
                 # Return with login / password
                 login_i = 0 if _netrc[0] else 1
                 return (_netrc[login_i], _netrc[2])
```
</details>

##### [66/129] `fastapi_14786` — 🐛 Strip whitespaces from `Authorization` header credentials

- **Repository & Baseline**: `fastapi/fastapi` @ `eacbce24c9d2` (`2026-02-04`) | **Prompt Length**: `2303` chars | **Complexity**: `T1-Micro (1-5L)` (`+1 / -1` across `1` file(s))
- **Production Files Modified**: `fastapi/security/utils.py`
- **Hidden Grading Test Files**: `tests/test_security_http_base.py`, `tests/test_security_oauth2_authorization_code_bearer.py` (`+12 / -0` test lines)
- **Active Traps**: `TRAP-6` | **Assigned BCF Card**: `DC-04 (RFC Header Token Whitespace Normalization)`
- **Level 1 — Observable Symptom**: An HTTP `Authorization` header with multiple spaces between scheme and token or trailing whitespace (`Authorization: Bearer  foobar `) leaves leading/trailing spaces inside `credentials.credentials` (`' foobar '`), causing token verification failures.
- **Level 2 — Code-Level Defect**: In `fastapi/security/utils.py:get_authorization_scheme_param()`, `scheme, _, param = authorization_header_value.partition(' ')` splits on the *first* space only and returned `scheme, param` unstripped.
- **Level 3 — Architectural Root Cause**: RFC 6750 Section 2.1 permits `1*SP` (one or more spaces) after `Bearer` and HTTP OWS around header values, whereas `str.partition(' ')` consumes only a single space character.
- **Actionable Fix & BCF Brain Insight**: Returning `scheme, param.strip()` in `get_authorization_scheme_param` fixes both `HTTPBearer` and `OAuth2AuthorizationCodeBearer` in 1 line.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/security/utils.py
+++ b/fastapi/security/utils.py
@@ -7,4 +7,4 @@ def get_authorization_scheme_param(
     if not authorization_header_value:
         return "", ""
     scheme, _, param = authorization_header_value.partition(" ")
-    return scheme, param
+    return scheme, param.strip()
```
</details>

##### [67/129] `fastapi_14266` — 🐛 Fix security schemes in OpenAPI when added at the top level app

- **Repository & Baseline**: `fastapi/fastapi` @ `2cf04ee30db9` (`2025-10-31`) | **Prompt Length**: `247` chars | **Complexity**: `T2-Surgical (6-25L)` (`+8 / -10` across `1` file(s))
- **Production Files Modified**: `fastapi/dependencies/utils.py`
- **Hidden Grading Test Files**: `tests/test_top_level_security_scheme_in_openapi.py` (`+60 / -0` test lines)
- **Active Traps**: `TRAP-8` | **Assigned BCF Card**: `DC-09 (Top-Level Dependant Security Registration)`
- **Level 1 — Observable Symptom**: Attaching a `SecurityBase` instance at route/router/app `dependencies=[Depends(bearer_scheme)]` (parameterless top-level dependency) omits the security scheme from the generated OpenAPI `security` and `securitySchemes` sections!
- **Level 2 — Code-Level Defect**: In `fastapi/dependencies/utils.py:get_dependant()`, `SecurityRequirement` was only appended when `param_details.depends.dependency` was inspected inside the *signature parameters* loop, completely missing `get_parameterless_sub_dependant` where `call` itself is a `SecurityBase` instance.
- **Level 3 — Architectural Root Cause**: Asymmetric placement of `isinstance(..., SecurityBase)` check on caller-side parameter inspection rather than callee-side `get_dependant(call=...)` entry.
- **Actionable Fix & BCF Brain Insight**: Moving the `if isinstance(call, SecurityBase): dependant.security_requirements.append(...)` check to the top of `get_dependant` covers parameter, sub-dependency, route, router, and app-level security uniformly.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/dependencies/utils.py
+++ b/fastapi/dependencies/utils.py
@@ -248,6 +248,14 @@ def get_dependant(
     path_param_names = get_path_param_names(path)
     endpoint_signature = get_typed_signature(call)
     signature_params = endpoint_signature.parameters
+    if isinstance(call, SecurityBase):
+        use_scopes: List[str] = []
+        if isinstance(call, (OAuth2, OpenIdConnect)):
+            use_scopes = security_scopes
+        security_requirement = SecurityRequirement(
+            security_scheme=call, scopes=use_scopes
+        )
+        dependant.security_requirements.append(security_requirement)
     for param_name, param in signature_params.items():
         is_path_param = param_name in path_param_names
         param_details = analyze_param(
@@ -269,16 +277,6 @@ def get_dependant(
                 security_scopes=use_security_scopes,
                 use_cache=param_details.depends.use_cache,
             )
-            if isinstance(param_details.depends.dependency, SecurityBase):
-                use_scopes: List[str] = []
-                if isinstance(
-                    param_details.depends.dependency, (OAuth2, OpenIdConnect)
-                ):
# ... [8 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [68/129] `fastapi_13786` — 🐛 Use `401` status code in security classes when credentials are missing

- **Repository & Baseline**: `fastapi/fastapi` @ `e2354a0a063f` (`2025-11-24`) | **Prompt Length**: `5316` chars | **Complexity**: `T4-Arch (>80L)` (`+176 / -83` across `11` file(s))
- **Production Files Modified**: `docs_src/authentication_error_status_code/tutorial001_an.py`, `docs_src/authentication_error_status_code/tutorial001_an_py39.py`, `docs_src/security/tutorial003.py`, `docs_src/security/tutorial003_an.py`, `docs_src/security/tutorial003_an_py310.py`, `docs_src/security/tutorial003_an_py39.py`, `docs_src/security/tutorial003_py310.py`, `fastapi/security/api_key.py`, ... (+3 more; 11 total)
- **Hidden Grading Test Files**: `tests/test_security_api_key_cookie.py`, `tests/test_security_api_key_cookie_description.py`, `tests/test_security_api_key_header.py`, `tests/test_security_api_key_header_description.py`, `tests/test_security_api_key_query.py`, ... (+12 more) (`+46 / -28` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-2`, `TRAP-4` | **Assigned BCF Card**: `DC-15 (HTTP 401 Auth Semantics + Multi-File Tutorial Sync)`
- **Level 1 — Observable Symptom**: Missing credentials on `APIKeyHeader`, `APIKeyQuery`, `APIKeyCookie`, `HTTPBearer`, `HTTPDigest`, and `OpenIdConnect` return HTTP `403 Forbidden` instead of RFC-compliant HTTP `401 Unauthorized` with `WWW-Authenticate` headers.
- **Level 2 — Code-Level Defect**: Across `fastapi/security/api_key.py`, `http.py`, `oauth2.py`, and `open_id_connect_url.py`, missing-credential branches raised `HTTPException(status_code=HTTP_403_FORBIDDEN)` without `make_not_authenticated_error()` override hooks.
- **Level 3 — Architectural Root Cause**: Historical Starlette/FastAPI confusion between authentication failure (`401 Unauthorized` — missing/invalid credentials) and authorization failure (`403 Forbidden` — authenticated user lacks permissions).
- **Actionable Fix & BCF Brain Insight**: Updating all security classes to default to `401 Unauthorized` + `WWW-Authenticate` via overridable `make_not_authenticated_error()` and synchronizing 7 `docs_src/` security tutorials resolves a multi-year RFC compliance gap (Trap-1: 17 existing test files changed `403 -> 401` in `test_patch`!).

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/docs_src/authentication_error_status_code/tutorial001_an.py
+++ b/docs_src/authentication_error_status_code/tutorial001_an.py
@@ -0,0 +1,20 @@
+from fastapi import Depends, FastAPI, HTTPException, status
+from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
+from typing_extensions import Annotated
+
+app = FastAPI()
+
+
+class HTTPBearer403(HTTPBearer):
+    def make_not_authenticated_error(self) -> HTTPException:
+        return HTTPException(
+            status_code=status.HTTP_403_FORBIDDEN, detail="Not authenticated"
+        )
+
+
+CredentialsDep = Annotated[HTTPAuthorizationCredentials, Depends(HTTPBearer403())]
+
+
+@app.get("/me")
+def read_me(credentials: CredentialsDep):
+    return {"message": "You are authenticated", "token": credentials.credentials}
--- a/docs_src/authentication_error_status_code/tutorial001_an_py39.py
+++ b/docs_src/authentication_error_status_code/tutorial001_an_py39.py
@@ -0,0 +1,21 @@
# ... [486 additional diff lines omitted for brevity; full file list above] ...
```
</details>

#### SUB-4B: URI Path/Proxy Normalization, RFC Media-Type Parsing, Wire Byte-Length & SSE Framing (9 Tasks)

##### [69/129] `fastapi_15588` — ♻️ Validate Server Sent Event fields to avoid applications from sending broken data

- **Repository & Baseline**: `fastapi/fastapi` @ `cb83b83dcf78` (`2026-05-23`) | **Prompt Length**: `1889` chars | **Complexity**: `T2-Surgical (6-25L)` (`+18 / -5` across `1` file(s))
- **Production Files Modified**: `fastapi/sse.py`
- **Hidden Grading Test Files**: `tests/test_sse.py` (`+9 / -0` test lines)
- **Active Traps**: `STD` | **Assigned BCF Card**: `DC-04 (Wire Frame Line-Break Injection Guard)`
- **Level 1 — Observable Symptom**: Passing multi-line strings containing `\n` or `\r` into `ServerSentEvent(event=..., id=...)` emits raw newlines into the `text/event-stream` wire frame, allowing malformed input to split SSE frames or inject rogue fields.
- **Level 2 — Code-Level Defect**: In `fastapi/sse.py:ServerSentEvent`, `id` only validated against null bytes (`\0` via `_check_id_no_null`) and `event` had no validator at all, permitting `\r` and `\n` in single-line SSE header fields.
- **Level 3 — Architectural Root Cause**: WHATWG Server-Sent Events framing uses `\r` and `\n` as field/event delimiters; multi-line `data` is split across multiple `data:` lines by the encoder, whereas `event` and `id` must be single-line tokens.
- **Actionable Fix & BCF Brain Insight**: Adding `_check_single_line(v, field_name)` raising `ValueError(f"SSE '{field_name}' must be a single line")` on `'\r' in v or '\n' in v` via `AfterValidator` on both `event` and `id` hardens SSE serialization.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/sse.py
+++ b/fastapi/sse.py
@@ -33,10 +33,20 @@ class EventSourceResponse(StreamingResponse):
     media_type = "text/event-stream"
 
 
-def _check_id_no_null(v: str | None) -> str | None:
+def _check_single_line(v: str | None, field_name: str) -> str | None:
+    if v is not None and ("\r" in v or "\n" in v):
+        raise ValueError(f"SSE '{field_name}' must be a single line")
+    return v
+
+
+def _check_event_single_line(v: str | None) -> str | None:
+    return _check_single_line(v, "event")
+
+
+def _check_id_valid(v: str | None) -> str | None:
     if v is not None and "\0" in v:
         raise ValueError("SSE 'id' must not contain null characters")
-    return v
+    return _check_single_line(v, "id")
 
 
 class ServerSentEvent(BaseModel):
@@ -86,24 +96,27 @@ class ServerSentEvent(BaseModel):
# ... [30 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [70/129] `requests_7427` — Port bpo-39057 to Requests

- **Repository & Baseline**: `psf/requests` @ `b684dcb9bbf3` (`2026-05-11`) | **Prompt Length**: `394` chars | **Complexity**: `T2-Surgical (6-25L)` (`+4 / -2` across `1` file(s))
- **Production Files Modified**: `src/requests/utils.py`
- **Hidden Grading Test Files**: `tests/test_utils.py` (`+23 / -0` test lines)
- **Active Traps**: `TRAP-8` | **Assigned BCF Card**: `DC-04 (Domain Boundary Suffix Matching)`
- **Level 1 — Observable Symptom**: With `no_proxy=localhost` or `no_proxy=newdomain.com:1234`, Requests erroneously bypasses the proxy for `http://prelocalhost/`! Plain `.endswith(host)` matches partial hostnames without a dot label boundary.
- **Level 2 — Code-Level Defect**: In `src/requests/utils.py:should_bypass_proxies()`, `if hostname.endswith(host) or host_with_port.endswith(host):` checked raw string suffix without requiring either exact equality (`hostname == host`) or a leading dot separator (`'.' + host`).
- **Level 3 — Architectural Root Cause**: Missing DNS label-boundary anchor in suffix comparison (the exact bug fixed in CPython `urllib.request.proxy_bypass_environment` under `bpo-39057` / `gh-83238` and `curl`).
- **Actionable Fix & BCF Brain Insight**: Normalizing `host = host.lstrip('.')`, checking exact match `hostname == host or host_with_port == host`, and then checking `.endswith('.' + host)` enforces strict DNS domain boundaries.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/src/requests/utils.py
+++ b/src/requests/utils.py
@@ -851,9 +851,11 @@ def get_proxy(key: str) -> str | None:
                 host_with_port += f":{parsed.port}"
 
             for host in no_proxy_hosts:
+                host = host.lstrip(".")
+                if hostname == host or host_with_port == host:
+                    return True
+                host = "." + host
                 if hostname.endswith(host) or host_with_port.endswith(host):
-                    # The URL does match something in no_proxy, so we don't want
-                    # to apply the proxies on this URL.
                     return True
 
     with set_environ("no_proxy", no_proxy_arg):
```
</details>

##### [71/129] `requests_7315` — Preserve leading slashes in request path_url

- **Repository & Baseline**: `psf/requests` @ `6360477c5230` (`2026-05-10`) | **Prompt Length**: `694` chars | **Complexity**: `T1-Micro (1-5L)` (`+0 / -2` across `1` file(s))
- **Production Files Modified**: `src/requests/adapters.py`
- **Hidden Grading Test Files**: `tests/test_adapters.py` (`+2 / -2` test lines)
- **Active Traps**: `TRAP-1` | **Assigned BCF Card**: `DC-11 (Spec-Reversal Trap-1 Awareness)`
- **Level 1 — Observable Symptom**: Requests to AWS S3 presigned URLs whose object key begins with `/` (`https://bucket.s3.amazonaws.com//key.txt`) fail signature verification (`403 SignatureDoesNotMatch`) because Requests collapses `//key.txt` to `/key.txt`!
- **Level 2 — Code-Level Defect**: In `src/requests/adapters.py:HTTPAdapter.request_url()`, lines 548–549 (`if url.startswith('//'): url = f'/{url.lstrip("/")}'`, added in #6644) destructively mutated valid RFC 9110 double-slash paths after `urllib3` fixed its own parser.
- **Level 3 — Architectural Root Cause**: Workaround obsolescence: once upstream `urllib3` handled `//` paths properly, Requests' defensive slash-trimming became an active data-corruption bug for S3 presigned URLs.
- **Actionable Fix & BCF Brain Insight**: Deleting those 2 lines restores `//` preservation. **PURE TRAP-1**: Visible `tests/test_adapters.py` still runs `assert '/v:h' == a.request_url(p, {})` from #6644 and turns RED when fixed! Only `test_patch` flips the assertion to `'//v:h'`. Never self-revert!

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/src/requests/adapters.py
+++ b/src/requests/adapters.py
@@ -545,8 +545,6 @@ def request_url(self, request, proxies):
             using_socks_proxy = proxy_scheme.startswith("socks")
 
         url = request.path_url
-        if url.startswith("//"):  # Don't confuse urllib3
-            url = f"/{url.lstrip('/')}"
 
         if is_proxied_http_request and not using_socks_proxy:
             url = urldefragauth(request.url)
```
</details>

##### [72/129] `requests_7309` — Fix malformed value parsing for Content-Type

- **Repository & Baseline**: `psf/requests` @ `7407309c8a8a` (`2026-03-30`) | **Prompt Length**: `406` chars | **Complexity**: `T2-Surgical (6-25L)` (`+6 / -9` across `1` file(s))
- **Production Files Modified**: `src/requests/utils.py`
- **Hidden Grading Test Files**: `tests/test_utils.py` (`+4 / -4` test lines)
- **Active Traps**: `TRAP-1` | **Assigned BCF Card**: `DC-04 (RFC 9110 Header Parameter Parsing)`
- **Level 1 — Observable Symptom**: `requests.utils._parse_content_type_header('application/json; no_equals')` injects a non-string boolean `{'no_equals': True}` into the returned parameters `dict`, violating its `dict[str, str]` contract and breaking downstream callers.
- **Level 2 — Code-Level Defect**: In `src/requests/utils.py:_parse_content_type_header()`, lines 521–526 initialized `key, value = param, True` before checking `if index_of_equals != -1:`, storing `True` whenever `=` was absent.
- **Level 3 — Architectural Root Cause**: Permissive non-RFC fallback (`value = True`) contradicted RFC 1521 through RFC 9110 (`parameter = token "=" ( token / quoted-string )`), which mandate `=` in media-type parameters.
- **Actionable Fix & BCF Brain Insight**: Only populating `params_dict[key.lower()] = value` when `(idx := param.find('=')) != -1` skips malformed tokens cleanly. **TRAP-1**: Visible `tests/test_utils.py` explicitly asserted `'no_equals': True` in 3 test cases, which turn RED locally until `test_patch` removes them!

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/src/requests/utils.py
+++ b/src/requests/utils.py
@@ -502,26 +502,23 @@ def get_encodings_from_content(content):
 
 
 def _parse_content_type_header(header):
-    """Returns content type and parameters from given header
+    """Returns content type and parameters from given header.
 
     :param header: string
     :return: tuple containing content type and dictionary of
-         parameters
+         parameters.
     """
 
     tokens = header.split(";")
     content_type, params = tokens[0].strip(), tokens[1:]
     params_dict = {}
-    items_to_strip = "\"' "
+    strip_chars = "\"' "
 
     for param in params:
         param = param.strip()
-        if param:
-            key, value = param, True
-            index_of_equals = param.find("=")
# ... [8 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [73/129] `fastapi_14077` — ⬆️ Upgrade Starlette supported version range to >=0.40.0,<0.49.0

- **Repository & Baseline**: `fastapi/fastapi` @ `16d75d90eb96` (`2025-09-16`) | **Prompt Length**: `677` chars | **Complexity**: `T2-Surgical (6-25L)` (`+5 / -6` across `3` file(s))
- **Production Files Modified**: `docs_src/handling_errors/tutorial005.py`, `fastapi/exception_handlers.py`, `fastapi/openapi/utils.py`
- **Hidden Grading Test Files**: `tests/test_enforce_once_required_parameter.py` (`+1 / -1` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-2`, `TRAP-4`, `TRAP-7` | **Assigned BCF Card**: `DC-11 (Version-Agnostic Literal Status Constant)`
- **Level 1 — Observable Symptom**: Upgrading Starlette to `>=0.48.0` emits deprecation warnings whenever FastAPI imports or references `HTTP_422_UNPROCESSABLE_ENTITY` (renamed in Starlette 0.48 to `HTTP_422_UNPROCESSABLE_CONTENT` per RFC 9110).
- **Level 2 — Code-Level Defect**: `fastapi/exception_handlers.py`, `fastapi/openapi/utils.py`, and `docs_src/handling_errors/tutorial005.py` imported `HTTP_422_UNPROCESSABLE_ENTITY` from `starlette.status`.
- **Level 3 — Architectural Root Cause**: Cross-version constant rename in Starlette 0.48: using the new name breaks `starlette < 0.48`, while using the old name triggers deprecation warnings on `starlette >= 0.48`.
- **Actionable Fix & BCF Brain Insight**: Replacing `HTTP_422_UNPROCESSABLE_ENTITY` with integer `422` (and `'422'` in OpenAPI keys) across all 3 files achieves zero-warning compatibility across the entire `>=0.40.0,<0.49.0` Starlette range.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/docs_src/handling_errors/tutorial005.py
+++ b/docs_src/handling_errors/tutorial005.py
@@ -1,4 +1,4 @@
-from fastapi import FastAPI, Request, status
+from fastapi import FastAPI, Request
 from fastapi.encoders import jsonable_encoder
 from fastapi.exceptions import RequestValidationError
 from fastapi.responses import JSONResponse
@@ -10,7 +10,7 @@
 @app.exception_handler(RequestValidationError)
 async def validation_exception_handler(request: Request, exc: RequestValidationError):
     return JSONResponse(
-        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
+        status_code=422,
         content=jsonable_encoder({"detail": exc.errors(), "body": exc.body}),
     )
 
--- a/fastapi/exception_handlers.py
+++ b/fastapi/exception_handlers.py
@@ -5,7 +5,7 @@
 from starlette.exceptions import HTTPException
 from starlette.requests import Request
 from starlette.responses import JSONResponse, Response
-from starlette.status import HTTP_422_UNPROCESSABLE_ENTITY, WS_1008_POLICY_VIOLATION
+from starlette.status import WS_1008_POLICY_VIOLATION
 
# ... [30 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [74/129] `requests_6757` — Test on urllib3 1.26.x

- **Repository & Baseline**: `psf/requests` @ `0e322af87745` (`2024-07-30`) | **Prompt Length**: `268` chars | **Complexity**: `T2-Surgical (6-25L)` (`+16 / -1` across `2` file(s))
- **Production Files Modified**: `src/requests/compat.py`, `src/requests/utils.py`
- **Hidden Grading Test Files**: `tests/test_requests.py` (`+24 / -17` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-2`, `TRAP-7`, `TRAP-8` | **Assigned BCF Card**: `DC-04 (Upstream Major-Version Compat Guard)`
- **Level 1 — Observable Symptom**: Running Requests against `urllib3 1.26.x` fails `Content-Length` calculation on non-ASCII `str` bodies after #6589 unconditionally encoded `str` as UTF-8 in `super_len()`, because `urllib3 1.x` encodes `str` via Latin-1 (`iso-8859-1`).
- **Level 2 — Code-Level Defect**: `src/requests/compat.py` lacked an `is_urllib3_1` major-version flag, and `src/requests/utils.py:super_len()` unconditionally ran `o = o.encode('utf-8')` regardless of the installed `urllib3` major version.
- **Level 3 — Architectural Root Cause**: Cross-major-version dependency divergence: `urllib3 1.26.x` delegates `str` body encoding to stdlib `http.client` (Latin-1, 1 byte/codepoint), whereas `urllib3 2.x` encodes `str` as UTF-8.
- **Actionable Fix & BCF Brain Insight**: Defining `is_urllib3_1 = int(urllib3_version.split('.')[0]) == 1` in `compat.py` and guarding `if not is_urllib3_1 and isinstance(o, str):` in `super_len` supports both `urllib3` 1.x and 2.x.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/src/requests/compat.py
+++ b/src/requests/compat.py
@@ -10,6 +10,18 @@
 import importlib
 import sys
 
+# -------
+# urllib3
+# -------
+from urllib3 import __version__ as urllib3_version
+
+# Detect which major version of urllib3 is being used.
+try:
+    is_urllib3_1 = int(urllib3_version.split(".")[0]) == 1
+except (TypeError, AttributeError):
+    # If we can't discern a version, prefer old functionality.
+    is_urllib3_1 = True
+
 # -------------------
 # Character Detection
 # -------------------
--- a/src/requests/utils.py
+++ b/src/requests/utils.py
@@ -38,6 +38,7 @@
     getproxies,
     getproxies_environment,
# ... [16 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [75/129] `requests_6644` — Trim excess leading path separators

- **Repository & Baseline**: `psf/requests` @ `382fc2c0c6c0` (`2024-02-23`) | **Prompt Length**: `295` chars | **Complexity**: `T1-Micro (1-5L)` (`+3 / -0` across `1` file(s))
- **Production Files Modified**: `src/requests/adapters.py`
- **Hidden Grading Test Files**: `tests/test_adapters.py` (`+8 / -0` test lines)
- **Active Traps**: `TRAP-6` | **Assigned BCF Card**: `DC-04 (URI Path Authority Disambiguation)`
- **Level 1 — Observable Symptom**: Sending a request with multiple leading slashes in the path (`http://127.0.0.1:10000//v:h`) causes `urllib3` `ConnectionPool.urlopen` to misparse `//v:h` as a network-path reference (`host='v', port='h'`), raising `LocationParseError`.
- **Level 2 — Code-Level Defect**: In `src/requests/adapters.py:HTTPAdapter.request_url()`, `url = request.path_url` forwarded leading `//` verbatim to `urllib3`.
- **Level 3 — Architectural Root Cause**: RFC 3986 URI reference ambiguity in `urllib3`'s `parse_url` when `urlopen` receives an `origin-form` target beginning with `//`.
- **Actionable Fix & BCF Brain Insight**: Adding `if url.startswith('//'): url = f'/{url.lstrip("/")}'` in `HTTPAdapter.request_url` prevented `urllib3` authority misparsing at that point in Requests' history.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/src/requests/adapters.py
+++ b/src/requests/adapters.py
@@ -390,6 +390,9 @@ def request_url(self, request, proxies):
             using_socks_proxy = proxy_scheme.startswith("socks")
 
         url = request.path_url
+        if url.startswith("//"):  # Don't confuse urllib3
+            url = f"/{url.lstrip('/')}"
+
         if is_proxied_http_request and not using_socks_proxy:
             url = urldefragauth(request.url)
```
</details>

##### [76/129] `requests_6589` — Enhance `super_len` to count encoded bytes for str

- **Repository & Baseline**: `psf/requests` @ `7a13c041dbef` (`2024-02-23`) | **Prompt Length**: `237` chars | **Complexity**: `T1-Micro (1-5L)` (`+3 / -0` across `1` file(s))
- **Production Files Modified**: `src/requests/utils.py`
- **Hidden Grading Test Files**: `tests/test_requests.py` (`+17 / -0` test lines)
- **Active Traps**: `TRAP-6`, `TRAP-8` | **Assigned BCF Card**: `DC-04 (UTF-8 Byte Length vs Codepoint Length)`
- **Level 1 — Observable Symptom**: Passing a Python `str` containing multi-byte UTF-8 characters (e.g., `'☃️'`) as `data` to `requests.Request('POST', url, data=s).prepare()` sets `Content-Length` to the character count (`len(s)`) instead of the UTF-8 byte count (`len(s.encode('utf-8'))`), truncating the body!
- **Level 2 — Code-Level Defect**: In `src/requests/utils.py:super_len()`, `if hasattr(o, '__len__'): total_length = len(o)` measured Unicode codepoints on `str` objects even though `urllib3` v2 encodes `str` bodies as UTF-8 bytes on the wire.
- **Level 3 — Architectural Root Cause**: Wire-encoding shift between `http.client`/`urllib3` v1 (ISO-8859-1 1-byte-per-char) and `urllib3` v2 (UTF-8 variable-byte encoding) broke `len(str) == byte_length`.
- **Actionable Fix & BCF Brain Insight**: Adding `if isinstance(o, str): o = o.encode('utf-8')` at the top of `super_len(o)` computes exact UTF-8 byte length.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/src/requests/utils.py
+++ b/src/requests/utils.py
@@ -134,6 +134,9 @@ def super_len(o):
     total_length = None
     current_position = 0
 
+    if isinstance(o, str):
+        o = o.encode("utf-8")
+
     if hasattr(o, "__len__"):
         total_length = len(o)
```
</details>

##### [77/129] `requests_6592` — "TOO_EARLY" type definition for status code 425

- **Repository & Baseline**: `psf/requests` @ `0b4d494192de` (`2023-12-16`) | **Prompt Length**: `237` chars | **Complexity**: `T1-Micro (1-5L)` (`+1 / -1` across `1` file(s))
- **Production Files Modified**: `src/requests/status_codes.py`
- **Hidden Grading Test Files**: `tests/test_requests.py` (`+15 / -0` test lines)
- **Active Traps**: `TRAP-6`, `TRAP-8` | **Assigned BCF Card**: `DC-04 (RFC Status Registry Alias)`
- **Level 1 — Observable Symptom**: `requests.codes.too_early` / `requests.codes['TOO_EARLY']` returns `None` instead of `425`, even though RFC 8470 standardized HTTP 425 as `Too Early` (replacing WebDAV `unordered_collection`).
- **Level 2 — Code-Level Defect**: In `src/requests/status_codes.py`, `_codes[425]` only listed `('unordered_collection', 'unordered')`.
- **Level 3 — Architectural Root Cause**: Registry lag behind IETF RFC 8470 reassigning status code 425 from draft WebDAV `Unordered Collection` to `Too Early`.
- **Actionable Fix & BCF Brain Insight**: Updating `_codes[425]` to `('unordered_collection', 'unordered', 'too_early')` adds `TOO_EARLY` while preserving backwards-compatible aliases.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/src/requests/status_codes.py
+++ b/src/requests/status_codes.py
@@ -79,7 +79,7 @@
     422: ("unprocessable_entity", "unprocessable"),
     423: ("locked",),
     424: ("failed_dependency", "dependency"),
-    425: ("unordered_collection", "unordered"),
+    425: ("unordered_collection", "unordered", "too_early"),
     426: ("upgrade_required", "upgrade"),
     428: ("precondition_required", "precondition"),
     429: ("too_many_requests", "too_many"),
```
</details>

#### SUB-4C: Non-Cloning Router Contexts, Native SSE/SPA Subsystems & Twin-Tree Protocol Refactors (8 Tasks)

##### [78/129] `fastapi_15030` — ✨ Add support for Server Sent Events

- **Repository & Baseline**: `fastapi/fastapi` @ `48d58ae3b6ef` (`2026-03-01`) | **Prompt Length**: `148` chars | **Complexity**: `T4-Arch (>80L)` (`+525 / -35` across `9` file(s))
- **Production Files Modified**: `docs_src/server_sent_events/tutorial001_py310.py`, `docs_src/server_sent_events/tutorial002_py310.py`, `docs_src/server_sent_events/tutorial003_py310.py`, `docs_src/server_sent_events/tutorial004_py310.py`, `docs_src/server_sent_events/tutorial005_py310.py`, `fastapi/openapi/utils.py`, `fastapi/responses.py`, `fastapi/routing.py`, ... (+1 more; 9 total)
- **Hidden Grading Test Files**: `tests/test_sse.py`, `tests/test_tutorial/test_server_sent_events/test_tutorial001.py`, `tests/test_tutorial/test_server_sent_events/test_tutorial002.py`, `tests/test_tutorial/test_server_sent_events/test_tutorial003.py`, `tests/test_tutorial/test_server_sent_events/test_tutorial004.py`, ... (+1 more) (`+970 / -0` test lines)
- **Active Traps**: `TRAP-2`, `TRAP-4`, `TRAP-5`, `TRAP-8` | **Assigned BCF Card**: `DC-15 (Full Subsystem + OpenAPI + docs_src Sync)`
- **Level 1 — Observable Symptom**: FastAPI lacks native first-class Server-Sent Events (`EventSourceResponse`, `ServerSentEvent`, automatic Pydantic JSON encoding of yielded items, keep-alive ping comments, and `text/event-stream` OpenAPI schemas).
- **Level 2 — Code-Level Defect**: `fastapi/sse.py` did not exist, `fastapi/routing.py` lacked SSE stream wrapping for sync/async generators, `fastapi/responses.py` did not re-export `EventSourceResponse`, and `fastapi/openapi/utils.py` lacked `itemSchema` SSE generation.
- **Level 3 — Architectural Root Cause**: Feature addition introducing W3C/WHATWG `text/event-stream` streaming with Pydantic `TypeAdapter` validation/serialization, periodic keep-alive comments, and 5 executable tutorials.
- **Actionable Fix & BCF Brain Insight**: Implementing `fastapi/sse.py` (`ServerSentEvent`, `EventSourceResponse`, `format_sse_event`), wiring generator stream handlers in `routing.py` and `openapi/utils.py`, and adding `docs_src/server_sent_events/tutorial001..005_py310.py` spans 9 files (`+525/-35`).

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/docs_src/server_sent_events/tutorial001_py310.py
+++ b/docs_src/server_sent_events/tutorial001_py310.py
@@ -0,0 +1,43 @@
+from collections.abc import AsyncIterable, Iterable
+
+from fastapi import FastAPI
+from fastapi.sse import EventSourceResponse
+from pydantic import BaseModel
+
+app = FastAPI()
+
+
+class Item(BaseModel):
+    name: str
+    description: str | None
+
+
+items = [
+    Item(name="Plumbus", description="A multi-purpose household device."),
+    Item(name="Portal Gun", description="A portal opening device."),
+    Item(name="Meeseeks Box", description="A box that summons a Meeseeks."),
+]
+
+
+@app.get("/items/stream", response_class=EventSourceResponse)
+async def sse_items() -> AsyncIterable[Item]:
# ... [643 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [79/129] `fastapi_15280` — ✨ Add support for `@app.vibe()`

- **Repository & Baseline**: `fastapi/fastapi` @ `6ee87478d821` (`2026-04-01`) | **Prompt Length**: `64` chars | **Complexity**: `T3-Moderate (26-80L)` (`+71 / -1` across `2` file(s))
- **Production Files Modified**: `docs_src/vibe/tutorial001_py310.py`, `fastapi/applications.py`
- **Hidden Grading Test Files**: `tests/test_vibe.py` (`+17 / -0` test lines)
- **Active Traps**: `TRAP-2`, `TRAP-4`, `TRAP-5` | **Assigned BCF Card**: `DC-08 (Exact Exception Message & Tutorial Sync)`
- **Level 1 — Observable Symptom**: April 1st feature PR (`✨ Add support for @app.vibe()`) adds `app.vibe(path, *, prompt='')` decorator on `FastAPI` and `docs_src/vibe/tutorial001_py310.py`.
- **Level 2 — Code-Level Defect**: `FastAPI` in `fastapi/applications.py` lacked the `vibe()` method, which intentionally refuses unvalidated LLM-driven database endpoints by raising `FastAPIError`.
- **Level 3 — Architectural Root Cause**: Opaque 64-character prompt (`✨ Add support for @app.vibe()`) concealing an Easter-egg safety guard (`raise FastAPIError('Are you kidding me? ...')`) verified by `pytest.raises(FastAPIError, match='Are you kidding me')`.
- **Actionable Fix & BCF Brain Insight**: Shows why opaque `PC-5` feature prompts without specs are hard on blind benchmarks unless repository context/docs give cues; `vibe()` raises `FastAPIError` on decoration.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/docs_src/vibe/tutorial001_py310.py
+++ b/docs_src/vibe/tutorial001_py310.py
@@ -0,0 +1,12 @@
+from typing import Any
+
+from fastapi import FastAPI
+
+app = FastAPI()
+
+
+@app.vibe(
+    "/vibe/",
+    prompt="pls return json of users from database. make no mistakes",
+)
+async def ai_vibes(body: Any): ...
--- a/fastapi/applications.py
+++ b/fastapi/applications.py
@@ -10,7 +10,11 @@
     request_validation_exception_handler,
     websocket_request_validation_exception_handler,
 )
-from fastapi.exceptions import RequestValidationError, WebSocketRequestValidationError
+from fastapi.exceptions import (
+    FastAPIError,
+    RequestValidationError,
+    WebSocketRequestValidationError,
# ... [65 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [80/129] `fastapi_14306` — 🚸  Improve tracebacks by adding endpoint metadata

- **Repository & Baseline**: `fastapi/fastapi` @ `08b09e5236e3` (`2025-12-06`) | **Prompt Length**: `2791` chars | **Complexity**: `T4-Arch (>80L)` (`+121 / -16` across `2` file(s))
- **Production Files Modified**: `fastapi/exceptions.py`, `fastapi/routing.py`
- **Hidden Grading Test Files**: `tests/test_validation_error_context.py` (`+168 / -0` test lines)
- **Active Traps**: `TRAP-2`, `TRAP-4` | **Assigned BCF Card**: `DC-08 (Cached Traceback EndpointContext Metadata)`
- **Level 1 — Observable Symptom**: Server logs for `ResponseValidationError`, `RequestValidationError`, and `WebSocketRequestValidationError` omit which endpoint file, line number, function name, and HTTP route triggered the validation failure.
- **Level 2 — Code-Level Defect**: `ValidationException` in `fastapi/exceptions.py` stored only `self._errors` without `endpoint_ctx: EndpointContext`, and `fastapi/routing.py` never extracted `inspect.getsourcelines` metadata to pass into raised validation errors.
- **Level 3 — Architectural Root Cause**: Pydantic `ValidationError` runs inside generic FastAPI routing wrappers (`serialize_response`, `get_request_handler`), divorcing the Python traceback from the user's endpoint definition site.
- **Actionable Fix & BCF Brain Insight**: Caching `_extract_endpoint_context(call)` once at route registration (`file`, `line`, `function`, `path`) and formatting IDE-clickable `File "...", line N, in fn` inside `ValidationException.__str__` (without altering HTTP 422 JSON bodies) solves server-log diagnosability.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/exceptions.py
+++ b/fastapi/exceptions.py
@@ -1,4 +1,4 @@
-from typing import Any, Dict, Optional, Sequence, Type, Union
+from typing import Any, Dict, Optional, Sequence, Type, TypedDict, Union
 
 from annotated_doc import Doc
 from pydantic import BaseModel, create_model
@@ -7,6 +7,13 @@
 from typing_extensions import Annotated
 
 
+class EndpointContext(TypedDict, total=False):
+    function: str
+    path: str
+    file: str
+    line: int
+
+
 class HTTPException(StarletteHTTPException):
     """
     An HTTP exception you can raise in your own code to show errors to the client.
@@ -155,30 +162,72 @@ class DependencyScopeError(FastAPIError):
 
 
 class ValidationException(Exception):
# ... [216 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [81/129] `httpx_3672` — Server connection handling.

- **Repository & Baseline**: `encode/httpx` @ `4acf5c2c3771` (`2025-09-19`) | **Prompt Length**: `243` chars | **Complexity**: `T3-Moderate (26-80L)` (`+57 / -22` across `7` file(s))
- **Production Files Modified**: `src/ahttpx/_parsers.py`, `src/ahttpx/_pool.py`, `src/ahttpx/_server.py`, `src/httpx/_network.py`, `src/httpx/_parsers.py`, `src/httpx/_pool.py`, `src/httpx/_server.py`
- **Hidden Grading Test Files**: `tests/test_parsers.py` (`+5 / -5` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-2`, `TRAP-3`, `TRAP-4`, `TRAP-5` | **Assigned BCF Card**: `DC-11 + DC-15 (Alias Preservation, `unasync` Generator & Twin-Tree Sync)`
- **Level 1 — Observable Symptom**: 243-char 5-bullet maintainer checklist on `encode/httpx` (`v1` branch): add keep-alive check on `HTTPParser`, drain request body on server keep-alive, rename `HTTPParser.complete` -> `.reset`, close streams on server exit, and suppress `KeyboardInterrupt` on server exit.
- **Level 2 — Code-Level Defect**: In `src/ahttpx/` (async source) and `scripts/unasync`-generated `src/httpx/` (sync twin) plus non-generated `src/httpx/_network.py`: `complete()` returned `None` instead of `bool`, `is_keepalive()` was missing, `_server.py:92` wrote `await self._parser.complete` *without parentheses* (latent `TypeError` in async, silent no-op in sync!), `_network.py` wrote `self._streams = list[NetworkStream]` (type alias instead of `[]`), and `wait()` leaked `KeyboardInterrupt`.
- **Level 3 — Architectural Root Cause**: Six stacked landmines in one PR: prompt typos (`keep_alive` vs `is_keepalive()`, `KeyboardException` vs `KeyboardInterrupt`), unmarked `scripts/unasync` codegen over 15/16 files, missing `()` call syntax invisible to regexes with `(`, AST graph blind to `async def` (Trap-6), and visible `tests/test_parsers.py` calling `p.complete()` at 5 lines (Trap-1).
- **Actionable Fix & BCF Brain Insight**: Editing `src/ahttpx/` + running `scripts/unasync` + fixing `src/httpx/_network.py`, adding `()` at `_server.py:92`, AND keeping `complete = reset` alias on `HTTPParser` makes *both* visible `p.complete()` and hidden `p.reset()` tests pass 100% green!

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/src/ahttpx/_parsers.py
+++ b/src/ahttpx/_parsers.py
@@ -375,13 +375,13 @@ async def recv_body(self) -> bytes:
             self.recv_state = State.DONE
         return body
 
-    async def complete(self):
+    async def reset(self) -> bool:
         is_fully_complete = self.send_state == State.DONE and self.recv_state == State.DONE
         is_keepalive = self.send_keep_alive and self.recv_keep_alive
 
         if not (is_fully_complete and is_keepalive):
             await self.close()
-            return
+            return False
 
         if self.mode == Mode.CLIENT:
             self.send_state = State.SEND_METHOD_LINE
@@ -397,13 +397,21 @@ async def complete(self):
         self.send_keep_alive = True
         self.recv_keep_alive = True
         self.processing_1xx = False
+        return True
 
     async def close(self):
         if self.send_state != State.CLOSED:
# ... [232 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [82/129] `fastapi_15800` — ✨ Add support for `app.frontend("/", directory="dist")` and `router.frontend("/", directory="dist")`

- **Repository & Baseline**: `fastapi/fastapi` @ `f1d750fddad9` (`2026-06-20`) | **Prompt Length**: `1234` chars | **Complexity**: `T4-Arch (>80L)` (`+649 / -5` across `8` file(s))
- **Production Files Modified**: `docs_src/frontend/tutorial001_py310.py`, `docs_src/frontend/tutorial002_py310.py`, `docs_src/frontend/tutorial003_py310.py`, `docs_src/frontend/tutorial004_py310.py`, `docs_src/frontend/tutorial005_py310.py`, `docs_src/frontend/tutorial006_py310.py`, `fastapi/applications.py`, `fastapi/routing.py`
- **Hidden Grading Test Files**: `tests/test_frontend.py` (`+858 / -0` test lines)
- **Active Traps**: `TRAP-2`, `TRAP-4` | **Assigned BCF Card**: `DC-15 (SPA Static Routing + docs_src Sync)`
- **Level 1 — Observable Symptom**: FastAPI lacks built-in `app.frontend(path, directory=..., fallback=...)` and `router.frontend(...)` support to serve single-page application (SPA) static builds with `index.html` / `404.html` fallbacks without shadowing API routes.
- **Level 2 — Code-Level Defect**: Neither `FastAPI` (`applications.py`) nor `APIRouter` (`routing.py`) provided a dedicated frontend static-asset route class handling prefix stripping, directory traversal containment, HTML fallback routing, and API-first route precedence.
- **Level 3 — Architectural Root Cause**: Mounting Starlette's `StaticFiles(html=True)` at `'/'` shadows subsequent routers or fails SPA client-side history routes unless wrapped in a route-context-aware fallback handler.
- **Actionable Fix & BCF Brain Insight**: Implementing `frontend()` on `FastAPI` and `APIRouter` backed by safe path resolution, fallback handling, and 6 tutorials (`docs_src/frontend/tutorial001..006_py310.py`) spans 8 files (`+649/-5`).

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/docs_src/frontend/tutorial001_py310.py
+++ b/docs_src/frontend/tutorial001_py310.py
@@ -0,0 +1,5 @@
+from fastapi import FastAPI
+
+app = FastAPI()
+
+app.frontend("/", directory="dist")
--- a/docs_src/frontend/tutorial002_py310.py
+++ b/docs_src/frontend/tutorial002_py310.py
@@ -0,0 +1,5 @@
+from fastapi import FastAPI
+
+app = FastAPI()
+
+app.frontend("/", directory="dist", fallback="index.html")
--- a/docs_src/frontend/tutorial003_py310.py
+++ b/docs_src/frontend/tutorial003_py310.py
@@ -0,0 +1,5 @@
+from fastapi import FastAPI
+
+app = FastAPI()
+
+app.frontend("/", directory="dist", fallback="404.html")
--- a/docs_src/frontend/tutorial004_py310.py
+++ b/docs_src/frontend/tutorial004_py310.py
# ... [778 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [83/129] `fastapi_15785` — ✨ Add `iter_route_contexts()` for advanced use cases that used to use `router.routes` (e.g. Jupyverse)

- **Repository & Baseline**: `fastapi/fastapi` @ `202b2d2f5f33` (`2026-06-18`) | **Prompt Length**: `1261` chars | **Complexity**: `T4-Arch (>80L)` (`+66 / -15` across `2` file(s))
- **Production Files Modified**: `fastapi/openapi/utils.py`, `fastapi/routing.py`
- **Hidden Grading Test Files**: `tests/test_router_include_context.py` (`+104 / -1` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-2` | **Assigned BCF Card**: `DC-11 (Public API Surface Extraction)`
- **Level 1 — Observable Symptom**: After #15745 stopped cloning routes into `app.routes`, advanced integrations like `Jupyverse` that inspected `router.routes` directly lacked a public API to iterate effective mounted routes with resolved paths, dependencies, and OpenAPI metadata.
- **Level 2 — Code-Level Defect**: `_EffectiveRouteContext` and `_iter_routes_with_context` in `fastapi/routing.py` were private internal helpers returning `(route, context | None)` tuples rather than a clean public `RouteContext` / `iter_route_contexts()` iterator.
- **Level 3 — Architectural Root Cause**: Encapsulation gap following the non-cloning router refactor (#15745) left external framework extensions without a supported traversal contract.
- **Actionable Fix & BCF Brain Insight**: Promoting `RouteContext` and `iter_route_contexts(routes)` in `fastapi/routing.py` and refactoring `fastapi/openapi/utils.py` (`get_openapi`, `get_fields_from_routes`) to accept `Sequence[BaseRoute | RouteContext]` provides a clean public interface.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/openapi/utils.py
+++ b/fastapi/openapi/utils.py
@@ -479,26 +479,22 @@ def get_openapi_path(
 
 
 def _get_api_route_for_openapi(
-    route: BaseRoute, route_context: routing._EffectiveRouteContext | None
+    route_context: routing.RouteContext,
 ) -> routing._APIRouteLike | None:
-    if route_context is not None and isinstance(
-        route_context.original_route, routing.APIRoute
-    ):
+    if isinstance(route_context.original_route, routing.APIRoute):
         return cast(routing._APIRouteLike, route_context)
-    if isinstance(route, routing.APIRoute):
-        return cast(routing._APIRouteLike, route)
     return None
 
 
 def get_fields_from_routes(
-    routes: Sequence[BaseRoute],
+    routes: Sequence[BaseRoute | routing.RouteContext],
 ) -> list[ModelField]:
     body_fields_from_routes: list[ModelField] = []
     responses_from_routes: list[ModelField] = []
     request_fields_from_routes: list[ModelField] = []
# ... [112 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [84/129] `fastapi_15763` — 🐛 Fix bug, allow empty path in path operation in prefixless router

- **Repository & Baseline**: `fastapi/fastapi` @ `9a9c4ad5d06f` (`2026-06-15`) | **Prompt Length**: `1062` chars | **Complexity**: `T2-Surgical (6-25L)` (`+10 / -3` across `1` file(s))
- **Production Files Modified**: `fastapi/routing.py`
- **Hidden Grading Test Files**: `tests/test_router_include_context.py` (`+55 / -0` test lines)
- **Active Traps**: `STD` | **Assigned BCF Card**: `DC-04 (Effective Mounted Path Validation)`
- **Level 1 — Observable Symptom**: Including an intermediate `parent_router = APIRouter()` (no prefix) that itself included `child_router` with `prefix='/items'` and `@child_router.get('')` erroneously raises `FastAPIError: Prefix and path cannot be both empty`!
- **Level 2 — Code-Level Defect**: In `fastapi/routing.py:APIRouter.include_router()`, the `else:` branch (when `prefix == ''`) iterated `_iter_included_route_candidates(router.routes)` and read raw `getattr(r, 'path', None)` (`''` on the leaf route) instead of the *effective* prefixed path (`/items`) from `_iter_routes_with_context`!
- **Level 3 — Architectural Root Cause**: Post-#15745 regression: because sub-router routes are no longer mutated/cloned with intermediate prefixes on `.path`, inspecting `r.path` directly ignored prefixes attached at inner `_IncludedRouter` levels.
- **Actionable Fix & BCF Brain Insight**: Iterating `_iter_routes_with_context(router.routes)` and checking `route_context.path` (or `starlette_route.path`) validates the true effective path rather than the unprefixed leaf `APIRoute.path`.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/fastapi/routing.py
+++ b/fastapi/routing.py
@@ -2435,9 +2435,16 @@ def read_users():
                 "A path prefix must not end with '/', as the routes will start with '/'"
             )
         else:
-            for r in _iter_included_route_candidates(router.routes):
-                path = getattr(r, "path", None)
-                name = getattr(r, "name", "unknown")
+            for route, route_context in _iter_routes_with_context(router.routes):
+                if route_context is None:
+                    path = getattr(route, "path", None)
+                    name = getattr(route, "name", "unknown")
+                elif route_context.starlette_route is not None:
+                    path = getattr(route_context.starlette_route, "path", None)
+                    name = getattr(route_context.starlette_route, "name", "unknown")
+                else:
+                    path = route_context.path
+                    name = route_context.name
                 if path is not None and not path:
                     raise FastAPIError(
                         f"Prefix and path cannot be both empty (path operation: {name})"
```
</details>

##### [85/129] `fastapi_15745` — ♻️ Refactor internals to preserve `APIRouter` and `APIRoute` instances

- **Repository & Baseline**: `fastapi/fastapi` @ `016ab760faba` (`2026-06-14`) | **Prompt Length**: `4302` chars | **Complexity**: `T4-Arch (>80L)` (`+939 / -291` across `4` file(s))
- **Production Files Modified**: `docs_src/path_operation_advanced_configuration/tutorial002_py310.py`, `fastapi/applications.py`, `fastapi/openapi/utils.py`, `fastapi/routing.py`
- **Hidden Grading Test Files**: `tests/test_custom_route_class.py`, `tests/test_router_include_context.py` (`+858 / -8` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-2`, `TRAP-4`, `TRAP-8` | **Assigned BCF Card**: `DC-13 (Architectural Router Context Preservation)`
- **Level 1 — Observable Symptom**: `router.include_router(sub_router)` clones and recreates every `APIRoute` from scratch, destroying references to sub-router and `APIRoute` instances, breaking post-inclusion route mutations, and staling OpenAPI caches.
- **Level 2 — Code-Level Defect**: In `fastapi/routing.py`, `include_router` eagerly flattened sub-routers by instantiating brand-new `APIRoute` copies instead of storing `_IncludedRouter` nodes and computing `_EffectiveRouteContext` views dynamically.
- **Level 3 — Architectural Root Cause**: Early FastAPI flat-route-list design conflated route definition objects (`APIRoute`/`APIRouter`) with mounted prefix/dependency/tag composition contexts.
- **Actionable Fix & BCF Brain Insight**: Introducing `_IncludedRouter`, `_EffectiveRouteContext`, `_iter_routes_with_context`, `_get_routes_version()` OpenAPI cache invalidation, and updating `docs_src/path_operation_advanced_configuration/tutorial002_py310.py` preserves router/route identity across 4 files (`+939/-291`).

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/docs_src/path_operation_advanced_configuration/tutorial002_py310.py
+++ b/docs_src/path_operation_advanced_configuration/tutorial002_py310.py
@@ -1,24 +1,14 @@
 from fastapi import FastAPI
 from fastapi.routing import APIRoute
 
-app = FastAPI()
 
-
-@app.get("/items/")
-async def read_items():
-    return [{"item_id": "Foo"}]
+def custom_generate_unique_id(route: APIRoute) -> str:
+    return route.name
 
 
-def use_route_names_as_operation_ids(app: FastAPI) -> None:
-    """
-    Simplify operation IDs so that generated API clients have simpler function
-    names.
+app = FastAPI(generate_unique_id_function=custom_generate_unique_id)
 
-    Should be called only after all routes have been added.
-    """
-    for route in app.routes:
-        if isinstance(route, APIRoute):
# ... [1420 additional diff lines omitted for brevity; full file list above] ...
```
</details>

### CAT-5: Unicode Cell Widths, Grapheme Scanners & Proportional Text Wrapping (10 Tasks)

**Category Overview:** Terminal cell-coordinate and Unicode Extended Grapheme Cluster bugs across ZWJ (`U+200D`) and variation-selector (`U+FE0F`) scanners, versioned UCD width tables, Private Use Area Nerd Font glyphs, double-width CJK line folding, bidirectional cell-cut convergence, and tab span translation.

#### SUB-5A: ZWJ/Variation-Selector Grapheme Scanners, UCD Tables, PUA Widths & Fast-Path Regexes (5 Tasks)

##### [86/129] `rich_4006` — fix for infinite loop in split_graphemes

- **Repository & Baseline**: `Textualize/rich` @ `277010290820` (`2026-02-19`) | **Prompt Length**: `96` chars | **Complexity**: `T3-Moderate (26-80L)` (`+33 / -12` across `1` file(s))
- **Production Files Modified**: `rich/cells.py`
- **Hidden Grading Test Files**: `tests/test_cells.py` (`+38 / -0` test lines)
- **Active Traps**: `TRAP-5` | **Assigned BCF Card**: `DC-07 (Monotonic Scanner Loop Progress Invariant)`
- **Level 1 — Observable Symptom**: `rich.cells.split_graphemes()` and `chop_cells()` hang in an infinite `while` loop when given strings starting with ZWJ/variation-selector (`'\u200d'`, `'\ufe0f'`), ending with `'\u200d'`, or consisting of zero-width control chars (`'\x1b\x1b'`).
- **Level 2 — Code-Level Defect**: In `rich/cells.py:split_graphemes()`, when `character in SPECIAL` (`{'\u200d', '\ufe0f'}`) matched at index `0` (`spans` empty) and `character == '\ufe0f'`, neither `if` nor `elif last_measured_character:` fired—leaving `index` unincremented forever! Also zero-width control characters (`cell_width == 0`) were skipped without appending a span or advancing properly.
- **Level 3 — Architectural Root Cause**: Hand-rolled stateful grapheme scanner lacked a loop-progress invariant (`index` strictly increasing on every branch) for degenerate leading/trailing/control codepoints.
- **Actionable Fix & BCF Brain Insight**: Handling `if not spans: spans.append((index, index := index + 1, 0)); continue`, clamping trailing ZWJ `index += 2 if index < codepoint_count - 1 else 1`, and recording zero-width control spans guarantees $O(N)$ termination.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/cells.py
+++ b/rich/cells.py
@@ -161,14 +161,19 @@ def _cell_len(text: str, unicode_version: str) -> int:
 def split_graphemes(
     text: str, unicode_version: str = "auto"
 ) -> "tuple[list[CellSpan], int]":
-    """Divide text into spans that define a single grapheme.
+    """Divide text into spans that define a single grapheme, and additionally return the cell length of the whole string.
+
+    The returned spans will cover every index in the string, with no gaps. It is possible for some graphemes to have a cell length of zero.
+    This can occur for nonsense strings like two zero width joiners, or for control codes that don't contribute to the grapheme size.
 
     Args:
         text: String to split.
         unicode_version: Unicode version, `"auto"` to auto detect, `"latest"` for the latest unicode version.
 
     Returns:
-        List of spans.
+        A tuple of a list of *spans* and the cell length of the entire string. A span is a list of tuples
+            of three values consisting of (<START>, <END>, <CELL LENGTH>), where START and END are string indices,
+            and CELL LENGTH is the cell length of the single grapheme.
     """
 
     cell_table = load_cell_table(unicode_version)
@@ -181,32 +186,48 @@ def split_graphemes(
     SPECIAL = {"\u200d", "\ufe0f"}
# ... [56 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [87/129] `rich_3953` — Fix ZWJ and edge cases

- **Repository & Baseline**: `Textualize/rich` @ `1d402e0c59f8` (`2026-02-01`) | **Prompt Length**: `130` chars | **Complexity**: `T3-Moderate (26-80L)` (`+16 / -10` across `1` file(s))
- **Production Files Modified**: `rich/cells.py`
- **Hidden Grading Test Files**: `tests/test_cells.py` (`+17 / -0` test lines)
- **Active Traps**: `TRAP-5` | **Assigned BCF Card**: `DC-07 (Control Codepoint Guard & Index Bounds)`
- **Level 1 — Observable Symptom**: `cell_len()` crashes with `StopIteration` on trailing Zero-Width Joiner (`'1\u200d'`) and miscalculates widths for C0/C1 non-printable control characters (`1..31`, `0x7F..0x9F`).
- **Level 2 — Code-Level Defect**: In `rich/cells.py:_cell_len()`, `for character in iter_characters:` called unguarded `next(iter_characters)` when encountering `'\u200d'` at the end of a string, raising `StopIteration` (or terminating abnormally), and `get_character_cell_size` fell through binary search returning `1` for C0/C1 control codes.
- **Level 3 — Architectural Root Cause**: Mutating an active loop iterator via `next(iter_characters)` without a default `next(it, None)` or explicit integer index bounds check.
- **Actionable Fix & BCF Brain Insight**: Adding fast control-code guard `if codepoint and codepoint < 32 or 0x07F <= codepoint < 0x0A0: return 0` in `get_character_cell_size` and converting `_cell_len` to a bounded `while index < character_count:` loop resolves both bugs.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/cells.py
+++ b/rich/cells.py
@@ -55,23 +55,26 @@ def get_character_cell_size(character: str, unicode_version: str = "auto") -> in
         int: Number of cells (0, 1 or 2) occupied by that character.
     """
     codepoint = ord(character)
+    if codepoint and codepoint < 32 or 0x07F <= codepoint < 0x0A0:
+        return 0
     table = load_cell_table(unicode_version).widths
-    if codepoint > table[-1][1]:
+
+    last_entry = table[-1]
+    if codepoint > last_entry[1]:
         return 1
+
     lower_bound = 0
     upper_bound = len(table) - 1
-    index = (lower_bound + upper_bound) // 2
-    while True:
+
+    while lower_bound <= upper_bound:
+        index = (lower_bound + upper_bound) >> 1
         start, end, width = table[index]
         if codepoint < start:
             upper_bound = index - 1
         elif codepoint > end:
# ... [35 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [88/129] `rich_3944` — fix fonts

- **Repository & Baseline**: `Textualize/rich` @ `36fe3f7ca9be` (`2026-01-24`) | **Prompt Length**: `63` chars | **Complexity**: `T1-Micro (1-5L)` (`+1 / -1` across `1` file(s))
- **Production Files Modified**: `rich/cells.py`
- **Hidden Grading Test Files**: `tests/test_cells.py` (`+6 / -0` test lines)
- **Active Traps**: `TRAP-5`, `TRAP-6` | **Assigned BCF Card**: `DC-04 (Unicode Private Use Area Default Cell Width)`
- **Level 1 — Observable Symptom**: Nerd Font icons in Supplementary Private Use Area-A (e.g., `\U000f024d`, codepoint `983629`) report `cell_len == 0` instead of `1`, misaligning terminal tables, prompts, and borders.
- **Level 2 — Code-Level Defect**: In `rich/cells.py:get_character_cell_size()`, `if codepoint > table[-1][1]: return 0` treated every codepoint above the highest table range (`917999`, Tag/Variation Supplement) as zero-width!
- **Level 3 — Architectural Root Cause**: Unallocated and Supplementary Private Use Area (`U+F0000..U+10FFFF`) codepoints are omitted from zero/wide UCD exception tables because Unicode defaults unlisted printable/PUA codepoints to neutral width `1`.
- **Actionable Fix & BCF Brain Insight**: Changing `return 0` to `return 1` when `codepoint > table[-1][1]` fixes Nerd Font glyph widths in a 1-line edit.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/cells.py
+++ b/rich/cells.py
@@ -57,7 +57,7 @@ def get_character_cell_size(character: str, unicode_version: str = "auto") -> in
     codepoint = ord(character)
     table = load_cell_table(unicode_version).widths
     if codepoint > table[-1][1]:
-        return 0
+        return 1
     lower_bound = 0
     upper_bound = len(table) - 1
     index = (lower_bound + upper_bound) // 2
```
</details>

##### [89/129] `rich_3930` — Handle graphemes

- **Repository & Baseline**: `Textualize/rich` @ `53757bc234cf` (`2026-01-22`) | **Prompt Length**: `1224` chars | **Complexity**: `T4-Arch (>80L)` (`+12170 / -544` across `26` file(s))
- **Production Files Modified**: `rich/__main__.py`, `rich/_cell_widths.py`, `rich/_unicode_data/__init__.py`, `rich/_unicode_data/_versions.py`, `rich/_unicode_data/unicode10-0-0.py`, `rich/_unicode_data/unicode11-0-0.py`, `rich/_unicode_data/unicode12-0-0.py`, `rich/_unicode_data/unicode12-1-0.py`, ... (+18 more; 26 total)
- **Hidden Grading Test Files**: `tests/test_cells.py`, `tests/test_text.py`, `tests/test_unicode_data.py` (`+189 / -1` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-2`, `TRAP-3` | **Assigned BCF Card**: `DC-16 (Generated Multi-Table UCD Architecture)`
- **Level 1 — Observable Symptom**: Rich's legacy single `_cell_widths.py` table cannot measure multi-codepoint ZWJ emoji sequences (e.g., family/skin-tone/variation-selector graphemes) or adapt to terminal Unicode versions.
- **Level 2 — Code-Level Defect**: `rich/_cell_widths.py` stored a single flat `(start, end, width)` table without narrow-to-wide variation selector sets, versioned UCD tables (`4.1.0`–`17.0.0`), or grapheme cluster splitting (`split_graphemes`).
- **Level 3 — Architectural Root Cause**: Codepoint-by-codepoint `sum(get_character_cell_size(c))` fundamentally fails on Unicode Extended Grapheme Clusters joined by `U+200D` (ZWJ) or widened by `U+FE0F` (VS-16).
- **Actionable Fix & BCF Brain Insight**: Replaces `_cell_widths.py` with lazy-loaded `rich/_unicode_data/` version tables and grapheme-aware `cells.py` (`+12,170 / -544` across 26 files — largest generated-table task in the public set).

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/__main__.py
+++ b/rich/__main__.py
@@ -238,8 +238,9 @@ def iter_last(values: Iterable[T]) -> Iterable[Tuple[bool, T]]:
             "[b magenta]Hope you enjoy using Rich![/]\n\n"
             "Please consider sponsoring me if you get value from my work.\n\n"
             "Even the price of a ☕ can brighten my day!\n\n"
-            "https://github.com/sponsors/willmcgugan",
-            border_style="red",
+            "[cyan]https://github.com/sponsors/willmcgugan[/cyan]",
+            border_style="green",
             title="Help ensure Rich is maintained",
+            padding=(1, 2),
         )
     )
--- a/rich/_cell_widths.py
+++ b/rich/_cell_widths.py
@@ -1,454 +0,0 @@
-# Auto generated by make_terminal_widths.py
-
-CELL_WIDTHS = [
-    (0, 0, 0),
-    (1, 31, -1),
-    (127, 159, -1),
-    (173, 173, 0),
-    (768, 879, 0),
-    (1155, 1161, 0),
# ... [12844 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [90/129] `rich_3535` — Regex error

- **Repository & Baseline**: `Textualize/rich` @ `0f2f51b872d1` (`2024-10-22`) | **Prompt Length**: `191` chars | **Complexity**: `T2-Surgical (6-25L)` (`+7 / -1` across `2` file(s))
- **Production Files Modified**: `rich/cells.py`, `rich/segment.py`
- **Hidden Grading Test Files**: `tests/test_cells.py` (`+21 / -1` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-2`, `TRAP-5` | **Assigned BCF Card**: `DC-04 (Regex Character-Range Boundary Verification)`
- **Level 1 — Observable Symptom**: `rich.cells._is_single_cell_widths` fast-path regex returns `False` for ordinary lowercase ASCII letters `'p'` through `'z'`, `'{'`, `'~'`, Latin-1/Extended characters, and box-drawing characters!
- **Level 2 — Code-Level Defect**: In `rich/cells.py`, `_is_single_cell_widths = re.compile('^[ -o ˿Ͱ-҂]*$').match` had two literal typos: `o` (`'o'`, `0x6F`) instead of `~` (`'~'`, `0x7E`), and ` ˿` (missing `-` range hyphen between `00a0` and `02ff`!).
- **Level 3 — Architectural Root Cause**: Hexadecimal ASCII end-of-printable typo (`0x6F` vs `0x7E`) and missing regex range dash silently disabled the O(1) single-cell fast path for almost every English string containing `p`–`z`!
- **Actionable Fix & BCF Brain Insight**: Fixing the regex to `^[ -~ -˿Ͱ-҂─-◿]*$` and adding `assert cut >= 0` in `Segment.split_cells` restores fast-path matching for all printable ASCII and box-drawing glyphs.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/cells.py
+++ b/rich/cells.py
@@ -7,7 +7,9 @@
 from ._cell_widths import CELL_WIDTHS
 
 # Regex to match sequence of the most common character ranges
-_is_single_cell_widths = re.compile("^[\u0020-\u006f\u00a0\u02ff\u0370-\u0482]*$").match
+_is_single_cell_widths = re.compile(
+    "^[\u0020-\u007e\u00a0-\u02ff\u0370-\u0482\u2500-\u25FF]*$"
+).match
 
 
 @lru_cache(4096)
--- a/rich/segment.py
+++ b/rich/segment.py
@@ -161,10 +161,14 @@ def split_cells(self, cut: int) -> Tuple["Segment", "Segment"]:
         If the cut point falls in the middle of a 2-cell wide character then it is replaced
         by two spaces, to preserve the display width of the parent segment.
 
+        Args:
+            cut (int): Offset within the segment to cut.
+
         Returns:
             Tuple[Segment, Segment]: Two segments.
         """
         text, style, control = self
# ... [4 additional diff lines omitted for brevity; full file list above] ...
```
</details>

#### SUB-5B: CJK Double-Width Line Wrapping, Bidirectional Cell Splits, SGR Newlines & Tab Spans (5 Tasks)

##### [91/129] `rich_3938` — fix background style with soft wrap

- **Repository & Baseline**: `Textualize/rich` @ `05ff970926cb` (`2026-01-23`) | **Prompt Length**: `89` chars | **Complexity**: `T3-Moderate (26-80L)` (`+40 / -5` across `2` file(s))
- **Production Files Modified**: `rich/console.py`, `rich/segment.py`
- **Hidden Grading Test Files**: `tests/test_segment.py`, `tests/test_text.py` (`+32 / -0` test lines)
- **Active Traps**: `TRAP-2`, `TRAP-5` | **Assigned BCF Card**: `DC-04 (ANSI Background Style Newline Isolation)`
- **Level 1 — Observable Symptom**: Printing text with a background color (`console.print('foo\nbar', style='on blue', soft_wrap=True)`) wraps the `\n` segment itself in background ANSI escape codes, causing terminals to paint the background color across the entire empty remainder of the terminal row!
- **Level 2 — Code-Level Defect**: In `rich/console.py:Console.print()`, `Segment.apply_style(render(...), self.get_style(style))` applied `render_style` blindly to every segment including embedded `\n` newline segments.
- **Level 3 — Architectural Root Cause**: Terminal emulators scrolling or processing a linefeed (`\n`) while an SGR background color (`\x1b[44m`) is active fill the cleared line to the right margin with that background attribute unless SGR is reset (`\x1b[0m`) *before* `\n`.
- **Actionable Fix & BCF Brain Insight**: Adding `Segment.split_lines_terminator()` in `rich/segment.py` and applying `render_style` only to per-line content segments while appending unstyled `Segment.line()` for terminators eliminates background bleed.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/console.py
+++ b/rich/console.py
@@ -1723,12 +1723,16 @@ def print(
                 for renderable in renderables:
                     extend(render(renderable, render_options))
             else:
+                render_style = self.get_style(style)
+                new_line = Segment.line()
                 for renderable in renderables:
-                    extend(
-                        Segment.apply_style(
-                            render(renderable, render_options), self.get_style(style)
-                        )
-                    )
+                    for line, add_new_line in Segment.split_lines_terminator(
+                        render(renderable, render_options)
+                    ):
+                        extend(Segment.apply_style(line, render_style))
+                        if add_new_line:
+                            new_segments.append(new_line)
+
             if new_line_start:
                 if (
                     len("".join(segment.text for segment in new_segments).splitlines())
--- a/rich/segment.py
+++ b/rich/segment.py
# ... [38 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [92/129] `rich_3180` — Fix double-width characters disappearing when wrapping

- **Repository & Baseline**: `Textualize/rich` @ `e76f3c3ea784` (`2023-11-14`) | **Prompt Length**: `1189` chars | **Complexity**: `T4-Arch (>80L)` (`+89 / -38` across `2` file(s))
- **Production Files Modified**: `rich/_wrap.py`, `rich/cells.py`
- **Hidden Grading Test Files**: `tests/test_cells.py`, `tests/test_text.py` (`+85 / -0` test lines)
- **Active Traps**: `TRAP-2` | **Assigned BCF Card**: `DC-07 (Cell-Offset vs Codepoint-Index Wrapping)`
- **Level 1 — Observable Symptom**: Wrapping long lines of double-width CJK characters (`'ありがとう'` at width 3) causes characters sitting on the fold boundary to disappear completely from rendered output!
- **Level 2 — Code-Level Defect**: In `rich/_wrap.py:divide_line()` and `rich/cells.py:chop_cells()`, fold cut positions mixed cell widths with string slice indices and dropped double-width characters when a 2-cell ideograph straddled `remaining_space == 1`.
- **Level 3 — Architectural Root Cause**: Dual coordinate-space confusion between string character indices (`0..len(text)`) and terminal column coordinates (`0..cell_len(text)`) when folding words wider than a single line.
- **Actionable Fix & BCF Brain Insight**: Rewriting `chop_cells` to emit complete lines without dropping straddling 2-cell glyphs and updating `divide_line` to map chopped chunks back to exact string break offsets preserves every CJK character.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/_wrap.py
+++ b/rich/_wrap.py
@@ -1,13 +1,19 @@
+from __future__ import annotations
+
 import re
-from typing import Iterable, List, Tuple
+from typing import Iterable
 
 from ._loop import loop_last
 from .cells import cell_len, chop_cells
 
 re_word = re.compile(r"\s*\S+\s*")
 
 
-def words(text: str) -> Iterable[Tuple[int, int, str]]:
+def words(text: str) -> Iterable[tuple[int, int, str]]:
+    """Yields each word from the text as a tuple
+    containing (start_index, end_index, word). A "word" in this context may
+    include the actual word and any whitespace to the right.
+    """
     position = 0
     word_match = re_word.match(text, position)
     while word_match is not None:
@@ -17,40 +23,71 @@ def words(text: str) -> Iterable[Tuple[int, int, str]]:
         word_match = re_word.match(text, end)
# ... [156 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [93/129] `rich_3521` — Segment.split_cells fix

- **Repository & Baseline**: `Textualize/rich` @ `66074922edab` (`2024-10-04`) | **Prompt Length**: `80` chars | **Complexity**: `T3-Moderate (26-80L)` (`+16 / -19` across `1` file(s))
- **Production Files Modified**: `rich/segment.py`
- **Hidden Grading Test Files**: `tests/test_segment.py` (`+21 / -5` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-5` | **Assigned BCF Card**: `DC-07 (Bidirectional Cell-Cut Convergence)`
- **Level 1 — Observable Symptom**: `Segment.split_cells()` raises `AssertionError('Will never reach here')` or cuts at the wrong column on mixed Japanese/ASCII strings with trailing spaces (Textual issue #5090).
- **Level 2 — Code-Level Defect**: In `rich/segment.py:Segment._split_cells()`, the proportional initial guess `pos = int((cut / cell_length) * len(text)) - 1` could *overshoot* `cut` (`cell_pos > cut`) when wide CJK characters precede narrow ASCII spaces, and the subsequent `while pos < len(text): pos += 1` loop only stepped *forward*!
- **Level 3 — Architectural Root Cause**: Proportional interpolation `cut / cell_length * len(text)` is non-monotonic relative to `cut` on heterogeneous 1-cell/2-cell strings; it can land either left OR right of the target cell column.
- **Actionable Fix & BCF Brain Insight**: Stepping `pos += 1` when `cell_pos < cut` and `pos -= 1` when `cell_pos > cut` (handling `out_by == -1` and `out_by == +1` on straddling 2-cell characters by padding with `' '`) guarantees exact cell-width splits.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/segment.py
+++ b/rich/segment.py
@@ -129,34 +129,31 @@ def _split_cells(cls, segment: "Segment", cut: int) -> Tuple["Segment", "Segment
 
         cell_size = get_character_cell_size
 
-        pos = int((cut / cell_length) * (len(text))) - 1
-        if pos < 0:
-            pos = 0
+        pos = int((cut / cell_length) * len(text))
 
-        before = text[:pos]
-        cell_pos = cell_len(before)
-        if cell_pos == cut:
-            return (
-                _Segment(before, style, control),
-                _Segment(text[pos:], style, control),
-            )
-        while pos < len(text):
-            char = text[pos]
-            pos += 1
-            cell_pos += cell_size(char)
+        while True:
             before = text[:pos]
-            if cell_pos == cut:
+            cell_pos = cell_len(before)
# ... [27 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [94/129] `rich_3506` — fix split cells

- **Repository & Baseline**: `Textualize/rich` @ `4101991898ee` (`2024-09-28`) | **Prompt Length**: `115` chars | **Complexity**: `T2-Surgical (6-25L)` (`+15 / -2` across `1` file(s))
- **Production Files Modified**: `rich/segment.py`
- **Hidden Grading Test Files**: `tests/test_segment.py` (`+29 / -0` test lines)
- **Active Traps**: `TRAP-5` | **Assigned BCF Card**: `DC-07 (Interpolation Lower-Bound Clamp)`
- **Level 1 — Observable Symptom**: `Segment._split_cells` miscalculates cut positions on mixed CJK/ASCII segments (Textual issue #4996) due to `len(text) - 1` scaling underestimating `pos` or going negative.
- **Level 2 — Code-Level Defect**: In `rich/segment.py:Segment._split_cells()`, `pos = int((cut / cell_length) * (len(text) - 1))` multiplied by `len(text) - 1` instead of `len(text)`, skewing proportional indexing.
- **Level 3 — Architectural Root Cause**: Off-by-one denominator/numerator scaling in heuristic index estimation (`len(text) - 1` vs `len(text) - 1` post-multiply clamp).
- **Actionable Fix & BCF Brain Insight**: Computing `pos = int((cut / cell_length) * len(text)) - 1` clamped with `if pos < 0: pos = 0` fixes the initial lower-bound index estimate.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/segment.py
+++ b/rich/segment.py
@@ -109,16 +109,29 @@ def is_control(self) -> bool:
     @classmethod
     @lru_cache(1024 * 16)
     def _split_cells(cls, segment: "Segment", cut: int) -> Tuple["Segment", "Segment"]:
+        """Split a segment in to two at a given cell position.
+
+        Note that splitting a double-width character, may result in that character turning
+        into two spaces.
+
+        Args:
+            segment (Segment): A segment to split.
+            cut (int): A cell position to cut on.
+
+        Returns:
+            A tuple of two segments.
+        """
         text, style, control = segment
         _Segment = Segment
-
         cell_length = segment.cell_length
         if cut >= cell_length:
             return segment, _Segment("", style, control)
 
         cell_size = get_character_cell_size
# ... [8 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [95/129] `rich_3061` — Extend tabs with styles

- **Repository & Baseline**: `Textualize/rich` @ `aca9467ec6a4` (`2023-07-29`) | **Prompt Length**: `409` chars | **Complexity**: `T4-Arch (>80L)` (`+67 / -24` across `1` file(s))
- **Production Files Modified**: `rich/text.py`
- **Hidden Grading Test Files**: `tests/test_panel.py`, `tests/test_text.py` (`+112 / -3` test lines)
- **Active Traps**: `TRAP-1` | **Assigned BCF Card**: `DC-07 (Span Offset Translation Under Tab Expansion)`
- **Level 1 — Observable Symptom**: `Text.expand_tabs()` replaces `\t` characters with unstyled spaces instead of extending the style `Span` covering the tab, and `Text(..., tab_size=8)` ignores `Console(tab_size=...)`.
- **Level 2 — Code-Level Defect**: In `rich/text.py:Text.expand_tabs()`, tabs were expanded by rebuilding plain text without translating existing `(start, end, style)` span coordinates or extending spans covering `\t`, and `Text.__init__` hardcoded `tab_size: Optional[int] = 8` instead of `None`.
- **Level 3 — Architectural Root Cause**: Coordinate-system desynchronization when character-count-changing transformations (`\t` -> $k$ spaces) mutate `self._text` without updating interval tree / span `[start, end)` indices.
- **Actionable Fix & BCF Brain Insight**: Adding `Span.extend(cells)`, recalculating span offsets delta-by-delta in `Text.expand_tabs()`, and defaulting `Text.tab_size = None` (falling back to `console.tab_size` or `8`) preserves tab styling (Trap-1: `tests/test_panel.py` merged segment expectation updated).

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/text.py
+++ b/rich/text.py
@@ -97,6 +97,21 @@ def right_crop(self, offset: int) -> "Span":
             return self
         return Span(start, min(offset, end), style)
 
+    def extend(self, cells: int) -> "Span":
+        """Extend the span by the given number of cells.
+
+        Args:
+            cells (int): Additional space to add to end of span.
+
+        Returns:
+            Span: A span.
+        """
+        if cells:
+            start, end, style = self
+            return Span(start, end + cells, style)
+        else:
+            return self
+
 
 class Text(JupyterMixin):
     """Text with color / style.
@@ -108,7 +123,7 @@ class Text(JupyterMixin):
         overflow (str, optional): Overflow method: "crop", "fold", "ellipsis". Defaults to None.
# ... [165 additional diff lines omitted for brevity; full file list above] ...
```
</details>

### CAT-6: Terminal Escape Decoding, Box/Markdown Layout & Console I/O Lifecycles (30 Tasks)

**Category Overview:** ECMA-48/ANSI escape decoding, markup backslash parity, RFC 3986 URL highlighters, Markdown table/heading elements, `Table`/`Panel`/`Syntax` box-model padding & style inheritance, PEP 657/678 traceback rendering, `FileProxy`/`Console`/`Live`/`Progress` stream lifecycles, and CI TTY flags.

#### SUB-6A: ANSI Escape Decoding, Control-Code Sanitization, Markup Escaping & URL Highlighters (6 Tasks)

##### [96/129] `rich_4076` — preserve newlines

- **Repository & Baseline**: `Textualize/rich` @ `9cb198944f81` (`2026-04-12`) | **Prompt Length**: `71` chars | **Complexity**: `T2-Surgical (6-25L)` (`+3 / -3` across `1` file(s))
- **Production Files Modified**: `rich/ansi.py`
- **Hidden Grading Test Files**: `tests/test_ansi.py` (`+23 / -3` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-5` | **Assigned BCF Card**: `DC-04 (Trailing-Newline Preserving Split)`
- **Level 1 — Observable Symptom**: `Text.from_ansi('hello\n')` / `AnsiDecoder.decode('hello\n')` drops the trailing empty line after `'\n'`, losing vertical spacing in decoded terminal output.
- **Level 2 — Code-Level Defect**: In `rich/ansi.py:AnsiDecoder.decode()`, `for line in terminal_text.splitlines():` used Python's `str.splitlines()`, which discards a trailing empty element when a string ends with `'\n'` (`'a\n'.splitlines() == ['a']`, whereas `'a\n'.split('\n') == ['a', '']`).
- **Level 3 — Architectural Root Cause**: Subtle standard-library difference between `str.splitlines()` (line-terminator consumer) and delimiter splitting (`re.split(r'(?<=\n)', ...)`).
- **Actionable Fix & BCF Brain Insight**: Iterating `for line in re.split(r'(?<=\n)', terminal_text): yield self.decode_line(line.rstrip('\n'))` preserves trailing empty `Text('')` lines (Trap-1: `tests/test_ansi.py` expected list updated).

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/ansi.py
+++ b/rich/ansi.py
@@ -127,13 +127,13 @@ def decode(self, terminal_text: str) -> Iterable[Text]:
         """Decode ANSI codes in an iterable of lines.
 
         Args:
-            lines (Iterable[str]): An iterable of lines of terminal output.
+            terminal_text: Output potentially containing ANSI escape sequences.
 
         Yields:
             Text: Marked up Text.
         """
-        for line in terminal_text.splitlines():
-            yield self.decode_line(line)
+        for line in re.split(r"(?<=\n)", terminal_text):
+            yield self.decode_line(line.rstrip("\n"))
 
     def decode_line(self, line: str) -> Text:
         """Decode a line containing ansi codes.
```
</details>

##### [97/129] `rich_3454` — Fix [BUG] @ breaks highlighting in hyperlink #3327

- **Repository & Baseline**: `Textualize/rich` @ `e1e6d745f670` (`2024-08-26`) | **Prompt Length**: `865` chars | **Complexity**: `T1-Micro (1-5L)` (`+1 / -1` across `1` file(s))
- **Production Files Modified**: `rich/highlighter.py`
- **Hidden Grading Test Files**: `tests/test_highlighter.py` (`+1 / -0` test lines)
- **Active Traps**: `TRAP-6` | **Assigned BCF Card**: `DC-04 (RFC 3986 Sub-Delim / Path `@` URL Character Class)`
- **Level 1 — Observable Symptom**: `ReprHighlighter` stops highlighting modern social/handle URLs such as `https://www.youtube.com/@LinusTechTips` at the `@` symbol.
- **Level 2 — Code-Level Defect**: In `rich/highlighter.py:ReprHighlighter.highlights`, the `(?P<url>...)` character class `[-0-9a-zA-Z$_+!`(),.?/;:&=%#~]*` omitted `@` (valid in RFC 3986 `pchar` path/query/fragment segments).
- **Level 3 — Architectural Root Cause**: Incomplete RFC 3986 `pchar` (`unreserved / pct-encoded / sub-delims / ':' / '@'`) coverage in `ReprHighlighter`'s regex.
- **Actionable Fix & BCF Brain Insight**: Appending `@` to the `(?P<url>...)` character class (`...&=%#~@]*`) fixes `@` URL highlighting in 1 character.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/highlighter.py
+++ b/rich/highlighter.py
@@ -98,7 +98,7 @@ class ReprHighlighter(RegexHighlighter):
             r"(?P<number>(?<!\w)\-?[0-9]+\.?[0-9]*(e[-+]?\d+?)?\b|0x[0-9a-fA-F]*)",
             r"(?P<path>\B(/[-\w._+]+)*\/)(?P<filename>[-\w._+]*)?",
             r"(?<![\\\w])(?P<str>b?'''.*?(?<!\\)'''|b?'.*?(?<!\\)'|b?\"\"\".*?(?<!\\)\"\"\"|b?\".*?(?<!\\)\")",
-            r"(?P<url>(file|https|http|ws|wss)://[-0-9a-zA-Z$_+!`(),.?/;:&=%#~]*)",
+            r"(?P<url>(file|https|http|ws|wss)://[-0-9a-zA-Z$_+!`(),.?/;:&=%#~@]*)",
         ),
     ]
```
</details>

##### [98/129] `rich_3471` — Fixed exception in append_tokens

- **Repository & Baseline**: `Textualize/rich` @ `e2a982d5ea74` (`2024-08-26`) | **Prompt Length**: `86` chars | **Complexity**: `T1-Micro (1-5L)` (`+1 / -0` across `1` file(s))
- **Production Files Modified**: `rich/text.py`
- **Hidden Grading Test Files**: `tests/test_text.py` (`+20 / -0` test lines)
- **Active Traps**: `TRAP-5`, `TRAP-6` | **Assigned BCF Card**: `DC-04 (Control-Code Sanitization on Token Ingestion)`
- **Level 1 — Observable Symptom**: `Text().append_tokens([('long text ... \r\n', 'red')])` raises an exception or corrupts line wrapping when rendered with `console.print(t, width=40)` because `'\r'` survives in `self._text`.
- **Level 2 — Code-Level Defect**: In `rich/text.py:Text.append_tokens()`, unlike `Text.__init__` and `Text.append` (which call `strip_control_codes`), `append_tokens` appended raw `content` directly into `self._text` without stripping `'\r'` and other terminal control codes.
- **Level 3 — Architectural Root Cause**: Missing input-sanitization invariant on the bulk `append_tokens` fast path allowed carriage returns `'\r'` (`cell_len == 0` / line-reset control) into `Text` segments.
- **Actionable Fix & BCF Brain Insight**: Adding `content = strip_control_codes(content)` before `append_text(content)` inside `Text.append_tokens` enforces uniform control-code sanitization in 1 line.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/text.py
+++ b/rich/text.py
@@ -1041,6 +1041,7 @@ def append_tokens(
         _Span = Span
         offset = len(self)
         for content, style in tokens:
+            content = strip_control_codes(content)
             append_text(content)
             if style:
                 append_span(_Span(offset, offset + len(content), style))
```
</details>

##### [99/129] `rich_3278` — Strip problematic private escape sequences

- **Repository & Baseline**: `Textualize/rich` @ `4c5d305bb902` (`2024-07-01`) | **Prompt Length**: `1216` chars | **Complexity**: `T1-Micro (1-5L)` (`+1 / -0` across `1` file(s))
- **Production Files Modified**: `rich/ansi.py`
- **Hidden Grading Test Files**: `tests/test_ansi.py` (`+14 / -0` test lines)
- **Active Traps**: `TRAP-6` | **Assigned BCF Card**: `DC-04 (ECMA-48 Private Escape Sequence Regex)`
- **Level 1 — Observable Symptom**: `Text.from_ansi()` fails to strip VT100/ECMA-48 `Fp` private escape sequences such as `\x1b7` (DECSC save cursor) and `\x1b8` (DECRC restore cursor) emitted by programs like Alpine's `apk`, corrupting cursor position and terminal output.
- **Level 2 — Code-Level Defect**: In `rich/ansi.py`, `re_ansi` matched OSC (`\x1b]...\x1b\\`), Fe/Fs (`\x1b[@-Z\\-_]`), and CSI (`\x1b\[[0-?]*[ -/]*[@-~]`), but omitted two-byte `Fp` sequences `\x1b[0-?]` (`0x30..0x3F`).
- **Level 3 — Architectural Root Cause**: Incomplete ECMA-48 escape sequence grammar coverage for single-character `0x30–0x3F` private-use final bytes.
- **Actionable Fix & BCF Brain Insight**: Prepending `(?:\x1b[0-?])|` to `re_ansi` in `rich/ansi.py` cleanly strips all `\x1b0`–`\x1b?` sequences during ANSI decoding.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/ansi.py
+++ b/rich/ansi.py
@@ -9,6 +9,7 @@
 
 re_ansi = re.compile(
     r"""
+(?:\x1b[0-?])|
 (?:\x1b\](.*?)\x1b\\)|
 (?:\x1b([(@-Z\\-_]|\[[0-?]*[ -/]*[@-~]))
 """,
```
</details>

##### [100/129] `rich_3067` — Allow tilde in URL (fixes #3057)

- **Repository & Baseline**: `Textualize/rich` @ `1ad6f73a4d1d` (`2023-07-31`) | **Prompt Length**: `582` chars | **Complexity**: `T1-Micro (1-5L)` (`+1 / -1` across `1` file(s))
- **Production Files Modified**: `rich/highlighter.py`
- **Hidden Grading Test Files**: `tests/test_highlighter.py` (`+10 / -0` test lines)
- **Active Traps**: `TRAP-6` | **Assigned BCF Card**: `DC-04 (RFC 3986 Unreserved URL Character Class)`
- **Level 1 — Observable Symptom**: `ReprHighlighter` truncates URL syntax highlighting right before `~` on user-directory URLs such as `http://example.org/~folder`.
- **Level 2 — Code-Level Defect**: In `rich/highlighter.py:ReprHighlighter.highlights`, the `(?P<url>...)` character class `[-0-9a-zA-Z$_+!`(),.?/;:&=%#]*` omitted RFC 3986 unreserved character `~`.
- **Level 3 — Architectural Root Cause**: Hand-written URL character class omitted tilde (`~`, `0x7E`), which RFC 3986 §2.3 classifies as an unreserved URI character.
- **Actionable Fix & BCF Brain Insight**: Appending `~` to the `(?P<url>...)` character class (`...&=%#~]*`) highlights tilde paths completely.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/highlighter.py
+++ b/rich/highlighter.py
@@ -98,7 +98,7 @@ class ReprHighlighter(RegexHighlighter):
             r"(?P<number>(?<!\w)\-?[0-9]+\.?[0-9]*(e[-+]?\d+?)?\b|0x[0-9a-fA-F]*)",
             r"(?P<path>\B(/[-\w._+]+)*\/)(?P<filename>[-\w._+]*)?",
             r"(?<![\\\w])(?P<str>b?'''.*?(?<!\\)'''|b?'.*?(?<!\\)'|b?\"\"\".*?(?<!\\)\"\"\"|b?\".*?(?<!\\)\")",
-            r"(?P<url>(file|https|http|ws|wss)://[-0-9a-zA-Z$_+!`(),.?/;:&=%#]*)",
+            r"(?P<url>(file|https|http|ws|wss)://[-0-9a-zA-Z$_+!`(),.?/;:&=%#~]*)",
         ),
     ]
```
</details>

##### [101/129] `rich_3063` — Fix escaping trailing backslash

- **Repository & Baseline**: `Textualize/rich` @ `368e8ad77c95` (`2023-07-29`) | **Prompt Length**: `85` chars | **Complexity**: `T1-Micro (1-5L)` (`+3 / -1` across `1` file(s))
- **Production Files Modified**: `rich/markup.py`
- **Hidden Grading Test Files**: `tests/test_markup.py` (`+13 / -1` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-5` | **Assigned BCF Card**: `DC-04 (Trailing Backslash Escape Parity)`
- **Level 1 — Observable Symptom**: Interpolating `rich.markup.escape('C:\\')` immediately before a closing markup tag (`f'[red]{escape(val)}[/red]'`) leaves a single trailing backslash `'C:\\'`, which escapes `'[/red]'` into literal text instead of closing the `[red]` tag!
- **Level 2 — Code-Level Defect**: In `rich/markup.py:escape()`, `_escape` only doubled backslashes that immediately preceded a `[` character *inside* `markup` (`r'(\\*)(\[[a-z#/@][^[]*?])'`), ignoring a trailing unescaped `'\\'` at the end of `markup` that will sit right in front of the caller's `'[/tag]'`!
- **Level 3 — Architectural Root Cause**: Context-free boundary leak in string escaping: a trailing odd backslash at index `-1` merges lexically with any `[` concatenated immediately after the escaped string.
- **Actionable Fix & BCF Brain Insight**: Adding `if markup.endswith('\\') and not markup.endswith('\\\\'): return markup + '\\'` guarantees trailing backslashes cannot escape subsequent markup tags.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/markup.py
+++ b/rich/markup.py
@@ -64,6 +64,9 @@ def escape_backslashes(match: Match[str]) -> str:
         return f"{backslashes}{backslashes}\\{text}"
 
     markup = _escape(escape_backslashes, markup)
+    if markup.endswith("\\") and not markup.endswith("\\\\"):
+        return markup + "\\"
+
     return markup
 
 
@@ -226,7 +229,6 @@ def pop_style(style_name: str) -> Tuple[int, Tag]:
 
 
 if __name__ == "__main__":  # pragma: no cover
-
     MARKUP = [
         "[red]Hello World[/red]",
         "[magenta]Hello [b]World[/b]",
```
</details>

#### SUB-6B: Markdown Elements, Table/Panel/Syntax Box-Model Geometry & PEP 657/678 Tracebacks (12 Tasks)

##### [102/129] `rich_4079` — Inline table code

- **Repository & Baseline**: `Textualize/rich` @ `19c67b9a3479` (`2026-04-12`) | **Prompt Length**: `71` chars | **Complexity**: `T2-Surgical (6-25L)` (`+4 / -3` across `1` file(s))
- **Production Files Modified**: `rich/markdown.py`
- **Hidden Grading Test Files**: `tests/test_markdown.py` (`+16 / -0` test lines)
- **Active Traps**: `TRAP-5` | **Assigned BCF Card**: `DC-04 (Pre-Stylized Text Span Preservation)`
- **Level 1 — Observable Symptom**: Inline code spans inside Markdown table cells (e.g., ``| `print('hello');` |`` with `inline_code_lexer='python'`) lose syntax highlighting or have `context.current_style` clobber token spans.
- **Level 2 — Code-Level Defect**: In `rich/markdown.py:TableDataElement.on_text()`, passing an already-highlighted `Text` object executed `text.stylize(context.current_style)` across the entire `Text` before `self.content.append_text(text)`, overriding lexer token styles (and mutating the passed `Text`).
- **Level 3 — Architectural Root Cause**: `TableDataElement.on_text` treated plain `str` fragments (which need `context.current_style` applied) identically to pre-rendered `Text` objects (such as `CodeBlock`/`inline_code` tokens that already carry complete style spans).
- **Actionable Fix & BCF Brain Insight**: Branching `if isinstance(text, str): self.content.append(text, context.current_style) else: self.content.append_text(text)` matches `TextElement.on_text` and preserves inline code lexer spans.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/markdown.py
+++ b/rich/markdown.py
@@ -331,9 +331,10 @@ def __init__(self, justify: JustifyMethod) -> None:
         self.justify = justify
 
     def on_text(self, context: MarkdownContext, text: TextType) -> None:
-        text = Text(text) if isinstance(text, str) else text
-        text.stylize(context.current_style)
-        self.content.append_text(text)
+        if isinstance(text, str):
+            self.content.append(text, context.current_style)
+        else:
+            self.content.append_text(text)
 
 
 class ListElement(MarkdownElement):
```
</details>

##### [103/129] `rich_3718` — fix(panel): fix title missing panel background

- **Repository & Baseline**: `Textualize/rich` @ `7d36119f8378` (`2025-06-24`) | **Prompt Length**: `747` chars | **Complexity**: `T2-Surgical (6-25L)` (`+3 / -4` across `1` file(s))
- **Production Files Modified**: `rich/panel.py`
- **Hidden Grading Test Files**: `tests/test_panel.py` (`+48 / -0` test lines)
- **Active Traps**: `STD` | **Assigned BCF Card**: `DC-04 (Composite Style Inheritance Order)`
- **Level 1 — Observable Symptom**: `Panel('...', style='on blue', border_style='red', title='Title')` renders the panel border with the blue background, but the `Title` and `Subtitle` text lose the panel's background color!
- **Level 2 — Code-Level Defect**: In `rich/panel.py:__rich_console__()`, `title_text.stylize_before(partial_border_style)` applied only `console.get_style(self.border_style)` (`red`, no bgcolor) instead of the composite `border_style = style + partial_border_style` (`red on blue`).
- **Level 3 — Architectural Root Cause**: Regression from commit `7a38204` that split `partial_border_style` from `border_style`, inadvertently stripping `self.style`'s background attribute from title/subtitle segments.
- **Actionable Fix & BCF Brain Insight**: Applying `title_text.stylize_before(border_style)` and `subtitle_text.stylize_before(border_style)` restores panel background continuity across top/bottom title bars.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/panel.py
+++ b/rich/panel.py
@@ -146,8 +146,7 @@ def __rich_console__(
             Padding(self.renderable, _padding) if any(_padding) else self.renderable
         )
         style = console.get_style(self.style)
-        partial_border_style = console.get_style(self.border_style)
-        border_style = style + partial_border_style
+        border_style = style + console.get_style(self.border_style)
         width = (
             options.max_width
             if self.width is None
@@ -206,7 +205,7 @@ def align_text(
 
         title_text = self._title
         if title_text is not None:
-            title_text.stylize_before(partial_border_style)
+            title_text.stylize_before(border_style)
 
         child_width = (
             width - 2
@@ -255,7 +254,7 @@ def align_text(
 
         subtitle_text = self._subtitle
         if subtitle_text is not None:
-            subtitle_text.stylize_before(partial_border_style)
# ... [4 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [104/129] `rich_3942` — Update to markdown styles

- **Repository & Baseline**: `Textualize/rich` @ `c595fa95068d` (`2026-01-24`) | **Prompt Length**: `54` chars | **Complexity**: `T3-Moderate (26-80L)` (`+43 / -27` across `2` file(s))
- **Production Files Modified**: `rich/default_styles.py`, `rich/markdown.py`
- **Hidden Grading Test Files**: `tests/_card_render.py`, `tests/test_markdown.py`, `tests/test_markdown_no_hyperlinks.py` (`+9 / -9` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-2`, `TRAP-5` | **Assigned BCF Card**: `DC-11 (Theme Palette & Heading Element Refactor)`
- **Level 1 — Observable Symptom**: Update Rich's default Markdown styles (`h1`–`h6`, bullets, numbers, horizontal rules, table borders/headers) and modernize `Heading.__rich_console__` away from heavy `Panel` borders on `h1`.
- **Level 2 — Code-Level Defect**: `rich/default_styles.py` used legacy yellow bullets/rules and uncolored `h2`–`h4` styles, and `rich/markdown.py:Heading` wrapped `h1` in a full `Panel` box.
- **Level 3 — Architectural Root Cause**: Visual design refresh across `default_styles.py` and `markdown.py` (with `PC-5` 54-char prompt `'Update to markdown styles'`).
- **Actionable Fix & BCF Brain Insight**: Illustrates `TRAP-4` (ultra-terse aesthetic refactor prompt where exact target colors like `magenta`/`cyan`/`dim` are underspecified in prose and test_patch updates ANSI golden snapshots in `tests/_card_render.py` and `test_markdown.py`).

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/default_styles.py
+++ b/rich/default_styles.py
@@ -149,20 +149,22 @@
     "markdown.block_quote": Style(color="magenta"),
     "markdown.list": Style(color="cyan"),
     "markdown.item": Style(),
-    "markdown.item.bullet": Style(color="yellow", bold=True),
-    "markdown.item.number": Style(color="yellow", bold=True),
-    "markdown.hr": Style(color="yellow"),
+    "markdown.item.bullet": Style(bold=True),
+    "markdown.item.number": Style(color="cyan"),
+    "markdown.hr": Style(dim=True),
     "markdown.h1.border": Style(),
-    "markdown.h1": Style(bold=True),
-    "markdown.h2": Style(bold=True, underline=True),
-    "markdown.h3": Style(bold=True),
-    "markdown.h4": Style(bold=True, dim=True),
-    "markdown.h5": Style(underline=True),
-    "markdown.h6": Style(italic=True),
+    "markdown.h1": Style(bold=True, underline=True),
+    "markdown.h2": Style(color="magenta", underline=True),
+    "markdown.h3": Style(color="magenta", bold=True),
+    "markdown.h4": Style(color="magenta", italic=True),
+    "markdown.h5": Style(italic=True),
+    "markdown.h6": Style(dim=True),
     "markdown.h7": Style(italic=True, dim=True),
# ... [108 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [105/129] `rich_3935` — fix for padding width

- **Repository & Baseline**: `Textualize/rich` @ `fe55a131c278` (`2026-01-23`) | **Prompt Length**: `75` chars | **Complexity**: `T2-Surgical (6-25L)` (`+13 / -3` across `1` file(s))
- **Production Files Modified**: `rich/table.py`
- **Hidden Grading Test Files**: `tests/test_columns.py`, `tests/test_table.py` (`+30 / -1` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-5` | **Assigned BCF Card**: `DC-07 (Box-Model Padding Width Symmetry)`
- **Level 1 — Observable Symptom**: `Table` / `Columns` with `collapse_padding=True` and `pad_edge=False` miscalculates `_get_padding_width`, causing `Columns` layouts to wrap prematurely or clip column widths.
- **Level 2 — Code-Level Defect**: In `rich/table.py:Table._get_padding_width()`, `if self.collapse_padding:` only adjusted `pad_left` for `column_index > 0` (`max(0, pad_left - pad_right)`) and completely ignored `if not self.pad_edge:` on the first (`0`) and last (`len - 1`) columns!
- **Level 3 — Architectural Root Cause**: Asymmetry between `_get_padding_width` (used during `_measure_column` / `_calculate_column_widths`) and `get_padding` (used during `_render` cell construction), which already zeroed edge padding when `not pad_edge`.
- **Actionable Fix & BCF Brain Insight**: Aligning `_get_padding_width` with `get_padding` for both `collapse_padding` and `not self.pad_edge` makes column width measurement match rendered cell geometry.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/table.py
+++ b/rich/table.py
@@ -485,6 +485,7 @@ def __rich_console__(
             max_width = self.width
 
         extra_width = self._extra_width
+
         widths = self._calculate_column_widths(
             console, options.update_width(max_width - extra_width)
         )
@@ -530,6 +531,7 @@ def _calculate_column_widths(
             self._measure_column(console, options, column) for column in columns
         ]
         widths = [_range.maximum or 1 for _range in width_ranges]
+
         get_padding_width = self._get_padding_width
         extra_width = self._extra_width
         if self.expand:
@@ -699,9 +701,17 @@ def get_padding(first_row: bool, last_row: bool) -> Tuple[int, int, int, int]:
     def _get_padding_width(self, column_index: int) -> int:
         """Get extra width from padding."""
         _, pad_right, _, pad_left = self.padding
+
         if self.collapse_padding:
-            if column_index > 0:
-                pad_left = max(0, pad_left - pad_right)
# ... [28 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [106/129] `rich_3486` — report fine grained error locations

- **Repository & Baseline**: `Textualize/rich` @ `d0de442c08df` (`2024-09-11`) | **Prompt Length**: `98` chars | **Complexity**: `T4-Arch (>80L)` (`+74 / -24` across `3` file(s))
- **Production Files Modified**: `rich/default_styles.py`, `rich/syntax.py`, `rich/traceback.py`
- **Hidden Grading Test Files**: `tests/test_traceback.py` (`+31 / -0` test lines)
- **Active Traps**: `TRAP-2`, `TRAP-5`, `TRAP-8` | **Assigned BCF Card**: `DC-16 (PEP 657 Instruction Caret Ranges + Skipif Trap Awareness)`
- **Level 1 — Observable Symptom**: `rich.traceback.Traceback` lacks Python 3.11+ PEP 657 fine-grained column error-range underlining (`co_positions` / `tb_lasti`) on exception frames.
- **Level 2 — Code-Level Defect**: `rich/traceback.py` (`Frame`, `extract`, `render_locals`) did not extract instruction `(start_line, start_col), (end_line, end_col)` offsets, and `rich/syntax.py:Syntax.stylize_range` lacked `style_before: bool` + `traceback.error_range` in `default_styles.py`.
- **Level 3 — Architectural Root Cause**: Python 3.11 PEP 657 added bytecode instruction column ranges (`tb.tb_frame.f_code.co_positions()`), which Rich's traceback extractor had not yet wired into `Syntax.stylize_range`.
- **Actionable Fix & BCF Brain Insight**: Adding `Frame.last_instruction`, `_iter_syntax_lines` range highlighting, `Syntax.stylize_range(..., style_before=True)`, and `traceback.error_range` implements PEP 657 ranges. **TRAP-8 Warning**: `test_patch` adds mutually exclusive `@pytest.mark.skipif(minor >= 11)` and `skipif(minor < 11)` tests!

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/default_styles.py
+++ b/rich/default_styles.py
@@ -120,6 +120,7 @@
     "traceback.exc_type": Style(color="bright_red", bold=True),
     "traceback.exc_value": Style.null(),
     "traceback.offset": Style(color="bright_red", bold=True),
+    "traceback.error_range": Style(underline=True, bold=True, dim=False),
     "bar.back": Style(color="grey23"),
     "bar.complete": Style(color="rgb(249,38,114)"),
     "bar.finished": Style(color="rgb(114,156,31)"),
--- a/rich/syntax.py
+++ b/rich/syntax.py
@@ -221,6 +221,7 @@ class _SyntaxHighlightRange(NamedTuple):
     style: StyleType
     start: SyntaxPosition
     end: SyntaxPosition
+    style_before: bool = False
 
 
 class Syntax(JupyterMixin):
@@ -534,7 +535,11 @@ def tokens_to_spans() -> Iterable[Tuple[str, Optional[Style]]]:
         return text
 
     def stylize_range(
-        self, style: StyleType, start: SyntaxPosition, end: SyntaxPosition
+        self,
# ... [165 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [107/129] `rich_3296` — fix(syntax): include padding with background color override

- **Repository & Baseline**: `Textualize/rich` @ `fde5d6eee3b0` (`2024-07-01`) | **Prompt Length**: `818` chars | **Complexity**: `T1-Micro (1-5L)` (`+1 / -3` across `1` file(s))
- **Production Files Modified**: `rich/syntax.py`
- **Hidden Grading Test Files**: `tests/test_syntax.py` (`+17 / -0` test lines)
- **Active Traps**: `TRAP-6` | **Assigned BCF Card**: `DC-04 (Override-Aware Style Helper Consistency)`
- **Level 1 — Observable Symptom**: `Syntax('x = 1', 'python', padding=(1, 3), background_color='red')` renders the code block with a red background, but renders the surrounding padding in the *theme's* default background color instead of `'red'`!
- **Level 2 — Code-Level Defect**: In `rich/syntax.py:__rich_console__()`, `Padding(segments, style=self._theme.get_background_style(), pad=self.padding)` bypassed `self._get_base_style()`, which is where `self.background_style` (`background_color='red'`) is merged over the theme background!
- **Level 3 — Architectural Root Cause**: Bypassing the class's canonical style resolver (`_get_base_style()`) by querying `self._theme.get_background_style()` directly.
- **Actionable Fix & BCF Brain Insight**: Replacing `self._theme.get_background_style()` with `self._get_base_style()` in `Syntax.__rich_console__` fixes padding background overrides in 1 line.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/syntax.py
+++ b/rich/syntax.py
@@ -619,9 +619,7 @@ def __rich_console__(
     ) -> RenderResult:
         segments = Segments(self._get_syntax(console, options))
         if self.padding:
-            yield Padding(
-                segments, style=self._theme.get_background_style(), pad=self.padding
-            )
+            yield Padding(segments, style=self._get_base_style(), pad=self.padding)
         else:
             yield segments
```
</details>

##### [108/129] `rich_3676` — Notes

- **Repository & Baseline**: `Textualize/rich` @ `2b5d648b2c62` (`2025-03-28`) | **Prompt Length**: `42` chars | **Complexity**: `T2-Surgical (6-25L)` (`+12 / -1` across `2` file(s))
- **Production Files Modified**: `rich/default_styles.py`, `rich/traceback.py`
- **Hidden Grading Test Files**: `tests/test_traceback.py` (`+15 / -0` test lines)
- **Active Traps**: `TRAP-2`, `TRAP-5`, `TRAP-8` | **Assigned BCF Card**: `DC-08 (PEP 678 Exception `__notes__` Extraction)`
- **Level 1 — Observable Symptom**: Exceptions enriched via Python 3.11+ PEP 678 `err.add_note('context')` (`err.__notes__`) have their notes silently omitted when formatted by `rich.traceback.Traceback`.
- **Level 2 — Code-Level Defect**: In `rich/traceback.py`, neither `Stack` nor `_SyntaxError` stored `notes: List[str]`, `Traceback.extract()` never read `getattr(exc_value, '__notes__', None)`, and `__rich_console__` never rendered `[traceback.note]` lines.
- **Level 3 — Architectural Root Cause**: PEP 678 introduced `BaseException.__notes__` in Python 3.11 after Rich's `Stack` dataclass schema was designed.
- **Actionable Fix & BCF Brain Insight**: Adding `notes: List[str] = field(default_factory=list)` to `_SyntaxError` and `Stack`, reading `getattr(exc_value, '__notes__', None) or []`, rendering `[traceback.note]Note:[/] ...`, and adding `'traceback.note'` to `default_styles.py` completes PEP 678 support.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/default_styles.py
+++ b/rich/default_styles.py
@@ -121,6 +121,7 @@
     "traceback.exc_value": Style.null(),
     "traceback.offset": Style(color="bright_red", bold=True),
     "traceback.error_range": Style(underline=True, bold=True, dim=False),
+    "traceback.note": Style(color="green", bold=True),
     "bar.back": Style(color="grey23"),
     "bar.complete": Style(color="rgb(249,38,114)"),
     "bar.finished": Style(color="rgb(114,156,31)"),
--- a/rich/traceback.py
+++ b/rich/traceback.py
@@ -191,6 +191,7 @@ class _SyntaxError:
     line: str
     lineno: int
     msg: str
+    notes: List[str] = field(default_factory=list)
 
 
 @dataclass
@@ -200,6 +201,7 @@ class Stack:
     syntax_error: Optional[_SyntaxError] = None
     is_cause: bool = False
     frames: List[Frame] = field(default_factory=list)
+    notes: List[str] = field(default_factory=list)
 
# ... [53 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [109/129] `rich_3518` — fix(table): highlight columns added by add_row

- **Repository & Baseline**: `Textualize/rich` @ `5ba9cb56e68d` (`2024-10-04`) | **Prompt Length**: `658` chars | **Complexity**: `T1-Micro (1-5L)` (`+1 / -1` across `1` file(s))
- **Production Files Modified**: `rich/table.py`
- **Hidden Grading Test Files**: `tests/test_table.py` (`+19 / -0` test lines)
- **Active Traps**: `TRAP-6` | **Assigned BCF Card**: `DC-03 (Implicit Child Component Attribute Inheritance)`
- **Level 1 — Observable Symptom**: Creating `Table(show_header=False, highlight=True)` and calling `table.add_row('1', "'FOO'")` without pre-declaring `add_column()` fails to highlight any cells!
- **Level 2 — Code-Level Defect**: In `rich/table.py:Table.add_row()` (`add_cell`), auto-created columns were instantiated via `column = Column(_index=index)` (whose default `highlight` is `False`) instead of inheriting `highlight=self.highlight` (as `Table.add_column` does).
- **Level 3 — Architectural Root Cause**: Inconsistent factory defaults between explicit `Table.add_column()` (`highlight=self.highlight if highlight is None else highlight`) and implicit `Column(_index=index)` auto-creation inside `add_row()`.
- **Actionable Fix & BCF Brain Insight**: Passing `Column(_index=index, highlight=self.highlight)` in `add_cell` makes implicit and explicit columns behave identically in 1 line.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/table.py
+++ b/rich/table.py
@@ -451,7 +451,7 @@ def add_cell(column: Column, renderable: "RenderableType") -> None:
             ]
         for index, renderable in enumerate(cell_renderables):
             if index == len(columns):
-                column = Column(_index=index)
+                column = Column(_index=index, highlight=self.highlight)
                 for _ in self.rows:
                     add_cell(column, Text(""))
                 self.columns.append(column)
```
</details>

##### [110/129] `rich_3469` — fix superfluous space

- **Repository & Baseline**: `Textualize/rich` @ `c478588f3c22` (`2024-08-26`) | **Prompt Length**: `75` chars | **Complexity**: `T1-Micro (1-5L)` (`+1 / -1` across `1` file(s))
- **Production Files Modified**: `rich/markdown.py`
- **Hidden Grading Test Files**: `tests/test_markdown.py` (`+28 / -3` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-5` | **Assigned BCF Card**: `DC-04 (Block vs Inline Newline Segment Guard)`
- **Level 1 — Observable Symptom**: Markdown paragraphs containing inline markup or line breaks emit a superfluous leading newline/space before `inline` token nodes.
- **Level 2 — Code-Level Defect**: In `rich/markdown.py:Markdown.__rich_console__()`, `if new_line: yield _new_line_segment` fired even when `node_type == 'inline'`.
- **Level 3 — Architectural Root Cause**: `markdown_it` wraps paragraph text inside an `'inline'` child token whose closing event inherited `new_line = True` from the preceding block state.
- **Actionable Fix & BCF Brain Insight**: Changing `if new_line:` to `if new_line and node_type != 'inline':` eliminates spurious inline newline segments in 1 line (Trap-1: updates golden string in `tests/test_markdown.py`).

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/markdown.py
+++ b/rich/markdown.py
@@ -677,7 +677,7 @@ def __rich_console__(
                         and context.stack.top.on_child_close(context, element)
                     )
                     if should_render:
-                        if new_line:
+                        if new_line and node_type != "inline":
                             yield _new_line_segment
                         yield from console.render(element, context.options)
```
</details>

##### [111/129] `rich_2725` — fix table rendering order of box elements

- **Repository & Baseline**: `Textualize/rich` @ `577def22dd83` (`2024-07-01`) | **Prompt Length**: `1777` chars | **Complexity**: `T2-Surgical (6-25L)` (`+5 / -5` across `1` file(s))
- **Production Files Modified**: `rich/table.py`
- **Hidden Grading Test Files**: `tests/test_table.py` (`+129 / -0` test lines)
- **Active Traps**: `STD` | **Assigned BCF Card**: `DC-04 (Positional Enum/Tuple Indexing Order)`
- **Level 1 — Observable Symptom**: Custom `Box` tables render `box.foot_left`/`foot_vertical`/`foot_right` characters on *body* rows and `box.mid_left`/`mid_vertical`/`mid_right` characters on the *footer* row!
- **Level 2 — Code-Level Defect**: In `rich/table.py:Table._render()`, the 3-element lookup list `box_segments = [head_tuple, foot_tuple, mid_tuple]` had `foot` at index `1` and `mid` at index `2`, while `_BoxElement` indexed `BODY = 1` and `FOOTER = 2` (or vice versa)!
- **Level 3 — Architectural Root Cause**: Transposed tuple order in `box_segments` went unnoticed on standard symmetric box styles (`SQUARE`, `ROUNDED`, `SIMPLE`) where `mid_*` and `foot_*` share identical vertical `│` glyphs!
- **Actionable Fix & BCF Brain Insight**: Swapping the `mid` and `foot` 3-tuples in `box_segments` (`[head, mid, foot]`) aligns box glyphs with `_render` row roles.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/table.py
+++ b/rich/table.py
@@ -775,16 +775,16 @@ def _render(
                     _Segment(_box.head_right, border_style),
                     _Segment(_box.head_vertical, border_style),
                 ),
-                (
-                    _Segment(_box.foot_left, border_style),
-                    _Segment(_box.foot_right, border_style),
-                    _Segment(_box.foot_vertical, border_style),
-                ),
                 (
                     _Segment(_box.mid_left, border_style),
                     _Segment(_box.mid_right, border_style),
                     _Segment(_box.mid_vertical, border_style),
                 ),
+                (
+                    _Segment(_box.foot_left, border_style),
+                    _Segment(_box.foot_right, border_style),
+                    _Segment(_box.foot_vertical, border_style),
+                ),
             ]
             if show_edge:
                 yield _Segment(_box.get_top(widths), border_style)
```
</details>

##### [112/129] `rich_3130` — Fix markdown table rendering issue with inline styles/links

- **Repository & Baseline**: `Textualize/rich` @ `720800e6930d` (`2023-09-17`) | **Prompt Length**: `878` chars | **Complexity**: `T2-Surgical (6-25L)` (`+5 / -7` across `1` file(s))
- **Production Files Modified**: `rich/markdown.py`
- **Hidden Grading Test Files**: `tests/test_markdown.py` (`+35 / -2` test lines)
- **Active Traps**: `TRAP-1` | **Assigned BCF Card**: `DC-09 (Accumulator Append vs Overwrite + Implicit String Concat Typo)`
- **Level 1 — Observable Symptom**: Markdown table cells containing inline bold/italic/links (`| *E.T.* |`) overwrite earlier text in the cell whenever a styled token ends, leaving only the last fragment!
- **Level 2 — Code-Level Defect**: In `rich/markdown.py:TableDataElement`, `on_text()` reassigned `self.content = Text(plain, ...)` instead of appending onto an initialized `Text` buffer, AND `create()` had an implicit string-literal concatenation typo `token.attrs.get('style' '')`!
- **Level 3 — Architectural Root Cause**: `TableDataElement` assumed `on_text` is called once per table cell, whereas `markdown_it` emits separate `on_text` callbacks for every plain and inline-styled span inside a cell.
- **Actionable Fix & BCF Brain Insight**: Initializing `self.content = Text('', justify=justify)` in `__init__`, appending in `on_text`, and fixing `token.attrs.get('style')` preserves multi-span Markdown table cells (Trap-1: 1 spacing adjustment in `tests/test_markdown.py`).

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/markdown.py
+++ b/rich/markdown.py
@@ -314,7 +314,7 @@ class TableDataElement(MarkdownElement):
 
     @classmethod
     def create(cls, markdown: "Markdown", token: Token) -> "MarkdownElement":
-        style = str(token.attrs.get("style" "")) or ""
+        style = str(token.attrs.get("style")) or ""
 
         justify: JustifyMethod
         if "text-align:right" in style:
@@ -330,15 +330,13 @@ def create(cls, markdown: "Markdown", token: Token) -> "MarkdownElement":
         return cls(justify=justify)
 
     def __init__(self, justify: JustifyMethod) -> None:
-        self.content: TextType = ""
+        self.content: Text = Text("", justify=justify)
         self.justify = justify
 
     def on_text(self, context: "MarkdownContext", text: TextType) -> None:
-        plain = text.plain if isinstance(text, Text) else text
-        style = text.style if isinstance(text, Text) else ""
-        self.content = Text(
-            plain, justify=self.justify, style=context.style_stack.current
-        )
+        text = Text(text) if isinstance(text, str) else text
# ... [5 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [113/129] `rich_3064` — fix for markdown table

- **Repository & Baseline**: `Textualize/rich` @ `01b85ac116c4` (`2023-07-29`) | **Prompt Length**: `76` chars | **Complexity**: `T2-Surgical (6-25L)` (`+8 / -9` across `1` file(s))
- **Production Files Modified**: `rich/markdown.py`
- **Hidden Grading Test Files**: `tests/test_markdown.py` (`+8 / -0` test lines)
- **Active Traps**: `TRAP-5` | **Assigned BCF Card**: `DC-08 (Graceful Partial-AST Guard vs Bare Assert)`
- **Level 1 — Observable Symptom**: Rendering a header-only Markdown table without body rows (`'| Simple | Table |\n| ------ | ----- '`, e.g., during live LLM token streaming!) crashes `Markdown` with `AssertionError`.
- **Level 2 — Code-Level Defect**: In `rich/markdown.py:TableElement.__rich_console__()`, lines 257–262 executed bare `assert self.header is not None`, `assert self.header.row is not None`, and `assert self.body is not None`.
- **Level 3 — Architectural Root Cause**: `markdown_it` parses a table with a header + delimiter line and zero body rows into a `TableElement` where `self.body` remains `None`; internal `assert`s crashed valid incremental Markdown renders.
- **Actionable Fix & BCF Brain Insight**: Replacing the three `assert` statements with `if self.header is not None and self.header.row is not None:` and `if self.body is not None:` allows partial/streaming Markdown tables to render cleanly.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/markdown.py
+++ b/rich/markdown.py
@@ -254,15 +254,14 @@ def __rich_console__(
     ) -> RenderResult:
         table = Table(box=box.SIMPLE_HEAVY)
 
-        assert self.header is not None
-        assert self.header.row is not None
-        for column in self.header.row.cells:
-            table.add_column(column.content)
-
-        assert self.body is not None
-        for row in self.body.rows:
-            row_content = [element.content for element in row.cells]
-            table.add_row(*row_content)
+        if self.header is not None and self.header.row is not None:
+            for column in self.header.row.cells:
+                table.add_column(column.content)
+
+        if self.body is not None:
+            for row in self.body.rows:
+                row_content = [element.content for element in row.cells]
+                table.add_row(*row_content)
 
         yield table
```
</details>

#### SUB-6C: Console/Live/Progress/Prompt I/O Proxies, BrokenPipe, HTML Export & CI TTY Flags (12 Tasks)

##### [114/129] `rich_4077` — proxy isatty

- **Repository & Baseline**: `Textualize/rich` @ `58ac15120fe2` (`2026-04-12`) | **Prompt Length**: `66` chars | **Complexity**: `T1-Micro (1-5L)` (`+3 / -0` across `1` file(s))
- **Production Files Modified**: `rich/file_proxy.py`
- **Hidden Grading Test Files**: `tests/test_file_proxy.py` (`+17 / -0` test lines)
- **Active Traps**: `TRAP-5`, `TRAP-6` | **Assigned BCF Card**: `DC-12 (Transparent IO Wrapper Method Forwarding)`
- **Level 1 — Observable Symptom**: When `rich.live.Live` redirects `sys.stdout` through `FileProxy`, calling `sys.stdout.isatty()` raises `AttributeError: 'FileProxy' object has no attribute 'isatty'` (12-char prompt: `'proxy isatty'`).
- **Level 2 — Code-Level Defect**: `rich/file_proxy.py:FileProxy` proxied `write`, `flush`, and `fileno` to `self.__file`, but omitted `def isatty(self) -> bool: return self.__file.isatty()`.
- **Level 3 — Architectural Root Cause**: `FileProxy` subclasses `io.TextIOBase` (whose default `isatty()` returns `False` or is expected to delegate on wrappers), breaking CLI tools checking `stdout.isatty()` under `Live(redirect_stdout=True)`.
- **Actionable Fix & BCF Brain Insight**: Adding `def isatty(self) -> bool: return self.__file.isatty()` to `FileProxy` resolves `rich_4077` in 3 lines—a textbook `PC-5` noun-anchor (`proxy` -> `file_proxy.py`, `isatty` -> `def isatty`) localization win.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/file_proxy.py
+++ b/rich/file_proxy.py
@@ -55,3 +55,6 @@ def flush(self) -> None:
 
     def fileno(self) -> int:
         return self.__file.fileno()
+
+    def isatty(self) -> bool:
+        return self.__file.isatty()
```
</details>

##### [115/129] `rich_4075` — empty with end

- **Repository & Baseline**: `Textualize/rich` @ `1fc7cb210ae5` (`2026-04-11`) | **Prompt Length**: `101` chars | **Complexity**: `T2-Surgical (6-25L)` (`+12 / -3` across `1` file(s))
- **Production Files Modified**: `rich/console.py`
- **Hidden Grading Test Files**: `tests/test_console.py` (`+6 / -0` test lines)
- **Active Traps**: `TRAP-5` | **Assigned BCF Card**: `DC-04 (Default vs Custom Keyword Argument Branching)`
- **Level 1 — Observable Symptom**: Calling `console.print(end='!')` with no positional objects outputs `'\n!'` instead of `'!'` (ignoring that `end` overrode the default newline!).
- **Level 2 — Code-Level Defect**: In `rich/console.py:Console.print()`, `if not objects: objects = (NewLine(),)` unconditionally emitted a `NewLine()` renderable even when `end != '\n'`, and then also appended `end`!
- **Level 3 — Architectural Root Cause**: Python's built-in `print(end='!')` prints `'' + '!' == '!'`, whereas Rich replaced empty `objects` with `NewLine()` assuming `end` was `'\n'` (and omitted `end` when `NewLine()` ran, or doubled up).
- **Actionable Fix & BCF Brain Insight**: Changing `if not objects:` to `objects = (NewLine(),) if end == '\n' else ('',)` matches builtin `print(end=...)` semantics cleanly.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/console.py
+++ b/rich/console.py
@@ -7,6 +7,7 @@
 from functools import wraps
 from itertools import islice
 from math import ceil
+from os import PathLike
 from time import monotonic
 from types import FrameType, ModuleType, TracebackType
 from typing import (
@@ -29,7 +30,6 @@
     cast,
     runtime_checkable,
 )
-from os import PathLike
 
 from rich._null_file import NULL_FILE
 
@@ -1687,7 +1687,10 @@ def print(
             new_line_start (bool, False): Insert a new line at the start if the output contains more than one line. Defaults to ``False``.
         """
         if not objects:
-            objects = (NewLine(),)
+            if end == "\n":
+                objects = (NewLine(),)
+            else:
# ... [19 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [116/129] `rich_3934` — empty live

- **Repository & Baseline**: `Textualize/rich` @ `6764b24739b5` (`2026-01-22`) | **Prompt Length**: `64` chars | **Complexity**: `T2-Surgical (6-25L)` (`+17 / -3` across `2` file(s))
- **Production Files Modified**: `rich/live.py`, `rich/live_render.py`
- **Hidden Grading Test Files**: `tests/test_live.py` (`+18 / -0` test lines)
- **Active Traps**: `TRAP-2`, `TRAP-5` | **Assigned BCF Card**: `DC-07 (Zero-Height Renderable Terminal Newline Guard)`
- **Level 1 — Observable Symptom**: Starting and stopping a `rich.live.Live` context whose renderable produces 0 lines (e.g., an empty `Group()`) still writes a spurious blank newline `'\n'` to the terminal on `Live.stop()`!
- **Level 2 — Code-Level Defect**: In `rich/live.py:Live.stop()`, `if not self._alt_screen and self.console.is_terminal: self.console.line()` printed a newline unconditionally even when `self._live_render._shape` was `None` or had height `0`.
- **Level 3 — Architectural Root Cause**: `Live.stop()` advances the cursor past the last rendered line so subsequent shell output doesn't overwrite it, assuming at least 1 line was drawn on screen.
- **Actionable Fix & BCF Brain Insight**: Adding `@property def last_render_height(self) -> int` on `LiveRender` (`0` if `_shape is None` else `_shape[1]`) and checking `and self._live_render.last_render_height` in `Live.stop()` suppresses blank lines on empty renders.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/live.py
+++ b/rich/live.py
@@ -166,7 +166,11 @@ def stop(self) -> None:
                 finally:
                     self._disable_redirect_io()
                     self.console.pop_render_hook()
-                    if not self._alt_screen and self.console.is_terminal:
+                    if (
+                        not self._alt_screen
+                        and self.console.is_terminal
+                        and self._live_render.last_render_height
+                    ):
                         self.console.line()
                     self.console.show_cursor(True)
                     if self._alt_screen:
--- a/rich/live_render.py
+++ b/rich/live_render.py
@@ -1,5 +1,4 @@
-from typing import Optional, Tuple, Literal
-
+from typing import Literal, Optional, Tuple
 
 from ._loop import loop_last
 from .console import Console, ConsoleOptions, RenderableType, RenderResult
@@ -30,6 +29,17 @@ def __init__(
         self.vertical_overflow = vertical_overflow
# ... [15 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [117/129] `rich_3882` — Fix raw markup printed on prompt errors sometimes

- **Repository & Baseline**: `Textualize/rich` @ `4d6d631a3d2d` (`2026-01-23`) | **Prompt Length**: `652` chars | **Complexity**: `T1-Micro (1-5L)` (`+1 / -1` across `1` file(s))
- **Production Files Modified**: `rich/prompt.py`
- **Hidden Grading Test Files**: `tests/test_prompt.py` (`+13 / -0` test lines)
- **Active Traps**: `TRAP-6` | **Assigned BCF Card**: `DC-04 (Explicit Render Flag Override on Shared Console)`
- **Level 1 — Observable Symptom**: Using `Confirm.ask()` or `Prompt.ask()` with a `Console(markup=False)` prints raw unparsed `[prompt.invalid]Please enter Y or N` markup tags on validation errors!
- **Level 2 — Code-Level Defect**: In `rich/prompt.py:PromptBase.on_validate_error()`, `self.console.print(error)` relied on the console's global `markup` setting even though `InvalidResponse.__rich__` / message strings hardcode Rich markup tags (`[prompt.invalid]...`).
- **Level 3 — Architectural Root Cause**: Internal widget error messages authored as Rich markup strings assumed `console._markup == True` instead of passing `markup=True` explicitly at the `console.print()` call site.
- **Actionable Fix & BCF Brain Insight**: Changing `self.console.print(error)` to `self.console.print(error, markup=True)` fixes validation-error rendering on `markup=False` consoles in 1 line.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/prompt.py
+++ b/rich/prompt.py
@@ -262,7 +262,7 @@ def on_validate_error(self, value: str, error: InvalidResponse) -> None:
             value (str): String entered by user.
             error (InvalidResponse): Exception instance the initiated the error.
         """
-        self.console.print(error)
+        self.console.print(error, markup=True)
 
     def pre_prompt(self) -> None:
         """Hook to display something before the prompt."""
```
</details>

##### [118/129] `rich_3905` — Update progress.py

- **Repository & Baseline**: `Textualize/rich` @ `96dd4b60e3a7` (`2026-01-23`) | **Prompt Length**: `1670` chars | **Complexity**: `T2-Surgical (6-25L)` (`+4 / -3` across `1` file(s))
- **Production Files Modified**: `rich/progress.py`
- **Hidden Grading Test Files**: `tests/test_progress.py` (`+24 / -0` test lines)
- **Active Traps**: `STD` | **Assigned BCF Card**: `DC-04 (Disabled-Component Teardown Guard)`
- **Level 1 — Observable Symptom**: Running `with Progress(disable=True):` on a non-interactive console (`force_interactive=False`) outputs an extraneous blank line `'\n'` when the `with` block exits!
- **Level 2 — Code-Level Defect**: In `rich/progress.py:Progress.stop()`, while `Progress.start()` guarded `if not self.disable: self.live.start()`, `Progress.stop()` unconditionally executed `self.live.stop()` and `if not self.console.is_interactive and not self.console.is_jupyter: self.console.print()`!
- **Level 3 — Architectural Root Cause**: Asymmetric lifecycle guard: `start()` checked `if not self.disable:`, whereas `stop()` omitted the `if not self.disable:` guard.
- **Actionable Fix & BCF Brain Insight**: Wrapping the body of `Progress.stop()` inside `if not self.disable:` makes disabled `Progress` blocks true zero-output no-ops across both interactive and non-interactive consoles.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/progress.py
+++ b/rich/progress.py
@@ -1172,9 +1172,10 @@ def start(self) -> None:
 
     def stop(self) -> None:
         """Stop the progress display."""
-        self.live.stop()
-        if not self.console.is_interactive and not self.console.is_jupyter:
-            self.console.print()
+        if not self.disable:
+            self.live.stop()
+            if not self.console.is_interactive and not self.console.is_jupyter:
+                self.console.print()
 
     def __enter__(self) -> Self:
         self.start()
```
</details>

##### [119/129] `rich_3777` — TTY_INTERACTIVE env var

- **Repository & Baseline**: `Textualize/rich` @ `49117ced6648` (`2025-06-23`) | **Prompt Length**: `341` chars | **Complexity**: `T2-Surgical (6-25L)` (`+12 / -1` across `2` file(s))
- **Production Files Modified**: `rich/console.py`, `rich/diagnose.py`
- **Hidden Grading Test Files**: `tests/test_console.py` (`+25 / -0` test lines)
- **Active Traps**: `TRAP-2` | **Assigned BCF Card**: `DC-04 (Environment Variable Precedence Matrix)`
- **Level 1 — Observable Symptom**: Setting `TTY_COMPATIBLE=1` in CI enables ANSI colors (`is_terminal == True`), which also turns `console.is_interactive == True` and floods CI logs with progress bar / spinner animations unless `TTY_INTERACTIVE=0` is supported.
- **Level 2 — Code-Level Defect**: In `rich/console.py:Console.__init__()`, `force_interactive` did not consult `self._environ.get('TTY_INTERACTIVE')` when `force_interactive is None`, and `rich/diagnose.py` omitted `'TTY_INTERACTIVE'`.
- **Level 3 — Architectural Root Cause**: Coupling `self.is_interactive = self.is_terminal and not self.is_dumb_terminal` without an independent `TTY_INTERACTIVE=0|1` environment override.
- **Actionable Fix & BCF Brain Insight**: Reading `tty_interactive = self._environ.get('TTY_INTERACTIVE', None)` when `force_interactive is None` (`'0' -> False`, `'1' -> True`) and listing `'TTY_INTERACTIVE'` in `rich/diagnose.py` decouples color support from interactive animations.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/console.py
+++ b/rich/console.py
@@ -22,18 +22,20 @@
     Dict,
     Iterable,
     List,
+    Literal,
     Mapping,
     NamedTuple,
     Optional,
+    Protocol,
     TextIO,
     Tuple,
     Type,
     Union,
     cast,
+    runtime_checkable,
 )
 
 from rich._null_file import NULL_FILE
-from typing import Literal, Protocol, runtime_checkable
 
 from . import errors, themes
 from ._emoji_replace import _emoji_replace
@@ -731,6 +733,14 @@ def __init__(
             if no_color is not None
# ... [23 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [120/129] `rich_3468` — handle broken pipe

- **Repository & Baseline**: `Textualize/rich` @ `ae15db600976` (`2024-08-26`) | **Prompt Length**: `146` chars | **Complexity**: `T3-Moderate (26-80L)` (`+36 / -6` across `1` file(s))
- **Production Files Modified**: `rich/console.py`
- **Hidden Grading Test Files**: `tests/test_console.py` (`+21 / -0` test lines)
- **Active Traps**: `TRAP-5`, `TRAP-8` | **Assigned BCF Card**: `DC-08 (POSIX BrokenPipeError / SIGPIPE Graceful Exit)`
- **Level 1 — Observable Symptom**: Piping Rich output to `head` on Linux/macOS (`python -m rich | head -n 5`) prints a noisy unhandled `BrokenPipeError: [Errno 32] Broken pipe` traceback when the downstream reader closes the pipe.
- **Level 2 — Code-Level Defect**: In `rich/console.py:Console._check_buffer()`, `self.file.write(...)` and `self.file.flush()` did not catch `BrokenPipeError` or redirect `sys.stdout` fd to `os.devnull` per Python's official SIGPIPE guidelines.
- **Level 3 — Architectural Root Cause**: CPython ignores `SIGPIPE` by default and translates `EPIPE` writes into `BrokenPipeError`; without redirecting fd 1 to `/devnull` on exit, interpreter shutdown flush raises a second `Exception ignored in: <_io.TextIOWrapper>` error on stderr.
- **Actionable Fix & BCF Brain Insight**: Adding `Console.on_broken_pipe(self)` (`self.quiet = True`, `os.dup2(os.open(os.devnull, os.O_WRONLY), sys.stdout.fileno())`, `raise SystemExit(1)`) and catching `BrokenPipeError` in `_check_buffer` follows CPython's `signal` docs verbatim.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/console.py
+++ b/rich/console.py
@@ -1385,9 +1385,14 @@ def render_lines(
                 extra_lines = render_options.height - len(lines)
                 if extra_lines > 0:
                     pad_line = [
-                        [Segment(" " * render_options.max_width, style), Segment("\n")]
-                        if new_lines
-                        else [Segment(" " * render_options.max_width, style)]
+                        (
+                            [
+                                Segment(" " * render_options.max_width, style),
+                                Segment("\n"),
+                            ]
+                            if new_lines
+                            else [Segment(" " * render_options.max_width, style)]
+                        )
                     ]
                     lines.extend(pad_line * extra_lines)
 
@@ -1436,9 +1441,11 @@ def render_str(
             rich_text.overflow = overflow
         else:
             rich_text = Text(
-                _emoji_replace(text, default_variant=self._emoji_variant)
-                if emoji_enabled
# ... [46 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [121/129] `rich_3675` — TTY_COMPATIBLE

- **Repository & Baseline**: `Textualize/rich` @ `edc6b0a39b6d` (`2025-03-28`) | **Prompt Length**: `166` chars | **Complexity**: `T3-Moderate (26-80L)` (`+28 / -13` across `2` file(s))
- **Production Files Modified**: `rich/console.py`, `rich/diagnose.py`
- **Hidden Grading Test Files**: `tests/test_console.py` (`+151 / -85` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-2`, `TRAP-5`, `TRAP-8` | **Assigned BCF Card**: `DC-04 (Environment Variable Precedence Matrix)`
- **Level 1 — Observable Symptom**: CI environments like GitHub Actions support ANSI colors/styles (`FORCE_COLOR`), yet Rich lacks `TTY_COMPATIBLE=0|1` to explicitly declare ANSI escape compatibility without conflating it with `NO_COLOR=''`.
- **Level 2 — Code-Level Defect**: In `rich/console.py`, `Console.is_terminal` had no `TTY_COMPATIBLE` check (`'0' -> False`, `'1' -> True`), `NO_COLOR` checked `'NO_COLOR' in self._environ` (treating empty `NO_COLOR=''` as disabled!), and `rich/diagnose.py` omitted `TTY_COMPATIBLE`.
- **Level 3 — Architectural Root Cause**: Standard CI terminal environment specs (`no-color.org` specifies non-empty `NO_COLOR`, and `TTY_COMPATIBLE` separates escape-sequence capability from physical TTY attachment).
- **Actionable Fix & BCF Brain Insight**: Checking `self._environ.get('NO_COLOR', '') != ''`, handling `TTY_COMPATIBLE` `'0'`/`'1'` in `Console.is_terminal`, and adding `'TTY_COMPATIBLE'` to `rich/diagnose.py` implements full CI terminal control.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/console.py
+++ b/rich/console.py
@@ -500,7 +500,7 @@ def group(fit: bool = True) -> Callable[..., Callable[..., Group]]:
     """
 
     def decorator(
-        method: Callable[..., Iterable[RenderableType]]
+        method: Callable[..., Iterable[RenderableType]],
     ) -> Callable[..., Group]:
         """Convert a method that returns an iterable of renderables in to a Group."""
 
@@ -735,7 +735,9 @@ def __init__(
         self.get_time = get_time or monotonic
         self.style = style
         self.no_color = (
-            no_color if no_color is not None else "NO_COLOR" in self._environ
+            no_color
+            if no_color is not None
+            else self._environ.get("NO_COLOR", "") != ""
         )
         self.is_interactive = (
             (self.is_terminal and not self.is_dumb_terminal)
@@ -933,11 +935,13 @@ def is_terminal(self) -> bool:
 
         Returns:
             bool: True if the console writing to a device capable of
# ... [64 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [122/129] `rich_3470` — Fix record and capture

- **Repository & Baseline**: `Textualize/rich` @ `0ba607dc080c` (`2024-08-26`) | **Prompt Length**: `74` chars | **Complexity**: `T1-Micro (1-5L)` (`+1 / -1` across `1` file(s))
- **Production Files Modified**: `rich/console.py`
- **Hidden Grading Test Files**: `tests/test_console.py` (`+21 / -17` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-5` | **Assigned BCF Card**: `DC-09 (Nested Buffer Index Guard on Recording)`
- **Level 1 — Observable Symptom**: Using `with console.capture() as capture:` on a `Console(record=True)` instance either leaks captured output to stdout/record buffer prematurely or breaks nested buffer state.
- **Level 2 — Code-Level Defect**: In `rich/console.py:Console._write_buffer()`, `if self.record:` appended `self._buffer[:]` into `self._record_buffer` without checking `and not self._buffer_index` (whether an inner buffer context like `capture()` is still active).
- **Level 3 — Architectural Root Cause**: `Console` uses `_buffer_index` to ref-count nested `with console:` buffering contexts; `_write_buffer` checked `_buffer_index == 0` for file flushing but forgot to guard `_record_buffer.extend` with the same condition.
- **Actionable Fix & BCF Brain Insight**: Changing `if self.record:` to `if self.record and not self._buffer_index:` synchronizes recording with top-level buffer flushes (Trap-1: updates `test_capture_and_record` in `tests/test_console.py`).

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/console.py
+++ b/rich/console.py
@@ -2029,7 +2029,7 @@ def _write_buffer(self) -> None:
         """Write the buffer to the output file."""
 
         with self._lock:
-            if self.record:
+            if self.record and not self._buffer_index:
                 with self._record_buffer_lock:
                     self._record_buffer.extend(self._buffer[:])
```
</details>

##### [123/129] `rich_3052` — Case insensitive prompt choices

- **Repository & Baseline**: `Textualize/rich` @ `7a168a27c509` (`2024-07-01`) | **Prompt Length**: `857` chars | **Complexity**: `T3-Moderate (26-80L)` (`+29 / -5` across `1` file(s))
- **Production Files Modified**: `rich/prompt.py`
- **Hidden Grading Test Files**: `tests/test_prompt.py` (`+19 / -1` test lines)
- **Active Traps**: `TRAP-1` | **Assigned BCF Card**: `DC-03 (Case-Insensitive Choice Matching with Canonical Return)`
- **Level 1 — Observable Symptom**: `Prompt.ask('...', choices=['Paul', 'Jessica'])` rejects lowercase `'paul'` because it lacks a `case_sensitive: bool = True` option.
- **Level 2 — Code-Level Defect**: `rich/prompt.py:PromptBase` (`__init__`, `ask` overloads + implementation, `check_choice`, `process_response`) only performed exact `value in self.choices` membership checks without normalizing case or mapping matched input back to the canonical choice string.
- **Level 3 — Architectural Root Cause**: Missing opt-in case-folding normalization (`case_sensitive=False`) returning the original canonical item from `self.choices` (e.g., `'FoO'` -> `'foo'` when `choices=['foo', 'bar']`).
- **Actionable Fix & BCF Brain Insight**: Threading `case_sensitive: bool = True` through `PromptBase.__init__` and `ask` (including `@overload` signatures), checking lowercase membership in `check_choice`, and mapping to the canonical choice in `process_response` implements clean CLI UX.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/prompt.py
+++ b/rich/prompt.py
@@ -36,6 +36,7 @@ class PromptBase(Generic[PromptType]):
         console (Console, optional): A Console instance or None to use global console. Defaults to None.
         password (bool, optional): Enable password input. Defaults to False.
         choices (List[str], optional): A list of valid choices. Defaults to None.
+        case_sensitive (bool, optional): Matching of choices should be case-sensitive. Defaults to True.
         show_default (bool, optional): Show default in prompt. Defaults to True.
         show_choices (bool, optional): Show choices in prompt. Defaults to True.
     """
@@ -57,6 +58,7 @@ def __init__(
         console: Optional[Console] = None,
         password: bool = False,
         choices: Optional[List[str]] = None,
+        case_sensitive: bool = True,
         show_default: bool = True,
         show_choices: bool = True,
     ) -> None:
@@ -69,6 +71,7 @@ def __init__(
         self.password = password
         if choices is not None:
             self.choices = choices
+        self.case_sensitive = case_sensitive
         self.show_default = show_default
         self.show_choices = show_choices
 
# ... [93 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [124/129] `rich_3105` — Fix #3104

- **Repository & Baseline**: `Textualize/rich` @ `9f620dc50c00` (`2023-11-07`) | **Prompt Length**: `450` chars | **Complexity**: `T1-Micro (1-5L)` (`+1 / -1` across `1` file(s))
- **Production Files Modified**: `rich/_export_format.py`
- **Hidden Grading Test Files**: `tests/test_console.py` (`+3 / -3` test lines)
- **Active Traps**: `TRAP-1` | **Assigned BCF Card**: `DC-14 (CSS Font Inheritance on Nested `<code>`)`
- **Level 1 — Observable Symptom**: HTML exported via `console.export_html()` ignores `<pre style="font-family:Menlo,...">` in browsers because the inner `<code>` element resets `font-family` to the browser's default user-agent `monospace` stylesheet!
- **Level 2 — Code-Level Defect**: In `rich/_export_format.py`, line 15 wrote `<pre style="font-family:..."><code >{code}</code></pre>` without `style="font-family:inherit"` on `<code>`.
- **Level 3 — Architectural Root Cause**: CSS specificity/inheritance quirk in HTML user-agent stylesheets: browsers assign `code { font-family: monospace }` directly on `<code>`, overriding inherited `font-family` from parent `<pre>` unless `font-family: inherit` is set.
- **Actionable Fix & BCF Brain Insight**: Changing `<code>{code}</code>` to `<code style="font-family:inherit">{code}</code>` in `rich/_export_format.py` fixes exported font rendering (Trap-1 + Trap-4 opaque prompt `'Fix #3104'` + Trap-6 constant file).

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/_export_format.py
+++ b/rich/_export_format.py
@@ -12,7 +12,7 @@
 </style>
 </head>
 <body>
-    <pre style="font-family:Menlo,'DejaVu Sans Mono',consolas,'Courier New',monospace"><code>{code}</code></pre>
+    <pre style="font-family:Menlo,'DejaVu Sans Mono',consolas,'Courier New',monospace"><code style="font-family:inherit">{code}</code></pre>
 </body>
 </html>
 """
```
</details>

##### [125/129] `rich_3043` — Fix the HTML export template

- **Repository & Baseline**: `Textualize/rich` @ `8a616de8e25d` (`2023-07-29`) | **Prompt Length**: `286` chars | **Complexity**: `T1-Micro (1-5L)` (`+1 / -1` across `1` file(s))
- **Production Files Modified**: `rich/_export_format.py`
- **Hidden Grading Test Files**: `tests/test_console.py` (`+3 / -3` test lines)
- **Active Traps**: `TRAP-1` | **Assigned BCF Card**: `DC-14 (Module Template Constant Inspection)`
- **Level 1 — Observable Symptom**: `console.export_html()` produces invalid HTML5 markup where `<head>...</head>` appears *outside* and *before* the opening `<html>` tag!
- **Level 2 — Code-Level Defect**: In `rich/_export_format.py`, `CONSOLE_HTML_FORMAT` placed `<html>` on line 10 (after `</head>` and before `<body>`) instead of line 2 (immediately after `<!DOCTYPE html>`).
- **Level 3 — Architectural Root Cause**: Malformed HTML template string constant in `rich/_export_format.py` (Trap-6: module-level string constant has zero function/class nodes in the precomputed AST call graph, AND Trap-1: `tests/test_console.py` asserted the old malformed HTML!).
- **Actionable Fix & BCF Brain Insight**: Moving `<html>` above `<head>` in `CONSOLE_HTML_FORMAT` fixes HTML validity in 2 lines—proving why `rg` text search beats AST call graphs on constant-only modules.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/rich/_export_format.py
+++ b/rich/_export_format.py
@@ -1,5 +1,6 @@
 CONSOLE_HTML_FORMAT = """\
 <!DOCTYPE html>
+<html>
 <head>
 <meta charset="UTF-8">
 <style>
@@ -10,7 +11,6 @@
 }}
 </style>
 </head>
-<html>
 <body>
     <pre style="font-family:Menlo,'DejaVu Sans Mono',consolas,'Courier New',monospace"><code>{code}</code></pre>
 </body>
```
</details>

### CAT-7: Release Automation Scripts & Executable Documentation (`docs_src/`) Integrity (4 Tasks)

**Category Overview:** Repository release automation CLI tooling (`scripts/prepare_release.py`) and executable documentation (`docs_src/`) tutorials directly imported and verified by graded `pytest` suites.

#### SUB-7A: Standalone Release Automation CLI Tooling (`scripts/prepare_release.py`) (1 Tasks)

##### [126/129] `fastapi_15661` — 👷 Automate release preparation

- **Repository & Baseline**: `fastapi/fastapi` @ `ee22a4b8ca46` (`2026-05-31`) | **Prompt Length**: `1023` chars | **Complexity**: `T4-Arch (>80L)` (`+216 / -0` across `1` file(s))
- **Production Files Modified**: `scripts/prepare_release.py`
- **Hidden Grading Test Files**: `tests/test_prepare_release.py` (`+307 / -0` test lines)
- **Active Traps**: `STD` | **Assigned BCF Card**: `DC-14 (Standalone Typer CLI Script Synthesis)`
- **Level 1 — Observable Symptom**: Automate FastAPI release preparation (`👷 Automate release preparation`) by creating `scripts/prepare_release.py` to bump `fastapi/__init__.py` `__version__` and promote `## Latest Changes` in `docs/en/docs/release-notes.md`.
- **Level 2 — Code-Level Defect**: `scripts/prepare_release.py` does not exist at `base_commit` (`ee22a4b8`); only `scripts/add_latest_release_date.py` exists.
- **Level 3 — Architectural Root Cause**: Net-new standalone `Typer` CLI script (`+216 / -0`) modeled on `fastapi/asyncer#608` where the PR body has an empty description (`TRAP-4` + `TRAP-6`: zero nodes for `prepare_release` in the AST graph!).
- **Actionable Fix & BCF Brain Insight**: Inspecting sibling `scripts/add_latest_release_date.py`, `docs/en/docs/release-notes.md` frontmatter, and `fastapi/__init__.py` `__version__` reveals repository conventions, though exact function names (`get_release_notes_body`, `BumpType`) tested by `test_prepare_release.py` make unguided net-new API synthesis challenging.

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/scripts/prepare_release.py
+++ b/scripts/prepare_release.py
@@ -0,0 +1,216 @@
+"""Prepare a release by updating the package version and release notes."""
+
+import re
+from datetime import date
+from pathlib import Path
+from typing import Annotated, Literal
+
+import typer
+
+VERSION_PATTERN = re.compile(r'(?m)^__version__ = "(\d+\.\d+\.\d+)"$')
+VERSION_HEADING_PATTERN = re.compile(r"(?m)^## (\d+\.\d+\.\d+)(?: \([^)]+\))?$")
+RELEASE_NOTES_HEADER = """---
+hide:
+  - navigation
+---
+
+# Release Notes
+
+"""
+LATEST_CHANGES_HEADER = "## Latest Changes"
+BumpType = Literal["major", "minor", "patch"]
+
+app = typer.Typer()
# ... [193 additional diff lines omitted for brevity; full file list above] ...
```
</details>

#### SUB-7B: Executable Documentation (`docs_src/`) Metadata, Context-Manager & Error Hygiene (3 Tasks)

##### [127/129] `fastapi_15023` — 📝 Update docs for responses and new stream with `yield`

- **Repository & Baseline**: `fastapi/fastapi` @ `c0836dc1b7f4` (`2026-02-27`) | **Prompt Length**: `112` chars | **Complexity**: `T3-Moderate (26-80L)` (`+18 / -8` across `1` file(s))
- **Production Files Modified**: `docs_src/stream_data/tutorial002_py310.py`
- **Hidden Grading Test Files**: `tests/test_tutorial/test_stream_data/test_tutorial002.py` (`+15 / -0` test lines)
- **Active Traps**: `TRAP-2`, `TRAP-5` | **Assigned BCF Card**: `DC-15 (Executable Tutorial `docs_src/` Audit)`
- **Level 1 — Observable Symptom**: Streaming data tutorial `docs_src/stream_data/tutorial002_py310.py` iterates `read_image()` without a `with` context manager and lacks a `yield from` sync streaming example.
- **Level 2 — Code-Level Defect**: In `docs_src/stream_data/tutorial002_py310.py`, endpoints iterated `for chunk in read_image():` directly instead of `with read_image() as image_file:` and lacked `@app.get('/image/stream-no-async-yield-from')`.
- **Level 3 — Architectural Root Cause**: Documentation update aligning `docs_src/stream_data/` with context-managed generator cleanup (`#14099`) and `yield from` patterns.
- **Actionable Fix & BCF Brain Insight**: Shows that in FastAPI, `📝 Update docs...` tasks modify Python code inside `docs_src/` rather than Markdown files under `docs/` (`sample_submission/prompts/system.md` Rule 2).

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/docs_src/stream_data/tutorial002_py310.py
+++ b/docs_src/stream_data/tutorial002_py310.py
@@ -22,23 +22,33 @@ class PNGStreamingResponse(StreamingResponse):
 
 @app.get("/image/stream", response_class=PNGStreamingResponse)
 async def stream_image() -> AsyncIterable[bytes]:
-    for chunk in read_image():
-        yield chunk
+    with read_image() as image_file:
+        for chunk in image_file:
+            yield chunk
 
 
 @app.get("/image/stream-no-async", response_class=PNGStreamingResponse)
 def stream_image_no_async() -> Iterable[bytes]:
-    for chunk in read_image():
-        yield chunk
+    with read_image() as image_file:
+        for chunk in image_file:
+            yield chunk
+
+
+@app.get("/image/stream-no-async-yield-from", response_class=PNGStreamingResponse)
+def stream_image_no_async_yield_from() -> Iterable[bytes]:
+    with read_image() as image_file:
+        yield from image_file
# ... [18 additional diff lines omitted for brevity; full file list above] ...
```
</details>

##### [128/129] `fastapi_14492` — 📝 Fix example of license identifier in documentation

- **Repository & Baseline**: `fastapi/fastapi` @ `a456e92a21d5` (`2026-02-04`) | **Prompt Length**: `159` chars | **Complexity**: `T1-Micro (1-5L)` (`+1 / -1` across `1` file(s))
- **Production Files Modified**: `docs_src/metadata/tutorial001_1_py39.py`
- **Hidden Grading Test Files**: `tests/test_tutorial/test_metadata/test_tutorial001_1.py` (`+1 / -1` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-2`, `TRAP-5` | **Assigned BCF Card**: `DC-15 (Executable Tutorial `docs_src/` Audit)`
- **Level 1 — Observable Symptom**: FastAPI's metadata tutorial `docs_src/metadata/tutorial001_1_py39.py` pairs `"name": "Apache 2.0"` with inconsistent SPDX `"identifier": "MIT"`.
- **Level 2 — Code-Level Defect**: In `docs_src/metadata/tutorial001_1_py39.py` line 20, `license_info` set `"identifier": "MIT"` instead of `"Apache-2.0"`.
- **Level 3 — Architectural Root Cause**: Copy-paste typo in executable documentation example (verified by `tests/test_tutorial/test_metadata/test_tutorial001_1.py`).
- **Actionable Fix & BCF Brain Insight**: Changing `'MIT'` to `'Apache-2.0'` in `docs_src/metadata/tutorial001_1_py39.py` is a 1-line fix—highlighting `TRAP-1` (`test_tutorial001_1.py` in the visible workspace asserts `'MIT'` until `test_patch` updates it!).

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/docs_src/metadata/tutorial001_1_py39.py
+++ b/docs_src/metadata/tutorial001_1_py39.py
@@ -28,7 +28,7 @@
     },
     license_info={
         "name": "Apache 2.0",
-        "identifier": "MIT",
+        "identifier": "Apache-2.0",
     },
 )
```
</details>

##### [129/129] `fastapi_14487` — 📝 Update docs about re-raising validation errors, do not include string as is to not leak information

- **Repository & Baseline**: `fastapi/fastapi` @ `4a98a6677898` (`2025-12-10`) | **Prompt Length**: `204` chars | **Complexity**: `T2-Surgical (6-25L)` (`+5 / -2` across `1` file(s))
- **Production Files Modified**: `docs_src/handling_errors/tutorial004.py`
- **Hidden Grading Test Files**: `tests/test_tutorial/test_handling_errors/test_tutorial004.py` (`+2 / -12` test lines)
- **Active Traps**: `TRAP-1`, `TRAP-2`, `TRAP-4`, `TRAP-5` | **Assigned BCF Card**: `DC-15 (Executable Tutorial Security Hygiene)`
- **Level 1 — Observable Symptom**: Custom error-handling tutorial `docs_src/handling_errors/tutorial004.py` returns `PlainTextResponse(str(exc), status_code=400)` on `RequestValidationError`, echoing Pydantic's raw string representation (including internal URLs/inputs) to clients.
- **Level 2 — Code-Level Defect**: In `docs_src/handling_errors/tutorial004.py`, `validation_exception_handler` called `str(exc)` instead of formatting structured `exc.errors()` (`loc` and `msg`).
- **Level 3 — Architectural Root Cause**: Pydantic v2's `str(ValidationError)` includes `For further information visit https://errors.pydantic.dev/...` and raw `input` payloads; tutorial code needed explicit `Field: {error['loc']}, Error: {error['msg']}` formatting.
- **Actionable Fix & BCF Brain Insight**: Formatting `exc.errors()` into `Validation errors:\nField: ..., Error: ...` fixes the tutorial (Trap-1: visible `test_tutorial004.py` asserted old `str(exc)` text until `test_patch` updates it!).

<details><summary>Verified Production Diff Excerpt (<code>tasks.jsonl</code> Ground Truth)</summary>

```diff
--- a/docs_src/handling_errors/tutorial004.py
+++ b/docs_src/handling_errors/tutorial004.py
@@ -12,8 +12,11 @@ async def http_exception_handler(request, exc):
 
 
 @app.exception_handler(RequestValidationError)
-async def validation_exception_handler(request, exc):
-    return PlainTextResponse(str(exc), status_code=400)
+async def validation_exception_handler(request, exc: RequestValidationError):
+    message = "Validation errors:"
+    for error in exc.errors():
+        message += f"\nField: {error['loc']}, Error: {error['msg']}"
+    return PlainTextResponse(message, status_code=400)
 
 
 @app.get("/items/{item_id}")
```
</details>

---

## 6. Cross-Corpus Root-Cause Synthesis & Actionable Insights for the BCF Brain

Synthesizing all 129 three-level RCAs reveals **10 structural laws** that explain why baseline Gemma 4 agents plateau at `0.20–0.24` on the Kaggle leaderboard—and how the **Batonic Coding Framework (`BCF`)** systematically captures those lost points:

| # | Engineering Law Derived from the 129 RCAs | How BCF Operationalizes It in Code & Prompts |
| ---: | :--- | :--- |
| 1 | **Law 1 — Localization Is Necessary But Not Sufficient (`70.5%` Single-File, Yet `60–86%` Correct-File Failure Rate)** | Over 70% of public tasks touch a single file, and forum trace audits (`#760014`, `#760595`) confirm that even E4B reaches the right file in 60–86% of failed runs. Agents fail during *editing* and *verification*, not search. Therefore, `bcf.py` must assist not just planning (`classify` + `spec`), but also atomic syntax-checked editing (`patch`) and trap-aware verification (`verify`). |
| 2 | **Law 2 — Wrapper Peeling Must Be Recursive & Dual-Syntax (`CAT-1`, 23 Tasks)** | Across modern Python typing (`Annotated`, `Union` vs `UnionType` `\|`, PEP 695 `TypeAliasType`, `ForwardRef('None') -> type(None)`, `@functools.wraps`, callable objects), bugs cluster wherever code inspects only one outer layer (`get_origin(tp) is Union` or `getattr(call, '__globals__')`). `DC-01` trains the BCF Brain to always check recursive `Annotated` + `Union \| UnionType` + `inspect.unwrap` invariants together. |
| 3 | **Law 3 — Input Validation vs. Output Serialization Asymmetry (`CAT-2`, 21 Tasks)** | In schema-driven libraries (Pydantic v2, OpenAPI, dataclasses), defects arise when code conflates *wire input names* (`validation_alias`) with *wire output names* (`serialization_alias`), or bypasses custom serializers (`by_alias`, `exclude_unset`) on fast-path `TypeAdapter` routes (`DC-02`, `DC-14`). |
| 4 | **Law 4 — Mutable Aliasing & Teardown Lifetime Ordering (`CAT-3`, 19 Tasks)** | State corruption and resource leaks happen when shallow `.copy()`/`.extend()` mutates shared lists across branches (`fastapi_14463`, `fastapi_5624`, `rich_3480`), when `super().__init__()` overwrites subclass attributes (`fastapi_14873`), or when `AsyncExitStack` unwinds before streaming finishes (`fastapi_14099`, `fastapi_14262`) (`DC-09`, `DC-10`). |
| 5 | **Law 5 — String Length vs. Wire Byte Length & RFC Boundary Strictness (`CAT-4`, 22 Tasks)** | Protocol bugs overwhelmingly stem from measuring Unicode `len(str)` instead of `len(str.encode('utf-8'))` (`requests_6589`, `requests_6757`), suffix-matching domains without a leading `.` label boundary (`requests_7427`), or returning `403` instead of `401 + WWW-Authenticate` (`fastapi_13786`) (`DC-04`, `DC-15`). |
| 6 | **Law 6 — Multi-Codepoint Grapheme & Cell-Width Accounting (`CAT-5` & `CAT-6`, 40 Tasks)** | Terminal and text-processing bugs occur when code equates `1 character == 1 terminal column`, fails to advance scanner indices on leading ZWJ/VS-16 (`rich_4006`), or forgets to synchronize `_get_padding_width` with `get_padding` (`rich_3935`) (`DC-05`, `DC-06`, `DC-07`). |
| 7 | **Law 7 — Never Blindly Trust Visible Tests When Fixing Spec/RFC Bugs (`TRAP-1`, `35.7%` of Tasks)** | In 46 of 129 tasks, `test_patch` modifies or deletes existing test lines, and in strict spec-reversal tasks (`requests_7315`, `requests_7309`, `fastapi_13786`, `httpx_3672`), the visible test suite *explicitly asserts the buggy legacy behavior*. `bcf.py classify` + `bcf.py verify` detect pre-existing and expected-red test failures so the solver never panics and reverts a correct fix. |
| 8 | **Law 8 — Enforce Multi-File & Sibling Closure Before `submit_patch()` (`TRAP-2`, `29.5%` of Tasks)** | In layered frameworks (`FastAPI -> APIRouter -> APIRoute`, `ahttpx -> httpx`, library code -> `docs_src/`), fixing only the leaf function leaves wrapper signatures out of sync. `bcf.py spec` computes symbol closure and generator redirects (`TRAP-3`) upfront and pins them into `{bcf_spec}` so context compaction never erases sibling obligations. |
| 9 | **Law 9 — Bypass AST Graph Blindness with Native Python `ast` Indexing (`TRAP-4`, `16.3%` of Tasks)** | Because pre-computed `graphs/*.json` omits every `async def` function (`0` async nodes across all repos), `bcf.py` builds a fast `<1.2s` stdlib `ast` symbol table indexing `ClassDef`, `FunctionDef`, `AsyncFunctionDef`, and module constants alike. |
| 10 | **Law 10 — Mandatory Inline Repro + Syntax/Import Gate Beats Existing-Suite Overconfidence (`TRAP-6` & `#760595`)** | Because 65.7% of failed trajectories pass pre-existing tests without actually exercising the new edge case—and 14.5% of failed trajectories submit broken syntax/imports—BCF mandates: (a) automatic `ast.parse` + `py_compile` rollback on every `bcf.py patch` call, and (b) a targeted inline reproduction check verifying the exact reported symptom flips from FAIL to PASS. |

---

*End of Task 1 Deliverable — All 129/129 Public Dataset Tasks Classified, Cross-Tabulated, and Root-Cause Analyzed.*
