# COMBINED MARKDOWN - combine

_Generated 2026-11-07 21:37:26 | 6 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle2\items\combine_

## Contents

1. 00_README-abacus-gpt6astra.md
2. 01_BCF_Framework_and_Experimental_Plan.md
3. 02_Paper_Competition_and_Whitepaper_Guide.md
4. 03_ADK_SWEbench_Swegemma_Developer_Reference.md
5. 04_Paper_Tab_Research_Inventory.md
6. 05_Quality_Check.md

---

<!-- ====================================================================== -->
<!-- FILE: 00_README-abacus-gpt6astra.md -->
<!-- ====================================================================== -->

# BCF framework and Gemma 4 submission research

Prepared: 2026-11-08 UTC. Scope: deliver the research already collected; no additional external research in this production pass.

## Recommendation

BCF is a coherent candidate for a research paper if it is presented as an evidence-preserving, risk-gated repair protocol and evaluated against a simpler baseline. A constitution alone is not empirical validation, and no BCF implementation or benchmark result has been produced in this research session.

The paper-track deadline verified in the collected official material is **November 12, 2026, at 23:59 UTC**. The paper and developer-agent competitions have different submission mechanisms and deadlines; do not confuse them.

## Reading order

1. [BCF formalization, brain architecture, and experimental plan](01_BCF_Framework_and_Experimental_Plan.md).
2. [Paper competition intelligence and submission guide](02_Paper_Competition_and_Whitepaper_Guide.md).
3. [Beginner developer reference: ADK, SWE-bench, and swegemma](03_ADK_SWEbench_Swegemma_Developer_Reference.md).
4. [Detailed paper-tab research inventory](04_Paper_Tab_Research_Inventory.md).
5. [Quality check and limitations](05_Quality_Check.md).

## Evidence boundaries

- The completed paper research retrieved official page content, public discussion records, public code metadata, and official documentation on 2026-11-08.
- Its inventory covers 57 public discussion threads and 57 public code listings. It does not establish review or execution of every notebook's cells. Public submitted writeups were unavailable before competition closure.
- The technical research retrieved current competition pages and the wheelhouse file list. The bundled local harness guide is useful but contains an outdated model-allowlist statement; current official competition pages take precedence.
- Wheel source extraction was blocked by an execution approval gate. No package-source validation, GPU evaluation, training, submission, or authenticated editor verification is claimed.
- BCF design choices, experiment sizes, and writing advice are recommendations, not contest rules or measured results.
- No win probability or performance improvement is asserted.

## Research provenance

Primary scratch evidence: `../../scratch/2026-11-08_BCF_Research/`.

Local context supplied by the user: `../../input/kagglecomp/` and the two `2026-11-05_Gemma4_*` research folders. Earlier analyses are context, not independent confirmation of current rules or experimental evidence for BCF.

This package is Markdown only. It does not publish competition data, create a public project, or enter either competition on your behalf.


---

<!-- ====================================================================== -->
<!-- FILE: 01_BCF_Framework_and_Experimental_Plan.md -->
<!-- ====================================================================== -->

# BCF framework and experimental plan

Prepared 2026-11-08 UTC. Markdown only; no external requests in this pass. Facts come from research already collected under `../../scratch/2026-11-08_BCF_Research/`. No BCF implementation, run, or result exists. Nothing here is a competition rule.

## 1. Decision summary

| Question | Answer |
|---|---|
| Coherent, testable topic? | Conditionally yes: state, transitions, and a falsifiable primary outcome are defined below. |
| Novel? | Not established; no systematic academic novelty review was performed. |
| Win or score gain guaranteed? | No. No effect size, ranking, or probability is claimed. |
| Implemented? | No. Named interfaces are proposals, not available tools. |
| Runnable in the harness? | A prompt-based workflow can express the policy and handoff format; it cannot enforce the full external mutation gate. No BCF adapter has been run. |

## 2. What BCF is, stated precisely

BCF (Batonic Coding Framework) is an evidence-preserving, risk-gated repair protocol for a budgeted code agent. It governs how one mutating agent may change an accepted code state, what it must record, and how work survives an interruption.

### 2.1 Conditional non-regression instead of x' > x

An earlier formulation treated each accepted edit as strict improvement, `x' > x`. That is indefensible: a repair can fix the reported symptom while breaking unobserved behaviour, and no finite test run orders code states totally. The defensible property is narrower.

> A candidate `c'` may replace an accepted `c` only if every test in the fixed observed contract `T_obs` that passed at `c` still passes at `c'`, under the same harness, dependency resolution, and recorded environment.

- **Conditional:** relative to `T_obs`, a finite observed sample, and a fixed environment reference.
- **Observed:** `T_obs` holds only tests actually executed and recorded, with command lines and exit codes.
- **Non-regression, not improvement:** passing the gate permits keeping a state; it does not show the state is better.

### 2.2 Evidence refinement

The ledger `L` is an append-only sequence of grounded observations. A new observation refines `L` by adding a provenance-bearing record and never rewrites an earlier one. Refinement is monotone in recorded evidence and deliberately not monotone in code quality: a rejected candidate still refines the ledger, because its failure is now known.

### 2.3 Expected net information value minus cost

Each investigation `e` is admitted on an expected-value basis:

```
ENIV(e) = P(e yields a decision-relevant observation) * V(decision) - cost(e)
```

`cost(e)` covers tool calls, wall-clock seconds, tokens, and the risk-weighted cost of an uncaught regression. A cheap discriminating observation therefore outranks an expensive confirmatory one, and a failed investigation may still yield a useful artifact — a reproducible failure, a narrowed hypothesis, a negative result — without any guaranteed strictly positive value.

### 2.4 Why asymptotic language is inappropriate

"Converges to", "in the limit", and "as iterations grow" presuppose an indexed sequence and a limit object. BCF is a finite episode under a hard budget with a stop transition: no sequence index, no limit, no guarantee that more budget improves the outcome. Claims must be bounded-episode statements such as "within budget B on task set S, the gated arm resolved k of n tasks".

## 3. State, handoff, and transitions

### 3.1 Episode state tuple

`S = (c, L, H, R, B, pi)`.

| Element | Meaning | Mutability | Recorded as |
|---|---|---|---|
| `c` | Accepted checkpoint plus base commit | Only by an accepted transition | Tree hash, parent hash, base SHA |
| `L` | Evidence ledger | Append only | Hash-chained JSONL |
| `H` | Hypotheses with status | Only with a cited observation | IDs plus evidence links |
| `R` | Versioned references | Append versions, never "latest" | Name, version, source, retrieval time |
| `B` | Remaining seconds, calls, turns, cost | Monotonically decreasing | Snapshot per transition |
| `pi` | Gate, stop, escalation rules | Fixed per episode | Policy hash |

Only `c` changes under mutation; the rest makes the change auditable, so an episode replays from the ledger without trusting the agent's prose.

### 3.2 Atomic evidence-grounded handoff packet

The packet is what survives an interruption. It is described as a JSON schema; it is **not** executable, no validator was written, and no consumer exists.

| Field | Type | Purpose |
|---|---|---|
| `schema_version` | string | Reject unknown layouts |
| `packet_id` | string | Body hash |
| `created_utc` | string | Assembly time |
| `task` | object | `instance_id`, `repo`, `base_commit` |
| `checkpoint` | object | `tree_hash`, `parent_hash`, `accepted_tests[]`, `contract_hash` |
| `budget` | object | Remaining seconds, calls, turns, spend |
| `evidence` | array | `evidence_id`, `kind`, `claim`, `observation`, `command`, `exit_code`, `artifact_sha256`, `timestamp` |
| `hypotheses` | array | `id`, `statement`, `status`, `supporting[]`, `contradicting[]` |
| `references` | array | `name`, `version`, `source`, `retrieved_utc` |
| `open_questions` | array | Item plus settling observation |
| `next_actions` | array | Ordered, with cost and stop condition |
| `redactions` | array | Fields removed before egress |
| `integrity` | object | `packet_sha256` over the body |

The packet is deliberately redundant with the ledger: a resumed agent rebuilds from it and re-verifies the checkpoint hash instead of inheriting the previous conversation. That redundancy is the design's point and its cost, since assembly consumes budget that could have gone to repair attempts.

### 3.3 Claims versus observations

A **claim** is a natural-language assertion; an **observation** is a recorded command, its exit code, and an artifact hash. A claim becomes `supported` only when at least one observation cites it, otherwise it stays a hypothesis. This blocks the common failure where "the bug is fixed" is later read as evidence.

### 3.4 Valid transitions

| Transition | Precondition | Postcondition | Ledger effect |
|---|---|---|---|
| `accept` | Passes `T_obs`; contract hash unchanged; budget remains | `c` becomes the candidate | Gate result and checkpoint |
| `reject` | Fails `T_obs`, or evidence does not support the claim | `c` unchanged | Failure with failing test IDs |
| `rollback` | Prior accepted state exists, hash intact | `c` restored to that hash | Rollback naming both hashes |
| `stop` | Budget exhausted, risk bound hit, no admissible action | Episode ends, packet emitted | Terminal record with reason code |

`reject` and `rollback` are first-class outcomes. A protocol that can only accept is not gated.

## 4. The constitution as an operational table

A pillar is meaningful only if it names an enforcement point, an observable, and a failure mode. Seven are numbered; two cross-cutting constraints follow.

| ID | Pillar | Rule and enforcement | Failure if absent |
|---|---|---|---|
| P1 | Preservation | No accepted state is overwritten without a passing `T_obs` run; gate runner enforces before promotion | Silent regression counted as progress |
| P2 | Single gate | One component may promote; checkpoint manager holds the only write path | Two writers, divergent trees |
| P3 | Logging fidelity | Log what replay needs — command, exit code, artifact hash, budget snapshot — under a fixed schema | Unreadable transcripts or missing detail |
| P4 | Reference retrieval | Every external fact cites a versioned reference with retrieval time | Floating "latest" claims |
| P5 | Breadth/depth/bisection | Breadth when the surface is unknown, depth when localized, bisection only with prerequisites met; policy `pi` selects | Bisection on a non-monotone predicate |
| P6 | Atomic decomposition | One behaviour and one acceptance predicate per mutation | Unreviewable multi-behaviour diffs |
| P7 | Independent clean-room context | Synthesis sees only the packet, not the writer's history | Correlated errors copied from the writer |
| C1 | Postmortem learning lock | Conclusions frozen between experiments, hashed at episode start | Moving target that invalidates comparisons |
| C2 | Effort budget | Each phase has a declared share of `B`; stop when spent | Unbounded exploration with no result |

P7 is an **independent context**, not a legal clean room: same operator, machine, and weights, with no isolation from prior knowledge claimed. P5's bisection requires a monotone predicate, reproducible runs, and a cheap check; when any fails the protocol falls back to breadth or depth rather than pretending to bisect.

## 5. Root-causing protocol and bounded risk

### 5.1 Protocol

1. **Reproduce** the exact recorded command and environment; if it does not reproduce, record an infrastructure observation and stop the causal chain.
2. **Bound** the failure to the smallest failing test subset and record the selection command.
3. **Localize** by breadth, depth, or bisection per P5, recording which and why.
4. **Enumerate** at most three hypotheses, each with a named discriminating observation.
5. **Buy the cheapest discriminator first**, ordered by expected cost.
6. **Record, then mutate once**, one atomic edit per predicate.
7. **Re-run the fixed contract** and accept, reject, or roll back; never modify the contract mid-episode.

### 5.2 Bounded risk policy

| Bound | Value | Action on breach |
|---|---|---|
| Consecutive failed mutations | 3 | Force `rollback`, re-localize |
| Budget share per hypothesis | 25% of `B` | Park it, move on |
| Contract violations per episode | 1 | `rollback`, require a new discriminator |
| Repeated identical invalid calls | 3 | `stop`, reason `loop` |
| Behaviours per accepted transition | 1 | Split the edit before promotion |

These are design defaults, not measured optima; they exist so the stop condition is decidable rather than a judgement made under time pressure.

### 5.3 The security gate must sit outside the model

A prompt-level prohibition is not a control. The harness exposes `run_command(command)` running `/bin/bash -c` in `/workspace`, so any instruction-level rule can be bypassed by a shell invocation the model composes. A deterministic gate must intercept at the tool boundary — command allow/deny rules, path confinement, network denial — enforced by the process owning the sandbox. The competition supplies part of this: `network_mode="none"`, path traversal blocked outside the submission root, declarative YAML compiled without `importlib`. Locally the equivalent layer must be built, and until it exists the security claim is a design intention, not an enforced property.

## 6. Local research brain versus competition-compatible adapter

The full protocol assumes capabilities the submission format does not grant. The two must be described separately or the paper claims a system the harness cannot run.

### 6.1 Role separation locally

| Role | Responsibility | Write access | Promotion authority |
|---|---|---|---|
| Writer | Proposes and applies atomic edits | Yes, sole mutator | None |
| Read-only analyst | Explores files, graphs, logs | No | None |
| Skeptic | Attempts to falsify each claim | No | None |
| Checkpoint manager | Runs the fixed contract, promotes or rejects | Checkpoint metadata only | Sole, guarded by `T_obs` |

The single-writer rule is what makes the checkpoint immutable in practice: promotion is a separate component with a fixed test contract, so the writer cannot declare its own success.

### 6.2 What the competition format permits

| Local capability | Competition expression | Status |
|---|---|---|
| Single mutating writer | Root `LlmAgent` holding workspace tools | Expressible in YAML |
| Read-only analyst | Sub-agent as `agent_tool` with read and graph tools | Expressible in YAML |
| Skeptic | Sub-agent told to falsify, no write tools | Expressible, unenforced |
| Immutable promotion | `submit_patch()` plus external Phase 2 verification | Supplied by harness |
| Python callbacks | Closed `CallbackRegistry` | Blocked |
| Custom Python tools | Closed `ToolRegistry` | Blocked |
| Skill scripts | `skills/<name>/SKILL.md` plus `run_skill_script` | Allowed, sandboxed |

Two consequences. The competition cannot arbitrarily install Python callbacks and cannot register new tools, so a submitted BCF variant is a declarative approximation. And custom skill helpers, where permitted, do **not** mediate all mutations: a skill script runs in the same container with the same filesystem access as `run_command`, so it is convenience, not a gate. The only real gate is external Phase 2 verification, which resets protected test and configuration paths before applying the task's test patch.

### 6.3 Proposed interfaces

Both are **not** available tools; no signature beyond this description is claimed and no implementation exists.

- `atomic_decompose` — proposed: given a task statement and checkpoint, return ordered subgoals each with one acceptance predicate and an estimated cost. Intended to enforce P6.
- `clean_room_synthesize` — proposed: given only a packet, produce a candidate patch in a context that never saw the writer's conversation. Intended to enforce P7; "clean room" means independent context only.

## 7. Build plan

| Component | Purpose | Acceptance test | Hash |
|---|---|---|---|
| Ledger writer | Append-only hash-chained records | Replay reproduces the head | `ledger_head_sha256` |
| Gate runner | Execute `T_obs` per test | Injected regression is rejected | `contract_hash` |
| Checkpoint manager | Content-addressed snapshots | Rollback restores a byte-identical tree | `tree_hash`, `parent_hash` |
| Handoff packer | Assemble and validate the packet | Round-trip equality; missing field rejected | `packet_sha256` |
| Policy engine | Decide transitions and stop | Illegal transition refused with a reason code | `policy_sha256` |
| Redactor | Strip secrets, paths, restricted data | Seeded canary absent from output | `redaction_policy_sha256` |
| Compaction handler | Detect stale in-context memory | Post-compaction resume reproduces ledger head | `ledger_head_sha256` |

