# Batonic Coding Framework (BCF): Dual-Track Submission Architecture & Leaderboard Strategy

**Date**: 2026-11-14
**Deliverable**: Task 2 — Dual-Track BCF Brain (`31B Main` & `E4B $10k Bonus`)
**Companion Report**: [01_Dataset_Classification_and_Root_Cause_Analysis.md](./01_Dataset_Classification_and_Root_Cause_Analysis.md)
**Verified Submissions**:
- **Track 31B (`gemma-4-31b-it-qat-w4a16-ct`)**: `submissions/track_31b/submission/`
- **Track E4B (`gemma-4-e4b-it-qat-w4a16-ct`)**: `submissions/track_e4b/submission/`

---

## 1. Executive Thesis: Moving Fragile Reasoning Out of the Weights Into Deterministic Structure

Analysis of the **129** tasks in `tasks.jsonl` and observed competition failure logs yields a clear structural diagnosis: **localization is rarely the bottleneck; execution discipline under tight token, tool, and container constraints is.** Across public experiments (`#752848`, `#755066`, `#755291`, `#750974`):
1. **31B failure mode**: Agents find the target file by tool call 2–3 in ~84% of runs, yet submit an **empty patch in 54% of baseline runs** (`#755066` / `#752848` summary), hit `14,336`-token compaction that erases prior tool history (`#754783`), loop on `edit_file` (`#756051`), or overrun the **12-hour wall-clock ceiling** (`#750521`, `project_12h.py`).
2. **E4B failure mode (`$10,000` Small-Model Bonus, `#750974`)**: Plain prompt swaps yield `0/31` locally (`1.8 min/task`, `97%` submitting patches, `13/31` editing the **wrong file**, or overwriting entire files via `write_file`). The public small-model ceiling has stalled at **0.10 (6/58)** while top main-board teams drop to `0.05–0.06` when swapping to E4B.
3. **100% Empty `hints_text` + 63.6% External URLs (`tasks.jsonl`)**: Every single dataset instance (`129/129`) provides an empty `hints_text`, `82/129 (63.6%)` reference GitHub/web URLs unreachable inside the airgapped Docker sandbox, and `37/129 (28.7%)` prompts are terse (`< 180` characters, down to `42` chars on Rich).

The **Batonic Coding Framework (BCF)** solves these failures architecturally rather than hoping prompt prose alone overrides model failure modes. By wrapping Google ADK's `SequentialAgent` (`bcf_plan -> solver`) around a zero-dependency pure-stdlib Python engine (`.git/bcf/bcf.py`), BCF moves classification, repository AST indexing, era probing, bounded line slicing, syntax-verified line-range patching, twin-tree checks, and persistent working memory into deterministic local tooling.

---

## 2. Exact ADK Submission Topology & File Inventory

Both tracks implement the required BCF submission hierarchy verbatim while isolating track-specific model aliases, sampling budgets, slice windows, and cognitive checklists:

```text
submission/
├── agent.yaml                      # SequentialAgent: bcf_plan -> solver (zero model/tools on root)
├── eval_config.yaml                # Track-calibrated per-task timeout, call cap & turn limits
├── configs/
│   ├── sampling_plan.yaml          # Tight deterministic blueprint sampling (temp 0.1)
│   └── sampling.yaml               # Track-tuned solver sampling & thinking budget
├── sub_agents/
│   ├── bcf_plan.yaml               # LlmAgent (output_key: bcf_spec, skills: [skills/bcf-spec])
│   └── solver.yaml                 # LlmAgent (instruction injects {bcf_spec})
├── prompts/
│   ├── bcf_plan.md                 # Zero-arg install + bcf.py spec workflow
│   └── solver.md                   # Exact budget match, {bcf_spec}, anti-loop, Done. rule
└── skills/
    └── bcf-spec/
        ├── SKILL.md                # YAML frontmatter manifest + pure-scalar CLI cookbook
        └── scripts/
            ├── install.py          # Zero-argument installer copying bcf.py into <repo>/.git/bcf/
            └── bcf.py              # Pure-stdlib AST classifier, spec builder, reader, patcher, checker
```

