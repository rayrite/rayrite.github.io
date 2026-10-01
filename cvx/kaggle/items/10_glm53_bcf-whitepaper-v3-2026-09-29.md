# BCF: Specification-Driven Graph Reasoning for Autonomous Software Engineering Agents

Google DeepMind & Kaggle · Gemma 4 Developer Agent Competition Paper Track Submission · November 2026 · Deadline: November 12, 2026, 11:59 PM UTC

Technical Whitepaper · Tasks & Benchmarks (primary) · Code Comprehension · Graph Reasoning · Tuning & Optimization (secondary)

**With the BCF-SWE-Python Taxonomy: A Bottom-Up Bug Taxonomy and Per-Class Analysis Protocol for Python Repository Repair Tasks**

Cooly — Batonic Labs · Detroit, Michigan, USA · Independent Researcher

- **Submitted:** November 2026
- **Model:** gemma-4-31b-it-qat-w4a16-ct [1]
- **Hardware:** NVIDIA RTX 5090 · 32 GB VRAM (official scoring runs 4 x NVIDIA L4 24 GB)
- **Dataset used:** Competition graphs & embeddings

## Abstract

We present the Batonic Coding Framework (BCF), a specification-driven methodology for autonomous software engineering, developed for the Google DeepMind and Kaggle Gemma 4 Developer Agent Competition [2], where an agent repairs real Python repository issues under a binding 12-hour total budget across approximately 120 hidden tasks, with per-task policy left participant-tunable. BCF structures agent reasoning across four sequential stages — issue specification, graph-first localization, minimum-viable-patch generation, and validation-gated submission; we call these BCF phases, distinct from the competition harness's own Phase 1 (inference) and Phase 2 (verification) stages. BCF's contribution to Code Comprehension and Graph Reasoning is a four-step localization protocol over the competition's precomputed AST call graphs and 256-dimensional symbol embeddings, stated with corrected tool semantics: symbol-keyed offline cosine search (`search_similar_code`, where symbol queries work and prose queries return nothing), induced subgraph extraction (`get_code_subgraph`), called_by neighbor expansion with bounded fan-out (`get_code_neighbors`), and line-range reads under a 150-line and 10,000-character dual cap (`read_file`). As a formal contribution, we develop a probabilistic model of exception-class guided repair: the master equation E[T] = c_cl + c_loc * E[G(R | g(E))] + R_int + R_rec for expected turn cost, entropy and guesswork bounds on localization turns, an interference algebra of masking and exposition with its exposition DAG D_F, and a falsifiable turn-cost model for compound tasks — together with three calibration quantities (rho = I(R;C)/H(R) taxonomy informativeness, lambda distance decay, and q spec-ordering accuracy) measurable from the labeled corpus before the submission deadline. As its Tasks and Benchmarks contribution, the paper specifies the BCF-SWE-Python Taxonomy: a designed bottom-up labeling protocol and resource over the 129 public tasks (67/48/13/1 fastapi/rich/requests/httpx), with a multi-pass labeling SOP whose category count is an output of bottom-up derivation, a Cohen's kappa >= 0.7 inter-rater gate on 20 double-coded tasks, and verified label-free corpus facts — 70.5% single-file gold patches, median +8 added lines, 0/129 gold patches touching tests, and hints_text empty in 129/129. Finally, we propose a compliance-rewarded QLoRA training objective for the Tuning and Optimization topic — strictly a proposal conditional on a training gate, never a delivered adapter. Case studies in this paper are constructed illustrations, not measured runs. The model's free parameters are measurable before the deadline, the measurement protocol is pre-registered, and this version reports no measured agent results.

**Keywords:** agentic software engineering · specification-driven development · AST call graphs · semantic embeddings · code comprehension · graph reasoning · fault interference · fix ordering · fault localization · SWE-bench · bug taxonomy · QLoRA · Google ADK

**Methodological transparency note:** This paper presents BCF as a proposed methodology with theoretical analysis and illustrative scenarios grounded in real training repository code. Where the text distinguishes "we propose," "we expect," or "our analysis suggests" from "we measure" or "we find," that distinction is intentional and substantive. Section 5 derives the framework's efficiency claim as a formal model whose free parameters (rho, lambda, q) are measurable from the labeled corpus and competition graphs before the submission deadline. Section 9 describes the controlled experiments in progress. The BCF-SWE-Python Taxonomy in Section 7 is the paper's concrete empirical contribution — its labeling protocol, codebook, and inter-rater gate are fully specified in this paper, the labels themselves will be produced by the planned labeling pass, and every corpus fact reported about the taxonomy's substrate is label-free and mechanically verifiable from the released dataset. Inline tags mark claim status: [D] = derived formal claim, [H] = hypothesis or design expectation; bracketed numbers are reference citations, and community-reported observations are labeled as such in prose.
## 1 Introduction

Autonomous software engineering has advanced rapidly, yet a fundamental efficiency problem persists under constrained inference: agents without a structured reasoning methodology can spend a large share of their tool-call budget on unguided repository exploration rather than purposeful implementation — the motivating premise this paper tests. The task setting is the SWE-bench tradition — given a natural-language issue and a frozen repository snapshot, produce a patch that passes the repository's own test suite [3] — and in that setting turn efficiency is not a performance metric but a structural determinant of how many tasks an agent can address at all.

The Google DeepMind and Kaggle Gemma 4 Developer Agent Competition makes this constraint explicit (competition facts as of September 29, 2026) [2]. All submissions must run gemma-4-31b-it-qat-w4a16-ct, and the binding budget is a 12-hour wall-clock total across all approximately 120 hidden tasks — inclusive of sandbox setup and exclusive of patch validation — which arithmetic prices at roughly six minutes per task all-in. Per-task harness defaults are 60 minutes of wall clock, 100 tool calls, 500 LLM turns, and 300 seconds per command, and each participant may retune these values through their own `eval_config.yaml` [4]; these are two distinct clocks, a binding total and a participant-side per-task policy. Under either clock, agent methodology is the primary differentiator.

The competition provides a rich auxiliary dataset specifically to support structured code navigation: precomputed NetworkX directed call and dependency graphs and float32 256-dimensional per-symbol embeddings [2]. The assets ship as 127+127 commit-named files covering the 127 unique (repo, base_commit) pairs of the 129 public tasks — two base commits are each shared by two tasks, so there are 127 graph files and 127 embedding files, not 129 of each. Yet existing coding agent frameworks define no protocol for using these graph assets: SWE-agent's Agent-Computer Interface [5] and Aider-style pipelines [6] treat code navigation as unstructured exploration, issuing shell commands and file reads until sufficient context accumulates. This leaves the competition's most powerful dataset features systematically underutilized.

The gap extends into the formal literature: no located LLM-era work models fault interference — masking and exposition between multiple faults — or causal fix ordering inside turn-budgeted repository-level agents. Section 5 supplies the missing formal object and its decision rule: a classifying turn is worth its cost exactly when rho * H(R) > b, where rho = I(R;C)/H(R) is the fraction of root-cause uncertainty the taxonomy removes before any repository interaction and b is the decision-relevant information obtainable per tool call [D].

We introduce the Batonic Coding Framework (BCF), a methodology that addresses this gap through two mechanisms: a mandatory specification phase that constrains all subsequent actions, and a graph-first localization protocol that uses the provided AST graphs and embeddings as the primary navigation layer. Neither mechanism is novel in isolation — the competition's public repositories already describe graph-first navigation loops and staged system prompts — the contribution is the composition: taxonomy-conditioned priors, graph-constrained propagation, and precedence-ordered repair inside a single time-budgeted agent. We refer to BCF's internal stages as BCF phases; the competition harness's Phase 1 (inference) and Phase 2 (verification) are different mechanisms, named here once to prevent conflation. BCF contributes to all four official paper-track topics, with declared priority:

**Tasks & Benchmarks (primary).** The BCF-SWE-Python Taxonomy contributes a designed bottom-up labeling protocol and codebook over the 129 public tasks — a specified multi-pass SOP, a Cohen's kappa >= 0.7 inter-rater gate on 20 double-coded tasks, and frozen splits — enabling per-class analysis of specification-first, graph-guided repair, with planned issue-level interference labels (multi_bug, fix_order) that would be a first-of-kind resource once the labeling pass completes. Exception-raising surfaces are common and structured enough to classify — 21.4% of executed methods raise exceptions at runtime across 25 Python systems [7] — which is precisely the regularity a per-class protocol exploits.

**Code Comprehension.** The BCF Phase 2 protocol provides a concrete, reproducible method for deep repository navigation using the competition's provided graph and embedding assets, with corrected tool semantics: offline symbol-keyed cosine search that requires symbol-style queries and is backed by a grep fallback doctrine, and targeted line-range reads that respect the harness's dual output caps.

**Graph Reasoning.** BCF defines how an LLM should reason over large-scale AST graphs — through explicit structured traversal rather than implicit context accumulation — reading called_by expansion as bounded message passing over the call graph, with Section 5 adding a formal model of evidence propagation over graph distances and of fix ordering under interference.

**Tuning & Optimization.** BCF proposes a compliance-rewarded QLoRA training objective that rewards methodological adherence alongside task resolution on consumer hardware — proposed only, conditional on a training gate, and never claimed as a delivered adapter.
## 2 Background and Related Work

This section fixes vocabulary and positions BCF against the benchmark line, the graph-retrieval tradition, the coding agent frameworks it extends, the LLM-era systems it must be differentiated from, and the formal work its model (Section 5) re-instantiates.

### 2.1 Autonomous Software Engineering and SWE-bench

SWE-bench [3] established the canonical benchmark: given a natural-language issue and a frozen repository snapshot, an agent must produce a unified git diff such that the repository's own test suite passes — evaluated as binary PASS/FAIL. The competition instantiates this paradigm with 129 public development tasks serialized in an 8-field `tasks.jsonl` (instance_id, repo, base_commit, problem_statement, hints_text, patch, test_patch, created_at), drawn from four Python repositories — fastapi (67 tasks), rich (48), requests (13), and httpx (1) [2]. Tasks were constructed by commit and pull-request mining with de-noising exclusions (mechanical refactors, documentation-only changes, ambiguous issues), then verified in execution: each task's target tests must fail at the base commit without the fix, and the suite must pass with the reference fix applied (fail-to-pass and pass-to-pass verification). The patch and test_patch fields ship only with the public set; at scoring time the agent sees neither, because the reference patch is excluded from the hidden task files and the verification tests are held in the organizers' private solution archive. The hidden set is approximately 120 tasks curated from private repositories, evenly divided between the public and private leaderboard splits, each validated so that a frontier model can pass it or come within a single test of passing — floor effects on these leaderboards are a scaffold problem, not task impossibility [2]. And because those hidden repositories are ones the agent has never seen, repo-keyed heuristics or static symbol anchors tuned to the four public repositories do not transfer; only generic patterns do.

One property of repair benchmarks is invisible to this monolithic task framing: faults interact. Debroy and Wong [8] supply the definitional anchor — constructive interference, destructive interference (masking), and independence are set relations between the failure observations of individual faults and of their combination — and measure them across 3,267 multi-fault versions of seven Siemens programs: some form of interference appears in 66.88 percent of versions, masking-or-independence is the most frequent single relation at 47.72 percent, and independence falls from 78 percent at two concurrent faults to about 27 percent at ten. Their external-validity caveat travels with every one of these numbers: Siemens code is small and dense, no uniform law is claimed, and none of the figures are properties of the 129-task corpus studied here. The vocabulary, however, is precisely what the planned multi_bug and fix_order labels of Section 7 are designed to capture, and Section 5.4 builds its interference algebra on these definitions.

### 2.2 Graph-Augmented Code Retrieval

Graph-based code navigation has a substantial literature. Code Property Graphs [9] unify syntax trees, control flow, and data flow in one queryable structure; GraphCodeBERT [10] showed that pre-training over data-flow graphs improves code search and clone detection. The LLM-agent era has moved graphs from pre-training signal to runtime instrument: LocAgent [11] conditions localization agents on code-graph traversal, RepoGraph [12] constructs a repository-wide graph at inference time for an editing agent to consult, and Aider's repository map [6] ranks files for the model using a graph-ranking heuristic. GraphRAG [13] marks the corpus-level contrast — graph summarization over document collections rather than per-repository traversal. The competition's assets belong firmly to the runtime-instrument tradition: 127 commit-named NetworkX AST call and dependency graphs with 127 matching embedding files holding 256-dimensional per-symbol vectors, one pair per unique base commit, exposed to the agent during the task through `search_similar_code()`, `get_code_subgraph()`, and `get_code_neighbors()` [2]. They are a live, per-repository artifact rather than a general pre-training corpus, and BCF's Phase 2 protocol is designed for exactly this task-specific graph setting — the relevant graph is available at runtime and traversed directly by the agent rather than encoded into model weights.

### 2.3 Existing Coding Agent Frameworks

SWE-agent [5] introduced the Agent-Computer Interface, shaping the tool surface itself to reduce token overhead. Aider [6] takes a conversational, developer-guided approach. CodeAct [14] uses executable code as the agent's action medium. ReAct [15] and Reflexion [16] supply the underlying interaction paradigms — interleaved reasoning and acting, and verbal self-reflection over failed trajectories. None of these frameworks defines a mandatory specification phase before file access, nor a graph-traversal protocol that consumes precomputed structural assets; BCF's specification phase is its primary structural departure from all of them.

BCF's fix-ordering discipline also has a precedent outside agent systems, in issue trackers. Blocking-bug studies detect, from tracker text alone, pairs of reports where one fix gates another [17][18], and the DABT and S-DABT line orders such blocking pairs automatically [19][20]. This is the tracker-level precedent for the planned multi_bug and fix_order columns of the BCF-SWE-Python Taxonomy; we cite the problem setting, not the reported blocking-chain percentages, which sit behind paywalls and are not reproduced here.

### 2.4 LLM-Era SWE Agents