Operational rules: **roll back own edits only**, reverting to the last accepted checkpoint and never touching harness-written files such as `/workspace/pytest.ini` or `/workspace/conftest.py`, which Phase 2 resets regardless; **versioned provenance** on every reference, with no run-time "latest" resolution; **redaction before egress** of tokens, absolute paths, and restricted material (task text, gold patches, test patches); and **stale-memory handling** that keeps the ledger outside the context window. ADK compaction uses `compaction_interval=5`, `overlap_size=2`, `token_threshold=14336`, and `event_retention_size=5`, and a public preregistration reports edit-state loss at exactly that boundary. BCF's answer is structural — rebuild from the packet, not from conversation memory — and it is untested.

## 8. Handoff experiment

### 8.1 Design

One variable is isolated: whether a packet preserves decision-relevant evidence across an interruption. Both arms get the same total budget `B` per task, model alias, tool set, and task order. The cut is scheduled, not incidental: the episode stops at a fixed fraction of `B`, container state is preserved, and a fresh context resumes.

| Arm | Gate | Packet | Skeptic | Purpose |
|---|---|---|---|---|
| A | No | No | No | Matched simple baseline; transcript truncation on resume |
| B | Yes | Yes | Yes | Full BCF |
| Ab1 | Yes | No | No | Isolates the gate |
| Ab2 | No | Yes | No | Isolates the packet |
| Ab3 | Yes | Yes | No | Isolates the skeptic |

If budget does not permit all three ablations, Ab1 and Ab2 take precedence because they test the two load-bearing claims.

### 8.2 Metrics

- **Primary:** full-harness resolve rate on the held-out split, computed by the harness's criterion, never by self-report.
- **Observed regression:** tasks resolved at the cut that fail after resume.
- **Tool failures:** error-typed tool responses per task.
- **Repeated invalid calls:** identical failing call beyond the policy bound.
- **Cost:** tool calls, turns, wall-clock seconds, tokens per resolved task.
- **Resumed-agent duplication:** edits re-applied after resume that already existed at the checkpoint.

### 8.3 Controls

- **Preregistration** of hypotheses, arms, metrics, stopping rule, and analysis before the first scored run, with a published hash. A hash proves publication time only, not an earlier private freeze.
- **Split discipline:** group by repository so no repository spans development and evaluation; report the grouping.
- **Gold patch isolation:** `patch` and `test_patch` never enter the workspace or prompt. Public tasks ship both, so leakage is a live risk.
- **No "unseen" claims:** the 129 development tasks are public; they are held out from an episode, not from the community.
- **Infrastructure failures labelled** and excluded from the numerator with the exclusion count stated.
- **Intervals:** paired bootstrap over tasks; McNemar for clean discordant pairs. If the task count is too small, report the paired table and say the interval is not estimable.
- **No invented results:** every future number must trace to a run artifact.

## 9. Prior work and the novelty boundary

Collected public material already covers self-correction and gates, so BCF cannot claim to introduce them.

| Source | Already shown | Consequence |
|---|---|---|
| Trap-25 / LoopBreaker posts and notebooks | Loop detection, context reset, thinking-budget caps | Loop breaking is prior art here |
| A2-DASC posts | Generator/critic loops with execution feedback | Dual-agent self-correction is prior art |
| AST-Guided Verification Suite preregistration | Deterministic slicing and pre-flight gates | Gates as a component are prior art |
| AGVA announcement | AST-guided loop verification with reported gains | Verification loops are prior art |
| Edit-state loss at compaction preregistration | Edit state lost across ADK compaction | The targeted failure is already public |
| Prompt-hygiene preregistration | Negative result; variant lost to baseline | Negative results are publishable here |
| Sub-agent topology preregistration | Fixed-budget topology comparison | Budget-matched comparison is an accepted pattern |

The narrow distinguishing hypothesis is therefore: **a packet that preserves evidence across an interruption reduces post-resume regression and duplication at equal total budget, beyond what a gate alone provides.** BCF does not claim to invent search, review, transactions, or checkpointing. A broader academic novelty review is incomplete; no systematic literature sweep was performed, so any related-work section must be written from sources actually read.

## 10. Schedule

| Date (2026) | Work | Exit condition |
|---|---|---|
| Nov 8 | Freeze scope; write sections 1-3; fix schema; preregister | Schema hashed, hypotheses frozen |
| Nov 9 | Implement ledger, gate, checkpoint manager, packer; acceptance tests | All seven acceptance tests pass locally |
| Nov 10 | Pilot on at most 10 public tasks, two arms, reduced budget | Pilot table with per-task outcomes |
| Nov 11 | Analysis, paired intervals, ablations if budget allows; write sections 4-6 | Numbers traced to artifacts |
| Nov 12 | Freeze text, count words, produce PDF, submit before 23:59 UTC | Submitted writeup confirmed by the platform |

The main coding competition is separate: entry and team-merger deadline November 25, 2026, final submission December 2, 2026, both 23:59 UTC.

**Fallback if no compute or no results by the deadline.** Submit a truthful resource, pilot, or negative study describing the protocol, the pilot's actual outcome, and the blocked items — but only if such an artifact exists. A conceptual proposal must not be presented as results, and an unrun experiment must not borrow the vocabulary of findings.

## 11. Suggested paper shape

Working title: *Evidence-Preserving Handoff for Budgeted Code Agents: A Non-Regression Gate and Interruption Protocol*.

| Section | Content | Suggested words |
|---|---|---|
| Abstract | Problem, protocol, what was actually measured | 180 |
| Introduction | Budgeted repair, interruption, why transcripts fail | 350 |
| Protocol | State tuple, gate, packet, transitions | 550 |
| Implementation | Local roles and the declarative adapter, blocked capabilities named | 400 |
| Experiment | Arms, cut schedule, metrics, controls | 450 |
| Results | Measured numbers only, or an explicit statement that none exist | 400 |
| Limitations and related work | Prior art, novelty boundary, unrun items | 350 |
| Conclusion | Bounded claims | 120 |

This is a structure, not a draft. The budget is a recommendation and sits below the 3,000-word ceiling that includes title, abstract, captions, and tables.

## 12. What would falsify the plan

- The gated arm shows no reduction in post-resume regression at equal budget.
- Packet assembly costs more budget than the duplication it prevents.
- The gate rejects candidates the harness would have resolved, lowering the primary metric.
- Compaction turns out not to lose the state BCF assumes, removing the motivating failure.

Any of these is a publishable negative result under the competition's own rubric, provided it is reported as measured rather than argued.


---

<!-- ====================================================================== -->
<!-- FILE: 02_Paper_Competition_and_Whitepaper_Guide.md -->
<!-- ====================================================================== -->

# Paper competition and whitepaper guide

Prepared 2026-11-08 UTC. Markdown only; no external requests in this pass. Every claim below is drawn from research already collected under `../../scratch/2026-11-08_BCF_Research/`, primarily `paper_intelligence.md` and its raw captures. Evidence labels: **LIVE-OFFICIAL** (official page or config retrieved 2026-11-08), **LIVE-HOST** (dated host or admin answer), **LIVE-COMMUNITY** (participant statement, not reproduced), **ARCHIVED-OFFICIAL** (local capture with an earlier timestamp), **ANALYSIS** (explicitly derived).

## 1. Verified facts

| Fact | Value | Source and label |
|---|---|---|
| Paper deadline | November 12, 2026, 23:59 UTC | Timeline page 836470 and competition metadata; LIVE-OFFICIAL |
| Word ceiling | 3,000 words including title, abstract, captions, tables; figures and references excluded | Host answer 2026-10-27, thread 743255; LIVE-HOST |
| Judging unit | The linked PDF is judged on its own; the Kaggle body is ignored for judging and not counted | Host answer 2026-10-27, message 3545666; LIVE-HOST |
| Supplement | Appendix material does not count and is not guaranteed to be read | Host answer 2026-10-27, thread 749546; LIVE-HOST |
| Rubric | Five equally weighted criteria scored 0-5, averaged | Evaluation page 836465; LIVE-OFFICIAL |
| Prizes | $15,000 best paper, $10,000 best new resource, $10,000 best new application | Rules and track listing; LIVE-OFFICIAL |
| Separate track | Coding competition with its own $65,000 pool and its own deadlines | Specific rules page 752215; LIVE-OFFICIAL |
| Submission count | Five per day, up to two finals, maximum five team members | Rules; LIVE-OFFICIAL |
| Snapshot | 6,935 joined, 675 competitors, 649 teams, 701 submissions | Metadata 2026-11-08 shortly after 02:03 UTC; LIVE-OFFICIAL |

The snapshot counts are not counts of eligible papers, quality, or odds. The metadata deadline carries milliseconds (`2026-11-12T23:59:00.807Z`); use the published 23:59, not the extra milliseconds.

## 2. Judging rubric

Each criterion is scored 0 (lowest) to 5 (highest). Equal weighting means 20% each, with the final score `(Novelty + Quality + Relevance + Verifiability + Clarity) / 5`, also on a 0-5 scale. No subcriterion weights or intermediate descriptors were published.

| Criterion | Official description |
|---|---|
| Novelty | "Does the work provide new insights, deepen understanding, or highlight important properties of existing methods?" |
| Quality | "How general and universal is the Submission approach beyond the competition? Does your submission translate to other similar problems? How well does your method generalize?" |
| Relevance | "Is there significance and/or potential impact of the research on the field of software engineering and agentic learning?" |
| Verifiability | "Does the paper include sufficient information to understand how an innovation works; to understand how data was obtained, analyzed, and interpreted?" |
| Clarity | "Is the paper clearly presented and written?" |

The page states that rubric evaluations will not be shared, ties go to the paper entered first, and a disqualified winner is replaced by the next highest score. The host says the same criteria apply to the resource and application awards in those awards' context, that a writeup may be considered across awards but win only one, and that Best Paper takes precedence. None of this creates an advantage for submitting an early stub.

## 3. Awards and timeline

| Award | Amount | Definition |
|---|---|---|
| Overall Best Paper | $15,000 | Best submission under the five-criterion rubric |
| Best New Resource | $10,000 | A dataset, tool, or software contribution |
| Best New Application | $10,000 | An applied result, for example code graphs for TPU kernels or a new task |

The three awards sum to $35,000, matching the competition reward field. The generic `numPrizes: 1` field is not a reliable count of hackathon awards.

| Date (2026) | Event | Track |
|---|---|---|
| September 22 | Published start | Paper |
| September 23 | Metadata start date; main competition start | Both |
| November 12, 23:59 UTC | Paper submission deadline (optional relative to the coding track) | Paper |
| November 25, 23:59 UTC | Entry deadline and team-merger deadline | Coding |
| December 2, 23:59 UTC | Final submission deadline | Coding |

Organizers reserve the right to revise the timeline. A November 2 community request to extend the paper deadline has no host answer and is not an extension; do not adopt a community mention of November 13.

## 4. Submission mechanics

The paper submission is a **Kaggle Writeup**, not a leaderboard prediction ZIP and not a standalone notebook publication. Official steps are: join and accept the rules, create a New Writeup, save, then click **Submit** before the deadline. Saving a draft is not submitting, and an attached notebook or PDF does not itself submit the writeup. No authenticated editor was opened and no step was executed in this research.

| Asset | Status | What the official text says |
|---|---|---|
| Writeup body | Required | Title/subtitle, abstract, introduction, methods and experiments, related work with citations |
| Public notebook | Optional | Goes in Project Links; must be readable without login or paywall |
| Public Project Link | Optional | May host the paper as a publicly readable PDF instead of the body text |
| arXiv identifier | Not required | An arXiv link is permitted, not mandatory |
| Hosted app, website, video | Not required | No observed official source requires any of these for the paper track |

For a notebook, the Notebooks documentation distinguishes **Save Version, Quick Save** (snapshot without full execution) from **Save Version, Save and Run All** (new clean session, top-to-bottom execution). The latest saved version is what viewers see. The Models documentation says to name the notebook, create a Save Version, then click Share to make it public; saving a version and changing visibility are separate actions. Recommended verification, not an official requirement: after saving and setting Public, open the viewer URL in a signed-out window and confirm the intended text, results, and links are reachable. Link the viewer URL, not the edit URL. Public notebook visibility is not proof that every dependency is reproducible without accepting separate terms, and restricted input files must not be republished as outputs to work around that.

Two unresolved tensions are recorded rather than resolved. First, the public config sets `allowMultipleSubmissions: true`, `requireLinks: true`, and `requireCardImage: true`, while the overview describes the notebook and project link as optional; the exact editor enforcement was not tested. Second, a participant reported on October 22 that the form refused a second writeup with "You've already submitted to this competition", and a October 27 thread asking how two finals can both be judged has no answer. The live config allowing multiple submissions is not proof that the form works. A September report of a save/edit conflict endpoint returning a plain-HTML 404 also has no closure. None of these was reproduced.

## 5. Eligibility, licenses, and obligations

| Topic | Requirement | Qualification |
|---|---|---|
| Account | Registered Kaggle account; one account and one team only | Each member must register and confirm membership |
| Age | Older of 18 or local majority, unless the sponsor agrees with guardian consent | Paper-track minor procedure is **not** confirmed |
| Exclusions | Crimea, DNR/LNR, Cuba, Iran, North Korea, and persons under US sanctions | Local legality and prize availability still apply |
| Representation | Employer or entity consent when representing them | Competition-entity staff may enter but cannot win prizes |
| Identity | `requiresIdentityVerification: true` in metadata | No identity or account checks were performed here |
| Winner license | Open Source Apache 2.0 | Applies to the winning submission and its generating code |
| Data access | Competition Use and Commercial Apache 2.0 | Does not permit giving data to people who have not accepted the rules |
| External data | Publicly and equally accessible at no cost, or within the Reasonableness Standard | Rights must permit the use |

The minor-consent question is the clearest example of an overstated earlier claim. Thread 743314's two-form advice comes from a community commenter citing the separate coding track, not from a paper host. A November 6 follow-up asking staff to confirm applicability has no host answer in the captured record. Minor entry should therefore be described as unresolved, not approved.

Winner obligations are substantive: deliver generating code with training and inference code plus environment documentation, grant the stated license, and sign acceptance documents including eligibility certifications and US tax forms. Monetary terms include eligibility review, response within one week of notification, acceptance documents within two weeks, payment roughly 30 days after required documents, taxes borne by winners, and equal eligible team shares unless unanimously changed. California and Santa Clara County govern. Publicly shared competition code must be available through the competition forum or associated notebooks and is deemed licensed under an OSI-approved license not limiting commercial use; private sharing across teams is normally prohibited.

## 6. Coverage and gaps

| Surface | Coverage | Limitation |
|---|---|---|
| Discussion | 57 threads, 94 recursive comments/replies, all bodies read | Two comment records in thread 743681 are blank; original text unavailable |
| Code listing | 57 public items, metadata only | Cells, licenses, and dependencies not reviewed or executed |
| Writeups | HTTP 403: not public until the competition fully closes | No submitted paper or complete competitor inventory accessed |
| Notebook cells | Listing metadata and discussion descriptions | No cell-level audit or execution |
| Submission editor | Not exercised | Form enforcement, two-writeup workaround, identity flow untested |
| Docs | Notebooks, Models, Competitions, Winning Model guidelines captured | No publication timestamps; instructions not demonstrated on a signed-in account |