### 2.1 File-by-File Responsibilities & ADK Schema Compliance

| File Path | Role in BCF Pipeline | ADK & Harness Compliance Mechanics |
|---|---|---|
| `agent.yaml` | Root orchestrator (`SequentialAgent`) | Declares `sub_agents` order (`bcf_plan` then `solver`); omits `model`, `instruction`, and `tools` per Google ADK `SequentialAgent` specification. |
| `eval_config.yaml` | Per-task compute cap | Keeps `max_tool_calls >= 20`, `timeout_seconds = 90` (`< max_time_minutes * 60`), and conservative per-task ceilings safely below the 12-hour scorer limit. |
| `configs/sampling_plan.yaml` | Planner generation config | Low temperature (`0.1`), `top_p: 0.9`, capped `thinking_budget` (`1024` on 31B, `512` on E4B) so planning finishes in `< 20s` without over-thinking. |
| `configs/sampling.yaml` | Solver generation config | Guarantees `max_output_tokens >= 2048` and `thinking_budget < max_output_tokens` so thinking tokens never truncate structured tool-call JSON. |
| `sub_agents/bcf_plan.yaml` | Phase 1 LlmAgent | Loads `skills/bcf-spec`, grants ONLY `run_command` and `read_file` (never `edit_file` or `submit_patch`), writes output into session state `output_key: bcf_spec`. |
| `sub_agents/solver.yaml` | Phase 2 LlmAgent | Grants `run_command`, `read_file`, `edit_file`, `write_file`, `get_status`, `submit_patch`; intentionally excludes `get_code_subgraph` to eliminate array-arg parser hangs. |
| `prompts/bcf_plan.md` | Planner instructions | References only `{problem_description}` (never `{hints}`, preventing KeyError on 129/129 empty hints); outputs compact `BCF_SPEC` block. |
| `prompts/solver.md` | Solver instructions | Injects `{problem_description}` + `{bcf_spec}`; asserts literal `"about <M> minutes and <N> tool calls"` matching `eval_config.yaml`; enforces `"Done."` stop rule. |
| `skills/bcf-spec/SKILL.md` | ADK Skill manifest | Valid YAML frontmatter (`name: bcf-spec`, `description`); documents zero-arg skill execution + pure-scalar CLI invocations. |
| `skills/bcf-spec/scripts/install.py` | Zero-arg deployment script | Discovers git repo root from CWD / `WORKSPACE` / `/workspace`; resolves `.git` (including gitdir worktrees); copies `bcf.py` to `<repo>/.git/bcf/bcf.py`. |
| `skills/bcf-spec/scripts/bcf.py` | Pure-stdlib cognitive brain | Zero third-party imports (`sys.stdlib_module_names` verified); executes `classify`, `spec`, `locate`, `refs`, `read`, `patch`, `check`, and `journal`. |

---

## 3. Inside `bcf.py`: Mapping All 9 Dataset Categories & 19 Subcategories to Executable Brain Rules

Rather than treating all repositories uniformly, `bcf.py` encodes a structured **Category Playbook (`CATEGORY_SPECS`)**, live **HEAD Era Probe (`detect_era_facts`)**, and **Weighted Title-Prioritized Classifier (`classify_task`)** derived directly from our Task 1 root-cause audit of all 129 problems.

### 3.1 Domain Category & Subcategory Brain Routing Table

