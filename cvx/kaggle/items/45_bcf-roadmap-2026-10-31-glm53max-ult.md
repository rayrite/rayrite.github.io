# COMBINED MARKDOWN - combine

_Generated 2026-10-31 03:14:07 | 7 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle\items\combine_

## Contents

1. 00-README.md
2. 01-bcf-formal-specification.md
3. 02-kaggle-whitepaper-draft.md
4. 03-gemma-e2b-e4b-technical-primer.md
5. 04-bonus-prize-submission-plan.md
6. 05-main-idea-beginners-guide.md
7. 06-sources.md

---

<!-- ====================================================================== -->
<!-- FILE: 00-README.md -->
<!-- ====================================================================== -->

# BCF × Gemma 4 — Whitepaper Draft + Bonus-Prize Package (2026-10-31)

**Scope of the commission:** (1) enhance and formalize the BCF Constitution into a coherent, testable framework; (2) rough-draft the Kaggle paper-track submission (gemma-4-developer-agent-paper); (3) deliver the E2B/E4B technical fact base and a bonus-prize ($10K small-model) submission plan; (4) explain the main idea at beginner level and analyze what actually creates permanent improvement over a naive agent.

## Reading order

| File | What it is | Primary audience |
|---|---|---|
| [01-bcf-formal-specification.md](01-bcf-formal-specification.md) | BCF formalized: 4 axioms, 8-article → mechanism → test mapping, risk-gate algorithm, search-protocol suite, clean-room composer, fidelity ladder, improvement loop, effort governor, ablation ladder A0–A8 with refutation clauses, machine-to-machine composition contract, coherence audit | author / reviewers |
| [02-kaggle-whitepaper-draft.md](02-kaggle-whitepaper-draft.md) | Paper-track Writeup rough draft (§A = submission text, 1,937 words measured, cap 3,000) + §B submission mechanics & do-not-submit checklist | author → Kaggle |
| [03-gemma-e2b-e4b-technical-primer.md](03-gemma-e2b-e4b-technical-primer.md) | E2B/E4B technical fact base: architecture, PLE, MTP drafter, three memory-accounting regimes, benchmark table incl. the load-bearing Terminal-Bench-Hard gap, fine-tuning knowns/unknowns, harness integration facts | author / implementers |
| [04-bonus-prize-submission-plan.md](04-bonus-prize-submission-plan.md) | BCF-E operational plan: E4B-first rationale, scaffold deltas, LoRA canary gate C1–C3, submission mechanics checklist, two-finals allocation rule, risk register R-1..R-8, timeline to 2026-12-02 | author / implementers |
| [05-main-idea-beginners-guide.md](05-main-idea-beginners-guide.md) | Beginner explainers (E-series, bonus prize, BCF in one breath) + the needle-moving analysis: three permanence channels, honest evidence table, five concrete needle-movers | author (plain language) |
| [06-sources.md](06-sources.md) | Full source ledger with confidence labels + corrections/caveats register | QC / citation |

## Method

Deep+wide workflow per the standing research rules: toolkit pre-warm (blessed browser, port 29443), live primary-source fetches on 2026-10-31 (Gemma docs, technical-report HTML, HF cards, Kaggle staff threads 751104/748287 with full comment capture via scroll-extract-v2), local-corpus integration (whitepaper v3, competition plan, paper-track intel, HARNESS_README), memory-carried priors (LoRA-gate two-band finding, ADK primer) re-anchored to live sources where load-bearing. Intermediate artifacts in `scratch/2026-10-31-bcf-whitepaper/` and `research-bcf-paper-bonus-2026-10-2026-10/`.

## Key verdicts (one line each)

1. **The Constitution is coherent and testable** — it decomposes into 4 axioms + 8 enforceable mechanisms, each with a falsifiable observable; the single aspirational claim (x′ asymptotically greater) is reframed as monotone artifact accumulation vs bounded-memory baselines (01 §2, §10).
2. **The whitepaper draft is cap-compliant at 1,937/3,000 words** with headroom deliberately reserved for measured ablation numbers; stub-submit early for the tie-break, revise before Dec 2.
3. **E4B over E2B and over 12B** for the bonus track: agentic benchmarks double E2B→E4B, and 12B carries documented serving overrides (thread 748287) the E-series doesn't.
4. **The bonus is a thin separate podium** — first priority is a validated, scoring E4B final (≥2 tasks ≈ 0.03), not a high score; the two-finals tax is the real cost (04 §1, §6).
5. **Permanent improvement = artifacts and (gated) weights, never chat context** — the turn economy is the highest-confidence lever; LoRA only through the canary ladder given Cygnify's public E4B nulls (05 §2).

## QC report

