# Task 2: BCF Brain v2 Tuning Levers, Code Audit & Impact-Effort Ranking

**Target Build Audited:** Shipped `02-bcf-brain-31b-v2` and `03-bcf-brain-e4b-v2` (`skills/bcf-spec/scripts/bcf.py`, `BCF_VERSION = "2.0.0"`, `2,272` lines, byte-identical across both tracks).

---

## 1. Current v2 Baseline vs. Prior & Conceptual Versions

Before adjusting any parameter, note exactly what **already shipped in v2** versus what remains broken, unimplemented, or divergent from conceptual notes:

- **Implemented in `v2` (do not re-implement):** A1 (`## Expected red` section in `spec` + `expected-red` command), A2 (`closure` + `rename` token-aware multi-file refactor + proof), A3 (`no-signal` honest low-confidence fallback in `classify`), A4 (`_import_audit` and `_smoke` on `.git/bcf/repro_seed.py` inside `cmd_check`), A6 (`-rf` pytest summary tail + Asymmetry rule in `prompts/solver.md`), and A7 (producer grep rule for class renames).
- **Shipped vs. Nov 14 Conceptual Blueprint:** Shipped `eval_config.yaml` runs **`180s / 50 calls / 4.5m / 50 turns`** (31B) and **`150s / 40 calls / 4.0m / 40 turns`** (E4B); both `bcf_plan.yaml` and `solver.yaml` share `../configs/sampling.yaml`. Conceptual blueprint items (`90s/24/5.5m`, split `sampling_plan.yaml`, `bcf.py read`/`patch`) do **not** exist in shipped v2.
- **Zero-Hint Reality:** All `129` dataset tasks carry empty `hints` (`[COMPETITION INTEL]`), so `{problem_description}` in `prompts/bcf_plan.md` (~1,500 chars copied to `.git/bcf/problem.md`) is the sole upstream problem signal.

---

## 2. Complete Map of Tunable Junctures in BCF Brain v2