The code inventory is listing coverage, not a review of what any notebook does. Votes are a time-specific popularity signal, not a judging score, and latest-version dates are not original publication dates.

## 7. Host statements versus community claims

| Statement | Publisher | Status |
|---|---|---|
| Word count includes title, abstract, captions, tables; figures and references excluded | Elan Markowitz, HOST, 2026-10-27 | Binding clarification |
| Linked PDF judged alone; body treated as abstract and ignored | HOST, 2026-10-27 | Binding clarification |
| Appendix not guaranteed to be read | HOST, 2026-10-27 | Binding clarification |
| All award tracks considered; declaring an intended award optional | HOST, 2026-10-27 | Binding clarification |
| Multiple judges expected for top papers; original submission time likely used for ties | HOST, 2026-10-27 | Hedged ("likely") |
| Code optional if protecting it until the coding track ends | HOST, 2026-10-27 | Scoped permission |
| OSS rule believed to cover entrant code; notebook believed allowed to call harness wheels | HOST, 2026-11-04 | Explicitly tentative ("I believe") |
| Prior public GitHub experiment notes are not prior publication | HOST, 2026-11-04 | Case-specific approval |
| +116% issue resolution | Community author, 2026-11-01 | Later qualified by the same author as a component benchmark |
| Deadline extension to November 13 | Community mention | Not an announcement; no host answer |

Host hedges stay hedged. A tentative answer is not a licence to relicense or redistribute harness wheels, and a case-specific approval does not generalize to other submissions.

## 8. Rubric-to-evidence map

| Criterion | What a reviewer needs | Cheapest credible evidence | Common failure |
|---|---|---|---|
| Novelty | A stated delta against named prior work | One table positioning the contribution against the closest public work | Claiming to invent search, review, or checkpointing |
| Quality | Evidence the approach transfers | A second repository or task family, or an explicit scope limit | Single-repo result presented as universal |
| Relevance | A reason the field should care | A concrete failure mode with a measured cost | Generic "agents are important" framing |
| Verifiability | Enough detail to re-derive the result | Commands, versions, seeds, and artifact hashes | Numbers with no traceable run |
| Clarity | A paper that reads in one pass | Section budget respected, tables labelled, claims bounded | Overlength text that pushes tables past the ceiling |

## 9. Suggested word budget

| Section | Suggested words |
|---|---|
| Title and subtitle | 20 |
| Abstract | 180 |
| Introduction | 350 |
| Methods and protocol | 550 |
| Experiments and results | 700 |
| Related work | 300 |
| Limitations | 200 |
| Conclusion | 100 |
| Captions and table text | 400 |
| **Total** | **2,800** |

This is a recommendation, not a rule, and it sits comfortably below the 3,000-word ceiling that includes title, abstract, captions, and tables. Figures and references are excluded from the count.

## 10. Submission checklist

- Confirm the deadline as November 12, 2026, 23:59 UTC and submit with margin.
- Count words over title, abstract, captions, and tables; keep the total under 3,000.
- Put essential proofs in the main paper, not the appendix.
- Make every number traceable to a command, version, and artifact.
- State what was not run, and do not describe a proposal as a result.
- Keep restricted task text, gold patches, and test patches out of any public artifact.
- If using a linked PDF, verify it opens without login and is the version you intend to be judged.
- If attaching a notebook, save a version, set it public, and check the viewer URL signed out.
- Click **Submit** on the writeup; a saved draft is not a submission.
- Do not assume a second writeup can be submitted simultaneously; the form behaviour is unverified.

Do: cite the competition and upstream licences, use derived labels keyed by instance ID, and report aggregate results freely. Do not: republish supplied task files, patches, graphs, embeddings, or wheels; claim judge preferences; or present a community claim as a host ruling.

## 11. Sources

| Key | Source | Label |
|---|---|---|
| O | `kaggle.com/competitions/gemma-4-developer-agent-paper/overview` | LIVE-OFFICIAL, accessed 2026-11-08 |
| R | `.../rules` | LIVE-OFFICIAL |
| C | `CompetitionService/GetCompetition` | LIVE-OFFICIAL, HTTP 200 |
| P | `PageService/ListPages?competitionId=163111` | LIVE-OFFICIAL, HTTP 200 |
| T | `HackathonService/ListHackathonTracks` | LIVE-OFFICIAL, HTTP 200 |
| H | `HackathonService/GetCompetitionHackathonSettings` | LIVE-OFFICIAL, HTTP 200 |
| S | `HackathonService/GetHackathonSubmissionRuleSet` | LIVE-OFFICIAL, HTTP 200 |
| J | `HackathonService/ListJudges` | LIVE-OFFICIAL, HTTP 200 |
| D | `GetTopicListByForumId?forumId=12784402` | LIVE-OFFICIAL, 57 threads |
| K | `kernels.KernelsService/ListKernels` | LIVE-OFFICIAL, 57 items |
| W | `ListHackathonWriteUps` | HTTP 403, not public before closure |
| N, M, G, V | Notebooks, Models, Competitions, Winning Model docs | LIVE-OFFICIAL |

Exact request URLs, timestamps, and capture filenames are in the fetch ledger at `../../scratch/2026-11-08_BCF_Research/paper-fetch-log.jsonl`. Page publication dates are generally absent from the API; access dates must not be read as publication dates.


---

<!-- ====================================================================== -->
<!-- FILE: 03_ADK_SWEbench_Swegemma_Developer_Reference.md -->
<!-- ====================================================================== -->

# ADK, SWE-bench, and swegemma developer reference

Prepared 2026-11-08 UTC. Markdown only; no external requests in this pass. Written for a developer who has not used any of these components before. Everything below comes from material already collected under `../../scratch/2026-11-08_BCF_Research/` and `../../input/kagglecomp/kagglecomp_data_package/HARNESS_README.md`. No package was installed, no container was started, and no evaluation was run.

## 1. Conceptual map: four different things

The most common beginner error is treating these as one system. They are four layers with different owners, versions, and rules.

| Layer | What it is | Who owns it | Why it matters here |
|---|---|---|---|
| Google ADK | A code-first Python framework for building agents: `Agent`, `Workflow`, tools, callbacks, sessions | Google, open source, Apache 2.0 | The general framework; the competition uses a restricted declarative subset |
| Gemma 4 model | The model weights served behind an OpenAI-compatible endpoint | Google, served by the harness on 4x L4 | The agent's intelligence; the competition pins specific QAT variants |
| swegemma harness | The competition's evaluation stack: submission compiler, sandbox lifecycle, nine tools, scoring | Competition organisers | Defines what a submission may contain and how it is scored |
| Upstream SWE-bench | The public benchmark and its Docker evaluation harness | Princeton/Stanford researchers, MIT licence | Ancestor of the task format; not the same code path as swegemma |

ADK is not the model. The harness is not ADK, though it compiles submissions into ADK agents. Upstream SWE-bench is not the competition harness, even though the task shape and the PASS/FAIL idea are inherited from it. A fix that works in one layer does not automatically apply to another.

## 2. Versions in the collected wheelhouse

| Package | Version in the wheelhouse (2026-11-08) | Role |
|---|---|---|
| `swegemma` | 0.2.11 | SWE-bench-style harness, tools, scoring |
| `adk_submission` | 0.2.13 | Declarative submission compiler and inference server manager |
| `adk_eval_core` | 0.1.0 | Task models, sandbox backends, file editing, tracing |
| `google_adk` | 1.36.1 | The ADK framework itself |

The wheelhouse listing contains 41 files in total; these four are the load-bearing ones. Two cautions follow. First, the live ADK documentation describes ADK 2.0 with a `Workflow` class and a Task API, which is newer than the pinned 1.36.1 wheel; do not assume parity between the online docs and the pinned version. Second, version numbers here are wheel filenames, not proof that any of them import or run in this environment, because no install was performed.

## 3. Models, the single-model rule, and adapters

### 3.1 The current allowlist

The current competition page lists exactly four permitted variants:

- `gemma-4-31b-it-qat-w4a16-ct`
- `gemma-4-12b-it-qat-w4a16-ct`
- `gemma-4-e4b-it-qat-w4a16-ct`
- `gemma-4-e2b-it-qat-w4a16-ct`

Every agent and subagent in a submission must use the same model; mixing models within one submission is not possible. The bundled `HARNESS_README.md` states a narrower single-model rule naming only `gemma-4-31b-it-qat-w4a16-ct`, and its `ALLOWED_MODEL_NAMES` set contains that one value. That guide statement is **outdated** relative to the current page. Where they conflict, the current official page governs, and the discrepancy itself is unresolved: the page permits four aliases while the guide's scoring path enforces one.

### 3.2 Adapters

LoRA adapters in `.safetensors` format are optional. A submission may use different adapters per agent while keeping one base model: place PEFT directories containing `adapter_config.json` and `adapter_model.safetensors` under `adapters/<adapter_name>/`, then reference `adapter: <adapter_name>` on any `LlmAgent`. The serving configuration enables LoRA with `max_loras=8` and `max_lora_rank=128`, and the total unpacked submission must stay under 3 GiB including adapter weights.

Whether full fine-tuned checkpoints, merged-LoRA checkpoints, or other PEFT methods such as DoRA or prefix tuning are accepted is **unresolved**. A October 31 thread (754594) asks exactly this and has no host answer in the captured record. The submission tree mentions "LoRA adapters or model weights" while the detailed instructions describe only LoRA adapters. Treat non-LoRA weight adaptation as unsupported until an official answer exists.

## 4. The nine tools

The harness registers nine tools. A submission attaches any subset by name under `tools:` in `agent.yaml` or a sub-agent YAML. All budget-gated tools return a JSON string with `status: ok` or `status: error` plus `error_type`, `error_message`, and `details`.

| # | Signature | Budget | Behaviour |
|---|---|---|---|
| 1 | `run_command(command: str) -> str` | Counted | Runs `/bin/bash -c` in `/workspace`; timeout `min(300s, remaining)`; stdout and stderr truncated to 5,000 chars each |
| 2 | `submit_patch() -> str` | Not counted | Stages `git add -N .`, captures `git diff --binary` against the baseline, sets `patch_submitted` |
| 3 | `get_status() -> str` | Not counted | Returns tool calls used and remaining, patch status and size, time remaining, max turns |
| 4 | `read_file(filepath: str, start_line: int \| None = None, end_line: int \| None = None) -> str` | Counted | 1-indexed inclusive slice; capped at 150 lines and 10,000 chars; `is_truncated` and `end_line` report the cut |
| 5 | `edit_file(filepath: str, old_string: str, new_string: str, allow_multiple: bool = False) -> str` | Counted | Three-tier match (exact, flexible, regex); refuses multiple matches unless allowed; returns the diff |
| 6 | `write_file(filepath: str, content: str) -> str` | Counted | Creates or overwrites, making parent directories |
| 7 | `get_code_neighbors(node: str, edge_type: str \| None = None, max_neighbors: int = 50) -> str` | Counted | Incoming and outgoing neighbours in the call/dependency graph |
| 8 | `search_similar_code(query: str, k: int = 10) -> str` | Counted | Top-k nodes by cosine similarity in the pre-computed embeddings |
| 9 | `get_code_subgraph(nodes: list[str]) -> str` | Counted | Induced subgraph over the given symbols |

Two details are easy to get wrong. `read_file`'s `start_line` and `end_line` are **inclusive**, so a request for lines 1 to 150 returns 150 lines. And `submit_patch` is free but terminal: once a turn ends with `patch_submitted` true, the harness exits the agent loop, so it belongs last.

Paths resolve relative to `/workspace`; a leading `/` or `/workspace/` prefix is stripped, and any `..` component raises a validation error. `search_similar_code` does not embed free text: with no live embedding server it resolves the query against stored node keys and suffixes, so pass a symbol name such as `HTTPConnection`, not a sentence.

## 5. Why tools are restricted, and what that blocks

The submission format is declarative by design. Competitors do not submit a Python entrypoint; `adk-submission` replaces ADK's `from_config()` with a sandboxed YAML compiler and never uses `importlib`. Agents, sub-agents, workflows, tools, and generation parameters all resolve against closed host registries: `ToolRegistry`, `ModelRegistry`, `SkillRegistry`, and `CallbackRegistry`.

| Mechanism | Effect on a submission | Consequence |
|---|---|---|
| Closed `ToolRegistry` | Only the nine tools plus `agent_tool` sub-agents are attachable | No custom Python tool functions |
| Closed `CallbackRegistry` | Callbacks resolve against host-registered names | No arbitrary `before_tool_callback` code |
| No Python entrypoint | `agent.py` and `agent_fn` are not accepted | Logic must live in YAML, prompts, and skills |
| `!include` sandboxing | Relative paths only; absolute paths, null bytes, `..`, and escaping symlinks blocked | Prompts can be split across files but not read outside the archive |
| Extension allowlist | `.yaml`, `.yml`, `.md`, `.txt`, `.py`, `.json`, `.safetensors` only | Pickle weights such as `.bin` or `.pt` are rejected |
| Excluded config fields | `tools`, `system_instruction`, `http_options`, `safety_settings`, `response_schema` inside `generate_content_config` raise validation errors | Generation config cannot re-enable execution paths |

Skills deserve a precise reading. A skill is a directory with a `SKILL.md` manifest carrying YAML frontmatter (`name: <skill-name>`), optionally with `scripts/` and `resources/`. Scripts run through `run_skill_script` inside the competition's persistent Docker container, share the filesystem with `run_command`, and debit execution time against the central budget. So a `.py` skill script is **not** arbitrary host control: it runs sandboxed, in the same container, under the same budget. It is also not a gate, because it can mutate `/workspace` exactly as `run_command` can.

The submission layout is fixed at the archive root: `agent.yaml` (or `root_agent.yaml`, `.yml` also accepted), optional `eval_config.yaml`, `configs/`, `prompts/`, `sub_agents/`, `adapters/`, and `skills/`. Exactly one root config must exist; zero raises `MissingRootConfigError` and more than one raises `MultipleRootConfigsError`.

## 6. The two-sandbox lifecycle

Every task runs in two separate container lifecycles. Container A hosts the agent; Container B verifies the patch. They never share state, which is why a patch must be a real diff rather than a claim.

| Phase | Container A (agent) | Container B (verification) |
|---|---|---|
| Setup | Extract snapshot at `base_commit` with future history removed, install editable package, stream cached test dependencies, write `pytest.ini` and `conftest.py`, commit `baseline` | Same setup, commit `eval_baseline` |
| Work | Agent session starts after setup; timer begins only at `start_agent_session()` | Apply `agent_patch` with four fallback passes |
| Extraction | `git add -N .` then `git diff --binary` against the baseline | Reset protected test and config paths to `HEAD` |
| Verification | None | Apply `task.test_patch`, run hermetic `pytest` with JUnit XML |
| Result | Patch string, or empty | `resolved = True` only if exit code 0 and the JUnit report shows passes with no failures, errors, or skips |

Container settings matter for diagnosis: `network_mode="none"`, 4 GiB memory (exceeding it yields exit code 137), 2 vCPUs, working directory `/workspace`, and warm pooling that wipes `/workspace` between phases.

