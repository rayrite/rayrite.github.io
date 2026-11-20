# Task 5: Community Submission Issues Census & BCF Graceful-Handling Audit

> **Scope:** Exhaustive census of submission, scoring, inference, and sandbox issues reported by competing teams on the Kaggle *Gemma 4 Developer Agent* discussion board (`https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion`, Threads `#743063` through `#760595`) and in `input/kagglecomp/`, followed by a line-by-line graceful-handling audit of the current dual-track Batonic Coding Framework (BCF) implementations in `deliverables/2026-11-20_BCF_Gemma4_Winning_Design/`.
> **Date Anchor:** `2026-11-20` (cross-checked against `intel_20261120` captured `2026-11-20 04:47 UTC`, live web sweep, `HARNESS_README.md`, and ADK 1.36.1 `skill_toolset.py` source evidence).

---

## Executive Verdict: Go / No-Go Audit Summary

**Current Status of `deliverables/2026-11-20_BCF_Gemma4_Winning_Design/`: `NO-GO (DO NOT SUBMIT AS-IS)`**

Across **22 distinct community submission and scoring issues**, the current BCF implementations (`submission_31b/` and `submission_e4b/`) already handle **14 / 22 cleanly (`HANDLED`)**, leave **5 / 22 partially exposed (`PARTIAL / RISK`)**, and fail **3 / 22 (`UNHANDLED / BROKEN`)**—including **two P0 ship-blockers** and **three P1 high-severity score leaks** that will severely degrade or zero-out Kaggle LB runs unless patched first:

| Audit Severity | Issue Count | Summary of Finding | Impact if Unpatched on Kaggle |
| :---: | :---: | :--- | :--- |
| **P0 — Ship-Blocker** | 2 | **(1) Wrong ADK 1.36.1 parameter name (`script_path` vs. `file_path`)** in all 4 prompt/`SKILL.md` files; **(2) Residual `skills:` array-arg schema exposure (`#753973`, `#759580`) + hidden-scorer skill container isolation (`#758547`, `#758854`) + ADK `_DEFAULT_SKILL_SYSTEM_INSTRUCTION` forced `load_skill` turn** | `100%` of `run_skill_script` calls fail with `INVALID_ARGUMENTS` (`file_path is required`); a single `]`-prompt violation freezes vLLM 0.19.1 permanently (`0.00` OOM); hidden-scorer skill isolation can collapse score to `0.00` |
| **P1 — High Score Leak** | 3 | **(3) `bcf_plan` heredoc output truncation** on long prompts (`10,095` chars) & E4B `max_output_tokens: 1536 < 2048` + `SequentialAgent` nudge/handoff penalty (`#754636`, `#760126`); **(4) 31B `solver.yaml:19` `max_output_tokens: 8192`** causing vLLM HTTP 400 empty-patch wipes; **(5) Fenced `bash` blocks** (31% vs. 5% malformed tool calls) + exposed `write_file` tool (`#760595`) | Silent patch wipes on long sessions, `5–6×` higher malformed tool-call rate, `/workspace/tmp/` patch pollution, and truncated plans |
| **P2 — Capability & Parity Gaps** | 3 | **(6) `bcf.py` truncation (`raw[:24000]` blinds 50/129 tasks > line 600, `[:16000]` test scan, `"stream_image"` leak), single-hunk-only patcher (71/129 multi-hunk tasks), top-level-only smoke import without `PYTHONSAFEPATH=1` / AST scope check, and `.git` worktree check** | Missed localizations, extra turns/line drift on multi-hunk bugs, subtle `ImportError`/`NameError` leaks into Container B |
| **Cleanly Handled** | 14 | Finite `eval_config.yaml` (`#760140`), `< 12 h` math (`#743063`), single-model rule (`#758969`), kebab-case skill name (`#758854`), zero `get_code_subgraph`, zero LoRA TPS tax (`#760309`), E4B calibrated `thinking_budget=768` + `include_thoughts=true` (`#760014`), heredoc backtick protection (`#756051`), protected-path guard + true `PYTEST_EXIT` (`#760595`, `#748323`), `budget_warning` enabled (`#750490`), clean UTF-8 LF ZIP packaging, `"Done."` stop rule | Strong architectural foundation once P0/P1 blockers are resolved |

> [!CAUTION]
> **Critical Discovery (`validate_and_package_bcf.py` Blind Spot):** Why did `validate_and_package_bcf.py` pass with zero errors despite the broken `script_path` argument? Because line 209 only grepped for the literal string `"scripts/install.py"` and lines 311–316 tested `install.py` via direct `runpy.run_path()` rather than invoking ADK 1.36.1's `RunSkillScriptTool` parameter schema (`file_path`). Section 3 provides exact drop-in patches for both the submissions and `validate_and_package_bcf.py`.

---

## Section 1: Exhaustive Census of Community Submission & Scoring Issues

The 22 documented failure modes across the Kaggle discussion board and `input/kagglecomp/` fall into five operational categories:

