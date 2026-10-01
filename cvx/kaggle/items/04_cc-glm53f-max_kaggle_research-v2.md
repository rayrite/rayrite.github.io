# COMBINED MARKDOWN - combine

_Generated 2026-09-30 21:38:56 | 9 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle\items\combine_

## Contents

1. 01-agent-brain-roadmap-and-master-checklist.md
2. 02-master-plan-day0-six-sprints.md
3. 03-paper-track-intelligence-report.md
4. 04-bcf-review-and-master-plan-integration.md
5. 05-bcf-math-whitepaper-draft3-foundations.md
6. 06-coderprog-catalog-assessment.md
7. 07-0dayprizrak-catalog-assessment.md
8. 08-foss-tools-assessment-for-bcf-agent.md
9. 09-real-task-simulation-httpx3672-bcf-vs-naive.md

---

<!-- ====================================================================== -->
<!-- FILE: 01-agent-brain-roadmap-and-master-checklist.md -->
<!-- ====================================================================== -->

# Task 1 — Building a Winning "Brain" for the Gemma 4 Developer Agent Competition

**Brainstorm, strategy, and end-to-end roadmap with master checklist and milestones**

- Date: 2026-09-30
- Competition: [Google — The Gemma 4 Developer Agent Competition](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview) (Kaggle 149921)
- Companion document: `02-master-plan-day0-six-sprints.md` (Day-0 setup + six one-week sprints executing this roadmap)
- Research basis: official docs in `input/kagglecomp/docs/markdown/`, `HARNESS_README.md`, organizer discussion threads (IDs cited), leaderboard snapshot 2026-09-30, and public SWE-agent research. Full notes in `research-gemma4-agent-2026-09/scratch/notes/`.

---

## 0. Executive thesis

1. **The environment, not the ideas, has been the bottleneck.** Four organizer-acknowledged infrastructure bugs (thinking tokens dropped between tool calls; tool results double-JSON-encoded; LoRA KV-cache preallocation blowup; LoRA-zeroing wheels) suppressed every submission for the first week. The fixes are landing now — **without rescoring** — so the leaderboard will reshuffle sharply. Build the brain for the *fixed* environment, and submit daily to ride the regime changes.
2. **The binding constraint is wall-clock, not capability.** 12 hours ÷ ~120 sequential tasks ≈ **6 minutes per task all-in** (sandbox setup included). Techniques that win on SWE-bench at 100-iteration budgets must be re-engineered for ~4–5 agent-minutes per task. A global budget governor is a first-class component of the brain, not an afterthought.
3. **Public → private transfer is the real final boss.** The ~120 hidden tasks come from **private repositories**; the 129 public tasks (fastapi 67, rich 48, requests 13, httpx 1) exist to develop *methodology*, not memorization. Any plan without a held-out-repo validation tier is flying blind.
4. **The score recipe is a stack, not a silver bullet:** robust tool-loop scaffolding + graph-assisted localization (weeks 1–2) → SFT LoRA on verified distilled trajectories (weeks 3–4) → verifier-gated best-of-N within leftover budget (weeks 5–6). Target **0.25 ± 0.03** against a current top of 0.17.
5. **Winning also means shipping:** winners must open-source under an OSI license. Hygiene (data provenance, licensing, reproducibility) is part of the endgame, and the paper track (Nov 12 deadline) is a cheap parallel bet on the same work.

---

## 1. The game, precisely

Every row below was verified against the official competition docs (`input/kagglecomp/docs/markdown/`), the dataset's `HARNESS_README.md`, or organizer staff posts in discussion threads.

| # | Dimension | Verified fact | Strategic implication |
|---|-----------|---------------|-----------------------|
| 1 | Base model | Locked: `gemma-4-31b-it-qat-w4a16-ct` (W4A16 QAT), required on every agent and sub-agent | All gains come from post-training + scaffolding; no model swapping |
| 2 | Submission format | `submission.zip` with root `agent.yaml` (Google ADK Agent Config), prompts, sub-agents, skills, LoRA adapters; ≤ 3 GiB unpacked; declarative YAML only | Everything must be expressible as ADK config; no arbitrary Python entrypoints |
| 3 | Scoring compute | 4× NVIDIA L4 (96 GB total), vLLM TP=4, `max_model_len=32768`, `max_loras=8`, `max_lora_rank=128` | 32K context ceiling; up to 8 LoRA adapters addressable |
| 4 | Sandbox | Air-gapped container, 4 GiB RAM, 2 vCPU, offline wheels at `/wheels/` | Agent cannot install from network; tests are run via `run_command` |
| 5 | Global budget | 12 h for all ~120 tasks, **including sandbox setup time**, tasks run **sequentially** (staff, thread 743063) | ≈ 6 min/task all-in; ordering is fixed and public/private tasks may interleave |
| 6 | `eval_config.yaml` | Scorer reads **only** `timeout_seconds`, `max_tool_calls`, `max_time_minutes`, `max_turns`; default = no limit (staff, thread 743063) | Per-task failsafe caps are cheap insurance; anything else must be enforced in-agent |
| 7 | 12 h overrun | Currently **errors the entire submission**; fix to score unfinished as 0 is planned but not live (staff, thread 743063) | Never rely on the fix: target ≤ 10.5 h wall-clock with a hard in-agent governor |
| 8 | Tool surface | 9 predefined tools; `submit_patch` and `get_status` are free; all others debit time | Poll `get_status` freely; budget logic reads real consumption |
| 9 | Scoring metric | Per-task PASS/FAIL: hidden fail-to-pass tests plus pass-to-pass suite on the patched repo; overall = fraction passed | Partial credit does not exist; a 90%-correct fix scores 0 |
| 10 | Public data | 129 tasks with gold patches: fastapi 67, rich 48, requests 13, httpx 1; code graphs + 256-dim embeddings provided | Sufficient for local CV, but only 4 repos — distribution too narrow |
| 11 | Hidden test set | ~120 tasks curated from **private repositories**, same pipeline; LB is 50/50 public/private split | Held-out-repo validation is mandatory; fastapi-specific tricks will not transfer |
| 12 | Cadence & deadlines | 1 submission/day; 2 final selections; entry + team-merge deadline Nov 25; finals Dec 2; team ≤ 5 | Daily submissions are free information; bank environment improvements early |
| 13 | External resources | External data/models allowed under a "Reasonableness" standard for **training**; the submitted agent must be Gemma-4 only; winners open-source under OSI license | Distill from frontier teachers offline; keep the serving path 100% Gemma-4 |

---

## 2. Why the leaderboard reads 0.17 / 0.15 / 0.15 (verified 2026-09-30)

| Rank | Team | Score | Entries |
|------|------|-------|---------|
| 1 | Statistical Science by Lasme | 0.17 | 7 |
| 2 | Makus | 0.15 | — |
| 3 | sergiomalv | 0.15 | — |
| 4–6 | — | 0.15 | — |
| 7–10 | — | 0.13 | — |

Community-measured plain single-agent baselines sit near **0.05**. The entire spread from 0.05 to 0.17 is scaffolding quality under a degraded environment. Four organizer-acknowledged bugs define that environment:

| Bug | Thread (ID) | Symptom | Status (as of 2026-09-30) | Impact on us |
|-----|-------------|---------|---------------------------|--------------|
| Thinking tokens dropped between tool calls | 744354 | Model's reasoning vanishes mid-loop; degraded multi-step behavior | Patched ~Sep 29–30, **no rescoring** | LB mixes two regimes; daily submissions re-baseline our true score |
| Tool results double-JSON-encoded | 744272 | `edit_file` failures ≈ 22% of attempts; raw-text path ≈ 0% | Fix reported in progress | Prompt defensively + `write_file` fallback after 2 failed edits |
| LoRA KV-cache preallocation blowup | 744331 | KV budget 46,048 → 7,600 tokens with adapters loaded; scoring stalls | Open; organizer engaged | Do not hang the whole plan on LoRA until scoring-side fix confirmed |
| LoRA weights silently zeroed (YOCO double-registration) | 743508 | Adapters load as zeros; silent model degradation | Fixed via wheelhouse v25 | Pin wheelhouse v25 locally to test LoRA truthfully |

**Read:** today's #1 score is a scaffolding-only score from a buggy regime. A submission that combines solid scaffolding with working LoRA post-training and test-time compute in a fixed environment plausibly lands 0.22–0.28.

---

## 3. Where the points are — the gain ledger

