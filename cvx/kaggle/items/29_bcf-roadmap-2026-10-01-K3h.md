# COMBINED MARKDOWN - combine

_Generated 2026-10-02 00:37:50 | 9 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle\items\combine_

## Contents

1. Gemma4-01-Roadmap-and-Master-Checklist-K3h.md
2. Gemma4-02-Day0-Six-Sprint-Master-Plan.md
3. Gemma4-03-Document-Review-Integration-Map.md
4. Gemma4-04-BCF-Math-and-Prior-Research.md
5. Gemma4-05-Metadata-Wishlist-Decision-Spec.md
6. Gemma4-06-Catalog-Review-Ranked-Resources.md
7. Gemma4-07-FOSS-Tools-Ranked.md
8. Gemma4-08-Prizrak-Catalog-Ranked-Resources.md
9. Gemma4-09-Exception-Class-Binning-Roadmap.md

---

<!-- ====================================================================== -->
<!-- FILE: Gemma4-01-Roadmap-and-Master-Checklist-K3h.md -->
<!-- ====================================================================== -->

# Deliverable 01 — Roadmap & Master Checklist: Winning the Gemma 4 Developer Agent Competition

**Compiled:** 2026-10-02 · **Owner:** Cooly · **Companion:** Deliverable 02 (Day-0 setup + six-sprint master plan)
**Ground truth sources:** competition pages snapshot (2026-09-29), discussion-board intel sweep (2026-09-30, 22/22 threads), paper-track intel (2026-09-30), BCF Reference Compendium (2026-09-28), httpx_3672 verified simulation walkthrough.

---

## 0. Situation assessment — what "winning" actually requires

### 0.1 The arena

| Fact | Value | Consequence |
|---|---|---|
| Task | SWE-bench-style PASS/FAIL patch resolution; ~120 hidden tasks (~58 public-scored), 4 Python repos in training (fastapi 67, rich 48, requests 13, httpx 1) | Score is a **count of resolved tasks**; every design choice should be priced in tasks gained/lost |
| Model | Locked: `gemma-4-31b-it-qat-w4a16-ct` for every agent and subagent | No model shopping. The levers are: scaffold, prompts, skills, tool policy, sampling, budgets, LoRA |
| Submission | `submission.zip` = ADK Agent Config (YAML + prompts + skills + optional LoRA). **No custom Python orchestrator ships** — only config, prompts, skill scripts/resources, adapters | All "brain" logic must live in (a) prompt architecture, (b) ADK-legal skill scripts, (c) LoRA weights. The BCF orchestrator runs **as skill scripts inside the sandbox**, not as external code |
| Budget | 12 h wall clock for **all** tasks, sequential, no concurrency; ~120 tasks ⇒ **~6 min/task average**; scorer reads exactly four `eval_config.yaml` fields: `timeout_seconds`, `max_tool_calls`, `max_time_minutes`, `max_turns` | Time allocation *is* the strategy. A `max_time_minutes` failsafe is mandatory until the overrun fix ships |
| Leaderboard (9/30) | Top three: **0.17, 0.15, 0.15** (≈20, 18, 18 of ~120). Best public notebook: 0.12. 124-team tie at bronze | The field is weak and compressed. **+2 tasks ≈ jumping dozens of ranks.** Reaching 0.25–0.30 (30–36 tasks) is likely a podium position; 0.20 likely medals |
| Variance | Same code, different run: 0.12 vs 0.08 (±0.04) | Never compare configs on single runs; paired eval or it didn't happen |
| Scoring infra | L4×4, queue 4–13+ h, run 12–14.5 h, quota ~30 GPU-h/wk deducted at ~2× wall clock, **1 submission/day** | Realistically **2–3 scored submissions/week**. Every submission slot is precious — each must carry a hypothesis |
| Local CV | Gold patches fail locally (missing wheels: typing_inspection, inline-snapshot, dirty-equals…; starlette dedup breakage; 8 SSL-dead + 4 version-gated public tasks). **Host confirms hidden set validates 100% with gold** | Local CV is *biased*, not useless. Fix the local grading env, correct for the 12 dead tasks, and treat CV↔LB as a calibration problem, not a vote |
| Harness bugs (live as of 9/30) | LoRA: KV-cache collapse (46k→7.6k tokens) + silent adapter zeroing; thinking-mode thoughts dropped (patch incoming, **no re-score**); double-JSON escaping of tool results (host fixing; raw-text path eliminated 100% of failures in controlled test); `search_similar_code` uncapped (context blowups); `read_file` line-range TypeError (unverified) | The scaffold must be **defensive by default**: tool-output size guards, escaping-tolerant edit strategy, pre-submission canary probes for every host fix |

### 0.2 Strategic thesis

**The winners of this competition will not out-train the field; they will out-reliability it.** With a locked 31B QAT model on a 32k context and a 6-minute-per-task budget, the gap between 0.12 and 0.25 is not model quality — it is: (1) not dying on harness quirks, (2) not wasting the budget on exploration loops, (3) not reverting correct fixes because visible tests lie (httpx_3672 Trap 1), (4) actually submitting a non-empty, in-scope, syntactically valid patch on every task. That is exactly what BCF (Batonic Coding Framework) is for. LoRA/distillation is a **Sprint-4 gated upside**, not the foundation.

**Two prize paths, one pipeline:** the main competition ($65K) and the paper track ($35K, deadline **Nov 12**, max 2 writeups judged, ties broken by earliest entry, ~97% of paper entrants never submit). Every experiment in this plan emits ledger rows and receipts that double as paper evidence. The paper track is near-free upside with a judge roster (Perozzi, Rózemberczki, Galkin — graph ML) that rewards graph-tool usage specifically.

### 0.3 Score arithmetic

- Current top: 0.17 ≈ 20 tasks. Public leaderboard resolves 58 tasks ⇒ **each task ≈ 1.72 public points**.
- Known recoverable headroom vs. a naive baseline:
  - 12 public tasks are dead-on-arrival locally but the hidden set is clean → don't let local CV fool you into despair.
  - Escaping-related `edit_file` failures: 39 provably escaping-caused failures across 18 tasks in one community run → defensive edit policy alone is worth several tasks.
  - Budget discipline: baseline agents time out at 60 s–1 min/task in demos with zero patches; simply surviving to submit on every task moves NO_PATCH rate toward 0.
- Target ladder (private-set score): **0.10 → 0.15 → 0.20 → 0.25+**. Every milestone below is defined in tasks, not vibes.

---

## 1. End-to-end roadmap — six stages

```
Stage 0          Stage 1           Stage 2            Stage 3            Stage 4             Stage 5
FOUNDATION  ──▶  BASELINE BRAIN ─▶  BCF SCAFFOLD  ─▶  GRAPH & SKILL  ─▶  ADAPTERS (gated) ─▶  FINALIZE &
(env, harness,   (prompts-only,     (spec-first,       (graph-first        (LoRA canary,        SUBMIT
 ledger, CV      measurement       gates, journal,     localization,      distillation,        (selection,
 rig, dead-task  infrastructure,   rescue, defensive   skill library,     RL/QLoRA only        freeze, paper,
 map, canaries)  first LB submit)  tool policy)        budget tuning)     if gates pass)       winner prep)
```

Each stage has: **entry criteria, exit criteria (gate), artifacts, and a submission decision.** Nothing proceeds past a gate on hope.

---

### Stage 0 — Foundation & measurement rig (Day 0–3, bleeds into Sprint 1)

**Goal:** a trustworthy measurement machine exists *before* the first agent experiment. Per the compendium: "Set up the post-run script **before** your first harness run."

**Build:**
1. Dev environment (Deliverable 02 §Day 0): WSL2 + CUDA + Docker + vLLM wheelhouse on the 5090; grading farm on AUX 2.
2. **Ledger + receipts (B5/B1):** `ledger.jsonl` schema v0.1, `results.csv` post-run appender, receipt JSON per run (config hash, harness/wheelhouse version, seed, split, task list, verdicts).
3. **Frozen splits:** dev/held-out split of the 129 training tasks, stratified by repo and complexity tier; held-out list frozen and never tuned on. Dead-task map (12 locally-unsolvable tasks) recorded so CV scores are reported *with and without* them.
4. **Local grading autopsy fix:** patched local wheel set (add typing_inspection, inline-snapshot, dirty-equals, ujson/orjson, python-multipart; pin starlette per-commit instead of highest-version dedup) → target: gold-patch local pass rate ≥ 90% of what the notebook image achieves, with remaining failures enumerated and explained.
5. **Canary suite:** four cheap probe submissions/scripts, one per live host-bug watch item:
   - Q1a: LoRA KV-collapse probe (long-prompt survival with adapter mounted)
   - Q1b: "loud adapter" zeroing probe (randomized A and B → output diff at temp 0)
   - Q2: escaping probe (edit with backslash-heavy `old_string` round-trip)
   - Q3: thinking-mode probe (thought tokens present in next prompt: the 114-vs-86-token tokenizer check)
   - Q7: `read_file` line-range probe (int vs str args)
6. **Task taxonomy pass (B5.2):** open-coding of all 129 training tasks → frozen codebook (task_type, bug_category, complexity_tier 1–5, multi_bug, root_cause_file/symbol, fix_shape_type) with `human_override` logging. Label held-out tasks **last**.

**Exit gate G-S0:** gold-patch grading reproduces host behavior locally on ≥ 90% of locally-gradeable tasks; ledger records a complete baseline run; all canaries scripted and runnable in ≤ 15 min total.

---

### Stage 1 — Baseline brain (prompts-only) + first leaderboard contact

**Goal:** establish the honest floor, the run-variance envelope, and the submission SOP. No BCF yet — you cannot improve what you haven't measured.

**Build:**
1. Fork-quality reproduction of the best public baseline (romanrozen-class, prompts-only, expected LB ~0.12) as **Config 1 (naive)**: generic prompt, grep-first, no spec, no gates.
2. **eval_config.yaml v1:** `max_time_minutes` failsafe set (≈ 5.5 min/task × expected task count, conservative), `timeout_seconds`, `max_tool_calls`, `max_turns` from measured p95 of successful baseline episodes.
3. **Defensive tool policy v0 (prompt-level only):** symbol-language queries for `search_similar_code`; `get_code_neighbors` before `search_similar_code`; never query prose like "Body"; full-file reads or integer-only line args (pending Q7); scratch in `/tmp`, never `/workspace`.
4. **First two submissions** (SOP: Save Version → successful run → Submit; expect queue 4–13 h + run 12–14.5 h):
   - Sub #1: sample-derived baseline verbatim-ish → expected 0.05–0.12. Purpose: validate pipeline end-to-end and calibrate CV↔LB offset on *our* hardware.
   - Sub #2: same config, same week if quota allows, different seed → measure LB variance directly (community says ±0.04; get our own number).

**Exit gate G-S1:** two scored LB submissions on record; CV↔LB delta documented; per-task verdicts + failure-codebook labels for every local run; ledger pipeline proven end-to-end.

---

### Stage 2 — BCF scaffold v1 (the "brain," prompts + skills, no adapters)

**Goal:** convert BCF's four tenets into the ADK-legal submission format and beat the naive baseline on paired dev-split runs.