The **test oracle caution** is the single most important operational point. Phase 2 resets any file matching `test_*.py`, `*_test.py`, files under `tests/`, `test/`, or `testing/`, and runner configuration such as `conftest.py`, `pytest.ini`, `pyproject.toml`, `tox.ini`, `setup.cfg`, `sitecustomize.py`, `usercustomize.py`, and `*.pth`. Any edit there is discarded before the task's test patch is applied. An agent that "fixes" the tests scores zero. The harness also writes `/workspace/pytest.ini` and `/workspace/conftest.py` into the baseline commit, so touching them pollutes the diff.

Artifacts land in the results directory: `summary.json`, append-only `task_results.jsonl`, `patches/<instance_id>.patch`, `test_outputs/<instance_id>.log`, `traces/trace_<instance_id>.json`, and `logs/<instance_id>.log`. These are the only trustworthy record of what happened; an agent's own summary is not.

## 7. Documented CLI commands

The following are reproduced from the bundled guide's CLI section. They are **guide-derived and were not run** in this research; treat them as documentation, not as validated commands.

```bash
swegemma eval \
  --tasks tasks.jsonl \
  --snapshots-dir snapshots \
  --submission-dir sample_submission \
  --results-dir results/run_01 \
  --sandbox docker \
  --max-tool-calls 50 \
  --max-time-minutes 30 \
  --concurrency 2 \
  --display auto
```

| Flag | Purpose |
|---|---|
| `--task-id` / `--task-ids` | Evaluate specific `instance_id` values for rapid debugging |
| `--sandbox {docker,subprocess}` | Docker containers (default) or local subprocess isolation |
| `--concurrency N` | Parallel tasks; activates the multi-slot dashboard |
| `--shard-index k --num-shards M` | Deterministic shard where `task_idx % M == k` |
| `--models-yaml` | Custom alias and pricing map |
| `--skip-agent-patch` | Bypass Phase 1 to confirm baseline test failure in Phase 2 |

The separately collected ADK documentation describes ADK's own commands for local agent work: `adk create --type=config my_agent`, `adk run`, `adk web`, `adk api_server`, `adk eval`, and `adk deploy docker --with_ui`. Those come from the ADK documentation and README, not from the competition harness, and none was executed here.

## 8. Windows, Linux, and Docker paths

| Environment | Practical requirement | Pitfall |
|---|---|---|
| Windows host | Docker Desktop with WSL 2 backend; at least 8 CPUs, 16 GB RAM, 120 GB disk image | Bind mounts from `C:` are slow and can break in-container paths |
| WSL 2 | Keep the repository inside the Linux filesystem, not under `/mnt/c` | Cross-filesystem permissions and line endings |
| Linux | Docker Engine plus `usermod -aG docker $USER` | Group change needs a new shell |
| Any host | `docker system df` before a run; `--cache_level env` balances speed and disk | `instance` caching can reach roughly 2,000 GB |

Two version facts must not be conflated. The host wheel set targets Python 3.12 compatibility for the harness libraries, while the task sandbox image provides Python 3.13 with `git`, `pytest`, and build backends, plus `imp` and `telnetlib` shims for older suites. A package that imports on the host is not thereby importable inside the task container.

No universal GPU claim applies. The competition scoring environment is described as 4x NVIDIA L4 with 96 GB total VRAM and `max_model_len=32768`. A local machine without those GPUs can still run the subprocess sandbox and small checks, but cannot reproduce the serving configuration, and nothing in this research measured either path.

## 9. Schema-derived starter YAML

The following is assembled from the documented schema fields. It is **explicitly unvalidated**: it was not compiled, not loaded by `adk-submission`, and not run. It is not an executable deliverable. It omits adapters and dynamic callbacks, and it uses only tool names and a model alias that appear in the collected sources.

```yaml
name: root_coder
agent_class: LlmAgent
model: gemma-4-31b-it-qat-w4a16-ct
description: Root agent that repairs a repository issue under a fixed budget.
instruction: |
  Work only inside /workspace. Read the problem statement from {problem_description}.
  Make one behaviour change at a time, verify with targeted tests, then call submit_patch.
tools:
  - run_command
  - read_file
  - edit_file
  - write_file
  - get_status
  - submit_patch
sub_agents:
  - config_path: sub_agents/code_analyzer.yaml
```

```yaml
name: code_analyzer
agent_class: LlmAgent
model: gemma-4-31b-it-qat-w4a16-ct
description: Read-only analyst that locates candidate symbols and returns a short list.
instruction: |
  You never modify files. Use the graph tools to locate candidate symbols and report them.
tools:
  - read_file
  - get_code_neighbors
  - search_similar_code
  - get_code_subgraph
```

Three points about this sketch. `{problem_description}` and `{hints}` are session-state variables the harness populates, so instruction templating works without extra wiring. The analyst has no write tools, which is the only enforcement of read-only behaviour available in a declarative submission. And `submit_patch` appears on the root agent only, because a sub-agent calling it would end the episode from an unexpected place.

## 10. Budgets: documented defaults versus enforced behaviour

| Parameter | Documented default | Override | Note |
|---|---|---|---|
| Session wall-clock | 60 minutes | `evaluation.max_time_minutes`, `SWE_MAX_TIME_MINUTES` | Timer starts after container setup |
| Max tool calls | 100 in the inference script, none in the CLI | `evaluation.max_tool_calls`, `SWE_MAX_TOOL_CALLS` | Sample submission uses 10 |
| Max turns | 500 | `evaluation.max_turns`, `SWE_MAX_TURNS` | `None` becomes 500 |
| Command timeout | 300 seconds | `evaluation.timeout_seconds`, `SWE_TIMEOUT_SECONDS` | A timeout does not end the session |
| Output cap | 5,000 chars | Not exposed | Applies to stdout, stderr, and diffs |
| Read cap | 150 lines and 10,000 chars | Not exposed | Dual truncation |
| `max_output_tokens` | 16,384 | `generate_content_config` | Bounded by 32,768 |
| `thinking_budget` | 4,096 | `generate_content_config` | Bounded by 32,768 |

The nuance that costs people runs: a schema accepting a field is not the same as the harness enforcing the value. `thinking_config` accepts `thinking_level`, but under vLLM's OpenAI-compatible endpoint that maps to `reasoning_effort`, and the guide recommends omitting it in favour of `include_thoughts: true` with an explicit `thinking_budget`. Likewise the documented 12-hour aggregate limit for submitting patches across all tasks is a competition rule, while the per-task 60-minute default is a harness default; they are different clocks and neither was measured here.

## 11. Troubleshooting

| Symptom | Likely evidence | Diagnostic | Do not |
|---|---|---|---|
| Patch applies but nothing resolves | `test_outputs/<id>.log` shows failures after reset | Check whether the edit touched a protected test or config path | Rewrite the tests |
| `Failed to apply agent patch` | Phase 2 log, four-pass failure | Inspect `patches/<id>.patch` for context drift or binary content | Re-submit the same diff |
| Exit code 137 | Container killed | Memory limit is 4 GiB; look for a runaway test process | Raise parallelism |
| `FileEditError` | Tool response with `error_type` | `old_string` matched zero or several times, or the file is empty | Retry identical arguments |
| Truncated tool call | Nudge text mentions an unclosed `<\|tool_call>` | Lower `thinking_budget`, split edits | Repeat the same large edit |
| `MissingRootConfigError` | Compile-time error | Exactly one of `agent.yaml`, `agent.yml`, `root_agent.yaml`, `root_agent.yml` at the archive root | Add a second root file |
| Model rejected | `ParticipantVisibleError` | Declared alias must match the allowlist and be unique | Mix two base models |
| Graph tools return nothing | Empty results with `status: ok` | Check mounts, node identifiers, and snapshot alignment; the public data page lists graph assets for the public tasks | Assume the tool is broken or empty results prove no relevant code exists |

The general rule: read the artifact that recorded the failure before changing anything. A symptom without its log line is a guess.

## 12. Sources

| Source | Location | Status |
|---|---|---|
| Model allowlist and tool signatures | `technical-page-863538.txt` | Current official page, retrieved 2026-11-08 |
| Evaluation, ZIP layout, 12-hour limit | `technical-page-752214.txt` | Current official page |
| Main competition timeline | `technical-page-802362.txt` | Current official page |
| Dataset description | `technical-page-752212.txt` | Current official page |
| Specific competition rules | `technical-page-752215.txt` | Current official page |
| Harness guide | `input/kagglecomp/kagglecomp_data_package/HARNESS_README.md` | Bundled guide; outdated single-model statement |
| ADK README, config, callbacks | `technical-adk-readme.md`, `technical-adk-config.md`, `technical-adk-callbacks.md` | Retrieved docs; ADK 2.0 may be newer than the pinned wheel |
| SWE-bench README and Docker guide | `technical-swebench-readme.md`, `technical-swe-docker.md` | Upstream project docs |
| Wheelhouse listing | `technical-wheelhouse-all.json` | 41 files, versions as listed |
| Adapter clarification thread | `technical-adaptation.json` | Unanswered question, thread 754594 |

## 13. Boundaries

- Wheel source extraction was blocked by an execution approval gate. No package source was inspected, and no equivalent extraction was attempted.
- No package was installed, no container was started, no evaluation was run, and no BCF experiment exists.
- The CLI commands in section 7 are guide-derived and unexecuted; the YAML in section 9 is schema-derived and unvalidated.
- No precise undocumented compiler function signatures are offered here. Names such as `compile_submission`, `validate_single_declared_model`, and `build_submission_limits` appear in the guide as descriptions, not as verified callable interfaces.
- The current official four-alias page supersedes the guide's older one-alias eligibility statement. The actual installed compiler and scorer must still be checked against their pinned versions; the archived guide is not proof of current runtime enforcement.


---

<!-- ====================================================================== -->
<!-- FILE: 04_Paper_Tab_Research_Inventory.md -->
<!-- ====================================================================== -->

# Appendix: detailed paper-tab research inventory

Archived detailed research appendix, status as of **2026-11-08 UTC**. This is the preserved research record behind documents 01-03, not a competition rule and not a final paper. Live retrievals began at approximately 02:03 UTC; exact request times, URLs, methods, payloads, status codes, and capture filenames are in the [fetch ledger](../../scratch/2026-11-08_BCF_Research/paper-fetch-log.jsonl).

## Scope and method

Research the current paper-track overview, rules, submission mechanics, judging, prizes, eligibility/licensing, public code listing, and every publicly indexed discussion thread. Six angles: requirements/timeline; rubric/awards; submission and public links; legal/eligibility; host Q&A/platform failures; public research landscape and coverage. Completion means evidence-backed intelligence and an explicit boundary around inaccessible material, not an assertion that private submissions were read.

Research was sequential, anonymous, read-only, and used no credentials, browser profiles, submissions, publications, or restriction bypass. Web search and scrape were tried first; their rate-limit/security-shell results were not treated as competition facts. Public frontend read endpoints returned substantive official content without authentication. No browser/toolkit was used. POST was used only for the read-only ListKernels operation, not to mutate anything.

Evidence labels: **LIVE-OFFICIAL** = official page/config/docs retrieved now; **LIVE-HOST** = dated host/admin answer retrieved now; **LIVE-COMMUNITY** = participant statement retrieved now, not independently reproduced; **ARCHIVED-OFFICIAL** = local primary-page capture with an earlier timestamp; **ANALYSIS** = explicitly derived interpretation. Page publication/update dates are generally absent from the API; access dates must not be mistaken for publication dates.

## Executive findings and access limits

The current deadline is **November 12, 2026, 23:59 UTC**, verified in both the live Timeline and competition metadata. The rubric is five equally weighted criteria scored **0–5**, averaged; the 3,000-word ceiling includes title, abstract, captions, and tables but excludes figures and references. Host clarifications say a linked PDF is judged on its own, the Kaggle body can serve as its abstract, and supplementary material is not guaranteed to be read. Total prizes remain **$35,000** across **$15,000 / $10,000 / $10,000** awards.

Public discovery returned **57 discussion threads**, with **94 comment/reply records**, and **57 public code items associated with this paper competition**. Every listed thread body and returned comment/reply was read; the recursive count exactly matches the index. Two comment records have blank content. Code inventory coverage is metadata/listing coverage, **not a review or execution of all notebook cells**. Public Writeups are explicitly blocked until closure: the API returned HTTP 403 and `Writeups are not publicly available until the competition has fully closed`. Therefore a complete scan of submitted papers is not possible anonymously now.

There are unresolved operational issues: participants report a form allowing only one submitted writeup despite the two-final rule; a September save/edit conflict bug has no closure in its thread. These are reports, **not reproduced current failures**. A November deadline-extension request has no host answer and is not an extension. Do not repeat September claims of low competition, unusually favorable win odds, graph-preferring judges, or an assured early-stub tie-break advantage.

## Canonical sources and retrieval keys

All URLs below are official Kaggle unless a thread author is identified as community. Official page publication dates unknown; accessed 2026-11-08. The API payload is the underlying public content, not an independently authenticated rendering of the editor.

| Key | Source URL | Publisher / access / capture |
|---|---|---|
| O | https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/overview | Google DeepMind / Kaggle; LIVE-OFFICIAL via P |
| R | https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/rules | Google LLC / Kaggle; LIVE-OFFICIAL via P, both specific and foundational rules |
| C | https://www.kaggle.com/api/i/competitions.CompetitionService/GetCompetition?competitionName=gemma-4-developer-agent-paper | Kaggle metadata; HTTP 200; paper-api-competition.json |
| P | https://www.kaggle.com/api/i/competitions.PageService/ListPages?competitionId=163111 | Published pages; HTTP 200; paper-api-pages.json and decoded paper-page-ID.txt |
| T | https://www.kaggle.com/api/i/competitions.HackathonService/ListHackathonTracks?competitionId=163111 | Prize descriptions; HTTP 200; paper-api-tracks.json |
| H | https://www.kaggle.com/api/i/competitions.HackathonService/GetCompetitionHackathonSettings?competitionId=163111 | Public config; HTTP 200; paper-api-settings.json |
| S | https://www.kaggle.com/api/i/competitions.HackathonService/GetHackathonSubmissionRuleSet?competitionId=163111 | Public validator configuration; HTTP 200; paper-api-submissionrules.json |
| J | https://www.kaggle.com/api/i/competitions.HackathonService/ListJudges?competitionId=163111 | Judge listing; HTTP 200; paper-api-judges.json |
| D | https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion | Inventory via GetTopicListByForumId, forumId=12784402; thread URLs and dates below |
| K | https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/code | Inventory via POST https://www.kaggle.com/api/i/kernels.KernelsService/ListKernels; request bodies in ledger |
| W | https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/writeups | Listing API denied anonymous access; not read |
| N | https://www.kaggle.com/docs/Notebooks | Kaggle documentation; LIVE-OFFICIAL via cms.LegacyCmsService/GetPage; paper-docs-notebooks.json |
| M | https://www.kaggle.com/docs/models#hf-creation | Kaggle documentation; LIVE-OFFICIAL; paper-docs-models.json |
| G | https://www.kaggle.com/docs/competitions#hackathon-competitions | Kaggle documentation; LIVE-OFFICIAL; paper-docs-competitions.json |
| V | https://www.kaggle.com/WinningModelDocumentationGuidelines | Kaggle documentation; LIVE-OFFICIAL; paper-docs-winning.json |

