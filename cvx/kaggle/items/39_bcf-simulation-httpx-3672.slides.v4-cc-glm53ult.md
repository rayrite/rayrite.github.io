# COMBINED MARKDOWN - combine

_Generated 2026-10-06 03:58:26 | 4 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle\items\combine_

## Contents

1. 00-README.md
2. 01-bcf-integration-into-master-plan.md
3. 02-bcf-diagnostic-math-and-prior-research.md
4. 03-bcf-simulation-httpx-3672.md

---

<!-- ====================================================================== -->
<!-- FILE: 00-README.md -->
<!-- ====================================================================== -->

# Deliverables — BCF Documents Review + Whitepaper Math (2026-09-30, set 2)

Companion package to `../2026-09-30/` (competition master plan), produced from the BCF documents in `bcf/` and the official competition docs in `input/kagglecomp/`.

| Doc | Task | Contents |
|---|---|---|
| [01-bcf-integration-into-master-plan.md](01-bcf-integration-into-master-plan.md) | Task 1 | Itemized review of the BCF docs (compendium A1–A8/B1–B6, dossier turns 1–21, Kaggle docs) with adopt/hold/skip verdicts; sprint-by-sprint integration map with per-technique test regimes; three riskiest claims; corrections table; whitepaper v3 brainstorm (positioning options, 9-section skeleton, 5 pre-registered predictions) |
| [02-bcf-diagnostic-math-and-prior-research.md](02-bcf-diagnostic-math-and-prior-research.md) | Task 2 | The math behind "classifying errors limits the search space": Bayesian posterior pruning, mutual information, refinement monotonicity + data-processing inequality (the number-vs-fidelity trade-off); fault interference as broken additivity; fault masking as a dominance partial order; chained faults as a masking DAG with topological fix order and the O(k) vs O(k²) turn model; httpx_6821 worked example [ILLUSTRATIVE]; whitepaper-ready drafted section; predictions 6–8; prior-research survey (33 verified citations) with relevance mapping and novelty positioning |
| [03-bcf-simulation-httpx-3672.md](03-bcf-simulation-httpx-3672.md) | Task 2b | Real-data replacement for the invented httpx_6821 case study: BCF-vs-naive simulation walkthrough on the dataset's only httpx task (`httpx_3672`), built entirely from verified artifacts (tasks.jsonl, snapshot, graph, HARNESS_README). Four verified traps (visible-vs-graded test asymmetry, dual sync/async tree, latent no-parens fault at `_server.py:92`, ungraded-but-real broken code); component/tenet/benefit map; five new verified harness facts; candidate pre-registered prediction #9; reproduction appendix. Trajectories carry [SIM] labels — not measurements |

**Supporting research** for doc 02: `../../scratch/research-faultmask-bcf-2026-09/` (page dumps, notes, citation-verification record — every DOI/arXiv ID was title-verified via Crossref or the arXiv API on 2026-09-30).

**Slide decks for doc 03** — start at [index.html](index.html) (launcher menu for all three, keyboard 1–3): [03-bcf-simulation-httpx-3672.slides.html](03-bcf-simulation-httpx-3672.slides.html) (v1 — the BCF-vs-naive simulation walkthrough, trajectories [SIM]), [03-bcf-simulation-httpx-3672.slides.v2.html](03-bcf-simulation-httpx-3672.slides.v2.html) (v2 — the raw training data for the same task, verbatim: the 8-field tasks.jsonl record, problem_statement, full test_patch, per-file gold-patch stats and hunks, the 740-node/1,618-edge graph file, and the snapshot tree; 100% [V], generated 2026-10-01), and [03-bcf-simulation-httpx-3672.slides.v3.html](03-bcf-simulation-httpx-3672.slides.v3.html) (v3 — the BCF run itself, step by step: 8 steps × before/during/after, the spec and journal t=09 verbatim, submit + Container B verdict, and per-phase/per-call duration estimates on a new [EST] tier anchored to the harness's documented budgets and stated assumptions A1–A4; trajectory [SIM], harness facts [V], durations [EST], generated 2026-10-01). All standalone, no build step.

**Quality note:** both documents passed table-QC (uniform column counts per table, valid separator rows) — see the session QC log.


---

<!-- ====================================================================== -->
<!-- FILE: 01-bcf-integration-into-master-plan.md -->
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
<!-- FILE: 02-bcf-diagnostic-math-and-prior-research.md -->
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
<!-- FILE: 03-bcf-simulation-httpx-3672.md -->
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

