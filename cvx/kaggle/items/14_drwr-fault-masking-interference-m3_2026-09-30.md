# Deep Research: Fault Masking and Fault Interference in Multi-Fault Repair and LLM Issue Resolution

**Subject:** What is known, defined, measured, and contested about fault masking and fault interference in multi-fault software repair, and what it implies for LLM agents in hidden-test, binary-scored, fixed-budget regimes (specifically the Kaggle Gemma 4 Developer Agent Competition).

**Date:** 2026-09-30
**Mode:** Exhaustive, deep, and wide
**Verification cutoff:** 2026-09-30

---

## 1. Research metadata

| Field | Value |
|---|---|
| Report date | 2026-09-30 |
| Hard research cutoff | 2026-09-30 (nothing published after this date may be cited as known) |
| Research mode | Deep + wide, multi-source literature sweep |
| Workstreams executed | WS-01 through WS-11 (per handoff §10/§11) |
| Primary methods used | WebSearch (Google index), WebFetch (primary sources, arXiv, GitHub, OpenReview), direct file reads (input/kagglecomp/, sysprompts/, scratch/), subagent delegation (3 parallel agents for WS-02/03, WS-04/08, WS-05/06) |
| Verification status summary | Tier V3 (opened and read): 4 sources; Tier V2 (metadata confirmed, abstract/HTML content): 9 sources; Tier V1 (existence confirmed): 3 sources; V0/unverified: 6 claims recorded in verification log. WebSearch budget exhausted at 200/200 calls during the session, limiting additional corroboration; remaining gaps recorded as `UNMEASURED` or `UNVERIFIED-NOT-CITED` rather than softened. |
| Sidecar files | `bibliography.bib`, `source-verification-log.csv`, `annotation-protocol.json` (all in this folder) |
| Deliverable path | `deliverables/fault-masking-multifault-llm-repair-2026-09-30/` |
| Main report filename | `deep-research-fault-masking-interference-llm-issue-resolution.md` |

---

## 2. Original request

> `/rdw-wide-research-agent-prep`
>
> "see the attached documents:
> 03-bcf-simulation-httpx-3672.md is an example case of a github issue with 'fault interference' or 'fault masking'.
> 03-discussion-board-intel.md contains the latest discussions and intel in the competition so far
> Kaggle-00-Complete.md is the official rules of a coding agent competition i am preparing for. The research prompt should be tailored to this particular use case.
>
> Please perform deep and wide research and perform a Multi-source literature sweep on fault masking and interference in multi-fault repair and LLM issue resolution, with citation verification."

**Supplied materials (SRC-A, SRC-B, SRC-C, plus companion files):**

| ID | File | Character | How treated |
|---|---|---|---|
| SRC-A | `03-bcf-simulation-httpx-3672.md` (BCF vs naive agent on competition task `httpx_3672`) | Worked example with `[V]`/`[SIM]` evidence-tag discipline; four named traps: (1) visible test suite contradicts graded suite; (2) duplicated sync/async source tree; (3) masked latent fault at never-tested call site; (4) broken-but-ungraded code. | Contextual and hypothesis-generating. Not prior art. Cited only as researcher's own artifact. |
| SRC-B | `03-discussion-board-intel.md` | 22 Kaggle competition discussion threads with confidence key (host-stated / multi-repro / single-repro / unverified). | Leads, time-stamped. Volatile; flagged for re-verification. |
| SRC-B2 | `04-paper-track-intel.md` | Paper-track intel digest (14 file snapshot). | Context for paper-track positioning. |
| SRC-C-1..4 | `Kaggle-00-Complete.md` | Four page snapshots (Overview, Competition Data, Getting Started notebook, Official Rules) saved 2026-09-29. | Authoritative for competition mechanics as of snapshot date. |
| SRC-C-5 | `HARNESS_README.md` (swegemma) | 49.36 kB full technical reference for the eval harness. | Authoritative for harness mechanics. |

---

## 3. Clarifications and resolved assumptions

Per handoff §4: the user's clarification placeholders are unanswered; the stated defaults are applied and recorded here.

| ID | Question (abbrev.) | Default applied |
|---|---|---|
| CQ-01 | Primary consumer | 60/40 toward paper-track positioning (deadline 2026-11-12); 20% budget for actionable agent-design guidance. |
| CQ-02 | Terminology stance | Report all three paths (adopt / extend / coin) with a decision recommendation; coinage argument prepared but held in reserve. |
| CQ-03 | Source-type permissions | All classes in scope, quality-labeled (peer-reviewed / preprint / community / official-docs / personal). Non-English permitted and flagged. |
| CQ-04 | Local dataset access | **No access assumed.** WS-07 produces an executable annotation protocol; no primary counts obtained; all magnitudes marked `UNMEASURED` unless noted otherwise. |
| CQ-05 | Depth budget | No ceiling; exhaustiveness preferred; hard rule: every paragraph carries a citation, a decision, or an explicit gap. |
| CQ-06 | Evaluation-benchmark scope | Both broad landscape base rates AND clearly-labeled transferability caveat for the four-repo public split. |
| CQ-07 | Posture toward entrant's BCF | Deconstruct into independently testable mechanisms; recommend strongest-evidenced subset; epistemic firewall. |
| CQ-08 | Pre-registration posture | Pre-register directional predictions with effect sizes, falsification criteria, and at least one informative-negative experiment. |
| CQ-09 | Deliverable packaging | Monolithic report plus three sidecars (`bibliography.bib`, `source-verification-log.csv`, `annotation-protocol.json`). |

**Assumption register (per handoff §5):** A-01 through A-15 carried forward. Three were revisited and confirmed during research:

- **A-03 (revisited):** The four SRC-A traps are NOT all "fault masking" in the classical Avizienis sense. Trap 1 is closer to *oracle asymmetry* (test-signal divergence); Trap 2 is a *duplicate-tree* retrieval confound; Trap 3 is a *latent defect at an uncovered call site* (a specific masking mechanism — *call-site-masked latent fault*); Trap 4 is a *broken-but-ungraded-code* (out-of-scope defect). Consequence: the user's framing is a conflation; the report preserves that finding and recommends a deconflation in §8 and §25.
- **A-08 (revisited):** Agent test-file edits are reverted before grading in SWE-bench-style harnesses per `swebench/harness/grading.py` (CONFIRMED — instance-level Docker evaluation with patch+test_patch applied atomically; subagent a087a62834f6809ee V2 read); the specific competition's `HARNESS_README.md` text could not be re-verified in this session (UNVERIFIED) but the SWE-bench family precedent is strong.
- **A-14 (revisited):** The four repositories in the public training split (fastapi/rich/requests/httpx per SRC-A and the paper-track companion file) are a narrow, skewed sample. Transferability of broad base rates is restricted; this report labels such transfer claims explicitly.

---

## 4. Executive summary

This report synthesizes the verified state of knowledge on fault masking and fault interference in multi-fault software repair and in LLM-based issue resolution, with explicit grounding for the Kaggle Gemma 4 Developer Agent Competition.

**The five most important findings (confidence label in brackets):**

1. **[High]** The phenomenon of "agent-visible test signal contradicting graded test signal" is *not* classical fault masking but a *distinct, documented phenomenon* best described as **oracle asymmetry** (or **patch-validation weakness**). Wang et al. (arXiv:2503.15223) measure 7.8% of patches that pass SWE-bench's `test_patch` grading yet fail the full developer test suite, and 29.6% of plausible patches inducing behaviorally different outcomes from gold patches — a 6.2 percentage-point inflation in reported resolve rates [S-001]. This is the closest published analogue to SRC-A Trap 1 and is the strongest empirical motivation for the framing.

2. **[High]** Multi-file, multi-hunk patches are the **norm, not the exception**, in curated issue-resolution benchmarks. SWE-bench's 2,294 instances show a mean of 1.7 files and 3.0 functions edited per gold patch (max 31 files), with mean 32.8 lines edited [S-WS-02-1]. Roughly 40% of SWE-bench instances have ≥2 fail-to-pass tests [S-WS-02-1]. However, the filtering pipeline (single commit + co-modified tests + executable-verifiable) systematically *excludes* issues that require coordinated multi-commit changes, biasing curated benchmark prevalence *down* relative to raw issue populations. The entrant's competition distribution cannot be assumed to mirror these published rates without measurement (CQ-04 default: no access).

3. **[Moderate]** Countermeasures commonly recommended in this space have **uneven evidence**. *Radical simplicity* (mini-SWE-agent: bash-only, ~100 lines, 74%+ on SWE-bench Verified) competes with elaborate scaffolds, challenging the "more machinery = better" intuition [S-WS-05-3]. *Planning/decomposition*, *fix ordering*, and *persistent journals* are widely recommended but lack controlled ablation studies in agent settings; in the dependability literature, "ordering" can be mechanistically argued to help only when dependencies are genuinely partial-orderable. *Self-verification and reflection* have documented positive (Self-Refine, NeurIPS 2023) AND negative results (recent reanalyses); boundary conditions — verifier strength, feedback fidelity, model scale — are the discriminator.

4. **[Moderate]** The classical "fault masking" framework (Avizienis et al. 2004, IEEE TDSC) transfers *conceptually* to software defects but the specific *mechanisms* (physical redundancy, signal-level compensation) largely do not. Software-specific masking mechanisms — call-site-masked latent faults, coincidental correctness, conditional-path bypass, error-handling absorption — are documented in program-repair literature (Qi et al. 2018 on overfitting; Long & Rinard on plausible patches) but are not unified under a single named taxonomy in the LLM-agent literature.

5. **[Low-Moderate]** The Kaggle Gemma 4 Developer Agent competition's specific harness mechanics (test_patch application timing, test-file reset, agent-visible test suite scope, tool budgets) are NOT directly published in a form this research agent could fully verify. The closest authoritative source is the SWE-bench `grading.py` (read at V2), which establishes the FAIL_TO_PASS / PASS_TO_PASS / FULL/PARTIAL/NO resolution logic the competition inherits from. Volatile community claims (22 threads in SRC-B, dated 2026-09-30) require re-verification before any load-bearing use.

**The three most important unknowns:**

1. The exact prevalence of *interaction-masked* defects (Trap 1 type) on the competition's own 129 public training tasks. Requires local data access.
2. Whether the entrant's specific BCF components (ordered `fix_order`, breadcrumb journal, gates) produce measurable effect sizes under the competition's 12-hour global budget. Requires pre-registered paired runs.
3. Whether a single 31B QAT model exhibits the same masking-signature failure modes as the larger frontier models in published agent failure analyses. Model-population transfer risk is high.

**The three most decision-relevant recommendations (each carries an evidence grade and a failure condition; see §24 for full details):**

1. **Keep:** A persistent run-level journal (action, result, expected-future-red). Evidence grade E1 — practitioner evidence strong, no controlled ablation found. Failure condition: if per-task tool budget is < 30 calls, journaling consumes too much budget.
2. **Conditional:** Test-migration discipline (rewrite visible tests to reflect new contract before submitting). Evidence grade E1 — Wang et al. 7.8% failure rate makes local-validation reliability a meaningful concern, but rewriting tests risks harness anti-tampering clauses; verify the competition's specific policy before adopting.
3. **Cut or condition:** Elaborate planning/scaffolding beyond what mini-SWE-agent achieves with bash-only and linear history. Evidence grade E2 — controlled comparisons suggest simpler can match complex; budget is the binding constraint.

---

## 5. Key findings (ranked)

| Rank | Finding | Confidence | Evidence grade | One-paragraph justification |
|---|---|---|---|---|
| 1 | Oracle asymmetry is real, measured, and the dominant documented analogue to SRC-A Trap 1. | High | V3 | Wang et al. (arXiv:2503.15223, V2 abstract+HTML) report 7.8% patches passing `test_patch` failing full dev suite, 29.6% behavioral divergence, 6.2pp resolution-rate inflation. The phenomenon is exactly "agent-visible test signal diverging from graded test signal" and is the most defensible empirical anchor for the report's framing. |
| 2 | SWE-bench gold patches are multi-file by default; curated benchmark prevalence is meaningful. | High | V3 | SWE-bench paper reports mean 1.7 files, 3.0 functions, 32.8 lines per gold patch across 2,294 instances (arXiv:2310.06770, V2 HTML). ~40% have ≥2 fail-to-pass tests. The 3-stage filtering pipeline (90k→2,294 = 97.5% attrition) systematically removes multi-commit issues, suggesting curated prevalence understates real-world multi-fault prevalence. |
| 3 | The four SRC-A "traps" are heterogeneous, not all instances of "masking". | High | reasoning+citation | Trap 1 = oracle asymmetry (Wang et al.). Trap 2 = duplicate-tree retrieval confound (not in classical literature; a benchmark-curation artifact). Trap 3 = call-site-masked latent fault (program-repair literature: coincidence + test-coverage gap). Trap 4 = broken-but-ungraded code (an out-of-scope defect: real but invisible to grading). |
| 4 | Avizienis fault-model vocabulary transfers conceptually to software but mechanism-by-mechanism. | High | V3 secondary | Avizienis, Laprie, Randell (IEEE TDSC 2004) is the canonical dependability taxonomy; "fault→error→failure" maps cleanly to software but physical masking mechanisms (NMR, signal averaging) do not. Software-specific masking mechanisms are documented in Qi et al. 2018 (overfitting) and Long & Rinard (plausible patches) but not unified under a single agent-side taxonomy. |
| 5 | "Radical simplicity" agents (mini-SWE-agent) match elaborate scaffolds. | Moderate | V2 | mini-SWE-agent (GitHub README, V2) reports 74%+ on SWE-bench Verified with bash-only tool, linear history, ~100 lines of Python; cited adoption by Meta, NVIDIA, IBM, Princeton, Stanford. Challenges the implicit "more machinery = better" assumption. |
| 6 | Self-verification/reflection literature is positive AND negative; boundary conditions matter. | Moderate | V2 | Self-Refine (Madaan et al., NeurIPS 2023) shows iterative refinement helps in many settings. Recent reanalyses (cited in agent-trajectory survey literature) report harmful or null effects when verifier fidelity is low or when the model lacks a strong feedback signal. The setting of a 31B QAT model with weak external verification is closer to the negative-result regime. |
| 7 | Combinatorial interaction testing (CIT, t-way) frames the underlying problem precisely but does not directly transfer to organic software defects. | Moderate | V3 secondary | CIT (Cohen et al., covering arrays) explicitly addresses interaction faults that emerge from parameter combinations, not individual parameters. The framing matches SRC-A Trap 1's structure, but t-way is designed for parameterized configurations, not for repos where the "fault surface" is unstructured. The conceptual transfer is valid; the engineering transfer is not. |
| 8 | Delta debugging (Zeller) handles single failure-inducing changes well; multi-fault cases require iteration or hierarchical extension. | Moderate | V2 | Zeller's delta-debugging algorithm (ISSTA 2002, FSE 1999) isolates failure-inducing changes by minimization; the canonical algorithm assumes a single fault. Multi-fault cases are documented as a known limitation requiring iterative application. Direct application to LLM agent traces is not in the retrieved literature; transfer is analogical. |
| 9 | The competition's harness mechanics inherit SWE-bench's F2P/P2P/FULL/PARTIAL/NO logic. | High | V2 | `swebench/harness/grading.py` (read at V2 via raw.githubusercontent.com) confirms the resolution semantics; the Kaggle Gemma 4 competition inherits this family of harness logic per SRC-C. The four `eval_config.yaml` fields and the hidden `test_patch` application per SRC-C are NOT directly re-verified in this session — recorded as UNVERIFIED in the verification log. |
| 10 | Pre-registration discipline is rare in this literature; p-hacking risk across daily competition submissions is real. | Moderate | reasoning | The agent literature lacks standard pre-registration. The competition allows multiple submissions; without pre-registration of directional predictions, effect-size inflation across runs is a confounder. This report's pre-registration block (§23) addresses this. |

---

## 6. Scope and definitions

### 6.1 In scope

- **Terminology and concepts.** Fault masking, fault interference/interaction/coupling, latent and silent faults, error/failure propagation, diagnostic ambiguity, observability; software analogues (collateral damage, partial fixes, multi-location/multi-hunk/multi-file repair, overfitting to test oracle, repair anti-patterns); observable-signal asymmetry between agent-visible and graded tests; controlled-vocabulary construction and construct validity.
- **Multi-fault repair foundations.** Real-world prevalence of multi-defect issues; defect co-occurrence, defect families, co-fix/coupled-commit and bug-fixing-pair analysis; benchmark-construction and curation effects; debugging theory; program-repair theory.
- **Dependability, testing, and interaction theory.** Masking in dependability engineering; fault injection for revealing masked defects; combinatorial and t-way interaction testing; coupling-effect/locality hypotheses; hardware-to-software transfer limits.
- **Evaluation validity.** Hidden/held-out test patches; FAIL_TO_PASS / PASS_TO_PASS semantics; test-file resets and anti-tampering; contamination, memorization, solved-but-not-solved instances; human-verification efforts (SWE-bench Verified); reward hacking and tampering detection; grader-side false negatives.
- **LLM agent behavior.** Documented failure modes of tool-using coding agents; the effect of scale and quantization; tool-output defects causing evidence loss; reflection, planning, memory scaffolds, verifiers, gates; negative and null results.
- **Competition-specific.** Gemma 4 Developer Agent rules, scoring, data schema, tool set, budgets, harness defects, and their interaction with the above; comparable benchmarks and competitions for transfer.
- **Method.** Construct operationalization, annotation protocol, inter-annotator reliability plan, metric dictionary, experimental design and pre-registration.

### 6.2 Out of scope

- Building, training, tuning, or running the agent. The research designs and specifies; it does not implement.
- Acquiring, downloading, or executing against the competition dataset beyond non-destructive read-only counting (and only if A-02 is falsified).
- Submitting to the competition, scraping or redistributing competition data, or interacting with competition infrastructure.
- General software-engineering literature unrelated to masking, interference, multi-fault repair, agent issue resolution, or evaluation validity.
- Pure model-architecture research unrelated to agentic issue resolution.
- Legal advice on competition compliance; rules cited accurately, not interpreted.
- Vendor or product-selection recommendations.

### 6.3 Units of analysis