The nearest systems are differentiated by what they fix and at what cost. Agentless [21] resolves 32.00 percent of SWE-bench Lite at 0.70 USD per instance on average, with its entire localization phase about 0.15 USD of that total (roughly 21 percent) — carrying the subsidy caveat that SWE-bench issue text, including failing-test hints, hands the localizer much of its evidence, so the share likely overstates localization's cost for agents working from barer issue text; the earlier 0.34 USD v1 figure is superseded. AutoCodeRover [22] sits at 0.45 USD per instance in the same accounting. SpecRover [23] is the nearest spec-first prior, resolving 31.00 percent of Lite at 0.65 USD; it infers the intent of a single issue, whereas a BCF specification precedes all file access and enumerates every fault with a causal fix order — intent inference versus fault enumeration. Moatless Tools reports roughly 74.8 percent module-level top-1 per a leaderboard mirror — indicative only [24]. AutoFL [25] and AgentFL [26] bridge the spectrum-based fault localization tradition with LLM reasoning.

Two lines neighbor BCF's core claim directly. Tricky2 [27] is the only benchmark we located that studies bug interactions head-on: it extends TrickyBugs by injecting exactly one extra bug per program under a five-category injection taxonomy, for splits totalling 11,851 buggy programs across human-only, LLM-only, and human+LLM, and finds that repair on human+LLM mixes is worse than on either alone — including zero successful repairs in the human+LLM C++ split. Its self-stated limits are the boundary of the open problem: function-level competitive-programming programs, no repository navigation, no fix-order modeling, and non-agentic single-call baselines. It is the nearest neighbor, and its limits are stated here precisely because they define the gap BCF operates in. ECLoop [28] independently demonstrates the value of gated evidence discipline: enforcing structured evidence conditions before edits yields +4.8 to +11.8 percentage points of Pass@1 across all 500 SWE-bench-Verified instances, with structured conditions beating natural-language summaries. Gating is therefore prior art to cite and differentiate, never a BCF novelty claim; BCF's contribution is what its gate conditions on — taxonomy-conditioned fault hypotheses with an explicit fix order — not the gate itself.

The failure-analytics literature locates where such agents actually lose. Across 150 failed SWE-bench-Verified instances of three state-of-the-art tools, localization failures reach 41 and 39 percent on easy tasks and fall with difficulty, while iteration-and-validation failures rise from 27 percent on easy tasks to 64 percent on hard ones and implementation and repair errors carry about 49-52 percent; agentic tools fail late, via "cognitive deadlocks," and the study isolates an "Issue Misleading" category for issues that steer agents wrong [29]. That distribution is why BCF's exception classes are framed as evidence-conditioning and fix-ordering structure, never as a repair of localization. Benchmark scope is likewise not the claim: Multi-SWE-bench extends the SWE-bench family across programming languages [30] — multilingual coverage, not multi-fault interaction. Graph-first navigation and staged prompts already appear in public competition repositories; BCF's claim is the composition — taxonomy-conditioned priors, graph-constrained propagation, and precedence-ordered repair inside a time-budgeted agent — a gap our literature sweep confirmed, with the caveat that a two-engine search cannot exclude every niche workshop paper (restated in the Limitations).

### 2.5 Related Formal Work

Section 5 re-instantiates three classical threads rather than inventing new mathematics. Conditioning on a class of observations before probing is the structure of model-based diagnosis: Reiter [31] derives diagnoses as minimal hitting sets of conflict sets, GDE [32] couples model-based prediction with probabilistic, information-theoretic probe selection, and abduction in general is NP-hard [33] — which is why an unstructured agent's multi-fault reasoning explodes and a taxonomy that cuts the hypothesis space is necessary, not merely convenient. Masking and interference have a measured history in multi-fault fault localization: DiGiuseppe and Jones study fault interaction across more than 65,000 multiple-fault versions with masking the most prevalent relation [34], find the average effect of multiple faults on coverage-based localization small to negligible [35], and measure a "significant, but slight" average influence at the largest scale [36] — the calibrated reading is that average spectrum-based effectiveness survives multiple faults while per-fault localizability becomes high-variance, which is the order-of-repair problem BCF targets. Bayesian formulations of spectrum-based localization begin with SOBER [37], which infers component defectiveness from execution spectra. Failure propagation along component graphs is the subject of the FPTC calculus [38], its probabilistic extension FPTA [39], and the compositional HiP-HOPS fault-tree synthesis [40]; PPDG [41][42] puts probabilistic propagation over program dependence graphs, the nearest prior to BCF's distance-decay graph prior. The microservice root-cause-analysis line — MonitorRank [43], CauseInfer [44], MicroRCA [45], AutoMAP [46], and the learned failure-dependency graphs of DejaVu [47] — ranks causes over service dependency graphs at system scale. The taxonomy itself descends from a methodology lineage: Orthogonal Defect Classification [48] for process-level defect-type distributions, the real-fault taxonomy methodology of Humbatova et al. [49], fix-shape classification [50], and cause-side error taxonomies [51][52]. Section 5 makes the instantiation explicit — these structures priced in turns inside an agent loop — and only the composition is claimed as new.

The interference-prone scenarios the planned labeling protocol is designed to recognize present recurring signatures, which we state as design hypotheses in compact form: reachability-gating faults, where one defect controls whether another's code ever executes; state-lifecycle dependencies, where a component is used outside its valid state window; compensation chains, where an upstream wrong value is silently corrected until one correction fails; cross-module propagation through shared data structures; config/scope-order interactions; and evidence-swallowing error paths, where a failure is converted into wrong-but-plausible behavior. Their signature issue phrase — "fails ... after the fix" — is exactly the causal language the BCF Phase 1 specification treats as an ordering constraint rather than chronology, and it grounds the causal-ordering rule that Section 5's exposition DAG formalizes.
## 3 The Batonic Coding Framework

BCF organizes each task into four sequential stages, labeled BCF Phase 1 through BCF Phase 4: issue specification, graph-first localization, minimum-viable-patch generation, and validation-gated submission (Figure 1). The stages are strictly ordered and never reordered — BCF Phase 1 completes before any file-access tool call, and BCF Phase 4's validation must pass before `submit_patch()` is called. This sequencing is not a prompt guideline. It is enforced through the submission's Google ADK Agent Config: in the primary flat configuration, through scoped skill-script tooling and instruction structure; in the strict variant under evaluation, a multi-agent tree whose per-agent tool partitions make out-of-phase calls structurally impossible (Section 6) [53].

    BCF Phase 1:            BCF Phase 2:            BCF Phase 3:            BCF Phase 4:
    Specification           Localization            Patch                   Validation
    Hypothesis · Target --> Graph search ·  -->     Minimum viable    -->   Targeted pytest ·
    · Fix shape · Bug       Subgraph · Neighbors    change · Root-first     Gated submission
    order                   · Targeted read         order

        ^                                                                        |
        |    one controlled escalation edge: on a second validation failure,     |
        +    the task returns to BCF Phase 1 for re-specification,          -----+
             budget permitting

Figure 1. BCF's four-phase pipeline. Each phase produces structured outputs that constrain the next: BCF Phase 1's specification constrains which symbols BCF Phase 2 searches, BCF Phase 2's line ranges constrain what BCF Phase 3 edits, and BCF Phase 3's changed files constrain what BCF Phase 4 tests. The dependency structure is forward during normal execution, plus one controlled escalation edge from validation to re-specification on repeated validation failure (Section 3.4).

### 3.1 BCF Phase 1: Specification Before Execution

Upon receiving a task, the BCF agent produces a structured specification document before issuing any file-access tool call. For each identified bug, the specification contains three mandatory fields: (a) Hypothesis — a declarative statement of root cause in code-level terms, not symptom terms; (b) Target — the specific Python symbol, fully qualified, matching the graph's `node.id` format; and (c) Fix shape — the minimum code transformation type (e.g., delete, replace, guard-add; the Section 7.2 label schema's full set adds iterator-replace and check-add) with estimated scope. For multi-bug issues, each bug receives its own triple, and an explicit fix order is determined by causal dependency: bugs that are unreachable code before the root cause is fixed are ordered after it. This fix-ordering determination, made before any file is read, is BCF's primary mechanism for eliminating the wasted-turn cascade that fix-ordering errors produce in unstructured agents (Section 8); the planned BCF-SWE-Python labels (Section 7) are designed to ground exactly this ordering decision in corpus evidence.

Exception classes do three jobs in this phase, and BCF claims exactly these three: evidence-conditioning (the class shapes which symbols BCF Phase 2 queries first), fix-ordering (causal dependency fixes repair precedence), and anchoring-prevention (validation-gated — a hard contradiction at BCF Phase 4 resets the working class). BCF does not pitch class conditioning as a cure for localization. The classification is an enforced pre-commitment gate, and a wrong early class can amplify anchoring — which is why BCF Phase 2's dual query (Section 4.2), the BCF Phase 4 validation gate (Section 3.4), and the anchoring analysis of the probabilistic model (Section 5.3) exist.

### 3.2 BCF Phase 2: Graph-First Localization

BCF Phase 2 enforces a specific tool-call sequence that uses the competition's precomputed graph and embedding assets before any filesystem access. This is the paper's primary technical contribution to the Code Comprehension and Graph Reasoning topics, and it is described in full in Section 4.

### 3.3 BCF Phase 3: Minimum Viable Patch

The first `edit_file()` call implements exactly the specification's fix shape, applied to the exact line range returned by BCF Phase 2. BCF prohibits exploratory edits — edits made to observe test outcomes rather than to implement a specified change. For multi-bug tasks, patches are applied in root-cause-first order from BCF Phase 1. The agent has identified the exact string to replace (the BCF Phase 2 targeted read) and what to replace it with (the BCF Phase 1 specification) before any edit is issued; the edit is a transcription operation. The harness's editor makes this discipline well-defined: `edit_file(filepath, old, new, allow_multiple)` applies one hunk per call, matches the old string through a 3-tier resilient strategy — exact match after line-ending normalization, then line-wise flexible matching with whitespace stripping and re-indentation, then token-level matching around code delimiters — and refuses an ambiguous match unless `allow_multiple=True` is set [4].

### 3.4 BCF Phase 4: Validation-Gated Submission

BCF requires a targeted `run_command("python -m pytest [specific test files] -x -q")` before `submit_patch()`; test scope is derived from the failing test names in the issue's problem statement. If validation fails, the agent re-reads only the edited block and issues one corrective edit. A second failure triggers a budget-aware decision whose threshold is a declared policy constant, not a harness rule: BCF escalates to re-specification while the remaining per-task budget — read live from `get_status()` — stays above a fixed fraction of the allowance the run sets in its own `eval_config.yaml`, and otherwise submits the best available patch; Section 9's budget-headroom tracking (metric 5) constrains this decision. The escalation path is named: the patch_implementer escalates through the root orchestrator back to issue_analyzer for re-specification. By preference `submit_patch()` is never called on an unvalidated patch; the budget-exhaustion branch is the single, declared exception, because a partial patch beats no patch.

Two clocks govern all of this, and BCF keeps them distinct. The competition's binding budget is a 12-hour total across the hidden task set — planning arithmetic puts that at roughly six minutes per task all-in — while per-task limits are participant-side policy under `eval_config.yaml`, with harness defaults of 60 minutes wall clock, 100 tool calls, 500 LLM turns, and 300 s per command [2][4].

The harness facts below are verified against the shipped harness documentation and internals as of September 29, 2026, and are stated as facts rather than expectations [4]:

- Budget-free pair. `submit_patch()` and `get_status()` do not count against the tool-call budget. The governor pattern is therefore free: phase-boundary status polling costs nothing, and submission is the disciplined free exit — callable even at zero remaining tool calls while wall-clock time remains.
- Anti-tamper is harness-enforced, not doctrine. Before the official test patch applies, the harness force-resets every agent-touched protected file — test-named files, `tests/` trees, `conftest.py`, `pytest.ini`, `pyproject.toml`, `tox.ini`, `setup.cfg`, `sitecustomize.py`, `usercustomize.py`, and stub or `.pth` path files — to the eval baseline. Fix the library, never the tests is the grading rule, and the corpus agrees: 0 of the 129 gold patches touch tests [54].
- Auto-recovery exists but is never load-bearing. If the agent ends without calling `submit_patch()` — by finishing, exhausting a budget, or timing out — the harness still extracts the working-tree diff, and a non-empty unsubmitted patch still reaches verification. BCF never relies on this; the disciplined exit is an explicit, validated submission.
- Nudges end runs. The harness nudges any turn that ends without a tool call and terminates the session after more than 3 consecutive no-tool-call stops. BCF's operating rules follow directly: every turn ends with a tool call, long changes are split into smaller incremental edits, and near the token limit reasoning stays terse so the tool call still ships.

> Specification first means the agent arrives at the code already knowing what it is looking for. Graph-first means the search returns a ranked hypothesis instead of a haystack — and the spec says which bug to fix first. Together they define an agent that reasons before it reads.
## 4 BCF for Graph Reasoning and Code Comprehension

BCF Phase 2 is a concrete contribution to both the Code Comprehension and Graph Reasoning topics. It defines how an agent reasons over the competition's precomputed AST call graphs and symbol embeddings — not through embedding similarity alone, but through three layers of structural reasoning applied in sequence, ending in one targeted read. Every tool signature and semantic in this section is verified against the harness internals as of September 29, 2026 [4], and the asset structure is verified by direct probes of the shipped corpus [54]. Each shipped graph is a directed multigraph whose nodes carry `id` (the fully qualified symbol path), `name`, and `text` (the symbol's full source at the pinned commit); the three graph tools are registered per task only when the task's graph and embedding assets exist and exceed the harness's availability threshold, which holds for every task in this archive.

### 4.1 The Four-Step Graph Protocol