### Category A — Packaging, Schema & Validation Crashes
1. **`eval_config.yaml` `null` Crash (`#760140`):** Getting Started v3 casts `evaluation.*` fields directly with `int()`/`float()`; any `null` or omitted numeric value crashes Stage 1 startup immediately (`0.00`).
2. **Single-Model Rule & `SequentialAgent` Top-Level `model:` Crash (`#758969`, `HARNESS_README.md:182`):** Declaring two different base models across sub-agents—or setting `model:` on a `SequentialAgent` container—triggers `ParticipantVisibleError` or ADK schema rejection.
3. **Skill Frontmatter Validation Rejections (`#758854`):** ADK `SkillToolset` rejects any skill `SKILL.md` whose `name` contains uppercase letters, underscores, exceeds 64 chars, or fails to match its folder name (`^[a-z0-9]+(-[a-z0-9]+)*$`).
4. **Archive Hygiene & Path Violations (`HARNESS_README.md:72,102,144`):** Forbidden extensions (`.bin`, `.pt`, `.pth`), leftover `__pycache__/*.pyc`, symlinks, UTF-8 BOMs, Windows CRLF line endings on Python scripts, nested root folders (`submission/agent.yaml` instead of `agent.yaml` at ZIP root), or `!include` escaping the submission directory (`PathTraversalError`) fail validation before inference starts.
5. **Wrong Model Alias or `thinking_level` Misconfiguration (`#755992`, `HARNESS_README.md:149`):** Using non-whitelisted model names (`gemma-4-31b-it` instead of `gemma-4-31b-it-qat-w4a16-ct` / `gemma-4-e4b-it-qat-w4a16-ct`) or passing `thinking_level` to vLLM's OpenAI `/v1` endpoint causes validation rejection or dropped reasoning config.
6. **ADK 1.36.1 `RunSkillScriptTool` Parameter Schema & Hidden System Prompt (`adk_1.36.1_skill_toolset.py:61–88, 735–781`):** ADK 1.36.1 strictly requires `file_path` (NOT `script_path`) in `run_skill_script` (`if not file_path: return INVALID_ARGUMENTS`). Furthermore, attaching any skill injects `_DEFAULT_SKILL_SYSTEM_INSTRUCTION`, which tells the LLM to call `load_skill` before `run_skill_script`—consuming an unbudgeted extra turn and fighting custom prompts.

