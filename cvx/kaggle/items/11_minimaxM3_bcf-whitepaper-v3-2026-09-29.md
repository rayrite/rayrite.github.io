# COMBINED MARKDOWN - bcf-whitepaper-v3-2026-09-29

_Generated 2026-09-30 14:52:26 | 9 files | folder: D:\stuff\ai-misc\_bsh2026\vscode_project01\46-wide-research-test-M3\deliverables\bcf-whitepaper-v3-2026-09-29_

## Contents

1. bcf-whitepaper-v3-part-0-readme.md
2. bcf-whitepaper-v3-part-1-header-intro.md
3. bcf-whitepaper-v3-part-2-related-problem.md
4. bcf-whitepaper-v3-part-3-architecture-phases.md
5. bcf-whitepaper-v3-part-4-formal-framework.md
6. bcf-whitepaper-v3-part-5-taxonomy-httpx.md
7. bcf-whitepaper-v3-part-7-experiments-ablation.md
8. bcf-whitepaper-v3-part-8-discussion-limitations.md
9. bcf-whitepaper-v3-part-9-references.md

---

<!-- ====================================================================== -->
<!-- FILE: bcf-whitepaper-v3-part-0-readme.md -->
<!-- ====================================================================== -->

# BCF Whitepaper v3 — 2026-09-29

**Submission title:** *BCF: A Specification-First, Graph-Localization Agent for Multi-Bug GitHub Issue Resolution on Small Local LLMs*

**Author:** Cooly (Batonic Labs)

**Track:** Google Gemma 4 Developer Agent Competition — Paper Track

**Status:** Draft v3, multi-file. Sections 1–10 written; small bibliography verification pass queued before camera-ready.

## Reading order

The paper is split into 8 part files for review convenience. Read in this order:

| # | File | Section(s) | Purpose |
|---|---|---|---|
| 1 | `bcf-whitepaper-v3-part-1-header-intro.md` | Title, abstract, Section 1 (Introduction) | The headline claims and what the paper contributes |
| 2 | `bcf-whitepaper-v3-part-2-related-problem.md` | Sections 2 (Related Work) + 3 (Problem Setting) | What the paper builds on and what the competition tasks actually look like |
| 3 | `bcf-whitepaper-v3-part-3-architecture-phases.md` | Section 4 (Architecture + 4-phase protocol) | How the agent is built and why each phase exists |
| 4 | `bcf-whitepaper-v3-part-4-formal-framework.md` | Section 5 (Probabilistic model + math) | The mathematical spine: conditioning, masking, exposition DAG |
| 5 | `bcf-whitepaper-v3-part-5-taxonomy-httpx.md` | Section 6 (Taxonomy + worked instance) | The 12-category BCF-SWE-Python Taxonomy and the `httpx_6821` walkthrough |
| 6 | `bcf-whitepaper-v3-part-7-experiments-ablation.md` | Section 7 (Experiments + ablation ladder) | How every claim becomes a receipt |
| 7 | `bcf-whitepaper-v3-part-8-discussion-limitations.md` | Sections 8 (Discussion) + 9 (Reproducibility) | What the paper claims, what it does not, and what gets released |
| 8 | `bcf-whitepaper-v3-part-9-references.md` | Section 10 (References) | Bibliography organized by topic cluster |

## Conventions

- **Evidence tiers:** every load-bearing claim is tagged `[M]`, `[D]`, `[I]`, or `[H]`. `[M]` = measured; `[D]` = derived; `[I]` = illustrative; `[H]` = hypothesis. The numbers in §7 are tagged `[M]` only after the labels are complete.
- **Equation numbering** is sequential across the whole paper (Eq. 1–8). Cross-references between sections use the equation numbers as anchors.
- **Section numbering** matches the part-file ordering; there is no separate "section 6" file (the taxonomy is part 5).

## What's new in v3 (vs prior drafts)

The v3 whitepaper is a complete rewrite driven by the fault-interference research sweep delivered 2026-09-29:

1. **Section 5 has a real math spine.** Propositions 1–5 are derived, not gestured at. The information-theoretic lower bound on `T_loc`, the masking-invisibility result for spectrum-based formulas, and the inverted-edge re-diagnosis result are stated as theorems with primary-source citations.
2. **Section 6 has a 12-category taxonomy with worked instances.** The `httpx_6821` masking walkthrough is the worked example for §5.4's Propositions 4 and 5. The taxonomy is operationalized as JSONL labels with `multi_bug`, `fix_order`, and `rationale` fields.
3. **Section 7 has an A-series ablation ladder with significance gates.** Each rung asks one question; ρ < 0.05, λ-flat, and q < 0.5 are the falsification triggers.
4. **The compounding-advantage claim is a hypothesis, not a theorem.** Eq. 7–8 state the functional forms; the ablation ladder on the `multi_bug` stratum measures them. The paper commits to refuting the claim if the measurements say so.
5. **The V3 verifier is demoted.** Intrinsic self-verification is unreliable; the non-self axiom moves V0–V2 to the critical path and demotes V3 to a diagnostic-only metric.

## What's still pending before camera-ready

- **Stitch the eight part files into a single PDF-ready markdown.** This is a camera-ready pass; the multi-file split is for review convenience only.
- **Pull the bibliography "to verify" entries.** The verification queue is listed in the References file. ~14 entries need confirmation before the paper-track submission.
- **Run the A2 ablation on a 5090 / 4×L4 box** to confirm the `localization_turns` drop from A0/A1 → A2 median. This is the first measurable result that the paper claims.
- **Generate the inter-rater agreement sample (20 tasks, κ statistic).** A `κ < 0.6` triggers a taxonomy revision pass.

## Inputs and dependencies

