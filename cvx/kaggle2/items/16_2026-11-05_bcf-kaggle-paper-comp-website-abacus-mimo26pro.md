# COMBINED MARKDOWN - combine

_Generated 2026-11-07 23:59:38 | 3 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle2\items\combine_

## Contents

1. 01-bcf-formal-specification-v2.md
2. 02-contest-fit-assessment.md
3. 05-sources.md

---

<!-- ====================================================================== -->
<!-- FILE: 01-bcf-formal-specification-v2.md -->
<!-- ====================================================================== -->

# The Batonic Coding Framework (BCF) — Formal Specification v2.0

**Compiled:** 2026-11-08 · **Supersedes:** `01-bcf-formal-specification.md` v1.0 (2026-10-31) · **Status:** formal specification + testability analysis + harness realization map

**What changed since v1.0 (summary):** (1) the value claim "x′ is asymptotically greater than x" is now a proposition with an observable and a refutation clause, and the machine-to-machine handoff is a composition-closure contract (§3); (2) the single-point-of-contact clause is formalized as the SPOC mutation channel (§4, §5.1); (3) the localization doctrine is **corrected** — lexical seed first, graph narrowing second (§5.2, corrections register C-1 in [05-sources](05-sources.md)); (4) a hostile-substrate hardening layer H1–H5 is added as normative (§8), derived from measured scorer-pathology intel; (5) every mechanism now carries a concrete harness realization (§9). Changes 3–5 are load-bearing: v1.0's graph-first claim and its unrestricted use of `get_code_subgraph` are withdrawn.

---

## 1. Identity

BCF is three separable things, and keeping them separate is what makes it testable:

1. **A constitution** — eight inviolable process rules (§4) binding any agent, human or machine, operating under BCF.
2. **A reference profile** — concrete tool contracts and control flow (§5–§9) implementing the constitution on a specific substrate. Profiles in force: **BCF-Gemma** (Kaggle Gemma 4 Developer Agent harness, base `gemma-4-31b-it-qat-w4a16-ct`) and **BCF-E** (the $10K small-model bonus track, base `gemma-4-e4b-it-qat-w4a16-ct`).
3. **A measurement protocol** — ablation ladder, metrics, refutation clauses (§10) that make every constitutional claim falsifiable rather than rhetorical.

*Batonic*, by the author's metaphor: a battery loses nothing it cannot later yield. Every unit of work on an input is stored as a recoverable artifact — verified states, specs, ledgers, labels, receipts — so no input ever net-destroys value. The guarantee is monotone accumulation, formalized in Axiom A2 and §3.

## 2. The Constitution (source text → articles)

| # | Constitutional article (author's text, condensed) | Formal reading |
|---|---|---|
| C1 | Always preserve working code | A1 conservation + verified-state chain + validation gate before submission |
| C2 | Single point of contact; gated permission algorithm pricing change risk | A3 + the Risk Gate as the **sole mutation channel** (SPOC, §5.1) |
| C3 | Document the process at the highest necessary fidelity to triage issues | Fidelity Ladder (§6.1) — tiered, budget-aware, reconstruction-tested |
| C4 | Full developer reference in LLM-friendly format, always available (source of truth) | A4 + Reference Pack (§6.2): chunked, anchored, version-pinned |
| C5 | Binary search + BFS/DFS as needed; a guaranteed tool call decomposing issues into atomic, reference-traceable constructs | Search Protocol Suite + `decompose_atomic` (§5.2) |
| C6 | A guaranteed clean-room tool call assembling candidate solutions from atomic constructs and data structures | `cleanroom_compose` (§5.3), quarantined from the defective original |
| C7 | Root-cause analysis and post-mortem checkpoints for self-learning, self-improvement | Improvement Loop with a promotion gate (§6.3) |
| C8 | Effort/thinking-level adjustment trading speed against code quality under external constraints | Effort Governor (§7) — a policy table with measured knobs |

## 3. The value model — "every input yields value; x′ ≻ x; x′ hands off upward"

This is the claim the framework is named for. v1.0 flagged it as aspirational. v2.0 states it as three separate, testable objects.

### 3.1 Stores, artifacts, and the ascent axiom

Let a work session consume inputs $t_1, t_2, \ldots$ (tasks, queries, failures). Let $A(r)$ be the **durable artifacts** a session $r$ emits: ledger rows, specifications, verified patches, failure signatures, taxonomy labels, codebook deltas, receipts. Let $K_n = \bigcup_{i \le n} A(r_i)$ be the cumulative artifact store.

**Axiom A2 (batonic ascent).** For every session $r_i$: $A(r_i) \neq \varnothing$ and $K_{i+1} \supseteq K_i$ with $K_{i+1} \neq K_i$. A failed session contributes its failure signature and RCA row — negative results are information. The minimal artifact (one ledger row) is the lower bound of "value, no matter how small."

### 3.2 Value, and the honest qualification

Monotone *size* of $K$ is guaranteed architecturally. Monotone *value* is not: stale or wrong artifacts are noise. Define $V(K)$ as the expected reduction in future per-task cost (turns, wrong edits) or rise in success probability attributable to $K$'s contents. Then:

- **Proposition 1 (bounded-baseline dominance).** A discard-on-failure process has bounded reusable store ($|K^B| \le M$), so its per-task performance converges to a floor independent of $n$. A BCF process has $|K_n| \ge n$ and, provided the promotion gate (§6.3) retains only validated artifacts, $V(K_n)$ is non-decreasing and its **failure-signature recurrence rate falls** with $n$. Cumulative durable value $x'_n = \sum_{i \le n} |A(r_i)|$ grows without bound while any bounded-memory process's reusable share stays $O(M)$ — this is the precise content of "x′ is asymptotically greater than x."
- **Observable:** recurrence-of-signature rate across runs, and per-task turn cost on repeated failure classes, measured across corpus orderings (§10). **Refuted if** recurrence rates do not fall as $K$ grows, or if curating $K$ costs more than it saves.
- **Qualification (C-4 in [05-sources](05-sources.md)):** ascent is a *design guarantee for the store* and an *empirical claim for performance*. The ablation ladder measures the second; no theorem asserts it.