| Taxonomy Category (Task 1 Count / Bugs) | Subcategories Covered in `bcf.py` | Priority Source Targets Auto-Injected | Automated Co-Change & Hazard Guards in `bcf.py` |
|---|---|---|---|
| Cat 1: FastAPI DI, Annotations & Params (24 total, 15 bugs) | 1A Signatures/PEP695/eval_str, 1B wraps/partial/`__call__`, 1C scopes/ExitStack/Streaming, 1D alias/`getlist`/`Json[]`/underscores | `fastapi/dependencies/utils.py`, `models.py`, `params.py`, `param_functions.py`, `_compat/v2.py`, `asyncexitstack.py`, `routing.py`, `openapi/utils.py` | Enforces checking `_impartial()` before `inspect.unwrap()`, `inspect.isclass()` guards, `.getlist()` over `.items()` on MultiDicts, and coordinated `models.py` + `utils.py` checks. |
| Cat 2: Pydantic v2, Validation & OpenAPI (19 total, 14 bugs) | 2A CoreSchema/Union/`$ref`/bytes, 2B ValidationError schema/`deepcopy`/Swagger XSS escape, 2C Pydantic v1 compat & deprecation | `fastapi/_compat/v2.py`, `__init__.py`, `shared.py`, `openapi/utils.py`, `openapi/docs.py`, `applications.py`, `datastructures.py`, `exceptions.py`, `responses.py` | Probes live `has_may_v1`, `has_compat_v1`, `has_fastapi_deprecation_warning`, `inline_snapshot`, and `dirty_equals` in `tests/conftest.py`; warns against in-place schema mutation. |
| Cat 3: Security, Auth & Hardening (8 total, 7 bugs) | 3A 401 vs 403 / header `.strip()` / non-mutating scopes / OpenAPI scheme dedupe, 3B `strict_content_type` CSRF / SSE CR-LF | `fastapi/security/{api_key,http,oauth2,open_id_connect_url,utils}.py`, `dependencies/utils.py`, `openapi/utils.py`, `sse.py`, `routing.py`, `applications.py` | Co-change rule mandates auditing all 4 `fastapi/security/` modules simultaneously, concatenating `security_scopes` without `.extend()`, and checking `\r`/`\n` in SSE fields. |
| Cat 4: Routing, Lifecycle & HTTPX Twin (12 total, 2 bugs) | 4A Router self-inclusion/`EndpointContext`/`RouteContext`, 4B local `on_event`/Starlette 422/Rust JSON/SSE/frontend, 4C `httpx`/`ahttpx` twin pools | `fastapi/routing.py`, `applications.py`, `openapi/utils.py`, `exception_handlers.py`, `sse.py`, `responses.py`, `src/ahttpx/_*.py`, `src/httpx/_*.py` | `detect_era_facts()` detects twin directories (`src/ahttpx <-> src/httpx`), boosts twin-file scores symmetrically in `rank_candidate_files_and_tests()`, and `cmd_check()` warns on single-side edits (`TWIN_TREE_ASYMMETRY`). |
| Cat 5: Docs Examples, Tooling & Novelty (5 total, 0 bugs) | 5A `docs_src/` tutorials (`test_tutorial/`), `scripts/prepare_release.py`, novelty decorators | `docs_src/`, `scripts/`, `fastapi/applications.py` | Detects `docs_src/` presence and tutorial test paths; reminds `solver` that `tests/test_tutorial/` imports directly from `docs_src/` Python-version variants. |
| Cat 6: Rich Unicode, Graphemes & Console (18 total, 14 bugs) | 6A `cell_size`/PUA/C0-C1/ZWJ/chop/split cells, 6B `BrokenPipeError`/record+capture/`Live`/`Progress`/`FileProxy`/`TTY_*` env/import perf | `rich/cells.py`, `segment.py`, `_wrap.py`, `console.py`, `live.py`, `live_render.py`, `progress.py`, `file_proxy.py`, `diagnose.py` | Probes `rich/_unicode_data/` directory and `split_graphemes()` existence cleanly; enforces `_buffer_index == 0` guard and never styling `Segment("\n")`. |
| Cat 7: Rich Markup, ANSI & Style (13 total, 13 bugs) | 7A HTML tags/markup trailing `\`/URL regex/ANSI private escapes/splitlines/control strip/span copy, 7B `Style._hash`/tabs/Syntax padding | `rich/_export_format.py`, `markup.py`, `highlighter.py`, `ansi.py`, `text.py`, `style.py`, `syntax.py` | Flags constant regex/template inspection, iterating copy of `self._spans`, `strip_control_codes` hygiene, and `Style._hash = None` invalidation. |
| Cat 8: Rich Markdown, Tables, Traceback & Pretty (17 total, 13 bugs) | 8A Markdown table empty/styles/newlines, `Table._render`, Panel `border_style`, 8B `is Parameter.empty`, cyclic `_visited`, `Prompt` markup | `rich/markdown.py`, `table.py`, `panel.py`, `default_styles.py`, `repr.py`, `pretty.py`, `traceback.py`, `prompt.py`, `_inspect.py` | Co-change rule covers `default_styles.py` alongside `traceback.py`/`markdown.py`, `is Parameter.empty` identity checks, and cyclic exception visited sets. |
| Cat 9: Requests HTTP Client (13 total, 12 bugs) | 9A `__getattr__` wrappers/`has_read`/`JSONDecodeError`/urllib3 v1-v2, 9B S3 leading `//`/redirect `hist[:]`/`no_proxy`/netrc/Content-Type/UTF-8 `super_len`/HTTP 425 | `src/requests/{_types,models,utils,adapters,sessions,exceptions,compat,status_codes}.py` | Probes `has_read` helper and `startswith("//")` in live `HEAD`; flags `HTTPBIN_TESTS` offline-first `-k` selection and `isinstance` proxy greps across `_types.py` and `models.py`. |