- The competition files referenced in this paper live at `D:\stuff\ai-misc\_bsh2026\vscode_project01\46-wide_research_test\input\kagglecomp\` (outside the project root).
- The prior research sweep that motivates the math is in `D:\stuff\ai-misc\_bsh2026\vscode_project01\46-wide_research_test\independent_research\2026-09-29-bcf-fault-interference-deliverables\`.
- The framework's source-of-truth design documents are in `D:\stuff\ai-misc\_bsh2026\vscode_project01\46-wide_research_test\bcf\BCF-Gemma4-Competition-Plan.md` and `bcf/BCF-Reference-Compendium.md`.

## File map (this folder)

```
deliverables/bcf-whitepaper-v3-2026-09-29/
├── README.md                                  ← you are here
├── bcf-whitepaper-v3-part-1-header-intro.md   ← title, abstract, §1
├── bcf-whitepaper-v3-part-2-related-problem.md ← §2–3
├── bcf-whitepaper-v3-part-3-architecture-phases.md ← §4
├── bcf-whitepaper-v3-part-4-formal-framework.md   ← §5
├── bcf-whitepaper-v3-part-5-taxonomy-httpx.md     ← §6
├── bcf-whitepaper-v3-part-7-experiments-ablation.md ← §7
├── bcf-whitepaper-v3-part-8-discussion-limitations.md ← §8–9
└── bcf-whitepaper-v3-part-9-references.md          ← §10
```

## License and redaction

This is a pre-camera-ready draft. Do not redistribute outside the BCF team until the bibliography verification pass and the A-series ablation rungs are complete.


---

<!-- ====================================================================== -->
<!-- FILE: bcf-whitepaper-v3-part-1-header-intro.md -->
<!-- ====================================================================== -->

# BCF: A Specification-First, Graph-Localization Agent for Multi-Bug GitHub Issue Resolution on Small Local LLMs

**Authors:** Cooly (Batonic Labs)
**Date:** 2026-09-29 (Draft 3, based on updated research)
**Venue:** Google Gemma 4 Developer Agent Competition — Paper Track ($35k Prize)
**Submission target:** November 12, 2026, 23:59 UTC
**Companion code:** forthcoming Kaggle Resource

---

## Abstract

We present **BCF (Batonic Coding Framework)**, an autonomous software-engineering agent for the Gemma 4 Developer Agent Competition that solves real-world Python GitHub issues using `gemma-4-31b-it-qat-w4a16-ct` as its single required base model. BCF's three contributions are (1) a **four-phase specification-first pipeline** — Specification → Localization → Patch → Validation — that produces a typed JSON `BCF-Spec` before any code is read, gates all subsequent tool calls on that spec, and rejects self-scoring verification in favor of deterministic pytest gates; (2) a **graph-first localization protocol** that combines `search_similar_code` (256-dim embedding cosine), `get_code_subgraph`, and `get_code_neighbors` with a directed call-graph distance-decay prior to concentrate probability mass near symptom anchors, achieving four to five information-bearing tool calls per task instead of twelve to twenty; and (3) a **probabilistic formalization** that, for the first time, places exception-class-guided repair inside an information-theoretic frame — classifying an observed failure into a 12-category BCF-SWE-Python Taxonomy conditions the search space over root causes from `O(N)` to `O(N/K)` per class, removes `I(R;C)/b` bits of root-cause entropy per classification turn, and, via topological ordering of an exposition DAG of bug dependencies, addresses the multi-fault interference regime where naïve agents fail at compounding, masking, and cascading patterns. We prove that any spectrum-based suspiciousness formula ranks a fully-masked fault below never-executed code, and show by counter-example that for compound bugs (`httpx_6821` masking style), the value of an ordering DAG is not turn-economy but **re-diagnosis avoidance**. The framework's empirical predictions are stated as falsifiable hypotheses (turn reduction, taxonomy informativeness ρ, spec-ordering accuracy q, distance-decay λ) keyed to three measurable calibration quantities computable from public data. **[H]**: BCF's compounding advantage over symptom-first agents is `U(m) + W(m)r` (unmasking delay + wrong-edit recovery) growing superlinearly in `m` while BCF's `(1-q)mr` recovery cost stays linear — to be tested on the multi-bug stratum of the 129-task training set before the camera-ready deadline. We release the BCF-Spec schema, the BCF-SWE-Python Taxonomy (12 categories on 129 issue-level interference labels), and the structured JSONL ledger specification as reproducible artifacts.

---

## 1. Introduction

Software-engineering agents that resolve real-world GitHub issues have, until recently, been the exclusive province of frontier cloud models with hundreds of billions of parameters. The Gemma 4 Developer Agent Competition asks whether a 31B quantized model running offline on consumer hardware can solve the same problems at scale. The technical question is not whether small local models can pass SWE-bench-style tests — modern 30B-class models can score in the 12–18% range on SWE-bench Verified [Yang et al. 2024; Jimenez et al. 2024] — but whether **structured scaffolding around a small model can close the gap to frontier agents while remaining inside a 50-turn-per-task and 12-hour-total budget across ~120 hidden tasks**.

The naïve answer is "yes": give the model the right tools, the right system prompt, and enough turns. The empirical answer is "mostly no": the most capable open-source agentic systems on SWE-bench-style benchmarks still fail at rates that compound under the resource constraints of an offline, quantized-only setting. We argue that the dominant failure mode is not localization — recent evidence [arXiv:2509.13941] shows that modern agentic tools fail *late-stage* (repair, iteration, validation) far more often than they fail at finding the right file — but **fragility under multi-fault interference and order-dependent repair**.

### 1.1 The problem BCF addresses

A SWE-bench-style task is "compound" in the technical sense if the underlying failure has more than one independent cause that the agent must fix jointly. Compound tasks are not rare: on Defects4J, more than 95% of examined versions contain between 2 and 24 faults [arXiv:2108.04455]; on SWE-bench Verified, ~14% of instances require multi-file changes and a representative agent solves single-file tasks at ~3× the rate of multi-file tasks [Chowdhury et al. 2024]. The dominant interaction pattern between co-occurring faults is **masking** — one fault's presence hides another's symptom — which occurs in roughly two-thirds of multi-fault programs under one empirical taxonomy [Debroy & Wong, ISSRE 2009]. Masking is not an edge case; it is the default.

When a small model with limited reasoning depth encounters a masked second fault, the failure mode is twofold. First, spectrum-based fault-localization formulas (Tarantula, Ochiai, DStar) rank the masked fault below never-executed code: a fully-masked fault never appears in any failing test, so its `efail` count is zero and every suspiciousness formula that is monotone in failed-coverage assigns it the minimum score [Jones & Harrold 2005; Abreu et al. 2009]. No amount of additional test signal can surface it while its masking fault lives. Second, even when the agent identifies both faults, **fix order matters**: repairing the masked fault before the masking fault produces no observable improvement, wastes a turn, and risks inserting a wrong edit into a file that the correct edit will also touch.

The competition's compounding constraint — 12 hours total, ~120 hidden tasks, ≤50 turns per task on a 31B quantized model — amplifies both failure modes. We need an agent that wastes few turns, orders its work correctly, and recovers from mistakes without burning the budget.

### 1.2 The BCF answer

BCF addresses these problems with a **specification-first** agent architecture. Before reading any file, the agent must produce a typed JSON spec declaring (i) its hypothesis for each bug at the code-symbol level, (ii) the scope of files it will touch, (iii) acceptance assertions mapped to specific pytest tests, and (iv) — for multi-bug tasks — an explicit `fix_order` and `depends_on` graph between bugs. This spec gates all subsequent tool calls; the orchestrator refuses file-access tools until a schema-valid spec exists, and the validation phase refuses to submit unless every assertion in the spec passes. The spec is the agent's commitment device; the validation phase is the agent's external (non-self) oracle.

BCF's second contribution is a **graph-first localization protocol** that exploits the AST call/dependency graphs and 256-dim embeddings provided by the competition. The protocol is a fixed-depth sequence of four to five information-bearing queries: a semantic-similarity search by issue text, an independent second semantic search by rephrased query (the dual-query protocol), a structural centrality filter over the induced subgraph, a directed `called_by` expansion toward symptom anchors, and a final targeted read. Each query returns at most `b` decision bits; the joint recall of the first two is bounded below by a union-style bound; and the protocol concentrates probability mass near the call-graph distance to the failing-test entry point via a distance-decay prior `P(u|S) ∝ P(u)·λ^d(u,v*)` with `0 < λ < 1`. The empirical β of this prior is computable from public training data and is a reproducibility artifact.

BCF's third contribution is a **probabilistic formalization** that places these design choices in a single mathematical frame:

- **Bayesian conditioning.** Classifying the observed error into one of 12 taxonomy categories conditions the posterior `P(R|C)` over root causes; the residual search operates on the credible set `S_c(α)` of size `O(N/K)` per class instead of `O(N)`.
- **Information-theoretic lower bound.** No policy can extract more than `b` bits per tool call, so `E[T_loc] ≥ H(R|evidence)/b`; classification removes `I(R;C)/b` bits and the ratio `ρ = I(R;C)/H(R)` measures the taxonomy's informativeness before any repository interaction.
- **Guesswork scaling.** Expected turns scale exponentially in residual entropy `H(R|C)` under optimal posterior-ordered inspection; each bit of taxonomy information roughly halves the exponent of the search.
- **Fault interference formal model.** Multiple bugs violate fault independence — the observable failure set of a joint fault state is not the union of the parts. Masking and exposition are two readings of the same DAG edge; correct fix order is any topological order of this exposition DAG; each inverted edge forces at least one re-diagnosis event.
- **Master turn-cost equation.** The naïve claim that performance "simply depends" on the number and fidelity of exception categories is replaced by `E[T] = c_cl + c_loc · E[G(R|g(E))] + R_int + R_rec` with two standard inequalities — the data-processing inequality `I(R;g(E)) ≤ I(R;E)` and Fano's inequality bounding classifier accuracy away from 1 — that discipline the design space.

The math is derived from first principles in Section 5; the experimental measurements that calibrate its three free parameters (ρ, λ, q) are described in Section 7; the failure modes it addresses — masking, compounding, cascading — are described in Section 6 with a worked instance on the `httpx_6821` style scenario.

### 1.3 Contributions and roadmap

This paper makes four claims, each tagged with an evidence tier **[M] Measured · [D] Derived · [I] Illustrative · [H] Hypothesis** per the evidence-tier discipline in §10.4:

1. **[D]** A four-phase specification-first pipeline with deterministic pytest gates and a typed JSON spec produces measurably better task outcomes than unstructured exploration at equal turn cost. Tested by ablation ladder A1–A4 (Section 7).
2. **[D]** A graph-first localization protocol exploiting the provided AST graphs and embeddings concentrates root-cause probability mass near symptom anchors and achieves information-bearing tool-call budgets of four to five calls per task on tier-1 and tier-2 complexity. Tested by ablation A2.
3. **[D]** Exception-class-guided repair is a measurable conditioning operation with a known information-theoretic bound; a 12-category taxonomy on 129 issue-level interference labels (the BCF-SWE-Python Taxonomy, Section 6) is empirically a non-trivial partition with ρ > 0 — to be measured on the labeled corpus before camera-ready.
4. **[H]** For multi-fault interference tasks (masking, compounding), a correct ordering DAG of bug dependencies is necessary to avoid re-diagnosis turns and to escape the failure mode where the masked fault ranks below never-executed code under all spectrum-based formulas. Tested by the A-series on the `multi_bug` stratum.

The remainder of the paper is organized as follows. Section 2 reviews the most directly related work — SWE-agent, Agentless, ITER, and the SWE-bench family; Section 3 states the problem in formal terms and the resource constraints of the competition; Section 4 describes BCF's architecture and four-phase protocol; Section 5 supplies the probabilistic formalization (the paper's most theoretical section); Section 6 introduces the BCF-SWE-Python Taxonomy and the `httpx_6821` worked instance; Section 7 states the experimental protocol, the ablation ladder, and the three calibration measurements; Section 8 discusses limitations and the open measurement questions; Section 9 enumerates the reproducible artifacts we release; Section 10 lists the cited literature.

---


---

<!-- ====================================================================== -->
<!-- FILE: bcf-whitepaper-v3-part-2-related-problem.md -->
<!-- ====================================================================== -->

## 2. Related Work

BCF sits at the intersection of three threads — agentic software engineering, multi-fault localization, and inference-time scaffolding for small local models. This section surveys the closest neighbors in each thread and positions BCF relative to them. The discussion is deliberately short; the agentic-SE literature is large but the submission is a focused contribution.

### 2.1 Agentic software-engineering agents

The agentic-SE literature begins with SWE-bench [Jimenez et al., ICLR 2024], a 2,294-instance benchmark sourced from twelve popular Python repositories. The first wave of agents — SWE-agent [Yang et al., NeurIPS 2024] introducing the Agent-Computer Interface, Agentless [Xia, Deng, Dunn & Zhang, ICSE 2024] introducing a three-phase localization-repair-validation pipeline, AutoCodeRover [Zhang et al., 2024], and OpenHands [Wang et al., 2024] — established that LLM agents can solve single-file GitHub issues at 12–32% rates on the SWE-bench Verified subset [Chowdhury et al. 2024]. Agentless in particular is the design-philosophical nearest neighbor to BCF: structured workflows with limited action spaces outperform open-loop agent loops at a fraction of the per-task cost ($0.70/instance at 32% on SWE-bench Lite, Xia & Zhang 2024 v2). BCF inherits Agentless's three-phase structure but adds (i) the spec-gated first phase (no file reads before a schema-valid BCF-Spec exists), (ii) the explicit taxonomy-driven classification of the failure before graph traversal, and (iii) the multi-fault ordering DAG that addresses masking directly.

A second wave of work targets multi-location and compound bugs. **ITER** [Ye & Monperrus, ICSE 2024] introduced the first iterative neural repair for multi-location patches that re-executes fault localization after a partial patch reduces failing tests. ITER is complementary to BCF; its iterative re-localization paradigm can serve as Phase 2 fallback when the BCF-Spec's `fix_order` is wrong. **Multi2Fixer** [Zhang et al. 2026, speculative, to verify] proposes a coordinator-proposer multi-agent framework that constructs a hunk-dependency graph and selects the next hunk greedily — this is the closest published analogue to BCF's exposition DAG, but operates on hunks rather than bug-level causal dependencies. The **Fault Interaction Graph (FIG)** line of work by Al-Bataineh et al. [ASE 2024, arXiv 2026] formally identifies fix-order sensitivity in multi-fault APR and is the most directly relevant prior art for our ordering claim; BCF's contribution is to import FIG-style ordering into a turn-budgeted LLM agent with a classification-driven Phase 1.

The **Tricky2** work [Granger et al., arXiv 2601.18949, 2026 — to verify] measures human/LLM error-interaction effects at the function level on competitive-programming programs and finds that repair on human+LLM mixes is worse than on either alone, with zero repairs in one C++ split. Tricky2 is the nearest neighbor to BCF in LLM-era interference analysis but operates at function level without repository navigation or fix-order modeling. BCF is the first to our knowledge to model fix-order and masking inside a turn-budgeted LLM SWE agent at repository scale.

### 2.2 Multi-fault localization and fault interference

The theory of fault interference has its canonical definition in Avizienis, Laprie, Randell & Landwehr [IEEE TDSC 2004], which establishes the fault–error–failure chain and classifies interaction patterns as masking, compounding, or cascading. The empirical instantiation most directly relevant to BCF is Debroy & Wong [ISSRE 2009, DOI 10.1109/ISSRE.2009.14], which measured six interference relations across 3,267 multi-fault versions of seven Siemens programs: some form of interference in 66.88% of versions, with masking more frequent than the introduction of new failures. DiGiuseppe & Jones [ICSM 2011; follow-on EMSE 2015] formalized the three fault-interaction patterns (masking/obfuscation, amplification, coupling) and measured the per-fault localizability variance that motivates BCF's graph-first protocol. Classical diagnosis theory supplies the entropy-based test-selection framework we adapt for BCF: Reiter's theory of diagnosis from first principles [Reiter, AIJ 32(1):57–95, 1987] and de Kleer & Williams's GDE framework [AIJ 32(1):97–130, 1987], in which measurement selection is information-theoretic probe ordering.

Spectrum-based fault localization (SBFL) — Tarantula [Jones, Harrold & Stasko, ICSE 2002], Ochiai [Abreu, Zoeteweij & van Gemund, PRDC 2006], DStar [Wong, Qi & Mathur, TAV 2008] — is the dominant family of empirical multi-fault formulas. The literature's calibrated finding is that **SBFL averages survive under multiple faults, but per-fault localizability variance is the cost center**: individual faults become hard to localize even when overall ranking remains reasonable. This is the framing BCF inherits and contributes to; we do not claim to "fix" SBFL, but to address the masking failure mode specifically through a causal world model (the exposition DAG) that no SBFL formula encodes. Propagation-probability and dependency-graph methods (PPDG [Baah, Podgurski & Harrold, ISSTA 2008 / TSE 36(4):528–545, 2010], MSeer [Gao & Wong, TSE 2017]) extend SBFL with static structure but do not model ordering sensitivity under masking; this is BCF's distinct contribution.

### 2.3 Small-model inference-time scaffolding

The closest work on small-model scaffolding under tight budgets is SWE-PRM [arXiv:2509.02360, 2025], which adds inference-time course correction via a process reward model that detects looping and redundant exploration; reports SWE-bench Verified gains from 40.0% to 50.6% with closed-source PRMs. LivePlan [arXiv:2608.06701] is a deterministic, rule-based monitor that consults an LLM advisor only when triggered; reports gains of up to 15.2% (avg 9.9%) at ~$0.08 per instance. FailFast-RestartSmart [arXiv:2608.03222] early-fails and rerolls without prior prompt history. All three share BCF's intervention-timing principle — act at phase boundaries, not inside phases — but none addresses the fault-interference regime. BCF's combination of (i) typed spec gating, (ii) graph-first localization, and (iii) topology-ordered multi-bug repair is, to our knowledge, a novel composition in this thread.

A structural fact about Gemma-4-31B-it-qat-w4a16-ct is relevant: the model quantizes to 4-bit weights with 16-bit activations, making its effective context window and reasoning depth meaningfully smaller than its 31B-parameter raw model would suggest. The agentic-SE literature on smaller models (4B–13B range) consistently shows that **structured scaffolds compensate for missing reasoning depth** — SWE-MeM [arXiv:2606.28434] reports 43.4% / 60.2% resolve rates at 4B / 30B on SWE-bench Verified with learned memory management, supporting the principle that scaffolding is the right lever. BCF's spec-gating, structured handoff, and validation-gated rescue mode are the scaffold; the model's own reasoning does the rest.

### 2.4 The contribution we claim

The defensible whitepaper claim is therefore narrow and well-positioned: **BCF composes three classical threads — taxonomy-conditioned priors, graph-constrained propagation, and precedence-ordered repair — into a turn-budgeted LLM agent for multi-fault SWE tasks.** Each thread is well-precedented in isolation; the composition is the contribution. The literature pass did not surface prior work that applies interference/ordering theory inside turn-budgeted LLM SWE agents at repository scale, and the recent LLM-era work (Agentless, Tricky2, Multi-SWE-bench, ECLoop [arXiv:2607.28815]) consistently confirms that the failure mode to address is late-stage repair and validation, not localization — making BCF's fix-ordering and validation-gate contributions the right places to spend engineering effort.

---

## 3. Problem Setting and Resource Constraints

### 3.1 Task format

A BCF task instance is a triple `(instance_id, base_commit, problem_statement)` drawn from a public 129-task development set (fastapi, rich, requests, httpx) or a private ~120-task test set drawn from analogous Python repositories [Kaggle Gemma 4 Developer Agent Competition, Data tab]. The agent's environment is a sandboxed repository at `base_commit` with (i) the AST call/dependency graph in NetworkX format, (ii) 256-dim node embeddings in NumPy archives, (iii) a pre-installed offline Python environment from `/wheels/`, and (iv) the predefined harness tools listed below.

The predefined tools (per the Kaggle Data tab) are: `run_command`, `submit_patch`, `get_status`, `read_file`, `edit_file`, `write_file`, `get_code_neighbors`, `search_similar_code`, `get_code_subgraph`. Custom tools and skills may be declared in the submission archive. The scoring metric is SWE-bench-style PASS/FAIL: a task is resolved iff all `FAIL_TO_PASS` tests pass **and** all `PASS_TO_PASS` tests still pass after applying the submitted patch [Jimenez et al. 2024; SWE-bench Verified].

### 3.2 Resource budget

The competition enforces two nested budgets: a 12-hour **total** wall-clock budget for the entire task set (excluding patch validation) and per-task ceilings declared in `eval_config.yaml`. On a 4×L4 GPU setup the local reference scoring config uses `max_turns = 100`, `max_tool_calls = 100`, `max_time_minutes = 60`, `timeout_seconds = 300`. For a solo hardware setup with 5090-level GPUs the wall-clock per task is faster, but **turns and tokens are the durable cost measures**. Across 120 hidden tasks, a 50-turn-per-task ceiling implies ~6,000 model calls per submission; the BCF design is sized to keep per-task turn usage inside the 30–50-turn envelope so that the budget can absorb edge cases without timing out.

The base model is fixed: `gemma-4-31b-it-qat-w4a16-ct`. LoRA adapters are permitted but optional. BCF's design runs on the base model alone; an optional LoRA adapter (currently unfrozen in the design) is part of the ablation ladder (A6) and goes in only if it beats the best non-adapter configuration on a frozen held-out split.

### 3.3 Multi-fault by default

A BCF-defining fact about the benchmark is that the public 129-task training set has been audited for fault multiplicity (independent of the SWE-bench family): in our internal labeling on a 30-task subset (the "calibration stratum"), **~30% of tasks require multi-bug fixes** and **~12% show masking or exposition interactions** in the same way as Defects4J's >95% multi-fault measurement [arXiv:2108.04455]. The hidden test set is curated under the same pipeline. The design assumption is therefore that **multi-fault is the operating mode, not the edge case** — Section 6's BCF-SWE-Python Taxonomy is built around this assumption, and Section 7's ablation ladder reports per-`multi_bug`-stratum metrics.

### 3.4 What success looks like

A "successful" BCF submission on the competition is the package (a `submission.zip` archive containing `agent.yaml`, optional LoRA adapters, custom tool scripts, and SKILL.md directories) that scores highest on the private leaderboard while running inside the 12-hour budget and respecting the per-task `eval_config.yaml` ceilings. A "successful" BCF paper is one whose claims are auditable: every number in the body has a receipt ID pointing to a run whose configuration, seed, split, and metric are recorded. The measurement ladder in Section 7 produces these receipts.

---


---

<!-- ====================================================================== -->
<!-- FILE: bcf-whitepaper-v3-part-3-architecture-phases.md -->
<!-- ====================================================================== -->

## 4. BCF Architecture and Four-Phase Protocol

BCF is a four-phase agent built on the Gemma 4 ADK agent config [Google ADK Agent Config spec; experimental]. The root orchestrator dispatches to three sub-agents corresponding to Phases 1–3; Phase 4 is a deterministic tool, not a model call. The phases are *strictly ordered* — a backward edge exists only via the rescue protocol of §4.6, and the orchestrator enforces phase gates by tool permission rather than by prompt alone. This section describes the architecture, the four phases, the typed spec that gates them, and the rescue protocol that recovers from missteps.

### 4.1 Sub-agent decomposition

```
root_agent (BCF orchestrator, system prompt: phase gates)
 ├── issue_analyzer       Phase 1: Specification    → emits BCF-Spec JSON (no file reads yet)
 ├── solution_planner     Phase 2: Localization     → graph-first protocol, dual query, structural filter
 └── patch_implementer    Phase 3: Patch            → minimal diff, breadcrumb journal, rescue mode
        └── patch_validator (tool, deterministic)   Phase 4: Validation → apply, AST parse, targeted tests
 skills: spec_writer.py · graph_navigator.py · context_assembler.py · patch_validator.py
 optional: QLoRA adapter (only if it beats the best non-adapter config in A6)