**Build (in compendium adoption order C2):**
1. **A6 spec-first + G0:** `write_spec` tool-call emission with JSON-schema validation; no file-access tools until a valid spec exists; `symbol_in_graph` check against the task graph; `fix_order` topological sort derived in script, not by the model.
2. **A8 gates as skill scripts:** `patch_validator.py` implementing G1 (scope), G2 (`git apply --check`), G3 (AST parse), G4 (targets pass), G5 (no regression → immediate revert), G6 (non-empty). The model cannot waive gates.
3. **A3 breadcrumb journal:** `/tmp/bcf/<task_id>/journal.md`, ≤30 lines, "Ruled out" section, read at each turn; the httpx_3672 lesson ("local red is expected — spec says hidden tests renamed") is the canonical entry.
4. **A2 rescue state machine:** deterministic trip conditions (3 consecutive failed validations; 3 repeated identical calls; <25% budget with no valid patch), R1 intake → R2 minimum baseline → R3 induction rounds → submit-best-or-none exit.
5. **A5 verification hierarchy wired in:** V0–V2 block; V2b/V3 advisory only; `visible_tests_only` caveat encoded in the validation plan template (trust spec over local red when they conflict — Trap 1 doctrine).
6. **A7 progressive skills packaging:** `skills/bcf-spec`, `bcf-localize`, `bcf-validate`, `bcf-rescue` with ≤5,000-token SKILL.md bodies and Level-3 scripts. Verify against the harness's actual skill-loading semantics (compendium GAP item) before relying on disclosure levels.
7. **Config 2** = Config 1 + defensive tool policy hardened (escaping-tolerant edit doctrine: prefer smaller unique anchors, whole-block replacement over whitespace-sensitive matches; verify each `edit_file` by re-reading).
8. **Config 3** = full BCF, flat (no sub-agents yet — Cognition's warning about write-heavy multi-agent pipelines stands until A4 is ablated).

**Test protocol:** Config 1 vs 2 vs 3, paired on the frozen 30-task dev slice, temp 0.2, ≥ 2 seeds for the head-to-head that decides the default. Report per-compendium metrics: pass rate with CI, `localization_calls`, `repeat_action_rate`, `loop_rate`, `edits_not_in_final`, `empty_patch_rate`, `gold_file_hit`, `fix_order_error`, `spec_file_correct`.

**Submission decision:** best config gets Sub #3. Expected 0.12–0.18. If it does not beat the Stage-1 baseline on paired local runs *after correcting for dead tasks*, do not submit — diagnose first.

**Exit gate G-S2:** Config 3 ≥ Config 1 + 3 tasks on paired dev runs (or a named, measured reason why not); failure-codebook distribution shifted away from `test_misread` and `exploratory_edit_loop`; Sub #3 scored.

---

### Stage 3 — Graph-first localization, skill library, budget tuning

**Goal:** exploit the competition's actual differentiator (code graphs + embeddings; the judge roster cares too) and tune the four budget knobs to the 12-hour game.

**Build:**
1. **Graph-first localization policy:** measured doctrine from the httpx_3672 verified facts — symbol-language queries; `get_code_neighbors` first (names only, <400 chars); `search_similar_code` with capped consumption and specific function/method names (never class-level prose that surfaces 130k-char nodes); `get_code_subgraph` for dual-tree/mirror detection (the `httpx.`/`ahttpx.` prefix check generalizes to "does this repo have parallel implementations"); honest limits recorded (cross-file callers may not exist in the graph → fall back to `read_file`).
2. **Repo-specific skill resources (Layer 3 knowledge):** per-repo domain notes (fastapi routing/pydantic version traps, rich console/rendering invariants, requests SSL/session semantics, httpx sync/async mirror rule) as `load_skill_resource` markdown — distilled from the taxonomy pass + gold-patch statistics, **regenerated and cited** per the host's resource-rule answer if reused publicly.
3. **Budget autotuning:** from ledger data, fit per-task time/tool budgets by complexity tier; set `max_time_minutes`, `max_turns`, `max_tool_calls` per-tier via the spec's `budget_plan`; global failsafe ≤ 11 h; explicit policy on the unanswered front-loading question (assume task order may not be public-first; uniform caps, no early-task splurging).
4. **A4 sub-agent pilot (ablation-gated):** three-arm handoff experiment (T0 full transcript / T1 structured packet / T2 hybrid) on a dev subsample. Adopt sub-agents **only** if T1/T2 ≥ T0 on pass rate at materially lower tokens. Otherwise stay flat. Anthropic's 15×-token/90.2%-gain result is for read-heavy research tasks — this is write-heavy sequential work; the prior is Cognition's.
5. **B3 Promptfoo regression gate:** spec-schema validation, tool-call-format checks, Phase-1 expected-sequence F1 on ~10 frozen issue texts; runs in seconds before any harness run; mandatory before any prompt edit ships.

**Submission decision:** Sub #4 = Config 3 + graph-first + tuned budgets. Expected 0.15–0.22. This is the submission intended to match/beat the current 0.17 leader.

**Exit gate G-S3:** `turn_first_graph` median ≤ 5; `localization_calls` median ≤ 8 on dev; ContextWindowExceededError rate ≈ 0; Sub #4 scored ≥ 0.15.

---

### Stage 4 — Adapters (LoRA/distillation), fully gated

**Goal:** capture the model-behavior upside **iff** the scorer's LoRA path is actually fixed. Until then, zero adapter submissions (none has ever scored; the official sample with adapters FAILED byte-for-byte).

**Gate G-S4a (canary, costs one submission slot):** loud-adapter canary passes **all four** probes on the *scorer* (not locally): adapter loads, outputs differ from base at temp 0, long prompts (>7.6k tokens) don't stall, run completes. If any probe fails → adapters deferred to Sprint 5 re-check; continue Stage 3 iteration instead.

**Build (only behind the gate):**
1. **Training data (license-clean):** distillation from open-weight teachers only (community consensus + ToS; GLM-5.3-class teacher or self-generated trajectories from Stage 2–3 ledger successes). Closed-API teachers = disqualification-level risk; not used.
2. **Trajectory SFT set:** winning Config-3 trajectories from the ledger (spec→localize→patch→validate sequences with gate outcomes), reformatted to the harness's tool-call format; ~500–1,500 episodes target from overnight 5090 runs.
3. **QLoRA training on the 5090:** rank ≤ 64 (the KV-collapse preallocates `max_loras × max_lora_rank` — even fixed, smaller rank = more KV headroom); QAT-aware recipe; verify on wheelhouse vLLM locally (stock PyPI vLLM refuses LoRA for Gemma 4).
4. **Two-adapter topology (optional):** `main_lora` (coder) + `tool_lora` (analyzer) mirroring the sample_submission's routing, only if the flat config with one adapter already scored.
5. **A/B:** adapter vs no-adapter on held-out slice, paired, ≥2 seeds. Ship only if held-out delta ≥ +2 tasks with CI excluding 0.

**Exit gate G-S4b:** adapter submission scored on LB ≥ the best no-adapter score. Otherwise the final submission is no-adapter and proud of it.

---

### Stage 5 — Finalization: selection, freeze, paper, winner obligations

**Goal:** convert the best measured artifact into a clean final submission and a strong paper-track entry.

1. **Final selection by paired held-out eval, not by LB feel.** LB slots in the final week are for confirmation, not exploration.
2. **Submission freeze checklist** (§3 below): schema validation, path-traversal audit, size audit (≤3 GiB, allowed extensions only), adapter manifest consistency, eval_config sanity, zip-from-clean-checkout reproducibility.
3. **Two more LB submissions** (Sub #5, #6): the frozen artifact + one variance-check repeat if quota allows.
4. **Paper track (deadline Nov 12, submit early — ties break on earliest entry):**
   - *Entry A (Best Paper, $15K):* "What actually breaks small-model SWE agents and what fixes them" — reliability-first design + measured harness-quirk taxonomy (escaping 22%/62%/0%, KV math, thinking-drop 0.35× vs 1.1×, CV/LB autopsy) + paired-eval protocol + Config 1/2/3 results. Graph-centric framing (graph-first localization with hit-rate metrics) for this judge roster.
   - *Entry B (Best New Resource, $10K):* gradability-audit tooling + corrected wheel/sandbox recipe + regenerated graphs/embeddings (host-sanctioned route) + labeled taxonomy + trajectory dataset.
   - 3,000-word cap each; methodology + repro steps for Verifiability; stub-submitted **in Sprint 1** to beat the writeup-save bug and lock earliest-entry tiebreak.
5. **Winner obligations readiness (§2.5/2.8):** Apache 2.0 release prep, license-clean lineage audit (training data provenance), reproducibility docs. Done before deadline, not after winning.

---

## 2. Master checklist

Legend: ☐ open · Gate items in **bold**. Sprint mapping refers to Deliverable 02.

### 2.1 Environment & measurement (Sprint 0–1)

- ☐ MAIN: Windows 11 Pro + WSL2 + CUDA 12.8+ + Docker + NVIDIA Container Toolkit verified (`nvidia-smi` in WSL, GPU-visible container)
- ☐ MAIN: competition dataset (22.42 GB) + wheelhouse (v25+) + Gemma 4 model downloaded; checksums verified
- ☐ MAIN: vLLM wheelhouse build serves the QAT model; smoke generation works; 32k context confirmed
- ☐ MAIN: ledger.jsonl + results.csv + receipt.json pipeline running; post-run script installed **before first experiment**
- ☐ AUX 2: grading farm live (Docker sandbox images built; gold-patch grading runs unattended)
- ☐ AUX 1: Promptfoo + docs/paper workstation live
- ☐ Local gold-patch autopsy: missing wheels added; starlette pinning fixed; remaining failures enumerated
- ☐ 12 dead-on-arrival public tasks mapped and excluded from CV honesty calculations
- ☐ Dev/held-out split frozen (stratified); held-out never tuned on
- ☐ Task taxonomy: all 129 tasks labeled; codebook frozen; held-out labeled last
- ☐ Canary suite Q1a/Q1b/Q2/Q3/Q7 scripted (≤15 min total runtime)

### 2.2 Baseline & submission SOP (Sprint 1)

- ☐ Config 1 (naive baseline) reproduced; local verdicts recorded with failure codebook
- ☐ eval_config.yaml v1 with `max_time_minutes` failsafe (mandatory until overrun fix confirmed live)
- ☐ Submission SOP rehearsed: Save Version → successful run → Submit (never Submit-first)
- ☐ **Sub #1 scored (pipeline validation)**
- ☐ **Sub #2 scored (variance probe)** — CV↔LB delta documented
- ☐ Paper-track stub writeup created, saved, submitted (bug check + earliest-entry tiebreak)

### 2.3 BCF scaffold (Sprint 2)

- ☐ A6: `write_spec` schema-validated tool call; G0 blocks file tools pre-spec; `symbol_in_graph` logged
- ☐ A8: G1–G6 as `patch_validator.py`; G5 = immediate revert; strike counter wired
- ☐ A3: `/tmp` journal schema; ≤30 lines; "Ruled out" section; read-per-turn
- ☐ A2: rescue state machine with deterministic trips; submit-best-or-none exit
- ☐ A5: V0–V2 blocking / V2b–V3 advisory; visible-tests-only doctrine in validation template
- ☐ Defensive edit doctrine v1 (escaping-tolerant anchors; verify-by-reread; integer-only line args pending Q7)
- ☐ Config 2 and Config 3 assembled; paired 30-task dev runs, ≥2 seeds
- ☐ **Gate G-S2 decision recorded** (Config 3 ≥ Config 1 + 3 tasks, or named measured reason)
- ☐ **Sub #3 scored**

### 2.4 Graph-first + budgets (Sprint 3)

- ☐ Graph-first localization policy shipped; symbol-language query doctrine; neighbor-first ordering
- ☐ search_similar_code guardrails (specific names only; output-size awareness; ContextWindowExceeded ≈ 0)
- ☐ Per-repo skill resources (fastapi/rich/requests/httpx) as Level-3 markdown
- ☐ Per-tier budget policy from ledger data; global ≤ 11 h failsafe; uniform caps (front-loading risk)
- ☐ A4 three-arm handoff ablation run; adopt-or-reject sub-agents **decided by data**
- ☐ Promptfoo regression gate mandatory for prompt edits
- ☐ **Sub #4 scored ≥ 0.15 target**

### 2.5 Adapters (Sprint 4, gated)

- ☐ **Gate G-S4a: canary probes all four pass on the scorer** (else skip stage)
- ☐ License-clean teacher selected (open-weight only); lineage documented
- ☐ Trajectory SFT set built from ledger successes
- ☐ QLoRA trained on 5090 (rank ≤ 64); verified on wheelhouse vLLM locally
- ☐ Paired held-out A/B adapter vs base, ≥2 seeds; **ship only if +2 tasks with CI excluding 0**
- ☐ **Gate G-S4b: adapter LB ≥ best no-adapter LB** (else final = no-adapter)

### 2.6 Finalization (Sprint 5–6)

- ☐ Final artifact selected by paired held-out eval
- ☐ Freeze checklist passed (schema, paths, size, extensions, manifest, reproducible zip)
- ☐ **Sub #5 (frozen artifact) + Sub #6 (variance confirmation) scored**
- ☐ Paper Entry A + Entry B finalized ≤3,000 words each, submitted **before Nov 12**
- ☐ Entry deadline (Nov 25) & team merger deadline compliance confirmed
- ☐ Winner-obligations package ready: Apache 2.0 release draft, reproducibility docs, license-clean lineage audit
- ☐ **Final submission (Dec 2) = best measured artifact, submitted ≥48 h early**

---

## 3. Milestones & score ladder

| # | Milestone | Target date | Evidence of done | Score expectation |
|---|---|---|---|---|
| M0 | Measurement rig live; gold autopsy fixed; canaries scripted | Oct 5 | Receipt R-0001 (gold-grading run) | — |
| M1 | First LB score on record | Oct 9 | Sub #1 scored | 0.05–0.12 |
| M2 | Variance envelope + CV↔LB calibration known | Oct 12 | Sub #2 scored; calibration memo | — |
| M3 | Config 3 beats naive on paired dev runs | Oct 18 | Paired results.csv + failure-codebook shift | local +3 tasks |
| M4 | BCF scaffold on the board | Oct 23 | Sub #3 scored | 0.12–0.18 |
| M5 | Graph-first + budget tuning on the board | Oct 30 | Sub #4 scored | **0.15–0.22 (parity/lead)** |
| M6 | Adapter verdict (ship or kill), evidence either way | Nov 8 | Canary + A/B receipts | +0–0.05 upside |
| M7 | Papers submitted | Nov 10 | Two writeups submitted | $35K track live |
| M8 | Final artifact frozen + confirmed on LB | Nov 20 | Subs #5–6 scored | **0.20–0.30 target zone** |
| M9 | Final submission in | Nov 30 | Submission receipt | podium contention |

**Honest calibration:** the plan's floor (everything works, no adapter) is ~0.18–0.22; the plan's realistic ceiling with adapters is 0.28–0.35. Both are likely top-3 given the 9/30 board; the compression means every single task matters.

---

## 4. Risk register (top 10, ranked by expected value at risk)

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | LoRA path never fixed on scorer | High | Medium | Adapters fully gated; plan wins without them; canary costs exactly 1 slot |
| R2 | CV↔LB anti-correlation misleads config selection | High | High | Paired eval; dead-task-corrected CV; LB slots spent on confirmation not exploration; host confirmed hidden set is clean |
| R3 | 12 h overrun errors the whole run | Medium (fix planned) | Fatal per-run | `max_time_minutes` failsafe always set; re-verify fix before removing |
| R4 | Host patch changes behavior mid-tuning (escaping, thinking, caps) with **no re-score** | Certain | Medium | Canary re-probe after every announced deploy; version every config; scores across a patch boundary are not comparable |
| R5 | GPU quota starvation (30 h/wk at 2× deduction, 4–13 h queues) | High | High | Submission calendar capped at 2–3/wk; all tuning local on the 5090; Kaggle used only for scoring |
| R6 | Run-to-run variance (±0.04) causes wrong config choice | High | High | ≥2 seeds on deciding comparisons; selection on held-out, not LB |
| R7 | Escaping fix ships as single-JSON (62% failure — worse) | Medium | Medium | Escaping-tolerant edit doctrine works under all three variants; verify-by-reread |
| R8 | Paper-track writeup-save bug on deadline week | Medium | Medium | Stub submitted Sprint 1; final submitted days early; earliest-entry tiebreak secured |
| R9 | Task-order gaming (public-first front-loading) unresolved | Unknown | Medium | Uniform per-tier budgets; no front-loading; policy documented |
| R10 | Distillation license contamination voids win | Low | Fatal | Open-weight teachers only; lineage audit in winner package |

---

## 5. Decision rules (pre-committed, so mid-competition stress can't relitigate them)

1. **No submission without a hypothesis and a predicted score range**, recorded before submitting.
2. **No config change based on a single run** — paired or nothing.
3. **No adapter submission unless all four canary probes pass on the scorer.**
4. **No tuning on held-out.** Held-out touches happen at stage gates only.
5. **The `max_time_minutes` failsafe is never removed** until the overrun fix is confirmed live by our own probe.
6. **Every number in the paper carries a receipt ID or a derivation** (B1 evidence tiers M/D/I/H).
7. **A V3 model judgment never overrides a V2 executable failure.**
8. **Trust the spec over the local test signal** when they conflict (httpx_3672 Trap 1 doctrine).
9. **Submissions are a scarce resource (1/day, quota-capped): two per week planned, one emergency slot reserved.**
10. **Frozen artifacts beat better ideas in the final week.** After Nov 20, bugs get fixed; features do not get added.

---

*Next: Deliverable 02 maps Stages 0–5 onto Day-0 bare-metal setup and six one-week sprints with per-machine hardware allocation.*


---

<!-- ====================================================================== -->
<!-- FILE: Gemma4-02-Day0-Six-Sprint-Master-Plan.md -->
<!-- ====================================================================== -->

# Deliverable 02 — Master Plan: Day-0 Bare-Metal Setup → Six Sprints → Winning Submission

**Compiled:** 2026-10-02 · **Owner:** Cooly · **Companion:** Deliverable 01 (roadmap, master checklist, decision rules)
**Campaign window:** Day 0 = **Fri Oct 2, 2026** → Final Submission Deadline **Wed Dec 2, 2026** (11:59 PM UTC).
Sprints 1–6: **Oct 5 – Nov 15**. Buffer/hardening: **Nov 16 – Dec 2** (17 days). Paper deadline **Nov 12**. Entry/merger deadline **Nov 25**.

---

## 0. Hardware allocation doctrine

The fleet is asymmetric, so the plan is too. One rule governs everything: **the 5090 does model work; everything that is not model work is pushed off the 5090.**

| Machine | Silicon | Role | Why |
|---|---|---|---|
| **MAIN** — PowerSpec G914 | Ryzen 9 9950X3D · 64 GB DDR5-6000 · **RTX 5090 32 GB** · 2 TB NVMe · Win 11 Pro | **Inference + training + primary dev.** vLLM serving of `gemma-4-31b-it-qat-w4a16-ct` (~17–18 GB weights at W4A16 → fits with KV headroom on 32 GB), local Config 1/2/3 harness runs, overnight HIVE-Lite experiment queues, QLoRA training | Only GPU in the fleet that can hold the model. Blackwell (sm_120) requires CUDA 12.8+/recent PyTorch — pin carefully |
| **AUX 2** — ROG Strix G15CF | i7-12700F · 64 GB · RTX 3080 10 GB · 512 GB SSD + **2 TB HDD** | **Grading farm.** Phase-2 verification (pytest in Docker, pure CPU work), gold-patch autopsy, dataset/wheel curation, snapshot extraction, bulk ledger post-processing. HDD = cold storage for snapshots/graphs/embeddings mirrors | 10 GB VRAM cannot serve a 31B — but grading needs zero GPU. 12 cores × pytest parallelism ≈ 8–12 concurrent task verifications |
| **AUX 1** — ProArt P16 | Ryzen AI 9 HX 370 · 32 GB · RTX 4060 8 GB · 1 TB | **Control plane & writing.** Promptfoo regression suites, Kaggle submission management/monitoring (queue watching, Save-Version→Submit SOP), results dashboards, paper writing, taxonomy labeling | Laptop = portable ops desk; keeps submission babysitting off the dev box. 8 GB VRAM unused for this campaign |

**Network:** 5GbE on MAIN; standard gigabit suffices elsewhere. Shared storage convention: `\\MAIN\swe\` (SMB) as the single source of truth for `experiments/` (ledgers, receipts, results.csv), with nightly robocopy mirror to AUX 2's HDD. Git repo on MAIN, pushed to a private remote.

**Power/thermal note:** the 5090 box runs overnight queues — enable Windows "High performance" plan, disable sleep, set WSL2 memory cap (`.wslconfig`: `memory=52GB`, leave 12 GB for Windows), and confirm the PSU/loop survives a 12-hour sustained load on Day 0, not in Sprint 3.

---

## DAY 0 — Friday, Oct 2 (bare metal → working environment)

**Definition of done for Day 0:** all three machines online in their roles; the dataset downloaded and verified; the vLLM server generates tokens from the QAT model on the 5090; the ledger pipeline records a smoke run; the grading farm passes one gold patch. Do not start Sprint 1 without this.

### MAIN (PowerSpec G914) — ~6 hours

| # | Step | Detail / acceptance check |
|---|---|---|
| 0.1 | Windows 11 Pro baseline | Full Windows Update; chipset (AMD X870E) drivers; NVIDIA **Game Ready/Studio driver ≥ 580.xx** (Blackwell); `nvidia-smi` shows 32 GB. Disable Core Isolation/Memory Integrity only if WSL2/virtualization conflicts arise |
| 0.2 | BIOS sanity | EXPO for DDR5-6000 confirmed stable (memtest quick pass); Resizable BAR on; SVM (virtualization) enabled |
| 0.3 | WSL2 | `wsl --install -d Ubuntu-24.04`; `.wslconfig` → `memory=52GB`, `processors=28`, `swap=32GB`; `wsl --update`; systemd enabled |
| 0.4 | CUDA in WSL2 | Do **not** install Linux NVIDIA drivers inside WSL (Windows driver passthrough); install CUDA toolkit 12.8+ via apt meta-package `cuda-toolkit-12-8` only if building; runtime comes via wheels. `nvidia-smi` works inside WSL |
| 0.5 | Docker | Docker Desktop (WSL2 backend) **or** native Docker Engine in WSL; NVIDIA Container Toolkit; acceptance: `docker run --gpus all nvidia/cuda:12.8.0-base-ubuntu24.04 nvidia-smi` shows the 5090 |
| 0.6 | Python toolchain | `uv` installed; Python 3.12/3.13 venvs; git + git-lfs; GitHub CLI |
| 0.7 | Kaggle CLI + data pull | `pip install kaggle`; API token; `kaggle competitions download -c gemma-4-developer-agent` (22.42 GB → NVMe); wheelhouse dataset (v25+); model weights via Kaggle Models (accept license). Verify: 129 tasks.jsonl lines; 524 files; sha/spot-check `snapshots/httpx_3672.tgz` extracts |
| 0.8 | Sandbox images | Build `Dockerfile.sandbox` + `Dockerfile.public`; run `sandbox/setup.py` path on one task (`httpx_3672`); acceptance: editable install resolves from `/wheels/` offline |
| 0.9 | vLLM serving smoke | Install wheelhouse wheels (patched vLLM 0.19.1 + SupportsLoRA — **required**, stock PyPI refuses Gemma 4 LoRA); serve model per Getting-Started §4 (TP=1 on single 5090, `max_model_len=32768`, bf16, `gpu_memory_utilization=0.90`, tool_call_parser/reasoning_parser `gemma4`); acceptance: one chat completion + one tool call round-trip |
| 0.10 | Ledger rig (B5/B1) | `experiments/` tree on `\\MAIN\swe\`; `ledger.jsonl` schema v0.1 writer; post-run `results.csv` appender; `receipt.json` template; **smoke receipt R-0000 committed** |
| 0.11 | Burn-in | 30-min sustained vLLM generation loop; watch VRAM/temps; no WSL memory thrash |

### AUX 2 (ROG Strix) — ~2.5 hours (parallel with MAIN)

| # | Step | Detail |
|---|---|---|
| 0.12 | Windows baseline + WSL2 | Updates; WSL2 Ubuntu-24.04; `.wslconfig` `memory=48GB`; Docker Desktop (GPU toolkit optional — not needed for grading) |
| 0.13 | Grading farm | Copy dataset snapshots/wheels to HDD; build sandbox images; write `grade_farm.py`: pull task list → apply patch → reset tests → apply test_patch → run pytest → emit verdict row. Acceptance: `httpx_3672` gold patch grades `resolved=True` |
| 0.14 | Gold autopsy kickoff | Queue all 129 gold patches for grading overnight; output = per-task grade + failure reason (feeds Sprint 1 dead-task map) |

### AUX 1 (ProArt P16) — ~1.5 hours (parallel)

| # | Step | Detail |
|---|---|---|
| 0.15 | Ops workstation | WSL2, Python, Node LTS (`npm i -g promptfoo`), git, Kaggle CLI with the same account token |
| 0.16 | Submission SOP runbook | One-page checklist: Save Version → confirm successful run → Submit; quota ledger (30 GPU-h/wk, ~2× deduction); queue-watch habit (check at 4 h, 8 h) |
| 0.17 | Paper-track stub | Join paper track; create + save + submit a stub writeup → **earliest-entry tiebreak locked, writeup-save bug tested** (Deliverable 01, R8) |

### Day-0 close-out (all hands, 30 min)
- Verify Deliverable 01 checklist §2.1 items; log anything incomplete as Sprint-1 Day-1 blockers.
- Run canary Q7 (`read_file` line-range TypeError probe) — 10 minutes, decides edit/read doctrine wording in Sprint 1.

**Weekend (Oct 3–4, light):** gold-autopsy results land; taxonomy open-coding begins on AUX 1 (2–3 h/day max — protect the weekend).

---

## SPRINT 1 — Oct 5–11 — "Measure first, submit early"

**Theme:** Stage 0 completion + Stage 1 (baseline brain, first two leaderboard submissions).
**Score target:** LB 0.05–0.12 on the board; variance envelope measured.

| Day | MAIN (5090) | AUX 2 (grading farm) | AUX 1 (ops) |
|---|---|---|---|
| Mon 10/5 | Fix local grading env (add typing_inspection, inline-snapshot, dirty-equals, ujson/orjson, python-multipart wheels; per-commit starlette pinning); re-run gold autopsy locally | Parallel gold re-grade with corrected wheels; produce dead-task map (expect 12 locally-dead public tasks) | Taxonomy open-coding: tasks 1–40 |
| Tue 10/6 | Reproduce Config 1 naive baseline locally on dev slice (30 tasks, stratified); ledger rows flow | Grading of Config 1 outputs; failure-codebook labeling begins | Taxonomy 41–80; Promptfoo skeleton |
| Wed 10/7 | eval_config.yaml v1 (failsafe `max_time_minutes` ≈ 5.5 min/task equivalent); **package Sub #1** (sample-derived baseline) | Verify submission zip contents against schema (extensions, size, paths) | **Submit Sub #1** (Save-Version→Submit SOP); start queue watch |
| Thu 10/8 | Config 1 second-seed local run (variance data); HIVE-Lite job queue v1 (idempotent, resumable, one GPU job at a time) | Autopsy of Config 1 failures: `test_misread`, `budget_exhausted_exploring`, `wrong_file_localized` counts | Taxonomy 81–129 → codebook draft frozen; monitor Sub #1 scoring |
| Fri 10/9 | **Sub #1 score expected** (~12–14.5 h run after queue); record CV↔LB delta. Package Sub #2 (same config, new seed) | Cross-check Sub #1 per-task verdicts vs local CV | **Submit Sub #2** (variance probe) if quota headroom (track ~2× deduction) |
| Sat 10/10 | Overnight queue: Config 1 on full dev split ×2 seeds | Grade everything; results.csv complete for Config 1 | Taxonomy human_override pass; held-out labeled **last** |
| Sun 10/11 | **Sprint review:** gates G-S0/G-S1 checklist; canary suite scripted (Q1a/Q1b/Q2/Q3/Q7) | Rest | Rest |

**Sprint-1 exit gates (from Deliverable 01):** G-S0 (rig trustworthy) + G-S1 (two scores on record, calibration documented). **Milestones M0–M2.**

**Quota math check:** 2 submissions × (queue ~5 h + run ~13 h) × ~2× deduction ≈ 70 GPU-h nominal against a 30 h/wk quota — *watch the actual deduction behavior*; if it bites, Sub #2 slips to Sprint 2 and variance is measured locally instead. This is the plan's first real scarcity decision: **when forced to choose, spend slots on config decisions, not variance measurement.**

---

## SPRINT 2 — Oct 12–18 — "The BCF brain goes in"

**Theme:** Stage 2 — Config 2 (defensive baseline) and Config 3 (full BCF, flat) built and paired-tested. **Sub #3** at week's end if G-S2 passes.
**Score target:** local paired delta ≥ +3 tasks over Config 1; Sub #3 LB 0.12–0.18.

| Day | MAIN | AUX 2 | AUX 1 |
|---|---|---|---|
| Mon 10/12 | A6 spec layer: `write_spec` schema-validated tool call + G0 blocking + `symbol_in_graph` check | Spec-emission unit tests on frozen issue texts (scripted, no model) | Promptfoo: Phase-1 spec regression suite (is-json + schema + symbol-in-graph checks) |
| Tue 10/13 | A8 gates: `patch_validator.py` G1–G6; G5 immediate-revert; strike counter | Gate unit tests vs known-bad patch corpus (from Config 1 failures) | Promptfoo: tool-call format regression |
| Wed 10/14 | A3 journal (`/tmp/bcf/<task>/journal.md`, ≤30 lines, ruled-out section) + A2 rescue state machine | Wire journal/rescue telemetry into ledger schema (fields already reserved) | Write the httpx_3672 "expected local red" journal template into `bcf-validate` resources |
| Thu 10/15 | A5 verification hierarchy wired; defensive edit doctrine v1 (escaping-tolerant anchors; verify-by-reread; integer line args per Q7 result) | Grading farm prepped for paired Config 1/2/3 matrix | Docs: update submission packaging script for skills/ tree |
| Fri 10/16 | **Overnight queue starts:** Config 1 vs 2 vs 3, 30-task dev slice, seed 0 | — | — |
| Sat 10/17 | Seed 1 run of the deciding comparison | Grade all runs; paired stats (CI); failure-codebook shift analysis | Draft Sub #3 package from winning config |
| Sun 10/18 | **G-S2 decision meeting (solo, checklist-driven):** Config 3 ≥ Config 1 +3 paired tasks? If yes → **Sub #3 packaged and submitted**. If no → named measured reason; Sub #3 becomes best-performing config or slips 48 h | Rest | Rest |

**Watch-item this sprint:** host promised patches for Q2 (escaping) and Q3 (thinking) around 9/30–10/1. **Re-run canaries before locking sampling.yaml**; if the thinking-mode patch deployed, re-probe thinking on/off (0.35× vs 1.1× growth signature) before deciding `include_thoughts`. Scores across the patch boundary are not comparable — note the boundary in every receipt.

---

## SPRINT 3 — Oct 19–25 — "Graph-first, budget-tight"

**Theme:** Stage 3 — exploit the code-graph/embedding tools (the competition's differentiator and the judges' home turf) + tune the four `eval_config.yaml` knobs to the 12-hour game. **Sub #4** at week's end.
**Score target:** Sub #4 LB **0.15–0.22** — the submission designed to catch the 0.17 leader.

| Day | MAIN | AUX 2 | AUX 1 |
|---|---|---|---|
| Mon 10/19 | Graph-first localization policy v1: neighbor-first ordering, symbol-language queries, dual-tree detection via subgraph, documented fallback to `read_file` when graph lacks cross-file callers | Graph analytics: per-repo node-size distribution; identify >5k/>20k/>100k char nodes (the context-killers) per graph | Promptfoo: localization-sequence regression (expected tool-call patterns per task type) |
| Tue 10/20 | `search_similar_code` guardrails: capped-consumption doctrine in prompts/skills; ContextWindowExceeded counter in ledger | Verify guardrails on the 246-call failure distribution (re-simulate worst cases) | Per-repo skill resources draft: fastapi + rich |
| Wed 10/21 | Budget autotuning from ledger: per-complexity-tier `budget_plan` values; global failsafe ≤11 h; uniform caps (no front-loading) | Simulate budget policies against Sprint-1/2 traces (counterfactual replay) | Per-repo skill resources: requests + httpx |
| Thu 10/22 | A4 three-arm handoff ablation (T0/T1/T2) on 15-task subsample — **adopt-or-kill sub-agents decided here** | Grade ablation arms | Paper Entry A outline (3,000-word skeleton) |
| Fri 10/23 | Config 3.1 = Config 3 + graph-first + tuned budgets (+ sub-agents only if ablation says so); paired dev run starts | — | **Sub #4 packaged** |
| Sat 10/24 | Config 3.1 seed-1 run; regression check vs Config 3 receipts | Grade; stats | **Submit Sub #4** |
| Sun 10/25 | Sprint review: G-S3 (turn_first_graph ≤5; localization_calls ≤8; CtxExceeded ≈ 0) | Rest | Rest |

**Deadline awareness:** entry/merger deadline is Nov 25 — a month out, but confirm rule acceptance status **this week** (one click, zero cost, fatal if forgotten).

---

## SPRINT 4 — Oct 26–Nov 1 — "Adapters, behind the gate"

**Theme:** Stage 4 — the LoRA upside, strictly behind canary gate G-S4a. Parallel track: paper Entry A draft.
**Score target:** adapter verdict with receipts; LB unchanged unless gate passes and adapter wins A/B.

| Day | MAIN | AUX 2 | AUX 1 |
|---|---|---|---|
| Mon 10/26 | Canary re-probe Q1a/Q1b locally on wheelhouse v25+ (loud adapter: randomized A/B → temp-0 output diff; 8k-token prompt with adapter mounted) | Prep long-prompt fixtures (the 7.6k KV-collapse tripwire) | Draft **adapter canary submission** (minimal loud-adapter zip) |
| Tue 10/27 | **G-S4a:** submit adapter canary (uses the week's slot). Continue scaffold polish while queued | Grade Sprint-3 residuals; mine failure codebook for SFT-worthy recovery patterns | Paper Entry A: methods section draft |
| Wed 10/28 | Trajectory SFT set assembly from ledger successes (spec→localize→patch→validate episodes; harness tool-call format; license-clean: self-generated + open-weight teacher only) | Deduplicate/quality-filter trajectories; target 500–1,500 episodes | Teacher-selection memo (open-weight only; GLM-5.3-class); lineage documentation starts |
| Thu 10/29 | QLoRA training run 1 on the 5090 (rank ≤64, QAT-aware); verify locally on wheelhouse vLLM (never stock PyPI) | Smoke-grade adapter-agent outputs on 5-task slice | Canary scoring watch |
| Fri 10/30 | **Canary result lands.** All four probes pass? → proceed. Any fail? → **adapters killed for the campaign**, sprint converts to scaffold-hardening week (no shame; the thesis wins without them) | — | — |
| Sat 10/31 | (If gate passed) adapter A/B: adapter vs base on held-out slice, paired, seed 0 | Grade A/B | Entry A results section (numbers from receipts only) |
| Sun 11/1 | Seed 1; **G-S4b stats**: ship only if +2 tasks, CI excludes 0 | Rest | Rest |

**Hard rule (Deliverable 01, decision rule 3):** no adapter submission has ever scored in this competition. The canary is not optional, and "it worked locally" is not evidence — layers 2 (silent zeroing) and 3 (KV collapse) live in the scorer's launch flags.

---

## SPRINT 5 — Nov 2–8 — "Harden, select, freeze the candidate"

**Theme:** Stage 5 begins — final-candidate selection by paired held-out eval; paper Entries A & B to near-final. **Sub #5** = frozen candidate.
**Score target:** held-out-selected artifact; Sub #5 LB confirms ≥ Sprint-3 level (≥0.15, target 0.20+).

| Day | MAIN | AUX 2 | AUX 1 |
|---|---|---|---|
| Mon 11/2 | Final-candidate selection: paired held-out eval of top-2 configs (3.1 vs adapter-variant if alive) | Grade held-out runs | Selection memo drafted (receipts only) |
| Tue 11/3 | Robustness pass on winner: failure-codebook top-3 residual fixes **that are prompt/skill-level only** (no new machinery) | Regression-grade each fix | Promptfoo full-suite green before/after |
| Wed 11/4 | Freeze checklist dry-run: schema validation, path-traversal audit, ≤3 GiB size audit, allowed extensions, adapter manifest consistency, reproducible zip from clean checkout | Independent re-zip + re-grade of the frozen artifact (second-machine verification) | **Package Sub #5** |
| Thu 11/5 | Held-out confirmation run of exact frozen bits | Grade | **Submit Sub #5**; Entry B (resource paper) assembly: gradability-audit tooling + corrected wheel recipe + taxonomy + trajectory dataset docs |
| Fri 11/6 | Buffer / overflow from the week | Regenerate graphs/embeddings for resource paper (host-sanctioned route: regenerate from upstream repos, cite, link — do not redistribute shipped files) | Entry A full draft ≤3,000 words; Entry B draft |
| Sat 11/7 | Claims audit begins: every number in both papers gets a receipt ID or a derivation (M/D/I/H tiers) | Verify paper tables against results.csv | Same |
| Sun 11/8 | Sprint review: **M6 (adapter verdict) + M8-candidate** recorded | Rest | Rest |

---

## SPRINT 6 — Nov 9–15 — "Papers in, final submission locked"

**Theme:** paper-track delivery (deadline **Nov 12**, ties → earliest entry, stub already locked), final-submission confirmation, campaign close-out of the sprint system.

| Day | MAIN | AUX 2 | AUX 1 |
|---|---|---|---|
| Mon 11/9 | Final claims audit complete; both papers frozen | — | **Submit Paper Entry A** (don't wait for the 12th — platform bug history + earliest-entry tiebreak) |
| Tue 11/10 | — | — | **Submit Paper Entry B** (M7 done) |
| Wed 11/11 | Buffer for paper platform issues (writeup-save bug) | — | Confirm both writeups show as *submitted*, not drafts (un-submitted drafts are not judged) |
| Thu 11/12 | **Sub #5 score expected**; selection confirmed or contingency invoked | Grade any last confirmation run | Paper deadline day — nothing left to do by design |
| Fri 11/13 | **Sub #6 packaged:** frozen artifact re-run (variance confirmation / LB insurance) | — | **Submit Sub #6** if quota allows |
| Sat 11/14 | Winner-obligations package: Apache 2.0 release draft, reproducibility docs, license-clean lineage audit (training data provenance) | Archive experiment tree to HDD | Draft public-release README |
| Sun 11/15 | Sprint review; campaign retro; plan buffer phase | Rest | Rest |

---

## BUFFER PHASE — Nov 16–Dec 2 — "Confirm, don't tinker"

Seventeen days of deliberate slack. Purpose: absorb rescored backlogs (the 9/26 rescore was paused behind L4×4 queues), late host patches, and quota surprises — **without** destabilizing the frozen artifact.

- **Nov 16–20 (M8):** Sub #6 score lands; final selection confirmed by paired held-out evidence (not LB feel). Any host patch (escaping/thinking/LoRA/caps) triggers canary re-probe; only probe-verified improvements may touch the candidate, via full Promptfoo + paired dev re-run.
- **Nov 21–25:** entry/merger deadline Nov 25 — verify team/rules status; winner-obligations package final.
- **Nov 26–29:** final artifact re-zipped from clean checkout; checklist §2.6 run end-to-end; one spare submission slot held for a true emergency (e.g., scorer-side fix that invalidates an assumption — verify with canary first).
- **Nov 30 (M9):** **final submission in, ≥48 h before the Dec 2 deadline.** Dec 1–2: monitor only.

---

## Sprint-level scorecard (fill in as the campaign runs)

| Sprint | Submission | Hypothesis | Predicted | Actual LB | Receipt IDs |
|---|---|---|---|---|---|
| 1 | Sub #1 | Pipeline validates; baseline ~public-notebook class | 0.05–0.12 | | |
| 1 | Sub #2 | Same config, variance ≤ ±0.05 | ≈ Sub #1 | | |
| 2 | Sub #3 | BCF scaffold ≥ naive +3 paired tasks | 0.12–0.18 | | |
| 3 | Sub #4 | Graph-first + budgets catch the leader | 0.15–0.22 | | |
| 4 | (canary) | Scorer LoRA path fixed (4 probes) | pass/fail | | |
| 5 | Sub #5 | Frozen candidate confirms held-out selection | ≥0.15, target 0.20+ | | |
| 6 | Sub #6 | Variance confirmation of frozen artifact | ≈ Sub #5 | | |

## Weekly standing rituals (all sprints)

1. **Monday 30 min:** gate checklist review against Deliverable 01 §2; blockers named.
2. **Wednesday:** forum sweep (the authoritative channel — staff don't watch Discord); update host-commitments tracker; re-run canaries after any announced deploy.
3. **Friday:** quota ledger audit (deduction vs expectation); next week's submission slot allocated by hypothesis value.
4. **Every night:** HIVE-Lite overnight queue launched on MAIN; grading farm consumes on AUX 2; `results.csv` + receipts updated before sleep.
5. **Every run:** receipt committed. No receipt → the number does not exist.

---

*The plan's spine: measurement before models, scaffold before weights, gates before ambition, and a submission calendar treated as the scarcest resource in the campaign. Current board (0.17/0.15/0.15) is beatable by reliability engineering alone; everything above that is upside taken only behind measured gates.*


---

<!-- ====================================================================== -->
<!-- FILE: Gemma4-03-Document-Review-Integration-Map.md -->
<!-- ====================================================================== -->

# Deliverable 03 — Document Review: Useful Material, Integration & Test Map, Whitepaper Brainstorm

**Compiled:** 2026-10-02 · **Task 1 of 2** · Reviews: `Kaggle-00-Complete.md`, `03-discussion-board-intel.md`, `04-paper-track-intel.md`, `BCF-Reference-Compendium.md`, `BCF-contestsubmission_dossier_20260928.html`, `03-bcf-simulation-httpx-3672.md`
**Plan references:** Deliverable 01 (roadmap/checklist) and Deliverable 02 (Day-0 + six sprints).

---

## 1. Review method and the provenance caveat

The dossier is a *working session record*, and it carries its own provenance ledger — several of its most memorable artifacts (the 8/20/32/45% phase projections, the httpx_6821 case study, draft-1 Table 1, "zero wrong edits for BCF") are explicitly **Retracted** or **Illustrative**. Everything below is filtered through that ledger: I adopt only what is Verified, Designed-but-sound, or independently confirmed by the 9/30 intel sweep. Where the dossier and the newer intel disagree, the intel wins (it is 2 days newer and host-sourced).

**The single most important correction the intel forces on the dossier:** the dossier's budget model says "120 tasks × 6 min = exactly 12 h, no slack" and recommends `per_task_timeout_seconds`. The harness reality (discussion intel §3) is that the scorer reads exactly four `eval_config.yaml` fields — `timeout_seconds`, `max_tool_calls`, `max_time_minutes`, `max_turns` — and hitting the 12 h cap **errors the entire submission**. So the dossier's percentile-timeout tuning idea is right in spirit but must be retargeted at `max_time_minutes` as a *global failsafe* plus per-tier `budget_plan` values, with the tuning loop kept.

---

## 2. Useful material, area by area — what to keep, how to integrate, how to test

### 2.1 The four-tenet core + four-phase pipeline (Compendium A1) — KEEP, already load-bearing

- **What it is:** preserve working code; minimum-path decomposition; breadcrumbs; binary done. Phases: Specification → Localization → Patch → Validation, DAG with rescue as the only backward edge.
- **Integration:** already the spine of Deliverable 01 Stage 2 (Config 3). No change.
- **Test:** paired Config 1/2/3 comparison on the frozen 30-task dev slice (Sprint 2, Fri–Sat); metrics per compendium A1.2 (`collateral_edit_rate`, `loop_rate`, `empty_patch_rate`).

### 2.2 The Phase-1a classification gate (Dossier Turn 20) — KEEP, upgrade to first-class

- **What it is:** before writing the spec, classify the task kind (crash / logic / contract / feature / compat-refactor) from **issue text alone**, in a deterministic skill script. The dossier correctly self-corrected: classification cannot use `test_patch` (the agent never sees it), and repo-specific keyword maps do not transfer (hidden set is private repos).
- **Integration:** this is already in the master plan as T20 (`classify_issue` skill script, Sprint 2). **Upgrade:** this gate is also the entry point of the whitepaper's mathematical model (Deliverable 04) — the exception-class taxonomy is what makes the search-space reduction claim measurable. Promote it from "sub-step" to the formally defined *classifier C* of the paper.
- **Test:** classifier accuracy vs the frozen taxonomy labels on dev tasks (target ≥80% on task_type); then the key experiment — **does routing accuracy predict pass rate?** (compendium A6.2: spec score predicts PASS).

### 2.3 The httpx_3672 verified walkthrough (simulation doc) — KEEP, canonical teaching + pre-registration asset

- **What it is:** the only fully [V]-grounded worked example; four real traps (visible-vs-graded suite asymmetry; dual sync/async tree; latent call-site fault; ungraded broken code) and the [SIM] Config 1 vs Config 3 trajectories.
- **Integration:** already cited in Deliverable 01 decision rule 8 ("trust the spec over local red"). Its §8 "new verified harness facts" (symbol-language queries, fully-qualified node ids, intra-class-only call edges, graded-scope ≠ gold-scope) are now hard constraints on the Sprint-3 graph-first policy.
- **Test:** its pre-registered prediction #9 (Config 1 exhibits `test_misread` at a higher rate than Config 3 on rename/refactor tasks) is a free paper result — measure it in the Sprint-2 paired runs. Cost: zero extra compute, just failure-codebook slicing.

### 2.4 The Four Intelligence Layers map (Dossier Turn 11) — KEEP as the submission architecture

- **What it is:** Layer 1 system-prompt knowledge (0 turns) → Layer 2 skill scripts (1 turn, compute) → Layer 3 JSON/markdown resources (1 turn, data) → Layer 4 LoRA (0 turns, weights). Layers 1–3 stack additively.
- **Integration:** matches Deliverable 01's stage ordering almost exactly (prompts → skills → resources → gated adapters). One refinement: Layer 1 content must be **generic** (the dossier's retraction that repo-specific anchors don't transfer applies here) — pack *patterns and doctrine*, not repo-specific file maps, into `system.md`.
- **Test:** the layer-stack is naturally ablated by Config 1→2→3→3.1; report the marginal turn-cost and pass-rate of each layer (this is the paper's "efficiency ladder" figure).

### 2.5 The GraphRAG bug-pattern knowledge base (Dossier Turn 12) — KEEP, descoped and gated

- **What it is:** an offline "bug pattern graph" in `skills/` resources — nodes = bug patterns with `symbol_anchors` bridging into the competition's code graphs; consumed via `load_skill_resource`/`run_skill_script`.
- **Integration:** assign to Sprint 3 as the per-repo/generic skill resources (Deliverable 01 Stage 3 item 2). **Descope rule:** pattern nodes must be mechanism-level ("API rename with mirrored trees", "redirect-history lifecycle"), not repo-file-level. The `symbol_anchors` bridge idea is genuinely clever and is the most judge-aligned artifact in the whole dossier (graph-ML panel).
- **Test:** A/B on dev slice: Config 3 + pattern resources vs Config 3 alone; metric = `localization_calls` and `turn_first_graph`. Ship only if localization cost drops without pass-rate regression.

### 2.6 eval_config tuning loop (Dossier Turn 2/3) — KEEP with corrected knobs

- **What it is:** fit per-task limits to the ~75th percentile of successful-task durations; treat every config change as a receipted experiment.
- **Integration:** already Deliverable 01 Stage 3 item 3. Corrected per intel: tune `timeout_seconds` and `max_turns` per complexity tier from ledger data; set `max_time_minutes` global failsafe ≈ 11 h; keep the "tighten to p75–p80 of resolved-task times" discipline.
- **Test:** counterfactual replay against Sprint-1/2 traces (AUX 2, Sprint 3 Wed) before burning any GPU on it — the replay tells you the pass-count delta of a candidate timeout without a single new run.

### 2.7 The tool hierarchy doctrine (Dossier Turn 3) — KEEP, amend per intel

- **What it is:** graph tools = exploration, `read_file`/`run_command` = navigation, `edit_file`/`write_file` = implementation; never grep-explore; `called_by` edges for bug localization.
- **Amendments forced by intel:** (a) `search_similar_code` must use **symbol-language** queries, not prose (verified fact §8.2); (b) `search_similar_code` output is currently **uncapped** and has killed tasks via ContextWindowExceeded — neighbor-first ordering is mandatory until the host cap lands; (c) the dossier says "always use line ranges" for `read_file` — hold pending the Q7 line-range TypeError canary (Day-0 close-out); (d) "read_file first, never edit blind" is exactly right and is already the defensive edit doctrine (escaping intel: 62/299 `edit_file` failures, 39 provably escaping-caused).
- **Test:** the dossier's own diagnostic — graph-tools-off fork on 10 tasks, compare tool-call counts — is adopted verbatim as a Sprint-3 gate metric (`turn_first_graph`, `localization_calls`).

### 2.8 Jev as dev-time judge/labeler (Dossier Turn 13) — KEEP as optional dev-time tooling, two hard rules

- **What it is:** cheap, fast typed-decision API (Choice/Score/Noul) usable as taxonomy first-pass labeler, trajectory judge, failure-mode classifier. Cannot enter the sandbox (offline + model-locked).
- **Integration:** optional Sprint-1 accelerator for the taxonomy labeling pass (AUX 1). **Rule 1 (license):** the distillation/host answer permits external-LLM *training* data only if license-compliant — using Jev purely to *analyze* is fine, but do not train on Jev outputs without re-checking the rules answer. **Rule 2 (calibration):** independent evidence shows poor calibration on unfamiliar data (ECE 0.107 vs 0.024 noise floor; 0/30 out-of-scope flagged at 0.99 confidence). Mandatory "none of these" option + human spot-check of ≥20 labels.
- **Test:** the dossier's 20-task inter-rater design (Cohen's κ) doubles as the Jev-calibration check if Jev is the second rater.

### 2.9 Evidence-tier discipline (Compendium B1 + dossier provenance ledger) — KEEP, this is the project's immune system

- The dossier's retracted-claims ledger is the reason this review can trust it. B1's M/D/I/H tiers and receipt-per-run requirement are already in Deliverable 01 (decision rule 6). The Sprint-5 **claims audit** stays.

### 2.10 Community/host intel (discussion-board intel doc) — KEEP as the watch-list

- The host-commitments tracker (§2 of that doc) maps 1:1 onto the master plan's canary suite (Q1a/Q1b/Q2/Q3/Q7). The rescoring backlog and queue/quota facts are already in the submission calendar math. No changes needed; the Wednesday forum sweep ritual keeps it current.

---

## 3. Integration summary — one table

| Dossier/compendium item | Plan location | Test that decides it | Sprint |
|---|---|---|---|
| Four tenets + 4-phase pipeline (A1) | Stage 2, Config 3 | Paired 30-task C1/C2/C3, ≥2 seeds | 2 |
| Phase-1a classification gate (T20) | Stage 2; paper model entry point | Classifier accuracy + accuracy→pass correlation | 2 |
| httpx_3672 traps + prediction #9 | Doctrine (rule 8); graph policy | `test_misread` rate slice on paired runs | 2 |
| Four Intelligence Layers | Stage ordering | Per-layer marginal ablation ladder | 2–4 |
| GraphRAG bug-pattern resources | Stage 3 item 2 (descoped to mechanism-level) | A/B: localization cost delta | 3 |
| eval_config percentile tuning | Stage 3 item 3 (corrected knobs) | Counterfactual replay → then paired run | 3 |
| Tool hierarchy doctrine | Stage 1–3 tool policy (amended) | Graph-off fork diagnostic | 1, 3 |
| Jev dev-time judge | Sprint 1 labeling (optional) | 20-task κ + calibration spot-check | 1 |
| Evidence tiers + receipts | Everywhere (rule 6) | Sprint-5 claims audit | 5 |
| Host commitments tracker | Canary suite + Wednesday sweep | Canary re-probe after each deploy | all |

---

## 4. Whitepaper brainstorm — next-draft ideas

Context from the paper-track intel: 3,000-word cap; five equal-weight criteria (Novelty, Quality, Relevance, Verifiability, Clarity); two entries max; judge roster skews graph-ML (Perozzi, Rózemberczki, Galkin) + SE testing (Hemmati); ties broken by earliest entry; stub already scheduled Sprint 1.

### 4.1 Entry A candidates (Best Paper, $15K) — pick one spine

1. **"Exception classes as search-space compression"** (recommended spine — this is Task 2's math): formalize issue classification as entropy reduction over the root-cause hypothesis space; show the fault-interaction taxonomy (independence/masking/synergy/cascading) applied to a SWE benchmark; the httpx_3672 traps as a worked example of *oracle asymmetry* (a masking variant nobody has named for agentic SWE); paired Config 1/2/3 results by fault-interaction class. Novelty: nobody has reported per-interaction-class behavior of small-model SWE agents. Deliverable 04 contains the full draft material.
2. **"What actually breaks small-model SWE agents"** (the reliability-taxonomy paper): harness-quirk measurements (escaping 22/62/0%, KV math, thinking-drop 0.35×/1.1×) + failure codebook shifts. Strong Verifiability; weaker Quality (some findings are harness-specific — frame each as a general principle).
3. **The efficiency ladder**: marginal turn-cost and pass-rate delta per intelligence layer (prompts → scripts → resources → adapter). Clean, honest, and the ablation data falls out of the plan for free; weaker Novelty alone — best as a section of option 1.

### 4.2 Entry B candidates (Best New Resource, $10K)

1. **The labeled taxonomy + graph-keyed dataset** (recommended): 129 tasks × (bug_category, complexity_tier, multi_bug, root_cause_file/symbol verified against graph node ids, fix_shape_type) + inter-rater κ + the dossier's Category-B analyses (per-repo graph structural table; 12×12 intra/inter-category embedding cosine heatmap; precision@k of `search_similar_code`). The heatmap is a finding about the *dataset itself* — publishable regardless of BCF's leaderboard result, and catnip for this panel.
2. **The gradability-audit toolkit**: corrected wheel/sandbox recipe + dead-task enumeration + CV/LB calibration method. High utility to every competitor; slightly less graph-flavored.

### 4.3 Ideas to deliberately NOT spend words on

- The retracted 8/20/32/45% projections and any per-phase score forecast (receipts only).
- Multi-agent architecture claims until the A4 ablation lands (Cognition's warning applies; a negative result is worth one honest paragraph, not a section).
- Jev (dev-time tooling, off-topic for the submission's science; one sentence in methodology at most).
- Repo-specific exploit knowledge (doesn't transfer; the hosts said hidden repos are private).

### 4.4 Structural notes for the 3,000-word budget

- One figure earns its keep only if it carries a measured number: candidates = embedding heatmap (Entry B), fault-interaction-class × pass-rate table (Entry A), per-layer efficiency ladder (Entry A).
- Verifiability criterion → every number carries a receipt ID (B1); methodology section gets the paired-eval protocol verbatim.
- Non-archival + arXiv-parallel is allowed — write once, submit twice.

---

*Task 2 (the mathematical flesh-out of the exception-class idea, fault interference/masking formalization, and the prior-research survey) follows in Deliverable 04.*


---

<!-- ====================================================================== -->
<!-- FILE: Gemma4-04-BCF-Math-and-Prior-Research.md -->
<!-- ====================================================================== -->

# Deliverable 04 — The Math of BCF: Exception Classes, Fault Interference & Masking, Chained Fixes — Whitepaper Draft Material + Prior Research Survey

**Compiled:** 2026-10-02 · **Task 2 of 2** · Companion: Deliverable 03 (document review)
**Evidence discipline:** all formal claims below are *models and pre-registered predictions* (tier H/D in the B1 scheme) until the Sprint-1–3 measurements land. The httpx_3672 facts used as the worked example are [V]-verified per the simulation doc's §9 reproduction appendix.

---

## PART 1 — What mathematical phenomena your statement actually describes

Your statement unpacks into **four distinct, named mathematical phenomena**, each with an established literature. Naming them precisely is itself valuable for the paper — it converts a design intuition into a set of citable, falsifiable claims.

### 1.1 "Classifying errors into exception classes limits the search space" → **information-theoretic search compression (entropy decomposition / hierarchical hypothesis testing)**

Let the root-cause hypothesis space be the set S of candidate edit sites (symbol-level: N ≈ thousands of graph nodes; e.g., 4,263 nodes in the fastapi_15661 graph). A naive agent explores S under a near-uniform prior: expected localization cost ≈ N/2 probes.

A classifier C : issue text → c ∈ {1..K} partitions S into per-class candidate sets with conditional distribution p(s|c) concentrated on n_c ≪ N sites. By Shannon's **grouping axiom**:

```
H(S) = H(C) + Σ_c p(c)·H(S|c)
```

so the mutual information I(S;C) = H(S) − H(S|C) is exactly the search uncertainty the classifier removes. Localization cost drops from ~N/2 to ~Σ_c p(c)·n_c/2 — a compression factor of roughly **2^{I(S;C)}** when distributions are near-uniform within classes. This is the same principle that makes Agentless's file→element→line hierarchical localization work, and it is why your Phase-1a gate belongs in a deterministic skill script: the information gain is only real if the routing decision is reliable and cheap.

### 1.2 "Number and fidelity of exception categories" → **an optimal-granularity tradeoff (bias–variance / rate–distortion analog)**

Write expected localization cost as a function of class count K and classifier error rate ε(K):

```
E(K) = (1 − ε(K)) · Σ_c p_c · n_c(K)/2  +  ε(K) · (n_wrong/2 + W)
```

where W is the penalty for searching the wrong partition first (re-routing cost + burned budget). Increasing K shrinks each n_c (finer partitions, less in-class search) but raises ε(K) (fewer labeled examples per class, vaguer boundaries — your `human_override` rate per category is the empirical proxy for this). E(K) is therefore U-shaped, and **K\*** sits at the knee. Your intuition that "speed and effectiveness depend on the number and fidelity of the exception categories" is precisely ∂E/∂K = 0. This gives the paper a concrete, measurable optimization: fit ε(K) and n_c(K) from the 129-task taxonomy and report K\* rather than asserting a taxonomy size.

### 1.3 "Fault interference and fault masking" → **fault-interaction theory + testability models (PIE/RIP) + coincidental correctness + coupling-effect failure**

These are all named, studied phenomena:

- **Fault interaction.** DiGiuseppe & Jones classify multi-fault behavior into four types — *independence, synergy (more failures than single-fault sum), obfuscation (fewer), masking*; Debroy & Wong gave the first empirical analysis of fault masking (a fault's failing tests lose association with it because another fault dominates). The recent MFAPR foundations paper tabulates exactly the four-way taxonomy (independence / masking / synergy / cascading) with per-type impact on localization, oracle clarity, and repair order.
- **Testability math.** Voas's **PIE model** (and Ammann & Offutt's RIP variant): a test reveals a fault only if the faulty code is *executed/reached*, the state is *infected*, and the infection *propagates* to observable output. Reveal probability R(f) ≈ P(exec)·P(infect)·P(propagate). **Masking is a propagation failure induced by another fault**: R(f_i | f_j present) < R(f_i | f_j fixed). This gives masking a formal handle instead of a metaphor.
- **Coincidental correctness** (Masri et al.; measured at scale on Defects4J): a fault executes yet tests pass — the dual failure mode, where the oracle is blind to a real fault. httpx_3672's Trap 3 (the no-parens `self._parser.complete` at `_server.py:92`) is exactly this: reachable, infected, never propagated to any test.
- **Coupling effect** (DeMillo–Lipton–Sayward; Offutt's empirical confirmations; How Tai Wah's probabilistic analysis): tests that detect simple faults usually detect the complex faults coupled to them. **Fault masking is precisely where coupling fails** — which is why single-fault tooling (and naive agents) silently break on multi-fault tasks.

### 1.4 "Multi-step, chained issues" → **cause-effect chains + dependency DAGs + topological fix ordering**

Zeller's delta-debugging work formalized the **cause-effect chain**: root cause → state infection → … → observed failure, isolable by systematic narrowing. For repair, the chain direction reverses into a **fix-dependency DAG**: some fixes must land before others are even *testable* (httpx_3672: the graded tests call `p.reset()`, which does not exist until the rename lands — the rename is the DAG root). A naive agent that fixes in discovery order pays O(k²) pairwise-conflict exploration on k chained faults (each wrong order produces a confusing test signal that must be re-diagnosed); a spec-first topological decomposition pays O(k + E). This is the compendium's doc-02 turn model, now with its citation anchors.

### 1.5 The genuinely new piece: **oracle asymmetry**

One phenomenon in your data is *not* well-named in the prior literature, and this is your Novelty claim. httpx_3672's Trap 1 is not classical masking (fault hides fault under one oracle) — it is **two oracles disagreeing**: the *visible* suite still calls `p.complete()`; the *graded* suite calls `p.reset()`. The correct fix makes the visible oracle go red. Formally, the agent observes V_local(patch) but is scored by V_hidden(patch), and on rename/refactor tasks P(V_local = fail | patch correct) is high — the local signal has a **likelihood ratio near or below 1** (non-informative or anti-informative). The BCF doctrine "trust the spec over local red" is a Bayesian decision rule: when LR ≈ 1, the posterior is dominated by the prior (the issue-text contract). Call it **oracle asymmetry**; it is an artifact of SWE-bench-style benchmark construction (test_patch withheld), so it will recur in every benchmark of this family — that is your Quality-criterion generalization argument.

---

## PART 2 — Whitepaper draft material (drop-in sections)

*Target: Entry A (Best Paper). Section lengths sized for the 3,000-word cap. All numbers are placeholders pending receipts.*

### §Model (≈500 words)

**Definition 1 (Task).** A task is a tuple (repo at base_commit, issue text I, hidden test patch T_h). The agent observes (repo, I) and visible tests T_v; scoring applies T_h.

**Definition 2 (Search space).** S = graph nodes of the repo snapshot; |S| = N. A *localization* is an ordered probe sequence over S; cost = probes (tool calls).

**Definition 3 (Exception classes).** A classifier C maps I to one of K mechanism classes (crash / contract / edge-case-logic / feature / compat-refactor / …), each carrying a candidate generator g_c(I) → S_c ⊆ S with |S_c| = n_c, plus a fix-shape prior and a validation-plan template.

**Proposition 1 (compression).** Expected localization cost under C is E_C = Σ p_c·n_c/2 + ε(K)·(n_wrong/2 + W), versus N/2 unclassified; the gain factor ≈ 2^{I(S;C)} under within-class uniformity, degraded by ε(K). *Proof sketch:* grouping axiom + linear-scan expectation. *Measurement:* report realized probes-per-localization (ledger `localization_calls`) per class vs the unclassified baseline (Config 1).

**Definition 4 (Interaction types).** For fault set F = {f_1..f_k} and oracle T: independence (R_i unaffected by F\{f_i}), masking (R_i(T) ↓ while f_j unfixed), synergy (failure only under combination), cascading (f_j's fix activates observability of f_i — repair-order-critical).

**Definition 5 (Oracle asymmetry).** Benchmarks withhold T_h. A rename/refactor task has V_v(fix_correct) = fail w.h.p.; the likelihood ratio LR = P(V_v | correct)/P(V_v | incorrect) ≈ 1, so decision weight must shift to the spec prior. BCF encodes this as an explicit `validation_plan` field ("expected local red"), journaled before the edit, making the correct fix unrevertable-by-accident.

### §Mechanism (≈400 words) — the BCF loop restated in the model's vocabulary

Phase 1a (classify, deterministic script) → Phase 1b (spec: per-fault hypothesis, target symbol verified against graph ids, fix_shape, depends_on; fix_order = topological sort) → Phase 2 (graph-first localization within S_c: neighbor-first, symbol-language queries) → Phase 3 (edits in fix_order, one fault per batch) → Phase 4 (gates G1–G6; G5 immediate revert; journal carries the oracle-asymmetry expectation). Rescue = restart-with-breadcrumbs on deterministic trips (cf. FailFast-RestartSmart; LivePlan's non-LLM monitor).

### §Worked example (≈350 words) — httpx_3672

Five sub-faults; the four traps map one-to-one onto the model: Trap 1 = oracle asymmetry (rename correct under T_h, red under T_v); Trap 2 = mirrored sync/async trees (duplication-induced interference surface: 239 `ahttpx.*` of 740 nodes); Trap 3 = coincidental-correctness-style latent fault at the call site (executed, infected, never propagated — invisible to T_h as well); Trap 4 = real but ungraded faults (score scope ≠ gold scope). The rename is the cascading root: T_h is unexecutable until `reset()` exists. Config 1's modal failure (revert of the correct fix) is a direct prediction of Definition 5 under a trust-the-local-oracle policy; Config 3's survival is the spec-prior decision rule working. **Pre-registered prediction #9:** `test_misread` failure rate is higher for Config 1 than Config 3 on the compat_or_refactor slice.

### §Experiments (≈450 words) — each claim → measurement

| Claim | Experiment | Metric (ledger field) |
|---|---|---|
| Compression (Prop. 1) | C1 vs C3 paired, 30-task dev slice, ≥2 seeds | `localization_calls`, `turn_first_graph` |
| Optimal K (Eq. E(K)) | taxonomy fit: ε(K) from classifier-vs-labels; n_c(K) from labeled root_cause_symbol | classifier accuracy; overrides/category |
| Interaction-class effects | slice paired results by interaction type | pass rate per class, CI |
| Oracle asymmetry | prediction #9 + revert-rate on rename tasks | `test_misread`, `edits_not_in_final` |
| Topological ordering | multi_bug slice: fix_order violations vs outcome | `fix_order_error` |
| Graph grounding (judge-aligned) | embedding heatmap; precision@k of `search_similar_code` with symbol-language queries | Category-B analyses |

### §Related work (≈600 words) — condensed from Part 3 below.

### §Limitations (≈200 words)

Single model variant; 129-task public set with 12 locally-dead tasks; oracle asymmetry measured only where gold patches are visible; classifier ε(K) estimated on public tasks while hidden repos are private (transfer risk); ledger metrics measure probes, not wall-clock.

---

## PART 3 — Prior research survey

### 3.1 Solving GitHub-repo issues under fault interference / masking — what exists

**Classical multi-fault diagnosis.** Spectrum-based fault localization (SBFL — Tarantula, Ochiai) was built on a single-fault assumption and degrades with multiple faults; Abreu, Zoeteweij & van Gemund's **Barinel** extended it to multiple faults by combining spectra with model-based diagnosis — conflicts → minimal hitting sets, Bayesian ranking P(Δ|E) — and "Simultaneous debugging of software faults" (JSS 2011). Systematic review: Zakari et al., "Multiple fault localization of software programs" (IST 2020). **Relevance:** BCF's per-fault spec entries + fix_order are an agentic analog of MBD's multiple-diagnosis handling; Barinel's hitting-set framing is the closest classical formalism to "minimum path decomposition."

**Fault interaction taxonomies.** Debroy & Wong: first empirical fault-masking analysis. DiGiuseppe & Jones: four interaction types (independence/synergy/obfuscation/masking). The MFAPR foundations paper (2025/26, "Foundations and Challenges of Multi-Fault Program Repair") tabulates independence/masking/synergy/cascading against localization difficulty, oracle clarity, and repair order — *its Table 3 is nearly a skeleton for your paper's model section*; cite it and differentiate: their setting is APR with full test suites; yours is agentic repair with a withheld oracle (oracle asymmetry is your delta).

**Testability & oracle blindness.** Voas PIE; Ammann & Offutt RIP (reachability–infection–propagation–reveal); Masri et al. on coincidental correctness, incl. CC prevalence on Defects4J. **Relevance:** masking and latent faults get quantitative handles (reveal-probability products); Trap 3-style faults are CC instances in real library code.

**Coupling effect.** DeMillo, Lipton & Sayward (1978) + competent-programmer hypothesis; Offutt (1989/1992) empirical support; How Tai Wah's probabilistic analysis (coupling real but infrequent); Just et al. (FSE 2014) on mutant–real-fault coupling. **Relevance:** the coupling effect is the optimistic theorem — masking is its failure mode. One sentence in the paper: "BCF targets the regime where the coupling effect fails."

**Combinatorial interaction testing.** Kuhn et al. (NIST): the *Interaction Rule* — most failures trace to 1–2-way interactions, max 4–6 across six studies (incl. 15 years of FDA recall data). **Relevance:** priors over k (fault count per task): expect mostly k = 1–2, few k ≥ 3 — which sizes your spec schema (`maxItems: 6` is empirically sane) and the complexity tiers.

**Automated cause isolation.** Zeller: delta debugging ("Yesterday my program worked…") and cause-effect chains (FSE 2002, SIGSOFT Distinguished Paper). **Relevance:** the chained-issue formalism and the minimal-difference ethos behind "minimum viable change per validation step."

**LLM agents for issue resolution.** Agentless (Xia et al. 2024): three-phase pipeline with hierarchical file→element→line localization — the deployed proof that search-space compression beats end-to-end wandering at fixed model quality. AutoCodeRover (Zhang et al. 2024): structure-aware search APIs + optional SBFL to sharpen context. LocAgent / RepoGraph / KGCompass / OrcaLoca: graph-based localization — direct precedent for your graph-first Phase 2 (and evidence the panel's own subfield transfers). RGFL (2026): reasoning-guided reranking lifts element-level exact-match 36%→69% on SWE-bench Verified with compounding repair gains — your `write_spec` hypothesis step is a structured cousin. SWE-PRM (inference-time course correction), LivePlan (non-LLM rule monitor + advisor), FailFast-RestartSmart (fresh rollout restart) — the rescue-mechanism lineage (compendium A2.3). Caveat to cite: OpenAI's 2026 retirement of SWE-bench Verified (contamination + 59.4% flawed-failure audit) motivates this competition's clean, gold-validated hidden set — and your paired-eval protocol.

### 3.2 Identifying scenarios where fault interference can occur — what exists

| Signal family | Literature anchor | Actionable in this competition |
|---|---|---|
| **Dependence structure** (call/data dependence → shared fate) | Program slicing (Weiser); change-impact analysis (Bohner & Arnold); dependence graphs | The provided AST call graphs: high fan-in hubs / betweenness-central nodes are interference junctions (dossier Analysis 1: centrality table per repo) |
| **t-way interaction surfaces** | Kuhn's Interaction Rule; combinatorial test suites | Features touching ≥2 interacting concerns (e.g., parameter parsing + media type — fastapi_11194) are 2-way fault candidates; spec should probe combinations |
| **Duplicated/mirrored code** | Clone detection literature; clone-and-own maintenance bugs | Dual-tree detection via graph node prefixes (httpx/ahttpx); mirrored edits are a masking-adjacent failure (half-tree fixes) — BCF already encodes this |
| **Error-handling & cleanup paths** | Coverage/PIE: rarely-executed paths have low P(exec) → latent faults | `_server.py` error paths, `__exit__`/cleanup, signal handlers: spec templates should enumerate them as latent-fault candidates |
| **Oracle gaps** | Coincidental correctness; mutation testing (undetected mutants ≈ unpropagated faults) | Compare visible-suite coverage of spec targets; where coverage is absent, expect CC-style latent faults and flag `visible_tests_only` |
| **State/lifecycle coupling** | Cause-effect chains (Zeller); state-machine testing | Redirect history, connection keep-alive, stream lifecycle — shared mutable state across calls is where cascading fixes cluster |

**The bridge sentence for the paper:** the competition's own graphs/embeddings make three of these signal families (dependence, duplication, hubs) *computable inside the agent's sandbox* — interference-surface detection is not just analysis for the paper, it is a runtime capability competitors are underusing.

### 3.3 What to cite where (map)

| Paper section | Anchor citations |
|---|---|
| Model: compression | Shannon grouping; Agentless; RGFL |
| Model: interaction types | Debroy & Wong; DiGiuseppe & Jones; MFAPR |
| Model: testability | Voas PIE; Ammann & Offutt RIP; Masri CC |
| Model: chaining | Zeller cause-effect chains; Kuhn Interaction Rule |
| Differentiation | MFAPR (full-oracle APR) vs BCF (withheld-oracle agentic) → oracle asymmetry |
| Rescue/gates | SWE-PRM; LivePlan; FailFast-RestartSmart; circuit breaker (Nygard) |
| Benchmark hygiene | OpenAI SWE-bench Verified retirement; competition's gold-validated pipeline |

---

## PART 4 — Where this plugs into the master plan

1. **Sprint 1 (taxonomy):** label `interaction_type` per task alongside the existing codebook fields — one extra column, unlocks the per-class pass-rate table and prediction #9.
2. **Sprint 1 (classifier):** log classifier confidence per class; ε(K) estimation needs it.
3. **Sprint 2 (paired runs):** add `revert_of_correct_fix` to the failure codebook (oracle-asymmetry metric).
4. **Sprint 3 (graph analyses):** the three Category-B analyses double as Part 3.2's runtime-signal validation.
5. **Paper assembly (Sprint 5–6):** Part 2 above is the draft skeleton; every placeholder gets a receipt ID in the claims audit.

*Bottom line: your statement was three real phenomena and one new one. Classification-compression, fault interaction/masking, and chained repairs all have literatures to stand on; oracle asymmetry is the piece the literature does not have a name for — that is the paper.*


---

<!-- ====================================================================== -->
<!-- FILE: Gemma4-05-Metadata-Wishlist-Decision-Spec.md -->
<!-- ====================================================================== -->

# Deliverable 05 — Reverse-Engineering BCF: The Decision-Driven Metadata Collection Spec

**Compiled:** 2026-10-02 · **Owner:** Cooly
**Premise:** You asked the right question in reverse order. Most competitors will collect data and then wonder what to do with it. This document starts from the **decisions** a winning build forces on you, derives the exact metadata that resolves each one to high confidence, and only then specifies collection machinery. If a data item doesn't move a decision, it isn't on the list.
**Companions:** 01 (roadmap), 02 (sprints), 03 (doc review), 04 (math + prior research).

---

## 0. The decision inventory — what a winning build must decide

Every strategic fork in the campaign, stated as a decision with its evidence requirement. This is the reverse-engineered skeleton of "the most intelligent and efficient coding agent": each decision, made correctly, is worth a measurable number of resolved tasks.

| # | Decision | When it hits | Cost of getting it wrong | Confidence standard |
|---|---|---|---|---|
| D1 | **Spec-first or free-form?** (Config 3 vs 1) | Sprint 2 | Building the whole framework on a dud | Paired dev runs, ≥2 seeds, CI excludes 0 |
| D2 | **Which exception classes, and how many (K\*)?** | Sprint 1–2 | Taxonomy too coarse (no compression) or too fine (misrouting) | ε(K) and n_c(K) fitted from data, not guessed |
| D3 | **Graph-first vs grep-first localization?** | Sprint 3 | Wasting the competition's differentiator | Graph-off fork ablation; `localization_calls` delta |
| D4 | **Per-tier budgets: timeout/turns/tool-calls per complexity tier?** | Sprint 3 | Burning the 12 h budget on hopeless tasks; or killing would-be passes | Counterfactual replay, then paired run |
| D5 | **Thinking on/off, temperature, max_output_tokens?** | Sprint 2 (after host patch) | Locking sampling.yaml against a buggy harness | Re-probe after patch deploy; paired runs |
| D6 | **Flat agent vs sub-agent tree (A4)?** | Sprint 3 | 15× token blowup for nothing (Anthropic's number, wrong regime) | Three-arm handoff ablation T0/T1/T2 |
| D7 | **Adapters: ship or kill?** | Sprint 4 | A submission slot on a broken scorer path; or leaving +5% on the table | Four canary probes on the *scorer*, then paired held-out A/B |
| D8 | **Which single artifact is the final submission?** | Sprint 5–6 | Choosing on LB feel under ±0.04 variance | Paired held-out eval, receipts, pre-registered selection rule |
| D9 | **Per-repo doctrine in prompts/skills: how much, how specific?** | Sprint 3 | Overfitting to fastapi/rich while hidden repos are private | Transfer test: hold out one repo's tasks entirely |
| D10 | **Where does the failure mass actually live?** (which failure code to attack next) | Continuous | Polishing what isn't broken | Failure-codebook distribution, updated per run |
| D11 | **Journal/rescue on or off, and with what trip thresholds?** | Sprint 2–3 | Circuit breakers that trip on healthy runs, or never trip | Ablations A3/A2 with `rescue_trigger_rate` / `rescue_recovery_rate` |
| D12 | **Paper claims: what survives the claims audit?** | Sprint 5–6 | Retracted-number embarrassment (the dossier's own history) | Every number has a receipt ID or a derivation |

The rest of this document is the metadata that answers D1–D12, organized by source layer, each item tagged: **decision served · collection cost · priority (P0 = collect from Day 1, P1 = Sprint 1–2, P2 = opportunistic)**.

---

## 1. Layer A — Static task metadata (mine the 129 tasks before any agent runs)

**Source:** `tasks.jsonl` (patch + test_patch visible in training), snapshots, graphs, embeddings. **Cost:** days of AUX-2 CPU + analysis time, zero GPU. **This is the highest leverage-per-dollar data in the campaign** — it requires no agent runs and it calibrates everything downstream.

### A1. The taxonomy row (one per task) — serves D2, D9, D10, D12 · P0

Already specified in the compendium (B5.2) and dossier Category A; extended here with the Task-2 math fields:

| Field | How to obtain | Decision it feeds |
|---|---|---|
| `instance_id`, `repo`, `base_commit` | tasks.jsonl | stratification |
| `task_type` (bug_fix / feature / compat_or_refactor) | issue text + patch shape | D2, D9 |
| `bug_category` (frozen codebook, 8–12 mechanism classes + `other`) | open coding, human-verified | **D2 (K\*)** |
| `complexity_tier` 1–5 (objective rubric: files/hunks/lines) | computed from gold patch stats | D4 (budget tiers) |
| `multi_bug` (bool) + `fault_count` k | test_patch hunk count + patch file spread | D2, paper model |
| **`interaction_type`** (independence / masking / synergy / cascading / oracle_asymmetry) | analysis of patch vs test_patch structure (see A3) | **paper's core table; D10** |
| `root_cause_file`, `root_cause_symbol` (must verify against graph node ids → `symbol_in_graph`) | first diff hunk → FQN | D3, precision@k ground truth |
| `fix_shape_type` (delete/replace/guard_add/check_add/iterator_or_logic_rewrite/new_code/other) | patch diff reading | D9, spec schema validation |
| `gold_files`, `gold_lines_changed`, `gold_hunks` | `git apply --stat` on patch | complexity rubric, D4 |
| `graded_scope_files` (files touched by test_patch) | test_patch paths | **oracle asymmetry detection** |
| `human_override` + `label_confidence` | labeling process | ε(K) estimation, κ |
| `dual_tree` (bool — mirrored implementations, e.g. httpx/ahttpx) | graph node prefix analysis | Trap-2-style doctrine |

### A2. Gold-patch structure statistics — serves D4, D10 · P0

For all 129 tasks, compute: files changed, lines changed, hunks, test files vs lib files ratio, whether patch touches >1 module, whether test_patch call sites exist in visible tests (rename detection: does test_patch reference a symbol that does **not exist** at base_commit? → automatic `oracle_asymmetry` flag). Output: distribution table. This single analysis tells you what fraction of the benchmark punishes trust-the-local-tests agents — the size of the prize for BCF's spec-prior doctrine.

### A3. Oracle-asymmetry detector — serves the paper's headline · P0

Algorithmic, cheap, and unique: for each task, apply gold patch + test_patch to the snapshot on AUX 2, then run the **visible** test suite. Count tasks where visible suite goes red under the *correct* fix (httpx_3672 pattern). This is a number nobody else has: **"N% of tasks punish oracle-trusting agents."** It is one script and one overnight grading-farm run.

### A4. Graph/embedding metadata — serves D3, paper Entry B · P1

Per repo/commit: node/edge counts, degree distribution, betweenness top-10 (interference junctions), node-size distribution (>5k/>20k/>100k char nodes = context-killers; the intel's 246-call distribution replicated per repo), `calls`-edge locality (intra-class vs cross-file — the httpx calibration), embedding intra/inter-category cosine matrix (the 12×12 heatmap), and `search_similar_code` precision@1/3/5 against `root_cause_symbol` ground truth using symbol-language vs prose queries. **The prose-vs-symbol query comparison is itself a finding.**

### A5. Environment/gradability metadata — serves D8, CV honesty · P0

The dead-task map (12 known locally-dead), wheel-gap list (typing_inspection, inline-snapshot, dirty-equals, ujson/orjson, python-multipart), starlette per-commit pins, and per-task `local_gradeable` (bool). Without this column, every CV number you ever compute is silently biased — this is the field that prevents the dossier-style self-deception loop.

---

## 2. Layer B — Runtime trajectory telemetry (what the agent actually did)

**Source:** ledger.jsonl per run (B5.3 schema), extended. **Cost:** near-zero if instrumented before the first run (B2 rule). **Serves D1–D8, D10, D11.**

### B1. Per-turn events — P0 (already specified; these extensions are the wish-list delta)

Beyond the compendium schema, add:

| Field | Why a top-tier builder wants it |
|---|---|
| `prompt_tokens` / `context_fill_pct` per turn | Context pressure curve: when do episodes die of ContextWindowExceeded vs budget? Determines compaction config and the search_similar_code guardrail |
| `tool_output_chars` per call | Finds the blowup tools empirically (don't trust the intel's distribution — measure your own) |
| `edit_file.verified_by_reread` (bool) + `edit_file.first_try_success` | Escaping-failure rate *on your config*; decides how aggressive the defensive edit doctrine must be |
| `thought_present_in_next_prompt` (bool) | Q3 thinking-drop detector on *your* runs, per host-patch boundary |
| `action_digest` (normalized action string) | Loop/repeat detection — `repeat_action_rate` is the breadcrumb metric |
| `budget_remaining_at_submit` | The efficiency headline: how much of the 12 h did a win actually need? |
| `phase_entry_turn` per phase | Where do wins spend turns vs where do losses spend turns? (The dossier's "tool calls per failed task > 45 = bloat" made measurable) |

### B2. Per-task outcome rows (results.csv) — P0

The compendium's row, plus: `failure_code` (frozen codebook: `wrong_file_localized`, `root_cause_order_error`, `exploratory_edit_loop`, `budget_exhausted_exploring`, `test_misread`, `patch_malformed`, **`revert_of_correct_fix`**, `escaping_failure`, `context_overflow`, `none_of_these`), `interaction_type` (joined from Layer A), `spec_valid`, `spec_score`, `fix_order_error`, `edits_not_in_final`, `gold_file_hit`, `graded_scope_aware` (bool), `rescue_triggered`, `rescue_recovered`, `verdict`.

### B3. Gate vectors — P1

Every G0–G6 evaluation logged (pass/fail + failing test names, bounded excerpt). This is what makes the gate ablation (which gates actually earn their keep) a query instead of a re-run.

### B4. Classifier telemetry — P1 · serves D2

Per task: predicted class, confidence, the signals that fired (issue-text features), final routing, and (post-hoc) correctness vs taxonomy label. This builds ε(K) — the misrouting-rate curve that turns "number and fidelity of categories" from intuition into an optimization with a computable K\*.

### B5. Handoff-packet telemetry (only if A4 pilot runs) — P2 · serves D6

Packet size in tokens vs full-transcript size; downstream-agent first-action correctness (did the receiving agent's first 3 actions make sense given the packet?); the T0/T1/T2 comparison data.

---

## 3. Layer C — Harness & environment truth (the scorer is part of the system)

**Serves D5, D7, D8. P0 for canaries; P1 ongoing.**

| Item | Mechanism | Decision |
|---|---|---|
| Canary results Q1a/Q1b/Q2/Q3/Q7, versioned per wheelhouse/harness version | Canary suite re-run after every host deploy announcement | D5, D7 — never tune against an unverified harness behavior |
| KV headroom measurement (tokens available with/without adapters, per config) | vLLM logs locally + scorer observation | D7 (rank ≤ 64 sizing) |
| Context compaction behavior (when it fires, what's lost) | Instrumented runs at varying `context_fill_pct` | Prompt design, journal sizing |
| Queue times, run times, quota deduction per submission | AUX 1 submission ledger | Submission calendar (the real budget) |
| Host-commitments tracker state (per Wednesday sweep) | Forum sweep | Gate timing for Sprints 2/4 |

---

## 4. Layer D — Submission outcomes & calibration (closing the CV↔LB loop)

**Serves D8, D12. P0 from Sub #1.**

Per submission: config hash, receipt IDs of the supporting runs, predicted score range (pre-registered, decision rule 1), actual LB score, per-task verdicts if obtainable, CV score on the same tasks, **dead-task-corrected CV**, delta, and the harness/wheelhouse version in force. Six to eight rows of this table across the campaign is what converts "local scores are a relative signal" (dossier wisdom) into a *measured calibration curve* — and it's the only way to know whether a Sprint-3 improvement that added +0.03 locally is real or inside noise (±0.04 run variance).

---

## 5. Layer E — Paper-grade receipts (B1 discipline)

**Serves D12. P0.** One receipt per experiment run (config hash, harness version, model, adapter, seed, split, task list, metrics, timestamps). Plus the claims-audit table: every paper number → receipt ID or derivation formula. The dossier's retracted-claims ledger is the cautionary tale; this layer is the inoculation.

---

## 6. The wish list, ranked — if you could only watch ten numbers

Pretending instrumentation were scarce, this is the order I'd fight for:

1. **`failure_code` per failed task** (D10) — the single most decision-dense field; it tells you what to build next, every week.
2. **Oracle-asymmetry rate of the benchmark** (A3) — sizes the prize your core doctrine captures; headline paper number.
3. **`localization_calls` + `turn_first_graph` per task** (D3) — the compression claim's direct measurement.
4. **`revert_of_correct_fix` events** (paper + doctrine) — the cost of trusting local oracles, in incidents.
5. **Classifier accuracy + per-class overrides** (D2) — drives K\*.
6. **`context_fill_pct` trajectory per episode** (D5, prompt sizing) — where episodes actually die.
7. **`edit_file.first_try_success` rate** (escaping doctrine) — tells you how much defensive overhead to pay.
8. **Time-to-failure vs time-to-success distributions** (D4) — the budget knobs' fitting data.
9. **`rescue_trigger_rate` / `rescue_recovery_rate`** (D11) — whether the circuit breaker earns its complexity.
10. **CV↔LB paired deltas per submission** (D8) — the calibration curve that protects the final selection from variance.

---

## 7. Decision rules bound to the data (pre-registered)

So the data actually decides, write the rule before the data exists:

| If the data shows… | Then… |
|---|---|
| Oracle-asymmetry rate ≥ 10% of tasks | Spec-prior doctrine is a headline mechanism; give it a paper section and prompt prominence |
| `test_misread` drops to ≈0 in Config 3 vs Config 1 | Prediction #9 confirmed → paper result; keep doctrine |
| Classifier accuracy < 70% on dev | Reduce K (merge classes) before any other tuning — ε(K) dominates |
| Graph-off fork shows no `localization_calls` delta | Prompting isn't directing graph use — fix prompts before building more graph machinery |
| T1 ≈ T0 on pass rate at <⅓ tokens | Ship structured handoffs; else stay flat (Cognition regime) |
| `rescue_recovery_rate` < 10% with `rescue_trigger_rate` > 30% | Breakers trip on healthy runs — raise thresholds or cut rescue |
| Adapter A/B < +2 tasks or CI includes 0 | Final submission is no-adapter; adapters go to the paper as a negative/boundary result |
| CV↔LB delta inconsistent across submissions | Trust paired held-out only; LB used for confirmation, never selection |

---

## 8. Implementation notes (sprint-mapped)

- **Sprint 1:** Layer A in full (AUX 2 + AUX 1; Jev optional first-pass with κ check); A3's asymmetry detector is a one-script overnight grading-farm run; Layer B instrumentation merged before the first harness run (B2's iron rule); results.csv columns frozen.
- **Sprint 2:** B4 classifier telemetry live; gate vectors (B3) live with the gates themselves.
- **Sprint 3:** A4 analyses (dossier Category B) run on AUX 2; counterfactual budget replay uses Layer B fields.
- **Sprint 4:** Layer C KV measurements gate the adapter rank choice.
- **Sprint 5–6:** Layer D calibration table + Layer E claims audit drive final selection and paper assembly.

**Storage:** `tasks_meta.csv` (Layer A), `ledger.jsonl` (B), `harness_facts.json` (C, versioned), `submissions.csv` (D), `receipts/*.json` (E) — all under `\\MAIN\swe\experiments\`, mirrored nightly to AUX 2 HDD. Frozen after labeling: the taxonomy and the held-out split get `PreToolUse`-style protection (compendium B2.3) so nobody — human or agent — edits ground truth mid-campaign.

---

*The reverse-engineering conclusion: "the most intelligent and efficient coding agent" for this competition is not a bigger brain — it is a better-instrumented one. Every item above exists because a specific decision (D1–D12) is currently a guess, and each guess is worth tasks. Collect for decisions, decide by pre-registered rules, and the agent builds itself.*


---

<!-- ====================================================================== -->
<!-- FILE: Gemma4-06-Catalog-Review-Ranked-Resources.md -->
<!-- ====================================================================== -->

# Deliverable 06 — CoderProg Catalog Review: Ranked Resources for the BCF Gemma 4 Campaign

**Compiled:** 2026-10-02 · **Catalog:** `coderprog_catalog.json` — 3,130 items examined in full (2,719 books, 407 courses, 4 other)
**Question answered:** which of these materials are actually useful for *training / improving / testing* the BCF coding agent for a winning submission — ranked, scored, and justified against the master plan (Deliverables 01–05).

---

## 1. Verdict up front

**Yes — the catalog contains genuinely useful material, concentrated in five veins:** (1) agent architecture & reliability patterns, (2) LLM evaluation/evals methodology, (3) vLLM serving & inference optimization, (4) PEFT/RL post-training, (5) graphs/RAG for the knowledge-brain and the paper track. **The catalog's notable gap:** nothing on SWE-bench-style issue resolution, automated program repair, or fault localization specifically — the closest coverage is software-testing fundamentals. The gap confirms the whitepaper's positioning: your reading must come from the research literature (Deliverable 04), while these resources supply engineering craft.

## 2. Scoring rubric

Each resource scored 0–100 on four weighted criteria, assessed against the live decisions (D1–D12, Deliverable 05) and sprint schedule (Deliverable 02):

| Criterion | Weight | What it measures |
|---|---|---|
| **Decision leverage** | 40% | Does it move a live campaign decision (D1–D12) or a gated sprint task? |
| **Stack specificity** | 25% | Does it cover *our* stack (vLLM, QLoRA/PEFT, ADK-style tool agents, offline sandbox, graphs) rather than generic cloud/vendor tooling? |
| **Time-to-value** | 20% | Can it be absorbed and applied inside a 6-week sprint cadence? (Concise practical > encyclopedic theory) |
| **Paper-track value** | 15% | Does it strengthen the $35K paper entries (methodology, graphs, eval rigor, writing)? |

Tier bands: **S (85+)** read/apply immediately · **A (70–84)** targeted reading, specific chapters · **B (50–69)** reference/consult as needed · **C (<50)** marginal, skim only if time.

## 3. Ranked table

| Score | Resource | Type / Format / Year | Meta | Justification & where it plugs in |
|---|---|---|---|---|
| **95** | [Build GenAI Agents with OpenAI + vLLM](https://coderprog.com/build-genai-agents-with-openai-vllm/) | Book · EPUB · 2026 | 120 pp · ISBN 9789349174245 | **The single most stack-exact item in the catalog.** Portable agents with structured outputs, tool calling, vLLM serving, Docker deployment — the competition's literal runtime. Short (120 pp) = weekend absorption. Directly informs Day-0 vLLM bring-up, the tool-call plumbing assumptions behind Config 1–3, and the escaping/tool-serialization debugging (Q2). |
| **92** | [Hands-On LLM Serving and Optimization: Hosting LLMs at Scale](https://coderprog.com/hands-on-llm-serving-and-optimization/) | Book · PDF/EPUB · 2026 | 372 pp · ISBN 9798341621497 | KV-cache management, throughput/latency tradeoffs, memory budgeting — the exact physics of the LoRA KV-collapse bug (46k→7.6k tokens) and the 32k-context/12-hour budget game. Feeds D5/D7 and the Sprint-4 adapter rank-sizing decision. |
| **90** | [AI Evals in Practice: Testing, reliability, and quality for LLM systems in production](https://coderprog.com/ai-evals-in-practice/) | Book · PDF/EPUB · 2026 | 150 pp · ISBN 9781808817250 | Build a Python eval harness, calibrated judges, agent metrics, CI regression tests. This is the B5 ledger/Promptfoo layer described by people who do it professionally — serves D1–D12 measurement discipline and the paper's Verifiability criterion. Read before Sprint 1 ends. |
| **89** | [Systems Thinking for Agentic AI: A Software Architect's Guide to Building Reliable LLM and Agent Systems](https://coderprog.com/systems-thinking-for-agentic-ai/) | Book · EPUB · 2026 | 488 pp · ISBN 9798197120960 | "LLMs are powerful, but an LLM alone is not a system" — prompts, retrieval, tools, memory, orchestration as reliability engineering. Philosophically the closest book to BCF itself; expect vocabulary, patterns, and failure-mode framings that sharpen the framework and the paper's Related Work framing. |
| **88** | [Production Development with DeepSeek: ...LoRA, QLoRA, and Docker](https://coderprog.com/production-development-with-deepseek/) | Book · EPUB · 2026 | 284 pp · ISBN 978-9365891782 | The catalog's only LoRA/**QLoRA**-in-production title. Recipe patterns transfer to Gemma 4 QLoRA on the 5090 (rank sizing, QAT-aware training, Docker packaging). Gated behind G-S4a but read in Sprint 3 so Sprint 4 starts hot. Serves D7. |
| **87** | [A Hands-On Guide to Fine-Tuning Large Language Models with PyTorch and Hugging Face](https://coderprog.com/a-hands-on-guide-to-fine-tuning-large-language-models-with-pytorch-and-hugging-face/) | Book · PDF · 2026 (rev. Oct 2025) | 306 pp · ISBN 9798301961816 | Step-by-step PEFT on consumer hardware — the Sprint-4 training pipeline's base recipe (trajectory SFT on the 5090). Intermediate-level targeting matches "never trained an LLM before" exactly. Serves D7. |
| **85** | [Practical LLM Evaluation for Production Systems](https://coderprog.com/practical-lld-evaluation-for-production-systems/) | Book · PDF/EPUB · 2026 | 433 pp · ISBN 9781807423896 | Eval framework design across training and inference, agentic metrics. Deeper companion to AI Evals in Practice; consult for the paired-eval protocol and judge-calibration sections of the paper. |
| **84** | [AI Context Engineering: Master the Art of Context Engineering for LLMs](https://coderprog.com/ai-context-engineering-master-the-art-of-context-engineering-for-llms/) | Course · MP4 | — | Context is *the* scarce resource (32k window, uncapped tool outputs, compaction bugs). Directly serves the A4 handoff-packet decision (D6), journal sizing, and the events-compaction configuration. |
| **82** | [Building LLM Applications with DSPy: Replacing manual prompts with systematic optimization](https://coderprog.com/building-llm-applications-with-dspy/) | Book · EPUB · 2026 | 296 pp · ISBN 9781633435018 | Systematic prompt optimization as program, not vibes. Even if DSPy itself doesn't ship (offline sandbox), the *methodology* — prompt as optimizable artifact with metrics — upgrades the Sprint 2–3 prompt iteration loop and Promptfoo gate design. |
| **80** | [Agentic GraphRAG: Integrating Knowledge Graphs, Reasoning, and Agency](https://coderprog.com/agentic-graphrag/) | Book · EPUB · 2026 | 386 pp · ISBN 9798341623170 | The dossier's "GraphRAG brain" (Turn 12) done properly: KG + reasoning + agency. Directly informs the Sprint-3 bug-pattern knowledge base and `symbol_anchors` bridge. Judge-roster alignment (graph-ML panel) makes this paper fuel too. |
| **79** | [Advanced Retrieval-Augmented Generation: Bridging LLMs and Knowledge Graphs](https://coderprog.com/advanced-retrieval-augmented-generation/) | Book · PDF/EPUB · 2026 | 560 pp · ISBN 9781394374687 | IR-foundations-to-KG-RAG reference. Denser than Agentic GraphRAG; consult for the retrieval-quality mechanics behind precision@k analysis (Entry B) and embedding-space reasoning. |
| **78** | [Reinforcement Learning from Human Feedback: Alignment and post-training of LLMs](https://coderprog.com/reinforcement-learning-from-human-feedback/) (Nathan Lambert) | Book · PDF/EPUB · 2026 | 312 pp · ISBN 9781633434301 | The authoritative post-training text by a leading practitioner. Background for any RL-flavored Sprint-4 work and for the paper's tuning-and-optimization framing. Read selectively (post-training chapters). |
| **76** | [A Practical Guide to Reinforcement Learning from Human Feedback](https://coderprog.com/a-practical-guide-to-reinforcement-learning-from-human-feedback/) | Book · PDF/EPUB · 2026 | 399 pp · ISBN 9781835880500 | The practice-oriented RLHF companion (preference methods, implementation). Secondary to Lambert; use for implementation details if the RL track activates. |
| **75** | [Agentic Architectural Patterns for Building Multi-Agent Systems](https://coderprog.com/agentic-architectural-patterns-for-building-multi-agent-systems/) | Book · PDF/EPUB · 2026 | 576 pp · ISBN 978-1806029570 | Pattern catalog for single/multi-agent systems — the design-space map for the D6 (flat vs sub-agent) decision. Input to the A4 ablation design, not a substitute for it (Cognition's warning stands until *your* data speaks). |
| **74** | [AI Agents: The Definitive Guide: Design, Deployment, and Evaluation for Production](https://coderprog.com/ai-agents-the-definitive-guide/) (Koenigstein) | Book · EPUB · 2026 | 376 pp · ISBN 9798341666931 | Production-agent reality: fragile tools, erratic behavior, evaluation. Good coverage of agent failure modes — useful cross-check that BCF's failure codebook is complete. |
| **73** | [Domain-Specific Small Language Models: Efficient AI for local deployment](https://coderprog.com/domain-specific-small-language-models/) | Book · PDF/EPUB · 2026 | 376 pp · ISBN 9781633436701 | SLMs under hardware constraints — the competition's entire premise ("everyday hardware"). Strategy-level framing for why the 31B-QAT constraint is a feature; supports paper's Relevance criterion. |
| **72** | [Master LLM Inference Engineering](https://coderprog.com/master-llm-inference-engineering/) (Dandekar + industry) | Course · MP4 | 4-week intensive | Inference optimization from Anthropic/NVIDIA/Apple practitioners. High quality per minute but 4 weeks is over-budget; watch selectively (KV cache, scheduling, quantization sessions) during Sprints 3–4. |
| **70** | [AI-Driven Software Testing](https://coderprog.com/ai-driven-software-testing/) | Book · PDF/EPUB · 2025 | 549 pp · ISBN 979-8868818288 | AI×quality-engineering: intelligent test selection and adaptive testing. Feeds the validation hierarchy (A5) and the paper's testing-literature framing (Hemmati on the panel). |
| **68** | [Ultimate LLMOps with Langfuse](https://coderprog.com/ultimate-llmops-with-langfuse/) | Book · EPUB · 2026 | 347 pp · ISBN 9789349887541 | The compendium deferred Langfuse (heavy for one box) — this book stays on the shelf *unless* JSONL browsing becomes the bottleneck (B4's own trigger condition). Then it's the implementation guide. |
| **66** | [A Complete Guide to Graph Representation Learning with Case Studies](https://coderprog.com/a-complete-guide-to-graph-representation-learning/) | Book · PDF/EPUB · 2026 | 448 pp · ISBN 9781394314843 | Embeddings/graph-representation theory behind the 256-dim node vectors. Supports the Entry-B heatmap analysis and any claim about what the embeddings encode. |
| **64** | [Large Language Models: The Hard Parts: Open Source AI Solutions for Common Pitfalls](https://coderprog.com/large-language-models-the-hard-parts/) | Book · PDF/EPUB · 2026 | 318 pp · ISBN 9798341622524 | Pitfall catalog for LLM deployment with open-source tooling — cheap insurance against unforced errors; skim the pitfalls list in Sprint 1. |
| **62** | [Mastering Docker on Windows](https://coderprog.com/mastering-docker-on-windows/) | Book · PDF/EPUB · 2026 | 395 pp · ISBN 978-1836640516 | Day-0 environment insurance: Docker-on-Windows networking/WSL2 edge cases are exactly where sandbox builds break. Reference, not cover-to-cover. |
| **60** | [Graph Neural Networks: Concepts and Applications](https://coderprog.com/graph-neural-networks-concepts-and-applications/) | Book · PDF · 2026 | 960 pp · ISBN 9781394422739 | GNN depth for the paper's graph-reasoning related work. 960 pp = reference only; the panel will know this literature, so cite it correctly. |
| **58** | [Python AI Programming, Second Edition](https://coderprog.com/python-ai-programming-second-edition/) (RAG, DSPy, MCP, agents, evals) | Book · EPUB · 2026 | 200 pp · ISBN 9789349174511 | Broad survey of the exact toolchain vocabulary (RAG/DSPy/agents/evals) in one short book. Onboarding-grade; useful as a checklist that nothing in the toolchain is unfamiliar. |
| **56** | [Prompt Engineering in Practice: Design, test, and improve AI prompts](https://coderprog.com/prompt-engineering-in-practice/) | Book · PDF · 2026 | 248 pp · ISBN 9781633436305 | Prompt design-with-testing discipline — matches the Promptfoo regression-gate workflow (B3). The "test prompts like code" framing is the one to internalize. |
| **54** | [FastAPI – The Complete Course (Beginner + Advanced)](https://coderprog.com/fastapi-the-complete-course-beginner-advanced/) | Course · MP4 | — | 67/129 training tasks are fastapi — repo fluency speeds up *your* taxonomy labeling and gold-patch reading (Layer A metadata work). Caveat: repo-specific knowledge does not transfer to hidden repos (dossier retraction); this accelerates analysis, not the agent. |
| **52** | [GPU-Accelerated Computing with Python 3 and CUDA](https://coderprog.com/gpu-accelerated-computing-with-python-3-and-cuda/) | Book · PDF/EPUB · 2026 | 534 pp · ISBN 9781803245423 | Deeper than needed for vLLM usage, but the 5090/Blackwell bring-up and any custom CUDA-adjacent debugging benefit. Reference during Day 0 and Sprint 4. |
| **50** | [Docs for Developers: An Engineer's Field Guide to Technical Writing](https://coderprog.com/docs-for-developers/) | Book · PDF/EPUB · 2026 | 278 pp · ISBN 9798868825088 | The paper track is judged on Clarity (equal weight) and winners must ship reproducibility docs. 3,000-word dense prose is a craft skill; this is the craft book. Sprint 5–6. |
| **48** | [Foundations of Software Testing ISTQB, 5th Ed.](https://coderprog.com/foundations-of-software-testing-istqb-certification-5th-edition/) | Book · EPUB · 2026 | 288 pp · ISBN 978-1473795884 | Canonical testing vocabulary (fault/error/failure, oracle, coverage) — makes the paper's fault-interaction terminology bulletproof to an SE-research reviewer. Terminology reference only. |
| **46** | [Building Complex Multi-Agent Systems Using Pattern Prompting](https://coderprog.com/building-complex-multi-agent-systems-using-pattern-prompting/) | Book · PDF/EPUB · 2026 | 310 pp · ISBN 9781806114290 | Pattern abstractions for multi-agent prompts. Secondary input to D6; the ablation decides, this informs what to ablate. |
| **44** | [Guide to Graph Algorithms: Sequential, Parallel and Distributed, 2nd Ed.](https://coderprog.com/guide-to-graph-algorithms/) | Book · PDF/EPUB · 2026 | 552 pp · ISBN 9783032052933 | Topological ordering, centrality, connectivity theory behind fix_order and hub analysis. Theory reference for the paper's model section; no code needed. |
| **42** | [Model Context Protocol for LLMs](https://coderprog.com/model-context-protocol-for-llms/) | Book · PDF/EPUB · 2026 | 540 pp · ISBN 978-1806662272 | MCP ≠ ADK — but tool-contract design ideas (typed tool interfaces, context injection) transfer to skill-script design. Skim the tool-contract chapters only. |
| **40** | [The Mathematics of Large Language Models](https://coderprog.com/the-mathematics-of-large-language-models/) | Book · EPUB · 2026 | 477 pp · ISBN 9798185219508 | Readable theory background. Helps you *explain* the model in the paper's framing sections; zero operational value. Spare-time reading. |
| **38** | [Building Large Language Models from Scratch](https://coderprog.com/building-large-language-models-from-scratch/) | Book · PDF/EPUB · 2026 | 555 pp · ISBN 9798868822964 | Build-understanding book. You will never build from scratch in this campaign; the tokenizer/architecture chapters are useful context for QAT/quantization intuition. Lowest-priority keep. |

## 4. Notable exclusions (looked at, deliberately cut)

| Excluded category (examples) | Why cut |
|---|---|
| Vibe-coding / Copilot / Cursor books & courses (~25 items, e.g. *Vibe Coding with Cursor, Windsurf and Lovable*, *GitHub Copilot Beginner to Pro*) | These teach *humans* to use AI assistants — the competition is the inverse problem (you *are* the assistant). No transferable mechanics for a sandboxed, model-locked agent. |
| Cloud-vendor GenAI stacks (Bedrock, Azure AI, Vertex, Databricks, ~15 items) | The sandbox is offline; vendor pipelines don't apply. |
| Domain GenAI (healthcare, finance, legal, cybersecurity, ~30 items) | No mechanism transfer to SWE-agent work. |
| Generic "AI Engineering bootcamp" courses (6+ items) | Redundant with ranked items; lower density. |
| LangChain/LangGraph-specific books (*Mastering LangChain*, *Production AI Agents with LangChain + LangGraph*) | The harness compiles submissions into **ADK** agents, not LangChain. Patterns transfer weakly; the ranked agent books cover the same patterns framework-neutrally. |
| Neo4j/graph-database items | The competition ships precomputed NetworkX JSON graphs; no graph DB needed. Compendium's AGE idea is explicitly post-competition. |
| Graph *theory* textbooks (*Basic Graph Theory*, *Graphs and Homomorphisms*, *Games on Graphs*…) | Math-purity mismatch; *Guide to Graph Algorithms* (rank 44) covers the applicable slice. |
| *GPT Meets Game Theory*, *Prompt Cartography*, embedded/ARM debugging, IoT, cryptography titles | Out of scope entirely. |

## 5. Reading plan mapped to the sprint calendar

| When | Read | Why then |
|---|---|---|
| **Day 0 – Sprint 1** | *Build GenAI Agents with OpenAI + vLLM* (95), *Mastering Docker on Windows* (62, reference), *Large Language Models: The Hard Parts* (64, skim) | Environment + stack bring-up; pitfall avoidance before first runs |
| **Sprint 1** | *AI Evals in Practice* (90), *Prompt Engineering in Practice* (56) | Measurement rig and prompt-regression discipline must exist before the first experiment (the iron rule) |
| **Sprint 2** | *Systems Thinking for Agentic AI* (89), *AI Agents: The Definitive Guide* (74) | BCF scaffold hardening; failure-codebook completeness check |
| **Sprint 3** | *AI Context Engineering* (84), *Agentic GraphRAG* (80), *Advanced RAG* (79), *Production Development with DeepSeek* (88 — early read) | Graph-first localization, knowledge resources, handoff decision (D6); pre-load the QLoRA recipe |
| **Sprint 4 (if gate opens)** | *A Hands-On Guide to Fine-Tuning LLMs* (87), *RLHF* books (78, 76), *Hands-On LLM Serving* (92, KV chapters), *Master LLM Inference Engineering* (72, selective) | Adapter build, rank sizing, KV headroom |
| **Sprint 5–6** | *Practical LLM Evaluation* (85), *Docs for Developers* (50), *ISTQB Foundations* (48, terminology), *Graph Representation Learning* (66), *Guide to Graph Algorithms* (44) | Final selection protocol, paper writing, citation-proof vocabulary |

*One-line verdict: the catalog can't teach you SWE-agent science (no fault-localization or program-repair titles exist in it — that's what the paper literature in Deliverable 04 is for), but it covers the entire engineering envelope around the agent — serving, evals, fine-tuning, context, graphs — with the top 10 items mapping 1:1 onto live campaign decisions.*


---

<!-- ====================================================================== -->
<!-- FILE: Gemma4-07-FOSS-Tools-Ranked.md -->
<!-- ====================================================================== -->

# Deliverable 07 — FOSS Tool Collection Review: Ranked Resources for the BCF Gemma 4 Campaign

**Compiled:** 2026-10-02 · **Collections examined in full:** `githubdigest.json` (4,095 repos, enriched with stars/license/topics/README synopses) + `_COMBINED_grokmuse.md` (33 digest files, incl. two targeted deep-research passes on "LoRA/fine-tuning for Python coding agents" and the Unsloth+SWE-smith recipe)
**Question answered:** which of these free/open-source tools are actually useful for *training / improving / testing* the BCF coding agent — ranked, scored, and justified against the master plan (Deliverables 01–05). Same rubric as Deliverable 06.

---

## 1. Verdict up front

**Yes — this collection is substantially more on-target than the book catalog.** Your own deep-research passes (2026-09-30) already surfaced the exact SWE-agent post-training ecosystem: SWE-smith, Unsloth, TRL/Axolotl/PEFT, the agentic-RL stack (verl, SkyRL, rLLM, NeMo Gym), and three SWE-specific training recipes (SWE-RL, SWE-Swiss, SWE-Master). The digest adds a second wave the deep-research passes didn't target: **spec-driven development toolkits** (spec-kit, OpenSpec — direct kin to BCF's spec-first doctrine), **the Agent Skills standard ecosystem** (the compendium's A7), and **context/edit-reliability engineering** (context-mode, oh-my-pi, TOON — direct answers to the live harness bugs).

**Two cautions before the table.** (1) Several high-star items are coding-agent *user tools* (Claude Code wrappers, TUIs, routers) — they can't ship in an offline, ADK-compiled, model-locked submission; their value is *pattern extraction* only. (2) **License/provenance check required before training:** the host allows external-LLM training data only if license-compliant. SWE-smith trajectories and similar published sets were largely generated by frontier API models — verify the dataset card's license and the competition's distillation answer before any trajectory touches a training run (Deliverable 01, R10).

## 2. Scoring rubric (same as Deliverable 06)

Decision leverage (40%) · Stack specificity to the competition (25%) · Time-to-value within the 6-week sprint cadence (20%) · Paper-track value (15%). Tiers: **S (85+)** adopt now · **A (70–84)** targeted adoption · **B (55–69)** reference/mine for patterns · **C (<55)** marginal.

## 3. Ranked table

| Score | Resource | Meta (stars · license · last push) | Found in | Justification & plan hook |
|---|---|---|---|---|
| **96** | [SWE-bench/SWE-smith](https://github.com/SWE-bench/SWE-smith) | 791★ · MIT · 2026-09-28 | grokmuse deep-research + recipe | **The campaign's training-data engine.** Turns any GitHub repo into SWE-bench-style tasks and agent trajectories; the documented path behind SWE-agent-LM-32B (40.2% Verified claim, 5,017 trajectories). Use it to (a) synthesize *extra practice tasks* beyond the 129 (variance reduction for CV), and (b) generate trajectories for Sprint-4 SFT. Your own recipe doc already maps the full chain. ⚠ Docker-on-Linux env construction (fine: WSL2); official FT path is Modal-based — adapt to local Unsloth. ⚠ Trajectory license/provenance check required first. |
| **94** | [unslothai/unsloth](https://github.com/unslothai/unsloth) | 77k★ · Apache-2.0 · 2026-09-30 | grokmuse deep-research | **Makes Sprint 4 physically possible on the 5090**: ~2× faster training, ~70% less VRAM — the difference between "31B QLoRA fits in 32 GB" and "doesn't." SWE-smith ships a first-party Unsloth FT script. Modern Core path: Python 3.13 + `uv` on Linux/WSL (matches Day-0 setup). Serves D7. |
| **91** | [huggingface/trl](https://github.com/huggingface/trl) | 19.4k★ · (HF) · 2026-09-30 | grokmuse deep-research | SFT + GRPO + DPO trainers with PEFT/QLoRA integration — the training-loop backbone under Unsloth or standalone. Also the GRPO route if the RL track activates. Serves D7. |
| **88** | [linkedin/Liger-Kernel](https://github.com/linkedin/Liger-Kernel) | 6.6k★ · active 2026-09-30 | grokmuse follow-up | ~20% throughput / ~60% memory claims via fused Triton kernels; integrates with TRL/Axolotl/Unsloth. VRAM is the binding constraint on the 5090 — this is the cheapest headroom you'll ever buy. (Verify claims on your hardware; README numbers unverified.) |
| **86** | [axolotl-ai-cloud/axolotl](https://github.com/axolotl-ai-cloud/axolotl) | 12.5k★ · Apache-2.0 · 2026-09-30 | grokmuse deep-research | Config-driven fine-tuning — reproducible YAML recipes = receipt-friendly training runs (B1 discipline extends to training). Alternative/complement to Unsloth. |
| **85** | [china-qijizhifeng/agentic-harness-engineering](https://github.com/china-qijizhifeng/agentic-harness-engineering) | 911★ · active 2026-08 | grokmuse follow-up | **The competition's meta-game as a repo:** observability-driven, automatic evolution of coding-agent harnesses (prompts, tools, skills) with a *fixed base model* — exactly your constraint. Study its optimization loop; even partial adoption upgrades Sprint 2–3 iteration from artisanal to systematic. |
| **84** | [huggingface/peft](https://github.com/huggingface/peft) | 21.7k★ · 2026-09-30 | grokmuse deep-research | The LoRA implementation layer itself — adapter config formats must match what the scorer's vLLM loads (the `adapters/` contract). Reference for adapter_config.json correctness. |
| **83** | [zhenyuhe00/SWE-Swiss](https://github.com/zhenyuhe00/SWE-Swiss) | 105★ · 2025-09 | grokmuse deep-research | "Multi-Task Fine-Tuning and RL Recipe for High-Performance Issue Resolution" — the closest published recipe to your exact task (32B → 60.2% Verified claim). Mine the recipe structure; low stars ≠ low value here. Paper citation + Sprint-4 design input. |
| **82** | [microsoft/SkillOpt](https://github.com/microsoft/SkillOpt) | 16.1k★ · MIT · 2026-09 | digest | **Text-space optimizer that trains reusable NL skills for frozen LLM agents via trajectory-driven editing** — i.e., improve the skill library *without* fine-tuning. Perfect fit for the offline, model-locked constraint; could systematize Sprint 2–3 skill iteration. Paper-worthy method contrast vs LoRA. |
| **82** | [facebookresearch/swe-rl](https://github.com/facebookresearch/swe-rl) | 719★ · 2025-03 | grokmuse deep-research | "RL on open software evolution" with rule-based rewards — the canonical citation and reward-design pattern for RL-from-test-outcomes. Even if you never run RL, its reward shaping informs your gate design. ⚠ license field NOASSERTION — check before reuse. |
| **81** | [RUCAIBox/SWE-Master](https://github.com/RUCAIBox/SWE-Master) | 106★ · 2026-02 | grokmuse follow-up | End-to-end SWE post-training pipeline: trajectory synthesis → long-horizon SFT → RLVR with execution feedback → test-time scaling. The full-lifecycle blueprint for Sprint 4 if the LoRA gate opens. |
| **80** | [rllm-org/rllm](https://github.com/rllm-org/rllm) | 5.9k★ · active | grokmuse deep-research | RL for language agents "on any harness," mini-swe-agent support, SWE-bench benchmarks, GRPO/on-policy distillation. The most harness-friendly RL option if you get that far. |
| **79** | [SWE-Gym/SWE-Gym](https://github.com/SWE-Gym/SWE-Gym) | 747★ · ICML 2025 | grokmuse deep-research | The original SWE-agent training environment. Alternative trajectory source; compare task distribution vs SWE-smith before committing. |
| **78** | [github/spec-kit](https://github.com/github/spec-kit) | 130k★ · MIT · 2026-09 | digest | **Spec-Driven Development toolkit — industrial validation of BCF Tenet 2/A6.** Mine its spec templates and constitution patterns to harden the BCF-Spec schema; also a Related-Work anchor ("spec-first is now mainstream practice"). |
| **78** | [anthropics/skills](https://github.com/anthropics/skills) + [agentskills/agentskills](https://github.com/agentskills/agentskills) | 166k★ / 23.7k★ · Apache-2.0 (spec) | digest | The Agent Skills open standard the compendium's A7 cites. Conform `skills/bcf-*` to the spec (frontmatter rules, <5k-token bodies, one-level references) — maximizes the chance the harness's skill loader behaves as expected, and it's the paper's standards hook. |
| **77** | [R2E-Gym/R2E-Gym](https://github.com/R2E-Gym/R2E-Gym) | 337★ · COLM 2025 | grokmuse deep-research | Procedural environment generation + hybrid verifiers (DeepSWE lineage). Strongest "generate fresh tasks at scale" alternative to SWE-smith; hybrid-verifier idea is directly relevant to your A5 verification hierarchy. |
| **77** | [ShishirPatil/gorilla](https://github.com/ShishirPatil/gorilla) | 13k★ · Apache-2.0 | digest | Training + **evaluation** of function/tool calling. Gemma-4's tool-call reliability under the double-JSON escaping bug is a live issue — Gorilla's eval methodology gives you a principled way to measure it (Q2 canary upgrade). |
| **76** | [obra/superpowers](https://github.com/obra/superpowers) | 265k★ · MIT · 2026-09 | digest | The most-starred agentic-skills methodology in the collection. Skill-activation discipline and workflow patterns to benchmark your `skills/bcf-*` design against. Pattern extraction only (dev-time). |
| **76** | [harbor-framework/harbor](https://github.com/harbor-framework/harbor) | 5.7k★ · active 2026-09-30 | grokmuse follow-up | Agent eval framework from the Terminal-Bench creators: parallel envs, rollout generation. Alternative/complement to HIVE-Lite for Sprint-3+ scale-out of local eval on AUX 2. |
| **75** | [mksglu/context-mode](https://github.com/mksglu/context-mode) | 19.9k★ · 2026-09 | digest | Tool-output sandboxing claiming 98% context reduction + session memory. Can't ship (Claude-Code-oriented), but its output-compression patterns are the design answer to the `search_similar_code` blowup and context-pressure telemetry. Mine, don't adopt. |
| **74** | [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi) | 20.9k★ · MIT | digest | **Hash-anchored edits** — an escaping-robust alternative to exact-string matching. Directly informs the defensive edit doctrine (Q2; the 62/299 edit-failure problem) and gives the paper a concrete comparison point. |
| **74** | [verl-project/verl](https://github.com/verl-project/verl) + [NovaSky-AI/SkyRL](https://github.com/NovaSky-AI/SkyRL) | 23.7k★ / 2.4k★ · active | grokmuse deep-research | Industrial agentic-RL stacks (SkyRL is SWE-smith's documented GRPO partner). Only if the RL track activates *and* the canary gate opens; otherwise overkill for one 5090. |
| **73** | [OpenAutoCoder/Agentless](https://github.com/OpenAutoCoder/Agentless) | 2.1k★ · 2024-12 | grokmuse follow-up | Reference implementation of hierarchical localization — the baseline philosophy your graph-first Phase 2 is measured against in the paper. Read the code, cite the paper, don't run it. |
| **72** | [hiyouga/LlamaFactory](https://github.com/hiyouga/LlamaFactory) + [modelscope/ms-swift](https://github.com/modelscope/ms-swift) | 75k★ / 15.8k★ | grokmuse deep-research | Zero-code fine-tuning alternatives. Lower fit than Unsloth/Axolotl for a custom 31B QAT target, but useful fallback if either breaks on Blackwell. |
| **72** | [allenai/open-instruct](https://github.com/allenai/open-instruct) | 3.9k★ · active | grokmuse follow-up | Clean RLVR (reinforcement learning with verifiable rewards) codebase — "tests pass = reward" is your exact reward signal. Reference for reward design. |
| **70** | [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec) | 65k★ · MIT | digest | Second spec-driven-development toolkit; compare its spec artifacts vs spec-kit for BCF-Spec schema ideas. |
| **70** | [bigcode-project/selfcodealign](https://github.com/bigcode-project/selfcodealign) | 325★ · NeurIPS'24 | grokmuse follow-up | **License-clean data generation**: self-alignment with no proprietary distillation (StarCoder2-Instruct recipe). The methodological answer to the distillation-ToS risk (R10) — self-generated trajectories from your own ledger, aligned to this pattern. |
| **69** | [NVIDIA-NeMo/Gym](https://github.com/NVIDIA-NeMo/Gym) | 1.2k★ · active | grokmuse deep-research | Stateful envs (code exec, tool calling, sandboxes) + OpenHands/mini-SWE-agent trees. Reference for RL environment design; likely too heavy to adopt mid-campaign. |
| **68** | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) + [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills) | 81k★ / 29k★ | digest | Production skill collections — survey for skill-description quality patterns (A7's warning: vague descriptions = skills never fire). Mine 5–10 exemplary SKILL.md files as style references. |
| **68** | [SWE-rebench/SWE-rebench-V2](https://github.com/SWE-rebench/SWE-rebench-V2) | 85★ · 2026-03 | grokmuse follow-up | Fresh SWE task generation tooling — a contamination-free *extra held-out set* for Sprint-5 final-selection confidence beyond the 129. |
| **66** | [mem0ai/mem0](https://github.com/mem0ai/mem0) | 63k★ · Apache-2.0 | digest | Agent memory layer. The BCF journal is deliberately dumber (30-line breadcrumb file); read mem0's design to confirm the journal isn't missing a cheap win (e.g., ruled-out retrieval). |
| **66** | [langfengQ/verl-agent](https://github.com/langfengQ/verl-agent) | 2.4k★ · NeurIPS 2025 (GiGPO) | grokmuse follow-up | Long-horizon multi-turn RL for agents — the RL method most matched to 40-turn episodes. Paper-track related work; adoption unlikely this campaign. |
| **65** | [colbymchenry/codegraph](https://github.com/colbymchenry/codegraph) / [abhigyanpatwari/GitNexus](https://github.com/abhigyanpatwari/GitNexus) / [tirth8205/code-review-graph](https://github.com/tirth8205/code-review-graph) | 64k★ / 45k★ / 28k★ | digest | Code-knowledge-graph tooling. **Dev-time only** (the sandbox ships its own graphs) — but useful on AUX 1/2 for *your* repo-navigation intuition and for building the per-repo skill resources in Sprint 3. |
| **64** | [toon-format/toon](https://github.com/toon-format/toon) | 25k★ · MIT | digest | Token-compact JSON serialization for LLM contexts. Idea transfer: journal/handoff-packet formats optimized for tokens (context is the scarce resource). Weigh against the double-JSON escaping bug — simpler formats may dodge it. |
| **63** | [langchain-ai/open-swe](https://github.com/langchain-ai/open-swe) + [stitionai/devika](https://github.com/stitionai/devika) + [langchain-ai/deepagents](https://github.com/langchain-ai/deepagents) | 10.6k★ / 19.6k★ / 27.9k★ | digest | Open coding-agent harnesses — study their agent loops for failure-mode patterns (where do loops die?), especially open-swe's async design. Read-only. |
| **62** | [oraios/serena](https://github.com/oraios/serena) + [zilliztech/claude-context](https://github.com/zilliztech/claude-context) | 28k★ / 12.4k★ | digest | Semantic retrieval/editing toolkits. Design reference for how mature tools structure symbol-level code access — informs your graph-tool prompting doctrine. Can't ship (MCP-based). |
| **60** | [bigcode-project/octopack](https://github.com/bigcode-project/octopack) + [ise-uiuc/magicoder](https://github.com/ise-uiuc/magicoder) | 480★ / 2.1k★ | grokmuse | Classic code-instruction data recipes (CommitPack, OSS-Instruct). Background for data-curation sections; superseded in practice by SWE-smith trajectories for this task. |
| **58** | [aorwall/moatless-tools](https://github.com/aorwall/moatless-tools) | 643★ · 2025-09 | grokmuse follow-up | Tree-search over code edits on SWE-bench. Contrast case for the paper (search-heavy vs spec-first); not worth adopting mid-campaign. |
| **55** | [huggingface/open-r1](https://github.com/huggingface/open-r1) + [huggingface/alignment-handbook](https://github.com/huggingface/alignment-handbook) | 26.5k★ / 5.7k★ | grokmuse follow-up | General reasoning/post-training recipes. Background reading for Sprint 4; reasoning-general, not coding-specific. |
| **52** | [earendil-works/pi](https://github.com/earendil-works/pi) + [opencode-ai/opencode](https://github.com/opencode-ai/opencode) + [openai/codex](https://github.com/openai/codex) | 81k★ / 13.7k★ / 106k★ | digest | Production coding-agent harnesses. Skim their tool schemas and system prompts (the digest's system-prompts collection covers this too) for doctrinal ideas on tool descriptions. Zero direct use. |

## 4. Already-covered overlaps (no action)

The plan already incorporates: **vLLM** (serving), **Promptfoo** (B3), **Langfuse/LiteLLM** (B4, deferred with a trigger condition), **SWE-bench/sb-cli** (B6), **mini-swe-agent/SWE-agent** (recipe doc), **OpenHands** (seen store). The digest confirms these choices — no changes.

## 5. Notable exclusions (looked at, deliberately cut)

| Category (examples) | Why cut |
|---|---|
| Coding-agent *front-ends* and subscription routers (claude-code-router, LibreChat, claudecodeui, superset, vibe-kanban, ~40 items) | Human-facing tooling; the submission is a sandboxed ADK config, not a product. |
| Voice/TTS/video/OCR/PDF pipelines (VibeVoice, fish-speech, PaddleOCR, marker, Open-Sora…) | Unrelated modalities. |
| Web/frameworks/analytics (remix, umami, fluentui, laravel…) | Not agent-relevant. |
| "Skill" gimmicks (caveman, ponytail, taste-skill, i-have-adhd) | Prompt-joke skills for interactive coding assistants; no mechanism value for a graded harness. |
| GUI/browser agents (browser-use, OmniParser, lightpanda) | Wrong interaction modality. |
| Memory/RAG *services* requiring servers (supermemory, FastGPT, typesense) | Offline sandbox; the journal/GraphRAG-lite pattern covers the need. |
| Stale/unmaintained (torchtune — self-declared unmaintained; bigcodebench — archived; codellama — archived) | Maintenance risk flagged by your own digest passes. |
| Deep-research agents (Alibaba DeepResearch, open_deep_research) | Relevant to your *other* project (the Perplexity-style chatbot), not this competition. |

## 6. The one-line synthesis

The collection de-risks both tracks of the plan: **the no-adapter track** gets spec-kit/OpenSpec (spec doctrine), the Agent Skills standard + SkillOpt (skill layer), context-mode/oh-my-pi/TOON (context and edit reliability against the live harness bugs), and agentic-harness-engineering (systematic iteration); **the adapter track** gets the entire SWE-smith → Unsloth/TRL/Axolotl → (GRPO via SkyRL/rLLM/verl) pipeline that produced published SWE-bench results — provided the trajectory license check passes first.


---

<!-- ====================================================================== -->
<!-- FILE: Gemma4-08-Prizrak-Catalog-Ranked-Resources.md -->
<!-- ====================================================================== -->

# Deliverable 08 — 0dayprizrak Catalog Review: Ranked Books & Courses for the BCF Gemma 4 Campaign

**Compiled:** 2026-10-02 · **Catalog examined in full:** `0dayprizrak_catalog.json` — 50,848 items (part 1 + part 2; 15,267 epub, 13,766 pdf, 12,948 mp4, plus mobi/azw3/mkv and bare course links)
**Question answered:** which of these books/courses are actually useful for *training / improving / testing* the BCF coding agent — ranked, scored, and justified against the master plan (Deliverables 01–05). Same rubric as Deliverables 06–07.

---

## 1. Verdict up front

**Yes — a useful mid-tier haul, weaker than the FOSS repo collection (Deliverable 07) but with three genuine bullseyes the earlier catalogs lacked:**

1. **Eval/observability tooling courses that name your exact stack** — *Testing LLMs With DeepEval, Promptfoo, RAG & CI/CD* and *Production LLM Evaluation and Observability* cover Promptfoo + Langfuse + DeepEval, i.e., plan components B3/B4 verbatim. The book catalog (06) had eval *theory*; this one has eval *tooling*.
2. **Agent-failure-mode material** — *Pluralsight AI Agent Reliability 2026* (planning/grounding failures, cascading workflow errors) is the agent-level mirror of BCF's fault-interference math from Deliverable 04; *Patterns for Building AI Agents* and *Designing AI Agents That Actually Work* round it out.
3. **Quantization depth for the locked model** — two courses on PTQ/AWQ/quantization theory, directly relevant to reasoning about the gemma-4-31b-it-qat-w4a16-ct artifact and the live LoRA/KV-cache bugs.

**The bulk of the 50,848 items is noise for this campaign** — Microsoft Copilot productivity courses (~120+), n8n/no-code agent bootcamps, hardware fault-diagnosis (wind turbines, servo drives, OBD), Kubernetes certification tracks, generic prompt-engineering fluff, and non-English editions. See §4.

## 2. Scoring rubric (same as Deliverable 06)

Decision leverage (40%) · Stack specificity to the competition (25%) · Time-to-value within the 6-week sprint cadence (20%) · Paper-track value (15%). Tiers: **S (85+)** consume now · **A (70–84)** targeted use · **B (55–69)** reference/skim · **C (<55)** marginal. Duplicated listings (same course as mp4/mkv/Udemy link) were deduplicated — one row per unique resource.

## 3. Ranked table

| Score | Resource | Meta (type · size · posted) | Justification & plan hook |
|---|---|---|---|
| **92** | [Patterns for Building AI Agents](https://prizrak.ws/viewtopic.php?id=2200616) | pdf · 3 MB · posted 2026-05-23 | Covers the exact triad BCF lives in: agent design patterns, context engineering (compression, parallelization, avoiding failure modes), and eval workflows (eval suites, cross-referencing failure modes with metrics). Maps to A1/A6/A7 + B3 in one slim PDF. |
| **91** | [Testing LLMs With DeepEval, Promptfoo, RAG & CI/CD](https://prizrak.ws/viewtopic.php?id=2261670) | mp4 · 2 GB · posted 2026-09-09 | Promptfoo is literally plan component B3; DeepEval + CI/CD quality gates is the exact recipe for HIVE-Lite regression discipline (B2). 2026-dated, tool-current. |
| **90** | [Production LLM Evaluation and Observability](https://prizrak.ws/viewtopic.php?id=2253774) | mp4 · 4.3 GB · posted 2026-08-26 | DeepEval custom metrics + Langfuse observability = B3 + B4 in one course. Offline-vs-online eval framing matches your local-grading-vs-hidden-LB split. |
| **89** | [Pluralsight AI Agent Reliability 2026](https://prizrak.ws/viewtopic.php?id=2178919) | mp4 · 119.98 MB · posted 2026-04-24 | Failure-mode taxonomy for agent systems: planning/grounding failures, cascading errors in workflows — the agent-level mirror of BCF's fault-interference/chained-issues math (Deliverable 04). Direct failure_code vocabulary for the ledger. |
| **88** | [LLM Quantization and Compression Theoretical Core](https://prizrak.ws/viewtopic.php?id=2239190) | mp4 · 3.1 GB · posted 2026-06-29 | The locked model is QAT W4A16. PTQ/AWQ mechanics + LoRA design patterns explain *why* the KV-cache collapse and LoRA-zeroing bugs bite — calibrate expectations before the Sprint-4 gate. |
| **87** | [Reinforcement Learning from Human Feedback, Video Edition](https://prizrak.ws/viewtopic.php?id=2250441) | mp4 · 2.2 GB · posted 2026-08-20 | Manning video edition on LLM alignment/post-training. Canonical background for the Sprint-4 SFT/GRPO track (TRL, SWE-RL lineage). |
| **86** | [Build an AI Agent (From Scratch) (MEAP 02)](https://prizrak.ws/viewtopic.php?id=2203906) | pdf · 9.09 MB · posted 2026-05-26 | Manning MEAP: build an agent loop from the ground up (tools, MCP, feedback). Best single grounding in what the ADK harness is doing under your agent.yaml. |
| **85** | [Designing AI Agents That Actually Work: The book people read after their first agent failedby Metzingen Publishing Network](https://prizrak.ws/viewtopic.php?id=2204135) | pdf · 74 MB · posted 2026-05-26 | "The book people read after their first agent failed" — reliability-first agent design. Philosophically BCF: demos pass, production fails; verification hierarchy thinking. |
| **84** | [AI Agents and Applications (MEAP V07)](https://prizrak.ws/viewtopic.php?id=2226985) | mobi · 7.67 MB · posted 2026-06-21 | Manning MEAP explicitly covering coding agents, open-source LLMs, MCP. Broad but current; good survey glue. |
| **84** | [Automate Dev with Self-Testing AI Agents \| Frontend Masters](https://prizrak.ws/viewtopic.php?id=2177555) | course files · 1.5 GB · posted 2026-04-22 | Frontend Masters: agents that *prove outcomes* with a verification/observability layer and regression detection — A5 verification hierarchy kinship, agent-side. |
| **83** | [Clean AI: Agentic Discipline (Clean Coders Video Series)](https://prizrak.ws/viewtopic.php?id=2210718) | course files · — · posted 2026-06-01 | Uncle Bob on engineering discipline for agentic work. BCF Tenet 1/4 culture in video form; team-morale fuel for gate discipline. |
| **82** | [Prompt & Context Engineering: How Prompt Engineers Become AI Solution Architectsby Young Woo Choi, Ji Hye Pyo](https://prizrak.ws/viewtopic.php?id=2205067) | pdf · 77 MB · posted 2026-05-26 | Treats prompt/context design as a managed engineering lifecycle, not tricks — matches the plan's prompts-as-code + ledger approach and the context-scarcity doctrine. |
| **80** | [Agentic Automation — A Pytest Framework with Claude Code](https://www.0daydown.com/09/3640403.html) | course files · 3.3 GB · posted 2026-09-29 | Skills, subagents with narrow mandates, plan mode (separate thinking from doing) — structurally identical to the ADK submission layout (skills/, sub_agents/, phased workflow). Best structural analog in the catalog. |
| **80** | [AI Coding for Real Engineers](https://prizrak.ws/viewtopic.php?id=2236404) | mp4 · 3 GB · posted 2026-06-24 | AI Hero: daily-driver lessons on where AI coding is overhyped vs powerful. Calibration material for writing realistic agent prompts. |
| **80** | [Building AI Coding Assistant from scratch \| Udemy [Update 04/2026]](https://prizrak.ws/viewtopic.php?id=2186140) | course files · 2.93 GB · posted 2026-05-07 | What sits under Cursor/Claude Code/Codex — harness internals literacy. Helps you reason about the competition harness's 9 tools and where they fail. |
| **79** | [Maven - Systematically Improving RAG Applications [Update 08/2025]](https://prizrak.ws/viewtopic.php?id=2164924) | course files · 16.8 GB · posted 2026-04-04 | Eval-driven improvement loops for retrieval systems; the same closed-loop methodology HIVE-Lite applies to agent configs. Methodology transfers even though the domain differs. |
| **78** | [How to Test and Evaluate AI Agents - an introduction \| Udemy [Update 11/2025]](https://prizrak.ws/viewtopic.php?id=2118043) | course files · 2.8 GB · posted 2026-02-02 | Systematic agent testing fundamentals + RAG eval + functional agent testing. Feeds B3 eval suite design. |
| **78** | [Advanced Fine-Tuning with RLHF: Teaching AI to Align with Human Intent through Feedback Loops by Vishal Uttam Mane](https://prizrak.ws/viewtopic.php?id=2085778) | epub · 6.23 MB · posted 2026-01-04 | Theory+code on RLHF alignment; supports the Sprint-4 post-training option and paper related-work. |
| **77** | [AI Engineer Core Track: LLM Engineering, RAG, QLoRA, Agents](https://prizrak.ws/viewtopic.php?id=2157886) | mp4 · 24.53 GB · posted 2026-03-25 | 8-week bootcamp spanning LoRA/QLoRA + agents + deployment. Too long to run end-to-end mid-campaign — mine the QLoRA and agent weeks only. |
| **77** | [LLM Engineering Prompting, RAG, Fine-Tuning, and RLHF](https://prizrak.ws/viewtopic.php?id=2255771) | mp4 · 6.3 GB · posted 2026-08-30 | 2026 course chaining prompting → RAG eval → fine-tuning → RLHF; decent single-survey of the whole Sprint-4 stack. |
| **76** | [Edge AI with SLMs Fine-Tuning & Local Deployment](https://prizrak.ws/viewtopic.php?id=2133650) | mp4 · 1.28 GB · posted 2026-02-22 | LoRA/QLoRA on consumer GPUs + INT4 quantization — closest match to training under a 32GB VRAM ceiling. |
| **76** | [AI Observability Monitoring and Debugging LLMs in Production](https://prizrak.ws/viewtopic.php?id=2254281) | mp4 · 297 MB · posted 2026-08-27 | Failure modes, monitoring, debugging LLM behavior — B4 observability trigger condition reference. |
| **75** | [AI On-Prem Deployment By Sander van Vugt](https://prizrak.ws/viewtopic.php?id=2254282) | mp4 · 959 MB · posted 2026-08-27 | GPU drivers, container GPU support, vLLM + llama.cpp inference servers on Linux — directly under the Day-0/Sprint-1 serving setup. |
| **75** | [Training & Fine-Tuning Custom LLMs: From Pretrained Models to Domain-Specific Intelligence by Vishal Uttam Mane](https://prizrak.ws/viewtopic.php?id=2090342) | epub · 7.06 MB · posted 2026-01-04 | Fine-tuning lifecycle without a supercomputer: dataset creation → training → deployment. Sprint-4 reference. |
| **74** | [Fine-tuning and Customizing LLMs](https://prizrak.ws/viewtopic.php?id=2178211) | mp4 · 230 MB · posted 2026-04-23 | Short Pluralsight intro; quick ramp before the heavier RLHF/SFT material. |
| **74** | [Introduction to Context Engineering](https://prizrak.ws/viewtopic.php?id=2178170) | mp4 · 225 MB · posted 2026-04-23 | Compact primer on structuring/managing context for agents; reinforces the anti-ContextWindowExceeded doctrine. |
| **73** | [Advanced Quantization Techniques for Large Language Models](https://prizrak.ws/viewtopic.php?id=2100986) | mp4 · 130 MB · posted 2026-01-17 | Math-to-practice quantization survey; companion to the Theoretical Core course. |
| **72** | [Building Agentic AI Systems: Create intelligent, autonomous AI agents that can reason, plan, and adapt](https://prizrak.ws/viewtopic.php?id=2227774) | epub · 4.71 MB · posted 2026-06-21 | Packt: reason/plan/adapt agent construction; solid secondary reference for loop architecture. |
| **72** | [Agentic Knowledge Graphs](https://prizrak.ws/viewtopic.php?id=2178133) | mp4 · 233 MB · posted 2026-04-23 | Agent + knowledge-graph integration — dev-time GraphRAG brain (dossier Layer 4) kinship. |
| **72** | [Prompt Ops:: The Prompt Engineering Lifecycle by Ajit Singh](https://prizrak.ws/viewtopic.php?id=2232870) | epub · 1.59 MB · posted 2026-06-23 | Prompts as managed artifacts with a lifecycle — the B3/B5 versioning discipline applied to prompts. |
| **71** | [Agentic Architectural Patterns for Building Multi-Agent Systems: Proven design patterns and practices for GenAI, agents, RAG, LLMOps, and enterprise-scale AI systems](https://prizrak.ws/viewtopic.php?id=2203708) | pdf · 36.99 MB · posted 2026-05-26 | Packt enterprise patterns incl. LLMOps; multi-agent patterns less relevant (single locked agent) but failure-mode chapters useful. |
| **70** | [Building Agentic AI: Workflows, Fine-Tuning, Optimization, and Deployment (Pearson AI Signature) by Sinan Ozdemir](https://prizrak.ws/viewtopic.php?id=2203911) | epub · 51.39 MB · posted 2026-05-26 | Broad agent workflow + fine-tuning book; secondary reference across both tracks. |
| **70** | [Python Debugging & Testing Workbook: For Beginner to Intermediate Python Developersby Mir Hossain](https://prizrak.ws/viewtopic.php?id=2205088) | pdf · 148 MB · posted 2026-05-26 | Tracebacks, debuggers, pytest, logging — the agent's run_command diet is pytest output; sharpen your own reading of grader failures. |
| **68** | [Build Graph Database, Knowledge Graph, GraphRAG with Neo4j](https://prizrak.ws/viewtopic.php?id=2260389) | mp4 · 3.3 GB · posted 2026-09-07 | GraphRAG construction with LLMs; dev-time pattern source for the bug-pattern brain. |
| **68** | [Modern Python Testing with pytest](https://www.0daydown.com/06/3483764.html) | course files · 514.2 MB · posted 2026-06-11 | Fixtures, mocking, parametrization — SWE-bench tasks are pytest-graded; fluency here = faster failure diagnosis on AUX 2. |
| **68** | [Deploying and Scaling AI Agents: From Prototype to Production-Ready Agents (Crafting AI Agents Series Book) by Vishal Uttam Mane](https://prizrak.ws/viewtopic.php?id=2228501) | epub · 3.10 MB · posted 2026-06-21 | Production hardening patterns for agents; partial relevance (offline sandbox), mainly failure-handling chapters. |
| **68** | [AI Agents: From Prompting to Deployingby Ajit Singh](https://prizrak.ws/viewtopic.php?id=2203628) | pdf · 160 MB · posted 2026-05-26 | Learning-by-building agent book; secondary survey. |
| **66** | [Test-Driven Development with Python: Obey the Testing Goat: Using Django, Selenium, and JavaScript, 3rd Edition by Harry J. W. Percival](https://prizrak.ws/viewtopic.php?id=2111708) | pdf · 13.59 MB · posted 2026-01-26 | The Testing Goat: TDD discipline that mirrors BCF's binary-done + verification-first tenets. Culture read. |
| **66** | [Knowledge Graph Engineering with Python](https://prizrak.ws/viewtopic.php?id=2261777) | mp4 · 3.99 GB · posted 2026-09-09 | Neo4j/SHACL graph engineering; dev-time only, healthcare-flavored. |
| **66** | [Cursor 2.0 and AI Coding Agents: A Complete Guide to Autonomous Software Development, Repo-Wide Code Generation, and Agent-Driven IDE Workflows](https://prizrak.ws/viewtopic.php?id=2107311) | epub · 310.91 KB · posted 2026-01-25 | Repo-wide agentic coding workflows; pattern extraction only (wrong side of the harness). |
| **65** | [The NVIDIA Full Stack: From CUDA Kernels to Cloud-Native AI Deployment by Ajit Singh](https://prizrak.ws/viewtopic.php?id=2234505) | epub · 1.86 MB · posted 2026-06-23 | CUDA-kernels-to-deployment mental model; background for 5090/Blackwell tuning. |
| **64** | [Software Testing in the AI Era: A Complete Guide for Modern Testers by Rajamanickam Antonimuthu](https://prizrak.ws/viewtopic.php?id=2233576) | epub · 0.11 MB · posted 2026-06-23 | Testing AI systems + AI-assisted testing; light but on-theme for eval thinking. |
| **64** | [Debugging with Generative AI](https://prizrak.ws/viewtopic.php?id=2255504) | mp4 · 494.2 MB · posted 2026-08-29 | Directing and *checking* AI code output — the reviewer-side skill for patch audits. |
| **64** | [How to Write a Research Paper Academic Writing & AI Ethics](https://prizrak.ws/viewtopic.php?id=2098980) | mp4 · 5.62 GB · posted 2026-01-14 | Paper-track support: structure + AI-ethics positioning for the writeup (judged partly on clarity). |
| **63** | [Generative AI Software Engineering Specialization \| Coursera [Update 10/2025]](https://prizrak.ws/viewtopic.php?id=2182822) | course files · 5.9 GB · posted 2026-05-01 | Coursera specialization on AI-powered SE; survey-level, skim for terminology alignment with judges. |
| **63** | [Agentic Search by Ajit Singh](https://prizrak.ws/viewtopic.php?id=2227216) | epub · 0.92 MB · posted 2026-06-21 | Retrieval-oriented agent design; marginal — localization-search pattern ideas. |
| **62** | [Building AI Agent Platforms](https://prizrak.ws/viewtopic.php?id=2199254) | epub · 2.5 MB · posted 2026-05-23 | Platform-level concerns (registries, governance); mostly out of scope, skim for skill-registry ideas. |
| **62** | [Painless Docker: Unlock the Power of Docker and its Ecosystem by Aymen El Amri](https://prizrak.ws/viewtopic.php?id=2232559) | epub · 4.62 MB · posted 2026-06-23 | Docker fluency for the grading farm + harness containers; only if Day-0 setup wobbles. |
| **62** | [Reinforcement Learning Research Bootcamp](https://prizrak.ws/viewtopic.php?id=2260476) | mp4 · 3.4 GB · posted 2026-09-07 | RL research methods; gated behind the LoRA canary like everything RL. |
| **61** | [LLM.dev : The Next Generation of Coding by Ajit Singh](https://prizrak.ws/viewtopic.php?id=2231474) | epub · 1.69 MB · posted 2026-06-23 | Broad LLM-coding survey; skim-level value. |
| **60** | [Deep Reinforcement Learning Hands-Onby Maxim Lapan](https://prizrak.ws/viewtopic.php?id=2083406) | pdf · 127.81 MB · posted 2026-01-02 | Classic RL grounding; only if the RL track activates (gate G-S4a). |
| **60** | [Essential Test-Driven Development](https://prizrak.ws/viewtopic.php?id=2087022) | epub · 4 MB · posted 2026-01-04 | TDD fundamentals; backup to the Testing Goat. |
| **60** | [The Agentic Engine: Building Private Infrastructure, Edge Models, and Autonomous AI Orchestrationby John J. Reaves](https://prizrak.ws/viewtopic.php?id=2205394) | pdf · 85 MB · posted 2026-05-26 | Private/edge agent infrastructure; tangential to an offline sandbox. |
| **58** | [Stefano V. Albrecht, "Multi-Agent Reinforcement Learning: Foundations and Modern Approaches"](https://prizrak.ws/viewtopic.php?id=2097118) | pdf · 8 MB · posted 2026-01-14 | Multi-agent RL textbook; single-agent competition — paper related-work at best. |
| **58** | [What you'll learn](https://prizrak.ws/viewtopic.php?id=2187651) | mp4 · 952 MB · posted 2026-05-09 | Cert-flavored GPU infra overview; superseded by your own setup docs. |

## 4. Notable exclusions (looked at, deliberately cut)

| Category (representative items) | Why cut |
|---|---|
| Microsoft Copilot productivity (~120+ items: Excel/Word/Outlook/PowerPoint Copilot, AB-900/AB-620/GH-300 certs) | End-user productivity tooling; the submission is a sandboxed ADK config, not an Office workflow. |
| No-code / workflow-automation agents (n8n, Zapier, "Build AI Agents Without Coding", "AI Employees" bootcamps) | Wrong layer — no code-level agency, nothing transferable to a tool-calling repair agent. |
| Copilot/Cursor/Kiro/Antigravity "vibe coding" courses | Same exclusion as Deliverable 06: human-in-IDE productivity, not autonomous harness operation. Exceptions kept: the two items that teach *harness internals* (Building AI Coding Assistant from scratch) or *agentic structure* (Agentic Automation with Claude Code). |
| Hardware/industrial fault diagnosis (wind turbines, servo drives, HMI panels, OBD automotive, SEF protection) | "Fault" keyword collision — control-theory FDI, not software fault localization. BCF's fault math is already covered by Deliverable 04's SE literature. |
| Kubernetes certification tracks (CKA/KCNA/EKS masterclasses) | Offline single-machine campaign; Docker basics suffice (one Docker item retained). |
| Generic prompt-engineering catalog (~200 items: "Prompt Bible", "226 ChatGPT Prompts", "Prompt Engineering for Finance/PMs") | Redundant with retained context-engineering items; near-zero decision leverage. |
| UI test-automation tracks (Playwright/Selenium/Appium QA bootcamps) | The harness's tests are repo pytest suites, not browser automation. Two pytest items retained for grader literacy. |
| Non-English editions (German LangGraph/prompt books etc.) | Language barrier; English equivalents retained. |
| AI Reverse Engineering with OpenClaw (binary analysis, x64dbg/ghidra) | Off-domain: binary RE, not source-level SWE repair. |
| Local-LLM consumer guides (Local LLM Mastery, most Ollama content) | Superseded by your own Day-0 setup docs; Sander van Vugt item retained as the strongest of the group. |
| RL breadth (energy markets, supply chain, trading RL; Keras RL Projects) | Domain RL, not LLM post-training; two general RL items retained behind gate G-S4a. |

## 5. Sprint-mapped consumption plan

- **Sprint 1 (env + baselines):** *AI On-Prem Deployment* (vLLM sanity) if Day-0 setup wobbles; *LLM Quantization and Compression Theoretical Core* as background for reading harness bugs.
- **Sprint 2 (Config 2 + eval harness):** *Testing LLMs With DeepEval, Promptfoo & CI/CD* + *Production LLM Evaluation and Observability* (B3/B4 build-out); *How to Test and Evaluate AI Agents*.
- **Sprint 3 (skills + context engineering):** *Patterns for Building AI Agents*, *Prompt & Context Engineering*, *Introduction to Context Engineering*, *Agentic Automation — Pytest Framework with Claude Code* (subagent/skills structure).
- **Sprint 4 (LoRA gate):** *RLHF Video Edition*, *Advanced Fine-Tuning with RLHF*, *Edge AI with SLMs*, *AI Engineer Core Track* (QLoRA weeks only) — only if the canary passes.
- **Throughout:** *Pluralsight AI Agent Reliability* and *Designing AI Agents That Actually Work* for failure-code vocabulary feeding the ledger (Deliverable 05); *How to Write a Research Paper* before the Nov 12 paper deadline.

## 6. One-line synthesis

Deliverable 06 gave you theory, Deliverable 07 gave you the toolchain — this catalog's unique contribution is **eval tooling fluency (Promptfoo/DeepEval/Langfuse) and agent failure-mode taxonomy**: the two things that make HIVE-Lite and the ledger produce decision-grade evidence instead of vibes.


---

<!-- ====================================================================== -->
<!-- FILE: Gemma4-09-Exception-Class-Binning-Roadmap.md -->
<!-- ====================================================================== -->

# Deliverable 09 — Exception-Class Binning for BCF: Evidence Assessment + Data/Hypothesis Roadmap

**Compiled:** 2026-10-02 · **Inputs reviewed in full:** `python-exceptions.md`, `root-causes-second-third-level[genspark-glm53].md`, `root-code-snippet-scenarios[genspark-glm53].md`
**Question answered:** is this exception-class research useful for building BCF, and if so — how do we collect data, formulate hypotheses, and test whether binning issues by exception class actually works? Closes the loop on the claim first formalized in Deliverable 04 (§1: exception classes as search-space compression) and instrumented in Deliverable 05 (failure_code as metric #1).

---

## 1. What's in the three files — and their epistemic status

| File | Content | Provenance | Trust level |
|---|---|---|---|
| `python-exceptions.md` | Complete CPython 3.14 exception hierarchy: 68 documented classes, 5 base / 34 concrete / 15 OSError / 2 groups / 12 warnings; attributes, chaining semantics (`__cause__` vs `__context__`), `except*` behavior | **Verified** — generated by introspecting a live CPython 3.14.4 interpreter, cross-checked against official docs | **High.** Use as ground truth for the binning alphabet |
| `root-causes-second-third-level` | For ~50 exception classes: second-level causes ("what makes this fire") with % estimates, third-level causes ("what makes *that* happen"), converging to **8 atomic causes** (typos, copy-paste, environment mismatch, assumed-shape violations, missing boundary guards, concurrency races, resource lifecycle, version drift) | **Model-generated heuristics** — the doc itself says "percentages are reasoned estimates... CPython publishes no frequency data" | **Hypothesis seeds only.** The percentages must NEVER be used as priors — measuring them is literally our job (H1) |
| `root-code-snippet-scenarios` | Per-class minimal trigger snippets + fixes ordered by a **blast-radius ladder**: data fix < targeted guard < API-level guard < contract change < tooling/CI < environment | Model-generated, but the *ordering principle* is an engineering argument, not a frequency claim | **Usable as design prior.** The ladder is BCF Tenet 2 (minimum-path) operationalized; snippets are seed material for synthetic tests |

**The one-line assessment:** these files give BCF three things — a **verified alphabet** (the 68-class hierarchy), a **candidate mid-level taxonomy** (the 8 atomic causes), and a **fix-ordering doctrine** (the blast-radius ladder) — plus one thing to actively distrust: the frequency distributions, which are confabulated until we measure them.

## 2. The critical reframe: symptom class ≠ fault class

Before any roadmap, one correction the source docs blur — and which determines whether the whole binning idea works:

**SWE-bench issues rarely present as the fault's own exception.** What the agent sees is a *failing test*: usually `AssertionError` from pytest, regardless of whether the root cause is a `KeyError`-shaped bug, a wrong-type bug, or a silent logic bug that raises nothing. The exception class observable at test time is a **symptom signal**; the root cause belongs to a different label space (closer to the 8 atomic causes). The httpx-3672 case is the canonical example: the visible failure was a test-suite red, while the faults were a no-parens method reference (`_server.py:92`), a type error (`Response(code=500)`), and an ungraded dead-code path — three different fault classes, one symptom.

So "binning by exception class" splits into two distinct hypotheses, and the roadmap below tests them separately:

- **H-symptom:** the exception class of the *failing test output* carries localizing information about where the fault lives.
- **H-fault:** issues cluster into a small number of *fault classes* (the 8 atomic causes or similar), and knowing the class constrains the fix search.

Deliverable 04's compression math applies to both, but with different alphabet sizes and different mutual-information values. Conflating them is the easiest way to fool ourselves.

**Second reframe — where the signal enters the pipeline.** Exception class exists at three points: (a) in the *issue text* (user-pasted tracebacks — present in maybe a third of SWE-bench issues), (b) in the *visible test run* the agent can execute, (c) in the *post-hoc ledger* after grading. (a) and (b) are actionable at runtime; (c) is training data. The Phase-1a classification gate (dossier) can only use (a)+(b).

## 3. Where this plugs into the existing plan

| Asset | BCF/plan component | What these files add |
|---|---|---|
| 68-class hierarchy | Phase-1a classification gate (A6); `failure_code` (D05 metric #1) | The verified label alphabet + is-a structure enabling **hierarchical binning** (test granularity U-curve properly: leaf class → family → atomic cause) |
| 8 atomic causes | BCF-Spec schema (A6) `fault_class` field | Candidate top-level taxonomy to validate or reject |
| Blast-radius ladder | Tenet 2 (minimum-path); Patch phase (A3); fix selection | A 6-rung ordinal scale for `fix_rung` metadata — lets us test H3 (does class predict minimal sufficient rung?) |
| Trigger snippets | SWE-smith-style synthetic data; canary suite | Seed templates for controlled exception-class experiments (E2) |
| Heuristic percentages | — | **Excluded from priors.** To be replaced by measured distributions (H1). Keep only as a sanity-check direction |

## 4. Data-collection roadmap

### 4.1 Four data sources, in dependency order

**Source A — Public SWE-bench corpora (start Sprint 1, zero GPU, AUX 2).**
SWE-bench Verified/Lite public task sets ship with FAIL_TO_PASS/PASS_TO_PASS test lists; evaluation logs from public leaderboard submissions (SWE-bench's own site + OpenHands/SWE-agent trajectory dumps) contain the raw pytest output. Extract: task id, repo, issue text (traceback present? y/n), failing tests, exception class + message per failing test, gold patch files/functions.
Yield: ~500–2,300 labeled task-level observations depending on log availability. This is the **primary dataset for H1/H4/H5/H6**.

**Source B — Competition's own artifacts (Sprint 1–2).**
The ~58 public tasks: run the visible suites pre-fix on AUX 2's grading farm, capture full tracebacks. Small n (~58), but it's the *exact deployment distribution* — use it to check that conclusions from Source A transfer (domain-shift check). Every local grading run feeds the ledger (B5) automatically per Deliverable 05.

**Source C — SWE-smith synthetic generation (Sprint 2–3, gated on license check R10).**
SWE-smith's bug-injection procedures produce tasks with *known* fault classes by construction. This is the only source where **fault class is ground truth rather than inferred** — essential for testing H-fault cleanly, and for the granularity sweep (H4) because we control class frequency. The trigger snippets from `root-code-snippet-scenarios` seed additional bespoke injections (e.g., deliberately plant a no-parens method reference → confirm the symptom it produces).

**Source D — Own agent runs (Sprint 2 onward, continuous).**
Every HIVE-Lite experiment already logs failure_code per D05. Extend the ledger schema with the fields in §4.3. By Sprint 5 this is ~200–500 agent-runs × ~1–6 failures each — enough for the agent-level hypotheses (H2, H7, H8).

### 4.2 The extraction pipeline (build once, Sprint 1, ~2 days on AUX 2)

1. **Traceback parser** (`tools/extract_exceptions.py`): regex the pytest "short test summary" + traceback blocks → (exception class FQN, message template, deepest in-repo frame, test node id). Handle: bare asserts (no exception → class = `AssertionError` implicit), `pytest.raises` contexts (expected exceptions must not count as symptoms), double-JSON-escaped tool output (the live harness bug — parse both raw and escaped forms).
2. **Normalizer:** map stdlib exceptions not in builtins (`json.JSONDecodeError`, `subprocess.CalledProcessError`) and library exceptions (e.g., `httpx.RemoteProtocolError`) into an extension layer of the verified hierarchy — keep the is-a DAG so every leaf can roll up to family and to atomic cause.
3. **Fault-class labeler:** for Sources A/B, fault class is *inferred* — use the dev-time judge (Jev, with its calibration caveats) to label gold patches against the 8 atomic causes, then hand-audit a 10% sample (inter-rater agreement target κ ≥ 0.7; if below, the taxonomy is ambiguous → that itself is a finding against fine-grained binning). Source C needs no labeling.
4. **Storage:** append-only JSONL under `\\MAIN\swe\experiments\exception_classes\` per D05's layout; one row per (task, failing_test, source) with the §4.3 schema.

### 4.3 Schema (extends Deliverable 05's Layer A)

```
task_id, source(A/B/C/D), repo,
symptom_class, symptom_family, message_template, deepest_frame_file,
issue_text_traceback: bool,
fault_class(8-atomic or null), fault_class_source(judge/human/injected),
gold_patch_files, gold_patch_functions, fix_rung(1-6, from ladder),
visible_suite_result, hidden_suite_result,    # powers H7
n_tool_calls_to_first_correct_file,           # powers H2
agent_config_id, run_id
```

## 5. Hypothesis registry (pre-registered before data collection)

Each hypothesis states: claim · test · success threshold · what changes if confirmed/refuted. Decision rules follow D05's pre-registration discipline.

| # | Hypothesis | Test | Threshold / decision |
|---|---|---|---|
| **H1** | Symptom-class distribution over SWE tasks is heavily skewed (a few classes cover most failures) | Measure class-frequency distribution on Source A; fit vs uniform | If top-5 classes cover ≥70% of failures → coarse binning is viable; if near-uniform → binning is dead at the symptom level, pivot to H-fault |
| **H2** ⭐ | **Core BCF claim:** conditioning the localization search on the exception class reduces search cost | Compare tool-calls-to-first-correct-file with vs without the class-conditioned routing skill (Config 3 ablation, Source D) | ≥25% median reduction at p<0.05 (bootstrap, paired by task) → keep the Phase-1a gate; <10% → cut it, reclaim the prompt tokens |
| **H3** | Exception/fault class predicts the minimal sufficient fix rung on the blast-radius ladder | Ordinal association (Somers' D) between class and fix_rung on Sources A+C | D ≥ 0.4 → ship a class→rung prior table in `skills/bcf-patch`; <0.2 → the ladder is universal, drop class-conditioning |
| **H4** | Granularity is U-shaped: mid-level bins (8–15 classes) beat both 68 leaves and 1 catch-all | Sweep K over {68, 15, 8, 4, 1} on Source C (controlled frequencies), measure I(S;C) and downstream localization lift | Confirms Deliverable 04's E(K) model if an interior K wins; a monotone result falsifies the U-curve — publish either way |
| **H5** | Exception class is recoverable *before* running tests: from issue text alone vs only after a visible-suite run | Train/evaluate a simple classifier (tf-idf + logistic regression is enough) on issue text → symptom class | If text-only top-1 accuracy ≈ majority class → the gate must run tests first (placement decision for Phase-1a); if ≥60% → gate can act pre-test, saving a cycle |
| **H6** ⛔ | **Falsification target:** exception class adds ~zero information once you condition on repo + task family (I(S;C \| repo) ≈ 0) | Conditional mutual information on Source A | If CMI < 0.1 bits → **binning is redundant with graph priors and must be cut** — the compendium's graph-first doctrine wins; this is the single most important negative result to look for honestly |
| **H7** | Oracle asymmetry (visible-red/hidden-green) concentrates in specific symptom classes | Cross-tab visible×hidden suite outcomes by class (Sources B+D) | If concentrated → add a per-class "trust the visible suite?" flag to the verification hierarchy (A5); if diffuse → keep the global failsafe |
| **H8** | Chained issues (httpx-3672 type) show *exception-class sequences* across iterations, and sequence position predicts fix ordering | Sequence mining on Source D multi-failure runs | If sequences are order-informative → encode the topological fix ordering (Deliverable 04 §2) as a skill; if random → fix in observed order |
| **H9** | The 8 atomic causes are the right fault taxonomy: complete (coverage) and discriminable (agreement) | Coverage audit + κ on Source A labels | Coverage <80% or κ <0.5 → revise taxonomy before any H-fault conclusion is trusted |

⭐ = the claim the competition submission depends on. ⛔ = the claim we must try hardest to *kill*.

## 6. Experiment designs

**E1 — Corpus measurement (Sprint 1–2, AUX 2, no agent runs).** Sources A+B through the pipeline. Answers H1, H4 (partially), H5, H6, H9. Cost: ~2 days build + CPU hours. Deliverable: measured distributions replacing the genspark heuristics, with bootstrap CIs. This is also **paper Table 1** — the empirical exception-class distribution of real SWE tasks does not currently exist in the literature (the source docs confirm CPython publishes nothing).

**E2 — Controlled synthetic study (Sprint 2–3, gated on R10).** SWE-smith + snippet-seeded injections at controlled class frequencies. Answers H4 cleanly (U-curve) and H3 without labeling noise. Also stress-tests the parser on known-answer tracebacks.

**E3 — Agent ablation (Sprint 3–4, MAIN).** Config 3 with the class-conditioned routing skill vs Config 3 without (skill removed, everything else frozen). Answers H2. n ≥ 30 public tasks per arm, paired, one submission-slot cost only if local CV separation is unclear.

**E4 — Gate placement (Sprint 3).** Phase-1a gate fed issue-text-only vs post-test-run classification (H5 outcome decides). Measures cycle-time cost of an early test run vs misclassification cost of skipping it.

**E5 — Sequence study (Sprint 4–5, passive).** Mine Source D for H8; no dedicated runs needed.

## 7. What I would want to know, prove, or disprove

The self-interrogation list, in descending order of consequence:

**Must prove (the submission depends on these):**
1. *I(S;C) > 0 on the real distribution* — binning by exception class genuinely compresses the localization search space for these ~120 tasks, not just in theory. (H2/H6 jointly.)
2. *The compression survives the symptom/fault gap* — the signal in a pytest `AssertionError` points at the fault's neighborhood often enough to beat unconditional graph search.
3. *The optimal K is interior and achievable* — a 8–15-class taxonomy the 31B model can reliably classify into at runtime, within token budget.

**Must try to disprove (the integrity checks):**
4. *"Binning is redundant."* If repo+graph priors already carry the information (H6 fails), exception classification is a prompt-token tax wearing a lab coat. Cut it and say so in the paper — that's a stronger paper, not a weaker one.
5. *"The genspark percentages approximate reality."* Near-certainly false; E1 will show by how much. If any bin's heuristic share is off by >2×, that documents why LLM-generated priors can't substitute for measurement — a citable secondary finding.
6. *"More classes = better."* The U-curve (H4) must actually bend. If 1 catch-all wins, Deliverable 04's E(K) model is wrong in a way that changes the whole framework's pitch.
7. *"The fault class is stable across visible and hidden suites."* httpx-3672 already suggests not (Trap 1). H7 quantifies it.
8. *"A frozen 31B model can classify into K≈10 classes reliably from a traceback."* If runtime classification accuracy is <70%, the gate misroutes more than it helps — then the design answer is classification *with a fallback*, not classification abandoned.

**Would love to know (paper gold, not submission-critical):**
9. Whether exception-class *sequences* in chained issues carry fix-ordering information (H8) — that would be the second named phenomenon after oracle asymmetry.
10. Whether the 8 atomic causes generalize beyond Python (spot-check vs a JS/TS corpus) — determines whether the paper's claim is "Python exception binning" or "exception-class binning as a general SE technique."

## 8. Risks and integration

| Risk | Mitigation |
|---|---|
| Heuristic percentages leak into design decisions | This document is the quarantine: heuristics are hypotheses, replaced by E1 measurements before Sprint 3 |
| Label noise in fault_class (judge miscalibration) | κ-audit gate (H9); Source C provides label-free ground truth |
| Small n on the competition's own tasks (B) | Source A for power, Source B only for transfer checks; report CIs honestly |
| E3 burns a submission slot | Run locally first; submit only if local separation is ambiguous (decision rule DR-6 style) |
| Parser breaks on escaped tool output | Handle both raw and double-JSON forms (known live harness bug) |

**Sprint mapping:** E1 build in Sprint 1 (parallel to env setup, AUX 2 idle otherwise) → E2 in Sprint 2–3 → E3/E4 in Sprint 3–4 → E5 passive → paper draft integration by Nov 5 (paper deadline Nov 12).

**One-line synthesis:** the genspark research handed us a verified alphabet, a candidate taxonomy, and a fix-ordering ladder — but its frequencies are fiction until measured. The roadmap's job is to convert "binning by exception class" from a plausible-sounding claim into either a measured compression factor with a runtime gate behind it, or an honestly-reported negative result — and H6 is the experiment that decides which.

