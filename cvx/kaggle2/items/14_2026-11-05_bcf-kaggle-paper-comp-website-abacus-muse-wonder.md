# COMBINED MARKDOWN - combine

_Generated 2026-11-07 21:50:28 | 8 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle2\items\combine_

## Contents

1. 00_README-abacus-muse-wonder.md
2. 01_BCF_Formalized_v2.md
3. 02_Is_BCF_a_Good_Paper_Topic.md
4. 03_BCF_Brain_Implementation_Blueprint.md
5. 04_Experiment_Protocol.md
6. 05_Kaggle_Paper_Writeup_v2.md
7. 06_Submission_Checklist_and_Timeline.md
8. 07_Sources_and_Evidence_Ledger.md

---

<!-- ====================================================================== -->
<!-- FILE: 00_README-abacus-muse-wonder.md -->
<!-- ====================================================================== -->

# BCF — Formalized Framework, Paper Verdict, and Real "Brain" Build Plan (2026-11-08)

> **Clock warning — read first:** Today is **2026-11-08**. The paper track closes **2026-11-12 11:59 PM UTC** (~4 days). The main agent competition closes **2026-12-02 11:59 PM UTC** (entry/merger **2026-11-25**). Any plan that treats December as the paper deadline will miss the paper entirely. Sources: local Kaggle snapshots (`input/kagglecomp/docs/markdown/`, `input/kagglecomp/intel_20260930/04-paper-track-intel.md`) re-checked against live web search 2026-11-08; the live Kaggle pages rate-limited the scraper ("Too many requests"), so deadline/criteria claims below cite the snapshot corpus plus the search-indexed competition summary and are flagged for a final logged-in re-check before clicking Submit (see 06, item P-1).

## Direct answers

| Question asked | Short answer |
|---|---|
| Is BCF coherent and testable? | **Yes — after tightening.** It decomposes into 4 axioms and 8 mechanisms, each with a falsifiable observable (01). The slogan "x′ ≻ x" is not a theorem; restated as monotone artifact accumulation + falling failure-signature recurrence, it becomes testable. |
| Is BCF a good paper topic for this contest? | **Yes, conditionally — as a scaffold/measurement paper, not as a philosophy paper.** It maps well onto Novelty / Quality / Relevance / Verifiability / Clarity (02), *if* it ships with at least pilot measured numbers and an honest "constructed vs measured" split. Without any measurement it scores as a position paper and likely loses to measured LoRA/graph papers. |
| Best prize target? | **Best New Resource ($10K)** is the most winnable framing — the 129-task 6-axis taxonomy + ablation protocol + ledger schema is a reusable resource. Overall Best Paper ($15K) needs measured results. See 02 §4. |
| How to build a real BCF "brain"? | Scaffold-first, single monolithic `LlmAgent`, no LoRA until a canary ladder passes. Full blueprint, file layout, prompts, risk gate, atomic decomposition, clean-room composer, effort governor, and ledger schema in 03. Experiment protocol in 04. |
| What can honestly be done by Nov 12? | Stub-submit the Writeup **today/tomorrow** (earliest-entry tie-break), run the A0–A2 pilot on 8–30 frozen tasks if local eval works, replace constructed numbers or delete the claims, submit final text by Nov 12. Hour-level plan in 06. |

## Reading order

| File | Contents | Audience |
|---|---|---|
| [01_BCF_Formalized_v2.md](01_BCF_Formalized_v2.md) | Constitution tightened: 4 axioms, 8 articles → mechanism → falsifiable test, corrected x′ ≻ x statement, hypotheses H1–H8 with refutation clauses | Author, reviewers |
| [02_Is_BCF_a_Good_Paper_Topic.md](02_Is_BCF_a_Good_Paper_Topic.md) | Verdict against the 5 judging criteria, prior-art collision audit, risks, prize-target strategy, pivot options if no measurements land | Author (decision) |
| [03_BCF_Brain_Implementation_Blueprint.md](03_BCF_Brain_Implementation_Blueprint.md) | Buildable agent: `submission.zip` layout, `agent.yaml` sketch, phase machine, risk gate, search suite, clean-room, governor, ledger schemas, hardening against the 8 known harness killers | Implementer |
| [04_Experiment_Protocol.md](04_Experiment_Protocol.md) | Frozen splits, ablation ladder A0–A8, metrics, statistics, what to run in 4 days vs 24 days, honesty rules | Author, implementer |
| [05_Kaggle_Paper_Writeup_v2.md](05_Kaggle_Paper_Writeup_v2.md) | Submission-ready Writeup draft (target < 3,000 words) with `[MEASURED: …]` slots — do not submit with slots unfilled or claims unlabeled | Author → Kaggle |
| [06_Submission_Checklist_and_Timeline.md](06_Submission_Checklist_and_Timeline.md) | Nov 8–12 paper sprint + Nov 13–Dec 2 agent sprint, checklists, do-not-submit gates | Author |
| [07_Sources_and_Evidence_Ledger.md](07_Sources_and_Evidence_Ledger.md) | Every load-bearing claim traced to a source with confidence label; corrections register | QC |

## What is new here vs the 2026-10-31 BCF package

| Delta | Detail |
|---|---|
| Deadline reality | Prior package already flagged Nov 12; this package makes it the organizing constraint and adds an hour-level sprint. |
| Nov 5 intel folded in | 305-thread census, 4,808-team leaderboard (top 0.29, 91% at 0.00), and the 8 silent execution killers now drive the Brain hardening list (03 §9) and the paper's motivation (05 §1). |
| Dataset grounding | The Nov 5 129-task 6-axis taxonomy (61.2% bug fix, 22.5% opaque prompts, 93.0% graph-reachable, 11 known-broken tasks) supplies stratification for the ablation ladder (04). |
| Novelty audit refreshed | LocAgent / AutoCodeRover / Agentless / DeskCheck-class scaffolds checked; BCF's defensible novelty narrowed to spec-ordering + priced risk gate + batonic recurrence metric, not "graph search" alone (02 §3). |
| Writeup v2 | Rewritten around measured-or-delete discipline; constructed case studies quarantined and labeled. |

## QC (2026-11-08)