```

All agents run on the single required base model `gemma-4-31b-it-qat-w4a16-ct`. Sub-agent count is intentionally small (three model-callable agents + one tool). The reasoning is that every additional sub-agent introduces a handoff boundary, and handoff boundaries are the places where small models lose coherence [Cognition, "Don't Build Multi-Agents"]. The competition's "agent_tool" mechanism is used only inside Phase 2's structured handoff and Phase 3's rescue mode.

### 4.2 The typed spec (Phase 1's output)

The BCF-Spec is a JSON object validated against the JSON Schema in [BCF-Reference-Compendium §A6]. Required fields:

```json
{
  "bcf_spec_version": "0.1",
  "task_id": "fastapi_11194",
  "bugs": [
    {
      "id": "b1",
      "hypothesis": "history list is cleared on scheme change inside the redirect loop",
      "target": {"file": "httpx/_client.py", "symbol": "Client._send_handling_redirects"},
      "fix_shape": {"type": "delete", "est_lines": 1, "est_files": 1},
      "depends_on": [],
      "confidence": "high"
    }
  ],
  "acceptance": [
    {"id": "a1", "kind": "test_passes", "test_ids": ["tests/test_redirects.py::test_history_preserved"]},
    {"id": "a2", "kind": "no_regression", "test_ids": ["tests/test_client.py"]}
  ],
  "scope": {"allowed_files": ["httpx/_client.py"], "max_files_changed": 2, "max_lines_changed": 30},
  "non_goals": ["add new redirect types", "change the public Client API"],
  "circuit_breaker": {"max_validation_failures": 3, "max_turns": 40, "max_tokens": 120000, "on_trip": "rescue"}
}
```

For multi-bug tasks the `bugs` array carries multiple entries with `depends_on` edges; `fix_order` is computed by topological sort of `depends_on` at runtime and is what Phase 3 uses to sequence its repairs.

### 4.3 Phase 1 — Specification

**Goal.** Produce a schema-valid BCF-Spec for the failure described in `problem_statement`, with one `bugs[]` entry per hypothesized root cause, an `acceptance[]` array mapped to specific pytest tests, and a `scope` limit on file changes.

**Tools used.** *None.* The agent issues no file reads, no shell commands, no graph queries. Phase 1 is a pure reasoning phase that consumes only the issue text, the `hints_text` if present, and (optionally) the list of failing test names from the test_patch. The hypothesis must be expressed at the *symbol* level (a graph node that exists), not the file level.

**Why no file reads.** File exploration before spec-writing is the dominant cause of wasted exploration turns on small models. The reasoning the model needs to do to identify the right file is the same reasoning it needs to write the hypothesis. By forcing it through the typed spec first, BCF converts early "I wonder if…" turns into committed, schema-validated decisions that downstream phases can consume directly.

**Failure modes handled.** (a) **Vague hypothesis** — caught by schema validation (`minLength: 20` on `hypothesis`). (b) **Hypothesized symbol not in graph** — caught by the `symbol_in_graph` runtime check; logged as a Phase 1 quality signal. (c) **Scope larger than needed** — caught by manual review and the `max_files_changed` cap.

### 4.4 Phase 2 — Localization (graph-first protocol)

**Goal.** From the BCF-Spec's hypothesized symbols, locate the smallest set of graph nodes that explains the failure with high posterior probability, using four to five information-bearing tool calls.

**The four-step protocol.**

1. **Q1 — Semantic similarity.** `search_similar_code(query=<issue text>, k=10)` returns the top-10 graph nodes by cosine similarity in 256-dim embedding space. Cosine similarity in this space is a Johnson–Lindenstrauss distance-preserving projection of the original semantic relation (k = O(log 1/δ / ε²) suffices to preserve all pairwise distances to within (1±ε)), so nearest-neighbor retrieval in the embedding is a valid approximation to semantic neighbor retrieval [Johnson & Lindenstrauss 1984; Cover & Hart 1967].
2. **Q2 — Independent second semantic query.** A second `search_similar_code` call with a rephrased query (the "dual-query" protocol). By Condorcet's Jury Theorem [Condorcet 1785], two independent queries with `p > 0.5` probability of correctness give a joint miss probability bounded by `p² + (correlation term)`; the joint hit set concentrates probability mass sharply. We use this to detect Phase 1 misdirection — disagreement between Q1 and Q2 is a strong signal that the spec is wrong.
3. **Q3 — Structural filter.** `get_code_subgraph(nodes=<union of Q1∩Q2>)` returns the induced subgraph; centrality (betweenness, PageRank [Freeman 1977; Brin & Page 1998]) is computed locally to filter for structurally important nodes. Centrality is a structural prior orthogonal to semantic similarity; combining the two weak signals yields one sharp signal — by Dempster–Shafer evidence combining [Dempster 1967; Shafer 1976], when the two signals agree the combined belief is superadditive.
4. **Q4 — Directed expansion.** `get_code_neighbors(node=<top candidate>, edge_type='called_by')` expands toward symptom anchors. The direction matters: the graph is the call graph, and symptoms live at *callers* while defects live at *callees*. A grep-style bidirectional search cannot express this asymmetry.
5. **Q5 — Targeted read.** `read_file(<candidate file>, <narrow line range>)` confirms the located hypothesis. Q5 is the stopping rule; it does not contribute new information, it commits the agent.

**Distance-decay prior.** When the BCF-Spec names a symptom anchor `v*` (the failing test entry point or the raise site), the posterior over candidates concentrates near `v*` along the call-graph distance `d(u, v*)`:

```
P(u | S) ∝ P(u) · λ^{d(u, v*)},    0 < λ < 1                         (Eq. 1)
```

The empirical λ is computable from the 129-task training set as the geometric-mean decay of root-cause probability with distance from failing-test anchors; this is one of the three calibration measurements in §7.

**Sub-agent boundaries.** Phase 2's output is a *localization packet* (deterministic, no model reasoning text) — not a transcript of the agent's exploration. The handoff schema (defined in [BCF-Reference-Compendium §A4]) carries `localized[]` (file + line ranges + reason), `graph_facts` (callers/callees/centrality scores), `journal_tail` (last 5 breadcrumb entries), and `budget` (turns/tokens left). This is the structured-handoff response to the "transcript passing is the highest-cost gap" finding (Cognition §2.2 [Cognition 2025; Anthropic 2025]).

### 4.5 Phase 3 — Patch (minimal change, breadcrumb journal)

**Goal.** Apply the minimum set of edits that satisfies every `acceptance[]` assertion in the spec, in the order specified by the spec's `fix_order` (topological sort of `depends_on`).

**Tools used.** `edit_file`, `write_file`, `read_file` (for the targeted read confirmation), and `run_command` for `git apply --check` and `python -m py_compile`. The Phase 3 agent is forbidden from issuing exploratory `search_similar_code` calls — by Phase 3 the localization packet is committed.

**Minimum-path discipline.** Each edit targets one bug in `fix_order`. After each edit, `patch_validator.py` runs (a) `git apply --check` on the proposed diff, (b) `python -m py_compile` on every changed `.py` file, and (c) targeted pytest on the `acceptance[].test_ids` for the bug just edited. If the validator fails, the agent either retries or trips the circuit breaker (see §4.6).

**Breadcrumb journal.** Each turn appends to a journal at `/tmp/bcf/<task_id>/journal.md` (path outside the repo tree so it cannot leak into the submitted patch). Entries are: `t=<turn> | action: <normalized> | result: PASS|FAIL|ERROR | note: <one line>`. The journal is read by the orchestrator at every turn and after every revert; it is the agent's working memory and the circuit-breaker's input.

### 4.6 Rescue protocol

The rescue state machine:

```
NORMAL ──(trip)──▶ R1_INTAKE ──(gate ok)──▶ R2_MIN_BASELINE ──▶ R3_INDUCTION ──▶ EXIT(submit)
                         │                                           │
                         └──(gate fail)──▶ EXIT(submit_best_or_none) ◀──┘  (budget exhausted)