**Step 1 — dual symbol search.** BCF issues `search_similar_code(query, k=10)` twice. The tool is offline node-key cosine, not a live text-embedding service: the query string is resolved against node-id keys and suffixes stored in the per-commit embedding file, then symbols are ranked by cosine similarity over float32 vectors of length 256, one per graph node. Symbol-style queries work; free-text prose returns nothing — the official demonstration's free-text query returned zero results. The dual-query design is therefore specified symbol-first: two phrasings derived from the BCF Phase 1 hypothesis, built from code identifiers, exception class names, and parameter or endpoint names harvested from the issue's code-level vocabulary and stack traces. When an issue yields no usable symbol keys, the protocol's grep-fallback doctrine applies — `run_command` grep plus traceback symbol extraction seeds the queries — and the fallback is a declared protocol element, not an improvised repair. Symbols appearing in both top-k lists are high-priority candidates.

**Step 2 — induced subgraph.** `get_code_subgraph(nodes)` returns the induced subgraph over the given node set and takes no depth or edge-type parameters; the corpus makes that sufficient, because the graph edges we have probed are calls-only — our probe of a shipped graph holds 4,287 nodes and 2,490 edges, all 2,490 typed `calls` [54]. BCF reads structural relationships among the top symbols; a symbol that appears in both dual-query lists and sits in a central subgraph position marks the candidate fix site.

**Step 3 — neighbor expansion.** `get_code_neighbors(node, edge_type, max_neighbors=50)` expands a symbol's local structure, resolving nodes through 4-tier matching: exact id, then dot- or slash-suffix, then case-insensitive, then substring. BCF prefers `called_by` expansion (Section 4.3).

**Step 4 — targeted read.** `read_file(filepath, start_line, end_line)` slices 1-indexed and inclusive, under a dual cap of 150 lines and 10,000 characters — whichever binds first, with truncation flagged. BCF never reads a whole file; line anchors come from graph node metadata and traceback offsets. The distinction between graph search and file read is enforced: the graph provides structure, the file provides content, and neither is used alone. Figure 2 summarizes the four steps.

Figure 2. The BCF Phase 2 graph protocol. Steps 1-3 operate entirely on precomputed graph and embedding assets without filesystem access; step 4 converts graph metadata — file path and line offsets — into a targeted file read.

### 4.2 Why Graph-First: Decision Bits, Order, and Recall

The ranked-list-versus-grep contrast survives, in three parts and only three. First, decision bits: a top-k ranked list partially orders the candidate set, so its few bits are decision bits, while a grep dump carries many output bits (raw lines against the 5,000-character output cap) and few decision bits — Section 5.2 states this as a design principle [H], not a theorem. The external economics point the same way: Agentless, a prominent grep-first localizer, resolves 32.00 percent of SWE-bench Lite at 0.70 USD per instance, and its entire localization phase costs about 0.15 USD of that — a share subsidized by issue text that already names files and failing tests [21]; trace-level analysis independently finds file-level action signals too coarse to separate successful from failed runs, with function-level signals informative [55] — the symbol granularity at which BCF's protocol and its taxonomy operate.

Second, and most important, the advantage the constructed evidence supports is order and recovery elimination, not uniform search speed. In the constructed stress test of Section 8.2, the unstructured trace located the hard-assert bug in 3 constructed turns — exactly the 3 turns BCF needed — and still lost the task: it repaired the symptom first and paid recovery turns for the mistake. BCF's claim is therefore deliberately narrowed: ranked structure plus a causal specification changes what the agent knows before it reads and which repair it attempts first, not how fast each individual bug is found.

Third, the two-query strategy is grounded in the union-style recall bound of Section 5.6: two queries covering different regions of the embedding space have joint miss probability bounded by the product of the per-query miss probabilities plus a correlation term. The symbol-query requirement and the grep fallback of Section 4.1 are protocol elements of exactly this bound — both are declared recall devices, stated in advance rather than improvised at failure time.

### 4.3 The Called-By Insight

BCF's specific preference in step 3 is `called_by` expansion over `calls` expansion. Issue reports describe symptoms that manifest at call sites; the defect often resides in the function being called — the callee. Expanding `called_by` edges from a suspected callee locates the call chain where the symptom lives, one structural hop beyond the semantically similar symbol. For compound issues whose root cause is one symbol and whose symptom is in a caller two hops away, the traversal is designed to surface both locations — a design claim, not a measured one. The heuristic is frequently but not universally true: some defects manifest at definition sites (an incorrect default argument, a wrong constant), and for those, expansion from the symptom side points the wrong way; Section 10.3 carries this limitation explicitly. Section 5.6 gives the traversal its formal reading — backward message-passing on the call-graph factor graph, with a distance-decay prior over candidate causes.
## 5 A Probabilistic Model of Exception-Class Guided Repair

Section 3 described BCF's phases operationally; Section 4 described the localization
protocol. This section supplies the mathematical model behind the framework's central
efficiency claim: classifying an incoming failure into an exception class conditions
the search over root causes, shrinking the effective search space and bounding the
number of tool calls required. The model also makes precise what the taxonomy's
“number and fidelity” trade off against each other, and why compound, interfering
faults — the regime of the constructed stress test of Section 8.2 — are the regime
in which ordering discipline matters most.

### 5.1 Setup

Let R denote the root cause of a task's failure at the granularity of the provided
graph nodes (a symbol, equivalently file:line), with N = |supp(R)| candidate symbols
reachable from the failing tests. Let E denote the task's observable error surface —
issue text, failing test names, stack traces, and pytest output: everything the agent
sees before touching the repository. The BCF-SWE-Python Taxonomy (Section 7) is a
partition Pi of E into k exception classes C, together with a classifier
g: E -> C realized by the BCF Phase 1 specification step, with error rate
eps = P(g(E) != C). Each class carries an empirical posterior P(R | C), to be
estimated from the labeled corpus of n tasks once the labeling pass completes. For
multi-bug tasks we write F = {f_1..f_m} for the fault set and Obs(S) for the set of
failing observable behaviors when exactly the faults in S are present. T is the
number of LLM turns (the Total-turns metric of Section 9.2) consumed before a validated submission; each turn
returns at most b bits of decision-relevant information (Section 5.2 makes this
precise).

### 5.2 Conditioning Bounds the Search

**Proposition 1 (credible-set restriction) [D].** After conditioning on class
c, restrict the search to the credible set S_c(alpha): the smallest set of root
causes with posterior mass at least alpha. Expected localization cost under
posterior-ordered inspection is E[T_loc | c] = SUM_i i * pi_(i), where pi_(i) is the
i-th largest posterior mass in cell c; under a uniform prior the baseline is
(N+1)/2. The turn-reduction factor of classification is the ratio of these two
quantities.

**Proposition 2 (information-theoretic lower bound on turns) [D].** No policy can
extract more than b bits of decision information from one tool call, so any
localization policy satisfies E[T_loc] >= H(R | evidence) / b. Conditioning on the
class replaces H(R) by the residual H(R | C) = H(R) - I(R;C), lowering the bound by
I(R;C)/b. We call rho = I(R;C)/H(R) the *taxonomy informativeness*: the fraction of
root-cause uncertainty the taxonomy removes before any repository interaction. The
bound's ingredients are standard — H bits of residual uncertainty cost between H and
H+1 binary questions [56, 57]; the
entropy-probe-selection principle is already present in model-based diagnosis
[32]; entropy-based test generation targets fault
localization directly [58]; and the information-value /
active-data-selection line supplies the general objective [59, 60, 61].

**Proposition 3 (guesswork form) [D].** Under optimal posterior-ordered sequential
inspection the expected number of guesses G obeys the classical Massey-Arikan guesswork
bounds, exponential in the residual entropy [62, 63] (standard references; the exact inequality statements are to
be pinned from the primary papers in the final pass). Qualitatively: expected turns
scale exponentially in H(R|C), so each bit of taxonomy information removes one
bit from the exponent — approximately halving the expected number of remaining guesses. This is the rigorous content of
“classify first, search less”: the spec turn spends one turn to import corpus-level
mutual information I(R;C) that an unstructured agent must otherwise re-derive through
b-bit calls — a net win precisely when rho * H(R) > b.

A corollary explains why ranked graph output dominates grep output at equal turn
cost: a top-K ranked list concentrates decision bits (it partially orders the
candidate set), while a grep dump carries many output bits but few decision bits.
[H — the decision-bits framing is deliberately informal; the paper states it as a
design principle, not a theorem.]

### 5.3 Category Count and Fidelity: A Partition-Design Problem

The efficiency claim's last step — that performance "depends on the number and
fidelity of the exception categories" — is correct but incomplete as stated, and the
model shows exactly why. Three forces act against each other.

**(a) Refinement helps entropy; estimation and classification fight back.** Mutual
information I(R;C) is monotone under partition refinement, so finer categories always
reduce residual entropy — but the monotonicity alone says nothing about where
refinement should stop, which is the classical province of minimum-description-length
and stop-splitting criteria [64, 65]. With
n labeled tasks a cell holds about n/k tasks, and the multinomial posterior inside a
cell carries total-variation error on the order of sqrt(|supp(R)| * k / n), with
plugin-estimation bias O(k/n) [66, 67]; stable per-cell posteriors need roughly 10-30 tasks
per class. With n = 129 and k a design variable whose value is an output of the
bottom-up derivation (working range 8-12, with k = 12 carried as the illustrative
planning value), the arithmetic at the illustrative k gives about 11 tasks per class
— the edge of statistical comfort; moreover plugin estimates of per-cell priors are
biased downward by about (k-1)/(2n) nats (about 0.06 bits at the illustrative
k = 12, n = 129), so cell priors must be smoothed, not taken at face value
[66], and the planned 20-task inter-rater sample (~15% of the
corpus) must be reported with the taxonomy section, not deferred. Independently, the
Bayes error of the classifier g grows as classes become less separable in E-space;
in the limit C = R the classifier would have to be the localizer itself.

**(b) "Fidelity" is two quantities, not one.** F1: classifier accuracy
1 - eps. F2: partition alignment — whether classes are cause-shaped (posterior
P(R|c) concentrated on few symbols) or symptom-shaped (the class records what the
reporter saw, not where the defect lives). The defect-classification literature
learned this distinction the hard way: Orthogonal Defect Classification groups
defects by defect *type* because type predicts where the fix belongs
[48] — process-level distributional evidence — with the
crash-signature clustering line as the instance-level tradition [68].
A symptom-shaped taxonomy can be perfectly accurate and still carry rho near zero.

**(c) Master equation.** The honest form of the efficiency claim is:

    E[T] = c_cl + c_loc * E[G(R | g(E))] + R_int + R_rec        (1)

where c_cl is the classification cost (the spec turn), E[G(R|g(E))] is residual
guesswork under the *predicted* class (which exceeds E[G(R|C)] whenever eps > 0),
R_int collects interference terms (Section 5.4; present only when multi_bug = true),
and R_rec collects recovery costs when classification or ordering is wrong. Two
standard inequalities discipline the design space. By the data-processing
inequality, I(R; g(E)) <= I(R; E): no taxonomy extracts more cause-information
than the error surface contains — fidelity has an information ceiling. By Fano's
inequality, when the issue text is vague (H(R|E) large), every classifier has error
bounded away from zero — so the taxonomy's value on under-specified issues is
structurally limited, and the protocol must include misdirection recovery rather
than assume it away. Choosing (Pi, g) to maximize I(R; g(E)) subject to the
estimation and cost penalties is an information-bottleneck problem: compress the
error surface into k classes while preserving relevance to the root cause
[69, 70, 56, 71]. We use this as the design frame for
the taxonomy's evolution, not as a computable optimum: with n = 129 the bottleneck
objective itself must be estimated, so the paper claims the *frame*, not a solved
instance.

A misclassified task is not merely unhelped: conditioning on a wrong, sharp
posterior can make expected turns *worse* than classification-free search if the
agent commits to the wrong cell (anchoring) instead of re-scoring on contradictory
evidence. This is an argument from the model for two design choices already in
BCF: the dual-query BCF Phase 2 search (an independent second query detects
misdirection), and the BCF Phase 4 validation gate (a hard contradiction resets to the
prior). [H]

### 5.4 Interference: Masked Faults and the Exposition DAG

Single-fault localization methods — spectrum-based formulas in particular —
implicitly assume fault independence: that the observable failure set of a joint
fault state is the union of the parts,

    Obs({f_a, f_b}) = Obs({f_a}) UNION Obs({f_b}).               (2)

Interference is any violation of (2) [8] — the source of
the constructive/destructive interference vocabulary, reporting interaction in
66.88% of Siemens multi-fault versions and masking more frequent than new-failure
observations — with the multi-fault SBFL line confirming the pattern at scale
[34, 35, 36]. Two canonical forms matter here. **Masking**: some
o in Obs({f_b}) passes when f_a is also present — f_a's presence hides f_b's
symptom. **Exposition (unmasking)**: some o absent from Obs({f_b}) fails once f_a
is *repaired*. Masking and exposition are one edge read in opposite directions.

The constructed stress test of Section 8.2 is the clean instance: with Bug 1
(history cleared on scheme change) present, no test can traverse a populated
redirect history, so nothing ever reaches Bug 2's hard assert — Obs({f2}) is
effectively empty and Obs({f1, f2}) = Obs({f1}).