### 3.3 The handoff contract (composition closure)

"The output x′ can be handed to another machine capable of generating the next higher value." Formalized as the **BCF-Artifact envelope** (§11): a versioned, schema-checked bundle of specs, ledgers, labels, codebook deltas, prompt/skill deltas, adapter cards, receipts. **Composition closure:** an envelope is itself a legal input of the same kind — a conforming consumer machine validates schemas and provenance, runs its own improvement loop on the contents, and emits a strictly richer envelope. Value therefore stacks across machines and sessions, which is what "the battery yields its charge" means operationally.

## 4. The four axioms

| Axiom | Statement | Formal shape | Failure it forbids |
|---|---|---|---|
| **A1 Conservation** | Working code is never knowingly destroyed; every mutation is reversible to the last verified state | verified-passing subset W monotone non-decreasing along committed states; rollback restores the argmax-W state, never a guess | shipped regressions; fix-one-break-two |
| **A2 Ascent** | Every input yields at least one durable artifact of positive information value | §3.1 | null-output loops; repeated identical mistakes |
| **A3 Single Writer / SPOC** | Exactly one authority mutates a given working set; all writes flow through one contact point (the gate) and one record (the ledger) | serialization invariant on writes; readers hold read tokens only | write-write races; untracked edits |
| **A4 Grounded Truth** | Every atomic construct used in reasoning traces to an authoritative reference | total traceability τ(atom) = (ref_id, version, locator); unanchorable atoms are marked *unverified* and cannot enter a patch | hallucinated API semantics drifting into code |

## 5. The three algorithmic pillars

### 5.1 The Risk Gate — C2's "gated permission algorithm", the SPOC mutation channel

Every mutation passes one gate that prices its blast radius before execution. Deterministic, cheap, itself logged.

```text
GATE(change_request):
  scope      <- files_touched U symbols_touched U tests_affected
  coverage   <- |tests exercising scope| / |tests in suite|
  reversibility <- is_patch_single_hunk AND is_working_set_clean
  risk <- f(scope_breadth, coverage, reversibility, protected_files_touched)

  R0 trivial    (comment/doc, no semantic change)     -> auto-approve, log
  R1 local      (single symbol, covered by tests)     -> approve + queue targeted pytest
  R2 structural (shared symbol, callers in graph)     -> approve only with called_by impact list
  R3 wide       (multi-file / API-shape change)       -> require spec amendment (return to P1) first
  R4 protected  (tests, conftest, packaging, stubs)   -> REJECT; re-route to library-side fix
```

Grounding: R4 is not advisory — the verifier force-resets agent-touched test/config files before scoring ([05-sources](05-sources.md) §3.5), so an R4 edit is a guaranteed wasted turn. Unanchorable (A4-*unverified*) constructs price one class higher. Every gate decision ships in the ledger (C3), so the gate is auditable post-run — that is what "algorithm" in C2 promises.

### 5.2 The Search Protocol Suite — C5, **doctrine corrected (C-1)**

**Correction:** v1.0 ordered localization "graph-first." Community measurement on the competition's own graph/embedding data shows the shipped 256-dim embeddings are near-uniform (mean pairwise cosine 0.80) and graph-only seeding underperforms lexical retrieval (BM25 file R@20 69.0% vs best graph-node method 53.3% function-level). The evidence-backed order is **lexical seed → graph narrowing** ([05-sources](05-sources.md) §4).

| Protocol | Search space | Operator | When it is the protocol of record |
|---|---|---|---|
| `locate_lexical` | repo text (files, symbols) | BM25 / `rg -l`-style ranked file candidates, 1–2 calls | **always first** (P2 entry) |
| `graph_narrow` | call/dependency graph from lexical seeds | `get_code_neighbors` (scalar args, bounded fan-out ≤50) expanding to callers/callees | after ≥1 lexical seed exists |
| `graph_dfs` | graph, targeted hypothesis chains | depth-first along a named chain | spec names a suspected chain; verify end-to-end fast |
| `bisect_state` | commit/verified-state chain (temporal) | binary search on "last state where W held" | a regression: behavior passed at some earlier state |

`search_similar_code` is **demoted**: symbol-name queries only, never free-text seeding (its query path resolves against node keys, and its vectors are weakly discriminative — §4 evidence). `get_code_subgraph(list)` is **banned from first-line use** under hardening rule H1 (§8).

`decompose_atomic` (the guaranteed tool call of C5) binds the suite: it takes the issue and emits the atomic element list — exception classes, symbols, language constructs, data structures — each carrying its τ anchor into the Reference Pack (C4). In BCF-Gemma the reference anchors are the harness README semantics + pinned Python reference; unanchored atoms are tagged *unverified*.

### 5.3 The Clean-Room composer — C6

`cleanroom_compose(spec, atoms, structures)` assembles candidate patches from anchored atoms and standard data structures only; it is structurally quarantined from the defective original (reads the original's *interface*, never its implementation body — clean-room engineering practice). Candidates re-enter P3 through the same Risk Gate. Purpose: break the copy-the-broken-pattern failure mode (the harness's own `edit_file` encourages transcription; small models do it more). In BCF-Gemma it is a skill script whose input window excludes the suspect implementation blocks; its output is emitted in a constrained patch format (H2).

## 6. Telemetry, reference, self-improvement

### 6.1 Fidelity Ladder — C3 ("highest necessary fidelity" made measurable)

| Tier | Content | Written when | Triage power | Cost |
|---|---|---|---|---|
| L0 decision ledger | one row per gate decision / phase transition / submission | always | reconstructs the run's decisions | ~100 B/row |
| L1 query ledger | every search query + result count + chosen candidate | always | reproduces localization | ~1 KB/turn |
| L2 tool transcript | full tool call/result pairs (harness `trace_*.json`) | always (harness-native) | reproduces behavior | ~10 KB/turn |
| L3 reasoning trace | thoughts channel | when thinking enabled | reproduces *why* | tokens of thought |
| L4 state dumps | periodic workspace + spec snapshots | on demand (escalations, post-mortems) | forensic | MBs |

