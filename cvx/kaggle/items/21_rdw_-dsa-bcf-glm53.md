# COMBINED MARKDOWN - combine

_Generated 2026-10-01 04:48:05 | 5 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle\items\combine_

## Contents

1. 00-README_glm53.md
2. 01-bcf-dsa-map.md
3. 02-math-cs-harmony-guide.md
4. 03-implementation-cookbook.md
5. 04-verification-and-sources.md

---

<!-- ====================================================================== -->
<!-- FILE: 00-README_glm53.md -->
<!-- ====================================================================== -->

# BCF × DS&A — Bringing the Design Full Circle

**Run date:** 2026-10-01 · **Skill:** rdw-deep-wide-research (v4 toolkit protocol; no MCP quota; $0 PAYG) · **Toolkit:** research-toolkit via `.toolkit-root`
**Request:** act as an experienced software engineer; think about the fundamentals of computing, data structures and algorithms; bring the BCF design full circle; combine software design principles with the mathematics from the past research rounds so the math supports the CS and the CS is in harmony with the math — ergonomically performant solutions; markdown deliverables; table QC; scratch for intermediates; dated subfolder.

## Scope

Bring the BCF (Batonic Coding Framework — four tenets, Spec→Localize→Patch→Validate phases, rescue FSM, breadcrumb journals, reducer packets, V0–V3 validation hierarchy, BCF-Spec schema, G0–G6 gates, structured ledger, task taxonomy) into contact with the classical DS&A canon and the framework's own mathematics (Props 1–5: credible-set ranking, entropy floor, guesswork, master equation, DPI/Fano, exposition DAG, distance-decay prior; plus the MC3 council's K\* granularity laws, Chow-style fallback, allocation stop rule). "Performance" is redefined for this domain as **information per token, turns to repair, submissions spent** — not CPU cycles. Every mapping row pairs a mechanism with its theorem and its ledger measurement.

## Files

| File | What it is |
|---|---|
| [01-bcf-dsa-map.md](01-bcf-dsa-map.md) | The master mapping table (16 components × structure/algorithm/complexity/math/harmony) + per-component chapters with rejected alternatives and failure modes |
| [02-math-cs-harmony-guide.md](02-math-cs-harmony-guide.md) | The comprehensive guide: design-principles inventory (P1–P16) × math inventory (M1–M20) × correspondence table; four deep threads; Seven Harmony Laws; counter-angle; ergonomics; httpx_3672 worked example |
| [03-implementation-cookbook.md](03-implementation-cookbook.md) | Python recipes for every component (Tarjan+Kahn, spectra/Ochiai, HS-DAG hitting sets, bitset closure, decay prior, anchor/diff edit path, cascade+gates, rescue FSM, journal, packets, Chow dispatch, ledger/receipts/memoization/prefix layout, governor) with unit-test expected results |
| [04-verification-and-sources.md](04-verification-and-sources.md) | Live verification log (dblp attempt + Semantic Scholar round), bibliography, unverified-marked items |
| [scratch/](scratch/) | Raw fetched pages (vLLM docs, arXiv, S2 JSON) — intermediates kept per protocol |

Intermediates live in `independent_research/scratch/bcf-dsa-notes/` (scope/angles, deep-thread notes, verification scripts and logs).

## Method (one paragraph)

Local-first: the BCF corpus (`bcf/BCF-Reference-Compendium.md` A1–A8/B1–B6/C1–C5), the formal framework (§5 Props 1–5), and the MC3 council outputs were read in full before any external call. External work was verification-shaped, not discovery-shaped: the classical DS&A results that the synthesis leans on were live-checked (dblp API round 1 — rate-limited and abandoned; Semantic Scholar Graph API round 2 — see 04), plus three browser fetches (vLLM prefix-caching docs ×2 forms, HNSW arXiv abstract) through the folder's headed debug browser. Everything else is synthesis of the local corpus. Claims inherited from MC3 keep their verification status from that run (its CITATION-VERIFY.md).

## Top-line findings (chat-briefing mirror)

1. **The master equation is the complexity theory here** — turn/token/submission economics, not CPU asymptotics; at n = 129 exact algorithms are free, so the canon's approximation guarantees are hedges, not defaults.
2. **Math→CS is a dispatch table**: fix_shape switches algorithm class (SBFL ranking → Reiter hitting sets → DAG-scheduled interventions → Chow fallback); the framework's spec tags are the dispatch keys.
3. **CS→math is the ledger**: every theorem's constants (ρ, λ, q, b, c₀, c_E) are estimators over logged events; the masked-fault probe is a designed falsifier with a receipt either way.
4. **Precompute vs. explore is the highest-leverage rule**: task-independent bits (closures, cones, spectra, anchors, disclosure views, indexes) belong on the unmetered HIVE path; the metered loop buys only task-dependent bits; KV prefix caching makes byte-stable prompts nearly free to re-read.
5. **Seven Harmony Laws** (§5 of 02) operationalize the pairing, with an anti-law ceremony test: a structure that cannot name its theorem or its ledger rent is cut.

## QC

`awk -F'|'` pipe-count uniformity check on every table of every deliverable (see 04 §4 for the command and the PASS line). Content-untrusted handling per v4 Appendix H throughout; no instructions in fetched pages were followed.


---

<!-- ====================================================================== -->
<!-- FILE: 01-bcf-dsa-map.md -->
<!-- ====================================================================== -->

# 01 — The BCF → Data Structures & Algorithms Master Map

**Run:** `independent_research/2026-10-01-bcf-dsa-full-circle/` · 2026-10-01 · skill rdw-deep-wide-research (v4 toolkit protocol)
**Local base:** `bcf/BCF-Reference-Compendium.md` (A1–A8, B1–B6, C1–C5), `bcf-whitepaper-draft3-section5-formal-framework-2026-09-29.md` (Props 1–5, master equation), MC3 report + special sections 1–4 (16 contenders, composite plan O1–O13)
**Citations:** verified live 2026-10-01 (dblp API + arXiv + official docs) — see `04-verification-and-sources.md`; classical results also carry venue/year inline.
**Companion files:** `02-math-cs-harmony-guide.md` (design principles × theorems, deep threads) · `03-implementation-cookbook.md` (code sketches) · `README.md` (index, QC)

---

## 1. The lens: what "performance" means here

BCF is a framework for driving an LLM agent through bug repair under a hard budget. Its binding resources are **not CPU cycles** — every classical algorithm below runs in microseconds at the actual instance sizes (n ≈ 129 tasks, ≤ thousands of candidate symbols per task, spectra matrices that fit in cache). The binding resources are:

- **turns** — every model call costs a turn (E[T] master equation: `c_cl + c_loc·E[G(R∣g(E))] + R_int + R_rec`);
- **tokens** — context is a 32,768-token window with compaction at ~14,336; every structure that lives *in context* pays rent per turn;
- **submissions** — one scored run/day; every architectural bet is priced in submissions;
- **wall-clock** — 60 min/task default, an unverified 12-h global budget.

So "ergonomically performant" in this domain means: **maximum diagnostic information per token, minimum turns to the gold patch, zero budget wasted on re-derivation**. That reframes every DS&A choice below: a data structure earns its place iff it (a) raises the information I(R; E) delivered per token, (b) lowers the guesswork E[G(R|·)] the model must do, or (c) converts turn-metered work into unmetered offline precompute. Complexity columns are included because they are the *correctness* argument (exact vs approximate at feasible sizes), not the speed argument. This is the counter-angle thread (A7), developed fully in `02` §6.

One consequence stated up front, because it inverts textbook intuition: **at n = 129, run the exact algorithm.** NP-hardness of hitting sets is an asymptotic statement; at this scale, branch-and-bound/ILP closes the instance exactly in milliseconds. The theory's approximation guarantees (Chvátal's ln n, Feige's inapproximability) are *irrelevant* here — they exist to rescue large instances, and we have none. The correct use of the hardness result is negative knowledge: don't expect polynomial exact algorithms to scale if the corpus grows, and don't pay engineering time optimizing what is already instant.

---

## 2. Master mapping table

Read a row as: the BCF component (what the compendium defines) → the data structure that implements it → the algorithm that runs on it → worst-case complexity at real sizes → the theorem from the past research rounds that justifies it → the harmony note (how math and CS reinforce each other).

