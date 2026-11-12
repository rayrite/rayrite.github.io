# BCF Task 1 — Gemma 4 Developer Agent Competition: Dataset Classification & Root-Cause Analysis

**Date:** 2026-11-11 · **Analyst pipeline:** 15 domain-batch analysts + taxonomy synthesizer + 3 adversarial verifiers + completeness critic (20 agents) · **Ground truth:** local `input/kagglecomp` only (independent re-derivation; no prior research reused)

## Executive summary

The public problem set contains **129 software-engineering tasks** mined from four Python repositories — **fastapi/fastapi (67), Textualize/rich (48), psf/requests (13), encode/httpx (1)** — spanning 2023-07-29 to 2026-06-20. Every task ships a PR-title/body problem statement, a reference fix (`patch`), and verification tests (`test_patch`); **`hints_text` is empty on all 129**, so the only signals available to a solving agent are the statement and the repository snapshot at `base_commit`. The hidden evaluation set (~120 tasks, evenly split public/private leaderboard) comes from **private repositories** — generalization, not memorization, is what scores.

**Classification.** Tasks fall into **9 kinds** — bugfix (86), feature (20), refactor (4), dx (4), security (3), performance (3), dependency-compat (3), deprecation (3), docs (3) — across **40 repo-scoped subcategories** and **10 cross-repo root-cause families**. **91 tasks are genuine bugs** (5 hide inside non-bugfix kinds); each received a source-grounded root-cause analysis with faulty locus, mechanism, trigger, evidence, and fix strategy. The remaining 38 are implement-to-spec tasks (capability gaps).

**Shape of the work.** **75% of tasks (97/129) are one-line or few-line edits**; only 7 are large and 2 create new files. Median reference patch: 12 changed lines. Difficulty concentrates at d1–d2 (86/129). The bottleneck for a local-model agent is therefore **precise localization plus the correct mechanism**, not code volume.

**Dominant root-cause mechanisms.** missing-capability (33), boundary-edge-case (24), api-contract-violation (23), type-introspection (15), state-lifecycle (14). Each repo has a distinct personality: fastapi is capability + introspection heavy (framework plumbing, Pydantic/annotation semantics); rich is edge-case + contract heavy (rendering correctness); requests is protocol + duck-typing heavy; httpx's single task is a connection state-machine defect.

**Five findings that most shape the BCF brain (Task 2):**

1. **Localization is cue-rich on the public set but the cues will vanish.** All 129 statements carry 2–5 localization cues (avg 3.4); 98/129 name a file, symbol, or grep string. Private-repo tasks will not ship such cues — the brain needs mechanism-based fallback localization (symptom → subsystem → function), not cue dependence.
2. **Tasks are temporally coupled — a correct fix can be a later bug.** requests_6644 collapses leading `//` in paths; requests_7315 later *deletes that exact collapse* because it broke S3 presigned URLs. fastapi_14448's wrapped-callable rewrite drops a guard that fastapi_14458 must restore. The `test_patch` is the live spec; base behavior is never sacred.
3. **Some tasks have no prose spec at all.** rich_3942 pins byte-exact ANSI snapshots; fastapi_15661 is an unfilled PR template with exact CLI strings; fastapi_14479 pins an exact assertion message. These are tests-as-spec tasks — and memorizing public expected strings cannot transfer to private repos.
4. **32k-context threats are concentrated and identifiable.** The 7 d5 tasks and 7 large patches (rich_3930's +12.1k lines are mostly *generated* width tables across 23 new files; fastapi_14609 removes 1,855 lines; fastapi_15745 adds 939) cannot be read wholesale. The tractable core is algorithm + loader, with generated tables treated as data assets.
5. **Two cross-repo hard skills cover 29 tasks.** Type-introspection (15: Annotated/union/callable unwrapping, PEP 695, `__getattr__` proxies, `__qualname__` descriptors) and state-lifecycle (14: shared mutable state, cache invalidation, teardown ordering) recur across all four repos — shared playbooks beat repo-specific hacks.

## Methodology

1. **Ground-truth ingestion.** `tasks.jsonl` (129 records) parsed and split per task; patch/test-patch statistics computed (file lists, ±lines, new test functions). Official docs (`docs/markdown/`), `HARNESS_README.md`, and the sample submission read as the harness contract.
2. **Source extraction.** The 21.9 GB dataset zip's 129 snapshot archives were selectively streamed: for every task, the exact files touched by `patch`/`test_patch` were extracted at `base_commit`, plus packaging metadata and the full repo file list. Files listed as wanted-but-absent are *created by the reference patch* (verified, not missing data).
3. **Per-task analysis.** 15 domain-batch analysts (7 fastapi, 6 rich, 2 requests/httpx) read each task's statement, reference patch, test patch, **and the actual buggy source**, then produced a structured RCA (JSON) and a report section (MD): classification, faulty locus with line numbers, mechanism, trigger, quoted evidence, fix strategy, acceptance tests, agent-solvability notes.
4. **Taxonomy normalization.** 52 raw subcategory labels normalized to 40 (19 merge/rename mappings); 12 root-cause families folded to 10; `is_bug` tracked separately from kind. Integrity checks: compact table vs 129 detail JSONs = 0 field diffs; category assignments partition all 129 exactly; all distribution totals sum to 129.
5. **Adversarial verification.** Three cluster verifiers re-opened every cited source locus and tried to refute each RCA (mechanism, locus, classification, fix strategy, acceptance tests). Result: **0 critical issues, 7 minor citation/wording issues — all corrected in place** (fastapi_14262 symbol name; fastapi_14077 line numbers; rich_3930 file counts; rich_4075 symptom description; rich_3535 fast-path soundness caveat; rich_3676 notes-capture location; requests_7502 evidence line numbers). A completeness critic confirmed all 129 tasks have both files, follow the template, and carry non-empty mechanisms; taxonomy coverage is exact.
6. **Discussion-board context.** Scoring-environment caveats below are drawn from the local board captures (`intel_20261105`, `intel_20261111` — the latter captured fresh today, 38 threads since Nov 5), with thread ids cited. Competitor-reported items are labeled as such.

## How to read this document

- **Part I — Taxonomy & distributions:** kind/subcategory/root-cause-family definitions, all distribution tables and cross-tabs, 10 cross-cutting insights, normalization changelog, and the definitive 129-row assignment table.
- **Part II — Per-task analysis:** every task, grouped by kind → subcategory. Each entry: field table (repo, kind, subcategory, root-cause family, patch size, agent difficulty), Problem, Root cause (mechanism + locus + evidence for bugs; capability gap for non-bugs), Reference fix, Acceptance tests, Agent notes.
- **Appendix B:** full index with patch/test statistics.

## Scoring-environment caveats (affect interpretation of "solvability")

These do not change the classifications or root causes, but they bound what any agent can score on the public set in the local sandbox:

| Caveat | Tasks affected | Evidence |
|---|---|---|
| Can NEVER be marked resolved by the scorer (skipped-sibling JUnit matcher bug: a required test passes but its platform-skipped sibling fails validation) | rich_3486, fastapi_14186 | threads 755554, 757893 (competitor audits with public artifacts; no staff fix) |
| Local pytest collection fails regardless of patch (tests import inline_snapshot / dirty_equals, absent from the wheelhouse) | 27 fastapi tasks listed in thread 756587 (+4 local candidates: fastapi_14266, 14609, 15030, 15745) | 756587, 757661; local verification confirmed 17/27 direct imports in test_patch |
| requests tasks hit network-unreachable / httpbin fixture failures under air-gapped scoring | ~12 requests tasks (incl. 6589, 6592) | 754586, 757661 |
| Pass with an EMPTY patch locally (wheel-shadowing / fixture artifacts) — free-point noise for A/B tests | 5 tasks (2 fastapi + 3 requests; incl. requests_7309/7315/7427, rich_3468 per 751487 follow-ups) | 756400 gold/empty audit; 00-synthesis constraint 18 |
| Hidden set is staff-confirmed 100% gold-valid (Sep 29 anchor) — the public dependency gaps likely do NOT apply to scoring | hidden ~120 tasks | 744370 (STAFF); not re-confirmed since |

**Implication:** local resolve rates on the raw 129 are upper bounds with environment noise; the strictly-valid local discriminator set is ~68 tasks (756400). BCF evaluation masks the known-bad tasks and never tunes on public expected strings.

---

# BCF Task 1 - Problem Taxonomy, Distributions, and Root-Cause Insights

**Dataset:** Kaggle Google Gemma 4 Developer Agent Competition - public problem set (local `input/kagglecomp`).
**Scope:** 129 tasks across 4 repositories (fastapi 67, rich 48, requests 13, httpx 1).
**Sources:** 15 per-task analyst RCA files (`scratch/bcf-2026-11-11/rca/<iid>.json/.md`) cross-checked against `index.json` patch/test stats. The compact classification table and the detail JSONs agreed on all 129 rows (0 field diffs); this document normalizes them into a single scheme.
**Date:** 2026-11-11.

## 1. Method and normalization summary

Each task is assigned exactly one **(task_kind, subcategory)** pair plus one **root_cause_family**, a **difficulty** (d1-d5), and an **edit_shape**. `task_kind` is the intent label (bugfix/feature/...); `subcategory` is the functional subsystem (repo-scoped); `root_cause_family` is the cross-repo failure mechanism. `is_bug` is tracked separately because kind and bug-ness diverge (see Insight 3).

Normalization applied to the analysts' raw labels:
- **Subcategories:** 52 raw labels normalized down to **40** (19 merge/rename mappings; net -12). Near-duplicate functional areas were merged (e.g. union-discriminator -> type-annotation-handling; grapheme-segmentation + cell-width -> cell-width-graphemes); confusing name collisions resolved (dependency-scopes + dependency-injection -> dependency-injection); analyst-proposed singletons grouped into their subsystem (console output path; requests body prep). Full changelog in Section 8.
- **Root-cause families:** 12 raw labels folded to **10**. `regex-escaping` and `unicode-width` folded into `boundary-edge-case`; the 3 `other` labels resolved per-task (fastapi_14953 -> api-contract-violation, fastapi_14492 -> docs-content-error, rich_3105 -> api-contract-violation).
- **Kinds:** the 9 kebab-case kind labels were already consistent and are kept unchanged.
- **Domain field:** analyst `domain` values were free-text (e.g. "requests / netrc authentication"); normalized to the repo short name derived from `instance_id`/`index.json`.

## 2. Task-kind definitions (level 1)

| kind | tasks | share | definition |
| --- | --- | --- | --- |
| bugfix | 86 | 66.7% | Corrects a runtime defect, crash, hang, or spec deviation in existing behavior (is_bug=True). |
| feature | 20 | 15.5% | Adds a new user-facing capability or public API that did not previously exist. |
| refactor | 4 | 3.1% | Restructures existing code or output for spec-conformance/maintainability without adding a new capability; behavior-preserving or standards-aligning. |
| security | 3 | 2.3% | Hardens against a vulnerability or unsafe input handling (CSRF, frame/header injection, cross-request state leak). |
| performance | 3 | 2.3% | Improves speed or resource use without changing correct output. |
| dependency-compat | 3 | 2.3% | Adapts to an upstream dependency version/API change (Starlette, Pydantic, urllib3) to keep the supported range working. |
| deprecation | 3 | 2.3% | Marks existing functionality deprecated or removes a legacy compatibility layer. |
| dx | 4 | 3.1% | Improves developer experience: error-message quality, warning visibility, or release/tooling automation. |
| docs | 3 | 2.3% | Changes documentation or tutorial example content only; no library behavior change. |

## 3. Root-cause family definitions (cross-repo mechanism)

| root_cause_family | tasks | share | definition |
| --- | --- | --- | --- |
| missing-capability | 33 | 25.6% | A required capability/API/keyword did not exist; the task implements it (features, dx, docs, most deprecations). |
| boundary-edge-case | 24 | 18.6% | An unhandled edge input or platform boundary (empty/None/trailing values, out-of-range codepoints, regex char-class gaps, escape parity, closed pipes). |
| api-contract-violation | 23 | 17.8% | Behavior/output diverges from a documented or specified contract (RFC, OpenAPI/JSON-Schema spec, API docs, sentinel/identity contract, platform font contract). |
| type-introspection | 15 | 11.6% | Python introspection returns an unexpected wrapper/proxy/descriptor/metadata and a naive isinstance/getattr/unwrap misses it. |
| state-lifecycle | 14 | 10.9% | Shared mutable state aliased/mutated, a cache not invalidated, or teardown ordered wrong relative to async consumption. |
| schema-generation-logic | 7 | 5.4% | Incorrect OpenAPI/Pydantic schema-construction logic (ref resolution, mode selection, security-array merging, config propagation). |
| compatibility-shim | 6 | 4.7% | An upstream dependency version/API change requires a shim, vendoring, or gated behavior. |
| ordering-off-by-one | 3 | 2.3% | Index/offset/order arithmetic error (len-1 bias, reverse-vs-forward chunk order, head/mid/foot mis-index). |
| infinite-loop-recursion | 3 | 2.3% | A loop/recursion fails to advance or lacks cycle detection, causing a hang. |
| docs-content-error | 1 | 0.8% | Incorrect constant/content in a documentation example (no library logic involved). |

## 4. Subcategory catalog (level 2) with distribution

Subcategories are repo-scoped functional areas. Sorted by task count descending.

| subcategory | repo | tasks | share | definition |
| --- | --- | --- | --- | --- |
| request-parsing | fastapi | 12 | 9.3% | Extraction and validation of request parameters/body: multidict query/header/form handling, field alias semantics, type guards, and Content-Type policy. |
| openapi-schema-generation | fastapi | 10 | 7.8% | OpenAPI/JSON-Schema construction, model naming/ref resolution, schema caching, and docs-UI serving/escaping (fastapi/openapi, _compat schema generators). |
| dependency-injection | fastapi | 7 | 5.4% | Depends/Security declaration mechanics, resolution, scope-aware caching, and yield-dependency lifecycle (dual exit stacks, function/request scopes). |
| routing | fastapi | 6 | 4.7% | APIRouter/app route composition: include_router identity, lifespan/startup wiring, route-context iteration, static/frontend dispatch, and decorator surface. |
| body-stream-handling | requests | 5 | 3.9% | Request body/stream preparation: duck-typing/protocol detection of file-like and iterable bodies, and super_len/Content-Length measurement incl. urllib3 1.x/2.x encoding. |
| cell-width-graphemes | rich | 5 | 3.9% | Character cell measurement and grapheme segmentation: width tables/fast-path regex, control/PUA codepoints, ZWJ/VS16 grapheme clusters, and the grapheme splitter. |
| markdown-rendering | rich | 5 | 3.9% | Markdown element rendering: table cell accumulation/styling, empty-cell/partial-table guards, and the heading/rule/table design snapshot. |
| type-annotation-handling | fastapi | 5 | 3.9% | Interpretation of type annotations: Annotated/union/discriminator unwrapping, stringified-annotation evaluation, PEP 695 TypeAliasType, and field complexity classification. |
| wrapped-callables | fastapi | 5 | 3.9% | Callable-kind introspection for dependables: inspect.unwrap/partial/__wrapped__ peeling, async-vs-sync/generator detection, class-vs-instance, and annotation globals. |
| console-output | rich | 4 | 3.1% | Console output path: print newline/end/style semantics, capture/recording buffer-index lifecycle, and broken-pipe write/flush error handling. |
| dependency-compat | fastapi | 4 | 3.1% | Compatibility with upstream dependency versions/APIs (Pydantic v1/v2, Starlette) and the fastapi/_compat shim layer, including model-config propagation. |
| security-schemes-openapi | fastapi | 4 | 3.1% | Security-scheme registration, scope-aware dependant caching, and HTTP auth challenge semantics (401/403, WWW-Authenticate) in OpenAPI. |
| table-panel-rendering | rich | 4 | 3.1% | Box-based renderables (Table, Panel): padding/edge rules, border-glyph ordering, column defaults, and base-style composition behind titles. |
| text-splitting | rich | 4 | 3.1% | Line/cell splitting and tab expansion: divide_line/chop_cells/_split_cells offset arithmetic and expand_tabs span bookkeeping. |
| console-tty-detection | rich | 3 | 2.3% | Terminal/interactivity detection and environment overrides (TTY_COMPATIBLE, TTY_INTERACTIVE, FORCE_COLOR, NO_COLOR) and FileProxy isatty delegation. |
| deprecation-warnings | fastapi | 3 | 2.3% | Deprecation warning machinery: FastAPIDeprecationWarning visibility and registration-time warnings for legacy usage. |
| docs-src-tutorial | fastapi | 3 | 2.3% | docs_src tutorial example code/content correctness (handlers, metadata, streaming examples). |
| error-messages | fastapi | 3 | 2.3% | Quality and content of raised exception/validation messages (fail-fast guards, endpoint context, exact message strings). |
| pretty-repr-rendering | rich | 3 | 2.3% | Introspection-driven object rendering (rich.inspect/pretty/repr): signature __qualname__ guards, sentinel identity checks, dataclass field traversal. |
| traceback-rendering | rich | 3 | 2.3% | Traceback extraction and rendering: PEP 657 instruction positions, PEP 678 __notes__, and exception-chain cycle detection. |
| ansi-decoding | rich | 2 | 1.6% | ANSI escape decoding: tokenizer coverage (private Fp sequences) and newline/terminator preservation in Text.from_ansi. |
| export-html-svg | rich | 2 | 1.6% | Console HTML/SVG export: document structure validity and font-family inheritance vs user-agent stylesheet. |
| live-progress | rich | 2 | 1.6% | Live/Progress lifecycle: render-height-gated teardown newlines and disable-guard symmetry between start/stop. |
| prompt-input | rich | 2 | 1.6% | Interactive Prompt.ask behavior: choice validation/case-insensitive matching and markup-safe error rendering. |
| proxy-auth-config | requests | 2 | 1.6% | Environment/host-derived connection configuration: no_proxy bypass matching and netrc credential selection. |
| regex-highlighting | rich | 2 | 1.6% | ReprHighlighter regex pattern correctness (URL character-class coverage for @ and ~). |
| response-serialization | fastapi | 2 | 1.6% | Response model inference and body serialization (return-annotation normalization, dump_json fast path, status-code body rules). |
| streaming-sse | fastapi | 2 | 1.6% | Streaming transports: Server-Sent Events framing/encoding/keep-alive and JSONL/raw streaming response integration. |
| syntax-highlighting | rich | 2 | 1.6% | Syntax/code rendering: width/padding accounting and background-style composition for the Padding wrapper. |
| text-span-management | rich | 2 | 1.6% | Text span list bookkeeping: append/extend aliasing and control-code sanitization keeping span offsets in sync with text length. |
| url-path-handling | requests | 2 | 1.6% | Request-target path normalization at the urllib3 boundary (leading-slash handling and its S3-presigned-URL regression). |
| connection-lifecycle | httpx | 1 | 0.8% | HTTP/1.1 server connection state machine: keep-alive, body draining, stream lifecycle, and parser reset. |
| header-parsing | requests | 1 | 0.8% | Response header parsing (Content-Type parameter/charset extraction and fallback). |
| import-performance | rich | 1 | 0.8% | Import-time cost: deferring eager module-level imports to cold paths and TYPE_CHECKING. |
| json-decoding | requests | 1 | 0.8% | Response JSON decoding infrastructure (JSONDecodeError pickling/__reduce__ for multiprocessing). |
| markup-escaping | rich | 1 | 0.8% | Console markup escape()/parse backslash-parity correctness. |
| redirect-history | requests | 1 | 0.8% | Redirect chain history bookkeeping (self-referential history / reference cycles). |
| release-infra | fastapi | 1 | 0.8% | Repository release/tooling automation (version bump, release-notes CLI) outside the library runtime. |
| status-codes | requests | 1 | 0.8% | HTTP status-code name registry (RFC alias registration). |
| style-caching | rich | 1 | 0.8% | Style hash/equality cache invalidation when meta/links are cleared. |

## 5. Distributions

### 5.1 Per repository

| repo | tasks | share |
| --- | --- | --- |
| fastapi | 67 | 51.9% |
| rich | 48 | 37.2% |
| requests | 13 | 10.1% |
| httpx | 1 | 0.8% |

### 5.2 Difficulty histogram

| difficulty | tasks | share |
| --- | --- | --- |
| d1 | 27 | 20.9% |
| d2 | 59 | 45.7% |
| d3 | 27 | 20.9% |
| d4 | 9 | 7.0% |
| d5 | 7 | 5.4% |

### 5.3 Edit-shape histogram

| edit_shape | tasks | share |
| --- | --- | --- |
| one-line | 27 | 20.9% |
| few-lines | 70 | 54.3% |
| multi-file | 23 | 17.8% |
| large | 7 | 5.4% |
| new-files | 2 | 1.6% |

### 5.4 Kind x is_bug

| kind | is_bug=True | is_bug=False | total |
| --- | --- | --- | --- |
| bugfix | 86 | 0 | 86 |
| feature | 1 | 19 | 20 |
| refactor | 1 | 3 | 4 |
| security | 1 | 2 | 3 |
| performance | 1 | 2 | 3 |
| dependency-compat | 1 | 2 | 3 |
| deprecation | 0 | 3 | 3 |
| dx | 0 | 4 | 4 |
| docs | 0 | 3 | 3 |
| TOTAL | 91 | 38 | 129 |

### 5.5 Difficulty x edit_shape

| difficulty | one-line | few-lines | multi-file | large | new-files | total |
| --- | --- | --- | --- | --- | --- | --- |
| d1 | 17 | 10 | 0 | 0 | 0 | 27 |
| d2 | 9 | 45 | 5 | 0 | 0 | 59 |
| d3 | 1 | 14 | 10 | 1 | 1 | 27 |
| d4 | 0 | 1 | 8 | 0 | 0 | 9 |
| d5 | 0 | 0 | 0 | 6 | 1 | 7 |

## 6. Cross-tabs

### 6.1 Repository x kind

| repo | bugfix | feature | refactor | security | performance | dependency-compat | deprecation | dx | docs | total |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| fastapi | 35 | 12 | 4 | 3 | 1 | 2 | 3 | 4 | 3 | 67 |
| rich | 39 | 7 | 0 | 0 | 2 | 0 | 0 | 0 | 0 | 48 |
| requests | 11 | 1 | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 13 |
| httpx | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 |
| TOTAL | 86 | 20 | 4 | 3 | 3 | 3 | 3 | 4 | 3 | 129 |

### 6.2 Root-cause family x repository

| family | fastapi | rich | requests | httpx | total |
| --- | --- | --- | --- | --- | --- |
| missing-capability | 23 | 9 | 1 | 0 | 33 |
| boundary-edge-case | 5 | 15 | 4 | 0 | 24 |
| api-contract-violation | 8 | 12 | 3 | 0 | 23 |
| type-introspection | 11 | 1 | 3 | 0 | 15 |
| state-lifecycle | 7 | 5 | 1 | 1 | 14 |
| schema-generation-logic | 7 | 0 | 0 | 0 | 7 |
| compatibility-shim | 5 | 0 | 1 | 0 | 6 |
| ordering-off-by-one | 0 | 3 | 0 | 0 | 3 |
| infinite-loop-recursion | 0 | 3 | 0 | 0 | 3 |
| docs-content-error | 1 | 0 | 0 | 0 | 1 |
| TOTAL | 67 | 48 | 13 | 1 | 129 |

### 6.3 Kind -> subcategory breakdown

| kind | tasks | subcategories (count) |
| --- | --- | --- |
| bugfix | 86 | request-parsing (10), openapi-schema-generation (6), body-stream-handling (4), console-output (4), dependency-injection (4), markdown-rendering (4), security-schemes-openapi (4), table-panel-rendering (4), text-splitting (4), type-annotation-handling (4), cell-width-graphemes (3), pretty-repr-rendering (3), wrapped-callables (3), ansi-decoding (2), dependency-compat (2), export-html-svg (2), live-progress (2), proxy-auth-config (2), regex-highlighting (2), routing (2), syntax-highlighting (2), text-span-management (2), url-path-handling (2), connection-lifecycle (1), console-tty-detection (1), header-parsing (1), json-decoding (1), markup-escaping (1), prompt-input (1), redirect-history (1), style-caching (1), traceback-rendering (1) |
| feature | 20 | console-tty-detection (2), dependency-injection (2), openapi-schema-generation (2), routing (2), traceback-rendering (2), wrapped-callables (2), cell-width-graphemes (1), error-messages (1), markdown-rendering (1), prompt-input (1), response-serialization (1), status-codes (1), streaming-sse (1), type-annotation-handling (1) |
| refactor | 4 | dependency-injection (1), openapi-schema-generation (1), request-parsing (1), routing (1) |
| security | 3 | openapi-schema-generation (1), request-parsing (1), streaming-sse (1) |
| performance | 3 | cell-width-graphemes (1), import-performance (1), response-serialization (1) |
| dependency-compat | 3 | body-stream-handling (1), dependency-compat (1), routing (1) |
| deprecation | 3 | deprecation-warnings (2), dependency-compat (1) |
| dx | 4 | error-messages (2), deprecation-warnings (1), release-infra (1) |
| docs | 3 | docs-src-tutorial (3) |

### 6.4 Repository -> subcategory breakdown

| repo | tasks | subcategories (count) |
| --- | --- | --- |
| fastapi | 67 | request-parsing (12), openapi-schema-generation (10), dependency-injection (7), routing (6), type-annotation-handling (5), wrapped-callables (5), dependency-compat (4), security-schemes-openapi (4), deprecation-warnings (3), docs-src-tutorial (3), error-messages (3), response-serialization (2), streaming-sse (2), release-infra (1) |
| rich | 48 | cell-width-graphemes (5), markdown-rendering (5), console-output (4), table-panel-rendering (4), text-splitting (4), console-tty-detection (3), pretty-repr-rendering (3), traceback-rendering (3), ansi-decoding (2), export-html-svg (2), live-progress (2), prompt-input (2), regex-highlighting (2), syntax-highlighting (2), text-span-management (2), import-performance (1), markup-escaping (1), style-caching (1) |
| requests | 13 | body-stream-handling (5), proxy-auth-config (2), url-path-handling (2), header-parsing (1), json-decoding (1), redirect-history (1), status-codes (1) |
| httpx | 1 | connection-lifecycle (1) |

## 7. Cross-cutting insights (grounded in the RCA files)

1. **Small-edit dominance:** 97/129 tasks (75%) are one-line (27) or few-lines (70); only 7 are large and 2 new-files. For a local-model agent the bottleneck is precise localization plus the correct mechanism, not code volume. BCF should triage by edit_shape and invest in grep-anchor localization rather than bulk file reading.

2. **Repo personality / dominant root-cause families:** fastapi is capability+introspection heavy (missing-capability 23, type-introspection 11) - framework plumbing and Pydantic/annotation semantics; rich is edge-case+contract heavy (boundary-edge-case 15, api-contract-violation 12) - rendering correctness; requests is edge-case+protocol heavy (boundary-edge-case 4, type-introspection 3, api-contract-violation 3); httpx's single task is state-lifecycle. BCF needs repo-specific priors: fastapi->annotation/schema playbooks, rich->render/width playbooks, requests->protocol/encoding playbooks.

3. **kind is not is_bug:** 91 tasks are genuine bugs but only 86 carry kind=bugfix; 5 bugs hide inside security/performance/refactor/dependency-compat/feature, while 38 tasks are non-bugs (features/docs/dx/deprecation). BCF must run root-cause analysis on all 91 is_bug tasks regardless of the kind label and treat the 38 non-bugs as implement-to-spec tasks.

4. **Temporal coupling and regression chains:** tasks are not isolated. fastapi_14262 (function/request scopes) is the foundation for 14301/14419/5624; the 14448 wrapped-callable rewrite drops the isclass guard and causes 14458; 14512's metadata dedup must not reintroduce 14482. Most striking, requests_6644 collapses leading '//' and requests_7315 later DELETES that exact collapse (it broke S3 presigned URLs). A correct fix in one task is the bug in a later task - BCF must treat test_patch as the live spec, never assume base behavior is sacred.

5. **Tests-as-spec and overfitting risk:** several tasks have no prose spec - rich_3942 (byte-exact ANSI snapshots incl. a 27KB _card_render.py), fastapi_15661 (unfilled PR template; exact CLI/error strings), fastapi_14479 (exact assertion message). The hidden test set comes from PRIVATE repos, so memorizing public expected strings/snapshots will not transfer. BCF must generalize the mechanism (unwrap Annotated; 'is' for sentinels; encode-before-measure; dot-boundary host match) instead of pattern-matching public outputs. The 6644/7315 opposite-fix pair is the canonical overfitting warning.

6. **32k-context threats are concentrated:** the 7 d5 tasks and 7 large patches (rich_3930 +12.1k lines of which ~11.6k are generated width tables across 22 files; fastapi_14609 -1855 lines; fastapi_15745 +939) cannot be read wholesale. rich_3930's tables cannot be regenerated offline - treat them as data assets and implement only the loader plus the cells.py grapheme algorithm. BCF (especially the E4B track) must selectively read locus files and use acceptance tests as the contract rather than loading whole modules.

7. **Localization is cue-rich on the public set:** all 129 tasks carry 2-5 localization cues (avg 3.4) and 98/129 include a file/grep/line anchor; the statement or PR usually names the function or a grep string. BCF should exploit these anchors for fast localization but must not depend on them - private-repo tasks will not ship such cues, so the brain needs mechanism-based fallback localization (symptom -> subsystem -> function).

8. **Verification is uniformly test-driven and mostly offline:** all 129 tasks have acceptance_tests plus a verification_plan, most offline unit/CLI tests with no network. Special patterns: hang reproduction needs a subprocess timeout (rich_4006/3480/3772 infinite loops); snapshot tasks need render-diff iteration (rich_3942); some base tests encode the OLD behavior and are flipped by test_patch (requests_7315, rich_3470). BCF must run the new acceptance tests, never edit a test to make it pass, and use timeouts for loop bugs.

9. **Type-introspection is the cross-repo hard skill (15 tasks):** fastapi (Annotated/union/callable unwrapping, PEP 695), requests (SupportsRead/Iterable protocol checks failing on __getattr__ proxies), and rich (__qualname__ descriptor) all share one mechanism - introspection returns a wrapper/proxy/descriptor/metadata that a naive isinstance/getattr/unwrap misses. BCF should carry a shared introspection playbook (inspect.unwrap, partial peeling, hasattr fallbacks, identity checks) across all three repos.

10. **State-lifecycle bugs cluster in async/cache/teardown (14 tasks):** fastapi dependency scopes/exit-stacks (14099/14262/14419/5624), security cache (14459/14986), rich recording/hash (3470/2943), requests redirect history (7328), httpx keep-alive (3672). The recurring mechanism is shared mutable state or teardown ordered wrong - aliasing a list, caching before invalidating, or unwinding an exit stack before the response body is consumed. BCF needs a lifecycle playbook: own-vs-shared state, per-request copies, teardown-after-await.

## 8. Normalization changelog

### 8.1 Subcategory merges and renames

Each row maps an analyst raw label to its normalized subcategory. Task counts are the number of tasks moved (a rename moves all tasks in that label).

| repo | raw subcategory | normalized subcategory | tasks |
| --- | --- | --- | --- |
| fastapi | dependency-range | dependency-compat | 1 |
| fastapi | dependency-scopes | dependency-injection | 5 |
| fastapi | openapi-docs-hardening | openapi-schema-generation | 1 |
| fastapi | param-validation | request-parsing | 2 |
| fastapi | pydantic-compat | dependency-compat | 3 |
| fastapi | union-discriminator | type-annotation-handling | 2 |
| requests | auth-netrc | proxy-auth-config | 1 |
| requests | file-stream-detection | body-stream-handling | 4 |
| requests | proxy-bypass | proxy-auth-config | 1 |
| requests | urllib3-compat | body-stream-handling | 1 |
| rich | caching | style-caching | 1 |
| rich | cell-width | cell-width-graphemes | 3 |
| rich | console-broken-pipe | console-output | 1 |
| rich | console-capture-record | console-output | 1 |
| rich | console-print-semantics | console-output | 2 |
| rich | grapheme-segmentation | cell-width-graphemes | 2 |
| rich | inspect-rendering | pretty-repr-rendering | 1 |
| rich | panel-padding-background | table-panel-rendering | 1 |
| rich | table-rendering | table-panel-rendering | 3 |

Rationale highlights:
- **type-annotation-handling** absorbs `union-discriminator`: both are Annotated/annotation interpretation in `fastapi/_compat` (12942, 14512 share the metadata-unwrapping mechanism with 14485/11355/13920).
- **request-parsing** absorbs `param-validation`: 14360 lives in `request_params_to_args` (same function as 14356/13537) and 14371 is alias resolution during parameter extraction - one extraction/validation playbook.
- **dependency-injection** absorbs `dependency-scopes`: resolves the confusing name pair; one DI subsystem playbook covering Depends declaration, resolution, scope-aware caching, and yield lifecycle (7 tasks). `wrapped-callables` stays separate (callable-kind introspection is a distinct, transferable skill).
- **dependency-compat** merges `pydantic-compat` + `dependency-range`: all four tasks (14482/14609/14186/14077) are upstream-dependency compatibility in the `_compat` layer.
- **openapi-schema-generation** absorbs `openapi-docs-hardening` (14986): schema-cache mutation + docs-UI escaping are both OpenAPI-output concerns; the security kind is preserved.
- **cell-width-graphemes** merges `cell-width` + `grapheme-segmentation`: 3953 is a ZWJ (grapheme-joiner) defect and 3930 replaces per-codepoint width with a grapheme model - one measurement/segmentation playbook.
- **pretty-repr-rendering** absorbs `inspect-rendering`: rich.inspect/pretty/repr are all introspection-driven object rendering.
- **console-output** merges `console-print-semantics` + `console-capture-record` + `console-broken-pipe`: the whole Console output path (print/render/write/flush/record/pipe). `console-tty-detection` stays separate (detection/env, not output).
- **table-panel-rendering** merges `table-rendering` + `panel-padding-background`: Table and Panel are box-based renderables sharing padding/border/style machinery.
- **style-caching** renames `caching` (2943) for precision (Style hash/equality invalidation).
- **body-stream-handling** merges `file-stream-detection` + `urllib3-compat`: 6589 and 6757 are both `super_len`/Content-Length bugs (the 6589 analyst explicitly noted no content-length bucket existed); grouped with the protocol-detection trio as one request-body-prep playbook.
- **proxy-auth-config** merges `proxy-bypass` + `auth-netrc`: both are environment/host-derived connection configuration in `requests/utils.py`.

### 8.2 Root-cause family folds

| raw family | normalized family | tasks | reason |
| --- | --- | --- | --- |
| regex-escaping | boundary-edge-case | 1 | rich_3063 escape() backslash-parity is an escaping boundary defect; consistent with regex-highlighting tasks already labeled boundary-edge-case. |
| unicode-width | boundary-edge-case | 1 | rich_3944 out-of-range PUA codepoint is a width-table boundary defect. |
| other (fastapi_14953) | api-contract-violation | 1 | OpenAPI 3.1 / JSON-Schema contentMediaType conformance gap (output keyword contract). |
| other (fastapi_14492) | docs-content-error | 1 | Wrong SPDX constant in a docs example; no library logic. New clearly-named family. |
| other (rich_3105) | api-contract-violation | 1 | HTML export fails to preserve the configured font (UA-stylesheet specificity breaks the font contract). |

## 9. Appendix - full assignment table (all 129 tasks)

Definitive normalized classification. `bug` = is_bug. Sorted by repo then instance_id.

| instance_id | repo | kind | subcategory | root_cause_family | difficulty | edit_shape | bug |
| --- | --- | --- | --- | --- | --- | --- | --- |
| fastapi_11194 | fastapi | bugfix | request-parsing | type-introspection | d2 | few-lines | yes |
| fastapi_11355 | fastapi | bugfix | type-annotation-handling | type-introspection | d2 | few-lines | yes |
| fastapi_12942 | fastapi | bugfix | type-annotation-handling | type-introspection | d2 | few-lines | yes |
| fastapi_13207 | fastapi | bugfix | openapi-schema-generation | schema-generation-logic | d3 | few-lines | yes |
| fastapi_13537 | fastapi | bugfix | request-parsing | boundary-edge-case | d2 | few-lines | yes |
| fastapi_13713 | fastapi | feature | openapi-schema-generation | missing-capability | d2 | few-lines | no |
| fastapi_13786 | fastapi | bugfix | security-schemes-openapi | api-contract-violation | d3 | multi-file | yes |
| fastapi_13920 | fastapi | feature | type-annotation-handling | missing-capability | d2 | few-lines | no |
| fastapi_14077 | fastapi | dependency-compat | dependency-compat | compatibility-shim | d1 | few-lines | no |
| fastapi_14099 | fastapi | bugfix | dependency-injection | state-lifecycle | d5 | large | yes |
| fastapi_14186 | fastapi | bugfix | dependency-compat | compatibility-shim | d4 | multi-file | yes |
| fastapi_14246 | fastapi | bugfix | openapi-schema-generation | schema-generation-logic | d3 | few-lines | yes |
| fastapi_14258 | fastapi | feature | error-messages | missing-capability | d1 | one-line | no |
| fastapi_14262 | fastapi | feature | dependency-injection | missing-capability | d5 | large | no |
| fastapi_14266 | fastapi | bugfix | security-schemes-openapi | schema-generation-logic | d3 | few-lines | yes |
| fastapi_14297 | fastapi | bugfix | request-parsing | type-introspection | d2 | few-lines | yes |
| fastapi_14301 | fastapi | bugfix | dependency-injection | api-contract-violation | d1 | one-line | yes |
| fastapi_14303 | fastapi | bugfix | request-parsing | api-contract-violation | d2 | few-lines | yes |
| fastapi_14306 | fastapi | dx | error-messages | missing-capability | d3 | multi-file | no |
| fastapi_14349 | fastapi | bugfix | openapi-schema-generation | schema-generation-logic | d2 | few-lines | yes |
| fastapi_14356 | fastapi | bugfix | request-parsing | api-contract-violation | d2 | few-lines | yes |
| fastapi_14360 | fastapi | bugfix | request-parsing | api-contract-violation | d2 | few-lines | yes |
| fastapi_14361 | fastapi | bugfix | openapi-schema-generation | schema-generation-logic | d2 | one-line | yes |
| fastapi_14371 | fastapi | bugfix | request-parsing | type-introspection | d4 | multi-file | yes |
| fastapi_14372 | fastapi | refactor | dependency-injection | compatibility-shim | d2 | few-lines | no |
| fastapi_14419 | fastapi | bugfix | dependency-injection | state-lifecycle | d4 | multi-file | yes |
| fastapi_14430 | fastapi | bugfix | request-parsing | boundary-edge-case | d1 | one-line | yes |
| fastapi_14448 | fastapi | bugfix | wrapped-callables | type-introspection | d4 | multi-file | yes |
| fastapi_14455 | fastapi | bugfix | security-schemes-openapi | schema-generation-logic | d2 | few-lines | yes |
| fastapi_14458 | fastapi | bugfix | wrapped-callables | type-introspection | d2 | few-lines | yes |
| fastapi_14459 | fastapi | bugfix | security-schemes-openapi | state-lifecycle | d4 | multi-file | yes |
| fastapi_14463 | fastapi | bugfix | openapi-schema-generation | state-lifecycle | d1 | few-lines | yes |
| fastapi_14479 | fastapi | dx | error-messages | missing-capability | d1 | one-line | no |
| fastapi_14482 | fastapi | bugfix | dependency-compat | schema-generation-logic | d3 | few-lines | yes |
| fastapi_14485 | fastapi | bugfix | type-annotation-handling | boundary-edge-case | d2 | few-lines | yes |
| fastapi_14487 | fastapi | docs | docs-src-tutorial | missing-capability | d1 | few-lines | no |
| fastapi_14492 | fastapi | docs | docs-src-tutorial | docs-content-error | d1 | one-line | no |
| fastapi_14512 | fastapi | bugfix | type-annotation-handling | type-introspection | d3 | few-lines | yes |
| fastapi_14583 | fastapi | deprecation | deprecation-warnings | missing-capability | d2 | few-lines | no |
| fastapi_14605 | fastapi | dx | deprecation-warnings | missing-capability | d2 | multi-file | no |
| fastapi_14609 | fastapi | deprecation | dependency-compat | compatibility-shim | d5 | large | no |
| fastapi_14616 | fastapi | bugfix | request-parsing | type-introspection | d2 | few-lines | yes |
| fastapi_14786 | fastapi | bugfix | request-parsing | boundary-edge-case | d1 | one-line | yes |
| fastapi_14791 | fastapi | bugfix | openapi-schema-generation | api-contract-violation | d1 | few-lines | yes |
| fastapi_14794 | fastapi | feature | dependency-injection | missing-capability | d2 | few-lines | no |
| fastapi_14851 | fastapi | dependency-compat | routing | compatibility-shim | d3 | large | no |
| fastapi_14873 | fastapi | bugfix | routing | state-lifecycle | d2 | few-lines | yes |
| fastapi_14953 | fastapi | refactor | openapi-schema-generation | api-contract-violation | d3 | multi-file | no |
| fastapi_14962 | fastapi | performance | response-serialization | missing-capability | d3 | multi-file | no |
| fastapi_14964 | fastapi | deprecation | deprecation-warnings | missing-capability | d2 | few-lines | no |
| fastapi_14978 | fastapi | security | request-parsing | missing-capability | d4 | multi-file | no |
| fastapi_14986 | fastapi | security | openapi-schema-generation | state-lifecycle | d3 | multi-file | yes |
| fastapi_15023 | fastapi | docs | docs-src-tutorial | missing-capability | d2 | few-lines | no |
| fastapi_15030 | fastapi | feature | streaming-sse | missing-capability | d5 | new-files | no |
| fastapi_15280 | fastapi | feature | routing | missing-capability | d1 | few-lines | no |
| fastapi_15588 | fastapi | security | streaming-sse | missing-capability | d2 | few-lines | no |
| fastapi_15589 | fastapi | refactor | request-parsing | api-contract-violation | d2 | one-line | yes |
| fastapi_15661 | fastapi | dx | release-infra | missing-capability | d3 | new-files | no |
| fastapi_15745 | fastapi | refactor | routing | missing-capability | d5 | large | no |
| fastapi_15763 | fastapi | bugfix | routing | boundary-edge-case | d3 | few-lines | yes |
| fastapi_15785 | fastapi | feature | openapi-schema-generation | missing-capability | d3 | multi-file | no |
| fastapi_15800 | fastapi | feature | routing | missing-capability | d5 | large | no |
| fastapi_5077 | fastapi | bugfix | wrapped-callables | type-introspection | d2 | few-lines | yes |
| fastapi_5624 | fastapi | bugfix | dependency-injection | state-lifecycle | d2 | one-line | yes |
| fastapi_9425 | fastapi | feature | response-serialization | type-introspection | d2 | few-lines | yes |
| fastapi_9555 | fastapi | feature | wrapped-callables | missing-capability | d2 | few-lines | no |
| fastapi_9753 | fastapi | feature | wrapped-callables | missing-capability | d2 | few-lines | no |
| rich_2725 | rich | bugfix | table-panel-rendering | ordering-off-by-one | d2 | few-lines | yes |
| rich_2943 | rich | bugfix | style-caching | state-lifecycle | d1 | one-line | yes |
| rich_3006 | rich | bugfix | pretty-repr-rendering | api-contract-violation | d1 | one-line | yes |
| rich_3043 | rich | bugfix | export-html-svg | api-contract-violation | d1 | one-line | yes |
| rich_3052 | rich | feature | prompt-input | missing-capability | d2 | few-lines | no |
| rich_3061 | rich | bugfix | text-splitting | state-lifecycle | d4 | few-lines | yes |
| rich_3063 | rich | bugfix | markup-escaping | boundary-edge-case | d2 | few-lines | yes |
| rich_3064 | rich | bugfix | markdown-rendering | boundary-edge-case | d2 | few-lines | yes |
| rich_3067 | rich | bugfix | regex-highlighting | boundary-edge-case | d1 | one-line | yes |
| rich_3105 | rich | bugfix | export-html-svg | api-contract-violation | d2 | one-line | yes |
| rich_3130 | rich | bugfix | markdown-rendering | state-lifecycle | d3 | few-lines | yes |
| rich_3180 | rich | bugfix | text-splitting | ordering-off-by-one | d3 | multi-file | yes |
| rich_3278 | rich | bugfix | ansi-decoding | missing-capability | d2 | one-line | yes |
| rich_3296 | rich | bugfix | syntax-highlighting | api-contract-violation | d1 | one-line | yes |
| rich_3454 | rich | bugfix | regex-highlighting | boundary-edge-case | d1 | one-line | yes |
| rich_3468 | rich | bugfix | console-output | boundary-edge-case | d3 | few-lines | yes |
| rich_3469 | rich | bugfix | markdown-rendering | boundary-edge-case | d3 | one-line | yes |
| rich_3470 | rich | bugfix | console-output | state-lifecycle | d2 | one-line | yes |
| rich_3471 | rich | bugfix | text-span-management | api-contract-violation | d1 | one-line | yes |
| rich_3472 | rich | bugfix | pretty-repr-rendering | boundary-edge-case | d2 | few-lines | yes |
| rich_3480 | rich | bugfix | text-span-management | infinite-loop-recursion | d1 | few-lines | yes |
| rich_3486 | rich | feature | traceback-rendering | missing-capability | d4 | multi-file | no |
| rich_3506 | rich | bugfix | text-splitting | ordering-off-by-one | d2 | few-lines | yes |
| rich_3518 | rich | bugfix | table-panel-rendering | api-contract-violation | d1 | one-line | yes |
| rich_3521 | rich | bugfix | text-splitting | boundary-edge-case | d3 | few-lines | yes |
| rich_3535 | rich | performance | cell-width-graphemes | boundary-edge-case | d2 | few-lines | yes |
| rich_3675 | rich | feature | console-tty-detection | missing-capability | d2 | multi-file | no |
| rich_3676 | rich | feature | traceback-rendering | missing-capability | d2 | multi-file | no |
| rich_3718 | rich | bugfix | table-panel-rendering | api-contract-violation | d2 | few-lines | yes |
| rich_3772 | rich | bugfix | traceback-rendering | infinite-loop-recursion | d3 | few-lines | yes |
| rich_3777 | rich | feature | console-tty-detection | missing-capability | d2 | multi-file | no |
| rich_3782 | rich | bugfix | syntax-highlighting | boundary-edge-case | d3 | few-lines | yes |
| rich_3882 | rich | bugfix | prompt-input | api-contract-violation | d1 | one-line | yes |
| rich_3894 | rich | bugfix | pretty-repr-rendering | type-introspection | d2 | few-lines | yes |
| rich_3905 | rich | bugfix | live-progress | state-lifecycle | d1 | few-lines | yes |
| rich_3930 | rich | feature | cell-width-graphemes | missing-capability | d5 | large | no |
| rich_3934 | rich | bugfix | live-progress | boundary-edge-case | d2 | multi-file | yes |
| rich_3935 | rich | bugfix | table-panel-rendering | api-contract-violation | d2 | few-lines | yes |
| rich_3938 | rich | bugfix | console-output | boundary-edge-case | d3 | multi-file | yes |
| rich_3942 | rich | feature | markdown-rendering | missing-capability | d3 | multi-file | no |
| rich_3944 | rich | bugfix | cell-width-graphemes | boundary-edge-case | d2 | one-line | yes |
| rich_3953 | rich | bugfix | cell-width-graphemes | boundary-edge-case | d2 | few-lines | yes |
| rich_4006 | rich | bugfix | cell-width-graphemes | infinite-loop-recursion | d3 | few-lines | yes |
| rich_4070 | rich | performance | import-performance | missing-capability | d3 | multi-file | no |
| rich_4075 | rich | bugfix | console-output | api-contract-violation | d1 | few-lines | yes |
| rich_4076 | rich | bugfix | ansi-decoding | boundary-edge-case | d2 | few-lines | yes |
| rich_4077 | rich | bugfix | console-tty-detection | api-contract-violation | d1 | few-lines | yes |
| rich_4079 | rich | bugfix | markdown-rendering | api-contract-violation | d2 | few-lines | yes |
| requests_6589 | requests | bugfix | body-stream-handling | api-contract-violation | d2 | few-lines | yes |
| requests_6592 | requests | feature | status-codes | missing-capability | d1 | one-line | no |
| requests_6629 | requests | bugfix | json-decoding | api-contract-violation | d2 | few-lines | yes |
| requests_6644 | requests | bugfix | url-path-handling | boundary-edge-case | d2 | few-lines | yes |
| requests_6757 | requests | dependency-compat | body-stream-handling | compatibility-shim | d3 | few-lines | yes |
| requests_7205 | requests | bugfix | proxy-auth-config | boundary-edge-case | d1 | one-line | yes |
| requests_7309 | requests | bugfix | header-parsing | boundary-edge-case | d2 | few-lines | yes |
| requests_7315 | requests | bugfix | url-path-handling | api-contract-violation | d2 | one-line | yes |
| requests_7328 | requests | bugfix | redirect-history | state-lifecycle | d2 | few-lines | yes |
| requests_7427 | requests | bugfix | proxy-auth-config | boundary-edge-case | d2 | few-lines | yes |
| requests_7433 | requests | bugfix | body-stream-handling | type-introspection | d1 | few-lines | yes |
| requests_7502 | requests | bugfix | body-stream-handling | type-introspection | d2 | one-line | yes |
| requests_7505 | requests | bugfix | body-stream-handling | type-introspection | d3 | few-lines | yes |
| httpx_3672 | httpx | bugfix | connection-lifecycle | state-lifecycle | d4 | multi-file | yes |




---


# Per-Task Analysis (all 129 tasks)


## Category: bugfix


Corrects a runtime defect, crash, hang, or spec deviation in existing behavior (is_bug=True).


### Subcategory: ansi-decoding (2 tasks)


ANSI escape decoding: tokenizer coverage (private Fp sequences) and newline/terminator preservation in Text.from_ansi.


#### rich_3278 — Strip problematic private escape sequences

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | ansi-decoding |
| Root-cause family | missing-capability |
| Patch size | +1/-0, 1 files |
| Agent difficulty | 2/5 (one-line) |

**Problem.** `Text.from_ansi` / `AnsiDecoder` lets private Fp escape sequences (ESC followed by `0x30`-`0x3F`, notably ESC 7 / ESC 8 cursor save/restore) pass through as plain text. When Rich re-renders that Text, the sequences execute on the terminal, the cursor jumps around, and output is corrupted — the cited real-world case is Alpine's `apk-tools` progress output.

**Root cause.** `rich/ansi.py::re_ansi` (lines 10-16) only covers OSC (`ESC ] ... ESC \`) and ESC followed by a character in `[(@-Z\-_]` or a CSI sequence (`ESC [ ...`). The Fp private-use range `0`-`?` (0x30-0x3F) belongs to none of those classes, so `_ansi_tokenize` (lines 27-55) finds no match and yields the raw bytes as a plain-text token, which `AnsiDecoder.decode_line` appends verbatim (lines 152-154). Verified with stdlib `re`: the base regex has zero matches for ESC followed by any of `0123456789:;<=>?`. Trigger: decoding any terminal output that uses DECSC/DECRC or other private sequences, then printing the resulting Text.

**Reference fix.** Prepends the group-less alternative `(?:\x1b[0-?])|` to `re_ansi`. It matches ESC + any Fp byte; with no capture groups, `match.groups()` returns `(None, None)`, so `_ansi_tokenize` yields `_AnsiToken("", None, None)` and `decode_line` skips it (neither the `osc` nor the `sgr` branch fires) — the sequence is stripped. Verified: all 16 Fp codes now match with `(None, None)` groups while SGR/CSI sequences (`ESC[31m`, `ESC[0m`) still match unchanged.

**Acceptance tests.** `tests/test_ansi.py::test_strip_private_escape_sequences` — parametrized over each of the 16 codes; prints `Text.from_ansi(f"\x1b{code}x")` on a `force_terminal` console and asserts the capture equals `"x\n"`. Existing `test_decode*` cases must stay green.

**Agent notes.** The PR description names the ANSI parser and the exact `\x1b0`-`\x1b?` range, so localization is direct; verify with `pytest tests/test_ansi.py`. Difficulty 2 despite the one-line edit: the solver must see why a group-less match is silently dropped (the `(osc, sgr)` unpacking at line 42 and the branch logic). Must-nots: do not add a capture group to the new alternative (it would shift group indices and break all decoding), and do not broaden to all ESC sequences (that would swallow SGR styling). Subcategory `ansi-decoding` is proposed new — no suggested rich subcategory covers ANSI parsing.


#### rich_4076 — preserve newlines

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | ansi-decoding (proposed new) |
| Root-cause family | boundary-edge-case |
| Patch size | +3/-3, 1 files |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** `Text.from_ansi` drops trailing and consecutive newlines from ANSI terminal output: `"Hello\n"` becomes `"Hello"`, `"Hello\n\n"` becomes `"Hello\n"`, `"\n\n"` becomes `"\n"` (issue #3577). Blank-line structure of captured compiler/CLI output is corrupted.

**Root cause.** `rich/ansi.py::AnsiDecoder.decode` (lines 135-136) iterates `terminal_text.splitlines()`, which discards every terminator and the trailing empty segment (`"Hello\n"` -> `["Hello"]`, `"\n"` -> `[""]`). `Text.from_ansi` rejoins the decoded lines with a single `"\n"` *between* them, so each trailing input newline is lost (N trailing -> N-1). Trigger: any decode input ending in newlines or containing blank lines. `decode_line`'s own `\r` handling (`line.rsplit("\r", 1)[-1]`, line 152) is unrelated and stays.

**Reference fix.** Splits with a lookbehind regex, `re.split(r"(?<=\n)", terminal_text)`, which keeps each `"\n"` attached to its line *and* emits a trailing `""` element, then decodes `line.rstrip("\n")`. The trailing empty piece becomes `Text("")`, so the join reconstructs every original newline exactly (`"Hello\n"` -> `Text("Hello"), Text("")` -> `"Hello\n"`). Also fixes the stale docstring (`lines (Iterable[str])` -> `terminal_text`). `re` is already imported.

**Acceptance tests.** `tests/test_ansi.py::test_decode_newlines` (12 round-trip assertions); updated `test_decode` (extra trailing `Text("")`), `test_decode_example` (trailing `"\n\n"`), and `test_strip_private_escape_sequences` (trailing `"\n"`).

**Agent notes.** The subtle insight is the trailing empty segment: naive `splitlines(keepends=True)` still loses the final newline. Strip only `"\n"` per line — keep `\r` handling and other whitespace. Three pre-existing tests change expectations in this patch; run the full `tests/test_ansi.py` and accept the updated snapshots rather than restoring old ones. `rich/text.py` was not extracted; the join behavior is confirmed by the round-trip expectations. Subcategory `ansi-decoding` is proposed new.


### Subcategory: body-stream-handling (4 tasks)


Request body/stream preparation: duck-typing/protocol detection of file-like and iterable bodies, and super_len/Content-Length measurement incl. urllib3 1.x/2.x encoding.


#### requests_6589 — Enhance super_len to count encoded bytes for str

| Field | Value |
|---|---|
| Repo | psf/requests |
| Kind | bugfix |
| Subcategory | file-stream-detection |
| Root-cause family | api-contract-violation |
| Patch size | +3/-0, 1 file |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** When a request body is a str containing non-ASCII characters, the auto-set `Content-Length` header counts characters instead of encoded bytes (issue #6586). The transmitted UTF-8 body is longer than declared, so servers hang waiting for missing bytes or reject the framing.

**Root cause.** `src/requests/utils.py::super_len` (lines 133-196) has no str-specific handling at base: a str falls into the first branch, `if hasattr(o, "__len__"): total_length = len(o)` (lines 137-138), which returns the Unicode code-point count. `PreparedRequest.prepare_body` feeds that value into `Content-Length`, while urllib3 2.x encodes str bodies as UTF-8 on the wire. For data like `"This is a string containing multi-byte UTF-8 ☃️"`, each multi-byte character widens the gap between declared and actual octets, violating the HTTP contract that Content-Length equals the body byte count. Evidence: `total_length = len(o)` reached directly for str inputs. Trigger: `data=str` with non-ASCII content and no user-supplied Content-Length.

**Reference fix.** Prepend `if isinstance(o, str): o = o.encode("utf-8")` at the top of `super_len`, before the `__len__` check. The local rebinding makes `len()` count UTF-8 bytes without mutating the caller's object; bytes and file-like branches are untouched. Both new tests then see `Content-Length == len(data.encode("utf-8"))` for str and bytes bodies alike.

**Acceptance tests.** `tests/test_requests.py::TestRequests::test_content_length_for_bytes_data` and `::TestRequests::test_content_length_for_string_data_counts_bytes`, inserted after `test_autoset_header_values_are_native` (base line 1803). They use the `httpbin` fixture, which `tests/conftest.py` serves locally via pytest-httpbin.

**Agent notes.** The title names `super_len` outright — localization is a single grep. Verify with `pytest tests/test_requests.py -k content_length` plus `tests/test_utils.py -k super_len` (local server only). Encode UTF-8 specifically, rebind locally, and leave the stream/tell/seek logic alone. Historical caveat: this unconditional UTF-8 counting later broke urllib3 1.x (latin-1 str bodies) and was version-gated in PR #6757 — out of scope here, but a solving agent should not "pre-fix" it with version detection, since the acceptance tests define the UTF-8 contract.


#### requests_7433 — Fix `prepare_body` stream detection for `__getattr__`-based file wrappers

| Field | Value |
|---|---|
| Repo | psf/requests |
| Kind | bugfix |
| Subcategory | file-stream-detection |
| Root-cause family | type-introspection |
| Patch size | +3/-3, 1 file |
| Agent difficulty | 1/5 (few-lines) |

**Problem.** After the `isinstance(Iterable)` modernization, `prepare_body` no longer recognizes stream bodies whose `__iter__` is provided via `__getattr__`, so posting such a wrapper crashes instead of streaming (issue #7432). The PR body supplies the exact fix.

**Root cause.** `models.py::prepare_body` (lines 599-601) gates streaming on `if isinstance(data, Iterable) and not isinstance(...)`. `collections.abc.Iterable.__subclasshook__` checks for `__iter__` in the class MRO only, so an `AttrProxy` forwarding to `io.BytesIO` via `__getattr__` fails the check (verified locally) and is routed to the raw/form branch. There, `_encode_params` fails `isinstance(data, _SupportsRead)` (Python 3.12 protocol checks use `getattr_static`) but passes `elif hasattr(data, "__iter__"):` (line 166), calling `to_key_val_list(data)` whose fallback `list(value)` uses type-level iteration the proxy lacks — raising `TypeError: 'AttrProxy' object is not iterable` during preparation (reproduced). The stream branch is also where `self._body_position = body.tell()` (line 614) is recorded, which the 307-redirect rewind relies on. Trigger: `data=` wrappers exposing `__iter__`/`read` only dynamically, especially across 307/308 redirects.

**Reference fix.** Introduces `is_iterable = isinstance(data, Iterable) or hasattr(data, "__iter__")` and gates the stream branch on it, keeping the `(str, bytes, list, tuple, Mapping)` exclusions. Proxies now get `super_len` Content-Length, `_body_position` bookkeeping, and are streamed by urllib3 via explicit `read()` calls; the 307 replay works and httpbin echoes `data`. Standard iterables keep the `isinstance` path, so the modernization is not reverted.

**Acceptance tests.** `tests/test_requests.py::TestRequests::test_getattr_proxy_stream_follows_redirect` (new; posts `AttrProxy` through `redirect-to?url=/post&status_code=307`, asserts echoed body).

**Agent notes.** The PR quotes the replacement condition verbatim — apply it as-is. Verify with the pytest-httpbin test plus the neighboring "Unable to rewind request body" tests. Subtlety: `hasattr(data, "__iter__")` can be True while `iter(data)` still fails; the fix is safe because the stream path never calls `iter()`, only `read()`. Do not revert to hasattr-only detection or alter the exclusion tuple. `sessions.py::rewind_body` was not extracted; its contract is visible via `_body_position` and existing rewind tests.


#### requests_7502 — Fix `_encode_files` detection for `__getattr__`-based file wrappers

| Field | Value |
|---|---|
| Repo | psf/requests |
| Kind | bugfix |
| Subcategory | file-stream-detection |
| Root-cause family | type-introspection |
| Patch size | +3/-1, 1 file |
| Agent difficulty | 2/5 (one-line) |

**Problem.** Uploading a `__getattr__`-based file wrapper such as `tempfile.NamedTemporaryFile` via `files=` crashes with a TypeError, because `_encode_files` fails to recognize the wrapper as a readable file object.

**Root cause.** In `models.py::_encode_files` (lines 237-246), readable uploads are detected with `elif isinstance(fp, _SupportsRead):` (line 239). On Python 3.12+, `runtime_checkable` Protocol instance checks use `inspect.getattr_static`, which bypasses `__getattr__` — verified locally: `isinstance(NamedTemporaryFile(...), SupportsRead)` is False even though `hasattr(f, "read")` is True. The wrapper therefore falls through the `fp is None` guard to the final `else: fdata = fp` (lines 243-244), so the wrapper object itself — not its contents — becomes the multipart field data. `RequestField(data=wrapper)` then reaches `urllib3.filepost.encode_multipart_formdata`, which writes field data into a bytes buffer and raises `TypeError: a bytes-like object is required, not '_TemporaryFileWrapper'` (reproduced with urllib3 2.8.0). Trigger: any `files=` value whose `read()` is synthesized by `__getattr__` instead of being a real class attribute.

**Reference fix.** Changes line 239 to `elif isinstance(fp, _SupportsRead) or hasattr(fp, "read"):` (plus a comment). Dynamic proxies now take the `fdata = fp.read()` branch and their contents are uploaded; the `isinstance` term is kept so static type narrowing still works for typed callers. The new test posts a `NamedTemporaryFile` and asserts httpbin echoes its contents, which passes once `read()` is actually called.

**Acceptance tests.** `tests/test_requests.py::TestRequests::test_post_named_tempfile` (new; writes, seeks to 0, posts via `files=`, asserts echoed file content).

**Agent notes.** The PR title names the exact function, so localization is trivial; grep `_SupportsRead` in `models.py`. The traceback surfaces in urllib3, not requests — follow the `files=` path into `_encode_files`. Verify with the pytest-httpbin-backed test plus neighboring multipart tests. Must not replace `isinstance` with `hasattr` alone (loses narrowing) or disturb the `str/bytes/bytearray` and `None` branches. This base already includes the #7433 `prepare_body` fix; the remaining gap is only this upload site.


#### requests_7505 — Add hasattr checks for remaining protocol isinstance checks

| Field | Value |
|---|---|
| Repo | psf/requests |
| Kind | bugfix |
| Subcategory | file-stream-detection |
| Root-cause family | type-introspection |
| Patch size | +9/-7, 2 files |
| Agent difficulty | 3/5 (few-lines) |

**Problem.** Successor to #7502: two remaining `isinstance(..., SupportsRead)` protocol checks still miss `__getattr__`-based file proxies, so a read-only proxy passed as `data=` is mislabeled as form data. The PR consolidates read detection into one `_types.has_read()` helper.

**Root cause.** On Python 3.12+, `runtime_checkable` Protocol instance checks use `inspect.getattr_static`, which bypasses `__getattr__` (verified locally: `isinstance(proxy, SupportsRead)` is False while `hasattr(proxy, "read")` is True). For a `ReadProxy` that forwards `read` but blocks `__iter__`, `prepare_body`'s `is_iterable` test fails, so the raw-data branch runs. In `models.py::_encode_params` (line 164) `elif isinstance(data, _SupportsRead):` is False and the proxy falls through to the final `else`, returned unchanged as the body. Then `models.py::prepare_body` (line 644) `if isinstance(data, basestring) or isinstance(data, _SupportsRead):` is also False, so `content_type = "application/x-www-form-urlencoded"` is attached to a streamed body. The stream is still sent, but the form Content-Type makes the server (httpbin/werkzeug) parse it as form data, consuming the stream so the echoed `data` field is empty — verified with werkzeug: `get_data` returns `''` after form parsing of a form-urlencoded body. Trigger: any `data=` object proxying `read()` via `__getattr__` without a class-level `__iter__`.

**Reference fix.** Adds `has_read(obj) -> TypeIs[SupportsRead[str | bytes]]` in `_types.py` (`isinstance(obj, SupportsRead) or hasattr(obj, "read")`), moves `from . import _types as _t` to a runtime import in `models.py`, and replaces the checks at lines 164, 241 (already hasattr-guarded by #7502), and 644 with `_t.has_read(...)`. The proxy is now recognized as a stream, `content_type` stays `None`, and httpbin echoes the raw body. `TypeIs` preserves static narrowing; lazy annotations make the TYPE_CHECKING-only `TypeIs` import safe.

**Acceptance tests.** `tests/test_requests.py::TestRequests::test_post_getattr_proxy_read_only` (new; posts a `ReadProxy` and asserts echoed data), plus `test_post_named_tempfile` as regression.

**Agent notes.** Cues: PR names `SupportsRead` and "two other places"; grep finds exactly lines 164/241/644. Verify with pytest-httpbin-backed tests. Must not drop the `isinstance` half of `has_read`, import `TypeIs` at runtime, or remove `@runtime_checkable`. The failure is server-visible (wrong Content-Type), not a requests-side crash — reproduce via the httpbin fixture, not by inspecting `prepared.body` alone.


### Subcategory: cell-width-graphemes (3 tasks)


Character cell measurement and grapheme segmentation: width tables/fast-path regex, control/PUA codepoints, ZWJ/VS16 grapheme clusters, and the grapheme splitter.


#### rich_3944 — fix fonts

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | cell-width |
| Root-cause family | unicode-width |
| Patch size | +1/-1, 1 files |
| Agent difficulty | 2/5 (one-line) |

**Problem.** Nerd-font icons such as `U+F024D` are measured as zero terminal cells by `cell_len`, so any layout containing them (tables, panels, progress bars) misaligns: rich reserves no space while the terminal actually draws a one-cell glyph (issue #3943).

**Root cause.** `rich/cells.py::get_character_cell_size` (lines 57-60) binary-searches a per-Unicode-version table of assigned codepoint ranges, but first short-circuits: `if codepoint > table[-1][1]: return 0`. Nerd Fonts map icons into the Supplementary Private Use Area-A (`U+F0000`-`U+FFFFD`), above the table's last assigned range, so they hit this guard and count as 0 cells. The guard is internally inconsistent: unassigned codepoints *inside* the table range fall through the search to `return 1` (line 75). Trigger: measuring any character above the loaded table's end — PUA nerd-font glyphs, or newly assigned characters when an older `unicode_version` table is in use.

**Reference fix.** One line: the out-of-range guard returns `1` instead of `0`, matching the in-range fallback and terminal reality for PUA glyphs. In-table zero-width entries (`width == -1`, combining marks, variation selectors) are untouched.

**Acceptance tests.** `tests/test_cells.py::test_nerd_font` — `assert cell_len("\U000f024d") == 1` ("Not allocated by unicode, but used by nerd fonts").

**Agent notes.** The PR title ("fix fonts") is a weak cue; the regression test name and codepoint do the localization — run it, watch it fail, and grep `cells.py` for the width-table guard. The domain insight needed is that nerd fonts live in Supplementary PUA-A beyond Unicode's assigned ranges. Verify with the full `tests/test_cells.py` to protect combining-mark/emoji/CJK widths. Do not return 2 (rich treats these as single-cell) and do not touch the ZWJ/variation-selector paths in `_cell_len`.


#### rich_3953 — Fix ZWJ and edge cases

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | cell-width |
| Root-cause family | boundary-edge-case |
| Patch size | +16/-10, 1 files |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** `cell_len` raises `StopIteration` when a string ends with a zero-width joiner (`U+200D`), and it measures non-printable control characters as width 1 instead of 0 (rich issues #3947 and #3950).

**Root cause.** Two defects in `rich/cells.py`. (1) `_cell_len` (lines 138-150) iterates a shared `iter_characters = iter(text)` and, on a ZWJ, calls `next(iter_characters)` (line 143) to swallow the joined character; when the ZWJ is the final codepoint the iterator is exhausted and `next()` raises `StopIteration`, which propagates out of `cell_len`. (2) `get_character_cell_size` (lines 57-75) has no control-code guard: codepoints 1-31 and 127-159 match no width range, so the binary search exits via `if upper_bound < lower_bound: break` (lines 72-73) and falls through to `return 1` (line 75), counting control characters as one cell. NUL is covered by the table's `(0,0,0)` entry. Evidence: `next(iter_characters)` (line 143) and `return 1` (line 75).

**Reference fix.** Add an early `return 0` for C0 (except NUL) and the DEL/C1 range `0x7F-0x9F` in `get_character_cell_size`. Rewrite `_cell_len` as an index-based `while` loop so a ZWJ advances the index by 2 without `next()`; a trailing ZWJ runs the index past the end and the loop ends cleanly. The binary search is normalized to `while lower_bound <= upper_bound` and returns the stored width directly (regenerated tables encode zero width as 0, not -1).

**Acceptance tests.** `tests/test_cells.py::test_zwj` (`cell_len("")==0`, `cell_len(ZWJ)==0`, `cell_len("1"+ZWJ)==1`, `cell_len("1"+ZWJ+"2")==1`) and `tests/test_cells.py::test_non_printable` (`cell_len(chr(n))==0` for `n in range(31)`).

**Agent notes.** The title and the two new test names localize both behaviors precisely; the patch is confined to `rich/cells.py`. Reproduce the `StopIteration` crash before fixing. Verify with `pytest tests/test_cells.py`, keeping `test_nerd_font` green (the out-of-range fallback must still return 1). Risks: preserve the wcwidth-aligned choice that `"1"+ZWJ+"2"` measures 1 (the ZWJ consumes the next character) — do not "correct" it to 2; keep the NUL fall-through to the table; do not regress the VS16 narrow-to-wide path.


#### rich_4006 — fix for infinite loop in split_graphemes

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | grapheme-segmentation |
| Root-cause family | infinite-loop-recursion |
| Patch size | +33/-12, 1 files |
| Agent difficulty | 3/5 (few-lines) |

**Problem.** `split_graphemes` enters an infinite loop for strings that start with a zero-width character (e.g. the ESC control code `U+001B`) or with a variation selector (`U+FE0F`) that has no preceding measured character. Because `chop_cells`, `split_text` and `set_cell_size` all call it, they hang too (rich issue #3958).

**Root cause.** In `rich/cells.py::split_graphemes` (lines 182-209) the `while index < codepoint_count` loop has paths that never advance `index`. The SPECIAL branch handles ZWJ (`index += 2`, line 186) and VS16 only when `last_measured_character` is truthy (line 190); a leading `U+FE0F` matches neither guard and hits `continue` (line 200) with `index` unchanged, spinning forever. Separately, `get_character_cell_size` returns 0 for control codes (guard at lines 58-59), so for a leading ESC the walrus `if character_width := ...` (line 202) is falsy and `elif spans:` (line 206) is also falsy because `spans` is empty — no statement increments `index`. Evidence: `elif last_measured_character:` (line 190), `continue` (line 200), `elif spans:` (line 206). A trailing ZWJ (`U+200D`) additionally does `index += 2` past the end, producing spans whose end exceeds `len(text)` — a coverage defect rather than a hang.

**Reference fix.** Every branch now advances the index and emits gapless spans: a leading ZWJ/VS16 appends a zero-width span `(index, index+1, 0)`; ZWJ advances by 2 only when a next codepoint exists, else 1; VS16 with no measured character extends the previous span; a zero-width character with no prior span creates its own zero-width span. The docstring now documents that spans cover every index and that some graphemes may have cell length 0.

**Acceptance tests.** `tests/test_cells.py::test_chop_cells_zero_width` (parametrized over the empty string and runs of ESC, all expecting `[]`) and the extended `tests/test_cells.py::test_split_graphemes` (new cases: one/two ESC, one/two `U+FE0F`, one/two `U+200D`, each asserting exact zero-width spans and total width 0).

**Agent notes.** Localization is easy: the title names the function and the failure mode, and the new tests enumerate the exact inputs. The failure is a hang, so reproduce under a timeout rather than expecting an assertion. Verify with `pytest tests/test_cells.py` and re-check the emoji/VS16 regression cases (e.g. recycling symbol `U+267B U+FE0F`, down arrow, `♻♻️`) for unchanged spans. Risks: preserve `total_width` and span semantics for valid emoji; never emit a span end beyond `len(text)`; do not "fix" this by skipping zero-width characters (that would break `chop_cells` offsets), and do not touch `get_character_cell_size` — zero width for control codes is intended behavior from rich_3953.


### Subcategory: connection-lifecycle (1 tasks)


HTTP/1.1 server connection state machine: keep-alive, body draining, stream lifecycle, and parser reset.


#### httpx_3672 — Server connection handling.

| Field | Value |
|---|---|
| Repo | encode/httpx |
| Kind | bugfix |
| Subcategory | connection-lifecycle |
| Root-cause family | state-lifecycle |
| Patch size | +57/-22, 7 files |
| Agent difficulty | 4/5 (multi-file) |

**Problem.** The experimental sync (`src/httpx`) and async (`src/ahttpx`) server stacks cannot serve HTTP/1.1 keep-alive connections or shut down cleanly: the parser is never reset between requests, unread request bodies are not drained, the 500 path crashes, sockets leak on exit, and Ctrl+C escapes as a traceback.

**Root cause.** Five verified defects. (1) `src/httpx/_server.py::HTTPConnection._complete` (lines 91-93) runs `self._parser.complete` — a bare bound-method reference, missing call parentheses — so the parser stays in DONE state and the next keep-alive request fails its state transition; the async twin (`src/ahttpx/_server.py:92`) does `await self._parser.complete`, awaiting a method object (TypeError). (2) `handle_requests` (lines 32-53) never drains a request body the endpoint ignored, so leftover bytes would corrupt the next parse. (3) Line 46 builds `Response(code=500, content=content)`, but the status code is positional (call site `_pool.py:175`), so the error path itself raises. (4) `src/httpx/_network.py:163` assigns `self._streams = list[NetworkStream]` — the GenericAlias type, not a list — and `__exit__` (178-180) closes only the listener: handler threads blocked in `recv` hang `executor.shutdown(wait=True)` and sockets leak (`__del__` warns). (5) `HTTPServer.wait` (100-102) loops `sleep(1)` without catching `KeyboardInterrupt`. Evidence: `self._parser.complete`, `self._streams = list[NetworkStream]`.

**Reference fix.** Rename `HTTPParser.complete` to `reset() -> bool` in both packages (True = recycled for keep-alive, False = closed) and add `is_keepalive()` (both keep-alive flags and `send_state != CLOSED`). Pool/server callbacks become `_reset` and actually call `reset()`. After each response the server drains the body (`if self._parser.is_keepalive(): stream.read()`) then resets explicitly. `Response(500, ...)` fixes the error path. `NetworkStream.is_closed()` is added; `NetworkServer` initializes a real list, tracks/prunes accepted streams in `_serve`, and closes them all in `__exit__`; `wait()` breaks on `KeyboardInterrupt`.

**Acceptance tests.** `tests/test_parsers.py::test_parser`, `::test_parser_server`, `::test_parser_repr`, `::test_client_connection_close`, `::test_server_connection_close` — all now call `p.reset()`; offline via `httpx.DuplexStream`.

**Agent notes.** Mirror every change across both packages; async must `await self._parser.reset()` with parentheses. The test_patch only covers the rename — passing it is necessary but not sufficient; the drain, stream lifecycle, Response, and Ctrl+C fixes need manual smoke tests (two requests on one connection, body-ignoring endpoint, raising endpoint, clean exit). `_response.py`/`_streams.py` were not extracted; the positional Response signature is inferred from `_pool.py:175`. Keep `reset()`'s bool contract and exclude CLOSED from `is_keepalive()`.


### Subcategory: console-output (4 tasks)


Console output path: print newline/end/style semantics, capture/recording buffer-index lifecycle, and broken-pipe write/flush error handling.


#### rich_3468 — handle broken pipe

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | console-broken-pipe (proposed) |
| Root-cause family | boundary-edge-case |
| Patch size | +36/-6, 1 files |
| Agent difficulty | 3/5 (few-lines) |

**Problem.** Piping Rich output into a consumer that exits early (`python -m rich | head -1`) crashes with an unhandled `BrokenPipeError`, followed by the interpreter-shutdown "Exception ignored ... BrokenPipeError" noise and exit code 120, instead of a quiet exit 1 (issue #1591).

**Root cause.** `rich/console.py::Console._check_buffer` (lines 1992-2069) writes the rendered buffer via `self.file.write(text)` (line 2063 on the non-Windows path) and `self.file.flush()` (line 2068), but its only except clause catches `UnicodeEncodeError` (lines 2064-2066). When the pipe's read end closes, the OS delivers EPIPE and write/flush raise `BrokenPipeError`, which escapes `Console.print`. Because stdout still buffers data, Python's shutdown flush raises a second time, producing the stderr noise and exit status 120. Nothing silences the console, redirects the dead fd, or exits cleanly — the environmental edge case of a vanished downstream reader is simply unhandled.

**Reference fix.** The post-quiet-check body of `_check_buffer` moves into a new `_write_buffer()`; `_check_buffer` calls it inside `try/except BrokenPipeError` and delegates to a new overridable `on_broken_pipe()` hook. The hook implements the Python-docs SIGPIPE recipe: `self.quiet = True`, `os.dup2(os.open(os.devnull, os.O_WRONLY), sys.stdout.fileno())` so the final interpreter flush cannot re-raise, then `raise SystemExit(1)`. Two hunks in `render_lines`/`render_str` are black-style parenthesization only — no behavior change.

**Acceptance tests.** `tests/test_console.py::test_brokenpipeerror` (skipped on win32 and when `python`/`head`/`python -m rich` are unavailable): spawns the `python -m rich | head -1` pipeline and asserts producer returncode 1, consumer returncode 0.

**Agent notes.** Localization is easy (title, issue link, grep for the write/flush sites); the subtlety is the shutdown recipe. Verify on Unix with the pytest case plus `python -m rich | head -1; echo $?`. Must-nots: wrap only `write()` and miss `flush()`; exit without the devnull dup2 (exit code becomes 120 and the test fails); catch `BrokenPipeError` around rendering instead of the flush; or treat the formatting-only hunks as functional. The devnull redirect assumes a real fd — acceptable since the hook only fires on genuine pipe errors. Subcategory `console-broken-pipe` is proposed: no suggested rich subcategory covers output-stream pipe lifecycle.


#### rich_3470 — Fix record and capture

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | console-capture-record |
| Root-cause family | state-lifecycle |
| Patch size | +1/-1, 1 files |
| Agent difficulty | 2/5 (one-line) |

**Problem.** With `Console(record=True)`, output printed inside a `console.capture()` block leaks into the recording returned by `export_text()`, and with multiple captured prints it is duplicated. Issue #2563; captured text should be invisible to the recorder.

**Root cause.** `console.py::Console._write_buffer` (lines 2028-2036). `capture()` calls `begin_capture()` -> `_enter_buffer()`, incrementing the thread-local `_buffer_index` (lines 815-817, 866-868). While the index is > 0, `_write_buffer` suppresses terminal writes via `if self._buffer_index == 0:` (line 2036) and leaves `_buffer` uncleared so `end_capture()` can render it. But the recording branch runs unconditionally: `if self.record:` (line 2032) followed by `self._record_buffer.extend(self._buffer[:])` (line 2034). Every print inside the capture goes through `_exit_buffer` -> `_check_buffer` -> `_write_buffer`, so (1) captured segments that never reached the terminal are recorded, and (2) since the buffer accumulates during capture, each print re-copies the whole pending buffer into `_record_buffer`, duplicating earlier captured lines. Trigger: `record=True` plus any print inside `with console.capture():`.

**Reference fix.** Change the guard to `if self.record and not self._buffer_index:` so recording happens only when the buffer is actually flushed to the file. Normal prints still record because `_exit_buffer` decrements the index to 0 before `_check_buffer` runs. The test patch deletes the old `test_capture_and_record` (which asserted the buggy `recorded == "ABC\nHello\n"`) and adds a regression test: one print before capture, four inside; `capture.get()` must equal the four captured lines and `export_text()` must equal `"Print 0\n"` only.

**Acceptance tests.** `tests/test_console.py::test_capture_and_record` (new regression version; the old capsys-based test is removed).

**Agent notes.** Cues are the keywords "record"/"capture" plus issue #2563; no file paths, so trace `capture` -> `_enter_buffer` -> `_write_buffer`. Reproduce with a recording console and several prints inside capture, checking `export_text()` for leakage/duplication. Verify with the new test plus `test_capture` and export tests. Do not "fix" this by clearing the buffer during capture or editing `end_capture` (breaks `capture.get()`), and do not try to satisfy the deleted old test — it encoded the bug. Note `Live`/group contexts share `_buffer_index`; deferring their recording until flush is intended.


#### rich_3938 — fix background style with soft wrap

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | console-print-semantics (proposed new) |
| Root-cause family | boundary-edge-case |
| Patch size | +40/-5, 2 files |
| Agent difficulty | 3/5 (multi-file) |

**Problem.** `console.print("soft wrap is on", style="blue on white", soft_wrap=True)` leaves the white background active across the newline, so the following line is painted with the previous print's background (issue #3838). The background must be reset before the line feed.

**Root cause.** In `rich/console.py::Console.print` (lines 1726-1731) the style branch wraps everything in `Segment.apply_style(render(...), self.get_style(style))`, which composes the style onto *all* segments — including the `Segment("\n")` terminators. `soft_wrap=True` forces `crop = False` (line 1695), so the raw styled segments go straight into the buffer (line 1745) and the styled `\n` reaches the terminal, where a background-styled line feed bleeds into the next line. The `crop=True` path hides the bug: `Segment.split_and_crop_lines` rebuilds lines and appends a fresh unstyled `new_line_segment = cls("\n")` (`rich/segment.py` line 303, lines 312-318). Trigger: any styled print with a background and `soft_wrap=True` (or `crop=False`).

**Reference fix.** Adds `Segment.split_lines_terminator` (segment.py, after `split_lines`): same newline-partition logic but yields `(line_segments, had_newline)` pairs, skipping control segments. `Console.print` now hoists `render_style = self.get_style(style)`, applies the style only to each line's content, and appends a plain `Segment.line()` whenever a line was newline-terminated — newlines are unstyled in every mode.

**Acceptance tests.** `tests/test_segment.py::test_split_lines_terminator` and `::test_split_lines_terminator_single_line` (helper contract: `([Segment("Hello")], True), ([Segment("World")], False)`); `tests/test_text.py::test_soft_wrap_styled` expects `"\x1b[34;47msoft wrap is on\x1b[0m\nNext line\n"` — reset before `\n`.

**Agent notes.** Statement is terse (title + issue link); the tests are the spec. Reproduce first and inspect raw ANSI. Pitfalls: the helper must ignore `segment.control`, yield `(line, False)` for an unterminated final line, and yield `([], True)` for blank lines so they survive; never style the appended newline. Verify with the three named tests plus full `test_segment.py`, `test_text.py`, `test_console.py`. Subcategory `console-print-semantics` is proposed new — no suggested rich subcategory covers print/terminator styling.


#### rich_4075 — empty with end

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | console-print-semantics (proposed new) |
| Root-cause family | api-contract-violation |
| Patch size | +12/-3, 1 files |
| Agent difficulty | 1/5 (few-lines) |

**Problem.** `console.print(end="!")` with no positional objects emits a bare `"\n"` and silently discards the custom `end` (expected `"!"`) (issue #3740); likewise `print(end="")` emits a stray newline. The caller's `end` should be the only output when there is nothing to print.

**Root cause.** `rich/console.py::Console.print` (lines 1689-1690) begins with `if not objects: objects = (NewLine(),)`. `NewLine.__rich_console__` (lines 286-289) unconditionally yields `Segment("\n" * self.count)`, and although `_collect_renderables` normally joins with `Text(sep, justify=justify, end=end)` (lines 1550-1554), under the `NewLine` substitution the custom `end` is never appended (`check_text()` no-ops on the empty buffer and `NewLine` bypasses the end-handling path): output is a bare `"\n"` for any `end` value. The substitution exists to keep bare `print()` emitting a blank line with the default `end="\n"`, but it fires for every `end` value. Trigger: zero-object `print` with any non-default `end`.

**Reference fix.** Conditions the substitution: `if end == "\n": objects = (NewLine(),)` else `objects = ("",)`, so a custom `end` is emitted alone while bare `print()` is unchanged. The remaining hunks are cosmetic — moving `from os import PathLike` into the sorted import block and black-reformatting the `save_text` signature.

**Acceptance tests.** `tests/test_console.py::test_print_empty_with_end` — `console.print(end="!")` must yield exactly `"!"`.

**Agent notes.** Obvious locus once the test runs; verify with full `tests/test_console.py` to protect bare `print()` and existing `end` behavior. Keep the `NewLine()` branch for the default end — `NewLine` (a ConsoleRenderable) and `""` (str/Text) take different paths through `_collect_renderables` (Align/justify wrapping), so unconditional `("",)` is not guaranteed equivalent. The PR body mentions dropping Python 3.8, but the patch has no packaging changes — do not chase pyproject edits. Subcategory `console-print-semantics` is proposed new (shared with rich_3938).


### Subcategory: console-tty-detection (1 tasks)


Terminal/interactivity detection and environment overrides (TTY_COMPATIBLE, TTY_INTERACTIVE, FORCE_COLOR, NO_COLOR) and FileProxy isatty delegation.


#### rich_4077 — proxy isatty

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | console-tty-detection |
| Root-cause family | api-contract-violation |
| Patch size | +3/-0, 1 files |
| Agent difficulty | 1/5 (few-lines) |

**Problem.** `FileProxy` — the wrapper Rich installs over `sys.stdout`/`sys.stderr` while a `Live` display redirects I/O — always reports `isatty() == False`, even when the wrapped file is a real terminal (issue #4041). Code that probes `sys.stdout.isatty()` during redirection therefore mis-detects the TTY and disables colors/animations.

**Root cause.** `rich/file_proxy.py::FileProxy` (lines 11-26) subclasses `io.TextIOBase` and delegates unknown attributes via `def __getattr__(self, name): return getattr(self.__file, name)`. But `__getattr__` is only a *fallback*: Python calls it when normal attribute lookup fails. `io.TextIOBase` inherits a concrete `IOBase.isatty()` that returns `False`, so `proxy.isatty` resolves to the inherited method and `__getattr__` is never consulted. The class overrides `write`, `flush`, and `fileno` (lines 56-57: `return self.__file.fileno()`) but never `isatty`, so the proxy violates the file-like contract of reflecting the wrapped file. Trigger: `Live._enable_redirect_io` swaps in `FileProxy` on a real terminal; any `isatty()` probe then answers `False`. Verified with a minimal local repro: a `TextIOBase` subclass with the same `__getattr__` wrapping a TTY stub returns `False`.

**Reference fix.** Adds a concrete override at the end of `FileProxy`: `def isatty(self) -> bool: return self.__file.isatty()`. The explicit method shadows the `io.TextIOBase` default, restoring faithful delegation exactly like the existing `fileno()` override. The new test wraps a `TTYFile` stub (whose `isatty()` returns `True`) and asserts `file_proxy.isatty()` is truthy, which now passes.

**Acceptance tests.** `tests/test_file_proxy.py::test_isatty` (new regression test); existing `test_empty_bytes`, `test_flush`, `test_new_lines` must remain green.

**Agent notes.** The title "proxy isatty" gives the locus directly — open `rich/file_proxy.py` and add the two-line method. Verify with `pytest tests/test_file_proxy.py`. Do not "fix" this by removing the `io.TextIOBase` base class or by overriding `__getattribute__`; do not touch the `write`/`flush` buffering. General insight for the brain: every concrete method on `IOBase` (`isatty`, `readable`, `seekable`, ...) shadows `__getattr__` delegation — only `isatty` is required here, but the pattern generalizes.


### Subcategory: dependency-compat (2 tasks)


Compatibility with upstream dependency versions/APIs (Pydantic v1/v2, Starlette) and the fastapi/_compat shim layer, including model-config propagation.


#### fastapi_14186 — Fix internal Pydantic v1 compatibility (warnings) for Python 3.14 and Pydantic 2.12.1

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | pydantic-compat |
| Root-cause family | compatibility-shim |
| Patch size | +266/-98, 10 files |
| Agent difficulty | 4/5 (multi-file) |

**Problem.** On Python 3.14 with Pydantic 2.12.1, FastAPI's test suite fails wholesale at import time: the mixed-v1/v2 support from PR #14168 made `fastapi._compat` import `pydantic.v1` unconditionally, and Pydantic 2.12 dropped the v1 shim on 3.14 and warns when it is imported (pydantic#12367). FastAPI's `filterwarnings = ["error", ...]` turns that warning into a collection error.

**Root cause.** An unconditional import chain serves only dispatch checks. `fastapi/_compat/__init__.py:47-50` re-exports symbols `from .v1 import ...`; `fastapi/_compat/v1.py:71-119` (PYDANTIC_V2 branch) imports `from pydantic.v1 import BaseModel as BaseModel` and ~40 more symbols; `main.py:11`, `shared.py:19`, `v2.py:18`, `encoders.py:20`, `dependencies/utils.py:24-33`, `utils.py:18-26`, and `temp_pydantic_v1_params.py:9` all import `v1` at module scope. Nearly all uses are `isinstance`/`lenient_issubclass` tests like `main.py:53` `if lenient_issubclass(model, v1.BaseModel):` — always False for v2-only apps, yet they force the deprecated `pydantic.v1` import at startup. Trigger: Python 3.14 + Pydantic >=2.12 with warnings-as-errors (FastAPI's own pytest config, pyproject.toml lines 173-174).

**Reference fix.** New `fastapi/_compat/may_v1.py` (123 lines): on `sys.version_info >= (3, 14)` it defines empty dummy classes (`BaseModel`, `ModelField`, `FieldInfo`, `ErrorWrapper`, `Color`, `SecretStr`, ...) so dispatch checks are safely False without touching `pydantic.v1`, and sources `ValidationError`/`create_model` from `.v2`; on older Pythons it re-exports the real `.v1` symbols. `_normalize_errors`/`_regenerate_error_with_loc` move from `v1.py` to `may_v1.py`. All consumers switch to `may_v1`, and genuine `v1` imports are deferred inside branches that run only when a real v1 object is detected; `get_definitions` returns v2-only maps on 3.14. Tests drop module-scope `v1` imports, using lazy imports under `@needs_py_lt_314` / `@needs_pydanticv1` (markers already in base `tests/utils.py`).

**Acceptance tests.** `tests/test_compat.py` (`test_v1_plain_validator_function`, `test_is_pv1_scalar_field`, `test_get_model_fields_cached` — now version-guarded), `tests/test_get_model_definitions_formfeed_escape.py::test_model_description_escaped_with_formfeed`, `tests/test_response_model_as_return_annotation.py::test_invalid_response_model_field_pv1`.

**Agent notes.** The statement names the failing versions and the dummy-class remedy — design risk is low, execution risk is missing one of the ~10 import sites; grep `from fastapi._compat import v1` and `pydantic.v1` exhaustively. Keep <3.14 behavior identical (re-export path), keep dummy types distinct so `isinstance` stays False, mind the may_v1/v2 import cycle, and mirror `# pragma: no cover` on version-exclusive branches (100% coverage gate). Verify on 3.14 + Pydantic 2.12.1 with the three test files, then the full suite; on older interpreters assert `pydantic.v1` still loads only when v1 models are used.


#### fastapi_14482 — Fix handling arbitrary types when using `arbitrary_types_allowed=True`

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | pydantic-compat |
| Root-cause family | schema-generation-logic |
| Patch size | +25/-7, 1 file |
| Agent difficulty | 3/5 (few-lines) |

**Problem.** A response model with `model_config = ConfigDict(arbitrary_types_allowed=True)` and a field of a plain custom class (e.g. a fake numpy array with `WithJsonSchema`/`PlainSerializer` metadata) fails in FastAPI with `PydanticSchemaGenerationError`, even though pure Pydantic handles the same model fine (discussion #14184, issue #14483).

**Root cause.** Two loci in `fastapi/_compat/v2.py`. (1) `ModelField.__post_init__` (lines 85-99) builds `TypeAdapter(Annotated[self.field_info.annotation, self.field_info])` with no `config` argument. (2) `get_model_fields` (lines 414-418) wraps each `model.model_fields` entry as `ModelField(field_info=field_info, name=name)` and never forwards the parent model's config. For response serialization FastAPI validates/serializes each field through these standalone adapters; an arbitrary class is only schema-generatable when `arbitrary_types_allowed=True` is in the adapter's config, which is lost — so schema generation raises. The field's `Annotated` metadata (`WithJsonSchema`, `PlainSerializer`) is also not explicitly splatted into the adapter annotation. Trigger: any response model mixing arbitrary types with model-level config.

**Reference fix.** Adds `config: Union[ConfigDict, None] = None` to the `ModelField` dataclass and passes `config=self.config` to `TypeAdapter`. `get_model_fields` now propagates `model.model_config` per field, except when the field type is itself a `BaseModel`/`dict`/dataclass (those own their config). It also splats `*self.field_info.metadata` into the `Annotated` args so schema/serializer metadata is applied explicitly. The endpoint then serializes `custom_field` to `[1.0, 2.0, 3.0]` and OpenAPI shows the `WithJsonSchema` array schema.

**Acceptance tests.** `tests/test_arbitrary_types.py::test_get`, `::test_typeadapter` (Pydantic-only control), `::test_openapi_schema` (new file; `needs_pydanticv2`).

**Agent notes.** Cues: title names `arbitrary_types_allowed=True`; grep `TypeAdapter(` in `fastapi/_compat/v2.py`. Two coordinated edits in one file. Do not blanket-enable `arbitrary_types_allowed` on every adapter — propagate the real model config, and exclude nested `BaseModel`/`dict`/dataclass fields so their own configs are not overridden. Keep the Pydantic >= 2.12 warning suppression. Be aware the metadata splat introduced here later causes double-application with the trailing `FieldInfo` (follow-up fastapi_14512).


### Subcategory: dependency-injection (4 tasks)


Depends/Security declaration mechanics, resolution, scope-aware caching, and yield-dependency lifecycle (dual exit stacks, function/request scopes).


#### fastapi_14099 — Fix support for `StreamingResponse`s with dependencies with `yield` or `UploadFile`s, close after the response is done

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | dependency-scopes |
| Root-cause family | state-lifecycle |
| Patch size | +346/-131, 5 files |
| Agent difficulty | 5/5 (large) |

**Problem.** A `StreamingResponse` whose generator reads from a resource provided by a dependency with `yield` (e.g. a DB session) failed or streamed nothing, and `UploadFile`s were closed too early. Cleanup ran when the path operation returned, before the response body was actually sent.

**Root cause.** In `fastapi/routing.py::get_request_handler.app` (lines 247-362) the handler owns two stacks: `async with AsyncExitStack() as file_stack:` (line 249, with `file_stack.push_async_callback(body.close)` at 255) and `async with AsyncExitStack() as async_exit_stack:` (line 297). Both unwind at `return response` (line 362). But the route is wrapped by Starlette's `request_response` (imported lines 71-72, used at `APIRoute` line 576), whose contract is `response = await func(request)` then `await response(scope, receive, send)`. A `StreamingResponse` consumes its iterator only during that second await — after the yield-dependency exit code and file-close callbacks already ran. Trigger: any streaming endpoint iterating a dependency-provided session, or reading an `UploadFile` after handler return. `get_websocket_app` (line 373) has the same ownership pattern. Evidence: `async with AsyncExitStack() as async_exit_stack:` followed by `return response` inside the same function.

**Reference fix.** Ownership moves to the ASGI layer. A new `fastapi/middleware/asyncexitstack.py` provides `scope["fastapi_middleware_astack"]` for file closing; `FastAPI.build_middleware_stack` is overridden to insert it inside `ExceptionMiddleware` and inside all user middlewares (so contextvars copied by AnyIO task groups stay shared). `fastapi/routing.py` copies Starlette's `request_response`/`websocket_session`, opening `scope["fastapi_inner_astack"]` around both the handler call and `await response(...)`, so yield exit code runs after the body is fully sent. Handlers now fetch both stacks from scope. A `response_awaited` flag replaces the old "No response object was returned" guard with a "Response not awaited" `FastAPIError`. Background tasks now run before dependency cleanup.

**Acceptance tests.** New `tests/test_dependency_after_yield_streaming.py` (`test_stream_session`, `test_broken_session_stream_no_raise`), `test_dependency_after_yield_raise.py` (`test_catching`, `test_broken_raise`), `test_dependency_after_yield_websockets.py`; updated `test_dependency_contextmanager.py::test_background_tasks`/`test_sync_background_tasks` and `test_tutorial008c.py::test_fastapi_error`.

**Agent notes.** No file paths in the statement; the cue is the Starlette two-phase await contract. Do not just relocate the stack after `return response` — the response must be awaited inside the stack, which requires the wrapper. Preserve `except HTTPException` inside yield deps, keep middleware inside user middlewares for contextvars, and update (not revert) the changed background-task ordering assertions. New files include the middleware and two `docs_src` tutorials.


#### fastapi_14301 — Fix `Depends(func, scope='function')` for top level (parameterless) dependencies

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | dependency-scopes |
| Root-cause family | api-contract-violation |
| Patch size | +4/-1, 1 file |
| Agent difficulty | 1/5 (one-line) |

**Problem.** `scope="function"` is silently ignored for dependencies registered at router or app level (`dependencies=[Depends(...)]`). Their yield-teardown runs after the response is sent, exactly like the default `"request"` scope, contradicting the documented semantics (related issue #14296).

**Root cause.** A dropped keyword argument in `fastapi/dependencies/utils.py::get_parameterless_sub_dependant` (lines 124-133). This helper converts top-level `Depends` objects into sub-Dependants, but its call at lines 131-132 — `return get_dependant(path=path, call=depends.dependency, security_scopes=use_security_scopes)` — never forwards `depends.scope`. The resulting `Dependant.scope` is `None`, so `computed_scope` falls back to `"request"` for generator dependencies, and `solve_dependencies` enters them on the request-level exit stack (`fastapi_inner_astack`) that closes only after the response is sent. The parameter-bearing path does forward the scope (`scope=param_details.depends.scope`, line 284), which is why `scope="function"` works in annotated parameters but not here. Trigger: `include_router(..., dependencies=[Depends(gen_func, scope="function")])` or `FastAPI(dependencies=[...])` where `gen_func` runs code after `yield` — e.g. raising `HTTPException`, which then cannot affect the response.

**Reference fix.** Add `scope=depends.scope` to the `get_dependant` call (patch reformats it across lines). The sub-Dependant now carries `"function"`, is entered on `fastapi_function_astack`, and its post-yield code executes before the response is sent.

**Acceptance tests.** `tests/test_dependency_yield_scope.py::test_router_level_dep_scope_function` and `::test_app_level_dep_scope_function` (expect 503 `{"detail": "Exception after yield"}` from `raise_after_yield`); `::test_router_level_dep_scope_request` and `::test_app_level_dep_scope_request` (expect 200 `{"status": "ok"}` with `raise_server_exceptions=False`).

**Agent notes.** The PR body names the exact function and the missing attribute — localization is essentially free. Verify with `pytest tests/test_dependency_yield_scope.py` (all 11 tests, including the 7 pre-existing ones). Keep `security_scopes` intact; do not touch the already-correct parameter path. Understand the 503-vs-200 assertions via stack selection in `solve_dependencies` (`if sub_dependant.scope == "function": use_astack = function_astack`).


#### fastapi_14419 — Cache dependencies that don't use scopes and don't have sub-dependencies with scopes

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | dependency-scopes |
| Root-cause family | state-lifecycle |
| Patch size | +42/-20, 2 files |
| Agent difficulty | 4/5 (multi-file) |

**Problem.** A shared dependency that ignores security scopes (e.g. `get_db`) is executed multiple times per request when it is reached both directly and underneath `Security(..., scopes=[...])` branches, breaking FastAPI's call-once-per-request dependency caching contract (discussion #6024, PR #9790).

**Root cause.** Over-discriminating cache identity. `fastapi/dependencies/models.py::Dependant.cache_key` (lines 46-52) unconditionally embeds `tuple(sorted(set(self.security_scopes or [])))`. Meanwhile `fastapi/dependencies/utils.py::get_dependant` stores the *inherited* scope list on every Dependant (line 243, `security_scopes=security_scopes`) and propagates parent-plus-own scopes to each child (lines 278-288). So the same `get_db` callable reached directly carries `[]` but reached under `Security(get_user, scopes=["read"])` carries `["read"]`: keys `(get_db, (), "")` vs `(get_db, ("read",), "")` differ, the cache lookup in `solve_dependencies` misses, and `get_db` runs twice even though neither it nor any sub-dependency declares scopes or reads `SecurityScopes`. Trigger: any diamond where a scope-agnostic callable sits under differing ancestor scope sets. Evidence: `tuple(sorted(set(self.security_scopes or []))),` in `cache_key`.

**Reference fix.** Split `security_scopes` into `own_oauth_scopes` and `parent_oauth_scopes`; add `oauth_scopes` (ordered, deduped parent+own union) and a recursive `_uses_scopes` predicate (own scopes declared, a `SecurityScopes` parameter present, or any sub-dependant uses scopes). `cache_key` includes scopes **only** when `_uses_scopes` is true, otherwise `()`. `get_dependant` passes `current_scopes` into `SecurityRequirement` for every `SecurityBase` scheme and threads own/parent scopes separately; `solve_dependencies` injects `SecurityScopes(scopes=dependant.oauth_scopes)` and forwards `parent_oauth_scopes` for overrides. Now `get_db` hashes identically on all paths (called once) while `get_current_user`, which reads `SecurityScopes`, stays scope-sensitive (called once per distinct scope set).

**Acceptance tests.** `tests/test_security_scopes.py::test_security_scopes_dependency_called_once` (counter == 1); `tests/test_security_scopes_sub_dependency.py::test_security_scopes_sub_dependency_caching` (`get_db_session`==1, `get_current_user`==2, `get_user_me`==2, `get_user_items`==1, exact nested JSON with scopes `["items","me"]`).

**Agent notes.** The title states the rule precisely; the design work is the own/parent split plus the *recursive* uses-scopes predicate. Preserve scope order (no sets in `oauth_scopes`) — tests assert `["items","me"]`. Run the full security/OpenAPI suites: non-OAuth2 schemes now emit scopes in security requirements. `cache_key` also drives `get_flat_dependant` dedup, so keep its shape consistent. Avoid reintroducing the shared-list mutation fixed in #5624.


#### fastapi_5624 — Fix hierarchical security scope propagation

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | dependency-scopes |
| Root-cause family | state-lifecycle |
| Patch size | +3/-1, 1 file |
| Agent difficulty | 2/5 (one-line) |

**Problem.** Security scopes leak between sibling sub-dependencies. With nested `Security(...)` declarations, each sub-dependency should see only the ancestor scopes plus its own, but instead all siblings observe the union of every sibling's scopes (issue #5623).

**Root cause.** Aliasing plus in-place mutation in `fastapi/dependencies/utils.py::get_dependant` (lines 278-281). While iterating the parent's parameters, the code does `use_security_scopes = security_scopes or []` — when the parent was called with a non-empty list (e.g. `["scope3"]`), this is the *same list object*, not a copy — then `use_security_scopes.extend(param_details.depends.scopes)`. The first sibling (`dep1`, scopes `["scope1"]`) mutates the shared list to `["scope3","scope1"]`, and the recursive `get_dependant` stores that reference in the child `Dependant.security_scopes`. The second sibling (`dep2`, scopes `["scope2"]`) extends the same list again to `["scope3","scope1","scope2"]`. At request time `solve_dependencies` injects `SecurityScopes(scopes=dependant.security_scopes)` into both children, so both see `["scope3","scope1","scope2"]`. Trigger: any dependency invoked with non-empty scopes that has two or more `Security()` sub-dependencies with different scopes. Evidence: `use_security_scopes = security_scopes or []` and `use_security_scopes.extend(param_details.depends.scopes)`.

**Reference fix.** Replace the in-place extend with `use_security_scopes = use_security_scopes + list(param_details.depends.scopes)`, which builds a fresh list per branch. The parent's list is never mutated, each child stores an independent list, and `dep1`/`dep2` receive exactly `["scope3","scope1"]` / `["scope3","scope2"]`, so the new test's exact-JSON assertion passes.

**Acceptance tests.** `tests/test_security_scopes_dont_propagate.py::test_security_scopes_dont_propagate` (new file; asserts `{"dep1": ["scope3","scope1"], "dep2": ["scope3","scope2"]}`).

**Agent notes.** Localization cues: title words "hierarchical security scope propagation" and issue #5623 point straight at the scope-accumulation block in `get_dependant`. Verify with the new test plus the existing `tests/test_security_*.py` suite. Risks: creating the copy only at the recursive call is insufficient (children store references); preserve scope order (parents first); do not touch the superficially similar `.extend` in `get_parameterless_sub_dependant` (lines 128-131), which operates on a fresh local list and is correct.


### Subcategory: export-html-svg (2 tasks)


Console HTML/SVG export: document structure validity and font-family inheritance vs user-agent stylesheet.


#### rich_3043 — Fix the HTML export template

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | export-html-svg |
| Root-cause family | api-contract-violation |
| Patch size | +1/-1, 1 files |
| Agent difficulty | 1/5 (one-line) |

**Problem.** The HTML export template produces a structurally invalid document: `<head>...</head>` is emitted before the `<html>` start tag, so the head sits outside the root element (issue #3021).

**Root cause.** `_export_format.py::CONSOLE_HTML_FORMAT` (lines 1-18). The template order is `<!DOCTYPE html>` (line 2), `<head>` (line 3) ... `</head>` (line 12), then a stray `<html>` (line 13), then `<body>`. HTML requires `<html>` to wrap both `<head>` and `<body>`; here the head is emitted outside any html element. Browsers error-recover, but validators reject the document and strict consumers (HTML-to-image renderers, sanitizers, email clients) can misparse it or drop the `<style>` block, breaking exported colors/fonts. Because the defect is in the static template, every `export_html()` / `save_html()` output is malformed. Evidence: `<head>` at line 3 precedes `<html>` at line 13.

**Reference fix.** Move `<html>` to its own line immediately after `<!DOCTYPE html>` and delete the stray `<html>` after `</head>`, giving the valid order DOCTYPE → html → head → /head → body → /body → /html (net +1/-1). The test patch updates the byte-exact expected documents in the three export tests. The PR body also mentions a `.pre-commit-config.yaml` refresh, but that change is not in the reference patch and is not required.

**Acceptance tests.** `tests/test_console.py::test_export_html`, `::test_export_html_inline`, `::test_save_html`.

**Agent notes.** Strong cues: the title names the HTML export template, and `CONSOLE_HTML_FORMAT` is trivially greppable in `rich/_export_format.py`; the misordered tags are visible on inspection. The tests compare full HTML byte-for-byte, so place `<html>` exactly after the DOCTYPE with no other whitespace changes, and leave `CONSOLE_SVG_FORMAT` alone. Do not add the pre-commit config edit mentioned in the PR body — it is outside the reference patch. This base predates rich_3105: the `<code>` tag here does not yet carry `font-family:inherit` (a separate later fix).


#### rich_3105 — Fix #3104

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | export-html-svg |
| Root-cause family | other |
| Patch size | +1/-1, 1 files |
| Agent difficulty | 2/5 (one-line) |

**Problem.** HTML exported by `Console.export_html()` / `save_html()` displays in the browser's generic monospace font instead of the intended Menlo / DejaVu Sans Mono / consolas / Courier New stack, so exported terminal sessions look wrong (issue #3104).

**Root cause.** `_export_format.py::CONSOLE_HTML_FORMAT` (line 15) emits `<pre style="font-family:Menlo,'DejaVu Sans Mono',consolas,'Courier New',monospace"><code>{code}</code></pre>`. The font stack is declared only on `<pre>` and is meant to inherit into `<code>`. However, browser user-agent stylesheets set `font-family: monospace` directly on `<code>`; a directly matched UA declaration beats an inherited value even when the parent carries an inline style. The exported content therefore renders in the UA default monospace font, not Rich's terminal-like stack. The defect is in the static template, so every HTML export is affected. (Family "other": CSS UA-specificity defeating inheritance; the #3104 issue body is not in the local dataset, so the motivation is inferred from the template and CSS semantics.)

**Reference fix.** Add an explicit inline style to the code tag — `<code style="font-family:inherit">{code}</code>`. An author-level inline declaration overrides the UA rule, and `inherit` pulls the intended stack from `<pre>`. The test patch updates the byte-exact expected documents in three tests to include the attribute.

**Acceptance tests.** `tests/test_console.py::test_export_html`, `::test_export_html_inline`, `::test_save_html` (all compare full HTML strings).

**Agent notes.** Localization is weak — the statement is just "Fix #3104" with a bug-fix checklist; the agent must inspect `CONSOLE_HTML_FORMAT` and reason about why the font does not apply (UA stylesheet vs inheritance). The edit itself is trivial but must produce exactly `<code style="font-family:inherit">`: the tests are byte-exact, so do not reorder attributes, change quoting, or move the font declaration off `<pre>`. Leave `CONSOLE_SVG_FORMAT` untouched. Verify by running the three export tests in `tests/test_console.py`.


### Subcategory: header-parsing (1 tasks)


Response header parsing (Content-Type parameter/charset extraction and fallback).


#### requests_7309 — Fix malformed value parsing for Content-Type

| Field | Value |
|---|---|
| Repo | psf/requests |
| Kind | bugfix |
| Subcategory | header-parsing |
| Root-cause family | boundary-edge-case |
| Patch size | +6/-9, 1 file |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** A malformed Content-Type parameter without `=` (e.g. `text/html; charset`) crashes encoding detection with `AttributeError: 'bool' object has no attribute 'strip'` (issue #6646). RFC 1521 through 9110 require `=` in a parameter, so valueless tokens must be ignored.

**Root cause.** In `utils.py::_parse_content_type_header` (lines 517-525), every non-empty parameter starts as `key, value = param, True` (line 520) and is stored unconditionally via `params_dict[key.lower()] = value` (line 525), even when no `=` exists. For `text/html; charset` this yields `{"charset": True}`. The consumer `get_encoding_from_headers` (line 544) then runs `return params["charset"].strip("'\"")`, calling `.strip` on a bool — verified to raise AttributeError. Because `HTTPAdapter.build_response` calls `get_encoding_from_headers(response.headers)` while building every response, the crash aborts the request itself, not merely `.text` access. Trigger: any response whose Content-Type carries a valueless parameter token. The boolean sentinel is both a type-contract violation downstream and semantically wrong per the RFCs.

**Reference fix.** Rewrites the loop guard as `if param and (idx := param.find("=")) != -1:` so valueless tokens are skipped entirely (no key stored), with `items_to_strip` renamed to `strip_chars`. With `charset` absent, `get_encoding_from_headers` falls through to the `"text"` rule and returns `ISO-8859-1` for `text/html; charset`, matching the new test case. Well-formed parameters parse exactly as before (lowercased keys, quote/space stripping).

**Acceptance tests.** `tests/test_utils.py::test_get_encoding_from_headers` (new case `text/html; charset` → `ISO-8859-1`); `test_parse_dict_header` (4 cases updated to drop `"no_equals": True`); `test__parse_content_type_header` as regression.

**Agent notes.** PR names the function and the RFC rule — localization is direct; pure unit tests, no server. Fix the parser, not just the consumer: an isinstance guard in `get_encoding_from_headers` would leave the bogus `charset` key present and fail the ISO-8859-1 expectation. No sentinel of any kind may remain for valueless tokens. After the edit, the four base `test_parse_dict_header` cases fail until test_patch removes their `no_equals` expectations — expected inversion, not a regression.


### Subcategory: json-decoding (1 tasks)


Response JSON decoding infrastructure (JSONDecodeError pickling/__reduce__ for multiprocessing).


#### requests_6629 — Fix #6628 - JSONDecodeError are not deserializable

| Field | Value |
|---|---|
| Repo | psf/requests |
| Kind | bugfix |
| Subcategory | json-decoding |
| Root-cause family | api-contract-violation |
| Patch size | +10/-0, 1 file |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** `requests.exceptions.JSONDecodeError` instances cannot survive a pickle round-trip: `pickle.loads(pickle.dumps(err))` raises. In a process pool, a worker failing to decode an invalid JSON document crashes the entire pool because the exception cannot be deserialized in the parent.

**Root cause.** `src/requests/exceptions.py::JSONDecodeError` (lines 31-42) multiply inherits: `class JSONDecodeError(InvalidJSONError, CompatJSONDecodeError)`. The MRO runs through `RequestException -> IOError/OSError` *before* the JSON parent (`json`/`simplejson` `JSONDecodeError -> ValueError`). The dual `__init__` first runs `CompatJSONDecodeError.__init__(self, *args)` (setting `msg/doc/pos`, with `self.args` reduced to the formatted message), then `InvalidJSONError.__init__(self, *self.args, **kwargs)` re-initializes the OSError side with that single message. Pickle resolves `__reduce__` via the MRO and picks `OSError.__reduce__`, which serializes only `self.args` — one string. Unpickling then calls `JSONDecodeError(msg)`, but the JSON constructor requires `(msg, doc, pos)`, raising `TypeError`. Evidence: `CompatJSONDecodeError.__init__(self, *args)` followed by `InvalidJSONError.__init__(self, *self.args, **kwargs)`. Trigger: any cross-process transfer of the exception (ProcessPoolExecutor, multiprocessing).

**Reference fix.** Add an explicit `__reduce__` on the class returning `CompatJSONDecodeError.__reduce__(self)`. The JSON parent's reduce emits `(cls, (self.msg, self.doc, self.pos))`, so all three constructor arguments travel in the pickle stream and reconstruction succeeds with an identical `repr`. The hierarchy and `__init__` are untouched, and delegation works for both the stdlib `json` and `simplejson` backends selected in `compat.py`.

**Acceptance tests.** `tests/test_requests.py::test_json_decode_errors_are_serializable_deserializable` — builds `JSONDecodeError("Extra data", '<doc>', 36)`, round-trips it through pickle, and asserts `repr` equality (`pickle` is already imported at line 8 of the test module).

**Agent notes.** The statement names the class, the MRO, and `__reduce__` — localization is direct via `grep "class JSONDecodeError" src/requests/exceptions.py`. Verify with `pytest tests/test_requests.py -k serializable` plus `-k json` for regressions (offline). Do not reorder bases or alter the dual `__init__`; message formatting and `.doc` persistence are covered by neighboring tests. `compat.py` was not extracted here, but the `CompatJSONDecodeError` import at exceptions.py:9 plus the class body fully ground the analysis.


### Subcategory: live-progress (2 tasks)


Live/Progress lifecycle: render-height-gated teardown newlines and disable-guard symmetry between start/stop.


#### rich_3905 — Update progress.py

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | live-progress |
| Root-cause family | state-lifecycle |
| Patch size | +4/-3, 1 files |
| Agent difficulty | 1/5 (few-lines) |

**Problem.** A `Progress` created with `disable=True` still writes one stray blank line when the console is non-interactive (redirected output, CI logs). The display itself is suppressed, but teardown is not.

**Root cause.** Asymmetric lifecycle guards in `rich/progress.py`. `Progress.start` (lines 1168-1171) is guarded: `if not self.disable: self.live.start(refresh=True)`. `Progress.stop` (lines 1173-1177) has no guard — it unconditionally runs `self.live.stop()` (a no-op when Live never started) and then `if not self.console.is_interactive and not self.console.is_jupyter: self.console.print()`. That `print()` emits a bare `\n`. Trigger: `with Progress(console=<non-interactive>, disable=True): ...` — `__exit__` calls `stop()`, which writes the newline even though nothing was ever displayed. The pre-existing `test_no_output_if_progress_is_disabled` missed this because it uses `force_terminal=True`, so `is_interactive` is True and the `print()` branch is skipped; the bug only appears on the non-interactive path.

**Reference fix.** Wraps the whole body of `stop()` in `if not self.disable:`, making it symmetric with `start()`. When disabled, `stop()` is a complete no-op: no `live.stop()`, no trailing `console.print()`, zero bytes written. The new test builds `Console(file=io.StringIO(), force_interactive=False, ...)` with `Progress(disable=True)`, tracks three items, and asserts the captured output is exactly `""` — which now holds.

**Acceptance tests.** `tests/test_progress.py::test_no_output_if_progress_is_disabled_non_interactive` (new); regressions `test_no_output_if_progress_is_disabled` and `test_live_is_not_started_if_progress_is_disabled`.

**Agent notes.** The PR description literally prescribes the fix ("adds an `if not self.disable` to the `stop` function, symmetrically to the `start` function"), so localization is trivial: read `start()`/`stop()` side by side at lines 1168-1177. Verify with `pytest tests/test_progress.py`. Must-nots: do not remove the trailing newline for *enabled* progress on non-interactive consoles (it terminates the final progress line and other tests assert it), and do not disable `track()` iteration — disabled progress must still yield all values, which the new test checks.


#### rich_3934 — empty live

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | live-progress |
| Root-cause family | boundary-edge-case |
| Patch size | +17/-3, 2 files |
| Agent difficulty | 2/5 (multi-file) |

**Problem.** `Live.stop()` always writes a trailing newline on terminals, even when the live renderable produced zero lines — e.g. `with Live(Group(), transient=True): pass` leaves a spurious blank line (issue #3796).

**Root cause.** In `rich/live.py::Live.stop` (finally block, lines 166-177) the condition at lines 169-170 is `if not self._alt_screen and self.console.is_terminal: self.console.line()` — it assumes at least one line was drawn. For an empty `Group`, `LiveRender.__rich_console__` (`rich/live_render.py` lines 76-106) computes `lines = console.render_lines(...)` → `[]`, and `Segment.get_shape([])` returns `(0, 0)`, so `_shape` is set to a zero-height shape and nothing is yielded; if nothing was ever rendered, `_shape` stays `None` (line 31: `self._shape: Optional[Tuple[int, int]] = None`). In both cases `stop()` still emits `\n`. The height information exists in `LiveRender._shape` but is not exposed to `Live`, so the teardown cannot know the display was empty.

**Reference fix.** Adds a `LiveRender.last_render_height` property (`0` if `_shape is None` else `_shape[1]`) and extends the `stop()` condition with `and self._live_render.last_render_height`. Zero-height renders skip `console.line()`; normal renders keep the newline. The new test captures a `force_terminal` console around `Live(Group(), transient=True)` and asserts the exact byte string `\x1b[?25l\r\x1b[2K\x1b[?25h\r` with no `\n`: hide-cursor, final-refresh `position_cursor` for shape `(0,0)` (`\r\x1b[2K`), newline skipped, show-cursor, transient `restore_cursor` (`\r`). Base code inserts `\n` after `\x1b[2K` and fails.

**Acceptance tests.** `tests/test_live.py::test_live_empty` (new); regressions `test_live_screen`, `test_growing_display`, and the rest of `tests/test_live.py`.

**Agent notes.** The statement is only "empty live" — localize by grepping `console.line` in `rich/live.py` (single hit in `stop()`). The fix is small but spans two files: a read-only property plus one condition. Verify with `pytest tests/test_live.py`. Must-nots: do not suppress the newline for non-empty renders (other tests pin it), do not alter `position_cursor`/`restore_cursor` sequences (the expected capture string pins them), and handle both `_shape is None` and zero-height shapes.


### Subcategory: markdown-rendering (4 tasks)


Markdown element rendering: table cell accumulation/styling, empty-cell/partial-table guards, and the heading/rule/table design snapshot.


#### rich_3064 — fix for markdown table

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | markdown-rendering |
| Root-cause family | boundary-edge-case |
| Patch size | +8/-9, 1 files |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** Rendering a partial markdown table — a header row plus delimiter row with no body rows — crashes with `AssertionError` instead of drawing the header-only table (issue #3053).

**Root cause.** `rich/markdown.py::TableElement.__rich_console__` (lines 252-268) validates optional parse results with hard asserts: `assert self.header is not None` (line 257), `assert self.header.row is not None` (line 258), and `assert self.body is not None` (line 262). `TableElement.__init__` (lines 237-239) starts both `header` and `body` as `None`, and they are only populated by `on_child_close` when the parser actually emits thead/tbody children. For the repro `Markdown("| Simple | Table |\n| ------ | ----- ")`, markdown-it's table plugin emits `table_open`/`thead_open`/.../`table_close` but no `tbody` tokens, so `self.body` remains `None` and line 262 raises during rendering. The asserts treat a legitimately parseable edge-case input as an internal invariant violation.

**Reference fix.** The three asserts become conditional guards: `if self.header is not None and self.header.row is not None:` wraps the `add_column` loop and `if self.body is not None:` wraps the `add_row` loop. The `Table(box=box.SIMPLE_HEAVY)` is still yielded, so whatever parts exist are rendered — for the repro, a bold header row over a heavy rule with an empty body.

**Acceptance tests.** `tests/test_markdown.py::test_partial_table` (new) renders the minimal repro and compares the exact ANSI string; existing `test_markdown_table` guards against regressions for complete tables.

**Agent notes.** The PR title is terse, but running the new test produces an AssertionError whose traceback points straight at `rich/markdown.py:262` — localization is essentially free. Verify with `pytest tests/test_markdown.py`. Must-nots: keep `box.SIMPLE_HEAVY` (the snapshot expects the heavy rule and bold headers), do not insert placeholder body rows, and leave the `RuntimeError` for unknown children in `on_child_close` alone. The only design choice is guarding `header` and `header.row` together, exactly as the reference does.


#### rich_3130 — Fix markdown table rendering issue with inline styles/links

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | markdown-rendering |
| Root-cause family | state-lifecycle |
| Patch size | +5/-7, 1 files |
| Agent difficulty | 3/5 (few-lines) |

**Problem.** Markdown table cells that contain several inline-styled runs (emphasis, strong, strikethrough, hyperlinks) render only the last text fragment, and inline span styles are lost entirely (issue #3115). Even single-run cells mis-style their justification padding.

**Root cause.** `rich/markdown.py::TableDataElement.on_text` (lines 336-341) treats each parser text event as the whole cell: `self.content = Text(plain, justify=self.justify, style=context.style_stack.current)` is an assignment, not an accumulation. `MarkdownContext.on_text` (lines 498-507) dispatches one call per inline text token, so a cell like `*E.T.* ([Wikipedia article](url))` fires several times and each call destroys the previous fragment — only `)` would survive. The method also flattens via `plain = text.plain if isinstance(text, Text) else text`, discarding the Text's internal spans (italic/bold/strike/link), and applies the context style to the entire cell Text, which is why the old snapshot wraps padding in italic codes. The correct pattern already exists in the same file: `TextElement.on_text` (lines 107-108) appends (`self.text.append(text, context.current_style ...)`). A cosmetic typo at line 317, `token.attrs.get("style" "")`, relies on implicit string concatenation (`"style" + "" == "style"`); it is functionally harmless.

**Reference fix.** `__init__` now creates `self.content = Text("", justify=justify)` so justification lives on the accumulating Text; `on_text` converts str to Text, applies `text.stylize(context.current_style)`, and calls `self.content.append_text(text)`. All fragments and their spans survive, and padding added later by the Table renderer stays unstyled. The `"style" ""` typo is cleaned to `"style"`.

**Acceptance tests.** `tests/test_markdown.py::test_markdown_table` (updated snapshot: italic no longer covers padding), plus new `test_inline_styles_in_table` and `test_inline_styles_with_justification` (both regression tests for #3115, exact ANSI comparisons at width 100).

**Agent notes.** The PR body names the mechanism and the model method (`TextElement.on_text`), so localization is easy; the difficulty is byte-exact snapshot matching. Verify with `pytest tests/test_markdown.py -k "table or inline_styles"`. Must-nots: do not stylize the whole cell Text (padding would gain styles), do not set justify per fragment, do not touch `TableElement.__rich_console__`, and do not "fix" the unchanged `str(None)` behavior of the style lookup.


#### rich_3469 — fix superfluous space

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | markdown-rendering |
| Root-cause family | boundary-edge-case |
| Patch size | +1/-1, 1 files |
| Agent difficulty | 3/5 (one-line) |

**Problem.** A Markdown table containing empty cells renders with extra blank lines above it — one per empty cell (issue #3027). A fully populated table and the same table with empty cells should occupy the same number of lines.

**Root cause.** `markdown.py::Markdown.__rich_console__`, self-closing branch (lines 668-686). markdown-it wraps each cell's content in an `inline` container token; `Markdown._flatten_tokens` (lines 559-567) recurses only `if token.children and not (is_image or is_fence):` (line 564), so an empty cell's childless `inline` token passes through verbatim. It matches no special case and is absent from the `elements` map (lines 518-535), so it becomes an `UnknownElement` on the self-closing path. The parent `TableDataElement` has no `on_child_close` override (base returns True), so `should_render` is True, and `new_line` is True because the previous cell close executed `new_line = element.new_line` (line 686; class default True at line 31). The guard `if new_line:` (line 680) then yields a stray `Segment.line()` although `UnknownElement` renders nothing. These newlines accumulate in the stream before the table renders at `table_close`, giving N blank lines above the table for N empty cells.

**Reference fix.** Change the self-closing guard to `if new_line and node_type != "inline":` — bare inline containers (which only surface when empty) no longer emit a separator newline. The exiting branch (line 664) is untouched. The test patch also removes trailing double-space hardbreaks from the `MARKDOWN` fixture (trailing-whitespace cleanup) and updates `test_markdown_render`'s expected string so the former hardbreak renders as a softbreak space.

**Acceptance tests.** `tests/test_markdown.py::test_table_with_empty_cells` (new; asserts equal line counts vs a complete table) and `tests/test_markdown.py::test_markdown_render` (updated expected output).

**Agent notes.** Localization is weak ("superfluous space", #3027): reproduce with an empty-cell table, then inspect the token stream — the key insight is childless `inline` tokens becoming `UnknownElement`. Patch the self-closing branch (line 680), not the exiting branch (line 664). Do not change hardbreak/softbreak handling; the fixture edit is whitespace cleanup. Run the full `tests/test_markdown.py` suite: `test_markdown_render` compares a byte-exact ANSI/padded string, and table tests (`test_markdown_table`, `test_partial_table`, `test_inline_styles_in_table`) guard against regressions.


#### rich_4079 — Inline table code

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | markdown-rendering |
| Root-cause family | api-contract-violation |
| Patch size | +4/-3, 1 files |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** Inline code in Markdown table cells renders without syntax highlighting when `inline_code_lexer`/`inline_code_theme` are set: the monokai token colors are replaced by the generic current style (issue #4038). The same inline code in a paragraph highlights correctly.

**Root cause.** `rich/markdown.py::TableDataElement.on_text` (lines 333-336) does `text.stylize(context.current_style)` on every input, including pre-styled `Text`. For `code_inline`, `MarkdownContext.on_text` (lines 489-498) delivers `Text.assemble(highlight_text, style=current)` whose spans carry the Pygments token styles; the parser also pushes the `markdown.code` theme style for inline code (lines 658-662). `stylize` *appends* a full-range span after the token spans, and in rich's Text model later spans win when styles compose — so the current style overrides the monokai foregrounds/backgrounds. The correct contract is visible in `TextElement.on_text` (lines 100-101): apply `current_style` only to `str` inputs, append `Text` objects untouched. Trigger: a table cell containing backtick code with inline highlighting enabled.

**Reference fix.** Rewrites `TableDataElement.on_text` to mirror `TextElement`: `str` → `self.content.append(text, context.current_style)`; `Text` → `self.content.append_text(text)` unchanged (the base style was already attached by `Text.assemble`).

**Acceptance tests.** `tests/test_markdown.py::test_inline_code_in_table_cells` — renders a one-cell table with `` `print('hello');` `` (python/monokai) and asserts exact truecolor ANSI: token spans `38;2;248;248;242;48;2;39;40;34` etc. inside the cyan-bordered cell.

**Agent notes.** Diff the two `on_text` implementations in the same file — the fix pattern exists verbatim at line 100. Do not drop `current_style` for plain-string cells and do not touch `MarkdownContext.on_text`. `rich/text.py` was not extracted; span-precedence semantics are standard rich behavior, confirmed by the test's expected output. Verify with the named test plus full `tests/test_markdown.py`; the snapshot also pins surrounding table styling, so avoid incidental rendering changes.


### Subcategory: markup-escaping (1 tasks)


Console markup escape()/parse backslash-parity correctness.


#### rich_3063 — Fix escaping trailing backslash

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | markup-escaping |
| Root-cause family | regex-escaping |
| Patch size | +3/-1, 1 files |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** `rich.markup.escape()` does not escape a trailing lone backslash. When the escaped text is wrapped in markup — e.g. `f"[red]{escape('C:\')}[/red]"` for a Windows path — the trailing backslash escapes the closing tag, which then renders as literal `[/red]` and leaves the style unclosed (issue #2987).

**Root cause.** `rich/markup.py::escape` (lines 48-67) substitutes with the pattern `(\*)(\[[a-z#/@][^[]*?])`, doubling backslash runs only when they immediately precede a tag-like bracket sequence; a backslash at end-of-string has no following `[`, so `markup = _escape(escape_backslashes, markup)` (line 66) returns it unchanged. Downstream, `RE_TAGS` (lines 12-15) captures any backslash run before a tag and `_parse` (lines 85-95) applies `divmod(len(escapes), 2)`: an odd count marks the tag as escaped literal text. Verified with stdlib `re`: `escape("C:\")` returns `"C:\"` unchanged, and in `"[red]C:\[/red]"` the closing tag matches with a one-backslash escape run, so it is emitted literally instead of closing the style. Trigger: any escaped value ending in an odd backslash run that is concatenated before a tag.

**Reference fix.** After the substitution, adds: if the result `endswith("\") and not endswith("\\")`, append one more backslash. The even run no longer escapes a following tag: the fixed wrap `"[red]C:\\[/red]"` parses `[/red]` as a real closing tag, giving `Text.plain == "C:\"` with `spans == [Span(0, 3, "red")]`. A stray blank line in the `__main__` block is also removed (cosmetic).

**Acceptance tests.** `tests/test_markup.py::test_escape_backslash_end` — asserts `escape("C:\") == "C:\\"`, the wrapped markup string, and the `Text.from_markup` plain/span results above.

**Agent notes.** Title plus issue #2987 localize to `escape()` in `rich/markup.py`. Verify with `pytest tests/test_markup.py` (existing `test_escape`, `test_escape_escape`, `test_render_escape` must stay green). The subtlety is parity: even backslash runs are already self-escaping, so a naive "double every trailing run" or "always append" breaks existing tests — the `not endswith("\\")` guard is load-bearing. The reference handles only a single trailing backslash (odd runs of 3+ stay imperfect); match it rather than over-engineering. Do not modify `RE_TAGS` or `_parse` — the parser is correct; the escape producer is at fault.


### Subcategory: openapi-schema-generation (6 tasks)


OpenAPI/JSON-Schema construction, model naming/ref resolution, schema caching, and docs-UI serving/escaping (fastapi/openapi, _compat schema generators).


#### fastapi_13207 — Fix OpenAPI schema support for computed fields when using separate_input_output_schemas=False

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | openapi-schema-generation |
| Root-cause family | schema-generation-logic |
| Patch size | +12/-2, 1 files |
| Agent difficulty | 3/5 (few-lines) |

**Problem.** When an app runs with `FastAPI(separate_input_output_schemas=False)`, Pydantic v2 `@computed_field` properties disappear from the OpenAPI output schema. A `Rectangle` model with `width`, `length` and a computed `area` serves `{"width":3,"length":4,"area":12}` at runtime, but its schema under that flag lists only `width` and `length`. With the default flag (`True`) the computed field is present, so the schema is flag-dependent.

**Root cause.** In `fastapi/_compat/v2.py`, both `get_schema_from_model_field` (lines 183-185) and `get_definitions` (lines 207-209) compute `override_mode = None if separate_input_output_schemas else "validation"`. When the flag is `False`, `override_mode="validation"` is used both to select the cached schema (`field_mapping[(field, override_mode or field.mode)]`, line 187) and to generate definitions (`inputs = [(field, override_mode or field.mode, field._type_adapter.core_schema)]`, lines 240-243). Pydantic v2 computed fields are read-only and exist **only in the serialization core schema**, never in validation mode. Forcing validation mode therefore strips `area` from the generated `Rectangle` schema. With the default `True`, `override_mode=None` lets `field.mode` (`serialization` for response models) apply, so computed fields survive — explaining the discrepancy. Trigger: pydantic v2, the flag set to `False`, and a response model containing a computed field.

**Reference fix.** Detects computed fields and relaxes the forced override when any exist. `get_schema_from_model_field` reads `computed_fields = field._type_adapter.core_schema.get("schema", {}).get("computed_fields", [])` and sets `override_mode = None if (separate_input_output_schemas or len(computed_fields) > 0) else "validation"`. `get_definitions` computes `has_computed_fields = any(... for field in fields)` and uses `None if (separate_input_output_schemas or has_computed_fields) else "validation"`. Affected models keep serialization mode (computed fields included); models without computed fields retain the single-schema behavior.

**Acceptance tests.** `tests/test_computed_fields.py::test_get` and `::test_openapi_schema`. The test parametrizes the `client` fixture indirectly over `[True, False]`, so both must pass for **both** flag values, asserting `area` present with `readOnly: True` and `required: ["width","length","area"]` (paths `/` and `/responses`).

**Agent notes.** The title names the exact flag and symptom; the existing test file already encodes the expected `Rectangle` schema, and grep `override_mode`/`separate_input_output_schemas` lands on both functions. The fix must touch **both** sites consistently — changing only one desynchronizes the cached `field_mapping` from the generated definitions. Note the asymmetry: per-field check in `get_schema_from_model_field` vs `any()` across all fields in `get_definitions`. Do not force `override_mode=None` unconditionally (that defeats the flag for ordinary models). Read `core_schema` defensively. Verify both parametrizations under pydantic v2.


#### fastapi_14246 — Fix separation of schemas with nested models introduced in 0.119.0

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | openapi-schema-generation |
| Root-cause family | schema-generation-logic |
| Patch size | +24/-4, 1 files |
| Agent difficulty | 3/5 (few-lines) |

**Problem.** A regression introduced in 0.119.0 makes OpenAPI incorrectly separate nested models into `-Input`/`-Output` variants. A response model with nested sub-models (e.g. `Message` → `MessageOutput` → `MessageEvent` → `MessageEventType`) should yield single unsuffixed schemas, but the buggy code produces spurious output splits (e.g. `SubItem-Output`) and references pointing at them.

**Root cause.** In `fastapi/_compat/v2.py::get_definitions` (base lines 210-214), `flat_models = get_flat_models_from_fields(fields, known_models=set())` collects every nested model from **all** fields regardless of mode, then wraps each as `ModelField(field_info=FieldInfo(annotation=model), name=model.__name__)` **without passing `mode`**. `ModelField.mode` defaults to `"validation"` (line 66). These flat fields feed `GenerateJsonSchema` through `inputs = [(field, override_mode or field.mode, ...)]` (lines 220-223); with `separate_input_output_schemas=True`, `override_mode=None`, so each nested model is generated in validation mode. A nested model reached only through a serialization/response field is thus seeded as a *validation* definition while its parent references it in serialization mode, so Pydantic emits an unnecessary `-Output` variant and misnames the refs. Trigger: pydantic v2, default flag, a response model with output-only nested sub-models.

**Reference fix.** Partitions the top-level fields into `validation_fields` and `serialization_fields` by `field.mode`, runs `get_flat_models_from_fields` separately on each, and builds `flat_validation_model_fields` with `mode="validation"` and `flat_serialization_model_fields` with `mode="serialization"`, then concatenates them. Nested models now inherit the mode of their discovery context, so the generator emits one correctly-modeled definition and only splits `-Input`/`-Output` when genuinely needed. The `unique_flat_model_fields` dedup by `type_` is preserved.

**Acceptance tests.** New `tests/test_no_schema_split.py::test_create_message` and `::test_openapi_schema` (single unsuffixed `Message`/`MessageOutput`/`MessageEvent`/`MessageEventType` schemas, `pydantic_snapshot` covering v1/v2 enum differences); updated `tests/test_pydantic_v1_v2_multifile/test_multifile.py::test_openapi_schema` (drops `SubItem-Output`, refs now point to the qualified `tests__...__SubItem` name).

**Agent notes.** Single-function fix but subtle: the defect is the implicit `mode="validation"` default applied to nested models irrespective of context. Grep `get_flat_models_from_fields`/`flat_model_fields` to localize; line 66 explains the wrong-mode seeding. This base commit predates fastapi_13207 — this task introduces the validation/serialization partition that 13207 later extends for computed fields. Set the mode for **both** groups, keep the dedup, and do not break genuine splits for models used in both modes or the `False` flag path. Verify both the new no-split test and the updated multifile snapshot (pydantic v2).


#### fastapi_14349 — Fix handling of JSON Schema attributes named "$ref"

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | openapi-schema-generation |
| Root-cause family | schema-generation-logic |
| Patch size | +6/-6, 1 files |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** A Pydantic v2 model that has a field aliased to the literal name `$ref` (e.g. `ref: str = Field(validation_alias="$ref", serialization_alias="$ref")`) makes `GET /openapi.json` crash with a 500, even though the endpoint itself returns data correctly. `$ref` is a legal JSON property name but collides with the JSON Schema reference keyword.

**Root cause.** In `fastapi/_compat/v2.py::_replace_refs` (lines 257-290) the function recursively walks every dict in the generated schema (recursion at lines 272-276). At line 264 it matches `if key == "$ref":` and unconditionally runs `ref_name = schema["$ref"].split("/")[-1]` (line 265), assuming the value is a reference string such as `#/components/schemas/Model`. For a model with a `$ref`-aliased field, Pydantic emits `{"properties": {"$ref": {"type": "string", "title": "$Ref"}}}`; when the recursion reaches that `properties` dict, `schema["$ref"]` is a **dict** (the property sub-schema), so `.split("/")` raises `AttributeError: 'dict' object has no attribute 'split'`. The crash occurs inside `get_definitions` → `_remap_definitions_and_field_mappings` (lines 249-253, 319-334), i.e. during OpenAPI assembly. Trigger: pydantic v2 only, a `$ref`-aliased field in any schema-bearing model, then a request to `/openapi.json`.

**Reference fix.** Wraps the remapping branch in `value = schema["$ref"]; if isinstance(value, str):` so only string-valued `$ref` keys are treated as references and remapped through `old_name_to_new_name_map`. Non-string `$ref` values (property sub-schemas) are left untouched — they are already preserved by the initial `deepcopy(schema)`. The redundant `else` branch that re-assigned the identical value is dropped. Legitimate reference remapping is unaffected.

**Acceptance tests.** New `tests/test_schema_ref_pydantic_v2.py` (both gated `@needs_pydanticv2`): `test_get` asserts the endpoint round-trips `{"$ref": "some-ref"}`; `test_openapi_schema` asserts an `inline_snapshot` of the full document with `components.schemas.ModelWithRef.properties.$ref` intact and the top-level response `$ref` correctly pointing at `ModelWithRef`.

**Agent notes.** The statement is terse (no traceback or file path), but the keyword `$ref` plus "JSON Schema attributes" localizes quickly: grep `"$ref"` + `.split` lands on `_replace_refs`. The file lives in the pydantic-v2 compat layer, yet the defect is schema-generation logic, not a version shim. Apply the minimal `isinstance(value, str)` guard; do **not** skip all `$ref` keys (that breaks Input/Output name remapping) and do not strip/rename `$ref` properties. Verify both new tests under pydantic v2 plus the existing schema-ref suites.


#### fastapi_14361 — Avoid accessing non-existing "$ref" key for Pydantic v2 compat remapping

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | openapi-schema-generation |
| Root-cause family | schema-generation-logic |
| Patch size | +1/-1, 1 files |
| Agent difficulty | 2/5 (one-line) |

**Problem.** With Pydantic v2, a named type whose generated JSON schema is emitted *inline* rather than as a `$ref` — canonically an empty Enum such as `class OtherRole(str, Enum): ...` — makes `GET /openapi.json` raise `KeyError: '$ref'` and return 500, while the endpoint itself still serves data.

**Root cause.** In `fastapi/_compat/v2.py::_remap_definitions_and_field_mappings` the first loop (lines 305-313) builds `old_name_to_new_name_map`. For each field it reads `model = field_key[0].type_` and skips only `if model not in model_name_map:` (line 307), then assumes the field schema is a reference: `old_name = schema["$ref"].split("/")[-1]` (line 310). That assumption is false for named types Pydantic v2 renders inline: an empty Enum produces `{"enum": [], "title": "OtherRole"}` with **no** `$ref` key. Because `OtherRole` is a named model it *is* in `model_name_map`, so the line-307 guard does not skip it and line 310 raises `KeyError: '$ref'`, aborting `get_definitions` and OpenAPI assembly. Trigger: pydantic v2 + Python 3.10+ (the regression uses a PEP 604 `PlatformRole | OtherRole` union), an inline-schema named type in a response/body model, then a request to `/openapi.json`.

**Reference fix.** Extends the guard to `if model not in model_name_map or "$ref" not in schema:`. Fields whose schema has no top-level `$ref` have nothing to remap, so they are skipped and pass through unchanged; reference-bearing models remap exactly as before.

**Acceptance tests.** New `tests/test_schema_compat_pydantic_v2.py` (gated `@needs_py310` + `@needs_pydanticv2`): `test_get` round-trips a `User` whose `role` is `PlatformRole | OtherRole` (empty Enum); `test_openapi_schema` asserts an `inline_snapshot` where `OtherRole` appears inline as `{"enum": [], "title": "OtherRole"}` inside the `anyOf`, with no crash.

**Agent notes.** The title gives the missing key (`$ref`), the layer (Pydantic v2 compat) and the operation (remapping); grep `schema["$ref"]` in `fastapi/_compat/v2.py` lands on line 310. The body is only "cf Discussion #14265" with no repro, so the agent must infer the empty-Enum/inline-schema scenario to write a regression. This is a sibling of fastapi_14349 in the same file: that fix guards the `$ref` **value type** in `_replace_refs`, this one guards `$ref` **key presence** here — keep them distinct. Apply the one-line guard; do not substitute `schema.get("$ref", "")` and split (that would create a bogus empty-name mapping). Verify under pydantic v2 / Python 3.10+.


#### fastapi_14463 — Fix OpenAPI duplication of anyOf refs for app-level responses with specified content and model as Union

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | openapi-schema-generation |
| Root-cause family | state-lifecycle |
| Patch size | +2/-1, 1 files |
| Agent difficulty | 1/5 (few-lines) |

**Problem.** Defining app-level `responses={500: {"model": ModelA | ModelB, "content": {...examples...}}}` makes the generated OpenAPI schema accumulate duplicate `$ref` entries in `anyOf` — two routes yield 4 refs, three routes 6, and so on. The schema stays valid but bloats linearly with route count, and the response `title` of the last route leaks into all routes.

**Root cause.** In `fastapi/openapi/utils.py::get_openapi_path` (line 380) the per-route working copy is shallow: `process_response = additional_response.copy()`. The nested `content` dict is therefore the *same object* stored in `route.responses`, which for app-level responses is shared by every route. When the response has a model, lines 401-406 run `additional_schema = (process_response.setdefault("content", {}).setdefault(media_type, {}).setdefault("schema", {}))` followed by `deep_dict_update(additional_schema, additional_field_schema)`. Because `content` already exists, `setdefault` descends into the shared dict and writes the generated schema back into `route.responses`. `deep_dict_update` (in `fastapi/utils.py`, not extracted; per PR context it extends list values) concatenates `anyOf` lists, so route 2 finds route 1's refs already present and appends its own again. Trigger: app/router-level response config that specifies **both** `model` (Union) and `content`; without a user-supplied `content` key, `setdefault("content", {})` creates a fresh dict inside the shallow copy and nothing leaks — which is why the bug only appears with custom content/examples.

**Reference fix.** Adds `import copy` and changes line 380 to `process_response = copy.deepcopy(additional_response)`. Each route now mutates a fully private copy, so the shared config never accumulates generated schemas; every route's `anyOf` starts empty and gets exactly its own refs and title.

**Acceptance tests.** New file `tests/test_additional_responses_union_duplicate_anyof.py::test_openapi_schema` — two routes sharing an app-level Union+content 500 response; asserts the full `openapi.json` equals an exact dict with exactly two `$ref`s per route and correct per-route titles.

**Agent notes.** The PR body already contains a complete root-cause walkthrough naming `fastapi/openapi/utils.py` L376-L416 and `deep_dict_update` — localization is essentially free. Apply `copy.deepcopy` at line 380; do **not** "fix" this by deduplicating `anyOf` inside `deep_dict_update` (that would mask the shared-state leak and could corrupt legitimate repeated refs). Verify with the new regression test plus `tests/test_additional_responses*.py`. Risk: deepcopy assumes response configs are plain copyable dicts, which the reference fix accepts.


#### fastapi_14791 — Update ValidationError schema to include input and ctx

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | openapi-schema-generation |
| Root-cause family | api-contract-violation |
| Patch size | +2/-0, 1 files |
| Agent difficulty | 1/5 (few-lines) |

**Problem.** The OpenAPI `ValidationError` schema (used for 422 responses) declared only `loc`, `msg`, and `type`. Pydantic v2's actual validation errors also carry `input` (the offending value) and `ctx` (an optional context dict), so the documented error contract under-described the real runtime payload.

**Root cause.** `fastapi/openapi/utils.py::validation_error_definition` (lines 41-54) is a static, hand-maintained literal dict. Its `properties` (lines 44-52) contain only `loc`, `msg`, `type`, with `"required": ["loc", "msg", "type"]` (line 53). This dict is injected into the OpenAPI components for every route that can produce a 422. Pydantic v2's `ValidationError.errors()` entries additionally include `input` (any type) and `ctx` (a context dict, e.g. constraint parameters), but the static definition was never updated for v2. The result is a documentation/contract mismatch — the generated schema omits fields that real 422 responses contain — not a runtime crash. Trigger: any app with a validated parameter/body, then `GET /openapi.json`.

**Reference fix.** Adds two optional properties to `validation_error_definition.properties`: `"input": {"title": "Input"}` (no type constraint — any JSON value) and `"ctx": {"title": "Context", "type": "object"}`. The `required` list stays `["loc", "msg", "type"]`, so the new fields are optional. All affected OpenAPI snapshot tests are updated to include them.

**Acceptance tests.** 29 test files updated, all asserting full OpenAPI snapshots that now include `ValidationError.properties.input` and `.ctx`. Representative: `tests/test_additional_properties.py::test_openapi_schema`, `tests/test_multi_body_errors.py::test_openapi_schema`, `tests/test_multi_query_errors.py::test_openapi_schema`, `tests/test_openapi_separate_input_output_schemas.py::test_openapi_schema` and `::test_openapi_schema_no_separate`, `tests/test_application.py::test_openapi_schema`.

**Agent notes.** Trivial and fully specified: the PR body names the file (`fastapi/openapi/utils.py`), the symbol (`validation_error_definition`), and the exact two properties; grep `validation_error_definition` lands on the dict. Add the two entries and leave `required` unchanged — `input`/`ctx` must be **optional**. Match shapes exactly: `input` has no `type` key, `ctx` is `{"title":"Context","type":"object"}`. The bulk of the work is the mechanical snapshot update across 29 files (key ordering varies but dict equality is order-independent). Do not touch `loc`/`msg`/`type` or `HTTPValidationError`. Verify by running the affected OpenAPI snapshot tests; no runtime behavior changes.


### Subcategory: pretty-repr-rendering (3 tasks)


Introspection-driven object rendering (rich.inspect/pretty/repr): signature __qualname__ guards, sentinel identity checks, dataclass field traversal.


#### rich_3006 — Fixed issue with custom classes (fixes #2875)

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | pretty-repr-rendering |
| Root-cause family | api-contract-violation |
| Patch size | +1/-1, 1 files |
| Agent difficulty | 1/5 (one-line) |

**Problem.** `@rich.repr.auto` generates a wrong repr for classes whose `__init__` defaults are objects with a custom `__eq__` that compares equal to `inspect.Parameter.empty`: those defaulted parameters are emitted as bare positional values, losing the `key=value` form (issue #2875).

**Root cause.** `rich/repr.py::auto_rich_repr` (lines 68-86) walks `inspect.signature(self.__init__).parameters` and at line 79 decides `if param.default == param.empty:` whether a parameter lacks a default. `Parameter.empty` is a sentinel that must be tested by identity; `==` instead dispatches to the default object's `__eq__`. The test's `StupidClass.__eq__` returns `True` when `other is Parameter.empty`, so the condition holds and the parameter takes the positional path `yield getattr(self, param.name)` (line 80) instead of the defaulted path `yield param.name, getattr(self, param.name), param.default` (line 82). Verified: such an object satisfies `== empty` but not `is empty`. A default whose `__eq__` raises would instead surface as `ReprError` via the except block (lines 83-86). Trigger: any auto-repr class with a sentinel-equal (or equality-hostile) default value.

**Reference fix.** Changes line 79 to `if param.default is param.empty:`. Identity comparison never invokes user `__eq__`, so defaulted parameters are always yielded as `(name, value, default)` and render as `key=value`. The extended test builds `Bird("penguin", ["fish"], another=StupidClass(9), extinct=NotStupid())` with defaults `another=StupidClass(2)`, `extinct=NotStupid()` and asserts the full keyed repr.

**Acceptance tests.** `tests/test_repr.py::test_rich_repr_auto` — extended with `StupidClass`, `NotStupid`, and `Bird`; existing `Egg`/`BrokenEgg`/angular cases must stay green.

**Agent notes.** The PR body quotes the exact faulty expression (`== Parameters.empty`), so localization is trivial. Verify with `pytest tests/test_repr.py`. Critical must-not: do not also "fix" the default-suppression comparison in `auto_repr` (line 58, `default[0] == value`) — it intentionally uses equality to hide unchanged defaults, and converting it to `is` would change existing behavior. This is the classic sentinel rule: `is` for sentinels, `==` for values. Subcategory `pretty-repr-rendering` is proposed new (nothing in the suggested rich list covers repr/pretty generation).


#### rich_3472 — fix for missing field in dataclass

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | pretty-repr-rendering |
| Root-cause family | boundary-edge-case |
| Patch size | +3/-1, 1 files |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** Pretty-printing a dataclass instance that lacks a declared field — `item: int = field(init=False)` with no default, never assigned — raises `AttributeError` instead of rendering. Rich should omit the absent field and print `BadDataclass()` (issue #3417).

**Root cause.** `rich/pretty.py::traverse._traverse` (nested def at line 621), dataclass branch (lines 763-792): the generator `field for field in fields(obj) if field.repr` (lines 783-785) iterates `dataclasses.fields()`, which reads class-level `__dataclass_fields__` metadata, then line 786 does `_traverse(getattr(obj, field.name), ...)`. An `init=False` field without a default is never set by `__init__`, so it exists in the metadata but not on the instance, and `getattr` raises `AttributeError` that propagates out of `pretty_repr`/`console.print`. Verified: `fields(BadDataclass())` lists `item` with `repr=True` while `hasattr(obj, "item")` is False and `getattr` raises. The attrs branch (lines 735-747) already guards `getattr` with try/except; the dataclass branch has no guard. Trigger: any dataclass with an uninitialized `init=False` field (or a since-deleted attribute).

**Reference fix.** Extends the filter to `if field.repr and hasattr(obj, field.name)`, skipping absent fields. With zero children, `Node.iter_tokens` yields `Node.empty` (lines 443-444) — set to `"BadDataclass()"` at line 780 — so the captured output is exactly `"BadDataclass()\n"`, which the new regression test asserts.

**Acceptance tests.** `tests/test_pretty.py::test_dataclass_no_attribute` (new); existing dataclass tests (`test_pretty_dataclass`, `test_empty_dataclass`, `test_max_depth_dataclass`, `test_reference_cycle_dataclass`) must stay green.

**Agent notes.** Title plus issue #3417 point at dataclass handling in `rich/pretty.py`. Verify with `pytest tests/test_pretty.py`. Difficulty 2: the key insight is that `dataclasses.fields()` is class-level metadata and does not guarantee instance attributes, and that `Node.empty` already handles the no-children case. Must-nots: do not render the exception object (the attrs branch does, but this test expects omission); do not filter on `field.init` (init=True fields can also be deleted); keep the `field.repr` condition. Subcategory `pretty-repr-rendering` is proposed new (shared with rich_3006).


#### rich_3894 — Handle unusual __qualname__ in inspect

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | inspect-rendering |
| Root-cause family | type-introspection |
| Patch size | +4/-0, 1 files |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** `rich.inspect` crashes on objects whose `__qualname__` is not a `str`. The reported case: a class with `__qualname__` in `__slots__` decorated with `@functools.lru_cache`, where the attribute resolves to a `member_descriptor` instead of a name string.

**Root cause.** `rich/_inspect.py::Inspect._get_signature` (lines 82-119) computes `qualname = name or getattr(obj, "__qualname__", name)` at line 103, assuming the result is always a `str`. For the lru_cache-wrapped slotted class, functools' wrapper forwards the slot descriptor, so `getattr` succeeds but returns a `member_descriptor`. Verified locally: `getattr(Klaas, "__qualname__")` is a `member_descriptor` (not `str`), while `Klaas.__name__` is still `"Klaas"`. The unchecked value flows into `Text.assemble((qualname, "inspect.callable"), ...)` (lines 113-117), whose append path requires `str`/`Text` and raises `TypeError`, so `inspect(Klaas)` and `inspect(Klaas, all=True)` crash. (`rich/text.py` was not extracted; the exact raise site inside `Text.assemble` is inferred from its API contract — the non-str `qualname` at line 103 is confirmed.)

**Reference fix.** Adds a type guard after line 103: if `qualname` is not a `str`, fall back to `getattr(obj, "__name__", name)`; if that is also not a `str`, use the passed-in `name`. A valid string always reaches `Text.assemble`. The new test defines `@lru_cache class Klass` with `__slots__ = ("__qualname__",)` and asserts `inspect(Klass)` raises nothing.

**Acceptance tests.** `tests/test_inspect.py::test_qualname_in_slots` (new); existing inspect tests (`test_render`, `test_inspect_module_with_class`, docstring special-character cases) must stay green.

**Agent notes.** The PR body contains a complete minimal repro and names the `__qualname__` -> `__name__` fallback, so both localization and fix shape are given. Verify with `pytest tests/test_inspect.py`. Difficulty 2 reflects reproducing the unusual lru_cache+`__slots__` descriptor interaction, not edit size. Must-nots: do not coerce with `str(qualname)` (renders an ugly descriptor repr); preserve the fallback order `__qualname__` (if str) -> `__name__` (if str) -> `name`; leave the `signature()`/`getfile()` handling untouched. Subcategory `inspect-rendering` is proposed new — `rich.inspect` is distinct from traceback rendering.


### Subcategory: prompt-input (1 tasks)


Interactive Prompt.ask behavior: choice validation/case-insensitive matching and markup-safe error rendering.


#### rich_3882 — Fix raw markup printed on prompt errors sometimes

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | prompt-input |
| Root-cause family | api-contract-violation |
| Patch size | +1/-1, 1 files |
| Agent difficulty | 1/5 (one-line) |

**Problem.** When a prompt is used with a `Console` that has markup disabled globally, validation error messages print their literal style tags, e.g. `[prompt.invalid]Please enter Y or N`, instead of styled plain text.

**Root cause.** `rich/prompt.py::PromptBase.on_validate_error` (lines 258-265) ends with `self.console.print(error)` (line 265) and passes no `markup` argument. `InvalidResponse.__rich__` (lines 26-27) returns the raw message string, and the built-in messages embed console markup — `Confirm.validate_error_message = "[prompt.invalid]Please enter Y or N"` (line 350), plus `validate_error_message`/`illegal_choice_message` (lines 46-49). `Console.print` resolves the markup flag from the console when the argument is omitted, so with `Console(markup=False)` the tag is emitted verbatim. The default global console has markup enabled, which is why the leak happens only "sometimes" — with custom consoles. (`rich/console.py` was not extracted; flag-resolution semantics are inferred from the PR description and existing tests that already expect tag-free output on a default console.) Trigger: any `*.ask(..., console=Console(markup=False))` session with an invalid response.

**Reference fix.** Changes the call to `self.console.print(error, markup=True)`. The explicit per-call override forces tag parsing regardless of the console's global setting, consuming `[prompt.invalid]` as a style and printing only the human-readable text. The new test feeds `"foo\nNO\ny"` to `Confirm.ask` on a `markup=False` console and asserts the exact output `continue [y/n] (y): Please enter Y or N` twice, then the final prompt — which only passes when the tag is parsed away.

**Acceptance tests.** `tests/test_prompt.py::test_prompt_confirm_markup` (new); existing `test_prompt_confirm_*` and `test_prompt_str*` must stay green.

**Agent notes.** The PR body names `PromptBase.on_validate_error()` and issue #3881, so localization is direct. Verify with `pytest tests/test_prompt.py`; the expected output is asserted byte-for-byte on a `StringIO` console. Must-nots: do not strip tags from the message constants (they carry the `prompt.invalid` style on normal consoles), do not mutate the console's global markup flag, and do not add `markup=True` to the prompt rendering itself (the prompt is already a `Text` object).


### Subcategory: proxy-auth-config (2 tasks)


Environment/host-derived connection configuration: no_proxy bypass matching and netrc credential selection.


#### requests_7205 — Fix empty netrc entry usage

| Field | Value |
|---|---|
| Repo | psf/requests |
| Kind | bugfix |
| Subcategory | auth-netrc |
| Root-cause family | boundary-edge-case |
| Patch size | +1/-1, 1 file |
| Agent difficulty | 1/5 (one-line) |

**Problem.** On Python 3.11+, a netrc `default` entry with no username, account, or password no longer raises `NetrcParseError`; the stdlib returns `('', '', '')`. Requests treats that as usable credentials and sends an empty Basic `Authorization` header (base64 of `:`) for any host that falls back to the default entry.

**Root cause.** In `src/requests/utils.py::get_netrc_auth` (lines 232-237), the result of `netrc(netrc_path).authenticators(host)` is guarded only by truthiness: `if _netrc:` (line 234). A 3-tuple of empty strings is still truthy, so the guard passes; `login_i = 0 if _netrc[0] else 1` (line 236) selects index 1, and the function returns `('', '')`, which the session encodes into `Authorization: Basic Og==`. Before Python 3.11 the stdlib raised `NetrcParseError` for such entries and the `except (NetrcParseError, OSError)` at lines 238-242 swallowed it, so the missing emptiness check was latent; the stdlib contract change exposed it. Trigger: Python 3.11+, a `.netrc`/`$NETRC` file with a bare `default` line, and a request to a host without an explicit `machine` entry. Evidence: `if _netrc:` and `login_i = 0 if _netrc[0] else 1`.

**Reference fix.** The guard becomes `if _netrc and any(_netrc):`. `any(('', '', ''))` is `False`, so all-empty entries fall through and the function returns `None` (no auth header), restoring pre-3.11 behavior. Entries with an empty login but a populated account/password still work via the `login_i` fallback. The new test passes because `get_netrc_auth("http://httpbin.org/")` now returns `None` for a file containing only a matching machine plus a bare `default`.

**Acceptance tests.** `tests/test_utils.py::TestGetNetrcAuth::test_empty_default_credentials_ignored` (writes a tmp `.netrc` with `machine example.com login user password pass` plus a bare `default`, monkeypatches `NETRC`, asserts `auth is None`).

**Agent notes.** Localization is trivial: "netrc" in the statement greps straight to `get_netrc_auth`. Verify with `pytest tests/test_utils.py -k TestGetNetrcAuth` — fully offline. Do not raise on empty entries (must silently return `None`), do not break the account-only fallback, and do not wrap stdlib `netrc`. The PR's `auth=('', '')` remark is user-side advice, not a code change.


#### requests_7427 — Port bpo-39057 to Requests

| Field | Value |
|---|---|
| Repo | psf/requests |
| Kind | bugfix |
| Subcategory | proxy-bypass (proposed) |
| Root-cause family | boundary-edge-case |
| Patch size | +4/-2, 1 file |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** `no_proxy` matching uses raw `endswith`, so entries bypass the proxy for unrelated domains that merely share a suffix (`localhost` matches `prelocalhost`), while leading-dot entries (`.d.o.t`) fail to match the apex domain itself. The PR ports CPython bpo-39057 to enforce domain-boundary matching (issue #4795).

**Root cause.** In `utils.py::should_bypass_proxies` (hostname branch, lines 849-857), each entry is tested with `if hostname.endswith(host) or host_with_port.endswith(host):` (line 854). `endswith` is an unanchored string-suffix test with no domain-label boundary: `prelocalhost` satisfies `endswith("localhost")` and is wrongly bypassed, while the apex `d.o.t` fails `endswith(".d.o.t")` and is wrongly proxied. CPython and curl converged on the contract "entry matches the host exactly, or a suffix starting at a dot boundary; a leading dot means this domain plus subdomains"; Requests' original implementation predated that consensus. Trigger: any `no_proxy` list where one entry is a proper suffix of an unrelated host, or a dotted entry queried against its apex.

**Reference fix.** Per entry: `host = host.lstrip(".")`; return True on exact `hostname == host or host_with_port == host`; then `host = "." + host` and keep the `endswith` checks. This makes `prelocalhost` no longer match `localhost`, `.d.o.t` match both `d.o.t` and `foo.d.o.t`, and `newdomain.com:1234` match only that exact host:port or same-port subdomains (not `:1235`). The two new failing-at-base cases (`prelocalhost` → False, `d.o.t` → True) pass, and the existing `no_proxy` suite stays green.

**Acceptance tests.** `tests/test_utils.py::test_should_bypass_proxies_no_proxy_domain_boundary` (new, 9 parametrized cases) and the existing `test_should_bypass_proxies_no_proxy` regression suite.

**Agent notes.** Cues: "bpo-39057", `no_proxy`, "domain boundaries"; grep `endswith` in `utils.py`. Pure unit tests — no server needed. The tests fully specify semantics, so no external research is required. A naive dot-suffix-only fix breaks the apex case — the exact-match step after `lstrip(".")` is essential. Do not touch the IPv4/CIDR branch or the `proxy_bypass` fallback. Subcategory `proxy-bypass` is newly proposed (no proxy bucket existed in the suggested taxonomy).


### Subcategory: redirect-history (1 tasks)


Redirect chain history bookkeeping (self-referential history / reference cycles).


#### requests_7328 — Prevent Response self-reference in redirect history

| Field | Value |
|---|---|
| Repo | psf/requests |
| Kind | bugfix |
| Subcategory | redirect-history |
| Root-cause family | state-lifecycle |
| Patch size | +1/-2, 1 file |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** While following redirects, each intermediate `Response` gets a history slice that includes itself, creating self-referential lists from the second hop onward — unintuitive semantics and reference cycles that delay cleanup of response objects (issue #6295).

**Root cause.** In `sessions.py::resolve_redirects` (lines 181-184) the loop runs `hist.append(resp)` and then `resp.history = hist[1:]`. Iteration 1 gives `r0.history = []` (fine), but iteration 2 gives `hist = [r0, r1]` and `r1.history = [r1]` — the response contains itself; iteration 3 gives `r2.history = [r1, r2]`, and so on. Every intermediate response holds a list referencing itself (a cycle), and the growing suffix slices cause the "reference explosion" the PR describes, delaying garbage collection. The bug is masked in the final response because `Session.send` (lines 731-737) rebuilds history via `history.insert(0, r); r = history.pop(); r.history = history`. Trigger: any request following two or more redirects; only intermediate responses expose the defect. The `len(resp.history) >= self.max_redirects` check (line 191) sees k-1 entries at iteration k, an invariant the fix must preserve.

**Reference fix.** Assign before appending: `resp.history = hist[:]` then `hist.append(resp)`. Each response's history is now exactly the preceding responses, never itself; lengths at the `max_redirects` check are unchanged (k-1), so `TooManyRedirects` behavior is identical. The PR deliberately keeps intermediate assignments — removing them outright is a deferred breaking change. The new test walks a 3-hop redirect asserting `resp not in resp.history` and `resp.history == r.history[:i]`, which the prefix assignment satisfies.

**Acceptance tests.** `tests/test_requests.py::TestRequests::test_redirect_history_no_self_reference` (new; httpbin `/redirect/3`), plus the existing redirect/`TooManyRedirects` suite as regression.

**Agent notes.** Cues: PR title and #6295; grep `hist` in `sessions.py`. Verify with pytest-httpbin. Key invariant: `hist[:]`-before-append and the old `hist[1:]`-after-append have equal lengths — do not switch to `hist[1:]` before the append (undercounts and breaks the redirect limit). Do not delete intermediate history assignment or touch `Session.send`'s shuffle.


### Subcategory: regex-highlighting (2 tasks)


ReprHighlighter regex pattern correctness (URL character-class coverage for @ and ~).


#### rich_3067 — Allow tilde in URL (fixes #3057)

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | regex-highlighting |
| Root-cause family | boundary-edge-case |
| Patch size | +1/-1, 1 files |
| Agent difficulty | 1/5 (one-line) |

**Problem.** `ReprHighlighter` truncates URL highlighting at `~`, so URLs with tilde path segments (classic user-home pages like `http://example.org/~folder`) are only partially styled as `repr.url`.

**Root cause.** `rich/highlighter.py::ReprHighlighter.highlights` (line 101) defines the URL pattern with an explicit character allow-list: ``r"(?P<url>(file|https|http|ws|wss)://[-0-9a-zA-Z$_+!`(),.?/;:&=%#]*)"``. The class omits `~`, a valid URL path character. The greedy `*` stops at the first character outside the class, so the match ends right before the tilde. Verified with stdlib `re`: on `" http://example.org/~folder "` the base pattern matches only `http://example.org/` (18 chars) instead of the full 26-char URL, leaving `~folder` unstyled. Trigger: any printed repr/log text containing a URL with a `~` path segment (issue #3057). This base predates the later `@` addition (rich_3454); the class here ends at `#`.

**Reference fix.** Appends `~` to the character class, yielding ``[-0-9a-zA-Z$_+!`(),.?/;:&=%#~]*``. The greedy match now covers tilde segments, producing `Span(1, 27, "repr.url")` for the tilde test case. The test patch also pins two neighboring behaviors that already work at base: `#anchor` URLs and query-string URLs (which additionally produce `repr.attrib_name`/`repr.attrib_value` spans from the pre-existing attrib pattern).

**Acceptance tests.** `tests/test_highlighter.py::test_highlight_regex` — new params: `" http://example.org/index.html#anchor "` -> `Span(1, 37, "repr.url")`; query-param URL -> `Span(31, 37, "repr.attrib_name")`, `Span(38, 44, "repr.attrib_value")`, `Span(1, 44, "repr.url")`; `" http://example.org/~folder "` -> `Span(1, 27, "repr.url")`.

**Agent notes.** Title "Allow tilde in URL" plus issue #3057 localize the fix to the single url pattern in `rich/highlighter.py`. Verify with `pytest tests/test_highlighter.py`. Risks: append `~` at the end of the class (placement next to `-` could form an unintended range); do not modify the attrib or path patterns to satisfy the query-param case — those spans already match at base. One-character edit, no design work.


#### rich_3454 — Fix [BUG] @ breaks highlighting in hyperlink #3327

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | regex-highlighting |
| Root-cause family | boundary-edge-case |
| Patch size | +1/-1, 1 files |
| Agent difficulty | 1/5 (one-line) |

**Problem.** `ReprHighlighter` only partially highlights URLs that contain `@` (e.g. YouTube channel handles such as `https://www.youtube.com/@LinusTechTips`): the `repr.url` span stops at the `@` and the handle is left unstyled.

**Root cause.** `rich/highlighter.py::ReprHighlighter.highlights` (line 101) defines the URL pattern as an explicit character allow-list: ``r"(?P<url>(file|https|http|ws|wss)://[-0-9a-zA-Z$_+!`(),.?/;:&=%#~]*)"``. The class omits `@`, a valid URL character (userinfo and handle-style paths). `RegexHighlighter.highlight` feeds this pattern to `Text.highlight_regex`; the greedy `*` consumes only class members, so the match terminates at the first `@`. Verified with stdlib `re`: on the YouTube URL the base pattern matches just `https://www.youtube.com/` (24 chars) instead of the full 38-char URL. Trigger: any printed repr/log line containing a URL with `@`. The base already includes `~` (from PR #3067); `@` is the only missing character.

**Reference fix.** Appends `@` to the class, yielding ``[-0-9a-zA-Z$_+!`(),.?/;:&=%#~@]*``. The greedy match now spans the entire URL, producing one `repr.url` span over all 38 characters, which is exactly what the new parametrized test case asserts.

**Acceptance tests.** `tests/test_highlighter.py::test_highlight_regex` — new param `("https://www.youtube.com/@LinusTechTips", [Span(0, 38, "repr.url")])`; all pre-existing URL/tilde/anchor/query params must still pass.

**Agent notes.** Localization is handed to the agent: the PR description names `rich.highlighter:ReprHighlighter` and the url regex, and the title cites issue #3327. Verification: `pytest tests/test_highlighter.py`. Risks: append `@` at the end of the class — inserting it next to `-` could accidentally form a character range; do not touch the other highlight alternatives or span ordering. One-character edit; no design work needed.


### Subcategory: request-parsing (10 tasks)


Extraction and validation of request parameters/body: multidict query/header/form handling, field alias semantics, type guards, and Content-Type policy.


#### fastapi_11194 — Fix validation error when `File` is declared after `Form` parameter

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | request-parsing |
| Root-cause family | type-introspection |
| Patch size | +3/-4, 1 file |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** An endpoint accepting both `File` and `Form` parameters responded with 422 unless the `File` parameter was declared first. Parameter order in the signature should not affect request handling.

**Root cause.** In `fastapi/dependencies/utils.py::_extract_form_body` (lines 870-910), the code captures `first_field = body_fields[0]` and `first_field_info = first_field.field_info` (875-876), then loops over all body fields. The branches that convert an `UploadFile` to bytes (`value = await value.read()`, 885) and that read a sequence of `UploadFile`s (901-904) are guarded by `isinstance(first_field_info, params.File)` (881 and 888). When a `Form` parameter is declared first, `first_field_info` is a `Form`, so both `File` branches are skipped for every field — including the real `File` fields. Their `UploadFile` values are never read into bytes and reach validation as `UploadFile` objects, yielding 422. With `File` first the check passes and it accidentally works. The type introspection is bound to the wrong subject (the first field rather than the current field). Trigger: any multipart endpoint with `Form` preceding `File` (single `bytes` or `List[bytes]`).

**Reference fix.** Drop the `first_field`/`first_field_info` capture; set `field_info = field.field_info` inside the loop and change both guards to `isinstance(field_info, params.File)`. Each field is handled by its own type, so `UploadFile`→bytes conversion runs for `File` fields regardless of declaration order. +3/-4 in one file.

**Acceptance tests.** New `tests/test_file_and_form_order_issue_9116.py::test_file_form_order` (parametrized `/file_before_form`, `/file_after_form`) and `::test_file_list_form_order` (`/file_list_before_form`, `/file_list_after_form`) — both orders must return 200 with correct `file_content(s)` and `city`.

**Agent notes.** The statement gives the exact symptom (discussion #9116); localize via `_extract_form_body` and the `first_field_info` variable. Check each field's own `field_info`, preserve the bytes-sequence branch and the trailing copy of remaining body keys, and leave single-ModelForm/embed handling in `request_body_to_args` untouched. Verify with the new regression file plus existing Form/File tests.


#### fastapi_13537 — Fix support for form values with empty strings interpreted as missing (`None` if that's the default), for compatibility with HTML forms

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | request-parsing |
| Root-cause family | boundary-edge-case |
| Patch size | +2/-1, 1 files |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** Regression from PR #12134 (closes #13533): submitting an empty string for an optional `Form` field with default `None` — exactly what HTML forms do for empty inputs — returns 422 instead of using the `None` default, for both urlencoded and multipart bodies.

**Root cause.** Two passes in `fastapi/dependencies/utils.py` disagree about what "processed" means. `_get_multidict_value` (lines 731-743) treats an empty-string Form value as absent (`and value == ""`) and returns the field default, i.e. `None`. In `_extract_form_body`, line 903 records only non-None results (`if value is not None:` → `values[field.alias] = value`), so a `None` default leaves no trace in `values`. The complement loop added by #12134 (lines 905-907) then uses `if key not in values:` to decide what is extra — and since `age` is missing from `values`, it re-adds the raw `""` from the request. Pydantic then fails to parse `""` as `Optional[int]` (int_parsing) and the request 422s. Trigger: `age: Optional[int] = Form(None)` with `data={"age": ""}`. The values dict conflates "absent" with "default is None" and cannot act as a processed-marker.

**Reference fix.** Build an explicit set of declared aliases, `field_aliases = {field.alias for field in body_fields}`, and change the complement condition to `if key not in field_aliases:`. Declared fields are never re-added regardless of their extracted value, while undeclared keys still flow through for `extra="allow"` models. This mirrors the `processed_keys` pattern already used in `request_params_to_args`, as the PR notes. The empty-string→default semantics of `_get_multidict_value` are deliberately preserved.

**Acceptance tests.** New file `tests/test_form_default.py`: `::test_form_default_url_encoded` (POST `age=""` → 200, body `null`) and `::test_form_default_multi_part` (same with an optional `File` field → `{"file": None, "age": None}`).

**Agent notes.** The PR body contains the full mechanism and points at both functions, so localization is given. Use `field.alias` (values are keyed by alias at line 904), not `field.name`. This base predates #14303 — the loop still uses `.items()`; leave that alone, the multi-value loss is a separate task. Verify with the new test file plus `test_forms_single_model.py` and multipart suites to confirm required-field errors and extra-param complementing still behave. Do not "fix" `_get_multidict_value`'s empty-string handling; it is intentional HTML-form compatibility.


#### fastapi_14297 — Fix optional sequence handling in `serialize sequence value` with Pydantic V2

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | request-parsing |
| Root-cause family | type-introspection |
| Patch size | +7/-0, 1 file |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** `files: Optional[List[bytes]] = File(None)` with a multipart upload raises `TypeError: issubclass() arg 1 must be a class` (different message on Python 3.14, same cause). The statement includes a full repro and a permalink to the faulty line.

**Root cause.** `fastapi/_compat/v2.py::serialize_sequence_value` (lines 372-375): `origin_type = get_origin(field.field_info.annotation) or field.field_info.annotation` followed immediately by `assert issubclass(origin_type, shared.sequence_types)`. For `Optional[List[bytes]]` the origin is `typing.Union` — not a class — so `issubclass` raises. The function assumes a bare sequence annotation and never unwraps the Optional. Trigger path: `is_bytes_sequence_field()` accepts nonable bytes sequences, so `_extract_form_body` (in `fastapi/dependencies/utils.py`, not extracted here) reads each `UploadFile` and calls `serialize_sequence_value(field, results)` to coerce the list of bytes into the declared sequence type; any upload to such an endpoint hits the assertion.

**Reference fix.** Inserts a Union unwrap before the assertion: when `origin_type is Union`, iterate `get_args(annotation)`, skip `type(None)`, and set `origin_type = get_origin(union_arg) or union_arg` for the first non-None member, then break. `List[bytes]` resolves to `list`, the assertion passes, and `sequence_annotation_to_type[list](value)` returns the list. Both `Union[List[str], None]` and `Union[None, List[str]]` orders work, and the no-files case still returns the default.

**Acceptance tests.** `tests/test_compat.py::test_serialize_sequence_value_with_optional_list`, `::test_serialize_sequence_value_with_none_first_in_union`; `tests/test_optional_file_list.py::test_optional_bytes_list`, `::test_optional_bytes_list_no_files` (new file).

**Agent notes.** Exceptional localization: exact error string, file permalink (v2.py#L374), and an explicit fix description in the statement. Grep `def serialize_sequence_value`. Skip NoneType rather than taking `args[0]` (None can come first). The reference patch handles only `typing.Union`; the PEP 604 `UnionType` gap is the follow-up fastapi_14430 — covering both here is harmless but match the acceptance tests. Verify with `pytest tests/test_compat.py -k serialize_sequence_value tests/test_optional_file_list.py`.


#### fastapi_14303 — Fix parsing extra `Form` parameter list

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | request-parsing |
| Root-cause family | api-contract-violation |
| Patch size | +6/-2, 1 files |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** With a `Form()` parameter declared as a Pydantic model using `extra="allow"`, an extra form field sent with multiple values (repeated key) reaches the model as only its last value: `param2=456&param2=789` becomes `"789"` instead of `["456", "789"]`.

**Root cause.** In `fastapi/dependencies/utils.py::_extract_form_body` (lines 905-908), after declared fields are extracted, undeclared keys are complemented with `for key, value in received_body.items():` followed by `values[key] = value` (guarded by `if key not in field_aliases:`). Starlette's `FormData` is an `ImmutableMultiDict`, and `.items()` yields only one pair per key — the last value — so repeated extra values are silently discarded before Pydantic validation. Trigger: a POST (urlencoded or multipart) to a model-bound `Form()` endpoint with `extra="allow"` where an undeclared key appears two or more times. The `field_aliases` guard (added by sibling PR #13537, already present at this base) prevents re-adding declared fields but does nothing about multi-value loss.

**Reference fix.** Iterate unique keys (`for key in received_body.keys():`) and read all values with `received_body.getlist(key)`: store the scalar when `len(param_values) == 1`, otherwise store the whole list. This keeps the established convention — single value → string, repeated values → list of strings — which the PR explicitly chose over the always-list alternative. Declared fields remain untouched because the `field_aliases` check is preserved.

**Acceptance tests.** `tests/test_forms_single_model.py::test_extra_param_single` (single extra stays a scalar) and `::test_extra_param_list` (repeated extra becomes `["456", "789"]`), using a new `FormModelExtraAllow` model and `/form-extra-allow/` route.

**Agent notes.** The PR body links the exact lines and even supplies the replacement code, so localization is trivial; the work is placing it in `_extract_form_body` and keeping the scalar-for-single convention. The analogous Query/Header/Cookie defect is a separate task (#14356) in `request_params_to_args` — do not conflate them. Verify with the full `test_forms_single_model.py` plus other form/multipart suites. Do not weaken the `field_aliases` guard (it encodes the #13537 empty-string fix) and do not switch extras to always-list, which `test_extra_param_single` forbids.


#### fastapi_14356 — Fix parsing extra non-body parameter list

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | request-parsing |
| Root-cause family | api-contract-violation |
| Patch size | +9/-2, 1 files |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** Sibling of #14303 for non-body parameters: with `Query()` or `Header()` bound to a Pydantic model using `extra="allow"`, an extra key sent with multiple values reaches the model as only its last value (`param2=456&param2=789` → `"789"` instead of `["456", "789"]`).

**Root cause.** In `fastapi/dependencies/utils.py::request_params_to_args` (lines 794-796), after declared fields are extracted and their aliases/names recorded in `processed_keys`, the complement loop runs `for key, value in received_params.items():` and assigns `params_to_process[key] = value` for unprocessed keys. `QueryParams` and `Headers` are Starlette `ImmutableMultiDict` subclasses whose `.items()` yields only the last value per repeated key, so earlier values of extra parameters are dropped before model validation. Trigger: a GET to a model-bound `Query()`/`Header()` endpoint with `extra="allow"` and a repeated undeclared key (duplicate query params or header lines). Cookies arrive as a plain dict with last-value semantics per the cookie spec and must stay that way.

**Reference fix.** Iterate `received_params.keys()`; when the mapping exposes `getlist` (query/headers), read all values and store the scalar if exactly one, else the full list; otherwise fall back to `received_params.get(key)` (the cookie path). This preserves single-value→scalar, multi-value→list, and cookie last-value behavior, consistent with the convention chosen in #14303.

**Acceptance tests.** New file `tests/test_query_cookie_header_model_extra_params.py`: `test_query_pass_extra_list`, `test_query_pass_extra_single`, `test_header_pass_extra_list`, `test_header_pass_extra_single`, `test_cookie_pass_extra_list` (asserts cookies keep `"789"`). Also `tests/test_tutorial/test_header_param_models/test_tutorial003.py::test_header_param_model_no_underscore`, whose expected extra `x-tag` changes from `"two"` to `["one", "two"]`.

**Agent notes.** Localization: the PR cites #14303 and the same lossy-`.items()` mechanism; grep `processed_keys` to land in the right function. The capability guard matters — calling `getlist` unconditionally crashes on cookie dicts; the reference uses `hasattr(received_params, "getlist")` (later bases use an `isinstance` check; either passes). Keep `processed_keys.add(field.name)` (line 792) intact. Verify with the new test file, the header-param-model tutorials, and query/header suites. Do not switch to always-list semantics and do not alter cookie handling.


#### fastapi_14360 — Fix Query\Header\Cookie parameter model alias

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | param-validation |
| Root-cause family | api-contract-violation |
| Patch size | +1/-2, 1 file |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** When a Query/Header/Cookie parameter is a Pydantic model with an aliased field (`param: str = Field(alias="param_alias")`), sending the value by alias wrongly 422s with "Field required", and sending it by name produces a 422 whose `input` omits the extra parameter. The statement describes both defects explicitly.

**Root cause.** `fastapi/dependencies/utils.py::request_params_to_args` (lines 774-803). For a single non-embedded model parameter, fields are extracted from the model and values read by alias via `_get_multidict_value`. But the loop stores `params_to_process[field.name] = value` (line 790) — keyed by `param`, while the model validates by alias `param_alias` and finds nothing → false "Field required". Additionally `processed_keys.add(field.name)` (line 792) marks the field name as processed, so the extra-keys loop (lines 794-803) skips a by-name `?param=value` and it never reaches `params_to_process`; the resulting 422 `input` is `{}` instead of `{"param": "value"}`. Trigger: any Query/Header/Cookie model parameter with `alias != name`.

**Reference fix.** One key change and one deletion: `params_to_process[field.alias] = value` and remove `processed_keys.add(field.name)` (keeping `processed_keys.add(alias or field.alias)`). Validation now finds the value under the alias, and unprocessed by-name keys flow into the model input and appear in error details. `field.alias` falls back to `field.name` when no alias is set, so non-aliased models are unaffected.

**Acceptance tests.** `tests/test_request_param_model_by_alias.py::test_query_model_with_alias`, `::test_header_model_with_alias`, `::test_cookie_model_with_alias` (200 path) and `::test_query_model_with_alias_by_name`, `::test_header_model_with_alias_by_name`, `::test_cookie_model_with_alias_by_name` (422 + `input` assertions, Pydantic v2) — new file.

**Agent notes.** The statement names the internal symbols (`values`, `processed_keys`, `field.name`, alias); grep `processed_keys` in `fastapi/dependencies/utils.py`. Fix both symptoms — changing only the storage key leaves the error-`input` assertions failing. Preserve the header underscore-conversion logic (the `alias` variable) above the changed lines. This base uses `field.alias`; do not introduce `get_validation_alias` (that appears in later bases). Verify with the new test file plus existing param-model/header tests.


#### fastapi_14371 — Fix parameter aliases

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | param-validation |
| Root-cause family | type-introspection |
| Patch size | +46/-16, 4 files |
| Agent difficulty | 4/5 (multi-file) |

**Problem.** FastAPI ignored Pydantic v2 `validation_alias` (and `serialization_alias`) on request parameters and body fields, always using `field.alias`. A parameter declared with a distinct `validation_alias` was parsed from the wrong request key (422 missing or wrong value) and documented under the wrong OpenAPI name.

**Root cause.** Pydantic v2 separates `alias`, `validation_alias` (input), and `serialization_alias` (output), but FastAPI's input path only read `field.alias`. In `fastapi/dependencies/utils.py`: `_get_multidict_value` does `alias = alias or field.alias` (755); `request_params_to_args` builds the header alias from `field.alias` (812-816), stores `params_to_process[field.alias]` (819) and error `loc = (field_info.in_.value, field.alias)` (850); body code uses `values[field.alias]` (939) and `body_to_process.get(field.alias)`. `fastapi/openapi/utils.py::_get_openapi_operation_parameters` sets `name = param.alias` (144). The v2 `ModelField` wrapper exposes only `alias` (`_compat/v2.py` 109-112) and titles schemas with `field.alias.title()` (251) regardless of mode; `params.py` passes the aliases to `FieldInfo` but never defaults them to `alias`. So an explicit `validation_alias` was never consulted for input. Trigger: `Annotated[str, Query(validation_alias="p_val_alias")]` or a body-model `Field(validation_alias=...)`. The `xfail`-marked tests in `tests/test_request_params/` encoded this known failure.

**Reference fix.** Add `get_validation_alias(field)` (`validation_alias or alias`) and route every input-side lookup through it (multidict, header underscore conversion, processed keys, error loc, body get/values). Add `validation_alias`/`serialization_alias` properties to the v2 wrapper and a mode-aware `field_alias` for schema titles. OpenAPI uses `name = get_validation_alias(param)`. `params.py` defaults `serialization_alias`/`validation_alias` to `alias` when unset (alias-only backward compat). Only string `validation_alias` is supported.

**Acceptance tests.** `tests/test_request_params/` (23 files, ~192 `xfail` lines removed), e.g. `test_query/test_required_str.py::test_required_validation_alias_by_validation_alias`, `::test_required_alias_and_validation_alias_by_validation_alias`, `test_header/test_required_str.py::test_required_validation_alias_schema`, `test_body/test_list.py::test_required_list_validation_alias_by_name`.

**Agent notes.** Small delta but spread across 4 files; the task is finding every input-side `field.alias` that must become `get_validation_alias`, plus the mode-aware title and `params.py` defaults. The `test_patch` (mostly `xfail` removal) is the acceptance spec. Keep alias-only behavior unchanged; compare the resolved alias to `field.name` for header underscores; do not implement `AliasPath`/`AliasChoices` (deferred). Related to fastapi_14358.


#### fastapi_14430 — Fix optional sequence handling with new union syntax from Python 3.10

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | request-parsing |
| Root-cause family | boundary-edge-case |
| Patch size | +2/-2, 1 file |
| Agent difficulty | 1/5 (one-line) |

**Problem.** `serialize_sequence_value()` handles optional sequences written as `Union[List[T], None]` but still crashes for the PEP 604 pipe syntax `list[str] | None`. The statement notes that PR #14297 "is only taking one union type into account".

**Root cause.** `fastapi/_compat/v2.py::serialize_sequence_value` (lines 382-392). The base already contains the #14297 unwrap, but its guard is `if origin_type is Union:  # Handle optional sequences` (line 384). For `list[str] | None`, `get_origin()` returns `types.UnionType`, not `typing.Union`, so the branch is skipped and `assert issubclass(origin_type, shared.sequence_types)` (line 391) receives a union object instead of a class → `TypeError: issubclass() arg 1 must be a class`. Trigger: Python 3.10+ pipe-union optional sequence on a `File()`/`Form()` field, hit via `_extract_form_body` when uploaded files are read and converted.

**Reference fix.** Imports `UnionType` from `fastapi.types` and widens the guard to `if origin_type is Union or origin_type is UnionType:`, reusing the existing loop that skips `NoneType` and takes the first non-None member's origin. Both union spellings now unwrap to `list`, the assertion passes, and the value is returned as a list.

**Acceptance tests.** `tests/test_compat.py::test_serialize_sequence_value_with_optional_list_pipe_union` (added; `needs_pydanticv2` + `needs_py310`). Existing `test_serialize_sequence_value_with_optional_list` and `::test_serialize_sequence_value_with_none_first_in_union` must stay green.

**Agent notes.** Near-trivial localization: the statement points at the exact prior PR, whose code is already in the base — grep `origin_type is Union` in `fastapi/_compat/v2.py`. Use the `fastapi.types.UnionType` compat alias rather than `types.UnionType` directly (the codebase still supports Python 3.8/3.9 where `types.UnionType` does not exist). Do not reorder the None-skipping loop. Verify with `pytest tests/test_compat.py -k serialize_sequence_value` on Python 3.10+.


#### fastapi_14616 — Fix using `Json[list[str]]` type (issue #10997)

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | request-parsing |
| Root-cause family | type-introspection |
| Patch size | +10/-2, 1 file |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** `Form()`/`Query()`/`Header()`/`Cookie()` fields annotated `Json[list[str]]` fail with `TypeError: JSON input should be string, bytes or bytearray`: FastAPI reads the value with `getlist()`, wrapping the single JSON string in a list before Pydantic's `Json` validator sees it (issue #10997).

**Root cause.** `fastapi/dependencies/utils.py::_get_multidict_value` (lines 729-750). Pydantic's `Json[T]` is `Annotated[T, Json()]`; `FieldInfo` absorbs the `Json` marker into `.metadata` and keeps `.annotation = list[str]`. `is_sequence_field(field)` inspects only that unwrapped annotation, returns True, and the branch `if is_sequence_field(field) and isinstance(values, (ImmutableMultiDict, Headers)):` (line 733) executes `value = values.getlist(alias)` (line 734) — producing `['["abc", "def"]']`. The `Json` validator expects one raw str/bytes/bytearray, not a list, and raises. Trigger: any `Json[<sequence>]` parameter on a multidict-backed transport (form, query, headers, cookies).

**Reference fix.** Adds `_is_json_field(field)` = `any(type(item) is Json for item in field.field_info.metadata)` (importing `Json` from pydantic) and guards the branch with `(not _is_json_field(field)) and is_sequence_field(field) and ...`. Json fields fall through to `values.get(alias, None)`, so the validator receives the raw JSON string and parses it into `list[str]`. All four transports then echo `["abc", "def"]`.

**Acceptance tests.** `tests/test_json_type.py::test_form_json_list`, `::test_query_json_list`, `::test_header_json_list`, `::test_cookie_json_list` (new file).

**Agent notes.** Excellent cues: exact error text plus before/after `getlist` vs `get` snippets; grep `getlist` in `fastapi/dependencies/utils.py`. Use the exact-type check `type(item) is Json` as in the reference. The fix is a metadata-aware exception in `_get_multidict_value`, not a change to `is_sequence_field` — ordinary repeated-value sequence fields must keep using `getlist`. Pydantic v1 `FieldInfo` lacks `.metadata`; the reference is v2-only (noted in the PR), so scope or guard accordingly. Verify with the new file plus existing form/multi-query tests.


#### fastapi_14786 — Strip whitespaces from `Authorization` header credentials

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | request-parsing |
| Root-cause family | boundary-edge-case |
| Patch size | +1/-1, 1 files |
| Agent difficulty | 1/5 (one-line) |

**Problem.** Credentials extracted from the `Authorization` header keep extraneous whitespace when the header uses multiple spaces between scheme and token or has trailing spaces: `Bearer   xxx` yields credentials `"  xxx"` and `Bearer xxx ` yields `"xxx "`. This violates RFC 6750 (the `b64token` grammar contains no whitespace) and causes authentication failures downstream.

**Root cause.** `fastapi/security/utils.py::get_authorization_scheme_param` (lines 9-10) splits with `scheme, _, param = authorization_header_value.partition(" ")` and then does `return scheme, param`. `str.partition` consumes exactly one separator space, so any additional leading spaces and all trailing whitespace remain in `param`. RFC 6750 section 2.1 permits `1*SP` between scheme and token, meaning extra spaces are separators only, yet they are returned as credential characters. Trigger: any request with `Authorization: Other  foobar ` or `Bearer  testtoken `; every scheme using this helper (HTTPBase, HTTPBearer, HTTPDigest, OAuth2PasswordBearer, OAuth2AuthorizationCodeBearer) hands the padded string to token validation, where comparison or JWT decoding fails.

**Reference fix.** Change the return to `return scheme, param.strip()`. Leading/trailing whitespace is removed from the credential; the scheme and the empty-header early return (`"", ""`) are untouched, and single-space headers behave exactly as before. Because the helper is centralized, all security schemes inherit the fix with no further edits.

**Acceptance tests.** `tests/test_security_http_base.py::test_security_http_base_with_whitespaces` (`"Other  foobar "` → credentials `"foobar"`) and `tests/test_security_oauth2_authorization_code_bearer.py::test_token_with_whitespaces` (`"Bearer  testtoken "` → token `"testtoken"`).

**Agent notes.** The PR body gives the exact file, function, and one-line fix, plus curl reproductions — localization is fully specified. Verify with the two touched test files and the wider `tests/test_security_*` suite (including missing-header 401/403 and OpenAPI schema tests) to catch regressions. Do not strip or normalize the scheme, and do not touch the `if not authorization_header_value` guard. Note `strip()` only removes leading/trailing whitespace; internal spaces remain invalid per RFC, which matches the reference behavior.


### Subcategory: routing (2 tasks)


APIRouter/app route composition: include_router identity, lifespan/startup wiring, route-context iteration, static/frontend dispatch, and decorator surface.


#### fastapi_14873 — Fix `on_startup` and `on_shutdown` parameters of `APIRouter`

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | routing |
| Root-cause family | state-lifecycle |
| Patch size | +11/-10, 1 file |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** Handlers passed as constructor parameters — `FastAPI(on_startup=[...])` or `APIRouter(on_startup=[...])` — were silently never invoked at startup/shutdown. The statement includes a minimal repro where `SYNC START` is never printed.

**Root cause.** Initialization-order clobber in `fastapi/routing.py::APIRouter.__init__`. The handler lists are stored first: `self.on_startup: list[Callable[[], Any]] = (` (lines 958-963), but then `super().__init__(routes=routes, redirect_slashes=redirect_slashes, default=default, lifespan=lifespan_context,)` runs at lines 977-982 without forwarding `on_startup`/`on_shutdown`. Starlette's `Router.__init__` unconditionally reassigns `self.on_startup = [] if on_startup is None else list(on_startup)` (and `on_shutdown`), wiping the lists FastAPI just built. At runtime `_DefaultLifespan.__aenter__` (line 228) calls `self._router._startup()`, which iterates the now-empty `self.on_startup` (line 4555). Trigger: constructor-parameter handlers only — `@app.on_event("startup")` still works because `add_event_handler` appends after construction (line 4593), which masked the regression introduced by PR #14851.

**Reference fix.** Pure code motion: the `self.on_startup`/`self.on_shutdown` assignment block (with its "Handle on_startup/on_shutdown locally since Starlette removed support" comment) is moved from before `super().__init__` to after it (after the prefix assertions, before `self.prefix`). The lists then survive construction, so `_DefaultLifespan` and `include_router`'s handler merging (lines 1495-1497) see them.

**Acceptance tests.** `tests/test_router_events.py::test_startup_shutdown_handlers_as_parameters` — builds app + router + sub-router each with parameter handlers, asserts all startup flags True inside `with TestClient(app)` and all shutdown flags True after exit. Existing `on_event`/lifespan tests in the same file must remain green.

**Agent notes.** The statement literally names the mechanism and links Starlette's clobbering lines, so localization is given. Do not "fix" by forwarding the lists to `super()` (Starlette removed that support); keep FastAPI-local lists assigned after `super().__init__`. Verify with `pytest tests/test_router_events.py`. This is the direct follow-up to fastapi_14851 in the same file.


#### fastapi_15763 — Fix bug, allow empty path in path operation in prefixless router

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | routing |
| Root-cause family | boundary-edge-case |
| Patch size | +10/-3, 1 file |
| Agent difficulty | 3/5 (few-lines) |

**Problem.** Including a router without a prefix wrongly raised `FastAPIError: Prefix and path cannot be both empty` for a route whose raw path was `""` but whose effective path (from an earlier prefixed include) was non-empty — e.g. `@leaf.get("")` included with `prefix="/items"`, then re-included prefixless.

**Root cause.** In `fastapi/routing.py::APIRouter.include_router`, the no-prefix `else` branch (lines 2437-2444) iterates `_iter_included_route_candidates(router.routes)` and checks `path = getattr(r, "path", None)` then `if path is not None and not path: raise FastAPIError(...)`. But `_iter_included_route_candidates` (lines 1614-1619) yields `route_context.starlette_route` when present, otherwise falls back to `yield route` (the original). For an `APIRoute`, `_EffectiveRouteContext.from_api_route` (lines 1331-1383) leaves `starlette_route=None` and stores the effective path in `context.path` (`include_context.path_for(original_route)` = `prefix + route.path`, lines 1342/1276). So the candidate is the original `APIRoute` with raw `.path == ""`, and validation sees an empty path even though the effective path is `/items`. The empty-raw-path boundary is mishandled because the wrong path source is consulted.

**Reference fix.** Iterate `_iter_routes_with_context(router.routes)` (yields `(route, route_context)`) and resolve the effective path/name explicitly: `route_context is None` → `route.path/name`; `route_context.starlette_route is not None` → `starlette_route.path/name`; else → `route_context.path/name`. The empty-path check now runs against the effective path, allowing empty raw paths with non-empty effective paths while still rejecting truly-empty effective paths.

**Acceptance tests.** `tests/test_router_include_context.py::test_no_prefix_include_validation_sees_effective_api_route_path` (200 at `/items`), `::test_no_prefix_include_validation_sees_effective_starlette_route_path` (200 at `/child/items`), `::test_no_prefix_include_validation_rejects_empty_effective_api_route_path` (still raises `FastAPIError`).

**Agent notes.** Localize via the error string `Prefix and path cannot be both empty`. The key insight is that `APIRoute` contexts have `starlette_route=None` and carry the effective path in `context.path`, so the candidate helper's fallback exposes the raw empty path. Depends on the include-context architecture from fastapi_15745 — do not revert to raw-route inspection. Keep the genuine empty-effective-path rejection. Verify with the whole `test_router_include_context.py` file.


### Subcategory: security-schemes-openapi (4 tasks)


Security-scheme registration, scope-aware dependant caching, and HTTP auth challenge semantics (401/403, WWW-Authenticate) in OpenAPI.


#### fastapi_13786 — Use `401` status code in security classes when credentials are missing

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | security-schemes-openapi |
| Root-cause family | api-contract-violation |
| Patch size | +176/-83, 11 files |
| Agent difficulty | 3/5 (multi-file) |

**Problem.** When credentials are missing, most FastAPI security classes returned HTTP 403 with no `WWW-Authenticate` header. RFC 9110 requires 401 plus a challenge for unauthenticated requests; 403 means "authenticated but refused". Behavior was also inconsistent: `HTTPBasic` and the OAuth2 bearer subclasses already returned 401.

**Root cause.** Every `auto_error` branch hard-codes the wrong status. `fastapi/security/api_key.py::APIKeyBase.check_api_key` (lines 13-21) raises `status_code=HTTP_403_FORBIDDEN, detail="Not authenticated"` (line 18); the same literal appears in `fastapi/security/http.py::HTTPBase.__call__` (line 91), `HTTPBearer.__call__` (lines 310, 317 for wrong scheme), `HTTPDigest.__call__` (412, 419), `fastapi/security/oauth2.py::OAuth2.__call__` (385), and `fastapi/security/open_id_connect_url.py::OpenIdConnect.__call__` (81). None attach a challenge header, so clients cannot discover how to authenticate. Trigger: any unauthenticated request to a protected endpoint with default `auto_error=True`. `HTTPBasic` additionally used a separate detail `"Invalid authentication credentials"` for malformed base64/missing colon.

**Reference fix.** Each base class gains an overridable `make_not_authenticated_error()` returning `HTTPException(401, "Not authenticated", headers={"WWW-Authenticate": ...})` — `APIKey` for API keys, `scheme.title()` via `make_authenticate_headers()` for HTTP schemes (realm-aware `Basic`, `Bearer`, `Digest`), `Bearer` for OAuth2/OIDC. `APIKeyBase` gets an `__init__` and `check_api_key` becomes an instance method; subclasses delegate via `super().__init__`. `HTTPBasic` reuses the hook (detail unified, `from e` chaining). Docs add an `authentication_error_status_code` tutorial showing the subclass override. Important: the PR text's `not_authenticated_status_code` parameter was dropped in review — the merged patch uses hooks, not a flag.

**Acceptance tests.** All 17 `tests/test_security_*.py` files, e.g. `test_security_api_key_header.py::test_security_api_key_no_key` (401 + `WWW-Authenticate: APIKey`), `test_security_http_bearer.py::test_security_http_bearer_incorrect_scheme_credentials` (401 + `Bearer`, detail `Not authenticated`), `test_security_http_base.py::test_security_http_base_no_credentials` (`Other`), `test_security_oauth2.py::test_security_oauth2_password_bearer_no_header`.

**Agent notes.** Strong localization: the body names every class. Tests pin exact status/header/detail, so derive expectations from `test_patch`. Do not implement the outdated `not_authenticated_status_code` flag; keep `auto_error=False` returning `None`; OpenAPI schemas must stay unchanged. Run the tutorial security tests too, since `docs_src/security/tutorial003*` detail strings change.


#### fastapi_14266 — Fix security schemes in OpenAPI when added at the top level app

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | security-schemes-openapi |
| Root-cause family | schema-generation-logic |
| Patch size | +8/-10, 1 files |
| Agent difficulty | 3/5 (few-lines) |

**Problem.** A security scheme added through top-level `dependencies=[Depends(bearer_scheme)]` (at app, router, or operation level) was enforced at runtime — requests without a token got 403 — but never appeared in the OpenAPI document: both the operation `security` array and `components.securitySchemes` were missing it.

**Root cause.** In `fastapi/dependencies/utils.py::get_dependant` (lines 233-300) the only `SecurityRequirement` creation is at lines 272-281, inside `for param_name, param in signature_params.items()`, guarded by `if isinstance(param_details.depends.dependency, SecurityBase):`. That branch fires only when a scheme is a **parameter default** (e.g. `token = Security(oauth2_scheme)`), appending to `sub_dependant.security_requirements`. A top-level dependency is instead processed by calling `get_dependant(call=bearer_scheme)` directly; `HTTPBearer` is a `SecurityBase` whose own signature has no security-dependency parameters, so the loop never reaches line 272 for it and no requirement is created. The scheme still runs (runtime auth works) but `flat_dependant.security_requirements` stays empty, so OpenAPI omits the scheme. Trigger: any scheme supplied via `dependencies=[...]` rather than as an endpoint parameter.

**Reference fix.** Registers the requirement at the **top** of `get_dependant` based on the dependant's own `call`: after `signature_params`, `if isinstance(call, SecurityBase):` builds `use_scopes` (`security_scopes` for `OAuth2`/`OpenIdConnect`, else `[]`), creates `SecurityRequirement(security_scheme=call, scopes=use_scopes)` and appends to `dependant.security_requirements`. The old parameter-loop block (272-281) is removed; parameter-level schemes are now registered by the recursive `get_dependant` call (which passes `security_scopes=use_security_scopes`), preserving scope propagation while also covering top-level dependencies.

**Acceptance tests.** New `tests/test_top_level_security_scheme_in_openapi.py`: `test_get_root` (200 with Bearer token), `test_get_root_no_token` (403 "Not authenticated"), and `test_openapi_schema` asserting `security: [{"HTTPBearer": []}]` and `securitySchemes: {"HTTPBearer": {"type":"http","scheme":"bearer"}}`.

**Agent notes.** The key insight is that top-level dependencies become `get_dependant`'s `call` (not a signature parameter), so the old param-loop registration never fired for them. Grep `SecurityRequirement`/`security_requirements` to localize; discussion #14263 / issue #14271 are referenced. Both edits must land together — removing the loop block without the top check breaks all security OpenAPI — and avoid double registration (the recursive sub-dependant now self-registers). Preserve OAuth2/OpenIdConnect scope propagation and give non-OAuth2 schemes `[]`. Verify the new test **and** the existing `tests/test_security_*`/OAuth2 scope suites for regressions or duplicates.


#### fastapi_14455 — Fix OpenAPI security scheme OAuth2 scopes declaration, deduplicate security schemes with different scopes

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | security-schemes-openapi |
| Root-cause family | schema-generation-logic |
| Patch size | +11/-2, 1 files |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** When the same OAuth2 security scheme is declared at several dependency levels with different scopes (app-level with none, router-level with `["read"]`, endpoint with `["read","write"]`), the generated OpenAPI `security` array contained multiple separate objects for that one scheme instead of a single object holding the merged scopes.

**Root cause.** `fastapi/openapi/utils.py::get_openapi_security_definitions` (lines 78-92) iterates `flat_dependant.security_requirements`, which aggregates requirements from app-, router-, and endpoint-level `Security()` dependencies. For each it runs `operation_security.append({security_name: security_requirement.scopes})` (line 91) with no merging, starting from `operation_security = []` (line 82). A scheme reused across levels therefore produces e.g. `[{"Scheme": []}, {"Scheme": ["read"]}, {"Scheme": ["read","write"]}]`. In OpenAPI the top-level `security` array elements are **alternatives (logical OR)**, so this wrongly reads as "no scopes OR read OR read+write" rather than one requirement whose scopes are the union. The correct output is a single object per scheme with merged, deduplicated scopes: `[{"Scheme": ["read","write"]}]`. Trigger: a scoped scheme reused across dependency levels with differing scope lists.

**Reference fix.** Accumulates scopes in `operation_security_dict: Dict[str, List[str]]` keyed by scheme name. For each requirement it initializes the scheme's list if absent, then appends each scope from `security_requirement.scopes or []` only if not already present (order-preserving dedup). After the loop it builds `operation_security = [{name: scopes} for name, scopes in operation_security_dict.items()]`. The `security_definitions` assignment is unchanged. Result: one merged security object per scheme.

**Acceptance tests.** New `tests/test_security_oauth2_authorization_code_bearer_scopes_openapi.py`: `test_root`, `test_read_token`, `test_create_token` (runtime auth), and `test_openapi_schema` asserting `GET /` → `[{"Scheme": []}]`, `GET /items/` → `[{"Scheme": ["read"]}]`, `POST /items/` → `[{"Scheme": ["read","write"]}]`, plus the `securitySchemes` definition.

**Agent notes.** Single-function fix; the key insight is that `flat_dependant.security_requirements` collects app+router+endpoint levels so the same scheme repeats, and OpenAPI's `security` array is OR-of-alternatives (a scheme should appear once with the union of its scopes). Grep `get_openapi_security_definitions`/`operation_security` to localize; issue #14454 is referenced. Use an order-preserving dict, guard `None` scopes with `or []`, and do not sort (the test expects `["read","write"]` order). Genuinely different schemes must stay separate entries. Verify the new test plus existing `tests/test_security_oauth2*` schema tests.


#### fastapi_14459 — Fix OAuth2 scopes in OpenAPI in extra corner cases, parent dependency with scopes, sub-dependency security scheme without scopes

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | security-schemes-openapi |
| Root-cause family | state-lifecycle |
| Patch size | +49/-22, 3 files |
| Agent difficulty | 4/5 (multi-file) |

**Problem.** OAuth2 scopes rendered wrongly in OpenAPI when a parent dependency carries scopes but its sub-dependency security scheme has none, and the same scheme is also used without scopes in another operation. The scope-less dependant was cached and reused, so the scoped operation rendered its scheme without scopes. This is "strike 2" of issue #14454 (follow-up to fastapi_14455), fixed via an internal refactor.

**Root cause.** In `fastapi/dependencies/models.py`, `Dependant.cache_key` (lines 69-78) includes scopes only `if self._uses_scopes`, and `_uses_scopes` (lines 80-89) returns True only for `own_oauth_scopes`, a `security_scopes_param_name`, or a scope-using sub-dependency — **not** for the dependant being a `SecurityBase` itself. A bare scheme sub-dependency (e.g. `oauth2_scheme` inside `get_token`) has no own scopes and no sub-deps, so `_uses_scopes=False` and its `cache_key` omits scopes: `scopes_for_cache = (... if self._uses_scopes else ())`. When the scheme appears in operation A without scopes and operation B under `Security(get_token, scopes=["read","write"])`, both yield the same cache key, so A's dependant (`parent_oauth_scopes=[]`, `SecurityRequirement.scopes=[]`) is cached and reused for B. `get_flat_dependant` (`dependencies/utils.py` 140-172) compounded this by copying/extending the static `security_requirements` list without propagating `parent_oauth_scopes` or preserving the dependency tree, and `get_openapi_security_definitions` (`openapi/utils.py` 84-97) read scopes from those static objects.

**Reference fix.** Derives security from the dependency tree instead of a static list. `models.py` removes `SecurityRequirement` and `Dependant.security_requirements`, adds cached properties `_is_security_scheme`, `_security_scheme`, `_security_dependencies`, and makes `_uses_scopes` return True when `_is_security_scheme` (scope-aware caching). `get_flat_dependant` propagates `parent_oauth_scopes` (`parent + dependant.oauth_scopes`), copies `call`/`name`/`own_oauth_scopes`/`parent_oauth_scopes`/`scope` and the `*_param_name` fields, and preserves the tree (`dependencies.append(flat_sub)` + `extend(flat_sub.dependencies)`). `get_dependant` drops the static registration; `get_openapi_security_definitions` iterates `_security_dependencies`, reading `_security_scheme` and the dynamically parent-aware `oauth_scopes`.

**Acceptance tests.** Updated `tests/test_security_oauth2_authorization_code_bearer_scopes_openapi.py` (`test_openapi_schema`, new `test_read_with_oauth2_scheme`/`test_read_with_get_token` — both expect `[{"Scheme":["read","write"]}]`; app dependency now `Depends(get_token)`); new `tests/test_security_oauth2_authorization_code_bearer_scopes_openapi_simple.py` (`test_read_admin`, `test_openapi_schema` — `/admin` via `Security(get_token, scopes=["read","write"])`).

**Agent notes.** Hardest in the batch: a coupled 3-file refactor, not a localized patch. Study `models.py` cached properties (`oauth_scopes`, `cache_key`, `_uses_scopes`) and `get_flat_dependant` first. All `SecurityRequirement` consumers must change together; the flat dependant must carry the tree and own/parent scopes or the derived properties break; `_uses_scopes` must recognize security schemes or the caching bug persists. This base already includes fastapi_14455 (merge) and fastapi_14266 (top-level registration) — this supersedes 14266's mechanism. Verify both target files plus the full `tests/test_security_*`/`test_dependency_*` suites for regressions.


### Subcategory: style-caching (1 tasks)


Style hash/equality cache invalidation when meta/links are cleared.


#### rich_2943 — Clear hashed cache when clearing meta.

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | caching |
| Root-cause family | state-lifecycle |
| Patch size | +1/-1, 1 files |
| Agent difficulty | 1/5 (one-line) |

**Problem.** `Style.clear_meta_and_links()` returns a style that still compares equal to the original (and collides with it in sets/dicts) when the original's hash was already cached, even though link and meta were removed. Issue #2942.

**Root cause.** `style.py::Style.clear_meta_and_links` (lines 649-669). `Style.__hash__` (lines 432-445) hashes a tuple including `self._link` and `self._meta` and caches it in `self._hash`; `__eq__` is defined as `return self.__hash__() == other.__hash__()` (line 425). The clearing method builds a new Style with `_link=None`, `_meta=None` but copies the stale cache: `style._hash = self._hash` (line 666). If the source was hashed before clearing (dict key, set member, comparison), the cleared style keeps the pre-clear hash — `if self._hash is not None: return self._hash` (lines 433-434) — so hash-based equality wrongly reports the two styles equal, corrupting style deduplication downstream (e.g. Textual). With a cold cache (`_hash is None`) lazy recomputation hides the bug. Sibling methods invalidate correctly: `update_link` sets `_hash=None` (line 689), `__add__` likewise (line 754).

**Reference fix.** Set `style._hash = None` in `clear_meta_and_links` so the cleared style recomputes its hash from its actual link-free, meta-free attributes on first use, restoring correct equality. The new regression test forces caching with `hash(style)` on a style with a link plus `Style.on(click="CLICK")` meta, then asserts `clear_style._hash is None`.

**Acceptance tests.** `tests/test_style.py::test_clear_meta_and_links_clears_hash` (new), alongside the existing `test_clear_meta_and_links`.

**Agent notes.** The title states the fix outright; grep `clear_meta_and_links` in `rich/style.py`. Key insight: `__eq__` delegates to `__hash__`, so the stale cache is an equality bug, not merely a perf artifact. Do not remove `_link`/`_meta` from the hash tuple (breaks legitimate equality), and leave `copy()` alone — it copies `_hash` but changes no hash inputs. The test inspects the private `_hash` attribute, so assign `None` rather than recomputing eagerly. Verify with the full `tests/test_style.py`.


### Subcategory: syntax-highlighting (2 tasks)


Syntax/code rendering: width/padding accounting and background-style composition for the Padding wrapper.


#### rich_3296 — fix(syntax): include padding with background color override

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | syntax-highlighting |
| Root-cause family | api-contract-violation |
| Patch size | +1/-3, 1 files |
| Agent difficulty | 1/5 (one-line) |

**Problem.** `Syntax("x = 1", lexer="python", padding=(1, 3), background_color="red")` renders the code on a red background but the surrounding padding on the theme's own background (monokai dark), producing a mismatched two-tone frame instead of a uniformly red block (issue #3295).

**Root cause.** In `rich/syntax.py::Syntax.__rich_console__` (lines 621-624) the padding wrapper is built as `Padding(segments, style=self._theme.get_background_style(), pad=self.padding)` — theme background only. Meanwhile the code text itself honors the override: `__init__` stores `self.background_style = Style(bgcolor=background_color)` (lines 290-293) and `highlight()` applies `text.stylize(f"on {self.background_color}")` (lines 528-529). The correct composite already exists as `_get_base_style()` = `self._theme.get_background_style() + self.background_style` (lines 405-408); the Padding call site simply fails to use it. Trigger: any nonzero padding plus a `background_color` that differs from the theme background.

**Reference fix.** One expression: `yield Padding(segments, style=self._get_base_style(), pad=self.padding)`. Padding now inherits theme background + override, matching the code region; without an override the composite reduces to the theme background, so default rendering is unchanged.

**Acceptance tests.** `tests/test_syntax.py::test_background_color_override_includes_padding` — strict ANSI snapshot asserting every cell, including the top/bottom padding rows and the 3-column gutters, carries `\x1b[41m` (red background) with monokai token foregrounds on top.

**Agent notes.** The PR title names both ingredients (padding + background override), so localization is a single grep for `get_background_style` in `syntax.py`, which exposes both the wrong call site and the right helper. Verify with the named test plus full `tests/test_syntax.py`. Do not modify `highlight()` or `_get_base_style()`; style composition order (theme + override) must be preserved or the exact-ANSI snapshot fails.


#### rich_3782 — Syntax padding

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | syntax-highlighting |
| Root-cause family | boundary-edge-case |
| Patch size | +24/-5, 1 files |
| Agent difficulty | 3/5 (few-lines) |

**Problem.** `Syntax(..., padding=(0, 3), word_wrap=True)` wraps code at the full console width and then adds the padding, so the rendered block exceeds the console width and the right gutter overflows (issue #3727). At width 24 the code must wrap at 18, leaving 3-space gutters on both sides.

**Root cause.** `rich/syntax.py::Syntax._get_syntax` (lines 643-651) derives `code_width` from `options.max_width` (minus the line-number column when enabled) with no allowance for padding; `Syntax.__rich_console__` (lines 628-630) afterwards wraps the segments in `Padding(segments, style=self._get_base_style(), pad=self.padding)`, adding left+right columns *after* the wrap-width decision. Total width = max_width + horizontal padding. Trigger: nonzero horizontal padding with derived (not explicit) `code_width` and code long enough to wrap. Secondary defect: `self.padding = padding` (line 296) stores the raw int-or-tuple, so truthiness and unpacking are re-handled inconsistently at each call site.

**Reference fix.** (1) A `PaddingProperty` descriptor normalizes every assignment through `Padding.unpack`, so `self.padding` is always a 4-tuple; (2) `_get_syntax` subtracts `pad_left + pad_right` from the derived width and clamps `max(0, code_width)` — explicit `code_width` is untouched; (3) `__rich_console__` switches to `if any(self.padding)` since `(0,0,0,0)` is truthy; (4) `__rich_measure__` consumes the pre-unpacked tuple. Adds `from __future__ import annotations` for the descriptor hints.

**Acceptance tests.** `tests/test_syntax.py::test_padding_plus_wrap` (new; exact two-line wrapped output with gutters); regressions `test_syntax_padding`, `test_syntax_measure`, `test_background_color_override_includes_padding`.

**Agent notes.** The statement is terse; the new test's expected string is the spec. Main trap: after normalization `if self.padding:` is always true — missing the `any()` change breaks zero-padding rendering. Do not subtract padding from explicit `code_width`, and keep vertical padding out of width math. The test patch's many `-> None` annotations are cosmetic noise. Verify with the full `tests/test_syntax.py`.


### Subcategory: table-panel-rendering (4 tasks)


Box-based renderables (Table, Panel): padding/edge rules, border-glyph ordering, column defaults, and base-style composition behind titles.


#### rich_2725 — fix table rendering order of box elements

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | table-rendering |
| Root-cause family | ordering-off-by-one |
| Patch size | +5/-5, 1 files |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** `Table` draws the wrong vertical border glyphs on body rows versus the final row: "mid" box characters appear on the last row (footer position) while "foot" characters flank middle body rows. The bug is invisible with stock boxes but breaks any custom `Box` that distinguishes mid from foot glyphs.

**Root cause.** In `rich/table.py::Table._render` (lines 772-788) the `box_segments` list is built in the order head (index 0), **foot** (index 1), **mid** (index 2). The per-row selector at line 869 — `left, right, _divider = box_segments[0 if first else (2 if last else 1)]` — assumes the order head/mid/foot: first row gets index 0 (correct), last row gets index 2 (mid glyphs, wrong), middle rows get index 1 (foot glyphs, wrong). Only the vertical left/right/divider segments flanking row content are swapped; horizontal rules drawn via `_box.get_row(widths, "foot"/"mid"/...)` (lines 864-915) are correct. Trigger: a custom `Box` whose `foot_left/foot_right/foot_vertical` differ from `mid_*`; with default boxes both glyph sets are identical (e.g. `│`), which is why the defect survived unnoticed.

**Reference fix.** Swaps the foot and mid tuples inside `box_segments` so the list becomes `[head, mid, foot]`, aligning with the existing index expression. The selector and all horizontal-rule logic are untouched, so stock-box rendering is bit-identical.

**Acceptance tests.** `tests/test_table.py::test_placement_table_box_elements` — parametrized over all four `show_header` x `show_footer` combinations; it monkey-patches every glyph of `box.ASCII` to a unique letter/digit (content rows marked with numerals, dividers with letters) and asserts the exact rendered text, including the `get_plain_headed_box()` path when headers are off.

**Agent notes.** Localization is easy: the PR body literally describes the mid/footer swap and shows a digit-marked example. Verify with `pytest tests/test_table.py` (new test plus existing snapshots). Do not modify the `get_row` horizontal-rule calls or the index expression; the minimal correct edit is reordering the two tuples. Risk is low, but an agent that "fixes" both the list and the selector would double-swap and fail.


#### rich_3518 — fix(table): highlight columns added by add_row

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | table-rendering |
| Root-cause family | api-contract-violation |
| Patch size | +1/-1, 1 files |
| Agent difficulty | 1/5 (one-line) |

**Problem.** With `Table(highlight=True)` and no explicit `add_column` calls, string cells added via `add_row` are not syntax-highlighted (numbers, repr strings, etc.), even though the same cells in explicitly added columns are (issue #3517).

**Root cause.** `rich/table.py::Table.add_row` (line 454) auto-creates missing columns with bare `column = Column(_index=index)`. The `Column` dataclass default is `highlight: bool = False` (line 109), so these implicit columns never inherit the table's setting. The explicit path does it correctly: `add_column` uses `highlight=highlight if highlight is not None else self.highlight` (line 409). At render time `Table._render` passes `highlight=column.highlight` into `render_options` (line 827), which gates the ReprHighlighter for str cells — hence auto-created columns render plain while declared columns render highlighted. Trigger: `Table(show_header=False, highlight=True)` followed by `add_row("1", repr("FOO"))`.

**Reference fix.** One line: `column = Column(_index=index, highlight=self.highlight)` in `add_row`, making the implicit path honor the same table-level default as `add_column`.

**Acceptance tests.** `tests/test_table.py::test_columns_highlight_added_by_add_row` — asserts both columns' `highlight` equals `table.highlight`, then checks exact styled output: bold-cyan `1` (`\x1b[1;36m`) and green `'FOO'` (`\x1b[32m`) inside the box drawing.

**Agent notes.** The PR description states the fix almost verbatim, so localization is trivial; the only subtlety is knowing that `Column` is a dataclass whose default silently wins. Verify with `pytest tests/test_table.py`. Do not change the `Column` dataclass default (would affect direct `Column` users) and do not touch `add_column`. An agent must not "fix" this at render time by OR-ing `table.highlight` into `render_options`, which would override explicit per-column `highlight=False` choices.


#### rich_3718 — fix(panel): fix title missing panel background

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | panel-padding-background |
| Root-cause family | api-contract-violation |
| Patch size | +3/-4, 1 files |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** A `Panel` with a background style (e.g. `style="on blue"`) paints the background on every border segment except behind the title and subtitle, leaving visible unpainted gaps in the top and bottom rules (issue #3569).

**Root cause.** In `rich/panel.py::Panel.__rich_console__` the full frame style is composed at lines 148-150: `style = console.get_style(self.style)`, `partial_border_style = console.get_style(self.border_style)`, `border_style = style + partial_border_style`. All box segments use `border_style`, but the title (line 209) and subtitle (line 258) are styled with `title_text.stylize_before(partial_border_style)` — the border-only style, which excludes the panel background. Trigger: any panel whose base `style` carries a background plus a title/subtitle. Per the PR body this regressed in commit 7a38204 (context: earlier title-style issue #2745). The key semantic: `stylize_before` inserts the style *beneath* the text's own spans, so the title's explicit color still wins — only attributes the title does not set (like the panel background) should fall through.

**Reference fix.** Removes `partial_border_style`, inlines `border_style = style + console.get_style(self.border_style)`, and switches both `stylize_before` calls to the combined `border_style`. The panel background now reaches title/subtitle, while an explicit title color (red) still overrides the border color because it sits on top.

**Acceptance tests.** `tests/test_panel.py::test_title_text_with_border_color` (guards #2745: `border_style="blue"` leaves title `\x1b[31m` red and subtitle `\x1b[1;35m`) and `::test_title_text_with_panel_background` (guards #3569: `style="on blue"` yields `\x1b[31;44m title` and `\x1b[1;35;44m subtitle` with `\x1b[44m` across the frame), both exact-ANSI comparisons.

**Agent notes.** Three coordinated sites in one file; the PR's "reverts 7a38204" hint makes intent clear. Verify with `pytest tests/test_panel.py`. Critical constraint: do not regress #2745 — using `stylize` instead of `stylize_before`, or composing styles in the wrong order, would let the border color override the title's own color and fail the first test.


#### rich_3935 — fix for padding width

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | table-rendering |
| Root-cause family | api-contract-violation |
| Patch size | +13/-3, 1 files |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** `Table.grid(padding=(0,1))` renders uneven/extra padding because the column-width measurement disagrees with the padding actually applied at render time (rich issue #3871).

**Root cause.** `rich/table.py::_get_padding_width` (lines 699-705) returns `pad_left+pad_right`, applying `if column_index > 0: pad_left = max(0, pad_left - pad_right)` under `collapse_padding` but never consulting `pad_edge`. The render-side `get_padding` closure in `_get_cells` (lines 641-664) DOES honor `pad_edge` (left=0 on the first column, right=0 on the last) and collapses left for non-first columns. For `Table.grid` (`collapse_padding=True`, `pad_edge=False`, `padding=(0,1,0,1)`): rendered padding per column is (1,1,0) but measured padding is (2,1,1) — column 0 keeps its left pad in measurement and the last column keeps its right pad. Columns are allocated one extra cell at each edge, producing stray leading/trailing spaces and uneven gaps. The regression test expects `aaa aaa aaa` (11 cells) but the base measures 13. Evidence: `if column_index > 0:` (line 703) and `return pad_left + pad_right` (line 705, `pad_edge` never consulted).

**Reference fix.** In `_get_padding_width`, under `collapse_padding` set `pad_left=0` and `pad_right=abs(pad_left-pad_right)` (with `pad_left` already zeroed this retains `pad_right`); then under `not pad_edge` zero `pad_left` on column 0 and `pad_right` on the last column, mirroring `get_padding` so measured widths equal rendered widths. The other hunks are whitespace-only.

**Acceptance tests.** `tests/test_table.py::test_padding_width` (asserts `export_text(styles=True)=="aaa aaa aaa\n"`) and `tests/test_columns.py::test_render` (updated snapshot — the fixed-width Columns section loses trailing spaces).

**Agent notes.** Single-function fix; the key insight is the measurement/render contract — read `get_padding` in `_get_cells` before editing `_get_padding_width`. Verify with `pytest tests/test_table.py tests/test_columns.py`. Risks: the collapse assignment order matters (`pad_left` is zeroed BEFORE `abs(pad_left-pad_right)`; swapping the lines changes semantics); `Columns` renders through `Table.grid`, so its snapshot shifts (update expectations only as the reference does); `pad_edge=True` + `collapse_padding` + asymmetric padding is a subtler parity case the regression test does not cover. An agent that only "simplifies" the collapse formula without mirroring `pad_edge` will still mis-size edge columns.


### Subcategory: text-span-management (2 tasks)


Text span list bookkeeping: append/extend aliasing and control-code sanitization keeping span offsets in sync with text length.


#### rich_3471 — Fixed exception in append_tokens

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | text-span-management |
| Root-cause family | api-contract-violation |
| Patch size | +1/-0, 1 files |
| Agent difficulty | 1/5 (one-line) |

**Problem.** `Text.append_tokens` accepts raw control codes (e.g. `\r\n`), violating the sanitized-text invariant that `Text.__init__` and `Text.append` maintain; printing/wrapping such a `Text` raises an exception (rich issue #3014).

**Root cause.** `rich/text.py::append_tokens` (lines 1043-1047) appends content verbatim and records `Span(offset, offset+len(content))` using the raw length. `Text.__init__` (line 155) and `Text.append` (line 980) DO sanitize via `strip_control_codes`, but `append_tokens` does not. During `console.print` -> `Text.wrap` -> `split`/`divide`, child `Text` instances are built from slices (divide line 1127) and `__init__` strips the `\r`, shrinking the plain text while `divide` assigns spans computed from the parent's raw offsets (lines 1173-1178). The stale span end then exceeds the child's length, so the next `divide`'s end-line binary search (lines 1163-1171) walks `lower_bound` past `line_count` and indexes `line_ranges` out of range -> `IndexError`. Evidence: `append_text(content)` (line 1044, no sanitization) versus `sanitized_text = strip_control_codes(text)` (line 155).

**Reference fix.** Insert `content = strip_control_codes(content)` at the top of the loop (the helper is already imported at line 24), so `_text`, `_length` and span offsets all refer to sanitized text, restoring the invariant. One line.

**Acceptance tests.** `tests/test_text.py::test_append_tokens` — prints a token containing `\r\n` at width 40 and asserts the capture equals `long text that will be wrapped with a \ncontrol code \n\n` (CR stripped, LF preserved as a line break).

**Agent notes.** One-line fix with an obvious locus (`strip_control_codes` is already used in `append` directly above). The interesting part is the crash chain — sanitization in `__init__` desyncs stale spans during `divide` — useful for diagnosis but not required to apply the fix. Verify with `pytest tests/test_text.py`. Risks: `strip_control_codes` removes CR and other C0/C1 codes but preserves LF and TAB (do not strip newlines); span offsets must use the sanitized `len(content)`. The exact exception (`IndexError`) is inferred from the divide binary-search structure via static analysis. Subcategory `text-span-management` is proposed (shared with rich_3480).


#### rich_3480 — fix infinite loop in append

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | text-span-management |
| Root-cause family | infinite-loop-recursion |
| Patch size | +2/-2, 1 files |
| Agent difficulty | 1/5 (few-lines) |

**Problem.** `Text.append(text)` and `Text.append_text(text)` hang when the argument is the same `Text` instance (self-append), rich issue #3479.

**Root cause.** In `rich/text.py::append` (lines 999-1002) and `::append_text` (lines 1021-1024) the code runs `self._spans.extend(_Span(start+text_length, end+text_length, style) for start, end, style in text._spans)`. When `text is self`, `text._spans` IS `self._spans`, so the generator iterates the live list while `extend` appends offset-copies of each item to it; the list grows by one per iteration and the iterator never terminates — an unbounded loop with growing memory. The plain-text append (lines 998/1020) is safe because `text.plain` is joined to a snapshot `str` first; only the span extend aliases the destination. Evidence: `for start, end, style in text._spans` (lines 1001 and 1023).

**Reference fix.** Iterate a snapshot: change both generators to `text._spans.copy()` so `extend` consumes a fixed list independent of the destination. Two identical one-line edits.

**Acceptance tests.** `tests/test_text.py::test_append_loop_regression` — `a = Text("one","blue"); a.append(a)` asserts `a.plain=="oneone"`, and `b.append_text(b)` asserts `b.plain=="twotwo"`.

**Agent notes.** Obvious locus (the title names `append`); the subtle point is recognizing the generator/list aliasing during `extend`. The failure is a hang, so reproduce under a timeout rather than expecting an exception. Verify with `pytest tests/test_text.py` and confirm span-offset arithmetic is unchanged. Risks: do not "fix" by special-casing `text is self` — `copy()` is simpler and also guards against concurrent mutation; preserve the `text_length` captured before mutation. Subcategory `text-span-management` is proposed (no existing rich subcategory covers `Text._spans` bookkeeping).


### Subcategory: text-splitting (4 tasks)


Line/cell splitting and tab expansion: divide_line/chop_cells/_split_cells offset arithmetic and expand_tabs span bookkeeping.


#### rich_3061 — Extend tabs with styles

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | text-splitting |
| Root-cause family | state-lifecycle |
| Patch size | +67/-24, 1 files |
| Agent difficulty | 4/5 (few-lines) |

**Problem.** `Text.expand_tabs` replaced tabs with unstyled padding spaces, so a styled region (bold, background color) broke at every tab stop. Tab stops were also miscomputed for multi-line text and wide characters, and an explicit `Text(tab_size=N)` was ignored at render time.

**Root cause.** `text.py::Text.expand_tabs` (lines 775-807). The padding is appended with the Text's base style only — `_style = self.style` (line 791) then `append(" " * spaces, _style)` (line 801) — so spans covering the tab never extend over the inserted spaces. Additionally `pos = 0` (line 784) is never reset per line (newlines are counted), and `pos += len(part)` (line 798) counts characters, not display cells, misaligning tabs after wide glyphs. Separately, `__rich_console__` resolves `tab_size: int = console.tab_size or self.tab_size or 8` (line 649) with `__init__` defaulting `tab_size=8` (line 136), so the console default (8) always shadows an explicit Text tab size. Finally, `append`/`append_text`/`append_tokens` guard with `if style is not None` (lines 935, 945, 966, 993), creating no-op spans for empty-string styles that pollute span lists and block Segment merging.

**Reference fix.** Add `Span.extend(cells)` and `Text.extend_style(spaces)` (extends spans reaching the text end, then appends styled spaces). Rewrite `expand_tabs` per line: replace the trailing tab in the part's last chunk with a space, track `cell_position` via `part.cell_len` (reset each line), and call `part.extend_style(tab_size - cell_position % tab_size)` so padding inherits the tab's spans; assemble with `Text("").join`. Default `tab_size` to `None` and resolve `console.tab_size if self.tab_size is None else self.tab_size`. Switch the four guards to `if style:` (matching `join`, line 765), so empty styles create no spans — which is why `test_panel` now expects one merged border Segment.

**Acceptance tests.** `tests/test_text.py::test_tabs_to_spaces_spans` (12 parametrized exact plain+span cases, incl. emoji and multi-line red/green), `::test_extend_style`, extended `::test_tabs_to_spaces`; `tests/test_panel.py::test_render_size`.

**Agent notes.** Strong cues: the PR body names `expand_tabs` and the unstyled-space defect. Single file but algorithmic; the hard part is exact span bookkeeping — tests assert full span lists with order and adjacent duplicates (the red/green case interleaves red and green spans). Use `cell_len`, reset per line, keep the no-tab early return and the `assert tab_size is not None`. Do not omit the truthiness guards (needed for the panel expectation). `panel.py` was not extracted; the merged-segment change follows from empty styles no longer producing spans. Verify with `tests/test_text.py` and `tests/test_panel.py`.


#### rich_3180 — Fix double-width characters disappearing when wrapping

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | text-splitting |
| Root-cause family | ordering-off-by-one |
| Patch size | +89/-38, 2 files |
| Agent difficulty | 3/5 (multi-file) |

**Problem.** Wrapping CJK/mixed-width text drops characters when the fold boundary falls inside a double-width character (rich issue #3176, Textual #3567).

**Root cause.** `rich/cells.py::chop_cells` (lines 124-144) loops `for character, size in reversed(characters)` (line 135) and appends, so both the line order and the characters within each line are reversed (the docstring admits "returning the characters in reverse order"). `rich/_wrap.py::divide_line` (lines 20-48) calls `chop_cells(word, max_size=width, position=0)` (line 30) and accumulates `start += len(line)` (line 38) to place breaks as if the chunks were forward-ordered. For single-width text the chunk-length multiset is symmetric so offsets coincide; with double-width characters reverse greedy packing differs from forward packing, so breaks land at wrong offsets (often mid-glyph) and the over-wide resulting line is cropped, deleting characters. Simulation: `123ありがとうございました` at width 8 gives old chop `['たしまい','ざごうと','がりあ32','1']` -> divides `[4,8,13]` -> third raw line `ございまし` is 10 cells (>8) -> cropped to `ございま`, losing `し`; correct forward divides are `[5,9,13]`. Evidence: `for character, size in reversed(characters):` (cells.py line 135).

**Reference fix.** Rewrite `chop_cells` as a forward greedy packer with signature `(text, width)`: start a new line when the next character does not fit, moving a straddling double-width character whole to the next line. Rewrite `divide_line` to track `cell_offset`/`remaining_space` explicitly and consume forward chunks, preserving the browser-like rule (new line if no space remains; fold only if the word cannot fit a full line). Add docstrings; update the `__main__` demo.

**Acceptance tests.** `tests/test_cells.py::test_chop_cells`, `::test_chop_cells_double_width_boundary`, `::test_chop_cells_mixed_width`; `tests/test_text.py::test_wrap_cjk_mixed`, `::test_wrap_long_words_followed_by_other_words`, `::test_wrap_long_word_preceeded_by_word_of_full_line_length`, `::test_wrap_multiple_consecutive_spaces`, `::test_wrap_leading_and_trailing_whitespace`.

**Agent notes.** Two-file algorithmic fix; the reverse-order chunking is the core defect, so patching only `divide_line` offsets without fixing `chop_cells` order still fails mixed-width cases. Reproduction requires double-width text (single-width tests pass before and after). Verify `chop_cells("ありがとう",3)==["あ","り","が","と","う"]` and the CJK wrap capture `123あり\nがとうご\nざいまし\nた\n`. Risks: the `chop_cells` signature change (`max_size`/`position` -> `width`) breaks other callers (grep usages); fold must not emit a break before the first chunk when `start==0`; trailing-whitespace words must not shift later breaks; keep the no-fold crop branch intact.


#### rich_3506 — fix split cells

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | text-splitting |
| Root-cause family | ordering-off-by-one |
| Patch size | +15/-2, 1 files |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** `Segment._split_cells` produces wrong-width splits on mixed CJK/ASCII text because the initial position estimate is biased and the forward-only correction cannot recover from an overshoot (Textual issue #4996).

**Root cause.** In `rich/segment.py::_split_cells` (lines 111-146) the estimate `pos = int((cut / cell_length) * (len(text) - 1))` (line 121) uses a `len(text)-1` factor. With leading double-width characters the cell density exceeds the uniform average, so `cell_len(text[:pos])` can already exceed `cut`. The loop (lines 130-144) only advances `pos` and, on `cell_pos > cut` (line 140), returns `before[:pos-1] + " "` (line 142) — valid only when the overshoot is exactly 1 and the replaced character is double-width. When the estimate already overshoots, the left segment is too wide. Simulation confirms: for `早乙女リリエル (CV: 徳井青）` at cut=7 the left width is 9 (expected 7); 34 bad cuts across mixed segments. All-double-width and all-single-width strings happen to pass, so the regression is specific to mixed text. Evidence: `pos = int((cut / cell_length) * (len(text) - 1))` (line 121).

**Reference fix.** Change the estimate to `int((cut / cell_length) * len(text)) - 1` and clamp `pos` to 0 when negative (plus a docstring). The `-1` bias lands the guess at or before the cut for the regression corpus, so the forward scan reaches equality or a correct double-width straddle.

**Acceptance tests.** `tests/test_segment.py::test_split_cells_mixed`, `::test_split_cells_doubles`, `::test_split_cells_single` — each loops cuts and asserts `cell_len(left)==position` and `cell_len(right)==cell_length-position`.

**Agent notes.** The one-line estimate change plus clamp passes the acceptance tests. Reproduce with mixed CJK/ASCII text (all-wide and all-single strings already pass, so they will not reveal the bug). Verify with `pytest tests/test_segment.py` and keep `test_split_cells_emoji` green. Key risk: this is a partial fix — residual overshoot cases (e.g. trailing whitespace) remain and are addressed later by the bidirectional search in rich_3521, so do not assume the function is fully correct afterward. Preserve the `cut>=cell_length` early return and the two-space straddle behavior.


#### rich_3521 — Segment.split_cells fix

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | text-splitting |
| Root-cause family | boundary-edge-case |
| Patch size | +16/-19, 1 files |
| Agent difficulty | 3/5 (few-lines) |

**Problem.** `Segment._split_cells` still returns wrong-width splits for mixed-width strings when the proportional initial estimate overshoots the cut. This is the follow-up to rich_3506 (Textual issue #5090).

**Root cause.** In `rich/segment.py::_split_cells` (lines 111-159) the estimate `pos = int((cut / cell_length) * (len(text))) - 1` (line 132) assumes uniform cell density and can land past the cut for mixed CJK/ASCII text, especially with trailing spaces. The recovery loop (lines 143-157) only moves `pos` forward and, on `cell_pos > cut` (line 153), returns `before[:pos-1] + " "` (line 155) — correct only when the overshoot is exactly 1 and the replaced character is double-width. When the overshoot exists before the loop, the left segment comes out 1-2 cells too wide. Simulation confirms: for `メイド・イン・きゅんクチュアリ☆    ` at cut=21 the left width is 23 (expected 21); 11 bad (segment, cut) pairs across the 8 regression segments, versus 0 for the reference rewrite. Evidence: `if cell_pos > cut:` (line 153) and `_Segment(before[: pos - 1] + " ", ...)` (line 155).

**Reference fix.** Replace the forward-only scan with a bidirectional walk: recompute `cell_pos` at `pos`, set `out_by = cell_pos - cut`; return the exact split at `out_by==0`; substitute two spaces (one per side) only when `out_by==-1` and `text[pos]` is wide, or `out_by==+1` and `text[pos-1]` is wide; otherwise step `pos` toward the cut. The `-1` bias is dropped from the estimate.

**Acceptance tests.** `tests/test_segment.py::test_split_cells_mixed`, now parametrized over 8 mixed-width segments and asserting every cut in `range(0, cell_length+1)` (plus a sanity check that no control codes are present).

**Agent notes.** The parametrized segments are the repro corpus; verify `cell_len(left)==cut` and `cell_len(right)==cell_length-cut` for every cut, and keep `test_split_cells_emoji`/`_doubles`/`_single` green. Key risk: this is the second fix to the same function — adjusting the estimate alone (the rich_3506 approach) still fails the new cases, so the search itself must become bidirectional. The +/-1 wide-char branches must emit exactly two spaces total to preserve width, and the loop must terminate even with zero-width characters.


### Subcategory: traceback-rendering (1 tasks)


Traceback extraction and rendering: PEP 657 instruction positions, PEP 678 __notes__, and exception-chain cycle detection.


#### rich_3772 — Fix traceback recursion

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | bugfix |
| Subcategory | traceback-rendering |
| Root-cause family | infinite-loop-recursion |
| Patch size | +29/-16, 1 files |
| Agent difficulty | 3/5 (few-lines) |

**Problem.** `rich.traceback` hangs on self-referential exception chains (`raise e from e`) and recurses infinitely on cyclic `ExceptionGroup`s, because `Traceback.extract` never tracks which exceptions it has already visited (issues #3708, #3682).

**Root cause.** `rich/traceback.py::Traceback.extract` (classmethod at line 410) walks the chain in a `while True:` loop (line 453). After appending a `Stack`, it follows `cause = getattr(exc_value, "__cause__", None)` (line 564); `if cause:` reassigns `exc_value = cause` and `continue`s (lines 565-572), with an analogous `__context__` branch (lines 574-580). When `e.__cause__ is e`, `exc_value` never changes: the loop spins forever, appending stacks until memory exhaustion — there is no identity check and no visited set. Independently, on Python 3.11+ each `BaseExceptionGroup` member is extracted recursively (lines 461-475) with no shared state, so a group containing itself — or a member whose `__context__` points back to the group, as happens when re-raising inside `except` handling — yields unbounded recursion. The truthiness test `if cause:` also skips exceptions with falsy `__bool__`/`__len__`.

**Reference fix.** A shared `_visited_exceptions: Optional[Set[BaseException]]` is threaded through `extract` (fresh set at top level). Group members already in the set are skipped; new ones are added before recursing with the same set. The cause/context walk is wrapped in `if not grouped_exceptions:` so chains are followed only at the top level — cutting context cycles through group members — plus an identity guard `cause is not exc_value` and `is not None` checks. `BaseException` hashes by identity, so the set detects cycles without collapsing distinct exceptions.

**Acceptance tests.** `tests/test_traceback.py::test_recursive_exception` — builds `raise e from e`, asserts `e is e.__cause__`, and requires `console.print_exception(show_locals=True)` to terminate.

**Agent notes.** The title and the test's minimal repro localize the bug well, but the base failure mode is a hang, not an assertion — run verification with a timeout (`pytest-timeout` or subprocess). A self-cause-only guard fixes #3708 but leaves cyclic groups (#3682) broken; both vectors need the visited set, and the `if not grouped_exceptions` guard is load-bearing. Must-nots: dedupe by `str(exc)` or type instead of identity, expose the new parameter publicly, or drop cause/context rendering for top-level exceptions. Re-run the full `tests/test_traceback.py` (groups, notes, chains) to catch over-deduplication.


### Subcategory: type-annotation-handling (4 tasks)


Interpretation of type annotations: Annotated/union/discriminator unwrapping, stringified-annotation evaluation, PEP 695 TypeAliasType, and field complexity classification.


#### fastapi_11355 — Fix evaluating stringified annotations in Python 3.10

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | type-annotation-handling |
| Root-cause family | type-introspection |
| Patch size | +9/-2, 1 file |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** In a module using `from __future__ import annotations`, a class-based dependency (`Annotated[str, Depends(Dep())]` where `Dep.__call__(self, request: Request)`) fails: the `Request` parameter is not recognized, so the endpoint 422s (or raises `NameError` under Pydantic v1). Same root issue as typer discussion #598, fixed there via typer PR #721.

**Root cause.** `fastapi/dependencies/utils.py::get_typed_signature` (lines 193-207) and `::get_typed_return_annotation` (lines 219-228) call `signature = inspect.signature(call)` without `eval_str`, then resolve string annotations manually: `globalns = getattr(unwrapped, "__globals__", {})` (line 196) and `annotation = evaluate_forwardref(annotation, globalns, globalns)` (line 213). For a callable instance like `Dep()`, `inspect.unwrap` returns the instance, which has no `__globals__`, so `globalns={}`. `ForwardRef("Request")` cannot resolve against an empty namespace: Pydantic v2's `eval_type_lenient` swallows the `NameError` and leaves a `ForwardRef`, so the parameter is not detected as starlette's `Request` and becomes a required query parameter (422 at request time); Pydantic v1 raises outright. Trigger: 3.10+, future annotations, callable-instance dependencies.

**Reference fix.** On Python 3.10+ both functions use `inspect.signature(call, eval_str=True)` (with the plain call kept for older versions; adds `import sys`). `inspect` evaluates string annotations in the defining function's own globals — including a bound `__call__`'s module — so `Request` resolves and is recognized as the special request parameter. The test's `GET /test` then returns 200.

**Acceptance tests.** `tests/test_stringified_annotations_simple.py::test_stringified_annotations` (new file; `needs_py310`).

**Agent notes.** Cues: title plus the typer cross-references; grep `inspect.signature(call)` in `fastapi/dependencies/utils.py` (two sites). The subtlety is the empty-`__globals__` lookup on unwrapped instances, not string evaluation itself. Keep the <3.10 fallback and the lenient `get_typed_annotation` path untouched. Caveat for the solver: `eval_str=True` is eager and later breaks `TYPE_CHECKING`-only annotations — the follow-up fix is fastapi_14485; running both regression tests together is the safest verification.


#### fastapi_12942 — Fix tagged discriminated union not recognized as body field

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | union-discriminator |
| Root-cause family | type-introspection |
| Patch size | +3/-0, 1 file |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** A Pydantic v2 tagged discriminated union used directly as an endpoint parameter — `Annotated[Union[Annotated[ApplePie, Tag("apple")], Annotated[PumpkinPie, Tag("pumpkin")]], Discriminator(fn)]` — is treated as a query parameter instead of a JSON body, producing validation errors. The documented workaround is an explicit `Body()`.

**Root cause.** `fastapi/_compat.py::field_annotation_is_complex` (lines 588-598) decides body-vs-query. `analyze_param` strips the outer `Annotated`, leaving a union whose members are themselves `Annotated[X, Tag(...)]`. The function recurses over union args (`if origin is Union or origin is UnionType:` line 590), but for each tagged member `get_origin()` returns `Annotated`, which hits neither the union branch nor the fall-through checks `_annotation_is_complex(annotation)` / `_annotation_is_complex(origin)` (lines 594-595): an annotated alias is not a `BaseModel`/`Mapping`/`UploadFile` subclass, sequence, or dataclass, and the `Annotated` special form has no pydantic schema hooks. Result: `False` → scalar query field → the JSON body is never parsed. Trigger: any tagged union (members individually wrapped in `Annotated[..., Tag]`) without explicit `Body()`.

**Reference fix.** Adds three lines: `if origin is Annotated: return field_annotation_is_complex(get_args(annotation)[0])`. Each tagged member unwraps to its model class, the union is classified complex, and the parameter is routed to the request body. The new test passes because both tagged variants validate from the JSON body and OpenAPI emits `requestBody` with `oneOf` plus a discriminator mapping, while `q` stays a query parameter.

**Acceptance tests.** `tests/test_union_body_discriminator.py::test_discriminator_pydantic_v2` (new file; `needs_pydanticv2`, uses `inline-snapshot` + `dirty-equals`).

**Agent notes.** Strong localization: the statement says to handle "Annotated types inside an Annotated type" and shows the full repro; grep `field_annotation_is_complex`. Note this base uses the monolithic `fastapi/_compat.py` (later tasks use the `_compat/` package). Verify with the new test plus existing union/body tests. Do not unwrap metadata args (only `get_args(...)[0]`), do not alter the Union branch, and do not "fix" the repro by adding `Body()` — implicit body detection must work. Pydantic v1 environments skip this path (`Tag` is v2-only).


#### fastapi_14485 — Fix support for `if TYPE_CHECKING`, non-evaluated stringified annotations

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | type-annotation-handling |
| Root-cause family | boundary-edge-case |
| Patch size | +13/-6, 1 file |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** With `from __future__ import annotations`, registering a dependency whose return annotation names a `TYPE_CHECKING`-only import (e.g. `AsyncGenerator` imported under `if TYPE_CHECKING:`) crashes at startup with `NameError`, even though FastAPI never needs that return annotation at runtime (discussion #14464, issue #14484).

**Root cause.** `fastapi/dependencies/utils.py::get_typed_signature` (lines 212-229) and `::get_typed_return_annotation` (lines 241-253) both call `signature = inspect.signature(call, eval_str=True)` on Python 3.10+ (lines 214, 243). `eval_str=True` eagerly evaluates every stringified annotation — including dependency return types — in the function's globals. `AsyncGenerator` exists only during type checking, so evaluation raises `NameError: name 'AsyncGenerator' is not defined` before FastAPI's own lenient per-annotation pass (`get_typed_annotation` with `eval_type_lenient`, which tolerates unresolved names) ever runs. This is a regression introduced by the `eval_str=True` change in fastapi_11355. Trigger: 3.10+, future annotations, any annotation referencing a `TYPE_CHECKING`-only name.

**Reference fix.** Extracts a shared `_get_signature(call)` helper: on 3.10+ it tries `inspect.signature(call, eval_str=True)` and, on `NameError`, falls back to `inspect.signature(call)` (annotations stay strings). Both callers use the helper, so resolvable annotations are still evaluated eagerly while unresolvable ones defer to the existing lenient evaluation. The dependency registers, `GET /` returns the people list, and the OpenAPI snapshot matches.

**Acceptance tests.** `tests/test_stringified_annotation_dependency.py::test_get`, `::test_openapi_schema` (new file; module uses future annotations + `TYPE_CHECKING` import).

**Agent notes.** Cues: title names `TYPE_CHECKING` and stringified annotations; the statement links the prior PR #11355. Grep `eval_str` in `fastapi/dependencies/utils.py` — exactly two call sites. Catch only `NameError` (broader catches hide real bugs), keep the <3.10 branch, and do not remove `eval_str` entirely — that reintroduces the 11355 bug. Verify with the new test plus `tests/test_stringified_annotations_simple.py` so both sides of the regression chain stay green.


#### fastapi_14512 — Fix support for tagged union with discriminator inside of `Annotated` with `Body()`

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | union-discriminator |
| Root-cause family | type-introspection |
| Patch size | +48/-4, 1 file |
| Agent difficulty | 3/5 (few-lines) |

**Problem.** A tagged union with a callable `Discriminator` fails when combined with `Body()`, both as `pet: Pet = Body()` and `pet: Annotated[Pet, Body()]` (discussion #14495, issue #14508). Requests that should validate against `Cat`/`Dog` error out instead.

**Root cause.** `fastapi/_compat/v2.py::ModelField.__post_init__` (lines 86-106) rebuilds the annotation for a standalone `TypeAdapter`: `annotated_args = (self.field_info.annotation, *self.field_info.metadata, self.field_info)` (lines 98-102). When `Body()` is merged with `Pet = Annotated[Union[Annotated[Cat, Tag], Annotated[Dog, Tag]], Discriminator(fn)]`, `FieldInfo.from_annotated_attribute` absorbs the `Discriminator` into `field_info.metadata`. The splat applies that metadata once, but the trailing `self.field_info` still carries the same `.metadata` internally, and Pydantic re-applies it when processing a `FieldInfo` inside `Annotated`. The discriminator therefore wraps the union schema twice; the outer callable receives already-validated model instances rather than the raw dict (the test's `get_pet_type` asserts `isinstance(v, dict)`), breaking validation. Trigger: tagged union + `Discriminator` + `Body()` in either declaration form.

**Reference fix.** Adds an `asdict()` shim replicating `FieldInfo.asdict()` (only available in Pydantic >= 2.12.3) with a fixed `_Attrs` table of field attributes, skipping `Undefined` values. The trailing `FieldInfo` is recreated as `Field(**field_dict["attributes"])` — same alias/default/etc., but empty metadata — so metadata is applied exactly once via `*field_dict["metadata"]`. Both endpoint forms then validate, and OpenAPI shows the `anyOf` of `Cat`/`Dog` refs per the snapshot.

**Acceptance tests.** `tests/test_union_body_discriminator_annotated.py::test_union_body_discriminator_assignment`, `::test_union_body_discriminator_annotated`, `::test_openapi_schema` (new file; `needs_pydanticv2`).

**Agent notes.** Cues are only the title and issue links; grep `ModelField.__post_init__` / `annotated_args` in `fastapi/_compat/v2.py`. The base already contains the metadata splat from fastapi_14482 — this task is its follow-up deduplication. Do not drop the trailing `FieldInfo` (loses alias/default) and do not remove the splat (reintroduces the arbitrary-types bug). Do not call `FieldInfo.asdict()` directly — older Pydantic lacks it; the shim is the point. Re-run `test_arbitrary_types.py` and `test_union_body_discriminator.py` to confirm attributes survive the rebuild.


### Subcategory: url-path-handling (2 tasks)


Request-target path normalization at the urllib3 boundary (leading-slash handling and its S3-presigned-URL regression).


#### requests_6644 — Trim excess leading path separators

| Field | Value |
|---|---|
| Repo | psf/requests |
| Kind | bugfix |
| Subcategory | url-path-handling |
| Root-cause family | boundary-edge-case |
| Patch size | +3/-0, 1 file |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** A URL with excess leading path separators, such as `http://127.0.0.1:10000//v:h`, produces the request target `//v:h`. urllib3's `ConnectionPool.urlopen` then reparses that target as a scheme-relative full URI with host `v` and port `h`, instead of sending it as a path to the intended server (issue #6643).

**Root cause.** `src/requests/adapters.py::HTTPAdapter.request_url` (lines 369-396) copies the prepared target verbatim: `url = request.path_url` (line 392) and, for non-proxied requests, `return url` (line 396) with no normalization. `PreparedRequest.path_url` preserves the doubled leading slash from the original URL. Because a target beginning with `//` is indistinguishable from a scheme-relative absolute URI, urllib3 extracts a netloc (`v:h`) and routes/validates against that bogus authority rather than treating the string as an origin-form path. Evidence: `url = request.path_url` followed directly by the proxy check and `return url`. Trigger: any URL whose path starts with two or more `/`, sent without an HTTP proxy (the proxied branch substitutes the full absolute URL regardless).

**Reference fix.** Insert immediately after line 392: `if url.startswith("//"): url = f"/{url.lstrip('/')}"`. This collapses any run of leading slashes to exactly one before the proxy branch, so `//v:h` becomes `/v:h` and urllib3 keeps it as a plain path. Mid-path `//` and query strings are untouched because `lstrip` only strips the front.

**Acceptance tests.** `tests/test_adapters.py::test_request_url_trims_leading_path_separators` — a new file created by test_patch (absent at base). It prepares `requests.Request("GET", "http://127.0.0.1:10000//v:h")` and asserts `HTTPAdapter().request_url(p, {}) == "/v:h"`.

**Agent notes.** Cues are strong: the statement names the symptom, the urllib3 locus, and the remedy; `grep "def request_url" src/requests/adapters.py` lands directly on it. Verify with `pytest tests/test_adapters.py` (offline) plus `-k url` in test_requests.py for regressions. Do not collapse non-leading slashes, do not alter the proxied absolute-URL branch, and do not relocate the fix into URL preparation (models.py) — the reference normalizes at the adapter boundary only.


#### requests_7315 — Preserve leading slashes in request path_url

| Field | Value |
|---|---|
| Repo | psf/requests |
| Kind | bugfix |
| Subcategory | url-path-handling |
| Root-cause family | api-contract-violation |
| Patch size | +0/-2, 1 file |
| Agent difficulty | 2/5 (one-line) |

**Problem.** `HTTPAdapter.request_url` collapses a leading `//` in the request path to `/`, corrupting S3 presigned URLs whose object key starts with `/` (issue #6711): the signature covers the canonical URI, so the rewritten path is rejected with 403.

**Root cause.** In `adapters.py::request_url` (lines 547-549), after `url = request.path_url` the code applies a legacy workaround: `if url.startswith("//"):  # Don't confuse urllib3` followed by `url = f"/{url.lstrip('/')}"`. For `https://bucket.s3.amazonaws.com//key_with_leading_slash.txt`, `path_url` is `//key_with_leading_slash.txt`, but the rewrite sends `/key_with_leading_slash.txt`. AWS SigV4 signs the exact canonical URI including the double slash, so the server-side signature no longer matches — the request-target rewrite violates the signed-URL contract. The collapse was added for old urllib3 behavior (issue #6643); the supported urllib3 range (`>=1.26,<3` in pyproject.toml) no longer needs it. Trigger: any path beginning with two or more slashes. The proxied-HTTP branch below still uses `urldefragauth(request.url)`, so proxying is unaffected.

**Reference fix.** Deletes the two-line collapse so `request_url` returns `path_url` verbatim for non-proxied requests. The reference test is renamed to `test_request_url_handles_leading_path_separators` and its assertion flipped from `"/v:h"` to `"//v:h"` for `http://127.0.0.1:10000//v:h`, which passes with the passthrough.

**Acceptance tests.** `tests/test_adapters.py::test_request_url_handles_leading_path_separators` (renamed from `test_request_url_trims_leading_path_separators`; assertion inverted).

**Agent notes.** PR names `request_url()`/`path_url` and says to remove the manipulation — localization is explicit. Pure unit test, no server. The trap: the inline comment and the BASE test both defend the old behavior, so after the edit the pre-patch test fails until test_patch flips it — that inversion is expected; do not revert or re-add the collapse elsewhere (e.g. in `models.py::path_url`). Difficulty 2 reflects this counter-evidence, not edit size.


### Subcategory: wrapped-callables (3 tasks)


Callable-kind introspection for dependables: inspect.unwrap/partial/__wrapped__ peeling, async-vs-sync/generator detection, class-vs-instance, and annotation globals.


#### fastapi_14448 — Fix support for functools wraps and partial combined, for async and regular functions and classes in path operations and dependencies

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | wrapped-callables |
| Root-cause family | type-introspection |
| Patch size | +82/-24, 2 files |
| Agent difficulty | 4/5 (multi-file) |

**Problem.** Combinations of `functools.wraps` and `functools.partial` around async/sync functions, generators, callable instances, and classes are misclassified in dependencies and endpoints (issue #14444): async wrappers are not awaited, partial-of-wrapped chains are not unwrapped, and wrapped `__call__` methods are missed.

**Root cause.** Single-layer introspection in `fastapi/dependencies/models.py::Dependant._unwrapped_call` (lines 78-85): `inspect.unwrap(self.call)` followed by peeling ONE partial collapses the chain to a single final object, and `is_gen_callable`/`is_async_gen_callable`/`is_coroutine_callable` (lines 87-108) inspect only that object and its `__call__`. Failures: (1) an **async wrapper around a sync callable** — the wrapper is async but the final target is sync, so detection says sync and `solve_dependencies` threadpools the async wrapper, returning an unawaited coroutine; (2) `partial(wrapped_fn)` — unwrap runs before the partial peel, leaving the sync wrapper un-unwrapped; (3) an instance whose `__call__` is itself wrapped — `dunder_call` is never unwrapped; (4) when both generator flags are True (async-gen wrapper around a sync gen), `fastapi/dependencies/utils.py::_solve_generator` (lines 547-555) checks `if dependant.is_gen_callable:` first and applies `contextmanager` to an async-gen function → `TypeError`. Evidence: `unwrapped = inspect.unwrap(self.call)` then `if isinstance(unwrapped, partial):`.

**Reference fix.** Module-level `_impartial` (peels ALL partial layers) and `_unwrapped_call` (unwrap after impartial); each `is_*` property now checks four views — impartial(call), unwrapped(call), and the `__call__` of each (also impartial'd/unwrapped) — returning True if **any** view is async/generator, implementing "if either is async, it has to be awaited". `_solve_generator` checks `is_async_gen_callable` **before** `is_gen_callable` so dual-classified callables take the async path.

**Acceptance tests.** `tests/test_dependency_wrapped.py::test_class_dependency` — 28 parametrized routes: sync/async wrappers × functions/generators/async variants/callable instances (plain and wrapped `__call__`)/classes, plus wrapped endpoints; all assert 200 and `true`.

**Agent notes.** The body states the invariant explicitly; the design work is applying it at every layer. Run the full 28-route matrix plus `test_dependency_partial.py`/`test_dependency_class.py` — partial fixes pass only subsets. Historical caution for the BCF brain: this rewrite dropped the `isclass` guard, causing the class-dependency regression fixed two days later in 14458; do not silently drop guard clauses during rewrites.


#### fastapi_14458 — Fix using class (not instance) dependency that has `__call__` method

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | wrapped-callables |
| Root-cause family | type-introspection |
| Patch size | +6/-1, 1 file |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** Regression since FastAPI 0.123.6 (discussion #14452): using a **class** (not an instance) as a dependency when the class defines an async or generator `__call__` crashes — FastAPI mistakes the class itself for a coroutine/generator.

**Root cause.** The 14448 multi-layer rewrite of `fastapi/dependencies/models.py::Dependant.is_gen_callable` (lines 105-127), `is_async_gen_callable` (129-151), and `is_coroutine_callable` (153-180) dropped the explicit `if inspect.isclass(...): return False` guard. For a class `C` with `async def __call__`, `getattr(C, "__call__")` is the plain async function, so the dunder branch (`if iscoroutinefunction(_impartial(dunder_call)) or ...`) returns True. `solve_dependencies` then runs `await call(**values)`: `C(**values)` constructs an instance synchronously, and awaiting it raises `TypeError: object C can't be used in 'await' expression`. A generator `__call__` similarly routes the class through `contextmanager`, whose `next()` on the constructed instance raises `TypeError: 'C' object is not an iterator`. Only *instances* are async/generator — the class is not. The stale comment at line 179, `# if inspect.isclass(self.call): False, covered by default return`, documents the wrong assumption: the dunder branch returns True before the default is reached.

**Reference fix.** Insert `if inspect.isclass(_unwrapped_call(self.call)): return False` after the first direct check in all three properties (using `_unwrapped_call` also covers wrapped/partial classes), and delete the stale comment. Classes now fall through to `run_in_threadpool(C, **values)`, constructing the instance, which the endpoint then calls itself.

**Acceptance tests.** `tests/test_dependency_class.py::test_class_dependency` — four new parametrized routes: `/callable-dependency-class`, `/callable-gen-dependency-class`, `/async-callable-dependency-class`, `/async-callable-gen-dependency-class` (class via `Annotated[..., Depends()]`), each asserting 200 and the echoed value; pre-existing instance/method routes must stay green.

**Agent notes.** The body names the three functions and the exact fix ("check if the callable is class before inspecting its dunder_call"). Apply the guard to **all three** properties, not just the coroutine one. Verify with the full `test_dependency_class.py` plus `tests/test_dependency_wrapped.py` to ensure wrapped async *instances* (14448 behavior) are unaffected — the guard fires only for actual classes.


#### fastapi_5077 — Add support for wrapped functions (e.g. `@functools.wraps()`) used with forward references

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | bugfix |
| Subcategory | wrapped-callables |
| Root-cause family | type-introspection |
| Patch size | +4/-2, 1 file |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** Registering an endpoint imported from another module and decorated with a `functools.wraps`-style wrapper crashes with `NameError` at route registration when its annotations use string forward references (issue #5065). Despite the ✨ gitmoji, this fixes a reported crash.

**Root cause.** Wrong evaluation namespace in `fastapi/dependencies/utils.py::get_typed_signature` (lines 193-206) and `get_typed_return_annotation` (lines 218-226). Both compute `globalns = getattr(call, "__globals__", {})` from the *wrapper*, which lives in the decorator's module. But `functools.wraps` copies the original `__annotations__` verbatim — including strings like `"ForwardRefModel"` defined in the *original* module. `get_typed_annotation` (lines 209-215) then runs `evaluate_forwardref(annotation, globalns, globalns)`, and the name is undefined in the wrapper's namespace: `NameError: name 'ForwardRefModel' is not defined` during `get_dependant`. `typing.get_type_hints` handles this by dereferencing `__wrapped__` to the original function and using *its* `__globals__`; FastAPI's parallel implementation missed that step. Trigger: cross-module function with forward-ref annotations wrapped once or twice with `@wraps`. Evidence: `globalns = getattr(call, "__globals__", {})`.

**Reference fix.** In both functions, `unwrapped = inspect.unwrap(call)` and take `globalns` from `unwrapped`. `inspect.signature` already follows `__wrapped__`, so only the namespace source needed fixing; `inspect.unwrap` traverses the full chain, so double wrapping works too.

**Acceptance tests.** `tests/test_wrapped_method_forward_reference.py::test_wrapped_method_type_inference` (with new helper `tests/forward_reference_type.py`); `/endpoint` (single wrap) and `/endpoint2` (double wrap) must both return `{"x": 1}`.

**Agent notes.** Localization is exceptional: the PR body embeds the full traceback down to `get_typed_signature`/`evaluate_forwardref` and links the CPython `get_type_hints` behavior to mirror. Fix *both* functions — patching only the parameter path leaves return-annotation `NameError`s. Do not alter `inspect.signature` usage. Verify with the new test plus existing annotated/forward-ref suites.


## Category: feature


Adds a new user-facing capability or public API that did not previously exist.


### Subcategory: cell-width-graphemes (1 tasks)


Character cell measurement and grapheme segmentation: width tables/fast-path regex, control/PUA codepoints, ZWJ/VS16 grapheme clusters, and the grapheme splitter.


#### rich_3930 — Handle graphemes

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | feature |
| Subcategory | grapheme-segmentation |
| Root-cause family | missing-capability |
| Patch size | +12170/-544, 26 files |
| Agent difficulty | 5/5 (large) |

**Problem.** Rich measured and split text per codepoint, so multi-codepoint emoji (ZWJ sequences such as female-mechanic, and variation-selector emoji) were measured too wide and could be torn apart by wrapping/cropping. This PR adds grapheme-aware measurement and splitting (rich issue #3897).

**Root cause.** A capability gap, not a defect. Base `rich/cells.py` computes `cell_len` as `sum(map(get_character_cell_size, text))` (line 48) over one static `CELL_WIDTHS` table, with no grapheme model and no Unicode-version selection. A ZWJ sequence (`U+1F469 U+200D U+1F527`) counts as 2+0+2=4 cells instead of the 2 a modern terminal draws, and `chop_cells`/`set_cell_size` can cut between the joiner and its neighbors, splitting one glyph across lines. No API returned per-grapheme spans, which wrapping needs to avoid mid-glyph cuts.

**Reference fix.** Add a `rich/_unicode_data` package: 21 auto-generated per-version `CellTable` modules (Unicode 4.1.0-17.0.0, data from wcwidth) plus a cached `load()` that parses versions, picks the nearest lower available version (clamping to first/last), falls back to latest on invalid input, and honors `UNICODE_VERSION` for "auto". Rewrite `cells.py` around `split_graphemes(text) -> (list[CellSpan], total_width)`; add ZWJ/VS16-aware `_cell_len`; make `split_text`/`set_cell_size`/`chop_cells` operate on grapheme spans; thread `unicode_version` through public functions. Lazy per-version import keeps startup low; the old `_cell_widths.py` is deleted.

**Acceptance tests.** `tests/test_cells.py::test_get_character_cell_size`, `::test_split_text`, `::test_split_graphemes`; `tests/test_text.py::test_wrap_long_multi_codepoint`, `::test_wrap_multi_codepoint`; new `tests/test_unicode_data.py::test_load`, `::test_parse_version`, `::test_load_version`, `::test_load_version_invalid`.

**Agent notes.** Data-heavy: ~11.6k of the +12.1k added lines are generated width tables across 23 new files (21 per-version table modules plus __init__.py and _versions.py). An agent cannot regenerate wcwidth tables offline; the tractable core is the loader plus the `cells.py` grapheme algorithms, with tables as data assets. Verify version selection (`load("5.0.1")=="5.0.0"`, `load("0")=="4.1.0"`, `load("18.0.0")=="17.0.0"`, `load("foo")=="17.0.0"`) and that `split_graphemes` of female-mechanic yields `([(0,3,2)],2)`. Risks: exact wcwidth parity, performance (caching/lazy import), and the breaking `cell_len` signature change. For BCF, treat as large/new-files requiring the reference data.


### Subcategory: console-tty-detection (2 tasks)


Terminal/interactivity detection and environment overrides (TTY_COMPATIBLE, TTY_INTERACTIVE, FORCE_COLOR, NO_COLOR) and FileProxy isatty delegation.


#### rich_3675 — TTY_COMPATIBLE

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | feature |
| Subcategory | console-tty-detection |
| Root-cause family | — |
| Patch size | +28/-13, 2 files |
| Agent difficulty | 2/5 (multi-file) |

**Problem.** CI environments such as GitHub Actions render ANSI escape sequences but are pipes, so `file.isatty()` is False and Rich strips all styling. There is no explicit environment switch to declare a stream tty-compatible (or not), and the existing `FORCE_COLOR` override is crude: any value — even empty — forces terminal mode.

**Root cause.** Capability gap in base `rich/console.py::Console.is_terminal` (lines 930-964): after the explicit/Idle/Jupyter checks it does `force_color = self._environ.get("FORCE_COLOR")` and, if present, sets `self._force_terminal = True` and returns True — presence alone forces terminal and permanently latches the cached override; otherwise it falls back to `isatty()`. Separately, `__init__` (lines 737-739) computes `no_color` as `"NO_COLOR" in self._environ`, so an empty `NO_COLOR` also disables color, contrary to the no-color.org convention.

**Reference fix.** `is_terminal` gains a `TTY_COMPATIBLE` check before FORCE_COLOR: `"0"` → return False, `"1"` → return True, both without calling `isatty()`; other values fall through. FORCE_COLOR becomes `return force_color != ""` (force-color.org semantics) with the caching side effect removed. `no_color` env fallback becomes `self._environ.get("NO_COLOR", "") != ""`. `diagnose.py` reports `TTY_COMPATIBLE` (tuple also sorted). The new test's `FakeTTY`/`FakeFile` stubs record `called_isatty`, pinning both outcomes and the short-circuit ordering.

**Acceptance tests.** `tests/test_console.py::test_tty_compatible` (new; the 27KB test patch is otherwise mostly `-> None` annotation churn). Regressions: `test_force_color_jupyter`, `test_no_color`, full `tests/test_console.py`.

**Agent notes.** Localize via the PR title and the new test. Key spec points: env overrides must short-circuit *before* `isatty()`; only `"0"`/`"1"` are meaningful `TTY_COMPATIBLE` values; empty `FORCE_COLOR`/`NO_COLOR` must not force anything; keep Idle/Jupyter checks first. Caveat: the recorded test patch leaves parametrized `test_force_color[""]` asserting `is_terminal`, which contradicts the reference patch's `FORCE_COLOR="" → False` semantics — implement the reference semantics and treat `test_tty_compatible` as defining; do not restore the old any-value behavior to satisfy that stale case.


#### rich_3777 — TTY_INTERACTIVE env var

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | feature |
| Subcategory | console-tty-detection |
| Root-cause family | — |
| Patch size | +12/-1, 2 files |
| Agent difficulty | 2/5 (multi-file) |

**Problem.** CI systems like GitHub Actions are not real TTYs but understand ANSI. The earlier `TTY_COMPATIBLE=1` switch makes Rich treat them as terminals — which also turns on interactive animations (progress bars, status spinners) that pollute CI logs. There is no way to keep styling but disable interactivity via the environment.

**Root cause.** Capability gap, not a defect: in base `rich/console.py::Console.__init__` (lines 734-738), `self.is_interactive = (self.is_terminal and not self.is_dumb_terminal) if force_interactive is None else force_interactive`. Interactivity is derived directly from terminal detection with no environment hook in between, so `TTY_COMPATIBLE=1` (handled in `is_terminal`, lines 951-957) inevitably enables animations too. A second, orthogonal switch is needed.

**Reference fix.** Inserts a block in `__init__` just before the `is_interactive` computation: when `force_interactive is None`, read `TTY_INTERACTIVE` from `self._environ` — `"0"` sets `force_interactive=False`, `"1"` sets `True`, anything else leaves it `None` (auto-detect). The explicit constructor argument keeps precedence. `rich/diagnose.py` adds `"TTY_INTERACTIVE"` to the reported `env_names` tuple; the patch also folds the stray `from typing import Literal, Protocol, runtime_checkable` line into the main typing import (cosmetic).

**Acceptance tests.** `tests/test_console.py::test_tty_interactive` (new): BytesIO alone → not interactive; `TTY_INTERACTIVE=1` → interactive; `TTY_COMPATIBLE=1` → interactive; `TTY_COMPATIBLE=1` + `TTY_INTERACTIVE=0` → constructs with interactivity off; `TTY_INTERACTIVE="foo"` → auto-detect, not interactive. Regression: `test_tty_compatible`.

**Agent notes.** The PR body names the var, its values, and its purpose — strong localization. Insert the block *before* the `is_interactive` assignment (after it, it does nothing); only apply it when `force_interactive is None`; unknown values must fall through to auto-detection. Verify with `pytest tests/test_console.py::test_tty_interactive tests/test_console.py::test_tty_compatible`. Note the combined `TTY_COMPATIBLE=1`/`TTY_INTERACTIVE=0` case has no assertion in the recorded test, but the intended semantics are `is_terminal=True`, `is_interactive=False`.


### Subcategory: dependency-injection (2 tasks)


Depends/Security declaration mechanics, resolution, scope-aware caching, and yield-dependency lifecycle (dual exit stacks, function/request scopes).


#### fastapi_14262 — Add support for dependencies with scopes, support `scope="request"` for dependencies with `yield` that exit before the response is sent

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | feature |
| Subcategory | dependency-scopes |
| Root-cause family | — |
| Patch size | +196/-70, 10 files |
| Agent difficulty | 5/5 (large) |

**Problem.** Add `Depends(func, scope=...)` so dependencies with `yield` control when their exit code runs: `"function"` exits after the path operation function returns but **before** the response is sent; `"request"` (the default) exits **after** the response is sent. This is a new lifecycle capability, not a defect.

**Root cause.** Capability gap: at base there is one `AsyncExitStack` per request. `fastapi/routing.py::request_response`/`websocket_session` (lines 104-124, 142-150) open it as `scope["fastapi_inner_astack"]`, and `solve_dependencies` enters every generator dependency on it (`utils.py::solve_generator`, lines 558-565). It unwinds only after `await response(scope, receive, send)`, so post-yield cleanup always runs after the response — no early-release option for streaming. `Dependant` (models.py lines 14-37) has no `scope` field, `cache_key` is a 2-tuple, and `params.Depends` (params.py lines 765-769) accepts no `scope`.

**Reference fix.** Nest a second `function_stack` inside the request stack in both session wrappers (`fastapi_function_astack`); add `scope` to `params.Depends`/`Depends()` and thread it through `get_dependant`; move callable-kind detection onto `Dependant` cached properties plus `computed_scope` (generators default to `"request"`); extend the cache key to a 3-tuple (`DependencyCacheKey`); select the function stack when `sub_dependant.scope == "function"`; add `DependencyScopeError` for request-scoped generators depending on function-scoped ones; endpoint dependants get `scope="function"`; add three `docs_src` tutorial008e variants.

**Acceptance tests.** `tests/test_dependency_yield_scope.py` and `tests/test_dependency_yield_scope_websockets.py` (each: `test_function_scope`, `test_request_scope`, `test_two_scopes`, `test_sub`, `test_broken_scope`, `test_named_function_scope`, `test_regular_function_scope`); `tests/test_tutorial/test_dependencies/test_tutorial008e.py::test_get_users_me`.

**Agent notes.** No file paths in the statement — derive the design from the PR body semantics. Verify HTTP and WebSocket timing separately (function-scope streaming sees `is_open False`, request-scope `True`); `test_broken_scope` asserts the error text verbatim. Run the full dependency/cache/security suites (cache-key shape change is cross-cutting). Create the `docs_src` files or tutorial tests fail. Keep default request-scope teardown. Foundation for batch tasks 14301, 5624, 14419.


#### fastapi_14794 — Allow `Response` type hint as dependency annotation

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | feature |
| Subcategory | dependency-injection |
| Root-cause family | — |
| Patch size | +3/-2, 1 files |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** Combining a special FastAPI type with `Depends` — `response: Annotated[Response, Depends(modify_response)]` or `response: Response = Depends(modify_response)` — crashes at startup with `AssertionError: Cannot specify Depends for type Response` (issue #10127). The feature makes the dependency run normally and injects its return value, while plain `response: Response` injection keeps working.

**Root cause.** Capability gap in `fastapi/dependencies/utils.py::analyze_param` (lines 451-466): after `Depends` is collected from `Annotated` or the default value, the special-type branch tests `lenient_issubclass(type_annotation, (Request, WebSocket, HTTPConnection, Response, StarletteBackgroundTasks, SecurityScopes))` unconditionally and then asserts `depends is None` (line 463, the exact quoted error). The branch never considers that an explicit `Depends` should win, and the following `elif` (line 468) also requires `depends is None`, so a special-typed parameter with `Depends` has no valid resolution path and route registration fails.

**Reference fix.** Guard the branch with `if depends is None and lenient_issubclass(...)` and delete the redundant `assert depends is None` line. With a `Depends` present, both the special-injection branch and the `elif` are skipped, so `ParamDetails` carries the dependency with `field=None`: the callable is invoked (its own `Response`/`Request` parameters still get direct injection) and its return value is injected into the endpoint. The `field_info` assertion for special types without `Depends` is retained, so `Query()`/`Body()` on special types still errors.

**Acceptance tests.** New file `tests/test_response_dependency.py` (7 tests): `test_response_with_depends_annotated`, `test_response_with_depends_default`, `test_response_without_depends`, `test_response_dependency_chain`, `test_response_dependency_returns_different_response_instance` (a dependency returning a fresh `JSONResponse` is honored), `test_request_with_depends_annotated`, `test_background_tasks_with_depends_annotated`.

**Agent notes.** The quoted assertion message greps directly to the locus; the PR also names `analyze_param`. The edit is tiny but branch semantics matter: do not delete the special-type branch (plain injection must survive) and do not drop the `field_info` guard. Leave lines 446-449 intact (they substitute the annotation as the dependency when `Depends()` has no callable). Verify with the new test file plus `tests/test_dependency_*.py` and response-class suites. The test file is created by `test_patch` and is absent at base — do not modify tests.


### Subcategory: error-messages (1 tasks)


Quality and content of raised exception/validation messages (fail-fast guards, endpoint context, exact message strings).


#### fastapi_14258 — Show a clear error on attempt to include router into itself

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | feature |
| Subcategory | error-messages |
| Root-cause family | missing-capability |
| Patch size | +4/-0, 1 file |
| Agent difficulty | 1/5 (one-line) |

**Problem.** `router.include_router(router)` (self-inclusion) previously produced a confusing downstream failure instead of a clear explanation. This feature (gitmoji ✨) adds a fail-fast guard with an actionable message.

**Root cause.** Capability gap, not a defective line. `fastapi/routing.py::APIRouter.include_router` (def at line 1261) starts its body at `if prefix:` (line 1396) with no identity check between `self` and the `router` argument. Self-inclusion copies a router's routes into itself and merges its lifespan with itself, causing recursion/duplication and an obscure error far from the cause. The missing capability is an early, explicit guard.

**Reference fix.** Insert a single assertion at the top of the method body (after the docstring, before `if prefix:`): `assert self is not router, ("Cannot include the same APIRouter instance into itself. Did you mean to include a different router?")`. Identity comparison (`is not`) leaves distinct routers unaffected. +4/-0 in one file.

**Acceptance tests.** New `tests/test_router_circular_import.py::test_router_circular_import` — `pytest.raises(AssertionError, match="Cannot include the same APIRouter instance into itself. Did you mean to include a different router?")` around `router.include_router(router)`.

**Agent notes.** Obvious locus (top of `include_router`); the new test pins the exact exception type and message, so this is essentially copy-the-message. Use identity, not equality. The guard covers only direct self-inclusion, not longer cycles (A→B→A) — do not over-engineer full cycle detection. The test file is created by `test_patch` (absent at base). Verify with `pytest tests/test_router_circular_import.py` plus existing include-router tests.


### Subcategory: markdown-rendering (1 tasks)


Markdown element rendering: table cell accumulation/styling, empty-cell/partial-table guards, and the heading/rule/table design snapshot.


#### rich_3942 — Update to markdown styles

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | feature |
| Subcategory | markdown-rendering |
| Root-cause family | — |
| Patch size | +43/-27, 2 files |
| Agent difficulty | 3/5 (multi-file) |

**Problem.** A deliberate visual refresh of the `Markdown` renderable: new heading hierarchy, dim dashed horizontal rules, and lighter cyan-bordered tables. No defect is involved; the updated byte-exact ANSI snapshots in three test files define acceptance.

**Root cause.** Capability gap / design change. At base, `rich/markdown.py::Heading.__rich_console__` (lines 143-160) centers every heading, wraps h1 in `Panel(box.HEAVY)` and emits a blank line before h2; `HorizontalRule` (lines 218-222) yields a solid yellow `Rule`; `TableElement` (lines 241-255) uses `Table(box=box.SIMPLE_HEAVY)` with default-bold headers; `rich/default_styles.py` (lines 152-165) carries the old yellow/bold palette. The PR replaces this design language wholesale.

**Reference fix.** `Heading` gains `LEVEL_ALIGN` (h1 center, h2-h6 left) and yields `self.text.copy()` with per-level justify — no Panel, no h2 spacer. `HorizontalRule` yields `Rule(characters="-")` plus a trailing `Text()`. `TableElement` switches to `Table(box=box.SIMPLE, pad_edge=False, style="markdown.table.border", show_edge=True, collapse_padding=True)` and stylizes a copy of each header cell with `markdown.table.header`. `default_styles.py` retunes the palette: bullets bold-only, numbers cyan, hr dim, h1 bold+underline, h2 magenta+underline, h3 magenta+bold, h4 magenta+italic, h5 italic, h6 dim, and adds `markdown.table.border` (cyan) / `markdown.table.header` (cyan, bold=False).

**Acceptance tests.** `tests/test_markdown.py::test_markdown_render`, `::test_markdown_table`, `::test_inline_styles_in_table`, `::test_inline_styles_with_justification`, `::test_partial_table`; `tests/test_markdown_no_hyperlinks.py::test_markdown_render`; `tests/test_card.py` via the rewritten 27KB `tests/_card_render.py` expected constant.

**Agent notes.** The statement is vague ("Updates to Markdown styling") — the test_patch is the real specification. Solve by diffing renders against the embedded expected strings and reverse-engineering each design choice. Must-nots: mutate `self.text` in place (copy first), style the original header Text instead of a copy, drop the HR's trailing blank line, or change table row counts (`test_table_with_empty_cells` compares line counts). The reference's `HeadingFormat` dataclass is unused scaffolding; match observable output, not dead code.


### Subcategory: openapi-schema-generation (2 tasks)


OpenAPI/JSON-Schema construction, model naming/ref resolution, schema caching, and docs-UI serving/escaping (fastapi/openapi, _compat schema generators).


#### fastapi_13713 — Add OpenAPI external_docs parameter to FastAPI

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | feature |
| Subcategory | openapi-schema-generation |
| Root-cause family | — |
| Patch size | +31/-0, 2 files |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** `FastAPI()` had no way to set the OpenAPI root-level `externalDocs` field, and `get_openapi()` neither accepted nor emitted it. The PR adds an `openapi_external_docs` constructor parameter plumbed into the generated schema.

**Root cause.** Capability gap (the author calls it an oversight). Base `fastapi/openapi/utils.py::get_openapi` (lines 476-568) assembles `output` with servers/components/paths/webhooks/tags — ending `output["tags"] = tags` then `return jsonable_encoder(OpenAPI(**output), by_alias=True, exclude_none=True)` — with no `externalDocs` key. `fastapi/applications.py::FastAPI.__init__` stores the `openapi_*` settings (lines 832-841) and `FastAPI.openapi()` (line 966) forwards them (lines 992-994), but no external-docs setting existed. The `OpenAPI` pydantic model already supports the field via its `externalDocs` alias (the patch does not touch `openapi/models.py`), so only plumbing was missing.

**Reference fix.** Adds `openapi_external_docs: Optional[Dict[str, Any]] = None` (with `Doc`) to `FastAPI.__init__`, stores `self.openapi_external_docs`, passes `external_docs=self.openapi_external_docs` in `openapi()`; adds the `external_docs` parameter to `get_openapi` and emits `output["externalDocs"] = external_docs` when truthy, before `OpenAPI(**output)` validation/alias encoding.

**Acceptance tests.** `tests/test_application.py::test_openapi_schema` — full-schema snapshot now includes `externalDocs` (`description: "External API documentation."`, `url: "https://docs.example.com/api-general"`); the fixture `tests/main.py` constructs `FastAPI(openapi_external_docs=external_docs)`.

**Agent notes.** Follow the existing `openapi_tags`/`servers` plumbing pattern; loci are named in the PR body. Verify with `pytest tests/test_application.py` plus OpenAPI snapshot suites (schemas must be unchanged when the parameter is absent, thanks to `exclude_none`). Use the camelCase key `externalDocs` in the output dict; constructor name is `openapi_external_docs` while `get_openapi`'s parameter is `external_docs`. `tests/main.py` belongs to test_patch — do not edit it as source.


#### fastapi_15785 — Add `iter_route_contexts()` for advanced use cases that used to use `router.routes` (e.g. Jupyverse)

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | feature |
| Subcategory | openapi-schema-generation |
| Root-cause family | missing-capability |
| Patch size | +66/-15, 2 files |
| Agent difficulty | 3/5 (multi-file) |

**Problem.** After the include-context refactor (fastapi_15745) made `router.routes` hold `_IncludedRouter` wrappers, advanced consumers such as Jupyverse that iterated `router.routes` to inspect/filter routes and build custom OpenAPI schemas lost access to effective (prefix-applied) paths and metadata. This feature (gitmoji ✨) adds a public iteration API and lets OpenAPI generation consume it.

**Root cause.** Capability gap. `router.routes` now contains `_IncludedRouter` wrappers (`fastapi/routing.py` line 1458), so reading `route.path/name/methods` directly no longer yields effective values. The only iterator, `_iter_routes_with_context` (line 1657), is private and yields `(route, _EffectiveRouteContext|None)` tuples. OpenAPI entry points accepted only `Sequence[BaseRoute]` — `get_fields_from_routes` (`openapi/utils.py` line 494) and `get_openapi` (lines 534-535) — via `_get_api_route_for_openapi(route, route_context)` (lines 481-490). There was no public way to obtain effective contexts, filter them (e.g. by tag), and pass them back to `get_openapi` for partial schemas or webhooks.

**Reference fix.** Add a public frozen dataclass `RouteContext(route, _route_context=None)` with `original_route/path/path_format/name/methods/endpoint` properties and `__getattr__` delegating to the effective route, plus a public generator `iter_route_contexts(routes)` accepting `BaseRoute | RouteContext`. Refactor `_get_api_route_for_openapi` to take a single `RouteContext`, and widen `get_fields_from_routes`/`get_openapi` to `Sequence[BaseRoute | RouteContext]`, iterating `iter_route_contexts` for routes and webhooks. Plain-route sequences still work.

**Acceptance tests.** `tests/test_router_include_context.py::test_iter_route_contexts_returns_direct_route_context`, `::test_iter_route_contexts_supports_nested_conflict_detection`, `::test_get_openapi_accepts_filtered_route_contexts_with_effective_paths` (paths `{"/api/public"}` + `HTTPBearer`), `::test_get_openapi_accepts_webhook_route_contexts`.

**Agent notes.** Feature + refactor over the existing private machinery; tests pin the public surface and effective-path semantics. `RouteContext` must delegate attribute access so tags/security resolve to effective values. Keep backward compatibility for plain `BaseRoute` sequences and webhook/security-scheme collection. Depends on fastapi_15745. Verify with the include-context file plus the broader OpenAPI suite.


### Subcategory: prompt-input (1 tasks)


Interactive Prompt.ask behavior: choice validation/case-insensitive matching and markup-safe error rendering.


#### rich_3052 — Case insensitive prompt choices

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | feature |
| Subcategory | prompt-input |
| Root-cause family | — |
| Patch size | +29/-5, 1 files |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** `Prompt.ask(..., choices=[...])` validates responses case-sensitively, so typing "paul" for choice "Paul" is rejected. The PR adds an opt-in `case_sensitive=False` flag that accepts any casing while returning the canonical choice spelling; default `True` preserves current behavior.

**Root cause.** Capability gap rather than a defect. `prompt.py::PromptBase.check_choice` (lines 205-215) performs exact membership — `return value.strip() in self.choices` (line 215) — and `process_response` (lines 217-238) returns `self.response_type(value)`, the user's raw spelling. There is no opt-out for case folding and no normalization back to a listed choice, which interactive CLI users expect when choices are proper nouns.

**Reference fix.** Thread `case_sensitive: bool = True` through `PromptBase.__init__` (stored as `self.case_sensitive`), all three `ask` `@overload` signatures plus the concrete `ask`, and the constructor pass-through. `check_choice` compares `value.strip().lower()` against lowercased choices when the flag is False. `process_response`, after validation, maps the input back via `self.choices[[choice.lower() for choice in self.choices].index(value.lower())` so the original casing ("foo", not "FoO") is returned. The `__main__` demo gains a case-insensitive example.

**Acceptance tests.** `tests/test_prompt.py::test_prompt_str_case_insensitive` — input `"egg\nFoO"`: "egg" is rejected with the illegal-choice message and re-prompt, "FoO" is accepted and returned as `"foo"`; the exact console output string is asserted.

**Agent notes.** Strong cues: the statement names `Prompt.ask`, `choices`, and the exact flag with a usage example; everything lives in `rich/prompt.py`. Add the keyword to every overload and the implementation or `Prompt.ask(case_sensitive=False)` raises `TypeError`. Return the canonical choice, not the lowercased input. Keep the default `True` so existing tests pass unchanged, and do not disturb `Confirm.process_response`, which already lowercases. Verify with the full `tests/test_prompt.py`, checking the re-prompt output byte-for-byte.


### Subcategory: response-serialization (1 tasks)


Response model inference and body serialization (return-annotation normalization, dump_json fast path, status-code body rules).


#### fastapi_9425 — Allow `None` as return type for bodiless responses

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | feature |
| Subcategory | response-serialization |
| Root-cause family | type-introspection |
| Patch size | +2/-0, 1 files |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** A route whose return annotation is the string `"None"` — what `from __future__ import annotations` produces for `-> None` — cannot use `204 No Content`: app startup fails with `AssertionError: Status code 204 must not have a response body` (issue #9424). The PR makes the stringified form behave like the literal one.

**Root cause.** A `None` vs `NoneType` asymmetry in type introspection. For a literal `-> None`, `inspect.signature(...).return_annotation` is `None` (falsy — verified empirically on local Python 3.12), so `response_model` stays `None` and no response field is built. For the stringified form, `fastapi/dependencies/utils.py::get_typed_annotation` (lines 253-257) runs `annotation = ForwardRef(annotation)` then `annotation = evaluate_forwardref(annotation, globalns, globalns)`, which yields `type(None)` — a truthy class object — and returns it unchanged. Downstream, `routing.py::APIRoute.__init__` infers `response_model = return_annotation` and, because `if self.response_model:` is truthy for `NoneType`, enters the body branch and hits `assert is_body_allowed_for_status_code(status_code)`, which rejects 204/304. Trigger: `@app.get("/no-content", status_code=204)` on `def return_no_content() -> "None"`; the crash happens at route registration, before any request. (routing.py was not extracted at this base; the inference/assert pattern was confirmed in a later extracted base, lines 605-649.)

**Reference fix.** Inside the string branch of `get_typed_annotation`, after evaluation, add `if annotation is type(None): return None`. The stringified annotation now normalizes to the same falsy `None` as the literal form, `response_model` remains `None`, no response field is created, and bodiless status codes pass the assertion. All other annotations are untouched.

**Acceptance tests.** New file `tests/test_return_none_stringified_annotations.py::test_no_content`: a `-> "None"` route with `status_code=http.HTTPStatus.NO_CONTENT` must return 204 with an empty body.

**Agent notes.** Localization: the PR body says to return `None` when the annotation is exactly `"None"`, pointing at forward-ref evaluation; grep `evaluate_forwardref` in `dependencies/utils.py`. Keep the normalization inside the `isinstance(annotation, str)` branch — `get_typed_annotation` also serves parameter annotations via `get_typed_signature`, and the reference deliberately limits the change to evaluated strings. Verify with the new test plus response-model and status-code suites. Although labeled with the feature gitmoji, this corrects a real startup crash, so treat it as a bug-shaped fix. Do not modify tests.


### Subcategory: routing (2 tasks)


APIRouter/app route composition: include_router identity, lifespan/startup wiring, route-context iteration, static/frontend dispatch, and decorator surface.


#### fastapi_15280 — Add support for @app.vibe()

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | feature |
| Subcategory | routing |
| Root-cause family | — |
| Patch size | +71/-1, 2 files |
| Agent difficulty | 1/5 (few-lines) |

**Problem.** April Fool's novelty feature (created 2026-04-01): add an `@app.vibe()` path-operation decorator that takes a path and an LLM-style `prompt`, parodying "vibe coding" endpoints with no validation, documentation, or serialization.

**Root cause.** Capability gap, deliberately non-functional. Base `fastapi/applications.py` defines all HTTP-method decorators (through `trace`, ending near line 4560) and `websocket_route` (line 4562) but no `vibe` method, and line 13 imports only `RequestValidationError, WebSocketRequestValidationError` from `fastapi.exceptions` — `FastAPIError` is not imported. The added "capability" is a decorator whose entire body raises `FastAPIError("Are you kidding me? Happy April Fool's")` at decoration time.

**Reference fix.** Adds `FastAPI.vibe(self, path, *, prompt="")` with the usual `Annotated[..., Doc(...)]` signature boilerplate and a docstring example, body `raise FastAPIError(...)`; imports `FastAPIError`; creates `docs_src/vibe/tutorial001_py310.py` demonstrating usage. No route is registered and no LLM integration exists.

**Acceptance tests.** `tests/test_vibe.py::test_vibe_raises` — `pytest.raises(FastAPIError, match="Are you kidding me")` wrapped around the `@app.vibe(...)` decoration.

**Agent notes.** Trivial: one method in `fastapi/applications.py` plus the import; copy the signature style of neighboring decorators. Verify with `pytest tests/test_vibe.py`. The raise must occur at decoration time (not request time), `prompt` must be keyword-only defaulting to `""`, and the message must contain "Are you kidding me". An agent must not implement real functionality — the joke raise is the entire specification.


#### fastapi_15800 — Add support for app.frontend("/", directory="dist") and router.frontend("/", directory="dist")

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | feature |
| Subcategory | routing |
| Root-cause family | — |
| Patch size | +649/-5, 8 files |
| Agent difficulty | 5/5 (large) |

**Problem.** FastAPI had no built-in way to serve a static frontend build (SPA) alongside the API. The PR adds `FastAPI.frontend()` / `APIRouter.frontend()` with SPA fallback (`auto`/`index.html`/`404.html`), served as low-priority routes consulted only after normal routes fail.

**Root cause.** Capability gap. Base `fastapi/routing.py::APIRouter` (line 1723) inherits Starlette `Router.app` and never overrides it, so unmatched paths go straight to the default 404 — there is no post-pass for static serving. The `_IncludedRouter`/`_EffectiveRouteContext` machinery (lines 1315-1720) propagates normal routes through `include_router` prefixes but has no low-priority channel. Users had to `Mount(StaticFiles(html=True))` with manual ordering, no Accept-aware `index.html` fallback for client-side routes, and risk of the frontend shadowing API routes.

**Reference fix.** Adds `_FrontendStaticFiles(StaticFiles)` (fallback resolution: auto prefers `404.html`, then `index.html` only for navigation requests; GET/HEAD-only 405; PermissionError→401; ENAMETOOLONG→404; directory index + trailing-slash redirect; `follow_symlink=False`), Accept/q-value parsing (`_is_frontend_navigation_request`), `_FrontendRoute`/`_FrontendRouteGroup` with longest-prefix segment-boundary matching, and an overridden `APIRouter.app` implementing: FULL match → first PARTIAL → slash redirect → `_match_low_priority` (propagated through included routers with a version-keyed cache) → default. `FastAPI.frontend()` delegates to the router; six tutorials added.

**Acceptance tests.** `tests/test_frontend.py` — 47 tests, notably `test_existing_api_route_wins_over_frontend`, `test_api_route_404_is_not_replaced_by_frontend_fallback`, `test_index_fallback_*` (Accept/q=0 semantics), `test_auto_fallback_prefers_404_over_index`, `test_multiple_frontends_use_longest_matching_prefix`, `test_nested_apirouter_frontend_uses_all_include_prefixes`, `test_path_traversal_cannot_escape_directory`, `test_symlink_outside_directory_is_not_served`, `test_frontend_routes_are_not_in_openapi`, `test_frontend_respects_root_path`.

**Agent notes.** The title gives the exact API; the test file is the full specification. Verify with `pytest tests/test_frontend.py` plus include-router/OpenAPI regression suites. Priority order is load-bearing (frontend must never swallow API 404s, partial matches, or slash redirects); implement as a post-pass in `APIRouter.app`, not by reordering routes or using `Mount`. Handle cache invalidation via `_routes_version`, keep frontend routes out of OpenAPI, and respect `root_path`.


### Subcategory: status-codes (1 tasks)


HTTP status-code name registry (RFC alias registration).


#### requests_6592 — "TOO_EARLY" type definition for status code 425

| Field | Value |
|---|---|
| Repo | psf/requests |
| Kind | feature |
| Subcategory | status-codes |
| Root-cause family | — |
| Patch size | +1/-1, 1 file |
| Agent difficulty | 1/5 (one-line) |

**Problem.** `requests.codes` does not know the RFC 8470 name "Too Early" for HTTP 425. Only the older RFC 4918 WebDAV names are registered, so `requests.codes.TOO_EARLY` raises and `requests.codes.get("too_early")` returns `None` (issue #6584).

**Root cause.** Capability gap, not a logic defect: `src/requests/status_codes.py::_codes[425]` (line 82) is `425: ("unordered_collection", "unordered")`. The module's `_init()` (lines 109-114) walks each title tuple and does `setattr(codes, title, code)` plus `setattr(codes, title.upper(), code)` on the `LookupDict`, so any name absent from the tuple simply never exists. The registry entry predates RFC 8470's reuse of 425 for early-data semantics and was never extended.

**Reference fix.** Append the alias: `425: ("unordered_collection", "unordered", "too_early")`. `_init()` then auto-registers both `too_early` and `TOO_EARLY`, and the generated module docstring picks up the new name through `doc(code)`. No other code paths need changes — the tuple is the single extension point.

**Acceptance tests.** `tests/test_requests.py::TestPreparingURLs::test_status_code_425` — asserts all six lookups (`TOO_EARLY`, `too_early`, `UNORDERED`, `unordered`, `UNORDERED_COLLECTION`, `unordered_collection`) via `requests.codes.get` equal 425. The reference test_patch places it inside `TestPreparingURLs` after `test_json_decode_persists_doc_attr` (base line 2793); the placement is incidental.

**Agent notes.** The statement names the code, the alias, and the RFCs — `grep 425 src/requests/status_codes.py` is the whole localization. Verify with `pytest tests/test_requests.py -k status_code_425` (offline). Keep the existing aliases intact (the test checks all six), and do not hand-register attributes outside the `_init()` loop. `structures.LookupDict` was not extracted, but its semantics are evidenced by `_init()` and the module docstring examples.


### Subcategory: streaming-sse (1 tasks)


Streaming transports: Server-Sent Events framing/encoding/keep-alive and JSONL/raw streaming response integration.


#### fastapi_15030 — Add support for Server Sent Events

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | feature |
| Subcategory | streaming-sse |
| Root-cause family | — |
| Patch size | +525/-35, 9 files |
| Agent difficulty | 5/5 (new-files) |

**Problem.** FastAPI supported JSONL streaming for generator endpoints but had no first-class Server-Sent Events transport. Users wanting `text/event-stream` (browser EventSource, MCP over POST, token streaming) had to hand-roll framing on `StreamingResponse`, losing validation, OpenAPI schema, and keep-alive.

**Root cause.** Capability gap. In base `fastapi/routing.py::get_request_handler` (lines 455-530) only `is_json_stream` was special-cased; other generator endpoints fell into the raw-streaming branch, yielding objects unframed. `APIRoute.__init__` gated stream-item extraction (line 714) and `self.is_json_stream = isinstance(response_class, DefaultPlaceholder) and (...)` (line 819) on the default response class, so an SSE opt-in could not get per-item validation. `fastapi/openapi/utils.py::get_openapi_path` (lines 360-374) only emitted `application/jsonl` itemSchema.

**Reference fix.** New `fastapi/sse.py`: `EventSourceResponse` marker (media_type `text/event-stream`), `ServerSentEvent` pydantic model (data/raw_data exclusivity, NUL-free id, retry >= 0), `format_sse_event()` wire encoder, `KEEPALIVE_COMMENT` and `_PING_INTERVAL=15.0`. Routing detects `is_sse_stream`, validates plain items via the shared `stream_item_field` serializer, passes `ServerSentEvent` items through, and decouples the generator from the keep-alive timer with a producer task + anyio memory stream so `fail_after` never cancels `__anext__`; sync generators use `iterate_in_threadpool`; sets `Cache-Control: no-cache` and `X-Accel-Buffering: no`. OpenAPI emits `text/event-stream` with the canonical SSE itemSchema and `data.contentSchema`. Five tutorials added.

**Acceptance tests.** `tests/test_sse.py` (18 tests: sync/async generators, POST SSE, field encoding, raw_data, validation rejections, keep-alive ping async/sync, router inclusion) and `tests/test_tutorial/test_server_sent_events/test_tutorial001.py` … `test_tutorial005.py` (stream content + OpenAPI snapshots).

**Agent notes.** No locus in the statement — mirror the JSONL precedent in `routing.py`. Verify with `pytest tests/test_sse.py tests/test_tutorial/test_server_sent_events/`; keep-alive tests monkeypatch `_PING_INTERVAL`. Must not wrap generator iteration in `fail_after` (finalizes the generator), must keep `await anyio.sleep(0)` after yields for disconnect cancellation, must JSON-encode even plain strings (`data: "hello"`), and must not regress the JSONL path when sharing the serializer.


### Subcategory: traceback-rendering (2 tasks)


Traceback extraction and rendering: PEP 657 instruction positions, PEP 678 __notes__, and exception-chain cycle detection.


#### rich_3486 — report fine grained error locations

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | feature |
| Subcategory | traceback-rendering |
| Root-cause family | — |
| Patch size | +74/-24, 3 files |
| Agent difficulty | 4/5 (multi-file) |

**Problem.** Add PEP 657 fine-grained error locations to `rich.traceback`: on Python 3.11+, underline the exact column range of the faulting instruction in each frame's source snippet, rather than only highlighting the whole line.

**Root cause.** Capability gap, not a defect. At base, `rich/traceback.py::Frame` (lines 175-181) stores only `lineno`; `Traceback.extract`'s `walk_tb` loop (lines 443-468) never consults `f_lasti`/`co_positions()`; the renderer builds `Syntax` with `highlight_lines={frame.lineno}` (line 702). `rich/syntax.py::stylize_range` (lines 536-551) always applies styles via `text.stylize` (line 787) — after pygments token spans — so a range style would overwrite token colors, and no `traceback.error_range` style exists. Locals display also includes noisy function/class objects.

**Reference fix.** `Frame` gains `last_instruction`; `extract` computes `instruction_index = f_lasti // 2` and reads `next(islice(f_code.co_positions(), idx, idx+1))` under a `sys.version_info >= (3, 11)` guard, storing `((start_line, start_column), (end_line, end_column))` only when all four values are non-None. Locals skip `inspect.isfunction`/`isclass` values. `Syntax` adds a `style_before` flag to `_SyntaxHighlightRange`/`stylize_range`, routed to `text.stylize_before` so the underline layers beneath token colors. `default_styles.py` registers `traceback.error_range` (underline, bold, dim=False), and the frame renderer calls `syntax.stylize_range(..., style_before=True)` when `last_instruction` is set.

**Acceptance tests.** `tests/test_traceback.py::test_traceback_finely_grained` (3.11+: `last_instruction` is a 2-tuple of positions, same start/end line for `1/0`) and `::test_traceback_finely_grained_missing` (<3.11: `None`); version-skipped so exactly one runs.

**Agent notes.** The statement names PEP 657 and the tests pin the exact field name/shape — strong contract cues. Verify with `pytest tests/test_traceback.py`. Must-nots: call `co_positions()` unguarded on <3.11, use `f_lasti` directly as an instruction index (it is a byte offset; divide by 2), store positions containing `None`, or use plain `stylize` (it would repaint token colors and break existing snapshots). `Text.stylize_before` already exists in `rich/text.py` at base (not extracted here).


#### rich_3676 — Notes

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | feature |
| Subcategory | traceback-rendering |
| Root-cause family | — |
| Patch size | +12/-1, 2 files |
| Agent difficulty | 2/5 (multi-file) |

**Problem.** Python 3.11 added `Exception.__notes__` (PEP 678, `add_note()`), which the standard-library traceback prints. Rich's `Traceback` ignores notes entirely, so contextual information attached to exceptions is lost in rich-rendered tracebacks.

**Root cause.** Capability gap across three layers of `rich/traceback.py`: the `Stack` dataclass (lines 196-202) and `_SyntaxError` (lines 187-193) have no `notes` field; `Traceback.extract` builds `Stack(exc_type=..., exc_value=..., is_cause=...)` (lines 413-418) without ever reading `exc_value.__notes__`; and `__rich_console__` (lines 585-605) yields only the exception type/value line and chain separators. There is also no `traceback.note` style in `rich/default_styles.py` (traceback entries at lines 115-123).

**Reference fix.** Adds `notes: List[str] = field(default_factory=list)` to both dataclasses; in `extract()` reads `notes = getattr(exc_value, "__notes__", None) or []` (safe on pre-3.11) and passes it into `Stack` and `_SyntaxError`; in `__rich_console__` yields `Text.assemble(("[NOTE] ", "traceback.note"), highlighter(note))` for each note right after the exception line; registers `"traceback.note": Style(color="green", bold=True)` in `default_styles.py`. Notes are captured once before the while True chain loop (base loop starts at line 413), so chained exceptions reuse the first exception's notes - a reference limitation; per-exception capture inside the loop would be an improvement.

**Acceptance tests.** `tests/test_traceback.py::test_notes` (new, `skipif` Python < 3.11): raises `ZeroDivisionError`, calls `add_note("Hello")` / `add_note("World")`, builds `Traceback()`, asserts `traceback.trace.stacks[0].notes == ["Hello", "World"]`. Full `tests/test_traceback.py` as regression.

**Agent notes.** The body names the exact feature; the test pins the field name `Stack.notes` and list semantics. Use `getattr` with a default — direct `__notes__` access would break Python < 3.11 even though the test is skip-guarded. The acceptance test only checks capture, but implement the rendering layer too (`[NOTE]` prefix, `ReprHighlighter` on the note text, new default style) to match the reference. `List` and `field` are already imported. Verify with `pytest tests/test_traceback.py` on Python 3.11+.


### Subcategory: type-annotation-handling (1 tasks)


Interpretation of type annotations: Annotated/union/discriminator unwrapping, stringified-annotation evaluation, PEP 695 TypeAliasType, and field complexity classification.


#### fastapi_13920 — Add support for PEP695 `TypeAliasType`

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | feature |
| Subcategory | type-annotation-handling |
| Root-cause family | — |
| Patch size | +4/-0, 1 file |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** Parameters annotated with a PEP 695 type alias — `type DependedValue = Annotated[int, Depends(some_value)]` or `typing_extensions.TypeAliasType(...)` — are not understood: FastAPI cannot see the `Depends`/parameter metadata hidden inside the alias (continuation of PR #11140).

**Root cause.** Capability gap in `fastapi/dependencies/utils.py::analyze_param` (lines 362-377). A `TypeAliasType` is a distinct object whose real annotation lives in `__value__`; `get_origin(alias)` is not `Annotated`, so the extraction branch `if get_origin(use_annotation) is Annotated:` (line 377) never runs. The alias object itself is treated as the parameter type, `Depends` is never discovered, and the alias is handed to Pydantic as a field type. There is simply no alias-unwrapping step before the existing logic.

**Reference fix.** Adds `from typing_inspection.typing_objects import is_typealiastype` and, at the top of `analyze_param`, `if is_typealiastype(annotation): annotation = annotation.__value__`. The helper recognizes both `typing` (3.12+) and `typing_extensions` variants; after unwrapping, the normal `Annotated`/`Depends` machinery applies and the dependency resolves.

**Acceptance tests.** `tests/test_dependency_pep695.py::test_pep695_type_dependencies` (new file; uses `typing_extensions.TypeAliasType`, so no 3.12-only syntax needed). `GET /` must return `"value: 123"`.

**Agent notes.** Grep `def analyze_param`. Note the prose says "vendoring" `is_typealiastype`, but the reference patch imports it from `typing-inspection` — follow the patch. Risk: `typing-inspection` is not declared in the base `pyproject.toml` (it arrives transitively via Pydantic >= 2.11); confirm the import resolves in the target environment. Unwrap before the `Annotated` check; the reference unwraps one level only.


### Subcategory: wrapped-callables (2 tasks)


Callable-kind introspection for dependables: inspect.unwrap/partial/__wrapped__ peeling, async-vs-sync/generator detection, class-vs-instance, and annotation globals.


#### fastapi_9555 — Handle wrapped dependencies

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | feature |
| Subcategory | wrapped-callables |
| Root-cause family | — |
| Patch size | +14/-8, 1 file |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** Dependencies wrapped by decorators that set `__wrapped__` (`functools.wraps`, `functools.cache`/`lru_cache`) are misclassified: a wrapped async dependency is never awaited, and a wrapped yield dependency is never entered as a context manager. The PR adds support for determining callable kind from the unwrapped original.

**Root cause.** Capability gap in `fastapi/dependencies/models.py::Dependant.is_gen_callable` (lines 78-83), `is_async_gen_callable` (85-90), and `is_coroutine_callable` (92-99): all inspect `self.call` directly (`if inspect.isgeneratorfunction(self.call):`, `return iscoroutinefunction(self.call)`) and never follow `__wrapped__`. A `@wraps` wrapper is itself a plain sync `def`, so e.g. `@cache @reawaitable async def get_settings()` is classified sync, run via `run_in_threadpool`, and the returned coroutine object becomes the dependency value — producing `AttributeError: 'coroutine' object has no attribute 'foo'` downstream. Wrapped generator dependencies likewise leak raw generator objects instead of yielded values. Trigger: any `functools.wraps`-based decorator over an async/generator dependency.

**Reference fix.** Add a cached property `_unwrapped_call` returning `inspect.unwrap(self.call)` (None-guarded) and substitute it for `self.call` in all three detection properties, including the `__call__` fallback. `inspect.unwrap` follows the `__wrapped__` chain, exposing the original coroutine/generator function so `solve_dependencies` awaits it or enters it via `(async)contextmanager`. The wrapper itself is still what gets invoked, preserving caching behavior.

**Acceptance tests.** `tests/test_dependency_wrapped.py::test_class_dependency` — four parametrized routes (`/wrapped-dependency`, `/wrapped-gen-dependency`, `/async-wrapped-dependency`, `/async-wrapped-gen-dependency`), each asserting 200 and JSON `true`.

**Agent notes.** The body practically dictates the fix ("calling `inspect.unwrap` on the dependency call"); related PR #5077. Verify with the new test file plus `tests/test_dependency_class.py` (unwrap leaves plain functions/classes/instances unchanged). Unwrap only for *detection*, never replace the invoked callable. `functools.partial` is not covered by `inspect.unwrap` — that is the follow-up task 9753; do not over-engineer. This property is later extended by 14448 to check wrapper and wrapped layers together.


#### fastapi_9753 — Allow using dependables with `functools.partial()`

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | feature |
| Subcategory | wrapped-callables |
| Root-cause family | — |
| Patch size | +5/-2, 1 file |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** `functools.partial()` works for plain sync function dependables but not consistently for async functions, generators, async generators, or callable instances. The PR makes partial work in all combinations (discussion #9744).

**Root cause.** Capability gap in `fastapi/dependencies/models.py::Dependant._unwrapped_call` (lines 78-82): it returns `inspect.unwrap(self.call)`, which follows `__wrapped__` but leaves `partial` objects intact (they have no `__wrapped__`). Kind detection then inspects the partial itself: `inspect.isroutine(partial)` is False, and `getattr(partial, "__call__")` resolves to partial's *own* builtin `__call__`, masking the target's async/generator nature. So `partial(async_func, ...)` is classified sync, run in a threadpool, and returns an unawaited coroutine as the dependency value; `partial(gen_func, ...)` returns a raw generator object instead of being entered via `contextmanager`; `partial(instance)` with async `__call__` is likewise misdetected. Sync function partials happened to work, hence the inconsistency.

**Reference fix.** After `inspect.unwrap`, peel one partial layer: `if isinstance(unwrapped, partial): unwrapped = unwrapped.func` (plus the `partial` import). Detection now sees the real function's async/gen flags, or the real instance whose `__call__` is checked by the existing dunder fallback — making all 12 tested combinations behave correctly.

**Acceptance tests.** `tests/test_dependency_partial.py::test_dependency_types_with_partial` — 12 parametrized routes: partial of sync/async functions, sync/async generators, callable instances (sync/async, gen/async-gen), and bound methods (sync/async, gen/async-gen); each asserts 200 and the echoed value.

**Agent notes.** Title names `functools.partial()` directly; the single unwrapping property is the obvious locus once you know `inspect.unwrap` ignores partials. Verify with the new test file plus `tests/test_dependency_wrapped.py` / `tests/test_dependency_class.py`. Keep the None guard. Only one partial layer is peeled — nested partials and partial-of-wrapped stacks are the later 14448 task; do not over-engineer or claim full coverage here.


## Category: refactor


Restructures existing code or output for spec-conformance/maintainability without adding a new capability; behavior-preserving or standards-aligning.


### Subcategory: dependency-injection (1 tasks)


Depends/Security declaration mechanics, resolution, scope-aware caching, and yield-dependency lifecycle (dual exit stacks, function/request scopes).


#### fastapi_14372 — Make the result of `Depends()` and `Security()` hashable, as a workaround for other tools interacting with these internal parts

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | refactor |
| Subcategory | dependency-injection |
| Root-cause family | — |
| Patch size | +4/-3, 2 files |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** External tools that interact with FastAPI internals (PR #14320) need `Depends()`/`Security()` instances to be hashable, but they are plain dataclasses and therefore unhashable. The PR restores hashability as an explicit short-term workaround, not a long-term API commitment.

**Root cause.** Compatibility gap: `fastapi/params.py::Depends` (lines 765-769) and `Security` (lines 772-774) are declared `@dataclass` with generated `__eq__` and `frozen=False`, which sets `__hash__ = None` — hashing raises `TypeError: unhashable type: 'Depends'`. The blocker to simply freezing them is `fastapi/dependencies/utils.py::analyze_param` (lines 428-431): for `Annotated[T, Depends()]` without an explicit callable it does `depends = copy(depends)` then `depends.dependency = type_annotation` — an in-place mutation a frozen dataclass would reject with `FrozenInstanceError`.

**Reference fix.** Change both decorators to `@dataclass(frozen=True)` (with `eq=True` this generates field-based `__hash__`, so equal-argument instances hash equal and different `scope` values hash differently), and replace the copy+mutate with `depends = dataclasses.replace(depends, dependency=type_annotation)`, which builds a new instance preserving all other fields. Add `import dataclasses`.

**Acceptance tests.** `tests/test_depends_hashable.py::test_depends_hashable` — `hash(d1)==hash(d2)`, `hash(s1)==hash(s2)`, `hash(d1)!=hash(d3)` (scope `"function"`), `hash(d3)==hash(d4)`.

**Agent notes.** Title gives the property ("hashable") and the symbols; the comment "Copy `depends` before mutating it" is a strong grep anchor for the mutation site. Verify with the new test plus the full dependency/param suites to catch any other mutation of `Depends`/`Security` that freezing would break. Do not attempt to make `Security(scopes=[...])` with list scopes hashable — out of scope; the test only hashes `scopes=None`. Keep `use_cache`/`scope`/`scopes` intact through `dataclasses.replace`.


### Subcategory: openapi-schema-generation (1 tasks)


OpenAPI/JSON-Schema construction, model naming/ref resolution, schema caching, and docs-UI serving/escaping (fastapi/openapi, _compat schema generators).


#### fastapi_14953 — Fix JSON Schema for bytes, use contentMediaType application/octet-stream instead of format binary

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | refactor |
| Subcategory | openapi-schema-generation |
| Root-cause family | — |
| Patch size | +102/-2, 4 files |
| Agent difficulty | 3/5 (multi-file) |

**Problem.** FastAPI emitted the legacy OpenAPI 3.0 keyword `"format": "binary"` for `bytes` fields and `UploadFile` parameters. OpenAPI 3.1+ (which FastAPI targets, `3.1.0`) aligns with JSON Schema, which instead uses `"contentMediaType": "application/octet-stream"` and `"contentEncoding": "base64"` for base64-encoded bytes. The old representation was a 3.0-only convention and never reflected Pydantic's base64 byte encoding.

**Root cause.** This is a conformance/capability gap (author gitmoji ♻️ refactor), not a runtime defect. `fastapi/datastructures.py::UploadFile.__get_pydantic_json_schema__` (line 142) hard-codes `return {"type": "string", "format": "binary"}`, and `fastapi/_compat/v2.py` (line 30) re-exports Pydantic's `GenerateJsonSchema` unchanged (`from pydantic.json_schema import GenerateJsonSchema as GenerateJsonSchema`), whose default `bytes_schema` also emits `format: binary`. `format: binary` was defined in OpenAPI 3.0.x for file uploads, not in JSON Schema; the 3.1 upgrade guide and JSON Schema draft-07/2020-12 specify `contentMediaType` (plus `contentEncoding` for base64). The motivation is to align the generated schema with the spec and to surface base64 encoding driven by Pydantic's `val_json_bytes`/`ser_json_bytes` config.

**Reference fix.** In `_compat/v2.py`, imports the Pydantic generator as `_GenerateJsonSchema` and defines a FastAPI `GenerateJsonSchema` subclass overriding `bytes_schema` to emit `{"type":"string","contentMediaType":"application/octet-stream"}`, adding `"contentEncoding":"base64"` when `self._config.ser_json_bytes` (serialization mode) or `val_json_bytes` (validation mode) equals `"base64"`, then calls `update_with_validations(..., self.ValidationsMapping.bytes)`. In `datastructures.py`, `UploadFile`'s schema becomes `{"type":"string","contentMediaType":"application/octet-stream"}`. Adds a `docs_src/json_base64_bytes` tutorial and a playwright screenshot script, and updates 11 test files' snapshots. A TODO marks the subclass for removal once upstream pydantic#12841 lands.

**Acceptance tests.** New `tests/test_tutorial/test_json_base64_bytes/test_tutorial001.py` (`test_post_data`, `test_get_data`, `test_post_data_in_out`, `test_openapi_schema` — base64 round-trip and full schema with `contentEncoding:base64` + `contentMediaType`); updated schema snapshots in `tests/test_request_params/test_file/{test_required,test_list,test_optional,test_optional_list}.py` and `tests/test_tutorial/test_request_files*/test_request_forms_and_files/*::test_openapi_schema` (all swap `format:binary` → `contentMediaType`).

**Agent notes.** The title gives the exact keyword swap; grep `format": "binary` lands on `datastructures.py:142`. Core code edits are small but need Pydantic `GenerateJsonSchema` internals (`_config`, `mode`, `ValidationsMapping.bytes`); most of the diff is a new tutorial, a playwright script, and mechanical snapshot updates. Keep the subclass named `GenerateJsonSchema` so existing imports resolve to the override, change **both** the bytes generator and `UploadFile`, and emit `contentEncoding` **only** for base64-configured bytes. Verify the new tutorial test (`needs_py310`) and all file/form schema snapshots under pydantic v2. Borders on bugfix/feature but classified refactor per the author's gitmoji.


### Subcategory: request-parsing (1 tasks)


Extraction and validation of request parameters/body: multidict query/header/form handling, field alias semantics, type guards, and Content-Type policy.


#### fastapi_15589 — Do not accept underscore headers when using `convert_underscores=True` (the default)

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | refactor |
| Subcategory | request-parsing |
| Root-cause family | api-contract-violation |
| Patch size | +4/-0, 1 files |
| Agent difficulty | 2/5 (one-line) |

**Problem.** When a Pydantic model is bound as a `Header()` parameter with `convert_underscores=True` (the default), clients can still send underscore-spelled header names: they are accepted, and when both spellings are sent the underscore value overwrites the hyphenated one. The PR tightens the default so only hyphen-separated header names are accepted; accepting underscores requires `convert_underscores=False`.

**Root cause.** In `fastapi/dependencies/utils.py::request_params_to_args` (lines 813-839), model header fields are looked up under a converted hyphenated alias (`alias = alias.replace("_", "-")`, lines 821-824) and the value is stored under the field's validation alias (line 827). However, only the hyphenated alias is marked as consumed: `processed_keys.add(alias or get_validation_alias(field))` (line 828). The extra-params pass then copies every received key not in `processed_keys` into the model input (`if key not in processed_keys:`, lines 830-839). Trigger: a model like `AuthHeaders(x_user_id: str)` with a client sending `x_user_id`. Because the raw underscored key equals the model field name, the extra pass (a) overwrites the canonical `x-user-id` value when both are present, and (b) satisfies the required field when only the underscore form is sent, returning 200 where the contract demands a missing-field 422.

**Reference fix.** One functional line (plus a comment): `processed_keys.add(get_validation_alias(field))` after line 828, marking both the hyphenated alias and the original underscored field alias as processed. Underscored headers are then ignored by the extra pass: the hyphenated value wins when both are sent, and underscore-only requests fail validation with 422 and `loc == ["header", "x_user_id"]`. For `convert_underscores=False` and for query/cookie params the addition is a no-op (the validation alias is already recorded), so existing behavior is preserved.

**Acceptance tests.** `tests/test_query_cookie_header_model_extra_params.py::test_header_model_prefers_hyphenated_header_with_convert_underscores` (both spellings sent, hyphenated wins) and `::test_header_model_rejects_underscore_header_with_convert_underscores` (underscore-only yields 422).

**Agent notes.** Localization: the title's `convert_underscores` symbol greps straight into `request_params_to_args`; the test file name points at extra-params handling. Although labeled with the refactor gitmoji, this is a behavior fix with tests that fail on base. Verify with the full extra-params test file plus `tests/test_tutorial/test_header_param_models/`. Do not touch `_get_multidict_value` or the alias-conversion block, and do not mark arbitrary keys as processed — genuinely extra headers must still flow into `extra="allow"` models. The 422 comes from the missing required field, not from explicit rejection of the underscore key.


### Subcategory: routing (1 tasks)


APIRouter/app route composition: include_router identity, lifespan/startup wiring, route-context iteration, static/frontend dispatch, and decorator surface.


#### fastapi_15745 — Refactor internals to preserve `APIRouter` and `APIRoute` instances

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | refactor |
| Subcategory | routing |
| Root-cause family | missing-capability |
| Patch size | +939/-291, 4 files |
| Agent difficulty | 5/5 (large) |

**Problem.** `router.include_router(other)` cloned/recreated every route, collapsing the app into one top-level router of copies and discarding original `APIRoute`/`APIRouter` identity. This architectural refactor (gitmoji ♻️, supersedes #4794) stores inclusion metadata in intermediate objects so instances are preserved, enabling live route addition, include-before-add ordering, and custom router/route subclasses.

**Root cause.** Structural limitation, not a defect. Base `fastapi/routing.py::APIRouter.include_router` (def 1578) iterates `router.routes` and calls `self.add_api_route(prefix + route.path, route.endpoint, ...)` (lines 1732-1796), which builds a new `route = route_class(self.prefix + path, endpoint=endpoint, ...)` (`add_api_route`, line 1386). Only clones survive: routes added to a subrouter after inclusion are ignored, include-before-add captures nothing, subclass instances are replaced, and per-router dependencies/middleware are impossible. OpenAPI was cached once (`applications.py::openapi`, `if not self.openapi_schema:` line 1082) with no invalidation.

**Reference fix.** Replace cloning with a tree: new `_RouterIncludeContext` (inclusion metadata), `_EffectiveRouteContext` (lazy effective state via `_populate_api_route_state` / `_APIRouteLike` Protocol), and `_IncludedRouter(BaseRoute)` storing `original_router + include_context` and delegating `matches()/handle()/url_path_for()` to the originals. `include_router` appends `_IncludedRouter(...)` and calls `_mark_routes_changed()`. Adds scope helpers, `_iter_routes_with_context`, `APIRouter.matches()/handle()`, and route-version tracking; `openapi/utils.py` iterates effective contexts; `applications.py` invalidates the OpenAPI cache on route-version change. Breaking change: `router.routes` is now a tree, not a flat list.

**Acceptance tests.** New `tests/test_router_include_context.py` (`test_router_include_context_matches_flattened_include_metadata`, `test_live_route_addition_uses_include_metadata_for_runtime_and_openapi`, `test_openapi_cache_updates_after_live_route_addition`, `test_original_api_route_subclass_instance_is_called_after_inclusion`, `test_indirect_router_inclusion_cycles_are_rejected`, ~40 total) and `tests/test_custom_route_class.py`.

**Agent notes.** Foundational refactor that fastapi_15763 and fastapi_15785 build on — solve first. The PR body is the spec (features, breaking change, discarded 404-dependency non-objective). Must reproduce the old flattened effective metadata exactly, delegate to original subclass instances, isolate effective-context scope on failed/partial matches, and refresh the OpenAPI cache on live changes. Do not reintroduce cloning. High regression surface across routing/OpenAPI/websockets/Mount/Host.


## Category: security


Hardens against a vulnerability or unsafe input handling (CSRF, frame/header injection, cross-request state leak).


### Subcategory: openapi-schema-generation (1 tasks)


OpenAPI/JSON-Schema construction, model naming/ref resolution, schema caching, and docs-UI serving/escaping (fastapi/openapi, _compat schema generators).


#### fastapi_14986 — Refactor logic to handle OpenAPI and Swagger UI escaping data

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | security |
| Subcategory | openapi-docs-hardening (proposed) |
| Root-cause family | state-lifecycle |
| Patch size | +25/-9, 2 files |
| Agent difficulty | 3/5 (multi-file) |

**Problem.** A request-supplied `root_path` was permanently written into app state, so one client's (possibly spoofed) prefix leaked into every later OpenAPI response; separately, Swagger UI config JSON was embedded in a `<script>` block without HTML escaping. The maintainer labels this hardening (automated-scanner reports, not a feasible attack), but both new test files fail on base.

**Root cause.** Two loci. (1) `fastapi/applications.py::FastAPI.setup` (lines 1102-1113): `server_urls` is computed once at setup (line 1105), and the per-request handler executes `self.servers.insert(0, {"url": root_path})` (line 1111). `self.servers` is the user's own list, and `self.openapi()` (lines 1083-1100) caches a schema built with `servers=self.servers` — so the first request with `root_path="/evil-api"` (trivially set via `TestClient(app, root_path=...)` or a misconfigured proxy forwarding `x-forwarded-*`) pollutes the cached schema and the configured list for all subsequent requests. (2) `fastapi/openapi/docs.py::get_swagger_ui_html` interpolates raw `json.dumps` at line 158 (`html += f"{json.dumps(key)}: {json.dumps(jsonable_encoder(value))},\n"`) and line 172 (`ui.initOAuth(...)`); a value containing `</script><script>alert(1)</script>` terminates the script tag — JSON string quoting does not protect against HTML parsing.

**Reference fix.** The handler now takes the cached `schema = self.openapi()` and, only when `root_path` and `root_path_in_servers` are set, shallow-copies it (`schema = dict(schema)`) and prepends `{"url": root_path}` to a fresh servers list, deduping against that response's servers — app state is never touched. A new `_html_safe_json` helper runs `json.dumps` and then replaces the three HTML-special characters with their JSON unicode escapes (`<` -> `\\u003c`, `>` -> `\\u003e`, `&` -> `\\u0026`), and is used for both the parameter loop and `initOAuth`; output stays valid JSON/JS for benign values.

**Acceptance tests.** `tests/test_openapi_cache_root_path.py`: `test_root_path_does_not_persist_across_requests`, `test_multiple_different_root_paths_do_not_accumulate`, `test_legitimate_root_path_still_appears`, `test_configured_servers_not_mutated`. `tests/test_swagger_ui_escape.py`: `test_init_oauth_html_chars_are_escaped`, `test_swagger_ui_parameters_html_chars_are_escaped`, `test_normal_init_oauth_still_works`.

**Agent notes.** Statement explicitly describes both changes — strong localization. Do not mutate `self.servers` or the cached schema, and do not drop the legitimate-root_path feature. Keep `json.dumps` default spacing (a benign-config test asserts `"clientId": "my-client"`); escape all three characters, not just `</script>`. Verify with the two new test files plus existing root-path/OpenAPI/docs suites. Subcategory `openapi-docs-hardening` is newly proposed (flagged).


### Subcategory: request-parsing (1 tasks)


Extraction and validation of request parameters/body: multidict query/header/form handling, field alias semantics, type guards, and Content-Type policy.


#### fastapi_14978 — Add `strict_content_type` checking for JSON requests

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | security |
| Subcategory | request-parsing |
| Root-cause family | — |
| Patch size | +81/-1, 3 files |
| Agent difficulty | 4/5 (multi-file) |

**Problem.** FastAPI parses a request body as JSON even when no `Content-Type` header is present. Browser-driven cross-site "simple requests" that skip CORS preflight can therefore reach JSON endpoints — a CSRF vector, especially for apps served on localhost. The PR adds `strict_content_type` (default `True`) so header-less bodies are no longer parsed as JSON, with `False` restoring legacy behavior.

**Root cause.** Capability gap with a security-unsafe default: in `fastapi/routing.py::get_request_handler`'s inner `app` (base lines 368-384), `content_type_value = request.headers.get("content-type")` is followed by `if not content_type_value: json_body = await request.json()` — a missing header is treated as JSON unconditionally, and no app/router/route-level knob existed to require an explicit JSON content type. Only present headers go through the `application/json` / `+json` subtype check.

**Reference fix.** Thread the option through the stack exactly like `generate_unique_id_function`: `FastAPI.__init__` gains a documented `bool = True` parameter passed to `APIRouter` (applications.py lines 963-977); `APIRouter.__init__`, `add_api_route`, and `APIRoute.__init__` accept `bool | DefaultPlaceholder = Default(True)`; `add_api_route` resolves with `get_value_or_default(strict_content_type, self.strict_content_type)`; `include_router` resolves route > included router > including router; `get_route_handler` forwards to `get_request_handler`, which unwraps the placeholder and gates the fallback: `if not actual_strict_content_type: json_body = await request.json()`. A new `docs_src/strict_content_type/tutorial001_py310.py` shows the lax opt-out. Keeping placeholders unresolved until the final app is what makes nested inheritance work.

**Acceptance tests.** New suites `tests/test_strict_content_type_app_level.py` (4 tests), `test_strict_content_type_router_level.py` (6), `test_strict_content_type_nested.py` (8, covering lax-app/strict-inner and strict-app/lax-outer/strict-inner precedence), `tests/test_tutorial/test_strict_content_type/test_tutorial001.py` (3, including text/plain still rejected in lax mode); plus `tests/test_tutorial/test_body/test_tutorial001.py::test_no_content_type_json` (renamed, now expects 422).

**Agent notes.** The PR body is minimal — the tests are the specification. Recognize the `DefaultPlaceholder`/`get_value_or_default` threading pattern from `generate_unique_id_function` and replicate it at every site; missing one breaks specific level/nested tests, and eagerly unwrapping `Default(True)` breaks inheritance. Only the missing-header branch changes: `application/json` and `+json` requests must keep working in both modes, and lax mode must still reject `text/plain`. Create the docs_src tutorial module or the tutorial test fails at import. Verify with the four new/updated suites plus body/router regression tests. Do not modify tests.


### Subcategory: streaming-sse (1 tasks)


Streaming transports: Server-Sent Events framing/encoding/keep-alive and JSONL/raw streaming response integration.


#### fastapi_15588 — Validate Server Sent Event fields to avoid applications from sending broken data

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | security |
| Subcategory | streaming-sse |
| Root-cause family | — |
| Patch size | +18/-5, 1 files |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** `ServerSentEvent` accepted multi-line `event` and `id` values. Apps passing unfiltered request input into these fields could emit broken or injected SSE frames; the PR makes such values raise at construction time instead of corrupting the stream.

**Root cause.** Hardening gap (the author explicitly says the prior code is not a bug or vulnerability). In base `fastapi/sse.py::format_sse_event` (lines 199-207), `data` and `comment` are split with `splitlines()`, but `event` and `id` are interpolated verbatim: `lines.append(f"event: {event}")` and `lines.append(f"id: {id}")`. The `event` field (lines 87-97) had no validator; `id` only had `_check_id_no_null` (lines 36-39) rejecting NUL. Any `\r` or `\n` in these values therefore injects raw newlines into the wire format, forging additional SSE lines from attacker-influenced input.

**Reference fix.** Generalizes the validator to `_check_single_line(v, field_name)` raising `ValueError("SSE '<field>' must be a single line")` on `\r` or `\n`; adds `_check_event_single_line` for `event` and `_check_id_valid` (NUL + single-line) for `id`, both attached via `AfterValidator`. Doc strings updated. `data`/`raw_data`/`comment` stay multi-line by design.

**Acceptance tests.** `tests/test_sse.py::test_server_sent_event_single_line_fields_reject_newlines` — parametrized over `event`/`id` and values `first\nsecond`, `first\rsecond`, `first\r\nsecond`, asserting the exact error message; existing `test_server_sent_event_null_id_rejected` must still pass.

**Agent notes.** Fully localized to `fastapi/sse.py`; extend the existing `AfterValidator(_check_id_no_null)` pattern. Verify with `pytest tests/test_sse.py`. Must reject bare `\r` (not only `\n`), keep the NUL check, and match the message text exactly. Do not validate `data`/`raw_data`/`comment` or touch `format_sse_event`/routing. Labeled ♻️ but it adds validation behavior — treat as preventive hardening, not a pure refactor.


## Category: performance


Improves speed or resource use without changing correct output.


### Subcategory: cell-width-graphemes (1 tasks)


Character cell measurement and grapheme segmentation: width tables/fast-path regex, control/PUA codepoints, ZWJ/VS16 grapheme clusters, and the grapheme splitter.


#### rich_3535 — Regex error

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | performance |
| Subcategory | cell-width |
| Root-cause family | boundary-edge-case |
| Patch size | +7/-1, 2 files |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** The regex that gates the single-cell-width fast path was malformed and far too narrow, so most real text (anything with letters p-z, accented characters, or table borders) missed the fast path in `set_cell_size` and `Segment.split_cells`, degrading performance of width-related operations.

**Root cause.** `rich/cells.py::_is_single_cell_widths` (line 10) compiles `"^[\u0020-\u006f\u00a0\u02ff\u0370-\u0482]*$"`. Three boundary defects: (1) the ASCII range ends at U+006F (`o`), excluding `p`-`z` and `{|}~`; (2) `\u00a0\u02ff` are two isolated codepoints, not the intended U+00A0-U+02FF range, so e.g. `é` (U+00E9) fails; (3) box-drawing U+2500-U+25FF — every Table/Panel border — is absent. Consumers `cells.set_cell_size` (gate at line 92) and `segment.Segment.split_cells` (gate at line 169, `if _is_single_cell_widths(text):`) treat a match as proof that display width equals `len(text)`, enabling O(1) slicing. Verified with stdlib `re`: the old pattern rejects `p` but accepts `hello` (all letters <= `o`); box chars and U+00E9 fail. False negatives only force the slow per-character/binary-search path, so output stays correct — this is a performance defect, not a rendering bug. Trigger: essentially all English prose and bordered renderables.

**Reference fix.** Rewrites the class to `"^[\u0020-\u007e\u00a0-\u02ff\u0370-\u0482\u2500-\u25FF]*$"` — full printable ASCII, the intended Latin/IPA range, Greek/Coptic to U+0482, and box drawing; nearly all are single-cell per `CELL_WIDTHS` (three inherited exceptions: U+00AD width 0 in the Latin range; U+25FD/U+25FE width 2 in the box-drawing range), so the fast path is sound for the tested corpus but carries latent false positives for those codepoints. Also adds a defensive `assert cut >= 0` and an Args docstring to `Segment.split_cells` (segment.py lines 158-178). The new test asserts every printable char >= 32 and all box chars match, while emoji and CJK (`わさび`) are rejected.

**Acceptance tests.** `tests/test_cells.py::test_is_single_cell_widths` (new); regressions `test_chop_cells*`, `test_set_cell_size*`; also run `tests/test_segment.py` for `split_cells`.

**Agent notes.** Cue: "fast path for strings with single-width characters" points straight at `_is_single_cell_widths`. Verify with `pytest tests/test_cells.py tests/test_segment.py`. The key invariant a solver must respect: the regex may only match strings whose cell width equals `len()` — never widen into combining marks (U+0300-U+036F, U+0483+) or wide CJK, and keep the `assert cut >= 0`. When unsure about a range, exclude it: the slow path is always correct.


### Subcategory: import-performance (1 tasks)


Import-time cost: deferring eager module-level imports to cold paths and TYPE_CHECKING.


#### rich_4070 — perf: reduce Console and RichHandler import time by deferring unused imports

| Field | Value |
|---|---|
| Repo | Textualize/rich |
| Kind | performance |
| Subcategory | import-performance |
| Root-cause family | — |
| Patch size | +71/-57, 9 files |
| Agent difficulty | 3/5 (multi-file) |

**Problem.** `from rich.console import Console` (~78ms) and `from rich.logging import RichHandler` (~99ms) eagerly import heavy modules used only on cold paths. pip vendors Rich and pays this cost on every invocation; the PR defers those imports for a ~1.5-1.75x startup speedup.

**Root cause.** Performance gap, not a defect. Base `rich/logging.py:15` does `from .traceback import Traceback`, dragging the traceback→syntax→pygments chain into every `RichHandler` import although `Traceback` is only needed in `emit()` when `rich_tracebacks=True`. Base `rich/console.py` imports `inspect` (line 1), `zlib` (5), `getpass` (10), `html.escape` (11), `.pretty` (53), `.scope` (56) at module scope for single cold paths (frame info, SVG export, password input, pretty-printing, `log_locals`). `rich/syntax.py:47` imports `.console` at runtime; `rich/_emoji_replace.py:4` loads the large `EMOJI` table; `rich/segment.py:32` has dead `log = getLogger("rich")`; `theme.py` imports `configparser` used only in `from_file`; `console._svg_hash` (lines 2619-2628) is dead code.

**Reference fix.** Defers each cold-path import into its function (`Traceback`→`emit`, `Pretty`/`is_expandable`→`_collect_renderables`, `render_scope`→`log`, `getpass`→`input`, `escape`/`zlib`→export methods, `configparser`→`Theme.from_file`, `inspect`→`auto_rich_repr`/`_caller_frame_info`, `EMOJI`→emoji functions); moves annotation-only imports behind `TYPE_CHECKING` with `from __future__ import annotations` (logging.py, syntax.py); replaces `inspect.isclass` with `isinstance(x, type)`; `Path(...).name`→`os.path.basename`; deletes dead `segment.log` and `_svg_hash`.

**Acceptance tests.** `tests/test_console.py::test_input_password` (now monkeypatches `getpass.getpass` on the module, since `rich.console.getpass` no longer exists) and `tests/test_syntax.py` (imports `Console` from `rich.console`, not `rich.syntax`); full suite regression (PR: 952 passed, 25 skipped).

**Agent notes.** The PR body's per-file table is an unusually strong localization aid — treat it as the spec. Risks: every deferred name must be imported on *every* branch that uses it (runtime `NameError` otherwise); `TYPE_CHECKING` moves require future annotations in logging.py; `_caller_frame_info`'s `currentframe` default becomes `None` but must stay injectable with the `inspect.stack()` fallback; do not re-add the `rich.syntax.Console` runtime re-export. Follow the diff, not the prose (it mentions `sys._getframe`, but the patch defers `inspect`). Verify with the two modified test files plus the full suite; optionally assert `rich.traceback`/`rich.pretty` are absent from `sys.modules` after the lean imports.


### Subcategory: response-serialization (1 tasks)


Response model inference and body serialization (return-annotation normalization, dump_json fast path, status-code body rules).


#### fastapi_14962 — Serialize JSON response with Pydantic (in Rust), when there's a Pydantic return type or response model

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | performance |
| Subcategory | response-serialization |
| Root-cause family | — |
| Patch size | +49/-6, 3 files |
| Agent difficulty | 3/5 (multi-file) |

**Problem.** Responses with a Pydantic return type or response model were serialized twice — once to a Python dict by Pydantic, once to bytes by `json.dumps` in `JSONResponse.render`. The PR adds a one-pass Rust fast path, removing the performance reason to use `ORJSONResponse`/`UJSONResponse`.

**Root cause.** Capability gap. Base `fastapi/routing.py::serialize_response` (lines 262-301) always ends with `return field.serialize(...)`, and `fastapi/_compat/v2.py::ModelField.serialize` (lines 177-200) calls `return self._type_adapter.dump_python(...)` — materializing a full Python dict. The handler then runs `response = actual_response_class(content, **response_args)` (line 458), so the default `JSONResponse.render` re-encodes that dict with `json.dumps`. Pydantic's `dump_json` can emit bytes directly, but nothing used it.

**Reference fix.** Adds `ModelField.serialize_json` wrapping `_type_adapter.dump_json` with the same include/exclude/alias flags; adds a `dump_json` flag to `serialize_response` selecting the serializer; in the request handler computes `use_dump_json = response_field is not None and isinstance(response_class, DefaultPlaceholder)` and, when true, returns a plain `Response(content=<bytes>, media_type="application/json")` that bypasses `render()`. Tutorial010 is repurposed from ORJSON to HTMLResponse with its own test file.

**Acceptance tests.** `tests/test_dump_json_fast_path.py::test_default_response_class_skips_json_dumps` (mocks `starlette.responses.json.dumps`, asserts not called) and `::test_explicit_response_class_uses_json_dumps` (asserts called once); `tests/test_tutorial/test_custom_response/test_tutorial010.py::test_get_custom_response`, `::test_openapi_schema`.

**Agent notes.** Loci: `serialize_response`, the handler's response construction, and `ModelField`. Verify with `pytest tests/test_dump_json_fast_path.py` plus response-model/tutorial regression suites. Must not apply the fast path when a response class is explicitly set, must keep `field.validate` and `ResponseValidationError` behavior, must forward all exclude/by_alias flags, and must preserve status-code/background/header handling. Small edit, but the bytes-bypass-render detail is load-bearing.


## Category: dependency-compat


Adapts to an upstream dependency version/API change (Starlette, Pydantic, urllib3) to keep the supported range working.


### Subcategory: body-stream-handling (1 tasks)


Request body/stream preparation: duck-typing/protocol detection of file-like and iterable bodies, and super_len/Content-Length measurement incl. urllib3 1.x/2.x encoding.


#### requests_6757 — Test on urllib3 1.26.x

| Field | Value |
|---|---|
| Repo | psf/requests |
| Kind | dependency-compat |
| Subcategory | urllib3-compat |
| Root-cause family | compatibility-shim |
| Patch size | +16/-1, 2 files |
| Agent difficulty | 3/5 (few-lines) |

**Problem.** PR #6589 made `super_len` count UTF-8 bytes for str request bodies, which is correct for urllib3 2.x but wrong for urllib3 1.26.x, where str bodies go through `http.client` and are encoded latin-1. The supported pin (`urllib3>=1.21.1,<3`, setup.py:64) still allows 1.x, so non-ASCII str bodies get a mismatched Content-Length there.

**Root cause.** `src/requests/utils.py::super_len` (lines 139-140) unconditionally rebinds `o = o.encode("utf-8")` for any str, so the header counts UTF-8 bytes. Under urllib3 1.x the actual wire body is latin-1 (one byte per character), so for data like `"…☃️"` the declared length exceeds the transmitted bytes and the server waits for data that never arrives (framing hang/error). Nothing in `compat.py` detects the urllib3 major version — the base module goes straight from `import importlib / sys` (lines 10-11) to character detection — so the 2.x-only assumption is baked in. Evidence: `if isinstance(o, str):` / `o = o.encode("utf-8")`. Trigger: urllib3 1.26.x plus a non-ASCII `data=str` request.

**Reference fix.** `compat.py` gains `is_urllib3_1`, parsed from `urllib3.__version__` (`int(version.split(".")[0]) == 1`) with a `TypeError/AttributeError` fallback to `True` (prefer legacy behavior when the version is indeterminate). `super_len` then encodes only when `not is_urllib3_1`, keeping character counting on 1.x (matches latin-1 bytes) and UTF-8 counting on 2.x. The test_patch relocates the two content-length tests to module level and wraps the str test in `@pytest.mark.skipif(is_urllib3_1, ...)`, so each urllib3 line asserts only its own contract.

**Acceptance tests.** `tests/test_requests.py::test_content_length_for_bytes_data` (both versions) and `tests/test_requests.py::test_content_length_for_string_data_counts_bytes` (2.x only; skipped on 1.x). Both import `is_urllib3_1` from `requests.compat`.

**Agent notes.** Cues: title names urllib3 1.26.x and issue #6734; the test import fixes the exact flag name/location. Verify with `pytest tests/test_requests.py -k content_length` under both urllib3 1.26.x and 2.x (httpbin fixture is local via conftest). Risks: defensive version parsing (never crash at import), do not touch bytes/file-like branches, and remember non-latin-1 str bodies are simply unsupported on 1.x. This is the corrective follow-up to requests_6589.


### Subcategory: dependency-compat (1 tasks)


Compatibility with upstream dependency versions/APIs (Pydantic v1/v2, Starlette) and the fastapi/_compat shim layer, including model-config propagation.


#### fastapi_14077 — Upgrade Starlette supported version range to >=0.40.0,<0.49.0

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | dependency-compat |
| Subcategory | dependency-range |
| Root-cause family | — |
| Patch size | +5/-6, 3 files |
| Agent difficulty | 1/5 (few-lines) |

**Problem.** Starlette 0.48.0 renamed `HTTP_422_UNPROCESSABLE_ENTITY` to `HTTP_422_UNPROCESSABLE_CONTENT` (RFC 9110) and deprecated the old name. FastAPI must work with Starlette >=0.48 without deprecation warnings while keeping compatibility with >=0.40.

**Root cause.** Upstream rename, not a logic defect. Base code imports the old constant at module scope — `fastapi/exception_handlers.py` line 8: `from starlette.status import HTTP_422_UNPROCESSABLE_ENTITY, WS_1008_POLICY_VIOLATION` — and uses it at line 24, plus `fastapi/openapi/utils.py` lines 38/419 (`http422 = str(HTTP_422_UNPROCESSABLE_ENTITY)`) and `docs_src/handling_errors/tutorial005.py` line 13. Under Starlette 0.48+ the old name resolves through a warning-emitting deprecated accessor; the repo's `filterwarnings = ["error", ...]` (pyproject.toml lines 171-172) escalates that to an exception, so importing FastAPI or running the suite fails. The acceptance test itself also used the deprecated constant (line 105).

**Reference fix.** Replaces every use with the literal `422` (int) or `"422"` (string for the OpenAPI responses key), dropping the constant imports. Per the PR body, the literal was chosen deliberately over the new name, which would not exist on Starlette <0.48. Notably, the reference diff does not modify pyproject.toml (base pin `starlette>=0.40.0,<0.48.0` at line 46) despite the title — the graded change is the constant sweep only.

**Acceptance tests.** `tests/test_enforce_once_required_parameter.py::test_get_invalid` now asserts `response.status_code == 422`; `::test_schema` and `::test_get_valid` are unchanged guards.

**Agent notes.** Grep `HTTP_422_UNPROCESSABLE_ENTITY` to find all sites instantly. Do not switch to `HTTP_422_UNPROCESSABLE_CONTENT` (breaks the 0.40 lower bound); keep `WS_1008_POLICY_VIOLATION`; keep `http422` a string. Verify with `pytest tests/test_enforce_once_required_parameter.py -v` plus the handling-errors tutorial005 test, ideally under Starlette 0.48 with `-W error`.


### Subcategory: routing (1 tasks)


APIRouter/app route composition: include_router identity, lifespan/startup wiring, route-context iteration, static/frontend dispatch, and decorator surface.


#### fastapi_14851 — Re-implement `on_event` in FastAPI for compatibility with the next Starlette, while keeping backwards compatibility

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | dependency-compat |
| Subcategory | routing |
| Root-cause family | compatibility-shim |
| Patch size | +153/-4, 1 file |
| Agent difficulty | 3/5 (large) |

**Problem.** The next Starlette release (Kludex/starlette#3117) removes `Router` support for `on_startup`/`on_shutdown` and its private lifespan helpers. FastAPI must re-implement that machinery locally so `on_event`, constructor handler lists, and sync/async generator lifespans keep working after the upgrade. This is a forward-compatibility refactor (gitmoji ♻️), not a fix for a current runtime defect.

**Root cause.** Capability gap, not a bug in the current base. `fastapi/routing.py::APIRouter.__init__` forwards everything to Starlette — `super().__init__(routes=..., on_startup=on_startup, on_shutdown=on_shutdown, lifespan=lifespan)` (lines 906-913) — and `on_event` (line 4484) calls the inherited `self.add_event_handler`. `include_router` (lines 1426-1433) reads `router.on_startup/on_shutdown` and merges `lifespan_context`. When Starlette drops those kwargs and the private `_DefaultLifespan`/`_wrap_gen_lifespan_context`/`_AsyncLiftContextManager` helpers, construction raises `TypeError` and event/generator-lifespan handling breaks. Only `_merge_lifespan_context` (line 146) is already vendored.

**Reference fix.** Vendor the removed pieces into `routing.py`: `_AsyncLiftContextManager`, `_wrap_gen_lifespan_context`, and `_DefaultLifespan` (calls `router._startup()/_shutdown()`). `__init__` now stores handler lists locally, computes `lifespan_context` (None→`_DefaultLifespan(self)`; asyncgen→`asynccontextmanager`; gen→`_wrap_gen_lifespan_context`; else pass-through), and calls `super().__init__` with only `lifespan=lifespan_context`. Adds `APIRouter._startup/_shutdown/add_event_handler`. `on_event`/`include_router` work unchanged.

**Acceptance tests.** `tests/test_router_events.py::test_router_async_shutdown_handler`, `::test_router_sync_generator_lifespan`, `::test_router_async_generator_lifespan`, plus existing `test_router_events`/`test_app_lifespan_state`.

**Agent notes.** Vague statement (no paths/symbols); the solver must know which Starlette internals are removed. Single-file but adds five helpers. Do not keep forwarding `on_startup/on_shutdown` to `super()`; vendor rather than import Starlette privates. This PR assigns handler lists before `super().__init__`, a latent ordering clobber fixed later by fastapi_14873 — the supplied tests use `on_event`/lifespan so they pass regardless.


## Category: deprecation


Marks existing functionality deprecated or removes a legacy compatibility layer.


### Subcategory: dependency-compat (1 tasks)


Compatibility with upstream dependency versions/APIs (Pydantic v1/v2, Starlette) and the fastapi/_compat shim layer, including model-config propagation.


#### fastapi_14609 — Drop support for pydantic.v1

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | deprecation |
| Subcategory | pydantic-compat |
| Root-cause family | — |
| Patch size | +192/-1855, 20 files |
| Agent difficulty | 5/5 (large) |

**Problem.** Final step of the pydantic.v1 deprecation cycle (warn in 14583, custom category in 14605): remove the entire v1 compatibility layer and raise an error when a pydantic.v1 model is used, as the PR body states.

**Root cause.** Removal of a compatibility shim. At base, `fastapi/_compat/main.py` dispatches between v1/v2, `may_v1.py` aliases pydantic.v1 types, `v1.py` implements the v1 `ModelField`, and `temp_pydantic_v1_params.py` (718 lines) duplicates all param classes. `fastapi/utils.py::create_model_field` (lines 74-131) branches on `annotation_is_pydantic_v1(type_)` to `return v1.ModelField(**v1_kwargs)`; `APIRoute.__init__` (routing.py 640-683) only warns for v1 response models; `jsonable_encoder` (encoders.py 227-230) accepts `may_v1.BaseModel` instances. Every acceptance point must become a hard error and the shim must disappear.

**Reference fix.** Deletes `main.py`/`may_v1.py`/`model_field.py`/`v1.py`/`temp_pydantic_v1_params.py` and pv1 tutorials; `_compat/__init__.py` re-exports straight from `.v2`/`.shared`. Adds `is_pydantic_v1_model_class/instance` helpers (lazy `pydantic.v1` import with its UserWarning suppressed), `PydanticV1NotSupportedError(FastAPIError)` in exceptions.py, and raises it in `create_model_field`, `APIRoute.__init__` (response_model + responses models, replacing the warnings), and `jsonable_encoder`. All dependent modules are simplified to v2-only; `get_cached_model_fields`/`get_compat_model_name_map`/`_regenerate_error_with_loc` move into v2.py.

**Acceptance tests.** New `tests/test_jsonable_encoder.py::test_json_encoder_error_with_pydanticv1` (`pytest.raises(PydanticV1NotSupportedError)`); `tests/test_compat.py` loses its v1-only tests; `tests/test_compat_params_v1.py` and `test_filter_pydantic_sub_model/*pv1*` are deleted; `test_datetime_custom_encoder.py`, `test_inherited_custom_class.py`, `test_get_model_definitions_formfeed_escape.py` updated to v2-only.

**Agent notes.** Repo-wide refactor: grep `may_v1`/`temp_pydantic_v1_params` for the full cleanup list; the 14583 warning sites are exactly where raises go. Verify with the listed tests then the full suite; OpenAPI snapshots must stay byte-identical. Keep `annotation_is_pydantic_v1` (still needed to reject v1), suppress pydantic's own v1-import warning, and match the tested message "pydantic.v1 models are no longer supported by FastAPI.". Do not try to keep the deleted pv1 test files passing.


### Subcategory: deprecation-warnings (2 tasks)


Deprecation warning machinery: FastAPIDeprecationWarning visibility and registration-time warnings for legacy usage.


#### fastapi_14583 — Add deprecation warnings when using pydantic.v1

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | deprecation |
| Subcategory | deprecation-warnings |
| Root-cause family | — |
| Patch size | +24/-0, 2 files |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** pydantic.v1 models worked silently in FastAPI with no migration signal. The PR adds `DeprecationWarning` at route registration when a v1 model is used as an endpoint param, return annotation, `response_model`, or additional responses model — the first step of the cycle completed by PRs 14605 and 14609.

**Root cause.** Signaling gap. Base `fastapi/dependencies/utils.py::get_dependant` (lines 324-330) goes straight from `assert param_details.field is not None` to body/param dispatch, treating a `may_v1.ModelField` exactly like a v2 field. `fastapi/routing.py::APIRoute.__init__` builds response fields via `self.response_field = create_model_field(...)` (lines 636-641) and the additional-responses loop (lines 669-672), which silently branch to `v1.ModelField` internally. The detection helpers (`may_v1.ModelField`, `annotation_is_pydantic_v1`) already exist at base; neither module even imports `warnings`.

**Reference fix.** Warns in `get_dependant` when `isinstance(param_details.field, may_v1.ModelField)` ("...Please update the param {name}: {annotation!r}.", `stacklevel=5`), and in `APIRoute.__init__` when `annotation_is_pydantic_v1(self.response_model)` or an additional responses model is v1 ("...Please update the response model ...", "...In responses={}, please update ...", `stacklevel=4`). Category is plain `DeprecationWarning`; behavior is unchanged — v1 models still work.

**Acceptance tests.** New `tests/test_pydantic_v1_deprecation_warnings.py`: `test_warns_pydantic_v1_model_in_endpoint_param`, `::test_warns_pydantic_v1_model_in_return_type`, `::test_warns_pydantic_v1_model_in_response_model`, `::test_warns_pydantic_v1_model_in_additional_responses_model` — each registers inside `pytest.warns` then asserts a 200 response. ~15 existing pv1 test files gain warning expectations/filters.

**Agent notes.** Loci: the `get_dependant` param loop and `APIRoute.__init__` response-field creation. Verify with `pytest tests/test_pydantic_v1_deprecation_warnings.py` plus the updated pv1 suites. At this commit the category must be plain `DeprecationWarning` (`FastAPIDeprecationWarning` arrives later in 14605); message fragments and stacklevels (5 for params, 4 for response models) are regex-tested; warnings fire at decoration time. Do not change validation/serialization — requests must still succeed.


#### fastapi_14964 — Deprecate ORJSONResponse and UJSONResponse

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | deprecation |
| Subcategory | deprecation-warnings |
| Root-cause family | — |
| Patch size | +44/-8, 1 files |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** Once the Pydantic `dump_json` fast path (PR 14962) made default serialization faster, `ORJSONResponse`/`UJSONResponse` lost their performance rationale. The PR deprecates both classes and notes that `ujson`/`orjson` must now be installed explicitly.

**Root cause.** Deprecation-signaling gap. Base `fastapi/responses.py` defines `UJSONResponse` (lines 23-33) and `ORJSONResponse` (lines 36-48) as plain `JSONResponse` subclasses whose docstrings still advertise them as "high-performance" options; neither carries a deprecation marker, so users get no signal to migrate. `FastAPIDeprecationWarning` already exists in `fastapi/exceptions.py` (from PR 14605) and the `@typing_extensions.deprecated` pattern is used elsewhere, but these classes were never marked.

**Reference fix.** Applies `@deprecated(message, category=FastAPIDeprecationWarning, stacklevel=2)` to both classes (messages start "UJSONResponse is deprecated" / "ORJSONResponse is deprecated", linking the custom-response and response-model docs) and rewrites the docstrings to explain the fast path and the explicit-install requirement. `render()` is unchanged — the classes keep working. Existing tests gain `warnings.catch_warnings`/`filterwarnings` suppression.

**Acceptance tests.** New `tests/test_deprecated_responses.py`: `test_orjson_response_emits_deprecation_warning`, `test_ujson_response_emits_deprecation_warning` (`pytest.warns(FastAPIDeprecationWarning, match=...)` on instantiation) and `test_*_returns_correct_data`; updated `tests/test_orjson_response_class.py::test_orjson_non_str_keys` and `test_tutorial/test_custom_response/test_tutorial001.py` / `test_tutorial001b.py`.

**Agent notes.** Single-file change; loci named in the title. Verify with `pytest tests/test_deprecated_responses.py tests/test_orjson_response_class.py tests/test_tutorial/test_custom_response/`. Preserve `render()` behavior exactly (orjson non-str-keys/numpy options, ujson `ensure_ascii=False`); warning must fire on instantiation with category `FastAPIDeprecationWarning`. Although the PR text mentions removing `ujson`/`orjson` from `fastapi[all]`, the recorded patch does not touch `pyproject.toml` — keep the edit scoped to `responses.py`.


## Category: dx


Improves developer experience: error-message quality, warning visibility, or release/tooling automation.


### Subcategory: deprecation-warnings (1 tasks)


Deprecation warning machinery: FastAPIDeprecationWarning visibility and registration-time warnings for legacy usage.


#### fastapi_14605 — Add a custom FastAPIDeprecationWarning

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | dx |
| Subcategory | deprecation-warnings |
| Root-cause family | — |
| Patch size | +28/-16, 7 files |
| Agent difficulty | 2/5 (multi-file) |

**Problem.** FastAPI's deprecations (pydantic.v1 models, `regex`/`example` params) used plain `DeprecationWarning`, which Python's default filters hide for library code — users never saw them. The PR adds `FastAPIDeprecationWarning(UserWarning)` and converts every internal deprecation warning to it.

**Root cause.** Visibility gap. At base, all deprecation sites pass `category=DeprecationWarning`: `fastapi/params.py` lines 78/108/533/563, the mirrored `fastapi/temp_pydantic_v1_params.py`, `fastapi/dependencies/utils.py::get_dependant` (line 330, pydantic.v1 param), `fastapi/routing.py::APIRoute.__init__` (lines 643/683, pydantic.v1 response models), and positional-category warns in `generate_operation_id` (openapi/utils.py) and `generate_operation_id_for_path` (utils.py). Python only surfaces `DeprecationWarning` by default in `__main__`, so the deprecation program was ineffective (PR cites sethmlarson.dev/deprecations-via-warnings-dont-work-for-python-libraries). Base `fastapi/exceptions.py` (233 lines) has no custom warning class.

**Reference fix.** Appends `class FastAPIDeprecationWarning(UserWarning)` to `fastapi/exceptions.py` and swaps `category=DeprecationWarning` → `category=FastAPIDeprecationWarning` at all ~10 sites across 7 files (also normalizing the two `generate_operation_id*` helpers to `message=`/`category=` keywords). Messages and stacklevels are unchanged; `UserWarning` ancestry makes the warnings visible under default filters.

**Acceptance tests.** `tests/test_pydantic_v1_deprecation_warnings.py` (4 tests now `pytest.warns(FastAPIDeprecationWarning)`), `tests/test_compat_params_v1.py::test_query_regex_deprecation_warning` and the body/example variants, `tests/test_regex_deprecated_params.py`, `tests/test_regex_deprecated_body.py`, `tests/test_schema_extra_examples.py`, plus updated pv1 tutorial/benchmark filters.

**Agent notes.** `grep category=DeprecationWarning fastapi/` enumerates the full site checklist; the test_patch mirrors it. Verify with the listed warning test files. Must subclass `UserWarning` (not `DeprecationWarning`), convert every site (params.py and temp_pydantic_v1_params.py have four each), keep stacklevels 4/5 and message texts intact, and avoid circular imports — `exceptions.py` is a leaf module.


### Subcategory: error-messages (2 tasks)


Quality and content of raised exception/validation messages (fail-fast guards, endpoint context, exact message strings).


#### fastapi_14306 — Improve tracebacks by adding endpoint metadata

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | dx |
| Subcategory | error-messages |
| Root-cause family | — |
| Patch size | +121/-16, 2 files |
| Agent difficulty | 3/5 (multi-file) |

**Problem.** When validation fails, FastAPI's exception messages list error dicts but never say which endpoint caused them, complicating server-log debugging. The PR adds endpoint context (file, line, function, method + route path) to the exceptions' string representation, cached per endpoint, without changing client-facing 422 responses.

**Root cause.** Capability gap. At base, `fastapi/exceptions.py::ValidationException` (lines 157-162) stores only `_errors` and defines no `__str__`; `ResponseValidationError.__str__` (lines 180-184) prints `f"{len(self._errors)} validation errors:\n"` plus the dicts — always plural, no endpoint info. `fastapi/routing.py` raises these exceptions (lines 248-249, 347-358, 423-424, 453-455) with no endpoint metadata, even though `dependant.call` is available in the handler closures. Extracting source info per request via `inspect` would cost ~13µs/request (PR benchmark), so a cache is part of the requirement.

**Reference fix.** Adds an `EndpointContext` TypedDict and a keyword-only `endpoint_ctx` on all three validation exceptions, plus a shared `__str__` rendering `File "...", line N, in func` and `METHOD path` (fallback `Endpoint: path` when only path is known; correct singular/plural; rstripped). `routing.py` gains `_extract_endpoint_context` with an `id(func)`-keyed cache, builds `ctx["path"]` from `request.method` + scope `root_path` + `dependant.path` (so mounted sub-apps show `/sub/...`; `WS` prefix for websockets), and threads the context through `serialize_response` and every raise site.

**Acceptance tests.** `tests/test_validation_error_context.py` (new, 7 tests): request/response/websocket context, sub-app variants asserting `/sub/items/` and `/sub/ws/`, `test_validation_error_with_only_path` (`Endpoint: GET /api/test`, no `File "`), and `test_validation_error_with_no_context` (`1 validation error:`, no markers).

**Agent notes.** The PR body is a near-complete spec — follow its formats literally. Context must appear only in `str(exc)`, never in HTTP bodies. Include the mount prefix or sub-app tests fail; cache extraction or the performance design is violated. Run the new file plus existing validation/websocket suites, since the unified `__str__` changes `ResponseValidationError`'s exact message (singular, rstripped).


#### fastapi_14479 — Improve error message for invalid query parameter type annotations

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | dx |
| Subcategory | error-messages |
| Root-cause family | — |
| Patch size | +1/-1, 1 files |
| Agent difficulty | 1/5 (one-line) |

**Problem.** Since 0.181.2 (PR #12942), unsupported query parameter annotations — `list[Item]`, `tuple[Item, Item]`, `dict[str, Item]`, or `Annotated[str | dict, ...]` unions — crash app startup with a bare `AssertionError` carrying no message, leaving users no clue which parameter is invalid or why.

**Root cause.** Capability gap, not a logic defect: the rejection is intended, but the diagnostic is missing. In `fastapi/dependencies/utils.py::analyze_param` (lines 546-555), the Query branch asserts `is_scalar_field(field) or is_scalar_sequence_field(field) or (_is_model_class(field.type_) and getattr(field, "shape", 1) == 1)` and closes with a bare `)` at line 555 — no message string. When an annotation fails all three predicates, Python raises an empty `AssertionError`; the traceback names FastAPI internals but never the offending parameter. Trigger: declaring e.g. `data: FilterableStr | None = Query(default=None)` where `FilterableStr` is an `Annotated[str | dict, BeforeValidator(...), WithJsonSchema(...)]` union.

**Reference fix.** Attach a message to the existing assertion: the closing `)` becomes `), f"Query parameter {param_name!r} must be one of the supported types"`. The condition is untouched; the crash now names the parameter and the constraint, e.g. `AssertionError: Query parameter 'data' must be one of the supported types`.

**Acceptance tests.** `tests/test_invalid_sequence_param.py::test_invalid_sequence`, `::test_invalid_tuple`, `::test_invalid_dict`, `::test_invalid_simple_dict` — each upgraded from `pytest.raises(AssertionError)` to a `match="Query parameter 'q' must be one of the supported types"` assertion.

**Agent notes.** The PR's before/after tracebacks pinpoint the exact assertion, so localization is fully given. Critical detail: the authoritative wording is the test `match` string — "Query parameter 'q' must be one of the supported types" — while the PR prose example says "Query param 'data' must be of one of the supported types"; copying the prose variant fails the tests. Use `param_name!r` for the quoted name. Do not modify the assertion condition or the adjacent Path-param assertion (which already has a message). Verify with the full `test_invalid_sequence_param.py` plus query/path param suites.


### Subcategory: release-infra (1 tasks)


Repository release/tooling automation (version bump, release-notes CLI) outside the library runtime.


#### fastapi_15661 — Automate release preparation

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | dx |
| Subcategory | release-infra |
| Root-cause family | — |
| Patch size | +216/-0, 1 files |
| Agent difficulty | 3/5 (new-files) |

**Problem.** FastAPI releases required hand-editing `__version__` and moving the "Latest Changes" notes into a dated section of the release-notes page. This PR adds a Typer CLI, `scripts/prepare_release.py`, that automates version bumping and release-notes preparation, configurable via options or `PREPARE_RELEASE_*` environment variables.

**Root cause.** Capability gap, not a defect: `scripts/prepare_release.py` does not exist at base (confirmed via `_filelist.txt` and `_extracted.json`; only `pyproject.toml` was extracted). The PR body is an unfilled template, so the new test file is the real specification. It pins the module API (`RELEASE_NOTES_HEADER`, `BumpType`, `bump_version`, `update_version_file`, `update_release_notes`, `get_release_notes_body`, `app`), three CLI commands (`prepare`, `current-version`, `release-notes`), exact error substrings ("must be greater", "already contain", "Could not find", "is empty"), and exact stdout strings.

**Reference fix.** Creates a 216-line stdlib+Typer script: multiline regex finds the single `__version__ = "X.Y.Z"` assignment; bump logic validates strictly increasing versions; `update_release_notes` verifies the YAML-frontmatter header and inserts `## X.Y.Z (YYYY-MM-DD)` directly under `## Latest Changes` so pending changes become the new section's body; `get_release_notes_body` extracts a section ending only at the next semver H2 heading (non-version H2s stay in the body) and returns it with one trailing newline. `typer>=0.21.1` is already a dev dependency, so no packaging changes are needed.

**Acceptance tests.** `tests/test_prepare_release.py` (new, 307 lines, 16 cases): `test_bump_version` (3 params), `test_update_version_file*`, `test_update_release_notes*`, five `test_get_release_notes_body_*` variants, and four CliRunner tests (`test_cli_updates_configured_files`, `test_cli_accepts_env_vars`, `test_cli_prints_current_version`, `test_cli_prints_release_notes`).

**Agent notes.** Read the test file first and implement to its exact strings; the trickiest contract is that section extraction must not stop at non-version `##` headings, and `release-notes` must echo with `nl=False`. Verify with `pytest tests/test_prepare_release.py -v`; tests use `tmp_path`, so never touch the real `fastapi/__init__.py` or release notes. Keep the module importable as `scripts.prepare_release` from repo root. No external research needed despite the PR's asyncer reference.


## Category: docs


Changes documentation or tutorial example content only; no library behavior change.


### Subcategory: docs-src-tutorial (3 tasks)


docs_src tutorial example code/content correctness (handlers, metadata, streaming examples).


#### fastapi_14487 — Update docs about re-raising validation errors, do not include string as is to not leak information

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | docs |
| Subcategory | docs-src-tutorial |
| Root-cause family | — |
| Patch size | +5/-2, 1 files |
| Agent difficulty | 1/5 (few-lines) |

**Problem.** The handling-errors tutorial teaches users to render `RequestValidationError` with `PlainTextResponse(str(exc), status_code=400)`. The exception's string form embeds each error's raw `input` value, so copying this pattern into production reflects submitted data — potentially tokens, passwords, or PII — verbatim back to clients.

**Root cause.** Documentation/guidance gap rather than a framework defect: `docs_src/handling_errors/tutorial004.py::validation_exception_handler` (lines 14-16) does `return PlainTextResponse(str(exc), status_code=400)` with no filtering and no type annotation on `exc`. The tutorial needs to demonstrate a sanitized handler that exposes only error locations and messages, never the input payload.

**Reference fix.** The handler is rewritten to annotate `exc: RequestValidationError`, build `message = "Validation errors:"`, and append one line per error from `exc.errors()` formatted as `f"\nField: {error['loc']}, Error: {error['msg']}"` — deliberately excluding `error['input']` and `str(exc)` — then return `PlainTextResponse(message, status_code=400)`. A side benefit: `loc`/`msg` formatting is stable across Pydantic v1/v2, so the tutorial test can drop its version-conditional assertions.

**Acceptance tests.** `tests/test_tutorial/test_handling_errors/test_tutorial004.py::test_get_validation_error` (updated: asserts `"Validation errors:"` and `"Field: ('path', 'item_id')"` in the 400 response) and `::test_get_http_error` (unchanged regression guard for the 418 HTTPException path).

**Agent notes.** Localization follows FastAPI's tutorial convention: the test path maps directly to `docs_src/handling_errors/tutorial004.py`. The test's exact substrings define the required format — keep the `Validation errors:` prefix and the `Field: {loc}, Error: {msg}` line shape (the loc tuple renders via its repr). Do not include `str(exc)` or `error['input']`, do not change the status code or response class, and leave the HTTPException handler and route untouched. Verify with the tutorial004 test file (or the whole `test_handling_errors` directory). Do not modify tests or framework code.


#### fastapi_14492 — Fix example of license identifier in documentation

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | docs |
| Subcategory | docs-src-tutorial |
| Root-cause family | — |
| Patch size | +1/-1, 1 files |
| Agent difficulty | 1/5 (one-line) |

**Problem.** The metadata tutorial app declares `license_info={"name": "Apache 2.0", "identifier": "MIT"}` — an SPDX identifier for a different license than the name claims. The PR corrects the identifier to `Apache-2.0`.

**Root cause.** Documentation content error, not a framework bug. In `docs_src/metadata/tutorial001_1_py39.py::app` (lines 29-32) the base source reads `"name": "Apache 2.0",` followed by `"identifier": "MIT",`. FastAPI passes `license_info` verbatim into the OpenAPI `info.license` object, and OpenAPI 3.1 expects an SPDX expression there; `MIT` is a valid SPDX id but denotes the wrong license, so anyone copying the tutorial publishes contradictory license metadata. The tutorial test mirrored the wrong value, locking the mistake in.

**Reference fix.** A single-line change of `"identifier": "MIT"` to `"identifier": "Apache-2.0"` in the tutorial source. The test patch updates the expected `info.license` dict in the tutorial test to match, so the corrected example is now enforced by CI.

**Acceptance tests.** `tests/test_tutorial/test_metadata/test_tutorial001_1.py::test_openapi_schema` (asserts `license.identifier == "Apache-2.0"` inside the full schema comparison); `::test_items` is unchanged and guards the endpoint behavior.

**Agent notes.** The statement itself names both the wrong and correct values — grep `identifier` under `docs_src/` to localize instantly. Use the exact SPDX string `Apache-2.0` (hyphen, capital A); leave the `name` field as "Apache 2.0". Fix the example, not the test. Keep scope to `tutorial001_1_py39.py` as the reference patch does. Verify with `pytest tests/test_tutorial/test_metadata/test_tutorial001_1.py -v`.


#### fastapi_15023 — Update docs for responses and new stream with yield

| Field | Value |
|---|---|
| Repo | fastapi/fastapi |
| Kind | docs |
| Subcategory | docs-src-tutorial |
| Root-cause family | — |
| Patch size | +18/-8, 1 files |
| Agent difficulty | 2/5 (few-lines) |

**Problem.** The stream-data tutorial (`docs_src/stream_data/tutorial002_py310.py`) taught streaming a PNG by iterating `read_image()` directly, never closing the returned `BytesIO`, and it had no `yield from` example. The PR modernizes all four endpoints and adds a fifth demonstrating `yield from`.

**Root cause.** Capability/documentation gap, not a framework defect. At base, lines 23-44 define four endpoints whose bodies are all `for chunk in read_image():` / `yield chunk`; `read_image()` (lines 12-13) returns a fresh `BytesIO` that is left to garbage collection instead of being deterministically closed — a bad pattern to teach for real file handles. The sync-generator delegation idiom (`yield from`) was also missing from the tutorial.

**Reference fix.** Each endpoint becomes `with read_image() as image_file:` wrapping the chunk loop, so the file closes when the generator is exhausted (safe because `StreamingResponse` fully consumes the generator). A new sync endpoint `stream_image_no_async_yield_from` at `/image/stream-no-async-yield-from` uses `yield from image_file`, keeping `response_class=PNGStreamingResponse` and the `Iterable[bytes]` annotation. No library code changes.

**Acceptance tests.** `tests/test_tutorial/test_stream_data/test_tutorial002.py::test_stream_image` — parametrized path list gains `/image/stream-no-async-yield-from` and asserts the streamed bytes equal the PNG; `::test_openapi_schema` — expected schema gains the new path with summary "Stream Image No Async Yield From", operationId `stream_image_no_async_yield_from_image_stream_no_async_yield_from_get`, and `image/png` string schema.

**Agent notes.** The test pins the exact function name (operationId derives from it) and path; keep the endpoint sync (`def`) to match the teaching point. Do not touch the base64 constant or `read_image()`, and do not edit markdown prose — the reference patch only changes `docs_src`. Verify with `pytest tests/test_tutorial/test_stream_data/test_tutorial002.py -v`; the schema assertion is dict equality, so route order does not matter but names do.


---

# Appendix B: Full Task Index (patch/test statistics)

| instance_id | repo | kind | subcategory | difficulty | patch +/- | tests +/- |
|---|---|---|---|---|---|---|
| fastapi_15661 | fastapi/fastapi | dx | release-infra | d3 | +216/-0 | +307/-0 |
| fastapi_15588 | fastapi/fastapi | security | streaming-sse | d2 | +18/-5 | +9/-0 |
| fastapi_15589 | fastapi/fastapi | refactor | request-parsing | d2 | +4/-0 | +35/-0 |
| fastapi_15030 | fastapi/fastapi | feature | streaming-sse | d5 | +525/-35 | +970/-0 |
| fastapi_14962 | fastapi/fastapi | performance | response-serialization | d3 | +49/-6 | +101/-1 |
| fastapi_15280 | fastapi/fastapi | feature | routing | d1 | +71/-1 | +17/-0 |
| fastapi_14964 | fastapi/fastapi | deprecation | deprecation-warnings | d2 | +44/-8 | +94/-4 |
| fastapi_15023 | fastapi/fastapi | docs | docs-src-tutorial | d2 | +18/-8 | +15/-0 |
| fastapi_14986 | fastapi/fastapi | security | openapi-schema-generation | d3 | +25/-9 | +112/-0 |
| fastapi_14978 | fastapi/fastapi | security | request-parsing | d4 | +81/-1 | +241/-8 |
| requests_7505 | psf/requests | bugfix | body-stream-handling | d3 | +9/-7 | +15/-0 |
| requests_7502 | psf/requests | bugfix | body-stream-handling | d2 | +3/-1 | +11/-0 |
| requests_7433 | psf/requests | bugfix | body-stream-handling | d1 | +3/-3 | +15/-0 |
| requests_7427 | psf/requests | bugfix | proxy-auth-config | d2 | +4/-2 | +23/-0 |
| requests_7315 | psf/requests | bugfix | url-path-handling | d2 | +0/-2 | +2/-2 |
| requests_7328 | psf/requests | bugfix | redirect-history | d2 | +1/-2 | +8/-0 |
| requests_7309 | psf/requests | bugfix | header-parsing | d2 | +6/-9 | +4/-4 |
| requests_7205 | psf/requests | bugfix | proxy-auth-config | d1 | +1/-1 | +10/-0 |
| rich_4070 | Textualize/rich | performance | import-performance | d3 | +71/-57 | +3/-3 |
| rich_4077 | Textualize/rich | bugfix | console-tty-detection | d1 | +3/-0 | +17/-0 |
| rich_4079 | Textualize/rich | bugfix | markdown-rendering | d2 | +4/-3 | +16/-0 |
| rich_4076 | Textualize/rich | bugfix | ansi-decoding | d2 | +3/-3 | +23/-3 |
| rich_4075 | Textualize/rich | bugfix | console-output | d1 | +12/-3 | +6/-0 |
| rich_4006 | Textualize/rich | bugfix | cell-width-graphemes | d3 | +33/-12 | +38/-0 |
| fastapi_14258 | fastapi/fastapi | feature | error-messages | d1 | +4/-0 | +12/-0 |
| fastapi_14851 | fastapi/fastapi | dependency-compat | routing | d3 | +153/-4 | +76/-0 |
| fastapi_14873 | fastapi/fastapi | bugfix | routing | d2 | +11/-10 | +60/-0 |
| fastapi_13920 | fastapi/fastapi | feature | type-annotation-handling | d2 | +4/-0 | +27/-0 |
| fastapi_14794 | fastapi/fastapi | feature | dependency-injection | d2 | +3/-2 | +173/-0 |
| fastapi_14786 | fastapi/fastapi | bugfix | request-parsing | d1 | +1/-1 | +12/-0 |
| fastapi_14492 | fastapi/fastapi | docs | docs-src-tutorial | d1 | +1/-1 | +1/-1 |
| fastapi_14479 | fastapi/fastapi | dx | error-messages | d1 | +1/-1 | +16/-4 |
| fastapi_14463 | fastapi/fastapi | bugfix | openapi-schema-generation | d1 | +2/-1 | +123/-0 |
| fastapi_12942 | fastapi/fastapi | bugfix | type-annotation-handling | d2 | +3/-0 | +188/-0 |
| fastapi_14099 | fastapi/fastapi | bugfix | dependency-injection | d5 | +346/-131 | +284/-9 |
| fastapi_14609 | fastapi/fastapi | deprecation | dependency-compat | d5 | +192/-1855 | +32/-1475 |
| fastapi_14372 | fastapi/fastapi | refactor | dependency-injection | d2 | +4/-3 | +25/-0 |
| fastapi_14349 | fastapi/fastapi | bugfix | openapi-schema-generation | d2 | +6/-6 | +72/-0 |
| fastapi_14512 | fastapi/fastapi | bugfix | type-annotation-handling | d3 | +48/-4 | +207/-0 |
| fastapi_14487 | fastapi/fastapi | docs | docs-src-tutorial | d1 | +5/-2 | +2/-12 |
| fastapi_11355 | fastapi/fastapi | bugfix | type-annotation-handling | d2 | +9/-2 | +26/-0 |
| fastapi_14485 | fastapi/fastapi | bugfix | type-annotation-handling | d2 | +13/-6 | +80/-0 |
| fastapi_14482 | fastapi/fastapi | bugfix | dependency-compat | d3 | +25/-7 | +141/-0 |
| fastapi_14306 | fastapi/fastapi | dx | error-messages | d3 | +121/-16 | +168/-0 |
| fastapi_14458 | fastapi/fastapi | bugfix | wrapped-callables | d2 | +6/-1 | +32/-0 |
| fastapi_14459 | fastapi/fastapi | bugfix | security-schemes-openapi | d4 | +49/-22 | +149/-3 |
| fastapi_14448 | fastapi/fastapi | bugfix | wrapped-callables | d4 | +82/-24 | +376/-4 |
| fastapi_14455 | fastapi/fastapi | bugfix | security-schemes-openapi | d2 | +11/-2 | +131/-0 |
| fastapi_9753 | fastapi/fastapi | feature | wrapped-callables | d2 | +5/-2 | +251/-0 |
| fastapi_14430 | fastapi/fastapi | bugfix | request-parsing | d1 | +2/-2 | +14/-1 |
| fastapi_5077 | fastapi/fastapi | bugfix | wrapped-callables | d2 | +4/-2 | +40/-0 |
| fastapi_9555 | fastapi/fastapi | feature | wrapped-callables | d2 | +14/-8 | +77/-0 |
| fastapi_14361 | fastapi/fastapi | bugfix | openapi-schema-generation | d2 | +1/-1 | +92/-0 |
| fastapi_13207 | fastapi/fastapi | bugfix | openapi-schema-generation | d3 | +12/-2 | +5/-2 |
| fastapi_14360 | fastapi/fastapi | bugfix | request-parsing | d2 | +1/-2 | +76/-0 |
| fastapi_14356 | fastapi/fastapi | bugfix | request-parsing | d2 | +9/-2 | +112/-1 |
| fastapi_5624 | fastapi/fastapi | bugfix | dependency-injection | d2 | +3/-1 | +45/-0 |
| fastapi_14419 | fastapi/fastapi | bugfix | dependency-injection | d4 | +42/-20 | +153/-0 |
| fastapi_14301 | fastapi/fastapi | bugfix | dependency-injection | d1 | +4/-1 | +63/-1 |
| fastapi_14262 | fastapi/fastapi | feature | dependency-injection | d5 | +196/-70 | +412/-0 |
| fastapi_14266 | fastapi/fastapi | bugfix | security-schemes-openapi | d3 | +8/-10 | +60/-0 |
| fastapi_14246 | fastapi/fastapi | bugfix | openapi-schema-generation | d3 | +24/-4 | +205/-13 |
| fastapi_14186 | fastapi/fastapi | bugfix | dependency-compat | d4 | +266/-98 | +17/-4 |
| fastapi_9425 | fastapi/fastapi | feature | response-serialization | d2 | +2/-0 | +17/-0 |
| fastapi_13713 | fastapi/fastapi | feature | openapi-schema-generation | d2 | +31/-0 | +10/-1 |
| fastapi_14077 | fastapi/fastapi | dependency-compat | dependency-compat | d1 | +5/-6 | +1/-1 |
| rich_3718 | Textualize/rich | bugfix | table-panel-rendering | d2 | +3/-4 | +48/-0 |
| rich_3934 | Textualize/rich | bugfix | live-progress | d2 | +17/-3 | +18/-0 |
| rich_3953 | Textualize/rich | bugfix | cell-width-graphemes | d2 | +16/-10 | +17/-0 |
| rich_3944 | Textualize/rich | bugfix | cell-width-graphemes | d2 | +1/-1 | +6/-0 |
| rich_3942 | Textualize/rich | feature | markdown-rendering | d3 | +43/-27 | +9/-9 |
| rich_3938 | Textualize/rich | bugfix | console-output | d3 | +40/-5 | +32/-0 |
| rich_3882 | Textualize/rich | bugfix | prompt-input | d1 | +1/-1 | +13/-0 |
| rich_3894 | Textualize/rich | bugfix | pretty-repr-rendering | d2 | +4/-0 | +13/-0 |
| rich_3935 | Textualize/rich | bugfix | table-panel-rendering | d2 | +13/-3 | +30/-1 |
| rich_3905 | Textualize/rich | bugfix | live-progress | d1 | +4/-3 | +24/-0 |
| rich_3930 | Textualize/rich | feature | cell-width-graphemes | d5 | +12170/-544 | +189/-1 |
| httpx_3672 | encode/httpx | bugfix | connection-lifecycle | d4 | +57/-22 | +5/-5 |
| fastapi_14791 | fastapi/fastapi | bugfix | openapi-schema-generation | d1 | +2/-0 | +72/-0 |
| fastapi_15800 | fastapi/fastapi | feature | routing | d5 | +649/-5 | +858/-0 |
| fastapi_15785 | fastapi/fastapi | feature | openapi-schema-generation | d3 | +66/-15 | +104/-1 |
| fastapi_14371 | fastapi/fastapi | bugfix | request-parsing | d4 | +46/-16 | +309/-1073 |
| fastapi_14605 | fastapi/fastapi | dx | deprecation-warnings | d2 | +28/-16 | +38/-27 |
| fastapi_15763 | fastapi/fastapi | bugfix | routing | d3 | +10/-3 | +55/-0 |
| fastapi_14583 | fastapi/fastapi | deprecation | deprecation-warnings | d2 | +24/-0 | +778/-602 |
| fastapi_15745 | fastapi/fastapi | refactor | routing | d5 | +939/-291 | +858/-8 |
| fastapi_14297 | fastapi/fastapi | bugfix | request-parsing | d2 | +7/-0 | +54/-0 |
| fastapi_14303 | fastapi/fastapi | bugfix | request-parsing | d2 | +6/-2 | +47/-0 |
| fastapi_13537 | fastapi/fastapi | bugfix | request-parsing | d2 | +2/-1 | +35/-0 |
| fastapi_14953 | fastapi/fastapi | refactor | openapi-schema-generation | d3 | +102/-2 | +303/-28 |
| fastapi_13786 | fastapi/fastapi | bugfix | security-schemes-openapi | d3 | +176/-83 | +46/-28 |
| fastapi_14616 | fastapi/fastapi | bugfix | request-parsing | d2 | +10/-2 | +63/-0 |
| fastapi_11194 | fastapi/fastapi | bugfix | request-parsing | d2 | +3/-4 | +90/-0 |
| requests_6757 | psf/requests | dependency-compat | body-stream-handling | d3 | +16/-1 | +24/-17 |
| requests_6629 | psf/requests | bugfix | json-decoding | d2 | +10/-0 | +10/-0 |
| requests_6644 | psf/requests | bugfix | url-path-handling | d2 | +3/-0 | +8/-0 |
| requests_6589 | psf/requests | bugfix | body-stream-handling | d2 | +3/-0 | +17/-0 |
| requests_6592 | psf/requests | feature | status-codes | d1 | +1/-1 | +15/-0 |
| rich_3180 | Textualize/rich | bugfix | text-splitting | d3 | +89/-38 | +85/-0 |
| rich_3486 | Textualize/rich | feature | traceback-rendering | d4 | +74/-24 | +31/-0 |
| rich_3777 | Textualize/rich | feature | console-tty-detection | d2 | +12/-1 | +25/-0 |
| rich_3468 | Textualize/rich | bugfix | console-output | d3 | +36/-6 | +21/-0 |
| rich_3782 | Textualize/rich | bugfix | syntax-highlighting | d3 | +24/-5 | +41/-25 |
| rich_3772 | Textualize/rich | bugfix | traceback-rendering | d3 | +29/-16 | +24/-0 |
| rich_3296 | Textualize/rich | bugfix | syntax-highlighting | d1 | +1/-3 | +17/-0 |
| rich_3675 | Textualize/rich | feature | console-tty-detection | d2 | +28/-13 | +151/-85 |
| rich_3676 | Textualize/rich | feature | traceback-rendering | d2 | +12/-1 | +15/-0 |
| rich_3518 | Textualize/rich | bugfix | table-panel-rendering | d1 | +1/-1 | +19/-0 |
| rich_3535 | Textualize/rich | performance | cell-width-graphemes | d2 | +7/-1 | +21/-1 |
| rich_3521 | Textualize/rich | bugfix | text-splitting | d3 | +16/-19 | +21/-5 |
| rich_3506 | Textualize/rich | bugfix | text-splitting | d2 | +15/-2 | +29/-0 |
| rich_3480 | Textualize/rich | bugfix | text-span-management | d1 | +2/-2 | +11/-0 |
| rich_3472 | Textualize/rich | bugfix | pretty-repr-rendering | d2 | +3/-1 | +20/-0 |
| rich_3454 | Textualize/rich | bugfix | regex-highlighting | d1 | +1/-1 | +1/-0 |
| rich_3471 | Textualize/rich | bugfix | text-span-management | d1 | +1/-0 | +20/-0 |
| rich_3470 | Textualize/rich | bugfix | console-output | d2 | +1/-1 | +21/-17 |
| rich_3469 | Textualize/rich | bugfix | markdown-rendering | d3 | +1/-1 | +28/-3 |
| rich_3052 | Textualize/rich | feature | prompt-input | d2 | +29/-5 | +19/-1 |
| rich_3278 | Textualize/rich | bugfix | ansi-decoding | d2 | +1/-0 | +14/-0 |
| rich_2943 | Textualize/rich | bugfix | style-caching | d1 | +1/-1 | +14/-0 |
| rich_2725 | Textualize/rich | bugfix | table-panel-rendering | d2 | +5/-5 | +129/-0 |
| rich_3105 | Textualize/rich | bugfix | export-html-svg | d2 | +1/-1 | +3/-3 |
| rich_3130 | Textualize/rich | bugfix | markdown-rendering | d3 | +5/-7 | +35/-2 |
| rich_3043 | Textualize/rich | bugfix | export-html-svg | d1 | +1/-1 | +3/-3 |
| rich_3067 | Textualize/rich | bugfix | regex-highlighting | d1 | +1/-1 | +10/-0 |
| rich_3006 | Textualize/rich | bugfix | pretty-repr-rendering | d1 | +1/-1 | +40/-0 |
| rich_3064 | Textualize/rich | bugfix | markdown-rendering | d2 | +8/-9 | +8/-0 |
| rich_3063 | Textualize/rich | bugfix | markup-escaping | d2 | +3/-1 | +13/-1 |
| rich_3061 | Textualize/rich | bugfix | text-splitting | d4 | +67/-24 | +112/-3 |