Exact API request URLs and raw-capture mappings: [fetch ledger](../../scratch/2026-11-08_BCF_Research/paper-fetch-log.jsonl). First curl requests preceded that ledger: the live overview HTML and headers record 2026-11-08 02:03:11 GMT; C followed, returning HTTP 200. The public frontend bundle used to identify read endpoints is https://www.kaggle.com/static/assets/app.js?v=5747944b4d70e88e and is saved as paper-kaggle-app.js.

## Current requirements: claim/source/date ledger

| Claim | Source and publisher | Source date / access / qualification |
|---|---|---|
| Independent paper hackathon; main coding competition participation not required; novel unpublished related research or an account of the prediction approach welcome. | O, Description page 836464; Google DeepMind | Undated / 2026-11-08 / LIVE-OFFICIAL |
| Published start September 22; final deadline November 12 at 23:59 UTC. Organizers may revise it. | O, Timeline page 836470; C | Undated / 2026-11-08 / LIVE-OFFICIAL. C deadline has milliseconds: `2026-11-12T23:59:00.807Z`; use published 23:59, not extra milliseconds. |
| Entry and team-merger explicit deadlines both November 12, 23:59 UTC. | C | LIVE-OFFICIAL metadata; C dateEnabled is September 23, distinct from the advertised start. |
| Five submissions/day; up to two finals; maximum five team members; mergers subject to cumulative submission limits. | R; C | LIVE-OFFICIAL; end-to-end two-writeup UI operation untested. |
| Current metadata: 6,935 joined users, 675 competitors, 649 teams, 701 submissions. | C | Snapshot 2026-11-08 shortly after 02:03 UTC; not counts of eligible papers, quality, or odds. |
| Join competition and submit a Kaggle Writeup; saving a draft is not submitting. | O, Submission Requirements page 836469; G | LIVE-OFFICIAL |
| Required prose components: title/subtitle, abstract, introduction, description of methods/experiments, related work/citations. | O / 836469 | LIVE-OFFICIAL |
| Maximum 3,000 words; original unpublished research; non-archival. | O / 836469 | LIVE-OFFICIAL; detailed count clarified by host below. |
| Suggested topics include tuning/optimization, code comprehension, tasks/benchmarks, and graph reasoning; list explicitly non-exhaustive. | O / 836469 | LIVE-OFFICIAL; no inferred requirement to use graphs. |
| Optional public notebook goes in Project Links; it must be readable without login/paywall. Private attached Kaggle resources automatically become public after deadline. | O / 836469; G | LIVE-OFFICIAL; publication is not a promise that all underlying gated inputs become freely downloadable. |
| Optional Public Project Link supports an arXiv-ready PDF (LaTeX/Word-produced) instead of the paper in the Writeup body; public/no paywall/login. | O / 836469 | LIVE-OFFICIAL; does not require an arXiv identifier, hosted app, or a website build. |
| Public config has `allowMultipleSubmissions:true`, `requireLinks:true`, `requireCardImage:true`; rule set has exactly one cover image, bodyWords minimum 30, legacyRequireLinks 1. | H; S | LIVE-OFFICIAL config, not authenticated UI verification. Optional-asset wording vs required link setting is an unresolved documentation/config tension. No maximum bodyWords in config does not waive the 3,000-word rule. |
| Competition metadata sets `requiresIdentityVerification:true`. | C | LIVE-OFFICIAL config; no identity or account checks performed. |
| Three awards: Overall Best Paper $15,000; Best New Resource $10,000; Best New Application $10,000. | R; T | LIVE-OFFICIAL; sum $35,000 matches C reward. Generic C `numPrizes:1` is not a reliable count of hackathon awards. |
| Resource means a dataset/tool/software, versus an empirical paper generating knowledge; application examples include code graphs for TPU kernels or new tasks. | T | LIVE-OFFICIAL award definitions, not a preference inferred from judge biographies. |
| Prize-winning submissions highlighted at Google-hosted event; T says NeurIPS 2026 expo, Description uses example wording. | O; T; thread 743310 | Host 2026-09-29 / retrieved 2026-11-08; no broader acceptance program promised. |
| Public judge listing contains Elan Markowitz, Machine Learning Engineer, Google. | J | LIVE-OFFICIAL. Host says multiple judges for top papers in thread 750338; citation authors are not proof of reviewer membership. |

## Exact judging rubric

Source: [Evaluation](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/overview/evaluation), live page 836465. Each criterion is **0 (lowest) to 5 (highest)**. Equal weighting means **20% each** (arithmetic interpretation of the explicit equal-average rule), with final score `(Novelty + Quality + Relevance + Verifiability + Clarity) / 5`, also on a 0–5 scale. No disclosed subcriterion weights or intermediate-score descriptors were found.

| Criterion | Official description |
|---|---|
| Novelty | Does the work provide new insights, deepen understanding, or highlight important properties of existing methods? |
| Quality | How general and universal is the Submission approach beyond the competition? Does your submission translate to other similar problems? How well does your method generalize? |
| Relevance | Is there significance and/or potential impact of the research on the field of software engineering and agentic learning? |
| Verifiability | Does the paper include sufficient information to understand how an innovation works; to understand how data was obtained, analyzed, and interpreted? |
| Clarity | Is the paper clearly presented and written? |

The published page says rubric evaluations will not be shared; ties go to the paper entered first; a disqualified winner is replaced by the next highest score. The host explains the same criteria apply to resource/application awards in those awards' context, and a writeup may be considered across awards but win only one. Best Paper takes precedence. These rules do not establish an advantage for submitting an empty stub.

## Host/admin clarifications: load-bearing updates since September

Each statement below was read in the live thread JSON on 2026-11-08. Publisher is **Elan Markowitz, HOST**, unless explicitly noted. Host hedges remain hedged. These answers clarify particular cases; they are not blanket permission to ignore licenses or foundational rules.

| Topic / claim | Source URL | Answer date and exact scope |
|---|---|---|
| Word count includes all judged text: title, abstract, captions, tables. Figures/references excluded. | https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/743255 | 2026-10-27, messages 3545675, 3545670, 3545666. No official word counter yet released as of that answer. |
| Linked PDF has the same 3,000-word cap and is judged alone; Kaggle body recommended as abstract, ignored for judging and not counted. | https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/743255#3545666 | 2026-10-27. Essential proofs or shortened versions should be in main paper. |
| Appendix/supplementary material does not count, but is not part of main evaluation and is not guaranteed to be read; may support verifiability like code. | https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/749546 | 2026-10-27, message 3545695; reference-style/appendix-table follow-ups remain unanswered. |
| All submissions considered across tracks; declaring an intended award is optional. | https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/750338 | 2026-10-27, message 3545656. |
| Multiple judges expected for top papers; ties expected rare; original submission time would **likely** be used if necessary. | https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/750338 | 2026-10-27. Does not conclusively settle unsubmit/resubmit or external-PDF version locking. |
| Full pipeline need not run on Run All; code execution not guaranteed during judging. Quick runnable verification is a host suggestion. | https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/750338 | 2026-10-27. Do not claim judges require full retraining or guarantee execution. |
| Code not required if protecting it until main competition ends; paper deadline earlier because judging takes longer. | https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/752667 | 2026-10-27. No approval to attach a private resource yet defer its automatic publication. |
| Full new dataset may be released after main track if necessary; immediate small sample, e.g. 5% random sequences, suggested for verifiability. | https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/751413 | 2026-10-27. This is a specific host accommodation, not a replacement publication date for all attachments. |
| GitHub should work for sharing code; external dataset evaluation requires rights/permissions. | https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/751804 | 2026-10-27. Asked about external-data-only research. Public notebook remains the overview's stated route; link code in the competition forum to satisfy sharing language conservatively. |
| Regenerated graphs permitted with appropriate licensing; detailed independent upstream dataset release explicitly confirmed. | https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/743255 | 2026-10-27, messages 3545670 and 3545676. Detailed confirmed proposal excludes official task text, gold/test patches, supplied graphs/embeddings, official task base commits; keeps upstream notices and cites competition. |
| Agent traces described by Fasil acceptable with upstream citation/license. | https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/743255#3545672 | 2026-10-27. Proposal removed problem statements/hints and gold/test patches; did not grant unrestricted redistribution of all raw archives. |
| Derived labels instance ID to file/symbol locations may be published. | https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/749803 | 2026-10-27, message 3545696. Asked about labels without statement/patch/test content. |
| Preferred translation release: translated prose keyed by instance ID; link original dataset or reconstruct verbatim parts by script. | https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/749803#3549536 | 2026-11-03; host says **I believe** preferred method. Participant agreed to placeholders for verbatim spans. |
| Independent reviewers acceptable if following competition licensing; aggregate reporting unrestricted. | https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/751403 | 2026-10-27. Not a general exception for private distribution of restricted competition assets. |
| OSS rule **believed** to cover entrant's code; public notebook **believed** allowed to call supplied harness wheels. | https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/753871 | 2026-11-04. Both answers explicitly use **I believe**; no permission to relicense/redistribute wheels. |
| Prior public GitHub experiment notes/results not prior publication; eligible case. | https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/755867 | 2026-11-04. |
| arXiv preprint before deadline allowed; can submit arXiv link. | https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/745872 | 2026-10-05. |
| Extended new study after public pilot/blog eligible in described case. | https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/745150 | 2026-10-05. Not blanket approval of unchanged previously published work. |
| Non-archival; parallel other-venue/arXiv submissions allowed and encouraged. Only prize winners promised event highlighting. | https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/743310 | 2026-09-29. Other venues' own policies not checked. |
| Coding assistants including Codex permitted subject to terms/requirements; purely LLM-generated low-quality prose will not score well. | https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/745712 | 2026-10-05; host statement, not an automatic disqualification rule. |
| Individuals without a company can receive prizes; reasonable likeness accommodations available. | https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/745712 | 2026-10-05; Ashley Oldacre, ADMIN. |
| Photo publicity opt-out allowed; identity-verification photos kept separate from marketing. | https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/745326 | 2026-10-05; Ashley Oldacre, ADMIN. |
| Not attending Google event in person does not affect prize eligibility. | https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/749463 | 2026-10-27; remote/recorded logistics not answered. |
| Private scoring uses private repos, not the 27 public fastapi tasks reported broken. | https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/753370 | 2026-11-04. Confirms scoring separation, not that every local sandbox installation issue is verified/fixed. |

## Submission and notebook publishing: what the links actually mean

The paper submission is a **Kaggle Writeup**, not a leaderboard prediction ZIP or a standalone notebook publication. Official steps are join/accept rules, create **New Writeup**, save, then click **Submit** before the deadline. An attached notebook and/or PDF does not itself submit the writeup. Generic hackathon documentation says select a track; this competition exposes one grouping, and the host assigns award consideration. No authenticated editor was opened and no step was executed.

