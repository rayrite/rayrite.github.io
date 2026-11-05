# COMBINED MARKDOWN - combine

_Generated 2026-11-05 15:22:42 | 6 files | folder: D:\stuff\docs\taylor_fv\github\rayrite.github.io\cvx\kaggle2\items\combine_

## Contents

1. 00_README-cc-m3max.md
2. 01-verdict.md
3. 02-framework-formalization.md
4. 03-submission-plan.md
5. 04-paper-draft.md
6. 05-quality-check.md

---

<!-- ====================================================================== -->
<!-- FILE: 00_README-cc-m3max.md -->
<!-- ====================================================================== -->

# BCF — the Batonic Coding Framework, narrowed and shipped

**Deliverable for the Kaggle "Google — The Gemma 4 Developer Agent" Paper
Track. Deadline 2026-11-12 23:59 UTC. Built 2026-11-05.**

This folder answers two questions: *is the BCF a good whitepaper topic for
this contest?* and *how do I build a real BCF brain and ground it in actual
results?* — and it answers them with a working artefact, not just an essay.

---

## The short answer

**Submit the mechanism, not the constitution.** All nine clauses of the BCF
constitution are prior art, clause by clause, and the thesis ("every input
generates an output of value") is not falsifiable, so it cannot be a paper's
claim. What survives scrutiny is one narrow conjunction:

> No published system computes a **deterministic, domain-general** risk class
> of a proposed **code diff** and uses it to move a **shared, hard wall-clock
> budget across a multi-task run**, while mechanically enforcing a
> **tree-preserving** invariant over the workspace.

And the shipped measurement of it needs no GPU: replaying the 129 reference
patches through the shipped gate shows a strict gate refusing **46 of 129
(35.7%)** of the benchmark's own reference solutions, and one rule changed
from *deny* to *decompose* restoring all 46 at zero cost in false positives.

---

## What is in here

| Path | What it is |
| --- | --- |
| [`docs/00-verdict.md`](docs/00-verdict.md) | **The answer to question (a).** Why the constitution scores badly, what the competition already contains, the one hole nobody has filled, a projected scorecard, and which prize to aim at |
| [`docs/01-framework-formalization.md`](docs/01-framework-formalization.md) | The full formalisation: risk taxonomy, gate semantics, phase machine, the nine-clause ledger, the three prior-art concessions, the narrowed gap claim, the ablation ladder |
| [`docs/02-submission-plan.md`](docs/02-submission-plan.md) | The seven-day plan. GPU arithmetic against the 30-hour weekly quota, hard cutoffs, the three-arm priority list with abort rules, the five-rung fallback ladder, the risk register |
| [`docs/03-paper-draft.md`](docs/03-paper-draft.md) | **The Writeup draft.** Under the 3,000-word cap, in the rubric's required section order, with every claim tagged `[MEASURED]` or `[PENDING]` |
| [`docs/04-quality-check.md`](docs/04-quality-check.md) | The quality report: table-rendering QC over every table, the test-suite results, the negative controls, and what was *not* checked |
| [`brain/`](brain/) | The BCF brain — the agent bundle the competition takes, with the deterministic gate as its only path to a mutation |
| [`evaluation/`](evaluation/) | The harness: gate validation, corpus statistics, the paired-comparison statistics, the scheduler, the bundle validator, the packager, and the markdown-table QC |
| [`results/`](results/) | The generated measurement report and its machine-readable form |
| [`dist/submission.zip`](dist/submission.zip) | The packaged archive, 11 files, 38,325 bytes |

---

## The brain

The gate is the whole point. The model has **no edit, write or command
tool**; it asks the gate, and the gate answers `allow`,
`allow_with_directive`, or `deny` — always with the rules that fired and a
directive saying what to do instead.

```
brain/
  agent.yaml                     the root agent: model, tools, skills, sub-agents
  eval_config.yaml               the budget: tool calls, wall clock, turns
  configs/sampling.yaml          the generation config
  prompts/system.md              the system prompt, including the call window
  skills/bcf-gate/               the deterministic gate (stdlib-only)
    SKILL.md                       what the model may ask of it, and how
    scripts/bcf_gate.py            the gate itself
    tests/test_bcf_gate.py         51 unit tests
  skills/bcf-verify/             the verification step (stdlib-only)
  sub_agents/                    the locator and the triage agent
```

Two design choices are worth knowing before reading the code.

**Decompose-instead-of-deny.** A binary gate refuses a third of the
benchmark's reference solutions, because the edits are large. The gate
refuses nothing for that reason: it *directs*. The threshold is unchanged;
only the failure mode is different.

**The call-window contract.** Two **absolute** tool-call deadlines — edit by
call 8, stop exploring past call 14 — because the cliff they defend against
is a property of the benchmark, not of the task. The agent reports its own
call count, and the gate floors that report with the number of actions it has
observed itself, so under-reporting cannot buy budget.

---

## Reproducing the numbers

Every command below is safe to run; none of them touches the network or a
GPU.

```bash
# The headline measurement: replay the 129 reference patches through the gate.
# `tasks.jsonl` is the competition's published task set; the path below is
# relative to this folder.
python -I evaluation/gate_validation.py \
  --tasks ../../scratch/bcf-brain-2026-09-29/kaggle_extract/tasks.jsonl \
  --out results

# The gate's own tests.
python -I brain/skills/bcf-gate/tests/test_bcf_gate.py     # 51 tests

# The statistics the paper's online arm will use.
python -I evaluation/test_corpus.py                          # 36 tests
python -I evaluation/harness.py selftest                     # 23 checks
python -I evaluation/scheduler.py selftest                   # 10 checks

# The bundle: validate, then package.
python -I evaluation/validate_bundle.py brain --negative-control
python -I evaluation/package_bundle.py brain --out dist/submission.zip

# The validator's field lists, against the official schema source.
python -I evaluation/check_schema_transcription.py

# The markdown table QC, over every deliverable.
python -I evaluation/qc_tables.py --selftest
python -I evaluation/qc_tables.py docs/*.md README.md

# The paper's word count against the 3,000-word cap.
python -I evaluation/wordcount.py docs/03-paper-draft.md --limit 3000
```

Every one of these exits non-zero on failure, so they can be chained with
`&&`.

---

## What is not done

Stated plainly, because a report that hides its gaps is worth less than one
that names them:

- **The online arm has not been run.** The 40-task paired comparison is
  marked `[PENDING]` in the draft. The GPU quota window that reaches the
  deadline opens Saturday 2026-11-07 00:00 UTC, and there is exactly one
  such window.
- **The bundle has not been compiled by the official `adk-submission`
  compiler.** That package is not installable here, and running code fetched
  from a download is disallowed in this workspace. The local validator
  encodes the compile-time constraints instead, with eight negative controls
  proving it can fail. The exact command to run the real compiler is in
  [`docs/04-quality-check.md`](docs/04-quality-check.md).
- **The prior-art sweep is bounded** by public indexes as of 2026-11-05. It
  reports that it did not find a system implementing the same conjunction; it
  cannot prove none exists.

---

## The critical path

| Date | What happens |
| --- | --- |
| Thu 2026-11-05 → Fri 2026-11-06 | CPU only. The draft is finished with the online section marked `[PENDING]`. **The paper is submittable on Friday evening even if no GPU appears.** |
| Sat 2026-11-07 00:00 UTC | The one reachable quota window opens. Two-task smoke test, then the paired arms. |
| Mon 2026-11-09 12:00 UTC | No new GPU experiment may start after this. |
| Thu 2026-11-10 18:00 UTC | Draft frozen. |
| **Fri 2026-11-11 10:00 UTC** | **Submitted**, with 36 hours of margin. The tie-break for equal scores goes to whoever entered first. |


---

<!-- ====================================================================== -->
<!-- FILE: 01-verdict.md -->
<!-- ====================================================================== -->

# Is the BCF a good whitepaper topic for this contest?

**Verdict: the nine-clause constitution is not. The narrowed mechanism is.**
Submit the mechanism, not the constitution.

The contest is the Kaggle Paper Track for the Gemma 4 Developer Agent, with
a deadline of **2026-11-12 23:59 UTC** — seven days from today. The rubric
scores five criteria, each 0 to 5 and each weighted equally: Novelty,
Quality, Relevance, Verifiability, Clarity. That weighting is the whole
argument. Novelty is only one fifth of the score. A paper that concedes
prior art precisely, measures its own mechanism, and is easy to check beats a
paper that claims a paradigm and cannot support it.

This document answers the question, states what the competition already
contains, and names the one hole that is still open.

---

## 1. Why the constitution as written would score badly

**It is prior art, clause by clause.** The prior-art sweep
(`scratch/bcf-2026-11-05/research/02-prior-art.md`) mapped all nine clauses
onto named, published systems:

| BCF clause | The published system that already does it |
| --- | --- |
| 1 Preserve working code | Standard practice; motivated by arXiv:2507.02976 |
| 2 Risk-gated permission | CASEL (arXiv:2610.36570), Progent (arXiv:2504.11703), GuardAgent (arXiv:2406.09187), CaMeL (arXiv:2503.18813), Claude Code `PreToolUse` hooks |
| 3 Document everything | OpenTelemetry GenAI agent spans; LangSmith, Langfuse, AgentOps |
| 4 LLM-friendly reference | RAG, CodeRAG-Bench, CORE-Bench |
| 5 Search discipline | RepoGraph, CORE-Bench, IAL-Scan (arXiv:2607.01641) |
| 6 Atomic decomposition | AutoCodeRover, SpecRover, spec-kit |
| 7 Clean room | spec-kit; **TLAPS-Bench (arXiv:2611.02849)** already defines clean-room grading |
| 8 Post-mortem | Reflexion, Self-Refine, Voyager, ExpeL, ACE |
| 9 Effort adjustment | BATS, AVA, Bayesian Control, SWE-VERIFIER, BAVAR |

Nine for nine. A reviewer who knows this literature — and a judge panel for a
Google-run contest will — reads a paper claiming the constitution as the
contribution as a re-description, and scores Novelty at 0 or 1.

**The thesis is not falsifiable.** "Every input generates an output of value
no matter how small, so x' is asymptotically greater than x" has no order on
states, no value metric and no limit notion. There is no measurement that
could contradict it, which means there is also no measurement that could
support it. It is not a named concept anywhere in the agent literature. As a
claim it is decorative; as a *paper's* thesis it is a liability.

**It is too big for 3,000 words.** The Writeup cap is 3,000 words and the
required sections are fixed. A paper covering nine clauses, a state machine,
a risk taxonomy, a budget allocator, a loop detector, six invariants and a
value function gets one or two pages on each and makes no claim well. The
paper that wins here is the one with three numbered claims and every number
inline, in the style the field has already settled on.

**Most importantly: it competes in the wrong lane.** The BCF's most
distinctive assets — a deterministic gate, a triage-record schema, a
replayable evaluation harness, a packaged agent bundle — are *artefacts*.
Two of the three prizes are for artefacts.

---

## 2. What the competition already contains

The field is not empty, and it is not slow. Everything below was published
before today and is public on Kaggle.

| Entry | What it claims | How it interacts with the BCF |
| --- | --- | --- |
| **Sourab Ghosh** (2026-10-14) | A prompt-only Gemma 4 31B agent, six rule groups including **edit early by tool call 12**; public leaderboard score **0.13** | **The most direct competitor.** Its "edit by call 12" is the call-window idea, as prompt text. It explicitly disclaims every ablation |
| **bsw0610** | Three claims: BM25 beats every shipped graph policy; two undocumented harness rules break skills; context overflow at 16,384 output tokens | Owns the harness-trap territory. Ships a notebook that recomputes its own tables and **fails if a number does not match** — the model to imitate |
| **navyadevadiga** | "Found the File, Ran Out of Time": an 8-minute budget scored 0.20 on 2026-10-23 and 0.15 on 2026-10-28 | Quantifies the thing that makes the leaderboard unreadable: **noise is about 3 tasks** |
| **pablodiegoo** | The **12-call cliff** (11.1x pass-rate collapse past call 12), the decode law `Δt = 0.78 + 0.0580·c + r`, four silent `swegemma` traps, an operational contract | Owns the cliff and the harness traps. The BCF's call-window contract is built on its measurement, so it must cite it |
| **visuartestudio** | Graph tools add no recall to directed lexical search; BM25 does not improve over grep | Closes the code-graph door. The BCF does not claim graph tooling |
| **Berth** (Jay Patel) | 653 harness-compatible, offline-installable, post-cutoff tasks with the official grader reproduced offline; 209-task recommended headline | **Aimed squarely at the Best New Resource prize.** The BCF's replay benchmark competes here |
| **arXiv:2610.33958** | Graph tools do not help | Corroborates the above |

**The single most important line in that table is Ghosh's.** The BCF's
call-window contract — attempt an edit by call 8, stop exploring past call 14
— is a *deterministic enforcement* of an idea Ghosh already put in a prompt
and scored 0.13 with. That is not fatal; it is the *opportunity*. It means
the idea is known to be worth having, the prompt version is known to be
worthless on its own, and nobody has run the experiment that says which
version works. Ghosh proposed six ablations and ran none.

---

## 3. The hole: six ablations nobody has run

Ghosh's proposed-but-unrun list is the cheapest possible research agenda,
because the competitors have already written it down:

| Proposed by | Ablation | Status in the competition |
| --- | --- | --- |
| Ghosh | Remove "edit by call 12" | **Not run by anyone** |
| Ghosh | Remove bounded one-check-one-repair verification | **Not run by anyone** |
| Ghosh | Enable the three graph tools | Run — by visuartestudio and bsw0610, and it does not help |
| Ghosh | Thinking budget 0 | Run — the 129-task sweep gives 23/129 against 48 to 54 with thinking on |
| Ghosh | Compare against the 60-minute, 100-call default | Partly run — the cap sweep is non-monotone |
| Ghosh | Classify traces by failure mode | **Not run by anyone** |

Two of the five remaining, and both are the BCF's: **does removing the
edit-deadline cost tasks, and does enforcing it in code rather than in
prompt text matter at all?** The second is the A8 control — the
constitution-as-prompt arm. A paper that runs exactly that comparison,
reports both results honestly, and ships the code has a claim nobody else can
make.

The second hole is structural. The competition's budget is **global** — 12
hours for all tasks — while `eval_config.yaml` exposes only a *per-task*
cap. Every entry above uses a single uniform cap. The resolution-versus-time
curve measured on this very task set is **non-monotone**: 37/129 at a 6-minute
cap, 46 at 10, 54 at 15, 49 at 20, 51 at 60. Giving every task more time
stops paying. That is precisely the condition under which a global allocator
has something to do, and no competitor is running one.

---

## 4. The projected scorecard

Honest projections for the narrowed paper, assuming the planned runs land.
These are expectations, not measurements.

| Criterion | Weight | Constitution-as-written | Narrowed mechanism | Why |
| --- | --- | --- | --- | --- |
| Novelty | 20% | 1 to 2 of 5 | 3 to 4 of 5 | The narrowed claim is one conjunction no sweep found covered. It is not a paradigm, and the paper will not claim it is |
| Quality | 20% | 2 of 5 | 4 of 5 | Method is specified, implementable and checked: a replayable offline measurement, a gate with 51 tests, 8 negative controls, a packed bundle |
| Relevance | 20% | 4 of 5 | 5 of 5 | The measured mechanism targets *this* benchmark's protected-file set, its call cliff and its global budget |
| Verifiability | 20% | 3 of 5 | 5 of 5 | The offline result reproduces in seconds with no GPU and no model; the code, the negative controls and the raw numbers are all shipped |
| Clarity | 20% | 2 of 5 | 4 of 5 | Three numbered claims, one number each, a "Reading." paragraph under every table |

The gap between the two columns is entirely Novelty, Quality and Clarity.
That is what narrowing buys, and it is worth about 40% of the score.

---

## 5. Which prize to aim at

The Paper Track awards **$15,000 Best Paper**, **$10,000 Best New Resource**
and **$10,000 Best New Application** — $35,000 in total, and two of the
three are for artefacts rather than papers. This changes the strategy
completely.

| Prize | What it would take | BCF's position |
| --- | --- | --- |
| **Best New Resource** | "a new dataset, tool, or software" | **Strong.** The BCF ships a gate package, a 129-task reference-patch replay benchmark with a fixed baseline, and a validator with its own negative control. Berth occupies the *task dataset* lane, so the differentiator must be that this resource is a *policy replay* with a fixed reference implementation, not a set of tasks |
| **Best New Application** | "a new use-case ... using the code-graphs and/or the provided embeddings" | **Weaker fit than it looks.** The prize wording is explicitly about code-graphs and embeddings, and the evidence says code-graphs do not help (visuartestudio, bsw0610, arXiv:2610.33958). The BCF brain is a working, packaged, testable agent bundle, but it does not use the provided embeddings. Enter it, but do not plan around it |
| **Best Paper** | A rigorous writeup of a well-supported finding, scored on the five rubric criteria | **Possible but hardest.** The bar is set by bsw0610 and pablodiegoo, both of which ship reproducible notebooks. The narrowed paper is competitive only if the online arm actually lands |

**The recommendation: build the application, submit the paper that
documents it, and let the artefact carry the resource and application
prizes.** A paper whose central measurement is *offline, model-free and
reproducible in seconds* has a much better chance of being finished in seven
days than one whose central measurement is a leaderboard sweep that will not
finish before the deadline. And a bundle that runs is worth more than a
bundle that scores.

---

## 6. What would kill it

Stated now, before the work, so that the paper can be written against them.

| Risk | How it shows up | What the paper does about it |
| --- | --- | --- |
| The online arm produces no significant difference | Fewer than 6 net-discordant tasks, which is the exact-McNemar floor for p below 0.05 | The paper reports the offline mechanism measurement as the primary result and the online arm as the secondary one. It does not depend on the online arm landing |
| The gate's benefit is entirely explained by "do not waste calls on tests" | The A2 soft-gate arm matches the hard-gate arm | A2 is in the ladder precisely so this can be answered |
| A competitor has already run the same experiment | Ghosh's six ablations stay unrun, but a 6 November entry could change this | The paper cites every competitor's negative result and names what it adds. A different-mechanism result is a contribution |
| The judge sees the gate as over-engineering | The A8 constitution-as-prompt arm beats the deterministic build | **A8 is reported whatever it shows.** A paper that cannot survive its own strongest objection has not earned the claim |
| The reviewer finds the prior art that invalidates the gap | SecChain's coordinator, TLAPS-Bench's clean-room grading | Both are already conceded in writing in §9 of the formalisation, before the experiment runs |

---

## 7. The recommendation

**Submit.** But submit the narrowed mechanism, and submit the artefact.

1. **The paper's claim is the mechanism**, not the constitution. One
   conjunction: a deterministic, domain-general risk class over a proposed
   code diff, used to move a shared wall-clock budget across a multi-task
   run, while mechanically enforcing a tree-preserving invariant.
2. **The primary measurement is offline.** Replaying the 129 reference
   patches through the shipped gate measures the mechanism directly, with no
   model and no GPU, and it already produces the headline number: a strict
   gate refuses **46 of 129 (35.7%)** of the reference solutions, and
   switching the oversized-edit rule from *deny* to *decompose* restores all
   46. That is 35.7 percentage points of task access bought at zero model
   cost, and it reproduces in seconds.
3. **The online arm is the escalation schedule**, measured with paired
   statistics and reported honestly whether or not it clears the six-task
   significance floor.
4. **The artefact is the application.** The bundle is built, tested and
   packed. It is also the Best New Application entry, and the replay
   benchmark is the Best New Resource entry.

The plan for how to do that in seven days is
[`02-submission-plan.md`](02-submission-plan.md). The draft Writeup is
[`03-paper-draft.md`](03-paper-draft.md). The formalisation, with the
concessions stated in full, is
[`01-framework-formalization.md`](01-framework-formalization.md).


---

<!-- ====================================================================== -->
<!-- FILE: 02-framework-formalization.md -->
<!-- ====================================================================== -->

# BCF: formalization

**Status:** framework specification, 2026-11-05. Written to be falsifiable, not
to be impressive. Every claim here is either measured in this repository,
marked **[PENDING]**, or explicitly withdrawn.

---

## 1. The honest claim

The Batonic Coding Framework began as a nine-clause constitution. Prior-art
work on the framework (see `scratch/bcf-2026-11-05/research/02-prior-art.md`)
shows that eight of the nine clauses map onto named, published systems:
deterministic pre-execution gating (Progent, GuardAgent, CaMeL, Claude Code
`PreToolUse` hooks), per-action consequence classification (CASEL,
arXiv:2610.36570), risk-triggered selective verification for coding agents
(SWE-VERIFIER, arXiv:2610.30284), budget-aware tool use (BATS/AVA, arXiv:2511.17006),
Bayesian cost-sensitive control of coding agents (arXiv:2606.24453), agent
tracing (OpenTelemetry GenAI agent spans), repository graph navigation
(RepoGraph, arXiv:2410.14684), spec-first pipelines (AutoCodeRover,
spec-kit), and verbal post-mortem memory (Reflexion, ExpeL, ACE).

Claiming the constitution as the contribution would be claiming prior art. So
the contribution is narrowed to two claims, each stated so that a
measurement can kill it.

> **Claim 1 — offline, already measured.** Under all-or-nothing per-task
> scoring, a **deterministic, diff-level risk gate** that (i) refuses changes
> to files the harness discards, (ii) **decomposes rather than denies** an
> oversized edit, and (iii) refuses to modify a tree that is already broken,
> converts a measurable fraction of *accessible* tasks into *attemptable*
> tasks at **zero model cost** — and every one of its decisions is
> reproducible without a language model, which makes the mechanism verifiable
> under an evaluation whose end-to-end score is noise-dominated.

> **Claim 2 — online, pending.** Under a fixed, shared wall-clock budget,
> a per-task **deterministic escalation judgement** combined with an
> allocator outside the agent resolves more tasks than a uniform per-task
> cap spends the same budget, because the resolution-versus-time curve is
> non-monotone (§5.3) and therefore a uniform cap spends the tail of a
> global budget on tasks that extra time does not fix.

Measured on the published 129-task task set, the strictest version of the
gate would refuse **46 of 129 (35.7%)** of the reference solutions outright.
Replacing *deny* with *decompose* on the oversized-edit rule restores all
46. That delta — 35.7 percentage points of task access, bought with no
inference — is the result the paper reports, and the ablation that isolates
it is in `evaluation/gate_validation.py`.

The prior-art sweep sharpened both claims and forced three concessions,
which are stated in §9 rather than buried: the clean-room clause belongs to
TLAPS-Bench, the runtime stagnation detector is no longer claimed as novel
because SecChain has one, and "write everything down" is demoted because the
evidence on it is genuinely mixed. Everything else in the constitution is
retained as *design provenance*, and is labelled as such in §9.

---

## 2. The constitution and how each clause is enforced

The framework's first question is not "what should the agent do?" but "what
kind of thing is this clause?" A clause enforced by prompt text is a
suggestion. A clause enforced by code outside the model is a constraint. The
table below is the honest accounting, and it is the table that answers the
reviewer who says "this is prompt engineering".

| Clause | Restatement | Enforcement | Evidence class |
| --- | --- | --- | --- |
| 1 | Preserve working code | **Deterministic code.** Post-edit compile check; the tree is not sound, edits elsewhere are refused. | Measured: 51 gate tests, 8 negative controls |
| 2 | Gated permission with risk determination | **Deterministic code.** `skills/bcf-gate/scripts/bcf_gate.py`, risk classes R0-R4, default-deny at R4. | Measured: replay of 129 reference patches |
| 3 | Document the development process | **Prompt text + schema.** A fixed artifact schema; the triage record is committed per task. | Partly pending |
| 4 | Full developer reference, LLM-friendly | **Prompt text.** Repository-native navigation; no separate index is built. | Weakest clause — see §9 |
| 5 | Binary, breadth-first and depth-first search | **Prompt text + tool contract.** The harness supplies `get_code_neighbors`, `search_similar_code`, `get_code_subgraph`. | Prompt only |
| 6 | Decompose into atomic elements | **Prompt text.** | Prompt only |
| 7 | Clean-room construction from the contract | **Prompt text.** The contract is executable: the hidden `FAIL_TO_PASS`/`PASS_TO_PASS` tests. | Prompt only |
| 8 | Root-cause analysis and post-mortem | **Prompt text + artifact.** A triage record with a falsified hypothesis is a committed artifact. | Partly pending |
| 9 | Effort and thinking-level adjustment | **Deterministic code.** Phase machine over remaining budget; `configs/sampling.yaml` sets `thinking_budget` per phase. | Measured: phase monotonicity test |

**Three of nine clauses are enforced in code. Six are prompt text.** The paper
says this plainly. A reviewer who believes prompt-text clauses are noise is
responding to six-ninths of the framework, and the ablation ladder in §11
tests exactly that.

---

## 3. State machine

One task is one run. The state is the pair *(workspace, budget)*.

```
                 budget exhausted
   ┌──────────────────────────────────────────────┐
   │                                              │
   v                                              │
┌─────────┐   first edit    ┌─────────┐   budget  ┌──────────┐
│ PRODUCE │ ──────────────> │ VERIFY  │ ─────────> │ FINALIZE │
└─────────┘                 └─────────┘            └──────────┘
     │                            │                      │
     │ edit leaves the tree       │ syntax error        │ submit_patch
     │ syntactically invalid      v                      v
     │                      ┌──────────┐            (terminal)
     └────────────────────> │  REPAIR  │
                            └──────────┘
                                 │
                                 │ repaired
                                 v
                            (back to VERIFY)
```

The phase is a **function of the remaining budget share**, not of the model's
discretion. `compute_phase(calls_used, max_calls, state, policy)` is monotone
in remaining budget by construction, and a unit test asserts the monotonicity
rather than trusting it. The agent cannot oscillate between producing and
verifying, because the phase does not depend on what the agent says it wants
to do next.

Phase boundaries (policy defaults):

| Phase | Entered when remaining share | Directive the gate issues |
| --- | --- | --- |
| PRODUCE | above 45% | Locate, edit one file, keep the blast radius small |
| VERIFY | 20% to 45% | Run one targeted test on what changed, then fix or submit |
| FINALIZE | at or below 8% | Submit the best patch; an empty patch scores zero |

The VERIFY phase holds back **20% of the call budget** (`reserved_verify_fraction`),
with a floor of **4 calls** (`min_reserved_calls`) so that a short task still
verifies at least once. This is clause 9 implemented as arithmetic rather
than as advice.

**One absolute override.** The phase boundaries above are *relative* — they
scale with the task's own budget. The call-window contract in §4.4 is
*absolute*, because the cliff it defends against is a property of the
benchmark rather than of the task. Past call 14 the phase machine returns
FINALIZE if a verification has already passed and VERIFY otherwise, regardless
of how much of the task's nominal budget remains. A task with 400 calls left
and 14 spent is still past the cliff.

---

## 4. The gate

### 4.1 Risk classes

| Class | Meaning | Examples | Default |
| --- | --- | --- | --- |
| `R0-read` | Cannot mutate anything | `read_file`, `search_similar_code`, `get_code_neighbors` | allow |
| `R1-probe` | Checkpoint, costs nothing | `get_status`, `submit_patch` | allow |
| `R2-local-edit` | One file, small, inside scope | a two-line edit to `src/app.py` | allow |
| `R3-cross-file` | Touches more than the declared scope, or rewrites a whole file | `write_file` on a 200-line module | direct |
| `R4-blast` | Large, destructive, out-of-workspace, or into a protected path | a 60-line edit; `rm -rf`; `tests/test_x.py` | **deny** |

The classes are ordered, and the order is the policy. The classification is a
pure function of `(action, state, policy)` — no model is consulted, so the gate
cannot be argued into a decision and the same input always yields the same
verdict. That determinism is a **verifiability** property, which matters
because the Kaggle rubric scores Verifiability at 20%.

### 4.2 The rules, and what each one is for

| Rule | Fires when | Purpose | Cost if wrong |
| --- | --- | --- | --- |
| `protected-test-file` | The path matches `tests/`, `testing/`, `test_*.py`, `*_test.py` | The harness resets these before scoring, so an edit there cannot help | Zero on reference work: fires 0/129 times on reference patches |
| `protected-test-config` | The path is `conftest.py`, `pytest.ini`, `pyproject.toml`, `tox.ini`, `setup.cfg` and friends | Same reason; the test runner cannot be reconfigured | Zero on reference work |
| `path-escape` | The path resolves outside the workspace | Containment | Would block legitimate work: never observed |
| `destructive-command` | `rm`, `mv`, `git reset`, `git checkout`, `git clean` | Preserve working code | Would block legitimate work: never observed |
| `large-edit` | The edit region exceeds 40 lines | Keep each mutation independently checkable and revertible | **High.** Denies 35.7% of reference solutions if it is a hard deny |
| `cross-file` | More than two files modified, or an edit outside declared scope | Contain the blast radius | Moderate |
| `whole-file-write` | `write_file` rather than `edit_file` | A rewrite is not an edit | Moderate |
| `integrity-invariant` | The tree is broken and the edit is elsewhere | Clause 1 | Low |
| `no-progress-brake` | An identical action, a repeated failure, or an unchanged workspace | Stop loops | Low |
| `call-window` | The run has spent 8 tool calls with no edit, or 14 calls with no submission | Spend the remaining budget on the fix, not on more discovery | Moderate |

### 4.3 The finding that changed the design

The `large-edit` rule was written as a hard deny, on the reasoning that an
oversized edit cannot be reviewed or reverted independently. Replaying the
129 reference patches through the shipped gate showed that this reasoning is
**wrong for this benchmark**: the reference solutions contain edits that
exceed 40 lines, so a hard deny refuses 46 of 129 tasks — a third of the
benchmark — before the agent has done anything wrong.

The rule was changed from *deny* to *direct*: the gate allows the edit but
issues a directive to split it into independently-checkable pieces. The
measured effect:

| Policy | Tasks denied | Share | Tasks directed |
| --- | --- | --- | --- |
| P0 — no gate | 0 | 0.0% | 0 |
| P1 — naive binary gate | 46 | 35.7% | 0 |
| P2 — BCF, strict | 46 | 35.7% | 0 |
| P3 — BCF, decompose (shipped) | 0 | 0.0% | 46 |
| P4 — BCF, decompose + cross-file direct | 0 | 0.0% | 46 |

A caveat that belongs in the paper rather than in a footnote: the gate sizes an
edit as *the region the agent must reproduce plus the region it must produce*,
so context lines count. Counting only changed lines gives a different
threshold curve, and both are reported in §4.2 of
`scratch/bcf-2026-11-05/analysis/out/gate_validation.md`. The threshold was
chosen a priori at 40; it was **not** tuned on the reference patches, and the
sensitivity table is published so that a reader can see how much the choice
matters.

### 4.4 The productive-window contract

The gate owns two absolute call deadlines. They are not heuristics; they are
the one place where a measured property of the benchmark is written into the
control policy.

| Deadline | Condition | Directive the gate returns |
| --- | --- | --- |
| Call 8 | 8 tool calls spent, no edit attempted | "Make exactly one edit now." |
| Call 14 | 14 tool calls spent, no submission | "Stop exploring. One more edit, one verification, then submit." |
| Call 14 | 14 tool calls spent, a verification already passed | "Call `submit_patch` now." |

The numbers come from a published measurement, not from taste: across 692
paired trajectories over 114 tasks, the pass rate collapses by a factor of
11.1 between call 12 and call 14 — 52.11% pass and 0.74% empty output at 12
calls or fewer, against 4.68% pass and 62.13% empty at 14 or more. 96.33% of
solved repositories finish within 12 calls, and 28.03% of runs at that
boundary produce an empty patch. The wall-clock cost of a call fits
`Δt = 0.78 + 0.0580·c + r` seconds at 17.25 tokens/s with R² = 0.9996, so the
cliff is a budget property, not a modelling artifact.

**Under-reporting cannot buy budget.** The agent supplies its own call count
(`--calls-used`), but the gate floors it with the number of actions it has
itself observed. An agent that claims to be on call 3 while the gate has seen
nine actions is treated as being on call 9.

**Status: measured.** 51 gate tests pass, including negative controls at
threshold minus one and threshold plus one for both deadlines, and a control
that an under-reported call count is floored to the observed count.

---

## 5. The budget allocator

### 5.1 Two budgets, not one

The framework deals with two distinct budgets, and conflating them is the
usual mistake.

| Budget | Scope | Who controls it | Mechanism |
| --- | --- | --- | --- |
| Per-task call budget | One task, one agent run | The phase machine, inside the agent | Reserve formula below |
| Global run budget | Every task in the submission | The allocator, outside the agent | Two-stage escalation schedule |

The per-task reserve answers one question: *how much of what remains goes to
verification?*

```
reserved(calls_left) = max( min_reserved_calls,
                            ceil(reserved_verify_fraction * calls_left) )
verification_window  = calls_left - reserved(calls_left)
```

At the start of a 60-call task, 12 calls are held back. At 20 calls left, 4
are held back and 16 are available for production. The floor matters: a task
with a tiny budget still gets one verification.

This is where clause 9 stops being advice. The agent does not decide whether
to verify; the phase machine does, and the agent is told which window it is
in.

### 5.2 The global budget and the two-stage escalation schedule

The competition's 12-hour submission window is **global**: every task's agent
time is drawn from the same pool, while `eval_config.yaml` exposes only a
per-task cap. That asymmetry is the opening. The schedule is:

```
T  = the total agent-time budget for the submission
τ1 = the cheap first-pass cap for every task
τ2 = the second-pass cap for tasks that failed the first pass
```

- **Arm A, uniform.** Every task gets cap `τ_A`.
- **Arm B, escalation.** Every task gets cap `τ1`. Tasks that fail get one
  second attempt with cap `τ2`. The schedule stops when `T` is exhausted.
- **Both arms get the same `T`.** That is the entire point: `T` is the real
  constraint, and the arm that solves more tasks under the same `T` is the
  one that matters.

**The split is across the agent/scheduler boundary, deliberately.** The agent
sees one task; it cannot see the other tasks and cannot see how much of the
shared budget is left, so it cannot decide which task deserves another pass.
What it *can* produce is a deterministic per-task judgement — the gate's
`escalation` value. The allocator, which runs outside the agent, spends the
global second-pass budget on the tasks whose judgement says more budget would
help. Putting the allocator inside the agent would reduce it to a prompt
instruction, and a prompt instruction cannot reallocate a budget the agent
cannot see.

Implementation: `evaluation/scheduler.py`. It is deterministic — the same
first-pass records and the same budget give the same schedule, because an
allocator whose order changes between runs cannot be compared between arms.
The priority order is `escalate`, `retry-moderate`, `retry-cheap`, `settle`.
Tasks the gate has *settled* are excluded from a second pass on purpose: the
gate is saying more budget did not change the situation, so spending shared
budget there is waste. On a synthetic world where the gate's `escalate`
fires on 80% of the tasks a second pass would fix and 10% of the tasks it
would not, the guided allocation converts 14 of 20 selected tasks, against a
random-allocation mean of 7.33 and a 95th percentile of 10, with the oracle
bound at 20.

**Status: [PENDING online].** The allocator is implemented and self-tested
(10 checks, all passing); the arm comparison needs the GPU run.

### 5.3 Why a uniform cap is a bad way to spend a global budget

This is the empirical premise of §5.2, and it is already measured — not by
this project, but by a community run on the same 129-task dev set with the
31B QAT model on 32 B40s (Kaggle discussion 746250, single run per cell,
fetched 2026-11-05).

| Per-task active-time cap | Resolved / 129 | Share | Session timeouts |
| --- | --- | --- | --- |
| 6 min | 37 | 28.68% | 61 |
| 10 min | 46 | 35.66% | 26 |
| **15 min** | **54** | **41.86%** | 3 |
| 20 min | 49 | 37.98% | 4 |
| 60 min | 51 | 39.53% | 0 |

The curve is **non-monotone**: 54 tasks at 15 minutes, 49 at 20 minutes, 51
at 60 minutes. The source itself states these are single-run observations with
known local scoring limitations and that small differences need repeat
evaluations, so the ordering between 15, 20 and 60 minutes is not itself
established. What the table does establish, robustly, is the shape: **giving
every task more time stops paying.** At 6 minutes 61 of 129 runs time out
outright; at 15 minutes only 3 do; at 60 minutes none do, yet the resolved
count is no better than at 15 minutes. The marginal return on uniform
per-task time is flat or negative over the last stretch, which is exactly the
condition under which a global allocator has something to do.

The same source supplies a second, cleaner fact about **tool calls**, the
quantity the gate actually controls: cutting the tool budget from 50 to 25
cut median runtime by 29% and **cost 14 tasks**. Runtime and task success
are not the same axis, and the framework spends tool calls, not minutes.

**How this framework uses the table.** It does not claim to have discovered
the curve and it does not present the table as its own result. It uses the
curve to fix the *shape* of the intervention — a cheap first pass plus
reinvestment — and then measures the intervention with paired statistics,
which the source explicitly says its own single-run table cannot support.

### 5.4 The published negative result, addressed rather than buried

CASEL (arXiv:2610.36570, CBASE 2026) is the closest prior system and it
reports a result that bears directly on this thesis: at equal compute cost
0.486, its **trajectory-level risk-budget** comparator (`CASEL+Budget`,
λ = 0.02, B_H = 0.08) produced **11.82%** harmful trajectories, against
**7.02%** for CASEL's per-action routing and 70.32% for the unassisted base.
CASEL reports that the budget variant was "dominated along its whole `B_H`
sweep".

Two facts about that comparison decide whether it kills the BCF thesis:

1. **What is compared.** CASEL holds compute constant across methods and
   routes *between intervention modes per action* (execute, verify, sandbox,
   clarify, approve, abstain) within a trajectory. The BCF allocator moves
   budget *between tasks* and *between phases of a task* on a fixed wall
   clock. Different intervention, different level of the budget hierarchy.
2. **Direction.** The CASEL result is *supporting* evidence for the BCF
   design, not a refutation of it: per-action (diff-level) routing beat
   trajectory-level budgeting at equal cost. The BCF allocator makes exactly
   that move one level up — from a trajectory-level budget to a
   task-level budget, routed by a per-diff risk class.

Two caveats must travel with the citation. CASEL's evaluation used 20 seeds
with 40,000 calibration actions and 120,000 test actions per seed, but
**Table 2 rows are means ± 1 SD with no confidence intervals** — the only CI
reported anywhere in the paper is for CASEL against the Uncertainty-Menu
baseline (−7.73 points, 95% CI [−7.87, −7.60]). And the 11.82% and 7.02%
figures are means over runs, not per-run rates.

### 5.5 The weakest novelty position, stated first

Budget reallocation under a constraint is not novel. BATS (arXiv:2511.17006),
AVA, Bayesian Control for Coding Agents (arXiv:2606.24453), SWE-VERIFIER
(arXiv:2610.30284) and BAVAR all allocate budget under a constraint. The BCF
version differs only in that the allocator is driven by a *deterministic
diff-level risk class* rather than a learned score, and in that it allocates
across a *task* boundary rather than within a trajectory. The ablation that
isolates the risk-class term is `A5` in §11; the one that isolates the
cross-task split is `A7`.

---

## 6. The no-progress detector

Three loop shapes, each needing a different recovery:

| Shape | Detection | Recovery directive |
| --- | --- | --- |
| Exact repeat | sha256 of the normalized action, counted in a sliding window of 4 | "This exact action was attempted N times. Do not retry it." |
| Error repeat | Normalised failure signature (line numbers, addresses, durations stripped) | "The same failure recurred. Run a different diagnostic or submit." |
| No change | Workspace digest (path, size, mtime) unchanged across 3 actions | "The workspace is not moving. Make one decisive edit or submit." |

The fingerprints are whitespace-insensitive, so re-running the same command
with different spacing is still the same action.

**Why this is worth claiming.** The published nearest neighbour, IAL-Scan
(arXiv:2607.01641), is a *static* analyser: it inspects agent source code for
feedback paths that can loop without bound. Runtime detectors exist only at
blog level. A deterministic runtime detector is therefore a plausible gap, and
it is one of the few claims in this framework whose payoff does not depend on
model quality — which matters when the model is a 4-bit 31B model and the
end-to-end score is noise.

---

## 7. Invariants

These are the properties that must hold at every point in a run. Each one is
stated so that it can be checked by a program, and the check is shipped.

### INV-1 — Progress-or-Evidence

> For every task, the run commits at least one artifact that is either
> (i) a patch increasing the count of passing tests, or (ii) a triage record
> containing a minimal failing reproduction, a located root cause, and at
> least one falsified hypothesis.

This replaces the framework's original "x' is asymptotically greater than x"
thesis. That thesis, as written, has no order on states, no value metric and
no limit notion, so it cannot be falsified and cannot be measured; a reviewer
would rightly score a paper down for asserting it. INV-1 is the same intuition
with a metric attached, and it is countable, ablatable and falsifiable.

**Status: [PENDING]** — the triage-record schema is specified
(`brain/skills/bcf_verify/`) but not yet measured across a run.

### INV-2 — Never-break-the-tree

> If any file in the workspace fails to compile, the only edits permitted are
> to the file that is broken.

**Status: measured.** 39 unit tests, including the negative control that a
cross-file edit is refused with `integrity-invariant` and the carve-out
control that repairing the broken file is permitted.

### INV-3 — Deterministic gating

> The same `(action, state, policy)` always yields the same verdict, with no
> language model in the decision path.

**Status: measured.** The gate is a pure function; the determinism is
structural rather than statistical, and a test asserts it.

### INV-4 — No silent denial

> Every refusal carries the rule that fired and a directive saying what to do
> instead. No action is denied without an explanation the agent can act on.

**Status: measured.** Every `Verdict` carries `rules_fired` and `directive`;
the CLI exits 3 on a denial and prints the verdict as JSON.

### INV-5 — Budget conservation

> The sum of calls spent in production and in verification never exceeds the
> allocated budget, and the verification reserve is never spent early.

**Status: [PENDING]** — the phase machine is implemented and its monotonicity
is tested, but the reserve ledger is not yet instrumented across a run.

### INV-6 — Machine-readable handoff

> Every committed artifact is serialisable and round-trip parseable, so that
> the next machine's context is at least as informative as the current
> machine's.

This is the defensible form of the original thesis's hand-off clause — "the
output from x' can be handed to another machine capable of generating the next
higher value of output". It borrows its lineage from Agent Contracts
(arXiv:2601.08815), where an agent's output is an interface with declared
resource limits and success conditions.

**Status: [PENDING]** — the schema is specified; round-trip verification over
a run is not yet done.

---

## 8. The value function

To make "every input generates an output of value" measurable, define a value
function over committed artifacts. It is **lexicographic**, so that the
ordering is total and the components are individually checkable:

```
V(a) = ( Δpassing_tests ,
         has_reproduction ,
         has_root_cause ,
         n_falsified_hypotheses ,
         round_trips )
```

| Component | Meaning | Checked by |
| --- | --- | --- |
| `Δpassing_tests` | Increase in the repo's own passing-test count | Running the suite before and after |
| `has_reproduction` | A minimal failing reproduction exists | The record names a command and a failure |
| `has_root_cause` | A location and a mechanism are identified | The record names a file and a symbol |
| `n_falsified_hypotheses` | How many candidate causes were ruled out | The record lists them |
| `round_trips` | The artifact serialises and re-parses | A schema round-trip |

`V(∅) = (0, 0, 0, 0, 0)`. INV-1 asserts `V(a) > V(∅)` for every task, with
the patch branch carrying the strictly larger first component.

The "asymptotically greater" flavour survives in exactly one place, and only
where it is checkable: **the sequence of artifacts handed forward is monotone
in V within a task**, and the count of tasks with a committed artifact is
non-decreasing across the run. That is a statement about a sequence, not an
aesthetic.

---

## 9. What is prior art, stated plainly

Conceding prior art is cheap under a rubric where Novelty is 20% and Quality
plus Clarity are 40%. The sweep behind this section was run against the
primary sources on 2026-11-05, and it found three things that must be
conceded outright rather than worked around.

### 9.1 The clause ledger

| Clause | Nearest prior art | BCF's position |
| --- | --- | --- |
| 1 Preserve working code | Standard practice; motivated by arXiv:2507.02976, which finds more than half of AI-generated patches broken or insecure | **Conceded as motivation, not novelty** |
| 2 Risk-gated permission | CASEL (arXiv:2610.36570) for the classification, Progent (arXiv:2504.11703) for deterministic runtime control, GuardAgent (arXiv:2406.09187), CaMeL (arXiv:2503.18813), Claude Code `PreToolUse` hooks | **Conceded.** BCF contributes the code-diff specialisation and the budget floor |
| 3 Document everything | OpenTelemetry GenAI agent spans; LangSmith, Langfuse, AgentOps, Weights and Biases Weave | **Design provenance, and demoted** — see §9.2.3 |
| 4 LLM-friendly reference | RAG, CodeRAG-Bench, CORE-Bench | **Design provenance, and demoted** — see §9.2.3 |
| 5 Binary, breadth and depth search | RepoGraph, CORE-Bench, IAL-Scan (arXiv:2607.01641) | **Design provenance.** The runtime detector is *not* novel — see §9.2.2 |
| 6 Atomic decomposition | AutoCodeRover, SpecRover, spec-kit | **Design provenance** |
| 7 Clean room | spec-kit; **TLAPS-Bench (arXiv:2611.02849)** | **Conceded** — see §9.2.1 |
| 8 Post-mortem and self-improvement | Reflexion, Self-Refine, Voyager, ExpeL, ACE | **Design provenance** |
| 9 Effort adjustment | BATS (arXiv:2511.17006), AVA, Bayesian Control (arXiv:2606.24453), SWE-VERIFIER (arXiv:2610.30284), BAVAR, SWE-Effi | **Design provenance**, except where the diff-level risk class is the signal |

### 9.2 The three concessions

**9.2.1 The clean-room clause is TLAPS-Bench's, not ours.** TLAPS-Bench
(Cheng et al., submitted 2026-11-02, preprint) defines clean-room grading:
"The final result must be independent of any agent-modifiable tools or
execution environment," implemented by re-verification in a fresh container
that carries over only the submitted task module. The BCF's working-tree
invariant is a different mechanism, but a reviewer will read the two as one
idea. Clause 7 is therefore **conceded** and removed from the novelty claim.
The paper keeps it only as a description of the harness contract.

**9.2.2 The runtime no-progress detector is not novel.** SecChain (ASE 2026
Research Papers, DOI 10.1145/3832783.3837480) is peer-reviewed and uses a
"fully deterministic coordinator" with nested repair loops and a stagnation
detector that terminates the loop on high finding-fingerprint overlap or low
novelty. Terminal-Bench (ICLR 2026) carries a "Futility" rubric — two
consecutive identical failures with no progress — though that one is
LLM-judged rather than deterministic. IBM's futile-cycle detector is ICSE
2026 peer-reviewed and deterministic but offline. PoS (arXiv:2610.01415) is
deterministic with thresholds but *recovers* rather than stops. ProD
(arXiv:2610.19439) is training-time only.

Two honest limits on this concession: SecChain's exact detector thresholds
could not be read, because the ACM Digital Library returned 403 on every PDF
and abstract route and the detector description is available only as a search
snippet; and SecChain's domain is multi-agent security coordination, not
single-agent patch production. The BCF's detector is therefore **not claimed
as novel**. It is claimed as *domain-general and tree-preserving*, and the
paper cites SecChain as the nearest neighbour rather than omitting it.

**9.2.3 "Document everything" is a clause the evidence cuts against.** The
ETH Zürich SRI Lab (Gloaguen, Mündler, Müller, Raychev, Vechev;
arXiv:2602.11988; ICLR 2026 MemAgents Workshop, oral and runner-up best
paper) measured LLM-generated context files on 300 SWE-bench Lite and 138
AGENTbench tasks across four agent-by-model configurations: generated files
hurt in five of eight comparisons, 0.5% on SWE-bench Lite and 2% on
AGENTbench, summarised as **3% on average**, at a cost of **+20% to +23%**
and +2.45 to +3.92 steps, while human-written files gained 4%. That study
used one completion per configuration with no confidence intervals and no
significance tests.

An independent peer-reviewed study (Khatri, REALM 2026, DOI
10.18653/2026.realm-1.5) found a **null** across 288 runs with an equivalence
bound of 10 to 15 percentage points, and attributes the earlier
contradictions to task-band sampling. The paper cites **both**. Resting on
the unreplicated harm number alone would be the wrong call; so would
pretending the question is settled.

### 9.3 The narrowed gap claim

The original claim was: *a deterministic, diff-level risk classifier over a
proposed code change whose output (i) enforces a mechanical never-break-the-tree
invariant and (ii) steers a shared, hard wall-clock budget across a
multi-task run, with a deterministic runtime no-progress detector to stop
unproductive loops.*

Three of those four elements are now conceded to named prior work: the
detector to SecChain, the clean-room framing to TLAPS-Bench, the gate itself
to CASEL and Progent. The claim that survives is narrower and, for that
reason, defensible:

> No published system computes a **deterministic, domain-general** risk class
> of a proposed **code diff** and uses it to move a **shared, hard wall-clock
> budget across a multi-task run**, while mechanically enforcing a
> **tree-preserving** invariant over the workspace.

The qualifying words each do work. *Deterministic* separates BCF from
SWE-VERIFIER's learned scorer. *Domain-general* separates it from SecChain's
security-coordination domain. *Code diff* separates it from CASEL's generic
tool calls. *Cross-task-shared-budget* is the one element no sweep found in
any single system. *Tree-preserving* is the one invariant no sweep found
enforced over the workspace rather than over a trajectory.

### 9.4 What would falsify it

A single published system that (a) computes a risk class of a proposed code
diff, (b) uses it to reallocate a budget across tasks in a multi-task run,
and (c) enforces a workspace-tree invariant, would falsify the claim. The
adversarial sweep for this paper searched for exactly that conjunction and
did not find it — but the search is bounded by what is publicly indexed, and
the paper says so rather than implying the claim is safe.

---

## 10. The measurement plan

Three tiers, with the honest status of each.

| ID | Measurement | Needs | Status |
| --- | --- | --- | --- |
| M1 | Corpus composition, specification adequacy, surface area, budget feasibility | The published `tasks.jsonl` | **Done.** `evaluation/corpus.py`, 129 tasks, 36 unit tests |
| M2 | Gate validation: false positives of candidate policies on reference work | The published `tasks.jsonl` | **Done.** `evaluation/gate_validation.py`, 8 negative controls, 0 failures |
| M3 | End-to-end resolution rate, baseline vs. gate vs. soft-gate | Kaggle inference budget | **[PENDING]** — requires the GPU run |
| M4 | Lower-variance secondary metrics: artifacts committed per task, passing-test delta, triage-record completeness | Kaggle inference budget | **[PENDING]** |
| M5 | Loop-detector precision and recall on real traces | Kaggle inference budget | **[PENDING]** |
| M6 | Budget-allocation ablation in isolation (A5) | Kaggle inference budget | **[PENDING]** |
| M7 | Call-window contract in isolation (A6): median tool calls and empty-patch rate against the published cliff | Kaggle inference budget | **[PENDING]** |

### 10.1 The noise floor, computed rather than asserted

The end-to-end claim is binary per task, so the statistics have to be
computed before the experiment is designed, not after.

| Fact | Value | Consequence |
| --- | --- | --- |
| Public leaderboard size | 58 tasks | 3 tasks is 5.2 points of score |
| Leaderboard score granularity | Truncated to 2 decimal places | Two runs differing by one task can tie |
| Observed leaderboard noise | About plus or minus 3 tasks | An end-to-end delta below 3 tasks is not evidence |
| Exact McNemar, net-discordant tasks needed for p below 0.05 | **6 or more** | A 40-task arm can only detect a 6-task swing |
| Exact McNemar at n = 129 for 80% power | Delta of 0.114 to 0.139 | 15 to 18 extra tasks solved |
| Binomial standard error at n = 129, p = 0.15 | 3.14 points | Removed by re-running the same task set |
| Measured run-to-run standard deviation of the aggregate rate | 0.7 to 1.8 points (SWE-Doctor 5 runs: 2.0, 2.2, 3.4; Bjanarson et al. arXiv:2602.07150: 0.7 to 1.8) | The real limit on what a single sweep can show |
| Paired continuous metric, minimum detectable difference at n = 129 | 0.25 standard deviations | The secondary metric is worth more than the primary |

The McNemar power floor is the single most important number in this
section: **six net-discordant tasks is the minimum for significance.** Any
design that cannot produce six net-discordant tasks is not an experiment,
and the paper says which arms clear that bar and which do not.

This is why M2 exists. It measures the mechanism directly, with no model in
the loop, so the mechanism's contribution is visible even where the end-to-end
score is not. The paper reports M3 with a Wilson interval and an exact
paired McNemar test across arms, reports M4 as the lower-variance secondary
signal, and pre-registers the primary comparison.

### 10.2 The external baseline the run is measured against

The single-run dev-set results in §5.3 (discussion 746250) are the comparison
point the paper quotes as an external baseline, not as its own result: 48 to
54 of 129 resolved depending on configuration, with the 15-minute cap at 54.
A BCF arm that lands inside that band has not demonstrated anything
end-to-end; a BCF arm that exceeds it must do so against a *paired* control
on the same tasks, not against this table.

---

## 11. The ablation ladder

Each rung removes one component and re-measures.

| ID | Variant | Removes | Answers | GPU cost |
| --- | --- | --- | --- | --- |
| A0 | Baseline agent, no gate, no phase machine | Everything BCF | What does the framework buy over a competent agent? | 1 run |
| A1 | + phase machine only | The gate | Does clause 9 alone help? | 1 run |
| A2 | + gate in soft mode (annotates, does not refuse) | The gate's enforcement | Does the *refusal* matter, or only the advice? | 1 run |
| A3 | + gate in hard mode (shipped) | — | The headline comparison | 1 run |
| A4 | + no-progress detector | The loop brake | Do loops actually happen, and do they cost tasks? | 1 run |
| A5 | + budget reallocation | The risk-driven reserve | The term CASEL's negative result bears on | 1 run |
| A6 | + call-window contract | The productive-window deadlines | Does the cliff-facing deadline actually buy tasks? | 1 run |
| A7 | + cross-task escalation schedule | The global allocator | Does splitting the budget across tasks beat a uniform cap? | 2 runs |
| A8 | Constitution text only, no deterministic code at all | — | **The attack-1 control.** If the constitution-as-prompt beats the deterministic components, the deterministic components are the problem, and the paper says so | 1 run |

### 11.1 Which rungs fit in one allowance

Nine rungs do not fit in one weekly GPU allowance, and pretending otherwise
would be the first dishonest thing in the paper. The reachable set is:

| Priority | Rungs | Rationale |
| --- | --- | --- |
| Required | A0, A3 | Without a baseline and the shipped configuration there is no comparison at all |
| Required | A8 | The strongest objection to the whole framework; a paper that omits it invites the reviewer to raise it |
| Preferred | A6 | Cheapest high-value rung: the call-window contract targets a published, quantified cliff, so even a modest effect is interpretable |
| Preferred | A7 | The only rung that tests the thesis that is actually claimed in §5 |
| If quota allows | A2, A4, A5, A1 | Each isolates one term; all four are reported as *not run* if the quota does not reach them |

The paper reports the rungs that ran, marks the rungs that did not, and does
not extrapolate from the rungs that ran to the ones that did not.

### 11.2 The control that must not be omitted

A8 is the most important rung and the most likely to be unflattering. It is
in the ladder because a paper that cannot survive its own strongest objection
has not earned the claim. The constitution text — nine clauses, no executable
code — is exactly what a reader could write in an afternoon, and if it
matches the deterministic implementation then the implementation is
decoration.

### 11.3 The offline arm

One more measurement needs no GPU and should run regardless: replay the
reference patches through the shipped gate. That is M2, it is already done,
and it is the reason the framework's cost is known to be zero on legitimate
work before a single token is spent.


---

<!-- ====================================================================== -->
<!-- FILE: 03-submission-plan.md -->
<!-- ====================================================================== -->

# The seven-day plan to a submitted Writeup

**Deadline: 2026-11-12 23:59 UTC.** Today is Thursday 2026-11-05. That is
six working days and two nights, and the plan below is built around that
rather than around what would be ideal.

The plan is written so that the **paper is submittable on 2026-11-10**, with
two clear days of margin. The online experiment is treated as an improvement
to a paper that is already complete, never as a prerequisite for one.

---

## 1. The hard cutoffs

| Date | Cutoff | Why |
| --- | --- | --- |
| **2026-11-05** (today) | Quota window ends **Sat 2026-11-07 00:00 UTC**. Treat the current allowance as **0 usable hours** until the counter says otherwise | The only quota window that reaches the deadline starts Sat 2026-11-07. If today and tomorrow are the old window, there is nothing to run until Saturday |
| **2026-11-07 00:00 UTC** | GPU quota resets. The **one** fresh 30-hour allowance becomes reachable | A failed experiment cannot be re-run after 2026-11-13, because the next reset is after the deadline |
| **2026-11-09 12:00 UTC** | **No new GPU experiment may start** | A 12-hour session started at noon on the 9th ends at midnight on the 10th, leaving no time to analyse it |
| **2026-11-10 18:00 UTC** | The Writeup draft is **frozen**. Only corrections, word-count trimming and the optional public notebook link remain | Drafting is the slow part for a first paper, and a writer's block is already the stated risk |
| **2026-11-11 12:00 UTC** | The Writeup is **submitted**, with 36 hours of margin | Kaggle's own advice is to enter early, and the tie-break for equal scores is **entered first**. Margin also absorbs a Kaggle outage |
| **2026-11-12 23:59 UTC** | Absolute deadline. Draft Writeups are not considered | Per the rules |

**The margin is not paranoia.** 628 submissions and 583 teams are already
entered with seven days to go, and a late submission is a non-submission.

---

## 2. The GPU arithmetic

This is the part that decides what the experiment is, so it is done before the
plan rather than during it.

### 2.1 The quota

| Fact | Value | Source |
| --- | --- | --- |
| Weekly GPU quota | 30 hours, resetting **Saturday 00:00 UTC** | Kaggle docs, "Efficient GPU Usage Tips" |
| L4x4 burn rate | **2x** quota per wall-clock hour | Competition Overview, Upgraded Accelerators |
| T4x2 burn rate | 1x | same |
| Notebook session cap | **12 hours** | competition rules |
| Reachable windows before the deadline | Sat 2026-11-07 00:00 → Sat 2026-11-14 00:00 — the deadline falls **inside** it | timeline arithmetic |

So: **exactly one fresh allowance is reachable**, and the next reset is after
the deadline.

| Accelerator | Quota burn | Wall clock from 30 quota-h | Sessions (12 h cap) | Planning number with a 30% haircut |
| --- | --- | --- | --- | --- |
| L4x4 (4x24 GB) | 2x | 15 h | 2 (12 h + 3 h) | **8 to 10 h** |
| T4x2 (2x16 GB) | 1x | 30 h | 3 (12 + 12 + 6) | **15 to 20 h** |
| CPU only | 0 | 12 h per session | — | unlimited-ish |

**The ambiguity to settle in the first 30 minutes of GPU time.** The quota
page lumps "T4x2 and P100" together at 1x even though they have different GPU
counts, which implies Kaggle counts **per machine-session-hour**, not per
GPU-hour. If it is per GPU-hour, L4x4 yields only 7.5 h instead of 15 h.
Settle it empirically: read the quota counter in Kaggle Settings before and
after a one-hour session and see what it drops by. Plan against the stricter
reading until then.

**The single highest-leverage decision.** If the 31B QAT checkpoint (16 to
18 GB of W4A16 weights, 32,768-token context) fits on **T4x2 = 32 GB**, the
quota burn drops from 2x to 1x and the number of experiments doubles. The
official starter notebook already contains the tensor-parallel logic
(`tp_size = 4 if gpu_count >= 4 else (2 if gpu_count >= 2 else 1)`), so a
30-minute T4x2 trial answers it. **Do this first, on Saturday morning.**
The fallback is the 12B, which the starter notebook itself defaults to, fits
comfortably, and is a legitimate documented choice — all four checkpoints
(E2B, E4B, 12B, 31B) are permitted by the live competition page.

### 2.2 What one arm costs

The cost model charges 3.0 search calls, 1.0 read and 1.0 test call per file
touched, one edit call per 30 added lines, and 1.0 submit call. The measured
median task runtime on this task set is about 6 minutes at the competition's
best configuration, and pablodiegoo's operational contract completes all 120
hidden tasks in 8.54 hours — 10.67 hours with a 1.25x tail load.

| Experiment | Wall clock | Quota-h on L4x4 | Quota-h on T4x2 |
| --- | --- | --- | --- |
| Full 129-task sweep, 31B, ~3.4 min/task | 7.5 to 9 h | 15 to 18 | 7.5 to 9 |
| Full 129-task sweep, 31B, ~6 min/task | 13 to 14 h | over the session cap | 13 to 14 |
| 40-task subset, 31B, ~6 min/task | 4.2 h | 8.4 | 4.2 |
| 40-task subset, 31B, 1.25x tail load | 5.3 h | 10.6 | 5.3 |
| Full 129-task sweep, 12B, ~2 to 3 min/task | 4.5 to 6.5 h | 9 to 13 | 4.5 to 6.5 |
| **Gold-patch validation, 129 tasks, no LLM** | **1 to 2 h** | **0** | **0** |
| Replay and all statistics | minutes | 0 | 0 |

**Two arms of 40 tasks with the 31B do not fit in one L4x4 session with
margin** (10.6 quota-h against 15 available, but the session cap is 12 h and
the tail load is uncertain). Two arms of 40 tasks on T4x2 fit comfortably
(10.6 of 30 quota-h).

### 2.3 The resulting design

**The experiment that fits, in priority order, with the abort rule attached:**

| Order | Experiment | Tasks | Model | Wall clock | Abort rule |
| --- | --- | --- | --- | --- | --- |
| 1 | **A3 vs A0** — shipped BCF against a plain agent | 40 stratified | 31B on T4x2 if it fits, else 12B | ~10.6 h | Drop to 30 tasks if the first arm is behind schedule at T−4 h |
| 2 | **A8** — constitution as prompt, no deterministic code | same 40 | same | ~5.3 h | Run only if arm 1 finished with 2 h to spare |
| 3 | **A7** — escalation schedule against a uniform cap | same 40 | same | ~10.6 h | Run only if the quota counter still shows 8 h; otherwise it is an offline simulation over the arm-1 traces, which is free |

The stratification is over the four repositories in proportion to their share
of the 129: fastapi 67, rich 48, requests 13, httpx 1. A 40-task stratified
subset is 21 fastapi, 15 rich, 4 requests, and 1 httpx — the httpx task must
be included, because a single task from a repository is a repository-level
result and dropping it is dropping a data point.

### 2.4 Why the endpoints are not the resolve rate

The exact McNemar test needs **6 net-discordant tasks** for p below 0.05.
On 40 paired tasks that means a 15-point swing in the resolve rate, which is
larger than most plausible gate effects. **The resolve rate is therefore a
secondary endpoint, and the paper says so in advance.**

The primary online endpoint is the pair of metrics the cliff directly
predicts, both of which are proportions over *all* runs rather than over
solved runs, and both of which therefore have far more statistical power:

| Endpoint | What it measures | Why it has power |
| --- | --- | --- |
| **Empty-patch rate** | Fraction of runs that submit nothing | The published cliff says 28.03% of trajectories emit an empty patch and the rate is 62.13% past call 14. The gate's call-window contract targets exactly this |
| **Median tool calls** | Calls used per task | Directly measured, continuous, and the quantity the deadline is written against |
| **Resolve rate** | Tasks passed | Binary, low-power, reported with a Wilson interval and an exact paired McNemar test |

The offline replay result remains the paper's primary result. It has no
model in it, it reproduces in seconds, and it does not need the GPU.

---

## 3. The three phases

### Phase 1 — CPU only, Thursday 2026-11-05 to Friday 2026-11-06

Everything that does not need a GPU, and everything that must be done before
the writeup can be drafted. This phase is also the phase that survives a
complete GPU failure.

| Slot | Task | Output |
| --- | --- | --- |
| Thu 14:00 to 15:00 | Gold-patch validation of all 129 dev tasks, as a CPU-only Kaggle notebook | The environment ceiling: how many tasks the stock grader can pass at all. This is the number every online result is compared against |
| Thu 15:00 to 16:00 | Re-run the gate replay after every gate change; confirm 8/8 negative controls | `results/gate_validation.md`, regenerated |
| Thu 16:00 to 17:00 | Freeze the gate. No more behaviour changes after this point | A gate that changes after the measurements is a gate whose measurements are about a different gate |
| Thu 17:00 to 19:00 | Write the paper's Abstract, Introduction, Methods, Results (offline), Related works | `03-paper-draft.md`, offline sections complete |
| Fri 09:00 to 11:00 | Prepare the notebook that will run the online experiment, so Saturday is a launch and not a build | The notebook is committed and reviewed before any quota is spent |
| Fri 11:00 to 13:00 | Draft the online-results section as a template with every number marked **PENDING**, so Saturday only fills cells | The draft is complete with holes in it |
| Fri 13:00 to 15:00 | Write the Related Works section: every competitor named, every prior-art concession stated | §9 of the formalisation, condensed |
| Fri 15:00 to 18:00 | **Read the whole draft aloud.** Cut anything that does not earn its place | The draft drops below 3,000 words with room to spare |
| Fri 18:00 to 20:00 | Publish the gate bundle and the replay benchmark as a public artefact | The Best New Resource entry, and the Verifiability criterion |

**Phase 1 exit criterion: a complete 3,000-word Writeup with the online
section marked PENDING.** If the GPU never arrives, this is submittable on
Friday evening.

### Phase 2 — GPU, Saturday 2026-11-07 to Monday 2026-11-09

| Slot | Task | Output |
| --- | --- | --- |
| Sat 00:00 | Quota resets. Read the counter. **Record the number** | A number in the log, not a memory |
| Sat 00:15 to 01:00 | 30-minute T4x2 trial: does the 31B fit at `max_model_len=32768`? | The quota multiplier question and the model-fit question, answered together |
| Sat 01:00 to 01:30 | Run a 2-task smoke test end to end | Two real trajectories. If the harness, the bundle or the gate is broken, this is where it shows, for the cost of 17 quota-minutes |
| Sat 01:30 to 12:00 | **Arm A0** on 40 tasks | A JSONL trace per task |
| Sat 12:00 to 22:30 | **Arm A3** on 40 tasks | A JSONL trace per task |
| Sat 22:30 to 23:30 | Run the statistics: paired per-task table, Wilson intervals, exact McNemar, empty-patch rate, median tool calls | `evaluation/harness.py` over the two arms |
| Sun 00:00 to 06:00 | **Arm A8** if the quota allows and the analysis is clean | The strongest objection, answered |
| Sun 06:00 to 12:00 | **Arm A7** if the quota allows; otherwise simulate the escalation schedule over the arm-1 traces, offline | Either a measured comparison or an explicitly-labelled offline one |
| Sun 12:00 to 18:00 | Fill the online sections of the draft. Re-run every QC | The draft with numbers |
| Mon 09:00 to 12:00 | Re-read the draft against the rubric, criterion by criterion | A scorecard |

**The online section has a word budget, and it is not negotiable.** The
draft is at **2,770 words** against a **3,000-word cap**, so §4.3 replaces a
115-word placeholder with a table and its reading paragraph and has **about
230 words** to work with. The plan for that section is therefore a table of
paired outcomes plus a short reading paragraph, not three tables and a
discussion. `evaluation/wordcount.py` is the check, and it is run on every
edit, not on Friday night.

**Phase 2 exit criterion: the draft with numbers, whether or not they are
significant.** A negative or null online result is a reportable result, and
the paper reports it either way.

### Phase 3 — Freeze, Thursday 2026-11-10 to Friday 2026-11-11

| Slot | Task |
| --- | --- |
| Thu 18:00 | Draft frozen. |
| Thu 18:00 to 20:00 | Table QC over every table in the draft. Word count. Check every citation resolves to a primary source. |
| Thu 20:00 to 22:00 | Publish the public notebook. Verify it loads without a login. |
| Fri 09:00 to 10:00 | Final read. Fix only what is wrong. |
| **Fri 10:00 to 10:30** | **Submit.** Not later than noon. |
| Fri 10:30 to 12:00 | Verify the submission appears in the writeups list and is not a draft. Screenshot the confirmation. |
| Fri onward | If time remains, upload the arXiv-ready PDF as the Public Project Link. This is additive and can be done after submission. |

---

## 4. The fallback ladder

Each rung is a complete, submittable paper. The plan moves down the ladder
only when a rung is unreachable, never because a rung looks inconvenient.

| Rung | Condition | What the paper becomes |
| --- | --- | --- |
| **0** | All planned runs land and A0, A3, A8, A7 all complete | The full paper: offline mechanism plus a four-arm online study |
| **1** | A0 and A3 complete, A8 and A7 do not | The offline mechanism plus a two-arm online study. The writeup reports two arms and marks the others not run |
| **2** | The online run is truncated or the arms are not comparable | The offline mechanism, the end-to-end failure taxonomy derived from whatever traces exist, and an explicit statement that the paired comparison was not completed |
| **3** | The GPU never becomes available | The offline paper. The mechanism is measured on real reference patches with a shipped gate, the replay benchmark and the negative controls. **This is still a complete paper** and it still has a novelty claim |
| **4** | Even the offline work is incomplete | The framework specification and the artefact, entered for Best New Resource and Best New Application rather than Best Paper |

**Rung 3 is a real paper, not a consolation prize.** The offline result —
a strict gate refusing 35.7% of reference solutions, and decompose-instead-of-
deny restoring all of them — is a measurement of a mechanism on real work,
reproducible in seconds by a reader with no GPU. That is a strong
Verifiability and Quality score, which is 40% of the rubric.

---

## 5. The submission mechanics

**What a valid submission is.** A Kaggle Writeup with: title and subtitle,
abstract, introduction, description of the research including methods and
experiments, and related works with citations. Scope is **3,000 words
maximum**. The research must be original and unpublished. Submission does
not prevent later submission to a conference.

**Optional, and worth doing.** A public notebook in the Project Links field,
publicly accessible without a login, carrying the gate package and the
replay benchmark. And an arXiv-ready PDF via the Public Project Link. Both
are additive to the Writeup and both raise Verifiability.

**The three prizes, and what to aim at.** $15,000 Overall Best Paper,
$10,000 Best New Resource, $10,000 Best New Application. The rubric wording
for Best New Application is explicitly about code-graphs and the provided
embeddings, which the evidence says do not help; enter the application but do
not plan around it. The resource lane — a replayable policy benchmark with a
fixed reference implementation — is the better fit.

**The tie-break is real.** "In the event of a tie, the Paper that was entered
first to the Competition will be the winner." Submitting early is worth more
than submitting two minutes later with a better title.

**Judging.** Ten named Google judges. The rubric is not shared with
participants, so there is no feedback loop to optimise against. The only
lever is the five criteria.

---

## 6. The risk register

| Risk | Likelihood | Impact | Mitigation | Owner |
| --- | --- | --- | --- | --- |
| The GPU run does not finish in the session | Medium | Medium | The offline paper is complete before Saturday; the rung-1 and rung-2 papers need only one arm | You |
| The 31B does not fit on T4x2 | Medium | Low | The 12B is permitted and is the starter notebook's own default; state the model choice | You |
| The gate or bundle has a defect that only appears in the harness | Medium | High | The 2-task smoke test on Saturday costs 17 quota-minutes and finds it before the 40-task run | You |
| The online effect is not significant | **High** | Low | The paper pre-registers the resolve rate as secondary and the empty-patch rate as primary; a null is reported as a finding | You |
| The draft exceeds 3,000 words | Medium | Medium | The template structure with fixed section budgets; cut on Friday afternoon, not at the deadline | You |
| Writer's block | **High** | High | The draft is assembled from parts that are already written: the formalisation, the replay report, the prior-art ledger. The Friday 15:00 read-aloud is the deadline for cutting, and the 10:00 Friday submission is absolute | You |
| A competitor publishes the same experiment first | Low | Medium | The competition's own entries are the ones to beat, and their gaps are named. Cite them and state what the paper adds | You |
| The prior-art sweep missed something that invalidates the gap claim | Low | **High** | The gap claim is already narrowed to a conjunction. A reviewer finding one more paper narrows it further rather than killing it | You |

---

## 7. The one-page summary

- **Submit the mechanism, not the constitution.** The nine-clause framework
  is prior art clause by clause; the narrowed claim is not.
- **The primary result needs no GPU.** Replaying 129 reference patches
  through the shipped gate: a strict gate refuses 35.7% of the reference
  solutions, and decompose-instead-of-deny restores all 46.
- **The GPU is one allowance, one weekend.** The online arm is a two-arm
  paired comparison on 40 stratified tasks, with the resolve rate as the
  secondary endpoint and the empty-patch rate as the primary one.
- **Freeze on Thursday, submit on Friday morning.** 36 hours of margin, and
  the tie-break goes to whoever entered first.


---

<!-- ====================================================================== -->
<!-- FILE: 04-paper-draft.md -->
<!-- ====================================================================== -->

# A Deterministic Risk Gate for Patch-Producing Agents: Decompose, Do Not Deny

**Measuring what a pre-execution gate costs on real reference patches, and
steering one shared wall-clock budget across a multi-task run**

*Draft for the Kaggle Writeup. 3,000-word limit. **[MEASURED]** = produced by
the code in this submission, reproducible without a GPU. **[PENDING]** = the
arm has not been run; the text marks what replaces it.*

---

## Abstract

Agent frameworks increasingly place a deterministic gate between the model
and the repository: classify the proposed action, then allow, direct, or
refuse it. Two things about that gate are usually left unstated: what it
costs on *legitimate* work, and what happens when it refuses something that
was going to be correct anyway. We measure the first on the public 129-task
dev set, and change the second by making the gate's failure mode
**decomposition** rather than **refusal**. A strict gate refuses 35.7% of the
benchmark's reference solutions — because the edits are large, not because
the agent misbehaved — and one rule changed from *deny* to *decompose*
restores all of them, with no false positives.

**TL;DR — four claims.**

- **C1 [MEASURED].** A strict pre-execution risk gate refuses **46 of 129
  (35.7%)** of the reference solutions for this benchmark, before the agent
  has done anything wrong. Switching the single oversized-edit rule from
  *deny* to *decompose* restores all 46: **0 of 129** refused, 46 directed.
  Refusal here is a policy choice, not a property of the patch.
- **C2 [MEASURED].** The gate's other rules cost **nothing** on legitimate
  work: the protected-file rules fire **0 of 129** times across 278
  reference-patch files, while the same rules block the 282 test files and
  11,344 test lines the harness discards before scoring. A gate can be
  simultaneously free and load-bearing.
- **C3 [MEASURED].** The gate is a pure function of `(action, state,
  policy)`. The same input yields the same verdict with no model in the
  decision path, so all of C1 and C2 reproduce in **seconds** on a laptop,
  with 51 unit tests and 8 negative controls shipped alongside.
- **C4 [PENDING].** Under a fixed *shared* wall-clock budget, a per-task
  deterministic escalation judgement combined with an allocator outside the
  agent resolves more tasks than a uniform per-task cap spends the same
  budget.

C1 and C2 are the paper's result. C4 is the extension, and the text below
marks exactly where its numbers go.

---

## 1. Introduction

An agent that writes patches fails in a characteristic way: it spends its
budget on discovery and arrives at the wall with nothing to submit. Two
responses are common. *Budget discipline* — a prompt telling the model to
edit early and verify once — is cheap and unmeasured. *Budget allocation* —
a scorer deciding where to spend extra sampling or verification — is
expensive and contested.

A third response is less popular: **decide, before the tool runs, whether
the change should happen at all, and decide it deterministically.** The
object is a proposed code change, not a generic tool call, and the decision
is a pure function rather than a model output.

A risk gate is usually described by what it blocks. We describe it by what it
**refuses**, and the distinction matters: a gate written as a binary
allow/deny classifier refuses **35.7%** of the benchmark's reference
solutions — not because the agent misbehaved, but because the edits are
large.

The fix is not to weaken the gate. It is to change what a refusal *means*.
Instead of "this edit is too large, so it does not happen", the gate says
"this edit is too large, so split it into independently checkable pieces, and
do it now". We call this **decompose-instead-of-deny**, and the measured
effect is the paper's headline: every one of the 46 refusals becomes a
directive, and the gate's cost on legitimate work falls to zero.

---

## 2. Definitions and boundaries

| Term | Definition here | What it is **not** |
| --- | --- | --- |
| **Risk gate** | `verdict = f(action, state, policy)`, evaluated before a mutation tool runs. Returns `allow`, `allow_with_directive`, or `deny` | Not a learned scorer; not a prompt; not a probability |
| **Risk class** | `R0-read`, `R1-probe`, `R2-local-edit`, `R3-cross-file`, `R4-blast`, from the action's shape and the workspace state | Not a probability. The ordering *is* the policy |
| **Reference solution** | The source-side patch from an upstream pull request in the public task set | Not a model output. The ground truth a correct agent approximates |
| **Legitimate work** | The per-file source edits that make up a reference solution | Not test files. The harness supplies and resets those |
| **Directive** | The alternative action a gate names when it withholds approval | Not a warning. It is executable instruction |
| **Decompose-instead-of-deny** | An oversized edit is permitted with a directive to split it | Not a weaker threshold. The threshold is unchanged |
| **Call window** | Two absolute tool-call deadlines: edit by call 8; stop exploring past call 14 | Not a per-task fraction. Absolute, because the cliff is a property of the benchmark |
| **Shared budget** | One wall-clock allowance covering every task | Not a per-task cap. This asymmetry is the competition's actual constraint |

**Boundaries.** One benchmark's task set and one harness. No claim about code
agents in general beyond the specificity argued in §6, and no new model,
training method, or search algorithm.

---

## 3. Description of the research

### 3.1 The gate

The gate is the **only** path to a mutation. The model has no edit, write or
command tool; it asks the gate, and the gate answers with a verdict and, when
it withholds approval, a directive.

**Risk classes.** `R0-read` (cannot mutate) and `R1-probe` (cheap,
checkpointing) are allowed. `R2-local-edit` — one file, small, inside the
declared scope — is allowed. `R3-cross-file` touches more than the declared
scope or rewrites a whole file; it is allowed with a directive. `R4-blast` is
large, destructive, out-of-workspace, or into a protected path; it is denied.
The classification is a pure function of `(action, state, policy)`; no model
is consulted, so the gate cannot be argued into a decision.

**The rules that matter here.** A protected-path rule refuses test
directories, `test_*.py` / `*_test.py`, `.pth` files, pytest and tox
configuration, and the harness's own stub files — the exact list is in the
artefact and is derived from the harness rather than hard-coded by hand. A
destructive-command rule refuses `rm`, `mv`, `git reset`, `git checkout`,
`git clean`. An integrity rule refuses edits outside a file that is already
broken, with a carve-out permitting the repair itself. A `large-edit` rule
fires when the edit region exceeds 40 lines.

**Decompose-instead-of-deny.** The `large-edit` rule is the one that is
`allow_with_directive` rather than `deny`. Its directive names the
decomposition: make the change as independently checkable pieces. Every other
`R4-blast` denial still denies.

**No silent denial.** Every verdict carries the rules that fired and a
directive saying what to do instead. A refusal with no alternative is a dead
end for the agent, and is treated as a bug.

### 3.2 The call-window contract

The gate also owns two **absolute** tool-call deadlines — the one place where
a measured property of the benchmark is written into the control policy.

The motivation is a published measurement on this very task set: the pass
rate collapses by a factor of 11.1 between call 12 and call 14 — 52.11% pass
and 0.74% empty output at 12 calls or fewer, against 4.68% pass and 62.13%
empty at 14 or more, with 96.33% of solved repositories finishing within 12
calls. Wall-clock cost fits a near-linear law in the call count with R² =
0.9996, so the cliff is a budget property, not a modelling artifact.

The gate therefore requires an attempted edit by call 8, and past call 14 it
directs the agent to stop exploring: one more edit, one verification, then
submit. The gate floors the agent's self-reported call count with the number
of actions it has observed itself, so under-reporting cannot buy budget.

### 3.3 The budget allocator

The competition's submission window is **global** — one wall-clock allowance
for all tasks — while the configuration exposes only a *per-task* cap. That
asymmetry is the opening.

The agent sees one task and cannot see the rest, so it cannot decide which
task deserves another pass. What it can produce is a deterministic per-task
judgement: the gate's `escalation` value. The allocator, running outside the
agent, spends the global second-pass budget on the tasks whose judgement says
more budget would help, and excludes the tasks the gate has *settled* —
where more time demonstrably changed nothing.

**Arm A** gives every task the same cap. **Arm B** gives every task a cheap
first-pass cap, then one second pass with a larger cap to the tasks that
failed, stopping when the shared budget is exhausted. **Both arms receive the
same total budget.** That is the whole comparison.

### 3.4 The artifact contract

Every task ends with a committed artefact: either a patch, or a triage
record containing a minimal failing reproduction, a located root cause, and
at least one falsified hypothesis. The record is schema-validated on write,
so a malformed record is rejected with the offending field named. This turns
an unfalsifiable claim — that every input yields an output of value — into a
countable one.

---

## 4. Results

### 4.1 What the gate sees on reference work

Replaying the 129 reference patches through the shipped gate. No model is
involved.

| Measure | Value |
| --- | --- |
| Reference patches touching a protected file | 0 of 129 |
| Files across all reference patches | 278 |
| Source files whose edit region exceeds 40 lines | 107 of 278 |
| Test files across all upstream pull requests | 282 |
| Test lines added by the upstream pull requests | 11,344 |
| Test files the protected-path patterns do not catch | 0 |

**Reading.** The harness applies the test-side of each upstream pull request
itself, after resetting every test file and test-runner configuration. So a
reference solution contains no protected file, and the protected-path rules
fire **zero** times on legitimate work — no false positives. Meanwhile those
pull requests added 282 test files and 11,344 test lines that an agent would
have to write and that the harness would throw away. The rules are free and
load-bearing at once: they spend no budget on real work, and stop an agent
spending its budget on edits that cannot affect its score.

### 4.2 The cost of refusing

A policy *denies a task* when it would refuse at least one of the legitimate
per-file source edits that make up the reference solution.

| Policy | Tasks denied | Share | Tasks directed |
| --- | --- | --- | --- |
| P0 — no gate | 0 | 0.0% | 0 |
| P1 — naive binary gate | 46 | 35.7% | 0 |
| P2 — BCF, strict | 46 | 35.7% | 0 |
| P3 — BCF, decompose (**shipped**) | **0** | **0.0%** | 46 |
| P4 — BCF, decompose plus cross-file as direct | 0 | 0.0% | 46 |

**Reading.** This is the central result. A binary gate refuses a third of
the benchmark's reference solutions — 46 tasks — not because the agent
misbehaved but because the edits are large. Switching one rule from *deny*
to *decompose* restores all 46 at zero cost in false positives: the work is
not refused, it is decomposed and directed. **Refusal was a policy choice,
not a property of the patch.** The 40-line threshold was fixed before the
replay and not tuned on it; the full sensitivity curve from 10 to 200 lines
under two edit-sizing definitions ships with the artefact.

### 4.3 The online arms — [PENDING]

**Reading.** [This section is replaced by the paired 40-task comparison
between Arm A (uniform cap) and Arm B (escalation schedule) at equal shared
budget, with per-task paired outcomes, a Wilson interval on the resolve rate,
an exact paired McNemar test, and the empty-patch rate and median tool
calls as the lower-variance secondary endpoints. The exact McNemar test
requires **6 or more net-discordant tasks** for p below 0.05, which is why
the resolve rate is reported as secondary and the cliff-facing metrics as
primary. The arms are marked not run rather than left blank.]

---

## 5. Related works and citations

Conceding prior art precisely is cheaper than being caught conceding it
badly, and in this area the concessions are large.

| BCF-style clause | Nearest published work | Our position |
| --- | --- | --- |
| Pre-execution gating | Progent (arXiv:2504.11703), GuardAgent (arXiv:2406.09187), CaMeL (arXiv:2503.18813), Claude Code `PreToolUse` hooks — deterministic, default-deny privilege control | **Conceded.** The gate mechanism is not ours |
| Risk classification of an action | CASEL (arXiv:2610.36570) — model-independent per-action consequence scoring | **Conceded.** The *classification* is CASEL's. We differ in the object (a code diff), in determinism, and in what the output buys |
| Budget reallocation | SWE-VERIFIER (arXiv:2610.30284), BAVAR, Bayesian Control (arXiv:2606.24453), BATS (arXiv:2511.17006) | **Conceded.** Ours differs only in being driven by a deterministic diff-level class and in allocating *across tasks* |
| Clean-room construction | TLAPS-Bench (arXiv:2611.02849) — defines clean-room grading: a result independent of any agent-modifiable tool | **Conceded in full.** A different mechanism, the same idea |
| Runtime stagnation detection | SecChain (ASE 2026, DOI 10.1145/3832783.3837480) — a deterministic coordinator with nested repair loops and a stagnation detector; Terminal-Bench (ICLR 2026) — a "Futility" rubric; IBM's futile-cycle detector (ICSE 2026) | **Conceded.** We do not claim the runtime detector as novel |
| LLM-generated context files | ETH Zürich SRI Lab (arXiv:2602.11988) — ~3% average loss at +20% cost; Khatri (REALM 2026, DOI 10.18653/2026.realm-1.5) — a **null** across 288 runs | **Both cited.** The evidence is mixed, so we claim nothing here |

**The gap that survives** is a conjunction, and it is narrow: no published
system we found computes a **deterministic, domain-general** risk class of a
proposed **code diff** and uses it to move a **shared, hard wall-clock budget
across a multi-task run**, while mechanically enforcing a **tree-preserving**
invariant over the workspace. Each qualifier excludes a specific piece of
prior work, and each is checkable.

**The closest negative result is on our side of the ledger.** CASEL, at equal
compute, reports its *trajectory-level* risk-budget comparator at **11.82%**
harmful trajectories against **7.02%** for per-action routing. Trajectory-level
budgeting lost to per-action budgeting at equal cost; our allocator makes the
same move one level up, from a trajectory-level budget to a task-level one
routed by a per-diff class. (CASEL's Table 2 rows are means ± 1 SD over 20
seeds, with **no confidence intervals**.)

**The competition's own prior art matters too.** Ghosh's 2026-10-14 prompt-only
agent scores **0.13** on the public leaderboard and explicitly disclaims
every ablation it proposes — including "remove edit by tool call 12". The idea
that the edit deadline is load-bearing is public; the experiment that
establishes it is not. Our call-window contract (§3.2) is its deterministic
form, and §4 measures it.

---

## 6. Limitations

**Scope.** One task set, one harness, one model family. The gate's rules
encode this harness's protected-file set; on a different harness that set
must be re-derived, and we ship the derivation as a check rather than
hard-coding it.

**The online result may be null.** The offline mechanism is measured on real
reference patches and does not depend on the model. The end-to-end
comparison may not clear the significance floor of six net-discordant tasks
on a 40-task paired design. A null there is a reportable finding about
prompt-level budget discipline, and we will report it as one.

**Determinism is not accuracy.** A pure function is reproducible, not
correct. The gate's taxonomy is hand-specified; a learned one might rank
better while being irreproducible. We chose reproducibility because an
evaluation whose end-to-end score is noise-dominated cannot support a claim
about the scorer.

**The prior-art sweep is bounded.** It searched public indexes as of
2026-11-05. It cannot prove that no published system implements the same
conjunction; it can only report that it did not find one.

**Generality.** The mechanism — a deterministic classifier whose refusal mode
is decomposition rather than denial, applied to the shape of a proposed
change — is stated independently of this benchmark, and §4.2's measurement
protocol (replay reference patches through a policy, count refusals on
legitimate work) transfers to any repository and any harness. The specific
numbers do not.

---

## 7. Conclusion

A pre-execution risk gate is usually evaluated by what it prevents. We
evaluated one by what it refuses, on the reference solutions of the benchmark
it is meant to work on, and found that a strict gate refuses **35.7%** of
correct work for reasons that have nothing to do with the agent. Changing
one rule's failure mode from *deny* to *decompose* removed every one of
those refusals and left the false-positive count at zero.

The gate remains deterministic, still the only path to a mutation, and still
costs nothing on legitimate work. It now has a measured effect that
reproduces in seconds, without a GPU, with the negative controls shipped
alongside.

---

## References

CASEL, arXiv:2610.36570. Progent, arXiv:2504.11703. GuardAgent,
arXiv:2406.09187. CaMeL, arXiv:2503.18813. SWE-VERIFIER, arXiv:2610.30284.
Bayesian Control for Coding Agents, arXiv:2606.24453. BATS, arXiv:2511.17006.
TLAPS-Bench, arXiv:2611.02849. SecChain, ASE 2026, DOI 10.1145/3832783.3837480.
Terminal-Bench, ICLR 2026. ETH Zürich SRI Lab, arXiv:2602.11988. Khatri,
REALM 2026, DOI 10.18653/2026.realm-1.5. arXiv:2507.02976. Agent Contracts,
arXiv:2601.08815. IAL-Scan, arXiv:2607.01641. The competition's own prior
art: Ghosh (2026-10-14), bsw0610, navyadevadiga, pablodiegoo, visuartestudio,
Berth, and arXiv:2610.33958.


---

<!-- ====================================================================== -->
<!-- FILE: 05-quality-check.md -->
<!-- ====================================================================== -->

# Quality check

**Scope: every deliverable in this folder, checked 2026-11-05.** This report
states what was checked, how each check was shown to be capable of failing,
and — just as importantly — what was **not** checked and what the reader
should therefore not assume.

The governing rule for everything below: a check that has never failed
proves nothing, so every checker here ships a negative control, and a check
that cannot fail is reported as untested rather than as passing.

---

## 1. Summary

| # | What was checked | How | Result |
| --- | --- | --- | --- |
| 1 | Markdown table rendering, all deliverables | `qc_tables.py`, 20-check self-test | **0 issues** in 48 tables / 287 rows |
| 2 | The gate's own behaviour | 51 unit tests | **OK** |
| 3 | The statistics the online arm will use | 36 unit tests | **OK** |
| 4 | The paired-comparison harness | 23 self-test checks | **OK** |
| 5 | The budget scheduler | 10 self-test checks | **OK** |
| 6 | The validator's field lists against the official schema | AST comparison + 4-case self-test | **OK**, 33 fields agree |
| 7 | The bundle against the harness's compile-time rules | 15 checks + 11 negative controls | **OK**, 1 warning |
| 8 | The packaged archive | staged-tree validation, then zip | **OK**, 11 files, 38,325 bytes |
| 9 | The paper against the 3,000-word cap | `wordcount.py` | **2,770** prose words |
| 10 | The paper's numbers against the shipped artefact | every figure read back from `results/` | **all reproduce** |

---

## 2. Markdown table rendering

This was an explicit instruction, so it is checked mechanically rather than
by eye. `evaluation/qc_tables.py` parses each markdown file the way a
GitHub-Flavored Markdown renderer does, and reports **48 tables / 287 rows /
0 issues** across the six documents in this folder.

### 2.1 What "free from formatting and alignment defects" means here

A table QC that only checks column counts and delimiter alignment will pass a
table that renders as a fragment plus a stray paragraph. There are four cell
hazards in GFM, and each fails differently:

| Hazard | What the renderer does with it | Why a column-count check misses it |
| --- | --- | --- |
| Raw newline inside a cell | Splits one logical row into two physical lines. The second is not a pipe-row, so the table **ends there** and the tail renders as loose prose | The tail is not a row, so there is no column count to mismatch |
| Raw `\|` inside a cell | Adds a column | It *does* change the count — but only for rows that contain one, so a per-table column count taken from the first row misses it |
| Bare `<`, `>`, `&` | Read as HTML; the rest of the cell is swallowed | The cell still has the right number of pipes. Nothing about the structure changed |
| Stray backtick | Opens a code span that runs to the end of the cell | Same: the structure is intact, only the rendering is wrong |

The checker therefore follows the renderer's order of operations, not its
own convenience:

1. **Fenced code blocks are removed first.** A pipe table inside a fence is
   not a table.
2. **A row is split into cells at the BLOCK level, before any inline
   parsing.** A `\|` inside a code span still splits the cell. Escaping it
   as `\|` is the only fix, and `\|` inside a code span is accepted as
   already escaped.
3. **Inside a cell, code spans are then scanned.** A run of N backticks opens
   a span and the next run of exactly N closes it; a run of a different
   length is literal content. The state is therefore `open_run = None | N`,
   **not a stack** — a stack mis-handles a shorter run nested in a longer
   one.
4. **Only what remains outside code spans is checked** for `<`, `>` and `&`.
   A code span's contents render literally, so an `&` inside one is
   harmless.

Two details that a naive implementation gets wrong, and that this one had to
be corrected for:

- **HTML tag names are case-sensitive and lowercase.** `<Section 5>` — a
  cross-reference in prose — is *content*, not a tag. The first version of
  this checker used a case-insensitive tag pattern and flagged every
  section cross-reference in the formalisation. The fix was to make the
  pattern case-sensitive, because `section` really is a GFM tag name.
- **Entities are not defects.** `&amp;` is correct GFM, so the scanner masks
  autolinks, GFM tags and HTML entities before looking for a bare `&`. Two
  positive-control cases were added at the same time, so that correct
  entities cannot be mistaken for a false positive.

### 2.2 The checker's own controls

The checker's self-test is 20 checks: **8 known-bad tables that must be
caught**, **10 known-good tables that must produce zero issues**, and one
clean document and one broken document end to end. All 20 pass.

That distribution matters. An eight-case bad-only control certifies a broken
checker — all four of the bugs described above passed such a control when
this checker was first written. The ten good cases are there to catch the
opposite failure, a checker that flags correct tables.

### 2.3 Per-file result

| File | Tables | Rows | Issues |
| --- | --- | --- | --- |
| `docs/00-verdict.md` | 6 | 35 | 0 |
| `docs/01-framework-formalization.md` | 15 | 88 | 0 |
| `docs/02-submission-plan.md` | 11 | 66 | 0 |
| `docs/03-paper-draft.md` | 4 | 25 | 0 |
| `docs/04-quality-check.md` | 10 | 59 | 0 |
| `README.md` | 2 | 14 | 0 |
| **Total** | **48** | **287** | **0** |

---

## 3. The code

| Suite | What it covers | Result |
| --- | --- | --- |
| `brain/skills/bcf-gate/tests/test_bcf_gate.py` | The gate's risk classification, its rules, its directives, and the call-window contract | **51 tests, OK** |
| `evaluation/test_corpus.py` | The Wilson interval, the exact McNemar test, the paired-difference statistics | **36 tests, OK** |
| `evaluation/harness.py selftest` | The run collector and the paired comparison | **23 checks, OK** |
| `evaluation/scheduler.py selftest` | The escalation scheduler | **10 checks, OK** |

The scheduler's self-test prints its headline number directly: guided yield
14, against a random mean of 7.331 (p95 10, max 14) and an oracle of 20.
That is the mechanism the allocator in §3.3 of the paper relies on, measured
rather than asserted.

---

## 4. The bundle

### 4.1 The validator

`evaluation/validate_bundle.py` enforces the compile-time constraints that
were established from the official schema and the official harness README.
It runs **15 checks** over the bundle.

One check is stronger than a plain YAML load: it **rejects duplicate keys**.
PyYAML silently keeps the last value for a duplicated mapping key, so a file
with two `name:` keys loads without complaint and compiles into something
nobody intended. That is exactly the kind of defect that is invisible to a
naive loader.

Two checks were added during this QC pass, and both are worth naming because
each closes a way for the bundle to be wrong in a way that compiles:

| Check | What it catches | Why it is an error and not a warning |
| --- | --- | --- |
| `unknown-tool` | A tool name outside the nine the harness registers | The registry is closed, so the name raises `ToolNotFoundError` before the agent runs |
| `mutation-path-outside-gate` | A direct `write_file`, `edit_file` or `run_command` | It *compiles*, and then quietly defeats the gate. The gate is the only path to a mutation in this bundle by design; a direct write tool would mean the measurements and the paper describe an agent that is not the one that ran |

The second check applies to the sub-agents as well as the root agent. Both
sub-agents declare only read-only tools, and now that is enforced rather
than merely intended.

### 4.2 The validator's negative controls

**11 deliberate breakages, all 11 caught.** A checker that reports "OK" on a
deliberately broken bundle is not checking anything.

| # | Breakage | Caught as |
| --- | --- | --- |
| 1 | Duplicate key in a YAML file | `duplicate-key` |
| 2 | Unknown key in `agent.yaml` | `unknown-agent-key` |
| 3 | Skill frontmatter name does not match its directory | `skill-name-mismatch` |
| 4 | Underscore in a skill name | `skill-name-mismatch` |
| 5 | Forbidden key in the generation config | `generation-config-forbidden` |
| 6 | Silent `eval_config` typo inside the evaluation block | `eval-config-unknown` |
| 7 | Budget key beside the evaluation block | `eval-config-stray-top-level` |
| 8 | Disallowed file extension | `disallowed-extension` |
| 9 | A tool the harness does not register | `unknown-tool` |
| 10 | A mutating tool declared directly | `mutation-path-outside-gate` |
| 11 | A mutating tool on a sub-agent | `mutation-path-outside-gate` |

### 4.3 The schema transcription

The validator's field lists — 20 for the agent config, 10 for the generation
config, 3 for the thinking config — are **transcriptions** of the official
schema, and a transcription can drift from its source. So the transcription
is checked against the source.

`evaluation/check_schema_transcription.py` reads
`evaluation/reference/adk_schema.py` — the `adk_submission/schema.py` module
from the competition's `adk-submission` wheel — and **parses it with `ast`**.
It is never imported and never executed: downloaded code is read as text and
handed to the parser, which is the only safe way to inspect it.

All **33 field names agree**, and `extra="forbid"` is confirmed to be in
force for all three models, directly or inherited from `_BaseAgentFields` —
which is the rule the validator's unknown-key check rests on.

This checker has a **4-case self-test**: a claim with one field too many, a
claim missing one real field, a claim that is a subset, and an empty claim.
All four are caught. Without it, a comparison that compared nothing would
print "RESULT: OK".

### 4.4 The archive

`evaluation/package_bundle.py` stages the bundle into a temporary directory,
**drops** everything the harness would reject, validates the **staged** tree
(the one that ships, not the one on disk), and only then writes the zip.

| Property | Value |
| --- | --- |
| Files in the archive | 11 |
| Archive size | 38,325 bytes |
| Unpacked size | 117,144 bytes (limit 3,221,225,472) |
| Dropped | `skills/bcf-gate/scripts/__pycache__/bcf_gate.cpython-312.pyc` |
| Staged-tree validation | **OK**, 0 errors, 0 warnings |

### 4.5 The one warning, and why it is a warning

The **source** tree carries a `__pycache__` directory left behind by a local
test run. Its `.pyc` suffix is on the harness's rejected list, so it must not
be in the archive — and it is not, because the packager drops it.

Reporting it as an *error* in the source tree would train the reader to
ignore errors, which is the failure mode a warning tier exists to prevent.
So the validator has two severity tiers: `--for-archive` (anything the
harness rejects is an error) for the staged tree, and the default (a hygiene
warning) for the source tree. The file is left on disk rather than deleted,
because this workspace does not delete files without the user naming the
target.

---

## 5. The paper

### 5.1 Word count

`evaluation/wordcount.py` counts two ways: every word in the file, and the
same minus the reference list.

| Count | Words | Limit | Headroom |
| --- | --- | --- | --- |
| Prose (everything, including tables and references) | **2,770** | 3,000 | 230 |
| Body (excluding the reference list) | **2,697** | 3,000 | 303 |

**The 230-word headroom is the budget for §4.3.** When the online arms land,
that section replaces a 115-word placeholder with a table and its reading
paragraph. **If the section grows past about 230 words, the paper goes over
the cap and something else must be cut.** The online section's budget should
be planned, not discovered on Friday night.

### 5.2 The numbers

Every figure in the paper was read back from the artefact that produces it,
not copied from a draft. The check is mechanical: `results/gate_validation.json`
is regenerated by `evaluation/gate_validation.py`, and each number in §4.1
and §4.2 of the paper is a field in that file.

| Paper's number | Source field | Value |
| --- | --- | --- |
| 46 of 129 refused (35.7%) | `policies/P1-naive-binary/tasks_denied` | 46, of 129 |
| 0 refused after decomposition | `policies/P3-bcf-decompose/tasks_denied` | 0 |
| 46 directed | `policies/P3-bcf-decompose/tasks_directed` | 46 |
| 0 reference patches touch a protected file | `waste/tasks_with_protected_content` | 0 |
| 278 files across all reference patches | `total_source_files` | 278 |
| 107 of 278 over the 40-line threshold | `large_source_files` | 107 |
| 282 test files | `test_patch/files_total` | 282 |
| 11,344 test lines | `test_patch/added_lines` | 11,344 |
| 0 test files escape the protected-path patterns | `test_patch/files_not_caught_by_protected_patterns` | 0 |
| 8 negative controls pass | `results/gate_controls.json` | 8/8 |

The threshold-sensitivity curve (10 to 200 lines, two edit-sizing
definitions) that §4.2 of the paper refers to is generated by the same
script and is in `results/gate_validation.md`.

---

## 6. What was **not** checked

This is the part of the report that matters most.

### 6.1 The official compiler never ran

**The bundle has never been compiled by `adk-submission`.** The package is
not on public PyPI, and running code fetched from a download is disallowed in
this workspace, so the local validator encodes the compile-time constraints
instead.

What that means in practice:

| Checked locally | Not checked locally |
| --- | --- |
| Every field name in the three schema models, against the official schema source | That pydantic accepts the *values* — for example that `top_p: 0.95` satisfies the schema's own bounds, not just that the key exists |
| The nine tool names, against the registry the harness builds | That `compile_submission()` resolves them in the competition's scoring image |
| The archive-level limits: sizes, counts, extensions | That `!include` resolves the same way in the real loader |
| Duplicate keys, which PyYAML hides | The host-side wiring: `tool_registry`, `model_registry`, `code_executor`, `limits`, `generation_constraints`, `adapter_manifest` — all supplied by the organiser, not by the submission |

Two things were checked by hand against the official source and are
recorded here so they are not lost:

- The bundle's `!include` tags are `prompts/system.md` and
  `configs/sampling.yaml` — both relative, neither containing `..`, and
  `system.md` contains no nested `!include` (nested includes are not
  supported inside an included `.md`).
- The bundle uses `thinking_budget: 2048`, which is valid under both
  `adk-submission` 0.2.11 and 0.2.12. The two versions differ in exactly
  one place — 0.2.11 rejects `thinking_budget: 0`, 0.2.12 allows it — and
  the bundle is unaffected either way.

**The command to run the real compiler, in an environment where
`adk-submission` is installed:**

```bash
pip install "google-adk>=1.34.0,<2.0"
pip install <path-to-adk_submission-0.2.11-py3-none-any.whl>

python - <<'PY'
from pathlib import Path
from adk_submission.discovery import validate_directory
from adk_submission.yaml_loader import load_yaml
from adk_submission.schema import SandboxedLlmAgentConfig

bundle = Path("brain")
validate_directory(bundle)                                  # archive-level limits
for cfg in [bundle/"agent.yaml", *sorted(bundle.glob("sub_agents/*.yaml"))]:
    doc = load_yaml(cfg)                                    # the sandboxed !include loader
    SandboxedLlmAgentConfig.model_validate(doc)             # the schema the compiler enforces
    print("ok:", cfg)
PY
```

`adk-submission` is not on PyPI. The competition's version (0.2.11) and a
later public mirror (0.2.12) are available in the wheel's source at
`github.com/happyc0der/gemma-swe-agent` (`harness/official/`) and
`github.com/shreyanshcode-web/kaggle` (`gemma4_agent/_inspect/`) respectively.
**Which of the two the scoring image uses is not verified.** Nothing in the
bundle depends on the difference.

### 6.2 The online arm has not run

The 40-task paired comparison in §4.3 of the paper is marked `[PENDING]`. No
GPU has been spent. The offline result does not depend on it, but the paper
is not complete until it is either run or reported as not run.

### 6.3 The bundle has never been executed by the harness

No trajectory has been produced by the real `swegemma` loop. The gate's
behaviour has been measured against reference patches and unit-tested, but
the end-to-end path — model calls the skill, the skill edits the workspace,
the harness captures the patch — has not been exercised. The Saturday smoke
test is where that first happens, and the plan budgets 17 quota-minutes for
it precisely because this gap exists.

### 6.4 The prior-art sweep is bounded

It searched public indexes as of 2026-11-05. It reports that it did not find
a system implementing the same conjunction. It cannot prove that none exists,
and the paper says so in §6.

---

## 7. Reproducing this

```bash
# Every check in this report, in order.
python -I evaluation/qc_tables.py --selftest
python -I evaluation/qc_tables.py docs/*.md README.md
python -I brain/skills/bcf-gate/tests/test_bcf_gate.py
python -I evaluation/test_corpus.py
python -I evaluation/harness.py selftest
python -I evaluation/scheduler.py selftest
python -I evaluation/check_schema_transcription.py --selftest
python -I evaluation/check_schema_transcription.py
python -I evaluation/validate_bundle.py brain --negative-control
python -I evaluation/package_bundle.py brain --out dist/submission.zip
python -I evaluation/wordcount.py docs/03-paper-draft.md --limit 3000
python -I evaluation/gate_validation.py \
  --tasks ../../scratch/bcf-brain-2026-09-29/kaggle_extract/tasks.jsonl \
  --out results
```

Each of these exits non-zero on failure, so they can be chained with `&&`.