Estimated resolve-rate contributions (priors from cited research + this competition's measured baselines; must be re-based weekly on local CV):

| Lever | Mechanism | Evidence base | Est. gain (pts) | Cost / risk |
|-------|-----------|---------------|-----------------|-------------|
| L1 Env-aware scaffolding hygiene | Linear history, short thoughts, strict tool-call formatting, recovery from nudges/compaction | mini-SWE-agent: minimal disciplined loop → 65–74% SWE-bench (large-budget); HARNESS_README gotchas | +5–8 over naive | Low |
| L2 Graph-assisted localization | `get_code_neighbors` / `get_code_subgraph` / `search_similar_code` to shortlist suspect symbols before reading files | Agentless: localization-first two-phase design; graphs provided by organizers | +3–5 | Low-medium |
| L3 Reproduce-before-fix | Run the failing test first, then patch, then re-run | Standard SWE practice; fail-to-pass tests are the grading key | +2–4 | Low |
| L4 Budget governor | Global wall-clock pacing, per-task caps, downgrade ladder | 12 h ÷ ~120 sequential tasks ≈ 6 min/task (staff, 743063) | Protective (avoids 0-total runs) | Low |
| L5 SFT LoRA on distilled trajectories | Behavior-cloning of verified-successful tool trajectories, own + teacher-generated | SWE-Gym: SFT on in-env trajectories → +19 pts (32B, large budget) | +5–8 | Medium (data engine) |
| L6 Rejection-sampling round / RL | Re-decode failures, keep verified wins (STaR); GRPO with binary pass reward if infra allows | SWE-Gym round 2; SWE-RL; verl GRPO+LoRA on 40 GB | +2–4 | High (compute, stability) |
| L7 Verifier-gated best-of-N | N=2–3 candidate patches selected by sandbox test signal + judge, only under budget slack | R2E-Gym: hybrid verifiers best-of-N 34.4% → 51% | +2–5 | Medium (budget-hungry) |
| L8 Multi-LoRA routing | Separate coder vs navigator adapters (`max_loras=8`) | Sample submission demonstrates routing | +0–3 | Blocked by bug 744331 until fixed |
| L9 Private-repo generalization | Diverse training repos, repo-agnostic prompts, held-out-repo CV selection | Test set = private repos (Data page); public/private 50/50 LB split | Protective (prevents silent collapse) | Medium |

Nothing here requires exotic research. The winners' edge will be **integration quality and iteration speed**, not a novel algorithm.

---

## 4. Brainstorm: candidate brain architectures

| Option | Shape | Strengths | Risks | Verdict |
|---------|-------|-----------|-------|---------|
| A. Monolithic single agent | One `LlmAgent`, one big system prompt | Simple, robust, matches 0.15-class LB entries | Long-context drift; no specialization | Baseline only |
| B. Two-phase specialists (Agentless-style) | `SequentialAgent`: read-only Localizer → Coder editor loop | Cheap localization; coder context stays small; mirrors provided graph tools | Hand-off fidelity; extra turn overhead | **Core** |
| C. Planner + executor loop | `LoopAgent` with explicit plan/revise steps | Structured; good for feature requests | More turns per task — hurts the 6-min budget | Rejected as primary |
| D. Multi-LoRA routed specialists | `main_lora` coder + `tool_lora` navigator | Specialization within one base model; `max_loras=8` | Scoring-side LoRA bugs (744331/743508) | **Deferred** until scoring infra verified |
| E. Verifier-in-the-loop best-of-N | Candidate patches × N, sandbox-tested, best selected | Largest documented late-stage gain (R2E-Gym) | Budget-hungry; needs slack | **Endgame, governor-gated** |
| F. Skills-augmented navigation | ADK skill with sandboxed helper scripts (repo map, wheel-aware test runner, budget meter) | Deterministic offload of mechanical work; scripts share the container | Skill bugs = silent failures | **Yes, from Sprint 2** |

**Recommended brain = B + F now, E when affordable, D when infra allows:** a `SequentialAgent` whose read-only Localizer produces a suspect-symbol shortlist using graph tools, handing a tight context to a Coder that reproduces the failure, patches, and verifies; a `budget_governor` skill enforces pacing and triggers the downgrade ladder; best-of-N runs only when `get_status` shows slack.

### 4.1 Per-tool policy (the brain's reflexes)

| Tool | Policy | Known gotcha |
|------|--------|--------------|
| `run_command` | Reproduce first (`pytest <node>`), verify after edit; prefix locale-sensitive runs with `LC_ALL=C.UTF-8` | Sandbox has 4 GiB / 2 vCPU; heavy test sweeps cost the clock |
| `read_file` | Read targeted ranges around graph-shortlisted symbols, never whole files | 150 lines / 10K chars cap |
| `edit_file` | Exact match → flexible → regex tiers; after 2 failures switch to `write_file` | 22% failure rate under double-JSON bug (744272) |
| `write_file` | Full-file rewrite for multi-hunk changes or after edit failures | Must send entire file content |
| `search_similar_code` | Query with **symbol names/identifiers**, not natural language | Embedding search resolves identifiers only |
| `get_code_neighbors` / `get_code_subgraph` | Fan out from the localized symbol before reading | Multigraph edges may repeat node pairs |
| `submit_patch` | Free; call even on partial work as insurance | Extracts `git diff HEAD` after `git add -N .` |
| `get_status` | Free; poll every few turns; governor reads it | Returns live budget + patch status |

### 4.2 Failure-mode playbook

| Symptom | Cause | Countermeasure |
|---------|-------|----------------|
| Edit silently no-ops / fails repeatedly | Double-JSON tool-result encoding (744272) | `write_file` fallback; prefer smaller anchors |
| Agent re-explores after compaction | Context compaction at 14,336 tokens drops detail | Re-inject a compact "state so far" note into prompts; keep system prompt stable for cache (min 2,048 tokens) |
| Tool call left unclosed / MAX_TOKENS stop | Generation cut mid-call | Use the harness nudge; format responses short; avoid mega-edits |
| Agent "fixes" the test instead of the code | Misread objective | Explicit rule in system prompt: never edit test files (harness resets them anyway — anti-tamper) |
| Locale-dependent test failures | Sandbox locale variance | `LC_ALL=C.UTF-8` prefix on test runs |
| Run blows the 12 h budget | No pacing | Governor skill: soft target ~4.5 min agent-time/task, hard cap via `max_time_minutes`, global watchdog abandons worst-value task first |

---

## 5. Brainstorm: the learning pipeline

| Stage | Method | Data | Infra | When |
|-------|--------|------|-------|------|
| Trajectory engine | Run current agent over all 129 public tasks + mined held-out tasks; log full tool traces | Own agent | 5090 serving + sandbox fan-out | Sprint 1–2 |
| Teacher distillation | Frontier LLM (external API) writes/repairs gold trajectories for tasks the agent fails; converted to the same tool-trace format | 129 public + mined tasks | API budget (staff-confirmed allowed for training data) | Sprint 3 |
| SFT LoRA v1 | Behavior cloning on verified-successful trajectories; rank 32–64 | 2–5k trajectories | 5090 (W4A16 base ≈ 17 GB + LoRA + checkpointing) | Sprint 3 |
| Round 2 rejection sampling | Re-decode failures at higher temperature; keep only fail-to-pass-green wins | Self-generated | 5090 + sandbox pool | Sprint 4 |
| GRPO (stretch) | Binary pass/fail reward, verl-style GRPO + LoRA | Fresh rollouts each step | 5090 is tight for 31B; fallback = more rejection-sampling rounds | Sprint 4–5 |
| Verifier | Hybrid: sandbox test-run signal (primary) + learned judge on patch diffs (secondary) | Trajectories + outcomes | 3080/4060 for the small judge | Sprint 5 |

Guardrails: the teacher never appears in the submission path (model lock applies to serving, not training — staff-confirmed distillation policy); all training repos audited for permissive licenses; winners' open-source package written as we go, not at the end.

---

## 6. Test-time compute and budget engineering

### 6.1 The arithmetic

| Quantity | Value | Source / note |
|----------|-------|---------------|
| Global wall-clock | 12 h = 720 min | Overview; includes sandbox setup |
| Tasks | ~120, sequential | Staff, thread 743063 |
| All-in average | ≈ 6.0 min/task | 720 ÷ 120 |
| Sandbox setup | ~6 min/task measured; full community scoring runs land ≈ 8 h | Discussion threads |
| Realistic agent-time per task | ≈ 4–5 min with governor; ≥ 1.5 h global reserve | Design target |
| Per-task failsafe caps | `max_time_minutes: 10`, `max_tool_calls: 70`, `max_turns: 250` | Only these 4 keys are read (staff) |

### 6.2 Governor design

| Element | Setting |
|---------|---------|
| Soft target | ~4.5 min agent-time per task, tracked by a `budget_governor` skill reading `get_status` |
| Downgrade ladder | Full loop (localize → reproduce → patch → verify) → fast path (skip verification run, submit directly) → single-shot (one read + one patch) |
| Global watchdog | At 10.5 h elapsed, drop to single-shot for all remaining tasks; never test the 12 h cliff (today it errors the whole run) |
| Best-of-N gate | Only when projected slack ≥ N × soft target and task difficulty is high |
| Front-loading (spend all time on early tasks) | **Rejected** — sequential order + pending "unfinished = 0" fix + unknown public/private interleaving make it a coin flip (Zhukov concern, thread 743063) |

### 6.3 Context budget

| Setting | Value | Note |
|---------|-------|------|
| `max_model_len` | 32,768 (fixed by harness) | Design prompts to fit |
| Compaction threshold | 14,336 tokens (default) | Keep; revisit only after LoRA KV-cache bug (744331) is fixed |
| Context cache | `min_tokens=2048` | Keep system prompt byte-stable to hit the cache |
| Thinking | On, but instruct brief post-tool thoughts | Post-9/29 regime keeps `reasoning_content` between calls |

---

## 7. Validation strategy — beating the distribution shift

| Tier | Data | Speed | Noise | Role |
|------|------|-------|-------|------|
| T1: public CV | 129 provided tasks (gold patches available) | Fast on 5090 | Optimism bias (4 repos, seen repos) | Smoke tests, regression checks |
| T2: held-out-repo CV | 30–60 self-mined tasks from other popular Python repos, same fail-to-pass pipeline (SWE-bench-style mining; "Reasonableness" permits external data) | Medium | Closest proxy to the private split | **Primary selection metric** |
| T3: Kaggle probes | Up to 2 submissions/day; public LB sees only half the hidden set | Slow (queue + 8 h run) | Small n, regime changes, 50/50 split | Direction check only — never select on public LB alone |

T2 mining reuses the organizers' own recipe: commits touching both `.py` logic and tests, issue-linked prompts, fail-to-pass + pass-to-pass verification. Track CV↔LB correlation weekly in one table; if T2 stops predicting T3, the mining pipeline has drifted from the organizers'.

Also stratify all CV results by failure class — localization failure vs. edit failure vs. verification flake — because each class has a different lever (L2, L1/tooling, sandbox hygiene).

---

## 8. Risk register

| # | Risk | Likelihood | Impact | Mitigation | Tripwire |
|---|------|------------|--------|------------|----------|
| R1 | 12 h overrun errors the whole run (live today) | Medium | Fatal to a submission | Governor + full local timing rehearsal before every submit | Any local run > 10.5 h projected |
| R2 | LoRA scoring stalls persist (KV bug 744331) | Medium | Blocks L5–L8 on the LB | Keep a prompt-only submission ready; stage LoRA variant for the moment the fix lands | Thread 744331 unresolved after Oct 20 |
| R3 | Private-repo distribution shift | High | CV gains don't transfer | T2 held-out-repo tier is the selection metric; repo-agnostic prompts; diverse training repos | T2↔T3 correlation breaks |
| R4 | Thinking-regime change reshuffles LB (no rescoring, 744354) | Certain (already happening) | Old scores mislead | Daily submissions; re-baseline after each organizer patch | Any infra announcement |
| R5 | Kaggle queue + quota friction (community-reported ~30 GPU-h/wk, quota burns while queued) | Medium | Fewer full scoring runs | Schedule off-peak; treat local harness as authoritative; reserve Kaggle for T3 checks | Two consecutive days without a completed run |
| R6 | Overfitting to public LB (small n, half-hidden) | High | Wrong final pick | Select finals by T2 CV with LB as tiebreak | — |
| R7 | Rule breach via teacher model in serving path | Low (process) | Disqualification | Hard wall: submission contains only Gemma-4 weights + our adapters; teacher used offline only; audited data lineage | Any submission build review |
| R8 | Sandbox/test flakiness (locale, wheels) | Medium | False CV signal | Locale prefix; pinned wheelhouse v25; repeat flaky tasks once | Flaky-rate > 3% in T1 |

---

## 9. End-to-end roadmap — milestones

Dates assume a Oct 1 start; the sprint-by-sprint execution plan is Deliverable 2.

| Milestone | Gate date | Exit criteria (measurable) |
|-----------|-----------|----------------------------|
| M0 — Rigs live | Oct 2 | All 3 machines pass Day-0 acceptance; 31B model served on 5090; sandbox builds; 5-task local eval runs end-to-end |
| M1 — Truth established | Oct 7 | Baseline reproduced locally + on Kaggle; T1 harness scores all 129 tasks; error taxonomy v1; first LB entry banked |
| M2 — Brain v1 | Oct 14 | Two-phase architecture + governor on T1/T2; T1 ≥ 0.15, T2 ≥ 0.12; LB ≥ 0.12 |
| M3 — Data engine + SFT v1 | Oct 21 | ≥ 2k verified trajectories incl. teacher-distilled; LoRA v1 trained on 5090 (wheelhouse v25); T1 ≥ 0.20; LB check once LoRA scoring verified |
| M4 — Learning loop | Oct 28 | Rejection-sampling round complete (or GRPO started); T1 ≥ 0.24, T2 ≥ 0.20 |
| M5 — Test-time scaling | Nov 4 | Verifier best-of-N live under governor; T1 ≥ 0.27, T2 ≥ 0.23, LB ≥ 0.20; paper-track go/no-go decided |
| M6 — Consolidation | Nov 11 | Architecture frozen; two final candidates validated on T2; submission engineering (size, determinism, timing rehearsal) done |
| M7 — Endgame cadence | Nov 12 → Dec 2 | Daily submissions; team finalized by Nov 25; two finals chosen by Dec 2 from top-T2 candidates spanning both regimes (prompt-only + LoRA) |
| M8 — Winners package | ≤ Dec 9 | Repo cleaned, OSI license, data lineage, reproducible training recipe, paper (if pursued) |

---

## 10. Master checklist

### A. Environment and infrastructure
- [ ] Day-0 bare-metal setup completed on all three machines (see Deliverable 2)
- [ ] WSL2 + CUDA + PyTorch (sm_120-capable) verified on 5090 rig
- [ ] vLLM serves `gemma-4-31b-it-qat-w4a16-ct` locally; throughput baseline recorded
- [ ] `swebench-sandbox` Docker image builds; 5-task local eval green
- [ ] Kaggle rules accepted; GettingStarted notebook forked and reproduced
- [ ] Dataset (22.4 GB) + model weights staged with backups on LAN storage

### B. Evaluation and data
- [ ] T1 harness: local scoring identical to notebook pipeline; 129/129 tasks runnable
- [ ] Error taxonomy v1 (failure classes × repos × tools)
- [ ] T2 held-out-repo miner: ≥ 30 verified tasks from ≥ 5 non-public repos (fail-to-pass verified)
- [ ] Weekly CV↔LB correlation table started
- [ ] Wheelhouse v25 pinned for all LoRA experiments

### C. Agent brain
- [ ] Two-phase ADK config (Localizer → Coder) with `!include` prompts
- [ ] Per-tool policies encoded in prompts (Section 4.1 table)
- [ ] Failure-mode playbook implemented (compaction re-orientation, write_file fallback, nudge recovery)
- [ ] `budget_governor` skill: pacing, downgrade ladder, 10.5 h global watchdog
- [ ] `eval_config.yaml` failsafes set (`max_time_minutes: 10`, `max_tool_calls: 70`, `max_turns: 250`)
- [ ] Timing rehearsal harness: projects full-run wall-clock from a task sample

### D. Training
- [ ] Trajectory logger + verified-success filter
- [ ] Teacher-distillation pipeline with license-audited, lineage-tracked data
- [ ] SFT LoRA v1 (rank 32–64) trained + evaluated locally vs prompt-only
- [ ] Rejection-sampling round 2 executed
- [ ] GRPO feasibility verdict recorded (proceed or stay on rejection sampling)
- [ ] Multi-LoRA routing tested locally; staged for LB when bug 744331 closes

### E. Test-time compute
- [ ] Verifier v1 (test-signal + judge) offline evaluation on T1
- [ ] Best-of-N integrated behind governor slack gate
- [ ] Ablations: N ∈ {1, 2, 3} × verifier on/off, on T2

### F. Submission operations
- [ ] Submission packaging script (extensions whitelist, ≤ 3 GiB assert, root `agent.yaml` check)
- [ ] Daily submission calendar maintained; every submission logged with T2 score + config hash
- [ ] Two-regime hedge maintained (prompt-only and LoRA variants always submission-ready)

### G. Compliance and endgame
- [ ] Serving-path purity audit (Gemma-4 only) before every submission
- [ ] Entry + team-merge completed by Nov 25
- [ ] Two final submissions selected by Dec 2 (T2-first rule)
- [ ] Open-source package: code, data lineage, training recipe, OSI license
- [ ] Paper-track submission by Nov 12 (if go decision)

---

## 11. Honest unknowns

| Unknown | Why it matters | Watch point |
|---------|----------------|-------------|
| Does the 12 h → score-0 fix land, and when? | Changes risk calculus for long-tail tasks | Thread 743063 |
| Does the LoRA KV-cache fix land? | Gates every training lever on the LB | Thread 744331 |
| Will scores be recomputed after infra fixes? | Today's LB mixes regimes | Thread 744354 |
| Exact hidden-repo identity and task ordering | Front-loading vs uniform spend | Observe T3 score patterns |
| True Kaggle GPU-quota accounting for 4×L4 sessions | Sprint pacing for full scoring runs | Community reports + own logs |

---

## 12. Sources

- Official docs (local): `input/kagglecomp/docs/markdown/Kaggle-01-Overview.md`, `Kaggle-02-Data.md`, `Kaggle-03-GettingStarted.md`, `Kaggle-04-OfficialRules.md`; `input/kagglecomp/kagglecomp_data_package/HARNESS_README.md`
- Kaggle pages fetched 2026-09-30: leaderboard; discussion threads 743063 (scorer semantics, staff), 744331 (LoRA KV), 743508 (LoRA wheels), 744354 (thinking patch), 744272 (double-JSON), plus baseline/scoring threads — dumps in `research-gemma4-agent-2026-09/scratch/pages/`
- Research anchors: mini-SWE-agent; Agentless; SWE-Gym; R2E-Gym (hybrid verifiers); SWE-RL; Mocha-Coder-32B; verl GRPO+LoRA; RTX 5090 vLLM serving playbook; Gemma thinking-mode docs


---

<!-- ====================================================================== -->
<!-- FILE: 02-master-plan-day0-six-sprints.md -->
<!-- ====================================================================== -->

# Task 2 — Master Plan: Day-0 Bare-Metal Setup + Six One-Week Sprints to a Winning Submission

**Gemma 4 Developer Agent Competition — execution plan for a 3-rig Windows 11 lab**

- Date: 2026-09-30 · Kickoff: Thu 2026-10-01 · Finals due: Wed 2026-12-02
- Strategy, architecture, and milestone logic: see `01-agent-brain-roadmap-and-master-checklist.md` (same folder)
- All deadlines are 11:59 PM UTC. Every fact about the competition is sourced per Deliverable 1, Section 12.

---

## 0. Calendar at a glance

| Phase | Dates | Theme | Hard deadline touched |
|-------|-------|-------|-----------------------|
| Day 0 | Thu Oct 1 | Bare-metal bring-up, all three rigs | — |
| Sprint 1 | Oct 1–7 | Truth: baseline + eval infrastructure | — |
| Sprint 2 | Oct 8–14 | Brain v1: architecture + budget governor | — |
| Sprint 3 | Oct 15–21 | Data engine + SFT LoRA v1 | — |
| Sprint 4 | Oct 22–28 | Learning loop (rejection sampling → GRPO) | — |
| Sprint 5 | Oct 29–Nov 4 | Test-time scaling + verifier | Paper-track decision (Nov 12 deadline prep) |
| Sprint 6 | Nov 5–11 | Consolidation + freeze | — |
| Endgame | Nov 12–Dec 2 | Daily cadence + final submissions | Paper Nov 12 · Entry/merge Nov 25 · Finals Dec 2 |

---

## 1. Hardware roster and role assignment

| Rig | Specs | Role | Why this role | OS plan |
|-----|-------|------|---------------|---------|
| **Main — PowerSpec G914** | Ryzen 9 9950X3D, X870E Tomahawk, 64 GB DDR5-6000, RTX 5090 32 GB, 2 TB NVMe, 5 GbE/WiFi 7, Win 11 Pro | Model serving, SFT/RL training, T1 eval, primary dev | Only rig that fits 31B W4A16 (~17 GB weights) with room for LoRA + KV; fastest iteration loop | Win 11 Pro host + **WSL2 Ubuntu 24.04** for vLLM/training (Linux-only stack) |
| **AUX 1 — ASUS ProArt P16** | Ryzen AI 9 HX 370, RTX 4060 8 GB, 32 GB LPDDR5X, 1 TB, Win 11 Home | Data prep, tokenization, verifier/judge training (small models), paper writing | 8 GB VRAM suits ≤ 8B-class models and CPU-GPU mixed data work; independent of main rig's training jobs | Win 11 Home host + WSL2 (Home supports WSL2 + Docker Desktop) |
| **AUX 2 — ASUS ROG Strix G15CF** | i7-12700F (12C/20T), 64 GB DDR4, 512 GB SSD + 2 TB HDD, RTX 3080 10 GB, **550 W PSU** | 24/7 sandbox verification pool (Docker pytest fan-out), T2 task mining, cold storage via SMB | Many CPU cores + 64 GB RAM = parallel sandboxes; 3080 idle or small vLLM | Windows host + Docker Desktop; **cap GPU power ~270 W via MSI Afterburner (550 W PSU)** |

Networking: main rig on 5 GbE; enable SMB share of ROG's 2 TB HDD as LAN cold-storage target; git over LAN (bare repo on NAS share) or GitHub private repo.

---

## 2. Day 0 (Thu Oct 1) — bare-metal bring-up

### 2.1 Main rig (PowerSpec G914) — the production lab

| # | Step | Detail / command |
|---|------|------------------|
| 1 | BIOS update + settings | Flash latest MSI BIOS; enable **EXPO** (DDR5-6000), **Resizable BAR**, Above-4G Decoding; confirm 5090 detected at x16 |
| 2 | Windows 11 Pro baseline | Windows Update to current; activate BitLocker on D:\ if desired; High Performance power plan |
| 3 | NVIDIA driver | Latest 580+ series driver (Blackwell sm_120 support). Install on **Windows host only** — CUDA in WSL2 uses the host driver's `libcuda` |
| 4 | WSL2 | `wsl --install -d Ubuntu-24.04` then `wsl --update`; set default version 2 |
| 5 | WSL memory config | `%UserProfile%\.wslconfig`: `memory=48GB`, `processors=16`, `swap=32GB`, `autoMemoryReclaim=gradual`; `wsl --shutdown` to apply |
| 6 | Verify GPU in WSL | `nvidia-smi` inside Ubuntu must list RTX 5090, driver 580+ |
| 7 | Python toolchain (WSL) | Install `uv`; `uv python install 3.12`; make project venv |
| 8 | PyTorch + vLLM | `uv pip install torch --index-url https://download.pytorch.org/whl/cu128` (≥ 2.7 required for sm_120), then latest `vllm`; verify `torch.cuda.get_device_capability() == (12, 0)` |
| 9 | Model download | Accept license on the Kaggle model page, then fetch `gemma-4-31b-it-qat-w4a16-ct` via Kaggle CLI/web into `~/models/` (≈ 17–20 GB) |
| 10 | Smoke-serve | `vllm serve ~/models/gemma-4-31b-it-qat-w4a16-ct --max-model-len 32768` — record decode tok/s as the perf baseline |
| 11 | Docker Desktop | Install with WSL2 backend; `docker run hello-world` |
| 12 | Competition dataset | Download competition data (22.4 GB) via Kaggle CLI to Windows `D:\kaggle\`; build sandbox: `docker build -f docker/Dockerfile.sandbox -t swebench-sandbox:latest .` |
| 13 | Eval libraries | Install `swegemma` / `adk-submission` / `adk-eval-core` per GettingStarted notebook (pinned wheels from the dataset); **pin wheelhouse v25** for LoRA correctness |
| 14 | Repo scaffold | `git init` greenfield repo: `agent/` (ADK configs), `eval/` (harness scripts), `data/` (mined tasks), `training/` (SFT/RL), `ops/` (submission scripts); `git config core.autocrlf false` and `core.longpaths true` on Windows side |
| 15 | Acceptance test | Run the harness end-to-end on 5 public tasks (agent = sample submission); expect PASS on at least the trivial tasks and a wall-clock log per phase |

Day-0 acceptance gate (main rig): steps 6, 10, 11, 12, 15 all green.

### 2.2 AUX 1 (ProArt P16) — data + verifier rig

| # | Step | Detail |
|---|------|--------|
| 1 | Driver + WSL2 | Latest NVIDIA driver; `wsl --install -d Ubuntu-24.04`; `.wslconfig`: `memory=20GB` |
| 2 | Toolchain | `uv` + PyTorch cu128 + `transformers`/`peft`/`trl`; verify 4060 visible |
| 3 | Data tools | Kaggle CLI; HF datasets; tokenizer/score-analysis notebooks |
| 4 | Role smoke test | Tokenize 129 task problem statements + embed with a small local model; write results to the LAN share |
| 5 | Paper workspace | Shared repo folder `paper/` for the optional Nov 12 paper track |

### 2.3 AUX 2 (ROG Strix G15CF) — verification pool

| # | Step | Detail |
|---|------|--------|
| 1 | Power safety | MSI Afterburner: cap 3080 power target ≈ 270 W (**550 W PSU — do not skip**); verify stability |
| 2 | Docker + sandbox | Docker Desktop; build `swebench-sandbox:latest` and the public variant |
| 3 | Storage | Format 2 TB HDD as snapshot/cold-storage volume; enable SMB share; main rig maps it as backup target |
| 4 | Worker pool | Script `ops/verify_pool.py`: N parallel containers running fail-to-pass/pass-to-pass checks for T2 mining and trajectory filtering (CPU-bound; GPU optional) |
| 5 | Acceptance | 8 containers × 30 min sustained without thermal throttle or PSU trip |

### 2.4 Kaggle-side (Day 0, any machine)

- [ ] Accept competition rules (required before Nov 25 entry deadline — do it now)
- [ ] Fork + run the official GettingStarted notebook once to see a real scoring run
- [ ] Record queue behavior and quota accounting for 4×L4 sessions (community reports: ~30 GPU-h/week; quota burns while queued)
- [ ] First safe submission = unmodified sample baseline (banks a score and a regime datapoint)

---

## 3. Sprint 1 (Oct 1–7) — Truth: baseline, eval infrastructure, error taxonomy

**Goal:** know exactly where the sample agent loses, on hardware we control, with numbers we trust.

| Day | Focus |
|-----|-------|
| 1 | Finish Day-0 acceptance; run sample submission end-to-end on all 129 public tasks (5090, sandbox pool on AUX 2) |
| 2 | Build T1 scoring reports: resolve rate, per-task wall-clock, tool-call histograms, failure classes |
| 3 | Error taxonomy v1: localize-fail vs edit-fail vs verify-fail vs timeout vs format; cross-tab by repo |
| 4 | Stand up experiment ledger: config hash → T1/T2 scores; automate submission packaging (`ops/package.py`: extensions whitelist, ≤ 3 GiB assert, root `agent.yaml` check) |
| 5 | Submit improved prompt-only variant #1 to Kaggle (banks regime datapoint); start T2 task miner design |
| 6 | T2 miner v0 running on AUX 2 (mine candidate commits from 5+ popular Python repos) |
| 7 | Sprint review: baseline numbers written down; LB datapoint logged; CV↔LB tracking table started |

**Exit criteria:** full 129-task local run reproducible; taxonomy explains ≥ 80% of failures; ≥ 1 LB entry banked.

---

## 4. Sprint 2 (Oct 8–14) — Brain v1: architecture + budget governor

**Goal:** two-phase ADK brain (Localizer → Coder) with the budget governor, beating the prompt-only baseline on both T1 and T2.

| Day | Focus |
|-----|-------|
| 1 | Write `agent.yaml` `SequentialAgent`: read-only Localizer (graph tools, suspect-symbol shortlist) → Coder (reproduce → patch → verify) |
| 2 | Per-tool policies into prompts (read ranges, `search_similar_code` with identifiers, `write_file` fallback after 2 failed edits) |
| 3 | `budget_governor` skill: pacing via `get_status`, downgrade ladder, 10.5 h global watchdog logic; `eval_config.yaml` failsafes (`max_time_minutes: 10`, `max_tool_calls: 70`, `max_turns: 250`) |
| 4 | Compaction hardening: state re-injection prompt; byte-stable system prompt for context cache |
| 5 | Full T1 run of brain v1; fix the top 3 failure classes |
| 6 | T2 run + timing rehearsal (projected 120-task wall-clock ≤ 10.5 h); submit to Kaggle |
| 7 | Sprint review: T1/T2/LB deltas; decide what the trajectory logger must record for Sprint 3 |

**Exit criteria (per Deliverable 1, M2):** T1 ≥ 0.15, T2 ≥ 0.12, LB ≥ 0.12; full-run wall-clock projection ≤ 10.5 h.

---

## 5. Sprint 3 (Oct 15–21) — Data engine + SFT LoRA v1

**Goal:** trajectory dataset + first fine-tuned adapter that beats prompt-only.

| Day | Focus |
|-----|-------|
| 1 | Trajectory logger live (tool traces + outcomes); run brain v1 over all 129 public tasks, log everything |
| 2 | Verified-success filter on AUX 2 pool (fail-to-pass green = keep) |
| 3 | Teacher distillation: external frontier LLM writes/reairs gold trajectories for failure cases (staff-confirmed allowed for training data); convert to harness tool-trace format; license + lineage audit |
| 4 | SFT data pipeline on AUX 1 (tokenize, pack, format masks on tool-call tokens); target ≥ 2k trajectories |
| 5 | Train SFT LoRA v1 (rank 32–64) on 5090: QAT base + LoRA + gradient checkpointing; wheelhouse-v25-consistent adapter format |
| 6 | Evaluate LoRA v1 vs prompt-only on T1 slice; check adapter loads cleanly in vLLM (`max_lora_rank=128` path) |
| 7 | Sprint review + Kaggle probe; watch thread 744331 (LoRA KV-cache) before burning a submission on LoRA |

**Exit criteria (M3):** ≥ 2k verified trajectories incl. distilled; LoRA v1 T1 ≥ 0.20; adapter validated locally.

---

## 6. Sprint 4 (Oct 22–28) — Learning loop

**Goal:** self-improvement round: rejection sampling (STaR) as the workhorse; GRPO only if it fits.

| Day | Focus |
|-----|-------|
| 1–2 | Rejection sampling round: re-decode Sprint 3 failures at higher temperature on 5090; verify wins on AUX 2 pool; merge into SFT dataset |
| 3 | Retrain LoRA v2; T1/T2 eval |
| 4 | GRPO spike (verl-style, binary pass reward) on 5090: measure tokens/s and stability at rank-64 LoRA on the 31B QAT base |
| 5 | **GRPO go/no-go:** if throughput can't complete a meaningful update in ≤ 2 days of GPU time, stay on rejection sampling and say so in the ledger |
| 6 | Verifier design freeze: primary = sandbox test signal; secondary = small judge model trained on AUX 1 (patch diff → pass probability) |
| 7 | Sprint review + submission (best config by T2) |

**Exit criteria (M4):** T1 ≥ 0.24, T2 ≥ 0.20; learning-loop decision documented.

---

## 7. Sprint 5 (Oct 29–Nov 4) — Test-time scaling within the budget

**Goal:** verifier-gated best-of-N live; private-repo robustness hardening.

| Day | Focus |
|-----|-------|
| 1 | Best-of-N offline study on T1: N ∈ {1, 2, 3} × verifier on/off; measure resolve-rate vs added wall-clock |
| 2 | Integrate winner behind governor slack gate (best-of-N only when projected slack ≥ N × 4.5 min) |
| 3 | Repo-agnostic prompt audit: remove any fastapi/rich-specific phrasing; re-test on T2 |
| 4 | Expand T2 set (target ≥ 50 tasks); stratified eval: does T2 gain match T1 gain? If not, fix distribution shift first |
| 5 | Multi-LoRA routing (coder + navigator adapters) tested locally — staged for LB **only** after thread 744331 closes |
| 6 | Paper-track go/no-go (deadline Nov 12): the trajectory data + verifier results are already paper-shaped; draft outline if go |
| 7 | Sprint review + submission; LB should now reflect the fixed thinking regime |

**Exit criteria (M5):** T1 ≥ 0.27, T2 ≥ 0.23, LB ≥ 0.20; best-of-N ablation table complete.

---

## 8. Sprint 6 (Nov 5–11) — Consolidation and freeze

**Goal:** freeze the architecture, validate the two final candidates, de-risk submission engineering.

| Day | Focus |
|-----|-------|
| 1 | Freeze config A (prompt-only brain, best-of-N) — the infra-risk hedge |
| 2 | Freeze config B (A + LoRA v2) — the capability max |
| 3 | Both configs: 3× repeat T2 runs (variance estimate); determinism check (seeded decode) |
| 4 | Full timing rehearsals on Kaggle-matched settings (TP=4 emulation isn't possible locally — use queue-time sessions for one full 8 h dress rehearsal of each config) |
| 5 | Submission package audit: size ≤ 3 GiB, extension whitelist, `agent.yaml` root, skills sandbox-clean, serving-path purity (Gemma-4 only) |
| 6 | Submit both configs; log T3 datapoints |
| 7 | Sprint review: freeze report (configs, hashes, expected scores with error bars) |

**Exit criteria (M6):** two final candidates with T2 means + variance; zero engineering unknowns left.

---

## 9. Endgame (Nov 12 – Dec 2)

| Date | Action |
|------|--------|
| Nov 12 | Paper-track submission deadline (if go) |
| Nov 12–24 | Daily submission cadence continues; organizer infra fixes (LoRA KV, 12 h scoring) each trigger a same-day probe |
| Nov 25 | **Entry + team-merge deadline** — confirm roster, rules acceptance, quota |
| Nov 26–30 | Finals selection: T2-first rule; pick two candidates that hedge regime risk (one prompt-only, one LoRA) |
| Dec 1 | Dry-run both finals end-to-end one last time; freeze hashes |
| Dec 2 | **Final submission deadline** — submit the two selected finals |
| ≤ Dec 9 | If in winner zone: open-source package (code, data lineage, training recipe, OSI license) |

Daily cadence rules: one submission per day, every day, logged (config hash, T2 score, LB score, regime notes). Public LB never overrides T2 for selection — it sees only half the hidden set.

---

## 10. Weekly operations cadence and budgets

| Resource | Budget | Policy |
|----------|--------|--------|
| 5090 (main) | Effectively unlimited (electricity) | Serving + training + T1 slices; nightly full runs when idle |
| AUX 2 pool | 24/7 | Trajectory verification + T2 mining; GPU power-capped |
| AUX 1 | Daytime | Data prep, judge training, paper |
| Kaggle 4×L4 | ~30 GPU-h/wk (community-reported; burns while queued) | Reserve for: full dress rehearsals + LB probes; queue at low-traffic hours (US night) |
| Submissions | 2/day max, counted at queue time | Default 1/day; 2/day only in endgame or after infra announcements |
| Teacher API | Fixed weekly cap set in Sprint 3 | Distillation only; never in the serving path |

---

## 11. Milestone and exit-criteria master table

| Milestone | Gate date | Measurable exit criteria |
|-----------|-----------|--------------------------|
| M0 Rigs live | Oct 2 | Day-0 acceptance green on all 3 rigs; 31B served; 5-task eval green |
| M1 Truth | Oct 7 | 129-task local run reproducible; taxonomy ≥ 80% coverage; LB entry banked |
| M2 Brain v1 | Oct 14 | T1 ≥ 0.15 · T2 ≥ 0.12 · LB ≥ 0.12 · projected wall-clock ≤ 10.5 h |
| M3 SFT v1 | Oct 21 | ≥ 2k verified trajectories; LoRA v1 T1 ≥ 0.20 |
| M4 Learning loop | Oct 28 | T1 ≥ 0.24 · T2 ≥ 0.20; GRPO go/no-go documented |
| M5 Test-time scaling | Nov 4 | T1 ≥ 0.27 · T2 ≥ 0.23 · LB ≥ 0.20; best-of-N ablations done; paper go/no-go |
| M6 Freeze | Nov 11 | Two finals candidates with variance estimates; package audit clean |
| M7 Endgame | Dec 2 | Daily cadence kept; team final by Nov 25; two finals submitted |
| M8 Winners package | ≤ Dec 9 | OSI-licensed repo, lineage, recipe, paper (if pursued) |

---

## 12. Risks and contingencies (execution view)

| Trigger (tripwire) | Contingency |
|--------------------|-------------|
| Any local full-run projects > 10.5 h | Tighten governor ladder; drop best-of-N; re-rehearse before submitting |
| Thread 744331 (LoRA KV) still open after Oct 20 | Shift Sprint 4–5 effort to prompt/rejection-sampling track; keep config A as primary final |
| T2↔LB correlation breaks | Re-audit T2 miner against organizer pipeline; rebuild T2; stop trusting T2 until fixed |
| Kaggle queue blocks > 2 days | Raise local TP=1 confidence interval; pair-program scoring semantics from `submission.parquet` logs |
| GRPO unstable / OOM on 32 GB | Permanent fallback = iterative rejection sampling (documented in ledger) |
| 550 W PSU trip on AUX 2 | Lower 3080 cap to 220 W or disable GPU jobs on that rig (CPU pool is the point) |
| Infra announcement mid-sprint | Same-day probe submission; sprint goals may reshuffle but milestone gates do not |

---

## 13. Compliance and hygiene checklist (standing)

- [ ] Serving path contains only `gemma-4-31b-it-qat-w4a16-ct` + our LoRA adapters — audited before every submission
- [ ] Training data lineage recorded (source repo, license, teacher model + version where used)
- [ ] "Reasonableness" standard respected for all external data (public repos, permissive licenses)
- [ ] Rules accepted + team roster locked before Nov 25
- [ ] Winners' open-source obligation pre-staged (repo hygiene, OSI license choice, README + recipe)
- [ ] Experiment ledger append-only; every LB score traceable to a config hash

---

## 14. Appendix — Day-0 command crib sheet

```bash
# === Windows host (PowerShell, admin) ===
wsl --install -d Ubuntu-24.04
wsl --update
# %UserProfile%\.wslconfig -> memory=48GB, processors=16, swap=32GB
wsl --shutdown

# === WSL2 Ubuntu 24.04 (main rig) ===
nvidia-smi                              # must show RTX 5090, driver 580+
curl -LsSf https://astral.sh/uv/install.sh | sh
uv python install 3.12 && uv venv .venv && source .venv/bin/activate
uv pip install torch --index-url https://download.pytorch.org/whl/cu128
python -c "import torch; print(torch.cuda.get_device_capability())"   # (12, 0)
uv pip install vllm
vllm serve ~/models/gemma-4-31b-it-qat-w4a16-ct --max-model-len 32768

# === Dataset + sandbox ===
pip install kaggle && kaggle competitions download -c gemma-4-developer-agent
docker build -f docker/Dockerfile.sandbox -t swebench-sandbox:latest .
# Eval libraries: install pinned wheels per official GettingStarted notebook (wheelhouse v25 for LoRA)

# === AUX 2 (ROG Strix) power safety ===
# MSI Afterburner: RTX 3080 power target ~270 W (550 W PSU) — verify with a 30 min burn-in
```

Notes: `kaggle models` download requires accepting the model license on the website first. vLLM and flash-attention are Linux-first — run all serving/training inside WSL2, never native Windows. Keep HF/model caches on the WSL ext4 filesystem (much faster than `/mnt/d`).


---

<!-- ====================================================================== -->
<!-- FILE: 03-paper-track-intelligence-report.md -->
<!-- ====================================================================== -->

# Intelligence Report — The Gemma 4 Developer Agent Paper Track

**Deep examination of the paper-competition landing site, with offline mirror and strategic findings**

- Date: 2026-09-30
- Source: [https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/) (scraped via the research toolkit; no MCP quota used)
- Offline mirror: [paper-track-website/](paper-track-website/) — every page and discussion thread saved as markdown for local viewing (see its README for the inventory)
- Method note: all scraped content treated as untrusted data; host claims verified by the COMPETITION HOST badge on the posting account (Elan Markowitz, Google)

---

## 1. Executive summary

1. The paper track is the **sibling competition** to the leaderboard competition: instead of fixing bugs, you submit a **Kaggle Writeup** (max **3,000 words**) of original, unpublished research advancing agentic software engineering. Kaggle classifies it as a **Featured Hackathon**; it awards **no points or medals**, only prize money.
2. It is a **separate competition with a separate entry action**: you must join this hackathon itself to submit — joining the main competition is explicitly not required (but is encouraged). Main-track participation is also not required *to win*; independent research qualifies.
3. The field is **thin**: 2,539 entrants but only **84 participants / 84 teams / 86 "submissions"** as of 2026-09-30, and the discussion is mostly team-hunting noise. Real competitive writeups likely number in the few dozen.
4. **Two of the three prizes ($10K Best New Resource, $10K Best New Application) are underexploited by the field** — and the organizers' own illustrative examples (a fine-tuning/eval dataset built from the provided embeddings; a library that clusters code by behavior; a repo-exploration dashboard) effectively hand over winning blueprints.
5. The timeline interlocks with the main competition: paper deadline **Nov 12, 2026** lands mid-endgame of the main plan's Sprint 6 (see `01-agent-brain-roadmap-and-master-checklist.md`, same folder). The experiment ledger, ablations, and trajectory data produced for the main track convert directly into a Best Paper submission — one research program, two prize pools ($65K + $35K).
6. Two operational facts demand early action: a **tie goes to the writeup entered first**, and a **platform bug gated all writeup saves** on Sep 29 (`CheckHackathonWriteupConflict` → 404; host following up Sep 30). Create, save, and submit early; drafts are never judged.

---

## 2. What was scraped (offline mirror inventory)

| File (in [paper-track-website/](paper-track-website/)) | Page | Capture status | Intelligence value |
|---------------------------------------------------------|------|----------------|--------------------|
| 01-overview.md | /overview | Full render | Rubric, prizes, submission format, topics, judge, participation stats |
| 02-rules.md | /rules | Full render | Competition-specific terms: winners license, external-data Reasonableness standard |
| 03-data.md | /data | 404 page | Confirms: no dataset tab — the paper track has no data of its own |
| 04-leaderboard.md | /leaderboard | Empty shell | Vestigial template (boilerplate 30%/70% text, empty table) — papers are not publicly ranked |
| 05-discussion.md | /discussion | Full render | 7 topics; no deeper pagination observed |
| 06-code.md | /code | Empty | No public notebooks attached yet |
| 07-writeups.md | /writeups | Gated | Requires joining the hackathon to view submissions |
| thread-743012.md | Welcome thread | Full | Track scope; names DiffusionGemma as an application target |
| thread-743094.md | Writeup-save bug | Full | Save-path 404 regression; host engaged |
| thread-743255.md | Writeup count + eligibility | Full | Host: 2-writeup cap, prize-eligibility mechanics, dataset-republish allowance |
| thread-743310.md | Archival status | Full | Host: non-archival; arXiv parallel submission encouraged |
| thread-743314.md | Minors eligibility | Full | Ages 13–17 eligible with guardian-consent forms |
| thread-743681.md, thread-743844.md | Looking for Team | Full | Team-matching noise; signal about the field's composition |

---

## 3. Competition facts (verified against overview + rules pages)

| Item | Value |
|------|-------|
| Official title | Google - The Gemma 4 Developer Agent Paper Track |
| Kaggle classification | Featured Hackathon (no Points/Medals) |
| Start date | September 22, 2026 |
| Final submission deadline | **November 12, 2026, 11:59 PM UTC** (writeups not formally submitted by then are never judged) |
| Prize pool | $35,000 |
| Submission vehicle | Kaggle Writeup (via "New Writeup" → Save → Submit button); optional arXiv-ready PDF via Public Project Link; optional public notebook in Project Links |
| Word limit | 3,000 words, original and unpublished |
| Archival status | Non-archival; parallel submission to conferences **and arXiv** explicitly allowed and encouraged (host, thread 743310) |
| Team size | Max 5; single account per person; no private sharing outside teams |
| Main-track participation | Not required to submit or win (encouraged for both) |
| Judge (named) | Elan Markowitz, Machine Learning Engineer, Google (only judge listed) |
| Winners' highlight | Google-hosted expo during NeurIPS 2026 — promised **only for prize-winning submissions** (host, thread 743310) |
| Participation (2026-09-30) | 2,539 entrants · 84 participants · 84 teams · 86 submissions |
| Data tab | None — the paper track has no dataset; the main competition's dataset is the referenced resource |

---

## 4. Evaluation rubric

Five criteria, each scored 0–5 by judges; final score = average of all five. The three prizes go to the top-scored submissions. **Rubric evaluations are not shared with participants.**

| Criterion | What judges ask | Practical meaning |
|-----------|-----------------|-------------------|
| Novelty | New insights, deeper understanding, or important properties of existing methods? | A rigorous negative result or characterization can score well; pure engineering reports score poorly |
| Quality | How general and universal is the approach beyond this competition? Does it translate to similar problems? | Frame methods as benchmark-agnostic; this competition is the case study, not the point |
| Relevance | Significance and potential impact on software engineering and agentic learning? | Tie to the offline/consumer-hardware agent narrative the hosts are pitching |
| Verifiability | Enough detail to understand how the innovation works and how data was obtained, analyzed, interpreted? | Keep the experiment ledger, configs, seeds, and data lineage — they are the verifiability story |
| Clarity | Clearly presented and written? | 3,000 words is tight: outline must map 1:1 onto the rubric |

Prize-context scoring (host, thread 743255): the same five criteria are applied to Resource and Application entries, **but scored in the context of that prize** (e.g., "novelty of the resource").

---

## 5. Prizes and tracks

| Award | Prize | Organizer's own examples (quoted/paraphrased from the overview) |
|-------|-------|-----------------------------------------------------------------|
| Overall Best Paper | $15,000 | Highest average rubric score of all submissions; empirical papers generating new knowledge/experiments |
| Best New Resource (dataset, library, etc.) | $10,000 | A dataset built from the provided embeddings for evaluating or fine-tuning Gemma 4; a library using Gemma plus an algorithm to cluster code by underlying behavior; a dashboard to explore GitHub repos structurally similar to a target repo |
| Best New Application | $10,000 | New use cases, e.g., code-graphs for writing TPU kernels; creative uses of code-graphs/embeddings, new evaluation datasets for novel tasks, application to benchmarks beyond the provided ones |

Eligibility mechanics (host, thread 743255):

| Rule | Detail |
|------|--------|
| Writeups per team | **At most two** — "quality over quantity" |
| Prize tracks | There is a **single submission track**; judges determine which prize each writeup competes for |
| Multi-award eligibility | One writeup may be considered for several awards but can win only one — winning Best Paper removes it from Resource/Application contention |
| Tie-breaker | The writeup **entered first** wins |
| Disqualification | Next-highest scored paper is promoted |

---

## 6. Submission requirements checklist

A valid Writeup must contain:

- [ ] Title and subtitle
- [ ] Abstract
- [ ] Introduction
- [ ] Description of the research, including methods and experiments
- [ ] Related works and citations
- [ ] ≤ 3,000 words total
- [ ] Formally **submitted** (not just saved) before Nov 12, 11:59 PM UTC — drafts are not considered

Optional assets:

- [ ] Public notebook in the Project Links field (must be publicly accessible, no login/paywall)
- [ ] arXiv-ready LaTeX/Word PDF of the paper via Public Project Link (publicly accessible)
- [ ] Caution: any **private** Kaggle resource attached to the writeup is automatically made public after the deadline

---

## 7. Organizer clarifications from the discussion (all host-verified)

| Thread | Question | Host answer (Elan Markowitz) |
|--------|----------|------------------------------|
| 743255 | How many writeups per team? | Max two; quality over quantity |
| 743255 | Separate judging for Resource/Application prizes? | Same five criteria, applied in the context of each prize |
| 743255 | Can one writeup win multiple awards? | Considered for several, wins at most one; Best Paper precludes the others |
| 743255 | May a resource rebuild datasets (graphs/embeddings) from the public upstream repos (fastapi, rich, requests, httpx) despite no-redistribution rules? | Yes, **with citation and a link to the Kaggle dataset** — that is not redistributing the public dataset; host will double-check the exact rule wording |
| 743310 | Is the Google-hosted event archival? | Non-archival; only prize winners promised highlight; parallel arXiv submission is "allowed and encouraged (it is even one of the submission options)" |
| 743094 | Writeup save broken? | Platform regression: `CheckHackathonWriteupConflict` returns 404, gating **all** writeup save paths (reported Sep 29); host asking on Sep 30 whether it persists |
| 743012 | Topic scope | Welcome thread adds **DiffusionGemma** to the novel-applications examples alongside Gemma 4 and code graphs |
| 743314 | Can minors participate? | Ages 13–17 with the two Kaggle guardian-consent forms; under 13 ineligible |

---

## 8. Rules intelligence (competition-specific terms in the rules page)

| Clause | Content | Implication |
|--------|---------|-------------|
| Winners license | Winning submission **and the source code used to generate it** must be licensed under an OSI-approved license that does not limit commercial use | Choose permissive licenses for your paper's code from day one (MIT/Apache-2.0); avoid GPL-contaminated tooling in the paper pipeline |
| External data/models | Allowed under the "Reasonableness" standard; the rules explicitly bless "a small subscription charge to use additional elements of a large language model such as Gemini Advanced" | Teacher-model distillation and API-assisted experiments are defensible for the paper; document cost/accessibility for the Reasonableness audit |
| Automated ML tools | Permitted with proper licensing | No barrier to AutoML-generated baselines |
| Publicity | Sponsor/Kaggle may use your name and likeness for promotion without additional compensation | Standard; no action |
| Prize splitting | Even shares between team members unless the team unanimously opts otherwise before payout | Set the split in writing early |
| Eligibility | Competition-entity employees may enter but not win | — |
| Accounts | One account per person; entering from multiple accounts is banned | — |
| Determining winners | The rules template references public/private leaderboards (30%/70% boilerplate) | Vestigial for this track — the leaderboard tab is empty; **no public ranking exists**, so you get zero signal about how your writeup is scoring |

---

## 9. Competitive landscape

| Signal | Reading |
|--------|---------|
| 86 "submissions" vs 84 participants | Most engagement is join-clicks, not papers; expect a few dozen real writeups by Nov 12 |
| Discussion: 7 topics, 2 team-hunting, 1 minor's eligibility, 1 bug report, 3 substantive | No evidence of organized strong teams; the RL-credentialed team-seekers (thread 743681) signal that "RL for SWE agents" will be a crowded paper topic |
| Writeups tab gated until joining | Public writeups of rivals are not visible until you join — join early to monitor the field |
| Code tab empty | No public notebooks to learn from yet — first movers define the visible frontier |
| Single named judge; no public scores | Judging is opaque; the only lever is maximizing rubric fit and submitting early (tie rule) |

---

## 10. Strategic implications

1. **One research program, two prize pools.** The main-track work plan (graph-assisted localization, budget-constrained SFT/LoRA, verifier-gated best-of-N under a 12-hour wall clock) is a Best Paper writeup waiting to be outlined. Its artifacts — experiment ledger, ablation tables, failure taxonomies, trajectory datasets — directly satisfy Verifiability.
2. **The two-writeup cap invites a portfolio.** Writeup A: the methods paper (Best Paper track). Writeup B: a Resource or Application entry — e.g., a regenerated/extended code-graph + embedding dataset with citation and Kaggle-dataset link (explicitly blessed by the host, pending their rule double-check), or a repo-exploration/behavior-clustering tool matching the organizer's own examples. Two entries double the prize surface while the cap permits it.
3. **Generalization is the rubric's center of gravity.** "Quality" explicitly rewards approaches that translate beyond this competition. Frame everything as *graph-based SWE agents under realistic wall-clock budgets*, with the Gemma 4 competition as the evaluation vehicle — this also positions the work for post-competition NeurIPS-track submission (non-archival status allows it).
4. **Differentiated angles worth considering:** DiffusionGemma applications (named only in the Welcome thread — most entrants will read only the overview); benchmark-agnostic evaluation of graph-tool value-add; failure-mode taxonomies of small-model SWE agents under hard time budgets.
5. **Timeline fit.** Nov 12 sits one day before Sprint 6 of the master plan ends (Nov 5–11). Draft the writeup in Sprint 5 from the live ledger, freeze numbers in Sprint 6, submit by **Nov 8–10** — early enough to beat the tie rule and absorb any recurrence of the save-path bug.
6. **Join now, save early, submit early.** The writeup editor's save path broke for at least a day two weeks before the deadline; drafts are never judged; ties go to the earlier entry. All three facts converge on one behavior: have a submitted, valid writeup days before Nov 12, then update it if the platform allows.

---

## 11. Risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|------|------------|--------|------------|
| 1 | Writeup-save bug recurs near the deadline | Medium | Submission lost | Create + save skeleton immediately after joining; submit a complete draft by Nov 8; verify the Submit button state |
| 2 | Resource-entry redistribution rule tightens after host's "double check" | Low–medium | Writeup B's dataset approach invalidated | Keep Writeup B convertible to an Application entry (tool/dashboard) that does not republish data |
| 3 | Opaque judging (no rubric feedback, single named judge) | Certain | Misallocated effort | Outline the paper against the five published criteria; get external review passes for clarity |
| 4 | 3,000-word cap forces cutting verifiability detail | High | Verifiability score drops | Put configs/seeds/lineage in the public notebook or arXiv PDF and cite them from the writeup |
| 5 | Private resource accidentally auto-published after deadline | Low | IP leakage | Audit all attached resources; keep private artifacts unlinked from the writeup |
| 6 | Crowding on "RL for SWE agents" topic | Medium | Novelty score dilution | Differentiate via budget-constrained setting, graph-tool ablations, or DiffusionGemma angle |

---

## 12. Recommended actions

- [ ] Join the paper-track hackathon now (separate entry from the main competition; also unlocks the Writeups tab for monitoring rivals)
- [ ] Create and save a Writeup skeleton this week (title, section headers mapped 1:1 to the rubric) — hedges the save-path bug
- [ ] Decide the two-writeup portfolio split (methods paper + resource/application entry) by mid-October
- [ ] Route all paper-track code through permissive OSI licensing from the start (winners' license requires it)
- [ ] Draft Writeup A in Sprint 5 directly from the experiment ledger; freeze numbers in Sprint 6
- [ ] Submit final writeups Nov 8–10 (beats tie rule and deadline-platform risk), after arXiv parallel posting if desired
- [ ] Track thread 743255 for the host's promised double-check of the dataset-republish rule before committing Writeup B's design

---

## 13. Open questions

| Question | Watch point |
|----------|-------------|
| Will the host confirm the dataset-republish allowance in writing? | Thread 743255 follow-up |
| Is the judging panel larger than the one named judge? | Overview Judges section updates |
| Do writeups become publicly visible before the deadline once submitted? | Writeups tab behavior after joining |
| Does the paper track share the main competition's Nov 25 team-merger deadline? | Not listed on the paper-track overview; rules boilerplate references a merger deadline generically — confirm before planning any team merge |
| What exactly does "highlighted at a Google hosted event" entail for winners? | Post-award communication |

---

## 14. Sources

- Online (all fetched 2026-09-30 via the research toolkit): the seven paper-track pages and seven discussion threads listed in Section 2; raw markdown in [paper-track-website/](paper-track-website/)
- Local: `webfetch/browser-deep-wide-research-prompt-v4.md` (governing research workflow); sibling deliverables in this folder (`01-…roadmap…`, `02-…master-plan…`) for the main-track context referenced in Section 10


---

<!-- ====================================================================== -->
<!-- FILE: 04-bcf-review-and-master-plan-integration.md -->
<!-- ====================================================================== -->

# Task 1 — BCF Document Review: Useful Areas, Integration into the Master Plan, and Whitepaper Brainstorm

**Examination of `input/kagglecomp/docs/markdown/` (competition rules) and the `bcf/` subfolder (Batonic Coding Framework)**

- Date: 2026-09-30
- Documents examined: `bcf/BCF-Reference-Compendium.md` (944 lines), `bcf/BCF-contestsubmission_dossier_20260928.html` (4,514 lines), `input/kagglecomp/docs/markdown/Kaggle-00-Complete.md` (1,166 lines, merged rules/data/notebook/harness), plus `Kaggle-01..04`.
- Plan being amended: [02-master-plan-day0-six-sprints.md](02-master-plan-day0-six-sprints.md) (same folder). Companion deliverable: [05-bcf-math-whitepaper-draft3-foundations.md](05-bcf-math-whitepaper-draft3-foundations.md) (Task 2: the math).

---

## 1. Verdict on the BCF corpus

The corpus is **substantially useful** — with one discipline to enforce: the dossier's own provenance ledger marks which claims are measured, designed, illustrative, or retracted. Everything below respects those labels. Three corpus findings change the master plan immediately:

| # | Finding (from the corpus) | Effect on the master plan |
|---|---------------------------|---------------------------|
| 1 | The dossier **retracts** the multi-agent tree as primary: a community report found a single flat agent calls tools more reliably with Gemma 4 | Master plan's Sprint 2 core (SequentialAgent Localizer → Coder) becomes **Config B (ablation)**; a flat single agent with phase-gated tool scoping becomes **Config A (primary)** |
| 2 | The dossier **retracts** runtime use of `test_patch`: the agent never sees it, so issue classification must run on **issue text alone** | The Phase 1a classifier must be issue-text-only; T2 mining and spec templates can use `test_patch`, the runtime brain cannot |
| 3 | The compendium records OpenAI's **Feb 2026 retirement of SWE-bench Verified** (contamination) and recommends SWE-bench Pro | Post-competition external check switches to a Python-only slice of SWE-bench Pro; any Verified number in the whitepaper carries an explicit caveat |

---

## 2. Area-by-area review and integration

Legend for "Where": sprint/day references target the six-sprint master plan (Deliverable 02). Legend for "Priority": P1 = adopt now, P2 = adopt within two sprints, P3 = optional/deferred.

### Part A — submission-side techniques (ship in the agent)

| Area | What the corpus says | Usefulness | Where it lands in the master plan | How to test it | Metric | Priority |
|------|---------------------|------------|-----------------------------------|----------------|--------|----------|
| A1. Four tenets + four phases (Spec → Localize → Patch → Validate) | Preserve working code; minimum-path decomposition; breadcrumbs; binary done | High — matches the plan's brain but adds the missing **phase discipline** and **spec-first** step | Sprint 2, Day 1–2: encode phases in the system prompt + tool scoping (no file-access tools before a valid spec exists) | Ablation: phases enforced vs free-form prompt; spec-score vs PASS correlation | turns/task, `spec_file_correct`, pass rate | P1 |
| A2. Rescue mode (3-strike circuit breaker, revert-on-regression, min-baseline, induction rounds) | Deterministic trip conditions; exit = submit-best-or-none | High — implements the plan's "downgrade ladder" concretely and adds revert-on-regression the plan lacked | Sprint 2, Day 3: fold into the `budget_governor` skill as the ladder's middle rung | Ablation rung: rescue on/off; log `rescue_trigger_rate`, `rescue_recovery_rate` | net pass-rate delta, wasted-turn delta | P1 |
| A3. Breadcrumb journals | ≤ 30-line journal outside the repo tree; normalized actions so repeats are detectable | High — cheap loop prevention; the compendium flags the one open design question (writable path outside the repo) | Sprint 2, Day 3; **verify writable path in the Week-1 capability probe** (GAP in corpus) | Journal on/off (same rung as rescue) | `loop_rate`, `repeat_action_rate` | P1 |
| A4. Code reducer / handoff packets | Contested evidence (Cognition vs Anthropic) → a **hypothesis to ablate**, not an assumption | Medium — our two-phase ablation already touches it | Sprint 2 ablation matrix (Config B arm): full transcript vs structured packet vs hybrid | Three-arm handoff ablation | pass rate, tokens/task | P2 |
| A5. External verification hierarchy (V0–V3; V0–V2 may block, V2b/V3 advisory only) | "Self-scoring cannot produce rejections" softened to "unreliable without external grounding" | High — gives the gate layer its exact policy, incl. the rule that a model-judge "looks good" never overrides a failing test run | Sprint 2, Day 2: implement V0–V2 in `patch_validator`; V3 optional later | Rung: gates on/off; V3 false-approval rate on labeled tasks | `false_approval_rate`, regression rate | P1 |
| A6. BCF-Spec machine-parseable spec (JSON schema, `write_spec` tool call, fix-shape vocabulary) | Schema-validated tool args beat free-form JSON for small models | High — becomes the brain's Phase 1 contract; `depends_on` is exactly what the Task-2 repair-order math needs | Sprint 2, Day 1; extend schema with `expected_class` from Phase 1a (see 05 deliverable) | Spec rubric score vs PASS; `spec_file_correct` against gold patches | spec-score→PASS AUC | P1 |
| A7. Progressive disclosure (Agent Skills layout, ≤ 5K-token SKILL.md) | Natural fit to the harness's skill mechanism — **verify the harness honors the layout** (GAP) | Medium | Sprint 2, Day 6–7 packaging; capability probe in Sprint 1 settles the GAP | Prompt-size ablation: all-in-system vs skills | prompt tokens/turn, activation correctness | P2 |
| A8. Binary gates G0–G6, no partial credit, empty-patch policy | Code-owned gates; G5 regression = immediate revert | High — the plan's "verification before submit" made deterministic | Sprint 2, Day 2 (with A5) | Gate-removal ablation (drop G1, G5, G3 in turn) | pass rate, `regression_rate` | P1 |
| Dossier Phase 1a: classification gate + 4 issue classes (logic / contract / crash / feature), issue-text-only | Per-class spec templates, localization tactic, and validation scope; Class 3's defensive-vs-guard fork comes straight from the httpx_6821 lesson | High — this is the novel-ish, paper-bearing mechanism; Task 2 builds its math | Sprint 2, Day 4–5: `classify_issue.py` + 3 spec templates; class-aware prompting vs single template | Classification accuracy vs Week-2 taxonomy labels; per-class turn efficiency | per-class pass rate + turns | P1 |

### Part B — dev-time assets (do not ship; they build and measure)

| Area | What the corpus says | Usefulness | Where it lands | How to test/use | Metric | Priority |
|------|---------------------|------------|----------------|-----------------|--------|----------|
| B1. Provenance tiers + M/D/I/H evidence tags + receipts + claims audit | Every number in the paper carries a receipt ID; no receipt → number removed | **Critical for the whitepaper** — draft 1 died from violating exactly this | Adopt from Day 0 (ledger discipline); claims audit in Sprint 6/endgame | Process, not experiment — audited in endgame | receipt coverage = 100% of numeric claims | P1 |
| B2. HIVE-Lite job queue (idempotent, resumable, overnight runs) | Plain Python + JSON/SQLite is enough | High — matches AUX 2's role as the verification pool | Sprint 1, Day 6 (when T2 mining starts); hooks guard frozen files | Resumability drill: kill mid-run, resume | runs/night, crash-recovery time | P2 |
| B3. Promptfoo regression gate for prompts/schemas | Deterministic assertions (`is-json`, tool-call F1, python checks) against local vLLM | High — protects the 6-sprint cadence from silent prompt regressions | Sprint 2, Day 5: 10 frozen dev cases; run before every prompt change | Regression suite pass rate per prompt edit | edit→eval latency | P2 |
| B4. Langfuse + LiteLLM | Heavy (4 data services); compendium recommends JSONL-first | Low for the timeline | **Deferred** (only if ledger browsing becomes the bottleneck) | — | — | P3 |
| B5. Structured ledger + task taxonomy schema (8–12 mechanism categories, complexity tiers 1–5, failure codebook) | OTel-aligned event schema; labels derived before BCF design freeze | **Critical** — this is the paper's Category A contribution and the T2 tier's backbone | Sprint 1, Day 2 (post-run script **before** first harness run); Sprint 3 for labeling 129 tasks | Inter-rater agreement (κ) on 20-task sample; override-rate per category | label quality | P1 |
| B6. Benchmark targets (SWE-bench Pro primary external; Verified deprecated; others low-relevance) | Post-competition only; Python-only slice | Medium | Endgame/after Dec 2 | Do not tune on it | external pass@1 | P3 |

### Part C — rules documentation (`Kaggle-00-Complete.md` and `Kaggle-01..04`)

| Area | Status | Notes for the plan |
|------|--------|--------------------|
| Merged "Complete" doc (overview + data + notebook + harness) | Consistent with 01–04 and `HARNESS_README.md` | No conflicts found; keep `HARNESS_README.md` as the authority (the dossier itself says it had not read it — we have) |
| Budgets, tools, compaction, two-phase lifecycle | Confirmed | Master plan facts stand: `eval_config` four keys only, sequential tasks, 12 h cap, anti-tamper test reset |
| Whitepaper rules | The dossier's rubric claims were **self-retracted as unverified** | Use the real scraped rubric (five criteria; 3,000 words; two writeups/team) from the in-repo mirror `paper-track-website/` — already integrated into deliverable 03 |

---

## 3. Amendments to the master plan (concrete edits)

| # | Plan section | Amendment | Triggered by |
|---|--------------|-----------|--------------|
| 1 | Sprint 2 architecture | Primary Config A = **flat single agent** with phase-gated tool scoping + gates; Config B = SequentialAgent two-phase (ablation) | Dossier retraction #4 (flat calls tools more reliably on Gemma 4) |
| 2 | Sprint 2 Day 1–2 | Add **Phase 1a classification gate** (`classify_issue.py`, issue-text-only) + three spec templates; spec gate G0 blocks file tools until spec validates | Phase 1a design; A6/A8 |
| 3 | Sprint 2 Day 3 | Merge rescue state machine into `budget_governor` as the explicit ladder: NORMAL → (trip) → intake/recon → min-baseline → ≤ 3 induction rounds → exit(submit-best) | A2/A8 |
| 4 | Sprint 1 Day 2 | **Post-run ledger script before the first harness run**; schema per B5 (normalized actions, gate vectors, token counts, spec hash) | B5 ("set it up before your first run") |
| 5 | Sprint 3 | Taxonomy labeling of all 129 tasks (categories, complexity tiers 1–5, multi_bug, root-cause file/symbol, fix shape) + 20-task inter-rater κ; feeds T2 mining AND paper Category A | B5; dossier evidence-gap A |
| 6 | Sprint 3–4 | Category B analyses (graph centrality; intra/inter-category cosine heatmap; precision@1/3/5) as T2-side experiments | Dossier evidence-gap B |
| 7 | Sprint 4–5 | Category C controlled experiments: 3 configs × 30-task held-out, `wrong_edits` metric, `spec_file_correct`; headline test = localization turns vs complexity tier crossing | Dossier evidence-gap C |
| 8 | Endgame | SWE-bench Verified numbers caveat-or-drop; SWE-bench Pro (Python slice) as the only external benchmark, post-competition | Compendium finding 1 |
| 9 | All sprints | Whitepaper numbers carry M/D/I/H tags + receipt IDs from the start; httpx_6821 walkthrough appears only as a labeled illustrative example, never as evidence | B1; dossier provenance ledger |

---

## 4. Whitepaper brainstorm — candidates for draft 3

The real rubric (in-repo mirror, deliverable 03): Novelty · Quality (generalization) · Relevance · Verifiability · Clarity; 3,000 words; max two writeups per team; three prizes.

| # | Concept | Rubric fit | Prize-track fit | Verdict |
|---|---------|------------|-----------------|---------|
| W1 | **Class-conditional scaffolding** (Phase 1a gate): does routing a small-model agent's policy per exception class beat one generic template, at what per-class effect size? | Novelty (no prior work routes agent policy per issue class under wall-clock budgets), Verifiability (measurable per class) | Best Paper | **Core of draft 3** — this is the user's own statement, now with math (deliverable 05) |
| W2 | **BCF-SWE-Python taxonomy** as a released resource: 129 tasks × (category, complexity tier, multi-bug, root-cause symbol, fix shape) + failure codebook + κ agreement | Verifiability very high (artifact, not claims); Novelty moderate | **Best New Resource** | Second writeup candidate — exactly the "dataset from provided data" example the organizers gave |
| W3 | **Bug geometry in the provided embeddings**: intra- vs inter-category cosine similarity; precision@1/3/5 of semantic search against known root causes | Novelty (dataset finding), Quality (generalizes to any graph+embedding code dataset) | Best Paper or Resource | Strong Section 3 material inside W1's paper |
| W4 | **Repair-order value**: the math of fault masking and fix ordering on dependency chains (deliverable 05) with the compound-detector experiment | Novelty high, Verifiability depends on running Category C | Best Paper | Theory section of W1 — the user's requested "meat and potatoes" |
| W5 | Rescue-mode circuit breakers for LLM agents (deterministic, code-owned) | Novelty moderate (LivePlan exists — cite it), Quality good | Best Paper (weaker) | Fold into W1 as one ablation section, not a standalone paper |
| W6 | Budget-constrained test-time scaling (from the main-track plan) | Relevant to main track; overlaps W1's wall-clock angle | — | Keep in the main-track paper draft; only cite from the whitepaper |

**Recommended portfolio (2-writeup cap):** Writeup A = W1+W3+W4+W5 (methods paper: "Class-Conditional Agentic Software Engineering: exception-class routing, masking-aware repair ordering, and measured taxonomy for a 31B offline coding agent"). Writeup B = W2 (resource paper). This mirrors deliverable 03's portfolio recommendation and stays inside the two-writeup cap.

**Draft-3 outline (Writeup A, ≤ 3,000 words):** 1 Abstract · 2 Introduction (offline 31B agent, wall-clock budget) · 3 The BCF-SWE-Python taxonomy (Category A artifact) · 4 Phase 1a classification gate + per-class policies · 5 Theory: search-space reduction, masking, repair-order value (deliverable 05, condensed to ~500 words + 2 equations) · 6 Experiments: 3 configs × 30 held-out tasks, per-class effects, complexity-tier crossing (Category C) · 7 Dataset analyses: centrality + cosine heatmap + precision@k (Category B) · 8 Related work · 9 Limitations (visible-tests-only caveat; illustrative-labeled walkthroughs; regime changes) · References.

---

## 5. What to verify before relying on the corpus

| Item | Why | How |
|------|-----|-----|
| Skill-script sandbox capabilities (imports, graph-file access, writable paths) | Gates A3 journal location, A7 layout, classifier runtime | Week-1 capability probe script (compendium C3.1 / dossier roadmap) |
| Whether the harness loads the Agent Skills directory layout | Gates A7 | Probe + organizers' `HARNESS_README.md` (already local) |
| Exact wording of the four tenets, rescue protocol, Batonic v3 package | Compendium marks these RECONSTRUCTED, to be replaced by originals | Paste originals when available (compendium C4) |
| Dataset-republish rule for the Resource writeup | Gates Writeup B design | Track the host's thread 743255 follow-up |
| Every external citation in the whitepaper | Verifiability criterion; compendium S1–S30 gives verified URLs to reuse | Cite from the compendium's source index, not from memory |


---

<!-- ====================================================================== -->
<!-- FILE: 05-bcf-math-whitepaper-draft3-foundations.md -->
<!-- ====================================================================== -->

# Task 2 — The Mathematics of BCF: Exception-Class Routing, Fault Masking, Fault Interference, and Repair Order

**A formal foundation for whitepaper draft 3, plus a survey of prior research on fault interference and masking**

- Date: 2026-09-30
- Inputs: `bcf/BCF-contestsubmission_dossier_20260928.html` (the `httpx_6821` stress test, the Phase 1a classification gate, whitepaper drafts 1–2), `bcf/BCF-Reference-Compendium.md`, and the official competition documentation in `input/kagglecomp/`
- Companion: [04-bcf-review-and-master-plan-integration.md](04-bcf-review-and-master-plan-integration.md)
- Evidence discipline: the `httpx_6821` scenario is **illustrative** (the dossier states the id is invented); every number traced to it is tagged **[I]** under the M/D/I/H scheme. Theorems here are **[D]** derived from stated assumptions; the experiments that would upgrade them to **[M]** are specified in Section 5.

---

## 1. The claim, decomposed

> "I aim to build BCF to help solve more issues sooner by classifying errors into exception classes. This effectively limits the search space to the most probable root causes. [Flesh out the math … on fault interference, fault masking, and multi-step chained issues such as httpx_6821.] Therefore, the speed and overall effectiveness of the algorithm will simply depend on the adjustments to the number and fidelity of the exception categories."

The statement makes four assertions, each of which maps to a known mathematical phenomenon:

| # | Claim fragment | The phenomenon (its proper name) | Where it comes from |
|---|----------------|----------------------------------|---------------------|
| 1 | "classifying errors … limits the search space to the most probable root causes" | **Bayesian posterior narrowing** — conditioning reduces entropy; expected search cost is governed by **mutual information** (the 20-questions / decision-tree bound) | Model-based diagnosis: de Kleer & Williams' GDE (1987) maintains exactly such posterior probabilities over candidate faults; Reiter (1987) formalizes diagnosis as hitting sets over conflicts |
| 2 | "fault masking" | **Fault masking / coincidental correctness** — a fault that is *executed* but never *propagates* to an observable failure (the Execute–Infect–Propagate conditions) | Dependable-computing taxonomy (Avizienis et al., 2004); Voas' PIE technique (1992); "coincidental correctness" in fault localization; mutant *masking* in mutation testing |
| 3 | "fault interference" | **Interacting (multiple) faults** — the failure signature of a fault *set* is not the union of individual signatures, so single-fault diagnosis (e.g., spectrum-based ranking) degrades; diagnosis of fault *sets* is a **hitting-set / set-cover** problem | Reiter (1987); de Kleer & Williams (1987); Barinel-style probabilistic multiple-fault diagnosis; empirical SBFL degradation under multiple faults |
| 4 | "multi-step chained issues" (httpx_6821) | **Fault propagation along a causal chain** with an induced **repair-order constraint** (root-first topological order); wrong order pays a measurable **rework cost** | Program slicing (Weiser); error-propagation analysis; Zeller's cause–effect chains (2002) |
| 5 | "speed and effectiveness depend on the number and fidelity of exception categories" | **A resolution-vs-estimation tradeoff** (a bias–variance / rate–distortion-shaped U-curve): more categories lower the entropy floor (better resolution) but raise the estimation error of the category model and the misrouting (Bayes) risk. Optimal K grows with the amount of labeled data | Statistical learning: distribution-estimation error scales like √(K/N); Bayes risk with a loss matrix |

So: yes — the phenomena you are describing have names, a literature, and clean formalizations. None of this weakens the idea; it *grounds* it, and it exposes exactly where BCF must be careful (Sections 3–4) and where it is genuinely novel (Section 6.3).

---

## 2. Notation

| Symbol | Meaning |
|--------|---------|
| Θ | Set of candidate root-cause locations = the nodes of the provided call/dependency graph (symbols). \|Θ\| = n, typically 10³–10⁴ |
| S* ⊆ Θ | True fault set of an issue. \|S*\| = 1 for simple bugs; \|S*\| = 2 for `httpx_6821` (u = `history = []` in `_client.py`, v = `assert self._stream is not None` in `_models.py`) |
| C = {c₁ … c_K} | Exception/issue classes (BCF Phase 1a). κ(θ) ∈ C = the class a fault at θ would present as |
| o | The observation available at Phase 1 = the issue text (+ any error text it quotes). **The runtime agent never sees `test_patch`** (dossier retraction), so o is issue-text-only |
| ĉ ∈ C ∪ {c₀} | The classifier's output; c₀ = "unknown → generic template" fallback class |
| M | The classifier's **confusion matrix**: M[κ, κ'] = P(ĉ = κ' \| true class κ). "Fidelity" = how much of M's mass sits on the diagonal (plus calibration of confidence) |
| T | Cost in turns (one harness tool call ≈ one turn); the binding budget is ~6 min/task within the 12-hour cap |

---

## 3. The formal model

### 3.1 Classification as posterior narrowing

Given only the issue, the agent's uncertainty about the root cause is a distribution P(θ). If Θ has n roughly-equally-plausible symbols, the prior entropy is:

  H₀ = H(Θ) = log₂ n

The Phase 1a classifier observes o and emits ĉ. The posterior becomes:

  P(θ \| ĉ) ∝ P(ĉ \| θ) · P(θ),  where P(ĉ \| θ) = M[κ(θ), ĉ]

and the remaining uncertainty is the conditional entropy H₁ = H(Θ \| ĉ). Two derived propositions:

**Proposition 1 (resolution ceiling).** *The information any K-class gate can inject is bounded by the class entropy:*

  I(Θ ; ĉ) = H₀ − H₁ ≤ H(C) ≤ log₂ K

*Interpretation:* a 4-class gate can at most buy ~2 bits of localization "for free" — i.e., it can at most do the work of ~2 optimal bisection queries. This is the precise, honest ceiling on "limits the search space." It also says categories are cheap bits: going 4 → 8 classes buys at most one more bit.

**Proposition 2 (expected-cost link).** *If, within a class, localization proceeds by queries that (ideally) split the remaining posterior mass in half (a 20-questions process), the expected number of queries to isolate the fault satisfies* E[T] ≤ H(Θ \| o) + 1, *and a greedy max-information query policy achieves this within a small constant.*

*Interpretation:* **turn savings ≈ mutual information, measured in bits.** H₀ = log₂ n ≈ 11–12 bits for a big repo's graph; a classifier that reliably separates "crash with traceback in file X" from "silent contract violation" can realistically remove 1–3 bits — i.e., save a few turns per task before any tool call is made. That is the right scale of claim for the whitepaper (not "10× faster").

### 3.2 Fault masking (the `httpx_6821` Bug-2 phenomenon)

The dependability literature decomposes "fault causes failure" into three conditions (Voas' PIE): the faulty code must **Execute**, the resulting error must **Infect** the program state, and the infection must **Propagate** to an observation point (an assertion, a test). Fault *j* is masked in the presence of fault set S when any condition fails. A compact definition:

  mask(j \| S) = 1 − P(observed failure attributable to j \| active faults S ∪ {j}) ⁄ P(observed failure attributable to j \| {j})

- mask = 0: fault j behaves as if alone (no interaction).
- mask = 1: fault j is **fully masked** — invisible while S is active.

**The httpx_6821 instance [I].** Bug 2 is `assert self._stream is not None` in `Response.stream`. It executes and infects whenever `.stream` is accessed on a consumed redirect response. But Bug 1 (`history = []` inside `_send_handling_redirects`) guarantees redirect responses never enter `response.history` — so no test ever reaches the access. Bug 1 zeroes the Propagate condition of Bug 2: mask(Bug2 \| {Bug1}) = 1. Once Bug 1 is fixed, Bug 2's propagation probability jumps from 0 to positive — the assertion error surfaces as a *new* failing test (`test_history_stream_state` was an ERROR that "only surfaces after the above is fixed").

**Corollary (the hidden-test-set is not fixed).** Under masking, the graded PASS/FAIL surface is a function of the current fault set: F(S₁ ∪ S₂) ≠ F(S₁) ⊎ F(S₂). The practical consequences for an agent are:
1. **Stopping-rule hazard:** "all currently visible target tests pass" is not evidence of done — fixing Bug 1 *moves* the test set (a formerly passing/ERROR test becomes a live FAIL).
2. **Signal hazard:** an agent that sees `AssertionError` first (the naive agent in the trace) is looking at the *masked joint signature*, not at either root cause individually. The signature belongs to the *set* S, not to a member.

This is why BCF's Class 3 policy (the defensive-vs-guard fork: "trace backward to the invalid state rather than patching the crash site") is the right reflex, and why the Phase 1 spec's `depends_on` field exists.

### 3.3 Fault interference and multi-fault diagnosis

*Interference* = the two faults are both active and each changes the observability (or the localization signal) of the other. Two concrete mechanisms, both present in the literature:

1. **Observability interference (masking's sibling):** fault v's failure only manifests through states created/destroyed by u (Section 3.2). The joint signature F({u,v}) can *look like* a single third bug — the naive agent in the trace spent 8+ turns chasing exactly such a phantom.
2. **Signal interference (why spectrum-based localization degrades):** SBFL ranks statements by how correlated their execution is with failures (Tarantula's red/green, Ochiai's similarity). With \|S*\| > 1, every failing test is explained by *any* member of S*, so suspiciousness mass spreads across all members and their neighborhoods; passing tests that execute faulty code (coincidental correctness) further dilute the ranking. The single-fault assumption underlying the ranking is simply false.

The classical answer is **explaining-set diagnosis**: find a minimal set S ⊆ Θ such that (a) every failing test is "covered" by some fault in S (the fault lies on a path that could produce that failure), and (b) no passing test is covered. Candidate sets that cover failures are conflicts; minimal covering sets are **hitting sets** — Reiter's (1987) characterization of diagnoses, operationalized with Bayesian candidate probabilities in GDE (de Kleer & Williams, 1987) and in probabilistic successors (e.g., Barinel). For BCF this yields a concrete algorithm for the compound class:

  For each failing test t: candidates(t) = backward slice / ancestor set of t's crash or assertion site in the dependency graph G.
  Solve: min Σ_{θ∈S} cost(θ) s.t. S ∩ candidates(t) ≠ ∅ for all failing t, and S ∩ candidates(t') = ∅ for passing t'.
  Order S root-first by depth in G (Section 3.4).

This is a small, well-defined optimization (few failing tests, small slices → the hitting set is computable in milliseconds by a script — no model call), and it *is* the "limits the search space to the most probable root causes" claim made precise: the posterior-narrowing of Section 3.1 restricted Θ to ∪ candidates(t), then structure (not the LLM) picks the set.

### 3.4 Chained issues and the value of repair order (httpx_6821 end-to-end)

The provided dependency graph G makes fault propagation a graph property: fault u can explain a failure observed at assertion site t only if there is a path u →* t in G (data or control dependence — the program-slicing condition, Weiser 1982). A **chained issue** is one where S* = {u, v} with v on the path from u to t — u is the *root* (state origin: `history = []`), v is *downstream* (the guard/assert: `assert self._stream is not None`).

**Repair-order constraint.** Because v is masked until u is fixed, fixing v first (a guard at the crash site) produces a patch that (i) fails the root-cause tests and (ii) perturbs the signature, so the agent must then *rediscover* u from a now-muddier scene. Define the **wrong-order rework cost**:

  W = (turns spent on the premature downstream fix) + (revert) + (re-localization overhead)

**Measured illustration [I]:** in the 30-turn naive trace, fixing Bug 2 first cost the turns-8-to-16 re-discovery of Bug 1 plus 2 wrong edits and 4 recovery turns — W ≈ 8–12 turns, i.e., roughly a third of the whole task budget. BCF's 10-turn trace paid instead a **one-time planning cost** of ~1–2 turns (spec + `depends_on` assertion).

**Proposition 3 (order-penalty scaling).** *For a compound task with k ordered defects, a policy that picks a repair order without dependency analysis is wrong with probability ≥ 1 − 1/k! (uniform random order) — and worse under realistic priors that prefer the loudest (most recent) symptom, which is exactly the masked downstream bug. In the common k = 2 case: P(wrong order) = ½, so* E[W] = (1 + r)/2 *per compound task, where r = re-localization turns.* The planning alternative costs O(k log k) for a topological check of `depends_on` — a constant, per task, regardless of masking structure.

**Why this is "superlinear advantage" in the draft-2 sense:** single-bug tasks have no order to get wrong (k = 1 ⇒ W ≡ 0); compound tasks pay W in proportion to how masked and how order-dependent the chain is. So scaffold-vs-baseline divergence *grows* with complexity tier — the crossing curves the dossier wants as the headline figure. The theory predicts *where* the curves cross: at the complexity tier where typical tasks become compound (tiers 3–4 in the taxonomy rubric).

### 3.5 The K-and-fidelity law (the last sentence of the claim)

Model the expected per-task cost as a function of the number of classes K and the classifier's fidelity:

  E[cost](K) = T₀ − I(Θ ; ĉ_K) + ρ · R(K) + λ · E_est(K)

| Term | Meaning | Behavior in K |
|------|---------|---------------|
| T₀ | Turns with no classification (generic template) | constant |
| I(Θ ; ĉ_K) | Mutual information injected by the gate (Prop 1) | grows like log K, saturates when classes stop aligning with distinct signatures |
| R(K) | **Misrouting risk** = Σ_κ π_κ Σ_{κ'≠κ} M[κ,κ'] · d(κ,κ'), where d(κ,κ') = extra turns wasted running class-κ' policy on a class-κ issue (a **loss matrix**) | grows with K unless each new class stays cleanly separable (fidelity) |
| E_est(K) | **Estimation tax**: M and class-conditioned cause distributions are learned from N labeled tasks; plug-in estimates of K-bin distributions carry error ~ √(K/N) | grows like √K, shrinks with N |

Minimizing the analytic skeleton f(K) = −a·ln K + b·√(K/N) + const gives:

  K* = 4 a² N ⁄ b²

**Interpretation (the design rule your last sentence was groping toward):** *the sustainable number of exception categories grows linearly with the size of your verified label set N.* With N ≈ 129 public tasks (plus self-mined held-out tasks), K* lands in the **high single digits to ~12** — which independently reproduces the compendium's recovered guidance of "8–12 mechanism-based categories plus `other`." The safe fallback class c₀ is what keeps d(κ, c₀) small: misroutes degrade to the generic policy instead of to a *wrong specialized* policy, bounding R(K) by construction.

**"Fidelity" made operational** — three measurable quantities, all already planned as experiments:
1. **Diagonal mass of M** (classifier accuracy on Week-2 labels; issue-text-only input at runtime).
2. **Calibration** of the classifier's confidence field (reliability diagram on the same labels).
3. **Within-class likelihood quality** = precision@1/3/5 of semantic search restricted to the class's candidate anchors (the dossier's Category-B Analysis 3).

**Proposition 4 (U-curve).** *E[cost](K) is U-shaped in K: it strictly improves while log K outgrows the estimation tax, then degrades. The whitepaper's falsifiable claim: measured per-class turn efficiency against K ∈ {1 (generic), 2, 4, 8, 12} traces this U-curve, with the minimum near the predicted K\*.*

---

## 4. httpx_6821 through the math (worked example, all [I])

| Event in the traces | Quantity in the model |
|---------------------|------------------------|
| Naive agent sees `AssertionError` first and fixes Bug 2 (turn 7) | Treating a masked joint signature F({u,v}) as a single-fault signature; guard-instead-of-root error; order violation of §3.4 |
| Bug 1 discovered only at turn 16, after 2 wrong edits and 4 recovery turns | W ≈ 8–12 turns; P(wrong order) = ½ at k = 2 |
| BCF writes spec naming Bug 1 as root and Bug 2 as `depends_on` dependent | One-time planning cost ≈ 1–2 turns; posterior narrowed by class (crash → defensive fork) before any tool call |
| `test_history_stream_state` becomes failing only after Bug 1 is fixed | mask(Bug2\|{Bug1}) = 1 → 0; hidden-test-set shift (stopping-rule hazard) |
| BCF validation runs the whole test file for contract-class bugs | Mitigation for coincidental correctness: passing tests that execute faulty code are not evidence of correctness |

Head-to-head [I]: naive 30 turns / 3 wrong edits / 20-of-50 budget left; BCF 10 turns / 0 wrong edits / 40-of-50 left. The paper must present this as the labeled illustration it is (the dossier itself retracts the id as invented) — its role in draft 3 is to make the algebra of Sections 3.2–3.4 concrete, with real measured numbers to come from the Category-C experiments.

---

## 5. Experiments that convert this math into measured results (paper Section 6)

| # | Experiment | Tests | Design | Output |
|---|------------|-------|--------|--------|
| E1 | **K-sweep (U-curve)** | Prop 1 + Prop 4 | Run the same held-out tasks with the classifier limited to K ∈ {1, 2, 4, 8, 12} classes; N = labeled taxonomy size | turns/task and pass rate vs K; overlay predicted K* band |
| E2 | **Fidelity sweep** | R(K) term | Inject synthetic confusion into M (5/10/20% off-diagonal) at inference; measure pass-rate degradation slope vs d(κ,κ') | sensitivity of the system to classifier fidelity; c₀-fallback benefit |
| E3 | **Per-class effect sizes** | Phase 1a value | Class-aware templates vs single generic template, per class, 3 seeds | per-class Δpass, Δturns with CIs; "which classes earn their template" |
| E4 | **Compound-detector AUC** | Interference identification (§6.2) | Static detector: failing tests not covered by any single backward slice ⇒ predict ≥ 2 interacting faults; evaluate against the `multi_bug` label on 129 tasks | ROC/AUC + precision-recall; zero runtime cost (pure analysis) |
| E5 | **Order-penalty measurement** | Prop 3 | On compound tasks: force downstream-first vs root-first order; measure W | W distribution; validates E[W] = (1+r)/2 at k = 2 |
| E6 | **Masking-shift census** | §3.2 corollary | From gold patches + test patches of the 129 public tasks: count tasks where applying the root fix changes the failing-test set | frequency of hidden-test-shift; justifies "run full file" validation policy |

E1–E3 and E5 need the harness; E4 and E6 are pure data analysis on files you already have (a weekend each), and they make respectable standalone findings even if the harness experiments lag.

---

## 6. Prior research

> These are cited from domain knowledge for scoping purposes. Before the whitepaper cites any of them, verify each bibliographic record against a primary source (the compendium's S-index practice). None of the competition constraints prohibit academic related work; the winners' open-source obligation does not restrict citing it.

### 6.1 The four relevant literatures

| Literature | Representative work (verify before citing) | Core idea | What BCF should take from it |
|------------|--------------------------------------------|-----------|------------------------------|
| **Model-based diagnosis of multiple faults** | Reiter, *A Theory of Diagnosis from First Principles* (1987); de Kleer & Williams, *Diagnosing Multiple Faults* (GDE, 1988) | Diagnoses = minimal hitting sets over "conflicts" (sets of observations no single healthy component explains); GDE maintains Bayesian posteriors over candidates as measurements arrive | The posterior-narrowing core of Phase 1a (§3.1) and the hitting-set solver for compound tasks (§3.3) are textbook — the paper must position them as such and claim novelty only in the *port into an LLM agent scaffold under a wall-clock budget* |
| **Spectrum-based fault localization (SBFL) and its multi-fault breakdown** | Jones & Harrold, Tarantula (2005); Abreu et al., Ochiai evaluation (2006–07); Wong et al. survey (2016); probabilistic multiple-fault diagnosis (e.g., Barinel, Abreu et al. ~2009); MSeer-style multi-fault clustering (verify details) | Rank statements by execution correlation with pass/fail spectra; accuracy degrades with multiple faults and with coincidental correctness | The signal BCF's graph-first search competes against; the *documented* reason single-fault ranking fails under interference (§3.3.2); the explaining-set formulation BCF inherits |
| **Fault/error/failure taxonomy, masking, and fault injection** | Avizienis, Laprie, Randell & Landwehr, *Basic Concepts and Taxonomy of Dependable and Secure Computing* (2004); Voas, PIE / *A Dynamic Failure-Based Technique* (1992); fault-injection practice (Hsueh, Tsai & Iyer 1997; Xception); mutation-testing masking (Jia & Harman survey, 2011); coincidental-correctness studies in localization (Masri & Podgurski line of work) | Fault vs error vs failure; a fault causes a failure only if executed, infection occurs, and the effect propagates; fault injection measures **masking ratios** and error-detection latency; mutants are "masked" when tests pass anyway | The precise vocabulary and the Execute–Infect–Propagate conditions that make the httpx_6821 story rigorous (§3.2); the masking indicator; the warning that "all green" is not "done" |
| **Propagation, slicing, and causal chains in debugging** | Weiser, program slicing (1982/84); Zeller & Hildebrandt, delta debugging (1999); Zeller, *Isolating Cause-Effect Chains from Computer Programs* (2002); causal-inference fault localization (Baah, Podgurski & Harrold, 2010) | Backward slice from a failure = the set of statements that could have caused it (exactly candidates(t) in §3.3); minimal failing inputs; cause–effect chains as the propagation path; causal estimands for localization claims | The graph-theoretic candidate sets BCF computes from the provided call graph; the root-first ordering argument (§3.4); an honest template for causal language in the paper |

### 6.2 Prior work on *identifying* where fault interference can occur

This is the scarcer half of your question — the literature mostly *diagnoses* interfering faults after failures; *static prediction* of interference-prone scenarios is scattered across several threads, and BCF can assemble it into something testable:

| Thread | What it offers | Scenario markers for interference (what to look for statically) |
|--------|----------------|----------------------------------------------------------------|
| Error-propagation analysis & fault injection | Measures which faults propagate vs mask, empirically | Guard/assert code reachable only under paths controlled by another component (**dead-until-unmasked guards** — exactly httpx Bug 2); exception-swallowing handlers upstream (try/except pass); partial failure handling |
| Shared-state and concurrency hazard studies | Data-flow indicators of interaction risk | Shared mutable state written from multiple modules (a redirect-history list); caches and memoization; ordering-dependent collections; config/feature-flag branches |
| Test-suite and mutation studies | Coincidental correctness arises when tests execute faulty code without observing outputs | Fixture-heavy tests that reset state (maskers); assertions on proximate values rather than end-state; tests passing while executing mutated/faulty paths |
| Structural/centrality analyses | Hubs coordinate many behaviors, so defects there interact widely | High-betweenness symbols in the call graph (the dossier's Category-B Analysis 1 computes exactly this on the provided graphs — a ready-made interference-risk ranking) |
| **BCF-extendable detector (candidate novel contribution)** | Combine the above: predict "this issue is compound/interfering" from *static + issue-text* signals | Detector: if the union of backward slices of the failing assertions has no single common ancestor explaining all failures — i.e., **no single-fault explanation covers the failure set** — predict ≥ 2 interacting faults (the hitting-set "conflict" condition itself). Evaluate as E4 (AUC vs the `multi_bug` label) |

### 6.3 What is genuinely BCF's to claim (and what is not)

| Not novel (cite, don't claim) | Novel-enough to claim (position carefully) |
|-------------------------------|---------------------------------------------|
| Posterior narrowing over candidate faults (GDE); hitting-set diagnosis (Reiter); masking/PIE vocabulary (Voas, Avizienis); slicing-based candidate sets (Weiser); graph-first localization and phase pipelines for SWE agents (the dossier itself retracts these as described in public competition repos) | (1) **Exception-class routing of an LLM agent's downstream policy** (spec template, localization tactic, validation scope per class) with measured per-class effect sizes under a hard wall-clock budget; (2) the **resolution-vs-estimation law for category granularity** (K* ∝ N) with a U-curve measurement — nobody has measured this for agentic SWE; (3) the **static compound-issue detector** (single-fault-explanation residual) validated against labels on this dataset; (4) the released **taxonomy artifact** itself |

### 6.4 LLM-era adjacent work already sourced in-repo

The compendium's verified source list (S13–S22b) supplies the modern anchors without new searches: SWE-PRM (taxonomy-guided trajectory correction beats unguided), LivePlan (deterministic, code-owned monitors trigger intervention — the circuit-breaker precedent), FailFast-RestartSmart (predict failure, restart fresh, keep the diff as overlay — the rescue-mode precedent), Huang et al. 2024 (intrinsic self-correction unreliable → external grounding), SWE-MeM (memory management as a real lever for small models). Herzig/Just/Zeller's issue-misclassification work (bug-vs-feature labels are frequently wrong) independently justifies the Class 4 gate and should be verified and added.

---

## 7. Caveats to carry into draft 3

| # | Caveat | Handling |
|---|--------|----------|
| 1 | `httpx_6821` is an invented id; the walkthrough is illustrative [I] | Label it as a worked example; every number in the paper must instead trace to E1–E6 receipts |
| 2 | The 20-questions bound (Prop 2) assumes ideal splits | State it as an upper-bound argument on savings, not a prediction of exact turns |
| 3 | K* = 4a²N/b² comes from a stylized cost model | Present as a scaling law + design heuristic; the U-curve (E1) is the measured claim |
| 4 | Runtime sees only issue text (no `test_patch`) | All runtime classifiers use issue text only; `test_patch` is used solely in dev-time labeling (E4/E6) |
| 5 | Private-repo hidden set | Only generic class knowledge transfers; no repo-specific keyword maps or symbol anchors in any runtime asset (dossier retraction) |
| 6 | The real whitepaper rubric is the scraped one (five criteria; 3,000 words; two writeups/team) — not the dossier's retracted five-criterion guess | Write Section mapping per deliverable 03; verify no drift on the live page before submitting |

---

## 8. Sources

- In-repo: `bcf/BCF-contestsubmission_dossier_20260928.html` (stress test §Turn 6–7; Phase 1a gate; provenance ledger; drafts 1–2; evidence gaps A/B/C), `bcf/BCF-Reference-Compendium.md` (tenets/specs/gates/taxonomy schema; verified external source index S1–S30), `input/kagglecomp/docs/markdown/` (rules + harness), `paper-track-website/` (real rubric mirror)
- Academic prior work in Section 6 is cited from domain knowledge and flagged for verification; the compendium's S-index is the preferred citation source for LLM-era work
- Working notes: `scratch/bcf-task-notes-2026-09-30.md`


---

<!-- ====================================================================== -->
<!-- FILE: 06-coderprog-catalog-assessment.md -->
<!-- ====================================================================== -->

# Coderprog Catalog Assessment — BCF Coding Agent Usefulness

**Date:** 2026-09-30 · **Catalog:** `coderprog_catalog.json` (3,130 items) · **Scope:** Google – The Gemma 4 Developer Agent Competition (post-train `gemma-4-31b-it-qat-w4a16-ct` into an autonomous SWE agent; ADK `agent.yaml` + LoRA adapters + skills; scored on patched-repo pytest pass rates across a 12-hour budget on 4×L4 GPUs).

## Method

1. **Normalize** all 3,130 catalog items into flat records (title, authors, publisher, year, ISBN, pages, media, size, category, posted date, synopsis).
2. **Screen** with a rule-based scorer over title+synopsis across seven competition-need dimensions (post-training, agent architecture, code intelligence, Python SWE domain, tooling, ML foundations, evaluation) → 543 candidate items.
3. **Manually review** the full candidate list plus targeted tail scans of the remainder.
4. **Curate** every item judged useful, assign a 0–10 ranking score and a per-item justification (the table below).

## Ranking rubric

| Band | Meaning |
|:---|:---|
| 9.0–10 | Must-use: maps directly onto a submission-critical artifact (adapters, prompts, evals, serving) |
| 7.5–8.9 | High value: strong methodological or domain leverage |
| 6.0–7.4 | Useful: solid background or supporting practice |
| < 6.0 | Not included |

**Need tags** (what competition need each item serves): **PT**=post-training the Gemma-4 agent; **AG**=agent architecture & prompting; **CI**=code intelligence (graphs/embeddings); **PY**=Python SWE domain knowledge; **EV**=evaluation & testing; **IN**=infra/serving/tooling; **ML**=ML foundations.

## Headline findings

1. **Reinforcement Learning from Human Feedback: Alignment and post-training of LLMs** — 9.6
2. **A Hands-On Guide to Fine-Tuning Large Language Models with PyTorch and Hugging Face** — 9.4
3. **A Practical Guide to Reinforcement Learning from Human Feedback: Foundations, aligning large language models, and the evolution of preference-based methods** — 9.1
4. **Building Agentic AI: Workflows, Fine-Tuning, Optimization, and Deployment** — 9.0
5. **Advanced Retrieval-Augmented Generation: Bridging Large Language Models and Knowledge Graphs** — 8.9

The catalog is strongest on **post-training (PT)** and **agent architecture (AG)** — the two dimensions that decide the submission's score. Notably missing: anything on static-analysis/code-graph tooling at depth (only graph-adjacent RAG titles), and nothing Python-3.13-internals specific beyond CPython-adjacent material.

All items are English; the language column is omitted. Metadata (year, pages, ISBN, size, posted date, URL) is reproduced from the catalog as-is — note some video items carry the catalog's placeholder year "1920".

## Exclusions (major categories judged not useful)

Algorithmic trading/finance; healthcare/biology/neurology; quantum computing; time-series forecasting; signal/image processing; robotics/IoT/edge hardware; Excel/Power Platform/Microsoft 365/Copilot-365; AWS/Azure/Databricks vendor certification paths; n8n/no-code automation; Java/Spring/.NET/C++/Rust/PHP/Go/Swift language tracks; Selenium/Playwright/appium browser-E2E testing; AI governance/policy/philosophy; AI art/video generation; non-technical "AI leadership" titles; and generic beginner programming in non-Python languages. A small number of security/eval titles were kept only where they inform agent robustness gates.

## The table

| # | Score | Title | Type | Author(s) | Year | Pages | ISBN | Format(s) | Size | Posted | Source URL | Justification |
|---:|---:|:---|:---|:---|---:|---:|:---|:---|:---|:---|:---|:---|
| 1 | 9.6 | Reinforcement Learning from Human Feedback: Alignment and post-training of LLMs | Book | — | 2026 | 312 | 9781633434301 | PDF, EPUB | 24 MB | 2026-08-26 | https://coderprog.com/reinforcement-learning-human-feedback/ | Closest single match to the core task: RLHF/DPO-style post-training is exactly how the LoRA adapters in submission.zip get made. |
| 2 | 9.4 | A Hands-On Guide to Fine-Tuning Large Language Models with PyTorch and Hugging Face | Book | — | 2026 | 306 | 9798301961816 | PDF | 12 MB | 2026-03-16 | https://coderprog.com/hands-fine-tuning-llm-pytorch-hugging-face/ | Hands-on LoRA/PEFT fine-tuning with PyTorch+HF — the exact toolchain for producing adapter_model.safetensors for gemma-4-31b. |
| 3 | 9.1 | A Practical Guide to Reinforcement Learning from Human Feedback: Foundations, aligning large language models, and the evolution of preference-based methods | Book | — | 2026 | 399 | 9781835880500 | PDF, EPUB | 27 MB | 2026-03-28 | https://coderprog.com/practical-reinforcement-learning-human-feedback/ | Second RLHF text; preference-based post-training methods (DPO/PPO variants) apply directly to reward-shaped SWE-task training. |
| 4 | 9.0 | Building Agentic AI: Workflows, Fine-Tuning, Optimization, and Deployment | Book | — | 2026 | 320 | 978-0135489680 | EPUB | 53 MB | 2026-01-23 | https://coderprog.com/building-agentic-ai-fine-tuning-optimization/ | Covers both halves of the submission: agentic workflow design plus fine-tuning/optimization for deployment. |
| 5 | 8.9 | Advanced Retrieval-Augmented Generation: Bridging Large Language Models and Knowledge Graphs | Book | — | 2026 | 560 | 9781394374687 | PDF, EPUB | 23 MB | 2026-08-04 | https://coderprog.com/advanced-retrieval-augmented-generation-bridging/ | Graph+LLM retrieval patterns map onto get_code_neighbors/search_similar_code; teaches exploiting repo graphs like the competition's AST graphs. |
| 6 | 8.9 | Systems Thinking for Agentic AI: A Software Architect’s Guide to Building Reliable LLM and Agent Systems | Book | — | 2026 | 488 | 9798197120960 | EPUB | 25 MB | 2026-07-14 | https://coderprog.com/systems-thinking-agentic-ai-software-architects/ | Reliability engineering for LLM agent systems — directly informs BCF gates, journals, and rescue-mode state machine design. |
| 7 | 8.8 | Agentic GraphRAG: Integrating Knowledge Graphs, Reasoning, and Agency for Enterprise AI | Book | — | 2026 | 386 | 9798341623170 | EPUB | 10 MB | 2026-09-03 | https://coderprog.com/agentic-graphrag-integrating-graphs-enterprise-ai/ | Agentic traversal of knowledge graphs is a direct analogue to Phase-2 localization over the provided NetworkX call/dependency graphs. |
| 8 | 8.7 | Effective Python: 125 Specific Ways to Write Better Python, 3rd Edition | Book | — | 2025 | 672 | 978-0138172183 | PDF, EPUB | 96 MB | 2026-01-07 | https://coderprog.com/effective-python-software-development-3rd/ | The target repos (fastapi, httpx, requests, rich) are idiomatic modern Python; highest-density source of Pythonic patch conventions for skill resources and training data. |
| 9 | 8.7 | Model Context Protocol for LLMs: Build secure, scalable, and context-aware AI agents using a standardized protocol | Book | — | 2026 | 540 | 978-1806662272 | PDF, EPUB | 35 MB | 2026-03-06 | https://coderprog.com/model-context-protocol-llms-scalable-ai-agents/ | MCP tool-protocol design discipline transfers to structuring the nine harness tools and sub-agent tool contracts in agent.yaml. |
| 10 | 8.6 | AI Agents and Applications: With LangChain, LangGraph, and MCP | Book | — | 2026 | 448 | 978-1633436541 | PDF, EPUB | 25 MB | 2026-03-09 | https://coderprog.com/ai-agents-applications-langchain-langgraph-mcp/ | Current agent-framework survey (LangGraph state machines, MCP) — vocabulary and patterns for multi-agent YAML configs and sub-agents. |
| 11 | 8.6 | Beyond Code: Build Reliable AI-Assisted Software with Context Engineering, Mechanical Gates, and AI Agent Control | Book | — | 2026 | 172 | 9781808342035 | PDF, EPUB | 10 MB | 2026-08-11 | https://coderprog.com/beyond-code-ai-assisted-software-engineering/ | Mechanical gates + context engineering mirror BCF's binary 'done' tenet and G0-G5 gate design; process-level guidance for agent control. |
| 12 | 8.5 | 101 Claude Code Tips – Master Hooks, Skills, MCP, and Agentic Workflows: A Battle-Tested Field Guide to CLAUDE.md, Subagents, Plan Mode, and Verification | Book | — | 2026 | 127 | B0H3MJR6KX | PDF, EPUB | 10 MB | 2026-08-16 | https://coderprog.com/claude-code-tips-hooks-skills-mcp-agentic-workflows/ | Field-tested agentic-coding habits (verification, subagents, plan mode) that translate into system-prompt and skill design for the BCF agent. |
| 13 | 8.5 | Agentic Coding with Claude Code: The everyday developer’s guide to agentic coding with Claude Code | Book | — | 2026 | 376 | 9781806022595 | PDF, EPUB | 165 MB | 2026-03-27 | https://coderprog.com/agentic-coding-claude-code-everyday-developers/ | Practical agentic loop design from a production coding agent — the closest public analogue to what the BCF agent must do in /workspace. |
| 14 | 8.4 | Best Practices for Claude Code – Write Production-Grade Code with AI: Advanced Prompting, Scratchpads, and Safe Edits to Existing Codebases in Claude Code | Book | — | 2026 | 186 | B0H3KC13YN | PDF, EPUB | 10 MB | 2026-08-13 | https://coderprog.com/best-practices-claude-code-production-code-ai/ | Safe-edit patterns for existing codebases (scratchpads, guarded edits) mirror BCF Phase-3 minimum-patch discipline and edit_file usage. |
| 15 | 8.4 | Hands-On LLM Serving and Optimization: Hosting LLMs at Scale | Book | — | 2026 | 372 | 9798341621497 | PDF, EPUB | 23 MB | 2026-05-29 | https://coderprog.com/hands-llm-serving-optimization-hosting/ | Serving, KV-cache and quantized-inference optimization directly relevant to the 4x L4 (96 GB) inference environment and 12-hour budget. |
| 16 | 8.4 | Ultimate Multimodal Transformer Models: Master LLMs, Vision Transformers, RAG, AI Agents, Fine-Tuning, and Multimodal AI Systems with PyTorch and Hugging Face | Book | — | 2026 | 350 | 9788169646161 | EPUB | 14 MB | 2026-06-04 | https://coderprog.com/ultimate-multimodal-transformer-models-master/ | Transformer/PEFT/RAG fundamentals with PyTorch+HF; background needed to reason about the QAT w4a16 base model + LoRA headroom. |
| 17 | 8.3 | Agentic Architectural Patterns for Building Multi-Agent Systems: Proven design patterns and practices for GenAI, agents, RAG, LLMOps, and enterprise-scale AI systems | Book | — | 2026 | 576 | 978-1806029570 | PDF, EPUB | 65 MB | 2026-02-06 | https://coderprog.com/agentic-architectural-patterns-multi-agent-systems/ | Catalog of proven multi-agent patterns — informs root-agent vs sub_agents decomposition and agent_tool wiring. |
| 18 | 8.3 | AI Evals in Practice: Testing, reliability, and quality for LLM systems in production | Book | — | 2026 | 150 | 9781808817250 | PDF, EPUB | 10 MB | 2026-09-24 | https://coderprog.com/ai-evals-practice-llm-systems-production/ | LLM-system eval methodology for the local dev loop; fail-to-pass/pass-to-pass regression tracking mirrors the harness's two-phase verification. |
| 19 | 8.3 | Design Multi-Agent AI Systems Using MCP and A2A: Engineer your own Python-based agentic AI framework with tool use, memory, and multi-agent workflows | Book | — | 2026 | 536 | 978-1806116478 | PDF, EPUB | 94 MB | 2026-03-03 | https://coderprog.com/design-multi-agent-ai-systems-mcp-a2a-engineer/ | Python-first multi-agent framework design with tool use and memory; transferable to sub-agent role scoping (analyzer vs implementer). |
| 20 | 8.3 | How to Build and Fine‐Tune a Small Language Model: A Step-by-Step Guide for Beginners, Researchers, and Non-Programmers | Book | — | 2026 | 489 | 9798274766227 | PDF, EPUB | 10 MB | 2026-03-22 | https://coderprog.com/build-fine-tune-small-language-model-programmers/ | End-to-end SLM training walkthrough; the competition model is a 31B QAT SLM, so small-model training economics and data curation apply directly. |
| 21 | 8.2 | AI Agents in Action, Second Edition: Intelligent workflows with LLMs, MCP, A2A, and more | Book | — | 2026 | 392 | 9781633434530 | EPUB | 10 MB | 2026-07-07 | https://coderprog.com/ai-agents-action-intelligent-workflows-2nd/ | Up-to-date agent workflow reference covering MCP/A2A; supports ADK-style orchestration design decisions. |
| 22 | 8.2 | AI Context Engineering: Master the Art of Context Engineering for LLMs | Video course | — | — | — | — | MP4 | 4.73 GB | 2026-09-21 | https://coderprog.com/ai-context-engineering-llm-course/ | Context assembly/compaction techniques counter the harness's automatic context compaction — keeping critical state survives truncation. |
| 23 | 8.2 | Production AI Agents with LangChain + LangGraph [2026] | Video course | — | 1920 | — | — | MP4 | 13.23 GB | 2026-02-26 | https://coderprog.com/production-ai-agents-langchain-langgraph-course/ | Graph-based agent control flow (LangGraph) is the same paradigm as the BCF phase DAG with rescue back-edges; production focus matches grading reality. |
| 24 | 8.1 | Practical LLM Evaluation for Production Systems: Measure, monitor, and improve reliable LLM systems across training and inference | Book | — | 2026 | 433 | 9781807423896 | PDF, EPUB | 110 MB | 2026-07-11 | https://coderprog.com/practical-llm-evaluation-production-systems/ | Monitoring/measurement practices for LLM systems; grounds the offline validation loop on the 129 public tasks. |
| 25 | 8.1 | The Claude Code Operating Model: Build scalable AI coding systems with Skills, MCP, Hooks, agent orchestration, and SDK patterns | Book | — | 2026 | 346 | 9781808082719 | PDF, EPUB | 89 MB | 2026-08-18 | https://coderprog.com/claude-code-operating-model-agent-orchestration/ | Skills/hooks/orchestration patterns for coding agents — informs skills/ directory design and reusable resource files. |
| 26 | 8.0 | Build Your Own Claude Code | Video course | — | 1920 | — | — | MP4 | 11.29 GB | 2026-05-19 | https://coderprog.com/build-your-own-claude-code/ | Implementing a coding agent from scratch (tools, loop, permissions) demystifies the swegemma harness the submission runs in. |
| 27 | 8.0 | Harness Engineering Workshop: Build a Real Agent from Scratch | Video course | — | — | — | — | MP4 | 1.61 GB | 2026-09-13 | https://coderprog.com/harness-engineering-workshop-course/ | Building an agent harness end-to-end clarifies exactly what the competition harness does to the agent — and how to exploit the loop contract. |
| 28 | 8.0 | Master AI Powered Test Automation – AI Agents, MCPs, LLMs | Video course | — | — | — | — | MP4 | 1.44 GB | 2026-03-26 | https://coderprog.com/master-ai-test-automation-course/ | Agentic test-generation loops; pattern source for Phase-4 validation behavior and targeted pytest strategies. |
| 29 | 8.0 | Python AI Programming, Second Edition: Kickstart developing AI-ready apps with RAG, DSPy, MCP, agents, evals, observability and open-source models | Book | — | 2026 | 200 | 9789349174511 | EPUB | 10 MB | 2026-08-23 | https://coderprog.com/python-ai-programming-kickstart-developing-2nd/ | Covers RAG, DSPy, MCP, agents, evals, and observability in one Python-first volume; good cross-check for the whole stack. |
| 30 | 7.9 | Agentic Coding with OpenAI Codex CLI: Build intelligent agent workflows using Agentic Engineering, MCP, hooks, and delivery automation | Book | — | 2026 | 670 | 9781808348891 | PDF, EPUB | 32 MB | 2026-08-13 | https://coderprog.com/agentic-coding-openai-codex-cli-engineering/ | MCP/hooks/delivery automation patterns from a second production coding agent; triangulates best practices for loop design. |
| 31 | 7.9 | Building Large Language Models from Scratch: Design, Train, and Deploy LLMs with PyTorch | Book | — | 2026 | 555 | 9798868822964 | PDF, EPUB | 30 MB | 2026-05-22 | https://coderprog.com/building-large-language-models-scratch/ | Pretraining-to-deployment fundamentals; clarifies what QAT quantization did to the base model and what LoRA can restore. |
| 32 | 7.9 | Claude Code Bootcamp: Hooks, MCP & Agentic AI Workflows | Video course | — | 1920 | — | — | MP4 | 5.00 GB | 2026-05-02 | https://coderprog.com/claude-code-bootcamp-workflows-course/ | Video walkthrough of hooks/MCP/agentic workflows; deterministic pre/post-call checks like BCF gates. |
| 33 | 7.9 | Codex CLI: Agentic Engineering from First Principles | Book | — | 2026 | 971 | — | PDF, EPUB | 22 MB | 2026-06-03 | https://coderprog.com/codex-cli-agentic-engineering-principles/ | First-principles agentic engineering (planning, tool discipline) independent of any vendor — clean source for BCF phase prompts. |
| 34 | 7.9 | Spec-Driven Development with BMAD: Master Agentic Workflows using Cursor, BMAD, and Context Engineering | Book | — | 2026 | 167 | 9781808086076 | PDF, EPUB | 577 MB | 2026-09-01 | https://coderprog.com/spec-driven-development-bmad-context-engineering/ | Spec-first agentic workflows operationalize BCF Phase 1 (no tool calls before specification completes) with a mature methodology. |
| 35 | 7.8 | An Illustrated Guide to AI Agents: Concepts and Code for Building Agents with LLMs, Tools, and Memory | Book | — | 2026 | 448 | 9798341662698 | PDF, EPUB | 80 MB | 2026-09-16 | https://coderprog.com/illustrated-guide-ai-agents-concepts/ | Visual, code-first agent concepts (tools, memory, loops) — efficient shared reference for designing journal/breadcrumb memory. |
| 36 | 7.8 | Build GenAI Agents with OpenAI + vLLM: Develop portable AI agents in Python with structured outputs, tool calling, OpenAI Agents SDK, vLLM, model switching, CLI, API, and Docker deployment | Book | — | 2026 | 120 | 9789349174245 | EPUB | 10 MB | 2026-08-13 | https://coderprog.com/build-genai-agents-openai-vllm-deployment/ | Structured outputs, tool calling, and vLLM serving — vLLM is the likely serving path for multi-LoRA routing on L4s. |
| 37 | 7.8 | Designing Multi-Agent Systems: Principles, Patterns, and Implementation for AI Agents | Book | — | 2026 | 394 | 9798993101200 | PDF, EPUB | 13 MB | 2026-04-18 | https://coderprog.com/designing-multi-agent-systems-implementation-ai/ | Implementation-level multi-agent design; supports role separation (issue_analyzer cannot edit) via tool permissions. |
| 38 | 7.8 | Domain-Specific Small Language Models: Efficient AI for local deployment | Book | — | 2026 | 376 | 9781633436701 | PDF, EPUB | 51 MB | 2026-05-20 | https://coderprog.com/domain-specific-small-language-models-deployment/ | Building domain-specific SLMs (data curation, distillation) matches the strategy of specializing a small base model for Python SWE. |
| 39 | 7.7 | AI Agents: The Definitive Guide: Design, Deployment, and Evaluation for Production | Book | — | 2026 | 376 | 9798341666931 | EPUB | 10 MB | 2026-09-19 | https://coderprog.com/ai-agents-definitive-deployment-production/ | Full lifecycle incl. evaluation; useful checklist coverage for the dev-to-submission pipeline. |
| 40 | 7.7 | Hands-On Software Engineering with Python: Move beyond basic programming to design, maintain, and deploy extensible Python systems | Book | — | 2026 | 628 | 978-1835888018 | PDF, EPUB | 25 MB | 2026-01-01 | https://coderprog.com/hands-software-engineering-python-programming/ | Design/maintain/deploy patterns for extensible Python systems — background for reasoning about unfamiliar repo architecture during localization. |
| 41 | 7.6 | AI Engineer Core Track: LLM Engineering, RAG, QLoRA, Agents | Video course | — | 1920 | — | — | MP4 | 49.43 GB | 2026-07-19 | https://coderprog.com/ai-engineer-core-track-course/ | Video track covering QLoRA and agents together — the two halves of this submission in one curriculum. |
| 42 | 7.6 | Guide to the Software Engineering Body of Knowledge: SWEBoK Guide v4.0a | Book | — | 2026 | 411 | 9780769500003 | PDF | 10 MB | 2026-09-07 | https://coderprog.com/software-engineering-body-swebok-4/ | Canonical SWE taxonomy; solid source for skill-resource definitions (testing, maintenance, quality) the agent can consult in Phase 1. |
| 43 | 7.5 | Building Agent-Powered Applications: Your guide to generative AI, RAG, fine-tuning, and orchestration for production use | Book | — | 2026 | 490 | 9781807605179 | PDF, EPUB | 41 MB | 2026-05-09 | https://coderprog.com/building-agent-powered-applications-production/ | Combines RAG + fine-tuning + orchestration; helps decide which capability (scaffold vs adapter) should solve which failure mode. |
| 44 | 7.5 | Building Natural Language and LLM Pipelines: Build production-grade RAG, tool contracts, and context engineering with Haystack and LangGraph | Book | — | 2026 | 521 | 978-1835467008 | PDF, EPUB | 23 MB | 2026-01-06 | https://coderprog.com/building-natural-language-llm-pipelines-production/ | Tool contracts and context engineering for production pipelines; directly shapes the agent's tool-call schemas and output hygiene. |
| 45 | 7.5 | LLM-Assisted Software Design, a Pattern Language for New Practices | Book | — | 2026 | 120 | — | PDF | 40 MB | 2026-03-27 | https://coderprog.com/llm-assisted-software-design-pattern-practices/ | Pattern language for AI-assisted software design — vocabulary for documenting BCF conventions in skill resources. |
| 46 | 7.5 | Mastering NLP From Foundations to Agents: Building AI Agents through Agentic Automation and RAG Workflows with Python | Book | — | 2026 | 497 | 978-1806106134 | PDF, EPUB | 29 MB | 2026-03-08 | https://coderprog.com/mastering-nlp-foundations-agents-automation/ | NLP-to-agents progression with Python; fills theory gaps behind prompt/tool behaviors. |
| 47 | 7.5 | RAG from First Principles: Engineering retrieval-augmented generation systems with Python, LangChain, and LlamaIndex | Book | — | 2026 | 414 | 9781835888667 | PDF, EPUB | 64 MB | 2026-06-12 | https://coderprog.com/rag-first-principles-engineering-retrieval-augmented/ | Retrieval mechanics from scratch; sharpens use of the pre-computed 256-dim node embeddings behind search_similar_code. |
| 48 | 7.4 | Agentic AI Systems – The Complete Guide for Building Production AI Agents: A practical guide for operators and technical teams building LLM-powered agent systems | Book | — | 2026 | 191 | 9798248848911 | EPUB | 10 MB | 2026-05-19 | https://coderprog.com/agentic-ai-systems-complete-production-agents/ | Production-operator view of agent systems (guardrails, rollout discipline) applicable to pre-submission hardening. |
| 49 | 7.4 | AI Agents with MCP: Model Context Protocol for Building Clients, Servers, and End-to-End Agents | Book | — | 2026 | 347 | 9798341639553 | EPUB | 10 MB | 2026-09-28 | https://coderprog.com/ai-agents-mcp-model-context-protocol-building/ | End-to-end MCP implementation; reference for tool-envelope design even though harness tools are fixed. |
| 50 | 7.4 | AI Agents with Model Context Protocol Specialization | Video course | — | — | — | — | MP4 | 4.33 GB | 2026-03-14 | https://coderprog.com/ai-agents-mcp-specialization/ | Structured Coursera specialization on MCP; systematic coverage of client/server/agent patterns. |
| 51 | 7.4 | AI Engineering Fundamentals: Build Real LLM Apps in Python | Video course | — | 1920 | — | — | MP4 | 3.85 GB | 2026-07-17 | https://coderprog.com/ai-engineering-fundamentals-python-course/ | Python-first LLM app fundamentals; team onboarding material for scaffold work. |
| 52 | 7.4 | Mastering Large Language Models: Architectures, Applications, and Real-World Deployments of Large Language Models | Book | — | 2026 | 630 | 9798868827327 | PDF, EPUB | 81 MB | 2026-07-25 | https://coderprog.com/mastering-llm-architectures-applications-deployments/ | LLM architecture survey; supports informed choices about adapter rank/target modules. |
| 53 | 7.4 | Prompting FastAPI for Backend Development: Build Production-Ready FastAPI Applications with Async Python, REST APIs, Authentication, Testing, Deployment, and AI Prompt Engineering | Book | — | 2026 | 420 | 9788169646451 | EPUB | 10 MB | 2026-09-06 | https://coderprog.com/prompting-fastapi-backend-development-production-ready/ | fastapi is the largest target repo in tasks.jsonl; FastAPI-specific idiom, testing, and async patterns sharpen training data and localization priors. |
| 54 | 7.3 | Building Complex Multi-Agent Systems Using Pattern Prompting: A guide to building robust and secure GenAI applications using software engineering best practices | Book | — | 2026 | 310 | 9781806114290 | PDF, EPUB | 68 MB | 2026-05-18 | https://coderprog.com/building-complex-multi-agent-systems-pattern-prompting/ | SWE-best-practice prompting structures for multi-agent robustness; relevant to nudge/continuation handling. |
| 55 | 7.3 | Claude Code Masterclass | Video course | — | 1920 | — | — | MP4 | 4.49 GB | 2026-02-10 | https://coderprog.com/claude-code-masterclass-course/ | Broad CC coverage (skills, MCP, hooks) for pattern reuse in skills/ design. |
| 56 | 7.3 | Clean AI: Agentic Discipline (Clean Coders Video Series) | Video course | — | 2048 | — | — | MP4 | 7.91 GB | 2026-05-15 | https://coderprog.com/clean-ai-agentic-discipline-video/ | 'Agentic discipline' video series — process hygiene (revert rules, verification) that matches BCF circuit breakers. |
| 57 | 7.3 | Deep Dive: Claude Code | Video course | — | 1920 | — | — | MP4 | 1.92 GB | 2026-08-28 | https://coderprog.com/deep-dive-claude-code-course/ | Advanced walkthrough of a production coding agent's internals; reference for loop/nudge behavior. |
| 58 | 7.3 | Graph Neural Networks: Concepts and Applications | Book | — | 2026 | 960 | 9781394422739 | PDF | 108 MB | 2026-09-16 | https://coderprog.com/graph-neural-networks-concepts-applications/ | GNN foundations for reasoning about how the 256-dim node embeddings were produced and when similarity search can be trusted. |
| 59 | 7.3 | Prompting Generative AI for Intelligent Applications: Build LLM Applications, RAG Pipelines, AI Agents, Chatbots, and Vector Database Workflows Faster with Prompt Engineering | Book | — | 2026 | 453 | 9788169646086 | EPUB | 25 MB | 2026-06-20 | https://coderprog.com/prompting-generative-ai-intelligent-applications-pipelines/ | Prompt engineering fused with RAG/vector workflows; source of prompt templates for phase transitions. |
| 60 | 7.2 | Building Agentic AI From Workflows to Production | Video course | — | — | — | — | MP4 | 8.70 GB | 2026-03-21 | https://coderprog.com/building-agentic-ai-workflows-production/ | Video: workflow-to-production agent engineering; deployment-stage realities mirror the two-container harness. |
| 61 | 7.2 | Essential Test-Driven Development | Book | — | 2026 | 256 | 9780134494159 | EPUB | 10 MB | 2026-07-11 | https://coderprog.com/essential-test-driven-development/ | TDD discipline transfers to writing targeted reproducers before patching — cheap fail-to-pass confirmation in Phase 4. |
| 62 | 7.2 | Generative AI Design Patterns: Solutions to Common Challenges When Building GenAI Agents and Applications | Book | — | 2025 | 506 | 979-8341622661 | PDF, EPUB | 35 MB | 2026-03-17 | https://coderprog.com/generative-ai-design-patterns-applications/ | Solution catalog for known GenAI failure modes; a quick checklist against BCF's known-gap list. |
| 63 | 7.2 | Hermes Agent: Build a Self-Improving AI Agent | Video course | — | 1920 | — | — | MP4 | 6.71 GB | 2026-09-06 | https://coderprog.com/hermes-self-improving-ai-agent-course/ | Self-improvement loops (memory, feedback) are a design input for BCF's journal-driven rescue/induction rounds. |
| 64 | 7.2 | Local LLMs via Ollama & LM Studio – The Practical Guide | Video course | — | 1920 | — | — | MP4 | 1.79 GB | 2026-03-31 | https://coderprog.com/running-open-llms-locally-practical/ | Practical local-model serving skills for offline experiments and synthetic data generation without cloud dependency. |
| 65 | 7.2 | Practical Multi-Agent AI Systems: How to Architect, Build, and Scale Next-Generation AI Systems That Work in the Real World | Book | — | 2026 | 544 | 9781394418497 | EPUB | 37 MB | 2026-07-19 | https://coderprog.com/practical-multi-agent-ai-systems-architect-real-world/ | Real-world multi-agent architecture trade-offs; informs whether sub-agents pay for themselves within the token budget. |
| 66 | 7.2 | RAG with Python Cookbook: Learn principles of RAG with LLM and agentic AI, with 120+ recipes | Book | — | 2026 | 414 | 9365895731 | EPUB | 10 MB | 2026-03-18 | https://coderprog.com/rag-python-cookbook-agentic-ai-recipes/ | 120+ practical RAG recipes; rapid prototyping reference for custom retrieval experiments on graph node text. |
| 67 | 7.1 | Agentic AI System Design | Video course | — | 1920 | — | — | MP4 | 4.53 GB | 2026-07-04 | https://coderprog.com/agentic-ai-system-design-course/ | System-design treatment of agentic AI; complements phase-DAG and budget design. |
| 68 | 7.1 | Building Data-Driven Applications with LlamaIndex: A practical guide to RAG pipelines, agentic workflows, and production AI deployment, 2nd Edition | Book | — | 2026 | 526 | 9781806021857 | PDF, EPUB | 102 MB | 2026-06-01 | https://coderprog.com/building-data-driven-applications-llamaindex-2nd/ | Indexing/retrieval pipelines (2nd ed.); alternate retrieval design ideas for leveraging repo graph + embeddings. |
| 69 | 7.1 | Claude Code: The Complete Course | Video course | — | 1920 | — | — | MP4 | 7.17 GB | 2026-04-27 | https://coderprog.com/claude-code-the-complete-course/ | Comprehensive video course on a production coding agent; pattern source for prompts/skills. |
| 70 | 7.1 | Generative AI and Agentic Operations: Reliable, Scalable, Safe Systems | Book | — | 2026 | 160 | 9781394451739 | PDF | 10 MB | 2026-09-15 | https://coderprog.com/generative-ai-agentic-operations-reliable-scalable/ | Operational reliability/safety patterns for agent systems; pre-submission robustness checklist. |
| 71 | 7.1 | Master LLM Inference Engineering | Video course | — | 1920 | — | — | MP4 | 5.15 GB | 2026-08-05 | https://coderprog.com/master-llm-inference-engineering-course/ | Inference internals (KV cache, batching, quantized serving) for squeezing the 31B QAT model onto 96 GB within the time budget. |
| 72 | 7.1 | Mastering OpenCode: AI Agents, Skills, MCP & Automation | Video course | — | 1920 | — | — | MP4 | 1.71 GB | 2026-09-18 | https://coderprog.com/mastering-opencode-ai-agents-mcp-automation/ | Open-source coding agent with local models — close cousin of the competition setup (small model, terminal tools). |
| 73 | 7.1 | Production-Ready Systems with LLMs and Agents: An Intensive for Engineers | Video course | — | 1920 | — | — | MP4 | 1.39 GB | 2026-08-19 | https://coderprog.com/production-ready-systems-agents-course/ | Engineer-intensive treatment of production LLM agent systems; late-stage hardening reference. |
| 74 | 7.1 | PyTorch: The Practical Guide to Building, Training, and Deploying Deep Learning Models | Book | — | 2026 | 415 | 978-1493227860 | PDF, EPUB | 43 MB | 2026-03-01 | https://coderprog.com/pytorch-building-deploying-deep-learning-models/ | Practical PyTorch training reference underlying any custom RL/fine-tuning scripts. |
| 75 | 7.1 | Ultimate AI Agent Development with Semantic Kernel: Build Intelligent AI Agents, RAG Pipelines, Enterprise Automation, and LLM Applications with Microsoft Semantic Kernel | Book | — | 2026 | 410 | 9788169646048 | EPUB | 10 MB | 2026-07-01 | https://coderprog.com/ultimate-ai-agent-development-semantic-kernel/ | Framework-specific but rigorous treatment of planners/plugins; transfers to ADK tool/agent declarations. |
| 76 | 7.1 | Unlocking Data with Generative AI and RAG: Learn AI agent fundamentals with RAG-powered memory, graph-based RAG, and intelligent recall, 2nd Edition | Book | — | 2026 | 606 | 978-1806381654 | PDF, EPUB | 22 MB | 2026-01-04 | https://coderprog.com/unlocking-data-generative-ai-rag-2nd/ | Graph-based RAG and agent memory (2nd ed.); parallels the graph-tools + journal memory combination in BCF. |
| 77 | 7.0 | Accelerating Deep Neural Networks | Book | — | 2026 | 311 | 9781009687089 | PDF | 30 MB | 2026-05-10 | https://coderprog.com/accelerating-deep-neural-networks/ | Inference acceleration (pruning/distillation/quantization) applicable to the w4a16 serving budget. |
| 78 | 7.0 | Advanced Python: Python Packaging II. Industry Level Code. | Video course | — | 1920 | — | — | MP4 | 3.88 GB | 2026-01-04 | https://coderprog.com/advanced-python-packaging-industry-course/ | Industry-grade Python packaging; the sandbox does offline editable installs from /wheels, and packaging literacy helps diagnose setup failures. |
| 79 | 7.0 | Agentic DevOps with Claude Code: Build governed AI platforms on Kubernetes with GitOps, observability, and self-service workflows | Book | — | 2026 | 125 | 9781808344190 | PDF, EPUB | 28 MB | 2026-09-26 | https://coderprog.com/agentic-devops-claude-code-governed-ai-platforms/ | Governed, observable agentic platforms (GitOps); source for submission-repo hygiene and eval artifact tracking. |
| 80 | 7.0 | Agentic Linux Administration: Automate, Troubleshoot, and Secure Linux with ChatGPT, Claude, Aider, and AI CLI Tools | Book | — | 2026 | 300 | 9781808724794 | PDF, EPUB | 106 MB | 2026-09-18 | https://coderprog.com/agentic-linux-administration-automate-troubleshoot/ | AI-driven Linux/CLI troubleshooting patterns — run_command is /bin/bash in /workspace, so shell fluency compounds. |
| 81 | 7.0 | AI Engineer Agentic Track: The Complete Agent & MCP Course | Video course | — | 1920 | — | — | MP4 | 23.31 GB | 2026-08-01 | https://coderprog.com/complete-agentic-ai-engineering-course/ | Video: complete agent+MCP course; broad scaffold-building curriculum. |
| 82 | 7.0 | AI Software Development with opencode | Video course | — | 1920 | — | — | MP4 | 1.29 GB | 2026-07-26 | https://coderprog.com/ai-software-development-opencode-course/ | Terminal-agent practice with free models; cheap repetition of the navigate-patch-verify loop. |
| 83 | 7.0 | Building AI Agents for Network Operations: Design LLM-powered NetOps workflows with Python, Ollama, MCP, and tool calling | Book | — | 2026 | 226 | 9781808346835 | PDF, EPUB | 50 MB | 2026-08-07 | https://coderprog.com/building-ai-agents-network-operations-workflows/ | Top raw score but NetOps domain is irrelevant; included for its Python+Ollama+MCP tool-calling construction patterns only. |
| 84 | 7.0 | GPU-Accelerated Computing with Python 3 and CUDA: From low-level kernels to real-world applications in scientific computing and machine learning | Book | — | 2026 | 534 | 9781803245423 | PDF, EPUB | 236 MB | 2026-04-11 | https://coderprog.com/gpu-accelerated-computing-python-3-cuda/ | CUDA-from-Python fundamentals useful for profiling LoRA training jobs on the L4 fleet. |
| 85 | 7.0 | Hardening MCP Servers: Hands-on recipes to secure MCP Servers from code injection, rug pulls, OAuth flaws, and prompt attacks | Book | — | 2026 | 116 | 9789349174542 | EPUB | 10 MB | 2026-08-06 | https://coderprog.com/hardening-mcp-servers-hands-injection/ | Prompt-injection/tool-abuse defense recipes; informs gate design against pathological tool outputs in adversarial problem statements. |
| 86 | 7.0 | Laws of Software Engineering | Book | — | 2026 | 310 | 9789699893681 | PDF, EPUB | 50 MB | 2026-05-17 | https://coderprog.com/laws-software-engineering-milanovic/ | Distilled SWE laws; compact skill-resource material for Phase-1 planning heuristics. |
| 87 | 7.0 | Learning GitHub Copilot: Multiplying Your Coding Productivity Using AI | Book | — | 2025 | 350 | 978-1098164652 | PDF, EPUB | 55 MB | 2026-03-15 | https://coderprog.com/learning-github-copilot-multiplying-productivity/ | Structured take on AI pair-programming strengths/limits; calibrates expectations for a 31B agent. |
| 88 | 7.0 | MCP For Dummies | Book | — | 2026 | 432 | 9781394424757 | PDF, EPUB | 24 MB | 2026-09-11 | https://coderprog.com/mcp-dummies/ | Fast on-ramp to MCP fundamentals; baseline literacy for tool-protocol reasoning. |
| 89 | 7.0 | Ollama in Action – Run Private, Multimodal AI on Your Own Machine: Install Local LLMs, Call Them from Python, and Build a Multimodal Image App with Ollama | Book | — | 2026 | 101 | B0H3K73FZ1 | PDF, EPUB | 10 MB | 2026-08-18 | https://coderprog.com/ollama-action-private-multimodal-machine/ | Running local LLMs from Python; enables fast local experiments with Gemma-family models. |
| 90 | 7.0 | OpenCode Beginner to Pro: Agentic Coding with Free AI Models | Video course | — | 1920 | — | — | MP4 | 858 MB | 2026-06-22 | https://coderprog.com/opencode-agentic-coding-ai-models-course/ | Free-model agentic coding practice — budget-friendly way to A/B loop policies before spending Kaggle quota. |
| 91 | 7.0 | Prompt Engineering Mastery: How to Optimize Interactions with Large Language Models | Book | — | 2026 | 179 | 9798898813628 | PDF, EPUB | 10 MB | 2026-05-28 | https://coderprog.com/prompt-engineering-mastery-optimize-interactions/ | Prompt optimization fundamentals; baseline hygiene for system.md and phase prompts. |
| 92 | 7.0 | Python Object-Oriented Programming: Learn how and when to apply OOP principles to build scalable and maintainable Python applications, 5th Edition | Book | — | 2026 | 542 | 978-1836642596 | PDF, EPUB | 25 MB | 2026-01-09 | https://coderprog.com/python-object-oriented-programming-5th/ | OOP fluency in modern Python (5th ed.); most patch sites in the target repos are class hierarchies. |
| 93 | 7.0 | RAG with Python Cookbook: Practical Recipes from Data Preprocessing to LLM Agents | Book | — | 2026 | 375 | 9798341600560 | PDF, EPUB | 33 MB | 2026-05-01 | https://coderprog.com/rag-python-cookbook-preprocessing-llm-agents/ | Second RAG cookbook (PDF+EPUB); recipe coverage through agentic retrieval. |
| 94 | 7.0 | Responsible Software Engineering: With Real-World Case Studies from Google | Book | — | 2025 | 200 | 978-1098149161 | PDF, EPUB | 39 MB | 2026-03-13 | https://coderprog.com/responsible-software-engineering-real-world/ | Google's SWE practice case studies; quality-process background for verification design. |
| 95 | 7.0 | Ship an MCP Server in Python – Fast: Build, test, and deploy a production-ready MCP server with MCP Inspector, mcp.json, and Streamable HTTP | Book | — | 2026 | 74 | B0GSZD6H2J | PDF, EPUB | 10 MB | 2026-04-04 | https://coderprog.com/ship-mcp-server-python-production-ready/ | Fast, test-driven MCP server construction in Python; skill scripts benefit from the same contract discipline. |
| 96 | 7.0 | Spec-Driven Development: From Specs to Code with AI Agents | Book | — | 2026 | 175 | 9798868828508 | PDF, EPUB | 10 MB | 2026-08-21 | https://coderprog.com/spec-driven-development-code-ai-agents/ | Spec-to-code pipeline design; reinforces Phase-1 specification discipline with acceptance assertions. |
| 97 | 7.0 | The Developer’s Guide to AI: A Field Guide for the Working Developer | Book | — | 2026 | 320 | 9781718504769 | PDF, EPUB | 24 MB | 2026-05-31 | https://coderprog.com/developers-guide-ai-working-developer/ | Working-developer orientation to building with AI; safe baseline reference. |
| 98 | 7.0 | The Mathematics of Large Language Models: Machine Learning Theory Made Readable: LLMs, Transformers, Diffusion, Neural Networks, Optimization, and Generative AI | Book | — | 2026 | 477 | 9798185219508 | EPUB | 11 MB | 2026-07-10 | https://coderprog.com/mathematics-large-language-models-optimization/ | Readable ML theory behind transformers/optimization; grounding for RL post-training decisions. |
| 99 | 7.0 | Ultimate LLMOps for LLM Engineering: Engineering Reliable, Observable, and Scalable LLM Systems | Book | — | 2026 | 344 | 978-9349887534 | EPUB | 10 MB | 2026-02-26 | https://coderprog.com/ultimate-llmops-llm-engineering-observable/ | LLMOps reliability/observability — blueprint for the file-based ledger that BCF records decisions in. |
| 100 | 7.0 | Vector Databases: A Practical Introduction | Book | — | 2026 | 292 | 9781098177591 | PDF, EPUB | 15 MB | 2026-04-12 | https://coderprog.com/vector-databases-practical-introduction/ | Vector-search fundamentals; clarifies ANN behavior behind search_similar_code's cosine top-k. |
| 101 | 6.9 | Agentic Coding for beginners: The Future of Software Development with AI Agents, Copilot, and Context-Aware Coding | Book | — | 2025 | 69 | — | PDF, EPUB | 11 MB | 2026-01-10 | https://coderprog.com/agentic-coding-beginners-software-development-ai/ | Context-aware coding concepts at intro level; team onboarding only. |
| 102 | 6.9 | AI Coder: From Vibe Coder to Agentic Engineer in 3 weeks | Video course | — | 1920 | — | — | MP4 | 19.68 GB | 2026-02-16 | https://coderprog.com/ai-coder-agentic-engineer-course/ | Structured progression to agentic engineering; onboarding scaffold for new contributors. |
| 103 | 6.9 | AI Engineering: Building AI Applications (LangChain, LLM APIs + more) | Video course | — | 1920 | — | — | MP4 | 3.38 GB | 2026-02-19 | https://coderprog.com/ai-engineering-bootcamp-applications-ztm/ | Video: applied LLM app construction; practical scaffold patterns. |
| 104 | 6.9 | AI-Driven Software Testing: Transforming Software Testing with Artificial Intelligence and Machine Learning | Book | — | 2025 | 549 | 979-8868818288 | PDF, EPUB | 39 MB | 2026-01-30 | https://coderprog.com/ai-driven-software-testing-transforming/ | How ML/AI changes test practice; background for automating validation reasoning. |
| 105 | 6.9 | Architecting Generative AI Applications: Build, deploy, and scale production-ready GenAI systems with LLMOps best practices | Book | — | 2026 | 278 | 9781806678655 | PDF, EPUB | 35 MB | 2026-04-14 | https://coderprog.com/architecting-generative-ai-applications-production/ | LLMOps architecture patterns; deployment-stage reference. |
| 106 | 6.9 | Breaking the Model Context Protocol: Agentic Attacks and Defenses for MCP‑Powered AI Systems | Book | — | 2026 | 301 | 9798868829673 | PDF, EPUB | 17 MB | 2026-09-05 | https://coderprog.com/breaking-model-context-protocol-attacks-defenses/ | MCP threat catalog; hardens gate design against tool-output manipulation. |
| 107 | 6.9 | Building Applications with AI Agents: A comprehensive guide to AI agents for beginners and practitioners | Book | — | 2026 | 250 | 978-9365894790 | EPUB | 10 MB | 2026-02-04 | https://coderprog.com/building-applications-ai-agents-comprehensive/ | Beginner-to-practitioner agent guide; backup reference. |
| 108 | 6.9 | Enterprise Vibe Coding for Agentic Engineering: Ship production-ready applications with Hypervelocity Engineering and proven agentic methods | Book | — | 2026 | 192 | 9781808087394 | PDF, EPUB | 64 MB | 2026-09-04 | https://coderprog.com/enterprise-vibe-coding-agentic-engineering-production/ | Production-grade agentic development methods; complements spec-driven habits. |
| 109 | 6.9 | Graph Theory: Connectivity, Software Engineering and Bioinformatics | Book | — | 2026 | 168 | 978-3119143721 | PDF, EPUB | 21 MB | 2026-01-10 | https://coderprog.com/graph-theory-connectivity-software-engineering/ | Graph theory with explicit software-engineering framing; supports graph-localization heuristics. |
| 110 | 6.9 | Mastering Claude AI: The Complete Practical Guide to Prompt Engineering, Projects, Artifacts, Claude Code, MCP, Automation, API Integration & Real-World AI Workflows | Book | — | 2026 | 254 | 9798186478096 | EPUB | 18 MB | 2026-07-18 | https://coderprog.com/mastering-claude-ai-prompt-engineering-automation-workflows/ | Claude ecosystem guide incl. Claude Code/MCP; productivity patterns for the human-driven parts of development. |
| 111 | 6.9 | Practical Approach to Agentic AI: From theory to real-world applications in agentic AI | Book | — | 2026 | 408 | 978-9365891898 | EPUB | 21 MB | 2026-02-19 | https://coderprog.com/practical-approach-agentic-ai-applications/ | Theory-to-practice agentic AI; mid-level reference. |
| 112 | 6.9 | The Art of Code: The surprising power of beauty in software development | Book | — | 2026 | 248 | 9781633434929 | PDF, EPUB | 20 MB | 2026-07-29 | https://coderprog.com/art-code-beauty-software-development/ | Software-craft perspective; marginal but cheap signal for what 'minimal, clean patch' means to human reviewers. |
| 113 | 6.8 | A Common-Sense Guide to Data Structures and Algorithms in Python, Volume 2: Level Up Your Core Programming Skills | Book | — | 2026 | 500 | 979-8888651322 | PDF, EPUB | 21 MB | 2026-08-26 | https://coderprog.com/common-sense-structures-algorithms-python-2/ | Volume 2 of the pragmatic DSA-in-Python series; same rationale. |
| 114 | 6.8 | Agentic Jumpstart. Don’t Write Code. Direct It. | Video course | — | 1920 | — | — | MP4 | 5.46 GB | 2026-01-03 | https://coderprog.com/agentic-jumpstart-course/ | Video: 'direct, don't write' agentic workflow mindset; light. |
| 115 | 6.8 | Data Structures and Algorithms Essentials You Always Wanted to Know: Master Python, Recursion, Dynamic Programming, and Greedy Algorithms With Hands-On Examples | Book | — | 2026 | 342 | 978-1636516349 | PDF, EPUB | 25 MB | 2026-02-14 | https://coderprog.com/data-structures-algorithms-essentials-know/ | DSA with Python hands-on; baseline CS support for reasoning about library internals. |
| 116 | 6.8 | Dead Simple Python: Idiomatic Python for the Impatient Programmer | Book | — | 2023 | 752 | 978-1718500921 | PDF, EPUB | 10 MB | 2026-01-08 | https://coderprog.com/dead-simple-python/ | Idiomatic Python depth; good skill-resource fodder for Pythonic conventions. |
| 117 | 6.8 | Foundations of Software Testing ISTQB Certification, 5th Edition | Book | — | 2026 | 288 | 978-1473795884 | EPUB | 10 MB | 2026-01-31 | https://coderprog.com/foundations-software-testing-istqb-5th/ | Formal testing taxonomy; reference for eval vocabulary. |
| 118 | 6.8 | Grokking Graph Algorithms for Coding Interviews | — | — | — | — | — | — | 236 MB | 2026-02-06 | https://coderprog.com/grokking-graph-algorithms-coding-interviews/ | Graph-algorithm drill book; quick skill-building for graph-tool exploitation. |
| 119 | 6.8 | Machine Learning System Design Interview | Book | — | 2023 | 294 | 9781736049129 | PDF | 16 MB | 2026-09-14 | https://coderprog.com/machine-learning-system-design-interview/ | ML-system design problems; interview framing but sharpens architecture reasoning. |
| 120 | 6.8 | Mastering Prompt Engineering: A Guide to Crafting Effective Prompts | Book | — | 2026 | 164 | 9788743813668 | PDF | 30 MB | 2026-08-04 | https://coderprog.com/mastering-prompt-engineering-crafting-effective/ | Compact prompt-craft reference. |
| 121 | 6.8 | Prompt-Driven Development Handbook: Structure your vibe coding journey with systematic AI-assisted development | Book | — | 2026 | 314 | 978-9365892932 | EPUB | 10 MB | 2026-02-19 | https://coderprog.com/prompt-driven-development-handbook-structure/ | Structured prompt-driven dev process; template source for phase prompts. |
| 122 | 6.8 | Software Design for Python Programmers: Principles and patterns | Book | — | 2026 | 456 | 978-1633439498 | PDF, EPUB | 48 MB | 2026-01-29 | https://coderprog.com/software-design-python-programmers-principles/ | Design principles/patterns in Python; mid-value background. |
| 123 | 6.8 | Taking Testing Seriously: The Rapid Software Testing Approach | Book | — | 2025 | 560 | 978-1394253197 | PDF, EPUB | 40 MB | 2026-02-18 | https://coderprog.com/taking-testing-seriously-rapid-software/ | Testing philosophy (Rapid Software Testing); shapes verification skepticism even if not tool-specific. |
| 124 | 6.8 | The Missing README: A Guide for the New Software Engineer | Book | — | 2021 | 288 | 978-1718501836 | PDF, EPUB | 10 MB | 2026-01-08 | https://coderprog.com/missing-readme-software-engineer/ | Professional SWE practices (code review, VCS, testing culture); background for realistic patch etiquette. |
| 125 | 6.8 | Vector Databases for Machine Learning: A Comprehensive Guide Specialization | Video course | — | 1920 | — | — | MP4 | 6.18 GB | 2026-05-20 | https://coderprog.com/vector-databases-machine-learning-specialization/ | Coursera specialization on vector DBs; depth on the embedding-retrieval side. |
| 126 | 6.7 | Agents and Multi-Agent Systems Development: Platforms, Toolkits, Technologies | Book | — | 2026 | 338 | 978-3032010810 | PDF, EPUB | 34 MB | 2026-01-16 | https://coderprog.com/multi-agent-systems-development-technologies/ | Multi-agent platforms/toolkits survey; mid-value. |
| 127 | 6.7 | AI Engineering: Retrieval Augmented Generation (RAG) for LLMs | Video course | — | 1920 | — | — | MP4 | 9.24 GB | 2026-03-10 | https://coderprog.com/ai-engineering-bootcamp-rag-ztm/ | Video: RAG engineering specifics; complements graph-retrieval work. |
| 128 | 6.7 | Building Generative AI for Enterprise: A practical guide to developing GenAI systems to solve business problems | Book | — | 2026 | 356 | 9789378541353 | EPUB | 10 MB | 2026-06-08 | https://coderprog.com/building-generative-ai-enterprise-developing/ | Enterprise GenAI build guide; light-mid. |
| 129 | 6.7 | Claude Code Automation – Automate Real Workflows with MCP and Skills: Connect GitHub, Drive Playwright Browser Automation, and Build Reusable Skills | Book | — | 2026 | 142 | B0H3KBQSNJ | PDF, EPUB | 10 MB | 2026-08-17 | https://coderprog.com/claude-code-automation-real-workflows-mcp/ | Skills + automation focus (GitHub, Playwright integrations); skills-design pattern source. |
| 130 | 6.7 | Claude Code for Real Engineers | Video course | — | 1920 | — | — | MP4 | 8.97 GB | 2026-05-19 | https://coderprog.com/claude-code-real-engineers-course/ | Video: engineer-grade CC practice; overlaps stronger CC picks. |
| 131 | 6.7 | Claude Code Mastery: Build, Automate, and Scale Production-Ready Systems with Claude AI | Book | — | 2026 | 114 | 9798255597727 | EPUB | 10 MB | 2026-04-19 | https://coderprog.com/claude-code-mastery-automate-scale-production-ready/ | CC production habits; overlaps stronger CC picks. |
| 132 | 6.7 | Code Revealed: A practical guide to AI agents, workflows, and modern application practices | Book | — | 2026 | 334 | 9781807789312 | PDF, EPUB | 45 MB | 2026-08-12 | https://coderprog.com/code-revealed-ai-agents-workflows-application/ | Modern app practices with agents; light-mid. |
| 133 | 6.7 | Data Science First: Using Language Models in AI-Enabled Applications | Book | — | 2026 | 368 | 1394390475 | PDF, EPUB | 11 MB | 2026-03-13 | https://coderprog.com/data-science-first-ai-enabled-applications/ | LM-in-applications patterns; light-mid. |
| 134 | 6.7 | Development of Multi-Agent System Infrastructures: A Practical Approach | Book | — | 2026 | 300 | 9780443404955 | PDF | 13 MB | 2026-06-24 | https://coderprog.com/development-multi-agent-system-infrastructures/ | Practical multi-agent-system infrastructure; mid-value. |
| 135 | 6.7 | Django 6 Cookbook, Second Edition: Build modern full-stack apps with Django 6, Python 3.12, APIs, authentication, testing, search, and deployment | Book | — | 2026 | 220 | 9789349174085 | EPUB | 10 MB | 2026-08-11 | https://coderprog.com/django-cookbook-authentication-deployment-2nd/ | Python web cookbook incl. testing chapters; Django itself is off-target but the Python/testing recipes transfer. |
| 136 | 6.7 | Generative Analysis: The Power of Generative AI for Object-Oriented Software Engineering with UML | Video course | — | — | — | — | MP4 | 11.40 GB | 2026-02-26 | https://coderprog.com/generative-analysis-software-engineering-course/ | GenAI applied to OO analysis/UML; tangential but touches code-comprehension themes of the paper track. |
| 137 | 6.7 | Generative and Agentic AI Reliability: Architectures, Challenges, and Trust for Autonomous Systems | Book | — | 2026 | 373 | 9783032185846 | PDF, EPUB | 32 MB | 2026-09-05 | https://coderprog.com/generative-agentic-ai-reliability-architectures/ | Reliability architectures for autonomous systems; robustness background. |
| 138 | 6.7 | Hands-On Machine Learning with Scikit-Learn and PyTorch: Concepts, Tools, and Techniques to Build Intelligent Systems | Book | — | 2026 | 875 | 979-8341607989 | PDF, EPUB | 96 MB | 2026-03-17 | https://coderprog.com/hands-machine-learning-scikit-learn-pytorch/ | Canonical hands-on ML text (2026 edition); ML foundations supporting post-training work. |
| 139 | 6.7 | Large Language Models: From Foundations to Production AI Applications | Book | — | 2026 | 428 | 9798181195363 | EPUB | 69 MB | 2026-07-19 | https://coderprog.com/llm-foundations-production-ai-applications/ | Foundations-to-production LLM lifecycle; context for training/serving decisions. |
| 140 | 6.7 | LLM Observability and Cost Management: Langfuse, Monitoring | Video course | — | 1920 | — | — | MP4 | 1.76 GB | 2026-01-28 | https://coderprog.com/llm-observability-cost-management-course/ | Video: observability + token economics; budget-awareness for the 12-hour cap. |
| 141 | 6.7 | Master Claude Code: Build Apps, Agents & Automations in 2026 | Video course | — | 1920 | — | — | MP4 | 8.38 GB | 2026-04-13 | https://coderprog.com/master-claude-code-automations-course/ | Video: current CC practice; overlaps stronger picks. |
| 142 | 6.7 | Mastering NLP with Hugging Face: Leveraging diffusion models, transformers, and reinforcement learning for generative and analytical systems | Book | — | 2026 | 274 | 9365893186 | EPUB | 10 MB | 2026-03-17 | https://coderprog.com/mastering-nlp-hugging-face-reinforcement/ | HF-centric NLP/transformer treatment incl. RL; toolchain alignment with fine-tuning work. |
| 143 | 6.7 | Natural Language Processing and Large Language Models: Theory, Hand-on Codes, and Case Studies | Book | — | 2026 | 408 | 9789819206810 | PDF, EPUB | 144 MB | 2026-07-31 | https://coderprog.com/nlp-llm-theory-hand-codes-studies/ | NLP+LLM theory with hands-on code; background depth. |
| 144 | 6.7 | OpenClaw AI in Production: Architecture, design patterns, and engineering practices for AI agent platforms | Book | — | 2026 | 364 | 9781807785017 | PDF, EPUB | 70 MB | 2026-07-03 | https://coderprog.com/openclaw-ai-production-architecture-engineering/ | Agent-platform production architecture; mid-value. |
| 145 | 6.7 | OpenClaw: Run Powerful & Autonomous AI Agents Securely | Video course | — | 1920 | — | — | MP4 | 4.65 GB | 2026-02-16 | https://coderprog.com/openclaw-autonomous-ai-agents-course/ | Video: autonomous agent orchestration with security focus; marginal pattern source. |
| 146 | 6.7 | Prompt Engineering Bootcamp (Working With AI & LLMs): Zero to Mastery | Video course | — | 1920 | — | — | MP4 | 8.19 GB | 2026-02-12 | https://coderprog.com/prompt-engineering-bootcamp-llms-ztm/ | Video bootcamp; baseline prompt skills. |
| 147 | 6.7 | Prompt Engineering in Practice: Design, test, and improve AI prompts | Book | — | 2026 | 248 | 9781633436305 | PDF | 26 MB | 2026-09-25 | https://coderprog.com/prompt-engineering-practice-improve-ai/ | Prompt test-and-improve loop; lightweight. |
| 148 | 6.7 | Python 3 Using DeepSeek | Book | — | 2026 | 262 | 9781041149514 | PDF, EPUB | 12 MB | 2026-05-02 | https://coderprog.com/python-3-using-deepseek/ | Python 3 with LLM assistance; weak-mid, Python-side only. |
| 149 | 6.7 | Python for Professional Developers | Video course | — | 1920 | — | — | MP4 | 2.46 GB | 2026-05-15 | https://coderprog.com/python-professional-developers-course/ | Video: professional Python practice; mid-value refresher. |
| 150 | 6.7 | Python Real-World Projects: Turn ideas into impactful applications through real-world Python development | Book | — | 2026 | 402 | 978-9365897685 | EPUB | 10 MB | 2026-02-06 | https://coderprog.com/python-real-world-projects-applications-development/ | Project-based Python engineering; light background. |
| 151 | 6.7 | Reinforcement Learning for LLM Alignment and Reasoning | Video course | — | — | — | — | MP4 | 6.33 GB | 2026-03-14 | https://coderprog.com/reinforcement-llm-alignment-reasoning/ | Video: RL aimed at LLM alignment/reasoning — closer to the actual post-training target than generic RL. |
| 152 | 6.7 | The Complete Prompt Engineering for AI Bootcamp (2026) | Video course | — | 1920 | — | — | MP4 | 16.94 GB | 2026-05-26 | https://coderprog.com/complete-prompt-engineering-ai-bootcamp/ | Video bootcamp (2026); baseline prompt skills. |
| 153 | 6.7 | Ultimate LLMOps with Langfuse: Instrument, Evaluate, and Operate Production-Grade LLM Applications with Langfuse | Book | — | 2026 | 347 | 9789349887541 | EPUB | 10 MB | 2026-05-13 | https://coderprog.com/ultimate-llmops-langfuse-production-applications/ | Langfuse-based tracing/eval; instrumentation concepts map to the BCF ledger (self-hosting cost caveats noted in the compendium). |
| 154 | 6.6 | 3 Day AI Coding Accelerator | Video course | — | 1920 | — | — | MP4 | 3.93 GB | 2026-01-20 | https://coderprog.com/ai-coding-accelerator-course/ | Short video accelerator; onboarding only. |
| 155 | 6.6 | AI Coding Crash Course: Build Production-Grade Software with AI | Video course | — | 1920 | — | — | MP4 | 3.15 GB | 2026-08-19 | https://coderprog.com/ai-coding-crash-course/ | Production-grade AI-assisted development; light-mid. |
| 156 | 6.6 | AI Coding for Real Engineers | Video course | — | 1920 | — | — | MP4 | 6.58 GB | 2026-06-14 | https://coderprog.com/ai-coding-real-engineers-course/ | Engineer-oriented AI coding practice; light-mid. |
| 157 | 6.6 | Everyone Is a Programmer: A battle-tested guide to building real apps with AI coding | Book | — | 2026 | 358 | 9781807305598 | PDF, EPUB | 201 MB | 2026-04-10 | https://coderprog.com/everyone-programmer-building-apps-ai-coding/ | Battle-tested AI-coding workflow; anecdotal but practical. |
| 158 | 6.6 | Grokking AI Algorithms, Second Edition | Book | — | 2026 | 592 | 1633434818 | PDF | 86 MB | 2026-03-27 | https://coderprog.com/grokking-ai-algorithms-2nd/ | Illustrated AI-algorithms survey; background only. |
| 159 | 6.6 | Guide to Using Generative AI in Programming | Book | — | 2026 | 197 | 978-3032074522 | PDF, EPUB | 42 MB | 2026-03-13 | https://coderprog.com/guide-using-generative-ai-programming/ | Programming-with-GenAI guide; light-mid. |
| 160 | 6.6 | Ontological Prisms: Knowledge Engineering for Enterprise & Agentic Systems | Book | — | 2026 | 352 | 9781394352623 | PDF | 11 MB | 2026-06-19 | https://coderprog.com/ontological-prisms-engineering-enterprise-agentic/ | Knowledge-engineering structures for agents; abstract but graph-adjacent. |
| 161 | 6.6 | Prompt Engineering for Everyone: A Self-Taught, Human-Centered Approach to AI Programming | Book | — | 2026 | 311 | 9798868823374 | PDF, EPUB | 10 MB | 2026-04-24 | https://coderprog.com/prompt-engineering-everyone-ai-programming/ | Accessible prompt-engineering text; baseline. |
| 162 | 6.6 | Ultimate Milvus Vector Database for AI Apps: Master Vector Search, Distributed Data Management, and GPU-Accelerated AI Systems with Milvus | Book | — | 2026 | 259 | 9789349887183 | EPUB | 10 MB | 2026-04-18 | https://coderprog.com/ultimate-milvus-vector-database-ai-apps/ | Milvus operations; vendor-specific, marginal — included for vector-search depth. |
| 163 | 6.5 | 50 ML Projects To Understand LLMs: Investigate transformer mechanisms through data analysis, visualization, and experimentation | Book | — | 2026 | 496 | 9781808082559 | PDF, EPUB | 265 MB | 2026-05-20 | https://coderprog.com/projects-understand-llms-visualization-experimentation/ | Experiment-driven transformer understanding; background depth. |
| 164 | 6.5 | AI Cost Playbook: FinOps for LLM systems, token economics, caching, routing, and cost governance | Book | — | 2026 | 180 | 9781808822155 | PDF, EPUB | 10 MB | 2026-09-23 | https://coderprog.com/ai-cost-playbook-economics-governance/ | Token economics and caching/routing; budget-management thinking for the 12h/token caps. |
| 165 | 6.5 | Build 10 AI Agents with Claude Code & Claude Cowork [2026] | Video course | — | 1920 | — | — | MP4 | 14.64 GB | 2026-05-26 | https://coderprog.com/build-ai-agents-claude-code-course/ | Video: many small agent builds; pattern variety. |
| 166 | 6.5 | Challenges and Applications of Generative Large Language Models | Book | — | 2026 | 270 | 978-0443335921 | PDF | 10 MB | 2026-01-25 | https://coderprog.com/challenges-applications-generative-llm/ | Academic-style GenAI survey; orientation-level. |
| 167 | 6.5 | Claude Code Crash Course: Build Real-World Apps with AI | Book | — | 2026 | 173 | 9798255800896 | EPUB | 18 MB | 2026-09-07 | https://coderprog.com/claude-code-crash-course-real-world-apps-ai/ | EPUB crash course; light-mid. |
| 168 | 6.5 | Knowledge Graph and Semantic Web Technology based XAI | Book | — | 2026 | 230 | 9781032626819 | PDF, EPUB | 32 MB | 2026-06-02 | https://coderprog.com/knowledge-graph-semantic-web-technology-xai/ | Knowledge-graph + XAI; marginal but graph-side background. |
| 169 | 6.5 | LLM and Generative AI: Navigating the generative age of LLMs, agentic AI, and compound systems | Book | — | 2026 | 284 | 9789365898682 | EPUB | 18 MB | 2026-04-12 | https://coderprog.com/llm-generative-ai-agentic-compound-systems/ | Compound-systems survey; orientation-level. |
| 170 | 6.5 | LLMs for Modern Software Delivery and DevOps: Applying Large Language Models to Software Delivery and SRE | Book | — | 2026 | 254 | 9781807609191 | PDF, EPUB | 64 MB | 2026-07-09 | https://coderprog.com/llms-modern-software-delivery-devops-applying/ | LLM-in-SDLC practices; moderate process value. |
| 171 | 6.5 | LLMs In 100 Images | Book | — | 2026 | 104 | — | PDF | 10 MB | 2026-05-16 | https://coderprog.com/llms-100-images/ | Visual LLM explainer; fast shared vocabulary for the team. |
| 172 | 6.5 | The Claude Code Bootcamp: Design, Build, Test and Deploy with Claude | Video course | — | 1920 | — | — | MP4 | 5.09 GB | 2026-09-25 | https://coderprog.com/claude-code-bootcamp-deploy-ztm/ | Video: full-cycle CC bootcamp; light-mid. |
| 173 | 6.5 | The Ultimate AI Guide for Linux Engineers: A practical guide to harnessing AI, LLMs, and Automation in Linux environments | Book | — | 2026 | 714 | 9781806664238 | PDF, EPUB | 36 MB | 2026-05-29 | https://coderprog.com/ultimate-linux-engineers-ai-llms-automation/ | AI+Linux automation; supports bash-heavy skill scripts. |
| 174 | 6.5 | Ultimate Generative AI Solutions on Google Cloud: Practical Strategies for Building and Scaling Generative AI Solutions with Google Cloud Tools, Langchain, RAG, and LLMOps | Book | — | 2025 | 334 | 978-9348107121 | PDF, EPUB | 30 MB | 2026-02-22 | https://coderprog.com/ultimate-generative-ai-solutions-google-cloud/ | Google-ecosystem GenAI tooling (Vertex, LangChain, LLMOps) — adjacent to the Google/Kaggle evaluation stack. |
| 175 | 6.5 | Vibe Coding Architecture at Scale: Scale AI-assisted coding with specs, guardrails, and system design discipline | Book | — | 2026 | 250 | 9781808654916 | PDF, EPUB | 166 MB | 2026-09-02 | https://coderprog.com/vibe-coding-architecture-scale-ai-assisted/ | Specs+guardrails scaling discipline; matches gate philosophy. |
| 176 | 6.4 | Claude Code – The Complete Guide | Video course | — | 1920 | — | — | MP4 | 13.34 GB | 2026-03-01 | https://coderprog.com/claude-code-complete-course/ | Video: general CC guide; onboarding only. |
| 177 | 6.4 | Claude Code for Beginners [2026] | Video course | — | — | — | — | MP4 | 6.94 GB | 2026-03-29 | https://coderprog.com/claude-code-beginners-course/ | Video: intro; onboarding only. |
| 178 | 6.4 | Claude Code from Scratch | Video course | — | 1920 | — | — | MP4 | 317 MB | 2026-03-04 | https://coderprog.com/claude-code-scratch-course/ | Video: CC fundamentals; onboarding only. |
| 179 | 6.4 | Claude Code: AI Crash Course for Developers | Video course | — | 1920 | — | — | MP4 | 5.13 GB | 2026-05-23 | https://coderprog.com/claude-code-ai-developers-crash-course/ | Video: CC crash course; onboarding only. |
| 180 | 6.4 | Claude Code: Building Faster with AI, from Prototype to Prod | Video course | — | 1920 | — | — | MP4 | 3.76 GB | 2026-02-07 | https://coderprog.com/anthropic-claude-code-ai-production-course/ | Video: prototype-to-prod CC; light-mid. |
| 181 | 6.4 | Comprehensive Data Structures and Algorithms in Python: Learn fundamentals with 500+ code samples and problems | Book | — | 2026 | 606 | 9789365893229 | EPUB | 10 MB | 2026-06-12 | https://coderprog.com/comprehensive-data-structures-algorithms-python/ | 500+ code-sample DSA; drill material. |
| 182 | 6.4 | Data-Oriented Python Programming and Debugging Specialization | Video course | — | — | — | — | MP4 | 6.92 GB | 2026-05-18 | https://coderprog.com/data-oriented-python-programming-debugging/ | Coursera: debugging + data-oriented Python; debugging fluency supports failure triage. |
| 183 | 6.4 | Generative AI: OpenAI API, Gemini, DeepSeek, and ChatGPT | Video course | — | 1920 | — | — | MP4 | 5.64 GB | 2026-02-12 | https://coderprog.com/genai-openai-chatgpt-course/ | Video: multi-provider API basics; light. |
| 184 | 6.4 | Getting Started: Claude Code | Video course | — | 1920 | — | — | MP4 | 2.15 GB | 2026-07-05 | https://coderprog.com/getting-started-claude-code-course/ | Video: intro CC; onboarding only. |
| 185 | 6.4 | Hands-On RAG for Production: Design, Develop, and Deploy Production-Ready RAG Applications | Book | — | 2026 | 350 | 9798341621718 | PDF, EPUB | 13 MB | 2026-06-10 | https://coderprog.com/hands-rag-production-design-develop-deploy/ | Production RAG; light-mid support. |
| 186 | 6.4 | Introduction to Python Programming and Data Structures, 3rd Edition | Book | — | 2024 | 1214 | B0CW1DQJH1 | PDF | 122 MB | 2026-06-14 | https://coderprog.com/introduction-python-programming-structures-3rd/ | CS1-level Python+DSA textbook; reference for fundamentals only. |
| 187 | 6.4 | Jailbreaking LLMs: Protecting the Future of Enterprise Security | Book | — | 2026 | 758 | 9798868829574 | PDF, EPUB | 25 MB | 2026-09-04 | https://coderprog.com/jailbreaking-llms-protecting-enterprise-security/ | LLM jailbreak taxonomy; minor input to adversarial-robustness evals. |
| 188 | 6.4 | Python Data Analysis: Master Python Analytics with Machine Learning, Deep Learning, GenAI, LLMs, and Data Engineering, 4th Edition | Book | — | 2026 | 766 | 9781806022878 | PDF, EPUB | 76 MB | 2026-07-08 | https://coderprog.com/python-data-analysis-master-engineering-4th/ | Broad Python analytics (4th ed.); data-side Python only marginally relevant. |
| 189 | 6.4 | Python Fundamentals: with GenAI, 2nd Edition | Video course | — | — | — | — | MP4 | 12.69 GB | 2026-05-05 | https://coderprog.com/python-fundamentals-genai-2nd-course/ | Video: Python fundamentals; onboarding only. |
| 190 | 6.4 | Python Practice Lab: Learn How to Code through Interactive Examples | Book | — | 2026 | 160 | 978-0691243603 | PDF, EPUB | 24 MB | 2026-02-06 | https://coderprog.com/python-practice-lab-interactive-examples/ | Exercise bank; potential source for synthetic practice tasks. |
| 191 | 6.4 | Python Programming: A Modular Approach, 2nd Edition | Book | — | 2026 | 1081 | — | EPUB | 23 MB | 2026-03-13 | https://coderprog.com/python-programming-modular-approach-2nd/ | Modular-design Python textbook; reference-level. |
| 192 | 6.4 | Python Programming: An Object-Oriented Approach | Book | — | 2026 | 1417 | 978-8197424991 | EPUB | 76 MB | 2026-01-12 | https://coderprog.com/python-programming-object-oriented-anita-goel/ | OOP Python textbook; reference-level. |
| 193 | 6.4 | Recursion: Mathematics and Python | Book | — | 2026 | 224 | 9781041149538 | PDF, EPUB | 21 MB | 2026-08-17 | https://coderprog.com/recursion-mathematics-python/ | Recursion mechanics in Python; narrow but relevant to AST/graph traversal reasoning. |
| 194 | 6.4 | Reinforcement Learning Explained: A Practical Problem-Solving Approach | Book | — | 2026 | 272 | 9781032996653 | PDF, EPUB | 54 MB | 2026-05-27 | https://coderprog.com/reinforcement-learning-explained-problem-solving/ | Practical RL; base theory. |
| 195 | 6.4 | Reinforcement Learning Foundations | Book | — | 2026 | 350 | 9781009711104 | PDF | 10 MB | 2026-08-07 | https://coderprog.com/reinforcement-learning-foundations-mannor/ | RL fundamentals; base theory. |
| 196 | 6.4 | Reinforcement Learning Research Bootcamp | Video course | — | 1920 | — | — | MP4 | 3.38 GB | 2026-09-03 | https://coderprog.com/reinforcement-learning-research-bootcamp/ | Video: RL research methods; background for GRPO-style post-training. |
| 197 | 6.4 | Reinforcement Learning: Foundations and Applications | Book | — | 2026 | 274 | 978-9815322323 | PDF, EPUB | 80 MB | 2026-01-05 | https://coderprog.com/reinforcement-learning-foundations-applications/ | General RL text; base theory beneath RLHF/DPO choices. |
| 198 | 6.4 | Retrieval Augmented Generation for Natural Language Processing | Book | — | 2026 | 480 | 9781394336098 | PDF | 30 MB | 2026-08-05 | https://coderprog.com/retrieval-augmented-generation-nlp/ | RAG-for-NLP text; light-mid. |
| 199 | 6.4 | The Modern Python 3 Bootcamp | Video course | — | 1920 | — | — | MP4 | 12.17 GB | 2026-01-24 | https://coderprog.com/modern-python-3-bootcamp/ | Video: Python fluency; onboarding only. |
| 200 | 6.4 | Vector Databases Fundamentals to Production [2026 Edition] | Video course | — | 1920 | — | — | MP4 | 6.88 GB | 2026-05-18 | https://coderprog.com/vector-databases-fundamentals-course/ | Video: vector DB lifecycle; light-mid. |
| 201 | 6.3 | Agentic AI Engineering Course | Video course | — | 1920 | — | — | MP4 | 2.29 GB | 2026-02-11 | https://coderprog.com/agentic-ai-engineering-course/ | Video: agentic engineering fundamentals; solid scaffold baseline. |
| 202 | 6.3 | AI Agent Security: App Security for Vibe-Coded Agents | Video course | — | 1920 | — | — | MP4 | 1.71 GB | 2026-05-19 | https://coderprog.com/ai-agent-security-app-vibe-coded-course/ | Security checklist for AI-built apps; minor input to robustness gates. |
| 203 | 6.3 | AI Agents & Workflows – The Practical Guide | Video course | — | 1920 | — | — | MP4 | 2.35 GB | 2026-01-18 | https://coderprog.com/ai-agents-workflows-practical-course/ | Video: practical agents/workflows; light-mid. |
| 204 | 6.3 | AI Agents 10 Day Bootcamp | Video course | — | — | — | — | MP4 | 3.12 GB | 2026-09-12 | https://coderprog.com/ai-agents-10-day-bootcamp/ | Video bootcamp; onboarding only. |
| 205 | 6.3 | AI Engineer Production Track: Deploy LLMs & Agents at Scale | Video course | — | 1920 | — | — | MP4 | 13.39 GB | 2026-03-04 | https://coderprog.com/ai-engineer-production-track-course/ | Video: deployment focus; marginal for the offline harness. |
| 206 | 6.3 | AI Systems Performance Engineering: Optimizing Model Training and Inference Workloads with GPUs, CUDA, and PyTorch | Book | — | 2026 | 1058 | 979-8341627789 | PDF, EPUB | 40 MB | 2026-03-20 | https://coderprog.com/ai-systems-performance-engineering-optimizing/ | GPU/CUDA/PyTorch performance engineering; training-job efficiency on L4s. |
| 207 | 6.3 | Become an Agentic Architect | Video course | — | 1920 | — | — | MP4 | 2.53 GB | 2026-05-25 | https://coderprog.com/become-agentic-architect-course/ | Video: agentic architecture; mid-value. |
| 208 | 6.3 | Build an AI Agent (From Scratch), Video Edition | Video course | — | 1920 | — | — | MP4 | 1.79 GB | 2026-09-10 | https://coderprog.com/build-ai-agent-scratch-video/ | Video edition of Manning's from-scratch agent book; light-mid. |
| 209 | 6.3 | Build an AI Agent (from Scratch): Coding Video | Video course | — | 1920 | — | — | MP4 | 813 MB | 2026-09-06 | https://coderprog.com/build-ai-agent-scratch-coding-video/ | Video: from-scratch agent build; light-mid. |
| 210 | 6.3 | Building and Training Generative AI Models: A Practical Guide to Generative AI Development and Scaling | Book | — | 2026 | 663 | 9798868823312 | PDF, EPUB | 12 MB | 2026-04-10 | https://coderprog.com/building-training-generative-ai-models/ | GenAI training practical; light-mid support for post-training work. |
| 211 | 6.3 | Chaos Engineering for AI Infrastructure: Fault injection and resilience testing for GPUs, model serving, RAG pipelines, and agentic systems on Kubernetes | Book | — | 2026 | 206 | 9789349174771 | EPUB | 10 MB | 2026-08-24 | https://coderprog.com/chaos-engineering-ai-infrastructure-resilience/ | Fault-injection for AI systems; robustness-testing inspiration for gate design. |
| 212 | 6.3 | Deep Learning with PyTorch: Training and applying deep learning and generative AI models, Second Edition | Book | — | 2026 | 600 | 978-1633438859 | PDF, EPUB | 71 MB | 2026-03-07 | https://coderprog.com/deep-learning-pytorch-generative-ai-2nd/ | PyTorch training reference (2nd ed.); supports adapter training work. |
| 213 | 6.3 | Foundations of Machine Learning and AI: Geometry, Probability and Optimization | Book | — | 2026 | 588 | 9783032303356 | PDF, EPUB | 52 MB | 2026-09-04 | https://coderprog.com/foundations-machine-learning-ai-optimization/ | ML math foundations; background only. |
| 214 | 6.3 | From Zero to Hero: Working with GitHub Copilot | Video course | — | 1920 | — | — | MP4 | 2.57 GB | 2026-08-29 | https://coderprog.com/zero-hero-working-github-copilot-course/ | Video: Copilot basics; onboarding only. |
| 215 | 6.3 | Generative AI on Kubernetes: Operationalizing Large Language Models | Book | — | 2026 | 392 | 1098171926 | PDF, EPUB | 15 MB | 2026-03-09 | https://coderprog.com/generative-ai-kubernetes-operationalizing-llm/ | LLM serving on k8s; the harness is fixed, but infra literacy helps local replication. |
| 216 | 6.3 | GitHub Copilot Beginner to Pro – AI for Coding & Development | Video course | — | 1920 | — | — | MP4 | 4.32 GB | 2026-05-04 | https://coderprog.com/github-copilot-write-code-video/ | Video: Copilot fluency; marginal pattern source. |
| 217 | 6.3 | Introduction to Generative AI: Reliable, responsible, and real-world applications, Second Edition | Book | — | 2025 | 480 | 978-1633434882 | PDF, EPUB | 46 MB | 2026-01-01 | https://coderprog.com/introduction-generative-ai-2nd/ | GenAI intro (2nd ed.); onboarding only. |
| 218 | 6.3 | Introduction to Machine Learning: From Math to Code | Book | — | 2025 | 578 | 9781316519509 | PDF | 23 MB | 2026-06-07 | https://coderprog.com/introduction-machine-learning-math-code/ | ML intro; onboarding only. |
| 219 | 6.3 | Kickstart Modern Data Structures and Algorithms: Foundational Principles of Data Structures and Algorithms in C++ and Python | Book | — | 2026 | 504 | 9789349887381 | EPUB | 10 MB | 2026-04-04 | https://coderprog.com/kickstart-modern-structures-algorithms-foundational/ | DSA in C++ and Python; Python-side only. |
| 220 | 6.3 | Linear Algebra with Applications in Machine Learning: From Intuitive Understanding to Python Coding | Book | — | 2026 | 445 | 9789819551668 | PDF, EPUB | 70 MB | 2026-06-26 | https://coderprog.com/linear-algebra-applications-ml-understanding/ | LA for ML; background only. |
| 221 | 6.3 | Machine Learning with Python: Neural Networks, Algorithms, Deep Learning | Book | — | 2026 | 358 | 9783119144704 | EPUB | 12 MB | 2026-08-30 | https://coderprog.com/machine-learning-python-neural-networks-algorithms/ | General ML-in-Python; background only. |
| 222 | 6.3 | Mathematical Foundations of Deep Learning: Theory and Algorithms | Book | — | 2026 | 268 | 9781032877082 | PDF | 10 MB | 2026-06-30 | https://coderprog.com/mathematical-foundations-dl-theory-algorithms/ | DL math foundations; background only. |
| 223 | 6.3 | Mathematics of Deep Learning: An Introduction to Foundational Mathematics of Neural Nets, 2nd Edition | Book | — | 2026 | 158 | 978-3119144117 | PDF, EPUB | 20 MB | 2026-02-20 | https://coderprog.com/mathematics-deep-learning-introduction-foundational-2nd/ | DL math (2nd ed.); background only. |
| 224 | 6.3 | Neural Networks with Python: Explore Transformers, ViTs, Diffusion, KANs, and SSMs using Python, NumPy and PyTorch, 2nd Edition | Book | — | 2026 | 168 | 9789349174498 | EPUB | 10 MB | 2026-08-06 | https://coderprog.com/neural-networks-python-transformers-diffusion-2nd/ | Modern architectures in Python/NumPy/PyTorch; background depth. |
| 225 | 6.3 | Operational AI with Docker: Deploy, Scale and Operate Agentic AI services with Docker and Kubernetes | Book | — | 2026 | 307 | 9781807301095 | PDF, EPUB | 171 MB | 2026-05-07 | https://coderprog.com/operational-ai-docker-deploy-agentic-services/ | Docker-based agent ops; useful for replicating the two-container sandbox locally. |
| 226 | 6.3 | Optimization: A Bootcamp for Machine Learning, Inverse Problems, and Control | Book | — | 2026 | 512 | 9781009755863 | PDF | 57 MB | 2026-08-01 | https://coderprog.com/optimization-bootcamp-ml-problems-control/ | Optimization methods behind training; background for RL tuning. |
| 227 | 6.3 | Parallel and High Performance Programming with Python: Transform Your Python Code into a High-Performance Powerhouse Using Multithreading, CUDA, PyTorch, Spark, and Dask, 2nd Edition | Book | — | 2026 | 472 | 978-9349887145 | EPUB | 165 MB | 2026-02-21 | https://coderprog.com/parallel-high-performance-programming-python-2nd/ | Parallel Python incl. CUDA; supports fast local data-generation scripts. |
| 228 | 6.3 | The AI Agent Engineer Course: Complete AI Аgent Bootcamp | Video course | — | 1920 | — | — | MP4 | 11.52 GB | 2026-03-24 | https://coderprog.com/ai-agent-engineer-complete-bootcamp/ | Video bootcamp; onboarding only. |
| 229 | 6.2 | AI Engineering Buildcamp: From RAG to Agents | Video course | — | 1920 | — | — | MP4 | 19.13 GB | 2026-06-13 | https://coderprog.com/ai-engineering-buildcamp-course/ | Video: RAG-to-agents progression; light-mid. |
| 230 | 6.2 | AI Engineering Fundamentals | Video course | — | 1920 | — | — | MP4 | 4.42 GB | 2026-05-07 | https://coderprog.com/ai-engineering-fundamentals-course/ | Video: fundamentals; onboarding only. |
| 231 | 6.2 | End-to-End AI Engineering Bootcamp | Video course | — | 1920 | — | — | MP4 | 14.28 GB | 2026-04-23 | https://coderprog.com/end-to-end-ai-engineering/ | Video bootcamp; onboarding only. |
| 232 | 6.2 | Getting Started With Local AI | Video course | — | 1920 | — | — | MP4 | 1.04 GB | 2026-08-20 | https://coderprog.com/getting-started-local-ai-course/ | Video: local AI basics; onboarding only. |
| 233 | 6.2 | Introduction to Machine Learning and AI Engineering | Video course | — | 1920 | — | — | MP4 | 8.46 GB | 2026-06-16 | https://coderprog.com/introduction-ml-ai-engineering-course/ | Video intro; onboarding only. |
| 234 | 6.2 | Learn by Doing. Become an AI Engineer. | Video course | — | 1920 | — | — | MP4 | 5.38 GB | 2026-02-23 | https://coderprog.com/learn-doing-become-ai-engineer/ | Video: AI-engineer practice; onboarding only. |
| 235 | 6.2 | Local AI Revolution: Ollama and OpenClaw | Video course | — | 1920 | — | — | MP4 | 581 MB | 2026-07-08 | https://coderprog.com/local-ai-revolution-ollama-openclaw-ztm/ | Video: local agents; light. |
| 236 | 6.2 | Machine Learning in Production | Video course | — | 1920 | — | — | MP4 | 3.39 GB | 2026-03-19 | https://coderprog.com/machine-learning-production-course/ | Video: ML production practices; marginal for offline harness. |

---

*Scores are relative usefulness estimates for this specific competition, not general quality ratings. Justifications reference the competition's actual mechanics: LoRA/PEFT adapter production for the fixed QAT base, the nine-tool harness loop, AST call/dependency graphs with 256-dim node embeddings, pytest fail-to-pass/pass-to-pass validation, and the 12-hour multi-task budget.*


---

<!-- ====================================================================== -->
<!-- FILE: 07-0dayprizrak-catalog-assessment.md -->
<!-- ====================================================================== -->

# 0dayprizrak Catalog Assessment — BCF Coding Agent Usefulness

**Date:** 2026-09-30 · **Catalog:** `0dayprizrak_catalog.json` (50,848 items, sources: prizrak.ws + 0daydown.com) · **Scope:** Google – The Gemma 4 Developer Agent Competition (post-train `gemma-4-31b-it-qat-w4a16-ct` into an autonomous SWE agent; ADK `agent.yaml` + LoRA adapters + skills; scored on patched-repo pytest pass rates across a 12-hour budget on 4×L4 GPUs).

## Method

1. **Normalize** all 50,848 items into flat records. Metadata is messy (large fractions missing category/year; language and genre fields contaminated), so screening relied primarily on title + synopsis.
2. **Deduplicate**: title variants of the same work (e.g., repeated Udemy uploads, EPUB/PDF/MP4 editions) were collapsed — 3,930 duplicate groups merged.
3. **Screen** with a rule-based scorer across seven competition-need dimensions → 3,151 candidate items.
4. **Manually review** the ranked candidate list plus targeted tail scans (Python/testing/RL/agent/graph patterns) of the remainder.
5. **Curate** every item judged useful, with a 0–10 ranking score and per-item justification (table below).

## Ranking rubric

| Band | Meaning |
|:---|:---|
| 9.0–10 | Must-use: maps directly onto a submission-critical artifact |
| 7.5–8.9 | High value: strong methodological or domain leverage |
| 6.0–7.4 | Useful: solid background or supporting practice |
| 5.5–5.9 | Marginal: include only as low-priority filler |
| < 5.5 | Not included |

**Need tags**: **PT**=post-training the Gemma-4 agent; **AG**=agent architecture & prompting; **CI**=code intelligence (graphs/embeddings); **PY**=Python SWE domain knowledge; **EV**=evaluation & testing; **IN**=infra/serving/tooling; **ML**=ML foundations.

## Headline findings

1. **MCP + ADK Crash Course Develop Next-Gen AI Agents for the Real World** — 8.8
2. **Reinforcement Learning from Human Feedback, Video Edition** — 8.4
3. **Develop Real-World AI Agents in GCP – Gemini, ADK, MCP, A2A** — 8.3
4. **LLM Engineering Prompting, RAG, Fine-Tuning, and RLHF** — 8.3
5. **Building Agents with the Google Agent Developer Kit  LinkedIn** — 8.2

This catalog's standout asset is its **breadth of hands-on Python SWE material** (pytest, asyncio, FastAPI, pydantic, packaging, concurrency) that the coderprog catalog lacks, plus several agent-harness engineering videos. Its LLM theory shelf is thinner and heavily Udemy-survey-shaped; the top of the table is dominated by ADK/MCP-adjacent and RLHF/fine-tuning items.

## Exclusions (major categories judged not useful)

n8n/no-code automation; Azure/AWS/Bedrock/AgentCore/Databricks/Salesforce/SAP/Pega vendor platforms; Java/Spring/.NET/C#/Go/Rust/C++/PHP LLM tracks; certification and exam-prep material; Playwright/Selenium/browser-E2E testing; beginner no-code courses; prompt-injection-adjacent **offense** material without defensive framing; business/leadership/productivity titles; healthcare/finance/biology domain ML; and all non-English items (Russian-language uploads, etc.). Items matching "Gemma" only via an author's name (romance novels) were excluded.

## The table

| # | Score | Title | Type | Author(s) | Year | ISBN | Format | Size | Language | Posted | Source URL | Why |
|---:|---:|:---|:---|:---|---:|:---|:---|:---|:---|:---|:---|:---|
| 1 | 8.8 | MCP + ADK Crash Course Develop Next-Gen AI Agents for the Real World | Book | — | — | N/A | EPUB | 0.35 MB | — | 2026-01-04 | https://prizrak.ws/viewtopic.php?id=2088216 | MCP plus Google's ADK — the exact agent.yaml/sub_agents config format the competition submission zip requires. |
| 2 | 8.4 | Reinforcement Learning from Human Feedback, Video Edition | Video course | — | 2026 | — | MP4 | 2.2 GB | English + subtitle | 2026-08-20 | https://prizrak.ws/viewtopic.php?id=2250441 | Video edition of the definitive RLHF text: DPO/preference post-training, the method behind the LoRA adapter production. |
| 3 | 8.3 | Develop Real-World AI Agents in GCP – Gemini, ADK, MCP, A2A | — | — | — | — | — | 5.1 GB | English | 2026-07-27 | https://www.0daydown.com/07/3530321.html | Gemini+ADK+MCP+A2A on GCP — the closest vendor-aligned stack to the Google/Kaggle harness and grading environment. |
| 4 | 8.3 | LLM Engineering Prompting, RAG, Fine-Tuning, and RLHF | Video course | — | 2026 | — | MP4 | 6.3 GB | English | 2026-08-30 | https://prizrak.ws/viewtopic.php?id=2255771 | Covers all four submission levers in one text (prompting, RAG, fine-tuning, RLHF); the broadest single reference. |
| 5 | 8.2 | Building Agents with the Google Agent Developer Kit \| LinkedIn | — | — | — | — | — | 342 MB | English | 2026-02-10 | https://prizrak.ws/viewtopic.php?id=2124344 | ADK-specific agent construction — matches the required ADK runtime, multi-agent YAML, and tool declarations. |
| 6 | 7.9 | Advanced Fine-Tuning with RLHF Teaching AI to Align with Human Inte... | Book | — | — | N/A | EPUB | 6.23 MB | — | 2026-01-04 | https://prizrak.ws/viewtopic.php?id=2085778 | RLHF fine-tuning depth (reward modeling, preference optimization) for adapter training beyond vanilla SFT. |
| 7 | 7.9 | Code with Antonio - Build Your Own Claude Code (Update 5.2026) | Video course | — | — | — | MP4 | 11.3 GB | English | 2026-05-22 | https://prizrak.ws/viewtopic.php?id=2198539 | Implementing a coding agent from scratch (tool loop, permissions, edits) mirrors exactly what swegemma does to our agent. |
| 8 | 7.9 | Context Engineering for Multi-Agent Systems (EPUB) | Book | — | — | 1806690055 | EPUB | 27.14 MB | — | 2026-01-25 | https://prizrak.ws/viewtopic.php?id=2107209 | Context assembly across sub-agents — direct defense against the harness's automatic context-window compaction. |
| 9 | 7.8 | Claude Agent SDK: Build Production AI Agents in Python | — | — | — | — | — | 3 GB | English | 2026-06-09 | https://www.0daydown.com/06/3465834.html | Production agent SDK patterns in Python: loop control, tool contracts, sub-agent orchestration. |
| 10 | 7.8 | Finetuning and Customizing LLMs | Video course | — | — | — | MP4 | 230 MB | — | 2026-04-23 | https://prizrak.ws/viewtopic.php?id=2178211 | Practical fine-tuning workflows (PEFT/LoRA) for specializing the fixed gemma-4-31b base. |
| 11 | 7.7 | Agentic Automation — A Pytest Framework with Claude Code | — | — | — | — | — | 3.3 GB | English | 2026-09-29 | https://www.0daydown.com/09/3640403.html | Agentic automation built on pytest — aligns with the harness's pytest fail-to-pass/pass-to-pass validation gates. |
| 12 | 7.7 | Domain Specific Small Language Models (MEAP V08) | Book | — | — | 9781633436701 | PDF | 37.01 MB | — | 2026-01-25 | https://prizrak.ws/viewtopic.php?id=2107730 | Specializing small models for one domain is precisely the winning strategy space around the fixed 31B QAT base. |
| 13 | 7.7 | Training & Fine-Tuning Custom LLMs From Pretrained Models to Domain... | Book | — | — | N/A | EPUB | 7.06 MB | — | 2026-01-04 | https://prizrak.ws/viewtopic.php?id=2090342 | End-to-end custom LLM fine-tuning; dataset curation and adapter training practices. |
| 14 | 7.6 | CPython A Complete Guide to CPython's Architecture and Performance | Book | — | — | 9798868817687 | PDF | 9.97 MB | — | 2026-01-25 | https://prizrak.ws/viewtopic.php?id=2106889 | CPython internals and performance; deep background for reasoning about Python 3.13 sandbox behavior and stdlib quirks. |
| 15 | 7.6 | Knowledge Graphs for AI Agents Practical Architectures, Workflows, ... | Book | — | — | N/A | EPUB | 1.82 MB | — | 2026-01-04 | https://prizrak.ws/viewtopic.php?id=2088024 | Graph-backed agent memory/navigation — the design pattern behind exploiting the provided AST call/dependency graphs. |
| 16 | 7.6 | LLM Quantization and Compression Theoretical Core | Video course | — | 2026 | — | MP4 | 3.1 GB | English | 2026-06-29 | https://prizrak.ws/viewtopic.php?id=2239190 | Theory of quantization/compression — what QAT w4a16 did to the base model and how much LoRA headroom remains. |
| 17 | 7.5 | Advanced Quantization Techniques for Large Language Models | Video course | — | — | — | MP4 | 130 MB | English + subtitle | 2026-01-17 | https://prizrak.ws/viewtopic.php?id=2100986 | Quantization techniques (W4A16-class) for fitting the 31B model into the 96 GB 4xL4 serving budget. |
| 18 | 7.5 | Learn Model Context Protocol with Python Build agentic systems in P... | Book | — | — | 1806103230 | EPUB+PDF | 4.45 MB | — | 2026-01-25 | https://prizrak.ws/viewtopic.php?id=2109414 | Hands-on MCP in Python; tool-envelope and client/server patterns applicable to harness tool design. |
| 19 | 7.5 | Pytest Complete Guide｜Python Unit Testing with 50 Exercises | — | — | — | — | — | 2.3 GB | English | 2026-07-27 | https://www.0daydown.com/07/3532714.html | Pytest drill book; sharpens the exact skill the validator scores: writing/fixing targeted pytest tests. |
| 20 | 7.4 | AI Agents in Production Harness Engineering Masterclass | Video course | — | 2026 | — | MP4 | 1.5 GB | English + subtitle | 2026-09-06 | https://prizrak.ws/viewtopic.php?id=2259858 | Production harness engineering for AI agents — the loop/budget/verifier contract is what the submission must satisfy. |
| 21 | 7.4 | Claude Code 101 by Anthropic | Video course | — | — | — | MP4 | 113 MB | English + subtitle | 2026-08-20 | https://prizrak.ws/viewtopic.php?id=2249877 | Anthropic's own intro to agentic coding workflows; canonical loop/tool-discipline patterns. |
| 22 | 7.4 | Edge AI with SLMs Fine-Tuning & Local Deployment | Video course | — | 2026 | — | MP4 | 1.28 GB | English | 2026-02-22 | https://prizrak.ws/viewtopic.php?id=2133650 | Small-model serving under tight memory budgets — same constraints as 4xL4 multi-LoRA serving. |
| 23 | 7.4 | Effective Python 125 Specific Ways to Write Better Python, 3rd Edition | Book | — | — | 0138172188 | PDF | 10.88 MB | — | 2026-05-23 | https://prizrak.ws/viewtopic.php?id=2199632 | 125 concrete Pythonic practices (3rd ed.); the target repos are idiomatic modern Python — patch-convention gold. |
| 24 | 7.4 | Generative AI with Python The Developer's Guide to Pretrained LLMs,... | Book | — | — | 1493226908 | MOBI | 12 MB | — | 2026-01-25 | https://prizrak.ws/viewtopic.php?id=2108420 | Developer's guide to pretrained LLMs — inference, adaptation, and deployment of pretrained models. |
| 25 | 7.4 | Knowledge Graphs and LLMs in Action (Final Release) | Book | — | — | 1633439895 | MOBI+EPUB+PDF | 27.09 MB | — | 2026-01-02 | https://prizrak.ws/viewtopic.php?id=2083738 | KG+LLM integration in practice (final release of the Manning title); retrieval reasoning over graph structures like the competition's node/edge data. |
| 26 | 7.4 | Modern Python Testing with pytest | — | — | — | — | — | 514.2 MB | English | 2026-06-11 | https://www.0daydown.com/06/3483764.html | Current pytest practice (fixtures, parametrization, plugins); feeds Phase-4 validation skill resources. |
| 27 | 7.3 | Agentic Harness Engineering: Harness Design for AI Engineers | — | — | — | — | — | 2.4 GB | English | 2026-07-11 | https://www.0daydown.com/07/3499372.html | Harness engineering for agentic systems; directly models the swegemma loop the agent lives in. |
| 28 | 7.3 | AI Evals Test LLM Apps, RAG and Agents Like an Engineer | Video course | — | 2026 | — | MP4 | 3.8 GB | English | 2026-08-21 | https://prizrak.ws/viewtopic.php?id=2250828 | Building evals to test LLM applications; methodology for the local dev loop on 129 public tasks. |
| 29 | 7.3 | Applied Deep Learning on Graphs | Book | — | — | 9781835885970 | PDF | 19 MB | — | 2026-06-21 | https://prizrak.ws/viewtopic.php?id=2227362 | Applied graph DL; grounds similarity search over the 256-dim node embeddings. |
| 30 | 7.3 | Building Small Language Models from Scratch | Book | — | — | N/A | EPUB | 0.43 MB | — | 2026-06-21 | https://prizrak.ws/viewtopic.php?id=2227786 | SLM construction from scratch; data curation and training economics for a fixed small base. |
| 31 | 7.3 | Context Engineering with DSPy (Early Release) | Book | — | — | 0642572261603 | EPUB | 1.64 MB | — | 2026-01-25 | https://prizrak.ws/viewtopic.php?id=2107210 | Programmatic prompt optimization (DSPy); systematic prompt-tuning instead of hand-tweaking phase prompts. |
| 32 | 7.3 | Test-Driven Development with Python Obey the Testing Goat Using Dja... | Book | — | — | 1098148711 | PDF | 13.59 MB | — | 2026-01-26 | https://prizrak.ws/viewtopic.php?id=2111708 | The Testing Goat classic: TDD with Django/pytest; disciplined reproducer-first patching. |
| 33 | 7.2 | Automate Dev with Self-Testing AI Agents \| Frontend Masters | — | — | — | — | — | 1.5 GB | English | 2026-04-22 | https://prizrak.ws/viewtopic.php?id=2177555 | Self-testing agent loops; pattern source for Phase-4 binary 'done' verification behavior. |
| 34 | 7.2 | Build an AI Agent From Scratch in Python (No LangChain) | — | — | — | — | — | 805.8 MB | English | 2026-07-11 | https://www.0daydown.com/06/3492214.html | Framework-free agent construction in Python — cleanest mental model of the tool loop. |
| 35 | 7.2 | Claude Code in Action | Video course | — | — | — | MP4 | 89 MB | English + subtitle | 2026-09-06 | https://prizrak.ws/viewtopic.php?id=2259884 | Anthropic's video course on coding-agent workflows; subagents/plan-mode patterns to copy into skills. |
| 36 | 7.2 | From Zero to Async A Complete Guide to AsyncIO in Python | Video course | — | — | — | MP4 | 812 MB | English + subtitle | 2026-02-07 | https://prizrak.ws/viewtopic.php?id=2122345 | asyncio from the ground up; fastapi/httpx task patches are async-heavy. |
| 37 | 7.2 | Hands-On APIs for AI and Data Science Python Development with FastAPI | Book | — | — | 1098164415 | MOBI+PDF | 7.66 MB | — | 2026-06-23 | https://prizrak.ws/viewtopic.php?id=2230644 | FastAPI-centric API construction and testing; fastapi is the largest target repo in tasks.jsonl. |
| 38 | 7.2 | Model Context Protocols for LLMs Architecting Prompting, Memory, a... | Book | — | — | N/A | EPUB | 0.71 MB | — | 2026-01-04 | https://prizrak.ws/viewtopic.php?id=2088500 | MCP book: protocol-level tool design; discipline for structuring the nine fixed harness tools. |
| 39 | 7.2 | Testing LLMs With DeepEval, Promptfoo, RAG & CI/CD | Video course | — | 2026 | — | MP4 | 2 GB | English | 2026-09-09 | https://prizrak.ws/viewtopic.php?id=2261670 | Testing LLMs with DeepEval/Promptfoo — concrete eval-framework experience for regression tracking. |
| 40 | 7.2 | The LLM Engineer's Toolkit | Book | — | — | N/A | EPUB | 0.36 MB | — | 2026-01-04 | https://prizrak.ws/viewtopic.php?id=2089940 | Tooling survey for LLM engineering; fast orientation to the fine-tuning/serving toolchain. |
| 41 | 7.1 | Agentic Design Patterns A Hands-On Guide to Building Intelligent Sy... | Book | — | — | 3032014018 | EPUB | 14 MB | — | 2026-01-04 | https://prizrak.ws/viewtopic.php?id=2085836 | Hands-on agent design-pattern catalog (planning, tool use, reflection); vocabulary for BCF phases. |
| 42 | 7.1 | AI Agent Masterclass OpenAI Agents, LangGraph, MCP, A2A | Video course | — | 2026 | — | MP4 | 2.83 GB | English | 2026-04-14 | https://prizrak.ws/viewtopic.php?id=2170553 | OpenAI Agents + LangGraph + MCP + A2A masterclass; broad multi-protocol agent training. |
| 43 | 7.1 | First Look: Google Gemma 4 | Video course | — | — | — | MP4 | 78.9 MB | English + subtitle | 2026-04-21 | https://prizrak.ws/viewtopic.php?id=2176647 | Gemma-4-specific architecture/serving first look — the exact model family being post-trained. |
| 44 | 7.1 | Loop Engineering for Agentic AI | Video course | — | 2026 | — | MP4 | 9.8 GB | English | 2026-09-04 | https://prizrak.ws/viewtopic.php?id=2258690 | Loop design (termination, budgets, retries) — the core control problem of the 12-hour task budget. |
| 45 | 7.0 | AI Agent Engineering Loops, Graphs & Production Safety | Video course | — | 2026 | — | MP4 | 4 GB | English | 2026-08-23 | https://prizrak.ws/viewtopic.php?id=2251865 | Loops, graphs, and production safety for agent engineering; robustness checklist. |
| 46 | 7.0 | AI Agents From Scratch Tools, Memory, MCP and Multi-Agent | Video course | — | 2026 | — | MP4 | 3 GB | English + subtitle | 2026-08-20 | https://prizrak.ws/viewtopic.php?id=2250411 | Tools, memory, and MCP from scratch; compact agent-internals curriculum. |
| 47 | 7.0 | AI Coding Agents From Vibe Coding to Agentic Engineering | Video course | — | 2026 | — | MP4 | 6.3 GB | English | 2026-08-21 | https://prizrak.ws/viewtopic.php?id=2251058 | The vibe-coding-to-engineering progression; frames what 'competition-grade' agent behavior means. |
| 48 | 7.0 | Asynchronous & Concurrent Python Unlocking High-Performance Apps | Book | — | — | N/A | PDF | 0.86 MB | — | 2026-01-04 | https://prizrak.ws/viewtopic.php?id=2085984 | Asynchronous & concurrent Python patterns; concurrency correctness for async target repos. |
| 49 | 7.0 | Building AI Coding Assistant from scratch \| Udemy | — | — | — | — | — | 2.93 GB | English | 2026-05-07 | https://prizrak.ws/viewtopic.php?id=2186140 | Building a coding assistant from scratch — the same product we are entering. |
| 50 | 7.0 | Knowledge Graph Engineering with Python | Video course | — | — | — | MP4 | 3.99 GB | English + subtitle | 2026-09-09 | https://prizrak.ws/viewtopic.php?id=2261777 | Building KGs with Python; the graphs/ directory is a NetworkX multigraph — construction literacy helps exploit it. |
| 51 | 7.0 | LangGraph for Multi-Step Reasoning Build Advanced AI Reasoning Pipe... | Book | — | — | — | EPUB | 404.37 KB | — | 2026-01-25 | https://prizrak.ws/viewtopic.php?id=2109366 | Graph-structured multi-step agent control flow; same paradigm as the BCF phase DAG with back-edges. |
| 52 | 7.0 | Learning Pydantic: Advanced Data Validation In Python | Video course | — | — | — | MP4 | 3.83 GB | English + subtitle | 2026-02-07 | https://www.0daydown.com/02/3293247.html | Pydantic mastery — fastapi's foundation; model-definition patches are common failure sites. |
| 53 | 7.0 | Multi-Agent Reinforcement Learning Foundations and Modern Approaches | Book | — | — | 0262049376 | PDF | 8 MB | — | 2026-01-14 | https://prizrak.ws/viewtopic.php?id=2097118 | Multi-agent RL foundations; background for RL-based post-training choices. |
| 54 | 7.0 | OpenAI Agents SDK Build Multi-Agent AI Systems in Python | Video course | — | 2026 | — | MP4 | 5.4 GB | English | 2026-08-17 | https://prizrak.ws/viewtopic.php?id=2248169 | OpenAI Agents SDK multi-agent Python; handoff/guardrail patterns transfer to sub_agents. |
| 55 | 7.0 | Patterns for Building AI Agents | Book | — | — | — | PDF | 3 MB | — | 2026-05-23 | https://prizrak.ws/viewtopic.php?id=2200616 | Agent-building pattern catalog; steady reference for scaffold decisions. |
| 56 | 6.9 | Building Generative AI Services with FastAPI A Practical Approach t... | Book | — | — | 1098160304 | MOBI | 7 MB | — | 2026-01-14 | https://prizrak.ws/viewtopic.php?id=2095716 | GenAI services on FastAPI; fuses the two central domains: LLM serving + the top target repo. |
| 57 | 6.9 | DEEP LEARNING WITH PYTHON | Book | — | — | B0FJZ5NDFB | EPUB | 1.51 MB | — | 2026-01-25 | https://prizrak.ws/viewtopic.php?id=2107339 | Chollet 3rd ed.; canonical DL foundations with Keras/PyTorch. |
| 58 | 6.9 | Hands-on Large Language Models from Scratch | Book | — | — | — | PDF | 164 MB | — | 2026-05-26 | https://prizrak.ws/viewtopic.php?id=2204450 | Hands-on LLM construction; mid-depth foundations beneath adapter work. |
| 59 | 6.9 | Hands-On MCP Build an MCP Server in Python from Scratch | Video course | — | 2026 | — | MP4 | 672 MB | English + subtitle | 2026-01-26 | https://prizrak.ws/viewtopic.php?id=2113893 | MCP server development in Python; tool-contract discipline for skill scripts. |
| 60 | 6.9 | Mastering Python Concurrency Free-threading and Sub-interpreters | Video course | — | — | — | MP4 | 322.8 MB | English + subtitle | 2026-08-26 | https://prizrak.ws/viewtopic.php?id=2253766 | Concurrency + free-threading (3.13 GIL-less world); the sandbox runs Python 3.13. |
| 61 | 6.9 | Practical Reinforcement Learning for ML Engineers | Video course | — | 2026 | — | MP4 | 5.45 GB | Arabic | 2026-04-02 | https://prizrak.ws/viewtopic.php?id=2163496 | RL for working ML engineers (2026 video); applied bridge from theory to post-training practice. |
| 62 | 6.9 | Scaling LLM Agents Distributed Cognition & Multi-Agent Ecosystems A... | Book | — | — | — | EPUB | 2.08 MB | — | 2026-01-26 | https://prizrak.ws/viewtopic.php?id=2111134 | Distributed-cognition framing for scaled agent systems; conceptual support for sub-agent design. |
| 63 | 6.9 | Software Design in Python (MEAP V05) | Book | — | — | 9781633439498 | MOBI | 5.41 MB | — | 2026-01-26 | https://prizrak.ws/viewtopic.php?id=2111368 | Design-in-Python (MEAP); structural reasoning for localization in unfamiliar repos. |
| 64 | 6.8 | Agentic Knowledge Graphs | Video course | — | — | — | MP4 | 233 MB | English + subtitle | 2026-04-23 | https://prizrak.ws/viewtopic.php?id=2178133 | Agentic traversal of knowledge graphs; maps to graph-tool-driven localization. |
| 65 | 6.8 | CLEAN CODE IN PYTHON STRATEGIES FOR CONCISE AND READABLE PROGRAMS | Book | — | — | N/A | EPUB | 0.29 MB | — | 2026-06-21 | https://prizrak.ws/viewtopic.php?id=2227853 | Refactoring and clean-code practice in Python; minimal-patch quality bar. |
| 66 | 6.8 | Gemini CLI Crash Course Automate Coding with Agentic AI | Video course | — | 2026 | — | MP4 | 881 MB | English | 2026-02-22 | https://prizrak.ws/viewtopic.php?id=2133668 | Google's agentic CLI — sibling of the competition terminal agent; workflow familiarity. |
| 67 | 6.8 | Git in the AI Agent Era | Video course | — | — | — | MP4 | 498.2 MB | English + subtitle | 2026-08-19 | https://prizrak.ws/viewtopic.php?id=2249601 | Git workflows designed around AI agents; submit_patch emits `git diff HEAD` — fluency is load-bearing. |
| 68 | 6.8 | IndyDevDan - Tactical Agentic Coding - Agentic Engineer + Principle... | — | — | — | — | — | — | — | 2026-05-27 | https://prizrak.ws/viewtopic.php?id=2206735 | Practitioner agentic-coding techniques; loop habits from a prolific AI-coding educator. |
| 69 | 6.8 | Modern AI Agents Building Practical Single- and Multi-Agent Systems... | Video course | — | — | 9780135882634 | MP4 | 15.7 GB | — | 2026-02-06 | https://prizrak.ws/viewtopic.php?id=2121120 | Current agent architectures and practice; orientation-level. |
| 70 | 6.8 | PyTorch for LLMs: Build GPT from Scratch | — | — | — | — | — | 520.5 MB | English | 2026-07-20 | https://www.0daydown.com/07/3528058.html | Building GPT-class models in PyTorch; training-loop literacy for adapter experiments. |
| 71 | 6.8 | The Complete LangChain, LangGraph, & LangSmith Course (2026) | Video course | — | 2026 | — | MP4 | 26 GB | English | 2026-02-26 | https://prizrak.ws/viewtopic.php?id=2137705 | LangChain+LangGraph+LangSmith combined course; observability/tracing ideas for the ledger. |
| 72 | 6.8 | The PYTHON CONCURRENCY GUIDE | Book | — | — | — | PDF | 109 MB | — | 2026-05-26 | https://prizrak.ws/viewtopic.php?id=2205602 | Concurrency guide; threading/async correctness in patch code. |
| 73 | 6.8 | Transformers and LLMs in Action (MEAP V09) | Book | — | — | 9781633437883 | MOBI | 4.62 MB | — | 2026-06-23 | https://prizrak.ws/viewtopic.php?id=2235065 | MEAP: transformers/LLMs in action; foundations supporting post-training decisions. |
| 74 | 6.8 | Vector Databases & RAG: Build Semantic Search with LLMs | Video course | — | 2026 | — | MP4 | 721 MB | English (US) | 2026-08-31 | https://prizrak.ws/viewtopic.php?id=2256619 | Vector DB + RAG semantic search; how ANN retrieval behind search_similar_code behaves. |
| 75 | 6.7 | Agent-Driven Software Engineering | Book | — | — | N/A | EPUB | 2.27 MB | — | 2026-06-21 | https://prizrak.ws/viewtopic.php?id=2227213 | Software engineering driven by agents; process-level patterns for BCF phases. |
| 76 | 6.7 | AI Coding Agents 100 Labs to Production Mastery | Video course | — | 2026 | — | MP4 | 1.1 GB | English | 2026-09-04 | https://prizrak.ws/viewtopic.php?id=2258539 | 100-lab coding-agent course; high repetition across agent builds. |
| 77 | 6.7 | FastAPI with Python Build REST API Using Clean Architecture | Video course | — | 2026 | — | MP4 | 5.2 GB | English | 2026-03-24 | https://prizrak.ws/viewtopic.php?id=2157070 | Clean architecture applied to FastAPI; structural priors for the largest target repo. |
| 78 | 6.7 | Hands-On Codex Agentic Coding Workflows | Video course | — | — | — | MP4 | 86.26 MB | English + subtitle | 2026-08-26 | https://prizrak.ws/viewtopic.php?id=2253755 | Terminal-agent (Codex) workflow practice; second data point on coding-agent loops. |
| 79 | 6.7 | Hands-On Software Engineering with Python Move beyond basic program... | Book | — | — | — | EPUB | 7.12 MB | — | 2026-01-25 | https://prizrak.ws/viewtopic.php?id=2108671 | SWE-with-Python (2nd ed.): design→maintain→deploy; broad localization background. |
| 80 | 6.7 | LangGraph- Develop LLM powered AI agents with LangGraph \| Udemy | — | — | — | — | — | — | English | 2026-03-10 | https://prizrak.ws/viewtopic.php?id=2146437 | LangGraph agent development; graph-based control flow for phase machines. |
| 81 | 6.7 | Production LLM Evaluation and Observability | Video course | — | 2026 | — | MP4 | 4.3 GB | English | 2026-08-26 | https://prizrak.ws/viewtopic.php?id=2253774 | Evaluating LLM systems in production; grounds offline validation strategy. |
| 82 | 6.6 | API Testing with Python 3 & PyTest, Backend Automation 2026 \| Udemy | Video course | — | — | — | MP4 | — | English | 2026-06-03 | https://prizrak.ws/viewtopic.php?id=2212256 | API testing with Python 3 & pytest; httpx/fastapi test suites are API-level. |
| 83 | 6.6 | Building Autonomous AI Agents with LangGraph A Developer's Guide | Book | — | — | N/A | EPUB | 0.53 MB | — | 2026-06-21 | https://prizrak.ws/viewtopic.php?id=2227776 | Autonomous agent construction on LangGraph; mid-value scaffold patterns. |
| 84 | 6.6 | Complete MCP Developer Guide: Agents, Servers & Tools \| Udemy | — | — | — | — | — | — | English | 2026-03-02 | https://prizrak.ws/viewtopic.php?id=2140275 | MCP developer guide; protocol fluency. |
| 85 | 6.6 | Graph Theory Connectivity, Software Engineering and Bioinformatics ... | Book | — | — | 3119143723 | PDF | 20.28 MB | — | 2026-05-23 | https://prizrak.ws/viewtopic.php?id=2199919 | Graph theory with SWE framing; heuristic grounding for graph localization. |
| 86 | 6.6 | How to Test and Evaluate AI Agents - an introduction \| Udemy | — | — | — | — | — | 2.8 GB | English | 2026-02-02 | https://prizrak.ws/viewtopic.php?id=2118043 | Agent-specific test/eval methods; complements pytest-based validation gates. |
| 87 | 6.6 | LangGraph Mastery Build Stateful & Agentic AI Workflows | Video course | — | 2026 | — | MP4 | 3.1 GB | English | 2026-01-10 | https://prizrak.ws/viewtopic.php?id=2093483 | LangGraph state machine depth; phase-machine patterns. |
| 88 | 6.6 | Master Python's Type System Write Safer, Smarter Code | Video course | — | — | — | MP4 | 572 MB | English + subtitle | 2026-01-26 | https://prizrak.ws/viewtopic.php?id=2114274 | Typing mastery; type-annotated codebases dominate the target repos. |
| 89 | 6.6 | Mastering Vector Databases & Embedding Models in 2025 \| Udemy | Video course | — | — | — | MP4 | — | English | 2026-06-14 | https://prizrak.ws/viewtopic.php?id=2222086 | Vector DBs + embedding models; embedding-space intuition for similarity tools. |
| 90 | 6.6 | Natural Language to Code | Book | — | — | N/A | EPUB | 1.05 MB | — | 2026-06-23 | https://prizrak.ws/viewtopic.php?id=2232253 | NL→code generation; the core transformation the agent performs. |
| 91 | 6.6 | Pluralsight Knowledge Graph Algorithms and Reasoning 2026 | Video course | — | — | — | MP4 | 246.84 MB | English | 2026-04-22 | https://prizrak.ws/viewtopic.php?id=2177300 | Graph-algorithms course; traversal fluency for call/dependency graphs. |
| 92 | 6.6 | Reinforcement Learning Research Bootcamp | Video course | — | — | — | MP4 | 3.4 GB | English | 2026-09-07 | https://prizrak.ws/viewtopic.php?id=2260476 | RL research methods bootcamp; background for GRPO/PPO-style post-training. |
| 93 | 6.6 | Run Local LLMs with Ollama: From No-Code to Python Code \| Udemy | — | — | — | — | — | 3.1 GB | English | 2025-12-31 | https://prizrak.ws/viewtopic.php?id=2081879 | Ollama-based local serving; quick local experiments with Gemma-family checkpoints. |
| 94 | 6.6 | The New SDLC Agentic Engineering for Software Teams | Video course | — | 2026 | — | MP4 | 7 GB | English | 2026-09-04 | https://prizrak.ws/viewtopic.php?id=2258772 | SDLC redesigned around agentic engineering; process view. |
| 95 | 6.5 | Advanced Langgraph Techniques | Video course | — | — | — | MP4 | 91 MB | English + subtitle | 2026-03-23 | https://prizrak.ws/viewtopic.php?id=2156030 | Advanced LangGraph; mid-value. |
| 96 | 6.5 | Creating TUI Applications with Textual and Python | Book | — | — | B0FGDNC3H6 | MOBI | 11 MB | — | 2026-01-25 | https://prizrak.ws/viewtopic.php?id=2107262 | Textual TUI framework; rich is a target repo and Textual shares its rendering world. |
| 97 | 6.5 | Deep Reinforcement Learning Hands-On, 3rd Edition | Book | — | — | 1835882706 | PDF | 127.81 MB | — | 2026-01-02 | https://prizrak.ws/viewtopic.php?id=2083406 | RL hands-on classic; base theory beneath RLHF. |
| 98 | 6.5 | Git Internals & Architecture Build Git with Python | Video course | — | 2026 | — | MP4 | 3.91 GB | English | 2026-01-20 | https://prizrak.ws/viewtopic.php?id=2103236 | Git internals by building Git in Python; diff/commit mechanics behind submit_patch. |
| 99 | 6.5 | LLM Token Optimization: Optimize Cost, Speed, & Performance | — | — | — | — | — | 1.6 GB | English | 2026-07-27 | https://www.0daydown.com/07/3534645.html | Token-economy optimization; directly relevant to the 12h budget and compaction. |
| 100 | 6.5 | Mastering GraphRAG From Theory to Production with Neo4j | Book | — | — | N/A | EPUB | 5.64 MB | — | 2026-06-23 | https://prizrak.ws/viewtopic.php?id=2231893 | GraphRAG from theory to production with Neo4j; graph-retrieval patterns transfer to repo graphs. |
| 101 | 6.5 | Mastering LLM App Evaluation RAGAS, LangSmith, and AWS | Video course | — | 2026 | — | MP4 | 1.64 GB | English | 2026-02-18 | https://prizrak.ws/viewtopic.php?id=2130653 | RAGAS-based LLM-app evaluation; metric design for agent evals. |
| 102 | 6.5 | MCP Mastery Build AI Apps with Claude, LangChain and Ollama (Update... | Video course | — | — | — | MP4 | 6.12 GB | English | 2026-01-25 | https://prizrak.ws/viewtopic.php?id=2105483 | MCP with Claude/LangChain/Ollama; cross-stack MCP patterns. |
| 103 | 6.5 | Natural Language Processing - Transformers with Hugging Face | Video course | — | — | — | MP4 | 908 MB | English | 2026-04-29 | https://prizrak.ws/viewtopic.php?id=2181504 | HF transformers practice; the adapter toolchain is HF/PEFT. |
| 104 | 6.5 | Vector Databases with Python ChromaDB Pinecone RAG | Video course | — | — | — | MP4 | 3.59 GB | English | 2026-08-10 | https://prizrak.ws/viewtopic.php?id=2245011 | ChromaDB/Pinecone practical vector search; retrieval-side support. |
| 105 | 6.4 | AI-Assisted & Generative Software Engineering | Book | — | — | N/A | EPUB | 1.03 MB | — | 2026-06-21 | https://prizrak.ws/viewtopic.php?id=2227051 | AI-assisted & generative software engineering; academic-flavored process view. |
| 106 | 6.4 | Building a RAG application in Python \| Udemy | — | — | — | — | — | — | English | 2026-06-19 | https://prizrak.ws/viewtopic.php?id=2225746 | RAG application construction in Python; end-to-end retrieval literacy. |
| 107 | 6.4 | Building Production-Grade LLMs | Book | — | — | 9798232416942 | EPUB | 619.88 KB | — | 2026-01-25 | https://prizrak.ws/viewtopic.php?id=2106810 | Production-grade LLM construction; deployment realism. |
| 108 | 6.4 | Building REST APIs with FastAPI using Python \| Hands-On | Video course | — | — | — | MP4 | 1.34 GB | English (US) | 2026-08-26 | https://prizrak.ws/viewtopic.php?id=2253497 | REST API construction on FastAPI; repo-specific fluency. |
| 109 | 6.4 | Graph Databases: Neo4j, RDF, Knowledge Graphs & GraphRAG | Video course | — | 2025 | — | MP4 | 5.52 GB | English | 2026-03-02 | https://prizrak.ws/viewtopic.php?id=2140060 | Graph databases + Neo4j/RDF; background for graph data modeling. |
| 110 | 6.4 | Introduction To Qdrant (Vector Database) Using Python | Video course | — | 2024 | — | MP4 | 708.49 MB | English | 2026-02-20 | https://prizrak.ws/viewtopic.php?id=2132698 | Qdrant vector search with Python; retrieval support. |
| 111 | 6.4 | LangFuse LLM Observability, Tracing, Evaluation, Monitoring | Video course | — | 2026 | — | MP4 | 4.5 GB | English | 2026-06-24 | https://prizrak.ws/viewtopic.php?id=2236429 | Langfuse-based agent observability; ledger/tracing design ideas. |
| 112 | 6.4 | Prompt Ops The Prompt Engineering Lifecycle | Book | — | — | N/A | EPUB | 1.59 MB | — | 2026-06-23 | https://prizrak.ws/viewtopic.php?id=2232870 | Prompt operations lifecycle; systematic prompt maintenance. |
| 113 | 6.4 | The Math of Large Language Models Transformer Architectures | Video course | — | 2026 | — | MP4 | 2.6 GB | English | 2026-06-28 | https://prizrak.ws/viewtopic.php?id=2238599 | Transformer-architecture math; background for training decisions. |
| 114 | 6.4 | Zero to Hero with FastAPI A Hands-On Guide to Full Stack Python and... | Book | — | — | N/A | EPUB | 0.47 MB | — | 2026-01-04 | https://prizrak.ws/viewtopic.php?id=2090623 | FastAPI course; repo-specific fluency. |
| 115 | 6.3 | Coding with AI Examples in Python (Final Release) | Book | — | — | 1633437272 | MOBI+EPUB+PDF | 50.54 MB | — | 2026-01-02 | https://prizrak.ws/viewtopic.php?id=2083312 | Worked AI-coding examples in Python; light practice. |
| 116 | 6.3 | FastAPI Modern Python Backend and API Development | Video course | — | — | — | MP4 | 4.92 GB | English | 2026-02-25 | https://prizrak.ws/viewtopic.php?id=2136521 | Modern backend patterns on FastAPI; repo fluency. |
| 117 | 6.3 | GitHub Copilot CLI - Agentic AI Coding From The Terminal | Video course | — | 2026 | — | MP4 | 652 MB | en-GB | 2026-03-24 | https://prizrak.ws/viewtopic.php?id=2157086 | Terminal-based Copilot CLI; marginal loop familiarity. |
| 118 | 6.3 | Introducing Python Modern Computing in Simple Packages, 3rd Edition... | Book | — | — | 1098174402 | PDF+EPUB | 10.76 MB | — | 2026-01-25 | https://prizrak.ws/viewtopic.php?id=2109058 | Lubanovic's Introducing Python (3rd ed.); onboarding reference. |
| 119 | 6.3 | LLM Observability and Cost Management Langfuse, Monitoring | Video course | — | 2026 | — | MP4 | 1.77 GB | English | 2026-01-22 | https://prizrak.ws/viewtopic.php?id=2104202 | Observability + cost management; budget-aware operations. |
| 120 | 6.3 | OWASP Top 10 for LLMs Complete Hands-On Labs | Video course | — | 2026 | — | MP4 | 2 GB | English | 2026-06-28 | https://prizrak.ws/viewtopic.php?id=2238587 | OWASP Top 10 for LLMs with hands-on labs; checklist + practice for robustness gates. |
| 121 | 6.3 | Production-Ready LLMs | Book | — | — | N/A | EPUB | 0.50 MB | — | 2026-01-04 | https://prizrak.ws/viewtopic.php?id=2089012 | Production-readiness for LLMs; checklist value. |
| 122 | 6.3 | Prompt Engineering for Developers: The Definitive Guide \| Udemy | — | — | — | — | — | 10.13 GB | English | 2026-02-22 | https://prizrak.ws/viewtopic.php?id=2133543 | Definitive developer prompt-engineering guide; baseline. |
| 123 | 6.3 | Python Debugging & Testing Workbook | Book | — | — | — | PDF | 148 MB | — | 2026-05-26 | https://prizrak.ws/viewtopic.php?id=2205088 | Debugging & testing workbook; failure-triage practice. |
| 124 | 6.3 | Run AI Locally with Gemma and Ollama: Build Your First App | Video course | — | — | — | MP4 | 145 MB | — | 2026-08-03 | https://prizrak.ws/viewtopic.php?id=2240895 | Run AI locally with Gemma + Ollama; model-family familiarity. |
| 125 | 6.3 | Secure Agentic AI Stop Prompt Injection | Video course | — | 2026 | — | MP4 | 1.2 GB | English | 2026-09-09 | https://prizrak.ws/viewtopic.php?id=2261827 | Prompt-injection defense for agentic AI; input-hygiene patterns for problem statements. |
| 126 | 6.3 | Threat Modeling For Agentic Ai Attacks, Risks, Controls | Video course | — | 2025 | — | MP4 | 4.98 GB | English | 2026-01-10 | https://prizrak.ws/viewtopic.php?id=2093553 | Threat modeling for agentic AI; structured robustness analysis. |
| 127 | 6.2 | AI Observability Monitoring and Debugging LLMs in Production | Video course | — | — | — | MP4 | 297 MB | English + subtitle | 2026-08-27 | https://prizrak.ws/viewtopic.php?id=2254281 | AI observability for debugging LLMs; failure-analysis patterns. |
| 128 | 6.2 | Algorithms of Autonomous AI Agents | Book | — | — | — | PDF | 168 MB | — | 2026-05-26 | https://prizrak.ws/viewtopic.php?id=2203722 | Algorithms behind autonomous AI agents; background. |
| 129 | 6.2 | Automated Reasoning Logic, AI Agents and LLMs | Video course | — | 2026 | — | MP4 | 2.2 GB | English | 2026-08-30 | https://prizrak.ws/viewtopic.php?id=2255755 | Logic-based automated reasoning; marginal — planning rigor analogies. |
| 130 | 6.2 | Complete Prompt Engineering Bootcamp 2025 (Using LLM APIs) \| Udemy | — | — | — | — | — | 3.9 GB | English | 2026-02-09 | https://prizrak.ws/viewtopic.php?id=2123921 | Video bootcamp; baseline prompt skills. |
| 131 | 6.2 | Defending Agentic AI Securing MCP & Pipelines Mastery | Video course | — | 2026 | — | MP4 | 1.2 GB | English | 2026-09-09 | https://prizrak.ws/viewtopic.php?id=2261737 | MCP-framed agentic defense; tool-output hardening. |
| 132 | 6.2 | Developing LLMs | Book | — | — | N/A | EPUB | 0.28 MB | — | 2026-06-21 | https://prizrak.ws/viewtopic.php?id=2228565 | Building/developing LLMs; background depth. |
| 133 | 6.2 | Evaluating Large Language Models (LLMs) | Video course | — | — | 9780135451922 | MP4 | 2.2 GB | — | 2026-05-20 | https://prizrak.ws/viewtopic.php?id=2195889 | LLM evaluation fundamentals; baseline eval literacy. |
| 134 | 6.2 | Generative Software Engineering (EPUB) | Book | — | — | N/A | EPUB | 2.62 MB | — | 2026-06-23 | https://prizrak.ws/viewtopic.php?id=2230371 | Generative SWE processes; background. |
| 135 | 6.2 | Local LLM Mastery | Book | — | — | — | PDF | 245 MB | — | 2026-05-26 | https://prizrak.ws/viewtopic.php?id=2204713 | Local LLM operations; offline experiment support. |
| 136 | 6.2 | Local LLMs via Ollama & LM Studio - The Practical Guide \| Udemy | — | — | — | — | — | 2 GB | English | 2026-03-22 | https://prizrak.ws/viewtopic.php?id=2155577 | Local LLM serving via Ollama/LM Studio; offline experiment support. |
| 137 | 6.2 | Mastering Databases with Python SQL, NoSQL, Vector DBs | Video course | — | 2026 | — | MP4 | 6.7 GB | Arabic | 2026-08-25 | https://prizrak.ws/viewtopic.php?id=2252983 | Databases with Python; marginal — some target tests touch persistence layers. |
| 138 | 6.2 | NLP to LLMs: Build The Understanding That Lasts | Video course | — | 2026 | — | MP4 | 859 MB | English (US) | 2026-09-01 | https://prizrak.ws/viewtopic.php?id=2256940 | NLP→LLM progression; onboarding background. |
| 139 | 6.2 | Parallel and High Performance Programming with Python | Book | — | — | 9388590732 | MOBI | 4.64 MB | — | 2026-06-23 | https://prizrak.ws/viewtopic.php?id=2232575 | High-performance Python; fast local data-generation scripts. |
| 140 | 6.2 | Prompt Engineering in Python, with GPT, and The OpenAI API | Video course | — | — | — | MP4 | 787.05 MB | English | 2026-03-03 | https://prizrak.ws/viewtopic.php?id=2141344 | Prompt engineering with GPT in Python; applied prompting. |
| 141 | 6.2 | Prompt Injection & LLM Defense (2026) \| Udemy | Video course | — | — | — | MP4 | 427 MB | English | 2026-03-27 | https://prizrak.ws/viewtopic.php?id=2159191 | Prompt-injection attack/defense; input hygiene. |
| 142 | 6.2 | Python Algorithms 2026 Masterclass From Basics to Advanced | Video course | — | 2026 | — | MP4 | 4.1 GB | English (US) | 2026-08-23 | https://prizrak.ws/viewtopic.php?id=2251723 | 2026 algorithms masterclass; drill material. |
| 143 | 6.2 | Python Microservices with FastAPI (Early Access) | Book | — | — | 9781835461167 | EPUB | 10 MB | — | 2026-05-23 | https://prizrak.ws/viewtopic.php?id=2200750 | Microservice patterns on FastAPI; mid-value repo fluency. |
| 144 | 6.2 | Reinforcement Learning Foundations and Applications | Book | — | — | 981532232X | PDF | 76.9 MB | — | 2026-01-02 | https://prizrak.ws/viewtopic.php?id=2084070 | RL foundations & applications; base theory. |
| 145 | 6.2 | Transformers Using Python for Natural Language Processing | Book | — | — | — | PDF | 165 MB | — | 2026-05-26 | https://prizrak.ws/viewtopic.php?id=2205719 | Transformers with Python NLP; background. |
| 146 | 6.1 | Deep Reinforcement Learning using python | Video course | — | — | — | MP4 | 5.68 GB | English + subtitle | 2026-05-18 | https://prizrak.ws/viewtopic.php?id=2194099 | Deep RL in Python; base theory. |
| 147 | 6.1 | Introduction to Transformer Models for NLP, 2nd Edition | Video course | — | — | — | MP4 | 19.5 GB | English + subtitle | 2026-08-20 | https://prizrak.ws/viewtopic.php?id=2250430 | Transformer model intro (2nd ed.); background. |
| 148 | 6.1 | Securing GenAI Systems From Prompts to Autonomous Agents | Video course | — | 2026 | — | MP4 | 9.44 GB | English | 2026-04-07 | https://prizrak.ws/viewtopic.php?id=2166613 | GenAI system security; robustness background. |
| 149 | 6.1 | Software Engineer with Generative AI | Book | — | — | N/A | EPUB | 2.99 MB | — | 2026-06-23 | https://prizrak.ws/viewtopic.php?id=2233574 | Role-focused GenAI SWE guide; background. |
| 150 | 6.1 | The Practical Guide to Large Language Models (PDF EPUB) | Book | — | — | — | PDF+EPUB | 21 MB | — | 2026-01-04 | https://prizrak.ws/viewtopic.php?id=2090081 | Practical LLM guide with hands-on applications; orientation. |
| 151 | 6.0 | A deep understanding of AI large language model mechanisms \| Udemy | — | — | — | — | — | — | English | 2026-05-26 | https://prizrak.ws/viewtopic.php?id=2206041 | LLM mechanism deep-dive; background. |
| 152 | 6.0 | Agentic AI Security Tool Interfaces and Least Privilege | Video course | — | — | — | MP4 | 158.8 MB | English + subtitle | 2026-09-07 | https://prizrak.ws/viewtopic.php?id=2260382 | Agentic security via least privilege; permission-scoping for sub-agents. |
| 153 | 6.0 | College-Level Reinforcement Learning : A Comprehensive Dive! | Video course | — | 2026 | — | MP4 | 38.3 GB | English | 2026-03-07 | https://prizrak.ws/viewtopic.php?id=2144103 | College-level RL course; base theory. |
| 154 | 6.0 | Data Structures and Algorithms: In-Depth DSA using Python \| Udemy | Video course | — | — | — | MP4 | — | English | 2026-06-23 | https://prizrak.ws/viewtopic.php?id=2234594 | DSA in Python; drill background. |
| 155 | 6.0 | Decoding Large Language Models An exhaustive guide to understanding | Book | — | — | 1835084656 | EPUB | 5.67 MB | — | 2026-01-25 | https://prizrak.ws/viewtopic.php?id=2107539 | LLM internals explainer; background. |
| 156 | 6.0 | Generative AI with Python and PyTorch Navigating the AI frontier wi... | Book | — | — | — | EPUB | 35.00 MB | — | 2026-06-23 | https://prizrak.ws/viewtopic.php?id=2230364 | GenAI with PyTorch; background. |
| 157 | 6.0 | Large Language Models (MIT Press Essential Knowledge) | Book | — | — | 0262552698 | EPUB | 1.34 MB | — | 2026-01-25 | https://prizrak.ws/viewtopic.php?id=2109371 | MIT Press LLM text; foundations reference. |
| 158 | 6.0 | Mastering Python Regex A Comprehensive Guide | Book | — | — | — | PDF | 15 MB | — | 2026-01-25 | https://prizrak.ws/viewtopic.php?id=2109806 | Regex mastery; grep/sed-heavy localization support. |
| 159 | 6.0 | MCP Development: Build AI Integrations with Vibe Coding | — | — | — | — | — | 2.73 GB | English | 2026-03-09 | https://www.0daydown.com/03/3334370.html | MCP development with AI assistance; light. |
| 160 | 6.0 | Non-Deterministic Software Engineering How to Build Reliable Softwa... | Book | — | — | — | EPUB | 7.86 MB | — | 2026-01-25 | https://prizrak.ws/viewtopic.php?id=2110205 | SWE for non-deterministic systems; frames LLM-era verification. |
| 161 | 6.0 | OpenTelemetry: Observability with Python | Video course | — | — | — | MP4 | 199 MB | — | 2026-03-07 | https://prizrak.ws/viewtopic.php?id=2144435 | OpenTelemetry with Python; tracing standards for the ledger. |
| 162 | 6.0 | Practical AI with Python and Reinforcement Learning \| Udemy | — | — | — | — | — | 11 GB | English | 2026-03-26 | https://prizrak.ws/viewtopic.php?id=2158251 | Practical AI incl. RL; background. |
| 163 | 6.0 | Python Write Your Own Deep Learning Framework From Scratch | Video course | — | 2026 | — | MP4 | 3.91 GB | English | 2026-01-14 | https://prizrak.ws/viewtopic.php?id=2099044 | DL framework from scratch in Python; deep background. |
| 164 | 6.0 | The Quick Python Book, Fourth Edition | Book | — | — | 1633436330 | AZW3 | 4 MB | — | 2026-01-14 | https://prizrak.ws/viewtopic.php?id=2098410 | 4th-ed Python quick reference; onboarding. |
| 165 | 5.9 | Build Your Own Regex Engine from Scratch in Python | Video course | — | 2026 | — | MP4 | 4.4 GB | English | 2026-02-02 | https://prizrak.ws/viewtopic.php?id=2117862 | Building a regex engine; marginal — text-processing depth. |
| 166 | 5.9 | Master Dynamic Programming Using Python | Video course | — | 2026 | — | MP4 | 1.8 GB | English | 2026-08-29 | https://prizrak.ws/viewtopic.php?id=2255525 | DP mastery in Python; marginal drill material. |
| 167 | 5.8 | Hands On AI (LLM) Red Teaming \| Udemy | — | — | — | — | — | 8.03 GB | English | 2026-02-17 | https://prizrak.ws/viewtopic.php?id=2130049 | LLM red-teaming; marginal — adversarial testing ideas. |
| 168 | 5.8 | The Last Algorithms Course You'll Need | Video course | — | — | — | MP4 | 1.58 GB | — | 2026-03-03 | https://prizrak.ws/viewtopic.php?id=2141351 | DSA fundamentals course; marginal background. |
| 169 | 5.6 | Exploratory Data Analysis with Python | Video course | — | — | — | MP4 | 607.8 MB | English + subtitle | 2026-08-24 | https://www.0daydown.com/08/3581614.html | EDA practice; marginal for SWE tasks. |
| 170 | 5.6 | Machine Learning Algorithms in Depth | Book | — | — | 1633439216 | EPUB | 21.12 MB | — | 2026-01-02 | https://prizrak.ws/viewtopic.php?id=2083782 | ML algorithms depth; marginal background. |

---

*Scores are relative usefulness estimates for this specific competition. Metadata reproduced from the catalog as-is; "—" marks fields absent from the source record. Where multiple format variants of one title exist in the catalog, formats are merged and the most complete record is shown.*


---

<!-- ====================================================================== -->
<!-- FILE: 08-foss-tools-assessment-for-bcf-agent.md -->
<!-- ====================================================================== -->

# FOSS-Tools Assessment: Usefulness for the BCF Coding Agent (Gemma 4 Developer Agent Competition)

Date: 2026-09-30. Scope: the `foss_tools/` collection (githubdigest.json with 4,095 repos + 33 curated grokmuse digests), assessed against the BCF Coding Agent plan and the swegemma competition harness constraints.

## 1. Executive summary

**Yes - the collection is directly useful.** 82 resources clear the usefulness bar (score >= 6.0); they cluster into a coherent, near-complete pipeline for the submission:

1. **Train (34 resources):** the collection contains a complete, sourced LoRA/RL post-training stack for Gemma on 4xL4 - SWE-smith task/env/trajectory data, Unsloth recipe (r=64/alpha=64/lr 2e-4), TRL+PEFT, and verl-class RL as the stretch goal. This is the single highest-value lane.
2. **Test (13):** SWE-bench harness + contamination-resistant complements (Pro, Live, rebench-V2), eval-plus-style stronger gates, and containerized eval runners (harbor, terminal-bench, agent-infra/sandbox) to replicate the two-container offline eval.
3. **Agent improvement (19):** Agent Skills corpora and standards (anthropics/skills, superpowers), spec-driven gate patterns (spec-kit), and - the standout find - microsoft/SkillOpt, which trains natural-language skills from trajectories with validation-gated updates: an automated BCF skill-improvement loop that needs no weight changes.
4. **Context/code-intelligence (12):** code knowledge-graph servers (codebase-memory-mcp), local semantic search (grepai), and token-budget compressors (ripwire, headroom, token-savior) that map onto the get_code_* tool semantics and the 32,768-token budget.
5. **Infra (4):** dev-time gateways and orchestration scaffolding (LiteLLM, orca, ECC, deepseek-harness).

The raw `githubdigest.json` is broad but shallow (snapshot metadata, early-September); the grokmuse digests carry GitHub-API-verified metadata as of 2026-09-29/30 and contain all the crown jewels. 16 shortlisted entries were re-verified live via the GitHub REST API today: 16/16 live, all active, zero failures.

## 2. Method and provenance

- **Inventory:** all 4,095 repos in `foss_tools/githubdigest.json` were scored in-browser (9-cluster regex weighting over id/description/topics/keywords/videoTitle); ranked rows 1-330 reviewed individually; all 33 grokmuse digest files read in full or header-scanned (earlier batches are seen-store-deduped repeats of the same five lanes).
- **External verification:** 16 shortlisted entries checked against the GitHub REST API (unauthenticated, 16 of 60 hourly calls) on 2026-09-30. Log in `scratch/foss-tools-assessment-2026-09-30/assessment-scratch.md`.
- **Deviation note:** this environment has no shell, so the `research-toolkit` scripts (ensure-browser.sh, search.mjs, fetch.mjs) could not be executed. Per the v4 engine ladder the work went through the local browser directly: file:// reads, GitHub REST API, browser-based engines as fallback. **No MCP-server quota was consumed; built-in WebSearch/WebFetch were not used; research spend: $0.00.**
- **Star/provenance markers** (see column Stars): **V** = verified via GitHub API 2026-09-30 (this session); **D** = digest value, API-verified by the digest author 2026-09-29/30; **J** = githubdigest.json snapshot (~2026-09-02/15), may lag by 3-14%.
- **Collection-source abbreviations:** J = githubdigest.json; L = grokmuse Deep-Research-LoRA-Finetune-Python-Coding-Agents (2026-09-30); F = grokmuse LoRA-Leftover-Followup (2026-09-30); R = grokmuse Unsloth-SWE-smith-Finetune-Recipe (2026-09-30); B = grokmuse bidness2-collection-report (2026-09-29); G = grokmuse deep-research (2026-09-29); H = grokmuse github-repos.md; C = bcf/BCF-Reference-Compendium.md (B6 benchmark table).

## 3. Ranking rubric

Scored 0.0-10.0 against the three competition workstreams: **Train** (post-train gemma-4-31b-it-qat-w4a16-ct via LoRA on 4xL4/96GB from 129 tasks), **Agent** (improve the declarative swegemma submission: agent.yaml, prompts, sub_agents, skills, adapters; 9 fixed tools; 32,768-token context), **Test** (offline two-container PASS/FAIL eval, 12h budget). Bands: 9.0-10.0 mission-critical (pipeline depends on it); 7.5-8.9 high (core adopt/evaluate); 6.0-7.4 medium-high (clear secondary use, pattern source); below 6.0 excluded. Adjustments: +0.5 permissive license; -1.0 archived/unmaintained; penalties for off-model (DeepSeek/Qwen-specific), online-service-dependent, or heavy-infrastructure fits.

## 4. Ranked resource table (sorted by score, descending)

| # | Score | Resource | Lane | Stars | Lang | License | Activity | Src | Justification |
|---:|---:|---|---|---:|---|---|---|---|---|
| 1 | 9.7 | [SWE-smith](https://github.com/SWE-bench/SWE-smith) | Train | 791 D | Python | MIT | 2026-09 (D) | L+R | Task generator yielding ~52k realistic SWE tasks, 250+ prebuilt Docker envs, ~26k agent trajectories. The direct engine for synthesizing competition-style training tasks and SFT data. |
| 2 | 9.6 | [SWE-smith HF datasets (tasks / trajectories / envs)](https://huggingface.co/datasets/SWE-bench/SWE-smith-trajectories) | Train | n/a | JSONL | per-dataset | 2026-09 (D) | R | The concrete artifacts referenced by the recipe: SWE-bench/SWE-smith tasks, SWE-smith-trajectories (~26k, 5,017 used), SWE-smith-envs images. Ready message-format JSONL for Gemma SFT. |
| 3 | 9.5 | [unslothai/unsloth](https://github.com/unslothai/unsloth) | Train | 77.0k D | Python | see repo (AGPL components) | 2026-09 (D) | L+R | 2-5x faster LoRA on constrained VRAM. The collection contains a complete sourced recipe (r=64, alpha=64, lr 2e-4, seq 10240) targeting this stack on L4/H100-class GPUs. Training-time use only. |
| 4 | 9.3 | [SWE-bench](https://github.com/princeton-nlp/SWE-bench) | Test | 5.9k D | Python | MIT | 2026-09 (D) | L | Canonical harness and FAIL_TO_PASS/PASS_TO_PASS scoring the competition replicates. Reference for the local self-eval loop; note published contamination findings on older splits. |
| 5 | 9.2 | [huggingface/trl](https://github.com/huggingface/trl) | Train | 19.4k D | Python | Apache-2.0 | 2026-09 (D) | L | SFTTrainer with LoRA/QLoRA plus GRPO/DPO in one maintained API. Default trainer for producing the adapter .safetensors; pairs directly with PEFT. |
| 6 | 9.0 | [huggingface/peft](https://github.com/huggingface/peft) | Train | 21.7k D | Python | MIT | 2026-09 (D) | L | The LoRA implementation everything else sits on; emits the adapter format the submission contract requires. QLoRA paths determine 31B-on-4xL4 feasibility. |
| 7 | 8.8 | [volcengine/verl](https://github.com/volcengine/verl) | Train | 23.7k D | Python | Apache-2.0 | 2026-09 (D) | L | Agentic RL post-training (GRPO/PPO) with FSDP backends and LoRA support. Strongest open option if SFT plateaus and a reward-loop RL stage is attempted inside 96GB. |
| 8 | 8.8 | [SWE-Gym](https://github.com/SWE-Gym/SWE-Gym) | Train | 747 D | Python | n/s | 2026-09 (D) | L | Executable agentic training environments on real SWE tasks with official trajectories; natural complement or alternative to SWE-smith data. |
| 9 | 8.6 | [SWE-agent](https://github.com/SWE-agent/SWE-agent) | Agent | 20.4k D | Python | MIT | 2026-09 (D) | L | Reference agent-computer interface design; its tool-interface patterns map cleanly onto the 9 fixed harness tools. Also a trajectory-format source. |
| 10 | 8.5 | [axolotl](https://github.com/axolotl-ai-cloud/axolotl) | Train | 12.5k D | Python | Apache-2.0 | 2026-09-07 (J) | L+F | Declarative YAML training configs, stylistically closest to the declarative submission contract. Broad Gemma LoRA/DPO recipes; solid second trainer. |
| 11 | 8.4 | [mini-swe-agent](https://github.com/SWE-agent/mini-swe-agent) | Agent | 8.1k D | Python | MIT | 2026-09 (D) | L | ~100-line SWE agent. Cleanest template for expressing a BCF design as a minimal LoopAgent over run_command/submit_patch; cheap trajectory generation. |
| 12 | 8.3 | [R2E-Gym](https://github.com/R2E-Gym/R2E-Gym) | Train | 337 D | Python | n/s | 2026-09 (D) | L | Repository-to-execution environments with synthetic executable tests and process rewards; alternative task/reward engine to SWE-smith. |
| 13 | 8.2 | [harbor](https://github.com/laude-institute/harbor) | Test | 5.7k D | Python | n/s | 2026-09 (D) | F | Containerized agent-x-task-x-orchestrator eval runner (Terminal-Bench ecosystem). Best model for replicating the offline two-container eval locally. |
| 14 | 8.1 | [LLaMA-Factory](https://github.com/hiyouga/LLaMA-Factory) | Train | 75.2k D | Python | Apache-2.0 | 2026-09 (D) | L | Multi-method trainer (LoRA/QLoRA/DPO/GRPO) with YAML config and web UI. Failsafe if Unsloth hits Gemma-QAT edge cases. |
| 15 | 8.0 | SWE-bench Pro (see digest) | Test | n/s | Python | n/s | 2026-09 (D) | C+L | Harder, contamination-resistant held-out split. Best available proxy for measuring real generalization before the official eval. |
| 16 | 7.9 | [microsoft/SkillOpt](https://github.com/microsoft/SkillOpt) | Agent | 17.9k V | Python | MIT | 2026-09-30 | J | Text-space optimizer that trains natural-language skills from trajectories with validation-gated updates. Automated BCF skill iteration with frozen weights; emits deployable best_skill.md - exactly the skills/ artifact. |
| 17 | 7.9 | [anthropics/skills](https://github.com/anthropics/skills) | Agent | 179.2k V | Python | no license file | 2026-09-29 | J | Canonical Agent Skills standard (progressive disclosure) that the swegemma skills/ mechanism follows. Reference implementations to mine for structure. No LICENSE file - treat content as reference, not for verbatim redistribution. |
| 18 | 7.8 | [obra/superpowers](https://github.com/obra/superpowers) | Agent | 293.5k V | Shell | MIT | 2026-09-27 | J+H | Agentic skills framework plus engineering methodology (TDD discipline, debugging playbooks). Richest single source of prompt/gate patterns for BCF skills and batonic-rescue-style recovery flows. |
| 19 | 7.7 | [terminal-bench](https://github.com/laude-institute/terminal-bench) | Test | 818 D | Python | n/s | 2026-09 (D) | F | Real-terminal task suite and harness. Template for authoring held-out regression tasks to validate the agent before submitting. |
| 20 | 7.6 | [evalplus](https://github.com/evalplus/evalplus) | Test | 1.8k D | Python | Apache-2.0 | 2026-09 (D) | L | Augmented test suites (HumanEval+/MBPP+). Stronger verification gates than raw PASS; useful for self-check reward signals during data filtering. |
| 21 | 7.5 | [DeusData/codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp) | Context | 45.5k D | C | MIT | 2026-09-29 | B+J | Code knowledge-graph server, 158 languages, sub-millisecond queries. Blueprint for the semantics of get_code_neighbors / search_similar_code / get_code_subgraph. |
| 22 | 7.4 | SWE-Swiss (see digest) | Train | 105 D | Python | n/s | 2026-09 (D) | L | Open pipeline taking a 32B model to 60.2% on SWE-bench Verified. Evidence-backed data-recipe reference for scale decisions. |
| 23 | 7.4 | [ms-swift](https://github.com/modelscope/ms-swift) | Train | 15.8k D | Python | Apache-2.0 | 2026-09 (D) | L | ModelScope training stack: 3,800+ model adapters incl. Gemma, SFT/DPO/GRPO. Robust alternative trainer. |
| 24 | 7.4 | [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | Agent | 81.3k J | JavaScript | MIT | 2026-09-27 | J | Production-grade engineering skills for coding agents. Directly portable into skills/ with minimal adaptation. |
| 25 | 7.3 | [SWE-bench-Live](https://github.com/SWE-bench/SWE-bench-Live) | Test | 249 D | Python | n/s | 2026-09 (D) | L | Continuously refreshed SWE tasks. Contamination-resistant self-eval complement to frozen benchmarks. |
| 26 | 7.3 | [github/spec-kit](https://github.com/github/spec-kit) | Agent | 139.6k V | Python | MIT | 2026-09-30 | J | Spec-driven development toolkit with constitution-style gates. Pattern source for spec-first prompts and binary acceptance gates in the BCF design. |
| 27 | 7.2 | [LiveCodeBench](https://github.com/LiveCodeBench/LiveCodeBench) | Test | 955 D | Python | n/s | 2026-09 (D) | L | Rolling contest problems post-cutoff. Contamination-free functional checks of raw coding ability. |
| 28 | 7.2 | SWE-rebench-V2 (see digest) | Train | 85 D | Python | n/s | 2026-09 (D) | F | Fresh SWE tasks with a decontamination pipeline. Guards the training set against eval leakage. |
| 29 | 7.2 | [BerriAI/litellm](https://github.com/BerriAI/litellm) | Infra | 56.6k J | Python | NOASSERTION (core MIT) | 2026-09-02 | J+C | Dev-time gateway for multi-provider dataset generation and local serving of Gemma checkpoints. Named component of the BCF dev-time stack. |
| 30 | 7.2 | [langfuse/langfuse](https://github.com/langfuse/langfuse) | Test | 32.3k J | TypeScript | NOASSERTION (MIT core) | 2026-08-15 | J+C | Self-hosted tracing, evals, datasets, prompt management. The BCF dev-time observability pick for diagnosing LoopAgent failures. |
| 31 | 7.1 | [deepseek-ai/DeepSpec](https://github.com/deepseek-ai/DeepSpec) | Train | 7.2k V | Python | MIT | 2026-07-09 | J | Speculative-decoding stack with explicit Gemma-4 target-model support (4B-14B). Speeds local dev/test iteration on the actual model family. |
| 32 | 7.1 | [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) | Agent | 198.5k J | Markdown | n/s | 2026-09-02 | J | Distilled LLM coding-pitfall rules in a single file. Cheap, high-leverage upgrade material for BCF system prompts and code-review checklists. |
| 33 | 7.0 | [shepherd-agents/shepherd](https://github.com/shepherd-agents/shepherd) | Test | 2.5k V | Python | MIT | 2026-09-09 | J | Reversible Git-like execution traces: observe, fork, replay, revert agent runs. Dev-time debugging loop for harness policies without burning eval budget. |
| 34 | 7.0 | [WooooDyy/AgentGym-RL](https://github.com/WooooDyy/AgentGym-RL) | Train | 870 V | Python | MIT | 2026-02-15 | J | Multi-turn RL recipes (ScalingInter-RL) for long-horizon agents. Transferable reward-shaping and curriculum insights. |
| 35 | 7.0 | [yoanbernabeu/grepai](https://github.com/yoanbernabeu/grepai) | Context | 1.9k V | C | MIT | 2026-09-21 | J | 100% local semantic search plus call graphs. Offline-compatible implementation ideas for the code-search tool inside the isolated sandbox. |
| 36 | 6.9 | Multi-SWE-bench (see digest) | Test | 362 D | Python | Apache-2.0 | 2026-09 (D) | L | Multilingual SWE tasks across 9 languages. Hedge if the 129-task pool is not Python-only. |
| 37 | 6.9 | [vllm-project/llm-compressor](https://github.com/vllm-project/llm-compressor) | Train | 3.7k J | Python | Apache-2.0 | 2026-09-02 | J | The W4A16/QAT compression lineage behind the target checkpoint. Informs how LoRA adapters behave on QAT-quantized bases. |
| 38 | 6.9 | moatless-tools (see digest) | Test | 643 D | Python | n/s | 2026-09 (D) | F | Code navigation and trajectory experimentation framework. Replayable localization experiments without a full harness. |
| 39 | 6.9 | [topoteretes/cognee](https://github.com/topoteretes/cognee) | Context | 31.2k D | Python | Apache-2.0 | 2026-09-29 | B+J | Memory pipelines into knowledge graphs in few lines. Dev-time context layer for cross-run BCF memory experiments. |
| 40 | 6.9 | [Miguok/fable-harness](https://github.com/Miguok/fable-harness) | Agent | 205 V | Python | MIT | 2026-09-06 | J | Drop-in behavioral protocol: evidence-gathering before answering, adversarial review, test-based verification. Mirrors BCF tenets in working code. |
| 41 | 6.8 | [redhat-et/ripwire](https://github.com/redhat-et/ripwire) | Context | 2.4k D | Python | n/s | 2026-09-29 | G+J | Ripgrep-style precise context selection for AI agents. Direct lever on token waste inside the 32,768 budget. |
| 42 | 6.8 | [agent-infra/sandbox](https://github.com/agent-infra/sandbox) | Test | 6.0k V | Python | Apache-2.0 | 2026-09-14 | J | All-in-one Docker sandbox (shell, files, browser, VSCode server). Local stand-in for the eval container while iterating on the harness. |
| 43 | 6.8 | [deer-flow/llm-space](https://github.com/deer-flow/llm-space) | Test | 2.0k V | TypeScript | MIT | 2026-09-29 | J | Desktop app to inspect every harness step, replay failures, and evaluate. Local-first harness debugger. |
| 44 | 6.8 | [bigcode-project/octopack](https://github.com/bigcode-project/octopack) | Train | 480 D | Python | Apache-2.0 | 2026-09 (D) | F | CommitPack and commit-grade SFT data. Classic code-SFT mixture baseline to compare against SWE-smith data. |
| 45 | 6.8 | SalesforceAIResearch/multi-agent-coding-system (see digest) | Agent | 1.5k D | Python | n/s | 2026-09 (D) | F | Research system with planner/coder/QA role split. Concrete sub_agents/ composition patterns for the declarative harness. |
| 46 | 6.7 | [willccbb/verifiers](https://github.com/willccbb/verifiers) | Train | 4.7k D | Python | MIT | 2026-09 (D) | L | Lightweight RL environments and verifiers. Fastest path to prototype custom reward gates before committing to verl. |
| 47 | 6.7 | SkyRL (see digest) | Train | 2.4k D | Python | n/s | 2026-09 (D) | L | Modular agentic-RL backend applied to SWE tasks. Alternative RL engine; GiGPO-style credit assignment via the verl-agent variant. |
| 48 | 6.7 | jcodemunch-mcp (see digest) | Context | 2.7k D | TypeScript | n/s | 2026-09-29 | G | Persistent code-memory index for agents. Retrieval design reference for repo-map style tooling. |
| 49 | 6.7 | [mibayy/token-savior](https://github.com/mibayy/token-savior) | Context | 1.2k V | Python | MIT | 2026-08-10 | J | Token-efficient code navigation plus persistent memory. Reports 97.9% on a coding benchmark at -80% active tokens - strong budget-strategy evidence. |
| 50 | 6.7 | [vectorize-io/hindsight](https://github.com/vectorize-io/hindsight) | Context | 36.9k D | Python | n/s | 2026-09-27 | H+J | Agent memory built on temporal knowledge graphs. Design reference for durable cross-task memory. |
| 51 | 6.7 | [alibaba/open-code-review](https://github.com/alibaba/open-code-review) | Agent | 17.1k J | Go | Apache-2.0 | 2026-09-18 | J+H | Hybrid deterministic-plus-LLM review with line-level multi-language rulesets. Pattern for BCF external-verification gates. |
| 52 | 6.7 | [huggingface/open-r1](https://github.com/huggingface/open-r1) | Train | 26.5k D | Python | Apache-2.0 | 2026-09 (D) | F | Fully open recipe-reproduction framework. Methodological discipline reference for the training writeup (paper track). |
| 53 | 6.6 | Cranot/roam-code (see digest) | Context | 519 D | Python | n/s | 2026-09-29 | G | AST and semantic code-graph navigation toolkit. Graph-reasoning patterns for the code-graph comprehension paper topic. |
| 54 | 6.5 | [OpenRLHF](https://github.com/OpenRLHF/OpenRLHF) | Train | 10.1k D | Python | Apache-2.0 | 2026-09 (D) | L | Ray-based RLHF/GRPO framework. Well-documented fallback RL engine. |
| 55 | 6.5 | [facebookresearch/swe-rl](https://github.com/facebookresearch/swe-rl) | Train | 719 D | Python | n/s (Meta license) | 2026-09 (D) | L | Rule-based reward RL from real PR histories. Method reference for reward design without gold patches. |
| 56 | 6.5 | [rasbt/reasoning-from-scratch](https://github.com/rasbt/reasoning-from-scratch) | Train | 5.3k V | Jupyter | Apache-2.0 | 2026-09-30 | J | From-scratch RLVR and reasoning implementation. Best pedagogy for understanding reward mechanics before scaling up. |
| 57 | 6.5 | [pax-beehive/paxm](https://github.com/pax-beehive/paxm) | Context | 435 J | Go | Apache-2.0 | 2026-08-15 | J | Provider-neutral persistent memory conventions (.ctx files). Pattern for a durable cross-session BCF memory format. |
| 58 | 6.4 | [aiming-lab/Agent0](https://github.com/aiming-lab/Agent0) | Train | 1.3k V | Python | Apache-2.0 | 2026-07-10 | J | Self-evolving agents from zero data via tool-integrated reasoning. Strong inspiration for the tasks-and-benchmarks paper topic. |
| 59 | 6.4 | [can1357/oh-my-pi](https://github.com/can1357/oh-my-pi) | Agent | 20.9k J | TypeScript | MIT | 2026-09-02 | J | Hash-anchored edits and LSP integration. Edit-tool strategy patterns that reduce failed-patch rates. |
| 60 | 6.4 | [QwenLM/qwen-code](https://github.com/QwenLM/qwen-code) | Agent | 27.1k J | TypeScript | Apache-2.0 | 2026-09-02 | J+G | Terminal coding agent under a permissive license. Prompt and tool-design reference implementation. |
| 61 | 6.4 | [stablyai/orca](https://github.com/stablyai/orca) | Infra | 81.7k D | TypeScript | MIT | 2026-09-22 | B | Multi-agent IDE with per-agent Git-worktree isolation. Dev-time orchestration pattern for parallel sub-agents. |
| 62 | 6.4 | agentic-harness-engineering (see digest) | Agent | 911 D | n/s | n/s | 2026-09 (D) | F | Practitioner field notes on harness engineering. Context for prompt and tool-budget decisions. |
| 63 | 6.4 | [unslothai/unsloth-zoo](https://github.com/unslothai/unsloth-zoo) | Train | 298 J | Python | LGPL-3.0 | 2026-08-15 | J | Companion notebooks and utilities incl. Gemma fine-tunes. Part of the Unsloth recipe path. |
| 64 | 6.3 | SelfCodeAlign (see digest) | Train | 325 D | Python | MIT | 2026-09 (D) | F | Fully synthetic instruction data with execution filtering. Contamination-free data-generation method. |
| 65 | 6.3 | [ise-uiuc/Magicoder](https://github.com/ise-uiuc/Magicoder) | Train | 2.1k D | Python | Apache-2.0 | 2026-09 (D) | L | OSS-Instruct decontaminated synthetic data. Secondary data-mixing source. |
| 66 | 6.3 | [microsoft/graphrag](https://github.com/microsoft/graphrag) | Context | 35.5k J | Python | MIT | 2026-09-02 | J | Graph-RAG reference architecture. Background for the graph-reasoning paper topic. |
| 67 | 6.3 | [linkedin/Liger-Kernel](https://github.com/linkedin/Liger-Kernel) | Train | 6.6k D | Python | BSD-2-Clause | 2026-09 (D) | F | Fused Triton kernels for LLM training. Memory and speed headroom when the 4xL4 budget gets tight. |
| 68 | 6.3 | [microsoft/DeepSpeed](https://github.com/microsoft/DeepSpeed) | Train | 43.2k D | Python | Apache-2.0 | 2026-09 (D) | F | ZeRO/offload if 31B LoRA training pushes memory limits. Add on demand. |
| 69 | 6.3 | [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) | Context | 99.8k J | Python | n/s | 2026-09-07 | J | Turns codebase, docs, and schemas into a queryable knowledge graph with a skill entry point. get_code_subgraph inspiration. |
| 70 | 6.2 | [krishagarwal314/CodeJury](https://github.com/krishagarwal314/CodeJury) | Agent | 147 V | Python | MIT | 2026-08-06 | J | Six-stage gated pipeline (PM, planner, dev, QA, review). Mirrors BCF binary-gate sequencing in a small readable codebase. |
| 71 | 6.2 | [OpenCoder-llm/OpenCoder](https://github.com/OpenCoder-llm/OpenCoder) | Train | 2.1k D | Python | Apache-2.0 | 2026-09 (D) | L | Fully documented data recipe (RefineCode). Transparency model for the paper track. |
| 72 | 6.2 | [ByteDance-Seed/Seed-Coder](https://github.com/ByteDance-Seed/Seed-Coder) | Train | 757 J | Python | MIT | 2026-09-02 | L | Pipeline lessons for curating code SFT data at scale. |
| 73 | 6.2 | NVIDIA/NeMo-Skills (see digest) | Train | 1.0k D | Python | n/s | 2026-09 (D) | F | Containerized training-plus-eval pipelines. Recipe-structure reference. |
| 74 | 6.2 | [bitsandbytes-foundation/bitsandbytes](https://github.com/bitsandbytes-foundation/bitsandbytes) | Train | 8.5k D | Python | Apache-2.0 | 2026-09 (D) | F | NF4/QLoRA primitives. Needed only if adapters must train against a 4-bit-loaded base. |
| 75 | 6.1 | [Fission-AI/OpenSpec](https://github.com/Fission-AI/OpenSpec) | Agent | 65.2k J | TypeScript | MIT | 2026-09-27 | J | Lightweight spec-driven development. Simpler alternative to spec-kit. |
| 76 | 6.1 | [GAIR-NLP/DeepResearcher](https://github.com/GAIR-NLP/DeepResearcher) | Train | 795 J | Python | Apache-2.0 | 2026-09-02 | J | RL in real-world environments. Methods reference for the RL paper topic. |
| 77 | 6.1 | [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom) | Context | 74.0k D | n/s | n/s | 2026-09-23 | G+J | Tool-output compression for agents. Direct lever on the 32,768-token context budget. |
| 78 | 6.1 | affaan-m/ECC (see digest) | Infra | 269.7k D | n/s | n/s | 2026-09-22 | B | Harness-optimization system (skills, instincts, memory) across coding agents. Cross-pollination for BCF instinct files. |
| 79 | 6.1 | [OpenAutoCoder/Agentless](https://github.com/OpenAutoCoder/Agentless) | Agent | 2.1k D | Python | n/s | 2026-09 (D) | F | Two-phase localize-then-repair pipeline. The simple baseline a BCF agent must beat, and a router-pattern source. |
| 80 | 6.0 | RUCAIBox/SWE-Master (see digest) | Agent | 106 D | Python | n/s | 2026-09 (D) | F | Agentic SWE pipeline study. Small but current reference. |
| 81 | 6.0 | [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) | Infra | 149.5k J | TypeScript | MIT | 2026-09-02 | J+B | Everything-is-a-plugin harness architecture. Patterns for adapters/ and skills/ modularity. |
| 82 | 6.0 | [dair-ai/prompt-engineering-guide](https://github.com/dair-ai/prompt-engineering-guide) | Agent | 77.5k J | MDX | MIT | 2026-09-02 | J | Curated prompt and context-engineering corpus. Background reading for prompt revisions. |

## 5. Lane notes

- **Train.** The SWE-smith family (rows 1-2) plus Unsloth (row 3) is the load-bearing path: generate tasks and trajectories, filter by execution, SFT a LoRA adapter, evaluate on a small SWE-bench slice. TRL/PEFT (rows 5-6) produce the exact adapter artifact. verl (row 7) is the stretch path for agentic RL; verifiers (row 46) prototypes reward gates cheaply first. DeepSpec (row 31) speeds iteration on Gemma-4 checkpoints specifically.
- **Test.** Replicate the official eval cheaply before spending it: harbor/terminal-bench/agent-infra/sandbox for containers, SWE-bench harness for scoring, contamination-resistant complements (rows 15, 25, 27, 28) to detect overfitting to leaked tasks. shepherd and llm-space debug harness policies offline.
- **Agent.** SkillOpt (row 16) is the collection gem: it closes the BCF skill-improvement loop with validation-gated updates and frozen weights - a fit for both the main track and the paper track. anthropics/skills defines the format; superpowers, addyosmani, karpathy-skills supply content patterns; spec-kit supplies gate discipline.
- **Context.** The 32,768-token budget is a binding constraint: ripwire/headroom/token-savior attack it directly; codebase-memory-mcp/grepai/roam-code/graphify define how get_code_* tool outputs should look.

## 6. Suggested adoption order (competition timeline: entry Nov 25, final submission Dec 2)

1. **Week 1:** stand up SWE-smith data generation + Unsloth LoRA SFT (rows 1-3, 5-6); baseline mini-swe-agent-style loop in declarative YAML (row 11).
2. **Weeks 2-3:** local eval loop - harbor + terminal-bench + SWE-bench slice (rows 13, 19, 4); contamination checks with Pro/Live/rebench (rows 15, 25, 28).
3. **Weeks 3-5:** skill iteration with SkillOpt; port BCF gates from superpowers/spec-kit/fable-harness patterns (rows 16, 18, 26, 40).
4. **Final month:** RL only if SFT plateaus and 96GB allows (row 7, with rewards prototyped in verifiers, row 46); context-budget hardening (rows 41, 77, 49).

## 7. Notable exclusions (with reasons)

| Resource | Score band | Reason |
|---|---|---|
| bigcodebench | 4-6 | Archived per digest; superseded by evalplus/LiveCodeBench. |
| torchtune, microsoft/LoRA, qlora, CodeLlama | 4-6 | Unmaintained or archived per digests; covered by TRL/PEFT/Unsloth. |
| prime-rl, AReaL, NVIDIA NeMo Gym | 4-6 | At-scale distributed RL infrastructure; overkill for a single 4xL4 budget. |
| mattpocock/skills, tech-leads-club/agent-skills, finding-unknowns-skills | 4-6 | TypeScript-centric or niche checklists; karpathy-skills + addyosmani cover the need. |
| LightRAG, HKUDS stacks, OpenSPG/KAG | 4-6 | General doc-RAG; graphrag retained as the single graph-RAG reference. |
| open-webui, anything-llm, lobeHub, LibreChat, cherry-studio, dify | <4 | Chat UIs / app platforms; no submission relevance. |
| DeepSeek/Qwen-specific tooling (dscode, dao-code, deepseek-engineer, D-Star) | <4 | Off-model: competition fixes the model to Gemma 4. |
| Media/robotics/finance/voice/meeting/trading repos; stable-diffusion stack; manim; coding-interview-university; RuView | <4 | Off-domain. |
| RAG-at-scale and vector-DB families (lancedb, turbovec, StarTrail PixelRAG) | <4 | The harness is offline with fixed tools; no user-facing retrieval layer to build. |

## 8. Open questions

1. Whether hosted-model-generated LoRA training data is allowed by competition rules (BCF compendium, open question C2) - determines how much of the SWE-smith-style synthetic pipeline can be regenerated vs. reused as-is.
2. LoRA-on-QAT behavior: adapters trained against the W4A16 QAT base may behave differently than against an unquantized base; llm-compressor (row 37) and DeepSpec (row 31) are the references to consult.
3. anthropics/skills has no LICENSE file (API-verified): mine it for structure, do not redistribute content verbatim in the submission.
4. SWE-bench Verified contamination (OpenAI finding, per BCF compendium B6): treat Verified numbers as inflated; validate with Pro/Live/rebench splits.

## 9. Sources

In-collection: `foss_tools/githubdigest.json` (4,095 repos, snapshot ~2026-09-02/15); `foss_tools/grokmuse/` digests L, F, R, B, G, H and 25 same-lane earlier batches; `bcf/BCF-Reference-Compendium.md`; `input/kagglecomp/` harness README and competition docs (scoping only).

External (2026-09-30): GitHub REST API, 16 unauthenticated repository lookups (log in scratch folder); no paid APIs; no CAPTCHA or paywall bypassing attempted; no MCP-server quota used.

---
Reproducibility: scoring code ran in-browser over the local JSON (9-cluster regex weighting; +0.5 permissive-license bonus; archived penalty; manual review of the top 330 and all pattern-hit candidates >= 300 stars). Verification batch: 16 API calls at 2026-09-30, all returned HTTP 200. Research spend: $0.00. Intermediate work: `scratch/foss-tools-assessment-2026-09-30/`.


---

<!-- ====================================================================== -->
<!-- FILE: 09-real-task-simulation-httpx3672-bcf-vs-naive.md -->
<!-- ====================================================================== -->

# Real-Task Simulation: httpx_3672 — BCF Agent vs. Naive Agent

Replaces the retracted httpx_6821 case study in the dossier with the real competition task it should have used. Date: 2026-09-30.

## Evidence states (dossier vocabulary, applied to this document)

| State | Meaning |
|---|---|
| VERIFIED | Traced to a primary source during this session |
| RECONSTRUCTED | Derived from verified primary sources by stated inference |
| DESIGNED | A proposal. Not built, not run |
| ILLUSTRATIVE | A constructed walkthrough. Not a measured run |

## 0. Provenance ledger for this document

| # | Claim | State | Basis |
|---:|---|---|---|
| 1 | httpx_3672 is a real instance_id in the public training set | VERIFIED | Dossier, section tasks.jsonl — Every Field Confirmed (ids fastapi_11194, requests_7205, rich_2725, httpx_3672; repos fastapi, rich, requests, httpx) |
| 2 | httpx_3672 resolves to encode/httpx PR #3672 | RECONSTRUCTED | instance_id convention repo_issuenum; PR exists and matches: Server connection handling., merged 2025-09-19 |
| 3 | PR content: +62/−27, 8 files, base v1 at 4acf5c2c | VERIFIED | GitHub REST API /repos/encode/httpx/pulls/3672 + /files, 2026-09-30 (log: scratch/foss-tools-assessment-2026-09-30/httpx-3672-api-evidence.md) |
| 4 | Base-commit code excerpts and line numbers | VERIFIED | raw.githubusercontent.com at 4acf5c2c (network.py:163, parsers.py:378, server.py:100) |
| 5 | Competition problem_statement / patch / test_patch field text for httpx_3672 | NOT ACCESSIBLE HERE | tasks.jsonl ships inside gemma-4-developer-agent.zip; no shell in this environment; content reconstructed from the upstream PR that the id resolves to |
| 6 | Both agent traces, all turn counts, all metric numbers | ILLUSTRATIVE | No agent was run. Numbers are estimates shaped by the harness rules (50-turn budget, 12 h wall clock) |

The dossier ledger retracts httpx_6821 because the functions it discussed do not exist in the competition code. Everything below is built only from symbols that verifiably exist at the task base commit.

## 1. The real task: httpx_3672

**PR #3672 — Server connection handling.** (encode/httpx, branch v1). Opened and merged 2025-09-19. Base SHA 4acf5c2c37714cc63b5cf71b3e284fca83c90311; merge commit 68989ae47d9fd10381a3859619a3880014d187f6. +62/−27 across 8 files (6 source + 1 async-tree set + tests).

Problem statement (the agent would see a form of this via get_status): five behavior changes — add HTTPParser.keep_alive; server must always read the request to completion on keep-alives; rename HTTPParser.complete to reset; close streams on server exit; do not raise KeyboardInterrupt out of server wait.

### The five real defects (all present at base commit 4acf5c2c)

| ID | Location (base) | Defect | Phase-1a class | Symptom |
|---|---|---|---|---|
| B1 | src/httpx/_server.py approx L89 (and async mirror) | Callback body reads self._parser.complete — missing call parentheses | Class 3 crash | Await of a method object raises TypeError on first response completion |
| B2 | src/httpx/_server.py handle_requests (L~33-52) | Request body never drained on keep-alive before reset | Class 1 logic | Parser left mid-state; next request on the reused connection desynchronizes (silent corruption) |
| B3 | src/httpx/_parsers.py L378 (+ async mirror) | complete() returns None; no is_keepalive query; name says done but means reset-to-idle | Class 2 API contract | Callers cannot tell reusable vs closing; rename with boolean return required |
| B4 | src/httpx/_network.py NetworkServer (L156-184) | Streams never tracked or closed on server exit; _exit_ shuts down executor only. Landmine at L163: _streams assigned the type object list[NetworkStream] instead of an empty list | Class 1 resource leak | Socket/file leak per connection across server lifetime; any future use of _streams crashes |
| B5 | src/httpx/_server.py wait() L100-102 | Bare sleep(1) in while(True) | Class 3 crash | Ctrl-C surfaces a KeyboardInterrupt traceback instead of clean exit |

Hidden dependency: **B1 masks B2.** The completion callback crashes before any drain logic could run, so fixing the drain (B2) without fixing the parentheses (B1) changes nothing observable. Fix order matters: B3 → B1 → B2 → B4 → B5 is the dependency-correct topological order.

Compounding factors that make this a hard instance:
- **Sync/async mirror tree.** Every parser/pool/server change exists twice (httpx and ahttpx). The gold PR touches 8 files; a partial fix that misses one mirror fails behavioral tests.
- **Visible tests are renames.** tests/test_parsers.py at base calls p.complete() five times; the verification tests exercise reset(), is_keepalive() and two-request keep-alive behavior that no base test covers.
- **The landmine.** network.py:163 looks like a harmless annotation; an agent that "fixes" it by using _streams without initializing correctly trades a latent bug for an active crash.

## 2. Naive agent — 28-turn trace (ILLUSTRATIVE, estimated)

Policy: react to keywords, grep first, read everything, edit immediately, no spec, no journal, no gates, submits when it feels done.

| T | Action (harness tool) | Outcome |
|---:|---|---|
| 1-2 | get_status(); run_command: ls src | Reads 5-bullet statement; sees repo layout |
| 3-5 | run_command: grep -rn keep_alive src (x3 phrasings) | 30+ hits across _pool, _parsers, _server, ahttpx mirrors — no prioritization |
| 6-9 | read_file _parsers.py in 4 chunks (700 lines) | Misreads complete() as fine; fixates on the name keep_alive |
| 10-12 | edit_file _pool.py: raises _keepalive_duration; run_command: pytest tests/test_parsers.py | Base tests still pass (they call complete()) — false sense of progress |
| 13-15 | edit_file tests/test_parsers.py: renames complete to reset in tests only; pytest | Source still defines complete — tests now fail; agent re-renames tests back |
| 16-19 | edit_file _server.py wait(): wraps sleep in try/except (B5 fixed first — cosmetic, zero dependency) | 4 turns on the least connected bug |
| 20-23 | edit_file _server.py: attempts drain — inserts stream.read() but without is_keepalive() guard and without B1 paren fix; runs own smoke server once | TypeError from B1 crashes handler; agent concludes drain idea is wrong, reverts it |
| 24-25 | edit_file _network.py: sets self._streams = [] but adds no pruning or close-on-exit | Half of B4; leak remains |
| 26 | run_command: pytest tests/ | All base tests pass — nothing actually fixed is tested by base suite |
| 27-28 | submit_patch (4 files; both ahttpx mirrors untouched; tests edited then reverted inconsistently) | G1 scope clean but functionally: reset rename absent, B1 alive, B2 absent, B4 half, mirrors stale |

Grading (simulated): hidden test_patch renames five parser tests to reset() — they fail immediately on the unrenamed source; the two-request keep-alive behavioral test dies on B1 TypeError; async-mirror tests fail wholesale. **FAIL. 28 of 50 turns burned, 0 resolved assertions, 4 wrong edits, 5 recovery turns.**

Failure anatomy: (1) fixed B5 first — topologically last, because it was textually easiest; (2) attempted B2 while B1 masked it, read the masking as disproof, and reverted; (3) edited the test suite, the one file that must match the hidden test_patch; (4) never discovered the mirror tree; (5) no record of failed attempts, so turn 20 re-derived turn 10 conclusions.

## 3. BCF agent — 12-turn trace (ILLUSTRATIVE, estimated)

Policy: the compendium pipeline — Phase 1a classify, Phase 1b BCF-Spec, Phase 2 graph-first localization, Phase 3 root-first minimum patches, Phase 4 gated validation — with breadcrumb journal, verification hierarchy V0-V3, gates G0-G6, and BCF-Rescue as the only backward edge.

| T | Phase | Action | BCF component fired |
|---:|---|---|---|
| 1 | 0 | get_status(); write_file /tmp/bcf/httpx_3672/journal.md (outside repo tree — cannot leak into patch); init ledger events | A3 journal schema: Entries (newest last) / Ruled out / Current best patch; B5 ledger |
| 2 | 1a | run_command: python skills/bcf_brain/scripts/classify_issue.py against statement text | Phase 1a classification gate (dossier v2): no traceback + behavioral bullets + dont-raise-KeyboardInterrupt signal → compound class logic+crash, confidence heuristic; 5 action verbs → multi_bug suspected; routes to multi-bug spec template, stack+trace-guided toolset |
| 3 | 1b | Emit BCF-Spec JSON: hypotheses H1-H5 keyed to the five bullets; scope.allowed_files = [_parsers.py, _pool.py, _server.py, _network.py, + ahttpx mirrors, tests/test_parsers.py]; fix_shape per file; bug_order B3→B1→B2→B4→B5 (dependency-reasoned: rename defines the API the rest needs); binary done = reference tests pass. Layer-1 knowledge (prompt): httpx v1 keeps a sync/async mirror tree — mirrors pre-seeded in scope | A6 BCF-Spec (G0 validates schema); Tenet 2 minimum-path; Tenet 4 binary done; Intelligence Layer 1 |
| 4 | 2 | search_similar_code, dual query: Q1 error-language (server connection keep alive close on exit), Q2 structural/API language (parser state reset idle after response) | Dossier v2 §4 two-query strategy over the 256-dim embeddings: the two phrasings hit different embedding regions; union → [HTTPParser.complete, server.handle_requests, pool.send, NetworkServer.__exit__] |
| 5 | 2 | get_code_subgraph(httpx._parsers.HTTPParser.complete, depth 2, edge_type calls/called_by); get_code_neighbors called_by | §4.2 centrality argument: complete appears in BOTH query results AND sits at a high-degree subgraph position → strongest localization signal. §4.3 called-by direction: pool._complete shows a real calls edge; the server-side caller shows none — the graphs silence where a caller must exist is itself evidence (symptom at call site, defect at definition) |
| 6 | 2 | read_file _server.py lines 25-105 only (reducer contract: targeted slice, not the 800-line file); read _network.py 150-190 | A4 transcript-passing gap + code reducer: ~120 lines enter context instead of thousands; Tenet 3 breadcrumbs: journal update — hypotheses H1 (parens), H2 (drain), H4 (exit-close) now traced |
| 7 | 3 | Patch step 1 (root, B3+B1): rename complete→reset returning bool + add is_keepalive() in both _parsers.py mirrors; rewire callers in both _pool.py and both _server.py, fixing the missing parentheses; update tests/test_parsers.py exactly as the verification diff does (5 call sites) | Tenet 1 preserve-working-code (renames are mechanical; no logic touched yet); one bug per patch step; V2 targeted: run_command pytest tests/test_parsers.py → PASS |
| 8 | 3 | Patch step 2 (B2): drain in handle_requests — if self._parser.is_keepalive(): stream.read() then self._reset(), both mirrors; V2b agent-written repro: two requests over one connection via serve_http | V2b is advisory-only (A5.3): authored by the agent, cannot grant approval; gates still decide |
| 9 | 3 | Patch step 3 (B4+B5): NetworkServer typed empty _streams, is_closed(), prune in _serve, close-all in __exit__; wait() KeyboardInterrupt trap. First attempt edits only src/httpx — **G4 behavioral check FAILS on the async mirror: strike 1** | G4 strike rule; A2 BCF-Rescue (the one sanctioned backward edge): journal read names touched vs allowed files → add async drain + async reset wiring → re-run → PASS. Loop cost: 1 turn, not 5 |
| 10 | 4 | Full gate run: G0 spec valid; G1 all changed files in scope (10 files, incl. mirrors — clean); G2 git apply --check clean; G3 AST parses; G4 targeted tests pass; G5 regression: pytest on untouched pool/client modules — no PASS-to-PASS movement; G6 non-empty | A8 binary gates, evaluated by orchestrator code — the model cannot waive them; A5 verification V0/V1/V2 all green; V3 verifier skipped (policy: advisory, costs a call, adds nothing when V2 is green) |
| 11 | 4 | submit_patch() | Tenet 4: submit only after gate vector all-true |
| 12 | — | Journal close-out (current best patch → final; ruled-out list preserves the B2-before-B1 masking lesson); ledger emits run summary | B5 derived tables: turns=12, strikes=1, rescue=1, loop_rate 0, repeat_action_rate 0 |

Grading (simulated): hidden test_patch applies cleanly over the renamed tests; five parser tests PASS; keep-alive behavioral tests PASS on both trees; exit behavior clean. **PASS. 12 of 50 turns, 1 strike, 0 wrong edits surviving to submit.**

## 4. Head-to-head (ILLUSTRATIVE, estimated numbers)

| Metric | Naive (28 T) | BCF (12 T) | Delta |
|---|---:|---:|---:|
| Result | FAIL | PASS | — |
| Wrong edits | 4 | 0 (1 caught by G4 before submit) | −4 |
| Fix order | B5→B2(masked)→partial | B3→B1→B2→B4→B5 | dependency-correct |
| Turns to first true root cause (B1) | never | 6 | — |
| Recovery turns | 5 | 1 (rescue) | −4 |
| Lines read into context | ~1,400 | ~220 | −85 pct |
| Test-suite edits | yes (conflicts with test_patch) | mirrors gold test diff | — |
| Budget remaining | 22 / 50 | 38 / 50 | +16 |

Budget arithmetic (dossier): at ~2 min/turn inside the 12 h envelope, the naive policy is dead on arrival across ~120 hidden tasks; the BCF policy banks 26 turns per median task to spend on genuine outliers.

## 5. Every BCF component in play (compendium + dossier v2 cross-reference)

| Component (ref) | Where it fired in this simulation | Benefit realized | Metric it moves |
|---|---|---|---|
| Tenet 1 preserve working code (A1) | Patch steps are mechanical renames first, behavior added after; G5 regression run before submit | No collateral breakage in untouched client/pool code | collateral_edit_rate, regression_rate |
| Tenet 2 minimum-path decomposition (A1) | 5-bullet statement decomposed into B1-B5 with dependency order B3→B1→B2→B4→B5 | Masking respected: no fix attempted while its predecessor was live | turns per bug, patch size |
| Tenet 3 breadcrumbs (A1, A3) | Journal at /tmp/bcf/httpx_3672/journal.md updated at T1, T6, T9, T12; ruled-out list records the masking lesson | Rescue at T9 resolved by reading the journal, not by re-deriving; zero repeated failed actions | loop_rate, repeat_action_rate |
| Tenet 4 binary done (A1, A8) | Done = gate vector all-true, not feels complete | Naive submitted on a green base-suite that tested nothing fixed; BCF could not | empty_patch_rate, pass rate |
| Phase 1a classification gate (dossier v2) | classify_issue.py at T2: compound logic+crash, multi_bug, route to multi-bug template | Toolset and spec template selected before any file access; no Phase 2 before Phase 1 completes (A1.3 pipeline rule) | misroute rate, wasted-turn rate |
| BCF-Spec (A6) | T3 JSON: hypotheses, scope.allowed_files, fix_shape, bug_order; G0 validates | Scope discipline caught the ahttpx omission at T9 (file list diff), not at grading | G1 violation count |
| Sub-agent scoping (A1.4) | issue_analyzer (T2-T3) holds no edit permissions; patch_implementer (T7-T9) acts only on the planned file set | Phase order enforced by tool permissions, not prompt wording | phase-violation rate |
| Breadcrumb journal (A3) | See Tenet 3; capped ~30 lines, reducer summarizes | 1-turn rescue; audit trail for the ledger | loop_rate |
| Transcript-passing gap + reducer (A4) | T6 targeted 120-line slices chosen from graph output instead of whole-file reads | ~85 pct context reduction on a 2,000-line subsystem | tokens per task |
| External verification (A5) | V0 apply-check, V1 AST, V2 targeted pytest at every step; V2b repro advisory-only; V3 skipped by policy | Self-authored tests never grant approval; hidden-test blindness kept explicit | false-approval rate |
| Binary gates G0-G6 + strike rule (A8) | T9 G4 FAIL → strike 1 → rescue; T10 full gate vector | The one real mistake was caught and priced at 1 turn | strike count, rescue rate |
| BCF-Rescue (A2) | Sanctioned backward edge at T9 | Recovery without abandoning the pipeline | recovery turns |
| Progressive disclosure / Agent Skills (A7) | classify_issue.py loaded on demand; mirror-tree note loaded only when scope was drafted | Layer-2 knowledge at 1 turn per call, zero always-on tokens | always-on token overhead |
| Graph tools, dual query, centrality, called-by (dossier v2 §4) | T4-T5: two embedding queries; complete at intersection with high degree; silent called-by edge on the server caller pointed at B1 | 3 tool calls replaced 12 turns of grep-and-read; the missing call edge was the paren bug fingerprint | turns to localization |
| Intelligence Layers 1-4 (dossier) | L1 prompt knowledge of the mirror tree at T3; L2 skill scripts at T2; L3 bundled JSON (sync/async file map) at T3/T9; L4 QLoRA unused — task solved by scaffolding alone | Evidence for the scaffolding-first thesis the dossier argues | layer-ablation deltas |
| Structured ledger (B5) | T1 init, T12 run summary | Per-run derived tables feed the ablation analyses (dossier evidence gap C) | reproducible analytics |
| Provenance / evidence states (dossier) | This document: every claim tagged VERIFIED / RECONSTRUCTED / DESIGNED / ILLUSTRATIVE | The httpx_6821 failure mode is structurally impossible here | fabrication count (target 0) |
| Benchmark alignment (B6) | Grading modeled as FAIL_TO_PASS (renamed + behavioral tests) + PASS_TO_PASS (untouched modules) | Local V2 approximates the official resolved definition | local-vs-official drift |
| HIVE-Lite (B2, dev-time) | Out of band: the two arms of this comparison are exactly the HIVE queue items (baseline arm, full-BCF arm) | Scheduled measurement, not anecdote | ablation completion |

## 6. What would make this measured instead of simulated

1. Reference-check the reconstruction: .venv/bin/python scripts/evaluate.py --reference-check --task-id httpx_3672 (dossier command pattern) — confirms the harness, the snapshot, and test_patch agree with this document.
2. Run both arms under the harness on the real snapshot: naive baseline (no skills) vs full BCF, logging the ledger fields above. The comparison is then evidence-gap Category C (controlled harness experiment), not illustration.
3. Add the masking probe: an arm that applies only the B2 drain patch — prediction: identical failure to naive T20-23 (B1 masks B2). If false, the dependency model in the spec is wrong and should be revised.

## 7. Sources

- bcf/BCF-contestsubmission_dossier_20260928.html — provenance ledger (httpx_6821 retraction), evidence states, Phase 1a gate + 4 classes, intelligence layers, v2 graph-reasoning section, dataset detail (instance_id list incl. httpx_3672), budget arithmetic.
- bcf/BCF-Reference-Compendium.md — A1-A8 submission components, B2/B5/B6 dev-time assets, gate table, verification hierarchy, journal schema.
- GitHub REST API (unauthenticated, 2026-09-30): encode/httpx PR #3672 metadata + file patches; raw file contents at base SHA 4acf5c2c for _server.py, _pool.py, _parsers.py, _network.py. Full log: scratch/foss-tools-assessment-2026-09-30/httpx-3672-api-evidence.md.
- scratch/bcf-task-notes-2026-09-30.md — confirms fastapi_11194 (illustrative) and httpx_6821 (invented) as the dossier case studies, and the masking/fault-interference framing reused in section 1.

---
No agent was run; both traces are constructed walkthroughs (ILLUSTRATIVE). External calls this session: 6 GitHub API/raw fetches, unauthenticated, $0.00. The zip packaged with the competition data could not be parsed in this environment; when a shell is available, section 6 step 1 is the first command to run.