### Category B — vLLM 0.19.1 Inference, Quantization & Tool-Parser Failures
7. **vLLM 0.19.1 `_parse_gemma4_array` Infinite Loop / 26.7 GB OOM Freeze (`#753973`, `#759580`):** Whenever ANY registered tool exposes an array parameter (`list[str]`, such as `get_code_subgraph` OR `run_skill_script`'s `args`/`positional_args`) and the model emits malformed Gemma 4 array syntax triggered by `]` characters (present in **41/129 = 31.8%** of problem statements), vLLM's parser spins infinitely, leaks `26.7 GB` RAM, and deadlocks the entire submission (`0.00` timeout).
8. **vLLM HTTP 400 Context-Overflow Patch Wipe (`gemma4-swe-kit/README.md`):** On `max_model_len = 32,768`, if `prompt_tokens + max_output_tokens > 32,768`, vLLM returns HTTP 400 (`maximum context length exceeded`). `swegemma` catches this as `"Sandbox execution error"` and outputs an **EMPTY patch**, wiping even a valid edit created earlier in the trajectory.
9. **E4B Uncalibrated Thinking / Cutoff Loops (`#760014`, `preflight_static.py`):** Setting `include_thoughts: false`, leaving unbounded thinking (`thinking_budget: 4096+`), or capping `max_output_tokens < 2048` on E4B causes `<|tool_call>` truncation, malformed JSON tool arguments, and rapid score collapse to `0.00–0.05`.
10. **Fenced Shell Blocks Driving Malformed Tool Names (`gemma4-swe-kit`):** Including raw fenced `bash` code blocks in system prompts caused Gemma 4 to emit shell commands as tool names (`call:python3`, `call:bash`, `call:git`) on **31% (30/96)** of runs vs. **5% (5/96)** when rewritten as prose explicitly bound to `run_command`.
11. **LoRA Adapter Serving Overhead (`#760309`, `#755677`):** Adding PEFT LoRA adapters on 4× L4 degrades token throughput by ~40–50% while adding negligible or negative accuracy gain unless deeply trained, pushing 120-task runs past the 12-hour hard kill.

### Category C — ADK Orchestration, Multi-Agent & Skill Runtime Divergence
12. **Hidden-Scorer Skill Script Container Isolation (`#758547`, `#758854` Nov 14 Update):** Multiple teams (`clanevil`, `GabrielOchoa619`, `purnimapathak15`) reported that `run_skill_script` runs in an isolated host/temp context outside Container A's `/workspace` on the Kaggle hidden scorer, either seeing only its own skill directory or silently producing `0.00` submissions even when local tests passed.
13. **`SequentialAgent` Continuation-Nudge Re-Entry & LB Ceiling (`#754636`, `#760126`):** When `swegemma` sends up to 3 continuation nudges (if an agent stops without calling `submit_patch`), a `SequentialAgent` re-executes from Stage 1 (`bcf_plan`), risking `session.state[output_key]` overwrite and wasted turns. Independently, Murugesan (`#760126`, Nov 19) reported `SequentialAgent` pipelines capping at `<= 0.10` on Kaggle LB vs. `0.15–0.18` for clean monolithic single-agent prompts.
14. **Long-Prompt Heredoc Truncation in Planning Stage:** Four public tasks exceed `3,000` chars (`fastapi_14463` = `10,095`, `fastapi_13786` = `5,328`, `fastapi_15745` = `4,304`, `rich_4070` = `3,096`). Asking a planning sub-agent to paste problem text into a heredoc while capped at `1536–2048` output tokens causes mid-tool-call truncation.
15. **Silent `budget_warning` Disablement & Post-Submit Turn Waste (`#750490`):** Setting `max_tool_calls < 20` prevents `swegemma`'s built-in `budget_warning` (`remaining <= 10`) from firing cleanly; failing to stop immediately after `submit_patch()` triggers extra turns and risks accidentally corrupting a valid patch.

### Category D — In-Sandbox Editing, Verification & Hygiene Traps
16. **Backtick & Quote Corruption During Edits (`#756051`, `#753277`):** `27/129` (20.9%) gold patches contain backticks or nested quotes; double-quoted shell heredocs or brittle `edit_file` calls drop characters or trigger syntax failures.
17. **`write_file("/tmp/...")` Workspace Pollution & Protected Test Edits (`#760595`, `HARNESS_README.md:285`):** `swegemma`'s `write_file` resolves paths relative to `/workspace`, turning `write_file("/tmp/repro.py")` into `/workspace/tmp/repro.py`—which `git add -N . && git diff HEAD` captures into `agent_patch`! Editing `tests/`, `pytest.ini`, or `conftest.py` either breaks patch application or gets reset in Container B.
18. **Masked Pytest Failures, Unbounded Suites & Missing Isolation Flags (`#760595`, `#748323`):** Piping `pytest | tail` returns exit code `0` (tail's exit code), tricking agents into submitting broken code; running bare `pytest` hits the 60s command timeout; importing only the top-level package misses submodule `ImportError`/`NameError` bugs that fail under Container B's `PYTHONSAFEPATH=1` hermetic runner.
19. **Large-File Truncation, Multi-Hunk Blindness & Worktree Edge Cases:** `50/129` (38.8%) gold patches touch lines `> 600` (`21/129` past line `1,000`), and `71/129` (55.0%) require `>= 2` hunks. Any localizer truncating at 24 KB or patcher restricted to single hunks systematically misses half the benchmark.

### Category E — Kaggle Platform, 12-Hour Hard-Kill & Scoring Dynamics
20. **12-Hour Hard-Kill (`Notebook Timeout` -> `0.00`, `#743063`, `#758954`):** Across ~120 hidden tasks (`58` public + `~62` private), worst-case wall clock is `120 * max_time_minutes + 7 min (vLLM) + 90 min (container setup)`. Setting `max_time_minutes > 5.0` risks hitting the 12-hour Kaggle guillotine and losing all 120 scores.
21. **Opaque Scoring Queue, Zero Hidden Logs & Post–Nov 18 Metric Rescore (`#760126`, `#758547`):** Kaggle runs take `6–11 h` with zero stderr visibility on failure; the Nov 18 metric patch invalidated earlier metric-gaming scores (removing `0.29` and resetting the 31B field ceiling to `0.24` / `14/58` across 14 tied teams).
22. **Public-to-Private Domain Shift (`0` `async def` Private Tasks, `#745998`) & Timestamp Tie-Breaker:** Overfitting to FastAPI/HTTPX async patterns or public repo tokens inflates local CV without transferring to private repos; late ties at `0.24` (31B) or `0.12` (E4B) lose tie-breakers.

---

## Section 2: Complete 22-Issue Graceful-Handling Audit Matrix

Every row below was verified verbatim against disk in `deliverables/2026-11-20_BCF_Gemma4_Winning_Design/`:

| # | Community Issue & Thread | Sev. | Current BCF Status | Exact Evidence in Current BCF (`File:Line`) | Required Remediation |
| :---: | :--- | :---: | :---: | :--- | :--- |
| 1 | `eval_config.yaml` `null` values crash Getting Started v3 (`#760140`) | P0 | **HANDLED** | `submission_31b/eval_config.yaml:5-9`, `submission_e4b/eval_config.yaml:5-9`, `validate_and_package_bcf.py:230-241` (all 4 fields strictly positive finite numbers) | None — keep enforced |
| 2 | Single-model rule & no `model:` on `SequentialAgent` (`#758969`) | P0 | **HANDLED** | `agent.yaml:1-6` (no `model:`), `sub_agents/*.yaml:4` (identical model per track), `validate_and_package_bcf.py:164-176` | None — keep enforced |
| 3 | Skill frontmatter kebab-case `name` & folder match (`#758854`) | P1 | **HANDLED** | `skills/bcf-spec/SKILL.md:1-4` (`name: bcf-spec`), `validate_and_package_bcf.py:217-227` | None (or drop skills in Zero-Skill track) |
| 4 | Forbidden exts, `__pycache__`, symlinks, BOM, CRLF, root ZIP layout | P0 | **HANDLED** | `validate_and_package_bcf.py:86-156` (strips `__pycache__`, normalizes UTF-8 LF no-BOM, verifies root ZIP) | None — keep enforced |
| 5 | Model aliases & omitting `thinking_level` on vLLM `/v1` (`#755992`) | P0 | **HANDLED** | `sub_agents/*.yaml:4,19-21` (`gemma-4-31b-it-qat-w4a16-ct` / `gemma-4-e4b-it-qat-w4a16-ct`; uses `thinking_budget` + `include_thoughts: true`) | None — keep enforced |
| 6 | **ADK 1.36.1 `RunSkillScriptTool` requires `file_path` (NOT `script_path`) & injects `_DEFAULT_SKILL_SYSTEM_INSTRUCTION`** (`adk_1.36.1_skill_toolset.py:61-88,735-781`) | **P0** | **UNHANDLED / BROKEN** | `submission_31b/prompts/bcf_plan.md:24`, `submission_e4b/prompts/bcf_plan.md:17`, `submission_31b/skills/bcf-spec/SKILL.md:15`, `submission_e4b/skills/bcf-spec/SKILL.md:11` ALL wrongly pass **`script_path`**! | **FIX IMMEDIATELY (Patch P0-1):** change `script_path` -> `file_path` AND test or eliminate skills (Patch P0-2) |
| 7 | **vLLM 0.19.1 `_parse_gemma4_array` OOM freeze on ANY `list[str]` tool schema** (`#753973`, `#759580`) | **P0** | **UNHANDLED / BROKEN** | `get_code_subgraph` is omitted (good), **BUT** `sub_agents/bcf_plan.yaml:13-14` attaches `skills: [skills/bcf-spec]`, which STILL registers `run_skill_script`'s `args: list[str]` & `positional_args: list[str]` in `bcf_plan`'s JSON schema across **41/129 `]`-containing prompts**! | **FIX IMMEDIATELY (Patch P0-2):** Deploy Zero-Skill Monolithic track (zero array schemas anywhere) OR gate Skill track on vLLM 0.19.1 `]` stress test |
| 8 | **vLLM HTTP 400 context overflow (`prompt + max_output_tokens > 32768`) wipes patch** (`gemma4-swe-kit`) | **P1** | **PARTIAL / RISK** | E4B `solver.yaml:19` uses `4096` (safe), **BUT** 31B `solver.yaml:19` uses **`max_output_tokens: 8192`**, leaving only `24,576` prompt tokens under `compaction_interval=15` | **Patch P1-3:** Lower 31B `solver.yaml:19` to `4096` (or `5120`) for `+3–4k` headroom |
| 9 | **E4B uncalibrated thinking / low `max_output_tokens < 2048` cutoff** (`#760014`, `preflight_static.py`) | **P1** | **PARTIAL / RISK** | E4B `solver.yaml:19-21` is well calibrated (`4096` / `768` / `true`), **BUT** E4B `bcf_plan.yaml:18` sets **`max_output_tokens: 1536`** (below `preflight_static.py`'s `2048` floor!) | **Patch P1-3:** Raise E4B `bcf_plan.yaml:18` to `2048` (and 31B `bcf_plan.yaml:18` to `3072`) |
| 10 | **Fenced `bash` blocks causing 31% malformed tool names** (`gemma4-swe-kit`) | **P1** | **UNHANDLED / BROKEN** | Raw fenced `bash` blocks appear in `31b/prompts/bcf_plan.md:30-41`, `e4b/prompts/bcf_plan.md:19-29`, `31b/prompts/solver.md:16-20,49-54`, `e4b/prompts/solver.md:18-20,26-30,37-46` | **Patch P1-4:** Rewrite all command examples as single-line prose explicitly bound to `run_command` |
| 11 | LoRA adapter 40–50% TPS slowdown tax (`#760309`, `#755677`) | P2 | **HANDLED** | Zero `adapters/` in both tracks; pure prompt + deterministic tooling | None — do not add unvalidated LoRAs |
| 12 | **Hidden-scorer `run_skill_script` container isolation (`0.00` risk)** (`#758547`, `#758854`) | **P0** | **PARTIAL / RISK** | `bcf_plan.md:31-40` has a bash fallback if `.git/bcf/bcf.py` is absent (good defensive thought), **BUT** fails open only *after* burning a broken/isolated skill call, and if `install.py` writes to a non-`/workspace` dir or triggers `#758547` container errors, `bcf.py` is never available to `solver` | **Patch P0-2:** Run Kaggle 4× L4 canary on skill mounting AND build Zero-Skill Monolithic track as primary safe champion |
| 13 | **`SequentialAgent` continuation-nudge re-entry (`#754636`) & LB <= `0.10` penalty (`#760126`)** | **P1** | **PARTIAL / RISK** | `bcf_plan.md:3-9` adds `{bcf_spec?}` fast-path guard (smart), **BUT** still relies on LLM compliance (especially risky on E4B) and incurs full `SequentialAgent` handoff overhead reported at `<= 0.10` LB in `#760126` | **Patch P0-2:** Head-to-head A/B test Zero-Skill Monolithic `LlmAgent` vs. hardened `SequentialAgent` on `holdout_rich` & Kaggle |
| 14 | **Long-prompt heredoc truncation in `bcf_plan`** (`10,095`-char `fastapi_14463`) | **P1** | **PARTIAL / RISK** | `31b/prompts/bcf_plan.md:32-34` & `e4b/prompts/bcf_plan.md:21-23` tell the LLM to paste problem text into `<<'BCF_PROB'` under `2048`/`1536` `max_output_tokens` | **Patch P1-3:** Enforce `<= 15`-line symbol/error digest rule + raise `bcf_plan` `max_output_tokens` to `3072` (31B) / `2048` (E4B) |
| 15 | `budget_warning` disabled if `max_tool_calls < 20` (`#750490`) & post-submit chatter | P1 | **HANDLED** | `eval_config.yaml:7` (`28` 31B / `26` E4B, both `>= 20`), `validate_and_package_bcf.py:242-243`, `prompts/solver.md:60-63` (`Done.`) | None — keep enforced |
| 16 | Backtick & nested-quote edit corruption (`#756051`, `#753277`; 27/129 gold patches) | P1 | **HANDLED** | `bcf.py:952-1028` single-quoted heredoc (`<<'BCF_EOF'`) + mandatory `ast.parse` + `py_compile` auto-rollback | Enhance in Zero-Skill variant via inline stdlib heredoc template |
| 17 | **`write_file("/tmp/...")` workspace pollution & protected test edits (`#760595`)** | **P1** | **PARTIAL / RISK** | `prompts/solver.md:48,59` forbids it & `bcf.py:910,963,1081` blocks protected paths, **BUT** `sub_agents/solver.yaml:13` STILL exposes `write_file` in both tracks! | **Patch P1-4:** Delete `- write_file` from `sub_agents/solver.yaml` on both tracks completely |
| 18 | Masked `pytest \| tail` exit codes, bare `pytest` timeout, missing `PYTHONSAFEPATH=1` (`#760595`, `#748323`) | P2 | **PARTIAL / RISK** | `bcf.py:1140-1164` captures true `PYTEST_EXIT`, disables `anyio`/`cacheprovider`, enforces timeout (good), **BUT** omits `PYTHONSAFEPATH=1 PYTHONNOUSERSITE=1 -s --maxfail=3`, only smoke-imports top-level `pkg` (`L1115`), and lacks AST undefined-name check | **Patch P2-5:** Upgrade `bcf.py:1086-1145` with exact submodule import, AST scope check, and Container B `PYTHONSAFEPATH=1` flags |
| 19 | **Large-file truncation (`raw[:24000]`), single-hunk limit, `"stream_image"` leak, worktree `.git` file** | P2 | **PARTIAL / RISK** | `bcf.py:721` truncates at `24,000` chars (blinding `50/129` tasks > line 600); `L867` caps test scan at `16,000`; `L796` leaks `"stream_image"`; `L952` is single-hunk only (`71/129` multi-hunk); `bcf_plan.md:31` checks `[ -f .git/bcf/bcf.py ]` (breaks on git worktrees) | **Patch P2-5:** Full-file BM25, remove `"stream_image"`, add `patch-multi` atomic bottom-to-top batch mode, fix worktree path check |
| 20 | 12-hour Kaggle hard-kill across 120 hidden tasks (`#743063`, `#758954`) | P0 | **HANDLED** | `31b`: `120 * 4.75 + 97 = 667m = 11.12h`; `e4b`: `120 * 4.25 + 97 = 607m = 10.12h`; enforced in `validate_and_package_bcf.py:248-250` (`< 11.5h`) | Also verify empirical `H_120(1.7)` via `project_12h.py` |
| 21 | Opaque scoring queue & Nov 18 metric patch / zero hidden logs (`#760126`) | P1 | **HANDLED** | Zero metric gaming; strict protected-path guard (`bcf.py:910-919`) ensures patches only touch production code | Run local 2-container Docker + `g4kit-fake-llm` preflight before every upload |
| 22 | Public-to-Private domain shift (`0` `async def` private, `#745998`) & tie-breaker race | P1 | **HANDLED** *(with 1 minor leak)* | BCF 6-category/21-subcategory taxonomy is general Python (not FastAPI-only), **except** `"stream_image"` at `bcf.py:796` | Remove `"stream_image"` (`Patch P2-5`) and gate all promotions on non-async `holdout_rich` (Task 4) |

---

## Section 3: Deep-Dive Forensics & Exact Drop-In Remediation Patches

> **Note:** No files in `deliverables/2026-11-20_BCF_Gemma4_Winning_Design/` have been silently modified during this research audit. Every patch below is ready to apply verbatim upon your approval.

### Patch P0-1 — Fix ADK 1.36.1 `RunSkillScriptTool` Argument (`script_path` -> `file_path`)

**Forensic Root Cause:** Verified directly in `bcf/2026-11-08_Handoff_to_5090/reports/evidence/adk_1.36.1_skill_toolset.py:735,781`:
```python
# google.adk.tools.skill_toolset.RunSkillScriptTool (ADK 1.36.1)
# Schema parameter is "file_path", NOT "script_path":
file_path = args.get('file_path')
if not file_path:
    return {'error': 'file_path is required', 'error_code': 'INVALID_ARGUMENTS'}
```

**Exact Diff Across All 4 Affected Files:**
1. `submission_31b/prompts/bcf_plan.md` (Line 24):
   ```diff
   - - `script_path`: `"scripts/install.py"`
   + - `file_path`: `"scripts/install.py"`
   ```
2. `submission_e4b/prompts/bcf_plan.md` (Line 17):
   ```diff
   - 1. Call `run_skill_script` with `skill_name="bcf-spec"` and `script_path="scripts/install.py"`. Pass **NO** `args` and **NO** `positional_args`.
   + 1. Call `run_skill_script` with `skill_name="bcf-spec"` and `file_path="scripts/install.py"`. Pass **NO** `args` and **NO** `positional_args`.
   ```
3. `submission_31b/skills/bcf-spec/SKILL.md` (Line 15) and `submission_e4b/skills/bcf-spec/SKILL.md` (Line 11):
   ```diff
   - - `script_path`: `"scripts/install.py"`
   + - `file_path`: `"scripts/install.py"`
   ```

---

### Patch P0-2 — Eliminate vLLM `_parse_gemma4_array` Freeze, Skill Isolation & `SequentialAgent` Risk

Even after Patch P0-1 fixes `file_path`, retaining `skills: [skills/bcf-spec]` inside `SequentialAgent` still carries **three documented hidden-scorer failure modes** (`#753973`/`#759580` array-arg schema exposure in `bcf_plan`, `#758547`/`#758854` skill container isolation, and `#760126` `SequentialAgent <= 0.10` ceiling).

**Recommended Dual-Architecture De-Risking Strategy:**

#### Track Option A (RECOMMENDED PRIMARY SAFE CHAMPION) — Zero-Skill Monolithic BCF `LlmAgent`
Eliminate `SequentialAgent` and `skills:` completely while preserving the core **BCF methodology** (bounded reads, AST/symbol localization, sibling-path sweep, single-quoted heredoc syntax-guarded editing, Red->Green `/tmp/repro.py`, and mechanical `git status` + `py_compile` + `PYTHONSAFEPATH=1` pytest gate) inside a clean, prose-bound monolithic `agent.yaml`:

```yaml
# Zero-Skill Monolithic BCF agent.yaml (31B example; swap model & thinking_budget=768 for E4B)
name: bcf_monolith_agent
agent_class: LlmAgent
description: Zero-skill monolithic Batonic Coding Framework agent (zero array-arg schemas, zero skill container isolation risk).
model: gemma-4-31b-it-qat-w4a16-ct
instruction: !include prompts/system.md
tools:
  - run_command
  - read_file
  - edit_file
  - get_status
  - submit_patch
generate_content_config:
  temperature: 0.15
  top_p: 0.95
  max_output_tokens: 4096
  thinking_config:
    thinking_budget: 2048
    include_thoughts: true
```

**Why Option A Instantly Neutralizes 6 Community Hazards at Once:**
- **Zero array-arg tool schemas anywhere** (`run_command`, `read_file`, `edit_file`, `get_status`, `submit_patch` all take strictly scalar/string/int parameters -> mathematically immune to `#753973` / `#759580`).
- **Zero `run_skill_script` container isolation risk** (`#758547`, `#758854`) and zero `_DEFAULT_SKILL_SYSTEM_INSTRUCTION` forced `load_skill` turn.
- **Zero `SequentialAgent` nudge re-entry or state-overwrite loss** (`#754636`, `#760126`).
- **Zero `write_file` workspace pollution** (`#760595`).
- **Zero `bcf_plan` heredoc truncation** on 10,095-char issues.

#### Track Option B (HARDENED BCF-SKILL CHALLENGER) — Keep `bcf.py` Only After Passing a Kaggle 4× L4 Canary
If you want to keep the full 1,324-line `bcf.py` BM25+AST brain via `skills/bcf-spec`, apply **Patches P0-1 + P1-3 + P1-4 + P2-5**, then verify **both** of the following before risking a full Kaggle submission:
1. Run a local vLLM 0.19.1 stress sweep over all **41 `]`-containing problem statements** verifying zero `_parse_gemma4_array` hangs.
2. Verify on a 5-task Kaggle 4× L4 notebook test (or inspect logs) that `install.py` actually sees `/workspace` inside Container A and prints `BCF_OK installed=/workspace/.git/bcf/bcf.py` (rather than falling into isolated `BCF_FALLBACK`).

---

### Patch P1-3 — Fix 31B HTTP 400 Headroom, E4B `bcf_plan` Cutoff & Long-Prompt Heredoc Truncation

1. **`submission_31b/sub_agents/solver.yaml` (Line 19):**
   ```diff
   -   max_output_tokens: 8192
   +   max_output_tokens: 4096
   ```
   *(Adds `+4,096` tokens of prompt headroom under vLLM's `32,768` cap—preventing HTTP 400 empty-patch wipes under `compaction_interval=15`.)*
2. **`submission_e4b/sub_agents/bcf_plan.yaml` (Line 18) & `submission_31b/sub_agents/bcf_plan.yaml` (Line 18):**
   ```diff
   # submission_e4b/sub_agents/bcf_plan.yaml
   -   max_output_tokens: 1536
   +   max_output_tokens: 2048

   # submission_31b/sub_agents/bcf_plan.yaml
   -   max_output_tokens: 2048
   +   max_output_tokens: 3072
   ```
3. **`prompts/bcf_plan.md` (both tracks):** Explicitly instruct the model to extract **at most 12–15 lines** (exact error type, file paths, symbol names, and 1-sentence defect summary) into `<<'BCF_PROB'`—**never** copy multi-kilobyte stack traces or full issue bodies verbatim.

---

### Patch P1-4 — Remove Fenced Shell Blocks (31% -> 5% Malformed Tool Calls) & Drop `write_file`

1. **`submission_31b/sub_agents/solver.yaml` (Line 13) & `submission_e4b/sub_agents/solver.yaml` (Line 13):**
   ```diff
     tools:
       - run_command
       - read_file
       - edit_file
   -   - write_file
       - get_status
       - submit_patch
   ```
2. **All 4 prompt files (`prompts/bcf_plan.md` & `prompts/solver.md` across 31B & E4B):**
   Replace every fenced ```` ```bash ... ``` ```` block with direct single-line prose bound explicitly to the `run_command` tool name—for example:
   - *Instead of* a fenced bash block showing `python3 .git/bcf/bcf.py verify --test <file>`, write:
     `Invoke the run_command tool with command: python3 .git/bcf/bcf.py verify --test <targeted_test_file>`
   - *Instead of* a fenced bash block showing `cat <<'EOF' > /tmp/repro.py`, write:
     `Invoke the run_command tool to write a minimal Red-to-Green reproduction script to /tmp/repro.py using a single-quoted heredoc (cat <<'EOF' > /tmp/repro.py ... EOF) and run it with PYTHONSAFEPATH=1 PYTHONPATH=/workspace:/workspace/src python3 -s /tmp/repro.py.`

---

### Patch P2-5 — Surgical Upgrades to `skills/bcf-spec/scripts/bcf.py` (If Retaining Skill Track)

| Location in `bcf.py` | Current Defect | Exact Fix |
| :--- | :--- | :--- |
| **`L721`** (`_parse_file_symbols`) | `raw[:24000]` truncates BM25 indexing before line ~600 (`50/129` tasks affected, `21/129` past line 1,000) | Raise cap to `raw[:200000]` (still `< 15 ms` per repo in pure stdlib) so bottom-of-file functions are fully indexed |
| **`L796`** (`locate_candidates`) | Hardcoded `"stream_image"` leaks a public training task identifier into `docs_src/` penalty check | Delete `"stream_image"` from the keyword tuple (`("docs", "tutorial", "example", "license")`) |
| **`L867`** (`locate_candidates`) | Test file scan truncated at `[:16000]` | Raise cap to `[:120000]` |
| **`L952–1028`** (`cmd_patch`) | Single-hunk only (`71/129` tasks need `>= 2` hunks) | Add `cmd_patch_multi` accepting JSON/delimited hunks, sorting descending by `start` line so earlier line numbers never shift, with one atomic AST+`py_compile` rollback |
| **`L1086–1123`** (`cmd_verify`) | Only smoke-imports top-level `pkg` (`import fastapi`), missing submodule `ImportError`/`NameError` | Compute exact dotted module path (e.g. `fastapi.routing` from `fastapi/routing.py`) and run `importlib.import_module(...)`, plus a lightweight stdlib AST undefined-name/duplicate-arg check |
| **`L1107–1145`** (`cmd_verify`) | Runs `pytest` without Container B hermetic flags or `--maxfail=3` | Set `env["PYTHONSAFEPATH"] = "1"`, `env["PYTHONNOUSERSITE"] = "1"`, pass `"-s"` to `sys.executable`, and add `"--maxfail=3"` to `pytest` |
| **`bcf_plan.md:31`** | `[ -f .git/bcf/bcf.py ]` breaks if `.git` is a gitdir pointer file (worktrees) | Resolve via `BCF_BIN="$(git rev-parse --git-dir)/bcf/bcf.py"` and check `[ -f "$BCF_BIN" ]` |

---

### Patch P2-6 — Close Validation Blind Spots in `tools/validate_and_package_bcf.py`

Add six automated checks to `validate_submission()` so no future regression can silently pass preflight:

1. **ADK 1.36.1 `RunSkillScriptTool` Parameter Check:** Fail if any prompt or `SKILL.md` contains `script_path` alongside `run_skill_script` (must use `file_path`), and assert exact keyword match against `{"skill_name", "file_path", "args", "positional_args"}`.
2. **Array-Arg Tool Exposure Audit:** Emit an explicit `FAIL` (or required `--allow-skill-array-schema` override flag) whenever `skills:` is attached, flagging `run_skill_script`'s `list[str]` schema risk (`#753973`, `#759580`).
3. **Token Headroom & Cutoff Bounds:** Fail if any `LlmAgent` sets `max_output_tokens < 2048` (`#760014`, `preflight_static.py`) OR `max_output_tokens > 5120` (HTTP 400 overflow guard under `32,768` context).
4. **Fenced Bash Block Lint:** Fail/warn if any `prompts/*.md` contains ```` ```bash ```` or ```` ```sh ```` (`gemma4-swe-kit` 31% malformed tool-call finding).
5. **`write_file` Guard:** Fail if `write_file` appears in `tools:` (`#760595` `/workspace/tmp/` pollution guard).
6. **Training-Leak Lint & `g4kit-fake-llm` Smoke Gate:** Scan `bcf.py` and prompts for public task identifiers (`stream_image`, `fastapi_`, `rich_`, `requests_`, `httpx_`), and chain a zero-GPU `g4kit-fake-llm` end-to-end tool-schema + `submit_patch` check before emitting `submission_*.zip`.

---

## Section 4: Recommended Pre-Submission Go/No-Go Execution Sequence

Before uploading any ZIP to Kaggle (mindful of `2026-11-25 23:59 UTC` publishing cutoff and `2026-12-02 23:59 UTC` final submission deadline):

1. **Apply P0 + P1 Patches First:** Fix `script_path -> file_path`, lower 31B `solver` `max_output_tokens` to `4096`, raise `bcf_plan` `max_output_tokens` to `3072` (31B) / `2048` (E4B), remove `write_file`, and strip fenced bash blocks across prompts.
2. **Build & Benchmark the Zero-Skill Monolithic BCF Variant Alongside Hardened BCF-Skill:** Run head-to-head `dev_tune_30` and locked `holdout_rich` A/B benchmarks on your calibrated Task 3 RTX 5090 Docker harness with `compaction_interval=15`.
3. **Run the 4× L4 Parity Gate:** If the Skill-backed BCF wins locally on `holdout_rich`, verify `install.py` container mounting on a Kaggle 4× L4 calibration notebook before committing a 24h competition slot; if **Monolithic BCF** matches or beats Skill-backed BCF within `±1` task, **promote Monolithic BCF immediately** as your primary submission because it eliminates every skill/vLLM-array/nudge hidden-scorer hazard by construction.
4. **Lock Dual Final Slots:** Target **Slot 1 = 31B Main (`>= 0.25` LB, \$65,000 track)** and **Slot 2 = E4B Small-Model Bonus (`>= 0.13` LB, \$10,000 track)**—banking an early clean score on both tracks to secure tie-breaker timestamp priority while iterating toward breakthrough scores.

---

## References & Grounding

- Kaggle discussion captures (`2026-10-31` to `2026-11-20 04:47 UTC`): `input/kagglecomp/intel_20261120/00-intel-brief-2026-11-20.md`, `01-thread-manifest-2026-11-20.md`, `02-raw-forum-digest-2026-11-11-to-2026-11-20.md`, `03-chronological-forum-roundup-2026-10-31-to-2026-11-20.md`
- ADK 1.36.1 source evidence: `bcf/2026-11-08_Handoff_to_5090/reports/evidence/adk_1.36.1_skill_toolset.py` (Lines 61–88, 735–781)
- Official harness & starter specs: `input/kagglecomp/kagglecomp_data_package/HARNESS_README.md`, `input/kagglecomp/docs/markdown/Kaggle-03-GettingStarted.md`, `tools/gemma4-swe-kit/README.md`
- Audited BCF target tree: `deliverables/2026-11-20_BCF_Gemma4_Winning_Design/` (`submission_31b/`, `submission_e4b/`, `tools/validate_and_package_bcf.py`)