### 3.2 Benchmark Proof of Classifier Precision on Real Competition Tasks

Before locking the dual-track submission brains, we evaluated `bcf.py`'s `classify_task()` directly against all **129 real task prompts** in `input/kagglecomp/kagglecomp_data_package/tasks.jsonl` using zero file-tree peeking (`repo_kind` + `problem_statement` only):
- **Initial substring classifier bug caught & eliminated**: An early rule containing bare `"sse"` substring matching false-matched common English prose substrings (`"assert"`, `"classes"`, `"passed"`) across FastAPI prompts, pulling initial prompt-only accuracy down to **76.7% Category / 89.1% Intent**.
- **Upgraded word-boundary regex + title-3x weighted classifier**: Refactoring to `_score_weighted_rules()` with regex word boundaries (`\bsse\b`, `\$ref\b`, checkbox-aware intent precedence, 3x weight on first non-empty title line) raised accuracy on pure text alone to:
  - **Intent Accuracy**: **125 / 129 (96.9%)**
  - **Domain Category Accuracy**: **121 / 129 (93.8%)** (the remaining 8 misses are opaque short prompts such as `"Fix #3104"` or subtle cross-cutting FastAPI PRs that `rank_candidate_files_and_tests()` resolves cleanly inside the checked-out repository using live AST symbol indexing).

---

## 4. Dual-Track Brain Tailoring: Gemma 4 31B vs. Gemma 4 E4B

A naive submission shares one prompt and config across 31B and E4B. Forum evidence (`#750974`) proves that copying a 31B prompt directly onto E4B collapses score from Gold/Silver contention to **0/31 solved** because E4B hallucinates `edit_file` anchors, edits wrong files (`13/31`), overwrites whole files, and loses coherence under loose token limits. BCF engineers **two distinct cognitive operating envelopes**:

| Configuration / Mechanism | Track 31B (`track_31b`) | Track E4B (`track_e4b`) | Engineering Justification |
|---|---|---|---|
| **Declared Model (`model:`)** | `gemma-4-31b-it-qat-w4a16-ct` | `gemma-4-e4b-it-qat-w4a16-ct` | Exact alias matching on both `bcf_plan.yaml` and `solver.yaml`; single-model rule respected; E4B bonus eligibility verified (`#751104`). |
| **`eval_config.yaml` Budget** | `timeout_seconds: 90`, `max_tool_calls: 24`, `max_time_minutes: 5.5`, `max_turns: 45` | `timeout_seconds: 90`, `max_tool_calls: 20`, `max_time_minutes: 4.5`, `max_turns: 38` | Keeps 120-task worst-case wall-clock below 12h even under `k=1.7x` scorer slowdown; `max_tool_calls >= 20` avoids tiny-loop stalls. |
| **Planner Sampling (`sampling_plan.yaml`)** | `temp: 0.1`, `top_p: 0.9`, `max_output_tokens: 4096`, `thinking_budget: 1024` | `temp: 0.1`, `top_p: 0.9`, `max_output_tokens: 3072`, `thinking_budget: 512` | Fast deterministic blueprint extraction (`3-5` calls on 31B, `2-3` calls on E4B); bounds E4B planner latency before compaction. |
| **Solver Sampling (`sampling.yaml`)** | `temp: 0.2`, `top_p: 0.95`, `max_output_tokens: 8192`, `thinking_budget: 2048` | `temp: 0.15`, `top_p: 0.9`, `max_output_tokens: 4096`, `thinking_budget: 1024` | Lower E4B temperature (`0.15`) + tighter `top_p` (`0.9`) curb token/string drift; `max_output_tokens >= 4096` + `thinking_budget < max_output` guarantees untruncated JSON tool calls. |
| **`bcf.py` Default Profile** | `DEFAULT_PROFILE = "31b"` | `DEFAULT_PROFILE = "e4b"` | Changes slice windows, candidate caps, spec density, and hazard instructions automatically with zero extra CLI flags. |
| **`bcf.py read` Window Cap** | `180` lines max | `120` lines max | Protects 31B and especially smaller-window E4B from triggering the `14,336`-token ADK compaction event that drops tool call history (`#754783`). |
| **`bcf.py spec` Candidate Cap** | Up to `6` files / `8` symbols / `5` test targets | Up to `4` files / `5` symbols / `3` test targets | Prevents E4B file-distraction failures (`13/31` wrong-file edits in `#750974`) by pinning top-4 AST-scored targets directly in system instructions. |
| **Blueprint (`bcf_spec`) Shape** | Rich architectural spec (~650 tokens) + topological co-change rules | Compact numbered 1-2-3-4 micro-checklist (~300–400 tokens) + `E4B_EDIT_GUARD` | 31B excels at multi-file topological reasoning (`deps` + `docs_src` + `twin-tree`); E4B excels when given a sequential step list inside its system prompt. |
| **Editing Guardrail** | `edit_file` allowed up to `15` lines; max 1 retry -> `bcf.py patch` | `bcf.py patch` **upfront** for any edit `> 8` lines; `edit_file` only for trivial `<= 8`-line edits; `write_file` on existing files explicitly forbidden | Eliminates `#756051` missing-`old_string` loops and E4B whole-file overwrite destruction (`#750974`). |

---

## 5. Harness Hazard Mitigation Matrix

Every known failure mode reported in the competition forums is blocked structurally inside BCF's code, YAML configs, and prompts:

| Hazard ID / Source | Observed Production Failure | BCF Architectural Fix & Location |
|---|---|---|
| **`#753973` vLLM Array Parser Hang** | Passing array args (`args: [...]` to `run_skill_script` or `nodes: [...]` to `get_code_subgraph`) triggers endless decode loops / OOM freezes in vLLM. | `scripts/install.py` takes **zero arguments** (`skill_name="bcf-spec"`, `script_path="scripts/install.py"` only); `get_code_subgraph` is omitted from `solver.yaml`; all `bcf.py` calls run as pure scalar shell commands via `run_command`. |
| **`#754636` SequentialAgent Nudge Restart** | Continuation nudges restart `sub_agents[0]` (`bcf_plan`), duplicating 10–12k tokens and forcing compaction immediately inside `solver`. | `bcf.py spec --cached` detects existing `.git/bcf/spec.json` + `.git/bcf/journal.md` and returns the cached blueprint in 1 lightweight call without re-indexing or erasing journal progress. |
| **`#754783` Lossy Compaction Summarizer** | When total context hits `14,336` tokens, ADK `LlmEventSummarizer` skips `function_call` / `function_response`, leaving the model thinking it made no edits. | Three-layer durability: (1) `{bcf_spec}` lives inside `solver`'s **system instruction** (never evicted); (2) `bcf.py read` enforces `<= 180` / `<= 120` line slices so runs rarely hit `14,336` tokens; (3) `.git/bcf/journal.md` + `git diff --stat` recover full state on disk. |
| **`#756051` / Edit Loop Spins** | Models repeat identical failing `edit_file` calls verbatim (up to 34 identical turns) or corrupt newlines with literal `\n` escaping. | `prompts/solver.md` caps `edit_file` retries at **1**, switching immediately to `bcf.py patch --start --end <<'EOF'`; `cmd_patch()` computes SHA-256 `(file, old_str, new_code)` hashes returning exit code `2` on duplicate attempts, validates AST syntax with instant backup rollback returning exit code `3` on `SyntaxError`; `cmd_check()` blocks `LITERAL_BACKSLASH_N_CORRUPTION` on both modified diffs and untracked `.py` files. |
| **Container B Protected-Path Reset** | Evaluation resets `tests/`, `conftest.py`, `pytest.ini`, `pyproject.toml`, `setup.cfg`, and `.pth` files before grading; test-only edits score `0`. | `cmd_check()` scans `PROTECTED_PATTERNS` via `git diff HEAD` + `git ls-files --others` and fails with `ONLY_TEST_OR_PROTECTED_FILES_MODIFIED` if no production files changed, while emitting `PROTECTED_PATH` and `UNTRACKED_FILES` warnings. |
| **Empty `hints_text` Template Crash** | Referencing `{hints}` in prompts throws ADK template `KeyError` whenever `hints_text` is empty (**129/129** dataset tasks). | Neither `bcf_plan.md` nor `solver.md` references `{hints}`; both inject `{problem_description}` cleanly. |