| Layer & File Path | Exact Tunable Symbols / Clauses (`[LOCAL SHIPPED (v2)]`) | Observed Limitation, Bug, or Opportunity in v2 |
| --- | --- | --- |
| **Root Orchestrator** (`agent.yaml`) | `SequentialAgent`, sub-agents `[bcf_plan.yaml, solver.yaml]` | Re-entering `bcf_root` on continuation nudges re-runs `bcf_plan` first; relies on `.git/bcf/spec.md` warm cache for fast resume |
| **Execution Budgets** (`eval_config.yaml`) | `timeout_seconds` (`180`/`150`), `max_tool_calls` (`50`/`40`), `max_time_minutes` (`4.5`/`4.0`), `max_turns` (`50`/`40`) | At `N=129`, `4.5m` + `60s` setup = `12.04 h` worst case (`BREACH`). `timeout_seconds` also governs Phase 2 pytest grading (`150–300 s` safe zone) |
| **Shared Sampling** (`configs/sampling.yaml`) | `temperature` (`0.2` 31B / `0.0` E4B), `top_p: 0.95`, `top_k: 64`, `max_output_tokens` (`6144`/`4096`), `seed: 7`, `thinking_budget` (`2048`/`0`), `include_thoughts: true` | **Contradiction 1:** `bcf_plan.yaml` inherits `thinking_budget: 2048` on 31B despite a deterministic 3-step run. **Anomaly 2:** E4B pairs `temperature: 0.0` + `thinking_budget: 0` + `include_thoughts: true` (HF card default `1.0`; chat template interaction unverified until C5) |
| **Planner Sub-agent** (`sub_agents/bcf_plan.yaml`, `prompts/bcf_plan.md`) | `generate_content_config: !include ../configs/sampling.yaml`, `include_contents: none`, `write_file` ~1,500-char slice, `output_key: bcf_spec` | Truncating `.git/bcf/problem.md` at `~1,500` chars can drop deep traceback filenames (`p90 = 1,891` chars). ADK `include_contents: none` also warrants boundary smoke (`C2-4`) on nudges (`[OFFICIAL DOCS]`) |
| **Solver Sub-agent** (`sub_agents/solver.yaml`, `prompts/solver.md`) | 31B (`59` lines, `edit_file` primary, 60 lines/read); E4B (`110` lines, `apply` primary, 40 lines/read, mandatory `"Plan: ..."` every turn) | E4B prompt is ~2x longer despite smaller `4,096`-tok budget; small models gain little from long behavioral rules while paying context + compaction tax (`[COMPETITION INTEL]`) |
| **Skill Metadata & Installer** (`skills/bcf-spec/SKILL.md`, `install.py`) | Frontmatter `description` (~285 chars); `install.py` `RUNNER_CONFIGS` (6 files), `find_root()` 4-step ladder | `SKILL.md` description injects into every tool-enabled context (`~285 -> ~150` chars trims recurring tokens). `install.py` skips 6 runner configs, omitting `.pytest.ini` & `usercustomize.py` already listed in `bcf.py` `PROTECTED_NAMES` (lines 54–57) |
| **v2 Bug — Unsafe Rename Rollback** (`bcf.py` lines `2138–2217`) | `cmd_rename`: `atomic_write(full, new_text)` (L2176) -> `compile(new_text)` (L2178) -> `originals` restore (L2180–2181) -> `originals[rel] = text` (L2185) | **`SyntaxError` corrupts disk:** Failing file `rel` is overwritten BEFORE `compile()` and added to `originals` AFTER, so rollback restores all prior files *except* the broken `rel`. Also matches trailing bare name (`split(".")[-1]`), risking unrelated cross-file attribute edits |
| **Classifier & Cues** (`bcf.py` lines `422–486`, `525–630`) | `classify`, `FAMILY_PATTERNS`, `extract_cues`, `MAX_CUES = 12` | `"no-signal"` fixed false classification; cue regexes & `rank_candidates` weights must be OOD-tuned only to avoid public-repo overfitting |
| **Index & Tree Walks** (`bcf.py` lines `770–850`, `1124–1255`) | `build_index` (`17s` in `cmd_spec`, `3s` in `cmd_locate`), `discover_tests`, `detect_rename`, `scan_expected_red`, `_scan_symbol` | **Latency bomb on large repos:** `discover_tests`, `detect_rename`, `scan_expected_red`, and `_scan_symbol` walk directories with **no time cap or file cap**. `cmd_locate` ignores `partial` flag returned by `build_index` |
| **Target Hints & Anchors** (`bcf.py` lines `990–1100`, `1266–1355`) | `_family_lines`, `gen_anchors` (L1067), `render_spec` (`SPEC_WORD_CAP = 300`) | `_family_lines` covers **only 5/10 families**; `render_spec` shows only symbol `def` line (`sym["line"]`), not candidate edit lines inside symbol; `gen_anchors` skips struck `t+1` only instead of `MAX_WINDOW = 7` overlap |
| **Edit & Pre-Submit Gates** (`bcf.py` lines `1579–1972`) | `cmd_apply` (`MAX_APPLY_LINES = 120`, `read_stdin_bounded` 10s), `_import_audit`, `_smoke`, `cmd_check`, `cmd_state` (`tests_run` L239) | `cmd_apply` checks `compile()` only (no identical-edit SHA dedup guard, no auto-`_smoke`); `_import_audit` checks single-file module AST (misses cross-file / attr errors); `cmd_check` untracked prefix regex (`repro`, `scratch`, `test_tmp`, `tmp_`) misses stray scripts; `st["tests_run"]` is dead (`False`) |
| **Evaluation & Canaries** (Harness / Gate Protocol) | `masked-68`, `dev-30`, `C0–C7`, `OOD-45`/`FreshSWE-Py`, `locbench`, parser fuzz (`>=5,000` payloads) | Evaluating A/B on raw 129 injects 5 empty-pass noise points + 27 impossible missing-lib tasks; missing `C3` fuzz risks `gemma4_tool_parser` server deadlock on kaggle |

---

## 3. Impact-Effort Scoring Rubric

Every tunable lever is scored identically across two dimensions:

- **Impact (`1–3`):**
  - **High (`H = 3`):** Directly prevents total run zeroing (`12h` cliff / server hang / disk corruption / compile rejection), fixes systemic localization blindness (`5/10` missing families, missing edit lines), or eliminates multi-run false promotions (`masked-68` + win-both).
  - **Medium (`M = 2`):** Saves `10–40 s/task` reliably across most tasks, prevents wasted retry/truncation turns, or narrows variance / E4B risk.
  - **Low (`L = 1`):** Minor token savings (`~100 tok/task`), defensive parity cleanup, or edge-case hardening with small expected delta.
