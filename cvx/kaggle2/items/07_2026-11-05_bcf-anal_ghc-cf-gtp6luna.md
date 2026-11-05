# COMBINED MARKDOWN - combine

_Generated 2026-11-05 16:51:56 | 4 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle2\items\combine_

## Contents

1. 00_Executive_Brief_and_Contest_Strategy-ghc-cf-gpt6luna.md
2. 01_BCF_Formal_Specification.md
3. 02_Paper_Draft_BCF.md
4. 03_Experiment_Plan_and_Runbook.md

---

<!-- ====================================================================== -->
<!-- FILE: 00_Executive_Brief_and_Contest_Strategy-ghc-cf-gpt6luna.md -->
<!-- ====================================================================== -->

# BCF and the Gemma 4 Developer Agent Paper Track

*Decision brief and practical submission strategy*  
*Research checked: 2026-11-05*

## Bottom line

**Yes—with a narrower, empirical framing.** The underlying idea is relevant to the contest, but “a constitution for better coding” is too broad to be a strong paper by itself. The promising paper is about **risk-gated, evidence-carrying repair**: a small coding agent first maps the repository, converts the issue into traceable atomic claims, proposes a patch in a clean-room stage, routes changes through one permission gate, then verifies and records the result. The proposed contribution is not that BCF guarantees correct or monotonically improving output; it is a reproducible protocol and test of whether these controls improve patch success, efficiency, and auditability for a constrained local coding model. In the Kaggle implementation, only call the gate “enforceable” if a restricted tool setup or whitelisted skill script actually prevents bypass; a prompt-only gate is advisory.

**Status:** This deliverable contains the framework specification, strategy, paper starter, and experiment protocol. No BCF agent was implemented or run in the Kaggle evaluation environment during this task, no BCF-vs-baseline results are available, and no Kaggle submission was made. The paper draft is not ready to submit until the experiment's actual outcomes (or an honestly scoped alternative contribution) replace the marked placeholders.

The fit is genuine: Kaggle explicitly accepts original research on agentic software engineering and highlights code comprehension, graphs, and tools. But the judges give equal weight to **novelty, quality/generalization, relevance, verifiability, and clarity**. A workflow description with no experiment will struggle on novelty and verifiability. The Paper Track is a separate competition from the main developer-agent leaderboard; entering the paper track does not require entering the main one. Its page currently states a **3,000-word maximum** and a final deadline of **November 12, 2026, 11:59 PM UTC**—**November 12, 6:59 PM Eastern (UTC-5)**. The page lists a $15,000 Overall Best Paper award, $10,000 Best New Resource, and $10,000 Best New Application. The official live page was checked today; submit early, since drafts not finally submitted by the deadline are excluded. The main agent track has a later final submission deadline of **December 2, 2026, 11:59 PM UTC**. [Paper Track](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/overview); [main competition](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview)

## What makes the idea coherent—and what needs correction