Reconstruction test (C3's observable): a stranger rebuilds L0 from L2, and the decisions from L0 alone. **Placement rule (harness-specific):** the ledger lives outside `/workspace` (`/tmp`), because patch capture diffs all of `/workspace` including untracked files ([05-sources](05-sources.md) §3.6).

### 6.2 Reference Pack — C4

The complete developer reference for the substrate, LLM-friendly: chunked, anchored `(ref_id, version, locator)`, version-pinned. For BCF-Gemma: the harness contract (9 tools, budgets, sandbox rules), the model registry, and the pinned target-language reference. It re-pins on every wheelhouse/harness version bump — a stale source of truth is worse than none.

### 6.3 Improvement Loop — C7, where x′ ≻ x is earned

```text
run -> ledger (L0-L2) -> failure signatures -> RCA rows (post-mortem checkpoints)
    -> codebook/prompt/skill deltas
    -> promotion gate: held-out improvement + attempted refutation survived
    -> promoted into (a) skills/prompts  (b) codebook  (c) training data (LoRA)
    -> periodic revision & forgetting of stale entries (value of K is curated, not raw)
```

Three durable channels, ascending cost and permanence: context (nothing persists — the thing being improved), artifacts (skills/prompts/codebook — same-day, reversible), weights (LoRA — days, drop-adapter reversible). "Permanent improvement over the naive agent" means shifts in channels 2–3 only. The promotion gate is the honesty device that turns accumulation into value (§3.2).

## 7. Effort Governor — C8

Thinking level and sampling effort are policy variables. The governor is a table, not a model: cheap where mistakes are cheap, expensive where mistakes are irreversible. External constraints it prices: the session clock, per-task wall-clock and tool-call budgets, submission queues, and measurement noise.

| State (phase × budget) | Thinking budget | Rationale |
|---|---|---|
| P1 spec, task start | high (4,096) | errors here poison everything downstream |
| P2 localization queries | low | each query is cheap and reversible; speed wins |
| P3 first edit | medium | transcription from an anchored plan — bounded risk |
| P4 validation read | low | deterministic parse; no reasoning needed |
| Escalation / re-spec | high | the recovery decision is the run's most valuable |
| Budget < 20% remaining | floor + terse turns | guarantee a submitted patch; empty patch scores 0 |

Verified knobs for BCF-Gemma ([05-sources](05-sources.md) §3.8): `thinking_budget: 4096` with `include_thoughts: true` and `thinking_level` omitted (vLLM constraint); `max_output_tokens` ≈ 16,384 with incremental edits to avoid `<|tool_call>` truncation; budget sensor = free `get_status()` calls at P1/P3/P4 boundaries.

## 8. Hostile-substrate hardening (H1–H5) — normative for BCF-Gemma

The scorer runs a patched vLLM 0.19.1 with documented parser pathologies, and the harness has context-integrity hazards. A framework that ignores its substrate is not testable in it. These rules are part of the profile, not advice:

| Rule | Statement | Motivation (measured/observed) |
|---|---|---|
| H1 | Tool arguments must be scalar; never invoke `get_code_subgraph` (list parameter) as a first-line action | array-argument tool calls hang the scorer's tool parser (community-verified; C-5) |
| H2 | Critical edits go through a single-argument heredoc patcher via `run_command`; `edit_file` reserved for small, single-occurrence replacements | string-delimiter/backtick corruption in the edit path on the scorer |
| H3 | Reads are bounded and chunked (≤150 lines, target ≤80); the plan never depends on reading whole files | `read_file` truncates at 150 lines / 10k chars; truncation silently truncates conclusions |
| H4 | One root agent; the canonical spec and ledger live on disk outside `/workspace`, re-read at phase boundaries | sub-agent context loss and compaction events (14,336-token threshold) wipe in-context state; disk is the stable channel |
| H5 | Every turn ends with a tool call; budgets tracked via `get_status()`; re-plan under remaining-budget as first-class | 3 text-only turns end the session; tool-call budget is the scarcest resource |

## 9. Harness realization map (BCF-Gemma)

The submission is declarative YAML only — there is no custom tool API. Every BCF "tool call" is therefore realized as **a skill script invoked through `run_command`** (compact JSON output ≤5,000 chars), or as disciplined use of a built-in tool:

| BCF mechanism | Realization | Budget status |
|---|---|---|
| `decompose_atomic` | skill script (`skills/decompose/`) emitting anchored atom JSON | costs 1 tool call |
| `locate_lexical` | `run_command` with a `rg`-based skill script, ranked ≤20 candidates | 1–2 calls |
| `graph_narrow` / `graph_dfs` | built-in `get_code_neighbors` (scalar `node`, `edge_type`, `max_neighbors`) | 1 call per hop, fan-out ≤50 |
| `bisect_state` | `run_command` + git log/bisect skill script (history is fast-export-limited — bounded but legal) | log-scale calls |
| Risk Gate | skill script wrapping the edit decision; returns R0–R4 + ledger row | 1 call per gate (amortized into the edit call) |
| `cleanroom_compose` | skill script with suspect-block masking, emitting heredoc patch | 1–2 calls |
| Validation | `run_command` targeted pytest, then free `submit_patch()` | pytest calls + 0 |
| Budget sensor | free `get_status()` | 0 |
| Ledger | `run_command` append to `/tmp/bcf_ledger.jsonl` | piggybacked |

## 10. Testability — ablation ladder, metrics, statistics

| Rung | Configuration | Claim under test | Refuted if |
|---|---|---|---|
| A0 | minimal agent, no BCF | baseline | — |
| A1 | + P1 spec gate (C3/C4) | spec-first reduces wrong-class anchoring | fix-order errors not reduced on multi-bug stratum |
| A2 | + corrected localization suite (C5) | hybrid lexical+graph cuts localization turns ≥50% w/o PASS loss | PASS drops, or turns not cut (underpowered = declared honestly) |
| A2L | lexical-only vs lexical+graph variant | graph narrowing adds measurable value over BM25 alone | no delta beyond noise (then C5 keeps lexical-only) |
| A3 | + Risk Gate (C2/C1) | gating kills regressions and R4 waste | committed regressions > 0 or gate overhead exceeds savings |
| A4 | + Fidelity Ladder + external validation (C3/C1) | non-self verification reduces bad submissions | invalid-patch rate unchanged |
| A5 | + escalation + governor (C8/C1) | budget-aware recovery converts overruns into partial scores | overrun/submission rates worsen |
| A6 | + clean-room composer (C6) | quarantined composition reduces copy-bug recurrence | recurrence unchanged |
| A7 | + compliance-filtered LoRA (C7→weights) | durable weights add over best scaffold | held-out no-better (public E4B LoRA nulls currently suggest this) |
| A8 | BCF-E on E4B | the stack survives a ~4.5B-effective brain | collapse disproportionate to capability ratio |

Metrics (per task, from the ledger): total turns; wrong edits (edits absent from the final patch); fix-order errors; exploration turns; budget headroom at submission; committed regressions; R4 rejections; **recurrence-of-signature rate** (A2's direct observable). Statistics discipline: exact McNemar, Holm correction, Wilson intervals, frozen splits (pilot-8 / dev-30 / dev-99 / held-out-30 / pooled-129), ≥3 seeds where variance observed, and the measured noise floor respected (identical ZIPs differ by 2–3 tasks of 58; 1 task = 0.017) before believing any single-run delta.

## 11. The composition contract (machine-to-machine handoff)

The **BCF-Artifact envelope**: versioned, schema-checked bundle — (a) spec corpus, (b) L0/L1 ledgers, (c) taxonomy labels + codebook version, (d) prompt/skill deltas, (e) adapter cards (config + metrics; raw weights only when license-clean), (f) receipts (which numbers trace to which runs). A consumer machine validates schemas and provenance before promoting contents through its own §6.3 loop. Composition closure (§3.3) is the formal answer to "can x′ be handed to another machine": **yes, iff** the envelope is schema-valid, version-pinned, and license-clean.

## 12. Coherence audit v2.0

| Component | Status |
|---|---|
| A1/A3/C1/C2 (conservation + SPOC + risk gate) | coherent, mechanically enforceable, testable at rung A3 |
| C3/C4 (fidelity ladder + reference pack) | coherent, implementable today; cost model is the open design choice |
| C5 (search suite + decomposition) | coherent **after the C-1 correction**; hybrid doctrine is evidence-backed (§5.2); A2L rung tests it directly |
| C6 (clean-room) | coherent; quarantine is a skill-level constraint in this profile, not a sandbox guarantee — declared |
| C7 (RCA loop + promotion gate) | coherent; the promotion gate distinguishes it from ordinary logging; forgetting step makes V(K) honest |
| C8 (effort governor) | coherent; measured knobs exist (§7) |
| H1–H5 (hardening) | coherent; each rule traces to an observed scorer/harness pathology |
| A2 / x′ ≻ x | store-level guarantee (A2 axiom); performance-level claim is exactly what rungs A0–A8 measure (§3.2) |

*Companions: contest-fit verdict in [02-contest-fit-assessment.md](02-contest-fit-assessment.md); the concrete brain build is [03-bcf-brain-build-plan.md](03-bcf-brain-build-plan.md); the timeline is [04-submission-preparation-plan.md](04-submission-preparation-plan.md).*


---

<!-- ====================================================================== -->
<!-- FILE: 02-contest-fit-assessment.md -->
<!-- ====================================================================== -->

# Is BCF a Good Paper-Track Topic? — Contest-Fit Assessment (2026-11-08)

**Question:** given the audience and judging criteria of the Gemma 4 Developer Agent **Paper Track** (`gemma-4-developer-agent-paper`, closes **2026-11-12 23:59 UTC**), is the Batonic Coding Framework a good topic, and how should it be submitted?

**Verdict: YES — submit, with a mandatory reframing.** Not as "here is a coding philosophy" (scaffolding war stories score low with this panel), but as **a pre-registered, falsifiable framework measured against a real harness, with an evidence-backed localization result and a reusable artifact package**. BCF's shape — constitution + risk gate + monotone-accumulation guarantee + refutation-ready ablation ladder — is unusually well matched to the rubric's Verifiability and Novelty axes *if and only if* the sprint in [04-submission-preparation-plan.md](04-submission-preparation-plan.md) lands measured numbers before the deadline. Everything below is the evidence for that verdict.

---

## 1. The venue, precisely

| Fact | Value | Implication for BCF |
|---|---|---|
| Deadline | 2026-11-12 23:59 UTC — 4 days from now | sprint plan is day-level, not week-level |
| Format | Kaggle Writeup, 3,000 words max (references situation unresolved — keep ~300 words slack, U-5 in [05-sources](05-sources.md)) | every section must earn its words; figures/tables carry detail |
| Prizes | $15K Overall Best Paper / $10K Best New Resource / $10K Best New Application | **two entries allowed and worth having**: a methods entry and a resource entry |
| Judging | 5 criteria × 0–5, equal weight, final = mean; feedback never shared | optimize the weakest axis, not the strongest |
| Tie-break | earliest entry wins | stub-submit a real skeleton on day 0 |
| Limits | 5 writeups/day, at most 2 judged per team | 2 entries is the ceiling — no shotgun strategy |
| Independence | main-competition standing NOT required | the paper can stand on method + artifacts alone |
| Host hint | "submissions leveraging the accompanying released graph and embedding dataset are highly encouraged" | the C-1 localization correction turns BCF's search suite into exactly this lever |
| Field | 84 teams / 86 submissions at 2026-09-30; host: "quality over quantity" | a rigorous writeup has outsized odds |
| Non-archival | arXiv parallel allowed and encouraged | the writeup can seed a real first paper later |

## 2. Audience

The listed judge is Elan Markowitz (Google ML engineer); the track's own citation roster (Perozzi, Rózemberczski, Galkin — graph machine learning; Hemmati — SE research/testing) marks the reviewing circle ([05-sources](05-sources.md) §1.8). Practical reading:

1. **Graph/data-method content is a taste match**, not decoration. The graph-vs-lexical localization measurement (§3, criterion Relevance/Novelty) speaks the panel's language and consumes the host-encouraged dataset.
2. **SE rigor is the other half** (Hemmati side): pre-registration, ablations, refutation clauses, noise-floor statistics — BCF already carries these (spec v2 §10).
3. **Frameworks alone lose to results.** A pure constitution paper is judged as opinion. The framework must be presented as the *hypothesis* and the harness corpus as the *experiment*.

## 3. Criterion-by-criterion mapping

Self-assessment on the official 0–5 rubric. "Today" = writing only what already exists; "Sprint" = after the 4-day plan lands its minimum viable experiments (E1–E3, [04](04-submission-preparation-plan.md)). These are the author team's estimates, not judge scores.

| Criterion | What judges reward | BCF's asset | Gap today | Sprint action | Today | Sprint |
|---|---|---|---|---|---|---|
| Novelty | new insights; important properties of existing methods | SPOC risk-gate as a priced permission algorithm; monotone-store proposition + composition closure (spec v2 §3); measured scorer-pathology hardening H1–H5 | "scaffold" space is crowded (§4); novelty must be claimed at the *measured-properties* level | A2L rung (lexical vs hybrid vs graph-only on the competition graph data) + failure-signature recurrence curve | 2.5 | 3.5–4 |
| Quality | generalizes beyond this competition | lessons framed harness-independently; ablation ladder portable to any agent stack; H1–H5 generalize to "agents under hostile tool substrates" | needs at least one cross-harness or cross-model replication to claim generality | BCF-E (E4B) mini-rung if time allows; else state generality as scope + limitation | 2.5 | 3 |
| Relevance | significance for SE and agentic learning | small-model SWE agents on everyday hardware = the competition's mission; localization evidence; conservation vs regression failure mode | must connect to the experience-driven-agents literature (§4) explicitly | add related-work paragraph positioning BCF vs ExpeL/Reflexion/Voyager/ARISE | 3 | 3.5–4 |
| Verifiability | enough detail to understand and reproduce; how data was obtained | pre-registered ladder + refutation clauses; ledger/envelope artifacts; noise-floor stats (σ≈2 tasks); dead-task mask; 129-task corpus audit | **"measured" section currently has planned, not obtained, numbers** | run E1/E2; publish exact seeds, task IDs, configs; keep every constructed label honestly marked | 2 | 3.5–4.5 |
| Clarity | clear presentation | strong template fit; tables; strict measured-vs-constructed labeling | word budget discipline under 3,000 | follow the §3 word plan in [04](04-submission-preparation-plan.md); one-page opening with real numbers | 3.5 | 4 |

**Read:** the binding constraints are Verifiability and Novelty — exactly the two axes the 4-day sprint can move. That is why the verdict is "yes, if you measure."

## 4. Novelty landscape — what BCF may and may not claim

Counter-evidence first. The 2024–2026 scaffold literature already covers much of the vocabulary BCF uses:

| Existing work | Overlap with BCF | What remains for BCF |
|---|---|---|
| SWE-agent (ACI design), Agentless (rigid pipeline), AutoCodeRover (AST/SBFL), SpecRover, CodeR | localization→repair→validate decomposition; search/edit tool design | none of these prices *permission to mutate* by risk class; none carries a conservation axiom with rollback-to-verified-state as an invariant |
| ARISE (arXiv 2605.03117) | repository graphs with data-flow edges for localization (+17pp function recall) | BCF does not own "graphs help" — it owns the measured *ranking* of lexical vs graph seeding on this competition's shipped data (the C-1 correction) |
| Experience-driven agents: Reflexion, ExpeL, Voyager, ERL, EvolveR; lifecycle surveys | accumulate lessons/skills; self-improvement loops | BCF's contribution is the **conservation + gate + grounding** triple and the store-value formalization (A2, composition closure) with refutation clauses — not "first self-improving agent" |
| SWE-Gym / LoRA fine-tuning work | weight-level improvement channels | BCF prices the three improvement channels (context/artifacts/weights) and reports the public LoRA nulls as evidence for the channel-cost claim |
| Competition-internal community work (issue-localization benchmark, graph-retrieval benchmark, loop-breaker benchmarks) | localization measurements on the same corpus | BCF integrates them as external evidence (properly cited) and adds the agent-level consequence: turn savings and PASS parity under budget |

**Legitimate novelty claims:** (1) a constitution whose every article has a mechanism, a test rung, and a refutation clause; (2) the SPOC risk gate as a deterministic, ledgered permission algorithm; (3) the monotone-store/handoff formalization (store-level guarantee + performance-level measurable) applied to a code-repair agent; (4) the H1–H5 hostile-substrate hardening set derived from scorer pathologies; (5) A2L localization ranking on the shipped competition graphs. **Claims to avoid:** "first framework for reliable coding agents", "graph-first localization", "proven x′ ≻ x performance" until the recurrence curve exists.

## 5. Which entry, which prize

| Entry | Content core | Target prize | Why |
|---|---|---|---|
| **Entry A (primary): methods/measurement paper** | BCF constitution → pre-registered ladder → E1 (A0 vs BCF scaffold) + E2 (A2L localization ranking) + failure-signature recurrence → hardening H1–H5 | Overall Best Paper ($15K) | the rubric's Novelty/Verifiability axes are exactly a pre-registered measured framework |
| **Entry B (secondary): resource paper** | the BCF-Artifact envelope: 129-task stratified corpus audit + calibrated local sandbox recipe (gold control ≥127/129, dead-task mask, noise model) + ledger/codebook formats + taxonomy | Best New Resource ($10K) | reproducible, license-clean, panel-aligned (graphs!); strongest odds of *a* win if Entry A's numbers stay thin |

Both fit under the 2-judged cap; do not attempt more. If only one can be finished, finish Entry A **with Entry B's artifacts cited inside it** — the artifacts are what rescue Verifiability.

## 6. Risk register

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | No measured numbers land in 4 days → constructed-only paper | medium | fatal for Verifiability (axis caps at ~2) | E2 is CPU-cheap from traces and can land even if GPU time fails; E1 minimal = 8 tasks × 3 seeds paired; publish what lands, label what doesn't |
| R2 | Writeup platform bug (save/submit 404) blocks submission | low–medium (unresolved since Sep) | fatal | stub-submit day 0; if blocked, document attempts and use the day-5 window (5/day limit) |
| R3 | Judge scores the paper as "just a scaffold" | medium | caps Novelty/Quality | §4 positioning; lead with the measured result, not the constitution |
| R4 | Citing constructed numbers as measured (integrity failure) | self-inflicted | disqualification-grade | strict labeling protocol (spec v2 §1); one honesty gate per day in [04](04-submission-preparation-plan.md) |
| R5 | Novelty challenged by community benchmarks already on the corpus | medium | novelty cap | cite them as external evidence; own the *agent-level* consequence and the ranking under budget — do not re-derive their numbers |
| R6 | E1 result is null (BCF scaffold ≈ baseline on 8 tasks) | medium | headline weakens | null results are still Novelty ("pre-registered framework refuted at rung X on small-model substrate") — the ladder's refutation clauses make a null publishable; report honestly |
| R7 | Noise misread as signal (σ≈2 tasks) | high if uncontrolled | Verifiability damage | paired seeds, McNemar, ≥3 seeds, noise floor stated in the paper |
| R8 | Word overflow past 3,000 | medium | rejection-grade format failure | word budget table ([04](04-submission-preparation-plan.md) §3); final trim pass mandatory |

## 7. Decision gates

| Gate | Date (UTC) | Decision | If failed |
|---|---|---|---|
| G0: stub writeup created + saved + submitted | 2026-11-08 | tie-break slot + platform bug check | escalate to host thread immediately; keep trying daily |
| G1: E2 (localization ranking) computed from traces | 2026-11-09 | headline result secured (CPU-cheap) | fall back to citing the community benchmark numbers as external evidence |
| G2: E1 minimal (8-task paired pilot, ≥3 seeds) start-to-finish | 2026-11-10 | framework-vs-baseline delta exists | publish Entry A without the delta as a "protocol + measurement-of-conditions" paper; pivot weight to Entry B |
| G3: draft complete with measured/constructed labels audited | 2026-11-11 | Entry A uploadable | slip to Entry B as primary |
| G4: both entries final-submitted | 2026-11-12 (early UTC) | done | nothing after 23:59 UTC counts |

## 8. The honest limitations paragraph (keep in the paper)

Judge-proofing is done in the paper's own words: (1) the framework's store-level guarantee is architectural; its performance-level claim is measured only on one harness and one model family; (2) the pilot is small — power is stated, not implied; (3) H1–H5 encode *this* scorer's pathologies — the general lesson ("price the substrate's failure modes as first-class constraints") transfers, the specific rules may not; (4) community localization numbers are cited as external evidence with their own provenance.

---

*Companions: the formalization [01-bcf-formal-specification-v2.md](01-bcf-formal-specification-v2.md) · the brain build [03-bcf-brain-build-plan.md](03-bcf-brain-build-plan.md) · the sprint and submission timeline [04-submission-preparation-plan.md](04-submission-preparation-plan.md)*


---

<!-- ====================================================================== -->
<!-- FILE: 05-sources.md -->
<!-- ====================================================================== -->

# Source Ledger — BCF Formalization & Contest Submission Package (2026-11-08)

**Confidence labels:** `P` = primary (official page/doc/capture or the artifact itself) · `S` = secondary (community dataset, blog, aggregator) · `I` = inferred/derived in this package · `M` = carried from a prior local deliverable (re-checked where load-bearing).

## 1. Competition facts (paper track)

| # | Fact | Value used | Source | Conf |
|---|---|---|---|---|
| 1.1 | Paper track is a separate competition from the main event | `gemma-4-developer-agent-paper` | local capture `input/kagglecomp/scratch/html/Google - The Gemma 4 Developer Agent Competition _ Kaggle-01-Overview.html` (paper-track section) + `intel_20260930/04-paper-track-intel.md` | P |
| 1.2 | Deadline | 2026-11-12 11:59 PM UTC | Overview capture ("Submissions must be made by November 12, 2026 at 11:59PM UTC") + web cross-check 2026-11-08 (two independent aggregates agree) | P |
| 1.3 | Format / cap | Kaggle Writeup, 3,000 words max | `intel_20260930/04-paper-track-intel.md` (verified 2026-09-30) + web cross-check 2026-11-08 | P |
| 1.4 | Prizes | $15K Overall Best Paper / $10K Best New Resource / $10K Best New Application ($35K total) | `intel_20260930/04-paper-track-intel.md` + web cross-check 2026-11-08 | P |
| 1.5 | Judging | 5 criteria, 0–5 each, equal weight, final = mean: Novelty, Quality, Relevance, Verifiability, Clarity; rubric feedback never shared | `intel_20260930/04-paper-track-intel.md` + `2026-11-05_executive_summary_discussion_threads.md` + web cross-check 2026-11-08 | P |
| 1.6 | Entry limits | 5 writeups/day; at most 2 judged per team; tie-break = earliest entry; un-submitted drafts not judged | `intel_20260930/04-paper-track-intel.md` (host Q&A) | P |
| 1.7 | Graph/embedding data | "Submissions leveraging the accompanying released graph and embedding dataset are highly encouraged, but not a requirement" | Overview capture, paper-track Prizes/Call-for-papers section | P |
| 1.8 | Judge/organizer signal | Elan Markowitz (listed judge); citation author roster incl. Perozzi, Rózemberczki, Galkin (graph ML) and Hemmati (SE/testing) | `intel_20260930/04-paper-track-intel.md` §6 | S |
| 1.9 | Non-archival | Parallel arXiv/venue submission allowed and encouraged | `intel_20260930/04-paper-track-intel.md` (host answer) | P |
| 1.10 | Field size | 84 teams / 86 submissions as of 2026-09-30 ("quality over quantity" host remark) | `intel_20260930/04-paper-track-intel.md` §1 | P |
| 1.11 | Main-comp participation required for paper track | No | `intel_20260930/04-paper-track-intel.md` §1 + web cross-check | P |

## 2. Competition facts (main + bonus track)

| # | Fact | Value used | Source | Conf |
|---|---|---|---|---|
| 2.1 | Main deadlines | Entry/team merger 2026-11-25; final submission 2026-12-02 11:59 PM UTC | Overview capture timeline ("Merger & Entry" phase) + `2026-11-05_executive_summary_discussion_threads.md` | P |
| 2.2 | Evaluation | 12-hour total runtime for all hidden tasks; resolution rate = resolved/total; Phase-2 verification in clean container B | `kagglecomp_data_package/HARNESS_README.md` §4, §8 + Overview capture | P |
| 2.3 | Model rule | Single base model per submission; competition alias `gemma-4-31b-it-qat-w4a16-ct` in `ALLOWED_MODEL_NAMES` (staff thread 748287 later added E-series aliases — see corrections C-3) | HARNESS_README §3.2 + `intel_20261031/00-intel-brief-2026-10-31.md` | P |
| 2.4 | Bonus prize | $10K for highest-ranking private-set E2B/E4B submission; must occupy one of two final slots; all agents same base model; cross-eligible | staff thread 751104 via `intel_20261031/00-intel-brief-2026-10-31.md` + web cross-check 2026-11-08 | P |
| 2.5 | Submission mechanics | 1 submission/day; up to 2 final submissions judged | OfficialRules capture (`scratch/html/...04-OfficialRules.html`) | P |
| 2.6 | Leaderboard state | 4,808 teams; 90.99% at 0.00; top 0.29 (2026-11-05); median nonzero 0.03–0.06 | `2026-11-05_executive_summary_discussion_threads.md` + `intel_20261105/raw_json/leaderboard_public.json` | P |
| 2.7 | Scoring noise | identical ZIP scores 7–13 of 58; run-to-run sd ≈ 2–3 tasks; 1 task = 0.017 | threads 750521/754295/751596 via intel briefs | P |
| 2.8 | Dead/unsolvable tasks | 11 masked-unsolvable of 58 public; 129/129 `hints` empty; 0/129 gold patches touch tests | threads 755554/754586 + `input/kagglecomp/2026-11-05_executive_summary_discussion_threads.md` + tasks.jsonl audit | P |

## 3. Harness contract (source of truth for the BCF brain)

| # | Fact | Value used | Source | Conf |
|---|---|---|---|---|
| 3.1 | Submission is declarative YAML only | `agent.yaml` + optional `eval_config.yaml`, `configs/`, `prompts/`, `sub_agents/`, `adapters/`, `skills/` | HARNESS_README §2.2 | P |
| 3.2 | Nine built-in tools | `run_command`, `submit_patch`, `get_status`, `read_file`, `edit_file`, `write_file`, `get_code_neighbors`, `search_similar_code`, `get_code_subgraph` | HARNESS_README §6 | P |
| 3.3 | Free tools | `submit_patch` and `get_status` do not consume the tool-call budget | HARNESS_README §6.1 (`count_tool_call=False`) | P |
| 3.4 | Read limits | `read_file` truncated at 150 lines AND 10,000 chars; command output at 5,000 chars | HARNESS_README §5.2, §6 | P |
| 3.5 | Anti-tamper | agent-touched test/config files force-reset to baseline before `test_patch` is applied | HARNESS_README §8.2 | P |
| 3.6 | Patch capture | `git add -N . && git diff HEAD` — untracked scratch files in `/workspace` leak into the patch | HARNESS_README §8.1 + best-practice 3 | P |
| 3.7 | Context management | ADK EventsCompactionConfig (threshold 14,336 tokens, interval 5, retention 5) configured by the harness | HARNESS_README §7.2 | P |
| 3.8 | Generation knobs | `thinking_config.thinking_budget` 0–32,768 (default 4,096); `max_output_tokens` 1–32,768; `thinking_level` omitted on vLLM | HARNESS_README §2.4 | P |
| 3.9 | Budgets | per-task `max_time_minutes` 60, `max_tool_calls` 100, `max_turns` 500 defaults; overridable in `eval_config.yaml` | HARNESS_README §7.1 | P |
| 3.10 | Nudge protocol | 3 consecutive text-only turns end the session; every turn must carry a tool call | HARNESS_README §5.3 | P |
| 3.11 | Scoring sandbox | 4× NVIDIA L4, vLLM TP=4, `max_model_len=32768`, `tool_call_parser="gemma4"` | HARNESS_README §3.1 | P |

## 4. Localization evidence (the C5 correction)

| # | Fact | Value used | Source | Conf |
|---|---|---|---|---|
| 4.1 | Competition ships code graphs + 256-dim node embeddings | `data/graphs/<repo>.json`, `data/embeddings/<repo>.npz` | HARNESS_README §6.3 + Overview/Data captures | P |
| 4.2 | Embeddings near-uniform | mean pairwise cosine 0.80, p90 0.99, p99 1.00 (400 sampled nodes) | `HIMANSHUKUMARJHA/gemma4-graph-retrieval-benchmark` dataset card (scraped 2026-11-08) | S |
| 4.3 | Lexical beats graph-only | BM25 file-level R@1 22.5% / R@10 55.8% / R@20 69.0%; best graph-node method 53.3% R@20 (function level) | same dataset card (scraped 2026-11-08) | S |
| 4.4 | Graph best as narrowing step | +5.6 pts R@20 from 1-hop call-graph expansion after lexical seeding; 96.3% gold functions present as graph nodes | same dataset card (scraped 2026-11-08) | S |
| 4.5 | Recommended recipe | Stage 1 lexical (`rg -l`/BM25, 1–2 calls) → Stage 2 `get_code_neighbors`/`get_code_subgraph` narrowing → bounded `read_file` | same dataset card + `kuzija/gemma4-issue-localization-benchmark` (via search) | S |
| 4.6 | Data-flow graphs help localization | ARISE: +17.0 pp Function R@1, +15.0 pp Line R@1, +4.7 pp Pass@1 vs SWE-agent baseline (SWE-bench Lite, Qwen2.5-Coder-32B) | arXiv 2605.03117 (multiple concordant mirrors, 2026-05) | S |

## 5. Prior-art landscape (novelty positioning)

| # | Fact | Value used | Source | Conf |
|---|---|---|---|---|
| 5.1 | Scaffold sensitivity | SWE-agent ACI results; Agentless pipeline; AutoCodeRover AST/SBFL; SpecRover; CodeR multi-agent | arXiv 2405.15793 / 2407.01489 / 2404.05427 / 2408.02232 / 2406.01304 (IDs transcribed from `bcf-whitepaper-v3-2026-09-29` reference list; spot-checked against web) | S |
| 5.2 | Experience-driven agents paradigm | precedent/lesson/procedure hierarchy; 8-stage lifecycle (Acquisition→Distribution); ExpeL, Reflexion, Voyager, ERL, EvolveR | survey arXiv 2608.03392 + `awesome-experience-driven-agents` + arXiv 2510.16079 (via search 2026-11-08) | S |
| 5.3 | Weight-level improvement cost | SWE-Gym ~500 trajectories for trainable gains; public E4B LoRA nulls (Cygnify); Munal Singh A1–A3 SFT nulls | arXiv 2412.21139 + thread 751596 via intel brief | S |
| 5.4 | Kaggle writeup judging practice | opening-90-seconds triage, coherence, sensitivity analysis, documented failed attempts, reproducibility artifacts | Kaggle solution-write-up docs + judging practice articles (search 2026-11-08) | S |

## 6. Local corpus (prior deliverables re-used, not re-derived)

| # | Artifact | Used for | Conf |
|---|---|---|---|
| 6.1 | `deliverables/2026-10-31-bcf-gemma4-whitepaper-bonus/01-bcf-formal-specification.md` | base formalization (v1.0) being superseded by 01 of this package | M |
| 6.2 | `deliverables/2026-10-31-bcf-gemma4-whitepaper-bonus/02-kaggle-whitepaper-draft.md` | the 1,937-word draft this package's sprint plan builds on | M |
| 6.3 | `deliverables/2026-10-31-bcf-gemma4-whitepaper-bonus/03/04/05` | E2B/E4B fact base, bonus plan, beginner guide | M |
| 6.4 | `deliverables/2026-11-05_Gemma4_Problem_Dataset_Taxonomy_and_Analysis/` | 129-task corpus statistics | M |
| 6.5 | `deliverables/2026-11-05_Gemma4_Representative_Issues_Compendium_and_Deep_Research/` | failure-mode taxonomy (F1–F12), workload model, masked-task findings | M |
| 6.6 | `deliverables/2026-10-31-rtx5090-local-testing-guide/` | local experiment capability (28-task panel, gold control ≥127/129, A0–A5 ladder, packaging asserts) | M |
| 6.7 | `input/kagglecomp/2026-11-05_executive_summary_discussion_threads.md` + `intel_2026*/` | harness-quirk intelligence (parser hangs, backtick drop, compaction wipes, nondeterminism) | M |

## 7. Corrections register (things this package fixes)

| # | Correction | Was | Now | Evidence |
|---|---|---|---|---|
| C-1 | Localization doctrine | "graph-first: a graph query beats text search" (whitepaper draft §2, spec v1.0 §5.2) | two-stage: lexical seed (1–2 calls) → graph narrowing (`get_code_neighbors`) → bounded reads; `search_similar_code` only for symbol-name queries | §4.2–4.5 |
| C-2 | Judging criteria names | draft 02 §B listed "Rigor / Reproducibility" | official five are **Novelty, Quality, Relevance, Verifiability, Clarity** | §1.5 |
| C-3 | Allowed models | HARNESS_README §3.2 `ALLOWED_MODEL_NAMES` = 31B only (stale) | staff thread 748287 opened E-series/12B aliases; verify alias at submission time | §2.3, §2.4 |
| C-4 | Value claim | "x′ is asymptotically greater than x" stated as slogan/goal | stated as monotone-store proposition + recurrence-rate observable + composition-closure envelope; V-monotonicity requires the promotion gate (raw accumulation only grows the store, not its value) | 01 §3 |
| C-5 | Array-arg tools | spec v1.0 planned `graph_bfs`/`graph_dfs` over `get_code_subgraph(nodes: list)` | `get_code_subgraph` carries a list parameter — banned from first-line use under H1 (community array-arg hang on scorer's patched vLLM 0.19.1); use `get_code_neighbors` (scalar args) | §3.2 + RTX guide caveats |

## 8. Unresolved / re-verify before submission

| # | Item | Status | Action |
|---|---|---|---|
| U-1 | Writeup save/submit 404 bug (`CheckHackathonWriteupConflict`) | open at 2026-09-30 snapshot; status since unknown | create + save + submit a stub writeup on day 0 (also earns the earliest-entry tie-break) |
| U-2 | arXiv IDs of citations [4][5][6][10] in the draft | transcribed from v3 reference list | spot-check before final upload |
| U-3 | Host-promised daily small-model leaderboard notebook | unlocated at 2026-11-05 | check the paper-track Code tab before finalizing bonus-target numbers |
| U-4 | Exact wording of the "graph and embedding dataset" encouragement on the live paper-track page | from Overview capture (2026-09-29) | quote from live page in the final writeup if cited |
| U-5 | Whether the 3,000-word cap counts references | unknown | design word budget with ~300 words of slack either way |