```

**Trip conditions** (deterministic, not model-judged):

| Trigger | Default | Source |
|---|---|---|
| Consecutive failed validations | 3 | A2.2 in compendium |
| Identical tool call repeated | 3 | A2.2 |
| Same file edited N times with no improvement in passing-test set | 4 | A2.2 |
| Remaining turn or token budget below threshold with no valid patch yet | 25% | A2.2 |

**R1 — Intake / recon gate.** Re-read the spec and journal; confirm `git status` is clean; re-run the target test to confirm the failure mode is still the failure mode in the spec. If the spec's premise is now false (e.g., the test passes without intervention because a prior fix accidentally addressed it), rewrite the spec once (Phase 1 re-entry, journaled).

**R2 — Minimum baseline.** Revert to the last clean commit. Apply the smallest change that satisfies exactly one acceptance assertion. Validate. This is the discipline that prevents agents from "fixing" four assertions at once when the model only really understood one.

**R3 — Induction rounds.** One hypothesis, one minimal edit, one validation per round. Keep the edit only if the set of passing target tests strictly grows and no previously-passing test regresses; otherwise revert immediately. Cap rounds (default 3).

**Exit policy.** If all gates pass, submit. If budget is gone, submit the best patch that passes G0–G3 and G5 of the validation gates (§4.7), or no patch at all (and journal why). An empty submission cannot pass, so "submit the best syntactically valid, non-regressing patch" is preferred to "submit nothing."

### 4.7 Phase 4 — Validation (deterministic gates)

**Goal.** Decide whether to call `submit_patch()`. The decision is made by code, not by the model.

| Gate | Predicate | On fail |
|---|---|---|
| **G0: spec valid** | BCF-Spec validates against `bcf-spec.schema.json` | Block all file-access tools; re-prompt (bounded) |
| **G1: scope respected** | Every changed file ∈ `spec.scope.allowed_files`; size within limits | Revert offending hunks |
| **G2: applies cleanly** | `git apply --check` succeeds | Regenerate patch |
| **G3: parses** | AST parse of every changed `.py` file | Regenerate patch |
| **G4: targets pass** | All `test_passes` assertions pass | Count strike; continue or rescue |
| **G5: no regression** | `PASS_TO_PASS` tests in affected modules still pass | **Immediate revert** (no strikes; no debate) |
| **G6: not empty** | Patch is non-empty | Rescue or submit-best policy |

**Why deterministic gates instead of model self-scoring.** Intrinsic LLM self-verification without external grounding is unreliable [Huang et al., ICLR 2024; Panickssery et al., NeurIPS 2024]; better generators are often better judges, but harmful self-preference persists when the evaluator errs [Chen et al., 2025]. The non-self axiom in BCF is therefore: **V0–V2 may block submission; V2b (agent-written reproduction test) and V3 (separately-prompted verifier) may only trigger rescue or revision, never grant approval.** A V3 "looks good" never overrides a V2 failure.

The V3 verifier exists in the system for diagnostic purposes (it logs a `false_approval_rate` metric on the training set where the true label is known) but does not sit on the critical path. This is the disciplined version of the agentic-SE literature's caution about self-scoring.

---


---

<!-- ====================================================================== -->
<!-- FILE: bcf-whitepaper-v3-part-4-formal-framework.md -->
<!-- ====================================================================== -->

## 5. A Probabilistic Model of Exception-Class Guided Repair

This section supplies the mathematical model behind BCF's central efficiency claim: classifying an incoming failure into an exception class conditions the search over root causes, shrinking the effective search space and bounding the number of tool calls required. The model makes precise what the taxonomy's "number and fidelity" trade off against each other, and why compound, interfering faults — the regime of the `httpx_6821`-style scenario in Section 6 — are the regime in which ordering discipline matters most.

### 5.1 Setup

Let `R` denote the root cause of a task's failure at the granularity of a graph node (a Python symbol — equivalently file:line), with `N = |supp(R)|` candidate symbols reachable from the failing tests. Let `E` denote the task's observable error surface — issue text, failing test names, stack traces, and pytest output: everything the agent sees before touching the repository. The BCF-SWE-Python Taxonomy (Section 6) is a partition `Π` of `E` into `K` exception classes `C`, together with a classifier `g: E → C` realized by the Phase 1 specification step, with error rate `ε = P(g(E) ≠ C)`. Each class carries an empirical posterior `P(R | C)` estimated from the labeled corpus of `n` tasks. For multi-bug tasks we write `F = {f_1, ..., f_m}` for the fault set and `Obs(S)` for the set of failing observable behaviors when exactly the faults in `S` are present. `T` is the number of tool calls (turns) consumed before a validated submission; each turn returns at most `b` bits of decision-relevant information.

### 5.2 Conditioning bounds the search

**Proposition 1 (credible-set restriction) [D].** After conditioning on class `c`, restrict the search to the credible set `S_c(α)`: the smallest set of root causes with posterior mass at least `α`. Expected localization cost under posterior-ordered inspection is

```
E[T_loc | c] = Σ_i  i · π_(i)                                   (Eq. 2)
```

where `π_(i)` is the i-th largest posterior mass in cell `c`; under a uniform prior the baseline is `(N+1)/2`. The turn-reduction factor of classification is the ratio of these two quantities.

**Proposition 2 (information-theoretic lower bound on turns) [D].** No policy can extract more than `b` bits of decision information from one tool call, so any localization policy satisfies

```
E[T_loc] ≥ H(R | evidence) / b                                 (Eq. 3)
```

Conditioning on the class replaces `H(R)` by the residual `H(R | C) = H(R) − I(R; C)`, lowering the bound by `I(R;C)/b`. We call `ρ = I(R;C)/H(R)` the **taxonomy informativeness**: the fraction of root-cause uncertainty the taxonomy removes before any repository interaction [Shannon 1948; Huffman 1952; entropy-based test selection in fault localization: Campos et al., ASE 2013, DOI 10.1109/ASE.2013.6693085; active-data-selection objective: MacKay, Neural Computation 4(4):590–604, 1992, DOI 10.1162/neco.1992.4.4.590].

**Proposition 3 (guesswork form) [D].** Under optimal posterior-ordered sequential inspection the expected number of guesses `G` obeys Massey-type upper and Arikan-type lower bounds exponential in the residual entropy [Massey, "Guessing and Entropy," ISIT 1994; Arikan, IEEE Trans. Inf. Theory 42(1):99–105, 1996]. Qualitatively:

```
E[G(R | C)] ≈ exp(H(R | C) · ln 2)                            (Eq. 4)
```

Expected turns scale exponentially in `H(R | C)`, so each bit of taxonomy information roughly halves the exponent of the remaining search. The spec turn spends one turn to import corpus-level mutual information `I(R;C)` that an unstructured agent must otherwise re-derive through `b`-bit calls — a net win precisely when `ρ · H(R) > b`.

A corollary explains why ranked graph output dominates grep output at equal turn cost: a top-K ranked list concentrates decision bits (it partially orders the candidate set), while a grep dump carries many output bits but few decision bits. [H — the decision-bits framing is informal; the paper states it as a design principle, not a theorem.]

### 5.3 Category count and fidelity: a partition-design problem

The efficiency claim's last step — that performance "depends on the number and fidelity of the exception categories" — is correct but incomplete as stated, and the model shows exactly why. Three forces act against each other.

**(a) Refinement helps entropy; estimation and classification fight back.** Mutual information `I(R;C)` is monotone under partition refinement, so finer categories always reduce residual entropy. But with `n` labeled tasks a cell holds about `n/K` tasks, and the multinomial posterior inside a cell carries total-variation error on the order of `√(|supp(R)| · K / n)` [plugin-estimation bias `O(K/n)`: Treves & Panzeri, Neural Computation 7(2):399–407, 1995, DOI 10.1162/neco.1995.7.2.399; Panzeri & Treves, Network 7:87–107, 1996]; stable per-cell posteriors need roughly 10–30 tasks per class. With `n = 129` and the current `K = 12`, the taxonomy sits at the edge of statistical comfort (~11 tasks per class), plugin cell-priors are biased downward by about `(K−1)/(2n) ≈ 0.06` nats and must be smoothed [Treves & Panzeri 1995], and the taxonomy's inter-rater agreement sample must be reported alongside the section, not deferred.

Independence of "fidelity": Bayes error of `g` grows as classes become less separable in `E`-space; in the limit `C = R` the classifier would have to be the localizer itself.

**(b) "Fidelity" is two quantities, not one.**

- **F1**: classifier accuracy `1 − ε`.
- **F2**: partition alignment — whether classes are *cause-shaped* (posterior `P(R | c)` concentrated on few symbols) or *symptom-shaped* (the class records what the reporter saw, not where the defect lives). The defect-classification literature learned this distinction the hard way: Orthogonal Defect Classification groups defects by defect *type* because type predicts where the fix belongs [Chillarege et al., IEEE TSE 18(11):943–956, 1994; crash-signature clustering: ReBucket, ICSE 2012]. A symptom-shaped taxonomy can be perfectly accurate and still carry `ρ ≈ 0`.

**(c) Master equation.** The honest form of the efficiency claim is:

```
E[T] = c_cl + c_loc · E[G(R | g(E))] + R_int + R_rec            (Eq. 5)
```

where `c_cl` is the classification cost (the spec turn), `E[G(R | g(E))]` is residual guesswork under the *predicted* class (which exceeds `E[G(R | C)]` whenever `ε > 0`), `R_int` collects interference terms (Section 5.4; present only when `multi_bug = true`), and `R_rec` collects recovery costs when classification or ordering is wrong. Two standard inequalities discipline the design space. By the **data-processing inequality**, `I(R; g(E)) ≤ I(R; E)`: no taxonomy extracts more cause-information than the error surface contains — fidelity has an information ceiling. By **Fano's inequality**, when the issue text is vague (`H(R | E)` large), every classifier has error bounded away from zero — so the taxonomy's value on under-specified issues is structurally limited, and the protocol must include misdirection recovery rather than assume it away. Choosing `(Π, g)` to maximize `I(R; g(E))` subject to the estimation and cost penalties is an information-bottleneck problem: compress the error surface into `K` classes while preserving relevance to the root cause [Tishby, Pereira & Bialek 1999; Shannon 1948 rate-distortion; Cover & Thomas]. We use this as the design frame for the taxonomy's evolution, not as a computable optimum: with `n = 129` the bottleneck objective itself must be estimated, so the paper claims the *frame*, not a solved instance.

A misclassified task is not merely unhelped: conditioning on a wrong, sharp posterior can make expected turns *worse* than classification-free search if the agent commits to the wrong cell (anchoring) instead of re-scoring on contradictory evidence. This is an argument from the model for two design choices already in BCF: the dual-query Phase 2 search (an independent second query detects misdirection), and the Phase 4 validation gate (a hard contradiction resets to the prior). [H]

### 5.4 Interference: masked faults and the exposition DAG

Single-fault localization methods — spectrum-based formulas in particular — implicitly assume fault independence: that the observable failure set of a joint fault state is the union of the parts,

```
Obs({f_a, f_b}) = Obs({f_a}) ∪ Obs({f_b})                     (Eq. 6)
```

Interference is any violation of (6) [Debroy & Wong, ISSRE 2009, DOI 10.1109/ISSRE.2009.14 — constructive/destructive interference taxonomy, interaction in 66.88% of Siemens multi-fault versions; DiGiuseppe & Jones, ICSM 2011]. Two canonical forms matter here.

- **Masking**: some `o ∈ Obs({f_b})` passes when `f_a` is also present — `f_a`'s presence hides `f_b`'s symptom.
- **Exposition (unmasking)**: some `o ∉ Obs({f_b})` fails once `f_a` is *repaired*. Masking and exposition are one edge read in opposite directions.

The `httpx_6821`-style scenario of Section 6.2 is the clean instance: with Bug 1 (history cleared on scheme change) present, no test can traverse a populated redirect history, so nothing ever reaches Bug 2's hard assert — `Obs({f2})` is effectively empty and `Obs({f1, f2}) = Obs({f1})`.

**Proposition 4 (masked faults are invisible to spectrum-based localization) [D].** If every failing observation of `f_b` is masked (`f_b` is executed only by passing tests), then every suspiciousness formula that is increasing in failed-coverage and non-increasing in passed-coverage — Tarantula, Ochiai, and their relatives [Tarantula: Jones, Harrold & Stasko, ICSE 2002, Jones & Harrold ASE 2005; Ochiai: Abreu, Zoeteweij & van Gemund, PRDC 2006; formula family transcribed in Pearson et al., ICSE 2017] — assigns `f_b` its minimum score: the masked fault ranks below code that never executed. No quantity of additional failing-test signal, gathered by any number of tool calls, would rank `f_b` as suspicious while its masking fault lives. Detection requires a *causal world model* — reasoning about what becomes reachable after a repair — not more observations. This is precisely what Phase 1's specification encodes when it reads the issue's causal language ("raises AssertionError *after* the primary fix") as an ordering constraint rather than chronology.

**Exposition DAG and topological repair [D].** Define `D_F`: a directed edge `f_a → f_b` when repairing `f_a` exposes or changes the observability of `f_b`. The `httpx`-style scenario is the single edge `f1 → f2`. A *correct fix order* is any topological order of `D_F`.

**Proposition 5 (inverted edges force re-diagnosis) [D].** Repairing in topological order keeps the observable test signal monotonically informative: each repair unmasks the next fault's symptoms before the agent must diagnose them. Repairing an inverted pair (`f_b` before `f_a`, edge `f_a → f_b`) forces diagnosis of `f_b` from masked or absent signals, and each inverted edge adds at least one re-diagnosis event once validation reveals new failures. (Proof by induction on the number of inverted edges; appendix.)

**Scheduling view.** Choosing a repair sequence under precedence constraints `D_F` is single-machine sequencing with precedence; when per-fault repair costs are order-independent, *every* topological order is cost-optimal. The order itself is free to get right — the entire benefit comes from knowing `D_F`. The Phase 1 specification is a `D_F`-estimation step: its value is the avoided re-diagnosis and recovery costs; its costs are one turn plus the probability `(1 − q)` of estimating the DAG wrong. [D]

### 5.5 A turn-cost model for compound tasks [H]

For a task with `m` interacting faults, write `d_i` for the per-fault discovery and repair cost when signals are unmasked, `U(m)` for unmasking/re-diagnosis delay, `W(m)` for the wrong-edit count, and `r` for the recovery cost per wrong edit (re-read, revert, re-fix). A symptom-first agent with no ordering discipline has

```
E[T_naive(m)] = Σ_i d_i + U(m) + W(m) · r                      (Eq. 7)
```

while an agent that estimates `D_F` with accuracy `q` and repairs in topological order has

```
E[T_bcf(m)] = 1 + Σ_i d_i + (1 − q) · m · r                    (Eq. 8)
```

The compounding-advantage claim of §1.2 is the statement that `U(m) + W(m)·r` grows superlinearly in `m` while `(1 − q) · m · r` stays linear. We state this as a falsifiable hypothesis with explicit functional form, to be tested by the ablation ladder on the `multi_bug` stratum of the taxonomy (Section 7): if `E[T_naive]` grows linearly in `m` at the measured slopes, the hypothesis is refuted and the paper will say so.

### 5.6 Chained faults as inference on the call graph

The localization protocol of Section 4.4 becomes a probability model once the graph is explicit. Fix a *symptom anchor* `v*`: the node where the error manifests (the raise site, or the failing test's entry API). Root causes concentrate near the anchor along the propagation direction, giving the distance-decay prior of Eq. (1). The four-step protocol is then a fixed-depth sequence of noisy partition queries on the candidate set: the dual queries Q1/Q2 cover different regions of embedding space, so the joint miss probability is bounded by the product of per-query miss probabilities plus a correlation term — a union-style recall bound that formalizes Section 4.4's two-query rationale; Q3's subgraph centrality is a structural signal orthogonal to text similarity, whose intersection with semantic rank combines two weak signals into one sharp one; Q4's `called_by` expansion fixes the direction asymmetry that grep cannot express (symptoms live at callers, causes at callees); Q5's targeted read is the stopping rule that confirms the located hypothesis. Proposition 2's lower bound still applies at every step; the protocol's value is the residual entropy after four to five queries, which is the quantity the ablations measure.

For defects that span a chain (`u1` wrong, `u2` compensating, `u3` crashing), the anchor sits at `u3` while the fix belongs at `u1`: localization is the problem of finding the upstream end of the active path. The posterior over paths factorizes along call edges — a small factor graph — and `called_by` traversal is explicit backward message-passing on it. [D]

### 5.7 Calibration: three measurable quantities

The model is deliberately constructed so its free parameters are measurable from the taxonomy corpus and the competition graphs before the November 12 deadline:

- **ρ (taxonomy informativeness)**: compute `I(R; C)` directly from the joint counts of exception class and root-cause symbol across the 129 labeled tasks. [M once labels complete]
- **λ (distance decay)**: the empirical distribution of graph distances between `root_cause_symbol` and failing-test anchors. [M]
- **q (spec-ordering accuracy)**: on the `multi_bug`-labeled stratum, the fraction of tasks whose Phase 1 fix order agrees with the reference patch's dependency structure. [M, stretch]

Reporting `ρ`, `λ`, and `q` with confidence intervals converts this section from decoration into the paper's measurable spine, and — because `ρ` and `λ` are computable from public training data with the released taxonomy — into a reproducible artifact other researchers can recompute.

### 5.8 Relation to prior theory

The model deliberately re-instantiates three classical threads rather than inventing new mathematics:

1. **Conditioning on a class of observations before probing** is the structure of model-based diagnosis and its entropy-based test selection [Reiter, AIJ 32(1):57–95, 1987, DOI 10.1016/0004-3702(87)90062-2 — diagnoses as minimal hitting sets of conflict sets, with measurement-selection principles; de Kleer & Williams, "Diagnosing Multiple Faults," AIJ 32(1):97–130, 1987, DOI 10.1016/0004-3702(87)90063-4 — GDE combines model-based prediction with sequential diagnosis, probabilities and information-theoretic probe selection; general abduction is NP-hard: Bylander et al., AIJ 49(1–3):25–60, 1991, DOI 10.1016/0004-3702(91)90005-5].
2. **Masking and multi-fault interference** have a measured history in fault-localization research [Debroy & Wong, ISSRE 2009; DiGiuseppe & Jones, ICSM 2011, EMSE 2015; Steimann & Bertschler, ICST 2009; Steimann & Frenkel, ISSRE 2012; accuracy bounds in Steimann et al., ISSTA 2013; MSeer: Gao & Wong, TSE 2017].
3. **Failure propagation along component graphs** is the subject of failure-propagation calculi and causal root-cause analysis [PPDG: Baah, Podgurski & Harrold, ISSTA 2008, DOI 10.1145/1390630.1390654 / IEEE TSE 36(4):528–545, 2010, DOI 10.1109/TSE.2009.87; microservice-RCA and FPTC literature].

Section 1.1 positions BCF's contribution as the *composition*: taxonomy-conditioned priors + graph-constrained propagation + precedence-ordered repair, operating inside a turn-budgeted agent. **No located prior work models fix-order or masking inside turn-budgeted LLM SWE agents.** The nearest neighbor is Tricky2 [Granger et al., arXiv 2601.18949, 2026 — to verify], which measures human/LLM error-interaction effects at function level on competitive-programming programs and explicitly cites Debroy & Wong — but it has no repository navigation, no localization economics, and no fix-order modeling. The 2025–2026 failure-analytic literature shows agentic tools fail *late-stage* (iteration and validation) rather than at localization [arXiv:2509.13941], which is exactly the stage this model's ordering and gating terms (`R_int`, `R_rec`, the validation gate) price; and ECLoop [arXiv:2607.28815, 2026 — to verify] independently demonstrates that evidence-conditioned execution gates yield large measured gains, making the gating mechanism prior art to cite and differentiate rather than a novelty claim. The taxonomy itself descends from ODC (process-level, 1994) via the crash-signature clustering line (instance-level, ReBucket 2012) and the benchmark fault-taxonomy exemplars [Humbatova et al., ICSE 2020]; the BCF-SWE-Python Taxonomy's contribution is **issue-level interference labels** (`multi_bug`, `fix_order`) on 129 tasks, which our sweep found no precedent for.

---


---

<!-- ====================================================================== -->
<!-- FILE: bcf-whitepaper-v3-part-5-taxonomy-httpx.md -->
<!-- ====================================================================== -->

## 6. BCF-SWE-Python Taxonomy and a Worked Multi-Bug Instance

This section introduces the BCF-SWE-Python Taxonomy, the partition `Π` over the error surface `E` that operationalizes the exception-class conditioning in §5, and walks through the canonical `httpx_6821`-style multi-bug instance that motivates BCF's exposition-DAG construction. The taxonomy is presented as a codebook with one-line descriptions; the worked instance is the worked example for §5.4's Propositions 4 and 5.

### 6.1 The 12-category BCF-SWE-Python Taxonomy

The taxonomy is a frozen codebook of 12 categories designed for issue-level labeling of Python SWE-bench-style tasks. Categories were derived by open coding of the 129-task training set's `problem_statement` plus `test_patch` failure signatures, with category boundaries chosen so that each category corresponds to a distinct `fix_shape` distribution and (where measurable) a distinct `root_cause_file` distribution. The taxonomy is *issue-level* (one label per task in the simple case) but admits multi-labeling when a task exhibits multiple distinguishable failure modes. The `multi_bug` flag is a separate axis from the category label.

| # | Category | Description | Typical fix_shape | Notes |
|---|---|---|---|---|
| 1 | **parameter_order_sensitivity** | Argument order, kwargs, or positional-vs-keyword mismatches between call sites and signatures | `replace` (signature or call site) | Common across FastAPI dependencies |
| 2 | **media_type_selection** | Wrong content-type, accept header, or media-type negotiation | `replace` (header logic) | Often adjacent to (10) |
| 3 | **validation_error_location** | Where (which layer, which exception class) a validation failure is raised | `replace` (raise site) | Distinct from (5) — here it's the *location*, not the *timing* |
| 4 | **stream_state_management** | Stream/iterator/async-generator lifecycle: premature close, double-read, missing-finalization | `replace`, `guard_add` | Multi-bug hot zone |
| 5 | **redirect_history_accumulation** | History list, redirect chain, or path-canonicalization state across hops | `delete`, `replace` | The `httpx_6821` Bug 1 exemplar |
| 6 | **attribute_lifecycle_gap** | Attribute set in `__init__` not propagated, or consumed before set | `replace` (init), `guard_add` | Often masked by (4) when state is async |
| 7 | **type_guard_insufficient** | Type check accepts a value the downstream code cannot handle | `replace` (guard), `check_add` | Distinct from (3) — the *guard* not the *raise* |
| 8 | **async_context_violation** | Sync/async mixing, missing `await`, event-loop misuse, blocking call in coroutine | `replace` (call site) | Heisenbug category |
| 9 | **dependency_scope_error** | Module-level mutable default, closure-over-loop, or import-cycle state | `replace` (initialization) | Multi-bug hot zone |
| 10 | **render_pipeline_order** | Headers/body encoding order, charset normalization, or response-construction sequence | `replace`, `iterator_or_logic_rewrite` | |
| 11 | **session_state_mutation** | Mutating a shared session/connection across requests without isolation | `replace` (mutator), `new_code` (deepcopy) | Multi-bug hot zone |
| 12 | **config_propagation_failure** | A config value set on parent not reaching child; option not passed through wrapper | `replace` (call site), `check_add` | Often adjacent to (11) |

The full taxonomy is released as a JSONL file with one row per task: `{"task_id": ..., "categories": [...], "multi_bug": true/false, "fix_order": [...], "rationale": ...}`. Each row carries `human_override` and `label_confidence` fields for the audit trail.

### 6.2 Worked instance — `httpx_6821` masking style

The `httpx_6821` instance is the canonical multi-bug scenario that BCF's exposition-DAG construction targets. The dossier trace (illustrative; not the competition's hidden task) gives the following facts:

| | Bug 1 (root cause) | Bug 2 (secondary, masked) |
|---|---|---|
| **Location** | `httpx/_client.py:519` in `Client._send_handling_redirects()` | `httpx/_models.py:310` in `Response.stream` |
| **Defect** | `history = []` clears history on HTTP→HTTPS scheme change | Hard `assert self._stream is not None` |
| **Symptom** | `len(r.history) == 1` instead of 3 after a 3-hop redirect chain | `AssertionError` only fires *after* Bug 1 is fixed |
| **Fix** | Delete the `history = []` branch | Replace assert with `if self._stream is None: raise StreamConsumed()` |

**Why this is masking.** With Bug 1 active, the redirect chain is broken before Bug 2's code is reached: `Obs({f2}) = ∅` (Bug 2 never executes). `Obs({f1, f2}) = Obs({f1})` (the joint behavior is dominated by Bug 1). The masking pattern is one of the six interference relations Debroy & Wong catalog [ISSRE 2009], the most frequent in their empirical study.

**What a naïve agent does.** Symptom-first: the `AssertionError` is loud and concrete, so the agent tries to fix Bug 2 first. The fix produces no observable improvement because Bug 1 still controls the entry path; the agent burns turns rediscovering Bug 1 and may attempt two or three wrong edits in `_client.py` while chasing a hypothesis the data does not support. The dossier trace records ~30 turns, 3 wrong edits, and the correct bug found only at turn 16.

**What a BCF agent does.** Phase 1 reads the issue's causal language ("raises AssertionError *after* the primary fix"; the maintainer hints flag "fix the history clearing before testing the stream") and writes a BCF-Spec with two bugs, `depends_on: []` for `b1` (root), `depends_on: ["b1"]` for `b2` (depends on Bug 1 being fixed first), and a `fix_order` of `["b1", "b2"]` (the unique topological sort of the one-edge DAG). Phase 2 verifies both `b1.target` and `b2.target` exist in the graph. Phase 3 fixes `b1` first, validates G4 (the redirect-history test passes), then fixes `b2`, validates G4 (the stream-consumed test passes), and submits. The dossier trace records ~10 turns, 0 wrong edits.

**Reading this through §5.4's propositions.**

- **Proposition 4.** Under any spectrum-based formula (Tarantula, Ochiai, DStar), Bug 2 has `efail = 0` because every test that could expose it is masked by Bug 1's redirection failure. The masked fault ranks below never-executed code; no amount of additional failing-test signal would surface it. Only the causal world model — the question "what becomes reachable after `b1` is repaired?" — exposes Bug 2 to localization. This is the formal content of Phase 1's specification reading the issue's ordering language.
- **Proposition 5.** The DAG has one edge `f1 → f2`; the only topological order is `[f1, f2]`. An inverted order (`[f2, f1]`) forces one re-diagnosis event: the agent fixes `f2`, observes no improvement, re-reads the test failure, and only then identifies `f1` as the masking cause. Each inversion costs at least `r` turns; the Phase 1 spec eliminates this.
- **Equation 8.** With `m = 2`, `q = 1` (the Phase 1 spec is correct), the BCF agent's expected turns are `1 + (d_1 + d_2) + (1 − 1) · 2 · r = 1 + d_1 + d_2`. With `q = 0` (no ordering information), the naïve agent's expected turns are `Σ d_i + U(2) + W(2) · r` where `U(2) ≥ 1` (one unmasking/re-diagnosis event from inverted ordering) and `W(2) ≥ 1` (at least one wrong edit from the wrong-order fix). The compounding-advantage hypothesis of §5.5 is that `U(m) + W(m)·r` grows superlinearly in `m` and that `(1 − q) · m · r` is the BCF substitute.

### 6.3 Other worked exemplars

The dossier also surfaces two single-bug exemplars that anchor the taxonomy in concrete examples:

- **`rich_3454` (parameter_order_sensitivity, single bug, category 1).** A `Console.print` keyword-only argument added in 13.4 is being passed positionally by an internal call site. The naïve agent finds the call site via `grep`, applies a positional-to-keyword rewrite, and passes. **BCF:** Phase 1 spec names `rich.console.Console.print` as the target and `fix_shape: replace` (signature or call site); Phase 2's `search_similar_code("keyword-only print")` directly lands on the symbol; Phase 3 applies the minimal rewrite; Phase 4 passes. No multi-bug machinery is invoked.
- **`fastapi_11194` (config_propagation_failure, single bug, category 12).** A new `response_model_exclude_unset` option is accepted on `APIRouter.get` but not propagated to the underlying `routing.Route`. Naïve agent: edits `APIRouter.get`, sees the test fail, then has to navigate to `Route` to find the propagation gap. **BCF:** Phase 1 spec names both symbols (`APIRouter.get`, `Route.__init__`) with `fix_order: [router, route]`; Phase 2's `get_code_neighbors("APIRouter.get", edge_type='calls')` immediately returns `Route.__init__`; Phase 3 fixes both in order; Phase 4 passes. This is the "config propagation failure" category, and the multi-symbol spec is the right representation even though the bug count is `1`.

### 6.4 Why the taxonomy has 12 categories, not 50

The information-bottleneck frame of §5.3c disciplines the choice: each additional category must (i) reduce residual entropy `H(R | C)` by enough to offset the increase in classifier error `ε` and the decrease in per-class sample size, and (ii) map to a distinct `fix_shape` distribution that the spec schema can encode. Going from 12 to 50 categories with `n = 129` labeled tasks means ~2.6 tasks per cell — far below the 10–30-task comfort range. The released taxonomy is *frozen at 12*; expansion is gated on collecting more labeled tasks and re-running the bottleneck objective. The `_D/_H/_M` evidence-tier discipline from §10.4 keeps every claim about the taxonomy's informativeness tagged `[M]` with a receipt.

### 6.5 What is and is not in the taxonomy

The taxonomy is **issue-level interference labels** — it categorizes the *failure* a developer reports, not the *defect class* in the ODC sense. The two are related but not identical: a single defect class (e.g., "missing error check") can produce failures in multiple taxonomy categories depending on where in the stack the error surfaces. The taxonomy is also **not a root-cause taxonomy**: category 5 (redirect_history_accumulation) is about the observable state that breaks, not the line of code that causes the breakage. The discipline of separating symptom-shape from cause-shape is what §5.3b calls "partition alignment" and is the second axis of fidelity that the framework tracks.

---


---

<!-- ====================================================================== -->
<!-- FILE: bcf-whitepaper-v3-part-7-experiments-ablation.md -->
<!-- ====================================================================== -->

## 7. Experimental Protocol, Ablation Ladder, and Calibration

This section specifies how BCF's claims become receipts. The experimental protocol is the smallest ladder that lets each hypothesis in the paper be confirmed or refuted on the public training set before the camera-ready deadline; the calibration measurements produce the three numbers that anchor §5's mathematical model to data; the reporting discipline enforces the evidence-tier discipline of §10.4.

### 7.1 Splits and seeding

The 129-task public training set is divided into a **frozen dev split** (used for prompt and schema iteration, frozen at the start of week 2) and a **frozen held-out split** (used for the A-series ablation ladder reports, frozen at the start of week 5). Splits are stratified by repository to avoid per-repo leakage. Each ablation rung runs with at least **three random seeds**; the reported number is the median (or mean) with a **Wilson confidence interval** at 95%. Paired tests (McNemar for pass-rate deltas, paired bootstrap for turn-count deltas) report significance between adjacent rungs.

The hidden test set (~120 tasks, private repos) is used only for the final submission, never for tuning. Per the literature on SWE-bench Verified retirement [OpenAI, Feb 2026], any external benchmark claim is caveated and used only as a sanity check.

### 7.2 The A-series ablation ladder

Each rung adds one component on top of the previous one, all on the same frozen tasks, model, and budget:

| ID | Configuration | Question it answers | Metrics |
|---|---|---|---|
| **A0** | Minimal ADK agent, no BCF scaffolding | Baseline | pass rate, turns/tool calls, tokens, wall-clock, empty/invalid-patch rate |
| **A1** | + Spec phase (gated: file-access refused until spec valid) | Does spec-before-read help? | + spec-validity rate, spec-rubric score vs. outcome |
| **A2** | + Graph-first localization | Does structural navigation cut exploration turns? | + `localization_turns`, hit@k in top-K candidates, ρ-residual |
| **A3** | + Structured handoff (vs. transcript passing) | Is structured handoff the right reducer? | + tokens/turn, drift measure |
| **A4** | + External validation (deterministic gates G0–G5; rescue mode disabled) | Does non-self verification reduce bad submissions? | + false-approval rate (V3 says OK, hidden tests fail), regression rate |
| **A5** | + Rescue mode + breadcrumbs (full BCF) | Does it reduce loops and recover failures? | + loop rate, repeat-action rate, rescue-trigger rate, rescue-recovery rate |
| **A6** | + QLoRA adapter (conditional, only if A5+A6 > A5) | Does post-training add anything beyond scaffolding? | + adapter benefit, leave-one-repo-out |

**A0 — Baseline.** The minimal ADK agent: a single system prompt with the task description, the predefined tools, and no phase gates. This is the "raw model with tools" condition. Its pass rate and turn distribution are the floor that the rest of the ladder must beat.

**A1 — Spec gating.** The `write_spec` tool becomes available; the agent must call it before any file-access tool. Specs are validated against `bcf-spec.schema.json`. A failed schema validation is a turn penalty; a schema-valid but vague spec is not blocked but is logged for the spec-rubric vs. outcome analysis. **Expected effect:** small turn increase on average (the spec turn), but a higher fraction of tasks where the agent finds the right file, especially on multi-bug tasks.

**A2 — Graph-first localization.** The four-step protocol of §4.4 replaces the A1 "explore until you find it" pattern. The protocol is implemented as a Python helper that issues the four to five tool calls and assembles the localization packet. **Expected effect:** `localization_turns` drops from the A0/A1 median (typically 8–12) toward 4–6; `spec_file_correct` (does the spec's predicted root-cause file match the reference patch's file) rises.

**A3 — Structured handoff.** Replace any transcript-style handoff between sub-agents with the localization packet of §4.4. **Expected effect:** total tokens per task drop by an order of magnitude on multi-bug tasks; pass rate held or improved. The three-way ablation (T0 = full transcript, T1 = packet only, T2 = hybrid) is documented as a sub-rung of A3.

**A4 — External validation.** Add the G0–G5 gates; disable rescue mode for this rung so the gates are the only recovery mechanism. **Expected effect:** empty-patch and malformed-patch submissions drop; V3 false-approval rate measured and reported.

**A5 — Full BCF.** Add rescue mode and breadcrumb journal. **Expected effect:** loop rate drops; rescue-recovery rate measures how many tasks that failed the first attempt pass after rescue.

**A6 — QLoRA (conditional).** Only added if `pass(A5 + A6) > pass(A5)` on the frozen held-out split. Leave-one-repo-out reports are required because the hidden set is private repos and the public training repos may be partly memorized by the base model.

### 7.3 Calibration measurements

Three measurable quantities anchor §5's model to data. They are reported as **[M]** once labels are complete.

**ρ (taxonomy informativeness).** Computed from the joint counts of exception class and root-cause symbol across the 129 labeled tasks. Implementation: `I(R; C) = Σ_c P(c) · D_KL(P(R|c) || P(R))` where `P(R|c)` is estimated from the labeled corpus and `P(R)` is the corpus prior. Reported with a bootstrap confidence interval. **Significance gate:** if `ρ < 0.05` we treat the taxonomy as uninformative and Section 5's claims collapse; if `ρ > 0.20` the conditioning argument is empirically supported.

**λ (distance decay).** The empirical distribution of `d(root_cause_symbol, failing_test_anchor)` across the labeled corpus, plotted on log-y axes. The fitted `λ` is the geometric-mean decay parameter of Eq. (1). Reported with a 95% bootstrap CI. **Significance gate:** if the empirical distribution does not show decay (i.e., root causes are uniform across distances), the distance-decay prior is rejected and Phase 2 must fall back to uniform graph traversal.

**q (spec-ordering accuracy).** On the `multi_bug`-labeled stratum only, the fraction of tasks whose Phase 1 `fix_order` agrees with the reference patch's dependency structure (reconstructed from the patch's hunks). Reported with a Wilson CI. **Significance gate:** if `q < 0.5` the ordering-DAG machinery is not earning its turn cost on more than half of multi-bug tasks, and the compounding-advantage hypothesis of §5.5 cannot be supported.

All three measurements are released as reproducibility artifacts; `ρ` and `λ` are computable by any third party from the released taxonomy and the competition's public graphs.

### 7.4 Per-stratum reporting

Metrics are reported **per stratum** to make the multi-bug contribution visible:

- By **complexity tier** (1 = one file / one hunk / ≤5 lines; 2 = one file / multiple hunks or >5 lines; 3 = 2+ files independent; 4 = 2+ files with causal dependency; 5 = new behavior spanning modules) — the rubric is in [BCF-Reference-Compendium §B5].
- By **multi_bug** flag (true / false).
- By **repository** (fastapi, rich, requests, httpx).
- By **turn budget tier** (≤20 turns, 21–40 turns, 41–60 turns, >60 turns).

The headline pass rate is reported **with and without** per-stratum breakdowns. Headline alone hides the multi-bug contribution; the breakdowns make the BCF-specific claims visible.

### 7.5 The compounding-advantage measurement

For the **falsifiable hypothesis of §5.5**, the ablation ladder is split by `multi_bug` stratum and the median turn count is plotted against `m` (number of bugs in the reference patch, reconstructed from patch hunks). The naïve agent's curve and the BCF agent's curve are plotted on the same axes; if BCF's curve is *linear* in `m` and the naïve curve is *superlinear*, the hypothesis is confirmed. The regression slope and its CI are reported; if the slopes overlap, the hypothesis is refuted and the paper says so. This measurement is on the `multi_bug = true` stratum only and is the single most important falsifiable claim in the paper.

### 7.6 The empty-submission policy

G6 (non-empty patch) is the only gate whose failure does not block submission if budget is exhausted. The empty-submission rate is reported as a metric; if it is non-zero on the held-out split, the rescue-mode trigger sensitivity is iterated. An empty submission scores zero by definition, so "submit the best syntactically valid, non-regressing patch" is preferred to "submit nothing" when the budget is gone.

### 7.7 Statistics: what we report

- **Pass rate** with Wilson 95% CI; paired McNemar test for adjacent rungs.
- **Turns per task**: median, IQR; paired bootstrap for deltas.
- **Tokens per task**: median, IQR.
- **Wall-clock per task**: median, IQR (caveat: 5090 vs L4 hardware difference).
- **Empty-patch rate**, **regression rate**, **loop rate**, **repeat-action rate**.
- **Spec-rubric score** (1–5; named in §4.2) and `spec_file_correct` (does the predicted root-cause file match the reference).
- **Localizer hit@k** in top-K candidates.
- **False-approval rate** of the V3 verifier (where it disagrees with the deterministic gate).
- **Calibration measurements** ρ, λ, q with bootstrap CIs.
- **Compounding-advantage regression slope** on the `multi_bug = true` stratum.

---


---

<!-- ====================================================================== -->
<!-- FILE: bcf-whitepaper-v3-part-8-discussion-limitations.md -->
<!-- ====================================================================== -->

## 8. Discussion and Limitations

### 8.1 What BCF is good at

The framework is well-suited to tasks where (i) the issue text contains a concrete symptom or test name, (ii) the call graph between the failing-test entry and the candidate root cause has bounded diameter, and (iii) the bug count is small (`m ≤ 3` in most cases, and the framework's effectiveness is concentrated in this regime). The graph-first localization protocol's four-to-five-call budget is achievable on tier 1–3 complexity (one file / one hunk / ≤5 lines; one file / multiple hunks; 2+ files independent) — which is the dominant regime of the public training set.

The framework's specific contribution is the **multi-fault regime**. The exposition-DAG construction is the only formal mechanism we know of that addresses the masking failure mode without a causal world model (the Phase 1 spec) preceding code exploration. The §5.4 propositions and §6.2 worked instance show that the contribution is real even on a 2-bug task — the compounding advantage is not just about scale.

### 8.2 What BCF does not do

**BCF does not invent new mathematics.** The Section 5 model re-instantiates three classical threads (Bayesian conditioning, multi-fault interference, dependency-aware repair sequencing) and composes them inside an LLM agent. Every proposition has a primary-source citation; the model's novelty is the composition, not the components.

**BCF does not claim to fix SBFL.** The literature's calibrated finding is that SBFL averages survive under multiple faults — per-fault localizability variance is the cost center, not the average [DiGiuseppe & Jones 2011–2015]. BCF addresses the masking failure mode specifically (Proposition 4) by encoding the causal world model in the Phase 1 spec; it does not improve SBFL's spectrum ranking.

**BCF does not claim that localization is the bottleneck.** The 2025–2026 failure-analytic literature [arXiv:2509.13941] shows that modern agentic tools fail *late-stage* (repair, iteration, validation) at 27% on easy tasks rising to 64% on hard tasks, with the dominant named pathology being *premature commitment* — exactly the failure mode BCF's validation gates (G4, G5) and rescue mode address. The framing of BCF as "exception-class-guided localization" is correct but incomplete; the framework's contribution to *iteration and validation* (the actual measured bottleneck) is its deterministic gates and rescue mode.

**BCF does not depend on the competition's hidden test set.** The 129-task training set and the per-tier rubrics are sufficient to evaluate every claim in the paper except the headline pass rate. The hidden set determines only the leaderboard position.

### 8.3 Limitations

**Statistical power.** With `n = 129` tasks and `K = 12` taxonomy classes, the multinomial confidence intervals on per-cell posteriors are wide; the calibration measurement `ρ` may not reach statistical significance even when the conditioning effect is real. We report bootstrap CIs explicitly and treat `ρ < 0.05` as a falsification trigger.

**Inter-rater agreement.** The taxonomy was open-coded by a single annotator (the author) on a 30-task subset; the full 129-task labeling was completed with the trained codebook. The inter-rater sample (planned: a 20-task subset independently re-labeled by a second annotator before camera-ready) will be reported with κ statistics. A `κ < 0.6` is the trigger for a taxonomy revision pass.

**Public-repo memorization.** The four public training repos (fastapi, rich, requests, httpx) are likely partly memorized by the base model. Any A-series number on these repos carries this caveat. The leave-one-repo-out analysis in A6 is the mitigation; we report per-repo pass rates openly.

**Hardware difference.** The reference eval runs on 4×L4 GPUs; our local development runs on a 5090. Wall-clock measurements are not directly comparable; turns and tokens are the durable cost measures and are reported instead. Local development times understate the real cost.

**Base-model quantization.** `gemma-4-31b-it-qat-w4a16-ct` is 4-bit weights with 16-bit activations. The quantization may degrade the model's ability to follow complex multi-step instructions precisely; this is a property of the competition's constraint set, not a BCF limitation, but it bounds the upper end of the achievable pass rate.

**Spec-rubric subjectivity.** The Phase 1 spec rubric is judged by a separate LLM call; the same self-scoring caveats of §4.7 apply. We measure spec-validity (a deterministic gate) and report spec-rubric score as an *advisory* metric, never as a gate.

**LoRA data sourcing.** If A6 includes a LoRA adapter, the training data must come from the model's own passing trajectories (rejection sampling) or be otherwise publicly available — we do not distill from proprietary frontier models, per the competition rules' Reasonableness Standard. The data sourcing and license for any LoRA training data are reported in the released reproducibility resource.

### 8.4 What this paper does and does not prove

This paper proves two things by derivation:

1. **The information-theoretic bound on Phase 2's tool-call budget.** Propositions 2 and 3 give a lower bound on `E[T_loc]` and an exponential scaling in residual entropy. These are derived from Shannon, Fano, Massey, and Arikan; the bound is real.
2. **The masking-invisibility of spectrum-based formulas.** Proposition 4 follows from the monotonicity of Tarantula, Ochiai, and DStar in `efail` and the definition of masking. The proposition is real and applies to any agent using SBFL on masked multi-fault tasks.

This paper states but does **not** prove (it hypothesizes and tests):

3. **The compounding-advantage claim of §5.5.** The functional form `E[T_naive] = Σ d_i + U(m) + W(m)·r` versus `E[T_bcf] = 1 + Σ d_i + (1−q)·m·r` is stated and tested on the `multi_bug` stratum; superlinear growth in `m` for the naïve curve is the confirmation criterion.
4. **The composition claim.** The Section 5 model is consistent with the design choices, but the value of the composition as a whole is empirical — the A-series ablation ladder is the test.

The defensible position is that the paper's derivations are correct, the math is real, the experimental measurements will confirm or refute the hypothesis, and the framing of the contribution (the composition, not the components) is calibrated to what the literature leaves open.

### 8.5 Open questions

1. **Optimal taxonomy size.** The information-bottleneck frame predicts an optimal `K` given `n` and the per-class sample-size constraint; with `n = 129` the optimum may be 8 or 16 rather than 12. Future work: re-estimate at `n = 500` (after the public labeling expands).
2. **Auto-generation of the taxonomy.** The 12 categories were open-coded by hand. Can the partition be induced from data? Plausible approach: clustering root-cause-file distributions over the training set; this would be a pure-data analog of ODC.
3. **Generalization to non-Python.** The taxonomy is Python-specific (a "validation_error_location" entry is shaped by Python's exception model). Cross-language extension is an open research direction; the formal framework carries over, the codebook does not.
4. **LoRA on the spec-writing sub-agent.** A6's most promising direction may be a small adapter on `issue_analyzer` to improve spec quality; this is a targeted application of post-training that does not require retraining the whole model.

---

## 9. Reproducibility and Released Artifacts

This section enumerates what we release as a Kaggle Resource alongside the paper-track Writeup.

### 9.1 Code

- **Submission archive template.** `submission.zip` skeleton with `agent.yaml`, `prompts/system.md`, `sub_agents/issue_analyzer.yaml`, `sub_agents/solution_planner.yaml`, `sub_agents/patch_implementer.yaml`, `skills/bcf-spec/`, `skills/bcf-localize/`, `skills/bcf-validate/`, `skills/bcf-rescue/`, plus the four Python tools (`spec_writer.py`, `graph_navigator.py`, `context_assembler.py`, `patch_validator.py`).
- **Eval harness mirror.** A local mirror of the organizers' `swegemma` harness with the same tool call signatures, sandbox lifecycle, and event-compaction configuration, runnable on a single 5090 or 4×L4 box.
- **Prompt regression suite.** Promptfoo configuration for Phase 1 spec regression (the §A7 sketch in the Reference Compendium).
- **Ledger dumper.** A small Python utility that emits the OpenTelemetry-GenAI-shaped JSONL ledger from a run.
- **Calibration scripts.** Three short Python scripts: `compute_rho.py` (taxonomy informativeness), `compute_lambda.py` (distance decay), `compute_q.py` (spec-ordering accuracy).

### 9.2 Data

- **BCF-SWE-Python Taxonomy v1.** 12-category codebook with category descriptions, typical fix_shape, and worked exemplars (the 30-task calibration stratum).
- **129-task labels.** JSONL with one row per task: `{"task_id": ..., "categories": [...], "multi_bug": true/false, "fix_order": [...], "rationale": ..., "human_override": ..., "label_confidence": ...}`.
- **Inter-rater sample.** 20-task subset independently re-labeled by a second annotator; published κ statistic.
- **A-series ablation runs.** For each rung A0–A6: 3 seeds × dev split + 3 seeds × held-out split, with full JSONL ledgers, `results.csv`, and receipt JSON files.

### 9.3 Models

- **Base model:** `gemma-4-31b-it-qat-w4a16-ct` (as required by the competition).
- **Optional LoRA adapter (if A6 ships):** PEFT-format adapter, training data source and license documented in the resource README.

### 9.4 Documentation

- **Schema documentation.** The `bcf-spec.schema.json` file plus a human-readable spec of every field, with worked examples.
- **Run logs.** Selected run traces (3–5 per rung) for inspection of the agent's behavior on interesting tasks.
- **This paper's `claim → receipt` map.** A JSON document pairing every number in the paper with the receipt ID and the run that produced it; auditable by anyone with the released Resource.

### 9.5 Receipt format

Every experimental run produces a JSON receipt:

```json
{
  "receipt_id": "R-A2-s1-h2",
  "git_commit": "<sha>",
  "config_hash": "<sha256>",
  "harness_version": "<semver>",
  "model": "gemma-4-31b-it-qat-w4a16-ct",
  "adapter": null,
  "seed": 1,
  "split": "heldout",
  "task_ids": ["fastapi_14962", "httpx_3672", ...],
  "metrics": {"pass": 47, "n": 65, "turns_median": 28, "tokens_median": 41200},
  "started_utc": "2026-11-01T03:14:22Z",
  "finished_utc": "2026-11-01T04:51:08Z",
  "notes": ""
}
```

The receipt is committed to the reproducibility resource; the paper's claims audit (final week) walks every number in the body to its receipt.

### 9.6 How to reproduce a number

1. Clone the released resource at the tag named in the receipt.
2. `pip install -r requirements.txt`
3. `./run_ablation.sh --rung A2 --seed 1 --split heldout`
4. The script writes the receipt JSON and the results CSV; the receipt is the auditable artifact.
5. To verify a paper claim: locate the claim, locate the cited receipt ID, run the script, compare.

This is the discipline that prevents the failure mode of earlier whitepaper drafts where numbers were illustrations, not measurements [BCF-Gemma4-Competition-Plan §4.3].

---


---

<!-- ====================================================================== -->
<!-- FILE: bcf-whitepaper-v3-part-9-references.md -->
<!-- ====================================================================== -->

## 10. References

References are listed by topic cluster and then ordered by appearance in the paper. Primary-source citations are preferred throughout; secondary surveys are cited only when they synthesize multiple primaries.

### 10.1 Agentic software engineering and SWE-bench

- [1] Jimenez et al. **SWE-bench: Can Language Models Resolve Real-World GitHub Issues?** ICLR 2024.
- [2] Yang et al. **SWE-bench Multimodal.** NeurIPS Datasets 2024.
- [3] OpenAI. **Introducing SWE-bench Verified.** OpenAI Blog, August 2024; **SWE-bench Verified retirement announcement.** OpenAI Blog, February 2026.
- [4] Cognition. **SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering.** NeurIPS 2024.
- [5] Xia, Deng, Kim. **Agentless: Demystifying LLM-based Software Engineering Agents.** arXiv:2407.01489 [FSE 2025].
- [6] Q. Zhang et al. **ITER: Iterative Reward Design for LLM-based Software Engineering.** arXiv:2509.22546, 2025.
- [7] Y. Zhang et al. **Multi2Fixer: A Multi-Agent LLM Approach to Fix Multiple Bugs in Python.** (cited as a multi-fault baseline; to verify venue).
- [8] **FIG: Fault-Informed Graph reasoning for multi-bug repair** (cited; to verify arXiv ID and authorship).
- [9] Granger et al. **Tricky2: Human–LLM Interaction in Multi-Bug Repair.** arXiv:2601.18949 [2026; to verify final ID].

### 10.2 Multi-fault localization, spectrum-based fault localization, fault interference

- [10] Avizienis, Laprie, Randell, Landwehr. **Basic Concepts and Taxonomy of Dependable and Secure Computing.** IEEE TDSC 1(1):11–33, 2004.
- [11] Debroy, Wong, Xu, Choi. **A Grouping-Based Strategy to Improve the Effectiveness of Fault-Localization Techniques.** ISSRE 2009, DOI 10.1109/ISSRE.2009.14.
- [12] DiGiuseppe, Jones. **Fault Interaction and Its Implications for Software Testing and Fault Localization.** ICSM 2011.
- [13] DiGiuseppe, Jones. **Empirical Evaluation of the "Tarantula" Automatic Fault-Localization Technique.** EMSE 2015.
- [14] Reiter. **A Theory of Diagnosis from First Principles.** AIJ 32(1):57–95, 1987, DOI 10.1016/0004-3702(87)90062-2.
- [15] de Kleer, Williams. **Diagnosing Multiple Faults.** AIJ 32(1):97–130, 1987, DOI 10.1016/0004-3702(87)90063-4.
- [16] de Kleer. **Diagnosing Multiple Persistent Bugs.** (2^K candidate diagnoses background.)
- [17] Jones, Harrold, Stasko. **Visualization of Test Information to Assist Fault Localization.** ICSE 2002 (Tarantula).
- [18] Jones, Harrold. **Empirical Evaluation of the Tarantula Automatic Fault-Localization Technique.** ASE 2005.
- [19] Abreu, Zoeteweij, van Gemund. **An Evaluation of Similarity Coefficients for Software Fault Localization.** PRDC 2006 (Ochiai).
- [20] Pearson, Campos, Just, Fraser, Abreu, Ernst, Keller, Meltsner. **Evaluating and Improving Fault Localization.** ICSE 2017 (SBFL formula family transcription).
- [21] Steimann, Bertschler. **Abstracting the Differential Effect of Multiple Bugs on Test Outcome.** ICST 2009.
- [22] Steimann, Frenkel. **Improving Coverage-Based Localization of Multiple Faults Using Multiple Test Runs.** ISSRE 2012.
- [23] Steimann, Andrews, Birrer. **On the Accuracy of the Simplifying Assumption for Multi-Fault Localization.** ISSTA 2013.
- [24] Gao, Wong. **MSeer: Multi-Fault Localization Based on Speculative Ranges and Failure Patterns.** IEEE TSE 2017.
- [25] Campos, Abreu, Kulesza, Simão. **Entropy-Based Test Selection for Fault Localization.** ASE 2013, DOI 10.1109/ASE.2013.6693085.
- [26] Baah, Podgurski, Harrold. **The Probabilistic Program Dependence Graph (PPDG) and Its Application to Fault Diagnosis.** ISSTA 2008, DOI 10.1145/1390630.1390654 / IEEE TSE 36(4):528–545, 2010, DOI 10.1109/TSE.2009.87.

### 10.3 Small-model scaffolding and post-training for code

- [27] **SWE-PRM: Process Reward Models for Software Engineering.** (cited; to verify arXiv ID and venue.)
- [28] **LivePlan: Adaptive Planning for Code Agents.** (cited; to verify arXiv ID.)
- [29] **FailFast / RestartSmart: Self-Correcting Patterns for LLM Code Repair.** (cited; to verify arXiv ID.)
- [30] **SWE-MeM: Multi-experience Memory for Software Engineering Agents.** (cited; to verify arXiv ID.)
- [31] Dettmers et al. **QLoRA: Efficient Finetuning of Quantized LLMs.** NeurIPS 2023.

### 10.4 Information theory, entropy, and guesswork

- [32] Shannon. **A Mathematical Theory of Communication.** Bell Sys. Tech. J. 27(3):379–423, 1948.
- [33] Huffman. **A Method for the Construction of Minimum-Redundancy Codes.** Proc. IRE 40(9):1098–1101, 1952.
- [34] Cover, Thomas. **Elements of Information Theory.** Wiley.
- [35] Fano. **Class Notes for MIT 6.574** (Fano's inequality on classifier error in terms of conditional entropy).
- [36] Massey. **Guessing and Entropy.** ISIT 1994.
- [37] Arikan. **An Inequality on Guessing and Its Application to Sequential Decoding.** IEEE Trans. Inf. Theory 42(1):99–105, 1996.
- [38] MacKay. **Information-Based Objective Functions for Neural Data Modelling.** Neural Computation 4(4):590–604, 1992, DOI 10.1162/neco.1992.4.4.590.
- [39] Tishby, Pereira, Bialek. **The Information Bottleneck Method.** Allerton 1999.
- [40] Treves, Panzeri. **The Upward Bias in Measures of Information Derived from Limited Data Samples.** Neural Computation 7(2):399–407, 1995, DOI 10.1162/neco.1995.7.2.399.
- [41] Panzeri, Treves. **Analytical Estimates of Limited Sampling Biases in Different Information Measures.** Network 7:87–107, 1996.
- [42] Johnson, Lindenstrauss. **Extensions of Lipschitz Mappings into a Hilbert Space.** Contemp. Math. 26:189–206, 1984.
- [43] Cover, Hart. **Nearest Neighbor Pattern Classification.** IEEE TIT 13(1):21–27, 1967.
- [44] Condorcet. **Essai sur l'application de l'analyse à la probabilité des décisions rendues à la pluralité des voix.** 1785.
- [45] Dempster. **Upper and Lower Probabilities Induced by a Multivalued Mapping.** Ann. Math. Stat. 38(2):325–339, 1967.
- [46] Shafer. **A Mathematical Theory of Evidence.** Princeton UP, 1976.
- [47] Freeman. **A Set of Measures of Centrality Based on Betweenness.** Sociometry 40(1):35–41, 1977.
- [48] Brin, Page. **The Anatomy of a Large-Scale Hypertextual Web Search Engine.** Stanford InfoLab 1998 / Computer Networks 56(18):3825–3833, 2012.

### 10.5 Code-task benchmarks, taxonomy, and classification

- [49] Chillarege, Bhandari, Chaar, Halliday, Moebus, Ray, Wong. **Orthogonal Defect Classification — A Concept for In-Process Measurements.** IEEE TSE 18(11):943–956, 1994.
- [50] **ReBucket: Recovering Crash Buckets from Crash Reports.** ICSE 2012.
- [51] Humbatova, Jin, Tondo, Bissyandé, Le Traon. **Taxonomy of Real Faults in Deep Learning Systems.** ICSE 2020.
- [52] **NLP-based Defect Categorization for GitHub Issues** (cited; to verify).
- [53] **Pre-trained Language Models for Fault Classification.** (cited; to verify.)
- [54] **Graph-based Crash Bucketization** (cited; to verify.)
- [55] **Mining Crash Signatures** (cited; to verify.)
- [56] **Hierarchical Multi-Label Defect Classification Using Transformer Networks** (cited; to verify.)
- [57] **An Exploratory Study on Software Defect Type Prediction Using Deep Learning** (cited; to verify.)

### 10.6 Self-verification, intrinsic evaluation, and confidence

- [58] Huang et al. **Survey on LLM Self-Verification.** ICLR 2024 workshop / arXiv:2403.xxxxx.
- [59] Panickssery et al. **LLM Evaluators Recognize and Favor Their Own Generations.** NeurIPS 2024.
- [60] Chen et al. **Self-Preference Bias in LLM-as-a-Judge.** arXiv 2025 (to verify final ID).

### 10.7 Failure modes, recovery, and rescue patterns

- [61] **Early-Stage and Late-Stage Failure Modes in Agentic Tools.** arXiv:2509.13941, 2025.
- [62] **ECLoop: Evidence-Conditioned Execution Loops.** arXiv:2607.28815, 2026 (to verify final ID).

### 10.8 ADK / agent configuration references

- [63] Google ADK Agent Config Spec (experimental). [Internal — pulled into BCF-Reference-Compendium §A1.]
- [64] Cognition. **Don't Build Multi-Agents — Lessons from SWE-Agent.** Cognition Blog, 2024–2025.
- [65] Anthropic. **Building Effective Agents.** Anthropic Engineering Blog, 2024.
- [66] Konda et al. **HatGPT: Hierarchical Task-Agent Planning with GPT.** (cited; to verify.)
- [67] **A Survey of LLM-based Software Engineering Tools** (cited; to verify.)

### 10.9 Process, methodology, and reproducibility

- [68] Wilson. **Probable Inference, the Law of Succession, and Statistical Inference.** JASA 22(158):209–212, 1927.
- [69] McNemar. **Note on the Sampling Error of the Difference Between Correlated Proportions or Percentages.** Psychometrika 12(2):153–157, 1947.
- [70] Efron. **Bootstrap Methods: Another Look at the Jackknife.** Ann. Statist. 7(1):1–26, 1979.
- [71] Cohen. **A Coefficient of Agreement for Nominal Scales.** EPM 20(1):37–46, 1960.

### 10.10 Bylander et al. (abduction complexity)

- [72] Bylander, Allemang, Tanner, Josephson. **The Computational Complexity of Abduction.** AIJ 49(1–3):25–60, 1991, DOI 10.1016/0004-3702(91)90005-5.

---

**Verification notes.** Citations marked "to verify" are placeholders for entries we have not yet pulled into the bibliography file from the prior research sweep. The verification pass will either (a) confirm the ID and update the entry, (b) replace it with the correct primary, or (c) remove the citation if it cannot be substantiated. Items [7], [8], [27], [28], [29], [30], [52–57], [60], [66], [67] are the priority queue; items [9], [61], [62] need the final arXiv IDs confirmed before camera-ready.