---

## 6. Verification & Automated Test Results

All deliverables underwent automated static validation and isolated end-to-end execution across synthetic git fixtures mirroring FastAPI, Rich, Requests, and HTTPX:
- **Test Harness (`scratch/test_bcf_deliverables.py`)**: **6 / 6 test groups PASSED (0 failures)**:
  1. **`STATIC_OK [31b]`**: `11` files present, `SequentialAgent` + `LlmAgent` `!include` resolution, model `gemma-4-31b-it-qat-w4a16-ct`, budget alignment `5.5m / 24tc`, pure `sys.stdlib_module_names` verification (`python -I ... --help`), zero `__pycache__`, zero symlinks.
  2. **`STATIC_OK [e4b]`**: `11` files present, model `gemma-4-e4b-it-qat-w4a16-ct` across every LlmAgent, budget alignment `4.5m / 20tc`, `thinking_budget < max_output_tokens`, stdlib-only verified.
  3. **`RUNTIME_FA_PLAN_OK [31b]` & `[e4b]`**: Zero-arg `install.py` invoked outside repo CWD installs `.git/bcf/bcf.py` with clean `git status`; `spec` selects `CAT1_FASTAPI_DI_PARAMS`; `read` enforces exact `1-180` (`31b`) and `1-120` (`e4b`) window bounds; `--cached` triggers `[CACHED_PLAN]`; `locate` & `refs` resolve symbol callers cleanly.
  4. **`RUNTIME_PATCH_CHECK_JOURNAL_OK`**: Confirmed `patch` `SyntaxError` auto-rollback (`rc=3`, zero workspace residue), SHA-256 duplicate-edit refusal (`rc=2`), clean line-range patch (`rc=0`), `check` failing on empty diff (`rc=1`), test-only diff (`rc=1`), and untracked literal-`\n` corruption (`rc=1`), plus `journal` persistence.
  5. **`RUNTIME_MULTI_REPO_OK`**: Verified `httpx`/`ahttpx` `TWIN_TREE_ASYMMETRY` warning triggered on single-side edit and cleared upon mirror sync, Rich `CAT6` routing, and Requests `CAT9` + `HTTPBIN_TESTS` hazard flagging.

---

## 7. Championship Strategy: Topping Both the Main (31B) and Bonus ($10k E4B) Leaderboards

### 7.1 Competitive Landscape Calibration (Verified 2026-11-05 Snapshot)

