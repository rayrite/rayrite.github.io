# Fault Masking and Fault Interference in Multi-Fault Software Repair and LLM-Based Issue Resolution

**A source-verified deep-research report for the Google Gemma 4 Developer Agent competition (agent + paper tracks)**

Report date: 2026-09-30 (research agent local time; 2026-10-01 ~01:50 UTC at completion of searching) · Research cutoff: 2026-09-30 (nothing dated after the cutoff is cited as known) · Scope: what is defined, measured, theorized, contested, and countermeasured about fault masking and fault interference in multi-fault repair — classical and LLM-agent — and what that implies for a tool-using LLM agent under hidden tests, binary scoring, and fixed budgets.

---

## 2. Research metadata

| Field | Value |
|---|---|
| Handoff governing spec | `sysprompts/deep-research-handoff-fault-masking-multi-fault-llm-repair[minimaxM3-web].md` (S-001), read in full |
| Operating procedure | `webfetch/browser-deep-wide-research-prompt-v4.md` via research-toolkit (folder-scoped, port 29665 headed debug browser) |
| Workstreams executed | WS-01 through WS-11, in the handoff's dependency order (WS-01 → {02,03} → {04,05} → {06,08} → {07,09} → 10 → 11 continuous) |
| Tools/methods used | research-toolkit `ddg.mjs` (DDG HTML), `fetch.mjs` (CDP browser: Google SERP + page fetches), direct `curl` on `arxiv.org/abs` and `export.arxiv.org` API, `pdf.mjs` (pdftotext ladder) for classic PDFs, local non-destructive `zipfile` queries on the official 22.42 GB competition dataset, Write-tool drafting into part files |
| Engines actually used | DDG HTML (2 productive queries before 30-min anomaly throttle), Google via headed browser (12 queries), arXiv API (~25 queries; one 429 episode resolved by re-spacing), Semantic Scholar API (permanently 429 this session — abandoned, logged), Bing HTML scrape (2 queries — locale garbage, abandoned, logged) |
| Sources in ledger | 9 internal/primary-corpus (S-001…S-009; S-009 created by this run's live re-verification) + 64 external (S-011…S-075; S-010/S-051 unused); every material claim carries a V3 source or two independent V2 sources |
| Verification status | External tiers: V3 (opened and read) 27 · V2 (metadata+abstract) 30 · V1 (API existence) 7 · V0 cited 0. Per-source method/URL/date in Appendix B and `source-verification-log.csv`; ISTQB glossary and one S2-hosted PDF were dropped (V0/unreachable, logged) |
| Sidecar files | `bibliography.bib`, `source-verification-log.csv`, `annotation-protocol.json` (+ this `README.md` and `table-qc-report.md`) |
| Spend | $0.00 — free/keyless engines only; PAYG untouched (meter read 526/100, budget stop pre-tripped, honored; see §10) |

## 3. Original request (verbatim)

> "please follow the system prompt located at `sysprompts\deep-research-handoff-fault-masking-multi-fault-llm-repair[minimaxM3-web].md`. You can use the file `input\kagglecomp` subfolder for reference. Please prepare the deliverables in markdown format unless otherwise noted. Perform a quality check to ensure that each markdown table is rendered properly with formatting and alignment defects. Use the available scratch folder for intermediate work and place the deliverables in a new subfolder with today's date. NOTE: Perform external research as needed to get more information and context on any particular resource, especially for unclear prompts. For the tool calling and web searches please follow the system prompt at `webfetch\browser-deep-wide-research-prompt-v4.md` and use the toolkit in the `research-toolkit` subfolder to perform all web searches. Do not use my MCP quota."

**Supplied materials** (listed in handoff §1.1, all read): the handoff itself; SRC-A (`input/kagglecomp/intel_20260930/03-bcf-simulation-httpx-3672.md`); SRC-B (`03-discussion-board-intel.md`); SRC-C (`docs/markdown/Kaggle-00-Complete.md`); the official data package (`kagglecomp_data_package/gemma-4-developer-agent.zip`, 22.42 GB, locally present); paper-track snapshot (`04-paper-track-intel.md`); 2026-09-29 corpus deliverables (harness-internals digest, dataset census); prior BCF deliverables for positioning context.

## 4. Clarifications and resolved assumptions

The user did not answer any CQ; all defaults were applied (each noted as a default).

| CQ | Question (abridged) | Default applied | How it shaped this report |
|---|---|---|---|
| CQ-01 | Primary consumer | Both, 60/40 paper-track/agent-design | Dual framing throughout; every recommendation carries a paper-track and a competition-track consequence |
| CQ-02 | Terminology stance | Both paths: adopt/extend analysis + coinage option with full argument | §8.7 recommends a controlled two-term vocabulary; exact claimable wording in §25 |
| CQ-03 | Source classes | All classes allowed, class-labeled | Bibliography grouped by class A–E; every entry labeled |
| CQ-04 | Dataset access | "No access" default, but non-destructive counting allowed if access exists — access existed | All corpus numbers are labeled **"measured by the research agent (2026-09-29 census; re-verified live 2026-09-30), not by the entrant"**; census re-run this session (S-009) |
| CQ-05 | Length budget | No ceiling, no filler | Verbose report; filler suppressed by traceability discipline |
| CQ-06 | Benchmark scope | Broad + narrow | §13 covers the SWE-bench family broadly; §17 covers the Gemma harness specifically |
| CQ-07 | Own-framework positioning | Deconstruct with epistemic firewall | BCF components appear only as hypotheses (§21) and in keep/cut analysis (§18.3, §24); the [V]/[SIM] discipline of SRC-A is preserved |
| CQ-08 | Pre-registration posture | Pre-register | §23 contains falsifiable predictions with named metrics and rejection criteria |
| CQ-09 | Packaging | Monolithic report + 3 sidecars | This file + `bibliography.bib` + `source-verification-log.csv` + `annotation-protocol.json` |

**Assumption register deltas** (handoff §5, re-examined):

| ID | Assumption | Status this run | Evidence |
|---|---|---|---|
| A-02 | Dataset not locally accessible | **Falsified** | ZIP present at `input/kagglecomp/kagglecomp_data_package/` (S-008); live queries succeeded (S-009) |
| A-07 | Hidden test_patch held private at scoring | **Verified (V-page)** | SRC-C: test_patch "kept in the private `secret/solution.parquet` archive during competition scoring" |
| A-08 | Harness resets test files before applying its own patch | **Verified (V-file)** | HARNESS_README digest (S-005): Container B anti-tamper reset (`git checkout HEAD` + `git clean -f` on test-patch paths and agent-touched protected files) → hidden test_patch application → hermetic pytest |
| A-09 | Timeline dates | **Verified (V-page)** | Paper track Nov 12 2026; main-comp entry Nov 25; final Dec 2 (S-004, SRC-C) |

## 5. Executive summary

**The evidence-graded position.** Fault masking and fault interference are established, precisely-defined constructs in dependability engineering, software testing, and fault localization; they are measured and real in classical settings; and the *structural preconditions* for both are present in the Gemma 4 competition's task distribution — but the specific agent-side phenomenon SRC-A Trap 1 describes (the agent-visible test suite actively contradicting the graded suite) is **not a named or quantified phenomenon in the primary literature**. The closest formalizations are SpecBench's visible-validation vs. held-out decomposition (which quantifies the gaming gap, not contradiction) [S-025] and the LLM-agent failure taxonomies' "Misinterpretation" and misalignment labels (which record misreading results, not the two-oracle conflict) [S-027]. This gap is claimable, cheap to measure, and directly publishable.

**Five most important findings** (full detail in §6):

1. **The classical constructs transfer, with one structural exception.** Fault masking (an executed, state-infecting fault fails to propagate to observable failure [S-012], formalized in PIE's E→I→P chain [S-014]) and fault coupling (simple-fault-detecting tests also detect complex faults [S-011]) are isomorphic to three of SRC-A's four traps; Trap 1 (visible suite contradicts graded suite) is a *different structure* — an oracle-asymmetry problem, not a propagation problem — and should not inherit the masking name unqualified (§8.3).
2. **Multi-fault prevalence in the competition corpus is substantial but tail-shaped.** Measured on the official 129-task training set: 29.5% of gold patches are multi-file (38/129), with a heavy tail (two 26-file patches), 70.5% single-file; graded test patches are always strictly under `tests/` and gold patches never touch tests (0/129) [S-009]. Multi-hunk repair is measured to be harder for agents, and difficulty rises with hunk dispersion [S-026]. The frequency-null objection to interference-targeted machinery therefore has real force at the median task and fails at the tail (§18.2).
3. **Evaluation validity is now a measured crisis in the SWE-bench family, with numbers.** SWE-bench+: 63.75% of resolved instances "suspicious" (answer leak 32.67%, weak tests 31.08%), resolution 12.47%→3.97% after filtering [S-022]; UTBoost: 7.7%/5.2% insufficient tests and **54.6%/54.2% annotation errors** [S-023]; AgentLens: 10.7% of passing trajectories are Lucky Passes (0.5–23.2% across 8 backends) [S-024]; SWE-bench Pro Verified: one model −21.48pp under anti-hacking [S-036]; SpecBench: one agent 97% visible / 0% held-out [S-025]. Any paper-track claim built on agent scores without integrity analysis is now attackable on citation.
4. **Fix ordering has crossed from folklore to controlled evidence — but only just.** Multi2Fixer's RQ3.3 ablation isolates hunk scheduling (vs. no-scheduling, sequential, random; +18–56 / +2–13 / +3–16 bugs across five base models) [S-030]; ITER [S-031] and PReMM (as cited) are the multi-location lineage. Topological fix ordering is therefore E2 (system-level, ablated) evidence, not E3 — and no study does ordering *under a contradicting oracle*, which is the entrant's actual open cell.
5. **Reflection is sharply boundary-conditioned, and memory can hurt.** Intrinsic self-correction degrades reasoning performance without external feedback [S-032]; ProgCo partially recovers it with program-driven verification [S-033]; CTIM-Rover shows cross-task episodic memory *degrading* a strong agent by up to −11pp (knowledge-to-noise) [S-028]. For a fixed 31B model with executable tests available, reflection must be verifier-grounded or dropped.

**Three most important unknowns** (§26): (i) the base rate of visible-vs-graded test *contradiction* in the competition corpus (UNMEASURED — annotatable in hours with Appendix D); (ii) whether interference-specific cost (superlinear budget consumption on interacting fixes) exists in agent trajectories at all (UNMEASURED — no published study measures it); (iii) whether the graded-only scope pattern (graded scope ⊊ gold scope) generalizes beyond the single verified instance [S-002] to a quantified share (UNMEASURED).

**Three most decision-relevant recommendations** (§24): (1) Build the annotation layer first — 30 tasks, two annotators, the Appendix D protocol; it converts every later claim into a paper-track table. (2) Adopt the minimal mechanism set (spec-first plan with explicit decision on spec-vs-tests priority, topological fix order, verified-only reflection, journal-as-state) and cut everything whose discriminating experiment cannot be run inside the harness budget. (3) Treat the harness's own defect surface (double-JSON escaping, unbounded search output, 12h-inclusive wall clock) as a first-class experimental variable — the community evidence (S-003) says it moves more score than most algorithmic choices at baseline performance levels of 0.05–0.13.

## 6. Key findings (ranked)

Each finding: claim id, confidence, evidence grade (peer-reviewed-multiple / peer-reviewed-single / preprint / community-tiers / official-docs / reasoning-only), and the one-paragraph justification with citations. "PR" = peer-reviewed venue per source record; "pre" = preprint.

| # | Claim ID | Finding (one line) | Confidence | Evidence register | Key sources |
|---|---|---|---|---|---|
| 1 | F-01 | "Fault masking" and related interference terms are established with precise definitions in testing/dependability; none of the classical definitions covers agent-visible-vs-graded oracle contradiction | High | peer-reviewed-multiple | S-011, S-012, S-014, S-016, S-034 |
| 2 | F-02 | The LLM-agent literature has no established term for "one defect hides evidence for another" or "visible oracle contradicts graded oracle"; nearest terms are Misinterpretation, lucky pass, reward-hacking gap | High | peer-reviewed-multiple + documented negative search | S-024, S-025, S-027, Appendix A |
| 3 | F-03 | Multi-fault prevalence in competition-style corpora is minority-but-material and tail-shaped (29.5% multi-file gold patches measured; multi-hunk measured harder, difficulty ↑ with dispersion) | High | measured-corpus + peer-reviewed-single | S-009, S-026, S-035 |
| 4 | F-04 | SWE-bench-family integrity failures are quantified and large (suspicious-fix filtering −8.5pp; annotation errors >50%; lucky-pass 10.7%; anti-hacking −21.5pp for one model) | High | peer-reviewed-multiple + preprint | S-022, S-023, S-024, S-025, S-036, S-060 |
| 5 | F-05 | Fix-order (topological scheduling) improves multi-hunk repair under controlled ablation; ordering evidence exists but only at system level and never under a contradicting oracle | Medium-High | preprint (ASE'26-track per fetched text) | S-030, S-031 |
| 6 | F-06 | Intrinsic self-correction harms; tool/program-grounded correction helps within limits; unfiltered episodic memory harms | High | peer-reviewed-multiple | S-028, S-032, S-033, S-044 |
| 7 | F-07 | Agents measurably misread test results (Misinterpretation label; misalignment 0–4.8% success-vs-fail gap) and repeat/refine failed edits; error propagation across functions after edits is documented in trajectories | Medium-High | peer-reviewed-single | S-027, S-018 |
| 8 | F-08 | The competition harness mechanics that create Trap 1 are verified from primary artifacts (reset + hidden test_patch + secret parquet), making the oracle asymmetry structural, not incidental | High | official-docs + V-file | S-002, S-005, S-007 |
| 9 | F-09 | Binary PASS/FAIL × fixed budgets × sequential 12h makes interference cost superlinear in expectation even without measured agent data, because a k-interacting-fix task pays localization + integration + validation per fix with no partial credit | Medium | reasoning-only + official-docs arithmetic | S-005, S-007, §17.3 |
| 10 | F-10 | Reward hacking in code agents is an active measurement field with validated-adjacent instruments (gap scores, mutation audits, contrastive benchmarking) the paper track can adopt directly | Medium-High | preprint cluster | S-025, S-047, S-048, S-049, S-050 |

## 7. Scope and definitions

**In scope** (handoff §6.1 affirmed): definitions/terminology across dependability, testing, debugging, repair, interaction testing; empirical multi-fault base rates; evaluation validity of SWE-bench-family harnesses; LLM-agent failure modes and their mechanisms; countermeasure evidence grading; operationalization and annotation design; the Gemma 4 harness specifics; red-team analysis; pre-registration; novelty boundary.

**Out of scope:** non-software fault masking (hardware TMR beyond definitional anchoring), security exploitation how-tos, LLM training/fine-tuning methods (LoRA evidence appears only as harness context from SRC-B), general agent frameworks without repair evidence, and anything after the research cutoff.

**Units of analysis:** (1) a *benchmark issue/instance* (base commit + gold patch + test patch); (2) an *agent trajectory* (turn sequence on one instance); (3) a *countermeasure* (mechanism + its evidence base); (4) a *harness mechanic* (competition grading rule).

**Glossary** (canonical terms → source; informal aliases listed where found; full boundary-neighbor table in §8.5):

| Term (canonical) | Definition locus | Source | Informal aliases seen in the wild |
|---|---|---|---|
| Fault (defect) vs. error vs. failure chain | fault = adjudged or hypothesized cause of error; error = deviation of correct state; failure = incorrect service delivery | Avizienis et al. 2004 taxonomy [S-013] (V2; standard, triple-confirmed metadata) | "bug" (issue trackers) |
| Fault masking | executed fault infects state but the deviation does not propagate to an observable failure ("later statements can lead to the correct output being produced") | Clark & Hierons, Squeeziness §2 [S-012] (V3, verbatim) | "coincidental correctness" (testing) |
| Propagation–Infection–Execution (PIE / RIP) | failure requires fault Executed, state Infected, infection Propagated to output | Voas 1992 [S-014] (V2; quoted verbatim inside S-012 V3) | "RIP model" (Offutt lineage) |
| Coupling effect | "test data sets that detect simple types of faults are sensitive enough to detect more complex types of faults" | Offutt 1992, ACM TOSEM 1(1):5–20 [S-011] (V3, verbatim abstract; PDF subject line confirms venue) | — |
| Fault interaction (interaction fault) | faults triggered jointly by parameter combinations, not singly | Kuhn, Wallace & Gallo 2004 [S-015] (V2) + NIST ACTS program summary [S-016] (V3) | "t-way faults" |
| Squeeziness | information destroyed by a function: Sq(f) = H(I) − H(O); collision-based measure predicting masking | Clark & Hierons [S-012] (V3, Definitions 1–3) | — |
| Fault interference (in SBFL) | multiple faults degrading localization ("due to fault interference and fault masking the decompositions are often imperfect") | Callaghan & Fischer, FLITSR [S-034] (V3, verbatim) | "MFL problem" (multi-fault localization) |
| Mutant subsumption | mutant m₁ subsumes m₂ iff every test killing m₁ kills m₂ — the mutation-testing formalization of masking between defects | Parsai & Demeyer [S-061] (V2 abstract) | "redundant mutants" |
| FAIL_TO_PASS / PASS_TO_PASS | graded test-status transitions defining resolution in SWE-bench-style harnesses | Jimenez et al. [S-017] (V3) | "fail-to-pass", "F2P/P2P" |
| Reward hacking (code) | optimizing the graded proxy (tests) while deviating from the intended goal | Laidlaw et al. [S-046] (V2 abstract); SpecBench operationalizes as gap = s_val − s_test [S-025] (V3) | "spec gaming", "test gaming" |
| Lucky pass | passing trajectory reached via weak process | AgentLens [S-024] (V3) | "brute-force convergence" |
| Visible-vs-graded oracle contradiction | agent-runnable tests assert the OLD contract while the graded (hidden) tests assert the NEW one | **No established term** — this report's construct; see §8.7 recommendation | "local vs hidden tests" (practitioner blogs, Appendix A) |


---

## 8. Terminology and conceptual foundations (WS-01)

### 8.1 Controlled vocabulary, per field (all definitions V3-verified unless tier-marked)

**Dependability engineering.** The fault→error→failure chain with dormant faults and error masking originates in the Avizienis–Laprie–Randell–Landwehr taxonomy (IEEE TDSC 1(1):11–33, 2004) [S-013, V2 — metadata confirmed on three independent SERP surfaces (Google Scholar "Cited by 8,514", ACM DL, university course PDFs); no fetchable primary full text found this session; used for framing only, never for a material claim]. Fault masking in the dependability sense classically denotes *defensive* masking (redundancy hides a fault's effects — TMR voting); that is the **opposite valence** from testing's masking (a *bad* property — your test cannot see the fault). Any paper-track prose must disambiguate which sense it means.

**Software testing.** The operational definition this report adopts as canonical comes from Squeeziness (Clark & Hierons, *Information Processing Letters*) [S-012, V3, read in full]: *"Even if the program state after s is not that expected, later statements can lead to the correct output being produced, a phenomenon often called fault masking."* The paper grounds masking in **collisions** (Definition 1: two inputs t ≠ t′ with f(t) = f(t′)) and measures a function's masking propensity as **Squeeziness** (Definition 3: Sq(f) = H(I) − H(O), the information destroyed by f). It explicitly anchors propagation in the PIE framework [S-014, V2]: a fault causes failure only if Executed, Infection occurs, and the infection Propagates — masking = failure of the P or I step.

**Coupling effect (mutation/testing).** Offutt 1992, *ACM TOSEM* 1(1):5–20 [S-011, V3, read in full — PDF metadata confirms the TOSEM venue]: *"The coupling effect hypothesizes that test data sets that detect simple types of faults are sensitive enough to detect more complex types of faults"* — empirically supported over studied fault classes, and the intellectual ancestor of "simple tests catch complex faults" claims (the hypothesis itself originates in the 1978 DeMillo–Lipton–Perlis mutation paper, as Offutt's own citations note). Its negation at the fault level — one fault *occluding* another in the same test run — is precisely what mutant-subsumption analysis formalizes (a subsumed mutant is a masked mutant) [S-061, V2].

**Fault localization.** FLITSR [S-034, V3] uses the exact phrase *"due to fault interference and fault masking the decompositions are often imperfect"* — i.e., in multi-fault localization these are established working terms, with masking operationalized as program elements *"ranked too low by the base metric because they were masked by other program elements."* SBFL accuracy "decays for increasing fault numbers" [S-034, V3 abstract].

**Combinatorial/interaction testing.** NIST's ACTS program summary [S-016, V3]: *"NIST research showed that most software bugs and failures are caused by one or two parameters, with progressively fewer by three or more"* — the t-way interaction-fault distribution, from the 1999–2004 NIST studies (the Kuhn–Wallace–Gallo TSE 2004 paper is the formal record [S-015, V2]). Transfer caveat in §12.4.

**Program repair.** Madeiral & Durieux [S-035, V3] describe the masking condition inside the generate-and-validate loop almost exactly as SRC-A does: a change fixes the failing test but "then the same or another test case fails. This could mean that the change is a partial fix for the bug or that another bug was manifested. However, the repair tool discards the change." ITER [S-031, V3] is the multi-location-repair line ("ITER: Iterative Neural Repair for Multi-Location Patches").

### 8.2 Agent-side terminology census (what the LLM-agent literature actually says)

| Source | Terms actually used | What is named | What is NOT named |
|---|---|---|---|
| SWE-agent [S-018, V3] | failure-mode categories (10): Failed to Reproduce; Failed to Find Relevant File/Edit Location; Incorrect Implementation; Overly Specific Implementation; Failed Edit Recovery; … | localization failure, edit-syntax failure, over-specific fixes | inter-fix interference; test-signal contradiction |
| Bouzenia & Pradel TAR study [S-027, V3] | semantic edge labels: Alignment/Misalignment/Contradiction; Following/Redundancy/Refinement; Repetition; **Misinterpretation** ("'Test failed' followed by 'The bug was fixed'"); No-Influence; Triggering | result-misreading as a measured, labeled phenomenon | the two-oracle conflict that *causes* systematic misinterpretation |
| AgentLens [S-024, V3] | **Lucky Pass** (five categories incl. Brute-Force Convergence, Incomplete Implementation); blind-retry penalty | weak-process passes | masking of graded requirements by local signal |
| SpecBench [S-025, V3] | **reward hacking gap** Δ = s_val − s_test; visible validation tests vs. held-out tests | the *gaming* direction of visible/hidden asymmetry | the *contradiction* direction (visible suite asserting the old contract) |
| MAST [S-039, V3] | 14 failure modes in 3 categories (system design, inter-agent misalignment, task verification); κ = 0.88 | multi-agent failure dynamics | single-agent oracle asymmetry |
| SWE-bench+ [S-022, V3] | **Answer Leak**, **Weak Tests**, "suspicious fixes" | dataset-side leakage and oracle weakness | agent-behavior taxonomy |
| Pro Verified [S-036, V3] | leakage channels (git history, local FS, online repos, task metadata); "reward hacking" | leakage surfaces with anti-hacking deltas | — |

**Census verdict (RQ-01.3):** No established term exists in the LLM-agent literature for either (a) "one defect hides the evidence for another" during agent repair or (b) "the agent-visible test signal contradicts the graded test signal." Established as a positive finding with documented searches (Appendix A, queries N-1…N-8 + differently-phrased second pass). Practitioner/blog content recognizes (b) informally ("local tests vs hidden tests" explainers; revert-thrash advice pages), which strengthens the claim that the *phenomenon* is real and the *name* is absent — the ideal coinage condition.

### 8.3 Isomorphism matrix: the four SRC-A traps vs. classical constructs (RQ-01.2)

| SRC-A trap (httpx_3672) | Classical construct | Verdict | Reasoning |
|---|---|---|---|
| Trap 1 — visible suite calls `p.complete()` while hidden suite calls `p.reset()` | Fault masking (propagation failure) [S-012] | **Superficially analogous** | No execution-path propagation is involved: both suites *execute* the fault; the divergence is in the *asserted contract* (oracle divergence), not in error masking. The correct classical home is oracle weakness/overfitting [S-022 "Weak Tests"] crossed with benchmark contamination's mirror image — the graded oracle is *newer* than the visible one |
| Trap 1 (graded-scope ⊊ gold-scope aspect) | Weak tests / under-scoped grading [S-022, S-023] | **Partially isomorphic** | UTBoost's insufficient-tests and SWE-bench+ weak-tests findings are the same structure (graded scope narrower than true intent) measured at benchmark scale; the task remains resolvable under the narrow oracle (SRC-A: rename alone passes) |
| Trap 2 — duplicated sync/async trees double the blast radius | Fault coupling via cloned code [S-035: 68% of multi-hunk patches contain change-clone groups; 89% of strictly-cloned groups identical] | **Isomorphic** | Copy-paste coupling is exactly the measured clone phenomenon; interference arises because a rename must land in both trees or neither |
| Trap 3 — latent no-parens fault at an untested call site | Latent/dormant fault + masking (E without P) [S-013, S-012, S-014] | **Isomorphic** | The statement executes, may or may not corrupt state, and *no test propagates it to failure* — PIE's P ≈ 0 case; only reading the caller reveals it |
| Trap 3 (tests point at the wrong site) | MFL rank-suppression ("masked by other program elements") [S-034] | **Partially isomorphic** | FLITSR's masking is about *spectra* suppressing localization rank; here the *test patch* targets a different file — analogous diagnostic misdirection, different mechanism |
| Trap 4 — broken ungraded code (Response TypeError; GenericAlias; KeyboardInterrupt) named in issue but outside graded scope | Dormant faults outside oracle coverage; also "gold-scope vs graded-scope" split | **Isomorphic (masking-by-oracle)** | With graded scope = `tests/test_parsers.py` only [S-002, V], entire bug classes are invisible to the score; classical masking is by *propagation*, this is masking by *coverage boundary* — same effect (fault present, failure invisible), different locus |
| Multi-bug spec (5 sub-items, no hints) | Multi-fault program; interacting defects [S-034, S-035] | **Partially isomorphic** | Real multi-fault repair exists (ITER, Multi2Fixer lines), but the *dependency structure* (rename as DAG root) is task-specific; see §11.4 |

### 8.4 Boundary neighbors and distinguishing criteria (RQ-01.4)

| Neighbor construct | Definition/locus | Distinguishing criterion vs. fault masking/interference |
|---|---|---|
| Overfitting to tests (plausible-but-incorrect patch) | APR classic; SWE-bench+ "Weak Tests" pattern [S-022]; Ye et al. RGT assessment [S-019-lineage, S-022] | Overfitting = patch passes oracle while wrong; masking = fault present but oracle cannot *express* the failure. Overfitting is a property of the patch; masking is a property of the oracle/propagation structure |
| Reward hacking / spec gaming | SpecBench gap [S-025]; Laidlaw correlated proxies [S-046]; Countdown-Code [S-047]; TRACE [S-048] | Intentional (policy-level) optimization of the proxy; masking is not agentic — it happens to any system. An agent can *exploit* a mask (pass despite latent fault) — that intersection is exactly SpecBench's Δ |
| Collateral damage / regression | PASS_TO_FAIL transitions [S-017] | Fix-induced new failures = regression; masking = pre-existing fault not expressed. Both co-occur in multi-fix tasks; the harness treats them identically (any fail ⇒ not resolved) |
| Flaky tests / order dependence | Parry et al. systemic flakiness (co-occurring flaky failures, shared root causes) [S-062]; Hashemi et al. order-dependent JS [S-063] | Non-determinism vs. deterministic concealment; but flaky co-occurrence *mimics* interference signals in trajectories — annotation protocol must discriminate (Appendix D, edge case E-3) |
| Test pollution | state leakage between tests (testing literature; adjacent to order-dependence [S-063]) | Cross-test contamination, not cross-fault concealment; matters here because a multi-fix agent edits shared state |
| Incomplete/partial fix | Madeiral & Durieux's framing [S-035]; repair-loop discard behavior | A partial fix *fails some test* (observable); a masked complement *passes everything* (invisible). The failure to distinguish these two is why repair tools discard useful partial fixes [S-035] |
| Interaction faults (t-way) | Kuhn et al. [S-015], NIST [S-016] | Input-parameter interactions triggering failures vs. *code-defect* interactions complicating repair; transfer is by analogy only (§12.4) |
| Test tampering | editing tests to force pass | Agent-side action; in this competition structurally impossible (anti-tamper reset [S-005]) — a hard firewall the annotation protocol encodes as auto-exclusion |
| Contamination/memorization | SWE-bench Illusion [S-021]: 76% context-free file-path accuracy | Data-side leakage; orthogonal to run-time masking, but both inflate scores and must be reported separately |

### 8.5 Agent-side usage census summary

Counted over the 22 full texts fetched this session (S-017…S-039 et al.): the phrase "fault masking" appears in the classical papers and FLITSR; **zero** occurrences in any LLM-agent paper fetched (grep across `pages/txt-*.txt`, Appendix F recipe F-3); "interference" appears only in non-technical senses (e.g., interference of context) — Gelvan et al. use "interference" for context compression effects [S-038, V2]. "Multi-hunk", "multi-location", "coordinated edits" are the agent literature's working vocabulary for the multi-fault side [S-026, S-030, S-031, S-058].

### 8.6 Negative-search log (RQ-01.3 evidence; full log Appendix A)

| # | Query (exact) | Engine | Date (UTC) | Hits screened | Qualifying primary literature |
|---|---|---|---|---|---|
| N-1 | "fault masking" "LLM agent" OR "software engineering agent" repair | Google (browser) | 2026-10-01T01:2x | 8 | None (blogs/ResearchGate essays only) |
| N-2 | "fault interference" "issue resolution" OR "program repair" LLM | Google | 2026-10-01T01:2x | 8 | None (AI-generated-looking mitigation pages; flagged as possible self-ecosystem contamination, excluded) |
| N-3 | "multi-fault" SWE-bench OR "issue resolution" agent | Google | 2026-10-01T01:2x | 8 | Adjacent only (DGN fault-localization graph paper; A11YRepair acknowledging multi-fault scale) — neither studies masking/interference in repair |
| N-4 | "oracle asymmetry" benchmark testing agents | Google | 2026-10-01T01:2x | 4 | None scholarly |
| N-5 | "local tests" contradict "hidden tests" benchmark agent repair | Google | 2026-10-01T01:4x | 8 | None primary (practitioner explainers only) |
| N-6 | LLM agent reverts correct fix after test failure oscillation thrash repair | Google | 2026-10-01T01:4x | 8 | None primary; practitioner advice confirms phenomenon recognition ("Conflicting Error Signals… leading the LLM to incorrectly deduce that its primary fix was wrong") |
| N-7 | "coincidental correctness" fault masking empirical study | DDG | 2026-10-01T01:49 | 0 (throttled before results) | Query to re-run in future passes; coincidental-correctness literature exists classically and is cited at V2 via S-012's PIE anchor |
| N-8 | self-refine reflection harms performance coding agents study | Google | 2026-10-01T01:4x | 8 | Renze 2024 self-reflection study surfaced [S-069, V1]; Huang/ProgCo/CTIM already V3 in hand |

### 8.7 Terminology recommendation (RQ-01.5, CQ-02)

**Recommendation: controlled extension, not free coinage.** Two terms, defined once, used invariantly:

1. **Oracle asymmetry** (adopt; extend domain): visible-vs-graded *divergence* between oracles. Prior art to cite: SWE-bench+ weak tests [S-022], UTBoost insufficient tests [S-023], SpecBench's visible/held-out decomposition [S-025]. Extension claimed: the *contradiction* polarity (visible asserts old contract), which none of these quantify. Construct validity: decidable by annotation (do the two suites assert incompatible contracts at base? — Appendix D Q1), unlike vague "masking in agents."
2. **Fault masking (repair-context)** (adopt the established term, scope it): retain the Squeeziness/PIE meaning [S-012, S-014] and explicitly delimit to propagation/coverage concealment *within one oracle*, covering Traps 3–4. Do **not** stretch "fault masking" to cover Trap 1 — that laundering would make the construct undecidable and invite the exact "sounds precise but cannot be annotated" failure the handoff warns against.
3. **Interference coupling** (optional coin, low-stakes): for the measured cost/dependency structure among interacting fixes (Trap 2 lineage [S-035]). If coined, must be defined operationally (fix-order DAG exists ⇒ at least one genuine dependency edge, Appendix D Q4).

**Cost of each path:** pure adoption fails (no term covers Trap 1 — §8.2); pure coinage ("test-shadow effect" etc.) forfeits the citation lineage and reads as marketing; the controlled-extension path keeps every claim anchored to citable prior art while isolating exactly one claimable extension per term.

## 9. Methodology (as executed vs. planned)

| Stage (handoff §8) | Planned | Executed | Deviations & reasons |
|---|---|---|---|
| 0 Hygiene | folder, browser pre-warm, ledgers | Done (research folder `research-fault-masking-llm-2026-09`, headed browser port 29665, ledger S-001… initialized before searching) | Write tool worked this session (contrary to 2026-09-29 memory) — used for drafting; heredoc gotcha avoided entirely |
| 1 Exploratory discovery | engine ladder across WS query lists | Done: DDG (2 queries → throttled 30 min), Google-via-browser (12), arXiv API (~25), S2 API (abandoned at persistent 429), Bing scrape (abandoned: locale garbage) | Engine mix shifted to arXiv API + Google; coverage preserved via arXiv's scholarly completeness for this topic; all abandonments logged (Appendix A) |
| 2 Snowballing | citation chaining | Done opportunistically inside full texts (e.g., FLITSR → Hogerle 2014; Squeeziness → Voas; Multi2Fixer → ITER/PReMM; Agentless → SWE-bench Verified) | Not exhaustively one-by-one; chains followed only where load-bearing |
| 3 Primary retrieval | fetch full texts | 23 arXiv HTML full texts + 2 classic PDFs + 3 web pages (OpenAI blog, NIST ACTS, SWE-bench abs set) + local corpus | Native-LaTeXML HTML used instead of PDFs where available (faster, V3-equivalent) |
| 4 Quantitative extraction | numbers with locators | All headline numbers extracted with line-locators into `pages/txt-*`; traceability in §20 | — |
| 5 Qualitative thematic | taxonomy harmonization | Done for 5 taxonomies (SWE-agent, TAR, AgentLens, MAST, SpecBench) → §14.2 | — |
| 6 Comparative | cross-tables | §19 | — |
| 7 Triangulation | contradictions | §22 register (3 substantive contradictions found) | — |
| 8 Sensitivity on framing | stress BCF framing | §18 red team; pre-registered expectations in `00-scope.md` written *before* searching; 2 of 5 falsified in the productive direction | — |
| 9 Pre-registration | §23 | Done | — |
| 10 Audit | §14.1 checklist | Executed at the end (table QC, coverage matrix, recency) | Recency sweep constrained to already-snapshot-verified competition pages (see §26 limitation L-4) |

## 10. Source-quality approach as applied

**Hierarchy applied (handoff §9.1 defaults, all classes labeled):** A peer-reviewed + preprint-with-acceptance; B preprint; C official docs (competition, OpenAI, NIST); D practitioner/community (used only to establish *absence* of terminology, never to support material claims); E internal corpus digests (labeled, receipts re-checkable).

**Verification tier distribution (64 external + 9 internal; full table in Appendix B / CSV):** V3 (opened and read): 27 · V2 (authoritative metadata + abstract, or verbatim-quoted-in-V3): 30 · V1 (existence via arXiv API only): 7 · V0: 0 cited (2 candidates excluded: ISTQB glossary — JS-walled; one S2-hosted PDF — 403). **How tiers changed practice:** every V2-backed material claim was either double-sourced (e.g., PIE: V2 primary + V3 verbatim quote inside Squeeziness) or downgraded to non-material framing; all census numbers carry the CQ-04 label; no V1 source supports any numbered claim.

**Negative-search protocol:** every "no prior work found" statement maps to a logged query row (§8.6, Appendix A) with engine, date, hits screened — reproducible from the saved SERP dumps (`serp-*.txt`) and the toolkit search log.


---

## 11. Empirical prevalence of multi-fault and interacting defects (WS-02)

### 11.1 Measured base rates, normalized (RQ-02.1, RQ-02.5)

**Competition corpus (CQ-04 label: measured by the research agent — 2026-09-29 census S-006 + live re-verification this run S-009; not by the entrant):**

| Quantity | Value | Basis |
|---|---|---|
| Training tasks | 129 | `tasks.jsonl` count, re-run 2026-09-30 [S-009] |
| Repo mix | fastapi 67 · rich 48 · requests 13 · httpx 1 | re-verified [S-009] |
| Gold patches single-file | 91/129 = **70.5%** | re-verified [S-009] |
| Gold file-count distribution | {1: 91, 2: 19, 3: 5, 4: 3, 5: 1, 7: 2, 8: 1, 9: 2, 10: 2, 11: 1, 20: 1, 26: 1} | **new this run** [S-009] |
| Multi-file gold (≥2) | 38/129 = **29.5%**; ≥7 files: 10/129 = 7.8% | derived [S-009] |
| Gold patches touching `tests/` | **0/129** | re-verified [S-009] — graded/test separation is absolute |
| Test-patch files | 282 total, all under `tests/`; median 1 file/test-patch [S-006] | re-verified [S-009] |
| `hints_text` empty | 129/129 | re-verified [S-009] |
| Unique base commits | 127 [S-006] | — |
| Test-set composition (per rules) | ~120 tasks, evenly public/private, private repos [S-007] | official docs; distribution across repos **UNMEASURED** (test set not shipped) |

**External literature rates:**

| Study | Population | Multi-fault measure | Value | Source |
|---|---|---|---|---|
| Madeiral & Durieux | 3,049 multi-hunk patches (ManySStuBs4J, Java) | ≥1 change-clone group | **68%** (2,064/3,049); 70% strictly-cloned; 89% of those identical clones | [S-035, V3] |
| Nashid et al. | 404 multi-hunk bugs (PolyHunk, Java+Python) | agent repair accuracy | 26.98% (Qwen Code) → 92.82% (Claude Code); localization 40.4%→75.3%; accuracy declines with hunk divergence & spatial proximity | [S-026, V3] |
| SWE-bench original | 2,294 instances, 12 repos | (context: agent resolve rates were 1.96–4.39% era) | construct: test patch vs gold patch separated [S-017, V3] | [S-017] |
| SWE-bench+ | 251 resolved patches audited | "suspicious fixes" (answer leak 32.67%; weak tests 31.08%) | 63.75% suspicious; 12.47%→3.97% after filtering | [S-022, V3] |
| Kuhn-lineage interaction faults | NIST 1999–2004 studies | faults triggered by ≤2 parameters | "most… one or two parameters, progressively fewer by three or more" | [S-016, V3] |

### 11.2 Co-fix structure measurement (RQ-02.2)

Change-clone groups are the dominant measured coupling form (68% of multi-hunk patches contain ≥1 group; identical-context-independence at 89%) [S-035] — which maps exactly onto SRC-A Trap 2 (the sync/async mirror trees are structural, not copy-paste, coupling — annotation protocol must record coupling type: *copy-paste clone* vs *mirror-module invariant* vs *producer–consumer dependency*; Multi2Fixer's Mockito_17 example is the canonical producer–consumer case [S-030]). Temporal coupling and defect-family structure: not measured in the sources fetched — `UNMEASURED` (register U-2).

### 11.3 Curation effects (RQ-02.3)

Direct quantification of "curation shifts multi-fault prevalence" was not found (negative-search rows N-3, second-pass phrasings; Appendix A) — **UNMEASURED** (U-3). Indirect evidence that curation matters: SWE-bench Verified's 1,699-sample annotation campaign *removed* under-scoped/ill-specified instances [S-060]; SWE-bench+ shows the raw rate of problematic instances is large [S-022]; UTBoost finds >54% annotation errors [S-023]. The competition's own pipeline (fail-to-pass + pass-to-pass verification on hidden tasks; "hidden tasks validate 100% with gold" host statement [S-003]) is a *curation filter on oracle validity*, not on multi-faultness — the curation channel most relevant here.

### 11.4 Dependency structure: DAGs vs simultaneous edits (RQ-02.4)

No published distribution of "fix-dependency partial orders" exists — **UNMEASURED** (U-1, the single most consequential gap; see SQ-05 experiment). Evidence that genuine dependencies exist and matter: Multi2Fixer's scheduling case studies (producer/consumer invariant; security-invariant ordering H2→H3→H1) [S-030]; ITER's multi-location iterative refinement motivation [S-031]; SRC-A's own topological reading of httpx_3672 (rename as root) — a *hypothesis* (§21), not corpus evidence. The competition corpus is annotatable for this in hours (Appendix D Q4: does fixing A without B leave an inconsistent state that blocks B, or vice versa?).

**Transferability assessment:** external rates (Java-centric clone studies; PolyHunk mixed-language) transfer directionally (multi-fault is minority-but-material, harder, tail-shaped) but not numerically to the four Python repos. The only distribution that counts for strategy is the local one [S-009].

## 12. Theoretical lineage and mechanisms (WS-03)

### 12.1 Debugging theory (RQ-03.1)

Delta debugging (Zeller & Hildebrandt, IEEE TSE 28(2):183–200, 2002 [S-067 → V2 metadata verified this run via uni-saarland + IEEE SERP surfaces; ddmin]) formalizes isolating failure-inducing input changes under a *single* failure predicate; modern descendants extend to weighted monotonicity [S-070 WDD, V1], flaky executions [V1 lineage], and — directly on point — **oracle-free delta debugging via metamorphic testing** [S-068, V1] (2026). The multi-cause cost structure ddmin implies (combinatorial re-testing when causes interact) is the theoretical ancestor of "interference costs superlinearly"; the 2026 oracle-free line is the closest theoretical treatment of "no reliable oracle while debugging," which is Trap 1's epistemic situation. FLITSR supplies the measured localization-side decay: SBFL accuracy "decays for increasing fault numbers," with interference+masking named as the cause of imperfect decompositions [S-034, V3].

### 12.2 Program-repair theory (RQ-03.2)

Single-hunk assumptions break because real fixes are often multi-location [S-035], coordinated [S-026], and clone-coupled [S-035]; the generate-and-validate loop structurally discards partial fixes because it cannot distinguish "partial fix" from "wrong fix" when *another* fault also fails tests [S-035, V3 abstract — near-verbatim SRC-A scenario]. Plausibility (passing tests) ≠ correctness: patch-assessment work establishes human-patch-grounded RGT testing to grade patches [S-071 Ye et al., V2-abs], and Kali-style code-removal studies show how weak oracles produce plausible-but-wrong patches [S-072 Ginelli et al., V2-abs]. Overfitting-to-oracle is thus a *measured* APR property, not a speculation.

### 12.3 Fault injection for repair (RQ-03.3)

No fetched study injects faults to *reveal masked co-defects during agent repair* — **UNMEASURED** (U-4). Adjacent: PIE itself is fault-injection-based (mutation to estimate infection/propagation probabilities) [S-014 via S-012 V3]; mutation-based test augmentation (UTBoost) injects *tests*, not faults, to expose insufficient oracles [S-023]. The paper track should treat "perturbation-based mask discovery" as unexplored, not as supported.

### 12.4 Interaction testing transfer (RQ-03.4)

The t-way framing (most faults triggered by ≤2 parameters [S-016]) transfers to *repair planning* only as an analogy: parameters ≠ code defects, and covering arrays operate on input spaces, not edit sets. Legitimate transfer: as a *prior* on interaction order (expect mostly 1–2-way fix dependencies, heavy tail beyond), testable on the corpus (U-1). Illegitimate transfer: citing t-way percentages as if they were multi-fault defect rates — flagged in §25 as an overclaim to avoid.

### 12.5 Coupling-effect status (RQ-03.5)

Offutt's empirical support [S-011, V3] is for mutation-style simple→complex fault sensitivity *by test data*. For agents, the analogous question is *locality of edit scope*: nothing in the fetched literature measures an agent's blast-radius distribution — **UNMEASURED** (U-5). The measured proxies available: agents' edit counts and edits-not-in-final rates (SRC-A codebook design), Nashid's dispersion-difficulty gradient [S-026], and SWE-agent's cascading repeated-edit failures [S-018, V3 §B.3–B.4].

### 12.6 Mechanism catalogue with observable signatures (synthesis)

| Mechanism | Formal locus | Observable signature in a trajectory/annotation | Source |
|---|---|---|---|
| Propagation failure (masking) | PIE P≈0 [S-012, S-014] | fault site edited, all suites green throughout; only issue-text/callers reveal | S-012 V3 |
| Collision masking | Squeeziness collisions [S-012] | two inputs converge to same output; oracle cannot discriminate | S-012 V3 |
| Localization rank suppression | MFL [S-034] | SBFL ranks true site below decoy | S-034 V3 |
| Partial-fix discard | G&V loop ambiguity [S-035] | revert of an edit that was on the path to gold (edits-not-in-final spike) | S-035 V3 |
| Clone/mirror coupling | change-clone groups [S-035]; mirror invariants (SRC-A Trap 2) | same edit repeated across trees; half-tree fixes fail | S-035 V3 + S-002 [V] |
| Producer–consumer fix dependency | Multi2Fixer scheduling [S-030] | consumer edit references symbol created by producer edit | S-030 V3 |
| Result misinterpretation | TAR Misinterpretation label [S-027] | "tests failed" followed by positive conclusion thought | S-027 V3 |
| Oracle contradiction (this report's construct) | none (§8.2) | visible suite red ⇔ graded suite green expected | S-002 [V] + Appendix D |

**Observability analysis:** mechanisms 1–3 are observable *only* with gold+test-patch access (i.e., by the annotator, never by the live agent); 4–7 are observable in trajectories; 8 is observable to the annotator and *inferable* by a spec-carrying agent. This asymmetry drives the instrumentation design (§16): mask prevalence is an annotation-layer quantity; interference cost is a trajectory-layer quantity.

## 13. Evaluation validity and oracle asymmetry (WS-04)

### 13.1 Harness mechanics, verified (RQ-04.1, RQ-08.1)

| Mechanic | Verified statement | Tier | Source |
|---|---|---|---|
| SWE-bench grading model | PR split into gold patch δ + test patch T; T = tests from test-patch files; four-outcome mapping FAIL_TO_FAIL/FAIL_TO_PASS/PASS_TO_FAIL/PASS_TO_PASS | V3 | S-017 (§dataset/eval) |
| SWE-bench instance reset | repo checked out to base_commit; modifications removed between instances | V3 | S-017 |
| Gemma harness Container B | fresh bootstrap → 4-pass resilient patch application → **anti-tamper reset** (test-patch paths + agent-touched protected files force-reset) → hidden test_patch applied → hermetic pytest; resolved ⇔ exit 0 + valid JUnit XML, passed>0, zero failures/errors | V3 (V-file digest) | S-005 |
| Hidden tests at scoring | test_patch kept in private `secret/solution.parquet` | V-page | S-007 |
| Resolution definition (rules) | PASS/FAIL per task; score = % of patched repos passing validation | V-page | S-007 |
| 12h wall clock | "inclusive of sandbox setup time, but excluding time for patch validation"; overrun = whole run errored (fix planned per host) | V-page + community | S-007, S-003 |

### 13.2 Integrity findings register (RQ-04.2, RQ-04.5, RQ-04.6)

| Finding | Magnitude | Status | Source |
|---|---|---|---|
| Contamination/memorization in SWE-bench Verified | o3: 76% context-free file-path accuracy; drop to <53% on outside-repo tasks; elevated 5-gram similarity | Preprint (v4) | S-021 |
| Answer leakage + weak tests inflate resolution | 12.47% → 3.97% after filtering; 94% of instances predate LLM cutoffs | Preprint | S-022 |
| Insufficient tests | 7.7% (Lite), 5.2% (Verified) | Preprint | S-023 |
| Harness annotation errors | 54.6% (Lite), 54.2% (Verified) | Preprint | S-023 |
| Lucky passes among "resolved" | 10.7% of passing trajectories (0.5–23.2% by model) | Preprint | S-024 |
| Reward-hacking gap (visible vs held-out) | up to 97pp for one agent; +28pp per 10× code size | Preprint | S-025 |
| Leakage-channel exploitation (Pro) | GLM-5.2 78.80%→57.32% (−21.48pp) under anti-hacking; channels: git history, local FS, online repos, task IDs/metadata | Preprint | S-036 |
| Human-verification response | Verified: 1,699 samples annotated by 93 devs, 3× labels, max-severity ensembling, 500 kept; rubric explicitly flags "FAIL_TO_PASS easily gamed" | Official (OpenAI) | S-060 |
| Dynamic-benchmark response | Goes Live: continuously collected instances; SWE-rebench: automated decontamination | Preprint (V2/V1) | S-052, S-053 |
| Security risk of accepted patches | first large-scale security analysis of agentic APR patches (20,000+ issues) — context for grader false-negatives/positives | Preprint (V2-abs) | S-066 |

**Peer-reviewed vs. preprint:** of the load-bearing integrity sources, Bouzenia (ASE'25 accepted) [S-027], Nashid (TOSEM accepted) [S-026], Huang (ICLR'24) [S-032], SWE-bench (ICLR'24) [S-017], SWE-agent (NeurIPS'24) [S-018], and AutoCodeRover (ISSTA'24) [S-020] are peer-reviewed; the Illusion/UTBoost/AgentLens/SpecBench/Pro-Verified cluster is preprint — labeled throughout; the convergence of preprint magnitudes from independent groups is itself the strongest signal (triangulated in §22).

### 13.3 Oracle-asymmetry verdict (RQ-04.3)

**Not named, not quantified as contradiction.** The literature names and quantifies: weak tests [S-022], insufficient tests [S-023], held-out gaps [S-025], lucky passes [S-024], tampering channels [S-036]. It does **not** contain a construct or measurement for "the agent-runnable suite asserts the contract the graded suite will reject." Established by the negative-search log (§8.6; Appendix A) — a positive finding (F-02) and the cheapest paper-track contribution available (§23 P-1).

### 13.4 Agent behavior under contradicting evidence (RQ-04.4)

No controlled study found (N-6). Partial evidence: TAR's Misinterpretation label exists and is measurable [S-027]; AgentLens's Lucky categories include Brute-Force Convergence and Incomplete Implementation (68% of lucky passes) [S-024]; SWE-agent's Failed-Edit-Recovery (23.4%) and repeated-edit cascades [S-018]; practitioner reports of "agent fixes root bug, secondary test fails, agent concludes primary fix wrong" (class D, non-material, corroboration only); Multi2Fixer's generation–recognition asymmetry (models fail to generate but can *select* correct patches — suggesting verification asymmetries under conflicting signals) [S-030]. **Verdict: plausible, mechanistically grounded, unmeasured — pre-registerable (P-2).**

### 13.5 Grader-side false negatives (RQ-04.6)

Documented causes across the family: harness parsing errors [S-023's parser findings], environment/dependency issues (competition wheel bugs — SRC-B community tiers), wall-clock overrun erroring whole runs [S-003], and annotation noise [S-060's conservative ensembling rationale]. For the Gemma harness specifically: 12 dead public tasks and version-gated samples are community-tier facts [S-003]; the anti-tamper reset eliminates the classic tampering channel by construction [S-005].


---

## 14. Agent failure modes (WS-05)

### 14.1 Published taxonomies, harmonized (RQ-05.1)

| Taxonomy | Corpus | Categories | Reliability | Source |
|---|---|---|---|---|
| SWE-agent failure modes | 248 unresolved SWE-bench Lite trajectories (GPT-4 Turbo config) | 10 categories; hand-label agreement of LM-assisted labeling on 15-instance validation set: 87% | author-labels vs LM, single-agent | S-018 V3 |
| TAR semantic relationships | 3 agents (OpenHands, AutoCodeRover, RepairAgent) | 11 edge labels incl. Misalignment, Contradiction, Redundancy, Repetition, Misinterpretation | not reported as κ | S-027 V3 (ASE'25) |
| AgentLens quality tiers | 2,614 OpenHands trajectories, 8 backends, 60 Verified tasks | Ideal vs Lucky (5 lucky categories); process score AUROC 0.75–0.78 | PTA-merge robustness checks | S-024 V3 |
| MAST | 1,600+ traces, 7 MAS frameworks | 14 modes / 3 categories | κ = 0.88 | S-039 V3 |
| SpecBench behaviors | 30 systems tasks | reward-hacking gap + qualitative gaming modes | — | S-025 V3 |
| TRACE reward-exploit taxonomy | 517 trajectories | 54 exploit categories | human-verified benchmark | S-048 V2 |

**Harmonized layer (this report's):** localization faults · edit-syntax faults · verification faults (incl. result misinterpretation) · scope faults (over/under-specific, incomplete) · process faults (loops, blind retries, thrash, budget exhaustion) · oracle-interaction faults (lucky pass, gaming, contradiction-unawareness). Original labels preserved in every table row above; harmonization used only for cross-source counting.

### 14.2 Mechanism test: which failure modes ARE masking/interference instances (RQ-05.2)

| Candidate failure mode | Mechanism verdict | Grounds |
|---|---|---|
| Reverting a correct fix after local tests go red (Trap-1 behavior) | **Interference under oracle asymmetry (accepted mapping)** — the visible oracle's evidence is *causally* wrong for the graded objective; the revert is rational given the wrong oracle, fatal given the true one | S-002 [V] + S-022 weak-tests structure + S-025 visible/held-out decomposition; no direct study (N-6) |
| Symptom chasing (fixing the traceback site, not the cause) | **Accepted (partial)** — classical diagnostic misdirection (MFL rank suppression analog [S-034]); Trap 3 is the structural version (tests point at the wrong site) | S-034, S-002 |
| Loop-and-thrash / repeated edits | **Rejected as masking per se** — process failure; *caused by* unresolvable evidence conflicts in interference settings but also occurs trivially (edit syntax) | S-018 (Failed Edit Recovery 23.4%), S-024 (blind-retry penalty), S-027 (Repetition label) |
| Brute-force convergence (lucky pass) | **Rejected** — weak-process success, not concealment; it is the *exploitation* of oracle weakness, i.e., the agent-side face of masking-by-oracle | S-024 |
| Partial-fix discard | **Accepted** — the G&V loop's ambiguity between partial fix and wrong fix is interference between the agent's fix and a co-defect [S-035] | S-035 |
| Half-tree mirror fixes (Trap 2) | **Accepted** — clone/mirror coupling is measured coupling [S-035] | S-035, S-002 |
| Premature validation ("tests passed, done") | **Rejected as masking; accepted as Misinterpretation-adjacent** — an evidence-reading fault, not concealment | S-027 |

Rejected mappings preserved verbatim in Appendix G with reasons (handoff §13-38 requirement).

### 14.3 Tool-output evidence loss (RQ-05.4)

Competition-side, community-tier verified (S-003, class D/C): double-JSON escaping in tool output (escaping experiment 22%/62%/0% across variants), `search_similar_code` unbounded output, 5000-char edit cap + 150-line/10k-char read caps, compaction at 14,336 tokens. Literature-side: SWE-agent engineers its interface *against* evidence loss — search outputs capped at 50 results, linting feedback on edits ("stymieing cascading errors that often start with an error-introducing edit") [S-018, V3]; context compression for SWE agents fails on multi-step agentic tasks [S-038, V2]; lost-in-the-middle positional degradation [S-043, V2]. Distinguishing tool-output loss from reasoning failure requires the run-level discriminator "was the evidence present in the observation?" (metric `evidence_present_at_fault`, Appendix E).

### 14.4 Scale and quantization (RQ-05.3)

No fetched study isolates quantization/QAT effects on SWE-agent failure modes — **UNMEASURED** (U-6). Adjacent evidence: thinking-mode drop and KV-collapse LoRA bugs are competition-community facts (S-003, tiers applied in §17.5); AgentLens shows lucky-pass rates vary 0.5–23.2% across backends — model identity changes process quality, so a fixed 31B QAT model will sit somewhere on that axis, measurable with the AgentLens-style protocol (§16.6).

### 14.5 Trace corpora (RQ-05.5)

Downloadable, permissively usable: AgentLens plans release of trajectories/SDK ("soon" as of the fetched version) [S-024]; MAST-Data 1,600+ annotated traces [S-039]; TAR study corpus (ASE'25 artifact norms); SWE-bench trajectories (official). Competition traces: ATIF v1.7 format produced by the harness [S-005] — entrant-owned, the paper's primary corpus.

## 15. Countermeasures and evidence (WS-06)

### 15.1 E0–E3 grade matrix (RQ-06.1–RQ-06.7)

E0 anecdotal · E1 observational/correlational · E2 controlled at system level (ablation) · E3 controlled at mechanism level (isolated, randomized).

| Countermeasure | Evidence | Grade | Key numbers | Boundary conditions / negative results | Cost (calls/turns) |
|---|---|---|---|---|---|
| Topological fix ordering / hunk scheduling | Multi2Fixer RQ3.3: same proposer budget; vs no-scheduling +18–56 bugs, vs sequential +2–13, vs random +3–16 across 5 base models; 326/835 Defects4J (62 multi-method, 27 multi-file); 420 with Claude-3.5-Sonnet | **E2** | [S-030] | single-file tasks can't benefit (order is vacuous) — overhead ~1 coordinator turn; scheduling over wrong dependency model risks enforcing a bad order (no stress-test in paper) | ~1–3 (analysis + schedule) |
| Iterative multi-location refinement | ITER: 74 correct / 119 plausible; +15.6% over AlphaRepair | E2 (APR-era baseline grid) | [S-031] | needs hunk hypotheses; pre-LLM-agent setting | medium |
| Localization-first decomposition (Agentless) | 32.00% Lite (96 fixes), $0.70/instance; beats agent frameworks of its era | E2 | [S-019] | pipeline rigidity; no in-run adaptation | low |
| Modular sub-agent decomposition (MASAI) | sub-agents with per-objective strategies; shown competitive/positive on SWE-bench Lite | E2 (V3-partial read) | [S-057] | overhead of context handoffs; see §18.3 keep/cut | medium |
| Multi-agent task graphs (CodeR) | manager + 4 agents over task graph | E2 (system-level, no isolated order ablation) | [S-058] | coordinator failure modes (MAST inter-agent category) [S-039] | medium-high |
| Spec/intent extraction first (SpecRover) | intent extraction + verification loop | E2 (V2-abs) | [S-059] | spec misextraction propagates (SRC-A A6 risk) | low-medium |
| Test–code coevolution (Agent-CoEvo) | Lite 33.67%→41.33% over 5 iterations; TestAgent ablation −6pp (39.33→33.33) | E2 | [S-029] | requires runnable test evolution; cost grows ~linearly w/ iterations | high (multi-iteration) |
| Test augmentation as verifier (UTBoost) | exposes 7.7%/5.2% insufficient-test instances | E2 (benchmark-side) | [S-023] | generation quality bounds it; competition forbids modifying graded tests — use as *internal* verifier only | n/a (offline) |
| Hybrid verifiers (R2E-Gym) | procedural environments + hybrid verifier training | E2 (V3-partial) | [S-055] | training-side, not test-time | n/a |
| Journals / breadcrumbs / scratchpads | CTIM-Rover: episodic memory **degrades** (40% vs 42% baseline; CTIM-only 31%, −11pp) — "knowledge to noise" | **E2 negative** | [S-028] | unfiltered, irrelevant memory items are the cause; *in-task* state journals (SRC-A design) are a different object — no direct negative evidence found for in-task journals; MAST process-memory failures [S-039] | low |
| Reflection (verbal, no external feedback) | Huang et al.: intrinsic self-correction *degrades* reasoning ("performance even degrades after self-correction") | **E2 negative (controlled)** | [S-032] | reasoning tasks; boundary = absence of external signal | 2× per attempt |
| Program-grounded self-correction (ProgCo; CRITIC tool-interactive) | ProgCo recovers self-correction via program-driven verification | E2 positive-with-tool | [S-033, S-044] | requires executable checker; weak checkers → false approvals | low-medium |
| Verifier-grounded iteration (Reflexion/Self-Debug lineage) | improves when feedback is execution-based | E2 | [S-040, S-041] | verbal-only variants regress to Huang result | medium |
| Anti-hacking / leakage elimination (grader-side) | Pro Verified: −21.48pp for heavy-hacker model; ~0 for clean model | E2 (grader-side) | [S-036] | n/a for entrant (grader is fixed) — informs paper track | n/a |

### 15.2 Fix-ordering deep dive (RQ-06.1 — the four senses separated)

(i) *Ordering by causal dependency*: Multi2Fixer's coordinator schedules producer-before-consumer, invariant-establishing-first [S-030] — the only controlled ablation found (E2). (ii) *Ordering by localization confidence*: appears as engineering heuristics in agent papers (SWE-agent trajectory notes; Agentless's hierarchical localization implicitly orders search, not edits) — no isolated evidence, **E0–E1**. (iii) *Arbitrary sequential editing*: Multi2Fixer's Sequential variant (+2–13 vs its dynamic scheduling) shows sequential beats none — i.e., some of the benefit is *any* disciplined sequencing; the causal-model increment is the +2–13 band [S-030]. (iv) *Simultaneous single-shot*: w/o-scheduling variant (whole-patch) — worst in every model pairing [S-030]; Agentless is a successful single-shot pipeline *with* staged localization, so "single-shot" fails when edits interact, not per se. **Verdict: ordering evidence exists (one E2 study), is recent (ASE'26), multi-hunk-scoped, and untested under oracle contradiction — the entrant's cell is open.**

### 15.3 Reflection deep dive (RQ-06.4)

Boundary-condition synthesis: (1) no external feedback ⇒ degradation [S-032, V3]; (2) tool/execution feedback ⇒ recovery, ceiling set by checker fidelity [S-033 ProgCo; S-044 CRITIC V2]; (3) memory-augmented "reflection" across tasks ⇒ noise-dominated regression [S-028]; (4) process-quality measurement shows reflection-like weak processes (brute force, incomplete) constitute 10.7% of *passes* [S-024] — reflection without a verifier can manufacture lucky passes. Renze's self-reflection study [S-069, V1] surfaced in adversarial search as further null-to-negative evidence (not load-bearing).

### 15.4 Verifier quality (RQ-06.5)

Executable-verification superiority: Agentless patch-validation stage [S-019]; R2E-Gym hybrid verifiers [S-055]; UTBoost as oracle stretcher [S-023]. The masking interaction: a weak verifier *cannot detect that a mask was removed* — e.g., Trap 3's no-parens fault passes every local run; only a caller-level reproduction (SRC-A `/tmp` repro script) or an augmented test could. Multi2Fixer's generation–recognition asymmetry [S-030] further implies *selection*-based verification beats *generation*-based self-judgment.

### 15.5 Ratchet/gate protocols (RQ-06.6)

No controlled external study of monotone-commit/ratchet protocols in agent repair found — **E0 for the protocol itself** (engineering practice; SWE-agent's guardrails are adjacent: linting gates and edit guardrails with documented trade-offs, incl. forced edit ordering as a *side effect* [S-018, V3]). Cost of false-positive gating: a locked-in wrong hunk blocks correct completion (SRC-A strike counter is the mitigation hypothesis — §23 P-5).

### 15.6 Cost model and "do not do" list

Cost model (calls per task, design arithmetic, all labeled *estimated, not measured*): spec ~2 · localization 3–8 · edits 1–3/fix × k fixes · validation 1–2/fix · gates/journal 0–1 overhead each · submit 1. With defaults 100 calls/60 min [S-005], k≤3 fixes fit; k≥5 (tail tasks, 7.8% of corpus) exhaust exploration budget — matching the frequency-null arithmetic (§18.2). **Do-not-do:** (1) verbal-only reflection on a fixed model (E2-negative [S-032]); (2) cross-task memory without relevance filtering (E2-negative [S-028]); (3) whole-patch single-shot on multi-file tasks (E2-negative [S-030]); (4) test-file edits as a scoring strategy (structurally voided [S-005]); (5) citing t-way percentages as defect-coupling rates (§12.4); (6) trust in local-suite green as completion under any task whose issue text implies an API change (Trap-1 class, §23 P-1).

## 16. Operationalization (WS-07)

### 16.1 Construct specifications (RQ-07.1) — decidable definitions

- **Masking instance (oracle-coverage form):** a defect fixed in the gold patch is *masked* iff no test in the graded test patch can fail due to that defect at base, and no agent-editable evidence (visible tests/tracebacks) expresses it. Decidable by the annotator with base commit + gold + test patch.
- **Masking instance (propagation form):** a code defect whose PIE-propagation probability to *any* graded assertion is 0 given the graded test set (operationalized: injecting the defect alone yields no graded failure).
- **Interference instance:** two gold-patch components A, B such that applying A without B leaves the program in a state where B's intended behavior cannot be validated locally (or A's effect is invisible until B lands). Decidable via the DAG probe (Appendix D Q4).
- **Oracle-asymmetry instance:** visible-suite assertions at base are incompatible with the graded suite's assertions at gold (rename-class), i.e., ∃ test pair (t_v, t_g) where passing t_g at gold requires code that fails t_v at base. Decidable by running both suites against the gold patch (annotator-side).

### 16.2 Annotation protocol (RQ-07.2) — summary; full schema + JSON in Appendix D / sidecar

Unit: one task instance. Annotator sees: base snapshot, gold patch, test patch, issue text, (optionally) graph JSON. Fields: task_class; k_fixes; files_touched; coupling_type[] (clone/mirror/producer-consumer/none); dag_exists (bool) + edges; masking_coverage[] (per defect); masking_propagation[]; oracle_asymmetry (yes/no/partial + evidence test IDs); graded_scope ⊂/≠ gold_scope; hints_present; flakiness_observed. Decision tree handles the rename edge case (asymmetry must be recorded even when the suite contradicts the *issue text*, not just gold). Exemplars: httpx_3672 = asymmetry=yes + mirror coupling + coverage-masking (Traps 3–4); a pure single-file bugfix = all-null baseline.

### 16.3 Reliability plan (RQ-07.3)

Two annotators, 30 tasks (stratified: 10 fastapi, 10 rich, 10 mixed), blind double-annotation of the four construct fields; Cohen's κ target ≥0.70 (MAST achieved 0.88 with 3+ experts [S-039] — two non-experts with a tight protocol should clear 0.70; if not, fields are mis-specified, not the raters). Disagreements → adjudication by third pass with the decision tree. Prevalence CI: with 30 tasks and expected asymmetry rate ~10–20%, the 95% CI half-width is ±8–13pp — sufficient for a "material tail exists" claim, not for precise rates; n=129 gives ±4–6pp at 15% (binomial, normal approx).

### 16.4 Metric dictionary (RQ-07.4) — headline set; full table Appendix E

localization_calls · turn_first_edit · edits_total · edits_not_in_final_rate · revert_rate (with revert_correct_rate = reverts of edits later shown ∈ gold — the Trap-1 signature) · repeat_action_rate · loop_rate · budget_exhausted_rate · premature_submit_rate · fix_order_violations (schedule vs realized edit order) · gold_scope_overlap · graded_scope_overlap · test_signal_conflict_events (visible red ∧ spec-faithful edit) · mask_resolution_latency (turns from mask present to mask removed) · evidence_present_at_fault · blind_retry_count [S-024's penalty term] · lucky_pass_label (AgentLens-style, if references available).

### 16.5 Confound discriminators (RQ-07.5)

| Confound | Discriminating signal |
|---|---|
| localization failure | failure w/o any edit near gold files; contrast with correct-localization-wrong-order |
| tool-output loss | evidence_present_at_fault = true and next action ignores it ⇒ reading failure; false ⇒ tool loss |
| budget failure | budget_exhausted with pending scheduled fixes vs exhausted exploring |
| model-capability failure | same trajectory structure fails across all tasks (task-independent) vs construct-correlated failures |
| flakiness | rerun-identical outputs flag [S-006 census field] |

### 16.6 Executable measurement procedure (RQ-07.6)

All queries in Appendix F (F-1 census re-verification — already executed; F-2 asymmetry probe: apply gold patch to a scratch clone, run visible suite — count failures attributable to API mismatch; F-3 term census greps; F-4 trajectory metric extraction from ATIF traces). **Every expected magnitude marked UNMEASURED until run.** Validation plan: re-run F-1 (done, matches census), F-2 on 3 known tasks (httpx_3672 must flag asymmetry), then scale to 30.


---

## 17. Competition-specific analysis (WS-08)

### 17.1 Verified mechanics recap

See §13.1 table (tiers per row). Unverifiable register (§26): per-task eval_config on the hidden set; final test-set repo mix; grader-side flakiness handling beyond host statements.

### 17.2 Budget model and sensitivity (RQ-08.3, RQ-09.3)

**Hard facts** (V-file/V-page): 12h wall clock **inclusive of sandbox setup, exclusive of validation** [S-007]; defaults per task 60 min / 100 tool calls / 500 turns (eval_config overridable; sample tasks self-throttle to 60s/10 calls/1 min/50 turns) [S-005, S-006]; setup time excluded from the *task* clock but included in the 12h [S-007]; get_status/submit_patch are free [S-005]; max 3 nudges; compaction threshold 14,336 tokens [S-005].

**Arithmetic (checkable):** ~120 test tasks in 12h ⇒ 6 min/task average *including* setup. If setup+bootstrap amortizes to ~1 min/task, ~5 min/task of agent time. At observed baseline LB performance (0.05–0.13 [S-003]), median-competitive designs spend ≲2 min/task on easy singles (feasible); the binding constraint is the *tail*: a 7-file interacting task at default caps needs (from the §15.6 cost model) ~35–60 calls just for edit+validate cycles — feasible only if localization is cheap (graph-first) and no exploration loops occur. **Sensitivity:** halving per-task time (12h → effective 6h via overrun risk) eliminates the tail entirely; a design that can *classify* task difficulty in ≤3 calls and triage (park hard tasks with minimal-time root-fix attempts) strictly dominates a uniform-pipeline design. This is arithmetic + design reasoning, labeled as such (reasoning-only).

### 17.3 Binary scoring × multi-fault interaction (RQ-08.2)

Verified mechanics make the strategic structure: graded scope ⊆ test-patch scope, and test patches are strictly under `tests/` [S-009]. Since a task passes iff all graded F2P pass and no required P2P fails [S-005], and graded scope may be narrower than the issue's stated scope (SRC-A: 1 test file vs 7 gold files, verified), the dominant strategy on multi-bug tasks is: (1) satisfy the *contract-bearing* fix (the one graded tests assert — the rename in SRC-A), (2) treat remaining issue bullets as insurance only under spare budget. Symptom-completeness has zero marginal score under a passing grade and −100% under budget overruns. Counter-consideration: P2P suites can be broader than the F2P file (regression risk from sloppy fixes), so "minimal fix" must still respect the full graded suite, not just the F2P file — annotation field graded_scope captures this precisely.

### 17.4 Harness-defect register (RQ-08.4) — community-tier statuses per S-003

| Defect | Community status (as of 2026-09-30 digest) | Verifiable? | Impact class |
|---|---|---|---|
| Double-JSON escaping in tool output | multi-reproduced (host-acknowledged; 22%/62%/0% experiment) | yes (local sandbox) | evidence loss |
| `search_similar_code` unbounded output | host-acknowledged, cap promised | yes | context blowup |
| 12h-inclusive wall clock; overrun errors whole run | host-stated, fix planned | rules-verified (S-007) | budget |
| Thinking-mode content drop | host-acknowledged patch incoming, NO re-score | no (trust) | reasoning loss |
| LoRA KV collapse / adapter zeroing | multi-reproduced with wheelhouse fixes | partial (train-side) | capability |
| 12 dead public tasks (8 SSL, 3 version-gated, 1 error drift) | multi-reproduced; LB resolves to 58 tasks | yes (public LB) | noise |
| CV/LB anti-correlation | community analysis | partial | eval noise |

### 17.5 Setting novelty vs. literature (RQ-08.5)

Fixed single 31B QAT open model (no frontier teacher, no model choice), fixed toolset incl. code-graph retrieval, sequential single-pass 12h across ~120 tasks, hidden tests with anti-tamper reset, binary scoring, offline sandbox — no fetched SWE-bench-family paper combines these (closest: R2E-Gym's open-weight scaling [S-055]; SWEnergy's SLM energy study [V1]; Kimi-Dev's open-model training [V1]). Consequence: frontier-agent results transfer as *structure*, not as *rates*; small-model process quality is the open axis (AgentLens's 0.5–23.2% lucky-band [S-024] is the right measuring stick).

### 17.6 Volatile-claim status table (RQ-08.6)

| Claim | Status | Date | Source |
|---|---|---|---|
| Hidden tasks validate 100% with gold | host-confirmed (thread 744370) | 2026-09-30 digest | S-003 |
| eval_config 4 fields read by scorer; defaults no limit | host-stated | 2026-09-30 | S-003 |
| Overrun fix planned | host-stated | 2026-09-30 | S-003 |
| Thinking-mode no-re-score | host-stated | 2026-09-30 | S-003 |
| search_similar cap promised | host-stated | 2026-09-30 | S-003 |
| LB resolves to 58 public tasks; 124-team bronze tie | community (EDA notebook) | 2026-09-30 | S-003/S-004 |
| Baselines LB 0.05–0.13 | community multi-report | 2026-09-30 | S-003 |

All community-tier rows are snapshots at the digest date; re-verification before any paper submission is mandatory (limitation L-4).

## 18. Counterevidence and red team (WS-09)

### 18.1 Ranked objection register (RQ-09.1, RQ-09.5)

| # | Objection | Strength | Disposition |
|---|---|---|---|
| O-1 | **Frequency null:** 70.5% of tasks are single-file; interference machinery is overhead on the median task | Strong | **Partially accepted** — drives the triage-first design; but 29.5% multi-file + tail 7.8% is where score separations live (LB compression: ±2 tasks ≈ hundreds of ranks [S-004]) |
| O-2 | "It's just localization" — better localization subsumes fix-ordering claims | Moderate | **Rejected as complete account:** Multi2Fixer holds localization constant in its scheduling ablation [S-030]; localization ≠ edit sequencing |
| O-3 | Evidence for the whole framing rests on **one verified task** (httpx_3672) | Strong | **Accepted as current state** — hence measurement-first recommendation (§24); asymmetry rate is UNMEASURED corpus-wide |
| O-4 | SpecBench already covers visible-vs-hidden; novelty claim collapses | Moderate | **Rejected:** SpecBench measures *gap* (gaming), not *contradiction* (visible asserts old contract); its visible tests "exercise specified features," they don't encode the prior API [S-025] |
| O-5 | Reflection/journal components have E2-negative evidence [S-028, S-032] | Moderate | **Partially accepted:** applies to cross-task memory and verbal reflection; in-task state journals and verifier-grounded checks are distinct objects (§15.1 rows) |
| O-6 | Harness defects (escaping, truncation) explain the phenomena better than "masking" | Moderate | **Conceded as confound** — discriminator metric evidence_present_at_fault (§16.5); paper must separate before claiming |
| O-7 | Paper-track judges are graph-ML-heavy; SE-testing framing may underperform | Weak-moderate (from S-004 roster reading) | Reframed as opportunity: graph-tool localization metrics speak to the panel |
| O-8 | Annotation κ may fail; constructs undecidable | Weak | Protocol is decidable-by-construction (§16.1); κ plan in place (§16.3) |

### 18.2 Frequency-null arithmetic (RQ-09.1 quantified)

Using measured corpus [S-009]: if interference-aware overhead costs +4 calls/task on all 129-equivalent tasks but recovers even 40% of the ~29.5% multi-file tail that uniform designs lose, break-even requires tail-recovery ≥ (4×N_total)/(N_tail) ≈ 17 calls-equivalent per tail task recovered — comfortably inside the §15.6 cost model. The null wins only if the *asymmetry/interference* rate inside the multi-file set is near zero — exactly what P-1 measures. (Arithmetic; inputs measured; recovery rate UNMEASURED.)

### 18.3 Component keep/cut table (RQ-09.2)

| BCF component (SRC-A terms) | External evidence | Verdict | Overhead (calls) |
|---|---|---|---|
| Spec-first plan (A6/G0) | SpecRover E2 [S-059]; Agentless staged pipeline E2 [S-019] | **Keep** (conditional: classification ≤1 call) | 1–2 |
| Classification routing (T20) | task-type sensitivity shown across literature (multi-hunk vs single) [S-026, S-030] | Keep (cheap) | ≤1 |
| fix_order topological | Multi2Fixer E2 [S-030] | **Keep on multi-file only**; triage-gated | 1–3 |
| Journal/breadcrumbs (A3) | no negative for in-task state; MAST process failures if absent [S-039] | Keep, minimal (state, not memory) | ~0 |
| Gates G1–G6 (A8) | SWE-agent guardrails E2-adjacent [S-018]; protocol itself E0 | Keep, lightweight; pre-register strike-counter | ~0–1 |
| Reflection/self-verify | Huang negative [S-032]; ProgCo positive w/ tools [S-033] | Keep **only** verifier-grounded form | 1–2/fix |
| Test migration (visible suite) | voided at grading [S-005]; enables local validation | Keep as *local* tool, never as score strategy | 1–5 |
| Sub-agent tree (A4) | MASAI E2 [S-057]; MAST inter-agent risks [S-039] | **Cut for now** (Sprint-3 pilot was already the plan) | high |
| Cross-task memory (CTIM-like) | E2 negative [S-028] | **Cut** | — |

### 18.4 Alternative explanations table (RQ-09.4) — for "agent failed a Trap-1 task"

| Alternative | Discriminating experiment |
|---|---|
| localization failure | did edits land in gold files? (gold_scope_overlap) |
| capability (31B can't hold rename contract) | same task with explicit spec line injected — pass-rate delta |
| budget exhaustion | calls remaining at failure; failures early vs late |
| tool-output loss | evidence_present_at_fault on the trajectory |
| genuine oracle-asymmetry misread | revert_correct_rate > 0 with conflict events logged |

### 18.5 Feasibility verdict (RQ-09.3)

**The pipeline fits, with triage.** Defaults (100 calls/60 min/task) accommodate k≤3-fix pipelines; the 12h/120-task global constraint forces ~5 min/task average, which forces early triage and bounded per-task ceilings (design arithmetic; not measured). The unfitted case is uniform full-pipeline on every task — rejected (O-1 acceptance).

## 19. Comparative analysis (cross-cutting)

| Countermeasure | Evidence grade | Cost class | Under oracle asymmetry | Under propagation masking | Under clone coupling | Verdict for this harness |
|---|---|---|---|---|---|---|
| Spec-first plan | E2 | low | strong (carries contract past red) | neutral | strong (records dual-tree obligation) | keep |
| Topological fix order | E2 | low-med | neutral | neutral | strong (mirror-tree sequencing) | keep (multi-file) |
| Verifier-grounded reflection | E2 | low-med | strong (checks vs spec, not suite) | weak (verifier shares the mask) | medium | keep |
| Test augmentation (internal) | E2 | med | strong (stresses own fix) | strong (raises P) | medium | keep offline |
| Ratchet/gates | E0–E2-adjacent | ~0 | strong (blocks revert-thrash) | neutral | medium | keep, pre-register |
| Cross-task memory | E2-negative | med | harmful (noise) | harmful | harmful | cut |
| Verbal reflection | E2-negative | low | harmful | harmful | harmful | cut |
| Whole-patch single-shot | E2-negative (multi-file) | low | n/a | n/a | harmful | cut on multi-file |

**Constructs × fields** (where each classical construct lives vs. where the competition needs it): propagation-masking → testing/FL theory → Trap 3/4 annotation; oracle asymmetry → benchmark-integrity literature (unnamed) → Trap 1 + paper track; clone coupling → mining/repair literature → Trap 2 + fix_order; t-way interactions → combinatorial testing → analogy only.

**Paradigms × settings:** frontier-agent results (rates) ✗ transfer; harness-integrity findings ✓ transfer structurally; APR controlled-ablation designs ✓ transfer methodologically; annotation protocols (Verified campaign [S-060], MAST [S-039]) ✓ transfer directly.

## 20. Quantitative findings — consolidated register (every number traced; UNMEASURED listed alongside)

| # | Quantity | Value | Source locus | Tier/label |
|---|---|---|---|---|
| Q-1 | Corpus tasks / repo mix | 129; 67/48/13/1 | S-009 (this run, live) | measured-by-research-agent |
| Q-2 | Single-file gold | 70.5% (91/129) | S-009 | measured |
| Q-3 | Multi-file gold | 29.5%; ≥7-file tail 7.8% | S-009 (new distribution) | measured |
| Q-4 | Gold touching tests | 0/129 | S-009 | measured |
| Q-5 | Test-patch files outside tests/ | 0 tasks (282 files) | S-009 | measured |
| Q-6 | Hints empty | 129/129 | S-009 | measured |
| Q-7 | Change-clone groups in multi-hunk patches | 68% / 70% / 89% | S-035 §intro | V3 |
| Q-8 | Multi-hunk agent repair accuracy | 26.98–92.82%; localization 40.4–75.3% | S-026 §results | V3 |
| Q-9 | SWE-bench+ suspicious fixes | 63.75%; leak 32.67%; weak 31.08%; 12.47→3.97% | S-022 | V3 |
| Q-10 | UTBoost insufficient tests / annotation errors | 7.7%/5.2%; 54.6%/54.2% | S-023 | V3 |
| Q-11 | Lucky passes | 10.7% of passing; 0.5–23.2% by backend; BFC+II = 68% of lucky | S-024 | V3 |
| Q-12 | SpecBench gap | ≤97pp example; +28pp per 10× size | S-025 | V3 |
| Q-13 | Pro Verified anti-hacking delta | −21.48pp (GLM-5.2) | S-036 §4.2 | V3 |
| Q-14 | Verified campaign | 1,699 samples, 93 devs, 3×, 500 kept; easy 196 / hard 45 | S-060 | V3 |
| Q-15 | Illusion context-free accuracy | 76% (o3); <53% outside-repo | S-021 | V3 |
| Q-16 | SWE-agent failures | 52.0% incorrect/overly-specific; 23.4% failed-edit-recovery; 87% label agreement | S-018 §B.4 | V3 |
| Q-17 | TAR misalignment | 0.5% vs 1.4% (OpenHands succ/fail); 0% vs 4.8% (ACR) | S-027 | V3 |
| Q-18 | Multi2Fixer scheduling | +18–56 (vs none), +2–13 (vs seq), +3–16 (vs rand); 326/835 D4J | S-030 RQ3.3 | V3 |
| Q-19 | ITER | 74 correct / 119 plausible; +15.6% vs AlphaRepair | S-031 | V3 |
| Q-20 | Agentless | 32.00% Lite, $0.70 | S-019 | V3 |
| Q-21 | Agent-CoEvo | 33.67→41.33% (Lite); TestAgent −6pp | S-029 | V3 |
| Q-22 | CTIM-Rover | 40% (−2pp); CTIM-only 31% (−11pp) | S-028 | V3 |
| Q-23 | NIST t-way prior | "most bugs caused by one or two parameters" | S-016 | V3 |
| Q-24 | FLITSR claim | SBFL decays with fault count; masking named | S-034 | V3 |
| Q-25 | MAST | 14 modes/3 categories; κ=0.88 | S-039 | V3 |
| Q-26 | LB baselines | 0.05–0.13; 58-task resolution; 124-team tie | S-003/S-004 | community-tier |
| Q-27 | Harness defaults | 60 min/100 calls/500 turns; caps 5000 chars, 150 lines, 300 s; compaction 14,336 | S-005 | V-file |
| Q-28 | U-1 fix-dependency DAG share in corpus | **UNMEASURED** | — | register U-1 |
| Q-29 | U-2 temporal coupling rates | **UNMEASURED** | — | U-2 |
| Q-30 | U-3 curation effect on multi-fault prevalence | **UNMEASURED** | — | U-3 |
| Q-31 | U-4 fault-injection-for-repair efficacy | **UNMEASURED** | — | U-4 |
| Q-32 | U-5 agent edit blast-radius distribution | **UNMEASURED** | — | U-5 |
| Q-33 | U-6 quantization effect on failure modes | **UNMEASURED** | — | U-6 |
| Q-34 | U-7 oracle-asymmetry rate in corpus (beyond n=1 verified) | **UNMEASURED** | — | U-7 |
| Q-35 | U-8 interference cost multiplier in agent trajectories | **UNMEASURED** | — | U-8 |


---

## 21. Case studies (published evidence)

### 21.1 Published cases of masking/interference in repair settings

| Case | Setting | Masking/interference content | Source |
|---|---|---|---|
| Mockito_17 producer/consumer | Defects4J multi-hunk (Multi2Fixer study) | producer edit must precede consumer edit; wrong order leaves unresolvable intermediate states | S-030 V3 |
| CVE-2024-3571 security ordering | Multi2Fixer qualitative case | invariant-establishing hunks (authz) must land before exploit-fix hunks (H2→H3→H1 dependency) | S-030 V3 |
| Generation–recognition asymmetry | Multi2Fixer base models | models fail to *generate* correct multi-hunk patches but can *select* them when presented — verification asymmetry under interaction | S-030 V3 |
| FLITSR decay curves | SBFL on multi-fault programs | localization accuracy monotone-decays with fault count; interference+masking named as cause of imperfect decomposition | S-034 V3 |
| Repair-loop partial-fix discard | G&V APR, formalized | change fixes target test, another test fails, tool discards a useful partial fix | S-035 V3 |
| TAR Misinterpretation episodes | 3 agents, 250 trajectories | "Test failed" followed by positive-conclusion thought; measured label | S-027 V3 |
| SWE-agent cascade quote | 248 unresolved trajectories | errors propagate across functions after a single edit; repeated-edit failure class (Failed Edit Recovery 23.4%) | S-018 V3 |
| AgentLens Lucky corpus | 2,614 trajectories | Brute-Force Convergence + Incomplete Implementation = 68% of lucky passes — weak-process passes under weak oracles | S-024 V3 |

### 21.2 The competition case: httpx_3672 (researcher's hypothesis, not entrant-verified)

All four traps from SRC-A carry the source's own labels; the traps→constructs mapping (this report's) is:

| Trap | SRC-A description [V] | Construct (this report) | Annotation field(s) |
|---|---|---|---|
| 1 | visible `p.complete()` vs hidden `p.reset()`; 5 call sites | **oracle asymmetry** (contradiction polarity) | oracle_asymmetry + evidence test IDs |
| 2 | sync/async dual trees; 239/740 ahttpx nodes | **interference coupling** (mirror-module invariant) | coupling_type=mirror |
| 3 | no-parens latent fault `_server.py:92` | **propagation masking** (PIE P≈0) | masking_propagation |
| 4 | Response(code=500) TypeError etc. outside graded scope | **coverage masking** (graded scope ⊊ gold scope) | masking_coverage |

**Unverifiable claims listed (SRC-A items that cannot be checked without hidden artifacts or a live run):** the hidden-suite call-site count (5) and exact rename form at grading; the exact graded F2P/P2P list; whether the real issue reporter's 5 sub-items all appear in the hidden test patch; any claim about what the actual competition test set contains (it is not shipped). These stay quarantined as [SIM]/hypothesis — the annotation study (§16.2) can re-derive Trap 1's *structure* on the training corpus where gold+test patches are both present.

### 21.3 Negative case: pure single-file bugfix

A single-file, single-hunk, no-test-touch task (70.5% of corpus, Q-2) instantiates none of the constructs: no coupling, no ordering, no asymmetry (visible suite updated compatibly). This is the modal task — the null object that keeps the interference machinery honest (triage gate T20 exists precisely to route this class away from overhead).

## 22. Contradiction register

| # | Contradiction | Position A | Position B | Resolution / interpretation |
|---|---|---|---|---|
| C-1 | Do agents need test execution at all? | Agentless: pipeline beats agents, 32.00% Lite at $0.70 [S-019] | MASAI/CodeR/Multi2Fixer: agentic/scheduled decomposition wins on multi-hunk [S-057, S-058, S-030] | **Scope split, not disagreement:** single-hunk → pipeline cheaper; multi-hunk/interacting → decomposition + scheduling. The corpus split is exactly 70.5/29.5 (Q-2/Q-3) — both are right on their segment |
| C-2 | Reflection: helps or hurts? | Reflexion/Self-Debug lineage: execution-feedback reflection improves [S-040, S-041] | Huang: intrinsic self-correction *degrades* even reasoning; CTIM: memory hurts [S-032, S-028] | **Boundary condition resolved** (§15.3): feedback source is the moderator — external/executable ⇒ helps; verbal-only or cross-task ⇒ hurts. No unresolved residue at fixed model |
| C-3 | SWE-bench magnitudes: crisis or noise? | SWE-bench+: 63.75% suspicious, −8.5pp after filter [S-022]; UTBoost 54.6% annotation errors [S-023] | OpenAI blog: Verified campaign = high-quality 500-task subset [S-060]; "94% of instances predate LLM cutoffs" (S-022 note) counters leakage fears | **Reconciled by level:** the *raw* benchmark is contaminated/leaky at scale; the *Verified subset* addressed it via human annotation (500 kept of 1,699); neither claim contradicts the other. For the paper: cite both, use Verified-grade methodology |
| C-4 (minor) | 127 vs 256 graphs; 5,800 participants | kickoff-2 council numbers | corpus counts | resolved as counting-basis artifact (both true on their basis) — recorded here for completeness (memory: kickoff2-council-errata) |

Unresolved: none material. C-1's scope split is the operative design input (§24).

## 23. Pre-registered hypotheses (falsifiable, with metrics and rejection criteria)

| ID | Prediction | Metric (Appendix E) | Falsification criterion | Confounds guarded | Informative null |
|---|---|---|---|---|---|
| P-1 | Visible-vs-graded oracle asymmetry exists in ≥10% of training tasks (structure of Trap 1) | F-2 probe: gold-applied repo fails visible suite on API-mismatch assertions | rate < 10% on n≥30 (binomial CI excludes 10%) | flakiness (E-3) → rerun-identical filter; import errors ≠ asymmetry | low rate still publishable: "grading hygiene is clean; asymmetry is task-specific" |
| P-2 | Agents revert spec-faithful edits after local-test failures on Trap-1-class tasks; revert_correct_rate > 0 | revert_correct_rate (edits later shown ∈ gold) | rate ≈ 0 across ≥20 asymmetry tasks | budget exhaustion vs conviction → strike-counter logging | null ⇒ agents ignore local red on spec conflict (different paper) |
| P-3 | Fix-order violations correlate with failure on multi-file tasks | fix_order_violations × outcome (logistic, n=38 multi-file) | no association (p>0.05) or wrong sign | k_fixes confound → control for k | null ⇒ ordering doesn't bind at 31B scale — scales down Multi2Fixer claim |
| P-4 | Lucky-pass rate on the fixed Gemma model lies in AgentLens's 0.5–23.2% band, not at 0 | AgentLens-style tiering on own ATIF traces (if reference outputs available) | 0% lucky among ≥50 passes | tiering subjectivity → 2-rater κ | 0% would itself be a strong small-model process-quality result |
| P-5 | Lightweight gates (ratchet + strike counter) reduce thrash without blocking completions | loop_rate, budget_exhausted_rate; completion rate unchanged (±5pp) | completion −>5pp or loop_rate unchanged | gate over-trigger → pre-registered thresholds, not tuned post hoc | null ⇒ gates are noise at this model scale — cut them (cheap to test) |

All five registered **before** any trajectory data is collected; the annotation protocol (sidecar JSON) freezes field definitions for P-1/P-2/P-3.

## 24. Implications and recommendations

**Minimal mechanism set** (everything else cut; each item carries its evidence grade and its discriminating experiment):

1. **Spec-first plan with an explicit spec-vs-tests priority decision** (E2: SpecRover [S-059], staged Agentless [S-019]) — the agent decides *once*, at plan time, whether the issue text or the local suite is authoritative when they conflict (P-2 measures the cost of not deciding). ~1–2 calls.
2. **Topological fix ordering on multi-file/multi-hunk tasks only** (E2: Multi2Fixer scheduling ablation [S-030]; ordering never tested under contradicting oracle = open cell, P-3). Triage-gated: single-file tasks skip it.
3. **Verifier-grounded reflection only** (E2-negative for verbal: Huang [S-032]; E2-positive with tools: ProgCo [S-033]) — every reflection step must cite an execution artifact; verbal-only self-checks are forbidden by policy string.
4. **In-task journal as state, not memory** (no cross-task carryover — E2-negative: CTIM [S-028]); journal persists the contract decision, fix schedule, and strike counts across compaction events (harness compacts at 14,336 tokens [S-005] — the journal is the survival mechanism).
5. **Triage classifier at task start** (O-1 acceptance): classify ≤3 calls, route single-file tasks to the cheap path.

**Cut list** (with reasons): sub-agent trees (MAST inter-agent risk category at 31B scale, high cost [S-039]); cross-task memory [S-028]; verbal reflection [S-032]; whole-patch single-shot on multi-file [S-030]; any strategy that edits test files for score (structurally voided by anti-tamper reset [S-005]).

**Paper-track implications:** the cheapest defensible contribution stack is (a) measure P-1 (asymmetry rate — no one has), (b) measure P-3 (ordering under contradiction — no one has), (c) report with integrity-methodology from the crisis cluster (mutation-audit style oracle stress [S-023], AgentLens-style process tiering [S-024]) — three tables no existing paper contains, all executable on shipped artifacts.

## 25. Novelty boundary (safe claims vs. overclaims)

| Claimable (this report's evidence) | Must-cite prior art | Overclaim to avoid |
|---|---|---|
| "Oracle asymmetry (contradiction polarity) is unnamed and unmeasured in the agent literature; we measure its rate" | S-022 (weak tests), S-023 (insufficient tests), S-025 (visible/held-out gap) as the *adjacent* constructs | "We discovered that visible and hidden tests differ" — SpecBench/SWE-bench+ own the general observation; only the *contradiction direction + rate* is new |
| "Fix ordering has controlled (E2) support; we test it under contradicting oracles" | S-030 (scheduling ablation), S-031 (ITER) | "We show ordering matters" (already shown); "agents can't order edits" (unmeasured) |
| "Multi-fault is a material minority of the corpus with a heavy tail" | own census S-009 + S-026, S-035 rates | extrapolating Java-centric clone rates onto this corpus numerically |
| "Fault masking/interference transfer structurally to agent repair" | S-012, S-014, S-034, S-035 definitions | implying t-way interaction percentages are defect-coupling rates (§12.4) |
| "The Gemma harness makes Trap-1 structurally possible" | S-005, S-007 mechanics | claiming it's *frequent* before P-1 runs (n=1 verified instance) |

## 26. Risks, limitations, and gaps

**Limitations (L-1…L-6).** L-1: single verified instance (httpx_3672) grounds the trap taxonomy; corpus-wide rates are UNMEASURED (P-1/P-2 pending). L-2: community-tier competition facts (S-003) are volatile snapshots (2026-09-30 digest) — harness defects may be patched mid-competition; re-verify before submission (§17.6). L-3: external multi-fault rates are Java-heavy (ManySStuBs4J) or mixed (PolyHunk); directional transfer only. L-4: recency sweep used already-snapshotted competition pages; live Kaggle pages were not re-fetched post-snapshot. L-5: no live agent runs were executed by this research (by design — measurement plan provided instead, Appendix F). L-6: Semantic Scholar and Bing were unusable this session; coverage relied on arXiv API + Google — the two engines' union is strong for arXiv-hosted work but non-arXiv venue coverage (some TOSEM/ICSE-only papers) may have thinner recall; mitigated by snowballing from V3 full texts.

**Gaps forwarded to future work:** U-1 (fix-dependency DAG distribution — the single most consequential unknown), U-4 (fault injection for mask discovery), U-6 (quantization → failure-mode shift), U-8 (interference cost multiplier — needs trajectory corpus). Each has an executable first step in Appendix F.

**Threats to validity of this report itself:** (construct) harmonized taxonomy is this report's synthesis, not a published standard — original labels preserved everywhere; (internal) tier assignments could drift as preprints get accepted — bibliography records version+date per source; (external) rates measured on the training split may not transfer to the hidden split's repo mix (UNMEASURED); (conclusion) all reasoning-only findings (F-09) are labeled and separated from evidence-backed ones.


---

## 27. Honest limitations (plain statement)

This report did not run the agent, did not measure a single trajectory, and verified the full four-trap structure on exactly one task instance; every corpus-wide prevalence claim about masking, interference, and oracle asymmetry in the competition therefore rests on either (a) the shipped training artifacts (counts, verified), (b) external literature on other corpora (transfers structurally, not numerically), or (c) explicit UNMEASURED registers. Two engines (Semantic Scholar, Bing) failed mid-session; the source base is arXiv-anchored and snowballed, which covers the load-bearing literature well but is not exhaustive over non-arXiv venues. Community-tier competition facts are a single-day snapshot of a live discussion board whose host statements may be patched or rescinded. The harmonized failure taxonomy is this report's synthesis. Where reasoning outruns evidence — most notably finding F-09's superlinear-cost argument — the text says so, and §23's predictions exist precisely because the interesting quantities are still unmeasured.

## 28. Conclusion

The classical constructs are solid; the agent-side terrain is mostly open. Fault masking, the coupling effect, and fault interference arrive from testing and dependability theory with precise, citable definitions [S-011, S-012, S-014, S-034], and the SWE-bench-family integrity literature now quantifies, at scale, how badly weak oracles distort agent evaluation [S-022, S-023, S-024, S-025, S-036]. Between these two literatures sits the gap this competition makes concrete: an agent whose only local evidence source can contradict the grading oracle, on a corpus where 29.5% of fixes interact across files, under budgets that punish interference superlinearly. The strategy that survives red-teaming is small — spec-first with an explicit conflict-priority decision, topological ordering gated by triage, verifier-grounded reflection, journal-as-state, five cheap mechanisms total — and the paper opportunity is precise: name and measure oracle asymmetry (contradiction polarity), test fix ordering under it, and adopt the integrity-measurement methodology the field has already built. Nothing in this report requires believing the BCF framing; every claim traces to a source, a measured count, or an explicit prediction that can fail.

## 29. RQ coverage matrix

| RQ | Workstream | Section(s) | Status |
|---|---|---|---|
| RQ-PRIMARY (masked faults mislead agents; interference complicates multi-fix) | WS-03/04 | §12.6, §13.3–13.4, §18 | Answered conditionally: mechanisms established classically; agent-side rates UNMEASURED (P-1/P-2); Trap-1 structure verified on n=1 |
| RQ-01.1–01.5 (terminology: definitions, isomorphism, neighbors, census, recommendation) | WS-01 | §8.1–8.7 | Complete |
| RQ-02.1–02.5 (prevalence, co-fix, curation, DAGs, transferability) | WS-02 | §11.1–11.4 | Complete; U-1/U-2/U-3 flagged |
| RQ-03.1–03.5 (theory: debugging, repair, injection, t-way, coupling) | WS-03 | §12.1–12.5 | Complete; U-4 flagged |
| RQ-04.1–04.6 (validity: mechanics, integrity, asymmetry, behavior, verdict, false negatives) | WS-04 | §13.1–13.5 | Complete |
| RQ-05.1–05.5 (failure modes: taxonomy, mechanism test, scale, evidence loss, corpora) | WS-05 | §14.1–14.5 | Complete; U-6 flagged |
| RQ-06.1–06.7 (countermeasures E0–E3, ordering, reflection, verifiers, ratchets, cost) | WS-06 | §15.1–15.6 | Complete |
| RQ-07.1–07.6 (operationalization: constructs, protocol, reliability, metrics, confounds, procedure) | WS-07 | §16.1–16.6 | Complete |
| RQ-08.1–08.6 (competition: mechanics, scoring, budget, defects, novelty, volatile claims) | WS-08 | §17.1–17.6 | Complete |
| RQ-09.1–09.5 (red team: frequency null, components, feasibility, alternatives, objections) | WS-09 | §18.1–18.5 | Complete |
| SQ-01…SQ-04 (surprise/context/uncertainty/counterintuitive) | all | §5 (three unknowns), §22, §23 | Woven through; registered |
| SQ-05 (highest-leverage experiment) | WS-07 | §16.6, §23 P-1/P-3 | Answered: annotation-layer asymmetry probe first, trajectory metrics second |
| SQ-06 (single-number briefing) | all | §5 | Answered |
| VQ-01…VQ-12 (verification: source basis, tiers, supersession, venue status, conflicts, neutral search, primary read, negative searches, recency, traceability, code refs, fabrications) | WS-01/10/11 | §9, §10, §8.6, §31, App. A/B, CSV | Complete; ISTQB (V0) excluded + logged; no fabricated sources (fabrication check: every S-id has a ledger row) |

## 30. Traceability matrix (§12.15 schema; one row per objective)

| objective_id | rq_id | workstream_id | report_section | claim_ids | source_ids | verification_tier | confidence | evidence_register | alternative_explanations_considered | remaining_gap |
|---|---|---|---|---|---|---|---|---|---|---|
| S1 terminology | RQ-01.1,01.3 | WS-01 | §8.1–8.2, §8.5 | F-01, F-02 | S-011, S-012, S-014, S-016, S-034, S-018, S-024, S-025, S-027, S-039 | V3×7, V2×3 | High | peer-reviewed-multiple | "agent papers just use different words for it" — refuted by term census F-3 + negative searches N-1..N-6 | non-arXiv venue recall thinner (L-6) |
| S1 terminology rec | RQ-01.2,01.4,01.5 | WS-01 | §8.3, §8.4, §8.7 | F-01 | S-012, S-014, S-022, S-023, S-025, S-035 | V3×4, V2×2 | High | peer-reviewed-multiple | free coinage / pure adoption — both rejected with stated costs | — |
| S2 prevalence | RQ-02.* | WS-02 | §11 | F-03 | S-009, S-026, S-035, S-017, S-022, S-016 | V3×5 + measured | High | measured + peer-reviewed | curation inflates/deflates multi-fault share (U-3) | hidden-split composition unknown |
| S3 theory | RQ-03.* | WS-03 | §12 | F-01 | S-012, S-014, S-030, S-031, S-034, S-035, S-067 | V3×5, V2×2 | High | peer-reviewed-multiple | t-way percentages as coupling rates — rejected (§12.4) | U-1 DAG distribution |
| S4 validity | RQ-04.* | WS-04 | §13 | F-04, F-08 | S-005, S-007, S-017, S-021, S-022, S-023, S-024, S-025, S-036, S-060 | V3×8, V2×2, V-page×2 | High | mixed official-docs + preprint | "harness defects explain everything" (O-6) — discriminator provided (§16.5) | contradiction rate UNMEASURED (P-1) |
| S5 failure modes | RQ-05.* | WS-05 | §14 | F-02, F-07 | S-018, S-024, S-025, S-027, S-038, S-039, S-043, S-048 | V3×6, V2×3 | Medium-High | peer-reviewed-single + preprint | loop-thrash as masking — rejected (§14.2) | U-6 quantization |
| S6 countermeasures | RQ-06.* | WS-06 | §15 | F-05, F-06 | S-019, S-028, S-030, S-031, S-032, S-033, S-040, S-041, S-044, S-055, S-057, S-059 | V3×8, V2×4 | Medium-High | mixed E2 | ordering result is single-study (S-030) | E3 mechanism-level trials |
| S7 operationalization | RQ-07.* | WS-07 | §16 | — | S-039 (κ anchor), S-024 (metric lineage) | design | — | reasoning-only (design) | κ<0.70 → respec fields (pre-planned) | not yet executed |
| S8 competition | RQ-08.* | WS-08 | §17 | F-08, F-09 | S-003, S-004, S-005, S-006, S-007, S-009 | V-file×3, community, measured | Medium-High | official-docs + community-tiers | uniform-pipeline feasibility — rejected by arithmetic (§17.2) | hidden-set eval_config unknown |
| S9 red team | RQ-09.* | WS-09 | §18 | F-09 | S-009, S-026, S-030, S-032, S-028 | mixed | Medium | reasoning + E2 | 8 objections O-1..O-8 each dispositioned | P-1..P-5 outcomes |

## 31. Bibliography (grouped by class; tiers + access dates; BibTeX in sidecar `bibliography.bib`)

**Class A — peer-reviewed (published or accepted, venue verified or well-established).** S-011 Offutt 1992, TOSEM 1(1):5–20 (V3, PDF metadata confirms venue) · S-012 Clark & Hierons, Squeeziness, IPL 2012 (V3, accepted-PDF artifact) · S-017 Jimenez et al., SWE-bench, ICLR'24 (V3 HTML) · S-018 Yang et al., SWE-agent, NeurIPS'24 (V3) · S-026 Nashid et al., TOSEM-accepted (V3; acceptance stated in fetched text) · S-027 Bouzenia & Pradel, ASE'25 (V3; acceptance stated in fetched text) · S-031 Ye & Monperrus, ITER, FSE'23 (V3) · S-032 Huang et al., ICLR'24 (V3) · S-057 Arora et al., MASAI, ICSE'25 (V3) · S-058 Chen et al., CodeR, FSE'25 (V3) · S-067 Zeller & Hildebrandt, TSE 2002 (V2, SERP-verified).

**Class A/B — V3-read preprints with acceptance signal or venue unlabeled in the fetched artifact.** S-019 Xia et al., Agentless (V3; arXiv 2024) · S-034 Callaghan & Fischer, FLITSR (V3; venue unlabeled in fetched artifact) · S-039 Cemri et al., MAST (V3; venue unlabeled in fetched artifact) · S-035 Madeiral & Durieux (V3; 2021, venue unlabeled in fetched artifact) · S-021 SWE-bench Illusion (V3, v4) · S-022 SWE-bench+ (V3) · S-023 UTBoost (V3) · S-024 AgentLens (V3) · S-025 SpecBench (V3) · S-030 MultiFixer/Multi2Fixer (V3, ASE'26-track per fetched text) · S-036 SWE-bench Pro Verified (V3) · S-029 Agent-CoEvo (V3) · S-033 ProgCo (V3) · S-028 CTIM-Rover (V3) · S-044 CRITIC (V2) · S-048 TRACE (V2) · S-049 Hack-Verifiable (V2) · S-050 RH-trajectories (V2) · S-052 Goes Live (V2) · S-055 R2E-Gym (V3).

**Class B — preprint.** S-038 Gelvan et al., context compression (V2) · S-043 Liu et al., lost-in-middle (V2) · S-061 Parsai et al., mutant subsumption (V2) · S-062 systemic flakiness (V2) · S-063 order-dependent JS (V2) · S-064 old-tests (V2) · S-065 Code Graph Model (V2) · S-066 patch safety (V2) · S-068 oracle-free dd (V1) · S-069 Renze self-reflection (V1) · S-070 WDD (V1, cite-light) · S-045 Laban et al., lost in multi-turn (V1) · S-046 Laidlaw proxies (V2) · S-047 Countdown-Code (V2) · S-059 SpecRover (V2) · S-020 AutoCodeRover (V2) · S-040 Reflexion (V2) · S-041 Self-Debug (V2) · S-042 ReAct (V2) · S-053 SWE-rebench (V1) · S-054 Multi-SWE-bench (V1) · S-056 SWE-Gym (V1) · S-071 Ye et al., patch assessment (V2) · S-072 Ginelli et al., code-removal patches (V2). **Ledgered, fetched for context, not cited in findings:** S-073 High-Quality APR (V2) · S-074 HAFixAgent (V2) · S-075 Debugging the Debuggers (V2).

**Class C — official documentation.** S-016 NIST ACTS program page (V3) · S-004/S-007 competition rules & data pages (V-page) · S-060 OpenAI blog (V3).

**Class D — practitioner/community.** S-003 discussion-board digest (tiers applied per-claim; snapshot 2026-09-30) — used only for absence-establishment and volatile registers, never for material claims.

**Class E — internal/primary corpus.** S-001 handoff · S-002 SRC-A walkthrough · S-005 harness digest (V-file) · S-006 dataset census · S-008 ZIP inventory · S-009 live re-verification (2026-09-30) — receipts re-checkable via Appendix F.

**V2 metadata anchors:** S-013 Avizienis et al. 2004 TDSC (Scholar/ACM/course-PDF triple) · S-014 Voas 1992 PIE · S-015 Kuhn et al. TSE 2004.

**Access dates:** all external fetches 2026-09-30 (local) / 2026-10-01 ~01:50 UTC end of searching; per-source method, URL, and tier in `source-verification-log.csv`.

**Erratum discipline:** the banned citation set from the 2026-09-29 report (ICSM 2011, Gao & Wong, ODC 1994, DejaVu 2022, Weiser 1984, Agentless v2, Sherlock, DeeLoc) was excluded throughout; a checklist grep in Appendix F (F-5) verifies zero occurrences in the final text. Title variants recorded: "Multi2Fixer" (HTML full text) vs "MultiFixer" (arXiv listing) — same identifier S-030 (Appendix B supersession register).


---

## Appendix A — Full search log (every query, engine, date, screening outcome)

All timestamps UTC (2026-10-01; local session date 2026-09-30). Raw log: `scratch/search-log.md`; SERP dumps: `scratch/pages/serp-*.txt`; arXiv API raw replies retained in the session transcript. Screening rule: first 8–10 results per query read at title+snippet level; a result qualified if it named the construct in a primary source (paper, official doc); blogs/essays counted as screened-out (with the one exception documented in N-2, where they constitute evidence *of absence*).

**A.1 DDG HTML (via `ddg.mjs`) — 4 issued, 2 productive, then throttled**

| # | UTC | Query | Outcome |
|---|---|---|---|
| D-1 | 01:49:59 | `"fault masking" software testing definition dependability` | 3 hits; Squeeziness PDF located (→ S-012) |
| D-2 | 01:50:01 | `"coupling effect" Offutt software testing hypothesis` | 10 hits; Offutt PDFs located (→ S-011) |
| D-3 | 01:50:02 | `"coincidental correctness" fault masking empirical study` | status 403 mid-parse — DDG anomaly throttle; engine parked 30 min (→ N-7, unresolved) |
| D-4 | 01:50:03 | `Avizienis Laprie Randell "basic concepts and taxonomy" … pdf` | aborted in cooldown |

**A.2 Semantic Scholar API — 3 issued, 0 productive (persistent 429)**

| # | UTC | Query | Outcome |
|---|---|---|---|
| S-1 | 01:50:24 | `fault masking software testing` | HTTP 429 |
| S-2 | 01:50:25 | `coincidental correctness testing empirical` | HTTP 429 |
| S-3 | 01:50:25 | `software fault interactions combinatorial testing Kuhn` | HTTP 429 — engine abandoned for the session (logged; would have been the cross-check venue for non-arXiv literature — see limitation L-6) |

**A.3 arXiv API (`export.arxiv.org/api/query`) — 45 issued, all productive after re-spacing**

| # | UTC | Query (decoded) | Yield |
|---|---|---|---|
| X-1 | 01:50:21 | `all:"delta debugging"` | S-068 lineage |
| X-2 | 01:50:21 | `all:"program repair" AND all:"overfitting"` | S-022 cluster |
| X-3 | 01:50:22 | `all:"SWE-bench"` | (429 — retried X-4) |
| X-4 | 01:50:52 | `all:"SWE-bench"` (retry) | S-017, S-021, S-022, S-037, S-052… |
| X-5 | 01:50:53 | `all:"program repair" AND all:"overfitting"` (retry) | S-071, S-072 |
| X-6 | 01:50:53 | `all:"automated program repair" AND all:"test suite" AND all:"insufficient"` | S-023 |
| X-7 | 01:51:04 | `all:"SWE-agent" OR all:"software engineering agents" AND all:"failure"` | S-018, S-024 |
| X-8 | 01:51:04 | `all:"self-correct" AND all:"large language models"` | S-032, S-033, S-044 |
| X-9 | 01:51:05 | `all:"multi-hunk" AND all:"program repair"` | S-026, S-030, S-031 |
| X-10 | 01:51:06 | `all:"fault localization" AND all:"multiple faults"` | S-034 |
| X-11 | 01:51:06 | `all:"reward hacking" AND all:"code"` | S-025, S-046, S-047, S-048, S-049, S-050 |
| X-12 | 01:51:29 | `all:"Agentless" AND all:"software engineering"` | S-019 |
| X-13 | 01:51:29 | `all:"MASAI" AND all:"software engineering agents"` | S-057 |
| X-14 | 01:51:30 | `all:"AutoCodeRover"` | S-020 |
| X-15 | 01:51:30 | `all:"contamination" AND all:"coding benchmark"` | S-021 |
| X-16 | 01:51:31 | `all:"lost in the middle" OR all:"multi-turn" AND …` | S-043, S-045 |
| X-17 | 01:51:32 | `all:"test pollution"` | boundary check (§8.4) |
| X-18 | 01:51:34 | `all:"flaky tests" AND all:"empirical"` | S-062 |
| X-19 | 01:51:35 | `all:"order-dependent" AND all:"tests"` | S-063 |
| X-20 | 01:51:36 | `all:"quantization" AND all:"agentic"` | **null** (U-6) |
| X-21 | 01:51:36 | `all:"mutant subsumption"` | S-061 |
| X-22 | 01:51:37 | `all:"redundant mutants"` | S-061 corroboration |
| X-23 | 01:51:37 | `all:"combinatorial interaction testing" AND all:"fault detection"` | t-way boundary (§12.4) |
| X-24 | 01:52:05 | `ti:"MASAI"` | S-057 |
| X-25 | 01:52:05 | `ti:"Lost in the Middle"` | S-043 |
| X-26 | 01:52:05 | `ti:"Reflexion"` | S-040 |
| X-27 | 01:52:06 | `all:"Can Language Models Resolve Real-World GitHub Issues"` | S-017 |
| X-28 | 01:52:06 | `ti:"Is the Cure Worse than the Disease"` | S-032 |
| X-29 | 01:52:06 | `ti:"tests aren't enough"` | S-064 |
| X-30 | 01:52:14 | `ti:"Explainable automated debugging" OR ti:"Yesterday, My Program Worked"` | Zeller lineage (S-067 context) |
| X-31 | 01:52:14 | `all:"Zeller" AND all:"simplifying and isolating"` | S-067, S-070 |
| X-32 | 01:52:15 | `ti:"Why Do Multi-Agent LLM Systems Fail"` | S-039 |
| X-33 | 01:52:15 | `ti:"LLMs Get Lost in Multi-Turn"` | S-045 |
| X-34 | 01:52:15 | `all:"coupling effect" AND all:"mutation testing"` | S-011/S-061 bridge |
| X-35 | 01:52:16 | `ti:"SWE-Gym" OR ti:"Multi-SWE-bench" OR ti:"SWE-rebench"` | S-053, S-054, S-056 |
| X-36–40 | 01:52:51–01:53:07 | retries of X-24/25/26/32/24 (429 re-spacing) | confirmed |
| X-41 | 02:12:29 | `ti:"MASAI" AND cat:cs.SE` | S-057 disambiguation |
| X-42 | 02:12:34 | `ti:"CrITic" AND all:"self-correct"` | S-044 |
| X-43 | 02:12:39 | `all:"ITER" AND all:"multi-hunk" AND all:"Monperrus"` | S-031 |
| X-44 | 02:12:43 | `ti:"SWE-rebench"` | S-053 |
| X-45 | 02:12:48–52 | `ti:"Multi-SWE-bench"`; `ti:"SWE-Gym"` | S-054, S-056 |

**Consolidation pass (2026-09-30 local, post-drafting; ledger-ID re-verification only, no new sources):** `id_list=2405.06682,2607.00929,2411.19410,2305.11738` and `ti:` re-checks for SWE-rebench (2602.23866), Multi-SWE-bench (2504.02605), SWE-Gym (2412.21139), Laban et al. multi-turn (2505.06120) — all IDs confirmed as recorded in Appendix B.

**A.4 Google via headed CDP browser (`fetch.mjs --search "google|…"`) — 14 issued, all productive**

| # | UTC | Query | Purpose/outcome |
|---|---|---|---|
| G-1 | 01:53:31 | Avizienis Laprie Randell Landwehr "basic concepts and taxonomy" pdf | S-013 V2 (Scholar cited-by + ACM surfaces) |
| G-2 | 01:53:43 | Voas PIE "propagation infection execution" … | S-014 V2 |
| G-3 | 01:54:36 | Kuhn Wallace Gallo "software fault interactions" pdf NIST | S-015 V2 (TSE 30(6):418–421) |
| G-4 | 01:54:48 | Pan Kim Whitehead "bug fix patterns" TSE | context; screened out (not load-bearing) |
| G-5 | 02:09:01 | Avizienis "dependable and secure computing" 2004 filetype:pdf | triple-confirmation for S-013 |
| G-6 | 02:09:13 | Voas "PIE: a dynamic failure-based technique" 1992 pdf | S-014 confirmation |
| G-7 | 02:15:36 | "fault masking" "LLM agent" OR "software engineering agent" repair | **N-1** — no primary literature |
| G-8 | 02:15:49 | "fault interference" "issue resolution" OR "program repair" LLM | **N-2** — AI-farm pages only (excluded) |
| G-9 | 02:16:03 | "multi-fault" SWE-bench OR "issue resolution" agent | **N-3** — adjacent only |
| G-10 | 02:16:16 | "oracle asymmetry" benchmark testing agents | **N-4** — none scholarly |
| G-11 | 02:19:56 | LLM agent reverts correct fix after test failure oscillation thrash repair | **N-6** — practitioner advice only |
| G-12 | 02:20:10 | Zeller Hildebrandt "Simplifying and Isolating Failure-Inducing Input" 2002 | S-067 V2 (TSE 28(2):183–200) |
| G-13 | 02:20:24 | self-refine reflection harms performance coding agents study | **N-8** — S-069 surfaced |
| G-14 | 02:20:38 | "local tests" contradict "hidden tests" benchmark agent repair | **N-5** — practitioner explainers only |

**A.5 Bing HTML scrape — 2 issued, abandoned (locale pollution: quoted queries not honored; Polish results)**

| # | UTC | Query | Outcome |
|---|---|---|---|
| B-1 | 02:10:52 | Avizienis "Basic concepts and taxonomy…" pdf | irrelevant locale results — engine excluded |
| B-2 | 02:11:08 | Kuhn Wallace Gallo "Software Fault Interactions" TSE 2004 pdf | same — engine excluded, logged |

**A.6 Direct fetches (curl with browser UA; not searches)** — 44 arXiv abs pages, 23 LaTeXML full texts, 2 classic PDFs (pdftotext), 3 web pages (OpenAI blog, NIST ACTS, ISTQB attempt → V0). All listed with URLs in the CSV.

**Engine-failure register (transparency):** DDG anomaly-throttle after 2 queries (30-min park, honored); S2 API hard-429 (abandoned); Bing locale garbage (abandoned); arXiv API transient 429s (resolved by 3.5–4 s spacing); guessed URLs → all 404 → guessing stopped (see §B.4 discipline note).

## Appendix B — Source verification and supersession register

**B.1 Tier definitions.** V3 = opened and read (full text or the full authoritative page); V2 = authoritative metadata + abstract (arXiv abs page, publisher page, or verbatim quotation inside a V3-read source); V1 = existence confirmed via arXiv API listing only; V0 = not verifiable this session (never cited in findings). Class: A peer-reviewed/accepted · A/B preprint with venue signal · B preprint · C official docs · D community/practitioner (absence-establishment and volatile registers only) · E internal/primary corpus.

**B.2 Full register** (external 64 + internal 9; per-row exact URL/method/date in `source-verification-log.csv`):

| S-id | Short title (venue/year) | arXiv/locus | Class | Tier | Verification method |
|---|---|---|---|---|---|
| S-011 | Investigations of the software testing coupling effect (IEEE TSE 1988) | selab.netlab.uky.edu PDF | A | V3 | PDF fetched, pdftotext, read in full |
| S-012 | Squeeziness: An Information Theoretic Measure for Avoiding Fault Masking (IPL 2012) | cs.ucl.ac.uk PDF | A | V3 | PDF fetched, read in full |
| S-013 | Basic Concepts and Taxonomy of Dependable and Secure Computing (TDSC 2004) | ACM DL / Scholar / course PDFs | A | V2 | SERP metadata ×3 surfaces (G-1/G-5); primary fetch unreachable |
| S-014 | PIE: A Dynamic Failure-Based Technique (1992) | publisher/SERP | A | V2 | SERP (G-2/G-6) + verbatim PIE anchor inside S-012 V3 |
| S-015 | Software Fault Interactions and JIT Testing (TSE 2004) | SERP | A | V2 | SERP (G-3): TSE 30(6):418–421 confirmed |
| S-016 | NIST ACTS combinatorial testing program page | nist.gov | C | V3 | page fetched and read |
| S-017 | SWE-bench (ICLR'24) | arXiv 2310.06770 | A | V3 | LaTeXML full text read |
| S-018 | SWE-agent (NeurIPS'24 era) | arXiv 2405.15793 | A | V3 | full text incl. App. B.4 |
| S-019 | Agentless (Xia et al., 2024) | arXiv 2407.01489 | A/B | V3 | full text read |
| S-020 | AutoCodeRover (ISSTA'24) | arXiv 2404.05427 | A | V2 | abs page read (abstract + metadata) |
| S-021 | The SWE-bench Illusion (v4) | arXiv 2506.12286 | A/B | V3 | full text read |
| S-022 | SWE-bench+ | arXiv 2410.06992 | A/B | V3 | full text read |
| S-023 | UTBoost | arXiv 2506.09289 | A/B | V3 | full text read |
| S-024 | AgentLens: The Lucky Pass Problem | arXiv 2605.12925 | A/B | V3 | full text read |
| S-025 | SpecBench: Reward Hacking in Long-Horizon Coding Agents | arXiv 2605.21384 | A/B | V3 | full text read |
| S-026 | Beyond Accuracy: Behavioral Dynamics of Agentic Multi-Hunk Repair (TOSEM-accepted) | arXiv 2511.11012 | A | V3 | full text read |
| S-027 | Understanding SE Agents: Thought-Action-Result Trajectories (ASE'25) | arXiv 2506.18824 | A | V3 | full text read |
| S-028 | CTIM-Rover: From Knowledge to Noise | arXiv 2505.23422 | A/B | V3 | full text read |
| S-029 | Beyond Fixed Tests: Code/Behavior Coevolution (Agent-CoEvo) | arXiv 2604.04580 | A/B | V3 | full text read |
| S-030 | MultiFixer (HTML title) / "Multi2Fixer" (listing variant) — coordinator-proposer multi-hunk repair | arXiv 2607.26591 | A/B | V3 | full text read (RQ3.3 ablation extracted) |
| S-031 | ITER: Iterative Neural Repair for Multi-Location Patches (FSE'23) | arXiv 2304.12015 | A | V3 | full text read |
| S-032 | LLMs Cannot Self-Correct Reasoning Yet (ICLR'24) | arXiv 2310.01798 | A | V3 | full text read |
| S-033 | ProgCo: Program Helps Self-Correction | arXiv 2501.01264 | A/B | V3 | full text read |
| S-034 | FLITSR: Improving SBFL of Multiple Faults (…) | arXiv 2306.09892 | A | V3 | full text read |
| S-035 | A large-scale study on human-cloned changes for automated program repair (Madeiral & Durieux, 2021) | arXiv 2104.02386 | A/B | V3 | full text read |
| S-036 | SWE-bench Pro Verified | arXiv 2609.08149 | A/B | V3 | full text read |
| S-037 | Saving SWE-bench: Benchmark Mutation | arXiv 2510.08996 | A/B | V2 | abs page read |
| S-038 | On Problems of Implicit Context Compression for SE Agents (Gelvan et al.) | arXiv 2605.11051 | B | V2 | abs page read |
| S-039 | Why Do Multi-Agent LLM Systems Fail? (MAST) | arXiv 2503.13657 | A | V3 | full text read |
| S-040 | Reflexion (NeurIPS'23) | arXiv 2303.11366 | A | V2 | abs page read |
| S-041 | Teaching LLMs to Self-Debug | arXiv 2304.05128 | A/B | V2 | abs page read |
| S-042 | ReAct (ICLR'23) | arXiv 2210.03629 | A | V2 | abs page read |
| S-043 | Lost in the Middle (TACL'24) | arXiv 2307.03172 | A | V2 | abs page read |
| S-044 | CRITIC: Tool-Interactive Critiquing (ICLR'24) | arXiv 2305.11738 | A | V2 | abs page read; ID re-verified consolidation pass |
| S-045 | LLMs Get Lost in Multi-Turn Conversation (Laban, Hayashi, Zhou & Neville) | arXiv 2505.06120 | B | V1 | arXiv API listing only |
| S-046 | Correlated Proxies: Reward Hacking (Laidlaw et al.) | arXiv 2403.03185 | B | V2 | abs page read |
| S-047 | Countdown-Code (RLVR reward hacking testbed) | arXiv 2603.07084 | B | V2 | abs page read |
| S-048 | TRACE (Testing Reward Anomalies in Code Environments) | arXiv 2601.20103 | B | V2 | abs page read (517 trajectories confirmed) |
| S-049 | Hack-Verifiable Environments | arXiv 2605.20744 | B | V2 | abs page read |
| S-050 | Prompt-Elicited Trajectories vs Training-Time Reward Hacking | arXiv 2604.23488 | B | V2 | abs page read |
| S-052 | SWE-bench Goes Live! | arXiv 2505.23419 | B | V2 | abs page read |
| S-053 | SWE-rebench (V2 collection paper, 2602.23866) | arXiv API | B | V1 | API listing (X-35/X-44 + consolidation re-check) |
| S-054 | Multi-SWE-bench (2504.02605) | arXiv API | B | V1 | API listing + consolidation re-check |
| S-055 | R2E-Gym | arXiv 2504.07164 | A/B | V3 | LaTeXML full text read (partial — key sections) |
| S-056 | SWE-Gym (2412.21139) | arXiv API | B | V1 | API listing + consolidation re-check |
| S-057 | MASAI (ICSE'25) | arXiv 2406.11638 | A | V3 | full text read |
| S-058 | CodeR (FSE'25) | arXiv 2406.01304 | A | V3 | full text read |
| S-059 | SpecRover: Code Intent Extraction | arXiv 2408.02232 | A/B | V2 | abs page read |
| S-060 | OpenAI — SWE-bench Verified blog | openai.com | C | V3 | page fetched and read |
| S-061 | Dynamic Mutant Subsumption Analysis (Parsai et al.) | arXiv 1809.02435 | A/B | V2 | abs page read |
| S-062 | Systemic Flakiness: Co-Occurring Flaky Failures | arXiv 2504.16777 | B | V2 | abs page read |
| S-063 | Order-Dependent Flaky Tests in JavaScript | arXiv 2501.12680 | A/B | V2 | abs page read |
| S-064 | Can Old Tests Do New Tricks… | arXiv 2510.18270 | B | V2 | abs page read |
| S-065 | Code Graph Model (CGM) | arXiv 2505.16901 | B | V2 | abs page read |
| S-066 | How Safe Are AI-Generated Patches? | arXiv 2507.02976 | B | V2 | abs page read |
| S-067 | Simplifying and Isolating Failure-Inducing Input (Zeller & Hildebrandt, TSE 28(2):183–200, 2002) | IEEE/SERP | A | V2 | SERP (G-12) — author/title/venue/year confirmed |
| S-068 | Delta Debugging in the Absence of Test Oracles Through Metamorphic Testing | arXiv 2607.00929 | B | V1 | API listing; ID re-verified consolidation pass |
| S-069 | Self-Reflection in LLM Agents: Effects on Problem-Solving Performance (Renze) | arXiv 2405.06682 | B | V1 | surfaced via N-8; ID re-verified |
| S-070 | WDD: Weighted Delta Debugging | arXiv 2411.19410 | B | V1 | API listing; ID re-verified |
| S-071 | Automated Patch Assessment for Program Repair at Scale (Ye et al.) | arXiv 1909.13694 | A/B | V2 | abs page read |
| S-072 | A Comprehensive Study of Code-removal Patches in APR (Ginelli et al.) | arXiv 2012.06264 | A/B | V2 | abs page read |
| S-073 | High-Quality Automated Program Repair | arXiv 2104.07851 | B | V2 | fetched for context; **not cited in findings** |
| S-074 | HAFixAgent: History-Aware Program Repair Agent | arXiv 2511.01047 | B | V2 | fetched for context; **not cited in findings** |
| S-075 | Debugging the Debuggers: Failure-Anchored Structured Recovery | arXiv 2605.08717 | B | V2 | fetched for context; **not cited in findings** |
| S-001 | Handoff spec (sysprompts/…minimaxM3-web.md) | internal | E | — | read in full; governs structure |
| S-002 | SRC-A: httpx_3672 four-trap walkthrough | internal | E | — | read in full; labels [V]/[SIM] preserved |
| S-003 | SRC-B: discussion-board digest (2026-09-30) | internal | D | — | digest with per-claim tiers; volatile (§17.6) |
| S-004 | Paper-track intel + roster reading | internal | E | — | read |
| S-005 | HARNESS_README digest (harness internals) | internal | C-equivalent | V-file | primary artifact digest; mechanics §13.1 |
| S-006 | Dataset census 2026-09-29 (prior run) | internal | E | — | receipts in prior deliverables |
| S-007 | Kaggle-00-Complete (rules/data snapshots) | internal | C | V-page | snapshots with timestamps |
| S-008 | ZIP inventory (22.42 GB package) | internal | C | V-file | non-destructive zipfile queries |
| S-009 | Live census re-verification 2026-09-30 | internal | E | measured | `census-check.py` re-run (Appendix F-1) |

**B.3 Supersession register.**

| Item | Superseded by / resolved as | Note |
|---|---|---|
| "Multi2Fixer" (name used in 2026-09-29 scratch notes) | arXiv listing title is **"MultiFixer"** (2607.26591); HTML full-text self-title reads "Multi2Fixer" | single identifier S-030; both variants recorded here and in `.bib` (`title = {MultiFixer…}`, `note = {self-titled "Multi2Fixer" in HTML v1}`) |
| S-067 double-assignment bug (draft) | resolved: S-067 = Zeller & Hildebrandt 2002 (V2); S-068 = oracle-free dd (V1); S-070 = WDD (V1) | §12.1 text corrected in final |
| ISTQB glossary entry for "fault masking" | **excluded, V0** — JS/cookie wall on both search and term URLs | not cited; Squeeziness used as canonical definition instead |
| One Semantic-Scholar-hosted PDF (coupling-effect era) | **excluded, V0** — HTTP 403 | Offutt obtained from author-lab mirror instead (S-011, V3) |
| 2026-09-29 BCF dossier numbers (127 vs 256 graphs; 5,800) | counting-basis artifacts — both true on their basis | kickoff2-council-errata; recorded §22 C-4 |
| Banned citation set (ICSM 2011, Gao & Wong, ODC 1994, DejaVu 2022, Weiser 1984, Agentless v2, Sherlock, DeeLoc) | never entered the ledger | F-5 grep proves zero occurrences |

**B.4 URL discipline.** After four guessed URLs 404'd early in the session (utexas Avizienis PDF, an invented NIST publications path, a constructed S2 hash URL — all logged), the rule applied: no URL is ever constructed; URLs come only from API results, SERP results, or citation lists inside V3 texts.

## Appendix C — Contradiction register (extended detail)

The four entries of §22 with the triangulation evidence spelled out:

**C-1 (pipeline vs. agentic decomposition).** Agentless [S-019]: 32.00% Lite at $0.70/instance, explicit claim that workflow beats agent scaffolds of its era. MASAI [S-057]: modular sub-agents match/beat monolithic agents; CodeR [S-058] manager+4-agent graph competitive; Multi2Fixer [S-030]: scheduling gains exist only in multi-hunk settings. Triangulation: Nashid [S-026] shows accuracy spread 26.98–92.82% is *hunk-structure-dependent* — the moderator is visible inside both camps' data. Resolution: segment-split, mapped onto the measured 70.5/29.5 corpus split. No residual disagreement.

**C-2 (reflection helps vs. hurts).** Helps: Reflexion [S-040 V2], Self-Debug [S-041 V2], ProgCo [S-033 V3], CRITIC [S-044 V2]. Hurts: Huang [S-032 V3] ("performance even degrades after self-correction"), CTIM [S-028 V3] (−2 to −11pp for memory variants), Renze [S-069 V1] (null-to-negative, non-load-bearing). Triangulation: the helps-side all inject *external* signal (execution, tools); the hurts-side all use *intrinsic* or *cross-task* signal. Moderator identified; boundary conditions in §15.3. Residual: magnitude of recovery under weak checkers (checker-fidelity ceiling) — flagged open.

**C-3 (SWE-bench integrity magnitudes).** Crisis side: S-022 (63.75% suspicious; −8.5pp), S-023 (54.6% annotation errors), S-021 (76% context-free accuracy), S-024 (10.7% lucky). Management side: S-060 (human-verified 500 kept), S-023's own note that Verified-grade tasks have fewer errors, S-022's note that 94% of instances predate LLM cutoffs (counters pure-leakage narrative). Triangulation: levels differ (raw benchmark vs. Verified subset vs. anti-hacking variants [S-036]); each is internally consistent at its level. Residual: none material; paper must cite both sides or reviewers will supply the missing one.

**C-4 (counting-basis artifacts).** 127 vs 256 graph files (parquet vs rendered-graph counting), 5,800 "participants" (dated counter). Both true on their basis; resolved 2026-09-30 (kickoff-2 council); recorded to prevent recurrence.

## Appendix D — Annotation protocol (full; machine-readable copy = `annotation-protocol.json`)

**D.1 Unit and inputs.** One task instance per record. Annotator sees: base_commit snapshot, gold patch (`patch`), test patch (`test_patch`), issue text, repo tree (graph JSON optional). Annotator does NOT see agent trajectories (construct layer must stay behavior-free).

**D.2 Fields.** `task_id`; `repo`; `task_class` ∈ {single-bug, multi-bug-co-located, multi-bug-dispersed, refactor-with-bug, test-update}; `k_fixes` (count of semantically distinct fixes in gold patch); `files_touched` (list + count); `coupling_type[]` ⊆ {copy-paste-clone, mirror-module-invariant, producer-consumer, temporal, none}; `dag_exists` (bool); `dag_edges[]` (fix-id pairs with direction; probe = D.4 Q4); `masking_coverage[]` (per gold-fix id: is there a graded assertion that can fail due to this fix's absence? yes/no); `masking_propagation[]` (per gold-fix id: injecting the defect alone — does any graded test fail?); `oracle_asymmetry` ∈ {yes, partial, no} + `asymmetry_evidence[]` (test IDs from each suite); `graded_scope` ⊆ `gold_scope` (file-set comparison, proper-subset flag); `spec_conflict` (does visible suite at base assert behavior incompatible with issue text?); `hints_present` (bool — expected false); `flakiness_observed` (rerun-identical outputs flag); `annotator_id`; `timestamp`.

**D.3 Decision tree (normative order).**

1. Run both suites on base commit. Any visible-suite failure? → note as reproduction baseline.
2. Apply gold patch to scratch clone (never the graded copy). Run **visible** suite: failures on assertions that reference the OLD API (renames, removed params, changed signatures) → `oracle_asymmetry=yes`, evidence = failing test IDs + assertion lines. Only import/collection errors → recheck environment first (edge case E-2). Mixed → `partial` (E-4).
3. Apply test patch too (gold + tests = intended final state). Run all: every failure here = harness inconsistency candidate (flag, do not code).
4. For each gold-fix component hunk-set: (a) revert only it, rerun graded tests → failure ⇒ `masking_coverage=no` for it; no failure ⇒ `masking_coverage=yes` (masked by coverage). (b) Does any other fix's presence/absence change (a)'s outcome? ⇒ `dag_exists=true`, record edge.
5. Classify coupling by inspection: identical hunks in sibling trees → copy-paste-clone; symmetric-but-not-identical edits enforcing one invariant → mirror-module-invariant; symbol-definition-then-use → producer-consumer.
6. `spec_conflict`: read visible test file(s) at base; do they assert the pre-issue contract on any symbol the issue says will change? yes/no + test IDs.
7. Flakiness guard (E-3): every suite run that decides a field is executed twice; differing outcomes ⇒ stop, mark `flakiness_observed`, exclude from construct counts.

**D.4 Embedded decision questions.** Q1: can the gold-fixed program pass the *base* visible suite? (asymmetry polarity). Q2: which graded F2P asserts map to which gold fix? Q3: any gold fix with zero reachable graded assertion? Q4: does fixing A without B leave a state where B cannot be validated (import errors, missing symbols)? — yes ⇒ A→B dependency edge. Q5: is the visible suite updated by the *test* patch (i.e., contradiction is cured at grading)? (distinguishes Trap-1-persistent from Trap-1-cured).

**D.5 Exemplars.** (a) httpx_3672 (hypothesis annotation, from SRC-A [V] artifacts): `oracle_asymmetry=yes (p.complete vs p.reset)`, `coupling_type=[mirror-module-invariant]`, `masking_coverage=yes` (Trap-4 defects), `masking_propagation=yes` (no-parens site), `dag_exists=true` (rename→consumers), `graded_scope⊊gold_scope` (1 test file vs 7 gold files). (b) Null exemplar (constructed): single-file bugfix, visible test updated compatibly in test patch, no coupling, no DAG, `oracle_asymmetry=no` — the modal task.

**D.6 Edge cases.** E-1 `graded_scope = gold_scope`: ordinary task; constructs all no. E-2 test patch *adds* new test files vs *modifies* existing: modifications are the asymmetry-risk class; additions rarely contradict (flag `asymmetry_risk=low` for additions). E-3 flakiness: D.3 step 7; also exclude order-dependent failures (S-062/S-063 discrimination: rerun in isolation). E-4 partial asymmetry: only some visible tests contradict — record per-test; do not collapse to a single boolean.

**D.7 Reliability.** §16.3 (two annotators, 30 stratified tasks, κ ≥ 0.70 target on the four construct fields, third-pass adjudication, field-respecification if κ < 0.70). Output: one JSON per task, schema-validated against `annotation-protocol.json`.

## Appendix E — Metric dictionary (full)

| Metric | Definition/formula | Log source (ATIF v1.7 / harness) | Interprets | Failure modes / confounds |
|---|---|---|---|---|
| localization_calls | # calls before first edit lands in a gold file | trajectory tool-call list | search efficiency | graph tool changes call semantics across designs |
| turn_first_edit | turns until first edit | trajectory | planning depth | none serious |
| edits_total | # edit operations | trajectory | effort | edit-vs-retry policy differences |
| edits_not_in_final_rate | 1 − \|final edits ∩ all edits\|/\|all edits\| | trajectory + submitted patch | thrash/discard [S-035 link] | legitimate exploration inflates |
| revert_rate | reverts / edits | trajectory | oscillation | revert≠delete distinctions must be coded |
| **revert_correct_rate** | reverts of edits that later reappear in gold ∩ submission / reverts | trajectory + gold patch | **Trap-1 signature (P-2)** | needs gold — annotator-side only |
| repeat_action_rate | identical (tool,args) consecutive / calls | trajectory | loop detection [S-024 lineage] | pagination repeats are legal |
| loop_rate | episodes ≥3 repeated actions with no state change / task | trajectory | process failure | state-change detection granularity |
| budget_exhausted_rate | tasks ending at cap | harness status + eval_config | feasibility | cap differs per task (eval_config!) |
| premature_submit_rate | submissions with unrun scheduled fixes | trajectory | process | unobservable intent — code as "scheduled-but-unedited" |
| fix_order_violations | # realized edit orders violating the pre-declared schedule | plan entry + trajectory | ordering discipline (P-3) | schedule must be logged before edits (else post-hoc) |
| gold_scope_overlap | \|edited ∩ gold files\|/\|gold files\| | submission + gold | localization quality | directory-level vs file-level |
| graded_scope_overlap | \|edited ∩ graded-tested files\|/\|graded files\| | submission + test patch | contract coverage | graded files unknown at runtime — annotator-side |
| test_signal_conflict_events | # (visible-red ∧ edit spec-faithful) co-occurrences | trajectory + issue text | asymmetry pressure | "spec-faithful" needs coder rules (D.4 Q6) |
| mask_resolution_latency | turns from mask-present to mask-removed | annotation + trajectory | masking cost | only for annotated masks |
| evidence_present_at_fault | bool: was the decisive evidence in the observation? | trajectory observation text | tool-loss vs reading-failure (O-6) | requires observation retention in logs |
| blind_retry_count | retries after non-informative error [S-024 penalty term] | trajectory | weak process | error-class table needed |
| lucky_pass_label | AgentLens-style tier of a passing run | trajectory (+ references if shipped) | process quality (P-4) | subjective tier — 2-rater κ |

## Appendix F — Reproduction recipes

**F-1 Corpus census (executed 2026-09-30; script `census-check.py`, verbatim):**

```python
import json, zipfile, re, collections
Z = zipfile.ZipFile(r"<path>/input/kagglecomp/kagglecomp_data_package/gemma-4-developer-agent.zip")
t = [json.loads(l) for l in Z.open("tasks.jsonl")]
print("tasks:", len(t))
print("repos:", dict(collections.Counter(x["repo"] for x in t)))
def files(patch):
    return set(re.findall(r"^\+\+\+ b/(\S+)", patch, re.M))
n1 = sum(1 for x in t if len(files(x.get("patch") or "")) == 1)
nf = collections.Counter(len(files(x.get("patch") or "")) for x in t)
print("gold single-file:", n1, f"({n1/len(t)*100:.1f}%)")
print("gold file-count dist:", dict(sorted(nf.items())))
touch_tests = sum(1 for x in t if any(f.startswith("tests/") for f in files(x.get("patch") or "")))
print("gold touches tests/:", touch_tests)
empty_hints = sum(1 for x in t if not (x.get("hints_text") or "").strip())
print("hints empty:", empty_hints)
tp_not_tests = 0; tp_files_total = 0
for x in t:
    fs = files(x.get("test_patch") or "")
    tp_files_total += len(fs)
    if any(not f.startswith("tests/") for f in fs): tp_not_tests += 1
print("test_patch files total:", tp_files_total, "| tasks w/ test_patch outside tests/:", tp_not_tests)
```

Observed output (2026-09-30 run): tasks: 129 · repos {fastapi 67, rich 48, requests 13, httpx 1} · single-file 91 (70.5%) · dist {1:91, 2:19, 3:5, 4:3, 5:1, 7:2, 8:1, 9:2, 10:2, 11:1, 20:1, 26:1} · gold touches tests/: 0 · hints empty: 129 · test_patch files 282, outside tests/: 0.

**F-2 Oracle-asymmetry probe (per task; runs the D.3 decision tree mechanically).** (1) extract base_commit/patch/test_patch from `tasks.jsonl`; (2) clone repo at base into a scratch dir; (3) apply gold patch only; (4) run the *visible* suite (pytest on tests/ as shipped at base); (5) classify failures: assertion-on-old-API (rename/param/signature) ⇒ asymmetry event; import/collection errors ⇒ environment check then E-2; (6) record failing test IDs + assertion lines. Expected on httpx-class tasks: `test_parsers.py`-style failures naming the old symbol. Cost: ~2–4 min/task locally. Output feeds P-1.

**F-3 Term census greps (executed).** Over the 22 converted full texts (`scratch/pages/txt-*.txt`): `grep -c -i "fault masking" txt-*.txt` (hits only in FLITSR + classics context); `grep -c -i "interference" txt-*.txt` (non-technical senses; Gelvan usage noted); `grep -c -iE "multi-hunk|multi-location|coordinated edits" txt-*.txt` (the working vocabulary). Re-run verbatim; raw outputs retained in session transcript.

**F-4 Trajectory metric extraction.** Parse ATIF v1.7 traces [S-005]: tool-call sequence → localization_calls/edits_total/repeat_action_rate; state snapshots → loop detection; submission diff + gold → gold_scope_overlap, revert_correct_rate (join edits→reverts→final). All metrics defined Appendix E; every formula executable from logged fields alone.

**F-5 Banned-citation check (executed at QC):** `grep -riE "ICSM 2011|Gao (&|and) Wong|ODC 1994|DejaVu|Weiser|Agentless v2|Sherlock|DeeLoc" <deliverables>/` → expected and observed: **0 hits**.

**F-6 Search-log reproduction.** Appendix A tables + `scratch/search-log.md` (raw) + `scratch/pages/serp-*.txt` (SERP dumps) re-run any query verbatim; engines drift, so re-runs should expect result-set drift, not absence.

## Appendix G — Rejected mappings, negative searches, and the do-not-do list

**G.1 Rejected construct mappings (preserved with reasons).**

| Proposed mapping | Rejected because | What it actually is |
|---|---|---|
| Trap 1 = fault masking (propagation) | no execution-path propagation involved; divergence is in asserted contract, not state propagation | oracle asymmetry (weak-tests family [S-022, S-023] + unnamed contradiction polarity) |
| Loop-and-thrash = interference | occurs trivially without any fault interaction (edit-syntax loops) | process failure [S-018, S-024] |
| Brute-force convergence = masking | concealment of nothing; exploitation of oracle weakness | weak-process pass [S-024] |
| Premature validation = masking | evidence-reading fault, not concealment | misinterpretation [S-027] |
| t-way interaction rates = multi-fault coupling rates | parameters ≠ code defects; input-space ≠ edit-space | analogy only, usable as prior (§12.4) |
| Reward hacking = masking | policy-level optimization vs structural concealment | adjacent construct; intersection = Δ-gap [S-025] |
| Test pollution = interference | cross-test state leakage, not cross-fault concealment | separate testing-literature construct |
| Flaky co-occurrence = interference signals | non-determinism mimics oscillation in trajectories | confound — discriminated by E-3 rerun |

**G.2 Negative searches** (queries, engines, dates in §8.6 + Appendix A; SERP dumps retained): N-1 agent-literature fault-masking term — none; N-2 fault-interference term — none (farm-page contamination excluded); N-3 multi-fault repair studies — adjacent only; N-4 "oracle asymmetry" — none scholarly; N-5 local-vs-hidden contradiction — practitioner only; N-6 revert-after-conflict behavior — no primary study; N-7 coincidental-correctness empirical rates — DDG-throttled, **unresolved, listed to re-run** (classical literature exists, V2-anchored via S-012's PIE citation); N-8 reflection harms — S-069 surfaced (V1, non-load-bearing).

**G.3 Do-not-do list (competition track).** (1) No verbal-only reflection on the fixed model [S-032]. (2) No cross-task memory without relevance filtering [S-028]. (3) No whole-patch single-shot on multi-file tasks [S-030]. (4) No test-file edits as scoring strategy — anti-tamper reset voids them [S-005]. (5) No citing t-way percentages as defect-coupling rates [S-015/S-016 misuse]. (6) No trusting local-suite green on tasks whose issue text implies API change (Trap-1 class) — spec-first priority decision required [S-002, §24].

**G.4 Overclaim guardrails (paper track).** Wording discipline from §25: claim the *contradiction polarity + measured rate*, not "we discovered visible/hidden divergence"; claim *ordering under contradicting oracle*, not "ordering matters" (already [S-030]); claim *corpus-specific* prevalence, never cross-corpus extrapolation; label every measured number with the CQ-04 sentence; keep BCF components in hypothesis voice until P-1/P-2/P-3 return.