**Proposition 4 (masked faults are invisible to spectrum-based localization) [D].**
If every failing observation of f_b is masked (f_b is executed only by passing
tests), then every suspiciousness formula that is increasing in failed-coverage and
non-increasing in passed-coverage — Tarantula, Ochiai, and their relatives
[72, 73, 74, 75] — assigns f_b its minimum score: the masked fault ranks below
code that never executed. No quantity of additional failing-test signal, gathered
by any number of tool calls, would rank f_b as suspicious while its masking fault
lives. Detection requires a *causal world model* — reasoning about what becomes
reachable after a repair — not more observations. This is precisely what BCF Phase
1's specification encodes when it reads the issue's causal language ("raises
AssertionError *after* the primary fix") as an ordering constraint rather than
chronology.

**Exposition DAG and topological repair [D].** Define D_F: a directed edge
f_a -> f_b when repairing f_a exposes or changes the observability of f_b. The
constructed scenario is the single edge f1 -> f2. A *correct fix order* is any
topological order of D_F.

**Proposition 5 (inverted edges force re-diagnosis) [D].** Repairing in topological
order keeps the observable test signal monotonically informative: each repair
unmasks the next fault's symptoms before the agent must diagnose them. Repairing an
inverted pair (f_b before f_a, edge f_a -> f_b) forces diagnosis of f_b from masked
or absent signals, and each inverted edge adds at least one re-diagnosis event once
validation reveals new failures. (Proof by induction on the number of inverted
edges; omitted here for space.)

Outside formal localization, the multi_bug flag's closest precedent is
tracker-level: studies of blocking-bug chains and dependency-aware bug triage
document order dependencies between reported issues — the phenomenon the fix_order
flag records [17, 19, 20].

**Scheduling view.** Choosing a repair sequence under precedence constraints D_F
is single-machine sequencing with precedence; when per-fault repair costs are
order-independent, *every* topological order is cost-optimal. The order itself is
free to get right — the entire benefit comes from knowing D_F. The BCF Phase 1
specification is a D_F-estimation step: its value is the avoided re-diagnosis and
recovery costs; its costs are one turn plus the probability (1 - q) of estimating
the DAG wrong. [D]

### 5.5 A Turn-Cost Model for Compound Tasks [H]

For a task with m interacting faults, write d_i for the per-fault discovery and
repair cost when signals are unmasked, U(m) for unmasking/re-diagnosis delay,
W(m) for the wrong-edit count, and r for the recovery cost per wrong edit
(re-read, revert, re-fix). A symptom-first agent with no ordering discipline has

    E[T_naive(m)] = SUM_i d_i + U(m) + W(m) * r,                  (3)

while an agent that estimates D_F with accuracy q and repairs in topological order
has

    E[T_bcf(m)] = 1 + SUM_i d_i + (1 - q) * m * r.                (4)

The compounding-advantage claim of Section 10.2 is the statement that U(m) + W(m)r
grows superlinearly in m while (1 - q) m r stays linear. We state this as a
falsifiable hypothesis with explicit functional form, to be tested by the ablation
ladder on the multi_bug stratum of the taxonomy (Section 9): if E[T_naive] grows
linearly in m at the measured slopes, the hypothesis is refuted and the paper will
say so.

### 5.6 Chained Faults as Inference on the Call Graph

The localization protocol of Section 4 becomes a probability model once the graph
is explicit. Fix a *symptom anchor* v*: the node where the error manifests (the
raise site, or the failing test's entry API). Root causes concentrate near the
anchor along the propagation direction, giving a distance-decay prior

    P(u | S) proportional to P(u) * lambda^d(u, v*),  0 < lambda < 1,    (5)

with d(u, v*) the directed call-graph distance from cause to symptom. The four-step
protocol is then a fixed-depth sequence of noisy partition queries on the candidate
set: the dual queries Q1/Q2 cover different regions of embedding space, so the
joint miss probability is bounded by the product of per-query miss probabilities
plus a correlation term — a union-style recall bound that formalizes Section 4.2's
two-query rationale; Q3's subgraph centrality is a structural signal orthogonal to
text similarity, whose intersection with semantic rank combines two weak signals
into one sharp one; Q4's `called_by` expansion fixes the direction asymmetry that
grep cannot express (symptoms live at callers, causes at callees); Q5's targeted
read is the stopping rule that confirms the located hypothesis. Proposition 2's
lower bound still applies at every step; the protocol's value is the residual
entropy after four to five queries, which is the quantity the ablations measure.
The observable-signal ceiling this protocol operates under has a measured analog:
coincidental correctness — tests that execute the fault yet pass — outnumbers
failing tests 38.1x (strong) and 60.5x (weak) across the 395 Defects4J defects
[76, 77, 78, 79], the quantitative face of the ceiling Proposition 4 states
structurally.

For defects that span a chain (u1 wrong, u2 compensating, u3 crashing), the anchor
sits at u3 while the fix belongs at u1: localization is the problem of finding the
upstream end of the active path — the repair-time cousin of program slicing, which
traces an observed value back to the statements that determine it
[80], and of counterfactual comparison against the closest passing
execution [81]. The posterior over paths factorizes along call
edges — a small factor graph — and `called_by` traversal is explicit backward
message-passing on it. [D]

### 5.7 Calibration: Three Measurable Quantities

The model is deliberately constructed so its free parameters are measurable from
the taxonomy corpus and the competition graphs before the November 12 deadline:

- **rho (taxonomy informativeness)**: compute I(R;C) directly from the joint counts
  of exception class and root-cause symbol over the planned labeling pass for all
  129 tasks — measurable once the labeling pass completes.
- **lambda (distance decay)**: the empirical distribution of graph distances
  between `root_cause_symbol` and failing-test anchors — directly measurable from
  the released assets.
- **q (spec-ordering accuracy)**: on the `multi_bug` stratum once labeled, the
  fraction of tasks whose BCF Phase 1 fix order agrees with the reference patch's
  dependency structure — a stretch measurement.

Reporting rho, lambda, and q with confidence intervals converts this section from
decoration into the paper's measurable spine, and — because rho and lambda are
computable from public training data with the released taxonomy — into a
reproducible artifact other researchers can recompute.

### 5.8 Relation to Prior Theory

The model deliberately re-instantiates three classical threads rather than
inventing new mathematics: (i) conditioning on a class of observations before
probing is the structure of model-based diagnosis and its entropy-based test
selection — diagnoses as minimal hitting sets of conflict sets, with
measurement-selection principles [31]; the GDE combination of
model-based prediction with sequential diagnosis, probabilities, and
information-theoretic probe selection [32], with
sequential diagnosis subsequently refined into rollout policies
[82]; and the NP-hardness of general abduction, which
makes any hypothesis-space cut valuable rather than merely convenient
[33]; (ii) masking and multi-fault interference have a measured
history in fault-localization research — the constructive/destructive interference
taxonomy, with interaction in 66.88% of Siemens multi-fault versions and masking
more frequent than new-failure observations [8]; the
multi-fault SBFL line, read with the calibrated tone that average effectiveness
survives while per-fault localizability variance is the cost
[34, 35, 36]; the accuracy-bounds line
[83, 84, 85]; and multiple-bug parallel localization, which clusters
failing tests by fault rather than modeling agent turns [86];
(iii) failure propagation along component graphs is the subject of
failure-propagation calculi and causal root-cause analysis — probabilistic fault
propagation on program dependence graphs [41, 42]
plus its causal-confounding follow-ups [87, 88];
local failure behavior modeled as rewrite rules over failure tokens (omission,
value, stale value, early, late, plus normal) composed to a system fixpoint over
cyclic architectures [38], with a probabilistic layer
[39] and compositional synthesis of system fault trees from local
failure contracts [40]; and random-walk root-cause
ranking on dependency and service graphs [43, 44, 45, 46], with
learned failure-dependency graphs as the closest learned substrate
[47]. Section 2.5 positions BCF's contribution as the
*composition*: taxonomy-conditioned priors + graph-constrained propagation +
precedence-ordered repair, operating inside a turn-budgeted agent.

No located prior work models fix-order or masking *inside turn-budgeted LLM repair
agents*. The nearest neighbor is Tricky2 [27], which measures
human/LLM error-interaction effects at function level on competitive-programming
programs — repair on human+LLM mixes is worse than on either alone, with zero
repairs in the C++ human+LLM split, explicitly citing Debroy and Wong
[8] — but has no repository navigation, no localization
economics, and no fix-order modeling. The 2025-2026 failure-analytic literature
shows agentic tools fail late-stage — iteration and validation — rather than at
localization [29], which is exactly the stage this
model's ordering and gating terms (R_int, R_rec, the validation gate) price; and
ECLoop independently demonstrates that evidence-conditioned execution gates yield
large measured gains, making the gating mechanism prior art to cite and
differentiate rather than a novelty claim [28]. The taxonomy
itself descends from ODC (process-level, 1994) [48] via the
crash-signature clustering line (instance-level, ReBucket) [68] and
the benchmark fault-taxonomy exemplars [49]; the
BCF-SWE-Python Taxonomy's contribution is issue-level interference labels
(`multi_bug`, `fix_order`) on 129 tasks, which the sweep found no precedent for as
of September 29, 2026.
## 6 BCF Agent Architecture

BCF is authored as a declarative configuration for the Google ADK agent runtime [53], which the harness compiles into a live agent without executing participant code [4]. This section presents the two configurations we field — a flat single root agent with scoped skill-script tooling, the primary submission configuration, and a strict phase-enforcement variant built on the ADK multi-agent tree, under evaluation as an ablation rung (Section 9) — and closes with the framework's Tuning and Optimization contribution: a compliance-rewarded QLoRA training objective [89], proposed strictly conditionally on a training gate.

### 6.1 Agent Configuration

**The primary configuration is flat.** A single root agent binds the harness's nine predefined tools [4] — `run_command()`, `submit_patch()`, `get_status()`, `read_file()`, `edit_file()`, `write_file()`, `get_code_neighbors()`, `search_similar_code()`, `get_code_subgraph()` — plus the two skill tools (`run_skill_script()`, `load_skill_resource()`) that become available when a submission ships skills. Phase discipline in this configuration is carried by the skill library (Section 6.2) and the system prompt, not by control flow. The posture is deliberate: community reports describe flat root-agent tool calling as more reliable than multi-layer sub-agent routing, and a flat configuration keeps every decision attributable to one inspectable trajectory.

**The enforcement variant is a tree.** Figure 3 shows the variant under evaluation; it runs the same skill library underneath, with phase boundaries moved from convention into control flow.

```
bcf_developer_agent (root)
  Orchestrator · get_status · phase dispatch · budget accounting
  |
  |-- issue_analyzer
  |     get_status · search_similar_code · get_code_subgraph  ->  JSON BCF specification (read-only)
  |
  |-- solution_planner
  |     graph tools + read_file  ->  JSON edit plan (file, lines, old/new string)
  |
  +-- patch_implementer
        edit_file · run_command · submit_patch  ->  PASS or escalate
```

Figure 3. BCF's Google ADK multi-agent tree, the strict phase-enforcement variant. Each sub-agent's tool access enforces the phase it owns — `issue_analyzer` cannot edit files — and the root delegates by phase with structural tool scoping, dispatching to `solution_planner` only after `issue_analyzer` has emitted a non-empty Phase 1 specification artifact. Phase boundaries are structural constraints rather than prompt guidelines, which makes them robust to context drift over long tasks.

A referee question deserves a direct answer: tool scoping shows who can edit, not that Phase 1 precedes file access in time. The tree answers with two mechanisms. The dispatch that routes work to `solution_planner` fires only on a non-empty Phase 1 specification artifact — ordering is control flow, not convention — and each sub-agent's tool list is a structural constraint on what can happen during that phase at all: exploratory edits cannot occur during analysis because the analyzing agent holds no edit tool.

**Long trajectories are bounded by verified harness facts.** ADK event compaction summarizes history when a 14,336-token threshold is crossed (overlap 2, retention 5; the compaction interval is honestly unresolved — the released README states 5 and the official notebook passes 15 — and no design decision depends on either value). The context ceiling is 32,768 tokens, enforced in both the generation-config constraints and the serving configuration. Prefix caching activates at 2,048 tokens with a 1,800-second time-to-live, and transient model errors are retried up to five times with 2-to-60-second backoff [4]. Because context is compacted mid-flight, no agent — flat or tree — can rely on re-reading its own early transcript. This is the operational argument for the Phase 1 specification as a structured artifact: the spec is re-derivable compact state, and the ADK design is what makes it one. After compaction, the agent re-derives its intent from the artifact, not from a summarized memory of having written one.

Two harness behaviors interact with the phase design directly. The nudge system terminates a session after more than 3 consecutive stops without a tool call — and BCF's phases end every turn with a tool call by construction, whether a specification write, a graph query, an edit, or a validation run. Budget governance is free: `get_status()` and `submit_patch()` do not count against the tool-call budget, so the design polls the budget at phase boundaries instead of tracking it from memory. Whether skill-script calls and sub-agent hand-offs themselves consume budget is deliberately left unasserted — an open harness probe on which our budget policy does not depend.

### 6.2 The BCF Skill Library

Four Python skill scripts live under the skill directory declared in the submission (`skills/bcf_brain/scripts/` in the development tree; packaged paths are pinned at submission freeze), invoked through the harness's `run_skill_script()` tool. `spec_writer.py` structures the Phase 1 specification from issue text. `graph_navigator.py` orchestrates the dual-query search, subgraph extraction, and caller-expansion sequence of Section 4. `context_assembler.py` converts graph node metadata into targeted line-range reads sized to the harness's dual read cap (150 lines and 10,000 characters per read). `patch_validator.py` parses pytest output into structured PASS/FAIL with failing test names, feeding the Phase 4 gate.

The scripts are standard-library-only, and the constraint is mechanically verified rather than assumed: `networkx` is absent from the 124 task-dependency wheels the harness mounts read-only at `/wheels/` [54]. The separate 41-wheel harness wheelhouse that provisions the vLLM serving stack is a different artifact on a different mount; skill code never relies on it. Skill-script execution time debits the shared 12-hour budget [4], so each script is built to run once per phase over pre-assembled inputs rather than iteratively.

### 6.3 A Compliance-Rewarded QLoRA Training Objective (Proposal)

Everything in this subsection is proposed; nothing here is claimed as delivered.

We propose a QLoRA fine-tuning objective that departs from standard trajectory-based training in one respect: the reward is a composite of task resolution (a PASS outcome) AND BCF-compliance (the trajectory followed the four-phase sequence). A trajectory that passes by making exploratory edits — without a Phase 1 specification — would be excluded from training data regardless of its outcome. This addresses a documented failure mode of outcome-only reinforcement learning from verifiable rewards [91]: models trained purely on outcome-verified trajectories learn to produce the correct patch by any path, including paths that exhaust the tool-call budget on similar future tasks. Compliance-filtered training rewards the method, not only the result. Training data would be collected from local harness runs, with fine-tuning via the Unsloth toolchain [90]; PASS trajectories would be scored for phase compliance by a lightweight offline classifier; only double-pass trajectories — resolved AND compliant — would enter the fine-tuning set. An adapter ships only if the training gate passes before the paper freeze; no result in this paper depends on one.

The serving and training context is fixed and verified. Official scoring serves the single mandated checkpoint `gemma-4-31b-it-qat-w4a16-ct` [92] on four NVIDIA L4 GPUs (24 GB each) with `tensor_parallel_size=4` and `gpu_memory_utilization=0.80`; the official notebook demonstrates the same stack at 0.90 — a documented discrepancy in the released materials that we state without resolving. Multi-adapter routing is verified plumbing: serving enables LoRA with `max_loras=8` and `max_lora_rank=128`, and the submission contract permits different adapters per agent, restricted to `.safetensors` files within the 3 GiB submission cap. The adapters shipped with the sample submission are demo-scale placeholders (rank 4, roughly 218 KB each); we treat them neither as trained weights nor as evidence that LoRA training succeeds on the quantization-aware-trained checkpoint — establishing that transfer is exactly what the training gate would do. For reproducibility we pin `tool_call_parser='gemma4'`, `reasoning_parser='gemma4'`, and `enable_auto_tool_choice=True`, and follow the harness README's documented-combination rule [4]: sampling uses `include_thoughts: true` with `thinking_budget: 4096`, omitting `thinking_level`. Local development and any training run on a single RTX 5090 (32 GB) against the bf16 sibling checkpoints exposed by the local model registry; the gap between local bf16 training hardware and the scored 4x-L4 quantized-serving environment is an acknowledged, uncalibrated parity residual (Section 10.3).
## 7 The BCF-SWE-Python Taxonomy

*Scope note:* the released corpus contains no taxonomy labels. Every structural fact in Section 7.1 is verified against the corpus today; every categorical statement in Sections 7.2 and 7.3 is a design or a plan, and is written in the future tense deliberately.

The BCF-SWE-Python Taxonomy is the paper's primary Tasks and Benchmarks contribution: a specified, bottom-up labeling protocol and resource design over the competition's 129 public training tasks, whose verified structural ground truth is available today. The distinction is stated plainly because it is easy to blur. `tasks.jsonl` carries exactly eight upstream fields — instance_id, repo, base_commit, problem_statement, hints_text, patch, test_patch, created_at — and no bug_category, multi_bug, fix_order, or root_cause_symbol field exists anywhere in the released data [54]. What this paper contributes now is the protocol, the schema, the standard operating procedure, the compliance design — and the label-free census that follows, every number of which is mechanically checkable against the released archive.

### 7.1 Verified Structure of the Corpus

The corpus was assembled by commit and pull-request mining that required joint production- and test-file changes with linked issues; de-noising exclusions removed mechanical refactors, docs-only changes, large-scale automated sweeps, and ambiguous issues; and two-phase execution verification confirmed every task — fail-to-pass tests must fail at the base commit without the fix and pass with it, while pass-to-pass tests must pass throughout [54].

The 129 tasks come from four repositories — 67 fastapi, 48 rich, 13 requests, 1 httpx — an effectively fastapi-rich-requests benchmark with one httpx guest, so httpx is pooled into the repository tail in every per-repo claim. The issues agents must resolve are terse: problem statements run from 42 to 10,095 characters with a median of 418, and hints_text is empty in 129/129 rows — the harness's conditional hints prompt section never fires on this corpus, and we presume rather than verify the same for the hidden set. Classification targets something real and recurrent: exception-raising behavior accounts for 21.4 percent of executed methods across 25 Python systems [7].

Gold-patch geometry bounds what repair means here. 91 of 129 gold patches (70.5 percent) touch a single file; 110 (85.3 percent) touch at most two; the median patch adds 8 lines; the largest touches 26 files. Three regeneration giants (rich_3930, fastapi_14609, fastapi_15745 — vendored-data and Unicode-table sweeps, not reasoning problems) are excluded from reasoning analyses. No gold patch touches tests (0/129). Fifteen tasks patch FastAPI's docs_src tutorials — a first-class fix target, not a corner case. The corpus is modern: 76 percent of tasks were created in 2025-2026.

The graph assets are equally verifiable. The release ships 127 commit-named call graphs and 127 commit-named embedding files covering the 127 unique base commits (two base commits are shared by two tasks each); the graphs are calls-only directed multigraphs wherever probed (probe: 4,287 nodes, 2,490 calls edges; a full 127-graph edge-type scan is a pre-freeze item), and the embeddings are float32 vectors of length 256 keyed by graph node id [54].

### 7.2 The Planned Label Schema and Labeling SOP

The label schema joins to the tasks by task_id and is fixed now so that the labeling pass, when it runs, is mechanical: failure_code and codebook_version; complexity_tier 1-5 (single-line fix to cross-module architectural); task_type; multi_bug, set on a task iff that task exhibits at least two causally dependent defects (the axis is retained only if pilot labeling surfaces such a case); regression; infra_quarantined; spec_file_correct; fix_order; root_cause_file; root_cause_symbol with a symbol_in_graph flag; bug_category; fix_shape_type (delete, replace, guard-add, iterator-replace, check-add); rationale; label_confidence; human_override; and notes. The category count is an output of the derivation, not an input: k is a design variable with a working range of 8-12, and the twelve names in Figure 4 are carried as the illustrative planning value only.

The labeling SOP is bottom-up. Seed classes come from patch geometry — single-file-small, multi-file, docs_src-tutorial (15 tasks), script-tooling, and regen-giant (three patches over +100 lines). Narrative-first open coding of baseline-agent failure traces then drives the codebook; the codebook freezes under semantic versioning with its sha256 recorded in CODEBOOK_HASH.txt; and all 129 tasks are then labeled design-time. The quality gate is an inter-rater procedure: Cohen's kappa of at least 0.7 on 20 double-coded tasks (about 15 percent of the corpus), with per-axis kappa plus raw agreement wherever prevalence degenerates, and an optional local second rater — a small open-weights model — on a 30-task stratified sample. A prefill script extracts touched files, hunk sizes, and a candidate root symbol from each patch and its graph, holding per-task labeling to 8-12 minutes (17-26 hours total). Development tasks are labeled first and the held-out stratum only after the codebook freezes, so the held-out set remains a genuine test of codebook stability; mid-week drift checks re-code a sample; post-freeze changes land through amendment files only [93]. Agreement statistics will be reported in this section when the planned labeling pass completes (early-October planning window) — not deferred to a release appendix.

```
parameter_order_sensitivity      async_context_violation
media_type_selection             dependency_scope_error
validation_error_location        render_pipeline_order
stream_state_management          session_state_mutation
redirect_history_accumulation    config_propagation_failure
attribute_lifecycle_gap
type_guard_insufficient
```

Figure 4. An illustrative working category set, carried as the planning value — not a claimed final taxonomy. The final category set and count are outputs of the bottom-up derivation, with 8-12 as the working range. The names span parameter ordering, type handling, stream and state lifecycles, and rendering pipelines; no category labels exist in the released corpus.

### 7.3 Why the Resource Matters — and the Compliance Walls

The taxonomy enables three things the raw competition data cannot. Stratified evaluation: agent performance can be measured by bug category, complexity tier, and multi_bug status rather than as a single aggregate PASS rate. Training-data curation: root_cause_symbol is a fully qualified symbol in the graph's node.id format, so per-category training examples can be aimed at exactly the graph nodes where causes live. Interference research: multi_bug and fix_order would make this, to the limits of our search, the first issue-level interference-labeled resource on repository tasks. The tracker-level precedents are blocking bugs [17][18] and dependency-aware bug triage [19][20]; Tricky2 [27], the only located bug-interaction benchmark, is function-level, non-agentic, and models no fix order. Methodologically, the design follows Humbatova et al. [49] as the labeling-methodology model; Defects4J [94] is cited as database and methodological precedent only; Pan et al. [50] is the fix-shape ancestor; and Walia and Carver's cause-side taxonomies [51][52] motivate labeling causes rather than symptoms. One documented gap makes the kappa gate the differentiator: no SWE-bench-line labeling paper reports inter-rater agreement on bug-type labels. We expect a nonzero multi_bug rate [H] — the corpus contains compound, multi-module failures in fastapi and rich, and Defects4J programs almost always contain multiple coexisting defects [75] — but the measured rate must wait for labels. And because the hidden set's category mix is unknown while some cells will be underpopulated (httpx contributes a single training task), per-class analysis falls back to corpus-level Laplace-smoothed priors below a minimum cell count — a fallback declared here rather than discovered mid-evaluation.

The compliance walls are explicit. The rules bar hand labeling or human prediction of validation or test records, and bar transmitting competition data to non-participants [95]. The taxonomy is designed inside those walls: labels are produced design-time, never ship inside `submission.zip`, and never condition the submitted agent at inference; the hand-labeling ban covers validation and test records, so hand-labeling the training set for research is permitted. The released artifact — a research resource under Apache 2.0 — ships instance_ids, labels, the versioned codebook, and the labeling scripts only; it contains no problem statements, patches, snapshots, graphs, or embeddings, so no competition-owned data is redistributed. It will be released with this paper's submission repository.
## 8 Illustrative Case Studies

*Scope note: Every scenario in this section is a constructed illustration, not a measured output of the competition harness. Case A uses a real training-task identifier (`fastapi_11194`, one of the 129 public tasks) but every number in its trace — retrieval scores, line ranges, patch size — is simulated for the illustration. Case B is a constructed stress test staged on an invented task id (`httpx_6821`): it is not in the corpus, and the public corpus contains exactly one httpx task (`httpx_3672`), so Case B must be read as a designed order-of-repair scenario, never as a representative httpx sample. Section 9 pre-registers the controlled measurements that will replace these illustrations.*

### 8.1 Case A: Single-Bug, Single-File (fastapi_11194)

*Illustrative Scenario · BCF Taxonomy (planning values): media_type_selection · Complexity Tier 2*

**Defect.** When a File upload parameter is declared after a Form parameter in a FastAPI endpoint, the endpoint returns 422 on valid multipart requests: the media type of the first body field wins regardless of parameter order. **Constructed root cause:** `_merge_body_field_info()` in `fastapi/routing.py` selects the media type from `flat_body_fields[0]`, ignoring File-typed parameters declared later. **Constructed fix:** a `next()` iterator with an isinstance check that prefers the File media type — one file, five lines.

**Constructed Phase 2 trace.** `search_similar_code("form file media_type body merge ordering")` returns `fastapi.routing.get_body_field` at a simulated score of 0.93 and `fastapi.routing._merge_body_field_info` at a simulated 0.87. `get_code_subgraph` over the top three symbols confirms the call chain `get_body_field` -> `_merge_body_field_info` -> `params.Body()`; `get_code_neighbors(node="fastapi.routing._merge_body_field_info", edge_type="called_by")` confirms a single caller; `read_file("fastapi/routing.py", 382, 396)` — a simulated line range — surfaces the `flat_body_fields[0].field_info.media_type` line. The fix shape is derived from the Phase 1 specification before any file is read.

*Transparency flag: the FastAPI-internals claims above (symbol names, selection behavior, line range) are constructed illustration content. They must be verified against the real fastapi source tree before the submission freeze; failing verification, the example will be re-marked as fully constructed or replaced.*

### 8.2 Case B: Compound Multi-Root, Two-File — Constructed Stress Test (invented id httpx_6821)

*Illustrative Scenario — constructed stress test on an invented task id · BCF Taxonomy (planning values): redirect_history_accumulation + stream_state_management · Complexity Tier 4*

**Scenario (constructed).** The invented issue names two defects and three failing tests: `test_history_http_to_https_chain`, `test_history_full_scheme_chain`, and `test_history_stream_state`. **Bug 1:** redirect history is cleared on every HTTP->HTTPS scheme change in `_send_handling_redirects` in `httpx/_client.py`; the simulated stepper read places the offending guard at lines 519-520. **Bug 2:** `assert self._stream is not None` in `Response.stream` in `httpx/_models.py`; the simulated read places the property at line 308 and the assert at line 312.

**The interference structure.** Bug 2 is dead code until Bug 1 is fixed: while Bug 1 stands, no test ever traverses a populated redirect history, so nothing reaches the assert — `Obs({f2})` is empty and `Obs({f1, f2}) = Obs({f1})`, an exact violation of the independence assumption of eq (2) in Section 5.4. In the constructive/destructive vocabulary of the interference literature, this is masking read from the repair side — exposition [8]. Only a causal world model — reasoning about what becomes reachable after a repair — surfaces Bug 2's true position; no quantity of failing-test signal does.

**Constructed naive trace.** In the constructed naive trace, the unstructured agent spends 30 turns. It fixates on Bug 2 — the assert produces the more concrete error message — and repairs it first at turn 7; the repair is correct but dead, and the agent's next pytest run reveals Bug 1 for the first time. It locates Bug 1 only at turn 16, after a broad text search over `history` returns matches across four files with no ranking signal and one self-inflicted misread. Under the metric defined in Section 9 — wrong edits are `edit_file()` calls absent from the final submitted patch — the trace contains 2 wrong edits: the default-history edit at turn 11 (reverted) and the guard-plus-append removal at turn 18 (rewritten away); the turn-21 corrective rewrite itself survives into the submission. Counting episodes instead of calls yields three wrong-edit episodes, counting the corrective rewrite the second wrong edit forced; Table 1 counts calls. Four of the 30 turns are pure recovery. The trace ends with the full redirect subset passing, and `submit_patch()` lands at turn 30.

**Constructed BCF trace.** In the constructed BCF trace, the agent spends 10 turns. Turn 1 writes the Phase 1 specification — both bugs scoped with Hypothesis, Target, and Fix-shape triples, and the fix order declared Bug 1 first — before any file access. `search_similar_code` places Bug 2 at turn 3, the same three-turn localization the naive agent achieved with grep (an explicit tie), and the subgraph-plus-targeted-read sequence confirms Bug 1 at lines 519-520 by turn 5. Two edits follow — delete the guard, replace the assert with a proper exception raise — and a targeted two-file run, `run_command("python -m pytest tests/test_redirects.py tests/test_client.py -x -q")`, reports 218 passed (simulated output). `submit_patch()` lands at turn 10. The harness's Container B verification then applies the patch in a fresh container and runs the six-test verification subset — the three named failing tests plus regression checks — under the two-container lifecycle and verification semantics of the official harness [4].

| Metric (Case B, constructed) | Naive trace (constructed) | BCF trace (constructed) |
| --- | --- | --- |
| Total turns | 30 | 10 |
| Turns to locate Bug 1 | 16 | 5 |
| Turns to locate Bug 2 | 3 | 3 (tie) |
| Wrong edits (`edit_file()` calls absent from the final submitted patch) | 2 | 0 |
| Recovery turns | 4 | 0 |
| Fix order | Bug 2 first (edge inverted) | Bug 1 first (topological) |

Table 1. Constructed illustrative traces for the invented stress-test scenario (Case B); not measured outputs; constructed illustrations for order-of-repair analysis — not turn-reduction claims; Section 9 pre-registers the measurement plan.

### 8.3 What This Comparison Does and Does Not Show

The comparison does not show faster bug finding. On Bug 2 the two agents tie — 3 turns versus 3 — because a single hard assert is exactly what text search is good at. The advantage is order and recovery: BCF repairs Bug 1 first, per the exposition DAG of Section 5.4, so each repair unmasks the next fault's symptoms before the agent must diagnose them, and it pays zero wrong-edit recoveries where the naive trace pays four recovery turns. The 16-versus-5 gap on Bug 1 is not a search-speed result either — it reflects the naive agent's self-misdirection: having repaired the wrong bug first, it spent eight-plus turns on false progress before backtracking to the real root cause. In the terms of Section 5.5, the entire difference between the traces lives in the penalty terms of eq (3) — the unmasking/re-diagnosis delay U(m) plus wrong-edit recovery W(m) * r — while eq (4)'s residual risk (1 - q) * m * r is what the BCF trace pays instead: the spec turn did not find the bugs faster, it found them in the right order. Finishing at turn 10 also leaves most of the declared per-task policy unspent — headroom that matters under the Stage-1 total — the harness's inference-stage 12-hour window across all hidden tasks — described in Section 9.5. Every number in this paragraph is constructed; Section 9 defines how each will be measured.
## 9 Proposed Experimental Protocol

The following controlled experiments are in progress. Results will be incorporated into this paper before the November 12, 2026 submission deadline. If the measurement campaign is not complete in time, the paper stands on the probabilistic model of Section 5 and the pre-registered protocol below: the protocol is the commitment, and every constructed number in Section 8 is flagged for replacement by Block 5.

### 9.1 Execution Blocks

**Block 1 — Environment and baseline.** Set up the local evaluation loop (WSL2, vLLM serving of `gemma-4-31b-it-qat-w4a16-ct`, official harness) and run the reference-check to confirm harness integrity before any measurement. Local evaluation uses the same three official libraries (`adk-submission`, `adk-eval-core`, `swegemma`) as the official scorer, so behavioral results transfer to the official harness; the residual differences are hardware, throughput, and wall-clock only. The serving configuration mirrors the official one — `tool_call_parser` 'gemma4', `reasoning_parser` 'gemma4', automatic tool choice enabled [4]. Run the unstructured baseline agent against 30 randomly selected training tasks, recording `result.json`, `trace.jsonl`, and elapsed time per task for all 30. The baseline uses "identical model, harness, and skill infrastructure with a generic system prompt"; it is not restricted from using the graph tools but applies no specification discipline — a capable but unstructured agent, not a random walker.

**Block 2 — BCF Phase 2 ablation.** Run the BCF agent with the graph-first localization protocol only (no skill library, no adapter) against the same 30 tasks. Measure localization tool calls (protocol Steps 1-4), total turns, PASS rate, and NO_PATCH rate; cross-reference results with the taxonomy by category and complexity tier once labels exist.

**Block 3 — Full BCF with the skill library.** Run BCF with all four skill scripts active, same metrics. The delta versus Block 2 isolates the skill library's marginal contribution.

**Block 4 — Labeling completion and calibration.** Complete the planned labeling pass over all 129 tasks under the Section 7.2 procedure and report inter-rater agreement against the Cohen's kappa >= 0.7 gate on the 20 double-coded tasks. Then compute the Section 5.7 calibration quantities and report each with a confidence interval: rho is measurable once the labeling pass completes; lambda is directly measurable from the released assets; q is a stretch measurement on the multi_bug stratum.

**Block 5 — Paper update.** Replace the constructed numbers of Section 8 (Table 1 and the surrounding traces) with measured values, add the per-category breakdown the taxonomy enables, and report the ablation results as the paper's primary quantitative finding.

### 9.2 Metric Definitions

Every hypothesis below is stated over five per-task metrics, defined once so the protocol is executable by a stranger:

1. **Total turns** — LLM turns consumed before a validated submission.
2. **Wrong edits** — `edit_file()` calls absent from the final submitted patch. This is the same definition applied to the Case B trace in Section 8 (the naive trace's turn-11 and turn-18 calls; the turn-21 corrective rewrite survives and does not count).
3. **Fix-order error** — binary: any bug repaired before its `D_F` predecessor (Section 5.4).
4. **Exploration turns** — tool calls issued before the first correct edit.
5. **Budget headroom at submission** — remaining wall clock, tool calls, and turns against the run's declared `eval_config` policy. The harness defaults are 60 minutes wall clock, 100 tool calls, 500 LLM turns, and 300 s per command, all participant-tunable; `submit_patch()` and `get_status()` are budget-free [4].

Measurement artifacts per task: `result.json`, `trace.jsonl` (ATIF v1.7 trajectories — steps, thoughts, tool calls, token usage), and elapsed time [4].

### 9.3 Hypotheses

**Primary.** BCF Phase 2's graph-first localization reduces localization tool calls by at least 50% versus grep-based baseline localization, without reducing the PASS rate.

**Secondary.** BCF Phase 1's specification eliminates fix-order errors (metric 3) on compound multi-bug tasks in the training set.

**Tertiary [H].** The compounding hypothesis of Section 5.5: `E[T_naive(m)] = SUM_i d_i + U(m) + W(m) * r` (eq 3) grows superlinearly in m through the `U(m) + W(m) * r` terms, while `E[T_bcf(m)] = 1 + SUM_i d_i + (1 - q) * m * r` (eq 4) stays linear. Tested on the multi_bug stratum of the ablation ladder, with the explicit refutation clause: if `E[T_naive]` grows linearly in m at the measured slopes, the hypothesis is refuted and the paper will say so.

### 9.4 Design and Statistics

**Option A (primary): per-issue-class ablation cells** — roughly 5 coarse strata crossed with the ablation rung set: A1 (the Block 1 baseline) against the best of A2/A3/A4 (the Block 2 protocol-only agent, the Block 3 full-skill agent, and the Section 6.1 tree variant). These roughly-five strata are the coarse patch-geometry and issue strata carried from the roadmap (single-file-small, multi-file, docs-tutorial, script-tooling, regeneration-giant); they are not the taxonomy's k, whose value is an output of the bottom-up derivation [93]. **Option B (fallback):** an embedding-geometry analysis if cells are underpopulated. A tree-versus-flat rung joins the ablation family: the flat single root agent (the primary submission posture of Section 6.1) against the ADK multi-agent tree (Figure 3).

Statistics: exact McNemar paired tests (approximate forms banned), Holm correction across the ablation family, and Wilson intervals on all rates. Localization quality is reported with FLUCCS-style top-5/top-10 discipline on real faults; synthetic-fault results are not treated as evidence — 40% of previously reported technique comparisons reverse on real faults [75]. Threats to validity follow the Steimann line: reported localization accuracy is highly sensitive to evaluation granularity and criterion choice [83, 84, 85], so all localization claims are reported at fixed symbol granularity with identical criteria across arms. The 50% primary threshold is checked against a baseline variance estimate from the Block 1 runs before family-wise testing; if the 30-task screen cannot detect a 50% reduction at conventional power given the observed variance, the screen is reported as underpowered rather than the hypothesis as failed. Splits are frozen before the family runs — pilot-8 / dev-screen-30 / dev-99 / held-out-30 / pooled-129 — and the 30-task sample is justified as the dev-screen stratum of this paired design, a screening set whose confirmatory pooled-129 run follows if the screen passes [93].

### 9.5 Budget Accounting and Scope

Two distinct clocks govern the protocol. The per-task harness defaults — 60 minutes wall clock, 100 tool calls, 500 LLM turns, 300 s per command — are evaluation-config-tunable participant-side policy; the binding budget is the Stage-1 total, the harness's Stage 1 inference window: 12 hours across approximately 120 hidden tasks, about 6 minutes per task all-in [96]. The protocol therefore tracks turns as a structural quantity, not merely a speed metric: under the fixed 12-hour total, turns spent on unstructured exploration — and the wall-clock time they consume — are unavailable to the other tasks in the run. No per-task turn averages are assumed anywhere in this paper's arithmetic.

One negative control is excluded from argument: the shipped sample's public near-zero score is not evidence about any adapter or architecture. Its own `eval_config` self-throttles to 60 s / 10 calls / 1 minute / 50 turns, which overdetermines failure, and the two candidate explanations — adapter path versus self-throttle — remain unsettled [96].

*Internal planning note: the 3,000-word submission target is the roadmap's planning assumption, not a limit verified from official formatting requirements; this draft is written full-length, with a submission-cut plan recorded in the open-risks register.*
## 10 Discussion

### 10.1 BCF as System 2 Scaffolding

Gemma 4 31B scores 86.4 percent on the tau2-bench agentic tool-use benchmark — up from 6.6 percent for Gemma 3 27B one generation earlier — and 34 to 49 percent on SWE-bench Verified without specialized scaffolding; all three figures are stated here on the authority of the Gemma 4 technical report and model card, not on our own measurement [1]. The gap between those numbers is precisely the space BCF occupies. The model is capable of sustained, coherent multi-step tool interaction; what it lacks without scaffolding is structured reasoning discipline. BCF supplies that discipline through four structural constraints — specification timing, graph tool ordering, edit type restriction, and submission gating — without modifying the model's weights. In Kahneman's terms [97], BCF is System 2 scaffolding for a model with strong System 1 foundations: slow, deliberate, explicit reasoning-before-action enforced through prompt structure and skill boundaries rather than through a separate fast-path model. The claim is architectural; whether the discipline converts capability into resolution rate is exactly what the Section 9 ablation ladder tests.

### 10.2 The Compounding Advantage as a Falsifiable Hypothesis

This paper asserts no superlinear advantage as a fact. Section 5.5 gives the claim a functional form: for a task with m interacting faults, the unstructured agent's expected cost is E[T_naive(m)] = SUM_i d_i + U(m) + W(m) r (equation (3)) against the ordering agent's E[T_bcf(m)] = 1 + SUM_i d_i + (1 - q) m r (equation (4)), and the compounding claim is exactly the statement that U(m) + W(m) r grows superlinearly in m while (1 - q) m r stays linear [H]. The hypothesis is pointed at the `multi_bug` stratum of the Section 9 ablation ladder and carries its refutation clause: if measured unstructured-agent cost grows linearly in m at the measured slopes, the hypothesis is refuted and the paper will say so.

The mechanism decomposes asymmetrically, and the Section 8.2 traces — constructed, not measured — show why. On Case A (single bug) the primary gain is localization efficiency, the graph protocol versus grep. On Case B (compound) the naive agent located the hard-assert second bug in the same three turns BCF did; the constructed win is fix ORDER — root cause first, because the second bug is dead code until the first is repaired — plus elimination of the recovery turns the symptom-first route forced (two wrong edits under the paper's counting rule, `edit_file()` calls absent from the final submitted patch, and four recovery turns). The specification phase absorbs compound complexity once, at Phase 1 entry, while an unstructured agent pays complexity costs repeatedly through wrong-edit-and-recovery cycles; that is the model's reading of equations (3) and (4). The nearest measured neighbor studies injected extra faults on competitive-programming programs at function level and finds mixed human-plus-LLM repairs succeed less often than on either source alone — zero successful repairs in its C++ mixed split [27]; no located prior work prices fix ordering inside a turn-budgeted repository agent. Until the Section 9 ablation reports, this claim is a model plus an ablation design — not a result — and no turn-reduction percentage appears anywhere in this paper as a finding.

### 10.3 Limitations

**(a) Issue-description dependence.** BCF's Phase 1 specification quality depends on issue-report completeness, and the ceiling is structural: developers most need from a report exactly what reporters find hardest to provide — stack traces, expected-versus-actual behavior, reproduction steps [98] — and the failure-analytic literature carries a dedicated "Issue Misleading" category for reports that steer agents wrong [29]. Section 5.3 makes the limit precise with Fano's inequality as treated in Cover and Thomas [71]: when the issue text leaves H(R|E) large, every classifier over that text has error bounded away from zero, so misdirection recovery must be built in rather than assumed away. The public corpus keeps the risk concrete — its problem statements run from 42 characters to more than 10,000.

**(b) The called_by heuristic is not universal.** The Phase 2 Step 3 preference for `called_by` edges assumes symptoms manifest at call sites. Definition-site bugs — an incorrect default argument, a wrong constant — violate the assumption, and traversal in the opposite direction would be more efficient there. A richer graph-reasoning layer could select traversal direction from the Phase 1 hypothesis type.

**(c) Results scope and hidden-set transfer.** Any measured agent results in this paper will come from the 30-task training sample of Section 9 — a slice of the 129 public tasks — and do not generalize to the roughly 120 hidden tasks drawn from private repositories without qualification. Repo-keyed or static patterns tuned on the four public repositories do not transfer to those private-repo tasks at all; only generic patterns do.

**(d) Every interference and taxonomy claim is [H] until the labeling pass completes.** This is the paper's single largest verification debt. The `multi_bug` rate over the 129 public tasks is unmeasured today; the hidden set's category mix is unknown; and the httpx tail contains exactly one training task, so any per-class prior over httpx-like categories would rest on a single observation. The fallback is declared, not silent: when a category's cell count falls below threshold, the protocol substitutes corpus-level Laplace-smoothed priors rather than trusting the sparse cell.

**(e) The counter-evidence set, stated plainly.** Three findings cut against BCF's emphasis, and we state them rather than bury them. First, localization is not the dominant failure stage for modern agentic tools: across 150 failed SWE-bench-Verified instances, iteration-and-validation failures rise from 27 percent on easy tasks to 64 percent on hard ones while localization failures fall with difficulty [29] — which is why Section 3.1 frames exception classes as evidence-conditioning, fix-ordering, and anchoring-prevention, never as a fix for localization. Second, evidence-gated execution is prior art: ECLoop reports +4.8 to +11.8 percentage points of Pass@1 from enforcing evidence conditions before edits, across all 500 SWE-bench-Verified instances [28], and we claim differentiation, not novelty, for BCF's gating. Third, no paper yet measures the cost of misclassification in exception-conditioned repair — an open gap we own. The motivation for conditioning is prevalence: 21.4 percent of executed methods raise exceptions across 25 Python systems [7] — yet a wrong early class could amplify anchoring rather than relieve it. BCF's mitigations are structural: classify from failing-test names and stack traces rather than prose alone; the dual-query Phase 2 search detects misdirection; and the Phase 4 validation gate resets to the prior on hard contradiction.

**(f) The discrepancy register.** Our corpus verification pass documented nine unresolved discrepancies between official competition materials and the shipped archive rather than silently reconciling them [96]. Table 2 restates the register; no BCF design or claim depends on the unresolved D-01 or D-02 values.

| ID | Item | Tension and reading |
|----|------|---------------------|
| D-01 | Context-compaction interval | 5 per the harness README versus 15 per the official notebook; which value runs in scoring is unknown. |
| D-02 | vLLM `gpu_memory_utilization` | 0.80 in the scoring-path config versus 0.90 in the notebook demo. |
| D-03 | Sample command timeout | 60 s in the shipped sample `eval_config` versus 300 s in the README example; the shipped file governs the sample. |
| D-04 | Graph and embedding file count | 256 files is the platform's hard-link view; the archive holds 127 commit-named graphs and 127 commit-named embeddings. |
| D-05 | `hints_text` | Documented as optional; measured empty in 129/129 public tasks. |
| D-06 | `search_similar_code` framing | "Semantic retrieval" on the data page versus the offline node-key cosine mechanism; we describe the mechanism. |
| D-07 | Budget clocks | 12-hour Stage-1 total versus 60-minute per-task default — two clocks, not a conflict. |
| D-08 | Sandbox setup description | Page-level simplification versus README operational detail. |
| D-09 | `submit_patch` description | Page-level simplification versus the baseline-ref diff contract. |

Table 2. The intra-corpus discrepancy register D-01 through D-09: documented tensions between official competition materials and the shipped archive, stated rather than silently reconciled. No BCF design or claim depends on the unresolved D-01 or D-02 values.

**(g) Environment, reliability, and verification residuals.** Local development runs on a single RTX 5090 while official scoring uses four NVIDIA L4 GPUs with tensor parallelism 4; Section 9.1's behavioral-transfer argument rests on the shared harness libraries, but the hardware-parity residual is uncalibrated. Whether the platform scores tasks serially or concurrently against the 12-hour cap is undocumented. Hidden-set hints emptiness is a presumption carried over from the corpus generator, not a verified fact. The evaluation containers are air-gapped with no network, 4 GiB of RAM — overage draws a SIGKILL — and 2 vCPU, so a resource death is task difficulty outside the model's control [4]. The community-reported reliability advantage of flat root-agent tool calling over multi-layer sub-agent routing is untested for BCF's scoped-skill configuration; the Section 9 tree-versus-flat ablation rung addresses it [H]. Finally, our novelty sweep ran on two search engines; a niche workshop paper could have been missed.

**(h) Timing.** The paper deadline of November 12, 2026, 11:59 PM UTC precedes the competition's final submission deadline of December 2 by three weeks, so this paper can report only intermediate official scores and never a final ranking.

### 10.4 Methodology as Durable Differentiation

The durable asset, if the measurement program succeeds, is not any single score but the stack: a labeling protocol with a pre-registered inter-rater gate, a taxonomy keyed to graph node identifiers, a probabilistic model whose parameters are computable from public data, and a four-step graph localization protocol. Each component transfers to any future competition or deployment context that ships comparable graph assets. We frame this as positioning, not as a portability result — a design property argued from the architecture, and one the harness-verified local loop makes cheap to test elsewhere.
## 11 Conclusion

The Batonic Coding Framework proposes two structural changes — specification-before-execution and graph-before-file — as the levers that most improve autonomous software engineering agents under constrained inference budgets, and it operationalizes both as enforceable BCF phase boundaries in the ADK agent configuration: the flat root-agent submission as the primary form, the multi-agent tree as the strict phase-enforcement variant under evaluation.

The taxonomy contribution is stated in protocol terms: a specified bottom-up labeling protocol and resource design over the competition's 129 public training tasks [2], with verified structural ground truth available today — 70.5 percent single-file gold patches, median +8 added lines, 0/129 gold patches touching tests, `hints_text` empty in 129/129 — and labels to be produced by the planned labeling pass behind a pre-registered inter-rater gate. Section 5 turns the efficiency claim into a model whose free parameters — rho, lambda, and q — are measurable from the labeled corpus and the public graphs before the deadline, making the paper's spine reproducible by others.

Together these contributions span the four official paper-track topics — Tasks and Benchmarks, Code Comprehension, Graph Reasoning, and Tuning and Optimization — with the compliance-rewarded QLoRA objective stated strictly as a proposal conditional on the training gate, and the work leverages the released graph and embedding dataset, which the organizers highly encourage.

BCF is a proposed methodology with a formal model, verified harness and corpus ground truth, and constructed illustrative support; the controlled measurement protocol is pre-registered in Section 9. We believe the graph-first localization protocol is BCF's most transferable contribution — a concrete, reproducible method for using precomputed AST call graphs and semantic embeddings to localize Python bugs — applicable wherever similar graph assets exist.

## References
1. Google DeepMind. Gemma 4 Technical Report and the gemma-4-31b-it model card, April 2026. Primary-source attribution for the capability figures this paper quotes as secondary claims: tau2-bench 86.4 (against 6.6 for Gemma 3 27B) and SWE-bench Verified 34-49 without specialized scaffolding. Web resource. Retrieved September 29, 2026.
2. Elan Markowitz, Bryan Perozzi, Benedek Rózemberczki, Glenn Cameron, Hadi Hemmati, Yuchen Li, Michael Galkin, Majid Farhadi, Ryan Holbrook, Ashley Oldacre. Google - The Gemma 4 Developer Agent Competition. https://www.kaggle.com/competitions/gemma-4-developer-agent, 2026. Kaggle. Host: Google DeepMind; Featured Prediction Competition; Custom Metric. (Official competition citation block, verbatim; this entry also covers the competition Data Description and Overview pages cited in Sections 2 through 4, snapshots and date-stamps as of September 29, 2026.)
3. Jimenez, C. E., Yang, J., Wettig, A., Yao, S., Pei, K., Press, O., and Narasimhan, K. SWE-bench: Can Language Models Resolve Real-World GitHub Issues. ICLR 2024. arXiv:2310.06770.
4. `HARNESS_README.md` (49,356 bytes), competition dataset artifact, 2026, together with the harness-internals verification document (September 29, 2026) over the `swegemma` / `adk-submission` / `adk-eval-core` stack. Primary source for the nine registered tools with verified signatures, the two-container lifecycle, the budget defaults (60 minutes per task, 100 tool calls, 500 turns, 300 seconds per command), 4-pass patch application with anti-tamper force-reset, hermetic pytest scoring (exit 0 plus valid JUnit XML), and auto-recovery of unsubmitted working trees; the README is byte-identical to the loose copy shipped beside the ZIP.
5. Yang, J., Jimenez, C. E., et al. SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering. NeurIPS 2024. arXiv:2405.15793.
6. Gauthier, P. Aider: AI pair programming in your terminal. https://aider.chat. Repository-map design: Building a better repository map with tree-sitter, aider.chat blog, October 22, 2023. Retrieved September 29, 2026.
7. Hora, A., and Fraser, G. Exceptional Behaviors: How Frequently Are They Tested? AST 2025. arXiv:2602.05123. (21.4 percent of executed methods raise exceptions at runtime across 25 Python systems.)
8. Debroy and Wong. Insights on Fault Interference for Programs with Multiple Bugs. ISSRE 2009, pp. 165-174. DOI 10.1109/ISSRE.2009.14. Definitional interference source: interaction of some kind in 66.88 percent of 3,267 multi-fault versions of seven Siemens programs; masking more frequent than new failures; independence falls from 78 percent at two faults to about 27 percent at ten.
9. Yamaguchi, F., Golde, N., Arp, D., and Rieck, K. Modeling and Discovering Vulnerabilities with Code Property Graphs. IEEE Symposium on Security and Privacy (S and P), 2014.
10. Guo, D., Ren, S., et al. GraphCodeBERT: Pre-training Code Representations with Data Flow. ICLR 2021. arXiv:2009.08366.
11. Chen, Y., et al. LocAgent: Graph-Guided LLM Agents for Code Localization. arXiv:2503.09089, 2025. (Multi-hop localization over heterogeneous code graphs.)
12. Ouyang, L., et al. RepoGraph. ICLR 2025. arXiv:2410.14684. (Line-level code graph as a plug-in navigation scaffold.)
13. Edge, D., Trinh, H., et al. From Local to Global: A Graph RAG Approach to Query-Focused Summarization. arXiv:2404.16130, 2024.
14. Wang, X., Chen, Z., et al. CodeAct: Enabling Autonomous Agents with Executable Actions in Code. arXiv:2402.01030, 2024.
15. Yao, S., Zhao, J., Yu, D., Du, N., Shafran, I., Narasimhan, K., and Cao, Y. ReAct: Synergizing Reasoning and Acting in Language Models. ICLR 2023. arXiv:2210.03629.
16. Shinn, N., Cassano, F., Gopinath, A., Narasimhan, K., and Yao, S. Reflexion: Language Agents with Verbal Reinforcement Learning. NeurIPS 2023. arXiv:2303.11366.
17. Ren, Li, and Chen. ICPC 2020, pp. 72-82 (blocking-bug prevalence). DOI 10.1145/3387904.3389267.
18. Ren, Li, and Chen. Information and Software Technology, 2023 (extended version). DOI 10.1016/j.infsof.2023.107354.
19. Dependency-Aware Bug Triage (DABT). arXiv:2104.12744, 2021. (Schedules bug fixing by integer programming over textual cost and bug-blocking dependency graphs.)
20. S-DABT. arXiv:2204.05972, 2022. (Scalable dependency-aware triage.)
21. Xia, C. S., Wei, S., Zhang, L., et al. Agentless. arXiv:2407.01489 (v2). (32.00 percent SWE-bench Lite at 0.70 USD per issue, v2 economics; localization about 21 percent of total cost.)
22. Zhang, Y., et al. AutoCodeRover. arXiv:2404.05427, 2024. (AST structure-aware search; optional SBFL when tests exist.)
23. Ruan, Y., et al. SpecRover. arXiv:2408.02232, 2024. (Code-intent extraction; 31.00 percent SWE-bench Lite at 0.65 USD per issue.)
24. Moatless Tools, 2024. Web resource. Module-level localization figures circulate via a leaderboard mirror (about 74.8 percent top-1) and are indicative only. Retrieved September 29, 2026.
25. Kang, An, and Yoo. AutoFL. ESEC/FSE 2024. arXiv:2308.05487. (The LLM-plus-SBFL bridge.)
26. Qin, H., et al. AgentFL. arXiv:2403.16362; IEEE TSE 2025.
27. Granger, Khati, Rodriguez-Cardenas, and Poshyvanyk (William and Mary). Tricky2. arXiv:2601.18949, 2026. The only located benchmark explicitly studying bug-interaction effects: extends TrickyBugs (3,043 buggy competitive-programming programs) by injecting one extra bug per program under a five-category taxonomy, for splits totalling 11,851 buggy programs across human-only, LLM-only, and human+LLM; zero successful repairs in the human+LLM C++ split. Function-level, repository-free, non-agentic.
28. Xu et al. Preventing Premature Commitment in Coding Agents with an Evidence-Conditioned Execution Layer (ECLoop). arXiv:2607.28815, 2026. Enforcing evidence conditions before edits yields +4.8 to +11.8 percentage points Pass@1 across all 500 SWE-bench-Verified instances.
29. An Empirical Study on Failures in Automated Issue Solving. arXiv:2509.13941, 2025. Across 150 failed SWE-bench-Verified instances and three state-of-the-art tools, localization failures drop with task difficulty while iteration-and-validation failures rise from 27 percent (easy) to 64 percent (hard); agentic tools fail late via premature commitment and cognitive deadlocks.
30. ByteDance Seed. Multi-SWE-bench: A Multilingual Benchmark for Issue Resolving. arXiv:2504.02605, 2025. (Multilingual, not multi-fault.)
31. Reiter, R. A Theory of Diagnosis from First Principles. Artificial Intelligence 32(1):57-95, 1987. DOI 10.1016/0004-3702(87)90062-2. (Diagnoses as minimal hitting sets of conflict sets, with measurement-selection principles.)
32. de Kleer and Williams. Diagnosing Multiple Faults. Artificial Intelligence 32(1):97-130, 1987. DOI 10.1016/0004-3702(87)90063-4. GDE combines model-based prediction with sequential diagnosis and information-theoretic probe selection.
33. Bylander, T., Allemang, D., Tanner, M. C., and Josephson, J. R. The Computational Complexity of Abduction. Artificial Intelligence 49(1-3):25-60, 1991. DOI 10.1016/0004-3702(91)90005-5. (General abduction is NP-hard; hitting sets reduce to set cover.)
34. DiGiuseppe and Jones. Fault interaction and its repercussions. ICSM 2011, pp. 3-12. DOI 10.1109/ICSM.2011.6080767. Fault interaction across six subjects and more than 65,000 multiple-fault versions; four significant interaction types, masking most prevalent.
35. DiGiuseppe, N., and Jones, J. A. On the Influence of Multiple Faults on Coverage-Based Fault Localization. ISSTA 2011. (Average SBFL effectiveness survives; per-fault localizability variance is the cost.)
36. DiGiuseppe, N., and Jones, J. A. Fault Density, Fault Types, and Spectra-Based Fault Localization. Empirical Software Engineering 20:928-967, 2015.
37. Liu, Yan, Fei, Han, and Midkiff. SOBER. ESEC/FSE 2005. DOI 10.1145/1081706.1081753.
38. Wallace, M. Modular Architectural Representation and Analysis of Fault Propagation and Transformation (FPTC). Electronic Notes in Theoretical Computer Science, 2005. PII S1571066105051650.
39. Ge, Paige, and McDermid. SAFECOMP 2009, LNCS 5775 (FPTA, the probabilistic layer over FPTC-style propagation). DOI 10.1007/978-3-642-04468-7_18.
40. Papadopoulos, Y., et al. HiP-HOPS (Hierarchically Performed Hazard Origin and Propagation Studies). SafeComp 1999. DOI 10.1007/3-540-48249-0_13. (Compositional synthesis of system fault trees from local failure contracts.)
41. Baah, Podgurski, and Harrold. ISSTA 2008, pp. 189-200 (probabilistic program dependence graphs). DOI 10.1145/1390630.1390654.
42. Baah, Podgurski, and Harrold. IEEE Transactions on Software Engineering 36(4):528-545, 2010 (journal version). DOI 10.1109/TSE.2009.87.
43. Kim, Sumbaly, and Shah. MonitorRank. ACM SIGMETRICS Performance Evaluation Review, 2013-14. DOI 10.1145/2494232.2465753.
44. CauseInfer. INFOCOM 2014. DOI 10.1109/INFOCOM.2014.6848128. (Journal extension: IEEE Transactions on Services Computing 12(2):214-230, 2019.)
45. MicroRCA. NOMS 2020. DOI 10.1109/NOMS47738.2020.9110353.
46. AutoMAP. WWW 2020. DOI 10.1145/3366423.3380111.
47. DejaVu. ESEC/FSE 2022. DOI 10.1145/3540250.3549092. arXiv:2207.09021. Failure dependency graphs with learned pairwise failure similarity; the learned-propagation-graph baseline.
48. Chillarege, Bhandari, Chaar, Halliday, Moebus, and Ray. Orthogonal Defect Classification - A Concept for In-Process Measurements. IEEE Transactions on Software Engineering 18(11):943-956, 1994. DOI 10.1109/32.177364. Process-level distributional evidence, never instance-level search-space reduction.
49. Humbatova et al. Taxonomy of Real Faults in Deep Learning Systems. ICSE 2020, pp. 1110-1121. 1,059 artifacts, five top-level categories, 92 unique fault types, two-evaluator-plus-escalation agreement procedure; the closest labeling-methodology precedent.
50. Pan, Kim, and Whitehead. Toward an understanding of bug fix patterns. Empirical Software Engineering, 2008. DOI 10.1007/s10664-008-9077-5. Fix-shape classification; direct ancestor of the fix_shape_type field.
51. Walia and Carver. ESEM 2006. DOI 10.1145/1159733.1159784. (Cause-side error taxonomies guide fault search better than fault-side ones.)
52. Walia and Carver. Empirical Software Engineering, 2013. DOI 10.1007/s10664-012-9202-3.
53. Google. Agent Development Kit (ADK): Build and Deploy AI Agents. https://adk.dev, 2026. Retrieved September 29, 2026.
54. Gemma 4 Developer Agent competition corpus dataset census. Internal verification deliverable, September 29, 2026. ZIP-level census: 524 entries, 22.42 GB uncompressed; 129 tasks in a field-uniform 8-field `tasks.jsonl` (67/48/13/1 across fastapi/rich/requests/httpx); 127+127 commit-named graphs and embeddings; `hints_text` empty in 129/129; 70.5 percent single-file gold patches with median +8 added lines; 0/129 gold patches touching tests.
55. What Resolve Rate Hides: Trajectory Structure Diagnostics for Coding Agents (TraceProbe). arXiv:2607.06184, 2026. (File-level action classification is too coarse to separate success from failure; function-level is informative.)
56. Shannon, C. E. A Mathematical Theory of Communication. Bell System Technical Journal 27(3):379-423 and 27(4):623-656, 1948.
57. Huffman, D. A. A Method for the Construction of Minimum-Redundancy Codes. Proceedings of the IRE 40(9):1098-1101, 1952. DOI 10.1109/JRPROC.1952.273898.
58. Campos, J., Abreu, R., Fraser, G., and d'Amorim, M. Entropy-Based Test Generation for Improved Fault Localization. ASE 2013, pp. 257-267. DOI 10.1109/ASE.2013.6693085.
59. Howard, R. A. Information Value Theory. IEEE Transactions on Systems Science and Cybernetics 2(1):22-26, 1966. DOI 10.1109/TSSC.1966.300074.
60. MacKay, D. J. C. Information-Based Objective Functions for Active Data Selection. Neural Computation 4(4):590-604, 1992. DOI 10.1162/neco.1992.4.4.590.
61. Settles, B. Active Learning Literature Survey. Computer Sciences Technical Report 1648, University of Wisconsin-Madison, 2009. Cited via the OpenAlex-verified record; the canonical PDF is unavailable.
62. Massey, J. L. Guessing and Entropy. ISIT 1994. (Standard reference; exact inequality statements to be pinned from the primary PDFs in the final pass.)
63. Arikan, E. An Inequality on Guessing and Its Application to Sequential Decoding. IEEE Transactions on Information Theory 42(1):99-105, 1996. (Standard reference; exact inequality statements deferred to the primary PDFs.)
64. Rissanen, J. Modeling by Shortest Data Description. Automatica 14(5):465-471, 1978. DOI 10.1016/0005-1098(78)90005-5.
65. Quinlan, J. R. Induction of Decision Trees. Machine Learning 1(1):81-106, 1986. DOI 10.1007/BF00116251.
66. Treves and Panzeri. Neural Computation 7(2):399-407, 1995. DOI 10.1162/neco.1995.7.2.399. (The plugin-estimation bias of about (k-1)/(2n) nats that mandates smoothed cell priors.)
67. Panzeri and Treves. Network 7:87-107, 1996.
68. Dang, Y., Wu, R., Zhang, H., Zhang, D., and Nobel, P. ReBucket: A Method for Clustering Duplicate Crash Reports Based on Call Stack Similarity. ICSE 2012. DOI 10.1109/ICSE.2012.6227111. (Crash-signature clustering - the instance-level precedent for conditioning diagnosis on the error signature.)
69. Tishby, N., Pereira, F. C., and Bialek, W. The Information Bottleneck Method. arXiv:physics/0004057, 1999.
70. Tishby and Zaslavsky. arXiv:1503.02406; IEEE Information Theory Workshop (ITW), 2015.
71. Cover, T. M., and Thomas, J. A. Elements of Information Theory, 2nd ed. Wiley, 2006. DOI 10.1002/047174882X.
72. Jones, J. A., Harrold, M. J., and Stasko, J. Visualization of Test Information to Assist Fault Localization (Tarantula). ICSE 2002. DOI 10.1109/ICSE.2002.1007991.
73. Jones, J. A., and Harrold, M. J. Empirical Evaluation of the Tarantula Automatic Fault-Localization Technique. ASE 2005. DOI 10.1145/1101908.1101949.
74. Abreu, R., Zoeteweij, P., and van Gemund, A. J. C. An Evaluation of Similarity Coefficients Based on the Ochiai Coefficient. PRDC 2006, pp. 39-46. DOI 10.1109/PRDC.2006.18.
75. Pearson, J., Campos, J., Just, R., Fraser, G., Abreu, R., Ernst, M., Pang, D., and Keller, B. Evaluating and Improving Fault Localization. ICSE 2017, pp. 609-620. DOI 10.1109/ICSE.2017.62. (FLUCCS; 395 real Defects4J faults versus 2,995 artificial.)
76. Wang, J., Cheung, S. C., Jiang, B., and Zhang, X. Taming Coincidental Correctness. ICSE 2009. DOI 10.1109/ICSE.2009.5070507.
77. Masri, W., and Abou Assi, R. ICST 2010. DOI 10.1109/ICST.2010.22. (Coincidental-correctness cleansing.)
78. Masri, W., and Abou Assi, R. TOSEM 2014. DOI 10.1145/2559932. (Coincidental correctness is prevalent and safety-reducing for coverage-based localization.)
79. Abou Assi, Trad, Maalouf, and Masri. Coincidental Correctness in the Defects4J Benchmark. Software Testing, Verification and Reliability, 2019. DOI 10.1002/stvr.1696. arXiv:1808.09233. Across all 395 Defects4J defects there are 38.1 times more strong-CC tests and 60.5 times more weak-CC tests than failing tests.
80. Weiser, M. Program Slicing. IEEE Transactions on Software Engineering SE-10(4), 1984. DOI 10.1109/TSE.1984.5010248.
81. Groce, A., Chaki, S., Kroening, D., and Strichman, O. Error Explanation with Distance Metrics. TACAS 2004, LNCS 2988, pp. 108-122.
82. Tu, F., and Pattipati, K. R. Rollout Strategies for Sequential Fault Diagnosis. IEEE Transactions on Systems, Man, and Cybernetics - Part A 33(1):86-99, 2003. DOI 10.1109/TSMCA.2003.809206.
83. Steimann and Bertschler. ICST 2009. DOI 10.1109/ICST.2009.24.
84. Steimann and Frenkel. ISSRE 2012. DOI 10.1109/ISSRE.2012.28.
85. Steimann et al. ISSTA 2013 (accuracy-bounds analysis). DOI 10.1145/2483760.2483767. (Content verified only at abstract level.)
86. Gao and Wong. MSeer: An Advanced Technique for Locating Multiple Bugs in Parallel. IEEE Transactions on Software Engineering, 2017. DOI 10.1109/TSE.2017.2776912. Clusters failing tests by fault and estimates the cluster count simultaneously; validated on 840 multiple-bug versions (two to five bugs) of seven C/C++/Java programs.
87. Baah, Podgurski, and Harrold. Causal inference for statistical fault localization. ISSTA 2010. DOI 10.1145/1831708.1831717.
88. Baah, Podgurski, and Harrold. ESEC/FSE 2011. DOI 10.1145/2025113.2025136. (Confounding-mitigation follow-up.)
89. Dettmers, T., Pagnoni, A., Holtzman, A., and Zettlemoyer, L. QLoRA: Efficient Finetuning of Quantized LLMs. NeurIPS 2023. arXiv:2305.14314.
90. Han, T., et al. Unsloth. https://unsloth.ai. (2-5x faster LLM fine-tuning with 80 percent less memory; MIT License.) Retrieved September 29, 2026.
91. DeepSeek-AI. DeepSeek-R1: Incentivizing Reasoning Capability in LLMs via Reinforcement Learning with Verifiable Rewards. arXiv:2501.12948, 2025.
92. Google DeepMind. Gemma 4 model card (gemma-4-31b family), 2026. Web resource. Retrieved September 29, 2026.
93. BCF six-sprint campaign roadmap. Internal planning deliverable, September 29, 2026. Sprint boundaries, the planned labeling pass, and the LoRA decision gate; internal dates are framed as plan, not commitment.
94. Just, R., Jalali, D., and Ernst, M. D. Defects4J: A Database of Existing Faults to Enable Controlled Testing Studies for Java Programs. ISSTA 2014. DOI 10.1145/2610384.2628055. Cited only as a real-fault database and methodological precedent; no fault taxonomy is attributed to it (the paper lists classification as future work).
95. Kaggle. Gemma 4 Developer Agent Competition - Official Rules. 2026. Source of the hand-labeling ban, the competition-data security terms, and winner obligations. Retrieved September 29, 2026.
96. Gemma 4 Developer Agent competition corpus ground-truth ledger. Internal verification deliverable, September 29, 2026. The claim-ledger and discrepancy register (D-01 through D-09) backing the corpus facts cited in this paper.
97. Kahneman, D. Thinking, Fast and Slow. Farrar, Straus and Giroux, 2011.
98. Bettenburg et al. What makes a good bug report? FSE 2008. DOI 10.1145/1453101.1453146.
BCF: Specification-Driven Graph Reasoning for Autonomous Software Engineering Agents - Cooly - Batonic Labs, Detroit, Michigan - November 2026
Submitted to the Google DeepMind / Kaggle Gemma 4 Developer Agent Competition Paper Track - Deadline: November 12, 2026