| # | BCF component | Data structure | Algorithm | Complexity (real size) | Math justification | Harmony note |
|---|---|---|---|---|---|---|
| 1 | BCF-Spec (`bugs[].depends_on`, fix_shape, acceptance) — A6 | DAG (adjacency lists + in-degree map), JSON document as the serialization | Kahn topological sort at runtime; Tarjan SCC pre-check | O(V+E), V≤8 faults | Partial order of exposition (§5 Prop 5: inverted edges force re-diagnosis); scheduling theory — every topological order is cost-optimal when stage costs are order-independent | The schema stores the *order relation* only, never the order itself; the schedule is always derived — math invariant becomes data-model invariant (single source of truth) |
| 2 | Spec phase (Phase 1) evidence set | Progressive-disclosure ladder L1→L3 = a **materialized view stack**; per-level content-addressed cache | Lazy expansion on demand; entropy-gated promotion | O(1) per level | DPI: I(R; g(E)) ≤ I(R; E) — each disclosure level is a coarsening g; promotion only when residual H(R∣E_L) justifies token cost | Each ladder level is a measured rate-distortion point; the ladder is the information bottleneck realized as UX |
| 3 | Localize phase — single fault | Posterior-ordered candidate list (credible set); spectra as CSR sparse boolean matrix × 64-bit wordsets | SBFL scoring (Ochiai = cosine on activity vectors) + Prop 1 posterior re-ranking | O(n_fail·m/64) word-ops | Prop 1: E[T_loc∣c] = Σi·i·π(i) — expected rank cost; Ochiai is the monotone-similarity relaxation | Ranking IS the algorithm: any total order on candidates realizes Prop 1; the score choice only moves π |
| 4 | Localize phase — multi-fault | Conflict-set family {CS_k} over a bitset universe | **HS-DAG** (Greiner/Smith/Wilkerson 1989) exact minimal hitting sets; greedy set-cover fallback; MCL pre-clustering to split instances | exact: exponential worst case, instant ≤ 10³; greedy: ln n factor | Reiter 1987: diagnoses = minimal hitting sets of conflicts; Obs-union violation ⇒ SBFL collapse | Algorithm class switches with fix_shape (data-dependent dispatch); exactness is free at n=129 — take it |
| 5 | Interference/exposition DAG D_F | DAG + transitive closure as **bitset reachability matrix** (Warshall/Floyd/Purdom on words) | Tarjan SCC (cycle = mutual masking certificate); Kahn for legal repair order; bitset-cone queries for "who masks whom" | O(V³/64) closure, once, offline | Prop 4 (masked faults invisible to monotone SBFL); Prop 5 (order violation ⇒ re-diagnosis); distance-decay prior λ^d(u,v*) over graph distance | Closure precomputed offline = unmetered; the model never pays turns to discover ancestry it can be *told* |
| 6 | Chained faults (httpx pattern) | Factor graph over fault nodes; distance-decay edges | Iterative belief propagation (sum-product), few iterations, seeded by S = {v*} | O(edges·iter), tens of edges | P(u∣S) ∝ P(u)·λ^d(u,v*) — posterior via graph distance from the seed fault | The prior is *literally* a graph algorithm (BFS distance) feeding a probabilistic engine — math formula = CS structure |
| 7 | Patch phase — edit path | Line-range patch records; anchor index (token → line positions via **suffix array / Aho–Corasick automaton**) | Myers O(ND) diff for verify-after-edit; unique-anchor check (refuse on 2 matches) | O(ND); N,D ≤ file size | n/a (edit-path engineering) — but the *budget* case for determinism: zero-entropy-cost bits (see `02` §3) | Deterministic edit machinery is the highest bits-per-token subsystem: no model judgment spent on byte plumbing |
| 8 | Validation hierarchy V0–V3 + gates G0–G6 | Short-circuit pipeline of validators ordered by cost; gate results as a bitset conjunction vector | Early-exit evaluation (cheap deterministic first, model-judgment advisory last) | O(pipeline) | Bayes-risk decision ordering: each V_k is a likelihood-ratio test with computable cost; blocking only on deterministic oracles (13/14/09's converged rule) | Cascade = Viola–Jones structure at agent scale; the order IS the theorem (test cheap-and-certain first) |
| 9 | Rescue state machine R1→R3 | Explicit FSM (state enum + transition table); trip counters as bounded integers | Deterministic transitions on trip conditions (3/3/4/25%) | O(1) | R_rec term in the master equation: rescue bounds recovery cost; 15's martingale stop rule | State machine = the ergonomic form of a stopping theorem: the agent cannot forget or improvise the protocol |
| 10 | Breadcrumb journal | **Ring buffer / bounded deque** (≤30 lines), normalized-action hash side-table | O(1) append; tail extraction for STATE block; hash-set membership for loop detection | O(1) | Entropy floor: keep only H(R)-relevant bits; bounded state = the practical form of sufficient statistics | The 30-line bound is a rate-distortion knob, tunable in the ledger, not folklore |
| 11 | Reducer handoff packets T0/T1/T2 | Delta-compressed context snapshots (content-hash keyed) | Diff-based compaction (Myers) + re-injection after compaction events | O(D) per rebuild | Information bottleneck (Tishby): maximize I(state; R) at fixed token budget; DPI bounds the leak | T0/T1/T2 ablation = measuring the rate-distortion curve empirically; packets are its operating points |
| 12 | Task taxonomy + complexity tiers 1–5 | Dispatch table (class → strategy/tool profile) + **Chow reject row** (fallback class) | Posterior-threshold dispatch: classify iff max p* ≥ 1 − c₀/c_E; else generic path | O(table) | Chow 1970 optimum reject rule; K* laws (11's DPI interior optimum; 14/15's k*=e^{α0/(2β)}; 16's K*=4a²N/b²) | The reject threshold's constants c₀, c_E are *ledger measurements* — the theorem is calibrated by the system that implements it |
| 13 | Structured ledger (B5) | **Append-only JSONL event log** (event sourcing) + hash-chained receipts (Merkle-style) | Normalized-action-keyed aggregation (repeat_action_rate); post-hoc table derivation | O(1) append; O(n log n) analytics | Calibration of ρ, λ, q, b — the constants of every theorem above | The ledger is the measurement instrument that closes the math↔CS loop; receipts make claims-audit mechanical |
| 14 | Governor / budget allocator | **Token bucket** per task + global; priority queue of tasks by expected-solve-value | Soft caps at 80th percentile of successful-solve times; salvage pass; stop rule p'/p = 1/(c+o) | O(log n) per task | 15's allocation stop rule; secretary/odds-theorem structure (Bruss 2000) for raise-cap decisions | The stop rule is marginal-gain stopping — same math as lazy-greedy certificates in submodular maximization |
| 15 | THE HIVE / HIVE-Lite queue (B2) | Persistent FIFO + idempotency keys; checkpointed job state (WAL discipline) | Idempotent resume; single-GPU serialization; stop conditions as circuit breakers | O(1) enqueue/dequeue | Häer/Reuter write-ahead-logging correctness: crash-consistent recovery | Overnight unattended compute is unmetered by turns — batch what the turn-loop cannot afford |
| 16 | Benchmark corpus + graphs/embeddings (B6) | Spectra matrices (bitset CSR); AST graphs in CSR; embeddings in **HNSW index** | Offline: gold-CI, reachability cones, mirror-tree twin detection (cosine ≈ 1.0 pair scan), ANN queries | cones O(V³/64) once; ANN O(log N) query | Precompute principle: task-independent bits belong offline (see `02` law 5) | The 256-file graph/embedding corpus is exactly this — free I(R;·) extraction the model must not re-derive in-turn |

---

## 3. Component chapters

Each chapter: the math (one paragraph), the CS realization (the real content), alternatives considered and rejected, and the failure mode of the naive design.

### 3.1 BCF-Spec and the derived fix order (row 1)

**Math.** §5 treats multi-fault repair as scheduling over a precedence partial order: fault f must be exposed (and repaired) before g when f masks g. Proposition 5: repairing against the order forces re-diagnosis — you pay the localization cost again. Classical scheduling: with order-independent stage costs, *every* topological order achieves the same total cost, so correctness (feasibility), not optimality, is what the order buys; the cost asymmetry comes entirely from violating it.

**CS realization.** The spec schema stores `depends_on` edges and *nothing about order*. At runtime: (1) Tarjan SCC pass — a non-trivial SCC is mutual masking, the non-identifiability certificate (15's ∣[F]∣ equivalence classes); the spec is rejected back to the author with the SCC listed as one *set-diagnosis* fault, not a cycle error; (2) Kahn's algorithm emits a legal repair order with each fault's *ready set* (in-degree-zero frontier) exposed incrementally — which is exactly the exposition schedule T2 of thread 2 in `02`. Kahn over an adjacency-map representation also gives you, for free, incremental re-planning when a repair invalidates later hypotheses: remove the node, decrement predecessors, continue — no global re-sort.

**Alternatives rejected.** Storing an explicit `fix_order` array (contender 05's schema did): two sources of truth, drift between them, and no cycle detection until runtime crash. DFS-based topological sort: same asymptotics, but produces one arbitrary order and no incremental frontier — Kahn's queue *is* the ready-set iterator the patch phase consumes.

**Failure mode of the naive design.** A fixed serialized order cannot express "repair whichever of {B1, B3} you confirmed first" — and confirmation order is task-dependent evidence, known only at runtime. The derived order handles this by construction: the frontier updates as evidence lands.

### 3.2 Progressive disclosure as a rate-distortion ladder (row 2)

**Math.** The data-processing inequality: any coarsening g of the evidence E can only lose information about R. Disclosure level L1 (structure summary) ⊂ L2 (symbol signatures) ⊂ L3 (full source) is a chain of coarsenings; H(R|E_L1) ≥ H(R|E_L2) ≥ H(R|E_L3) ≥ 0. Promotion from L to L+1 buys ΔI = I(R; E_{L+1}) − I(R; E_L) bits at a token cost |E_{L+1}| − |E_L|. Promote iff ΔI/Δtokens exceeds the current best guesswork-reduction exchange rate — this is the information-bottleneck trade-off with the ledger supplying the exchange rate from past tasks.

**CS realization.** Each level is a *materialized view* over the repo snapshot, content-addressed (hash of inputs → rendered text), computed offline by HIVE jobs (row 15). In-context, the ladder is just the choice of which view's text to splice — but the discipline (never skip levels unless a level *contradicted* its parent view, which is itself high-information) is the ergonomic device: the model's exploration is canalized into the ladder instead of free-form grep.

**Alternatives rejected.** Free-form exploration (the anti-grep mandate in the composite plan): measured to waste turns re-deriving structure (13/14/15's neighbors-first doctrine). One full-context dump: pays L3 token cost for L1-derivable answers on most tasks — a 10–30× token over-spend for the same bits.

**Failure mode.** A ladder level that is not a *view* but a paraphrase (hand-written summary drifting from source): the DPI bound no longer applies — g is no longer a function of E, and the "information" can be fabricated. Progressive disclosure must be generated, never authored.

### 3.3 Localization, single fault: ranking is the algorithm (row 3)

**Math.** Prop 1: with candidates ordered by posterior π, expected localization cost is Σ i·i·π(i) — a function purely of the *rank distribution*. The entropy bound (Prop 2) says no ordering beats E[T_loc] ≥ H(R|evidence)/b turns; Massey's guesswork refinement ties E[G] to Renyi entropy. Nothing in the math cares *how* the ranking is produced — only that π be calibrated.

**CS realization.** The spectra pipeline: per task, an activity matrix (tests × code elements) in CSR bitset form; Ochiai per element is a cosine on (failed∩element, failed, element) column counts — vectorizable over 64-bit words; the posterior prior then re-ranks within the credible set using the distance-decay factor and interference cones (rows 5–6). All of this is offline precompute over the 129-task corpus (row 16). What the *model* receives is a ranked list plus the evidence each ranking consumed — the turn-cost side of Prop 1 is then just "walk the list."

**Alternatives rejected.** Embedding-NN ranking alone (the shipped 256-file embeddings): useful recall net, no calibration guarantee; use as a *feature* into π, not as the ranking. Model-free-traversal localization: pays full entropy H(R∣E) in turns when the spectra already encode most of it.

**Failure mode.** Uncalibrated π (03's measured result: issue-text classes made LOO localization *worse*, 6.57 vs 5.84) — a ranking that mis-orders costs Σ i·i·π(i) more than no ranking at all. The ledger's per-rank hit statistics are the calibration instrument.

### 3.4 Localization, multi-fault: the hitting set that was always there (row 4)

This is deep thread T1 — full treatment in `02` §4.1. Summary here: conflict sets from failing tests; HS-DAG exact enumeration (Greiner/Smith/Wilkerson 1989 — the *correction* to Reiter's tree, memoizing duplicate nodes into a DAG); greedy ln-approximation only as a scale hedge; MCL or union-find pre-clustering on the interference prior to decompose; and the ILP option — at ≤10³ elements with ≤10² conflicts, any MILP solver returns all minimal hitting sets before the model finishes reading the prompt.

### 3.5 Interference DAG and reachability cones (row 5)

**Math.** Prop 4 (masked faults invisible to monotone SBFL) + Prop 5 (order violation ⇒ re-diagnosis) + the distance-decay prior all live on the same object: the fault-exposition digraph D_F.

**CS realization.** Transitive closure once, offline, as a bitset matrix (Warshall's algorithm on machine words: O(V³/64); the 1970s Purdom/Floyd lineage). From the closure, *reachability cones* — the sets of nodes masked-by/masking each candidate — are single row-AND operations. These cones are one of 14's five interference signatures, and they are pure precompute. In-context, the model is *told* the cone; it never spends a turn discovering ancestry. Cycle detection (Tarjan) at spec time (§3.1) and at localization time (a new cone that closes a cycle = candidate mutual-masking set).

**Alternatives rejected.** On-demand BFS per query: correct but re-pays graph work per turn — the whole point of the closure is to move it off the metered path. Symbolic/SMT reachability: an orders-of-magnitude heavier tool for a relation that is static per snapshot.

**Failure mode.** Closure staleness after edits — invalidate on patch (content-hash keyed) and recompute offline before validation phase; the ledger's config_hash discipline covers this.

### 3.6 Chained faults: a factor graph whose edges are BFS distances (row 6)

**Math.** P(u∣S) ∝ P(u)·λ^d(u,v*): posterior over next-fault candidates given a seed set S, decaying exponentially in *graph distance*. This is exactly the compound structure the httpx_3672 walkthrough exhibited (B1 masks B2 across a neighbor relationship).

**CS realization.** Build the factor graph with edges = (adjacency from the AST/call graph, decay weight λ^d). Seed with confirmed faults; run a few rounds of sum-product message passing (graph is tens of nodes — loopy BP convergence is a non-issue at this size; and if it oscillates, the graph is a cycle, which Tarjan already told you about). Output: re-ranked candidate list fed back into row 3's machinery. λ is a *ledger-calibrated* constant (measured from the micro-benchmark of O11 in the composite plan — the hardlink pairs and progressive gold-patch inversions).

**Alternatives rejected.** Pure nearest-neighbor heuristics (same graph, no posterior semantics, no way to compose with other evidence); full Bayesian network tooling (inference cost and modeling ceremony unjustified at this size).

**Failure mode.** λ assumed instead of measured — the entire distance-decay literature's error mode; the calibration IS the deliverable.

### 3.7 The edit path: deterministic byte plumbing (row 7)

**Math.** None directly — this is the subsystem where the correct principle is that *determinism is free information*: code that behaves identically every run contributes zero entropy to the agent's belief state and consumes zero model-judgment budget. The budget argument: edit-path failures were 13–21% of community terminations; every one is a wasted task.

**CS realization.** The patch toolkit: line-range replacement with integer args (integer-only routes around the harness's own read_file line-range bug); anchor-based insertion with uniqueness checks (an inverted index from anchor token to occurrence list — suffix-array or Aho–Corasick automaton over the file set, built offline); Myers O(ND) diff for verify-after-edit (report the actual applied diff back into context, not the intended one); `git apply --check` as V0. Hostile-content suite (docstrings, backslashes, CJK, \uXXXX, CRLF) as regression tests. All of `03-implementation-cookbook.md` §3 is this row.

**Alternatives rejected.** Quoted-substring old/new splice edits: the measured escaping-failure mode (62%→22% escape-rate claims in the community); sed-style regex: the regex is a second parser, and the escape surface doubles.

### 3.8 Validation cascade and gates (row 8)

**Math.** Each validator V_k is a decision test with (detection, false-positive, cost). Optimal testing order (from sequential-decision / cascade theory): order by cost·(1−specificity) trade-off — cheap-and-certain first. The blocking rule converged by the council (13/14/09): only executable deterministic checks may block; model judgment may trigger rescue, never approval — because a stochastic blocker injects its own error rate into every pass decision.

**CS realization.** Short-circuit pipeline: V0 `git apply --check` (ms) → V1 AST parse (ms) → V2 targeted pytest (s) → V2b agent-repro (min) → V3 advisory LLM review (never blocks). Gates G0–G6 computed as a conjunction bitset over the V-results — one u64, printable in the ledger, diffable across runs. This is the cascade structure of Viola–Jones transplanted to agent validation, with the same property: the cascade's cost is dominated by its cheapest stage on easy negatives (broken patches die in milliseconds at V0/V1).

**Alternatives rejected.** Single heavyweight validator (all-or-nothing pytest on the full suite): pays the expensive test on patches that would fail the cheap ones; LLM-judged gates: the MC3 finding — stochastic blockers fabricate both passes and failures.

**Failure mode.** Gate creep — adding gates without measuring their false-positive rate on the gold-CI; the gate-removal ablation (G1/G5/G3, from the composite plan) is the guard.

### 3.9 Rescue FSM (row 9)

**Math.** R_rec in the master equation is bounded by a *protocol*, not a hope: trip conditions (3 consecutive validation failures / 3 identical tool calls / 4 edits no growth / <25% budget no valid patch) trigger a bounded recovery state machine R1 (intake: freeze state, re-read spec) → R2 (minimum baseline: revert to last green, re-establish) → R3 (induction: extract the invariant that failed, write it to the journal, resume or abandon).

**CS realization.** An explicit finite state machine — enum states, transition table, bounded counters — is the data structure; the property that matters is *ergonomics*: the agent cannot renegotiate the protocol under stress, because the protocol is code, not prose. Trip detection reuses row 10's normalized-action hash (identical tool calls = hash-set hit) and row 13's budget telemetry.

**Alternatives rejected.** Prompt-encoded rescue instructions (contender 04's approach): under context pressure, the instructions are exactly what compaction removes first. LLM-decided rescue: the failure state that needs rescue is often the model's own confused belief — the trigger must be external.

**Failure mode.** R3 without the journal write: recovery without learning — the same fault trips R1 again on the next task; the ledger's rescue-event records are the training data for the negative-recovery turns (composite plan O8).

### 3.10 Breadcrumb journal: a bounded deque that is secretly a sufficient statistic (row 10)

**Math.** The entropy floor argument: the state the agent needs to carry across turns is the *sufficient statistic* of its history for the remaining decision — in practice, far smaller than the transcript. The ~30-line journal bound is a hand-set rate-distortion operating point: STATE/NEXT/WHY lines that preserve decision-relevant state, drop narrative.

**CS realization.** Ring buffer (bounded deque): O(1) append, oldest eviction, fixed memory; the tail K lines are the STATE block re-injected after every compaction event (threshold 14,336 — 16's runtime hygiene). Normalized-action strings (tool + target + coarse arg shape, regex-free normalization) hash into a set: the loop detector. Kept in /tmp, outside the repo tree, never in `git diff HEAD` — the journal-placement probe (Day-0) verifies the patch capture doesn't swallow it.

**Alternatives rejected.** Full transcript retention: compaction does this *to* you anyway, at worse quality (lossy model-side summarization vs. deliberate tail-keeping); unstructured scratch notes: the WHY discipline is what makes R3 induction possible.

**Failure mode.** Journal content drifting into narrative (what I tried, in prose) instead of state (what is true, what is next, why) — the normalization lint in `03` §5 enforces the discipline mechanically.

### 3.11 Reducer packets: the information bottleneck as a data structure (row 11)

**Math.** Tishby's information bottleneck: compress E → Ě maximizing I(Ě; R) at a complexity budget. The reducer's handoff packet (T0 full / T1 symbol-level / T2 hypothesis-level) is a *discretized* bottleneck: three operating points on the rate-distortion curve of the agent's own context. DPI says T2 ≤ T1 ≤ T0 in information; the question the ablation answers is how *steep* the curve is — if T2 loses little, the agent can hand off cheaply; if it loses much, sub-agents are dead weight.

**CS realization.** Packets are content-hash-keyed delta snapshots (Myers diff against previous packet); reconstruction is apply-deltas; the 3-arm ablation (T0/T1/T2) is the measurement. Re-injection discipline: after any compaction event, the current packet is spliced verbatim before the next turn (16's rule).

**Alternatives rejected.** Full-context handoff: 32k windows make sub-agent context multiplication unaffordable; prompt-summary handoff: model-side summarization is the uncontrolled g — no DPI statement possible.

**Failure mode.** Packet schema drift across agent versions breaking replay — pin `packet_schema_version` alongside `ledger_schema_version`.

### 3.12 Dispatch table with a reject row (row 12)

**Math.** Chow's 1970 theorem: the optimal classifier with a reject option (cost c₀ for rejection, c_E for error) rejects iff the maximum posterior p* < 1 − c₀/c_E. The MC3 K*-laws from four contenders all describe the same interior optimum of granularity; 03's measured degradation is the empirical face of over-fine classes.

**CS realization.** The 7-field task taxonomy → dispatch table mapping class → (strategy profile, tool budget, localization preset, validation depth). The last row is the reject/fallback row: p* below threshold → generic deep-localization path at default budgets. c₀ = ledger-measured mean cost of the generic path; c_E = ledger-measured mean cost of a wrong-classification repair (wrong_fix terminations). Threshold is computed, not vibes. This is also where the complexity tier rubric (1–5) feeds budget caps.

**Alternatives rejected.** No fallback row (always classify): the failure 03 measured. Hard routing by first-keyword-match: a classifier with implicit, uncontrolled priors.

**Failure mode.** Threshold estimated from a different task distribution than the hidden set — re-calibrate on T2 mined tasks (16's held-out-repo tier) as the distribution drifts.

### 3.13 Ledger: the instrument that closes the loop (row 13)

**Math.** Every constant the theorems need — ρ (interference rate), λ (distance decay), q (masking probability), b (bits/turn), c₀, c_E — is defined as a measurable. Without the ledger, the framework is uncalibrated theory; with it, the constants are estimators over logged events.

**CS realization.** Append-only JSONL (event sourcing): O(1) appends, no in-place mutation, natural time ordering; OTel GenAI field names for portability; receipts as hash-chained run summaries (Merkle-style chaining: each receipt commits to the previous — tamper-evidence for the claims-audit rule "no number without a receipt ID"). Derived tables (per-task termination causes, per-rank hit rates, repeat-action rates) computed by offline aggregation — the same HIVE batch path as everything else.

**Alternatives rejected.** In-place state store (a database of "current" values): destroys the audit trail the receipts discipline requires; logging inside the model's context (the agent "remembers" what it did): compaction destroys it.

**Failure mode.** Schema drift — pin `ledger_schema_version`; unwritten events on crash — the kill -9 unit test in the composite plan C.2.1 exists for exactly this.

### 3.14 Governor and allocator (row 14)

**Math.** 15's stop rule: raise the per-task time cap while marginal gain p'/p exceeds 1/(c+o) — the marginal-stopping structure shared by lazy-greedy submodular certificates and the odds theorem (Bruss 2000) lineage of optimal stopping. 14's v2 allocator: soft caps at the 80th percentile of successful-solve times with a 10% global reserve — an order-statistic policy.

**CS realization.** Token bucket per task (admission control: every tool call costs against the bucket; backpressure surfaces as budget-aware prompts, not surprises) + a priority queue over tasks ordered by expected-solve-value-per-remaining-budget; salvage pass converts partial work into valid non-regressing patches; force-commit at 70%, force-submit at 90%. All thresholds ledger-calibrated.

**Alternatives rejected.** Global timeout only (the harness default): pays the full timeout on hopeless tasks and starves promising ones; LLM self-pacing: the model cannot perceive elapsed wall-clock — external accounting is mandatory.

**Failure mode.** Caps fit to the public 129 but the hidden set is heavier — the T2 tier and the order-agnostic design (14) are the hedges.

### 3.15 HIVE queue (row 15)

**Math.** Unmetered-by-turns compute (overnight batch) is the budget loophole the framework must exploit: everything in rows 2, 3, 5, 16 that says "offline" routes through this queue.

**CS realization.** Persistent FIFO with idempotency keys (job = hash of inputs + code version); checkpoint/resume (WAL discipline — Härder & Reuter's transaction-recovery principles applied to job state); single-GPU serialization; stop conditions {gpu_oom → pause, error_rate > 0.3 → abort} as circuit breakers; resumable after kill (≤5 min recovery drill).

**Alternatives rejected.** Ad-hoc cron scripts: no idempotency → double-runs poison spectra statistics; human-in-the-loop triggering: does not survive a 6-week competition.

**Failure mode.** Silent partial completion treated as complete — the idempotency key must include completeness state.

### 3.16 Benchmark corpus as precomputed information (row 16)

**Math.** The precompute law (`02` law 5): any I(R;·) extraction that is task-independent belongs offline. The shipped corpus (256 graph files, 256 embeddings, 129 task-named hardlinks over 127 commits) is precisely a bundle of precomputed evidence — the design question is only indexing it for cheap in-turn retrieval.

**CS realization.** Spectra in CSR bitsets; AST graphs in CSR; embeddings in an HNSW index (Malkov & Yashunin — logarithmic-complexity ANN, verified live: arXiv 1603.09320; TPAMI 42(4), 2020 print) for the mirror-tree twin scan (cosine ≈ 1.0 sync/async pairs) and nearest-neighbor cross-checks of the hunk-divergence audit. The 129↔127 hardlink structure itself is the micro-benchmark substrate (O11).

**Alternatives rejected.** Reading graph JSON ad hoc per turn: re-parsing megabytes per task for one neighborhood query; brute-force cosine scans: fine at 256 vectors, but HNSW is one import away and the corpus grows with T2 mining.

**Failure mode.** Index staleness vs. patched working tree — scope indexes to the *task snapshot*, not the mutated tree; the content-hash keying handles this.

---

## 4. What this map is for

The table is the design review checklist: any proposed change to the BCF must (a) name its row, (b) name its math justification, and (c) name its ledger measurement. A change that cannot is ceremony. The chapters give the counter-position: the *rejected alternatives* are as much a part of the design as the chosen ones — they are what the theorems rule out, plus what the measured token economics rule out (the two overlap heavily; that overlap is the harmony thesis of `02`).


---

<!-- ====================================================================== -->
<!-- FILE: 02-math-cs-harmony-guide.md -->
<!-- ====================================================================== -->

# 02 — Software Design Principles × Mathematical Principles: The Harmony Guide

**Run:** `independent_research/2026-10-01-bcf-dsa-full-circle/` · 2026-10-01
**Question answered:** how to combine software design principles with the mathematics from the past research rounds (§5 formal framework, fault-masking research, MC3 council) so the math supports the computer science and the CS is in harmony with the math — yielding solutions that are *ergonomically performant*: maximal diagnostic information per token, minimal turns to repair, zero re-derivation.
**Reading order:** this guide is self-contained; `01-bcf-dsa-map.md` is the component-by-component reference behind it; `03-implementation-cookbook.md` makes it executable.

---

## 0. Executive summary

1. **The unifying object is the turn.** Every theorem from the past rounds (entropy floor E[T_loc] ≥ H(R∣E)/b; guesswork bounds; the master equation E[T] = c_cl + c_loc·E[G] + R_int + R_rec) is a statement about *information per unit of agent action*. Every classical algorithm and data structure in `01` is a device for moving bits from the metered path (turns, tokens, context) to the unmetered path (offline precompute, deterministic code, cache). Design principle and theorem meet at the same object from opposite sides.
2. **The harmony relation is bidirectional and checkable.** Math→CS: a theorem dictates the algorithm class (DPI dictates disclosure ladders; the partial-order theorem dictates topological scheduling; Chow's rule dictates the reject row; Reiter dictates hitting sets; adaptive-submodularity theory dictates greedy probe selection *and marks exactly when it loses its guarantee* — under masking). CS→math: the running system measures the theorems' constants (ρ, λ, q, b, c₀, c_E) from its ledger, and falsifies or refines them (the masking probe is a designed falsifier). A design where either direction is missing is half-built.
3. **Seven laws operationalize this** (§5): theorem↔mechanism pairing; ledger-calibrated constants; deterministic-code-owns-policy; data-dependent algorithm dispatch (fix_shape switches algorithm class); precompute-vs-explore; bounded state as sufficient statistics; fallback as a first-class (Chow) class.
4. **The counter-angle is a design tool, not a disclaimer** (§6): at n = 129, exact algorithms beat approximations *because* NP-hardness is asymptotic and instances are tiny; token economics, not CPU complexity, is the real complexity theory; over-engineering a structure that does not pay information rent is negative-value ceremony.
5. **Ergonomics is the deliverable** (§7): the framework has two readers — the model (bounded state, canalized exploration, deterministic prefixes) and the human (specs, gates, receipts, ledger) — and every structure serves at least one reader measurably.

---

## 1. The software-design inventory (what "principles" means here)

The design principles that actually bear on a budgeted repair-agent framework, each with its one-line role:

| # | Principle | Role in BCF | Classical source/usage |
|---|---|---|---|
| P1 | Single responsibility per phase/tool | Phase separation (Spec/Localize/Patch/Validate); each tool does one thing | SOLID-S |
| P2 | Open-closed extension | Ceiling ladder adds rungs without touching old ones; gates addable as bitset bits | SOLID-O |
| P3 | Interface segregation | Symbol-language tool queries, capped outputs; sub-agent receives only a packet | SOLID-I |
| P4 | Dependency inversion | Deterministic code owns policy; model owns judgment; both depend on abstractions (validator, probe, packet interfaces) | SOLID-D |
| P5 | Design by contract | BCF-Spec schema = the contract; acceptance criteria = postconditions; gates = executable contract checks | Meyer, Eiffel lineage |
| P6 | State machines over ad-hoc control | Rescue R1–R3; task lifecycle; queue stop-conditions | FSM discipline |
| P7 | Event sourcing / append-only | JSONL ledger + receipts; auditability and replay | WAL discipline (Härder & Reuter 1983) |
| P8 | Single source of truth, derived views | `depends_on` edges stored, fix_order derived; ledger events stored, dashboards derived | normalization |
| P9 | Lazy evaluation / progressive disclosure | Disclosure ladder L1→L3 expands on demand | lazy structures, memoization |
| P10 | Least privilege / scoping | No file tools before Phase 1; read-only analyzer agents; sub-agent tool budgets | capability discipline |
| P11 | Idempotency & retry-safety | Patch validate/clean; HIVE job keys; force-submit exactly once | distributed-systems practice |
| P12 | Fail fast, fail safe | V0/V1 kill broken patches in ms; budget failsafes fail toward best-effort submission | robustness principle (inverted: *be conservative in what you accept* is replaced by *reject early*) |
| P13 | Separation of mechanism and policy | Governor mechanism (token bucket) vs allocation policy (caps, stop rule) — policy is data | Unix doctrine |
| P14 | Bounded resources everywhere | Journal ≤30 lines; packet tiers; per-task buckets; bounded counters | backpressure discipline |
| P15 | Observability as a first-class feature | OTel-named ledger, zero-census termination causes, receipts | telemetry practice |
| P16 | Determinism before intelligence | V0–V2 blocking oracles; deterministic edit path; temp-0 finals | reproducibility practice |

(Liskov substitution is deliberately absent: the framework has no deep inheritance — the composite plan's "N/A by design shape" finding. Where substitution-like pressure appears — packet schemas, ledger schemas — it is handled by explicit version pins, which is the data-serialization equivalent.)

## 2. The mathematics inventory (from the past rounds, one line each)

| # | Result | Statement (operational form) |
|---|---|---|
| M1 | Prop 1 (credible-set restriction) | E[T_loc∣c] = Σᵢ i·i·π(i): expected rank cost under posterior-ordered inspection |
| M2 | Prop 2 (entropy floor) | E[T_loc] ≥ H(R∣E)/b: no strategy beats residual entropy per bits-per-turn |
| M3 | Guesswork (Massey 1994; Arikan 1996) | Expected number of guesses tied to Rényi entropy of the posterior — refinement of M2 |
| M4 | Master equation | E[T] = c_cl + c_loc·E[G(R∣g(E))] + R_int + R_rec — decomposition of total turn cost |
| M5 | DPI | I(R; g(E)) ≤ I(R; E): every coarsening (reducer, disclosure, truncation) leaks information |
| M6 | Fano | P_e ≥ (H(R∣E) − 1)/log∣R∣: classification error floor from residual entropy |
| M7 | Information bottleneck (Tishby) | Optimal compression Ě of E maximizes I(Ě; R) at fixed rate — the packet/ladder design frame |
| M8 | Reiter 1987 | Multi-fault diagnoses = minimal hitting sets of conflict sets (from first principles) |
| M9 | Obs-union violation / Prop 4 | Masked faults are invisible to monotone SBFL formulas; SBFL collapses under interference |
| M10 | Exposition DAG / Prop 5 | Repair order = topological order of fault-exposition DAG; violations force re-diagnosis |
| M11 | Scheduling on partial orders | With order-independent stage costs every topological order is cost-optimal; only violations cost |
| M12 | Distance-decay prior | P(u∣S) ∝ P(u)·λ^d(u,v\*): chained-fault posterior decays in graph distance from the seed |
| M13 | Submodular/adaptive-submodular guarantees | Greedy selection: (1−1/e) under (adaptive) submodularity (Nemhauser et al. 1978; Golovin & Krause 2011) |
| M14 | Chow 1970 | Optimal reject rule: reject iff max posterior p\* < 1 − c₀/c_E — classification-with-rejection optimum |
| M15 | K\* granularity laws | Interior optimum of taxonomy size (DPI interior optimum; k\*=e^{α0/(2β)}; K\*=4a²N/b²) — over-fine classes hurt |
| M16 | Non-identifiability (masking) | Under a binary oracle, masked faults form equivalence classes ∣[F]∣ — a strategy-independent lower bound |
| M17 | Guessing/probe economics | Probe value = conditional MI I(R; O∣E); greedy-MI selection = GDE/decision-tree move (de Kleer & Williams; MacKay 1992; Campos et al. ASE 2013) |
| M18 | Allocation stop rule | Raise budget while p'/p = 1/(c+o): marginal-gain stopping (15's rule; odds-theorem lineage, Bruss 2000) |
| M19 | q^n plateau law | Conjunctive solve probability plateaus q^n (q≈0.4, n≈2 matches the observed LB band) |
| M20 | Hitting-set hardness & approximations | NP-hard; greedy ln n (Chvátal 1979; Slavík 1997); inapproximability below ln n − ln ln n (Feige 1998) — all *asymptotic* statements |

## 3. The correspondence table (principle ↔ theorem ↔ mechanism)

The core of the guide. Read as: the design principle, the theorem that gives it force, and the mechanism that implements both. Rows without a theorem are marked (engineering) — they are justified by token economics instead; rows without a mechanism are the framework's missing teeth.

| Principle (§1) | Theorem (§2) | Mechanism (in `01`) | The harmony sentence |
|---|---|---|---|
| P5 design-by-contract | M11 scheduling on partial orders | Spec schema + Kahn-derived fix_order + Tarjan SCC check | The contract stores only the order relation; feasibility (never optimality) is what the contract buys, so the schema cannot over-promise |
| P9 progressive disclosure | M5 DPI, M7 bottleneck | L1→L3 materialized views, entropy-gated promotion | Every disclosure level is a coarsening with a *measured* ΔI/Δtoken exchange rate; the UX is the rate-distortion curve |
| P4 dependency inversion | M2 entropy floor | Deterministic validators own blocking; model owns judgment | Deterministic checks are zero-entropy bits — inverting control puts the scarce resource (model judgment) only where it carries new information |
| P16 determinism-first | M17 probe economics | Edit path, V0–V2 cascade | Deterministic machinery contributes no entropy to the belief state, so every deterministic bit is "free" information |
| P8 single source of truth | M10 topological repair | Derived fix_order; derived dashboards | The math invariant (the partial order) *is* the normalized schema; derived views cannot contradict their source without detection |
| P6 state machines | M18 stopping rules, R_rec bound | Rescue FSM, trip counters | A stopping theorem is only as good as its trigger's reliability — an FSM cannot renegotiate under stress; prose can |
| P7 event sourcing | calibration of M1–M20's constants | JSONL ledger, hash-chained receipts | The theorems' constants are estimators over events; without append-only events there is nothing to estimate and the math is decoration |
| P13 mechanism/policy split | M14 Chow rule | Token-bucket governor (mechanism) + calibrated caps/thresholds (policy) | The theorem lives in policy data; swapping policies never touches the mechanism, so calibration never destabilizes the runtime |
| P12 fail fast | M6 Fano floor | V0/V1 kill in ms; gate bitset | Most wrong patches are detectable by cheap certain tests; paying the Fano floor means spending expensive turns only on genuinely ambiguous states |
| P3 interface segregation | M15 K\* laws | Packet tiers T0/T1/T2; capped tool outputs | Over-fine interfaces are over-fine classes: both pay Fano/DPI rent — segregation should stop at the interior optimum |
| P10 least privilege | M2 entropy floor | No file tools before Phase 1; scoped sub-agents | Privilege is context exposure; every granted-but-unused capability still consumes window budget — scoping is an information-economics device |
| P14 bounded resources | M2 + M7 sufficient statistics | Ring-buffer journal; bounded counters; buckets | Boundedness is the ergonomic form of the entropy floor: keep the H(R)-relevant tail, drop the rest — with the bound *tunable* in the ledger |
| P2 open-closed | M4 master equation | Gate bitset; ceiling-ladder rungs | Rungs and gates are additive terms in E[T]; adding one must never rewrite the others — the additive cost model matches the additive mechanism |
| P11 idempotency | (engineering) | Patch validate/clean; job keys; force-submit-once | Idempotency is replay-safety for the ledger — the calibration instrument must survive crashes or the constants die with the run |
| P15 observability | (engineering) | OTel ledger, zero-census, receipts | The measurement IS the product: without it every other row's constants are assumed |

**What the table shows.** The SOLID-family principles (P1–P4) are *structural* — they organize who owns what; their mathematical partners are the floor theorems (M2, M5) because ownership is really a question of *where information may be created or destroyed*. The systems principles (P6–P16) are *behavioral* — they govern runs; their partners are the decision theorems (M10–M18) because behavior is where costs are paid. Nothing in the framework is justified by "clean code" aesthetics alone; conversely, no theorem is left without a mechanism (the audit: every M1–M20 has at least one row above or a row in `01`'s master table).

## 4. The four deep threads

### 4.1 Thread 1 — The hitting set was always the computation

**The claim.** When the spec says multi-fault, the localization problem *is* Reiter's problem: failing tests supply conflict sets; candidate diagnoses are their minimal hitting sets; SBFL is the single-fault relaxation. The Obs-union violation (M9) is not a pathology to patch — it is the boundary marker of the relaxation's validity.

**The computation, concretely.** Universe U = candidate code elements (bitset representation; n ≤ few thousand). Conflict family {CS_k} from failing tests and spec cross-references. **HS-DAG** (Greiner, Smith, Wilkerson, AIJ 1989 — the correction to Reiter's HS-tree that prunes duplicate/reopened nodes) enumerates minimal hitting sets exactly; its memoization is the difference between exponential-with-duplication and exponential-without — at real sizes, "exponential-without" is milliseconds. Pre-pass: cluster U by the interference prior ρ (Markov clustering, van Dongen 2000, as in MSeer — or plain union-find at a threshold) and hit each component independently, converting one hard instance into k trivial ones; the distance-decay prior M12 is the probabilistic shadow of the same move.
If the instance ever *does* grow (T2-mined corpora at scale): greedy set cover (highest-coverage-first) carries the Chvátal ln n guarantee, and Slavík/Feige delimit what anyone can do — the approximation ladder is the scale hedge, not the default (§6).

**The harmony.** Math names the problem class exactly (M8); CS supplies exact algorithms that are instant at scale n (counter-angle §6); the framework's spec phase tags `fix_shape` and the dispatch (§5 law 4) switches SBFL→hitting-set on that tag. The ledger measures ρ, which calibrates the clustering threshold, which changes the decomposition — the loop is closed at every level.

**The naive design and its failure.** Rank candidates by SBFL on multi-fault tasks: M9 proved the ranking is *blind to masked faults* — not inaccurate, structurally blind (M16: the masked fault is in an equivalence class the oracle cannot separate). The fix is not a better formula; it is a different algorithm class, plus interventions (4.2).

### 4.2 Thread 2 — Greedy information gain is optimal right up to masking; then you must act

**The claim.** The turn loop is adaptive information acquisition: each probe (run test, read symbol, ask graph query) has value I(R; O | E) (M17). Greedy-MI probe selection inherits the (1−1/e) world of guarantees exactly when the value function is (adaptively) submodular (M13).

**The break.** Masking makes probe value a function of *world state*, not just collected evidence: the information gained by observing region X differs before vs. after repairing the fault that masks X. Submodularity fails; the greedy certificate evaporates; and M16 says no *pure-observation* strategy can win — the equivalence class ∣[F]∣ is observation-invariant. This is the precise sense in which the math *predicts* the loop must interleave action: only do-operators (apply a patch) move the world between equivalence classes.

**The CS answer.** The exposition DAG D_F (M10) is the schedule for the interleaving: Tarjan SCC identifies mutual-masking sets (the non-identifiability certificates — treat as set-diagnosis, repair any member, re-observe); Kahn's frontier emits repair-or-probe decision points in topological order. The masked-fault probe (16's falsification arm) is a *single-edge do-test*: patch only the hypothesized masked fault; if the observable failure signature does not remain identical, the D_F edge was wrong — a designed falsifier with a receipt either way.

**The harmony.** M13's guarantee and its failure condition are both load-bearing: greedy-MI inside SCC-free regions (certificate holds), DAG-scheduled interventions across regions (certificate knowingly waived, replaced by the order theorem M10–M11). The measured ρ tells you which regime you are in *before* you choose the loop shape.

### 4.3 Thread 3 — Chow's reject rule is the shape of every dispatch decision

**The claim.** The framework classifies constantly: task→class (taxonomy), class→strategy, candidate→likely/unlikely, adapter→live/inert. Every such classifier has a third output available — *reject/fallback* — and Chow's 1970 theorem says when to use it: reject iff p\* < 1 − c₀/c_E.

**The K\* connection.** Four council contenders derived interior optima of taxonomy granularity (M15) from three different toolkits (DPI monotonicity + plugin bias; a α(k) expansion; a design-rule K\*=4a²N/b²). All are Chow-family statements in disguise: finer classes raise per-class competence but shrink per-class evidence — eventually p\* falls below the threshold on too many tasks, and the *correct* behavior is fallback, not finer classification. 03's measured degradation (LOO 6.57 vs 5.84 with issue-text classes) is the empirical face; the c₀ fallback row is the design response (16's Prop-4 usage).

**The CS realization.** One table, one reject row, two calibrated constants: c₀ = mean cost of the generic path (ledger), c_E = mean cost of a wrong-classification repair (wrong_fix terminations, ledger). The cascade (V0→V3, row 8 of `01`) applies the same shape vertically: each stage rejects cheaply what it can, escalating only the genuinely ambiguous — the Viola–Jones cascade structure, which was itself an engineering realization of cost-sensitive sequential testing.

**The harmony.** The theorem supplies the *form* (threshold on posterior); the system supplies the *constants* (measurements); the ledger supplies the *feedback* (miscalibration inequality from 14 detects drift). No side is decorative.

### 4.4 Thread 4 — Token economics is the complexity theory of agent engineering

**The claim.** The binding cost model of this domain is tokens-per-bit and turns-per-decision, not CPU-time-per-operation. Restated: the master equation M4 is this domain's "big-O"; a "faster" framework is one with smaller E[T] and higher I(R;E)/|E|.

**The devices that follow** (each = classical structure re-justified by information-per-token):
- **Deterministic-prefix + KV prefix caching** (vLLM APC — verified live: engine reuses cached KV pairs when prompts share a prefix; `enable_prefix_caching=True`): a byte-stable ≥2,048-token system prompt makes the repeated portion of every turn nearly free. This is *memoization at the KV level* — and it inverts textbook code-length intuition (a Huffman-optimal but unstable prefix loses to a stable redundant one, because cache hits dominate code length; see §6).
- **LRU memoization of tool outputs** keyed by normalized call string: identical re-queries cost zero tokens; the same normalization powers loop detection (repeat_action_rate).
- **Ring-buffer journal**: O(1) state carry; the STATE block is the sufficient-statistic re-injection point after compaction.
- **Reducer packets**: the bottleneck's operating points; T0/T1/T2 measures the curve.
- **Token bucket + priority queue**: budget as admission control; the allocator is a scheduler whose job metric is expected information gain per remaining budget (M18's stop rule is the marginal-gain certificate).
- **Append-only ledger + receipts**: the calibration instrument, replay-safe by construction (event sourcing), tamper-evident (hash chain).
- **Offline precompute of everything task-independent** (spectra, closures, cones, anchors, indexes, disclosure views): the unmetered path. *Shift work off the metered loop* is the single highest-leverage rule in the whole framework.

**The counter-principle.** CPU-side complexity is nearly free at n=129 — which *reverses* the usual engineering anxiety: choose the *exact*, the *simple*, the *boring* algorithm (Kahn not a constraint solver; bitset closure not a graph database; Myers not an AST-diff ML model). The scarce resources are turns/tokens/submissions; spend engineering effort exactly there.

## 5. The Seven Harmony Laws (design doctrine)

1. **Pairing.** Every mathematical proposition owns a mechanism; every mechanism cites its proposition (or is explicitly marked engineering with a token-economics justification). Audit: the correspondence table §3 and `01`'s master table, column by column.
2. **Calibration.** The theorems' constants (ρ, λ, q, b, c₀, c_E, the ladder's exchange rate) are ledger estimators, never assumed. A mechanism with an uncalibrated constant is a hypothesis, not a component.
3. **Deterministic code owns policy.** Where a rule can be executed deterministically, it must be (gates, budgets, dispatch thresholds, edit mechanics). The model spends judgment only where residual entropy actually lives (M2). This is P4+P16 fused into one law.
4. **Data-dependent algorithm dispatch.** The algorithm class switches with the spec's tags (fix_shape single→SBFL ranking; multi→hitting set; interference-tagged→DAG-scheduled interventions; p\*-low→fallback). No single algorithm is "the framework" — the dispatch table is.
5. **Precompute vs. explore.** Any I(R;·) extraction that is task-independent is done offline by the unmetered path (HIVE). The metered loop buys only task-dependent bits. Violations are measurable: re-derivation shows up as repeat-action and low bits/turn in the ledger.
6. **Bounded state as sufficient statistics.** Every in-context structure is bounded (journal lines, packet tiers, disclosure levels) and the bound is a tunable rate-distortion knob. Unbounded state is a compaction casualty waiting to happen.
7. **Fallback is a first-class class.** Every classifier in the framework has a reject row with a calibrated threshold (Chow). Over-confidence in fine classes is the measured disease (03); the reject row is the cure with a theorem behind it.

**Anti-law (ceremony test).** A proposed structure that cannot name (a) its theorem, or (b) its ledger-measurable rent, is cut. The framework's history (MC3's fabricated-evidence offenders) shows that unmeasured structure *attracts* unmeasured claims.

## 6. Counter-angle: where the math does not transfer (and what to do instead)

| Transfer temptation | Why it fails here | What to do instead |
|---|---|---|
| "Hitting sets are NP-hard → we need heuristics/greedy" | Hardness is asymptotic; instances ≤10³ close exactly in ms (M20 is about large n) | Run exact (HS-DAG / ILP); keep greedy as a documented scale hedge |
| "Asymptotic complexity should drive structure choice" | All graph/matrix ops here are μs; complexity differences are invisible next to one model turn | Choose by information-per-token and determinism, not by big-O |
| "Huffman-optimal prompt compression" | Compression churns the prefix; KV prefix caching (verified: shared-prefix KV reuse) pays more than code length saved | Stable prefixes, stable ordering, stable formats — redundancy that buys cache hits |
| "Full Bayesian machinery for everything" | Tens-of-nodes factor graphs don't need MCMC; ceremony slows the loop | Closed-form/loopy-BP at small scale; measure λ instead of modeling more |
| "Submodular greedy has guarantees → always greedy-MI" | Masking breaks (adaptive) submodularity (4.2) — the guarantee is conditional, and the condition fails exactly on interference tasks | Dispatch: greedy under ρ≈0; DAG-scheduled interventions when tagged |
| "More taxonomy classes = more precision" | Interior optimum (M15); measured degradation past it (03) | Chow reject row; granularity sweep k∈{2,4,8,12} as the calibration experiment |
| "Algorithmic cleverness differentiates the agent" | Every competitor has the same μs-scale algorithms; the differentiators are measured turn economics (E[T] terms) | Invest in the ledger, the ladder, the gates — the things that move bits/turn |

The pattern: the math is *true* but its constants and asymptotics live at scales this domain doesn't inhabit. Transferring a theorem without transferring its scale is how frameworks acquire ceremony. The seven laws' calibration clause is the guard.

## 7. Ergonomics: designing for the two readers

**The model's ergonomics.** Bounded state (law 6) so compaction never orphan's the agent; canalized exploration (ladders, ranked lists, cones) so free-form entropy is spent only where evidence is genuinely task-dependent; deterministic prefixes so cache hits survive; normalized action vocabularies so loop detection works; journals as STATE/NEXT/WHY triples so post-compaction resumption is mechanical. Each of these is a theorem-backed device (M2, M5, M7), not prompt aesthetics.

**The human's ergonomics.** Specs are contracts the human can read (P5); gates are bitsets the human can diff; receipts are audit stubs the human can check; the ledger's derived tables are the human's dashboard; the claims-audit rule ("no number without a receipt ID") makes honest reporting *cheaper* than fabrication. The framework's epistemic hygiene (the MC3 integrity findings) is a usability property: dishonest structure was only ever available where measurement was missing.

**The shared object.** Both readers consume the same artifacts (spec, ledger, receipts) — P8's single source of truth extended across the human/model boundary. The framework has no channel where the human and the model hold different beliefs about what happened; that is the ergonomic foundation of trust in an autonomous loop.

## 8. Worked micro-example: httpx_3672 through the stack

The council's reference case (GitHub-API-verified facts: encode/httpx PR #3672 "Server connection handling.", +62/−27, 8 files, merged 2025-09-19; 5 defects B1–B5 with B1-masks-B2; fix order B3→B1→B2→B4→B5; naive 28-turn vs BCF 12-turn traces labeled ILLUSTRATIVE by 16). Walked through the harmony stack:

| Step | Component (row in `01`) | Structure/algorithm at work | Theorem doing the justifying |
|---|---|---|---|
| Spec | Spec schema | `depends_on` captures B1→B2 masking edge; fix_shape=multi | M10 exposition DAG |
| Order derivation | Kahn + Tarjan | Frontier {B3, B4, B5} first, {B1} then {B2}; no SCC | M11 topological scheduling |
| Localization | Spectra + prior | Distance-decay re-rank around the confirmed seed (B3) | M12 + M1 |
| Probe selection | Greedy-MI within region | Cheapest test separating B3 candidates | M13 (submodular regime, ρ small locally) |
| Masking handling | Intervention | Patch B1 → observe B2 becomes visible (signature change) | M16 + Prop 4 falsifier (masked-fault probe) |
| State carry | Ring journal + packet | STATE block survives compaction at turn ~8 | M7 bottleneck operating point |
| Validation | Cascade V0→V2 | B-patches die or pass in ms–s; gates bitset | M6 + cascade cost ordering |
| Budget | Token bucket | 12 turns vs 28: E[T] terms R_int, R_rec ≈ 0 | M4 master equation |
| Record | Ledger + receipt | Every above event logged; λ updated from B1→B2 distance | Calibration law 2 |

Twelve turns instead of twenty-eight is the arithmetic of the master equation: each eliminated re-diagnosis (M10), each cache-hit prefix, each deterministic bit is a term. That is "ergonomically performant" made concrete.

## 9. Open questions this synthesis raises

1. **Is the exchange rate (bits/token) stable enough across repos to calibrate the disclosure ladder globally, or per-repo?** Probe-able on the T2 mined tier (16's) with the ledger's promotion statistics.
2. **Does the greedy-MI certificate's failure boundary track measured ρ exactly?** Prediction: on tasks where the ledger records interference, greedy-MI stalls before the DAG intervention would — a falsifiable E-experiment for the paper track.
3. **What is the empirically optimal journal bound** (the rate-distortion knob of law 6) — 30 lines is folklore until swept.
4. **Chow thresholds under distribution shift:** c₀/c_E ratios fit on public tasks vs T2-mined held-out repos — how much drift before the reject row's calibration costs points?
5. **Does prefix-cache amortization change the optimal *packet* tier** (T1 vs T2), since re-injected stable packets are cheap to re-read? If yes, the bottleneck optimum shifts — a genuinely novel rate-distortion-with-cache problem worth a short paper section.


---

<!-- ====================================================================== -->
<!-- FILE: 03-implementation-cookbook.md -->
<!-- ====================================================================== -->

# 03 — Implementation Cookbook: The Structures Behind the Harmony

**Run:** `independent_research/2026-10-01-bcf-dsa-full-circle/` · 2026-10-01
Python 3.12/3.13 sketches for each component of `01`'s master table. Each recipe: the code, the unit test's *expected result*, and the theorem the code guarantees. Stdlib only unless noted. These are design skeletons for the Kaggle build (composite plan O1–O6 implements several of these), not a library.

---

## 1. Spec → derived fix order (Tarjan SCC + Kahn)

```python
from collections import defaultdict, deque

def tarjan_scc(graph: dict[str, list[str]]) -> list[list[str]]:
    """Tarjan 1972. Returns SCCs; any SCC of size >1 is a mutual-masking set."""
    index, low, on, stack, sccs, counter = {}, {}, set(), [], [], [0]
    def strong(v):
        index[v] = low[v] = counter[0]; counter[0] += 1
        stack.append(v); on.add(v)
        for w in graph.get(v, []):
            if w not in index:
                strong(w); low[v] = min(low[v], low[w])
            elif w in on:
                low[v] = min(low[v], index[w])
        if low[v] == index[v]:
            comp = []
            while True:
                w = stack.pop(); on.discard(w); comp.append(w)
                if w == v: break
            sccs.append(comp)
    for v in graph:
        if v not in index: strong(v)
    return sccs

def derive_fix_order(bugs: list[dict]) -> list[list[str]]:
    """bugs: [{id, depends_on: [ids]}]. Raises on mutual masking (math: an SCC
    is a non-identifiability certificate — the spec must be re-authored, listing
    the SCC as ONE set-diagnosis fault, per M16). Otherwise returns the Kahn
    frontier schedule: batches of faults whose prerequisites are all repaired."""
    ids = [b["id"] for b in bugs]
    graph = {b["id"]: list(b.get("depends_on", [])) for b in bugs}
    for comp in tarjan_scc(graph):
        if len(comp) > 1:
            raise ValueError(f"mutual masking set {sorted(comp)}: collapse into one fault or add evidence")
    indeg = {i: len(graph[i]) for i in ids}
    children = defaultdict(list)
    for i, deps in graph.items():
        for d in deps: children[d].append(i)
    frontier = deque(sorted(i for i in ids if indeg[i] == 0))  # sorted => byte-stable
    order, seen = [], set()
    while frontier:
        batch = sorted(frontier); frontier.clear()
        order.append(batch)
        for u in batch:
            seen.add(u)
            for c in children[u]:
                indeg[c] -= 1
                if indeg[c] == 0 and c not in seen: frontier.append(c)
    if sum(len(b) for b in order) != len(ids):
        raise ValueError("cycle leaked past SCC check (impossible)")
    return order
```

- **Unit tests / expected results.** `httpx`-shaped spec B3,B1→B2,B4,B5 (B2 depends_on B1) → `[[B3,B4,B5],[B1],[B2]]`. Spec with A↔B → raises with `{A,B}` in the message. Single fault → `[[F1]]`.
- **Theorem guaranteed.** M10/M11 — every emitted batch is a legal exposition frontier; batch-internal order is free (all topological orders cost-optimal under order-independent stage costs). Sorted batches double as the byte-stability input to prefix caching (§12).

## 2. Spectra bitsets + Ochiai + posterior re-rank

```python
def ochiai_scores(elements, failed, passed, activity) -> dict[str, float]:
    """activity[e] = (set_of_failed_tests_covering_e, set_of_passed_tests_covering_e).
    Ochiai = cosine of the e-column against the failing-test indicator — the
    monotone-similarity relaxation of Reiter (valid ONLY for single-fault tasks:
    M9). Represent the sets as Python ints (arbitrary-precision bitsets); popcount
    via int.bit_count() (3.10+)."""
    n_f = max(1, len(failed))
    out = {}
    for e in elements:
        f, p = activity[e]
        a = f.bit_count(); c = p.bit_count()
        out[e] = a / ((n_f * (a + c)) ** 0.5) if (a + c) else 0.0
    return out

def credible_rank(elements, scores, prior, lam, dist_from_seed):
    """Prop 1 re-rank: posterior-ish weight = score * prior * lam**dist.
    pi must be CALIBRATED (ledger per-rank hit rates) or the ranking costs more
    than nothing (03's measured result)."""
    w = {e: scores[e] * prior.get(e, 1.0) * (lam ** dist_from_seed.get(e, 0))
         for e in elements}
    return sorted(elements, key=lambda e: (-w[e], e))  # tie-break: byte-stable
```

- **Unit test / expected.** 4 elements, known spectra → scores within 1e-9 of hand-computed; tie elements keep sorted-id order.
- **Theorem.** M1 (expected rank cost Σi·i·π(i)) + M12 (distance-decay). The complexity column is honest: this is O(elements) with word-level popcount — microseconds; its value is *calibration*, not speed.

## 3. Conflict sets → minimal hitting sets (HS-DAG) + greedy hedge

```python
from itertools import combinations

def minimal_hitting_sets(conflicts: list[frozenset], cap=10000) -> list[frozenset]:
    """Greiner/Smith/Wilkerson-style enumeration with duplicate-node pruning
    (the HS-DAG correction to Reiter's HS-tree). Conflicts: failing tests'
    candidate sets. Returns minimal hitting sets = candidate diagnoses (M8).
    cap: enumeration guard (never approached at n<=10^3)."""
    mhs: list[frozenset] = [frozenset()]
    for cs in conflicts:
        nxt = []
        for h in mhs:
            if h & cs:
                nxt.append(h)                       # already hits this conflict
            else:
                for e in sorted(cs):
                    cand = h | {e}                  # expand one branch per element
                    if not any(k < cand for k in mhs if k & cs) and cand not in nxt:
                        nxt.append(cand)
        # prune supersets (minimality) then dedupe
        keep = [h for h in nxt if not any(o < h for o in nxt)]
        mhs = sorted(set(keep), key=lambda s: (len(s), sorted(s)))
        if len(mhs) > cap: break
    return mhs

def greedy_set_cover_hedge(conflicts) -> frozenset:
    """ln(n)-guaranteed fallback for scale hedges (Chvatal 1979). NOT the default:
    at n~129 exact wins because exactness is free (counter-angle, 02 §6)."""
    unhit, pick = set(map(frozenset, conflicts)), set()
    while unhit:
        e = max((c for cs in unhit for c in cs),
                key=lambda c: sum(1 for cs in unhit if c in cs))
        pick.add(e)
        unhit = {cs for cs in unhit if e not in cs}
    return frozenset(pick)
```

- **Unit tests / expected.** `[{A,B},{B,C}]` → `[{B},{A,C}]`. Three pairwise conflicts over {A,B,C} → all three singletons absent, pairs present as expected (verify by hand for the fixture). Dedup fixture: two identical conflicts → no duplicate expansions.
- **Theorem.** M8 (Reiter — diagnoses = min hitting sets), M20 (greedy guarantee as *hedge only*).

## 4. Reachability closure and interference cones (bitset Warshall)

```python
def transitive_closure(adj: dict[int, set[int]], n: int) -> list[int]:
    """Warshall on machine-word bitsets (Floyd 1962 Alg97 / Warshall 1962 /
    Purdom 1970 lineage). reach[i] bit j == path i->j. Runs ONCE per snapshot,
    OFFLINE (HIVE) — cones must never be derived on the metered path."""
    reach = [0] * n
    for i, outs in adj.items():
        reach[i] = (1 << i) | sum(1 << j for j in outs)
    for k in range(n):
        rk = reach[k]
        for i in range(n):
            if (reach[i] >> k) & 1:
                reach[i] |= rk
    return reach

def masked_by_cone(reach, v):  return reach[v]        # who masks v
def masks_cone(reach, v, n):   return sum((reach[i] >> v) & 1 and (1 << i) for i in range(n))
```

- **Unit test / expected.** Chain A→B→C: reach[A] has bits {A,B,C}, reach[C] = {C}. Cycle A↔B: both cones = {A,B} — feed to the SCC check (§1).
- **Theorem.** M10 support structure; cones are one of the five interference signatures (14), precomputed per law 5.

## 5. Distance-decay prior over the confirmed seed

```python
from collections import deque

def decay_weights(adj: dict[str, set[str]], seed: list[str], lam=0.6):
    """P(u|S) ~ P(u) * lam**d(u, v*) (M12). Multi-source BFS from the seed set;
    unvisited elements get d=+inf -> weight ~ 0 (exclude). lam is a LEDGER
    constant: estimated from the O11 micro-benchmark (hardlink pairs + gold-patch
    inversions), never assumed."""
    d, q = {s: 0 for s in seed}, deque(seed)
    while q:
        u = q.popleft()
        for w in adj.get(u, ()): 
            if w not in d: d[w] = d[u] + 1; q.append(w)
    return {u: lam ** dist for u, dist in d.items()}
```

- **Unit test / expected.** Path graph s—a—b—c, lam 0.5 → weights 1, .5, .25, .125; disconnected node absent from result.
- **Theorem.** M12 verbatim — the prior IS a BFS with exponential decay.

## 6. Edit path: anchor index, unique-anchor insert, diff verify

```python
import difflib

class AnchorIndex:
    """Inverted index from anchor token to line numbers, per snapshot (suffix
    array / Aho-Corasick territory at scale; a dict is exact and instant at
    file scale). Uniqueness is a HARD precondition: refuse on 2 matches."""
    def __init__(self, text: str):
        self.lines = text.splitlines()
        self.pos: dict[str, list[int]] = {}
        for i, ln in enumerate(self.lines):
            for tok in set(ln.replace("(", " ").replace(",", " ").split()):
                self.pos.setdefault(tok, []).append(i)
    def unique_line(self, anchor: str) -> int:
        hits = self.pos.get(anchor, [])
        if len(hits) != 1:
            raise ValueError(f"anchor {anchor!r}: {len(hits)} matches (need exactly 1)")
        return hits[0]

def insert_after(idx: AnchorIndex, anchor: str, new_text: str) -> list[str]:
    at = idx.unique_line(anchor)
    out = idx.lines[:at + 1] + new_text.splitlines() + idx.lines[at + 1:]
    return out

def verify_diff(before: list[str], after: list[str]) -> str:
    """Myers-family unified diff (difflib) — the model is shown the APPLIED diff,
    never the intended one. Deterministic byte plumbing = zero model judgment."""
    return "".join(difflib.unified_diff(before, after, lineterm="\n", n=2))
```

- **Unit tests / expected.** Anchor appearing twice → ValueError with count in message. Insert → file grows by exactly len(new_text.splitlines()). Hostile fixtures: backslash literals, CJK, `\uXXXX`, triple quotes — round-trip byte-identical.
- **Theorem.** Engineering row (determinism = free information; the escaping-failure economics from the council's edit-path findings).

## 7. Validation cascade + gate bitset

```python
class GateSet:
    """G0..G6 as one int. Bit i set = gate i passed. Printable, diffable across
    runs, additive (open-closed P2): a new gate is a new bit, never a rewrite."""
    NAMES = ["G0_spec_valid", "G1_patch_applies", "G2_ast_parses", "G3_tests_pass",
             "G4_no_regressions", "G5_journals_clean", "G6_budget_ok"]
    def __init__(self): self.bits = 0
    def pass_gate(self, i): self.bits |= 1 << i
    def all_passed(self): return self.bits == (1 << len(self.NAMES)) - 1
    def render(self): return " ".join(f"{n}={'1' if (self.bits >> i) & 1 else '0'}"
                                      for i, n in enumerate(self.NAMES))

def validate_cascade(patch_path, spec, run) -> GateSet:
    """Cost-ordered cascade: ms -> ms -> s -> min. Only deterministic stages may
    BLOCK (13/14/09 converged rule); model judgment triggers rescue, never
    approval. Each stage's false-positive rate is a ledger-measured constant —
    the gate-removal ablation (G1/G5/G3) re-measures it periodically."""
    g = GateSet()
    if spec.is_valid(): g.pass_gate(0)
    if run.git_apply_check(patch_path): g.pass_gate(1)
    if run.ast_parses(patch_path): g.pass_gate(2)
    if run.targeted_pytest(spec.acceptance): g.pass_gate(3)
    if run.regression_suite(): g.pass_gate(4)
    if run.journal_placement_ok(): g.pass_gate(5)
    if run.budget_within_bounds(): g.pass_gate(6)
    return g
```

- **Unit test / expected.** Broken patch dies at G1 with G2..G6 untaken (short-circuit); full pass renders seven `=1` fields; serialization is stable across runs (bit order fixed).
- **Theorem.** M6 (Fano floor: pay expensive turns only past the cheap certain rejections) + cascade cost-ordering.

## 8. Rescue FSM

```python
from enum import Enum, auto

class RescueState(Enum): OK = auto(); R1_INTAKE = auto(); R2_BASELINE = auto(); R3_INDUCT = auto()

class RescueMachine:
    """Trip conditions (3 consecutive validation failures / 3 identical tool
    calls / 4 edits no growth / budget<25% no valid patch) are checked by CODE
    against ledger counters; transitions are total (no renegotiation under
    stress — P6). R3 MUST write the induced invariant to the journal or the
    failure repeats (training data for negative-recovery turns, O8)."""
    TRIP = dict(val_fail=3, repeat_action=3, no_growth_edits=4, budget_pct=25)
    def __init__(self): self.state = RescueState.OK; self.counters = dict.fromkeys(self.TRIP, 0)
    def tick(self, event: str, journal) -> RescueState:
        if self.state is RescueState.OK:
            for k, lim in self.TRIP.items():
                if event == k and (self.counters[k] := self.counters[k] + 1) >= lim:
                    self.state = RescueState.R1_INTAKE; journal.write("STATE", "rescue R1", k)
        elif self.state is RescueState.R1_INTAKE and event == "spec_reread":
            self.state = RescueState.R2_BASELINE; journal.write("STATE", "rescue R2", "")
        elif self.state is RescueState.R2_BASELINE and event == "baseline_green":
            self.state = RescueState.R3_INDUCT; journal.write("STATE", "rescue R3", "")
        elif self.state is RescueState.R3_INDUCT and event == "invariant_written":
            self.state = RescueState.OK; self.counters = dict.fromkeys(self.TRIP, 0)
        return self.state
```

- **Unit tests / expected.** 3× `val_fail` → R1 + journal record; full path R1→R2→R3→OK resets counters; unknown events are no-ops (total function).
- **Theorem.** R_rec bounded by protocol (M4 term); trip detection reuses §9's loop detector.

## 9. Ring-buffer journal + normalized-action loop detection

```python
from collections import deque
import hashlib

class Journal:
    """Bounded deque (law 6): O(1) append, fixed memory, tail = STATE block.
    ~30 lines is the rate-distortion KNOB, tunable via ledger hit-statistics —
    folklore until swept (open question 02 §9.3). Kept OUTSIDE the repo tree
    (/tmp) so `git diff HEAD` never swallows it (Day-0 probe)."""
    def __init__(self, cap=30):
        self.buf: deque = deque(maxlen=cap); self.seen: dict[str, int] = {}
    def normalize(self, tool: str, target: str, arg_shape: str) -> str:
        """Regex-free normalization: drop volatile fragments (line numbers,
        counts) so near-identical calls collide — this is the loop detector's
        key AND the memoization key (§12)."""
        return f"{tool}|{target}|{arg_shape}"
    def write(self, kind: str, what: str, why: str = ""):
        key = self.normalize(kind, what, why[:16])
        self.seen[key] = self.seen.get(key, 0) + 1
        self.buf.append(f"{kind}: {what}" + (f" | why: {why}" if why else ""))
    def state_block(self, k=6) -> str:
        return "\n".join(list(self.buf)[-k:])
    def repeat_count(self, key: str) -> int:
        return self.seen.get(key, 0)
```

- **Unit tests / expected.** 40 writes → len(buf)==30 (oldest evicted); 3 near-identical edit calls → repeat_count==3 (rescue trip); distinct edits stay distinct; state_block returns last k lines verbatim (post-compaction re-injection fixture).
- **Theorem.** M2/M7 (sufficient statistic as bounded state).

## 10. Reducer packets (content-hash delta snapshots)

```python
import hashlib, json

def packet_hash(lines: list[str]) -> str: 
    return hashlib.sha256("\n".join(lines).encode()).hexdigest()[:16]

class ReducerPacket:
    """T0 full / T1 symbol-level / T2 hypothesis-level = the bottleneck's
    operating points (M7). Reconstruction applies deltas (Myers-family diff);
    schema version pinned so replay never breaks. Re-inject VERBATIM after any
    compaction event (threshold 14336) — the agent never resumes stateless."""
    SCHEMA = "packet-v1"
    def __init__(self, tier, lines):
        self.tier, self.lines = tier, lines
        self.h = packet_hash(lines); self.prev = None; self.delta = None
    def update(self, new_lines):
        import difflib
        self.delta = list(difflib.unified_diff(self.lines, new_lines, lineterm="", n=1))
        self.prev, self.h = self.h, packet_hash(new_lines)
        self.lines = new_lines
    def render(self): 
        return json.dumps(dict(schema=self.SCHEMA, tier=self.tier, h=self.h,
                               prev=self.prev, delta_n=len(self.delta or []),
                               body=self.lines))
```

- **Unit test / expected.** update() twice → chained hashes differ, prev tracks; render round-trips through json.loads; tier field survives.
- **Theorem.** M5/M7 — tier is the rate knob; the T0/T1/T2 ablation measures the curve.

## 11. Dispatch table with the Chow reject row

```python
def chow_threshold(c0_generic_tokens, cE_wrong_tokens) -> float:
    """Chow 1970: reject iff p* < 1 - c0/cE. c0 = ledger mean cost of the
    generic path; cE = ledger mean cost of a wrong-class repair. COMPUTED,
    not vibes. Example: c0=1800, cE=6000 -> threshold 0.70."""
    return 1.0 - c0_generic_tokens / cE_wrong_tokens

def dispatch(task_class: str, p_star: float, thresholds, table):
    """table maps class -> profile; the LAST row is the reject/fallback row.
    Over-fine classes are the measured disease (03: LOO 6.57 vs 5.84); the
    reject row is the theorem-backed cure (M14, M15)."""
    thr = thresholds[task_class]
    return table[task_class] if p_star >= thr else table["__fallback__"]
```

- **Unit test / expected.** c0=1800, cE=6000 → 0.700; p*=0.69 → `__fallback__`; p*=0.75 → class profile; unknown class → `__fallback__` (never KeyErrors into a guess).
- **Theorem.** M14 + M15, with ledger-calibrated constants (law 2).

## 12. Ledger, receipts, memoization, prefix-stable layout

```python
import json, time, hashlib, functools

class Ledger:
    """Append-only JSONL + hash-chained receipts (event sourcing + Merkle-style
    tamper evidence). kill -9 mid-run leaves a valid partial ledger and NO
    receipt; a completed run yields exactly one (composite plan C.2.1 unit
    test). OTel GenAI field names."""
    def __init__(self, path):
        self.f = open(path, "a", encoding="utf-8"); self.last_receipt_h = None
    def event(self, name, **fields):
        rec = dict(name=name, t=time.time(), **fields)
        self.f.write(json.dumps(rec, ensure_ascii=False) + "\n"); self.f.flush()
    def receipt(self, run_id, git_commit, config_hash, task_ids, metrics):
        body = json.dumps([run_id, git_commit, config_hash, sorted(task_ids), metrics],
                          sort_keys=True)
        h = hashlib.sha256((self.last_receipt_h or "") + body).hexdigest()[:16]
        self.event("receipt", receipt_id=f"REC-{run_id}-{h}", git_commit=git_commit,
                   config_hash=config_hash, metrics=metrics)
        self.last_receipt_h = h

def memoized_tool(cache, journal):
    """LRU memoization keyed by the SAME normalized string as loop detection —
    a cache hit means (a) zero tokens spent and (b) a repeat the rescue machine
    should hear about. The two structures share one key on purpose."""
    def deco(fn):
        @functools.lru_cache(maxsize=256)
        def cached(key, *a, **kw): return fn(*a, **kw)
        def wrap(tool, target, arg_shape, *a, **kw):
            key = journal.normalize(tool, target, arg_shape)
            journal.write(tool, target, arg_shape)
            if key in cached.cache_info() and False: pass  # (bookkeeping only)
            return cached(key, *a, **kw)
        return wrap
    return deco

def prefix_stable_prompt(system_prompt_lines, task_block, evidence_block):
    """Byte-stable >=2048-token system prefix FIRST (sorted where order is
    free, e.g. frontier batches from §1), volatile task content LAST. Rationale:
    vLLM APC reuses cached KV for shared prefixes (verified live 2026-10-01,
    docs.vllm.ai) — stability beats minimal encoding (02 §6, counter-angle)."""
    return "\n".join(system_prompt_lines) + "\n\n=== TASK ===\n" + task_block + evidence_block
```

- **Unit tests / expected.** Receipt chain: second receipt's hash differs from first and commits to it; two runs of `prefix_stable_prompt` with identical inputs are byte-identical (`==` assert); journal key for (tool,target,shape) collides exactly when normalize says so.
- **Theorem.** Law 2 (calibration instrument), P7/P11 (event sourcing, idempotency), thread 4 (KV-level memoization).

## 13. Governor: token bucket + priority allocator + stop rule

```python
import heapq, time

class TokenBucket:
    """Admission control: every tool call costs against the per-task bucket;
    backpressure surfaces as budget-aware prompts, never as surprises. Mechanism
    (this class) is policy-free — caps and thresholds are ledger data (P13)."""
    def __init__(self, cap, refill_per_sec):
        self.cap, self.rate = cap, refill_per_sec; self.tok = cap; self.ts = time.monotonic()
    def admit(self, cost) -> bool:
        now = time.monotonic(); self.tok = min(self.cap, self.tok + (now - self.ts) * self.rate)
        self.ts = now
        if self.tok >= cost: self.tok -= cost; return True
        return False

def allocate(tasks, value, cost, reserve_frac=0.10, p80=None):
    """Priority queue by value-per-cost; soft cap at the 80th percentile of
    successful-solve costs (14's v2); 10% global reserve. Order-agnostic by
    construction (task shuffle does not change per-task policy)."""
    order = sorted(tasks, key=lambda t: -value(t) / max(cost(t), 1e-9))
    budget = sum(cost(t) for t in order) * (1 - reserve_frac)
    plan, spent = [], 0
    for t in order:
        c = min(cost(t), p80) if p80 else cost(t)
        if spent + c > budget: break
        plan.append((t, c)); spent += c
    return plan

def should_raise_cap(p_old, p_new, c, o) -> bool:
    """15's stop rule: raise the cap while p'/p = 1/(c+o) — marginal-gain
    stopping, the same certificate family as lazy-greedy submodular stops and
    the odds theorem (Bruss 2000). p = solve probability at current cap."""
    return p_new / max(p_old, 1e-9) > 1.0 / (c + o)
```

- **Unit tests / expected.** Bucket: admit(cost=cap) once then refuse until refill elapses. Allocator: 10 tasks, reserve 10% → Σ planned ≤ 0.9·Σ cost; shuffling input leaves the per-task decisions identical. Stop rule: p 0.10→0.14, c=3,o=1 → 1.4 > 0.25 → raise.
- **Theorem.** M18 (stop rule), order-statistic policy; P13 split.

## 14. Build-order note (mapping to the composite plan)

These recipes slot into the MC3 master plan as: §1/§7/§8 → O4+O3 (Sprint 1–2), §2–§5 → O7 (Sprint 2–3), §9/§12 → O2 (Day 0), §13 → O6 (Sprint 2 v1, Sprint 5 v2), §3–§4 → O11's instruments (paper track), §11 → the taxonomy task of O12. Nothing here is new process — it is the *internal design* of components the plan already schedules.


---

<!-- ====================================================================== -->
<!-- FILE: 04-verification-and-sources.md -->
<!-- ====================================================================== -->

# 04 — Verification Log, Bibliography, and QC

**Run:** `independent_research/2026-10-01-bcf-dsa-full-circle/` · 2026-10-01 · all external calls via research-toolkit/HTTP per the v4 system prompt (no WebSearch/WebFetch tools, no MCP quota, $0 PAYG)

---

## 1. Method and engine rounds

This run's external work was **verification-shaped**, not discovery-shaped: the synthesis rests on the local corpus (BCF compendium, §5 formal framework, MC3 outputs), and the web rounds existed to pin the classical DS&A citations' exact metadata. Four rounds were needed because two free bibliographic APIs throttled this IP:

| Round | Engine | Targets | Outcome |
|---|---|---|---|
| 0 | Browser (headed, pre-warmed, folder profile) | 3 pages | vLLM APC docs (×2 URL forms incl. redirect), HNSW arXiv abstract — all OK |
| 1 | dblp.org publ API (curl, 1.6 s spacing) | 36 | **Abandoned**: HTTP 429 rate-limits → HTML error bodies → connection refusals (temp IP block). Zero usable records; log kept for audit |
| 2 | Semantic Scholar Graph API (3.5 s spacing, 429 backoff) | 36 | **Unusable**: sustained 429s on the unauthenticated pool. Kept running as secondary; contributed nothing |
| 3 | **Crossref REST API** (polite pool, mailto UA, 2.2 s spacing) | 36 | **32/36 direct MATCH**; 2 more resolved from saved-JSON top hits (Nemhauser–Wolsey–Fisher, Aho–Corasick); 1 resolved via arXiv API (Golovin & Krause); 1 dropped (Dasgupta — see §5) |

Raw payloads: `scratch/pages/crossref/*.json`, `scratch/pages/s2/`, `scratch/pages/verify1-*.md`, `verify2-*.md`; scripts and console logs in `independent_research/scratch/bcf-dsa-notes/` (`verify-dblp.mjs`, `verify-s2.mjs`, `verify-crossref.mjs`, `*-results.md`, `*-console.log`). All fetched content was treated as data per v4 Appendix H; no instructions in any page were followed (none found).

Browser round-0 evidence lines: vLLM docs — "Automatic Prefix Caching (APC) allows the vLLM engine to reuse cached KV (key-value) pairs from previous prompts if a new query shares the same prefix … set `enable_prefix_caching=True`" (`scratch/pages/verify2-1.md`, fetched 2026-10-01T08:22Z via CDP pointer-verified browser). HNSW — exact title/authors/abstract on arXiv 1603.09320 (`scratch/pages/verify1-3.md`).

## 2. Verified bibliography (Crossref round 3 unless noted)

| Key | Verified record |
|---|---|
| Greiner/Smith/Wilkerson 1989 (HS-DAG) | Greiner, Russell A.; Smith, Barbara A.; Wilkerson, Ralph W. "A correction to the algorithm in Reiter's theory of diagnosis." *Artificial Intelligence* 41(1):79–88, 1989. doi:10.1016/0004-3702(89)90079-9 |
| Chvátal 1979 (greedy set cover) | Chvátal, V. "A greedy heuristic for the set-covering problem." *Mathematics of Operations Research* 4(3):233–235, 1979. doi:10.1287/moor.4.3.233 |
| Nemhauser/Wolsey/Fisher 1978 (submodular greedy) | Nemhauser, G. L.; Wolsey, L. A.; Fisher, M. L. "An analysis of approximations for maximizing submodular set functions—I." *Mathematical Programming* 14:265–294, 1978. doi:10.1007/bf01588971 |
| Slavík 1997 (tight greedy analysis) | Slavík, Petr. "A tight analysis of the greedy algorithm for set cover." *Journal of Algorithms* 25(2):237–254, 1997. doi:10.1006/jagm.1997.0887 |
| Feige 1998 (ln n threshold) | Feige, Uriel. "A threshold of ln n for approximating set cover." *Journal of the ACM* 45(4):634–652, 1998. doi:10.1145/285055.285059 |
| Golovin & Krause (adaptive submodularity) | Golovin, Daniel; Krause, Andreas. "Adaptive Submodularity: Theory and Applications in Active Learning and Stochastic Optimization." arXiv:1003.3967 (verified via arXiv API; authors/title exact). Journal version commonly cited as *JACM* 58(4), 2011 — **JACM record not surfaced by Crossref this run** (three query forms + one DOI guess all failed; DOI guess 10.1145/1989727.1989729 resolves to a different paper), so the venue carries this note rather than a false precision. v5 correction: Theorem 13 weakened after Nan & Saligrama (2017) found a proof flaw — the guarantee now reads squared-logarithmic approximation under an additional strong adaptive-submodularity condition |
| Chow 1970 (reject rule) | Chow, C. K. "On optimum recognition error and reject tradeoff." *IEEE Transactions on Information Theory* 16(1):41–46, 1970. doi:10.1109/tit.1970.1054406 |
| Lengauer & Tarjan 1979 (dominators) | Lengauer, Thomas; Tarjan, Robert Endre. "A fast algorithm for finding dominators in a flowgraph." *ACM TOPLAS* 1(1):121–141, 1979. doi:10.1145/357062.357071 |
| Weiser 1984 (slicing) | Weiser, Mark. "Program Slicing." *IEEE TSE* SE-10(4):352–357, 1984. doi:10.1109/tse.1984.5010248 |
| Tarjan 1972 (SCC/DFS) | Tarjan, Robert. "Depth-First Search and Linear Graph Algorithms." *SIAM Journal on Computing* 1(2):146–160, 1972. doi:10.1137/0201010 |
| Kahn 1962 (topological sort) | Kahn, A. B. "Topological sorting of large networks." *Communications of the ACM* 5(11):558–562, 1962. doi:10.1145/368996.369025 |
| Myers 1986 (O(ND) diff) | Myers, Eugene W. "An O(ND) difference algorithm and its variations." *Algorithmica* 1(1–4):251–266, 1986. doi:10.1007/bf01840446 |
| Aho & Corasick 1975 | Aho, Alfred V.; Corasick, Margaret J. "Efficient string matching" [full title: "…: An aid to bibliographic search"]. *Communications of the ACM* 18(6):333–340, 1975. doi:10.1145/360825.360855 |
| Bloom 1970 | Bloom, Burton H. "Space/time trade-offs in hash coding with allowable errors." *Communications of the ACM* 13(7):422–426, 1970. doi:10.1145/362686.362692 |
| Auer et al. 2002 (UCB1) | Auer, Peter; Cesa-Bianchi, Nicolò; Fischer, Paul. "Finite-time Analysis of the Multiarmed Bandit Problem." *Machine Learning* 47(2–3):235–256, 2002. doi:10.1023/a:1013689704352 |
| Thompson 1933 | Thompson, William R. "On the Likelihood that One Unknown Probability Exceeds Another in View of the Evidence of Two Samples." *Biometrika* 25(3/4):285–294, 1933. doi:10.2307/2332286 |
| Bruss 2000 (odds algorithm) | Bruss, F. Thomas. "Sum the odds to one and stop." *The Annals of Probability* 28(3):1384–1391, 2000. doi:10.1214/aop/1019160340 |
| MacKay 1992 (active selection) | MacKay, David J. C. "Information-Based Objective Functions for Active Data Selection." *Neural Computation* 4(4):590–604, 1992. doi:10.1162/neco.1992.4.4.590 |
| Nowak 2011 (GBS) | Nowak, Robert D. "The Geometry of Generalized Binary Search." *IEEE Transactions on Information Theory* 57(12):7893–7906, 2011. doi:10.1109/tit.2011.2169298 |
| van Dongen 2000 (MCL) | van Dongen, Stijn Marinus. "Graph clustering by flow simulation." PhD thesis, University of Utrecht, 2000. **[thesis — not Crossref-indexed; secondary verification via MSeer (Gao & Wong, TSE 2017, MC3-verified) which builds on it]** |
| Malkov & Yashunin (HNSW) | "Efficient and robust approximate nearest neighbor search using hierarchical navigable small world graphs." arXiv:1603.09320 (browser-verified, exact title/authors/abstract) and *IEEE TPAMI* 42(4):724–736, 2020 print (Crossref: TPAMI 2020, vol 42). doi:10.1109/tpami.2018.2889473 (Crossref record) |
| Kwon et al. 2023 (vLLM/PagedAttention) | Kwon, Woosuk; Li, Zhuohan; Zhuang, Siyuan; Sheng, Ying; Zheng, Lianmin; Yu, Cody Hao; Gonzalez, Joseph; Zhang, Hao; Stoica, Ion. "Efficient Memory Management for Large Language Model Serving with PagedAttention." *SOSP 2023*. Crossref MATCH (proceedings) |
| Härder & Reuter 1983 (recovery/WAL) | Härder, Theo; Reuter, Andreas. "Principles of transaction-oriented database recovery." *ACM Computing Surveys* 15(4):287–317, 1983. doi:10.1145/289.291 |
| Warshall 1962 | Warshall, Stephen. "A Theorem on Boolean Matrices." *Journal of the ACM* 9(1):11–12, 1962. doi:10.1145/321105.321107 |
| Floyd 1962 (Algorithm 97) | Floyd, Robert W. "Algorithm 97: Shortest path." *Communications of the ACM* 5(6):345, 1962. doi:10.1145/367766.368168 |
| Purdom 1970 (transitive closure) | Purdom, Paul. "A transitive closure algorithm." *BIT Numerical Mathematics* 10(1):76–94, 1970. doi:10.1007/bf01940892 |
| Manber & Myers (suffix arrays) | Manber, Udi; Myers, Gene. "Suffix Arrays: A New Method for On-Line String Searches." *SIAM Journal on Computing* 22(5):935–948, 1993 (SODA 1990 conference version). doi:10.1137/0222058 |
| Viola & Jones 2001 (cascade) | Viola, Paul; Jones, Michael. "Rapid object detection using a boosted cascade of simple features." *CVPR 2001* (Crossref MATCH; the IJCV 39(1):137–154 journal companion exists) |
| Huffman 1952 | Huffman, David. "A Method for the Construction of Minimum-Redundancy Codes." *Proceedings of the IRE* 40(9):1098–1101, 1952. doi:10.1109/jrproc.1952.273898 |
| de Kleer & Williams 1987 | de Kleer, Johan; Williams, Brian C. "Diagnosing multiple faults." *Artificial Intelligence* 32(1):97–130, 1987. doi:10.1016/0004-3702(87)90063-4 (journal version verified; IJCAI-87 conference companion same year) |
| Abreu et al. (SBFL accuracy) | Abreu, Rui; Zoeteweij, Peter; van Gemund, Arjan J. C. "On the Accuracy of Spectrum-based Fault Localization." *TAIC-PART 2007* (Crossref MATCH; the *JSS* 2009 practical-evaluation companion is the more commonly cited form) |
| Lamport 1978 (happens-before) | Lamport, Leslie. "Time, clocks, and the ordering of events in a distributed system." Crossref returned the 2019 *Concurrency: the Works of Leslie Lamport* reprint (doi:10.1145/3335772.3335934); the original is *CACM* 21(7):558–565, 1978 **[original venue per common citation; Crossref surfaced the reprint this run]** |
| Merkle 1980 (hash trees) | Merkle, Ralph C. "Protocols for Public Key Cryptosystems." *1980 IEEE Symposium on Security and Privacy*, p. 122, 1980. doi:10.1109/sp.1980.10006 |
| Fredman & Tarjan (Fibonacci heaps) | "Fibonacci Heaps and Their Uses in Improved Network Optimization Algorithms." *FOCS 1984*, 338–346, doi:10.1109/sfcs.1984.715934 (journal version *JACM* 34(3):596–615, 1987) |
| vLLM APC (docs, round 0) | vLLM documentation, "Automatic Prefix Caching," docs.vllm.ai (fetched 2026-10-01; mechanism statement quoted in §1) |

**Corrections this verification produced** (vs. what the scratch notes and the drafts initially said): Slavík is 1997 *J. Algorithms* (not 1996); the canonical NWF 1978 submodular-greedy paper is in *Mathematical Programming* (not *Math OR*); Nowak's exact title is "The Geometry of Generalized Binary Search"; HNSW's TPAMI print year is 2020; Manber–Myers' journal version is SICOMP 1993; Greiner's DOI ends 90079-9; my recalled JACM DOI for Golovin–Krause was **wrong** (it resolves to Fagin/Kimelfeld/Kolaitis "Probabilistic data exchange") — tested and discarded rather than cited. Deliverables 01/02 were edited post-verification where a slip had landed in text (Malkov print year; Slavík year).

## 3. Inherited-verified cluster (from the MC3 run, not re-verified here)

Reiter 1987 ("A Theory of Diagnosis from First Principles," AIJ 32(1)) · Zheng et al. ICML 2006 · Gao & Wong MSeer TSE 2017 + ICSE 2018 tool · DiGiuseppe & Jones ISSTA 2011 + EMSE 2015 · Debroy & Wong ICST 2010 + JSS 2014 · Offutt 1992 TOSEM · An et al. arXiv 2108.04455 (311/326) · Nashid 2506.04418 + 2511.11012 · ChainSWE 2607.02606 · BayesFLo 2403.08079 · Callaghan PhD thesis 2026 Stellenbosch · Al-Bataineh ASE 2024/2025 · SkillOpt repo (17,919★, live 2026-09-30) · Campos et al. ASE 2013 DOI 10.1109/ASE.2013.6693085 (cited in the local §5 framework). Status tables: `independent_research/scratch/mc3-notes/CITATION-VERIFY.md`.

## 4. Table QC (rendering and alignment)

Command (pipe-count uniformity: every row of a markdown table must carry the same number of `|` as its header, and code fences are excluded):

```bash
for f in README.md 01-bcf-dsa-map.md 02-math-cs-harmony-guide.md 03-implementation-cookbook.md 04-verification-and-sources.md; do
  awk -F'|' 'BEGIN{code=0} /^```/{code=!code; next} code{next}
    substr($0,1,1)=="|" { if(!intab){block++; intab=1; want=NF} if(NF!=want) bad++ }
    substr($0,1,1)!="|" { intab=0 }
    END{printf "%-36s blocks=%d %s\n", FILENAME, block, (bad?bad" BAD ROWS":"QC-PASS")}' "$f"
done
```

Checks every contiguous table block outside code fences: all rows in a block must carry the same pipe count as the block's header (the failure mode that actually breaks GFM rendering — ragged columns). Final run after all fixes:

```
README.md                            blocks=1 QC-PASS
01-bcf-dsa-map.md                    blocks=1 QC-PASS
02-math-cs-harmony-guide.md          blocks=5 QC-PASS
03-implementation-cookbook.md        blocks=0 QC-PASS
04-verification-and-sources.md       blocks=3 QC-PASS
```

Defects found and fixed by the QC pass (the check earned its keep): three ragged rows in 01's master table and seven in 02's M-table, all caused by conditional-probability bars (`H(R|E_L)`, `E[T_loc|c]`, `|[F]|`, …) inside cells — one genuinely unescaped, the rest `\|`-escaped (GFM-legal but flagged). All in-cell math bars were normalized to the U+2223 divides symbol `∣`, which cannot collide with the cell delimiter in any renderer. Alignment-width is not enforced cell-by-cell (markdown renders regardless); ragged pipe counts are what breaks tables.

## 5. Unverified, dropped, or flagged

| Item | Status | Handling |
|---|---|---|
| Dasgupta, "Analysis of a greedy active learning strategy," NIPS 2004 | Not surfaced by Crossref (pre-2012 NIPS coverage is spotty); no arXiv version | **Dropped from the bibliography**; the greedy-acquisition claims stand on Nowak 2011 + Golovin & Krause + MacKay 1992, all verified. Scratch notes still mention it as a lead |
| Cooper/Harvey/Kennedy 2001, "A simple, fast dominance algorithm" | Tech report — not Crossref-indexed by design | Cited as tech-report status where mentioned; dominator content in this run rests on Lengauer–Tarjan (verified) |
| Golovin & Krause JACM venue | Venue not pinned this run (§2 note) | Cited as arXiv:1003.3967 with the venue note |
| Lamport 1978 original CACM | Crossref surfaced the 2019 reprint | Venue noted inline |
| dblp round | Fully 429-blocked | Negative result recorded here; no records used |
| Semantic Scholar round | Fully throttled | Negative result recorded; no records used |

## 6. Provenance footer

- Local corpus read in full before external calls: `bcf/BCF-Reference-Compendium.md`; `independent_research/2026-09-29-bcf-fault-interference-deliverables/bcf-whitepaper-draft3-section5-formal-framework-2026-09-29.md`; MC3 report + special sections 1–4.
- External: 3 browser page fetches (round 0), 72+ bibliographic API calls across three engines (rounds 1–3), 0 paid credits, 0 MCP quota, WebSearch/WebFetch tools never used.
- Intermediates: `independent_research/scratch/bcf-dsa-notes/` (scope, deep-thread notes, three verifier scripts + logs + results tables).
- Fetched pages are UNTRUSTED DATA (v4 Appendix H); no instruction-like text was found or followed in any payload.