| Check | Result |
|---|---|
| GFM table validation (separator rows, per-row cell counts vs header with code-span-aware pipe counting, blank-line separation, pipe bookends, trailing-whitespace/empty-cell rules) | **29 tables across 6 files — 0 defects** (checker: `scratch/2026-10-31-bcf-whitepaper/qc-tables.mjs`; first run's 180 hits were a checker bug — rule flagged the normal `text \|` cell ending — fixed and re-run clean) |
| Word-count claim in 02 §B | corrected from estimated ~2,880 to measured 1,937 (excl. citations) / 1,963 (incl.) |
| Pipe-in-backticks hazard (standing GFM gotcha) | no inline-code cell in any table contains a pipe (checker strips code spans before counting; counts all matched) |
| Load-bearing facts | every number in 03/04/05 traces to ledger entries in 06 with confidence label P/I/S/M; unverified items explicitly tagged in text ("plausible-but-unverified", "design decision", "planned") |
| Stale-doc trap | HARNESS_README's 31B-only ALLOWED_MODEL_NAMES flagged as superseded by staff thread 748287 (06 §F) |
| Cross-references | all inter-file links point to files present in this folder |

## Standing caveats for downstream use

- The paper draft's §5 case-study numbers are **constructed, labeled as such** — replace with measured A1–A5 rung output before any final submission (02 §B checklist item 1).
- Re-verify citations [4][5][6][10] IDs against arXiv before submission (06 §E).
- Re-check threads 753973 (tool-parser hang), 748287 (wheelhouse/12B fixes), and the promised daily small-model LB notebook before freeze (04 §5, §7).
- Bonus-track gate dates: entry deadline 2026-11-25, finals 2026-12-02.


---

<!-- ====================================================================== -->
<!-- FILE: 01-bcf-formal-specification.md -->
<!-- ====================================================================== -->

# The Batonic Coding Framework (BCF) — Formal Specification v1.0

**Compiled:** 2026-10-31 · **Supersedes:** none (formalizes the founding Constitution as stated by the author; operationalizes on top of `bcf-whitepaper-v3-2026-09-29` and the 2026-09-28 competition plan) · **Status:** specification + testability analysis

**Verdict up front.** The Constitution is coherent and testable. It decomposes into four axioms (conservation, ascent, single-writer, grounded truth), eight operational articles, and one quantifiable value claim (x′ ≻ x). Each article maps to at least one enforceable mechanism, and every mechanism has an observable that a controlled experiment can falsify — the two properties a "coherent and testable framework" needs. This document makes those mappings explicit, tightens the informal claims into precise statements, flags the one claim that is a design goal rather than a theorem (asymptotic dominance), and binds everything to the Gemma 4 competition profile (main track and E2B/E4B bonus track) where the first full test runs.

---

## 1. Identity

**BCF is three things, and keeping them separate is what makes it testable:**

1. **A constitution** — eight inviolable process rules (§3) that constrain any agent, human or machine, that operates under BCF.
2. **A reference profile** — concrete tool contracts and control flow (§4–§7) that implement the constitution on a specific substrate. Profiles in force: **BCF-Gemma** (Kaggle Gemma 4 Developer Agent, base `gemma-4-31b-it-qat-w4a16-ct`) and **BCF-E** (the $10K Small Model bonus track, base `gemma-4-e4b-it-qat-w4a16-ct`, deliverable [04](04-bonus-prize-submission-plan.md)).
3. **A measurement protocol** — the ablation ladder, metrics, and refutation clauses (§8) that make every constitutional claim falsifiable rather than rhetorical.

**Name.** *Batonic*, by the author's metaphor: a battery loses nothing it cannot later yield. Every unit of work performed on an input is stored as a recoverable artifact — verified states, specifications, ledgers, labels, receipts — so no input ever net-destroys value. The framework's guarantee is monotone accumulation, stated formally in Axiom A2.

## 2. The four axioms

The eight articles of the Constitution reduce to four primitive commitments. Everything else is mechanism.

| Axiom | Statement | Formal shape | Failure it forbids |
|---|---|---|---|
| **A1 Conservation** | Working code is never knowingly destroyed; every mutation is reversible to the last verified state. | The working set's verified-passing subset W is monotone non-decreasing along the committed chain: `W(s_{i+1}) ⊇ W(s_i)` for committed states; rollback restores `argmax_j W(s_j)`, never an unverified guess. | Regressions shipped; fixes that break passing tests; "fix one bug, open two." |
| **A2 Ascent (batonic)** | Every input yields at least one durable artifact of positive information value, however small. | The knowledge base K grows by inclusion: `K_{t+1} ⊇ K_t`, `K_{t+1} ≠ K_t` (a failure contributes its ledger entry — negative results are information). | Null-output loops: hours burned, nothing banked, same mistake re-made next session. |
| **A3 Single Writer** | Exactly one authority may mutate a given working set at any time; all other actors are readers. | A serialization invariant on write operations per working set; concurrent actors hold read tokens only. | Write-write races; two agents editing the same file into a merged nonsense state. |
| **A4 Grounded Truth** | Every atomic construct the agent reasons with is traceable to an authoritative reference (the source of truth). | A total traceability relation τ from atoms to reference anchors: `∀ atom a used in reasoning: τ(a) = (ref_id, version, locator)`; unanchorable atoms are marked *unverified* and cannot enter a patch. | Plausible-but-invented API behavior; hallucinated language semantics drifting into code. |

**On "x′ is asymptotically greater than x."** Precise reading: let `x_n` be the cumulative durable value after n inputs. A discard-on-failure agent has `x_n` bounded (it re-derives, forgets, repeats); a BCF agent has `x_n` monotone non-decreasing in n with increments bounded below by the minimal artifact (one ledger row), hence `x_n → ∞` as n grows — *asymptotic dominance over any bounded-memory process*. This is a **design guarantee of the architecture** (monotone accumulation), not a performance theorem about speed or accuracy; converting accumulation into *score* is what the §8 protocol tests. The second clause — "the output can be handed to another machine to generate the next higher value" — is the composition contract of §9.

## 3. The eight articles → mechanisms → tests

The Constitution, verbatim intents in the left column; each row is enforceable and observable.

| # | Constitutional article | Formal mechanism (section) | Enforcement point | Falsifiable observable |
|---|---|---|---|---|
| C1 | Always preserve working code | A1 + git-anchored verified-state chain + validation gate before submission (§4 Phase 4) | `submit_patch()` only after targeted pytest pass; rollback = restore last verified commit | Count of committed regressions (must be 0); wrong-edit metric (§8) |
| C2 | Single point of contact; gated permission algorithm for change risk | A3 + the Risk Gate (§5) | Risk Gate must approve every `edit_file`/`write_file` before execution | 100% of mutations carry a gate decision record in the ledger; unauthorized-mutation count = 0 |
| C3 | Document the process at the highest necessary fidelity to triage | The Fidelity Ladder (§6.1) — tiered, budget-aware logging | Ledger writer is invoked by every phase transition, gate decision, and tool call | Ledger completeness audit: every turn reconstructible from L0–L2 alone |
| C4 | Full developer reference in LLM-friendly format (source of truth) | A4 + Reference Pack (§6.2): chunked, anchored, version-pinned docs served as retrieval | Atoms used in Phase 1/5 reasoning carry τ anchors | Anchor-coverage ratio of spec atoms; unverified-atom leakage into patches = 0 |
| C5 | Binary search, BFS+DFS when investigating; atomic-decomposition tool call traceable to the reference | Search Protocol Suite (§5.2): `bisect_state` (temporal), `graph_bfs`/`graph_dfs` (structural over call graph), `decompose_atomic` | Protocol bindings shipped as skill tools; ordering constraints in the phase machine | Localization tool-call count vs grep baseline (ablation A2); per-query residual entropy |
| C6 | Clean-Room tool call to assemble candidate solutions from atoms + data structures | `cleanroom_compose` (§5.3): constructs candidate patches from anchored atoms only, quarantined from the suspect original | Composition inputs restricted to τ-anchored atoms; output quarantined until gated | Candidate viability rate; contamination count (unanchored constructs in output) = 0 |
| C7 | Root-cause analysis + post-mortem checkpoints for self-learning | The Improvement Loop (§6.3): RCA template → ledger → taxonomy/codebook delta → promotion gate | Post-mortem checkpoint fires on every failed task and every escalation | Promotion-gate pass rate; recurrence rate of the same failure signature over time (must fall) |
| C8 | Effort/thinking level adjustment: speed vs quality under external constraints | Effort Governor (§7): maps (phase, budget state, risk) → thinking budget & sampling policy | Governor policy table in the submission config; per-phase thinking_budget settings | Score-vs-turns frontier under governor on/off; overrun rate = 0 under fixed 12h cap |

## 4. The BCF phase machine (operational core)

The articles execute as a strictly ordered phase machine — this is the four-phase pipeline of the v3 whitepaper, restated as the constitution's enforcement engine. Phases advance only forward, with one controlled escalation edge.

| Phase | Name | Entry condition | Exit artifact | Constitutional load |
|---|---|---|---|---|
| P1 | Specification | Task issued | Structured spec: per-bug Hypothesis / Target / Fix-shape triples + causal fix order | C3, C4 (atoms anchored), C5 (decompose on entry) |
| P2 | Localization | Non-empty spec | Ranked candidate symbols + targeted line ranges | C5 (BFS/DFS over call graph; bisect over history when needed) |
| P3 | Patch | Line-anchored plan | Minimum viable patch, applied root-cause-first | C1, C2, C6 (clean-room composition candidate) |
| P4 | Validation | Patch applied | PASS → submit; FAIL → one corrective edit; 2nd FAIL → escalate or best-effort submit | C1 (gate), C7 (failure feeds RCA) |
| P5* | Post-mortem | Task terminal (PASS or FAIL) | Ledger close-out: RCA row, failure signature, candidate codebook delta | C7 (the ascent engine) |

*P5 runs after the task clock stops; its artifacts are what make A2 true. In the Kaggle harness, P5 is partially external (analysis of shipped traces post-run) because the per-task sandbox is destroyed — the ledger ships out with the run's results artifacts.

## 5. The three algorithmic pillars

### 5.1 The Risk Gate (article C2)

Every mutation passes a gate that prices its blast radius before execution. Deterministic, cheap, and itself logged (C3).

```text
GATE(change_request):
  scope      ← files_touched ∪ symbols_touched ∪ tests_affected
  coverage   ← |tests exercising scope| / |tests in suite|      # verification coverage
  reversibility ← is_patch_single_hunk ∧ is_working_set_clean   # can we roll back cheaply?
  risk ← f(scope_breadth, coverage, reversibility, protected_files_touched)

  R0 trivial      (comment/doc, no semantic change)      → auto-approve, log
  R1 local        (single symbol, covered by failing+passing tests) → approve + queue targeted pytest
  R2 structural   (shared symbol, callers exist in graph) → approve only with called_by impact list attached
  R3 wide         (multi-file / API-shape change)         → require spec amendment (return to P1) before edit
  R4 protected    (tests, conftest, packaging, anti-tamper list) → REJECT; re-route to library-side fix
```

The protected-file class is not advisory — in the Kaggle harness the verifier force-resets agent-touched test files before scoring, so an R4 edit is a guaranteed wasted turn (verified harness fact, HARNESS_README §8; 0/129 gold patches touch tests). Risk classes, their thresholds, and every gate decision ship in the ledger — the gate is auditable after the run, which is what C2's "algorithm" promise means.

### 5.2 The Search Protocol Suite (article C5)

Three searches, each the right tool for a different failure geometry, all logging their query and residual (C3):

| Protocol | Search space | Operator | When it is the protocol of record |
|---|---|---|---|
| `bisect_state` | Commit/verified-state chain (temporal) | Binary search on "last state where W held" | A regression: behavior passed at some earlier state — find the pivot commit/marker |
| `graph_bfs` | Call/dependency graph from symptom anchor | Breadth-first over `called_by`/`calls` edges, bounded fan-out (≤50) | Unknown distance to root cause; want the nearest causal neighborhood first |
| `graph_dfs` | Call graph, targeted chains | Depth-first along a named hypothesis path | Spec already names a suspected chain; verify the chain end-to-end fast |

`decompose_atomic` (the guaranteed tool call) binds them: it takes an issue/spec and emits the atomic element list — exception classes, symbols, language constructs, data structures — each carrying its τ anchor into the Reference Pack (C4). In the BCF-Gemma profile the atoms are graph node ids and Python language constructs; the anchor set is the shipped harness README semantics + the language reference; anything the model asserts that fails anchoring is tagged *unverified* and the Risk Gate prices it one class higher.

### 5.3 The Clean-Room composer (article C6)

`cleanroom_compose(spec, atoms, structures)` assembles candidate patches from the anchored atom set and standard data structures only — it is structurally quarantined from the defective original (it may read the original's *interface*, never its implementation body, exactly like clean-room engineering practice in IP law). Its candidates enter P3 through the same Risk Gate as any edit. Purpose: break the model's tendency to transcribe the broken pattern it just read — the single most common small-model failure mode observed in the competition's public baselines (copy-then-tweak loops; see also thread 753277 "Gemma's Copying Bug: A One-Tensor Repair"). In the Kaggle profile this is realized as a skill script that renders candidates from spec + atoms with the suspect code blocks excluded from its input window.

## 6. Telemetry, reference, and self-improvement

### 6.1 The Fidelity Ladder (article C3)

"Highest necessary fidelity" is an economic statement: fidelity must be sufficient for triage at the lowest token/byte cost that achieves it. The ladder makes *necessary* measurable.

| Tier | Content | Written when | Triage power | Cost |
|---|---|---|---|---|
| L0 decision ledger | one row per gate decision / phase transition / submission | always | reconstructs the run's decisions | ~100 B/row |
| L1 query ledger | every search query + result count + chosen candidate | always | reproduces localization | ~1 KB/turn |
| L2 tool transcript | full tool call/result pairs (harness `trace.jsonl`) | always (harness-native) | reproduces behavior | ~10 KB/turn |
| L3 reasoning trace | thoughts channel (thinking mode) | when thinking enabled | reproduces *why* | ~tokens of thought |
| L4 full state dumps | periodic workspace + spec snapshots | on demand (escalations, post-mortem) | forensic | MBs |

Reconstruction test (C3's observable): a stranger can rebuild L0 from L2, and the decisions from L0 alone — audited per run.

### 6.2 The Reference Pack (article C4)

An LLM-friendly, chunked, anchored, version-pinned rendering of the complete developer reference for the substrate: for BCF-Gemma, the harness contract (nine tools with verified semantics, budget clocks, sandbox rules), the ADK config language, and the Python language reference for the pinned target versions. Every chunk carries `(ref_id, version, locator)`. The pack is *not* general web knowledge; it is the closed world the agent's atoms must trace into. Maintenance rule: the pack re-pins on every harness/wheelhouse version bump (the wheelhouse is at V31 as of 2026-10-31 — see [03](03-gemma-e2b-e4b-technical-primer.md) §8), because a stale source of truth is worse than none.

### 6.3 The Improvement Loop (article C7) — where x′ ≻ x is earned

```text
run → ledger (L0–L2) → failure signatures → RCA rows (post-mortem checkpoints)
    → taxonomy/codebook delta (candidate classes, thresholds, prompt/skill patches)
    → promotion gate: held-out improvement, falsification attempt survived
    → promoted into: (a) skills/prompts  (b) codebook/taxonomy  (c) training data (LoRA)
```

The promotion gate is the load-bearing honesty device, carried over from the v3 whitepaper's evidence-tier doctrine: a candidate improvement is promoted only if it survives a held-out comparison and an attempted refutation, exactly as the ablation ladder demands (§8). Three durable channels, in ascending cost and permanence:

| Channel | What persists | Latency | Reversible | Competition realization |
|---|---|---|---|---|
| Context | nothing (per-task) | — | — | the thing being improved |
| Skills/prompts/codebook | artifact library | same-day | yes | `skills/` + prompt files in `submission.zip` |
| Weights (LoRA) | parameter delta | days | yes (drop adapter) | `adapters/` (gated by canary ladder) |

"Permanent improvement over the naive agent" therefore has an exact meaning: **shifts that live in the second and third channels**, not in chat context. Deliverable [05](05-main-idea-beginners-guide.md) develops this for the bonus track.

## 7. The Effort Governor (article C8)

Thinking level and sampling effort are policy variables, not constants. The governor is a table, not a model: cheap where mistakes are cheap, expensive where mistakes are irreversible.

| State (phase × budget) | Thinking budget | Rationale |
|---|---|---|
| P1 spec, task start | high (4,096+) | errors here poison everything downstream (wrong class → anchoring) |
| P2 localization queries | low | each query is cheap and reversible; speed wins |
| P3 first edit | medium | transcription from anchored plan — bounded risk |
| P4 validation read | low | deterministic parse; no reasoning needed |
| Escalation / re-spec | high | the recovery decision is the run's most valuable |
| Budget < 20% remaining | floor + terse turns | guarantee a submitted patch; an empty patch scores 0, a partial patch may not |

Governor constraints verified for the Kaggle profile: context ceiling 32,768 tokens; harness-documented combination rule `include_thoughts: true` with `thinking_budget: 4096`, omitting `thinking_level`; every turn must end with a tool call or the harness nudge-terminates after 3 stops.

## 8. Testability: the ablation ladder and refutation clauses

Every constitutional claim has a kill condition. The ladder (from the competition plan, extended one rung for BCF-E):

| Rung | Configuration | Constitutional claim under test | Refuted if |
|---|---|---|---|
| A0 | Minimal ADK agent, no BCF | baseline | — |
| A1 | + P1 spec gate (C3/C4) | spec-first reduces wrong-class anchoring | fix-order errors not reduced on multi-bug stratum |
| A2 | + P2 graph-first protocols (C5) | structural search cuts localization turns ≥50% w/o PASS loss | PASS drops or turns not cut (underpowered declared honestly) |
| A3 | + Risk Gate (C2/C1) | gating kills regressions & protected-file waste | committed regressions > 0 or gate overhead exceeds savings |
| A4 | + Fidelity Ladder + external validation (C3/C1) | non-self verification reduces bad submissions | invalid-patch rate unchanged |
| A5 | + rescue/escalation + governor (C8/C1) | budget-aware recovery converts overruns into partial scores | overrun/submission rates worsen |
| A6 | + clean-room composer (C6) | quarantined composition reduces copy-bug recurrences | recurrence rate unchanged |
| A7 | + compliance-filtered LoRA (C7→weights) | durable weights add over best scaffold | held-out no-better (as public E4B reports currently suggest — see [05](05-main-idea-beginners-guide.md) §4) |
| A8 | BCF-E profile on E4B | the whole stack survives a 4.5B-effective brain | collapse vs 31B disproportionate to capability ratio |

Metrics (all per-task, from the ledger): total turns; wrong edits (`edit_file` calls absent from final patch); fix-order errors; exploration turns; budget headroom at submission; committed regressions; recurrence-of-signature rate across runs (the A2-ascent observable — the only metric that measures the batonic claim directly).

Statistics discipline carried over unchanged from the v3 protocol: exact McNemar, Holm correction, Wilson intervals, frozen splits (pilot-8 / dev-30 / dev-99 / held-out-30 / pooled-129), ≥3 seeds where variance observed, and the public-LB noise fact (1 task = 0.017; run-to-run sd ≈ 2.5–3 tasks on 58 public tasks) respected before believing any single-run delta.

## 9. The composition contract (machine-to-machine value handoff)

The Constitution's closing vision — x′ handed to "another machine capable of generating the next higher value" — is specified as the **BCF-Artifact envelope**: a versioned, schema-checked bundle containing (a) the spec corpus, (b) L0/L1 ledgers, (c) taxonomy labels + codebook version, (d) prompt/skill deltas, (e) adapter cards (config + metrics, not raw weights unless license-clean), (f) receipts (which numbers trace to which runs). Any consumer machine must validate the envelope's schemas and provenance before promoting its contents through its own §6.3 loop. This is the formal answer to "can the output be handed to another machine": yes, iff the envelope is schema-valid, version-pinned, and license-clean — the same walls the brain-harvest deliverables already mapped for trajectory data.

## 10. Coherence audit — what is strong, what is aspirational

| Component | Status |
|---|---|
| A1/A3/C1/C2 (conservation + single writer + risk gate) | Coherent, mechanically enforceable, immediately testable (A3 rung) |
| C3/C4 (fidelity ladder + reference pack) | Coherent; fully implementable today; cost model is the only open design choice |
| C5 (search suite + atomic decomposition) | Coherent; graph protocols already specified and verified against harness semantics; `bisect_state` limited by sandbox git history (harness ships fast-exported history — pivot search is bounded but legal) |
| C6 (clean-room) | Coherent and novel-in-composition; quarantine enforcement is a prompt/skill-level constraint in this profile, not a sandbox guarantee — declared honestly |
| C7 (RCA/post-mortem loop) | Coherent; the promotion gate is what separates it from ordinary "we log things" practice |
| C8 (effort governor) | Coherent; pure policy table; zero-cost rung |
| A2/x′ ≻ x | **Design goal, not theorem.** Monotone accumulation is architecturally guaranteed; *score* ascent is exactly what A1–A8 measure. The asymptotic phrasing is meaningful only against bounded-memory baselines (§2) |

---

*Companions: the competition-shaped paper built on this spine is [02-kaggle-whitepaper-draft.md](02-kaggle-whitepaper-draft.md); the small-model instantiation is [04-bonus-prize-submission-plan.md](04-bonus-prize-submission-plan.md); the plain-language walkthrough is [05-main-idea-beginners-guide.md](05-main-idea-beginners-guide.md).*


---

<!-- ====================================================================== -->
<!-- FILE: 02-kaggle-whitepaper-draft.md -->
<!-- ====================================================================== -->

# BCF Whitepaper — Kaggle Paper-Track Submission Draft (v0.1 rough draft)

**Target venue:** Kaggle "Gemma 4 Developer Agent — Call for Papers" (`gemma-4-developer-agent-paper`) · **Cap:** 3,000 words (verified from the paper-track page: "Scope: 3,000 words maximum") · **Draft date:** 2026-10-31 · **Status:** rough draft for author review — numbers marked (planned) are not yet measured; do not submit until the measured/constructed split is honest.

**How to use this file.** §A is the submission text itself (title → citations), written to land at ~2,850 words so there is headroom for edits. §B after the draft holds submission mechanics, the word-count ledger, and the do-not-submit checklist. The full-fat 15k-word predecessor with complete derivations is `deliverables/bcf-whitepaper-v3-2026-09-29/` — this draft cites forward from that corpus, not backward into it.

---

## A. The submission text

# Specification-Driven Graph Reasoning for Budget-Constrained Coding Agents

### The Batonic Coding Framework: ordering information so a small model stops re-learning the same repository

## Abstract

Autonomous coding agents waste most of their time budget not on writing code but on deciding what to read. We present the Batonic Coding Framework (BCF), a scaffold that attacks the *information-ordering* problem directly: it forces a structured specification step before any file access, localizes through the repository's call graph instead of text search, gates every mutation through a priced risk rubric, and submits only after targeted validation. A probabilistic model of the agent's turn budget shows why this ordering matters — the naive agent's expected cost is dominated by re-reading context that a graph query would have retrieved in one step — and predicts where scaffold interventions pay off. We instantiate BCF on the Gemma 4 Developer Agent harness (Gemma 4 31B QAT, 12-hour budget, ~120 tasks) and define a five-rung ablation ladder over a frozen 129-task public corpus of real library issues (fastapi, rich, requests, httpx). Constructed case studies illustrate order-of-magnitude turn reductions on multi-file localization, and we report the protocol under which the ladder's claims are falsifiable, including exact paired statistics and pre-registered refutation conditions. BCF's design goal — "batonic" accumulation, where every task leaves a durable, reusable artifact — is stated as a testable monotonicity claim rather than a slogan.

## 1. Introduction

The Gemma 4 Developer Agent competition scores a fixed 12-hour budget across roughly 120 hidden repository-repair tasks — about six minutes per task, all-in: reading, localizing, patching, validating, submitting. Public leaderboard evidence suggests this budget, not model capability, is the binding constraint: even strong baselines leave tasks unattempted, and top scores cluster far below the ceiling.

The failure mode we target is information-ordering. A naive agent reads files until its context fills, guesses an edit, and — when validation fails — reads again with degraded context. Each such cycle spends turns re-deriving what the repository's own structure already encodes: which function calls which, where an exception is raised, what the failing test actually exercises. Small and mid-scale models are hit hardest, because their weaker retrieval heuristics mean more cycles per success.

BCF makes four commitments, derived from a written "constitution" of process rules: (1) specify before reading — every bug becomes a structured hypothesis before any tool call; (2) localize on the graph — breadth- and depth-first traversal of the call/dependency graph, with binary search over history when a regression is suspected; (3) gate every mutation — a deterministic risk rubric prices each edit's blast radius before it is applied; (4) validate before submitting — targeted tests, with rollback to the last verified state on failure. A fifth commitment, post-mortem accumulation, requires every task — pass or fail — to emit a reusable artifact (a ledger row, a failure signature, a taxonomy label), which is what makes the framework "batonic": charge is stored, never discarded.

Our contributions: (i) the BCF phase machine and its risk-gate formalization; (ii) a turn-budget model that explains *why* ordering dominates cost, with closed-form expected-cost expressions for naive vs. scaffolded agents; (iii) a frozen, stratified 129-task evaluation corpus built from real issues in four Python libraries, with a five-rung ablation ladder and pre-registered refutation conditions; (iv) constructed case studies demonstrating the mechanism; (v) an honest accounting of which claims are measured, which are constructed, and which remain open.

## 2. The Batonic Coding Framework

**Phase machine.** BCF executes as a strict phase sequence: Specification → Localization → Patch → Validation → Post-mortem. Phases advance forward only, with one controlled escalation edge (a second validation failure forces either a re-specification or a best-effort submission). Each phase has a defined entry condition and exit artifact, which makes scaffold compliance mechanically checkable from the run's tool-call trace alone.

**Specification.** Each issue is decomposed, before any file read, into per-bug records: Hypothesis (what is wrong, stated falsifiably), Target (candidate symbols, possibly empty), Fix-shape (the minimal change class: guard, boundary, rename, contract). For multi-bug issues the spec additionally imposes a causal fix order — bugs whose symptoms mask others must be fixed in dependency order, or later validations fail for reasons already understood.

**Graph-first localization.** BCF's first localization action is a dual symbol search over the repository's indexed call graph (definers and callers of the symbols named in the spec), inducing the minimal subgraph that connects them, then expanding along `called_by` edges to bound blast radius. Only then are files read — targeted, line-bounded reads of the symbols the graph query returned. Text search (grep) is a fallback, not a primary instrument. When a task is a regression (it worked at some prior commit), binary search over the provided history replaces structural exploration.

**The risk gate.** Every mutation passes a deterministic gate: scope (files, symbols, tests affected), verification coverage, reversibility, and protected-file status combine into a risk class R0–R4. R0–R2 proceed with proportionate test queues; R3 (structural/API change) forces re-specification; R4 (test files, harness-protected paths) is rejected outright — in this harness, the verifier force-resets agent-touched test files, so an R4 edit is always a wasted turn. Gate decisions are logged, making the gate itself an auditable object.

**Validation and rollback.** After patch application, targeted tests (failing tests plus their graph-neighborhood passing tests) gate submission. On failure, one corrective edit is allowed; a second failure triggers the escalation edge. Working states are never abandoned: rollback restores the last verified state, preserving the "always keep working code" commitment.

**Post-mortem accumulation.** Every terminal task appends to a ledger: failure signature, localization path taken, turn counts, gate decisions, and — for failures — a root-cause category. The ledger is the substrate for the framework's self-improvement loop, and its growth is the formal object behind the "batonic" claim (§4).

## 3. A turn-budget model

Let a task require retrieving repository context of entropy H(R) given the agent's observations. At localization step i, the agent's remaining uncertainty about the root cause is H(R | o_1..i). A naive agent's queries (file reads, greps) are weakly informative about R — modeled as each query reducing uncertainty by a factor bounded by the query's mutual information I(q; R), which text retrieval makes small when the fix site is structurally (not lexically) tied to the symptom. The expected number of queries to localize is governed by the guesswork of R under the agent's posterior, and expected cost E[T_naive] grows accordingly.

A graph query changes the posterior in one step: conditioning on the induced subgraph G, the residual H(R | G) is, for the bug classes in our corpus, far smaller than H(R), because the call graph *is* the causal structure the fix must respect. The scaffolded expected cost is E[T_bcf] = c_spec + c_graph + (1 − q)·m·r, where q is the probability the spec orders the fix correctly at first attempt, m the residual mislocalization penalty, and r the re-read cost. The model's testable prediction: interventions that raise q or lower H(R|G) cut turns multiplicatively, while interventions that only speed up reading (bigger context, faster inference) cut additively. The ablation ladder is designed to distinguish these.

Interference and exposition. When multiple bugs coexist, fixing one can mask or expose another; we model this as a DAG over bugs (an "exposition" edge u→v means fixing u reveals v's symptom). The spec's causal fix order is a topological order of this DAG. Choosing an order that violates it forces extra validation cycles — observable as the wrong-fix-order signature in the ledger.

## 4. The batonic claim, stated testably

The constitution's slogan — "every input generates an output of value; x′ is asymptotically greater than x" — we formalize as monotone accumulation: the run's durable artifact store K grows by inclusion across tasks, with every terminal task contributing at least one ledger row. The measurable consequence is a *recurrence-rate* claim: the frequency of a previously-seen failure signature should fall as K grows, because the scaffold consults it. This is falsifiable: if recurrence rates do not fall across corpus orderings, the accumulation is dead weight. We report recurrence rates per ladder rung.

## 5. Evaluation

**Corpus.** 129 public tasks from real issue trackers: 67 fastapi, 48 rich, 13 requests, 1 httpx. Stratification facts: 70.5% single-file fixes; median patch +8 lines; 0/129 gold patches touch test files; issue text alone is insufficient (hints field empty in 129/129), so localization must come from repository structure. The corpus is frozen; splits are fixed (pilot-8 / dev-30 / dev-99 / held-out-30 / pooled-129) and all ladder numbers report the held-out split.

**Metrics.** Per task: total turns, wrong edits (edits absent from the final patch), fix-order errors (multi-bug tasks), exploration turns, budget headroom at submission. Paired exact McNemar on PASS/FAIL; Holm correction across the ladder; Wilson intervals on all proportions; three seeds where variance exceeds the effect.

**Ablation ladder.** A0 minimal ADK agent → A1 +spec gate → A2 +graph-first localization → A3 +risk gate → A4 +targeted validation/rollback → A5 +escalation/rescue. Each rung adds exactly one mechanism, so rung deltas attribute cleanly. Pre-registered refutation conditions: if A2 does not cut localization turns by ≥50% without PASS loss, the graph hypothesis is dead; if A1 does not reduce wrong-class anchoring on the multi-bug stratum, specification is decoration; if A3's gate overhead exceeds its regression savings, the gate is net-negative.

**Constructed case studies (measured runs: planned).** fastapi_11194 (single-file, exception-class fix): the graph path localizes in 3 tool calls where the naive trace used 11 reads. httpx_6821 (stress case, multi-module): naive context overflows the 32k window before localization completes; the spec+graph path completes in 30 turns with headroom. These are constructed from the recorded public traces to illustrate the mechanism; they are not ladder results and are labeled as such.

**Harness instantiation.** Base model gemma-4-31b-it-qat-w4a16-ct under the competition's vLLM serving (32,768-token context, 12-hour total budget); the scaffold is a submission-side skill library and prompt constitution — no weight changes in the main-track configuration. The framework is model-agnostic: we also instantiate BCF-E on Gemma 4 E4B for the small-model bonus track, where the turn-budget model predicts scaffold gains are *larger* (weaker retrieval heuristics → more naive cycles to displace).

## 6. Related work

SWE-bench established repository-level repair evaluation [1]; SWE-agent demonstrated the scaffold-sensitivity of agent performance [2]. Agentless reduced cost by abandoning agency for a localization-patch pipeline [3]; SpecRover and AutoCodeRover recovered agency with program-structure-aware retrieval [4][5]; CodeR explored multi-agent repair [6]. BCF differs in making *specification ordering* the primary object and in pricing mutations before they occur. Our turn-budget model draws on guesswork and entropy bounds [7][8]. Diagnosis-from-first-principles [9] anticipates the spec's falsifiable-hypothesis structure; the interference/exposition DAG extends classic interference-problem observations to multi-bug repair. SWE-Gym's trajectory-training results [10] bound what weight-level improvement requires (~500 trajectories), motivating our scaffold-first, adapter-second stance.

## 7. Limitations

All quantitative ladder claims are protocol-declared, not yet measured; case studies are constructed illustrations. The corpus is four libraries and skews single-file; multi-bug tasks are a minority stratum, so fix-order claims rest on few tasks. The harness's hidden tasks may not transfer. The risk gate is heuristic, and R3 detection (API-shape changes) is the weakest classifier in the rubric.

## Citations

[1] Jimenez, Yang, et al. "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?" arXiv:2310.06770, 2023.
[2] Yang, Jimenez, et al. "SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering." arXiv:2405.15793, 2024.
[3] Xia, Deng, Dunlap, et al. "Agentless: Demystifying LLM-based Software Engineering Agents." arXiv:2407.01489, 2024.
[4] Ruan, Xiang, et al. "SpecRover: Code Autonomous Exploration with Large Language Models." arXiv:2408.02232, 2024.
[5] Zhang, Ruan, et al. "AutoCodeRover: Autonomous Program Improvement." arXiv:2404.05420, 2024.
[6] Chen, et al. "CodeR: Issue Resolving with Multi-Agent and Task Graphs." arXiv:2406.01304, 2024.
[7] Massey, J. "Guessing and Entropy." Proc. IEEE ISIT, 1994.
[8] Arikan, E. "An Inequality on Guessing and Its Application to Sequential Decoding." IEEE Transactions on Information Theory, 1996.
[9] Reiter, R. "A Theory of Diagnosis from First Principles." Artificial Intelligence, 1987.
[10] Pan, et al. "SWE-Gym: An Open Environment for Training Software Engineering Agents." arXiv:2412.21139, 2024.
[11] Gemma Team. "Gemma 4 Technical Report." arXiv:2607.02770, 2026.

---

## B. Submission mechanics (not part of the 3,000 words)

| Item | Status / note |
|---|---|
| Word cap | 3,000 max (paper-track page, verified 2026-10-31). **Measured 2026-10-31: §A body = 1,937 words excluding citation entries (1,963 including)** — 1,037 words of deliberate headroom reserved for measured A1–A5 ladder numbers before submission; add results, do not pad prose |
| Tie-break | Earliest entry wins ties → submit a stub Writeup **early** (title + abstract), then edit; the venue allows revision before the deadline |
| Deadlines | Competition entry deadline 2026-11-25; final submission 2026-12-02 (shared with main competition) |
| Prizes | Paper track $15K / $10K / $10K; cross-eligible with main + bonus track |
| Participation gate | Verify on the rules page: paper submission may require a main-competition entry — check before stub-submitting |
| Rubric alignment | Relevance (harness-native agent) / Novelty (spec-ordering + risk gate) / Rigor (pre-registered refutations) / Reproducibility (frozen corpus + ladder) / Clarity — each § of the draft maps to one criterion; judges skew graph-ML (per 04-paper-track intel) → keep the DAG/entropy material |
| Numbers honesty gate | §5 "constructed case studies" must keep that label in the final; if A1–A2 rung numbers exist by submission date, replace constructed numbers with measured ones and move limitations |

**Do-not-submit checklist (author actions):**

1. Run the A1/A2 rungs on the pilot-8 + dev-30 splits if compute allows before the deadline; replace every "(planned)" with a number or delete the claim.
2. Verify citation details [4][5][6][10] against arXiv (title/authors/IDs were transcribed from the v3 reference list — spot-check IDs; v3's list was verified 2026-09-29 but re-verify the four least-load-bearing).
3. Recount words after final edits; the venue counter is authoritative.
4. Confirm whether the venue counts citations/references inside the cap (the measured body leaves ~1,037 words of headroom either way — spend it on measured results).
5. Stub-submit early for the tie-break, then revise.


---

<!-- ====================================================================== -->
<!-- FILE: 03-gemma-e2b-e4b-technical-primer.md -->
<!-- ====================================================================== -->

# Gemma 4 E2B / E4B Technical Primer — for the Kaggle Developer Agent Bonus Prize

**Compiled:** 2026-10-31 · **Status:** all facts verified against live primary sources on this date unless tagged otherwise · **Companion deliverables:** [01-bcf-formal-specification.md](01-bcf-formal-specification.md) · [02-kaggle-whitepaper-draft.md](02-kaggle-whitepaper-draft.md) · [04-bonus-prize-submission-plan.md](04-bonus-prize-submission-plan.md) · [05-main-idea-beginners-guide.md](05-main-idea-beginners-guide.md)

**Primary sources used:** Google AI for Developers — Gemma 4 model overview (ai.google.dev/gemma/docs/core, fetched 2026-10-31); Hugging Face model cards google/gemma-4-E2B and google/gemma-4-E4B (fetched 2026-10-31); Gemma 4 Technical Report, arXiv:2607.02770v2 (HTML full text, fetched 2026-10-31); Kaggle discussion threads 751104 (Bonus Prize announcement) and 748287 (New Gemma 4 Models Available), fetched 2026-10-31. Full ledger: [06-sources.md](06-sources.md).

---

## 1. Where E2B/E4B sit in the Gemma 4 family

Gemma 4 ships five sizes across four architectures. The "E" in E2B/E4B stands for **effective parameters**: both are dense decoders whose *total* learned weights are much larger than the count that is active per token, because most of the extra mass lives in **Per-Layer Embeddings (PLE)** — large lookup tables that can be stored in cheap flash memory rather than resident RAM (the mechanism inherited from Gemma 3n).

| Variant | Architecture | Effective params | Total params | Context | Native modalities | Deployment tier |
|---|---|---|---|---|---|---|
| **E2B** | Dense + PLE | **2.3B** | **5.1B** | 128K | text, image, audio, video (frames) | Ultra-mobile / edge / browser (Pixel, Chrome) |
| **E4B** | Dense + PLE | **4.5B** | **8B** | 128K | text, image, audio, video (frames) | Ultra-mobile / edge / browser |
| 12B | Unified (encoder-free) | 12B | 12B | 256K | text, image, audio, video | Server |
| 26B A4B | MoE (4B active) | 4B active | 26B | 256K | text, image, video | Server |
| 31B | Dense | 31B | 31B | 256K | text, image, video | Server (the main competition's base model) |

Source: ai.google.dev overview + technical report Table 1. Note the docs framing: "Rather than adding more layers to the model, PLE gives each decoder layer its own small embedding for every token," and consequently "the total memory required to load static weights is higher than the effective parameter count suggests."

**PLE parameter split (technical report Table 1):**

| Model | Base embedder | Per-layer embedder (PLE) |
|---|---|---|
| E2B | 400M | 2,340M |
| E4B | 670M | 2,820M |

So E2B spends roughly 46% of its 5.1B total parameters on PLE lookup tables, and E4B roughly 35% of 8B. The technical report states the E-series uses per-layer embeddings "as in Gemma 3n"; the flash-offload mechanics themselves are not re-described in the Gemma 4 report (they are documented in the Gemma 3n literature — treat the offload claim as inherited, not re-measured).

## 2. Architecture details

| Property | E2B | E4B | Notes / source |
|---|---|---|---|
| Decoder layers | **35** | **42** | HF model cards |
| Vocabulary | 262K (shared SentencePiece, family-wide) | 262K | report §pre-training |
| Local attention | sliding window **512 tokens** | sliding window 512 | hybrid local/global interleave |
| Local:global ratio | **4:1** (E2B only; all other Gemma 4 models are 5:1) | 5:1 | report §attention |
| Global layers | unified Keys/Values + **pp-RoPE (p = 0.25)**; frequencies 1M (global) vs 10k (local) | same | final layer always global |
| KV-cache sharing | 20/35 layers | 18/42 layers | report (family-wide mechanism to cut global KV up to 37.5%) |
| Keys-as-values reuse | **not applied** in E2B/E4B (family-wide for others) | not applied | report |
| Context window | 128K | 128K | docs + cards (harness caps it at 32,768 anyway — see §5) |
| Vision encoder | ~150M (d_model 768, 16 layers) | ~150M | report Table 10; W8A8 halves its memory (400→200 MB) and cuts on-device latency 44% vs Gemma 3n |
| Audio encoder | ~300M (305M; 87 MB on disk, 78% smaller than Gemma 3n's) | ~300M | report Table 7 discussion |
| MTP draft model | **76M** | **77M** | dedicated speculative-decoding drafter (see §3) |
| Audio/video limits | audio ≤ 30 s; video ≤ 60 s at 1 fps | same | HF cards |
| Visual token budgets | 70 / 140 / 280 / 560 / 1120 | same | HF cards |

## 3. Multi-Token Prediction drafter (speculative decoding)

Every Gemma 4 model, including E2B/E4B, ships a dedicated **draft model for speculative decoding** — "significantly faster inference with no quality loss" (docs overview). For the E-series it is a small Transformer (model dimension 256; 4 layers: 3 local + 1 global) that cross-attends to the main model's key-values, fed the last-layer activations plus token embeddings. No separate MTP prefill is needed and any draft length works. An E-series-specific optimization shrinks the drafter's final matmul from d×262,000 to d×4,096 by predicting into top-k token clusters, "with similar acceptance rate" (report). Practical consequence for agents: long generations (patches, plans) benefit from the speedup automatically wherever the serving stack enables the drafter; the harness's vLLM path does not document drafter activation, so treat in-competition benefit as unverified.

## 4. Memory footprint (three accounting regimes — do not mix them)

The two official sources report memory under different accounting regimes, and both are correct:

1. **Static weights, all weights resident (docs overview table, ~20% loading overhead included):**

| Model | BF16 | SFP8 | Q4_0 | Mobile (LiteRT-LM) | Mobile text-only |
|---|---|---|---|---|---|
| E2B | 11.4 GB | 5.7 GB | 2.9 GB | **1.1 GB** | **0.84 GB** |
| E4B | 17.9 GB | 8.9 GB | 4.5 GB | **2.5 GB** | **2.2 GB** |
| (reference) 31B | 69.9 GB | 34.9 GB | 17.5 GB | — | — |

2. **Technical report Table 3 (RAM-resident accounting, PLE offloadable):** E2B 4.6 GB BF16 / **0.8 GB mobile-quantized**, +0.05 GB KV at 32k context; E4B 9.0 GB / **2.3 GB**, +0.14 GB KV at 32k.

3. **QAT checkpoint variants (docs overview):** the `-qat-w4a16-ct` checkpoints (vLLM/SGLang serving) exist for **E2B, E4B, 12B, and 31B** — this is the variant family the competition harness serves. The `wNa8o8` mobile schema (targeted 2-bit decoding layers, optimized KV, static activations) is E-series-only.

Reading: the docs table counts every weight on disk; the report's smaller numbers reflect what must sit in fast RAM when PLE lives in flash. For the competition this distinction is moot (the harness serves the w4a16 server checkpoint on 4×L4 GPUs), but for any "runs on a laptop/phone" claim in a paper or bonus-prize writeup, cite the regime you actually mean.

## 5. Capabilities and measured benchmarks (instruction-tuned, thinking mode)

Coding and agentic strength is the load-bearing question for the bonus prize. Numbers below are from the technical report Table 5 (thinking mode) and the HF cards; SWE-bench and BFCL are **absent** from the Gemma 4 report entirely — nobody has published an E-series SWE-bench number.

| Benchmark | E2B | E4B | (reference: Gemma 4 31B, per report) |
|---|---|---|---|
| LiveCodeBench v6 | 44.0 | **52.0** | higher (31B leads family) |
| Codeforces Elo | 633 | **940** | higher |
| SciCode | 21.0 | 24.0 | higher |
| **Terminal Bench Hard (agentic)** | **3.0** | **8.0** | substantially higher |
| MMLU Pro | 60.0 | 69.4 | higher |
| AIME 2026 (no tools) | 37.5 | 42.5 | higher |
| GPQA Diamond | 43.4 | 58.6 | higher |
| BigBench Extra Hard | 21.9 | 33.1 | higher |
| IFEval | 94.6 | 96.7 | ≈ |
| Tau2 (airline / retail / telecom) | 31.0 / 34.6 / 19.7 | 52.0 / 67.1 / 18.4 | 31B: 86.4 avg tau2-bench (per model card, cited in our v3 whitepaper ref [1]) |
| RULER 128k | 70.4 | 86.6 | higher |
| GraphWalks F1 (long-context) | 4.1 | 50.9 | — |
| MMMU Pro (vision @1120 tokens) | 44.2 | 52.6 | higher |

Interpretation for the bonus track: E4B clears half of LiveCodeBench v6 (function-level code generation) but only **8% of Terminal Bench Hard** — the agentic, multi-turn, terminal-driven regime the competition actually is. E2B's 3% puts it near-floor. The gap between 52% single-shot coding and 8% agentic terminal work is precisely the space a methodology layer (BCF) plus fine-tuning has to close. This is the single most important table in this primer.

Also native on both: **function calling** ("native structured tool-use support … powering highly capable autonomous agents", HF card), **native `system` role**, and **configurable thinking mode** (`<|think|>` token at the start of the system prompt; transformers `enable_thinking=True/False`; `parse_response()` splits the thought channel; exclude prior thoughts from multi-turn history except in tool-call turns). Unlike the larger variants, E2B/E4B do **not** emit an empty thought block when thinking is off.

## 6. Training provenance

Pre-training is "similar pre-training as Gemma 3" with data cutoff January 2025, across web documents, code, math, images, and audio in 140+ languages. Infrastructure (report Table 2): E2B — 4,096 TPUv6e; E4B — 6,144 TPUv6e. The report does **not** disclose E-series-specific distillation, SFT data scale, or RL methods (post-training described only as Gemma-3-like plus thinking-mode work). Any claim that "E4B is distilled from 31B" is plausible-but-unverified — do not put it in a submission without a source.

## 7. Fine-tuning the E-series (what is and is not documented)

Verified, from the technical report and cards:

- **End tokens**: PT models emit `<eos>`, IT models emit `<turn|>`; fine-tuning "requires adding their respective end tokens." Getting this wrong silently truncates training targets.
- **Thinking syntax**: activate via `<|think|>` in a leading system turn; thought-channel output syntax must be preserved in SFT data or the harness's `reasoning_parser='gemma4'` will mis-parse.
- **License**: the HF cards link the Gemma 4 license docs under an Apache-2.0-styled header. The competition's own data rules (Kaggle §6.c OSI-style constraints vs the wheelhouse) govern what you may train on and redistribute — the BCF corpus work already maps those walls (see prior brain-harvest deliverables).

Not documented anywhere (mark as design decisions, not facts, in any submission):

- Whether PLE tables should be frozen, trained, or excluded as LoRA *targets*. Precedent (Gemma 3n practice + PEFT defaults): target the linear projections (`q/k/v/o/gate/up/down_proj`), leave embeddings and PLE frozen. This is the standard conservative recipe and matches the harness's own adapter-size guidance for 31B, which enumerates exactly those seven projections.
- The harness README's adapter-size table (r=16 ≈ 110–220 MB … r=128 ≈ 0.9–1.8 GB) is calibrated for **31B**. E-series adapters are proportionally smaller (the host's words: "smaller models use smaller LoRA adapters, so you can include more of them in your submission"). No official E-series size table exists yet; derive from your own adapter safetensors byte count before budgeting (the prior LoRA-primer's r×MB arithmetic method applies, recalibrated to E4B layer dims).
- E-series-specific quantized-LoRA interaction (bf16-trained adapter on a QAT w4a16 base) carries the same K1 pairing risk documented for 31B in the 2026-09-29 LoRA-gate briefing; re-verify with a loud-adapter canary before trusting any E-series adapter submission.

## 8. Serving inside the competition harness (verified 2026-10-31)

From Kaggle staff thread 748287 (Ryan Holbrook, posted ~2026-10-11) and the Bonus Prize thread 751104 (Elan Markowitz, posted ~2026-10-21):

- The allowed base models are now exactly: `gemma-4-31b-it-qat-w4a16-ct`, `gemma-4-12b-it-qat-w4a16-ct`, **`gemma-4-e4b-it-qat-w4a16-ct`**, **`gemma-4-e2b-it-qat-w4a16-ct`** (also confirmed in the updated HARNESS_README's model registry per participant quote of `_build_cli_model_registry()`).
- **No mixing**: every agent and subagent in one submission must use the same variant; different LoRA adapters per agent remain allowed.
- Serving stays vLLM TP4 on 4×L4, `max_model_len = 32768` (so the E-series' 128K window is capped at 32k in-competition), `tool_call_parser='gemma4'`, `reasoning_parser='gemma4'`, `enable_thinking` default on.
- The host's stated rationale for small models: (1) more test-time compute — faster inference and lower memory mean more/longer reasoning turns and iteration cycles within the same 12-hour budget (ParallelAgent concurrent LLM calls noted, with the caveat that tool calls still execute sequentially and ADK 1.36 has a known ParallelAgent bug the host declined to migrate); (2) faster, consumer-GPU-friendly LoRA iteration; (3) more adapters fit the 3 GiB submission cap.
- Environment pinning matters: the official Wheelhouse is at **V31**; on Kaggle notebooks, Python 3.12.13 with the environment pinned to 2026-07-01 works, while Python 3.13.15 (2026-10-03 pin) breaks nine cp312-tagged wheels. Pin your training/notebook envs accordingly.
- Known E4B-adjacent hazard: the tool-call parser can loop forever on an array tool argument, freezing inference (thread 753973, reproduced locally on vLLM 0.10.12 by a second participant, open as of 2026-10-31). Keep tool schemas scalar-friendly and watch this thread before final submission.

## 9. What the E-series changes, strategically (bridge to deliverable 04)

1. **The clock favors the small model.** The binding constraint is 12 hours across ~120 hidden tasks (~6 min/task all-in). E4B generates tokens several times faster than 31B on the same 4×L4 TP4 setup (fewer, smaller layers; smaller KV per token) — that speed converts directly into more turns per task, more recovery headroom, and more tasks attempted. The host said this in as many words.
2. **The capability gap is real.** Terminal-Bench-Hard 8% vs the 31B's substantially higher agentic scores means the E-series agent starts far behind on raw competence. Scaffold discipline (spec-first, graph-first, gated submission) and fine-tuning must each claw back ground the base model cannot supply.
3. **The bonus prize is a separate podium.** $10K goes to the best private-LB *final* submission using E2B or E4B — cross-eligible with main-track prizes and the paper track. The strategic cost: it must occupy one of the team's two final-submission slots.
4. **E4B over E2B for a BCF-style agent.** Every agentic-relevant benchmark roughly doubles from E2B to E4B (Terminal-Bench-Hard 3→8, Tau2-airline 31→52, GraphWalks 4→51); the memory/speed penalty on the eval hardware is small (both fit trivially in 4×L4), so E2B's only real edge — running on a phone — is worth nothing in this competition. The plan in deliverable 04 is E4B-first with E2B as a stretch ablation.

---

*QC: this file's tables were validated by the run's table-checker (see [00-README.md](00-README.md) §QC). Facts tagged with source anchors in [06-sources.md](06-sources.md); anything not source-anchored above is explicitly marked as precedent, unverified, or a design decision.*


---

<!-- ====================================================================== -->
<!-- FILE: 04-bonus-prize-submission-plan.md -->
<!-- ====================================================================== -->

# Bonus Prize Submission Plan — BCF-E on Gemma 4 E4B

**Compiled:** 2026-10-31 · **Prize:** $10,000 — highest private-LB final submission using E2B or E4B (thread 751104, Elan Markowitz, Kaggle staff) · **Companion:** [03](03-gemma-e2b-e4b-technical-primer.md) (model facts) · [01](01-bcf-formal-specification.md) (framework) · [05](05-main-idea-beginners-guide.md) (why this works)

**The rules that shape everything** (verified from thread 751104 + paper/rules pages, 2026-10-31):

1. One prize, one winner: the highest-ranked **final** submission on the **private** leaderboard that uses an E-series model. Ranking is by ordinary competition score — there is no separate small-model leaderboard for scoring (the daily small-model LB notebook, when released, is informational).
2. It must be one of the team's **two selected final submissions**. This is the real cost: a bonus-track slot can displace a 31B submission from finals.
3. Cross-eligible: a bonus-winning submission also competes for main-track and paper-track prizes. The same zip cannot be two of your finals, but it does compete on both podiums.
4. Same deadlines as the main competition: **entry deadline 2026-11-25, final submission 2026-12-02**. Submissions: 5/day; 2 finals selected.
5. LoRA adapters are legal on the bonus track (same submission mechanics as main).

---

## 1. Strategic frame: you are not fighting the 31B teams for score

The bonus is a **separate podium with one dimension**: best E-series final. Your E4B submission's *absolute* score matters only against other E-series finals. So the plan optimizes:

- **Beat the plausible E-series field**, not the 31B field. The E-series field will be thin (most teams never touch E4B; the public board's E-series entries are rare) and weak on average — the same budget/turn-discipline problems the whole field has, plus a weaker brain.
- **Survive the two-finals tax.** The team needs a 31B final anyway. The decision point (§6) is whether the E4B run is strong enough to spend a finals slot on.

The expected-value logic: if any E-series final scores even 0.05–0.10, it likely wins the bonus outright (a field of a handful of mostly-unoptimized E4B submissions will cluster near the floor). You do not need a good score — you need a *score at all* plus luck of a thin field. That reframes the whole plan: **first priority is a validated, scoring, non-crashing E4B submission; second is squeezing score.**

## 2. Why E4B and not E2B (locked decision)

From [03](03-gemma-e2b-e4b-technical-primer.md) §5/§9: every agentic benchmark roughly doubles E2B→E4B (Terminal-Bench-Hard 3%→8%, Tau2-airline 31→52, GraphWalks 4.1→50.9), both models fit trivially in the eval hardware, and E2B's only edge (running on a phone) is worthless here. E2B remains a documented fallback if a harness bug specific to E4B emerges (e.g. if thread 753973's tool-parser hang proves E4B-specific — it was reported on E4B, see §7 R-1). Do not burn submission quota on E2B otherwise.

## 3. The BCF-E configuration (scaffold deltas from BCF-Gemma)

The scaffold transfers unchanged in shape; the **deltas** are all about compensating for a smaller brain with a cheaper clock:

| Lever | BCF-Gemma (31B) | BCF-E (E4B) | Rationale |
|---|---|---|---|
| Spec verbosity | compact triples | same schema, shorter fields | E4B follows short structured prompts better; schema discipline matters more than prose |
| Graph queries per task | lazy, on demand | eager — always run the dual-symbol query first | The model's lexical retrieval is the weak organ; never let it grep when a graph query answers |
| Read budget | ≤150 lines/read | ≤80 lines/read, prefer symbol-extracted views | 32k context fills faster when reasoning is weaker; smaller reads = more recovery turns |
| Thinking budget | 4096 spec / low elsewhere | 2048–4096 spec, low elsewhere; test-off for P2/P4 | Thinking tokens are the E-series' scarcest resource; spend only where errors poison downstream (spec) |
| Turns per task | ~30 soft cap | ~50 soft cap | Tokens are ~3–4× cheaper on E4B (67 vs 35 tok/s measured for 12B-class models on this hardware; E4B similar class) — spend turns, not thought |
| Risk gate | full R0–R4 | full R0–R4, **R3/R4 enforced harder** | The small model attempts more inappropriate edits; the deterministic gate is brain-free and saves turns |
| Rescue/escalation | spec-amend + best-effort submit | same, but trigger one edit-earlier | E4B's second-attempt success rate is lower; cut losses sooner, always submit something |
| Sub-agents | avoid (ParallelAgent broken in ADK 1.36, issue #7324; host declined migration) | same — and single-writer (A3) forbids parallel mutation anyway | Bug + constitution align |

## 4. The LoRA question on E4B — evidence-first, gate-hard

**Standing evidence (as of 2026-10-31):**

- Public thread 753793 ("Is LoRA really helpful?"): Cygnify reports three E4B LoRA attempts (full-trajectory SFT, filtered, targeted-format) — **none beat the no-adapter baseline**; diagnosis was style-transfer without skill gain. Dhruv Pai Dukle reports the one public win: localization-SFT where trajectories were generated by a stronger teacher (DeepSeek) and *verified*, teaching localization specifically.
- The two-band finding from the 2026-09-29 LoRA-gate work stands: format/procedure-level changes need ~100–500 trajectories; resolution-rate gains need ~500+ verified trajectories. Nobody in this competition has 500 high-quality E4B-legal trajectories.
- Kaggle staff (thread 748287, Ryan Holbrook): train adapters against the **unquantized** E-variant on the same models page; the scorer serves the QAT checkpoint. That bf16-adapter-on-QAT-base pairing is exactly the K1 risk already documented for 31B.

**Decision: scaffold-first, adapter-second, canary-always.**

| Gate | Test | Pass condition | Action on pass |
|---|---|---|---|
| C1 no-op canary | Submit E4B with a rank-1, near-zero-init adapter attached | Score within noise of bare baseline (±3 tasks ≈ ±0.05) | Adapter loading itself doesn't corrupt serving — proceed |
| C2 loud canary | Adapter trained 50 steps to produce an obvious, harmless behavior (e.g. a fixed first-turn token pattern) | Behavior visible in logs AND score within noise of C1 | Adapter actually loads and influences generation under QAT base — proceed |
| C3 real candidate | Localization-SFT adapter, r=16, ≤500 verified trajectories from teacher-localized public-task runs | Held-out dev-30 beats no-adapter baseline by >noise (>0.08, i.e. ~5 tasks) | Ship as the finals candidate |
| C-fail any | — | any gate fails | Drop adapters; submit pure-scaffold BCF-E. The bonus does not require LoRA |

Do not spend more than ~2 of the 5 daily submissions on canaries; C1+C2 can share one day early in the window, C3 gets its own day.

## 5. Submission mechanics checklist (E4B-specific)

1. `agent.yaml` / model name: `gemma-4-e4b-it-qat-w4a16-ct` — exact string, no 12B-style `--hf-overrides` needed (E-series is dense, loads like 31B; the override saga in thread 748287 is a 12B-unified-architecture problem, not ours — but verify in local eval).
2. Environment pins: Wheelhouse **V31**; Kaggle-notebook training runs on **Python 3.12.13 with environment pinned 2026-07-01** (the 3.13/2026-10-03 pin breaks nine cp312 wheels — GOSS's finding, thread 748287).
3. Tool schemas: **scalar-friendly only** — no array-valued tool arguments anywhere in the submission (thread 753973: array args can loop the tool parser and freeze the inference server for the rest of the run; reproduced on local vLLM 0.10.12). Audit every tool declaration; this kills entire submissions.
4. Local validation: the local scorer + validator must pass on 4×L4 with the E4B checkpoint before any submission (thread 748287 confirms the scorer already has the model registry entry; participant-quoted `_build_cli_model_registry()` shows all four variants).
5. Watch the daily small-model LB notebook promised in thread 751104 — when it lands it becomes the cheapest E-series calibration signal available.
6. Budget guard: 12h across ~120 tasks; set per-task wall-clock ceilings in eval_config knobs; E4B's speed advantage evaporates if one task hangs (the 6+ hour "Scoring…" reports in the field are usually a hung task, not queueing).

## 6. Two-finals allocation (the real decision)

| Date | Main-track slot thinking | Bonus-slot thinking |
|---|---|---|
| Now → Nov 21 | Iterate 31B; hold 5/day discipline; burn at most 1/day on E4B canaries | C1/C2 canaries early; pure-scaffold E4B scored once by ~Nov 10 to establish the field |
| Nov 21–25 | Freeze main candidate(s) | E4B best-known frozen; entry deadline Nov 25 is a hard gate — ensure team is entered (paper-track participation question may also gate, verify on rules page) |
| Nov 25 → Dec 2 | Select 2 finals | Decision rule: pick E4B as final #2 if its best public score ≥ 0.03 (≈2 tasks) AND the main-track #2 candidate is not within noise of #1's role; else forfeit bonus (an E4B final that scores 0.000 is a wasted slot) |

Rationale for the ≥0.03 bar: any E-series final that resolves ≥2 private tasks is plausibly bonus-winning in a thin field, and the marginal main-track cost of swapping finals #2 is small when #1 carries the score.

## 7. Risk register

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R-1 | Tool-parser array-arg hang (753973) hits our E4B run mid-competition | Med (reported on E4B specifically) | Fatal to a whole submission run | Scalar-only schemas (§5.3); regression-test every tool change; watch thread for host patch |
| R-2 | E4B + bf16 adapter K1 pairing degrades or breaks serving | Med | Fatal or silent-score-loss | C1/C2 canary ladder before trusting any adapter (§4) |
| R-3 | Thin-field assumption wrong — a strong team ships a tuned E4B | Low-Med | Bonus contested | Cannot mitigate by planning; maximize E4B score within budget anyway; monitor the daily small-model notebook + public LB for E-series entries |
| R-4 | 12h budget overrun on hung tasks | Med | Lost tasks | Wall-clock ceilings; governor's floor mode; always-submit-something rescue |
| R-5 | Two-finals tax: E4B final displaces a better 31B second final | Certain if invoked | −main-track EV | §6 decision rule; only spend the slot when E4B has demonstrated signal |
| R-6 | "Notebook Threw Exception"/queue instability (threads 751339, 747519) wastes submission days | Med (field-wide) | Lost calendar days | Submit early in the window; never plan around the last 48h; keep a known-good zip to resubmit |
| R-7 | Daily submission quota (5/day) exhausted on debugging | Med | Slows iteration | Local sandbox (Kirchner's scorer-like sandbox, thread 751487, passes 127/129 gold) for everything but true scoring runs |
| R-8 | E-series-specific harness quirks (doc lag: HARNESS_README still said 31B-only until participant pushback) | Low now | Confusion | Trust the staff thread + scorer registry over stale docs; re-verify at freeze |

## 8. Timeline to 2026-12-02 (from today, 2026-10-31)

| Window | Milestones |
|---|---|
| Oct 31 – Nov 7 | Port scaffold to E4B; local eval green (R-1 audit done); first E4B submission (scaffold-only) — establishes "a score exists" |
| Nov 8 – Nov 14 | C1+C2 canaries (one day); begin teacher-verified localization trajectory harvest on public tasks if pursuing C3 |
| Nov 15 – Nov 21 | C3 candidate or explicit adapter-forfeit decision; freeze BCF-E config; E4B public-LB read |
| Nov 22 – Nov 25 | Entry deadline (Nov 25) — confirm team entry + paper stub; both tracks' finals shortlist drafted |
| Nov 26 – Dec 2 | Final submission window (Dec 2): select 2 finals per §6; no scaffold changes after Nov 28; last 48h reserved for resubmission of known-good artifacts only |

---

*The beginner-level "what is the main idea and what moves the needle" companion is [05](05-main-idea-beginners-guide.md); every model fact cited here is sourced in [06-sources.md](06-sources.md).*


---

<!-- ====================================================================== -->
<!-- FILE: 05-main-idea-beginners-guide.md -->
<!-- ====================================================================== -->

# The Main Idea, Like You're a Beginner — E2B/E4B, the Bonus Prize, and What Actually Moves the Needle

**Written for:** the author, as a plain-language companion to the formal deliverables. **Companions:** [03](03-gemma-e2b-e4b-technical-primer.md) for every technical claim's source, [01](01-bcf-formal-specification.md) for the formal framework, [04](04-bonus-prize-submission-plan.md) for the operational plan.

---

## Part 1 — Three beginner explainers

### 1.1 What are Gemma E2B and E4B, in plain words?

Imagine two bookshelves. A normal 31B model is a **wall-sized bookshelf in one room** — to answer you, it must have the whole wall accessible at once, and every letter it writes involves walking past a lot of books. Gemma 4 E4B is a **small desk shelf plus a giant basement archive**: the desk shelf (about 4.5B parameters' worth of "active" brain) is what does the actual thinking on every word, while a much larger reference collection (the Per-Layer Embeddings, another ~3.5B parameters) sits in cheap storage — flash memory, like a basement — and gets consulted per-layer as needed rather than living in the room.

That is what the "E" means: **Effective** parameters. E2B = about 2.3B effective (5.1B total), E4B = about 4.5B effective (8B total). The trick is inherited from Gemma 3n and it exists for one purpose: **run a surprisingly capable model on a phone or in a browser tab** — E4B's mobile footprint is about 2.2–2.5 GB.

In this competition, though, nobody's phone matters. The eval hardware is the same beefy 4×GPU server for everyone. What the E-series brings to *this contest* is not smallness — it's **speed**. A smaller model generates tokens several times faster, and since every team gets the same 12-hour clock across ~120 tasks, an E4B agent can simply *think more times per task* than a 31B agent. The catch, and it's a big one: the E-series is much weaker at exactly the kind of work this contest is. On Terminal-Bench-Hard — multi-step agentic terminal work, the closest public analogue to this competition — E2B scores 3% and E4B 8%, versus "substantially higher" for the 31B. E4B can write a function from scratch about half the time (LiveCodeBench 52%), but left alone in a repository with a bug and a terminal, it mostly gets lost. That gap is the entire bonus-prize game.

### 1.2 What is the bonus prize?

Kaggle staff (thread 751104) put up **$10,000 for the best final submission that uses the E2B or E4B model** — judged on the private leaderboard at competition end, December 2, 2026. It's a separate podium: your E4B submission doesn't have to beat the 31B teams; it has to beat the *other small-model* submissions. Cross-eligible with the main prizes and the paper track (so one clever E4B submission can theoretically collect on multiple podiums). The fine print that matters: it must occupy one of your team's **two** final-submission slots — you pay for the bonus ticket with a slot a 31B submission could have used. And because most teams will never bother with E4B, the small-model field is likely thin: a modest score may win it outright.

### 1.3 What is BCF's main idea, in one breath?

**Stop letting the agent wander.** A naive agent reads files until its head is full, guesses an edit, and when the test still fails, reads some more with a muddier head. BCF replaces the wander with an itinerary:

1. **Say what you're looking for before you look** (write a falsifiable hypothesis first — a spec, not vibes).
2. **Ask the map, not the streets** (query the code's call graph — "who calls this broken function?" — instead of grepping and re-reading files).
3. **Check the blast radius before you touch anything** (a cheap rule-based gate prices every edit; test files are simply off-limits).
4. **Prove it, then submit; keep the last working state always** (never destroy working code).
5. **Write down what happened, win or lose** (every task leaves a ledger entry — that's the "batonic" battery: nothing you did is thrown away).

Why does this beat raw capability? Because in a 6-minutes-per-task contest, **turns are the scarce resource**, and wandering burns turns faster than a small brain does. The spec turns "I wonder what's wrong" into "the bug is X, look at symbol Y"; the graph query turns five file-reads into one structured question; the gate stops wasted edits; the ledger means task #80 benefits from what task #12 taught you.

## Part 2 — What actually moves the needle

The question behind the bonus: *what must the BCF brain do to create **permanent** improvement over the naive agent?* "Permanent" is the load-bearing word, so let's be precise about where an improvement can live.

### 2.1 The three places an improvement can live

| Channel | What it is | Lifetime | Cost to change | In-competition form |
|---|---|---|---|---|
| **Ephemeral context** | anything the model figures out mid-task | dies with the task | free | the thing being improved |
| **Durable artifacts** | specs, ledgers, failure signatures, codebooks, prompt/skill libraries, retrieval structures | persists across tasks and runs | hours (edit + validate) | `skills/`, prompts, in-run ledger reused across the 120 tasks |
| **Weights (LoRA)** | parameter deltas baked into an adapter | persists into every future run | days (data harvest + train + gate) | `adapters/` in the submission zip |

A naive agent improves only in channel 1 — which is to say, it doesn't improve. **Moving the needle = shifting behavior into channels 2 and 3.** BCF's design puts most of its bet on channel 2 (cheap, verifiable, reversible) and treats channel 3 as a gated upgrade.

### 2.2 What the evidence actually says (honest table, as of 2026-10-31)

| Evidence | Source | What it proves | What it does NOT prove |
|---|---|---|---|
| E4B agentic floor is very low (TB-Hard 8%, tau2-airline 52) | Gemma 4 tech report, Table 5 | raw E4B will not solve most tasks unaided | nothing about scaffolded E4B (no E-series SWE-bench number exists anywhere) |
| Top public LB = 0.24 (14/58), "0.31 reachable" | threads 752848 | even 31B teams are stuck far below ceiling — budget, not brains, is binding | that scaffolds specifically are what's missing (confounded) |
| Public-LB noise: 1 task = 0.017; run sd ≈ 2.5–3 tasks | thread 753524 | any improvement <~0.05 is indistinguishable from luck | — |
| Cygnify: 3 E4B LoRA attempts, none beat baseline; "style not skill" | thread 753793 | naive trajectory-SFT on E4B does nothing or hurts | that ALL LoRA fails — their data was unfiltered/unverified |
| Dhruv: teacher-generated, *verified* localization SFT helped on 31B | thread 753793 | the one public LoRA win is narrow: teach localization with quality data | it transfers to E4B |
| ~500-trajectory floor for resolution gains; 100–500 for format/procedure | SWE-Gym/SWE-smith literature + 2026-09-29 LoRA-gate synthesis | small datasets change style, not skill | the exact number in *this* harness |
| Gold patches pass 127/129 in scorer-like local sandbox | thread 751487 | local eval is now trustworthy — iterate there, spend submissions sparingly | hidden tasks behave identically |
| Host: small models = more test-time compute, faster LoRA iteration, more adapters under 3 GiB | thread 748287 (staff) | the host *wants* the E-series strategies to be viable | that they actually are |

### 2.3 So what does the BCF brain need to do? Five concrete needle-movers

**1. Win the turn economy (biggest, most certain).** Every graph query that replaces 4–6 file reads, every gate rejection of a doomed edit, every always-submit-something rescue converts directly into more tasks attempted inside 12 hours. On E4B this is *doubly* true: the model is fast (more turns available) but weak (each wasted turn is a larger fraction of its competence). The lever needs no training data, no adapters, and it is fully testable in the local sandbox. **This is where most of the realistic score comes from.**

**2. Kill the known small-model failure modes by construction.** E4B's documented weaknesses — copying the broken pattern it just read (thread 753277 "one-tensor repair"), looping on tool arguments (753973), drifting off schema — are all *procedure* failures, not knowledge failures. BCF counters each mechanically: the clean-room composer breaks the copy loop by never showing the broken body to the composer; scalar-only tool schemas eliminate the parser-loop bug class; the spec schema gives the model a rigid rails to run on. No weights changed; failure modes deleted.

**3. Accumulate within the run (channel 2, in-competition).** The 120 hidden tasks draw from a shared universe of libraries and bug shapes. BCF's ledger + failure signatures let task #90's spec start warmer than task #1's: "this signature looked like X last time, check the graph edge first." Even a small per-task turn saving compounds across a 12-hour run. This is the honest, testable version of "self-improving."

**4. Improve the model itself — only through the gate (channel 3).** The one public LoRA success (localization-SFT from a strong teacher's verified trajectories) suggests the only weight-level intervention with evidence: teach E4B to *localize better* using trajectories a stronger model (or the harness's own gold patches in the local sandbox) has already verified. The canary ladder in [04](04-bonus-prize-submission-plan.md) §4 (C1 no-op → C2 loud → C3 real) exists because adapters can silently break the QAT serving — and Cygnify's nulls say most E4B fine-tuning attempts will waste your calendar. Bet small; the scaffold is the primary.

**5. Convert speed into attempts.** E4B's throughput edge means BCF-E should run *more tasks to completion* than a 31B team's budget allows — if the scaffold enforces per-task ceilings and rescue-submit. A team that attempts 120 tasks at 15% each beats a team that attempts 70 at 20% each. This is pure arithmetic plus governor discipline; zero intelligence required.

### 2.4 The needle, summarized

| If you do only one thing | Expected effect | Confidence |
|---|---|---|
| Scaffold discipline (spec → graph → gate → validate → submit-always) | From ~0 to a real score; the only lever with no counter-evidence | High |
| + in-run ledger reuse | Small multiplicative turn savings | Medium |
| + gated localization-LoRA (C1–C3 passed) | The only weight-level bet with public evidence | Low-Medium (thin field makes even small gains decisive for the *bonus*) |
| Naive full-trajectory LoRA on E4B | Probably nothing (style transfer), risks breaking serving | — avoid |

**The one-breath answer to the user's question:** the BCF brain moves the needle not by making E4B smarter but by making it *spend its speed on the right moves* — spec before search, graph before reading, gate before editing, validate before submitting, ledger after everything — and by moving every lesson out of dying chat context into artifacts (and, only if the canary gates pass, into weights). Permanent improvement = the agent you ship in December is better than the one you ran in November *even on tasks it has never seen*, because what it learned lives in the submission, not in a chat log.

---

*All quantitative claims above are anchored in [06-sources.md](06-sources.md); the model facts come from [03](03-gemma-e2b-e4b-technical-primer.md) tables 1–5.*


---

<!-- ====================================================================== -->
<!-- FILE: 06-sources.md -->
<!-- ====================================================================== -->

# Source Ledger — 2026-10-31 BCF / Gemma 4 Whitepaper + Bonus-Prize Run

All web sources fetched live on **2026-10-31** via the research-toolkit browser (folder profile, port 29443) unless noted. Raw page dumps preserved under `research-bcf-paper-bonus-2026-10-2026-10/scratch/pages/`. Local corpus items are marked LOCAL. Confidence: **P** = primary/official (highest), **I** = independent participant report, **S** = secondary/synthesis, **M** = memory of prior verified runs (re-verify before external citation).

## A. Official Gemma 4 / model facts

| # | Source | URL / path | Publisher | Date | Confidence | Used for |
|---|---|---|---|---|---|---|
| A1 | Gemma 4 model overview | ai.google.dev/gemma/docs/core | Google AI for Developers | fetched 2026-10-31 | P | family table, PLE description, static-weights memory table, QAT variants, MTP claim |
| A2 | Gemma 4 Technical Report (HTML v2) | arxiv.org/html/2607.02770v2 | Google DeepMind (arXiv) | fetched 2026-10-31 | P | Table 1 PLE split, attention detail (4:1/5:1, pp-RoPE, KV sharing), MTP drafter spec, Table 3 RAM accounting, Table 5 benchmarks, Table 2 training infra, cutoff Jan 2025, end tokens, absence of SWE-bench |
| A3 | HF model card google/gemma-4-E2B | huggingface.co/google/gemma-4-E2B | Google (Hugging Face) | fetched 2026-10-31 | P | 35 layers, audio/video limits, visual token budgets, thinking-mode behavior, function calling |
| A4 | HF model card google/gemma-4-E4B | huggingface.co/google/gemma-4-E4B | Google (Hugging Face) | fetched 2026-10-31 | P | 42 layers, same family details |
| A5 | Gemma 3n PLE/background | prior verified corpus (2026-09-30 ADK primer; 2026-10-01 LoRA primer) | Google docs via earlier runs | Sept–Oct 2026 | M | flash-offload precedent framing ("inherited, not re-measured" caveat in 03 §1) |

## B. Competition official (staff) sources

| # | Source | URL / path | Publisher | Date | Confidence | Used for |
|---|---|---|---|---|---|---|
| B1 | Bonus Prize thread 751104 (OP + all 6 comments) | kaggle.com/competitions/gemma-4-developer-agent/discussion/751104 | Elan Markowitz (Kaggle staff) + commenters | fetched 2026-10-31 (full scroll-v2 capture) | P | $10K terms, private-LB final scoring, two-finals requirement, cross-eligibility, daily small-model notebook promise, same deadlines |
| B2 | New models thread 748287 (OP + 30 comments, full) | kaggle.com/competitions/gemma-4-developer-agent/discussion/748287 | Ryan Holbrook (staff) + GOSS, Jarno Rantala, Cam-Mark, tammamalasha, haji bolot et al. | fetched 2026-10-31 (full scroll-v2 capture) | P (OP) / I (comments) | four allowed models, no-mixing rule, host's three small-model advantages, ParallelAgent bug #7324 + host declining ADK v2 migration, train-against-unquantized guidance, scorer conditions identical, wheelhouse V31, Python 3.12.13/2026-07-01 pin vs 3.13 breakage, 12B override saga (contrast case), 12B ~67 tok/s vs 31B ~35 tok/s (I) |
| B3 | HARNESS_README §3 + §8 | input/kagglecomp/kagglecomp_data_package/HARNESS_README.md | LOCAL (competition data package) | packaged pre-10-31; registry update confirmed via B2 participant quote | P | 4×L4/TP4/0.80/32768 serving, adapter sizing (31B-calibrated), two-container lifecycle, test-file reset / anti-tamper |
| B4 | Kaggle-01-Overview | input/kagglecomp/docs/markdown/Kaggle-01-Overview.md | LOCAL | — | P | timeline (Nov 25 / Dec 2), 5 subs/day, 2 finals, prize structure, citation requirement |
| B5 | Paper-track overview + rules pages | kaggle.com/competitions/gemma-4-developer-agent-paper (overview + rules) | Kaggle | fetched 2026-10-31 | P | 3,000-word cap ("Scope: 3,000 words maximum"), Writeup format, $15K/$10K/$10K, cross-eligibility, same deadlines |
| B6 | Discussion listing (recent sort) | kaggle.com/competitions/gemma-4-developer-agent/discussion?sort=recently-created | Kaggle | fetched 2026-10-31 | P | thread index + recency check (all thread IDs used below) |

## C. Independent participant evidence (discussion threads)

| # | Source | URL | Author | Date | Confidence | Used for |
|---|---|---|---|---|---|---|
| C1 | Thread 753793 "Is LoRA really helpful?" | kaggle.com/.../discussion/753793 | Cygnify OP; Dhruv Pai Dukle | fetched 2026-10-31 | I | Cygnify E4B LoRA nulls (3 approaches, style-not-skill); Dhruv teacher-verified localization-SFT win |
| C2 | Thread 753524 public-score noise | kaggle.com/.../discussion/753524 | Harshit Kumar | fetched 2026-10-31 | I | 1 task = 0.017; sd ≈ 2.5–3 tasks; budget lever analysis |
| C3 | Thread 752848 score ceiling | kaggle.com/.../discussion/752848 | Sahil Das OP; Yurnero; Konwinski Penn | fetched 2026-10-31 | I | top public = 0.24 = 14/58; "0.31 reachable"; ~9/120 estimate |
| C4 | Thread 754294 small-model experiments | kaggle.com/.../discussion/754294 | Gholamali Aminian | fetched 2026-10-31 | I | field interest in parallel small-model slot (no data yet) |
| C5 | Thread 753973 tool-parser array-arg infinite loop | kaggle.com/.../discussion/753973 (referenced from 748287 + listing) | haji bolot; roll0ver (repro on vLLM 0.10.12) | 2026-10-28..31 | I | array tool args can freeze inference server; open as of 10-31; E4B-adjacent |
| C6 | Thread 751487 local scorer-like sandbox, gold 127/129 | kaggle.com/.../discussion/751487 | Zbigniew Kirchner | fetched 2026-10-31 | I | local iteration viability |
| C7 | Thread 753277 "Gemma's Copying Bug" | kaggle.com/.../discussion/753277 (from listing; OP summary only) | Michi Yamamoto | 2026-10-28 | I | copy-bug failure mode motivating clean-room composer |
| C8 | Threads 751339 / 747519 "Notebook Threw Exception" + queue delays | from listing + 748287 cross-refs | Sultan Fawad; Dustin (staff) | Oct 2026 | I/P | submission-pipeline instability; plan for early submissions |
| C9 | Thread 750521 identical zip, different scores | from listing | ELhamdaoui AM; Smart Manoj | Oct 2026 | I | reproducibility noise corroboration |

## D. Local corpus (prior, verified runs)

| # | Item | Path | Confidence | Used for |
|---|---|---|---|---|
| D1 | BCF whitepaper v3 (full) | deliverables/bcf-whitepaper-v3-2026-09-29/bcf-whitepaper-v3-2026-09-29.md | LOCAL (our own) | source of 02's compressed draft: phases, graph protocol, turn-budget model, corpus stats (129 tasks; 67/48/13/1), metrics, case studies, related work |
| D2 | BCF-Gemma competition plan | input/kagglecomp/.../bcf/BCF-Gemma-Competition-Plan.md | LOCAL | ablation ladder A0–A6, CVX verdict, risk register lineage |
| D3 | Paper-track intel | input/kagglecomp/intel_20260930/04-paper-track-intel.md | LOCAL | rubric criteria, judge-roster graph-ML alignment, stub-early tie-break tactic |
| D4 | Discussion-board intel (22-thread sweep) | input/kagglecomp/intel_20260930/03-discussion-board-intel.md | LOCAL | LoRA zeroing/KV collapse, thinking-drop, escaping 22%/62%/0% (background; superseded by C1–C9 live fetches where overlapping) |
| D5 | LoRA-gate deliverables | memory bcf-lora-gate-deliverables (2026-09-29) | M | two-band finding (100–500 / ~500+), K1 bf16-adapter-on-QAT risk, canary ladder C1–C3 |
| D6 | LoRA primer (r×MB arithmetic, pins) | memory lora-primer-gemma4-deliverables (2026-10-01) | M | adapter-size derivation method; peft 0.21.1/trl 1.14.1 pins |
| D7 | ADK primer | memory adk-gemma4-primer-deliverables (2026-09-30) | M | harness ADK 1.36.1 vs upstream 2.10.0; harness fact register |

## E. Literature cited in the whitepaper draft (02)

All ten external citations are carried from whitepaper v3's verified reference list (built 2026-09-29 via Crossref/dblp/arXiv verification per the bibliographic-API workflow, memory `bibliographic-api-verification`). **Re-verify [4][5][6][10] IDs before final submission** — spot-check pass planned in the checklist at 02 §B.

| # | Citation | Status |
|---|---|---|
| [1] | SWE-bench, arXiv:2310.06770 | verified 2026-09-29 |
| [2] | SWE-agent, arXiv:2405.15793 | verified 2026-09-29 |
| [3] | Agentless, arXiv:2407.01489 | verified 2026-09-29 |
| [4] | SpecRover, arXiv:2408.02232 | verified 2026-09-29 — recheck |
| [5] | AutoCodeRover, arXiv:2404.05420 | verified 2026-09-29 — recheck |
| [6] | CodeR, arXiv:2406.01304 | verified 2026-09-29 — recheck |
| [7] | Massey, "Guessing and Entropy," ISIT 1994 | verified 2026-09-29 |
| [8] | Arikan, IEEE Trans. IT 1996 | verified 2026-09-29 |
| [9] | Reiter, AIJ 1987 | verified 2026-09-29 |
| [10] | SWE-Gym, arXiv:2412.21139 | verified 2026-09-29 — recheck |
| [11] | Gemma 4 Technical Report, arXiv:2607.02770 | verified this run (A2) |

## F. Corrections / caveats register (this run)

| Item | Note |
|---|---|
| HARNESS_README §3.1 ALLOWED_MODEL_NAMES | still lists 31B-only in the LOCAL package snapshot; superseded by staff thread 748287 + participant-quoted scorer registry (4 models). 03/04 cite the thread, not the stale README |
| E-series distillation provenance | NOT disclosed in the tech report; 03 §6 marks "distilled from 31B" as plausible-but-unverified — do not assert |
| E-series adapter-size table | does not exist officially; 31B table is the only calibration; derive empirically (03 §7) |
| Memory numbers | docs-static vs report-RAM regimes reconciled explicitly (03 §4); never mix in one claim |
| MTP in-harness benefit | drafter activation in the harness vLLM path undocumented; treat as unverified (03 §3) |
| 12B tok/s figure | single-participant measurement (Jarno Rantale, 748287), contrast case only; no E4B tok/s published — E4B speed claims are inferential (class-based), flagged as such in 04 §3 |