| Track / Tier | Public Leaderboard Reference (`58` Public Tasks) | Prize / Medal Threshold | How BCF Wins |
|---|---|---|---|
| **Main Competition (`$65k`: `$37k` / `$18k` / `$10k`)** | `#1` at `0.29` (`17/58`); `#2–10` at `0.24` (`14/58`); Gold (`1–19`) at `0.22` (`13/58`); Median `0.15` (`8–9/58`) | Money requires `>= 0.24`–`0.29+`; **no single LoRA run has beaten base+scaffold cleanly due to +29% runtime overrun (`#755677`)** | Eliminates the 54% empty-patch & edit-loop waste via `bcf.py` pre-localization + AST-verified `patch`/`check`, pushing 31B above `0.24–0.30` while capping worst-case runtime strictly inside `12h`. |
| **Small-Model Bonus (`$10k`, Single Winner on Private Split)** | Top 12 tied at `0.10` (`6/58`); next 55 teams at `0.08` (`5/58`); baseline E4B swap gets `0/31` locally (`#750974`) | Highest single private score among E2B/E4B entries **manually selected as one of two final submissions** | Moves localization (`spec`), slicing (`<=120`), patching (`bcf.py patch`), and sanity validation (`check`) into pure Python stdlib so 4B capacity focuses 100% on causal logic — targeting `8–10+/58`. |
| **Paper Award (`$35k`, Optional Track)** | Hosted event / NeurIPS-style showcase | Reproducible methodology + empirical ablations | BCF taxonomy (129/129 tasks), offline `bcf.py` brain ablation vs empty-patch baseline, and 31B vs E4B scaling provide clean, publishable scientific results. |

### 7.2 Wall-Clock 12-Hour Safety Math (`project_12h.py` Framework)

Public runs repeatedly failed with **"Completed, No Score"** (`Alex Ust` 8-min bundle overrun, `SANIDHAYA SHARMA` 10-min timeout) because the Kaggle scorer executes `k ≈ 1.6–1.7x` slower than 3-concurrent RTX PRO 6000 execution across ~120 hidden tasks (`~58` public + `~62` private) plus ~10s container setup per task:
- **Track 31B (`max_time_minutes: 5.5`, `max_tool_calls: 24`)**: Even at `100%` timeout saturation, `120 * (5.5 * 60 + 10) / 3600 = 11.33h` — **strictly below the 12.0h cliff**. In realistic evaluation where median solved/early-exit tasks average `3.5–4.2 min` on scorer, projected wall-clock sits safely around `7.5–9.0h` (GREEN zone under `project_12h.py` `<= 11.0h`). Wait-free scalar commands and `--cached` nudges keep waste near zero.
- **Track E4B (`max_time_minutes: 4.5`, `max_tool_calls: 20`)**: Because E4B generates faster per token (`~1.8–2.5 min` typical locally, `k * 2.2 ≈ 3.7 min` on scorer), 120 tasks finish in `~7.5h` typical (`9.33h` absolute worst-case ceiling), preserving a `> 2.5h` safety margin against scorer variance.

### 7.3 Execution Checklist for Final Competition Run
1. **Packaging Discipline (`build_zip.py` / Clean Archive Check)**: Zip contents strictly from `submission/` root so `agent.yaml` sits directly at zip root (no extra outer directory, zero `__pycache__`, zero `.pyc`, zero symlinks). Run the verification suite before every upload.
2. **Pre-Submit Local Dry Run & `project_12h.py` Calibration**: Validate BOTH Track 31B and Track E4B over a stratified local subset covering all 9 taxonomy categories (especially FastAPI DI `Cat 1`, Pydantic/OpenAPI `Cat 2`, Rich `Cat 6–8`, and HTTPX twin-tree `Cat 4C`), rejecting any change whose `k=1.7` projection exceeds `11.0h`. Keep zero LoRA unless a local benchmark proves accuracy gains outweigh the `+29%` latency penalty (`#755677`).
3. **Portfolio Final Selection Strategy (`#752220` Ruling)**: Because Kaggle scores the **better of the two selected finals** (`752220`) while queue times average `18–32h`, bank an early high-scoring **Track 31B** bundle first (winning early-submission tie-breakers), then finalize **Track E4B** by **November 22** and **manually select ONE Track 31B submission + ONE Track E4B submission as your two Finals before 2026-12-02 23:59 UTC** — competing at full strength for the **\$65k Main / \$37k 1st Prize** AND locking down eligibility for the **\$10k Small-Model Bonus** without sacrificing your main leaderboard standing.