- **Effort (`1–3`):**
  - **Small (`S = 1`):** Config/YAML/prompt diff or <20-line surgical fix, verifiable in minutes–hours via L0/L1.
  - **Medium (`M = 2`):** Engine algorithm extension (`bcf.py` synced identically across 31B+E4B + L0 `C1` battery + L2 paired A/B).
  - **Large (`L = 3`):** Multi-day dataset infrastructure (`OOD-45`/`FreshSWE-Py` self-hosting), full-repo 2.6k-file calibration harness, or heavily gated LoRA pipelines.
- **ROI Score `= Impact / Effort`:** Higher ratio ranks first; ties break by **(a) Defect/catastrophic risk mitigation -> (b) Grounded evidence strength -> (c) Cross-track scope (`both` > `31B` > `E4B`)**.

---

## 4. Master Ranked Tuning Levers (All 32 Items)

| Rank | ID | Juncture & Concrete Change (`v2`) | Category | Impact | Effort | ROI | Validation Gate | Track |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **1** | `V4a` | Run **C0 official `compile_submission`** canary & verify `skills:` relative path before zipping | Gate / Bug | H (3) | S (1) | **3.00** | C0 compile pass | Both |
| **2** | `Y4` | Apply **12 h budget-cap decision rule** on `eval_config.yaml` (`4.5 -> 4.0m` 31B if `N=129` setup telemetry exceeds ~35 s) | Config | H (3) | S (1) | **3.00** | C2 telemetry + `<=11.0h` ext. | Both |
| **3** | `E0a` | **Fix `cmd_rename` rollback bug** (`bcf.py` L2176–2185: snapshot `originals[rel] = text` *before* `atomic_write`, or `compile(new_text)` *before* touching disk) | Bugfix | H (3) | S (1) | **3.00** | L0 C1 `SyntaxError` unit test | Both |
| **4** | `Y1` | Split `configs/sampling_plan.yaml` -> set **`thinking_budget: 0` or `256` on `bcf_plan`** (keep `2048` on solver) | Config | M (2) | S (1) | **2.00** | C2-3 restart (`<=15s`) + L2 win-both | 31B |
| **5** | `Y2` | Pre-register solver **`temperature: 0.2 -> 0.0`** A/B arm on 31B (keep `seed: 7`) | Config | M (2) | S (1) | **2.00** | C0 lint + L2 paired A/B | 31B |
| **6** | `P1` | Expand `bcf_plan.md` copied statement slice **`~1,500 -> ~3,000` chars** (`p90=1,891` tracebacks preserved) | Prompt | M (2) | S (1) | **2.00** | L0 C1 hit@k + L2 paired A/B | 31B |
| **7** | `Y14` | Pre-register **E4B serving exploration arm**: test `temp: 0.2` / `thinking_budget: 1024–2048` vs shipped `temp: 0.0, budget: 0, include_thoughts: true` | Config | M (2) | S (1) | **2.00** | **C5 E4B serving canary** + L2 | E4B |
| **8** | `E6` | Add **hard deadline + file-count caps** inside `discover_tests`, `detect_rename`, `scan_expected_red`, `_scan_symbol` | Engine | M (2) | S (1) | **2.00** | L0 3k-file repo timer (`<=2s`) | Both |
| **9** | `E4` | Fix `gen_anchors` line `1067`: skip strikes by **`MAX_WINDOW = 7` range overlap** instead of exact line `t+1` only | Engine | M (2) | S (1) | **2.00** | L0 C1 strike unit test | Both |
| **10** | `E3a` | Add **identical `(file, start, end, repl)` SHA-256 hash dedup guard** in `cmd_apply` (block 3rd identical loop locally) | Engine | M (2) | S (1) | **2.00** | L0 replay funnel + C1 | Both |
| **11** | `E1` | Populate **`_family_lines`** (`bcf.py` L990) for the **5 unpatterned families** (`api-contract`, `missing-cap`, `schema-gen`, `compat-shim`, `docs`) | Engine | H (3) | M (2) | **1.50** | L0 C1 uniqueness + L2 A/B | Both |
| **12** | `E2` | Emit **inner candidate edit line numbers** under `Target` in `render_spec` (`<=300` words, brace-free) | Engine | H (3) | M (2) | **1.50** | L0 format/C1 + E4B smoke + L2 | Both |
| **13** | `V1` | Audit & freeze **`masked-68`** valid set (`gold pass && empty fail`) + stratified **`dev-30`** subset | Eval | H (3) | M (2) | **1.50** | Phase 2 CPU gold+empty audit | Both |
| **14** | `V2` | Enforce **paired repeat (`r1, r2`) + win-both + exact McNemar (`p<=0.05`) + noise floor** promotion rule | Eval | H (3) | M (2) | **1.50** | `compare_paired.py` L2/L3 | Both |
| **15** | `V4b` | Execute **C2-3, C2-4 (`include_contents: none`), C3 (`>=5k` parser fuzz), C5 (E4B)** hard pre-slot drills | Gate | H (3) | M (2) | **1.50** | All canary thresholds green | Both |
| **16** | `E0b` | Fix `cmd_rename` bare trailing identifier scope (`split(".")[-1]`): require qualified match / import-verified symbol closure | Bugfix | M (2) | M (2) | **1.00** | L0 C1 false-positive rename test | Both |
| **17** | `E3b` | Trigger optional **fast `_smoke` automatically inside `cmd_apply`** when `.git/bcf/repro_seed.py` exists (`<=10 s`) | Engine | M (2) | M (2) | **1.00** | L0 C1 + C2-6 (E4B focus) | E4B / Both |
| **18** | `E7` | Propagate **`partial` truncation flag** cleanly from `build_index` in `cmd_locate` (L1652–1681) + review `1.6` cue weight | Engine | M (2) | M (2) | **1.00** | L0 full-repo C2 + `locbench` | Both |
| **19** | `E8` | Upgrade `_import_audit` in `cmd_check` (`1710–1767`) to scan **cross-file changed modules** for broken relative/moved imports | Engine | M (2) | M (2) | **1.00** | L0 C1 multi-file refactor test | Both |
| **20** | `V7` | Deploy **`locbench` (budget-matched context probe)** + **`replay_edits.py`** for GPU-free localization/edit A/B | Eval | M (2) | M (2) | **1.00** | `locbench` + funnel metrics | Both |
| **21** | `V6` | Keep **Monolithic Variant B** pre-validated in reserve if C2-4 reveals unfixable `SequentialAgent` state issues | Arch | H (cond) | L (3) | **1.00** | C0 + C2 on Variant B | Both |
| **22** | `V3` | Self-host **OOD proxy benchmark (`OOD-45` / `FreshSWE-Py`)** for private-repo generalization | Eval | H (3) | L (3) | **1.00** | Zero OOD regression gate | Both |
| **23** | `S1` | Trim **`SKILL.md` description** (`~285 -> ~150` chars) to shed recurring system-context tokens | Skill | L (1) | S (1) | **1.00** | C0 trigger verify | Both |
| **24** | `E22` | Add `.pytest.ini` and `usercustomize.py` to **`install.py` `RUNNER_CONFIGS`** skip-worktree list (match `bcf.py` L55) | Engine | L (1) | S (1) | **1.00** | L0 C1 clean `git diff` | Both |
| **25** | `E27` | Update `st["tests_run"] = True` inside test/check telemetry or clean dead state key (`bcf.py` L239) | Engine | L (1) | S (1) | **1.00** | L0 `cmd_state` unit test | Both |
| **26** | `E28` | Broaden `cmd_check` stray untracked `.py` detector beyond prefix regex (`repro`, `scratch`, `test_tmp`, `tmp_`) to flag unreferenced root scripts | Engine | L (1) | S (1) | **1.00** | L0 C1 stray-file unit test | Both |
| **27** | `E29` | Fail fast on empty/whitespace stdin in **`read_stdin_bounded`** vs waiting full `10.0 s` if pipe hangs unclosed | Engine | L (1) | S (1) | **1.00** | L0 stdin pipe test | Both |
| **28** | `P_E4B` | Compress **E4B `prompts/solver.md`** (`110 -> ~65` lines) removing non-structural prose while retaining heredoc `apply` + caps | Prompt | M (2) | M (2) | **1.00** | C5 + L2 paired E4B arm | E4B |
| **29** | `Y3` | Conditional **`max_output_tokens: 6144 -> 8192`** ONLY if C2/L2 traces exhibit `finish_reason=MAX_TOKENS` nudges | Config | M (2) | M (2) | **1.00** | Trace `MAX_TOKENS` rate >5% | Both |
| **30** | `P2` | Pre-register **2-read-max commit gate** phrasing nuance in `solver.md` if traces show premature wrong-file commits | Prompt | L (1) | S (1) | **1.00** | L2 paired trace audit | 31B |
| **31** | `E11` | Expand `classify` / `rank_candidates` weights (`path/stem/coverage/subsystem`) **gated strictly on OOD-45** | Engine | M (2) | L (3) | **0.67** | `locbench` + OOD-45 gain | Both |
| **32** | `V5` | Gated **LoRA / PEFT-on-QAT** research track (`+29%` wall / `+45%` token tax -> default **DO NOT SHIP**) | Model | L (neg) | L (3) | **0.33** | `>=3` tasks over `>=4` seeds | Conditional |