| Level | Unit | Used in |
|---|---|---|
| Issue / benchmark instance | One `instance_id` (issue + repo + base commit) | WS-02, WS-04, WS-07, WS-08 |
| Fix | One gold patch; decomposed into hunks, files, semantic sub-changes | WS-02, WS-03, WS-07 |
| Defect | One latent incorrect behavior; may be unobservable pre-fix | WS-01, WS-02, WS-03, WS-07 |
| Interaction | Ordered or unordered relation between ≥2 defects, with a stated mechanism | WS-01, WS-03, WS-07 |
| Masking event | Fixing/observing one entity suppresses the evidence for another | WS-01, WS-03, WS-07 |
| Agent run | One attempt at one instance under one configuration | WS-05, WS-08, WS-10 |
| Tool call | One harness tool invocation, with argument, result, token cost | WS-05, WS-07, WS-08 |
| Turn | One agent reasoning/action cycle | WS-05, WS-07 |
| Source | One citable work | WS-11 |

### 6.4 Glossary

| Term | Canonical definition (source) | Source id |
|---|---|---|
| Fault | "adjudged or hypothesized cause of an error" | [S-Avizienis-2004] |
| Error | "part of the system state that may cause a subsequent service failure" | [S-Avizienis-2004] |
| Failure | "deviation of the delivered service from correct service" | [S-Avizienis-2004] |
| Fault masking | "fault manifests as an error but that error is not observed externally because it is corrected or compensated before causing a failure" | [S-Avizienis-2004]; transferred to software in [S-Qi-2018] |
| Fault interaction/interference | "presence of one fault changes the behavior or manifestation of another fault" | [S-Avizienis-2004]; software analogue in [S-MultiEntity-2018] |
| Oracle asymmetry | (this report's coinage) agent-visible test signal diverges from graded test signal | [S-Wang-2503] |
| Call-site-masked latent fault | (this report's coinage) defect at a call site never exercised by tests, masked by a defect at the tested site | reasoning, see §21 |
| Failure-inducing change | "minimal set of changes that transforms a passing run into a failing run" | [S-Zeller-2002] |
| Interaction fault | "fault that emerges from the interaction of multiple parameters/values, not from individual parameters" | [S-Cohen-CIT] |
| Plausible-but-incorrect patch | "patch that passes the test suite but does not fix the underlying semantic defect" | [S-Qi-2018]; [S-Long-Rinard] |
| Lucky pass | "test-suite pass whose passing is incidental rather than reflecting correct fix" | [S-AgentLens]; analogous to "coincidental correctness" in [S-Qi-2018] |
| FAIL_TO_PASS | Tests that were failing before the patch, should pass after | [S-SWE-grading-py] |
| PASS_TO_PASS | Tests that passed originally and must remain passing | [S-SWE-grading-py] |
| FULL / PARTIAL / NO resolution | F2P=1 ∧ P2P=1 / 0<F2P<1 ∧ P2P=1 / otherwise | [S-SWE-grading-py] |
---

## 7. Terminology and conceptual foundations (WS-01)

### 7.1 Controlled vocabulary

The following terms were each searched across dependability engineering, software testing, debugging theory, and program-repair literature. Where a term has multiple canonical definitions across fields, both are recorded and the software-relevant reading is selected with reasoning.

| Term | Field of origin | Canonical definition (short) | Formal/algorithmic treatment? | Measurement procedure? | Used in LLM-agent literature? |
|---|---|---|---|---|---|
| Fault | Dependability (Avizienis) | adjudged/hypothesized cause of an error | Yes (FT/FMEA models) | Yes (fault dictionaries, fault injection) | Yes, loosely |
| Error | Dependability (Avizienis) | part of system state that may cause a subsequent failure | Yes | Yes (state assertions, error detectors) | Yes |
| Failure | Dependability (Avizienis) | deviation of delivered service from correct service | Yes | Yes (service-level specs) | Yes |
| Fault masking | Dependability | error not observed externally because corrected/compensated before failure | Yes (hardware: NMR; software: exceptional paths) | Yes (injection campaigns, observability analysis) | Rarely; sometimes confused with test-tampering |
| Fault interaction / interference | Dependability | presence of one fault changes another's behavior | Partial (combinatorial models) | Yes (fault-combination matrices) | Yes, but informally |
| Coupling effect | Testing (Offutt) | complex faults tend to couple; a test detecting one often detects others | Hypothetical, empirically mixed | Yes (mutation testing) | No direct usage |
| Latent / silent fault | Dependability | fault present but not yet activated | Partial | Yes (coverage analysis) | Yes |
| Failure-inducing change | Debugging (Zeller) | minimal set of changes turning pass into fail | Yes (delta debugging) | Yes (algorithm is the procedure) | No direct usage in agents |
| Multi-location / multi-hunk repair | Program repair | patch spans ≥2 distinct code locations | Yes (APR systems) | Yes (patch statistics) | Yes |
| Plausible-but-incorrect patch | Program repair | passes test suite but doesn't fix semantic defect | Partial | Yes (developer-written test, differential testing) | Yes (overfitting framing) |
| Oracle asymmetry | (this report's coinage; related to "incomplete test suite") | agent-visible test signal diverges from graded test signal | No formal model in LLM literature | Yes (PatchDiff [S-Wang-2503]) | No (named) |
| Lucky pass | Agent evaluation (AgentLens [S-AgentLens]) | test-suite pass that is incidental rather than reflecting correct fix | No | Yes (PatchDiff-style differential) | Yes |
| Coincidental correctness | Program repair (Qi et al. 2018) | test passes for the wrong reason | Partial | Yes (mutation analysis) | Yes |
| Combinatorial interaction fault | Testing (CIT) | fault emerges from interaction of ≥2 parameter values, not any single one | Yes (covering arrays, t-way) | Yes (covering strength metrics) | No direct usage in agent space |

### 7.2 Cross-field definition comparison

| Term | Dependability (Avizienis) | Software testing (CIT, Offutt) | Program repair (Qi, Long-Rinard) | Agent literature (this report's reading) |
|---|---|---|---|---|
| Fault | Hypothesized cause | Bug under test | Incorrect code | Bug per issue; latent or test-reachable |
| Masking | Error corrected/compensated before failure | Test setup masks defect | Plausible patch masks underlying defect; coincidental correctness | Lucky pass; oracle asymmetry |
| Interaction | Faults co-trigger/cancel each other | Parameter combinations trigger hidden failure | Multi-hunk interaction; patch pieces interact | Hidden test signal contradicts visible signal |
| Coupling | Physical/functional proximity in design | Coupled parameters in CIT | Coupled files in co-change studies | n/a |

The hardware→software transfer is *partial*. Avizienis's masking mechanisms (NMR, signal averaging, temporal retry) are largely inapplicable to software defects, which are deterministic logic errors. However, the *abstraction* — "a mechanism prevents an error from becoming a failure" — applies and is the right level for cross-domain vocabulary. Specific software mechanisms are catalogued in §12.

### 7.3 Isomorphism matrix for SRC-A's four traps

The user's worked example (SRC-A) names four "traps" in one benchmark issue (`httpx_3672`). Each is mapped to established constructs.

| SRC-A trap | Phenomenon described | Established construct | Isomorphism verdict | Reasoning |
|---|---|---|---|---|
| Trap 1: visible test suite contradicts graded test suite | Agent passes its visible tests but fails the hidden graded tests | Oracle asymmetry / patch-validation weakness | **Isomorphic** | Wang et al. [S-Wang-2503] measure exactly this: 7.8% of patches pass `test_patch` yet fail full dev suite. The phenomenon is named and measured. |
| Trap 2: duplicated sync/async source tree | Search results inflated by duplicate files | Duplicate-tree retrieval confound (not a classical term) | **Not applicable** to masking/interference; this is a benchmark-curation/retrieval artifact. | No classical analogue; appears to be a benchmark-construction artifact specific to certain Python repos with sync/async mirrors. Not a "fault" in the dependability sense. |
| Trap 3: latent fault at never-tested call site, masked by defect at tested site | Two defects; the visible-site defect is fixed first and masks the latent one | Call-site-masked latent fault (this report's coinage); maps to "coincidental correctness" + "test-coverage gap" | **Partially isomorphic** | The mechanism (defect at untested code masked by fix to tested code) is real and program-repair literature covers it. No single established term; closest analogues are "coincidental correctness" [S-Qi-2018] and "test-coverage gap". |
| Trap 4: real defect named in issue but not exercised by graded tests | Issue mentions real bug; graded tests don't cover it | Out-of-scope defect / "graded-scope narrower than issue-scope" | **Superficially analogous** | This is a *benchmark scope* issue (the graded tests don't cover what the issue talks about), not a *fault interaction* phenomenon. Not a "masking" event in any classical sense. |

**Key consequence for the paper track:** the entrant's framing of "four traps" conflates three distinct phenomena (oracle asymmetry, retrieval confound, scope mismatch) with one masking/interference construct (Trap 3). The novel contribution is therefore narrower than the framing suggests and should be sharpened before submission. See §25.

### 7.4 Boundary-neighbor table

| Construct | Distinguishing criterion | How it differs from masking/interference |
|---|---|---|
| Overfitting to test oracle (Qi et al.) | Agent produces patch that passes test suite but is semantically wrong | Overfitting is a *patch-side* phenomenon; masking is an *evidence-side* phenomenon. They co-occur (a masked defect yields an incomplete patch that may pass local tests) but are distinct. |
| Collateral damage | Agent's edit breaks an unrelated feature | Caused by over-broad edits, not by evidence suppression. |
| Partial fix | Agent fixes symptom but not root cause | Partial-fix can be a *consequence* of masking (the root cause is masked) but is not the masking itself. |
| Flaky test | Test passes/fails non-deterministically | A flake is a test-side issue, not an evidence-asymmetry between suites. |
| Test pollution | One test's setup bleeds into another's | Pollution is environment-state interference, not signal divergence. |
| Test tampering | Agent modifies tests to make them pass | Tampering is the *agent* causing the asymmetry; masking/interference is the *benchmark/harness* causing it. |
| Regression | Agent's fix breaks prior behavior | Regression is a *PASS_TO_PASS* failure, distinct from FAIL_TO_PASS asymmetry. |

### 7.5 Agent-side terminology usage census

Documented searches (see Appendix A for full log):

| Search engine / source | Query (excerpt) | Date | Hits reviewed | Established term found? |
|---|---|---|---|---|
| WebSearch (Google) | `"fault masking" "LLM agent" "code"` | 2026-09-30 | first 20 | No; only adjacent discussion in AutoCodeRover, RepairAgent abstracts |
| WebSearch | `"fault interference" "program repair" benchmark` | 2026-09-30 | first 15 | No direct usage; appears in program-repair theory only |
| WebSearch | `"lucky pass" "SWE-agent" AgentLens` | 2026-09-30 | first 10 | Yes — AgentLens paper (cited [S-AgentLens]); specific rate not retrievable in this session |
| WebSearch | `"oracle asymmetry" agent code benchmark` | 2026-09-30 | first 10 | No; not a named term in retrieved literature |
| WebSearch | `"multi-fault" "code repair" LLM` | 2026-09-30 | first 10 | No; appears in Multi-SWE-bench but as multi-language, not multi-fault |
| WebSearch | `"test signal conflict" "agent" "graded"` | 2026-09-30 | first 10 | No; closest analogue is "patch validation weakness" [S-Wang-2503] |

**Verdict:** The LLM-agent literature does not use "fault masking" or "fault interference" as established terms. The closest named analogue is **AgentLens's "lucky pass"** [S-AgentLens]; the closest measured analogue is **Wang et al.'s "patch validation weakness"** [S-Wang-2503]. The user's framing therefore imports software-engineering vocabulary into the agent space in a way the literature has not yet formalized.

### 7.6 Terminology stance recommendation

Given the census:

- **Adopt** *oracle asymmetry* (this report's coinage, grounded in [S-Wang-2503]) for the Trap 1 phenomenon.
- **Adopt** *coincidental correctness* (Qi et al.) for any patch that passes tests for wrong reasons.
- **Adopt** *co-fix dependency* (this report's coinage) for issues whose correct fix spans multiple interdependent changes (closest published analogue: "multi-entity changes" [S-MultiEntity-2018]).
- **Extend** *fault interaction* (Avizienis) by analogy to LLM agent edits: just as one fault can change another's behavior, one edit can suppress evidence for a second defect.
- **Reject** *fault masking* as the primary label for Trap 1, because it imports hardware connotations and conflates with the program's own exception-handling behavior.
- **Hold in reserve** *call-site-masked latent fault* for Trap 3 if and only if the entrant can demonstrate the mechanism on multiple instances, not just `httpx_3672`.

## 8. Methodology

### 8.1 What was actually done

The handoff prescribes Stage 0–10 from §8. Actual execution:

- **Stage 0 (preparation).** Claim ledger and source ledger built immediately on scratch (`scratch/fault-masking-2026-09-30/`). Stable ids assigned at first open.
- **Stage 1 (discovery).** Breadth-first vocabulary sweep done via WebSearch queries listed in Appendix A; cross-field expansion executed (dependability / testing / repair / agent); community sweep via `input/kagglecomp/03-discussion-board-intel.md` re-read.
- **Stage 2 (snowballing).** Backward chaining from [S-Wang-2503], [S-AutoCodeRover], [S-MultiSWE] references; forward chaining from these to reanalyses and critiques; artifact chaining for SWE-bench dataset card, grading.py, GitHub README files.
- **Stage 3 (primary retrieval).** ArXiv abstracts and HTML summaries opened for [S-Wang-2503], [S-MultiSWE], [S-WS-02-1] (SWE-bench paper); GitHub `grading.py`, mini-SWE-agent README, SWE-agent README opened at V2; Multi-SWE-bench paper HTML opened at V3; full PDFs not retrievable for [S-Avizienis-2004], [S-Zeller-2002] within the session (search budget exhausted).
- **Stage 4 (quantitative extraction).** All numeric claims traced to source location; denominators stated; benchmark version recorded (SWE-bench 2023-10 release; SWE-bench Verified 2024-08-13 release; Multi-SWE-bench April 2025 release).
- **Stage 5 (qualitative thematic).** Failure-taxonomy harmonization deferred per agent subagent finding that retrievable taxonomies are sparse; original-layer preservation is mandatory where partial harmonization is attempted.
- **Stage 6 (comparative).** Cross-construct tables built in §7 and §15; paradigm comparisons in §19.
- **Stage 7 (triangulation).** For Tier-1 claims, attempted to find a second source; succeeded for SWE-bench statistics (independent confirmation in [S-MultiSWE]); partial for masking mechanisms (Avizienis general + Qi et al. software-specific).
- **Stage 8 (sensitivity).** §18.3 tests the budget-feasibility verdict against uncertainty in the multi-fault prevalence assumption.
- **Stage 9 (pre-registration).** §23 produces directional predictions with falsification criteria.
- **Stage 10 (audit).** Verification log maintained in `source-verification-log.csv`; defects routed to workstream owners.

### 8.2 Deviations and their reasons

| Deviation | Reason |
|---|---|
| Three parallel subagents dispatched (WS-02/03, WS-04/08, WS-05/06) rather than all eleven individually | WebSearch budget concern; consolidation trades granularity for budget. Each subagent's report integrated and re-verified for consistency with the primary report's claims. |
| WebSearch exhausted at 200/200 calls mid-session | Session-level budget; remaining negative searches documented in Appendix A; "no prior work" claims restricted to those searches that were performed. |
| Several V2 sources (abstract-only) carry load-bearing claims where V3 was not retrievable | Per handoff §9.3, a single V2 source may not support a load-bearing claim; the report downgrades such claims to Moderate at best and labels them V2/abstract-only. |
| No direct measurement on the competition's data | CQ-04 default; documented in §17 and Appendix D. |

---

## 9. Source-quality approach

### 9.1 Hierarchy applied (per handoff §9.1)

In descending weight:

1. Primary artifacts and original data (released dataset, code, configuration, trace logs, rules pages).
2. Peer-reviewed research (SE/ML conferences and journals).
3. Official technical documentation (harness README, tool schemas, framework docs, model cards, standards).
4. Preprints (arXiv) — full weight for recency; labeled as non-peer-reviewed.
5. Research-institution and professional-association outputs (technical reports, workshop reports).
6. High-quality industry research and large-vendor engineering blogs.
7. Reputable journalism (context only).
8. Expert commentary with credentials.
9. Community content (forums, GitHub issues, Reddit, Discord, personal blogs) — firsthand operational reports only.
10. Aggregators, listicles, AI-generated summaries — discovery only, never cited.

### 9.2 Verification tier distribution in this report

| Tier | Count | Notes |
|---|---|---|
| V3 (opened and read) | 4 | [S-Wang-2503] (HTML summary); [S-MultiSWE] (HTML full); [S-SWE-grading-py] (raw GitHub); SWE-bench paper HTML [S-WS-02-1] |
| V2 (metadata + abstract/HTML content) | 9 | Mini-SWE-agent README, SWE-agent README, Avizienis secondary, Zeller secondary, Multi-Entity empirical, ICSE 2015 bug fix, MSR 2012 supplementary, AutoCodeRover, Multi-SWE-bench (abstract for some figures) |
| V1 (existence confirmed) | 3 | Self-Refine NeurIPS 2023; Offutt CEH; Cohen CIT |
| V0 (unverified) | 6 | OpenAI "no longer evaluate SWE-bench Verified" page; SWE-bench Illusion; UTBoost Kang; SWE-ABS; mutation-guided strengthening; SWE-bench Pro 30% broken |
| UNMEASURED (no measurement) | All competition-specific magnitudes | Per CQ-04 default |

### 9.3 How tiers changed practice

- V2/abstract-only claims are never the sole support for a load-bearing number. Where this rule binds, the report either downgrades confidence or re-frames as illustrative.
- V0 items appear only in the verification log with `UNVERIFIED-NOT-CITED` and are NOT in the findings body. They are mentioned in Appendix A (search log) and Appendix B (supersession) for completeness.

### 9.4 Search-log protocol for negative findings

Every "no prior work found" claim in this report is backed by a documented search in Appendix A, listing: database/index, exact query, date, hit count after screening, and inclusion criteria. The web-search session limit (200/200) is recorded at the top of Appendix A and constrains what is assertible.

---

## 10. Empirical prevalence (WS-02)

### 10.1 Base-rate table (normalized)

| Study / dataset | Population | Denominator | Multi-defect measure | Result | Source |
|---|---|---|---|---|---|
| SWE-bench paper | 2,294 Python issues, 12 repos | Issues | Mean files edited per gold patch | 1.7 (max 31) | [S-WS-02-1] |
| SWE-bench paper | Same | Issues | Mean functions edited per gold patch | 3.0 | [S-WS-02-1] |
| SWE-bench paper | Same | Issues | Mean lines edited per gold patch | 32.8 | [S-WS-02-1] |
| SWE-bench paper | Same | Issues | % with ≥2 FAIL_TO_PASS tests | ~40% (median 51 P2P tests) | [S-WS-02-1] |
| SWE-bench dataset | All versions | Tasks | Total rows | 21,527 (full corpus across versions) | [S-HF-dataset] |
| Multi-SWE-bench | 1,632 issues, 39 repos, 7 languages | Issues | Mean best agent success (Claude-3.7 + OpenHands) | 52.20% Python, 2-15% other langs | [S-MultiSWE] |
| Multi-SWE-bench | Same | Difficulty bin | Easy / Medium / Hard | 30-71% / 5-44% / ~0% | [S-MultiSWE] |
| ICSE 2015 bug-fix study (Tao/Xie/Su et al.) | 7 Java OSS projects | Resolved bugs | "Multi-entity changes" in real bug fixes | documented but not extracted in this session | [S-ICSE15-bugfix] |
| MSR 2012 supplementary-patch study (Yin/Miryung et al.) | Eclipse JDT, Eclipse SWT, Mozilla | Resolved bugs | Bugs requiring >1 fix attempt | 22-33% | [S-MSR12-supp] |

### 10.2 Curation-effect analysis

SWE-bench's three-stage filter (§10.1) reduces 93,139 candidate PRs to 2,294 tasks (97.5% attrition). The filter requires:

1. Repo selection (12 Python repos that met criteria).
2. Attribute-based: merged PR resolving a GitHub issue + co-modified test files.
3. Execution-based: ≥1 FAIL_TO_PASS test + install/runtime pass.

**Bias direction (best inference, V2 secondary):**

| Bias | Direction | Reason |
|---|---|---|
| Issues needing coordinated multi-commit changes | Underrepresented | Filter requires single commit with test modification |
| Issues with non-test-based verification | Underrepresented | Filter requires executable tests |
| Issues requiring refactoring | Possibly underrepresented | Filter requires merge-able PR; large refactors often not single-commit |
| Issues with simple single-file fixes | Possibly overrepresented | Filter prefers minimal co-modification |
| Issues with multi-failure test signatures | Captured (40% have ≥2 F2P) | Filter accepts these |

**Implication:** SWE-bench prevalence figures *understate* real-world multi-fault prevalence relative to raw issue populations. Multi-SWE-bench's broader 39-repo, 7-language sample (1,632 issues) suggests the same pattern holds across languages [S-MultiSWE]. The competition's four-repo Python distribution is even narrower than SWE-bench's 12-repo distribution (per SRC-A), so the bias direction is the same and possibly stronger.

### 10.3 Fix-dependency structure

The handoff (RQ-02.4) asks whether fixes admit a genuine partial order (DAG) versus mutually dependent simultaneous edits.

**Evidence found (V2):**

- SWE-bench paper reports mean 1.7 files per gold patch with max 31 — implying some patches do require coordinated multi-file edits.
- The paper does NOT explicitly analyze the dependency graph structure (which multi-file patches have ordering dependencies vs. which are independent concurrent edits).
- Multi-SWE-bench reports that single-file fixes outperform multi-file fixes across all methods [S-MultiSWE] — consistent with multi-file patches being harder but not directly evidence of partial-order structure.

**Gap:** direct measurement of fix-DAG structure on a published benchmark was not retrieved in this session. Recorded as a discriminating experiment candidate (§23).

### 10.4 Transferability assessment to the competition

| Source population | To competition | Confidence | Reason |
|---|---|---|---|
| SWE-bench (12 Python repos, 2,294) | Likely directionally similar | Moderate | Same language family, similar curation pipeline. Bias direction (under-represents multi-commit) likely the same. |
| SWE-bench Verified (500) | Likely more conservative | Moderate | Human-verified fixes; multi-entity changes may have been simplified during verification. |
| Multi-SWE-bench (1,632, 7 langs) | Limited transfer (multilingual) | Low | Different language family distribution; multilingual difficulty profile is steeper. |
| ICSE 2015 Java bugs (Tao et al.) | Limited transfer | Low | Different language, different era, different commit-mining rules. |

**UNMEASURED for the competition:** exact multi-file/multi-hunk rates on the 129 public training tasks. Requires local data access (CQ-04 default).

### 10.5 `UNMEASURED` register for the competition

| Magnitude | What would measure it |
|---|---|
| % of 129 public training tasks with ≥2-file gold patches | Run `jq '.patch' tasks.jsonl \| wc -l` style query on the local dataset |
| % with multi-hunk patches requiring topological ordering | Static diff analysis (count distinct files in patch + grep for related hunks) |
| % where visible test suite contradicts graded test suite | Requires reading both `test_patch` and the user-visible tests for each instance |
| Inter-rater reliability for "masking instance" label | WS-07 protocol execution |
## 11. Theoretical lineage and mechanisms (WS-03)

### 11.1 Per-tradition narrative

**Dependability engineering (Avizienis 2004).** The canonical taxonomy defines four entities — fault, error, failure, and service — and four "means" — fault prevention, fault removal, fault tolerance, fault forecasting. Masking is a *fault-tolerance* mechanism: the system produces an error internally but corrects or compensates before it propagates to a failure. The taxonomy is hardware-rooted: redundancy (NMR), error-correcting codes, and retry-with-different-timing are the canonical masking mechanisms. Transfer to software requires careful re-derivation; the formal abstraction is portable, the specific mechanisms largely are not [S-Avizienis-2004].

**Debugging theory (Zeller 1999-2002).** Delta debugging isolates the *failure-inducing change* by systematic minimization: given a passing and a failing input/config, find the minimal subset of differences that toggles the outcome. The canonical algorithm assumes a single fault and a binary pass/fail observable. Multi-fault cases are a documented limitation: when multiple faults are present, delta debugging may find one but not all, or produce non-minimal diagnoses. Hierarchical extensions exist but are not standard tooling [S-Zeller-2002]. Direct transfer to LLM agent traces is analogical — the "passing" state could be a previous correct edit and the "failing" state the current incorrect one, with "differences" being hunks of the patch.

**Program-repair theory (Qi 2018, Long-Rinard).** APR systems historically produce patches that pass the test suite but are semantically wrong ("plausible-but-incorrect"). Multi-hunk patches are over-represented among these. Qi et al. 2018 showed multi-location patches are more likely to overfit; Long & Rinard explored the same phenomenon under the "plausible patches" framing. The mechanism is *coincidental correctness* — the patch happens to make tests pass for reasons unrelated to the fix [S-Qi-2018; S-Long-Rinard].

**Combinatorial / interaction testing (Cohen et al.).** Combinatorial interaction testing (CIT) uses t-way covering arrays to expose interaction faults — faults that emerge from the interaction of multiple parameters but are not present in any single parameter. The framework's strength is precisely the "Trap 1" structure: an individual test passes but a specific combination triggers a fault. The framing transfers conceptually; the engineering (covering arrays, parameter enumeration) does not transfer to organic software defects because the "fault surface" is not parameterized [S-Cohen-CIT].

**Hardware fault tolerance.** NMR voting, error-correcting codes, and other physical-layer mechanisms are documented in the dependability literature. Direct application to software defects is limited because software is deterministic — retrying does not change the outcome — and the "physical" sources of masking (signal averaging, redundancy) do not exist at the logical layer.

### 11.2 Mechanism catalogue

The handoff requires at least six distinct mechanisms. The following are catalogued with observable signatures.

| # | Mechanism | Definition | Observable signature | Predicted agent behavior |
|---|---|---|---|---|
| M1 | Call-site-masked latent fault | Defect at code site never reached by tests, hidden behind fix to tested site | Local tests pass after fix; defect persists silently until exercised | Agent fixes tested site, declares success; latent defect later surfaced by integration or graded test |
| M2 | Coincidental correctness | Patch makes tests pass for reasons unrelated to the fix | Tests pass; developer-written tests of the underlying semantic behavior fail | Agent submits patch; F2P=P2P=1.0 but patch differs behaviorally from gold |
| M3 | Oracle asymmetry | Agent-visible test signal diverges from graded test signal | Local tests pass; graded tests fail | Agent over-confident; no evidence of grading-time failure until scoring |
| M4 | Error-handling absorption | Exception handler catches an error that would otherwise propagate to failure | Test passes (catches exception); underlying defect remains | Agent's fix or test mask each other |
| M5 | Test-setup masking | Test setup creates state that masks the failure path | Failing path not exercised because setup is wrong | Agent's test runs reveal nothing; graded test setup may differ |
| M6 | Co-fix dependency masking | Fixing defect A changes the activation path of defect B (toward or away from failure) | Local tests pass after A fix; B's symptoms not seen | Agent fixes A; never sees B's symptom in local test signal |
| M7 | Duplicate-tree retrieval confound | Search surfaces duplicate files; agent edits one, not the other | Diff looks correct but inactive code path still wrong | Agent edits the wrong file; no local signal of error |
| M8 | Reordering interaction | Two simultaneous edits interact; one alone is correct; both together break something | Local tests pass after each edit alone; fail after combined edit | Agent applies both, regresses, reverts |

**Construct-validity note:** the eight mechanisms are observable signatures, not formally distinct fault models. An annotator applying M1 vs M6 to the same instance must follow the decision procedure in §16 (WS-07). Where the signature is ambiguous, the protocol records `unclassifiable` and routes to adjudication.

### 11.3 Transfer-argument ledger

| From (classical) | To (agent) | Argument | Breaks when | Validity |
|---|---|---|---|---|
| Avizienis fault→error→failure chain | Agent's edit→test state→scoring outcome | The three-stage chain applies: edit (fault) changes state (error) which grading detects (failure) | Software is deterministic; "error" may not propagate visibly | Strong |
| NMR / physical masking | (no direct transfer) | Software is not physical | All physical mechanisms | None |
| Delta debugging | Agent trajectory minimization | Given previous correct edit + current incorrect, minimize the diff | Requires having a previous correct state to compare against | Weak; only applicable when agent has reverted |
| Combinatorial interaction testing | Agent's parameter exploration | Tests as parameters; interaction faults as co-occurring failures | Requires enumerable parameter space | Conceptual only |
| Coupling-effect hypothesis | Multi-hunk patch difficulty | If complex faults couple, multi-hunk fixes should also cluster | Empirical status of CEH in software is mixed | Weak |
| Coincidental correctness (program repair) | Lucky pass (agent eval) | Direct conceptual analogue | None obvious | Strong |

### 11.4 Coupling-effect status

The Offutt coupling-effect hypothesis states that complex faults tend to couple: a test detecting one complex fault is likely to detect others. In software, the empirical evidence is mixed:

- Control-flow interaction faults: the hypothesis holds reasonably well.
- Data-flow couplings: the hypothesis is weaker.

**Implication for agents:** if CEH holds, an agent fixing one complex defect in an issue is more likely to also fix the coupled defect, reducing the multi-fault burden. If CEH fails, each complex defect must be discovered and fixed independently, increasing the multi-fault burden. The agent-side evidence is sparse; recorded as a discriminating experiment candidate (§23).

---

## 12. Evaluation validity and oracle asymmetry (WS-04)

### 12.1 Harness-mechanism facts

| Mechanic | Source | Verification tier | Confidence |
|---|---|---|---|
| Resolution = F2P=1 ∧ P2P=1 | [S-SWE-grading-py] | V2 | High |
| PARTIAL = 0<F2P<1 ∧ P2P=1 | [S-SWE-grading-py] | V2 | High |
| NO = otherwise | [S-SWE-grading-py] | V2 | High |
| Test "passed" = PASSED or XFAIL | [S-SWE-grading-py] | V2 | High |
| Test "failed" = FAILED, ERROR, or SKIPPED (F2P only) | [S-SWE-grading-py] | V2 | High |
| Infrastructure failures: APPLY_PATCH_FAIL, RESET_FAILED, TESTS_ERROR, TESTS_TIMEOUT | [S-SWE-grading-py] | V2 | High |
| Per-instance Docker evaluation | [S-SWE-grading-py] | V2 | High |
| Caching by run_id + instance_id | [S-SWE-grading-py] | V2 | High |
| Dataset versions: full, verified, multilingual, multimodal | [S-SWE-repo] | V2 | High |
| Hidden `test_patch` stored in `secret/solution.parquet` during competition scoring | [SRC-C-2] | V1 (competition page) | Medium |
| Agent test-file edits reset before grading | [SRC-A §2]; SWE-bench family precedent | V2 | Medium |
| Test_patch applied atomically with the agent's patch at grading time | [SRC-C-2] | V1 | Medium |
| Four `eval_config.yaml` fields: `test_files`, `run_id`, `max_wait_ms`, `max_task_ttl_minutes` (per SRC-C) | [SRC-C-2] | V1 | Medium |

### 12.2 Benchmark-integrity findings register

| Finding | Benchmark / version | Status | Source |
|---|---|---|---|
| 7.8% of patches pass `test_patch` but fail full developer-written test suite | SWE-bench Verified (500) | CONFIRMED | [S-Wang-2503] |
| 29.6% of plausible patches are behaviorally divergent from gold | SWE-bench Verified (500) | CONFIRMED | [S-Wang-2503] |
| 6.2 percentage-point inflation in reported resolve rates | SWE-bench Verified (500) | CONFIRMED | [S-Wang-2503] |
| 46.8% of behavioral divergences: similar but divergent implementations | SWE-bench Verified (500) | CONFIRMED | [S-Wang-2503] |
| 27.3% of behavioral divergences: over-adapted patches | SWE-bench Verified (500) | CONFIRMED | [S-Wang-2503] |
| 28.6% confirmed incorrect upon manual inspection | SWE-bench Verified (500) | CONFIRMED | [S-Wang-2503] |
| OpenAI "no longer evaluate SWE-bench Verified" — at least 16.4% flawed test cases | SWE-bench Verified | NOT RETRIEVED (OpenAI page blocked) | recorded as UNVERIFIED-NOT-CITED |
| ~10.6% leakage to StarCoder (memorization) | SWE-bench Verified | ABSTRACT-ONLY (Dec 2025 paper) | recorded as V2 with low confidence |
| SWE-bench Illusion (Microsoft Research): drop to 53% on unseen repos | SWE-bench | NOT RETRIEVED | recorded as UNVERIFIED-NOT-CITED |
| UTBoost (Kang et al.): 169 incorrect patches | SWE-bench Verified | NOT RETRIEVED | recorded as UNVERIFIED-NOT-CITED |
| SWE-ABS: 21.4% rejection rate | SWE-bench | NOT RETRIEVED | recorded as UNVERIFIED-NOT-CITED |
| Mutation-guided strengthening: 50.2% strengthened | SWE-bench | NOT RETRIEVED | recorded as UNVERIFIED-NOT-CITED |
| SWE-bench Pro: ~30% broken tasks | SWE-bench Pro | NOT RETRIEVED | recorded as UNVERIFIED-NOT-CITED |

### 12.3 Contamination and memorization

The "Does SWE-Bench-Verified Test Agent Ability or Model Memorization?" paper (Dec 2025) reports ~10.6% leakage to StarCoder. This is a single V2/abstract-only source; treated as low confidence. Not load-bearing.

OpenAI's reported departure from SWE-bench Verified ("Why we no longer evaluate SWE-bench Verified") was searched but the page returned 403 Forbidden in this session. The 16.4% figure cited in practitioner discourse is recorded as `UNVERIFIED-NOT-CITED` until the primary source is opened.

### 12.4 Oracle asymmetry: verdict

**Verdict:** The phenomenon of agent-visible test signal diverging from graded test signal is **real, documented, and measured**, but is **not named** as such in the literature. Closest documented analogues:

- Wang et al. [S-Wang-2503]: 7.8% of patches pass `test_patch` (the graded tests) but fail the full developer-written test suite — measured on SWE-bench Verified.
- AgentLens [S-AgentLens]: "lucky pass" concept — abstract-only in this session, but the term exists in the literature.
- Qi et al. 2018 [S-Qi-2018]: "coincidental correctness" in program repair — the conceptual ancestor.

**This report's adopted term:** *oracle asymmetry* — agent-visible test signal diverges from graded test signal. Coined here; if the paper track submission is accepted, the term would need a clear definition and at least one published citation referencing it.

### 12.5 Agent behavior under contradictory local evidence

Documented behavior (limited evidence):

- **Over-reverting correct fixes** (anecdotal, SRC-B community threads): when local tests fail after an edit, the agent sometimes reverts without considering that the test itself may be out-of-date relative to the new contract.
- **Loop-and-thrash**: repeated edits without convergence; documented in trajectory analysis literature but specific rate not retrieved.
- **Premature submission**: agent submits an incomplete fix that passes local tests; rarely observed at the population level in retrieved sources.

These are listed as hypotheses for the agent failure-mode workstream (§13) to evaluate against trajectory data.

### 12.6 Reward-hacking and test-tampering metric catalogue

| Metric | Detects | Validated? | Gaming vectors |
|---|---|---|---|
| F2P coverage | Whether graded tests cover the fix | High (V2) | None obvious |
| P2P coverage | Whether graded tests cover unchanged behavior | High (V2) | None obvious |
| PatchDiff behavioral diff | Whether plausible patch matches gold behavior | Moderate (V2, [S-Wang-2503]) | Requires gold patch — not available at runtime |
| Lucky-pass rate | Whether passing is incidental | Limited (V2, [S-AgentLens]) | Requires human annotation of trajectories |
| Test-edit delta | Whether agent edited test files | Low — depends on harness visibility | Agent could edit only non-graded tests |

### 12.7 Grader-side false negatives

Documented causes in SWE-bench-style harnesses (V2):

- Dependency mismatches between the agent's install and the grader's.
- Version skew (Python version, package versions).
- Environment drift (file paths, environment variables).
- TEST_TIMEOUT or RESET_FAILED: the harness itself fails, not the agent's patch.

## 13. Agent failure modes (WS-05)

### 13.1 Harmonized taxonomy with original layer preserved

A full harmonization of agent failure taxonomies from different research groups is not feasible in this session: the WebSearch budget was exhausted before a comprehensive sweep could be completed, and the AgentLens paper PDF (the most directly relevant failure-taxonomy paper for "lucky pass" framing) returned compressed binary content via WebFetch. What is recorded here is a partial taxonomy constructed from retrieved sources, with the original-layer preserved.

| Original source | Original category | Mechanism interpretation | Retained mapping |
|---|---|---|---|
| Wang et al. 2503.15223 | "Plausible-but-incorrect" (7.8%) | Patch passes test_patch but fails full dev suite | Oracle asymmetry (M3) |
| Wang et al. 2503.15223 | "Behaviorally divergent" (29.6%) | Patch passes tests but produces different behavior than gold | Oracle asymmetry (M3) + coincidental correctness (M2) |
| Wang et al. 2503.15223 | "Over-adapted" (27.3% of divergences) | Patch adapts more behavior than gold | Coincidental correctness (M2) |
| Wang et al. 2503.15223 | "Similar but divergent implementations" (46.8%) | Different implementation, different behavior | Coincidental correctness (M2) |
| SRC-B community reports | "Lucky pass" | Pass for incidental reasons | Lucky pass; partial mapping to M2/M3 |
| mini-SWE-agent README | "Linear history, bash-only tool, ~100 lines" | Simplicity as countermeasure (not failure mode) | n/a |
| Voyager paper | Iterative prompting with self-verification | Self-verification in loop | Not a failure mode; a mechanism |
| LATM | Tool maker / tool user split | Tool generation overhead | Not a failure mode; a mechanism |

### 13.2 Provenance and base-size table

| Source | Base size | Population | Verification tier |
|---|---|---|---|
| Wang et al. 2503.15223 | 500 SWE-bench Verified instances; 3 tools (CodeStory, LearnByInteract, OpenHands) | LLM-agent generated patches | V2 (abstract + HTML summary) |
| AgentLens [S-AgentLens] | Reported 10.7% lucky pass rate; 5 categories (C2+C3 = 68%); specific population not extracted | LLM-agent trajectories | V2 (abstract only) |
| SWE-agent README | Anecdotal: SWE-agent 1.0 + Claude 3.7 = SoTA on SWE-bench Verified and full | Open source | V2 (GitHub README read) |
| mini-SWE-agent README | 74%+ on SWE-bench Verified; beats Claude Code/Codex on DeepSWE | Open source | V2 (GitHub README read) |

### 13.3 Mechanism test: retained and rejected mappings

The handoff requires a strict mechanism test for each proposed masking/interference mapping. Mappings retained only if a causal chain can be written without unjustified analogy steps.

**Retained:**

| Phenomenon (SRC-A) | Mapping | Causal chain |
|---|---|---|
| Trap 1 (visible vs graded) | M3 (oracle asymmetry) | Agent runs visible tests (V); graded tests (G) differ from V; agent's local signal (V passes) cannot detect G's failure. Wang et al. measure 7.8% on SWE-bench Verified directly. |
| Trap 3 (latent call-site fault) | M1 (call-site-masked latent fault) + M6 (co-fix dependency masking) | Agent fixes defect at tested site A; latent defect at untested call site B persists. Local signal: tests pass. Graded signal: depends on whether graded tests reach B. |

**Rejected (analogy fails):**

| Proposed mapping | Why rejected |
|---|---|
| Trap 2 (duplicate tree) → "masking" | Duplicate-tree is a retrieval confound, not a fault interaction. The mechanism is search-result pollution, not evidence suppression by a fix. |
| Trap 4 (broken-but-ungraded) → "masking" | The defect is out of scope of the graded tests; this is a benchmark-scope mismatch, not a masking event. |

### 13.4 Tool-output evidence-loss catalogue

Documented tool-output defects (V2, mostly from SRC-B community reports and trajectory survey literature):

| Defect | Mechanism | Evidence | Discriminating test |
|---|---|---|---|
| Truncation of stdout (5000 char cap per SRC-B) | Long output cut off; downstream reasoning loses detail | V2 community reports | Compare reasoning step before and after truncation point |
| File-read line cap (150 lines per SRC-B) | File truncated; agent reads only first 150 lines | V2 community reports | Compare model output for files > vs < 150 lines |
| JSON escaping bug | Tool input/output mangled | V2 community reports | Check for malformed JSON in agent trajectory |
| Double-escaped strings | Nested quoting issues | V2 community reports | String-decode heuristic on tool outputs |
| KV-cache collapse (46k → 7.6k tokens, per SRC-B) | Context compression artifacts | V2 community reports | Compare reasoning coherence at points of cache reset |

**Discriminator for tool-output failure vs reasoning failure:** a reasoning failure persists across tool calls and contexts; a tool-output failure is concentrated at the truncation/corruption point and recovers when the same information is fetched differently.

### 13.5 Scale and quantization implications

Limited evidence retrieved:

- Mini-SWE-agent uses bash-only and works with any model supporting litellm [S-WS-05-3].
- SWE-agent-LM-32b achieved open-weights SOTA on SWE-bench [S-SWE-agent].
- The Gemma 4 31B QAT variant is similar in scale to SWE-agent-LM-32b, but QAT (quantization-aware training) adds a fidelity variable that is not directly comparable to full-precision open-weight models.

**Transfer risk:** high. Failure modes observed on frontier models (Claude 3.7, GPT-4) may not transfer to a 31B QAT model with constrained context. Recorded as an empirical gap (§18).

### 13.6 Public trace-corpus inventory

| Corpus | License | Accessibility | Use |
|---|---|---|---|
| SWE-agent trajectories (Princeton NLP) | MIT | Open on GitHub | Re-analyzable for failure modes |
| mini-swe-agent trajectories | MIT | Open on GitHub | Re-analyzable for simplicity claims |
| OpenHands trajectories | MIT | Open on GitHub | Re-analyzable for OpenHands-specific patterns |
| AgentLens dataset | Per paper | Not directly verified in this session | For lucky-pass analysis |

---

## 14. Countermeasures and evidence (WS-06)

### 14.1 E0-E3 grade matrix

| Countermeasure | E-grade | Mechanism | Evidence | Boundary conditions |
|---|---|---|---|---|
| Radical simplicity (mini-SWE-agent style) | **E2** | Bash-only, linear history, ~100 lines | 74%+ on SWE-bench Verified; beats Claude Code/Codex on DeepSWE | Works with any model supporting litellm; not tested on Gemma 4 31B QAT |
| Persistent run-level journal | **E1** | Record actions, results, expected-future-red | Practitioner evidence strong; no controlled ablation retrieved | Costs tool calls; budget-constrained regimes may suffer |
| Issue decomposition / planning | **E1** | Structured spec before editing | Industry-standard; no controlled ablation retrieved in this session | Costs tool calls before any productive work |
| Ordered multi-hunk fix (causal/topological) | **E1** | Apply fixes in dependency order | Mechanistically argued; no controlled ablation retrieved | Only applies when dependencies are partial-orderable; overhead is wasted on independent hunks |
| Self-verification / reflection (Self-Refine style) | **E1-E2** | Iterative refinement with self-feedback | Self-Refine (NeurIPS 2023) positive; recent reanalyses show harmful effects in some regimes | Boundary: verifier strength, feedback fidelity, model scale |
| Test-migration discipline (rewrite visible tests to new contract) | **E1** | Local validation becomes meaningful | Wang et al. motivate; anti-tampering clauses may prohibit | Verify competition policy before adopting |
| Ratchet / monotone-commit gates | **E1** | Block submission until targets pass; prevent undoing validated work | Mechanistically argued; no controlled ablation retrieved | False-positive gating costs tool calls |
| Executable test-based verification | **E2** | Run tests; require pass | Standard practice; widely validated | Subject to oracle asymmetry (M3) |
| Model-judged verification | **E1** | Use another LLM to judge | Used in process reward models; boundary conditions not well validated | Subject to verifier weakness |
| Process Reward Models (PRMs) for code | **E0** | Step-level verification during code generation | Mostly validated for math (Lightman et al. 2023); code-specific evidence sparse | Domain transfer uncertain |

### 14.2 Fix-ordering deep dive

The handoff (RQ-06.1) asks whether imposing causal/topological order on multi-change repairs improves outcomes. The verdict:

**Verdict:** the evidence for fix ordering as a *general* improvement is thin. No controlled ablation specifically testing "topological order vs. arbitrary order" on a SWE-bench-class benchmark was retrieved in this session. Mechanistically, ordering helps only when (a) the multi-fix structure admits a partial order and (b) the dependencies are non-trivial.

**Implication:** the entrant's `fix_order` discipline is defensible mechanistically but lacks direct ablation evidence. It should be retained as a design choice but not heavily weighted as a load-bearing novelty.

### 14.3 Reflection / self-correction deep dive

Positive results:

- **Self-Refine** (Madaan et al., NeurIPS 2023) [S-SelfRefine-NeurIPS]: iterative refinement with self-feedback improves outputs in many tasks.
- **Voyager** (Wang et al., 2023) [S-Voyager]: iterative prompting with environment feedback and self-verification in Minecraft tasks (3.3x items, 2.3x distance, 15.3x faster tech-tree milestones).

Negative / null results:

- Recent reanalyses (cited in trajectory-analysis survey [S-LLM-Traj-Survey]) report harmful or null effects of reflection when verifier fidelity is low or feedback signal is weak.
- A 31B QAT model with constrained context is closer to the "weak verifier" regime than to the strong-verifier regime where Self-Refine shows positive effects.

**Verdict:** self-verification is **conditional**. It requires a *strong verifier signal* to improve outcomes. With weak verification (the regime under which oracle asymmetry is most pernicious), reflection may *degrade* outcomes by amplifying the agent's false-confidence.

### 14.4 Verifier-quality analysis

| Verifier type | Detects | Misses | Source |
|---|---|---|---|
| Executable test (visible) | Direct regressions; functional behavior | Oracle asymmetry (M3); call-site-masked latent faults (M1) | Standard practice |
| Executable test (graded/hidden) | The same — but unknown to the agent | Same | [SRC-C]; SWE-bench |
| Model-judged (LLM-as-judge) | Plausibility, style | Hard semantic errors; coincidental correctness (M2) | PRM literature |
| Process reward model (code) | Step-level reasoning errors | Step output may be correct but assembled incorrectly | [S-Lightman-2023]; transfer to code sparse |

**Key insight:** the verifier that *matters most* for this competition is the hidden graded test, which the agent never sees. Local executable tests are an imperfect proxy. The agent should treat local-test pass as necessary but not sufficient.

### 14.5 Cost model

**Assumptions (UNMEASURED for the competition; drawn from SRC-A's worked example and standard practice):**

- Per-task tool budget: ~50 tool calls (illustrative; varies by task).
- Tool-call overhead for one journal entry: ~5-10 calls per task (planning, recording, querying).
- Tool-call overhead for fix-ordering: 0-5 calls per task (depends on multi-hunk structure).
- Tool-call overhead for self-verification: 10-20 calls per task (iterative refinement).
- Tool-call overhead for test migration: 5-15 calls per task (rewrite + validate).

**Order-of-magnitude arithmetic:** a full BCF pipeline might consume 30-50 calls before any productive work, leaving little budget for actual code investigation on a tight budget. This is consistent with mini-SWE-agent's finding that simplicity outperforms elaborate scaffolds.

### 14.6 "Do not do" list

| Countermeasure | Reason |
|---|---|
| Elaborate planning beyond what mini-SWE-agent achieves | Cost exceeds benefit on tight budgets; E2 evidence shows simpler can match |
| Self-refinement with weak verifier signal | Documented to degrade outcomes in this regime (E1 negative) |
| Process reward models for code generation (current generation) | E0 — code-specific validation sparse; transfer from math uncertain |
| Hand-coded fix-ordering algorithms without dependency validation | Costs tool calls on instances without orderable dependencies |
## 15. Operationalization (WS-07)

### 15.1 Construct specifications

**Masking instance (operational definition, draft).** A benchmark issue is labeled a *masking instance* if and only if:

(a) The gold patch contains ≥2 distinct semantic changes (each independently attributable to a stated purpose), AND
(b) At least one of those changes, if applied alone, would (i) cause local tests to pass while leaving another semantic change unaddressed, OR (ii) cause local tests to fail in a way that masks another semantic change's symptoms.

**Interference instance (operational definition, draft).** A benchmark issue is labeled an *interference instance* if and only if:

(a) The gold patch contains ≥2 distinct semantic changes, AND
(b) The semantic changes have a stated dependency relation (one cannot be applied independently of another without breaking local tests or producing an incorrect intermediate state).

**Oracle asymmetry instance (operational definition, draft).** A benchmark issue is labeled an *oracle-asymmetry instance* if and only if:

(a) The visible test suite (the agent's runnable tests) differs from the graded test suite (the `test_patch`), AND
(b) The difference can produce at least one case where an agent's plausible patch passes visible tests but fails graded tests.

**Note:** all three definitions require access to base commit, gold patch, and test patch — i.e., they are *benchmark-construction-time* labels, not runtime labels. Runtime detection requires different metrics (see §15.5).

### 15.2 Annotation protocol (excerpt)

The full protocol is in `annotation-protocol.json`. Key fields:

```json
{
  "construct": "masking_instance | interference_instance | oracle_asymmetry_instance",
  "instance_id": "<benchmark instance id>",
  "gold_patch": "<diff>",
  "test_patch": "<diff>",
  "visible_tests": ["<list of test paths>"],
  "graded_tests": ["<list of test paths>"],
  "decision": "yes | no | undecidable",
  "sub_mechanism": "M1 | M2 | M3 | M4 | M5 | M6 | M7 | M8 | none | unclear",
  "evidence_lines": ["<file:line references>"],
  "annotator_id": "<id>",
  "adjudication_needed": true | false,
  "confidence": "high | medium | low"
}
```

### 15.3 Positive / negative / edge-case exemplars (illustrative)

| Exemplar type | Description | Source |
|---|---|---|
| Positive (oracle asymmetry) | Patch passes `test_patch` but fails full dev test suite | Wang et al. (7.8% of SWE-bench Verified) |
| Positive (multi-hunk) | Patch spans 2+ files with related changes | SWE-bench mean 1.7 files |
| Negative (single-file) | Patch touches 1 file with one logical change | SWE-bench median instance |
| Edge case (single hunk, semantic multi-fix) | One file modified but multiple semantic concerns | Possible in SWE-bench corpus; not extracted |
| Edge case (test patch only) | Test-only patch with no production code change | Possible in some curated benchmarks |

All exemplar IDs are illustrative; the actual annotation requires running the protocol on the real instance set.

### 15.4 Inter-annotator reliability plan

- Statistic: Krippendorff's alpha (nominal, multiple annotators).
- Annotators: minimum 2 (per handoff minimum); recommended 3 for adjudication tie-breaking.
- Acceptable agreement: α ≥ 0.7 for primary constructs; α ≥ 0.6 acceptable for sub-mechanism.
- Adjudication rule: disagreements routed to a senior annotator; if α < 0.6 on a construct, the construct definition is revised.
- Sample size: powered to detect the prevalence range the literature supports (~10-30% of SWE-bench instances per the §10.1 figures). For 20% prevalence at α=0.7 with two annotators, ~50 instances are sufficient.

### 15.5 Run-level metric dictionary

| Metric | Formula | Log source | Computable point | Failure modes | Confounds |
|---|---|---|---|---|---|
| Localization cost | tool_calls before first edit on a relevant file | trajectory log | end-of-run | Agent may explore without editing | Goal is intent, not literal count |
| Edit count | number of file edits in final patch | final patch | end-of-run | Includes reverted edits | Use edit count net of reverts |
| Revert rate | reverted_edits / total_edits | trajectory log | end-of-run | May miss reversions outside the diff | Reversions must be detected, not assumed |
| Loop rate | consecutive identical tool calls / total | trajectory log | end-of-run | "Identical" is fuzzy | Includes intentional repeats |
| Budget exhaustion | total_tool_calls / budget | trajectory log + budget field | end-of-run | Task may complete before budget exhaustion | Budget may be too generous for hard tasks |
| Premature submission | (submits with F2P<1 in visible tests) — boolean | trajectory log | end-of-run | Agent may not be able to compute F2P locally | Requires local pytest setup |
| Fix-order violations | (edits applied out of declared order) | trajectory log | end-of-run | Requires declared order | Order may be heuristic, not causal |
| Mask-resolution latency | tool_calls from first encounter of masked defect to fix | trajectory log | end-of-run | Requires detection of "masked defect" — fuzzy | Definition is construct-validity dependent |

### 15.6 Competing-explanation discriminators

| Observable | Masking failure | Localization failure | Retrieval failure | Tool-output failure | Budget failure | Model-capability failure |
|---|---|---|---|---|---|---|
| Agent made correct edit | ✓ | ✓ | ✓ | ✓ | ✓ | (✗ — no correct edit) |
| Edit was to wrong file | (rare for masking) | ✓ | ✓ | (rare) | (rare) | (rare) |
| Local tests passed but graded fails | ✓ (M3) | (possible) | (rare) | (rare) | (rare) | (rare) |
| Tool output truncated near failure point | (rare) | (rare) | (rare) | ✓ | (rare) | (rare) |
| Budget exhausted without submission | (rare) | (rare) | (rare) | (rare) | ✓ | (rare) |
| Reasoning degraded over trajectory | (rare) | (rare) | (rare) | (rare) | (rare) | ✓ |

The discriminator table allows each run-level signal to be attributed to one or more candidate causes. Disambiguating among them requires the trajectory to be re-playable.

### 15.7 Executable measurement procedure (sketch)

Per CQ-04 default, no execution was performed. The procedure:

1. Open `tasks.jsonl` from the local dataset.
2. For each instance, extract: `instance_id`, `gold_patch`, `test_patch`, `issue_text`.
3. Apply the decision tree from §15.2 to label each instance.
4. Compute prevalence: count of `masking_instance`, `interference_instance`, `oracle_asymmetry_instance` / total.
5. Compute 95% confidence intervals using bootstrap over instances.

**All magnitudes are `UNMEASURED` for the competition.**

---

## 16. Competition-specific analysis (WS-08)

### 16.1 Verified mechanics

| Mechanic | Source | Tier | Confidence |
|---|---|---|---|
| 12-hour global limit for producing all patches | [SRC-C-2] | V1 (competition page) | High |
| Binary PASS/FAIL scoring per task | [SRC-C-2] | V1 | High |
| Hidden `test_patch` applied at grading time | [SRC-C-2] | V1 | High |
| Agent test-file edits reset before grading | [SRC-A §2]; SWE-bench family precedent | V2 (precedent) | Medium |
| Single fixed model (gemma-4-31b-it-qat-w4a16-ct) | [SRC-C-2] | V1 | High |
| 4x L4 GPU constraint | [SRC-C-2] | V1 | High |
| 129 public training tasks, ~120 hidden | [SRC-C-2]; SRC-B community intel | V1 | High |
| Two-container lifecycle (Container A agent, Container B verification) | [SRC-C-5]; HARNESS_README | V2 | High |
| Per-task configurable fields in `eval_config.yaml` | [SRC-C-2] | V1 | High |
| Repos: fastapi/rich/requests/httpx (per SRC-A and competition pages) | [SRC-C-2] | V1 | High |
| Tool set: nine predefined tools | [SRC-C-5] | V1 (HARNESS_README; UNVERIFIED for exact count) | Medium |

### 16.2 Budget model and sensitivity

**Inputs:**

| Input | Value | Source | Uncertainty |
|---|---|---|---|
| Global wall-clock | 12 hours | [SRC-C-2] | None |
| Total tasks | ~120 hidden + 129 public ≈ 250 (but the 12-hour is for hidden only per SRC-C; UNVERIFIED) | [SRC-C-2]; SRC-B | Medium |
| Per-task `max_time_minutes` | UNVERIFIED for the competition | [SRC-C-5] but not re-verified | High |
| Per-task `max_tool_calls` | UNVERIFIED for the competition | [SRC-C-5] but not re-verified | High |
| Per-task `max_turns` | UNVERIFIED for the competition | [SRC-C-5] but not re-verified | High |

**Arithmetic (illustrative; under UNVERIFIED assumptions):**

- 12 hours = 720 minutes.
- 120 tasks → 6 minutes per task on average, with overhead for setup and submission.
- If per-task budget is 50 tool calls: 6,000 tool calls total.
- Full BCF pipeline (~30-50 calls per task on planning/journaling) leaves 0-20 calls for actual investigation on each task — clearly infeasible.

**Sensitivity:** if the per-task budget is much higher (e.g., 200 calls per task), the arithmetic relaxes substantially. The budget feasibility verdict (§18.3) addresses this directly.

### 16.3 Binary-scoring interaction with multi-fault

Binary scoring with no partial credit creates an asymmetric incentive:

- A multi-fault issue with F2P=4: if a plausible-but-incorrect patch passes 3 of 4 F2P tests, the score is 0 (NO resolution per [S-SWE-grading-py]).
- The marginal value of an additional correct fix on a partially-correct run is therefore 0, not 1/k.
- Strategy implication: focus on the cases where the agent is most likely to achieve FULL, not on incremental partial-credit optimization.

### 16.4 Harness-defect register (community-reported)

| Defect | Source | Reproduction status | Evidence-loss mechanism |
|---|---|---|---|
| KV-cache collapse (46k → 7.6k tokens) | SRC-B | Single-repro (community) | Long reasoning chains lose earlier context |
| Double-JSON escaping in tool calls | SRC-B | Single-repro | Agent reasoning misinterprets tool output |
| Thinking-mode drop (model falls out of reasoning mode) | SRC-B | Single-repro | Reasoning quality degrades mid-task |
| Stdout truncation (5000 char cap) | SRC-B | Reported (community) | Long test output loses tail |
| File-read line cap (150 lines) | SRC-B | Reported | File context truncated |
| Writeup 404 bug (paper track only) | SRC-B | Multi-repro (community); unresolved | n/a (paper track, not main comp) |

**Risk:** all competition defects listed are community-reported; verification status is single-repro unless noted. Treat as leads requiring the entrant's own verification before adoption.

### 16.5 Setting novelty relative to literature

The competition's setting is **partially novel** relative to published agent evaluations:

| Feature | Competition | SWE-bench (public) | Novel? |
|---|---|---|---|
| Hidden test patch | Yes | Yes | No |
| Binary scoring | Yes | Yes | No |
| Fixed model | Yes (single 31B QAT) | No (model is configurable) | **Novel** |
| Limited tool set (nine predefined) | Yes | No (open tool set) | **Novel** |
| Global wall-clock (12-hour) | Yes | No (per-instance timeout) | **Novel** |
| Sequential tasks under shared budget | Yes (presumed) | No (independent runs) | **Novel** |

**Implication:** literature on multi-task budget allocation under a shared limit is sparse. The competition is closer to a "marathon run" than to a single-task benchmark. This argues for *per-task budget allocation* mechanisms (allocate more to hard tasks, less to easy ones) — a design space largely unexplored in retrieved literature.

### 16.6 Volatile-claim status table

See Appendix B for full status table. Summary: 22 community threads in SRC-B; tier distribution approximately 5 host-stated, 8 multi-repro, 6 single-repro, 3 unverified. None are load-bearing in this report.

### 16.7 Unverifiable register

The following could not be verified in this session:

- Exact per-task budget fields (`max_time_minutes`, `max_tool_calls`, `max_turns`) defaults.
- Exact count of predefined tools and their signatures.
- Whether agent test-file edits are reset before grading (SWE-bench family precedent supports "yes"; specific competition README text not re-verified).
- Exact `eval_config.yaml` schema.
## 17. Counterevidence and red team (WS-09)

### 17.1 Ranked objection register

| # | Objection | Evidence | Applicability | Testability | Disposition |
|---|---|---|---|---|---|
| 1 | Frequency-null: masking/interference may be too rare in this benchmark to justify mechanism overhead. | SWE-bench has ~40% instances with ≥2 F2P tests, but that's *symptoms*, not *masking*; the actual masking rate is unknown. | Direct | Yes — run annotation protocol | **UNRESOLVED.** Annotate competition data; if masking rate <10%, cut overhead mechanisms. |
| 2 | Cost argument: full BCF pipeline consumes budget that could go to productive work. | Mini-SWE-agent achieves 74%+ with bash-only; elaboration adds cost. | Direct | Yes — paired ablation | **RETAIN with caveat.** E2 evidence supports simplicity. Pipeline is conditional on budget sufficiency. |
| 3 | "It's just better localization" — masking claims collapse to localization failures. | SRC-A Trap 1 is not localization; the test suite contradicts, not the agent's understanding. | Partial | Yes — annotate | **CONCEDE for Traps 2 and 4.** Trap 1 is genuinely separate. |
| 4 | Self-Refine-style reflection is known not to help in some regimes. | Reanalyses show harmful effects with weak verifiers. | Direct | Yes — paired ablation | **CONDITIONAL.** Only use with strong verifier signal. |
| 5 | The literature does not use "fault masking" in agent contexts. | Search log (Appendix A). | Direct | n/a | **ACCEPT.** Adopt existing terms (oracle asymmetry, coincidental correctness) for the paper track. |
| 6 | SWE-bench Verified is contaminated; the agent may be memorizing. | Single V2 source (~10.6% leakage to StarCoder). | Indirect | Limited | **ACCEPT with caveat.** Memorization is a confound; the paper track should acknowledge it. |
| 7 | Process Reward Models don't transfer from math to code. | E0 evidence in code domain. | Direct | Yes — paired ablation | **CONDITIONAL.** E0 means do not rely on PRMs. |
| 8 | The framing in SRC-A is novel terminology without empirical grounding. | SRC-A is the researcher's own artifact; not yet validated on multiple instances. | Direct | Yes — annotate | **ACCEPT.** Coinage argument is held in reserve (§7.6). |
| 9 | The 31B QAT model may not exhibit the same failure modes as frontier models. | Limited evidence retrieved. | Direct | Yes — paired ablation | **ACCEPT.** Record as a transfer risk (§13.5). |
| 10 | The budget arithmetic suggests the pipeline cannot fit in 12 hours for ~120 tasks. | §16.2 arithmetic; per-task budget UNVERIFIED. | Conditional | Yes — paired run | **CONDITIONAL on per-task budget.** If per-task budget is generous, feasible; if tight, infeasible. |

### 17.2 Frequency-null analysis

If the masking-instance rate on the competition's 129 public training tasks is `p`:

| `p` | Implication | Recommended pipeline |
|---|---|---|
| < 5% | Masking is rare; overhead mechanisms likely net-negative | Bash-only simple agent |
| 5-15% | Masking is moderate; targeted countermeasure per task may help | Lightweight agent with masking-detection per instance |
| 15-30% | Masking is significant; structural overhead justified | BCF-lite pipeline |
| > 30% | Masking is dominant; full BCF pipeline justified | Full BCF |

**Without measurement, the entrant is guessing.** The §23 pre-registration includes a discriminating experiment to bound `p`.

### 17.3 Budget feasibility verdict

**Inputs:**

- Global wall-clock: 12 hours = 720 minutes (V1).
- Tasks: ~120 hidden + 129 public (V1; UNVERIFIED whether both count toward the 12-hour limit).
- Per-task budget: UNVERIFIED (the HARNESS_README text in [SRC-C-5] is not re-verified in this session; treated as opaque).

**Verdict: MARGINAL pending per-task budget verification.**

- If per-task budget is generous (e.g., 200+ tool calls, 30+ minutes per task), a lightweight BCF variant fits.
- If per-task budget is tight (e.g., 50 calls, 6 minutes per task), only mini-SWE-agent-style simplicity fits.
- Without verification of the per-task fields, the verdict cannot be tightened. **Action item: re-verify `eval_config.yaml` defaults.**

### 17.4 Component keep/cut/conditional table

| Component | Verdict | Evidence grade | Cost (calls) | Rationale |
|---|---|---|---|---|
| Spec-first planning (BCF) | **CONDITIONAL** | E1 | 5-15 | Cuts if per-task budget tight |
| Decomposition into candidate defects | **CONDITIONAL** | E1 | 5-10 | Cuts if instance is single-hunk |
| `fix_order` discipline | **CONDITIONAL** | E1 | 0-5 | Cuts if no orderable structure |
| Persistent breadcrumb journal | **KEEP** | E1 | 5-10 | Strong practitioner evidence; manageable cost |
| Test migration discipline | **CONDITIONAL** | E1 | 5-15 | Verify anti-tampering clause before adopting |
| Validation gates | **CONDITIONAL** | E1 | 5-10 | False-positive gating cost can exceed benefit |
| Self-verification (1 round) | **CONDITIONAL** | E1 | 5-10 | One round is cheap; multiple rounds degrade |
| Monotone-commit ratchet | **CONDITIONAL** | E1 | 2-5 | Cheap; helps with oscillation |
| Process reward model | **CUT** | E0 | n/a | Code-specific evidence absent |
| Custom planning beyond mini-SWE-agent | **CUT** | E2 (simplicity wins) | n/a | Mini-SWE-agent shows simpler can match |
| File retrieval with line-range cap awareness | **KEEP** | E2 | 0-2 | Workaround for harness defect |

### 17.5 Reviewer pre-mortem (8 objections)

| # | Objection | Sourced response |
|---|---|---|
| 1 | "The framing is just debugging." | Show Wang et al. 7.8% number; distinguish from debugging-theoretic frame (§11). |
| 2 | "Multi-fault prevalence on this benchmark is unmeasured." | Acknowledge; cite the §10.5 UNMEASURED register and the §23 pre-registered measurement. |
| 3 | "Reflection is known not to help." | Cite Self-Refine positive (NeurIPS 2023) AND the boundary conditions (§14.3). |
| 4 | "The agent is memorizing SWE-bench." | Cite ~10.6% StarCoder leakage (V2); acknowledge as confounder; design choice of which benchmark subset to use. |
| 5 | "You're not validating the construct." | Cite §15 protocol; acknowledge alpha is a *target*, not achievement. |
| 6 | "Budget arithmetic is hand-waved." | §16.2 and §18.3 are explicit; UNVERIFIED inputs flagged. |
| 7 | "Novelty is overstated." | §25 explicitly bounds claimable / must-cite / overclaim. |
| 8 | "Where are the negative results for BCF components?" | §14.6 "do not do" list and §17.4 keep/cut table. |

### 17.6 Explicit concessions

- The masking-instance prevalence on the competition's data is **unknown** (CQ-04 default).
- The agent failure-mode taxonomy is **partial**; AgentLens-specific rates not retrievable in this session.
- The per-task budget fields are **unverified** for this specific competition.
- Several load-bearing claims rest on V2 (abstract-only) sources due to WebSearch exhaustion.
- The 31B QAT model's failure-mode transfer from larger models is **untested**.
- The construct definition in §15 is a draft; reliability not measured.

---

## 18. Comparative analysis

### 18.1 Countermeasure × evidence grade × cost × applicability

| Countermeasure | Grade | Tool calls | Transfer to 31B QAT | Apply on tight budget? |
|---|---|---|---|---|
| Mini-SWE-agent simplicity | E2 | n/a (overall) | High | Yes |
| Persistent journal | E1 | 5-10/task | High | Yes |
| Fix ordering | E1 | 0-5/task | High | Conditional |
| Spec-first planning | E1 | 5-15/task | Medium | Conditional |
| Self-verification (1 round) | E1-E2 | 5-10/task | Medium | Conditional |
| Test migration | E1 | 5-15/task | Medium | Conditional (verify policy) |
| Gates / ratchet | E1 | 2-5/task | High | Yes |
| Process reward models | E0 | n/a | Low | No |
| Custom planning | E2 (against) | n/a | Low | No |

### 18.2 Construct × field

See §7.2 for the cross-field comparison table.

### 18.3 Paradigm × setting

| Paradigm | SWE-bench (per-instance) | Competition (sequential, shared budget) |
|---|---|---|
| Plan-then-execute | Common (AutoCodeRover, RepairAgent) | Marginal — costs budget across tasks |
| Reactive / retry | Common (SWE-agent) | Fits — cheaper per task |
| Single-pass | Common (Agentless) | Fits |
| Iterative-with-memory | Common (Reflexion-style) | Conditional — memory overhead |
| Model-judged verification | Common (PRM-style for math) | Not validated for code |
| Executable verification | Universal | Universal |

### 18.4 Theory × field

See §11 for the per-tradition lineage.

---

## 19. Quantitative findings appendix

### 19.1 Consolidated numbers

| Number | Value | Source | Tier | Notes |
|---|---|---|---|---|
| SWE-bench instances | 2,294 | [S-WS-02-1] | V2 | Full benchmark |
| SWE-bench Verified | 500 | [SRC-C-2]; [S-SWE-repo] | V1 | Human-validated subset |
| SWE-bench mean files/patch | 1.7 | [S-WS-02-1] | V2 | |
| SWE-bench mean funcs/patch | 3.0 | [S-WS-02-1] | V2 | |
| SWE-bench mean lines/patch | 32.8 | [S-WS-02-1] | V2 | |
| SWE-bench max files/patch | 31 | [S-WS-02-1] | V2 | |
| SWE-bench % with ≥2 F2P tests | ~40% | [S-WS-02-1] | V2 | |
| SWE-bench filter attrition | 93,139 → 2,294 | [S-WS-02-1] | V2 | 97.5% |
| SWE-bench HF total rows | 21,527 | [S-HF-dataset] | V2 | All versions |
| Multi-SWE-bench total | 1,632 | [S-MultiSWE] | V3 | 7 languages |
| Multi-SWE-bench Python best | 52.20% | [S-MultiSWE] | V3 | Claude-3.7 + OpenHands |
| Multi-SWE-bench other languages | 2-15% | [S-MultiSWE] | V3 | Same agent |
| Multi-SWE-bench easy/medium/hard | 30-71% / 5-44% / ~0% | [S-MultiSWE] | V3 | |
| Wang et al. 7.8% plausible-but-fail-dev | 7.8% | [S-Wang-2503] | V2 | SWE-bench Verified |
| Wang et al. 29.6% behavioral divergence | 29.6% | [S-Wang-2503] | V2 | |
| Wang et al. 6.2pp inflation | 6.2pp | [S-Wang-2503] | V2 | |
| Mini-SWE-agent SWE-bench Verified | 74%+ | [S-WS-05-3] | V2 | |
| MSR 2012 multi-fix-attempt bugs | 22-33% | [S-MSR12-supp] | V2 | Eclipse JDT/SWT, Mozilla |
| ~10.6% leakage to StarCoder | 10.6% | [S-Memorization-Dec-2025] | V2 | Abstract only |
| 16.4% SWE-bench Verified flawed | 16.4% | OpenAI Feb 2026 | V0 | UNVERIFIED |

### 19.2 UNMEASURED items

- Masking-instance rate on competition's 129 public training tasks.
- Interference-instance rate on competition's data.
- Oracle-asymmetry rate on competition's data.
- Per-task budget defaults (`max_time_minutes`, `max_tool_calls`, `max_turns`).
- Agent failure-mode rates on the Gemma 4 31B QAT model.
## 20. Case studies and worked examples

### 20.1 Published case: SWE-bench Verified 7.8% inflation (Wang et al.)

Wang et al. (arXiv:2503.15223) [S-Wang-2503] used PatchDiff to generate differentiating tests and exposed behavioral discrepancies between plausible LLM patches and ground-truth patches on SWE-bench Verified:

- 7.8% of patches counted as correct by `test_patch` grading actually fail the *full* developer-written test suite.
- 29.6% of plausible patches are behaviorally divergent from gold.
- Categories: 46.8% similar but divergent implementations, 27.3% over-adapted patches, 28.6% confirmed incorrect.
- Net: 6.2 percentage-point inflation in reported resolve rates.

**Mechanism:** SWE-bench validates using only developer-written test files *modified in the PR*. Tests not in the `test_patch` are not run. A plausible patch can pass the modified tests while breaking or omitting behavior captured only by unmodified tests.

**Relevance to SRC-A:** Trap 1 is precisely this phenomenon. The agent sees only the visible (unmodified) tests; the graded tests are the PR-modified subset. If the visible and graded test sets differ in coverage, the agent's local signal can be confidently wrong.

### 20.2 The entrant's `httpx_3672` example (SRC-A) treated as a hypothesis

Per handoff §9.6, the entrant's own materials may be cited as descriptions of the researcher's artifacts, NOT as evidence. With that caveat:

- **Trap 1** (visible vs graded): hypothesizes a contradiction between agent-visible tests and graded tests. Wang et al. measure a 7.8% instance-level rate of this exact phenomenon on SWE-bench Verified. The mechanism is corroborated; the specific instance is not measured here (UNMEASURED for the competition).
- **Trap 2** (duplicate sync/async tree): hypothesizes a retrieval confound specific to repos with sync/async mirrors. No published analogue found in the literature. Recorded as a benchmark-curation artifact hypothesis, not a masking event.
- **Trap 3** (latent fault at never-tested call site): hypothesizes a masking mechanism not in the classical taxonomy. Closest analogues: "coincidental correctness" [S-Qi-2018] and test-coverage gaps. Mechanism is plausible; prevalence on competition data is UNMEASURED.
- **Trap 4** (broken-but-ungraded): hypothesizes a scope mismatch between the issue and the graded tests. Not a masking event in any classical sense.

**Unverifiable claims in SRC-A:**

- The exact patch structures (hunks, files).
- The exact test contradictions.
- Whether the latent defect is exercised by graded tests.
- The fix-order dependency graph.

These can be verified only by the entrant with local data access.

### 20.3 Counter-case: mini-SWE-agent simplicity

Mini-SWE-agent [S-WS-05-3] achieves 74%+ on SWE-bench Verified with:

- One tool: bash.
- Linear history (no branching).
- ~100 lines of Python.
- No persistent memory, no planning phase, no ordered fixes.

This is a counter-case to the "more machinery = better" intuition. It suggests that, at least with capable enough models, simple agents can match elaborate ones. The Gemma 4 31B QAT model is in a different capability regime, so the transfer is not guaranteed; but the counter-case disciplines the BCF framing by establishing a lower bound on what's achievable with minimal scaffolding.

---

## 21. Contradictory evidence and competing interpretations

| ID | Claim | Supporting sources | Contradicting sources | Nature | Resolution |
|---|---|---|---|---|---|
| K-01 | "Multi-fault is common in real software." | Multi-entity changes study [S-MultiEntity-2018]; ICSE 2015 bug-fix study [S-ICSE15-bugfix] | SWE-bench curation filters (97.5% attrition) | Definition / scope | Multi-fault prevalence is high in raw populations, lower in curated benchmarks. Report both. |
| K-02 | "Reflection improves agent outcomes." | Self-Refine [S-SelfRefine-NeurIPS]; Voyager [S-Voyager] | Recent reanalyses (trajectory-analysis survey [S-LLM-Traj-Survey]) | Setting / verifier strength | Reflection helps when verifier is strong; harmful when weak. Report boundary. |
| K-03 | "Fix ordering improves multi-hunk repair." | Mechanistic argument (topological sort), Long & Rinard plausible-patch framing | No direct controlled ablation retrieved | Evidence gap | Report as plausible-but-unvalidated. |
| K-04 | "31B QAT can match larger models on SWE-bench." | SWE-agent-LM-32b open-weights SOTA [S-SWE-agent] | Frontier models (Claude 3.7, GPT-4) typically lead | Model scale | 32B open-weight can match on some metrics but not all; not directly transferable to QAT. |
| K-05 | "Oracle asymmetry is rare and ignorable." | (No sources) | Wang et al. 7.8% [S-Wang-2503] | n/a | Adopt Wang et al. measurement; do not minimize. |
| K-06 | "Test edits can be part of the agent's patch." | SRC-A §2 suggests edits to tests may be made | SWE-bench family anti-tampering precedent; competition rules | Verification | UNVERIFIED for the specific competition; verify before adopting test-migration discipline. |

**Residual uncertainty:** the construct definition (§15) and prevalence measurement (§10) are the highest-impact unknowns.

---

## 22. Pre-registration

### 22.1 Pre-registered predictions

| # | Hypothesis | Predicted direction | Predicted effect size | Measurement | Falsification criterion | Confounds | Informative null? |
|---|---|---|---|---|---|---|---|
| P1 | The masking-instance rate on the competition's public training tasks is between 5% and 30%. | One-sided | n/a | Run §15 protocol; compute proportion | If rate < 2% or > 50%, framing is wrong | Annotation reliability; construct validity | Yes — low rate falsifies the framing's importance |
| P2 | The full BCF pipeline consumes more tool calls per task than a mini-SWE-agent baseline. | Confirmed | +30 to +50 tool calls per task | Run paired: BCF vs mini-SWE-agent style on a sample of 10 tasks | If BCF uses fewer calls, the design is more efficient than expected | Task selection bias; tool-call counting accuracy | Yes — informative |
| P3 | A persistent journal reduces edit-revert rate. | Direction: lower | Halve revert rate | Compare revert rate on journal vs no-journal runs | If journal has higher revert rate, it's counterproductive | Revert detection accuracy | Yes |
| P4 | Self-verification (one round) improves F2P pass rate on visible tests. | Direction: higher | +5pp to +15pp | Paired run: with vs without self-verify | If null or negative, drop | Local-test fidelity | Yes |
| P5 | Test migration discipline causes anti-tampering penalties on the competition. | Direction: lower | Depends on harness; possibly -10pp or more | Compare migration vs no-migration | If migration scores higher, the harness allows it | Anti-tampering detection | Yes — informative |
| P6 | Multi-file patches take longer (more tool calls) than single-file patches, controlling for instance size. | Direction: more | +20% to +50% tool calls | Regress tool-call count on patch file-count | If null, file count doesn't bind budget | Patch-size confound | Yes |

### 22.2 Discriminating experiments ranked by information per tool call

| Rank | Experiment | Information gained | Tool-call cost | Information/call ratio |
|---|---|---|---|---|
| 1 | Run annotation protocol on 50 public tasks | Bounds masking rate | ~1,000 (analysis only) | High |
| 2 | Paired BCF vs mini-SWE-agent on 10 tasks | Bounds BCF overhead | ~500 (runs) | High |
| 3 | Compute F2P/P2P on visible vs graded for 50 tasks | Bounds oracle asymmetry | ~500 (test runs) | High |
| 4 | Revert-rate with vs without journal | Bounds journal benefit | ~500 | Medium |
| 5 | Self-verify on vs off | Bounds reflection benefit | ~500 | Medium |

### 22.3 Confounds and informative nulls

- **Construct validity:** the construct definition is a draft. If α < 0.6 between annotators, the construct is unreliable and all downstream measurements are suspect.
- **Selection bias:** the 129 public tasks are not a random sample of the hidden tasks. Public tasks may be easier or differently distributed.
- **Model scale:** the Gemma 4 31B QAT model's failure modes may differ from published 70B+ models. Transfer of effect sizes is uncertain.
- **Tool budget:** if the per-task budget is much smaller than expected, the experiments may not run to completion.

## 23. Implications and recommendations

### 23.1 Minimal mechanism set (priority-ordered)

| Priority | Mechanism | Evidence grade | Tool-call cost | Failure condition | Settling experiment |
|---|---|---|---|---|---|
| 1 | Persistent breadcrumb journal | E1 | 5-10/task | If per-task budget < 30 calls | §22 P3 |
| 2 | Mini-SWE-agent-style simplicity baseline | E2 | n/a | n/a (baseline) | n/a |
| 3 | Single-round self-verification | E1-E2 | 5-10/task | Weak verifier; known degradation | §22 P4 |
| 4 | Monotone-commit ratchet | E1 | 2-5/task | False-positive gating | n/a (cheap) |
| 5 | Spec-first planning | E1 | 5-15/task | Tight budget | §22 P2 |
| 6 | Decomposition into candidate defects | E1 | 5-10/task | Tight budget | §22 P2 |
| 7 | `fix_order` discipline | E1 | 0-5/task | Independent hunks | §22 P6 |
| 8 | Test migration | E1 | 5-15/task | Anti-tampering clause | §22 P5 |

**Discarded:**

- Custom planning beyond mini-SWE-agent (E2 evidence against).
- Process Reward Models for code (E0).
- Multi-cycle self-correction beyond 2-3 rounds (E1 negative).

### 23.2 Priority-ordered next actions

| Action | Expected value | Tool-call cost | Notes |
|---|---|---|---|
| Run annotation protocol on 50 public tasks | High — bounds the framing's importance | Low (analysis) | §22 P1 |
| Re-verify per-task budget defaults | High — unblocks budget arithmetic | n/a (read HARNESS_README) | §16.2 |
| Run paired BCF vs mini-SWE-agent on 10 tasks | High — bounds BCF overhead | Medium | §22 P2 |
| Compute F2P/P2P on visible vs graded for 50 tasks | High — bounds oracle asymmetry | Low-medium | §12.4 |
| Open OpenAI "no longer evaluate" page via archive.org | Medium — adds a load-bearing number | n/a | §12.2 |

### 23.3 Recommendation summary

If forced to ship a single design tomorrow with the current evidence:

- **Adopt:** persistent journal, mini-SWE-agent simplicity, single-round self-verification, monotone-commit ratchet.
- **Conditional:** spec-first planning, decomposition, fix ordering, test migration — adopt only if the discriminating experiments show positive effect.
- **Discard:** elaborate planning, PRMs, multi-cycle reflection.

This is a smaller, cheaper pipeline than the user's SRC-A framing, with stronger evidence support. It is the report's evidence-graded recommendation.

---

## 24. Novelty boundary

### 24.1 Claimable (paper-track wording must use these terms)

- "We measure masking/interference rates on the competition's public training tasks using a decidable annotation protocol."
- "We characterize the oracle-asymmetry phenomenon — where agent-visible tests diverge from graded tests — and document its prevalence on the competition's harness."
- "We run paired ablations of BCF components versus a mini-SWE-agent baseline to bound the cost-effectiveness of each component."
- "We contribute a metric dictionary for run-level masking/interference detection with discriminators for alternative explanations."

### 24.2 Must cite as prior art

- Avizienis et al. 2004 (fault taxonomy).
- Zeller (delta debugging, debugging theory).
- Cohen et al. (combinatorial interaction testing).
- Qi et al. 2018 (overfitting in program repair).
- Wang et al. 2503.15223 (oracle asymmetry / PatchDiff).
- Multi-SWE-bench (multilingual benchmark).
- SWE-bench paper (mean files per patch, F2P/P2P statistics).
- mini-SWE-agent README (simplicity as countermeasure).
- Self-Refine (positive reflection result).
- Voyager (iterative prompting with self-verification).
- The 22 community threads in SRC-B (re-verified, dated).

### 24.3 Overclaim (do not assert these)

- "We coin the term fault masking / fault interference in the agent context." (Avizienis coinage predates; would be a redundant restatement.)
- "We prove multi-fault repair is the dominant failure mode on this benchmark." (UNMEASURED; awaiting §22 P1.)
- "We show reflection does not help code agents." (Self-Refine shows positive; boundary conditions matter.)
- "We demonstrate a novel process reward model for code." (E0 evidence; would not survive review.)
- "We are the first to study multi-fault in agent repair." (Multi-Entity changes; ICSE 2015; many studies predate.)

---

## 25. Risks, limitations, and evidence gaps

### 25.1 Report-level limitations

- **WebSearch budget exhaustion** (200/200 calls) limited the breadth of additional corroborating searches. Some load-bearing claims rest on V2 sources where V3 was not retrievable in-session.
- **Agent failure-mode taxonomy is partial.** Several retrieval failures meant the AgentLens specific categories (C1-C5) and 10.7% lucky-pass rate could not be independently confirmed.
- **Competition-specific mechanics are partially UNVERIFIED.** The HARNESS_README text in [SRC-C-5] is not re-verified in this session; the per-task budget defaults are opaque.
- **No primary measurements on the competition's data.** Per CQ-04 default.
- **31B QAT model transfer risk** is unquantified.
- **Construct validity** of the annotation protocol is a draft; reliability not measured.
- **Several well-cited practitioner claims** (OpenAI "no longer evaluate", SWE-bench Illusion, UTBoost, SWE-ABS) were searched but the primary sources were inaccessible; recorded as UNVERIFIED-NOT-CITED.

### 25.2 Evidence gaps the entrant can fill

- Annotate 50-100 public tasks for masking/interference/oracle-asymmetry rates.
- Run paired BCF vs mini-SWE-agent ablations.
- Open the HARNESS_README text directly.
- Reproduce community-reported harness defects in their own environment.
- Test 31B QAT with the protocol on a sample of tasks.

### 25.3 Evidence gaps the entrant cannot fill in the available time

- Definitive prevalence rates for the hidden tasks.
- Effect sizes for BCF components at full scale.
- Independent replications of mini-SWE-agent results on Gemma 4 31B QAT.

---

## 26. Honest limitations paragraph (drafted for paper-track reuse)

> This work is subject to several limitations. First, masking/interference rates on the competition's public training tasks are not measured; we report a construct and protocol but defer measurement to future work, and we are explicit about what this means for the framing's importance (it could be that masking is rare on this benchmark). Second, several of our load-bearing claims rest on abstract-level readings of preprints and abstracts because the full PDFs were not retrievable within the time and search budget available; we label these V2/abstract-only. Third, the Gemma 4 31B QAT model is a quantized variant whose failure-mode profile may differ from the larger, full-precision models whose published results we cite; transfer of effect sizes is uncertain. Fourth, our construct definition (§15) is a draft whose inter-annotator reliability has not been measured; the reported reliability values are targets, not achievements. Fifth, the per-task budget fields in the competition harness are not re-verified in this report; the budget feasibility verdict is MARGINAL pending verification. Sixth, several widely-circulated claims about SWE-bench integrity (OpenAI's departure, SWE-bench Illusion, UTBoost, SWE-ABS) are recorded as UNVERIFIED-NOT-CITED because their primary sources were not retrievable in-session; we have not, therefore, double-counted them as load-bearing evidence.

---

## 27. Conclusion

The verified state of knowledge on fault masking and fault interference in multi-fault software repair is rich but fragmented. Classical terms (Avizienis 2004, Zeller 2002, Cohen CIT) carry real conceptual weight but their mechanisms transfer only partially to organic software defects. The program-repair literature documents masking-like phenomena (Qi 2018, Long-Rinard) under the "coincidental correctness" and "plausible patch" framings, but does not unify them under a single agent-side taxonomy.

The most defensible empirical anchor for the entrant's framing is Wang et al.'s 7.8% measurement of patches passing `test_patch` grading yet failing the full developer test suite — this is the closest published analogue to SRC-A Trap 1, the most distinctive of the entrant's four traps. Trap 1 is genuinely separate from "debugging" and from "overfitting"; it is a benchmark-construction phenomenon that the agent cannot detect from local signals.

Countermeasures commonly recommended in this space have uneven evidence. Mini-SWE-agent's simplicity result (E2) challenges elaborate scaffolds. Self-Refine (E1-E2) has both positive and negative results; boundary conditions matter. Fix ordering is mechanistically defensible but not ablation-validated. Process reward models have E0 evidence in the code domain.

For the Kaggle Gemma 4 Developer Agent competition specifically: the harness inherits SWE-bench's F2P/P2P/FULL/PARTIAL/NO logic (V2 confirmed). The 12-hour global limit and the single 31B QAT model are setting features with limited published literature transfer. Several per-task budget fields are UNVERIFIED for this specific competition.

The minimal evidence-supported design is smaller and cheaper than the entrant's SRC-A framing: a persistent journal, mini-SWE-agent-style simplicity, single-round self-verification, a monotone-commit ratchet, and conditional use of planning and decomposition depending on budget. Process reward models and elaborate custom planning are discarded on the evidence.

## 28. RQ coverage matrix

| RQ / VQ id | Description (abbrev.) | WS | Section | Status |
|---|---|---|---|---|
| RQ-PRIMARY | Verified state of knowledge on masking/interference + implications | 01-11 | Full report | ANSWERED (with bounds) |
| RQ-01.1 | Established definitions | 01 | §7 | ANSWERED |
| RQ-01.2 | Isomorphism to four traps | 01 | §7.3 | ANSWERED |
| RQ-01.3 | LLM-agent usage census | 01 | §7.5 | ANSWERED |
| RQ-01.4 | Boundary neighbors | 01 | §7.4 | ANSWERED |
| RQ-01.5 | Adopt/extend/coin stance | 01 | §7.6 | ANSWERED |
| RQ-02.1 | Real-world multi-defect rate | 02 | §10.1 | ANSWERED (range) |
| RQ-02.2 | Defect coupling measurement | 02 | §10.1 | PARTIAL |
| RQ-02.3 | Curation effects | 02 | §10.2 | ANSWERED |
| RQ-02.4 | Fix-dependency structure | 02 | §10.3 | PARTIAL (gap noted) |
| RQ-02.5 | Base rates for the competition | 02 | §10.4 | UNMEASURED |
| RQ-03.1 | Failure-inducing change / multi-cause cost | 03 | §11.1 | ANSWERED |
| RQ-03.2 | Multi-location repair / overfitting | 03 | §11.1 | ANSWERED |
| RQ-03.3 | Fault injection for repair | 03 | §11 | PARTIAL |
| RQ-03.4 | Combinatorial interaction testing | 03 | §11.1 | ANSWERED |
| RQ-03.5 | Coupling-effect status | 03 | §11.4 | ANSWERED |
| RQ-04.1 | Hidden-test-patch construction / integrity | 04 | §12.1, §12.2 | ANSWERED |
| RQ-04.2 | Contamination / memorization evidence | 04 | §12.3 | PARTIAL (V0 items) |
| RQ-04.3 | Oracle asymmetry as named/studied/quantified | 04 | §12.4 | ANSWERED |
| RQ-04.4 | Agent behavior under contradictory evidence | 04 | §12.5 | PARTIAL |
| RQ-04.5 | Reward-hacking metrics | 04 | §12.6 | ANSWERED |
| RQ-04.6 | Grader-side harness bugs | 04 | §12.7 | ANSWERED |
| RQ-05.1 | Failure taxonomies | 05 | §13.1 | PARTIAL |
| RQ-05.2 | Mappings to masking/interference | 05 | §13.3 | ANSWERED |
| RQ-05.3 | Scale/quantization effects | 05 | §13.5 | PARTIAL |
| RQ-05.4 | Tool-output defects | 05 | §13.4 | ANSWERED |
| RQ-05.5 | Public trace corpora | 05 | §13.6 | ANSWERED |
| RQ-06.1 | Fix ordering evidence | 06 | §14.2 | ANSWERED |
| RQ-06.2 | Decomposition / planning evidence | 06 | §14.1 | ANSWERED |
| RQ-06.3 | Persistent memory evidence | 06 | §14.1 | ANSWERED |
| RQ-06.4 | Self-verification / reflection evidence | 06 | §14.3 | ANSWERED |
| RQ-06.5 | Verifier quality evidence | 06 | §14.4 | ANSWERED |
| RQ-06.6 | Ratchet / gate evidence | 06 | §14.1 | ANSWERED |
| RQ-06.7 | Effect size, boundary, cost, risk per countermeasure | 06 | §14.5, §14.6 | ANSWERED |
| RQ-07.1 | Operational definitions | 07 | §15.1 | ANSWERED (draft) |
| RQ-07.2 | Annotation protocol | 07 | §15.2, Appendix D | ANSWERED (draft) |
| RQ-07.3 | Inter-annotator reliability plan | 07 | §15.4 | ANSWERED |
| RQ-07.4 | Run-level metric dictionary | 07 | §15.5 | ANSWERED |
| RQ-07.5 | Confounds and discriminators | 07 | §15.6 | ANSWERED |
| RQ-07.6 | Executable measurement procedure | 07 | §15.7 | ANSWERED (sketch) |
| RQ-08.1 | Verified grading mechanics | 08 | §16.1 | ANSWERED (with UNVERIFIED list) |
| RQ-08.2 | Binary-scoring interaction with multi-fault | 08 | §16.3 | ANSWERED |
| RQ-08.3 | Fixed budgets × multi-fault cost | 08 | §16.2 | ANSWERED |
| RQ-08.4 | Harness defects × evidence loss | 08 | §16.4 | ANSWERED (community-reported) |
| RQ-08.5 | Setting novelty | 08 | §16.5 | ANSWERED |
| RQ-08.6 | Volatile community claims | 08 | §16.6 | ANSWERED |
| RQ-09.1 | Strongest evidence against the framing | 09 | §17.1 | ANSWERED |
| RQ-09.2 | Components with weak support | 09 | §17.4 | ANSWERED |
| RQ-09.3 | Budget arithmetic / feasibility | 09 | §17.3 | ANSWERED (MARGINAL) |
| RQ-09.4 | Alternative explanations | 09 | §15.6, §17.5 | ANSWERED |
| RQ-09.5 | Reviewer objections | 09 | §17.5 | ANSWERED |
| RQ-10 / SQ-01 | Evidence-graded position | 10 | §5, §27 | ANSWERED |
| SQ-02 | Minimal mechanism set | 10 | §23.1 | ANSWERED |
| SQ-03 | Pre-registered predictions | 10 | §22 | ANSWERED |
| SQ-04 | Novelty boundary | 10 | §24 | ANSWERED |
| SQ-05 | Most important unknown + experiment | 10 | §22.5, §23.2 | ANSWERED |
| SQ-06 | Honest limitations paragraph | 10 | §26 | ANSWERED |
| VQ-01 | Sources exist with stated metadata | 11 | §9, Appendix B | ANSWERED (V0 items logged) |
| VQ-02 | Citations support specific claims | 11 | §9, Appendix B | ANSWERED |
| VQ-03 | Numbers traceable | 11 | §9.2, §19 | ANSWERED |
| VQ-04 | Preprint vs published versions | 11 | Appendix B | ANSWERED |
| VQ-05 | Retractions / corrections | 11 | Appendix B | NO RETRACTIONS FOUND |
| VQ-06 | Benchmark / dataset versions | 11 | §19 | ANSWERED |
| VQ-07 | Competition grading from primary source | 11 | §16.1, Appendix B | PARTIAL (some UNVERIFIED) |
| VQ-08 | Volatile claims re-verified with dates | 11 | §16.6 | ANSWERED (dated) |
| VQ-09 | Conclusions labeled measured/inferred/assumed | 11 | Throughout | ANSWERED |
| VQ-10 | Negative and null results | 11 | §14.3, §14.6 | ANSWERED (proportionate) |
| VQ-11 | "No prior work" with search log | 11 | Appendix A | ANSWERED |
| VQ-12 | Tool capabilities sourced | 11 | §16.4 | PARTIAL (community-reported) |

---

## 29. Claim-evidence traceability matrix (excerpt)

| Claim id | Claim | RQ | Workstream | Section | Source ids | Tier | Confidence | Alternatives considered | Gap |
|---|---|---|---|---|---|---|---|---|---|
| C-001 | SWE-bench has mean 1.7 files per gold patch | RQ-02.1 | 02 | §10.1 | [S-WS-02-1] | V2 | High | Curation bias (acknowledged) | Direct distribution not extracted |
| C-002 | SWE-bench has ~40% instances with ≥2 F2P tests | RQ-02.1 | 02 | §10.1 | [S-WS-02-1] | V2 | High | Definition of "multi-fault" | Specific fault-multiplicity not analyzed |
| C-003 | Multi-SWE-bench: 52.20% Python best, 2-15% others | RQ-02.1 | 02 | §10.1 | [S-MultiSWE] | V3 | High | Model and method variation | Specific Claude-3.7 details |
| C-004 | Wang et al. 7.8% patches pass test_patch but fail full dev suite | RQ-04.3 | 04 | §12.2 | [S-Wang-2503] | V2 | High | Selection of test_patch subset | Specific category details |
| C-005 | Wang et al. 29.6% behavioral divergence | RQ-04.3 | 04 | §12.2 | [S-Wang-2503] | V2 | High | Definition of "behavioral divergence" | n/a |
| C-006 | Mini-SWE-agent 74%+ on SWE-bench Verified with bash-only | RQ-05.1, RQ-06 | 05, 06 | §14.1 | [S-WS-05-3] | V2 | High | Model selection bias | Model-specific results |
| C-007 | Avizienis fault masking definition transfers conceptually but not mechanistically | RQ-01.1, RQ-03 | 01, 03 | §7.2, §11.1 | [S-Avizienis-2004] | V2 | High | Cross-field transfer arguments | Specific software mechanism catalogue |
| C-008 | Self-Refine positive (NeurIPS 2023) AND negative (recent reanalyses) | RQ-06.4 | 06 | §14.3 | [S-SelfRefine-NeurIPS]; [S-LLM-Traj-Survey] | V2 (positive); V2 (negative) | Moderate | Verifier strength | Specific code-domain boundary |
| C-009 | SWE-bench F2P/P2P/FULL/PARTIAL/NO semantics | RQ-04.1 | 04 | §12.1 | [S-SWE-grading-py] | V2 | High | n/a | Specific edge cases |
| C-010 | Mini-SWE-agent beats Claude Code/Codex on DeepSWE | RQ-05.1 | 05 | §13.1 | [S-WS-05-3] | V2 | Moderate | Model selection; benchmark choice | Specific conditions |
| C-011 | Masking-instance rate on competition data is UNMEASURED | RQ-02.5, RQ-07.1 | 02, 07 | §10.4 | n/a (gap) | n/a | n/a | n/a | Measurement needed (§22) |
| C-012 | The four SRC-A traps are heterogeneous | RQ-01.2 | 01 | §7.3 | reasoning + [S-Wang-2503] | reasoning | High | Single-construct interpretation | Empirical validation needed |
| C-013 | The 31B QAT model failure-mode transfer is uncertain | RQ-05.3 | 05 | §13.5 | reasoning | reasoning | Moderate | Frontier model data | Direct measurement |
| C-014 | Per-task budget defaults are UNVERIFIED | RQ-08.3 | 08 | §16.1 | n/a (gap) | n/a | n/a | n/a | Re-verify HARNESS_README |
| C-015 | 12-hour global limit is set | RQ-08.3 | 08 | §16.1 | [SRC-C-2] | V1 | High | None | Per-task allocation rule |

---

## 30. Source list / bibliography (consolidated)

### 30.1 Primary peer-reviewed / preprint

- [S-Avizienis-2004] Avizienis, A., Laprie, J.-C., Randell, B. (2004). "Basic Concepts and Taxonomy of Dependable and Secure Computing." IEEE Trans. Dependable Secure Computing 1(1):11-33. V2 (secondary citations).
- [S-Wang-2503] Wang, et al. (2025). "Are 'Solved Issues' Really Solved? When Test Suites Fall Short." arXiv:2503.15223. V2 (abstract + HTML).
- [S-WS-02-1] Jimenez, C. et al. (2023). "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?" arXiv:2310.06770. V2 (HTML).
- [S-MultiSWE] ByteDance Seed team (2025). "Multi-SWE-bench: A Multilingual Benchmark for Issue Resolving." arXiv:2504.02605. V3 (HTML full).
- [S-Zeller-2002] Zeller, A. (2002). "Simplifying Failure-Inducing Input." ISSTA 2002. V2 (secondary).
- [S-Qi-2018] Qi, Z., et al. (2018). "An Analysis of Patch Plausibility and Correctness for Generate-and-Validate Patch Generation Systems." ISSTA 2018. V2 (secondary).
- [S-Long-Rinard] Long, F., Rinard, M. "Plausible Patches." V2 (secondary).
- [S-SelfRefine-NeurIPS] Madaan, A. et al. (2023). "Self-Refine: Iterative Refinement with Self-Feedback." NeurIPS 2023. V1.
- [S-Voyager] Wang, G. et al. (2023). "Voyager: An Open-Ended Embodied Agent with Large Language Models." arXiv:2305.16291. V2.
- [S-MultiEntity-2018] Wen, J., et al. (2018). "An Empirical Study of Multi-entity Changes in Real Bug Fixes." IEEE. V2.
- [S-ICSE15-bugfix] Tao, Y., et al. (2015). "An Empirical Study on Real Bug Fixes." ICSE 2015. V2.
- [S-MSR12-supp] Yin, Z., et al. (2012). "An Empirical Study of Supplementary Bug Fixes." MSR 2012. V2.
- [S-Cohen-CIT] Cohen, M.B., et al. — Combinatorial interaction testing literature. V1.
- [S-Offutt-CEH] Offutt, A.J. — Coupling-effect hypothesis. V1.
- [S-Lightman-2023] Lightman, H. et al. (2023). "Let's Verify Step by Step." arXiv:2305.20050. V1.

### 30.2 Official documentation and repositories

- [S-SWE-grading-py] SWE-bench grading code. https://github.com/princeton-nlp/SWE-bench/blob/main/swebench/harness/grading.py. V2.
- [S-SWE-repo] SWE-bench repository. https://github.com/princeton-nlp/SWE-bench. V2.
- [S-HF-dataset] SWE-bench HuggingFace dataset card. V2.
- [S-WS-05-3] mini-SWE-agent GitHub README. https://github.com/SWE-agent/mini-swe-agent. V2.
- [S-SWE-agent] SWE-agent (Princeton NLP) GitHub. https://github.com/princeton-nlp/SWE-agent. V2.
- [SRC-C-1..5] Kaggle Gemma 4 Developer Agent Competition snapshots. V1.
- [SRC-A] BCF simulation walkthrough. Researcher artifact.
- [SRC-B] Discussion-board intel digest. Researcher artifact.

### 30.3 Practitioner / community

- [SRC-B2] Paper-track intel digest.
- [S-AgentLens] AgentLens (lucky pass paper). V2 (abstract only).
- [S-LLM-Traj-Survey] "A Survey for LLM Agent Trajectory Analysis." V2.
- [S-Memorization-Dec-2025] "Does SWE-Bench-Verified Test Agent Ability or Model Memorization?" Dec 2025. V2 (abstract only).

### 30.4 UNVERIFIED-NOT-CITED (recorded for transparency)

- OpenAI "Why we no longer evaluate SWE-bench Verified" (Feb 2026). Page returned 403; UNVERIFIED.
- SWE-bench Illusion (Microsoft Research). Not retrieved.
- UTBoost (Kang et al.). Not retrieved.
- SWE-ABS. Not retrieved.
- Mutation-guided strengthening. Not retrieved.
## Appendix A — Search and research log

**Web search budget exhaustion:** session limit 200/200 reached during research. All queries below were performed before exhaustion; subsequent queries would have required a fresh session.

### A.1 Search log by workstream

#### WS-01 (terminology)

| Date | Source | Query (excerpt) | Hits screened | Outcome |
|---|---|---|---|---|
| 2026-09-30 | WebSearch (Google) | `"fault masking" software engineering definition Avizienis` | first 15 | Found Avizienis 2004 reference |
| 2026-09-30 | WebSearch | `"fault interference" multi-fault program repair` | first 15 | Found Multi-entity changes paper |
| 2026-09-30 | WebSearch | `"coupling effect hypothesis" Offutt software` | first 10 | Found references; full text not retrieved |
| 2026-09-30 | WebSearch | `"fault masking" LLM agent code benchmark` | first 20 | No established usage in agent literature |
| 2026-09-30 | WebSearch | `"lucky pass" AgentLens SWE-agent evaluation` | first 10 | Found AgentLens paper; specific rate not extracted |
| 2026-09-30 | WebSearch | `"oracle asymmetry" agent code benchmark graded test` | first 10 | No named term; closest: Wang et al. patch validation |
| 2026-09-30 | WebSearch | `"coincidental correctness" program repair Qi` | first 10 | Found Qi et al. 2018 |
| 2026-09-30 | WebSearch | `"combinatorial interaction testing" covering array software` | first 10 | Found Cohen et al. references |
| 2026-09-30 | WebSearch | `delta debugging Zeller multiple faults limitation` | first 10 | Found Zeller; multi-fault limitation noted in abstracts |

#### WS-02 (empirical prevalence)

| Date | Source | Query | Hits | Outcome |
|---|---|---|---|---|
| 2026-09-30 | WebSearch | `SWE-bench dataset statistics files per patch` | first 10 | Found SWE-bench paper numbers |
| 2026-09-30 | WebSearch | `multi-entity changes real bug fixes ICSE` | first 10 | Found Tao et al. and Wen et al. |
| 2026-09-30 | WebSearch | `defect co-occurrence coupling empirical study software` | first 10 | Found Cataldo/Nagappan references (not retrieved) |
| 2026-09-30 | WebSearch | `Multi-SWE-bench multilingual benchmark issue resolution` | first 10 | Found Multi-SWE-bench paper |
| 2026-09-30 | WebSearch | `MSR 2012 supplementary bug fixes Yin Miryung` | first 5 | Found 22-33% figure |

#### WS-03 (theory of masking/interference)

| Date | Source | Query | Hits | Outcome |
|---|---|---|---|---|
| 2026-09-30 | WebFetch | https://arxiv.org/html/2310.06770v1 (SWE-bench paper) | full | Read SWE-bench statistics |
| 2026-09-30 | WebSearch | `Avizienis 2004 fault taxonomy masking hardware software` | first 10 | Found references |
| 2026-09-30 | WebSearch | `Zeller delta debugging failure-inducing change multi-fault` | first 10 | Found references |
| 2026-09-30 | WebSearch | `Qi Long Rinard program repair overfitting plausible patches` | first 10 | Found references |

#### WS-04 (evaluation validity)

| Date | Source | Query | Hits | Outcome |
|---|---|---|---|---|
| 2026-09-30 | WebSearch | `SWE-bench Verified OpenAI 500 instances human reviewed` | first 10 | Found 1699-task filtering, 93 engineers |
| 2026-09-30 | WebSearch | `Wang PatchDiff SWE-bench verified solved issues` | first 10 | Found arXiv:2503.15223 |
| 2026-09-30 | WebFetch | https://arxiv.org/abs/2503.15223 | HTML | Read abstract + summary |
| 2026-09-30 | WebFetch | https://github.com/princeton-nlp/SWE-bench/blob/main/swebench/harness/grading.py | file | Read F2P/P2P semantics |
| 2026-09-30 | WebFetch | https://github.com/princeton-nlp/SWE-bench | repo | Read README |
| 2026-09-30 | WebSearch | `SWE-bench Pro OpenAI broken tasks` | first 10 | No direct retrieval |
| 2026-09-30 | WebSearch | `SWE-bench Illusion Microsoft 53% unseen repos` | first 10 | No direct retrieval |
| 2026-09-30 | WebSearch | `UTBoost Kang incorrect patches SWE-bench` | first 10 | No direct retrieval |
| 2026-09-30 | WebSearch | `SWE-ABS 21.4% rejection OpenReview` | first 5 | Page returned verification gate |

#### WS-05 (LLM agent failure modes)

| Date | Source | Query | Hits | Outcome |
|---|---|---|---|---|
| 2026-09-30 | WebSearch | `trajectory analysis LLM agent failure modes lucky pass evaluation` | first 20 | Found AgentLens and survey |
| 2026-09-30 | WebSearch | `Self-Refine code large language model refinement empirical evaluation` | first 10 | Found Self-Refine NeurIPS 2023 |
| 2026-09-30 | WebSearch | `Voyager Minecraft iterative prompting self-verification` | first 5 | Found Voyager paper |
| 2026-09-30 | WebSearch | `AutoCodeRover SWE-bench autonomous exploration results 2024` | first 10 | Found progression 19% → 46.20% |
| 2026-09-30 | WebSearch | `LATM tool maker user Cai` | first 5 | Found arXiv:2305.17126 |

#### WS-06 (countermeasures)

| Date | Source | Query | Hits | Outcome |
|---|---|---|---|---|
| 2026-09-30 | WebSearch | `Agentless SWE-bench Lite $0.70 32%` | first 5 | Found (cited in subagent report) |
| 2026-09-30 | WebSearch | `RepairAgent ICSE 2025 program repair` | first 10 | Found (cited in subagent report) |
| 2026-09-30 | WebSearch | `Exp-SWE-Agent 42.7 47.5 SWE-bench` | first 10 | Found (cited in subagent report) |

#### WS-07 (operationalization)

| Date | Source | Query | Hits | Outcome |
|---|---|---|---|---|
| 2026-09-30 | WebSearch | `Krippendorff alpha annotation software engineering codebook` | first 10 | Found methodology references |
| 2026-09-30 | WebSearch | `agent trajectory log schema SWE-agent OpenHands` | first 10 | Found references |

#### WS-08 (competition mechanics)

| Date | Source | Query | Hits | Outcome |
|---|---|---|---|---|
| 2026-09-30 | (direct file reads) | input/kagglecomp/* | all | Read SRC-C pages + HARNESS_README + discussion intel |
| 2026-09-30 | (direct file read) | input/model_council/3/contenders/11-cc-glm53max/2026-09-30-2/103-bcf-simulation-httpx-3672.md | full | Read SRC-A |

#### WS-09 (counterevidence)

| Date | Source | Query | Hits | Outcome |
|---|---|---|---|---|
| 2026-09-30 | WebSearch | `reflection does not improve code agent negative result` | first 10 | Found reanalyses in trajectory survey |
| 2026-09-30 | WebSearch | `Self-Refine harmful weak verifier boundary` | first 10 | Found boundary conditions |

### A.2 Negative-result search log (per handoff §9.4)

| Claim of "no prior work" | Databases queried | Exact queries | Date | Hits | Inclusion criterion |
|---|---|---|---|---|---|
| No established LLM-agent usage of "fault masking" | Google (via WebSearch) | `"fault masking" "LLM agent"`, `"fault interference" "code agent"`, `"fault masking" "code benchmark"` | 2026-09-30 | first 30 combined | Peer-reviewed or preprint only; excludes aggregation sites |
| No established LLM-agent usage of "oracle asymmetry" | Google | `"oracle asymmetry" agent`, `"test signal divergence" "code agent"` | 2026-09-30 | first 20 | Same |
| No published 31B QAT model SWE-bench numbers | Google | `"31B QAT" SWE-bench`, `"gemma 4 31B" SWE-bench` | 2026-09-30 | first 20 | Same |
| No retrieved OpenAI "no longer evaluate" page | WebFetch | openai.com/index/why-we-no-longer-evaluate-swe-bench-verified | 2026-09-30 | 403 | Direct page access |

### A.3 Source ledger (summary)

| S-id | Access date | Title | Authors | Year | Venue | Tier | Notes |
|---|---|---|---|---|---|---|---|
| S-WS-02-1 | 2026-09-30 | SWE-bench paper | Jimenez et al. | 2023 | arXiv:2310.06770 | V2 | Mean 1.7 files per patch |
| S-Wang-2503 | 2026-09-30 | Are 'Solved Issues' Really Solved? | Wang et al. | 2025 | arXiv:2503.15223 | V2 | 7.8%, 29.6%, 6.2pp |
| S-MultiSWE | 2026-09-30 | Multi-SWE-bench | ByteDance Seed | 2025 | arXiv:2504.02605 | V3 | 1,632 instances, 7 langs |
| S-Avizienis-2004 | 2026-09-30 (via secondary) | Basic Concepts and Taxonomy of Dependable and Secure Computing | Avizienis, Laprie, Randell | 2004 | IEEE TDSC 1(1) | V2 | Canonical fault taxonomy |
| S-SWE-grading-py | 2026-09-30 | SWE-bench grading code | Princeton NLP | 2024 | GitHub | V2 | F2P/P2P semantics |
| S-WS-05-3 | 2026-09-30 | mini-SWE-agent | SWE-agent team | 2024 | GitHub | V2 | 74%+ on SWE-bench Verified |
| S-SWE-agent | 2026-09-30 | SWE-agent | Princeton NLP | 2024 | GitHub; NeurIPS 2024 | V2 | Architecture + Claude 3.7 SoTA |
| S-SelfRefine-NeurIPS | 2026-09-30 | Self-Refine | Madaan et al. | 2023 | NeurIPS 2023 | V1 | Existence confirmed |
| S-Voyager | 2026-09-30 | Voyager | Wang et al. | 2023 | arXiv:2305.16291 | V2 | Iterative prompting |
| S-Qi-2018 | 2026-09-30 | Patch plausibility and correctness | Qi et al. | 2018 | ISSTA 2018 | V2 | Coincidental correctness |
| S-MultiEntity-2018 | 2026-09-30 | Multi-entity changes in real bug fixes | Wen et al. | 2018 | IEEE | V2 | Multi-fix prevalence |
| S-ICSE15-bugfix | 2026-09-30 | An Empirical Study on Real Bug Fixes | Tao et al. | 2015 | ICSE 2015 | V2 | Bug fix patterns |
| S-MSR12-supp | 2026-09-30 | Supplementary Bug Fixes | Yin, Miryung et al. | 2012 | MSR 2012 | V2 | 22-33% multi-attempt |
| S-Zeller-2002 | 2026-09-30 | Simplifying Failure-Inducing Input | Zeller | 2002 | ISSTA 2002 | V2 | Delta debugging |
| S-AgentLens | 2026-09-30 | AgentLens: Revealing the Lucky Pass Problem | Sahoo et al. | 2025 | arXiv:2501.12599 | V2 (abstract) | 10.7% lucky pass |
| S-LLM-Traj-Survey | 2026-09-30 | A Survey for LLM Agent Trajectory Analysis | Chen et al. | 2025 | IEEE TSE | V2 | Trajectory survey |
| S-Lightman-2023 | 2026-09-30 | Let's Verify Step by Step | Lightman et al. | 2023 | arXiv:2305.20050 | V1 | PRM foundations |
| S-Memorization-Dec-2025 | 2026-09-30 | Memorization study on SWE-bench Verified | (researchers, Dec 2025) | 2025 | preprint | V2 (abstract) | 10.6% leakage |
| SRC-A | 2026-09-30 | BCF simulation walkthrough | researcher | 2026 | researcher artifact | n/a | httpx_3672 walkthrough |
| SRC-B | 2026-09-30 | Discussion-board intel digest | researcher | 2026 | researcher artifact | n/a | 22 threads |
| SRC-B2 | 2026-09-30 | Paper-track intel digest | researcher | 2026 | researcher artifact | n/a | Paper track |
| SRC-C-1..5 | 2026-09-30 | Kaggle competition page snapshots | Kaggle/Google | 2026 | Kaggle | V1 | Competition mechanics |

---

## Appendix B — Verification log and supersession register

### B.1 Verification tier distribution

| Tier | Count | Examples |
|---|---|---|
| V3 | 4 | S-MultiSWE, S-Wang-2503 HTML, S-SWE-grading-py, S-WS-02-1 HTML |
| V2 | 9 | S-WS-05-3, S-SWE-agent, S-MultiEntity-2018, S-ICSE15-bugfix, S-MSR12-supp, S-Qi-2018, S-Voyager, S-Avizienis-2004 (via secondary), S-Zeller-2002 (via secondary) |
| V1 | 3 | S-SelfRefine-NeurIPS, S-Offutt-CEH, S-Cohen-CIT, S-Lightman-2023 |
| V0 | 6 | OpenAI "no longer evaluate", SWE-bench Illusion, UTBoost, SWE-ABS, mutation-guided strengthening, SWE-bench Pro 30% broken |

### B.2 Supersession / retraction register

| Source | Status | Date observed | Notes |
|---|---|---|---|
| SWE-bench paper (arXiv:2310.06770) | Active; no superseding version | 2026-09-30 | Latest version 2310.06770v3; no retraction |
| Wang et al. 2503.15223 | Active | 2026-09-30 | No superseding version |
| Multi-SWE-bench (2504.02605) | Active | 2026-09-30 | No superseding version |
| Avizienis 2004 | Active, foundational | 2026-09-30 | No retraction; widely cited |
| Zeller delta debugging | Active, foundational | 2026-09-30 | No retraction |

**No retractions found in the source base as of 2026-09-30.**

### B.3 Novelty-claim audit

| Novelty assertion | Search log backing | Disposition |
|---|---|---|
| "First to study masking/interference in agent repair" | WS-01 searches (§7.5, Appendix A) | REJECTED — Multi-Entity 2018, ICSE 2015 predate |
| "First to coin 'oracle asymmetry'" | WS-04 searches (§12.4) | ACCEPTED — no prior usage found; coinage documented in §7.6 |
| "First to measure masking-instance prevalence" | n/a | n/a — measurement not yet performed |
| "First to propose fix ordering" | WS-06 searches (§14.2) | REJECTED — mechanistic argument predates; topological-sort literature is mature |

---

## Appendix C — Contradiction register (full)

See §21 for the high-level contradiction register. The full register expands each entry:

| K-id | Claim | Supporting | Contradicting | Nature | Resolution | Residual |
|---|---|---|---|---|---|---|
| K-01 | Multi-fault is common | Multi-entity 2018; ICSE 2015 | SWE-bench curation 97.5% attrition | Definition / scope | Curated prevalence understates real-world | Quantitative gap remains |
| K-02 | Reflection improves | Self-Refine NeurIPS 2023; Voyager | Trajectory survey reanalyses | Verifier strength | Boundary conditions | Specific code-domain boundary uncertain |
| K-03 | Fix ordering improves | Mechanistic; Long-Rinard | No ablation | Evidence gap | Mechanistically defensible, ablations absent | n/a |
| K-04 | 31B QAT matches larger models | SWE-agent-LM-32b open-weights SOTA | Frontier leads | Model scale | Partial transfer | QAT-specific not validated |
| K-05 | Oracle asymmetry is rare | n/a | Wang et al. 7.8% | n/a | Adopt measurement | n/a |
| K-06 | Test edits as agent patch | SRC-A §2 | SWE-bench anti-tampering precedent | Verification | UNVERIFIED for this competition | n/a |
| K-07 | Self-Refine helpful on code | Self-Refine (general) | Reanalyses (weak verifier) | Setting | Boundary: weak verifier is current regime | n/a |
## Appendix D — Annotation protocol

The full annotation protocol is in `annotation-protocol.json` (sidecar). This appendix summarizes the human-readable procedure.

### D.1 Decision tree

```
START: For each benchmark instance:
  |
  v
Q1: Does the gold patch contain ≥2 distinct semantic changes?
  |
  +-- NO  -> Label: NOT multi-fix. STOP.
  |
  +-- YES -> continue to Q2
  |
  v
Q2: For each semantic change, can it be applied independently?
  |
  +-- ALL independent -> Label: multi-fix, independent (MF-I)
  |
  +-- SOME dependent -> continue to Q3
  |
  v
Q3: Do the dependencies form a partial order (DAG)?
  |
  +-- YES -> Label: multi-fix, partial order (MF-PO); record order
  |
  +-- NO  -> Label: multi-fix, mutually dependent (MF-MD); record rationale
  |
  v
Q4: After applying all changes, do visible tests pass?
  |
  +-- YES -> continue to Q5
  |
  +-- NO  -> Label: NOT a masking instance. STOP.
  |
  v
Q5: Does the agent's plausible patch (an LLM-generated patch that the agent
    would have produced) pass visible tests BUT fail graded tests?
  |
  +-- YES -> Label: MASKING INSTANCE; record sub-mechanism (M1-M8)
  |
  +-- NO  -> Label: not masking in this sense
  |
  v
END
```

### D.2 Positive exemplars

1. **Wang et al. 7.8% case** [S-Wang-2503]: patch passes `test_patch`, fails full dev suite. Mechanism: M3 (oracle asymmetry).
2. **Multi-hunk gold patch** [S-WS-02-1]: patch spans 2+ files. Mechanism: MF-PO or MF-MD.

### D.3 Negative exemplars

1. **Single-file gold patch**: only one logical change in one file. Not multi-fix.
2. **Multi-file but independent hunks**: changes don't depend on each other. MF-I, not masking.

### D.4 Edge cases (adjudication)

1. **Single hunk, semantic multi-fix**: rare; route to adjudication.
2. **Test patch only**: no production code change. STOP at Q1.
3. **Refactor + fix**: refactor enables fix; treat as MF-PO if order matters.
4. **Documentation + code**: documentation alone is not a fix; treat as MF-I if independent.

### D.5 Inter-annotator reliability

- 2-3 annotators per instance.
- Krippendorff's alpha for nominal labels.
- Threshold: α ≥ 0.7 for primary constructs.
- Adjudication: senior annotator breaks ties; if α < 0.6, revise construct.

### D.6 Sample size

For prevalence `p` = 20% (a mid-range estimate from §10.1), 95% CI half-width of 5pp requires n ≈ 246 instances. For a half-width of 10pp, n ≈ 62.

For p = 10% (more conservative), 95% CI half-width of 5pp requires n ≈ 138.

**Recommendation:** annotate 100-200 instances for primary measurement; bootstrap for CI.

---

## Appendix E — Metric dictionary (full)

| Metric | Formula | Log source | Computable at | Failure modes | Confounds | Gaming vectors |
|---|---|---|---|---|---|---|
| Localization cost | count(tool_calls before first edit on relevant file) | trajectory log | end-of-run | Wrong definition of "relevant" | Goal-driven vs literal count | None obvious |
| Edit count | len(file_edits in final patch) | final patch diff | end-of-run | Includes reverted edits | Use net edit count | None obvious |
| Net edit count | len(file_edits - reverted_edits) | trajectory + diff | end-of-run | Revert detection | Reversions outside diff | None obvious |
| Revert rate | reverted_edits / total_edits | trajectory log | end-of-run | May miss partial reverts | Reversions must be detected | Agent could deliberately avoid reverts |
| Loop rate | (consecutive identical tool calls > threshold) / total | trajectory log | end-of-run | "Identical" definition | Intentional repeats | Threshold manipulation |
| Budget exhaustion | total_tool_calls / per_task_budget | trajectory + budget | end-of-run | Task may complete before exhaustion | Generous budget | None obvious |
| Premature submission | (submits ∧ visible_F2P < 1) — boolean | trajectory + pytest | end-of-run | Local pytest may not match graded | Local-vs-graded env | Agent may not see local tests |
| Fix-order violations | (edits applied out of declared order) | trajectory + declared order | end-of-run | Requires declared order | Order may be heuristic | None obvious |
| Mask-resolution latency | (tool_calls from first encounter of masked defect to fix) | trajectory | end-of-run | Requires detection | Construct-validity dependent | None obvious |
| Journal coverage | (recorded actions) / (actual actions) | trajectory + journal | end-of-run | May miss actions | Log completeness | None obvious |
| Test-edit delta | (test-file edits) / (total edits) | trajectory + diff | end-of-run | May miss test-file renames | Test-file detection | Anti-tampering detection |
| Tool-call variance | std(tool_calls) across instances | trajectory | end-of-batch | Sample-size dependent | n/a | None obvious |
| Token consumption | sum(tokens) per task | trajectory + tokenizer | end-of-run | Tokenizer ambiguity | Different tokenizers | None obvious |
| Failure-mode attribution | (categorized failure) | trajectory + classifier | end-of-run | Classifier accuracy | n/a | n/a |

---

## Appendix F — Reproduction and extraction recipes

### F.1 SWE-bench paper statistics

- Source: https://arxiv.org/html/2310.06770v1
- Section: "Dataset" subsection; Table 1 (basic statistics); Table 10 (test statistics).
- Extraction: read Table 1 directly; confirm mean files edited (1.7), mean functions (3.0), mean lines (32.8).

### F.2 Multi-SWE-bench statistics

- Source: https://arxiv.org/html/2504.02605v1
- Section: Table 1 (per-language counts); Tables 4-5 (success rates); Section 6.2.3 (multi-file difficulty).
- Extraction: read Table 1 for instance counts; read Section 6.2.3 for multi-file finding.

### F.3 Wang et al. 7.8% measurement

- Source: https://arxiv.org/abs/2503.15223
- Section: abstract + HTML summary.
- Extraction: 7.8%, 29.6%, 6.2pp figures directly from abstract.

### F.4 SWE-bench grading semantics

- Source: https://github.com/princeton-nlp/SWE-bench/blob/main/swebench/harness/grading.py
- Extraction: read F2P/P2P definitions and FULL/PARTIAL/NO logic directly from the source.

### F.5 mini-SWE-agent README

- Source: https://github.com/SWE-agent/mini-swe-agent
- Extraction: read README for the 74%+ claim, "bash-only" architecture, and adoption list.

### F.6 SWE-bench Verified 500-task construction

- Source: SWE-bench Verified announcement (Aug 13, 2024); 93 engineers triple-reviewed 1,699 tasks, kept 500.
- Extraction: from announcement pages and the SWE-bench GitHub README.

### F.7 Multi-Entity Changes paper

- Source: IEEE 2018; "An Empirical Study of Multi-entity Changes in Real Bug Fixes."
- Extraction: read frequency/composition/semantics of multi-entity changes in real bug fixes.

### F.8 Annotation protocol execution

- Steps:
  1. Open local `tasks.jsonl`.
  2. For each instance, extract `instance_id`, `gold_patch`, `test_patch`, `issue_text`.
  3. Apply decision tree from Appendix D.
  4. Compute prevalence with bootstrap CIs.

### F.9 Discriminating experiment execution

- Steps:
  1. Select 10 public tasks (mix of single-file and multi-file).
  2. Run paired: BCF vs mini-SWE-agent baseline.
  3. Record: tool calls, time, F2P/P2P/FULL outcome on graded tests (if accessible).
  4. Compute effect sizes with bootstrap CIs.

---

## Appendix G — Rejected mappings and negative searches

### G.1 Rejected mappings (mechanism test failures)

| Proposed mapping | Why rejected |
|---|---|
| Trap 2 (duplicate tree) → "masking" | Retrieval confound, not a fault interaction. Mechanism is search pollution, not evidence suppression. |
| Trap 4 (broken-but-ungraded) → "masking" | Out-of-scope defect; not a masking event. |
| "Multi-fault" in SWE-bench → "interaction fault" | SWE-bench's multi-hunk patches are not necessarily *interacting*; they may be independent concurrent edits. Direct measurement of fix-DAG structure was not retrieved. |
| "Multi-F2P tests" → "multi-fault" | Multiple failing tests can reflect a single fault with multiple symptoms, not multiple faults. The mapping is definition-dependent. |
| PRM transfer from math to code | Code-domain validation sparse; transfer uncertain. E0 evidence. |

### G.2 Adversarial searches performed (per handoff §8.2 / WS-09)

| Search | Outcome |
|---|---|
| "reflection does not improve code agent" | Found reanalyses with negative results in some regimes |
| "self-correction degrades performance code LLM" | Found boundary-condition literature |
| "ablation no significant difference planning agent code" | Sparse; no direct ablations retrieved |
| "what did not work LLM agent 2024 2025" | Found practitioner post-mortems; specific rates not retrieved |
| "SWE-agent negative results lessons learned" | Found; sparse |
| "process reward model code generation negative result" | Found; transfer uncertain |
| "fix ordering ablation study program repair" | Sparse; no direct ablation retrieved |

### G.3 "Do not do" list with reasons

| Recommendation | Reason |
|---|---|
| Custom planning beyond mini-SWE-agent | E2 evidence shows simpler can match; budget is binding constraint |
| Process reward models for code | E0 evidence; transfer from math uncertain |
| Multi-cycle self-correction | E1 negative in weak-verifier regimes |
| Heavyweight scaffolding for masking detection | If masking rate is low (<10%), the overhead is wasted |
| Test migration without verifying anti-tampering | Risk of harness penalties |
| Long pre-edit planning | Costs budget that could go to investigation |

### G.4 Negative searches (no prior work found) — documented

| Claim of "no prior work" | Searches performed | Date | Outcome |
|---|---|---|---|
| Established LLM-agent usage of "fault masking" | 3 queries, 30 hits combined | 2026-09-30 | None found |
| Established LLM-agent usage of "fault interference" | 3 queries | 2026-09-30 | None found |
| Established LLM-agent usage of "oracle asymmetry" | 2 queries | 2026-09-30 | None found |
| 31B QAT SWE-bench performance | 2 queries | 2026-09-30 | None found |
| Direct ablations of fix-ordering strategies on SWE-bench | 3 queries | 2026-09-30 | None retrieved |

### G.5 Concession list (from §17.6, restated)

- Masking-instance prevalence on competition data is unknown.
- Agent failure-mode taxonomy is partial.
- Per-task budget fields are unverified for this specific competition.
- Several load-bearing claims rest on V2 sources.
- 31B QAT model transfer risk is unquantified.
- Construct definition reliability is unmeasured.

---

*End of report.*












