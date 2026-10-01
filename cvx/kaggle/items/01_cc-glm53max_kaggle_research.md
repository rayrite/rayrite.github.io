# COMBINED MARKDOWN - combine

_Generated 2026-09-30 18:38:07 | 13 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle\items\combine_

## Contents

1. 00-README-glm53max.md
2. 01-roadmap-and-master-checklist.md
3. 02-master-plan-day0-six-sprints.md
4. 03-discussion-board-intel.md
5. 04-paper-track-intel.md
6. 100-README-glm53max.md
7. 101-bcf-integration-into-master-plan.md
8. 102-bcf-diagnostic-math-and-prior-research.md
9. 103-bcf-simulation-httpx-3672.md
10. 400-README-glm53max.md
11. 401-coderprog-catalog-bcf-ranked.md
12. 402-0dayprizrak-catalog-bcf-ranked.md
13. 403-foss-tools-bcf-ranked.md

---

<!-- ====================================================================== -->
<!-- FILE: 00-README-glm53max.md -->
<!-- ====================================================================== -->

# Deliverables — Gemma 4 Developer Agent Competition Planning (2026-09-30)

End-to-end planning package for the Kaggle **Gemma 4 Developer Agent** competition
(https://www.kaggle.com/competitions/gemma-4-developer-agent), prepared 2026-09-30.

| Doc | Task | Contents |
|---|---|---|
| [01-roadmap-and-master-checklist.md](01-roadmap-and-master-checklist.md) | Task 1 | Competition snapshot and score math; harness-quirk analysis (Q1–Q6); strategy brainstorm with trade-offs; the agent "brain" design spec (prompt doctrine, tool policy, time budgets, fine-tune track, validation strategy); milestones M0–M7; phase-by-phase master checklist; risk register |
| [02-master-plan-day0-six-sprints.md](02-master-plan-day0-six-sprints.md) | Task 2 | Machine roles and compute budget; Day 0 (Oct 1) hour-by-hour bare-metal setup for Main / AUX1 / AUX2; Sprints 1–6 (Oct 2 – Nov 12) with daily schedules and exit criteria; final stretch (Nov 13 – Dec 2); standing operating cadence; submission SOP |
| [03-discussion-board-intel.md](03-discussion-board-intel.md) | Addendum | Complete discussion-board intelligence (22/22 visible threads, swept 2026-09-30): host commitments tracker, LoRA bug trilogy, harness quirks with measured numbers, local-eval autopsy, baseline scores, infra/quota intel, per-thread manifest, deltas vs the plan |
| [04-paper-track-intel.md](04-paper-track-intel.md) | Addendum | Paper-track competition intel (site scraped 2026-09-30 → `scrapes/gemma4-paper-comp-2026-09-30/`): rubric, prizes $15K/$10K/$10K, 3,000-word cap, host Q&A, judge-roster analysis, two-entry strategy for our pipeline |

**Offline snapshots:** main-comp local docs in `input/kagglecomp/docs`; paper-track site in `scrapes/gemma4-paper-comp-2026-09-30/` (see its README).

**Supporting research** (evidence, sources, confidence ratings): `../../scratch/research-gemma4-agent-2026-09/` — see `report.md`, `scratch/notes/consolidated-findings.md`, `scratch/notes/00-scope.md`.

## How to use this package

1. Read `01` §1–3 first (why the plan is shaped this way — leaderboard state and harness quirks drive everything).
2. Execute `02` Day 0 on Oct 1; keep `02` §11 (cadence) and `01` §7 (master checklist) open daily.
3. Every Thursday, run the milestone gate review (`01` §6) and update the risk register (`01` §8).
4. Track host harness patches (Q1 LoRA KV, Q2 escaping, Q3 thinking-drop) — the plan's Track 2 dates flex on them.

## Key dates

| Date | Event |
|---|---|
| Oct 1 | Day 0 — bare-metal setup |
| Nov 12 | Paper-track deadline ($35K) |
| Nov 25 | Entry/merger deadline (team ≤ 5) |
| Dec 2, 11:59 PM UTC | Final submission deadline (2 picks) |


---

<!-- ====================================================================== -->
<!-- FILE: 01-roadmap-and-master-checklist.md -->
<!-- ====================================================================== -->

# Task 1 — Winning "Brain" Roadmap: Gemma 4 Developer Agent Competition

**Prepared:** 2026-09-30 · **Final submission deadline:** 2026-12-02 11:59 PM UTC · **Paper track:** 2026-11-12
**Evidence base:** local competition doc snapshots (Overview/Data/Getting Started/Rules, 2026-09-29) + live leaderboard/discussion fetches + Gemma 4 model card + SWE-agent landscape research (2026-09-30). Full source log: `scratch/research-gemma4-agent-2026-09/report.md`.

---

## 1. Mission and score math

**Mission:** post-train and scaffold `gemma-4-31b-it-qat-w4a16-ct` into an autonomous SWE agent that resolves as many hidden-test issues as possible, packaged as `submission.zip` (ADK `agent.yaml` + prompts + sub-agents + skills + optional LoRA adapters ≤ 3 GiB).

**The arithmetic that drives every decision:**

| Quantity | Value | Consequence |
|---|---|---|
| Hidden test tasks | ~120 (≈60 public LB / ≈60 private) | +1 task = +1.67 pts on public LB |
| Current top score | 0.17 (≈10/60 public tasks) | Enormous headroom; nobody has solved >17% |
| Best public notebook | 0.12; a fork scored 0.08 | Run-to-run variance ≈ ±0.04 (±2–3 tasks) |
| Agent budget | 12 h total for all tasks, sequential | ≈ 6 min/task average incl. sandbox setup |
| Submissions | 1/day; ~63 days remain (Oct 1→Dec 2) | Each LB probe is precious; local eval must be trusted first |
| Validation time | Excluded from the 12 h | Self-testing with pytest is "free" score-wise, costs agent time only |

**Implication:** the winner will not be whoever trains the fanciest model by November — it will be whoever reliably banks the *easy half* of the tasks every single run. Reliability engineering > capability engineering, at least until 0.25+.

---

## 2. Ground truth: competition snapshot (verified)

| Fact | Detail | Source |
|---|---|---|
| Base model (only) | `gemma-4-31b-it-qat-w4a16-ct`: 30.7B dense, 60 layers, hybrid attention (1024 sliding window + global), 256K native ctx, served at 32,768 tokens, TP=4 on 4×L4, QAT w4a16 | Model card; Getting Started |
| Allowed brain parts | `agent.yaml` (ADK config), `!include` prompts, `sub_agents/*.yaml` (incl. `agent_tool` wrappers), `skills/<name>/SKILL.md` + `scripts/` + `resources/`, PEFT LoRA adapters (`adapter: <name>` per agent), `configs/sampling.yaml`, `eval_config.yaml` | Overview; Data |
| Harness tools (only these 9) | `run_command`, `submit_patch`, `get_status`, `read_file`, `edit_file`, `write_file`, `get_code_neighbors`, `search_similar_code`, `get_code_subgraph` | Overview |
| Per-task scoring | SWE-bench style: patch applied to `base_commit`, hidden `test_patch` run under pytest; PASS/FAIL | Overview; Data |
| `eval_config.yaml` fields read by scorer | Exactly 4: `timeout_seconds`, `max_tool_calls`, `max_time_minutes`, `max_turns`; defaults = **no limit** | Host, discussion 743063 |
| 12 h overrun | Currently **errors the whole submission** (fix to score 0 planned); host advises setting `max_time_minutes` as failsafe | Host, discussion 743063 |
| Task execution order | Sequential | Host, discussion 743063 |
| Train data | 129 tasks (fastapi/rich/requests/httpx) + snapshots + AST graphs + 256-d embeddings + offline wheels + docker specs + sample submission (22.42 GB) | Data |
| Distillation | External LLM teachers **allowed** if license-compliant (open-weight teachers are the low-ToS-risk route) | Staff, discussion 742807 |
| Winner obligation | OSI open-source license for winning code/adapters; full methodology write-up | Official Rules §2.5/2.8 |

### Harness quirks that ARE the current metagame (all host-acknowledged or reproduced)

| # | Quirk | Measured impact | Status 9/30 |
|---|---|---|---|
| Q1 | LoRA KV collapse: any adapter → KV cache 46,048→7,600 tokens; oversized requests hang silently | 99% of episodes exceed 7.6k prompt tokens → adapter submissions stall on most tasks; official sample-with-adapters FAILED outright | Host patching ("size loras to the submission") |
| Q2 | Double-JSON escaping of tool results | 62/299 `edit_file` calls failed `old_string not found`; controlled experiment: 22% failure vs 0% with raw text | Host: "Addressing now" |
| Q3 | Thinking-mode thoughts dropped between tool calls (vLLM reads `reasoning`, ADK sends `reasoning_content`) | Next-step prompt grows 0.35× (on) vs 1.1× (off) — cross-step reasoning lost, tokens wasted | Upstream vLLM #38488/#42664; scorer patch unknown |
| Q4 | `search_similar_code` returns **unbounded** node source (nodes up to ~130k chars) | 6/246 calls ended the task via `ContextWindowExceededError` | Unpatched; prompt-mitigable |
| Q5 | Output caps: `run_command`/`read_file` truncate at 5,000 chars | Heavy truncation of grep/test output — scripts must pre-filter | By design |
| Q6 | Local-vs-scorer grading gap: public wheelhouse missing `typing_inspection` etc.; wheel dedup forces starlette 1.6.0 | Locally, all 67 fastapi tasks fail collection and 54/67 fail **with gold patch**; local CV unreliable until fixed; matches reported CV/LB anti-correlation | Local-only; scoring env differs |

---

## 3. Battlefield analysis: where the points actually are

Score = P(navigate) × P(edit correctly) × P(submit a clean patch) × P(task actually gradable). multiplying four modest probabilities explains why everyone is stuck ≤0.17.

**Error taxonomy from community traces (62 failed edits, 636 shared baseline runs, our doc analysis):**

| Failure class | Est. share of lost tasks | Fix lever |
|---|---|---|
| No patch submitted (timeout, loop, gave up) | ~30–40% | Time manager + hard submit hygiene (Q3, budget caps) |
| `edit_file` escaping mismatches (Q2) | ~15–20% | Prompt protocol + write_file/run_command fallbacks |
| Context blowups / wasted context (Q4, Q5) | ~10% | Graph-tool discipline + lean prompts |
| Right file, wrong edit semantics | ~20% | Better localization (graphs, embeddings) + self-test loop |
| Ungradable/dead tasks (env, py3.13 drift) | unknown on hidden set; 12+/129 locally | Nothing — but do not burn minutes on them |

**Strategic conclusion — two-track strategy:**
- **Track 1 (banker, weeks 1–3):** prompts/scaffold-only submission (no adapters) engineered around Q1–Q5. Beaten-path reliability. Target 0.15 → 0.22.
- **Track 2 (differentiator, weeks 3–8):** trajectory harvesting + LoRA SFT (+ optional light RL) on the 5090, gated on the Q1 adapter-path fix being verified on the real scorer via a canary submission. Target 0.25 → 0.35+.

---

## 4. Brainstorm: candidate architectures

| Option | Description | Pros | Cons | Verdict |
|---|---|---|---|---|
| A. Prompt-only single agent | Tuned `system.md` + sampling + eval_config | Zero infra risk; immune to Q1; fastest to iterate | Ceiling ~0.20–0.25; model flails on hard localization | **Track 1 core** |
| B. Multi-agent + skills scaffold | Root coder + read-only `agent_tool` analyzer; skills for navigation/testing/patching | Deterministic scripts absorb Q2/Q4/Q5 pain; cheap context reuse | Token/time overhead; ADK-config-only wiring constraints | **Track 1 upgrade** |
| C. B + LoRA SFT | Fine-tune tool-calling + escaping robustness + navigation on harvested trajectories | Directly targets measured failure modes; Qwen3-Coder-30B proves 30B-class ceiling is high (67% SWE-bench Verified) | Blocked by Q1 until scorer fix; needs trajectory data flywheel | **Track 2 core** |
| D. C + RL (GRPO-style verifiable rewards) | RL against pass/fail reward on training repos | Highest ceiling (R2E-Gym recipe: +~10 pts over SFT on 32B) | Heavy infra; 6-week window is tight; reward hacking on flaky tests | Stretch goal, Sprint 5+ only if C lands early |
| E. Test-time scaling (best-of-N / self-verification) | Multiple attempts per task + internal test-based selection | Uses the 12 h budget where it pays; no training needed | Sequential scoring makes N small (2–3); needs fast per-attempt budget | Fold into B/C |

**Recommended path: A → B (parallel with data flywheel) → C → (D/E as upside).**

---

## 5. The Brain — design specification

### 5.1 Architecture (target submission tree)

```
submission.zip
├── agent.yaml                  # root LlmAgent "coder"; model: gemma-4-31b-it-qat-w4a16-ct
│                               #   instruction: !include prompts/system.md
│                               #   generate_content_config: !include configs/sampling.yaml
├── configs/sampling.yaml       # temperature, top_p, max_output_tokens, thinking OFF (Q3)
├── eval_config.yaml            # timeout_seconds / max_tool_calls / max_time_minutes / max_turns
├── prompts/
│   ├── system.md               # operating doctrine (see 5.2)
│   ├── analyzer.md             # read-only locator sub-agent doctrine
│   └── resources/*.md          # per-repo-family playbooks (loaded via skill resources)
├── sub_agents/
│   └── code_analyzer.yaml      # agent_tool: locate + rank candidate edit sites, returns
│                               #   file:line anchors + graph neighborhood summary ONLY
├── skills/
│   ├── repo_navigation/        # SKILL.md + scripts: safe-search wrappers (Q4), symbol maps
│   ├── test_runner/            # scripts: discover + run targeted pytest subsets, compact output
│   └── patch_hygiene/          # scripts: diff sanity checks, whitespace/escape lint, submit guard
└── adapters/                   # (Track 2 only, post-Q1-fix)
    └── main_lora/              # rank ≤ 128 (scorer cap), PEFT safetensors
```

### 5.2 System prompt doctrine (the actual "brain")

Seven operating rules, each mapped to a measured failure mode:

1. **Budget first.** Open every task by checking `get_status`; internal phase clock: ≤2 min locate, ≤2 min edit, ≤1 min verify, then submit. Never exceed per-task allowance; an imperfect patch beats none (patch ≠ 0 score only if submitted).
2. **Locate cheaply, verify expensively.** `get_code_neighbors` (names only — safe) and targeted `run_command` greps before any `search_similar_code`; when using semantic search, query **specific function/method names**, never broad class names (Q4); `read_file` with line ranges, never whole files.
3. **Escaping protocol (Q2).** Treat tool output as JSON-escaped twice. When using `edit_file`, choose short unique anchor lines without quotes/backslashes; derive `old_string` by mentally un-escaping twice; on `old_string not found`, retry once with corrected un-escaping, then **switch strategy**: `write_file` for small files, or `run_command` with a Python one-liner performing the replacement.
4. **Think in the open (Q3).** Working notes go in normal assistant content (which persists), never in the thinking channel (currently dropped). Thinking budget off/minimal in `sampling.yaml`.
5. **Minimal-diff discipline.** Match the repo's style; no drive-by refactors; comments only when the fix is non-obvious. Hidden tests grade behavior, not beauty.
6. **Self-verify when cheap.** If tests are discoverable (`ls tests/`, grep for the issue's symbols), run the *narrowest* pytest subset once after editing; if env is broken, do a syntax/import check (`python -m py_compile`) and move on — do not burn the task on a hostile env (Q6).
7. **Always land the plane.** Call `submit_patch()` explicitly before time expires even if unsatisfied; re-check `get_status` after submitting.

### 5.3 Tool policy matrix

| Tool | Use for | Never / caution |
|---|---|---|
| `run_command` | grep/rg pipelines with `head`, file listing, pytest subsets, Python edit scripts | Output truncates at 5k chars — always pipe through filters |
| `read_file` | Targeted ranges after locating | Whole big files; re-reading what's in context |
| `edit_file` | Small precise anchored edits | Lines with quotes/backslashes (Q2) unless protocol followed |
| `write_file` | New files; full rewrite of small files | Rewriting large files (token cost, regression risk) |
| `get_code_neighbors` | First-line localization (safe, names only) | — |
| `search_similar_code` | Semantic localization with **specific symbol queries** | Broad class-name queries (Q4 context death) |
| `get_code_subgraph` | Confirming blast radius of a candidate edit | Large node sets |
| `get_status` | Budget checks at task open + before submit | Ignoring it |
| `submit_patch` | Mandatory terminal action | Forgetting → guaranteed 0 for the task |

### 5.4 Time & budget management (`eval_config.yaml`)

- `max_time_minutes`: ~5–6 (failsafe vs 12 h total; 120 tasks × 6 min = 12 h — leave margin, e.g., 5.5 avg with early-submit drift)
- `max_tool_calls`: ~60–80; `max_turns`: ~40; `timeout_seconds`: 300 per call
- Scoring is **sequential** (host-confirmed): every stalled task eats global budget → all four caps are seatbelts, tune via local traces
- Two-phase internal budget in-prompt (locate ≤40% of spend) rather than more harness limits

### 5.5 Track 2 — learning loop (gated on Q1 fix)

1. **Trajectory harvesting:** run scaffold (Track 1) across the 129 public tasks ×N seeds + external repo tasks built R2E-Gym/SWE-Gym-style (procedural envs + fail-to-pass tests); keep only resolved episodes; log in the *exact* scorer message format (double-escaped observations included — Q2-aware training).
2. **Teacher distillation (license-safe):** open-weight teachers (e.g., Qwen3-Coder-class, Muse-class) generate candidate patches/trajectories for task statements; filter by executable tests; mix with self-generated successes. Staff-approved route.
3. **SFT LoRA v1:** rank 64–128 (scorer `max_lora_rank=128`), QLoRA on RTX 5090 32 GB (30.7B QAT base ≈ 17 GB weights → fits with grad checkpointing), TRL/Unsloth; target tool-call format fidelity, escaping robustness, submit discipline.
4. **SFT v2 → optional GRPO:** verifiable reward = hidden-test-style pass on held-out repos; only if v1 shows clean local gains and ≥2 weeks remain.
5. **Canary rule:** before any adapter reaches a scored submission, verify the adapter path on the scorer with a *throwaway-day* canary (e.g., minimal adapter + 1-turn agent) — Q1 has already FAILED the official sample once.

### 5.6 Validation strategy (make local numbers mean something)

| Layer | Protocol |
|---|---|
| Gradability audit | Gold-patch + no-patch control runs on every task before it enters any CV set; drop tasks failing gold (Q6) from headline CV, track separately |
| Wheelhouse fix | Rebuild local sandbox with missing wheels (`typing_inspection`, `inline-snapshot`, `dirty-equals`, …) and pinned per-task starlette to mirror scorer behavior as closely as possible |
| CV split | Stratify by repo + failure class; primary metric = resolved count on the *gradable* subset; secondary = near-miss count (tests improved but not passed) |
| Paired evaluation | Every prompt/config change runs the same task set with identical seeds; task-level win/loss table, not just totals |
| LB probing | ≤1/day, one variable per probe, mornings (queue/rerun slack); log every submission in a ledger with diff-from-previous |
| Variance control | Expect ±2–3 tasks noise; never conclude from a single LB delta < 0.05 |

---

## 6. Milestones

| ID | Date | Milestone | Acceptance criteria | Kill/pivot criteria |
|---|---|---|---|---|
| M0 | Oct 1 | Bare-metal env live | Day-0 checklist green on all 3 machines; vLLM serves the model locally; 2-task smoke eval runs end-to-end | If local eval impossible by Oct 4 → shift all eval to Kaggle, keep local for traces only |
| M1 | Oct 8 | Trustworthy local scoreboard | Gradability audit done; ≥1st scored submission (scaffold v0+) on LB; trace pipeline logging every episode | LB < 0.05 after 3 submissions → rebuild on romanrozen-style baseline and re-increment |
| M2 | Oct 15 | Reliable loop v1 | Doctrine prompts + tool policy shipped; local paired eval +5 tasks vs M1; LB ≥ 0.15 | — |
| M3 | Oct 22 | Scaffold v2 (skills + analyzer + budget caps) | LB ≥ 0.18; zero tasks lost to context blowups or no-submit in local runs | LoRA path still broken + LB plateau → double down on scaffold polish |
| M4 | Oct 29 | Trajectory flywheel + LoRA v1 trained | ≥1.5k resolved trajectories; SFT LoRA beats base paired-locally by ≥3 tasks | Q1 unfixed on scorer → keep adapters local-only; pivot budget to test-time scaling |
| M5 | Nov 5 | Distill-and-scale | SFT v2 (distilled mix) local +5 tasks over v1; LB ≥ 0.25 with best config | RL spike fails → freeze SFT line |
| M6 | Nov 12 | Consolidation + paper | Two finals candidates frozen; paper submitted (bonus track) | — |
| M7 | Dec 2 | Final submission | 2 finals selected on evidence; winner-docs skeleton ready | — |

---

## 7. Master checklist

### Phase A — Spec & intel (continuous, owner: you)
- [ ] Read `HARNESS_README.md` end-to-end from the dataset (49 kB — the authoritative format/behavior doc)
- [ ] Join the official Discord; watch discussions daily (host patches land there first)
- [ ] Maintain the submission ledger (date, config hash, LB, delta, hypothesis)
- [ ] Track host patch status for Q1 (LoRA KV), Q2 (escaping), Q3 (thinking drop) — re-run canaries after each confirmed patch

### Phase B — Environment & data (Day 0–2)
- [ ] Windows 11 + WSL2 + Docker Desktop on Main; NVIDIA driver ≥ CUDA 12.8 class; RTX 5090 vLLM smoke test (QAT model, TP=1, 32k ctx)
- [ ] Kaggle CLI authenticated; competition rules accepted; dataset (22.42 GB) + model + wheelhouse mirrored locally
- [ ] `swegemma` + `adk-submission` + `adk-eval-core` installed from wheelhouse (WSL2)
- [ ] `swebench-sandbox:latest` image builds; 2-task smoke eval completes
- [ ] AUX1 (laptop): dev/CI/packaging rig; AUX2: Docker grading + trace storage rig
- [ ] Git repo scaffold: `agent/`, `eval/`, `traces/`, `data-tools/`, `submissions/` (one dir per submission, immutable)

### Phase C — Baseline & audit (Sprint 1)
- [ ] Submit scaffold v0 early (bank a score; exercise the pipeline)
- [ ] Gradability audit: gold/no-patch controls on all 129 tasks; publish internal table of dead tasks
- [ ] Rebuild local wheels to close Q6 gap; re-run controls
- [ ] Trace logger capturing full message streams (for Q2-aware training data later)

### Phase D — Brain v1 (Sprint 2)
- [ ] `system.md` doctrine v1 (7 rules); sampling.yaml tuned (thinking off per Q3)
- [ ] Escaping protocol implemented + verified on the 39 known escaping-failure cases
- [ ] Graph-tool discipline prompts (Q4/Q5) verified: zero context-blowup episodes on 129-task local run
- [ ] eval_config caps set; zero no-submit episodes locally
- [ ] LB probes: one variable at a time; target ≥ 0.15

### Phase E — Brain v2 (Sprint 3)
- [ ] `code_analyzer` sub-agent (agent_tool) live; localization hit-rate up vs v1 (task-level paired)
- [ ] Skills: `repo_navigation`, `test_runner`, `patch_hygiene` with sandbox-tested scripts
- [ ] Per-task time allocation tuned from trace distribution; LB target ≥ 0.18

### Phase F — Learning loop (Sprints 4–6)
- [ ] Trajectory harvest ≥1.5k resolved episodes (public + external procedural tasks)
- [ ] Distillation pipeline with open-weight teacher; license log kept
- [ ] SFT LoRA v1/v2 trained on 5090; paired local eval gates every adapter
- [ ] Scorer canary proves adapter path (Q1 fixed) BEFORE any scored adapter submission
- [ ] (Stretch) GRPO on held-out repos; (Always) best-of-2 self-verification if budget allows

### Phase G — Endgame (final fortnight)
- [ ] Freeze two finals (diversified: scaffold-only + adapter, if both proved)
- [ ] Full 129-task final regression ×3 seeds on each finalist
- [ ] Winner documentation + OSI license hygiene + methodology write-up
- [ ] Submit finals ≥48 h before deadline (queue risk); verify both scored

---

## 8. Risk register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Q1 LoRA path still broken at endgame | Medium | High (kills Track 2) | Adapter-free finals candidate always ready; canary before betting |
| Harness patches shift baseline mid-comp | High | Medium | Re-probe after every confirmed patch; keep configs versioned |
| CV/LB anti-correlation persists | Medium | High | Gradability-audited CV + paired probes; trust task-level evidence |
| Local env misleads (Q6 residue) | Medium | Medium | Gold controls every eval run; scorer-mirroring wheels |
| Kaggle queue/quota bites (13 h queues, 2× quota bugs) | High | Medium | Submit mornings; local-first iteration; budget 2–3 GPU sessions/week |
| Run-to-run variance masks real deltas | High | Medium | Paired task-level evals; never react to Δ<0.05 on LB |
| Overfitting to public 4 repos | Medium | High | External procedural tasks; holdout repos; minimal-diff doctrine |
| Licensing/ToS misstep (distillation) | Low | Disqualification-level | Open-weight teachers only; keep license log; staff posts on record |

---

## 9. Source anchor list

1. Local snapshots: `input/kagglecomp/docs/markdown/` (Overview, Data, GettingStarted, OfficialRules — fetched 2026-09-29)
2. Live leaderboard + 15 discussion threads (fetched 2026-09-30; IDs in research report)
3. Gemma 4 model card — ai.google.dev/gemma/docs/core/model_card_4
4. ADK Agent Config — adk.dev/agents/config/ + `AgentConfig.json` schema (google/adk-python)
5. R2E-Gym (arXiv:2504.07164), SWE-Gym (GitHub), swebench.com leaderboards, Qwen3-Coder coverage
6. vLLM RTX 5090/WSL2 setup threads (vllm discuss; jvadura/vLLM-Blackwell)

*Companion document: `02-master-plan-day0-six-sprints.md` (execution calendar).*


---

<!-- ====================================================================== -->
<!-- FILE: 02-master-plan-day0-six-sprints.md -->
<!-- ====================================================================== -->

# Task 2 — Master Execution Plan: Day 0 Bare-Metal Setup Through Six Sprints to Final Submission

**Prepared:** 2026-09-30 · **Companion:** `01-roadmap-and-master-checklist.md` (strategy, milestones, risk register)
**Calendar anchoring:** Day 0 = Thu Oct 1, 2026 → Sprint 1 begins Fri Oct 2 → Sprint 6 ends Thu Nov 12 (paper-track deadline) → final stretch through Wed Dec 2, 11:59 PM UTC.
**Submission-days budget:** 63 (1/day Oct 1–Dec 2; final picks don't consume daily slots).

---

## 1. Machine roles and budget

| Rig | Hardware | Role | GPU-hours plan |
|---|---|---|---|
| **Main** — PowerSpec G914 | Ryzen 9 9950X3D, 64 GB DDR5-6000, **RTX 5090 32 GB**, 2 TB NVMe, Win 11 Pro | vLLM serving (local eval + trace harvesting), QLoRA SFT/GRPO training, primary dev box | ~14 h/day serving or training; single-tenant — schedule, don't interleave |
| **AUX 1** — ProArt P16 | Ryzen AI 9 HX 370, **RTX 4060 8 GB**, 32 GB, 1 TB, Win 11 Home | Portable dev: prompt editing, trace analysis, packaging CI (3 GiB + extension asserts), submission ledger, Discord/discussion watch | CPU-mostly; occasional small-model sanity checks |
| **AUX 2** — ROG G15CF | i7-12700F, 64 GB, 512 GB SSD + **2 TB HDD**, **RTX 3080 10 GB**, 550 W | Clean-room grading: Docker sandbox + wheelhouse QA + gold-patch gradability audits; long-horizon trace/dataset storage (2 TB HDD) | CPU + light GPU; runs overnight batch audits |
| **Kaggle** | L4 ×4 (scorer replica) | Weekly scored submissions + occasional full-size local-vs-scorer parity checks | Quota ~30 GPU-h/wk nominal; assume ~½ effective (double-deduction reports); plan ≤3 L4x4 sessions/wk |

**Compute budget ledger (weekly target):**

| Consumer | Slot | Notes |
|---|---|---|
| Kaggle scored run (~14.5 h wall) | 2–3× per week, launched morning | Submit after "Save Version"; infra-failed runs rerun free |
| Local vLLM eval (129 tasks ≈ 12 h sim) | 1–2 nights on Main | Replicates sampling/compaction; free iteration |
| Trace harvesting (seeds × tasks) | Weekend blocks on Main | Feeds SFT data flywheel from Sprint 3 |
| QLoRA SFT run (30B, 1–3 epochs) | 6–12 h × few iterations on Main | Only from Sprint 4 |
| Gradability audits | AUX 2 nightly | Gold-patch controls, wheel QA |

---

## 2. Day 0 — Thursday Oct 1: bare-metal bring-up

Goal by end of day: **all three machines hand back control with the stack proven end-to-end: model served locally on Main, 2-task smoke eval completed, submission packaged.**

Order matters: start the 22.42 GB dataset + model downloads first (they run while you install everything else).

### 2.1 Main — primary rig (the long pole; ~5–7 h)

| Slot | Task | Done when |
|---|---|---|
| 0:00 | BIOS: enable EXPO (DDR5-6000) + Resizable BAR; install latest chipset drivers + NVIDIA driver (CUDA 12.8 class or newer, e.g. 57x.xx+); Windows Update fully green; power plan High Performance | `nvidia-smi` shows the 5090 @ driver rev |
| 0:30 | Base tools: Git for Windows, VS Code (+ WSL/Remote extensions), Windows Terminal, PowerShell 7 | `git --version` OK |
| 0:45 | **Kick off downloads** (background, to D: NVMe): Kaggle CLI (`pip install kaggle`), `kaggle competitions download -c gemma-4-developer-agent`, model download (HF), wheelhouse dataset | Progress bars running; verify `.kaggle/kaggle.json` auth first |
| 1:00 | WSL2: `wsl --install -d Ubuntu-24.04`; set WSL2 memory cap 48 GB + swap in `.wslconfig`; enable nested virtualization off (not needed); `wsl --update` | `wsl -l -v` shows VERSION 2 |
| 1:30 | Inside WSL2: build-essential, python 3.12 venv, git config, SSH key for GitHub | `gcc --version` OK |
| 2:00 | Docker Desktop (WSL2 backend); allocate ≥12 CPUs/32 GB; then pull/build the vLLM Blackwell-class image (CUDA 12.8 + PyTorch cu128; e.g., jvadura/vLLM-Blackwell or upstream ≥ the version with GB202 support) | `docker run --gpus all nvidia/cuda:12.8.x-base nvidia-smi` sees the GPU |
| 2:30 | **vLLM smoke test:** serve `gemma-4-31b-it-qat-w4a16-ct` TP=1, `max_model_len 32768`, `--tool-call-parser gemma4 --reasoning-parser gemma4`, `enable_lora` `max_lora_rank 128`; first-token latency sanity | curl `/v1/models` + one chat completion returns |
| 3:30 | Install eval stack in WSL venv from the wheelhouse (same 41-wheel, `--no-deps --force-reinstall` procedure as Getting Started §1): `swegemma`, `adk-submission`, `adk-eval-core` | imports clean |
| 4:00 | Build `swebench-sandbox:latest` from dataset docker specs; verify container runs pytest | sandbox hello-world passes |
| 4:30 | Repo scaffold (git init): `agent/` (mirrors submission tree), `eval/` (configs + scripts), `traces/`, `data-tools/`, `submissions/`, `docs/`; copy `sample_submission` in; commit | clean tree, pushed to private GitHub |
| 5:00 | **Milestone M0 test:** run the Getting-Started 2-task eval locally against local vLLM | both tasks complete with `resolved=` verdicts (False is fine today); zip package asserts pass (≤3 GiB, extensions) |

### 2.2 AUX 1 — laptop (~1.5 h, can overlap)

| Slot | Task | Done when |
|---|---|---|
| 1 | Windows Update, NVIDIA driver, BIOS if prompted | green |
| 2 | Git, VS Code, PowerShell 7, WSL2 + Docker Desktop (small) | `docker run hello-world` |
| 3 | Kaggle CLI + auth; clone the repo; Python 3.12 venv; install wheelhouse stack (CPU mode) | `python -c "import swegemma"` OK |
| 4 | Take ownership of: submission packaging QA script (3 GiB + extension whitelist + zip determinism) and the submission ledger (CSV: date, config hash, hypothesis, LB, delta, notes) | ledger created with columns |

### 2.3 AUX 2 — grading rig (~2 h, start early evening; audits run overnight)

| Slot | Task | Done when |
|---|---|---|
| 1 | Windows Update, NVIDIA driver (3080), verify 550 W PSU under combined load is stable in practice; keep HDD for `/data` | `nvidia-smi` OK |
| 2 | Docker Desktop (WSL2 backend); mount 2 TB HDD as `D:\data` (traces + datasets); 512 GB SSD for OS + images | mounts persist |
| 3 | Pull sandbox image; stage dataset (copy from Main over 5GbE LAN or re-download) | `tasks.jsonl` readable |
| 4 | **Overnight job:** gradability audit seed — apply gold patches + run hidden-style tests for the 129 public tasks (this is the control run that exposes the wheel/starlette gaps from Q6) | morning: table of pass/fail-with-gold per task |

### 2.4 Day 0 exit checklist

- [ ] Main: vLLM serving works; 2-task eval ran; zip packaged under 3 GiB
- [ ] AUX1: dev + packaging rig ready; ledger initialized
- [ ] AUX2: sandbox + dataset staged; gold-control batch launched
- [ ] Kaggle: rules accepted, CLI works, first notebook fork of romanrozen's baseline saved (ready for Sprint 1 probe)
- [ ] Repo: initial commit + private remote
- [ ] Join official Discord; bookmark Rules/Data/GetStarted + leaderboard refresh habit

---

## 3. Sprint calendar at a glance

| Sprint | Dates | Theme | Target LB | Submission cadence |
|---|---|---|---|---|
| S1 | Oct 2–8 | Trustworthy scoreboard + first blood | 0.08–0.12 | v0 baseline Oct 3; audit-driven probes after |
| S2 | Oct 9–15 | Reliable loop v1 (doctrine prompts) | ≥0.15 | 4–5 probes, one variable each |
| S3 | Oct 16–22 | Scaffold v2: skills + analyzer + budgets | ≥0.18 | 3–4 probes + 1 parity run |
| S4 | Oct 23–29 | Data flywheel + LoRA v1 (local) | 0.18–0.22 | adapter canary only if Q1 fix confirmed |
| S5 | Oct 30–Nov 5 | Distill-and-scale + eval tuning | ≥0.25 | 2–3 probes of best configs |
| S6 | Nov 6–12 | Consolidate, harden, paper | ≥0.25 stable | finals candidates A/B; paper Nov 12 |
| Final | Nov 13–Dec 2 | Two finals, winner docs, buffer | — | final 2 picks ≥48 h before deadline |

---

## 4. Sprint 1 (Oct 2–8) — Trustworthy scoreboard + first blood

**Goal:** make local numbers trustworthy and get a scored baseline on the board. No cleverness yet.

| Day | Work | Output |
|---|---|---|
| Oct 2 (F) | Analyze AUX2 gold-control results; classify every task: gradable / env-dead / version-gated / flaky | `docs/task-audit.md` v1 |
| Oct 3 (Sa) | Run romanrozen-style prompts-only baseline through **Kaggle notebook** end-to-end; Save Version → submit | **First LB score** (expect 0.08–0.12) |
| Oct 4 (Su) | Build corrected local wheel layer: add missing wheels (`typing_inspection`, `inline-snapshot`, `dirty-equals`, …), pin per-task starlette; re-run gold controls on AUX2 | corrected gradable task set (target: fastapi gold failures → 0) |
| Oct 5 (M) | Trace logging: wrap `Evaluator` to dump full message streams (prompt, tools, escaped outputs) per task | `traces/` populated from 129-task local run (overnight on Main) |
| Oct 6 (Tu) | Error taxonomy v1 from traces: no-submit %, edit-fail %, context-blowup %, wrong-file % | taxonomy table + top-5 fix list |
| Oct 7 (We) | Fix #1 cheaply: add hard time/submit discipline to `system.md` (rules 1 & 7 of the doctrine); local paired run on 40-task subset | paired win/loss vs baseline |
| Oct 8 (Th) | Submit improved v0.1; log ledger; review M1 milestone | LB ≥ 0.12 expected; M1 gate |

**Exit criteria:** gradability-audited CV set live; ≥1 scored submission; trace pipeline proven; taxonomy written.
**If local eval still impossible:** pivot per M0 contingency — all eval via Kaggle (2 sessions/wk), local only for traces.

---

## 5. Sprint 2 (Oct 9–15) — Reliable loop v1 (the doctrine brain)

**Goal:** implement the full 7-rule doctrine (Roadmap §5.2) and prove each rule moves paired local numbers.

| Day | Work | Output |
|---|---|---|
| Oct 9 (F) | Write `system.md` v1 fully (all 7 rules, concrete tool examples); sampling.yaml: thinking **off** (Q3), temp 0.2, top_p 0.95 | agent v1.0 |
| Oct 10 (Sa) | Escaping protocol (Q2): anchor-line rules + double-unescape + one-retry-then-switch ladder; replay the 39 known escaping failures offline against the protocol | ≥80% of the 39 cases pass |
| Oct 11 (Su) | Graph-tool discipline (Q4/Q5): specific-symbol queries, `get_code_neighbors` first, filtered `run_command` patterns | zero context-blowups on 129-task run (overnight) |
| Oct 12 (M) | eval_config caps: `max_time_minutes 5.5`, `max_tool_calls 70`, `max_turns 40`, `timeout_seconds 300`; verify no no-submit episodes | tuned config |
| Oct 13 (Tu) | Local full paired eval: v1.0 vs v0.1, same seeds, task-level win/loss | paired report |
| Oct 14 (We) | Kaggle probe: submit best local config; ledger | LB datapoint |
| Oct 15 (Th) | Second probe varying exactly one thing (e.g., tool policy tightened); M2 review | M2 gate: local +5 tasks, LB ≥0.15 |

**Exit criteria:** doctrine agent beats v0.1 locally by ≥5 tasks paired; LB ≥0.15 or diagnosed why not (variance vs real gap).

---

## 6. Sprint 3 (Oct 16–22) — Scaffold v2: skills, sub-agent, budgets

| Day | Work | Output |
|---|---|---|
| Oct 16 (F) | Skill `repo_navigation`: SKILL.md + scripts (safe-search wrapper emitting filtered, capped results; symbol-map builder) | skill in `agent/skills/`, sandbox-tested |
| Oct 17 (Sa) | Skill `test_runner`: discover narrowest pytest subset; compact failure summaries (<2k chars) | skill live |
| Oct 18 (Su) | Skill `patch_hygiene`: pre-submit lint (diff whitespace, escape sanity, py_compile) | skill live |
| Oct 19 (M) | `sub_agents/code_analyzer.yaml` read-only locator returning file:line anchors only | localization hit-rate measured on 30-task subset |
| Oct 20 (Tu) | Overnight full local run v2.0 vs v1.x paired; tune per-task time allocation from trace time-distribution | v2.0 report |
| Oct 21 (We) | Kaggle probe (v2.0); ledger | LB ≥0.18 target |
| Oct 22 (Th) | **Adapter-path recon:** re-read host/Discord on Q1 patch; if fixed, design the Sprint-4 canary; M3 review | M3 gate |

**Exit criteria:** zero no-submit and zero context-blowup episodes locally; LB ≥0.18; adapter path status known.

---

## 7. Sprint 4 (Oct 23–29) — Data flywheel + LoRA v1 (local only)

| Day | Work | Output |
|---|---|---|
| Oct 23 (F) | Trajectory pipeline: convert logged resolved episodes → SFT chat format in the **exact** scorer message schema (double-escaped observations; Q2-aware) | dataset builder script |
| Oct 24 (Sa) | Harvest batch 1: Main serves vLLM, run 129 tasks × 3 seeds overnight; AUX2 stages external-repo task builders (R2E-Gym/SWE-Gym style, procedural envs + fail-to-pass tests) | ≥400 resolved trajectories |
| Oct 25 (Su) | QLoRA rig: Unsloth/TRL on 5090 (QAT base ≈17 GB weights + LoRA r64 + grad ckpt + short seqs); smoke train 200 steps | loss curve sane, adapter merges + serves in local vLLM |
| Oct 26 (M) | Teacher setup (license-safe open-weight coding model) for distillation candidates; test-filter pipeline (patch must pass fail-to-pass tests) | distill pipeline v0 |
| Oct 27 (Tu) | SFT LoRA v1 full run (6–12 h); **paired local eval adapter vs base** on fixed 40-task subset | paired report; gate: ≥ +3 tasks |
| Oct 28 (We) | If Q1 fixed on scorer: **canary submission** (minimal adapter + 1-turn agent) — spend this day's slot deliberately | canary verdict: adapter path alive or not |
| Oct 29 (Th) | Buffer / iterate v1.1; M4 review | M4 gate |

**Exit criteria:** ≥1.5k trajectory pipeline flowing (cumulative), LoRA v1 beats base locally, adapter-path status resolved on scorer.
**Kill-switch (M4):** Q1 unfixed → adapters stay local; reallocate GPU to test-time scaling (best-of-2 with self-verification in skills).

---

## 8. Sprint 5 (Oct 30–Nov 5) — Distill-and-scale + tuning

| Day | Work | Output |
|---|---|---|
| Oct 30 (F) | Distillation batch: teacher patches on external tasks → verified trajectories → mix with self-generated (2:1 self:teacher to preserve harness-native format) | dataset v2 |
| Oct 31 (Sa) | SFT v2 full training run (overnight on Main) | v2 checkpoint + training report |
| Nov 1 (Su) | Paired eval v2 vs v1 on fixed subset; holdout audit: freeze a 20-task holdout (never in any SFT data) + leakage check across trajectory sets | +3–5 tasks target; clean holdout registered |
| Nov 2 (M) | Test-time scaling experiment: best-of-2 with internal selection by test outcome, per-task budget split | paired eval |
| Nov 3 (Tu) | Sampling sweep: temp {0.0, 0.2, 0.4} × thinking {off} on 40-task subset; compaction params (threshold 14336 → try 12k/16k) | tuning table |
| Nov 4 (We) | Kaggle probe: best overall config | LB ≥0.25 target |
| Nov 5 (Th) | Second probe (runner-up config) to de-risk variance; M5 review | M5 gate |

**Exit criteria:** SFT v2 > v1 locally; LB ≥0.25 with the best config or a clear diagnosis; finals shortlist of 2–3 configs.

---

## 9. Sprint 6 (Nov 6–12) — Consolidation, hardening, paper

| Day | Work | Output |
|---|---|---|
| Nov 6 (F) | Robustness pass: retry-on-infra-error behavior, zip determinism, eval_config margins (headroom for scorer variance) | hardened agents |
| Nov 7 (Sa) | Full 129-task local regression ×2 seeds on top-2 configs (overnight ×2 rigs) | regression report |
| Nov 8 (Su) | **Entry/merge deadline awareness:** Nov 25 is the hard date — recruit/merge now if you want a team of >1 before the cut | team decision |
| Nov 9 (M) | Kaggle probe both finalists once each (2 days: Nov 9 + Nov 10) | two LB datapoints each |
| Nov 10 (Tu) | (probe 2) + begin paper draft (methodology, ablations from ledger — your paired tables are the evidence) | draft v0 |
| Nov 11 (We) | Paper polish + figures (taxonomy → fix → paired delta story) | paper v1 |
| Nov 12 (Th) | **Submit paper track ($35K)**; freeze code state as `finals-A`/`finals-B` candidates | paper in; M6 gate |

**Exit criteria:** two frozen candidates; paper submitted; regression evidence recorded.

---

## 10. Final stretch (Nov 13 – Dec 2)

| Window | Work |
|---|---|
| Nov 13–19 | Watch LB + harness-change channel. If hosts re-score or patch (Q1/Q2/Q3), re-run finalists once each and adjust. Keep daily optional probes only when you have a falsifiable hypothesis with paired local evidence — pure LB fishing wastes quota and misleads. |
| Nov 20–25 | Decide the **2 final picks** (rules: 2 selections; daily submissions still run). Diversification preference: scaffold-only finalist + adapter finalist (if canary-proven). Verify each finals zip: 3 GiB, extension whitelist, `agent.yaml` schema, adapter dirs consistent with `adapters/` references. |
| Nov 26–30 | Quiet week: no risky changes; final regression re-run; write winner documentation skeleton (methodology, licenses: OSI-clean code + adapter licensing note) — required of winners. |
| Dec 1–2 | Submit both finals **≥48 h before** Dec 2 11:59 PM UTC where possible (i.e., by Nov 30); confirm both scored; stop. |

**Finals-selection rule:** pick by evidence = paired local wins + two independent LB datapoints each; tie-break toward the config with fewer moving parts (fewer harness-quirk dependencies).

---

## 11. Standing operating cadence (from Sprint 1 onward)

| Rhythm | Action |
|---|---|
| Daily (15 min, AUX1) | Discord + discussion skim; ledger update; host-patch watch (Q1/Q2/Q3) |
| Every submission | One falsifiable hypothesis; config hash logged; morning submit; Save Version before submit; verify scored (not infra-failed) |
| Weekly (Thu) | Milestone review vs gate criteria; risk register refresh; compute-budget check (Kaggle quota left, Main GPU plan for weekend) |
| Every local eval | Gold-patch control spot-check (10 tasks) to confirm grading env still sane |
| Trace hygiene | Every run archived to AUX2 HDD with config hash — the dataset flywheel depends on it |

**Submission SOP (AUX1 owns):** package → asserts (size/extensions/schema) → zip hash → upload → confirm run started → record in ledger → verify score next morning → archive config + zip.

---

## 12. What "winning" looks like, quantified

| Checkpoint | Public LB |
|---|---|
| Beat best public notebook | > 0.12 (Sprint 1–2) |
| Match current #3 | ≥ 0.15 (Sprint 2) |
| Match current #1 | ≥ 0.17 (Sprint 3) |
| Clear the field decisively | 0.25–0.35 (Sprints 5–6: reliability + fine-tune compounding) |
| Paper-track shot | methodology write-up Nov 12 ($35K pool) |

The plan assumes the field improves ~1 task/week on average; the compounding levers (doctrine reliability + harness-native fine-tuning) are the ones competitors without a local 32 GB GPU and a clean grading rig cannot easily copy.


---

<!-- ====================================================================== -->
<!-- FILE: 03-discussion-board-intel.md -->
<!-- ====================================================================== -->

# Discussion-Board Intel — Kaggle Gemma 4 Developer Agent

**Compiled:** 2026-09-30, ~19:30 UTC (two sweeps: ~19:00 UTC primary + ~19:25 UTC delta)
**Coverage:** 22 of 22 visible forum threads captured with full bodies — every thread ID shown by the board's default ("active") and "recently created" listings, plus 743213 (referenced from another thread; no longer listed). Known gaps: the listing caps at 20 threads per view, so older inactive threads beyond that cap could exist; one participant topic (vLLM "does not support LoRA yet" startup error) was deleted by its author before capture; Kaggle staff do not monitor the official Discord, so the forum is the authoritative channel. Raw dumps: `scratch/research-gemma4-agent-2026-09/scratch/pages/` (`t-*.md`, `t2-*.md`, `t3-*.md`).

**Confidence key:** claims below are host-stated (Kaggle staff, highest confidence), independently reproduced by ≥2 participants, single-participant repro, or unverified.

---

## 1. TL;DR — the ten most decision-relevant facts

| # | Fact | Source | Status |
|---|---|---|---|
| 1 | Hidden test tasks validate at **100% with a gold-patch submission** — the scoring environment is clean; all ~120 tasks are solvable | Host (Ryan Holbrook), 744370 | Host-stated |
| 2 | Local CV breakage (missing wheels, starlette pinning) is local-only; Docker and Kaggle-subprocess sandboxes behave differently from each other AND from the scorer | 744370, 743973 | Multi-repro |
| 3 | LoRA path has **two distinct bugs**: KV-cache collapse (46k→7.6k tokens) and silent adapter zeroing; zeroing fix landed in wheelhouse v23 (current v25), KV fix promised but not confirmed deployed | 744331, 743508 | Host-stated + multi-repro |
| 4 | Thinking-mode drop: patch was "incoming" as of ~18:30 UTC 9/30; **existing submissions will NOT be re-scored** (compute constraints) | 744354 | Host-stated |
| 5 | Double-JSON escaping: host "addressing now" (9/29); raw-text rendering eliminated 100% of failures in a controlled experiment; single-JSON was WORSE (62%) | 744272 | Host-stated + repro |
| 6 | `search_similar_code` unbounded output: host will cap it "like other tools" (~19:00 UTC 9/30) | 744577 | Host-stated |
| 7 | 12 h overrun still errors the whole run; fix to score unfinished tasks as 0 is planned but not confirmed live; host recommends a `max_time_minutes` failsafe | 743063 | Host-stated |
| 8 | Task order is fixed/sequential; whether public tasks come first is **unanswered** — front-loading time on early tasks is a known unaddressed gaming concern | 743063 | Open question |
| 9 | Distillation from external LLMs is allowed if license-compliant; community consensus: closed-API teachers violate provider ToS, open-weight teachers are safe | 742807 | Host-stated |
| 10 | L4×4 queues run 4–13+ h; GPU quota is deducted at ~2× wall-clock; scoring takes ~12–14.5 h; infra-failed submissions are rerun without losing the day | 743683, 743600, 744054 | Multi-repro |

---

## 2. Host commitments tracker (watch-list for plan gates)

| Issue | Host commitment | When stated | Verified live? |
|---|---|---|---|
| Q3 thinking thoughts dropped | "vLLM fixed this in a later version. I'll add a patch accordingly and try to deploy later today" + follow-up "It's incoming"; no re-score of existing submissions | 9/29–9/30 18:33 UTC | Not yet — re-probe before tuning thinking mode |
| Q1b LoRA silent zeroing | "The zeroing fix landed in v23 of the wheelhouse dataset (now on v25)... please let me know if it seems otherwise" | 9/30 ~14:30 UTC | Partially — participant repro on v25 still showed no effect, with a noted caveat (lora_A possibly zero in sample adapter); retest pending |
| Q1a LoRA KV collapse | "I will patch to set the loras parameters based on the submission... I think I have a workaround" | 9/30 ~16:05 UTC | No — no scored adapter submission has succeeded yet |
| Q2 double-JSON escaping | "Thanks for the report. Addressing now." | 9/29 | No |
| Q4 search_similar_code blowup | "I will limit to max_stdout_chars like other tools." | 9/30 ~18:35 UTC | No |
| 12 h overrun errors whole run | Fix planned: score unfinished tasks as 0; meanwhile set `max_time_minutes` | 9/24 (thread), re-asked 9/28–29 | No — still open as of 9/29 |
| 9/26 mass "resource" failures | Fixed; affected submissions rerun Monday 9/28 without losing the day; rescore then **paused** for L4×4 queueing | 743683 (pinned) | Rerun status unclear — check before assuming old scores are final |
| Wheelhouse publication | Published "Gemma 4 Developer Agent Wheelhouse" dataset + Getting Started notebook | 742882 | Yes |
| Hidden-task gradability | "I can confirm that the hidden tasks validate at 100% with a 'gold patch' submission." | 744370 | Host-stated |
| Per-task official docker images | Request; no host reply | 744355 | — |

---

## 3. Scoring mechanics and rules

From 743063 (staff answers) and follow-ups:

- Tasks run **sequentially**; no concurrency knob.
- The scorer reads **exactly four** `eval_config.yaml` fields: `timeout_seconds`, `max_tool_calls`, `max_time_minutes`, `max_turns`. Defaults = **no limit**.
- Hitting the 12-hour global limit **errors the entire submission** today; the planned fix scores unfinished tasks as 0. Host: "You may want to set max_time_minutes to something moderate as a failsafe."
- Unanswered strategic questions (raised by Oleksii Zhukov, 9/28): is "solve as many as possible within 12 h, however split" the intended objective; is the task order identical every run; are public/private tasks interleaved (front-loading risk if public-first); would unattempted tasks get negative score. No host reply as of the 9/30 sweep.
- Distillation (742807, staff answer pinned by Ashley Oldacre): external-LLM training data is allowed **if teacher-model license terms are complied with** and outputs don't conflict with competition rules. Winner obligations (OSS release under §2.5/2.8) were part of the question; the staff answer didn't carve out an exception — treat released artifacts as needing license-clean lineage. Community color: Justin Scott (open-source KD tool "Ghostwriter", github.com/jscott3201/ghostwriter-rs) — closed-source distillation is "very much against their ToS"; another participant plans to start from GLM 5.3 as a teacher.

## 4. Model-serving bugs (the LoRA story, complete)

Three separate failure layers — all must be clear before any adapter submission:

1. **Startup refusal (historical):** stock PyPI vLLM 0.19.1 fails `--enable-lora` for Gemma4ForConditionalGeneration ("does not support LoRA yet"). Only the patched vLLM in the official wheelhouse adds SupportsLoRA. Local adapter testing must install that exact wheel (743213, Carson Rodrigues — currently 9th). The original topic was deleted; fact preserved via quoting.
2. **Silent zeroing (743508, Whisper Last + Abdul Muiz):** Gemma4 registers every decoder layer twice (direct `layers.N` + YOCO alias `self_decoder.decoder_layers.N`). `activate_adapter` sets LoRA weights under the first name, then `reset_lora` under the alias **zeroes them**. Symptom: 240× "Successfully loaded" then 240× "No LoRA weights found... skipping" in debug logs; outputs identical to base at temperature 0. Host: fix landed in wheelhouse **v23** (current **v25**) — but the latest participant repro on v25 still saw no effect (caveat: sample adapter's lora_A may be all zeros). Verify with a "loud" adapter (both A and B randomized) before trusting.
3. **KV-cache collapse (744331, Adithya Giridharan + whoami):** any mounted adapter → vLLM preallocates `max_loras=8 × max_lora_rank=128` LoRA buffers, dropping KV from 46,048 to **7,600 tokens** (1.74 GiB/GPU; ~246 kB KV per token per GPU at TP4). Prompts >7.6k hang silently (scheduler_reserve_full_isl never frees). 99% of episodes exceed 7.6k prompt tokens → adapter submissions stall on nearly every task. **Submissions without adapters never get `--enable-lora` and are unaffected.** Host: will size LoRA params to the submission (promised 9/30 ~16:05 UTC; not confirmed deployed).
4. Adapter addressing (743213, Violet Notes): `adapter: <name>` rewrites the agent model to a LiteLLM id `openai/<adapter-name>`, served only if the scoring side registers it via `--lora-modules`. The official sample_submission **with adapters FAILED** when submitted byte-for-byte (9/25). No public adapter submission has ever scored.

**Implication:** the LoRA track stays gated on a cheap canary submission until layers 2–3 are confirmed fixed on the scorer.

## 5. Harness/tool behavior intel

- **Escaping (744272, Whisper Last + D A M):** tool results are JSON-encoded twice (swegemma returns a JSON string → ADK wraps as `{"result": ...}` → LiteLLM re-serializes). Measured: 62/299 `edit_file` calls failed `old_string not found`; 39 provably escaping-caused across 18 tasks. Controlled experiment (30 real edit contexts, temp 0.2): double-JSON 22% failure, **single-JSON 62%** (worse — backslash-n reads as a normal Python escape), raw text **0%**. Host picking a fix should prefer the raw-text path; if the single-JSON variant ships instead, edit failures could get worse before better.
- **Thinking drop (744354, Ke Wu):** ADK sends `reasoning_content`; vLLM 0.19.1 reads only `reasoning` (chat_utils.py:1512) → thoughts never reach the next prompt. Tokenizer repro: thought present with `reasoning` key (114 tokens), absent with `reasoning_content` (86). Real-run evidence from the 636 public baseline runs (zzgtylors): next prompt grew median 0.35× of previous reply with thinking on vs 1.1× off. Patch incoming; **no re-score**.
- **Graph tools (744577, Whisper Last):** `search_similar_code` returns full node source, uncapped; `run_command`/`read_file` cap at 5,000 chars. Node sizes on fastapi: FastAPI ≈130k chars, APIRouter ≈110k. Distribution over 246 calls: 107 >5k, 21 >20k, 11 >50k, 6 >100k — all 6 >100k ended the task via `ContextWindowExceededError` (queries included "Body" which surfaced APIRouter first). Mitigation until patched: specific function/method-name queries, `get_code_neighbors` first (names only, <400 chars). Host will cap like other tools.
- **Fresh, unverified (744678, Rishav Kumar, posted 19:00 UTC 9/30):** `read_file` with line ranges reportedly always fails with "'>' not supported between instances of 'int' and 'str'" (0 comments; could be model sending string args). Verify locally on Day 0; if real, prefer full reads + edit_file, or integer args only.

## 6. Local evaluation and dataset integrity

- **Gold patches fail locally (743973 + 744370, four independent analyses):**
  - Docker sandbox: 63–67/67 fastapi tasks fail at import — wheelhouse ships pydantic 2.13.4 but not `typing_inspection` (its dependency); also missing `inline-snapshot` (22 tasks), `dirty-equals` (9), ujson/orjson (2), python-multipart (1). Kaggle's notebook image differs (pydantic 2.12.3 + typing-inspection preinstalled) → 71 tasks pass gold there (42 rich, 29 fastapi); requests/httpx untestable in that mode (src layout).
  - Wheel dedup keeps only the highest version per package → starlette 1.6.0 forced on all fastapi commits; 48 tasks fail `Router.__init__() got an unexpected keyword argument 'on_startup'`; net **54/67 fastapi gold-fail** even after adding missing wheels.
  - **Host (744370): hidden tasks validate 100% with gold** — scorer is clean; breakage is local-only and explains CV/LB anti-correlation.
- **Dead-on-arrival public tasks regardless of environment (743973, JohnParkerson's audit):** 8× requests tasks SSL-dead on Python 3.13 (VERIFY_X509_STRICT vs pytest-httpbin cert; IDs 6589, 6592, 6629, 6757, 7328, 7433, 7502, 7505); 3× version-gated tests (fastapi_14186, fastapi_15745, rich_3486 — `@needs_py_lt_314` skips on any 3.13.x); 1× Python error-string drift (rich_3472). These distort public-set CV only; the hidden set is clean per host.
- **CV/LB anti-correlation data (744319):** Isaka Tsuyoshi: CV 0.18/0.19/0.23/0.24 → LB 0.05/0.06/0.12/0.10. 508shuto (38 Rich-only tasks, gold controls, Docker-ARM64 grading): CV 0.211/0.237/0.316/0.289 → LB 0.10/0.08/0.03/0.05 — **highest CV = lowest LB**. daoviet: CV ~0.2 → LB <0.12, no progress for a week. Root cause per above: local grading env, not the model.
- Community ask to fix training-data wheels (Ritwika Kancharla) — no host commitment seen.

## 7. Baselines, scores, and run variance

| Submission | LB | Notes | Reporter |
|---|---|---|---|
| romanrozen "GEMMA: EDA, Baseline for a start" | 0.12 | Best public notebook; prompts-only | 743140 |
| Direct fork of romanrozen | 0.08 | Same code, different run → ±0.04 variance | Geremie Yeo |
| nursrijan "Complete EDA & ADK Starter Kit" | 0.05 | As-is | Isaka Tsuyoshi |
| TwangyGarlic449 "gemma-super-basic" | 0.08 | Bare-bones | 743140 |
| Official sample_submission (with adapters) | FAILED | Unhandled error, 9/25 | Violet Notes |
| Alperen ÖZ pipeline | 0.13 | Prior bundle from same pipeline (thinking/timeout deltas) | 743213 |
| Carson Rodrigues pipeline | 0.10 | Prior bundle | 743213 |

- Scoring wall-clock ≈ 12–14.5 h on L4×4; one participant hit a 14 h timeout.
- Temperature 0.2 default leaves run-to-run variance (RB's question; fork data above confirms).

## 8. Infrastructure and quota

- **L4×4 queues:** 4–5 h common (743600), 12–13+ h reported (744054, rdeschamps, YusufMo 24 h). CPU sessions start immediately. Community suggests vast.ai RTX Pro 6000 rentals (~$1k/mo) or local rigs for training.
- **Quota double-deduction:** queue 5 h + run 5 h = 10 h deducted (Dmitry Sokolevski; parthenos "2× the notebook runtime"; Penguin: same behavior as ARC AGI 2). Saltice: nominal quota 30 GPU-h/week.
- **Submission workflow gotcha (743683):** "Submit" before "Save Version" fails instantly ("Did not find output file 'submission.zip'"). Host: working as intended — Save Version (successful run) first, then Submit.
- **9/26 failure wave:** many plain-YAML no-adapter submissions errored ("requested more CPU, GPU or TPU resources than are available") and still consumed the daily slot; host fixed the cause and reran affected submissions Monday 9/28 — but the rescore was then **paused** for L4×4 queue relief (pinned comment). Status of that backlog as of 9/30: unknown.
- Host posted a fix + "demo notebook" for the adapter/resource issues (9/25–26); Getting Started notebook is the reference.

## 9. Community resources surfaced

- Official Discord (discord.gg/kaggle) — community-only; staff don't monitor it (742815).
- Ghostwriter — open-source KD/distillation tool for Gemma 4 (Justin Scott), github.com/jscott3201/ghostwriter-rs.
- 636 shared public thinking-on baseline runs by zzgtylors (referenced in 744354's analysis).
- Public notebooks with known scores: romanrozen 0.12, nursrijan 0.05, TwangyGarlic449 0.08.
- wrath333's gradability-audit notebook (743973 attachment) and bharat0's eval-errors kernel (gold-patch-bypass harness hack).
- Host wheelhouse dataset ("Gemma 4 Developer Agent Wheelhouse", now v25) — patched vLLM 0.19.1 with SupportsLoRA; required for local LoRA work.

## 10. Per-thread manifest

| ID | Title (short) | Author | Posted | Value |
|---|---|---|---|---|
| 743007 | Welcome / host kickoff | Elan Markowitz (host) | 7d | Framing: PEFT, RL, graph reasoning encouraged |
| 742815 | How to get started + official Discord | Ashley Oldacre (staff) | 7d | Discord policy; staff don't monitor Discord |
| 742807 | Distillation clarification | C-Number; staff answer | 7d | License-compliant external LLM data allowed |
| 742882 | Local eval harness availability | Shimon Danziger; staff | 7d | Wheelhouse + Getting Started links; test-dep gap first raised |
| 743063 | Scoring-run questions (sequencing, keys, 12 h) | HTN; staff | 6d | The four-field answer; overrun policy; open gaming question |
| 743140 | What results did you get? | Isaka Tsuyoshi | 6d | Baseline score table; sample FAILED; no adapter path exercised |
| 743186 | Infra suggestions for post-training/SFT/RL | TheFusionCube | 6d | No host answer; 64 GB VRAM insufficient for full FT; QLoRA Q |
| 743213 | Sample submission FAILED; adapter registration | Violet Notes (+11) | 5d | Adapter addressing; 9/26 failure wave; PyPI vLLM LoRA refusal |
| 743508 | LoRA adapters silently wiped (double registration) | Whisper Last; staff | 5d | Zeroing mechanism + repro; fix in wheelhouse v23/v25 |
| 743600 | L4×4 queued + system errors | parthenos | 4d | Queue evidence 4–5 h |
| 743683 | Rerunning failed submissions | Ryan Holbrook (staff) | 4d | Resource-error fix; Monday rerun; rescore paused; Save-Version SOP |
| 743973 | Gold patches fail offline (fastapi/requests) | wrath333*; Claire Bedecarre; JohnParkerson | 3d | Full local-grading autopsy + dead-task list |
| 744054 | Queued 13 hours | Tiangang Zhang | 2d | Worst queue reports; rental suggestions |
| 744272 | Double-JSON escaping of tool results | Whisper Last; D A M; staff | 1d | Mechanism; 22%/62%/0% experiment; "addressing now" |
| 744319 | CV vs LB correlation | Isaka Tsuyoshi; 508shuto; daoviet | 1d | Anti-correlation datasets |
| 744331 | LoRA KV collapse 46k→7.6k | Adithya Giridharan; whoami; staff | 1d | KV math; hang mechanics; patch promise |
| 744354 | Thinking-mode thoughts dropped | Ke Wu; staff | 1d | Root cause + tokenizer repro; patch incoming; no rescore |
| 744355 | Official per-task images request | Ayush Thakur | 1d | No replies |
| 744370 | FastAPI gold fails; typing_inspection | Vivek K N; Oleksii Zhukov; staff | 1d | **Hidden tasks 100% gold-valid**; sandbox-mode differences |
| 744577 | search_similar_code context blowup | Whisper Last; staff | 8 h | Size distribution; cap promised |
| 744678 | read_file line-range TypeError | Rishav Kumar | 35 min | Unverified; watch |
| 744256 | Request for fine-tune GPU access | Dhruv Pai Dukle | 2d | 30 h/wk quota confirmed in replies |

---

## 11. Deltas vs. the 9/30 planning deliverables

Updates to `01-roadmap-and-master-checklist.md` / `02-master-plan-day0-six-sprints.md` prompted by this sweep (both written earlier on 9/30 from the morning fetch):

1. **Q6 reframed:** host confirms the scoring env validates 100% with gold — local-only breakage, exactly as our gradability-audit plan assumed, but now host-verified rather than inferred.
2. **Q1 split into Q1a (KV collapse, fix promised) and Q1b (silent zeroing, fix in wheelhouse ≥v23 but not independently confirmed).** The Sprint-4 canary must test both (loud-adapter output-diff + long-prompt survival), and local adapter serving must use the wheelhouse vLLM (stock PyPI vLLM refuses LoRA for Gemma 4).
3. **Q3 status upgraded from "unknown" to "patch incoming, no re-score"** — after deployment, re-probe thinking on/off before locking sampling.yaml in Sprint 2; scores before/after the patch are not comparable.
4. **New watch item Q7 (read_file line ranges)** — verify on Day 0; adjust tool policy if real.
5. **Rescore/rerun backlog** (9/26 failures) may still be pending behind L4×4 queueing — expect leaderboard shifts not caused by participants.

---

*Method: $0 session — free/keyless engines only (no search-engine API spend; Tavily allowance pre-exhausted). 8 browser fetches this sweep (1 listing, 6 threads incl. 743213 chase, 1 alternate-sort listing) on top of the morning session's 27; serial fetches with 25 s spacing after the earlier rate-limit lesson. Raw dumps carry per-file fetch timestamps and untrusted-content markers.*


---

<!-- ====================================================================== -->
<!-- FILE: 04-paper-track-intel.md -->
<!-- ====================================================================== -->

# Paper-Track Intel — Google Gemma 4 Developer Agent Paper Track

**Compiled:** 2026-09-30 (~19:40 UTC) · **Offline snapshot:** `scrapes/gemma4-paper-comp-2026-09-30/` (14 files, indexed by its README)
**Companion deliverables:** 01 (strategy), 02 (sprints), 03 (main-comp discussion intel)

---

## 1. What this competition is

A **separate Kaggle hackathon** ("Featured Hackathon") running alongside the main Gemma 4 Developer Agent competition. Submit an unpublished research **writeup** on agentic software engineering; a Google-hosted judging panel scores it. No leaderboard, no data tab — the "Writeups" page is the submission venue.

| Fact | Value |
|---|---|
| Runs | Sep 22 → **Nov 12, 2026, 11:59 PM UTC** (final deadline) |
| Prizes | **$35,000 total**: Overall Best Paper $15K · Best New Resource $10K · Best New Application $10K |
| Submission rate | **5 writeups/day** (vs 1/day in the main comp) |
| Final picks | 2 per team — per host: **at most 2 writeups are judged** |
| Team size | ≤ 5; mergers allowed |
| Main-comp entry required? | **No** — independent track |
| Eligibility quirks | Standard Kaggle: 18+, sanctions exclusions; under-18 possible with two consent forms (13+); no Kaggle points/medals |
| Winner license | Open Source **Apache 2.0**; winners deliver reproducible code + methodology docs |
| Data license | Competition Use and Commercial Apache 2.0 |
| Participation (9/30) | 2,523 entrants · **84 participants** · 84 teams · **86 submissions** |
| Visibility | Winning papers highlighted at a Google-hosted event (e.g., NeurIPS 2026 expo workshop) |

**Key reading of the numbers:** ~97% of entrants have never submitted; 86 submissions across 84 teams means almost no iteration yet. This is a low-competition venue where a well-executed writeup has outsized odds — and our main-comp pipeline already generates paper-grade artifacts as byproducts.

## 2. Evaluation rubric (verbatim categories, equal weight)

Each criterion scored 0–5; final = average of all five. **Your rubric feedback is never shared.**

| Criterion | What judges ask | Implication for writing |
|---|---|---|
| Novelty | New insights, deeper understanding, important properties of existing methods | Lead with what nobody else has measured |
| Quality | How general/universal beyond this competition; does it translate to similar problems | Frame findings as harness-independent lessons |
| Relevance | Significance/potential impact on SE and agentic learning | Tie to the open-model-on-consumer-hardware mission |
| Verifiability | Enough info to understand how the innovation works; how data was obtained/analyzed | Include methodology detail and repro steps |
| Clarity | Clearly presented and written | Structure per the required template |

**Tie-breaker: earliest-entered paper wins.** Combined with the platform's writeup-submission bug history (§5), this argues for submitting the final version early, not on deadline day.

## 3. Submission mechanics

- **Format:** Kaggle Writeup containing title+subtitle, abstract, introduction, methods/experiments, related works + citations.
- **Hard cap: 3,000 words.** Plan tight, dense prose; push detail to figures/tables and the optional notebook.
- Optional attachments: public notebook (private ones auto-publish after deadline) and/or an **arXiv-ready PDF** via the Public Project Link.
- **Non-archival — parallel submission to arXiv and other venues is explicitly allowed *and encouraged*** (host answer).
- Un-submitted drafts at deadline are **not** judged — must click "Submit" on the writeup.
- Suggested topics: Tuning & Optimization (PEFT/RL for SWE agents); Code Comprehension (graph generation/parsing/embedding); Tasks & Benchmarks; Graph Reasoning. Welcome thread adds **DiffusionGemma** and code-graph creative uses for the applications prize.

## 4. Host Q&A (from the track's discussion board)

| Question | Host answer (Elan Markowitz) |
|---|---|
| Max writeups? | At most **2 judged**; one submission track; judges assign prize eligibility; "quality over quantity" |
| Can one writeup win two prizes? | It can be *considered* for several, but wins only **one** (Best Paper takes precedence, then removed from resource/application pools) |
| Same rubric for all prizes? | Yes, but criteria are scored *in the context of* the prize (novelty/quality/relevance of the resource or application itself) |
| Rebuild graphs/embeddings from public repos (fastapi/rich/requests/httpx) as a resource entry? | "Acceptable with citation and linking to the Kaggle dataset" — i.e., regenerate + link, don't redistribute the shipped files; host double-checking the exact rule |
| What gets highlighted at the Google event? | Only prize-winning submissions (as of now) |
| Archival status | Non-archival; parallel venue + arXiv submission allowed/encouraged |

## 5. Platform bug watch

- **Writeup save/submit 404** (since ~21:00 UTC Sep 24): `CheckHackathonWriteupConflict` endpoint returning plain-HTML 404 blocks editing *and* new-writeup saves for at least one user; host asked for confirmations 9/29 — status unresolved in the snapshot. **Action: test writeup creation early (join + create + save + submit a stub) rather than discovering this on deadline week.** Ties break by earliest entry, so platform reliability directly affects outcome.

## 6. Judges and the organizer roster

Only one judge is listed (Elan Markowitz, ML Engineer, Google), but the **citation author list** effectively names the organizing/reviewing circle:

Markowitz · Perozzi · Rózemberczki · Cameron · Hemmati · Li · Galkin · Farhadi · Holbrook · Oldacre (Google).

**Signal:** Perozzi, Rózemberczki, and Galkin are established **graph-machine-learning** researchers; Hemmati's background is software-engineering research/testing. A submission that makes genuine use of the **code graphs / embeddings** (not just prompt tweaks) speaks directly to this panel's taste. Pure scaffolding war stories will score lower on Novelty/Relevance with this roster than graph-centric methods or benchmark contributions.

## 7. Landscape intel from the track's Code tab

- Public notebooks tagged to this track: "Gemma 4 Dev Agent Paper" (4 votes), "notebook173e28b240" (+4), "CORTEX Gemma SWE Paper" — early-stage drafts; no substantial public paper work yet visible.
- Bonus main-comp intel surfaced by the same tab: **"Gemma 4 LB: 58 Tasks, Bronze Is a 124-Team Tie"** (Dariush Afshar's EDA notebook, 2d old). Read: the public board resolves to **58 tasks** (refines our ~60 estimate — each task ≈ 1.72 public points), and a 124-team tie sits at the bronze line — the board is extremely compressed; ±2-task noise spans hundreds of rank positions. Notebook cells require login; headline + ToC captured in the snapshot.

## 8. Strategy implications for our plan

1. **Near-free upside, two natural entries (max 2 anyway):**
   - *Entry A — Methods paper (Overall Best Paper $15K):* our reliability-first agent design + measured harness-quirk taxonomy (Q1–Q6 with numbers: 22%/62%/0% escaping experiment, KV math, 0.35× vs 1.1× thinking-growth, CV/LB autopsy) + paired-eval protocol + (if it lands) the LoRA/distillation results. Framed as "what actually breaks small-model SWE agents and what fixes them" — strong Novelty/Verifiability; Quality via harness-independent lessons.
   - *Entry B — Resource paper (Best New Resource $10K):* the artifact pipeline — gradability-audit tooling + corrected wheel/sandbox recipe + regenerated graphs/embeddings (host-sanctioned route: regenerate from upstream repos, cite, link) + trajectory dataset from Sprint 4. Judge-roster-aligned (graphs!).
2. **Word budget drives structure now:** with a 3,000-word cap, keep a running "results log" from Sprint 1 (we already do — the submission ledger) so the paper is assembled, not remembered, in Sprint 6.
3. **Graph angle everywhere:** even the methods paper should present our `get_code_neighbors`-first localization policy with hit-rate metrics — it converts scaffolding into code-graph research for this panel.
4. **Timing:** Join + create + save + submit a stub writeup early (bug check + earliest-entry tiebreaker); finalize in Sprint 6 (Nov 6–12) per the existing plan; arXiv parallel post-deadline is allowed and encouraged.
5. **Diversification note:** the paper track is independent of main-comp results — even a mediocre LB finish can win here on the strength of measurement and writing.

## 9. Deltas vs earlier deliverables

- Deliverable 01 §6/§2 said "paper track Nov 12 ($35K)" — now specified: 3 awards ($15K/$10K/$10K), 5 subs/day, 2 writeups judged, 3,000-word cap, non-archival + arXiv-friendly, rubric never shared, ties → earliest entry.
- Deliverable 01 estimated ~60 public LB tasks; community EDA says **58**. Plan math barely changes (1.72 vs 1.67 pts/task); keep ±variance discipline unchanged.
- Sprint 6 paper task (Nov 12) gains a concrete checklist: stub-submit early, 3k-word outline, two-entry strategy, graph-centric framing.

## 10. Coverage and limits of this snapshot

Captured anonymously (logged-out): overview, rules, writeups shell, discussion index + all 7 thread bodies, code tab, one notebook shell. Not captured (login/JS-gated): competitor writeup listings, notebook cell bodies, writeup editor. Page text was treated as untrusted data throughout (standard research SOP). Raw dumps carry fetch timestamps.

---

*Method: $0 session — free/keyless engines only, no search APIs, no MCP quota; 14 browser fetches (5 pages + 7 threads + 2 notebook views), serial with spacing; debug browser closed after capture.*


---

<!-- ====================================================================== -->
<!-- FILE: 100-README-glm53max.md -->
<!-- ====================================================================== -->

# Deliverables — BCF Documents Review + Whitepaper Math (2026-09-30, set 2)

Companion package to `../2026-09-30/` (competition master plan), produced from the BCF documents in `bcf/` and the official competition docs in `input/kagglecomp/`.

| Doc | Task | Contents |
|---|---|---|
| [01-bcf-integration-into-master-plan.md](01-bcf-integration-into-master-plan.md) | Task 1 | Itemized review of the BCF docs (compendium A1–A8/B1–B6, dossier turns 1–21, Kaggle docs) with adopt/hold/skip verdicts; sprint-by-sprint integration map with per-technique test regimes; three riskiest claims; corrections table; whitepaper v3 brainstorm (positioning options, 9-section skeleton, 5 pre-registered predictions) |
| [02-bcf-diagnostic-math-and-prior-research.md](02-bcf-diagnostic-math-and-prior-research.md) | Task 2 | The math behind "classifying errors limits the search space": Bayesian posterior pruning, mutual information, refinement monotonicity + data-processing inequality (the number-vs-fidelity trade-off); fault interference as broken additivity; fault masking as a dominance partial order; chained faults as a masking DAG with topological fix order and the O(k) vs O(k²) turn model; httpx_6821 worked example [ILLUSTRATIVE]; whitepaper-ready drafted section; predictions 6–8; prior-research survey (33 verified citations) with relevance mapping and novelty positioning |
| [03-bcf-simulation-httpx-3672.md](03-bcf-simulation-httpx-3672.md) | Task 2b | Real-data replacement for the invented httpx_6821 case study: BCF-vs-naive simulation walkthrough on the dataset's only httpx task (`httpx_3672`), built entirely from verified artifacts (tasks.jsonl, snapshot, graph, HARNESS_README). Four verified traps (visible-vs-graded test asymmetry, dual sync/async tree, latent no-parens fault at `_server.py:92`, ungraded-but-real broken code); component/tenet/benefit map; five new verified harness facts; candidate pre-registered prediction #9; reproduction appendix. Trajectories carry [SIM] labels — not measurements. Companion slide deck: [03-bcf-simulation-httpx-3672.slides.html](03-bcf-simulation-httpx-3672.slides.html) (standalone, no build step; same [V]/[SIM] evidence tagging) |

**Supporting research** for doc 02: `../../scratch/research-faultmask-bcf-2026-09/` (page dumps, notes, citation-verification record — every DOI/arXiv ID was title-verified via Crossref or the arXiv API on 2026-09-30).

**Quality note:** both documents passed table-QC (uniform column counts per table, valid separator rows) — see the session QC log.


---

<!-- ====================================================================== -->
<!-- FILE: 101-bcf-integration-into-master-plan.md -->
<!-- ====================================================================== -->

# BCF → Master Plan Integration + Whitepaper v3 Brainstorm (Task 1)

*Prepared 2026-09-30. Examines: `input/kagglecomp/docs/markdown/` (Kaggle-00…04: overview, data, getting-started, official rules), `bcf/BCF-Reference-Compendium.md` (Part A adoptables A1–A8, Part B dev-time assets B1–B6), and `bcf/BCF-contestsubmission_dossier_20260928.html` (21-turn working session: strategy, two whitepaper drafts, taxonomy, classification gate, GraphRAG brain, gap register). Companion deliverable: [02-bcf-diagnostic-math-and-prior-research.md](02-bcf-diagnostic-math-and-prior-research.md).*

*Baseline documents this integrates into: [01-roadmap-and-master-checklist.md](../2026-09-30/01-roadmap-and-master-checklist.md) (milestones M0–M7, checklist Phases A–G) and [02-master-plan-day0-six-sprints.md](../2026-09-30/02-master-plan-day0-six-sprints.md) (Day 0 + Sprints 1–6, Oct 2 – Nov 12).*

---

## 1. TL;DR — the ten highest-value adoptions

1. **Spec-first gating (BCF Phases 1–4 + tenets)** becomes the doctrine core of Brain v1 in Sprint 2. No file-access tool call until a machine-parseable spec exists.
2. **Deterministic gates G0–G6 + circuit breakers** replace "hope the model behaves" — code-owned strikes, immediate revert on regression. This is the single cheapest reliability lever found anywhere in the BCF docs.
3. **Breadcrumb journal + rescue state machine** kill the loop/repeat failure mode the community reports (exploratory edit loops burning 50-turn budgets).
4. **Phase 1a classification gate (issue-text-only)** routes four issue classes (logic / edge-case / crash / feature) to class-specific spec templates — including the defensive-vs-guard-missing fork that directly encodes the httpx masking lesson.
5. **GraphRAG "brain" resource (knowledge_graph.json + TF-IDF anchors keyed to the 256-dim embeddings)** gives Phase 1 a one-tool-call prior instead of cold search — with the strict anti-overfit rule that all anchors be runtime-derived, not hand-mapped.
6. **Structured ledger + receipts + evidence tiers (M/D/I/H)** — already the plan's measurement backbone; the BCF docs make it the paper's honesty infrastructure too (this is what catches fabricated tables before judges do).
7. **Taxonomy labeling of the 129 training tasks** — the paper's most defensible, zero-GPU contribution (Category A) and the training data for the classifier's priors.
8. **Graph/embedding dataset analyses (Category B)** — centrality table, bug-category clustering heatmap, precision@k. Turns "leverages the dataset" from a claim into a figure.
9. **Three-config paired experiment (Config 1 baseline / 2 graph-only / 3 full BCF)** — the leaderboard work and the paper work become the same work.
10. **Compute-in-scripts, decide-in-model**: the competition docs confirm `run_skill_script` shares the container filesystem and debits *time*, not extra turns — heavy lifting (scoring, subgraph walks, test discovery) moves into Python scripts; the model spends its 50 calls on decisions.

Two discipline rules ride along with everything: **the dossier's evidence-state markers** (Verified / Designed / Illustrative / Unsourced / Retracted) and the **corrections in its §4.2** (classifier must use issue text only at test time; sub-agent tree demoted pending evidence; 12 bug categories are hypotheses until derived from data; SWE-bench Verified demoted in favor of SWE-bench Pro).

---

## 2. What the examined documents contribute, itemized

### 2.1 Competition docs (`input/kagglecomp/docs/markdown/`)

| Fact / mechanism | Where | Why it matters to the plan |
|---|---|---|
| `submission.zip` = `agent.yaml` at root + prompts, skills, LoRA adapters (≤3 GiB); `!include` resolves relative to the including file | Kaggle-01 §Submission | Confirms the plan's packaging CI; BCF skill layout must fit this tree |
| 12-hour wall clock inclusive of sandbox setup; per-task limits optional in `eval_config.yaml` | Kaggle-01 | Confirms the plan's failsafe rule (set `max_time_minutes`) |
| Tool surface: `run_command`, `submit_patch`, `get_status`, `read_file`, `edit_file`, `get_code_neighbors`, `search_similar_code`, `get_code_subgraph` (+ `run_skill_script`, `load_skill_resource`) | Kaggle-01 | Fixes the tool-policy matrix; graph tools are first-class, not optional |
| Skill scripts run *inside the persistent container*, share filesystem with `run_command`, and debit execution time against the central budget; `load_skill_resource` reads data files | Kaggle-01 | Resolves dossier Gap G9 partially: scripts CAN run and touch `/workspace`; scripts cost time, not turns — offload search/scoring to Python |
| Data package: 129 tasks; snapshots with forward history removed; 256 graph files (NetworkX multigraph, typed edges incl. `calls`/`called_by`); 256-dim float32 embeddings per symbol; `test_patch` hidden at scoring | Kaggle-02 | Confirms local-eval ground truth and the graph/embedding assets the GraphRAG brain targets |
| `eval_config.yaml` consumed fields: `max_turns`, `max_time_minutes`, …; reference-check command validates the harness with the gold patch | Kaggle-03 | Day-0 verification steps already in the plan; keep as gate M0 |
| Official rules: paper-track dates/prizes/categories, submission mechanics, licensing | Kaggle-04 | Bounds the whitepaper strategy (§6 below) |

### 2.2 BCF Compendium (`bcf/BCF-Reference-Compendium.md`) — Part A (submission-eligible)

| ID | Technique | One-line essence | Verdict |
|---|---|---|---|
| A1 | Four tenets + four-phase pipeline | Preserve working code; minimum-path decomposition; breadcrumbs; binary done; spec → localize → patch → validate, enforced by tool scoping not prose | **Adopt** (Sprint 2 core) |
| A2 | `batonic-rescue` state machine | Deterministic trip conditions → R1 intake/recon gate → R2 minimum baseline → R3 induction rounds; 3-strike rule; immediate revert on regression | **Adopt** (Sprint 2, tune from ledgers) |
| A3 | Breadcrumb journal | ≤30-line normalized-action journal outside the repo tree; read every turn and after reverts | **Adopt** (Sprint 2) |
| A4 | Handoff reducer packet | Deterministic state→packet function instead of full-transcript passing between nodes | **Hold** — test only in the Sprint-3 sub-agent pilot (dossier demoted sub-agents; Cognition's warning stands) |
| A5 | External verification hierarchy V0–V3 | Only executable checks can block submission; model judges are advisory | **Adopt** (Sprint 2) |
| A6 | `BCF-Spec` JSON schema | hypothesis/target/fix_shape/depends_on/scope/circuit_breaker via a `write_spec` tool call; derived `fix_order` topological sort | **Adopt** (Sprint 2) |
| A7 | Progressive-disclosure skills | Agent-Skills-standard layout: L1 metadata, L2 SKILL.md ≤5k tokens, L3 scripts/references on demand | **Adopt** (Sprint 3 packaging) |
| A8 | Gates G0–G6 | spec-valid, scope, applies-cleanly, parses, targets-pass, no-regression (instant revert), non-empty | **Adopt** (Sprint 2) |

### 2.3 BCF Compendium — Part B (dev-time only)

| ID | Technique | Verdict |
|---|---|---|
| B1 | Provenance tiers A/B/C + evidence tiers M/D/I/H + receipts + final-week claims audit | **Adopt now** — it is the fabrication firewall (see §5.4) |
| B2 | HIVE-Lite overnight job queue (idempotent, resumable, receipts) | **Adopt Sprint 4** (when runs exceed babysitting); Claude Code hooks for guarding frozen files |
| B3 | Promptfoo as prompt/schema regression gate against local vLLM | **Adopt Sprint 2** — protects every prompt edit for pennies |
| B4 | Langfuse/LiteLLM | **Skip** (JSONL ledger first; revisit only if trajectory browsing bottlenecks) |
| B5 | Ledger event schema + `results.csv` + SWE-bench-format converter | **Adopt Day 0/Sprint 1** — before the first run, per the ground rule |
| B6 | Benchmark discipline: SWE-bench Pro over Verified (contamination), Python-only slice, post-competition | **Adopt as policy**; Verified only as smoke test with caveat |

### 2.4 Dossier turns (unique additions beyond the compendium)

| Turn | Contribution | Verdict |
|---|---|---|
| T4/T5 | Walkthrough + httpx_6821 stress test (two-file masked-fault scenario, 30-turn naive vs 10-turn BCF) | **Illustrative only** — retire as evidence; keep as the canonical worked example for the paper and for prompt few-shots |
| T9/T19 | Dataset technical detail; expected task-type distribution (logic errors dominate, silent-wrong-output common, crash minority, features a real chunk) | **Adopt as priors** for classifier design and prompt doctrine |
| T11 | Four intelligence layers in submission.zip (prompt knowledge 0 turns / scripts 1 turn / resources 1 turn / LoRA 0 turns implicit) | **Adopt** — the turn-cost accounting model for the brain |
| T12 | GraphRAG brain: `knowledge_graph.json` (bug-pattern/code-location/fix-template nodes, keyword + embedding-anchor edges) + `graphrag_query.py` one-call brain | **Adopt Sprint 3** with anti-overfit constraints (§4.3) |
| T13 | Jev: dev-time judge only; no training use pending rule clarification | **Adopt as stated** (matches the plan's Track-2 gating) |
| T15/T16 | Whitepaper v2 (categories, transparency notice, taxonomy as contribution) + leverage audit → the three missing analyses (graph figure, embedding clustering, precision@k) | **Adopt** — defines paper Categories A/B |
| T17 | Evidence-gap plan: Category A taxonomy (6 fields + inter-rater), Category B analyses, Category C experiments with 3 configs + logging script | **Adopt verbatim** into Sprints 1–5 |
| T18 | Weeks 1–4 roadmap (frozen 30-task set, 8-task pilot, paired statistics) | **Merge** into plan Sprints (§4) |
| T20 | Phase 1a classification gate + four class strategies + defensive-vs-guard fork + feature CAPABILITY/INTEGRATION-POINT/SHAPE spec | **Adopt Sprint 3** (issue-text-only version) |
| T21 | Coverage/gap analysis, corrections §4.2, gap register G1–G24 | **Adopt** — feeds the plan's risk register (§5) |

---

## 3. Integration map — every adopted technique into the current master plan

The mapping below uses the plan's own coordinates: Day 0 (Oct 1), Sprints 1–6, checklist Phases A–G, milestones M0–M7, and the standing cadence (§11 of the plan). "Test" is the acceptance regime — nothing enters the submission on faith.

### Day 0 — Oct 1 (bare-metal bring-up) · plan §2

| Add | How | Test |
|---|---|---|
| G9 probe — skill-sandbox capability matrix | On the reference-check pass, run a probe skill that (a) executes `run_skill_script`, (b) reads `/workspace` and the graph/embedding assets via `load_skill_resource`, (c) attempts an outbound net call (expect blocked) | Probe report committed; informs whether `graphrag_query.py` can pre-walk graphs |
| B5 ledger + post-run script | Install the `results.csv` appender + `trace.jsonl` schema **before the first harness run** (dossier ground rule) | First baseline run produces a complete CSV row automatically |
| B1 receipts | Receipt JSON per run (config hash, seeds, harness version) | Every number in every doc traceable to a receipt ID |

### Sprint 1 (Oct 2–8) — Trustworthy scoreboard + first blood · plan §4 · Phase C

| Add | How | Test |
|---|---|---|
| Config 1 baseline (generic prompt, grep-first) | Run the frozen 8-task pilot then the 30-task dev manifest; ledger everything | Baseline pass-rate + turn distribution = the paper's comparison floor (Gap G2) |
| Taxonomy labeling starts (Category A) | Desk work on evenings: 6 fields × 129 tasks; record `human_override`; freeze codebook first (crash-vs-silent split added per T19) | 20-task inter-rater sample (second rater = fresh Claude session, blind); percent agreement + Cohen's κ reported |
| Failure codebook wiring | The 7 failure-mode labels (`wrong_file_localized`, `root_cause_order_error`, `exploratory_edit_loop`, …) applied to Config-1 FAIL traces | Frequency table; tells Sprint 2 which gates matter most |

### Sprint 2 (Oct 9–15) — Reliable loop v1 = the doctrine brain · plan §5 · Phase D

This is where BCF *is* the plan. Brain v1 = tenets + spec + gates + journal + rescue.

| Add | How | Test |
|---|---|---|
| A6 `BCF-Spec` schema + `write_spec` tool | Model emits spec via schema-validated tool call; lenient fallback parser; `symbol_in_graph` check against the task graph | Promptfoo suite: `is-json` against schema + python checks (symbol exists, scope sane, `fix_order` is a valid topo sort) on ~10 frozen issue texts |
| A1 phase scoping | `issue_analyzer` cannot edit; `patch_implementer` cannot explore without a plan — enforce in tool scoping, not prompt | Trace audit: zero file-access calls before a valid spec (gate G0 blocks otherwise) |
| A8 gates G0–G6 + A2 rescue + A3 journal | Orchestrator code; breaker config in spec; journal at `/tmp/bcf/<task_id>/journal.md` (outside patch) | Paired rung A4/A5 ablation on the 30-task set: rescue on/off, journal on/off → `loop_rate`, `repeat_action_rate`, `rescue_recovery_rate`, net pass-rate Δ with CI |
| A5 verification policy | V0–V2 may block; V2b/V3 advisory only | False-approval telemetry on dev split (V3 says OK, tests fail) |
| B3 Promptfoo gate | Wire to local vLLM (`--enable-auto-tool-choice --tool-call-parser gemma`); run on every prompt/schema edit | Green suite = merge criterion; catches small-model JSON regressions in seconds |
| Spec quality scoring | `spec_score` rubric + `spec_file_correct` vs taxonomy gold | Correlation: does spec score predict PASS? (paper Table fuel) |

### Sprint 3 (Oct 16–22) — Scaffold v2: skills, budgets, brain · plan §6 · Phase E

| Add | How | Test |
|---|---|---|
| T20 Phase 1a classifier (issue-text-only) | `classify_issue.py` heuristic (feature keywords / traceback regex / expected-vs-actual phrasing) → picks one of three spec templates (logic-merged-edge, crash-with-fork, feature) | Accuracy vs Week-2 taxonomy labels; routing threshold: <~70% → fall back to one universal template (dossier risk rule) |
| Defensive-vs-guard-missing fork | Crash-class spec must commit (a) trace-the-invalid-state or (b) guard-at-crash-site, default (a) | Case count on crash tasks: does the fork reduce symptom-patching (fix touches only traceback file → flagged)? |
| T12 GraphRAG brain v1 | Build `knowledge_graph.json` offline from taxonomy + training patches; anchors = `symbol_anchors` keyed to the *embedding* node-ids; runtime `graphrag_query.py` = TF-IDF + anchor lookup, one call | Cold-start ablation: with/without brain → Phase-2 turns to first-correct-file; anchors must be **derived at runtime from issue text**, never static repo maps (T9 tenet: hidden repos) |
| Dual-query + traversal doctrine | Query 1 = error-description language, Query 2 = API/structural language; `called_by` for symptom→cause, `calls` as Class-2 fallback; centrality tie-break | Precision@1/3/5 of the search protocol against taxonomy `root_cause_symbol` (Category B, Analysis 3) |
| A7 skill layout | `bcf-spec`, `bcf-localize`, `bcf-validate`, `bcf-rescue` (+ `bcf-brain` resources) per Agent-Skills standard | Description quality matters for a small model — activation-correctness metric (right skill, right phase) |
| Config 2 (graph-only) + Config 3 (flat full BCF) | Dossier correction: **Config 3 is flat** (no sub-agent tree) pending evidence | 8-task pilot for stability, then 30-task paired runs; deltas C1→C2 (graph protocol) and C2→C3 (spec+gates) are the paper's headline quantities |
| A4 handoff packet | Only if the sub-agent pilot runs at all | Three-arm ablation T0/T1/T2 (full transcript / packet / hybrid) on the pilot; Cognition's warning governs the default |

### Sprint 4 (Oct 23–29) — Data flywheel + LoRA v1 (local) · plan §7 · Phase F

| Add | How | Test |
|---|---|---|
| Category B analyses | (1) per-repo graph table: nodes/edges/degree/top-10 betweenness; (2) 12×12 bug-category cosine heatmap (intra- vs inter-category); (3) precision@k for the search protocol | Each becomes a paper figure; (2) is a standalone finding about the competition dataset |
| Failure-mode labeling of FAIL traces | Jev as dev-time judge over the codebook (analysis only — no training use before the rule clarification) | Distribution per config; identifies which gate/rescue to tune |
| Paired experiment machinery | Frozen 30-task manifest + seeds {0,1,2} × {C1, C2, C3}; B2 HIVE-Lite queue if runs outgrow babysitting | Paired stats: per-task turn deltas, pass deltas, bootstrap CIs; the headline correlation — BCF turns vs complexity tier (expect negative), baseline turns vs tier (expect positive) |
| LoRA data prep | BCF-compliance objective (reward method adherence alongside resolution) — only if Track-2 gate (Q1 LoRA fixes) opens; else paper-only proposal | Existing plan canary: zeroing + KV + long-prompt survival |

### Sprint 5 (Oct 30–Nov 5) — Distill-and-scale + tuning · plan §8

| Add | How | Test |
|---|---|---|
| Taxonomy release package | CSV + codebook + κ stats + license check (G19) on GitHub, keyed `root_cause_symbol` ↔ graph `node.id` | Released artifact = paper Section "resource contribution" |
| Category C numbers land in the paper | Replace every "estimated" in v2 Table 1 with measured values + receipt IDs | Claims audit dry run |

### Sprint 6 (Nov 6–12) — Consolidation, hardening, paper · plan §9

| Add | How | Test |
|---|---|---|
| Whitepaper v3 final | §6 below; math section from the Task-2 companion doc | Rubric self-check (novelty/quality/relevance/verifiability/clarity); word budget ≤3,000; related-work verified |
| Final claims audit (B1) | Every sentence with a number carries a receipt or derivation; anything else cut | Independent read-through with the ledger open |

### Endgame (Nov 13 – Dec 2) · plan §10

Unchanged by BCF except: the BCF doctrine brain continues to evolve on leaderboard feedback; the paper is already submitted (Nov 12), freeing the endgame for the main track.

---

## 4. The three riskiest BCF claims and how the plan tests them

### 4.1 "Spec-first saves turns" is a hypothesis, not a fact

The dossier's 30-vs-10-turn stress test is a *constructed illustration* (retracted as evidence). The plan already treats it correctly: Config 2 vs Config 3 on a frozen 30-task set with seeds and paired statistics. **Acceptance:** even a modest, honest 20–30% turn reduction with CI is a publishable result; a null result folds into the paper's discussion and the brain reverts to graph-first only.

### 4.2 Sub-agents: demoted, pending evidence

The dossier demotes the sub-agent tree (Config 3 is flat); the compendium flags the transcript-passing gap as contested (Cognition vs Anthropic). The plan's Sprint 3 keeps a *pilot-only* sub-agent experiment with the A4 three-arm ablation; the default architecture stays flat. **Gate:** sub-agents enter the submission only if the pilot beats flat on pass rate at equal token budget.

### 4.3 Static knowledge overfits the four public repos

T9/§4.2: hand-built repo maps and static symbol anchors overfit fastapi/rich/requests/httpx; the hidden set uses private repos. The GraphRAG brain therefore ships only *generic* machinery (TF-IDF over issue text, embedding-anchor lookup against whatever graph the task provides, fix-template library) — any repo-specific map must be derivable at runtime from the task's own graph/embeddings. **Test:** replay the brain on holdout-style tasks from repos not in the training four (construct from other SWE-bench Python repos locally).

---

## 5. Corrections the BCF docs impose on the current plan

| # | Correction | Plan change |
|---|---|---|
| 1 | Phase 1a classifier originally used `test_patch` — **not visible at test time** | Classifier inputs = issue text only; `test_patch` used solely for dev-time validation of classifier accuracy |
| 2 | Phase 4 "derive test scope from tests named in the issue" is unreliable | Test discovery from the repo (`pytest --collect-only` scoping around touched modules); full-file runs for Class 2/4 (adjacent-regression risk) |
| 3 | The 12 bug categories were invented pre-data | Codebook frozen only after the open-coding pass; categories with n<5 merge into `other`; report the merge rule |
| 4 | SWE-bench Verified deprecated for frontier claims (contamination; flawed-test audit) | External check = Python-only SWE-bench Pro slice, post-competition, never tuned on |
| 5 | "Self-scoring can't produce rejections" is too strong | Paper wording: "intrinsic self-verification by a prompted model is unreliable without external grounding" — V0–V2 stay deterministic regardless |
| 6 | Skill scripts may not call harness tools from inside a script (G9 residual) | Day-0 probe; `graphrag_query.py` designed to need only file reads + its bundled resources |
| 7 | 12h wall clock includes sandbox setup | Already in plan; reinforced: forced-submit logic must fire on time, not turn, budget (G12) |

---

## 6. Whitepaper v3 — brainstorm for the next draft

### 6.1 Positioning options (pick one primary)

| Option | Title sketch | Category target | Risk |
|---|---|---|---|
| **A. Diagnostic-math paper (recommended)** | "Exception-Class Diagnosis: An Information-Theoretic Account of Search-Space Reduction for Repository-Level Bug Fixing" | Overall Best Paper; Graph Reasoning | Math must be honest — the Task-2 companion provides the machinery |
| B. Resource paper | "BCF-SWE-Python: A 129-Task Root-Cause Taxonomy with Graph-Aligned Labels and a Measurement Protocol" | Best New Resource | Lower risk; needs the release package + κ |
| C. Methods paper | "Specification-Gated Agents: Cheap Structure for Small Models on SWE-Bench-Style Tasks" | Best New Application | Needs Config 1/2/3 results to be non-null |
| D. Hybrid A+B (two entries; the earlier paper-track intel allows max 2 judged writeups) | A as primary, B as second entry | both | Effort; but B is nearly free once the taxonomy exists |

**Recommendation:** A as the primary (with B's resource as its strongest section), and — if the leaderboard effort is on schedule — enter B separately in the final week. This matches the earlier finding that two writeups are allowed and ties break to earliest entry, so stub-submit early.

### 6.2 The v3 skeleton (building on v2, post-corrections)

1. **Intro** — the one-sentence dataset dependence up front ("BCF is designed around the provided AST call graphs and 256-dim symbol embeddings…"), plus the explicit novelty positioning sentence against SWE-agent/Agentless/AutoCodeRover.
2. **Diagnostic model (NEW — the "meat and potatoes")** — the math from the companion deliverable: Bayesian posterior pruning, mutual-information accounting of classification value, the granularity–fidelity trade-off (data-processing bound), masking as an observability partial order, chained faults as a DAG with topological fix order, and the O(k) vs O(k²) turn model. Includes the worked httpx_6821 example as a *labeled illustration*.
3. **BCF architecture** — four phases, gates, rescue; the classification gate; GraphRAG brain with runtime-derived anchors.
4. **Graph/embedding leverage** — the three analyses (centrality table, clustering heatmap, precision@k) with figures.
5. **Taxonomy as a resource** — schema, method, κ, release.
6. **Case studies** — httpx_6821 + one real measured trace, both carrying evidence-state labels.
7. **Experimental protocol → results** — v2's Section 8 converts to measured numbers as Category C lands; every number receipted.
8. **Discussion** — System 1/System 2 framing (kept — it's memorable and connects to the competition's own Kahneman naming), limitations (visible-tests-only caveat, single-labeler κ, 30-task sample), future work (LoRA compliance objective).
9. **Related work** — verified citations only (the Task-2 prior-research section slots in here).

### 6.3 Falsifiable predictions worth pre-registering in the paper

Pre-registering these *strengthens* Verifiability (a named rubric axis) and costs one paragraph:

1. Bug categories cluster in the 256-dim embedding space (intra- > inter-category cosine).
2. Precision@3 of the dual-query protocol ≥ precision@3 of single-query (its design rationale).
3. BCF turns-to-localize correlate negatively with complexity tier; baseline positively.
4. Crash-class tasks show more symptom-patching (traceback-file-only patches) without the defensive-vs-guard fork than with it.
5. Misordered multi-bug fixes cost ≥ the modeled unmasking penalty (validation + re-diagnosis turns).

### 6.4 Calendar fit (against the sprint plan)

| Week | Paper work | Depends on |
|---|---|---|
| Sprint 1–2 | Taxonomy pass 1; receipts discipline | Ledger from Day 0 |
| Sprint 3 | §4 leverage figures; classifier accuracy table | Taxonomy draft |
| Sprint 4 | Category C numbers; §7 case studies from real traces | Config 1/2/3 runs |
| Sprint 5 | v3 assembly; inter-rater; release package | Everything above |
| Sprint 6 | Claims audit; submit by **Nov 12, 11:59 PM UTC**; arXiv parallel (allowed and encouraged) | — |

### 6.5 What *not* to do again (from the v1 retraction ledger)

- No number without a receipt; no "grounded in real repository code" claims for reconstructed walkthroughs; no past-tense descriptions of unrun experiments; no unsourced rubric claims (the five criteria are now known from the paper-track page — cite the page, not memory); no abstract compression claims ("12–20 calls → 3–4") until measured.

---

## 7. Explicitly not adopted (with reasons)

| Item | Reason |
|---|---|
| Langfuse self-hosting (B4) | Four data services on one Windows/WSL2 box; JSONL ledger + CSV covers the need for six weeks |
| Sub-agent tree as primary architecture | Dossier demotion + Cognition's write-heavy warning; pilot-only |
| Hand-mapped repo keyword maps in the shipped prompt | Overfits public repos; hidden set is private repos |
| The 12 pre-invented bug categories | Replaced by data-derived codebook |
| SWE-bench Verified as headline external benchmark | Contaminated/deprecated; Pro slice only, post-hoc |
| LoRA before the Q1 fixes | Plan's Track-2 gating already holds; paper covers Tuning track via the compliance-objective proposal |

---

## 8. Provenance and quality

- Sources: `input/kagglecomp/docs/markdown/Kaggle-00…04`, `bcf/BCF-Reference-Compendium.md`, `bcf/BCF-contestsubmission_dossier_20260928.html` (text extracted to `scratch/dossier-text.txt`), plus the repo's own `deliverables/2026-09-30/01…02` as the integration baseline. No external claims introduced in this document; the whitepaper-math and prior-research work lives in the Task-2 companion and carries its own citations.
- Every dossier-derived number above is either an Illustrative marker (httpx turn counts) or a Designed/Unstarted status from its §4–5 registers — this document does not promote them to measurements.
- Table QC: run after writing (see the session's QC log); all tables validated for separator and cell-count consistency.


---

<!-- ====================================================================== -->
<!-- FILE: 102-bcf-diagnostic-math-and-prior-research.md -->
<!-- ====================================================================== -->

# The Diagnostic Mathematics of BCF — Fault Interference, Fault Masking, Chained Faults — and the Prior Research Behind Them (Task 2)

*Prepared 2026-09-30. Companion deliverable to [01-bcf-integration-into-master-plan.md](01-bcf-integration-into-master-plan.md) (which covers Task 1 and the whitepaper v3 skeleton; this document supplies its §2 "Diagnostic model" and its §9 "Related work"). Sources: `input/kagglecomp/` (official competition docs), `bcf/BCF-contestsubmission_dossier_20260928.html` (dossier; text extracted to `scratch/dossier-text.txt`), and the prior-research corpus assembled in `scratch/research-faultmask-bcf-2026-09/` (every citation below was title- and DOI-verified against Crossref or the arXiv API on 2026-09-30 — see §19).*

---

## 0. Direct answer first: yes, you have described named mathematical phenomena

Your statement — *"classifying errors into exception classes … effectively limits the search space to the most probable root causes … the speed and overall effectiveness of the algorithm will simply depend on the adjustments to the number and fidelity of the exception categories"* — is a compressed, informal description of **four established results**, plus two structural models your httpx example implicitly uses:

| # | Your phrase | Named phenomenon | One-line formal statement | Where it lives in the literature |
|---|---|---|---|---|
| 1 | "limits the search space to the most probable root causes" | **Bayesian posterior pruning** (sequential diagnosis) | P(r \| c, e) ∝ P(c \| r) · P(r \| e); search the q-credible set instead of the whole space | Reiter 1987; de Kleer & Williams 1987; Pattipati & Alexandridis 1988 |
| 2 | "classifying errors … solve more issues sooner" | **Mutual information** — the value of a diagnostic observation | I(C;R) = H(R) − H(R \| C) bits: the entropy removed from the root-cause variable by knowing the class | Shannon-information test selection; Pattipati & Alexandridis 1988 |
| 3 | "the **number** of … exception categories" | **Refinement monotonicity of mutual information** | A finer class partition C′ (C = f(C′)) never lowers the ceiling: I(C′;R) ≥ I(C;R) | Follows from the data-processing inequality |
| 4 | "the … **fidelity** of the exception categories" | **Data-processing inequality** | The classifier is a noisy channel R → C → Ĉ, so I(R;Ĉ) ≤ I(R;C): fidelity caps what number can deliver | Information theory; applied to diagnosis via Pattipati's noisy-test models |
| 5 | fault masking (implicit in httpx_6821) | **Fault dominance / observability partial order** | f ⊒ g iff while f is present, no execution reveals g — a pre-order on faults | ATPG: Pomeranz & Reddy 2005; Dwarakanath & Blanton 2002 |
| 6 | multi-step, chained issues (implicit) | **Masking DAG + topological fix order** (sequential diagnosis by peeling) | Masking edges among a task's faults form a DAG; only topological orders are efficient fix sequences; each fix converts a compound diagnosis into an incremental one | Reiter 1987 (incremental diagnosis); Kuhn & de Kleer 2010 (hidden interactions); Debroy & Wong 2009 |

The punchline for the whitepaper: items 3 and 4 together are exactly your "number and fidelity" sentence. **Number raises the information ceiling; fidelity determines how much of that ceiling the classifier realizes.** Because richer category systems also make each category's training evidence sparser (noisier classifiers), the *realized* information I(R;Ĉ) has an interior optimum in the number of classes — a testable, quantitative claim (§9).

---

# Part I — The math, fleshed out

## 1. Setup: repository debugging as sequential diagnosis

Model an agent working a GitHub issue as a sequential decision process:

- **Candidates** R: the possible root-cause *locations* — files, functions, or (in this competition) symbols in the provided call graph. Let R be the random variable taking values r in a set of size n (hundreds to low thousands for the four competition repos).
- **Prior** P(r): before reading the issue carefully, where do bugs live? In BCF this comes from the GraphRAG brain: bug-pattern nodes, centrality scores of the task's graph, training-patch statistics.
- **Evidence** e: the issue text — traceback, expected-vs-actual phrasing, API names, reproduction sketch.
- **Classification** c: BCF's Phase-1a gate maps issue text (issue text only — `test_patch` is hidden at scoring time) to an exception class c ∈ C = {logic, edge-case/API-contract, crash, feature}.

The classification step is an **evidence generator**: each class carries class-conditional likelihoods P(c | r) (which root-cause patterns produce issues *reading* like class c) and class-specific spec templates (which fix shapes and verification strategies apply). After classification, the agent searches the posterior

```
P(r | c, e)  ∝  P(c | r) · P(r | e)
```

and searches it in order: BCF localizes by walking `called_by` edges from symptom sites and re-ranks by graph centrality — i.e., it enumerates candidates in approximate posterior order rather than exhaustively.

**Expected-cost form.** If localizing+verifying one candidate costs α turns (read, grep, or graph query), and the spec/patch/validation overhead is β turns, then expected turns ≈ α·|S_q(c)| + β, where S_q(c) is the **q-credible set** — the smallest set of candidates whose posterior mass, given class c, reaches q (say 0.8). Classification "works" exactly when it shrinks |S_q|: a good class concentrates posterior mass on few candidates.

## 2. The information budget of classification

The right currency for "limits the search space" is **bits**. Before classification, the agent's uncertainty about the root cause is the entropy H(R). Knowing the class c reduces it to H(R | C). The value of the classification system is the **mutual information**

```
I(C;R) = H(R) − H(R|C)
```

Under any near-optimal search (each probe splits the remaining candidate set roughly in half — which is what graph-narrowing tries to do), isolating the root cause among m equiprobable candidates costs about log₂ m probes; so **each bit of I(C;R) is roughly one saved probe**, and the taxonomy's class × root-cause contingency table (Category A data) directly estimates this quantity (§8).

### 2.1 Number of categories — the refinement ceiling

If you split classes into finer subclasses (C′ refines C, meaning C is a function of C′), then

```
I(C′;R) ≥ I(C;R)      (monotone under refinement)
```

So *in principle* more categories never hurt the ceiling — a 40-class taxonomy can carry more bits than a 4-class one. This is the mathematical content of "adjusting the **number** of exception categories."

### 2.2 Fidelity — the data-processing cap

The classifier is imperfect. Write Ĉ for the class the classifier actually outputs (from issue text alone, by a heuristic or a model) and C for the class a perfect oracle would assign. The chain R → C → Ĉ (root cause determines true class; true class plus noise determines observed class) gives the **data-processing inequality**:

```
I(R;Ĉ) ≤ I(R;C)
```

Only I(R;Ĉ) — the *realized* information — saves turns. Fidelity is the ratio of realized to ceiling information, and it degrades as categories multiply: with 129 training tasks, a 40-way classifier sees ~3 tasks per class and its P(Ĉ ≠ C) grows. This is the mathematical content of "**fidelity** of the exception categories."

### 2.3 The interior optimum — the statement you can own

Combining 2.1 and 2.2:

> *Realized diagnostic information I(R;Ĉ) is maximized at an intermediate number of exception categories: few classes waste the refinement ceiling; many classes starve the classifier of per-class evidence (fidelity), and the data-processing inequality taxes every bit of lost fidelity.*

This is quantitative, falsifiable, and cheap to test on your own pipeline (§9, Prediction 6). A supporting aside: **Fano's inequality** runs the argument in reverse — noisy class observations lower-bound the localization error, which is the same statement read as a floor instead of a cap. (One sentence in the paper; it shows the judges — graph-ML people who know these inequalities cold — that the machinery is being used correctly, not decoratively.)

**Where this lands in BCF as built:** the routing rule from the dossier ("if classifier accuracy falls below ~70% on validation, fall back to one universal spec template") is a coarse, operational version of exactly this trade-off.

## 3. Fault interference — when additivity breaks

Define the observable behavior of the program under fault set F as obs(F) — the set of failing tests / symptoms. Diagnosis is easy when faults are **additive**:

```
additive:      obs(F ∪ G) = obs(F) ∪ obs(G)
interference:  obs(F ∪ G) ≠ obs(F) ∪ obs(G)   (something extra appears or disappears)
```

Under additivity, a localization method can score each candidate independently: each fault's failing tests point at it alone. Interference breaks this: the joint symptom set is not the union of the parts, so per-candidate scoring (any spectrum-based method, any per-bug prior — including BCF's class-conditional priors) is systematically wrong. The diagnosis literature calls these **hidden interaction faults** (Kuhn & de Kleer 2010): pairs that the component-level model, however good, cannot predict — because the interaction lives in the *composition*, not in either component. Debroy & Wong (2009) studied exactly this for programs with multiple bugs: when two faults co-exist, single-fault debugging techniques and test-suites designed per-fault can fail in characteristic ways. The coupling-effect literature (Offutt 1989) is the optimistic counterweight: empirically, most fault pairs remain effectively independent — tests that detect simple faults detect most coupled ones — which is *why* additive methods work most of the time, and why interference cases are the valuable minority a paper can own.

**Why classification alone cannot handle interference — and what must be added.** Exception classes are properties of *single* faults (how the issue reads). Interference is a *relational* property of *pairs* on shared execution paths. The structural test is graph-local:

> Two faults can interfere only if they share state or control flow — i.e., if their symptom sites lie on intersecting paths in the call graph (a shared intermediate symbol, a hub node both touch, or one fault's site on the `called_by` path between the other's site and the test).

This is directly computable with the competition's assets: `get_code_subgraph`, `calls`/`called_by` edges, and the centrality table from the Category-B analyses. BCF's response to a flagged interference risk is not a smarter score — it is **incremental re-diagnosis**: fix one fault, re-run the gates, and let the new symptom set re-enter the evidence (Reiter's diagnosis is sound under exactly this incremental addition of observations). The spec's `depends_on` field records the predicted interaction before any edit is made.

## 4. Fault masking — the observability partial order

Masking is the cleanest special case of interference — the symptom set *shrinks* instead of growing:

```
f masks g  (write f ⊒ g):   obs({f, g}) = obs({f})
```

While f is present, no execution reveals g — g is unobservable, in the strongest sense: no test, no reading of the code, and no amount of reasoning over the *current* failure output can point at it. This is the program-level descendant of **fault dominance** in circuit testing (Pomeranz & Reddy 2005; Dwarakanath & Blanton 2002), where dominance relations are exploited to collapse the fault universe — there, dominance is good news (you don't have to test the dominated fault); for debugging agents it is the bad news that defines the hard task class: **a masked fault is invisible until its masker is removed.**

Two consequences an algorithm designer must respect:

1. **Diagnosis is inherently sequential, not joint.** Any method that attempts one-shot localization over the initial symptom set is structurally blind to g. Sound behavior is *peeling*: fix the dominant fault, re-observe, re-diagnose. (This is why multi-fault SBFL — which tries to score all faults from one spectrum — degrades so sharply, and why its best remedies, Barinel's Bayesian multi-fault model and M-Seer's clustering-into-single-fault-groups, are elaborate workarounds for a problem that peeling solves by construction. §12–13.)
2. **"Tests pass" is not "fault absent."** The mirror image is *coincidental correctness* — tests that pass although the fault is present (Abou Assi et al.; Feyzi & Parsa 2020). In BCF terms this is the reason for gate G6 (no-regression on adjacent tests) and the "binary done" tenet: a green run after fix 1 licenses proceeding to the *next* hypothesis, not declaring victory.

## 5. Chained, multi-step faults — the masking DAG and the cost of order

When a task contains k faults with masking relations among them, order the faults by f ⊒ g (f masks g). On a real task's test suite this relation is (close to) a **DAG** — cycles would mean mutually invisible faults, which no test set can ever resolve. Then:

- **Valid peeling orders = topological orders of the DAG.** Any topological order fixes each fault while it is already observable.
- **fix_order IS the topological sort.** The dossier's spec schema says it exactly: *"a bug that only becomes reachable after another is fixed is ordered second"* (dossier §Phase 2). The schema field `fix_order` and its validator ("must be a valid topo sort") are the masking DAG, operationalized.
- **The O(k²) pathology.** An agent without the order treats the visible symptom (the masker's symptom) as *the* bug, patches its site, sees no improvement, and either reverts a correct-but-insufficient fix or re-diagnoses from scratch. Each wrong-order attempt costs roughly a full diagnose–patch–validate–recover cycle, and the expected number of such attempts grows quadratically in k for undirected search — O(k²) wasted turns versus O(k) for a topological march. (Naive expected wrong-order attempts ≈ k/2 at step 1, (k−1)/2 at step 2, … ⇒ Σ ≈ k²/4.)

**Why gates matter as much as the order.** Two BCF mechanisms convert "correct order" into "few turns":

- **Gate G6 + instant revert + 3-strike rescue** prevent the classic self-sabotage: agent fixes fault A correctly, remaining symptoms make it look like the fix failed, agent *undoes* the fix. The no-regression gate makes each applied fix a monotone ratchet — the fault set only shrinks.
- **The breadcrumb journal is sequential-test bookkeeping**: it records which hypothesis each action served, so the agent cannot re-derive an already-refuted candidate. In information terms, it preserves the accumulated negative evidence — the log of the peeling process — which is precisely the state a sequential-diagnosis engine must carry (Pattipati & Alexandridis 1988 select each next test to maximize expected information gain, given the accumulated record; the journal *is* that record, kept by a 4-GPU-cheap mechanism: prose in a file).

### 5.1 The httpx_6821 worked example [ILLUSTRATIVE]

*(Constructed teaching example from the dossier, Turn 5; the dossier itself flags it: "httpx_6821 is a task I invented … It is not in the competition dataset." Keep this label in the paper — it is the difference between a worked example and a fabricated result.)*

Task: 3-hop redirect chain `http://example.com → https://example.com → /login → /dashboard`; two asserts fail: `len(r.history) == 3` and `r.history[0].stream`.

| Fault | Site | Symptom | Masking |
|---|---|---|---|
| Bug 1 | `httpx/_client.py:519` — `history = []` on scheme change in `_send_handling_redirects()` | history shorter than the chain | **masker** |
| Bug 2 | `httpx/_models.py:310` — `assert self._stream is not None` in `Response.stream` | AssertionError on consumed redirect response | **masked**: with Bug 1 active, `history` is empty, so no code ever touches a redirect response's `.stream` — Bug 2 is dead code until Bug 1 is fixed |

DAG: Bug 1 → Bug 2 (single edge). `fix_order = ["bug1", "bug2"]`.

Dossier trace comparison [ILLUSTRATIVE]: the naive agent fixed Bug 2 first (grep finds the lone assert in 3 turns — *the easy fault is the masked one*), discovered Bug 1 only at turn 16 after the assert fix changed the symptom set, burned 3 wrong edits and recovery turns, finishing at 30 turns. The BCF agent spent one turn writing the spec (hypotheses for both faults + fix_order), then walked the topological order: 10 turns, 0 wrong edits. The dossier's own summary is the thesis sentence for this whole section:

> *BCF's spec step didn't find the bugs faster — it found them in the right order. That's the asymmetry: spec-writing costs one turn and eliminates all recovery turns.*

### 5.2 The turn model, stated honestly for the paper

Expected turns, k faults, masking chain of depth d, per-cycle costs t_loc (localize), t_patch, t_val (validate):

```
Topological order:   E[T] ≈ k·(t_loc + t_patch + t_val) + t_spec          (linear)
No order, no gates:  E[T] ≈ k·(t_loc + t_patch + t_val) + O(k²/4)·t_rec   (recovery dominates)
```

where t_rec is the re-diagnosis+revert cost of a wrong-order attempt. This is a *model*, not a theorem — the honest paper move is to present it as the design rationale (why fix_order and G6 exist) and then measure its signature: the turn gap between configurations should grow with fault count and masking depth (Prediction 7).

## 6. What in BCF implements each piece of the math

| Math object | BCF mechanism | Ledger field that measures it |
|---|---|---|
| Prior P(r) | GraphRAG brain: bug-pattern nodes, centrality, fix templates | `graph_calls`, `turn_first_graph` |
| Evidence e; class likelihood P(c \| r) | Phase-1a classification gate (issue text only) + class-specific spec templates | classifier accuracy vs taxonomy gold |
| Posterior search P(r \| c, e) | Dual-query localization: error-language query + API-structural query; `called_by` symptom→cause walk; centrality tie-break | `gold_file_hit`, `localization_calls` |
| Refinement / DPI trade-off | Category count vs classifier-accuracy tuning; <70% → universal-template fallback | accuracy-per-granularity table |
| Masking DAG; topo order | `depends_on` + derived `fix_order`; validator enforces topo sort | `fix_order_error` (multi-bug tasks only) |
| Peeling / incremental diagnosis | Fix → G6 no-regression → re-run targets → *new symptoms re-enter evidence* → re-classify within class | per-fix turn deltas |
| Sequential-test record | Breadcrumb journal (tested hypotheses never re-derived) | `repeat_action_rate` |
| Credible-set discipline | Phase scoping: no file access before a valid spec (G0) | zero-pre-spec access count |
| "Tests pass ≠ done" (coincidental correctness) | G4 targets-pass + G6 no-regression + binary-done tenet | false-approval telemetry |

## 7. How to compute the paper's numbers from data you already planned to collect

1. **I(C;R) from the taxonomy.** Build the contingency table class × `root_cause_symbol` (or coarser: root-cause file) over the 129 labeled tasks; estimate I(C;R) with the plug-in estimator, report a bootstrap CI over tasks, and note plug-in bias (underestimates MI when cells are sparse — one sentence citing the standard caveat; with ~129 tasks and ≤12 classes it is mild but real).
2. **Realized I(R;Ĉ).** Replace the true class with the classifier's output class in the same estimator; the ratio realized/ceiling is the fidelity number, and repeating both at several codebook granularities traces the interior-optimum curve (Prediction 6).
3. **The O(k) vs O(k²) signature.** From Config-1/2/3 runs: turns vs taxonomy `num_root_causes`, split by `fix_order_error`; the model predicts Config-1 slopes grow superlinearly in k, Config-3 linearly, with the divergence starting at k ≥ 2 (Prediction 7).

## 8. Whitepaper-ready section: "A Diagnostic Model of Exception-Class Gating" (DRAFT for v3 §2)

*Paste target: v3 §2, between the intro and the architecture section. ~650 words as drafted — trim to ~450 for the 3,000-word cap and move the derivations (credible sets, the refinement and DPI arguments, the cost model) to an appendix or the arXiv long version. Bracketed citations map to the bibliography in §19.*

> **2. A diagnostic model of exception-class gating.**
>
> Solving a repository-level issue is a sequential diagnosis problem: the agent maintains a set of candidate root causes and spends its scarcest resource — tool calls — narrowing it. We model the root cause as a random variable R over program locations (symbols in the task's call graph), with a prior P(r) supplied by the framework's knowledge graph (bug-pattern frequencies, symbol centrality). The first decision BCF makes is a classification: from the issue text alone — the only evidence guaranteed available at test time — it assigns the issue to an exception class C ∈ {logic error, edge-case/API contract, crash, feature request} and routes to a class-specific specification template.
>
> This step is an evidence generator in the Bayesian sense. Each class carries likelihoods P(c | r) — the root-cause patterns that produce issues reading like c — so the search proceeds over the posterior P(r | c, e) ∝ P(c | r) · P(r | e), restricted in practice to the q-credible set: the smallest candidate set covering most of the posterior mass. The value of the classification is the entropy it removes, I(C;R) = H(R) − H(R|C). Under a near-optimal search that halves the candidate set with each probe — the intended behavior of graph-narrowing localization — each bit of mutual information converts to roughly one saved probe. Exception-class gating is therefore not a stylistic prompt device but an information channel between the issue report and the search order.
>
> Two classical results bound the design space. Mutual information is monotone under refinement: splitting classes into subclasses never lowers the ceiling I(C;R) — in principle, more categories carry more bits. But the data-processing inequality bounds what any real classifier realizes: with true class C and classifier output Ĉ forming the chain R → C → Ĉ, we have I(R;Ĉ) ≤ I(R;C). Realized information — the only kind that saves turns — is capped by fidelity, and fidelity decays as categories multiply because each class's training evidence grows sparser. The number and the fidelity of the exception categories are thus not independent knobs but a single trade-off with an interior optimum, and our taxonomy makes it measurable: the class × root-cause contingency table estimates I(C;R), and substituting the classifier's output estimates I(R;Ĉ).
>
> Classification alone cannot, even in principle, handle the hardest task class. Let obs(F) denote the observable failures under fault set F. When faults are additive — obs(F ∪ G) = obs(F) ∪ obs(G) — class-conditional priors compose correctly. Interference breaks additivity: hidden interaction faults [Kuhn & de Kleer 2010] live in the composition of two faults, not in either one, and studies of multi-bug programs show single-fault techniques degrade precisely in these cases [Debroy & Wong 2009]. Masking is the extreme: f masks g when obs({f, g}) = obs({f}) — a dominance relation imported from circuit testing [Pomeranz & Reddy 2005] — and while the masker is present, no execution, test, or reading of the current failure output can reveal the masked fault. In our running illustration (httpx_6821; constructed), a redirect-history bug guarantees that no code ever touches a redirect response's stream, so an assertion bug in the stream accessor is unreachable — dead code — until the history bug is fixed.
>
> Multi-fault tasks must therefore be solved by peeling, not joint localization: fix the dominant fault, re-validate under a no-regression gate that turns each fix into a ratchet, let the new symptoms enter the evidence, and re-diagnose — the regime under which consistency-based diagnosis remains sound [Reiter 1987]. Masking relations among a task's faults form a directed acyclic graph, and efficient fix sequences are its topological orders. BCF operationalizes this directly: the specification's `depends_on` field records predicted masking edges, a derived `fix_order` is validated as a topological sort, and the breadcrumb journal preserves the peeling process's negative evidence so no hypothesis is re-derived. The cost model is the design rationale for these gates: with k faults, a topological march costs O(k) diagnosis–patch–validate cycles, while undirected search pays O(k²) expected recovery turns — re-diagnosis, wrong-order patches, and the reverting of correct-but-insufficient fixes that the no-regression gate exists to prevent. Our pre-registered predictions test precisely this signature: the turn gap between gated and ungated configurations should grow with fault count and masking depth.

## 9. Pre-registered predictions 6–8 and threats to validity

*(Extends the five predictions in the Task-1 deliverable §6.3 — renumber continuously in the paper so all eight sit together.)*

6. **Granularity optimum.** Sweep the taxonomy codebook granularity (merge to ~3 and ~6 levels, versus the data-derived ~12): realized information I(R;Ĉ) and precision@3 of routed search peak at an intermediate level, declining at both extremes — few classes waste the refinement ceiling; many classes erode classifier fidelity.
7. **Interaction signature.** On multi-fault tasks (taxonomy `num_root_causes` ≥ 2): the Config-1 → Config-3 turn delta exceeds the single-fault delta (interaction effect); Config-1 turns grow superlinearly in k while Config-3 stays approximately linear; `fix_order_error` rate is higher in Config 1 than Config 3 on masked-fault tasks.
8. **Symptom-patch rate.** The fraction of crash-class patches touching only the traceback file is higher in Config 1 than Config 3, concentrated on tasks whose masker lies upstream (on the `called_by` path) of the traceback site.

**Threats to validity (for the paper's discussion section):**

- **Model vs measurement.** I(C;R), credible sets, and the O(k²) term are design-rationale models; measured turns will deviate (probe cost is not a constant α; probes are not perfect bisections). Report the fit, not an identity.
- **Small-sample MI estimation.** 129 tasks make the plug-in MI estimator biased low (sparse cells); report bootstrap CIs and note the bias — the granularity sweep compounds sparsity with every split.
- **Single-labeler taxonomy.** Class and root-cause gold come from one labeler; the 20-task second-rater κ sample mitigates but does not eliminate.
- **httpx_6821 is illustrative.** The worked example carries its label and is never aggregated with measured results.
- **Classifier priors from four public repos.** The hidden set uses private repos; all anchors must be runtime-derived (the anti-overfit rule) or the fidelity analysis does not transfer.
- **Interference is a minority class.** Offutt's coupling effect suggests most tasks are single-fault or additive; the multi-fault n may be small — report n and CIs, and treat a null result on Prediction 7 as informative rather than fatal.

---

# Part II — Prior research: fault interference, fault masking, and issue solving

*(Every claim about a paper below is limited to what its verified title/abstract and standard knowledge of the field support; where I characterize results beyond the abstract, the wording is hedged accordingly.)*

## 10. The map

| Strand | Core question | Key works (all citation-verified, §19) |
|---|---|---|
| A. Model-based diagnosis (MBD) | Formal diagnosis from first principles; multiple faults; incremental evidence | Reiter 1987; de Kleer & Williams 1987; Kuhn & de Kleer 2010 |
| B. Interference & masking in software | When do multiple bugs break single-bug techniques? | Debroy & Wong 2009; Offutt 1989; Pomeranz & Reddy 2005; Dwarakanath & Blanton 2002 |
| C. Spectrum-based fault localization (SBFL), multi-fault | Scoring candidates from pass/fail spectra when faults > 1 | Jones & Harrold 2005; Abreu et al. 2009a, 2009b; Steimann & Frenkel 2012; Chatterjee et al. 2023; Wong et al. 2016 survey |
| D. Failure isolation | Reducing a failure to a minimal cause | Zeller 1999; Zeller & Hildebrandt 2002 |
| E. Change impact / co-change | Which edits travel together (fix-level interaction) | Ren et al. 2005 (Chianti); Beyer 2006; Xia et al. 2015 |
| F. Coincidental correctness | Tests that pass despite the fault | Abou Assi et al. (Defects4J study; STVR 2021); Feyzi & Parsa 2020 |
| G. Repo-level LLM agents on issues | The benchmark/agent lineage BCF competes in | SWE-bench; SWE-agent; Agentless; AutoCodeRover; LLM-FL trio; PRAXIS; Neural Granger; MicroRCA-Agent |

## 11. Strand A — model-based diagnosis: the formal skeleton BCF stands on

**Reiter (1987), "A theory of diagnosis from first principles"** — the foundation: given a system description, a set of components, and observations, a *diagnosis* is a minimal set of component assignments whose abnormality is consistent with observations. Two results BCF leans on: (i) diagnoses come from *conflicts* (minimal inconsistent subsets), giving a principled way to keep a *set* of candidates rather than one guess — the BCF-Spec's hypothesis list is a candidate diagnosis in Reiter's sense; (ii) diagnosis is *incremental*: adding observations (new failing tests after a fix) soundly prunes the candidate set — the formal license for peeling.

**de Kleer & Williams (1987), "Diagnosing multiple faults"** — the multiple-fault extension and the General Diagnostic Engine: candidate diagnoses are ranked probabilistically, and *conflicts* discovered during probing generate new candidates. Their architecture — generate candidates from conflicts, rank, probe, update — is the abstract shape of BCF's classify → hypothesize → fix → re-validate loop.

**Kuhn & de Kleer (2010), hidden interaction faults** — the paper that names the exact obstacle: with incomplete models (all real program models are incomplete), some multi-fault diagnoses are *unreachable by reasoning about components individually*; they surface only through interaction. This is the citation for "classification of individual faults cannot, even in principle, enumerate masked faults."

**Pattipati & Alexandridis (1988)** — sequential fault diagnosis with information theory: choose each next test to maximize expected entropy reduction (mutual information), with expected-cost optimization via heuristic search. This is the formal version of "solve more issues sooner per turn," and the intellectual ancestor of §2.

## 12. Strand B — fault interference and masking, empirically

**Debroy & Wong (2009), "Insights on Fault Interference for Programs with Multiple Bugs" (ISSRE)** — the direct precursor: an empirical study of how multiple bugs in a program interfere, i.e., when single-bug assumptions (and single-bug debugging) fail. The paper's program-level definition of interference is the one formalized in §3 above.

**Offutt (1989), the coupling effect** — the classic hypothesis that complex faults are coupled to simple ones (test sets detecting simple faults detect most coupled faults), with empirical support. For BCF this is the *frequency prior*: interference and masking are real but a minority — exactly the "valuable minority" a specialized mechanism (fix_order, peeling) can win on without the general case regressing.

**Fault dominance in ATPG — Pomeranz & Reddy (2005); Dwarakanath & Blanton (2002)** — the circuit-testing theory of dominance/equivalence relations among faults. BCF's masking order ⊒ is the deliberate transplant of this relation from hardware testing to program debugging — and the ATPG experience (dominance collapsing shrinks fault universes) motivates the graph test in §14 for *predicting* masking pairs.

## 13. Strand C — what SBFL teaches about multiple faults (and why BCF peels instead)

**Jones & Harrold (2005)** Tarantula and the **Wong et al. (2016)** survey define the single-fault baseline: score each line by suspiciousness from test spectra. **Abreu, Zoeteweij & van Gemund (2009a)** "Spectrum-Based Multiple Fault Localization" (Barinel) and their **(2009b)** practical evaluation (Ochiai) show both the promise and the wall: with multiple faults, spectra superpose and single-fault suspiciousness degrades sharply; Barinel addresses it with a Bayesian model over *sets* of faulty components. **Steimann & Frenkel (2012)** show that SBFL under multiple faults improves dramatically when failing tests are first *clustered into single-fault groups* — i.e., when the multi-fault problem is decomposed into single-fault problems. **Chatterjee, Campos, Abreu & Roy (2023)** extend multi-fault SBFL with LLM-augmented augmentation — the current frontier of the joint-localization approach.

**The relevance fork for BCF:** M-Seer's clustering and BCF's peeling are cousins — both decompose multi-fault into single-fault problems — but M-Seer clusters *test spectra* (requires running the suite against candidate patches), while BCF orders *faults by masking dependency* from the issue text and the call graph, before any test run, and validates each step with gates. That contrast is a legitimate related-work paragraph: same insight, different observability source (dynamic vs. static/graph).

## 14. Strand D/E — isolation and co-change: identifying interference-prone scenarios

**Zeller (1999; Zeller & Hildebrandt 2002, delta debugging)** — systematically shrinking failure-inducing input/configurations to minimal causes, and tracing *cause transitions*. BCF's rescue mode R2 ("establish a minimum working baseline before induction") is delta-debugging logic applied to the agent's own trajectory: get to a minimal verified state, then add complexity back one hypothesis at a time.

**Change impact and co-change — Chianti (Ren et al. 2005), Beyer (2006), Xia et al. (2015)** — the fix-level mirror of fault interference: edits that historically change *together* (atomic co-changes) are the fix-units whose decomposition is unsafe. For BCF this yields a concrete, computable predictor of interference risk: two symptoms whose historical fix-commits (training patches, in competition terms) co-change, or whose sites share a call-graph neighborhood, are interaction suspects → force an explicit `depends_on` decision in the spec rather than assuming independence.

**Synthesizing the "identification" question** (your explicit ask: *where can interference occur?*), prior work triangulates to four computable predictors, all implementable on competition assets:

| Predictor of interference/masking | Signal | Available from |
|---|---|---|
| Shared execution path | Symptom sites connected by `calls`/`called_by` paths or sharing an intermediate hub symbol | task call graph (`get_code_subgraph`, centrality from Category-B analyses) |
| State-carrying hub | A mutable object threading through both sites (as `Response`/history does in httpx_6821) | graph node centrality + code reading of hub invariants |
| Co-change history | Fix-commits that historically touch both regions atomically | training patches / commit history in snapshots |
| Coincidental correctness | Tests that pass while a fault is present → that fault is masked by construction | failing/passing test sets at validation time (Abou Assi et al.; Feyzi & Parsa 2020) |

## 15. Strand F/G — the modern lineage BCF is judged against

**SWE-bench (Jimenez et al.)** created the evaluation world (real GitHub issues, hidden tests); **SWE-agent (Yang et al.)** defined the agent-computer interface; **Agentless (Xia et al.)** showed a rigid three-phase pipeline — localization → repair → validation — beating agent-y approaches at lower cost: the strongest published evidence that *structure, not autonomy*, is where the wins are, and BCF's closest architectural relative (BCF adds: classification routing, spec gates, masking order, rescue). **AutoCodeRover (Zhang et al.)** adds structure-aware search over the AST and uses SBFL when tests exist — the graph-first doctrine BCF inherits. The LLM-FL line (**Yang et al. 2023**, test-free fault localization; **Shao & Yu 2024**, IR+LLM; **Stein et al. 2025**, attention probing) establishes that LLMs localize from *text and structure without running tests* — precisely the regime of Phase 1a, where only issue text is visible. For observability-driven root-cause analysis in distributed systems — the masking problem in another costume — **Neural Granger causal discovery (Lin et al. 2024)**, **MicroRCA-Agent (Tang et al. 2025)**, and **PRAXIS (2025)** represent the graph/RCA frontier; the competition's graph assets make this lineage the judges' home turf. **Eisenstadt (1997)** remains the canonical qualitative evidence that real debugging failures are exactly ordering and masking failures — a perfect epigraph source.

## 16. What is genuinely not in the prior work (novelty positioning for v3)

1. **No prior system composes all four**: issue-text classification routing (LLM-FL does localization, not class-conditional *strategies*), masking-order specs with topological validation (MBD has the theory; no SWE agent ships it), incremental peeling with deterministic no-regression gates (Agentless has phases, not peeling), and graph-based interference prediction over the repo's own call graph.
2. **The measurement itself is a contribution**: an information-theoretic accounting (I(C;R), realized vs ceiling, granularity curve) of *how much diagnostic value classification adds* on a public, reproducible SWE harness — the MI-as-value framing exists in test-selection theory (Pattipati) but has not, to my knowledge, been applied to exception-class routing for repository-level agents. *(Claim to re-verify with a targeted search before submission — flagging it here per the honesty ledger discipline.)*
3. **The taxonomy + `fix_order_error` field** operationalizes multi-fault research (Strand B/C) for agent evaluation — SWE-bench papers report resolution rates, not *ordering errors*; that is an open, cheap, defensible niche.

## 17. Relevance map — finding → BCF mechanism → whitepaper slot

| Prior finding | BCF uses it as | Paper section |
|---|---|---|
| Reiter: minimal diagnoses; sound incremental pruning | Spec hypothesis list; peeling legitimacy | §2 model, §3 |
| de Kleer & Williams: candidate ranking under multiple faults | Posterior over candidates via brain + class | §2 |
| Kuhn & de Kleer: hidden interactions unreachable component-wise | Why classification must be paired with graph structure and re-diagnosis | §3 |
| Pattipati: entropy-optimal test selection | "Bits ≈ saved turns" accounting; journal as test record | §2, §5 |
| Offutt: coupling effect (independence is the norm) | Interference handling must not regress the single-fault majority | threats-to-validity |
| ATPG dominance | Masking order ⊒; graph predictors of masking pairs | §4, §14 table |
| Debroy & Wong: interference is real in multi-bug programs | Motivation; `depends_on` is not speculative machinery | §3, intro |
| M-Seer/Barinel: joint multi-fault localization is hard | BCF peels instead — explicit contrast | related work |
| Delta debugging | Rescue R2 minimum baseline | architecture §3 of v3 |
| Co-change analysis | Co-change predictor of interaction; training-patch mining | §14 table |
| Coincidental correctness | G6/binary-done rationale | architecture |
| Agentless tri-phase, AutoCodeRover structure-search | Closest relatives; BCF's deltas stated against them | related work, intro |

## 18. Slotting into whitepaper v3

- The drafted section below (§8) is written for v3 §2 "Diagnostic model," ~700 words as drafted; trim to ~450 for the 3,000-word cap and push the derivations + predictions to an appendix (the arXiv parallel version can carry the full math — non-archival rules allow this, and the judges' graph-ML roster makes the information-theoretic section a strength, not a risk).
- §14's predictors table can become the paper's Figure 2 ("four computable predictors of fault interference on a task call graph") — it is the single most graph-native result in the package.
- Pre-registered predictions 6–8 below extend the five already listed in the Task-1 deliverable §6.3 — number them continuously there.

## 19. Provenance and citation verification

- **Bibliographic verification:** all 33 references title-verified against Crossref (`api.crossref.org/works/<doi>`) or the arXiv API (`export.arxiv.org`, `id_list` batch) on 2026-09-30, from the research folder `scratch/research-faultmask-bcf-2026-09/`. Two attribution corrections caught by verification: `10.1145/1062455.1062598` is **Chianti** (Ren et al.), not Tarantula (Tarantula = `10.1145/1101908.1101949`); `arXiv:1808.09233` is Abou Assi et al., "Coincidental Correctness in the Defects4J Benchmark." The ISTQB glossary page was fetched but returned an error page and is **not** used as a source.
- **Dossier facts** (httpx_6821 details, fix_order quote, taxonomy fields, 70% routing rule) read directly from `scratch/dossier-text.txt` (Turn 5 ~line 1051; Turn 20 ~line 3341; fix_order definition line 3764; `fix_order_error` line 2672).
- **Evidence discipline:** httpx_6821 numbers carry [ILLUSTRATIVE] per the dossier's own Turn-7 retraction; the MI framework and turn model are presented as *design rationale with measurable signatures*, not measured results; claim 2 of §16 is flagged for a final pre-submission novelty search.

### Bibliography

1. Reiter, R. (1987). A theory of diagnosis from first principles. *Artificial Intelligence*, 32(1). doi:10.1016/0004-3702(87)90062-2
2. de Kleer, J., & Williams, B. C. (1987). Diagnosing multiple faults. *Artificial Intelligence*, 32(1). doi:10.1016/0004-3702(87)90063-4
3. Kuhn, L., & de Kleer, J. (2010). Diagnosis with Incomplete Models: Diagnosing Hidden Interaction Faults. *PHM Society*. doi:10.36001/phmconf.2010.v2i1.1934
4. Pattipati, K. R., & Alexandridis, M. G. (1988). Application of heuristic search and information theory to sequential fault diagnosis. *IEEE ISIC*. doi:10.1109/isic.1988.65446
5. Zeller, A. (1999). Yesterday, my program worked. Today, it does not. Why? *ESEC/FSE*. doi:10.1145/318774.318946
6. Zeller, A., & Hildebrandt, R. (2002). Simplifying and isolating failure-inducing input. *IEEE TSE*, 28(2). doi:10.1109/32.988498
7. Debroy, V., & Wong, W. E. (2009). Insights on Fault Interference for Programs with Multiple Bugs. *ISSRE*. doi:10.1109/issre.2009.14
8. Offutt, A. J. (1989). The coupling effect: fact or fiction. *TAV4*. doi:10.1145/75308.75324
9. Pomeranz, I., & Reddy, S. M. (2005). On fault equivalence, fault dominance, and incompletely specified test sets. *IEEE TCAD*. doi:10.1109/tcad.2005.850822
10. Dwarakanath, K. N., & Blanton, R. D. (S.) (2002). Exploiting dominance and equivalence using fault tuples. *IEEE VTS*. doi:10.1109/vts.2002.1011151
11. Abou Assi, R., Trad, C., Maalouf, M., & Masri, W. (2018). Coincidental Correctness in the Defects4J Benchmark. arXiv:1808.09233
12. Abou Assi, R., Masri, W., & Trad, C. (2021). How detrimental is coincidental correctness to coverage-based fault detection and localization? An empirical study. *STVR*. doi:10.1002/stvr.1762
13. Feyzi, F., & Parsa, S. (2020). CGT-FL: using cooperative game theory to effective fault localization in presence of coincidental correctness. *Empirical Software Engineering*. doi:10.1007/s10664-020-09859-y
14. Jones, J. A., & Harrold, M. J. (2005). Empirical evaluation of the Tarantula automatic fault-localization technique. *ICSE*. doi:10.1145/1101908.1101949
15. Abreu, R., Zoeteweij, P., & van Gemund, A. J. C. (2009a). Spectrum-Based Multiple Fault Localization. *ASE*. doi:10.1109/ase.2009.25
16. Abreu, R., Zoeteweij, P., Golsteijn, R., & van Gemund, A. J. C. (2009b). A practical evaluation of spectrum-based fault localization. *JSS*, 82(11). doi:10.1016/j.jss.2009.06.035
17. Steimann, F., & Frenkel, M. (2012). Improving Coverage-Based Localization of Multiple Faults Using Algorithms from Integer Linear Programming. *ISSRE*. doi:10.1109/issre.2012.28
18. Chatterjee, S., Campos, J., Abreu, R., & Roy, C. K. (2023). Augmenting Automated Spectrum Based Fault Localization for Multiple Faults. *IJCAI*. doi:10.24963/ijcai.2023/350
19. Wong, W. E., Gao, R., Li, Y., Abreu, R., & Wotawa, F. (2016). A Survey on Software Fault Localization. arXiv:1607.04347
20. Ren, X., Shah, F., Tip, F., Ryder, B. G., & Chesley, O. (2005). Chianti: A Tool for Change Impact Analysis of Java Programs. *ICSE*. doi:10.1145/1062455.1062598
21. Beyer, D. (2006). Co-change visualization applied to PostgreSQL and ArgoUML. *MSR*. doi:10.1145/1137983.1138023
22. Xia, X., et al. (2015). Cross-project build co-change prediction. *SANER*. doi:10.1109/saner.2015.7081841
23. Eisenstadt, E. (1997). My hairiest bug war stories. *CACM*, 40(9). doi:10.1145/248448.248456
24. Jimenez, C. E., Yang, J., Wettig, A., Yao, S., Narasimhan, K., & Press, O. (2023). SWE-bench: Can Language Models Resolve Real-World GitHub Issues? *ICLR 2024*. arXiv:2310.06770
25. Yang, J., Jimenez, C. E., Wettig, A., Lieret, K., Yao, S., Narasimhan, K., & Press, O. (2024). SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering. *NeurIPS*. arXiv:2405.15793
26. Xia, C. S., Deng, Y., Dunn, S., et al. (2024). Agentless: Demystifying LLM-based Software Engineering Agents. arXiv:2407.01489
27. Zhang, Y., et al. (2024). AutoCodeRover: Autonomous Program Improvement. *ISSTA*. arXiv:2404.05427
28. Yang, A. Z. H., Martins, R., Le Goues, C., & Hellendoorn, V. J. (2023). Large Language Models for Test-Free Fault Localization. arXiv:2310.01726
29. Shao, S., & Yu, T. (2024). Enhancing IR-based Fault Localization using Large Language Models. arXiv:2412.03754
30. Stein, A., Wayne, A., Naik, A., Naik, M., & Wong, E. (2025). Where's the Bug? Attention Probing for Scalable Fault Localization. arXiv:2502.13966
31. Lin, C.-M., Chang, C., Wang, W.-Y., et al. (2024). Root Cause Analysis in Microservice Using Neural Granger Causal Discovery. arXiv:2402.01140
32. Tang, P., Tang, S., Pu, H., et al. (2025). MicroRCA-Agent: Microservice Root Cause Analysis Method Based on Large Language Model Agents. arXiv:2509.15635
33. PRAXIS: Integrating Program Analysis with Observability for Root-Cause Analysis (2025). arXiv:2512.22113


---

<!-- ====================================================================== -->
<!-- FILE: 103-bcf-simulation-httpx-3672.md -->
<!-- ====================================================================== -->

# 03 — Real-data simulation walkthrough: BCF vs a naive agent on `httpx_3672`

*Prepared 2026-09-30 (set 2, doc 3). Replaces the retired `httpx_6821` illustrative case study as the canonical BCF worked example. Companion to [01-bcf-integration-into-master-plan.md](01-bcf-integration-into-master-plan.md) and [02-bcf-diagnostic-math-and-prior-research.md](02-bcf-diagnostic-math-and-prior-research.md) (§5.1 keeps the old example, correctly labeled).*

---

## 0. Provenance — read this first

This document mixes two evidence classes. Every claim below is tagged:

| Tag | Meaning | Allowed use |
|---|---|---|
| **[V]** | **Verified this session** against the actual competition data package (`tasks.jsonl`, the `httpx_3672` snapshot, the `httpx` graph JSON, `HARNESS_README.md`). File:line receipts in §9. | Anywhere, including the paper (cite the dataset) |
| **[SIM]** | **Simulated agent trajectory** — a constructed walkthrough of how each configuration *is designed to behave*, grounded in [V] artifacts (real code, real tool schemas, real graph nodes). Turn counts are design targets, not measurements. | Teaching example / prompt few-shot / hypothesis, never as a result |

The `httpx_6821` case study failed because an invented task id and invented functions were presented alongside invented turn counts, blurring exactly this line. Here the split is absolute: **the task, the code, the tests, the graph, and the harness behavior are real; only the two agent trajectories are simulated.** No receipt exists for a simulated run (B1 discipline); the replacement for this walkthrough is the measured Config 1/2/3 trace scheduled for Sprints 1–3.

---

## 1. The real task [V]

`httpx_3672` is **the only httpx task in the 129-task training set** (distribution: fastapi 67, rich 48, requests 13, httpx 1 — verified from `tasks.jsonl`).

| Field | Value |
|---|---|
| `instance_id` | `httpx_3672` |
| `repo` / `base_commit` | `encode/httpx` / `4acf5c2c37714cc63b5cf71b3e284fca83c90311` |
| `created_at` | 2025-09-19 |
| `hints_text` | *(empty)* |
| Problem statement (verbatim, 243 chars) | "Server connection handling. ↵ * Add `HTTPParser.keep_alive`. ↵ * Server... always read request to completion on keep alives. ↵ * `HTTPParser.complete` -> `.reset` ↵ * Close streams on server exit. ↵ * Don't raise `KeyboardException` on server exit." |
| Gold patch | 9,385 chars, **7 files**: `src/httpx/{_parsers,_pool,_server,_network}.py` + `src/ahttpx/{_parsers,_pool,_server}.py` |
| Test patch | `tests/test_parsers.py` only — 5 hunks, each replacing `p.complete()` → `p.reset()` |

Note the issue text itself is loose: it says `keep_alive`, the gold implements `is_keepalive()` (matching the existing `is_idle()`/`is_closed()` convention); it says `KeyboardException` (sic; the fix handles `KeyboardInterrupt`). The one load-bearing, unambiguous line is **"`HTTPParser.complete` -> `.reset`"** — an API rename, stated as a mechanical instruction.

Five sub-items in one task, no hints, no traceback, no failing test visible. Per the taxonomy schema this is `task_type: compat_or_refactor` with `multi_bug: true`.

## 2. The real code — four verified traps [V]

Everything in this section was read out of the extracted snapshot (`snapshots/httpx_3672.tgz`). This is what an agent actually faces in Container A.

### Trap 1 — the visible test suite contradicts the graded one

At base commit, `tests/test_parsers.py` calls `p.complete()` at **lines 70, 116, 318, 557, 594** (verified: `grep -rn "\.complete()" tests/` finds these five and no others). The hidden `test_patch` renames exactly those five call sites to `p.reset()`.

The harness then (HARNESS_README §8.2.3–4) **resets all test files to baseline** (`git checkout HEAD` + `git clean -f`) before applying its own `test_patch` in Container B. Consequences:

- If the agent renames `complete`→`reset` in the library (as the issue demands), its **local** `pytest tests/test_parsers.py` goes red with 5 `AttributeError: 'HTTPParser' object has no attribute 'complete'` — evidence that *looks like* the fix is wrong but is not.
- If the agent instead keeps `complete` and only *adds* new methods, its local suite stays green and the **hidden** suite fails with `AttributeError: ... no attribute 'reset'`.
- Any edits the agent makes to test files are **discarded** at verification (anti-tampering reset) — harmless to the score, but invisible-to-the-agent.

The graded truth lives in a file the agent cannot see. The only bridge is the issue text. This is the compendium's "visible_tests_only caveat" (A5.4) made concrete, and it inverts the usual debugging logic: **trust the spec over the local test signal.**

### Trap 2 — a duplicated sync/async tree

The repo carries parallel implementations: `src/httpx/` (sync) and `src/ahttpx/` (async), file-for-file mirrors (verified: identical layout, e.g. `def complete` at `src/httpx/_parsers.py:378` and `async def complete` at `src/ahttpx/_parsers.py:378`). A naive `grep -rn "complete"` doubles every hit list and invites half-tree fixes. The gold patch touches both trees. The task graph exposes the duplication: **239 `ahttpx.*` nodes** among the 740 nodes in `graphs/httpx_4acf5c2c….json` (verified).

### Trap 3 — a latent fault at the call site, not the tested site

`src/httpx/_server.py:92` (and `src/ahttpx/_server.py:92`):

```python
def _complete(self):
    self._parser.complete        # <- no parentheses: attribute access, discarded. A silent no-op.
    self._idle_expiry = time.monotonic() + self._keepalive_duration
```

The server side *never actually resets the parser*. The issue's second bullet ("Server... always read request to completion on keep alives") is partly caused **here**, at a call site the tests never exercise — the hidden tests point at `_parsers.py`, the symptom points at `_server.py`. The gold patch fixes it by rewriting the line to `self._parser.reset()`. This is the real-data analog of "the traceback points at the wrong site": the *test* points at the wrong site.

### Trap 4 — broken ungraded code the issue mentions but tests don't reach

- `src/httpx/_server.py:48`: `err = Response(code=500, content=content)` — but `Response.__init__(self, status_code, *, headers=None, content=None)` (verified, `_response.py:80`). `code=` is not a parameter: the server's 500-error path raises `TypeError` whenever an endpoint throws. Gold fixes to `Response(500, content=content)`.
- `src/httpx/_network.py:163`: `self._streams = list[NetworkStream]` — this assigns a `types.GenericAlias`, not a list (and `self._streams` is otherwise unused at base). Gold fixes to `self._streams: list[NetworkStream] = []` and adds close/prune logic in `__exit__`/`_serve` (issue bullet 4).
- `src/httpx/_server.py:100`: `wait()` is `while(True): sleep(1)` — `KeyboardInterrupt` propagates (issue bullet 5). Gold wraps it in `try/except KeyboardInterrupt: break`.

None of these are reachable from `tests/test_parsers.py`, which is where the graded run looks (pytest targets derive from the test patch — HARNESS_README §8.2.5). They are real bugs, named in the issue, fixed in the gold patch, and **invisible to the score**.

## 3. What the masking structure actually is [V + analysis]

The retired `httpx_6821` example dramatized fault→fault masking: fix bug A, and only then does bug B become observable. The real task teaches something subtler and, for the paper, more useful:

1. **The decisive asymmetry is between two test sets, not two faults.** Local evidence *masks* the graded requirement: the suite the agent can run actively argues against the correct fix. In doc-02 terms, obs(visible suite) ≠ obs(graded suite); a policy that trusts local red over the spec fails here no matter how good its localization is.
2. **The rename is the DAG root.** Until `reset()` exists (with its `-> bool` return and the `is_keepalive()` predicate), the server-side drain logic (bullet 2) has nothing coherent to integrate with. `fix_order` is a genuine topological order: rename → predicate → server integration → (independent) network cleanup and `wait()` hardening. The O(k) vs O(k²) turn model (doc 02 §5.2) applies to the *scope* items; but the task is winnable on the root alone (a rename in the sync parser passes all five graded tests [V — inferred: the hidden tests only call `p.reset()` and assert `is_idle()`/`repr` behavior, which the renamed body preserves]).
3. **A masked latent fault lives at the call site** (Trap 3): no test reveals the missing-parens bug; only reading the caller does. The graph's `calls` edges do not cross file boundaries here (verified: callers of `httpx._parsers.HTTPParser.complete` in the graph are intra-class only), so `get_code_neighbors` will *not* hand the agent this bug — `read_file` on the caller is what reveals it. A useful, honest calibration of what the graph tools can and cannot do on this task.

---

## 4. Simulation A — the naive agent (Config 1) [SIM]

*Config 1 = generic prompt, grep-first, no spec, no gates, no journal (glossary, doc 01). Budget per sample submission: 50 tool calls / 50 turns / 60 min. Tool schemas below are the real ones (HARNESS_README §6); outputs are constructed but schema-accurate.*

| # | Call | Result (abridged) | Note |
|---|---|---|---|
| 1 | `get_status()` | `tool_calls_used: 0, tool_calls_remaining: 50` | free |
| 2–3 | `run_command("grep -rn 'complete' src/ tests/")` then again with `-l` | 12+ hits across **14 files** incl. both trees, tests, `_streams.py` (`HTTPStream.__init__` param named `complete`) | Trap 2 fires: hit list doubled, no model of the dual tree |
| 4–7 | `read_file("src/httpx/_parsers.py", 370, 425)` ×2, `read_file("src/ahttpx/_parsers.py", 370, 425)` ×2 | reads the same method twice in each tree | 150-line read cap forces windowed reads; some turns re-read |
| 8 | `edit_file("src/httpx/_parsers.py", "def complete(self):", "def reset(self) -> bool:")` + 2 more edits for the returns | renames sync parser only | follows the issue's most explicit line |
| 9 | `run_command("python -m pytest tests/test_parsers.py -q")` | **5 failed, 19 passed** — `AttributeError: 'HTTPParser' object has no attribute 'complete'` | **Trap 1 fires**: local red on the correct fix |
| 10–12 | `read_file` the failing tests; `run_command("git diff")` | tests "still call the old API" | no framework for "the graded suite differs from the visible one" |
| 13 | `edit_file` revert of edits 8 (×3) | back to baseline | **the self-sabotage revert** — discards a fix the hidden suite would have accepted |
| 14–19 | additive route: add `is_keepalive()` to sync parser; `read_file` `_server.py`; edits to `_server.py` drain logic that references `self._parser.is_keepalive()`; `run_command("python -m pytest tests/")` | mixed results; some unrelated test file errors from unrelated breakage | chasing the 4 ungraded bullets (Trap 4); `Response(code=500…)` `TypeError` discovered mid-trace |
| 20–26 | `_network.py` poking: fix `list[NetworkStream]`, add stream-close; `run_command` test runs | no visible effect on any test | more ungraded scope |
| 27–33 | re-grep, re-read `_parsers.py` (both trees), re-run pytest; **repeat of call 2 verbatim** | same outputs | no journal → repeats refuted moves; loop begins |
| 34–38 | `edit_file` ahttpx parser rename (half-done), revert part of it | working tree now inconsistent across trees | |
| 39 | *(any tool call)* | response carries `"budget_warning": "Only 10 tool call(s) remaining (40/50 used). Finalize your edits and call submit_patch soon."` | real harness field (§6 preamble) |
| 40–42 | cleanup attempts, one more pytest, `get_status()` | | |
| 43 | `submit_patch()` | `files_changed: 5, patch_size: ~3.1k` | |

**Container B [SIM, mechanism V]:** test files reset → hidden `test_patch` applies → `pytest tests/test_parsers.py` → the five graded tests call `p.reset()` → the additive route never defined `reset` → **5 failures → `resolved = False`.**

**Ledger row (failure codebook):** primary `test_misread` (treated visible-suite red as ground truth over the issue text), secondary `budget_exhausted_exploring` (≈30 of 43 calls before any validated edit), with one full exploratory loop (`repeat_action_rate > 0`).

**Honest caveat:** a lucky naive roll passes. If the agent had *kept* the rename and also updated the five visible call sites (edits that Container B discards anyway), or had aliased `reset = complete`, the graded suite would pass. The failure above is the *modal* trajectory the failure codebook predicts from community reports (exploratory edit loops, test misreads), not a certainty — which is exactly why Config 1 vs 3 is a paired experiment over 30 tasks and not a story about one task.

## 5. Simulation B — the BCF agent (Config 3, flat) [SIM]

*Config 3 = full BCF, flat (no sub-agent tree — dossier correction; A4 handoff packets therefore do not appear). All component IDs reference the compendium / doc 01 integration map. Graph node names and tool outputs below use the real graph's ids [V].*

### Phase 1 — Specification (tenets 2, 4; A6; T20; G0)

| # | Call | Result | Component at work |
|---|---|---|---|
| 0 | `get_status()` | budgets confirmed | free call, first action (protocol) |
| 1 | *(skill)* `bcf-spec` SKILL.md loads (L2) | Phase-1 procedure in context | A7 progressive disclosure — loaded because the phase began, not at startup |
| 2 | *(script)* `run_skill_script("classify_issue", <issue text>)` | `feature` signal: "Add…"; refactor signal: "`complete` -> `.reset`"; no traceback, no expected/got → **routes to compat_or_refactor template with a feature sub-spec** | T20 classification gate — issue text only (test-time rule, doc 01 correction #1) |
| 3 | `write_spec(...)` via schema-validated tool call | spec accepted (below) | A6 — tool-call emission, not hand-written JSON (A6.4) |

The spec (Appendix-A schema of the dossier, real symbols [V]):

```json
{
  "task_class": "compat_or_refactor",
  "anchors": {"identifiers": ["HTTPParser", "keep_alive", "complete", "reset", "KeyboardException"],
              "paths": [], "traceback_frames": []},
  "bugs": [
    {"id": "B1", "hypothesis": "public API rename: HTTPParser.complete -> reset, returning whether the connection was reset vs closed; must land in BOTH trees (src/httpx and src/ahttpx mirror modules)",
     "trigger_or_contract": "issue text: 'HTTPParser.complete -> .reset'",
     "target_symbol": "httpx._parsers.HTTPParser.complete", "fix_shape": "replace", "depends_on": []},
    {"id": "B2", "hypothesis": "new predicate is_keepalive() (naming follows is_idle/is_closed convention, not the issue's literal 'keep_alive')",
     "target_symbol": "httpx._parsers.HTTPParser", "fix_shape": "new_code", "depends_on": ["B1"]},
    {"id": "B3", "hypothesis": "server loop never resets the parser: _server._complete references self._parser.complete WITHOUT calling it (no parens), and no keep-alive drain of the request stream before reset",
     "target_symbol": "httpx._server.HTTPConnection._complete", "fix_shape": "check_add", "depends_on": ["B1", "B2"]},
    {"id": "B4", "hypothesis": "NetworkServer._streams assigned a GenericAlias (list[NetworkStream]) instead of an empty list; streams never closed on exit",
     "target_symbol": "httpx._network.NetworkServer.__init__", "fix_shape": "guard_add", "depends_on": []},
    {"id": "B5", "hypothesis": "HTTPServer.wait() lets KeyboardInterrupt propagate; also Response(code=500,...) raises TypeError (no 'code' kwarg)",
     "target_symbol": "httpx._server.HTTPServer.wait", "fix_shape": "guard_add", "depends_on": []}
  ],
  "fix_order": ["B1", "B2", "B3", "B4", "B5"],
  "feature": {"capability": "keep-alive predicate + server drain", "integration_point": "HTTPParser / HTTPConnection.handle_requests", "shape": "new_code + check_add"},
  "validation_plan": {"repro": "/tmp/repro_reset.py against new API (never inside /workspace)", "tests_to_run": ["tests/test_parsers.py"], "regression_scope": "module"},
  "budget_plan": {"localization_max_calls": 10, "force_submit_turn": 42}
}
```

`G0` passes → file-access tools unblock. `symbol_in_graph: true` for `httpx._parsers.HTTPParser.complete` (a real node id [V]) — logged as a Phase-1 quality signal.

**The spec has already paid for itself:** B3 (the missing-parens fault, Trap 3) and the dual-tree obligation (Trap 2) are *written down before any file is opened*, and the validation plan encodes the asymmetry decision that decides the task.

### Phase 2 — Localization (tenet 2, 3; graph-first)

| # | Call | Result | Component |
|---|---|---|---|
| 4 | `search_similar_code("HTTPParser")` | top nodes: `httpx._parsers.HTTPParser`, `ahttpx._parsers.HTTPParser`, `httpx._server.HTTPConnection`, … (239 `ahttpx.*` nodes exist [V]) | dual-query doctrine, **amended**: symbol-language queries, not prose (§8, new fact #2) |
| 5 | `get_code_subgraph(["httpx._parsers.HTTPParser", "ahttpx._parsers.HTTPParser", "httpx._server.HTTPConnection", "httpx._pool.Connection"])` | mirror structure explicit: two `HTTPParser` classes, two `Connection`s | Trap 2 defused in one call |
| 6 | `get_code_neighbors("httpx._parsers.HTTPParser.complete")` | intra-class neighbors only (`close`, `is_idle`, `recv_body`…) | honest limit: no cross-file callers in this graph (§3.3) |
| 7 | `read_file("src/httpx/_server.py", 85, 105)` | sees `self._parser.complete` (no parens) at :92 and `wait()` at :100 | tenet-3 breadcrumbs begin; B3/B5 confirmed by reading |
| 8 | `read_file("src/httpx/_network.py", 155, 185)` | sees `_streams = list[NetworkStream]` at :163 | B4 confirmed |

Localization: 5 budgeted calls (plan allowed 10). `graph_calls=3`, `turn_first_graph=4`.

### Phase 3 — Patch (tenet 1, 2; fix_order)

Edits in topological order, smallest-change-per-step (call numbers 9–19, two example payloads real [V]):

- **B1** (root): both trees — e.g. `edit_file("src/httpx/_parsers.py", "def complete(self):", "def reset(self) -> bool:")`, plus `return False` / `return True` insertions; `edit_file` ×3 mirroring in `src/ahttpx/_parsers.py`; rename `Connection._complete`→`_reset` + `self._parser.reset()` in both `_pool.py`s; `_server.py`s.
- **B2**: insert `is_keepalive()` before `is_idle()` in both parsers.
- **B3**: `_server.py` ×2 — the drain block after the response send: `if self._parser.is_keepalive(): stream.read()` + `self._reset()`; fixes the no-parens line *as a consequence of the rename* (the old silent statement cannot survive a rename to a method that must be called).
- **B4**: `_network.py` — `self._streams: list[NetworkStream] = []`, close-on-exit, prune in `_serve`; `NetworkStream.is_closed()`.
- **B5**: `wait()` try/except; `Response(500, content=content)`.

Journal tail at this point (A3 schema, ≤30 lines, `/tmp/bcf/httpx_3672/journal.md` — outside the patch):

```markdown
- t=07 | action: read _server.py 85-105 | result: B3 confirmed (no-parens at :92) | note: graph lacks cross-file callers; caller read required
- t=09 | action: edit _parsers.py complete->reset (sync) | result: applied | note: local suite WILL go red; expected — hidden tests renamed (spec: test asymmetry)
- t=12 | action: edit _network.py streams init | result: applied | note: ungraded per validation_plan; issue bullet 4
## Ruled out
- Keeping `complete` and adding `reset` alongside (alias): passes graded tests but leaves API duplicated; violates minimum-path tenet
## Current best patch
- B1+B2 applied both trees; B3 in progress
```

The t=09 entry is the whole ballgame: **the journal records why the coming local red is expected, so the agent cannot later "discover" it and revert** — the exact self-sabotage the naive trace died of.

### Phase 4 — Validation (tenet 4; A5; A8 gates; A2 armed)

| # | Call | Result | Component |
|---|---|---|---|
| 20 | `write_file("/tmp/repro_reset.py", ...)` + `run_command("python /tmp/repro_reset.py")` | exercises `reset()`/`is_keepalive()` new-API contract: PASS | A5 V2b-style repro, **in `/tmp`** (harness gotcha #3: scratch inside `/workspace` leaks into the patch) |
| 21 | `edit_file("tests/test_parsers.py", "p.complete()", "p.reset()")` ×5 | visible suite migrated to the new API | refactor hygiene; edits are discarded in Container B [V] — cost: 5 calls, benefit: local G4/G5 become meaningful |
| 22 | `run_command("python -m pytest tests/test_parsers.py -q")` | **24 passed** | G4 targets-pass |
| 23 | `run_command("python -m pytest tests/test_pool.py tests/test_client.py -q")` | pass | G5 no-regression on adjacent modules |
| — | *(orchestrator)* | G1 scope: all changed files ∈ allowed_files (7 lib files + the migrated test file) ✓ · G2 `git apply --check` ✓ · G3 `ast.parse` on every changed file ✓ · G6 non-empty ✓ | A8; breaker: 0 of 3 strikes; A2 rescue never trips |
| 24 | `submit_patch()` | `{"status": "ok", "files_changed": 8, "patch_size": 9631}` [SIM] | last action, free (§6.1/§10.5) |

**Container B [SIM, mechanism V]:** test-file edits reset (harmless), hidden `test_patch` applies (now consistent with the library), pytest exits 0, JUnit XML all-pass → **`resolved = True`.** Total: 24 tool calls, 0 wrong edits, 0 reverts, 0 loops.

### Ledger artifacts (B5.3 schema) [SIM format, V schema]

```json
{"op":"execute_tool","bcf_phase":3,"tool":{"name":"edit_file","ok":true},"state":{"files_changed":4,"lines_changed":31,"strikes":0,"turn":12},"spec_ref":"sha1:…"}
{"op":"gate","gate":{"id":"G4","pass":true,"failing_tests":[]},"bcf_phase":4}
{"op":"submit","state":{"files_changed":8,"turn":24}}
```

`results.csv` row: `run_id, C3, httpx_3672, encode/httpx, PASS, 24, loc=5, graph_calls=3, turn_first_graph=4, whole_file_reads=0, edits=14, edits_not_in_final=0, gold_file_hit=1.0, spec_file_correct=1, fix_order_error=0`.

## 6. Component → tenet → benefit map (what fired, and what it bought)

| BCF piece | Where it fired (this walkthrough) | Benefit demonstrated | Ledger field that will measure it for real |
|---|---|---|---|
| **Tenet 1** preserve working code | B4/B5 edits additive; no rewrites of `reset` body logic | regression surface stayed zero | `regression_rate` |
| **Tenet 2** minimum-path decomposition | `fix_order` = topo sort; one bug per edit batch; alias route explicitly *ruled out* in journal | no duplicated-API drift; 14 edits all in final patch | `edits_not_in_final`, `fix_order_error` |
| **Tenet 3** breadcrumbs | t=09 "local red is expected" entry; "Ruled out" section | **prevented the self-sabotage revert** (the naive trace's cause of death) | `repeat_action_rate`, `loop_rate` |
| **Tenet 4** binary done | gate vector all-true ⇔ submit | no premature/partial submission | `empty_patch_rate` |
| **A6 spec-first + G0** | calls 1–3 before any file access; `symbol_in_graph` true | Traps 2 & 3 neutralized *pre-exploration*; localization ≤ 5 calls | `localization_calls`, spec-valid rate |
| **T20 classification** | issue-text-only routing to refactor+feature hybrid template | right template despite zero tracebacks and loose wording | classifier-vs-taxonomy accuracy |
| **A5 verification hierarchy** | V2 pytest gates; repro in `/tmp`; model judgment never grants approval | local red interpreted via spec, not vibes | false-approval telemetry |
| **A8 gates** | G1–G6 at calls 22–24 | monotone ratchet: nothing applied gets undone on a later red | gate vectors per run |
| **A2 rescue** | armed (3-strike, 25%-budget trips), never tripped | bounded worst case at no cost here | `rescue_trigger_rate` |
| **A7 progressive skills** | `bcf-spec` L2 loaded at phase start only | prompt budget spent on the current phase | prompt tokens/turn, activation correctness |
| **B5 ledger / B1 receipts** | every row above; this doc carries [V]/[SIM] tags | the walkthrough itself is auditable — the anti-fabrication firewall that caught `httpx_6821` | receipt per real run |
| **T11 compute-in-scripts** | classifier + validator as skill scripts (1 call each) | model's 24 calls spent on decisions, not computation | tool-call mix |
| **Graph tools (C2→C3 delta)** | calls 4–6: dual-tree discovered in 3 calls | Trap 2 defused; honest limit recorded (no cross-file callers) | `turn_first_graph`, `gold_file_hit` |

Not exercised, by design: **A4 handoff packets** (Config 3 is flat pending the Sprint-3 sub-agent pilot — doc 01 §4.2), **B2 HIVE queue / B3 Promptfoo / B4** (dev-time; they wrap this run, they aren't in it).

## 7. What this walkthrough does — and does not — establish

**Does:** ground every structural claim about the task in verified data (the four traps are real and will face every competitor); provide a schema-accurate, prompt-ready few-shot of the intended Config-3 behavior; generate a *pre-registerable* prediction for the paper.

**Does not:** constitute evidence that BCF beats naive on this task (or any task). One task, one simulated roll each, zero receipts. The naive agent passes on a lucky roll (keep-rename-and-migrate-tests, or alias); BCF could fail if the spec misroutes (the classifier's feature signal is real and the template choice is a judgment call). The measured Config 1/2/3 comparison on the frozen 30-task set (Sprint 1–3) is what converts §4–5 from [SIM] to [M].

**New pre-registered prediction (candidate #9, extends doc-01 §6.3):** on rename/refactor tasks where the visible suite still targets the old API, Config 1 exhibits `test_misread` failures (visible-red treated as ground truth → reverts of correct fixes) at a higher rate than Config 3, whose spec carries the issue-text contract past the local signal. Measurable: `failure_code` distribution on the taxonomy's `compat_or_refactor` slice; the mechanism is Trap 1, which exists in the data regardless of agent design.

## 8. New verified harness facts this exercise added [V]

1. **`get_status()` schema confirmed** (HARNESS_README §6.1): budget/patch fields only — **no `failing_tests` field**, confirming the dossier's §4.2 suspicion ("the simulated get_status output… probably does not match the real harness"). Any prompt/teaching material must stop implying tests are readable from `get_status`.
2. **`search_similar_code` needs symbol-language queries**, not free prose: the offline resolver matches query text against node keys/suffixes (§6.3). The dossier's dual-query doctrine stands, but both queries should be symbol-flavored ("HTTPParser", "keepalive") — a wording amendment to the Sprint-3 protocol, worth one line in the paper's implementation notes.
3. **Graph node ids are fully qualified** (`httpx._parsers.HTTPParser.complete`) — exactly the `target.symbol` format the BCF-Spec schema demands; `symbol_in_graph` checks will Just Work, and the id prefix (`httpx.` vs `ahttpx.`) encodes the tree split.
4. **The httpx graph contains both trees** (239 `ahttpx.*` / 740 nodes) but its `calls` edges are intra-class here — cross-file caller discovery requires `read_file`. Calibrates expectations for the precision@k analysis (Category B, Analysis 3).
5. **Graded scope ≠ gold scope**: pytest targets derive from the test patch (`tests/test_parsers.py` only here), while the gold patch spans 7 files. `gold_file_hit` will systematically understate correctness on tasks like this unless reported alongside graded-scope awareness — worth a footnote in the metrics dictionary (dossier Appendix D).

## 9. Reproduction appendix — every [V] claim, re-checkable

```bash
# All paths relative to repo root; data package at input/kagglecomp/kagglecomp_data_package/
unzip -o gemma-4-developer-agent.zip tasks.jsonl graphs/httpx_4acf5c2c*.json snapshots/httpx_3672.tgz -d <dir>
python - <<'EOF'   # task facts (§1)
import json
t=[json.loads(l) for l in open('<dir>/tasks.jsonl',encoding='utf-8')]
print(len(t), {r:sum(1 for x in t if x['repo']==r) for r in {x['repo'] for x in t}})
print(next(x for x in t if x['instance_id']=='httpx_3672')['problem_statement'])
EOF
tar -xzf <dir>/snapshots/httpx_3672.tgz -C <dir>/snap
grep -n "def complete" <dir>/snap/src/httpx/_parsers.py <dir>/snap/src/ahttpx/_parsers.py        # :378 both
grep -rn "\.complete()" <dir>/snap/tests/                                                        # 5 sites, test_parsers.py only
sed -n '88,95p' <dir>/snap/src/httpx/_server.py                                                  # no-parens fault
grep -n "_streams = list" <dir>/snap/src/httpx/_network.py                                       # :163
grep -n "def __init__" -A 7 <dir>/snap/src/httpx/_response.py                                    # status_code positional
python - <<'EOF'   # graph facts (§2 trap 2, §3.3, §8.3–4)
import json
g=json.load(open('<dir>/graphs/httpx_4acf5c2c37714cc63b5cf71b3e284fca83c90311.json',encoding='utf-8'))
print(len(g['nodes']), sum('ahttpx' in n['id'] for n in g['nodes']))
print(sorted({e['source'] for e in g['edges'] if e['target']=='httpx._parsers.HTTPParser.complete'}))
EOF
```

*Quality note: tables in this document were checked for column consistency at write time. Turn counts in §4–5 are [SIM] design targets; the only numbers promoted to [V] are those re-derivable from §9.*


---

<!-- ====================================================================== -->
<!-- FILE: 400-README-glm53max.md -->
<!-- ====================================================================== -->

# Catalog triage for the BCF Coding Agent — deliverables 2026-09-30

**Scope.** Determine which materials in `coderprog_catalog.json` (3,130 entries), `0dayprizrak_catalog.json` (50,848 entries), and the `foss_tools/` collection (~490 repos + 16 grokmuse reports/recipe) would help train, improve, or test the **BCF (Batonic Coding Framework) coding agent** for a winning submission to the Kaggle **Gemma 4 Developer Agent** competition, and rank them. Research was conducted independently from the current repo state only: competition docs (`input/kagglecomp/docs/markdown/`), the harness README (`input/kagglecomp/kagglecomp_data_package/HARNESS_README.md`), and the BCF compendium (`bcf/BCF-Reference-Compendium.md`).

## Files

| File | Task | Contents |
|---|---|---|
| `01-coderprog-catalog-bcf-ranked.md` | Task 1 | 55 ranked resources from coderprog_catalog.json |
| `02-0dayprizrak-catalog-bcf-ranked.md` | Task 2 | 44 ranked resources from 0dayprizrak_catalog.json |
| `03-foss-tools-bcf-ranked.md` | Task 3 | 55 ranked resources from the foss_tools/ collection (GitHub repos + the Unsloth×SWE-smith recipe) |

## Method

1. **Extracted** both catalogs to compact records (title, meta, synopsis) in `scratch/bcf-catalog-rank-2026-09/work/` (never loading the 190 MB file into context).
2. **Keyword-scored** every entry across 8 weighted relevance dimensions (post-training RL, agents/tooling, prompting, inference/serving, graph/embeddings, Python testing, LLM fundamentals, evals/benchmarks).
3. **Deduplicated** the prizrak catalog by normalized title (50,848 → 46,567) and inferred missing languages.
4. **Manually reviewed** the ranked shortlists plus targeted topic probes (SWE-bench, harness engineering, GRPO/DPO, quantization, Gemma, pytest, code graphs, evals, Kaggle).
5. **Task 3:** read every `foss_tools/grokmuse/` report in full; enumerated `githubdigest.json` (~490 repos) by key + keyword probes; identified duplicate files (lowercase exports ≡ named reports; bidness2 latest ⊇ earlier).
6. **Externally verified** load-bearing or unclear items (see verification logs in each file) via the research-toolkit / WebFetch.
7. **Scored** finalists on the 5-criterion rubric (35/25/15/15/10) shown in each table file, then QC-checked every markdown table row for pipe/column consistency.

## Key findings

- **The single most relevant cluster did not exist as a genre two years ago**: "harness engineering" / "loop engineering" / "build your own Claude Code" courses — engineering the scaffold (memory, tools, guardrails, execution loops, termination conditions) around an LLM. That is precisely what the competition submission *is*. Top picks: *Agentic Harness Engineering* (9.6, prizrak), *Harness Engineering & Agent Orchestration* (8.7, coderprog), *Loop Engineering for Agentic AI* (9.4, prizrak). Task 3 supplies the open-source **code** counterparts: SWE-smith, mini-swe-agent, agentic-harness-engineering (AHE), ECC, deepseek-harness.
- **The adapter path is well covered**: DPO/GRPO/RLVR post-training materials exist in both catalogs at textbook and bootcamp depth (*Reinforcement Learning for LLM Alignment and Reasoning*, *The Craft of Post-Training*, *Build a Reasoning Model (From Scratch)* — Raschka, with verifier-based eval + GRPO + distillation). Task 3 adds the full software stack (SWE-smith → Unsloth/trl/peft/bitsandbytes → SWE-bench/sb-cli) plus an end-to-end recipe document already in `foss_tools/`.
- **Verified caveat (Task 3):** SWE-smith's 128-repo corpus excludes all four competition target repos (fastapi/rich/requests/httpx — confirmed against the paper's Table 6), but includes **starlette + pydantic** (fastapi's core deps); its env-builder can target the four repos directly.
- **Testing the agent** is the thinnest coverage area in the course catalogs: only a handful of genuine LLM-eval resources (Pearson's *Evaluating LLMs*, *AI Evals in Practice*, LangFuse/Galileo courses). The BCF plan's local SWE-bench loop will lean on these plus pytest courses; Task 3 adds SWE-bench+sb-cli, SWE-bench-Live, coder_eval, and langfuse as the software-side eval loop.
- **Both catalogs overlap heavily** (same Udemy/Packt/Manning releases): 12+ titles appear in both tables. The prizrak catalog adds the harness/loop-engineering courses and the Pearson eval video; coderprog adds newer 2026 graph-learning books.
- **Graph/embedding angle** (3 of the 9 harness tools + paper track) is served by GNN/graph-representation-learning books (Wiley, Packt) and GraphRAG titles — adequate theory, no code-graph-specific course exists in either catalog. Task 3 fills this gap with serena, moatless-tools, jcodemunch-mcp, codebase-memory-mcp, graphify, and codegraph.

## Verification log (external, via research-toolkit, $0 spend — free engines only)

| Verified item | Source |
|---|---|
| RL for LLM Alignment and Reasoning = Pearson/InformIT video, DPO+GRPO, 4+ h | informit.com/store/reinforcement-learning-for-llm-alignment-and-reasoning-9780135565025 · learning.oreilly.com |
| Agentic Harness Engineering = Udemy, harness design for long-running code-executing agents | udemy.com/course/agentic-harness-engineering · decodingai.com/p/agentic-harness-engineering |
| Loop Engineering for Agentic AI = Udemy, Arjun Vaid (School of AI); loops/termination/guardrails/traces | udemy.com/course/loop-engineering-for-agentic-ai |
| The Craft of Post-Training = No Starch 2026, C. von Csefalvay, 416 pp, ships a Claude Code SKILL.md | nostarch.com/craft-of-post-training · posttraining.guide |
| Build a Reasoning Model (From Scratch) = Manning, Sebastian Raschka; math-verifier evals, RLVR, GRPO, format rewards, distillation | manning.com/books/build-a-reasoning-model-from-scratch |
| AI Coding Agents: 100 Labs = Udemy; terminal harnesses, approval gates, sandboxing, output measurement | udemy.com/course/ai-coding-agents |
| Evaluating LLMs [Video] = 8 h Pearson/O'Reilly video, S. Ozdemir (ISBN 9780135451922) | learning.oreilly.com (Evaluating Large Language Models (LLMs) [Video]) |
| Graph Neural Networks: Concepts and Applications = Wiley, Ramkumar/Rajagopal/Suchitra | wiley.com (ISBN 9781394422739) |
| (Task 3) SWE-smith corpus membership — fastapi/rich/requests/httpx absent; starlette + pydantic present | arXiv 2504.21798 Appendix A.2 Table 6 · swesmith.com · HF SWE-bench/SWE-smith · SWE-smith-envs env/ listing |

## Quality check

- Every generated table row has the same column count as its header (scripted check: `scratch/bcf-catalog-rank-2026-09/work/build.js` — "ALL QC PASS" for Tasks 1–2; Tasks 3 rows authored one-at-a-time with fixed column templates).
- Titles truncated at 78 chars (ellipsis preserved), pipes escaped, no tabs/CRs.
- 55 + 44 + 55 = 154 rows, every row grounded in its catalog/collection record (match on exact title first, then substring; Task 3 rows carry a provenance tag to the source collection file).

*Compiled 2026-09-30. Intermediate artifacts in `scratch/bcf-catalog-rank-2026-09/`; research folder `scratch/research-bcf-catalog-rank-2026-09/` (browser research toolkit, keyless/free engines only, no MCP quota, no paid calls).*


---

<!-- ====================================================================== -->
<!-- FILE: 401-coderprog-catalog-bcf-ranked.md -->
<!-- ====================================================================== -->

# Task 1 — coderprog_catalog.json: resources useful for the BCF Coding Agent

**Catalog:** `coderprog_catalog.json` — 3,130 entries (books + video courses), all entries keyword-scored across 8 relevance dimensions, top ~620 manually reviewed.

**Question answered:** which of these materials would materially help **train, improve, or test** a BCF (Batonic Coding Framework) coding agent for the Kaggle *Gemma 4 Developer Agent* competition — an SWE-bench-style agent submitted as declarative ADK YAML (agent.yaml, prompts/, sub_agents/, skills/) plus optional LoRA adapters for `gemma-4-31b-it-qat-w4a16-ct`, graded by PASS/FAIL validation tests under a 12-hour budget on 4×L4 GPUs.

## Ranking rubric

Every candidate was scored 0–10 across five weighted criteria derived from what the submission actually contains and how it is graded:

| Weight | Criterion | What it measures |
|---:|---|---|
| 35% | **Submission-component fit** | Maps onto the artifacts you ship: LoRA adapters (DPO/GRPO/RLVR training), system prompts & SKILL.md skills, sub-agent orchestration, declarative agent/harness design |
| 25% | **Evaluation-loop fit** | SWE-bench-style PASS/FAIL iteration: eval harnesses, pytest practice, LLM/agent metrics, observability & trajectory analysis |
| 15% | **Model & serving fit** | The fixed stack: gemma-4-31b-it-qat-w4a16-ct on 4×L4, vLLM, 32,768-token context, QAT W4A16 quantization, 12-hour global budget |
| 15% | **Code-graph / embedding fit** | The three graph tools (get_code_neighbors, search_similar_code, get_code_subgraph) and the released graph/embedding dataset (also the paper-track angle) |
| 10% | **Actionability & recency** | Hands-on depth vs. overview; 2025–2026 content preferred (current toolchain) |

**Tier bands:** 9.0+ = *Direct* (maps 1:1 onto competition mechanics) · 7.5–8.9 = *Core* (builds a skill the submission directly needs) · 6.0–7.4 = *Support* (strengthens adjacent capability) · below 6.0 = excluded.

## Ranked resources (sorted by score)

Column notes: **Posted** = catalog post date; **Year** = publication year ("—" where the catalog's year parse failed for courses — the raw meta carried no year); **Pages/ISBN** apply to books. Resource titles link to the catalog source page.
| # | Resource | Type | Posted | Year | Lang | Format | Pages | Size | ISBN | Score | Tier | Why it helps the BCF agent |
|---:|---|---|---|---|---|---|---|---|---|---:|:--|---|
| 1 | [SLM Engineering: End-to-End](https://coderprog.com/slm-engineering-course/) | Courses | 2026-08-15 | — | English | MP4 | — | 7.44 GB | — | 9.6 | Direct | Full small-LM lifecycle on exactly the competition model class: tokenizer→pretrain→fine-tune→alignment→inference engineering→deploy. The closest single course to “post-train Gemma 4 31B into an agent” (LoRA adapters/, sampling.yaml, skills). |
| 2 | [Reinforcement Learning for LLM Alignment and Reasoning](https://coderprog.com/reinforcement-llm-alignment-reasoning/) | Courses | 2026-03-14 | — | English | MP4 | — | 6.33 GB | — | 9.4 | Direct | Pearson/InformIT video (verified): DPO and GRPO — the two named post-training techniques — plus the eval/governance systems to keep alignment on track. Maps straight onto the adapters/ training plan and the paper track. |
| 3 | [The Craft of Post-Training: A Practical Guide for AI Engineers and Developers](https://coderprog.com/craft-post-training-ai-engineers-developers/) | Books | 2026-07-30 | 2026 | English | PDF/EPUB | 416 | 36 MB | 9781718505209 | 9.2 | Direct | No Starch 2026 (verified, C. von Csefalvay): decision-level SFT→RL post-training playbook; even ships a Claude-Code SKILL.md companion. Dual-use: adapters/ training AND skills/ authoring discipline. |
| 4 | [Build a Reasoning Model (From Scratch)](https://coderprog.com/build-reasoning-model-scratch/) | Books | 2026-06-16 | 2026 | English | PDF/EPUB | 440 | 20 MB | 9781633434677 | 9.0 | Direct | Raschka/Manning (verified): evaluation with verifiers, RL with verifiable rewards, GRPO improvements, format rewards, distillation — precisely the recipe for shaping binary machine-checkable “done” behavior (BCF tenet 4). |
| 5 | [Build a Reasoning Model (From Scratch), Video Edition](https://coderprog.com/build-reasoning-model-scratch-video/) | Courses | 2026-07-03 | — | English | MP4 | — | 1.90 GB | — | 8.8 | Core | Same content in guided video form; useful as a fast walkthrough before implementing the GRPO/verifier pipeline for the agent adapter. |
| 6 | [Harness Engineering & Agent Orchestration](https://coderprog.com/harness-engineering-agent-orchestration/) | Courses | 2026-06-13 | — | English | MP4 | — | 1.56 GB | — | 8.7 | Core | One pattern per lesson on the “agent harness” — the memory/tools/guardrails scaffold around an LLM. The swegemma harness is fixed, but designing within its 9-tool contract is exactly this discipline. |
| 7 | [Build Your Own Claude Code](https://coderprog.com/build-your-own-claude-code/) | Courses | 2026-05-19 | — | English | MP4 | — | 11.29 GB | — | 8.6 | Core | Builds a real coding-agent CLI from scratch (read/write/edit tools, agent loop, harness architecture). The closest analog to reasoning about the run_command/read_file/edit_file/submit_patch contract. |
| 8 | [The Claude Code Operating Model: Build scalable AI coding systems with Skills…](https://coderprog.com/claude-code-operating-model-agent-orchestration/) | Books | 2026-08-18 | 2026 | English | PDF/EPUB | 346 | 89 MB | 9781808082719 | 8.5 | Core | Skills, MCP, hooks, sub-agent orchestration and SDK patterns as a governed system. SKILL.md authoring and orchestration patterns transfer 1:1 to the ADK skills/ + sub_agents/ layout. |
| 9 | [Reinforcement Learning from Human Feedback: Alignment and post-training of LL…](https://coderprog.com/reinforcement-learning-human-feedback/) | Books | 2026-08-26 | 2026 | English | PDF/EPUB | 312 | 24 MB | 9781633434301 | 8.5 | Core | Book-length RLHF/post-training treatment (alignment + reasoning) — the theory spine behind DPO/GRPO adapter training decisions. |
| 10 | [AI Evals in Practice: Testing, reliability, and quality for LLM systems in pr…](https://coderprog.com/ai-evals-practice-llm-systems-production/) | Books | 2026-09-24 | 2026 | English | PDF/EPUB | 150 | 10 MB | 9781808817250 | 8.4 | Core | Build a Python eval harness with datasets, scorers, CI regression tests and dashboards; calibrated judges and agent metrics. This is the local iteration loop the BCF agent needs before every submission. |
| 11 | [A Practical Guide to Reinforcement Learning from Human Feedback: Foundations,…](https://coderprog.com/practical-reinforcement-learning-human-feedback/) | Books | 2026-03-28 | 2026 | English | PDF/EPUB | 399 | 27 MB | 9781835880500 | 8.3 | Core | Second, foundations-first view of RLHF: preference data, reward modelling, policy optimization — de-risks the adapter training plan. |
| 12 | [Practical LLM Evaluation for Production Systems: Measure, monitor, and improv…](https://coderprog.com/practical-llm-evaluation-production-systems/) | Books | 2026-07-11 | 2026 | English | PDF/EPUB | 433 | 110 MB | 9781807423896 | 8.3 | Core | Metrics for reliability/quality/latency across text and agentic systems; supports measure-everything iteration on resolution rate. |
| 13 | [A Hands-On Guide to Fine-Tuning Large Language Models with PyTorch and Huggin…](https://coderprog.com/hands-fine-tuning-llm-pytorch-hugging-face/) | Books | 2026-03-16 | 2026 | English | PDF | 306 | 12 MB | 9798301961816 | 8.2 | Core | Hands-on fine-tuning on the exact stack (PyTorch + HF) that produces PEFT LoRA adapters in the required safetensors format. |
| 14 | [Master LLM Inference Engineering](https://coderprog.com/master-llm-inference-engineering-course/) | Courses | 2026-08-05 | — | English | MP4 | — | 5.15 GB | — | 8.2 | Core | 4-week live workshop (verified, Dr. R. Dandekar + industry instructors) on production inference — replicate the harness’s vLLM/4×L4 serving locally to test the agent under real latency. |
| 15 | [Build GenAI Agents with OpenAI + vLLM: Develop portable AI agents in Python w…](https://coderprog.com/build-genai-agents-openai-vllm-deployment/) | Books | 2026-08-13 | 2026 | English | EPUB | 120 | 10 MB | 9789349174245 | 8.1 | Core | vLLM-backed agents with structured outputs and tool calling — matches the harness’s OpenAI-compatible vLLM endpoint; portable-agent thinking fits the single-model constraint. |
| 16 | [Agentic GraphRAG: Integrating Knowledge Graphs, Reasoning, and Agency for Ent…](https://coderprog.com/agentic-graphrag-integrating-graphs-enterprise-ai/) | Books | 2026-09-03 | 2026 | English | EPUB | 386 | 10 MB | 9798341623170 | 8.0 | Core | Graph retrieval + reasoning + agency. Three of the nine harness tools are code-graph/embedding tools; this is the pattern book for exploiting them (and a paper-track angle). |
| 17 | [Graph Neural Networks: Concepts and Applications](https://coderprog.com/graph-neural-networks-concepts-applications/) | Books | 2026-09-16 | 2026 | English | PDF | 960 | 108 MB | 9781394422739 | 8.0 | Core | Wiley (verified, 960 pp): graph theory→GNN deployment. Grounding for code-graph reasoning over the released graph/embedding dataset (explicit paper-track topic). |
| 18 | [A Complete Guide to Graph Representation Learning with Case Studies](https://coderprog.com/complete-graph-representation-case-studies/) | Books | 2026-08-19 | 2026 | English | PDF/EPUB | 448 | 34 MB | 9781394314843 | 7.9 | Core | GRL fundamentals→SOTA with case studies — the substrate behind get_code_neighbors/search_similar_code/get_code_subgraph and graph-embedding research. |
| 19 | [Systems Thinking for Agentic AI: A Software Architect’s Guide to Building Rel…](https://coderprog.com/systems-thinking-agentic-ai-software-architects/) | Books | 2026-07-14 | 2026 | English | EPUB | 488 | 25 MB | 9798197120960 | 7.8 | Core | Architecting reliable LLM/agent systems: prompts+retrieval+tools+memory+orchestration with guardrails, evaluation, observability — the systems view the BCF reliability doctrine needs. |
| 20 | [AI Engineer Agentic Track: The Complete Agent & MCP Course](https://coderprog.com/complete-agentic-ai-engineering-course/) | Courses | 2026-08-01 | — | English | MP4 | — | 23.31 GB | — | 7.6 | Core | Dense agent&MCP engineering track; broad coverage of tool protocols, memory and orchestration that informs sub_agents/ design. |
| 21 | [Build an AI Agent (From Scratch), Video Edition](https://coderprog.com/build-ai-agent-scratch-video/) | Courses | 2026-09-10 | — | English | MP4 | — | 1.79 GB | — | 7.6 | Core | Minimal-dependency agent build — a good mental model of what the ADK compiler produces from declarative YAML. |
| 22 | [Vector Databases: A Practical Introduction](https://coderprog.com/vector-databases-practical-introduction/) | Books | 2026-04-12 | 2026 | English | PDF/EPUB | 292 | 15 MB | 9781098177591 | 7.6 | Core | Embeddings/vector search mechanics — how search_similar_code behaves and how to write queries it answers well. |
| 23 | [Agentic Architectural Patterns for Building Multi-Agent Systems: Proven desig…](https://coderprog.com/agentic-architectural-patterns-multi-agent-systems/) | Books | 2026-02-06 | 2026 | English | PDF/EPUB | 576 | 65 MB | 978-1806029570 | 7.5 | Core | Proven design patterns and practices for multi-agent trees — direct input for sub_agents/ + agent_tool structure and scoping rules. |
| 24 | [LLM AI Agent Evaluations and Observability with Galileo AI](https://coderprog.com/ai-agent-evals-course/) | Courses | 2026-02-21 | — | English | MP4 | — | 11.22 GB | — | 7.5 | Core | Agent-specific evals and observability practice — tooling options for trajectory scoring beyond a homegrown ledger. |
| 25 | [AI Context Engineering: Master the Art of Context Engineering for LLMs](https://coderprog.com/ai-context-engineering-llm-course/) | Courses | 2026-09-21 | — | English | MP4 | — | 4.73 GB | — | 7.4 | Support | Context engineering for LLMs — the binding constraint is the 32,768-token window; deliberate context composition is a top score lever. |
| 26 | [Advanced Retrieval-Augmented Generation: Bridging Large Language Models and K…](https://coderprog.com/advanced-retrieval-augmented-generation-bridging/) | Books | 2026-08-04 | 2026 | English | PDF/EPUB | 560 | 23 MB | 9781394374687 | 7.4 | Support | Bridging LLMs and knowledge graphs — RAG-thinking over code graphs before each patch step (BCF Phase 2 localization). |
| 27 | [AI Agents and Applications: With LangChain, LangGraph, and MCP](https://coderprog.com/ai-agents-applications-langchain-langgraph-mcp/) | Books | 2026-03-09 | 2026 | English | PDF/EPUB | 448 | 25 MB | 978-1633436541 | 7.4 | Support | Current-gen agent application patterns incl. LangGraph state machines — conceptually close to ADK Sequential/Parallel/Loop agents. |
| 28 | [LLM Observability and Cost Management: Langfuse, Monitoring](https://coderprog.com/llm-observability-cost-management-course/) | Courses | 2026-01-28 | — | English | MP4 | — | 1.76 GB | — | 7.4 | Support | Langfuse tracing/metrics — trajectory post-mortems and breadcrumb analytics for the local dev loop (file-based ledger first per the compendium, Langfuse when scaling). |
| 29 | [Distributed AI Systems: A practical guide to building scalable training, infe…](https://coderprog.com/distributed-ai-systems-scalable-production/) | Books | 2026-07-06 | 2026 | English | PDF/EPUB | 351 | 72 MB | 9781807301712 | 7.3 | Support | GPU parallelism, training and serving systems — makes the 4×L4 / vLLM serving behavior legible when debugging slow turns. |
| 30 | [The Mathematics of Large Language Models: Machine Learning Theory Made Readab…](https://coderprog.com/mathematics-large-language-models-optimization/) | Books | 2026-07-10 | 2026 | English | EPUB | 477 | 11 MB | 9798185219508 | 7.3 | Support | Readable math (attention, optimization) — needed to reason about KL regularization, beta in DPO, sampling params. |
| 31 | [Design Multi-Agent AI Systems Using MCP and A2A: Engineer your own Python-bas…](https://coderprog.com/design-multi-agent-ai-systems-mcp-a2a-engineer/) | Books | 2026-03-03 | 2026 | English | PDF/EPUB | 536 | 94 MB | 978-1806116478 | 7.3 | Support | Engineer your own Python agentic framework — exercise for the orchestration muscles the declarative YAML exposes. |
| 32 | [Designing Multi-Agent Systems: Principles, Patterns, and Implementation for A…](https://coderprog.com/designing-multi-agent-systems-implementation-ai/) | Books | 2026-04-18 | 2026 | English | PDF/EPUB | 394 | 13 MB | 9798993101200 | 7.3 | Support | Canonical multi-agent principles/patterns — scoping rules like “analyzer cannot edit” come from this literature. |
| 33 | [Agentic AI System Design](https://coderprog.com/agentic-ai-system-design-course/) | Courses | 2026-07-04 | — | English | MP4 | — | 4.53 GB | — | 7.3 | Support | System design with RAG, agents, memory, evaluation, LLMOps — end-to-end architecture checklist for the submission. |
| 34 | [Mastering NLP From Foundations to Agents: Building AI Agents through Agentic …](https://coderprog.com/mastering-nlp-foundations-agents-automation/) | Books | 2026-03-08 | 2026 | English | PDF/EPUB | 497 | 29 MB | 978-1806106134 | 7.3 | Support | 2026 book bridging NLP foundations to agentic automation and RAG — solid backbone for the model-side mental model. |
| 35 | [Vector Databases Fundamentals to Production [2026 Edition]](https://coderprog.com/vector-databases-fundamentals-course/) | Courses | 2026-05-18 | — | English | MP4 | — | 6.88 GB | — | 7.3 | Support | Vector-search specialization (course form) — deeper drills on embedding retrieval, the search_similar_code analog. |
| 36 | [101 Claude Code Tips – Master Hooks, Skills, MCP, and Agentic Workflows: A Ba…](https://coderprog.com/claude-code-tips-hooks-skills-mcp-agentic-workflows/) | Books | 2026-08-16 | 2026 | English | PDF/EPUB | 127 | 10 MB | B0H3MJR6KX | 7.2 | Support | Field-tested tips on hooks, skills, subagents, plan mode and verification — dense micro-patterns to steal for SKILL.md + prompts. |
| 37 | [Building Large Language Models from Scratch: Design, Train, and Deploy LLMs w…](https://coderprog.com/building-large-language-models-scratch/) | Books | 2026-05-22 | 2026 | English | PDF/EPUB | 555 | 30 MB | 9798868822964 | 7.2 | Support | Design, train and deploy LLMs in PyTorch — fundamentals beneath the adapters (what the base model can/cannot do). |
| 38 | [Domain-Specific Small Language Models: Efficient AI for local deployment](https://coderprog.com/domain-specific-small-language-models-deployment/) | Books | 2026-05-20 | 2026 | English | PDF/EPUB | 376 | 51 MB | 9781633436701 | 7.1 | Support | Train/tune focused SLMs for a narrow domain — literally the competition task (SWE-agent domain on a 31B model). |
| 39 | [Hands-On LLM Serving and Optimization: Hosting LLMs at Scale](https://coderprog.com/hands-llm-serving-optimization-hosting/) | Books | 2026-05-29 | 2026 | English | PDF/EPUB | 372 | 23 MB | 9798341621497 | 7.1 | Support | Serving LLMs at scale: optimization and memory management — supports local-harness parity with the eval environment. |
| 40 | [Spec-Driven Development: From Specs to Code with AI Agents](https://coderprog.com/spec-driven-development-code-ai-agents/) | Books | 2026-08-21 | 2026 | English | PDF/EPUB | 175 | 10 MB | 9798868828508 | 7.0 | Support | Specs→code with AI agents; BCF Phase 1 (Specification, no file access before spec completes) is this discipline operationalized. |
| 41 | [The Complete Prompt Engineering for AI Bootcamp (2026)](https://coderprog.com/complete-prompt-engineering-ai-bootcamp/) | Courses | 2026-05-26 | — | English | MP4 | — | 16.94 GB | — | 7.0 | Support | Systematic prompting curriculum — system.md, analyzer.md and skill manifests are all prompt artifacts; breadth course. |
| 42 | [Best Practices for Claude Code – Write Production-Grade Code with AI: Advance…](https://coderprog.com/best-practices-claude-code-production-code-ai/) | Books | 2026-08-13 | 2026 | English | PDF/EPUB | 186 | 10 MB | B0H3KC13YN | 7.0 | Support | Advanced prompting, scratchpads and production-grade practices — scratchpad technique ≈ BCF breadcrumbs (tenet 3). |
| 43 | [Production Development with DeepSeek: Building and deploying scalable DeepSee…](https://coderprog.com/production-development-deepseek-building-deploying/) | Books | 2026-02-02 | 2026 | English | EPUB | 284 | 10 MB | 978-9365891782 | 6.9 | Support | LoRA/QLoRA + deployment on open-weight models — concrete adapter recipes transferable to Gemma 4. |
| 44 | [Prompt Engineering in Practice: Design, test, and improve AI prompts](https://coderprog.com/prompt-engineering-practice-improve-ai/) | Books | 2026-09-25 | 2026 | English | PDF | 248 | 26 MB | 9781633436305 | 6.8 | Support | Treats prompts as testable artifacts with an improvement loop — same discipline as the agent’s prompt-vs-eval iteration. |
| 45 | [Vibe Coding Architecture at Scale: Scale AI-assisted coding with specs, guard…](https://coderprog.com/vibe-coding-architecture-scale-ai-assisted/) | Books | 2026-09-02 | 2026 | English | PDF/EPUB | 250 | 166 MB | 9781808654916 | 6.8 | Support | Specs, guardrails and system design for AI-assisted coding at scale — echoes BCF gates and minimum-path doctrine. |
| 46 | [30 Agents Every AI Engineer Must Build: Build production-ready agent systems …](https://coderprog.com/agents-ai-engineer-production-ready-architectures/) | Books | 2026-04-03 | 2026 | English | PDF/EPUB | 542 | 173 MB | 9781806109012 | 6.8 | Support | Thirty production-ready agent builds — breadth of patterns for the sub-agent zoo (analyzer/planner/implementer/validator). |
| 47 | [Machine Learning with Hugging Face Bootcamp: Zero to Mastery](https://coderprog.com/machine-learning-hugging-face-bootcamp-ztm/) | Courses | 2026-06-26 | — | English | MP4 | — | 7.50 GB | — | 6.7 | Support | HF transformers hands-on — day-to-day fluency for adapter experiments. |
| 48 | [Ultimate LLMOps with Langfuse: Instrument, Evaluate, and Operate Production-G…](https://coderprog.com/ultimate-llmops-langfuse-production-applications/) | Books | 2026-05-13 | 2026 | English | EPUB | 347 | 10 MB | 9789349887541 | 6.7 | Support | Instrument, evaluate and operate LLM applications — operational polish for the eval loop. |
| 49 | [Building Natural Language and LLM Pipelines: Build production-grade RAG, tool…](https://coderprog.com/building-natural-language-llm-pipelines-production/) | Books | 2026-01-06 | 2026 | English | PDF/EPUB | 521 | 23 MB | 978-1835467008 | 6.6 | Support | Production RAG with tool contracts and context management — disciplined context assembly before patching. |
| 50 | [Codex CLI: Agentic Engineering from First Principles](https://coderprog.com/codex-cli-agentic-engineering-principles/) | Books | 2026-06-03 | 2026 | English | PDF/EPUB | 971 | 22 MB | — | 6.6 | Support | Coding-agent CLI engineering from first principles — cross-check on loop design choices. |
| 51 | [Sutskever’s List: Foundational ideas of modern AI](https://coderprog.com/sutskevers-list-foundational-ideas-ai/) | Books | 2026-08-04 | 2026 | English | EPUB | 336 | 10 MB | 9781633434790 | 6.5 | Support | Guided tour of foundational ideas — background literacy for the paper track. |
| 52 | [AI Coder: From Vibe Coder to Agentic Engineer in 3 weeks](https://coderprog.com/ai-coder-agentic-engineer-course/) | Courses | 2026-02-16 | — | English | MP4 | — | 19.68 GB | — | 6.4 | Support | Skills/Hooks/Plugins across Claude Code, Cursor, Copilot and Codex — pattern-transfer breadth for skills authoring. |
| 53 | [Local LLMs via Ollama & LM Studio – The Practical Guide](https://coderprog.com/running-open-llms-locally-practical/) | Courses | 2026-03-31 | — | English | MP4 | — | 1.79 GB | — | 6.4 | Support | Run open models locally — fast, cheap iteration on prompts/skills before GPU-backed runs. |
| 54 | [50 ML Projects To Understand LLMs: Investigate transformer mechanisms through…](https://coderprog.com/projects-understand-llms-visualization-experimentation/) | Books | 2026-05-20 | 2026 | English | PDF/EPUB | 496 | 265 MB | 9781808082559 | 6.3 | Support | Experiments on transformer mechanisms — intuition for sampling/thinking-budget settings in configs/. |
| 55 | [TDD & BDD – Design Through Testing](https://coderprog.com/tdd-bdd-design-through-testing/) | Courses | 2026-01-09 | — | English | MP4 | — | 2.27 GB | — | 6.2 | Support | Testing discipline feeding Phase-4 validation gates and skill scripts that must pass/fail binary. |
## What was excluded and why

- **Cloud-vendor certification tracks** (AWS/Azure/GCP/Bedrock/Vertex/Databricks cert courses and exam guides): the competition harness is local and fixed; no vendor services are involved.
- **No-code automation** (n8n/Zapier/Power Platform agent builders): the submission is declarative YAML + sandboxed Python, not flow builders.
- **Vibe-coding app-building courses** (build a SaaS/startup app with Cursor/Lovable/Claude Code): product-building workflows, not agent-design depth. Kept only those with transferable skills/hooks/harness content.
- **Off-stack language tracks** (Java/Spring AI, .NET/C++/Swift GenAI): the eval corpus and toolchain are Python/PyTorch.
- **Non-LLM ML, data engineering, cybersecurity, image/video generation, leadership books**: no path to the submission artifacts.

## Caveats

- Synopses are the catalog's own; where they were thin, the resource was verified externally (see `00-README.md` verification log).
- "AI Engineer Core Track" year shows "—" because the catalog's raw meta line for courses lacks a publication year.


---

<!-- ====================================================================== -->
<!-- FILE: 402-0dayprizrak-catalog-bcf-ranked.md -->
<!-- ====================================================================== -->

# Task 2 — 0dayprizrak_catalog.json: resources useful for the BCF Coding Agent

**Catalog:** `0dayprizrak_catalog.json` — 50,848 raw entries. After removing duplicate postings of the same title (forum reposts of the same Udemy/Packt/Manning releases), **46,567 unique titles** remained; all were keyword-scored, the top ~330 manually reviewed, plus targeted topic probes (SWE-bench, pytest, GRPO/DPO, quantization, Gemma, code-graph, harness, evals, Kaggle).

**Question answered:** same as Task 1 — materials that help **train, improve, or test** the BCF coding agent for the Kaggle *Gemma 4 Developer Agent* competition (ADK YAML + prompts + skills + LoRA adapters for `gemma-4-31b-it-qat-w4a16-ct`, PASS/FAIL graded, 12-hour budget, 4×L4).

## Ranking rubric

Every candidate was scored 0–10 across five weighted criteria derived from what the submission actually contains and how it is graded:

| Weight | Criterion | What it measures |
|---:|---|---|
| 35% | **Submission-component fit** | Maps onto the artifacts you ship: LoRA adapters (DPO/GRPO/RLVR training), system prompts & SKILL.md skills, sub-agent orchestration, declarative agent/harness design |
| 25% | **Evaluation-loop fit** | SWE-bench-style PASS/FAIL iteration: eval harnesses, pytest practice, LLM/agent metrics, observability & trajectory analysis |
| 15% | **Model & serving fit** | The fixed stack: gemma-4-31b-it-qat-w4a16-ct on 4×L4, vLLM, 32,768-token context, QAT W4A16 quantization, 12-hour global budget |
| 15% | **Code-graph / embedding fit** | The three graph tools (get_code_neighbors, search_similar_code, get_code_subgraph) and the released graph/embedding dataset (also the paper-track angle) |
| 10% | **Actionability & recency** | Hands-on depth vs. overview; 2025–2026 content preferred (current toolchain) |

**Tier bands:** 9.0+ = *Direct* (maps 1:1 onto competition mechanics) · 7.5–8.9 = *Core* (builds a skill the submission directly needs) · 6.0–7.4 = *Support* (strengthens adjacent capability) · below 6.0 = excluded.

## Ranked resources (sorted by score)

Column notes: **Type** is inferred (video course vs. e-book) from media format; **ID** is the catalog entry's identifier (site-prefixed); **Posted** = forum posting date. Titles link to the catalog source page (prizrak.ws forum topics or the mirrored 0daydown page the catalog recorded).
| # | Resource | Type | Posted | Year | Lang | Format | Size | ID | Score | Tier | Why it helps the BCF agent |
|:--|---|---|---|---|---|---|---|---|---:|:--|---|
| 1 | [Agentic Harness Engineering: Harness Design for AI Engineers](https://www.0daydown.com/07/3499372.html) | Video course | 2026-07-11 | — | English | — | 2.4 GB | 0daydown-agentic-harness-engineering-harness-design-for-ai-engineers | 9.6 | Direct | Verified Udemy course: design/build/optimize a multi-layer harness for long-running, code-executing, persistent agents (multi-session memory, context-rot control, custom execution loops). The submission IS a harness — BCF’s four phases map onto harness layers. |
| 2 | [Loop Engineering for Agentic AI](https://prizrak.ws/viewtopic.php?id=2258690) | Video course | 2026-09-04 | 2026 | English | MP4/MKV video | 9.8 GB | prizrak-2258690 | 9.4 | Direct | Verified Udemy (A. Vaid, School of AI): reliable agent loops — termination conditions, guardrails, repetition/non-progress detection, traces and tests. Implements BCF tenets 3–4 (breadcrumbs, binary done) in code. |
| 3 | [AI Coding Agents 100 Labs to Production Mastery](https://prizrak.ws/viewtopic.php?id=2258539) | Video course | 2026-09-04 | 2026 | English | MP4/MKV video | 1.1 GB | prizrak-2258539 | 9.2 | Direct | Verified Udemy: terminal AI harnesses, local models, project context, Git workflows, approval gates, sandboxing, output measurement — 100 labs mirroring the agent sandbox contract. |
| 4 | [Build a Reasoning Model (From Scratch) (MEAP 03)](https://prizrak.ws/viewtopic.php?id=2106791) | Book (pdf) | 2026-01-25 | — | English (inferred) | pdf | 19.21 MB | prizrak-2106791 | 9.0 | Direct | Raschka/Manning MEAP PDF: verifier-based eval, RLVR, GRPO, distillation — the adapter-training recipe with machine-checkable rewards. |
| 5 | [LLM Engineering Prompting, RAG, Fine-Tuning, and RLHF](https://prizrak.ws/viewtopic.php?id=2255771) | Video course | 2026-08-30 | 2026 | English | MP4/MKV video | 6.3 GB | prizrak-2255771 | 8.8 | Core | Top-ranked course in the catalog: prompting + RAG + fine-tuning + RLHF in one track — the full skill surface of the submission (prompts/, skills, adapters/). |
| 6 | [From Autocomplete to Assistant RL for Beginners](https://prizrak.ws/viewtopic.php?id=2255514) | Video course | 2026-08-29 | 2026 | English | MP4/MKV video | 1.7 GB | prizrak-2255514 | 8.7 | Core | No-math primer on how assistants are actually trained: reward models, PPO, GRPO, DPO, reasoning models — fast conceptual grounding before the heavy RL courses. |
| 7 | [Evaluating Large Language Models (LLMs)](https://prizrak.ws/viewtopic.php?id=2195889) | Video course | 2026-05-20 | — | English (inferred) | MP4/MKV video | 2.2 GB | prizrak-2195889 | 8.6 | Core | Verified 8-hour Pearson/O’Reilly video (S. Ozdemir): eval design for LLMs — the local iteration loop that tells you whether a prompt/adapter change actually helps resolution rate. |
| 8 | [Reinforcement Learning from Human Feedback, Video Edition](https://prizrak.ws/viewtopic.php?id=2250441) | Video course | 2026-08-20 | 2026 | English + subtitle | MP4/MKV video | 2.2 GB | prizrak-2250441 | 8.5 | Core | Video edition of the RLHF book — deep dive on preference optimization for adapter training. |
| 9 | [AI Engineer Core Track LLM Engineering RAG QLoRA Agents 2026](https://prizrak.ws/viewtopic.php?id=2153478) | Video course | 2026-03-19 | — | English | MP4/MKV video | 24.41 GB | prizrak-2153478 | 8.5 | Core | 24+ GB bootcamp with explicit QLoRA track — parameter-efficient training on modest GPUs, the practical LoRA adapter path. |
| 10 | [LLM Quantization and Compression Theoretical Core](https://prizrak.ws/viewtopic.php?id=2239190) | Video course | 2026-06-29 | 2026 | English | MP4/MKV video | 3.1 GB | prizrak-2239190 | 8.4 | Core | PTQ/AWQ/LoRA/pruning theory — explains what the QAT W4A16 base model already is, and how fine-tuning interacts with quantized weights. |
| 11 | [SLM Engineering: End-to-End](https://prizrak.ws/viewtopic.php?id=2248989) | Video course | 2026-08-18 | — | English | MP4/MKV video | 7.4 GB | prizrak-2248989 | 8.4 | Core | Same bootcamp as in the coderprog catalog: full SLM lifecycle from raw data to deployment — the model class is Gemma-4-31B QAT. |
| 12 | [Edge AI with SLMs Fine-Tuning & Local Deployment](https://prizrak.ws/viewtopic.php?id=2133650) | Video course | 2026-02-22 | 2026 | English | MP4/MKV video | 1.28 GB | prizrak-2133650 | 8.3 | Core | LoRA/QLoRA on 1–7B models on consumer GPUs with INT8/INT4 quantization — direct analog of adapter work under hardware limits. |
| 13 | [Building AI Coding Assistant from scratch / Udemy](https://prizrak.ws/viewtopic.php?id=2186140) | Video course | 2026-05-07 | — | English | — | 2.93 GB | prizrak-2186140 | 8.2 | Core | Verified Udemy: what sits under Cursor/Claude Code/Codex — harness internals, ReAct, agentic frameworks; builds the mental model of the compiled ADK agent. |
| 14 | [LangFuse LLM Observability, Tracing, Evaluation, Monitoring](https://prizrak.ws/viewtopic.php?id=2236429) | Video course | 2026-06-24 | 2026 | English | MP4/MKV video | 4.5 GB | prizrak-2236429 | 8.0 | Core | Tracing/eval/monitoring for agent runs — trajectory analytics that make BCF breadcrumb post-mortems scalable. |
| 15 | [Agentic AI Mastery with DSPy Build Modular, Self-Improving AI Agent...](https://prizrak.ws/viewtopic.php?id=2085833) | Book (epub) | 2026-01-04 | — | English (inferred) | epub | 2.04 MB | prizrak-2085833 | 8.0 | Core | Declarative, metric-driven prompt optimization — a systematic way to tune system.md/analyzer.md instead of hand-guessing. |
| 16 | [Kimi K3 The Complete Open-Weight LLM & AI Agent Course](https://prizrak.ws/viewtopic.php?id=2259914) | Video course | 2026-09-06 | 2026 | English | MP4/MKV video | 11 GB | prizrak-2259914 | 7.9 | Core | Open-weight agent workflows incl. “evaluate with your own harness instead of trusting public benchmarks” — exactly the local-SWE-bench mindset. |
| 17 | [Applied Deep Learning on Graphs](https://prizrak.ws/viewtopic.php?id=2227362) | Book (pdf) | 2026-06-21 | — | English (inferred) | pdf | 19 MB | prizrak-2227362 | 7.8 | Core | Verified Packt: GCN/GAT architectures and scalable, productionizable graph learning — ML over code graphs (paper-track direction). |
| 18 | [The Kaggle Book Master data science competitions with machine learn...](https://prizrak.ws/viewtopic.php?id=2112283) | Book (pdf) | 2026-01-26 | — | English (inferred) | pdf | 51.14 MB | prizrak-2112283 | 7.7 | Core | Winning-strategy meta from 30+ expert Kagglers: validation discipline, leaderboard craft — the competition wrapper around the engineering. |
| 19 | [Training & Fine-Tuning Custom LLMs From Pretrained Models to Domain...](https://prizrak.ws/viewtopic.php?id=2090342) | Book (epub) | 2026-01-04 | — | English (inferred) | epub | 7.06 MB | prizrak-2090342 | 7.6 | Core | Book walking the whole fine-tuning lifecycle without a supercomputer — dataset creation→deployment, the adapters/ plan in book form. |
| 20 | [Hugging Face in Action](https://prizrak.ws/viewtopic.php?id=2083658) | Book (epub) | 2026-01-02 | — | English (inferred) | epub | 28.42 MB | prizrak-2083658 | 7.5 | Core | Manning: the HF stack (transformers, RAG, LangChain, Gradio) — the ecosystem the PEFT/vLLM tooling lives in. |
| 21 | [Agentic Automation — A Pytest Framework with Claude Code](https://www.0daydown.com/09/3640403.html) | Video course | 2026-09-29 | — | English | — | 3.3 GB | 0daydown-agentic-automation-a-pytest-framework-with-claude-code | 7.5 | Core | Skills, subagents, planning + a pytest framework — Phase-4 gate engineering with the same primitives the harness grades with (hermetic pytest). |
| 22 | [Pytest Complete Guide｜Python Unit Testing with 50 Exercises](https://www.0daydown.com/07/3532714.html) | Video course | 2026-07-27 | — | English | — | 2.3 GB | 0daydown-pytest-complete-guide-python-unit-testing-with-50-exercises | 7.4 | Support | 50 pytest labs: fixtures, parametrize, mock, coverage — the agent’s validation phase and every skill script is pytest-shaped. |
| 23 | [Context Engineering Masterclass LLMs, RAG & Agents](https://prizrak.ws/viewtopic.php?id=2250423) | Video course | 2026-08-20 | 2026 | English | MP4/MKV video | 9.6 GB | prizrak-2250423 | 7.4 | Support | Context management for agents under real constraints — the 32K window makes context composition a primary score lever. |
| 24 | [Knowledge Graphs and LLMs in Action](https://prizrak.ws/viewtopic.php?id=2083739) | Book (epub) | 2026-01-02 | — | English (inferred) | epub | 22.39 MB | prizrak-2083739 | 7.3 | Support | KG+LLM integration patterns — informs reasoning over the repo call/dependency graph the harness exposes. |
| 25 | [Complete AI-Driven Unit Testing for Developers](https://www.0daydown.com/07/3533002.html) | Video course | 2026-07-27 | — | English | — | 2.2 GB | 0daydown-complete-ai-driven-unit-testing-for-developers | 7.2 | Support | Agentic test generation (Diffblue Cover, Claude Code, Cursor) — mirrors the eval’s issue→test_patch structure; helps think test-first like the grader. |
| 26 | [LLM Token Optimization Enterprise Cost & Performance](https://prizrak.ws/viewtopic.php?id=2197191) | Video course | 2026-05-21 | 2026 | English + subtitle | MP4/MKV video | 1.25 GB | prizrak-2197191 | 7.2 | Support | Token economics, caching, routing — the 12-hour global budget (all tasks, sandbox included) makes token/time discipline a direct lever. |
| 27 | [Master LangGraph v1 and Ollama - Build Gen AI Agents](https://prizrak.ws/viewtopic.php?id=2127442) | Video course | 2026-02-13 | — | English | MP4/MKV video | 5.59 GB | prizrak-2127442 | 7.1 | Support | Graph-structured agent control flow + local models — conceptually adjacent to ADK Sequential/Loop agents and cheap local iteration. |
| 28 | [Modern Python Testing with pytest](https://www.0daydown.com/06/3483764.html) | Video course | 2026-06-11 | — | English | — | 514.2 MB | 0daydown-modern-python-testing-with-pytest | 7.1 | Support | Compact pytest course (structure, fixtures, mocking, coverage) — same justification as the 50-exercise guide, quicker path. |
| 29 | [Local AI Masterclass: LLMs, Diffusion & AIAgents on Your PC](https://prizrak.ws/viewtopic.php?id=2134311) | Video course | 2026-02-23 | 2025 | English | MP4/MKV video | 8.53 GB | prizrak-2134311 | 7.0 | Support | On-premise stack fluency (Ollama/LM Studio/Flowise) for cheap prompt/skill experiments before GPU time. |
| 30 | [Domain-Specific Small Language Models, Video Edition](https://prizrak.ws/viewtopic.php?id=2228716) | Video course | 2026-06-21 | — | English | — | — | prizrak-2228716 | 7.0 | Support | Video edition of the domain-SLM book — focused-model training rationale for SWE specialization. |
| 31 | [LLM Engineering From Using LLM to Building LLM](https://prizrak.ws/viewtopic.php?id=2164164) | Video course | 2026-04-03 | 2026 | English | MP4/MKV video | 13.56 GB | prizrak-2164164 | 6.9 | Support | From using to building LLMs — internals literacy for debugging model behavior inside the loop. |
| 32 | [LLM on OpenShift AI: Deployment Masterclass](https://www.0daydown.com/08/3556291.html) | Video course | 2026-08-12 | — | English | — | 2.1 GB | 0daydown-llm-on-openshift-ai-deployment-masterclass | 6.8 | Support | vLLM/KServe serving depth — platform wrapper is OpenShift-specific, but the serving-layer mechanics transfer. |
| 33 | [Ollama & OpenClaw: Run Open Models on Your Own Stack](https://prizrak.ws/viewtopic.php?id=2240834) | Video course | 2026-08-02 | — | English (US) | MP4/MKV video | 1.98 GB | prizrak-2240834 | 6.8 | Support | Self-hosted model serving — the local dev loop that mirrors the offline spirit of the competition. |
| 34 | [Vector Databases & Rag Build Semantic Search With Llms](https://prizrak.ws/viewtopic.php?id=2251113) | Video course | 2026-08-21 | 2026 | English | MP4/MKV video | 721.15 MB | prizrak-2251113 | 6.7 | Support | Hands-on semantic search — the mechanics behind search_similar_code queries. |
| 35 | [Practical AI Engineering](https://prizrak.ws/viewtopic.php?id=2088938) | Book (epub) | 2026-01-04 | — | English (inferred) | epub | 0.38 MB | prizrak-2088938 | 6.7 | Support | Beyond-tutorials engineering practices for production AI — general polish. |
| 36 | [A2A and MCP protocol for Agentic AI LangGraph, Claude,Cursor](https://prizrak.ws/viewtopic.php?id=2196165) | Video course | 2026-05-20 | — | English | MP4/MKV video | 9.22 GB | prizrak-2196165 | 6.6 | Support | Protocol-level view of agent interop (A2A, MCP) — vocabulary and patterns for agent_tool/sub_agent boundaries. |
| 37 | [Coursera - Vector Databases for Machine Learning: A Comprehensive G...](https://prizrak.ws/viewtopic.php?id=2194277) | Video course | 2026-05-18 | — | English + subtitle | MP4/MKV video | 6.2 GB | prizrak-2194277 | 6.6 | Support | University-style vector/embedding specialization — theory backup for embedding-tool usage. |
| 38 | [AI Agents & Multi-Agent Systems with Agentic AI 100 Labs](https://prizrak.ws/viewtopic.php?id=2253243) | Video course | 2026-08-25 | — | English (US) | MP4/MKV video | 1.62 GB | prizrak-2253243 | 6.5 | Support | Lab-driven multi-agent practice — reps for orchestration decisions. |
| 39 | [Complete MCP Bootcamp: Build Next-Gen AI Agents with MCP / Udemy](https://prizrak.ws/viewtopic.php?id=2178295) | Video course | 2026-04-23 | — | English | — | 6.77 GB | prizrak-2178295 | 6.4 | Support | Building MCP servers/clients — adjacent to declaring custom agent tools in the submission. |
| 40 | [Prompt Engineering for Developers: The Definitive Guide / Udemy](https://prizrak.ws/viewtopic.php?id=2133543) | Video course | 2026-02-22 | — | English | — | 10.13 GB | prizrak-2133543 | 6.4 | Support | Developer-centric prompting depth — system prompt craft for instruction-following in YAML-declared agents. |
| 41 | [Mastering Agentic AI: From Prompt to Protocols to Production / Udemy](https://prizrak.ws/viewtopic.php?id=2138721) | Video course | 2026-02-28 | — | English | — | 19.2 GB | prizrak-2138721 | 6.3 | Support | Prompt→protocols→production arc — connects prompting to orchestration to deployment. |
| 42 | [Practical Reinforcement Learning for ML Engineers](https://prizrak.ws/viewtopic.php?id=2163496) | Video course | 2026-04-02 | 2026 | Arabic | MP4/MKV video | 5.45 GB | prizrak-2163496 | 6.2 | Support | REINFORCE/actor-critic implementations (note: Arabic-language audio) — RL fundamentals for the GRPO step, flagged for language. |
| 43 | [AI Reverse Engineering with OpenClaw, Codex, Claude and MCP](https://www.0daydown.com/06/3478967.html) | Course/Book | 2026-06-11 | — | English (inferred) | — | 3.36 GB | 0daydown-ai-reverse-engineering-with-openclaw-codex-claude-and-mcp | 6.2 | Support | Multi-model orchestration + connecting AI to debuggers/disassemblers — creative inspiration for debugging-workflow skills (rescue mode). |
| 44 | [Agentic AI Bootcamp: AI Agents with Python, n8n, MCP & RAG / Udemy](https://prizrak.ws/viewtopic.php?id=2179810) | Video course | 2026-04-25 | — | English | — | 31.7 GB | prizrak-2179810 | 6.1 | Support | Very broad agent bootcamp; the n8n content is off-target but the Python/MCP/RAG core is solid breadth. |
## What was excluded and why

Same policy as Task 1: cloud-cert tracks, no-code automation (n8n-heavy bootcamps kept only when the Python/MCP/RAG core dominates), vibe-coding app tours, off-stack language tracks, non-LLM ML, and non-technical content. The catalog is dominated by reposts of the same ~40 mainstream Udemy agent/RAG bootcamps; only the best copy of each is listed.

## Caveats

- **Language:** one entry (`Practical Reinforcement Learning for ML Engineers`) has Arabic audio — flagged in the table. All other selected entries are English.
- **Duplicates:** the same course often appears 2–5 times (different rips/sizes/dates). Ranking used the highest-quality copy; alternative copies exist in the catalog.
- **"English (inferred)"** language labels were derived from title/synopsis script (the catalog's language field was missing for ~32.6k entries).


---

<!-- ====================================================================== -->
<!-- FILE: 403-foss-tools-bcf-ranked.md -->
<!-- ====================================================================== -->

# Task 3 — `foss_tools/` collection: resources useful for the BCF Coding Agent

**Collection:** `foss_tools/` — `githubdigest.json` (~490 repos with full metadata + README content, 512 KB) plus 15 curated research reports and one end-to-end recipe in `foss_tools/grokmuse/` (collected 2026-09-24 → 2026-09-30). The entire collection was examined: every named report read in full; the JSON catalog enumerated by repo key and keyword-probed (agent/LLM terms: ~9,590 hits). Duplicate files (lowercase raw exports ≡ named reports; earlier bidness2 reports ⊂ the 2026-09-29 21:40 cumulative) and off-lane material (UI/UX design tools, web scraping, voice/TTS, security scanners, social-poster lists) were reviewed and excluded with reasons at the bottom.

**Question answered:** same as Tasks 1–2 — materials that help **train, improve, or test** the BCF coding agent for the Kaggle *Gemma 4 Developer Agent* competition (LoRA/QLoRA adapters for `gemma-4-31b-it-qat-w4a16-ct`, 129 hidden SWE tasks on **fastapi 67 / rich 48 / requests 13 / httpx 1**, hidden-test PASS/FAIL grading, fixed sequential task order, 12-hour run budget, 4×L4 submission queues, 1 submission/day).

**Headline finding:** the collection contains a **pre-built BCF training playbook** — SWE-smith (task/trajectory synthesis) + the grokmuse Unsloth×SWE-smith recipe (end-to-end pipeline) + Unsloth/peft/trl/bitsandbytes (the exact QLoRA stack) + SWE-bench & sb-cli (the grading analogue) + mini-swe-agent (the minimal-scaffold evidence). One verified caveat: SWE-smith's ready-made 128-repo corpus does **not** include fastapi, rich, requests, or httpx (see verification log) — it covers the *neighborhood* (starlette, pydantic, pygments, click, flask) and its env-builder must be pointed at the four target repos directly.

## Verification log (external, this run)

| Claim checked | Finding | Source |
|---|---|---|
| SWE-smith covers the four competition repos | **No.** Paper Table 6 (license table = full corpus) lists 128 repos; fastapi, Textualize/rich, psf/requests, encode/httpx all absent. Selection was top-5,000 PyPI + ≥1,000★ minus SWE-bench test repos — yet the four still didn't make the cut. **encode/starlette and pydantic/pydantic ARE covered** (fastapi's two core dependencies). | arXiv 2504.21798 HTML, Appendix A.2 |
| SWE-smith scale | 50,137 task instances / 128 repos (HF dataset card); SWE-smith-envs `env/` dir shows 250+ env dirs incl. non-Python; one env is `QwenLM__qwen-code` | swesmith.com; HF SWE-bench/SWE-smith; GitHub API contents of SWE-bench/SWE-smith-envs |
| mini-swe-agent ">74% SWE-bench Verified" | Repo/API description claim, **not reproduced**; treat as target to beat, not fact | SWE-agent/mini-swe-agent API description (via LoRA-DR report) |
| SWE-Swiss "60.2% Verified @ 32B" | Repo README figure caption claim, not re-run | zhenyuhe00/SWE-Swiss README (via LoRA-DR report) |
| Unsloth "2× speed / 70% less VRAM" | README marketing claim; recipe doc independently warns of API drift + Ubuntu-only env construction | unsloth README + grokmuse recipe doc |
| Star/push metadata | All stars and last-push dates below are GitHub API values captured 2026-09-30 by the collection's own scripts (not social-post numbers) | grokmuse LoRA-DR + Leftover reports' method sections |

## Ranking rubric

Identical to Tasks 1–2 so scores are comparable across the three catalogs:

| Weight | Criterion | What it measures |
|---:|---|---|
| 35% | **Submission-component fit** | Maps onto what you ship: LoRA adapters (SFT/GRPO data + training pipeline), system prompts & SKILL.md skills, harness/tool-loop engineering |
| 25% | **Evaluation-loop fit** | SWE-bench-style PASS/FAIL iteration against the 129-task hidden distribution; grading, regression gating, trajectory observability |
| 15% | **Model & serving fit** | Fixed stack: gemma-4-31b QAT W4A16, QLoRA on RTX 5090 / 4×L4, vLLM wheelhouse, KV/context budget |
| 15% | **Code-graph / embedding fit** | The three graph tools (search_similar_code symbol queries, get_code_neighbors, get_code_subgraph) + the paper-track graph framing (graph-ML judge roster) |
| 10% | **Actionability & recency** | Usable before 2026-12-02; maintained vs. archived/stale; integration risk |

**Tier bands:** 9.0+ = *Direct* (maps 1:1 onto competition mechanics) · 7.5–8.9 = *Core* (builds a skill the submission directly needs) · 6.0–7.4 = *Support* (strengthens adjacent capability) · below 6.0 = excluded.

## Provenance legend

| Tag | Collection file |
|---|---|
| [LoRA-DR] | `grokmuse/Deep-Research-LoRA-Finetune-Python-Coding-Agents-2026-09-30-0843ET.md` |
| [Leftover] | `grokmuse/Deep-Research-LoRA-Finetune-Leftover-Followup-2026-09-30-1308ET.md` |
| [Recipe] | `grokmuse/Unsloth-SWE-smith-Python-Coding-Agent-Finetune-Recipe-2026-09-30-1348ET.md` |
| [Watchlist] | `grokmuse/FOSS-X-Watchlist-Deep-Dive-2026-09-30-1423ET.md` |
| [bidness2] | `grokmuse/bidness2-collection-report-2026-09-29-2140.md` |
| [Enriched-27] / [Enriched-29] / [Enriched-24] / [25-09] | `grokmuse/Deep-Research-GitHub-Repos(-Enriched)-2026-09-2{4,7,9}*.md` |
| [Daily-30] | `grokmuse/Daily-X-GitHub-Repos-Digest-2026-09-30-0826ET.md` |
| [Digest] | `githubdigest.json` |

## Ranked resources (sorted by score)

Column notes: ★ = GitHub stars as of 2026-09-30 (collection's API pull); Pushed = last push (stale dates flagged in "Why"); License shown only where confirmed (collection metadata or project docs) — "—" = not confirmed this pass.

| # | Resource | Category | ★ | Lang | License | Pushed | Score | Tier | Why it helps the BCF agent | Src |
|--:|---|---|---:|---|---|---|---:|:--|---|---|
| 1 | [SWE-bench/SWE-smith](https://github.com/SWE-bench/SWE-smith) | Training data | 791 | Python | MIT | 2026-09-28 | 9.7 | Direct | Turns any GitHub repo into a SWE gym: task synthesis (localization/repair/SWE-bench-style), trajectory collection, SWE-agent-LM-32B recipe. **Verified gap:** the 128-repo corpus excludes all four target repos (starlette + pydantic included) → use its env-builder on fastapi/rich/requests directly. NeurIPS'25 D&B Spotlight. | [LoRA-DR] [Recipe] |
| 2 | grokmuse Unsloth×SWE-smith recipe (collection doc) | Training pipeline | — | — | — | 2026-09-30 | 9.6 | Direct | End-to-end playbook already in `foss_tools/`: SWE-smith traj collection (`{"messages":[...]}` JSONL) → Unsloth SFT w/ response-only masking → sglang serve → SWE-agent infer → sb-cli submit. Includes honest pitfalls: HF messages dtype, VRAM math, Ubuntu-only env construction, dependency age. The connective tissue for rows 1/3/4/9. | [Recipe] |
| 3 | [unslothai/unsloth](https://github.com/unslothai/unsloth) | Trainer | 77,076 | Python | Apache-2.0 | 2026-09-30 | 9.4 | Direct | The QLoRA trainer the recipe standardizes on; 2×-speed/70%-VRAM claims matter for 31B-on-5090 iteration cycles. Risk: fast-moving API (recipe's own warning) — pin versions. | [LoRA-DR] [Digest] |
| 4 | [SWE-bench/SWE-bench](https://github.com/SWE-bench/SWE-bench) + sb-cli | Eval | 5,940 | Python | MIT | 2026-09-18 | 9.3 | Direct | The grading analogue: hidden-test PASS/FAIL harness matching the competition's per-task tests. Recipe uses sb-cli for local submission scoring — the only way to iterate daily under the 1-sub/day limit. | [LoRA-DR] [Recipe] |
| 5 | [huggingface/peft](https://github.com/huggingface/peft) | Trainer | 21,741 | Python | Apache-2.0 | 2026-09-30 | 9.2 | Direct | LoRA/QLoRA adapter library underneath every training path; your submission *is* a peft artifact served by wheelhouse vLLM. | [LoRA-DR] |
| 6 | [huggingface/trl](https://github.com/huggingface/trl) | Trainer | 19,421 | Python | Apache-2.0 | 2026-09-30 | 9.1 | Direct | SFTTrainer (+DPO/GRPO) with `train_on_responses_only` masking — exactly right for agent-trajectory SFT where tool outputs must not be learned. Unsloth-compatible fallback. | [LoRA-DR] |
| 7 | [SWE-agent/mini-swe-agent](https://github.com/SWE-agent/mini-swe-agent) | Scaffold | 8,118 | Python | MIT | 2026-09-28 | 9.0 | Direct | ~100-line agent; ">74% Verified" (repo claim) with minimal prompts — the strongest public evidence that scaffold/prompt craft beats tool bloat in a fixed-model regime. Its prompt files are the best starting templates for BCF's system prompt. | [LoRA-DR] |
| 8 | [bitsandbytes-foundation/bitsandbytes](https://github.com/bitsandbytes-foundation/bitsandbytes) | Trainer | 8,509 | Python | MIT | 2026-09-07 | 8.8 | Core | NF4 QLoRA quantization — 31B model on a 32 GB 5090 only fits 4-bit; the quantization half of the whole plan. | [Leftover] [Digest] |
| 9 | [SWE-agent/SWE-agent](https://github.com/SWE-agent/SWE-agent) | Scaffold | 20,449 | Python | MIT | 2026-09-28 | 8.8 | Core | The scaffold SWE-smith's train guide and the recipe both use for eval rollouts; ACI (agent-computer interface) design patterns transfer directly to BCF's tool loop despite the fixed harness. | [LoRA-DR] [Recipe] |
| 10 | [SWE-Gym/SWE-Gym](https://github.com/SWE-Gym/SWE-Gym) | Training data | 747 | Python | — | 2025-07 (stale) | 8.6 | Core | 2.4k verified executable SWE tasks + trajectories (ICML'25) — ready-made SFT data while your own SWE-smith envs build. Stale but data doesn't rot. | [LoRA-DR] |
| 11 | [rllm-org/rllm](https://github.com/rllm-org/rllm) | RL | 5,853 | Python | — | 2026-09-12 | 8.6 | Core | Trains agents RL-style (GRPO/SFT) directly *on a harness* (mini-swe-agent) against SWE-bench — the stage-2 option if SFT plateaus, and the closest structural match to "post-train an agent, not a chatbot." | [LoRA-DR] |
| 12 | [oraios/serena](https://github.com/oraios/serena) | Retrieval/graph | 29,914 | Python | MIT | 2026-09-30 | 8.6 | Core | Semantic code retrieval/editing over LSP for agents — the mature reference for making `search_similar_code` symbol-queries actually work (harness quirk Q4: prose queries fail); its symbol-context strategies are directly transplantable into BCF prompts. Token-frugal by design. | [Watchlist] |
| 13 | [RUCAIBox/SWE-Master](https://github.com/RUCAIBox/SWE-Master) | Training pipeline | 106 | HTML | — | 2026-02 | 8.4 | Core | Full SWE post-training pipeline: trajectory synthesis → long-horizon SFT → RLVR w/ execution feedback → test-time scaling. The multi-turn/long-horizon piece the basic recipe lacks; a 32B-class recipe like yours. | [Leftover] |
| 14 | [axolotl-ai-cloud/axolotl](https://github.com/axolotl-ai-cloud/axolotl) | Trainer | 12,512 | Python | Apache-2.0 | 2026-09-30 | 8.4 | Core | Config-driven QLoRA alternative if Unsloth's API drift bites on gemma-4; async GRPO in-tree gives it a stage-2 story too. | [LoRA-DR] [Digest] |
| 15 | [verl-project/verl](https://github.com/verl-project/verl) | RL | 23,709 | Python | Apache-2.0 | 2026-09-30 | 8.3 | Core | The RL post-training engine behind most SWE-RL efforts (HybridFlow, ByteDance Seed); heavier than rllm but the scalable GRPO path with LoRA support. | [LoRA-DR] |
| 16 | [SWE-rebench/SWE-rebench-V2](https://github.com/SWE-rebench/SWE-rebench-V2) | Training data | 85 | Python | — | 2026-03 | 8.2 | Core | Continuous task generation with test verification and contamination resistance — fresh tasks matter because your base model's pretraining already saw old SWE-bench. | [Leftover] |
| 17 | [R2E-Gym/R2E-Gym](https://github.com/R2E-Gym/R2E-Gym) | Training data | 337 | Python | — | 2025-07 (stale) | 8.2 | Core | Procedural environment generation + hybrid verifiers (COLM'25); second task-flywheel alongside SWE-smith; its DeepSWE models were rllm-trained. | [LoRA-DR] |
| 18 | [aorwall/moatless-tools](https://github.com/aorwall/moatless-tools) | Retrieval/graph | 643 | Python | — | 2025-09 | 8.1 | Core | Tree-search agent over code graphs w/ retrieval — the closest public analogue to BCF's get_code_neighbors/get_code_subgraph expansion loop; hobby-project status but the search-tree framing doubles as paper-track material. | [Leftover] |
| 19 | [zhenyuhe00/SWE-Swiss](https://github.com/zhenyuhe00/SWE-Swiss) | Training pipeline | 105 | Python | — | 2025-09 | 8.1 | Core | Multi-task SFT+RL recipe for 32B (self-reported 60.2% Verified) — strong precedent that a 30B-class model + task-mix SFT is the right order of battle. | [LoRA-DR] |
| 20 | [microsoft/SWE-bench-Live](https://github.com/microsoft/SWE-bench-Live) | Eval | 249 | Python | — | 2026-09-24 | 8.0 | Core | Continuously updated, contamination-free SWE-bench tasks — the most honest local eval set while your 129-task distribution stays hidden. NeurIPS'25 D&B. | [LoRA-DR] |
| 21 | [headroomlabs-ai/headroom](https://github.com/headroomlabs-ai/headroom) | Token/context | 74,070 | — | — | 2026-09 | 8.0 | Core | Tool-output compression for agents — directly targets the KV-collapse regime (46k→7.6k tokens with adapter) and Q4's unbounded search output; context discipline is a score lever until the host fix lands. | [Enriched-29] |
| 22 | [linkedin/Liger-Kernel](https://github.com/linkedin/Liger-Kernel) | Trainer | 6,640 | Python | MIT | 2026-09-30 | 7.9 | Core | Fused Triton kernels (~20% throughput/60% memory claims) with TRL/Axolotl/LlamaFactory integrations — more headroom for seq length on the 5090 during SFT. | [Leftover] |
| 23 | [langfuse/langfuse](https://github.com/langfuse/langfuse) | Observability | 32,262 | TypeScript | MIT | 2026-09 | 7.8 | Core | Self-hostable LLM tracing/eval — turns 12h-run post-mortems into per-tool-call analytics; with 1 sub/day, offline trajectory analysis is the only debug loop you get. | [Digest] |
| 24 | [china-qijizhifeng/agentic-harness-engineering](https://github.com/china-qijizhifeng/agentic-harness-engineering) | Harness | 911 | Python | — | 2026-08 | 7.8 | Core | AHE: observability-driven automatic evolution of prompts/tools/middleware/skills **with the base model held fixed** — literally the BCF situation (gemma-4 frozen, only adapters+prompts movable). Methodology donor. | [Leftover] |
| 25 | [NovaSky-AI/SkyRL](https://github.com/NovaSky-AI/SkyRL) | RL | 2,366 | Python | — | 2026-09-30 | 7.7 | Core | Modular full-stack RL; SWE-smith's own README cites it for GRPO — a sanctioned stage-2 pairing with row 1. | [LoRA-DR] |
| 26 | [hiyouga/LlamaFactory](https://github.com/hiyouga/LlamaFactory) | Trainer | 75,229 | Python | Apache-2.0 | 2026-09-28 | 7.6 | Core | Zero-code fine-tuning of 100+ models incl. Gemma lineage — the fastest fallback trainer when you need a clean A/B against Unsloth. | [LoRA-DR] |
| 27 | [modelscope/ms-swift](https://github.com/modelscope/ms-swift) | Trainer | 15,760 | Python | Apache-2.0 | 2026-09-30 | 7.6 | Core | Alibaba's FT+deploy stack with GRPO family and broad model coverage — third trainer option; deployment half mirrors the vLLM serve step. | [LoRA-DR] |
| 28 | [huggingface/accelerate](https://github.com/huggingface/accelerate) | Trainer | 9,896 | Python | Apache-2.0 | 2026-09-30 | 7.6 | Core | The launcher/plumbing under TRL+PEFT recipes; boring but load-bearing for reproducible 5090 runs. | [Leftover] |
| 29 | [deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) | Harness | 237,605 | — | — | 2026-09 | 7.6 | Core | Frontier-lab harness engineering reference — how a top lab structures tool loops, context, and eval around a fixed model; pattern mine for BCF's four phases. | [bidness2] |
| 30 | [UiPath/coder_eval](https://github.com/UiPath/coder_eval) | Eval | 141 | — | — | 2026-09 | 7.6 | Core | "Playwright for coding agents": YAML eval suites + CI gates — the missing piece between local prompt/skill changes and confidence before burning the day's single submission. | [Enriched-27] |
| 31 | [multi-swe-bench/multi-swe-bench](https://github.com/multi-swe-bench/multi-swe-bench) | Eval | 362 | Python | — | 2025-12 | 7.5 | Core | Multilingual SWE benchmark whose Python slice + per-repo test-harness construction methodology transfer; its Multi-SWE-RL dataset adds trajectory data. | [LoRA-DR] |
| 32 | [QwenLM/qwen-code](https://github.com/QwenLM/qwen-code) | Reference agent | 28,222 | — | Apache-2.0 | 2026-09 | 7.5 | Core | Open coding-agent CLI with published prompt/tooling layer — second-best prompt reference after mini-swe-agent; a qwen-code SWE-smith env exists (row 1 corpus). | [Enriched-29] |
| 33 | [MoonshotAI/kimi-code](https://github.com/MoonshotAI/kimi-code) | Reference agent | 5,845 | TypeScript | MIT | 2026-08 | 7.5 | Core | Open terminal coding agent from a frontier lab — harness ergonomics and tool-set design worth mining for the fixed-harness constraints. | [Digest] |
| 34 | [OpenAutoCoder/Agentless](https://github.com/OpenAutoCoder/Agentless) | Scaffold | 2,115 | Python | — | 2024-12 (stale) | 7.5 | Core | Localization→repair→validation pipeline beats agents on cost — the localization-first pattern matches BCF's graph-tools-first design; validate-before-submit discipline maps to your canary gates. | [Leftover] |
| 35 | [PrimeIntellect-ai/verifiers](https://github.com/PrimeIntellect-ai/verifiers) | RL | 4,661 | Python | — | 2026-09-30 | 7.5 | Core | Environment library for verifiable-reward rollouts — the lightweight way to wrap your local SWE tasks as RL envs if GRPO becomes warranted. | [LoRA-DR] |
| 36 | [meta-pytorch/torchtune](https://github.com/meta-pytorch/torchtune) | Trainer | 5,809 | Python | BSD | 2026-09-09 | 7.4 | Support | Unmaintained, but the recipe's full-FT path uses its SWE-smith configs and it retains the cleanest LoRA/QLoRA recipe set — read-only reference, not a dependency. | [Leftover] [Recipe] |
| 37 | [OpenHands/OpenHands](https://github.com/OpenHands/OpenHands) | Reference agent | 89,622 | TypeScript | MIT | 2026-09-30 | 7.4 | Support | The most-deployed open coding agent; its event-stream architecture + prompt suite is the richest scaffold reference — mine for rescue-mode/recovery patterns. | [Watchlist] |
| 38 | [jgravelle/jcodemunch-mcp](https://github.com/jgravelle/jcodemunch-mcp) | Retrieval/graph | 2,720 | — | — | 2026-09 | 7.4 | Support | Tree-sitter symbol/context extraction over MCP — concrete patterns for structuring the symbol-queries that search_similar_code requires (quirk Q4). | [Enriched-29] |
| 39 | [harbor-framework/harbor](https://github.com/harbor-framework/harbor) (+ terminal-bench) | Eval | 5,724 | Python | — | 2026-09-30 | 7.3 | Support | Eval framework from Terminal-Bench creators with parallel envs + RL-rollout generation — secondary eval realism (long-horizon terminal work ≠ repo-SWE, hence Support). | [Leftover] |
| 40 | [openai/codex](https://github.com/openai/codex) | Reference agent | 127,403 | Rust | Apache-2.0 | 2026-09-30 | 7.3 | Support | Open frontier coding agent — sandbox/apply-patch and review-loop design patterns; can't ship it, but its harness decisions are the industry reference. | [Watchlist] |
| 41 | [obra/superpowers](https://github.com/obra/superpowers) | Skills | 293,382 | Shell | — | 2026-09-26 | 7.3 | Support | Agentic skills framework/methodology — the model for BCF's SKILL.md layer (how to decompose engineering workflows into skill files an agent reliably follows). | [Enriched-24] [Watchlist] |
| 42 | [affaan-m/ECC](https://github.com/affaan-m/ECC) | Harness | 269,668 | — | — | 2026-09 | 7.3 | Support | Harness-optimization collection with measured perf effects — evidence base for which harness changes actually move agent scores (the BCF bet). | [bidness2] |
| 43 | [OpenRLHF/OpenRLHF](https://github.com/OpenRLHF/OpenRLHF) | RL | 10,057 | Python | Apache-2.0 | 2026-09-17 | 7.3 | Support | Ray-based agentic RL (PPO/DAPO/REINFORCE++, async vLLM) — fourth RL option; listed behind rllm/verl/SkyRL for fit, ahead of them on ops maturity. | [LoRA-DR] |
| 44 | [DeusData/codebase-memory-mcp](https://github.com/DeusData/codebase-memory-mcp) | Retrieval/graph | 45,496 | — | — | 2026-09 | 7.3 | Support | Repo→persistent knowledge-graph MCP (single binary) — prototype for graph-backed retrieval framing; strong paper-track visual/narrative material. | [bidness2] [Enriched-24] |
| 45 | [NVIDIA-NeMo/Gym](https://github.com/NVIDIA-NeMo/Gym) | RL | 1,215 | Python | — | 2026-09-30 | 7.2 | Support | NVIDIA's env/improvement surface incl. Unsloth+verl tutorials and agent trees for OpenHands/mini-swe-agent — good integration map of this whole table. | [LoRA-DR] |
| 46 | [Graphify-Labs/graphify](https://github.com/Graphify-Labs/graphify) | Retrieval/graph | 122,739 | Python | — | 2026-09-29 | 7.2 | Support | Codebase+docs → queryable knowledge graph — the graph-native retrieval story; viral (122k★) which also means paper-track judges may recognize it. | [Watchlist] |
| 47 | [anomalyco/opencode](https://github.com/anomalyco/opencode) | Reference agent | 210,399 | — | — | 2026-09 | 7.2 | Support | Major open terminal agent — third prompt/harness reference; provider-agnostic architecture is a useful contrast to ADK constraints. | [Enriched-27] |
| 48 | [colbymchenry/codegraph](https://github.com/colbymchenry/codegraph) | Retrieval/graph | 72,447 | — | — | 2026-09 | 7.1 | Support | Local Rust code-graph with auto-syncing — lean reference for incremental graph maintenance (BCF's released graph dataset regeneration angle). | [Daily-30] |
| 49 | [Danau5tin/terminal-bench-rl](https://github.com/Danau5tin/terminal-bench-rl) | RL | 413 | Python | none set | 2025-08 (stale) | 7.1 | Support | Compact GRPO codebase for long-horizon coding tasks (rllm-based) — readable RL reference implementation; no license is a real (if internal-only) drawback. | [Leftover] |
| 50 | [anthropics/skills](https://github.com/anthropics/skills) | Skills | — | — | — | 2026-09 | 7.0 | Support | Official Agent Skills repo — canonical SKILL.md structure/progressive-disclosure conventions for BCF's skills layer. | [25-09] [Digest] |
| 51 | [evalplus/evalplus](https://github.com/evalplus/evalplus) | Eval | 1,821 | Python | Apache-2.0 | 2025-10 | 6.9 | Support | Rigorous function-level code eval — sanity checks for base-model code ability after adapter merge (cheap smoke tests between SWE-bench runs). | [LoRA-DR] |
| 52 | [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) | Token/context | 108,562 | Go | — | 2026-09-30 | 6.9 | Support | Proxy+skill cutting ~65% tokens via compressed dialect — gimmicky but the KV-collapse regime makes a measured token-reduction probe a legitimate 1-day experiment (risk: hurts gemma-4 instruction-following). | [Watchlist] |
| 53 | [microsoft/Webwright](https://github.com/microsoft/Webwright) | Skills | 6,021 | — | — | 2026-09 | 6.8 | Support | Skill distillation for agents — methodology for generating/maintaining the SKILL.md corpus programmatically rather than hand-writing. | [Enriched-27] |
| 54 | [redhat-et/ripwire](https://github.com/redhat-et/ripwire) | Retrieval/graph | 2,368 | — | — | 2026-09 | 6.8 | Support | Repo mapping for agent context — lighter-weight alternative framing for pre-contexting the four target repos. | [Enriched-29] |
| 55 | [asgeirtj/system_prompts_leaks](https://github.com/asgeirtj/system_prompts_leaks) | Harness | — | — | — | 2026-09 | 6.7 | Support | Extracted system prompts (Claude Code, Codex, Cursor…) — raw material for prompt-pattern mining when tuning BCF's system.md/analyzer.md. | [Digest] |

## Themed takeaways

### 1. The training pipeline is already assembled

Rows 1–6 + 8 + 20 form one continuous pipeline that maps onto the master plan's adapter path: SWE-smith (tasks + trajectories) → Unsloth/trl/peft/bitsandbytes (QLoRA SFT with response-only masking) → sglang/wheelhouse-vLLM (serving) → SWE-bench + sb-cli + SWE-bench-Live (local grading) → mini-swe-agent/SWE-agent (scaffold references). The grokmuse recipe (row 2) is the glue document — nothing equivalent existed in the coderprog/prizrak catalogs from Tasks 1–2; this collection supplies the *software* half that those course catalogs lacked.

### 2. The target-repo gap is real but closable (verified)

SWE-smith's corpus deliberately excludes SWE-bench test repos and empirically excludes fastapi/rich/requests/httpx too. Three mitigations, in priority order: (a) ready-made **starlette + pydantic** envs cover fastapi's two load-bearing dependencies — 67 of 129 competition tasks are fastapi, and its failure modes run through starlette/pydantic internals (cf. the starlette dedup issue in the local-grading notes); (b) SWE-smith's env-builder can be pointed at the four repos directly — budget real time for this (the recipe warns env construction is Ubuntu-only and dependency-version finicky); (c) R2E-Gym and SWE-rebench-V2 as secondary flywheels, with SWE-Gym's existing 2.4k tasks as SFT starter data.

### 3. Fixed-model harness engineering is a represented genre

The model is frozen; only adapters, prompts, and skills move. mini-swe-agent (prompt minimalism at 74% claimed), agentic-harness-engineering (harness evolution with fixed model), ECC (measured harness-optimization effects), and deepseek-harness (frontier-lab harness patterns) together give both the evidence and the method. This matches the Task 1–2 finding that "harness engineering" courses topped those catalogs — here you get the open-source code side.

### 4. Token/context discipline until the KV fix lands

KV collapse (46,048→7,600 tokens with any adapter) + unbounded search_similar_code output (Q4) make context engineering a scoring lever regardless of training: headroom (tool-output compression), serena (symbol-scoped retrieval), caveman (measured 65% token cut, probe-grade). These rank high *because* of the harness quirks; re-evaluate their weight once wheelhouse v25+ fixes land.

### 5. The code-graph lane serves the harness *and* the paper track

search_similar_code/get_code_neighbors/get_code_subgraph are graph queries; serena, moatless-tools (search tree), jcodemunch, codebase-memory-mcp, graphify, and codegraph are the public reference implementations. The paper track's judge roster is graph-ML heavy and the plan already favors code-graph-centric framing — moatless-tools' tree-search and the KG builders are the two most citable structures.

### 6. Testing under 1-sub/day

SWE-bench harness + sb-cli (local per-task grading), SWE-bench-Live (contamination-free realism), coder_eval (YAML suites + CI gates), evalplus (cheap smoke tests), langfuse (trajectory post-mortems). The discipline to enforce: no submission whose delta wasn't first measured locally.

### 7. What the collection does *not* contain

No Gemma-specific fine-tuning recipe (the recipe doc targets Qwen-class; gemma-4 + Unsloth compatibility remains your Day-0 unknown), no competition-harness clone, no pre-built fastapi/rich task sets, and no RLVR-for-gemma precedent. The generic-RL remainder (open-r1, alignment-handbook, open-instruct, AReaL, OpenClaw-RL, DeepSpeed, litgpt, microsoft/LoRA, artidoro/qlora, starcoder/codellama archives, LiveCodeBench, bigcode-evaluation-harness, bigcodebench-archived) is below the 6.0 bar — real software, no BCF-specific edge.

## Excluded lanes (reviewed, with reasons)

- **UI/UX design tools** (figma-console-mcp, open-pencil, shadcn/lint, mapcn, lobe-ui, super-prototyping, css-pro-tips, plus the whole 2026-09-25 UI deep-research file) — competition tasks are pure Python SWE; no rendering is graded.
- **Web scraping/browser automation** (firecrawl, crawlee, scrapegraph-ai, Scrapling, patchright, chrome-devtools-mcp 52,786★, browser-use, chrome-control-mcp) — no browser surface in the harness.
- **Voice/TTS** (whisper, coqui TTS, OpenVoice, fish-speech, OmniVoice) — off-domain.
- **Security/compliance** (trivy, gitleaks, codex-security, hetzer) — off-domain.
- **X/social infrastructure** (Agent-Reach, posters files, neighbors scan) — collection tooling, not agent tooling.
- **Marginal digest entries** (AgentENV, PerceptionBench, CodeJury, better-harness, lora-speedrun, open-code-review, labs-OO-Agents, rowboat, dify, langgraph, agno, claude-code vendor docs, tuios, FreeToken, ktransformers) — either wrong task shape (VLA/benchmark/observability-lite), or duplicates of better-ranked rows, or contradict the fixed vLLM-wheelhouse serving requirement.

## Open questions

1. **SWE-smith env builds for the four target repos** — unverified that fastapi/rich/requests envs build cleanly with current SWE-smith (the recipe's Instagram/MonkeyType example worked; Ubuntu-only). Day-0/Day-1 job on AUX2.
2. **Gemma-4 in Unsloth/trl/axolotl today** — the recipe is Qwen-centric; confirm gemma-4-31b-it-qat-w4a16-ct loads + trains + merges QLoRA on the 5090 before committing a sprint to rows 3–6. (Related known risk: adapter-zeroing + KV-collapse fixes pending in wheelhouse.)
3. **Does trajectory-style transfer hold?** SWE-smith trajectories were collected on Qwen-class models; SFT-ing gemma-4 on them assumes cross-model transfer — validate with a 200-traj smoke run before scaling.
4. **caveman-style compression vs. gemma-4 instruction-following** — the 65% claim came from frontier-model users; a small model may lose more in comprehension than it gains in budget. Measure, don't adopt.
5. **Paper-track anchor choice** — moatless-tools (tree search over graph) vs. serena (LSP symbol grounding) vs. graphify/KG (recognizable narrative): pick one by Sprint 2 so the resource paper (deadline 2026-11-12) has a single coherent graph story.

## Sources

**Collection files** (all under `foss_tools/`): `githubdigest.json`; `grokmuse/Deep-Research-LoRA-Finetune-Python-Coding-Agents-2026-09-30-0843ET.md`; `grokmuse/Deep-Research-LoRA-Finetune-Leftover-Followup-2026-09-30-1308ET.md`; `grokmuse/Unsloth-SWE-smith-Python-Coding-Agent-Finetune-Recipe-2026-09-30-1348ET.md`; `grokmuse/FOSS-X-Watchlist-Deep-Dive-2026-09-30-1423ET.md`; `grokmuse/bidness2-collection-report-2026-09-29-2140.md`; `grokmuse/Deep-Research-GitHub-Repos-2026-09-{24-0748,25-2005,29-1033}ET.md`; `grokmuse/Deep-Research-GitHub-Repos-Enriched-2026-09-27-1526ET.md`; `grokmuse/Daily-X-GitHub-Repos-Digest-2026-09-30-0826ET.md`; `grokmuse/deep-research-2026-09-25-2005ET.md` (UI/UX, excluded); `grokmuse/FOSS-X-Neighbors-From-Seed-Accounts-2026-09-30.md` (no tools); Consistent-X poster files (no tools); lowercase duplicate exports (≡ named reports).

**External verifications (this run):** arXiv 2504.21798 HTML (SWE-smith paper, Appendix A.2 Table 6 — corpus membership); swesmith.com (50k+ tasks / 128 repos); huggingface.co/datasets/SWE-bench/SWE-smith (50,137 instances; 222 distinct repo/image values); GitHub API contents of SWE-bench/SWE-smith-envs `env/` (env directory list, truncated at `apache__*`).

*Compiled 2026-09-30. Companion to `01-coderprog-catalog-bcf-ranked.md` (55 rows) and `02-0dayprizrak-catalog-bcf-ranked.md` (44 rows); rubric identical for cross-catalog comparability.*