---

## 5. Priority Execution Tiers

### Tier A — Fix Immediately Before Next Run (Zero Risk / Defect Fixes)
1. **Fix `cmd_rename` rollback ordering (`E0a`, Rank #3):** Cache `originals[rel] = text` before `atomic_write`, or `compile(new_text, rel, "exec")` in memory before writing disk (`bcf.py` lines 2176–2185).
2. **Pass `C0` official compiler canary (`V4a`, Rank #1) & verify `Y4` budget cap rule (`Rank #2`):** Confirm bundle compiles cleanly and extrapolate `120–129` task wall time on real setup latency before touching Kaggle.
3. **Bound `discover_tests` & rename walks (`E6`, Rank #8) + `gen_anchors` window overlap (`E4`, Rank #9) + `install.py` 2-file parity (`E22`, Rank #24):** All surgical patches that protect against large private repo stalls and loop traps.

### Tier B — Top Pre-Registered Experimental Arms (Highest Score ROI)
1. **`Y1` (`sampling_plan.yaml`, Rank #4):** Cut 31B planner `thinking_budget` from `2048` -> `0` or `256` (saves `10–30 s/task` + nudge restarts without hurting solver reasoning).
2. **`E1` + `E2` (`_family_lines` 5 missing families + candidate edit lines under `Target`, Ranks #11–#12):** Attacks the dominant `v2` capability gap (turning file localization into exact line targeting, critical especially for 4B-class E4B).
3. **`Y14` (`C5`-gated E4B sampling & thinking test, Rank #7) + `P1` (`3,000`-char statement slice, Rank #6) + `Y2` (`temp 0.0` arm, Rank #5).**

---

## 6. Do-NOT-Tune Guardrails (Zero-EV or Disqualified Levers)

Do **not** spend GPU hours or Kaggle slots on items already disproven by official documentation, harness constraints, or controlled competition measurements:

| Prohibited / Zero-EV Item | Exact Evidence Against Tuning (`[OFFICIAL DOCS]` / `[COMPETITION INTEL]`) |
| --- | --- |
| **ADK `EventsCompactionConfig` or `ContextCacheConfig`** | Compaction params (`14,336` tok threshold, `overlap: 2`, `retention: 5`, `temp 1.0` summarizer) are locked harness-side. Moreover, `ContextCacheConfig` in `google-adk` is **Gemini API-only** (`[OFFICIAL DOCS]`) and inactive against vLLM OpenAI endpoints |
| **Array-typed tool parameters (`list[str]`) or graph tools** | Triggers `gemma4` parser infinite-loop freeze killing the remaining run (`[COMPETITION INTEL]`); graph tools showed zero end-to-end gain (`p=0.69`). Also note upstream `vllm#44715` sentinel leaks on dict keys — keep every tool/script arg strictly **scalar** |
| **`include_thoughts: false` or `thinking_level`** | `include_thoughts: false` fails to disable thinking properly on `adk-submission >= 0.2.13` and collapses solves (`48 -> 34–35`); `thinking_budget: 0` is the clean off switch. `thinking_level` maps to OpenAI `reasoning_effort` |
| **Unmeasured LoRA (`V5`) or bare `12B` model swap** | Hand-built LoRA adds `+29%` wall / `+45%` tokens and scored worse (`0.06` vs `0.17`); `12B` generates `~1.8x` tokens/call causing worse step latency (`11.5s` vs `10.3s`) and `12 h` timeout |
| **Raising `31B` cap to `5.0 min` or running bare `pytest`** | `N=120–129` at `5.0 min` + `60 s` setup blows the `12.0 h` ceiling (`12.2–14.2 h`). Bare `pytest` hangs infinitely on `rich_4006`-class tasks |
| **Public task/repo overfitting, offline URL fetch, or test edits** | `network_mode=none` fails URL fetches; scorer resets protected/test files (anti-tamper); hidden evaluation runs on **private repos** (making public-repo magic strings negative generalization EV) |
| **Comparing arms on raw `129` or single LB scores** | `5` empty-pass + `~27` missing-lib tasks distort denominators (`masked-68` required); single-run std dev is `~1.5–3` tasks (`10–13%` flip rate) |