| Check | Result |
|---|---|
| Markdown tables (separator-row detection, per-row cell counts vs header, backtick-aware pipe counting) | 36 tables across 8 files — **0 defects** |
| Writeup word count (05 §A, incl. headings/citations, author's counter) | **2,000 words** vs 3,000 cap — headroom reserved for measured results; Kaggle's counter is authoritative |
| Live Kaggle re-check | Scraper rate-limited ("Too many requests"); competition facts rest on Sept–Nov local snapshots + 2026-11-08 web search — logged-in re-verify is item P-1 in 06 |

## Standing honesty rules (apply to every file)

1. No number is presented as measured unless it came from a run recorded in the ledger. Constructed illustrations are labeled **constructed**.
2. The paper must not claim LoRA gains. Public evidence to 2026-11-05 is mixed-to-negative except verified teacher-localization SFT; LoRA is gated behind canaries (03 §8, 04 §5).
3. Known-broken public tasks (11 identified 2026-11-05, e.g. `fastapi_14186`) are excluded from local denominators, never silently counted as agent failures.


---

<!-- ====================================================================== -->
<!-- FILE: 01_BCF_Formalized_v2.md -->
<!-- ====================================================================== -->

# The Batonic Coding Framework (BCF) — Formalization v2

**Date:** 2026-11-08 · **Status:** Formalizes the author's Constitution verbatim in intent; tightens claims that were aspirational into claims that can fail. Prior formalization: `deliverables/2026-10-31-bcf-gemma4-whitepaper-bonus/01-bcf-formal-specification.md` (v1). This v2 adds hypotheses H1–H8, the value-function correction, and failure-signature recurrence as the primary batonic observable.

## 1. Scope statement

BCF is a **process framework for autonomous code repair**, not a model architecture. It constrains *the order in which an agent acquires information, mutates code, verifies, and banks what it learned*. It is substrate-independent (any LLM agent), and is instantiated here for the Kaggle Gemma 4 harness (Gemma 4 31B QAT, ADK `agent.yaml`, 9 harness tools, 12 h / ~120 tasks).

Research question the framework answers: *Does enforcing information-ordering (specify → localize on structure → gate mutations → verify → bank artifacts) reduce wasted turns and regressions enough to raise resolved-task rate under a fixed wall-clock budget, compared with an otherwise identical free-form agent?*

## 2. The value claim, corrected

The Constitution states: "every input generates an output of value … x′ is asymptotically greater than x." As written this is unfalsifiable (what is "value"? compared to what?). Tightened version:

| Term | Definition |
|---|---|
| State `s_t` | Workspace + verified-passing test set `W(s_t)` + durable artifact store `K_t` (ledgers, specs, failure signatures, promoted rules) after task `t` |
| Artifact store monotonicity | `K_{t+1} ⊇ K_t` and `K_{t+1} ≠ K_t` — every terminal task appends at least one ledger row; failures append a root-cause row, so a failed task still banks information |
| Verified-set monotonicity (committed states only) | `W(s_{t+1}) ⊇ W(s_t)` along the committed chain; uncommitted exploratory states may regress, committed states may not knowingly do so |
| Batonic claim (testable form) | As `K` grows, the **recurrence rate** of previously seen failure signatures falls, and turns-to-resolution on signature-matched tasks falls, relative to a memory-less baseline |

Why this is the right tightening: monotone accumulation is guaranteed by construction (append-only ledger), so claiming it proves nothing about *usefulness*. The useful, falsifiable consequence is recurrence reduction. If recurrence does not fall, the ledger is dead weight and Axiom A2 is refuted in practice (see H7).

The handoff clause ("output handed to another machine generates the next higher value") becomes the **BCF-Artifact envelope**: a versioned bundle `{spec corpus, L0/L1 ledgers, taxonomy/codebook version, prompt/skill deltas, adapter cards, run receipts}` that a consumer must schema-validate and pass through its own promotion gate before adopting. "Higher value" is then an empirical property of the consumer's held-out comparison, not a property asserted by the producer.

## 3. Four axioms

| Axiom | Statement | Formal shape | Forbidden failure |
|---|---|---|---|
| A1 Conservation | Never knowingly destroy working code; every committed mutation is reversible to the last verified state | `W` monotone on committed chain; rollback target = `argmax_j W(s_j)` | Shipped regressions; "fixed one bug, broke two" |
| A2 Ascent (batonic) | Every input yields ≥ 1 durable artifact of positive information value | `K_{t+1} ⊃ K_t` (strict, by ≥ 1 ledger row) | Null-output loops; re-deriving the same diagnosis every session |
| A3 Single Writer | Exactly one authority mutates a given working set at a time; all others read | Serialization invariant on writes per working set | Write–write races; merged nonsense states |
| A4 Grounded Truth | Every atomic construct used in reasoning traces to an authoritative reference | Total traceability τ: `atom → (ref_id, version, locator)`; unanchored atoms are marked *unverified* and priced one risk class higher | Hallucinated APIs/semantics entering a patch |

## 4. Eight articles → mechanisms → falsifiable tests

| # | Constitutional article | Mechanism (03 §) | Enforcement point | Falsifiable observable | Hypothesis |
|---|---|---|---|---|---|
| C1 | Preserve working code | Verified-state chain + validation gate + rollback (03 §5) | `submit_patch()` only after targeted tests pass or best-effort rule fires | Committed regressions = 0; wrong-edit count | H3 |
| C2 | Single point of contact; gated permission by risk | Risk Gate R0–R4 (03 §6) | Gate decision precedes every `edit_file` / `write_file` | 100% of mutations have a gate record; unauthorized mutations = 0 | H3 |
| C3 | Document process at highest necessary fidelity | Fidelity Ladder L0–L4 (03 §10) | Ledger write on every phase transition, gate decision, tool result | A stranger reconstructs decisions from L0 alone; behavior from L2 | H8 (audit) |
| C4 | Full developer reference, LLM-friendly (source of truth) | Reference Pack: chunked, anchored, version-pinned (03 §7) | Atoms in spec/patch carry τ anchors | Anchor coverage of patch atoms; unverified-atom leakage = 0 | H2 |
| C5 | Binary search + BFS/DFS; atomic-decomposition tool traceable to reference | Search Suite + `decompose_atomic` (03 §7) | Protocol binding in phase machine | Localization turns vs grep-first baseline | H1, H2 |
| C6 | Clean-room tool to assemble solutions from atoms | `cleanroom_compose` (03 §8) | Inputs restricted to τ-anchored atoms + interfaces; suspect implementation body excluded | Candidate viability rate; copy-bug recurrence | H6 |
| C7 | RCA + post-mortem checkpoints for self-learning | Improvement Loop + promotion gate (03 §10) | Post-mortem on every terminal task | Failure-signature recurrence falls over corpus order | H7 |
| C8 | Effort/thinking adjustment: speed vs quality under constraints | Effort Governor policy table (03 §9) | Per-phase thinking/sampling policy in config | Score-vs-turns frontier; budget overruns = 0 | H5 |

## 5. Hypotheses and refutation clauses (pre-register these in the paper)

| ID | Hypothesis | Primary metric | Refuted if |
|---|---|---|---|
| H1 | Graph-first localization cuts localization turns ≥ 50% vs grep-first at no PASS loss | Localization turns; PASS (paired) | Turn reduction < 50% or PASS drops beyond noise on held-out split |
| H2 | Atomic decomposition with τ anchors reduces wrong-class anchoring | Wrong-class rate on multi-bug / opaque-prompt strata | No reduction on those strata vs A0 |
| H3 | Risk Gate eliminates committed regressions and protected-file waste at acceptable overhead | Committed regressions; gate overhead turns | Regressions > 0, or overhead turns exceed saved turns |
| H4 | Spec-first ordering reduces fix-order errors on multi-bug tasks | Fix-order errors (multi-bug stratum) | No reduction vs A0 on that stratum |
| H5 | Effort Governor converts would-be overruns into submitted partial patches | Overrun rate; submission rate; score | Overruns or zero-submissions not reduced |
| H6 | Clean-room composition reduces copy-then-tweak recurrence | Copy-bug signature recurrence | Recurrence unchanged vs direct-edit arm |
| H7 | Batonic accumulation works: failure-signature recurrence falls as `K` grows | Recurrence rate vs corpus position | Recurrence flat or rising across ordered corpus |
| H8 | Fidelity Ladder suffices for triage | Reconstruction audit pass rate | Auditor cannot reconstruct decisions from L0 / behavior from L2 |

Statistics discipline (from prior BCF protocol, unchanged): paired exact McNemar on PASS/FAIL, Holm correction across rungs, Wilson intervals on proportions, frozen splits, ≥ 3 seeds where variance ≥ effect size, and the public-leaderboard noise fact (1 task ≈ 0.017; run-to-run sd ≈ 2.5–3 tasks on ~58 public tasks) respected before believing any single-run delta. Full protocol: 04.

## 6. Coherence audit

| Component | Status | Note |
|---|---|---|
| A1 / A3 / C1 / C2 | Coherent, mechanically enforceable | Testable immediately at rung A3 |
| C3 / C4 | Coherent, implementable today | Only open choice is the cost model for "necessary" fidelity — the ladder makes it explicit |
| C5 | Coherent | Graph tools are harness-native; `bisect_state` is bounded by the sandbox's truncated git history (forward history removed) — declare this limit |
| C6 | Coherent, novel-in-composition | Quarantine is a prompt/skill-level constraint in this harness, not a sandbox guarantee — declare honestly; LLM weights may already "know" the original code, so claim *contextual* clean-room, not epistemic clean-room |
| C7 | Coherent | The promotion gate (held-out improvement + attempted refutation) is what separates this from "we log things" |
| C8 | Coherent | Pure policy table; zero model cost |
| A2 / x′ ≻ x | Design goal, not theorem | Monotone accumulation is architectural; *score* ascent is exactly what H1–H7 measure |

## 7. What BCF is not (claims to never make)

| Forbidden claim | Why |
|---|---|
| "BCF improves any model on any task" | Only tested on Python repo repair under this harness until proven otherwise |
| "The ledger guarantees learning" | It guarantees storage; learning is H7, and H7 can fail |
| "Clean-room guarantees originality / license safety" | Contextual quarantine only; training-data contamination is unresolved in the literature and must not be claimed away |
| "LoRA is part of BCF's gains" | Unless the canary ladder (04 §5) passes with held-out numbers |


---

<!-- ====================================================================== -->
<!-- FILE: 02_Is_BCF_a_Good_Paper_Topic.md -->
<!-- ====================================================================== -->

# Is BCF a Good Paper Topic for the Gemma 4 Developer Agent Paper Track?

**Verdict: Yes — conditionally.** BCF is a good topic *if* submitted as a **measured scaffold-and-measurement paper** (framework + frozen corpus + ablation protocol + at least pilot numbers). Submitted as pure philosophy ("a constitution for coding"), it will likely be scored as low-Verifiability and lose. The difference between those two submissions is about 2–4 days of pilot runs, which is exactly the time available (Nov 8 → Nov 12). This is a close call, and the honest recommendation is: **submit, but submit the measured-or-honest version, and target Best New Resource first.**

## 1. The judging rubric (verified)

Paper track facts (local snapshot `04-paper-track-intel.md`, corroborated by live web search 2026-11-08): separate Kaggle hackathon; Kaggle Writeup ≤ **3,000 words**; deadline **2026-11-12 11:59 PM UTC**; prizes **$15K Overall Best Paper / $10K Best New Resource / $10K Best New Application** ($35K total); non-archival (arXiv parallel submission allowed and encouraged); main-competition entry **not** required; up to 2 writeups judged per team; code optional but encouraged.

| Criterion (0–5 each, equal weight) | What judges ask | BCF's natural strength | BCF's risk |
|---|---|---|---|
| Novelty | New insights, deeper understanding, important properties of existing methods | Spec-ordering + priced risk gate + recurrence metric is a distinct combination | "Graph search for localization" alone is **not** novel (LocAgent, AutoCodeRover, SpecRover) — claiming it invites a novelty deduction |
| Quality | Generalizes beyond this competition | Phase machine + gate + ledger are harness-independent; turn-budget argument is general | Over-fitting prose to Kaggle quirks undercuts this — keep harness facts in a clearly-marked instantiation section |
| Relevance | Impact on SE and agentic learning | Directly on-mission: small local models, consumer hardware, budget-bound repair | Must tie claims to the 12 h / ~120-task budget reality, not generic "AI coding" |
| Verifiability | Enough method + evidence detail to understand and check | Pre-registered refutations (H1–H8), frozen 129-task corpus, exact paired statistics | **The make-or-break criterion.** Zero measured numbers = judges cannot verify; constructed examples must be labeled or this becomes an integrity problem, not just a score problem |
| Clarity | Clearly presented | Constitution → axioms → mechanisms is a clean narrative spine | Jargon ("batonic", "x′ ≻ x") needs one plain-English sentence each or Clarity suffers |

Estimated scoring (author's judgment, not a guarantee): with pilot A0–A2 numbers on 30 tasks, BCF is competitive for Best New Resource and a plausible Overall contender. With no numbers, expect mid-pack: Novelty 3, Quality 3, Relevance 4, Verifiability 1–2, Clarity 3–4.

## 2. Why the timing actually favors a scaffold paper

Field evidence to 2026-11-05 (305-thread census, 4,808 teams): top public score **0.29** (one team), nine teams at 0.24, and **91% of teams at 0.00** — blocked less by model capability than by harness failures (tool-parser hangs, edit serialization loops, compaction wiping tool calls, LoRA serving failures, 12 h timeouts). A paper that (a) names these failure classes, (b) shows a scaffold designed against them, and (c) measures even a pilot slice, is *more* relevant to this judging panel than another "we fine-tuned and it helped/hurt" report — because it explains the field's dominant phenomenon (mass zero scores) rather than only the top of the board.

## 3. Prior-art collision audit (what BCF must not claim as new)

| Prior work | What it already does | What remains BCF's to claim |
|---|---|---|
| SWE-agent (ACI) | Tool-interface design for agents | Not tool design — BCF's claim is ordering + gating policy *above* the tools |
| Agentless | Fixed localize → repair → validate pipeline beats free agency on cost | BCF agrees and adds: spec-before-read, priced mutation risk, post-mortem accumulation; must cite Agentless as the strongest "less agency" baseline and position BCF as *disciplined* agency |
| AutoCodeRover / SpecRover | AST/structure-aware retrieval, spec-ish exploration | Not structural retrieval itself |
| LocAgent / graph-guided localization (incl. 2025–26 graph + hop-depth studies) | Heterogeneous code graphs, multi-hop localization; hop-depth predicts failure | Not graph localization. BCF can *use* hop-depth as a stratification variable (Nov 5 taxonomy Axis 5 already provides graph-reachability classes) |
| DeskCheck-class systematic-reasoning scaffolds (2026) | Enforced execution-simulation reasoning phases, +6–10% on SWE-bench-Pro class benchmarks | Not "systematic reasoning" generically; BCF's wedge is the *risk-priced mutation gate* + *batonic recurrence measurement* |
| SWE-Gym / trajectory SFT literature | ~500 verified trajectories for weight-level gains | Justifies scaffold-first, LoRA-second; cite as the reason LoRA is gated, not assumed |
| Verification-gate / behavior-pinning agent tooling (industry, 2026) | Deterministic gates, shadow trees, pinned baselines | BCF's gate is a *turn-budget* instrument inside a 12 h contest harness, priced in wasted turns (e.g., R4 test-file edits are force-reset by the verifier, hence provably wasted) — that pricing argument is the fresh angle |

**Defensible novelty statement (use this shape in the paper):** "BCF's contribution is not graph search, specification, or validation in isolation — each exists. It is (i) making specification the *entry condition* for any repository access, (ii) pricing every mutation's blast radius *before* execution in units of the scarce resource (turns under a fixed budget), and (iii) a pre-registered measurement protocol, including a recurrence metric, under which each of those commitments can be shown *not* to work."

## 4. Prize-target strategy

| Target | What wins it | BCF fit | Recommendation |
|---|---|---|---|
| Overall Best Paper ($15K) | Novel + measured + clear | Needs real A0–A5 numbers; 4 days is enough for A0–A2 pilot only | Stretch goal; write so pilot numbers slot in without restructuring |
| Best New Resource ($10K) | A reusable artifact others can build on | **Strongest fit:** the 6-axis 129-task taxonomy + frozen splits + ablation protocol + ledger/gate schemas are directly reusable | **Primary target.** Foreground the resource (corpus + protocol + schemas) in title/abstract framing |
| Best New Application ($10K) | A working novel application of Gemma 4 agents | Requires the Brain to actually run and score | Secondary; becomes primary only if the Brain posts a non-zero public score before Nov 12 (possible but not required for the paper) |

Title implication: a resource-flavored title ("…: A Frozen 129-Task Corpus, Ablation Protocol, and …") signals the resource to judges in the first 5 seconds. The current draft title in 05 keeps the framework name but subtitles the resource.

## 5. Risks and mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| No measured numbers by Nov 12 | High — guts Verifiability | Pilot-8 → dev-30 A0/A1/A2 is the minimum viable measurement (04 §3); if even that fails, delete quantitative claims and reframe explicitly as a protocol/resource paper (still submittable, weaker) |
| Judges read "batonic / x′ ≻ x" as mysticism | Medium | One plain sentence: "every task, pass or fail, must leave a reusable artifact; we measure whether that reduces repeated failures." Keep formalism in one short subsection |
| Novelty collision with graph-localization papers | Medium | §3 positioning; cite them; claim the combination + gate pricing + recurrence metric |
| Constructed case studies mistaken for results | High (integrity) | Label "constructed" in text, captions, and limitations; never in the abstract as findings |
| Missing the Nov 12 deadline by planning to Dec 2 | Fatal | 06 timeline; stub-submit by Nov 9–10 (5 writeups/day allowed; earliest entry wins ties per prior intel — re-verify on the live page when logged in) |
| Paper promises LoRA gains the field hasn't reproduced | Medium | Scaffold-first stance; LoRA presented as a gated future rung (A7) with the public null results cited |

## 6. Pivot options if measurements don't land

| Pivot | When | Paper becomes |
|---|---|---|
| P1 (preferred fallback) | Pilot runs but held-out doesn't finish | Pilot numbers reported as pilot (n, split, CIs stated); claims scoped to pilot |
| P2 | No runs at all by Nov 11 | Pure resource/protocol paper: taxonomy + protocol + harness failure analysis (the 8 killers as a taxonomy contribution). Honest, still relevant, Verifiability rests on the corpus/protocol being checkable |
| P3 | Brain scores publicly before Nov 12 | Add the public-score receipt as an application vignette (with the noise caveats: 1 task ≈ 0.017) |

Do **not** pivot to inventing numbers. In a judged paper with optional public code, one fabricated table risks the whole entry and the author's credibility for the main competition.


---

<!-- ====================================================================== -->
<!-- FILE: 03_BCF_Brain_Implementation_Blueprint.md -->
<!-- ====================================================================== -->

# BCF Brain — Implementation Blueprint (BCF-Gemma profile)

**Goal:** a real, submittable `submission.zip` implementing BCF on the Kaggle Gemma 4 harness — scaffold-first, single-writer, no LoRA until gated. Every design choice below traces to either the Constitution (01), a harness fact, or a field failure observed to 2026-11-05. Where a fact could not be re-verified live (Kaggle rate-limited the scraper 2026-11-08), it is marked **[re-verify at build]**.

## 1. Hard harness constraints (design inputs, not preferences)

| Constraint | Value / rule | Source confidence |
|---|---|---|
| Base model (main) | `gemma-4-31b-it-qat-w4a16-ct` for every agent/sub-agent | High — competition overview snapshot |
| Submission shape | `submission.zip` with `agent.yaml` at root; `!include` for prompts/configs; ≤ 3 GiB unpacked **[re-verify]**; no `../`, no symlinks | High — overview + rules snapshots |
| Tools (only these) | `run_command`, `submit_patch`, `get_status`, `read_file`, `edit_file`, `write_file`, `get_code_neighbors`, `search_similar_code`, `get_code_subgraph` | High — overview snapshot |
| Budget | 12 h total for ~120 hidden tasks incl. sandbox setup; per-task limits via `eval_config.yaml` | High |
| Context | 32,768 tokens **[re-verify]**; harness compaction exists but is field-reported to drop tool calls — do not rely on it | Medium-high — prior BCF package + thread 754783 |
| Scoring | Patch applied, validation tests run, PASS/FAIL per task; score = % passed; verifier force-resets agent-touched test files | High |
| Array tool args | **Banned in practice:** vLLM array-arg parser can hang the server (thread 753973) — expose only scalar-typed tool surfaces in prompts/skills | High — multiple corroborations to 2026-11-05 |
| Multi-agent | Field-reported broken patterns: `SequentialAgent` continuation nudge restarts wrong sub-agent (754636); compaction wipes tool calls (754783) → **single monolithic `LlmAgent`** | High |

## 2. Submission layout

```text
submission.zip
├── agent.yaml                  # root LlmAgent, model gemma-4-31b-it-qat-w4a16-ct
├── configs/
│   └── sampling.yaml           # thinking budgets per governor; seed if supported
├── prompts/
│   ├── system.md               # the Constitution, operationalized (short)
│   ├── phase_spec.md           # P1 spec schema + fix-order rules
│   ├── phase_patch.md          # P3 patch discipline + gate rubric (model-facing summary)
│   └── rescue.md               # escalation / best-effort-submit rules
├── skills/
│   ├── bcf_decompose/          # SKILL.md + scripts/decompose.py (atomic decomposition)
│   ├── bcf_localize/           # SKILL.md + scripts/graph_localize.py (BFS/DFS wrappers)
│   ├── bcf_gate/               # SKILL.md + scripts/risk_gate.py (deterministic R0–R4)
│   ├── bcf_cleanroom/          # SKILL.md + scripts/compose.py (quarantined candidate builder)
│   └── bcf_ledger/             # SKILL.md + scripts/ledger.py (L0/L1 writer + RCA close-out)
└── adapters/                   # EMPTY until canary ladder passes (04 §5)
```

Skill scripts run via `run_skill_script` in the sandbox, share the workspace filesystem, and debit the central budget — keep them fast, deterministic, and stdlib-only (offline wheels only).

## 3. The phase machine (the Brain's control flow)

Phases advance forward only; one escalation edge. The system prompt must state this as an invariant, and every turn must end in a tool call (harness nudge-terminates after repeated stops — prior package).

| Phase | Entry | Required actions (in order) | Exit artifact | Turn soft-cap |
|---|---|---|---|---|
| P1 Specification | Task issued | `decompose_atomic` on issue text → per-bug Hypothesis / Target / Fix-shape triples + causal fix order; mark opaque prompts (PC-4/PC-5 class) explicitly | Spec block in ledger (L1) | 3 |
| P2 Localization | Non-empty spec | Graph first: `search_similar_code` + `get_code_neighbors` on spec symbols → `get_code_subgraph` → only then bounded `read_file` (explicit `start_line`/`end_line`, ≤ 150 lines) | Ranked symbols + line ranges | 10 |
| P3 Patch | Line-anchored plan | `risk_gate` on proposed edit → if R ≤ 2, apply minimum viable patch root-cause-first; prefer clean-room candidate for copy-prone fixes | Applied patch + gate record (L0) | 8 |
| P4 Validation | Patch applied | Targeted `run_command` pytest (failing tests + graph-neighborhood passing tests) → PASS: `submit_patch`; FAIL: one corrective edit; 2nd FAIL: escalation edge | PASS/FAIL + test output ref | 6 |
| P5 Post-mortem | Terminal (either) | `ledger.py close` — RCA row, failure signature, turn counts, gate decisions | Ledger close-out (banks A2) | 1 (best-effort, never blocks submission) |

Escalation edge (P4 2nd FAIL): choose exactly one — (a) re-spec once (back to P1 with failure evidence appended), or (b) best-effort `submit_patch` of the least-bad state. Never loop edit→fail→edit without a re-spec; identical failed tool calls are circuit-broken after 2 repeats (killer #2, §9).

## 4. System prompt (draft — keep under ~1,200 tokens)

```markdown
You are a BCF coding agent. You repair one Python issue per task under a strict budget.
Rules that override all other instincts:
1. SPECIFY BEFORE READING. First output a spec: for each bug — Hypothesis (falsifiable),
   Target symbols (may be empty), Fix-shape (guard | boundary | contract | rename | other),
   and fix order if several bugs interact. Do not read files before the spec.
2. LOCALIZE ON THE GRAPH. Use search_similar_code / get_code_neighbors / get_code_subgraph
   before grep or full-file reads. Read files only in bounded slices (start_line/end_line).
3. GATE EVERY EDIT. Before edit_file/write_file, state: files, symbols, tests affected,
   risk class R0-R4. Never edit tests, conftest, or packaging (R4 — always refused).
   One symbol per edit where possible. Never repeat an identical failed tool call;
   after 2 identical failures, change method (line-range edit or heredoc via run_command).
4. VALIDATE, THEN SUBMIT. Run targeted pytest after every patch. On PASS call submit_patch.
   On 2nd FAIL, either re-specify once or submit the best current patch. Always submit something.
5. BANK THE RESULT. End with a ledger close: root cause (or best hypothesis), failure
   signature, what worked. A failed task with a good ledger entry beats a silent failure.
Never restate file contents in prose. Never emit array-typed tool arguments.
Every response must end with a tool call.
```

## 5. Conservation & validation gate (C1)

- Before first edit: record baseline via `get_status` + `git status` (`run_command`); note currently-passing targeted tests where cheap.
- `submit_patch()` fires only on: targeted tests PASS, **or** best-effort rule (budget floor reached, or escalation (b) chosen). Log which rule fired (L0).
- Rollback: `git diff` / `git checkout -- <file>` to last verified state; never hand-reconstruct a "probably good" version.

## 6. Risk Gate (C2) — deterministic rubric

Implemented twice: as model-facing rubric text (prompt) **and** as `risk_gate.py` (deterministic check on the proposed file/symbol/test sets, called via `run_skill_script`). The script is authoritative; the model's self-assessment is advisory.

| Class | Condition | Action |
|---|---|---|
| R0 trivial | Comment/doc only, no semantic change | Auto-approve, log |
| R1 local | Single symbol; covered by failing + passing tests | Approve; queue targeted pytest |
| R2 structural | Shared symbol; callers exist in graph | Approve only with caller impact list attached (`get_code_neighbors`) |
| R3 wide | Multi-file or API-shape change | Refuse; return to P1 (spec amendment) |
| R4 protected | Tests, conftest, packaging, harness files | **Reject** — verifier force-resets these; the edit is provably wasted turns |

Gate record (L0, one JSON line): `{task, ts, files, symbols, tests_affected, class, decision, rationale_code}`.

## 7. Search suite & atomic decomposition (C4, C5)

`decompose_atomic(issue_text, graph_hints) -> atoms[]`, each atom `{kind: exception|symbol|construct|structure, text, tau: (ref_id, version, locator) | UNVERIFIED}`. Reference Pack v1 for this harness = HARNESS_README semantics + Python version-pinned language facts + the Nov 5 taxonomy codebook (fault classes RC-1..RC-8) shipped as a skill resource file. Unverified atoms are allowed in the spec but price the resulting edit +1 risk class.

| Protocol | Space | Operator | Use when |
|---|---|---|---|
| `graph_bfs` | Call/dependency graph from symptom anchor | BFS over `called_by`/`calls`, fan-out ≤ 50 | Distance to root cause unknown |
| `graph_dfs` | Named hypothesis chain | DFS end-to-end | Spec already names a suspected chain |
| `bisect_state` | Git history in sandbox | Binary search on last-verified state | Regression tasks; bounded — sandbox history is truncated (forward history removed) |

Stratify expectations by the Nov 5 taxonomy: ~93% of public tasks are graph-reachable (GRAPH-1..3); ~7% are graph blind spots (docs_src/tutorial-coupled) — for those, P2 falls back to bounded directory listing + targeted reads, and the spec must say so.

## 8. Clean-room composer (C6) — honestly scoped

`cleanroom_compose(spec, atoms, interface_only)`: builds a candidate patch from τ-anchored atoms and standard structures, with the suspect implementation body **excluded from its input**. Claim only *contextual* quarantine (the composer didn't re-read the broken body in this session); do **not** claim the model's weights have never seen similar code. Use for copy-prone fix shapes (guard/boundary rewrites); route candidates through the same Risk Gate. Measure copy-bug recurrence (H6) before claiming benefit.

## 9. Effort Governor (C8) + hardening against the 8 known killers

Governor (policy table in `sampling.yaml` + prompt; **[re-verify]** exact ADK keys at build):

| State | Thinking | Rationale |
|---|---|---|
| P1 spec | High (4096 if supported) | Errors here poison everything downstream |
| P2 graph queries | Low | Cheap, reversible steps |
| P3 first edit | Medium | Bounded transcription from anchored plan |
| P4 validation read | Low | Deterministic parse |
| Escalation / re-spec | High | Highest-value decision in the run |
| Budget < 20% | Floor, terse | Guarantee a submission; empty patch scores 0 |

Hardening checklist (from the 2026-11-05 census; each maps to a Brain rule):

| # | Killer (thread) | Brain countermeasure |
|---|---|---|
| 1 | Array-arg parser hang (753973) | No array-typed arguments anywhere in prompts/skills; scalar strings only |
| 2 | `edit_file` serialization loop, 51 identical failures (756051) | Identical-call circuit breaker (max 2); fallback to line-range edit or single-arg heredoc patcher via `run_command` |
| 3 | Compaction drops tool calls (754783) | Do not depend on harness compaction; keep own L0/L1 scratchpad state in workspace file |
| 4 | Continuation nudge restarts wrong sub-agent (754636) | Single monolithic `LlmAgent`; no `SequentialAgent` |
| 5 | LoRA token/latency inflation → 12 h timeout (755677) | No adapter until canaries (04 §5); per-task wall-clock ceiling (~6 min) in `eval_config.yaml` **[re-verify key]** |
| 6 | PEFT `Gemma4ClippableLinear` failure (755677) | If LoRA attempted: verify adapter loads + changes output locally; never trust logs alone |
| 7 | `read_file` 150-line silent cap → duplicate reads (755291) | Always pass explicit `start_line`/`end_line`; ≤ 150-line slices; never re-read without new bounds |
| 8 | Impossible tasks: skipped required tests (755554, 754586) | Exclude 11 known-broken public tasks from local denominators; in hidden eval, submit best-effort and bank the signature — do not burn budget proving impossibility |

Also: scratch/test scripts go to `/tmp`, never `/workspace` (untracked files pollute `git diff` patches); queue reality — submissions can take 28–36 h around deadlines, so never plan a first submission for the last 48 h.

## 10. Ledger schemas (C3, C7) — the Brain's memory

Fidelity ladder: L0 decision ledger (~100 B/row, always) · L1 query ledger (~1 KB/turn, always) · L2 tool transcript (harness-native) · L3 thoughts (when thinking on) · L4 state dumps (on demand).

```json
{"type":"gate","task":"fastapi_11194","files":["fastapi/routing.py"],"symbols":["APIRoute"],"tests":["tests/test_router.py"],"class":"R1","decision":"approve"}
{"type":"close","task":"fastapi_11194","result":"PASS","turns":14,"localization_turns":4,"wrong_edits":0,"signature":"RC-1A:introspection-callable","rca":"..."}
```

Failure signature = normalized `{root_cause_class (RC-*), symptom_class (FM-*), fix_shape}` triple — stable across sessions, countable for recurrence (H7). Promotion gate for any ledger-derived rule/prompt change: held-out improvement + one attempted refutation, recorded before adoption. That gate is the difference between "self-improving" and "self-confirming."

## 11. Build order (do these in sequence; stop at the first red)

| Step | Deliverable | Done when |
|---|---|---|
| B1 | `agent.yaml` + system prompt, A0-equivalent minimal agent | Local validator passes; zip structure clean |
| B2 | + P1 spec gate (A1) | Spec block present in trace on pilot tasks |
| B3 | + graph-first P2 (A2) | Localization turns measurable vs B1 |
| B4 | + Risk Gate script + validation gate (A3/A4) | Gate records on 100% of edits in local runs |
| B5 | + governor + rescue + circuit breakers (A5) | No hung tasks on pilot; every task submits something |
| B6 | Ledger close-out + RCA (P5) | L0/L1 complete for every local task |
| B7 | Clean-room composer (A6) | Optional before Dec 2; only if B1–B6 are green |
| B8 | LoRA (A7) | Only via canary ladder (04 §5); default = ship without |


---

<!-- ====================================================================== -->
<!-- FILE: 04_Experiment_Protocol.md -->
<!-- ====================================================================== -->

# Experiment Protocol — Grounding BCF in Actual Results

**Principle:** the paper (deadline Nov 12) and the agent (deadline Dec 2) need *different* amounts of evidence. The paper needs an honest pilot; the agent needs the full ladder. Do not hold the paper hostage to the full ladder, and do not inflate the pilot into full-ladder claims.

## 1. Frozen corpus and splits (from the Nov 5 taxonomy deliverables)

Corpus: 129 public tasks (`tasks.jsonl`; 67 fastapi / 48 rich / 13 requests / 1 httpx; 127 unique commits). Stratification available per task: intent (CAT), root cause (RC), prompt clarity (PC), complexity tier, graph class, failure phenotype (FM) — use these as pre-registered strata, especially PC-4/PC-5 (opaque prompts, 22.5%), multi-bug, and GRAPH-4 (graph blind spots).

| Split | n | Use |
|---|---|---|
| pilot-8 | 8 | Smoke: harness works, traces parse, metrics compute |
| dev-30 | 30 | Rung comparisons during development |
| held-out-30 | 30 | Locked; touched once per rung for the reported number |
| pooled-129 | 129 | Final descriptive stats only (no tuning on it) |

Exclusions (pre-registered): the 11 known-broken public tasks (2026-11-05 intel, threads 755554/754586 — e.g. `fastapi_14186` with mutually exclusive pydantic v1/v2 test predicates) are excluded from all denominators and listed by ID in the paper appendix. Gold-patch facts for sanity checks: 70.5% single-file; median +8 lines; 0/129 touch test files.

## 2. Ablation ladder

| Rung | Config (cumulative) | Tests | Primary readout |
|---|---|---|---|
| A0 | Minimal single `LlmAgent`, free-form | Baseline | PASS, turns |
| A1 | + P1 spec gate | H4, H2 | Fix-order errors; wrong-class rate |
| A2 | + graph-first localization + `decompose_atomic` | H1, H2 | Localization turns (target ≥ 50% cut) |
| A3 | + Risk Gate | H3 | Committed regressions (= 0); gate overhead |
| A4 | + targeted validation + rollback | H3 | Invalid-patch / bad-submission rate |
| A5 | + governor + rescue + circuit breakers | H5 | Overruns; submission rate |
| A6 | + clean-room composer | H6 | Copy-bug recurrence |
| A7 | + gated LoRA (only if §5 passes) | Weight-channel gain | Held-out Δ vs best scaffold |
| A8 | BCF-E profile on E4B (bonus track) | Transfer to 4B-class brain | PASS vs 31B profile, capability-ratio-adjusted |

## 3. The 4-day paper pilot (Nov 8–12) — minimum viable measurement

| Day | Run | Output for the paper |
|---|---|---|
| Nov 8 | Freeze splits; verify local scorer/validator on pilot-8 with A0 | "Harness verified" statement or a blocker note |
| Nov 9 | A0 + A1 on pilot-8, then dev-30 if pilot is clean | Stub Writeup submitted (title + abstract) — do not wait for numbers |
| Nov 10 | A2 on dev-30; paired comparison A0 vs A2 | Localization-turn table (the paper's one quantitative centerpiece) |
| Nov 11 | A3 spot-check on dev-30 (gate overhead + regressions); freeze numbers by 18:00 UTC | Fill `[MEASURED: …]` slots or execute pivot P1/P2 (02 §6) |
| Nov 12 | Text-only edits; word count; submit before 23:59 UTC | Submitted Writeup (click Submit — drafts are not judged) |

If local eval cannot run (GPU, wheelhouse, sandbox issues), the fallback is P2 (02 §6): a resource/protocol paper. Decide by **Nov 10 evening**, not Nov 12.

## 4. Metrics and statistics

Per-task (from L0/L1 + harness trace): total turns; localization turns; wrong edits (edits absent from final patch); fix-order errors (multi-bug stratum); exploration turns; budget headroom at submission; committed regressions; failure-signature recurrence (ordered-corpus).

| Practice | Rule |
|---|---|
| Paired test | Exact McNemar on PASS/FAIL per rung pair (same tasks, same seeds where feasible) |
| Multiplicity | Holm correction across the ladder |
| Proportions | Wilson 95% intervals; report n with every % |
| Seeds | ≥ 3 where run-to-run variance ≥ effect size |
| Leaderboard noise | 1 task ≈ 0.017 on ~58 public tasks; sd ≈ 2.5–3 tasks — never claim a win inside noise |
| Honesty | "Measured" / "constructed" / "planned" labeled per number, in tables and captions |

## 5. LoRA canary ladder (gate before any adapter ships — main or bonus track)

Public evidence to 2026-11-05 is mixed-to-negative (multiple E4B/31B LoRA attempts scoring 0.00 or below baseline; the one reported win pattern is *verified teacher-generated localization SFT*). Hence:

| Gate | Test | Pass | On fail |
|---|---|---|---|
| C1 no-op canary | Rank-1 near-zero adapter attached | Score within noise of bare baseline (± ~3 tasks) | Drop adapters |
| C2 loud canary | Adapter trained to emit an obvious harmless behavior | Behavior visible in outputs AND score within noise | Drop adapters |
| C3 real candidate | Localization-SFT, ≤ ~500 verified trajectories | Held-out dev-30 beats scaffold-only by > noise | Ship scaffold-only |

Also verify: adapter packaging (`adapters/<name>/adapter_model.safetensors` + config), PEFT/`Gemma4ClippableLinear` compatibility, bf16-adapter-on-QAT-base behavior, and end-to-end wall-clock (adapters have been reported to inflate tokens/latency enough to threaten the 12 h cap).

## 6. What "grounded in actual results" means for the submission

| Claim type | Evidence required before it appears in the paper as a finding |
|---|---|
| "Graph-first cuts localization turns" | A0 vs A2 paired localization-turn counts on dev-30 (or labeled pilot-8) |
| "Spec-first reduces wrong-class anchoring" | A0 vs A1 wrong-class rates on the multi-bug / opaque strata |
| "Risk Gate prevents regressions" | A3 committed-regression count + overhead turns |
| "BCF raises PASS rate" | Held-out-30 paired PASS with McNemar + CI — **not** expected by Nov 12; phrase as protocol + pilot until measured |
| "Batonic accumulation reduces recurrence" | Ordered-corpus recurrence curve — a Dec 2 (main-track) result, stated as H7 in the paper |


---

<!-- ====================================================================== -->
<!-- FILE: 05_Kaggle_Paper_Writeup_v2.md -->
<!-- ====================================================================== -->

# Kaggle Paper-Track Writeup v2 — Submission Draft

**Instructions (delete before submitting):** Section A is the Writeup text. Cap: 3,000 words. Every `[MEASURED: …]` slot must be filled from a recorded run or the sentence deleted. Every constructed example must keep its label. Recount words on Kaggle (its counter is authoritative) before clicking Submit. Deadline: **2026-11-12 23:59 UTC**.

---

## A. Writeup text

# Specification-Driven, Risk-Gated Graph Reasoning for Budget-Constrained Coding Agents

## The Batonic Coding Framework: a frozen 129-task corpus, an ablation protocol, and a scaffold that banks every failure

### Abstract

Autonomous coding agents under a fixed wall-clock budget waste most of that budget deciding what to read, repeat failed tool calls, and discard everything learned from failures. We present the Batonic Coding Framework (BCF), a scaffold for repository repair built on four commitments: specify before reading, localize on the repository's code graph, price the risk of every mutation before executing it, and bank a reusable artifact from every task — pass or fail. BCF is specified as a five-phase machine with a deterministic risk gate (R0–R4), an atomic-decomposition step whose elements trace to a versioned reference, and a post-mortem ledger whose failure signatures make "learning from failure" measurable as a recurrence rate. We instantiate BCF on the Gemma 4 Developer Agent harness (Gemma 4 31B, 12 hours, ~120 tasks) and evaluate it on a frozen 129-task corpus of real pull-request repairs (FastAPI, Rich, Requests, HTTPX) that we stratify on six axes — intent, root-cause mechanism, prompt clarity, patch complexity, graph reachability, and failure phenotype. A pre-registered ablation ladder (A0–A5) isolates each mechanism, with explicit refutation conditions. [MEASURED: pilot A0–A2 results on the dev-30 split — localization turns and PASS, with intervals.] Our central claim is deliberately narrow: under a hard budget, ordering information correctly and gating mutations are worth more than additional free-form reasoning turns — and each part of that claim is stated so it can be shown false.

### 1. Introduction

The Gemma 4 Developer Agent competition scores an agent on roughly 120 hidden Python repair tasks inside a shared 12-hour budget — about six minutes per task for reading, localizing, patching, validating, and submitting. Field evidence from the competition's first six weeks suggests the budget, and the harness failure modes it exposes, are the binding constraints: as of 2026-11-05 the top public score was 0.29, and approximately 91% of 4,808 teams had solved no task at all, with public post-mortems attributing zero scores to tool-call serialization loops, a tool-parser hang on array-typed arguments, context compaction discarding tool calls, fine-tuning serving failures, and whole-run timeouts. In other words, the median competitor is not losing on code quality; it is losing on process discipline.

BCF targets that process layer. Its premise, drawn from a written constitution of process rules, is that a repair agent should be judged not only on patches but on what it conserves and what it banks: working code is never knowingly destroyed, every mutation is risk-priced before execution, and every terminal task — including failures — appends a structured artifact (a ledger row, a failure signature, a root-cause category) to a durable store. We call this property *batonic*: like a battery, the system stores charge from every input rather than dissipating it. Formally, the artifact store grows monotonically by construction; the scientifically interesting claim is the measurable consequence — that the recurrence rate of previously seen failure signatures falls as the store grows. That claim can fail, and our protocol is designed to let it.

Contributions: (i) the BCF phase machine, risk-gate rubric, and ledger/failure-signature schema; (ii) a turn-budget argument for why information ordering dominates cost under fixed budgets; (iii) a frozen, six-axis stratified 129-task corpus and a pre-registered ablation protocol with refutation conditions, released as a reusable resource; (iv) [MEASURED: pilot results] on the first ladder rungs; (v) an explicit accounting of which statements are measured, constructed, or planned.

### 2. The Batonic Coding Framework

**Phase machine.** BCF executes Specification → Localization → Patch → Validation → Post-mortem, advancing forward only, with one escalation edge: a second validation failure forces either a single re-specification or a best-effort submission. Each phase has an entry condition and an exit artifact, making scaffold compliance checkable from the tool-call trace alone.

**Specification before reading.** Each issue is decomposed, before any file access, into per-bug records: a falsifiable Hypothesis, candidate Target symbols, and a Fix-shape (guard, boundary, contract, rename, other). Multi-bug issues also receive a causal fix order, since fixing one bug can mask or expose another. An atomic-decomposition step breaks the issue into exception classes, symbols, language constructs, and data structures, each traced to a versioned reference entry or explicitly marked unverified; unverified atoms raise the risk price of any edit that uses them.

**Graph-first localization.** Localization begins with semantic code search and call-graph neighbor/subgraph queries over the symbols named in the specification. Files are read only afterward, in bounded line ranges. Text search is a fallback. When a task is a regression, binary search over the available history replaces structural exploration. This ordering matters because, in our corpus, the fix site is usually structurally — not lexically — related to the symptom.

**The risk gate.** Every mutation is priced before execution by scope (files, symbols, affected tests), verification coverage, reversibility, and protected-file status, yielding classes R0 (trivial) through R4 (protected). R3 structural changes force re-specification; R4 edits — tests, configuration, packaging — are rejected outright, because this harness's verifier force-resets agent-touched test files, making such edits provably wasted turns. Gate decisions are logged, making the gate itself auditable. This pricing-in-turns is, to our knowledge, BCF's most distinctive mechanism: prior verification gates ask "is this change safe?", while the BCF gate asks "is this change worth its expected turn cost under the remaining budget?"

**Validation, rollback, and the post-mortem.** Targeted tests gate submission; rollback restores the last verified state rather than a reconstructed guess. Every terminal task closes a ledger entry with turn counts, gate decisions, root-cause category, and a normalized failure signature (root-cause class × symptom class × fix-shape). Candidate rules derived from the ledger are promoted only after a held-out improvement and an attempted refutation — the promotion gate that separates accumulation from self-confirmation.

**Effort governance.** Thinking budget is a policy variable: high at specification and escalation (where errors poison downstream work), low for graph queries and validation reads, and floored when the remaining budget drops below 20%, guaranteeing that a submittable patch exists.

### 3. Why ordering dominates: a turn-budget argument

Let residual uncertainty about the root cause after i observations be H(R | o₁..ᵢ). Lexical queries (grep, file reads) reduce this uncertainty slowly when the fix is structurally distant from the symptom, so a naive agent's expected localization cost is governed by many weakly informative queries plus re-reads as context degrades. A graph query conditions on the induced subgraph G, collapsing residual uncertainty in one step for the bug classes in our corpus, because the call graph is the causal structure the fix must respect. The scaffolded cost is approximately c_spec + c_graph + (1 − q)·m·r, where q is the probability the specification orders the fix correctly, m the residual mislocalization penalty, and r the re-read cost. The model predicts that interventions raising q or collapsing H(R | G) cut turns multiplicatively, while faster reading cuts additively — a prediction the ablation ladder directly tests (H1, H2). A second structure, an exposition DAG over co-occurring bugs (fixing u reveals v's symptom), makes the specification's fix order a topological-order problem, observable as fix-order errors when violated.

### 4. Corpus and protocol

The corpus comprises the competition's 129 public tasks across 127 base commits (FastAPI 67, Rich 48, Requests 13, HTTPX 1), each a real pull-request repair with a reference patch and verification tests. We stratify every task on six axes: intent (61.2% functional bug fixes; 17.8% new features; the remainder refactors, migrations, and documentation-coupled tasks), root-cause mechanism (an Orthogonal Defect Classification adaptation), prompt clarity (22.5% of prompts are terse or reference an issue link unresolvable offline), patch complexity, graph reachability (93.0% of gold fix symbols are reachable via the provided code graph; the remainder are documentation-coupled blind spots), and failure phenotype. Splits are frozen (pilot-8 / dev-30 / held-out-30 / pooled-129), and 11 publicly identified environmentally impossible tasks (e.g., test patches requiring mutually exclusive dependency majors in one environment) are excluded from denominators and listed. Metrics per task: total and localization turns, wrong edits, fix-order errors, budget headroom at submission, committed regressions, and failure-signature recurrence. Paired exact McNemar tests compare PASS rates, with Holm correction across rungs and Wilson intervals on proportions.

The ladder adds one mechanism per rung: A0 minimal agent; A1 + specification gate; A2 + graph-first localization; A3 + risk gate; A4 + targeted validation/rollback; A5 + effort governor and rescue. Pre-registered refutations include: if A2 does not cut localization turns by at least half without PASS loss, the graph hypothesis is abandoned; if A1 does not reduce wrong-class anchoring on multi-bug and opaque-prompt strata, specification is decoration; if gate overhead exceeds saved turns, the gate is net-negative.

### 5. Pilot results [MEASURED — replace this section's bracketed text with recorded runs before submission]

[MEASURED: A0 vs A1 vs A2 on dev-30 (and pilot-8 if dev-30 incomplete): PASS counts with Wilson intervals, median localization turns, wrong-edit counts, paired comparison outcome. State n, split, seeds, and exclusions exactly. If only pilot-8 was run, say so and scope every claim to it.]

Two constructed illustrations (not measurements) show the intended mechanism. [CONSTRUCTED: single-file exception fix localized in 3 graph-guided tool calls vs 11 reads in a free-form trace.] [CONSTRUCTED: multi-module task where free-form reading exhausts the 32k context before localization, while the specification-plus-graph path completes with headroom.] These examples are included to make the mechanism concrete; no quantitative claim rests on them.

### 6. Related work

SWE-bench established repository-level repair evaluation. SWE-agent showed agent performance is scaffold-sensitive through its agent–computer interface. Agentless demonstrated that a fixed localize–repair–validate pipeline can beat free-form agency on cost, and is the strongest argument that BCF's phases should be enforced rather than suggested. AutoCodeRover and SpecRover introduced structure- and specification-aware exploration; LocAgent and subsequent graph-guided work showed heterogeneous code graphs improve multi-hop localization, and that structural hop-depth predicts failure — a variable our corpus stratifies explicitly. Systematic-reasoning scaffolds that enforce execution simulation across the repair lifecycle report consistent gains on recent SWE-bench variants. Trajectory-training work (e.g., SWE-Gym) bounds what weight-level improvement requires — on the order of 500 verified trajectories — which motivates our scaffold-first, adapter-second stance: in this competition, public fine-tuning reports are mixed-to-negative except for verified teacher-generated localization data, so BCF treats adapters as a gated later rung, not a premise. BCF differs from the above in making specification the entry condition for repository access, pricing mutations in expected turn cost before execution, and measuring self-improvement as failure-signature recurrence under a promotion gate.

### 7. Limitations

Pilot results cover at most the first ladder rungs on a 30-task development split; PASS-rate and recurrence claims (H5–H7 in our protocol) require the full ladder and ordered-corpus runs we have not completed. The corpus skews single-file (70.5% of gold patches) and two-library, so multi-bug and multi-file strata are small. The clean-room composer enforces contextual quarantine (the suspect implementation is excluded from its input), not epistemic quarantine — model weights may encode similar code — and we claim no originality or licensing property for it. The risk gate's R3 (API-shape) detection is heuristic. Hidden-test transfer is unproven, and public leaderboard deltas of a few tasks are within run-to-run noise (≈ 2.5–3 tasks), so we report task counts with intervals rather than leaderboard points.

### Citations

[1] Jimenez et al. SWE-bench: Can Language Models Resolve Real-World GitHub Issues? arXiv:2310.06770.
[2] Yang et al. SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering. arXiv:2405.15793.
[3] Xia et al. Agentless: Demystifying LLM-based Software Engineering Agents. arXiv:2407.01489.
[4] Zhang et al. AutoCodeRover: Autonomous Program Improvement. arXiv:2404.05427. [VERIFY ID BEFORE SUBMIT]
[5] Ruan et al. SpecRover: Code Autonomous Exploration with Large Language Models. arXiv:2408.02232. [VERIFY ID BEFORE SUBMIT]
[6] Chen et al. LocAgent: Graph-Guided LLM Agents for Code Localization. arXiv:2503.09089.
[7] Pan et al. SWE-Gym: Training Software Engineering Agents. arXiv:2412.21139. [VERIFY ID BEFORE SUBMIT]
[8] Massey. Guessing and Entropy. Proc. IEEE ISIT, 1994.
[9] Reiter. A Theory of Diagnosis from First Principles. Artificial Intelligence, 1987.
[10] Gemma Team. Gemma 4 Technical Report. 2026. [VERIFY CITATION BEFORE SUBMIT]

---

## B. Pre-submission gates (not part of the Writeup)

| Gate | Rule |
|---|---|
| Word count | Section A (title → citations) counted on Kaggle; must be ≤ 3,000. Prior v1 measured 1,937 words for a shorter draft; this v2 is longer — **count it**, and cut prose before cutting the honesty labels |
| Measured slots | No `[MEASURED: …]` text may remain in the submitted version — fill from ledger-recorded runs or delete the sentence |
| Constructed labels | Both constructed illustrations keep the word "constructed" in the submitted text |
| Citations | Verify every arXiv ID flagged above against arXiv; remove any that cannot be verified |
| Prize framing | Title/abstract foreground the resource (corpus + protocol) for Best New Resource; do not claim an application win without a public score receipt |


---

<!-- ====================================================================== -->
<!-- FILE: 06_Submission_Checklist_and_Timeline.md -->
<!-- ====================================================================== -->

# Submission Checklist and Timeline — Nov 8 → Dec 2, 2026

All times UTC. Paper deadline: **2026-11-12 23:59**. Main entry/merger: **2026-11-25**. Final submissions: **2026-12-02 23:59**. Times/deadlines from local Kaggle snapshots + 2026-11-08 web search; re-verify logged-in on Kaggle before acting (P-1).

## 1. Paper sprint (Nov 8–12)

| When | Action | Done when |
|---|---|---|
| Nov 8 (today) | P-1: Log in to Kaggle; open both competition pages; confirm paper deadline, word cap, whether a stub Writeup can be edited after submission, and tie-break rule. Freeze pilot/dev/held-out splits from the Nov 5 taxonomy files | Facts recorded in 07 §Corrections if any differ |
| Nov 8–9 | Build B1 (03 §11): minimal `agent.yaml` + system prompt; run local validator; pilot-8 A0 smoke run | 8 traces parse; metrics script emits turns/PASS per task |
| Nov 9 | **Stub-submit the Writeup** (title + abstract from 05) for earliest-entry position, if the venue allows post-submit edits (confirmed at P-1); otherwise hold the full draft and submit once, complete, on Nov 11 | Writeup status = submitted (or scheduled-complete decision recorded) |
| Nov 9–10 | A0/A1/A2 on pilot-8 → dev-30; paired localization-turn comparison | Numbers in ledger with n, split, seeds |
| Nov 10 eve | **Go/no-go on measurement:** if no dev-30 numbers, switch paper to pivot P1/P2 (02 §6) and rewrite §5 accordingly | Decision recorded; no `[MEASURED]` slot left ambiguous |
| Nov 11 | Fill 05 §5; cut to ≤ 3,000 words (Kaggle counter); verify citations; confirm constructed labels present | Word count screenshot/note; citation check initials |
| Nov 12 | Final read-through; **click Submit** well before 23:59 (queue/page load risk); save confirmation | Submission confirmation recorded |

## 2. Agent sprint (Nov 13 – Dec 2)

| Window | Milestones |
|---|---|
| Nov 13–18 | Complete B2–B5 (03 §11): spec gate, graph-first localization, risk gate, validation/rollback, governor + circuit breakers. Local scorer runs on dev-30 |
| Nov 19–21 | First scored submission (scaffold-only). Establish "a score exists" before optimizing |
| Nov 22–25 | Freeze best-known scaffold; confirm team entry before Nov 25 merger/entry deadline; optional E4B (BCF-E) scaffold run for the $10K small-model bonus — only if it does not endanger the 31B finals plan |
| Nov 26–28 | Optional: LoRA canaries C1/C2 (04 §5) — only with spare submission quota; C3 only on canary pass |
| Nov 29 – Dec 2 | Select 2 finals (best 31B + either second 31B or a demonstrated ≥ ~2-task E4B run for the bonus). Last 48 h: resubmit known-good artifacts only; queues can run 28–36 h near deadlines |

## 3. Do-not-submit gates

| Gate | Applies to |
|---|---|
| Any `[MEASURED: …]`, `[VERIFY …]`, or "planned" wording presented as a result | Paper |
| Word count > 3,000 on Kaggle's counter, or an un-submitted draft at deadline (drafts are not judged) | Paper |
| Array-typed tool arguments anywhere in prompts/skills; `SequentialAgent`; reliance on harness compaction | Agent zip |
| Adapter included without C1+C2 canary passes and a local wall-clock check | Agent zip |
| Test/conftest/packaging edits reachable by the agent (R4 must be refused) | Agent zip |
| Scratch files in `/workspace` (pollute the patch diff) — use `/tmp` | Agent zip |
| First-ever submission attempted in the final 48 h | Agent |

## 4. Two-finals allocation (main track + bonus)

| Option | When it is right |
|---|---|
| Finals = best 31B + second-best 31B | Default; protects main-track expected value |
| Finals = best 31B + best E4B | Only if the E4B run has demonstrated ≥ ~2 resolved public tasks (≈ 0.03) and the second 31B adds little; the bonus is a separate private-LB podium among E-series finals, cross-eligible with main prizes |


---

<!-- ====================================================================== -->
<!-- FILE: 07_Sources_and_Evidence_Ledger.md -->
<!-- ====================================================================== -->

# Sources and Evidence Ledger

Confidence labels: **P** = primary/official snapshot or live page; **S** = secondary reporting; **L** = local corpus analysis (Nov 5 deliverables); **M** = model/author judgment (labeled as such in text).

## 1. Competition facts

| Claim used | Source | Conf. |
|---|---|---|
| Paper track: Writeup ≤ 3,000 words; deadline 2026-11-12 23:59 UTC; prizes $15K/$10K/$10K; 5 criteria (Novelty, Quality, Relevance, Verifiability, Clarity) 0–5 equal weight | `input/kagglecomp/intel_20260930/04-paper-track-intel.md`; live web search 2026-11-08 (Kaggle pages rate-limited the direct scraper) | P/S |
| Main track: model `gemma-4-31b-it-qat-w4a16-ct`; `submission.zip` with root `agent.yaml`; 12 h / ~120 tasks; entry 2026-11-25, final 2026-12-02; $65K main prizes | `input/kagglecomp/docs/markdown/Kaggle-01-Overview.md`, `Kaggle-04-OfficialRules.md`; web search 2026-11-08 | P |
| Nine harness tools; code graphs + embeddings provided; verifier force-resets test-file edits; 0/129 gold patches touch tests | Kaggle-01/02 snapshots; prior BCF package (2026-10-31) harness analysis | P/L |
| Leaderboard 2026-11-05: 4,808 teams; top 0.29; nine at 0.24; ~91% at 0.00; 305-thread census | `input/kagglecomp/intel_20261105/00-intel-brief-2026-11-05.md` | L |
| Eight silent execution killers (array-arg hang 753973; edit loop 756051; compaction wipe 754783; nudge restart 754636; LoRA inflation/PEFT 755677; read cap 755291; impossible tasks 755554/754586) | `input/kagglecomp/intel_20261105/00-intel-brief-2026-11-05.md`, `04-deep-dive-critical-technical-findings.md` | L |
| 11 known-broken public tasks excluded from denominators | Threads 755554/754586 via Nov 5 intel | L |
| LoRA public evidence mixed-to-negative; verified teacher-localization SFT the reported positive pattern | Threads 755677/755289/749191 via Nov 5 intel; prior BCF package §04 | L |

## 2. Dataset facts (local corpus, Nov 5 deliverables)

| Claim used | Source | Conf. |
|---|---|---|
| 129 tasks; 67 fastapi / 48 rich / 13 requests / 1 httpx; 127 commits; `hints_text` empty 129/129; prompts mined from PR title/body | `deliverables/2026-11-05_Gemma4_Problem_Dataset_Taxonomy_and_Analysis/01_*.md`, `02_*.md` | L |
| Intent: 61.2% bug fix, 17.8% feature, 10.1% refactor, rest migrations/DX/docs | Same, Axis 1 | L |
| 22.5% opaque/terse prompts; 93.0% graph-reachable; ~7% docs-coupled blind spots | Same, Axes 4–5 | L |
| 70.5% single-file gold patches; median +8 lines | Prior BCF whitepaper corpus analysis (2026-09-29 / 2026-10-31 packages) | L |

## 3. External research (web search 2026-11-08)

| Claim used | Source | Conf. |
|---|---|---|
| Graph-guided localization (LocAgent etc.) improves multi-hop localization; hop-depth predicts failure; gains shrink with model scale / tool uptake | arXiv HTML via web search: LocAgent (2503.09089), 2026 graph-scaffold studies (2610.33958, 2607.01929, 2611.07286) | S |
| Agentless fixed pipeline beats free agency on cost (SWE-bench Lite 32%) | arXiv:2407.01489 via web search | S |
| SWE-agent ACI scaffold-sensitivity | arXiv:2405.15793 | S |
| Systematic-reasoning scaffolds (DeskCheck class) +6–10% on SWE-bench-Pro class benchmarks | PaperLayer/arXiv 2610.23782 via web search — **verify before citing numerically in the paper** | S |
| Clean-room LLM reimplementation: contextual vs epistemic quarantine unresolved; license-laundering debate | PHALUS docs, lawgitech chardet analysis (2026) via web search | S |
| Deterministic verification gates / behavior-pinning as industry agent pattern (2026) | Agent Patterns Catalog, Refactron/Hoplon project docs via web search | S |

## 4. Corrections and unverified items register

| Item | Status |
|---|---|
| Live Kaggle pages could not be scraped 2026-11-08 ("Too many requests") — deadline/criteria claims rest on the Sept 29–Nov 5 snapshot corpus + search-indexed summaries | **Re-verify logged-in (06 item P-1) before submitting anything** |
| arXiv IDs flagged `[VERIFY]` in 05 (AutoCodeRover, SpecRover, SWE-Gym, Gemma 4 report) | Verify on arXiv or delete the citation |
| ADK `eval_config.yaml` per-task ceiling key, exact `sampling.yaml` thinking keys, 32,768 context, 3 GiB zip cap | Marked **[re-verify at build]** in 03; confirm against the shipped HARNESS_README in the data package |
| Judging-score estimates in 02 §1 | Author judgment (M), not evidence — do not quote as predictions to third parties |
| Prior BCF package's constructed case-study numbers (fastapi_11194, httpx_6821) | Remain **constructed**; carried into 05 only with labels |