For a notebook, official [Notebooks documentation](https://www.kaggle.com/docs/Notebooks) distinguishes **Save Version → Quick Save** (snapshot, no full execution) from **Save Version → Save & Run All** (new clean session, top-to-bottom execution). The latest saved version is shown to viewers. Official [Models integration documentation](https://www.kaggle.com/docs/models#hf-creation) explicitly says give the notebook a name, create a **Save Version**, then click **Share** to make it public. Saving a version and changing visibility are separate actions. The docs place sharing/privacy controls in **Share/Sharing** and say anyone can view public notebooks. Current authenticated dialog wording was not tested.

Recommended verification, not an extra official requirement: after saving and setting Public, open the viewer URL in a signed-out/private window and confirm the intended text/results and relevant links are accessible. Link the viewer, not the edit URL. Underlying models/datasets can have independent licenses/access restrictions; public notebook visibility alone is not proof that anyone can reproduce every dependency without accepting terms. Do not publish restricted input files as output to work around those restrictions.

**Public Notebook** is an optional code/reproducibility asset, while **Public Project Link** is explicitly an allowed location for a publicly readable PDF paper instead of the main Writeup text. An arXiv link is permitted, not mandatory. Generic docs also allow GitHub/Hugging Face resources as annotated external links. The host says GitHub should work for sharing code, but the raw-data restrictions still apply. No observed official source requires deploying an app, building a custom website, buying hosting, publishing HTML, or providing a video for this paper track. Config shows a cover-image requirement and link requirement; their exact editor enforcement remains untested.

## Eligibility, licenses, and obligations

LIVE-OFFICIAL R: registered Kaggle account, normally the older of 18 or local age of majority, unless sponsor agrees and proper parental/guardian consent is obtained. Exclusions name Crimea, DNR/LNR, Cuba, Iran, North Korea and people/entities under US export controls/sanctions; local legality and prize availability still matter. Only one Kaggle account and one team; each member must register and confirm membership. Employer/entity consent required when representing them. Competition-entity staff may participate subject to policy but cannot win prizes. Identity-verification configuration is enabled.

**Minor participation is not fully settled for this paper track.** Thread 743314's two-consent-form instructions are from a COMMUNITY commenter, citing the separate coding-track thread, not a paper-host reply. A November 6 follow-up explicitly asks staff to confirm applicability and whether a separate competition-specific form is needed; it has no host answer in the captured record. The September report promoted this to an established eligibility fact; that overstates the evidence. Cited but not separately verified here: https://www.kaggle.com/guardian-consent-minor-use ; https://www.kaggle.com/consent-minors-process ; https://www.kaggle.com/competitions/gemma-4-developer-agent/discussion/742815 .

Specific terms name **Open Source Apache 2.0** for the winner and **Competition Use and Commercial Apache 2.0** for data access/use. They also prohibit making Competition Data available to people who have not accepted the rules. Read those clauses together: the heading is not blanket permission to republish supplied task files, patches, graphs, or wheels. Host approvals for independent regenerated graphs, derived labels, and limited traces are scoped to the proposals above. External data/tools must be publicly/equally accessible at no cost or meet the host's minimal-cost/reasonableness standard; rights must permit use.

Publicly shared competition code must be available through the competition forum or associated notebooks and is deemed licensed under an OSI-approved license not limiting commercial use. Private sharing across teams is normally prohibited. Winners must provide generating code, training/inference code and environment documentation as applicable, reproducible methodology/repository instructions, required licenses, eligibility certifications and tax forms. Commercial third-party software and incompatible-license input data/pretrained models have specified exceptions from relicensing; ownership and permission obligations remain. The rules state foundational rules control conflicts, despite generic leaderboard language that does not fit paper judging neatly; do not fabricate a paper leaderboard from C's `hasLeaderboard:true`.

[V](https://www.kaggle.com/WinningModelDocumentationGuidelines) is a generic winner closeout guide, not the paper submission template: model summary, deliverable software/archive, reproducibility instructions and a standard winner presentation call, subject to competition-specific revisions. It should not be misread to require a prediction-model ZIP or a one-hour talk in the initial paper entry. Monetary rules include eligibility/compliance review, response within one week of notification, acceptance documents within two weeks, approximately 30 days to payment after required documents, taxes borne by winners, equal eligible team shares unless unanimously changed. California/Santa Clara governs; cancellation/modification, publicity/privacy, warranties, and release clauses remain in the full captured rules.

## Bugs, conflicts, and unanswered questions

1. **Two-final rule versus reported single-writeup form block:** on October 22, message 3542975 in [743255](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/743255) reports `You've already submitted to this competition. To submit this writeup, you'll first need to unsubmit your previous writeup.` [753195](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/753195), October 27, asks how both may be judged and has no answer. Live H says multiple submissions allowed, but that is not proof the form works. No workaround verified.
2. **Save/edit/submit conflict endpoint report:** [743094](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/743094), September 24, reports POST CheckHackathonWriteupConflict returning plain-HTML 404. Host asked September 29 whether it persisted. No resolution in captured thread; no authenticated reproduction performed. The endpoint still appears in the public frontend bundle, which neither proves success nor failure.
3. **Deadline-extension request is not an announcement:** [755176](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/755176), November 2, unanswered. Live deadline remains November 12; do not adopt a community mention of November 13 or the other track's deadline.
4. **Confidential verification channel:** [756472](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/756472), November 6, asks how judges can inspect a restricted raw archive without public redistribution; unanswered. No approved private delivery channel established.
5. **Unresolved procedural specifics:** automatic final-selection algorithm, exact PDF version snapshot behavior, edited/resubmitted tie-break timestamp, references style, appendix tables, definitive paper-track minor consent procedure, and explicit E2B/E4B permission in [749202](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/749202). Broad topic eligibility and other participants' smaller-model papers do not substitute for a reply to that model question.
6. **Local sandbox issue versus private scoring:** [753370](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/753370) reports missing inline_snapshot/dirty_equals on 27 public fastapi tasks. This is participant empirical evidence not reproduced here; host says private scoring excludes these tasks. Do not call this a verified private-leaderboard bug.
7. **Community research claims need separate verification:** one author initially advertised +116% issue resolution [754697](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/754697), but November 7 [756473](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/756473) says the public notebook is a 31-scenario component benchmark and the paired end-to-end pilot is still running. This limits confidence in the earlier headline; it is not an allegation of misconduct. A2-DASC posts report large gains without those experiments being audited here; a generic GitHub homepage appears in one version. Hash preregistration posts establish publication of hashes at posting time, not independent proof of earlier private freezes or empirical validity.

## Discussion inventory: all publicly indexed threads in this snapshot

Access for every row: 2026-11-08, anonymous HTTP 200 through GetForumTopicById. Dates are UTC. Publisher column identifies the initial author; HOST/ADMIN answers are explicitly distinguished in the summary. Each raw capture is paper-thread-ID.json; each API URL is recorded in the fetch ledger. Index comment counts include nested replies.

| ID / title / source URL | Initial publisher | Posted / latest activity UTC | Comments | Summary and status |
|---|---|---|---|---|
| [756850: Pre-registration: edit-state loss at context compaction (confirmatory test on held-out repos)](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/756850) | pedronog8 | 2026-11-07 / 2026-11-07 | 1 | COMMUNITY preregistration of edit-state loss at ADK compaction, held-out events and causal replay; author posts a replay-design amendment after original analysis. No host answer. |
| [756473: Retrieval finds the bug, test feedback fixes it: AST retrieval vs. self-correction for Gemma 4 E2B/E4B (two libraries, paired tests)](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/756473) | anisha mehajabin | 2026-11-06 / 2026-11-07 | 5 | COMMUNITY paired AST-retrieval/self-correction study on boltons and more-itertools. Discussion separates localization/token savings from actual repair gains; Mikhail says public artifact is component-only and end-to-end pilot ongoing. Claims not reproduced. |
| [756483: Pre-registration hash: prompt hygiene rules vs baseline on 233 tasks](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/756483) | yu_kuo14 | 2026-11-06 / 2026-11-07 | 2 | COMMUNITY prompt-hygiene preregistration and negative result: proposed variant failed primary outcome, baseline retained. Discloses missing-.git invalid validation runs, rerun, runner-hash change and different GPU; paired comparisons claimed preserved. |
| [756631: [Open Resource & Pre-Registration] AST-Guided Verification Suite: Deterministic Slicing and Pre-Flight Gates for Local Gemma 4 Agents](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/756631) | Mikhail | 2026-11-06 / 2026-11-06 | 0 | COMMUNITY AST slicing/syntax gate/traceback compression resource announcement with component timings and a preregistered end-to-end pilot. Not evidence of completed end-to-end gains. |
| [756499: Formatting or refercenes and appendix](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/756499) | Moez Ur Rehman | 2026-11-06 / 2026-11-06 | 0 | COMMUNITY asks required citation style and whether appendix tables allowed. No answer. |
| [756479: Research code and documentation — small-juries-early-verdicts](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/756479) | Francisco Angulo de Lafuente | 2026-11-06 / 2026-11-06 | 0 | COMMUNITY announces small-juries-early-verdicts public code/documentation; points to repository for results and remaining work. No host endorsement. |
| [756472: Approved restricted channel for Paper Track verification artifacts?](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/756472) | Veronika Yaitskikh | 2026-11-06 / 2026-11-06 | 0 | COMMUNITY requests approved restricted channel for raw verification archive that cannot be published unrestricted. No host answer or channel established. |
| [756353: Pre-registration hash: sub-agent topologies on a fixed budget](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/756353) | Varun T | 2026-11-06 / 2026-11-06 | 1 | COMMUNITY fixed-budget sub-agent topology preregistration hash; commenter asks about recursive-error loops and budget-saving aborts. No response in capture. |
| [756281: Pre-registration hash](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/756281) | Muhand Alsaiari | 2026-11-05 / 2026-11-05 | 0 | COMMUNITY generic study preregistration hash, promising later file release. No results or host answer. |
| [756259: Pre-registration hash: one-line prompt rule vs. retry loops](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/756259) | Masahiro Nakata | 2026-11-05 / 2026-11-05 | 0 | COMMUNITY one-system-prompt-line versus retry-loop experiment preregistration; primary outcome rejected tool calls; plan release promised. No host answer. |
| [755867: Does a public repo count as prior publication for the Paper Track?](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/755867) | arabenjamin | 2026-11-04 / 2026-11-04 | 1 | HOST Nov 4: prior public GitHub experiment documentation does not count as prior publication; described research eligible. |
| [755652:  Pre-registration hash: statement information and post-training for budgeted code agents](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/755652) | 嵇禄lugent | 2026-11-04 / 2026-11-04 | 0 | COMMUNITY preregisters three future confirmatory experiments on statement information/post-training and hashes an exploratory draft; prior analyses explicitly exploratory. |
| [755607: Pre-registration: CodeGraphQA (how Gemma 4 reads code graphs)](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/755607) | Akhyar Ahmad | 2026-11-04 / 2026-11-04 | 0 | COMMUNITY CodeGraphQA preregistration hash before main inference; plan/code/outputs promised with writeup. |
| [753370: 27 fastapi tasks cannot pass in the provided sandbox (missing inline_snapshot and dirty_equals)](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/753370) | Jason Wold | 2026-10-27 / 2026-11-06 | 2 | COMMUNITY reports 27 public fastapi tasks blocked by missing test dependencies. HOST Nov 4 says private scoring uses different private repositories; author acknowledges distinction Nov 6. Local bug not independently reproduced. |
| [755176: Deadline Extension](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/755176) | Mantas | 2026-11-02 / 2026-11-02 | 0 | COMMUNITY requests extending paper deadline toward main track deadline. No answer; not an extension announcement. |
| [754899: Paper Track — clarifications on timeline, experiment harness, and writeup mechanics.](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/754899) | Bambang Satmoko | 2026-11-02 / 2026-11-03 | 2 | COMMUNITY asks timeline/checkpoints, dataset freeze, access/harness, submission API, word count and final selection. Participant assumptions and another user's tie-break follow-up are not host approval. Some word-count issues answered in other threads. |
| [754918: Pre-registration hash: specification experiments on the never-solved public tasks](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/754918) | Bhavya Sharma | 2026-11-02 / 2026-11-02 | 1 | COMMUNITY preregistration for specification experiments on never-solved public tasks; author corrects which experiment had started, says no results existed and hash unchanged. |
| [753871: Paper Track: licences in a public notebook](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/753871) | Sonu Yadav | 2026-10-29 / 2026-11-04 | 1 | HOST Nov 4 tentatively believes OSS rule applies to entrant code and a public notebook may call supplied harness wheels. Neither answer permits unrestricted wheel redistribution. |
| [754697: [Open-Source Research & Benchmark] AST-Guided Loops Verification for Gemma 4 SWE Agents (+116% Issue Resolution, -66% Context Tokens)](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/754697) | Mikhail | 2026-11-01 / 2026-11-01 | 0 | COMMUNITY AGVA announcement claims issue-resolution/token/error gains and links notebook/repository/writeup. Later 756473 qualifies public artifact as component benchmark with end-to-end pilot ongoing. |
| [754667: Pre-registration hash: frozen confirmatory analysis for our Paper Track submission (late disclosure)](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/754667) | earthmaker | 2026-11-01 / 2026-11-01 | 0 | COMMUNITY late hash disclosure for empty graph-tool study; candidly states post cannot prove earlier private freeze and results were already read before public timestamp. Deviation to be reported. |
| [749546: Word Count](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/749546) | Ramesh Bhaskaramurthy | 2026-10-15 / 2026-11-06 | 3 | HOST Oct 27: references excluded; appendix supplementary, supports verifiability but not guaranteed to be read. Later caption/appendix-table questions unanswered here; captions answered in 743255. |
| [749803: Can derived localization labels from the task data be published (paper track)?](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/749803) | Cameron Hong | 2026-10-16 / 2026-11-03 | 5 | HOST Oct 27 allows derived instance-to-file/symbol labels without task/patch/test text. HOST Nov 3 prefers translated prose keyed by ID with original verbatim pieces linked/reconstructed; author proposes placeholders. |
| [753195: Two writeups per team: can both be submitted at the same time?](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/753195) | Adisak Sukul | 2026-10-27 / 2026-10-27 | 0 | COMMUNITY asks how two writeups can simultaneously remain submitted despite reported single-submission block. No host answer. |
| [752667: Precision about public notebook and papers vs conflicting Coding Competition](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/752667) | Amanie El-Hajj | 2026-10-25 / 2026-10-27 | 1 | HOST Oct 27 says code is optional if protecting it until coding track ends; earlier paper deadline reflects judging time. No promise to defer automatic publication of attached private code. |
| [751413: Non-fancy SFT idea is cool? + Private dataset until main track is over?](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/751413) | Ahmed Awelkair | 2026-10-21 / 2026-10-28 | 2 | COMMUNITY asks about simple SFT contribution and delaying dataset release. HOST Oct 27 permits later full release if necessary, suggests immediate small random sample for judging; does not rank the SFT idea. |
| [751804: Rule 3.6.b: does the code-sharing requirement apply to this paper track?](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/751804) | Md Tanjil Islam | 2026-10-22 / 2026-10-27 | 1 | HOST Oct 27: GitHub should work for code sharing; external-data evaluation fine if rights permit. Question concerned research using no competition data. |
| [751403: Permitted independent validation for Paper Track research](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/751403) | astha singh | 2026-10-21 / 2026-10-27 | 1 | HOST Oct 27 allows independent reviewers subject to licensing and unrestricted reporting of aggregate results. Not blanket approval for sharing raw restricted data privately. |
| [752271: AST-Augmented Dual-Agent Self-Correction: Improving Code Generation and Repair with Lightweight Gemma 4 Models via Execution-Feedback Loops](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/752271) | Saiyyad Ahmed | 2026-10-24 / 2026-10-24 | 0 | COMMUNITY long A2-DASC paper post: generator/critic execution feedback and AST summaries, claims large gains on a curated task suite. This version links generic github.com; results/artifacts not independently verified. |
| [752268: Enhancing Low-Resource Developer Agents via Iterative Self-Correction](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/752268) | Saiyyad Ahmed | 2026-10-24 / 2026-10-24 | 0 | COMMUNITY near-duplicate A2-DASC research post with specific repository link and same large empirical claims. Not a separate confirmed result; no host response. |
| [750338: Clarification on Prize Track Categorization, Tie-Breaker Timestamps, and Notebook Runtime](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/750338) | Ahmed Sattar Jabbar | 2026-10-17 / 2026-10-27 | 1 | HOST Oct 27: all award tracks considered; likely original submission time if unavoidable tie, multiple judges preferred; Run All need not execute full pipeline and judges may not run code. Fast verification suggested. |
| [749463: Prize eligibility if winners cannot attend the Google-hosted event in person?](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/749463) | Kim Tae Gul | 2026-10-15 / 2026-10-27 | 1 | HOST Oct 27: inability to attend event in person does not affect prize eligibility. Remote/recorded details unspecified. |
| [751856: Paper track: what may a public code notebook include about the training tasks?](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/751856) | Elias T.-H. Shieh | 2026-10-22 / 2026-10-22 | 0 | COMMUNITY asks about anonymized/original-ID outcomes, traces/patches, runtime data loading and GitHub versus notebook. No direct answer; other scoped host replies partially address related cases. |
| [751708: Hobbiest with strong understanding lfg](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/751708) | zonedeth | 2026-10-22 / 2026-10-22 | 0 | COMMUNITY hobbyist seeks academically trained collaborators for formalizing and evaluating LLM research. No policy content. |
| [751430: [Open-Source Benchmark & ADK Protocol] Why Local Gemma 4 Coding Agents Get Stuck After Turn 4: Trap-25 Benchmark & Counterfactual Context Reset (96% vs 16%)](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/751430) | Robina Mirbahar | 2026-10-21 / 2026-10-21 | 0 | COMMUNITY announces Trap-25/LoopBreaker benchmark and reports dramatic reset/thinking-budget gains. No independent reproduction; its November 13 deadline wording conflicts with official November 12 UTC. |
| [743314: Can under-18 participants join this track?](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/743314) | Rola Islait | 2026-09-25 / 2026-11-06 | 4 | COMMUNITY minor-consent advice cites main coding track and two forms; no paper-host confirmation. Nov 6 follow-up asks whether process applies separately to paper track. Do not label minor entry blanket-approved. |
| [750732: Pre-registration: anchor distance and small-agent failure (hash commitment)](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/750732) | Jason Wold | 2026-10-19 / 2026-10-19 | 1 | COMMUNITY anchor-distance/async graph-omission failure study preregistration; links plan and frozen-analysis hash commitments. No host ruling. |
| [748973: CodeGuardian: A Graph-Guided Self-Repairing Software Engineering Agent](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/748973) | NSHIMYUMUREMYI Olivier | 2026-10-13 / 2026-10-22 | 1 | COMMUNITY brief CodeGuardian workflow outline and title repetition; no measured results in thread. |
| [750336: Can I submit multiple paper ?](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/750336) | Snigdha Chandan | 2026-10-17 / 2026-10-17 | 0 | COMMUNITY asks if multiple papers allowed; no direct answer, official rule and 743255 govern. |
| [749202: Can I use smaller model ?](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/749202) | daoviet | 2026-10-14 / 2026-10-14 | 0 | COMMUNITY asks if E2B/E4B allowed instead of 31B. No host response. |
| [743255: Clarification: number of writeups per team and eligibility across awards](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/743255) | Shiva Shankar | 2026-09-25 / 2026-10-27 | 13 | HOST Sep 29: two judged writeups, award cross-consideration but one prize per writeup, same contextual rubric. HOST Oct 27: scoped graphs/traces allowed, exact word-count/PDF/supplementary clarifications. Oct 22 single-writeup UI complaint remains unanswered. |
| [745815: Interested in collaborating on Graph-based RAG / Retrieval + GNNs](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/745815) | AnmolPoddar@AI | 2026-10-04 / 2026-10-20 | 2 | COMMUNITY graph-RAG/GNN team recruitment; other users offer ideas or skepticism about existing gains. Not evidence of judging preferences. |
| [748747: Prior teaching Notebook and a later case-audit Paper: how does “unpublished” apply?](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/748747) | Yang Kuang Ou | 2026-10-13 / 2026-10-13 | 0 | COMMUNITY detailed unpublished-status question about prior teaching notebook and later case-audit paper, including unchanged-result scenario. No host answer; do not generalize other case-specific approvals. |
| [748627: Code and data behind our write-ups: gemma4-swe-kit and an agent trajectory dataset](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/748627) | D A M | 2026-10-12 / 2026-10-12 | 0 | COMMUNITY publishes gemma4-swe-kit and external SWE-rebench-derived trajectory dataset, describing harness rendering/parsing/budget tools and curation. Claims/licenses not independently audited. |
| [745712: Clarification: fully AI-assisted resources, individual entrants, and publicity](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/745712) | tREKAS | 2026-10-03 / 2026-10-17 | 3 | HOST Oct 5 permits coding assistants subject to terms and requirements; warns low-quality wholly LLM-written prose scores poorly. ADMIN permits unaffiliated individual prizes and reasonable likeness accommodations. Community antivirus alert unverified. |
| [748395: Model-free localization benchmark on the 129 public tasks: how far do the provided graph and embedding tools get you?](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/748395) | Ali Hassan | 2026-10-11 / 2026-10-11 | 0 | COMMUNITY model-free localization benchmark on public tasks compares keywords, embeddings, fusion and graph distance; links notebook. Derived statistics not reproduced or treated as official benchmark truth. |
| [747862: Pre-registration, Gemma 4 QAT paper](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/747862) | Jason Krijgsman | 2026-10-09 / 2026-10-09 | 0 | COMMUNITY QAT study preregistration with commit/hash and claim it precedes first bf16 run. No results or host answer. |
| [746168: Tie-break timing and edits to a submitted Writeup](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/746168) | Ghaisan | 2026-10-06 / 2026-10-06 | 0 | COMMUNITY asks team-join versus submission timestamp, edits/resubmission timing and deadline PDF version. No answer here; later 750338 only partly/tentatively clarifies timestamp. |
| [743681: Looking for Team ](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/743681) | Ass. Prof. Dr. Ali H. Wheeb | 2026-09-26 / 2026-10-07 | 23 | COMMUNITY RL/research team recruitment with collaboration replies. Two returned comments have blank bodies; substantive deleted/blank content cannot be recovered. No competition-policy answer. |
| [745872: Does an arXiv preprint count as "published" for the Paper Track?](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/745872) | John Soliva | 2026-10-05 / 2026-10-06 | 2 | HOST Oct 5 allows pre-deadline arXiv preprint and submitting arXiv link; author thanks host. |
| [746035: codegraph-loc: open code-graph generator and function-level localization benchmark](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/746035) | Daniel Mantiglia | 2026-10-05 / 2026-10-05 | 0 | COMMUNITY codegraph-loc release: Python AST graph generator including async/module nodes, localization labels/benchmark, reproduction scripts, stated Apache-2.0 and no raw competition-data redistribution. Not audited. |
| [743844: Looking for Team – Gemma 4 Developer Agent Paper Track](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/743844) | Vansh | 2026-09-27 / 2026-10-08 | 6 | COMMUNITY team recruitment around data/analytics-bug benchmark, reproducibility and RL/fine-tuning; replies include recruitment and an unrelated resource promotion. No policy answer. |
| [745326: Photo Inquiry](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/745326) | Asma essaedi | 2026-10-03 / 2026-10-05 | 1 | ADMIN Oct 5 permits photo-publicity opt-out and separates verification photos from marketing materials. |
| [745150: Question: does a blog post about a pilot study count as prior publication?](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/745150) | Takefumi Ono | 2026-10-02 / 2026-10-05 | 1 | HOST Oct 5 approves described substantially extended research after public pilot/blog/benchmark; not blanket permission for unchanged published research. |
| [745248: Looking to join or form a team for the Google Gemma 4 Developer Agent Paper Track!](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/745248) | Prince J112 | 2026-10-02 / 2026-10-02 | 0 | COMMUNITY team recruitment offering support, SQL/data preparation, testing and documentation. No policy content. |
| [743310: Clarification for Paper Submission](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/743310) | agrover112 | 2026-09-25 / 2026-09-29 | 1 | HOST Sep 29 promises only prize-winner event highlighting; non-archival, parallel venue and arXiv submission allowed/encouraged. |
| [743012: Welcome to the Gemma 4 Developer Agent Paper Track](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/743012) | Elan Markowitz | 2026-09-24 / 2026-09-30 | 4 | HOST Sep 24 welcome: independent research, tuning, graphs, resources, novel applications including DiffusionGemma; no need to top/join coding leaderboard. Remaining replies ask for beginner/starter guidance or offer help. |
| [743094: Bug: writeup editing/submission broken - CheckHackathonWriteupConflict returns 404](https://www.kaggle.com/competitions/gemma-4-developer-agent-paper/discussion/743094) | woldy | 2026-09-24 / 2026-09-29 | 1 | COMMUNITY Sep 24 reports writeup save/edit/submit conflict-endpoint 404; HOST Sep 29 asks whether issue persists. No resolution or current reproduction. |

## Public Code inventory

Access: 2026-11-08. Publisher is the notebook owner, not the host. These are listing metadata and title-based topic signals only: notebook cells, experiment validity, licenses, and all external dependencies were not reviewed or executed. Latest-version dates are not original publication dates. Votes are a time-specific popularity signal, not a judging score. Every item includes paper competition ID 163111 in its data sources; some also attach the coding competition.

| ID | Title / public URL | Publisher | Latest version UTC | Votes |
|---|---|---|---|---|
| 142807138 | [Gemma 4 Developer Agent Paper Starter Notebook](https://www.kaggle.com/code/pablodiegoo/gemma-4-developer-agent-paper-starter-notebook) | pablodiegoo | 2026-11-07T17:56:27.207Z | 4 |
| 140383745 | [Gemma 4 Loop-Breaker ADK Agent](https://www.kaggle.com/code/robinamirbahar/gemma-4-loop-breaker-adk-agent) | robinamirbahar | 2026-11-07T06:10:27.463Z | 17 |
| 138822450 | [thoughtkeep-reproduction](https://www.kaggle.com/code/hemantkumarbk/thoughtkeep-reproduction) | hemantkumarbk | 2026-11-07T05:52:16.277Z | 0 |
| 138329223 | [selective-restarts-reproduction](https://www.kaggle.com/code/hemantkumarbk/selective-restarts-reproduction) | hemantkumarbk | 2026-11-07T05:52:13.013Z | 0 |
| 143075847 | [selective-restarts-monitor-audit-reproduction](https://www.kaggle.com/code/hemantkumarbk/selective-restarts-monitor-audit-reproduction) | hemantkumarbk | 2026-11-07T05:52:09.653Z | 0 |
| 140082066 | [Optimizing W4A16 Thinking Budgets Under Time Caps](https://www.kaggle.com/code/robinamirbahar/optimizing-w4a16-thinking-budgets-under-time-caps) | robinamirbahar | 2026-11-06T13:12:35.323Z | 0 |
| 140081967 | [Detecting SWE Agent Action Loops with Jaccard](https://www.kaggle.com/code/robinamirbahar/detecting-swe-agent-action-loops-with-jaccard) | robinamirbahar | 2026-11-06T13:12:29.133Z | 0 |
| 142902669 | [Gemma 4 Code Graph Localization — Reproducibility](https://www.kaggle.com/code/xxsyrbest/gemma-4-code-graph-localization-reproducibility) | xxsyrbest | 2026-11-06T12:14:57.930Z | 1 |
| 143049161 | [Missing Reference Candidates — Reproducibility](https://www.kaggle.com/code/xxsyrbest/missing-reference-candidates-reproducibility) | xxsyrbest | 2026-11-06T11:52:43.250Z | 0 |
| 140084681 | [TRAP 25 Ablation Report RMarkdown](https://www.kaggle.com/code/robinamirbahar/trap-25-ablation-report-rmarkdown) | robinamirbahar | 2026-11-06T06:12:45.730Z | 0 |
| 140081638 | [TRAP-25 Statistical & Survival Analysis in R](https://www.kaggle.com/code/robinamirbahar/trap-25-statistical-survival-analysis-in-r) | robinamirbahar | 2026-11-06T06:12:41.563Z | 0 |
| 140203611 | [Gemma4 MultiLoRA ADK Eval Benchmark Suite](https://www.kaggle.com/code/robinamirbahar/gemma4-multilora-adk-eval-benchmark-suite) | robinamirbahar | 2026-11-05T22:36:44.697Z | 0 |
| 140207399 | [Gemma 4 CCR Output Artifacts Telemetry EDA](https://www.kaggle.com/code/robinamirbahar/gemma-4-ccr-output-artifacts-telemetry-eda) | robinamirbahar | 2026-11-05T22:36:41.570Z | 0 |
| 140254875 | [Gemma 4 Loop-Breaker CCR Verification](https://www.kaggle.com/code/robinamirbahar/gemma-4-loop-breaker-ccr-verification) | robinamirbahar | 2026-11-05T22:36:38.187Z | 1 |
| 140052713 | [Gemma 4 Loop Breaker: CCR & Trap-25 Benchmark](https://www.kaggle.com/code/robinamirbahar/gemma-4-loop-breaker-ccr-trap-25-benchmark) | robinamirbahar | 2026-11-05T22:36:34.883Z | 0 |
| 142899902 | [Localising Before Patching](https://www.kaggle.com/code/ckskaggle/localising-before-patching) | ckskaggle | 2026-11-05T14:59:51.483Z | 0 |
| 141308727 | [Gemma 4 Coding Room Evidence Replay](https://www.kaggle.com/code/markwhiteley/gemma-4-coding-room-evidence-replay) | markwhiteley | 2026-11-05T10:57:45.543Z | 2 |
| 138090504 | [The Gemma 4 Developer Agent Paper Track V3](https://www.kaggle.com/code/soufianehajou/the-gemma-4-developer-agent-paper-track-v3) | soufianehajou | 2026-11-05T07:44:50.357Z | 2 |
| 142806100 | [Gemma 4 Paper: L4 Decode Law & 12-Call Cliff](https://www.kaggle.com/code/pablodiegoo/gemma-4-paper-l4-decode-law-12-call-cliff) | pablodiegoo | 2026-11-05T03:05:57.780Z | 1 |
| 142649015 | [Name the Method at Its Code: code and data](https://www.kaggle.com/code/jaredga/name-the-method-at-its-code-code-and-data) | jaredga | 2026-11-04T06:58:37.053Z | 2 |
| 142648586 | [The List Carries the Gain: code and data](https://www.kaggle.com/code/jaredga/the-list-carries-the-gain-code-and-data) | jaredga | 2026-11-04T06:53:48.053Z | 0 |
| 141906640 | [Gemma 4 SWE Agents Three Paradoxes & CA HGR](https://www.kaggle.com/code/fabrianivan/gemma-4-swe-agents-three-paradoxes-ca-hgr) | fabrianivan | 2026-10-31T08:03:14.180Z | 1 |
| 141234258 | [gemma4-paper-submit](https://www.kaggle.com/code/ppsssssss/gemma4-paper-submit) | ppsssssss | 2026-11-02T20:50:12.333Z | 0 |
| 142304468 | [Gemma4_hackathon](https://www.kaggle.com/code/safinulsafin/gemma4-hackathon) | safinulsafin | 2026-11-02T15:34:28.973Z | 0 |
| 138448145 | [Kaggle Gemma4 PaperTrack](https://www.kaggle.com/code/alexthomaskott/kaggle-gemma4-papertrack) | alexthomaskott | 2026-11-01T06:05:33.213Z | 2 |
| 141811914 | [Gemma 4 E4B baseline agent: failure taxonomy on 12](https://www.kaggle.com/code/christopherjkouzios/gemma-4-e4b-baseline-agent-failure-taxonomy-on-12) | christopherjkouzios | 2026-10-30T18:28:20.213Z | 0 |
| 141763007 | [Gemma 4 Developer Agent: Graph-Guided AST Localiza](https://www.kaggle.com/code/soufianeissa/gemma-4-developer-agent-graph-guided-ast-localiza) | soufianeissa | 2026-10-30T14:17:19.283Z | 0 |
| 141498242 | [notebookef2dec219d](https://www.kaggle.com/code/harunaalasan/notebookef2dec219d) | harunaalasan | 2026-10-29T20:28:34.700Z | 0 |
| 141002844 | [Gemma 4 agent evaluation audit: code and data](https://www.kaggle.com/code/tokimwc/gemma-4-agent-evaluation-audit-code-and-data) | tokimwc | 2026-10-26T14:59:13.437Z | 0 |
| 140249929 | [AST-Compressed Code Graphs for Gemma 4 Agents](https://www.kaggle.com/code/maroofiums/ast-compressed-code-graphs-for-gemma-4-agents) | maroofiums | 2026-10-26T10:22:55.553Z | 2 |
| 139615885 | [Where Is the Bug? Localization with Gemma 4 E4B](https://www.kaggle.com/code/prena0808/where-is-the-bug-localization-with-gemma-4-e4b) | prena0808 | 2026-10-26T08:29:10.030Z | 0 |
| 139375229 | [NeuroCode: Heterogeneous Graph-Sliced SWE Agent](https://www.kaggle.com/code/deepark121/neurocode-heterogeneous-graph-sliced-swe-agent) | deepark121 | 2026-10-26T07:16:59.213Z | 0 |
| 139118765 | [Easy RLAIF GRPO 12B on Gemma 12B Tool Calling](https://www.kaggle.com/code/kevlarzanderchi/easy-rlaif-grpo-12b-on-gemma-12b-tool-calling) | kevlarzanderchi | 2026-10-26T00:30:10.170Z | 2 |
| 140238803 | [Gemma 4 Developer Agent](https://www.kaggle.com/code/mahalakshmiboga/gemma-4-developer-agent) | mahalakshmiboga | 2026-10-25T14:28:10.880Z | 1 |
| 138192425 | [MutaLoc reproduce](https://www.kaggle.com/code/smartkdy7/mutaloc-reproduce) | smartkdy7 | 2026-10-25T04:27:41.470Z | 0 |
| 140248057 | [Gemma 4 Loop Breaker: G-CCR & Trap-25 Verification](https://www.kaggle.com/code/robinamirbahar/gemma-4-loop-breaker-g-ccr-trap-25-verification) | robinamirbahar | 2026-10-23T14:50:11.747Z | 0 |
| 140339204 | [notebookd9c69304a3](https://www.kaggle.com/code/ayushsudha/notebookd9c69304a3) | ayushsudha | 2026-10-23T06:32:12.913Z | 0 |
| 140205468 | [Loc32K – reproduction notebook](https://www.kaggle.com/code/julesevers/loc32k-reproduction-notebook) | julesevers | 2026-10-22T12:28:49.747Z | 0 |
| 139667144 | [AST GRAPH & UNIT TEST VERIFICATION RESULTS](https://www.kaggle.com/code/hungbiker/ast-graph-unit-test-verification-results) | hungbiker | 2026-10-22T11:04:38.310Z | 0 |
| 139935085 | [notebook gemma](https://www.kaggle.com/code/md2911xt/notebook-gemma) | md2911xt | 2026-10-21T03:25:58.410Z | 0 |
| 139889191 | [topaz_kwe_run](https://www.kaggle.com/code/imkushalpokhrel/topaz-kwe-run) | imkushalpokhrel | 2026-10-20T20:25:41.283Z | 0 |
| 139717977 | [Vivy Gemma 4 Developer Agent Paper Track](https://www.kaggle.com/code/vinguynvn/vivy-gemma-4-developer-agent-paper-track) | vinguynvn | 2026-10-20T02:07:18.613Z | 0 |
| 138974704 | [Sovereign SWE Dual-Node Distillation](https://www.kaggle.com/code/noormamhidayat/sovereign-swe-dual-node-distillation) | noormamhidayat | 2026-10-19T13:50:16.323Z | 0 |
| 139279477 | [Gemma-4-Developer-Agent-Paper-Track](https://www.kaggle.com/code/bayuanggara12/gemma-4-developer-agent-paper-track) | bayuanggara12 | 2026-10-17T21:18:45.190Z | 2 |
| 136347885 | [Gemma 4 LB: 58 Tasks, Bronze Is a 124-Team Tie](https://www.kaggle.com/code/dariushafshar/gemma-4-lb-58-tasks-bronze-is-a-124-team-tie) | dariushafshar | 2026-10-17T17:35:41.637Z | 11 |
| 139004628 | [notebook471562e392](https://www.kaggle.com/code/rushikeshpundkar/notebook471562e392) | rushikeshpundkar | 2026-10-16T11:40:12.597Z | 0 |
| 138655927 | [Navigation Not Comprehension Gemma 4 Paper](https://www.kaggle.com/code/manojpanda199/navigation-not-comprehension-gemma-4-paper) | manojpanda199 | 2026-10-14T15:38:10.847Z | 0 |
| 138492522 | [Gemma 4 graph tools audit](https://www.kaggle.com/code/kmussa77/gemma-4-graph-tools-audit) | kmussa77 | 2026-10-13T12:24:22.390Z | 0 |
| 138270861 | [YaoNeM Gemma4 Paper Harness Pareto Analysis](https://www.kaggle.com/code/netaro/yaonem-gemma4-paper-harness-pareto-analysis) | netaro | 2026-10-12T05:40:40.457Z | 2 |
| 138107796 | [tracegraph-experiments](https://www.kaggle.com/code/utsabdahal03/tracegraph-experiments) | utsabdahal03 | 2026-10-11T03:18:00.177Z | 1 |
| 137727207 | [BudgetGraph Reproducible Retrieval Audit](https://www.kaggle.com/code/hvanphucs112/budgetgraph-reproducible-retrieval-audit) | hvanphucs112 | 2026-10-08T19:04:10.727Z | 1 |
| 137248812 | [GraphFault: Portable Gemma Localization Audit](https://www.kaggle.com/code/winvist/graphfault-portable-gemma-localization-audit) | winvist | 2026-10-06T00:38:18.577Z | 1 |
| 137208883 | [What the Agent Saw Reproduce](https://www.kaggle.com/code/petermugoya/what-the-agent-saw-reproduce) | petermugoya | 2026-10-05T17:14:46.780Z | 0 |
| 136914711 | [Found Is Not Fit: CPU Context Budget Audit](https://www.kaggle.com/code/eeshanvaghjiani2004/found-is-not-fit-cpu-context-budget-audit) | eeshanvaghjiani2004 | 2026-10-03T13:52:14.693Z | 1 |
| 136725627 | [Gemma 4 Agent Research Artifact](https://www.kaggle.com/code/jek1wantaufik/gemma-4-agent-research-artifact) | jek1wantaufik | 2026-10-02T02:45:40.877Z | 5 |
| 136589243 | [Gemma 4: A 16384 Output Cap Refuses Long Prompts](https://www.kaggle.com/code/dariushafshar/gemma-4-a-16384-output-cap-refuses-long-prompts) | dariushafshar | 2026-10-01T13:27:32.313Z | 3 |
| 136107611 | [Gemma 4 Dev Agent Paper](https://www.kaggle.com/code/jefferyjeromeharris/gemma-4-dev-agent-paper) | jefferyjeromeharris | 2026-09-27T17:25:15.523Z | 4 |

## Tab and pagination coverage audit

| Surface | Captured coverage | Exact limitations |
|---|---|---|
| Bare competition / overview | HTTP 200 HTML shell; 10 published page records via ListPages, including description, abstract, timeline, evaluation, submission requirements, specific rules, foundational rules, data-description and two dynamic placeholders. Prize/judge dynamic content separately retrieved. | No rendered browser walkthrough. UI shell alone had no substantive body. |
| Timeline | Page 836470 plus GetCompetition; deadline and metadata rechecked at **2026-11-08T02:13:53.493325+00:00**. | Future changes after this access time not covered. |
| Rules | Entire competition-specific and foundational text in live page records 836466/836468. | Boilerplate leaderboard language is inconsistent with paper judging; no legal interpretation beyond explicit terms/host clarifications. |
| Awards / judges / citation | ListHackathonTracks, ListJudges, and GetCompetitionCitation all HTTP 200. | Public judge list is not a complete promise of who will judge top papers. |
| Discussion index | forumId 12784402, requested pages 1–4 with pageSize=100; actual pages returned **20, 20, 17, 0**; reported count=57 throughout. Deduplicated 57 unique topic IDs. | API did not honor requested size as 100; observed 20-record pages used. No claim about deleted, private, moderated-out, or subsequently added threads. |
| Discussion bodies | GetForumTopicById with forumTopicId and includeComments=true returned HTTP 200 for all 57; **94 recursively counted comments/replies**, matching index count for each thread; 57 first messages also captured. | Two blank records in 743681: message IDs 3531333 and 3529411. Their original text unavailable; not guessed. |
| Code listing | Read-only ListKernels POST, competitionId 163111, privacy=public, group=EVERYONE, sortBy=DATE_RUN, pageSize=100. Page 1 returned **57 unique items**; page 2 returned none. Every item's dataSources includes 163111. | Returned totalCount=0 is inconsistent with populated results; use observed row count/end-page, not that field. This is exhaustive for the queried public listing, not all related external notebooks or all notebook contents. |
| Writeups | ListHackathonWriteUps HTTP 403: `Writeups are not publicly available until the competition has fully closed`. | No submitted-paper body or complete competitor writeup inventory accessed. User-shared discussion drafts do not unlock private submissions. |
| Notebook cells/output/code comments | Listing metadata only; discussion-shared research descriptions read. | Full notebook-cell audit/execution and linked GitHub/dataset audits not performed. No statement that notebook code works or reported experiments reproduce. |
| Submission editor | No credentials/login, join, save, submit, publish, or account mutation. | Actual form enforcement, two-writeup workaround, identity flow, current save bug status and private-resource publication behavior were not exercised. |
| Notebook publishing documentation | Full CMS captures of Notebooks, Models, Competitions, WinningModelDocumentationGuidelines; relevant sections read. | Docs have no returned publication/update timestamp; instructions are freshly retrieved, not demonstrated on a signed-in account. |

API access details: discussion index https://www.kaggle.com/api/i/discussions.DiscussionsService/GetTopicListByForumId?forumId=12784402&page=1&pageSize=100 (pages 2, 3, 4 recorded in fetch ledger); thread template https://www.kaggle.com/api/i/discussions.DiscussionsService/GetForumTopicById?forumTopicId=755867&includeComments=true (every actual ID has its own ledger entry). Initial use of wrong parameter `topicId` returned 404; corrected to frontend's `forumTopicId`, then succeeded. Initial dotted-query ListKernels GET returned 400; frontend-shaped read-only POST succeeded. These two request-format errors are research-tool errors, not Kaggle product findings.

Writeups denied endpoint: https://www.kaggle.com/api/i/competitions.HackathonService/ListHackathonWriteUps?competitionId=163111&page=1&pageSize=100 . Citation: https://www.kaggle.com/api/i/competitions.CompetitionService/GetCompetitionCitation?competitionId=163111 . Docs read endpoints: https://www.kaggle.com/api/i/cms.LegacyCmsService/GetPage?slug=docs%2FNotebooks&isEditing=false ; https://www.kaggle.com/api/i/cms.LegacyCmsService/GetPage?slug=docs%2Fcompetitions&isEditing=false ; https://www.kaggle.com/api/i/cms.LegacyCmsService/GetPage?slug=docs%2Fmodels&isEditing=false ; https://www.kaggle.com/api/i/cms.LegacyCmsService/GetPage?slug=WinningModelDocumentationGuidelines&isEditing=false . All statuses and retrieval times are retained.

## Archive discovery and corrections to earlier intelligence

The suggested September primary-capture directory was **not found within this workspace** by exact-path check or recursive glob. The secondary report exists at [September intelligence](D:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test/input/kagglecomp/intel_20260930/04-paper-track-intel.md); it was read as a lead, not treated as official evidence. Its inferred odds, judge tastes, low-competition framing and recommended stub submission are unsupported and excluded from factual conclusions.

Newer archived primary captures were found and read:
- [Overview capture](D:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test/research-bcf-paper-bonus-2026-10-2026-10/scratch/paper-overview-2026-11-05.md), official Kaggle page, captured **2026-11-05T20:30:54.850Z**; ARCHIVED-OFFICIAL, not today's live state. It reports 6,775 entrants / 604 participants / 585 teams / 630 submissions. Current metadata counts are different; neither set establishes entry quality or odds.
- [Rules capture](D:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test/research-bcf-paper-bonus-2026-10-2026-10/scratch/paper-rules-2026-11-05.md), official Kaggle page, captured **2026-11-05T20:31:00.296Z**; ARCHIVED-OFFICIAL. Current claims above were reverified from the live public page API, not merely carried forward.

Material changes versus relying on September: precise word counting and PDF-primary judging were clarified October 27; regenerated graphs/traces received scoped follow-up approvals October 27; minor eligibility remains awaiting paper-specific confirmation; the public research landscape is no longer just a few early notebook titles; reported inability to submit two simultaneous writeups is newer than the original conflict-endpoint bug. The September statement that citation authors effectively identify reviewers is unsupported: live citation returns the author list but not their judging assignments.

## Search/scrape evidence quality

The scrape service returned `Too many requests` for bare competition/overview/rules/code and no text for discussion. Documentation scraping returned browser-verification screens. Local unauthenticated HTTP and the site's public read endpoints succeeded for substantive pages/docs; those primary captures supersede scrape/search summaries. No browser challenge was solved or bypassed and no denied data was requested through an alternate credentialed route.

Search queries covered deadline/evaluation, discussion discovery, notebook publishing, and Public Project Link. Search synthesis incorrectly suggested that lack of scrape content meant no evidence the competition existed; live API directly disproves that inference. Another search summary omitted already-published host word-count answers. Third-party search results included https://aiwiki.ai/wiki/gemma_4_developer_agent_competition , https://www.tavondo.com/competitions/kaggle-gemma-4-developer-agent-paper and https://www.aicompetition.dev/en/competitions/kaggle-gemma-4-developer-agent-paper ; none was used as factual authority or independently scraped. Search results are leads, not corroborating primary evidence.

## Evidence files and remaining blockers

All files created in this subtask are scratch research, in [research folder](D:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test/scratch/2026-11-08_BCF_Research). Main raw records: paper-api-pages.json, paper-api-competition-final.json, paper-api-tracks.json, paper-api-settings.json, paper-api-submissionrules.json, paper-api-judges.json, paper-api-citation.json, paper-api-topics-p1.json through p4.json, paper-thread-ID.json, paper-api-code-post-p1.json/p2.json, paper-api-writeups-p1.json, and paper-docs-*.json. Decoded text is derivative; raw JSON retains original Markdown/HTML and reply structure.

Machine-readable [comment audit](D:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test/scratch/2026-11-08_BCF_Research/paper-comments-audit.jsonl) proves per-thread count reconciliation. [Topic inventory](D:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test/scratch/2026-11-08_BCF_Research/paper-topics-inventory.jsonl) retains authors, IDs, exact timestamps and URLs. [Code inventory](D:/stuff/ai-misc/_bsh2026/vscode_project01/46-wide_research_test/scratch/2026-11-08_BCF_Research/paper-code-paper-api-code-post-p1.json-inventory.jsonl) retains version IDs, dates, sources, owners, votes and viewer URLs.

**Blockers to an unqualified 'entire competition scanned' claim:** private pre-close Writeups; unavailable text of two blank comments; untested authenticated editor/bugs; notebook-cell and linked-repository experimental audits not performed. The first two are access/content gaps; the latter two are explicitly unperformed work, not alleged access failures. No submission/publication occurred. No final deliverable or hosted HTML was created.


---

<!-- ====================================================================== -->
<!-- FILE: 05_Quality_Check.md -->
<!-- ====================================================================== -->

# Quality check and limitations

Checked: 2026-11-08 UTC. These documents deliver the completed research, not an implemented BCF agent or a submitted paper.

## Content review

- Preserved the user's name: **Batonic Coding Framework (BCF)**. Corrected an erroneous expansion introduced during drafting.
- Distinguished the proposed external, deterministic mutation gate from a competition-compatible prompt policy. A prompt or YAML declaration alone does not enforce the full BCF constitution.
- Checked paper deadline, rubric, word-count rules, submission mechanics, notebook instructions, and access limitations against the collected paper research.
- Checked the four allowed QAT aliases and tool signatures against current official competition content. Corrected the claim that the older guide proves current runtime enforcement.
- Compared the example `swegemma eval` command against the local harness guide. It is documented, not executed.
- Corrected a speculative explanation for empty graph results: the current public data page lists graph assets for the public tasks.
- Kept community experiment claims separate from official rules and from BCF results. No BCF performance figures are presented as measured.

## Markdown checks

A Python check read the saved Markdown, ignored fenced code, split table cells on unescaped pipes, and checked consistent column counts. The first pass found no inconsistent table rows and no unclosed fences; its only missing local link was this not-yet-created quality report. A final pass is run after saving this file.

The four substantive documents contain 41 tables: 13 in the framework plan, 11 in the paper guide, 10 in the developer reference, and 7 in the detailed inventory. Escaped pipes within technical signatures were handled as cell content rather than column separators.

No Markdown rendering package was installed, and no visual preview was inspected. This is a structural Markdown check, not a claim of pixel-perfect rendering in every viewer. Wide inventory tables may require horizontal scrolling.

## Scope and unresolved items

- The paper inventory preserves the completed scan of public discussion records and public notebook metadata. Notebook cells were not comprehensively reviewed or executed; inaccessible writeups and blank comments remain unavailable.
- The authenticated submission editor, public-sharing workflow, and reported form problems were not exercised.
- Wheel source extraction was blocked by an approval gate. No substitute extraction, package installation, container run, training, or model evaluation was performed in this delivery pass.
- The technical guide is a beginner reference with documented commands and an explicitly unvalidated YAML sketch, not a runtime-certified installation manual.
- Broader academic novelty review is incomplete. BCF is a candidate research contribution, not established novel work.
- Framework and guide documents are supporting research, not a finished 3,000-word competition paper. No fabricated experimental results or submission-ready empirical claims were added.
- Sources and timelines reflect the completed 2026-11-08 research snapshot; no external research was resumed after the user's request to produce the files immediately.
- Links to local scratch evidence depend on retaining that folder. External sources were not re-fetched in this production pass.

## Delivery state

The requested Markdown research documents are saved in this folder. No public notebook, public project, competition entry, or runnable BCF brain has been created; the documents explain how to build and evaluate those next.