The constitution coheres as a lifecycle with a control plane: find evidence, trace it, propose a bounded change, authorize it, test it, and preserve a portable record. “Always preserve working code” is a requirement to minimize blast radius, record state, and verify—not a guarantee that a change cannot regress. “Always produce value” should be reframed as **always leave an honest, useful artifact**: a verified fix, a verified no-op, or a clear evidence-based blocker and next step. The expression \(x' > x\) is motivational until “value,” the baseline, and the evaluation population are defined. A model cannot promise positive utility for every possible input.

The “source of truth” should be versioned and plural: the code at a pinned commit, project instructions, executable tests, API documentation, and graph/retrieval results have different authority. Each output claim should identify its source and whether it is observed, derived, a hypothesis, or unknown. Code tests are strong evidence, but they are not proof that all behavior is correct.

The search ideas are sound as conditional strategies, not compulsory steps. Breadth-first mapping reduces premature fixation; depth-first tracing investigates a promising path; binary search is useful only with an ordered search space and a valid signal. Git history bisection is inappropriate when the benchmark snapshot removes forward commit history.

## Evidence and positioning

This area already has strong prior art. SWE-bench made real GitHub issue resolution a benchmark task. SWE-agent showed that a carefully designed agent-computer interface can affect coding-agent performance. Agentless showed that a simpler, interpretable localization → repair → validation process can be highly competitive and questioned whether complex autonomous loops are necessary. These works are reasons to make BCF **simple and measurable**, not to claim that its individual ingredients are novel. [SWE-bench](https://arxiv.org/abs/2310.06770); [SWE-agent](https://arxiv.org/abs/2405.15793); [Agentless](https://arxiv.org/abs/2407.01489)

The local contest package is unusually relevant: it contains 129 public development tasks, reference fixes and verification tests, plus AST/code graphs and embeddings. The supplied analysis reports skew across four repositories and issue-description/curation limitations; it also identifies related task chains. This lets BCF connect repository evidence to graph nodes and tests, while requiring leakage-aware splits and careful reporting. The main-track verifier grades patches by tests, not by whether an agent’s explanation sounds plausible. See the [supplied dataset analysis](../2026-11-05_Gemma4_Problem_Dataset_Taxonomy_and_Analysis/01_Deep_Wide_Research_and_Executive_Synthesis.md) and [harness reference](../../input/kagglecomp/kagglecomp_data_package/HARNESS_README.md).

Community reports in the supplied November 5 forum intelligence describe tool serialization, parser, context, adapter, and timeout failures. Treat these as **operational leads**, not organizer-verified scientific findings. They support stress-testing the harness and favoring a minimal single-agent prototype over an elaborate multi-agent hierarchy; they should not be used as evidence that BCF improves task resolution.

There is already substantial internal BCF design work in this workspace. The prior local-testing guide, formal specification, and September whitepaper draft describe graph-first localization, evidence records, permission gates, and evaluation ladders—but the inspected material labels its proposed case studies and results as unmeasured or illustrative. The earlier evaluation plans also use incompatible task counts and split schemes. This new 24-task development / approximately 105-task paired evaluation is the specific proposed protocol for the Nov 12 submission; it supersedes those plans only if it is actually executed. Otherwise report which protocol was run. Position the paper as a **careful empirical evaluation and refinement of an existing BCF design**, not as the first articulation of every component. Do not reuse illustrative case numbers as results. See the [prior local-testing guide](../2026-10-31-rtx5090-local-testing-guide/06-bcf-improvement-loop.md), [prior formal specification](../2026-10-31-bcf-gemma4-whitepaper-bonus/01-bcf-formal-specification.md), and [prior whitepaper draft](../bcf-whitepaper-v3-2026-09-29/bcf-whitepaper-v3-2026-09-29.md).

## Recommended research question

> **Under matched model, tools, decoding settings, and time budget, does adding a BCF evidence packet and gated repair protocol to a simple repository-localization/repair/validation baseline improve verified patch resolution and reduce wasted tool use?**

Keep the first study focused. The experimental unit is a task run. The primary metric is the fraction of attempts whose patch applies and passes the task verifier. Secondary outcomes: time, tool calls, patch-application failure, evidence traceability, failed/repeated tool calls, and policy violations. Report all attempted tasks, reasons for failure, and uncertainty. Do not put expected outcomes in the results section.

## How to build a real BCF “brain”

Think of the brain as four components rather than one giant prompt:

1. **Versioned reference index:** repository commit, project documentation, tests, API docs, and code graph/embedding index with provenance.
2. **Atomic evidence ledger:** each claim linked to a path/symbol/test/tool result and labeled `observed`, `derived`, `hypothesis`, or `unknown`.
3. **Policy gate:** the only authority for changes; validates action scope, risk, and allowed tool capability before every mutation.
4. **Portable run record:** task, search trail, evidence, gate decisions, proposed and applied diff, commands, test outcomes, model/config versions, unresolved questions, and hashes.

For the first Kaggle implementation, use a **single stateful Gemma 4 agent with explicit phases**, built-in repository tools, and a strict small context/budget. The contest supports Gemma 4 31B, 12B, E4B, and E2B QAT W4A16-CT variants; every agent and subagent in one submission must use the same model. Start with one model and do not add fine-tuning or multi-agent orchestration before the process survives and the baseline is measured. The contest uses a restricted, competition-specific Agent Config compiler; generic ADK docs are experimental and say only Gemini models are currently supported, so follow Kaggle’s sample and harness rather than assuming generic ADK behavior. The live overview documents `run_skill_script`; a fixed whitelist script may implement the BCF gate if the agent is not also given direct mutating tools. Verify this tool boundary before describing it as enforced. [Overview](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview); [Getting Started](https://www.kaggle.com/code/ryanholbrook/getting-started-gemma-4-developer-agent); [ADK Agent Config](https://adk.dev/agents/config/)

The formal BCF gate, evidence-card schema, search policy, prompt, and acceptance criteria are in [BCF Formal Specification](./01_BCF_Formal_Specification.md). A practical matched experiment and one-week schedule are in [Experiment Plan and Runbook](./03_Experiment_Plan_and_Runbook.md). The paper starter is [Paper Draft](./02_Paper_Draft_BCF.md).

## Contest deliverable and realistic odds

The Paper Track requires a Kaggle Writeup with title/subtitle, abstract, introduction, research methods and experiments, and related work/citations. A code notebook is optional but must be public if linked. The paper can document the approach without a main-track entry. Papers are judged on five equal-weighted criteria, not leaderboard score alone.

BCF is a **plausible topic, not a proven winning topic**. Its strength is a concrete connection to graph-based code understanding and constrained agent reliability. Its main risk is novelty: a staged repair loop is close to existing work. To strengthen it, provide (a) an explicit evidence-card representation, (b) a genuinely enforceable single-point change gate where the contest harness permits it (or clearly label the gate as advisory), and (c) paired, controlled results showing what those components add over a simpler baseline. If the experiment cannot be completed, submit only if the writeup honestly frames a resource/tool contribution or a rigorous dataset/measurement result; do not dress a proposal up as an empirical finding.

## Next actions (in order)

1. Join the Paper Track and confirm the live deadline/submission path.
2. Freeze the BCF v0.1 spec and one primary hypothesis; do not keep expanding scope.
3. Implement a baseline and BCF variant using the same model, tools, and budget.
4. Smoke-test the 8-task set; fix crashes and confirm no gold patch/test leakage.
5. Run the predeclared paired sample, save raw traces/results, and compute uncertainty.
6. Fill the paper’s results table with actual numbers, limitations, and artifact links.
7. Quality-check word count, citations, tables, public notebook permissions, and final “Submit” status before the cutoff.

## Sources and local evidence

- Kaggle, [Gemma 4 Developer Agent Paper Track](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/overview), live page checked 2026-11-05.
- Kaggle, [Main competition overview](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview), [data](https://www.kaggle.com/competitions/gemma-4-developer-agent/data), and [rules](https://www.kaggle.com/competitions/gemma-4-developer-agent/rules).
- Jimenez et al., [SWE-bench](https://arxiv.org/abs/2310.06770), 2024.
- Yang et al., [SWE-agent](https://arxiv.org/abs/2405.15793), 2024.
- Xia et al., [Agentless](https://arxiv.org/abs/2407.01489), 2024.
- NIST, [AI Risk Management Framework 1.0](https://doi.org/10.6028/NIST.AI.100-1), 2023.
- Google SRE, [Postmortem Culture](https://sre.google/sre-book/postmortem-culture/).
- Local sources: [dataset synthesis](../2026-11-05_Gemma4_Problem_Dataset_Taxonomy_and_Analysis/01_Deep_Wide_Research_and_Executive_Synthesis.md), [issue compendium](../2026-11-05_Gemma4_Representative_Issues_Compendium_and_Deep_Research/01_Deep_Wide_Research_Synthesis_and_Cross_Ecosystem_Parallels.md), and [harness guide](../../input/kagglecomp/kagglecomp_data_package/HARNESS_README.md).


---

<!-- ====================================================================== -->
<!-- FILE: 01_BCF_Formal_Specification.md -->
<!-- ====================================================================== -->

# Batonic Coding Framework (BCF): a testable v0.1 specification

*Version: 0.1 — proposed operational definition, 2026-11-05*

## 1. Purpose and scope

The Batonic Coding Framework (BCF) is a risk-gated, evidence-carrying workflow for making software changes with human developers or coding agents. Its purpose is not to guarantee that every request can be solved. It is to make each attempted change bounded, traceable, reversible where possible, and verifiable—and to leave a useful, evidence-linked artifact when a change cannot safely be completed.

BCF is a process framework, not a new programming language, model, or claim that search, code graphs, testing, or postmortems are individually novel. Its research claim must be demonstrated by a concrete implementation and controlled comparison.

## 2. Constitution, made operational

| Principle | Operational meaning | Observable evidence |
|---|---|---|
| Preserve working code | Record the initial state, avoid unrelated edits, make a bounded change, and keep a recoverable diff. Never claim preservation solely because code compiles. | Baseline and final status; diff; targeted and regression test results |
| One permission authority | Every state-changing action passes through one deterministic policy gate. The model may propose an action but cannot authorize or bypass it. | Gate decision, policy version, action, scope, and reason |
| Fidelity proportional to risk | Record enough context to reproduce and triage a decision. Add detail when uncertainty, blast radius, irreversibility, or impact rises. | Evidence ledger and decision log with source locations |
| Reference-grounded reasoning | Distinguish observed facts from interpretations and hypotheses; tie claims to a versioned source of truth. | Source locator, repository commit/document version, and evidence excerpt or digest |
| Search as a strategy | Choose broad mapping, focused tracing, or a valid binary search based on the investigation. Do not prescribe one search order for every issue. | Search plan, visited locations, findings, and stopping reason |
| Clean-room synthesis | Draft a candidate solution from a frozen evidence packet without mutating the repository. | Proposed files/symbols, rationale, risks, and tests, all linked to evidence |
| Root-cause learning | Record what failed, why, how it was verified, and what generalizes. Promote lessons only after review; never learn from an unverified guess as though it were fact. | Postmortem linked to run, artifacts, and verification |
| Effort adapts to constraints | Allocate work to quality, time, compute, and risk constraints; preserve a minimum verification floor. | Declared budget, decisions, and actual resource use |

### The “x′ > x” aspiration

The original expression is best treated as a design aspiration, not a theorem. Let a task state be \(s_t\), and define an artifact's utility \(U\) from independently checkable properties: verified correctness, useful evidence, traceability, reversibility, and portability. A BCF run should aim for \(\Delta U = U(s_{t+1}) - U(s_t) > 0\), while avoiding unverified state changes. It cannot guarantee positive utility for every input or monotonic progress from a language model. A safe refusal, a verified no-op, or a reproducible blocker report may be a useful output; an unsupported “success” is not.

“Asymptotically greater” becomes testable only after choosing a population of tasks, a utility function, a baseline, and an evaluation horizon. Until then, it is not a mathematical property of BCF.

## 3. Core workflow

| Phase | Required operation | Exit condition |
|---|---|---|
| 0. Intake | Restate the requested outcome, non-goals, repository boundary, and resource limits. | A concise, testable task statement exists. |
| 1. Baseline | Identify the repository commit and worktree state; locate relevant project instructions; run or record available baseline checks. | Existing user changes are distinguished from agent changes; baseline limitations are explicit. |
| 2. Breadth search | Map candidate files, symbols, tests, dependencies, and relevant documentation. Use text search and graph/retrieval tools when available. | A bounded candidate set and search rationale are recorded. |
| 3. Atomic trace | Decompose the issue into claims, expected behavior, observed behavior, evidence, and unknowns. Follow callers, data flow, and tests as needed. | Each material claim has a source or is explicitly marked as a hypothesis. |
| 4. Clean-room proposal | Generate a minimal solution plan from the frozen evidence packet. Include candidate edits, expected behavior, risks, and validation. Do not edit the repository in this phase. | A proposal is complete enough for the permission gate. |
| 5. Permission gate | Score impact, blast radius, irreversibility, and uncertainty. Enforce hard policy denies. | Allow, require human approval, or deny is recorded before mutation. |
| 6. Bounded execution | Apply only authorized changes. Prefer the smallest coherent patch and preserve a diff/checkpoint. Stop on unexpected state changes or repeated tool failures. | The intended diff exists, or execution stopped safely. |
| 7. Verification | Run the narrowest relevant tests first, then necessary regression checks; inspect the final diff and protected paths. | Results, omissions, failures, and patch status are explicit. |
| 8. Learning and handoff | Write a compact run record and, when warranted, a postmortem. Package artifacts with provenance so another machine can continue without chat history. | Handoff is self-contained and does not overstate confidence. |

### Search policy

Breadth-first search is useful for discovering plausible modules, tests, and dependency boundaries before committing to one explanation. Depth-first tracing follows a selected path through callers, state, and tests until the claim is supported or falsified. Binary search is appropriate only where the search space has a meaningful order and the signal is sufficiently monotonic—for example, narrowing a known range or locating a regression across a valid commit sequence. Do not run `git bisect` when history is absent or forward history has been intentionally removed; the Kaggle task snapshots have that constraint. Every search mode needs a stopping condition.

## 4. Single-point permission algorithm

The gatekeeper is the only component allowed to grant write or execution capabilities. It receives an action proposal and evidence packet; it does not accept a natural-language request from the model as a substitute for policy. The ordinal ratings below are a starting policy to be evaluated and calibrated, not empirically validated probabilities.

The gate—not the agent—assigns each proposed action a rating from 1 to 3. It derives scope, reversibility, and affected-path class from the actual diff/tool request and workspace policy, and checks whether the evidence packet supports the stated goal. Missing or contradictory evidence defaults to the highest uncertainty rating. Never accept the agent's self-reported “low risk” score as authorization.

- **Impact (I):** 1 localized internal behavior; 2 behavior or public API affecting a subsystem; 3 security, privacy, availability, data integrity, or broad production impact.
- **Blast radius (B):** 1 one local symbol/file; 2 multiple files or a subsystem; 3 repository-wide, external system, or user data.
- **Irreversibility (K):** 1 trivially revertible; 2 costly or partially reversible; 3 destructive or difficult to reverse.
- **Uncertainty (U):** 1 reproduced and evidence-supported; 2 partially supported; 3 material unknowns or conflicting evidence.

Compute the provisional risk index \(Q = I \times B \times K \times U\), from 1 to 81. Use the maximum risk across all proposed actions, not an average that could hide a dangerous operation. The category mapping and thresholds below are initial design choices; validate their false-allow and false-deny rates before using them for high-impact work.

| Gate result | Provisional rule | Allowed behavior |
|---|---|---|
| Low | \(Q \le 8\), with no hard-deny condition | May proceed inside the stated workspace and task scope; must capture a diff and run relevant checks. |
| Elevated | \(9 \le Q \le 27\) | May proceed only if the action is explicitly within the user's request and can be staged and verified; otherwise request approval. |
| High | \(Q > 27\) | Require explicit human approval before mutation or execution with material side effects. In an unattended evaluation without an approval channel, deny the action and produce a safe handoff. |
| Denied | Any hard-deny condition, independent of \(Q\) | Do not perform the action; report the blocked action and a safe alternative. |

Hard-deny conditions for the BCF prototype include leaving the authorized workspace, accessing or transmitting secrets, bypassing test/evaluation protections, modifying benchmark tests to fake success, destructive commands without explicit approval, network access where the task environment forbids it, or a tool schema/action not in the host allowlist. In the Kaggle harness, edit permissions must respect its sandbox and test-reset behavior. A permission gate that exists only in a prompt is advisory; the actual tool boundary must enforce it.

### Kaggle implementation boundary

The live competition overview permits predefined harness tools, custom subagents, and skill scripts run inside the task container. A feasible gate prototype is to give the agent read/retrieval tools plus a small, fixed set of skill scripts, and omit direct `edit_file`, `write_file`, and general `run_command` access if the compiler allows that configuration. One script can validate a proposed patch's paths and risk record before applying it; another can run a whitelisted test command. Keep the patcher and test runner narrowly scoped, and test that no other available tool provides a mutation bypass. If the harness configuration or skill-tool contract does not allow this, use the host's sandbox/path controls as hard boundaries and describe the BCF risk gate as an auditable policy checkpoint—not as enforcement. The main competition's config compiler and tool registry are competition-specific; generic ADK documentation is experimental and may not describe the contest's model support.

## 5. Evidence packet and portable “brain”

BCF's reference is not an unversioned pile of prose. It is a small, indexed set of sources selected for the task: repository code at a recorded commit, tests, project developer documentation, applicable API specifications, and relevant graph/retrieval results. Each item records its provenance and version. Executable behavior and test results are evidence, not infallible truth; disagreement is recorded rather than silently resolved.

An evidence card contains:

| Field | Meaning |
|---|---|
| `id` | Stable identifier within the run |
| `claim` | One atomic statement, not an entire narrative |
| `status` | `observed`, `derived`, `hypothesis`, or `unknown` |
| `source` | Repository path/symbol/line, test, documentation URL, or tool result |
| `version` | Commit, document version/date, or tool version |
| `digest` | Optional content hash for exact reproducibility |
| `confidence` | Calibrated scale or qualitative label with stated rubric |
| `supports` / `contradicts` | Links to related evidence cards |
| `next_check` | Smallest useful follow-up when the claim is uncertain |

An interoperable handoff should include a schema version, task statement, repository commit, evidence cards, search log, decision and risk-gate records, proposed/applied diff, commands and test outcomes, tool/model/config versions, remaining unknowns, and pointers or hashes for larger artifacts. Store it as JSON or JSONL plus human-readable Markdown; do not require access to hidden chat history. Avoid copying secrets or proprietary source into an external knowledge base.

### Minimum system instruction for a v0.1 BCF agent

```text
Follow the BCF phases in order: intake, baseline, breadth search, atomic trace,
clean-room proposal, permission gate, bounded execution, verification, handoff.
Treat repository state and versioned project documentation as evidence. Label
observations, deductions, hypotheses, and unknowns separately. Cite paths,
symbols, tests, or tool outputs for material claims. Do not edit during clean-room
synthesis. Submit every state-changing action to the permission gate; never infer
authorization from your own plan. Make the smallest scoped change, preserve the
pre-existing diff, and do not alter tests or evaluation configuration to fake a
pass. Run relevant checks and inspect the final diff. If blocked or uncertain,
stop safely and return the evidence, failed check, and next useful action. Never
claim a test passed unless its observed output confirms it.
```

This prompt is not a security boundary. Enforce permissions and path limits in the host tools.

## 6. Effort modes and stopping rules

| Mode | Search and synthesis | Verification floor |
|---|---|---|
| Fast | One broad map, then one focused trace; one minimal candidate patch | At least inspect diff and run the narrowest available check; disclose skipped checks |
| Standard | Breadth search plus evidence-backed depth trace; compare plausible root causes | Targeted tests and relevant regression checks; review all changed files |
| High assurance | Independent evidence paths, explicit counter-hypothesis, risk review, and full relevant suite | Baseline comparison where possible, targeted and broad tests, independent diff review, full handoff |

The user or evaluation budget may choose the mode, but no mode may waive hard-deny rules or permit false claims. Stop when the evidence supports a verified patch, the remaining risk exceeds authorization, the budget is exhausted, or repeated failures show that the current strategy is not yielding information.

## 7. Learning loop without self-poisoning

A postmortem records the expected behavior, observed outcome, trigger, direct cause, contributing conditions, detection gap, recovery, evidence, and a proposed reusable lesson. Lessons enter a versioned knowledge base only after a reviewer checks that they generalize and do not encode task-specific gold patches. During benchmark experiments, freeze memory per condition or explicitly isolate training tasks from held-out tasks; otherwise the “self-learning” system may leak answers and invalidate results.

## 8. Falsifiable acceptance criteria

An implementation qualifies as BCF v0.1 only if an evaluator can verify all of the following:

1. A machine-readable run record is produced for every attempted task, including failures and refusals.
2. Material claims in the solution plan link to evidence or are marked as hypotheses.
3. Every mutation is gated; hard-deny actions are rejected by the host tool boundary.
4. The clean-room stage emits a proposal before any mutation.
5. The final patch and test outcomes are auditable and the process reports incomplete verification honestly.
6. Another operator can reconstruct the decision path from the run record without the original chat.
7. Any claimed improvement over a baseline is measured on the same task instances and resource budget, with failures and uncertainty reported.

## References

- Kaggle, [Gemma 4 Developer Agent Paper Track](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/overview), live page checked 2026-11-05.
- Kaggle, [Gemma 4 Developer Agent data description](https://www.kaggle.com/competitions/gemma-4-developer-agent/data).
- Ouyang et al., [RepoGraph: Enhancing AI Software Engineering with Repository-level Code Graph](https://arxiv.org/abs/2410.14684), ICLR 2025.
- Yang et al., [SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering](https://arxiv.org/abs/2405.15793), 2024.
- Xia et al., [Agentless: Demystifying LLM-based Software Engineering Agents](https://arxiv.org/abs/2407.01489), 2024.
- OpenAI, [Introducing SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/), 2024, updated 2025.
- NIST, [AI Risk Management Framework 1.0](https://doi.org/10.6028/NIST.AI.100-1), 2023.
- Google SRE, [Postmortem Culture: Learning from Failure](https://sre.google/sre-book/postmortem-culture/).


---

<!-- ====================================================================== -->
<!-- FILE: 02_Paper_Draft_BCF.md -->
<!-- ====================================================================== -->

# Evidence-Carrying Repair: A Risk-Gated Workflow for Coding Agents

*A Batonic Coding Framework (BCF) proposal for constrained repository-level software engineering*

> **Draft status: not submission-ready.** This is a research-paper starter, not a report of completed experiments. Replace every bracketed result field with measured values and attach reproducible artifacts before submitting. Do not present hypotheses or expected results as findings.

## Abstract

Small coding agents must locate relevant code, infer intended behavior, make a bounded change, and verify it under limited context and execution budgets. We specify the Batonic Coding Framework (BCF), a risk-gated workflow that couples repository search with atomic evidence records, a non-mutating “clean-room” patch proposal, a single permission gate, verification, and provenance-preserving failure reports. BCF treats code graphs and retrieval as navigation evidence rather than substitutes for tests or source inspection. We propose a paired evaluation of this process against a matched repository-repair baseline using one supported Gemma 4 model and public development tasks from the Kaggle Developer Agent benchmark. The primary outcome is pass/fail task resolution; secondary outcomes measure runtime, tool efficiency, evidence traceability, and policy violations. **[Insert actual results and uncertainty after the experiment. No BCF-vs-baseline results have yet been generated.]**

## 1. Introduction

Repository-level repair is not simply code completion. An agent must interpret an issue, discover relevant code and tests, coordinate changes, interact with tools, and produce a patch that survives independent validation. SWE-bench formalized this challenge using real GitHub issues and repository states; its task framing has since motivated a wide range of agent designs and evaluation methods [1]. The Gemma 4 Developer Agent competition makes this problem concrete for a constrained open model: the agent submits patches for real Python tasks, and a separate verifier applies those patches and runs tests [2, 3].

BCF has prior unpublished internal design notes, including earlier specifications and proposed evaluation ladders; those notes contain plans and illustrative cases, not measured BCF-versus-baseline results. We therefore do not claim that this paper is the first articulation of the broad BCF principles. Instead, it refines an existing design into an executable protocol and asks whether the combination improves repair outcomes under a fixed model, toolset, and budget.

Our scope is deliberately limited. We do not claim that code graphs, search, human review, tests, or postmortems are individually novel. SWE-agent demonstrates that agent-computer interface design can influence software-engineering performance [4]. Agentless shows that a relatively simple localization, repair, and validation pipeline can be strong, challenging the assumption that more autonomous orchestration is always better [5]. RepoGraph reports gains from repository-level graph guidance in its evaluated systems [6], but those findings do not establish that graph tools help every agent or task. BCF tests a particular integration: an evidence packet links issue claims to repository locations and tests; a clean-room stage creates a candidate plan without mutation; one gate authorizes bounded actions; and verification and postmortem records are portable across runs.

**Research question.** Under matched model, tools, decoding settings, and time budget, does adding the BCF evidence-and-gating protocol improve verified patch resolution and reduce wasted tool use compared with a simple repository-localization/repair/validation baseline?

## 2. BCF method

BCF comprises eight phases: (1) intake the requested behavior and constraints; (2) capture repository version and baseline state; (3) search broadly across candidate files, symbols, tests, and dependencies; (4) trace selected hypotheses and store atomic evidence cards; (5) propose a minimal patch in a non-mutating clean-room stage; (6) route every mutation through one permission gate; (7) run relevant tests and inspect the final diff; and (8) save a portable run record and, where a failure teaches a reusable lesson, a reviewed postmortem.

Each evidence card stores one claim, its status (`observed`, `derived`, `hypothesis`, or `unknown`), a source locator and version, confidence, links to supporting or contradictory evidence, and a next check. The repository at a pinned commit, project documentation, tests, and code-graph/retrieval output are distinct evidence sources. A graph edge can suggest where to inspect; it does not prove runtime behavior. Test passing is also limited evidence: benchmark issue/test pairs may be ambiguous or imperfect, a concern highlighted by SWE-bench curation work [7, 8].

The permission gate is the only intended writer authorization point. It scores impact, blast radius, irreversibility, and uncertainty on an ordinal scale and blocks hard-denied actions independent of that score. Low-risk, reversible edits inside the user-authorized workspace may proceed; elevated actions require narrower scope and stronger verification; high-impact or irreversible actions require human approval. The initial ordinal thresholds are policy choices, not calibrated risk probabilities. For the Kaggle implementation, the plan is to expose a fixed gate script as the only mutation path and remove direct edit/write/general-shell tools if the contest compiler permits it. This tool boundary is not yet implemented or verified; if it cannot be enforced, the condition must be reported as a prompt-level policy checkpoint rather than a security gate.

BCF's clean-room proposal stage must emit candidate files/symbols, rationale, expected behavior, risks, and tests before any edit. During execution, the agent preserves pre-existing user changes, writes only within the authorized boundary, and reports tests honestly. A postmortem may add a general lesson only after review. Benchmark tasks are isolated so that a model cannot use a held-out task's reference patch or tests as memory.

The complete v0.1 protocol, risk formula, evidence schema, and acceptance criteria are published in the accompanying [BCF specification](./01_BCF_Formal_Specification.md).

## 3. Experimental design

### 3.1 Dataset and leakage control

The planned evaluation uses the public development package for the Kaggle Gemma 4 Developer Agent competition. The package describes 129 Python tasks and includes repository snapshots, task statements, reference patches, verification test patches, and AST/code graph and embedding resources [2]. The provided local analysis reports substantial repository imbalance and related task chains [8]. The single HTTPX task is included in the benchmark-weighted task-level outcome, but not used to make a repository-level generalization claim.

The plan reserves approximately 24 tasks for development and approximately 105 held-out tasks for the paired comparison. The split is grouped by base commit and known multi-PR chain to reduce related-instance leakage; the actual task IDs and repository counts will be published. This is a procedural holdout on a public benchmark, not protection against possible model pretraining exposure. Reference patches and test patches are never passed to either agent or used in retrieval. Any task used for prompt tuning is excluded from confirmatory analysis.

### 3.2 Conditions

The planned default is `gemma-4-31b-it-qat-w4a16-ct`, a model variant currently listed by the main competition; the actual run must record and use exactly one supported variant for both conditions. All results are specific to that selected model and inference setup.

- **Baseline:** one Gemma 4 agent with the competition's repository tools and graph/retrieval tools, operating under a concise localization → repair → validation instruction. It receives the same model, tools, repository state, test environment, context budget, and wall-clock/tool-call limits as BCF.
- **BCF:** the same model and tools plus the phased protocol, atomic evidence ledger, clean-room proposal, single-point permission gate, and required verification/handoff record. The contest implementation will use a fixed mutation script and restricted tool set only if those controls are supported and verified; otherwise the gate is reported as an advisory policy checkpoint, not a security boundary. No cross-task learned memory is enabled in the confirmatory run.

Because both conditions have access to the same graph tools, the primary comparison estimates the added value of BCF's evidence-and-gating workflow, not the isolated effect of graph retrieval. If resources permit, a small graph-disabled ablation is reported separately and labeled exploratory.

### 3.3 Measures and analysis

The **primary outcome** is task resolution: the submitted patch applies and passes the benchmark verifier's required tests. The primary effect is the paired difference in resolution rate on the same task instances. We will report the number of BCF-only and baseline-only successes and use an exact paired test (McNemar's test) for the binary outcome [9]. We will report Wilson intervals for each success rate and a paired bootstrap interval for the difference [10, 11], plus a sensitivity analysis that groups related PR-chain tasks. With only four repositories, highly imbalanced counts, and one HTTPX task, we will not claim strong repository-level generalization.

Secondary measures are wall-clock time, model/tool calls, patch-application failure, verified-test result, repeated failed tool calls, evidence-card completeness, and policy violations. Evidence traceability is scored against a predefined rubric by a reviewer blind to condition where practical. All attempted runs, timeouts, crashes, invalid patches, and missing records remain in the denominator. The exact model identifier, prompt, tool schemas, sampling settings, budgets, environment, task manifest, seeds where supported, and raw run records are archived.

The confirmatory sample receives one matched run per condition. A fixed 12-task subset receives a second matched seed/run only if observed throughput permits. Before committing to the full 105-task paired evaluation, a pilot measures median and p90 wall time per episode and available parallelism. A five-minute per-task cap is a candidate setting, subject to the smoke test and total compute budget; the final cap and settings are frozen before evaluation. If the 210 primary episodes cannot finish in time, reduce the sample before inspecting comparative outcomes, record the rule and change, and label the result exploratory rather than silently dropping slow or failed cases.

At \(n=105\), an illustrative paired-outcome minimum detectable difference at roughly 80% power and two-sided 5% significance is about 12–17 percentage points if 20–40% of task pairs are discordant. This is a planning approximation under assumed discordance, not a result or guarantee; report the assumption and the observed discordance.

### 3.4 Hypotheses

- **H1 (primary):** BCF improves task resolution relative to the matched baseline. This is a hypothesis, not an expected or observed result.
- **H2:** BCF yields more complete evidence traceability and fewer repeated failed actions.
- **H3 (trade-off):** BCF may require more up-front tokens or time per task; report whether any reliability gain offsets that cost.
- **Safety objective:** BCF produces no unauthorized state-changing action in the test set. Any violation is reported, not averaged away.

## 4. Results

**Results pending.** Do not submit the manuscript until this section is replaced with actual outputs from the declared experiment. At minimum report:

| Measure | Baseline | BCF | Paired difference / uncertainty |
|---|---:|---:|---:|
| Resolved tasks / attempted | [n/N] | [n/N] | [difference; 95% CI] |
| BCF-only / baseline-only resolved | — | — | [n / n; exact paired test] |
| Median time per task | [value] | [value] | [paired interval] |
| Median tool calls per task | [value] | [value] | [paired interval] |
| Evidence traceability score | [value] | [value] | [rubric and agreement] |
| Policy violations | [n] | [n] | [event details] |

Include a table or appendix listing failures by category and all deviations from the protocol.

## 5. Discussion and limitations

If BCF improves resolution, the result would support the specific tested implementation and task population, not the claim that a general “constitution” guarantees better code. If resolution is unchanged but traceability improves, that is still useful evidence, but it does not establish a leaderboard advantage. If BCF underperforms, the extra planning and logging may be unjustified under tight budgets. The ablation and cost measures help distinguish these possibilities.

Important limitations include the small, repository-skewed public sample; dependencies among tasks; prompt and test quality; stochastic inference; and possible benchmark-specific effects. The public development tasks are not the hidden test set and cannot establish generalization to private repositories. A risk score based on ordinal judgments needs future calibration against actual harm and review outcomes. BCF's success criterion is not “the agent always edits”: safe refusal and an evidence-based blocker report are valid outcomes, but they do not count as resolved patches.

## 6. Conclusion

BCF turns a broad set of coding principles into a falsifiable workflow: evidence is recorded before synthesis, proposals precede mutation, permissions are enforced at one boundary, and outcomes are verified and portable. Its value depends on measurement. The proposed paired evaluation tests whether this additional structure improves repair reliability and auditability enough to justify its overhead for a constrained coding agent.

## References

1. Jimenez, C. E. et al. “SWE-bench: Can Language Models Resolve Real-World GitHub Issues?” 2024. [arXiv:2310.06770](https://arxiv.org/abs/2310.06770).
2. Kaggle. “Google - The Gemma 4 Developer Agent Competition: Data.” [Dataset description](https://www.kaggle.com/competitions/gemma-4-developer-agent/data).
3. Kaggle. “Google - The Gemma 4 Developer Agent Competition: Overview and Rules.” [Overview](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview); [Rules](https://www.kaggle.com/competitions/gemma-4-developer-agent/rules).
4. Yang, J. et al. “SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering.” 2024. [arXiv:2405.15793](https://arxiv.org/abs/2405.15793).
5. Xia, C. S. et al. “Agentless: Demystifying LLM-based Software Engineering Agents.” 2024. [arXiv:2407.01489](https://arxiv.org/abs/2407.01489).
6. Ouyang, S. et al. “RepoGraph: Enhancing AI Software Engineering with Repository-level Code Graph.” ICLR 2025. [arXiv:2410.14684](https://arxiv.org/abs/2410.14684).
7. OpenAI. “Introducing SWE-bench Verified.” 2024, updated 2025. [Article](https://openai.com/index/introducing-swe-bench-verified/).
8. Supplied local study. “Deep & Wide Research Report: Kaggle Google Gemma 4 Developer Agent Problem Dataset & Taxonomy.” [Dataset analysis](../2026-11-05_Gemma4_Problem_Dataset_Taxonomy_and_Analysis/01_Deep_Wide_Research_and_Executive_Synthesis.md).
9. McNemar, Q. “Note on the sampling error of the difference between correlated proportions or percentages.” 1947. [DOI:10.1007/BF02295996](https://doi.org/10.1007/BF02295996).
10. Statsmodels. “proportion_confint: Confidence interval for a proportion.” [Documentation](https://www.statsmodels.org/stable/generated/statsmodels.stats.proportion.proportion_confint.html).
11. SciPy. “bootstrap: Compute a confidence interval for the statistic.” [Documentation](https://docs.scipy.org/doc/scipy/reference/generated/scipy.stats.bootstrap.html).
12. NIST. “Artificial Intelligence Risk Management Framework (AI RMF 1.0).” 2023. [DOI:10.6028/NIST.AI.100-1](https://doi.org/10.6028/NIST.AI.100-1).
13. Google SRE. “Postmortem Culture: Learning from Failure.” [Online reference](https://sre.google/sre-book/postmortem-culture/).


---

<!-- ====================================================================== -->
<!-- FILE: 03_Experiment_Plan_and_Runbook.md -->
<!-- ====================================================================== -->

# BCF empirical plan and Gemma 4 runbook

*Working plan as of 2026-11-05; freeze the protocol before confirmatory runs.*

## 1. What the experiment can establish

The contest leaderboard and the paper track ask different questions. The main track rewards verified patches on a hidden test set. The paper track rewards research quality across five equally weighted criteria. BCF should first be tested on a controlled public development sample; leaderboard score is neither required to submit a paper nor sufficient evidence that the framework caused an improvement.

The narrow experimental claim is:

> For the same Gemma 4 model, repository tools, graph access, task instances, and resource budget, does the BCF evidence-and-gating workflow improve verified issue resolution and reduce waste relative to a simple repository-repair agent?

## 2. Preregistered comparison

| Item | Plan |
|---|---|
| Primary outcome | Fraction of attempts whose patch applies and passes the task verifier's required tests |
| Unit of analysis | One task-condition run; paired by task ID |
| Conditions | Baseline and full BCF, using the same model, host tools, graph/retrieval access, test environment, and budgets |
| Model | Freeze one supported Kaggle variant for all arms; use the same model in both conditions. `gemma-4-31b-it-qat-w4a16-ct` is the default starting point; any alternative makes the results specific to that model |
| Split | Approximately 24 development tasks and 105 held-out tasks from the remaining public instances, grouped by base commit and known related PR chains |
| Confirmatory sample | Target the full held-out set (about 105 tasks) for one paired run per condition; include HTTPX in the task-weighted outcome, but do not make a repository-level claim from one task |
| Related-instance handling | Keep tasks from the same commit/known PR chain in one partition; report actual group and repository counts |
| Repeats | One matched run per condition on all held-out tasks; second matched run on a fixed 12-task subset only if measured throughput allows |
| Sampling | Same temperature and generation settings; matched random seed where harness supports it; otherwise record stochasticity as a limitation |
| Budget | Identical time, tool-call, and turn limits; candidate 5-minute per-task cap after smoke test; no arm-specific rescue |
| Memory | No cross-task solution memory in either confirmatory condition |
| Stopping rule | Stop on budget exhaustion, hard policy event, or unrecoverable harness failure; retain the run as a failure with reason |

This improves statistical information over a 40-task pilot, but is feasible only if a throughput test confirms that 210 paired episodes (plus development work) fit the available compute window. Measure median and p90 episode time and available parallelism before deciding. If it does not fit, apply a predeclared reduction before viewing comparative outcomes; label the reduced study exploratory.

### Task selection and leakage

Use the provided task catalog and taxonomy to choose the development and confirmatory groups with a documented script or seed. Keep instances from the same base commit or known evolutionary PR chain in one partition. Ensure task categories and prompt clarity are not selected after observing outcomes. Never include a selected task's reference patch or `test_patch` in the agent prompt, retrieval index, exemplar set, or persistent memory. The reference patches and tests may be used only by the verifier/analyst for scoring after prediction. Any task used to debug prompts or tool behavior is marked as a smoke/tuning task and excluded from the confirmatory sample. This is a procedural holdout on a public benchmark, not protection from model pretraining exposure.

The supplied dataset analysis notes repository imbalance and correlated task chains. A random per-row split risks placing related fixes in both tuning and evaluation. Publish the exact selection manifest; the final sample estimates performance on this benchmark's repository mix, not broad repository-level generalization.

## 3. Conditions in practice

### Baseline

Use one Gemma agent, ordinary repository file/search/test tools, plus the same code-graph and embedding tools exposed to BCF. Give it a concise three-stage instruction: localize, repair, validate. Do not add a separate evidence ledger or action gate beyond controls already imposed by the host. This baseline reflects the minimal, interpretable staged approach motivated by Agentless; it is not a reproduction of Agentless's model, prompts, or results.

### BCF

Use the same agent/model/tools with the v0.1 phases and structured evidence cards. Ask for the evidence packet and clean-room plan before any write action. Route each write through the permission gate and log its decision and reason. The Kaggle implementation should test whether a fixed skill script can be the only mutation path: expose read/retrieval tools and a whitelisted gate script, and remove direct edit/write/general-shell tools if the contest compiler permits it. The live overview documents `run_skill_script` for scripts in an included skill directory. Verify the exact tool schema and compilation behavior before claiming enforcement. If direct mutation tools remain exposed, describe the gate as an auditable policy checkpoint, not a security control. Require targeted testing and diff inspection before reporting completion. Keep the system single-agent for the first implementation: additional agents increase cost and could introduce orchestration behavior that confounds the question.

### Optional graph ablation

If time allows, run a graph-disabled condition on a preselected subset (for example 12 tasks). Keep all other prompts and budgets unchanged. This tests whether graph access contributes separately. Label it exploratory and do not let an optional comparison delay the primary paper.

## 4. Metrics and analysis

### Primary: verified resolution

A resolved task is one whose patch applies and passes the harness-required tests. Record `pass`, `fail`, or `incomplete` with a failure reason; for the primary denominator, incomplete runs count as not resolved. Report numerator and denominator for each arm, along with the paired difference and exact counts of BCF-only versus baseline-only solves. An exact McNemar test is appropriate for the paired binary comparison; report the result with effect size and uncertainty rather than p-value alone.

### Secondary

- Time to first useful localization and total elapsed agent time.
- Tool calls, token use if available, and repeated identical/failed calls.
- Patch-application failure and verifier failure categories.
- Evidence-card completeness and citation correctness using a short rubric.
- Unauthorized action attempts, gate denials, and actual policy violations.
- User-facing report correctness: tests claimed as passing must match recorded output.

For uncertainty, report task-level Wilson intervals and a paired bootstrap interval for the difference, using aligned task resamples; provide the 2×2 paired outcome table and exact McNemar test. Because tasks may be dependent, also report a sensitivity analysis grouping related PR-chain instances. Show counts by repository, but avoid strong repository-level or broad cross-repository claims with only four repositories and one HTTPX task. At 105 pairs, an illustrative minimum detectable difference is roughly 12–17 percentage points if 20–40% of pairs are discordant; these are planning assumptions, not measured power.

## 5. Minimal build plan for the BCF brain

### Step A — make the run record first

Implement a JSONL record per task with fields for schema version, task ID, repository/commit, condition, model and prompt versions, resource limits, baseline status, evidence cards, search actions, proposed change, gate decisions, changed paths, command/test outputs, final resolution status, runtime, and unresolved questions. Use stable IDs and hash large artifacts. Do not store credentials or send competition data to an unapproved external service.

### Step B — add the phase prompt and evidence ledger

Start from the official sample submission and ADK Agent Config reference. Keep phase instructions concise. Ask for citations to file paths, symbols, tests, or tool outputs. Label unknowns. Keep evidence separate from candidate edits and do not let the agent treat a graph neighbor or embedding match as proof.

### Step C — enforce the gate outside the model

Expose a small action surface:

| Capability | Prototype surface | Constraint |
|---|---|---|
| Inspect | Harness read/search/graph tools | Read-only; report exact path/symbol and version |
| Propose | Agent emits a diff plus evidence-card IDs and expected tests | No filesystem mutation |
| Authorize/apply | Fixed skill script, if permitted by tool configuration | Recompute changed paths from diff; reject protected paths, out-of-workspace paths, malformed/oversized patches, missing evidence, and high-risk actions; write a gate record |
| Verify | Separate fixed skill script, if permitted | Whitelist test commands and targets; return raw exit status and concise output |
| Submit | Harness `submit_patch` | Capture final patch; do not imply this tool validated correctness |

Configure the agent without direct edit/write/general-shell tools if the contest compiler permits it. The live overview documents `run_skill_script` for scripts in an included skill directory, but its exact signature and tool-filter behavior must be confirmed against the contest starter. If direct mutation tools remain exposed or the skills facility cannot implement the required restrictions, label the gate as process-only and do not claim that it prevents unauthorized writes. Hard-deny modifications to benchmark tests, attempts to access outside the workspace, forbidden network calls, or destructive operations. Record policy version and decisions.

### Step D — test resilience and truthfulness

Before outcome measurement, smoke-test at least eight non-confirmatory tasks spanning repositories and task types. Check that the archive has a valid root `agent.yaml`, tool calls serialize, the agent stops repeated failures, new files enter the diff, tests are not modified, and time limits are enforced. Record failures; do not silently exclude them from the final accounting.

## 6. Submission-week schedule

| Date (2026) | Deliverable | Exit criterion |
|---|---|---|
| Nov 5 | Freeze question, BCF v0.1 spec, criteria, and paper shell | Scope and metrics no longer change after results are seen |
| Nov 6 | Build baseline and BCF variants; save exact configurations | Both compile and use the same host model/tools |
| Nov 7 | Smoke test and repair operational failures | Eight smoke cases complete or limitations are documented |
| Nov 8–10 | Run paired held-out sample if throughput allows; otherwise the predeclared reduced pilot | Raw outputs, failures, timestamps, and task manifest retained |
| Nov 11 | Analyze outcomes, uncertainty, costs, and deviations; finish writeup | Results table generated from raw records; word count and links checked |
| Nov 12 | Submit early and verify final status | Kaggle confirms submitted, not draft, before 23:59 UTC |

The full 105-task paired evaluation is conditional on measured throughput and compute access. If the Kaggle hardware queue or runtime prevents this schedule, reduce sample size only before comparative results are inspected, state the change, and report exploratory evidence. Never fabricate results or use the leaderboard as a substitute for paired local testing.

## 7. Paper checklist mapped to judging criteria

| Criterion | What the writeup should provide |
|---|---|
| Novelty | State what is new in the evidence-card + gate integration, compare honestly with SWE-agent and Agentless, and avoid novelty claims for generic search/testing |
| Quality | Define BCF in enough detail to reimplement; include matched controls, task selection, metrics, and error analysis |
| Relevance | Explain why bounded and traceable patch generation matters for small/open local agents |
| Verifiability | Publish prompts/configs, task-selection manifest, scoring script/notebook, raw non-sensitive logs, exact model/tool versions, and all failures |
| Clarity | Keep one primary question, label hypotheses and results distinctly, stay within 3,000 words, and make tables self-contained |

Kaggle requires a final Writeup with title/subtitle, abstract, introduction, research description including methods and experiments, and related work/citations. Code is optional, but a linked notebook must be public and accessible. The live Paper Track page currently states that all five rubric categories are equally weighted and that any saved draft must still be explicitly submitted before the deadline. Re-check the live page immediately before submission.

## 8. Citations and source-of-truth links

- Kaggle, [Paper Track overview, rubric, submission requirements, and deadline](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/overview), checked 2026-11-05.
- Kaggle, [Main competition overview](https://www.kaggle.com/competitions/gemma-4-developer-agent/overview), [data](https://www.kaggle.com/competitions/gemma-4-developer-agent/data), and [rules](https://www.kaggle.com/competitions/gemma-4-developer-agent/rules).
- Kaggle, [official Getting Started notebook](https://www.kaggle.com/code/ryanholbrook/getting-started-gemma-4-developer-agent).
- Google, [ADK Agent Config](https://adk.dev/agents/config/).
- Jimenez et al., [SWE-bench](https://arxiv.org/abs/2310.06770), 2024.
- Yang et al., [SWE-agent](https://arxiv.org/abs/2405.15793), 2024.
- Xia et al., [Agentless](https://arxiv.org/abs/2407.01489), 2024.
- Supplied local [dataset synthesis and taxonomy](../2026-11-05_Gemma4_Problem_Dataset_Taxonomy_and_Analysis/01_Deep_Wide_Research_and_Executive_Synthesis.md) and [harness reference](../../input/kagglecomp/kagglecomp_data_package/HARNESS_README.md).

